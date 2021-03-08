import type { PortInfo } from 'serialport';

import * as BalanceModels from '../src/balancesModels';
import { BalanceId, BalanceModel, GenericEmulator } from '../src';
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

// const emulator = new GenericEmulator([port], );

// const upperCaseFirstLetter = (string: string) => `${string[0].toUpperCase()}${string.slice(1)}`;

Object.entries(BalanceModels).forEach(([name, Model]) => {
  describe('Instance options', () => {
    const id = new BalanceId(port, name);

    test('Be a instanceof BalanceModel', () => {
      expect(new Model(id)).toBeInstanceOf(BalanceModel);
    });

    test('It shouldn\'t be able to pass a non balance id instance', () => {
      expect(() => new Model({ model: name, port })).toThrow();
    });
  });

  describe('Data output', () => {
    
  });
});
