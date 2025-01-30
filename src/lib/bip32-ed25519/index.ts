import { sha512 } from "@noble/hashes/sha2";
import { pbkdf2 } from "@noble/hashes/pbkdf2";
import { hmac } from "@noble/hashes/hmac";
import { blake2b } from "@noble/hashes/blake2b";
import nacl from "tweetnacl";
import * as naclExt from "./nacl-extended";
export * as derive from "./derive";

export function getRandomBytes(len: number): Uint8Array {
  let array = new Uint8Array(len);
  globalThis.crypto.getRandomValues(array);
  return array;
}

export function sign(msg: Uint8Array, secretKey: Uint8Array) {
  // Generate the 64-byte keypair from the 32-byte key:
  const keyPair = nacl.sign.keyPair.fromSeed(secretKey);
  return nacl.sign.detached(msg, keyPair.secretKey);
}

export function verify(
  msg: Uint8Array,
  signature: Uint8Array,
  publicKey: Uint8Array,
) {
  return nacl.sign.detached.verify(msg, signature, publicKey);
}

export function secretToPubkey(secretKey: Uint8Array) {
  // CSL secret => nacl seed
  // nacl secret => nacl seed || nacl pubkey  (|| means concatenation)
  return nacl.sign.keyPair.fromSeed(secretKey).publicKey;
}

export const signExtended = naclExt.signExtended;
export const extendedToPubkey = naclExt.extendedToPubkey;

/**
 * Hash the secret using sha512 and normalize the result by clearing and setting
 * a bunch of bits as per the bip32-ed25519 spec.
 */
export function secretToExtended(secret: Uint8Array) {
  let extended = sha512(secret);
  extended[0] &= 0b1111_1000; // clear last 3 bits
  extended[31] &= 0b0111_1111; // clear the highest bit
  extended[31] |= 0b0100_0000; // set the second highest bit

  return extended;
}

/**
 * Bip32-Ed25519 only admits Ed25519 extended keys whose 3rd highest bit is clear.
 * This function clears that bit.
 * Modifies the extendedKey in place.
 */
export function normalizeExtendedForBip32Ed25519(extendedKey: Uint8Array) {
  extendedKey[0] &= 0b1111_1000; // clear last 3 bits
  extendedKey[31] &= 0b0111_1111; // clear the highest bit
  extendedKey[31] |= 0b0100_0000; // set the second highest bit

  extendedKey[31] &= 0b1101_1111;
}

export function blake2b224(data: Uint8Array): Uint8Array {
  return blake2b(data, { dkLen: 28 });
}

export function bip32PrivateKeyFromEntropy(
  entropy: Uint8Array,
  password: Uint8Array,
): Uint8Array {
  const LEN = 96;
  const ITER = 4096;

  let bytes = pbkdf2(sha512, password, entropy, { c: ITER, dkLen: LEN });
  normalizeExtendedForBip32Ed25519(bytes);

  return bytes;
}
