import {
  CBORCustom,
  CBORMap,
  CBORMultiMap,
  CBORTagged,
  CBORValue,
} from "./types";
import { CBORWriter } from "./writer";

export class ParseFailed extends Error {
  path: string[];
  errorKind: "type" | "value";
  expected: string;
  received?: string;

  constructor(
    path: string[],
    errorKind: "type" | "value",
    expected: string,
    received?: string | undefined,
  ) {
    super("Failed to parse CBOR");
    this.path = path;
    this.errorKind = errorKind;
    this.expected = expected;
    this.received = received;
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

export type CBORTypeName =
  | "uint"
  | "nint"
  | "bstr"
  | "tstr"
  | "array"
  | "map"
  | "boolean"
  | "null"
  | "undefined"
  | "float"
  | "tagged";

export class CBORReader {
  public readonly path: string[];
  private buffer: Uint8Array;

  constructor(buffer: Uint8Array, path?: string[]) {
    this.buffer = buffer;
    this.path = path || [];
  }

  private withPath<T>(path: string, fn: (reader: CBORReader) => T): T {
    this.path.push(path);
    try {
      let x = fn(this);
      this.path.pop();
      return x;
    } catch (e) {
      this.path.pop();
      throw e;
    }
  }

  read(): CBORReaderValue {
    let tag = this.buffer[0] >> 5;
    switch (tag) {
      case 0b000:
        let uint = this.readBigInt();
        return new CBORReaderValue(this.path, { type: "uint", value: uint });
      case 0b001:
        let nint = 1n - this.readBigInt();
        return new CBORReaderValue(this.path, { type: "nint", value: nint });
      case 0b010:
        let bstr: Uint8Array = this.readByteString();
        return new CBORReaderValue(this.path, { type: "bstr", value: bstr });
      case 0b011:
        bstr = this.readByteString();
        let tstr = new TextDecoder().decode(bstr);
        return new CBORReaderValue(this.path, { type: "tstr", value: tstr });
      case 0b100:
        let array = this.readArray();
        return new CBORReaderValue(this.path, { type: "array", value: array });
      case 0b101:
        let map = this.readMap();
        return new CBORReaderValue(this.path, { type: "map", value: map });
      case 0b110:
        let tagValue = this.readBigInt();
        let inner = this.read();
        return new CBORReaderValue(this.path, {
          type: "tagged",
          value: new CBORTaggedReader(this.path, tagValue, inner),
        });
      case 0b111:
        switch (this.buffer[0] & 0b11111) {
          case 20:
            this.buffer = this.buffer.slice(1);
            return new CBORReaderValue(this.path, {
              type: "boolean",
              value: false,
            });
          case 21:
            this.buffer = this.buffer.slice(1);
            return new CBORReaderValue(this.path, {
              type: "boolean",
              value: true,
            });
          case 22:
            this.buffer = this.buffer.slice(1);
            return new CBORReaderValue(this.path, {
              type: "null",
              value: null,
            });
          case 23:
            this.buffer = this.buffer.slice(1);
            return new CBORReaderValue(this.path, {
              type: "undefined",
              value: undefined,
            });
          // case 25:
          // TODO: Support half precision floats
          case 26:
            this.buffer = this.buffer.slice(1);
            let f32 = new DataView(this.buffer.buffer).getFloat32(0);
            this.buffer = this.buffer.slice(4);
            return new CBORReaderValue(this.path, {
              type: "float",
              value: f32,
            });
          case 27:
            this.buffer = this.buffer.slice(1);
            let f64 = new DataView(this.buffer.buffer).getFloat64(0);
            this.buffer = this.buffer.slice(8);
            return new CBORReaderValue(this.path, {
              type: "float",
              value: f64,
            });
        }
    }

    throw new ParseFailed(
      this.path,
      "type",
      "This is an invalid tag or we don't recognize this tag yet",
      this.buffer[0].toString(16),
    );
  }

  private readBigInt(): bigint {
    let tag = this.buffer[0];

    let len = tag & 0b11111;

    // the value of the length field must be between 0x00 and 0x1b
    if (!(len >= 0x00 && len <= 0x1b)) {
      throw new ParseFailed(
        this.path,
        "value",
        "0x00 <= len <= 0x1b",
        len.toString(16),
      );
    }

    this.buffer = this.buffer.slice(1);

    // if the length field is less than 0x18, then that itself is the value
    // (optimization for small values)
    if (len < 0x18) {
      return BigInt(len);
    }

    // Else the length is 2^(length - 0x18)
    let nBytes = Math.pow(2, len - 0x18);

    let x = bigintFromBytes(nBytes, this.buffer);
    this.buffer = this.buffer.slice(nBytes);
    return x;
  }

  private readByteString(): Uint8Array {
    let tag = this.buffer[0];

    let len = tag & 0b11111;

    if (!((len >= 0x00 && len <= 0x1b) || len == 0x1f)) {
      throw new ParseFailed(
        this.path,
        "value",
        "0x00 <= len <= 0x1b || len == 0x1f",
        len.toString(16),
      );
    }

    this.buffer = this.buffer.slice(1);

    if (len == 0x1f) {
      let chunks: Uint8Array[] = [];
      let chunk: Uint8Array;
      let i = -1;
      while (this.buffer[0] != 0xff) {
        i += 1;
        chunk = this.withPath(i.toString(), (reader) =>
          reader.readByteString(),
        );
        chunks.push(chunk);
      }
      return concatUint8Array(chunks);
    } else {
      let n = Number(this.readBigInt());

      let chunk = this.buffer.slice(0, n);
      this.buffer = this.buffer.slice(n);

      return chunk;
    }
  }

  private readArray(): CBORArrayReader<CBORReaderValue> {
    let tag = this.buffer[0];

    let len = tag & 0b11111;

    if (!((len >= 0x00 && len <= 0x1b) || len == 0x1f)) {
      throw new ParseFailed(
        this.path,
        "value",
        "0x00 <= len <= 0x1b || len == 0x1f",
        len.toString(16),
      );
    }

    let array: CBORArrayReader<CBORReaderValue> = new CBORArrayReader(
      this.path,
    );

    if (len == 0x1f) {
      this.buffer = this.buffer.slice(1);
      let i = -1;
      while (this.buffer[0] != 0xff) {
        i += 1;
        let item = this.withPath(i.toString(), (reader) => reader.read());
        array.push(item);
      }
    } else {
      let n = Number(this.readBigInt());

      for (let i = 0; i < n; i++) {
        let item = this.withPath(i.toString(), (reader) => reader.read());
        array.push(item);
      }
    }

    return array;
  }

  private readMap(): CBORMultiMapReader<CBORReaderValue, CBORReaderValue> {
    let tag = this.buffer[0];

    let len = tag & 0b11111;

    if (!((len >= 0x00 && len <= 0x1b) || len == 0x1f)) {
      throw new ParseFailed(
        this.path,
        "value",
        "0x00 <= len <= 0x1b || len == 0x1f",
        len.toString(16),
      );
    }

    this.buffer = this.buffer.slice(1);

    let map: CBORMultiMapReader<CBORReaderValue, CBORReaderValue> =
      new CBORMultiMapReader(this.path);

    if (len == 0x1f) {
      let i = -1;
      while (this.buffer[0] != 0xff) {
        i += 1;
        let key = this.withPath(i + "/key", (reader) => reader.read());
        let value = this.withPath(i + "/value", (reader) => reader.read());
        map.add(key, value);
      }
    } else {
      let n = Number(this.readBigInt());

      for (let i = 0; i < n; i++) {
        let key = this.withPath(i + "/key", (reader) => reader.read());
        let value = this.withPath(i + "/value", (reader) => reader.read());
        map.add(key, value);
      }
    }

    return map;
  }
}

type CBORReaderValueInner =
  | { type: "uint"; value: bigint }
  | { type: "nint"; value: bigint }
  | { type: "bstr"; value: Uint8Array }
  | { type: "tstr"; value: string }
  | { type: "array"; value: CBORArrayReader<CBORReaderValue> }
  | { type: "map"; value: CBORMultiMapReader<CBORReaderValue, CBORReaderValue> }
  | { type: "boolean"; value: boolean }
  | { type: "null"; value: null }
  | { type: "undefined"; value: undefined }
  | { type: "float"; value: number }
  | { type: "tagged"; value: CBORTaggedReader<CBORReaderValue> };

type CBORReaderValueInnerNarrowed<T> = (CBORReaderValueInner & {
  type: T;
})["value"];

export class CBORReaderValue implements CBORCustom {
  public readonly path: string[];
  private inner: CBORReaderValueInner;

  constructor(path: string[], inner: CBORReaderValueInner) {
    this.path = path;
    this.inner = inner;
  }

  getChoice<T>(fns: {
    [TypeName in CBORTypeName]?: (
      value: CBORReaderValueInnerNarrowed<TypeName>,
    ) => T;
  }): T {
    let typeName = this.inner.type;
    let fn = fns[typeName];
    if (fn == null) {
      throw new ParseFailed(
        this.path,
        "type",
        Object.keys(fns).join(" | "),
        typeName,
      );
    }
    return (fn as any)(this.inner.value);
  }

  get<T extends CBORTypeName>(type: T): CBORReaderValueInnerNarrowed<T> {
    if (type == this.inner.type) {
      return this.inner.value as any;
    }
    throw new ParseFailed(this.path, "type", type, this.inner.type);
  }

  getNullable<T extends CBORTypeName>(
    type: T,
  ): CBORReaderValueInnerNarrowed<T> | null {
    if (this.inner.type == "null") return null;
    if (type == this.inner.type) {
      return this.inner.value as any;
    }
    throw new ParseFailed(this.path, "type", type + " | null", this.inner.type);
  }

  getInt(): bigint {
    return this.getChoice({ uint: (x) => x, nint: (x) => x });
  }

  getType(): CBORTypeName {
    return this.inner.type;
  }

  toCBOR(writer: CBORWriter) {
    writer.write(this.inner.value);
  }

  with<U>(fn: (x: CBORReaderValue) => U): U {
    try {
      return fn(this);
    } catch (e) {
      let msg = (e as any).toString();
      throw new ParseFailed(this.path, "value", msg);
    }
  }
}

export class CBORArrayReader<T extends CBORValue> extends Array<T> {
  public readonly path: string[];
  shiftedCount = 0;

  constructor(path: string[]) {
    super();
    this.path = path;
  }

  shiftRequired(): T {
    if (this.length == 0) {
      throw new ParseFailed(
        this.path,
        "value",
        "Index out of bounds",
        String(this.shiftedCount),
      );
    }
    return this.shift() as T;
  }

  shift(): T | undefined {
    if (this.length > 0) this.shiftedCount += 1;
    return this.shift();
  }

  getRequired(index: number): T {
    let value = this[index];
    if (value == null) {
      throw new ParseFailed(
        this.path,
        "value",
        "index not found",
        (this.shiftedCount + index).toString(),
      );
    }
    return value;
  }

  get(index: number): T | undefined {
    return this[index];
  }
}

export class CBORMapReader<
  K extends CBORValue,
  V extends CBORValue,
> extends CBORMap<K, V> {
  public readonly path: string[];

  constructor(path: string[]) {
    super();
    this.path = path;
  }

  getRequired(key: K): V {
    let value = super.get(key);
    if (value == null) {
      throw new ParseFailed(this.path, "value", "key not found", keyStr(key));
    }
    return value;
  }
}

export class CBORMultiMapReader<
  K extends CBORValue,
  V extends CBORValue,
> extends CBORMultiMap<K, V> {
  public readonly path: string[];

  constructor(path: string[]) {
    super();
    this.path = path;
  }

  toMap(): CBORMapReader<K, V> {
    let map: CBORMapReader<K, V> = new CBORMapReader(this.path);
    for (let [key, value] of this.entries) {
      if (map.get(key) != null) {
        throw new ParseFailed(
          this.path,
          "value",
          "duplicate values for key",
          keyStr(key),
        );
      }
      map.set(key, value);
    }
    return map;
  }
}

export class CBORTaggedReader<T extends CBORValue> extends CBORTagged<T> {
  public readonly path: string[];

  constructor(path: string[], tag: bigint, value: T) {
    super(tag, value);
    this.path = path;
  }

  getTagged(tag: bigint): T {
    if (tag == this.tag) {
      return this.value;
    }
    throw new ParseFailed(
      this.path,
      "value",
      "tag: " + tag,
      this.tag.toString(),
    );
  }
}

export function bigintFromBytes(nBytes: number, stream: Uint8Array): bigint {
  let x = BigInt(0);
  for (let i = 0; i < nBytes; i++) {
    x = x << 8n;
    x += BigInt(stream[i]);
  }
  return x;
}

function concatUint8Array(chunks: Uint8Array[]): Uint8Array {
  let length = 0;
  chunks.forEach((item) => {
    length += item.length;
  });

  let concat = new Uint8Array(length);

  let offset = 0;
  chunks.forEach((item) => {
    concat.set(item, offset);
    offset += item.length;
  });

  return concat;
}

function keyStr(key: CBORValue): string | undefined {
  if (typeof key == "string") {
    return key;
  } else if (typeof key == "number") {
    return key.toString();
  } else if (typeof key == "bigint") {
    return key.toString();
  } else {
    return undefined;
  }
}
