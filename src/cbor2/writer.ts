import { GrowableBuffer } from "./growable-buffer";
import { CBORCustom, CBORValue } from "./types";

const HEX_LUT = new Array(0x100);
for (let i = 0; i < 0x100; i++) {
  HEX_LUT[i] = i.toString(16).padStart(2, "0");
}

// TODO: A subclass of CBORWriter that compares to a source array as it writes
// and throws an error if they don't match

export class CBORWriter {
  private buffer: GrowableBuffer;

  constructor() {
    this.buffer = new GrowableBuffer();
  }

  getBytes(): Uint8Array {
    return new Uint8Array(this.buffer.getBuffer());
  }

  getHex(): string {
    return this.getBytes()
      .map((byte) => HEX_LUT[byte])
      .join("");
  }

  static toBytes(value: CBORValue): Uint8Array {
    let writer = new CBORWriter();
    writer.write(value);
    return writer.getBytes();
  }

  static toHex(value: CBORValue): string {
    let writer = new CBORWriter();
    writer.write(value);
    return writer.getHex();
  }

  static compare(a: CBORValue, b: CBORValue): number {
    let aHex = CBORWriter.toHex(a);
    let bHex = CBORWriter.toHex(b);

    if (aHex < bHex) return -1;
    if (aHex > bHex) return 1;
    return 0;
  }

  write(value: CBORValue) {
    switch (typeof value) {
      case "bigint":
        this.writeBigInt(value);
        return;
      case "number":
        this.writeFloat(value);
        return;
      case "string":
        this.writeString(value);
        return;
      case "object":
        if (value === null) {
          this.writeNull();
          return;
        }
        if ("toCBOR" in value && value.toCBOR != null) {
          this.writeCustom(value);
          return;
        }
        if (value instanceof Uint8Array) {
          this.writeBinary(value);
          return;
        }
        if (Array.isArray(value)) {
          this.writeArray(value);
          return;
        }
        throw new Error("Unsupported object type");
      case "boolean":
        this.writeBoolean(value);
        return;
      case "undefined":
        this.writeUndefined();
        return;
      default:
        throw new Error("Unsupported type");
    }
  }

  writeBigInt(value: bigint) {
    if (value >= 0) {
      encodeBigInt(0x00, value, this.buffer);
    } else {
      encodeBigInt(0x20, -1n - value, this.buffer);
    }
  }

  writeBinary(value: Uint8Array) {
    encodeBigInt(0x40, BigInt(value.length), this.buffer);
    this.buffer.pushByteArray(value);
  }

  writeBinaryChunked(value: Uint8Array[]) {
    this.buffer.pushByte(0x5f);
    for (let chunk of value) {
      this.writeBinary(chunk);
    }
    this.buffer.pushByte(0xff);
  }

  writeString(value: string) {
    let encoder = new TextEncoder();
    let bytes = encoder.encode(value);
    encodeBigInt(0x60, BigInt(bytes.length), this.buffer);
  }

  writeArray(value: CBORValue[]) {
    encodeBigInt(0x80, BigInt(value.length), this.buffer);
    for (let item of value) {
      this.write(item);
    }
  }

  writeMap(entries: [CBORValue, CBORValue][]) {
    encodeBigInt(0xa0, BigInt(entries.length), this.buffer);
    for (let [key, value] of entries) {
      this.write(key);
      this.write(value);
    }
  }

  writeTagged(tag: bigint, value: CBORValue) {
    encodeBigInt(0xc0, tag, this.buffer);
    this.write(value);
  }

  writeBoolean(value: boolean) {
    this.buffer.pushByte(value ? 0xf5 : 0xf4);
  }

  writeNull() {
    this.buffer.pushByte(0xf6);
  }

  writeUndefined() {
    this.buffer.pushByte(0xf7);
  }

  writeFloat(value: number) {
    // TODO: Support half precision floats
    let is32bits = isFinite(value) && Math.fround(value) === value;
    if (is32bits) {
      this.buffer.pushByte(0xfa);
      this.buffer.pushFloat32(value);
    } else {
      this.buffer.pushByte(0xfb);
      this.buffer.pushFloat64(value);
    }
  }

  writeCustom(value: CBORCustom) {
    value.toCBOR(this);
  }
}

function encodeBigInt(
  tagBase: number, // tag & 0b111_00000
  value: bigint,
  buffer: GrowableBuffer
) {
  if (value < 0n) value = -value;
  if (value < 0x18) {
    let tag = tagBase | Number(value);
    buffer.pushByte(tag);
  } else {
    let size: number;
    let nBits = value.toString(2).length;
    let nBytes = nBits / 8;

    if (nBytes <= 1) size = 0;
    else if (nBytes <= 2) size = 1;
    else if (nBytes <= 4) size = 2;
    else size = 3;

    let additional = 0x18 + size;
    let tag = tagBase | additional;
    buffer.pushByte(tag);
    buffer.pushBigInt(value, Math.pow(2, size + 1));
  }
}
