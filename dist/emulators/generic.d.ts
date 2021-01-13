import { BalanceEmulator } from '../structures';
/**
 * @description Debug tool mocking the balance to output data without the need of the real one.
 * @warning Don't use this in another environment than debug or testing.
 * @example // typescript
 * const port: Partial<PortInfo> = { productId: 'testing', path: '/dev/ROBOT', vendorId: 'teste' };
 * const manager = new VidPidBalanceManager([{ balanceModel: 'uranoPop', portId: port }]);
 * const emulator = new GenericEmulator([port], manager);
 * emulator.connect();
 *
 * manager.addListener('reading', (data) => {
 *   console.log(data);
 *   emulator.disconnectBalance();
 * });
 *
 * manager.once('reading', () => {
 *   emulator.setEmittingData({ weight: 10, price: 10, total: 10 });
 * });
 *
 * manager.addListener('error', (error) => {
 *   console.log(error);
 * });
 */
export declare class GenericEmulator extends BalanceEmulator {
}
export default GenericEmulator;
