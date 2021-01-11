import { EventEmitter } from 'events';

import type { BalanceReading } from './balanceReading';
import type { BalanceModel } from './balanceModel';
import type { BalanceError } from '../errors';

export interface BalanceEventEmitter extends EventEmitter {
  addListener(
    event: 'reading',
    listener: (reading: BalanceReading) => void,
  ): this;

  addListener(
    event: 'connect',
    listener: (balance: BalanceModel) => void,
  ): this;

  addListener(
    event: 'disconnect',
    listener: (balance: BalanceModel) => void,
  ): this;

  addListener(
    event: 'error',
    listener: (error: BalanceError) => void
  ): this;

  emit(event: 'reading', balanceReading: BalanceReading): boolean;

  emit(event: 'connect', balance: BalanceModel): boolean;

  emit(event: 'disconnect', balance: BalanceModel): boolean;

  emit(event: 'error', error: BalanceError): boolean;

  on(
    event: 'reading',
    listener: (reading: BalanceReading) => void,
  ): this;

  on(
    event: 'connect',
    listener: (balance: BalanceModel) => void,
  ): this;

  on(
    event: 'disconnect',
    listener: (balance: BalanceModel) => void,
  ): this;

  on(
    event: 'error',
    listener: (error: BalanceError) => void
  ): this;

}

export class BalanceEventEmitter extends EventEmitter { }
export default BalanceEventEmitter;
