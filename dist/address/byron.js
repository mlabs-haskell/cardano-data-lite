import { Address, AddressKind } from "./index.js";
import { CBORReader } from "../lib/cbor/reader.js";
import { CBORWriter } from "../lib/cbor/writer.js";
import { Crc32 } from "@aws-crypto/crc32";
import { NetworkInfo } from "./network_info.js";
// @ts-ignore
import { base58_to_binary, binary_to_base58 } from "base58-js";
export class ByronAddress {
    _address;
    _attributes;
    _address_type;
    constructor(address, attributes, address_type) {
        this._address = address;
        this._attributes = attributes;
        this._address_type = address_type;
    }
    static new(address, attributes, address_type) {
        return new ByronAddress(address, attributes, address_type);
    }
    serializeInner(writer) {
        writer.writeArrayTag(3);
        writer.writeBytes(this._address);
        this._attributes.serialize(writer);
        writer.writeInt(BigInt(this._address_type));
    }
    static deserializeInner(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != 3)
            throw new Error(`Expected length == 3 (at ${path.join("/")})`);
        let address = reader.readBytes([...path, "0"]);
        let attributes = ByronAttributes.deserialize(reader, [...path, "1"]);
        let address_type = Number(reader.readInt([...path, "2"]));
        return new ByronAddress(address, attributes, address_type);
    }
    serialize(writer) {
        let wrappedBytes = withWriter((w) => this.serializeInner(w));
        let crc32 = new Crc32().update(wrappedBytes).digest();
        writer.writeArrayTag(2);
        writer.writeTaggedTag(24);
        writer.writeBytes(wrappedBytes);
        writer.writeInt(BigInt(crc32));
    }
    static deserialize(reader, path) {
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
        return ByronAddress.deserializeInner(new CBORReader(wrappedBytes), [
            ...path,
            "0",
            "0",
        ]);
    }
    static from_bytes(bytes, path = ["ByronAddress"]) {
        return ByronAddress.deserialize(new CBORReader(bytes), path);
    }
    to_bytes() {
        return withWriter((w) => this.serialize(w));
    }
    byron_protocol_magic() {
        return (this._attributes._protocol_magic || NetworkInfo.mainnet().protcol_magic());
    }
    attributes() {
        return withWriter((w) => this._attributes.serialize(w));
    }
    network_id() {
        switch (this.byron_protocol_magic()) {
            case NetworkInfo.testnet_preprod().protcol_magic():
                return NetworkInfo.testnet_preprod().network_id();
            case NetworkInfo.testnet_preview().protcol_magic():
                return NetworkInfo.testnet_preview().network_id();
            case NetworkInfo.mainnet().protcol_magic():
                return NetworkInfo.mainnet().network_id();
            default:
                throw new Error(`Unknown protocol magic ${this.byron_protocol_magic()}`);
        }
    }
    static from_base58(s) {
        let bytes = base58_to_binary(s);
        return ByronAddress.deserialize(new CBORReader(bytes), []);
    }
    to_base58() {
        return binary_to_base58(this.to_bytes());
    }
    static is_valid(s) {
        try {
            ByronAddress.from_base58(s);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    to_address() {
        return new Address({ kind: AddressKind.Byron, value: this });
    }
    static from_address(addr) {
        if (addr._variant.kind == AddressKind.Byron) {
            return addr._variant.value;
        }
        return undefined;
    }
}
export class ByronAttributes {
    _derivation_path;
    _protocol_magic;
    constructor(derivation_path, protocol_magic) {
        this._derivation_path = derivation_path;
        this._protocol_magic = protocol_magic;
    }
    serialize(writer) {
        let len = 0;
        if (this._derivation_path)
            len++;
        if (this._protocol_magic)
            len++;
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
    static deserialize(reader, path) {
        let derivation_path = undefined;
        let protocol_magic = undefined;
        reader.readMap((reader) => {
            let key = Number(reader.readInt([...path, "$key"]));
            switch (key) {
                case 1:
                    derivation_path = reader.readBytes([...path, String(key)]);
                    break;
                case 2:
                    protocol_magic = Number(new CBORReader(reader.readBytes([...path, String(key)])).readInt([
                        ...path,
                        String(key),
                    ]));
                    break;
                default:
                    throw new Error(`Unknown key ${key} (at ${path.join("/")})`);
            }
        }, path);
        return new ByronAttributes(derivation_path, protocol_magic);
    }
}
export var ByronAddressType;
(function (ByronAddressType) {
    ByronAddressType[ByronAddressType["PubKey"] = 0] = "PubKey";
    ByronAddressType[ByronAddressType["Script"] = 1] = "Script";
    ByronAddressType[ByronAddressType["Redeem"] = 2] = "Redeem";
})(ByronAddressType || (ByronAddressType = {}));
function withWriter(fn) {
    let writer = new CBORWriter();
    fn(writer);
    return writer.getBytes();
}
