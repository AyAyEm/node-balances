"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const port = { productId: 'testing', path: '/dev/ROBOT', vendorId: 'teste' };
const manager = new __1.VidPidBalanceManager([{ balanceModel: 'uranoPop', portId: port }]);
const emulator = new __1.GenericEmulator([port], manager);
emulator.connect();
manager.addListener('reading', (data) => {
    console.log(data);
    emulator.disconnectBalance();
});
manager.addListener('error', (error) => {
    console.log(error);
});
//# sourceMappingURL=emulator.js.map