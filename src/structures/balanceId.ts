import _ from 'lodash';

import type { PortInfo } from 'serialport';

import { BalanceError } from '../errors';
import * as models from '../balancesModels';

/**
 * The standard identification of a balance.
 */
export class BalanceId {
  public port: Partial<PortInfo>;

  public model: string;

  public constructor(portId: Partial<PortInfo>, balanceModel: string) {
    if (_.every(models, ({ model }) => model !== balanceModel)) {
      throw new BalanceError([
        `Balance model: ${balanceModel} not found in the possible models: `,
        Object.keys(models).join(', '),
      ].join(''));
    }

    this.model = balanceModel;
    this.port = portId;
  }
}
export default BalanceId;
