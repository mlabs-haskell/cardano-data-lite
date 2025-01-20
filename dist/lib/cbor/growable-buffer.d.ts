export declare class GrowableBuffer {
    private buffer;
    private dataView;
    private occupiedLength;
    constructor();
    getBuffer(): ArrayBuffer;
    getBytes(): Uint8Array;
    pushByte(value: number): void;
    pushByteArray(value: Uint8Array): void;
    pushBigInt(value: bigint, nBytes?: number): void;
    pushFloat32(value: number): void;
    pushFloat64(value: number): void;
    private growIfNeeded;
}
