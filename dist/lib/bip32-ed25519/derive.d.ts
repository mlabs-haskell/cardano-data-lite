export declare function isIndexHardened(index: number): boolean;
export declare function harden(index: number): number;
export declare function derivePrivate(extendedKeyParent: Uint8Array, chainCodeParent: Uint8Array, index: number): {
    privateKey: Uint8Array;
    chainCode: Uint8Array;
};
export declare function derivePublic(parentPublicKey: Uint8Array, parentChainCode: Uint8Array, index: number): {
    publicKey: Uint8Array;
    chainCode: Uint8Array;
};
export declare function bytesToBigIntLE(bytes: Uint8Array): bigint;
export declare function bigIntToBytesLE(n: bigint, size: number): Uint8Array;
