import type { ReadingData } from '../types';

/**
 * The standard of data output.
 */
export class BalanceReading {
  public weight: number;

  public price: number | null;

  public total: number | null;

  public constructor(readingData: ReadingData) {
    let { weight, price, total } = readingData ?? {};

    if (Number.isNaN(Number(weight))) {
      throw new TypeError('Invalid reading weight, type is not a number.');
    } else if (typeof weight === 'string') {
      weight = Number(weight);
    }

    if (typeof price === 'undefined') {
      price = null;
    } else if (Number.isNaN(Number(price))) {
      throw new TypeError('Invalid reading price, type is not a number.');
    } else if (typeof price === 'string') {
      price = Number(price);
    }

    if (typeof total === 'undefined') {
      total = null;
    } else if (Number.isNaN(Number(total))) {
      throw new TypeError('Invalid reading total, type is not a number.');
    } else if (typeof total === 'string') {
      price = Number(total);
    }

    this.weight = weight;
    this.price = price;
    this.total = total;
  }
}
export default BalanceReading;
