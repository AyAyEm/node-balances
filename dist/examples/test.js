"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const balanceManagers_1 = require("../balanceManagers");
const manager = new balanceManagers_1.VidPidBalanceManager([{ portId: { path: 'COM5' }, balanceModel: 'uranoPop' }]);
manager.start();
manager.addListener('connect', () => console.log('eeeeeeee'));
manager.addListener('disconnect', () => console.log('aaaaaaaa'));
manager.addListener('reading', (data) => console.log(data));
manager.addListener('error', (err) => console.error(err));
//# sourceMappingURL=test.js.map