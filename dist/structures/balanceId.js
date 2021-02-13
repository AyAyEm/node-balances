"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceId = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const errors_1 = require("../errors");
const models = tslib_1.__importStar(require("../balancesModels"));
/**
 * The standard identification of a balance.
 */
class BalanceId {
    constructor(portId, balanceModel) {
        if (lodash_1.default.every(models, ({ model }) => model !== balanceModel)) {
            throw new errors_1.BalanceError([
                `Balance model: ${balanceModel} not found in the possible models: `,
                Object.keys(models).join(', '),
            ].join(''));
        }
        this.model = balanceModel;
        this.port = portId;
    }
}
exports.BalanceId = BalanceId;
exports.default = BalanceId;
//# sourceMappingURL=balanceId.js.map