import { BalanceEventEmitter } from './balanceEventEmitter';
import { BalanceId } from './balanceId';
import type { PortsMap } from './portsMap';
import type { BalanceModel } from './balanceModel';
import type { BalanceInfo, Awaited } from '../types';
/**
 * Designed to manage the variety of models into a single and standard way.
 * @example
 * const balanceManager = new BalanceManager(BalanceIds);
 * balanceManager.start();
 */
export declare abstract class BalanceManager extends BalanceEventEmitter {
    readonly balanceIds: BalanceId[];
    portsMap: PortsMap;
    currentBalance: BalanceModel;
    constructor(balanceIds: BalanceInfo[]);
    /**
     * @abstract
     * Initiates the connection with the available balance.
     */
    abstract start(...args: unknown[]): Awaited<void | this>;
    /**
     * Restarts the balance connection.
     */
    abstract restart(...args: unknown[]): Awaited<void | this>;
}
export default BalanceManager;
export interface IManager {
    new (balanceIds: BalanceInfo[]): BalanceManager;
}
