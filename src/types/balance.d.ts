import type { PortInfo } from 'serialport';

export enum BalanceModels {
  uranoPop = 'uranoPop',
}

export interface BalanceInfo {
  portId: Partial<PortInfo>;
  balanceModel: keyof typeof BalanceModels;
}

export enum BalanceEvents {
  reading = 'reading',
  connect = 'connect',
  disconnect = 'disconnect',
  error = 'error',
}
