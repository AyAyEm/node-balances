import type { PortInfo } from 'serialport';

import type { BalanceManager } from './balanceManager';

export abstract class BalanceEmulator {
  public manager: BalanceManager;

  public portIds: Partial<PortInfo>[];

  public baudRate: number;

  public constructor(portIds: Partial<PortInfo>[], manager: BalanceManager) {
    this.portIds = portIds;
    this.manager = manager;
  }

  public loopIntervals: Array<ReturnType<typeof setInterval>> = [];

  public abstract start(): Promise<void>;

  public async close(): Promise<void> {
    this.loopIntervals.forEach((loop) => clearInterval(loop));
    this.loopIntervals = [];
  }
}
export default BalanceEmulator;
