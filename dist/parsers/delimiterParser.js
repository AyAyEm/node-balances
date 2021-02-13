"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelimiterParser = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const stream_1 = require("stream");
/**
 * Parser made to work with delimiters.
 * @example
 * const delimiterParser = new DelimiterParser({
 *  delimiters: [[0x03, 0x09, 0x02, 0x01, 0x03], 'P1'],
 * });
 */
class DelimiterParser extends stream_1.Transform {
    constructor(options) {
        super(options);
        const { delimiters, includeDelimiter = false } = options !== null && options !== void 0 ? options : {};
        if (options.delimiters.some(lodash_1.default.isUndefined)) {
            throw new TypeError('"delimiter" is not a bufferable object');
        }
        if (options.delimiters.some((delimiter) => delimiter.length === 0)) {
            throw new TypeError('"delimiter" has a 0 or undefined length');
        }
        this.includeDelimiter = includeDelimiter;
        this.delimiters = lodash_1.default.map(delimiters, (delimiter) => Buffer.from(delimiter));
        this.buffer = Buffer.alloc(0);
        this.bufferMinLength = lodash_1.default.reduce(this.delimiters, (result, { length: actual }) => (result < actual ? result : actual), this.delimiters[0].length);
    }
    _transform(chunk, _encoding, cb) {
        let data = Buffer.concat([this.buffer, Buffer.from(chunk)]);
        let position;
        const getPosition = () => (this.delimiters.reduce((result, delimiter) => {
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
    _flush(cb) {
        this.push(this.buffer);
        this.buffer = Buffer.alloc(0);
        cb();
    }
}
exports.DelimiterParser = DelimiterParser;
exports.default = DelimiterParser;
//# sourceMappingURL=delimiterParser.js.map