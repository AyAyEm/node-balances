"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portHasIdentifiers = void 0;
function portHasIdentifiers(identifiers, port) {
    if (identifiers.every((id) => port[id])) {
        return true;
    }
    return false;
}
exports.portHasIdentifiers = portHasIdentifiers;
exports.default = portHasIdentifiers;
//# sourceMappingURL=portHasIdentifiers.js.map