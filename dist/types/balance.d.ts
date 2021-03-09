import type { PortInfo } from 'serialport';
export declare enum BalanceModels {
    uranoPop = "uranoPop",
    prix3 = "prix3"
}
export interface BalanceInfo {
    portId: Partial<PortInfo>;
    balanceModel: keyof typeof BalanceModels;
}
export interface ReadingData {
    weight: number;
    price?: number;
    total?: number;
}
export declare enum BalanceEvents {
    reading = "reading",
    connect = "connect",
    disconnect = "disconnect",
    error = "error"
}
