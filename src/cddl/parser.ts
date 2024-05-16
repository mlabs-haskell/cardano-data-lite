import { CBORItem, CBORItem_, CBORType } from "../cbor/model";

export interface Parser<T> {
  parse(cbor: CBORItem | null | undefined): T;
}

export type ParserOutput<T> = T extends Parser<infer U> ? U : never;

export interface Range<T> {
  min?: T;
  max?: T;
}

function parseType<T extends CBORType>(cbor: CBORItem | null | undefined, type: T): CBORItem_<T> {
  if (cbor == null) {
    throw new ParseFailed([], "type", type, "null");
  }
  if (cbor.type == type) {
    return cbor as CBORItem_<T>;
  }
  throw new ParseFailed([], "type", type, cbor.type);
}

function validateRange<T>(x: T, range?: Range<T>) {
  if (range == null) return;

  let { min, max } = range;

  if (min != null && x < min) {
    throw new ParseFailed([], "value", "min: " + range.min, String(x));
  }

  if (max != null && x > max) {
    throw new ParseFailed([], "value", "max: " + range.max, String(x));
  }
}

export function withPath<T>(path: string, fn: () => T): T {
  try {
    return fn();
  } catch (e) {
    if (e instanceof ParseFailed) {
      e.path = [path, ...e.path];
    }
    throw e;
  }
}

export class Identity implements Parser<CBORItem> {
  parse(cbor: CBORItem | undefined | null): CBORItem {
    if (cbor == null) {
      throw new ParseFailed([], "type", "any", "null");
    }
    return cbor;
  }
}

export class UInt implements Parser<bigint> {
  constructor(private range?: Range<bigint>) { }

  parse(cbor: CBORItem | undefined | null): bigint {
    let cbor_ = parseType(cbor, "uint");
    validateRange(cbor_.value, this.range);
    return cbor_.value;
  }
}

// TODO: Invert sign of nint in parser.ts
export class NInt implements Parser<bigint> {
  constructor(private range?: Range<bigint>) { }

  parse(cbor: CBORItem | undefined | null): bigint {
    let cbor_ = parseType(cbor, "nint");
    validateRange(cbor_.value, this.range);
    return cbor_.value;
  }
}

export class TStr implements Parser<string> {
  constructor(private lengthRange?: Range<number>) { }
  parse(cbor: CBORItem | undefined | null): string {
    let cbor_ = parseType(cbor, "tstr");
    validateRange(cbor_.value.length, this.lengthRange);
    return cbor_.value;
  }
}

export class BStr implements Parser<Uint8Array> {
  constructor(private lengthRange?: Range<number>) { }
  parse(cbor: CBORItem | undefined | null): Uint8Array {
    let cbor_ = parseType(cbor, "bstr");
    validateRange(cbor_.value.length, this.lengthRange);
    return cbor_.value;
  }
}

export class Array<T> implements Parser<T[]> {
  constructor(
    private itemParser: Parser<T>,
    private lengthRange?: Range<number>
  ) { }

  parse(cbor: CBORItem | undefined | null): T[] {
    let ret: T[] = [];
    let cbor_ = parseType(cbor, "array");
    validateRange(cbor_.value.length, this.lengthRange);

    let i = -1;
    for (let item of cbor_.value) {
      i += 1;
      let itemParsed: T;
      itemParsed = withPath(i.toString(), () => this.itemParser.parse(item));
      ret.push(itemParsed);
    }
    return ret;
  }
}

export class Map<K, V> implements Parser<[K, V][]> {
  constructor(
    private keyParser: Parser<K>,
    private valueParser: Parser<V>,
    private lengthRange?: Range<number>
  ) { }

  parse(cbor: CBORItem | undefined | null): [K, V][] {
    let ret: [K, V][] = [];
    let cbor_ = parseType(cbor, "map");
    validateRange(cbor_.value.length, this.lengthRange);

    let i = -1;
    for (let [k, v] of cbor_.value) {
      i += 1;
      let keyParsed = withPath(i.toString(), () => this.keyParser.parse(k));
      let valueParsed = withPath(i.toString(), () => this.valueParser.parse(v));
      ret.push([keyParsed, valueParsed]);
    }
    return ret;
  }
}

export class Boolean implements Parser<boolean> {
  constructor() { }

  parse(cbor: CBORItem | undefined | null): boolean {
    let cbor_ = parseType(cbor, "boolean");
    return cbor_.value;
  }
}

export class Null implements Parser<null> {
  constructor() { }

  parse(cbor: CBORItem | undefined | null): null {
    let cbor_ = parseType(cbor, "null");
    return cbor_.value;
  }
}

export class Undefined implements Parser<undefined> {
  constructor() { }

  parse(cbor: CBORItem | undefined | null): undefined {
    let cbor_ = parseType(cbor, "undefined");
    return cbor_.value;
  }
}

export class Float implements Parser<number> {
  constructor() { }

  parse(cbor: CBORItem | undefined | null): number {
    let cbor_ = parseType(cbor, "float");
    return cbor_.value;
  }
}

export class Tagged<T> implements Parser<T> {
  constructor(
    private tag: number,
    private innerParser: Parser<T>
  ) { }

  parse(cbor: CBORItem | undefined | null): T {
    let cbor_ = parseType(cbor, "tagged");
    if (cbor_.tag != this.tag) {
      throw new ParseFailed([], "value", "tag: " + this.tag, String(cbor_.tag));
    }
    return this.innerParser.parse(cbor_.value);
  }
}

export class Transform<T, U> implements Parser<U> {
  constructor(private innerParser: Parser<T>, private fn: (x: T) => U) { }

  parse(cbor: CBORItem | undefined | null): U {
    let inner = this.innerParser.parse(cbor);
    return this.fn(inner);
  }
}

export class RecordHelper {
  private index = 0;
  private optional = false;

  constructor(private items: CBORItem[]) { }

  next<T>(parser: Parser<T>) {
    let item = this.items[this.index];
    if (!this.optional && item == null) {
      throw new ParseFailed([this.index.toString()], "value", "not found");
    }
    let itemParsed = parser.parse(item);
    this.index += 1;
    return itemParsed;
  }

  optionalsFollow() {
    this.optional = true;
  }
}

export function parseTag<T>(tagParser: Parser<T>, tag: CBORItem | undefined | null): T {
  if (tag == null) {
    throw new ParseFailed(["0"], "value", "tag not found");
  }
  return withPath("0", () => tagParser.parse(tag));
}

export class ParseFailed extends Error {
  path: string[];
  errorKind: "type" | "value";
  expected: string;
  received?: string;

  constructor(
    path: string[],
    errorKind: "type" | "value",
    expected: string,
    received?: string | undefined
  ) {
    super("Failed to parse CBOR");
    this.path = path;
    this.errorKind = errorKind;
    this.expected = expected;
    this.received = received;
  }
}
