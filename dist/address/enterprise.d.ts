import { Address } from ".";
import { Credential } from "./credential";
export declare class EnterpriseAddress {
    _network: number;
    _payment: Credential;
    constructor(network: number, payment: Credential);
    free(): void;
    static new(network: number, payment: Credential): EnterpriseAddress;
    payment_cred(): Credential;
    to_address(): Address;
    static from_address(addr: Address): EnterpriseAddress | undefined;
    network_id(): number;
    to_bytes(): Uint8Array;
    static from_bytes(data: Uint8Array): EnterpriseAddress;
}
