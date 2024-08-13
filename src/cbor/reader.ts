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

  peekType(): CBORType {
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
    throw new CBORInvalidTag(tag);
  }

  isBreak(): boolean {
    return this.buffer[0] == 0xff;
  }

  readBreak() {
    if (!this.isBreak()) {
      throw new Error("Expected break");
    }
    this.buffer = this.buffer.slice(1);
  }

  readUint(): bigint {
    this.assertType(["uint"]);
    return this.readBigInt();
  }

  readInt(): bigint {
    this.assertType(["uint", "nint"]);
    if (this.peekType() == "uint") {
      return this.readBigInt();
    } else if (this.peekType() == "nint") {
      return 1n - this.readBigInt();
    } else {
      throw new Error("Unreachable");
    }
  }

  // ret Uint8Array as read only reference to the source bytes
  readBytes(): Uint8Array {
    this.assertType(["bytes"]);
    return this.readByteString();
  }

  readString(): string {
    this.assertType(["bytes"]);
    let bytes = this.readByteString();
    return new TextDecoder().decode(bytes);
  }

  // reads array tag and returns the length as number or null if indefinite length.
  readArrayTag(): number | null {
    this.assertType(["array"]);
    return this.readLength();
  }

  // reads map tag and returns the length as number or null if indefinite length.
  readMapTag(): number | null {
    this.assertType(["map"]);
    return this.readLength();
  }

  readN(n: number, fn: (reader: CBORReader) => void) {
    for (let i = 0; i < n; i++) {
      fn(this);
    }
  }

  readTillBreak(fn: (reader: CBORReader) => void) {
    while (!this.isBreak()) {
      fn(this);
    }
    this.readBreak();
  }

  readMultiple(n: number | null, fn: (reader: CBORReader) => void) {
    if (n == null) this.readTillBreak(fn);
    else this.readN(n, fn);
  }

  readArray<T>(readItem: (reader: CBORReader) => T): T[] {
    let ret: T[] = [];
    this.readMultiple(this.readArrayTag(), (reader) =>
      ret.push(readItem(reader)),
    );
    return ret;
  }

  readMap<T>(readItem: (reader: CBORReader) => T): T[] {
    let ret: T[] = [];
    this.readMultiple(this.readMapTag(), (reader) =>
      ret.push(readItem(reader)),
    );
    return ret;
  }

  readBoolean(): boolean {
    this.assertType(["boolean"]);
    let tag = this.buffer[0];
    this.buffer = this.buffer.slice(1);
    return tag == 0xf5;
  }

  readNull(): null {
    this.assertType(["null"]);
    this.buffer = this.buffer.slice(1);
    return null;
  }

  readUndefined(): undefined {
    this.assertType(["undefined"]);
    this.buffer = this.buffer.slice(1);
    return;
  }

  readFloat(): number {
    this.assertType(["float"]);
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
      throw new Error("Unreachable");
    }
    this.buffer = this.buffer.slice(nBytes);
    return float;
  }

  // read cbor tag and return the tag value as number
  readTaggedTag(): number {
    this.assertType(["tagged"]);
    return Number(this.readBigInt());
  }

  assertType(expectedTypes: CBORType[]) {
    let receivedType = this.peekType();
    if (!expectedTypes.includes(receivedType)) {
      throw new CBORUnexpectedType(expectedTypes, receivedType);
    }
  }

  private readLength(): number | null {
    let tag = this.buffer[0];
    let len = tag & 0b11111;
    if (len == 0x1f) return null;
    return Number(this.readBigInt());
  }

  private readBigInt(): bigint {
    let tag = this.buffer[0];

    let len = tag & 0b11111;

    // the value of the length field must be between 0x00 and 0x1b
    if (!(len >= 0x00 && len <= 0x1b)) {
      throw new CBORInvalidTag(tag);
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
      throw new CBORInvalidTag(tag);
    }

    this.buffer = this.buffer.slice(1);

    if (len == 0x1f) {
      let chunks: Uint8Array[] = [];
      let chunk: Uint8Array;
      let i = -1;
      while (this.buffer[0] != 0xff) {
        i += 1;
        (chunk = this.readByteString()), chunks.push(chunk);
      }
      return concatUint8Array(chunks);
    } else {
      let n = Number(this.readBigInt());

      let chunk = this.buffer.slice(0, n);
      this.buffer = this.buffer.slice(n);

      return chunk;
    }
  }
}

function bigintFromBytes(nBytes: number, stream: Uint8Array): bigint {
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
