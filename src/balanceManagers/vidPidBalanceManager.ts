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
export class VidPidBalanceManager extends BalanceManager {
  public portsMap: PortsMap;

  public currentBalance: BalanceModel;

  /**
   * Initiates the connection with the available balance.
   */
  public async start() {
    await this.generatePortsMap();

    this.find()
      .then(async (balanceId) => {
        const Balance = _.find(balanceModels, (balance) => (
          balance.model.toLowerCase() === balanceId.model.toLowerCase()));

        const { path } = this.portsMap.get(balanceId);
        this.currentBalance = new Balance(balanceId, { path });

        this.currentBalance.addListener('reading', (data) => this.emit('reading', data));

        this.currentBalance.addListener('error', (err) => this.emit('error', err));

        this.currentBalance.addListener('disconnect', () => {
          this.emit('disconnect', this.currentBalance);
          this.currentBalance.removeAllListeners();
          this.restart();
        });

        await this.currentBalance.connect().then(() => this.emit('connect', this.currentBalance));
      })
      .catch((err) => {
        if (this.listenerCount('error') > 0) this.emit('error', err);
        this.restart();
      });
  }

  /**
   * Restarts the balance connection.
   */
  public async restart() {
    this.currentBalance?.removeAllListeners();
    setTimeout(() => this.start(), 1000);
  }

  public async find() {
    const balanceId = this.balanceIds.find((balance) => this.portsMap.has(balance));

    if (!balanceId) {
      return Promise.reject(new BalanceError('none ports were a match with balanceIds provided'));
    }

    return balanceId;
  }

  public async generatePortsMap() {
    this.portsMap = new PortsMap(['vendorId', 'productId'], await SerialPort.list());
    return this;
  }
}
export default VidPidBalanceManager;
