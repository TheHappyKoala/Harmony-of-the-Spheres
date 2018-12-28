export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];

  return color;
}

export function getObjFromArrByKeyValuePair(arr, key, val) {
  return arr.filter(entry => entry[key].indexOf(val) > -1)[0];
}
