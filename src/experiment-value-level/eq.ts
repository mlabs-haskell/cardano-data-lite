function deepEq(x: unknown, y: unknown): boolean {
  if (typeof x != typeof y) return false;

  if (x === y) {
    return true;
  }

  if (x instanceof Array || x instanceof Uint8Array || x instanceof String) {
    return iterEq(x, y as typeof x);
  }

  if (x instanceof Object) {
    return objEq(x, y);
  }

  return false;
}

function objEq(x: any, y: any): boolean {
  let xKeys = Object.keys(x);
  let yKeys = Object.keys(y);
  if (xKeys.length != yKeys.length) return false;
  for (let key of xKeys) {
    if (!deepEq(x[key], y[key])) return false;
  }
  return true;
}

function iterEq<T, U extends Iterable<T>>(a: U, b: U) {
  let aiter = a[Symbol.iterator]();
  let biter = b[Symbol.iterator]();

  while (true) {
    let aNext = aiter.next();
    let bNext = biter.next();
    if (aNext.value != bNext.value) return false;
    if (aNext.done != bNext.done) return false;
    if (aNext.done) break;
  }
  return true;
}

export { deepEq, objEq, iterEq }
