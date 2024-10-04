import { Address, AddressKind } from ".";
import { Credential } from "./credential";

export class RewardAddress {
  _network: number;
  _payment: Credential;

  constructor(network: number, payment: Credential) {
    this._network = network;
    this._payment = payment;
  }

  free(): void {}

  static new(network: number, payment: Credential): RewardAddress {
    return new RewardAddress(network, payment);
  }

  payment_cred(): Credential {
    return this._payment;
  }

  to_address(): Address {
    return new Address({
      kind: AddressKind.Reward,
      value: this,
    });
  }

  static from_address(addr: Address): RewardAddress | undefined {
    if (addr._variant.kind === AddressKind.Reward) {
      return addr._variant.value;
    }
    return undefined;
  }

  network_id(): number {
    return this._network;
  }
}
