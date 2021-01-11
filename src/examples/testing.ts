import SerialPort from 'serialport';

const port5 = new SerialPort('COM5', () => {
  setInterval(() => port5.write('teste'), 500);
});

const port6 = new SerialPort('COM6', () => {
  port6.addListener('data', (data: Buffer) => console.log(data.toString()));
});
