import type { PortInfo } from 'serialport';
import type { BalanceId } from './balanceId';
/**
 * Map designed to use with a list of serial ports.
 */
export declare class PortsMap {
    map: Map<string, PortInfo>;
    identifiers: Array<keyof PortInfo>;
    constructor(identifier: keyof PortInfo, ports: PortInfo[]);
    constructor(identifiers: Array<keyof PortInfo>, ports: PortInfo[]);
    get(balanceId: BalanceId): PortInfo;
    add(balanceId: BalanceId): Map<string, PortInfo>;
    has(balanceId: BalanceId): boolean;
    has(pnpId: string): boolean;
    delete(pnpId: string): boolean;
}
export default PortsMap;
