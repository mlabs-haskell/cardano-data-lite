import { Address } from ".";
export declare class MalformedAddress {
    _bytes: Uint8Array;
    constructor(bytes: Uint8Array);
    original_bytes(): Uint8Array;
    static from_address(addr: Address): MalformedAddress | undefined;
    to_address(): Address;
}
