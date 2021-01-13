import type { BaseBinding, OpenOptions, PortInfo } from 'serialport';

interface LocalState {
  readonly path: string
  /* The system reported baud rate */
  readonly baudRate: number
  /* Break Suspends character transmission local status */
  readonly brk: boolean
  readonly dataBits: 5 | 6 | 7 | 8
  /* Data terminal Ready local status (local DTR => remote DSR) */
  readonly dtr: boolean
  readonly lock: boolean
  readonly parity: 'none' | 'even' | 'mark' | 'odd' | 'space'
  /* Request To Send local status (local RTS => remote CTS) */
  readonly rts: boolean
  /* enable rts/cts control flow, disables manually setting rts */
  readonly rtscts: boolean
  readonly stopBits: 1 | 1.5 | 2
}

export class IMockBinding extends BaseBinding {
  public getRemoteState(...args: unknown[]): Promise<unknown>;
  public setLocalState(options: Pick<Partial<LocalState>, 'brk' | 'dataBits' | 'dtr' | 'lock' | 'parity' | 'rts' | 'rtscts' | 'stopBits'>): Promise<LocalState>;
  // if record is true this buffer will have all data that has been written to this port
  public readonly recording: Buffer;

  // the buffer of the latest written data
  public readonly lastWrite: null | Buffer;

  // Create a mock port
  public static createPort(
    path: string,
    options: {
      echo?: boolean,
      vendorId: string,
      productId: string,
      record?: boolean,
      readyData?: Buffer,
    }): void;

  // Reset available mock ports
  public static reset(): void;

  // list mock ports
  public static list(): Promise<PortInfo[]>;

  // Emit data on a mock port
  public emitData(data: Buffer | string | number[]): void;

  // Standard bindings interface
  public open(path: string, options: OpenOptions): Promise<any>;
  public close(): Promise<void>;
  public write(buffer: Buffer): Promise<void>;
  public update(options: { baudRate: number }): Promise<void>;
  public get(): Promise<unknown>;
  public set(options: Record<string, unknown>): Promise<void>;
  public getBaudRate(): Promise<number>;
  public flush(): Promise<void>;
  public drain(): Promise<void>;
}
export default IMockBinding;
