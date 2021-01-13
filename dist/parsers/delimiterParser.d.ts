/// <reference types="node" />
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
export declare class DelimiterParser extends Transform {
    readonly includeDelimiter: boolean;
    readonly delimiters: Buffer[];
    readonly bufferMinLength: number;
    buffer: Buffer;
    constructor(options: DelimiterParserOptions);
    _transform(chunk: Buffer | string, _encoding: string, cb: () => void): void;
    _flush(cb: () => void): void;
}
export default DelimiterParser;
