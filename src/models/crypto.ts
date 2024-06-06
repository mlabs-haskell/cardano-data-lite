import { CBORReaderValue, ParseFailed } from "../cbor2/reader";
import { CBORCustom } from "../cbor2/types";
import { CBORWriter } from "../cbor2/writer";

function assertBytesSize(bytes: Uint8Array, size: number, path?: string[]) {
  if (bytes.length != size) {
    throw new ParseFailed(
      path || [],
      "value",
      `length: ${size}`,
      bytes.length.toString()
    );
  }
}

function assertBytesSizeRange(
  bytes: Uint8Array,
  size: { min?: number; max?: number },
  path?: string[]
) {
  if (size?.min != null && bytes.length < size.min) {
    throw new ParseFailed(
      path || [],
      "value",
      `length >= ${size.min}`,
      bytes.length.toString()
    );
  }
  if (size?.max != null && bytes.length > size.max) {
    throw new ParseFailed(
      path || [],
      "value",
      `length >= ${size.max}`,
      bytes.length.toString()
    );
  }
}

export class Bytes implements CBORCustom {
  public readonly bytes: Uint8Array;

  constructor(bytes: Uint8Array) {
    this.bytes = bytes;
  }

  assertSize(size: number, path?: string[]) {
    assertBytesSize(this.bytes, size, path);
  }

  assertSizeRange(size: { min?: number; max?: number }, path?: string[]) {
    assertBytesSizeRange(this.bytes, size, path);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeBinary(this.bytes);
  }
}

export class Bytes28 extends Bytes {
  constructor(bytes: Uint8Array, path?: string[]) {
    super(bytes);
    this.assertSize(32, path);
  }

  static fromCBOR(value: CBORReaderValue): Bytes28 {
    return new Bytes28(value.get("bstr"), value.path);
  }
}

export class Bytes32 extends Bytes {
  constructor(bytes: Uint8Array, path?: string[]) {
    super(bytes);
    this.assertSize(32, path);
  }

  static fromCBOR(value: CBORReaderValue): Bytes32 {
    return new Bytes32(value.get("bstr"), value.path);
  }
}

export class Bytes64 extends Bytes {
  constructor(bytes: Uint8Array, path?: string[]) {
    super(bytes);
    this.assertSize(64, path);
  }

  static fromCBOR(value: CBORReaderValue): Bytes64 {
    return new Bytes64(value.get("bstr"), value.path);
  }
}

export type Hash28 = Bytes28;
export type Hash32 = Bytes32;

export type VKey = Bytes32;

export type VrfVKey = Bytes32;

export class VrfCert implements CBORCustom {
  public readonly output: Uint8Array;
  public readonly proof: Uint8Array;

  constructor(output: Uint8Array, proof: Uint8Array, proofPath?: string[]) {
    if (proof.length != 80)
      throw new ParseFailed(
        proofPath || [],
        "value",
        "length: 80",
        proof.length.toString()
      );
    this.output = output;
    this.proof = proof;
  }

  static fromCBOR(value: CBORReaderValue): VrfCert {
    let array = value.get("array");
    let output = array.getRequired(0).get("bstr");
    let proof_ = array.getRequired(1);
    let proof = proof_.get("bstr");
    return new VrfCert(output, proof, proof_.path);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray([this.output, this.proof]);
  }
}

export type KesVKey = Bytes32;

export class KesSignature extends Bytes {
  constructor(bytes: Uint8Array, path?: string[]) {
    super(bytes);
    this.assertSize(448, path);
  }
  static fromCBOR(value: CBORReaderValue): KesSignature {
    return new KesSignature(value.get("bstr"), value.path);
  }
}

export type SignkeyKES = Bytes64;

export type Signature = Bytes64;
