"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceError = void 0;
/**
 * Error emitted when there's an inside error with the balance code.
 */
class BalanceError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'BalanceError';
    }
}
exports.BalanceError = BalanceError;
exports.default = BalanceError;
//# sourceMappingURL=balanceError.js.map