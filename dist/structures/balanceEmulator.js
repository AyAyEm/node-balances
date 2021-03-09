"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceEmulator = void 0;
const tslib_1 = require("tslib");
const serialport_1 = tslib_1.__importStar(require("serialport"));
const utils_1 = require("../utils");
const models_json_1 = tslib_1.__importDefault(require("../data/models.json"));
const MockBinding = require('@serialport/binding-mock');
/**
 * @description Debug tool mocking the balance to output data without the need of the real one.
 * @warning Don't use this in another environment than debug or testing.
 */
class BalanceEmulator {
    constructor(portIds, manager) {
        this._emittingData = models_json_1.default;
        this.loopIntervals = [];
        this.portIds = portIds;
        this.manager = manager;
    }
    get emittingData() {
        return this._emittingData;
    }
    /**
     * Start the emulation of the balances.
     */
    connect() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            serialport_1.default.Binding = MockBinding;
            serialport_1.default.prototype.pipe = function pipe(event) {
                this.addListener('data', (data) => event.emit('data', data));
                return this;
            };
            this.manager.addListener('connect', (balance) => {
                const emitData = () => {
                    if (this._emittingData instanceof Buffer) {
                        return balance.serialPort.binding.emitData(this._emittingData);
                    }
                    const { model } = balance.balanceId;
                    const modelData = this._emittingData[model].samples;
                    const toEmitData = modelData[utils_1.randomInterval([0, modelData.length - 1])];
                    return balance.serialPort.binding.emitData(Buffer.from(toEmitData.data));
                };
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
            this.portIds.forEach((port) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (typeof data === 'string') {
                this._emittingData = Buffer.from(data);
                return;
            }
            if (data instanceof Buffer) {
                this._emittingData = data;
                return;
            }
            const { weight, price, total } = data;
            const emittingData = this._emittingData.toString();
            const readingData = this.manager.currentBalance.match(emittingData);
            this._emittingData = Buffer.from(emittingData
                .replace(readingData.weight, weight.toFixed(3))
                .replace(readingData.price, price.toFixed(2))
                .replace(readingData.total, total.toFixed(2)));
        });
    }
    /**
     * Execute the close method from the current serialPort stream.
     */
    disconnectBalance() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.manager.currentBalance.serialPort.close();
        });
    }
    /**
     * Delete a balance from the portsMap.
     * @warning if the manager re-starts you'll have to remove it again.
     */
    removeBalance(balance) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { identifiers } = this.manager.portsMap;
            return this.manager.portsMap.delete(utils_1.getIdentifierFromPort(identifiers, balance.port));
        });
    }
    /**
     * Add a balance to the portsMap.
     * @warning if the manager re-starts you'll have to add it again.
     */
    addBalance(balance) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.manager.portsMap.add(balance);
        });
    }
    /**
     * Disconnect the emulator clearing all loopIntervals and restoring the default binding.
     */
    disconnect() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.loopIntervals.forEach((loop) => clearInterval(loop));
            this.loopIntervals = [];
            serialport_1.default.Binding = serialport_1.Binding;
        });
    }
}
exports.BalanceEmulator = BalanceEmulator;
exports.default = BalanceEmulator;
//# sourceMappingURL=balanceEmulator.js.map