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
  public tag: bigint;
  public value: T;

  constructor(tag: bigint, value: T) {
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
  protected entries_: [K, V][];
  public predicate?: (key: K, value: V) => boolean;

  protected constructor(
    entries: [K, V][] = [],
    predicate?: (key: K, value: V) => boolean,
  ) {
    if (predicate != null) {
      this.entries_ = entries.filter(([key, value]) => predicate(key, value));
    } else {
      this.entries_ = [...entries];
    }
    this.predicate = predicate;
  }

  static newEmpty<K extends CBORValue, V extends CBORValue>(): CBORMap<K, V> {
    return new CBORMap([]);
  }

  entries(): [K, V][] {
    return this.entries_;
  }

  get(key: K): V | undefined {
    let entry = this.entries_.find(
      (entry) => CBORWriter.compare(entry[0], key) === 0,
    );
    return entry != null ? entry[1] : undefined;
  }

  set(key: K, value: V) {
    if (this.predicate && !this.predicate(key, value)) {
      this.delete(key);
      return;
    }

    for (let entry of this.entries_) {
      if (CBORWriter.compare(key, entry[0]) === 0) {
        entry[1] = value;
        return;
      }
    }
    this.entries_.push([key, value]);
  }

  delete(key: K) {
    this.entries_ = this.entries_.filter(
      (item) => !(CBORWriter.compare(item[0], key) === 0),
    );
  }

  size(): number {
    return this.entries_.length;
  }

  sortedEntries(): [K, V][] {
    let entries = [...this.entries_];
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
    predicate?: (key: K1, value: V1) => boolean;
  }): CBORMap<K1, V1> {
    return new CBORMap(
      this.entries_.map(([key, value]) => [
        options.key(key),
        options.value(value),
      ]),
      options.predicate,
    );
  }

  filter(predicate: (key: K, value: V) => boolean): CBORMap<K, V> {
    return new CBORMap(
      this.entries_.filter(([key, value]) => predicate(key, value)),
    );
  }
}

export class CBORMultiMap<K extends CBORValue, V extends CBORValue>
  implements CBORCustom
{
  public entries_: [K, V][];

  protected constructor(entries: [K, V][] = []) {
    this.entries_ = [...entries];
  }

  static newEmpty<K extends CBORValue, V extends CBORValue>(): CBORMultiMap<
    K,
    V
  > {
    return new CBORMultiMap([]);
  }

  entries(): [K, V][] {
    return this.entries_;
  }

  get(key: K): V[] {
    return this.entries_
      .filter((entry) => CBORWriter.compare(entry[0], key) === 0)
      .map((entry) => entry[1]);
  }

  add(key: K, value: V) {
    this.entries_.push([key, value]);
  }

  delete(key: K, value: V) {
    this.entries_ = this.entries_.filter(
      (item) =>
        !(
          CBORWriter.compare(item[0], key) === 0 &&
          CBORWriter.compare(item[1], value) === 0
        ),
    );
  }

  deleteKey(key: K) {
    this.entries_ = this.entries_.filter(
      (entry) => CBORWriter.compare(entry[0], key) !== 0,
    );
  }

  size(): number {
    return this.entries_.length;
  }

  sortedEntries(): [K, V][] {
    let entries = [...this.entries_];
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
    return new CBORMultiMap(
      this.entries_.map(([key, value]) => [
        options.key(key),
        options.value(value),
      ]),
    );
  }

  filter(predicate: (key: K, value: V) => boolean): CBORMultiMap<K, V> {
    return new CBORMultiMap(
      this.entries_.filter(([key, value]) => predicate(key, value)),
    );
  }
}
