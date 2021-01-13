"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceReading = void 0;
/**
 * The standard of data output.
 */
class BalanceReading {
    constructor(readingData) {
        let { weight, price, total } = readingData !== null && readingData !== void 0 ? readingData : {};
        if (Number.isNaN(Number(weight))) {
            throw new TypeError('Invalid reading weight, type is not a number.');
        }
        else if (typeof weight === 'string') {
            weight = Number(weight);
        }
        if (typeof price === 'undefined') {
            price = null;
        }
        else if (Number.isNaN(Number(price))) {
            throw new TypeError('Invalid reading price, type is not a number.');
        }
        else if (typeof price === 'string') {
            price = Number(price);
        }
        if (typeof total === 'undefined') {
            total = null;
        }
        else if (Number.isNaN(Number(total))) {
            throw new TypeError('Invalid reading total, type is not a number.');
        }
        else if (typeof total === 'string') {
            price = Number(total);
        }
        this.weight = weight;
        this.price = price;
        this.total = total;
    }
}
exports.BalanceReading = BalanceReading;
exports.default = BalanceReading;
//# sourceMappingURL=balanceReading.js.map