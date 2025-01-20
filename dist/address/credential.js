import { Ed25519KeyHash, ScriptHash } from "../generated.js";
import { CBORReader } from "../lib/cbor/reader.js";
import { CBORWriter } from "../lib/cbor/writer.js";
import { bytesToHex, hexToBytes } from "../lib/hex.js";
export var CredKind;
(function (CredKind) {
    CredKind[CredKind["Key"] = 0] = "Key";
    CredKind[CredKind["Script"] = 1] = "Script";
})(CredKind || (CredKind = {}));
export class Credential {
    variant;
    static HASH_LEN = 28;
    constructor(variant) {
        this.variant = variant;
    }
    static from_keyhash(key) {
        return new Credential({ kind: CredKind.Key, value: key });
    }
    static from_scripthash(script) {
        return new Credential({ kind: CredKind.Script, value: script });
    }
    static _from_raw_bytes(kind, bytes) {
        if (kind === CredKind.Key) {
            return Credential.from_keyhash(Ed25519KeyHash.from_bytes(bytes));
        }
        else if (kind === CredKind.Script) {
            return Credential.from_scripthash(ScriptHash.from_bytes(bytes));
        }
        else {
            throw new Error(`Unknown credential kind: ${kind}`);
        }
    }
    to_keyhash() {
        if (this.variant.kind === CredKind.Key) {
            return this.variant.value;
        }
        return undefined;
    }
    to_scripthash() {
        if (this.variant.kind === CredKind.Script) {
            return this.variant.value;
        }
        return undefined;
    }
    kind() {
        return this.variant.kind;
    }
    has_script_hash() {
        return this.variant.kind === CredKind.Script;
    }
    serialize(writer) {
        writer.writeArrayTag(2);
        if (this.variant.kind === CredKind.Key) {
            writer.writeInt(0n);
            writer.writeBytes(this.variant.value.to_bytes());
        }
        else {
            writer.writeInt(1n);
            writer.writeBytes(this.variant.value.to_bytes());
        }
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != 2)
            throw new Error(`Expected array length == 2 (at ${path.join('/')})`);
        const kind = reader.readInt(path);
        if (kind === 0n) {
            return Credential.from_keyhash(Ed25519KeyHash.deserialize(reader, path));
        }
        else if (kind == 1n) {
            return Credential.from_scripthash(ScriptHash.deserialize(reader, path));
        }
        else {
            throw new Error(`Unknown credential kind: ${kind} (at ${path.join('/')})`);
        }
    }
    to_bytes() {
        const writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    static from_bytes(data, path) {
        const reader = new CBORReader(data);
        return Credential.deserialize(reader, path);
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    static from_hex(data, path) {
        return Credential.from_bytes(hexToBytes(data), path);
    }
    // no-op
    free() { }
    _to_raw_bytes() {
        return this.variant.value.to_bytes();
    }
}
