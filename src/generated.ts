import { CBORReader, bigintFromBytes } from "./lib/cbor/reader";
import { CBORWriter } from "./lib/cbor/writer";
import { GrowableBuffer } from "./lib/cbor/growable-buffer";
import { hexToBytes, bytesToHex } from "./lib/hex";
import { arrayEq } from "./lib/eq";
import { bech32 } from "bech32";
import * as cdlCrypto from "./lib/bip32-ed25519";
import { Address, Credential, CredKind, RewardAddress } from "./address";
import { webcrypto } from "crypto";

// Polyfill the global "crypto" object if it doesn't exist
if (typeof globalThis.crypto === "undefined") {
  // @ts-expect-error: Assigning Node.js webcrypto to globalThis.crypto
  globalThis.crypto = webcrypto;
}

function $$UN(id: string, ...args: any): any {
  throw "Undefined function: " + id;
}
const $$CANT_READ = (...args: any) => $$UN("$$CANT_READ", ...args);
const $$CANT_WRITE = (...args: any) => $$UN("$$CANT_WRITE", ...args);
const $$CANT_EQ = (...args: any) => $$UN("$$CANT_EQ", ...args);

export class Anchor {
  private _url: URL;
  private _anchor_data_hash: AnchorDataHash;

  constructor(url: URL, anchor_data_hash: AnchorDataHash) {
    this._url = url;
    this._anchor_data_hash = anchor_data_hash;
  }

  static new(url: URL, anchor_data_hash: AnchorDataHash) {
    return new Anchor(url, anchor_data_hash);
  }

  url(): URL {
    return this._url;
  }

  set_url(url: URL): void {
    this._url = url;
  }

  anchor_data_hash(): AnchorDataHash {
    return this._anchor_data_hash;
  }

  set_anchor_data_hash(anchor_data_hash: AnchorDataHash): void {
    this._anchor_data_hash = anchor_data_hash;
  }

  static deserialize(reader: CBORReader, path: string[]): Anchor {
    let len = reader.readArrayTag(path);

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 2. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const url_path = [...path, "URL(url)"];
    let url = URL.deserialize(reader, url_path);

    const anchor_data_hash_path = [...path, "AnchorDataHash(anchor_data_hash)"];
    let anchor_data_hash = AnchorDataHash.deserialize(
      reader,
      anchor_data_hash_path,
    );

    return new Anchor(url, anchor_data_hash);
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 2;

    writer.writeArrayTag(arrayLen);

    this._url.serialize(writer);
    this._anchor_data_hash.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["Anchor"]): Anchor {
    let reader = new CBORReader(data);
    return Anchor.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["Anchor"]): Anchor {
    return Anchor.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Anchor {
    return Anchor.from_bytes(this.to_bytes(), path);
  }
}

export class AnchorDataHash {
  private inner: Uint8Array;

  constructor(inner: Uint8Array) {
    if (inner.length != 32) throw new Error("Expected length to be 32");
    this.inner = inner;
  }

  static new(inner: Uint8Array): AnchorDataHash {
    return new AnchorDataHash(inner);
  }

  static from_bech32(bech_str: string): AnchorDataHash {
    let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new AnchorDataHash(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): AnchorDataHash {
    return new AnchorDataHash(data);
  }

  static from_hex(hex_str: string): AnchorDataHash {
    return AnchorDataHash.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    return this.inner;
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): AnchorDataHash {
    return AnchorDataHash.from_bytes(this.to_bytes());
  }

  static deserialize(reader: CBORReader, path: string[]): AnchorDataHash {
    return new AnchorDataHash(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }
}

export class AssetName {
  private inner: Uint8Array;

  constructor(inner: Uint8Array) {
    if (inner.length > 32) throw new Error("Expected length to be atmost 32");

    this.inner = inner;
  }

  static new(inner: Uint8Array): AssetName {
    return new AssetName(inner);
  }

  name(): Uint8Array {
    return this.inner;
  }

  static deserialize(reader: CBORReader, path: string[]): AssetName {
    return new AssetName(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["AssetName"],
  ): AssetName {
    let reader = new CBORReader(data);
    return AssetName.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["AssetName"]): AssetName {
    return AssetName.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): AssetName {
    return AssetName.from_bytes(this.to_bytes(), path);
  }
}

export class AssetNames {
  private items: AssetName[];
  private definiteEncoding: boolean;

  constructor(items: AssetName[], definiteEncoding: boolean = true) {
    this.items = items;
    this.definiteEncoding = definiteEncoding;
  }

  static new(): AssetNames {
    return new AssetNames([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): AssetName {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: AssetName): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader, path: string[]): AssetNames {
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) => AssetName.deserialize(reader, [...path, "Elem#" + idx]),
      path,
    );
    return new AssetNames(items, definiteEncoding);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["AssetNames"],
  ): AssetNames {
    let reader = new CBORReader(data);
    return AssetNames.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["AssetNames"],
  ): AssetNames {
    return AssetNames.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): AssetNames {
    return AssetNames.from_bytes(this.to_bytes(), path);
  }
}

export class Assets {
  _items: [AssetName, BigNum][];

  constructor(items: [AssetName, BigNum][]) {
    this._items = items;
  }

  static new(): Assets {
    return new Assets([]);
  }

  len(): number {
    return this._items.length;
  }

  insert(key: AssetName, value: BigNum): BigNum | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this._items.push([key, value]);
    return undefined;
  }

  get(key: AssetName): BigNum | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: AssetName[]): void {
    this._items = this._items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  keys(): AssetNames {
    let keys = AssetNames.new();
    for (let [key, _] of this._items) keys.add(key);
    return keys;
  }

  static deserialize(reader: CBORReader, path: string[]): Assets {
    let ret = new Assets([]);
    reader.readMap(
      (reader, idx) =>
        ret.insert(
          AssetName.deserialize(reader, [...path, "AssetName#" + idx]),
          BigNum.deserialize(reader, [...path, "BigNum#" + idx]),
        ),
      path,
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this._items, (writer, x) => {
      x[0].serialize(writer);
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["Assets"]): Assets {
    let reader = new CBORReader(data);
    return Assets.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["Assets"]): Assets {
    return Assets.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Assets {
    return Assets.from_bytes(this.to_bytes(), path);
  }

  _inplace_checked_add(rhs: Assets): void {
    for (let [asset_name, amount] of rhs._items) {
      let this_amount = this.get(asset_name);
      if (this_amount == null) this_amount = amount;
      else this_amount = this_amount.checked_add(amount);
      this.insert(asset_name, this_amount);
    }
  }

  _inplace_clamped_sub(rhs: Assets): void {
    for (let [asset_name, amount] of rhs._items) {
      let this_amount = this.get(asset_name);
      if (this_amount == null) continue;
      this_amount = this_amount.clamped_sub(amount);
      this.insert(asset_name, this_amount);
    }
    this._normalize();
  }

  _normalize(): void {
    let to_remove: AssetName[] = [];
    for (let [asset_name, amount] of this._items) {
      if (amount.is_zero()) to_remove.push(asset_name);
    }
    this._remove_many(to_remove);
  }

  _partial_cmp(rhs: Assets): number | undefined {
    const zero = BigNum.zero();
    let cmps = [
      false, // -1
      false, // 0
      false, // 1
    ];
    for (let [asset_name, this_amount] of this._items) {
      let rhs_amount = rhs.get(asset_name);
      if (rhs_amount == null) rhs_amount = zero;
      cmps[1 + this_amount.compare(rhs_amount)] = true;
    }

    for (let [asset_name, rhs_amount] of rhs._items) {
      let this_amount = this.get(asset_name);
      if (this_amount == null) this_amount = zero;
      cmps[1 + this_amount.compare(rhs_amount)];
    }

    let has_less = cmps[0];
    let has_equal = cmps[1];
    let has_greater = cmps[2];

    if (has_less && has_greater) return undefined;
    else if (has_less) return -1;
    else if (has_greater) return 1;
    else return 0;
  }
}

export enum AuxiliaryDataKind {
  GeneralTransactionMetadata = 0,
  AuxiliaryDataShelleyMa = 1,
  AuxiliaryDataPostAlonzo = 2,
}

export type AuxiliaryDataVariant =
  | { kind: 0; value: GeneralTransactionMetadata }
  | { kind: 1; value: AuxiliaryDataShelleyMa }
  | { kind: 2; value: AuxiliaryDataPostAlonzo };

export class AuxiliaryData {
  private variant: AuxiliaryDataVariant;

  constructor(variant: AuxiliaryDataVariant) {
    this.variant = variant;
  }

  static new_shelley_metadata(
    shelley_metadata: GeneralTransactionMetadata,
  ): AuxiliaryData {
    return new AuxiliaryData({ kind: 0, value: shelley_metadata });
  }

  static new_shelley_metadata_ma(
    shelley_metadata_ma: AuxiliaryDataShelleyMa,
  ): AuxiliaryData {
    return new AuxiliaryData({ kind: 1, value: shelley_metadata_ma });
  }

  static new_postalonzo_metadata(
    postalonzo_metadata: AuxiliaryDataPostAlonzo,
  ): AuxiliaryData {
    return new AuxiliaryData({ kind: 2, value: postalonzo_metadata });
  }

  as_shelley_metadata(): GeneralTransactionMetadata {
    if (this.variant.kind == 0) return this.variant.value;
    throw new Error("Incorrect cast");
  }

  as_shelley_metadata_ma(): AuxiliaryDataShelleyMa {
    if (this.variant.kind == 1) return this.variant.value;
    throw new Error("Incorrect cast");
  }

  as_postalonzo_metadata(): AuxiliaryDataPostAlonzo {
    if (this.variant.kind == 2) return this.variant.value;
    throw new Error("Incorrect cast");
  }

  kind(): AuxiliaryDataKind {
    return this.variant.kind;
  }

  static deserialize(reader: CBORReader, path: string[]): AuxiliaryData {
    let tag = reader.peekType(path);
    let variant: AuxiliaryDataVariant;

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
        throw new Error(
          "Unexpected subtype for AuxiliaryData: " +
            tag +
            "(at " +
            path.join("/") +
            ")",
        );
    }

    return new AuxiliaryData(variant);
  }

  serialize(writer: CBORWriter): void {
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
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["AuxiliaryData"],
  ): AuxiliaryData {
    let reader = new CBORReader(data);
    return AuxiliaryData.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["AuxiliaryData"],
  ): AuxiliaryData {
    return AuxiliaryData.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): AuxiliaryData {
    return AuxiliaryData.from_bytes(this.to_bytes(), path);
  }

  static new(): AuxiliaryData {
    const post_alonzo_auxiliary_data = new AuxiliaryDataPostAlonzo(
      GeneralTransactionMetadata.new(),
      NativeScripts.new(),
      PlutusScripts.new(),
      PlutusScripts.new(),
      PlutusScripts.new(),
    );
    return new AuxiliaryData({ kind: 2, value: post_alonzo_auxiliary_data });
  }

  metadata(): GeneralTransactionMetadata | undefined {
    switch (this.variant.kind) {
      case 0:
        return this.variant.value;
      case 1:
        return this.variant.value.transaction_metadata();
      case 2:
        return this.variant.value.metadata();
    }
  }

  set_metadata(metadata: GeneralTransactionMetadata): void {
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

  native_scripts(): NativeScripts | undefined {
    switch (this.variant.kind) {
      case 0:
        return undefined;
      case 1:
        return this.variant.value.auxiliary_scripts();
      case 2:
        return this.variant.value.native_scripts();
    }
  }

  set_native_scripts(native_scripts: NativeScripts): void {
    switch (this.variant.kind) {
      case 0:
        let v = AuxiliaryDataPostAlonzo.new(
          this.variant.value,
          native_scripts,
          undefined,
          undefined,
          undefined,
        );
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

  plutus_scripts_v1(): PlutusScripts | undefined {
    switch (this.variant.kind) {
      case 0:
        return undefined;
      case 1:
        return undefined;
      case 2:
        return this.variant.value.plutus_scripts_v1();
    }
  }

  set_plutus_scripts_v1(plutus_scripts_v1: PlutusScripts): void {
    switch (this.variant.kind) {
      case 0:
        let v1 = AuxiliaryDataPostAlonzo.new(
          this.variant.value,
          undefined,
          plutus_scripts_v1,
          undefined,
          undefined,
        );
        this.variant = { kind: 2, value: v1 };
        break;
      case 1:
        let v2 = AuxiliaryDataPostAlonzo.new(
          this.variant.value.transaction_metadata(),
          this.variant.value.auxiliary_scripts(),
          plutus_scripts_v1,
          undefined,
          undefined,
        );
        this.variant = { kind: 2, value: v2 };
        break;
      case 2:
        this.variant.value.set_plutus_scripts_v1(plutus_scripts_v1);
        break;
    }
  }

  plutus_scripts_v2(): PlutusScripts | undefined {
    switch (this.variant.kind) {
      case 0:
        return undefined;
      case 1:
        return undefined;
      case 2:
        return this.variant.value.plutus_scripts_v2();
    }
  }

  set_plutus_scripts_v2(plutus_scripts_v2: PlutusScripts): void {
    switch (this.variant.kind) {
      case 0:
        let v1 = AuxiliaryDataPostAlonzo.new(
          this.variant.value,
          undefined,
          undefined,
          plutus_scripts_v2,
          undefined,
        );
        this.variant = { kind: 2, value: v1 };
        break;
      case 1:
        let v2 = AuxiliaryDataPostAlonzo.new(
          this.variant.value.transaction_metadata(),
          this.variant.value.auxiliary_scripts(),
          undefined,
          plutus_scripts_v2,
          undefined,
        );
        this.variant = { kind: 2, value: v2 };
        break;
      case 2:
        this.variant.value.set_plutus_scripts_v2(plutus_scripts_v2);
        break;
    }
  }

  plutus_scripts_v3(): PlutusScripts | undefined {
    switch (this.variant.kind) {
      case 0:
        return undefined;
      case 1:
        return undefined;
      case 2:
        return this.variant.value.plutus_scripts_v3();
    }
  }

  set_plutus_scripts_v3(plutus_scripts_v3: PlutusScripts): void {
    switch (this.variant.kind) {
      case 0:
        let v3 = AuxiliaryDataPostAlonzo.new(
          this.variant.value,
          undefined,
          undefined,
          undefined,
          plutus_scripts_v3,
        );
        this.variant = { kind: 2, value: v3 };
        break;
      case 1:
        let v2 = AuxiliaryDataPostAlonzo.new(
          this.variant.value.transaction_metadata(),
          this.variant.value.auxiliary_scripts(),
          undefined,
          undefined,
          plutus_scripts_v3,
        );
        this.variant = { kind: 2, value: v2 };
        break;
      case 2:
        this.variant.value.set_plutus_scripts_v3(plutus_scripts_v3);
        break;
    }
  }
}

export class AuxiliaryDataHash {
  private inner: Uint8Array;

  constructor(inner: Uint8Array) {
    if (inner.length != 32) throw new Error("Expected length to be 32");
    this.inner = inner;
  }

  static new(inner: Uint8Array): AuxiliaryDataHash {
    return new AuxiliaryDataHash(inner);
  }

  static from_bech32(bech_str: string): AuxiliaryDataHash {
    let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new AuxiliaryDataHash(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): AuxiliaryDataHash {
    return new AuxiliaryDataHash(data);
  }

  static from_hex(hex_str: string): AuxiliaryDataHash {
    return AuxiliaryDataHash.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    return this.inner;
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): AuxiliaryDataHash {
    return AuxiliaryDataHash.from_bytes(this.to_bytes());
  }

  static deserialize(reader: CBORReader, path: string[]): AuxiliaryDataHash {
    return new AuxiliaryDataHash(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }
}

export class AuxiliaryDataPostAlonzo {
  private _metadata: GeneralTransactionMetadata | undefined;
  private _native_scripts: NativeScripts | undefined;
  private _plutus_scripts_v1: PlutusScripts | undefined;
  private _plutus_scripts_v2: PlutusScripts | undefined;
  private _plutus_scripts_v3: PlutusScripts | undefined;

  constructor(
    metadata: GeneralTransactionMetadata | undefined,
    native_scripts: NativeScripts | undefined,
    plutus_scripts_v1: PlutusScripts | undefined,
    plutus_scripts_v2: PlutusScripts | undefined,
    plutus_scripts_v3: PlutusScripts | undefined,
  ) {
    this._metadata = metadata;
    this._native_scripts = native_scripts;
    this._plutus_scripts_v1 = plutus_scripts_v1;
    this._plutus_scripts_v2 = plutus_scripts_v2;
    this._plutus_scripts_v3 = plutus_scripts_v3;
  }

  static new(
    metadata: GeneralTransactionMetadata | undefined,
    native_scripts: NativeScripts | undefined,
    plutus_scripts_v1: PlutusScripts | undefined,
    plutus_scripts_v2: PlutusScripts | undefined,
    plutus_scripts_v3: PlutusScripts | undefined,
  ) {
    return new AuxiliaryDataPostAlonzo(
      metadata,
      native_scripts,
      plutus_scripts_v1,
      plutus_scripts_v2,
      plutus_scripts_v3,
    );
  }

  metadata(): GeneralTransactionMetadata | undefined {
    return this._metadata;
  }

  set_metadata(metadata: GeneralTransactionMetadata | undefined): void {
    this._metadata = metadata;
  }

  native_scripts(): NativeScripts | undefined {
    return this._native_scripts;
  }

  set_native_scripts(native_scripts: NativeScripts | undefined): void {
    this._native_scripts = native_scripts;
  }

  plutus_scripts_v1(): PlutusScripts | undefined {
    return this._plutus_scripts_v1;
  }

  set_plutus_scripts_v1(plutus_scripts_v1: PlutusScripts | undefined): void {
    this._plutus_scripts_v1 = plutus_scripts_v1;
  }

  plutus_scripts_v2(): PlutusScripts | undefined {
    return this._plutus_scripts_v2;
  }

  set_plutus_scripts_v2(plutus_scripts_v2: PlutusScripts | undefined): void {
    this._plutus_scripts_v2 = plutus_scripts_v2;
  }

  plutus_scripts_v3(): PlutusScripts | undefined {
    return this._plutus_scripts_v3;
  }

  set_plutus_scripts_v3(plutus_scripts_v3: PlutusScripts | undefined): void {
    this._plutus_scripts_v3 = plutus_scripts_v3;
  }

  static deserialize(
    reader: CBORReader,
    path: string[] = ["AuxiliaryDataPostAlonzo"],
  ): AuxiliaryDataPostAlonzo {
    let taggedTag = reader.readTaggedTag(path);
    if (taggedTag != 259) {
      throw new Error(
        "Expected tag 259, got " + taggedTag + " (at " + path + ")",
      );
    }

    return AuxiliaryDataPostAlonzo.deserializeInner(reader, path);
  }

  static deserializeInner(
    reader: CBORReader,
    path: string[],
  ): AuxiliaryDataPostAlonzo {
    let fields: any = {};
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

    return new AuxiliaryDataPostAlonzo(
      metadata,
      native_scripts,
      plutus_scripts_v1,
      plutus_scripts_v2,
      plutus_scripts_v3,
    );
  }

  serialize(writer: CBORWriter): void {
    writer.writeTaggedTag(259);

    this.serializeInner(writer);
  }

  serializeInner(writer: CBORWriter): void {
    let len = 5;
    if (this._metadata === undefined) len -= 1;
    if (this._native_scripts === undefined) len -= 1;
    if (this._plutus_scripts_v1 === undefined) len -= 1;
    if (this._plutus_scripts_v2 === undefined) len -= 1;
    if (this._plutus_scripts_v3 === undefined) len -= 1;
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
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["AuxiliaryDataPostAlonzo"],
  ): AuxiliaryDataPostAlonzo {
    let reader = new CBORReader(data);
    return AuxiliaryDataPostAlonzo.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["AuxiliaryDataPostAlonzo"],
  ): AuxiliaryDataPostAlonzo {
    return AuxiliaryDataPostAlonzo.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): AuxiliaryDataPostAlonzo {
    return AuxiliaryDataPostAlonzo.from_bytes(this.to_bytes(), path);
  }
}

export class AuxiliaryDataSet {
  _items: [number, AuxiliaryData][];

  constructor(items: [number, AuxiliaryData][]) {
    this._items = items;
  }

  static new(): AuxiliaryDataSet {
    return new AuxiliaryDataSet([]);
  }

  len(): number {
    return this._items.length;
  }

  insert(key: number, value: AuxiliaryData): AuxiliaryData | undefined {
    let entry = this._items.find((x) => key === x[0]);
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this._items.push([key, value]);
    return undefined;
  }

  get(key: number): AuxiliaryData | undefined {
    let entry = this._items.find((x) => key === x[0]);
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: number[]): void {
    this._items = this._items.filter(([k, _v]) =>
      keys.every((key) => !(key === k)),
    );
  }

  static deserialize(reader: CBORReader, path: string[]): AuxiliaryDataSet {
    let ret = new AuxiliaryDataSet([]);
    reader.readMap(
      (reader, idx) =>
        ret.insert(
          Number(reader.readInt([...path, "number#" + idx])),
          AuxiliaryData.deserialize(reader, [...path, "AuxiliaryData#" + idx]),
        ),
      path,
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this._items, (writer, x) => {
      writer.writeInt(BigInt(x[0]));
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["AuxiliaryDataSet"],
  ): AuxiliaryDataSet {
    let reader = new CBORReader(data);
    return AuxiliaryDataSet.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["AuxiliaryDataSet"],
  ): AuxiliaryDataSet {
    return AuxiliaryDataSet.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): AuxiliaryDataSet {
    return AuxiliaryDataSet.from_bytes(this.to_bytes(), path);
  }

  indices(): Uint32Array {
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
  private _transaction_metadata: GeneralTransactionMetadata;
  private _auxiliary_scripts: NativeScripts;

  constructor(
    transaction_metadata: GeneralTransactionMetadata,
    auxiliary_scripts: NativeScripts,
  ) {
    this._transaction_metadata = transaction_metadata;
    this._auxiliary_scripts = auxiliary_scripts;
  }

  static new(
    transaction_metadata: GeneralTransactionMetadata,
    auxiliary_scripts: NativeScripts,
  ) {
    return new AuxiliaryDataShelleyMa(transaction_metadata, auxiliary_scripts);
  }

  transaction_metadata(): GeneralTransactionMetadata {
    return this._transaction_metadata;
  }

  set_transaction_metadata(
    transaction_metadata: GeneralTransactionMetadata,
  ): void {
    this._transaction_metadata = transaction_metadata;
  }

  auxiliary_scripts(): NativeScripts {
    return this._auxiliary_scripts;
  }

  set_auxiliary_scripts(auxiliary_scripts: NativeScripts): void {
    this._auxiliary_scripts = auxiliary_scripts;
  }

  static deserialize(
    reader: CBORReader,
    path: string[],
  ): AuxiliaryDataShelleyMa {
    let len = reader.readArrayTag(path);

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 2. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const transaction_metadata_path = [
      ...path,
      "GeneralTransactionMetadata(transaction_metadata)",
    ];
    let transaction_metadata = GeneralTransactionMetadata.deserialize(
      reader,
      transaction_metadata_path,
    );

    const auxiliary_scripts_path = [
      ...path,
      "NativeScripts(auxiliary_scripts)",
    ];
    let auxiliary_scripts = NativeScripts.deserialize(
      reader,
      auxiliary_scripts_path,
    );

    return new AuxiliaryDataShelleyMa(transaction_metadata, auxiliary_scripts);
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 2;

    writer.writeArrayTag(arrayLen);

    this._transaction_metadata.serialize(writer);
    this._auxiliary_scripts.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["AuxiliaryDataShelleyMa"],
  ): AuxiliaryDataShelleyMa {
    let reader = new CBORReader(data);
    return AuxiliaryDataShelleyMa.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["AuxiliaryDataShelleyMa"],
  ): AuxiliaryDataShelleyMa {
    return AuxiliaryDataShelleyMa.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): AuxiliaryDataShelleyMa {
    return AuxiliaryDataShelleyMa.from_bytes(this.to_bytes(), path);
  }
}

export class BigNum {
  private inner: bigint;

  constructor(inner: bigint) {
    if (inner < 0n) throw new Error("Expected value to be atleast 0n");
    if (inner > BigNum._maxU64())
      throw new Error("Expected value to be atmost BigNum._maxU64()");
    this.inner = inner;
  }

  static new(inner: bigint): BigNum {
    return new BigNum(inner);
  }

  toJsValue(): bigint {
    return this.inner;
  }

  static deserialize(reader: CBORReader, path: string[]): BigNum {
    return new BigNum(reader.readInt(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeInt(this.inner);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["BigNum"]): BigNum {
    let reader = new CBORReader(data);
    return BigNum.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["BigNum"]): BigNum {
    return BigNum.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): BigNum {
    return BigNum.from_bytes(this.to_bytes(), path);
  }

  // Lifted from: https://doc.rust-lang.org/std/primitive.u64.html#associatedconstant.MAX
  static _maxU64(): bigint {
    return 18446744073709551615n;
  }

  static from_str(string: string): BigNum {
    return new BigNum(BigInt(string));
  }

  to_str(): string {
    return this.toJsValue().toString();
  }

  static zero(): BigNum {
    return new BigNum(0n);
  }

  static one(): BigNum {
    return new BigNum(1n);
  }

  is_zero(): boolean {
    return this.toJsValue() == 0n;
  }

  div_floor(other: BigNum): BigNum {
    let res = this.toJsValue() / other.toJsValue();
    return new BigNum(res);
  }

  checked_mul(other: BigNum): BigNum {
    let res = this.toJsValue() * other.toJsValue();
    if (res > BigNum._maxU64()) throw new Error("BigNum.checked_mul overflow");
    return new BigNum(res);
  }

  checked_add(other: BigNum): BigNum {
    let res = this.toJsValue() + other.toJsValue();
    if (res > BigNum._maxU64()) throw new Error("BigNum.checked_add overflow");
    return new BigNum(res);
  }

  checked_sub(other: BigNum): BigNum {
    let res = this.toJsValue() - other.toJsValue();
    if (res < 0n) throw new Error("BigNum.checked_sub overflow");
    return new BigNum(res);
  }

  clamped_sub(other: BigNum): BigNum {
    let res = this.toJsValue() - other.toJsValue();
    if (res < 0n) res = 0n;
    return new BigNum(res);
  }

  compare(rhs_value: BigNum): number {
    if (this.toJsValue() < rhs_value.toJsValue()) return -1;
    else if (this.toJsValue() == rhs_value.toJsValue()) return 0;
    else return 1;
  }

  less_than(rhs_value: BigNum): boolean {
    return this.toJsValue() < rhs_value.toJsValue();
  }

  static max_value(): BigNum {
    return new BigNum(BigNum._maxU64());
  }

  static max(a: BigNum, b: BigNum): BigNum {
    if (a.toJsValue() > b.toJsValue()) return a;
    else return b;
  }

  static _from_number(x: number): BigNum {
    return new BigNum(BigInt(x));
  }

  _to_number(): number {
    return Number(this.toJsValue);
  }
}

export class Bip32PrivateKey {
  private inner: Uint8Array;

  constructor(inner: Uint8Array) {
    if (inner.length != 96) throw new Error("Expected length to be 96");
    this.inner = inner;
  }

  static new(inner: Uint8Array): Bip32PrivateKey {
    return new Bip32PrivateKey(inner);
  }

  static from_hex(hex_str: string): Bip32PrivateKey {
    return Bip32PrivateKey.from_bytes(hexToBytes(hex_str));
  }

  as_bytes(): Uint8Array {
    return this.inner;
  }

  to_hex(): string {
    return bytesToHex(this.as_bytes());
  }

  static deserialize(reader: CBORReader, path: string[]): Bip32PrivateKey {
    return new Bip32PrivateKey(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }

  static _LEN = 96;
  static _BECH32_HRP = "xprv";

  free(): void {
    for (let i = 0; i < this.inner.length; i++) this.inner[i] = 0x00;
  }

  static from_bech32(bech_str: string): Bip32PrivateKey {
    let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    if (decoded.prefix == Bip32PrivateKey._BECH32_HRP) {
      return new Bip32PrivateKey(bytes);
    } else {
      throw new Error("Invalid prefix for Bip32PrivateKey: " + decoded.prefix);
    }
  }

  to_bech32(): string {
    let prefix = Bip32PrivateKey._BECH32_HRP;
    return bech32.encode(
      prefix,
      bech32.toWords(this.inner),
      Number.MAX_SAFE_INTEGER,
    );
  }

  to_raw_key(): PrivateKey {
    return PrivateKey.from_extended_bytes(this.inner.slice(0, 64));
  }

  to_public(): Bip32PublicKey {
    let extended_secret = this.inner.slice(0, 64);
    let cc = this.chaincode();
    let pubkey = cdlCrypto.extendedToPubkey(extended_secret);
    let buf = new Uint8Array(64);
    buf.set(pubkey, 0);
    buf.set(cc, 32);
    return new Bip32PublicKey(buf);
  }

  static from_128_xprv(bytes: Uint8Array): Bip32PrivateKey {
    let buf = new Uint8Array(96);
    buf.set(bytes.slice(0, 64), 0);
    buf.set(bytes.slice(96, 128), 64);
    return Bip32PrivateKey.from_bytes(buf);
  }

  to_128_xprv(): Uint8Array {
    let prv_key = this.to_raw_key().as_bytes();
    let pub_key = this.to_public().as_bytes();
    let cc = this.chaincode();

    let buf = new Uint8Array(128);
    buf.set(prv_key, 0);
    buf.set(pub_key, 64);
    buf.set(cc, 96);
    return buf;
  }

  chaincode(): Uint8Array {
    return this.inner.slice(64, 96);
  }

  derive(index: number): Bip32PrivateKey {
    let { privateKey, chainCode } = cdlCrypto.derive.derivePrivate(
      this.inner.slice(0, 64),
      this.inner.slice(64, 96),
      index,
    );
    let buf = new Uint8Array(Bip32PrivateKey._LEN);
    buf.set(privateKey, 0);
    buf.set(chainCode, 64);
    return new Bip32PrivateKey(buf);
  }

  static generate_ed25519_bip32(): Bip32PrivateKey {
    let bytes = cdlCrypto.getRandomBytes(Bip32PrivateKey._LEN);
    cdlCrypto.normalizeExtendedForBip32Ed25519(bytes);
    return new Bip32PrivateKey(bytes);
  }

  static from_bip39_entropy(
    entropy: Uint8Array,
    password: Uint8Array,
  ): Bip32PrivateKey {
    return new Bip32PrivateKey(
      cdlCrypto.bip32PrivateKeyFromEntropy(entropy, password),
    );
  }

  static from_bytes(bytes: Uint8Array): Bip32PrivateKey {
    if (bytes.length != Bip32PrivateKey._LEN) {
      throw new Error("Invalid length");
    }
    let scalar = bytes.slice(0, 32);
    let last = scalar[31];
    let first = scalar[0];
    if (
      (last & 0b1100_0000) != 0b0100_0000 ||
      (first & 0b0000_0111) == 0b0000_0000
    ) {
      throw new Error("invalid bytes");
    }
    return new Bip32PrivateKey(bytes);
  }
}

export class Bip32PublicKey {
  private inner: Uint8Array;

  constructor(inner: Uint8Array) {
    if (inner.length != 64) throw new Error("Expected length to be 64");
    this.inner = inner;
  }

  static new(inner: Uint8Array): Bip32PublicKey {
    return new Bip32PublicKey(inner);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Bip32PublicKey {
    return new Bip32PublicKey(data);
  }

  static from_hex(hex_str: string): Bip32PublicKey {
    return Bip32PublicKey.from_bytes(hexToBytes(hex_str));
  }

  as_bytes(): Uint8Array {
    return this.inner;
  }

  to_hex(): string {
    return bytesToHex(this.as_bytes());
  }

  static deserialize(reader: CBORReader, path: string[]): Bip32PublicKey {
    return new Bip32PublicKey(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }

  static _LEN = 64;
  static _BECH32_HRP = "xpub";

  chaincode(): Uint8Array {
    return this.inner.slice(32, 64);
  }

  static from_bech32(bech_str: string): Bip32PublicKey {
    let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    if (decoded.prefix == Bip32PublicKey._BECH32_HRP) {
      return new Bip32PublicKey(bytes);
    } else {
      throw new Error("Invalid prefix for Bip32PublicKey: " + decoded.prefix);
    }
  }

  to_bech32(): string {
    let prefix = Bip32PublicKey._BECH32_HRP;
    return bech32.encode(
      prefix,
      bech32.toWords(this.inner),
      Number.MAX_SAFE_INTEGER,
    );
  }

  to_raw_key(): PublicKey {
    return PublicKey.from_bytes(this.inner.slice(0, 32));
  }

  derive(index: number): Bip32PublicKey {
    let { publicKey, chainCode } = cdlCrypto.derive.derivePublic(
      this.inner.slice(0, 32),
      this.inner.slice(32, 64),
      index,
    );
    let buf = new Uint8Array(Bip32PublicKey._LEN);
    buf.set(publicKey, 0);
    buf.set(chainCode, 32);
    return new Bip32PublicKey(buf);
  }
}

export class Block {
  private _header: Header;
  private _transaction_bodies: TransactionBodies;
  private _transaction_witness_sets: TransactionWitnessSets;
  private _auxiliary_data_set: AuxiliaryDataSet;
  private _inner_invalid_transactions: InvalidTransactions;

  constructor(
    header: Header,
    transaction_bodies: TransactionBodies,
    transaction_witness_sets: TransactionWitnessSets,
    auxiliary_data_set: AuxiliaryDataSet,
    inner_invalid_transactions: InvalidTransactions,
  ) {
    this._header = header;
    this._transaction_bodies = transaction_bodies;
    this._transaction_witness_sets = transaction_witness_sets;
    this._auxiliary_data_set = auxiliary_data_set;
    this._inner_invalid_transactions = inner_invalid_transactions;
  }

  header(): Header {
    return this._header;
  }

  set_header(header: Header): void {
    this._header = header;
  }

  transaction_bodies(): TransactionBodies {
    return this._transaction_bodies;
  }

  set_transaction_bodies(transaction_bodies: TransactionBodies): void {
    this._transaction_bodies = transaction_bodies;
  }

  transaction_witness_sets(): TransactionWitnessSets {
    return this._transaction_witness_sets;
  }

  set_transaction_witness_sets(
    transaction_witness_sets: TransactionWitnessSets,
  ): void {
    this._transaction_witness_sets = transaction_witness_sets;
  }

  auxiliary_data_set(): AuxiliaryDataSet {
    return this._auxiliary_data_set;
  }

  set_auxiliary_data_set(auxiliary_data_set: AuxiliaryDataSet): void {
    this._auxiliary_data_set = auxiliary_data_set;
  }

  inner_invalid_transactions(): InvalidTransactions {
    return this._inner_invalid_transactions;
  }

  set_inner_invalid_transactions(
    inner_invalid_transactions: InvalidTransactions,
  ): void {
    this._inner_invalid_transactions = inner_invalid_transactions;
  }

  static deserialize(reader: CBORReader, path: string[]): Block {
    let len = reader.readArrayTag(path);

    if (len != null && len < 5) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 5. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const header_path = [...path, "Header(header)"];
    let header = Header.deserialize(reader, header_path);

    const transaction_bodies_path = [
      ...path,
      "TransactionBodies(transaction_bodies)",
    ];
    let transaction_bodies = TransactionBodies.deserialize(
      reader,
      transaction_bodies_path,
    );

    const transaction_witness_sets_path = [
      ...path,
      "TransactionWitnessSets(transaction_witness_sets)",
    ];
    let transaction_witness_sets = TransactionWitnessSets.deserialize(
      reader,
      transaction_witness_sets_path,
    );

    const auxiliary_data_set_path = [
      ...path,
      "AuxiliaryDataSet(auxiliary_data_set)",
    ];
    let auxiliary_data_set = AuxiliaryDataSet.deserialize(
      reader,
      auxiliary_data_set_path,
    );

    const inner_invalid_transactions_path = [
      ...path,
      "InvalidTransactions(inner_invalid_transactions)",
    ];
    let inner_invalid_transactions = InvalidTransactions.deserialize(
      reader,
      inner_invalid_transactions_path,
    );

    return new Block(
      header,
      transaction_bodies,
      transaction_witness_sets,
      auxiliary_data_set,
      inner_invalid_transactions,
    );
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 5;

    writer.writeArrayTag(arrayLen);

    this._header.serialize(writer);
    this._transaction_bodies.serialize(writer);
    this._transaction_witness_sets.serialize(writer);
    this._auxiliary_data_set.serialize(writer);
    this._inner_invalid_transactions.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["Block"]): Block {
    let reader = new CBORReader(data);
    return Block.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["Block"]): Block {
    return Block.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Block {
    return Block.from_bytes(this.to_bytes(), path);
  }

  static new(
    header: Header,
    transaction_bodies: TransactionBodies,
    transaction_witness_sets: TransactionWitnessSets,
    auxiliary_data_set: AuxiliaryDataSet,
    invalid_transactions: Uint32Array,
  ): Block {
    return new Block(
      header,
      transaction_bodies,
      transaction_witness_sets,
      auxiliary_data_set,
      new InvalidTransactions(invalid_transactions),
    );
  }

  invalid_transactions(): Uint32Array {
    return this.inner_invalid_transactions().as_uint32Array();
  }

  set_invalid_transactions(invalid_transactions: Uint32Array) {
    this._inner_invalid_transactions = new InvalidTransactions(
      invalid_transactions,
    );
  }
}

export class BlockHash {
  private inner: Uint8Array;

  constructor(inner: Uint8Array) {
    if (inner.length != 32) throw new Error("Expected length to be 32");
    this.inner = inner;
  }

  static new(inner: Uint8Array): BlockHash {
    return new BlockHash(inner);
  }

  static from_bech32(bech_str: string): BlockHash {
    let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new BlockHash(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): BlockHash {
    return new BlockHash(data);
  }

  static from_hex(hex_str: string): BlockHash {
    return BlockHash.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    return this.inner;
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): BlockHash {
    return BlockHash.from_bytes(this.to_bytes());
  }

  static deserialize(reader: CBORReader, path: string[]): BlockHash {
    return new BlockHash(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }
}

export class BootstrapWitness {
  private _vkey: Vkey;
  private _signature: Ed25519Signature;
  private _chain_code: Uint8Array;
  private _attributes: Uint8Array;

  constructor(
    vkey: Vkey,
    signature: Ed25519Signature,
    chain_code: Uint8Array,
    attributes: Uint8Array,
  ) {
    this._vkey = vkey;
    this._signature = signature;
    this._chain_code = chain_code;
    this._attributes = attributes;
  }

  static new(
    vkey: Vkey,
    signature: Ed25519Signature,
    chain_code: Uint8Array,
    attributes: Uint8Array,
  ) {
    return new BootstrapWitness(vkey, signature, chain_code, attributes);
  }

  vkey(): Vkey {
    return this._vkey;
  }

  set_vkey(vkey: Vkey): void {
    this._vkey = vkey;
  }

  signature(): Ed25519Signature {
    return this._signature;
  }

  set_signature(signature: Ed25519Signature): void {
    this._signature = signature;
  }

  chain_code(): Uint8Array {
    return this._chain_code;
  }

  set_chain_code(chain_code: Uint8Array): void {
    this._chain_code = chain_code;
  }

  attributes(): Uint8Array {
    return this._attributes;
  }

  set_attributes(attributes: Uint8Array): void {
    this._attributes = attributes;
  }

  static deserialize(reader: CBORReader, path: string[]): BootstrapWitness {
    let len = reader.readArrayTag(path);

    if (len != null && len < 4) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 4. Received " +
          len +
          "(at " +
          path.join("/"),
      );
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

  serialize(writer: CBORWriter): void {
    let arrayLen = 4;

    writer.writeArrayTag(arrayLen);

    this._vkey.serialize(writer);
    this._signature.serialize(writer);
    writer.writeBytes(this._chain_code);
    writer.writeBytes(this._attributes);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["BootstrapWitness"],
  ): BootstrapWitness {
    let reader = new CBORReader(data);
    return BootstrapWitness.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["BootstrapWitness"],
  ): BootstrapWitness {
    return BootstrapWitness.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): BootstrapWitness {
    return BootstrapWitness.from_bytes(this.to_bytes(), path);
  }
}

export class BootstrapWitnesses {
  private items: BootstrapWitness[];
  private definiteEncoding: boolean;
  private nonEmptyTag: boolean;

  private setItems(items: BootstrapWitness[]) {
    this.items = items;
  }

  constructor(definiteEncoding: boolean = true, nonEmptyTag: boolean = true) {
    this.items = [];
    this.definiteEncoding = definiteEncoding;
    this.nonEmptyTag = nonEmptyTag;
  }

  static new(): BootstrapWitnesses {
    return new BootstrapWitnesses();
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): BootstrapWitness {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: BootstrapWitness): boolean {
    if (this.contains(elem)) return true;
    this.items.push(elem);
    return false;
  }

  contains(elem: BootstrapWitness): boolean {
    for (let item of this.items) {
      if (arrayEq(item.to_bytes(), elem.to_bytes())) {
        return true;
      }
    }
    return false;
  }

  static deserialize(reader: CBORReader, path: string[]): BootstrapWitnesses {
    let nonEmptyTag = false;
    if (reader.peekType(path) == "tagged") {
      let tag = reader.readTaggedTag(path);
      if (tag != 258) {
        throw new Error("Expected tag 258. Got " + tag);
      } else {
        nonEmptyTag = true;
      }
    }
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) =>
        BootstrapWitness.deserialize(reader, [
          ...path,
          "BootstrapWitness#" + idx,
        ]),
      path,
    );
    let ret = new BootstrapWitnesses(definiteEncoding, nonEmptyTag);
    ret.setItems(items);
    return ret;
  }

  serialize(writer: CBORWriter): void {
    if (this.nonEmptyTag) {
      writer.writeTaggedTag(258);
    }
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["BootstrapWitnesses"],
  ): BootstrapWitnesses {
    let reader = new CBORReader(data);
    return BootstrapWitnesses.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["BootstrapWitnesses"],
  ): BootstrapWitnesses {
    return BootstrapWitnesses.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): BootstrapWitnesses {
    return BootstrapWitnesses.from_bytes(this.to_bytes(), path);
  }
}

export class CSLBigInt {
  private inner: bigint;

  constructor(inner: bigint) {
    this.inner = inner;
  }

  static new(inner: bigint): CSLBigInt {
    return new CSLBigInt(inner);
  }

  toJsValue(): bigint {
    return this.inner;
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["CSLBigInt"],
  ): CSLBigInt {
    let reader = new CBORReader(data);
    return CSLBigInt.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["CSLBigInt"]): CSLBigInt {
    return CSLBigInt.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): CSLBigInt {
    return CSLBigInt.from_bytes(this.to_bytes(), path);
  }

  static from_str(string: string): CSLBigInt {
    return new CSLBigInt(BigInt(string));
  }

  to_str(): string {
    return this.toJsValue().toString();
  }

  static zero(): CSLBigInt {
    return new CSLBigInt(0n);
  }

  static one(): CSLBigInt {
    return new CSLBigInt(1n);
  }

  is_zero(): boolean {
    return this.toJsValue() == 0n;
  }

  add(other: CSLBigInt): CSLBigInt {
    let res = this.toJsValue() + other.toJsValue();
    return new CSLBigInt(res);
  }

  sub(other: CSLBigInt): CSLBigInt {
    let res = this.toJsValue() - other.toJsValue();
    return new CSLBigInt(res);
  }

  mul(other: CSLBigInt): CSLBigInt {
    let res = this.toJsValue() * other.toJsValue();
    return new CSLBigInt(res);
  }

  pow(other: number): CSLBigInt {
    let res = this.toJsValue() ** BigInt(other);
    return new CSLBigInt(res);
  }

  div_floor(other: CSLBigInt): CSLBigInt {
    let res = this.toJsValue() / other.toJsValue();
    return new CSLBigInt(res);
  }

  div_ceil(other: CSLBigInt): CSLBigInt {
    let a = this.toJsValue();
    let b = other.toJsValue();
    let res = a / b;
    let rem = a % b;
    if (rem !== 0n && ((a < 0n && b < 0n) || (a > 0n && b > 0n))) {
      return new CSLBigInt(res + 1n);
    }
    return new CSLBigInt(res);
  }

  abs(): CSLBigInt {
    if (this.toJsValue() < 0) return new CSLBigInt(this.toJsValue() * -1n);
    return this;
  }

  increment(): CSLBigInt {
    return new CSLBigInt(this.toJsValue() + 1n);
  }

  static max(a: CSLBigInt, b: CSLBigInt): CSLBigInt {
    if (a.toJsValue() > b.toJsValue()) return a;
    else return b;
  }

  as_u64(): BigNum | undefined {
    let inner = this.toJsValue();
    if (inner <= BigNum._maxU64()) {
      return new BigNum(inner);
    }
    return undefined;
  }

  as_int(): Int | undefined {
    let inner = this.toJsValue();
    if (inner >= Int._minI32() && inner <= Int._maxI32()) return new Int(inner);
    return undefined;
  }

  serialize(writer: CBORWriter): void {
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
    } else {
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

  static deserialize(reader: CBORReader, path: string[]): CSLBigInt {
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
    } else if (tag == 3) {
      isNegative = true;
    } else {
      throw new Error(
        "Unknown tag: " + tag + ". Expected 2 or 3 (at" + path.join("/") + ")",
      );
    }

    let bytes = reader.readBytes(path);
    let valueAbs = bigintFromBytes(bytes.length, bytes);
    let value = isNegative ? valueAbs * -1n : valueAbs;
    return new CSLBigInt(value);
  }
}

export { CSLBigInt as BigInt };

export enum CertificateKind {
  StakeRegistration = 0,
  StakeDeregistration = 1,
  StakeDelegation = 2,
  PoolRegistration = 3,
  PoolRetirement = 4,
  RegCert = 7,
  UnregCert = 8,
  VoteDelegation = 9,
  StakeAndVoteDelegation = 10,
  StakeRegistrationAndDelegation = 11,
  VoteRegistrationAndDelegation = 12,
  StakeVoteRegistrationAndDelegation = 13,
  CommitteeHotAuth = 14,
  CommitteeColdResign = 15,
  DRepRegistration = 16,
  DRepDeregistration = 17,
  DRepUpdate = 18,
}

export type CertificateVariant =
  | { kind: 0; value: StakeRegistration }
  | { kind: 1; value: StakeDeregistration }
  | { kind: 2; value: StakeDelegation }
  | { kind: 3; value: PoolRegistration }
  | { kind: 4; value: PoolRetirement }
  | { kind: 7; value: RegCert }
  | { kind: 8; value: UnregCert }
  | { kind: 9; value: VoteDelegation }
  | { kind: 10; value: StakeAndVoteDelegation }
  | { kind: 11; value: StakeRegistrationAndDelegation }
  | { kind: 12; value: VoteRegistrationAndDelegation }
  | { kind: 13; value: StakeVoteRegistrationAndDelegation }
  | { kind: 14; value: CommitteeHotAuth }
  | { kind: 15; value: CommitteeColdResign }
  | { kind: 16; value: DRepRegistration }
  | { kind: 17; value: DRepDeregistration }
  | { kind: 18; value: DRepUpdate };

export class Certificate {
  private variant: CertificateVariant;

  constructor(variant: CertificateVariant) {
    this.variant = variant;
  }

  static new_stake_registration(
    stake_registration: StakeRegistration,
  ): Certificate {
    return new Certificate({ kind: 0, value: stake_registration });
  }

  static new_stake_deregistration(
    stake_deregistration: StakeDeregistration,
  ): Certificate {
    return new Certificate({ kind: 1, value: stake_deregistration });
  }

  static new_stake_delegation(stake_delegation: StakeDelegation): Certificate {
    return new Certificate({ kind: 2, value: stake_delegation });
  }

  static new_pool_registration(
    pool_registration: PoolRegistration,
  ): Certificate {
    return new Certificate({ kind: 3, value: pool_registration });
  }

  static new_pool_retirement(pool_retirement: PoolRetirement): Certificate {
    return new Certificate({ kind: 4, value: pool_retirement });
  }

  static new_reg_cert(reg_cert: RegCert): Certificate {
    return new Certificate({ kind: 7, value: reg_cert });
  }

  static new_unreg_cert(unreg_cert: UnregCert): Certificate {
    return new Certificate({ kind: 8, value: unreg_cert });
  }

  static new_vote_delegation(vote_delegation: VoteDelegation): Certificate {
    return new Certificate({ kind: 9, value: vote_delegation });
  }

  static new_stake_and_vote_delegation(
    stake_and_vote_delegation: StakeAndVoteDelegation,
  ): Certificate {
    return new Certificate({ kind: 10, value: stake_and_vote_delegation });
  }

  static new_stake_registration_and_delegation(
    stake_registration_and_delegation: StakeRegistrationAndDelegation,
  ): Certificate {
    return new Certificate({
      kind: 11,
      value: stake_registration_and_delegation,
    });
  }

  static new_vote_registration_and_delegation(
    vote_registration_and_delegation: VoteRegistrationAndDelegation,
  ): Certificate {
    return new Certificate({
      kind: 12,
      value: vote_registration_and_delegation,
    });
  }

  static new_stake_vote_registration_and_delegation(
    stake_vote_registration_and_delegation: StakeVoteRegistrationAndDelegation,
  ): Certificate {
    return new Certificate({
      kind: 13,
      value: stake_vote_registration_and_delegation,
    });
  }

  static new_committee_hot_auth(
    committee_hot_auth: CommitteeHotAuth,
  ): Certificate {
    return new Certificate({ kind: 14, value: committee_hot_auth });
  }

  static new_committee_cold_resign(
    committee_cold_resign: CommitteeColdResign,
  ): Certificate {
    return new Certificate({ kind: 15, value: committee_cold_resign });
  }

  static new_drep_registration(
    drep_registration: DRepRegistration,
  ): Certificate {
    return new Certificate({ kind: 16, value: drep_registration });
  }

  static new_drep_deregistration(
    drep_deregistration: DRepDeregistration,
  ): Certificate {
    return new Certificate({ kind: 17, value: drep_deregistration });
  }

  static new_drep_update(drep_update: DRepUpdate): Certificate {
    return new Certificate({ kind: 18, value: drep_update });
  }

  as_stake_registration(): StakeRegistration | undefined {
    if (this.variant.kind == 0) return this.variant.value;
  }

  as_stake_deregistration(): StakeDeregistration | undefined {
    if (this.variant.kind == 1) return this.variant.value;
  }

  as_stake_delegation(): StakeDelegation | undefined {
    if (this.variant.kind == 2) return this.variant.value;
  }

  as_pool_registration(): PoolRegistration | undefined {
    if (this.variant.kind == 3) return this.variant.value;
  }

  as_pool_retirement(): PoolRetirement | undefined {
    if (this.variant.kind == 4) return this.variant.value;
  }

  as_reg_cert(): RegCert | undefined {
    if (this.variant.kind == 7) return this.variant.value;
  }

  as_unreg_cert(): UnregCert | undefined {
    if (this.variant.kind == 8) return this.variant.value;
  }

  as_vote_delegation(): VoteDelegation | undefined {
    if (this.variant.kind == 9) return this.variant.value;
  }

  as_stake_and_vote_delegation(): StakeAndVoteDelegation | undefined {
    if (this.variant.kind == 10) return this.variant.value;
  }

  as_stake_registration_and_delegation():
    | StakeRegistrationAndDelegation
    | undefined {
    if (this.variant.kind == 11) return this.variant.value;
  }

  as_vote_registration_and_delegation():
    | VoteRegistrationAndDelegation
    | undefined {
    if (this.variant.kind == 12) return this.variant.value;
  }

  as_stake_vote_registration_and_delegation():
    | StakeVoteRegistrationAndDelegation
    | undefined {
    if (this.variant.kind == 13) return this.variant.value;
  }

  as_committee_hot_auth(): CommitteeHotAuth | undefined {
    if (this.variant.kind == 14) return this.variant.value;
  }

  as_committee_cold_resign(): CommitteeColdResign | undefined {
    if (this.variant.kind == 15) return this.variant.value;
  }

  as_drep_registration(): DRepRegistration | undefined {
    if (this.variant.kind == 16) return this.variant.value;
  }

  as_drep_deregistration(): DRepDeregistration | undefined {
    if (this.variant.kind == 17) return this.variant.value;
  }

  as_drep_update(): DRepUpdate | undefined {
    if (this.variant.kind == 18) return this.variant.value;
  }

  kind(): CertificateKind {
    return this.variant.kind;
  }

  static deserialize(reader: CBORReader, path: string[]): Certificate {
    let len = reader.readArrayTag(path);
    let tag = Number(reader.readUint(path));
    let variant: CertificateVariant;

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
          throw new Error(
            "Expected 3 items to decode StakeRegistrationAndDelegation",
          );
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
          throw new Error(
            "Expected 3 items to decode VoteRegistrationAndDelegation",
          );
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
          throw new Error(
            "Expected 4 items to decode StakeVoteRegistrationAndDelegation",
          );
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
        throw new Error(
          "Unexpected tag for Certificate: " +
            tag +
            "(at " +
            path.join("/") +
            ")",
        );
    }

    if (len == null) {
      reader.readBreak();
    }

    return new Certificate(variant);
  }

  serialize(writer: CBORWriter): void {
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
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["Certificate"],
  ): Certificate {
    let reader = new CBORReader(data);
    return Certificate.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["Certificate"],
  ): Certificate {
    return Certificate.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Certificate {
    return Certificate.from_bytes(this.to_bytes(), path);
  }
}

export class Certificates {
  private items: Certificate[];
  private definiteEncoding: boolean;
  private nonEmptyTag: boolean;

  private setItems(items: Certificate[]) {
    this.items = items;
  }

  constructor(definiteEncoding: boolean = true, nonEmptyTag: boolean = true) {
    this.items = [];
    this.definiteEncoding = definiteEncoding;
    this.nonEmptyTag = nonEmptyTag;
  }

  static new(): Certificates {
    return new Certificates();
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): Certificate {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: Certificate): boolean {
    if (this.contains(elem)) return true;
    this.items.push(elem);
    return false;
  }

  contains(elem: Certificate): boolean {
    for (let item of this.items) {
      if (arrayEq(item.to_bytes(), elem.to_bytes())) {
        return true;
      }
    }
    return false;
  }

  static deserialize(reader: CBORReader, path: string[]): Certificates {
    let nonEmptyTag = false;
    if (reader.peekType(path) == "tagged") {
      let tag = reader.readTaggedTag(path);
      if (tag != 258) {
        throw new Error("Expected tag 258. Got " + tag);
      } else {
        nonEmptyTag = true;
      }
    }
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) =>
        Certificate.deserialize(reader, [...path, "Certificate#" + idx]),
      path,
    );
    let ret = new Certificates(definiteEncoding, nonEmptyTag);
    ret.setItems(items);
    return ret;
  }

  serialize(writer: CBORWriter): void {
    if (this.nonEmptyTag) {
      writer.writeTaggedTag(258);
    }
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["Certificates"],
  ): Certificates {
    let reader = new CBORReader(data);
    return Certificates.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["Certificates"],
  ): Certificates {
    return Certificates.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Certificates {
    return Certificates.from_bytes(this.to_bytes(), path);
  }
}

export class ChangeConfig {
  private _address: Address;
  private _plutus_data: OutputDatum | undefined;
  private _script_ref: ScriptRef | undefined;

  constructor(
    address: Address,
    plutus_data: OutputDatum | undefined,
    script_ref: ScriptRef | undefined,
  ) {
    this._address = address;
    this._plutus_data = plutus_data;
    this._script_ref = script_ref;
  }

  address(): Address {
    return this._address;
  }

  set_address(address: Address): void {
    this._address = address;
  }

  plutus_data(): OutputDatum | undefined {
    return this._plutus_data;
  }

  set_plutus_data(plutus_data: OutputDatum | undefined): void {
    this._plutus_data = plutus_data;
  }

  script_ref(): ScriptRef | undefined {
    return this._script_ref;
  }

  set_script_ref(script_ref: ScriptRef | undefined): void {
    this._script_ref = script_ref;
  }

  static deserialize(reader: CBORReader, path: string[]): ChangeConfig {
    let len = reader.readArrayTag(path);

    if (len != null && len < 3) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 3. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const address_path = [...path, "Address(address)"];
    let address = Address.deserialize(reader, address_path);

    const plutus_data_path = [...path, "OutputDatum(plutus_data)"];
    let plutus_data =
      reader.readNullable(
        (r) => OutputDatum.deserialize(r, plutus_data_path),
        path,
      ) ?? undefined;

    const script_ref_path = [...path, "ScriptRef(script_ref)"];
    let script_ref =
      reader.readNullable(
        (r) => ScriptRef.deserialize(r, script_ref_path),
        path,
      ) ?? undefined;

    return new ChangeConfig(address, plutus_data, script_ref);
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 3;

    writer.writeArrayTag(arrayLen);

    this._address.serialize(writer);
    if (this._plutus_data == null) {
      writer.writeNull();
    } else {
      this._plutus_data.serialize(writer);
    }
    if (this._script_ref == null) {
      writer.writeNull();
    } else {
      this._script_ref.serialize(writer);
    }
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["ChangeConfig"],
  ): ChangeConfig {
    let reader = new CBORReader(data);
    return ChangeConfig.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["ChangeConfig"],
  ): ChangeConfig {
    return ChangeConfig.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): ChangeConfig {
    return ChangeConfig.from_bytes(this.to_bytes(), path);
  }

  static new(address: Address): ChangeConfig {
    return new ChangeConfig(address, undefined, undefined);
  }
  change_address(address: Address): ChangeConfig {
    return new ChangeConfig(address, this._plutus_data, this._script_ref);
  }
  change_plutus_data(plutus_data: OutputDatum): ChangeConfig {
    return new ChangeConfig(this._address, plutus_data, this._script_ref);
  }
  change_script_ref(script_ref: ScriptRef): ChangeConfig {
    return new ChangeConfig(this._address, this._plutus_data, script_ref);
  }
}

export class Committee {
  quorum_threshold_: UnitInterval;
  members_: CommitteeEpochs;

  constructor(quorum_threshold: UnitInterval, members: CommitteeEpochs) {
    this.quorum_threshold_ = quorum_threshold;
    this.members_ = members;
  }

  static new(quorum_threshold: UnitInterval): Committee {
    return new Committee(quorum_threshold, CommitteeEpochs.new());
  }

  members_keys(): Credentials {
    let credentials = new Credentials();
    for (let [k, _] of this.members_._items) {
      credentials.add(k);
    }
    return credentials;
  }

  quorum_threshold(): UnitInterval {
    return this.quorum_threshold_;
  }

  add_member(committee_cold_credential: Credential, epoch: number): void {
    this.members_.insert(committee_cold_credential, epoch);
  }

  get_member_epoch(committee_cold_credential: Credential): number | undefined {
    return this.members_.get(committee_cold_credential);
  }
}

export class CommitteeColdResign {
  private _committee_cold_credential: Credential;
  private _anchor: Anchor | undefined;

  constructor(
    committee_cold_credential: Credential,
    anchor: Anchor | undefined,
  ) {
    this._committee_cold_credential = committee_cold_credential;
    this._anchor = anchor;
  }

  committee_cold_credential(): Credential {
    return this._committee_cold_credential;
  }

  set_committee_cold_credential(committee_cold_credential: Credential): void {
    this._committee_cold_credential = committee_cold_credential;
  }

  anchor(): Anchor | undefined {
    return this._anchor;
  }

  set_anchor(anchor: Anchor | undefined): void {
    this._anchor = anchor;
  }

  static deserialize(reader: CBORReader, path: string[]): CommitteeColdResign {
    let committee_cold_credential = Credential.deserialize(reader, [
      ...path,
      "committee_cold_credential",
    ]);

    let anchor =
      reader.readNullable(
        (r) => Anchor.deserialize(r, [...path, "anchor"]),
        path,
      ) ?? undefined;

    return new CommitteeColdResign(committee_cold_credential, anchor);
  }

  serialize(writer: CBORWriter): void {
    this._committee_cold_credential.serialize(writer);
    if (this._anchor == null) {
      writer.writeNull();
    } else {
      this._anchor.serialize(writer);
    }
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["CommitteeColdResign"],
  ): CommitteeColdResign {
    let reader = new CBORReader(data);
    return CommitteeColdResign.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["CommitteeColdResign"],
  ): CommitteeColdResign {
    return CommitteeColdResign.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): CommitteeColdResign {
    return CommitteeColdResign.from_bytes(this.to_bytes(), path);
  }

  static new(committee_cold_credential: Credential): CommitteeColdResign {
    return new CommitteeColdResign(committee_cold_credential, undefined);
  }
  static new_with_anchor(
    committee_cold_credential: Credential,
    anchor: Anchor,
  ) {
    return new CommitteeColdResign(committee_cold_credential, anchor);
  }
}

export class CommitteeEpochs {
  _items: [Credential, number][];

  constructor(items: [Credential, number][]) {
    this._items = items;
  }

  static new(): CommitteeEpochs {
    return new CommitteeEpochs([]);
  }

  len(): number {
    return this._items.length;
  }

  insert(key: Credential, value: number): number | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this._items.push([key, value]);
    return undefined;
  }

  get(key: Credential): number | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: Credential[]): void {
    this._items = this._items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  static deserialize(reader: CBORReader, path: string[]): CommitteeEpochs {
    let ret = new CommitteeEpochs([]);
    reader.readMap(
      (reader, idx) =>
        ret.insert(
          Credential.deserialize(reader, [...path, "Credential#" + idx]),
          Number(reader.readInt([...path, "number#" + idx])),
        ),
      path,
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this._items, (writer, x) => {
      x[0].serialize(writer);
      writer.writeInt(BigInt(x[1]));
    });
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["CommitteeEpochs"],
  ): CommitteeEpochs {
    let reader = new CBORReader(data);
    return CommitteeEpochs.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["CommitteeEpochs"],
  ): CommitteeEpochs {
    return CommitteeEpochs.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): CommitteeEpochs {
    return CommitteeEpochs.from_bytes(this.to_bytes(), path);
  }
}

export class CommitteeHotAuth {
  private _committee_cold_credential: Credential;
  private _committee_hot_credential: Credential;

  constructor(
    committee_cold_credential: Credential,
    committee_hot_credential: Credential,
  ) {
    this._committee_cold_credential = committee_cold_credential;
    this._committee_hot_credential = committee_hot_credential;
  }

  static new(
    committee_cold_credential: Credential,
    committee_hot_credential: Credential,
  ) {
    return new CommitteeHotAuth(
      committee_cold_credential,
      committee_hot_credential,
    );
  }

  committee_cold_credential(): Credential {
    return this._committee_cold_credential;
  }

  set_committee_cold_credential(committee_cold_credential: Credential): void {
    this._committee_cold_credential = committee_cold_credential;
  }

  committee_hot_credential(): Credential {
    return this._committee_hot_credential;
  }

  set_committee_hot_credential(committee_hot_credential: Credential): void {
    this._committee_hot_credential = committee_hot_credential;
  }

  static deserialize(reader: CBORReader, path: string[]): CommitteeHotAuth {
    let committee_cold_credential = Credential.deserialize(reader, [
      ...path,
      "committee_cold_credential",
    ]);

    let committee_hot_credential = Credential.deserialize(reader, [
      ...path,
      "committee_hot_credential",
    ]);

    return new CommitteeHotAuth(
      committee_cold_credential,
      committee_hot_credential,
    );
  }

  serialize(writer: CBORWriter): void {
    this._committee_cold_credential.serialize(writer);
    this._committee_hot_credential.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["CommitteeHotAuth"],
  ): CommitteeHotAuth {
    let reader = new CBORReader(data);
    return CommitteeHotAuth.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["CommitteeHotAuth"],
  ): CommitteeHotAuth {
    return CommitteeHotAuth.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): CommitteeHotAuth {
    return CommitteeHotAuth.from_bytes(this.to_bytes(), path);
  }
}

export class Constitution {
  private _anchor: Anchor;
  private _script_hash: ScriptHash | undefined;

  constructor(anchor: Anchor, script_hash: ScriptHash | undefined) {
    this._anchor = anchor;
    this._script_hash = script_hash;
  }

  anchor(): Anchor {
    return this._anchor;
  }

  set_anchor(anchor: Anchor): void {
    this._anchor = anchor;
  }

  script_hash(): ScriptHash | undefined {
    return this._script_hash;
  }

  set_script_hash(script_hash: ScriptHash | undefined): void {
    this._script_hash = script_hash;
  }

  static deserialize(reader: CBORReader, path: string[]): Constitution {
    let len = reader.readArrayTag(path);

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 2. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const anchor_path = [...path, "Anchor(anchor)"];
    let anchor = Anchor.deserialize(reader, anchor_path);

    const script_hash_path = [...path, "ScriptHash(script_hash)"];
    let script_hash =
      reader.readNullable(
        (r) => ScriptHash.deserialize(r, script_hash_path),
        path,
      ) ?? undefined;

    return new Constitution(anchor, script_hash);
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 2;

    writer.writeArrayTag(arrayLen);

    this._anchor.serialize(writer);
    if (this._script_hash == null) {
      writer.writeNull();
    } else {
      this._script_hash.serialize(writer);
    }
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["Constitution"],
  ): Constitution {
    let reader = new CBORReader(data);
    return Constitution.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["Constitution"],
  ): Constitution {
    return Constitution.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Constitution {
    return Constitution.from_bytes(this.to_bytes(), path);
  }

  static new(anchor: Anchor): Constitution {
    return new Constitution(anchor, undefined);
  }
  static new_with_script_hash(
    anchor: Anchor,
    scripthash: ScriptHash | undefined,
  ) {
    return new Constitution(anchor, scripthash);
  }
}

export class ConstrPlutusData {
  private _alternative: BigNum;
  private _data: PlutusList;

  constructor(alternative: BigNum, data: PlutusList) {
    this._alternative = alternative;
    this._data = data;
  }

  static uncheckedNew(alternative: BigNum, data: PlutusList) {
    return new ConstrPlutusData(alternative, data);
  }

  alternative(): BigNum {
    return this._alternative;
  }

  set_alternative(alternative: BigNum): void {
    this._alternative = alternative;
  }

  data(): PlutusList {
    return this._data;
  }

  set_data(data: PlutusList): void {
    this._data = data;
  }

  static deserializeWithSeparateIdx(
    reader: CBORReader,
    path: string[],
  ): ConstrPlutusData {
    let len = reader.readArrayTag(path);

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 2. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const alternative_path = [...path, "BigNum(alternative)"];
    let alternative = BigNum.deserialize(reader, alternative_path);

    const data_path = [...path, "PlutusList(data)"];
    let data = PlutusList.deserialize(reader, data_path);

    return new ConstrPlutusData(alternative, data);
  }

  serializeWithSeparateIdx(writer: CBORWriter): void {
    let arrayLen = 2;

    writer.writeArrayTag(arrayLen);

    this._alternative.serialize(writer);
    this._data.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["ConstrPlutusData"],
  ): ConstrPlutusData {
    let reader = new CBORReader(data);
    return ConstrPlutusData.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["ConstrPlutusData"],
  ): ConstrPlutusData {
    return ConstrPlutusData.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): ConstrPlutusData {
    return ConstrPlutusData.from_bytes(this.to_bytes(), path);
  }

  static deserialize(reader: CBORReader, path: string[]): ConstrPlutusData {
    const tag = reader.readTaggedTagAsBigInt(path);
    if (Number(tag) >= 121 && Number(tag) <= 127) {
      return ConstrPlutusData.new(
        BigNum.new(tag).checked_sub(BigNum.from_str("121")),
        PlutusList.deserialize(reader, [...path, "PlutusList(data)"]),
      );
    } else if (Number(tag) == 102) {
      return ConstrPlutusData.deserializeWithSeparateIdx(reader, path);
    } else {
      throw new Error(
        "Unexpected tagfor ConstrPlutusData: " +
          tag +
          "(at " +
          path.join("/") +
          ")",
      );
    }
  }

  serialize(writer: CBORWriter): void {
    const alternative = this.alternative().toJsValue();
    if (alternative > 6) {
      writer.writeTaggedTag(102);
      this.serializeWithSeparateIdx(writer);
    } else {
      writer.writeTaggedTag(Number(alternative) + 121);
      this.data().serialize(writer);
    }
  }

  static new(alternative: BigNum, data: PlutusList): ConstrPlutusData {
    return ConstrPlutusData.uncheckedNew(alternative, data);
  }
}

export class CostModel {
  private items: Int[];
  private definiteEncoding: boolean;

  constructor(items: Int[], definiteEncoding: boolean = true) {
    this.items = items;
    this.definiteEncoding = definiteEncoding;
  }

  static new(): CostModel {
    return new CostModel([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): Int {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: Int): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader, path: string[]): CostModel {
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) => Int.deserialize(reader, [...path, "Elem#" + idx]),
      path,
    );
    return new CostModel(items, definiteEncoding);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["CostModel"],
  ): CostModel {
    let reader = new CBORReader(data);
    return CostModel.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["CostModel"]): CostModel {
    return CostModel.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): CostModel {
    return CostModel.from_bytes(this.to_bytes(), path);
  }

  set(operation: number, cost: Int): Int {
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
  _items: [Language, CostModel][];

  constructor(items: [Language, CostModel][]) {
    this._items = items;
  }

  static new(): Costmdls {
    return new Costmdls([]);
  }

  len(): number {
    return this._items.length;
  }

  insert(key: Language, value: CostModel): CostModel | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this._items.push([key, value]);
    return undefined;
  }

  get(key: Language): CostModel | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: Language[]): void {
    this._items = this._items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  keys(): Languages {
    let keys = Languages.new();
    for (let [key, _] of this._items) keys.add(key);
    return keys;
  }

  static deserialize(reader: CBORReader, path: string[]): Costmdls {
    let ret = new Costmdls([]);
    reader.readMap(
      (reader, idx) =>
        ret.insert(
          Language.deserialize(reader, [...path, "Language#" + idx]),
          CostModel.deserialize(reader, [...path, "CostModel#" + idx]),
        ),
      path,
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this._items, (writer, x) => {
      x[0].serialize(writer);
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["Costmdls"]): Costmdls {
    let reader = new CBORReader(data);
    return Costmdls.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["Costmdls"]): Costmdls {
    return Costmdls.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Costmdls {
    return Costmdls.from_bytes(this.to_bytes(), path);
  }

  retain_language_versions(languages: Languages): Costmdls {
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
  private items: Credential[];
  private definiteEncoding: boolean;
  private nonEmptyTag: boolean;

  private setItems(items: Credential[]) {
    this.items = items;
  }

  constructor(definiteEncoding: boolean = true, nonEmptyTag: boolean = true) {
    this.items = [];
    this.definiteEncoding = definiteEncoding;
    this.nonEmptyTag = nonEmptyTag;
  }

  static new(): Credentials {
    return new Credentials();
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): Credential {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: Credential): boolean {
    if (this.contains(elem)) return true;
    this.items.push(elem);
    return false;
  }

  contains(elem: Credential): boolean {
    for (let item of this.items) {
      if (arrayEq(item.to_bytes(), elem.to_bytes())) {
        return true;
      }
    }
    return false;
  }

  static deserialize(reader: CBORReader, path: string[]): Credentials {
    let nonEmptyTag = false;
    if (reader.peekType(path) == "tagged") {
      let tag = reader.readTaggedTag(path);
      if (tag != 258) {
        throw new Error("Expected tag 258. Got " + tag);
      } else {
        nonEmptyTag = true;
      }
    }
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) =>
        Credential.deserialize(reader, [...path, "Credential#" + idx]),
      path,
    );
    let ret = new Credentials(definiteEncoding, nonEmptyTag);
    ret.setItems(items);
    return ret;
  }

  serialize(writer: CBORWriter): void {
    if (this.nonEmptyTag) {
      writer.writeTaggedTag(258);
    }
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["Credentials"],
  ): Credentials {
    let reader = new CBORReader(data);
    return Credentials.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["Credentials"],
  ): Credentials {
    return Credentials.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Credentials {
    return Credentials.from_bytes(this.to_bytes(), path);
  }
}

export class DNSRecordAorAAAA {
  private inner: string;

  constructor(inner: string) {
    if (inner.length > 64) throw new Error("Expected length to be atmost 64");

    this.inner = inner;
  }

  static new(inner: string): DNSRecordAorAAAA {
    return new DNSRecordAorAAAA(inner);
  }

  record(): string {
    return this.inner;
  }

  static deserialize(reader: CBORReader, path: string[]): DNSRecordAorAAAA {
    return new DNSRecordAorAAAA(reader.readString(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeString(this.inner);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["DNSRecordAorAAAA"],
  ): DNSRecordAorAAAA {
    let reader = new CBORReader(data);
    return DNSRecordAorAAAA.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["DNSRecordAorAAAA"],
  ): DNSRecordAorAAAA {
    return DNSRecordAorAAAA.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): DNSRecordAorAAAA {
    return DNSRecordAorAAAA.from_bytes(this.to_bytes(), path);
  }
}

export class DNSRecordSRV {
  private inner: string;

  constructor(inner: string) {
    if (inner.length > 64) throw new Error("Expected length to be atmost 64");

    this.inner = inner;
  }

  static new(inner: string): DNSRecordSRV {
    return new DNSRecordSRV(inner);
  }

  record(): string {
    return this.inner;
  }

  static deserialize(reader: CBORReader, path: string[]): DNSRecordSRV {
    return new DNSRecordSRV(reader.readString(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeString(this.inner);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["DNSRecordSRV"],
  ): DNSRecordSRV {
    let reader = new CBORReader(data);
    return DNSRecordSRV.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["DNSRecordSRV"],
  ): DNSRecordSRV {
    return DNSRecordSRV.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): DNSRecordSRV {
    return DNSRecordSRV.from_bytes(this.to_bytes(), path);
  }
}

export enum DRepKind {
  Ed25519KeyHash = 0,
  ScriptHash = 1,
  AlwaysAbstain = 2,
  AlwaysNoConfidence = 3,
}

export type DRepVariant =
  | { kind: 0; value: Ed25519KeyHash }
  | { kind: 1; value: ScriptHash }
  | { kind: 2 }
  | { kind: 3 };

export class DRep {
  private variant: DRepVariant;

  constructor(variant: DRepVariant) {
    this.variant = variant;
  }

  static new_key_hash(key_hash: Ed25519KeyHash): DRep {
    return new DRep({ kind: 0, value: key_hash });
  }

  static new_script_hash(script_hash: ScriptHash): DRep {
    return new DRep({ kind: 1, value: script_hash });
  }

  static new_always_abstain(): DRep {
    return new DRep({ kind: 2 });
  }

  static new_always_no_confidence(): DRep {
    return new DRep({ kind: 3 });
  }

  as_key_hash(): Ed25519KeyHash | undefined {
    if (this.variant.kind == 0) return this.variant.value;
  }

  as_script_hash(): ScriptHash | undefined {
    if (this.variant.kind == 1) return this.variant.value;
  }

  kind(): DRepKind {
    return this.variant.kind;
  }

  static deserialize(reader: CBORReader, path: string[]): DRep {
    let len = reader.readArrayTag(path);
    let tag = Number(reader.readUint(path));
    let variant: DRepVariant;

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
        throw new Error(
          "Unexpected tag for DRep: " + tag + "(at " + path.join("/") + ")",
        );
    }

    if (len == null) {
      reader.readBreak();
    }

    return new DRep(variant);
  }

  serialize(writer: CBORWriter): void {
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
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["DRep"]): DRep {
    let reader = new CBORReader(data);
    return DRep.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["DRep"]): DRep {
    return DRep.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): DRep {
    return DRep.from_bytes(this.to_bytes(), path);
  }
}

export class DRepDeregistration {
  private _drep_credential: Credential;
  private _coin: BigNum;

  constructor(drep_credential: Credential, coin: BigNum) {
    this._drep_credential = drep_credential;
    this._coin = coin;
  }

  static new(drep_credential: Credential, coin: BigNum) {
    return new DRepDeregistration(drep_credential, coin);
  }

  drep_credential(): Credential {
    return this._drep_credential;
  }

  set_drep_credential(drep_credential: Credential): void {
    this._drep_credential = drep_credential;
  }

  coin(): BigNum {
    return this._coin;
  }

  set_coin(coin: BigNum): void {
    this._coin = coin;
  }

  static deserialize(reader: CBORReader, path: string[]): DRepDeregistration {
    let drep_credential = Credential.deserialize(reader, [
      ...path,
      "drep_credential",
    ]);

    let coin = BigNum.deserialize(reader, [...path, "coin"]);

    return new DRepDeregistration(drep_credential, coin);
  }

  serialize(writer: CBORWriter): void {
    this._drep_credential.serialize(writer);
    this._coin.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["DRepDeregistration"],
  ): DRepDeregistration {
    let reader = new CBORReader(data);
    return DRepDeregistration.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["DRepDeregistration"],
  ): DRepDeregistration {
    return DRepDeregistration.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): DRepDeregistration {
    return DRepDeregistration.from_bytes(this.to_bytes(), path);
  }
}

export class DRepRegistration {
  private _voting_credential: Credential;
  private _coin: BigNum;
  private _anchor: Anchor | undefined;

  constructor(
    voting_credential: Credential,
    coin: BigNum,
    anchor: Anchor | undefined,
  ) {
    this._voting_credential = voting_credential;
    this._coin = coin;
    this._anchor = anchor;
  }

  voting_credential(): Credential {
    return this._voting_credential;
  }

  set_voting_credential(voting_credential: Credential): void {
    this._voting_credential = voting_credential;
  }

  coin(): BigNum {
    return this._coin;
  }

  set_coin(coin: BigNum): void {
    this._coin = coin;
  }

  anchor(): Anchor | undefined {
    return this._anchor;
  }

  set_anchor(anchor: Anchor | undefined): void {
    this._anchor = anchor;
  }

  static deserialize(reader: CBORReader, path: string[]): DRepRegistration {
    let voting_credential = Credential.deserialize(reader, [
      ...path,
      "voting_credential",
    ]);

    let coin = BigNum.deserialize(reader, [...path, "coin"]);

    let anchor =
      reader.readNullable(
        (r) => Anchor.deserialize(r, [...path, "anchor"]),
        path,
      ) ?? undefined;

    return new DRepRegistration(voting_credential, coin, anchor);
  }

  serialize(writer: CBORWriter): void {
    this._voting_credential.serialize(writer);
    this._coin.serialize(writer);
    if (this._anchor == null) {
      writer.writeNull();
    } else {
      this._anchor.serialize(writer);
    }
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["DRepRegistration"],
  ): DRepRegistration {
    let reader = new CBORReader(data);
    return DRepRegistration.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["DRepRegistration"],
  ): DRepRegistration {
    return DRepRegistration.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): DRepRegistration {
    return DRepRegistration.from_bytes(this.to_bytes(), path);
  }

  static new(voting_credential: Credential, coin: BigNum): DRepRegistration {
    return new DRepRegistration(voting_credential, coin, undefined);
  }
  static new_with_anchor(
    voting_credential: Credential,
    coin: BigNum,
    anchor: Anchor,
  ) {
    return new DRepRegistration(voting_credential, coin, anchor);
  }
}

export class DRepUpdate {
  private _drep_credential: Credential;
  private _anchor: Anchor | undefined;

  constructor(drep_credential: Credential, anchor: Anchor | undefined) {
    this._drep_credential = drep_credential;
    this._anchor = anchor;
  }

  drep_credential(): Credential {
    return this._drep_credential;
  }

  set_drep_credential(drep_credential: Credential): void {
    this._drep_credential = drep_credential;
  }

  anchor(): Anchor | undefined {
    return this._anchor;
  }

  set_anchor(anchor: Anchor | undefined): void {
    this._anchor = anchor;
  }

  static deserialize(reader: CBORReader, path: string[]): DRepUpdate {
    let drep_credential = Credential.deserialize(reader, [
      ...path,
      "drep_credential",
    ]);

    let anchor =
      reader.readNullable(
        (r) => Anchor.deserialize(r, [...path, "anchor"]),
        path,
      ) ?? undefined;

    return new DRepUpdate(drep_credential, anchor);
  }

  serialize(writer: CBORWriter): void {
    this._drep_credential.serialize(writer);
    if (this._anchor == null) {
      writer.writeNull();
    } else {
      this._anchor.serialize(writer);
    }
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["DRepUpdate"],
  ): DRepUpdate {
    let reader = new CBORReader(data);
    return DRepUpdate.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["DRepUpdate"],
  ): DRepUpdate {
    return DRepUpdate.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): DRepUpdate {
    return DRepUpdate.from_bytes(this.to_bytes(), path);
  }

  static new(drep_credential: Credential): DRepUpdate {
    return new DRepUpdate(drep_credential, undefined);
  }
  static new_with_anchor(drep_credential: Credential, anchor: Anchor) {
    return new DRepUpdate(drep_credential, anchor);
  }
}

export class DRepVotingThresholds {
  private _motion_no_confidence: UnitInterval;
  private _committee_normal: UnitInterval;
  private _committee_no_confidence: UnitInterval;
  private _update_constitution: UnitInterval;
  private _hard_fork_initiation: UnitInterval;
  private _pp_network_group: UnitInterval;
  private _pp_economic_group: UnitInterval;
  private _pp_technical_group: UnitInterval;
  private _pp_governance_group: UnitInterval;
  private _treasury_withdrawal: UnitInterval;

  constructor(
    motion_no_confidence: UnitInterval,
    committee_normal: UnitInterval,
    committee_no_confidence: UnitInterval,
    update_constitution: UnitInterval,
    hard_fork_initiation: UnitInterval,
    pp_network_group: UnitInterval,
    pp_economic_group: UnitInterval,
    pp_technical_group: UnitInterval,
    pp_governance_group: UnitInterval,
    treasury_withdrawal: UnitInterval,
  ) {
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

  static new(
    motion_no_confidence: UnitInterval,
    committee_normal: UnitInterval,
    committee_no_confidence: UnitInterval,
    update_constitution: UnitInterval,
    hard_fork_initiation: UnitInterval,
    pp_network_group: UnitInterval,
    pp_economic_group: UnitInterval,
    pp_technical_group: UnitInterval,
    pp_governance_group: UnitInterval,
    treasury_withdrawal: UnitInterval,
  ) {
    return new DRepVotingThresholds(
      motion_no_confidence,
      committee_normal,
      committee_no_confidence,
      update_constitution,
      hard_fork_initiation,
      pp_network_group,
      pp_economic_group,
      pp_technical_group,
      pp_governance_group,
      treasury_withdrawal,
    );
  }

  motion_no_confidence(): UnitInterval {
    return this._motion_no_confidence;
  }

  set_motion_no_confidence(motion_no_confidence: UnitInterval): void {
    this._motion_no_confidence = motion_no_confidence;
  }

  committee_normal(): UnitInterval {
    return this._committee_normal;
  }

  set_committee_normal(committee_normal: UnitInterval): void {
    this._committee_normal = committee_normal;
  }

  committee_no_confidence(): UnitInterval {
    return this._committee_no_confidence;
  }

  set_committee_no_confidence(committee_no_confidence: UnitInterval): void {
    this._committee_no_confidence = committee_no_confidence;
  }

  update_constitution(): UnitInterval {
    return this._update_constitution;
  }

  set_update_constitution(update_constitution: UnitInterval): void {
    this._update_constitution = update_constitution;
  }

  hard_fork_initiation(): UnitInterval {
    return this._hard_fork_initiation;
  }

  set_hard_fork_initiation(hard_fork_initiation: UnitInterval): void {
    this._hard_fork_initiation = hard_fork_initiation;
  }

  pp_network_group(): UnitInterval {
    return this._pp_network_group;
  }

  set_pp_network_group(pp_network_group: UnitInterval): void {
    this._pp_network_group = pp_network_group;
  }

  pp_economic_group(): UnitInterval {
    return this._pp_economic_group;
  }

  set_pp_economic_group(pp_economic_group: UnitInterval): void {
    this._pp_economic_group = pp_economic_group;
  }

  pp_technical_group(): UnitInterval {
    return this._pp_technical_group;
  }

  set_pp_technical_group(pp_technical_group: UnitInterval): void {
    this._pp_technical_group = pp_technical_group;
  }

  pp_governance_group(): UnitInterval {
    return this._pp_governance_group;
  }

  set_pp_governance_group(pp_governance_group: UnitInterval): void {
    this._pp_governance_group = pp_governance_group;
  }

  treasury_withdrawal(): UnitInterval {
    return this._treasury_withdrawal;
  }

  set_treasury_withdrawal(treasury_withdrawal: UnitInterval): void {
    this._treasury_withdrawal = treasury_withdrawal;
  }

  static deserialize(reader: CBORReader, path: string[]): DRepVotingThresholds {
    let len = reader.readArrayTag(path);

    if (len != null && len < 10) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 10. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const motion_no_confidence_path = [
      ...path,
      "UnitInterval(motion_no_confidence)",
    ];
    let motion_no_confidence = UnitInterval.deserialize(
      reader,
      motion_no_confidence_path,
    );

    const committee_normal_path = [...path, "UnitInterval(committee_normal)"];
    let committee_normal = UnitInterval.deserialize(
      reader,
      committee_normal_path,
    );

    const committee_no_confidence_path = [
      ...path,
      "UnitInterval(committee_no_confidence)",
    ];
    let committee_no_confidence = UnitInterval.deserialize(
      reader,
      committee_no_confidence_path,
    );

    const update_constitution_path = [
      ...path,
      "UnitInterval(update_constitution)",
    ];
    let update_constitution = UnitInterval.deserialize(
      reader,
      update_constitution_path,
    );

    const hard_fork_initiation_path = [
      ...path,
      "UnitInterval(hard_fork_initiation)",
    ];
    let hard_fork_initiation = UnitInterval.deserialize(
      reader,
      hard_fork_initiation_path,
    );

    const pp_network_group_path = [...path, "UnitInterval(pp_network_group)"];
    let pp_network_group = UnitInterval.deserialize(
      reader,
      pp_network_group_path,
    );

    const pp_economic_group_path = [...path, "UnitInterval(pp_economic_group)"];
    let pp_economic_group = UnitInterval.deserialize(
      reader,
      pp_economic_group_path,
    );

    const pp_technical_group_path = [
      ...path,
      "UnitInterval(pp_technical_group)",
    ];
    let pp_technical_group = UnitInterval.deserialize(
      reader,
      pp_technical_group_path,
    );

    const pp_governance_group_path = [
      ...path,
      "UnitInterval(pp_governance_group)",
    ];
    let pp_governance_group = UnitInterval.deserialize(
      reader,
      pp_governance_group_path,
    );

    const treasury_withdrawal_path = [
      ...path,
      "UnitInterval(treasury_withdrawal)",
    ];
    let treasury_withdrawal = UnitInterval.deserialize(
      reader,
      treasury_withdrawal_path,
    );

    return new DRepVotingThresholds(
      motion_no_confidence,
      committee_normal,
      committee_no_confidence,
      update_constitution,
      hard_fork_initiation,
      pp_network_group,
      pp_economic_group,
      pp_technical_group,
      pp_governance_group,
      treasury_withdrawal,
    );
  }

  serialize(writer: CBORWriter): void {
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
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["DRepVotingThresholds"],
  ): DRepVotingThresholds {
    let reader = new CBORReader(data);
    return DRepVotingThresholds.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["DRepVotingThresholds"],
  ): DRepVotingThresholds {
    return DRepVotingThresholds.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): DRepVotingThresholds {
    return DRepVotingThresholds.from_bytes(this.to_bytes(), path);
  }
}

export class Data {
  private inner: Uint8Array;

  constructor(inner: Uint8Array) {
    this.inner = inner;
  }

  static new(inner: Uint8Array): Data {
    return new Data(inner);
  }

  encoded_plutus_data(): Uint8Array {
    return this.inner;
  }

  static deserialize(reader: CBORReader, path: string[] = ["Data"]): Data {
    let taggedTag = reader.readTaggedTag(path);
    if (taggedTag != 24) {
      throw new Error(
        "Expected tag 24, got " + taggedTag + " (at " + path + ")",
      );
    }

    return Data.deserializeInner(reader, path);
  }

  static deserializeInner(reader: CBORReader, path: string[]): Data {
    return new Data(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeTaggedTag(24);

    this.serializeInner(writer);
  }

  serializeInner(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["Data"]): Data {
    let reader = new CBORReader(data);
    return Data.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["Data"]): Data {
    return Data.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Data {
    return Data.from_bytes(this.to_bytes(), path);
  }
}

export class DataCost {
  private _coins_per_byte: BigNum;

  constructor(coins_per_byte: BigNum) {
    this._coins_per_byte = coins_per_byte;
  }

  static new(coins_per_byte: BigNum) {
    return new DataCost(coins_per_byte);
  }

  coins_per_byte(): BigNum {
    return this._coins_per_byte;
  }

  set_coins_per_byte(coins_per_byte: BigNum): void {
    this._coins_per_byte = coins_per_byte;
  }

  static deserialize(reader: CBORReader, path: string[]): DataCost {
    let len = reader.readArrayTag(path);

    if (len != null && len < 1) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 1. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const coins_per_byte_path = [...path, "BigNum(coins_per_byte)"];
    let coins_per_byte = BigNum.deserialize(reader, coins_per_byte_path);

    return new DataCost(coins_per_byte);
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 1;

    writer.writeArrayTag(arrayLen);

    this._coins_per_byte.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["DataCost"]): DataCost {
    let reader = new CBORReader(data);
    return DataCost.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["DataCost"]): DataCost {
    return DataCost.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): DataCost {
    return DataCost.from_bytes(this.to_bytes(), path);
  }
}

export class DataHash {
  private inner: Uint8Array;

  constructor(inner: Uint8Array) {
    if (inner.length != 32) throw new Error("Expected length to be 32");
    this.inner = inner;
  }

  static new(inner: Uint8Array): DataHash {
    return new DataHash(inner);
  }

  static from_bech32(bech_str: string): DataHash {
    let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new DataHash(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): DataHash {
    return new DataHash(data);
  }

  static from_hex(hex_str: string): DataHash {
    return DataHash.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    return this.inner;
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): DataHash {
    return DataHash.from_bytes(this.to_bytes());
  }

  static deserialize(reader: CBORReader, path: string[]): DataHash {
    return new DataHash(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }
}

export enum DataOptionKind {
  DataHash = 0,
  Data = 1,
}

export type DataOptionVariant =
  | { kind: 0; value: DataHash }
  | { kind: 1; value: Data };

export class DataOption {
  private variant: DataOptionVariant;

  constructor(variant: DataOptionVariant) {
    this.variant = variant;
  }

  static new_hash(hash: DataHash): DataOption {
    return new DataOption({ kind: 0, value: hash });
  }

  static new_data(data: Data): DataOption {
    return new DataOption({ kind: 1, value: data });
  }

  as_hash(): DataHash | undefined {
    if (this.variant.kind == 0) return this.variant.value;
  }

  as_data(): Data | undefined {
    if (this.variant.kind == 1) return this.variant.value;
  }

  kind(): DataOptionKind {
    return this.variant.kind;
  }

  static deserialize(reader: CBORReader, path: string[]): DataOption {
    let len = reader.readArrayTag(path);
    let tag = Number(reader.readUint(path));
    let variant: DataOptionVariant;

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
        throw new Error(
          "Unexpected tag for DataOption: " +
            tag +
            "(at " +
            path.join("/") +
            ")",
        );
    }

    if (len == null) {
      reader.readBreak();
    }

    return new DataOption(variant);
  }

  serialize(writer: CBORWriter): void {
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
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["DataOption"],
  ): DataOption {
    let reader = new CBORReader(data);
    return DataOption.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["DataOption"],
  ): DataOption {
    return DataOption.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): DataOption {
    return DataOption.from_bytes(this.to_bytes(), path);
  }
}

export enum DatumSourceKind {
  PlutusData = 0,
  TransactionInput = 1,
}

export type DatumSourceVariant =
  | { kind: 0; value: PlutusData }
  | { kind: 1; value: TransactionInput };

export class DatumSource {
  private variant: DatumSourceVariant;

  constructor(variant: DatumSourceVariant) {
    this.variant = variant;
  }

  static new_datum(datum: PlutusData): DatumSource {
    return new DatumSource({ kind: 0, value: datum });
  }

  static new_ref_input(ref_input: TransactionInput): DatumSource {
    return new DatumSource({ kind: 1, value: ref_input });
  }

  as_datum(): PlutusData | undefined {
    if (this.variant.kind == 0) return this.variant.value;
  }

  as_ref_input(): TransactionInput | undefined {
    if (this.variant.kind == 1) return this.variant.value;
  }

  kind(): DatumSourceKind {
    return this.variant.kind;
  }

  static deserialize(reader: CBORReader, path: string[]): DatumSource {
    let len = reader.readArrayTag(path);
    let tag = Number(reader.readUint(path));
    let variant: DatumSourceVariant;

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
        throw new Error(
          "Unexpected tag for DatumSource: " +
            tag +
            "(at " +
            path.join("/") +
            ")",
        );
    }

    if (len == null) {
      reader.readBreak();
    }

    return new DatumSource(variant);
  }

  serialize(writer: CBORWriter): void {
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
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["DatumSource"],
  ): DatumSource {
    let reader = new CBORReader(data);
    return DatumSource.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["DatumSource"],
  ): DatumSource {
    return DatumSource.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): DatumSource {
    return DatumSource.from_bytes(this.to_bytes(), path);
  }

  static new(datum: PlutusData): DatumSource {
    return DatumSource.new_datum(datum);
  }
}

export class Ed25519KeyHash {
  private inner: Uint8Array;

  constructor(inner: Uint8Array) {
    if (inner.length != 28) throw new Error("Expected length to be 28");
    this.inner = inner;
  }

  static new(inner: Uint8Array): Ed25519KeyHash {
    return new Ed25519KeyHash(inner);
  }

  static from_bech32(bech_str: string): Ed25519KeyHash {
    let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new Ed25519KeyHash(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Ed25519KeyHash {
    return new Ed25519KeyHash(data);
  }

  static from_hex(hex_str: string): Ed25519KeyHash {
    return Ed25519KeyHash.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    return this.inner;
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Ed25519KeyHash {
    return Ed25519KeyHash.from_bytes(this.to_bytes());
  }

  static deserialize(reader: CBORReader, path: string[]): Ed25519KeyHash {
    return new Ed25519KeyHash(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }
}

export class Ed25519KeyHashes {
  private items: Ed25519KeyHash[];
  private definiteEncoding: boolean;
  private nonEmptyTag: boolean;

  private setItems(items: Ed25519KeyHash[]) {
    this.items = items;
  }

  constructor(definiteEncoding: boolean = true, nonEmptyTag: boolean = true) {
    this.items = [];
    this.definiteEncoding = definiteEncoding;
    this.nonEmptyTag = nonEmptyTag;
  }

  static new(): Ed25519KeyHashes {
    return new Ed25519KeyHashes();
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): Ed25519KeyHash {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: Ed25519KeyHash): boolean {
    if (this.contains(elem)) return true;
    this.items.push(elem);
    return false;
  }

  contains(elem: Ed25519KeyHash): boolean {
    for (let item of this.items) {
      if (arrayEq(item.to_bytes(), elem.to_bytes())) {
        return true;
      }
    }
    return false;
  }

  static deserialize(reader: CBORReader, path: string[]): Ed25519KeyHashes {
    let nonEmptyTag = false;
    if (reader.peekType(path) == "tagged") {
      let tag = reader.readTaggedTag(path);
      if (tag != 258) {
        throw new Error("Expected tag 258. Got " + tag);
      } else {
        nonEmptyTag = true;
      }
    }
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) =>
        Ed25519KeyHash.deserialize(reader, [...path, "Ed25519KeyHash#" + idx]),
      path,
    );
    let ret = new Ed25519KeyHashes(definiteEncoding, nonEmptyTag);
    ret.setItems(items);
    return ret;
  }

  serialize(writer: CBORWriter): void {
    if (this.nonEmptyTag) {
      writer.writeTaggedTag(258);
    }
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["Ed25519KeyHashes"],
  ): Ed25519KeyHashes {
    let reader = new CBORReader(data);
    return Ed25519KeyHashes.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["Ed25519KeyHashes"],
  ): Ed25519KeyHashes {
    return Ed25519KeyHashes.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Ed25519KeyHashes {
    return Ed25519KeyHashes.from_bytes(this.to_bytes(), path);
  }
}

export class Ed25519Signature {
  private inner: Uint8Array;

  constructor(inner: Uint8Array) {
    if (inner.length != 64) throw new Error("Expected length to be 64");
    this.inner = inner;
  }

  static new(inner: Uint8Array): Ed25519Signature {
    return new Ed25519Signature(inner);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Ed25519Signature {
    return new Ed25519Signature(data);
  }

  static from_hex(hex_str: string): Ed25519Signature {
    return Ed25519Signature.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    return this.inner;
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Ed25519Signature {
    return Ed25519Signature.from_bytes(this.to_bytes());
  }

  static deserialize(reader: CBORReader, path: string[]): Ed25519Signature {
    return new Ed25519Signature(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }

  static _BECH32_HRP = "ed25519_sig";
  static from_bech32(bech_str: string): Ed25519Signature {
    let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    if (decoded.prefix == Ed25519Signature._BECH32_HRP) {
      return new Ed25519Signature(bytes);
    } else {
      throw new Error("Invalid prefix for Ed25519Signature: " + decoded.prefix);
    }
  }

  to_bech32() {
    let prefix = Ed25519Signature._BECH32_HRP;
    return bech32.encode(
      prefix,
      bech32.toWords(this.inner),
      Number.MAX_SAFE_INTEGER,
    );
  }
}

export class ExUnitPrices {
  private _mem_price: UnitInterval;
  private _step_price: UnitInterval;

  constructor(mem_price: UnitInterval, step_price: UnitInterval) {
    this._mem_price = mem_price;
    this._step_price = step_price;
  }

  static new(mem_price: UnitInterval, step_price: UnitInterval) {
    return new ExUnitPrices(mem_price, step_price);
  }

  mem_price(): UnitInterval {
    return this._mem_price;
  }

  set_mem_price(mem_price: UnitInterval): void {
    this._mem_price = mem_price;
  }

  step_price(): UnitInterval {
    return this._step_price;
  }

  set_step_price(step_price: UnitInterval): void {
    this._step_price = step_price;
  }

  static deserialize(reader: CBORReader, path: string[]): ExUnitPrices {
    let len = reader.readArrayTag(path);

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 2. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const mem_price_path = [...path, "UnitInterval(mem_price)"];
    let mem_price = UnitInterval.deserialize(reader, mem_price_path);

    const step_price_path = [...path, "UnitInterval(step_price)"];
    let step_price = UnitInterval.deserialize(reader, step_price_path);

    return new ExUnitPrices(mem_price, step_price);
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 2;

    writer.writeArrayTag(arrayLen);

    this._mem_price.serialize(writer);
    this._step_price.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["ExUnitPrices"],
  ): ExUnitPrices {
    let reader = new CBORReader(data);
    return ExUnitPrices.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["ExUnitPrices"],
  ): ExUnitPrices {
    return ExUnitPrices.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): ExUnitPrices {
    return ExUnitPrices.from_bytes(this.to_bytes(), path);
  }
}

export class ExUnits {
  private _mem: BigNum;
  private _steps: BigNum;

  constructor(mem: BigNum, steps: BigNum) {
    this._mem = mem;
    this._steps = steps;
  }

  static new(mem: BigNum, steps: BigNum) {
    return new ExUnits(mem, steps);
  }

  mem(): BigNum {
    return this._mem;
  }

  set_mem(mem: BigNum): void {
    this._mem = mem;
  }

  steps(): BigNum {
    return this._steps;
  }

  set_steps(steps: BigNum): void {
    this._steps = steps;
  }

  static deserialize(reader: CBORReader, path: string[]): ExUnits {
    let len = reader.readArrayTag(path);

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 2. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const mem_path = [...path, "BigNum(mem)"];
    let mem = BigNum.deserialize(reader, mem_path);

    const steps_path = [...path, "BigNum(steps)"];
    let steps = BigNum.deserialize(reader, steps_path);

    return new ExUnits(mem, steps);
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 2;

    writer.writeArrayTag(arrayLen);

    this._mem.serialize(writer);
    this._steps.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["ExUnits"]): ExUnits {
    let reader = new CBORReader(data);
    return ExUnits.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["ExUnits"]): ExUnits {
    return ExUnits.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): ExUnits {
    return ExUnits.from_bytes(this.to_bytes(), path);
  }
}

export class GeneralTransactionMetadata {
  _items: [BigNum, TransactionMetadatum][];

  constructor(items: [BigNum, TransactionMetadatum][]) {
    this._items = items;
  }

  static new(): GeneralTransactionMetadata {
    return new GeneralTransactionMetadata([]);
  }

  len(): number {
    return this._items.length;
  }

  insert(
    key: BigNum,
    value: TransactionMetadatum,
  ): TransactionMetadatum | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this._items.push([key, value]);
    return undefined;
  }

  get(key: BigNum): TransactionMetadatum | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: BigNum[]): void {
    this._items = this._items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  keys(): TransactionMetadatumLabels {
    let keys = TransactionMetadatumLabels.new();
    for (let [key, _] of this._items) keys.add(key);
    return keys;
  }

  static deserialize(
    reader: CBORReader,
    path: string[],
  ): GeneralTransactionMetadata {
    let ret = new GeneralTransactionMetadata([]);
    reader.readMap(
      (reader, idx) =>
        ret.insert(
          BigNum.deserialize(reader, [...path, "BigNum#" + idx]),
          TransactionMetadatum.deserialize(reader, [
            ...path,
            "TransactionMetadatum#" + idx,
          ]),
        ),
      path,
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this._items, (writer, x) => {
      x[0].serialize(writer);
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["GeneralTransactionMetadata"],
  ): GeneralTransactionMetadata {
    let reader = new CBORReader(data);
    return GeneralTransactionMetadata.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["GeneralTransactionMetadata"],
  ): GeneralTransactionMetadata {
    return GeneralTransactionMetadata.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): GeneralTransactionMetadata {
    return GeneralTransactionMetadata.from_bytes(this.to_bytes(), path);
  }
}

export class GenesisDelegateHash {
  private inner: Uint8Array;

  constructor(inner: Uint8Array) {
    if (inner.length != 28) throw new Error("Expected length to be 28");
    this.inner = inner;
  }

  static new(inner: Uint8Array): GenesisDelegateHash {
    return new GenesisDelegateHash(inner);
  }

  static from_bech32(bech_str: string): GenesisDelegateHash {
    let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new GenesisDelegateHash(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): GenesisDelegateHash {
    return new GenesisDelegateHash(data);
  }

  static from_hex(hex_str: string): GenesisDelegateHash {
    return GenesisDelegateHash.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    return this.inner;
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): GenesisDelegateHash {
    return GenesisDelegateHash.from_bytes(this.to_bytes());
  }

  static deserialize(reader: CBORReader, path: string[]): GenesisDelegateHash {
    return new GenesisDelegateHash(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }
}

export class GenesisHash {
  private inner: Uint8Array;

  constructor(inner: Uint8Array) {
    if (inner.length != 28) throw new Error("Expected length to be 28");
    this.inner = inner;
  }

  static new(inner: Uint8Array): GenesisHash {
    return new GenesisHash(inner);
  }

  static from_bech32(bech_str: string): GenesisHash {
    let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new GenesisHash(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): GenesisHash {
    return new GenesisHash(data);
  }

  static from_hex(hex_str: string): GenesisHash {
    return GenesisHash.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    return this.inner;
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): GenesisHash {
    return GenesisHash.from_bytes(this.to_bytes());
  }

  static deserialize(reader: CBORReader, path: string[]): GenesisHash {
    return new GenesisHash(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }
}

export class GenesisHashes {
  private items: GenesisHash[];
  private definiteEncoding: boolean;

  constructor(items: GenesisHash[], definiteEncoding: boolean = true) {
    this.items = items;
    this.definiteEncoding = definiteEncoding;
  }

  static new(): GenesisHashes {
    return new GenesisHashes([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): GenesisHash {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: GenesisHash): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader, path: string[]): GenesisHashes {
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) =>
        GenesisHash.deserialize(reader, [...path, "Elem#" + idx]),
      path,
    );
    return new GenesisHashes(items, definiteEncoding);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["GenesisHashes"],
  ): GenesisHashes {
    let reader = new CBORReader(data);
    return GenesisHashes.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["GenesisHashes"],
  ): GenesisHashes {
    return GenesisHashes.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): GenesisHashes {
    return GenesisHashes.from_bytes(this.to_bytes(), path);
  }
}

export enum GovernanceActionKind {
  ParameterChangeAction = 0,
  HardForkInitiationAction = 1,
  TreasuryWithdrawalsAction = 2,
  NoConfidenceAction = 3,
  UpdateCommitteeAction = 4,
  NewConstitutionAction = 5,
  InfoAction = 6,
}

export type GovernanceActionVariant =
  | { kind: 0; value: ParameterChangeAction }
  | { kind: 1; value: HardForkInitiationAction }
  | { kind: 2; value: TreasuryWithdrawalsAction }
  | { kind: 3; value: NoConfidenceAction }
  | { kind: 4; value: UpdateCommitteeAction }
  | { kind: 5; value: NewConstitutionAction }
  | { kind: 6; value: InfoAction };

export class GovernanceAction {
  private variant: GovernanceActionVariant;

  constructor(variant: GovernanceActionVariant) {
    this.variant = variant;
  }

  static new_parameter_change_action(
    parameter_change_action: ParameterChangeAction,
  ): GovernanceAction {
    return new GovernanceAction({ kind: 0, value: parameter_change_action });
  }

  static new_hard_fork_initiation_action(
    hard_fork_initiation_action: HardForkInitiationAction,
  ): GovernanceAction {
    return new GovernanceAction({
      kind: 1,
      value: hard_fork_initiation_action,
    });
  }

  static new_treasury_withdrawals_action(
    treasury_withdrawals_action: TreasuryWithdrawalsAction,
  ): GovernanceAction {
    return new GovernanceAction({
      kind: 2,
      value: treasury_withdrawals_action,
    });
  }

  static new_no_confidence_action(
    no_confidence_action: NoConfidenceAction,
  ): GovernanceAction {
    return new GovernanceAction({ kind: 3, value: no_confidence_action });
  }

  static new_new_committee_action(
    new_committee_action: UpdateCommitteeAction,
  ): GovernanceAction {
    return new GovernanceAction({ kind: 4, value: new_committee_action });
  }

  static new_new_constitution_action(
    new_constitution_action: NewConstitutionAction,
  ): GovernanceAction {
    return new GovernanceAction({ kind: 5, value: new_constitution_action });
  }

  static new_info_action(info_action: InfoAction): GovernanceAction {
    return new GovernanceAction({ kind: 6, value: info_action });
  }

  as_parameter_change_action(): ParameterChangeAction | undefined {
    if (this.variant.kind == 0) return this.variant.value;
  }

  as_hard_fork_initiation_action(): HardForkInitiationAction | undefined {
    if (this.variant.kind == 1) return this.variant.value;
  }

  as_treasury_withdrawals_action(): TreasuryWithdrawalsAction | undefined {
    if (this.variant.kind == 2) return this.variant.value;
  }

  as_no_confidence_action(): NoConfidenceAction | undefined {
    if (this.variant.kind == 3) return this.variant.value;
  }

  as_new_committee_action(): UpdateCommitteeAction | undefined {
    if (this.variant.kind == 4) return this.variant.value;
  }

  as_new_constitution_action(): NewConstitutionAction | undefined {
    if (this.variant.kind == 5) return this.variant.value;
  }

  as_info_action(): InfoAction | undefined {
    if (this.variant.kind == 6) return this.variant.value;
  }

  kind(): GovernanceActionKind {
    return this.variant.kind;
  }

  static deserialize(reader: CBORReader, path: string[]): GovernanceAction {
    let len = reader.readArrayTag(path);
    let tag = Number(reader.readUint(path));
    let variant: GovernanceActionVariant;

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
          throw new Error(
            "Expected 2 items to decode HardForkInitiationAction",
          );
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
          throw new Error(
            "Expected 2 items to decode TreasuryWithdrawalsAction",
          );
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
        throw new Error(
          "Unexpected tag for GovernanceAction: " +
            tag +
            "(at " +
            path.join("/") +
            ")",
        );
    }

    if (len == null) {
      reader.readBreak();
    }

    return new GovernanceAction(variant);
  }

  serialize(writer: CBORWriter): void {
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
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["GovernanceAction"],
  ): GovernanceAction {
    let reader = new CBORReader(data);
    return GovernanceAction.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["GovernanceAction"],
  ): GovernanceAction {
    return GovernanceAction.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): GovernanceAction {
    return GovernanceAction.from_bytes(this.to_bytes(), path);
  }
}

export class GovernanceActionId {
  private _transaction_id: TransactionHash;
  private _index: number;

  constructor(transaction_id: TransactionHash, index: number) {
    this._transaction_id = transaction_id;
    this._index = index;
  }

  static new(transaction_id: TransactionHash, index: number) {
    return new GovernanceActionId(transaction_id, index);
  }

  transaction_id(): TransactionHash {
    return this._transaction_id;
  }

  set_transaction_id(transaction_id: TransactionHash): void {
    this._transaction_id = transaction_id;
  }

  index(): number {
    return this._index;
  }

  set_index(index: number): void {
    this._index = index;
  }

  static deserialize(reader: CBORReader, path: string[]): GovernanceActionId {
    let len = reader.readArrayTag(path);

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 2. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const transaction_id_path = [...path, "TransactionHash(transaction_id)"];
    let transaction_id = TransactionHash.deserialize(
      reader,
      transaction_id_path,
    );

    const index_path = [...path, "number(index)"];
    let index = Number(reader.readInt(index_path));

    return new GovernanceActionId(transaction_id, index);
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 2;

    writer.writeArrayTag(arrayLen);

    this._transaction_id.serialize(writer);
    writer.writeInt(BigInt(this._index));
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["GovernanceActionId"],
  ): GovernanceActionId {
    let reader = new CBORReader(data);
    return GovernanceActionId.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["GovernanceActionId"],
  ): GovernanceActionId {
    return GovernanceActionId.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): GovernanceActionId {
    return GovernanceActionId.from_bytes(this.to_bytes(), path);
  }
}

export class GovernanceActionIds {
  private items: GovernanceActionId[];
  private definiteEncoding: boolean;

  constructor(items: GovernanceActionId[], definiteEncoding: boolean = true) {
    this.items = items;
    this.definiteEncoding = definiteEncoding;
  }

  static new(): GovernanceActionIds {
    return new GovernanceActionIds([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): GovernanceActionId {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: GovernanceActionId): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader, path: string[]): GovernanceActionIds {
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) =>
        GovernanceActionId.deserialize(reader, [...path, "Elem#" + idx]),
      path,
    );
    return new GovernanceActionIds(items, definiteEncoding);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["GovernanceActionIds"],
  ): GovernanceActionIds {
    let reader = new CBORReader(data);
    return GovernanceActionIds.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["GovernanceActionIds"],
  ): GovernanceActionIds {
    return GovernanceActionIds.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): GovernanceActionIds {
    return GovernanceActionIds.from_bytes(this.to_bytes(), path);
  }
}

export class GovernanceActions {
  _items: [GovernanceActionId, VotingProcedure][];

  constructor(items: [GovernanceActionId, VotingProcedure][]) {
    this._items = items;
  }

  static new(): GovernanceActions {
    return new GovernanceActions([]);
  }

  len(): number {
    return this._items.length;
  }

  insert(
    key: GovernanceActionId,
    value: VotingProcedure,
  ): VotingProcedure | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this._items.push([key, value]);
    return undefined;
  }

  get(key: GovernanceActionId): VotingProcedure | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: GovernanceActionId[]): void {
    this._items = this._items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  keys(): GovernanceActionIds {
    let keys = GovernanceActionIds.new();
    for (let [key, _] of this._items) keys.add(key);
    return keys;
  }

  static deserialize(reader: CBORReader, path: string[]): GovernanceActions {
    let ret = new GovernanceActions([]);
    reader.readMap(
      (reader, idx) =>
        ret.insert(
          GovernanceActionId.deserialize(reader, [
            ...path,
            "GovernanceActionId#" + idx,
          ]),
          VotingProcedure.deserialize(reader, [
            ...path,
            "VotingProcedure#" + idx,
          ]),
        ),
      path,
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this._items, (writer, x) => {
      x[0].serialize(writer);
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["GovernanceActions"],
  ): GovernanceActions {
    let reader = new CBORReader(data);
    return GovernanceActions.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["GovernanceActions"],
  ): GovernanceActions {
    return GovernanceActions.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): GovernanceActions {
    return GovernanceActions.from_bytes(this.to_bytes(), path);
  }
}

export class HardForkInitiationAction {
  private _gov_action_id: GovernanceActionId | undefined;
  private _protocol_version: ProtocolVersion;

  constructor(
    gov_action_id: GovernanceActionId | undefined,
    protocol_version: ProtocolVersion,
  ) {
    this._gov_action_id = gov_action_id;
    this._protocol_version = protocol_version;
  }

  static new_with_action_id(
    gov_action_id: GovernanceActionId | undefined,
    protocol_version: ProtocolVersion,
  ) {
    return new HardForkInitiationAction(gov_action_id, protocol_version);
  }

  gov_action_id(): GovernanceActionId | undefined {
    return this._gov_action_id;
  }

  set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void {
    this._gov_action_id = gov_action_id;
  }

  protocol_version(): ProtocolVersion {
    return this._protocol_version;
  }

  set_protocol_version(protocol_version: ProtocolVersion): void {
    this._protocol_version = protocol_version;
  }

  static deserialize(
    reader: CBORReader,
    path: string[],
  ): HardForkInitiationAction {
    let gov_action_id =
      reader.readNullable(
        (r) => GovernanceActionId.deserialize(r, [...path, "gov_action_id"]),
        path,
      ) ?? undefined;

    let protocol_version = ProtocolVersion.deserialize(reader, [
      ...path,
      "protocol_version",
    ]);

    return new HardForkInitiationAction(gov_action_id, protocol_version);
  }

  serialize(writer: CBORWriter): void {
    if (this._gov_action_id == null) {
      writer.writeNull();
    } else {
      this._gov_action_id.serialize(writer);
    }
    this._protocol_version.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["HardForkInitiationAction"],
  ): HardForkInitiationAction {
    let reader = new CBORReader(data);
    return HardForkInitiationAction.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["HardForkInitiationAction"],
  ): HardForkInitiationAction {
    return HardForkInitiationAction.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): HardForkInitiationAction {
    return HardForkInitiationAction.from_bytes(this.to_bytes(), path);
  }

  static new(protocol_version: ProtocolVersion): HardForkInitiationAction {
    return new HardForkInitiationAction(undefined, protocol_version);
  }
}

export class Header {
  private _header_body: HeaderBody;
  private _body_signature: KESSignature;

  constructor(header_body: HeaderBody, body_signature: KESSignature) {
    this._header_body = header_body;
    this._body_signature = body_signature;
  }

  static new(header_body: HeaderBody, body_signature: KESSignature) {
    return new Header(header_body, body_signature);
  }

  header_body(): HeaderBody {
    return this._header_body;
  }

  set_header_body(header_body: HeaderBody): void {
    this._header_body = header_body;
  }

  body_signature(): KESSignature {
    return this._body_signature;
  }

  set_body_signature(body_signature: KESSignature): void {
    this._body_signature = body_signature;
  }

  static deserialize(reader: CBORReader, path: string[]): Header {
    let len = reader.readArrayTag(path);

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 2. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const header_body_path = [...path, "HeaderBody(header_body)"];
    let header_body = HeaderBody.deserialize(reader, header_body_path);

    const body_signature_path = [...path, "KESSignature(body_signature)"];
    let body_signature = KESSignature.deserialize(reader, body_signature_path);

    return new Header(header_body, body_signature);
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 2;

    writer.writeArrayTag(arrayLen);

    this._header_body.serialize(writer);
    this._body_signature.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["Header"]): Header {
    let reader = new CBORReader(data);
    return Header.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["Header"]): Header {
    return Header.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Header {
    return Header.from_bytes(this.to_bytes(), path);
  }
}

export class HeaderBody {
  private _block_number: number;
  private _slot: BigNum;
  private _prev_hash: BlockHash | undefined;
  private _issuer_vkey: Vkey;
  private _vrf_vkey: VRFVKey;
  private _vrf_result: VRFCert;
  private _block_body_size: number;
  private _block_body_hash: BlockHash;
  private _operational_cert: OperationalCert;
  private _protocol_version: ProtocolVersion;

  constructor(
    block_number: number,
    slot: BigNum,
    prev_hash: BlockHash | undefined,
    issuer_vkey: Vkey,
    vrf_vkey: VRFVKey,
    vrf_result: VRFCert,
    block_body_size: number,
    block_body_hash: BlockHash,
    operational_cert: OperationalCert,
    protocol_version: ProtocolVersion,
  ) {
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

  static new_headerbody(
    block_number: number,
    slot: BigNum,
    prev_hash: BlockHash | undefined,
    issuer_vkey: Vkey,
    vrf_vkey: VRFVKey,
    vrf_result: VRFCert,
    block_body_size: number,
    block_body_hash: BlockHash,
    operational_cert: OperationalCert,
    protocol_version: ProtocolVersion,
  ) {
    return new HeaderBody(
      block_number,
      slot,
      prev_hash,
      issuer_vkey,
      vrf_vkey,
      vrf_result,
      block_body_size,
      block_body_hash,
      operational_cert,
      protocol_version,
    );
  }

  block_number(): number {
    return this._block_number;
  }

  set_block_number(block_number: number): void {
    this._block_number = block_number;
  }

  slot_bignum(): BigNum {
    return this._slot;
  }

  set_slot(slot: BigNum): void {
    this._slot = slot;
  }

  prev_hash(): BlockHash | undefined {
    return this._prev_hash;
  }

  set_prev_hash(prev_hash: BlockHash | undefined): void {
    this._prev_hash = prev_hash;
  }

  issuer_vkey(): Vkey {
    return this._issuer_vkey;
  }

  set_issuer_vkey(issuer_vkey: Vkey): void {
    this._issuer_vkey = issuer_vkey;
  }

  vrf_vkey(): VRFVKey {
    return this._vrf_vkey;
  }

  set_vrf_vkey(vrf_vkey: VRFVKey): void {
    this._vrf_vkey = vrf_vkey;
  }

  vrf_result(): VRFCert {
    return this._vrf_result;
  }

  set_vrf_result(vrf_result: VRFCert): void {
    this._vrf_result = vrf_result;
  }

  block_body_size(): number {
    return this._block_body_size;
  }

  set_block_body_size(block_body_size: number): void {
    this._block_body_size = block_body_size;
  }

  block_body_hash(): BlockHash {
    return this._block_body_hash;
  }

  set_block_body_hash(block_body_hash: BlockHash): void {
    this._block_body_hash = block_body_hash;
  }

  operational_cert(): OperationalCert {
    return this._operational_cert;
  }

  set_operational_cert(operational_cert: OperationalCert): void {
    this._operational_cert = operational_cert;
  }

  protocol_version(): ProtocolVersion {
    return this._protocol_version;
  }

  set_protocol_version(protocol_version: ProtocolVersion): void {
    this._protocol_version = protocol_version;
  }

  static deserialize(reader: CBORReader, path: string[]): HeaderBody {
    let len = reader.readArrayTag(path);

    if (len != null && len < 10) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 10. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const block_number_path = [...path, "number(block_number)"];
    let block_number = Number(reader.readInt(block_number_path));

    const slot_path = [...path, "BigNum(slot)"];
    let slot = BigNum.deserialize(reader, slot_path);

    const prev_hash_path = [...path, "BlockHash(prev_hash)"];
    let prev_hash =
      reader.readNullable(
        (r) => BlockHash.deserialize(r, prev_hash_path),
        path,
      ) ?? undefined;

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
    let operational_cert = OperationalCert.deserialize(
      reader,
      operational_cert_path,
    );

    const protocol_version_path = [
      ...path,
      "ProtocolVersion(protocol_version)",
    ];
    let protocol_version = ProtocolVersion.deserialize(
      reader,
      protocol_version_path,
    );

    return new HeaderBody(
      block_number,
      slot,
      prev_hash,
      issuer_vkey,
      vrf_vkey,
      vrf_result,
      block_body_size,
      block_body_hash,
      operational_cert,
      protocol_version,
    );
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 10;

    writer.writeArrayTag(arrayLen);

    writer.writeInt(BigInt(this._block_number));
    this._slot.serialize(writer);
    if (this._prev_hash == null) {
      writer.writeNull();
    } else {
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
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["HeaderBody"],
  ): HeaderBody {
    let reader = new CBORReader(data);
    return HeaderBody.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["HeaderBody"],
  ): HeaderBody {
    return HeaderBody.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): HeaderBody {
    return HeaderBody.from_bytes(this.to_bytes(), path);
  }

  slot(): number {
    return this.slot_bignum()._to_number();
  }

  static new(
    block_number: number,
    slot: number,
    prev_hash: BlockHash | undefined,
    issuer_vkey: Vkey,
    vrf_vkey: VRFVKey,
    vrf_result: VRFCert,
    block_body_size: number,
    block_body_hash: BlockHash,
    operational_cert: OperationalCert,
    protocol_version: ProtocolVersion,
  ): HeaderBody {
    return new HeaderBody(
      block_number,
      BigNum._from_number(slot),
      prev_hash,
      issuer_vkey,
      vrf_vkey,
      vrf_result,
      block_body_size,
      block_body_hash,
      operational_cert,
      protocol_version,
    );
  }
}

export class InfoAction {
  constructor() {}

  static new() {
    return new InfoAction();
  }

  static deserialize(reader: CBORReader, path: string[]): InfoAction {
    return new InfoAction();
  }

  serialize(writer: CBORWriter): void {}

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["InfoAction"],
  ): InfoAction {
    let reader = new CBORReader(data);
    return InfoAction.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["InfoAction"],
  ): InfoAction {
    return InfoAction.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): InfoAction {
    return InfoAction.from_bytes(this.to_bytes(), path);
  }
}

export class Int {
  private inner: bigint;

  constructor(inner: bigint) {
    this.inner = inner;
  }

  toJsValue(): bigint {
    return this.inner;
  }

  static deserialize(reader: CBORReader, path: string[]): Int {
    return new Int(reader.readInt(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeInt(this.inner);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["Int"]): Int {
    let reader = new CBORReader(data);
    return Int.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["Int"]): Int {
    return Int.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Int {
    return Int.from_bytes(this.to_bytes(), path);
  }

  // Lifted from: https://doc.rust-lang.org/std/primitive.i32.html#associatedconstant.MAX
  static _maxI32(): number {
    return 2147483647;
  }

  // Lifted from: https://doc.rust-lang.org/std/primitive.i32.html#associatedconstant.MIN
  static _minI32(): number {
    return -2147483648;
  }

  static from_str(string: string): Int {
    return new Int(BigInt(string));
  }

  to_str(): string {
    return this.toJsValue().toString();
  }

  static new(x: BigNum): Int {
    return new Int(x.toJsValue());
  }

  static new_negative(x: BigNum): Int {
    return new Int(-1n * x.toJsValue());
  }

  static new_i32(x: number): Int {
    return new Int(BigInt(x));
  }

  is_positive(): boolean {
    return this.toJsValue() >= 0n;
  }

  as_positive(): BigNum | undefined {
    return this.is_positive() ? new BigNum(this.toJsValue()) : undefined;
  }

  as_negative(): BigNum | undefined {
    return !this.is_positive() ? new BigNum(-1n * this.toJsValue()) : undefined;
  }

  as_i32(): number | undefined {
    return this.as_i32_or_nothing();
  }

  as_i32_or_nothing(): number | undefined {
    let x = this.toJsValue();
    return x >= Int._minI32() && x <= Int._maxI32() ? Number(x) : undefined;
  }

  as_i32_or_fail(): number {
    let x = this.as_i32_or_nothing();
    if (x == null) throw new Error("Int out of i32 bounds");
    return x;
  }
}

export class InvalidTransactions {
  private items: Uint32Array;
  private definiteEncoding: boolean;

  constructor(items: Uint32Array, definiteEncoding: boolean = true) {
    this.items = items;
    this.definiteEncoding = definiteEncoding;
  }

  static new(): InvalidTransactions {
    return new InvalidTransactions(new Uint32Array([]));
  }

  len(): number {
    return this.items.length;
  }

  static deserialize(reader: CBORReader, path: string[]): InvalidTransactions {
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) => Number(reader.readUint([...path, "Byte#" + idx])),
      path,
    );

    return new InvalidTransactions(new Uint32Array(items), definiteEncoding);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(
      this.items,
      (writer, x) => writer.writeInt(BigInt(x)),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["InvalidTransactions"],
  ): InvalidTransactions {
    let reader = new CBORReader(data);
    return InvalidTransactions.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["InvalidTransactions"],
  ): InvalidTransactions {
    return InvalidTransactions.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): InvalidTransactions {
    return InvalidTransactions.from_bytes(this.to_bytes(), path);
  }

  as_uint32Array(): Uint32Array {
    return this.items;
  }
}

export class Ipv4 {
  private inner: Uint8Array;

  constructor(inner: Uint8Array) {
    if (inner.length != 4) throw new Error("Expected length to be 4");

    this.inner = inner;
  }

  static new(inner: Uint8Array): Ipv4 {
    return new Ipv4(inner);
  }

  ip(): Uint8Array {
    return this.inner;
  }

  static deserialize(reader: CBORReader, path: string[]): Ipv4 {
    return new Ipv4(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["Ipv4"]): Ipv4 {
    let reader = new CBORReader(data);
    return Ipv4.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["Ipv4"]): Ipv4 {
    return Ipv4.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Ipv4 {
    return Ipv4.from_bytes(this.to_bytes(), path);
  }
}

export class Ipv6 {
  private inner: Uint8Array;

  constructor(inner: Uint8Array) {
    if (inner.length != 16) throw new Error("Expected length to be 16");

    this.inner = inner;
  }

  static new(inner: Uint8Array): Ipv6 {
    return new Ipv6(inner);
  }

  ip(): Uint8Array {
    return this.inner;
  }

  static deserialize(reader: CBORReader, path: string[]): Ipv6 {
    return new Ipv6(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["Ipv6"]): Ipv6 {
    let reader = new CBORReader(data);
    return Ipv6.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["Ipv6"]): Ipv6 {
    return Ipv6.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Ipv6 {
    return Ipv6.from_bytes(this.to_bytes(), path);
  }
}

export class KESSignature {
  private inner: Uint8Array;

  constructor(inner: Uint8Array) {
    if (inner.length != 448) throw new Error("Expected length to be 448");

    this.inner = inner;
  }

  static new(inner: Uint8Array): KESSignature {
    return new KESSignature(inner);
  }

  toJsValue(): Uint8Array {
    return this.inner;
  }

  static deserialize(reader: CBORReader, path: string[]): KESSignature {
    return new KESSignature(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["KESSignature"],
  ): KESSignature {
    let reader = new CBORReader(data);
    return KESSignature.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["KESSignature"],
  ): KESSignature {
    return KESSignature.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): KESSignature {
    return KESSignature.from_bytes(this.to_bytes(), path);
  }
}

export class KESVKey {
  private inner: Uint8Array;

  constructor(inner: Uint8Array) {
    if (inner.length != 32) throw new Error("Expected length to be 32");
    this.inner = inner;
  }

  static new(inner: Uint8Array): KESVKey {
    return new KESVKey(inner);
  }

  static from_bech32(bech_str: string): KESVKey {
    let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new KESVKey(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): KESVKey {
    return new KESVKey(data);
  }

  static from_hex(hex_str: string): KESVKey {
    return KESVKey.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    return this.inner;
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): KESVKey {
    return KESVKey.from_bytes(this.to_bytes());
  }

  static deserialize(reader: CBORReader, path: string[]): KESVKey {
    return new KESVKey(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }
}

export enum LanguageKind {
  plutus_v1 = 0,
  plutus_v2 = 1,
  plutus_v3 = 2,
}

export class Language {
  private kind_: LanguageKind;

  constructor(kind: LanguageKind) {
    this.kind_ = kind;
  }

  static new_plutus_v1(): Language {
    return new Language(0);
  }

  static new_plutus_v2(): Language {
    return new Language(1);
  }

  static new_plutus_v3(): Language {
    return new Language(2);
  }
  kind(): LanguageKind {
    return this.kind_;
  }

  static deserialize(reader: CBORReader, path: string[]): Language {
    let kind = Number(reader.readInt(path));
    if (kind == 0) return new Language(0);
    if (kind == 1) return new Language(1);
    if (kind == 2) return new Language(2);
    throw (
      "Unrecognized enum value: " +
      kind +
      " for " +
      Language +
      "(at " +
      path.join("/") +
      ")"
    );
  }

  serialize(writer: CBORWriter): void {
    writer.writeInt(BigInt(this.kind_));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["Language"]): Language {
    let reader = new CBORReader(data);
    return Language.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["Language"]): Language {
    return Language.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Language {
    return Language.from_bytes(this.to_bytes(), path);
  }
}

export class Languages {
  private items: Language[];
  private definiteEncoding: boolean;

  constructor(items: Language[], definiteEncoding: boolean = true) {
    this.items = items;
    this.definiteEncoding = definiteEncoding;
  }

  static new(): Languages {
    return new Languages([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): Language {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: Language): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader, path: string[]): Languages {
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) => Language.deserialize(reader, [...path, "Elem#" + idx]),
      path,
    );
    return new Languages(items, definiteEncoding);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["Languages"],
  ): Languages {
    let reader = new CBORReader(data);
    return Languages.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["Languages"]): Languages {
    return Languages.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Languages {
    return Languages.from_bytes(this.to_bytes(), path);
  }

  static list(): Languages {
    return new Languages([
      Language.new_plutus_v1(),
      Language.new_plutus_v2(),
      Language.new_plutus_v3(),
    ]);
  }
}

export class MetadataList {
  private items: TransactionMetadatum[];
  private definiteEncoding: boolean;

  constructor(items: TransactionMetadatum[], definiteEncoding: boolean = true) {
    this.items = items;
    this.definiteEncoding = definiteEncoding;
  }

  static new(): MetadataList {
    return new MetadataList([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): TransactionMetadatum {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: TransactionMetadatum): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader, path: string[]): MetadataList {
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) =>
        TransactionMetadatum.deserialize(reader, [...path, "Elem#" + idx]),
      path,
    );
    return new MetadataList(items, definiteEncoding);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["MetadataList"],
  ): MetadataList {
    let reader = new CBORReader(data);
    return MetadataList.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["MetadataList"],
  ): MetadataList {
    return MetadataList.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): MetadataList {
    return MetadataList.from_bytes(this.to_bytes(), path);
  }
}

export class MetadataMap {
  _items: [TransactionMetadatum, TransactionMetadatum][];

  constructor(items: [TransactionMetadatum, TransactionMetadatum][]) {
    this._items = items;
  }

  static new(): MetadataMap {
    return new MetadataMap([]);
  }

  len(): number {
    return this._items.length;
  }

  insert(
    key: TransactionMetadatum,
    value: TransactionMetadatum,
  ): TransactionMetadatum | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this._items.push([key, value]);
    return undefined;
  }

  _get(key: TransactionMetadatum): TransactionMetadatum | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: TransactionMetadatum[]): void {
    this._items = this._items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  keys(): MetadataList {
    let keys = MetadataList.new();
    for (let [key, _] of this._items) keys.add(key);
    return keys;
  }

  static deserialize(reader: CBORReader, path: string[]): MetadataMap {
    let ret = new MetadataMap([]);
    reader.readMap(
      (reader, idx) =>
        ret.insert(
          TransactionMetadatum.deserialize(reader, [
            ...path,
            "TransactionMetadatum#" + idx,
          ]),
          TransactionMetadatum.deserialize(reader, [
            ...path,
            "TransactionMetadatum#" + idx,
          ]),
        ),
      path,
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this._items, (writer, x) => {
      x[0].serialize(writer);
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["MetadataMap"],
  ): MetadataMap {
    let reader = new CBORReader(data);
    return MetadataMap.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["MetadataMap"],
  ): MetadataMap {
    return MetadataMap.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): MetadataMap {
    return MetadataMap.from_bytes(this.to_bytes(), path);
  }

  insert_str(
    key: string,
    value: TransactionMetadatum,
  ): TransactionMetadatum | undefined {
    let metadata = TransactionMetadatum.new_text(key);
    return this.insert(metadata, value);
  }

  insert_i32(
    key: number,
    value: TransactionMetadatum,
  ): TransactionMetadatum | undefined {
    let metadata = TransactionMetadatum.new_int(Int.new_i32(key));
    return this.insert(metadata, value);
  }

  get(key: TransactionMetadatum): TransactionMetadatum {
    let ret = this._get(key);
    if (ret == null) throw new Error("Non-existent key");
    return ret;
  }

  get_str(key: string): TransactionMetadatum {
    let metadata = TransactionMetadatum.new_text(key);
    return this.get(metadata);
  }

  get_i32(key: number): TransactionMetadatum {
    let metadata = TransactionMetadatum.new_int(Int.new_i32(key));
    return this.get(metadata);
  }

  has(key: TransactionMetadatum): boolean {
    return this._get(key) != null;
  }
}

export class Mint {
  _items: [ScriptHash, MintAssets][];

  constructor(items: [ScriptHash, MintAssets][]) {
    this._items = items;
  }

  static new(): Mint {
    return new Mint([]);
  }

  len(): number {
    return this._items.length;
  }

  insert(key: ScriptHash, value: MintAssets): MintAssets | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this._items.push([key, value]);
    return undefined;
  }

  _remove_many(keys: ScriptHash[]): void {
    this._items = this._items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  keys(): ScriptHashes {
    let keys = ScriptHashes.new();
    for (let [key, _] of this._items) keys.add(key);
    return keys;
  }

  static deserialize(reader: CBORReader, path: string[]): Mint {
    let ret = new Mint([]);
    reader.readMap(
      (reader, idx) =>
        ret.insert(
          ScriptHash.deserialize(reader, [...path, "ScriptHash#" + idx]),
          MintAssets.deserialize(reader, [...path, "MintAssets#" + idx]),
        ),
      path,
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this._items, (writer, x) => {
      x[0].serialize(writer);
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["Mint"]): Mint {
    let reader = new CBORReader(data);
    return Mint.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["Mint"]): Mint {
    return Mint.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Mint {
    return Mint.from_bytes(this.to_bytes(), path);
  }

  get(key: ScriptHash): MintsAssets | undefined {
    let ret = MintsAssets.new();
    for (let [key_, value] of this._items) {
      if (arrayEq(key.to_bytes(), key_.to_bytes())) {
        ret.add(value);
      }
    }
    if (ret.len() != 0) return ret;
    return undefined;
  }

  _as_multiasset(isPositive: boolean): MultiAsset {
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

  as_positive_multiasset(): MultiAsset {
    return this._as_multiasset(true);
  }

  as_negative_multiasset(): MultiAsset {
    return this._as_multiasset(false);
  }
}

export class MintAssets {
  _items: [AssetName, Int][];

  constructor(items: [AssetName, Int][]) {
    this._items = items;
  }

  static new(): MintAssets {
    return new MintAssets([]);
  }

  len(): number {
    return this._items.length;
  }

  insert(key: AssetName, value: Int): Int | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this._items.push([key, value]);
    return undefined;
  }

  get(key: AssetName): Int | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: AssetName[]): void {
    this._items = this._items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  keys(): AssetNames {
    let keys = AssetNames.new();
    for (let [key, _] of this._items) keys.add(key);
    return keys;
  }

  static deserialize(reader: CBORReader, path: string[]): MintAssets {
    let ret = new MintAssets([]);
    reader.readMap(
      (reader, idx) =>
        ret.insert(
          AssetName.deserialize(reader, [...path, "AssetName#" + idx]),
          Int.deserialize(reader, [...path, "Int#" + idx]),
        ),
      path,
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this._items, (writer, x) => {
      x[0].serialize(writer);
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["MintAssets"],
  ): MintAssets {
    let reader = new CBORReader(data);
    return MintAssets.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["MintAssets"],
  ): MintAssets {
    return MintAssets.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): MintAssets {
    return MintAssets.from_bytes(this.to_bytes(), path);
  }
}

export class MintsAssets {
  private items: MintAssets[];
  private definiteEncoding: boolean;

  constructor(items: MintAssets[], definiteEncoding: boolean = true) {
    this.items = items;
    this.definiteEncoding = definiteEncoding;
  }

  static new(): MintsAssets {
    return new MintsAssets([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): MintAssets {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: MintAssets): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader, path: string[]): MintsAssets {
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) => MintAssets.deserialize(reader, [...path, "Elem#" + idx]),
      path,
    );
    return new MintsAssets(items, definiteEncoding);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["MintsAssets"],
  ): MintsAssets {
    let reader = new CBORReader(data);
    return MintsAssets.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["MintsAssets"],
  ): MintsAssets {
    return MintsAssets.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): MintsAssets {
    return MintsAssets.from_bytes(this.to_bytes(), path);
  }
}

export class MultiAsset {
  _items: [ScriptHash, Assets][];

  constructor(items: [ScriptHash, Assets][]) {
    this._items = items;
  }

  static new(): MultiAsset {
    return new MultiAsset([]);
  }

  len(): number {
    return this._items.length;
  }

  insert(key: ScriptHash, value: Assets): Assets | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this._items.push([key, value]);
    return undefined;
  }

  get(key: ScriptHash): Assets | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: ScriptHash[]): void {
    this._items = this._items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  keys(): ScriptHashes {
    let keys = ScriptHashes.new();
    for (let [key, _] of this._items) keys.add(key);
    return keys;
  }

  static deserialize(reader: CBORReader, path: string[]): MultiAsset {
    let ret = new MultiAsset([]);
    reader.readMap(
      (reader, idx) =>
        ret.insert(
          ScriptHash.deserialize(reader, [...path, "ScriptHash#" + idx]),
          Assets.deserialize(reader, [...path, "Assets#" + idx]),
        ),
      path,
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this._items, (writer, x) => {
      x[0].serialize(writer);
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["MultiAsset"],
  ): MultiAsset {
    let reader = new CBORReader(data);
    return MultiAsset.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["MultiAsset"],
  ): MultiAsset {
    return MultiAsset.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): MultiAsset {
    return MultiAsset.from_bytes(this.to_bytes(), path);
  }

  set_asset(
    policy_id: ScriptHash,
    asset_name: AssetName,
    value: BigNum,
  ): BigNum | undefined {
    let assets = this.get(policy_id);
    if (assets == null) {
      assets = Assets.new();
      this.insert(policy_id, assets);
    }
    return assets.insert(asset_name, value);
  }

  get_asset(policy_id: ScriptHash, asset_name: AssetName): BigNum {
    let assets = this.get(policy_id);
    if (assets == null) return BigNum.zero();
    let asset_amount = assets.get(asset_name);
    if (asset_amount == null) return BigNum.zero();
    return asset_amount;
  }

  sub(rhs: MultiAsset, path: string[]): MultiAsset {
    let out = this.clone(path);
    out._inplace_clamped_sub(rhs);
    return out;
  }

  _inplace_checked_add(rhs: MultiAsset): void {
    for (let [policy, rhs_assets] of rhs._items) {
      let this_assets = this.get(policy);
      if (this_assets == null) {
        this_assets = Assets.new();
        this.insert(policy, this_assets);
      }
      this_assets._inplace_checked_add(rhs_assets);
    }
  }

  _inplace_clamped_sub(rhs: MultiAsset) {
    for (let [policy, rhs_assets] of rhs._items) {
      let this_assets = this.get(policy);
      if (this_assets == null) continue;
      this_assets._inplace_clamped_sub(rhs_assets);
    }
    this._normalize();
  }

  _normalize(): void {
    let to_remove: ScriptHash[] = [];
    for (let [policy_id, assets] of this._items) {
      if (assets.len() == 0) to_remove.push(policy_id);
    }
    this._remove_many(to_remove);
  }

  _partial_cmp(rhs: MultiAsset): number | undefined {
    const zero = Assets.new();
    let cmps = [
      false, // -1
      false, // 0
      false, // 1
    ];
    for (let [policy_id, this_assets] of this._items) {
      let rhs_assets = rhs.get(policy_id);
      if (rhs_assets == null) rhs_assets = zero;
      let assets_cmp = this_assets._partial_cmp(rhs_assets);
      if (assets_cmp == null) return undefined;
      cmps[1 + assets_cmp] = true;
    }

    for (let [policy_id, rhs_assets] of rhs._items) {
      let this_assets = this.get(policy_id);
      if (this_assets == null) this_assets = zero;
      let assets_cmp = this_assets._partial_cmp(rhs_assets);
      if (assets_cmp == null) return undefined;
      cmps[1 + assets_cmp] = true;
    }

    let has_less = cmps[0];
    let _has_equal = cmps[1];
    let has_greater = cmps[2];

    if (has_less && has_greater) return undefined;
    else if (has_less) return -1;
    else if (has_greater) return 1;
    else return 0;
  }
}

export class MultiHostName {
  private _dns_name: DNSRecordSRV;

  constructor(dns_name: DNSRecordSRV) {
    this._dns_name = dns_name;
  }

  static new(dns_name: DNSRecordSRV) {
    return new MultiHostName(dns_name);
  }

  dns_name(): DNSRecordSRV {
    return this._dns_name;
  }

  set_dns_name(dns_name: DNSRecordSRV): void {
    this._dns_name = dns_name;
  }

  static deserialize(reader: CBORReader, path: string[]): MultiHostName {
    let dns_name = DNSRecordSRV.deserialize(reader, [...path, "dns_name"]);

    return new MultiHostName(dns_name);
  }

  serialize(writer: CBORWriter): void {
    this._dns_name.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["MultiHostName"],
  ): MultiHostName {
    let reader = new CBORReader(data);
    return MultiHostName.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["MultiHostName"],
  ): MultiHostName {
    return MultiHostName.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): MultiHostName {
    return MultiHostName.from_bytes(this.to_bytes(), path);
  }
}

export enum NativeScriptKind {
  ScriptPubkey = 0,
  ScriptAll = 1,
  ScriptAny = 2,
  ScriptNOfK = 3,
  TimelockStart = 4,
  TimelockExpiry = 5,
}

export type NativeScriptVariant =
  | { kind: 0; value: ScriptPubkey }
  | { kind: 1; value: ScriptAll }
  | { kind: 2; value: ScriptAny }
  | { kind: 3; value: ScriptNOfK }
  | { kind: 4; value: TimelockStart }
  | { kind: 5; value: TimelockExpiry };

export class NativeScript {
  private variant: NativeScriptVariant;

  constructor(variant: NativeScriptVariant) {
    this.variant = variant;
  }

  static new_script_pubkey(script_pubkey: ScriptPubkey): NativeScript {
    return new NativeScript({ kind: 0, value: script_pubkey });
  }

  static new_script_all(script_all: ScriptAll): NativeScript {
    return new NativeScript({ kind: 1, value: script_all });
  }

  static new_script_any(script_any: ScriptAny): NativeScript {
    return new NativeScript({ kind: 2, value: script_any });
  }

  static new_script_n_of_k(script_n_of_k: ScriptNOfK): NativeScript {
    return new NativeScript({ kind: 3, value: script_n_of_k });
  }

  static new_timelock_start(timelock_start: TimelockStart): NativeScript {
    return new NativeScript({ kind: 4, value: timelock_start });
  }

  static new_timelock_expiry(timelock_expiry: TimelockExpiry): NativeScript {
    return new NativeScript({ kind: 5, value: timelock_expiry });
  }

  as_script_pubkey(): ScriptPubkey | undefined {
    if (this.variant.kind == 0) return this.variant.value;
  }

  as_script_all(): ScriptAll | undefined {
    if (this.variant.kind == 1) return this.variant.value;
  }

  as_script_any(): ScriptAny | undefined {
    if (this.variant.kind == 2) return this.variant.value;
  }

  as_script_n_of_k(): ScriptNOfK | undefined {
    if (this.variant.kind == 3) return this.variant.value;
  }

  as_timelock_start(): TimelockStart | undefined {
    if (this.variant.kind == 4) return this.variant.value;
  }

  as_timelock_expiry(): TimelockExpiry | undefined {
    if (this.variant.kind == 5) return this.variant.value;
  }

  kind(): NativeScriptKind {
    return this.variant.kind;
  }

  static deserialize(reader: CBORReader, path: string[]): NativeScript {
    let len = reader.readArrayTag(path);
    let tag = Number(reader.readUint(path));
    let variant: NativeScriptVariant;

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
        throw new Error(
          "Unexpected tag for NativeScript: " +
            tag +
            "(at " +
            path.join("/") +
            ")",
        );
    }

    if (len == null) {
      reader.readBreak();
    }

    return new NativeScript(variant);
  }

  serialize(writer: CBORWriter): void {
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
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["NativeScript"],
  ): NativeScript {
    let reader = new CBORReader(data);
    return NativeScript.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["NativeScript"],
  ): NativeScript {
    return NativeScript.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): NativeScript {
    return NativeScript.from_bytes(this.to_bytes(), path);
  }
}

export class NativeScriptRefInput {
  private _script_hash: ScriptHash;
  private _input: TransactionInput;
  private _script_size: number;

  constructor(
    script_hash: ScriptHash,
    input: TransactionInput,
    script_size: number,
  ) {
    this._script_hash = script_hash;
    this._input = input;
    this._script_size = script_size;
  }

  static new(
    script_hash: ScriptHash,
    input: TransactionInput,
    script_size: number,
  ) {
    return new NativeScriptRefInput(script_hash, input, script_size);
  }

  script_hash(): ScriptHash {
    return this._script_hash;
  }

  set_script_hash(script_hash: ScriptHash): void {
    this._script_hash = script_hash;
  }

  input(): TransactionInput {
    return this._input;
  }

  set_input(input: TransactionInput): void {
    this._input = input;
  }

  script_size(): number {
    return this._script_size;
  }

  set_script_size(script_size: number): void {
    this._script_size = script_size;
  }

  static deserialize(reader: CBORReader, path: string[]): NativeScriptRefInput {
    let len = reader.readArrayTag(path);

    if (len != null && len < 3) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 3. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const script_hash_path = [...path, "ScriptHash(script_hash)"];
    let script_hash = ScriptHash.deserialize(reader, script_hash_path);

    const input_path = [...path, "TransactionInput(input)"];
    let input = TransactionInput.deserialize(reader, input_path);

    const script_size_path = [...path, "number(script_size)"];
    let script_size = Number(reader.readInt(script_size_path));

    return new NativeScriptRefInput(script_hash, input, script_size);
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 3;

    writer.writeArrayTag(arrayLen);

    this._script_hash.serialize(writer);
    this._input.serialize(writer);
    writer.writeInt(BigInt(this._script_size));
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["NativeScriptRefInput"],
  ): NativeScriptRefInput {
    let reader = new CBORReader(data);
    return NativeScriptRefInput.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["NativeScriptRefInput"],
  ): NativeScriptRefInput {
    return NativeScriptRefInput.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): NativeScriptRefInput {
    return NativeScriptRefInput.from_bytes(this.to_bytes(), path);
  }
}

export enum NativeScriptSourceKind {
  NativeScript = 0,
  NativeScriptRefInput = 1,
}

export type NativeScriptSourceVariant =
  | { kind: 0; value: NativeScript }
  | { kind: 1; value: NativeScriptRefInput };

export class NativeScriptSource {
  private variant: NativeScriptSourceVariant;

  constructor(variant: NativeScriptSourceVariant) {
    this.variant = variant;
  }

  static new_script(script: NativeScript): NativeScriptSource {
    return new NativeScriptSource({ kind: 0, value: script });
  }

  static new__ref_input(_ref_input: NativeScriptRefInput): NativeScriptSource {
    return new NativeScriptSource({ kind: 1, value: _ref_input });
  }

  as_script(): NativeScript | undefined {
    if (this.variant.kind == 0) return this.variant.value;
  }

  as__ref_input(): NativeScriptRefInput | undefined {
    if (this.variant.kind == 1) return this.variant.value;
  }

  kind(): NativeScriptSourceKind {
    return this.variant.kind;
  }

  static deserialize(reader: CBORReader, path: string[]): NativeScriptSource {
    let len = reader.readArrayTag(path);
    let tag = Number(reader.readUint(path));
    let variant: NativeScriptSourceVariant;

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
        throw new Error(
          "Unexpected tag for NativeScriptSource: " +
            tag +
            "(at " +
            path.join("/") +
            ")",
        );
    }

    if (len == null) {
      reader.readBreak();
    }

    return new NativeScriptSource(variant);
  }

  serialize(writer: CBORWriter): void {
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
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["NativeScriptSource"],
  ): NativeScriptSource {
    let reader = new CBORReader(data);
    return NativeScriptSource.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["NativeScriptSource"],
  ): NativeScriptSource {
    return NativeScriptSource.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): NativeScriptSource {
    return NativeScriptSource.from_bytes(this.to_bytes(), path);
  }

  static new(script: NativeScript): NativeScriptSource {
    return NativeScriptSource.new_script(script);
  }
  static new_ref_input(
    script_hash: ScriptHash,
    input: TransactionInput,
    script_size: number,
  ): NativeScriptSource {
    return NativeScriptSource.new__ref_input(
      NativeScriptRefInput.new(script_hash, input, script_size),
    );
  }
  set_required_signers(key_hashes: Ed25519KeyHashes): void {
    // TODO: implement.
  }
  get_ref_script_size(): number | undefined {
    // TODO: implement.
    return undefined;
  }
}

export class NativeScripts {
  private items: NativeScript[];
  private definiteEncoding: boolean;
  private nonEmptyTag: boolean;

  private setItems(items: NativeScript[]) {
    this.items = items;
  }

  constructor(definiteEncoding: boolean = true, nonEmptyTag: boolean = true) {
    this.items = [];
    this.definiteEncoding = definiteEncoding;
    this.nonEmptyTag = nonEmptyTag;
  }

  static new(): NativeScripts {
    return new NativeScripts();
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): NativeScript {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: NativeScript): boolean {
    if (this.contains(elem)) return true;
    this.items.push(elem);
    return false;
  }

  contains(elem: NativeScript): boolean {
    for (let item of this.items) {
      if (arrayEq(item.to_bytes(), elem.to_bytes())) {
        return true;
      }
    }
    return false;
  }

  static deserialize(reader: CBORReader, path: string[]): NativeScripts {
    let nonEmptyTag = false;
    if (reader.peekType(path) == "tagged") {
      let tag = reader.readTaggedTag(path);
      if (tag != 258) {
        throw new Error("Expected tag 258. Got " + tag);
      } else {
        nonEmptyTag = true;
      }
    }
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) =>
        NativeScript.deserialize(reader, [...path, "NativeScript#" + idx]),
      path,
    );
    let ret = new NativeScripts(definiteEncoding, nonEmptyTag);
    ret.setItems(items);
    return ret;
  }

  serialize(writer: CBORWriter): void {
    if (this.nonEmptyTag) {
      writer.writeTaggedTag(258);
    }
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["NativeScripts"],
  ): NativeScripts {
    let reader = new CBORReader(data);
    return NativeScripts.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["NativeScripts"],
  ): NativeScripts {
    return NativeScripts.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): NativeScripts {
    return NativeScripts.from_bytes(this.to_bytes(), path);
  }
}

export enum NetworkIdKind {
  mainnet = 1,
  testnet = 0,
}

export class NetworkId {
  private kind_: NetworkIdKind;

  constructor(kind: NetworkIdKind) {
    this.kind_ = kind;
  }

  static new_mainnet(): NetworkId {
    return new NetworkId(1);
  }

  static new_testnet(): NetworkId {
    return new NetworkId(0);
  }
  kind(): NetworkIdKind {
    return this.kind_;
  }

  static deserialize(reader: CBORReader, path: string[]): NetworkId {
    let kind = Number(reader.readInt(path));
    if (kind == 1) return new NetworkId(1);
    if (kind == 0) return new NetworkId(0);
    throw (
      "Unrecognized enum value: " +
      kind +
      " for " +
      NetworkId +
      "(at " +
      path.join("/") +
      ")"
    );
  }

  serialize(writer: CBORWriter): void {
    writer.writeInt(BigInt(this.kind_));
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["NetworkId"],
  ): NetworkId {
    let reader = new CBORReader(data);
    return NetworkId.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["NetworkId"]): NetworkId {
    return NetworkId.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): NetworkId {
    return NetworkId.from_bytes(this.to_bytes(), path);
  }
}

export class NewConstitutionAction {
  private _gov_action_id: GovernanceActionId | undefined;
  private _constitution: Constitution;

  constructor(
    gov_action_id: GovernanceActionId | undefined,
    constitution: Constitution,
  ) {
    this._gov_action_id = gov_action_id;
    this._constitution = constitution;
  }

  static new_with_action_id(
    gov_action_id: GovernanceActionId | undefined,
    constitution: Constitution,
  ) {
    return new NewConstitutionAction(gov_action_id, constitution);
  }

  gov_action_id(): GovernanceActionId | undefined {
    return this._gov_action_id;
  }

  set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void {
    this._gov_action_id = gov_action_id;
  }

  constitution(): Constitution {
    return this._constitution;
  }

  set_constitution(constitution: Constitution): void {
    this._constitution = constitution;
  }

  static deserialize(
    reader: CBORReader,
    path: string[],
  ): NewConstitutionAction {
    let gov_action_id =
      reader.readNullable(
        (r) => GovernanceActionId.deserialize(r, [...path, "gov_action_id"]),
        path,
      ) ?? undefined;

    let constitution = Constitution.deserialize(reader, [
      ...path,
      "constitution",
    ]);

    return new NewConstitutionAction(gov_action_id, constitution);
  }

  serialize(writer: CBORWriter): void {
    if (this._gov_action_id == null) {
      writer.writeNull();
    } else {
      this._gov_action_id.serialize(writer);
    }
    this._constitution.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["NewConstitutionAction"],
  ): NewConstitutionAction {
    let reader = new CBORReader(data);
    return NewConstitutionAction.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["NewConstitutionAction"],
  ): NewConstitutionAction {
    return NewConstitutionAction.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): NewConstitutionAction {
    return NewConstitutionAction.from_bytes(this.to_bytes(), path);
  }

  static new(constitution: Constitution): NewConstitutionAction {
    return new NewConstitutionAction(undefined, constitution);
  }
}

export class NoConfidenceAction {
  private _gov_action_id: GovernanceActionId | undefined;

  constructor(gov_action_id: GovernanceActionId | undefined) {
    this._gov_action_id = gov_action_id;
  }

  static new_with_action_id(gov_action_id: GovernanceActionId | undefined) {
    return new NoConfidenceAction(gov_action_id);
  }

  gov_action_id(): GovernanceActionId | undefined {
    return this._gov_action_id;
  }

  set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void {
    this._gov_action_id = gov_action_id;
  }

  static deserialize(reader: CBORReader, path: string[]): NoConfidenceAction {
    let gov_action_id =
      reader.readNullable(
        (r) => GovernanceActionId.deserialize(r, [...path, "gov_action_id"]),
        path,
      ) ?? undefined;

    return new NoConfidenceAction(gov_action_id);
  }

  serialize(writer: CBORWriter): void {
    if (this._gov_action_id == null) {
      writer.writeNull();
    } else {
      this._gov_action_id.serialize(writer);
    }
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["NoConfidenceAction"],
  ): NoConfidenceAction {
    let reader = new CBORReader(data);
    return NoConfidenceAction.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["NoConfidenceAction"],
  ): NoConfidenceAction {
    return NoConfidenceAction.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): NoConfidenceAction {
    return NoConfidenceAction.from_bytes(this.to_bytes(), path);
  }

  static new(): NoConfidenceAction {
    return new NoConfidenceAction(undefined);
  }
}

export class Nonce {
  private _hash: Uint8Array | undefined;

  constructor(hash: Uint8Array | undefined) {
    this._hash = hash;
  }

  static new(hash: Uint8Array | undefined) {
    return new Nonce(hash);
  }

  hash(): Uint8Array | undefined {
    return this._hash;
  }

  set_hash(hash: Uint8Array | undefined): void {
    this._hash = hash;
  }

  static deserialize(reader: CBORReader, path: string[]): Nonce {
    let len = reader.readArrayTag(path);

    if (len != null && len < 1) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 1. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const hash_path = [...path, "bytes(hash)"];
    let hash =
      reader.readNullable((r) => r.readBytes(hash_path), path) ?? undefined;

    return new Nonce(hash);
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 1;

    writer.writeArrayTag(arrayLen);

    if (this._hash == null) {
      writer.writeNull();
    } else {
      writer.writeBytes(this._hash);
    }
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["Nonce"]): Nonce {
    let reader = new CBORReader(data);
    return Nonce.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["Nonce"]): Nonce {
    return Nonce.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Nonce {
    return Nonce.from_bytes(this.to_bytes(), path);
  }

  static new_identity(): Nonce {
    return new Nonce(undefined);
  }
  static new_from_hash(hash: Uint8Array): Nonce {
    return new Nonce(hash);
  }
  get_hash(): Uint8Array | undefined {
    return this._hash;
  }
}

export class OperationalCert {
  private _hot_vkey: KESVKey;
  private _sequence_number: number;
  private _kes_period: number;
  private _sigma: Ed25519Signature;

  constructor(
    hot_vkey: KESVKey,
    sequence_number: number,
    kes_period: number,
    sigma: Ed25519Signature,
  ) {
    this._hot_vkey = hot_vkey;
    this._sequence_number = sequence_number;
    this._kes_period = kes_period;
    this._sigma = sigma;
  }

  static new(
    hot_vkey: KESVKey,
    sequence_number: number,
    kes_period: number,
    sigma: Ed25519Signature,
  ) {
    return new OperationalCert(hot_vkey, sequence_number, kes_period, sigma);
  }

  hot_vkey(): KESVKey {
    return this._hot_vkey;
  }

  set_hot_vkey(hot_vkey: KESVKey): void {
    this._hot_vkey = hot_vkey;
  }

  sequence_number(): number {
    return this._sequence_number;
  }

  set_sequence_number(sequence_number: number): void {
    this._sequence_number = sequence_number;
  }

  kes_period(): number {
    return this._kes_period;
  }

  set_kes_period(kes_period: number): void {
    this._kes_period = kes_period;
  }

  sigma(): Ed25519Signature {
    return this._sigma;
  }

  set_sigma(sigma: Ed25519Signature): void {
    this._sigma = sigma;
  }

  static deserialize(reader: CBORReader, path: string[]): OperationalCert {
    let len = reader.readArrayTag(path);

    if (len != null && len < 4) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 4. Received " +
          len +
          "(at " +
          path.join("/"),
      );
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

  serialize(writer: CBORWriter): void {
    let arrayLen = 4;

    writer.writeArrayTag(arrayLen);

    this._hot_vkey.serialize(writer);
    writer.writeInt(BigInt(this._sequence_number));
    writer.writeInt(BigInt(this._kes_period));
    this._sigma.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["OperationalCert"],
  ): OperationalCert {
    let reader = new CBORReader(data);
    return OperationalCert.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["OperationalCert"],
  ): OperationalCert {
    return OperationalCert.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): OperationalCert {
    return OperationalCert.from_bytes(this.to_bytes(), path);
  }
}

export enum OutputDatumKind {
  DataHash = 0,
  PlutusData = 1,
}

export type OutputDatumVariant =
  | { kind: 0; value: DataHash }
  | { kind: 1; value: PlutusData };

export class OutputDatum {
  private variant: OutputDatumVariant;

  constructor(variant: OutputDatumVariant) {
    this.variant = variant;
  }

  static new_data_hash(data_hash: DataHash): OutputDatum {
    return new OutputDatum({ kind: 0, value: data_hash });
  }

  static new_data(data: PlutusData): OutputDatum {
    return new OutputDatum({ kind: 1, value: data });
  }

  as_data_hash(): DataHash | undefined {
    if (this.variant.kind == 0) return this.variant.value;
  }

  as_data(): PlutusData | undefined {
    if (this.variant.kind == 1) return this.variant.value;
  }

  kind(): OutputDatumKind {
    return this.variant.kind;
  }

  static deserialize(reader: CBORReader, path: string[]): OutputDatum {
    let len = reader.readArrayTag(path);
    let tag = Number(reader.readUint(path));
    let variant: OutputDatumVariant;

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
        throw new Error(
          "Unexpected tag for OutputDatum: " +
            tag +
            "(at " +
            path.join("/") +
            ")",
        );
    }

    if (len == null) {
      reader.readBreak();
    }

    return new OutputDatum(variant);
  }

  serialize(writer: CBORWriter): void {
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
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["OutputDatum"],
  ): OutputDatum {
    let reader = new CBORReader(data);
    return OutputDatum.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["OutputDatum"],
  ): OutputDatum {
    return OutputDatum.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): OutputDatum {
    return OutputDatum.from_bytes(this.to_bytes(), path);
  }
}

export class ParameterChangeAction {
  private _gov_action_id: GovernanceActionId | undefined;
  private _protocol_param_updates: ProtocolParamUpdate;
  private _policy_hash: ScriptHash | undefined;

  constructor(
    gov_action_id: GovernanceActionId | undefined,
    protocol_param_updates: ProtocolParamUpdate,
    policy_hash: ScriptHash | undefined,
  ) {
    this._gov_action_id = gov_action_id;
    this._protocol_param_updates = protocol_param_updates;
    this._policy_hash = policy_hash;
  }

  static new_with_policy_hash_and_action_id(
    gov_action_id: GovernanceActionId | undefined,
    protocol_param_updates: ProtocolParamUpdate,
    policy_hash: ScriptHash | undefined,
  ) {
    return new ParameterChangeAction(
      gov_action_id,
      protocol_param_updates,
      policy_hash,
    );
  }

  gov_action_id(): GovernanceActionId | undefined {
    return this._gov_action_id;
  }

  set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void {
    this._gov_action_id = gov_action_id;
  }

  protocol_param_updates(): ProtocolParamUpdate {
    return this._protocol_param_updates;
  }

  set_protocol_param_updates(
    protocol_param_updates: ProtocolParamUpdate,
  ): void {
    this._protocol_param_updates = protocol_param_updates;
  }

  policy_hash(): ScriptHash | undefined {
    return this._policy_hash;
  }

  set_policy_hash(policy_hash: ScriptHash | undefined): void {
    this._policy_hash = policy_hash;
  }

  static deserialize(
    reader: CBORReader,
    path: string[],
  ): ParameterChangeAction {
    let gov_action_id =
      reader.readNullable(
        (r) => GovernanceActionId.deserialize(r, [...path, "gov_action_id"]),
        path,
      ) ?? undefined;

    let protocol_param_updates = ProtocolParamUpdate.deserialize(reader, [
      ...path,
      "protocol_param_updates",
    ]);

    let policy_hash =
      reader.readNullable(
        (r) => ScriptHash.deserialize(r, [...path, "policy_hash"]),
        path,
      ) ?? undefined;

    return new ParameterChangeAction(
      gov_action_id,
      protocol_param_updates,
      policy_hash,
    );
  }

  serialize(writer: CBORWriter): void {
    if (this._gov_action_id == null) {
      writer.writeNull();
    } else {
      this._gov_action_id.serialize(writer);
    }
    this._protocol_param_updates.serialize(writer);
    if (this._policy_hash == null) {
      writer.writeNull();
    } else {
      this._policy_hash.serialize(writer);
    }
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["ParameterChangeAction"],
  ): ParameterChangeAction {
    let reader = new CBORReader(data);
    return ParameterChangeAction.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["ParameterChangeAction"],
  ): ParameterChangeAction {
    return ParameterChangeAction.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): ParameterChangeAction {
    return ParameterChangeAction.from_bytes(this.to_bytes(), path);
  }

  static new(
    protocol_param_updates: ProtocolParamUpdate,
  ): ParameterChangeAction {
    return new ParameterChangeAction(
      undefined,
      protocol_param_updates,
      undefined,
    );
  }
  static new_with_action_id(
    gov_action_id: GovernanceActionId,
    protocol_param_updates: ProtocolParamUpdate,
  ): ParameterChangeAction {
    return new ParameterChangeAction(
      gov_action_id,
      protocol_param_updates,
      undefined,
    );
  }
  static new_with_policy_hash(
    protocol_param_updates: ProtocolParamUpdate,
    policy_hash: ScriptHash,
  ): ParameterChangeAction {
    return new ParameterChangeAction(
      undefined,
      protocol_param_updates,
      policy_hash,
    );
  }
}

export enum PlutusDataKind {
  ConstrPlutusData = 0,
  PlutusMap = 1,
  PlutusList = 2,
  CSLBigInt = 3,
  Bytes = 4,
}

export type PlutusDataVariant =
  | { kind: 0; value: ConstrPlutusData }
  | { kind: 1; value: PlutusMap }
  | { kind: 2; value: PlutusList }
  | { kind: 3; value: CSLBigInt }
  | { kind: 4; value: Uint8Array };

export class PlutusData {
  private variant: PlutusDataVariant;

  constructor(variant: PlutusDataVariant) {
    this.variant = variant;
  }

  static new_constr_plutus_data(
    constr_plutus_data: ConstrPlutusData,
  ): PlutusData {
    return new PlutusData({ kind: 0, value: constr_plutus_data });
  }

  static new_map(map: PlutusMap): PlutusData {
    return new PlutusData({ kind: 1, value: map });
  }

  static new_list(list: PlutusList): PlutusData {
    return new PlutusData({ kind: 2, value: list });
  }

  static new_integer(integer: CSLBigInt): PlutusData {
    return new PlutusData({ kind: 3, value: integer });
  }

  static new_bytes(bytes: Uint8Array): PlutusData {
    return new PlutusData({ kind: 4, value: bytes });
  }

  as_constr_plutus_data(): ConstrPlutusData {
    if (this.variant.kind == 0) return this.variant.value;
    throw new Error("Incorrect cast");
  }

  as_map(): PlutusMap {
    if (this.variant.kind == 1) return this.variant.value;
    throw new Error("Incorrect cast");
  }

  as_list(): PlutusList {
    if (this.variant.kind == 2) return this.variant.value;
    throw new Error("Incorrect cast");
  }

  as_integer(): CSLBigInt {
    if (this.variant.kind == 3) return this.variant.value;
    throw new Error("Incorrect cast");
  }

  as_bytes(): Uint8Array {
    if (this.variant.kind == 4) return this.variant.value;
    throw new Error("Incorrect cast");
  }

  kind(): PlutusDataKind {
    return this.variant.kind;
  }

  static deserialize(reader: CBORReader, path: string[]): PlutusData {
    let tag = reader.peekType(path);
    let variant: PlutusDataVariant;

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
        throw new Error(
          "Unexpected subtype for PlutusData: " +
            tag +
            "(at " +
            path.join("/") +
            ")",
        );
    }

    return new PlutusData(variant);
  }

  serialize(writer: CBORWriter): void {
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
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["PlutusData"],
  ): PlutusData {
    let reader = new CBORReader(data);
    return PlutusData.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["PlutusData"],
  ): PlutusData {
    return PlutusData.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): PlutusData {
    return PlutusData.from_bytes(this.to_bytes(), path);
  }

  static new_empty_constr_plutus_data(alternative: BigNum): PlutusData {
    return new PlutusData({
      kind: 0,
      value: ConstrPlutusData.new(alternative, PlutusList.new()),
    });
  }

  static new_single_value_constr_plutus_data(
    alternative: BigNum,
    plutus_data: PlutusData,
  ): PlutusData {
    let plutus_list = PlutusList.new();
    plutus_list.add(plutus_data);
    return new PlutusData({
      kind: 0,
      value: ConstrPlutusData.new(alternative, plutus_list),
    });
  }

  static from_address(address: Address): PlutusData {
    throw new Error("PlutusData.from_address: to be implemented");
  }
}

export class PlutusList {
  private items: PlutusData[];
  private definiteEncoding: boolean;

  constructor(items: PlutusData[], definiteEncoding: boolean = true) {
    this.items = items;
    this.definiteEncoding = definiteEncoding;
  }

  static new(): PlutusList {
    return new PlutusList([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): PlutusData {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: PlutusData): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader, path: string[]): PlutusList {
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) => PlutusData.deserialize(reader, [...path, "Elem#" + idx]),
      path,
    );
    return new PlutusList(items, definiteEncoding);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["PlutusList"],
  ): PlutusList {
    let reader = new CBORReader(data);
    return PlutusList.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["PlutusList"],
  ): PlutusList {
    return PlutusList.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): PlutusList {
    return PlutusList.from_bytes(this.to_bytes(), path);
  }

  as_set(): PlutusSet {
    let set = new PlutusSet(this.definiteEncoding);
    for (let i = 0; i < this.len(); i++) {
      set.add(this.items[i]);
    }
    return set;
  }
}

export class PlutusMap {
  _items: [PlutusData, PlutusData][];

  constructor(items: [PlutusData, PlutusData][]) {
    this._items = items;
  }

  static new(): PlutusMap {
    return new PlutusMap([]);
  }

  len(): number {
    return this._items.length;
  }

  insertInner(key: PlutusData, value: PlutusData): PlutusData | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this._items.push([key, value]);
    return undefined;
  }

  getInner(key: PlutusData): PlutusData | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: PlutusData[]): void {
    this._items = this._items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  keys(): PlutusList {
    let keys = PlutusList.new();
    for (let [key, _] of this._items) keys.add(key);
    return keys;
  }

  static deserialize(reader: CBORReader, path: string[]): PlutusMap {
    let ret = new PlutusMap([]);
    reader.readMap(
      (reader, idx) =>
        ret.insertInner(
          PlutusData.deserialize(reader, [...path, "PlutusData#" + idx]),
          PlutusData.deserialize(reader, [...path, "PlutusData#" + idx]),
        ),
      path,
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this._items, (writer, x) => {
      x[0].serialize(writer);
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["PlutusMap"],
  ): PlutusMap {
    let reader = new CBORReader(data);
    return PlutusMap.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["PlutusMap"]): PlutusMap {
    return PlutusMap.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): PlutusMap {
    return PlutusMap.from_bytes(this.to_bytes(), path);
  }

  get(key: PlutusData): PlutusMapValues | undefined {
    let v: PlutusData | undefined = this.getInner(key);
    if (v) {
      let vs = new PlutusMapValues([v]);
      return vs;
    } else {
      return undefined;
    }
  }

  insert(
    key: PlutusData,
    values: PlutusMapValues,
  ): PlutusMapValues | undefined {
    let v: PlutusData = values.get(values.len() - 1);
    let ret: PlutusData | undefined = this.insertInner(key, v);
    if (ret) {
      return new PlutusMapValues([ret]);
    } else {
      return undefined;
    }
  }
}

export class PlutusMapValues {
  private items: PlutusData[];
  private definiteEncoding: boolean;

  constructor(items: PlutusData[], definiteEncoding: boolean = true) {
    this.items = items;
    this.definiteEncoding = definiteEncoding;
  }

  static new(): PlutusMapValues {
    return new PlutusMapValues([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): PlutusData {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: PlutusData): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader, path: string[]): PlutusMapValues {
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) => PlutusData.deserialize(reader, [...path, "Elem#" + idx]),
      path,
    );
    return new PlutusMapValues(items, definiteEncoding);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["PlutusMapValues"],
  ): PlutusMapValues {
    let reader = new CBORReader(data);
    return PlutusMapValues.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["PlutusMapValues"],
  ): PlutusMapValues {
    return PlutusMapValues.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): PlutusMapValues {
    return PlutusMapValues.from_bytes(this.to_bytes(), path);
  }
}

export class PlutusScript {
  private inner: Uint8Array;

  constructor(inner: Uint8Array) {
    this.inner = inner;
  }

  static new(inner: Uint8Array): PlutusScript {
    return new PlutusScript(inner);
  }

  bytes(): Uint8Array {
    return this.inner;
  }

  static deserialize(reader: CBORReader, path: string[]): PlutusScript {
    return new PlutusScript(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["PlutusScript"],
  ): PlutusScript {
    let reader = new CBORReader(data);
    return PlutusScript.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["PlutusScript"],
  ): PlutusScript {
    return PlutusScript.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): PlutusScript {
    return PlutusScript.from_bytes(this.to_bytes(), path);
  }

  hash(language_version: number): ScriptHash {
    let bytes = new Uint8Array(this.bytes().length + 1);
    bytes[0] = language_version;
    bytes.set(bytes, 1);
    let hash_bytes = cdlCrypto.blake2b224(bytes);
    return new ScriptHash(hash_bytes);
  }
}

export class PlutusScripts {
  private items: PlutusScript[];
  private definiteEncoding: boolean;
  private nonEmptyTag: boolean;

  private setItems(items: PlutusScript[]) {
    this.items = items;
  }

  constructor(definiteEncoding: boolean = true, nonEmptyTag: boolean = true) {
    this.items = [];
    this.definiteEncoding = definiteEncoding;
    this.nonEmptyTag = nonEmptyTag;
  }

  static new(): PlutusScripts {
    return new PlutusScripts();
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): PlutusScript {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: PlutusScript): boolean {
    if (this.contains(elem)) return true;
    this.items.push(elem);
    return false;
  }

  contains(elem: PlutusScript): boolean {
    for (let item of this.items) {
      if (arrayEq(item.to_bytes(), elem.to_bytes())) {
        return true;
      }
    }
    return false;
  }

  static deserialize(reader: CBORReader, path: string[]): PlutusScripts {
    let nonEmptyTag = false;
    if (reader.peekType(path) == "tagged") {
      let tag = reader.readTaggedTag(path);
      if (tag != 258) {
        throw new Error("Expected tag 258. Got " + tag);
      } else {
        nonEmptyTag = true;
      }
    }
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) =>
        PlutusScript.deserialize(reader, [...path, "PlutusScript#" + idx]),
      path,
    );
    let ret = new PlutusScripts(definiteEncoding, nonEmptyTag);
    ret.setItems(items);
    return ret;
  }

  serialize(writer: CBORWriter): void {
    if (this.nonEmptyTag) {
      writer.writeTaggedTag(258);
    }
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["PlutusScripts"],
  ): PlutusScripts {
    let reader = new CBORReader(data);
    return PlutusScripts.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["PlutusScripts"],
  ): PlutusScripts {
    return PlutusScripts.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): PlutusScripts {
    return PlutusScripts.from_bytes(this.to_bytes(), path);
  }
}

export class PlutusSet {
  private items: PlutusData[];
  private definiteEncoding: boolean;
  private nonEmptyTag: boolean;

  private setItems(items: PlutusData[]) {
    this.items = items;
  }

  constructor(definiteEncoding: boolean = true, nonEmptyTag: boolean = true) {
    this.items = [];
    this.definiteEncoding = definiteEncoding;
    this.nonEmptyTag = nonEmptyTag;
  }

  static new(): PlutusSet {
    return new PlutusSet();
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): PlutusData {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: PlutusData): boolean {
    if (this.contains(elem)) return true;
    this.items.push(elem);
    return false;
  }

  contains(elem: PlutusData): boolean {
    for (let item of this.items) {
      if (arrayEq(item.to_bytes(), elem.to_bytes())) {
        return true;
      }
    }
    return false;
  }

  static deserialize(reader: CBORReader, path: string[]): PlutusSet {
    let nonEmptyTag = false;
    if (reader.peekType(path) == "tagged") {
      let tag = reader.readTaggedTag(path);
      if (tag != 258) {
        throw new Error("Expected tag 258. Got " + tag);
      } else {
        nonEmptyTag = true;
      }
    }
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) =>
        PlutusData.deserialize(reader, [...path, "PlutusData#" + idx]),
      path,
    );
    let ret = new PlutusSet(definiteEncoding, nonEmptyTag);
    ret.setItems(items);
    return ret;
  }

  serialize(writer: CBORWriter): void {
    if (this.nonEmptyTag) {
      writer.writeTaggedTag(258);
    }
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["PlutusSet"],
  ): PlutusSet {
    let reader = new CBORReader(data);
    return PlutusSet.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["PlutusSet"]): PlutusSet {
    return PlutusSet.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): PlutusSet {
    return PlutusSet.from_bytes(this.to_bytes(), path);
  }

  as_list(): PlutusList {
    return new PlutusList(this.items, this.definiteEncoding);
  }
}

export class PoolMetadata {
  private _url: URL;
  private _pool_metadata_hash: PoolMetadataHash;

  constructor(url: URL, pool_metadata_hash: PoolMetadataHash) {
    this._url = url;
    this._pool_metadata_hash = pool_metadata_hash;
  }

  static new(url: URL, pool_metadata_hash: PoolMetadataHash) {
    return new PoolMetadata(url, pool_metadata_hash);
  }

  url(): URL {
    return this._url;
  }

  set_url(url: URL): void {
    this._url = url;
  }

  pool_metadata_hash(): PoolMetadataHash {
    return this._pool_metadata_hash;
  }

  set_pool_metadata_hash(pool_metadata_hash: PoolMetadataHash): void {
    this._pool_metadata_hash = pool_metadata_hash;
  }

  static deserialize(reader: CBORReader, path: string[]): PoolMetadata {
    let len = reader.readArrayTag(path);

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 2. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const url_path = [...path, "URL(url)"];
    let url = URL.deserialize(reader, url_path);

    const pool_metadata_hash_path = [
      ...path,
      "PoolMetadataHash(pool_metadata_hash)",
    ];
    let pool_metadata_hash = PoolMetadataHash.deserialize(
      reader,
      pool_metadata_hash_path,
    );

    return new PoolMetadata(url, pool_metadata_hash);
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 2;

    writer.writeArrayTag(arrayLen);

    this._url.serialize(writer);
    this._pool_metadata_hash.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["PoolMetadata"],
  ): PoolMetadata {
    let reader = new CBORReader(data);
    return PoolMetadata.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["PoolMetadata"],
  ): PoolMetadata {
    return PoolMetadata.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): PoolMetadata {
    return PoolMetadata.from_bytes(this.to_bytes(), path);
  }
}

export class PoolMetadataHash {
  private inner: Uint8Array;

  constructor(inner: Uint8Array) {
    if (inner.length != 32) throw new Error("Expected length to be 32");
    this.inner = inner;
  }

  static new(inner: Uint8Array): PoolMetadataHash {
    return new PoolMetadataHash(inner);
  }

  static from_bech32(bech_str: string): PoolMetadataHash {
    let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new PoolMetadataHash(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): PoolMetadataHash {
    return new PoolMetadataHash(data);
  }

  static from_hex(hex_str: string): PoolMetadataHash {
    return PoolMetadataHash.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    return this.inner;
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): PoolMetadataHash {
    return PoolMetadataHash.from_bytes(this.to_bytes());
  }

  static deserialize(reader: CBORReader, path: string[]): PoolMetadataHash {
    return new PoolMetadataHash(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }
}

export class PoolParams {
  private _operator: Ed25519KeyHash;
  private _vrf_keyhash: VRFKeyHash;
  private _pledge: BigNum;
  private _cost: BigNum;
  private _margin: UnitInterval;
  private _reward_account: RewardAddress;
  private _pool_owners: Ed25519KeyHashes;
  private _relays: Relays;
  private _pool_metadata: PoolMetadata | undefined;

  constructor(
    operator: Ed25519KeyHash,
    vrf_keyhash: VRFKeyHash,
    pledge: BigNum,
    cost: BigNum,
    margin: UnitInterval,
    reward_account: RewardAddress,
    pool_owners: Ed25519KeyHashes,
    relays: Relays,
    pool_metadata: PoolMetadata | undefined,
  ) {
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

  static new(
    operator: Ed25519KeyHash,
    vrf_keyhash: VRFKeyHash,
    pledge: BigNum,
    cost: BigNum,
    margin: UnitInterval,
    reward_account: RewardAddress,
    pool_owners: Ed25519KeyHashes,
    relays: Relays,
    pool_metadata: PoolMetadata | undefined,
  ) {
    return new PoolParams(
      operator,
      vrf_keyhash,
      pledge,
      cost,
      margin,
      reward_account,
      pool_owners,
      relays,
      pool_metadata,
    );
  }

  operator(): Ed25519KeyHash {
    return this._operator;
  }

  set_operator(operator: Ed25519KeyHash): void {
    this._operator = operator;
  }

  vrf_keyhash(): VRFKeyHash {
    return this._vrf_keyhash;
  }

  set_vrf_keyhash(vrf_keyhash: VRFKeyHash): void {
    this._vrf_keyhash = vrf_keyhash;
  }

  pledge(): BigNum {
    return this._pledge;
  }

  set_pledge(pledge: BigNum): void {
    this._pledge = pledge;
  }

  cost(): BigNum {
    return this._cost;
  }

  set_cost(cost: BigNum): void {
    this._cost = cost;
  }

  margin(): UnitInterval {
    return this._margin;
  }

  set_margin(margin: UnitInterval): void {
    this._margin = margin;
  }

  reward_account(): RewardAddress {
    return this._reward_account;
  }

  set_reward_account(reward_account: RewardAddress): void {
    this._reward_account = reward_account;
  }

  pool_owners(): Ed25519KeyHashes {
    return this._pool_owners;
  }

  set_pool_owners(pool_owners: Ed25519KeyHashes): void {
    this._pool_owners = pool_owners;
  }

  relays(): Relays {
    return this._relays;
  }

  set_relays(relays: Relays): void {
    this._relays = relays;
  }

  pool_metadata(): PoolMetadata | undefined {
    return this._pool_metadata;
  }

  set_pool_metadata(pool_metadata: PoolMetadata | undefined): void {
    this._pool_metadata = pool_metadata;
  }

  static deserialize(reader: CBORReader, path: string[]): PoolParams {
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

    let pool_metadata =
      reader.readNullable(
        (r) => PoolMetadata.deserialize(r, [...path, "pool_metadata"]),
        path,
      ) ?? undefined;

    return new PoolParams(
      operator,
      vrf_keyhash,
      pledge,
      cost,
      margin,
      reward_account,
      pool_owners,
      relays,
      pool_metadata,
    );
  }

  serialize(writer: CBORWriter): void {
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
    } else {
      this._pool_metadata.serialize(writer);
    }
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["PoolParams"],
  ): PoolParams {
    let reader = new CBORReader(data);
    return PoolParams.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["PoolParams"],
  ): PoolParams {
    return PoolParams.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): PoolParams {
    return PoolParams.from_bytes(this.to_bytes(), path);
  }
}

export class PoolRegistration {
  private _pool_params: PoolParams;

  constructor(pool_params: PoolParams) {
    this._pool_params = pool_params;
  }

  static new(pool_params: PoolParams) {
    return new PoolRegistration(pool_params);
  }

  pool_params(): PoolParams {
    return this._pool_params;
  }

  set_pool_params(pool_params: PoolParams): void {
    this._pool_params = pool_params;
  }

  static deserialize(reader: CBORReader, path: string[]): PoolRegistration {
    let pool_params = PoolParams.deserialize(reader, [...path, "PoolParams"]);
    return new PoolRegistration(pool_params);
  }

  serialize(writer: CBORWriter): void {
    this._pool_params.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["PoolRegistration"],
  ): PoolRegistration {
    let reader = new CBORReader(data);
    return PoolRegistration.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["PoolRegistration"],
  ): PoolRegistration {
    return PoolRegistration.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): PoolRegistration {
    return PoolRegistration.from_bytes(this.to_bytes(), path);
  }
}

export class PoolRetirement {
  private _pool_keyhash: Ed25519KeyHash;
  private _epoch: number;

  constructor(pool_keyhash: Ed25519KeyHash, epoch: number) {
    this._pool_keyhash = pool_keyhash;
    this._epoch = epoch;
  }

  static new(pool_keyhash: Ed25519KeyHash, epoch: number) {
    return new PoolRetirement(pool_keyhash, epoch);
  }

  pool_keyhash(): Ed25519KeyHash {
    return this._pool_keyhash;
  }

  set_pool_keyhash(pool_keyhash: Ed25519KeyHash): void {
    this._pool_keyhash = pool_keyhash;
  }

  epoch(): number {
    return this._epoch;
  }

  set_epoch(epoch: number): void {
    this._epoch = epoch;
  }

  static deserialize(reader: CBORReader, path: string[]): PoolRetirement {
    let pool_keyhash = Ed25519KeyHash.deserialize(reader, [
      ...path,
      "pool_keyhash",
    ]);

    let epoch = Number(reader.readInt([...path, "epoch"]));

    return new PoolRetirement(pool_keyhash, epoch);
  }

  serialize(writer: CBORWriter): void {
    this._pool_keyhash.serialize(writer);
    writer.writeInt(BigInt(this._epoch));
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["PoolRetirement"],
  ): PoolRetirement {
    let reader = new CBORReader(data);
    return PoolRetirement.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["PoolRetirement"],
  ): PoolRetirement {
    return PoolRetirement.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): PoolRetirement {
    return PoolRetirement.from_bytes(this.to_bytes(), path);
  }
}

export class PoolVotingThresholds {
  private _motion_no_confidence: UnitInterval;
  private _committee_normal: UnitInterval;
  private _committee_no_confidence: UnitInterval;
  private _hard_fork_initiation: UnitInterval;
  private _security_relevant_threshold: UnitInterval;

  constructor(
    motion_no_confidence: UnitInterval,
    committee_normal: UnitInterval,
    committee_no_confidence: UnitInterval,
    hard_fork_initiation: UnitInterval,
    security_relevant_threshold: UnitInterval,
  ) {
    this._motion_no_confidence = motion_no_confidence;
    this._committee_normal = committee_normal;
    this._committee_no_confidence = committee_no_confidence;
    this._hard_fork_initiation = hard_fork_initiation;
    this._security_relevant_threshold = security_relevant_threshold;
  }

  static new(
    motion_no_confidence: UnitInterval,
    committee_normal: UnitInterval,
    committee_no_confidence: UnitInterval,
    hard_fork_initiation: UnitInterval,
    security_relevant_threshold: UnitInterval,
  ) {
    return new PoolVotingThresholds(
      motion_no_confidence,
      committee_normal,
      committee_no_confidence,
      hard_fork_initiation,
      security_relevant_threshold,
    );
  }

  motion_no_confidence(): UnitInterval {
    return this._motion_no_confidence;
  }

  set_motion_no_confidence(motion_no_confidence: UnitInterval): void {
    this._motion_no_confidence = motion_no_confidence;
  }

  committee_normal(): UnitInterval {
    return this._committee_normal;
  }

  set_committee_normal(committee_normal: UnitInterval): void {
    this._committee_normal = committee_normal;
  }

  committee_no_confidence(): UnitInterval {
    return this._committee_no_confidence;
  }

  set_committee_no_confidence(committee_no_confidence: UnitInterval): void {
    this._committee_no_confidence = committee_no_confidence;
  }

  hard_fork_initiation(): UnitInterval {
    return this._hard_fork_initiation;
  }

  set_hard_fork_initiation(hard_fork_initiation: UnitInterval): void {
    this._hard_fork_initiation = hard_fork_initiation;
  }

  security_relevant_threshold(): UnitInterval {
    return this._security_relevant_threshold;
  }

  set_security_relevant_threshold(
    security_relevant_threshold: UnitInterval,
  ): void {
    this._security_relevant_threshold = security_relevant_threshold;
  }

  static deserialize(reader: CBORReader, path: string[]): PoolVotingThresholds {
    let len = reader.readArrayTag(path);

    if (len != null && len < 5) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 5. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const motion_no_confidence_path = [
      ...path,
      "UnitInterval(motion_no_confidence)",
    ];
    let motion_no_confidence = UnitInterval.deserialize(
      reader,
      motion_no_confidence_path,
    );

    const committee_normal_path = [...path, "UnitInterval(committee_normal)"];
    let committee_normal = UnitInterval.deserialize(
      reader,
      committee_normal_path,
    );

    const committee_no_confidence_path = [
      ...path,
      "UnitInterval(committee_no_confidence)",
    ];
    let committee_no_confidence = UnitInterval.deserialize(
      reader,
      committee_no_confidence_path,
    );

    const hard_fork_initiation_path = [
      ...path,
      "UnitInterval(hard_fork_initiation)",
    ];
    let hard_fork_initiation = UnitInterval.deserialize(
      reader,
      hard_fork_initiation_path,
    );

    const security_relevant_threshold_path = [
      ...path,
      "UnitInterval(security_relevant_threshold)",
    ];
    let security_relevant_threshold = UnitInterval.deserialize(
      reader,
      security_relevant_threshold_path,
    );

    return new PoolVotingThresholds(
      motion_no_confidence,
      committee_normal,
      committee_no_confidence,
      hard_fork_initiation,
      security_relevant_threshold,
    );
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 5;

    writer.writeArrayTag(arrayLen);

    this._motion_no_confidence.serialize(writer);
    this._committee_normal.serialize(writer);
    this._committee_no_confidence.serialize(writer);
    this._hard_fork_initiation.serialize(writer);
    this._security_relevant_threshold.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["PoolVotingThresholds"],
  ): PoolVotingThresholds {
    let reader = new CBORReader(data);
    return PoolVotingThresholds.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["PoolVotingThresholds"],
  ): PoolVotingThresholds {
    return PoolVotingThresholds.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): PoolVotingThresholds {
    return PoolVotingThresholds.from_bytes(this.to_bytes(), path);
  }
}

export class PostAlonzoTransactionOutput {
  private _address: Address;
  private _amount: Value;
  private _datum_option: DataOption | undefined;
  private _script_ref: ScriptRef | undefined;

  constructor(
    address: Address,
    amount: Value,
    datum_option: DataOption | undefined,
    script_ref: ScriptRef | undefined,
  ) {
    this._address = address;
    this._amount = amount;
    this._datum_option = datum_option;
    this._script_ref = script_ref;
  }

  static new(
    address: Address,
    amount: Value,
    datum_option: DataOption | undefined,
    script_ref: ScriptRef | undefined,
  ) {
    return new PostAlonzoTransactionOutput(
      address,
      amount,
      datum_option,
      script_ref,
    );
  }

  address(): Address {
    return this._address;
  }

  set_address(address: Address): void {
    this._address = address;
  }

  amount(): Value {
    return this._amount;
  }

  set_amount(amount: Value): void {
    this._amount = amount;
  }

  datum_option(): DataOption | undefined {
    return this._datum_option;
  }

  set_datum_option(datum_option: DataOption | undefined): void {
    this._datum_option = datum_option;
  }

  script_ref(): ScriptRef | undefined {
    return this._script_ref;
  }

  set_script_ref(script_ref: ScriptRef | undefined): void {
    this._script_ref = script_ref;
  }

  static deserialize(
    reader: CBORReader,
    path: string[],
  ): PostAlonzoTransactionOutput {
    let fields: any = {};
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
      throw new Error(
        "Value not provided for field 0 (address) (at " + path.join("/") + ")",
      );
    let address = fields.address;
    if (fields.amount === undefined)
      throw new Error(
        "Value not provided for field 1 (amount) (at " + path.join("/") + ")",
      );
    let amount = fields.amount;

    let datum_option = fields.datum_option;

    let script_ref = fields.script_ref;

    return new PostAlonzoTransactionOutput(
      address,
      amount,
      datum_option,
      script_ref,
    );
  }

  serialize(writer: CBORWriter): void {
    let len = 4;
    if (this._datum_option === undefined) len -= 1;
    if (this._script_ref === undefined) len -= 1;
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
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["PostAlonzoTransactionOutput"],
  ): PostAlonzoTransactionOutput {
    let reader = new CBORReader(data);
    return PostAlonzoTransactionOutput.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["PostAlonzoTransactionOutput"],
  ): PostAlonzoTransactionOutput {
    return PostAlonzoTransactionOutput.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): PostAlonzoTransactionOutput {
    return PostAlonzoTransactionOutput.from_bytes(this.to_bytes(), path);
  }
}

export class PreBabbageTransactionOutput {
  private _address: Address;
  private _amount: Value;
  private _datum_hash: DataHash | undefined;

  constructor(
    address: Address,
    amount: Value,
    datum_hash: DataHash | undefined,
  ) {
    this._address = address;
    this._amount = amount;
    this._datum_hash = datum_hash;
  }

  static new(
    address: Address,
    amount: Value,
    datum_hash: DataHash | undefined,
  ) {
    return new PreBabbageTransactionOutput(address, amount, datum_hash);
  }

  address(): Address {
    return this._address;
  }

  set_address(address: Address): void {
    this._address = address;
  }

  amount(): Value {
    return this._amount;
  }

  set_amount(amount: Value): void {
    this._amount = amount;
  }

  datum_hash(): DataHash | undefined {
    return this._datum_hash;
  }

  set_datum_hash(datum_hash: DataHash | undefined): void {
    this._datum_hash = datum_hash;
  }

  static deserialize(
    reader: CBORReader,
    path: string[],
  ): PreBabbageTransactionOutput {
    let len = reader.readArrayTag(path);

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 2. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const address_path = [...path, "Address(address)"];
    let address = Address.deserialize(reader, address_path);

    const amount_path = [...path, "Value(amount)"];
    let amount = Value.deserialize(reader, amount_path);

    const datum_hash_path = [...path, "DataHash(datum_hash)"];
    let datum_hash =
      len != null && len > 2
        ? DataHash.deserialize(reader, datum_hash_path)
        : undefined;

    return new PreBabbageTransactionOutput(address, amount, datum_hash);
  }

  serialize(writer: CBORWriter): void {
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
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["PreBabbageTransactionOutput"],
  ): PreBabbageTransactionOutput {
    let reader = new CBORReader(data);
    return PreBabbageTransactionOutput.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["PreBabbageTransactionOutput"],
  ): PreBabbageTransactionOutput {
    return PreBabbageTransactionOutput.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): PreBabbageTransactionOutput {
    return PreBabbageTransactionOutput.from_bytes(this.to_bytes(), path);
  }
}

export class PrivateKey {
  private inner: Uint8Array;
  private options?: { isExtended: boolean };

  constructor(inner: Uint8Array, options?: { isExtended: boolean }) {
    this.inner = inner;
    this.options = options;
  }

  static new(inner: Uint8Array): PrivateKey {
    return new PrivateKey(inner);
  }

  as_bytes(): Uint8Array {
    return this.inner;
  }

  to_hex(): string {
    return bytesToHex(this.as_bytes());
  }

  static deserialize(reader: CBORReader, path: string[]): PrivateKey {
    return new PrivateKey(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
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

  static from_normal_bytes(bytes: Uint8Array): PrivateKey {
    if (bytes.length != PrivateKey._KEY_LEN)
      throw new Error(`Must be ${PrivateKey._KEY_LEN} bytes long`);
    return new PrivateKey(bytes, { isExtended: false });
  }

  static from_extended_bytes(bytes: Uint8Array): PrivateKey {
    if (bytes.length != PrivateKey._EXT_KEY_LEN)
      throw new Error(`Must be ${PrivateKey._EXT_KEY_LEN} bytes long`);
    return new PrivateKey(bytes, { isExtended: true });
  }

  to_bech32() {
    let prefix = this.options?.isExtended
      ? PrivateKey._EXT_BECH32_HRP
      : PrivateKey._BECH32_HRP;
    return bech32.encode(
      prefix,
      bech32.toWords(this.inner),
      Number.MAX_SAFE_INTEGER,
    );
  }

  static from_bech32(bech_str: string): PrivateKey {
    let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    if (decoded.prefix == PrivateKey._BECH32_HRP) {
      return PrivateKey.from_normal_bytes(bytes);
    } else if (decoded.prefix == PrivateKey._EXT_BECH32_HRP) {
      return PrivateKey.from_extended_bytes(bytes);
    } else {
      throw new Error("Invalid prefix for PrivateKey: " + decoded.prefix);
    }
  }

  static generate_ed25519(): PrivateKey {
    let bytes = cdlCrypto.getRandomBytes(PrivateKey._KEY_LEN);
    return PrivateKey.from_normal_bytes(bytes);
  }

  static generate_ed25519extended(): PrivateKey {
    let bytes = cdlCrypto.getRandomBytes(PrivateKey._EXT_KEY_LEN);
    return PrivateKey.from_extended_bytes(bytes);
  }

  sign(message: Uint8Array): Ed25519Signature {
    let sigBytes: Uint8Array;
    if (this.options?.isExtended) {
      sigBytes = cdlCrypto.signExtended(message, this.inner);
    } else {
      sigBytes = cdlCrypto.sign(message, this.inner);
    }
    return new Ed25519Signature(sigBytes);
  }

  to_public(): PublicKey {
    let pubkeyBytes: Uint8Array;
    if (this.options?.isExtended) {
      pubkeyBytes = cdlCrypto.secretToPubkey(this.inner);
    } else {
      pubkeyBytes = cdlCrypto.extendedToPubkey(this.inner);
    }
    return new PublicKey(pubkeyBytes);
  }

  static _from_bytes(bytes: Uint8Array): PrivateKey {
    if (bytes.length == PrivateKey._KEY_LEN) {
      return PrivateKey.from_normal_bytes(bytes);
    } else if (bytes.length == PrivateKey._EXT_KEY_LEN) {
      return PrivateKey.from_extended_bytes(bytes);
    } else {
      throw new Error("Invalid bytes length for PrivateKey: " + bytes.length);
    }
  }

  static from_hex(hex_str: string): PrivateKey {
    return PrivateKey._from_bytes(hexToBytes(hex_str));
  }
}

export class ProposedProtocolParameterUpdates {
  _items: [GenesisHash, ProtocolParamUpdate][];

  constructor(items: [GenesisHash, ProtocolParamUpdate][]) {
    this._items = items;
  }

  static new(): ProposedProtocolParameterUpdates {
    return new ProposedProtocolParameterUpdates([]);
  }

  len(): number {
    return this._items.length;
  }

  insert(
    key: GenesisHash,
    value: ProtocolParamUpdate,
  ): ProtocolParamUpdate | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this._items.push([key, value]);
    return undefined;
  }

  get(key: GenesisHash): ProtocolParamUpdate | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: GenesisHash[]): void {
    this._items = this._items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  keys(): GenesisHashes {
    let keys = GenesisHashes.new();
    for (let [key, _] of this._items) keys.add(key);
    return keys;
  }

  static deserialize(
    reader: CBORReader,
    path: string[],
  ): ProposedProtocolParameterUpdates {
    let ret = new ProposedProtocolParameterUpdates([]);
    reader.readMap(
      (reader, idx) =>
        ret.insert(
          GenesisHash.deserialize(reader, [...path, "GenesisHash#" + idx]),
          ProtocolParamUpdate.deserialize(reader, [
            ...path,
            "ProtocolParamUpdate#" + idx,
          ]),
        ),
      path,
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this._items, (writer, x) => {
      x[0].serialize(writer);
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["ProposedProtocolParameterUpdates"],
  ): ProposedProtocolParameterUpdates {
    let reader = new CBORReader(data);
    return ProposedProtocolParameterUpdates.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["ProposedProtocolParameterUpdates"],
  ): ProposedProtocolParameterUpdates {
    return ProposedProtocolParameterUpdates.from_bytes(
      hexToBytes(hex_str),
      path,
    );
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): ProposedProtocolParameterUpdates {
    return ProposedProtocolParameterUpdates.from_bytes(this.to_bytes(), path);
  }
}

export class ProtocolParamUpdate {
  private _minfee_a: BigNum | undefined;
  private _minfee_b: BigNum | undefined;
  private _max_block_body_size: number | undefined;
  private _max_tx_size: number | undefined;
  private _max_block_header_size: number | undefined;
  private _key_deposit: BigNum | undefined;
  private _pool_deposit: BigNum | undefined;
  private _max_epoch: number | undefined;
  private _n_opt: number | undefined;
  private _pool_pledge_influence: UnitInterval | undefined;
  private _expansion_rate: UnitInterval | undefined;
  private _treasury_growth_rate: UnitInterval | undefined;
  private _min_pool_cost: BigNum | undefined;
  private _ada_per_utxo_byte: BigNum | undefined;
  private _cost_models: Costmdls | undefined;
  private _execution_costs: ExUnitPrices | undefined;
  private _max_tx_ex_units: ExUnits | undefined;
  private _max_block_ex_units: ExUnits | undefined;
  private _max_value_size: number | undefined;
  private _collateral_percentage: number | undefined;
  private _max_collateral_inputs: number | undefined;
  private _pool_voting_thresholds: PoolVotingThresholds | undefined;
  private _drep_voting_thresholds: DRepVotingThresholds | undefined;
  private _min_committee_size: number | undefined;
  private _committee_term_limit: number | undefined;
  private _governance_action_validity_period: number | undefined;
  private _governance_action_deposit: BigNum | undefined;
  private _drep_deposit: BigNum | undefined;
  private _drep_inactivity_period: number | undefined;
  private _ref_script_coins_per_byte: UnitInterval | undefined;

  constructor(
    minfee_a: BigNum | undefined,
    minfee_b: BigNum | undefined,
    max_block_body_size: number | undefined,
    max_tx_size: number | undefined,
    max_block_header_size: number | undefined,
    key_deposit: BigNum | undefined,
    pool_deposit: BigNum | undefined,
    max_epoch: number | undefined,
    n_opt: number | undefined,
    pool_pledge_influence: UnitInterval | undefined,
    expansion_rate: UnitInterval | undefined,
    treasury_growth_rate: UnitInterval | undefined,
    min_pool_cost: BigNum | undefined,
    ada_per_utxo_byte: BigNum | undefined,
    cost_models: Costmdls | undefined,
    execution_costs: ExUnitPrices | undefined,
    max_tx_ex_units: ExUnits | undefined,
    max_block_ex_units: ExUnits | undefined,
    max_value_size: number | undefined,
    collateral_percentage: number | undefined,
    max_collateral_inputs: number | undefined,
    pool_voting_thresholds: PoolVotingThresholds | undefined,
    drep_voting_thresholds: DRepVotingThresholds | undefined,
    min_committee_size: number | undefined,
    committee_term_limit: number | undefined,
    governance_action_validity_period: number | undefined,
    governance_action_deposit: BigNum | undefined,
    drep_deposit: BigNum | undefined,
    drep_inactivity_period: number | undefined,
    ref_script_coins_per_byte: UnitInterval | undefined,
  ) {
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

  minfee_a(): BigNum | undefined {
    return this._minfee_a;
  }

  set_minfee_a(minfee_a: BigNum | undefined): void {
    this._minfee_a = minfee_a;
  }

  minfee_b(): BigNum | undefined {
    return this._minfee_b;
  }

  set_minfee_b(minfee_b: BigNum | undefined): void {
    this._minfee_b = minfee_b;
  }

  max_block_body_size(): number | undefined {
    return this._max_block_body_size;
  }

  set_max_block_body_size(max_block_body_size: number | undefined): void {
    this._max_block_body_size = max_block_body_size;
  }

  max_tx_size(): number | undefined {
    return this._max_tx_size;
  }

  set_max_tx_size(max_tx_size: number | undefined): void {
    this._max_tx_size = max_tx_size;
  }

  max_block_header_size(): number | undefined {
    return this._max_block_header_size;
  }

  set_max_block_header_size(max_block_header_size: number | undefined): void {
    this._max_block_header_size = max_block_header_size;
  }

  key_deposit(): BigNum | undefined {
    return this._key_deposit;
  }

  set_key_deposit(key_deposit: BigNum | undefined): void {
    this._key_deposit = key_deposit;
  }

  pool_deposit(): BigNum | undefined {
    return this._pool_deposit;
  }

  set_pool_deposit(pool_deposit: BigNum | undefined): void {
    this._pool_deposit = pool_deposit;
  }

  max_epoch(): number | undefined {
    return this._max_epoch;
  }

  set_max_epoch(max_epoch: number | undefined): void {
    this._max_epoch = max_epoch;
  }

  n_opt(): number | undefined {
    return this._n_opt;
  }

  set_n_opt(n_opt: number | undefined): void {
    this._n_opt = n_opt;
  }

  pool_pledge_influence(): UnitInterval | undefined {
    return this._pool_pledge_influence;
  }

  set_pool_pledge_influence(
    pool_pledge_influence: UnitInterval | undefined,
  ): void {
    this._pool_pledge_influence = pool_pledge_influence;
  }

  expansion_rate(): UnitInterval | undefined {
    return this._expansion_rate;
  }

  set_expansion_rate(expansion_rate: UnitInterval | undefined): void {
    this._expansion_rate = expansion_rate;
  }

  treasury_growth_rate(): UnitInterval | undefined {
    return this._treasury_growth_rate;
  }

  set_treasury_growth_rate(
    treasury_growth_rate: UnitInterval | undefined,
  ): void {
    this._treasury_growth_rate = treasury_growth_rate;
  }

  min_pool_cost(): BigNum | undefined {
    return this._min_pool_cost;
  }

  set_min_pool_cost(min_pool_cost: BigNum | undefined): void {
    this._min_pool_cost = min_pool_cost;
  }

  ada_per_utxo_byte(): BigNum | undefined {
    return this._ada_per_utxo_byte;
  }

  set_ada_per_utxo_byte(ada_per_utxo_byte: BigNum | undefined): void {
    this._ada_per_utxo_byte = ada_per_utxo_byte;
  }

  cost_models(): Costmdls | undefined {
    return this._cost_models;
  }

  set_cost_models(cost_models: Costmdls | undefined): void {
    this._cost_models = cost_models;
  }

  execution_costs(): ExUnitPrices | undefined {
    return this._execution_costs;
  }

  set_execution_costs(execution_costs: ExUnitPrices | undefined): void {
    this._execution_costs = execution_costs;
  }

  max_tx_ex_units(): ExUnits | undefined {
    return this._max_tx_ex_units;
  }

  set_max_tx_ex_units(max_tx_ex_units: ExUnits | undefined): void {
    this._max_tx_ex_units = max_tx_ex_units;
  }

  max_block_ex_units(): ExUnits | undefined {
    return this._max_block_ex_units;
  }

  set_max_block_ex_units(max_block_ex_units: ExUnits | undefined): void {
    this._max_block_ex_units = max_block_ex_units;
  }

  max_value_size(): number | undefined {
    return this._max_value_size;
  }

  set_max_value_size(max_value_size: number | undefined): void {
    this._max_value_size = max_value_size;
  }

  collateral_percentage(): number | undefined {
    return this._collateral_percentage;
  }

  set_collateral_percentage(collateral_percentage: number | undefined): void {
    this._collateral_percentage = collateral_percentage;
  }

  max_collateral_inputs(): number | undefined {
    return this._max_collateral_inputs;
  }

  set_max_collateral_inputs(max_collateral_inputs: number | undefined): void {
    this._max_collateral_inputs = max_collateral_inputs;
  }

  pool_voting_thresholds(): PoolVotingThresholds | undefined {
    return this._pool_voting_thresholds;
  }

  set_pool_voting_thresholds(
    pool_voting_thresholds: PoolVotingThresholds | undefined,
  ): void {
    this._pool_voting_thresholds = pool_voting_thresholds;
  }

  drep_voting_thresholds(): DRepVotingThresholds | undefined {
    return this._drep_voting_thresholds;
  }

  set_drep_voting_thresholds(
    drep_voting_thresholds: DRepVotingThresholds | undefined,
  ): void {
    this._drep_voting_thresholds = drep_voting_thresholds;
  }

  min_committee_size(): number | undefined {
    return this._min_committee_size;
  }

  set_min_committee_size(min_committee_size: number | undefined): void {
    this._min_committee_size = min_committee_size;
  }

  committee_term_limit(): number | undefined {
    return this._committee_term_limit;
  }

  set_committee_term_limit(committee_term_limit: number | undefined): void {
    this._committee_term_limit = committee_term_limit;
  }

  governance_action_validity_period(): number | undefined {
    return this._governance_action_validity_period;
  }

  set_governance_action_validity_period(
    governance_action_validity_period: number | undefined,
  ): void {
    this._governance_action_validity_period = governance_action_validity_period;
  }

  governance_action_deposit(): BigNum | undefined {
    return this._governance_action_deposit;
  }

  set_governance_action_deposit(
    governance_action_deposit: BigNum | undefined,
  ): void {
    this._governance_action_deposit = governance_action_deposit;
  }

  drep_deposit(): BigNum | undefined {
    return this._drep_deposit;
  }

  set_drep_deposit(drep_deposit: BigNum | undefined): void {
    this._drep_deposit = drep_deposit;
  }

  drep_inactivity_period(): number | undefined {
    return this._drep_inactivity_period;
  }

  set_drep_inactivity_period(drep_inactivity_period: number | undefined): void {
    this._drep_inactivity_period = drep_inactivity_period;
  }

  ref_script_coins_per_byte(): UnitInterval | undefined {
    return this._ref_script_coins_per_byte;
  }

  set_ref_script_coins_per_byte(
    ref_script_coins_per_byte: UnitInterval | undefined,
  ): void {
    this._ref_script_coins_per_byte = ref_script_coins_per_byte;
  }

  static deserialize(reader: CBORReader, path: string[]): ProtocolParamUpdate {
    let fields: any = {};
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
          fields.pool_voting_thresholds = PoolVotingThresholds.deserialize(
            r,
            new_path,
          );
          break;
        }

        case 26: {
          const new_path = [
            ...path,
            "DRepVotingThresholds(drep_voting_thresholds)",
          ];
          fields.drep_voting_thresholds = DRepVotingThresholds.deserialize(
            r,
            new_path,
          );
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
          fields.governance_action_validity_period = Number(
            r.readInt(new_path),
          );
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
          fields.ref_script_coins_per_byte = UnitInterval.deserialize(
            r,
            new_path,
          );
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

    let governance_action_validity_period =
      fields.governance_action_validity_period;

    let governance_action_deposit = fields.governance_action_deposit;

    let drep_deposit = fields.drep_deposit;

    let drep_inactivity_period = fields.drep_inactivity_period;

    let ref_script_coins_per_byte = fields.ref_script_coins_per_byte;

    return new ProtocolParamUpdate(
      minfee_a,
      minfee_b,
      max_block_body_size,
      max_tx_size,
      max_block_header_size,
      key_deposit,
      pool_deposit,
      max_epoch,
      n_opt,
      pool_pledge_influence,
      expansion_rate,
      treasury_growth_rate,
      min_pool_cost,
      ada_per_utxo_byte,
      cost_models,
      execution_costs,
      max_tx_ex_units,
      max_block_ex_units,
      max_value_size,
      collateral_percentage,
      max_collateral_inputs,
      pool_voting_thresholds,
      drep_voting_thresholds,
      min_committee_size,
      committee_term_limit,
      governance_action_validity_period,
      governance_action_deposit,
      drep_deposit,
      drep_inactivity_period,
      ref_script_coins_per_byte,
    );
  }

  serialize(writer: CBORWriter): void {
    let len = 30;
    if (this._minfee_a === undefined) len -= 1;
    if (this._minfee_b === undefined) len -= 1;
    if (this._max_block_body_size === undefined) len -= 1;
    if (this._max_tx_size === undefined) len -= 1;
    if (this._max_block_header_size === undefined) len -= 1;
    if (this._key_deposit === undefined) len -= 1;
    if (this._pool_deposit === undefined) len -= 1;
    if (this._max_epoch === undefined) len -= 1;
    if (this._n_opt === undefined) len -= 1;
    if (this._pool_pledge_influence === undefined) len -= 1;
    if (this._expansion_rate === undefined) len -= 1;
    if (this._treasury_growth_rate === undefined) len -= 1;
    if (this._min_pool_cost === undefined) len -= 1;
    if (this._ada_per_utxo_byte === undefined) len -= 1;
    if (this._cost_models === undefined) len -= 1;
    if (this._execution_costs === undefined) len -= 1;
    if (this._max_tx_ex_units === undefined) len -= 1;
    if (this._max_block_ex_units === undefined) len -= 1;
    if (this._max_value_size === undefined) len -= 1;
    if (this._collateral_percentage === undefined) len -= 1;
    if (this._max_collateral_inputs === undefined) len -= 1;
    if (this._pool_voting_thresholds === undefined) len -= 1;
    if (this._drep_voting_thresholds === undefined) len -= 1;
    if (this._min_committee_size === undefined) len -= 1;
    if (this._committee_term_limit === undefined) len -= 1;
    if (this._governance_action_validity_period === undefined) len -= 1;
    if (this._governance_action_deposit === undefined) len -= 1;
    if (this._drep_deposit === undefined) len -= 1;
    if (this._drep_inactivity_period === undefined) len -= 1;
    if (this._ref_script_coins_per_byte === undefined) len -= 1;
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
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["ProtocolParamUpdate"],
  ): ProtocolParamUpdate {
    let reader = new CBORReader(data);
    return ProtocolParamUpdate.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["ProtocolParamUpdate"],
  ): ProtocolParamUpdate {
    return ProtocolParamUpdate.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): ProtocolParamUpdate {
    return ProtocolParamUpdate.from_bytes(this.to_bytes(), path);
  }

  static new(): ProtocolParamUpdate {
    return new ProtocolParamUpdate(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );
  }
}

export class ProtocolVersion {
  private _major: number;
  private _minor: number;

  constructor(major: number, minor: number) {
    this._major = major;
    this._minor = minor;
  }

  static new(major: number, minor: number) {
    return new ProtocolVersion(major, minor);
  }

  major(): number {
    return this._major;
  }

  set_major(major: number): void {
    this._major = major;
  }

  minor(): number {
    return this._minor;
  }

  set_minor(minor: number): void {
    this._minor = minor;
  }

  static deserialize(reader: CBORReader, path: string[]): ProtocolVersion {
    let len = reader.readArrayTag(path);

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 2. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const major_path = [...path, "number(major)"];
    let major = Number(reader.readInt(major_path));

    const minor_path = [...path, "number(minor)"];
    let minor = Number(reader.readInt(minor_path));

    return new ProtocolVersion(major, minor);
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 2;

    writer.writeArrayTag(arrayLen);

    writer.writeInt(BigInt(this._major));
    writer.writeInt(BigInt(this._minor));
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["ProtocolVersion"],
  ): ProtocolVersion {
    let reader = new CBORReader(data);
    return ProtocolVersion.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["ProtocolVersion"],
  ): ProtocolVersion {
    return ProtocolVersion.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): ProtocolVersion {
    return ProtocolVersion.from_bytes(this.to_bytes(), path);
  }
}

export class PublicKey {
  private inner: Uint8Array;

  constructor(inner: Uint8Array) {
    if (inner.length != 32) throw new Error("Expected length to be 32");
    this.inner = inner;
  }

  static new(inner: Uint8Array): PublicKey {
    return new PublicKey(inner);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): PublicKey {
    return new PublicKey(data);
  }

  static from_hex(hex_str: string): PublicKey {
    return PublicKey.from_bytes(hexToBytes(hex_str));
  }

  as_bytes(): Uint8Array {
    return this.inner;
  }

  to_hex(): string {
    return bytesToHex(this.as_bytes());
  }

  clone(): PublicKey {
    return PublicKey.from_bytes(this.as_bytes());
  }

  static deserialize(reader: CBORReader, path: string[]): PublicKey {
    return new PublicKey(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }

  static _BECH32_HRP = "ed25519_pk";

  hash(): Ed25519KeyHash {
    return new Ed25519KeyHash(cdlCrypto.blake2b224(this.inner));
  }

  verify(data: Uint8Array, signature: Ed25519Signature): boolean {
    return cdlCrypto.verify(data, signature.to_bytes(), this.inner);
  }

  static from_bech32(bech_str: string): PublicKey {
    let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    if (decoded.prefix == PublicKey._BECH32_HRP) {
      return new PublicKey(bytes);
    } else {
      throw new Error("Invalid prefix for PublicKey: " + decoded.prefix);
    }
  }

  to_bech32() {
    let prefix = PublicKey._BECH32_HRP;
    return bech32.encode(
      prefix,
      bech32.toWords(this.inner),
      Number.MAX_SAFE_INTEGER,
    );
  }
}

export class Redeemer {
  private inner: RedeemersArrayItem;

  constructor(inner: RedeemersArrayItem) {
    this.inner = inner;
  }

  redeemerArrayItem(): RedeemersArrayItem {
    return this.inner;
  }

  static deserialize(reader: CBORReader, path: string[]): Redeemer {
    return new Redeemer(RedeemersArrayItem.deserialize(reader, path));
  }

  serialize(writer: CBORWriter): void {
    this.inner.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["Redeemer"]): Redeemer {
    let reader = new CBORReader(data);
    return Redeemer.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["Redeemer"]): Redeemer {
    return Redeemer.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Redeemer {
    return Redeemer.from_bytes(this.to_bytes(), path);
  }

  static new(
    tag: RedeemerTag,
    index: BigNum,
    data: PlutusData,
    ex_units: ExUnits,
  ) {
    return new Redeemer(new RedeemersArrayItem(tag, index, data, ex_units));
  }
}

export enum RedeemerTagKind {
  spending = 0,
  minting = 1,
  certifying = 2,
  rewarding = 3,
  voting = 4,
  proposing = 5,
}

export class RedeemerTag {
  private kind_: RedeemerTagKind;

  constructor(kind: RedeemerTagKind) {
    this.kind_ = kind;
  }

  static new_spending(): RedeemerTag {
    return new RedeemerTag(0);
  }

  static new_minting(): RedeemerTag {
    return new RedeemerTag(1);
  }

  static new_certifying(): RedeemerTag {
    return new RedeemerTag(2);
  }

  static new_rewarding(): RedeemerTag {
    return new RedeemerTag(3);
  }

  static new_voting(): RedeemerTag {
    return new RedeemerTag(4);
  }

  static new_proposing(): RedeemerTag {
    return new RedeemerTag(5);
  }
  kind(): RedeemerTagKind {
    return this.kind_;
  }

  static deserialize(reader: CBORReader, path: string[]): RedeemerTag {
    let kind = Number(reader.readInt(path));
    if (kind == 0) return new RedeemerTag(0);
    if (kind == 1) return new RedeemerTag(1);
    if (kind == 2) return new RedeemerTag(2);
    if (kind == 3) return new RedeemerTag(3);
    if (kind == 4) return new RedeemerTag(4);
    if (kind == 5) return new RedeemerTag(5);
    throw (
      "Unrecognized enum value: " +
      kind +
      " for " +
      RedeemerTag +
      "(at " +
      path.join("/") +
      ")"
    );
  }

  serialize(writer: CBORWriter): void {
    writer.writeInt(BigInt(this.kind_));
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["RedeemerTag"],
  ): RedeemerTag {
    let reader = new CBORReader(data);
    return RedeemerTag.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["RedeemerTag"],
  ): RedeemerTag {
    return RedeemerTag.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): RedeemerTag {
    return RedeemerTag.from_bytes(this.to_bytes(), path);
  }
}

export enum RedeemersKind {
  RedeemersArray = 0,
  RedeemersMap = 1,
}

export type RedeemersVariant =
  | { kind: 0; value: RedeemersArray }
  | { kind: 1; value: RedeemersMap };

export class Redeemers {
  private variant: RedeemersVariant;

  constructor(variant: RedeemersVariant) {
    this.variant = variant;
  }

  static new_redeemers_array(redeemers_array: RedeemersArray): Redeemers {
    return new Redeemers({ kind: 0, value: redeemers_array });
  }

  static new_redeemers_map(redeemers_map: RedeemersMap): Redeemers {
    return new Redeemers({ kind: 1, value: redeemers_map });
  }

  as_redeemers_array(): RedeemersArray {
    if (this.variant.kind == 0) return this.variant.value;
    throw new Error("Incorrect cast");
  }

  as_redeemers_map(): RedeemersMap {
    if (this.variant.kind == 1) return this.variant.value;
    throw new Error("Incorrect cast");
  }

  kind(): RedeemersKind {
    return this.variant.kind;
  }

  static deserialize(reader: CBORReader, path: string[]): Redeemers {
    let tag = reader.peekType(path);
    let variant: RedeemersVariant;

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
        throw new Error(
          "Unexpected subtype for Redeemers: " +
            tag +
            "(at " +
            path.join("/") +
            ")",
        );
    }

    return new Redeemers(variant);
  }

  serialize(writer: CBORWriter): void {
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
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["Redeemers"],
  ): Redeemers {
    let reader = new CBORReader(data);
    return Redeemers.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["Redeemers"]): Redeemers {
    return Redeemers.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Redeemers {
    return Redeemers.from_bytes(this.to_bytes(), path);
  }

  total_ex_units(): ExUnits {
    let mems = BigNum.zero(),
      steps = BigNum.zero();
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
          const item = this.variant.value.get(keys.get(i)) as RedeemersValue;
          mems = mems.checked_add(item.ex_units().mem());
          steps = steps.checked_add(item.ex_units().steps());
        }
        break;
      }
    }
    return ExUnits.new(mems, steps);
  }

  static new(): Redeemers {
    return Redeemers.new_redeemers_map(RedeemersMap.new());
  }

  len(): number {
    return this.variant.value.len();
  }

  add(elem: Redeemer): void {
    switch (this.variant.kind) {
      case 0:
        this.variant.value.add(elem.redeemerArrayItem());
        break;
      case 1: {
        const r = elem.redeemerArrayItem();
        this.variant.value.insert(
          RedeemersKey.new(r.tag(), r.index()),
          RedeemersValue.new(r.data(), r.ex_units()),
        );
        break;
      }
    }
  }

  get(index: number): Redeemer {
    switch (this.variant.kind) {
      case 0:
        return new Redeemer(this.variant.value.get(index));
      case 1: {
        const key = this.variant.value.keys().get(index);
        const r = this.variant.value.get(key);
        if (r === undefined) {
          throw "Unexpected undefined key in Redeemers";
        } else {
          return new Redeemer(
            RedeemersArrayItem.new(
              key.tag(),
              key.index(),
              r.data(),
              r.ex_units(),
            ),
          );
        }
      }
    }
  }
}

export class RedeemersArray {
  private items: RedeemersArrayItem[];
  private definiteEncoding: boolean;

  constructor(items: RedeemersArrayItem[], definiteEncoding: boolean = true) {
    this.items = items;
    this.definiteEncoding = definiteEncoding;
  }

  static new(): RedeemersArray {
    return new RedeemersArray([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): RedeemersArrayItem {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: RedeemersArrayItem): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader, path: string[]): RedeemersArray {
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) =>
        RedeemersArrayItem.deserialize(reader, [...path, "Elem#" + idx]),
      path,
    );
    return new RedeemersArray(items, definiteEncoding);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["RedeemersArray"],
  ): RedeemersArray {
    let reader = new CBORReader(data);
    return RedeemersArray.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["RedeemersArray"],
  ): RedeemersArray {
    return RedeemersArray.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): RedeemersArray {
    return RedeemersArray.from_bytes(this.to_bytes(), path);
  }
}

export class RedeemersArrayItem {
  private _tag: RedeemerTag;
  private _index: BigNum;
  private _data: PlutusData;
  private _ex_units: ExUnits;

  constructor(
    tag: RedeemerTag,
    index: BigNum,
    data: PlutusData,
    ex_units: ExUnits,
  ) {
    this._tag = tag;
    this._index = index;
    this._data = data;
    this._ex_units = ex_units;
  }

  static new(
    tag: RedeemerTag,
    index: BigNum,
    data: PlutusData,
    ex_units: ExUnits,
  ) {
    return new RedeemersArrayItem(tag, index, data, ex_units);
  }

  tag(): RedeemerTag {
    return this._tag;
  }

  set_tag(tag: RedeemerTag): void {
    this._tag = tag;
  }

  index(): BigNum {
    return this._index;
  }

  set_index(index: BigNum): void {
    this._index = index;
  }

  data(): PlutusData {
    return this._data;
  }

  set_data(data: PlutusData): void {
    this._data = data;
  }

  ex_units(): ExUnits {
    return this._ex_units;
  }

  set_ex_units(ex_units: ExUnits): void {
    this._ex_units = ex_units;
  }

  static deserialize(reader: CBORReader, path: string[]): RedeemersArrayItem {
    let len = reader.readArrayTag(path);

    if (len != null && len < 4) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 4. Received " +
          len +
          "(at " +
          path.join("/"),
      );
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

  serialize(writer: CBORWriter): void {
    let arrayLen = 4;

    writer.writeArrayTag(arrayLen);

    this._tag.serialize(writer);
    this._index.serialize(writer);
    this._data.serialize(writer);
    this._ex_units.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["RedeemersArrayItem"],
  ): RedeemersArrayItem {
    let reader = new CBORReader(data);
    return RedeemersArrayItem.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["RedeemersArrayItem"],
  ): RedeemersArrayItem {
    return RedeemersArrayItem.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): RedeemersArrayItem {
    return RedeemersArrayItem.from_bytes(this.to_bytes(), path);
  }
}

export class RedeemersKey {
  private _tag: RedeemerTag;
  private _index: BigNum;

  constructor(tag: RedeemerTag, index: BigNum) {
    this._tag = tag;
    this._index = index;
  }

  static new(tag: RedeemerTag, index: BigNum) {
    return new RedeemersKey(tag, index);
  }

  tag(): RedeemerTag {
    return this._tag;
  }

  set_tag(tag: RedeemerTag): void {
    this._tag = tag;
  }

  index(): BigNum {
    return this._index;
  }

  set_index(index: BigNum): void {
    this._index = index;
  }

  static deserialize(reader: CBORReader, path: string[]): RedeemersKey {
    let len = reader.readArrayTag(path);

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 2. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const tag_path = [...path, "RedeemerTag(tag)"];
    let tag = RedeemerTag.deserialize(reader, tag_path);

    const index_path = [...path, "BigNum(index)"];
    let index = BigNum.deserialize(reader, index_path);

    return new RedeemersKey(tag, index);
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 2;

    writer.writeArrayTag(arrayLen);

    this._tag.serialize(writer);
    this._index.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["RedeemersKey"],
  ): RedeemersKey {
    let reader = new CBORReader(data);
    return RedeemersKey.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["RedeemersKey"],
  ): RedeemersKey {
    return RedeemersKey.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): RedeemersKey {
    return RedeemersKey.from_bytes(this.to_bytes(), path);
  }
}

export class RedeemersKeys {
  private items: RedeemersKey[];
  private definiteEncoding: boolean;

  constructor(items: RedeemersKey[], definiteEncoding: boolean = true) {
    this.items = items;
    this.definiteEncoding = definiteEncoding;
  }

  static new(): RedeemersKeys {
    return new RedeemersKeys([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): RedeemersKey {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: RedeemersKey): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader, path: string[]): RedeemersKeys {
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) =>
        RedeemersKey.deserialize(reader, [...path, "Elem#" + idx]),
      path,
    );
    return new RedeemersKeys(items, definiteEncoding);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["RedeemersKeys"],
  ): RedeemersKeys {
    let reader = new CBORReader(data);
    return RedeemersKeys.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["RedeemersKeys"],
  ): RedeemersKeys {
    return RedeemersKeys.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): RedeemersKeys {
    return RedeemersKeys.from_bytes(this.to_bytes(), path);
  }
}

export class RedeemersMap {
  _items: [RedeemersKey, RedeemersValue][];

  constructor(items: [RedeemersKey, RedeemersValue][]) {
    this._items = items;
  }

  static new(): RedeemersMap {
    return new RedeemersMap([]);
  }

  len(): number {
    return this._items.length;
  }

  insert(key: RedeemersKey, value: RedeemersValue): RedeemersValue | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this._items.push([key, value]);
    return undefined;
  }

  get(key: RedeemersKey): RedeemersValue | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: RedeemersKey[]): void {
    this._items = this._items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  keys(): RedeemersKeys {
    let keys = RedeemersKeys.new();
    for (let [key, _] of this._items) keys.add(key);
    return keys;
  }

  static deserialize(reader: CBORReader, path: string[]): RedeemersMap {
    let ret = new RedeemersMap([]);
    reader.readMap(
      (reader, idx) =>
        ret.insert(
          RedeemersKey.deserialize(reader, [...path, "RedeemersKey#" + idx]),
          RedeemersValue.deserialize(reader, [
            ...path,
            "RedeemersValue#" + idx,
          ]),
        ),
      path,
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this._items, (writer, x) => {
      x[0].serialize(writer);
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["RedeemersMap"],
  ): RedeemersMap {
    let reader = new CBORReader(data);
    return RedeemersMap.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["RedeemersMap"],
  ): RedeemersMap {
    return RedeemersMap.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): RedeemersMap {
    return RedeemersMap.from_bytes(this.to_bytes(), path);
  }
}

export class RedeemersValue {
  private _data: PlutusData;
  private _ex_units: ExUnits;

  constructor(data: PlutusData, ex_units: ExUnits) {
    this._data = data;
    this._ex_units = ex_units;
  }

  static new(data: PlutusData, ex_units: ExUnits) {
    return new RedeemersValue(data, ex_units);
  }

  data(): PlutusData {
    return this._data;
  }

  set_data(data: PlutusData): void {
    this._data = data;
  }

  ex_units(): ExUnits {
    return this._ex_units;
  }

  set_ex_units(ex_units: ExUnits): void {
    this._ex_units = ex_units;
  }

  static deserialize(reader: CBORReader, path: string[]): RedeemersValue {
    let len = reader.readArrayTag(path);

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 2. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const data_path = [...path, "PlutusData(data)"];
    let data = PlutusData.deserialize(reader, data_path);

    const ex_units_path = [...path, "ExUnits(ex_units)"];
    let ex_units = ExUnits.deserialize(reader, ex_units_path);

    return new RedeemersValue(data, ex_units);
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 2;

    writer.writeArrayTag(arrayLen);

    this._data.serialize(writer);
    this._ex_units.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["RedeemersValue"],
  ): RedeemersValue {
    let reader = new CBORReader(data);
    return RedeemersValue.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["RedeemersValue"],
  ): RedeemersValue {
    return RedeemersValue.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): RedeemersValue {
    return RedeemersValue.from_bytes(this.to_bytes(), path);
  }
}

export class RegCert {
  private _stake_credential: Credential;
  private _coin: BigNum;

  constructor(stake_credential: Credential, coin: BigNum) {
    this._stake_credential = stake_credential;
    this._coin = coin;
  }

  static new(stake_credential: Credential, coin: BigNum) {
    return new RegCert(stake_credential, coin);
  }

  stake_credential(): Credential {
    return this._stake_credential;
  }

  set_stake_credential(stake_credential: Credential): void {
    this._stake_credential = stake_credential;
  }

  coin(): BigNum {
    return this._coin;
  }

  set_coin(coin: BigNum): void {
    this._coin = coin;
  }

  static deserialize(reader: CBORReader, path: string[]): RegCert {
    let stake_credential = Credential.deserialize(reader, [
      ...path,
      "stake_credential",
    ]);

    let coin = BigNum.deserialize(reader, [...path, "coin"]);

    return new RegCert(stake_credential, coin);
  }

  serialize(writer: CBORWriter): void {
    this._stake_credential.serialize(writer);
    this._coin.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["RegCert"]): RegCert {
    let reader = new CBORReader(data);
    return RegCert.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["RegCert"]): RegCert {
    return RegCert.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): RegCert {
    return RegCert.from_bytes(this.to_bytes(), path);
  }
}

export enum RelayKind {
  SingleHostAddr = 0,
  SingleHostName = 1,
  MultiHostName = 2,
}

export type RelayVariant =
  | { kind: 0; value: SingleHostAddr }
  | { kind: 1; value: SingleHostName }
  | { kind: 2; value: MultiHostName };

export class Relay {
  private variant: RelayVariant;

  constructor(variant: RelayVariant) {
    this.variant = variant;
  }

  static new_single_host_addr(single_host_addr: SingleHostAddr): Relay {
    return new Relay({ kind: 0, value: single_host_addr });
  }

  static new_single_host_name(single_host_name: SingleHostName): Relay {
    return new Relay({ kind: 1, value: single_host_name });
  }

  static new_multi_host_name(multi_host_name: MultiHostName): Relay {
    return new Relay({ kind: 2, value: multi_host_name });
  }

  as_single_host_addr(): SingleHostAddr | undefined {
    if (this.variant.kind == 0) return this.variant.value;
  }

  as_single_host_name(): SingleHostName | undefined {
    if (this.variant.kind == 1) return this.variant.value;
  }

  as_multi_host_name(): MultiHostName | undefined {
    if (this.variant.kind == 2) return this.variant.value;
  }

  kind(): RelayKind {
    return this.variant.kind;
  }

  static deserialize(reader: CBORReader, path: string[]): Relay {
    let len = reader.readArrayTag(path);
    let tag = Number(reader.readUint(path));
    let variant: RelayVariant;

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
        throw new Error(
          "Unexpected tag for Relay: " + tag + "(at " + path.join("/") + ")",
        );
    }

    if (len == null) {
      reader.readBreak();
    }

    return new Relay(variant);
  }

  serialize(writer: CBORWriter): void {
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
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["Relay"]): Relay {
    let reader = new CBORReader(data);
    return Relay.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["Relay"]): Relay {
    return Relay.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Relay {
    return Relay.from_bytes(this.to_bytes(), path);
  }
}

export class Relays {
  private items: Relay[];
  private definiteEncoding: boolean;

  constructor(items: Relay[], definiteEncoding: boolean = true) {
    this.items = items;
    this.definiteEncoding = definiteEncoding;
  }

  static new(): Relays {
    return new Relays([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): Relay {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: Relay): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader, path: string[]): Relays {
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) => Relay.deserialize(reader, [...path, "Elem#" + idx]),
      path,
    );
    return new Relays(items, definiteEncoding);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["Relays"]): Relays {
    let reader = new CBORReader(data);
    return Relays.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["Relays"]): Relays {
    return Relays.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Relays {
    return Relays.from_bytes(this.to_bytes(), path);
  }
}

export class RewardAddresses {
  private items: RewardAddress[];
  private definiteEncoding: boolean;

  constructor(items: RewardAddress[], definiteEncoding: boolean = true) {
    this.items = items;
    this.definiteEncoding = definiteEncoding;
  }

  static new(): RewardAddresses {
    return new RewardAddresses([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): RewardAddress {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: RewardAddress): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader, path: string[]): RewardAddresses {
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) =>
        RewardAddress.deserialize(reader, [...path, "Elem#" + idx]),
      path,
    );
    return new RewardAddresses(items, definiteEncoding);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["RewardAddresses"],
  ): RewardAddresses {
    let reader = new CBORReader(data);
    return RewardAddresses.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["RewardAddresses"],
  ): RewardAddresses {
    return RewardAddresses.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): RewardAddresses {
    return RewardAddresses.from_bytes(this.to_bytes(), path);
  }
}

export class ScriptAll {
  private _native_scripts: NativeScripts;

  constructor(native_scripts: NativeScripts) {
    this._native_scripts = native_scripts;
  }

  static new(native_scripts: NativeScripts) {
    return new ScriptAll(native_scripts);
  }

  native_scripts(): NativeScripts {
    return this._native_scripts;
  }

  set_native_scripts(native_scripts: NativeScripts): void {
    this._native_scripts = native_scripts;
  }

  static deserialize(reader: CBORReader, path: string[]): ScriptAll {
    let native_scripts = NativeScripts.deserialize(reader, [
      ...path,
      "native_scripts",
    ]);

    return new ScriptAll(native_scripts);
  }

  serialize(writer: CBORWriter): void {
    this._native_scripts.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["ScriptAll"],
  ): ScriptAll {
    let reader = new CBORReader(data);
    return ScriptAll.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["ScriptAll"]): ScriptAll {
    return ScriptAll.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): ScriptAll {
    return ScriptAll.from_bytes(this.to_bytes(), path);
  }
}

export class ScriptAny {
  private _native_scripts: NativeScripts;

  constructor(native_scripts: NativeScripts) {
    this._native_scripts = native_scripts;
  }

  static new(native_scripts: NativeScripts) {
    return new ScriptAny(native_scripts);
  }

  native_scripts(): NativeScripts {
    return this._native_scripts;
  }

  set_native_scripts(native_scripts: NativeScripts): void {
    this._native_scripts = native_scripts;
  }

  static deserialize(reader: CBORReader, path: string[]): ScriptAny {
    let native_scripts = NativeScripts.deserialize(reader, [
      ...path,
      "native_scripts",
    ]);

    return new ScriptAny(native_scripts);
  }

  serialize(writer: CBORWriter): void {
    this._native_scripts.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["ScriptAny"],
  ): ScriptAny {
    let reader = new CBORReader(data);
    return ScriptAny.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["ScriptAny"]): ScriptAny {
    return ScriptAny.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): ScriptAny {
    return ScriptAny.from_bytes(this.to_bytes(), path);
  }
}

export class ScriptDataHash {
  private inner: Uint8Array;

  constructor(inner: Uint8Array) {
    if (inner.length != 32) throw new Error("Expected length to be 32");
    this.inner = inner;
  }

  static new(inner: Uint8Array): ScriptDataHash {
    return new ScriptDataHash(inner);
  }

  static from_bech32(bech_str: string): ScriptDataHash {
    let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new ScriptDataHash(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): ScriptDataHash {
    return new ScriptDataHash(data);
  }

  static from_hex(hex_str: string): ScriptDataHash {
    return ScriptDataHash.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    return this.inner;
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): ScriptDataHash {
    return ScriptDataHash.from_bytes(this.to_bytes());
  }

  static deserialize(reader: CBORReader, path: string[]): ScriptDataHash {
    return new ScriptDataHash(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }
}

export class ScriptHash {
  private inner: Uint8Array;

  constructor(inner: Uint8Array) {
    if (inner.length != 28) throw new Error("Expected length to be 28");
    this.inner = inner;
  }

  static new(inner: Uint8Array): ScriptHash {
    return new ScriptHash(inner);
  }

  static from_bech32(bech_str: string): ScriptHash {
    let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new ScriptHash(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): ScriptHash {
    return new ScriptHash(data);
  }

  static from_hex(hex_str: string): ScriptHash {
    return ScriptHash.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    return this.inner;
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): ScriptHash {
    return ScriptHash.from_bytes(this.to_bytes());
  }

  static deserialize(reader: CBORReader, path: string[]): ScriptHash {
    return new ScriptHash(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }
}

export class ScriptHashes {
  private items: ScriptHash[];
  private definiteEncoding: boolean;

  constructor(items: ScriptHash[], definiteEncoding: boolean = true) {
    this.items = items;
    this.definiteEncoding = definiteEncoding;
  }

  static new(): ScriptHashes {
    return new ScriptHashes([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): ScriptHash {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: ScriptHash): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader, path: string[]): ScriptHashes {
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) => ScriptHash.deserialize(reader, [...path, "Elem#" + idx]),
      path,
    );
    return new ScriptHashes(items, definiteEncoding);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["ScriptHashes"],
  ): ScriptHashes {
    let reader = new CBORReader(data);
    return ScriptHashes.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["ScriptHashes"],
  ): ScriptHashes {
    return ScriptHashes.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): ScriptHashes {
    return ScriptHashes.from_bytes(this.to_bytes(), path);
  }
}

export class ScriptNOfK {
  private _n: number;
  private _native_scripts: NativeScripts;

  constructor(n: number, native_scripts: NativeScripts) {
    this._n = n;
    this._native_scripts = native_scripts;
  }

  static new(n: number, native_scripts: NativeScripts) {
    return new ScriptNOfK(n, native_scripts);
  }

  n(): number {
    return this._n;
  }

  set_n(n: number): void {
    this._n = n;
  }

  native_scripts(): NativeScripts {
    return this._native_scripts;
  }

  set_native_scripts(native_scripts: NativeScripts): void {
    this._native_scripts = native_scripts;
  }

  static deserialize(reader: CBORReader, path: string[]): ScriptNOfK {
    let n = Number(reader.readInt([...path, "n"]));

    let native_scripts = NativeScripts.deserialize(reader, [
      ...path,
      "native_scripts",
    ]);

    return new ScriptNOfK(n, native_scripts);
  }

  serialize(writer: CBORWriter): void {
    writer.writeInt(BigInt(this._n));
    this._native_scripts.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["ScriptNOfK"],
  ): ScriptNOfK {
    let reader = new CBORReader(data);
    return ScriptNOfK.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["ScriptNOfK"],
  ): ScriptNOfK {
    return ScriptNOfK.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): ScriptNOfK {
    return ScriptNOfK.from_bytes(this.to_bytes(), path);
  }
}

export class ScriptPubkey {
  private inner: Ed25519KeyHash;

  constructor(inner: Ed25519KeyHash) {
    this.inner = inner;
  }

  static new(inner: Ed25519KeyHash): ScriptPubkey {
    return new ScriptPubkey(inner);
  }

  addr_keyhash(): Ed25519KeyHash {
    return this.inner;
  }

  static deserialize(reader: CBORReader, path: string[]): ScriptPubkey {
    return new ScriptPubkey(Ed25519KeyHash.deserialize(reader, path));
  }

  serialize(writer: CBORWriter): void {
    this.inner.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["ScriptPubkey"],
  ): ScriptPubkey {
    let reader = new CBORReader(data);
    return ScriptPubkey.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["ScriptPubkey"],
  ): ScriptPubkey {
    return ScriptPubkey.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): ScriptPubkey {
    return ScriptPubkey.from_bytes(this.to_bytes(), path);
  }
}

export class ScriptPubname {
  private _addr_keyhash: Ed25519KeyHash;

  constructor(addr_keyhash: Ed25519KeyHash) {
    this._addr_keyhash = addr_keyhash;
  }

  static new(addr_keyhash: Ed25519KeyHash) {
    return new ScriptPubname(addr_keyhash);
  }

  addr_keyhash(): Ed25519KeyHash {
    return this._addr_keyhash;
  }

  set_addr_keyhash(addr_keyhash: Ed25519KeyHash): void {
    this._addr_keyhash = addr_keyhash;
  }

  static deserialize(reader: CBORReader, path: string[]): ScriptPubname {
    let addr_keyhash = Ed25519KeyHash.deserialize(reader, [
      ...path,
      "addr_keyhash",
    ]);

    return new ScriptPubname(addr_keyhash);
  }

  serialize(writer: CBORWriter): void {
    this._addr_keyhash.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["ScriptPubname"],
  ): ScriptPubname {
    let reader = new CBORReader(data);
    return ScriptPubname.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["ScriptPubname"],
  ): ScriptPubname {
    return ScriptPubname.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): ScriptPubname {
    return ScriptPubname.from_bytes(this.to_bytes(), path);
  }
}

export enum ScriptRefKind {
  NativeScript = 0,
  PlutusScriptV1 = 1,
  PlutusScriptV2 = 2,
  PlutusScriptV3 = 3,
}

export type ScriptRefVariant =
  | { kind: 0; value: NativeScript }
  | { kind: 1; value: PlutusScript }
  | { kind: 2; value: PlutusScript }
  | { kind: 3; value: PlutusScript };

export class ScriptRef {
  private variant: ScriptRefVariant;

  constructor(variant: ScriptRefVariant) {
    this.variant = variant;
  }

  static new_native_script(native_script: NativeScript): ScriptRef {
    return new ScriptRef({ kind: 0, value: native_script });
  }

  static new_plutus_script_v1(plutus_script_v1: PlutusScript): ScriptRef {
    return new ScriptRef({ kind: 1, value: plutus_script_v1 });
  }

  static new_plutus_script_v2(plutus_script_v2: PlutusScript): ScriptRef {
    return new ScriptRef({ kind: 2, value: plutus_script_v2 });
  }

  static new_plutus_script_v3(plutus_script_v3: PlutusScript): ScriptRef {
    return new ScriptRef({ kind: 3, value: plutus_script_v3 });
  }

  as_native_script(): NativeScript | undefined {
    if (this.variant.kind == 0) return this.variant.value;
  }

  as_plutus_script_v1(): PlutusScript | undefined {
    if (this.variant.kind == 1) return this.variant.value;
  }

  as_plutus_script_v2(): PlutusScript | undefined {
    if (this.variant.kind == 2) return this.variant.value;
  }

  as_plutus_script_v3(): PlutusScript | undefined {
    if (this.variant.kind == 3) return this.variant.value;
  }

  kind(): ScriptRefKind {
    return this.variant.kind;
  }

  static deserializeInner(reader: CBORReader, path: string[]): ScriptRef {
    let len = reader.readArrayTag(path);
    let tag = Number(reader.readUint(path));
    let variant: ScriptRefVariant;

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
        throw new Error(
          "Unexpected tag for ScriptRef: " +
            tag +
            "(at " +
            path.join("/") +
            ")",
        );
    }

    if (len == null) {
      reader.readBreak();
    }

    return new ScriptRef(variant);
  }

  serializeInner(writer: CBORWriter): void {
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
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["ScriptRef"],
  ): ScriptRef {
    let reader = new CBORReader(data);
    return ScriptRef.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["ScriptRef"]): ScriptRef {
    return ScriptRef.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): ScriptRef {
    return ScriptRef.from_bytes(this.to_bytes(), path);
  }

  static deserialize(reader: CBORReader, path: string[]): ScriptRef {
    const tag = reader.readTaggedTag(path);
    if (tag != 24) {
      throw new Error(
        "Expected a CBOR encoded item when deserializing ScriptRef (at " +
          path.join("/") +
          ")",
      );
    }
    let bytes = reader.readBytes(path);
    let new_reader = new CBORReader(bytes);

    return ScriptRef.deserializeInner(new_reader, path);
  }

  serialize(writer: CBORWriter): void {
    writer.writeTaggedTag(24);

    let bytes_writer = new CBORWriter();
    this.serializeInner(bytes_writer);
    let bytes = bytes_writer.getBytes();

    writer.writeBytes(bytes);
  }
}

export class SingleHostAddr {
  private _port: number | undefined;
  private _ipv4: Ipv4 | undefined;
  private _ipv6: Ipv6 | undefined;

  constructor(
    port: number | undefined,
    ipv4: Ipv4 | undefined,
    ipv6: Ipv6 | undefined,
  ) {
    this._port = port;
    this._ipv4 = ipv4;
    this._ipv6 = ipv6;
  }

  static new(
    port: number | undefined,
    ipv4: Ipv4 | undefined,
    ipv6: Ipv6 | undefined,
  ) {
    return new SingleHostAddr(port, ipv4, ipv6);
  }

  port(): number | undefined {
    return this._port;
  }

  set_port(port: number | undefined): void {
    this._port = port;
  }

  ipv4(): Ipv4 | undefined {
    return this._ipv4;
  }

  set_ipv4(ipv4: Ipv4 | undefined): void {
    this._ipv4 = ipv4;
  }

  ipv6(): Ipv6 | undefined {
    return this._ipv6;
  }

  set_ipv6(ipv6: Ipv6 | undefined): void {
    this._ipv6 = ipv6;
  }

  static deserialize(reader: CBORReader, path: string[]): SingleHostAddr {
    let port =
      reader.readNullable((r) => Number(r.readInt([...path, "port"])), path) ??
      undefined;

    let ipv4 =
      reader.readNullable(
        (r) => Ipv4.deserialize(r, [...path, "ipv4"]),
        path,
      ) ?? undefined;

    let ipv6 =
      reader.readNullable(
        (r) => Ipv6.deserialize(r, [...path, "ipv6"]),
        path,
      ) ?? undefined;

    return new SingleHostAddr(port, ipv4, ipv6);
  }

  serialize(writer: CBORWriter): void {
    if (this._port == null) {
      writer.writeNull();
    } else {
      writer.writeInt(BigInt(this._port));
    }
    if (this._ipv4 == null) {
      writer.writeNull();
    } else {
      this._ipv4.serialize(writer);
    }
    if (this._ipv6 == null) {
      writer.writeNull();
    } else {
      this._ipv6.serialize(writer);
    }
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["SingleHostAddr"],
  ): SingleHostAddr {
    let reader = new CBORReader(data);
    return SingleHostAddr.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["SingleHostAddr"],
  ): SingleHostAddr {
    return SingleHostAddr.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): SingleHostAddr {
    return SingleHostAddr.from_bytes(this.to_bytes(), path);
  }
}

export class SingleHostName {
  private _port: number | undefined;
  private _dns_name: DNSRecordAorAAAA;

  constructor(port: number | undefined, dns_name: DNSRecordAorAAAA) {
    this._port = port;
    this._dns_name = dns_name;
  }

  static new(port: number | undefined, dns_name: DNSRecordAorAAAA) {
    return new SingleHostName(port, dns_name);
  }

  port(): number | undefined {
    return this._port;
  }

  set_port(port: number | undefined): void {
    this._port = port;
  }

  dns_name(): DNSRecordAorAAAA {
    return this._dns_name;
  }

  set_dns_name(dns_name: DNSRecordAorAAAA): void {
    this._dns_name = dns_name;
  }

  static deserialize(reader: CBORReader, path: string[]): SingleHostName {
    let port =
      reader.readNullable((r) => Number(r.readInt([...path, "port"])), path) ??
      undefined;

    let dns_name = DNSRecordAorAAAA.deserialize(reader, [...path, "dns_name"]);

    return new SingleHostName(port, dns_name);
  }

  serialize(writer: CBORWriter): void {
    if (this._port == null) {
      writer.writeNull();
    } else {
      writer.writeInt(BigInt(this._port));
    }
    this._dns_name.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["SingleHostName"],
  ): SingleHostName {
    let reader = new CBORReader(data);
    return SingleHostName.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["SingleHostName"],
  ): SingleHostName {
    return SingleHostName.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): SingleHostName {
    return SingleHostName.from_bytes(this.to_bytes(), path);
  }
}

export class StakeAndVoteDelegation {
  private _stake_credential: Credential;
  private _pool_keyhash: Ed25519KeyHash;
  private _drep: DRep;

  constructor(
    stake_credential: Credential,
    pool_keyhash: Ed25519KeyHash,
    drep: DRep,
  ) {
    this._stake_credential = stake_credential;
    this._pool_keyhash = pool_keyhash;
    this._drep = drep;
  }

  static new(
    stake_credential: Credential,
    pool_keyhash: Ed25519KeyHash,
    drep: DRep,
  ) {
    return new StakeAndVoteDelegation(stake_credential, pool_keyhash, drep);
  }

  stake_credential(): Credential {
    return this._stake_credential;
  }

  set_stake_credential(stake_credential: Credential): void {
    this._stake_credential = stake_credential;
  }

  pool_keyhash(): Ed25519KeyHash {
    return this._pool_keyhash;
  }

  set_pool_keyhash(pool_keyhash: Ed25519KeyHash): void {
    this._pool_keyhash = pool_keyhash;
  }

  drep(): DRep {
    return this._drep;
  }

  set_drep(drep: DRep): void {
    this._drep = drep;
  }

  static deserialize(
    reader: CBORReader,
    path: string[],
  ): StakeAndVoteDelegation {
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

  serialize(writer: CBORWriter): void {
    this._stake_credential.serialize(writer);
    this._pool_keyhash.serialize(writer);
    this._drep.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["StakeAndVoteDelegation"],
  ): StakeAndVoteDelegation {
    let reader = new CBORReader(data);
    return StakeAndVoteDelegation.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["StakeAndVoteDelegation"],
  ): StakeAndVoteDelegation {
    return StakeAndVoteDelegation.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): StakeAndVoteDelegation {
    return StakeAndVoteDelegation.from_bytes(this.to_bytes(), path);
  }
}

export class StakeDelegation {
  private _stake_credential: Credential;
  private _pool_keyhash: Ed25519KeyHash;

  constructor(stake_credential: Credential, pool_keyhash: Ed25519KeyHash) {
    this._stake_credential = stake_credential;
    this._pool_keyhash = pool_keyhash;
  }

  static new(stake_credential: Credential, pool_keyhash: Ed25519KeyHash) {
    return new StakeDelegation(stake_credential, pool_keyhash);
  }

  stake_credential(): Credential {
    return this._stake_credential;
  }

  set_stake_credential(stake_credential: Credential): void {
    this._stake_credential = stake_credential;
  }

  pool_keyhash(): Ed25519KeyHash {
    return this._pool_keyhash;
  }

  set_pool_keyhash(pool_keyhash: Ed25519KeyHash): void {
    this._pool_keyhash = pool_keyhash;
  }

  static deserialize(reader: CBORReader, path: string[]): StakeDelegation {
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

  serialize(writer: CBORWriter): void {
    this._stake_credential.serialize(writer);
    this._pool_keyhash.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["StakeDelegation"],
  ): StakeDelegation {
    let reader = new CBORReader(data);
    return StakeDelegation.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["StakeDelegation"],
  ): StakeDelegation {
    return StakeDelegation.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): StakeDelegation {
    return StakeDelegation.from_bytes(this.to_bytes(), path);
  }
}

export class StakeDeregistration {
  private _stake_credential: Credential;

  constructor(stake_credential: Credential) {
    this._stake_credential = stake_credential;
  }

  static new(stake_credential: Credential) {
    return new StakeDeregistration(stake_credential);
  }

  stake_credential(): Credential {
    return this._stake_credential;
  }

  set_stake_credential(stake_credential: Credential): void {
    this._stake_credential = stake_credential;
  }

  static deserialize(reader: CBORReader, path: string[]): StakeDeregistration {
    let stake_credential = Credential.deserialize(reader, [
      ...path,
      "stake_credential",
    ]);

    return new StakeDeregistration(stake_credential);
  }

  serialize(writer: CBORWriter): void {
    this._stake_credential.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["StakeDeregistration"],
  ): StakeDeregistration {
    let reader = new CBORReader(data);
    return StakeDeregistration.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["StakeDeregistration"],
  ): StakeDeregistration {
    return StakeDeregistration.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): StakeDeregistration {
    return StakeDeregistration.from_bytes(this.to_bytes(), path);
  }
}

export class StakeRegistration {
  private _stake_credential: Credential;

  constructor(stake_credential: Credential) {
    this._stake_credential = stake_credential;
  }

  static new(stake_credential: Credential) {
    return new StakeRegistration(stake_credential);
  }

  stake_credential(): Credential {
    return this._stake_credential;
  }

  set_stake_credential(stake_credential: Credential): void {
    this._stake_credential = stake_credential;
  }

  static deserialize(reader: CBORReader, path: string[]): StakeRegistration {
    let stake_credential = Credential.deserialize(reader, [
      ...path,
      "stake_credential",
    ]);

    return new StakeRegistration(stake_credential);
  }

  serialize(writer: CBORWriter): void {
    this._stake_credential.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["StakeRegistration"],
  ): StakeRegistration {
    let reader = new CBORReader(data);
    return StakeRegistration.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["StakeRegistration"],
  ): StakeRegistration {
    return StakeRegistration.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): StakeRegistration {
    return StakeRegistration.from_bytes(this.to_bytes(), path);
  }
}

export class StakeRegistrationAndDelegation {
  private _stake_credential: Credential;
  private _pool_keyhash: Ed25519KeyHash;
  private _coin: BigNum;

  constructor(
    stake_credential: Credential,
    pool_keyhash: Ed25519KeyHash,
    coin: BigNum,
  ) {
    this._stake_credential = stake_credential;
    this._pool_keyhash = pool_keyhash;
    this._coin = coin;
  }

  static new(
    stake_credential: Credential,
    pool_keyhash: Ed25519KeyHash,
    coin: BigNum,
  ) {
    return new StakeRegistrationAndDelegation(
      stake_credential,
      pool_keyhash,
      coin,
    );
  }

  stake_credential(): Credential {
    return this._stake_credential;
  }

  set_stake_credential(stake_credential: Credential): void {
    this._stake_credential = stake_credential;
  }

  pool_keyhash(): Ed25519KeyHash {
    return this._pool_keyhash;
  }

  set_pool_keyhash(pool_keyhash: Ed25519KeyHash): void {
    this._pool_keyhash = pool_keyhash;
  }

  coin(): BigNum {
    return this._coin;
  }

  set_coin(coin: BigNum): void {
    this._coin = coin;
  }

  static deserialize(
    reader: CBORReader,
    path: string[],
  ): StakeRegistrationAndDelegation {
    let stake_credential = Credential.deserialize(reader, [
      ...path,
      "stake_credential",
    ]);

    let pool_keyhash = Ed25519KeyHash.deserialize(reader, [
      ...path,
      "pool_keyhash",
    ]);

    let coin = BigNum.deserialize(reader, [...path, "coin"]);

    return new StakeRegistrationAndDelegation(
      stake_credential,
      pool_keyhash,
      coin,
    );
  }

  serialize(writer: CBORWriter): void {
    this._stake_credential.serialize(writer);
    this._pool_keyhash.serialize(writer);
    this._coin.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["StakeRegistrationAndDelegation"],
  ): StakeRegistrationAndDelegation {
    let reader = new CBORReader(data);
    return StakeRegistrationAndDelegation.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["StakeRegistrationAndDelegation"],
  ): StakeRegistrationAndDelegation {
    return StakeRegistrationAndDelegation.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): StakeRegistrationAndDelegation {
    return StakeRegistrationAndDelegation.from_bytes(this.to_bytes(), path);
  }
}

export class StakeVoteRegistrationAndDelegation {
  private _stake_credential: Credential;
  private _pool_keyhash: Ed25519KeyHash;
  private _drep: DRep;
  private _coin: BigNum;

  constructor(
    stake_credential: Credential,
    pool_keyhash: Ed25519KeyHash,
    drep: DRep,
    coin: BigNum,
  ) {
    this._stake_credential = stake_credential;
    this._pool_keyhash = pool_keyhash;
    this._drep = drep;
    this._coin = coin;
  }

  static new(
    stake_credential: Credential,
    pool_keyhash: Ed25519KeyHash,
    drep: DRep,
    coin: BigNum,
  ) {
    return new StakeVoteRegistrationAndDelegation(
      stake_credential,
      pool_keyhash,
      drep,
      coin,
    );
  }

  stake_credential(): Credential {
    return this._stake_credential;
  }

  set_stake_credential(stake_credential: Credential): void {
    this._stake_credential = stake_credential;
  }

  pool_keyhash(): Ed25519KeyHash {
    return this._pool_keyhash;
  }

  set_pool_keyhash(pool_keyhash: Ed25519KeyHash): void {
    this._pool_keyhash = pool_keyhash;
  }

  drep(): DRep {
    return this._drep;
  }

  set_drep(drep: DRep): void {
    this._drep = drep;
  }

  coin(): BigNum {
    return this._coin;
  }

  set_coin(coin: BigNum): void {
    this._coin = coin;
  }

  static deserialize(
    reader: CBORReader,
    path: string[],
  ): StakeVoteRegistrationAndDelegation {
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

    return new StakeVoteRegistrationAndDelegation(
      stake_credential,
      pool_keyhash,
      drep,
      coin,
    );
  }

  serialize(writer: CBORWriter): void {
    this._stake_credential.serialize(writer);
    this._pool_keyhash.serialize(writer);
    this._drep.serialize(writer);
    this._coin.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["StakeVoteRegistrationAndDelegation"],
  ): StakeVoteRegistrationAndDelegation {
    let reader = new CBORReader(data);
    return StakeVoteRegistrationAndDelegation.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["StakeVoteRegistrationAndDelegation"],
  ): StakeVoteRegistrationAndDelegation {
    return StakeVoteRegistrationAndDelegation.from_bytes(
      hexToBytes(hex_str),
      path,
    );
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): StakeVoteRegistrationAndDelegation {
    return StakeVoteRegistrationAndDelegation.from_bytes(this.to_bytes(), path);
  }
}

export class TimelockExpiry {
  private _slot: BigNum;

  constructor(slot: BigNum) {
    this._slot = slot;
  }

  static new_timelockexpiry(slot: BigNum) {
    return new TimelockExpiry(slot);
  }

  slot_bignum(): BigNum {
    return this._slot;
  }

  set_slot(slot: BigNum): void {
    this._slot = slot;
  }

  static deserialize(reader: CBORReader, path: string[]): TimelockExpiry {
    let slot = BigNum.deserialize(reader, [...path, "slot"]);

    return new TimelockExpiry(slot);
  }

  serialize(writer: CBORWriter): void {
    this._slot.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["TimelockExpiry"],
  ): TimelockExpiry {
    let reader = new CBORReader(data);
    return TimelockExpiry.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["TimelockExpiry"],
  ): TimelockExpiry {
    return TimelockExpiry.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): TimelockExpiry {
    return TimelockExpiry.from_bytes(this.to_bytes(), path);
  }

  slot(): number {
    return this.slot_bignum()._to_number();
  }

  static new(slot: number): TimelockExpiry {
    return new TimelockExpiry(BigNum._from_number(slot));
  }
}

export class TimelockStart {
  private _slot: BigNum;

  constructor(slot: BigNum) {
    this._slot = slot;
  }

  static new_timelockstart(slot: BigNum) {
    return new TimelockStart(slot);
  }

  slot_bignum(): BigNum {
    return this._slot;
  }

  set_slot(slot: BigNum): void {
    this._slot = slot;
  }

  static deserialize(reader: CBORReader, path: string[]): TimelockStart {
    let slot = BigNum.deserialize(reader, [...path, "slot"]);

    return new TimelockStart(slot);
  }

  serialize(writer: CBORWriter): void {
    this._slot.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["TimelockStart"],
  ): TimelockStart {
    let reader = new CBORReader(data);
    return TimelockStart.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["TimelockStart"],
  ): TimelockStart {
    return TimelockStart.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): TimelockStart {
    return TimelockStart.from_bytes(this.to_bytes(), path);
  }

  slot(): number {
    return this.slot_bignum()._to_number();
  }

  static new(slot: number): TimelockStart {
    return new TimelockStart(BigNum._from_number(slot));
  }
}

export class Transaction {
  private _body: TransactionBody;
  private _witness_set: TransactionWitnessSet;
  private _is_valid: boolean;
  private _auxiliary_data: AuxiliaryData | undefined;

  constructor(
    body: TransactionBody,
    witness_set: TransactionWitnessSet,
    is_valid: boolean,
    auxiliary_data: AuxiliaryData | undefined,
  ) {
    this._body = body;
    this._witness_set = witness_set;
    this._is_valid = is_valid;
    this._auxiliary_data = auxiliary_data;
  }

  body(): TransactionBody {
    return this._body;
  }

  set_body(body: TransactionBody): void {
    this._body = body;
  }

  witness_set(): TransactionWitnessSet {
    return this._witness_set;
  }

  set_witness_set(witness_set: TransactionWitnessSet): void {
    this._witness_set = witness_set;
  }

  is_valid(): boolean {
    return this._is_valid;
  }

  set_is_valid(is_valid: boolean): void {
    this._is_valid = is_valid;
  }

  auxiliary_data(): AuxiliaryData | undefined {
    return this._auxiliary_data;
  }

  set_auxiliary_data(auxiliary_data: AuxiliaryData | undefined): void {
    this._auxiliary_data = auxiliary_data;
  }

  static deserialize(reader: CBORReader, path: string[]): Transaction {
    let len = reader.readArrayTag(path);

    if (len != null && len < 4) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 4. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const body_path = [...path, "TransactionBody(body)"];
    let body = TransactionBody.deserialize(reader, body_path);

    const witness_set_path = [...path, "TransactionWitnessSet(witness_set)"];
    let witness_set = TransactionWitnessSet.deserialize(
      reader,
      witness_set_path,
    );

    const is_valid_path = [...path, "boolean(is_valid)"];
    let is_valid = reader.readBoolean(is_valid_path);

    const auxiliary_data_path = [...path, "AuxiliaryData(auxiliary_data)"];
    let auxiliary_data =
      reader.readNullable(
        (r) => AuxiliaryData.deserialize(r, auxiliary_data_path),
        path,
      ) ?? undefined;

    return new Transaction(body, witness_set, is_valid, auxiliary_data);
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 4;

    writer.writeArrayTag(arrayLen);

    this._body.serialize(writer);
    this._witness_set.serialize(writer);
    writer.writeBoolean(this._is_valid);
    if (this._auxiliary_data == null) {
      writer.writeNull();
    } else {
      this._auxiliary_data.serialize(writer);
    }
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["Transaction"],
  ): Transaction {
    let reader = new CBORReader(data);
    return Transaction.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["Transaction"],
  ): Transaction {
    return Transaction.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Transaction {
    return Transaction.from_bytes(this.to_bytes(), path);
  }

  static new(
    body: TransactionBody,
    witness_set: TransactionWitnessSet,
    auxiliary_data: AuxiliaryData,
  ): Transaction {
    return new Transaction(body, witness_set, true, auxiliary_data);
  }
}

export class TransactionBodies {
  private items: TransactionBody[];
  private definiteEncoding: boolean;

  constructor(items: TransactionBody[], definiteEncoding: boolean = true) {
    this.items = items;
    this.definiteEncoding = definiteEncoding;
  }

  static new(): TransactionBodies {
    return new TransactionBodies([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): TransactionBody {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: TransactionBody): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader, path: string[]): TransactionBodies {
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) =>
        TransactionBody.deserialize(reader, [...path, "Elem#" + idx]),
      path,
    );
    return new TransactionBodies(items, definiteEncoding);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["TransactionBodies"],
  ): TransactionBodies {
    let reader = new CBORReader(data);
    return TransactionBodies.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["TransactionBodies"],
  ): TransactionBodies {
    return TransactionBodies.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): TransactionBodies {
    return TransactionBodies.from_bytes(this.to_bytes(), path);
  }
}

export class TransactionBody {
  private _inputs: TransactionInputs;
  private _outputs: TransactionOutputs;
  private _fee: BigNum;
  private _ttl: BigNum | undefined;
  private _certs: Certificates | undefined;
  private _withdrawals: Withdrawals | undefined;
  private _auxiliary_data_hash: AuxiliaryDataHash | undefined;
  private _validity_start_interval: BigNum | undefined;
  private _mint: Mint | undefined;
  private _script_data_hash: ScriptDataHash | undefined;
  private _collateral: TransactionInputs | undefined;
  private _required_signers: Ed25519KeyHashes | undefined;
  private _network_id: NetworkId | undefined;
  private _collateral_return: TransactionOutput | undefined;
  private _total_collateral: BigNum | undefined;
  private _reference_inputs: TransactionInputs | undefined;
  private _voting_procedures: VotingProcedures | undefined;
  private _voting_proposals: VotingProposals | undefined;
  private _current_treasury_value: BigNum | undefined;
  private _donation: BigNum | undefined;

  constructor(
    inputs: TransactionInputs,
    outputs: TransactionOutputs,
    fee: BigNum,
    ttl: BigNum | undefined,
    certs: Certificates | undefined,
    withdrawals: Withdrawals | undefined,
    auxiliary_data_hash: AuxiliaryDataHash | undefined,
    validity_start_interval: BigNum | undefined,
    mint: Mint | undefined,
    script_data_hash: ScriptDataHash | undefined,
    collateral: TransactionInputs | undefined,
    required_signers: Ed25519KeyHashes | undefined,
    network_id: NetworkId | undefined,
    collateral_return: TransactionOutput | undefined,
    total_collateral: BigNum | undefined,
    reference_inputs: TransactionInputs | undefined,
    voting_procedures: VotingProcedures | undefined,
    voting_proposals: VotingProposals | undefined,
    current_treasury_value: BigNum | undefined,
    donation: BigNum | undefined,
  ) {
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

  inputs(): TransactionInputs {
    return this._inputs;
  }

  set_inputs(inputs: TransactionInputs): void {
    this._inputs = inputs;
  }

  outputs(): TransactionOutputs {
    return this._outputs;
  }

  set_outputs(outputs: TransactionOutputs): void {
    this._outputs = outputs;
  }

  fee(): BigNum {
    return this._fee;
  }

  set_fee(fee: BigNum): void {
    this._fee = fee;
  }

  ttl_bignum(): BigNum | undefined {
    return this._ttl;
  }

  set_ttl(ttl: BigNum | undefined): void {
    this._ttl = ttl;
  }

  certs(): Certificates | undefined {
    return this._certs;
  }

  set_certs(certs: Certificates | undefined): void {
    this._certs = certs;
  }

  withdrawals(): Withdrawals | undefined {
    return this._withdrawals;
  }

  set_withdrawals(withdrawals: Withdrawals | undefined): void {
    this._withdrawals = withdrawals;
  }

  auxiliary_data_hash(): AuxiliaryDataHash | undefined {
    return this._auxiliary_data_hash;
  }

  set_auxiliary_data_hash(
    auxiliary_data_hash: AuxiliaryDataHash | undefined,
  ): void {
    this._auxiliary_data_hash = auxiliary_data_hash;
  }

  validity_start_interval_bignum(): BigNum | undefined {
    return this._validity_start_interval;
  }

  set_validity_start_interval_bignum(
    validity_start_interval: BigNum | undefined,
  ): void {
    this._validity_start_interval = validity_start_interval;
  }

  mint(): Mint | undefined {
    return this._mint;
  }

  set_mint(mint: Mint | undefined): void {
    this._mint = mint;
  }

  script_data_hash(): ScriptDataHash | undefined {
    return this._script_data_hash;
  }

  set_script_data_hash(script_data_hash: ScriptDataHash | undefined): void {
    this._script_data_hash = script_data_hash;
  }

  collateral(): TransactionInputs | undefined {
    return this._collateral;
  }

  set_collateral(collateral: TransactionInputs | undefined): void {
    this._collateral = collateral;
  }

  required_signers(): Ed25519KeyHashes | undefined {
    return this._required_signers;
  }

  set_required_signers(required_signers: Ed25519KeyHashes | undefined): void {
    this._required_signers = required_signers;
  }

  network_id(): NetworkId | undefined {
    return this._network_id;
  }

  set_network_id(network_id: NetworkId | undefined): void {
    this._network_id = network_id;
  }

  collateral_return(): TransactionOutput | undefined {
    return this._collateral_return;
  }

  set_collateral_return(
    collateral_return: TransactionOutput | undefined,
  ): void {
    this._collateral_return = collateral_return;
  }

  total_collateral(): BigNum | undefined {
    return this._total_collateral;
  }

  set_total_collateral(total_collateral: BigNum | undefined): void {
    this._total_collateral = total_collateral;
  }

  reference_inputs(): TransactionInputs | undefined {
    return this._reference_inputs;
  }

  set_reference_inputs(reference_inputs: TransactionInputs | undefined): void {
    this._reference_inputs = reference_inputs;
  }

  voting_procedures(): VotingProcedures | undefined {
    return this._voting_procedures;
  }

  set_voting_procedures(voting_procedures: VotingProcedures | undefined): void {
    this._voting_procedures = voting_procedures;
  }

  voting_proposals(): VotingProposals | undefined {
    return this._voting_proposals;
  }

  set_voting_proposals(voting_proposals: VotingProposals | undefined): void {
    this._voting_proposals = voting_proposals;
  }

  current_treasury_value(): BigNum | undefined {
    return this._current_treasury_value;
  }

  set_current_treasury_value(current_treasury_value: BigNum | undefined): void {
    this._current_treasury_value = current_treasury_value;
  }

  donation(): BigNum | undefined {
    return this._donation;
  }

  set_donation(donation: BigNum | undefined): void {
    this._donation = donation;
  }

  static deserialize(reader: CBORReader, path: string[]): TransactionBody {
    let fields: any = {};
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
          fields.auxiliary_data_hash = AuxiliaryDataHash.deserialize(
            r,
            new_path,
          );
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
      throw new Error(
        "Value not provided for field 0 (inputs) (at " + path.join("/") + ")",
      );
    let inputs = fields.inputs;
    if (fields.outputs === undefined)
      throw new Error(
        "Value not provided for field 1 (outputs) (at " + path.join("/") + ")",
      );
    let outputs = fields.outputs;
    if (fields.fee === undefined)
      throw new Error(
        "Value not provided for field 2 (fee) (at " + path.join("/") + ")",
      );
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

    return new TransactionBody(
      inputs,
      outputs,
      fee,
      ttl,
      certs,
      withdrawals,
      auxiliary_data_hash,
      validity_start_interval,
      mint,
      script_data_hash,
      collateral,
      required_signers,
      network_id,
      collateral_return,
      total_collateral,
      reference_inputs,
      voting_procedures,
      voting_proposals,
      current_treasury_value,
      donation,
    );
  }

  serialize(writer: CBORWriter): void {
    let len = 20;
    if (this._ttl === undefined) len -= 1;
    if (this._certs === undefined) len -= 1;
    if (this._withdrawals === undefined) len -= 1;
    if (this._auxiliary_data_hash === undefined) len -= 1;
    if (this._validity_start_interval === undefined) len -= 1;
    if (this._mint === undefined) len -= 1;
    if (this._script_data_hash === undefined) len -= 1;
    if (this._collateral === undefined) len -= 1;
    if (this._required_signers === undefined) len -= 1;
    if (this._network_id === undefined) len -= 1;
    if (this._collateral_return === undefined) len -= 1;
    if (this._total_collateral === undefined) len -= 1;
    if (this._reference_inputs === undefined) len -= 1;
    if (this._voting_procedures === undefined) len -= 1;
    if (this._voting_proposals === undefined) len -= 1;
    if (this._current_treasury_value === undefined) len -= 1;
    if (this._donation === undefined) len -= 1;
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
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["TransactionBody"],
  ): TransactionBody {
    let reader = new CBORReader(data);
    return TransactionBody.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["TransactionBody"],
  ): TransactionBody {
    return TransactionBody.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): TransactionBody {
    return TransactionBody.from_bytes(this.to_bytes(), path);
  }

  ttl(): number | undefined {
    return this.ttl_bignum()?._to_number();
  }

  remove_ttl(): void {
    this.set_ttl(undefined);
  }

  validity_start_interval(): number | undefined {
    return this.validity_start_interval_bignum()?._to_number();
  }

  set_validity_start_interval(validity_start_interval: number) {
    return this.set_validity_start_interval_bignum(
      BigNum._from_number(validity_start_interval),
    );
  }

  static new(
    inputs: TransactionInputs,
    outputs: TransactionOutputs,
    fee: BigNum,
    path: string[] = ["TransactionBody"],
    ttl?: number,
  ): TransactionBody {
    return new TransactionBody(
      inputs.clone([...path, "TransactionInputs"]),
      outputs.clone([...path, "TransactionOutputs"]),
      fee,
      ttl != null ? BigNum._from_number(ttl) : undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );
  }

  static new_tx_body(
    inputs: TransactionInputs,
    outputs: TransactionOutputs,
    fee: BigNum,
    path: string[],
  ): TransactionBody {
    return TransactionBody.new(inputs, outputs, fee, path, undefined);
  }
}

export class TransactionHash {
  private inner: Uint8Array;

  constructor(inner: Uint8Array) {
    if (inner.length != 32) throw new Error("Expected length to be 32");
    this.inner = inner;
  }

  static new(inner: Uint8Array): TransactionHash {
    return new TransactionHash(inner);
  }

  static from_bech32(bech_str: string): TransactionHash {
    let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new TransactionHash(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): TransactionHash {
    return new TransactionHash(data);
  }

  static from_hex(hex_str: string): TransactionHash {
    return TransactionHash.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    return this.inner;
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): TransactionHash {
    return TransactionHash.from_bytes(this.to_bytes());
  }

  static deserialize(reader: CBORReader, path: string[]): TransactionHash {
    return new TransactionHash(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }
}

export class TransactionInput {
  private _transaction_id: TransactionHash;
  private _index: number;

  constructor(transaction_id: TransactionHash, index: number) {
    this._transaction_id = transaction_id;
    this._index = index;
  }

  static new(transaction_id: TransactionHash, index: number) {
    return new TransactionInput(transaction_id, index);
  }

  transaction_id(): TransactionHash {
    return this._transaction_id;
  }

  set_transaction_id(transaction_id: TransactionHash): void {
    this._transaction_id = transaction_id;
  }

  index(): number {
    return this._index;
  }

  set_index(index: number): void {
    this._index = index;
  }

  static deserialize(reader: CBORReader, path: string[]): TransactionInput {
    let len = reader.readArrayTag(path);

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 2. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const transaction_id_path = [...path, "TransactionHash(transaction_id)"];
    let transaction_id = TransactionHash.deserialize(
      reader,
      transaction_id_path,
    );

    const index_path = [...path, "number(index)"];
    let index = Number(reader.readInt(index_path));

    return new TransactionInput(transaction_id, index);
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 2;

    writer.writeArrayTag(arrayLen);

    this._transaction_id.serialize(writer);
    writer.writeInt(BigInt(this._index));
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["TransactionInput"],
  ): TransactionInput {
    let reader = new CBORReader(data);
    return TransactionInput.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["TransactionInput"],
  ): TransactionInput {
    return TransactionInput.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): TransactionInput {
    return TransactionInput.from_bytes(this.to_bytes(), path);
  }
}

export class TransactionInputs {
  private items: TransactionInput[];
  private definiteEncoding: boolean;
  private nonEmptyTag: boolean;

  private setItems(items: TransactionInput[]) {
    this.items = items;
  }

  constructor(definiteEncoding: boolean = true, nonEmptyTag: boolean = true) {
    this.items = [];
    this.definiteEncoding = definiteEncoding;
    this.nonEmptyTag = nonEmptyTag;
  }

  static new(): TransactionInputs {
    return new TransactionInputs();
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): TransactionInput {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: TransactionInput): boolean {
    if (this.contains(elem)) return true;
    this.items.push(elem);
    return false;
  }

  contains(elem: TransactionInput): boolean {
    for (let item of this.items) {
      if (arrayEq(item.to_bytes(), elem.to_bytes())) {
        return true;
      }
    }
    return false;
  }

  static deserialize(reader: CBORReader, path: string[]): TransactionInputs {
    let nonEmptyTag = false;
    if (reader.peekType(path) == "tagged") {
      let tag = reader.readTaggedTag(path);
      if (tag != 258) {
        throw new Error("Expected tag 258. Got " + tag);
      } else {
        nonEmptyTag = true;
      }
    }
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) =>
        TransactionInput.deserialize(reader, [
          ...path,
          "TransactionInput#" + idx,
        ]),
      path,
    );
    let ret = new TransactionInputs(definiteEncoding, nonEmptyTag);
    ret.setItems(items);
    return ret;
  }

  serialize(writer: CBORWriter): void {
    if (this.nonEmptyTag) {
      writer.writeTaggedTag(258);
    }
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["TransactionInputs"],
  ): TransactionInputs {
    let reader = new CBORReader(data);
    return TransactionInputs.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["TransactionInputs"],
  ): TransactionInputs {
    return TransactionInputs.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): TransactionInputs {
    return TransactionInputs.from_bytes(this.to_bytes(), path);
  }
}

export enum TransactionMetadatumKind {
  MetadataMap = 0,
  MetadataList = 1,
  Int = 2,
  Bytes = 3,
  Text = 4,
}

export type TransactionMetadatumVariant =
  | { kind: 0; value: MetadataMap }
  | { kind: 1; value: MetadataList }
  | { kind: 2; value: Int }
  | { kind: 3; value: Uint8Array }
  | { kind: 4; value: string };

export class TransactionMetadatum {
  private variant: TransactionMetadatumVariant;

  constructor(variant: TransactionMetadatumVariant) {
    this.variant = variant;
  }

  static new_map(map: MetadataMap): TransactionMetadatum {
    return new TransactionMetadatum({ kind: 0, value: map });
  }

  static new_list(list: MetadataList): TransactionMetadatum {
    return new TransactionMetadatum({ kind: 1, value: list });
  }

  static new_int(int: Int): TransactionMetadatum {
    return new TransactionMetadatum({ kind: 2, value: int });
  }

  static new_bytes(bytes: Uint8Array): TransactionMetadatum {
    return new TransactionMetadatum({ kind: 3, value: bytes });
  }

  static new_text(text: string): TransactionMetadatum {
    return new TransactionMetadatum({ kind: 4, value: text });
  }

  as_map(): MetadataMap {
    if (this.variant.kind == 0) return this.variant.value;
    throw new Error("Incorrect cast");
  }

  as_list(): MetadataList {
    if (this.variant.kind == 1) return this.variant.value;
    throw new Error("Incorrect cast");
  }

  as_int(): Int {
    if (this.variant.kind == 2) return this.variant.value;
    throw new Error("Incorrect cast");
  }

  as_bytes(): Uint8Array {
    if (this.variant.kind == 3) return this.variant.value;
    throw new Error("Incorrect cast");
  }

  as_text(): string {
    if (this.variant.kind == 4) return this.variant.value;
    throw new Error("Incorrect cast");
  }

  kind(): TransactionMetadatumKind {
    return this.variant.kind;
  }

  static deserialize(reader: CBORReader, path: string[]): TransactionMetadatum {
    let tag = reader.peekType(path);
    let variant: TransactionMetadatumVariant;

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
        throw new Error(
          "Unexpected subtype for TransactionMetadatum: " +
            tag +
            "(at " +
            path.join("/") +
            ")",
        );
    }

    return new TransactionMetadatum(variant);
  }

  serialize(writer: CBORWriter): void {
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
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["TransactionMetadatum"],
  ): TransactionMetadatum {
    let reader = new CBORReader(data);
    return TransactionMetadatum.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["TransactionMetadatum"],
  ): TransactionMetadatum {
    return TransactionMetadatum.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): TransactionMetadatum {
    return TransactionMetadatum.from_bytes(this.to_bytes(), path);
  }
}

export class TransactionMetadatumLabels {
  private items: BigNum[];
  private definiteEncoding: boolean;

  constructor(items: BigNum[], definiteEncoding: boolean = true) {
    this.items = items;
    this.definiteEncoding = definiteEncoding;
  }

  static new(): TransactionMetadatumLabels {
    return new TransactionMetadatumLabels([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): BigNum {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: BigNum): void {
    this.items.push(elem);
  }

  static deserialize(
    reader: CBORReader,
    path: string[],
  ): TransactionMetadatumLabels {
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) => BigNum.deserialize(reader, [...path, "Elem#" + idx]),
      path,
    );
    return new TransactionMetadatumLabels(items, definiteEncoding);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["TransactionMetadatumLabels"],
  ): TransactionMetadatumLabels {
    let reader = new CBORReader(data);
    return TransactionMetadatumLabels.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["TransactionMetadatumLabels"],
  ): TransactionMetadatumLabels {
    return TransactionMetadatumLabels.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): TransactionMetadatumLabels {
    return TransactionMetadatumLabels.from_bytes(this.to_bytes(), path);
  }
}

export enum TransactionOutputKind {
  PreBabbageTransactionOutput = 0,
  PostAlonzoTransactionOutput = 1,
}

export type TransactionOutputVariant =
  | { kind: 0; value: PreBabbageTransactionOutput }
  | { kind: 1; value: PostAlonzoTransactionOutput };

export class TransactionOutput {
  private variant: TransactionOutputVariant;

  constructor(variant: TransactionOutputVariant) {
    this.variant = variant;
  }

  static new_pre_babbage_transaction_output(
    pre_babbage_transaction_output: PreBabbageTransactionOutput,
  ): TransactionOutput {
    return new TransactionOutput({
      kind: 0,
      value: pre_babbage_transaction_output,
    });
  }

  static new_post_alonzo_transaction_output(
    post_alonzo_transaction_output: PostAlonzoTransactionOutput,
  ): TransactionOutput {
    return new TransactionOutput({
      kind: 1,
      value: post_alonzo_transaction_output,
    });
  }

  as_pre_babbage_transaction_output(): PreBabbageTransactionOutput {
    if (this.variant.kind == 0) return this.variant.value;
    throw new Error("Incorrect cast");
  }

  as_post_alonzo_transaction_output(): PostAlonzoTransactionOutput {
    if (this.variant.kind == 1) return this.variant.value;
    throw new Error("Incorrect cast");
  }

  kind(): TransactionOutputKind {
    return this.variant.kind;
  }

  static deserialize(reader: CBORReader, path: string[]): TransactionOutput {
    let tag = reader.peekType(path);
    let variant: TransactionOutputVariant;

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
        throw new Error(
          "Unexpected subtype for TransactionOutput: " +
            tag +
            "(at " +
            path.join("/") +
            ")",
        );
    }

    return new TransactionOutput(variant);
  }

  serialize(writer: CBORWriter): void {
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
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["TransactionOutput"],
  ): TransactionOutput {
    let reader = new CBORReader(data);
    return TransactionOutput.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["TransactionOutput"],
  ): TransactionOutput {
    return TransactionOutput.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): TransactionOutput {
    return TransactionOutput.from_bytes(this.to_bytes(), path);
  }

  static new(address: Address, amount: Value): TransactionOutput {
    const post_alonzo_transaction_output = new PostAlonzoTransactionOutput(
      address,
      amount,
      undefined,
      undefined,
    );
    return new TransactionOutput({
      kind: 1,
      value: post_alonzo_transaction_output,
    });
  }

  address(): Address {
    return this.variant.value.address();
  }

  set_address(address: Address): void {
    return this.variant.value.set_address(address);
  }

  amount(): Value {
    return this.variant.value.amount();
  }

  set_amount(amount: Value): void {
    this.variant.value.set_amount(amount);
  }

  data_hash(): DataHash | undefined {
    switch (this.variant.kind) {
      case 0:
        return this.as_pre_babbage_transaction_output().datum_hash();
      case 1:
        const opt = this.as_post_alonzo_transaction_output().datum_option();
        return opt?.as_hash();
    }
  }

  set_data_hash(data_hash: DataHash | undefined): void {
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
        } else {
          ato.set_datum_option(undefined);
        }
        this.variant = { kind: 1, value: ato };
        break;
    }
  }

  datum_option(): DataOption | undefined {
    switch (this.variant.kind) {
      case 0:
        return undefined;
      case 1:
        return this.as_post_alonzo_transaction_output().datum_option();
    }
  }

  set_datum_option(datum_option: DataOption | undefined): void {
    switch (this.variant.kind) {
      case 0:
        if (datum_option) {
          const pbt = this.as_pre_babbage_transaction_output();
          this.variant = {
            kind: 1,
            value: PostAlonzoTransactionOutput.new(
              pbt.address(),
              pbt.amount(),
              datum_option,
              undefined,
            ),
          };
        }
      case 1:
        let pat = this.as_post_alonzo_transaction_output();
        pat.set_datum_option(datum_option);
        this.variant = { kind: 1, value: pat };
    }
  }

  script_ref(): ScriptRef | undefined {
    switch (this.variant.kind) {
      case 0:
        return undefined;
      case 1:
        return this.as_post_alonzo_transaction_output().script_ref();
    }
  }

  set_script_ref(script_ref: ScriptRef | undefined): void {
    switch (this.variant.kind) {
      case 0:
        if (ScriptRef) {
          const pbt = this.as_pre_babbage_transaction_output();
          this.variant = {
            kind: 1,
            value: PostAlonzoTransactionOutput.new(
              pbt.address(),
              pbt.amount(),
              undefined,
              script_ref,
            ),
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
  private items: TransactionOutput[];
  private definiteEncoding: boolean;

  constructor(items: TransactionOutput[], definiteEncoding: boolean = true) {
    this.items = items;
    this.definiteEncoding = definiteEncoding;
  }

  static new(): TransactionOutputs {
    return new TransactionOutputs([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): TransactionOutput {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: TransactionOutput): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader, path: string[]): TransactionOutputs {
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) =>
        TransactionOutput.deserialize(reader, [...path, "Elem#" + idx]),
      path,
    );
    return new TransactionOutputs(items, definiteEncoding);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["TransactionOutputs"],
  ): TransactionOutputs {
    let reader = new CBORReader(data);
    return TransactionOutputs.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["TransactionOutputs"],
  ): TransactionOutputs {
    return TransactionOutputs.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): TransactionOutputs {
    return TransactionOutputs.from_bytes(this.to_bytes(), path);
  }
}

export class TransactionUnspentOutput {
  private _input: TransactionInput;
  private _output: TransactionOutput;

  constructor(input: TransactionInput, output: TransactionOutput) {
    this._input = input;
    this._output = output;
  }

  static new(input: TransactionInput, output: TransactionOutput) {
    return new TransactionUnspentOutput(input, output);
  }

  input(): TransactionInput {
    return this._input;
  }

  set_input(input: TransactionInput): void {
    this._input = input;
  }

  output(): TransactionOutput {
    return this._output;
  }

  set_output(output: TransactionOutput): void {
    this._output = output;
  }

  static deserialize(
    reader: CBORReader,
    path: string[],
  ): TransactionUnspentOutput {
    let len = reader.readArrayTag(path);

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 2. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const input_path = [...path, "TransactionInput(input)"];
    let input = TransactionInput.deserialize(reader, input_path);

    const output_path = [...path, "TransactionOutput(output)"];
    let output = TransactionOutput.deserialize(reader, output_path);

    return new TransactionUnspentOutput(input, output);
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 2;

    writer.writeArrayTag(arrayLen);

    this._input.serialize(writer);
    this._output.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["TransactionUnspentOutput"],
  ): TransactionUnspentOutput {
    let reader = new CBORReader(data);
    return TransactionUnspentOutput.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["TransactionUnspentOutput"],
  ): TransactionUnspentOutput {
    return TransactionUnspentOutput.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): TransactionUnspentOutput {
    return TransactionUnspentOutput.from_bytes(this.to_bytes(), path);
  }
}

export class TransactionUnspentOutputs {
  private items: TransactionUnspentOutput[];
  private definiteEncoding: boolean;

  constructor(
    items: TransactionUnspentOutput[],
    definiteEncoding: boolean = true,
  ) {
    this.items = items;
    this.definiteEncoding = definiteEncoding;
  }

  static new(): TransactionUnspentOutputs {
    return new TransactionUnspentOutputs([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): TransactionUnspentOutput {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: TransactionUnspentOutput): void {
    this.items.push(elem);
  }

  static deserialize(
    reader: CBORReader,
    path: string[],
  ): TransactionUnspentOutputs {
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) =>
        TransactionUnspentOutput.deserialize(reader, [...path, "Elem#" + idx]),
      path,
    );
    return new TransactionUnspentOutputs(items, definiteEncoding);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["TransactionUnspentOutputs"],
  ): TransactionUnspentOutputs {
    let reader = new CBORReader(data);
    return TransactionUnspentOutputs.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["TransactionUnspentOutputs"],
  ): TransactionUnspentOutputs {
    return TransactionUnspentOutputs.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): TransactionUnspentOutputs {
    return TransactionUnspentOutputs.from_bytes(this.to_bytes(), path);
  }
}

export class TransactionWitnessSet {
  private _vkeys: Vkeywitnesses | undefined;
  private _native_scripts: NativeScripts | undefined;
  private _bootstraps: BootstrapWitnesses | undefined;
  private _plutus_scripts_v1: PlutusScripts | undefined;
  private _inner_plutus_data: PlutusSet | undefined;
  private _plutus_scripts_v2: PlutusScripts | undefined;
  private _redeemers: Redeemers | undefined;
  private _plutus_scripts_v3: PlutusScripts | undefined;

  constructor(
    vkeys: Vkeywitnesses | undefined,
    native_scripts: NativeScripts | undefined,
    bootstraps: BootstrapWitnesses | undefined,
    plutus_scripts_v1: PlutusScripts | undefined,
    inner_plutus_data: PlutusSet | undefined,
    plutus_scripts_v2: PlutusScripts | undefined,
    redeemers: Redeemers | undefined,
    plutus_scripts_v3: PlutusScripts | undefined,
  ) {
    this._vkeys = vkeys;
    this._native_scripts = native_scripts;
    this._bootstraps = bootstraps;
    this._plutus_scripts_v1 = plutus_scripts_v1;
    this._inner_plutus_data = inner_plutus_data;
    this._plutus_scripts_v2 = plutus_scripts_v2;
    this._redeemers = redeemers;
    this._plutus_scripts_v3 = plutus_scripts_v3;
  }

  vkeys(): Vkeywitnesses | undefined {
    return this._vkeys;
  }

  set_vkeys(vkeys: Vkeywitnesses | undefined): void {
    this._vkeys = vkeys;
  }

  native_scripts(): NativeScripts | undefined {
    return this._native_scripts;
  }

  set_native_scripts(native_scripts: NativeScripts | undefined): void {
    this._native_scripts = native_scripts;
  }

  bootstraps(): BootstrapWitnesses | undefined {
    return this._bootstraps;
  }

  set_bootstraps(bootstraps: BootstrapWitnesses | undefined): void {
    this._bootstraps = bootstraps;
  }

  plutus_scripts_v1(): PlutusScripts | undefined {
    return this._plutus_scripts_v1;
  }

  set_plutus_scripts_v1(plutus_scripts_v1: PlutusScripts | undefined): void {
    this._plutus_scripts_v1 = plutus_scripts_v1;
  }

  inner_plutus_data(): PlutusSet | undefined {
    return this._inner_plutus_data;
  }

  set_inner_plutus_data(inner_plutus_data: PlutusSet | undefined): void {
    this._inner_plutus_data = inner_plutus_data;
  }

  plutus_scripts_v2(): PlutusScripts | undefined {
    return this._plutus_scripts_v2;
  }

  set_plutus_scripts_v2(plutus_scripts_v2: PlutusScripts | undefined): void {
    this._plutus_scripts_v2 = plutus_scripts_v2;
  }

  redeemers(): Redeemers | undefined {
    return this._redeemers;
  }

  set_redeemers(redeemers: Redeemers | undefined): void {
    this._redeemers = redeemers;
  }

  plutus_scripts_v3(): PlutusScripts | undefined {
    return this._plutus_scripts_v3;
  }

  set_plutus_scripts_v3(plutus_scripts_v3: PlutusScripts | undefined): void {
    this._plutus_scripts_v3 = plutus_scripts_v3;
  }

  static deserialize(
    reader: CBORReader,
    path: string[],
  ): TransactionWitnessSet {
    let fields: any = {};
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

    return new TransactionWitnessSet(
      vkeys,
      native_scripts,
      bootstraps,
      plutus_scripts_v1,
      inner_plutus_data,
      plutus_scripts_v2,
      redeemers,
      plutus_scripts_v3,
    );
  }

  serialize(writer: CBORWriter): void {
    let len = 8;
    if (this._vkeys === undefined) len -= 1;
    if (this._native_scripts === undefined) len -= 1;
    if (this._bootstraps === undefined) len -= 1;
    if (this._plutus_scripts_v1 === undefined) len -= 1;
    if (this._inner_plutus_data === undefined) len -= 1;
    if (this._plutus_scripts_v2 === undefined) len -= 1;
    if (this._redeemers === undefined) len -= 1;
    if (this._plutus_scripts_v3 === undefined) len -= 1;
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
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["TransactionWitnessSet"],
  ): TransactionWitnessSet {
    let reader = new CBORReader(data);
    return TransactionWitnessSet.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["TransactionWitnessSet"],
  ): TransactionWitnessSet {
    return TransactionWitnessSet.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): TransactionWitnessSet {
    return TransactionWitnessSet.from_bytes(this.to_bytes(), path);
  }

  static new(): TransactionWitnessSet {
    return new TransactionWitnessSet(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );
  }

  plutus_data(): PlutusList | undefined {
    return this.inner_plutus_data()?.as_list();
  }

  set_plutus_data(plutus_data: PlutusList): void {
    this._inner_plutus_data = plutus_data.as_set();
  }
}

export class TransactionWitnessSets {
  private items: TransactionWitnessSet[];
  private definiteEncoding: boolean;

  constructor(
    items: TransactionWitnessSet[],
    definiteEncoding: boolean = true,
  ) {
    this.items = items;
    this.definiteEncoding = definiteEncoding;
  }

  static new(): TransactionWitnessSets {
    return new TransactionWitnessSets([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): TransactionWitnessSet {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: TransactionWitnessSet): void {
    this.items.push(elem);
  }

  static deserialize(
    reader: CBORReader,
    path: string[],
  ): TransactionWitnessSets {
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) =>
        TransactionWitnessSet.deserialize(reader, [...path, "Elem#" + idx]),
      path,
    );
    return new TransactionWitnessSets(items, definiteEncoding);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["TransactionWitnessSets"],
  ): TransactionWitnessSets {
    let reader = new CBORReader(data);
    return TransactionWitnessSets.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["TransactionWitnessSets"],
  ): TransactionWitnessSets {
    return TransactionWitnessSets.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): TransactionWitnessSets {
    return TransactionWitnessSets.from_bytes(this.to_bytes(), path);
  }
}

export class TreasuryWithdrawals {
  _items: [RewardAddress, BigNum][];

  constructor(items: [RewardAddress, BigNum][]) {
    this._items = items;
  }

  static new(): TreasuryWithdrawals {
    return new TreasuryWithdrawals([]);
  }

  len(): number {
    return this._items.length;
  }

  insert(key: RewardAddress, value: BigNum): BigNum | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this._items.push([key, value]);
    return undefined;
  }

  get(key: RewardAddress): BigNum | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: RewardAddress[]): void {
    this._items = this._items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  keys(): RewardAddresses {
    let keys = RewardAddresses.new();
    for (let [key, _] of this._items) keys.add(key);
    return keys;
  }

  static deserialize(reader: CBORReader, path: string[]): TreasuryWithdrawals {
    let ret = new TreasuryWithdrawals([]);
    reader.readMap(
      (reader, idx) =>
        ret.insert(
          RewardAddress.deserialize(reader, [...path, "RewardAddress#" + idx]),
          BigNum.deserialize(reader, [...path, "BigNum#" + idx]),
        ),
      path,
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this._items, (writer, x) => {
      x[0].serialize(writer);
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["TreasuryWithdrawals"],
  ): TreasuryWithdrawals {
    let reader = new CBORReader(data);
    return TreasuryWithdrawals.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["TreasuryWithdrawals"],
  ): TreasuryWithdrawals {
    return TreasuryWithdrawals.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): TreasuryWithdrawals {
    return TreasuryWithdrawals.from_bytes(this.to_bytes(), path);
  }
}

export class TreasuryWithdrawalsAction {
  private _withdrawals: TreasuryWithdrawals;
  private _policy_hash: ScriptHash | undefined;

  constructor(
    withdrawals: TreasuryWithdrawals,
    policy_hash: ScriptHash | undefined,
  ) {
    this._withdrawals = withdrawals;
    this._policy_hash = policy_hash;
  }

  static new_with_policy_hash(
    withdrawals: TreasuryWithdrawals,
    policy_hash: ScriptHash | undefined,
  ) {
    return new TreasuryWithdrawalsAction(withdrawals, policy_hash);
  }

  withdrawals(): TreasuryWithdrawals {
    return this._withdrawals;
  }

  set_withdrawals(withdrawals: TreasuryWithdrawals): void {
    this._withdrawals = withdrawals;
  }

  policy_hash(): ScriptHash | undefined {
    return this._policy_hash;
  }

  set_policy_hash(policy_hash: ScriptHash | undefined): void {
    this._policy_hash = policy_hash;
  }

  static deserialize(
    reader: CBORReader,
    path: string[],
  ): TreasuryWithdrawalsAction {
    let withdrawals = TreasuryWithdrawals.deserialize(reader, [
      ...path,
      "withdrawals",
    ]);

    let policy_hash =
      reader.readNullable(
        (r) => ScriptHash.deserialize(r, [...path, "policy_hash"]),
        path,
      ) ?? undefined;

    return new TreasuryWithdrawalsAction(withdrawals, policy_hash);
  }

  serialize(writer: CBORWriter): void {
    this._withdrawals.serialize(writer);
    if (this._policy_hash == null) {
      writer.writeNull();
    } else {
      this._policy_hash.serialize(writer);
    }
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["TreasuryWithdrawalsAction"],
  ): TreasuryWithdrawalsAction {
    let reader = new CBORReader(data);
    return TreasuryWithdrawalsAction.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["TreasuryWithdrawalsAction"],
  ): TreasuryWithdrawalsAction {
    return TreasuryWithdrawalsAction.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): TreasuryWithdrawalsAction {
    return TreasuryWithdrawalsAction.from_bytes(this.to_bytes(), path);
  }

  static new(withdrawals: TreasuryWithdrawals): TreasuryWithdrawalsAction {
    return new TreasuryWithdrawalsAction(withdrawals, undefined);
  }
}

export class URL {
  private inner: string;

  constructor(inner: string) {
    if (inner.length < 0) throw new Error("Expected length to be atleast 0");
    if (inner.length > 128) throw new Error("Expected length to be atmost 128");

    this.inner = inner;
  }

  static new(inner: string): URL {
    return new URL(inner);
  }

  url(): string {
    return this.inner;
  }

  static deserialize(reader: CBORReader, path: string[]): URL {
    return new URL(reader.readString(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeString(this.inner);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["URL"]): URL {
    let reader = new CBORReader(data);
    return URL.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["URL"]): URL {
    return URL.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): URL {
    return URL.from_bytes(this.to_bytes(), path);
  }
}

export class UnitInterval {
  private _numerator: BigNum;
  private _denominator: BigNum;

  constructor(numerator: BigNum, denominator: BigNum) {
    this._numerator = numerator;
    this._denominator = denominator;
  }

  static new(numerator: BigNum, denominator: BigNum) {
    return new UnitInterval(numerator, denominator);
  }

  numerator(): BigNum {
    return this._numerator;
  }

  set_numerator(numerator: BigNum): void {
    this._numerator = numerator;
  }

  denominator(): BigNum {
    return this._denominator;
  }

  set_denominator(denominator: BigNum): void {
    this._denominator = denominator;
  }

  static deserialize(
    reader: CBORReader,
    path: string[] = ["UnitInterval"],
  ): UnitInterval {
    let taggedTag = reader.readTaggedTag(path);
    if (taggedTag != 30) {
      throw new Error(
        "Expected tag 30, got " + taggedTag + " (at " + path + ")",
      );
    }

    return UnitInterval.deserializeInner(reader, path);
  }

  static deserializeInner(reader: CBORReader, path: string[]): UnitInterval {
    let len = reader.readArrayTag(path);

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 2. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const numerator_path = [...path, "BigNum(numerator)"];
    let numerator = BigNum.deserialize(reader, numerator_path);

    const denominator_path = [...path, "BigNum(denominator)"];
    let denominator = BigNum.deserialize(reader, denominator_path);

    return new UnitInterval(numerator, denominator);
  }

  serialize(writer: CBORWriter): void {
    writer.writeTaggedTag(30);

    this.serializeInner(writer);
  }

  serializeInner(writer: CBORWriter): void {
    let arrayLen = 2;

    writer.writeArrayTag(arrayLen);

    this._numerator.serialize(writer);
    this._denominator.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["UnitInterval"],
  ): UnitInterval {
    let reader = new CBORReader(data);
    return UnitInterval.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["UnitInterval"],
  ): UnitInterval {
    return UnitInterval.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): UnitInterval {
    return UnitInterval.from_bytes(this.to_bytes(), path);
  }
}

export class UnregCert {
  private _stake_credential: Credential;
  private _coin: BigNum;

  constructor(stake_credential: Credential, coin: BigNum) {
    this._stake_credential = stake_credential;
    this._coin = coin;
  }

  static new(stake_credential: Credential, coin: BigNum) {
    return new UnregCert(stake_credential, coin);
  }

  stake_credential(): Credential {
    return this._stake_credential;
  }

  set_stake_credential(stake_credential: Credential): void {
    this._stake_credential = stake_credential;
  }

  coin(): BigNum {
    return this._coin;
  }

  set_coin(coin: BigNum): void {
    this._coin = coin;
  }

  static deserialize(reader: CBORReader, path: string[]): UnregCert {
    let stake_credential = Credential.deserialize(reader, [
      ...path,
      "stake_credential",
    ]);

    let coin = BigNum.deserialize(reader, [...path, "coin"]);

    return new UnregCert(stake_credential, coin);
  }

  serialize(writer: CBORWriter): void {
    this._stake_credential.serialize(writer);
    this._coin.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["UnregCert"],
  ): UnregCert {
    let reader = new CBORReader(data);
    return UnregCert.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["UnregCert"]): UnregCert {
    return UnregCert.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): UnregCert {
    return UnregCert.from_bytes(this.to_bytes(), path);
  }
}

export class Update {
  private _proposed_protocol_parameter_updates: ProposedProtocolParameterUpdates;
  private _epoch: number;

  constructor(
    proposed_protocol_parameter_updates: ProposedProtocolParameterUpdates,
    epoch: number,
  ) {
    this._proposed_protocol_parameter_updates =
      proposed_protocol_parameter_updates;
    this._epoch = epoch;
  }

  static new(
    proposed_protocol_parameter_updates: ProposedProtocolParameterUpdates,
    epoch: number,
  ) {
    return new Update(proposed_protocol_parameter_updates, epoch);
  }

  proposed_protocol_parameter_updates(): ProposedProtocolParameterUpdates {
    return this._proposed_protocol_parameter_updates;
  }

  set_proposed_protocol_parameter_updates(
    proposed_protocol_parameter_updates: ProposedProtocolParameterUpdates,
  ): void {
    this._proposed_protocol_parameter_updates =
      proposed_protocol_parameter_updates;
  }

  epoch(): number {
    return this._epoch;
  }

  set_epoch(epoch: number): void {
    this._epoch = epoch;
  }

  static deserialize(reader: CBORReader, path: string[]): Update {
    let len = reader.readArrayTag(path);

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 2. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const proposed_protocol_parameter_updates_path = [
      ...path,
      "ProposedProtocolParameterUpdates(proposed_protocol_parameter_updates)",
    ];
    let proposed_protocol_parameter_updates =
      ProposedProtocolParameterUpdates.deserialize(
        reader,
        proposed_protocol_parameter_updates_path,
      );

    const epoch_path = [...path, "number(epoch)"];
    let epoch = Number(reader.readInt(epoch_path));

    return new Update(proposed_protocol_parameter_updates, epoch);
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 2;

    writer.writeArrayTag(arrayLen);

    this._proposed_protocol_parameter_updates.serialize(writer);
    writer.writeInt(BigInt(this._epoch));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["Update"]): Update {
    let reader = new CBORReader(data);
    return Update.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["Update"]): Update {
    return Update.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Update {
    return Update.from_bytes(this.to_bytes(), path);
  }
}

export class UpdateCommitteeAction {
  private _gov_action_id: GovernanceActionId | undefined;
  private _committee: Committee;
  private _members_to_remove: Credentials;

  constructor(
    gov_action_id: GovernanceActionId | undefined,
    committee: Committee,
    members_to_remove: Credentials,
  ) {
    this._gov_action_id = gov_action_id;
    this._committee = committee;
    this._members_to_remove = members_to_remove;
  }

  static new_with_action_id(
    gov_action_id: GovernanceActionId | undefined,
    committee: Committee,
    members_to_remove: Credentials,
  ) {
    return new UpdateCommitteeAction(
      gov_action_id,
      committee,
      members_to_remove,
    );
  }

  gov_action_id(): GovernanceActionId | undefined {
    return this._gov_action_id;
  }

  set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void {
    this._gov_action_id = gov_action_id;
  }

  committee(): Committee {
    return this._committee;
  }

  set_committee(committee: Committee): void {
    this._committee = committee;
  }

  members_to_remove(): Credentials {
    return this._members_to_remove;
  }

  set_members_to_remove(members_to_remove: Credentials): void {
    this._members_to_remove = members_to_remove;
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["UpdateCommitteeAction"],
  ): UpdateCommitteeAction {
    let reader = new CBORReader(data);
    return UpdateCommitteeAction.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["UpdateCommitteeAction"],
  ): UpdateCommitteeAction {
    return UpdateCommitteeAction.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): UpdateCommitteeAction {
    return UpdateCommitteeAction.from_bytes(this.to_bytes(), path);
  }

  static new(
    committee: Committee,
    members_to_remove: Credentials,
  ): UpdateCommitteeAction {
    return UpdateCommitteeAction.new_with_action_id(
      undefined,
      committee,
      members_to_remove,
    );
  }

  static deserialize(
    reader: CBORReader,
    path: string[],
  ): UpdateCommitteeAction {
    let gov_action_id = reader.readNullable(
      (reader) =>
        GovernanceActionId.deserialize(reader, [...path, "gov_action_id"]),
      path,
    );
    let members_to_remove = Credentials.deserialize(reader, [
      ...path,
      "members_to_remove",
    ]);
    let members = CommitteeEpochs.deserialize(reader, [...path, "members"]);
    let quorum_threshold = UnitInterval.deserialize(reader, [
      ...path,
      "quorum_threshold",
    ]);
    return UpdateCommitteeAction.new_with_action_id(
      gov_action_id != null ? gov_action_id : undefined,
      new Committee(quorum_threshold, members),
      members_to_remove,
    );
  }

  serialize(writer: CBORWriter): void {
    if (this._gov_action_id == null) writer.writeNull();
    else this._gov_action_id.serialize(writer);
    this._members_to_remove.serialize(writer);
    this._committee.members_.serialize(writer);
    this._committee.quorum_threshold_.serialize(writer);
  }
}

export class VRFCert {
  private _output: Uint8Array;
  private _proof: Uint8Array;

  constructor(output: Uint8Array, proof: Uint8Array) {
    this._output = output;
    this._proof = proof;
  }

  static new(output: Uint8Array, proof: Uint8Array) {
    return new VRFCert(output, proof);
  }

  output(): Uint8Array {
    return this._output;
  }

  set_output(output: Uint8Array): void {
    this._output = output;
  }

  proof(): Uint8Array {
    return this._proof;
  }

  set_proof(proof: Uint8Array): void {
    this._proof = proof;
  }

  static deserialize(reader: CBORReader, path: string[]): VRFCert {
    let len = reader.readArrayTag(path);

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 2. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const output_path = [...path, "bytes(output)"];
    let output = reader.readBytes(output_path);

    const proof_path = [...path, "bytes(proof)"];
    let proof = reader.readBytes(proof_path);

    return new VRFCert(output, proof);
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 2;

    writer.writeArrayTag(arrayLen);

    writer.writeBytes(this._output);
    writer.writeBytes(this._proof);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["VRFCert"]): VRFCert {
    let reader = new CBORReader(data);
    return VRFCert.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["VRFCert"]): VRFCert {
    return VRFCert.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): VRFCert {
    return VRFCert.from_bytes(this.to_bytes(), path);
  }
}

export class VRFKeyHash {
  private inner: Uint8Array;

  constructor(inner: Uint8Array) {
    if (inner.length != 32) throw new Error("Expected length to be 32");
    this.inner = inner;
  }

  static new(inner: Uint8Array): VRFKeyHash {
    return new VRFKeyHash(inner);
  }

  static from_bech32(bech_str: string): VRFKeyHash {
    let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new VRFKeyHash(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): VRFKeyHash {
    return new VRFKeyHash(data);
  }

  static from_hex(hex_str: string): VRFKeyHash {
    return VRFKeyHash.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    return this.inner;
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): VRFKeyHash {
    return VRFKeyHash.from_bytes(this.to_bytes());
  }

  static deserialize(reader: CBORReader, path: string[]): VRFKeyHash {
    return new VRFKeyHash(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }
}

export class VRFVKey {
  private inner: Uint8Array;

  constructor(inner: Uint8Array) {
    if (inner.length != 32) throw new Error("Expected length to be 32");
    this.inner = inner;
  }

  static new(inner: Uint8Array): VRFVKey {
    return new VRFVKey(inner);
  }

  static from_bech32(bech_str: string): VRFVKey {
    let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new VRFVKey(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): VRFVKey {
    return new VRFVKey(data);
  }

  static from_hex(hex_str: string): VRFVKey {
    return VRFVKey.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    return this.inner;
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): VRFVKey {
    return VRFVKey.from_bytes(this.to_bytes());
  }

  static deserialize(reader: CBORReader, path: string[]): VRFVKey {
    return new VRFVKey(reader.readBytes(path));
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }
}

export class Value {
  private _coin: BigNum;
  private _multiasset: MultiAsset | undefined;

  constructor(coin: BigNum, multiasset: MultiAsset | undefined) {
    this._coin = coin;
    this._multiasset = multiasset;
  }

  static new_with_assets(coin: BigNum, multiasset: MultiAsset | undefined) {
    return new Value(coin, multiasset);
  }

  coin(): BigNum {
    return this._coin;
  }

  set_coin(coin: BigNum): void {
    this._coin = coin;
  }

  multiasset(): MultiAsset | undefined {
    return this._multiasset;
  }

  set_multiasset(multiasset: MultiAsset | undefined): void {
    this._multiasset = multiasset;
  }

  static deserializeRecord(reader: CBORReader, path: string[]): Value {
    let len = reader.readArrayTag(path);

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 2. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const coin_path = [...path, "BigNum(coin)"];
    let coin = BigNum.deserialize(reader, coin_path);

    const multiasset_path = [...path, "MultiAsset(multiasset)"];
    let multiasset =
      reader.readNullable(
        (r) => MultiAsset.deserialize(r, multiasset_path),
        path,
      ) ?? undefined;

    return new Value(coin, multiasset);
  }

  serializeRecord(writer: CBORWriter): void {
    let arrayLen = 2;

    writer.writeArrayTag(arrayLen);

    this._coin.serialize(writer);
    if (this._multiasset == null) {
      writer.writeNull();
    } else {
      this._multiasset.serialize(writer);
    }
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["Value"]): Value {
    let reader = new CBORReader(data);
    return Value.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["Value"]): Value {
    return Value.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Value {
    return Value.from_bytes(this.to_bytes(), path);
  }

  static zero(): Value {
    return Value.new(BigNum.zero());
  }

  is_zero(): boolean {
    return this._coin.is_zero();
  }

  static new(coin: BigNum): Value {
    return Value.new_with_assets(coin, undefined);
  }

  static new_from_assets(multiasset: MultiAsset): Value {
    return Value.new_with_assets(BigNum.zero(), multiasset);
  }

  static deserialize(reader: CBORReader, path: string[]): Value {
    if (reader.peekType(path) == "array") {
      return Value.deserializeRecord(reader, path);
    }
    return Value.new(BigNum.deserialize(reader, path));
  }

  serialize(writer: CBORWriter): void {
    if (this._multiasset == null || this._multiasset.len() == 0) {
      this._coin.serialize(writer);
    } else {
      this.serializeRecord(writer);
    }
  }

  checked_add(rhs: Value, path: string[]): Value {
    let coin = this._coin.checked_add(rhs._coin);
    let multiasset: MultiAsset | undefined;
    if (this._multiasset != null) {
      multiasset = this._multiasset.clone(path);
      if (rhs._multiasset != null) {
        multiasset._inplace_checked_add(rhs._multiasset);
      }
    } else if (rhs._multiasset != null) {
      multiasset = rhs._multiasset.clone(path);
    }
    return new Value(coin, multiasset);
  }

  checked_sub(rhs: Value, path: string[]): Value {
    let coin = this._coin.checked_sub(rhs._coin);
    let multiasset: MultiAsset | undefined;
    if (this._multiasset != null) {
      multiasset = this._multiasset.clone(path);
      if (rhs._multiasset != null) {
        multiasset._inplace_clamped_sub(rhs._multiasset);
      }
    }
    return new Value(coin, multiasset);
  }

  clamped_sub(rhs: Value, path: string[]): Value {
    let coin = this._coin.clamped_sub(rhs._coin);
    let multiasset: MultiAsset | undefined;
    if (this._multiasset != null) {
      multiasset = this._multiasset.clone(path);
      if (rhs._multiasset != null) {
        multiasset._inplace_clamped_sub(rhs._multiasset);
      }
    }
    return new Value(coin, multiasset);
  }

  compare(rhs_value: Value): number | undefined {
    let coin_cmp = this._coin.compare(rhs_value._coin);
    let this_multiasset = this._multiasset ?? MultiAsset.new();
    let rhs_multiasset = rhs_value._multiasset ?? MultiAsset.new();

    let assets_cmp = this_multiasset._partial_cmp(rhs_multiasset);
    if (assets_cmp == null) return undefined;

    if (coin_cmp == 0 || coin_cmp == assets_cmp) return assets_cmp;
    if (assets_cmp == 0) return coin_cmp;

    // (coin_cmp == -1 && assets_cmp == +1) || (coin_cmp == +1 && assets_cmp == -1)
    return undefined;
  }
}

export class Vkey {
  private _public_key: PublicKey;

  constructor(public_key: PublicKey) {
    this._public_key = public_key;
  }

  static new(public_key: PublicKey) {
    return new Vkey(public_key);
  }

  public_key(): PublicKey {
    return this._public_key;
  }

  set_public_key(public_key: PublicKey): void {
    this._public_key = public_key;
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["Vkey"]): Vkey {
    let reader = new CBORReader(data);
    return Vkey.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["Vkey"]): Vkey {
    return Vkey.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Vkey {
    return Vkey.from_bytes(this.to_bytes(), path);
  }

  static deserialize(reader: CBORReader, path: string[]): Vkey {
    const public_key_path = [...path, "PublicKey(public_key)"];
    let public_key = PublicKey.deserialize(reader, public_key_path);
    return new Vkey(public_key);
  }

  serialize(writer: CBORWriter): void {
    this._public_key.serialize(writer);
  }
}

export class Vkeys {
  private items: Vkey[];
  private definiteEncoding: boolean;

  constructor(items: Vkey[], definiteEncoding: boolean = true) {
    this.items = items;
    this.definiteEncoding = definiteEncoding;
  }

  static new(): Vkeys {
    return new Vkeys([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): Vkey {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: Vkey): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader, path: string[]): Vkeys {
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) => Vkey.deserialize(reader, [...path, "Elem#" + idx]),
      path,
    );
    return new Vkeys(items, definiteEncoding);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["Vkeys"]): Vkeys {
    let reader = new CBORReader(data);
    return Vkeys.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["Vkeys"]): Vkeys {
    return Vkeys.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Vkeys {
    return Vkeys.from_bytes(this.to_bytes(), path);
  }
}

export class Vkeywitness {
  private _vkey: Vkey;
  private _signature: Ed25519Signature;

  constructor(vkey: Vkey, signature: Ed25519Signature) {
    this._vkey = vkey;
    this._signature = signature;
  }

  static new(vkey: Vkey, signature: Ed25519Signature) {
    return new Vkeywitness(vkey, signature);
  }

  vkey(): Vkey {
    return this._vkey;
  }

  set_vkey(vkey: Vkey): void {
    this._vkey = vkey;
  }

  signature(): Ed25519Signature {
    return this._signature;
  }

  set_signature(signature: Ed25519Signature): void {
    this._signature = signature;
  }

  static deserialize(reader: CBORReader, path: string[]): Vkeywitness {
    let len = reader.readArrayTag(path);

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 2. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const vkey_path = [...path, "Vkey(vkey)"];
    let vkey = Vkey.deserialize(reader, vkey_path);

    const signature_path = [...path, "Ed25519Signature(signature)"];
    let signature = Ed25519Signature.deserialize(reader, signature_path);

    return new Vkeywitness(vkey, signature);
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 2;

    writer.writeArrayTag(arrayLen);

    this._vkey.serialize(writer);
    this._signature.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["Vkeywitness"],
  ): Vkeywitness {
    let reader = new CBORReader(data);
    return Vkeywitness.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["Vkeywitness"],
  ): Vkeywitness {
    return Vkeywitness.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Vkeywitness {
    return Vkeywitness.from_bytes(this.to_bytes(), path);
  }
}

export class Vkeywitnesses {
  private items: Vkeywitness[];
  private definiteEncoding: boolean;
  private nonEmptyTag: boolean;

  private setItems(items: Vkeywitness[]) {
    this.items = items;
  }

  constructor(definiteEncoding: boolean = true, nonEmptyTag: boolean = true) {
    this.items = [];
    this.definiteEncoding = definiteEncoding;
    this.nonEmptyTag = nonEmptyTag;
  }

  static new(): Vkeywitnesses {
    return new Vkeywitnesses();
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): Vkeywitness {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: Vkeywitness): boolean {
    if (this.contains(elem)) return true;
    this.items.push(elem);
    return false;
  }

  contains(elem: Vkeywitness): boolean {
    for (let item of this.items) {
      if (arrayEq(item.to_bytes(), elem.to_bytes())) {
        return true;
      }
    }
    return false;
  }

  static deserialize(reader: CBORReader, path: string[]): Vkeywitnesses {
    let nonEmptyTag = false;
    if (reader.peekType(path) == "tagged") {
      let tag = reader.readTaggedTag(path);
      if (tag != 258) {
        throw new Error("Expected tag 258. Got " + tag);
      } else {
        nonEmptyTag = true;
      }
    }
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) =>
        Vkeywitness.deserialize(reader, [...path, "Vkeywitness#" + idx]),
      path,
    );
    let ret = new Vkeywitnesses(definiteEncoding, nonEmptyTag);
    ret.setItems(items);
    return ret;
  }

  serialize(writer: CBORWriter): void {
    if (this.nonEmptyTag) {
      writer.writeTaggedTag(258);
    }
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["Vkeywitnesses"],
  ): Vkeywitnesses {
    let reader = new CBORReader(data);
    return Vkeywitnesses.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["Vkeywitnesses"],
  ): Vkeywitnesses {
    return Vkeywitnesses.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Vkeywitnesses {
    return Vkeywitnesses.from_bytes(this.to_bytes(), path);
  }
}

export class VoteDelegation {
  private _stake_credential: Credential;
  private _drep: DRep;

  constructor(stake_credential: Credential, drep: DRep) {
    this._stake_credential = stake_credential;
    this._drep = drep;
  }

  static new(stake_credential: Credential, drep: DRep) {
    return new VoteDelegation(stake_credential, drep);
  }

  stake_credential(): Credential {
    return this._stake_credential;
  }

  set_stake_credential(stake_credential: Credential): void {
    this._stake_credential = stake_credential;
  }

  drep(): DRep {
    return this._drep;
  }

  set_drep(drep: DRep): void {
    this._drep = drep;
  }

  static deserialize(reader: CBORReader, path: string[]): VoteDelegation {
    let stake_credential = Credential.deserialize(reader, [
      ...path,
      "stake_credential",
    ]);

    let drep = DRep.deserialize(reader, [...path, "drep"]);

    return new VoteDelegation(stake_credential, drep);
  }

  serialize(writer: CBORWriter): void {
    this._stake_credential.serialize(writer);
    this._drep.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["VoteDelegation"],
  ): VoteDelegation {
    let reader = new CBORReader(data);
    return VoteDelegation.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["VoteDelegation"],
  ): VoteDelegation {
    return VoteDelegation.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): VoteDelegation {
    return VoteDelegation.from_bytes(this.to_bytes(), path);
  }
}

export enum VoteKind {
  No = 0,
  Yes = 1,
  Abstain = 2,
}

export function deserializeVoteKind(
  reader: CBORReader,
  path: string[],
): VoteKind {
  let value = Number(reader.readInt(path));
  switch (value) {
    case 0:
      return VoteKind.No;
    case 1:
      return VoteKind.Yes;
    case 2:
      return VoteKind.Abstain;
  }
  throw new Error(
    "Invalid value for enum VoteKind: " + value + "(at " + path.join("/") + ")",
  );
}

export function serializeVoteKind(writer: CBORWriter, value: VoteKind): void {
  writer.writeInt(BigInt(value));
}

export class VoteRegistrationAndDelegation {
  private _stake_credential: Credential;
  private _drep: DRep;
  private _coin: BigNum;

  constructor(stake_credential: Credential, drep: DRep, coin: BigNum) {
    this._stake_credential = stake_credential;
    this._drep = drep;
    this._coin = coin;
  }

  static new(stake_credential: Credential, drep: DRep, coin: BigNum) {
    return new VoteRegistrationAndDelegation(stake_credential, drep, coin);
  }

  stake_credential(): Credential {
    return this._stake_credential;
  }

  set_stake_credential(stake_credential: Credential): void {
    this._stake_credential = stake_credential;
  }

  drep(): DRep {
    return this._drep;
  }

  set_drep(drep: DRep): void {
    this._drep = drep;
  }

  coin(): BigNum {
    return this._coin;
  }

  set_coin(coin: BigNum): void {
    this._coin = coin;
  }

  static deserialize(
    reader: CBORReader,
    path: string[],
  ): VoteRegistrationAndDelegation {
    let stake_credential = Credential.deserialize(reader, [
      ...path,
      "stake_credential",
    ]);

    let drep = DRep.deserialize(reader, [...path, "drep"]);

    let coin = BigNum.deserialize(reader, [...path, "coin"]);

    return new VoteRegistrationAndDelegation(stake_credential, drep, coin);
  }

  serialize(writer: CBORWriter): void {
    this._stake_credential.serialize(writer);
    this._drep.serialize(writer);
    this._coin.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["VoteRegistrationAndDelegation"],
  ): VoteRegistrationAndDelegation {
    let reader = new CBORReader(data);
    return VoteRegistrationAndDelegation.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["VoteRegistrationAndDelegation"],
  ): VoteRegistrationAndDelegation {
    return VoteRegistrationAndDelegation.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): VoteRegistrationAndDelegation {
    return VoteRegistrationAndDelegation.from_bytes(this.to_bytes(), path);
  }
}

export enum VoterKind {
  ConstitutionalCommitteeHotKeyHash = 0,
  ConstitutionalCommitteeHotScriptHash = 1,
  DRepKeyHash = 2,
  DRepScriptHash = 3,
  StakingPoolKeyHash = 4,
}

export type VoterVariant =
  | { kind: 0; value: Ed25519KeyHash }
  | { kind: 1; value: ScriptHash }
  | { kind: 2; value: Ed25519KeyHash }
  | { kind: 3; value: ScriptHash }
  | { kind: 4; value: Ed25519KeyHash };

export class Voter {
  private variant: VoterVariant;

  constructor(variant: VoterVariant) {
    this.variant = variant;
  }

  static new_constitutional_committee_hot_key_hash(
    constitutional_committee_hot_key_hash: Ed25519KeyHash,
  ): Voter {
    return new Voter({ kind: 0, value: constitutional_committee_hot_key_hash });
  }

  static new_constitutional_committee_hot_script_hash(
    constitutional_committee_hot_script_hash: ScriptHash,
  ): Voter {
    return new Voter({
      kind: 1,
      value: constitutional_committee_hot_script_hash,
    });
  }

  static new_drep_key_hash(drep_key_hash: Ed25519KeyHash): Voter {
    return new Voter({ kind: 2, value: drep_key_hash });
  }

  static new_drep_script_hash(drep_script_hash: ScriptHash): Voter {
    return new Voter({ kind: 3, value: drep_script_hash });
  }

  static new_staking_pool_key_hash(
    staking_pool_key_hash: Ed25519KeyHash,
  ): Voter {
    return new Voter({ kind: 4, value: staking_pool_key_hash });
  }

  to_constitutional_committee_hot_key_hash(): Ed25519KeyHash | undefined {
    if (this.variant.kind == 0) return this.variant.value;
  }

  to_constitutional_committee_hot_script_hash(): ScriptHash | undefined {
    if (this.variant.kind == 1) return this.variant.value;
  }

  to_drep_key_hash(): Ed25519KeyHash | undefined {
    if (this.variant.kind == 2) return this.variant.value;
  }

  to_drep_script_hash(): ScriptHash | undefined {
    if (this.variant.kind == 3) return this.variant.value;
  }

  to_staking_pool_key_hash(): Ed25519KeyHash | undefined {
    if (this.variant.kind == 4) return this.variant.value;
  }

  kind(): VoterKind {
    return this.variant.kind;
  }

  static deserialize(reader: CBORReader, path: string[]): Voter {
    let len = reader.readArrayTag(path);
    let tag = Number(reader.readUint(path));
    let variant: VoterVariant;

    switch (tag) {
      case 0:
        if (len != null && len - 1 != 1) {
          throw new Error(
            "Expected 1 items to decode ConstitutionalCommitteeHotKeyHash",
          );
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
          throw new Error(
            "Expected 1 items to decode ConstitutionalCommitteeHotScriptHash",
          );
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
        throw new Error(
          "Unexpected tag for Voter: " + tag + "(at " + path.join("/") + ")",
        );
    }

    if (len == null) {
      reader.readBreak();
    }

    return new Voter(variant);
  }

  serialize(writer: CBORWriter): void {
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
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["Voter"]): Voter {
    let reader = new CBORReader(data);
    return Voter.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["Voter"]): Voter {
    return Voter.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Voter {
    return Voter.from_bytes(this.to_bytes(), path);
  }

  has_script_credentials(): boolean {
    return (
      this.variant.kind == VoterKind.ConstitutionalCommitteeHotScriptHash ||
      this.variant.kind == VoterKind.DRepScriptHash
    );
  }

  to_key_hash(): Ed25519KeyHash | undefined {
    if (
      this.variant.kind == VoterKind.ConstitutionalCommitteeHotKeyHash ||
      this.variant.kind == VoterKind.DRepKeyHash ||
      this.variant.kind == VoterKind.StakingPoolKeyHash
    ) {
      return this.variant.value;
    }
    return undefined;
  }

  static new_constitutional_committee_hot_credential(cred: Credential): Voter {
    if (cred.kind() == CredKind.Key) {
      return Voter.new_constitutional_committee_hot_key_hash(
        cred.to_keyhash()!,
      );
    } else if (cred.kind() == CredKind.Script) {
      return Voter.new_constitutional_committee_hot_script_hash(
        cred.to_scripthash()!,
      );
    } else {
      throw new Error("Invalid CredKind");
    }
  }

  static new_drep_credential(cred: Credential): Voter {
    if (cred.kind() == CredKind.Key) {
      return Voter.new_drep_key_hash(cred.to_keyhash()!);
    } else if (cred.kind() == CredKind.Script) {
      return Voter.new_drep_script_hash(cred.to_scripthash()!);
    } else {
      throw new Error("Invalid CredKind");
    }
  }

  to_constitutional_committee_hot_credential(): Credential | undefined {
    if (this.variant.kind == VoterKind.ConstitutionalCommitteeHotKeyHash) {
      return Credential.from_keyhash(this.variant.value);
    } else if (
      this.variant.kind == VoterKind.ConstitutionalCommitteeHotScriptHash
    ) {
      return Credential.from_scripthash(this.variant.value);
    }
    return undefined;
  }

  to_drep_credential(): Credential | undefined {
    if (this.variant.kind == VoterKind.DRepKeyHash) {
      return Credential.from_keyhash(this.variant.value);
    } else if (this.variant.kind == VoterKind.DRepScriptHash) {
      return Credential.from_scripthash(this.variant.value);
    }
    return undefined;
  }
}

export class Voters {
  private items: Voter[];
  private definiteEncoding: boolean;

  constructor(items: Voter[], definiteEncoding: boolean = true) {
    this.items = items;
    this.definiteEncoding = definiteEncoding;
  }

  static new(): Voters {
    return new Voters([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): Voter {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: Voter): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader, path: string[]): Voters {
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) => Voter.deserialize(reader, [...path, "Elem#" + idx]),
      path,
    );
    return new Voters(items, definiteEncoding);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array, path: string[] = ["Voters"]): Voters {
    let reader = new CBORReader(data);
    return Voters.deserialize(reader, path);
  }

  static from_hex(hex_str: string, path: string[] = ["Voters"]): Voters {
    return Voters.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Voters {
    return Voters.from_bytes(this.to_bytes(), path);
  }
}

export class VotingProcedure {
  private _vote: VoteKind;
  private _anchor: Anchor | undefined;

  constructor(vote: VoteKind, anchor: Anchor | undefined) {
    this._vote = vote;
    this._anchor = anchor;
  }

  static new_with_anchor(vote: VoteKind, anchor: Anchor | undefined) {
    return new VotingProcedure(vote, anchor);
  }

  vote(): VoteKind {
    return this._vote;
  }

  set_vote(vote: VoteKind): void {
    this._vote = vote;
  }

  anchor(): Anchor | undefined {
    return this._anchor;
  }

  set_anchor(anchor: Anchor | undefined): void {
    this._anchor = anchor;
  }

  static deserialize(reader: CBORReader, path: string[]): VotingProcedure {
    let len = reader.readArrayTag(path);

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 2. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const vote_path = [...path, "VoteKind(vote)"];
    let vote = deserializeVoteKind(reader, vote_path);

    const anchor_path = [...path, "Anchor(anchor)"];
    let anchor =
      reader.readNullable((r) => Anchor.deserialize(r, anchor_path), path) ??
      undefined;

    return new VotingProcedure(vote, anchor);
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 2;

    writer.writeArrayTag(arrayLen);

    serializeVoteKind(writer, this._vote);
    if (this._anchor == null) {
      writer.writeNull();
    } else {
      this._anchor.serialize(writer);
    }
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["VotingProcedure"],
  ): VotingProcedure {
    let reader = new CBORReader(data);
    return VotingProcedure.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["VotingProcedure"],
  ): VotingProcedure {
    return VotingProcedure.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): VotingProcedure {
    return VotingProcedure.from_bytes(this.to_bytes(), path);
  }

  static new(vote: VoteKind): VotingProcedure {
    return new VotingProcedure(vote, undefined);
  }
}

export class VotingProcedures {
  _items: [Voter, GovernanceActions][];

  constructor(items: [Voter, GovernanceActions][]) {
    this._items = items;
  }

  static new(): VotingProcedures {
    return new VotingProcedures([]);
  }

  len(): number {
    return this._items.length;
  }

  _insert(key: Voter, value: GovernanceActions): GovernanceActions | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this._items.push([key, value]);
    return undefined;
  }

  _get(key: Voter): GovernanceActions | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: Voter[]): void {
    this._items = this._items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  keys(): Voters {
    let keys = Voters.new();
    for (let [key, _] of this._items) keys.add(key);
    return keys;
  }

  static deserialize(reader: CBORReader, path: string[]): VotingProcedures {
    let ret = new VotingProcedures([]);
    reader.readMap(
      (reader, idx) =>
        ret._insert(
          Voter.deserialize(reader, [...path, "Voter#" + idx]),
          GovernanceActions.deserialize(reader, [
            ...path,
            "GovernanceActions#" + idx,
          ]),
        ),
      path,
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this._items, (writer, x) => {
      x[0].serialize(writer);
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["VotingProcedures"],
  ): VotingProcedures {
    let reader = new CBORReader(data);
    return VotingProcedures.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["VotingProcedures"],
  ): VotingProcedures {
    return VotingProcedures.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): VotingProcedures {
    return VotingProcedures.from_bytes(this.to_bytes(), path);
  }

  insert(
    voter: Voter,
    governance_action_id: GovernanceActionId,
    voting_procedure: VotingProcedure,
  ): void {
    let gov_actions = this._get(voter);
    if (gov_actions == null) {
      gov_actions = GovernanceActions.new();
      this._insert(voter, gov_actions);
    }
    gov_actions.insert(governance_action_id, voting_procedure);
  }

  get(
    voter: Voter,
    governance_action_id: GovernanceActionId,
  ): VotingProcedure | undefined {
    let gov_actions = this._get(voter);
    if (gov_actions == null) return undefined;
    return gov_actions.get(governance_action_id);
  }

  get_voters(): Voters {
    return this.keys();
  }

  get_governance_action_ids_by_voter(voter: Voter): GovernanceActionIds {
    let gov_actions = this._get(voter);
    if (gov_actions == null) return GovernanceActionIds.new();
    return gov_actions.keys();
  }
}

export class VotingProposal {
  private _deposit: BigNum;
  private _reward_account: RewardAddress;
  private _governance_action: GovernanceAction;
  private _anchor: Anchor;

  constructor(
    deposit: BigNum,
    reward_account: RewardAddress,
    governance_action: GovernanceAction,
    anchor: Anchor,
  ) {
    this._deposit = deposit;
    this._reward_account = reward_account;
    this._governance_action = governance_action;
    this._anchor = anchor;
  }

  deposit(): BigNum {
    return this._deposit;
  }

  set_deposit(deposit: BigNum): void {
    this._deposit = deposit;
  }

  reward_account(): RewardAddress {
    return this._reward_account;
  }

  set_reward_account(reward_account: RewardAddress): void {
    this._reward_account = reward_account;
  }

  governance_action(): GovernanceAction {
    return this._governance_action;
  }

  set_governance_action(governance_action: GovernanceAction): void {
    this._governance_action = governance_action;
  }

  anchor(): Anchor {
    return this._anchor;
  }

  set_anchor(anchor: Anchor): void {
    this._anchor = anchor;
  }

  static deserialize(reader: CBORReader, path: string[]): VotingProposal {
    let len = reader.readArrayTag(path);

    if (len != null && len < 4) {
      throw new Error(
        "Insufficient number of fields in record. Expected at least 4. Received " +
          len +
          "(at " +
          path.join("/"),
      );
    }

    const deposit_path = [...path, "BigNum(deposit)"];
    let deposit = BigNum.deserialize(reader, deposit_path);

    const reward_account_path = [...path, "RewardAddress(reward_account)"];
    let reward_account = RewardAddress.deserialize(reader, reward_account_path);

    const governance_action_path = [
      ...path,
      "GovernanceAction(governance_action)",
    ];
    let governance_action = GovernanceAction.deserialize(
      reader,
      governance_action_path,
    );

    const anchor_path = [...path, "Anchor(anchor)"];
    let anchor = Anchor.deserialize(reader, anchor_path);

    return new VotingProposal(
      deposit,
      reward_account,
      governance_action,
      anchor,
    );
  }

  serialize(writer: CBORWriter): void {
    let arrayLen = 4;

    writer.writeArrayTag(arrayLen);

    this._deposit.serialize(writer);
    this._reward_account.serialize(writer);
    this._governance_action.serialize(writer);
    this._anchor.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["VotingProposal"],
  ): VotingProposal {
    let reader = new CBORReader(data);
    return VotingProposal.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["VotingProposal"],
  ): VotingProposal {
    return VotingProposal.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): VotingProposal {
    return VotingProposal.from_bytes(this.to_bytes(), path);
  }

  static new(
    governance_action: GovernanceAction,
    anchor: Anchor,
    reward_account: RewardAddress,
    deposit: BigNum,
  ): VotingProposal {
    return new VotingProposal(
      deposit,
      reward_account,
      governance_action,
      anchor,
    );
  }
}

export class VotingProposals {
  private items: VotingProposal[];
  private definiteEncoding: boolean;
  private nonEmptyTag: boolean;

  private setItems(items: VotingProposal[]) {
    this.items = items;
  }

  constructor(definiteEncoding: boolean = true, nonEmptyTag: boolean = true) {
    this.items = [];
    this.definiteEncoding = definiteEncoding;
    this.nonEmptyTag = nonEmptyTag;
  }

  static new(): VotingProposals {
    return new VotingProposals();
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): VotingProposal {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: VotingProposal): boolean {
    if (this.contains(elem)) return true;
    this.items.push(elem);
    return false;
  }

  contains(elem: VotingProposal): boolean {
    for (let item of this.items) {
      if (arrayEq(item.to_bytes(), elem.to_bytes())) {
        return true;
      }
    }
    return false;
  }

  static deserialize(reader: CBORReader, path: string[]): VotingProposals {
    let nonEmptyTag = false;
    if (reader.peekType(path) == "tagged") {
      let tag = reader.readTaggedTag(path);
      if (tag != 258) {
        throw new Error("Expected tag 258. Got " + tag);
      } else {
        nonEmptyTag = true;
      }
    }
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) =>
        VotingProposal.deserialize(reader, [...path, "VotingProposal#" + idx]),
      path,
    );
    let ret = new VotingProposals(definiteEncoding, nonEmptyTag);
    ret.setItems(items);
    return ret;
  }

  serialize(writer: CBORWriter): void {
    if (this.nonEmptyTag) {
      writer.writeTaggedTag(258);
    }
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["VotingProposals"],
  ): VotingProposals {
    let reader = new CBORReader(data);
    return VotingProposals.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["VotingProposals"],
  ): VotingProposals {
    return VotingProposals.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): VotingProposals {
    return VotingProposals.from_bytes(this.to_bytes(), path);
  }
}

export class Withdrawals {
  _items: [RewardAddress, BigNum][];

  constructor(items: [RewardAddress, BigNum][]) {
    this._items = items;
  }

  static new(): Withdrawals {
    return new Withdrawals([]);
  }

  len(): number {
    return this._items.length;
  }

  insert(key: RewardAddress, value: BigNum): BigNum | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this._items.push([key, value]);
    return undefined;
  }

  get(key: RewardAddress): BigNum | undefined {
    let entry = this._items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: RewardAddress[]): void {
    this._items = this._items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  static deserialize(reader: CBORReader, path: string[]): Withdrawals {
    let ret = new Withdrawals([]);
    reader.readMap(
      (reader, idx) =>
        ret.insert(
          RewardAddress.deserialize(reader, [...path, "RewardAddress#" + idx]),
          BigNum.deserialize(reader, [...path, "BigNum#" + idx]),
        ),
      path,
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this._items, (writer, x) => {
      x[0].serialize(writer);
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["Withdrawals"],
  ): Withdrawals {
    let reader = new CBORReader(data);
    return Withdrawals.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["Withdrawals"],
  ): Withdrawals {
    return Withdrawals.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): Withdrawals {
    return Withdrawals.from_bytes(this.to_bytes(), path);
  }
}

export class certificates {
  private items: Certificate[];
  private definiteEncoding: boolean;
  private nonEmptyTag: boolean;

  private setItems(items: Certificate[]) {
    this.items = items;
  }

  constructor(definiteEncoding: boolean = true, nonEmptyTag: boolean = true) {
    this.items = [];
    this.definiteEncoding = definiteEncoding;
    this.nonEmptyTag = nonEmptyTag;
  }

  static new(): certificates {
    return new certificates();
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): Certificate {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: Certificate): boolean {
    if (this.contains(elem)) return true;
    this.items.push(elem);
    return false;
  }

  contains(elem: Certificate): boolean {
    for (let item of this.items) {
      if (arrayEq(item.to_bytes(), elem.to_bytes())) {
        return true;
      }
    }
    return false;
  }

  static deserialize(reader: CBORReader, path: string[]): certificates {
    let nonEmptyTag = false;
    if (reader.peekType(path) == "tagged") {
      let tag = reader.readTaggedTag(path);
      if (tag != 258) {
        throw new Error("Expected tag 258. Got " + tag);
      } else {
        nonEmptyTag = true;
      }
    }
    const { items, definiteEncoding } = reader.readArray(
      (reader, idx) =>
        Certificate.deserialize(reader, [...path, "Certificate#" + idx]),
      path,
    );
    let ret = new certificates(definiteEncoding, nonEmptyTag);
    ret.setItems(items);
    return ret;
  }

  serialize(writer: CBORWriter): void {
    if (this.nonEmptyTag) {
      writer.writeTaggedTag(258);
    }
    writer.writeArray(
      this.items,
      (writer, x) => x.serialize(writer),
      this.definiteEncoding,
    );
  }

  // no-op
  free(): void {}

  static from_bytes(
    data: Uint8Array,
    path: string[] = ["certificates"],
  ): certificates {
    let reader = new CBORReader(data);
    return certificates.deserialize(reader, path);
  }

  static from_hex(
    hex_str: string,
    path: string[] = ["certificates"],
  ): certificates {
    return certificates.from_bytes(hexToBytes(hex_str), path);
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(path: string[]): certificates {
    return certificates.from_bytes(this.to_bytes(), path);
  }
}
