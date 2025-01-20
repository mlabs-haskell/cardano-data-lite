export declare class CBORWriter {
    private buffer;
    constructor();
    getBytes(): Uint8Array;
    getHex(): string;
    writeInt(value: bigint): void;
    writeBytesTag(len: number | null): void;
    writeBytesValue(value: Uint8Array): void;
    writeBytes(value: Uint8Array): void;
    writeBytesChunked(value: Uint8Array, chunkSize: number): void;
    writeStringTag(len: number | null): void;
    writeStringValue(value: string): void;
    writeString(value: string): void;
    writeArrayTag(len: number | null): void;
    writeArray<T>(array: {
        length: number;
    } & Iterable<T>, write: (writer: CBORWriter, value: T) => void, definiteEncoding?: boolean): void;
    writeBreak(): void;
    writeMapTag(len: number | null): void;
    writeMap<T>(map: {
        length: number;
    } & Iterable<T>, write: (writer: CBORWriter, value: T) => void): void;
    writeTaggedTag(tag: number): void;
    writeBoolean(value: boolean): void;
    writeNull(): void;
    writeUndefined(): void;
    writeFloat(value: number): void;
    private writeBigInt;
}
export declare class CBORWriteError extends Error {
    constructor(message: string);
}
