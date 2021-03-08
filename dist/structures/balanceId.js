"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceId = void 0;
const tslib_1 = require("tslib");
const errors_1 = require("../errors");
const models = tslib_1.__importStar(require("../data/models.json"));
/**
 * The standard identification of a balance.
 */
class BalanceId {
    constructor(portId, balanceModel) {
        if (Object.keys(models).every((model) => model.toLowerCase() !== balanceModel.toLowerCase())) {
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