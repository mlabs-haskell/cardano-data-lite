import { Address, AddressKind } from "./index.js";
import { GrowableBuffer } from "../lib/cbor/growable-buffer.js";
import { Credential } from "./credential.js";
export class EnterpriseAddress {
    _network;
    _payment;
    constructor(network, payment) {
        this._network = network;
        this._payment = payment;
    }
    free() { }
    static new(network, payment) {
        return new EnterpriseAddress(network, payment);
    }
    payment_cred() {
        return this._payment;
    }
    to_address() {
        return new Address({
            kind: AddressKind.Enterprise,
            value: this,
        });
    }
    static from_address(addr) {
        if (addr._variant.kind === AddressKind.Enterprise) {
            return addr._variant.value;
        }
        return undefined;
    }
    network_id() {
        return this._network;
    }
    to_bytes() {
        let buf = new GrowableBuffer();
        let header = 0b0110_0000 | (this._payment.kind() << 4) | (this._network & 0xf);
        buf.pushByte(header);
        buf.pushByteArray(this._payment._to_raw_bytes());
        return buf.getBytes();
    }
    static from_bytes(data) {
        const HASH_LEN = Credential.HASH_LEN;
        if (data.length != 1 + HASH_LEN) {
            throw new Error("Invalid EnterpriseAddress data length");
        }
        let network = data[0] & 0xf;
        let payment = Credential._from_raw_bytes((data[0] >> 4) & 0b1, data.slice(1));
        return new EnterpriseAddress(network, payment);
    }
}
