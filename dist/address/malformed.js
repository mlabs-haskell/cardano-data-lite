import { Address, AddressKind } from "./index.js";
export class MalformedAddress {
    _bytes;
    constructor(bytes) {
        this._bytes = bytes;
    }
    original_bytes() {
        return new Uint8Array(this._bytes);
    }
    static from_address(addr) {
        if (addr._variant.kind == AddressKind.Malformed) {
            return addr._variant.value;
        }
        return undefined;
    }
    to_address() {
        return new Address({ kind: AddressKind.Malformed, value: this });
    }
}
