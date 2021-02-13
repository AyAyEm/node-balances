"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortsMap = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const utils_1 = require("../utils");
/**
 * Map designed to use with a list of serial ports.
 */
class PortsMap {
    constructor(identifiers, ports) {
        this.map = new Map();
        if (identifiers instanceof Array) {
            this.identifiers = identifiers;
        }
        else {
            this.identifiers = [identifiers];
        }
        ports.forEach((port) => {
            const id = utils_1.getIdentifierFromPort(this.identifiers, port);
            this.map.set(id, port);
        });
    }
    get(balanceId) {
        if (utils_1.portHasIdentifiers(this.identifiers, balanceId.port)) {
            return this.map.get(utils_1.getIdentifierFromPort(this.identifiers, balanceId.port));
        }
        for (const port of this.map.values()) {
            if (lodash_1.default.isMatch(port, balanceId.port)) {
                return port;
            }
        }
        return null;
    }
    add(balanceId) {
        return this.map
            .set(utils_1.getIdentifierFromPort(this.identifiers, balanceId.port), balanceId.port);
    }
    has(id) {
        if (typeof id === 'string') {
            return this.map.has(id);
        }
        return Boolean(this.get(id));
    }
    delete(pnpId) {
        return this.map.delete(pnpId);
    }
}
exports.PortsMap = PortsMap;
exports.default = PortsMap;
//# sourceMappingURL=portsMap.js.map