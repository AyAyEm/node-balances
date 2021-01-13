"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceId = void 0;
const lodash_1 = __importDefault(require("lodash"));
const errors_1 = require("../errors");
const models = __importStar(require("../balancesModels"));
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