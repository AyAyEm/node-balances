import type { PortInfo } from 'serialport';
export declare function portHasIdentifiers(identifiers: Array<keyof PortInfo>, port: Partial<PortInfo>): boolean;
export default portHasIdentifiers;
