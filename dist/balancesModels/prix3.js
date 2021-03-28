"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prix3 = void 0;
const balanceModel_1 = require("../structures/balanceModel");
const balanceReading_1 = require("../structures/balanceReading");
/**
 * Model designed to work with a specific balance.
 * @example
 * const balanceModel = new BalanceModel(BalanceId, BalanceOptions);
 * balanceModel.connect()
 *   .then((balanceModel) => balanceModel)
 *   .catch((error) => error);
 */
class Prix3 extends balanceModel_1.BalanceModel {
    constructor() {
        super(...arguments);
        this.parser = null;
        this.portOpenOptions = {
            baudRate: 9600,
            stopBits: 1,
            parity: 'none',
            dataBits: 8,
        };
    }
    /**
     * Execute a query in the balance requesting the data.
     */
    requireData() {
        this.serialPort.write('\u0005');
    }
    /**
     * Execute the sanitization of the data in string format.
     */
    sanitize(data) {
        return data.replace(/,/g, '.');
    }
    match(data) {
        var _a;
        const weight = (_a = data.match(/\d+[.,]?\d+/)) === null || _a === void 0 ? void 0 : _a[0];
        if (!weight)
            return null;
        return { weight };
    }
    verify(data) {
        return Boolean(this.match(data));
    }
    /**
     * Execute a conversion of a string into a proper object.
     */
    convert(data) {
        const { weight } = this.match(data);
        let sanitizedWeight = this.sanitize(weight);
        if (sanitizedWeight.length === 5) {
            const splittedData = sanitizedWeight.split('');
            splittedData.splice(2, 0, '.');
            sanitizedWeight = splittedData.join('');
        }
        const balanceReading = new balanceReading_1.BalanceReading({ weight: +sanitizedWeight });
        return balanceReading;
    }
}
exports.Prix3 = Prix3;
Prix3.model = 'Prix3';
exports.default = Prix3;
//# sourceMappingURL=prix3.js.map