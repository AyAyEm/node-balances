"use strict";
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
exports.BalanceEmulator = void 0;
const serialport_1 = __importDefault(require("serialport"));
const utils_1 = require("../utils");
const MockBinding = require('@serialport/binding-mock');
/**
 * @description Debug tool mocking the balance to output data without the need of the real one.
 * @warning Don't use this in another environment than debug or testing.
 */
class BalanceEmulator {
    constructor(portIds, manager) {
        this.loopIntervals = [];
        this.portIds = portIds;
        this.manager = manager;
        this.emittingData = Buffer.from('T2BN0           0,060 kg      0,00 N1     0,00 E');
    }
    /**
     * Start the emulation of the balances.
     */
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            serialport_1.default.Binding = MockBinding;
            serialport_1.default.prototype.pipe = function pipe(event) {
                this.addListener('data', (data) => event.emit('data', data));
                return this;
            };
            this.manager.addListener('connect', (balance) => {
                const emitData = () => balance.serialPort.binding.emitData(this.emittingData);
                emitData();
                const interval = setInterval(() => {
                    if (!balance.serialPort) {
                        clearInterval(interval);
                    }
                    else {
                        emitData();
                    }
                }, 200);
                this.loopIntervals.push(interval);
            });
            this.portIds.forEach((port) => __awaiter(this, void 0, void 0, function* () {
                MockBinding.createPort(port.path, {
                    vendorId: port.vendorId,
                    productId: port.productId,
                    record: true,
                });
            }));
            yield this.manager.start();
        });
    }
    setEmittingData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof data === 'string') {
                this.emittingData = Buffer.from(data);
                return;
            }
            if (data instanceof Buffer) {
                this.emittingData = data;
                return;
            }
            const { weight, price, total } = data;
            const emittingData = this.emittingData.toString();
            const readingData = this.manager.currentBalance.match(emittingData);
            this.emittingData = Buffer.from(emittingData
                .replace(readingData.weight, weight.toFixed(3))
                .replace(readingData.price, price.toFixed(2))
                .replace(readingData.total, total.toFixed(2)));
        });
    }
    /**
     * Execute the close method from the current serialPort stream.
     */
    disconnectBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.manager.currentBalance.serialPort.close();
        });
    }
    /**
     * Delete a balance from the portsMap.
     * @warning if the manager re-starts you'll have to remove it again.
     */
    removeBalance(balance) {
        return __awaiter(this, void 0, void 0, function* () {
            const { identifiers } = this.manager.portsMap;
            return this.manager.portsMap.delete(utils_1.getIdentifierFromPort(identifiers, balance.port));
        });
    }
    /**
     * Add a balance to the portsMap.
     * @warning if the manager re-starts you'll have to add it again.
     */
    addBalance(balance) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.manager.portsMap.add(balance);
        });
    }
    /**
     * Disconnect the emulator clearing all loopIntervals.
     */
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.loopIntervals.forEach((loop) => clearInterval(loop));
            this.loopIntervals = [];
        });
    }
}
exports.BalanceEmulator = BalanceEmulator;
exports.default = BalanceEmulator;
//# sourceMappingURL=balanceEmulator.js.map