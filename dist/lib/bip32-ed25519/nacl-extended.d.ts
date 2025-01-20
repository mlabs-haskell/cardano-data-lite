/**
 * Convert extended key to public key.
 */
export declare function extendedToPubkey(extendedKey: Uint8Array): Uint8Array;
/**
 * Create a detached ed25519 signature from a message and an extended key.
 * Note that the original tweetnacl function uses the secret key, which is used to
 * generate the extended key. Here we skip that step as we are directly provided
 * the extendedKey.
 */
export declare function signExtended(msg: Uint8Array, extendedKey: Uint8Array): Uint8Array;
