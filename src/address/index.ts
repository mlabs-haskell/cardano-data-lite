import { ByronAddress } from "./byron";
import { PointerAddress } from "./pointer";
import { MalformedAddress } from "./malformed";
import { EnterpriseAddress } from "./enterprise";
import { BaseAddress } from "./base";
import { Credential } from "./credential";
import { RewardAddress } from "./reward";

export * from "./byron";
export * from "./pointer";
export * from "./malformed";
export * from "./enterprise";
export * from "./base";
export * from "./credential";
export * from "./network_info";
export * from "./reward";

export enum AddressKind {
  Base,
  Pointer,
  Enterprise,
  Reward,
  Byron,
  Malformed,
}

type AddressVariant =
  | {
      kind: AddressKind.Base;
      value: BaseAddress;
    }
  | {
      kind: AddressKind.Pointer;
      value: PointerAddress;
    }
  | {
      kind: AddressKind.Enterprise;
      value: EnterpriseAddress;
    }
  | {
      kind: AddressKind.Reward;
      value: RewardAddress;
    }
  | {
      kind: AddressKind.Byron;
      value: ByronAddress;
    }
  | {
      kind: AddressKind.Malformed;
      value: MalformedAddress;
    };

export class Address {
  _variant: AddressVariant;

  constructor(variant: AddressVariant) {
    this._variant = variant;
  }

  free(): void {}

  kind(): AddressKind {
    return this._variant.kind;
  }

  payment_cred(): Credential | undefined {
    switch (this._variant.kind) {
      case AddressKind.Base:
        return this._variant.value.payment_cred();
      case AddressKind.Pointer:
        return this._variant.value.payment_cred();
      case AddressKind.Enterprise:
        return this._variant.value.payment_cred();
      case AddressKind.Reward:
        return this._variant.value.payment_cred();
      case AddressKind.Byron:
        return undefined;
      case AddressKind.Malformed:
        return undefined;
    }
  }

  is_malformed(): boolean {
    return this._variant.kind === AddressKind.Malformed;
  }

  network_id(): number {
    switch (this._variant.kind) {
      case AddressKind.Base:
        return this._variant.value.network_id();
      case AddressKind.Pointer:
        return this._variant.value.network_id();
      case AddressKind.Enterprise:
        return this._variant.value.network_id();
      case AddressKind.Reward:
        return this._variant.value.network_id();
      case AddressKind.Byron:
        return this._variant.value.network_id();
      case AddressKind.Malformed:
        throw new Error("Malformed address");
    }
  }

  to_bytes(): Uint8Array {
    // TODO
    throw new Error("Not Implemented");
  }

  static from_bytes(bytes: Uint8Array): Address {
    // TODO
    throw new Error("Not Implemented");
  }
}
