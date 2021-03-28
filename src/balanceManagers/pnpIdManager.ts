import SerialPort from 'serialport';
import _ from 'lodash';

import { PortsMap, BalanceManager } from '../structures';
import * as balanceModels from '../balancesModels';
import { BalanceError } from '../errors';

import type { BalanceModel } from '../structures';

/**
 * Designed to manage the variety of models into a single and standard way.
 * @example
 * const balanceManager = new BalanceManager(BalanceIds);
 * balanceManager.start();
 */
export class PnpBalanceManager extends BalanceManager {
  /**
   * Initiates the connection with the available balance.
   */
  public async start() {
    await this.generatePortsMap();

    this.find()
      .then(async (balanceId) => {
        const Balance = _.find(balanceModels, (balance) => balance.model === balanceId.model);

        const { path } = this.portsMap.get(balanceId);
        const currentBalance: BalanceModel = new Balance(balanceId, { path });

        currentBalance.addListener('reading', (data) => this.emit('reading', data));

        currentBalance.addListener('error', (err) => this.emit('error', err));

        currentBalance.addListener('disconnect', () => {
          this.emit('disconnect', currentBalance);
          currentBalance.removeAllListeners();
          this._connected = false;

          if (this.options.autoRestart) this.restart();
        });

        await currentBalance.connect().then(() => {
          this.emit('connect', currentBalance);
          this._connected = true;
        });
      })
      .catch((err) => {
        if (this.listenerCount('error') > 0) {
          this.emit('error', err);
        }

        if (this.options.autoRestart) this.restart();
      });
  }

  /**
   * Restarts the balance connection.
   */
  public async restart() {
    this.currentBalance?.removeAllListeners();
    setTimeout(() => this.start(), this.options.restartInterval);
  }

  public async find() {
    const balanceId = this.balanceIds.find((balance) => this.portsMap.has(balance));

    if (!balanceId) {
      return Promise.reject(new BalanceError('None ports were a match with balanceIds provided'));
    }

    return balanceId;
  }

  public async generatePortsMap() {
    this.portsMap = new PortsMap('pnpId', await SerialPort.list());
    return this;
  }
}
export default PnpBalanceManager;
