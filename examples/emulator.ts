import { PortInfo } from 'serialport';

import { GenericEmulator, VidPidBalanceManager } from '../src';

const port: Partial<PortInfo> = { productId: 'testing', path: '/dev/ROBOT', vendorId: 'teste' };
const manager = new VidPidBalanceManager([{ balanceModel: 'uranoPop', portId: port }]);
const emulator = new GenericEmulator([port], manager);
emulator.connect();

manager.addListener('reading', (data) => {
  console.log(data);
  emulator.disconnectBalance();
});

manager.addListener('error', (error) => {
  console.log(error);
});
