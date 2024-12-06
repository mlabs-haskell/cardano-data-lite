type CBORType =
  | "uint"
  | "nint"
  | "bytes"
  | "string"
  | "array"
  | "map"
  | "boolean"
  | "null"
  | "undefined"
  | "float"
  | "tagged";

export class CBORReader {
  private buffer: Uint8Array;

  constructor(buffer: Uint8Array) {
    this.buffer = buffer;
  }

  peekType(path: string[]): CBORType {
    let tag = this.buffer[0] >> 5;
    switch (tag) {
      case 0b000:
        return "uint";
      case 0b001:
        return "nint";
      case 0b010:
        return "bytes";
      case 0b011:
        return "string";
      case 0b100:
        return "array";
      case 0b101:
        return "map";
      case 0b110:
        return "tagged";
      case 0b111:
        switch (this.buffer[0] & 0b11111) {
          case 20:
          case 21:
            return "boolean";
          case 22:
            return "null";
          case 23:
            return "undefined";
          // case 25:
          // TODO: Support half precision floats
          case 26:
          case 27:
            return "float";
        }
    }
    let err = new CBORInvalidTag(tag)
    err.message += ` (at ${path.join("/")})`
    throw err
  }

  isBreak(): boolean {
    return this.buffer[0] == 0xff;
  }

  readBreak(path: string[] = []) {
    if (!this.isBreak()) {
      throw new Error(`Expected break (at ${path.join("/")})`)
    }
    this.buffer = this.buffer.slice(1);
  }

  readUint(path: string[]): bigint {
    this.assertType(["uint"], path);
    return this.readBigInt(path);
  }

  readInt(path: string[]): bigint {
    this.assertType(["uint", "nint"], path);
    if (this.peekType(path) == "uint") {
      return this.readBigInt(path);
    } else if (this.peekType(path) == "nint") {
      return 1n - this.readBigInt(path);
    } else {
      throw new Error(`Unreachable (at ${path.join("/")})`);
    }
  }

  // ret Uint8Array as read only reference to the source bytes
  readBytes(path: string[]): Uint8Array {
    this.assertType(["bytes"], path);
    return this.readByteString(path);
  }

  readString(path: string[]): string {
    this.assertType(["bytes"], path);
    let bytes = this.readByteString(path);
    return new TextDecoder().decode(bytes);
  }

  // reads array tag and returns the length as number or null if indefinite length.
  readArrayTag(path: string[]): number | null {
    this.assertType(["array"], path);
    return this.readLength(path);
  }

  // reads map tag and returns the length as number or null if indefinite length.
  readMapTag(path: string[]): number | null {
    this.assertType(["map"], path);
    return this.readLength(path);
  }

  readN(n: number, fn: (reader: CBORReader, idx: number) => void) {
    for (let i = 0; i < n; i++) {
      fn(this, i);
    }
  }

  readTillBreak(fn: (reader: CBORReader, idx: number) => void) {
    let i = 0;
    while (!this.isBreak()) {
      fn(this, i);
      i++;
    }
    this.readBreak();
  }

  readMultiple(n: number | null, fn: (reader: CBORReader, idx: number) => void) {
    if (n == null) this.readTillBreak(fn);
    else this.readN(n, fn);
  }

  readArray<T>(readItem: (reader: CBORReader, idx: number) => T, path: string[]): T[] {
    let ret: T[] = [];
    this.readMultiple(this.readArrayTag(path), (reader, idx) =>
      ret.push(readItem(reader, idx)),
    );
    return ret;
  }

  readMap<T>(readItem: (reader: CBORReader, idx: number) => T, path: string[]): T[] {
    let ret: T[] = [];
    this.readMultiple(this.readMapTag(path), (reader, idx) =>
      ret.push(readItem(reader, idx)),
    );
    return ret;
  }

  readBoolean(path: string[]): boolean {
    this.assertType(["boolean"], path);
    let tag = this.buffer[0];
    this.buffer = this.buffer.slice(1);
    return tag == 0xf5;
  }

  readNull(path: string[]): null {
    this.assertType(["null"], path);
    this.buffer = this.buffer.slice(1);
    return null;
  }

  readNullable<T>(fn: (reader: CBORReader) => T, path: string[]): T | null {
    if (this.peekType(path) == "null") return null;
    return fn(this);
  }

  readUndefined(path: string[]): undefined {
    this.assertType(["undefined"], path);
    this.buffer = this.buffer.slice(1);
    return;
  }

  readFloat(path: string[]): number {
    this.assertType(["float"], path);
    let tag = this.buffer[0];
    this.buffer = this.buffer.slice(1);
    let nBytes = 4;
    let float;
    if (tag == 0xfa) {
      nBytes = 4;
      float = new DataView(this.buffer.buffer).getFloat32(
        0,
        false /* false means Big Endian */,
      );
    } else if (tag == 0xfb) {
      nBytes = 8;
      float = new DataView(this.buffer.buffer).getFloat64(
        0,
        false /* false means Big Endian */,
      );
    } else {
      throw new Error(`Unreachable (at ${path.join("/")})`);
    }
    this.buffer = this.buffer.slice(nBytes);
    return float;
  }

  // read cbor tag and return the tag value as number
  readTaggedTag(path: string[]): number {
    this.assertType(["tagged"], path);
    return Number(this.readBigInt(path));
  }

  assertType(expectedTypes: CBORType[], path: string[]) {
    let receivedType = this.peekType(path);
    if (!expectedTypes.includes(receivedType)) {
      let err = new CBORUnexpectedType(expectedTypes, receivedType);
      err.message += ` (at ${path.join("/")})`;
      throw err;
    }
  }

  private readLength(path: string[]): number | null {
    let tag = this.buffer[0];
    let len = tag & 0b11111;
    if (len == 0x1f) return null;
    return Number(this.readBigInt(path));
  }

  private readBigInt(path: string[]): bigint {
    let tag = this.buffer[0];

    let len = tag & 0b11111;

    // the value of the length field must be between 0x00 and 0x1b
    if (!(len >= 0x00 && len <= 0x1b)) {
      let err = new CBORInvalidTag(tag);
      err.message += ` (at ${path.join("/")})`;
      throw err;
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

  private readByteString(path: string[]): Uint8Array {
    let tag = this.buffer[0];

    let len = tag & 0b11111;

    if (!((len >= 0x00 && len <= 0x1b) || len == 0x1f)) {
      let err = new CBORInvalidTag(tag);
      err.message += ` (at ${path.join("/")})`;
      throw err;
    }

    this.buffer = this.buffer.slice(1);

    if (len == 0x1f) {
      let chunks: Uint8Array[] = [];
      let chunk: Uint8Array;
      let i = -1;
      while (this.buffer[0] != 0xff) {
        i += 1;
        (chunk = this.readByteString(path)), chunks.push(chunk);
      }
      return concatUint8Array(chunks);
    } else {
      let n = Number(this.readBigInt(path));

      let chunk = this.buffer.slice(0, n);
      this.buffer = this.buffer.slice(n);

      return chunk;
    }
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

/* Error Type */

export class CBORInvalidTag extends Error {
  tag: number;

  constructor(tag: number) {
    super(`Invalid CBOR tag: ${tag}`);
    this.tag = tag;
  }
}

export class CBORUnexpectedType extends Error {
  expected: CBORType[];
  received: CBORType;

  constructor(expected: CBORType[], received: CBORType) {
    super(
      `Unexpected CBOR type: expected ${expected.join("/")}, received ${received}`,
    );
    this.expected = expected;
    this.received = received;
  }
}
