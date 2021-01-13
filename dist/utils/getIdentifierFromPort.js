"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIdentifierFromPort = void 0;
const portHasIdentifiers_1 = require("./portHasIdentifiers");
function getIdentifierFromPort(identifiers, port) {
    if (!portHasIdentifiers_1.portHasIdentifiers(identifiers, port)) {
        return null;
    }
    return identifiers.map((id) => port[id]).join('');
}
exports.getIdentifierFromPort = getIdentifierFromPort;
exports.default = getIdentifierFromPort;
//# sourceMappingURL=getIdentifierFromPort.js.map