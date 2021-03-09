import type { PortInfo } from 'serialport';
import { BalanceModels } from '../types';
/**
 * The standard identification of a balance.
 */
export declare class BalanceId {
    port: Partial<PortInfo>;
    model: keyof typeof BalanceModels;
    constructor(portId: Partial<PortInfo>, balanceModel: BalanceId['model']);
}
export default BalanceId;
