import { Address, AddressKind } from ".";
import { GrowableBuffer } from "../lib/cbor/growable-buffer";
import { Credential } from "./credential";

export class EnterpriseAddress {
  _network: number;
  _payment: Credential;

  constructor(network: number, payment: Credential) {
    this._network = network;
    this._payment = payment;
  }

  free(): void {}

  static new(network: number, payment: Credential): EnterpriseAddress {
    return new EnterpriseAddress(network, payment);
  }

  payment_cred(): Credential {
    return this._payment;
  }

  to_address(): Address {
    return new Address({
      kind: AddressKind.Enterprise,
      value: this,
    });
  }

  static from_address(addr: Address): EnterpriseAddress | undefined {
    if (addr._variant.kind === AddressKind.Enterprise) {
      return addr._variant.value;
    }
    return undefined;
  }

  network_id(): number {
    return this._network;
  }

  to_bytes(): Uint8Array {
    let buf = new GrowableBuffer();
    let header =
      0b0110_0000 | (this._payment.kind() << 4) | (this._network & 0xf);
    buf.pushByte(header);
    buf.pushByteArray(this._payment._to_raw_bytes());
    return buf.getBytes();
  }

  static from_bytes(data: Uint8Array): EnterpriseAddress {
    const HASH_LEN = Credential.HASH_LEN;

    if (data.length != 1 + HASH_LEN) {
      throw new Error("Invalid EnterpriseAddress data length");
    }

    let network = data[0] & 0xf;
    let payment = Credential._from_raw_bytes(
      (data[0] >> 4) & 0b1,
      data.slice(1),
    );

    return new EnterpriseAddress(network, payment);
  }
}
