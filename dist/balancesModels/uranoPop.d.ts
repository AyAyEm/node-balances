import type { OpenOptions } from 'serialport';
import { BalanceModel } from '../structures/balanceModel';
import { BalanceReading } from '../structures/balanceReading';
import { DelimiterParser } from '../parsers';
/**
 * Model designed to work with a specific balance.
 * @example
 * const balanceModel = new BalanceModel(BalanceId, BalanceOptions);
 * balanceModel.connect()
 *   .then((balanceModel) => balanceModel)
 *   .catch((error) => error);
 */
export declare class UranoPop extends BalanceModel {
    static model: string;
    parser: DelimiterParser;
    portOpenOptions: OpenOptions;
    /**
     * Execute a query in the balance requesting the data.
     */
    protected requireData(): void;
    /**
     * Execute the sanitization of the data in string format.
     */
    protected sanitize(data: string): string;
    match(data: string): {
        weight: string;
        price: string;
        total: string;
    };
    verify(data: string): boolean;
    /**
     * Execute a conversion of a string into a proper object.
     */
    convert(data: string): BalanceReading;
}
export default UranoPop;
