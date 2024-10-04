import { Address, AddressKind } from ".";

export class MalformedAddress {
  _bytes: Uint8Array;

  constructor(bytes: Uint8Array) {
    this._bytes = bytes;
  }

  original_bytes(): Uint8Array {
    return new Uint8Array(this._bytes);
  }

  from_address(addr: Address): MalformedAddress | undefined {
    if (addr._variant.kind == AddressKind.Malformed) {
      return addr._variant.value;
    }
    return undefined;
  }

  to_address(): Address {
    return new Address({ kind: AddressKind.Malformed, value: this });
  }
}
