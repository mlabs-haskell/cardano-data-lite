import { Address } from ".";
import { Credential } from "./credential";
export declare class BaseAddress {
    _network: number;
    _payment: Credential;
    _stake: Credential;
    constructor(network: number, payment: Credential, stake: Credential);
    static new(network: number, payment: Credential, stake: Credential): BaseAddress;
    payment_cred(): Credential;
    stake_cred(): Credential;
    to_address(): Address;
    static from_address(addr: Address): BaseAddress | undefined;
    network_id(): number;
    to_bytes(): Uint8Array;
    static from_bytes(data: Uint8Array): BaseAddress;
}
