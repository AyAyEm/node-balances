import type { PortInfo } from 'serialport';
/**
 * The standard identification of a balance.
 */
export declare class BalanceId {
    port: Partial<PortInfo>;
    model: string;
    constructor(portId: Partial<PortInfo>, balanceModel: string);
}
export default BalanceId;
