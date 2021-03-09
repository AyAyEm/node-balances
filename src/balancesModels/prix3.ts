import type { OpenOptions } from 'serialport';

import { BalanceModel } from '../structures/balanceModel';
import { BalanceReading } from '../structures/balanceReading';

import type { BalanceModels } from '../types';

/**
 * Model designed to work with a specific balance.
 * @example
 * const balanceModel = new BalanceModel(BalanceId, BalanceOptions);
 * balanceModel.connect()
 *   .then((balanceModel) => balanceModel)
 *   .catch((error) => error);
 */
export class Prix3 extends BalanceModel {
  public static model: keyof typeof BalanceModels = 'prix3';

  public parser: null = null;

  public portOpenOptions: OpenOptions = {
    baudRate: 9600,
    stopBits: 1,
    parity: 'none',
    dataBits: 8,
  };

  /**
   * Execute a query in the balance requesting the data.
   */
  protected requireData() {
    this.serialPort.write('\u0005');
  }

  /**
   * Execute the sanitization of the data in string format.
   */
  protected sanitize(data: string) {
    return data.replace(/,/g, '.');
  }

  public match(data: string) {
    const weight = data.match(/\d+[.,]?\d+/)?.[0];
    if (!weight) return null;

    return { weight };
  }

  public verify(data: string) {
    return Boolean(this.match(data));
  }

  /**
   * Execute a conversion of a string into a proper object.
   */
  public convert(data: string) {
    const { weight } = this.match(data);

    let sanitizedWeight = this.sanitize(weight);
    if (sanitizedWeight.length === 5) {
      const splittedData = sanitizedWeight.split('');
      splittedData.splice(2, 0, '.');

      sanitizedWeight = splittedData.join('');
    }

    const balanceReading = new BalanceReading({ weight: +sanitizedWeight });
    return balanceReading;
  }
}
export default Prix3;
