import SerialPort from 'serialport';
import { Transform } from 'stream';

import type { OpenOptions } from 'serialport';

import { BalanceEventEmitter } from './balanceEventEmitter';
import { BalanceError } from '../errors/balanceError';

import { BalanceId } from './balanceId';
import type { BalanceReading } from './balanceReading';
import type { ReadingData, InStringOf, BalanceModels } from '../types';

export interface BalanceOptions {
  path: string;
  dataInterval: number;
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
  public static readonly model: keyof typeof BalanceModels;

  public readonly balanceId: BalanceId;

  public readonly portPath: string;

  public serialPort: InstanceType<typeof SerialPort>;

  protected lastReading: string;

  private _readInterval: ReturnType<typeof setInterval>;

  private dataInterval: BalanceOptions['dataInterval'];

  public readonly abstract portOpenOptions: OpenOptions;

  public readonly abstract parser?: Transform;

  public constructor(
    balanceId: InstanceType<typeof BalanceId>,
    options?: Partial<BalanceOptions>,
  ) {
    super();
    if (!(balanceId instanceof BalanceId)) {
      throw new BalanceError('Invalid balanceId, it\'s not an instance of BalanceId.');
    }
    this.balanceId = balanceId;

    const { path } = options ?? {};
    this.portPath = path;
    this.dataInterval = options?.dataInterval ?? 200;
  }

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
   * Execute a conversion of a string into a proper object.
   */
  public abstract convert(data: string): BalanceReading;

  public abstract match(data: string): InStringOf<ReadingData>;

  public abstract verify(data: string): boolean;

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

    let mainStream: Transform | SerialPort = this.serialPort;
    if (this.parser) {
      mainStream.pipe(this.parser);
      mainStream = this.parser;
    }

    mainStream.addListener('data', (data: Buffer) => {
      const dataSanitized = this.sanitize(typeof data === 'string' ? data : data.toString());

      if (dataSanitized === this.lastReading || !this.verify(dataSanitized)) return;
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
    }, this.dataInterval);
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

    if (this.parser && !this.parser.destroyed) this.parser.removeAllListeners();
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
