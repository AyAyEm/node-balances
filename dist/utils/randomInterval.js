"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomInterval = void 0;
function randomInterval(interval, toRound = true) {
    const [init, final] = interval;
    const result = (Math.random() * final - init) + init;
    return toRound ? Math.round(result) : result;
}
exports.randomInterval = randomInterval;
exports.default = randomInterval;
//# sourceMappingURL=randomInterval.js.map