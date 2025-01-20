import { sha512 } from "@noble/hashes/sha2";
import { pbkdf2 } from "@noble/hashes/pbkdf2";
import { blake2b } from "@noble/hashes/blake2b";
import nacl from "tweetnacl";
import * as naclExt from "./nacl-extended.js";
export * as derive from "./derive.js";
export function getRandomBytes(len) {
    let array = new Uint8Array(len);
    globalThis.crypto.getRandomValues(array);
    return array;
}
export function sign(msg, secretKey) {
    return nacl.sign.detached(msg, secretKey);
}
export function verify(msg, signature, publicKey) {
    return nacl.sign.detached.verify(msg, signature, publicKey);
}
export function secretToPubkey(secretKey) {
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
export function secretToExtended(secret) {
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
export function normalizeExtendedForBip32Ed25519(extendedKey) {
    extendedKey[0] &= 0b1111_1000; // clear last 3 bits
    extendedKey[31] &= 0b0111_1111; // clear the highest bit
    extendedKey[31] |= 0b0100_0000; // set the second highest bit
    extendedKey[31] &= 0b1101_1111;
}
export function blake2b224(data) {
    return blake2b(data, { dkLen: 28 });
}
export function bip32PrivateKeyFromEntropy(entropy, password) {
    const LEN = 96;
    const ITER = 4096;
    let bytes = pbkdf2(sha512, password, entropy, { c: ITER, dkLen: LEN });
    normalizeExtendedForBip32Ed25519(bytes);
    return bytes;
}
