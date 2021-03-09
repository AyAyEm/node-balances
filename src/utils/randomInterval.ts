export function randomInterval(interval: [number, number], toRound = true) {
  const [init, final] = interval;
  const result = (Math.random() * final - init) + init;

  return toRound ? Math.round(result) : result;
}
export default randomInterval;
