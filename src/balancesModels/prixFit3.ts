import type { OpenOptions } from 'serialport';

import { BalanceModel } from '../structures/balanceModel';
import { BalanceReading } from '../structures/balanceReading';

/**
 * Model designed to work with a specific balance.
 * @example
 * const balanceModel = new BalanceModel(BalanceId, BalanceOptions);
 * balanceModel.connect()
 *   .then((balanceModel) => balanceModel)
 *   .catch((error) => error);
 */
export class PrixFit3 extends BalanceModel {
  public static model = 'prixFit3';

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
      .replace(/\x05\r/g, '')
      .replace(/,/g, '.');
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
    const { weight } = this.match(data);

    const balanceReading = new BalanceReading({ weight: +weight });
    return balanceReading;
  }
}
export default PrixFit3;
