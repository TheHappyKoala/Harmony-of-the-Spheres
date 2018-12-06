export function getRandomColor() {
  let letters = '0123456789ABCDEF';
  const color = '#';

  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];

  return color;
}
