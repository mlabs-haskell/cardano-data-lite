import { sha256, sha512 } from "@noble/hashes/sha2";
import { hmac } from "@noble/hashes/hmac";
import { ExtendedPoint } from "@noble/ed25519";

import { extendedToPubkey } from "./";

export function isIndexHardened(index: number): boolean {
  return (index & 0x8000_0000) != 0;
}

export function harden(index: number): number {
  return index | 0x8000_0000;
}

export function derivePrivate(
  extendedKeyParent: Uint8Array,
  chainCodeParent: Uint8Array,
  index: number,
): {
  privateKey: Uint8Array;
  chainCode: Uint8Array;
} {
  let Z, chainCode;

  let kP = extendedKeyParent;
  let kLP = kP.slice(0, 32);
  let kRP = kP.slice(32, 64);

  let cP = chainCodeParent;

  let indexU32LE = u32LE(index);
  if (isIndexHardened(index)) {
    Z = F(cP, new Uint8Array([0x00]), kP, indexU32LE);
    chainCode = F(cP, new Uint8Array([0x01]), kP, indexU32LE);
    chainCode = truncateToRight32Bytes(chainCode);
  } else {
    let aP = extendedToPubkey(kP);
    Z = F(cP, new Uint8Array([0x02]), aP, indexU32LE);
    chainCode = F(cP, new Uint8Array([0x03]), aP, indexU32LE);
    chainCode = truncateToRight32Bytes(chainCode);
  }

  let ZL = Z.slice(0, 28);
  let ZR = Z.slice(32, 64);

  let kL = bigIntToBytesLE(
    (bytesToBigIntLE(ZL) << 3n) + bytesToBigIntLE(kLP),
    32,
  );
  let kR = bigIntToBytesLE(
    (bytesToBigIntLE(ZR) + bytesToBigIntLE(kRP)) % 2n ** 256n,
    32,
  );

  let k = new Uint8Array(64);
  k.set(kL, 0);
  k.set(kR, 32);

  // The following note is taken from ed25519-bip32 Rust library
  // note: we don't perform the check for curve order divisibility because it will not happen:
  // 1. all keys are in the range K=2^254 .. 2^255 (actually the even smaller range 2^254+2^253)
  // 2. all keys are also multiple of 8
  // 3. all existing multiple of the curve order n in the range of K are not multiple of 8

  return {
    privateKey: k,
    chainCode,
  };
}

export function derivePublic(
  parentPublicKey: Uint8Array,
  parentChainCode: Uint8Array,
  index: number,
): {
  publicKey: Uint8Array;
  chainCode: Uint8Array;
} {
  if (isIndexHardened(index))
    throw new Error("Can't do public derivation for hardened index");

  let cP = parentChainCode;
  let aP = parentPublicKey;

  let indexU32LE = u32LE(index);

  let Z = F(cP, new Uint8Array([0x02]), aP, indexU32LE);
  let ZL = Z.slice(0, 28);

  let ZLmult8 = bytesToBigIntLE(ZL) << 3n;
  let ZLmult8B = extendedToPubkey(bigIntToBytesLE(ZLmult8, 32));

  let A = pointAdd(aP, ZLmult8B);

  let chainCode = F(cP, new Uint8Array([0x03]), aP, indexU32LE);
  chainCode = truncateToRight32Bytes(chainCode);

  return {
    publicKey: A,
    chainCode,
  };
}

function pointAdd(a: Uint8Array, b: Uint8Array): Uint8Array {
  return ExtendedPoint.fromHex(a).add(ExtendedPoint.fromHex(b)).toRawBytes();
}

function F(key: Uint8Array, ...byteses: Uint8Array[]) {
  let mac = hmac.create(sha512, key);
  for (let bytes of byteses) {
    mac.update(bytes);
  }
  return mac.digest();
}

function u32LE(n: number): Uint8Array {
  const buffer = new ArrayBuffer(4); // 4 bytes for a 32-bit unsigned integer
  const view = new DataView(buffer);
  view.setUint32(0, n, true); // true for little-endian

  // Convert the ArrayBuffer to an array of bytes
  return new Uint8Array(buffer);
}

export function bytesToBigIntLE(bytes: Uint8Array): bigint {
  let n = 0n;
  for (let i = bytes.length - 1; i >= 0; i -= 1) {
    n = n << 8n;
    n += BigInt(bytes[i]);
  }
  return n;
}

export function bigIntToBytesLE(n: bigint, size: number): Uint8Array {
  if (n < 0n) throw new Error("can't serialize negative bigints");
  let bytes = new Uint8Array(size);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number(n & 0xffn);
    n = n >> 8n;
  }
  if (n != 0n) throw new Error("bigint doesn't fit in " + size + " bytes");
  return bytes;
}

function truncateToRight32Bytes(bytes: Uint8Array): Uint8Array {
  return bytes.slice(32, 64);
}
