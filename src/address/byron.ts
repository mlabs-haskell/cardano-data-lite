import { Address, AddressKind } from ".";
import { CBORReader } from "../lib/cbor/reader";
import { CBORWriter } from "../lib/cbor/writer";
import { Crc32 } from "@aws-crypto/crc32";
import { NetworkInfo } from "./network_info";
// @ts-ignore
import { base58_to_binary, binary_to_base58 } from "base58-js";

export class ByronAddress {
  _address: Uint8Array;
  _attributes: ByronAttributes;
  _address_type: ByronAddressType;

  constructor(
    address: Uint8Array,
    attributes: ByronAttributes,
    address_type: ByronAddressType,
  ) {
    this._address = address;
    this._attributes = attributes;
    this._address_type = address_type;
  }

  serializeInner(writer: CBORWriter): void {
    writer.writeArrayTag(3);
    writer.writeBytes(this._address);
    this._attributes.serialize(writer);
    writer.writeInt(BigInt(this._address_type));
  }

  static deserializeInner(reader: CBORReader, path: string[]): ByronAddress {
    let len = reader.readArrayTag(path);
    if (len != 3)
      throw new Error(`Expected length == 3 (at ${path.join("/")})`);

    let address = reader.readBytes([...path, "0"]);
    let attributes = ByronAttributes.deserialize(reader, [...path, "1"]);
    let address_type = Number(reader.readInt([...path, "2"]));

    return new ByronAddress(address, attributes, address_type);
  }

  serialize(writer: CBORWriter): void {
    let wrappedBytes = withWriter((w) => this.serializeInner(w));
    let crc32 = new Crc32().update(wrappedBytes).digest();
    writer.writeArrayTag(2);
    writer.writeTaggedTag(24);
    writer.writeBytes(wrappedBytes);
    writer.writeInt(BigInt(crc32));
  }

  static deserialize(reader: CBORReader, path: string[]): ByronAddress {
    let len = reader.readArrayTag(path);
    if (len != 2)
      throw new Error(`Expected length == 2 (at ${path.join("/")})`);

    let tag = reader.readTaggedTag([...path, "0"]);
    if (tag != 24)
      throw new Error(`Expected tag 24 (at ${[...path, "0"].join("/")})`);
    let wrappedBytes = reader.readBytes([...path, "0", "0"]);

    let crc32 = Number(reader.readInt([...path, "1"]));

    let calculatedCrc32 = new Crc32().update(wrappedBytes).digest();
    if (crc32 != calculatedCrc32)
      throw new Error(`Invalid CRC32 (at ${path.join("/")})`);

    let bytes = new CBORReader(wrappedBytes).readBytes([...path, "0", "0"]);
    return ByronAddress.deserializeInner(new CBORReader(bytes), [
      ...path,
      "0",
      "0",
    ]);
  }

  static from_bytes(bytes: Uint8Array): ByronAddress {
    return ByronAddress.deserialize(new CBORReader(bytes), []);
  }

  to_bytes(): Uint8Array {
    return withWriter((w) => this.serialize(w));
  }

  byron_protocol_magic(): number {
    return (
      this._attributes._protocol_magic || NetworkInfo.mainnet().protcol_magic()
    );
  }

  attributes(): Uint8Array {
    return withWriter((w) => this._attributes.serialize(w));
  }

  network_id(): number {
    switch (this.byron_protocol_magic()) {
      case NetworkInfo.testnet_preprod().protcol_magic():
        return NetworkInfo.testnet_preprod().network_id();
      case NetworkInfo.testnet_preview().protcol_magic():
        return NetworkInfo.testnet_preview().network_id();
      case NetworkInfo.mainnet().protcol_magic():
        return NetworkInfo.mainnet().network_id();
      default:
        throw new Error(
          `Unknown protocol magic ${this.byron_protocol_magic()}`,
        );
    }
  }

  static from_base58(s: string): ByronAddress {
    let bytes = base58_to_binary(s);
    return ByronAddress.deserialize(new CBORReader(bytes), []);
  }

  to_base58(): string {
    return binary_to_base58(this.to_bytes());
  }

  static is_valid(s: string): boolean {
    try {
      ByronAddress.from_base58(s);
      return true;
    } catch (e) {
      return false;
    }
  }

  to_address(): Address {
    return new Address({ kind: AddressKind.Byron, value: this });
  }

  static from_address(addr: Address): ByronAddress | undefined {
    if (addr._variant.kind == AddressKind.Byron) {
      return addr._variant.value;
    }
    return undefined;
  }
}

export class ByronAttributes {
  _derivation_path?: Uint8Array;
  _protocol_magic?: number;

  constructor(derivation_path?: Uint8Array, protocol_magic?: number) {
    this._derivation_path = derivation_path;
    this._protocol_magic = protocol_magic;
  }

  serialize(writer: CBORWriter): void {
    let len = 0;
    if (this._derivation_path) len++;
    if (this._protocol_magic) len++;

    writer.writeMapTag(len);
    if (this._derivation_path) {
      writer.writeInt(1n);
      writer.writeBytes(this._derivation_path);
    }
    if (this._protocol_magic) {
      writer.writeInt(2n);
      let x = this._protocol_magic;
      writer.writeBytes(withWriter((w) => w.writeInt(BigInt(x))));
    }
  }

  static deserialize(reader: CBORReader, path: string[]): ByronAttributes {
    let derivation_path: Uint8Array | undefined = undefined;
    let protocol_magic: number | undefined = undefined;

    reader.readMap((reader) => {
      let key = Number(reader.readInt([...path, "$key"]));
      switch (key) {
        case 1:
          derivation_path = reader.readBytes([...path, String(key)]);
          break;
        case 2:
          protocol_magic = Number(
            new CBORReader(reader.readBytes([...path, String(key)])).readInt([
              ...path,
              String(key),
            ]),
          );
          break;
        default:
          throw new Error(`Unknown key ${key} (at ${path.join("/")})`);
      }
    }, path);

    return new ByronAttributes(derivation_path, protocol_magic);
  }
}

export enum ByronAddressType {
  PubKey = 0,
  Script = 1,
  Redeem = 2,
}

function withWriter(fn: (w: CBORWriter) => void): Uint8Array {
  let writer = new CBORWriter();
  fn(writer);
  return writer.getBytes();
}
