import { CBORWriter } from "./writer";

export type CBORPrimitive =
  | bigint
  | number
  | string
  | null
  | boolean
  | undefined;

export type CBORNative = CBORPrimitive | Uint8Array;

export interface CBORCustom {
  toCBOR: (writer: CBORWriter) => void;
}

export type CBORValue = CBORNative | CBORCustom | CBORValue[];

export class CBORTagged<T extends CBORValue> implements CBORCustom {
  public tag: number;
  public value: T;

  constructor(tag: number, value: T) {
    this.tag = tag;
    this.value = value;
  }

  toCBOR(writer: CBORWriter) {
    writer.writeTagged(this.tag, this.value);
  }
}

export class CBORMap<K extends CBORValue, V extends CBORValue>
  implements CBORCustom
{
  public value: {
    keys: Map<string, K>;
    values: Map<string, V>;
  };

  constructor() {
    this.value = { keys: new Map(), values: new Map() };
  }

  get(key: K): V | undefined {
    return this.value.values.get(CBORWriter.toHex(key));
  }

  set(key: K, value: V) {
    let keyHex = CBORWriter.toHex(key);
    this.value.keys.set(keyHex, key);
    this.value.values.set(keyHex, value);
  }

  delete(key: K) {
    let id = CBORWriter.toHex(key);
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
    keys.sort((a, b) => CBORWriter.compare(a[1], b[1]));
    return keys;
  }

  toCBOR(writer: CBORWriter) {
    let keys = this.sortedKeys();

    let entries: [CBORValue, CBORValue][] = [];
    for (let [id, key] of keys) {
      let value = this.value.values.get(id)!;
      entries.push([key, value]);
    }

    writer.writeMap(entries);
  }

  map<K1 extends CBORValue, V1 extends CBORValue>(options: {
    key: (key: K) => K1;
    value: (value: V) => V1;
  }): CBORMap<K1, V1> {
    let map = new CBORMap<K1, V1>();
    for (let [id, key] of this.value.keys.entries()) {
      let value = this.value.values.get(id)!;
      map.set(options.key(key), options.value(value));
    }
    return map;
  }
}

export class CBORMultiMap<K extends CBORValue, V extends CBORValue>
  implements CBORCustom
{
  public entries: [K, V][];

  constructor() {
    this.entries = [];
  }

  get(key: K): V[] {
    return this.entries
      .filter((entry) => CBORWriter.compare(entry[0], key) === 0)
      .map((entry) => entry[1]);
  }

  add(key: K, value: V) {
    this.entries.push([key, value]);
  }

  delete(key: K, value: V) {
    this.entries = this.entries.filter(
      (item) =>
        !(
          CBORWriter.compare(item[0], key) === 0 &&
          CBORWriter.compare(item[1], value) === 0
        )
    );
  }

  deleteKey(key: K) {
    this.entries = this.entries.filter(
      (entry) => CBORWriter.compare(entry[0], key) !== 0
    );
  }

  size(): number {
    return this.entries.length;
  }

  sortedEntries(): [K, V][] {
    let entries = [...this.entries];
    entries.sort((a, b) => CBORWriter.compare(a, b));
    return entries;
  }

  toCBOR(writer: CBORWriter) {
    let entries = this.sortedEntries();

    writer.writeMap(entries);
  }

  map<K1 extends CBORValue, V1 extends CBORValue>(options: {
    key: (key: K) => K1;
    value: (value: V) => V1;
  }): CBORMultiMap<K1, V1> {
    let map = new CBORMultiMap<K1, V1>();
    for (let [key, value] of this.entries) {
      map.add(options.key(key), options.value(value));
    }
    return map;
  }
}
