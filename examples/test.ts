import { VidPidBalanceManager } from '../balanceManagers';

const manager = new VidPidBalanceManager([{ portId: { path: 'COM5' }, balanceModel: 'uranoPop' }]);
manager.start();
manager.addListener('connect', () => console.log('eeeeeeee'));
manager.addListener('disconnect', () => console.log('aaaaaaaa'));
manager.addListener('reading', (data) => console.log(data));
manager.addListener('error', (err) => console.error(err));
