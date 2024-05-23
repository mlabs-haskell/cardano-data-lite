import { CBORItem, CBORType, SizeBytes } from "../cbor/model";

export type CompareResult = -1 | 0 | 1;

export interface XValue {
  // A string denoting the type
  // No two different classes may have the same type ids.
  // Ordering of XValues are defined by lexicographically sorting using
  // the type id first and then comparing the inner value of the particular
  // instance of XValue
  typeId(): string;
  toCBOR(): CBORItem;
  compare(other: XValue): CompareResult;
  // This will be used internally as a key to the JS Map type
  // when an XValue is used as a key in a CBOR Map.
  // This is needed because complex objects can be a key in a CBOR Map, but not in JS Map.
  // **Important**
  // This must be defined in such a way that there can be no three values so that
  // a.toId() + x + b.toId() = c.toId(), where x can be any string including the empty string
  toId(): string;
}

function minBytes(value: number): SizeBytes {
  if (value < 0x18) return 0;
  let nBytes = Math.ceil(Math.log2(value));
  if (nBytes <= 1) return 1;
  if (nBytes <= 2) return 2;
  if (nBytes <= 4) return 4;
  return 8;
}

function minBytesBig(value: bigint): SizeBytes {
  if (value < 0n) value = -value;
  if (value < 0x18) return 0;
  let nBits = value.toString(2).length;
  let nBytes = nBits / 8;
  if (nBytes <= 1) return 1;
  if (nBytes <= 2) return 2;
  if (nBytes <= 4) return 4;
  return 8;
}

export class XInt implements XValue {
  public value: bigint;

  constructor(value: bigint) {
    this.value = value;
  }

  typeId(): string {
    return "int";
  }

  toCBOR(): CBORItem {
    return {
      type: this.value < 0 ? "nint" : "uint",
      size: minBytesBig(this.value),
      value: this.value,
    };
  }

  compare(other: XValue): CompareResult {
    if (this.typeId < other.typeId) return -1;
    if (this.typeId > other.typeId) return 1;
    if (other instanceof XInt) {
      if (this.value < other.value) return -1;
      if (this.value > other.value) return 1;
      return 0;
    } else {
      throw "Unreachable";
    }
  }

  toId(): string {
    return "int:" + this.value.toString(16);
  }
}

export class XBStr implements XValue {
  public value: Uint8Array;

  constructor(value: Uint8Array) {
    this.value = value;
  }

  typeId(): string {
    return "bstr";
  }

  toCBOR(): CBORItem {
    return {
      type: "bstr",
      size: minBytes(this.value.length),
      value: this.value,
    };
  }

  compare(other: XValue): CompareResult {
    if (this.typeId() < other.typeId()) return -1;
    if (this.typeId() > other.typeId()) return 1;
    if (other instanceof XBStr) {
      const minLength = Math.min(this.value.length, other.value.length);
      for (let i = 0; i < minLength; i++) {
        if (this.value[i] < other.value[i]) return -1;
        if (this.value[i] > other.value[i]) return 1;
      }
      if (this.value.length < other.value.length) return -1;
      if (this.value.length > other.value.length) return 1;
      return 0;
    } else {
      throw "Unreachable";
    }
  }

