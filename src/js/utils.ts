export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];

  return color;
}

export function getObjFromArrByKeyValuePair(arr: any[], key: string, val: any) {
  const obj = arr.filter(entry => entry[key].indexOf(val) > -1)[0];

  return typeof obj !== 'undefined' ? obj : {};
}

export function removeDuplicatesByKey(
  arr: { [x: string]: any }[],
  key: string
) {
  const trimmedArray = [];
  const values = [];

  const arrLen = arr.length;

  for (let i = 0; i < arrLen; i++) {
    let value = arr[i][key];

    if (values.indexOf(value) === -1) {
      trimmedArray.push(arr[i]);
      values.push(value);
    }
  }

  return trimmedArray;
}

export function getTextureFromCanvas(callback: Function) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const width = window.innerWidth;
  const height = window.innerHeight;

  callback(ctx, width, height);

  return canvas;
}

export function subtractDateFromAnotherDate(date1: number, date2: number) {
  return Math.abs(date2 - date1);
}

export function convertMillisecondsToYears(milliseconds: number) {
  return milliseconds / 31536000000;
}

export const getPaginationRange = (page: number, count: number) => {
  let start;
  let end;

  if (count <= 10) {
    start = 1;
    end = count;
  } else {
    if (page <= 6) {
      start = 1;
      end = 10;
    } else if (page + 4 >= count) {
      start = count - 9;
      end = count;
    } else {
      start = page - 5;
      end = page + 4;
    }
  }

  return { start, end };
};
