import type { PortInfo } from 'serialport';

import { BalanceEventEmitter } from './balanceEventEmitter';

import { BalanceId } from './balanceId';
import { BalanceError } from '../errors/balanceError';

import type { PortsMap } from './portsMap';
import type { BalanceModel } from './balanceModel';
import type { BalanceInfo, Awaited, Entries } from '../types';

interface ManagerOptions {
  autoRestart: boolean;
  restartInterval: number;
  dataInterval: number;
}

/**
 * Designed to manage the variety of models into a single and standard way.
 * @example
 * const balanceManager = new BalanceManager(BalanceIds);
 * balanceManager.start();
 */
export abstract class BalanceManager extends BalanceEventEmitter {
  public readonly balanceIds: BalanceId[];

  public portsMap: PortsMap;

  public currentBalance: BalanceModel;

  public readonly options: ManagerOptions;

  protected _connected = false;

  public get connected() {
    return this._connected;
  }

  public constructor(balanceIds: BalanceInfo[], options?: Partial<ManagerOptions>) {
    super();

    this.balanceIds = balanceIds.map(({ portId, balanceModel }) => (
      new BalanceId(portId, balanceModel)));

    this.options = {
      autoRestart: options?.autoRestart ?? true,
      restartInterval: options?.restartInterval ?? 1000,
      dataInterval: options?.dataInterval ?? 200,
    };
  }

  /**
   * @abstract
   * Initiates the connection with the available balance.
   */
  public abstract start(...args: unknown[]): Awaited<void | this>;

  /**
   * Restarts the balance connection.
   */
  public abstract restart(...args: unknown[]): Awaited<void | this>;

  /**
   * Search for a balanceId that matches a port in portsMap.
   */
  public async find() {
    const balanceId = this.balanceIds.find((balance) => this.portsMap.has(balance));

    if (!balanceId) {
      return Promise.reject(new BalanceError('None ports were a match with balanceIds provided'));
    }

    return balanceId;
  }

  /**
   * Adds a balance to the end of balanceIds.
   */
  public addBalance(balanceInfo: BalanceInfo): void;
  public addBalance(balanceInfos: BalanceInfo[]): void;
  public addBalance(balanceInfos: BalanceInfo[] | BalanceInfo): void {
    const ids = balanceInfos instanceof Array ? balanceInfos : [balanceInfos];
    ids.forEach(({ portId, balanceModel }) => (
      this.balanceIds.push(new BalanceId(portId, balanceModel))));
  }

  /**
   * Removes the first balance that it matches balanceInfo from balanceIds.
   */
  public removeBalance(balanceInfo: BalanceInfo): void {
    const balanceId = new BalanceId(balanceInfo.portId, balanceInfo.balanceModel);

    const sameModelIds = this.balanceIds.filter((id) => id.model === balanceId.model);
    if (sameModelIds.length === 0) return;

    let toExcludeIndex: number;
    sameModelIds.find((id, index) => {
      const result = Object.entries(balanceId.port)
        .reduce((acc, [key, value]: Entries<PortInfo>) => (
          (acc && value !== id.port[key]) ? false : acc), true);

      if (result) toExcludeIndex = index;
      return result;
    });

    if (typeof toExcludeIndex === 'number') {
      this.balanceIds.splice(toExcludeIndex, 1);
    }
  }
}
export default BalanceManager;

export interface IManager {
  new(balanceIds: BalanceInfo[]): BalanceManager;
}
