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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VidPidBalanceManager = void 0;
const serialport_1 = __importDefault(require("serialport"));
const lodash_1 = __importDefault(require("lodash"));
const structures_1 = require("../structures");
const balanceModels = __importStar(require("../balancesModels"));
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
        return __awaiter(this, void 0, void 0, function* () {
            yield this.generatePortsMap();
            this.find()
                .then((balanceId) => __awaiter(this, void 0, void 0, function* () {
                const Balance = lodash_1.default.find(balanceModels, (balance) => balance.model === balanceId.model);
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
        return __awaiter(this, void 0, void 0, function* () {
            this.currentBalance.removeAllListeners();
            setTimeout(() => this.start(), 1000);
        });
    }
    find() {
        return __awaiter(this, void 0, void 0, function* () {
            const balanceId = this.balanceIds.find((balance) => this.portsMap.has(balance));
            if (!balanceId) {
                return Promise.reject(new errors_1.BalanceError('none ports were a match with balanceIds provided'));
            }
            return balanceId;
        });
    }
    generatePortsMap() {
        return __awaiter(this, void 0, void 0, function* () {
            this.portsMap = new structures_1.PortsMap(['vendorId', 'productId'], yield serialport_1.default.list());
            return this;
        });
    }
}
exports.VidPidBalanceManager = VidPidBalanceManager;
exports.default = VidPidBalanceManager;
//# sourceMappingURL=vidPidBalanceManager.js.map