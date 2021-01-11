import _ from 'lodash';

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
export class UranoPop extends BalanceModel {
  public static model = 'uranoPop';

  public parser = new DelimiterParser({
    delimiters: [[0x03, 0x09, 0x02, 0x01, 0x03], 'P1'],
  });

  public portOpenOptions: OpenOptions = {
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 2,
  };

  public regExp = (() => {
    const separator = '[,.]';
    const value = `\\d+${separator}\\d+`;
    const weightRegex = `.+(?<weight>${value}(?=.?kg\\s+))`;
    const priceRegex = `.+?(?<price>${value})`;
    const totalRegex = `.+?(?<total>${value})`;

    return new RegExp(`${weightRegex}${priceRegex}${totalRegex}`);
  })();

  /**
   * Execute a query in the balance requesting the data.
   */
  protected requireData() {
    this.serialPort.write('05', 'hex');
  }

  /**
   * Execute the sanitization of the data in string format.
   */
  protected sanitize(data: string) {
    return _.trim(data, ' ').replace(/,/g, '.');
  }

  /**
   * Execute a conversion of a string into a proper object.
   */
  protected convert(data: string) {
    const reading = data.match(this.regExp);
    const weight = Math.round(Number(reading?.groups?.weight) * 1000) / 1000;
    const price = Math.round(Number(reading?.groups?.price) * 100) / 100;
    const total = Math.round(Number(reading?.groups?.total) * 100) / 100;

    const balanceReading = new BalanceReading({ weight, price, total });
    return balanceReading;
  }
}
export default UranoPop;
