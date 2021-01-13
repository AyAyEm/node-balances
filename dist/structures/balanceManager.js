"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceManager = void 0;
const balanceEventEmitter_1 = require("./balanceEventEmitter");
const balanceId_1 = require("./balanceId");
/**
 * Designed to manage the variety of models into a single and standard way.
 * @example
 * const balanceManager = new BalanceManager(BalanceIds);
 * balanceManager.start();
 */
class BalanceManager extends balanceEventEmitter_1.BalanceEventEmitter {
    constructor(balanceIds) {
        super();
        this.balanceIds = balanceIds.map(({ portId, balanceModel }) => (new balanceId_1.BalanceId(portId, balanceModel)));
    }
}
exports.BalanceManager = BalanceManager;
exports.default = BalanceManager;
//# sourceMappingURL=balanceManager.js.map