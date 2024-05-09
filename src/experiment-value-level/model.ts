import { iterEq } from "./eq";

type SizeBytes = 0 | 1 | 2 | 4 | 8;
type CBORItem =
  | { type: "uint"; size: SizeBytes; value: bigint }
  | { type: "nint"; size: SizeBytes; value: bigint }
  | { type: "tstr"; size: SizeBytes | null; value: string }
  | { type: "bstr"; size: SizeBytes | null; value: Uint8Array }
  | { type: "array"; size: SizeBytes | null; value: CBORItem[] }
  | { type: "map"; size: SizeBytes | null; value: CBORMap }
  | { type: "boolean"; value: boolean }
  | { type: "null"; value: null }
  | { type: "undefined"; value: undefined }
  | { type: "float"; size: SizeBytes; value: number }
  | { type: "tagged"; tag: number; value: CBORItem };

type CBORType = CBORItem["type"];

type CBORItem_<T> = CBORItem & { type: T }

type ValueOf<T> = CBORItem_<T>["value"];

class MultiMap<K, V> {
  private items: [K, V][];
  private equalityFn: (x: K, y: K) => boolean;

  constructor(equalityFn: (x: K, y: K) => boolean, items?: [K, V][]) {
    if (items) {
      this.items = items;
    } else {
      this.items = [];
    }
    this.equalityFn = equalityFn;
  }

  get(key: K): V[] {
    let res = [];
    for (let [k, v] of this.items) {
      if (this.equalityFn(k, key)) {
        res.push(v);
      }
    }
    return res;
  }

  insert(key: K, value: V) {
    this.items.push([key, value]);
  }

  getItems(): [K, V][] {
    return this.items;
  }
}

class CBORMap extends MultiMap<CBORItem, CBORItem> {
  constructor(items?: [CBORItem, CBORItem][]) {
    super(cborEq, items)
  }
}

function cborEq(x: CBORItem, y: CBORItem): boolean {
  if (x.type != y.type) return false;
  let y_;
  switch (x.type) {
    case "uint":
    case "nint":
    case "tstr":
      return x.value == y.value
    case "bstr":
      y_ = y as CBORItem_<"bstr">;
      return iterEq(x.value, y_.value)
    case "array":
      y_ = y as CBORItem_<"array">;
      return iterEq(x.value, y_.value)
    case "map":
      y_ = y as CBORItem_<"map">;
      return iterEq(x.value.getItems(), y_.value.getItems())
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

function narrow<T extends CBORItem>(value: T, type: CBORType): T["value"] | null {
  if (value.type == type) {
    return value.value
  }
  return null
}

export {
  SizeBytes,
  CBORItem,
  CBORType,
  CBORItem_,
  MultiMap,
  CBORMap,
  ValueOf,
  cborEq,
  narrow,
}
