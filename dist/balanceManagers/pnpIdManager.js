"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PnpBalanceManager = void 0;
const tslib_1 = require("tslib");
const serialport_1 = tslib_1.__importDefault(require("serialport"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const structures_1 = require("../structures");
const balanceModels = tslib_1.__importStar(require("../balancesModels"));
const errors_1 = require("../errors");
/**
 * Designed to manage the variety of models into a single and standard way.
 * @example
 * const balanceManager = new BalanceManager(BalanceIds);
 * balanceManager.start();
 */
class PnpBalanceManager extends structures_1.BalanceManager {
    /**
     * Initiates the connection with the available balance.
     */
    start() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.generatePortsMap();
            this.find()
                .then((balanceId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const Balance = lodash_1.default.find(balanceModels, (balance) => balance.model === balanceId.model);
                const { path } = this.portsMap.get(balanceId);
                const currentBalance = new Balance(balanceId, { path });
                currentBalance.addListener('reading', (data) => this.emit('reading', data));
                currentBalance.addListener('error', (err) => this.emit('error', err));
                currentBalance.addListener('disconnect', () => {
                    this.emit('disconnect', currentBalance);
                    currentBalance.removeAllListeners();
                    this._connected = false;
                    if (this.options.autoRestart)
                        this.restart();
                });
                yield currentBalance.connect().then(() => {
                    this.emit('connect', currentBalance);
                    this._connected = true;
                });
            }))
                .catch((err) => {
                if (this.listenerCount('error') > 0) {
                    this.emit('error', err);
                }
                if (this.options.autoRestart)
                    this.restart();
            });
        });
    }
    /**
     * Restarts the balance connection.
     */
    restart() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            (_a = this.currentBalance) === null || _a === void 0 ? void 0 : _a.removeAllListeners();
            setTimeout(() => this.start(), this.options.restartInterval);
        });
    }
    find() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const balanceId = this.balanceIds.find((balance) => this.portsMap.has(balance));
            if (!balanceId) {
                return Promise.reject(new errors_1.BalanceError('None ports were a match with balanceIds provided'));
            }
            return balanceId;
        });
    }
    generatePortsMap() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.portsMap = new structures_1.PortsMap('pnpId', yield serialport_1.default.list());
            return this;
        });
    }
}
exports.PnpBalanceManager = PnpBalanceManager;
exports.default = PnpBalanceManager;
//# sourceMappingURL=pnpIdManager.js.map