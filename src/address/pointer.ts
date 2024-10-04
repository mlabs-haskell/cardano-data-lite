import { Address, AddressKind } from ".";
import { BigNum } from "../generated/out";
import { Credential } from "./credential";

export class Pointer {
  _slot: BigNum;
  _tx_index: BigNum;
  _cert_index: BigNum;

  constructor(slot: BigNum, tx_index: BigNum, cert_index: BigNum) {
    this._slot = slot;
    this._tx_index = tx_index;
    this._cert_index = cert_index;
  }

  free(): void {}

  static new(slot: number, tx_index: number, cert_index: number): Pointer {
    return new Pointer(
      new BigNum(BigInt(slot)),
      new BigNum(BigInt(tx_index)),
      new BigNum(BigInt(cert_index)),
    );
  }

  static new_pointer(
    slot: BigNum,
    tx_index: BigNum,
    cert_index: BigNum,
  ): Pointer {
    return new Pointer(slot, tx_index, cert_index);
  }

  slot(): number {
    return Number(this._slot.toJsValue());
  }

  tx_index(): number {
    return Number(this._tx_index.toJsValue());
  }

  cert_index(): number {
    return Number(this._cert_index.toJsValue());
  }

  slot_bignum(): BigNum {
    return this._slot;
  }

  tx_index_bignum(): BigNum {
    return this._tx_index;
  }

  cert_index_bignum(): BigNum {
    return this._cert_index;
  }
}

export class PointerAddress {
  _network: number;
  _payment: Credential;
  _stake: Pointer;

  constructor(network: number, payment: Credential, stake: Pointer) {
    this._network = network;
    this._payment = payment;
    this._stake = stake;
  }

  free(): void {}

  static new(
    network: number,
    payment: Credential,
    stake: Pointer,
  ): PointerAddress {
    return new PointerAddress(network, payment, stake);
  }

  payment_cred(): Credential {
    return this._payment;
  }
  stake_pointer(): Pointer {
    return this._stake;
  }

  to_address(): Address {
    return new Address({
      kind: AddressKind.Pointer,
      value: this,
    });
  }

  static from_address(addr: Address): PointerAddress | undefined {
    if (addr._variant.kind === AddressKind.Pointer) {
      return addr._variant.value;
    }
    return undefined;
  }

  network_id(): number {
    return this._network;
  }
}
