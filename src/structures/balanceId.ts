import type { PortInfo } from 'serialport';

import { BalanceError } from '../errors';
import * as models from '../data/models.json';

import { BalanceModels } from '../types';

/**
 * The standard identification of a balance.
 */
export class BalanceId {
  public port: Partial<PortInfo>;

  public model: keyof typeof BalanceModels;

  public constructor(portId: Partial<PortInfo>, balanceModel: BalanceId['model']) {
    if (Object.keys(models).every((model) => model.toLowerCase() !== balanceModel.toLowerCase())) {
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
