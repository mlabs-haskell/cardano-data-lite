import { CBORItem, CBORItem_, CBORType } from "../cbor/model";
import {
  XArray,
  XBStr,
  XBoolean,
  XFloat,
  XInt,
  XMap,
  XMultiMap,
  XNull,
  XTStr,
  XTagged,
  XUndefined,
  XValue,
} from "./model";

export interface Parser<T> {
  parse(cbor: CBORItem | null | undefined): T;
}

export type ParserOutput<T> = T extends Parser<infer U> ? U : never;

export interface Range<T> {
  min?: T;
  max?: T;
}

export const RangePositive = {
  min: 0,
};

export const RangePositiveBig = {
  min: 0n,
};

function parseType<T extends CBORType>(
  cbor: CBORItem | null | undefined,
  type: T
): CBORItem_<T> {
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

export class IdentityP implements Parser<CBORItem> {
  parse(cbor: CBORItem | undefined | null): CBORItem {
    if (cbor == null) {
      throw new ParseFailed([], "type", "any", "null");
    }
    return cbor;
  }
}

export class IntP implements Parser<XInt> {
  constructor(private range?: Range<bigint>) {}

  parse(cbor: CBORItem | undefined | null): XInt {
    let value: bigint;
    if (cbor?.type == "nint") {
      let cbor_ = parseType(cbor, "nint");
      value = -cbor_.value;
    } else {
      let cbor_ = parseType(cbor, "uint");
      value = cbor_.value;
    }
    validateRange(value, this.range);
    return new XInt(value);
  }
}

export class TStrP implements Parser<XTStr> {
  constructor(private lengthRange?: Range<number>) {}
  parse(cbor: CBORItem | undefined | null): XTStr {
    let cbor_ = parseType(cbor, "tstr");
    validateRange(cbor_.value.length, this.lengthRange);
    return new XTStr(cbor_.value);
  }
}

export class BStrP implements Parser<XBStr> {
  constructor(private lengthRange?: Range<number>) {}
  parse(cbor: CBORItem | undefined | null): XBStr {
    let cbor_ = parseType(cbor, "bstr");
    validateRange(cbor_.value.length, this.lengthRange);
    return new XBStr(cbor_.value);
  }
}

export class ArrayP<T extends XValue> implements Parser<XArray<T>> {
  constructor(
    private itemParser: Parser<T>,
    private lengthRange?: Range<number>
  ) {}

  parse(cbor: CBORItem | undefined | null): XArray<T> {
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
    return new XArray(ret);
  }
}

export class MapP<K extends XValue, V extends XValue>
  implements Parser<XMap<K, V>>
{
  constructor(
    private keyParser: Parser<K>,
    private valueParser: Parser<V>,
    private lengthRange?: Range<number>
  ) {}

  parse(cbor: CBORItem | undefined | null): XMap<K, V> {
    let ret: XMap<K, V> = new XMap();
    let cbor_ = parseType(cbor, "map");
    validateRange(cbor_.value.length, this.lengthRange);

    let i = -1;
    for (let [k, v] of cbor_.value) {
      i += 1;
      let keyParsed = withPath(i.toString(), () => this.keyParser.parse(k));
      if (ret.get(keyParsed) != null)
        throw new ParseFailed(
          [i.toString()],
          "value",
          "unique keys",
          "duplicate key"
        );
      let valueParsed = withPath(i.toString(), () => this.valueParser.parse(v));
      ret.set(keyParsed, valueParsed);
    }
    return ret;
  }
}

export class MultiMapP<K extends XValue, V extends XValue>
  implements Parser<XMultiMap<K, V>>
{
  constructor(
    private keyParser: Parser<K>,
    private valueParser: Parser<V>,
    private lengthRange?: Range<number>
  ) {}

  parse(cbor: CBORItem | undefined | null): XMultiMap<K, V> {
    let ret: XMultiMap<K, V> = new XMultiMap();
    let cbor_ = parseType(cbor, "map");
    validateRange(cbor_.value.length, this.lengthRange);

    let i = -1;
    for (let [k, v] of cbor_.value) {
      i += 1;
      let keyParsed = withPath(i.toString(), () => this.keyParser.parse(k));
      let valueParsed = withPath(i.toString(), () => this.valueParser.parse(v));
      ret.insert(keyParsed, valueParsed);
    }
    return ret;
  }
}

export class BooleanP implements Parser<XBoolean> {
  constructor() {}

  parse(cbor: CBORItem | undefined | null): XBoolean {
    let cbor_ = parseType(cbor, "boolean");
    return new XBoolean(cbor_.value);
  }
}

export class NullP implements Parser<XNull> {
  constructor() {}

  parse(cbor: CBORItem | undefined | null): XNull {
    let cbor_ = parseType(cbor, "null");
    return new XNull();
  }
}

export class UndefinedP implements Parser<XUndefined> {
  constructor() {}

  parse(cbor: CBORItem | undefined | null): XUndefined {
    let cbor_ = parseType(cbor, "undefined");
    return new XUndefined();
  }
}

export class FloatP implements Parser<XFloat> {
  constructor() {}

  parse(cbor: CBORItem | undefined | null): XFloat {
    let cbor_ = parseType(cbor, "float");
    return new XFloat(cbor_.value);
  }
}

export class TaggedP<T extends XValue> implements Parser<XTagged<T>> {
  constructor(private tag: number, private innerParser: Parser<T>) {}

  parse(cbor: CBORItem | undefined | null): XTagged<T> {
    let cbor_ = parseType(cbor, "tagged");
    if (cbor_.tag != this.tag) {
      throw new ParseFailed([], "value", "tag: " + this.tag, String(cbor_.tag));
    }
    return new XTagged(this.tag, this.innerParser.parse(cbor_.value));
  }
}

export class TransformP<T, U> implements Parser<U> {
  constructor(private innerParser: Parser<T>, private fn: (x: T) => U) {}

  parse(cbor: CBORItem | undefined | null): U {
    let inner = this.innerParser.parse(cbor);
    return this.fn(inner);
  }
}

export class RecordHelper {
  private index = 0;
  private optional = false;

  constructor(private items: CBORItem[]) {}

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

export function parseTag<T>(
  tagParser: Parser<T>,
  tag: CBORItem | undefined | null
): T {
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
