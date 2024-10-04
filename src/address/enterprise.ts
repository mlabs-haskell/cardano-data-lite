import { Address, AddressKind } from ".";
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
}
