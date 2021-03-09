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
export class PrixFit3 extends BalanceModel {
  public static model: keyof typeof BalanceModels = 'prixFit3';

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
    return data
      .replace(/,/g, '.')
      .match(/\d+[.,]?\d+/)[0];
  }

  public match(data: string) {
    return { weight: data };
  }

  public verify(data: string) {
    if (this.match(data)) {
      return true;
    }

    return false;
  }

  /**
   * Execute a conversion of a string into a proper object.
   */
  public convert(data: string) {
    const sanitizedData = this.sanitize(data);

    let finalData = sanitizedData;
    if (sanitizedData.length === 5) {
      const splittedData = data.split('');
      splittedData.splice(2, 0, '.');

      finalData = splittedData.join('');
    }

    const balanceReading = new BalanceReading({ weight: +finalData });
    return balanceReading;
  }
}
export default PrixFit3;
