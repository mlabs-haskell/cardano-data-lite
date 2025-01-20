import { Address, AddressKind } from "./index.js";
import { GrowableBuffer } from "../lib/cbor/growable-buffer.js";
import { Credential } from "./credential.js";
export class BaseAddress {
    _network;
    _payment;
    _stake;
    constructor(network, payment, stake) {
        this._network = network;
        this._payment = payment;
        this._stake = stake;
    }
    static new(network, payment, stake) {
        return new BaseAddress(network, payment, stake);
    }
    payment_cred() {
        return this._payment;
    }
    stake_cred() {
        return this._stake;
    }
    to_address() {
        return new Address({
            kind: AddressKind.Base,
            value: this,
        });
    }
    static from_address(addr) {
        if (addr._variant.kind == AddressKind.Base) {
            return addr._variant.value;
        }
        return undefined;
    }
    network_id() {
        return this._network;
    }
    to_bytes() {
        let buf = new GrowableBuffer();
        let header = (this._payment.kind() << 4) |
            (this._stake.kind() << 5) |
            (this._network & 0xf);
        buf.pushByte(header);
        buf.pushByteArray(this._payment._to_raw_bytes());
        buf.pushByteArray(this._stake._to_raw_bytes());
        return buf.getBytes();
    }
    static from_bytes(data) {
        const HASH_LEN = Credential.HASH_LEN;
        if (data.length != 1 + 2 * HASH_LEN) {
            throw new Error("Invalid BaseAddress data length");
        }
        let header = data[0];
        let network = header & 0xf;
        let payment_kind = (header >> 4) & 0x1;
        let stake_kind = (header >> 5) & 0x1;
        let payment = Credential._from_raw_bytes(payment_kind, data.slice(1, 1 + HASH_LEN));
        let stake = Credential._from_raw_bytes(stake_kind, data.slice(1 + HASH_LEN, 1 + 2 * HASH_LEN));
        return new BaseAddress(network, payment, stake);
    }
}
