type SizeBytes = 0 | 1 | 2 | 4 | 8;
type CBORItem =
  | { type: "uint"; size: SizeBytes; value: bigint }
  | { type: "nint"; size: SizeBytes; value: bigint }
  | { type: "bstr"; size: SizeBytes | [number, SizeBytes][]; value: Uint8Array }
  | { type: "tstr"; size: SizeBytes | [number, SizeBytes][]; value: string }
  | { type: "array"; size: SizeBytes | null; value: CBORItem[] }
  | { type: "map"; size: SizeBytes | null; value: [CBORItem, CBORItem][] }
  | { type: "boolean"; value: boolean }
  | { type: "null"; value: null }
  | { type: "undefined"; value: undefined }
  | { type: "float"; size: 4 | 8; value: number }
  | { type: "tagged"; tag: number; value: CBORItem };

type CBORType = CBORItem["type"];

type CBORItem_<T> = CBORItem & { type: T }

type ValueOf<T> = CBORItem_<T>["value"];

function cborEq(x: CBORItem, y: CBORItem): boolean {
  if (x.type != y.type) return false;
  switch (x.type) {
    case "uint":
    case "nint":
    case "tstr":
      return x.value == y.value
    case "bstr":
      let yBstr = y as CBORItem_<"bstr">;
      return cborIterEq(x.value, yBstr.value)
    case "array":
      let yArray = y as CBORItem_<"array">;
      return cborIterEq(x.value, yArray.value);
    case "map":
      let yMap = y as CBORItem_<"map">;
      return cborIterEq(x.value, yMap.value);
    case "boolean":
      return x.value == y.value;
    case "null":
    case "undefined":
      // the type is equal, and type itself is the value
      return true
    case "float":
      return x.value == y.value
    case "tagged":
      let yTagged = y as CBORItem_<"tagged">;
      return x.tag == yTagged.tag && cborEq(x.value, yTagged.value)
  }
}

function cborIterEq<T, U extends Iterable<T>>(a: U, b: U) {
  let aiter = a[Symbol.iterator]();
  let biter = b[Symbol.iterator]();

  while (true) {
    let aNext = aiter.next();
    let bNext = biter.next();
    if (!cborEq(aNext.value, bNext.value)) return false;
    if (aNext.done != bNext.done) return false;
    if (aNext.done) break;
  }
  return true;
}

function narrow<V extends CBORItem, T extends CBORType>(value: V, type: T): CBORItem_<T> | null {
  if (value.type == type) {
    return value as CBORItem_<T>
  }
  return null
}

export {
  SizeBytes,
  CBORItem,
  CBORType,
  CBORItem_,
  ValueOf,
  cborEq,
  narrow,
}