  toId(): string {
    let hexValue = Array.from(this.value, (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");
    return "bstr:" + hexValue;
  }
}

export class XTStr implements XValue {
  public value: string;

  constructor(value: string) {
    this.value = value;
  }

  typeId(): string {
    return "tstr";
  }

  toCBOR(): CBORItem {
    return {
      type: "tstr",
      size: minBytes(this.value.length),
      value: this.value,
    };
  }

  compare(other: XValue): CompareResult {
    if (this.typeId() < other.typeId()) return -1;
    if (this.typeId() > other.typeId()) return 1;
    if (other instanceof XTStr) {
      const minLength = Math.min(this.value.length, other.value.length);
      for (let i = 0; i < minLength; i++) {
        if (this.value[i] < other.value[i]) return -1;
        if (this.value[i] > other.value[i]) return 1;
      }
      if (this.value.length < other.value.length) return -1;
      if (this.value.length > other.value.length) return 1;
      return 0;
    } else {
      throw "Unreachable";
    }
  }

  toId(): string {
    return (
      "tstr:" + '"' + this.value.replace("\\", "\\\\").replace('"', '\\"') + '"'
    );
  }
}

export class XBoolean implements XValue {
  public value: boolean;

  constructor(value: boolean) {
    this.value = value;
  }

  typeId(): string {
    return "boolean";
  }

  toCBOR(): CBORItem {
    return {
      type: "boolean",
      value: this.value,
    };
  }

  compare(other: XValue): CompareResult {
    if (this.typeId() < other.typeId()) return -1;
    if (this.typeId() > other.typeId()) return 1;
    if (other instanceof XBoolean) {
      return this.value === other.value ? 0 : this.value ? 1 : -1;
    } else {
      throw "Unreachable";
    }
  }

  toId(): string {
    return "boolean:" + this.value;
  }
}

export class XNull implements XValue {
  constructor() {}

  typeId(): string {
    return "null";
  }

  toCBOR(): CBORItem {
    return {
      type: "null",
      value: null,
    };
  }

  compare(other: XValue): CompareResult {
    if (this.typeId() < other.typeId()) return -1;
    if (this.typeId() > other.typeId()) return 1;
    if (other instanceof XNull) {
      return 0;
    } else {
      throw "Unreachable";
    }
  }

  toId(): string {
    return "null";
  }
}

export class XUndefined implements XValue {
  constructor() {}

  typeId(): string {
    return "undefined";
  }

  toCBOR(): CBORItem {
    return {
      type: "undefined",
      value: undefined,
    };
  }

  compare(other: XValue): CompareResult {
    if (this.typeId() < other.typeId()) return -1;
    if (this.typeId() > other.typeId()) return 1;
    if (other instanceof XUndefined) {
      return 0;
    } else {
      throw "Unreachable";
    }
  }

  toId(): string {
    return "undefined";
  }
}

export class XFloat implements XValue {
  public value: number;

  constructor(value: number) {
    this.value = value;
  }

  typeId(): string {
    return "float";
  }

  toCBOR(): CBORItem {
    return {
      type: "float",
      // we don't try to encode the float to the smallest possible size because JS doesn't support f16 or f32 types.
      // we will add this if deemed needed later.
      size: 8,
      value: this.value,
    };
  }

  compare(other: XValue): CompareResult {
    if (this.typeId() < other.typeId()) return -1;
    if (this.typeId() > other.typeId()) return 1;
    if (other instanceof XFloat) {
      return this.value === other.value ? 0 : this.value < other.value ? -1 : 1;
    } else {
      throw "Unreachable";
    }
  }

  toId(): string {
    return "float:" + this.value;
  }
}

export class XTagged<T extends XValue> implements XValue {
  public tag: number;
  public value: T;

  constructor(tag: number, value: T) {
    this.tag = tag;
    this.value = value;
  }

  typeId(): string {
    return "tagged";
  }

  toCBOR(): CBORItem {
    return {
      type: "tagged",
      tag: this.tag,
      value: this.value.toCBOR(),
    };
  }

  compare(other: XValue): CompareResult {
    if (this.typeId() < other.typeId()) return -1;
    if (this.typeId() > other.typeId()) return 1;
    if (other instanceof XTagged) {
      if (this.tag !== other.tag) return this.tag < other.tag ? -1 : 1;
      return this.value.compare(other.value);
    } else {
      throw "Unreachable";
    }
  }

  toId(): string {
    return "tagged:" + this.tag + ":" + this.value.toId();
  }
}

export class XArray<T extends XValue> implements XValue {
  public value: T[];

  constructor(value: T[]) {
    this.value = value;
  }

  typeId(): string {
    return "array";
  }

  toCBOR(): CBORItem {
    return {
      type: "array",
      size: minBytes(this.value.length),
      value: this.value.map((v) => v.toCBOR()),
    };
  }

  compare(other: XValue): CompareResult {
    if (this.typeId() < other.typeId()) return -1;
    if (this.typeId() > other.typeId()) return 1;
    if (other instanceof XArray) {
      const minLength = Math.min(this.value.length, other.value.length);
      for (let i = 0; i < minLength; i++) {
        const cmp = this.value[i].compare(other.value[i]);
        if (cmp !== 0) return cmp;
      }
      if (this.value.length < other.value.length) return -1;
      if (this.value.length > other.value.length) return 1;
      return 0;
    } else {
      throw "Unreachable";
    }
  }

  toId(): string {
    return "array:" + this.value.map((v) => v.toId()).join(":");
  }
}

export class XMap<K extends XValue, V extends XValue> implements XValue {
  public value: {
    keys: Map<string, K>;
    values: Map<string, V>;
  };

  constructor() {
    this.value = { keys: new Map(), values: new Map() };
  }

  get(key: K): V | undefined {
    return this.value.values.get(key.toId());
  }

  set(key: K, value: V) {
    this.value.keys.set(key.toId(), key);
    this.value.values.set(key.toId(), value);
  }

  delete(key: K) {
    let id = key.toId();
    if (this.value.keys.has(id)) {
      this.value.keys.delete(id);
      this.value.values.delete(id);
    }
  }

  size(): number {
    return this.value.keys.size;
  }

  sortedKeys(): [string, K][] {
    let keys = Array.from(this.value.keys.entries());
    keys.sort((a, b) => a[1].compare(b[1]));
    return keys;
  }

  typeId(): string {
    return "map";
  }

  toCBOR(): CBORItem {
    let keys = this.sortedKeys();

    let cborValue: [CBORItem, CBORItem][] = [];
    for (let [id, key] of keys) {
      let value = this.value.values.get(id)!;
      cborValue.push([key.toCBOR(), value.toCBOR()]);
    }

    return {
      type: "map",
      size: minBytes(this.value.keys.size),
      value: cborValue,
    };
  }

  compare(other: XValue): CompareResult {
    let keys = this.sortedKeys();

    if (this.typeId() < other.typeId()) return -1;
    if (this.typeId() > other.typeId()) return 1;
    if (other instanceof XMap) {
      let otherKeys = other.sortedKeys();
      let minLength = Math.min(keys.length, otherKeys.length);
      for (let i = 0; i < minLength; i++) {
        let [thisId, thisKey] = keys[i];
        let [otherId, otherKey] = otherKeys[i];
        let cmp = thisKey.compare(otherKey);
        if (cmp != 0) return cmp;
        let thisValue = this.value.values.get(thisId)!;
        let otherValue = other.value.values.get(otherId)!;
        cmp = thisValue.compare(otherValue);
        if (cmp != 0) return cmp;
      }
      if (keys.length < otherKeys.length) return -1;
      if (keys.length > otherKeys.length) return 1;
      return 0;
    } else {
      throw "Unreachable";
    }
  }

  toId(): string {
    let entries = this.sortedKeys()
      .map(([id, key]) => [key, this.value.values.get(id)!])
      .map(([key, value]) => key.toId() + ":" + value.toId());
    return "map:" + entries.join(":");
  }
}

export class XMultiMap<K extends XValue, V extends XValue> implements XValue {
  public value: {
    keys: Map<string, K>;
    values: Map<string, Map<string, V>>;
  };

  constructor() {
    this.value = { keys: new Map(), values: new Map() };
  }

  get(key: K): Map<string, V> | undefined {
    return this.value.values.get(key.toId());
  }

  insert(key: K, value: V) {
    if (!this.value.keys.has(key.toId())) {
      this.value.keys.set(key.toId(), key);
      this.value.values.set(key.toId(), new Map());
    }
    this.value.values.get(key.toId())!.set(value.toId(), value);
  }

  delete(key: K, value: V) {
    if (!this.value.keys.has(key.toId())) {
      return;
    }
    let valueSet = this.value.values.get(key.toId())!;
    valueSet.delete(value.toId());
    if (valueSet.size == 0) {
      this.value.keys.delete(key.toId());
      this.value.values.delete(key.toId());
    }
  }

  sortedKeys(): [string, K][] {
    let keys = Array.from(this.value.keys.entries());
    keys.sort((a, b) => a[1].compare(b[1]));
    return keys;
  }

  sortedValues(keyId: string): [string, V][] {
    let values = Array.from(this.value.values.get(keyId)!.entries());
    values.sort((a, b) => a[1].compare(b[1]));
    return values;
  }

  typeId(): string {
    return "multimap";
  }

  toCBOR(): CBORItem {
    let keys = this.sortedKeys();

    let cborValue: [CBORItem, CBORItem][] = [];
    for (let [id, key] of keys) {
      let values = this.sortedValues(id);
      for (let [_id, value] of values) {
        cborValue.push([key.toCBOR(), value.toCBOR()]);
      }
    }

    return {
      type: "map",
      size: minBytes(this.value.keys.size),
      value: cborValue,
    };
  }

  compare(other: XValue): CompareResult {
    let keys = this.sortedKeys();

    if (this.typeId() < other.typeId()) return -1;
    if (this.typeId() > other.typeId()) return 1;

    if (other instanceof XMultiMap) {
      let otherKeys = other.sortedKeys();
      let minLength = Math.min(keys.length, otherKeys.length);
      for (let i = 0; i < minLength; i++) {
        let [thisId, thisKey] = keys[i];
        let [otherId, otherKey] = otherKeys[i];
        let cmp = thisKey.compare(otherKey);
        if (cmp != 0) return cmp;

        let thisValues = this.sortedValues(thisId)!;
        let otherValues = other.sortedValues(thisId)!;

        let minLengthValues = Math.min(thisValues.length, otherValues.length);
        for (let j = 0; j < minLengthValues; j++) {
          let [_thisValueId, thisValue] = thisValues[j];
          let [_otherValueId, otherValue] = otherValues[j];
          let cmp = thisValue.compare(otherValue);
          if (cmp != 0) return cmp;
        }
        if (thisValues.length < otherValues.length) return -1;
        if (thisValues.length > otherValues.length) return 1;
      }
      if (keys.length < otherKeys.length) return -1;
      if (keys.length > otherKeys.length) return 1;
      return 0;
    } else {
      throw "Unreachable";
    }
  }

  toId(): string {
    let entries = this.sortedKeys().map(
      ([id, key]) =>
        key.toId() +
        this.sortedValues(id)
          .map(([_vId, v]) => v.toId())
          .join(":")
    );
    return "map:" + entries.join(":");
  }
}
