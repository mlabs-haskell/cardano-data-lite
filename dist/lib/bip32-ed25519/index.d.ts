import * as naclExt from "./nacl-extended";
export * as derive from "./derive";
export declare function getRandomBytes(len: number): Uint8Array;
export declare function sign(msg: Uint8Array, secretKey: Uint8Array): Uint8Array;
export declare function verify(msg: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): boolean;
export declare function secretToPubkey(secretKey: Uint8Array): Uint8Array;
export declare const signExtended: typeof naclExt.signExtended;
export declare const extendedToPubkey: typeof naclExt.extendedToPubkey;
/**
 * Hash the secret using sha512 and normalize the result by clearing and setting
 * a bunch of bits as per the bip32-ed25519 spec.
 */
export declare function secretToExtended(secret: Uint8Array): Uint8Array;
/**
 * Bip32-Ed25519 only admits Ed25519 extended keys whose 3rd highest bit is clear.
 * This function clears that bit.
 * Modifies the extendedKey in place.
 */
export declare function normalizeExtendedForBip32Ed25519(extendedKey: Uint8Array): void;
export declare function blake2b224(data: Uint8Array): Uint8Array;
export declare function bip32PrivateKeyFromEntropy(entropy: Uint8Array, password: Uint8Array): Uint8Array;
