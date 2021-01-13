import fs from 'fs/promises';

fs.readFile('./samples/uranoPop/use-p2').then((data) => console.log(data));

console.log(Buffer.from('T2BN0           0,080 kg      0,00 N1     0,00 E'));

export default 'teste';
