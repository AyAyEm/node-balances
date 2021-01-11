import type { PortInfo } from 'serialport';

export function portHasIdentifiers(identifiers: Array<keyof PortInfo>, port: Partial<PortInfo>) {
  if (identifiers.every((id) => port[id])) {
    return true;
  }

  return false;
}
export default portHasIdentifiers;
