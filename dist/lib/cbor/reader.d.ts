type CBORType = "uint" | "nint" | "bytes" | "string" | "array" | "map" | "boolean" | "null" | "undefined" | "float" | "tagged";
export declare class CBORReader {
    private buffer;
    constructor(buffer: Uint8Array);
    peekType(path: string[]): CBORType;
    isBreak(): boolean;
    readBreak(path?: string[]): void;
    readUint(path: string[]): bigint;
    readInt(path: string[]): bigint;
    readBytes(path: string[]): Uint8Array;
    readString(path: string[]): string;
    readArrayTag(path: string[]): number | null;
    readMapTag(path: string[]): number | null;
    readN(n: number, fn: (reader: CBORReader, idx: number) => void): void;
    readTillBreak(fn: (reader: CBORReader, idx: number) => void): void;
    readMultiple(n: number | null, fn: (reader: CBORReader, idx: number) => void): void;
    readArray<T>(readItem: (reader: CBORReader, idx: number) => T, path: string[]): {
        items: T[];
        definiteEncoding: boolean;
    };
    readMap<T>(readItem: (reader: CBORReader, idx: number) => T, path: string[]): T[];
    readBoolean(path: string[]): boolean;
    readNull(path: string[]): null;
    readNullable<T>(fn: (reader: CBORReader) => T, path: string[]): T | null;
    readUndefined(path: string[]): undefined;
    readFloat(path: string[]): number;
    readTaggedTag(path: string[]): number;
    readTaggedTagAsBigInt(path: string[]): bigint;
    assertType(expectedTypes: CBORType[], path: string[]): void;
    private readLength;
    private readBigInt;
    private readByteString;
}
export declare function bigintFromBytes(nBytes: number, stream: Uint8Array): bigint;
export declare class CBORInvalidTag extends Error {
    tag: number;
    constructor(tag: number);
}
export declare class CBORUnexpectedType extends Error {
    expected: CBORType[];
    received: CBORType;
    constructor(expected: CBORType[], received: CBORType);
}
export {};
