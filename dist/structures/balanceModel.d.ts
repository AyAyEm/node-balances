/// <reference types="node" />
import SerialPort from 'serialport';
import { Transform } from 'stream';
import type { OpenOptions } from 'serialport';
import { BalanceEventEmitter } from './balanceEventEmitter';
import { BalanceError } from '../errors/balanceError';
import type { BalanceId } from './balanceId';
import type { BalanceReading } from './balanceReading';
import type { ReadingData, InStringOf } from '../types';
export interface BalanceOptions {
    path: string;
}
/**
 * Model designed to work with a specific balance.
 * @example
 * const balanceModel = new BalanceModel(BalanceId, BalanceOptions);
 * balanceModel.connect()
 *   .then((balanceModel) => balanceModel)
 *   .catch((error) => error);
 */
export declare abstract class BalanceModel extends BalanceEventEmitter {
    static readonly model: string;
    readonly balanceId: BalanceId;
    readonly portPath: string;
    serialPort: InstanceType<typeof SerialPort>;
    protected lastReading: string;
    private _readInterval;
    abstract readonly portOpenOptions: OpenOptions;
    abstract readonly parser: Transform;
    constructor(balanceId: InstanceType<typeof BalanceId>, options?: BalanceOptions);
    /**
     * Execute a query in the balance requesting the data.
     */
    protected abstract requireData(): void;
    /**
     * Execute the sanitization of the data in string format.
     */
    protected sanitize(data: string): string;
    /**
     * Execute a conversion of a string into a proper object.
     */
    abstract convert(data: string): BalanceReading;
    abstract match(data: string): InStringOf<ReadingData>;
    abstract verify(data: string): boolean;
    /**
     * Initiate connection with the serialPort and attach the listeners with the parser with it.
     * @example
     * balanceModel.connect()
     *   .then((balanceModel) => balanceModel)
     *   .catch((error) => error);
     */
    connect(): Promise<void>;
    /**
    * If an error is provided it'll emit the serialPort error event,
    * remove all serialPort listeners,
    * clearInterval of the requisition of data,
    * and nullifies the current serialPort.
    * @example
    * balanceModel.disconnect()
    *   .then((balanceModel) => balanceModel)
    *   .catch((error) => error);
    */
    disconnect(err?: BalanceError): Promise<this>;
    /**
     * Await a disconnect and then execute a connect.
     */
    reconnect(err?: BalanceError): Promise<void>;
}
export default BalanceModel;
