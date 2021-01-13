import type { ReadingData } from '../types';
/**
 * The standard of data output.
 */
export declare class BalanceReading {
    weight: number;
    price: number | null;
    total: number | null;
    constructor(readingData: ReadingData);
}
export default BalanceReading;
