import _ from 'lodash';

import { Transform, TransformOptions } from 'stream';

export interface DelimiterParserOptions extends TransformOptions {
  delimiters: Array<string | number[]>;
  includeDelimiter?: boolean;
}

/**
 * Parser made to work with delimiters.
 * @example
 * const delimiterParser = new DelimiterParser({
 *  delimiters: [[0x03, 0x09, 0x02, 0x01, 0x03], 'P1'],
 * });
 */
export class DelimiterParser extends Transform {
  public readonly includeDelimiter: boolean;

  public readonly delimiters: Buffer[];

  public readonly bufferMinLength: number;

  public buffer: Buffer;

  public constructor(options: DelimiterParserOptions) {
    super(options);

    const { delimiters, includeDelimiter = false } = options ?? {};

    if (options.delimiters.some(_.isUndefined)) {
      throw new TypeError('"delimiter" is not a bufferable object');
    }

    if (options.delimiters.some((delimiter) => delimiter.length === 0)) {
      throw new TypeError('"delimiter" has a 0 or undefined length');
    }

    this.includeDelimiter = includeDelimiter;
    this.delimiters = _.map(delimiters, (delimiter) => Buffer.from(delimiter));
    this.buffer = Buffer.alloc(0);

    this.bufferMinLength = _.reduce(
      this.delimiters,
      (result, { length: actual }) => (result < actual ? result : actual),
      this.delimiters[0].length,
    );
  }

  public _transform(chunk: Buffer | string, _encoding: string, cb: () => void) {
    let data = Buffer.concat([this.buffer, Buffer.from(chunk)]);
    let position: number;

    const getPosition = () => (
      this.delimiters.reduce((result, delimiter) => {
        const lastPosition = data.indexOf(delimiter);
        return result > lastPosition ? result : lastPosition;
      }, -1));

    // eslint-disable-next-line no-cond-assign
    while ((position = getPosition()) !== -1) {
      this.push(data.slice(0, position + (this.includeDelimiter ? this.bufferMinLength : 0)));
      data = data.slice(position + this.bufferMinLength);
    }
    this.buffer = data;
    cb();
  }

  public _flush(cb: () => void) {
    this.push(this.buffer);
    this.buffer = Buffer.alloc(0);
    cb();
  }
}
export default DelimiterParser;
