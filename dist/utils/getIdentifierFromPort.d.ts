import type { PortInfo } from 'serialport';
export declare function getIdentifierFromPort(identifiers: Array<keyof PortInfo>, port: Partial<PortInfo>): string;
export default getIdentifierFromPort;
