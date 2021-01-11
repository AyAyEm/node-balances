interface BalanceSettings {
  model: string;
  vendorId: string;
  productId: string;
  path: string;
}

export const balancePorts: BalanceSettings[] = [{
  model: 'uranoPop',
  vendorId: 'teste',
  productId: 'testing',
  path: '/dev/ROBOT',
}];
export default balancePorts;
