"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VidPidBalanceManager = void 0;
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
class VidPidBalanceManager extends structures_1.BalanceManager {
    /**
     * Initiates the connection with the available balance.
     */
    start() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.generatePortsMap();
            this.find()
                .then((balanceId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const Balance = lodash_1.default.find(balanceModels, (balance) => (balance.model.toLowerCase() === balanceId.model.toLowerCase()));
                const { path } = this.portsMap.get(balanceId);
                this.currentBalance = new Balance(balanceId, { path });
                this.currentBalance.addListener('reading', (data) => this.emit('reading', data));
                this.currentBalance.addListener('error', (err) => this.emit('error', err));
                this.currentBalance.addListener('disconnect', () => {
                    this.emit('disconnect', this.currentBalance);
                    this.currentBalance.removeAllListeners();
                    this.restart();
                });
                yield this.currentBalance.connect().then(() => this.emit('connect', this.currentBalance));
            }))
                .catch((err) => {
                if (this.listenerCount('error') > 0)
                    this.emit('error', err);
                this.restart();
            });
        });
    }
    /**
     * Restarts the balance connection.
     */
    restart() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.currentBalance.removeAllListeners();
            setTimeout(() => this.start(), 1000);
        });
    }
    find() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const balanceId = this.balanceIds.find((balance) => this.portsMap.has(balance));
            if (!balanceId) {
                return Promise.reject(new errors_1.BalanceError('none ports were a match with balanceIds provided'));
            }
            return balanceId;
        });
    }
    generatePortsMap() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.portsMap = new structures_1.PortsMap(['vendorId', 'productId'], yield serialport_1.default.list());
            return this;
        });
    }
}
exports.VidPidBalanceManager = VidPidBalanceManager;
exports.default = VidPidBalanceManager;
//# sourceMappingURL=vidPidBalanceManager.js.map