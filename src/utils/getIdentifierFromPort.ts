import type { PortInfo } from 'serialport';

import { portHasIdentifiers } from './portHasIdentifiers';

export function getIdentifierFromPort(
  identifiers: Array<keyof PortInfo>,
  port: Partial<PortInfo>,
) {
  if (!portHasIdentifiers(identifiers, port)) {
    return null;
  }

  return identifiers.map((id) => port[id]).join('');
}
export default getIdentifierFromPort;
