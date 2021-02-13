"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UranoPop = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const balanceModel_1 = require("../structures/balanceModel");
const balanceReading_1 = require("../structures/balanceReading");
const parsers_1 = require("../parsers");
/**
 * Model designed to work with a specific balance.
 * @example
 * const balanceModel = new BalanceModel(BalanceId, BalanceOptions);
 * balanceModel.connect()
 *   .then((balanceModel) => balanceModel)
 *   .catch((error) => error);
 */
class UranoPop extends balanceModel_1.BalanceModel {
    constructor() {
        super(...arguments);
        this.parser = new parsers_1.DelimiterParser({
            delimiters: [[0x03, 0x09, 0x02, 0x01, 0x03], 'P1'],
        });
        this.portOpenOptions = {
            baudRate: 9600,
            dataBits: 8,
            parity: 'none',
            stopBits: 2,
        };
    }
    /**
     * Execute a query in the balance requesting the data.
     */
    requireData() {
        this.serialPort.write('05', 'hex');
    }
    /**
     * Execute the sanitization of the data in string format.
     */
    sanitize(data) {
        return lodash_1.default.trim(data, ' ').replace(/,/g, '.');
    }
    match(data) {
        const separator = '[,.]';
        const value = `\\d+${separator}\\d+`;
        const weightRegex = `(?<weight>${value}(?=.?kg\\s+))`;
        const priceRegex = `.+?(?<price>${value})`;
        const totalRegex = `.+?(?<total>${value})`;
        let regex;
        if (data.startsWith('\u{1B}')) {
            regex = new RegExp(`(?=.+)${weightRegex}${priceRegex}${totalRegex}`);
        }
        else {
            regex = new RegExp(`(?<=:\\s{2})${weightRegex}${priceRegex}${totalRegex}$`);
        }
        const { groups: { weight, price = '', total = '' } = {} } = data.match(regex);
        if (!weight || weight.length <= 0) {
            return null;
        }
        return { weight, price, total };
    }
    verify(data) {
        if (this.match(data)) {
            return true;
        }
        return false;
    }
    /**
     * Execute a conversion of a string into a proper object.
     */
    convert(data) {
        const reading = this.match(data);
        const weight = Math.round(Number(reading.weight) * 1000) / 1000;
        const price = Math.round(Number(reading.price) * 100) / 100;
        const total = Math.round(Number(reading.total) * 100) / 100;
        const balanceReading = new balanceReading_1.BalanceReading({ weight, price, total });
        return balanceReading;
    }
}
exports.UranoPop = UranoPop;
UranoPop.model = 'uranoPop';
exports.default = UranoPop;
//# sourceMappingURL=uranoPop.js.map