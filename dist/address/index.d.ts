import { ByronAddress } from "./byron";
import { MalformedAddress } from "./malformed";
import { EnterpriseAddress } from "./enterprise";
import { BaseAddress } from "./base";
import { Credential } from "./credential";
import { RewardAddress } from "./reward";
import { CBORWriter } from "../lib/cbor/writer";
import { CBORReader } from "../lib/cbor/reader";
export * from "./byron";
export * from "./malformed";
export * from "./enterprise";
export * from "./base";
export * from "./credential";
export * from "./network_info";
export * from "./reward";
export declare enum AddressKind {
    Base = 0,
    Enterprise = 1,
    Reward = 2,
    Byron = 3,
    Malformed = 4
}
export type AddressVariant = {
    kind: AddressKind.Base;
    value: BaseAddress;
} | {
    kind: AddressKind.Enterprise;
    value: EnterpriseAddress;
} | {
    kind: AddressKind.Reward;
    value: RewardAddress;
} | {
    kind: AddressKind.Byron;
    value: ByronAddress;
} | {
    kind: AddressKind.Malformed;
    value: MalformedAddress;
};
export declare class Address {
    _variant: AddressVariant;
    constructor(variant: AddressVariant);
    free(): void;
    kind(): AddressKind;
    payment_cred(): Credential | undefined;
    is_malformed(): boolean;
    network_id(): number;
    to_bytes(): Uint8Array;
    static from_bytes(bytes: Uint8Array, path: string[]): Address;
    to_bech32(prefix_str: string | undefined): string;
    static from_bech32(bech_str: string): Address;
    serialize(writer: CBORWriter): void;
    static deserialize(reader: CBORReader, path: string[]): Address;
}
