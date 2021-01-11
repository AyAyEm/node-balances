import SerialPort from 'serialport';
import { EventEmitter } from 'events';

const MockBinding = require('@serialport/binding-mock');

const binding = new MockBinding({});
SerialPort.Binding = MockBinding;

MockBinding.createPort('/dev/ROBOT', { vendorId: 'teste vendor', productId: 'teste product' });

const event = new EventEmitter();

binding.open('/dev/ROBOT', { baudRate: 15000 }).then(() => {
  binding.emitData('test\n');
  event.emit('teste');
});

event.addListener('teste', () => {
  binding.emitData('testing\n');
});

event.addListener('teste', () => {
  process.nextTick(() => event.emit('teste'));
});

const port = new SerialPort('/dev/ROBOT', { baudRate: 15000 });
port.addListener('data', (data) => {
  console.log(data.toString());
});

export default 'testing';
