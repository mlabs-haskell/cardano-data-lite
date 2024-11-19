import { ByronAddress } from "./byron";
import { MalformedAddress } from "./malformed";
import { EnterpriseAddress } from "./enterprise";
import { BaseAddress } from "./base";
import { Credential } from "./credential";
import { RewardAddress } from "./reward";
import { CBORWriter } from "../lib/cbor/writer";
import { CBORReader } from "../lib/cbor/reader";

export * from "./byron";
export * from "./malformed";
export * from "./enterprise";
export * from "./base";
export * from "./credential";
export * from "./network_info";
export * from "./reward";

export enum AddressKind {
  Base,
  Enterprise,
  Reward,
  Byron,
  Malformed,
}

export type AddressVariant =
  | {
      kind: AddressKind.Base;
      value: BaseAddress;
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
    switch (this._variant.kind) {
      case AddressKind.Base:
        return this._variant.value.to_bytes();
      case AddressKind.Enterprise:
        return this._variant.value.to_bytes();
      case AddressKind.Reward:
        return this._variant.value.to_bytes();
      case AddressKind.Byron:
        return this._variant.value.to_bytes();
      case AddressKind.Malformed:
        return this._variant.value.original_bytes();
    }
  }

  static from_bytes(bytes: Uint8Array, path: string[]): Address {
    if (bytes.length < 1) {
      return new Address({
        kind: AddressKind.Malformed,
        value: new MalformedAddress(bytes),
      });
    }

    const header = bytes[0];
    switch (header & 0b1111) {
      case 0b0000:
      case 0b0001:
      case 0b0010:
      case 0b0011:
        return new Address({
          kind: AddressKind.Byron,
          value: ByronAddress.from_bytes(bytes, path),
        });
      case 0b0110:
      case 0b0111:
        return new Address({
          kind: AddressKind.Enterprise,
          value: EnterpriseAddress.from_bytes(bytes),
        });
      case 0b1110:
      case 0b1111:
        return new Address({
          kind: AddressKind.Reward,
          value: RewardAddress.from_bytes(bytes),
        });
      default:
        return new Address({
          kind: AddressKind.Malformed,
          value: new MalformedAddress(bytes),
        });
    }
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.to_bytes());
  }

  static deserialize(reader: CBORReader, path: string[]): Address {
    return Address.from_bytes(reader.readBytes(path), path);
  }
}
