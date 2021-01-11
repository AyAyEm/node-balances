import { BalanceEventEmitter } from './balanceEventEmitter';

import { BalanceId } from './balanceId';

import type { BalanceInfo, Awaited } from '../types';

/**
 * Designed to manage the variety of models into a single and standard way.
 * @example
 * const balanceManager = new BalanceManager(BalanceIds);
 * balanceManager.start();
 */
export abstract class BalanceManager extends BalanceEventEmitter {
  public readonly balanceIds: BalanceId[];

  public constructor(balanceIds: BalanceInfo[]) {
    super();

    this.balanceIds = balanceIds.map(({ portId, balanceModel }) => (
      new BalanceId(portId, balanceModel)));
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
}
export default BalanceManager;

export interface IManager {
  new(balanceIds: BalanceInfo[]): BalanceManager;
}
