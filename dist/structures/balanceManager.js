"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceManager = void 0;
const tslib_1 = require("tslib");
const balanceEventEmitter_1 = require("./balanceEventEmitter");
const balanceId_1 = require("./balanceId");
const balanceError_1 = require("../errors/balanceError");
/**
 * Designed to manage the variety of models into a single and standard way.
 * @example
 * const balanceManager = new BalanceManager(BalanceIds);
 * balanceManager.start();
 */
class BalanceManager extends balanceEventEmitter_1.BalanceEventEmitter {
    constructor(balanceIds, options) {
        var _a, _b, _c;
        super();
        this._connected = false;
        this.balanceIds = balanceIds.map(({ portId, balanceModel }) => (new balanceId_1.BalanceId(portId, balanceModel)));
        this.options = {
            autoRestart: (_a = options === null || options === void 0 ? void 0 : options.autoRestart) !== null && _a !== void 0 ? _a : true,
            restartInterval: (_b = options === null || options === void 0 ? void 0 : options.restartInterval) !== null && _b !== void 0 ? _b : 1000,
            dataInterval: (_c = options === null || options === void 0 ? void 0 : options.dataInterval) !== null && _c !== void 0 ? _c : 200,
        };
    }
    get connected() {
        return this._connected;
    }
    /**
     * Search for a balanceId that matches a port in portsMap.
     */
    find() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const balanceId = this.balanceIds.find((balance) => this.portsMap.has(balance));
            if (!balanceId) {
                return Promise.reject(new balanceError_1.BalanceError('None ports were a match with balanceIds provided'));
            }
            return balanceId;
        });
    }
    addBalance(balanceInfos) {
        const ids = balanceInfos instanceof Array ? balanceInfos : [balanceInfos];
        ids.forEach(({ portId, balanceModel }) => (this.balanceIds.push(new balanceId_1.BalanceId(portId, balanceModel))));
    }
    /**
     * Removes the first balance that it matches balanceInfo from balanceIds.
     */
    removeBalance(balanceInfo) {
        const balanceId = new balanceId_1.BalanceId(balanceInfo.portId, balanceInfo.balanceModel);
        const sameModelIds = this.balanceIds.filter((id) => id.model === balanceId.model);
        if (sameModelIds.length === 0)
            return;
        let toExcludeIndex;
        sameModelIds.find((id, index) => {
            const result = Object.entries(balanceId.port)
                .reduce((acc, [key, value]) => ((acc && value !== id.port[key]) ? false : acc), true);
            if (result)
                toExcludeIndex = index;
            return result;
        });
        if (typeof toExcludeIndex === 'number') {
            this.balanceIds.splice(toExcludeIndex, 1);
        }
    }
}
exports.BalanceManager = BalanceManager;
exports.default = BalanceManager;
//# sourceMappingURL=balanceManager.js.map