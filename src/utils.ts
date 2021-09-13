export const getRandomColor = (): string => {
  const letters = "0123456789ABCDEF";
  let color = "#";

  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];

  return color;
};

export const getObjFromArrByKeyValuePair = (
  arr: any[],
  key: string,
  val: any
) => {
  const obj = arr.filter(entry => entry[key].indexOf(val) > -1)[0];

  return typeof obj !== "undefined" ? obj : {};
};

export const removeDuplicatesByKey = (
  arr: { [x: string]: any }[],
  key: string
): { [x: string]: any }[] => {
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
};

export const getTextureFromCanvas = (
  callback: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => void
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const width = window.innerWidth;
  const height = window.innerHeight;

  callback(ctx, width, height);

  return canvas;
};

export const subtractDateFromAnotherDate = (
  date1: number,
  date2: number
): number => Math.abs(date2 - date1);

export const convertMillisecondsToYears = (milliseconds: number): number =>
  milliseconds / 31536000000;

export const getPaginationRange = (
  page: number,
  count: number
): { start: number; end: number } => {
  let start;
  let end;

  if (count <= 3) {
    start = 1;
    end = count;
  } else {
    if (page <= 2) {
      start = 1;
      end = 3;
    } else if (page + 1 >= count) {
      start = count - 2;
      end = count;
    } else {
      start = page - 1;
      end = page + 1;
    }
  }

  return { start, end };
};

export const linspace = (x1: number, x2: number, n: number) => {
  let result = [x1];
  const diff = (x2 - x1) / (n - 1);
  for (let i = 0; i < n-1; i++) {
    result.push(result[result.length-1] + diff)
  }
  return result
}

export const logspace = (e1: number, e2: number, n: number) => {
  // e1 and e2 are the logarithms of x1 and x2 (base 10)
  const exponents = linspace(e1, e2, n)
  return exponents.map((e) => Math.pow(10, e))
}

export const geomspace = (x1: number, x2: number, n: number) => {
  // same as logspace, except you pass in x1 and x2 as is and log is taken internally.
  return logspace(Math.log10(x1), Math.log10(x2), n)
}

export const getRangeValues = (min: number, max: number, nButtons: number) => {
  if (max/2 < min) {
    return geomspace(min, max, nButtons)
  } else {
    return geomspace(min, max/2, nButtons-1).concat([max])
  }
}