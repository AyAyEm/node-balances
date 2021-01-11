import SerialPort from 'serialport';

import { BalanceEmulator } from '../structures';
import { balancePorts } from './balances';

const MockBinding = require('@serialport/binding-mock');

SerialPort.prototype.pipe = function pipe(event) {
  this.addListener('data', (data: Buffer) => event.emit('data', data));
  return this;
};

/**
 * @description Debug tool mocking the balance to output data without the need of the real one.
 * @warning Don't use this in another environment than debug or testing.
 * @example // typescript
 * const port: Partial<PortInfo> = { productId: 'testing', path: '/dev/ROBOT', vendorId: 'teste' };
 * const manager = new VidPidBalanceManager([{ balanceModel: 'uranoPop', portId: port }]);
 * const emulator = new GenericEmulator(manager);
 * emulator.start();
 *
 * manager.addListener('reading', (data) => {
 *   console.log(data);
 * });
 *
 * manager.addListener('error', (error) => {
 *   console.log(error);
 * });
 */
export class GenericEmulator extends BalanceEmulator {
  public async start(): Promise<void> {
    SerialPort.Binding = MockBinding;

    this.manager.addListener('connect', (balance) => {
      const emitData = () => (balance.serialPort.binding as any)
        .emitData('T2BN0           0,060 kg      0,00 N1     0,00 E');

      emitData();
      const interval = setInterval(emitData, 200);

      this.loopIntervals.push(interval);
    });

    balancePorts.forEach(async (port) => {
      MockBinding.createPort(port.path, {
        vendorId: port.vendorId,
        productId: port.productId,
        record: true,
      });
    });

    await this.manager.start();
  }
}
export default GenericEmulator;
