import { GrowableBuffer } from "./growable-buffer";
import { bytesToHex, hexToBytes } from "../hex";

export class CBORWriter {
  private buffer: GrowableBuffer;

  constructor() {
    this.buffer = new GrowableBuffer();
  }

  getBytes(): Uint8Array {
    return this.buffer.getBytes();
  }

  getHex(): string {
    return bytesToHex(this.getBytes());
  }

  writeInt(value: bigint) {
    if (value >= 0) {
      this.writeBigInt(0x00, value);
    } else {
      this.writeBigInt(0x20, -1n - value);
    }
  }

  writeBytesTag(len: number | null) {
    this.writeBigInt(0x40, len == null ? null : BigInt(len));
  }

  writeBytesValue(value: Uint8Array) {
    this.buffer.pushByteArray(value);
  }

  writeBytes(value: Uint8Array) {
    this.writeBytesTag(value.length);
    this.writeBytesValue(value);
  }

  writeBytesChunked(value: Uint8Array, chunkSize: number) {
    if (value.length <= chunkSize) {
      this.writeBytes(value);
      return;
    }

    this.writeBytesTag(null);
    for (let i = 0; i < value.length; i += chunkSize) {
      let chunk = value.slice(i, i + chunkSize);
      this.writeBytes(chunk);
    }
    this.buffer.pushByte(0xff);
  }

  writeStringTag(len: number | null) {
    this.writeBigInt(0x60, len == null ? null : BigInt(len));
  }

  writeStringValue(value: string) {
    this.writeBytesValue(new TextEncoder().encode(value));
  }

  writeString(value: string) {
    this.writeStringTag(value.length);
    this.writeStringValue(value);
  }

  writeArrayTag(len: number | null) {
    this.writeBigInt(0x80, len == null ? null : BigInt(len));
  }

  writeArray<T>(
    array: { length: number } & Iterable<T>,
    write: (writer: CBORWriter, value: T) => void,
    definiteEncoding: boolean = true
  ) {
    this.writeArrayTag(definiteEncoding ? array.length : null);
    for (let item of array) {
      write(this, item);
    }
    if (!definiteEncoding) {
      this.buffer.pushByte(0xff);
    }
  }

  writeBreak() {
    this.writeBytesValue(hexToBytes('0xff'));
  }

  writeMapTag(len: number | null) {
    this.writeBigInt(0xa0, len == null ? null : BigInt(len));
  }

  writeMap<T>(
    map: { length: number } & Iterable<T>,
    write: (writer: CBORWriter, value: T) => void,
  ) {
    this.writeMapTag(map.length);
    for (let item of map) {
      write(this, item);
    }
  }

  writeTaggedTag(tag: number) {
    this.writeBigInt(0xc0, BigInt(tag));
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

  private writeBigInt(
    tagBase: number, // tag & 0b111_00000
    value: bigint | null,
  ) {
    if (value == null) {
      let tag = tagBase | 0x1f;
      this.buffer.pushByte(tag);
      return;
    }

    if (value < 0n) {
      throw new CBORWriteError("Can't write negative bigint: " + String(value));
    }

    if (value < 0x18) {
      let tag = tagBase | Number(value);
      this.buffer.pushByte(tag);
      return;
    }

    let size: number;
    let nBits = value.toString(2).length;
    let nBytes = nBits / 8;

    if (nBytes <= 1) size = 0;
    else if (nBytes <= 2) size = 1;
    else if (nBytes <= 4) size = 2;
    else size = 3;

    let additional = 0x18 + size;
    let tag = tagBase | additional;
    this.buffer.pushByte(tag);
    this.buffer.pushBigInt(value, Math.pow(2, size));
  }
}

export class CBORWriteError extends Error {
  constructor(message: string) {
    super(message);
  }
}
