export function arrayEq(
  a: Uint8Array | ArrayLike<number> | string,
  b: Uint8Array | ArrayLike<number> | string,
): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
