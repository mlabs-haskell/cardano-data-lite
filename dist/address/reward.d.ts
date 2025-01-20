import { Address } from ".";
import { Credential } from "./credential";
import { CBORWriter } from "../lib/cbor/writer";
import { CBORReader } from "../lib/cbor/reader";
export declare class RewardAddress {
    _network: number;
    _payment: Credential;
    constructor(network: number, payment: Credential);
    free(): void;
    static new(network: number, payment: Credential): RewardAddress;
    payment_cred(): Credential;
    to_address(): Address;
    static from_address(addr: Address): RewardAddress | undefined;
    network_id(): number;
    to_bytes(): Uint8Array;
    static from_bytes(data: Uint8Array): RewardAddress;
    serialize(writer: CBORWriter): void;
    static deserialize(reader: CBORReader, path: string[]): RewardAddress;
}
