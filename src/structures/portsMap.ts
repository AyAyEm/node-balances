import _ from 'lodash';

import type { PortInfo } from 'serialport';

import { getIdentifierFromPort, portHasIdentifiers } from '../utils';

import type { BalanceId } from './balanceId';

/**
 * Map designed to use with a list of serial ports.
 */
export class PortsMap {
  public map: Map<string, PortInfo> = new Map();

  public identifiers: Array<keyof PortInfo>;

  public constructor(identifier: keyof PortInfo, ports: PortInfo[]);
  public constructor(identifiers: Array<keyof PortInfo>, ports: PortInfo[]);
  public constructor(identifiers: Array<keyof PortInfo> | keyof PortInfo, ports: PortInfo[]) {
    if (identifiers instanceof Array) {
      this.identifiers = identifiers;
    } else {
      this.identifiers = [identifiers];
    }

    ports.forEach((port) => {
      const id = getIdentifierFromPort(this.identifiers, port);
      this.map.set(id, port);
    });
  }

  public get(balanceId: BalanceId): PortInfo {
    if (portHasIdentifiers(this.identifiers, balanceId.port)) {
      return this.map.get(getIdentifierFromPort(this.identifiers, balanceId.port));
    }

    for (const port of this.map.values()) {
      if (_.isMatch(port, balanceId.port)) {
        return port;
      }
    }

    return null;
  }

  public has(balanceId: BalanceId): boolean;
  public has(pnpId: string): boolean;
  public has(id: BalanceId | string): boolean {
    if (typeof id === 'string') {
      return this.map.has(id);
    }

    return Boolean(this.get(id));
  }

  public delete(pnpId: string) {
    return this.map.delete(pnpId);
  }
}
export default PortsMap;
