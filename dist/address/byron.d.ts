import { Address } from ".";
import { CBORReader } from "../lib/cbor/reader";
import { CBORWriter } from "../lib/cbor/writer";
export declare class ByronAddress {
    _address: Uint8Array;
    _attributes: ByronAttributes;
    _address_type: ByronAddressType;
    constructor(address: Uint8Array, attributes: ByronAttributes, address_type: ByronAddressType);
    static new(address: Uint8Array, attributes: ByronAttributes, address_type: ByronAddressType): ByronAddress;
    serializeInner(writer: CBORWriter): void;
    static deserializeInner(reader: CBORReader, path: string[]): ByronAddress;
    serialize(writer: CBORWriter): void;
    static deserialize(reader: CBORReader, path: string[]): ByronAddress;
    static from_bytes(bytes: Uint8Array, path?: string[]): ByronAddress;
    to_bytes(): Uint8Array;
    byron_protocol_magic(): number;
    attributes(): Uint8Array;
    network_id(): number;
    static from_base58(s: string): ByronAddress;
    to_base58(): string;
    static is_valid(s: string): boolean;
    to_address(): Address;
    static from_address(addr: Address): ByronAddress | undefined;
}
export declare class ByronAttributes {
    _derivation_path?: Uint8Array;
    _protocol_magic?: number;
    constructor(derivation_path?: Uint8Array, protocol_magic?: number);
    serialize(writer: CBORWriter): void;
    static deserialize(reader: CBORReader, path: string[]): ByronAttributes;
}
export declare enum ByronAddressType {
    PubKey = 0,
    Script = 1,
    Redeem = 2
}
