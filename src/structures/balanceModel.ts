import SerialPort from 'serialport';
import { Transform } from 'stream';

import type { OpenOptions } from 'serialport';

import { BalanceEventEmitter } from './balanceEventEmitter';

import type { BalanceId } from './balanceId';
import type { BalanceReading } from './balanceReading';

import { BalanceError } from '../errors/balanceError';

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

export abstract class BalanceModel extends BalanceEventEmitter {
  public static readonly model: string;

  public readonly balanceId: BalanceId;

  public readonly portPath: string;

  public serialPort: InstanceType<typeof SerialPort>;

  protected lastReading: string;

  private _readInterval: ReturnType<typeof setInterval>;

  public readonly abstract portOpenOptions: OpenOptions;

  public readonly abstract parser: Transform;

  protected abstract regExp: RegExp;

  public constructor(
    balanceId: InstanceType<typeof BalanceId>,
    options?: BalanceOptions,
  ) {
    super();
    this.balanceId = balanceId;

    const { path } = options ?? {};
    this.portPath = path;
  }

  /**
   * Execute a conversion of a string into a proper object.
   */
  protected abstract convert(data: string): BalanceReading;

  /**
   * Execute a query in the balance requesting the data.
   */
  protected abstract requireData(): void;

  /**
   * Execute the sanitization of the data in string format.
   */
  protected sanitize(data: string): string {
    return data;
  }

  /**
   * Initiate connection with the serialPort and attach the listeners with the parser with it.
   * @example
   * balanceModel.connect()
   *   .then((balanceModel) => balanceModel)
   *   .catch((error) => error);
   */
  public async connect() {
    this.serialPort = new SerialPort(this.portPath, { ...this.portOpenOptions, autoOpen: false });

    await new Promise<void>((resolve, reject) => this.serialPort.open((err) => {
      if (err) reject(err);
      else resolve();
    }));

    this.serialPort.pipe(this.parser);

    this.parser.addListener('data', (data: Buffer) => {
      const dataSanitized = this.sanitize(typeof data === 'string' ? data : data.toString());

      if (dataSanitized === this.lastReading || !this.regExp.test(dataSanitized)) return;
      this.lastReading = dataSanitized;

      try {
        const convertedData = this.convert(dataSanitized);
        this.emit('reading', convertedData);
      } catch (err) {
        this.emit('error', err);
        this.serialPort.close();
      }
    });

    this.serialPort.addListener('error', (err) => {
      this.emit('error', err);
    });

    this.serialPort.addListener('close', (err?: Error) => {
      this.emit('disconnect', this);
      this.disconnect(err);
    });

    this._readInterval = setInterval(() => {
      try { this.requireData(); } catch (err) { this.emit('error', err); }
    }, 200);
  }

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
  public async disconnect(err?: BalanceError) {
    if (err) this.emit('error', err);

    if (!this.serialPort?.destroyed ?? false) {
      this.serialPort?.removeAllListeners();
      this.serialPort?.destroy(err);
    }

    if (!this.parser.destroyed) this.parser.removeAllListeners();
    if (this._readInterval) clearInterval(this._readInterval);
    this.serialPort = null;
    return this;
  }

  /**
   * Await a disconnect and then execute a connect.
   */
  public async reconnect(err?: BalanceError) {
    await this.disconnect(err);
    return this.connect();
  }
}
export default BalanceModel;
