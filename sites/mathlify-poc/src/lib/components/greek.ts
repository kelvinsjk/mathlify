// supports numbers from 1 to 8
export function numberToGreek(x: number): string {
  if (!Number.isInteger(x) || x <= 0){
    throw new Error(`numberToGreek: x must be a positive integer. ${x} received.`);
  }
  if (x === 4) return `iv`;
  const firstLetter = x >= 5 ? 'v' : '';
  let postLetter = '';
  for (let i = x%5; i > 0; i--){
    postLetter += 'i';
  }
  return `${firstLetter}${postLetter}`;
}