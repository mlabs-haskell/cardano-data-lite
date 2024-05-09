import { deepEq } from "./eq";
import { CBORItem, MultiMap } from "./model";

interface Schema<T> {
  parse(cbor: CBORItem): T;
}

type SchemaValue<T> = T extends Schema<infer U> ? U : never;

class ParseError {
  constructor() { }
}

// Primitives

class Int implements Schema<bigint> {
  minValue?: bigint;
  maxValue?: bigint;

  constructor(options?: { minValue?: bigint; maxValue?: bigint }) {
    this.minValue = options?.minValue;
    this.maxValue = options?.maxValue;
  }

  parse(cbor: CBORItem): bigint {
    if (cbor.type != "uint" && cbor.type != "nint") throw new ParseError();
    if (
      (this.minValue != null && cbor.value < this.minValue) ||
      (this.maxValue != null && cbor.value > this.maxValue)
    ) {
      throw new ParseError();
    }
    return cbor.value;
  }
}

class TStr implements Schema<string> {
  minLen?: number;
  maxLen?: number;

  constructor(options?: { minLen?: number; maxLen?: number }) {
    this.minLen = options?.minLen;
    this.maxLen = options?.maxLen;
  }

  parse(cbor: CBORItem): string {
    if (cbor.type != "tstr") {
      throw new ParseError();
    }

    if (
      (this.minLen != null && cbor.value.length < this.minLen) ||
      (this.maxLen != null && cbor.value.length > this.maxLen)
    ) {
      throw new ParseError();
    }

    return cbor.value;
  }
}

class BStr implements Schema<Uint8Array> {
  minLen?: number;
  maxLen?: number;

  constructor(options?: { minLen?: number; maxLen?: number }) {
    this.minLen = options?.minLen;
    this.maxLen = options?.maxLen;
  }

  parse(cbor: CBORItem): Uint8Array {
    if (cbor.type != "bstr") {
      throw new ParseError();
    }

    if (
      (this.minLen != null && cbor.value.length < this.minLen) ||
      (this.maxLen != null && cbor.value.length > this.maxLen)
    ) {
      throw new ParseError();
    }

    return cbor.value;
  }
}

class Float implements Schema<number> {
  minValue?: number;
  maxValue?: number;

  constructor(options?: { minValue?: number; maxValue?: number }) {
    this.minValue = options?.minValue;
    this.maxValue = options?.maxValue;
  }

  parse(cbor: CBORItem): number {
    if (cbor.type != "float") {
      throw new ParseError();
    }

    if (
      (this.minValue != null && cbor.value < this.minValue) ||
      (this.maxValue != null && cbor.value > this.maxValue)
    ) {
      throw new ParseError();
    }

    return cbor.value;
  }
}

class Boolean implements Schema<boolean> {
  constructor() { }
  parse(cbor: CBORItem): boolean {
    if (cbor.type != "boolean") {
      throw new ParseError();
    }

    return cbor.value;
  }
}

// Vectors & Records

class Vector<T> implements Schema<T[]> {
  itemSchema: Schema<T>;
  minLen?: number;
  maxLen?: number;

  constructor(
    itemSchema: Schema<T>,
    options?: { minLen?: number; maxLen?: number }
  ) {
    this.itemSchema = itemSchema;
    this.minLen = options?.minLen;
    this.maxLen = options?.maxLen;
  }

  parse(cbor: CBORItem): T[] {
    let arr: T[] = [];

    if (cbor.type != "array") throw new ParseError();
    if (
      (this.minLen != null && cbor.value.length < this.minLen) ||
      (this.maxLen != null && cbor.value.length > this.maxLen)
    ) {
      throw new ParseError();
    }

    for (let item of cbor.value) {
      let parsedItem = this.itemSchema.parse(item);
      arr.push(parsedItem);
    }

    return arr;
  }
}

// Recursively build { k1: v1, k2: v2, .. } out of [[k1, v1], [k2, v2], ..]
type RecordValue<T> = T extends [
  infer V extends [string, Schema<unknown>],
  ...infer U,
]
  ? { [key in V[0]]: SchemaValue<V[1]> } & RecordValue<U>
  : {};

