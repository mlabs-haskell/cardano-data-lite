import { iterEq } from "./eq";

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
  let y_; // TODO: Fix type
  switch (x.type) {
    case "uint":
    case "nint":
    case "tstr":
      return x.value == y.value
    case "bstr":
      y_ = y as CBORItem_<"bstr">;
      return iterEq(x.value, y_.value) // TODO: Broken
    case "array":
      y_ = y as CBORItem_<"array">;
      return iterEq(x.value, y_.value) // TODO: Broken
    case "map":
      y_ = y as CBORItem_<"map">;
      return iterEq(x.value, y_.value) // TODO: Broken
    case "boolean":
      return x.value == y.value;
    case "null":
    case "undefined":
      // the type is equal, and type itself is the value
      return true
    case "float":
      return x.value == y.value
    case "tagged":
      y_ = y as CBORItem_<"tagged">;
      return x.tag == y_.tag && cborEq(x.value, y_.value)
  }
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
