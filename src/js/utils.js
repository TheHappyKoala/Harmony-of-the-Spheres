export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];

  return color;
}

export function getObjFromArrByKeyValuePair(arr, key, val) {
    // when scenario is passed as a bad URL with numbers or spaces, this will return NULL (which during JSON.parse is just read as 'undefined')
  return arr.filter(entry => entry[key].indexOf(val) > -1)[0];
}
