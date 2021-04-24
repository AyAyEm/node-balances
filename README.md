# Node-balances

[![GitHub](https://img.shields.io/github/license/sapphire-project/framework)](https://github.com/AyAyEm/node-balances/blob/main/LICENSE)
[![npm version](https://badgen.net/npm/v/node-balances)](https://www.npmjs.com/package/node-balances)
[![npm downloads](https://badgen.net/npm/dt/node-balances)](https://www.npmjs.com/package/node-balances)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/AyAyEm/node-balances.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/AyAyEm/node-balances/context:javascript)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/AyAyEm/node-balances.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/AyAyEm/node-balances/alerts/)
[![dependencies](https://david-dm.org/AyAyEm/node-balances.svg)](https://www.npmjs.com/package/node-balances)

> Package designed to handle commercial scales, in an abstract way and using OO, so the user can build on top of what has already been made.

## Install

### Requirements:
- [node.js 12.x - 14.x](https://nodejs.org/)

```sh
npm install node-balances
```

## Example usage
```ts
// const { VidPidBalanceManager } = require('node-balances')
import { VidPidBalanceManager } from 'node-balances';

// change path and balanceModel relative to the connected balance
const manager = new VidPidBalanceManager([{
  balanceModel: 'UranoPop',
  portId: {
    vendorId: 'vendor',
    productId: 'product',
  },
}]);
manager.start();
manager.addListener('connect', (balance) => console.log(balance.balanceId.port));
manager.addListener('disconnect', (balance) => console.log(balance.balanceId.model));
manager.addListener('reading', (data) => console.log(data));
manager.addListener('error', (err) => console.log(err));
```

## Emulator usage
> You can use the emulator when you don't have a scale to test with.

Ts:
```ts
import type { PortInfo } from 'serialport';

import { GenericEmulator, VidPidBalanceManager } from 'node-balances';

const port: Partial<PortInfo> = {
  path: 'path',
  locationId: 'locationId',
  manufacturer: 'balanceManufacturer',
  pnpId: 'pnpId',
  productId: 'productId',
  serialNumber: 'serialNumber',
  vendorId: 'vendorId',
};
const manager = new VidPidBalanceManager([
  { balanceModel: 'Prix3', portId: port },
  { balanceModel: 'UranoPop', portId: port },
]);
const emulator = new GenericEmulator([port], manager);
emulator.connect();

manager.addListener('connect', (balance) => console.log(balance.balanceId.port));
manager.addListener('disconnect', (balance) => console.log(balance.balanceId.model));
manager.addListener('reading', (data) => console.log(data));
manager.addListener('error', (err) => console.log(err));
```
Js:
```js
const { GenericEmulator, VidPidBalanceManager } = require('node-balances');

const port = {
  path: 'path',
  locationId: 'locationId',
  manufacturer: 'balanceManufacturer',
  pnpId: 'pnpId',
  productId: 'productId',
  serialNumber: 'serialNumber',
  vendorId: 'vendorId',
};
const manager = new VidPidBalanceManager([
  { balanceModel: 'Prix3', portId: port },
  { balanceModel: 'UranoPop', portId: port },
]);
const emulator = new GenericEmulator([port], manager);
emulator.connect();

manager.addListener('connect', (balance) => console.log(balance.balanceId.port));
manager.addListener('disconnect', (balance) => console.log(balance.balanceId.model));
manager.addListener('reading', (data) => console.log(data));
manager.addListener('error', (err) => console.log(err));
```
# Api
TODO
***