class Record<T extends [string, Schema<unknown>][]>
  implements Schema<RecordValue<T>> {
  itemsSchema: [string, Schema<unknown>][];

  constructor(itemsSchema: [string, Schema<unknown>][]) {
    this.itemsSchema = itemsSchema;
  }

  parse(cbor: CBORItem): RecordValue<T> {
    let res: any = {};
    if (cbor.type != "array") throw new ParseError();
    // Note(farseen): == Assumptions ==
    // - We are supposed to accept arrays with extra items.
    // - When a new version extends an array, old parsers are still supposed to work.
    if (cbor.value.length < this.itemsSchema.length) throw new ParseError();

    for (let i = 0; i < this.itemsSchema.length; i++) {
      let item = cbor.value[i];
      let [name, schema] = this.itemsSchema[i];
      let parsedItem = schema.parse(item);
      res[name] = parsedItem;
    }

    return res;
  }
}

// Maps & Structs

class Map<K, V> implements Schema<MultiMap<K, V>> {
  keySchema: Schema<K>;
  valueSchema: Schema<V>;
  minLen?: number;
  maxLen?: number;

  constructor(
    keySchema: Schema<K>,
    valueSchema: Schema<V>,
    options?: { minLen?: number; maxLen?: number }
  ) {
    this.keySchema = keySchema;
    this.valueSchema = valueSchema;
    this.minLen = options?.minLen;
    this.maxLen = options?.maxLen;
  }

  parse(cbor: CBORItem): MultiMap<K, V> {
    if (cbor.type != "map") throw new ParseError();

    let items = cbor.value.getItems();

    if (
      (this.minLen != null && items.length < this.minLen) ||
      (this.maxLen != null && items.length > this.maxLen)
    ) {
      throw new ParseError();
    }

    let parsedItems: [K, V][] = [];
    for (let [key, value] of items) {
      let keyParsed = this.keySchema.parse(key);
      let valueParsed = this.valueSchema.parse(value);
      parsedItems.push([keyParsed, valueParsed]);
    }

    return new MultiMap(deepEq, parsedItems);
  }
}

type StructKey = string | number;

type StructValue<T> = T extends [infer V, ...infer U]
  ? StructEntryValue<V> & StructValue<U>
  : {};

type StructEntryValue<T> = T extends [StructKey, Schema<unknown>]
  ? { [key in T[0]]: SchemaValue<T[1]> }
  : T extends [string, Schema<unknown>, "optional"]
  ? { [key in T[0]]?: SchemaValue<T[1]> }
  : never;

class Struct<T> implements Schema<StructValue<T>> {
  itemsSchema: (
    | [string, Schema<unknown>]
    | [string, Schema<unknown>, "optional"]
  )[];

  constructor(
    itemsSchema: (
      | [string, Schema<unknown>]
      | [string, Schema<unknown>, "optional"]
    )[]
  ) {
    this.itemsSchema = itemsSchema;
  }

  parse(cbor: CBORItem): StructValue<T> {
    if (cbor.type != "map") throw new ParseError();

    let ret: any = {};

    let items = cbor.value.getItems();

    for (let [name, schema, optional] of this.itemsSchema) {
      let item = findItemByKey(name, items);
      if (item == null) {
        if (optional == null) continue;
        throw new ParseError();
      }
      let parsedItem = schema.parse(item);
      ret[name] = parsedItem;
    }

    return ret;
  }
}

function findItemByKey(
  key: string,
  items: [CBORItem, CBORItem][]
): CBORItem | null {
  for (let [k, v] of items) {
    if (
      (k.type == "tstr" && k.value == key) ||
      (k.type == "uint" && k.value == BigInt(key))
    )
      return v;
  }
  return null;
}

// Misc

class Nullable<T> implements Schema<T | null> {
  schema: Schema<T>;

  constructor(schema: Schema<T>) {
    this.schema = schema;
  }

  parse(cbor: CBORItem): T | null {
    if (cbor.type == "null") {
      return null;
    }
    return this.schema.parse(cbor);
  }
}

export {
  Schema,
  SchemaValue,
  Int,
  TStr,
  BStr,
  Float,
  Boolean,
  Vector,
  Record,
  Map,
  Struct,
  Nullable,
};
