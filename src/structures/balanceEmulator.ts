import SerialPort from 'serialport';

import type { PortInfo, BaseBinding } from 'serialport';

import { getIdentifierFromPort } from '../utils';

import type { BalanceManager } from './balanceManager';
import type { BalanceId } from './balanceId';
import type { ReadingData } from '../types';
import type { IMockBinding } from '../types/serialport/bindingMock';

const MockBinding: typeof IMockBinding = require('@serialport/binding-mock');

/**
 * @description Debug tool mocking the balance to output data without the need of the real one.
 * @warning Don't use this in another environment than debug or testing.
 */
export abstract class BalanceEmulator {
  public manager: BalanceManager;

  public portIds: Partial<PortInfo>[];

  protected emittingData: Buffer;

  protected loopIntervals: Array<ReturnType<typeof setInterval>> = [];

  public constructor(portIds: Partial<PortInfo>[], manager: BalanceManager) {
    this.portIds = portIds;
    this.manager = manager;

    this.emittingData = Buffer.from('T2BN0           0,060 kg      0,00 N1     0,00 E');
  }

  /**
   * Start the emulation of the balances.
   */
  public async connect() {
    SerialPort.Binding = MockBinding as unknown as BaseBinding;

    SerialPort.prototype.pipe = function pipe(event) {
      this.addListener('data', (data: Buffer) => event.emit('data', data));
      return this;
    };

    this.manager.addListener('connect', (balance) => {
      const emitData = () => (balance.serialPort.binding as any).emitData(this.emittingData);

      emitData();
      const interval = setInterval(() => {
        if (!balance.serialPort) {
          clearInterval(interval);
        } else {
          emitData();
        }
      }, 200);

      this.loopIntervals.push(interval);
    });

    this.portIds.forEach(async (port) => {
      MockBinding.createPort(port.path, {
        vendorId: port.vendorId,
        productId: port.productId,
        record: true,
      });
    });

    await this.manager.start();
  }

  /**
   * Set the internal emittingData property.
   */
  public async setEmittingData(data: string): Promise<void>;
  public async setEmittingData(data: Buffer): Promise<void>;
  public async setEmittingData(data: ReadingData): Promise<void>;
  public async setEmittingData(data: ReadingData | string | Buffer) {
    if (typeof data === 'string') {
      this.emittingData = Buffer.from(data);
      return;
    }

    if (data instanceof Buffer) {
      this.emittingData = data;
      return;
    }

    const { weight, price, total } = data;

    const emittingData = this.emittingData.toString();
    const readingData = this.manager.currentBalance.match(emittingData);
    this.emittingData = Buffer.from(emittingData
      .replace(readingData.weight, weight.toFixed(3))
      .replace(readingData.price, price.toFixed(2))
      .replace(readingData.total, total.toFixed(2)));
  }

  /**
   * Execute the close method from the current serialPort stream.
   */
  public async disconnectBalance() {
    return this.manager.currentBalance.serialPort.close();
  }

  /**
   * Delete a balance from the portsMap.
   * @warning if the manager re-starts you'll have to remove it again.
   */
  public async removeBalance(balance: BalanceId) {
    const { identifiers } = this.manager.portsMap;

    return this.manager.portsMap.delete(getIdentifierFromPort(identifiers, balance.port));
  }

  /**
   * Add a balance to the portsMap.
   * @warning if the manager re-starts you'll have to add it again.
   */
  public async addBalance(balance: BalanceId) {
    return this.manager.portsMap.add(balance);
  }

  /**
   * Disconnect the emulator clearing all loopIntervals.
   */
  public async disconnect(): Promise<void> {
    this.loopIntervals.forEach((loop) => clearInterval(loop));
    this.loopIntervals = [];
  }
}
export default BalanceEmulator;
