import { mapSeries } from 'async';

import type { PortInfo } from 'serialport';

import * as BalanceModels from '../src/balancesModels';
import {
  BalanceId,
  BalanceModel,
  GenericEmulator,
  VidPidBalanceManager,
} from '../src';
import modelsData from '../src/data/models.json';

const port: PortInfo = {
  path: 'path',
  locationId: 'locationId',
  manufacturer: 'balanceManufacturer',
  pnpId: 'pnpId',
  productId: 'productId',
  serialNumber: 'serialNumber',
  vendorId: 'vendorId',
};

describe.each(Object.values(BalanceModels))('Balance models tests', (Model) => {
  describe(`Instance options of model: ${Model.model}`, () => {
    const id = new BalanceId(port, Model.model);

    test('Be a instanceof BalanceModel', () => {
      expect(new Model(id)).toBeInstanceOf(BalanceModel);
    });

    test('It shouldn\'t be able to pass a non balance id instance', () => {
      expect(() => new Model({ model: Model.model, port })).toThrow();
    });
  });

  describe(`Data output of model: ${Model.model}`, () => {
    const manager = new VidPidBalanceManager([{ balanceModel: Model.model, portId: port }]);
    const emulator = new GenericEmulator([port], manager);

    const results = mapSeries(modelsData[Model.model].samples, async (sample) => {
      await emulator.setEmittingData(Buffer.from(sample.data));
      await emulator.connect();

      return new Promise((resolve) => {
        manager.once('reading', () => resolve(true));
        manager.once('error', () => resolve(false));
      })
        .then(async (result) => {
          manager.removeAllListeners();
          await emulator.disconnect();

          return result;
        });
    });

    test('It should return a reading out of it\'s sample', () => (
      expect(async () => (await results).every((result) => result)).toBeTruthy()));
  });
});
