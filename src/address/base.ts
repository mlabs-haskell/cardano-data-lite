import { Address, AddressKind } from ".";
import { GrowableBuffer } from "../cbor/growable-buffer";
import { Credential } from "./credential";

export class BaseAddress {
  _network: number;
  _payment: Credential;
  _stake: Credential;

  constructor(network: number, payment: Credential, stake: Credential) {
    this._network = network;
    this._payment = payment;
    this._stake = stake;
  }

  payment_cred(): Credential {
    return this._payment;
  }

  stake_cred(): Credential {
    return this._stake;
  }

  to_address(): Address {
    return new Address({
      kind: AddressKind.Base,
      value: this,
    });
  }

  static from_address(addr: Address): BaseAddress | undefined {
    if (addr._variant.kind == AddressKind.Base) {
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
      (this._payment.kind() << 4) |
      (this._stake.kind() << 5) |
      (this._network & 0xf);
    buf.pushByte(header);
    buf.pushByteArray(this._payment._to_raw_bytes());
    buf.pushByteArray(this._stake._to_raw_bytes());
    return buf.getBytes();
  }
}
