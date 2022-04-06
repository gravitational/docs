function debouncePromise(fn, time: number) {
  let timerId = undefined;

  return function debounced(...args) {
    if (timerId) {
      clearTimeout(timerId);
    }

    return new Promise((resolve) => {
      timerId = setTimeout(() => resolve(fn(...args)), time);
    });
  };
}

export const debounced = debouncePromise(
  (items) => Promise.resolve(items),
  500
);
