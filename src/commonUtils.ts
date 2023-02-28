export const delay = (time: number) => {
  return new Promise<void>((resolve, reject) => {
    if (time) {
      setTimeout(() => resolve(), time);
    } else {
      reject("time is not defined");
    }
  });
};
export const isEmptyObject = (obj: {}) => Object.keys(obj).length === 0;
export const debouncedFunction = (
  fn: (...args: string[]) => void,
  delay: number
) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: string[]) => {
    console.log(timer);
    timer && clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
