import { CBORReader, bigintFromBytes } from "./lib/cbor/reader.js";
import { CBORWriter } from "./lib/cbor/writer.js";
import { GrowableBuffer } from "./lib/cbor/growable-buffer.js";
import { hexToBytes, bytesToHex } from "./lib/hex.js";
import { arrayEq } from "./lib/eq.js";
import { bech32 } from "bech32";
import * as cdlCrypto from "./lib/bip32-ed25519/index.js";
import { Address, Credential, CredKind, RewardAddress } from "./address/index.js";
import { webcrypto } from "crypto";
// Polyfill the global "crypto" object if it doesn't exist
if (typeof globalThis.crypto === "undefined") {
    // @ts-expect-error: Assigning Node.js webcrypto to globalThis.crypto
    globalThis.crypto = webcrypto;
}
function $$UN(id, ...args) {
    throw "Undefined function: " + id;
}
const $$CANT_READ = (...args) => $$UN("$$CANT_READ", ...args);
const $$CANT_WRITE = (...args) => $$UN("$$CANT_WRITE", ...args);
const $$CANT_EQ = (...args) => $$UN("$$CANT_EQ", ...args);
export class Anchor {
    _url;
    _anchor_data_hash;
    constructor(url, anchor_data_hash) {
        this._url = url;
        this._anchor_data_hash = anchor_data_hash;
    }
    static new(url, anchor_data_hash) {
        return new Anchor(url, anchor_data_hash);
    }
    url() {
        return this._url;
    }
    set_url(url) {
        this._url = url;
    }
    anchor_data_hash() {
        return this._anchor_data_hash;
    }
    set_anchor_data_hash(anchor_data_hash) {
        this._anchor_data_hash = anchor_data_hash;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 2) {
            throw new Error("Insufficient number of fields in record. Expected at least 2. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const url_path = [...path, "URL(url)"];
        let url = URL.deserialize(reader, url_path);
        const anchor_data_hash_path = [...path, "AnchorDataHash(anchor_data_hash)"];
        let anchor_data_hash = AnchorDataHash.deserialize(reader, anchor_data_hash_path);
        return new Anchor(url, anchor_data_hash);
    }
    serialize(writer) {
        let arrayLen = 2;
        writer.writeArrayTag(arrayLen);
        this._url.serialize(writer);
        this._anchor_data_hash.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Anchor"]) {
        let reader = new CBORReader(data);
        return Anchor.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Anchor"]) {
        return Anchor.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Anchor.from_bytes(this.to_bytes(), path);
    }
}
export class AnchorDataHash {
    inner;
    constructor(inner) {
        if (inner.length != 32)
            throw new Error("Expected length to be 32");
        this.inner = inner;
    }
    static new(inner) {
        return new AnchorDataHash(inner);
    }
    static from_bech32(bech_str) {
        let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
        let words = decoded.words;
        let bytesArray = bech32.fromWords(words);
        let bytes = new Uint8Array(bytesArray);
        return new AnchorDataHash(bytes);
    }
    to_bech32(prefix) {
        let bytes = this.to_bytes();
        let words = bech32.toWords(bytes);
        return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
    }
    // no-op
    free() { }
    static from_bytes(data) {
        return new AnchorDataHash(data);
    }
    static from_hex(hex_str) {
        return AnchorDataHash.from_bytes(hexToBytes(hex_str));
    }
    to_bytes() {
        return this.inner;
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone() {
        return AnchorDataHash.from_bytes(this.to_bytes());
    }
    static deserialize(reader, path) {
        return new AnchorDataHash(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeBytes(this.inner);
    }
}
export class AssetName {
    inner;
    constructor(inner) {
        if (inner.length > 32)
            throw new Error("Expected length to be atmost 32");
        this.inner = inner;
    }
    static new(inner) {
        return new AssetName(inner);
    }
    name() {
        return this.inner;
    }
    static deserialize(reader, path) {
        return new AssetName(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeBytes(this.inner);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["AssetName"]) {
        let reader = new CBORReader(data);
        return AssetName.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["AssetName"]) {
        return AssetName.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return AssetName.from_bytes(this.to_bytes(), path);
    }
}
export class AssetNames {
    items;
    definiteEncoding;
    constructor(items, definiteEncoding = true) {
        this.items = items;
        this.definiteEncoding = definiteEncoding;
    }
    static new() {
        return new AssetNames([]);
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        this.items.push(elem);
    }
    static deserialize(reader, path) {
        const { items, definiteEncoding } = reader.readArray((reader, idx) => AssetName.deserialize(reader, [...path, "Elem#" + idx]), path);
        return new AssetNames(items, definiteEncoding);
    }
    serialize(writer) {
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["AssetNames"]) {
        let reader = new CBORReader(data);
        return AssetNames.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["AssetNames"]) {
        return AssetNames.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return AssetNames.from_bytes(this.to_bytes(), path);
    }
}
export class Assets {
    _items;
    constructor(items) {
        this._items = items;
    }
    static new() {
        return new Assets([]);
    }
    len() {
        return this._items.length;
    }
    insert(key, value) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry != null) {
            let ret = entry[1];
            entry[1] = value;
            return ret;
        }
        this._items.push([key, value]);
        return undefined;
    }
    get(key) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry == null)
            return undefined;
        return entry[1];
    }
    _remove_many(keys) {
        this._items = this._items.filter(([k, _v]) => keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())));
    }
    keys() {
        let keys = AssetNames.new();
        for (let [key, _] of this._items)
            keys.add(key);
        return keys;
    }
    static deserialize(reader, path) {
        let ret = new Assets([]);
        reader.readMap((reader, idx) => ret.insert(AssetName.deserialize(reader, [...path, "AssetName#" + idx]), BigNum.deserialize(reader, [...path, "BigNum#" + idx])), path);
        return ret;
    }
    serialize(writer) {
        writer.writeMap(this._items, (writer, x) => {
            x[0].serialize(writer);
            x[1].serialize(writer);
        });
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Assets"]) {
        let reader = new CBORReader(data);
        return Assets.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Assets"]) {
        return Assets.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Assets.from_bytes(this.to_bytes(), path);
    }
    _inplace_checked_add(rhs) {
        for (let [asset_name, amount] of rhs._items) {
            let this_amount = this.get(asset_name);
            if (this_amount == null)
                this_amount = amount;
            else
                this_amount = this_amount.checked_add(amount);
            this.insert(asset_name, this_amount);
        }
    }
    _inplace_clamped_sub(rhs) {
        for (let [asset_name, amount] of rhs._items) {
            let this_amount = this.get(asset_name);
            if (this_amount == null)
                continue;
            this_amount = this_amount.clamped_sub(amount);
            this.insert(asset_name, this_amount);
        }
        this._normalize();
    }
    _normalize() {
        let to_remove = [];
        for (let [asset_name, amount] of this._items) {
            if (amount.is_zero())
                to_remove.push(asset_name);
        }
        this._remove_many(to_remove);
    }
    _partial_cmp(rhs) {
        const zero = BigNum.zero();
        let cmps = [
            false, // -1
            false, // 0
            false, // 1
        ];
        for (let [asset_name, this_amount] of this._items) {
            let rhs_amount = rhs.get(asset_name);
            if (rhs_amount == null)
                rhs_amount = zero;
            cmps[1 + this_amount.compare(rhs_amount)] = true;
        }
        for (let [asset_name, rhs_amount] of rhs._items) {
            let this_amount = this.get(asset_name);
            if (this_amount == null)
                this_amount = zero;
            cmps[1 + this_amount.compare(rhs_amount)];
        }
        let has_less = cmps[0];
        let has_equal = cmps[1];
        let has_greater = cmps[2];
        if (has_less && has_greater)
            return undefined;
        else if (has_less)
            return -1;
        else if (has_greater)
            return 1;
        else
            return 0;
    }
}
export var AuxiliaryDataKind;
(function (AuxiliaryDataKind) {
    AuxiliaryDataKind[AuxiliaryDataKind["GeneralTransactionMetadata"] = 0] = "GeneralTransactionMetadata";
    AuxiliaryDataKind[AuxiliaryDataKind["AuxiliaryDataShelleyMa"] = 1] = "AuxiliaryDataShelleyMa";
    AuxiliaryDataKind[AuxiliaryDataKind["AuxiliaryDataPostAlonzo"] = 2] = "AuxiliaryDataPostAlonzo";
})(AuxiliaryDataKind || (AuxiliaryDataKind = {}));
export class AuxiliaryData {
    variant;
    constructor(variant) {
        this.variant = variant;
    }
    static new_shelley_metadata(shelley_metadata) {
        return new AuxiliaryData({ kind: 0, value: shelley_metadata });
    }
    static new_shelley_metadata_ma(shelley_metadata_ma) {
        return new AuxiliaryData({ kind: 1, value: shelley_metadata_ma });
    }
    static new_postalonzo_metadata(postalonzo_metadata) {
        return new AuxiliaryData({ kind: 2, value: postalonzo_metadata });
    }
    as_shelley_metadata() {
        if (this.variant.kind == 0)
            return this.variant.value;
        throw new Error("Incorrect cast");
    }
    as_shelley_metadata_ma() {
        if (this.variant.kind == 1)
            return this.variant.value;
        throw new Error("Incorrect cast");
    }
    as_postalonzo_metadata() {
        if (this.variant.kind == 2)
            return this.variant.value;
        throw new Error("Incorrect cast");
    }
    kind() {
        return this.variant.kind;
    }
    static deserialize(reader, path) {
        let tag = reader.peekType(path);
        let variant;
        switch (tag) {
            case "map":
                variant = {
                    kind: AuxiliaryDataKind.GeneralTransactionMetadata,
                    value: GeneralTransactionMetadata.deserialize(reader, [
                        ...path,
                        "GeneralTransactionMetadata(shelley_metadata)",
                    ]),
                };
                break;
            case "array":
                variant = {
                    kind: AuxiliaryDataKind.AuxiliaryDataShelleyMa,
                    value: AuxiliaryDataShelleyMa.deserialize(reader, [
                        ...path,
                        "AuxiliaryDataShelleyMa(shelley_metadata_ma)",
                    ]),
                };
                break;
            case "tagged":
                variant = {
                    kind: AuxiliaryDataKind.AuxiliaryDataPostAlonzo,
                    value: AuxiliaryDataPostAlonzo.deserialize(reader, [
                        ...path,
                        "AuxiliaryDataPostAlonzo(postalonzo_metadata)",
                    ]),
                };
                break;
            default:
                throw new Error("Unexpected subtype for AuxiliaryData: " +
                    tag +
                    "(at " +
                    path.join("/") +
                    ")");
        }
        return new AuxiliaryData(variant);
    }
    serialize(writer) {
        switch (this.variant.kind) {
            case 0:
                this.variant.value.serialize(writer);
                break;
            case 1:
                this.variant.value.serialize(writer);
                break;
            case 2:
                this.variant.value.serialize(writer);
                break;
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["AuxiliaryData"]) {
        let reader = new CBORReader(data);
        return AuxiliaryData.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["AuxiliaryData"]) {
        return AuxiliaryData.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return AuxiliaryData.from_bytes(this.to_bytes(), path);
    }
    static new() {
        const post_alonzo_auxiliary_data = new AuxiliaryDataPostAlonzo(GeneralTransactionMetadata.new(), NativeScripts.new(), PlutusScripts.new(), PlutusScripts.new(), PlutusScripts.new());
        return new AuxiliaryData({ kind: 2, value: post_alonzo_auxiliary_data });
    }
    metadata() {
        switch (this.variant.kind) {
            case 0:
                return this.variant.value;
            case 1:
                return this.variant.value.transaction_metadata();
            case 2:
                return this.variant.value.metadata();
        }
    }
    set_metadata(metadata) {
        switch (this.variant.kind) {
            case 0:
                this.variant = { kind: 0, value: metadata };
                break;
            case 1:
                this.variant.value.set_transaction_metadata(metadata);
                break;
            case 2:
                this.variant.value.set_metadata(metadata);
                break;
        }
    }
    native_scripts() {
        switch (this.variant.kind) {
            case 0:
                return undefined;
            case 1:
                return this.variant.value.auxiliary_scripts();
            case 2:
                return this.variant.value.native_scripts();
        }
    }
    set_native_scripts(native_scripts) {
        switch (this.variant.kind) {
            case 0:
                let v = AuxiliaryDataPostAlonzo.new(this.variant.value, native_scripts, undefined, undefined, undefined);
                this.variant = { kind: 2, value: v };
                break;
            case 1:
                this.variant.value.set_auxiliary_scripts(native_scripts);
                break;
            case 2:
                this.variant.value.set_native_scripts(native_scripts);
                break;
        }
    }
    plutus_scripts_v1() {
        switch (this.variant.kind) {
            case 0:
                return undefined;
            case 1:
                return undefined;
            case 2:
                return this.variant.value.plutus_scripts_v1();
        }
    }
    set_plutus_scripts_v1(plutus_scripts_v1) {
        switch (this.variant.kind) {
            case 0:
                let v1 = AuxiliaryDataPostAlonzo.new(this.variant.value, undefined, plutus_scripts_v1, undefined, undefined);
                this.variant = { kind: 2, value: v1 };
                break;
            case 1:
                let v2 = AuxiliaryDataPostAlonzo.new(this.variant.value.transaction_metadata(), this.variant.value.auxiliary_scripts(), plutus_scripts_v1, undefined, undefined);
                this.variant = { kind: 2, value: v2 };
                break;
            case 2:
                this.variant.value.set_plutus_scripts_v1(plutus_scripts_v1);
                break;
        }
    }
    plutus_scripts_v2() {
        switch (this.variant.kind) {
            case 0:
                return undefined;
            case 1:
                return undefined;
            case 2:
                return this.variant.value.plutus_scripts_v2();
        }
    }
    set_plutus_scripts_v2(plutus_scripts_v2) {
        switch (this.variant.kind) {
            case 0:
                let v1 = AuxiliaryDataPostAlonzo.new(this.variant.value, undefined, undefined, plutus_scripts_v2, undefined);
                this.variant = { kind: 2, value: v1 };
                break;
            case 1:
                let v2 = AuxiliaryDataPostAlonzo.new(this.variant.value.transaction_metadata(), this.variant.value.auxiliary_scripts(), undefined, plutus_scripts_v2, undefined);
                this.variant = { kind: 2, value: v2 };
                break;
            case 2:
                this.variant.value.set_plutus_scripts_v2(plutus_scripts_v2);
                break;
        }
    }
    plutus_scripts_v3() {
        switch (this.variant.kind) {
            case 0:
                return undefined;
            case 1:
                return undefined;
            case 2:
                return this.variant.value.plutus_scripts_v3();
        }
    }
    set_plutus_scripts_v3(plutus_scripts_v3) {
        switch (this.variant.kind) {
            case 0:
                let v3 = AuxiliaryDataPostAlonzo.new(this.variant.value, undefined, undefined, undefined, plutus_scripts_v3);
                this.variant = { kind: 2, value: v3 };
                break;
            case 1:
                let v2 = AuxiliaryDataPostAlonzo.new(this.variant.value.transaction_metadata(), this.variant.value.auxiliary_scripts(), undefined, undefined, plutus_scripts_v3);
                this.variant = { kind: 2, value: v2 };
                break;
            case 2:
                this.variant.value.set_plutus_scripts_v3(plutus_scripts_v3);
                break;
        }
    }
}
export class AuxiliaryDataHash {
    inner;
    constructor(inner) {
        if (inner.length != 32)
            throw new Error("Expected length to be 32");
        this.inner = inner;
    }
    static new(inner) {
        return new AuxiliaryDataHash(inner);
    }
    static from_bech32(bech_str) {
        let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
        let words = decoded.words;
        let bytesArray = bech32.fromWords(words);
        let bytes = new Uint8Array(bytesArray);
        return new AuxiliaryDataHash(bytes);
    }
    to_bech32(prefix) {
        let bytes = this.to_bytes();
        let words = bech32.toWords(bytes);
        return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
    }
    // no-op
    free() { }
    static from_bytes(data) {
        return new AuxiliaryDataHash(data);
    }
    static from_hex(hex_str) {
        return AuxiliaryDataHash.from_bytes(hexToBytes(hex_str));
    }
    to_bytes() {
        return this.inner;
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone() {
        return AuxiliaryDataHash.from_bytes(this.to_bytes());
    }
    static deserialize(reader, path) {
        return new AuxiliaryDataHash(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeBytes(this.inner);
    }
}
export class AuxiliaryDataPostAlonzo {
    _metadata;
    _native_scripts;
    _plutus_scripts_v1;
    _plutus_scripts_v2;
    _plutus_scripts_v3;
    constructor(metadata, native_scripts, plutus_scripts_v1, plutus_scripts_v2, plutus_scripts_v3) {
        this._metadata = metadata;
        this._native_scripts = native_scripts;
        this._plutus_scripts_v1 = plutus_scripts_v1;
        this._plutus_scripts_v2 = plutus_scripts_v2;
        this._plutus_scripts_v3 = plutus_scripts_v3;
    }
    static new(metadata, native_scripts, plutus_scripts_v1, plutus_scripts_v2, plutus_scripts_v3) {
        return new AuxiliaryDataPostAlonzo(metadata, native_scripts, plutus_scripts_v1, plutus_scripts_v2, plutus_scripts_v3);
    }
    metadata() {
        return this._metadata;
    }
    set_metadata(metadata) {
        this._metadata = metadata;
    }
    native_scripts() {
        return this._native_scripts;
    }
    set_native_scripts(native_scripts) {
        this._native_scripts = native_scripts;
    }
    plutus_scripts_v1() {
        return this._plutus_scripts_v1;
    }
    set_plutus_scripts_v1(plutus_scripts_v1) {
        this._plutus_scripts_v1 = plutus_scripts_v1;
    }
    plutus_scripts_v2() {
        return this._plutus_scripts_v2;
    }
    set_plutus_scripts_v2(plutus_scripts_v2) {
        this._plutus_scripts_v2 = plutus_scripts_v2;
    }
    plutus_scripts_v3() {
        return this._plutus_scripts_v3;
    }
    set_plutus_scripts_v3(plutus_scripts_v3) {
        this._plutus_scripts_v3 = plutus_scripts_v3;
    }
    static deserialize(reader, path = ["AuxiliaryDataPostAlonzo"]) {
        let taggedTag = reader.readTaggedTag(path);
        if (taggedTag != 259) {
            throw new Error("Expected tag 259, got " + taggedTag + " (at " + path + ")");
        }
        return AuxiliaryDataPostAlonzo.deserializeInner(reader, path);
    }
    static deserializeInner(reader, path) {
        let fields = {};
        reader.readMap((r) => {
            let key = Number(r.readUint(path));
            switch (key) {
                case 0: {
                    const new_path = [...path, "GeneralTransactionMetadata(metadata)"];
                    fields.metadata = GeneralTransactionMetadata.deserialize(r, new_path);
                    break;
                }
                case 1: {
                    const new_path = [...path, "NativeScripts(native_scripts)"];
                    fields.native_scripts = NativeScripts.deserialize(r, new_path);
                    break;
                }
                case 2: {
                    const new_path = [...path, "PlutusScripts(plutus_scripts_v1)"];
                    fields.plutus_scripts_v1 = PlutusScripts.deserialize(r, new_path);
                    break;
                }
                case 3: {
                    const new_path = [...path, "PlutusScripts(plutus_scripts_v2)"];
                    fields.plutus_scripts_v2 = PlutusScripts.deserialize(r, new_path);
                    break;
                }
                case 4: {
                    const new_path = [...path, "PlutusScripts(plutus_scripts_v3)"];
                    fields.plutus_scripts_v3 = PlutusScripts.deserialize(r, new_path);
                    break;
                }
            }
        }, path);
        let metadata = fields.metadata;
        let native_scripts = fields.native_scripts;
        let plutus_scripts_v1 = fields.plutus_scripts_v1;
        let plutus_scripts_v2 = fields.plutus_scripts_v2;
        let plutus_scripts_v3 = fields.plutus_scripts_v3;
        return new AuxiliaryDataPostAlonzo(metadata, native_scripts, plutus_scripts_v1, plutus_scripts_v2, plutus_scripts_v3);
    }
    serialize(writer) {
        writer.writeTaggedTag(259);
        this.serializeInner(writer);
    }
    serializeInner(writer) {
        let len = 5;
        if (this._metadata === undefined)
            len -= 1;
        if (this._native_scripts === undefined)
            len -= 1;
        if (this._plutus_scripts_v1 === undefined)
            len -= 1;
        if (this._plutus_scripts_v2 === undefined)
            len -= 1;
        if (this._plutus_scripts_v3 === undefined)
            len -= 1;
        writer.writeMapTag(len);
        if (this._metadata !== undefined) {
            writer.writeInt(0n);
            this._metadata.serialize(writer);
        }
        if (this._native_scripts !== undefined) {
            writer.writeInt(1n);
            this._native_scripts.serialize(writer);
        }
        if (this._plutus_scripts_v1 !== undefined) {
            writer.writeInt(2n);
            this._plutus_scripts_v1.serialize(writer);
        }
        if (this._plutus_scripts_v2 !== undefined) {
            writer.writeInt(3n);
            this._plutus_scripts_v2.serialize(writer);
        }
        if (this._plutus_scripts_v3 !== undefined) {
            writer.writeInt(4n);
            this._plutus_scripts_v3.serialize(writer);
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["AuxiliaryDataPostAlonzo"]) {
        let reader = new CBORReader(data);
        return AuxiliaryDataPostAlonzo.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["AuxiliaryDataPostAlonzo"]) {
        return AuxiliaryDataPostAlonzo.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return AuxiliaryDataPostAlonzo.from_bytes(this.to_bytes(), path);
    }
}
export class AuxiliaryDataSet {
    _items;
    constructor(items) {
        this._items = items;
    }
    static new() {
        return new AuxiliaryDataSet([]);
    }
    len() {
        return this._items.length;
    }
    insert(key, value) {
        let entry = this._items.find((x) => key === x[0]);
        if (entry != null) {
            let ret = entry[1];
            entry[1] = value;
            return ret;
        }
        this._items.push([key, value]);
        return undefined;
    }
    get(key) {
        let entry = this._items.find((x) => key === x[0]);
        if (entry == null)
            return undefined;
        return entry[1];
    }
    _remove_many(keys) {
        this._items = this._items.filter(([k, _v]) => keys.every((key) => !(key === k)));
    }
    static deserialize(reader, path) {
        let ret = new AuxiliaryDataSet([]);
        reader.readMap((reader, idx) => ret.insert(Number(reader.readInt([...path, "number#" + idx])), AuxiliaryData.deserialize(reader, [...path, "AuxiliaryData#" + idx])), path);
        return ret;
    }
    serialize(writer) {
        writer.writeMap(this._items, (writer, x) => {
            writer.writeInt(BigInt(x[0]));
            x[1].serialize(writer);
        });
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["AuxiliaryDataSet"]) {
        let reader = new CBORReader(data);
        return AuxiliaryDataSet.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["AuxiliaryDataSet"]) {
        return AuxiliaryDataSet.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return AuxiliaryDataSet.from_bytes(this.to_bytes(), path);
    }
    indices() {
        let indices = new Uint32Array(this._items.length);
        for (let i = 0; i < this._items.length; i++) {
            let item = this._items[i];
            let key = item[0];
            indices[i] = key;
        }
        return indices;
    }
}
export class AuxiliaryDataShelleyMa {
    _transaction_metadata;
    _auxiliary_scripts;
    constructor(transaction_metadata, auxiliary_scripts) {
        this._transaction_metadata = transaction_metadata;
        this._auxiliary_scripts = auxiliary_scripts;
    }
    static new(transaction_metadata, auxiliary_scripts) {
        return new AuxiliaryDataShelleyMa(transaction_metadata, auxiliary_scripts);
    }
    transaction_metadata() {
        return this._transaction_metadata;
    }
    set_transaction_metadata(transaction_metadata) {
        this._transaction_metadata = transaction_metadata;
    }
    auxiliary_scripts() {
        return this._auxiliary_scripts;
    }
    set_auxiliary_scripts(auxiliary_scripts) {
        this._auxiliary_scripts = auxiliary_scripts;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 2) {
            throw new Error("Insufficient number of fields in record. Expected at least 2. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const transaction_metadata_path = [
            ...path,
            "GeneralTransactionMetadata(transaction_metadata)",
        ];
        let transaction_metadata = GeneralTransactionMetadata.deserialize(reader, transaction_metadata_path);
        const auxiliary_scripts_path = [
            ...path,
            "NativeScripts(auxiliary_scripts)",
        ];
        let auxiliary_scripts = NativeScripts.deserialize(reader, auxiliary_scripts_path);
        return new AuxiliaryDataShelleyMa(transaction_metadata, auxiliary_scripts);
    }
    serialize(writer) {
        let arrayLen = 2;
        writer.writeArrayTag(arrayLen);
        this._transaction_metadata.serialize(writer);
        this._auxiliary_scripts.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["AuxiliaryDataShelleyMa"]) {
        let reader = new CBORReader(data);
        return AuxiliaryDataShelleyMa.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["AuxiliaryDataShelleyMa"]) {
        return AuxiliaryDataShelleyMa.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return AuxiliaryDataShelleyMa.from_bytes(this.to_bytes(), path);
    }
}
export class BigNum {
    inner;
    constructor(inner) {
        if (inner < 0n)
            throw new Error("Expected value to be atleast 0n");
        if (inner > BigNum._maxU64())
            throw new Error("Expected value to be atmost BigNum._maxU64()");
        this.inner = inner;
    }
    static new(inner) {
        return new BigNum(inner);
    }
    toJsValue() {
        return this.inner;
    }
    static deserialize(reader, path) {
        return new BigNum(reader.readInt(path));
    }
    serialize(writer) {
        writer.writeInt(this.inner);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["BigNum"]) {
        let reader = new CBORReader(data);
        return BigNum.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["BigNum"]) {
        return BigNum.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return BigNum.from_bytes(this.to_bytes(), path);
    }
    // Lifted from: https://doc.rust-lang.org/std/primitive.u64.html#associatedconstant.MAX
    static _maxU64() {
        return 18446744073709551615n;
    }
    static from_str(string) {
        return new BigNum(BigInt(string));
    }
    to_str() {
        return this.toJsValue().toString();
    }
    static zero() {
        return new BigNum(0n);
    }
    static one() {
        return new BigNum(1n);
    }
    is_zero() {
        return this.toJsValue() == 0n;
    }
    div_floor(other) {
        let res = this.toJsValue() / other.toJsValue();
        return new BigNum(res);
    }
    checked_mul(other) {
        let res = this.toJsValue() * other.toJsValue();
        if (res > BigNum._maxU64())
            throw new Error("BigNum.checked_mul overflow");
        return new BigNum(res);
    }
    checked_add(other) {
        let res = this.toJsValue() + other.toJsValue();
        if (res > BigNum._maxU64())
            throw new Error("BigNum.checked_add overflow");
        return new BigNum(res);
    }
    checked_sub(other) {
        let res = this.toJsValue() - other.toJsValue();
        if (res < 0n)
            throw new Error("BigNum.checked_sub overflow");
        return new BigNum(res);
    }
    clamped_sub(other) {
        let res = this.toJsValue() - other.toJsValue();
        if (res < 0n)
            res = 0n;
        return new BigNum(res);
    }
    compare(rhs_value) {
        if (this.toJsValue() < rhs_value.toJsValue())
            return -1;
        else if (this.toJsValue() == rhs_value.toJsValue())
            return 0;
        else
            return 1;
    }
    less_than(rhs_value) {
        return this.toJsValue() < rhs_value.toJsValue();
    }
    static max_value() {
        return new BigNum(BigNum._maxU64());
    }
    static max(a, b) {
        if (a.toJsValue() > b.toJsValue())
            return a;
        else
            return b;
    }
    static _from_number(x) {
        return new BigNum(BigInt(x));
    }
    _to_number() {
        return Number(this.toJsValue);
    }
}
export class Bip32PrivateKey {
    inner;
    constructor(inner) {
        if (inner.length != 96)
            throw new Error("Expected length to be 96");
        this.inner = inner;
    }
    static new(inner) {
        return new Bip32PrivateKey(inner);
    }
    static from_hex(hex_str) {
        return Bip32PrivateKey.from_bytes(hexToBytes(hex_str));
    }
    as_bytes() {
        return this.inner;
    }
    to_hex() {
        return bytesToHex(this.as_bytes());
    }
    static deserialize(reader, path) {
        return new Bip32PrivateKey(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeBytes(this.inner);
    }
    static _LEN = 96;
    static _BECH32_HRP = "xprv";
    free() {
        for (let i = 0; i < this.inner.length; i++)
            this.inner[i] = 0x00;
    }
    static from_bech32(bech_str) {
        let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
        let words = decoded.words;
        let bytesArray = bech32.fromWords(words);
        let bytes = new Uint8Array(bytesArray);
        if (decoded.prefix == Bip32PrivateKey._BECH32_HRP) {
            return new Bip32PrivateKey(bytes);
        }
        else {
            throw new Error("Invalid prefix for Bip32PrivateKey: " + decoded.prefix);
        }
    }
    to_bech32() {
        let prefix = Bip32PrivateKey._BECH32_HRP;
        return bech32.encode(prefix, bech32.toWords(this.inner), Number.MAX_SAFE_INTEGER);
    }
    to_raw_key() {
        return PrivateKey.from_extended_bytes(this.inner.slice(0, 64));
    }
    to_public() {
        let extended_secret = this.inner.slice(0, 64);
        let cc = this.chaincode();
        let pubkey = cdlCrypto.extendedToPubkey(extended_secret);
        let buf = new Uint8Array(64);
        buf.set(pubkey, 0);
        buf.set(cc, 32);
        return new Bip32PublicKey(buf);
    }
    static from_128_xprv(bytes) {
        let buf = new Uint8Array(96);
        buf.set(bytes.slice(0, 64), 0);
        buf.set(bytes.slice(96, 128), 64);
        return Bip32PrivateKey.from_bytes(buf);
    }
    to_128_xprv() {
        let prv_key = this.to_raw_key().as_bytes();
        let pub_key = this.to_public().as_bytes();
        let cc = this.chaincode();
        let buf = new Uint8Array(128);
        buf.set(prv_key, 0);
        buf.set(pub_key, 64);
        buf.set(cc, 96);
        return buf;
    }
    chaincode() {
        return this.inner.slice(64, 96);
    }
    derive(index) {
        let { privateKey, chainCode } = cdlCrypto.derive.derivePrivate(this.inner.slice(0, 64), this.inner.slice(64, 96), index);
        let buf = new Uint8Array(Bip32PrivateKey._LEN);
        buf.set(privateKey, 0);
        buf.set(chainCode, 64);
        return new Bip32PrivateKey(buf);
    }
    static generate_ed25519_bip32() {
        let bytes = cdlCrypto.getRandomBytes(Bip32PrivateKey._LEN);
        cdlCrypto.normalizeExtendedForBip32Ed25519(bytes);
        return new Bip32PrivateKey(bytes);
    }
    static from_bip39_entropy(entropy, password) {
        return new Bip32PrivateKey(cdlCrypto.bip32PrivateKeyFromEntropy(entropy, password));
    }
    static from_bytes(bytes) {
        if (bytes.length != Bip32PrivateKey._LEN) {
            throw new Error("Invalid length");
        }
        let scalar = bytes.slice(0, 32);
        let last = scalar[31];
        let first = scalar[0];
        if ((last & 0b1100_0000) != 0b0100_0000 ||
            (first & 0b0000_0111) == 0b0000_0000) {
            throw new Error("invalid bytes");
        }
        return new Bip32PrivateKey(bytes);
    }
}
export class Bip32PublicKey {
    inner;
    constructor(inner) {
        if (inner.length != 64)
            throw new Error("Expected length to be 64");
        this.inner = inner;
    }
    static new(inner) {
        return new Bip32PublicKey(inner);
    }
    // no-op
    free() { }
    static from_bytes(data) {
        return new Bip32PublicKey(data);
    }
    static from_hex(hex_str) {
        return Bip32PublicKey.from_bytes(hexToBytes(hex_str));
    }
    as_bytes() {
        return this.inner;
    }
    to_hex() {
        return bytesToHex(this.as_bytes());
    }
    static deserialize(reader, path) {
        return new Bip32PublicKey(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeBytes(this.inner);
    }
    static _LEN = 64;
    static _BECH32_HRP = "xpub";
    chaincode() {
        return this.inner.slice(32, 64);
    }
    static from_bech32(bech_str) {
        let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
        let words = decoded.words;
        let bytesArray = bech32.fromWords(words);
        let bytes = new Uint8Array(bytesArray);
        if (decoded.prefix == Bip32PublicKey._BECH32_HRP) {
            return new Bip32PublicKey(bytes);
        }
        else {
            throw new Error("Invalid prefix for Bip32PublicKey: " + decoded.prefix);
        }
    }
    to_bech32() {
        let prefix = Bip32PublicKey._BECH32_HRP;
        return bech32.encode(prefix, bech32.toWords(this.inner), Number.MAX_SAFE_INTEGER);
    }
    to_raw_key() {
        return PublicKey.from_bytes(this.inner.slice(0, 32));
    }
    derive(index) {
        let { publicKey, chainCode } = cdlCrypto.derive.derivePublic(this.inner.slice(0, 32), this.inner.slice(32, 64), index);
        let buf = new Uint8Array(Bip32PublicKey._LEN);
        buf.set(publicKey, 0);
        buf.set(chainCode, 32);
        return new Bip32PublicKey(buf);
    }
}
export class Block {
    _header;
    _transaction_bodies;
    _transaction_witness_sets;
    _auxiliary_data_set;
    _inner_invalid_transactions;
    constructor(header, transaction_bodies, transaction_witness_sets, auxiliary_data_set, inner_invalid_transactions) {
        this._header = header;
        this._transaction_bodies = transaction_bodies;
        this._transaction_witness_sets = transaction_witness_sets;
        this._auxiliary_data_set = auxiliary_data_set;
        this._inner_invalid_transactions = inner_invalid_transactions;
    }
    header() {
        return this._header;
    }
    set_header(header) {
        this._header = header;
    }
    transaction_bodies() {
        return this._transaction_bodies;
    }
    set_transaction_bodies(transaction_bodies) {
        this._transaction_bodies = transaction_bodies;
    }
    transaction_witness_sets() {
        return this._transaction_witness_sets;
    }
    set_transaction_witness_sets(transaction_witness_sets) {
        this._transaction_witness_sets = transaction_witness_sets;
    }
    auxiliary_data_set() {
        return this._auxiliary_data_set;
    }
    set_auxiliary_data_set(auxiliary_data_set) {
        this._auxiliary_data_set = auxiliary_data_set;
    }
    inner_invalid_transactions() {
        return this._inner_invalid_transactions;
    }
    set_inner_invalid_transactions(inner_invalid_transactions) {
        this._inner_invalid_transactions = inner_invalid_transactions;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 5) {
            throw new Error("Insufficient number of fields in record. Expected at least 5. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const header_path = [...path, "Header(header)"];
        let header = Header.deserialize(reader, header_path);
        const transaction_bodies_path = [
            ...path,
            "TransactionBodies(transaction_bodies)",
        ];
        let transaction_bodies = TransactionBodies.deserialize(reader, transaction_bodies_path);
        const transaction_witness_sets_path = [
            ...path,
            "TransactionWitnessSets(transaction_witness_sets)",
        ];
        let transaction_witness_sets = TransactionWitnessSets.deserialize(reader, transaction_witness_sets_path);
        const auxiliary_data_set_path = [
            ...path,
            "AuxiliaryDataSet(auxiliary_data_set)",
        ];
        let auxiliary_data_set = AuxiliaryDataSet.deserialize(reader, auxiliary_data_set_path);
        const inner_invalid_transactions_path = [
            ...path,
            "InvalidTransactions(inner_invalid_transactions)",
        ];
        let inner_invalid_transactions = InvalidTransactions.deserialize(reader, inner_invalid_transactions_path);
        return new Block(header, transaction_bodies, transaction_witness_sets, auxiliary_data_set, inner_invalid_transactions);
    }
    serialize(writer) {
        let arrayLen = 5;
        writer.writeArrayTag(arrayLen);
        this._header.serialize(writer);
        this._transaction_bodies.serialize(writer);
        this._transaction_witness_sets.serialize(writer);
        this._auxiliary_data_set.serialize(writer);
        this._inner_invalid_transactions.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Block"]) {
        let reader = new CBORReader(data);
        return Block.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Block"]) {
        return Block.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Block.from_bytes(this.to_bytes(), path);
    }
    static new(header, transaction_bodies, transaction_witness_sets, auxiliary_data_set, invalid_transactions) {
        return new Block(header, transaction_bodies, transaction_witness_sets, auxiliary_data_set, new InvalidTransactions(invalid_transactions));
    }
    invalid_transactions() {
        return this.inner_invalid_transactions().as_uint32Array();
    }
    set_invalid_transactions(invalid_transactions) {
        this._inner_invalid_transactions = new InvalidTransactions(invalid_transactions);
    }
}
export class BlockHash {
    inner;
    constructor(inner) {
        if (inner.length != 32)
            throw new Error("Expected length to be 32");
        this.inner = inner;
    }
    static new(inner) {
        return new BlockHash(inner);
    }
    static from_bech32(bech_str) {
        let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
        let words = decoded.words;
        let bytesArray = bech32.fromWords(words);
        let bytes = new Uint8Array(bytesArray);
        return new BlockHash(bytes);
    }
    to_bech32(prefix) {
        let bytes = this.to_bytes();
        let words = bech32.toWords(bytes);
        return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
    }
    // no-op
    free() { }
    static from_bytes(data) {
        return new BlockHash(data);
    }
    static from_hex(hex_str) {
        return BlockHash.from_bytes(hexToBytes(hex_str));
    }
    to_bytes() {
        return this.inner;
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone() {
        return BlockHash.from_bytes(this.to_bytes());
    }
    static deserialize(reader, path) {
        return new BlockHash(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeBytes(this.inner);
    }
}
export class BootstrapWitness {
    _vkey;
    _signature;
    _chain_code;
    _attributes;
    constructor(vkey, signature, chain_code, attributes) {
        this._vkey = vkey;
        this._signature = signature;
        this._chain_code = chain_code;
        this._attributes = attributes;
    }
    static new(vkey, signature, chain_code, attributes) {
        return new BootstrapWitness(vkey, signature, chain_code, attributes);
    }
    vkey() {
        return this._vkey;
    }
    set_vkey(vkey) {
        this._vkey = vkey;
    }
    signature() {
        return this._signature;
    }
    set_signature(signature) {
        this._signature = signature;
    }
    chain_code() {
        return this._chain_code;
    }
    set_chain_code(chain_code) {
        this._chain_code = chain_code;
    }
    attributes() {
        return this._attributes;
    }
    set_attributes(attributes) {
        this._attributes = attributes;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 4) {
            throw new Error("Insufficient number of fields in record. Expected at least 4. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const vkey_path = [...path, "Vkey(vkey)"];
        let vkey = Vkey.deserialize(reader, vkey_path);
        const signature_path = [...path, "Ed25519Signature(signature)"];
        let signature = Ed25519Signature.deserialize(reader, signature_path);
        const chain_code_path = [...path, "bytes(chain_code)"];
        let chain_code = reader.readBytes(chain_code_path);
        const attributes_path = [...path, "bytes(attributes)"];
        let attributes = reader.readBytes(attributes_path);
        return new BootstrapWitness(vkey, signature, chain_code, attributes);
    }
    serialize(writer) {
        let arrayLen = 4;
        writer.writeArrayTag(arrayLen);
        this._vkey.serialize(writer);
        this._signature.serialize(writer);
        writer.writeBytes(this._chain_code);
        writer.writeBytes(this._attributes);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["BootstrapWitness"]) {
        let reader = new CBORReader(data);
        return BootstrapWitness.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["BootstrapWitness"]) {
        return BootstrapWitness.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return BootstrapWitness.from_bytes(this.to_bytes(), path);
    }
}
export class BootstrapWitnesses {
    items;
    definiteEncoding;
    nonEmptyTag;
    setItems(items) {
        this.items = items;
    }
    constructor(definiteEncoding = true, nonEmptyTag = true) {
        this.items = [];
        this.definiteEncoding = definiteEncoding;
        this.nonEmptyTag = nonEmptyTag;
    }
    static new() {
        return new BootstrapWitnesses();
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        if (this.contains(elem))
            return true;
        this.items.push(elem);
        return false;
    }
    contains(elem) {
        for (let item of this.items) {
            if (arrayEq(item.to_bytes(), elem.to_bytes())) {
                return true;
            }
        }
        return false;
    }
    static deserialize(reader, path) {
        let nonEmptyTag = false;
        if (reader.peekType(path) == "tagged") {
            let tag = reader.readTaggedTag(path);
            if (tag != 258) {
                throw new Error("Expected tag 258. Got " + tag);
            }
            else {
                nonEmptyTag = true;
            }
        }
        const { items, definiteEncoding } = reader.readArray((reader, idx) => BootstrapWitness.deserialize(reader, [
            ...path,
            "BootstrapWitness#" + idx,
        ]), path);
        let ret = new BootstrapWitnesses(definiteEncoding, nonEmptyTag);
        ret.setItems(items);
        return ret;
    }
    serialize(writer) {
        if (this.nonEmptyTag) {
            writer.writeTaggedTag(258);
        }
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["BootstrapWitnesses"]) {
        let reader = new CBORReader(data);
        return BootstrapWitnesses.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["BootstrapWitnesses"]) {
        return BootstrapWitnesses.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return BootstrapWitnesses.from_bytes(this.to_bytes(), path);
    }
}
export class CSLBigInt {
    inner;
    constructor(inner) {
        this.inner = inner;
    }
    static new(inner) {
        return new CSLBigInt(inner);
    }
    toJsValue() {
        return this.inner;
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["CSLBigInt"]) {
        let reader = new CBORReader(data);
        return CSLBigInt.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["CSLBigInt"]) {
        return CSLBigInt.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return CSLBigInt.from_bytes(this.to_bytes(), path);
    }
    static from_str(string) {
        return new CSLBigInt(BigInt(string));
    }
    to_str() {
        return this.toJsValue().toString();
    }
    static zero() {
        return new CSLBigInt(0n);
    }
    static one() {
        return new CSLBigInt(1n);
    }
    is_zero() {
        return this.toJsValue() == 0n;
    }
    add(other) {
        let res = this.toJsValue() + other.toJsValue();
        return new CSLBigInt(res);
    }
    sub(other) {
        let res = this.toJsValue() - other.toJsValue();
        return new CSLBigInt(res);
    }
    mul(other) {
        let res = this.toJsValue() * other.toJsValue();
        return new CSLBigInt(res);
    }
    pow(other) {
        let res = this.toJsValue() ** BigInt(other);
        return new CSLBigInt(res);
    }
    div_floor(other) {
        let res = this.toJsValue() / other.toJsValue();
        return new CSLBigInt(res);
    }
    div_ceil(other) {
        let a = this.toJsValue();
        let b = other.toJsValue();
        let res = a / b;
        let rem = a % b;
        if (rem !== 0n && ((a < 0n && b < 0n) || (a > 0n && b > 0n))) {
            return new CSLBigInt(res + 1n);
        }
        return new CSLBigInt(res);
    }
    abs() {
        if (this.toJsValue() < 0)
            return new CSLBigInt(this.toJsValue() * -1n);
        return this;
    }
    increment() {
        return new CSLBigInt(this.toJsValue() + 1n);
    }
    static max(a, b) {
        if (a.toJsValue() > b.toJsValue())
            return a;
        else
            return b;
    }
    as_u64() {
        let inner = this.toJsValue();
        if (inner <= BigNum._maxU64()) {
            return new BigNum(inner);
        }
        return undefined;
    }
    as_int() {
        let inner = this.toJsValue();
        if (inner >= Int._minI32() && inner <= Int._maxI32())
            return new Int(inner);
        return undefined;
    }
    serialize(writer) {
        let value = this.toJsValue();
        let isNegative;
        let valueAbs;
        if (value >= 0n) {
            if (value <= BigNum._maxU64()) {
                writer.writeInt(value);
                return;
            }
            isNegative = false;
            valueAbs = value;
        }
        else {
            isNegative = true;
            valueAbs = value * -1n;
            if (valueAbs <= BigNum._maxU64()) {
                writer.writeInt(value);
                return;
            }
        }
        let buffer = new GrowableBuffer();
        buffer.pushBigInt(valueAbs);
        writer.writeTaggedTag(isNegative ? 3 : 2);
        writer.writeBytesChunked(buffer.getBytes(), 64);
    }
    static deserialize(reader, path) {
        let typ = reader.peekType(path);
        if (typ == "uint" || typ == "nint") {
            let value = reader.readInt(path);
            return new CSLBigInt(value);
        }
        // if not uint non nint, must be tagged
        let tag = reader.readTaggedTag(path);
        let isNegative;
        if (tag == 2) {
            isNegative = false;
        }
        else if (tag == 3) {
            isNegative = true;
        }
        else {
            throw new Error("Unknown tag: " + tag + ". Expected 2 or 3 (at" + path.join("/") + ")");
        }
        let bytes = reader.readBytes(path);
        let valueAbs = bigintFromBytes(bytes.length, bytes);
        let value = isNegative ? valueAbs * -1n : valueAbs;
        return new CSLBigInt(value);
    }
}
export { CSLBigInt as BigInt };
export var CertificateKind;
(function (CertificateKind) {
    CertificateKind[CertificateKind["StakeRegistration"] = 0] = "StakeRegistration";
    CertificateKind[CertificateKind["StakeDeregistration"] = 1] = "StakeDeregistration";
    CertificateKind[CertificateKind["StakeDelegation"] = 2] = "StakeDelegation";
    CertificateKind[CertificateKind["PoolRegistration"] = 3] = "PoolRegistration";
    CertificateKind[CertificateKind["PoolRetirement"] = 4] = "PoolRetirement";
    CertificateKind[CertificateKind["RegCert"] = 7] = "RegCert";
    CertificateKind[CertificateKind["UnregCert"] = 8] = "UnregCert";
    CertificateKind[CertificateKind["VoteDelegation"] = 9] = "VoteDelegation";
    CertificateKind[CertificateKind["StakeAndVoteDelegation"] = 10] = "StakeAndVoteDelegation";
    CertificateKind[CertificateKind["StakeRegistrationAndDelegation"] = 11] = "StakeRegistrationAndDelegation";
    CertificateKind[CertificateKind["VoteRegistrationAndDelegation"] = 12] = "VoteRegistrationAndDelegation";
    CertificateKind[CertificateKind["StakeVoteRegistrationAndDelegation"] = 13] = "StakeVoteRegistrationAndDelegation";
    CertificateKind[CertificateKind["CommitteeHotAuth"] = 14] = "CommitteeHotAuth";
    CertificateKind[CertificateKind["CommitteeColdResign"] = 15] = "CommitteeColdResign";
    CertificateKind[CertificateKind["DRepRegistration"] = 16] = "DRepRegistration";
    CertificateKind[CertificateKind["DRepDeregistration"] = 17] = "DRepDeregistration";
    CertificateKind[CertificateKind["DRepUpdate"] = 18] = "DRepUpdate";
})(CertificateKind || (CertificateKind = {}));
export class Certificate {
    variant;
    constructor(variant) {
        this.variant = variant;
    }
    static new_stake_registration(stake_registration) {
        return new Certificate({ kind: 0, value: stake_registration });
    }
    static new_stake_deregistration(stake_deregistration) {
        return new Certificate({ kind: 1, value: stake_deregistration });
    }
    static new_stake_delegation(stake_delegation) {
        return new Certificate({ kind: 2, value: stake_delegation });
    }
    static new_pool_registration(pool_registration) {
        return new Certificate({ kind: 3, value: pool_registration });
    }
    static new_pool_retirement(pool_retirement) {
        return new Certificate({ kind: 4, value: pool_retirement });
    }
    static new_reg_cert(reg_cert) {
        return new Certificate({ kind: 7, value: reg_cert });
    }
    static new_unreg_cert(unreg_cert) {
        return new Certificate({ kind: 8, value: unreg_cert });
    }
    static new_vote_delegation(vote_delegation) {
        return new Certificate({ kind: 9, value: vote_delegation });
    }
    static new_stake_and_vote_delegation(stake_and_vote_delegation) {
        return new Certificate({ kind: 10, value: stake_and_vote_delegation });
    }
    static new_stake_registration_and_delegation(stake_registration_and_delegation) {
        return new Certificate({
            kind: 11,
            value: stake_registration_and_delegation,
        });
    }
    static new_vote_registration_and_delegation(vote_registration_and_delegation) {
        return new Certificate({
            kind: 12,
            value: vote_registration_and_delegation,
        });
    }
    static new_stake_vote_registration_and_delegation(stake_vote_registration_and_delegation) {
        return new Certificate({
            kind: 13,
            value: stake_vote_registration_and_delegation,
        });
    }
    static new_committee_hot_auth(committee_hot_auth) {
        return new Certificate({ kind: 14, value: committee_hot_auth });
    }
    static new_committee_cold_resign(committee_cold_resign) {
        return new Certificate({ kind: 15, value: committee_cold_resign });
    }
    static new_drep_registration(drep_registration) {
        return new Certificate({ kind: 16, value: drep_registration });
    }
    static new_drep_deregistration(drep_deregistration) {
        return new Certificate({ kind: 17, value: drep_deregistration });
    }
    static new_drep_update(drep_update) {
        return new Certificate({ kind: 18, value: drep_update });
    }
    as_stake_registration() {
        if (this.variant.kind == 0)
            return this.variant.value;
    }
    as_stake_deregistration() {
        if (this.variant.kind == 1)
            return this.variant.value;
    }
    as_stake_delegation() {
        if (this.variant.kind == 2)
            return this.variant.value;
    }
    as_pool_registration() {
        if (this.variant.kind == 3)
            return this.variant.value;
    }
    as_pool_retirement() {
        if (this.variant.kind == 4)
            return this.variant.value;
    }
    as_reg_cert() {
        if (this.variant.kind == 7)
            return this.variant.value;
    }
    as_unreg_cert() {
        if (this.variant.kind == 8)
            return this.variant.value;
    }
    as_vote_delegation() {
        if (this.variant.kind == 9)
            return this.variant.value;
    }
    as_stake_and_vote_delegation() {
        if (this.variant.kind == 10)
            return this.variant.value;
    }
    as_stake_registration_and_delegation() {
        if (this.variant.kind == 11)
            return this.variant.value;
    }
    as_vote_registration_and_delegation() {
        if (this.variant.kind == 12)
            return this.variant.value;
    }
    as_stake_vote_registration_and_delegation() {
        if (this.variant.kind == 13)
            return this.variant.value;
    }
    as_committee_hot_auth() {
        if (this.variant.kind == 14)
            return this.variant.value;
    }
    as_committee_cold_resign() {
        if (this.variant.kind == 15)
            return this.variant.value;
    }
    as_drep_registration() {
        if (this.variant.kind == 16)
            return this.variant.value;
    }
    as_drep_deregistration() {
        if (this.variant.kind == 17)
            return this.variant.value;
    }
    as_drep_update() {
        if (this.variant.kind == 18)
            return this.variant.value;
    }
    kind() {
        return this.variant.kind;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        let tag = Number(reader.readUint(path));
        let variant;
        switch (tag) {
            case 0:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode StakeRegistration");
                }
                variant = {
                    kind: 0,
                    value: StakeRegistration.deserialize(reader, [
                        ...path,
                        "StakeRegistration",
                    ]),
                };
                break;
            case 1:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode StakeDeregistration");
                }
                variant = {
                    kind: 1,
                    value: StakeDeregistration.deserialize(reader, [
                        ...path,
                        "StakeDeregistration",
                    ]),
                };
                break;
            case 2:
                if (len != null && len - 1 != 2) {
                    throw new Error("Expected 2 items to decode StakeDelegation");
                }
                variant = {
                    kind: 2,
                    value: StakeDelegation.deserialize(reader, [
                        ...path,
                        "StakeDelegation",
                    ]),
                };
                break;
            case 3:
                if (len != null && len - 1 != 9) {
                    throw new Error("Expected 9 items to decode PoolRegistration");
                }
                variant = {
                    kind: 3,
                    value: PoolRegistration.deserialize(reader, [
                        ...path,
                        "PoolRegistration",
                    ]),
                };
                break;
            case 4:
                if (len != null && len - 1 != 2) {
                    throw new Error("Expected 2 items to decode PoolRetirement");
                }
                variant = {
                    kind: 4,
                    value: PoolRetirement.deserialize(reader, [
                        ...path,
                        "PoolRetirement",
                    ]),
                };
                break;
            case 7:
                if (len != null && len - 1 != 2) {
                    throw new Error("Expected 2 items to decode RegCert");
                }
                variant = {
                    kind: 7,
                    value: RegCert.deserialize(reader, [...path, "RegCert"]),
                };
                break;
            case 8:
                if (len != null && len - 1 != 2) {
                    throw new Error("Expected 2 items to decode UnregCert");
                }
                variant = {
                    kind: 8,
                    value: UnregCert.deserialize(reader, [...path, "UnregCert"]),
                };
                break;
            case 9:
                if (len != null && len - 1 != 2) {
                    throw new Error("Expected 2 items to decode VoteDelegation");
                }
                variant = {
                    kind: 9,
                    value: VoteDelegation.deserialize(reader, [
                        ...path,
                        "VoteDelegation",
                    ]),
                };
                break;
            case 10:
                if (len != null && len - 1 != 3) {
                    throw new Error("Expected 3 items to decode StakeAndVoteDelegation");
                }
                variant = {
                    kind: 10,
                    value: StakeAndVoteDelegation.deserialize(reader, [
                        ...path,
                        "StakeAndVoteDelegation",
                    ]),
                };
                break;
            case 11:
                if (len != null && len - 1 != 3) {
                    throw new Error("Expected 3 items to decode StakeRegistrationAndDelegation");
                }
                variant = {
                    kind: 11,
                    value: StakeRegistrationAndDelegation.deserialize(reader, [
                        ...path,
                        "StakeRegistrationAndDelegation",
                    ]),
                };
                break;
            case 12:
                if (len != null && len - 1 != 3) {
                    throw new Error("Expected 3 items to decode VoteRegistrationAndDelegation");
                }
                variant = {
                    kind: 12,
                    value: VoteRegistrationAndDelegation.deserialize(reader, [
                        ...path,
                        "VoteRegistrationAndDelegation",
                    ]),
                };
                break;
            case 13:
                if (len != null && len - 1 != 4) {
                    throw new Error("Expected 4 items to decode StakeVoteRegistrationAndDelegation");
                }
                variant = {
                    kind: 13,
                    value: StakeVoteRegistrationAndDelegation.deserialize(reader, [
                        ...path,
                        "StakeVoteRegistrationAndDelegation",
                    ]),
                };
                break;
            case 14:
                if (len != null && len - 1 != 2) {
                    throw new Error("Expected 2 items to decode CommitteeHotAuth");
                }
                variant = {
                    kind: 14,
                    value: CommitteeHotAuth.deserialize(reader, [
                        ...path,
                        "CommitteeHotAuth",
                    ]),
                };
                break;
            case 15:
                if (len != null && len - 1 != 2) {
                    throw new Error("Expected 2 items to decode CommitteeColdResign");
                }
                variant = {
                    kind: 15,
                    value: CommitteeColdResign.deserialize(reader, [
                        ...path,
                        "CommitteeColdResign",
                    ]),
                };
                break;
            case 16:
                if (len != null && len - 1 != 3) {
                    throw new Error("Expected 3 items to decode DRepRegistration");
                }
                variant = {
                    kind: 16,
                    value: DRepRegistration.deserialize(reader, [
                        ...path,
                        "DRepRegistration",
                    ]),
                };
                break;
            case 17:
                if (len != null && len - 1 != 2) {
                    throw new Error("Expected 2 items to decode DRepDeregistration");
                }
                variant = {
                    kind: 17,
                    value: DRepDeregistration.deserialize(reader, [
                        ...path,
                        "DRepDeregistration",
                    ]),
                };
                break;
            case 18:
                if (len != null && len - 1 != 2) {
                    throw new Error("Expected 2 items to decode DRepUpdate");
                }
                variant = {
                    kind: 18,
                    value: DRepUpdate.deserialize(reader, [...path, "DRepUpdate"]),
                };
                break;
            default:
                throw new Error("Unexpected tag for Certificate: " +
                    tag +
                    "(at " +
                    path.join("/") +
                    ")");
        }
        if (len == null) {
            reader.readBreak();
        }
        return new Certificate(variant);
    }
    serialize(writer) {
        switch (this.variant.kind) {
            case 0:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(0));
                this.variant.value.serialize(writer);
                break;
            case 1:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(1));
                this.variant.value.serialize(writer);
                break;
            case 2:
                writer.writeArrayTag(3);
                writer.writeInt(BigInt(2));
                this.variant.value.serialize(writer);
                break;
            case 3:
                writer.writeArrayTag(10);
                writer.writeInt(BigInt(3));
                this.variant.value.serialize(writer);
                break;
            case 4:
                writer.writeArrayTag(3);
                writer.writeInt(BigInt(4));
                this.variant.value.serialize(writer);
                break;
            case 7:
                writer.writeArrayTag(3);
                writer.writeInt(BigInt(7));
                this.variant.value.serialize(writer);
                break;
            case 8:
                writer.writeArrayTag(3);
                writer.writeInt(BigInt(8));
                this.variant.value.serialize(writer);
                break;
            case 9:
                writer.writeArrayTag(3);
                writer.writeInt(BigInt(9));
                this.variant.value.serialize(writer);
                break;
            case 10:
                writer.writeArrayTag(4);
                writer.writeInt(BigInt(10));
                this.variant.value.serialize(writer);
                break;
            case 11:
                writer.writeArrayTag(4);
                writer.writeInt(BigInt(11));
                this.variant.value.serialize(writer);
                break;
            case 12:
                writer.writeArrayTag(4);
                writer.writeInt(BigInt(12));
                this.variant.value.serialize(writer);
                break;
            case 13:
                writer.writeArrayTag(5);
                writer.writeInt(BigInt(13));
                this.variant.value.serialize(writer);
                break;
            case 14:
                writer.writeArrayTag(3);
                writer.writeInt(BigInt(14));
                this.variant.value.serialize(writer);
                break;
            case 15:
                writer.writeArrayTag(3);
                writer.writeInt(BigInt(15));
                this.variant.value.serialize(writer);
                break;
            case 16:
                writer.writeArrayTag(4);
                writer.writeInt(BigInt(16));
                this.variant.value.serialize(writer);
                break;
            case 17:
                writer.writeArrayTag(3);
                writer.writeInt(BigInt(17));
                this.variant.value.serialize(writer);
                break;
            case 18:
                writer.writeArrayTag(3);
                writer.writeInt(BigInt(18));
                this.variant.value.serialize(writer);
                break;
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Certificate"]) {
        let reader = new CBORReader(data);
        return Certificate.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Certificate"]) {
        return Certificate.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Certificate.from_bytes(this.to_bytes(), path);
    }
}
export class Certificates {
    items;
    definiteEncoding;
    nonEmptyTag;
    setItems(items) {
        this.items = items;
    }
    constructor(definiteEncoding = true, nonEmptyTag = true) {
        this.items = [];
        this.definiteEncoding = definiteEncoding;
        this.nonEmptyTag = nonEmptyTag;
    }
    static new() {
        return new Certificates();
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        if (this.contains(elem))
            return true;
        this.items.push(elem);
        return false;
    }
    contains(elem) {
        for (let item of this.items) {
            if (arrayEq(item.to_bytes(), elem.to_bytes())) {
                return true;
            }
        }
        return false;
    }
    static deserialize(reader, path) {
        let nonEmptyTag = false;
        if (reader.peekType(path) == "tagged") {
            let tag = reader.readTaggedTag(path);
            if (tag != 258) {
                throw new Error("Expected tag 258. Got " + tag);
            }
            else {
                nonEmptyTag = true;
            }
        }
        const { items, definiteEncoding } = reader.readArray((reader, idx) => Certificate.deserialize(reader, [...path, "Certificate#" + idx]), path);
        let ret = new Certificates(definiteEncoding, nonEmptyTag);
        ret.setItems(items);
        return ret;
    }
    serialize(writer) {
        if (this.nonEmptyTag) {
            writer.writeTaggedTag(258);
        }
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Certificates"]) {
        let reader = new CBORReader(data);
        return Certificates.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Certificates"]) {
        return Certificates.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Certificates.from_bytes(this.to_bytes(), path);
    }
}
export class ChangeConfig {
    _address;
    _plutus_data;
    _script_ref;
    constructor(address, plutus_data, script_ref) {
        this._address = address;
        this._plutus_data = plutus_data;
        this._script_ref = script_ref;
    }
    address() {
        return this._address;
    }
    set_address(address) {
        this._address = address;
    }
    plutus_data() {
        return this._plutus_data;
    }
    set_plutus_data(plutus_data) {
        this._plutus_data = plutus_data;
    }
    script_ref() {
        return this._script_ref;
    }
    set_script_ref(script_ref) {
        this._script_ref = script_ref;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 3) {
            throw new Error("Insufficient number of fields in record. Expected at least 3. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const address_path = [...path, "Address(address)"];
        let address = Address.deserialize(reader, address_path);
        const plutus_data_path = [...path, "OutputDatum(plutus_data)"];
        let plutus_data = reader.readNullable((r) => OutputDatum.deserialize(r, plutus_data_path), path) ?? undefined;
        const script_ref_path = [...path, "ScriptRef(script_ref)"];
        let script_ref = reader.readNullable((r) => ScriptRef.deserialize(r, script_ref_path), path) ?? undefined;
        return new ChangeConfig(address, plutus_data, script_ref);
    }
    serialize(writer) {
        let arrayLen = 3;
        writer.writeArrayTag(arrayLen);
        this._address.serialize(writer);
        if (this._plutus_data == null) {
            writer.writeNull();
        }
        else {
            this._plutus_data.serialize(writer);
        }
        if (this._script_ref == null) {
            writer.writeNull();
        }
        else {
            this._script_ref.serialize(writer);
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["ChangeConfig"]) {
        let reader = new CBORReader(data);
        return ChangeConfig.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["ChangeConfig"]) {
        return ChangeConfig.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return ChangeConfig.from_bytes(this.to_bytes(), path);
    }
    static new(address) {
        return new ChangeConfig(address, undefined, undefined);
    }
    change_address(address) {
        return new ChangeConfig(address, this._plutus_data, this._script_ref);
    }
    change_plutus_data(plutus_data) {
        return new ChangeConfig(this._address, plutus_data, this._script_ref);
    }
    change_script_ref(script_ref) {
        return new ChangeConfig(this._address, this._plutus_data, script_ref);
    }
}
export class Committee {
    quorum_threshold_;
    members_;
    constructor(quorum_threshold, members) {
        this.quorum_threshold_ = quorum_threshold;
        this.members_ = members;
    }
    static new(quorum_threshold) {
        return new Committee(quorum_threshold, CommitteeEpochs.new());
    }
    members_keys() {
        let credentials = new Credentials();
        for (let [k, _] of this.members_._items) {
            credentials.add(k);
        }
        return credentials;
    }
    quorum_threshold() {
        return this.quorum_threshold_;
    }
    add_member(committee_cold_credential, epoch) {
        this.members_.insert(committee_cold_credential, epoch);
    }
    get_member_epoch(committee_cold_credential) {
        return this.members_.get(committee_cold_credential);
    }
}
export class CommitteeColdResign {
    _committee_cold_credential;
    _anchor;
    constructor(committee_cold_credential, anchor) {
        this._committee_cold_credential = committee_cold_credential;
        this._anchor = anchor;
    }
    committee_cold_credential() {
        return this._committee_cold_credential;
    }
    set_committee_cold_credential(committee_cold_credential) {
        this._committee_cold_credential = committee_cold_credential;
    }
    anchor() {
        return this._anchor;
    }
    set_anchor(anchor) {
        this._anchor = anchor;
    }
    static deserialize(reader, path) {
        let committee_cold_credential = Credential.deserialize(reader, [
            ...path,
            "committee_cold_credential",
        ]);
        let anchor = reader.readNullable((r) => Anchor.deserialize(r, [...path, "anchor"]), path) ?? undefined;
        return new CommitteeColdResign(committee_cold_credential, anchor);
    }
    serialize(writer) {
        this._committee_cold_credential.serialize(writer);
        if (this._anchor == null) {
            writer.writeNull();
        }
        else {
            this._anchor.serialize(writer);
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["CommitteeColdResign"]) {
        let reader = new CBORReader(data);
        return CommitteeColdResign.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["CommitteeColdResign"]) {
        return CommitteeColdResign.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return CommitteeColdResign.from_bytes(this.to_bytes(), path);
    }
    static new(committee_cold_credential) {
        return new CommitteeColdResign(committee_cold_credential, undefined);
    }
    static new_with_anchor(committee_cold_credential, anchor) {
        return new CommitteeColdResign(committee_cold_credential, anchor);
    }
}
export class CommitteeEpochs {
    _items;
    constructor(items) {
        this._items = items;
    }
    static new() {
        return new CommitteeEpochs([]);
    }
    len() {
        return this._items.length;
    }
    insert(key, value) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry != null) {
            let ret = entry[1];
            entry[1] = value;
            return ret;
        }
        this._items.push([key, value]);
        return undefined;
    }
    get(key) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry == null)
            return undefined;
        return entry[1];
    }
    _remove_many(keys) {
        this._items = this._items.filter(([k, _v]) => keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())));
    }
    static deserialize(reader, path) {
        let ret = new CommitteeEpochs([]);
        reader.readMap((reader, idx) => ret.insert(Credential.deserialize(reader, [...path, "Credential#" + idx]), Number(reader.readInt([...path, "number#" + idx]))), path);
        return ret;
    }
    serialize(writer) {
        writer.writeMap(this._items, (writer, x) => {
            x[0].serialize(writer);
            writer.writeInt(BigInt(x[1]));
        });
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["CommitteeEpochs"]) {
        let reader = new CBORReader(data);
        return CommitteeEpochs.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["CommitteeEpochs"]) {
        return CommitteeEpochs.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return CommitteeEpochs.from_bytes(this.to_bytes(), path);
    }
}
export class CommitteeHotAuth {
    _committee_cold_credential;
    _committee_hot_credential;
    constructor(committee_cold_credential, committee_hot_credential) {
        this._committee_cold_credential = committee_cold_credential;
        this._committee_hot_credential = committee_hot_credential;
    }
    static new(committee_cold_credential, committee_hot_credential) {
        return new CommitteeHotAuth(committee_cold_credential, committee_hot_credential);
    }
    committee_cold_credential() {
        return this._committee_cold_credential;
    }
    set_committee_cold_credential(committee_cold_credential) {
        this._committee_cold_credential = committee_cold_credential;
    }
    committee_hot_credential() {
        return this._committee_hot_credential;
    }
    set_committee_hot_credential(committee_hot_credential) {
        this._committee_hot_credential = committee_hot_credential;
    }
    static deserialize(reader, path) {
        let committee_cold_credential = Credential.deserialize(reader, [
            ...path,
            "committee_cold_credential",
        ]);
        let committee_hot_credential = Credential.deserialize(reader, [
            ...path,
            "committee_hot_credential",
        ]);
        return new CommitteeHotAuth(committee_cold_credential, committee_hot_credential);
    }
    serialize(writer) {
        this._committee_cold_credential.serialize(writer);
        this._committee_hot_credential.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["CommitteeHotAuth"]) {
        let reader = new CBORReader(data);
        return CommitteeHotAuth.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["CommitteeHotAuth"]) {
        return CommitteeHotAuth.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return CommitteeHotAuth.from_bytes(this.to_bytes(), path);
    }
}
export class Constitution {
    _anchor;
    _script_hash;
    constructor(anchor, script_hash) {
        this._anchor = anchor;
        this._script_hash = script_hash;
    }
    anchor() {
        return this._anchor;
    }
    set_anchor(anchor) {
        this._anchor = anchor;
    }
    script_hash() {
        return this._script_hash;
    }
    set_script_hash(script_hash) {
        this._script_hash = script_hash;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 2) {
            throw new Error("Insufficient number of fields in record. Expected at least 2. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const anchor_path = [...path, "Anchor(anchor)"];
        let anchor = Anchor.deserialize(reader, anchor_path);
        const script_hash_path = [...path, "ScriptHash(script_hash)"];
        let script_hash = reader.readNullable((r) => ScriptHash.deserialize(r, script_hash_path), path) ?? undefined;
        return new Constitution(anchor, script_hash);
    }
    serialize(writer) {
        let arrayLen = 2;
        writer.writeArrayTag(arrayLen);
        this._anchor.serialize(writer);
        if (this._script_hash == null) {
            writer.writeNull();
        }
        else {
            this._script_hash.serialize(writer);
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Constitution"]) {
        let reader = new CBORReader(data);
        return Constitution.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Constitution"]) {
        return Constitution.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Constitution.from_bytes(this.to_bytes(), path);
    }
    static new(anchor) {
        return new Constitution(anchor, undefined);
    }
    static new_with_script_hash(anchor, scripthash) {
        return new Constitution(anchor, scripthash);
    }
}
export class ConstrPlutusData {
    _alternative;
    _data;
    constructor(alternative, data) {
        this._alternative = alternative;
        this._data = data;
    }
    static uncheckedNew(alternative, data) {
        return new ConstrPlutusData(alternative, data);
    }
    alternative() {
        return this._alternative;
    }
    set_alternative(alternative) {
        this._alternative = alternative;
    }
    data() {
        return this._data;
    }
    set_data(data) {
        this._data = data;
    }
    static deserializeWithSeparateIdx(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 2) {
            throw new Error("Insufficient number of fields in record. Expected at least 2. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const alternative_path = [...path, "BigNum(alternative)"];
        let alternative = BigNum.deserialize(reader, alternative_path);
        const data_path = [...path, "PlutusList(data)"];
        let data = PlutusList.deserialize(reader, data_path);
        return new ConstrPlutusData(alternative, data);
    }
    serializeWithSeparateIdx(writer) {
        let arrayLen = 2;
        writer.writeArrayTag(arrayLen);
        this._alternative.serialize(writer);
        this._data.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["ConstrPlutusData"]) {
        let reader = new CBORReader(data);
        return ConstrPlutusData.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["ConstrPlutusData"]) {
        return ConstrPlutusData.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return ConstrPlutusData.from_bytes(this.to_bytes(), path);
    }
    static deserialize(reader, path) {
        const tag = reader.readTaggedTagAsBigInt(path);
        if (Number(tag) >= 121 && Number(tag) <= 127) {
            return ConstrPlutusData.new(BigNum.new(tag).checked_sub(BigNum.from_str("121")), PlutusList.deserialize(reader, [...path, "PlutusList(data)"]));
        }
        else if (Number(tag) == 102) {
            return ConstrPlutusData.deserializeWithSeparateIdx(reader, path);
        }
        else {
            throw new Error("Unexpected tagfor ConstrPlutusData: " +
                tag +
                "(at " +
                path.join("/") +
                ")");
        }
    }
    serialize(writer) {
        const alternative = this.alternative().toJsValue();
        if (alternative > 6) {
            writer.writeTaggedTag(102);
            this.serializeWithSeparateIdx(writer);
        }
        else {
            writer.writeTaggedTag(Number(alternative) + 121);
            this.data().serialize(writer);
        }
    }
    static new(alternative, data) {
        return ConstrPlutusData.uncheckedNew(alternative, data);
    }
}
export class CostModel {
    items;
    definiteEncoding;
    constructor(items, definiteEncoding = true) {
        this.items = items;
        this.definiteEncoding = definiteEncoding;
    }
    static new() {
        return new CostModel([]);
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        this.items.push(elem);
    }
    static deserialize(reader, path) {
        const { items, definiteEncoding } = reader.readArray((reader, idx) => Int.deserialize(reader, [...path, "Elem#" + idx]), path);
        return new CostModel(items, definiteEncoding);
    }
    serialize(writer) {
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["CostModel"]) {
        let reader = new CBORReader(data);
        return CostModel.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["CostModel"]) {
        return CostModel.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return CostModel.from_bytes(this.to_bytes(), path);
    }
    set(operation, cost) {
        const len = this.items.length;
        const idx = operation;
        // Fill in-between indexes with zeroes if the operation index is greater than the current length
        if (idx >= len) {
            for (let i = 0; i < idx - len + 1; i++) {
                this.items.push(Int.new_i32(0));
            }
        }
        const old = this.items[idx];
        this.items[idx] = cost;
        // Return the old value - behaviour of CSL's Rust code.
        return old;
    }
}
export class Costmdls {
    _items;
    constructor(items) {
        this._items = items;
    }
    static new() {
        return new Costmdls([]);
    }
    len() {
        return this._items.length;
    }
    insert(key, value) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry != null) {
            let ret = entry[1];
            entry[1] = value;
            return ret;
        }
        this._items.push([key, value]);
        return undefined;
    }
    get(key) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry == null)
            return undefined;
        return entry[1];
    }
    _remove_many(keys) {
        this._items = this._items.filter(([k, _v]) => keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())));
    }
    keys() {
        let keys = Languages.new();
        for (let [key, _] of this._items)
            keys.add(key);
        return keys;
    }
    static deserialize(reader, path) {
        let ret = new Costmdls([]);
        reader.readMap((reader, idx) => ret.insert(Language.deserialize(reader, [...path, "Language#" + idx]), CostModel.deserialize(reader, [...path, "CostModel#" + idx])), path);
        return ret;
    }
    serialize(writer) {
        writer.writeMap(this._items, (writer, x) => {
            x[0].serialize(writer);
            x[1].serialize(writer);
        });
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Costmdls"]) {
        let reader = new CBORReader(data);
        return Costmdls.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Costmdls"]) {
        return Costmdls.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Costmdls.from_bytes(this.to_bytes(), path);
    }
    retain_language_versions(languages) {
        const result = new Costmdls([]);
        for (let i = 0; i < languages.len(); i++) {
            const lang = languages.get(i);
            const costModel = this.get(lang);
            if (costModel !== undefined) {
                result.insert(lang, costModel);
            }
        }
        return result;
    }
}
export class Credentials {
    items;
    definiteEncoding;
    nonEmptyTag;
    setItems(items) {
        this.items = items;
    }
    constructor(definiteEncoding = true, nonEmptyTag = true) {
        this.items = [];
        this.definiteEncoding = definiteEncoding;
        this.nonEmptyTag = nonEmptyTag;
    }
    static new() {
        return new Credentials();
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        if (this.contains(elem))
            return true;
        this.items.push(elem);
        return false;
    }
    contains(elem) {
        for (let item of this.items) {
            if (arrayEq(item.to_bytes(), elem.to_bytes())) {
                return true;
            }
        }
        return false;
    }
    static deserialize(reader, path) {
        let nonEmptyTag = false;
        if (reader.peekType(path) == "tagged") {
            let tag = reader.readTaggedTag(path);
            if (tag != 258) {
                throw new Error("Expected tag 258. Got " + tag);
            }
            else {
                nonEmptyTag = true;
            }
        }
        const { items, definiteEncoding } = reader.readArray((reader, idx) => Credential.deserialize(reader, [...path, "Credential#" + idx]), path);
        let ret = new Credentials(definiteEncoding, nonEmptyTag);
        ret.setItems(items);
        return ret;
    }
    serialize(writer) {
        if (this.nonEmptyTag) {
            writer.writeTaggedTag(258);
        }
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Credentials"]) {
        let reader = new CBORReader(data);
        return Credentials.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Credentials"]) {
        return Credentials.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Credentials.from_bytes(this.to_bytes(), path);
    }
}
export class DNSRecordAorAAAA {
    inner;
    constructor(inner) {
        if (inner.length > 64)
            throw new Error("Expected length to be atmost 64");
        this.inner = inner;
    }
    static new(inner) {
        return new DNSRecordAorAAAA(inner);
    }
    record() {
        return this.inner;
    }
    static deserialize(reader, path) {
        return new DNSRecordAorAAAA(reader.readString(path));
    }
    serialize(writer) {
        writer.writeString(this.inner);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["DNSRecordAorAAAA"]) {
        let reader = new CBORReader(data);
        return DNSRecordAorAAAA.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["DNSRecordAorAAAA"]) {
        return DNSRecordAorAAAA.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return DNSRecordAorAAAA.from_bytes(this.to_bytes(), path);
    }
}
export class DNSRecordSRV {
    inner;
    constructor(inner) {
        if (inner.length > 64)
            throw new Error("Expected length to be atmost 64");
        this.inner = inner;
    }
    static new(inner) {
        return new DNSRecordSRV(inner);
    }
    record() {
        return this.inner;
    }
    static deserialize(reader, path) {
        return new DNSRecordSRV(reader.readString(path));
    }
    serialize(writer) {
        writer.writeString(this.inner);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["DNSRecordSRV"]) {
        let reader = new CBORReader(data);
        return DNSRecordSRV.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["DNSRecordSRV"]) {
        return DNSRecordSRV.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return DNSRecordSRV.from_bytes(this.to_bytes(), path);
    }
}
export var DRepKind;
(function (DRepKind) {
    DRepKind[DRepKind["Ed25519KeyHash"] = 0] = "Ed25519KeyHash";
    DRepKind[DRepKind["ScriptHash"] = 1] = "ScriptHash";
    DRepKind[DRepKind["AlwaysAbstain"] = 2] = "AlwaysAbstain";
    DRepKind[DRepKind["AlwaysNoConfidence"] = 3] = "AlwaysNoConfidence";
})(DRepKind || (DRepKind = {}));
export class DRep {
    variant;
    constructor(variant) {
        this.variant = variant;
    }
    static new_key_hash(key_hash) {
        return new DRep({ kind: 0, value: key_hash });
    }
    static new_script_hash(script_hash) {
        return new DRep({ kind: 1, value: script_hash });
    }
    static new_always_abstain() {
        return new DRep({ kind: 2 });
    }
    static new_always_no_confidence() {
        return new DRep({ kind: 3 });
    }
    as_key_hash() {
        if (this.variant.kind == 0)
            return this.variant.value;
    }
    as_script_hash() {
        if (this.variant.kind == 1)
            return this.variant.value;
    }
    kind() {
        return this.variant.kind;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        let tag = Number(reader.readUint(path));
        let variant;
        switch (tag) {
            case 0:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode Ed25519KeyHash");
                }
                variant = {
                    kind: 0,
                    value: Ed25519KeyHash.deserialize(reader, [
                        ...path,
                        "Ed25519KeyHash",
                    ]),
                };
                break;
            case 1:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode ScriptHash");
                }
                variant = {
                    kind: 1,
                    value: ScriptHash.deserialize(reader, [...path, "ScriptHash"]),
                };
                break;
            case 2:
                if (len != null && len - 1 != 0) {
                    throw new Error("Expected 0 items to decode AlwaysAbstain");
                }
                variant = {
                    kind: 2,
                };
                break;
            case 3:
                if (len != null && len - 1 != 0) {
                    throw new Error("Expected 0 items to decode AlwaysNoConfidence");
                }
                variant = {
                    kind: 3,
                };
                break;
            default:
                throw new Error("Unexpected tag for DRep: " + tag + "(at " + path.join("/") + ")");
        }
        if (len == null) {
            reader.readBreak();
        }
        return new DRep(variant);
    }
    serialize(writer) {
        switch (this.variant.kind) {
            case 0:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(0));
                this.variant.value.serialize(writer);
                break;
            case 1:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(1));
                this.variant.value.serialize(writer);
                break;
            case 2:
                writer.writeArrayTag(1);
                writer.writeInt(BigInt(2));
                break;
            case 3:
                writer.writeArrayTag(1);
                writer.writeInt(BigInt(3));
                break;
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["DRep"]) {
        let reader = new CBORReader(data);
        return DRep.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["DRep"]) {
        return DRep.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return DRep.from_bytes(this.to_bytes(), path);
    }
}
export class DRepDeregistration {
    _drep_credential;
    _coin;
    constructor(drep_credential, coin) {
        this._drep_credential = drep_credential;
        this._coin = coin;
    }
    static new(drep_credential, coin) {
        return new DRepDeregistration(drep_credential, coin);
    }
    drep_credential() {
        return this._drep_credential;
    }
    set_drep_credential(drep_credential) {
        this._drep_credential = drep_credential;
    }
    coin() {
        return this._coin;
    }
    set_coin(coin) {
        this._coin = coin;
    }
    static deserialize(reader, path) {
        let drep_credential = Credential.deserialize(reader, [
            ...path,
            "drep_credential",
        ]);
        let coin = BigNum.deserialize(reader, [...path, "coin"]);
        return new DRepDeregistration(drep_credential, coin);
    }
    serialize(writer) {
        this._drep_credential.serialize(writer);
        this._coin.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["DRepDeregistration"]) {
        let reader = new CBORReader(data);
        return DRepDeregistration.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["DRepDeregistration"]) {
        return DRepDeregistration.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return DRepDeregistration.from_bytes(this.to_bytes(), path);
    }
}
export class DRepRegistration {
    _voting_credential;
    _coin;
    _anchor;
    constructor(voting_credential, coin, anchor) {
        this._voting_credential = voting_credential;
        this._coin = coin;
        this._anchor = anchor;
    }
    voting_credential() {
        return this._voting_credential;
    }
    set_voting_credential(voting_credential) {
        this._voting_credential = voting_credential;
    }
    coin() {
        return this._coin;
    }
    set_coin(coin) {
        this._coin = coin;
    }
    anchor() {
        return this._anchor;
    }
    set_anchor(anchor) {
        this._anchor = anchor;
    }
    static deserialize(reader, path) {
        let voting_credential = Credential.deserialize(reader, [
            ...path,
            "voting_credential",
        ]);
        let coin = BigNum.deserialize(reader, [...path, "coin"]);
        let anchor = reader.readNullable((r) => Anchor.deserialize(r, [...path, "anchor"]), path) ?? undefined;
        return new DRepRegistration(voting_credential, coin, anchor);
    }
    serialize(writer) {
        this._voting_credential.serialize(writer);
        this._coin.serialize(writer);
        if (this._anchor == null) {
            writer.writeNull();
        }
        else {
            this._anchor.serialize(writer);
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["DRepRegistration"]) {
        let reader = new CBORReader(data);
        return DRepRegistration.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["DRepRegistration"]) {
        return DRepRegistration.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return DRepRegistration.from_bytes(this.to_bytes(), path);
    }
    static new(voting_credential, coin) {
        return new DRepRegistration(voting_credential, coin, undefined);
    }
    static new_with_anchor(voting_credential, coin, anchor) {
        return new DRepRegistration(voting_credential, coin, anchor);
    }
}
export class DRepUpdate {
    _drep_credential;
    _anchor;
    constructor(drep_credential, anchor) {
        this._drep_credential = drep_credential;
        this._anchor = anchor;
    }
    drep_credential() {
        return this._drep_credential;
    }
    set_drep_credential(drep_credential) {
        this._drep_credential = drep_credential;
    }
    anchor() {
        return this._anchor;
    }
    set_anchor(anchor) {
        this._anchor = anchor;
    }
    static deserialize(reader, path) {
        let drep_credential = Credential.deserialize(reader, [
            ...path,
            "drep_credential",
        ]);
        let anchor = reader.readNullable((r) => Anchor.deserialize(r, [...path, "anchor"]), path) ?? undefined;
        return new DRepUpdate(drep_credential, anchor);
    }
    serialize(writer) {
        this._drep_credential.serialize(writer);
        if (this._anchor == null) {
            writer.writeNull();
        }
        else {
            this._anchor.serialize(writer);
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["DRepUpdate"]) {
        let reader = new CBORReader(data);
        return DRepUpdate.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["DRepUpdate"]) {
        return DRepUpdate.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return DRepUpdate.from_bytes(this.to_bytes(), path);
    }
    static new(drep_credential) {
        return new DRepUpdate(drep_credential, undefined);
    }
    static new_with_anchor(drep_credential, anchor) {
        return new DRepUpdate(drep_credential, anchor);
    }
}
export class DRepVotingThresholds {
    _motion_no_confidence;
    _committee_normal;
    _committee_no_confidence;
    _update_constitution;
    _hard_fork_initiation;
    _pp_network_group;
    _pp_economic_group;
    _pp_technical_group;
    _pp_governance_group;
    _treasury_withdrawal;
    constructor(motion_no_confidence, committee_normal, committee_no_confidence, update_constitution, hard_fork_initiation, pp_network_group, pp_economic_group, pp_technical_group, pp_governance_group, treasury_withdrawal) {
        this._motion_no_confidence = motion_no_confidence;
        this._committee_normal = committee_normal;
        this._committee_no_confidence = committee_no_confidence;
        this._update_constitution = update_constitution;
        this._hard_fork_initiation = hard_fork_initiation;
        this._pp_network_group = pp_network_group;
        this._pp_economic_group = pp_economic_group;
        this._pp_technical_group = pp_technical_group;
        this._pp_governance_group = pp_governance_group;
        this._treasury_withdrawal = treasury_withdrawal;
    }
    static new(motion_no_confidence, committee_normal, committee_no_confidence, update_constitution, hard_fork_initiation, pp_network_group, pp_economic_group, pp_technical_group, pp_governance_group, treasury_withdrawal) {
        return new DRepVotingThresholds(motion_no_confidence, committee_normal, committee_no_confidence, update_constitution, hard_fork_initiation, pp_network_group, pp_economic_group, pp_technical_group, pp_governance_group, treasury_withdrawal);
    }
    motion_no_confidence() {
        return this._motion_no_confidence;
    }
    set_motion_no_confidence(motion_no_confidence) {
        this._motion_no_confidence = motion_no_confidence;
    }
    committee_normal() {
        return this._committee_normal;
    }
    set_committee_normal(committee_normal) {
        this._committee_normal = committee_normal;
    }
    committee_no_confidence() {
        return this._committee_no_confidence;
    }
    set_committee_no_confidence(committee_no_confidence) {
        this._committee_no_confidence = committee_no_confidence;
    }
    update_constitution() {
        return this._update_constitution;
    }
    set_update_constitution(update_constitution) {
        this._update_constitution = update_constitution;
    }
    hard_fork_initiation() {
        return this._hard_fork_initiation;
    }
    set_hard_fork_initiation(hard_fork_initiation) {
        this._hard_fork_initiation = hard_fork_initiation;
    }
    pp_network_group() {
        return this._pp_network_group;
    }
    set_pp_network_group(pp_network_group) {
        this._pp_network_group = pp_network_group;
    }
    pp_economic_group() {
        return this._pp_economic_group;
    }
    set_pp_economic_group(pp_economic_group) {
        this._pp_economic_group = pp_economic_group;
    }
    pp_technical_group() {
        return this._pp_technical_group;
    }
    set_pp_technical_group(pp_technical_group) {
        this._pp_technical_group = pp_technical_group;
    }
    pp_governance_group() {
        return this._pp_governance_group;
    }
    set_pp_governance_group(pp_governance_group) {
        this._pp_governance_group = pp_governance_group;
    }
    treasury_withdrawal() {
        return this._treasury_withdrawal;
    }
    set_treasury_withdrawal(treasury_withdrawal) {
        this._treasury_withdrawal = treasury_withdrawal;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 10) {
            throw new Error("Insufficient number of fields in record. Expected at least 10. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const motion_no_confidence_path = [
            ...path,
            "UnitInterval(motion_no_confidence)",
        ];
        let motion_no_confidence = UnitInterval.deserialize(reader, motion_no_confidence_path);
        const committee_normal_path = [...path, "UnitInterval(committee_normal)"];
        let committee_normal = UnitInterval.deserialize(reader, committee_normal_path);
        const committee_no_confidence_path = [
            ...path,
            "UnitInterval(committee_no_confidence)",
        ];
        let committee_no_confidence = UnitInterval.deserialize(reader, committee_no_confidence_path);
        const update_constitution_path = [
            ...path,
            "UnitInterval(update_constitution)",
        ];
        let update_constitution = UnitInterval.deserialize(reader, update_constitution_path);
        const hard_fork_initiation_path = [
            ...path,
            "UnitInterval(hard_fork_initiation)",
        ];
        let hard_fork_initiation = UnitInterval.deserialize(reader, hard_fork_initiation_path);
        const pp_network_group_path = [...path, "UnitInterval(pp_network_group)"];
        let pp_network_group = UnitInterval.deserialize(reader, pp_network_group_path);
        const pp_economic_group_path = [...path, "UnitInterval(pp_economic_group)"];
        let pp_economic_group = UnitInterval.deserialize(reader, pp_economic_group_path);
        const pp_technical_group_path = [
            ...path,
            "UnitInterval(pp_technical_group)",
        ];
        let pp_technical_group = UnitInterval.deserialize(reader, pp_technical_group_path);
        const pp_governance_group_path = [
            ...path,
            "UnitInterval(pp_governance_group)",
        ];
        let pp_governance_group = UnitInterval.deserialize(reader, pp_governance_group_path);
        const treasury_withdrawal_path = [
            ...path,
            "UnitInterval(treasury_withdrawal)",
        ];
        let treasury_withdrawal = UnitInterval.deserialize(reader, treasury_withdrawal_path);
        return new DRepVotingThresholds(motion_no_confidence, committee_normal, committee_no_confidence, update_constitution, hard_fork_initiation, pp_network_group, pp_economic_group, pp_technical_group, pp_governance_group, treasury_withdrawal);
    }
    serialize(writer) {
        let arrayLen = 10;
        writer.writeArrayTag(arrayLen);
        this._motion_no_confidence.serialize(writer);
        this._committee_normal.serialize(writer);
        this._committee_no_confidence.serialize(writer);
        this._update_constitution.serialize(writer);
        this._hard_fork_initiation.serialize(writer);
        this._pp_network_group.serialize(writer);
        this._pp_economic_group.serialize(writer);
        this._pp_technical_group.serialize(writer);
        this._pp_governance_group.serialize(writer);
        this._treasury_withdrawal.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["DRepVotingThresholds"]) {
        let reader = new CBORReader(data);
        return DRepVotingThresholds.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["DRepVotingThresholds"]) {
        return DRepVotingThresholds.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return DRepVotingThresholds.from_bytes(this.to_bytes(), path);
    }
}
export class Data {
    inner;
    constructor(inner) {
        this.inner = inner;
    }
    static new(inner) {
        return new Data(inner);
    }
    encoded_plutus_data() {
        return this.inner;
    }
    static deserialize(reader, path = ["Data"]) {
        let taggedTag = reader.readTaggedTag(path);
        if (taggedTag != 24) {
            throw new Error("Expected tag 24, got " + taggedTag + " (at " + path + ")");
        }
        return Data.deserializeInner(reader, path);
    }
    static deserializeInner(reader, path) {
        return new Data(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeTaggedTag(24);
        this.serializeInner(writer);
    }
    serializeInner(writer) {
        writer.writeBytes(this.inner);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Data"]) {
        let reader = new CBORReader(data);
        return Data.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Data"]) {
        return Data.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Data.from_bytes(this.to_bytes(), path);
    }
}
export class DataCost {
    _coins_per_byte;
    constructor(coins_per_byte) {
        this._coins_per_byte = coins_per_byte;
    }
    static new(coins_per_byte) {
        return new DataCost(coins_per_byte);
    }
    coins_per_byte() {
        return this._coins_per_byte;
    }
    set_coins_per_byte(coins_per_byte) {
        this._coins_per_byte = coins_per_byte;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 1) {
            throw new Error("Insufficient number of fields in record. Expected at least 1. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const coins_per_byte_path = [...path, "BigNum(coins_per_byte)"];
        let coins_per_byte = BigNum.deserialize(reader, coins_per_byte_path);
        return new DataCost(coins_per_byte);
    }
    serialize(writer) {
        let arrayLen = 1;
        writer.writeArrayTag(arrayLen);
        this._coins_per_byte.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["DataCost"]) {
        let reader = new CBORReader(data);
        return DataCost.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["DataCost"]) {
        return DataCost.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return DataCost.from_bytes(this.to_bytes(), path);
    }
}
export class DataHash {
    inner;
    constructor(inner) {
        if (inner.length != 32)
            throw new Error("Expected length to be 32");
        this.inner = inner;
    }
    static new(inner) {
        return new DataHash(inner);
    }
    static from_bech32(bech_str) {
        let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
        let words = decoded.words;
        let bytesArray = bech32.fromWords(words);
        let bytes = new Uint8Array(bytesArray);
        return new DataHash(bytes);
    }
    to_bech32(prefix) {
        let bytes = this.to_bytes();
        let words = bech32.toWords(bytes);
        return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
    }
    // no-op
    free() { }
    static from_bytes(data) {
        return new DataHash(data);
    }
    static from_hex(hex_str) {
        return DataHash.from_bytes(hexToBytes(hex_str));
    }
    to_bytes() {
        return this.inner;
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone() {
        return DataHash.from_bytes(this.to_bytes());
    }
    static deserialize(reader, path) {
        return new DataHash(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeBytes(this.inner);
    }
}
export var DataOptionKind;
(function (DataOptionKind) {
    DataOptionKind[DataOptionKind["DataHash"] = 0] = "DataHash";
    DataOptionKind[DataOptionKind["Data"] = 1] = "Data";
})(DataOptionKind || (DataOptionKind = {}));
export class DataOption {
    variant;
    constructor(variant) {
        this.variant = variant;
    }
    static new_hash(hash) {
        return new DataOption({ kind: 0, value: hash });
    }
    static new_data(data) {
        return new DataOption({ kind: 1, value: data });
    }
    as_hash() {
        if (this.variant.kind == 0)
            return this.variant.value;
    }
    as_data() {
        if (this.variant.kind == 1)
            return this.variant.value;
    }
    kind() {
        return this.variant.kind;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        let tag = Number(reader.readUint(path));
        let variant;
        switch (tag) {
            case 0:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode DataHash");
                }
                variant = {
                    kind: 0,
                    value: DataHash.deserialize(reader, [...path, "DataHash"]),
                };
                break;
            case 1:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode Data");
                }
                variant = {
                    kind: 1,
                    value: Data.deserialize(reader, [...path, "Data"]),
                };
                break;
            default:
                throw new Error("Unexpected tag for DataOption: " +
                    tag +
                    "(at " +
                    path.join("/") +
                    ")");
        }
        if (len == null) {
            reader.readBreak();
        }
        return new DataOption(variant);
    }
    serialize(writer) {
        switch (this.variant.kind) {
            case 0:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(0));
                this.variant.value.serialize(writer);
                break;
            case 1:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(1));
                this.variant.value.serialize(writer);
                break;
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["DataOption"]) {
        let reader = new CBORReader(data);
        return DataOption.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["DataOption"]) {
        return DataOption.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return DataOption.from_bytes(this.to_bytes(), path);
    }
}
export var DatumSourceKind;
(function (DatumSourceKind) {
    DatumSourceKind[DatumSourceKind["PlutusData"] = 0] = "PlutusData";
    DatumSourceKind[DatumSourceKind["TransactionInput"] = 1] = "TransactionInput";
})(DatumSourceKind || (DatumSourceKind = {}));
export class DatumSource {
    variant;
    constructor(variant) {
        this.variant = variant;
    }
    static new_datum(datum) {
        return new DatumSource({ kind: 0, value: datum });
    }
    static new_ref_input(ref_input) {
        return new DatumSource({ kind: 1, value: ref_input });
    }
    as_datum() {
        if (this.variant.kind == 0)
            return this.variant.value;
    }
    as_ref_input() {
        if (this.variant.kind == 1)
            return this.variant.value;
    }
    kind() {
        return this.variant.kind;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        let tag = Number(reader.readUint(path));
        let variant;
        switch (tag) {
            case 0:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode PlutusData");
                }
                variant = {
                    kind: 0,
                    value: PlutusData.deserialize(reader, [...path, "PlutusData"]),
                };
                break;
            case 1:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode TransactionInput");
                }
                variant = {
                    kind: 1,
                    value: TransactionInput.deserialize(reader, [
                        ...path,
                        "TransactionInput",
                    ]),
                };
                break;
            default:
                throw new Error("Unexpected tag for DatumSource: " +
                    tag +
                    "(at " +
                    path.join("/") +
                    ")");
        }
        if (len == null) {
            reader.readBreak();
        }
        return new DatumSource(variant);
    }
    serialize(writer) {
        switch (this.variant.kind) {
            case 0:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(0));
                this.variant.value.serialize(writer);
                break;
            case 1:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(1));
                this.variant.value.serialize(writer);
                break;
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["DatumSource"]) {
        let reader = new CBORReader(data);
        return DatumSource.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["DatumSource"]) {
        return DatumSource.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return DatumSource.from_bytes(this.to_bytes(), path);
    }
    static new(datum) {
        return DatumSource.new_datum(datum);
    }
}
export class Ed25519KeyHash {
    inner;
    constructor(inner) {
        if (inner.length != 28)
            throw new Error("Expected length to be 28");
        this.inner = inner;
    }
    static new(inner) {
        return new Ed25519KeyHash(inner);
    }
    static from_bech32(bech_str) {
        let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
        let words = decoded.words;
        let bytesArray = bech32.fromWords(words);
        let bytes = new Uint8Array(bytesArray);
        return new Ed25519KeyHash(bytes);
    }
    to_bech32(prefix) {
        let bytes = this.to_bytes();
        let words = bech32.toWords(bytes);
        return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
    }
    // no-op
    free() { }
    static from_bytes(data) {
        return new Ed25519KeyHash(data);
    }
    static from_hex(hex_str) {
        return Ed25519KeyHash.from_bytes(hexToBytes(hex_str));
    }
    to_bytes() {
        return this.inner;
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone() {
        return Ed25519KeyHash.from_bytes(this.to_bytes());
    }
    static deserialize(reader, path) {
        return new Ed25519KeyHash(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeBytes(this.inner);
    }
}
export class Ed25519KeyHashes {
    items;
    definiteEncoding;
    nonEmptyTag;
    setItems(items) {
        this.items = items;
    }
    constructor(definiteEncoding = true, nonEmptyTag = true) {
        this.items = [];
        this.definiteEncoding = definiteEncoding;
        this.nonEmptyTag = nonEmptyTag;
    }
    static new() {
        return new Ed25519KeyHashes();
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        if (this.contains(elem))
            return true;
        this.items.push(elem);
        return false;
    }
    contains(elem) {
        for (let item of this.items) {
            if (arrayEq(item.to_bytes(), elem.to_bytes())) {
                return true;
            }
        }
        return false;
    }
    static deserialize(reader, path) {
        let nonEmptyTag = false;
        if (reader.peekType(path) == "tagged") {
            let tag = reader.readTaggedTag(path);
            if (tag != 258) {
                throw new Error("Expected tag 258. Got " + tag);
            }
            else {
                nonEmptyTag = true;
            }
        }
        const { items, definiteEncoding } = reader.readArray((reader, idx) => Ed25519KeyHash.deserialize(reader, [...path, "Ed25519KeyHash#" + idx]), path);
        let ret = new Ed25519KeyHashes(definiteEncoding, nonEmptyTag);
        ret.setItems(items);
        return ret;
    }
    serialize(writer) {
        if (this.nonEmptyTag) {
            writer.writeTaggedTag(258);
        }
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Ed25519KeyHashes"]) {
        let reader = new CBORReader(data);
        return Ed25519KeyHashes.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Ed25519KeyHashes"]) {
        return Ed25519KeyHashes.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Ed25519KeyHashes.from_bytes(this.to_bytes(), path);
    }
}
export class Ed25519Signature {
    inner;
    constructor(inner) {
        if (inner.length != 64)
            throw new Error("Expected length to be 64");
        this.inner = inner;
    }
    static new(inner) {
        return new Ed25519Signature(inner);
    }
    // no-op
    free() { }
    static from_bytes(data) {
        return new Ed25519Signature(data);
    }
    static from_hex(hex_str) {
        return Ed25519Signature.from_bytes(hexToBytes(hex_str));
    }
    to_bytes() {
        return this.inner;
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone() {
        return Ed25519Signature.from_bytes(this.to_bytes());
    }
    static deserialize(reader, path) {
        return new Ed25519Signature(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeBytes(this.inner);
    }
    static _BECH32_HRP = "ed25519_sig";
    static from_bech32(bech_str) {
        let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
        let words = decoded.words;
        let bytesArray = bech32.fromWords(words);
        let bytes = new Uint8Array(bytesArray);
        if (decoded.prefix == Ed25519Signature._BECH32_HRP) {
            return new Ed25519Signature(bytes);
        }
        else {
            throw new Error("Invalid prefix for Ed25519Signature: " + decoded.prefix);
        }
    }
    to_bech32() {
        let prefix = Ed25519Signature._BECH32_HRP;
        return bech32.encode(prefix, bech32.toWords(this.inner), Number.MAX_SAFE_INTEGER);
    }
}
export class ExUnitPrices {
    _mem_price;
    _step_price;
    constructor(mem_price, step_price) {
        this._mem_price = mem_price;
        this._step_price = step_price;
    }
    static new(mem_price, step_price) {
        return new ExUnitPrices(mem_price, step_price);
    }
    mem_price() {
        return this._mem_price;
    }
    set_mem_price(mem_price) {
        this._mem_price = mem_price;
    }
    step_price() {
        return this._step_price;
    }
    set_step_price(step_price) {
        this._step_price = step_price;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 2) {
            throw new Error("Insufficient number of fields in record. Expected at least 2. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const mem_price_path = [...path, "UnitInterval(mem_price)"];
        let mem_price = UnitInterval.deserialize(reader, mem_price_path);
        const step_price_path = [...path, "UnitInterval(step_price)"];
        let step_price = UnitInterval.deserialize(reader, step_price_path);
        return new ExUnitPrices(mem_price, step_price);
    }
    serialize(writer) {
        let arrayLen = 2;
        writer.writeArrayTag(arrayLen);
        this._mem_price.serialize(writer);
        this._step_price.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["ExUnitPrices"]) {
        let reader = new CBORReader(data);
        return ExUnitPrices.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["ExUnitPrices"]) {
        return ExUnitPrices.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return ExUnitPrices.from_bytes(this.to_bytes(), path);
    }
}
export class ExUnits {
    _mem;
    _steps;
    constructor(mem, steps) {
        this._mem = mem;
        this._steps = steps;
    }
    static new(mem, steps) {
        return new ExUnits(mem, steps);
    }
    mem() {
        return this._mem;
    }
    set_mem(mem) {
        this._mem = mem;
    }
    steps() {
        return this._steps;
    }
    set_steps(steps) {
        this._steps = steps;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 2) {
            throw new Error("Insufficient number of fields in record. Expected at least 2. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const mem_path = [...path, "BigNum(mem)"];
        let mem = BigNum.deserialize(reader, mem_path);
        const steps_path = [...path, "BigNum(steps)"];
        let steps = BigNum.deserialize(reader, steps_path);
        return new ExUnits(mem, steps);
    }
    serialize(writer) {
        let arrayLen = 2;
        writer.writeArrayTag(arrayLen);
        this._mem.serialize(writer);
        this._steps.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["ExUnits"]) {
        let reader = new CBORReader(data);
        return ExUnits.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["ExUnits"]) {
        return ExUnits.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return ExUnits.from_bytes(this.to_bytes(), path);
    }
}
export class GeneralTransactionMetadata {
    _items;
    constructor(items) {
        this._items = items;
    }
    static new() {
        return new GeneralTransactionMetadata([]);
    }
    len() {
        return this._items.length;
    }
    insert(key, value) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry != null) {
            let ret = entry[1];
            entry[1] = value;
            return ret;
        }
        this._items.push([key, value]);
        return undefined;
    }
    get(key) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry == null)
            return undefined;
        return entry[1];
    }
    _remove_many(keys) {
        this._items = this._items.filter(([k, _v]) => keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())));
    }
    keys() {
        let keys = TransactionMetadatumLabels.new();
        for (let [key, _] of this._items)
            keys.add(key);
        return keys;
    }
    static deserialize(reader, path) {
        let ret = new GeneralTransactionMetadata([]);
        reader.readMap((reader, idx) => ret.insert(BigNum.deserialize(reader, [...path, "BigNum#" + idx]), TransactionMetadatum.deserialize(reader, [
            ...path,
            "TransactionMetadatum#" + idx,
        ])), path);
        return ret;
    }
    serialize(writer) {
        writer.writeMap(this._items, (writer, x) => {
            x[0].serialize(writer);
            x[1].serialize(writer);
        });
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["GeneralTransactionMetadata"]) {
        let reader = new CBORReader(data);
        return GeneralTransactionMetadata.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["GeneralTransactionMetadata"]) {
        return GeneralTransactionMetadata.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return GeneralTransactionMetadata.from_bytes(this.to_bytes(), path);
    }
}
export class GenesisDelegateHash {
    inner;
    constructor(inner) {
        if (inner.length != 28)
            throw new Error("Expected length to be 28");
        this.inner = inner;
    }
    static new(inner) {
        return new GenesisDelegateHash(inner);
    }
    static from_bech32(bech_str) {
        let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
        let words = decoded.words;
        let bytesArray = bech32.fromWords(words);
        let bytes = new Uint8Array(bytesArray);
        return new GenesisDelegateHash(bytes);
    }
    to_bech32(prefix) {
        let bytes = this.to_bytes();
        let words = bech32.toWords(bytes);
        return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
    }
    // no-op
    free() { }
    static from_bytes(data) {
        return new GenesisDelegateHash(data);
    }
    static from_hex(hex_str) {
        return GenesisDelegateHash.from_bytes(hexToBytes(hex_str));
    }
    to_bytes() {
        return this.inner;
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone() {
        return GenesisDelegateHash.from_bytes(this.to_bytes());
    }
    static deserialize(reader, path) {
        return new GenesisDelegateHash(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeBytes(this.inner);
    }
}
export class GenesisHash {
    inner;
    constructor(inner) {
        if (inner.length != 28)
            throw new Error("Expected length to be 28");
        this.inner = inner;
    }
    static new(inner) {
        return new GenesisHash(inner);
    }
    static from_bech32(bech_str) {
        let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
        let words = decoded.words;
        let bytesArray = bech32.fromWords(words);
        let bytes = new Uint8Array(bytesArray);
        return new GenesisHash(bytes);
    }
    to_bech32(prefix) {
        let bytes = this.to_bytes();
        let words = bech32.toWords(bytes);
        return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
    }
    // no-op
    free() { }
    static from_bytes(data) {
        return new GenesisHash(data);
    }
    static from_hex(hex_str) {
        return GenesisHash.from_bytes(hexToBytes(hex_str));
    }
    to_bytes() {
        return this.inner;
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone() {
        return GenesisHash.from_bytes(this.to_bytes());
    }
    static deserialize(reader, path) {
        return new GenesisHash(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeBytes(this.inner);
    }
}
export class GenesisHashes {
    items;
    definiteEncoding;
    constructor(items, definiteEncoding = true) {
        this.items = items;
        this.definiteEncoding = definiteEncoding;
    }
    static new() {
        return new GenesisHashes([]);
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        this.items.push(elem);
    }
    static deserialize(reader, path) {
        const { items, definiteEncoding } = reader.readArray((reader, idx) => GenesisHash.deserialize(reader, [...path, "Elem#" + idx]), path);
        return new GenesisHashes(items, definiteEncoding);
    }
    serialize(writer) {
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["GenesisHashes"]) {
        let reader = new CBORReader(data);
        return GenesisHashes.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["GenesisHashes"]) {
        return GenesisHashes.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return GenesisHashes.from_bytes(this.to_bytes(), path);
    }
}
export var GovernanceActionKind;
(function (GovernanceActionKind) {
    GovernanceActionKind[GovernanceActionKind["ParameterChangeAction"] = 0] = "ParameterChangeAction";
    GovernanceActionKind[GovernanceActionKind["HardForkInitiationAction"] = 1] = "HardForkInitiationAction";
    GovernanceActionKind[GovernanceActionKind["TreasuryWithdrawalsAction"] = 2] = "TreasuryWithdrawalsAction";
    GovernanceActionKind[GovernanceActionKind["NoConfidenceAction"] = 3] = "NoConfidenceAction";
    GovernanceActionKind[GovernanceActionKind["UpdateCommitteeAction"] = 4] = "UpdateCommitteeAction";
    GovernanceActionKind[GovernanceActionKind["NewConstitutionAction"] = 5] = "NewConstitutionAction";
    GovernanceActionKind[GovernanceActionKind["InfoAction"] = 6] = "InfoAction";
})(GovernanceActionKind || (GovernanceActionKind = {}));
export class GovernanceAction {
    variant;
    constructor(variant) {
        this.variant = variant;
    }
    static new_parameter_change_action(parameter_change_action) {
        return new GovernanceAction({ kind: 0, value: parameter_change_action });
    }
    static new_hard_fork_initiation_action(hard_fork_initiation_action) {
        return new GovernanceAction({
            kind: 1,
            value: hard_fork_initiation_action,
        });
    }
    static new_treasury_withdrawals_action(treasury_withdrawals_action) {
        return new GovernanceAction({
            kind: 2,
            value: treasury_withdrawals_action,
        });
    }
    static new_no_confidence_action(no_confidence_action) {
        return new GovernanceAction({ kind: 3, value: no_confidence_action });
    }
    static new_new_committee_action(new_committee_action) {
        return new GovernanceAction({ kind: 4, value: new_committee_action });
    }
    static new_new_constitution_action(new_constitution_action) {
        return new GovernanceAction({ kind: 5, value: new_constitution_action });
    }
    static new_info_action(info_action) {
        return new GovernanceAction({ kind: 6, value: info_action });
    }
    as_parameter_change_action() {
        if (this.variant.kind == 0)
            return this.variant.value;
    }
    as_hard_fork_initiation_action() {
        if (this.variant.kind == 1)
            return this.variant.value;
    }
    as_treasury_withdrawals_action() {
        if (this.variant.kind == 2)
            return this.variant.value;
    }
    as_no_confidence_action() {
        if (this.variant.kind == 3)
            return this.variant.value;
    }
    as_new_committee_action() {
        if (this.variant.kind == 4)
            return this.variant.value;
    }
    as_new_constitution_action() {
        if (this.variant.kind == 5)
            return this.variant.value;
    }
    as_info_action() {
        if (this.variant.kind == 6)
            return this.variant.value;
    }
    kind() {
        return this.variant.kind;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        let tag = Number(reader.readUint(path));
        let variant;
        switch (tag) {
            case 0:
                if (len != null && len - 1 != 3) {
                    throw new Error("Expected 3 items to decode ParameterChangeAction");
                }
                variant = {
                    kind: 0,
                    value: ParameterChangeAction.deserialize(reader, [
                        ...path,
                        "ParameterChangeAction",
                    ]),
                };
                break;
            case 1:
                if (len != null && len - 1 != 2) {
                    throw new Error("Expected 2 items to decode HardForkInitiationAction");
                }
                variant = {
                    kind: 1,
                    value: HardForkInitiationAction.deserialize(reader, [
                        ...path,
                        "HardForkInitiationAction",
                    ]),
                };
                break;
            case 2:
                if (len != null && len - 1 != 2) {
                    throw new Error("Expected 2 items to decode TreasuryWithdrawalsAction");
                }
                variant = {
                    kind: 2,
                    value: TreasuryWithdrawalsAction.deserialize(reader, [
                        ...path,
                        "TreasuryWithdrawalsAction",
                    ]),
                };
                break;
            case 3:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode NoConfidenceAction");
                }
                variant = {
                    kind: 3,
                    value: NoConfidenceAction.deserialize(reader, [
                        ...path,
                        "NoConfidenceAction",
                    ]),
                };
                break;
            case 4:
                if (len != null && len - 1 != 4) {
                    throw new Error("Expected 4 items to decode UpdateCommitteeAction");
                }
                variant = {
                    kind: 4,
                    value: UpdateCommitteeAction.deserialize(reader, [
                        ...path,
                        "UpdateCommitteeAction",
                    ]),
                };
                break;
            case 5:
                if (len != null && len - 1 != 2) {
                    throw new Error("Expected 2 items to decode NewConstitutionAction");
                }
                variant = {
                    kind: 5,
                    value: NewConstitutionAction.deserialize(reader, [
                        ...path,
                        "NewConstitutionAction",
                    ]),
                };
                break;
            case 6:
                if (len != null && len - 1 != 0) {
                    throw new Error("Expected 0 items to decode InfoAction");
                }
                variant = {
                    kind: 6,
                    value: InfoAction.deserialize(reader, [...path, "InfoAction"]),
                };
                break;
            default:
                throw new Error("Unexpected tag for GovernanceAction: " +
                    tag +
                    "(at " +
                    path.join("/") +
                    ")");
        }
        if (len == null) {
            reader.readBreak();
        }
        return new GovernanceAction(variant);
    }
    serialize(writer) {
        switch (this.variant.kind) {
            case 0:
                writer.writeArrayTag(4);
                writer.writeInt(BigInt(0));
                this.variant.value.serialize(writer);
                break;
            case 1:
                writer.writeArrayTag(3);
                writer.writeInt(BigInt(1));
                this.variant.value.serialize(writer);
                break;
            case 2:
                writer.writeArrayTag(3);
                writer.writeInt(BigInt(2));
                this.variant.value.serialize(writer);
                break;
            case 3:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(3));
                this.variant.value.serialize(writer);
                break;
            case 4:
                writer.writeArrayTag(5);
                writer.writeInt(BigInt(4));
                this.variant.value.serialize(writer);
                break;
            case 5:
                writer.writeArrayTag(3);
                writer.writeInt(BigInt(5));
                this.variant.value.serialize(writer);
                break;
            case 6:
                writer.writeArrayTag(1);
                writer.writeInt(BigInt(6));
                this.variant.value.serialize(writer);
                break;
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["GovernanceAction"]) {
        let reader = new CBORReader(data);
        return GovernanceAction.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["GovernanceAction"]) {
        return GovernanceAction.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return GovernanceAction.from_bytes(this.to_bytes(), path);
    }
}
export class GovernanceActionId {
    _transaction_id;
    _index;
    constructor(transaction_id, index) {
        this._transaction_id = transaction_id;
        this._index = index;
    }
    static new(transaction_id, index) {
        return new GovernanceActionId(transaction_id, index);
    }
    transaction_id() {
        return this._transaction_id;
    }
    set_transaction_id(transaction_id) {
        this._transaction_id = transaction_id;
    }
    index() {
        return this._index;
    }
    set_index(index) {
        this._index = index;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 2) {
            throw new Error("Insufficient number of fields in record. Expected at least 2. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const transaction_id_path = [...path, "TransactionHash(transaction_id)"];
        let transaction_id = TransactionHash.deserialize(reader, transaction_id_path);
        const index_path = [...path, "number(index)"];
        let index = Number(reader.readInt(index_path));
        return new GovernanceActionId(transaction_id, index);
    }
    serialize(writer) {
        let arrayLen = 2;
        writer.writeArrayTag(arrayLen);
        this._transaction_id.serialize(writer);
        writer.writeInt(BigInt(this._index));
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["GovernanceActionId"]) {
        let reader = new CBORReader(data);
        return GovernanceActionId.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["GovernanceActionId"]) {
        return GovernanceActionId.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return GovernanceActionId.from_bytes(this.to_bytes(), path);
    }
}
export class GovernanceActionIds {
    items;
    definiteEncoding;
    constructor(items, definiteEncoding = true) {
        this.items = items;
        this.definiteEncoding = definiteEncoding;
    }
    static new() {
        return new GovernanceActionIds([]);
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        this.items.push(elem);
    }
    static deserialize(reader, path) {
        const { items, definiteEncoding } = reader.readArray((reader, idx) => GovernanceActionId.deserialize(reader, [...path, "Elem#" + idx]), path);
        return new GovernanceActionIds(items, definiteEncoding);
    }
    serialize(writer) {
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["GovernanceActionIds"]) {
        let reader = new CBORReader(data);
        return GovernanceActionIds.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["GovernanceActionIds"]) {
        return GovernanceActionIds.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return GovernanceActionIds.from_bytes(this.to_bytes(), path);
    }
}
export class GovernanceActions {
    _items;
    constructor(items) {
        this._items = items;
    }
    static new() {
        return new GovernanceActions([]);
    }
    len() {
        return this._items.length;
    }
    insert(key, value) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry != null) {
            let ret = entry[1];
            entry[1] = value;
            return ret;
        }
        this._items.push([key, value]);
        return undefined;
    }
    get(key) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry == null)
            return undefined;
        return entry[1];
    }
    _remove_many(keys) {
        this._items = this._items.filter(([k, _v]) => keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())));
    }
    keys() {
        let keys = GovernanceActionIds.new();
        for (let [key, _] of this._items)
            keys.add(key);
        return keys;
    }
    static deserialize(reader, path) {
        let ret = new GovernanceActions([]);
        reader.readMap((reader, idx) => ret.insert(GovernanceActionId.deserialize(reader, [
            ...path,
            "GovernanceActionId#" + idx,
        ]), VotingProcedure.deserialize(reader, [
            ...path,
            "VotingProcedure#" + idx,
        ])), path);
        return ret;
    }
    serialize(writer) {
        writer.writeMap(this._items, (writer, x) => {
            x[0].serialize(writer);
            x[1].serialize(writer);
        });
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["GovernanceActions"]) {
        let reader = new CBORReader(data);
        return GovernanceActions.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["GovernanceActions"]) {
        return GovernanceActions.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return GovernanceActions.from_bytes(this.to_bytes(), path);
    }
}
export class HardForkInitiationAction {
    _gov_action_id;
    _protocol_version;
    constructor(gov_action_id, protocol_version) {
        this._gov_action_id = gov_action_id;
        this._protocol_version = protocol_version;
    }
    static new_with_action_id(gov_action_id, protocol_version) {
        return new HardForkInitiationAction(gov_action_id, protocol_version);
    }
    gov_action_id() {
        return this._gov_action_id;
    }
    set_gov_action_id(gov_action_id) {
        this._gov_action_id = gov_action_id;
    }
    protocol_version() {
        return this._protocol_version;
    }
    set_protocol_version(protocol_version) {
        this._protocol_version = protocol_version;
    }
    static deserialize(reader, path) {
        let gov_action_id = reader.readNullable((r) => GovernanceActionId.deserialize(r, [...path, "gov_action_id"]), path) ?? undefined;
        let protocol_version = ProtocolVersion.deserialize(reader, [
            ...path,
            "protocol_version",
        ]);
        return new HardForkInitiationAction(gov_action_id, protocol_version);
    }
    serialize(writer) {
        if (this._gov_action_id == null) {
            writer.writeNull();
        }
        else {
            this._gov_action_id.serialize(writer);
        }
        this._protocol_version.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["HardForkInitiationAction"]) {
        let reader = new CBORReader(data);
        return HardForkInitiationAction.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["HardForkInitiationAction"]) {
        return HardForkInitiationAction.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return HardForkInitiationAction.from_bytes(this.to_bytes(), path);
    }
    static new(protocol_version) {
        return new HardForkInitiationAction(undefined, protocol_version);
    }
}
export class Header {
    _header_body;
    _body_signature;
    constructor(header_body, body_signature) {
        this._header_body = header_body;
        this._body_signature = body_signature;
    }
    static new(header_body, body_signature) {
        return new Header(header_body, body_signature);
    }
    header_body() {
        return this._header_body;
    }
    set_header_body(header_body) {
        this._header_body = header_body;
    }
    body_signature() {
        return this._body_signature;
    }
    set_body_signature(body_signature) {
        this._body_signature = body_signature;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 2) {
            throw new Error("Insufficient number of fields in record. Expected at least 2. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const header_body_path = [...path, "HeaderBody(header_body)"];
        let header_body = HeaderBody.deserialize(reader, header_body_path);
        const body_signature_path = [...path, "KESSignature(body_signature)"];
        let body_signature = KESSignature.deserialize(reader, body_signature_path);
        return new Header(header_body, body_signature);
    }
    serialize(writer) {
        let arrayLen = 2;
        writer.writeArrayTag(arrayLen);
        this._header_body.serialize(writer);
        this._body_signature.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Header"]) {
        let reader = new CBORReader(data);
        return Header.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Header"]) {
        return Header.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Header.from_bytes(this.to_bytes(), path);
    }
}
export class HeaderBody {
    _block_number;
    _slot;
    _prev_hash;
    _issuer_vkey;
    _vrf_vkey;
    _vrf_result;
    _block_body_size;
    _block_body_hash;
    _operational_cert;
    _protocol_version;
    constructor(block_number, slot, prev_hash, issuer_vkey, vrf_vkey, vrf_result, block_body_size, block_body_hash, operational_cert, protocol_version) {
        this._block_number = block_number;
        this._slot = slot;
        this._prev_hash = prev_hash;
        this._issuer_vkey = issuer_vkey;
        this._vrf_vkey = vrf_vkey;
        this._vrf_result = vrf_result;
        this._block_body_size = block_body_size;
        this._block_body_hash = block_body_hash;
        this._operational_cert = operational_cert;
        this._protocol_version = protocol_version;
    }
    static new_headerbody(block_number, slot, prev_hash, issuer_vkey, vrf_vkey, vrf_result, block_body_size, block_body_hash, operational_cert, protocol_version) {
        return new HeaderBody(block_number, slot, prev_hash, issuer_vkey, vrf_vkey, vrf_result, block_body_size, block_body_hash, operational_cert, protocol_version);
    }
    block_number() {
        return this._block_number;
    }
    set_block_number(block_number) {
        this._block_number = block_number;
    }
    slot_bignum() {
        return this._slot;
    }
    set_slot(slot) {
        this._slot = slot;
    }
    prev_hash() {
        return this._prev_hash;
    }
    set_prev_hash(prev_hash) {
        this._prev_hash = prev_hash;
    }
    issuer_vkey() {
        return this._issuer_vkey;
    }
    set_issuer_vkey(issuer_vkey) {
        this._issuer_vkey = issuer_vkey;
    }
    vrf_vkey() {
        return this._vrf_vkey;
    }
    set_vrf_vkey(vrf_vkey) {
        this._vrf_vkey = vrf_vkey;
    }
    vrf_result() {
        return this._vrf_result;
    }
    set_vrf_result(vrf_result) {
        this._vrf_result = vrf_result;
    }
    block_body_size() {
        return this._block_body_size;
    }
    set_block_body_size(block_body_size) {
        this._block_body_size = block_body_size;
    }
    block_body_hash() {
        return this._block_body_hash;
    }
    set_block_body_hash(block_body_hash) {
        this._block_body_hash = block_body_hash;
    }
    operational_cert() {
        return this._operational_cert;
    }
    set_operational_cert(operational_cert) {
        this._operational_cert = operational_cert;
    }
    protocol_version() {
        return this._protocol_version;
    }
    set_protocol_version(protocol_version) {
        this._protocol_version = protocol_version;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 10) {
            throw new Error("Insufficient number of fields in record. Expected at least 10. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const block_number_path = [...path, "number(block_number)"];
        let block_number = Number(reader.readInt(block_number_path));
        const slot_path = [...path, "BigNum(slot)"];
        let slot = BigNum.deserialize(reader, slot_path);
        const prev_hash_path = [...path, "BlockHash(prev_hash)"];
        let prev_hash = reader.readNullable((r) => BlockHash.deserialize(r, prev_hash_path), path) ?? undefined;
        const issuer_vkey_path = [...path, "Vkey(issuer_vkey)"];
        let issuer_vkey = Vkey.deserialize(reader, issuer_vkey_path);
        const vrf_vkey_path = [...path, "VRFVKey(vrf_vkey)"];
        let vrf_vkey = VRFVKey.deserialize(reader, vrf_vkey_path);
        const vrf_result_path = [...path, "VRFCert(vrf_result)"];
        let vrf_result = VRFCert.deserialize(reader, vrf_result_path);
        const block_body_size_path = [...path, "number(block_body_size)"];
        let block_body_size = Number(reader.readInt(block_body_size_path));
        const block_body_hash_path = [...path, "BlockHash(block_body_hash)"];
        let block_body_hash = BlockHash.deserialize(reader, block_body_hash_path);
        const operational_cert_path = [
            ...path,
            "OperationalCert(operational_cert)",
        ];
        let operational_cert = OperationalCert.deserialize(reader, operational_cert_path);
        const protocol_version_path = [
            ...path,
            "ProtocolVersion(protocol_version)",
        ];
        let protocol_version = ProtocolVersion.deserialize(reader, protocol_version_path);
        return new HeaderBody(block_number, slot, prev_hash, issuer_vkey, vrf_vkey, vrf_result, block_body_size, block_body_hash, operational_cert, protocol_version);
    }
    serialize(writer) {
        let arrayLen = 10;
        writer.writeArrayTag(arrayLen);
        writer.writeInt(BigInt(this._block_number));
        this._slot.serialize(writer);
        if (this._prev_hash == null) {
            writer.writeNull();
        }
        else {
            this._prev_hash.serialize(writer);
        }
        this._issuer_vkey.serialize(writer);
        this._vrf_vkey.serialize(writer);
        this._vrf_result.serialize(writer);
        writer.writeInt(BigInt(this._block_body_size));
        this._block_body_hash.serialize(writer);
        this._operational_cert.serialize(writer);
        this._protocol_version.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["HeaderBody"]) {
        let reader = new CBORReader(data);
        return HeaderBody.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["HeaderBody"]) {
        return HeaderBody.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return HeaderBody.from_bytes(this.to_bytes(), path);
    }
    slot() {
        return this.slot_bignum()._to_number();
    }
    static new(block_number, slot, prev_hash, issuer_vkey, vrf_vkey, vrf_result, block_body_size, block_body_hash, operational_cert, protocol_version) {
        return new HeaderBody(block_number, BigNum._from_number(slot), prev_hash, issuer_vkey, vrf_vkey, vrf_result, block_body_size, block_body_hash, operational_cert, protocol_version);
    }
}
export class InfoAction {
    constructor() { }
    static new() {
        return new InfoAction();
    }
    static deserialize(reader, path) {
        return new InfoAction();
    }
    serialize(writer) { }
    // no-op
    free() { }
    static from_bytes(data, path = ["InfoAction"]) {
        let reader = new CBORReader(data);
        return InfoAction.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["InfoAction"]) {
        return InfoAction.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return InfoAction.from_bytes(this.to_bytes(), path);
    }
}
export class Int {
    inner;
    constructor(inner) {
        this.inner = inner;
    }
    toJsValue() {
        return this.inner;
    }
    static deserialize(reader, path) {
        return new Int(reader.readInt(path));
    }
    serialize(writer) {
        writer.writeInt(this.inner);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Int"]) {
        let reader = new CBORReader(data);
        return Int.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Int"]) {
        return Int.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Int.from_bytes(this.to_bytes(), path);
    }
    // Lifted from: https://doc.rust-lang.org/std/primitive.i32.html#associatedconstant.MAX
    static _maxI32() {
        return 2147483647;
    }
    // Lifted from: https://doc.rust-lang.org/std/primitive.i32.html#associatedconstant.MIN
    static _minI32() {
        return -2147483648;
    }
    static from_str(string) {
        return new Int(BigInt(string));
    }
    to_str() {
        return this.toJsValue().toString();
    }
    static new(x) {
        return new Int(x.toJsValue());
    }
    static new_negative(x) {
        return new Int(-1n * x.toJsValue());
    }
    static new_i32(x) {
        return new Int(BigInt(x));
    }
    is_positive() {
        return this.toJsValue() >= 0n;
    }
    as_positive() {
        return this.is_positive() ? new BigNum(this.toJsValue()) : undefined;
    }
    as_negative() {
        return !this.is_positive() ? new BigNum(-1n * this.toJsValue()) : undefined;
    }
    as_i32() {
        return this.as_i32_or_nothing();
    }
    as_i32_or_nothing() {
        let x = this.toJsValue();
        return x >= Int._minI32() && x <= Int._maxI32() ? Number(x) : undefined;
    }
    as_i32_or_fail() {
        let x = this.as_i32_or_nothing();
        if (x == null)
            throw new Error("Int out of i32 bounds");
        return x;
    }
}
export class InvalidTransactions {
    items;
    definiteEncoding;
    constructor(items, definiteEncoding = true) {
        this.items = items;
        this.definiteEncoding = definiteEncoding;
    }
    static new() {
        return new InvalidTransactions(new Uint32Array([]));
    }
    len() {
        return this.items.length;
    }
    static deserialize(reader, path) {
        const { items, definiteEncoding } = reader.readArray((reader, idx) => Number(reader.readUint([...path, "Byte#" + idx])), path);
        return new InvalidTransactions(new Uint32Array(items), definiteEncoding);
    }
    serialize(writer) {
        writer.writeArray(this.items, (writer, x) => writer.writeInt(BigInt(x)), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["InvalidTransactions"]) {
        let reader = new CBORReader(data);
        return InvalidTransactions.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["InvalidTransactions"]) {
        return InvalidTransactions.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return InvalidTransactions.from_bytes(this.to_bytes(), path);
    }
    as_uint32Array() {
        return this.items;
    }
}
export class Ipv4 {
    inner;
    constructor(inner) {
        if (inner.length != 4)
            throw new Error("Expected length to be 4");
        this.inner = inner;
    }
    static new(inner) {
        return new Ipv4(inner);
    }
    ip() {
        return this.inner;
    }
    static deserialize(reader, path) {
        return new Ipv4(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeBytes(this.inner);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Ipv4"]) {
        let reader = new CBORReader(data);
        return Ipv4.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Ipv4"]) {
        return Ipv4.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Ipv4.from_bytes(this.to_bytes(), path);
    }
}
export class Ipv6 {
    inner;
    constructor(inner) {
        if (inner.length != 16)
            throw new Error("Expected length to be 16");
        this.inner = inner;
    }
    static new(inner) {
        return new Ipv6(inner);
    }
    ip() {
        return this.inner;
    }
    static deserialize(reader, path) {
        return new Ipv6(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeBytes(this.inner);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Ipv6"]) {
        let reader = new CBORReader(data);
        return Ipv6.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Ipv6"]) {
        return Ipv6.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Ipv6.from_bytes(this.to_bytes(), path);
    }
}
export class KESSignature {
    inner;
    constructor(inner) {
        if (inner.length != 448)
            throw new Error("Expected length to be 448");
        this.inner = inner;
    }
    static new(inner) {
        return new KESSignature(inner);
    }
    toJsValue() {
        return this.inner;
    }
    static deserialize(reader, path) {
        return new KESSignature(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeBytes(this.inner);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["KESSignature"]) {
        let reader = new CBORReader(data);
        return KESSignature.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["KESSignature"]) {
        return KESSignature.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return KESSignature.from_bytes(this.to_bytes(), path);
    }
}
export class KESVKey {
    inner;
    constructor(inner) {
        if (inner.length != 32)
            throw new Error("Expected length to be 32");
        this.inner = inner;
    }
    static new(inner) {
        return new KESVKey(inner);
    }
    static from_bech32(bech_str) {
        let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
        let words = decoded.words;
        let bytesArray = bech32.fromWords(words);
        let bytes = new Uint8Array(bytesArray);
        return new KESVKey(bytes);
    }
    to_bech32(prefix) {
        let bytes = this.to_bytes();
        let words = bech32.toWords(bytes);
        return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
    }
    // no-op
    free() { }
    static from_bytes(data) {
        return new KESVKey(data);
    }
    static from_hex(hex_str) {
        return KESVKey.from_bytes(hexToBytes(hex_str));
    }
    to_bytes() {
        return this.inner;
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone() {
        return KESVKey.from_bytes(this.to_bytes());
    }
    static deserialize(reader, path) {
        return new KESVKey(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeBytes(this.inner);
    }
}
export var LanguageKind;
(function (LanguageKind) {
    LanguageKind[LanguageKind["plutus_v1"] = 0] = "plutus_v1";
    LanguageKind[LanguageKind["plutus_v2"] = 1] = "plutus_v2";
    LanguageKind[LanguageKind["plutus_v3"] = 2] = "plutus_v3";
})(LanguageKind || (LanguageKind = {}));
export class Language {
    kind_;
    constructor(kind) {
        this.kind_ = kind;
    }
    static new_plutus_v1() {
        return new Language(0);
    }
    static new_plutus_v2() {
        return new Language(1);
    }
    static new_plutus_v3() {
        return new Language(2);
    }
    kind() {
        return this.kind_;
    }
    static deserialize(reader, path) {
        let kind = Number(reader.readInt(path));
        if (kind == 0)
            return new Language(0);
        if (kind == 1)
            return new Language(1);
        if (kind == 2)
            return new Language(2);
        throw ("Unrecognized enum value: " +
            kind +
            " for " +
            Language +
            "(at " +
            path.join("/") +
            ")");
    }
    serialize(writer) {
        writer.writeInt(BigInt(this.kind_));
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Language"]) {
        let reader = new CBORReader(data);
        return Language.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Language"]) {
        return Language.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Language.from_bytes(this.to_bytes(), path);
    }
}
export class Languages {
    items;
    definiteEncoding;
    constructor(items, definiteEncoding = true) {
        this.items = items;
        this.definiteEncoding = definiteEncoding;
    }
    static new() {
        return new Languages([]);
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        this.items.push(elem);
    }
    static deserialize(reader, path) {
        const { items, definiteEncoding } = reader.readArray((reader, idx) => Language.deserialize(reader, [...path, "Elem#" + idx]), path);
        return new Languages(items, definiteEncoding);
    }
    serialize(writer) {
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Languages"]) {
        let reader = new CBORReader(data);
        return Languages.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Languages"]) {
        return Languages.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Languages.from_bytes(this.to_bytes(), path);
    }
    static list() {
        return new Languages([
            Language.new_plutus_v1(),
            Language.new_plutus_v2(),
            Language.new_plutus_v3(),
        ]);
    }
}
export class MetadataList {
    items;
    definiteEncoding;
    constructor(items, definiteEncoding = true) {
        this.items = items;
        this.definiteEncoding = definiteEncoding;
    }
    static new() {
        return new MetadataList([]);
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        this.items.push(elem);
    }
    static deserialize(reader, path) {
        const { items, definiteEncoding } = reader.readArray((reader, idx) => TransactionMetadatum.deserialize(reader, [...path, "Elem#" + idx]), path);
        return new MetadataList(items, definiteEncoding);
    }
    serialize(writer) {
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["MetadataList"]) {
        let reader = new CBORReader(data);
        return MetadataList.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["MetadataList"]) {
        return MetadataList.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return MetadataList.from_bytes(this.to_bytes(), path);
    }
}
export class MetadataMap {
    _items;
    constructor(items) {
        this._items = items;
    }
    static new() {
        return new MetadataMap([]);
    }
    len() {
        return this._items.length;
    }
    insert(key, value) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry != null) {
            let ret = entry[1];
            entry[1] = value;
            return ret;
        }
        this._items.push([key, value]);
        return undefined;
    }
    _get(key) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry == null)
            return undefined;
        return entry[1];
    }
    _remove_many(keys) {
        this._items = this._items.filter(([k, _v]) => keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())));
    }
    keys() {
        let keys = MetadataList.new();
        for (let [key, _] of this._items)
            keys.add(key);
        return keys;
    }
    static deserialize(reader, path) {
        let ret = new MetadataMap([]);
        reader.readMap((reader, idx) => ret.insert(TransactionMetadatum.deserialize(reader, [
            ...path,
            "TransactionMetadatum#" + idx,
        ]), TransactionMetadatum.deserialize(reader, [
            ...path,
            "TransactionMetadatum#" + idx,
        ])), path);
        return ret;
    }
    serialize(writer) {
        writer.writeMap(this._items, (writer, x) => {
            x[0].serialize(writer);
            x[1].serialize(writer);
        });
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["MetadataMap"]) {
        let reader = new CBORReader(data);
        return MetadataMap.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["MetadataMap"]) {
        return MetadataMap.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return MetadataMap.from_bytes(this.to_bytes(), path);
    }
    insert_str(key, value) {
        let metadata = TransactionMetadatum.new_text(key);
        return this.insert(metadata, value);
    }
    insert_i32(key, value) {
        let metadata = TransactionMetadatum.new_int(Int.new_i32(key));
        return this.insert(metadata, value);
    }
    get(key) {
        let ret = this._get(key);
        if (ret == null)
            throw new Error("Non-existent key");
        return ret;
    }
    get_str(key) {
        let metadata = TransactionMetadatum.new_text(key);
        return this.get(metadata);
    }
    get_i32(key) {
        let metadata = TransactionMetadatum.new_int(Int.new_i32(key));
        return this.get(metadata);
    }
    has(key) {
        return this._get(key) != null;
    }
}
export class Mint {
    _items;
    constructor(items) {
        this._items = items;
    }
    static new() {
        return new Mint([]);
    }
    len() {
        return this._items.length;
    }
    insert(key, value) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry != null) {
            let ret = entry[1];
            entry[1] = value;
            return ret;
        }
        this._items.push([key, value]);
        return undefined;
    }
    _remove_many(keys) {
        this._items = this._items.filter(([k, _v]) => keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())));
    }
    keys() {
        let keys = ScriptHashes.new();
        for (let [key, _] of this._items)
            keys.add(key);
        return keys;
    }
    static deserialize(reader, path) {
        let ret = new Mint([]);
        reader.readMap((reader, idx) => ret.insert(ScriptHash.deserialize(reader, [...path, "ScriptHash#" + idx]), MintAssets.deserialize(reader, [...path, "MintAssets#" + idx])), path);
        return ret;
    }
    serialize(writer) {
        writer.writeMap(this._items, (writer, x) => {
            x[0].serialize(writer);
            x[1].serialize(writer);
        });
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Mint"]) {
        let reader = new CBORReader(data);
        return Mint.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Mint"]) {
        return Mint.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Mint.from_bytes(this.to_bytes(), path);
    }
    get(key) {
        let ret = MintsAssets.new();
        for (let [key_, value] of this._items) {
            if (arrayEq(key.to_bytes(), key_.to_bytes())) {
                ret.add(value);
            }
        }
        if (ret.len() != 0)
            return ret;
        return undefined;
    }
    _as_multiasset(isPositive) {
        const result = new MultiAsset([]);
        // Iterating over items in Mint class
        const mintItems = this._items;
        for (const [scriptHash, mintAssets] of mintItems) {
            const assets = new Assets([]);
            const mintAssetEntries = mintAssets.keys();
            for (let i = 0; i < mintAssetEntries.len(); i++) {
                const assetName = mintAssetEntries.get(i);
                const assetValue = mintAssets.get(assetName);
                if (assetValue === undefined) {
                    throw new Error("assetValue is undefined");
                }
                if (assetValue > Int.new_i32(0) && isPositive) {
                    const amount = isPositive
                        ? assetValue.as_positive()
                        : assetValue.as_negative();
                    if (amount !== undefined) {
                        assets.insert(assetName, amount);
                    }
                }
            }
            if (assets.len() > 0) {
                result.insert(scriptHash, assets);
            }
        }
        return result;
    }
    as_positive_multiasset() {
        return this._as_multiasset(true);
    }
    as_negative_multiasset() {
        return this._as_multiasset(false);
    }
}
export class MintAssets {
    _items;
    constructor(items) {
        this._items = items;
    }
    static new() {
        return new MintAssets([]);
    }
    len() {
        return this._items.length;
    }
    insert(key, value) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry != null) {
            let ret = entry[1];
            entry[1] = value;
            return ret;
        }
        this._items.push([key, value]);
        return undefined;
    }
    get(key) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry == null)
            return undefined;
        return entry[1];
    }
    _remove_many(keys) {
        this._items = this._items.filter(([k, _v]) => keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())));
    }
    keys() {
        let keys = AssetNames.new();
        for (let [key, _] of this._items)
            keys.add(key);
        return keys;
    }
    static deserialize(reader, path) {
        let ret = new MintAssets([]);
        reader.readMap((reader, idx) => ret.insert(AssetName.deserialize(reader, [...path, "AssetName#" + idx]), Int.deserialize(reader, [...path, "Int#" + idx])), path);
        return ret;
    }
    serialize(writer) {
        writer.writeMap(this._items, (writer, x) => {
            x[0].serialize(writer);
            x[1].serialize(writer);
        });
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["MintAssets"]) {
        let reader = new CBORReader(data);
        return MintAssets.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["MintAssets"]) {
        return MintAssets.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return MintAssets.from_bytes(this.to_bytes(), path);
    }
}
export class MintsAssets {
    items;
    definiteEncoding;
    constructor(items, definiteEncoding = true) {
        this.items = items;
        this.definiteEncoding = definiteEncoding;
    }
    static new() {
        return new MintsAssets([]);
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        this.items.push(elem);
    }
    static deserialize(reader, path) {
        const { items, definiteEncoding } = reader.readArray((reader, idx) => MintAssets.deserialize(reader, [...path, "Elem#" + idx]), path);
        return new MintsAssets(items, definiteEncoding);
    }
    serialize(writer) {
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["MintsAssets"]) {
        let reader = new CBORReader(data);
        return MintsAssets.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["MintsAssets"]) {
        return MintsAssets.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return MintsAssets.from_bytes(this.to_bytes(), path);
    }
}
export class MultiAsset {
    _items;
    constructor(items) {
        this._items = items;
    }
    static new() {
        return new MultiAsset([]);
    }
    len() {
        return this._items.length;
    }
    insert(key, value) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry != null) {
            let ret = entry[1];
            entry[1] = value;
            return ret;
        }
        this._items.push([key, value]);
        return undefined;
    }
    get(key) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry == null)
            return undefined;
        return entry[1];
    }
    _remove_many(keys) {
        this._items = this._items.filter(([k, _v]) => keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())));
    }
    keys() {
        let keys = ScriptHashes.new();
        for (let [key, _] of this._items)
            keys.add(key);
        return keys;
    }
    static deserialize(reader, path) {
        let ret = new MultiAsset([]);
        reader.readMap((reader, idx) => ret.insert(ScriptHash.deserialize(reader, [...path, "ScriptHash#" + idx]), Assets.deserialize(reader, [...path, "Assets#" + idx])), path);
        return ret;
    }
    serialize(writer) {
        writer.writeMap(this._items, (writer, x) => {
            x[0].serialize(writer);
            x[1].serialize(writer);
        });
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["MultiAsset"]) {
        let reader = new CBORReader(data);
        return MultiAsset.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["MultiAsset"]) {
        return MultiAsset.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return MultiAsset.from_bytes(this.to_bytes(), path);
    }
    set_asset(policy_id, asset_name, value) {
        let assets = this.get(policy_id);
        if (assets == null) {
            assets = Assets.new();
            this.insert(policy_id, assets);
        }
        return assets.insert(asset_name, value);
    }
    get_asset(policy_id, asset_name) {
        let assets = this.get(policy_id);
        if (assets == null)
            return BigNum.zero();
        let asset_amount = assets.get(asset_name);
        if (asset_amount == null)
            return BigNum.zero();
        return asset_amount;
    }
    sub(rhs, path) {
        let out = this.clone(path);
        out._inplace_clamped_sub(rhs);
        return out;
    }
    _inplace_checked_add(rhs) {
        for (let [policy, rhs_assets] of rhs._items) {
            let this_assets = this.get(policy);
            if (this_assets == null) {
                this_assets = Assets.new();
                this.insert(policy, this_assets);
            }
            this_assets._inplace_checked_add(rhs_assets);
        }
    }
    _inplace_clamped_sub(rhs) {
        for (let [policy, rhs_assets] of rhs._items) {
            let this_assets = this.get(policy);
            if (this_assets == null)
                continue;
            this_assets._inplace_clamped_sub(rhs_assets);
        }
        this._normalize();
    }
    _normalize() {
        let to_remove = [];
        for (let [policy_id, assets] of this._items) {
            if (assets.len() == 0)
                to_remove.push(policy_id);
        }
        this._remove_many(to_remove);
    }
    _partial_cmp(rhs) {
        const zero = Assets.new();
        let cmps = [
            false, // -1
            false, // 0
            false, // 1
        ];
        for (let [policy_id, this_assets] of this._items) {
            let rhs_assets = rhs.get(policy_id);
            if (rhs_assets == null)
                rhs_assets = zero;
            let assets_cmp = this_assets._partial_cmp(rhs_assets);
            if (assets_cmp == null)
                return undefined;
            cmps[1 + assets_cmp] = true;
        }
        for (let [policy_id, rhs_assets] of rhs._items) {
            let this_assets = this.get(policy_id);
            if (this_assets == null)
                this_assets = zero;
            let assets_cmp = this_assets._partial_cmp(rhs_assets);
            if (assets_cmp == null)
                return undefined;
            cmps[1 + assets_cmp] = true;
        }
        let has_less = cmps[0];
        let _has_equal = cmps[1];
        let has_greater = cmps[2];
        if (has_less && has_greater)
            return undefined;
        else if (has_less)
            return -1;
        else if (has_greater)
            return 1;
        else
            return 0;
    }
}
export class MultiHostName {
    _dns_name;
    constructor(dns_name) {
        this._dns_name = dns_name;
    }
    static new(dns_name) {
        return new MultiHostName(dns_name);
    }
    dns_name() {
        return this._dns_name;
    }
    set_dns_name(dns_name) {
        this._dns_name = dns_name;
    }
    static deserialize(reader, path) {
        let dns_name = DNSRecordSRV.deserialize(reader, [...path, "dns_name"]);
        return new MultiHostName(dns_name);
    }
    serialize(writer) {
        this._dns_name.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["MultiHostName"]) {
        let reader = new CBORReader(data);
        return MultiHostName.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["MultiHostName"]) {
        return MultiHostName.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return MultiHostName.from_bytes(this.to_bytes(), path);
    }
}
export var NativeScriptKind;
(function (NativeScriptKind) {
    NativeScriptKind[NativeScriptKind["ScriptPubkey"] = 0] = "ScriptPubkey";
    NativeScriptKind[NativeScriptKind["ScriptAll"] = 1] = "ScriptAll";
    NativeScriptKind[NativeScriptKind["ScriptAny"] = 2] = "ScriptAny";
    NativeScriptKind[NativeScriptKind["ScriptNOfK"] = 3] = "ScriptNOfK";
    NativeScriptKind[NativeScriptKind["TimelockStart"] = 4] = "TimelockStart";
    NativeScriptKind[NativeScriptKind["TimelockExpiry"] = 5] = "TimelockExpiry";
})(NativeScriptKind || (NativeScriptKind = {}));
export class NativeScript {
    variant;
    constructor(variant) {
        this.variant = variant;
    }
    static new_script_pubkey(script_pubkey) {
        return new NativeScript({ kind: 0, value: script_pubkey });
    }
    static new_script_all(script_all) {
        return new NativeScript({ kind: 1, value: script_all });
    }
    static new_script_any(script_any) {
        return new NativeScript({ kind: 2, value: script_any });
    }
    static new_script_n_of_k(script_n_of_k) {
        return new NativeScript({ kind: 3, value: script_n_of_k });
    }
    static new_timelock_start(timelock_start) {
        return new NativeScript({ kind: 4, value: timelock_start });
    }
    static new_timelock_expiry(timelock_expiry) {
        return new NativeScript({ kind: 5, value: timelock_expiry });
    }
    as_script_pubkey() {
        if (this.variant.kind == 0)
            return this.variant.value;
    }
    as_script_all() {
        if (this.variant.kind == 1)
            return this.variant.value;
    }
    as_script_any() {
        if (this.variant.kind == 2)
            return this.variant.value;
    }
    as_script_n_of_k() {
        if (this.variant.kind == 3)
            return this.variant.value;
    }
    as_timelock_start() {
        if (this.variant.kind == 4)
            return this.variant.value;
    }
    as_timelock_expiry() {
        if (this.variant.kind == 5)
            return this.variant.value;
    }
    kind() {
        return this.variant.kind;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        let tag = Number(reader.readUint(path));
        let variant;
        switch (tag) {
            case 0:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode ScriptPubkey");
                }
                variant = {
                    kind: 0,
                    value: ScriptPubkey.deserialize(reader, [...path, "ScriptPubkey"]),
                };
                break;
            case 1:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode ScriptAll");
                }
                variant = {
                    kind: 1,
                    value: ScriptAll.deserialize(reader, [...path, "ScriptAll"]),
                };
                break;
            case 2:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode ScriptAny");
                }
                variant = {
                    kind: 2,
                    value: ScriptAny.deserialize(reader, [...path, "ScriptAny"]),
                };
                break;
            case 3:
                if (len != null && len - 1 != 2) {
                    throw new Error("Expected 2 items to decode ScriptNOfK");
                }
                variant = {
                    kind: 3,
                    value: ScriptNOfK.deserialize(reader, [...path, "ScriptNOfK"]),
                };
                break;
            case 4:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode TimelockStart");
                }
                variant = {
                    kind: 4,
                    value: TimelockStart.deserialize(reader, [...path, "TimelockStart"]),
                };
                break;
            case 5:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode TimelockExpiry");
                }
                variant = {
                    kind: 5,
                    value: TimelockExpiry.deserialize(reader, [
                        ...path,
                        "TimelockExpiry",
                    ]),
                };
                break;
            default:
                throw new Error("Unexpected tag for NativeScript: " +
                    tag +
                    "(at " +
                    path.join("/") +
                    ")");
        }
        if (len == null) {
            reader.readBreak();
        }
        return new NativeScript(variant);
    }
    serialize(writer) {
        switch (this.variant.kind) {
            case 0:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(0));
                this.variant.value.serialize(writer);
                break;
            case 1:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(1));
                this.variant.value.serialize(writer);
                break;
            case 2:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(2));
                this.variant.value.serialize(writer);
                break;
            case 3:
                writer.writeArrayTag(3);
                writer.writeInt(BigInt(3));
                this.variant.value.serialize(writer);
                break;
            case 4:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(4));
                this.variant.value.serialize(writer);
                break;
            case 5:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(5));
                this.variant.value.serialize(writer);
                break;
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["NativeScript"]) {
        let reader = new CBORReader(data);
        return NativeScript.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["NativeScript"]) {
        return NativeScript.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return NativeScript.from_bytes(this.to_bytes(), path);
    }
}
export class NativeScriptRefInput {
    _script_hash;
    _input;
    _script_size;
    constructor(script_hash, input, script_size) {
        this._script_hash = script_hash;
        this._input = input;
        this._script_size = script_size;
    }
    static new(script_hash, input, script_size) {
        return new NativeScriptRefInput(script_hash, input, script_size);
    }
    script_hash() {
        return this._script_hash;
    }
    set_script_hash(script_hash) {
        this._script_hash = script_hash;
    }
    input() {
        return this._input;
    }
    set_input(input) {
        this._input = input;
    }
    script_size() {
        return this._script_size;
    }
    set_script_size(script_size) {
        this._script_size = script_size;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 3) {
            throw new Error("Insufficient number of fields in record. Expected at least 3. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const script_hash_path = [...path, "ScriptHash(script_hash)"];
        let script_hash = ScriptHash.deserialize(reader, script_hash_path);
        const input_path = [...path, "TransactionInput(input)"];
        let input = TransactionInput.deserialize(reader, input_path);
        const script_size_path = [...path, "number(script_size)"];
        let script_size = Number(reader.readInt(script_size_path));
        return new NativeScriptRefInput(script_hash, input, script_size);
    }
    serialize(writer) {
        let arrayLen = 3;
        writer.writeArrayTag(arrayLen);
        this._script_hash.serialize(writer);
        this._input.serialize(writer);
        writer.writeInt(BigInt(this._script_size));
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["NativeScriptRefInput"]) {
        let reader = new CBORReader(data);
        return NativeScriptRefInput.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["NativeScriptRefInput"]) {
        return NativeScriptRefInput.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return NativeScriptRefInput.from_bytes(this.to_bytes(), path);
    }
}
export var NativeScriptSourceKind;
(function (NativeScriptSourceKind) {
    NativeScriptSourceKind[NativeScriptSourceKind["NativeScript"] = 0] = "NativeScript";
    NativeScriptSourceKind[NativeScriptSourceKind["NativeScriptRefInput"] = 1] = "NativeScriptRefInput";
})(NativeScriptSourceKind || (NativeScriptSourceKind = {}));
export class NativeScriptSource {
    variant;
    constructor(variant) {
        this.variant = variant;
    }
    static new_script(script) {
        return new NativeScriptSource({ kind: 0, value: script });
    }
    static new__ref_input(_ref_input) {
        return new NativeScriptSource({ kind: 1, value: _ref_input });
    }
    as_script() {
        if (this.variant.kind == 0)
            return this.variant.value;
    }
    as__ref_input() {
        if (this.variant.kind == 1)
            return this.variant.value;
    }
    kind() {
        return this.variant.kind;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        let tag = Number(reader.readUint(path));
        let variant;
        switch (tag) {
            case 0:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode NativeScript");
                }
                variant = {
                    kind: 0,
                    value: NativeScript.deserialize(reader, [...path, "NativeScript"]),
                };
                break;
            case 1:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode NativeScriptRefInput");
                }
                variant = {
                    kind: 1,
                    value: NativeScriptRefInput.deserialize(reader, [
                        ...path,
                        "NativeScriptRefInput",
                    ]),
                };
                break;
            default:
                throw new Error("Unexpected tag for NativeScriptSource: " +
                    tag +
                    "(at " +
                    path.join("/") +
                    ")");
        }
        if (len == null) {
            reader.readBreak();
        }
        return new NativeScriptSource(variant);
    }
    serialize(writer) {
        switch (this.variant.kind) {
            case 0:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(0));
                this.variant.value.serialize(writer);
                break;
            case 1:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(1));
                this.variant.value.serialize(writer);
                break;
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["NativeScriptSource"]) {
        let reader = new CBORReader(data);
        return NativeScriptSource.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["NativeScriptSource"]) {
        return NativeScriptSource.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return NativeScriptSource.from_bytes(this.to_bytes(), path);
    }
    static new(script) {
        return NativeScriptSource.new_script(script);
    }
    static new_ref_input(script_hash, input, script_size) {
        return NativeScriptSource.new__ref_input(NativeScriptRefInput.new(script_hash, input, script_size));
    }
    set_required_signers(key_hashes) {
        // TODO: implement.
    }
    get_ref_script_size() {
        // TODO: implement.
        return undefined;
    }
}
export class NativeScripts {
    items;
    definiteEncoding;
    nonEmptyTag;
    setItems(items) {
        this.items = items;
    }
    constructor(definiteEncoding = true, nonEmptyTag = true) {
        this.items = [];
        this.definiteEncoding = definiteEncoding;
        this.nonEmptyTag = nonEmptyTag;
    }
    static new() {
        return new NativeScripts();
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        if (this.contains(elem))
            return true;
        this.items.push(elem);
        return false;
    }
    contains(elem) {
        for (let item of this.items) {
            if (arrayEq(item.to_bytes(), elem.to_bytes())) {
                return true;
            }
        }
        return false;
    }
    static deserialize(reader, path) {
        let nonEmptyTag = false;
        if (reader.peekType(path) == "tagged") {
            let tag = reader.readTaggedTag(path);
            if (tag != 258) {
                throw new Error("Expected tag 258. Got " + tag);
            }
            else {
                nonEmptyTag = true;
            }
        }
        const { items, definiteEncoding } = reader.readArray((reader, idx) => NativeScript.deserialize(reader, [...path, "NativeScript#" + idx]), path);
        let ret = new NativeScripts(definiteEncoding, nonEmptyTag);
        ret.setItems(items);
        return ret;
    }
    serialize(writer) {
        if (this.nonEmptyTag) {
            writer.writeTaggedTag(258);
        }
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["NativeScripts"]) {
        let reader = new CBORReader(data);
        return NativeScripts.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["NativeScripts"]) {
        return NativeScripts.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return NativeScripts.from_bytes(this.to_bytes(), path);
    }
}
export var NetworkIdKind;
(function (NetworkIdKind) {
    NetworkIdKind[NetworkIdKind["mainnet"] = 1] = "mainnet";
    NetworkIdKind[NetworkIdKind["testnet"] = 0] = "testnet";
})(NetworkIdKind || (NetworkIdKind = {}));
export class NetworkId {
    kind_;
    constructor(kind) {
        this.kind_ = kind;
    }
    static new_mainnet() {
        return new NetworkId(1);
    }
    static new_testnet() {
        return new NetworkId(0);
    }
    kind() {
        return this.kind_;
    }
    static deserialize(reader, path) {
        let kind = Number(reader.readInt(path));
        if (kind == 1)
            return new NetworkId(1);
        if (kind == 0)
            return new NetworkId(0);
        throw ("Unrecognized enum value: " +
            kind +
            " for " +
            NetworkId +
            "(at " +
            path.join("/") +
            ")");
    }
    serialize(writer) {
        writer.writeInt(BigInt(this.kind_));
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["NetworkId"]) {
        let reader = new CBORReader(data);
        return NetworkId.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["NetworkId"]) {
        return NetworkId.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return NetworkId.from_bytes(this.to_bytes(), path);
    }
}
export class NewConstitutionAction {
    _gov_action_id;
    _constitution;
    constructor(gov_action_id, constitution) {
        this._gov_action_id = gov_action_id;
        this._constitution = constitution;
    }
    static new_with_action_id(gov_action_id, constitution) {
        return new NewConstitutionAction(gov_action_id, constitution);
    }
    gov_action_id() {
        return this._gov_action_id;
    }
    set_gov_action_id(gov_action_id) {
        this._gov_action_id = gov_action_id;
    }
    constitution() {
        return this._constitution;
    }
    set_constitution(constitution) {
        this._constitution = constitution;
    }
    static deserialize(reader, path) {
        let gov_action_id = reader.readNullable((r) => GovernanceActionId.deserialize(r, [...path, "gov_action_id"]), path) ?? undefined;
        let constitution = Constitution.deserialize(reader, [
            ...path,
            "constitution",
        ]);
        return new NewConstitutionAction(gov_action_id, constitution);
    }
    serialize(writer) {
        if (this._gov_action_id == null) {
            writer.writeNull();
        }
        else {
            this._gov_action_id.serialize(writer);
        }
        this._constitution.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["NewConstitutionAction"]) {
        let reader = new CBORReader(data);
        return NewConstitutionAction.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["NewConstitutionAction"]) {
        return NewConstitutionAction.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return NewConstitutionAction.from_bytes(this.to_bytes(), path);
    }
    static new(constitution) {
        return new NewConstitutionAction(undefined, constitution);
    }
}
export class NoConfidenceAction {
    _gov_action_id;
    constructor(gov_action_id) {
        this._gov_action_id = gov_action_id;
    }
    static new_with_action_id(gov_action_id) {
        return new NoConfidenceAction(gov_action_id);
    }
    gov_action_id() {
        return this._gov_action_id;
    }
    set_gov_action_id(gov_action_id) {
        this._gov_action_id = gov_action_id;
    }
    static deserialize(reader, path) {
        let gov_action_id = reader.readNullable((r) => GovernanceActionId.deserialize(r, [...path, "gov_action_id"]), path) ?? undefined;
        return new NoConfidenceAction(gov_action_id);
    }
    serialize(writer) {
        if (this._gov_action_id == null) {
            writer.writeNull();
        }
        else {
            this._gov_action_id.serialize(writer);
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["NoConfidenceAction"]) {
        let reader = new CBORReader(data);
        return NoConfidenceAction.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["NoConfidenceAction"]) {
        return NoConfidenceAction.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return NoConfidenceAction.from_bytes(this.to_bytes(), path);
    }
    static new() {
        return new NoConfidenceAction(undefined);
    }
}
export class Nonce {
    _hash;
    constructor(hash) {
        this._hash = hash;
    }
    static new(hash) {
        return new Nonce(hash);
    }
    hash() {
        return this._hash;
    }
    set_hash(hash) {
        this._hash = hash;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 1) {
            throw new Error("Insufficient number of fields in record. Expected at least 1. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const hash_path = [...path, "bytes(hash)"];
        let hash = reader.readNullable((r) => r.readBytes(hash_path), path) ?? undefined;
        return new Nonce(hash);
    }
    serialize(writer) {
        let arrayLen = 1;
        writer.writeArrayTag(arrayLen);
        if (this._hash == null) {
            writer.writeNull();
        }
        else {
            writer.writeBytes(this._hash);
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Nonce"]) {
        let reader = new CBORReader(data);
        return Nonce.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Nonce"]) {
        return Nonce.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Nonce.from_bytes(this.to_bytes(), path);
    }
    static new_identity() {
        return new Nonce(undefined);
    }
    static new_from_hash(hash) {
        return new Nonce(hash);
    }
    get_hash() {
        return this._hash;
    }
}
export class OperationalCert {
    _hot_vkey;
    _sequence_number;
    _kes_period;
    _sigma;
    constructor(hot_vkey, sequence_number, kes_period, sigma) {
        this._hot_vkey = hot_vkey;
        this._sequence_number = sequence_number;
        this._kes_period = kes_period;
        this._sigma = sigma;
    }
    static new(hot_vkey, sequence_number, kes_period, sigma) {
        return new OperationalCert(hot_vkey, sequence_number, kes_period, sigma);
    }
    hot_vkey() {
        return this._hot_vkey;
    }
    set_hot_vkey(hot_vkey) {
        this._hot_vkey = hot_vkey;
    }
    sequence_number() {
        return this._sequence_number;
    }
    set_sequence_number(sequence_number) {
        this._sequence_number = sequence_number;
    }
    kes_period() {
        return this._kes_period;
    }
    set_kes_period(kes_period) {
        this._kes_period = kes_period;
    }
    sigma() {
        return this._sigma;
    }
    set_sigma(sigma) {
        this._sigma = sigma;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 4) {
            throw new Error("Insufficient number of fields in record. Expected at least 4. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const hot_vkey_path = [...path, "KESVKey(hot_vkey)"];
        let hot_vkey = KESVKey.deserialize(reader, hot_vkey_path);
        const sequence_number_path = [...path, "number(sequence_number)"];
        let sequence_number = Number(reader.readInt(sequence_number_path));
        const kes_period_path = [...path, "number(kes_period)"];
        let kes_period = Number(reader.readInt(kes_period_path));
        const sigma_path = [...path, "Ed25519Signature(sigma)"];
        let sigma = Ed25519Signature.deserialize(reader, sigma_path);
        return new OperationalCert(hot_vkey, sequence_number, kes_period, sigma);
    }
    serialize(writer) {
        let arrayLen = 4;
        writer.writeArrayTag(arrayLen);
        this._hot_vkey.serialize(writer);
        writer.writeInt(BigInt(this._sequence_number));
        writer.writeInt(BigInt(this._kes_period));
        this._sigma.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["OperationalCert"]) {
        let reader = new CBORReader(data);
        return OperationalCert.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["OperationalCert"]) {
        return OperationalCert.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return OperationalCert.from_bytes(this.to_bytes(), path);
    }
}
export var OutputDatumKind;
(function (OutputDatumKind) {
    OutputDatumKind[OutputDatumKind["DataHash"] = 0] = "DataHash";
    OutputDatumKind[OutputDatumKind["PlutusData"] = 1] = "PlutusData";
})(OutputDatumKind || (OutputDatumKind = {}));
export class OutputDatum {
    variant;
    constructor(variant) {
        this.variant = variant;
    }
    static new_data_hash(data_hash) {
        return new OutputDatum({ kind: 0, value: data_hash });
    }
    static new_data(data) {
        return new OutputDatum({ kind: 1, value: data });
    }
    as_data_hash() {
        if (this.variant.kind == 0)
            return this.variant.value;
    }
    as_data() {
        if (this.variant.kind == 1)
            return this.variant.value;
    }
    kind() {
        return this.variant.kind;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        let tag = Number(reader.readUint(path));
        let variant;
        switch (tag) {
            case 0:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode DataHash");
                }
                variant = {
                    kind: 0,
                    value: DataHash.deserialize(reader, [...path, "DataHash"]),
                };
                break;
            case 1:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode PlutusData");
                }
                variant = {
                    kind: 1,
                    value: PlutusData.deserialize(reader, [...path, "PlutusData"]),
                };
                break;
            default:
                throw new Error("Unexpected tag for OutputDatum: " +
                    tag +
                    "(at " +
                    path.join("/") +
                    ")");
        }
        if (len == null) {
            reader.readBreak();
        }
        return new OutputDatum(variant);
    }
    serialize(writer) {
        switch (this.variant.kind) {
            case 0:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(0));
                this.variant.value.serialize(writer);
                break;
            case 1:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(1));
                this.variant.value.serialize(writer);
                break;
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["OutputDatum"]) {
        let reader = new CBORReader(data);
        return OutputDatum.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["OutputDatum"]) {
        return OutputDatum.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return OutputDatum.from_bytes(this.to_bytes(), path);
    }
}
export class ParameterChangeAction {
    _gov_action_id;
    _protocol_param_updates;
    _policy_hash;
    constructor(gov_action_id, protocol_param_updates, policy_hash) {
        this._gov_action_id = gov_action_id;
        this._protocol_param_updates = protocol_param_updates;
        this._policy_hash = policy_hash;
    }
    static new_with_policy_hash_and_action_id(gov_action_id, protocol_param_updates, policy_hash) {
        return new ParameterChangeAction(gov_action_id, protocol_param_updates, policy_hash);
    }
    gov_action_id() {
        return this._gov_action_id;
    }
    set_gov_action_id(gov_action_id) {
        this._gov_action_id = gov_action_id;
    }
    protocol_param_updates() {
        return this._protocol_param_updates;
    }
    set_protocol_param_updates(protocol_param_updates) {
        this._protocol_param_updates = protocol_param_updates;
    }
    policy_hash() {
        return this._policy_hash;
    }
    set_policy_hash(policy_hash) {
        this._policy_hash = policy_hash;
    }
    static deserialize(reader, path) {
        let gov_action_id = reader.readNullable((r) => GovernanceActionId.deserialize(r, [...path, "gov_action_id"]), path) ?? undefined;
        let protocol_param_updates = ProtocolParamUpdate.deserialize(reader, [
            ...path,
            "protocol_param_updates",
        ]);
        let policy_hash = reader.readNullable((r) => ScriptHash.deserialize(r, [...path, "policy_hash"]), path) ?? undefined;
        return new ParameterChangeAction(gov_action_id, protocol_param_updates, policy_hash);
    }
    serialize(writer) {
        if (this._gov_action_id == null) {
            writer.writeNull();
        }
        else {
            this._gov_action_id.serialize(writer);
        }
        this._protocol_param_updates.serialize(writer);
        if (this._policy_hash == null) {
            writer.writeNull();
        }
        else {
            this._policy_hash.serialize(writer);
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["ParameterChangeAction"]) {
        let reader = new CBORReader(data);
        return ParameterChangeAction.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["ParameterChangeAction"]) {
        return ParameterChangeAction.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return ParameterChangeAction.from_bytes(this.to_bytes(), path);
    }
    static new(protocol_param_updates) {
        return new ParameterChangeAction(undefined, protocol_param_updates, undefined);
    }
    static new_with_action_id(gov_action_id, protocol_param_updates) {
        return new ParameterChangeAction(gov_action_id, protocol_param_updates, undefined);
    }
    static new_with_policy_hash(protocol_param_updates, policy_hash) {
        return new ParameterChangeAction(undefined, protocol_param_updates, policy_hash);
    }
}
export var PlutusDataKind;
(function (PlutusDataKind) {
    PlutusDataKind[PlutusDataKind["ConstrPlutusData"] = 0] = "ConstrPlutusData";
    PlutusDataKind[PlutusDataKind["PlutusMap"] = 1] = "PlutusMap";
    PlutusDataKind[PlutusDataKind["PlutusList"] = 2] = "PlutusList";
    PlutusDataKind[PlutusDataKind["CSLBigInt"] = 3] = "CSLBigInt";
    PlutusDataKind[PlutusDataKind["Bytes"] = 4] = "Bytes";
})(PlutusDataKind || (PlutusDataKind = {}));
export class PlutusData {
    variant;
    constructor(variant) {
        this.variant = variant;
    }
    static new_constr_plutus_data(constr_plutus_data) {
        return new PlutusData({ kind: 0, value: constr_plutus_data });
    }
    static new_map(map) {
        return new PlutusData({ kind: 1, value: map });
    }
    static new_list(list) {
        return new PlutusData({ kind: 2, value: list });
    }
    static new_integer(integer) {
        return new PlutusData({ kind: 3, value: integer });
    }
    static new_bytes(bytes) {
        return new PlutusData({ kind: 4, value: bytes });
    }
    as_constr_plutus_data() {
        if (this.variant.kind == 0)
            return this.variant.value;
        throw new Error("Incorrect cast");
    }
    as_map() {
        if (this.variant.kind == 1)
            return this.variant.value;
        throw new Error("Incorrect cast");
    }
    as_list() {
        if (this.variant.kind == 2)
            return this.variant.value;
        throw new Error("Incorrect cast");
    }
    as_integer() {
        if (this.variant.kind == 3)
            return this.variant.value;
        throw new Error("Incorrect cast");
    }
    as_bytes() {
        if (this.variant.kind == 4)
            return this.variant.value;
        throw new Error("Incorrect cast");
    }
    kind() {
        return this.variant.kind;
    }
    static deserialize(reader, path) {
        let tag = reader.peekType(path);
        let variant;
        switch (tag) {
            case "tagged":
                variant = {
                    kind: PlutusDataKind.ConstrPlutusData,
                    value: ConstrPlutusData.deserialize(reader, [
                        ...path,
                        "ConstrPlutusData(constr_plutus_data)",
                    ]),
                };
                break;
            case "map":
                variant = {
                    kind: PlutusDataKind.PlutusMap,
                    value: PlutusMap.deserialize(reader, [...path, "PlutusMap(map)"]),
                };
                break;
            case "array":
                variant = {
                    kind: PlutusDataKind.PlutusList,
                    value: PlutusList.deserialize(reader, [...path, "PlutusList(list)"]),
                };
                break;
            case "uint":
            case "nint":
            case "tagged":
                variant = {
                    kind: PlutusDataKind.CSLBigInt,
                    value: CSLBigInt.deserialize(reader, [...path, "CSLBigInt(integer)"]),
                };
                break;
            case "bytes":
                variant = {
                    kind: PlutusDataKind.Bytes,
                    value: reader.readBytes([...path, "bytes(bytes)"]),
                };
                break;
            default:
                throw new Error("Unexpected subtype for PlutusData: " +
                    tag +
                    "(at " +
                    path.join("/") +
                    ")");
        }
        return new PlutusData(variant);
    }
    serialize(writer) {
        switch (this.variant.kind) {
            case 0:
                this.variant.value.serialize(writer);
                break;
            case 1:
                this.variant.value.serialize(writer);
                break;
            case 2:
                this.variant.value.serialize(writer);
                break;
            case 3:
                this.variant.value.serialize(writer);
                break;
            case 4:
                writer.writeBytes(this.variant.value);
                break;
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["PlutusData"]) {
        let reader = new CBORReader(data);
        return PlutusData.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["PlutusData"]) {
        return PlutusData.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return PlutusData.from_bytes(this.to_bytes(), path);
    }
    static new_empty_constr_plutus_data(alternative) {
        return new PlutusData({
            kind: 0,
            value: ConstrPlutusData.new(alternative, PlutusList.new()),
        });
    }
    static new_single_value_constr_plutus_data(alternative, plutus_data) {
        let plutus_list = PlutusList.new();
        plutus_list.add(plutus_data);
        return new PlutusData({
            kind: 0,
            value: ConstrPlutusData.new(alternative, plutus_list),
        });
    }
    static from_address(address) {
        throw new Error("PlutusData.from_address: to be implemented");
    }
}
export class PlutusList {
    items;
    definiteEncoding;
    constructor(items, definiteEncoding = true) {
        this.items = items;
        this.definiteEncoding = definiteEncoding;
    }
    static new() {
        return new PlutusList([]);
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        this.items.push(elem);
    }
    static deserialize(reader, path) {
        const { items, definiteEncoding } = reader.readArray((reader, idx) => PlutusData.deserialize(reader, [...path, "Elem#" + idx]), path);
        return new PlutusList(items, definiteEncoding);
    }
    serialize(writer) {
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["PlutusList"]) {
        let reader = new CBORReader(data);
        return PlutusList.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["PlutusList"]) {
        return PlutusList.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return PlutusList.from_bytes(this.to_bytes(), path);
    }
    as_set() {
        let set = new PlutusSet(this.definiteEncoding);
        for (let i = 0; i < this.len(); i++) {
            set.add(this.items[i]);
        }
        return set;
    }
}
export class PlutusMap {
    _items;
    constructor(items) {
        this._items = items;
    }
    static new() {
        return new PlutusMap([]);
    }
    len() {
        return this._items.length;
    }
    insertInner(key, value) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry != null) {
            let ret = entry[1];
            entry[1] = value;
            return ret;
        }
        this._items.push([key, value]);
        return undefined;
    }
    getInner(key) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry == null)
            return undefined;
        return entry[1];
    }
    _remove_many(keys) {
        this._items = this._items.filter(([k, _v]) => keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())));
    }
    keys() {
        let keys = PlutusList.new();
        for (let [key, _] of this._items)
            keys.add(key);
        return keys;
    }
    static deserialize(reader, path) {
        let ret = new PlutusMap([]);
        reader.readMap((reader, idx) => ret.insertInner(PlutusData.deserialize(reader, [...path, "PlutusData#" + idx]), PlutusData.deserialize(reader, [...path, "PlutusData#" + idx])), path);
        return ret;
    }
    serialize(writer) {
        writer.writeMap(this._items, (writer, x) => {
            x[0].serialize(writer);
            x[1].serialize(writer);
        });
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["PlutusMap"]) {
        let reader = new CBORReader(data);
        return PlutusMap.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["PlutusMap"]) {
        return PlutusMap.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return PlutusMap.from_bytes(this.to_bytes(), path);
    }
    get(key) {
        let v = this.getInner(key);
        if (v) {
            let vs = new PlutusMapValues([v]);
            return vs;
        }
        else {
            return undefined;
        }
    }
    insert(key, values) {
        let v = values.get(values.len() - 1);
        let ret = this.insertInner(key, v);
        if (ret) {
            return new PlutusMapValues([ret]);
        }
        else {
            return undefined;
        }
    }
}
export class PlutusMapValues {
    items;
    definiteEncoding;
    constructor(items, definiteEncoding = true) {
        this.items = items;
        this.definiteEncoding = definiteEncoding;
    }
    static new() {
        return new PlutusMapValues([]);
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        this.items.push(elem);
    }
    static deserialize(reader, path) {
        const { items, definiteEncoding } = reader.readArray((reader, idx) => PlutusData.deserialize(reader, [...path, "Elem#" + idx]), path);
        return new PlutusMapValues(items, definiteEncoding);
    }
    serialize(writer) {
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["PlutusMapValues"]) {
        let reader = new CBORReader(data);
        return PlutusMapValues.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["PlutusMapValues"]) {
        return PlutusMapValues.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return PlutusMapValues.from_bytes(this.to_bytes(), path);
    }
}
export class PlutusScript {
    inner;
    constructor(inner) {
        this.inner = inner;
    }
    static new(inner) {
        return new PlutusScript(inner);
    }
    bytes() {
        return this.inner;
    }
    static deserialize(reader, path) {
        return new PlutusScript(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeBytes(this.inner);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["PlutusScript"]) {
        let reader = new CBORReader(data);
        return PlutusScript.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["PlutusScript"]) {
        return PlutusScript.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return PlutusScript.from_bytes(this.to_bytes(), path);
    }
    hash(language_version) {
        let bytes = new Uint8Array(this.bytes().length + 1);
        bytes[0] = language_version;
        bytes.set(bytes, 1);
        let hash_bytes = cdlCrypto.blake2b224(bytes);
        return new ScriptHash(hash_bytes);
    }
}
export class PlutusScripts {
    items;
    definiteEncoding;
    nonEmptyTag;
    setItems(items) {
        this.items = items;
    }
    constructor(definiteEncoding = true, nonEmptyTag = true) {
        this.items = [];
        this.definiteEncoding = definiteEncoding;
        this.nonEmptyTag = nonEmptyTag;
    }
    static new() {
        return new PlutusScripts();
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        if (this.contains(elem))
            return true;
        this.items.push(elem);
        return false;
    }
    contains(elem) {
        for (let item of this.items) {
            if (arrayEq(item.to_bytes(), elem.to_bytes())) {
                return true;
            }
        }
        return false;
    }
    static deserialize(reader, path) {
        let nonEmptyTag = false;
        if (reader.peekType(path) == "tagged") {
            let tag = reader.readTaggedTag(path);
            if (tag != 258) {
                throw new Error("Expected tag 258. Got " + tag);
            }
            else {
                nonEmptyTag = true;
            }
        }
        const { items, definiteEncoding } = reader.readArray((reader, idx) => PlutusScript.deserialize(reader, [...path, "PlutusScript#" + idx]), path);
        let ret = new PlutusScripts(definiteEncoding, nonEmptyTag);
        ret.setItems(items);
        return ret;
    }
    serialize(writer) {
        if (this.nonEmptyTag) {
            writer.writeTaggedTag(258);
        }
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["PlutusScripts"]) {
        let reader = new CBORReader(data);
        return PlutusScripts.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["PlutusScripts"]) {
        return PlutusScripts.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return PlutusScripts.from_bytes(this.to_bytes(), path);
    }
}
export class PlutusSet {
    items;
    definiteEncoding;
    nonEmptyTag;
    setItems(items) {
        this.items = items;
    }
    constructor(definiteEncoding = true, nonEmptyTag = true) {
        this.items = [];
        this.definiteEncoding = definiteEncoding;
        this.nonEmptyTag = nonEmptyTag;
    }
    static new() {
        return new PlutusSet();
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        if (this.contains(elem))
            return true;
        this.items.push(elem);
        return false;
    }
    contains(elem) {
        for (let item of this.items) {
            if (arrayEq(item.to_bytes(), elem.to_bytes())) {
                return true;
            }
        }
        return false;
    }
    static deserialize(reader, path) {
        let nonEmptyTag = false;
        if (reader.peekType(path) == "tagged") {
            let tag = reader.readTaggedTag(path);
            if (tag != 258) {
                throw new Error("Expected tag 258. Got " + tag);
            }
            else {
                nonEmptyTag = true;
            }
        }
        const { items, definiteEncoding } = reader.readArray((reader, idx) => PlutusData.deserialize(reader, [...path, "PlutusData#" + idx]), path);
        let ret = new PlutusSet(definiteEncoding, nonEmptyTag);
        ret.setItems(items);
        return ret;
    }
    serialize(writer) {
        if (this.nonEmptyTag) {
            writer.writeTaggedTag(258);
        }
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["PlutusSet"]) {
        let reader = new CBORReader(data);
        return PlutusSet.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["PlutusSet"]) {
        return PlutusSet.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return PlutusSet.from_bytes(this.to_bytes(), path);
    }
    as_list() {
        return new PlutusList(this.items, this.definiteEncoding);
    }
}
export class PoolMetadata {
    _url;
    _pool_metadata_hash;
    constructor(url, pool_metadata_hash) {
        this._url = url;
        this._pool_metadata_hash = pool_metadata_hash;
    }
    static new(url, pool_metadata_hash) {
        return new PoolMetadata(url, pool_metadata_hash);
    }
    url() {
        return this._url;
    }
    set_url(url) {
        this._url = url;
    }
    pool_metadata_hash() {
        return this._pool_metadata_hash;
    }
    set_pool_metadata_hash(pool_metadata_hash) {
        this._pool_metadata_hash = pool_metadata_hash;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 2) {
            throw new Error("Insufficient number of fields in record. Expected at least 2. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const url_path = [...path, "URL(url)"];
        let url = URL.deserialize(reader, url_path);
        const pool_metadata_hash_path = [
            ...path,
            "PoolMetadataHash(pool_metadata_hash)",
        ];
        let pool_metadata_hash = PoolMetadataHash.deserialize(reader, pool_metadata_hash_path);
        return new PoolMetadata(url, pool_metadata_hash);
    }
    serialize(writer) {
        let arrayLen = 2;
        writer.writeArrayTag(arrayLen);
        this._url.serialize(writer);
        this._pool_metadata_hash.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["PoolMetadata"]) {
        let reader = new CBORReader(data);
        return PoolMetadata.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["PoolMetadata"]) {
        return PoolMetadata.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return PoolMetadata.from_bytes(this.to_bytes(), path);
    }
}
export class PoolMetadataHash {
    inner;
    constructor(inner) {
        if (inner.length != 32)
            throw new Error("Expected length to be 32");
        this.inner = inner;
    }
    static new(inner) {
        return new PoolMetadataHash(inner);
    }
    static from_bech32(bech_str) {
        let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
        let words = decoded.words;
        let bytesArray = bech32.fromWords(words);
        let bytes = new Uint8Array(bytesArray);
        return new PoolMetadataHash(bytes);
    }
    to_bech32(prefix) {
        let bytes = this.to_bytes();
        let words = bech32.toWords(bytes);
        return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
    }
    // no-op
    free() { }
    static from_bytes(data) {
        return new PoolMetadataHash(data);
    }
    static from_hex(hex_str) {
        return PoolMetadataHash.from_bytes(hexToBytes(hex_str));
    }
    to_bytes() {
        return this.inner;
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone() {
        return PoolMetadataHash.from_bytes(this.to_bytes());
    }
    static deserialize(reader, path) {
        return new PoolMetadataHash(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeBytes(this.inner);
    }
}
export class PoolParams {
    _operator;
    _vrf_keyhash;
    _pledge;
    _cost;
    _margin;
    _reward_account;
    _pool_owners;
    _relays;
    _pool_metadata;
    constructor(operator, vrf_keyhash, pledge, cost, margin, reward_account, pool_owners, relays, pool_metadata) {
        this._operator = operator;
        this._vrf_keyhash = vrf_keyhash;
        this._pledge = pledge;
        this._cost = cost;
        this._margin = margin;
        this._reward_account = reward_account;
        this._pool_owners = pool_owners;
        this._relays = relays;
        this._pool_metadata = pool_metadata;
    }
    static new(operator, vrf_keyhash, pledge, cost, margin, reward_account, pool_owners, relays, pool_metadata) {
        return new PoolParams(operator, vrf_keyhash, pledge, cost, margin, reward_account, pool_owners, relays, pool_metadata);
    }
    operator() {
        return this._operator;
    }
    set_operator(operator) {
        this._operator = operator;
    }
    vrf_keyhash() {
        return this._vrf_keyhash;
    }
    set_vrf_keyhash(vrf_keyhash) {
        this._vrf_keyhash = vrf_keyhash;
    }
    pledge() {
        return this._pledge;
    }
    set_pledge(pledge) {
        this._pledge = pledge;
    }
    cost() {
        return this._cost;
    }
    set_cost(cost) {
        this._cost = cost;
    }
    margin() {
        return this._margin;
    }
    set_margin(margin) {
        this._margin = margin;
    }
    reward_account() {
        return this._reward_account;
    }
    set_reward_account(reward_account) {
        this._reward_account = reward_account;
    }
    pool_owners() {
        return this._pool_owners;
    }
    set_pool_owners(pool_owners) {
        this._pool_owners = pool_owners;
    }
    relays() {
        return this._relays;
    }
    set_relays(relays) {
        this._relays = relays;
    }
    pool_metadata() {
        return this._pool_metadata;
    }
    set_pool_metadata(pool_metadata) {
        this._pool_metadata = pool_metadata;
    }
    static deserialize(reader, path) {
        let operator = Ed25519KeyHash.deserialize(reader, [...path, "operator"]);
        let vrf_keyhash = VRFKeyHash.deserialize(reader, [...path, "vrf_keyhash"]);
        let pledge = BigNum.deserialize(reader, [...path, "pledge"]);
        let cost = BigNum.deserialize(reader, [...path, "cost"]);
        let margin = UnitInterval.deserialize(reader, [...path, "margin"]);
        let reward_account = RewardAddress.deserialize(reader, [
            ...path,
            "reward_account",
        ]);
        let pool_owners = Ed25519KeyHashes.deserialize(reader, [
            ...path,
            "pool_owners",
        ]);
        let relays = Relays.deserialize(reader, [...path, "relays"]);
        let pool_metadata = reader.readNullable((r) => PoolMetadata.deserialize(r, [...path, "pool_metadata"]), path) ?? undefined;
        return new PoolParams(operator, vrf_keyhash, pledge, cost, margin, reward_account, pool_owners, relays, pool_metadata);
    }
    serialize(writer) {
        this._operator.serialize(writer);
        this._vrf_keyhash.serialize(writer);
        this._pledge.serialize(writer);
        this._cost.serialize(writer);
        this._margin.serialize(writer);
        this._reward_account.serialize(writer);
        this._pool_owners.serialize(writer);
        this._relays.serialize(writer);
        if (this._pool_metadata == null) {
            writer.writeNull();
        }
        else {
            this._pool_metadata.serialize(writer);
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["PoolParams"]) {
        let reader = new CBORReader(data);
        return PoolParams.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["PoolParams"]) {
        return PoolParams.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return PoolParams.from_bytes(this.to_bytes(), path);
    }
}
export class PoolRegistration {
    _pool_params;
    constructor(pool_params) {
        this._pool_params = pool_params;
    }
    static new(pool_params) {
        return new PoolRegistration(pool_params);
    }
    pool_params() {
        return this._pool_params;
    }
    set_pool_params(pool_params) {
        this._pool_params = pool_params;
    }
    static deserialize(reader, path) {
        let pool_params = PoolParams.deserialize(reader, [...path, "PoolParams"]);
        return new PoolRegistration(pool_params);
    }
    serialize(writer) {
        this._pool_params.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["PoolRegistration"]) {
        let reader = new CBORReader(data);
        return PoolRegistration.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["PoolRegistration"]) {
        return PoolRegistration.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return PoolRegistration.from_bytes(this.to_bytes(), path);
    }
}
export class PoolRetirement {
    _pool_keyhash;
    _epoch;
    constructor(pool_keyhash, epoch) {
        this._pool_keyhash = pool_keyhash;
        this._epoch = epoch;
    }
    static new(pool_keyhash, epoch) {
        return new PoolRetirement(pool_keyhash, epoch);
    }
    pool_keyhash() {
        return this._pool_keyhash;
    }
    set_pool_keyhash(pool_keyhash) {
        this._pool_keyhash = pool_keyhash;
    }
    epoch() {
        return this._epoch;
    }
    set_epoch(epoch) {
        this._epoch = epoch;
    }
    static deserialize(reader, path) {
        let pool_keyhash = Ed25519KeyHash.deserialize(reader, [
            ...path,
            "pool_keyhash",
        ]);
        let epoch = Number(reader.readInt([...path, "epoch"]));
        return new PoolRetirement(pool_keyhash, epoch);
    }
    serialize(writer) {
        this._pool_keyhash.serialize(writer);
        writer.writeInt(BigInt(this._epoch));
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["PoolRetirement"]) {
        let reader = new CBORReader(data);
        return PoolRetirement.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["PoolRetirement"]) {
        return PoolRetirement.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return PoolRetirement.from_bytes(this.to_bytes(), path);
    }
}
export class PoolVotingThresholds {
    _motion_no_confidence;
    _committee_normal;
    _committee_no_confidence;
    _hard_fork_initiation;
    _security_relevant_threshold;
    constructor(motion_no_confidence, committee_normal, committee_no_confidence, hard_fork_initiation, security_relevant_threshold) {
        this._motion_no_confidence = motion_no_confidence;
        this._committee_normal = committee_normal;
        this._committee_no_confidence = committee_no_confidence;
        this._hard_fork_initiation = hard_fork_initiation;
        this._security_relevant_threshold = security_relevant_threshold;
    }
    static new(motion_no_confidence, committee_normal, committee_no_confidence, hard_fork_initiation, security_relevant_threshold) {
        return new PoolVotingThresholds(motion_no_confidence, committee_normal, committee_no_confidence, hard_fork_initiation, security_relevant_threshold);
    }
    motion_no_confidence() {
        return this._motion_no_confidence;
    }
    set_motion_no_confidence(motion_no_confidence) {
        this._motion_no_confidence = motion_no_confidence;
    }
    committee_normal() {
        return this._committee_normal;
    }
    set_committee_normal(committee_normal) {
        this._committee_normal = committee_normal;
    }
    committee_no_confidence() {
        return this._committee_no_confidence;
    }
    set_committee_no_confidence(committee_no_confidence) {
        this._committee_no_confidence = committee_no_confidence;
    }
    hard_fork_initiation() {
        return this._hard_fork_initiation;
    }
    set_hard_fork_initiation(hard_fork_initiation) {
        this._hard_fork_initiation = hard_fork_initiation;
    }
    security_relevant_threshold() {
        return this._security_relevant_threshold;
    }
    set_security_relevant_threshold(security_relevant_threshold) {
        this._security_relevant_threshold = security_relevant_threshold;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 5) {
            throw new Error("Insufficient number of fields in record. Expected at least 5. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const motion_no_confidence_path = [
            ...path,
            "UnitInterval(motion_no_confidence)",
        ];
        let motion_no_confidence = UnitInterval.deserialize(reader, motion_no_confidence_path);
        const committee_normal_path = [...path, "UnitInterval(committee_normal)"];
        let committee_normal = UnitInterval.deserialize(reader, committee_normal_path);
        const committee_no_confidence_path = [
            ...path,
            "UnitInterval(committee_no_confidence)",
        ];
        let committee_no_confidence = UnitInterval.deserialize(reader, committee_no_confidence_path);
        const hard_fork_initiation_path = [
            ...path,
            "UnitInterval(hard_fork_initiation)",
        ];
        let hard_fork_initiation = UnitInterval.deserialize(reader, hard_fork_initiation_path);
        const security_relevant_threshold_path = [
            ...path,
            "UnitInterval(security_relevant_threshold)",
        ];
        let security_relevant_threshold = UnitInterval.deserialize(reader, security_relevant_threshold_path);
        return new PoolVotingThresholds(motion_no_confidence, committee_normal, committee_no_confidence, hard_fork_initiation, security_relevant_threshold);
    }
    serialize(writer) {
        let arrayLen = 5;
        writer.writeArrayTag(arrayLen);
        this._motion_no_confidence.serialize(writer);
        this._committee_normal.serialize(writer);
        this._committee_no_confidence.serialize(writer);
        this._hard_fork_initiation.serialize(writer);
        this._security_relevant_threshold.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["PoolVotingThresholds"]) {
        let reader = new CBORReader(data);
        return PoolVotingThresholds.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["PoolVotingThresholds"]) {
        return PoolVotingThresholds.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return PoolVotingThresholds.from_bytes(this.to_bytes(), path);
    }
}
export class PostAlonzoTransactionOutput {
    _address;
    _amount;
    _datum_option;
    _script_ref;
    constructor(address, amount, datum_option, script_ref) {
        this._address = address;
        this._amount = amount;
        this._datum_option = datum_option;
        this._script_ref = script_ref;
    }
    static new(address, amount, datum_option, script_ref) {
        return new PostAlonzoTransactionOutput(address, amount, datum_option, script_ref);
    }
    address() {
        return this._address;
    }
    set_address(address) {
        this._address = address;
    }
    amount() {
        return this._amount;
    }
    set_amount(amount) {
        this._amount = amount;
    }
    datum_option() {
        return this._datum_option;
    }
    set_datum_option(datum_option) {
        this._datum_option = datum_option;
    }
    script_ref() {
        return this._script_ref;
    }
    set_script_ref(script_ref) {
        this._script_ref = script_ref;
    }
    static deserialize(reader, path) {
        let fields = {};
        reader.readMap((r) => {
            let key = Number(r.readUint(path));
            switch (key) {
                case 0: {
                    const new_path = [...path, "Address(address)"];
                    fields.address = Address.deserialize(r, new_path);
                    break;
                }
                case 1: {
                    const new_path = [...path, "Value(amount)"];
                    fields.amount = Value.deserialize(r, new_path);
                    break;
                }
                case 2: {
                    const new_path = [...path, "DataOption(datum_option)"];
                    fields.datum_option = DataOption.deserialize(r, new_path);
                    break;
                }
                case 3: {
                    const new_path = [...path, "ScriptRef(script_ref)"];
                    fields.script_ref = ScriptRef.deserialize(r, new_path);
                    break;
                }
            }
        }, path);
        if (fields.address === undefined)
            throw new Error("Value not provided for field 0 (address) (at " + path.join("/") + ")");
        let address = fields.address;
        if (fields.amount === undefined)
            throw new Error("Value not provided for field 1 (amount) (at " + path.join("/") + ")");
        let amount = fields.amount;
        let datum_option = fields.datum_option;
        let script_ref = fields.script_ref;
        return new PostAlonzoTransactionOutput(address, amount, datum_option, script_ref);
    }
    serialize(writer) {
        let len = 4;
        if (this._datum_option === undefined)
            len -= 1;
        if (this._script_ref === undefined)
            len -= 1;
        writer.writeMapTag(len);
        writer.writeInt(0n);
        this._address.serialize(writer);
        writer.writeInt(1n);
        this._amount.serialize(writer);
        if (this._datum_option !== undefined) {
            writer.writeInt(2n);
            this._datum_option.serialize(writer);
        }
        if (this._script_ref !== undefined) {
            writer.writeInt(3n);
            this._script_ref.serialize(writer);
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["PostAlonzoTransactionOutput"]) {
        let reader = new CBORReader(data);
        return PostAlonzoTransactionOutput.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["PostAlonzoTransactionOutput"]) {
        return PostAlonzoTransactionOutput.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return PostAlonzoTransactionOutput.from_bytes(this.to_bytes(), path);
    }
}
export class PreBabbageTransactionOutput {
    _address;
    _amount;
    _datum_hash;
    constructor(address, amount, datum_hash) {
        this._address = address;
        this._amount = amount;
        this._datum_hash = datum_hash;
    }
    static new(address, amount, datum_hash) {
        return new PreBabbageTransactionOutput(address, amount, datum_hash);
    }
    address() {
        return this._address;
    }
    set_address(address) {
        this._address = address;
    }
    amount() {
        return this._amount;
    }
    set_amount(amount) {
        this._amount = amount;
    }
    datum_hash() {
        return this._datum_hash;
    }
    set_datum_hash(datum_hash) {
        this._datum_hash = datum_hash;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 2) {
            throw new Error("Insufficient number of fields in record. Expected at least 2. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const address_path = [...path, "Address(address)"];
        let address = Address.deserialize(reader, address_path);
        const amount_path = [...path, "Value(amount)"];
        let amount = Value.deserialize(reader, amount_path);
        const datum_hash_path = [...path, "DataHash(datum_hash)"];
        let datum_hash = len != null && len > 2
            ? DataHash.deserialize(reader, datum_hash_path)
            : undefined;
        return new PreBabbageTransactionOutput(address, amount, datum_hash);
    }
    serialize(writer) {
        let arrayLen = 2;
        if (this._datum_hash) {
            arrayLen++;
        }
        writer.writeArrayTag(arrayLen);
        this._address.serialize(writer);
        this._amount.serialize(writer);
        if (this._datum_hash) {
            this._datum_hash.serialize(writer);
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["PreBabbageTransactionOutput"]) {
        let reader = new CBORReader(data);
        return PreBabbageTransactionOutput.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["PreBabbageTransactionOutput"]) {
        return PreBabbageTransactionOutput.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return PreBabbageTransactionOutput.from_bytes(this.to_bytes(), path);
    }
}
export class PrivateKey {
    inner;
    options;
    constructor(inner, options) {
        this.inner = inner;
        this.options = options;
    }
    static new(inner) {
        return new PrivateKey(inner);
    }
    as_bytes() {
        return this.inner;
    }
    to_hex() {
        return bytesToHex(this.as_bytes());
    }
    static deserialize(reader, path) {
        return new PrivateKey(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeBytes(this.inner);
    }
    static _KEY_LEN = 32;
    static _EXT_KEY_LEN = 64;
    static _BECH32_HRP = "ed25519_sk";
    static _EXT_BECH32_HRP = "ed25519e_sk";
    free() {
        for (let i = 0; i < this.inner.length; i++) {
            this.inner[i] = 0x00;
        }
    }
    static from_normal_bytes(bytes) {
        if (bytes.length != PrivateKey._KEY_LEN)
            throw new Error(`Must be ${PrivateKey._KEY_LEN} bytes long`);
        return new PrivateKey(bytes, { isExtended: false });
    }
    static from_extended_bytes(bytes) {
        if (bytes.length != PrivateKey._EXT_KEY_LEN)
            throw new Error(`Must be ${PrivateKey._EXT_KEY_LEN} bytes long`);
        return new PrivateKey(bytes, { isExtended: true });
    }
    to_bech32() {
        let prefix = this.options?.isExtended
            ? PrivateKey._EXT_BECH32_HRP
            : PrivateKey._BECH32_HRP;
        return bech32.encode(prefix, bech32.toWords(this.inner), Number.MAX_SAFE_INTEGER);
    }
    static from_bech32(bech_str) {
        let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
        let words = decoded.words;
        let bytesArray = bech32.fromWords(words);
        let bytes = new Uint8Array(bytesArray);
        if (decoded.prefix == PrivateKey._BECH32_HRP) {
            return PrivateKey.from_normal_bytes(bytes);
        }
        else if (decoded.prefix == PrivateKey._EXT_BECH32_HRP) {
            return PrivateKey.from_extended_bytes(bytes);
        }
        else {
            throw new Error("Invalid prefix for PrivateKey: " + decoded.prefix);
        }
    }
    static generate_ed25519() {
        let bytes = cdlCrypto.getRandomBytes(PrivateKey._KEY_LEN);
        return PrivateKey.from_normal_bytes(bytes);
    }
    static generate_ed25519extended() {
        let bytes = cdlCrypto.getRandomBytes(PrivateKey._EXT_KEY_LEN);
        return PrivateKey.from_extended_bytes(bytes);
    }
    sign(message) {
        let sigBytes;
        if (this.options?.isExtended) {
            sigBytes = cdlCrypto.signExtended(message, this.inner);
        }
        else {
            sigBytes = cdlCrypto.sign(message, this.inner);
        }
        return new Ed25519Signature(sigBytes);
    }
    to_public() {
        let pubkeyBytes;
        if (this.options?.isExtended) {
            pubkeyBytes = cdlCrypto.secretToPubkey(this.inner);
        }
        else {
            pubkeyBytes = cdlCrypto.extendedToPubkey(this.inner);
        }
        return new PublicKey(pubkeyBytes);
    }
    static _from_bytes(bytes) {
        if (bytes.length == PrivateKey._KEY_LEN) {
            return PrivateKey.from_normal_bytes(bytes);
        }
        else if (bytes.length == PrivateKey._EXT_KEY_LEN) {
            return PrivateKey.from_extended_bytes(bytes);
        }
        else {
            throw new Error("Invalid bytes length for PrivateKey: " + bytes.length);
        }
    }
    static from_hex(hex_str) {
        return PrivateKey._from_bytes(hexToBytes(hex_str));
    }
}
export class ProposedProtocolParameterUpdates {
    _items;
    constructor(items) {
        this._items = items;
    }
    static new() {
        return new ProposedProtocolParameterUpdates([]);
    }
    len() {
        return this._items.length;
    }
    insert(key, value) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry != null) {
            let ret = entry[1];
            entry[1] = value;
            return ret;
        }
        this._items.push([key, value]);
        return undefined;
    }
    get(key) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry == null)
            return undefined;
        return entry[1];
    }
    _remove_many(keys) {
        this._items = this._items.filter(([k, _v]) => keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())));
    }
    keys() {
        let keys = GenesisHashes.new();
        for (let [key, _] of this._items)
            keys.add(key);
        return keys;
    }
    static deserialize(reader, path) {
        let ret = new ProposedProtocolParameterUpdates([]);
        reader.readMap((reader, idx) => ret.insert(GenesisHash.deserialize(reader, [...path, "GenesisHash#" + idx]), ProtocolParamUpdate.deserialize(reader, [
            ...path,
            "ProtocolParamUpdate#" + idx,
        ])), path);
        return ret;
    }
    serialize(writer) {
        writer.writeMap(this._items, (writer, x) => {
            x[0].serialize(writer);
            x[1].serialize(writer);
        });
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["ProposedProtocolParameterUpdates"]) {
        let reader = new CBORReader(data);
        return ProposedProtocolParameterUpdates.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["ProposedProtocolParameterUpdates"]) {
        return ProposedProtocolParameterUpdates.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return ProposedProtocolParameterUpdates.from_bytes(this.to_bytes(), path);
    }
}
export class ProtocolParamUpdate {
    _minfee_a;
    _minfee_b;
    _max_block_body_size;
    _max_tx_size;
    _max_block_header_size;
    _key_deposit;
    _pool_deposit;
    _max_epoch;
    _n_opt;
    _pool_pledge_influence;
    _expansion_rate;
    _treasury_growth_rate;
    _min_pool_cost;
    _ada_per_utxo_byte;
    _cost_models;
    _execution_costs;
    _max_tx_ex_units;
    _max_block_ex_units;
    _max_value_size;
    _collateral_percentage;
    _max_collateral_inputs;
    _pool_voting_thresholds;
    _drep_voting_thresholds;
    _min_committee_size;
    _committee_term_limit;
    _governance_action_validity_period;
    _governance_action_deposit;
    _drep_deposit;
    _drep_inactivity_period;
    _ref_script_coins_per_byte;
    constructor(minfee_a, minfee_b, max_block_body_size, max_tx_size, max_block_header_size, key_deposit, pool_deposit, max_epoch, n_opt, pool_pledge_influence, expansion_rate, treasury_growth_rate, min_pool_cost, ada_per_utxo_byte, cost_models, execution_costs, max_tx_ex_units, max_block_ex_units, max_value_size, collateral_percentage, max_collateral_inputs, pool_voting_thresholds, drep_voting_thresholds, min_committee_size, committee_term_limit, governance_action_validity_period, governance_action_deposit, drep_deposit, drep_inactivity_period, ref_script_coins_per_byte) {
        this._minfee_a = minfee_a;
        this._minfee_b = minfee_b;
        this._max_block_body_size = max_block_body_size;
        this._max_tx_size = max_tx_size;
        this._max_block_header_size = max_block_header_size;
        this._key_deposit = key_deposit;
        this._pool_deposit = pool_deposit;
        this._max_epoch = max_epoch;
        this._n_opt = n_opt;
        this._pool_pledge_influence = pool_pledge_influence;
        this._expansion_rate = expansion_rate;
        this._treasury_growth_rate = treasury_growth_rate;
        this._min_pool_cost = min_pool_cost;
        this._ada_per_utxo_byte = ada_per_utxo_byte;
        this._cost_models = cost_models;
        this._execution_costs = execution_costs;
        this._max_tx_ex_units = max_tx_ex_units;
        this._max_block_ex_units = max_block_ex_units;
        this._max_value_size = max_value_size;
        this._collateral_percentage = collateral_percentage;
        this._max_collateral_inputs = max_collateral_inputs;
        this._pool_voting_thresholds = pool_voting_thresholds;
        this._drep_voting_thresholds = drep_voting_thresholds;
        this._min_committee_size = min_committee_size;
        this._committee_term_limit = committee_term_limit;
        this._governance_action_validity_period = governance_action_validity_period;
        this._governance_action_deposit = governance_action_deposit;
        this._drep_deposit = drep_deposit;
        this._drep_inactivity_period = drep_inactivity_period;
        this._ref_script_coins_per_byte = ref_script_coins_per_byte;
    }
    minfee_a() {
        return this._minfee_a;
    }
    set_minfee_a(minfee_a) {
        this._minfee_a = minfee_a;
    }
    minfee_b() {
        return this._minfee_b;
    }
    set_minfee_b(minfee_b) {
        this._minfee_b = minfee_b;
    }
    max_block_body_size() {
        return this._max_block_body_size;
    }
    set_max_block_body_size(max_block_body_size) {
        this._max_block_body_size = max_block_body_size;
    }
    max_tx_size() {
        return this._max_tx_size;
    }
    set_max_tx_size(max_tx_size) {
        this._max_tx_size = max_tx_size;
    }
    max_block_header_size() {
        return this._max_block_header_size;
    }
    set_max_block_header_size(max_block_header_size) {
        this._max_block_header_size = max_block_header_size;
    }
    key_deposit() {
        return this._key_deposit;
    }
    set_key_deposit(key_deposit) {
        this._key_deposit = key_deposit;
    }
    pool_deposit() {
        return this._pool_deposit;
    }
    set_pool_deposit(pool_deposit) {
        this._pool_deposit = pool_deposit;
    }
    max_epoch() {
        return this._max_epoch;
    }
    set_max_epoch(max_epoch) {
        this._max_epoch = max_epoch;
    }
    n_opt() {
        return this._n_opt;
    }
    set_n_opt(n_opt) {
        this._n_opt = n_opt;
    }
    pool_pledge_influence() {
        return this._pool_pledge_influence;
    }
    set_pool_pledge_influence(pool_pledge_influence) {
        this._pool_pledge_influence = pool_pledge_influence;
    }
    expansion_rate() {
        return this._expansion_rate;
    }
    set_expansion_rate(expansion_rate) {
        this._expansion_rate = expansion_rate;
    }
    treasury_growth_rate() {
        return this._treasury_growth_rate;
    }
    set_treasury_growth_rate(treasury_growth_rate) {
        this._treasury_growth_rate = treasury_growth_rate;
    }
    min_pool_cost() {
        return this._min_pool_cost;
    }
    set_min_pool_cost(min_pool_cost) {
        this._min_pool_cost = min_pool_cost;
    }
    ada_per_utxo_byte() {
        return this._ada_per_utxo_byte;
    }
    set_ada_per_utxo_byte(ada_per_utxo_byte) {
        this._ada_per_utxo_byte = ada_per_utxo_byte;
    }
    cost_models() {
        return this._cost_models;
    }
    set_cost_models(cost_models) {
        this._cost_models = cost_models;
    }
    execution_costs() {
        return this._execution_costs;
    }
    set_execution_costs(execution_costs) {
        this._execution_costs = execution_costs;
    }
    max_tx_ex_units() {
        return this._max_tx_ex_units;
    }
    set_max_tx_ex_units(max_tx_ex_units) {
        this._max_tx_ex_units = max_tx_ex_units;
    }
    max_block_ex_units() {
        return this._max_block_ex_units;
    }
    set_max_block_ex_units(max_block_ex_units) {
        this._max_block_ex_units = max_block_ex_units;
    }
    max_value_size() {
        return this._max_value_size;
    }
    set_max_value_size(max_value_size) {
        this._max_value_size = max_value_size;
    }
    collateral_percentage() {
        return this._collateral_percentage;
    }
    set_collateral_percentage(collateral_percentage) {
        this._collateral_percentage = collateral_percentage;
    }
    max_collateral_inputs() {
        return this._max_collateral_inputs;
    }
    set_max_collateral_inputs(max_collateral_inputs) {
        this._max_collateral_inputs = max_collateral_inputs;
    }
    pool_voting_thresholds() {
        return this._pool_voting_thresholds;
    }
    set_pool_voting_thresholds(pool_voting_thresholds) {
        this._pool_voting_thresholds = pool_voting_thresholds;
    }
    drep_voting_thresholds() {
        return this._drep_voting_thresholds;
    }
    set_drep_voting_thresholds(drep_voting_thresholds) {
        this._drep_voting_thresholds = drep_voting_thresholds;
    }
    min_committee_size() {
        return this._min_committee_size;
    }
    set_min_committee_size(min_committee_size) {
        this._min_committee_size = min_committee_size;
    }
    committee_term_limit() {
        return this._committee_term_limit;
    }
    set_committee_term_limit(committee_term_limit) {
        this._committee_term_limit = committee_term_limit;
    }
    governance_action_validity_period() {
        return this._governance_action_validity_period;
    }
    set_governance_action_validity_period(governance_action_validity_period) {
        this._governance_action_validity_period = governance_action_validity_period;
    }
    governance_action_deposit() {
        return this._governance_action_deposit;
    }
    set_governance_action_deposit(governance_action_deposit) {
        this._governance_action_deposit = governance_action_deposit;
    }
    drep_deposit() {
        return this._drep_deposit;
    }
    set_drep_deposit(drep_deposit) {
        this._drep_deposit = drep_deposit;
    }
    drep_inactivity_period() {
        return this._drep_inactivity_period;
    }
    set_drep_inactivity_period(drep_inactivity_period) {
        this._drep_inactivity_period = drep_inactivity_period;
    }
    ref_script_coins_per_byte() {
        return this._ref_script_coins_per_byte;
    }
    set_ref_script_coins_per_byte(ref_script_coins_per_byte) {
        this._ref_script_coins_per_byte = ref_script_coins_per_byte;
    }
    static deserialize(reader, path) {
        let fields = {};
        reader.readMap((r) => {
            let key = Number(r.readUint(path));
            switch (key) {
                case 0: {
                    const new_path = [...path, "BigNum(minfee_a)"];
                    fields.minfee_a = BigNum.deserialize(r, new_path);
                    break;
                }
                case 1: {
                    const new_path = [...path, "BigNum(minfee_b)"];
                    fields.minfee_b = BigNum.deserialize(r, new_path);
                    break;
                }
                case 2: {
                    const new_path = [...path, "number(max_block_body_size)"];
                    fields.max_block_body_size = Number(r.readInt(new_path));
                    break;
                }
                case 3: {
                    const new_path = [...path, "number(max_tx_size)"];
                    fields.max_tx_size = Number(r.readInt(new_path));
                    break;
                }
                case 4: {
                    const new_path = [...path, "number(max_block_header_size)"];
                    fields.max_block_header_size = Number(r.readInt(new_path));
                    break;
                }
                case 5: {
                    const new_path = [...path, "BigNum(key_deposit)"];
                    fields.key_deposit = BigNum.deserialize(r, new_path);
                    break;
                }
                case 6: {
                    const new_path = [...path, "BigNum(pool_deposit)"];
                    fields.pool_deposit = BigNum.deserialize(r, new_path);
                    break;
                }
                case 7: {
                    const new_path = [...path, "number(max_epoch)"];
                    fields.max_epoch = Number(r.readInt(new_path));
                    break;
                }
                case 8: {
                    const new_path = [...path, "number(n_opt)"];
                    fields.n_opt = Number(r.readInt(new_path));
                    break;
                }
                case 9: {
                    const new_path = [...path, "UnitInterval(pool_pledge_influence)"];
                    fields.pool_pledge_influence = UnitInterval.deserialize(r, new_path);
                    break;
                }
                case 10: {
                    const new_path = [...path, "UnitInterval(expansion_rate)"];
                    fields.expansion_rate = UnitInterval.deserialize(r, new_path);
                    break;
                }
                case 11: {
                    const new_path = [...path, "UnitInterval(treasury_growth_rate)"];
                    fields.treasury_growth_rate = UnitInterval.deserialize(r, new_path);
                    break;
                }
                case 16: {
                    const new_path = [...path, "BigNum(min_pool_cost)"];
                    fields.min_pool_cost = BigNum.deserialize(r, new_path);
                    break;
                }
                case 17: {
                    const new_path = [...path, "BigNum(ada_per_utxo_byte)"];
                    fields.ada_per_utxo_byte = BigNum.deserialize(r, new_path);
                    break;
                }
                case 18: {
                    const new_path = [...path, "Costmdls(cost_models)"];
                    fields.cost_models = Costmdls.deserialize(r, new_path);
                    break;
                }
                case 19: {
                    const new_path = [...path, "ExUnitPrices(execution_costs)"];
                    fields.execution_costs = ExUnitPrices.deserialize(r, new_path);
                    break;
                }
                case 20: {
                    const new_path = [...path, "ExUnits(max_tx_ex_units)"];
                    fields.max_tx_ex_units = ExUnits.deserialize(r, new_path);
                    break;
                }
                case 21: {
                    const new_path = [...path, "ExUnits(max_block_ex_units)"];
                    fields.max_block_ex_units = ExUnits.deserialize(r, new_path);
                    break;
                }
                case 22: {
                    const new_path = [...path, "number(max_value_size)"];
                    fields.max_value_size = Number(r.readInt(new_path));
                    break;
                }
                case 23: {
                    const new_path = [...path, "number(collateral_percentage)"];
                    fields.collateral_percentage = Number(r.readInt(new_path));
                    break;
                }
                case 24: {
                    const new_path = [...path, "number(max_collateral_inputs)"];
                    fields.max_collateral_inputs = Number(r.readInt(new_path));
                    break;
                }
                case 25: {
                    const new_path = [
                        ...path,
                        "PoolVotingThresholds(pool_voting_thresholds)",
                    ];
                    fields.pool_voting_thresholds = PoolVotingThresholds.deserialize(r, new_path);
                    break;
                }
                case 26: {
                    const new_path = [
                        ...path,
                        "DRepVotingThresholds(drep_voting_thresholds)",
                    ];
                    fields.drep_voting_thresholds = DRepVotingThresholds.deserialize(r, new_path);
                    break;
                }
                case 27: {
                    const new_path = [...path, "number(min_committee_size)"];
                    fields.min_committee_size = Number(r.readInt(new_path));
                    break;
                }
                case 28: {
                    const new_path = [...path, "number(committee_term_limit)"];
                    fields.committee_term_limit = Number(r.readInt(new_path));
                    break;
                }
                case 29: {
                    const new_path = [
                        ...path,
                        "number(governance_action_validity_period)",
                    ];
                    fields.governance_action_validity_period = Number(r.readInt(new_path));
                    break;
                }
                case 30: {
                    const new_path = [...path, "BigNum(governance_action_deposit)"];
                    fields.governance_action_deposit = BigNum.deserialize(r, new_path);
                    break;
                }
                case 31: {
                    const new_path = [...path, "BigNum(drep_deposit)"];
                    fields.drep_deposit = BigNum.deserialize(r, new_path);
                    break;
                }
                case 32: {
                    const new_path = [...path, "number(drep_inactivity_period)"];
                    fields.drep_inactivity_period = Number(r.readInt(new_path));
                    break;
                }
                case 33: {
                    const new_path = [...path, "UnitInterval(ref_script_coins_per_byte)"];
                    fields.ref_script_coins_per_byte = UnitInterval.deserialize(r, new_path);
                    break;
                }
            }
        }, path);
        let minfee_a = fields.minfee_a;
        let minfee_b = fields.minfee_b;
        let max_block_body_size = fields.max_block_body_size;
        let max_tx_size = fields.max_tx_size;
        let max_block_header_size = fields.max_block_header_size;
        let key_deposit = fields.key_deposit;
        let pool_deposit = fields.pool_deposit;
        let max_epoch = fields.max_epoch;
        let n_opt = fields.n_opt;
        let pool_pledge_influence = fields.pool_pledge_influence;
        let expansion_rate = fields.expansion_rate;
        let treasury_growth_rate = fields.treasury_growth_rate;
        let min_pool_cost = fields.min_pool_cost;
        let ada_per_utxo_byte = fields.ada_per_utxo_byte;
        let cost_models = fields.cost_models;
        let execution_costs = fields.execution_costs;
        let max_tx_ex_units = fields.max_tx_ex_units;
        let max_block_ex_units = fields.max_block_ex_units;
        let max_value_size = fields.max_value_size;
        let collateral_percentage = fields.collateral_percentage;
        let max_collateral_inputs = fields.max_collateral_inputs;
        let pool_voting_thresholds = fields.pool_voting_thresholds;
        let drep_voting_thresholds = fields.drep_voting_thresholds;
        let min_committee_size = fields.min_committee_size;
        let committee_term_limit = fields.committee_term_limit;
        let governance_action_validity_period = fields.governance_action_validity_period;
        let governance_action_deposit = fields.governance_action_deposit;
        let drep_deposit = fields.drep_deposit;
        let drep_inactivity_period = fields.drep_inactivity_period;
        let ref_script_coins_per_byte = fields.ref_script_coins_per_byte;
        return new ProtocolParamUpdate(minfee_a, minfee_b, max_block_body_size, max_tx_size, max_block_header_size, key_deposit, pool_deposit, max_epoch, n_opt, pool_pledge_influence, expansion_rate, treasury_growth_rate, min_pool_cost, ada_per_utxo_byte, cost_models, execution_costs, max_tx_ex_units, max_block_ex_units, max_value_size, collateral_percentage, max_collateral_inputs, pool_voting_thresholds, drep_voting_thresholds, min_committee_size, committee_term_limit, governance_action_validity_period, governance_action_deposit, drep_deposit, drep_inactivity_period, ref_script_coins_per_byte);
    }
    serialize(writer) {
        let len = 30;
        if (this._minfee_a === undefined)
            len -= 1;
        if (this._minfee_b === undefined)
            len -= 1;
        if (this._max_block_body_size === undefined)
            len -= 1;
        if (this._max_tx_size === undefined)
            len -= 1;
        if (this._max_block_header_size === undefined)
            len -= 1;
        if (this._key_deposit === undefined)
            len -= 1;
        if (this._pool_deposit === undefined)
            len -= 1;
        if (this._max_epoch === undefined)
            len -= 1;
        if (this._n_opt === undefined)
            len -= 1;
        if (this._pool_pledge_influence === undefined)
            len -= 1;
        if (this._expansion_rate === undefined)
            len -= 1;
        if (this._treasury_growth_rate === undefined)
            len -= 1;
        if (this._min_pool_cost === undefined)
            len -= 1;
        if (this._ada_per_utxo_byte === undefined)
            len -= 1;
        if (this._cost_models === undefined)
            len -= 1;
        if (this._execution_costs === undefined)
            len -= 1;
        if (this._max_tx_ex_units === undefined)
            len -= 1;
        if (this._max_block_ex_units === undefined)
            len -= 1;
        if (this._max_value_size === undefined)
            len -= 1;
        if (this._collateral_percentage === undefined)
            len -= 1;
        if (this._max_collateral_inputs === undefined)
            len -= 1;
        if (this._pool_voting_thresholds === undefined)
            len -= 1;
        if (this._drep_voting_thresholds === undefined)
            len -= 1;
        if (this._min_committee_size === undefined)
            len -= 1;
        if (this._committee_term_limit === undefined)
            len -= 1;
        if (this._governance_action_validity_period === undefined)
            len -= 1;
        if (this._governance_action_deposit === undefined)
            len -= 1;
        if (this._drep_deposit === undefined)
            len -= 1;
        if (this._drep_inactivity_period === undefined)
            len -= 1;
        if (this._ref_script_coins_per_byte === undefined)
            len -= 1;
        writer.writeMapTag(len);
        if (this._minfee_a !== undefined) {
            writer.writeInt(0n);
            this._minfee_a.serialize(writer);
        }
        if (this._minfee_b !== undefined) {
            writer.writeInt(1n);
            this._minfee_b.serialize(writer);
        }
        if (this._max_block_body_size !== undefined) {
            writer.writeInt(2n);
            writer.writeInt(BigInt(this._max_block_body_size));
        }
        if (this._max_tx_size !== undefined) {
            writer.writeInt(3n);
            writer.writeInt(BigInt(this._max_tx_size));
        }
        if (this._max_block_header_size !== undefined) {
            writer.writeInt(4n);
            writer.writeInt(BigInt(this._max_block_header_size));
        }
        if (this._key_deposit !== undefined) {
            writer.writeInt(5n);
            this._key_deposit.serialize(writer);
        }
        if (this._pool_deposit !== undefined) {
            writer.writeInt(6n);
            this._pool_deposit.serialize(writer);
        }
        if (this._max_epoch !== undefined) {
            writer.writeInt(7n);
            writer.writeInt(BigInt(this._max_epoch));
        }
        if (this._n_opt !== undefined) {
            writer.writeInt(8n);
            writer.writeInt(BigInt(this._n_opt));
        }
        if (this._pool_pledge_influence !== undefined) {
            writer.writeInt(9n);
            this._pool_pledge_influence.serialize(writer);
        }
        if (this._expansion_rate !== undefined) {
            writer.writeInt(10n);
            this._expansion_rate.serialize(writer);
        }
        if (this._treasury_growth_rate !== undefined) {
            writer.writeInt(11n);
            this._treasury_growth_rate.serialize(writer);
        }
        if (this._min_pool_cost !== undefined) {
            writer.writeInt(16n);
            this._min_pool_cost.serialize(writer);
        }
        if (this._ada_per_utxo_byte !== undefined) {
            writer.writeInt(17n);
            this._ada_per_utxo_byte.serialize(writer);
        }
        if (this._cost_models !== undefined) {
            writer.writeInt(18n);
            this._cost_models.serialize(writer);
        }
        if (this._execution_costs !== undefined) {
            writer.writeInt(19n);
            this._execution_costs.serialize(writer);
        }
        if (this._max_tx_ex_units !== undefined) {
            writer.writeInt(20n);
            this._max_tx_ex_units.serialize(writer);
        }
        if (this._max_block_ex_units !== undefined) {
            writer.writeInt(21n);
            this._max_block_ex_units.serialize(writer);
        }
        if (this._max_value_size !== undefined) {
            writer.writeInt(22n);
            writer.writeInt(BigInt(this._max_value_size));
        }
        if (this._collateral_percentage !== undefined) {
            writer.writeInt(23n);
            writer.writeInt(BigInt(this._collateral_percentage));
        }
        if (this._max_collateral_inputs !== undefined) {
            writer.writeInt(24n);
            writer.writeInt(BigInt(this._max_collateral_inputs));
        }
        if (this._pool_voting_thresholds !== undefined) {
            writer.writeInt(25n);
            this._pool_voting_thresholds.serialize(writer);
        }
        if (this._drep_voting_thresholds !== undefined) {
            writer.writeInt(26n);
            this._drep_voting_thresholds.serialize(writer);
        }
        if (this._min_committee_size !== undefined) {
            writer.writeInt(27n);
            writer.writeInt(BigInt(this._min_committee_size));
        }
        if (this._committee_term_limit !== undefined) {
            writer.writeInt(28n);
            writer.writeInt(BigInt(this._committee_term_limit));
        }
        if (this._governance_action_validity_period !== undefined) {
            writer.writeInt(29n);
            writer.writeInt(BigInt(this._governance_action_validity_period));
        }
        if (this._governance_action_deposit !== undefined) {
            writer.writeInt(30n);
            this._governance_action_deposit.serialize(writer);
        }
        if (this._drep_deposit !== undefined) {
            writer.writeInt(31n);
            this._drep_deposit.serialize(writer);
        }
        if (this._drep_inactivity_period !== undefined) {
            writer.writeInt(32n);
            writer.writeInt(BigInt(this._drep_inactivity_period));
        }
        if (this._ref_script_coins_per_byte !== undefined) {
            writer.writeInt(33n);
            this._ref_script_coins_per_byte.serialize(writer);
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["ProtocolParamUpdate"]) {
        let reader = new CBORReader(data);
        return ProtocolParamUpdate.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["ProtocolParamUpdate"]) {
        return ProtocolParamUpdate.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return ProtocolParamUpdate.from_bytes(this.to_bytes(), path);
    }
    static new() {
        return new ProtocolParamUpdate(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    }
}
export class ProtocolVersion {
    _major;
    _minor;
    constructor(major, minor) {
        this._major = major;
        this._minor = minor;
    }
    static new(major, minor) {
        return new ProtocolVersion(major, minor);
    }
    major() {
        return this._major;
    }
    set_major(major) {
        this._major = major;
    }
    minor() {
        return this._minor;
    }
    set_minor(minor) {
        this._minor = minor;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 2) {
            throw new Error("Insufficient number of fields in record. Expected at least 2. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const major_path = [...path, "number(major)"];
        let major = Number(reader.readInt(major_path));
        const minor_path = [...path, "number(minor)"];
        let minor = Number(reader.readInt(minor_path));
        return new ProtocolVersion(major, minor);
    }
    serialize(writer) {
        let arrayLen = 2;
        writer.writeArrayTag(arrayLen);
        writer.writeInt(BigInt(this._major));
        writer.writeInt(BigInt(this._minor));
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["ProtocolVersion"]) {
        let reader = new CBORReader(data);
        return ProtocolVersion.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["ProtocolVersion"]) {
        return ProtocolVersion.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return ProtocolVersion.from_bytes(this.to_bytes(), path);
    }
}
export class PublicKey {
    inner;
    constructor(inner) {
        if (inner.length != 32)
            throw new Error("Expected length to be 32");
        this.inner = inner;
    }
    static new(inner) {
        return new PublicKey(inner);
    }
    // no-op
    free() { }
    static from_bytes(data) {
        return new PublicKey(data);
    }
    static from_hex(hex_str) {
        return PublicKey.from_bytes(hexToBytes(hex_str));
    }
    as_bytes() {
        return this.inner;
    }
    to_hex() {
        return bytesToHex(this.as_bytes());
    }
    clone() {
        return PublicKey.from_bytes(this.as_bytes());
    }
    static deserialize(reader, path) {
        return new PublicKey(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeBytes(this.inner);
    }
    static _BECH32_HRP = "ed25519_pk";
    hash() {
        return new Ed25519KeyHash(cdlCrypto.blake2b224(this.inner));
    }
    verify(data, signature) {
        return cdlCrypto.verify(data, signature.to_bytes(), this.inner);
    }
    static from_bech32(bech_str) {
        let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
        let words = decoded.words;
        let bytesArray = bech32.fromWords(words);
        let bytes = new Uint8Array(bytesArray);
        if (decoded.prefix == PublicKey._BECH32_HRP) {
            return new PublicKey(bytes);
        }
        else {
            throw new Error("Invalid prefix for PublicKey: " + decoded.prefix);
        }
    }
    to_bech32() {
        let prefix = PublicKey._BECH32_HRP;
        return bech32.encode(prefix, bech32.toWords(this.inner), Number.MAX_SAFE_INTEGER);
    }
}
export class Redeemer {
    inner;
    constructor(inner) {
        this.inner = inner;
    }
    redeemerArrayItem() {
        return this.inner;
    }
    static deserialize(reader, path) {
        return new Redeemer(RedeemersArrayItem.deserialize(reader, path));
    }
    serialize(writer) {
        this.inner.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Redeemer"]) {
        let reader = new CBORReader(data);
        return Redeemer.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Redeemer"]) {
        return Redeemer.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Redeemer.from_bytes(this.to_bytes(), path);
    }
    static new(tag, index, data, ex_units) {
        return new Redeemer(new RedeemersArrayItem(tag, index, data, ex_units));
    }
}
export var RedeemerTagKind;
(function (RedeemerTagKind) {
    RedeemerTagKind[RedeemerTagKind["spending"] = 0] = "spending";
    RedeemerTagKind[RedeemerTagKind["minting"] = 1] = "minting";
    RedeemerTagKind[RedeemerTagKind["certifying"] = 2] = "certifying";
    RedeemerTagKind[RedeemerTagKind["rewarding"] = 3] = "rewarding";
    RedeemerTagKind[RedeemerTagKind["voting"] = 4] = "voting";
    RedeemerTagKind[RedeemerTagKind["proposing"] = 5] = "proposing";
})(RedeemerTagKind || (RedeemerTagKind = {}));
export class RedeemerTag {
    kind_;
    constructor(kind) {
        this.kind_ = kind;
    }
    static new_spending() {
        return new RedeemerTag(0);
    }
    static new_minting() {
        return new RedeemerTag(1);
    }
    static new_certifying() {
        return new RedeemerTag(2);
    }
    static new_rewarding() {
        return new RedeemerTag(3);
    }
    static new_voting() {
        return new RedeemerTag(4);
    }
    static new_proposing() {
        return new RedeemerTag(5);
    }
    kind() {
        return this.kind_;
    }
    static deserialize(reader, path) {
        let kind = Number(reader.readInt(path));
        if (kind == 0)
            return new RedeemerTag(0);
        if (kind == 1)
            return new RedeemerTag(1);
        if (kind == 2)
            return new RedeemerTag(2);
        if (kind == 3)
            return new RedeemerTag(3);
        if (kind == 4)
            return new RedeemerTag(4);
        if (kind == 5)
            return new RedeemerTag(5);
        throw ("Unrecognized enum value: " +
            kind +
            " for " +
            RedeemerTag +
            "(at " +
            path.join("/") +
            ")");
    }
    serialize(writer) {
        writer.writeInt(BigInt(this.kind_));
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["RedeemerTag"]) {
        let reader = new CBORReader(data);
        return RedeemerTag.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["RedeemerTag"]) {
        return RedeemerTag.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return RedeemerTag.from_bytes(this.to_bytes(), path);
    }
}
export var RedeemersKind;
(function (RedeemersKind) {
    RedeemersKind[RedeemersKind["RedeemersArray"] = 0] = "RedeemersArray";
    RedeemersKind[RedeemersKind["RedeemersMap"] = 1] = "RedeemersMap";
})(RedeemersKind || (RedeemersKind = {}));
export class Redeemers {
    variant;
    constructor(variant) {
        this.variant = variant;
    }
    static new_redeemers_array(redeemers_array) {
        return new Redeemers({ kind: 0, value: redeemers_array });
    }
    static new_redeemers_map(redeemers_map) {
        return new Redeemers({ kind: 1, value: redeemers_map });
    }
    as_redeemers_array() {
        if (this.variant.kind == 0)
            return this.variant.value;
        throw new Error("Incorrect cast");
    }
    as_redeemers_map() {
        if (this.variant.kind == 1)
            return this.variant.value;
        throw new Error("Incorrect cast");
    }
    kind() {
        return this.variant.kind;
    }
    static deserialize(reader, path) {
        let tag = reader.peekType(path);
        let variant;
        switch (tag) {
            case "array":
                variant = {
                    kind: RedeemersKind.RedeemersArray,
                    value: RedeemersArray.deserialize(reader, [
                        ...path,
                        "RedeemersArray(redeemers_array)",
                    ]),
                };
                break;
            case "map":
                variant = {
                    kind: RedeemersKind.RedeemersMap,
                    value: RedeemersMap.deserialize(reader, [
                        ...path,
                        "RedeemersMap(redeemers_map)",
                    ]),
                };
                break;
            default:
                throw new Error("Unexpected subtype for Redeemers: " +
                    tag +
                    "(at " +
                    path.join("/") +
                    ")");
        }
        return new Redeemers(variant);
    }
    serialize(writer) {
        switch (this.variant.kind) {
            case 0:
                this.variant.value.serialize(writer);
                break;
            case 1:
                this.variant.value.serialize(writer);
                break;
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Redeemers"]) {
        let reader = new CBORReader(data);
        return Redeemers.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Redeemers"]) {
        return Redeemers.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Redeemers.from_bytes(this.to_bytes(), path);
    }
    total_ex_units() {
        let mems = BigNum.zero(), steps = BigNum.zero();
        switch (this.variant.kind) {
            case 0: {
                for (let i = 0; i < this.variant.value.len(); i++) {
                    const item = this.variant.value.get(i);
                    mems = mems.checked_add(item.ex_units().mem());
                    steps = steps.checked_add(item.ex_units().steps());
                }
                break;
            }
            case 1: {
                const keys = this.variant.value.keys();
                for (let i = 0; i < keys.len(); i++) {
                    const item = this.variant.value.get(keys.get(i));
                    mems = mems.checked_add(item.ex_units().mem());
                    steps = steps.checked_add(item.ex_units().steps());
                }
                break;
            }
        }
        return ExUnits.new(mems, steps);
    }
    static new() {
        return Redeemers.new_redeemers_map(RedeemersMap.new());
    }
    len() {
        return this.variant.value.len();
    }
    add(elem) {
        switch (this.variant.kind) {
            case 0:
                this.variant.value.add(elem.redeemerArrayItem());
                break;
            case 1: {
                const r = elem.redeemerArrayItem();
                this.variant.value.insert(RedeemersKey.new(r.tag(), r.index()), RedeemersValue.new(r.data(), r.ex_units()));
                break;
            }
        }
    }
    get(index) {
        switch (this.variant.kind) {
            case 0:
                return new Redeemer(this.variant.value.get(index));
            case 1: {
                const key = this.variant.value.keys().get(index);
                const r = this.variant.value.get(key);
                if (r === undefined) {
                    throw "Unexpected undefined key in Redeemers";
                }
                else {
                    return new Redeemer(RedeemersArrayItem.new(key.tag(), key.index(), r.data(), r.ex_units()));
                }
            }
        }
    }
}
export class RedeemersArray {
    items;
    definiteEncoding;
    constructor(items, definiteEncoding = true) {
        this.items = items;
        this.definiteEncoding = definiteEncoding;
    }
    static new() {
        return new RedeemersArray([]);
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        this.items.push(elem);
    }
    static deserialize(reader, path) {
        const { items, definiteEncoding } = reader.readArray((reader, idx) => RedeemersArrayItem.deserialize(reader, [...path, "Elem#" + idx]), path);
        return new RedeemersArray(items, definiteEncoding);
    }
    serialize(writer) {
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["RedeemersArray"]) {
        let reader = new CBORReader(data);
        return RedeemersArray.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["RedeemersArray"]) {
        return RedeemersArray.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return RedeemersArray.from_bytes(this.to_bytes(), path);
    }
}
export class RedeemersArrayItem {
    _tag;
    _index;
    _data;
    _ex_units;
    constructor(tag, index, data, ex_units) {
        this._tag = tag;
        this._index = index;
        this._data = data;
        this._ex_units = ex_units;
    }
    static new(tag, index, data, ex_units) {
        return new RedeemersArrayItem(tag, index, data, ex_units);
    }
    tag() {
        return this._tag;
    }
    set_tag(tag) {
        this._tag = tag;
    }
    index() {
        return this._index;
    }
    set_index(index) {
        this._index = index;
    }
    data() {
        return this._data;
    }
    set_data(data) {
        this._data = data;
    }
    ex_units() {
        return this._ex_units;
    }
    set_ex_units(ex_units) {
        this._ex_units = ex_units;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 4) {
            throw new Error("Insufficient number of fields in record. Expected at least 4. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const tag_path = [...path, "RedeemerTag(tag)"];
        let tag = RedeemerTag.deserialize(reader, tag_path);
        const index_path = [...path, "BigNum(index)"];
        let index = BigNum.deserialize(reader, index_path);
        const data_path = [...path, "PlutusData(data)"];
        let data = PlutusData.deserialize(reader, data_path);
        const ex_units_path = [...path, "ExUnits(ex_units)"];
        let ex_units = ExUnits.deserialize(reader, ex_units_path);
        return new RedeemersArrayItem(tag, index, data, ex_units);
    }
    serialize(writer) {
        let arrayLen = 4;
        writer.writeArrayTag(arrayLen);
        this._tag.serialize(writer);
        this._index.serialize(writer);
        this._data.serialize(writer);
        this._ex_units.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["RedeemersArrayItem"]) {
        let reader = new CBORReader(data);
        return RedeemersArrayItem.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["RedeemersArrayItem"]) {
        return RedeemersArrayItem.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return RedeemersArrayItem.from_bytes(this.to_bytes(), path);
    }
}
export class RedeemersKey {
    _tag;
    _index;
    constructor(tag, index) {
        this._tag = tag;
        this._index = index;
    }
    static new(tag, index) {
        return new RedeemersKey(tag, index);
    }
    tag() {
        return this._tag;
    }
    set_tag(tag) {
        this._tag = tag;
    }
    index() {
        return this._index;
    }
    set_index(index) {
        this._index = index;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 2) {
            throw new Error("Insufficient number of fields in record. Expected at least 2. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const tag_path = [...path, "RedeemerTag(tag)"];
        let tag = RedeemerTag.deserialize(reader, tag_path);
        const index_path = [...path, "BigNum(index)"];
        let index = BigNum.deserialize(reader, index_path);
        return new RedeemersKey(tag, index);
    }
    serialize(writer) {
        let arrayLen = 2;
        writer.writeArrayTag(arrayLen);
        this._tag.serialize(writer);
        this._index.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["RedeemersKey"]) {
        let reader = new CBORReader(data);
        return RedeemersKey.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["RedeemersKey"]) {
        return RedeemersKey.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return RedeemersKey.from_bytes(this.to_bytes(), path);
    }
}
export class RedeemersKeys {
    items;
    definiteEncoding;
    constructor(items, definiteEncoding = true) {
        this.items = items;
        this.definiteEncoding = definiteEncoding;
    }
    static new() {
        return new RedeemersKeys([]);
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        this.items.push(elem);
    }
    static deserialize(reader, path) {
        const { items, definiteEncoding } = reader.readArray((reader, idx) => RedeemersKey.deserialize(reader, [...path, "Elem#" + idx]), path);
        return new RedeemersKeys(items, definiteEncoding);
    }
    serialize(writer) {
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["RedeemersKeys"]) {
        let reader = new CBORReader(data);
        return RedeemersKeys.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["RedeemersKeys"]) {
        return RedeemersKeys.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return RedeemersKeys.from_bytes(this.to_bytes(), path);
    }
}
export class RedeemersMap {
    _items;
    constructor(items) {
        this._items = items;
    }
    static new() {
        return new RedeemersMap([]);
    }
    len() {
        return this._items.length;
    }
    insert(key, value) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry != null) {
            let ret = entry[1];
            entry[1] = value;
            return ret;
        }
        this._items.push([key, value]);
        return undefined;
    }
    get(key) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry == null)
            return undefined;
        return entry[1];
    }
    _remove_many(keys) {
        this._items = this._items.filter(([k, _v]) => keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())));
    }
    keys() {
        let keys = RedeemersKeys.new();
        for (let [key, _] of this._items)
            keys.add(key);
        return keys;
    }
    static deserialize(reader, path) {
        let ret = new RedeemersMap([]);
        reader.readMap((reader, idx) => ret.insert(RedeemersKey.deserialize(reader, [...path, "RedeemersKey#" + idx]), RedeemersValue.deserialize(reader, [
            ...path,
            "RedeemersValue#" + idx,
        ])), path);
        return ret;
    }
    serialize(writer) {
        writer.writeMap(this._items, (writer, x) => {
            x[0].serialize(writer);
            x[1].serialize(writer);
        });
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["RedeemersMap"]) {
        let reader = new CBORReader(data);
        return RedeemersMap.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["RedeemersMap"]) {
        return RedeemersMap.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return RedeemersMap.from_bytes(this.to_bytes(), path);
    }
}
export class RedeemersValue {
    _data;
    _ex_units;
    constructor(data, ex_units) {
        this._data = data;
        this._ex_units = ex_units;
    }
    static new(data, ex_units) {
        return new RedeemersValue(data, ex_units);
    }
    data() {
        return this._data;
    }
    set_data(data) {
        this._data = data;
    }
    ex_units() {
        return this._ex_units;
    }
    set_ex_units(ex_units) {
        this._ex_units = ex_units;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 2) {
            throw new Error("Insufficient number of fields in record. Expected at least 2. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const data_path = [...path, "PlutusData(data)"];
        let data = PlutusData.deserialize(reader, data_path);
        const ex_units_path = [...path, "ExUnits(ex_units)"];
        let ex_units = ExUnits.deserialize(reader, ex_units_path);
        return new RedeemersValue(data, ex_units);
    }
    serialize(writer) {
        let arrayLen = 2;
        writer.writeArrayTag(arrayLen);
        this._data.serialize(writer);
        this._ex_units.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["RedeemersValue"]) {
        let reader = new CBORReader(data);
        return RedeemersValue.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["RedeemersValue"]) {
        return RedeemersValue.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return RedeemersValue.from_bytes(this.to_bytes(), path);
    }
}
export class RegCert {
    _stake_credential;
    _coin;
    constructor(stake_credential, coin) {
        this._stake_credential = stake_credential;
        this._coin = coin;
    }
    static new(stake_credential, coin) {
        return new RegCert(stake_credential, coin);
    }
    stake_credential() {
        return this._stake_credential;
    }
    set_stake_credential(stake_credential) {
        this._stake_credential = stake_credential;
    }
    coin() {
        return this._coin;
    }
    set_coin(coin) {
        this._coin = coin;
    }
    static deserialize(reader, path) {
        let stake_credential = Credential.deserialize(reader, [
            ...path,
            "stake_credential",
        ]);
        let coin = BigNum.deserialize(reader, [...path, "coin"]);
        return new RegCert(stake_credential, coin);
    }
    serialize(writer) {
        this._stake_credential.serialize(writer);
        this._coin.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["RegCert"]) {
        let reader = new CBORReader(data);
        return RegCert.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["RegCert"]) {
        return RegCert.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return RegCert.from_bytes(this.to_bytes(), path);
    }
}
export var RelayKind;
(function (RelayKind) {
    RelayKind[RelayKind["SingleHostAddr"] = 0] = "SingleHostAddr";
    RelayKind[RelayKind["SingleHostName"] = 1] = "SingleHostName";
    RelayKind[RelayKind["MultiHostName"] = 2] = "MultiHostName";
})(RelayKind || (RelayKind = {}));
export class Relay {
    variant;
    constructor(variant) {
        this.variant = variant;
    }
    static new_single_host_addr(single_host_addr) {
        return new Relay({ kind: 0, value: single_host_addr });
    }
    static new_single_host_name(single_host_name) {
        return new Relay({ kind: 1, value: single_host_name });
    }
    static new_multi_host_name(multi_host_name) {
        return new Relay({ kind: 2, value: multi_host_name });
    }
    as_single_host_addr() {
        if (this.variant.kind == 0)
            return this.variant.value;
    }
    as_single_host_name() {
        if (this.variant.kind == 1)
            return this.variant.value;
    }
    as_multi_host_name() {
        if (this.variant.kind == 2)
            return this.variant.value;
    }
    kind() {
        return this.variant.kind;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        let tag = Number(reader.readUint(path));
        let variant;
        switch (tag) {
            case 0:
                if (len != null && len - 1 != 3) {
                    throw new Error("Expected 3 items to decode SingleHostAddr");
                }
                variant = {
                    kind: 0,
                    value: SingleHostAddr.deserialize(reader, [
                        ...path,
                        "SingleHostAddr",
                    ]),
                };
                break;
            case 1:
                if (len != null && len - 1 != 2) {
                    throw new Error("Expected 2 items to decode SingleHostName");
                }
                variant = {
                    kind: 1,
                    value: SingleHostName.deserialize(reader, [
                        ...path,
                        "SingleHostName",
                    ]),
                };
                break;
            case 2:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode MultiHostName");
                }
                variant = {
                    kind: 2,
                    value: MultiHostName.deserialize(reader, [...path, "MultiHostName"]),
                };
                break;
            default:
                throw new Error("Unexpected tag for Relay: " + tag + "(at " + path.join("/") + ")");
        }
        if (len == null) {
            reader.readBreak();
        }
        return new Relay(variant);
    }
    serialize(writer) {
        switch (this.variant.kind) {
            case 0:
                writer.writeArrayTag(4);
                writer.writeInt(BigInt(0));
                this.variant.value.serialize(writer);
                break;
            case 1:
                writer.writeArrayTag(3);
                writer.writeInt(BigInt(1));
                this.variant.value.serialize(writer);
                break;
            case 2:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(2));
                this.variant.value.serialize(writer);
                break;
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Relay"]) {
        let reader = new CBORReader(data);
        return Relay.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Relay"]) {
        return Relay.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Relay.from_bytes(this.to_bytes(), path);
    }
}
export class Relays {
    items;
    definiteEncoding;
    constructor(items, definiteEncoding = true) {
        this.items = items;
        this.definiteEncoding = definiteEncoding;
    }
    static new() {
        return new Relays([]);
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        this.items.push(elem);
    }
    static deserialize(reader, path) {
        const { items, definiteEncoding } = reader.readArray((reader, idx) => Relay.deserialize(reader, [...path, "Elem#" + idx]), path);
        return new Relays(items, definiteEncoding);
    }
    serialize(writer) {
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Relays"]) {
        let reader = new CBORReader(data);
        return Relays.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Relays"]) {
        return Relays.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Relays.from_bytes(this.to_bytes(), path);
    }
}
export class RewardAddresses {
    items;
    definiteEncoding;
    constructor(items, definiteEncoding = true) {
        this.items = items;
        this.definiteEncoding = definiteEncoding;
    }
    static new() {
        return new RewardAddresses([]);
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        this.items.push(elem);
    }
    static deserialize(reader, path) {
        const { items, definiteEncoding } = reader.readArray((reader, idx) => RewardAddress.deserialize(reader, [...path, "Elem#" + idx]), path);
        return new RewardAddresses(items, definiteEncoding);
    }
    serialize(writer) {
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["RewardAddresses"]) {
        let reader = new CBORReader(data);
        return RewardAddresses.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["RewardAddresses"]) {
        return RewardAddresses.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return RewardAddresses.from_bytes(this.to_bytes(), path);
    }
}
export class ScriptAll {
    _native_scripts;
    constructor(native_scripts) {
        this._native_scripts = native_scripts;
    }
    static new(native_scripts) {
        return new ScriptAll(native_scripts);
    }
    native_scripts() {
        return this._native_scripts;
    }
    set_native_scripts(native_scripts) {
        this._native_scripts = native_scripts;
    }
    static deserialize(reader, path) {
        let native_scripts = NativeScripts.deserialize(reader, [
            ...path,
            "native_scripts",
        ]);
        return new ScriptAll(native_scripts);
    }
    serialize(writer) {
        this._native_scripts.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["ScriptAll"]) {
        let reader = new CBORReader(data);
        return ScriptAll.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["ScriptAll"]) {
        return ScriptAll.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return ScriptAll.from_bytes(this.to_bytes(), path);
    }
}
export class ScriptAny {
    _native_scripts;
    constructor(native_scripts) {
        this._native_scripts = native_scripts;
    }
    static new(native_scripts) {
        return new ScriptAny(native_scripts);
    }
    native_scripts() {
        return this._native_scripts;
    }
    set_native_scripts(native_scripts) {
        this._native_scripts = native_scripts;
    }
    static deserialize(reader, path) {
        let native_scripts = NativeScripts.deserialize(reader, [
            ...path,
            "native_scripts",
        ]);
        return new ScriptAny(native_scripts);
    }
    serialize(writer) {
        this._native_scripts.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["ScriptAny"]) {
        let reader = new CBORReader(data);
        return ScriptAny.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["ScriptAny"]) {
        return ScriptAny.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return ScriptAny.from_bytes(this.to_bytes(), path);
    }
}
export class ScriptDataHash {
    inner;
    constructor(inner) {
        if (inner.length != 32)
            throw new Error("Expected length to be 32");
        this.inner = inner;
    }
    static new(inner) {
        return new ScriptDataHash(inner);
    }
    static from_bech32(bech_str) {
        let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
        let words = decoded.words;
        let bytesArray = bech32.fromWords(words);
        let bytes = new Uint8Array(bytesArray);
        return new ScriptDataHash(bytes);
    }
    to_bech32(prefix) {
        let bytes = this.to_bytes();
        let words = bech32.toWords(bytes);
        return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
    }
    // no-op
    free() { }
    static from_bytes(data) {
        return new ScriptDataHash(data);
    }
    static from_hex(hex_str) {
        return ScriptDataHash.from_bytes(hexToBytes(hex_str));
    }
    to_bytes() {
        return this.inner;
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone() {
        return ScriptDataHash.from_bytes(this.to_bytes());
    }
    static deserialize(reader, path) {
        return new ScriptDataHash(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeBytes(this.inner);
    }
}
export class ScriptHash {
    inner;
    constructor(inner) {
        if (inner.length != 28)
            throw new Error("Expected length to be 28");
        this.inner = inner;
    }
    static new(inner) {
        return new ScriptHash(inner);
    }
    static from_bech32(bech_str) {
        let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
        let words = decoded.words;
        let bytesArray = bech32.fromWords(words);
        let bytes = new Uint8Array(bytesArray);
        return new ScriptHash(bytes);
    }
    to_bech32(prefix) {
        let bytes = this.to_bytes();
        let words = bech32.toWords(bytes);
        return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
    }
    // no-op
    free() { }
    static from_bytes(data) {
        return new ScriptHash(data);
    }
    static from_hex(hex_str) {
        return ScriptHash.from_bytes(hexToBytes(hex_str));
    }
    to_bytes() {
        return this.inner;
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone() {
        return ScriptHash.from_bytes(this.to_bytes());
    }
    static deserialize(reader, path) {
        return new ScriptHash(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeBytes(this.inner);
    }
}
export class ScriptHashes {
    items;
    definiteEncoding;
    constructor(items, definiteEncoding = true) {
        this.items = items;
        this.definiteEncoding = definiteEncoding;
    }
    static new() {
        return new ScriptHashes([]);
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        this.items.push(elem);
    }
    static deserialize(reader, path) {
        const { items, definiteEncoding } = reader.readArray((reader, idx) => ScriptHash.deserialize(reader, [...path, "Elem#" + idx]), path);
        return new ScriptHashes(items, definiteEncoding);
    }
    serialize(writer) {
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["ScriptHashes"]) {
        let reader = new CBORReader(data);
        return ScriptHashes.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["ScriptHashes"]) {
        return ScriptHashes.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return ScriptHashes.from_bytes(this.to_bytes(), path);
    }
}
export class ScriptNOfK {
    _n;
    _native_scripts;
    constructor(n, native_scripts) {
        this._n = n;
        this._native_scripts = native_scripts;
    }
    static new(n, native_scripts) {
        return new ScriptNOfK(n, native_scripts);
    }
    n() {
        return this._n;
    }
    set_n(n) {
        this._n = n;
    }
    native_scripts() {
        return this._native_scripts;
    }
    set_native_scripts(native_scripts) {
        this._native_scripts = native_scripts;
    }
    static deserialize(reader, path) {
        let n = Number(reader.readInt([...path, "n"]));
        let native_scripts = NativeScripts.deserialize(reader, [
            ...path,
            "native_scripts",
        ]);
        return new ScriptNOfK(n, native_scripts);
    }
    serialize(writer) {
        writer.writeInt(BigInt(this._n));
        this._native_scripts.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["ScriptNOfK"]) {
        let reader = new CBORReader(data);
        return ScriptNOfK.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["ScriptNOfK"]) {
        return ScriptNOfK.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return ScriptNOfK.from_bytes(this.to_bytes(), path);
    }
}
export class ScriptPubkey {
    inner;
    constructor(inner) {
        this.inner = inner;
    }
    static new(inner) {
        return new ScriptPubkey(inner);
    }
    addr_keyhash() {
        return this.inner;
    }
    static deserialize(reader, path) {
        return new ScriptPubkey(Ed25519KeyHash.deserialize(reader, path));
    }
    serialize(writer) {
        this.inner.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["ScriptPubkey"]) {
        let reader = new CBORReader(data);
        return ScriptPubkey.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["ScriptPubkey"]) {
        return ScriptPubkey.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return ScriptPubkey.from_bytes(this.to_bytes(), path);
    }
}
export class ScriptPubname {
    _addr_keyhash;
    constructor(addr_keyhash) {
        this._addr_keyhash = addr_keyhash;
    }
    static new(addr_keyhash) {
        return new ScriptPubname(addr_keyhash);
    }
    addr_keyhash() {
        return this._addr_keyhash;
    }
    set_addr_keyhash(addr_keyhash) {
        this._addr_keyhash = addr_keyhash;
    }
    static deserialize(reader, path) {
        let addr_keyhash = Ed25519KeyHash.deserialize(reader, [
            ...path,
            "addr_keyhash",
        ]);
        return new ScriptPubname(addr_keyhash);
    }
    serialize(writer) {
        this._addr_keyhash.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["ScriptPubname"]) {
        let reader = new CBORReader(data);
        return ScriptPubname.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["ScriptPubname"]) {
        return ScriptPubname.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return ScriptPubname.from_bytes(this.to_bytes(), path);
    }
}
export var ScriptRefKind;
(function (ScriptRefKind) {
    ScriptRefKind[ScriptRefKind["NativeScript"] = 0] = "NativeScript";
    ScriptRefKind[ScriptRefKind["PlutusScriptV1"] = 1] = "PlutusScriptV1";
    ScriptRefKind[ScriptRefKind["PlutusScriptV2"] = 2] = "PlutusScriptV2";
    ScriptRefKind[ScriptRefKind["PlutusScriptV3"] = 3] = "PlutusScriptV3";
})(ScriptRefKind || (ScriptRefKind = {}));
export class ScriptRef {
    variant;
    constructor(variant) {
        this.variant = variant;
    }
    static new_native_script(native_script) {
        return new ScriptRef({ kind: 0, value: native_script });
    }
    static new_plutus_script_v1(plutus_script_v1) {
        return new ScriptRef({ kind: 1, value: plutus_script_v1 });
    }
    static new_plutus_script_v2(plutus_script_v2) {
        return new ScriptRef({ kind: 2, value: plutus_script_v2 });
    }
    static new_plutus_script_v3(plutus_script_v3) {
        return new ScriptRef({ kind: 3, value: plutus_script_v3 });
    }
    as_native_script() {
        if (this.variant.kind == 0)
            return this.variant.value;
    }
    as_plutus_script_v1() {
        if (this.variant.kind == 1)
            return this.variant.value;
    }
    as_plutus_script_v2() {
        if (this.variant.kind == 2)
            return this.variant.value;
    }
    as_plutus_script_v3() {
        if (this.variant.kind == 3)
            return this.variant.value;
    }
    kind() {
        return this.variant.kind;
    }
    static deserializeInner(reader, path) {
        let len = reader.readArrayTag(path);
        let tag = Number(reader.readUint(path));
        let variant;
        switch (tag) {
            case 0:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode NativeScript");
                }
                variant = {
                    kind: 0,
                    value: NativeScript.deserialize(reader, [...path, "NativeScript"]),
                };
                break;
            case 1:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode PlutusScriptV1");
                }
                variant = {
                    kind: 1,
                    value: PlutusScript.deserialize(reader, [...path, "PlutusScript"]),
                };
                break;
            case 2:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode PlutusScriptV2");
                }
                variant = {
                    kind: 2,
                    value: PlutusScript.deserialize(reader, [...path, "PlutusScript"]),
                };
                break;
            case 3:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode PlutusScriptV3");
                }
                variant = {
                    kind: 3,
                    value: PlutusScript.deserialize(reader, [...path, "PlutusScript"]),
                };
                break;
            default:
                throw new Error("Unexpected tag for ScriptRef: " +
                    tag +
                    "(at " +
                    path.join("/") +
                    ")");
        }
        if (len == null) {
            reader.readBreak();
        }
        return new ScriptRef(variant);
    }
    serializeInner(writer) {
        switch (this.variant.kind) {
            case 0:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(0));
                this.variant.value.serialize(writer);
                break;
            case 1:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(1));
                this.variant.value.serialize(writer);
                break;
            case 2:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(2));
                this.variant.value.serialize(writer);
                break;
            case 3:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(3));
                this.variant.value.serialize(writer);
                break;
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["ScriptRef"]) {
        let reader = new CBORReader(data);
        return ScriptRef.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["ScriptRef"]) {
        return ScriptRef.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return ScriptRef.from_bytes(this.to_bytes(), path);
    }
    static deserialize(reader, path) {
        const tag = reader.readTaggedTag(path);
        if (tag != 24) {
            throw new Error("Expected a CBOR encoded item when deserializing ScriptRef (at " +
                path.join("/") +
                ")");
        }
        let bytes = reader.readBytes(path);
        let new_reader = new CBORReader(bytes);
        return ScriptRef.deserializeInner(new_reader, path);
    }
    serialize(writer) {
        writer.writeTaggedTag(24);
        let bytes_writer = new CBORWriter();
        this.serializeInner(bytes_writer);
        let bytes = bytes_writer.getBytes();
        writer.writeBytes(bytes);
    }
}
export class SingleHostAddr {
    _port;
    _ipv4;
    _ipv6;
    constructor(port, ipv4, ipv6) {
        this._port = port;
        this._ipv4 = ipv4;
        this._ipv6 = ipv6;
    }
    static new(port, ipv4, ipv6) {
        return new SingleHostAddr(port, ipv4, ipv6);
    }
    port() {
        return this._port;
    }
    set_port(port) {
        this._port = port;
    }
    ipv4() {
        return this._ipv4;
    }
    set_ipv4(ipv4) {
        this._ipv4 = ipv4;
    }
    ipv6() {
        return this._ipv6;
    }
    set_ipv6(ipv6) {
        this._ipv6 = ipv6;
    }
    static deserialize(reader, path) {
        let port = reader.readNullable((r) => Number(r.readInt([...path, "port"])), path) ??
            undefined;
        let ipv4 = reader.readNullable((r) => Ipv4.deserialize(r, [...path, "ipv4"]), path) ?? undefined;
        let ipv6 = reader.readNullable((r) => Ipv6.deserialize(r, [...path, "ipv6"]), path) ?? undefined;
        return new SingleHostAddr(port, ipv4, ipv6);
    }
    serialize(writer) {
        if (this._port == null) {
            writer.writeNull();
        }
        else {
            writer.writeInt(BigInt(this._port));
        }
        if (this._ipv4 == null) {
            writer.writeNull();
        }
        else {
            this._ipv4.serialize(writer);
        }
        if (this._ipv6 == null) {
            writer.writeNull();
        }
        else {
            this._ipv6.serialize(writer);
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["SingleHostAddr"]) {
        let reader = new CBORReader(data);
        return SingleHostAddr.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["SingleHostAddr"]) {
        return SingleHostAddr.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return SingleHostAddr.from_bytes(this.to_bytes(), path);
    }
}
export class SingleHostName {
    _port;
    _dns_name;
    constructor(port, dns_name) {
        this._port = port;
        this._dns_name = dns_name;
    }
    static new(port, dns_name) {
        return new SingleHostName(port, dns_name);
    }
    port() {
        return this._port;
    }
    set_port(port) {
        this._port = port;
    }
    dns_name() {
        return this._dns_name;
    }
    set_dns_name(dns_name) {
        this._dns_name = dns_name;
    }
    static deserialize(reader, path) {
        let port = reader.readNullable((r) => Number(r.readInt([...path, "port"])), path) ??
            undefined;
        let dns_name = DNSRecordAorAAAA.deserialize(reader, [...path, "dns_name"]);
        return new SingleHostName(port, dns_name);
    }
    serialize(writer) {
        if (this._port == null) {
            writer.writeNull();
        }
        else {
            writer.writeInt(BigInt(this._port));
        }
        this._dns_name.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["SingleHostName"]) {
        let reader = new CBORReader(data);
        return SingleHostName.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["SingleHostName"]) {
        return SingleHostName.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return SingleHostName.from_bytes(this.to_bytes(), path);
    }
}
export class StakeAndVoteDelegation {
    _stake_credential;
    _pool_keyhash;
    _drep;
    constructor(stake_credential, pool_keyhash, drep) {
        this._stake_credential = stake_credential;
        this._pool_keyhash = pool_keyhash;
        this._drep = drep;
    }
    static new(stake_credential, pool_keyhash, drep) {
        return new StakeAndVoteDelegation(stake_credential, pool_keyhash, drep);
    }
    stake_credential() {
        return this._stake_credential;
    }
    set_stake_credential(stake_credential) {
        this._stake_credential = stake_credential;
    }
    pool_keyhash() {
        return this._pool_keyhash;
    }
    set_pool_keyhash(pool_keyhash) {
        this._pool_keyhash = pool_keyhash;
    }
    drep() {
        return this._drep;
    }
    set_drep(drep) {
        this._drep = drep;
    }
    static deserialize(reader, path) {
        let stake_credential = Credential.deserialize(reader, [
            ...path,
            "stake_credential",
        ]);
        let pool_keyhash = Ed25519KeyHash.deserialize(reader, [
            ...path,
            "pool_keyhash",
        ]);
        let drep = DRep.deserialize(reader, [...path, "drep"]);
        return new StakeAndVoteDelegation(stake_credential, pool_keyhash, drep);
    }
    serialize(writer) {
        this._stake_credential.serialize(writer);
        this._pool_keyhash.serialize(writer);
        this._drep.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["StakeAndVoteDelegation"]) {
        let reader = new CBORReader(data);
        return StakeAndVoteDelegation.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["StakeAndVoteDelegation"]) {
        return StakeAndVoteDelegation.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return StakeAndVoteDelegation.from_bytes(this.to_bytes(), path);
    }
}
export class StakeDelegation {
    _stake_credential;
    _pool_keyhash;
    constructor(stake_credential, pool_keyhash) {
        this._stake_credential = stake_credential;
        this._pool_keyhash = pool_keyhash;
    }
    static new(stake_credential, pool_keyhash) {
        return new StakeDelegation(stake_credential, pool_keyhash);
    }
    stake_credential() {
        return this._stake_credential;
    }
    set_stake_credential(stake_credential) {
        this._stake_credential = stake_credential;
    }
    pool_keyhash() {
        return this._pool_keyhash;
    }
    set_pool_keyhash(pool_keyhash) {
        this._pool_keyhash = pool_keyhash;
    }
    static deserialize(reader, path) {
        let stake_credential = Credential.deserialize(reader, [
            ...path,
            "stake_credential",
        ]);
        let pool_keyhash = Ed25519KeyHash.deserialize(reader, [
            ...path,
            "pool_keyhash",
        ]);
        return new StakeDelegation(stake_credential, pool_keyhash);
    }
    serialize(writer) {
        this._stake_credential.serialize(writer);
        this._pool_keyhash.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["StakeDelegation"]) {
        let reader = new CBORReader(data);
        return StakeDelegation.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["StakeDelegation"]) {
        return StakeDelegation.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return StakeDelegation.from_bytes(this.to_bytes(), path);
    }
}
export class StakeDeregistration {
    _stake_credential;
    constructor(stake_credential) {
        this._stake_credential = stake_credential;
    }
    static new(stake_credential) {
        return new StakeDeregistration(stake_credential);
    }
    stake_credential() {
        return this._stake_credential;
    }
    set_stake_credential(stake_credential) {
        this._stake_credential = stake_credential;
    }
    static deserialize(reader, path) {
        let stake_credential = Credential.deserialize(reader, [
            ...path,
            "stake_credential",
        ]);
        return new StakeDeregistration(stake_credential);
    }
    serialize(writer) {
        this._stake_credential.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["StakeDeregistration"]) {
        let reader = new CBORReader(data);
        return StakeDeregistration.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["StakeDeregistration"]) {
        return StakeDeregistration.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return StakeDeregistration.from_bytes(this.to_bytes(), path);
    }
}
export class StakeRegistration {
    _stake_credential;
    constructor(stake_credential) {
        this._stake_credential = stake_credential;
    }
    static new(stake_credential) {
        return new StakeRegistration(stake_credential);
    }
    stake_credential() {
        return this._stake_credential;
    }
    set_stake_credential(stake_credential) {
        this._stake_credential = stake_credential;
    }
    static deserialize(reader, path) {
        let stake_credential = Credential.deserialize(reader, [
            ...path,
            "stake_credential",
        ]);
        return new StakeRegistration(stake_credential);
    }
    serialize(writer) {
        this._stake_credential.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["StakeRegistration"]) {
        let reader = new CBORReader(data);
        return StakeRegistration.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["StakeRegistration"]) {
        return StakeRegistration.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return StakeRegistration.from_bytes(this.to_bytes(), path);
    }
}
export class StakeRegistrationAndDelegation {
    _stake_credential;
    _pool_keyhash;
    _coin;
    constructor(stake_credential, pool_keyhash, coin) {
        this._stake_credential = stake_credential;
        this._pool_keyhash = pool_keyhash;
        this._coin = coin;
    }
    static new(stake_credential, pool_keyhash, coin) {
        return new StakeRegistrationAndDelegation(stake_credential, pool_keyhash, coin);
    }
    stake_credential() {
        return this._stake_credential;
    }
    set_stake_credential(stake_credential) {
        this._stake_credential = stake_credential;
    }
    pool_keyhash() {
        return this._pool_keyhash;
    }
    set_pool_keyhash(pool_keyhash) {
        this._pool_keyhash = pool_keyhash;
    }
    coin() {
        return this._coin;
    }
    set_coin(coin) {
        this._coin = coin;
    }
    static deserialize(reader, path) {
        let stake_credential = Credential.deserialize(reader, [
            ...path,
            "stake_credential",
        ]);
        let pool_keyhash = Ed25519KeyHash.deserialize(reader, [
            ...path,
            "pool_keyhash",
        ]);
        let coin = BigNum.deserialize(reader, [...path, "coin"]);
        return new StakeRegistrationAndDelegation(stake_credential, pool_keyhash, coin);
    }
    serialize(writer) {
        this._stake_credential.serialize(writer);
        this._pool_keyhash.serialize(writer);
        this._coin.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["StakeRegistrationAndDelegation"]) {
        let reader = new CBORReader(data);
        return StakeRegistrationAndDelegation.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["StakeRegistrationAndDelegation"]) {
        return StakeRegistrationAndDelegation.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return StakeRegistrationAndDelegation.from_bytes(this.to_bytes(), path);
    }
}
export class StakeVoteRegistrationAndDelegation {
    _stake_credential;
    _pool_keyhash;
    _drep;
    _coin;
    constructor(stake_credential, pool_keyhash, drep, coin) {
        this._stake_credential = stake_credential;
        this._pool_keyhash = pool_keyhash;
        this._drep = drep;
        this._coin = coin;
    }
    static new(stake_credential, pool_keyhash, drep, coin) {
        return new StakeVoteRegistrationAndDelegation(stake_credential, pool_keyhash, drep, coin);
    }
    stake_credential() {
        return this._stake_credential;
    }
    set_stake_credential(stake_credential) {
        this._stake_credential = stake_credential;
    }
    pool_keyhash() {
        return this._pool_keyhash;
    }
    set_pool_keyhash(pool_keyhash) {
        this._pool_keyhash = pool_keyhash;
    }
    drep() {
        return this._drep;
    }
    set_drep(drep) {
        this._drep = drep;
    }
    coin() {
        return this._coin;
    }
    set_coin(coin) {
        this._coin = coin;
    }
    static deserialize(reader, path) {
        let stake_credential = Credential.deserialize(reader, [
            ...path,
            "stake_credential",
        ]);
        let pool_keyhash = Ed25519KeyHash.deserialize(reader, [
            ...path,
            "pool_keyhash",
        ]);
        let drep = DRep.deserialize(reader, [...path, "drep"]);
        let coin = BigNum.deserialize(reader, [...path, "coin"]);
        return new StakeVoteRegistrationAndDelegation(stake_credential, pool_keyhash, drep, coin);
    }
    serialize(writer) {
        this._stake_credential.serialize(writer);
        this._pool_keyhash.serialize(writer);
        this._drep.serialize(writer);
        this._coin.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["StakeVoteRegistrationAndDelegation"]) {
        let reader = new CBORReader(data);
        return StakeVoteRegistrationAndDelegation.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["StakeVoteRegistrationAndDelegation"]) {
        return StakeVoteRegistrationAndDelegation.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return StakeVoteRegistrationAndDelegation.from_bytes(this.to_bytes(), path);
    }
}
export class TimelockExpiry {
    _slot;
    constructor(slot) {
        this._slot = slot;
    }
    static new_timelockexpiry(slot) {
        return new TimelockExpiry(slot);
    }
    slot_bignum() {
        return this._slot;
    }
    set_slot(slot) {
        this._slot = slot;
    }
    static deserialize(reader, path) {
        let slot = BigNum.deserialize(reader, [...path, "slot"]);
        return new TimelockExpiry(slot);
    }
    serialize(writer) {
        this._slot.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["TimelockExpiry"]) {
        let reader = new CBORReader(data);
        return TimelockExpiry.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["TimelockExpiry"]) {
        return TimelockExpiry.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return TimelockExpiry.from_bytes(this.to_bytes(), path);
    }
    slot() {
        return this.slot_bignum()._to_number();
    }
    static new(slot) {
        return new TimelockExpiry(BigNum._from_number(slot));
    }
}
export class TimelockStart {
    _slot;
    constructor(slot) {
        this._slot = slot;
    }
    static new_timelockstart(slot) {
        return new TimelockStart(slot);
    }
    slot_bignum() {
        return this._slot;
    }
    set_slot(slot) {
        this._slot = slot;
    }
    static deserialize(reader, path) {
        let slot = BigNum.deserialize(reader, [...path, "slot"]);
        return new TimelockStart(slot);
    }
    serialize(writer) {
        this._slot.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["TimelockStart"]) {
        let reader = new CBORReader(data);
        return TimelockStart.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["TimelockStart"]) {
        return TimelockStart.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return TimelockStart.from_bytes(this.to_bytes(), path);
    }
    slot() {
        return this.slot_bignum()._to_number();
    }
    static new(slot) {
        return new TimelockStart(BigNum._from_number(slot));
    }
}
export class Transaction {
    _body;
    _witness_set;
    _is_valid;
    _auxiliary_data;
    constructor(body, witness_set, is_valid, auxiliary_data) {
        this._body = body;
        this._witness_set = witness_set;
        this._is_valid = is_valid;
        this._auxiliary_data = auxiliary_data;
    }
    body() {
        return this._body;
    }
    set_body(body) {
        this._body = body;
    }
    witness_set() {
        return this._witness_set;
    }
    set_witness_set(witness_set) {
        this._witness_set = witness_set;
    }
    is_valid() {
        return this._is_valid;
    }
    set_is_valid(is_valid) {
        this._is_valid = is_valid;
    }
    auxiliary_data() {
        return this._auxiliary_data;
    }
    set_auxiliary_data(auxiliary_data) {
        this._auxiliary_data = auxiliary_data;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 4) {
            throw new Error("Insufficient number of fields in record. Expected at least 4. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const body_path = [...path, "TransactionBody(body)"];
        let body = TransactionBody.deserialize(reader, body_path);
        const witness_set_path = [...path, "TransactionWitnessSet(witness_set)"];
        let witness_set = TransactionWitnessSet.deserialize(reader, witness_set_path);
        const is_valid_path = [...path, "boolean(is_valid)"];
        let is_valid = reader.readBoolean(is_valid_path);
        const auxiliary_data_path = [...path, "AuxiliaryData(auxiliary_data)"];
        let auxiliary_data = reader.readNullable((r) => AuxiliaryData.deserialize(r, auxiliary_data_path), path) ?? undefined;
        return new Transaction(body, witness_set, is_valid, auxiliary_data);
    }
    serialize(writer) {
        let arrayLen = 4;
        writer.writeArrayTag(arrayLen);
        this._body.serialize(writer);
        this._witness_set.serialize(writer);
        writer.writeBoolean(this._is_valid);
        if (this._auxiliary_data == null) {
            writer.writeNull();
        }
        else {
            this._auxiliary_data.serialize(writer);
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Transaction"]) {
        let reader = new CBORReader(data);
        return Transaction.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Transaction"]) {
        return Transaction.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Transaction.from_bytes(this.to_bytes(), path);
    }
    static new(body, witness_set, auxiliary_data) {
        return new Transaction(body, witness_set, true, auxiliary_data);
    }
}
export class TransactionBodies {
    items;
    definiteEncoding;
    constructor(items, definiteEncoding = true) {
        this.items = items;
        this.definiteEncoding = definiteEncoding;
    }
    static new() {
        return new TransactionBodies([]);
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        this.items.push(elem);
    }
    static deserialize(reader, path) {
        const { items, definiteEncoding } = reader.readArray((reader, idx) => TransactionBody.deserialize(reader, [...path, "Elem#" + idx]), path);
        return new TransactionBodies(items, definiteEncoding);
    }
    serialize(writer) {
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["TransactionBodies"]) {
        let reader = new CBORReader(data);
        return TransactionBodies.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["TransactionBodies"]) {
        return TransactionBodies.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return TransactionBodies.from_bytes(this.to_bytes(), path);
    }
}
export class TransactionBody {
    _inputs;
    _outputs;
    _fee;
    _ttl;
    _certs;
    _withdrawals;
    _auxiliary_data_hash;
    _validity_start_interval;
    _mint;
    _script_data_hash;
    _collateral;
    _required_signers;
    _network_id;
    _collateral_return;
    _total_collateral;
    _reference_inputs;
    _voting_procedures;
    _voting_proposals;
    _current_treasury_value;
    _donation;
    constructor(inputs, outputs, fee, ttl, certs, withdrawals, auxiliary_data_hash, validity_start_interval, mint, script_data_hash, collateral, required_signers, network_id, collateral_return, total_collateral, reference_inputs, voting_procedures, voting_proposals, current_treasury_value, donation) {
        this._inputs = inputs;
        this._outputs = outputs;
        this._fee = fee;
        this._ttl = ttl;
        this._certs = certs;
        this._withdrawals = withdrawals;
        this._auxiliary_data_hash = auxiliary_data_hash;
        this._validity_start_interval = validity_start_interval;
        this._mint = mint;
        this._script_data_hash = script_data_hash;
        this._collateral = collateral;
        this._required_signers = required_signers;
        this._network_id = network_id;
        this._collateral_return = collateral_return;
        this._total_collateral = total_collateral;
        this._reference_inputs = reference_inputs;
        this._voting_procedures = voting_procedures;
        this._voting_proposals = voting_proposals;
        this._current_treasury_value = current_treasury_value;
        this._donation = donation;
    }
    inputs() {
        return this._inputs;
    }
    set_inputs(inputs) {
        this._inputs = inputs;
    }
    outputs() {
        return this._outputs;
    }
    set_outputs(outputs) {
        this._outputs = outputs;
    }
    fee() {
        return this._fee;
    }
    set_fee(fee) {
        this._fee = fee;
    }
    ttl_bignum() {
        return this._ttl;
    }
    set_ttl(ttl) {
        this._ttl = ttl;
    }
    certs() {
        return this._certs;
    }
    set_certs(certs) {
        this._certs = certs;
    }
    withdrawals() {
        return this._withdrawals;
    }
    set_withdrawals(withdrawals) {
        this._withdrawals = withdrawals;
    }
    auxiliary_data_hash() {
        return this._auxiliary_data_hash;
    }
    set_auxiliary_data_hash(auxiliary_data_hash) {
        this._auxiliary_data_hash = auxiliary_data_hash;
    }
    validity_start_interval_bignum() {
        return this._validity_start_interval;
    }
    set_validity_start_interval_bignum(validity_start_interval) {
        this._validity_start_interval = validity_start_interval;
    }
    mint() {
        return this._mint;
    }
    set_mint(mint) {
        this._mint = mint;
    }
    script_data_hash() {
        return this._script_data_hash;
    }
    set_script_data_hash(script_data_hash) {
        this._script_data_hash = script_data_hash;
    }
    collateral() {
        return this._collateral;
    }
    set_collateral(collateral) {
        this._collateral = collateral;
    }
    required_signers() {
        return this._required_signers;
    }
    set_required_signers(required_signers) {
        this._required_signers = required_signers;
    }
    network_id() {
        return this._network_id;
    }
    set_network_id(network_id) {
        this._network_id = network_id;
    }
    collateral_return() {
        return this._collateral_return;
    }
    set_collateral_return(collateral_return) {
        this._collateral_return = collateral_return;
    }
    total_collateral() {
        return this._total_collateral;
    }
    set_total_collateral(total_collateral) {
        this._total_collateral = total_collateral;
    }
    reference_inputs() {
        return this._reference_inputs;
    }
    set_reference_inputs(reference_inputs) {
        this._reference_inputs = reference_inputs;
    }
    voting_procedures() {
        return this._voting_procedures;
    }
    set_voting_procedures(voting_procedures) {
        this._voting_procedures = voting_procedures;
    }
    voting_proposals() {
        return this._voting_proposals;
    }
    set_voting_proposals(voting_proposals) {
        this._voting_proposals = voting_proposals;
    }
    current_treasury_value() {
        return this._current_treasury_value;
    }
    set_current_treasury_value(current_treasury_value) {
        this._current_treasury_value = current_treasury_value;
    }
    donation() {
        return this._donation;
    }
    set_donation(donation) {
        this._donation = donation;
    }
    static deserialize(reader, path) {
        let fields = {};
        reader.readMap((r) => {
            let key = Number(r.readUint(path));
            switch (key) {
                case 0: {
                    const new_path = [...path, "TransactionInputs(inputs)"];
                    fields.inputs = TransactionInputs.deserialize(r, new_path);
                    break;
                }
                case 1: {
                    const new_path = [...path, "TransactionOutputs(outputs)"];
                    fields.outputs = TransactionOutputs.deserialize(r, new_path);
                    break;
                }
                case 2: {
                    const new_path = [...path, "BigNum(fee)"];
                    fields.fee = BigNum.deserialize(r, new_path);
                    break;
                }
                case 3: {
                    const new_path = [...path, "BigNum(ttl)"];
                    fields.ttl = BigNum.deserialize(r, new_path);
                    break;
                }
                case 4: {
                    const new_path = [...path, "Certificates(certs)"];
                    fields.certs = Certificates.deserialize(r, new_path);
                    break;
                }
                case 5: {
                    const new_path = [...path, "Withdrawals(withdrawals)"];
                    fields.withdrawals = Withdrawals.deserialize(r, new_path);
                    break;
                }
                case 7: {
                    const new_path = [...path, "AuxiliaryDataHash(auxiliary_data_hash)"];
                    fields.auxiliary_data_hash = AuxiliaryDataHash.deserialize(r, new_path);
                    break;
                }
                case 8: {
                    const new_path = [...path, "BigNum(validity_start_interval)"];
                    fields.validity_start_interval = BigNum.deserialize(r, new_path);
                    break;
                }
                case 9: {
                    const new_path = [...path, "Mint(mint)"];
                    fields.mint = Mint.deserialize(r, new_path);
                    break;
                }
                case 11: {
                    const new_path = [...path, "ScriptDataHash(script_data_hash)"];
                    fields.script_data_hash = ScriptDataHash.deserialize(r, new_path);
                    break;
                }
                case 13: {
                    const new_path = [...path, "TransactionInputs(collateral)"];
                    fields.collateral = TransactionInputs.deserialize(r, new_path);
                    break;
                }
                case 14: {
                    const new_path = [...path, "Ed25519KeyHashes(required_signers)"];
                    fields.required_signers = Ed25519KeyHashes.deserialize(r, new_path);
                    break;
                }
                case 15: {
                    const new_path = [...path, "NetworkId(network_id)"];
                    fields.network_id = NetworkId.deserialize(r, new_path);
                    break;
                }
                case 16: {
                    const new_path = [...path, "TransactionOutput(collateral_return)"];
                    fields.collateral_return = TransactionOutput.deserialize(r, new_path);
                    break;
                }
                case 17: {
                    const new_path = [...path, "BigNum(total_collateral)"];
                    fields.total_collateral = BigNum.deserialize(r, new_path);
                    break;
                }
                case 18: {
                    const new_path = [...path, "TransactionInputs(reference_inputs)"];
                    fields.reference_inputs = TransactionInputs.deserialize(r, new_path);
                    break;
                }
                case 19: {
                    const new_path = [...path, "VotingProcedures(voting_procedures)"];
                    fields.voting_procedures = VotingProcedures.deserialize(r, new_path);
                    break;
                }
                case 20: {
                    const new_path = [...path, "VotingProposals(voting_proposals)"];
                    fields.voting_proposals = VotingProposals.deserialize(r, new_path);
                    break;
                }
                case 21: {
                    const new_path = [...path, "BigNum(current_treasury_value)"];
                    fields.current_treasury_value = BigNum.deserialize(r, new_path);
                    break;
                }
                case 22: {
                    const new_path = [...path, "BigNum(donation)"];
                    fields.donation = BigNum.deserialize(r, new_path);
                    break;
                }
            }
        }, path);
        if (fields.inputs === undefined)
            throw new Error("Value not provided for field 0 (inputs) (at " + path.join("/") + ")");
        let inputs = fields.inputs;
        if (fields.outputs === undefined)
            throw new Error("Value not provided for field 1 (outputs) (at " + path.join("/") + ")");
        let outputs = fields.outputs;
        if (fields.fee === undefined)
            throw new Error("Value not provided for field 2 (fee) (at " + path.join("/") + ")");
        let fee = fields.fee;
        let ttl = fields.ttl;
        let certs = fields.certs;
        let withdrawals = fields.withdrawals;
        let auxiliary_data_hash = fields.auxiliary_data_hash;
        let validity_start_interval = fields.validity_start_interval;
        let mint = fields.mint;
        let script_data_hash = fields.script_data_hash;
        let collateral = fields.collateral;
        let required_signers = fields.required_signers;
        let network_id = fields.network_id;
        let collateral_return = fields.collateral_return;
        let total_collateral = fields.total_collateral;
        let reference_inputs = fields.reference_inputs;
        let voting_procedures = fields.voting_procedures;
        let voting_proposals = fields.voting_proposals;
        let current_treasury_value = fields.current_treasury_value;
        let donation = fields.donation;
        return new TransactionBody(inputs, outputs, fee, ttl, certs, withdrawals, auxiliary_data_hash, validity_start_interval, mint, script_data_hash, collateral, required_signers, network_id, collateral_return, total_collateral, reference_inputs, voting_procedures, voting_proposals, current_treasury_value, donation);
    }
    serialize(writer) {
        let len = 20;
        if (this._ttl === undefined)
            len -= 1;
        if (this._certs === undefined)
            len -= 1;
        if (this._withdrawals === undefined)
            len -= 1;
        if (this._auxiliary_data_hash === undefined)
            len -= 1;
        if (this._validity_start_interval === undefined)
            len -= 1;
        if (this._mint === undefined)
            len -= 1;
        if (this._script_data_hash === undefined)
            len -= 1;
        if (this._collateral === undefined)
            len -= 1;
        if (this._required_signers === undefined)
            len -= 1;
        if (this._network_id === undefined)
            len -= 1;
        if (this._collateral_return === undefined)
            len -= 1;
        if (this._total_collateral === undefined)
            len -= 1;
        if (this._reference_inputs === undefined)
            len -= 1;
        if (this._voting_procedures === undefined)
            len -= 1;
        if (this._voting_proposals === undefined)
            len -= 1;
        if (this._current_treasury_value === undefined)
            len -= 1;
        if (this._donation === undefined)
            len -= 1;
        writer.writeMapTag(len);
        writer.writeInt(0n);
        this._inputs.serialize(writer);
        writer.writeInt(1n);
        this._outputs.serialize(writer);
        writer.writeInt(2n);
        this._fee.serialize(writer);
        if (this._ttl !== undefined) {
            writer.writeInt(3n);
            this._ttl.serialize(writer);
        }
        if (this._certs !== undefined) {
            writer.writeInt(4n);
            this._certs.serialize(writer);
        }
        if (this._withdrawals !== undefined) {
            writer.writeInt(5n);
            this._withdrawals.serialize(writer);
        }
        if (this._auxiliary_data_hash !== undefined) {
            writer.writeInt(7n);
            this._auxiliary_data_hash.serialize(writer);
        }
        if (this._validity_start_interval !== undefined) {
            writer.writeInt(8n);
            this._validity_start_interval.serialize(writer);
        }
        if (this._mint !== undefined) {
            writer.writeInt(9n);
            this._mint.serialize(writer);
        }
        if (this._script_data_hash !== undefined) {
            writer.writeInt(11n);
            this._script_data_hash.serialize(writer);
        }
        if (this._collateral !== undefined) {
            writer.writeInt(13n);
            this._collateral.serialize(writer);
        }
        if (this._required_signers !== undefined) {
            writer.writeInt(14n);
            this._required_signers.serialize(writer);
        }
        if (this._network_id !== undefined) {
            writer.writeInt(15n);
            this._network_id.serialize(writer);
        }
        if (this._collateral_return !== undefined) {
            writer.writeInt(16n);
            this._collateral_return.serialize(writer);
        }
        if (this._total_collateral !== undefined) {
            writer.writeInt(17n);
            this._total_collateral.serialize(writer);
        }
        if (this._reference_inputs !== undefined) {
            writer.writeInt(18n);
            this._reference_inputs.serialize(writer);
        }
        if (this._voting_procedures !== undefined) {
            writer.writeInt(19n);
            this._voting_procedures.serialize(writer);
        }
        if (this._voting_proposals !== undefined) {
            writer.writeInt(20n);
            this._voting_proposals.serialize(writer);
        }
        if (this._current_treasury_value !== undefined) {
            writer.writeInt(21n);
            this._current_treasury_value.serialize(writer);
        }
        if (this._donation !== undefined) {
            writer.writeInt(22n);
            this._donation.serialize(writer);
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["TransactionBody"]) {
        let reader = new CBORReader(data);
        return TransactionBody.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["TransactionBody"]) {
        return TransactionBody.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return TransactionBody.from_bytes(this.to_bytes(), path);
    }
    ttl() {
        return this.ttl_bignum()?._to_number();
    }
    remove_ttl() {
        this.set_ttl(undefined);
    }
    validity_start_interval() {
        return this.validity_start_interval_bignum()?._to_number();
    }
    set_validity_start_interval(validity_start_interval) {
        return this.set_validity_start_interval_bignum(BigNum._from_number(validity_start_interval));
    }
    static new(inputs, outputs, fee, path = ["TransactionBody"], ttl) {
        return new TransactionBody(inputs.clone([...path, "TransactionInputs"]), outputs.clone([...path, "TransactionOutputs"]), fee, ttl != null ? BigNum._from_number(ttl) : undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    }
    static new_tx_body(inputs, outputs, fee, path) {
        return TransactionBody.new(inputs, outputs, fee, path, undefined);
    }
}
export class TransactionHash {
    inner;
    constructor(inner) {
        if (inner.length != 32)
            throw new Error("Expected length to be 32");
        this.inner = inner;
    }
    static new(inner) {
        return new TransactionHash(inner);
    }
    static from_bech32(bech_str) {
        let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
        let words = decoded.words;
        let bytesArray = bech32.fromWords(words);
        let bytes = new Uint8Array(bytesArray);
        return new TransactionHash(bytes);
    }
    to_bech32(prefix) {
        let bytes = this.to_bytes();
        let words = bech32.toWords(bytes);
        return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
    }
    // no-op
    free() { }
    static from_bytes(data) {
        return new TransactionHash(data);
    }
    static from_hex(hex_str) {
        return TransactionHash.from_bytes(hexToBytes(hex_str));
    }
    to_bytes() {
        return this.inner;
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone() {
        return TransactionHash.from_bytes(this.to_bytes());
    }
    static deserialize(reader, path) {
        return new TransactionHash(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeBytes(this.inner);
    }
}
export class TransactionInput {
    _transaction_id;
    _index;
    constructor(transaction_id, index) {
        this._transaction_id = transaction_id;
        this._index = index;
    }
    static new(transaction_id, index) {
        return new TransactionInput(transaction_id, index);
    }
    transaction_id() {
        return this._transaction_id;
    }
    set_transaction_id(transaction_id) {
        this._transaction_id = transaction_id;
    }
    index() {
        return this._index;
    }
    set_index(index) {
        this._index = index;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 2) {
            throw new Error("Insufficient number of fields in record. Expected at least 2. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const transaction_id_path = [...path, "TransactionHash(transaction_id)"];
        let transaction_id = TransactionHash.deserialize(reader, transaction_id_path);
        const index_path = [...path, "number(index)"];
        let index = Number(reader.readInt(index_path));
        return new TransactionInput(transaction_id, index);
    }
    serialize(writer) {
        let arrayLen = 2;
        writer.writeArrayTag(arrayLen);
        this._transaction_id.serialize(writer);
        writer.writeInt(BigInt(this._index));
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["TransactionInput"]) {
        let reader = new CBORReader(data);
        return TransactionInput.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["TransactionInput"]) {
        return TransactionInput.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return TransactionInput.from_bytes(this.to_bytes(), path);
    }
}
export class TransactionInputs {
    items;
    definiteEncoding;
    nonEmptyTag;
    setItems(items) {
        this.items = items;
    }
    constructor(definiteEncoding = true, nonEmptyTag = true) {
        this.items = [];
        this.definiteEncoding = definiteEncoding;
        this.nonEmptyTag = nonEmptyTag;
    }
    static new() {
        return new TransactionInputs();
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        if (this.contains(elem))
            return true;
        this.items.push(elem);
        return false;
    }
    contains(elem) {
        for (let item of this.items) {
            if (arrayEq(item.to_bytes(), elem.to_bytes())) {
                return true;
            }
        }
        return false;
    }
    static deserialize(reader, path) {
        let nonEmptyTag = false;
        if (reader.peekType(path) == "tagged") {
            let tag = reader.readTaggedTag(path);
            if (tag != 258) {
                throw new Error("Expected tag 258. Got " + tag);
            }
            else {
                nonEmptyTag = true;
            }
        }
        const { items, definiteEncoding } = reader.readArray((reader, idx) => TransactionInput.deserialize(reader, [
            ...path,
            "TransactionInput#" + idx,
        ]), path);
        let ret = new TransactionInputs(definiteEncoding, nonEmptyTag);
        ret.setItems(items);
        return ret;
    }
    serialize(writer) {
        if (this.nonEmptyTag) {
            writer.writeTaggedTag(258);
        }
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["TransactionInputs"]) {
        let reader = new CBORReader(data);
        return TransactionInputs.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["TransactionInputs"]) {
        return TransactionInputs.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return TransactionInputs.from_bytes(this.to_bytes(), path);
    }
}
export var TransactionMetadatumKind;
(function (TransactionMetadatumKind) {
    TransactionMetadatumKind[TransactionMetadatumKind["MetadataMap"] = 0] = "MetadataMap";
    TransactionMetadatumKind[TransactionMetadatumKind["MetadataList"] = 1] = "MetadataList";
    TransactionMetadatumKind[TransactionMetadatumKind["Int"] = 2] = "Int";
    TransactionMetadatumKind[TransactionMetadatumKind["Bytes"] = 3] = "Bytes";
    TransactionMetadatumKind[TransactionMetadatumKind["Text"] = 4] = "Text";
})(TransactionMetadatumKind || (TransactionMetadatumKind = {}));
export class TransactionMetadatum {
    variant;
    constructor(variant) {
        this.variant = variant;
    }
    static new_map(map) {
        return new TransactionMetadatum({ kind: 0, value: map });
    }
    static new_list(list) {
        return new TransactionMetadatum({ kind: 1, value: list });
    }
    static new_int(int) {
        return new TransactionMetadatum({ kind: 2, value: int });
    }
    static new_bytes(bytes) {
        return new TransactionMetadatum({ kind: 3, value: bytes });
    }
    static new_text(text) {
        return new TransactionMetadatum({ kind: 4, value: text });
    }
    as_map() {
        if (this.variant.kind == 0)
            return this.variant.value;
        throw new Error("Incorrect cast");
    }
    as_list() {
        if (this.variant.kind == 1)
            return this.variant.value;
        throw new Error("Incorrect cast");
    }
    as_int() {
        if (this.variant.kind == 2)
            return this.variant.value;
        throw new Error("Incorrect cast");
    }
    as_bytes() {
        if (this.variant.kind == 3)
            return this.variant.value;
        throw new Error("Incorrect cast");
    }
    as_text() {
        if (this.variant.kind == 4)
            return this.variant.value;
        throw new Error("Incorrect cast");
    }
    kind() {
        return this.variant.kind;
    }
    static deserialize(reader, path) {
        let tag = reader.peekType(path);
        let variant;
        switch (tag) {
            case "map":
                variant = {
                    kind: TransactionMetadatumKind.MetadataMap,
                    value: MetadataMap.deserialize(reader, [...path, "MetadataMap(map)"]),
                };
                break;
            case "array":
                variant = {
                    kind: TransactionMetadatumKind.MetadataList,
                    value: MetadataList.deserialize(reader, [
                        ...path,
                        "MetadataList(list)",
                    ]),
                };
                break;
            case "uint":
            case "nint":
                variant = {
                    kind: TransactionMetadatumKind.Int,
                    value: Int.deserialize(reader, [...path, "Int(int)"]),
                };
                break;
            case "bytes":
                variant = {
                    kind: TransactionMetadatumKind.Bytes,
                    value: reader.readBytes([...path, "bytes(bytes)"]),
                };
                break;
            case "string":
                variant = {
                    kind: TransactionMetadatumKind.Text,
                    value: reader.readString([...path, "string(text)"]),
                };
                break;
            default:
                throw new Error("Unexpected subtype for TransactionMetadatum: " +
                    tag +
                    "(at " +
                    path.join("/") +
                    ")");
        }
        return new TransactionMetadatum(variant);
    }
    serialize(writer) {
        switch (this.variant.kind) {
            case 0:
                this.variant.value.serialize(writer);
                break;
            case 1:
                this.variant.value.serialize(writer);
                break;
            case 2:
                this.variant.value.serialize(writer);
                break;
            case 3:
                writer.writeBytes(this.variant.value);
                break;
            case 4:
                writer.writeString(this.variant.value);
                break;
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["TransactionMetadatum"]) {
        let reader = new CBORReader(data);
        return TransactionMetadatum.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["TransactionMetadatum"]) {
        return TransactionMetadatum.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return TransactionMetadatum.from_bytes(this.to_bytes(), path);
    }
}
export class TransactionMetadatumLabels {
    items;
    definiteEncoding;
    constructor(items, definiteEncoding = true) {
        this.items = items;
        this.definiteEncoding = definiteEncoding;
    }
    static new() {
        return new TransactionMetadatumLabels([]);
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        this.items.push(elem);
    }
    static deserialize(reader, path) {
        const { items, definiteEncoding } = reader.readArray((reader, idx) => BigNum.deserialize(reader, [...path, "Elem#" + idx]), path);
        return new TransactionMetadatumLabels(items, definiteEncoding);
    }
    serialize(writer) {
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["TransactionMetadatumLabels"]) {
        let reader = new CBORReader(data);
        return TransactionMetadatumLabels.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["TransactionMetadatumLabels"]) {
        return TransactionMetadatumLabels.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return TransactionMetadatumLabels.from_bytes(this.to_bytes(), path);
    }
}
export var TransactionOutputKind;
(function (TransactionOutputKind) {
    TransactionOutputKind[TransactionOutputKind["PreBabbageTransactionOutput"] = 0] = "PreBabbageTransactionOutput";
    TransactionOutputKind[TransactionOutputKind["PostAlonzoTransactionOutput"] = 1] = "PostAlonzoTransactionOutput";
})(TransactionOutputKind || (TransactionOutputKind = {}));
export class TransactionOutput {
    variant;
    constructor(variant) {
        this.variant = variant;
    }
    static new_pre_babbage_transaction_output(pre_babbage_transaction_output) {
        return new TransactionOutput({
            kind: 0,
            value: pre_babbage_transaction_output,
        });
    }
    static new_post_alonzo_transaction_output(post_alonzo_transaction_output) {
        return new TransactionOutput({
            kind: 1,
            value: post_alonzo_transaction_output,
        });
    }
    as_pre_babbage_transaction_output() {
        if (this.variant.kind == 0)
            return this.variant.value;
        throw new Error("Incorrect cast");
    }
    as_post_alonzo_transaction_output() {
        if (this.variant.kind == 1)
            return this.variant.value;
        throw new Error("Incorrect cast");
    }
    kind() {
        return this.variant.kind;
    }
    static deserialize(reader, path) {
        let tag = reader.peekType(path);
        let variant;
        switch (tag) {
            case "array":
                variant = {
                    kind: TransactionOutputKind.PreBabbageTransactionOutput,
                    value: PreBabbageTransactionOutput.deserialize(reader, [
                        ...path,
                        "PreBabbageTransactionOutput(pre_babbage_transaction_output)",
                    ]),
                };
                break;
            case "map":
                variant = {
                    kind: TransactionOutputKind.PostAlonzoTransactionOutput,
                    value: PostAlonzoTransactionOutput.deserialize(reader, [
                        ...path,
                        "PostAlonzoTransactionOutput(post_alonzo_transaction_output)",
                    ]),
                };
                break;
            default:
                throw new Error("Unexpected subtype for TransactionOutput: " +
                    tag +
                    "(at " +
                    path.join("/") +
                    ")");
        }
        return new TransactionOutput(variant);
    }
    serialize(writer) {
        switch (this.variant.kind) {
            case 0:
                this.variant.value.serialize(writer);
                break;
            case 1:
                this.variant.value.serialize(writer);
                break;
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["TransactionOutput"]) {
        let reader = new CBORReader(data);
        return TransactionOutput.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["TransactionOutput"]) {
        return TransactionOutput.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return TransactionOutput.from_bytes(this.to_bytes(), path);
    }
    static new(address, amount) {
        const post_alonzo_transaction_output = new PostAlonzoTransactionOutput(address, amount, undefined, undefined);
        return new TransactionOutput({
            kind: 1,
            value: post_alonzo_transaction_output,
        });
    }
    address() {
        return this.variant.value.address();
    }
    set_address(address) {
        return this.variant.value.set_address(address);
    }
    amount() {
        return this.variant.value.amount();
    }
    set_amount(amount) {
        this.variant.value.set_amount(amount);
    }
    data_hash() {
        switch (this.variant.kind) {
            case 0:
                return this.as_pre_babbage_transaction_output().datum_hash();
            case 1:
                const opt = this.as_post_alonzo_transaction_output().datum_option();
                return opt?.as_hash();
        }
    }
    set_data_hash(data_hash) {
        switch (this.variant.kind) {
            case 0:
                let bto = this.as_pre_babbage_transaction_output();
                bto.set_datum_hash(data_hash);
                this.variant = { kind: 0, value: bto };
                break;
            case 1:
                let ato = this.as_post_alonzo_transaction_output();
                if (data_hash) {
                    ato.set_datum_option(DataOption.new_hash(data_hash));
                }
                else {
                    ato.set_datum_option(undefined);
                }
                this.variant = { kind: 1, value: ato };
                break;
        }
    }
    datum_option() {
        switch (this.variant.kind) {
            case 0:
                return undefined;
            case 1:
                return this.as_post_alonzo_transaction_output().datum_option();
        }
    }
    set_datum_option(datum_option) {
        switch (this.variant.kind) {
            case 0:
                if (datum_option) {
                    const pbt = this.as_pre_babbage_transaction_output();
                    this.variant = {
                        kind: 1,
                        value: PostAlonzoTransactionOutput.new(pbt.address(), pbt.amount(), datum_option, undefined),
                    };
                }
            case 1:
                let pat = this.as_post_alonzo_transaction_output();
                pat.set_datum_option(datum_option);
                this.variant = { kind: 1, value: pat };
        }
    }
    script_ref() {
        switch (this.variant.kind) {
            case 0:
                return undefined;
            case 1:
                return this.as_post_alonzo_transaction_output().script_ref();
        }
    }
    set_script_ref(script_ref) {
        switch (this.variant.kind) {
            case 0:
                if (ScriptRef) {
                    const pbt = this.as_pre_babbage_transaction_output();
                    this.variant = {
                        kind: 1,
                        value: PostAlonzoTransactionOutput.new(pbt.address(), pbt.amount(), undefined, script_ref),
                    };
                }
            case 1:
                let pat = this.as_post_alonzo_transaction_output();
                pat.set_script_ref(script_ref);
                this.variant = { kind: 1, value: pat };
        }
    }
}
export class TransactionOutputs {
    items;
    definiteEncoding;
    constructor(items, definiteEncoding = true) {
        this.items = items;
        this.definiteEncoding = definiteEncoding;
    }
    static new() {
        return new TransactionOutputs([]);
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        this.items.push(elem);
    }
    static deserialize(reader, path) {
        const { items, definiteEncoding } = reader.readArray((reader, idx) => TransactionOutput.deserialize(reader, [...path, "Elem#" + idx]), path);
        return new TransactionOutputs(items, definiteEncoding);
    }
    serialize(writer) {
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["TransactionOutputs"]) {
        let reader = new CBORReader(data);
        return TransactionOutputs.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["TransactionOutputs"]) {
        return TransactionOutputs.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return TransactionOutputs.from_bytes(this.to_bytes(), path);
    }
}
export class TransactionUnspentOutput {
    _input;
    _output;
    constructor(input, output) {
        this._input = input;
        this._output = output;
    }
    static new(input, output) {
        return new TransactionUnspentOutput(input, output);
    }
    input() {
        return this._input;
    }
    set_input(input) {
        this._input = input;
    }
    output() {
        return this._output;
    }
    set_output(output) {
        this._output = output;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 2) {
            throw new Error("Insufficient number of fields in record. Expected at least 2. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const input_path = [...path, "TransactionInput(input)"];
        let input = TransactionInput.deserialize(reader, input_path);
        const output_path = [...path, "TransactionOutput(output)"];
        let output = TransactionOutput.deserialize(reader, output_path);
        return new TransactionUnspentOutput(input, output);
    }
    serialize(writer) {
        let arrayLen = 2;
        writer.writeArrayTag(arrayLen);
        this._input.serialize(writer);
        this._output.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["TransactionUnspentOutput"]) {
        let reader = new CBORReader(data);
        return TransactionUnspentOutput.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["TransactionUnspentOutput"]) {
        return TransactionUnspentOutput.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return TransactionUnspentOutput.from_bytes(this.to_bytes(), path);
    }
}
export class TransactionUnspentOutputs {
    items;
    definiteEncoding;
    constructor(items, definiteEncoding = true) {
        this.items = items;
        this.definiteEncoding = definiteEncoding;
    }
    static new() {
        return new TransactionUnspentOutputs([]);
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        this.items.push(elem);
    }
    static deserialize(reader, path) {
        const { items, definiteEncoding } = reader.readArray((reader, idx) => TransactionUnspentOutput.deserialize(reader, [...path, "Elem#" + idx]), path);
        return new TransactionUnspentOutputs(items, definiteEncoding);
    }
    serialize(writer) {
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["TransactionUnspentOutputs"]) {
        let reader = new CBORReader(data);
        return TransactionUnspentOutputs.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["TransactionUnspentOutputs"]) {
        return TransactionUnspentOutputs.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return TransactionUnspentOutputs.from_bytes(this.to_bytes(), path);
    }
}
export class TransactionWitnessSet {
    _vkeys;
    _native_scripts;
    _bootstraps;
    _plutus_scripts_v1;
    _inner_plutus_data;
    _plutus_scripts_v2;
    _redeemers;
    _plutus_scripts_v3;
    constructor(vkeys, native_scripts, bootstraps, plutus_scripts_v1, inner_plutus_data, plutus_scripts_v2, redeemers, plutus_scripts_v3) {
        this._vkeys = vkeys;
        this._native_scripts = native_scripts;
        this._bootstraps = bootstraps;
        this._plutus_scripts_v1 = plutus_scripts_v1;
        this._inner_plutus_data = inner_plutus_data;
        this._plutus_scripts_v2 = plutus_scripts_v2;
        this._redeemers = redeemers;
        this._plutus_scripts_v3 = plutus_scripts_v3;
    }
    vkeys() {
        return this._vkeys;
    }
    set_vkeys(vkeys) {
        this._vkeys = vkeys;
    }
    native_scripts() {
        return this._native_scripts;
    }
    set_native_scripts(native_scripts) {
        this._native_scripts = native_scripts;
    }
    bootstraps() {
        return this._bootstraps;
    }
    set_bootstraps(bootstraps) {
        this._bootstraps = bootstraps;
    }
    plutus_scripts_v1() {
        return this._plutus_scripts_v1;
    }
    set_plutus_scripts_v1(plutus_scripts_v1) {
        this._plutus_scripts_v1 = plutus_scripts_v1;
    }
    inner_plutus_data() {
        return this._inner_plutus_data;
    }
    set_inner_plutus_data(inner_plutus_data) {
        this._inner_plutus_data = inner_plutus_data;
    }
    plutus_scripts_v2() {
        return this._plutus_scripts_v2;
    }
    set_plutus_scripts_v2(plutus_scripts_v2) {
        this._plutus_scripts_v2 = plutus_scripts_v2;
    }
    redeemers() {
        return this._redeemers;
    }
    set_redeemers(redeemers) {
        this._redeemers = redeemers;
    }
    plutus_scripts_v3() {
        return this._plutus_scripts_v3;
    }
    set_plutus_scripts_v3(plutus_scripts_v3) {
        this._plutus_scripts_v3 = plutus_scripts_v3;
    }
    static deserialize(reader, path) {
        let fields = {};
        reader.readMap((r) => {
            let key = Number(r.readUint(path));
            switch (key) {
                case 0: {
                    const new_path = [...path, "Vkeywitnesses(vkeys)"];
                    fields.vkeys = Vkeywitnesses.deserialize(r, new_path);
                    break;
                }
                case 1: {
                    const new_path = [...path, "NativeScripts(native_scripts)"];
                    fields.native_scripts = NativeScripts.deserialize(r, new_path);
                    break;
                }
                case 2: {
                    const new_path = [...path, "BootstrapWitnesses(bootstraps)"];
                    fields.bootstraps = BootstrapWitnesses.deserialize(r, new_path);
                    break;
                }
                case 3: {
                    const new_path = [...path, "PlutusScripts(plutus_scripts_v1)"];
                    fields.plutus_scripts_v1 = PlutusScripts.deserialize(r, new_path);
                    break;
                }
                case 4: {
                    const new_path = [...path, "PlutusSet(inner_plutus_data)"];
                    fields.inner_plutus_data = PlutusSet.deserialize(r, new_path);
                    break;
                }
                case 6: {
                    const new_path = [...path, "PlutusScripts(plutus_scripts_v2)"];
                    fields.plutus_scripts_v2 = PlutusScripts.deserialize(r, new_path);
                    break;
                }
                case 5: {
                    const new_path = [...path, "Redeemers(redeemers)"];
                    fields.redeemers = Redeemers.deserialize(r, new_path);
                    break;
                }
                case 7: {
                    const new_path = [...path, "PlutusScripts(plutus_scripts_v3)"];
                    fields.plutus_scripts_v3 = PlutusScripts.deserialize(r, new_path);
                    break;
                }
            }
        }, path);
        let vkeys = fields.vkeys;
        let native_scripts = fields.native_scripts;
        let bootstraps = fields.bootstraps;
        let plutus_scripts_v1 = fields.plutus_scripts_v1;
        let inner_plutus_data = fields.inner_plutus_data;
        let plutus_scripts_v2 = fields.plutus_scripts_v2;
        let redeemers = fields.redeemers;
        let plutus_scripts_v3 = fields.plutus_scripts_v3;
        return new TransactionWitnessSet(vkeys, native_scripts, bootstraps, plutus_scripts_v1, inner_plutus_data, plutus_scripts_v2, redeemers, plutus_scripts_v3);
    }
    serialize(writer) {
        let len = 8;
        if (this._vkeys === undefined)
            len -= 1;
        if (this._native_scripts === undefined)
            len -= 1;
        if (this._bootstraps === undefined)
            len -= 1;
        if (this._plutus_scripts_v1 === undefined)
            len -= 1;
        if (this._inner_plutus_data === undefined)
            len -= 1;
        if (this._plutus_scripts_v2 === undefined)
            len -= 1;
        if (this._redeemers === undefined)
            len -= 1;
        if (this._plutus_scripts_v3 === undefined)
            len -= 1;
        writer.writeMapTag(len);
        if (this._vkeys !== undefined) {
            writer.writeInt(0n);
            this._vkeys.serialize(writer);
        }
        if (this._native_scripts !== undefined) {
            writer.writeInt(1n);
            this._native_scripts.serialize(writer);
        }
        if (this._bootstraps !== undefined) {
            writer.writeInt(2n);
            this._bootstraps.serialize(writer);
        }
        if (this._plutus_scripts_v1 !== undefined) {
            writer.writeInt(3n);
            this._plutus_scripts_v1.serialize(writer);
        }
        if (this._inner_plutus_data !== undefined) {
            writer.writeInt(4n);
            this._inner_plutus_data.serialize(writer);
        }
        if (this._plutus_scripts_v2 !== undefined) {
            writer.writeInt(6n);
            this._plutus_scripts_v2.serialize(writer);
        }
        if (this._redeemers !== undefined) {
            writer.writeInt(5n);
            this._redeemers.serialize(writer);
        }
        if (this._plutus_scripts_v3 !== undefined) {
            writer.writeInt(7n);
            this._plutus_scripts_v3.serialize(writer);
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["TransactionWitnessSet"]) {
        let reader = new CBORReader(data);
        return TransactionWitnessSet.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["TransactionWitnessSet"]) {
        return TransactionWitnessSet.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return TransactionWitnessSet.from_bytes(this.to_bytes(), path);
    }
    static new() {
        return new TransactionWitnessSet(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    }
    plutus_data() {
        return this.inner_plutus_data()?.as_list();
    }
    set_plutus_data(plutus_data) {
        this._inner_plutus_data = plutus_data.as_set();
    }
}
export class TransactionWitnessSets {
    items;
    definiteEncoding;
    constructor(items, definiteEncoding = true) {
        this.items = items;
        this.definiteEncoding = definiteEncoding;
    }
    static new() {
        return new TransactionWitnessSets([]);
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        this.items.push(elem);
    }
    static deserialize(reader, path) {
        const { items, definiteEncoding } = reader.readArray((reader, idx) => TransactionWitnessSet.deserialize(reader, [...path, "Elem#" + idx]), path);
        return new TransactionWitnessSets(items, definiteEncoding);
    }
    serialize(writer) {
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["TransactionWitnessSets"]) {
        let reader = new CBORReader(data);
        return TransactionWitnessSets.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["TransactionWitnessSets"]) {
        return TransactionWitnessSets.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return TransactionWitnessSets.from_bytes(this.to_bytes(), path);
    }
}
export class TreasuryWithdrawals {
    _items;
    constructor(items) {
        this._items = items;
    }
    static new() {
        return new TreasuryWithdrawals([]);
    }
    len() {
        return this._items.length;
    }
    insert(key, value) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry != null) {
            let ret = entry[1];
            entry[1] = value;
            return ret;
        }
        this._items.push([key, value]);
        return undefined;
    }
    get(key) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry == null)
            return undefined;
        return entry[1];
    }
    _remove_many(keys) {
        this._items = this._items.filter(([k, _v]) => keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())));
    }
    keys() {
        let keys = RewardAddresses.new();
        for (let [key, _] of this._items)
            keys.add(key);
        return keys;
    }
    static deserialize(reader, path) {
        let ret = new TreasuryWithdrawals([]);
        reader.readMap((reader, idx) => ret.insert(RewardAddress.deserialize(reader, [...path, "RewardAddress#" + idx]), BigNum.deserialize(reader, [...path, "BigNum#" + idx])), path);
        return ret;
    }
    serialize(writer) {
        writer.writeMap(this._items, (writer, x) => {
            x[0].serialize(writer);
            x[1].serialize(writer);
        });
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["TreasuryWithdrawals"]) {
        let reader = new CBORReader(data);
        return TreasuryWithdrawals.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["TreasuryWithdrawals"]) {
        return TreasuryWithdrawals.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return TreasuryWithdrawals.from_bytes(this.to_bytes(), path);
    }
}
export class TreasuryWithdrawalsAction {
    _withdrawals;
    _policy_hash;
    constructor(withdrawals, policy_hash) {
        this._withdrawals = withdrawals;
        this._policy_hash = policy_hash;
    }
    static new_with_policy_hash(withdrawals, policy_hash) {
        return new TreasuryWithdrawalsAction(withdrawals, policy_hash);
    }
    withdrawals() {
        return this._withdrawals;
    }
    set_withdrawals(withdrawals) {
        this._withdrawals = withdrawals;
    }
    policy_hash() {
        return this._policy_hash;
    }
    set_policy_hash(policy_hash) {
        this._policy_hash = policy_hash;
    }
    static deserialize(reader, path) {
        let withdrawals = TreasuryWithdrawals.deserialize(reader, [
            ...path,
            "withdrawals",
        ]);
        let policy_hash = reader.readNullable((r) => ScriptHash.deserialize(r, [...path, "policy_hash"]), path) ?? undefined;
        return new TreasuryWithdrawalsAction(withdrawals, policy_hash);
    }
    serialize(writer) {
        this._withdrawals.serialize(writer);
        if (this._policy_hash == null) {
            writer.writeNull();
        }
        else {
            this._policy_hash.serialize(writer);
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["TreasuryWithdrawalsAction"]) {
        let reader = new CBORReader(data);
        return TreasuryWithdrawalsAction.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["TreasuryWithdrawalsAction"]) {
        return TreasuryWithdrawalsAction.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return TreasuryWithdrawalsAction.from_bytes(this.to_bytes(), path);
    }
    static new(withdrawals) {
        return new TreasuryWithdrawalsAction(withdrawals, undefined);
    }
}
export class URL {
    inner;
    constructor(inner) {
        if (inner.length < 0)
            throw new Error("Expected length to be atleast 0");
        if (inner.length > 128)
            throw new Error("Expected length to be atmost 128");
        this.inner = inner;
    }
    static new(inner) {
        return new URL(inner);
    }
    url() {
        return this.inner;
    }
    static deserialize(reader, path) {
        return new URL(reader.readString(path));
    }
    serialize(writer) {
        writer.writeString(this.inner);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["URL"]) {
        let reader = new CBORReader(data);
        return URL.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["URL"]) {
        return URL.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return URL.from_bytes(this.to_bytes(), path);
    }
}
export class UnitInterval {
    _numerator;
    _denominator;
    constructor(numerator, denominator) {
        this._numerator = numerator;
        this._denominator = denominator;
    }
    static new(numerator, denominator) {
        return new UnitInterval(numerator, denominator);
    }
    numerator() {
        return this._numerator;
    }
    set_numerator(numerator) {
        this._numerator = numerator;
    }
    denominator() {
        return this._denominator;
    }
    set_denominator(denominator) {
        this._denominator = denominator;
    }
    static deserialize(reader, path = ["UnitInterval"]) {
        let taggedTag = reader.readTaggedTag(path);
        if (taggedTag != 30) {
            throw new Error("Expected tag 30, got " + taggedTag + " (at " + path + ")");
        }
        return UnitInterval.deserializeInner(reader, path);
    }
    static deserializeInner(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 2) {
            throw new Error("Insufficient number of fields in record. Expected at least 2. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const numerator_path = [...path, "BigNum(numerator)"];
        let numerator = BigNum.deserialize(reader, numerator_path);
        const denominator_path = [...path, "BigNum(denominator)"];
        let denominator = BigNum.deserialize(reader, denominator_path);
        return new UnitInterval(numerator, denominator);
    }
    serialize(writer) {
        writer.writeTaggedTag(30);
        this.serializeInner(writer);
    }
    serializeInner(writer) {
        let arrayLen = 2;
        writer.writeArrayTag(arrayLen);
        this._numerator.serialize(writer);
        this._denominator.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["UnitInterval"]) {
        let reader = new CBORReader(data);
        return UnitInterval.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["UnitInterval"]) {
        return UnitInterval.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return UnitInterval.from_bytes(this.to_bytes(), path);
    }
}
export class UnregCert {
    _stake_credential;
    _coin;
    constructor(stake_credential, coin) {
        this._stake_credential = stake_credential;
        this._coin = coin;
    }
    static new(stake_credential, coin) {
        return new UnregCert(stake_credential, coin);
    }
    stake_credential() {
        return this._stake_credential;
    }
    set_stake_credential(stake_credential) {
        this._stake_credential = stake_credential;
    }
    coin() {
        return this._coin;
    }
    set_coin(coin) {
        this._coin = coin;
    }
    static deserialize(reader, path) {
        let stake_credential = Credential.deserialize(reader, [
            ...path,
            "stake_credential",
        ]);
        let coin = BigNum.deserialize(reader, [...path, "coin"]);
        return new UnregCert(stake_credential, coin);
    }
    serialize(writer) {
        this._stake_credential.serialize(writer);
        this._coin.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["UnregCert"]) {
        let reader = new CBORReader(data);
        return UnregCert.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["UnregCert"]) {
        return UnregCert.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return UnregCert.from_bytes(this.to_bytes(), path);
    }
}
export class Update {
    _proposed_protocol_parameter_updates;
    _epoch;
    constructor(proposed_protocol_parameter_updates, epoch) {
        this._proposed_protocol_parameter_updates =
            proposed_protocol_parameter_updates;
        this._epoch = epoch;
    }
    static new(proposed_protocol_parameter_updates, epoch) {
        return new Update(proposed_protocol_parameter_updates, epoch);
    }
    proposed_protocol_parameter_updates() {
        return this._proposed_protocol_parameter_updates;
    }
    set_proposed_protocol_parameter_updates(proposed_protocol_parameter_updates) {
        this._proposed_protocol_parameter_updates =
            proposed_protocol_parameter_updates;
    }
    epoch() {
        return this._epoch;
    }
    set_epoch(epoch) {
        this._epoch = epoch;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 2) {
            throw new Error("Insufficient number of fields in record. Expected at least 2. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const proposed_protocol_parameter_updates_path = [
            ...path,
            "ProposedProtocolParameterUpdates(proposed_protocol_parameter_updates)",
        ];
        let proposed_protocol_parameter_updates = ProposedProtocolParameterUpdates.deserialize(reader, proposed_protocol_parameter_updates_path);
        const epoch_path = [...path, "number(epoch)"];
        let epoch = Number(reader.readInt(epoch_path));
        return new Update(proposed_protocol_parameter_updates, epoch);
    }
    serialize(writer) {
        let arrayLen = 2;
        writer.writeArrayTag(arrayLen);
        this._proposed_protocol_parameter_updates.serialize(writer);
        writer.writeInt(BigInt(this._epoch));
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Update"]) {
        let reader = new CBORReader(data);
        return Update.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Update"]) {
        return Update.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Update.from_bytes(this.to_bytes(), path);
    }
}
export class UpdateCommitteeAction {
    _gov_action_id;
    _committee;
    _members_to_remove;
    constructor(gov_action_id, committee, members_to_remove) {
        this._gov_action_id = gov_action_id;
        this._committee = committee;
        this._members_to_remove = members_to_remove;
    }
    static new_with_action_id(gov_action_id, committee, members_to_remove) {
        return new UpdateCommitteeAction(gov_action_id, committee, members_to_remove);
    }
    gov_action_id() {
        return this._gov_action_id;
    }
    set_gov_action_id(gov_action_id) {
        this._gov_action_id = gov_action_id;
    }
    committee() {
        return this._committee;
    }
    set_committee(committee) {
        this._committee = committee;
    }
    members_to_remove() {
        return this._members_to_remove;
    }
    set_members_to_remove(members_to_remove) {
        this._members_to_remove = members_to_remove;
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["UpdateCommitteeAction"]) {
        let reader = new CBORReader(data);
        return UpdateCommitteeAction.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["UpdateCommitteeAction"]) {
        return UpdateCommitteeAction.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return UpdateCommitteeAction.from_bytes(this.to_bytes(), path);
    }
    static new(committee, members_to_remove) {
        return UpdateCommitteeAction.new_with_action_id(undefined, committee, members_to_remove);
    }
    static deserialize(reader, path) {
        let gov_action_id = reader.readNullable((reader) => GovernanceActionId.deserialize(reader, [...path, "gov_action_id"]), path);
        let members_to_remove = Credentials.deserialize(reader, [
            ...path,
            "members_to_remove",
        ]);
        let members = CommitteeEpochs.deserialize(reader, [...path, "members"]);
        let quorum_threshold = UnitInterval.deserialize(reader, [
            ...path,
            "quorum_threshold",
        ]);
        return UpdateCommitteeAction.new_with_action_id(gov_action_id != null ? gov_action_id : undefined, new Committee(quorum_threshold, members), members_to_remove);
    }
    serialize(writer) {
        if (this._gov_action_id == null)
            writer.writeNull();
        else
            this._gov_action_id.serialize(writer);
        this._members_to_remove.serialize(writer);
        this._committee.members_.serialize(writer);
        this._committee.quorum_threshold_.serialize(writer);
    }
}
export class VRFCert {
    _output;
    _proof;
    constructor(output, proof) {
        this._output = output;
        this._proof = proof;
    }
    static new(output, proof) {
        return new VRFCert(output, proof);
    }
    output() {
        return this._output;
    }
    set_output(output) {
        this._output = output;
    }
    proof() {
        return this._proof;
    }
    set_proof(proof) {
        this._proof = proof;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 2) {
            throw new Error("Insufficient number of fields in record. Expected at least 2. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const output_path = [...path, "bytes(output)"];
        let output = reader.readBytes(output_path);
        const proof_path = [...path, "bytes(proof)"];
        let proof = reader.readBytes(proof_path);
        return new VRFCert(output, proof);
    }
    serialize(writer) {
        let arrayLen = 2;
        writer.writeArrayTag(arrayLen);
        writer.writeBytes(this._output);
        writer.writeBytes(this._proof);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["VRFCert"]) {
        let reader = new CBORReader(data);
        return VRFCert.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["VRFCert"]) {
        return VRFCert.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return VRFCert.from_bytes(this.to_bytes(), path);
    }
}
export class VRFKeyHash {
    inner;
    constructor(inner) {
        if (inner.length != 32)
            throw new Error("Expected length to be 32");
        this.inner = inner;
    }
    static new(inner) {
        return new VRFKeyHash(inner);
    }
    static from_bech32(bech_str) {
        let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
        let words = decoded.words;
        let bytesArray = bech32.fromWords(words);
        let bytes = new Uint8Array(bytesArray);
        return new VRFKeyHash(bytes);
    }
    to_bech32(prefix) {
        let bytes = this.to_bytes();
        let words = bech32.toWords(bytes);
        return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
    }
    // no-op
    free() { }
    static from_bytes(data) {
        return new VRFKeyHash(data);
    }
    static from_hex(hex_str) {
        return VRFKeyHash.from_bytes(hexToBytes(hex_str));
    }
    to_bytes() {
        return this.inner;
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone() {
        return VRFKeyHash.from_bytes(this.to_bytes());
    }
    static deserialize(reader, path) {
        return new VRFKeyHash(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeBytes(this.inner);
    }
}
export class VRFVKey {
    inner;
    constructor(inner) {
        if (inner.length != 32)
            throw new Error("Expected length to be 32");
        this.inner = inner;
    }
    static new(inner) {
        return new VRFVKey(inner);
    }
    static from_bech32(bech_str) {
        let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
        let words = decoded.words;
        let bytesArray = bech32.fromWords(words);
        let bytes = new Uint8Array(bytesArray);
        return new VRFVKey(bytes);
    }
    to_bech32(prefix) {
        let bytes = this.to_bytes();
        let words = bech32.toWords(bytes);
        return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
    }
    // no-op
    free() { }
    static from_bytes(data) {
        return new VRFVKey(data);
    }
    static from_hex(hex_str) {
        return VRFVKey.from_bytes(hexToBytes(hex_str));
    }
    to_bytes() {
        return this.inner;
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone() {
        return VRFVKey.from_bytes(this.to_bytes());
    }
    static deserialize(reader, path) {
        return new VRFVKey(reader.readBytes(path));
    }
    serialize(writer) {
        writer.writeBytes(this.inner);
    }
}
export class Value {
    _coin;
    _multiasset;
    constructor(coin, multiasset) {
        this._coin = coin;
        this._multiasset = multiasset;
    }
    static new_with_assets(coin, multiasset) {
        return new Value(coin, multiasset);
    }
    coin() {
        return this._coin;
    }
    set_coin(coin) {
        this._coin = coin;
    }
    multiasset() {
        return this._multiasset;
    }
    set_multiasset(multiasset) {
        this._multiasset = multiasset;
    }
    static deserializeRecord(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 2) {
            throw new Error("Insufficient number of fields in record. Expected at least 2. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const coin_path = [...path, "BigNum(coin)"];
        let coin = BigNum.deserialize(reader, coin_path);
        const multiasset_path = [...path, "MultiAsset(multiasset)"];
        let multiasset = reader.readNullable((r) => MultiAsset.deserialize(r, multiasset_path), path) ?? undefined;
        return new Value(coin, multiasset);
    }
    serializeRecord(writer) {
        let arrayLen = 2;
        writer.writeArrayTag(arrayLen);
        this._coin.serialize(writer);
        if (this._multiasset == null) {
            writer.writeNull();
        }
        else {
            this._multiasset.serialize(writer);
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Value"]) {
        let reader = new CBORReader(data);
        return Value.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Value"]) {
        return Value.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Value.from_bytes(this.to_bytes(), path);
    }
    static zero() {
        return Value.new(BigNum.zero());
    }
    is_zero() {
        return this._coin.is_zero();
    }
    static new(coin) {
        return Value.new_with_assets(coin, undefined);
    }
    static new_from_assets(multiasset) {
        return Value.new_with_assets(BigNum.zero(), multiasset);
    }
    static deserialize(reader, path) {
        if (reader.peekType(path) == "array") {
            return Value.deserializeRecord(reader, path);
        }
        return Value.new(BigNum.deserialize(reader, path));
    }
    serialize(writer) {
        if (this._multiasset == null || this._multiasset.len() == 0) {
            this._coin.serialize(writer);
        }
        else {
            this.serializeRecord(writer);
        }
    }
    checked_add(rhs, path) {
        let coin = this._coin.checked_add(rhs._coin);
        let multiasset;
        if (this._multiasset != null) {
            multiasset = this._multiasset.clone(path);
            if (rhs._multiasset != null) {
                multiasset._inplace_checked_add(rhs._multiasset);
            }
        }
        else if (rhs._multiasset != null) {
            multiasset = rhs._multiasset.clone(path);
        }
        return new Value(coin, multiasset);
    }
    checked_sub(rhs, path) {
        let coin = this._coin.checked_sub(rhs._coin);
        let multiasset;
        if (this._multiasset != null) {
            multiasset = this._multiasset.clone(path);
            if (rhs._multiasset != null) {
                multiasset._inplace_clamped_sub(rhs._multiasset);
            }
        }
        return new Value(coin, multiasset);
    }
    clamped_sub(rhs, path) {
        let coin = this._coin.clamped_sub(rhs._coin);
        let multiasset;
        if (this._multiasset != null) {
            multiasset = this._multiasset.clone(path);
            if (rhs._multiasset != null) {
                multiasset._inplace_clamped_sub(rhs._multiasset);
            }
        }
        return new Value(coin, multiasset);
    }
    compare(rhs_value) {
        let coin_cmp = this._coin.compare(rhs_value._coin);
        let this_multiasset = this._multiasset ?? MultiAsset.new();
        let rhs_multiasset = rhs_value._multiasset ?? MultiAsset.new();
        let assets_cmp = this_multiasset._partial_cmp(rhs_multiasset);
        if (assets_cmp == null)
            return undefined;
        if (coin_cmp == 0 || coin_cmp == assets_cmp)
            return assets_cmp;
        if (assets_cmp == 0)
            return coin_cmp;
        // (coin_cmp == -1 && assets_cmp == +1) || (coin_cmp == +1 && assets_cmp == -1)
        return undefined;
    }
}
export class Vkey {
    _public_key;
    constructor(public_key) {
        this._public_key = public_key;
    }
    static new(public_key) {
        return new Vkey(public_key);
    }
    public_key() {
        return this._public_key;
    }
    set_public_key(public_key) {
        this._public_key = public_key;
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Vkey"]) {
        let reader = new CBORReader(data);
        return Vkey.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Vkey"]) {
        return Vkey.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Vkey.from_bytes(this.to_bytes(), path);
    }
    static deserialize(reader, path) {
        const public_key_path = [...path, "PublicKey(public_key)"];
        let public_key = PublicKey.deserialize(reader, public_key_path);
        return new Vkey(public_key);
    }
    serialize(writer) {
        this._public_key.serialize(writer);
    }
}
export class Vkeys {
    items;
    definiteEncoding;
    constructor(items, definiteEncoding = true) {
        this.items = items;
        this.definiteEncoding = definiteEncoding;
    }
    static new() {
        return new Vkeys([]);
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        this.items.push(elem);
    }
    static deserialize(reader, path) {
        const { items, definiteEncoding } = reader.readArray((reader, idx) => Vkey.deserialize(reader, [...path, "Elem#" + idx]), path);
        return new Vkeys(items, definiteEncoding);
    }
    serialize(writer) {
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Vkeys"]) {
        let reader = new CBORReader(data);
        return Vkeys.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Vkeys"]) {
        return Vkeys.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Vkeys.from_bytes(this.to_bytes(), path);
    }
}
export class Vkeywitness {
    _vkey;
    _signature;
    constructor(vkey, signature) {
        this._vkey = vkey;
        this._signature = signature;
    }
    static new(vkey, signature) {
        return new Vkeywitness(vkey, signature);
    }
    vkey() {
        return this._vkey;
    }
    set_vkey(vkey) {
        this._vkey = vkey;
    }
    signature() {
        return this._signature;
    }
    set_signature(signature) {
        this._signature = signature;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 2) {
            throw new Error("Insufficient number of fields in record. Expected at least 2. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const vkey_path = [...path, "Vkey(vkey)"];
        let vkey = Vkey.deserialize(reader, vkey_path);
        const signature_path = [...path, "Ed25519Signature(signature)"];
        let signature = Ed25519Signature.deserialize(reader, signature_path);
        return new Vkeywitness(vkey, signature);
    }
    serialize(writer) {
        let arrayLen = 2;
        writer.writeArrayTag(arrayLen);
        this._vkey.serialize(writer);
        this._signature.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Vkeywitness"]) {
        let reader = new CBORReader(data);
        return Vkeywitness.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Vkeywitness"]) {
        return Vkeywitness.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Vkeywitness.from_bytes(this.to_bytes(), path);
    }
}
export class Vkeywitnesses {
    items;
    definiteEncoding;
    nonEmptyTag;
    setItems(items) {
        this.items = items;
    }
    constructor(definiteEncoding = true, nonEmptyTag = true) {
        this.items = [];
        this.definiteEncoding = definiteEncoding;
        this.nonEmptyTag = nonEmptyTag;
    }
    static new() {
        return new Vkeywitnesses();
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        if (this.contains(elem))
            return true;
        this.items.push(elem);
        return false;
    }
    contains(elem) {
        for (let item of this.items) {
            if (arrayEq(item.to_bytes(), elem.to_bytes())) {
                return true;
            }
        }
        return false;
    }
    static deserialize(reader, path) {
        let nonEmptyTag = false;
        if (reader.peekType(path) == "tagged") {
            let tag = reader.readTaggedTag(path);
            if (tag != 258) {
                throw new Error("Expected tag 258. Got " + tag);
            }
            else {
                nonEmptyTag = true;
            }
        }
        const { items, definiteEncoding } = reader.readArray((reader, idx) => Vkeywitness.deserialize(reader, [...path, "Vkeywitness#" + idx]), path);
        let ret = new Vkeywitnesses(definiteEncoding, nonEmptyTag);
        ret.setItems(items);
        return ret;
    }
    serialize(writer) {
        if (this.nonEmptyTag) {
            writer.writeTaggedTag(258);
        }
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Vkeywitnesses"]) {
        let reader = new CBORReader(data);
        return Vkeywitnesses.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Vkeywitnesses"]) {
        return Vkeywitnesses.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Vkeywitnesses.from_bytes(this.to_bytes(), path);
    }
}
export class VoteDelegation {
    _stake_credential;
    _drep;
    constructor(stake_credential, drep) {
        this._stake_credential = stake_credential;
        this._drep = drep;
    }
    static new(stake_credential, drep) {
        return new VoteDelegation(stake_credential, drep);
    }
    stake_credential() {
        return this._stake_credential;
    }
    set_stake_credential(stake_credential) {
        this._stake_credential = stake_credential;
    }
    drep() {
        return this._drep;
    }
    set_drep(drep) {
        this._drep = drep;
    }
    static deserialize(reader, path) {
        let stake_credential = Credential.deserialize(reader, [
            ...path,
            "stake_credential",
        ]);
        let drep = DRep.deserialize(reader, [...path, "drep"]);
        return new VoteDelegation(stake_credential, drep);
    }
    serialize(writer) {
        this._stake_credential.serialize(writer);
        this._drep.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["VoteDelegation"]) {
        let reader = new CBORReader(data);
        return VoteDelegation.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["VoteDelegation"]) {
        return VoteDelegation.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return VoteDelegation.from_bytes(this.to_bytes(), path);
    }
}
export var VoteKind;
(function (VoteKind) {
    VoteKind[VoteKind["No"] = 0] = "No";
    VoteKind[VoteKind["Yes"] = 1] = "Yes";
    VoteKind[VoteKind["Abstain"] = 2] = "Abstain";
})(VoteKind || (VoteKind = {}));
export function deserializeVoteKind(reader, path) {
    let value = Number(reader.readInt(path));
    switch (value) {
        case 0:
            return VoteKind.No;
        case 1:
            return VoteKind.Yes;
        case 2:
            return VoteKind.Abstain;
    }
    throw new Error("Invalid value for enum VoteKind: " + value + "(at " + path.join("/") + ")");
}
export function serializeVoteKind(writer, value) {
    writer.writeInt(BigInt(value));
}
export class VoteRegistrationAndDelegation {
    _stake_credential;
    _drep;
    _coin;
    constructor(stake_credential, drep, coin) {
        this._stake_credential = stake_credential;
        this._drep = drep;
        this._coin = coin;
    }
    static new(stake_credential, drep, coin) {
        return new VoteRegistrationAndDelegation(stake_credential, drep, coin);
    }
    stake_credential() {
        return this._stake_credential;
    }
    set_stake_credential(stake_credential) {
        this._stake_credential = stake_credential;
    }
    drep() {
        return this._drep;
    }
    set_drep(drep) {
        this._drep = drep;
    }
    coin() {
        return this._coin;
    }
    set_coin(coin) {
        this._coin = coin;
    }
    static deserialize(reader, path) {
        let stake_credential = Credential.deserialize(reader, [
            ...path,
            "stake_credential",
        ]);
        let drep = DRep.deserialize(reader, [...path, "drep"]);
        let coin = BigNum.deserialize(reader, [...path, "coin"]);
        return new VoteRegistrationAndDelegation(stake_credential, drep, coin);
    }
    serialize(writer) {
        this._stake_credential.serialize(writer);
        this._drep.serialize(writer);
        this._coin.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["VoteRegistrationAndDelegation"]) {
        let reader = new CBORReader(data);
        return VoteRegistrationAndDelegation.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["VoteRegistrationAndDelegation"]) {
        return VoteRegistrationAndDelegation.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return VoteRegistrationAndDelegation.from_bytes(this.to_bytes(), path);
    }
}
export var VoterKind;
(function (VoterKind) {
    VoterKind[VoterKind["ConstitutionalCommitteeHotKeyHash"] = 0] = "ConstitutionalCommitteeHotKeyHash";
    VoterKind[VoterKind["ConstitutionalCommitteeHotScriptHash"] = 1] = "ConstitutionalCommitteeHotScriptHash";
    VoterKind[VoterKind["DRepKeyHash"] = 2] = "DRepKeyHash";
    VoterKind[VoterKind["DRepScriptHash"] = 3] = "DRepScriptHash";
    VoterKind[VoterKind["StakingPoolKeyHash"] = 4] = "StakingPoolKeyHash";
})(VoterKind || (VoterKind = {}));
export class Voter {
    variant;
    constructor(variant) {
        this.variant = variant;
    }
    static new_constitutional_committee_hot_key_hash(constitutional_committee_hot_key_hash) {
        return new Voter({ kind: 0, value: constitutional_committee_hot_key_hash });
    }
    static new_constitutional_committee_hot_script_hash(constitutional_committee_hot_script_hash) {
        return new Voter({
            kind: 1,
            value: constitutional_committee_hot_script_hash,
        });
    }
    static new_drep_key_hash(drep_key_hash) {
        return new Voter({ kind: 2, value: drep_key_hash });
    }
    static new_drep_script_hash(drep_script_hash) {
        return new Voter({ kind: 3, value: drep_script_hash });
    }
    static new_staking_pool_key_hash(staking_pool_key_hash) {
        return new Voter({ kind: 4, value: staking_pool_key_hash });
    }
    to_constitutional_committee_hot_key_hash() {
        if (this.variant.kind == 0)
            return this.variant.value;
    }
    to_constitutional_committee_hot_script_hash() {
        if (this.variant.kind == 1)
            return this.variant.value;
    }
    to_drep_key_hash() {
        if (this.variant.kind == 2)
            return this.variant.value;
    }
    to_drep_script_hash() {
        if (this.variant.kind == 3)
            return this.variant.value;
    }
    to_staking_pool_key_hash() {
        if (this.variant.kind == 4)
            return this.variant.value;
    }
    kind() {
        return this.variant.kind;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        let tag = Number(reader.readUint(path));
        let variant;
        switch (tag) {
            case 0:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode ConstitutionalCommitteeHotKeyHash");
                }
                variant = {
                    kind: 0,
                    value: Ed25519KeyHash.deserialize(reader, [
                        ...path,
                        "Ed25519KeyHash",
                    ]),
                };
                break;
            case 1:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode ConstitutionalCommitteeHotScriptHash");
                }
                variant = {
                    kind: 1,
                    value: ScriptHash.deserialize(reader, [...path, "ScriptHash"]),
                };
                break;
            case 2:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode DRepKeyHash");
                }
                variant = {
                    kind: 2,
                    value: Ed25519KeyHash.deserialize(reader, [
                        ...path,
                        "Ed25519KeyHash",
                    ]),
                };
                break;
            case 3:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode DRepScriptHash");
                }
                variant = {
                    kind: 3,
                    value: ScriptHash.deserialize(reader, [...path, "ScriptHash"]),
                };
                break;
            case 4:
                if (len != null && len - 1 != 1) {
                    throw new Error("Expected 1 items to decode StakingPoolKeyHash");
                }
                variant = {
                    kind: 4,
                    value: Ed25519KeyHash.deserialize(reader, [
                        ...path,
                        "Ed25519KeyHash",
                    ]),
                };
                break;
            default:
                throw new Error("Unexpected tag for Voter: " + tag + "(at " + path.join("/") + ")");
        }
        if (len == null) {
            reader.readBreak();
        }
        return new Voter(variant);
    }
    serialize(writer) {
        switch (this.variant.kind) {
            case 0:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(0));
                this.variant.value.serialize(writer);
                break;
            case 1:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(1));
                this.variant.value.serialize(writer);
                break;
            case 2:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(2));
                this.variant.value.serialize(writer);
                break;
            case 3:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(3));
                this.variant.value.serialize(writer);
                break;
            case 4:
                writer.writeArrayTag(2);
                writer.writeInt(BigInt(4));
                this.variant.value.serialize(writer);
                break;
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Voter"]) {
        let reader = new CBORReader(data);
        return Voter.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Voter"]) {
        return Voter.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Voter.from_bytes(this.to_bytes(), path);
    }
    has_script_credentials() {
        return (this.variant.kind == VoterKind.ConstitutionalCommitteeHotScriptHash ||
            this.variant.kind == VoterKind.DRepScriptHash);
    }
    to_key_hash() {
        if (this.variant.kind == VoterKind.ConstitutionalCommitteeHotKeyHash ||
            this.variant.kind == VoterKind.DRepKeyHash ||
            this.variant.kind == VoterKind.StakingPoolKeyHash) {
            return this.variant.value;
        }
        return undefined;
    }
    static new_constitutional_committee_hot_credential(cred) {
        if (cred.kind() == CredKind.Key) {
            return Voter.new_constitutional_committee_hot_key_hash(cred.to_keyhash());
        }
        else if (cred.kind() == CredKind.Script) {
            return Voter.new_constitutional_committee_hot_script_hash(cred.to_scripthash());
        }
        else {
            throw new Error("Invalid CredKind");
        }
    }
    static new_drep_credential(cred) {
        if (cred.kind() == CredKind.Key) {
            return Voter.new_drep_key_hash(cred.to_keyhash());
        }
        else if (cred.kind() == CredKind.Script) {
            return Voter.new_drep_script_hash(cred.to_scripthash());
        }
        else {
            throw new Error("Invalid CredKind");
        }
    }
    to_constitutional_committee_hot_credential() {
        if (this.variant.kind == VoterKind.ConstitutionalCommitteeHotKeyHash) {
            return Credential.from_keyhash(this.variant.value);
        }
        else if (this.variant.kind == VoterKind.ConstitutionalCommitteeHotScriptHash) {
            return Credential.from_scripthash(this.variant.value);
        }
        return undefined;
    }
    to_drep_credential() {
        if (this.variant.kind == VoterKind.DRepKeyHash) {
            return Credential.from_keyhash(this.variant.value);
        }
        else if (this.variant.kind == VoterKind.DRepScriptHash) {
            return Credential.from_scripthash(this.variant.value);
        }
        return undefined;
    }
}
export class Voters {
    items;
    definiteEncoding;
    constructor(items, definiteEncoding = true) {
        this.items = items;
        this.definiteEncoding = definiteEncoding;
    }
    static new() {
        return new Voters([]);
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        this.items.push(elem);
    }
    static deserialize(reader, path) {
        const { items, definiteEncoding } = reader.readArray((reader, idx) => Voter.deserialize(reader, [...path, "Elem#" + idx]), path);
        return new Voters(items, definiteEncoding);
    }
    serialize(writer) {
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Voters"]) {
        let reader = new CBORReader(data);
        return Voters.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Voters"]) {
        return Voters.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Voters.from_bytes(this.to_bytes(), path);
    }
}
export class VotingProcedure {
    _vote;
    _anchor;
    constructor(vote, anchor) {
        this._vote = vote;
        this._anchor = anchor;
    }
    static new_with_anchor(vote, anchor) {
        return new VotingProcedure(vote, anchor);
    }
    vote() {
        return this._vote;
    }
    set_vote(vote) {
        this._vote = vote;
    }
    anchor() {
        return this._anchor;
    }
    set_anchor(anchor) {
        this._anchor = anchor;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 2) {
            throw new Error("Insufficient number of fields in record. Expected at least 2. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const vote_path = [...path, "VoteKind(vote)"];
        let vote = deserializeVoteKind(reader, vote_path);
        const anchor_path = [...path, "Anchor(anchor)"];
        let anchor = reader.readNullable((r) => Anchor.deserialize(r, anchor_path), path) ??
            undefined;
        return new VotingProcedure(vote, anchor);
    }
    serialize(writer) {
        let arrayLen = 2;
        writer.writeArrayTag(arrayLen);
        serializeVoteKind(writer, this._vote);
        if (this._anchor == null) {
            writer.writeNull();
        }
        else {
            this._anchor.serialize(writer);
        }
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["VotingProcedure"]) {
        let reader = new CBORReader(data);
        return VotingProcedure.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["VotingProcedure"]) {
        return VotingProcedure.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return VotingProcedure.from_bytes(this.to_bytes(), path);
    }
    static new(vote) {
        return new VotingProcedure(vote, undefined);
    }
}
export class VotingProcedures {
    _items;
    constructor(items) {
        this._items = items;
    }
    static new() {
        return new VotingProcedures([]);
    }
    len() {
        return this._items.length;
    }
    _insert(key, value) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry != null) {
            let ret = entry[1];
            entry[1] = value;
            return ret;
        }
        this._items.push([key, value]);
        return undefined;
    }
    _get(key) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry == null)
            return undefined;
        return entry[1];
    }
    _remove_many(keys) {
        this._items = this._items.filter(([k, _v]) => keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())));
    }
    keys() {
        let keys = Voters.new();
        for (let [key, _] of this._items)
            keys.add(key);
        return keys;
    }
    static deserialize(reader, path) {
        let ret = new VotingProcedures([]);
        reader.readMap((reader, idx) => ret._insert(Voter.deserialize(reader, [...path, "Voter#" + idx]), GovernanceActions.deserialize(reader, [
            ...path,
            "GovernanceActions#" + idx,
        ])), path);
        return ret;
    }
    serialize(writer) {
        writer.writeMap(this._items, (writer, x) => {
            x[0].serialize(writer);
            x[1].serialize(writer);
        });
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["VotingProcedures"]) {
        let reader = new CBORReader(data);
        return VotingProcedures.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["VotingProcedures"]) {
        return VotingProcedures.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return VotingProcedures.from_bytes(this.to_bytes(), path);
    }
    insert(voter, governance_action_id, voting_procedure) {
        let gov_actions = this._get(voter);
        if (gov_actions == null) {
            gov_actions = GovernanceActions.new();
            this._insert(voter, gov_actions);
        }
        gov_actions.insert(governance_action_id, voting_procedure);
    }
    get(voter, governance_action_id) {
        let gov_actions = this._get(voter);
        if (gov_actions == null)
            return undefined;
        return gov_actions.get(governance_action_id);
    }
    get_voters() {
        return this.keys();
    }
    get_governance_action_ids_by_voter(voter) {
        let gov_actions = this._get(voter);
        if (gov_actions == null)
            return GovernanceActionIds.new();
        return gov_actions.keys();
    }
}
export class VotingProposal {
    _deposit;
    _reward_account;
    _governance_action;
    _anchor;
    constructor(deposit, reward_account, governance_action, anchor) {
        this._deposit = deposit;
        this._reward_account = reward_account;
        this._governance_action = governance_action;
        this._anchor = anchor;
    }
    deposit() {
        return this._deposit;
    }
    set_deposit(deposit) {
        this._deposit = deposit;
    }
    reward_account() {
        return this._reward_account;
    }
    set_reward_account(reward_account) {
        this._reward_account = reward_account;
    }
    governance_action() {
        return this._governance_action;
    }
    set_governance_action(governance_action) {
        this._governance_action = governance_action;
    }
    anchor() {
        return this._anchor;
    }
    set_anchor(anchor) {
        this._anchor = anchor;
    }
    static deserialize(reader, path) {
        let len = reader.readArrayTag(path);
        if (len != null && len < 4) {
            throw new Error("Insufficient number of fields in record. Expected at least 4. Received " +
                len +
                "(at " +
                path.join("/"));
        }
        const deposit_path = [...path, "BigNum(deposit)"];
        let deposit = BigNum.deserialize(reader, deposit_path);
        const reward_account_path = [...path, "RewardAddress(reward_account)"];
        let reward_account = RewardAddress.deserialize(reader, reward_account_path);
        const governance_action_path = [
            ...path,
            "GovernanceAction(governance_action)",
        ];
        let governance_action = GovernanceAction.deserialize(reader, governance_action_path);
        const anchor_path = [...path, "Anchor(anchor)"];
        let anchor = Anchor.deserialize(reader, anchor_path);
        return new VotingProposal(deposit, reward_account, governance_action, anchor);
    }
    serialize(writer) {
        let arrayLen = 4;
        writer.writeArrayTag(arrayLen);
        this._deposit.serialize(writer);
        this._reward_account.serialize(writer);
        this._governance_action.serialize(writer);
        this._anchor.serialize(writer);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["VotingProposal"]) {
        let reader = new CBORReader(data);
        return VotingProposal.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["VotingProposal"]) {
        return VotingProposal.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return VotingProposal.from_bytes(this.to_bytes(), path);
    }
    static new(governance_action, anchor, reward_account, deposit) {
        return new VotingProposal(deposit, reward_account, governance_action, anchor);
    }
}
export class VotingProposals {
    items;
    definiteEncoding;
    nonEmptyTag;
    setItems(items) {
        this.items = items;
    }
    constructor(definiteEncoding = true, nonEmptyTag = true) {
        this.items = [];
        this.definiteEncoding = definiteEncoding;
        this.nonEmptyTag = nonEmptyTag;
    }
    static new() {
        return new VotingProposals();
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        if (this.contains(elem))
            return true;
        this.items.push(elem);
        return false;
    }
    contains(elem) {
        for (let item of this.items) {
            if (arrayEq(item.to_bytes(), elem.to_bytes())) {
                return true;
            }
        }
        return false;
    }
    static deserialize(reader, path) {
        let nonEmptyTag = false;
        if (reader.peekType(path) == "tagged") {
            let tag = reader.readTaggedTag(path);
            if (tag != 258) {
                throw new Error("Expected tag 258. Got " + tag);
            }
            else {
                nonEmptyTag = true;
            }
        }
        const { items, definiteEncoding } = reader.readArray((reader, idx) => VotingProposal.deserialize(reader, [...path, "VotingProposal#" + idx]), path);
        let ret = new VotingProposals(definiteEncoding, nonEmptyTag);
        ret.setItems(items);
        return ret;
    }
    serialize(writer) {
        if (this.nonEmptyTag) {
            writer.writeTaggedTag(258);
        }
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["VotingProposals"]) {
        let reader = new CBORReader(data);
        return VotingProposals.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["VotingProposals"]) {
        return VotingProposals.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return VotingProposals.from_bytes(this.to_bytes(), path);
    }
}
export class Withdrawals {
    _items;
    constructor(items) {
        this._items = items;
    }
    static new() {
        return new Withdrawals([]);
    }
    len() {
        return this._items.length;
    }
    insert(key, value) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry != null) {
            let ret = entry[1];
            entry[1] = value;
            return ret;
        }
        this._items.push([key, value]);
        return undefined;
    }
    get(key) {
        let entry = this._items.find((x) => arrayEq(key.to_bytes(), x[0].to_bytes()));
        if (entry == null)
            return undefined;
        return entry[1];
    }
    _remove_many(keys) {
        this._items = this._items.filter(([k, _v]) => keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())));
    }
    static deserialize(reader, path) {
        let ret = new Withdrawals([]);
        reader.readMap((reader, idx) => ret.insert(RewardAddress.deserialize(reader, [...path, "RewardAddress#" + idx]), BigNum.deserialize(reader, [...path, "BigNum#" + idx])), path);
        return ret;
    }
    serialize(writer) {
        writer.writeMap(this._items, (writer, x) => {
            x[0].serialize(writer);
            x[1].serialize(writer);
        });
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["Withdrawals"]) {
        let reader = new CBORReader(data);
        return Withdrawals.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["Withdrawals"]) {
        return Withdrawals.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return Withdrawals.from_bytes(this.to_bytes(), path);
    }
}
export class certificates {
    items;
    definiteEncoding;
    nonEmptyTag;
    setItems(items) {
        this.items = items;
    }
    constructor(definiteEncoding = true, nonEmptyTag = true) {
        this.items = [];
        this.definiteEncoding = definiteEncoding;
        this.nonEmptyTag = nonEmptyTag;
    }
    static new() {
        return new certificates();
    }
    len() {
        return this.items.length;
    }
    get(index) {
        if (index >= this.items.length)
            throw new Error("Array out of bounds");
        return this.items[index];
    }
    add(elem) {
        if (this.contains(elem))
            return true;
        this.items.push(elem);
        return false;
    }
    contains(elem) {
        for (let item of this.items) {
            if (arrayEq(item.to_bytes(), elem.to_bytes())) {
                return true;
            }
        }
        return false;
    }
    static deserialize(reader, path) {
        let nonEmptyTag = false;
        if (reader.peekType(path) == "tagged") {
            let tag = reader.readTaggedTag(path);
            if (tag != 258) {
                throw new Error("Expected tag 258. Got " + tag);
            }
            else {
                nonEmptyTag = true;
            }
        }
        const { items, definiteEncoding } = reader.readArray((reader, idx) => Certificate.deserialize(reader, [...path, "Certificate#" + idx]), path);
        let ret = new certificates(definiteEncoding, nonEmptyTag);
        ret.setItems(items);
        return ret;
    }
    serialize(writer) {
        if (this.nonEmptyTag) {
            writer.writeTaggedTag(258);
        }
        writer.writeArray(this.items, (writer, x) => x.serialize(writer), this.definiteEncoding);
    }
    // no-op
    free() { }
    static from_bytes(data, path = ["certificates"]) {
        let reader = new CBORReader(data);
        return certificates.deserialize(reader, path);
    }
    static from_hex(hex_str, path = ["certificates"]) {
        return certificates.from_bytes(hexToBytes(hex_str), path);
    }
    to_bytes() {
        let writer = new CBORWriter();
        this.serialize(writer);
        return writer.getBytes();
    }
    to_hex() {
        return bytesToHex(this.to_bytes());
    }
    clone(path) {
        return certificates.from_bytes(this.to_bytes(), path);
    }
}
