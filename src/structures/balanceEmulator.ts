import SerialPort, { Binding } from 'serialport';

import type { PortInfo, BaseBinding } from 'serialport';

import { getIdentifierFromPort, randomInterval } from '../utils';

import modelsData from '../data/models.json';

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

  protected _emittingData: Buffer | typeof modelsData = modelsData;

  protected loopIntervals: Array<ReturnType<typeof setInterval>> = [];

  public constructor(portIds: Partial<PortInfo>[], manager: BalanceManager) {
    this.portIds = portIds;
    this.manager = manager;
  }

  public get emittingData() {
    return this._emittingData;
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
      const emitData = () => {
        if (!balance.serialPort.isOpen) {
          return;
        }

        if (this._emittingData instanceof Buffer) {
          (balance.serialPort.binding as any).emitData(this._emittingData);
          return;
        }

        const { model } = balance.balanceId;
        const modelData = this._emittingData[model].samples;
        const toEmitData = modelData[randomInterval([0, modelData.length - 1])];

        (balance.serialPort.binding as any).emitData(Buffer.from(toEmitData.data));
      };

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
      this._emittingData = Buffer.from(data);
      return;
    }

    if (data instanceof Buffer) {
      this._emittingData = data;
      return;
    }

    const { weight, price, total } = data;

    const emittingData = this._emittingData.toString();
    const readingData = this.manager.currentBalance.match(emittingData);
    this._emittingData = Buffer.from(emittingData
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
   * Disconnect the emulator clearing all loopIntervals and restoring the default binding.
   */
  public async disconnect(): Promise<void> {
    this.loopIntervals.forEach((loop) => clearInterval(loop));
    this.loopIntervals = [];

    SerialPort.Binding = Binding;
  }
}
export default BalanceEmulator;
