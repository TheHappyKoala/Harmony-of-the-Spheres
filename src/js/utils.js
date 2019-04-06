export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];

  return color;
}

export function getObjFromArrByKeyValuePair(arr, key, val) {
  return arr.filter(entry => entry[key].indexOf(val) > -1)[0];
}

export function getTextureFromCanvas(callback) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const width = window.innerWidth;
  const height = window.innerHeight;

  callback(ctx, width, height);

  return canvas;
}

export function subtractDateFromAnotherDate(date1, date2) {
  return Math.abs(date2 - date1);
}

export function convertMillisecondsToYears(milliseconds) {
  return milliseconds / 31536000000;
}
