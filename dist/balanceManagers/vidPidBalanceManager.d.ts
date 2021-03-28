import { BalanceManager } from '../structures';
/**
 * Designed to manage the variety of models into a single and standard way.
 * @example
 * const balanceManager = new BalanceManager(BalanceIds);
 * balanceManager.start();
 */
export declare class VidPidBalanceManager extends BalanceManager {
    /**
     * Initiates the connection with the available balance.
     */
    start(): Promise<void>;
    /**
     * Restarts the balance connection.
     */
    restart(): Promise<void>;
    find(): Promise<import("../structures").BalanceId>;
    generatePortsMap(): Promise<this>;
}
export default VidPidBalanceManager;
