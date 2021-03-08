/// <reference types="node" />
import SerialPort from 'serialport';
import type { PortInfo } from 'serialport';
import type { BalanceManager } from './balanceManager';
import type { BalanceId } from './balanceId';
import type { ReadingData } from '../types';
/**
 * @description Debug tool mocking the balance to output data without the need of the real one.
 * @warning Don't use this in another environment than debug or testing.
 */
export declare abstract class BalanceEmulator {
    manager: BalanceManager;
    portIds: Partial<PortInfo>[];
    protected emittingData: Buffer;
    protected loopIntervals: Array<ReturnType<typeof setInterval>>;
    constructor(portIds: Partial<PortInfo>[], manager: BalanceManager);
    /**
     * Start the emulation of the balances.
     */
    connect(): Promise<void>;
    /**
     * Set the internal emittingData property.
     */
    setEmittingData(data: string): Promise<void>;
    setEmittingData(data: Buffer): Promise<void>;
    setEmittingData(data: ReadingData): Promise<void>;
    /**
     * Execute the close method from the current serialPort stream.
     */
    disconnectBalance(): Promise<void>;
    /**
     * Delete a balance from the portsMap.
     * @warning if the manager re-starts you'll have to remove it again.
     */
    removeBalance(balance: BalanceId): Promise<boolean>;
    /**
     * Add a balance to the portsMap.
     * @warning if the manager re-starts you'll have to add it again.
     */
    addBalance(balance: BalanceId): Promise<Map<string, SerialPort.PortInfo>>;
    /**
     * Disconnect the emulator clearing all loopIntervals and restoring the default binding.
     */
    disconnect(): Promise<void>;
}
export default BalanceEmulator;
