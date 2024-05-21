import { GrowableBuffer } from "./growable-buffer";
import { CBORItem, CBORItem_, SizeBytes } from "./model";

export function encode(cbor: CBORItem, buffer: GrowableBuffer) {
  switch (cbor.type) {
    case "uint":
      encodeUInt(cbor, buffer);
      return;
    case "nint":
      encodeNegInt(cbor, buffer);
      return;
    case "bstr":
      encodeByteString(cbor, buffer);
      return;
    case "tstr":
      encodeTextString(cbor, buffer);
      return;
    case "array":
      encodeArray(cbor, buffer);
      return;
    case "map":
      encodeMap(cbor, buffer);
      return;
    case "boolean":
      buffer.pushByte(cbor.value ? 0xf5 : 0xf4);
      return;
    case "null":
      buffer.pushByte(0xf6);
      return;
    case "undefined":
      buffer.pushByte(0xf7);
      return;
    case "float":
      encodeFloat(cbor, buffer);
      return;
    case "tagged":
      encodeTagged(cbor, buffer);
      return;
    default:
      throw "Unreachable: cbor encode";
  }
}

function encodeBigInt(
  tagBase: number, // tag & 0b111_00000
  size: SizeBytes,
  value: bigint,
  buffer: GrowableBuffer
) {
  let additional: number;
  switch (size) {
    case 0:
      additional = Number(value) > 0x17 ? 0x17 : Number(value);
      break;
    default:
      additional = 0x18 + Math.log2(size);
      break;
  }

  let tag = tagBase | additional;

  buffer.pushByte(tag);
  if (size > 0) buffer.pushBigInt(value, size);
}

function encodeUInt(cbor: CBORItem_<"uint">, buffer: GrowableBuffer) {
  encodeBigInt(0x00, cbor.size, cbor.value, buffer);
}

function encodeNegInt(cbor: CBORItem_<"nint">, buffer: GrowableBuffer) {
  encodeBigInt(0x20, cbor.size, cbor.value, buffer);
}

function _encodeByteString(
  tagBase: number,
  cbor: Omit<CBORItem_<"bstr">, "type">,
  buffer: GrowableBuffer
) {
  if (cbor.size instanceof Array) {
    let additional = 0x1f;
    let tag = tagBase | additional;
    buffer.pushByte(tag);

    let bstr = cbor.value;
    for (let [chunkLen, size] of cbor.size) {
      let chunk = bstr.slice(0, chunkLen);
      bstr = bstr.slice(chunkLen);
      _encodeByteString(tagBase, { size, value: chunk }, buffer);
    }

    buffer.pushByte(0xff);
  } else {
    encodeBigInt(tagBase, cbor.size, BigInt(cbor.value.length), buffer);
  }
}

function encodeByteString(cbor: CBORItem_<"bstr">, buffer: GrowableBuffer) {
  _encodeByteString(0x40, cbor, buffer);
}

function encodeTextString(cbor: CBORItem_<"tstr">, buffer: GrowableBuffer) {
  let encoder = new TextEncoder();
  let bytes = encoder.encode(cbor.value);
  _encodeByteString(0x60, { size: cbor.size, value: bytes }, buffer);
}

function encodeArray(cbor: CBORItem_<"array">, buffer: GrowableBuffer) {
  let tagBase = 0x80;
  if (cbor.size == null) {
    let additional = 0x1f;
    let tag = tagBase | additional;
    buffer.pushByte(tag);
    for (let item of cbor.value) {
      encode(item, buffer);
    }
    buffer.pushByte(0xff);
  } else {
    encodeBigInt(tagBase, cbor.size, BigInt(cbor.value.length), buffer);
    for (let item of cbor.value) {
      encode(item, buffer);
    }
  }
}

function encodeMap(cbor: CBORItem_<"map">, buffer: GrowableBuffer) {
  let tagBase = 0xa0;
  if (cbor.size == null) {
    let additional = 0x1f;
    let tag = tagBase | additional;
    buffer.pushByte(tag);
    for (let [key, value] of cbor.value) {
      encode(key, buffer);
      encode(value, buffer);
    }
    buffer.pushByte(0xff);
  } else {
    encodeBigInt(tagBase, cbor.size, BigInt(cbor.value.length), buffer);
    for (let [key, value] of cbor.value) {
      encode(key, buffer);
      encode(value, buffer);
    }
  }
}

function encodeFloat(cbor: CBORItem_<"float">, buffer: GrowableBuffer) {
  if (cbor.size == 4) {
    buffer.pushByte(0xfa);
    buffer.pushFloat32(cbor.value);
  } else {
    buffer.pushByte(0xfb);
    buffer.pushFloat64(cbor.value);
  }
}

function encodeTagged(cbor: CBORItem_<"tagged">, buffer: GrowableBuffer) {
  let tagBase = 0xc0;
  let additional = cbor.tag;
  let tag = tagBase | additional;
  buffer.pushByte(tag);
  encode(cbor.value, buffer);
}
