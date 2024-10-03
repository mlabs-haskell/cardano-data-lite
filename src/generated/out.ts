import { CBORReader, bigintFromBytes } from "../cbor/reader";
import { CBORWriter } from "../cbor/writer";
import { GrowableBuffer } from "../cbor/growable-buffer";
import { hexToBytes, bytesToHex } from "../hex";
import { arrayEq } from "../eq";
import { bech32 } from "bech32";
import * as cdlCrypto from "../bip32-ed25519";

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

  static deserialize(reader: CBORReader): Anchor {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let url = URL.deserialize(reader);

    let anchor_data_hash = AnchorDataHash.deserialize(reader);

    return new Anchor(url, anchor_data_hash);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    this._url.serialize(writer);
    this._anchor_data_hash.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Anchor {
    let reader = new CBORReader(data);
    return Anchor.deserialize(reader);
  }

  static from_hex(hex_str: string): Anchor {
    return Anchor.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Anchor {
    return Anchor.from_bytes(this.to_bytes());
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
    let decoded = bech32.decode(bech_str);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new AnchorDataHash(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words);
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

  static deserialize(reader: CBORReader): AnchorDataHash {
    return new AnchorDataHash(reader.readBytes());
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

  static deserialize(reader: CBORReader): AssetName {
    return new AssetName(reader.readBytes());
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): AssetName {
    let reader = new CBORReader(data);
    return AssetName.deserialize(reader);
  }

  static from_hex(hex_str: string): AssetName {
    return AssetName.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): AssetName {
    return AssetName.from_bytes(this.to_bytes());
  }
}

export class AssetNames {
  private items: AssetName[];

  constructor(items: AssetName[]) {
    this.items = items;
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

  static deserialize(reader: CBORReader): AssetNames {
    return new AssetNames(
      reader.readArray((reader) => AssetName.deserialize(reader)),
    );
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): AssetNames {
    let reader = new CBORReader(data);
    return AssetNames.deserialize(reader);
  }

  static from_hex(hex_str: string): AssetNames {
    return AssetNames.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): AssetNames {
    return AssetNames.from_bytes(this.to_bytes());
  }
}

export class Assets {
  private items: [AssetName, BigNum][];

  constructor(items: [AssetName, BigNum][]) {
    this.items = items;
  }

  static new(): Assets {
    return new Assets([]);
  }

  len(): number {
    return this.items.length;
  }

  insert(key: AssetName, value: BigNum): BigNum | undefined {
    let entry = this.items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this.items.push([key, value]);
    return undefined;
  }

  get(key: AssetName): BigNum | undefined {
    let entry = this.items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: AssetName[]): void {
    this.items = this.items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  keys(): AssetNames {
    let keys = AssetNames.new();
    for (let [key, _] of this.items) keys.add(key);
    return keys;
  }

  static deserialize(reader: CBORReader): Assets {
    let ret = new Assets([]);
    reader.readMap((reader) =>
      ret.insert(AssetName.deserialize(reader), BigNum.deserialize(reader)),
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this.items, (writer, x) => {
      x[0].serialize(writer);
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Assets {
    let reader = new CBORReader(data);
    return Assets.deserialize(reader);
  }

  static from_hex(hex_str: string): Assets {
    return Assets.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Assets {
    return Assets.from_bytes(this.to_bytes());
  }

  _inplace_checked_add(rhs: Assets): void {
    for (let [asset_name, amount] of rhs.items) {
      let this_amount = this.get(asset_name);
      if (this_amount == null) this_amount = amount;
      else this_amount = this_amount.checked_add(amount);
      this.insert(asset_name, this_amount);
    }
  }

  _inplace_clamped_sub(rhs: Assets): void {
    for (let [asset_name, amount] of rhs.items) {
      let this_amount = this.get(asset_name);
      if (this_amount == null) continue;
      this_amount = this_amount.clamped_sub(amount);
      this.insert(asset_name, this_amount);
    }
    this._normalize();
  }

  _normalize(): void {
    let to_remove: AssetName[] = [];
    for (let [asset_name, amount] of this.items) {
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
    for (let [asset_name, this_amount] of this.items) {
      let rhs_amount = rhs.get(asset_name);
      if (rhs_amount == null) rhs_amount = zero;
      cmps[1 + this_amount.compare(rhs_amount)] = true;
    }

    for (let [asset_name, rhs_amount] of rhs.items) {
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

export class AuxiliaryData {
  private _metadata: GeneralTransactionMetadata;
  private _native_scripts: NativeScripts;
  private _plutus_scripts_v1: PlutusScripts;
  private _plutus_scripts_v2: PlutusScripts;
  private _plutus_scripts_v3: PlutusScripts;

  constructor(
    metadata: GeneralTransactionMetadata,
    native_scripts: NativeScripts,
    plutus_scripts_v1: PlutusScripts,
    plutus_scripts_v2: PlutusScripts,
    plutus_scripts_v3: PlutusScripts,
  ) {
    this._metadata = metadata;
    this._native_scripts = native_scripts;
    this._plutus_scripts_v1 = plutus_scripts_v1;
    this._plutus_scripts_v2 = plutus_scripts_v2;
    this._plutus_scripts_v3 = plutus_scripts_v3;
  }

  static new(
    metadata: GeneralTransactionMetadata,
    native_scripts: NativeScripts,
    plutus_scripts_v1: PlutusScripts,
    plutus_scripts_v2: PlutusScripts,
    plutus_scripts_v3: PlutusScripts,
  ) {
    return new AuxiliaryData(
      metadata,
      native_scripts,
      plutus_scripts_v1,
      plutus_scripts_v2,
      plutus_scripts_v3,
    );
  }

  metadata(): GeneralTransactionMetadata {
    return this._metadata;
  }

  set_metadata(metadata: GeneralTransactionMetadata): void {
    this._metadata = metadata;
  }

  native_scripts(): NativeScripts {
    return this._native_scripts;
  }

  set_native_scripts(native_scripts: NativeScripts): void {
    this._native_scripts = native_scripts;
  }

  plutus_scripts_v1(): PlutusScripts {
    return this._plutus_scripts_v1;
  }

  set_plutus_scripts_v1(plutus_scripts_v1: PlutusScripts): void {
    this._plutus_scripts_v1 = plutus_scripts_v1;
  }

  plutus_scripts_v2(): PlutusScripts {
    return this._plutus_scripts_v2;
  }

  set_plutus_scripts_v2(plutus_scripts_v2: PlutusScripts): void {
    this._plutus_scripts_v2 = plutus_scripts_v2;
  }

  plutus_scripts_v3(): PlutusScripts {
    return this._plutus_scripts_v3;
  }

  set_plutus_scripts_v3(plutus_scripts_v3: PlutusScripts): void {
    this._plutus_scripts_v3 = plutus_scripts_v3;
  }

  static deserialize(reader: CBORReader): AuxiliaryData {
    let fields: any = {};
    reader.readMap((r) => {
      let key = Number(r.readUint());
      switch (key) {
        case 0:
          fields.metadata = GeneralTransactionMetadata.deserialize(r);
          break;

        case 1:
          fields.native_scripts = NativeScripts.deserialize(r);
          break;

        case 2:
          fields.plutus_scripts_v1 = PlutusScripts.deserialize(r);
          break;

        case 3:
          fields.plutus_scripts_v2 = PlutusScripts.deserialize(r);
          break;

        case 4:
          fields.plutus_scripts_v3 = PlutusScripts.deserialize(r);
          break;
      }
    });

    if (fields.metadata === undefined)
      throw new Error("Value not provided for field 0 (metadata)");
    let metadata = fields.metadata;
    if (fields.native_scripts === undefined)
      throw new Error("Value not provided for field 1 (native_scripts)");
    let native_scripts = fields.native_scripts;
    if (fields.plutus_scripts_v1 === undefined)
      throw new Error("Value not provided for field 2 (plutus_scripts_v1)");
    let plutus_scripts_v1 = fields.plutus_scripts_v1;
    if (fields.plutus_scripts_v2 === undefined)
      throw new Error("Value not provided for field 3 (plutus_scripts_v2)");
    let plutus_scripts_v2 = fields.plutus_scripts_v2;
    if (fields.plutus_scripts_v3 === undefined)
      throw new Error("Value not provided for field 4 (plutus_scripts_v3)");
    let plutus_scripts_v3 = fields.plutus_scripts_v3;

    return new AuxiliaryData(
      metadata,
      native_scripts,
      plutus_scripts_v1,
      plutus_scripts_v2,
      plutus_scripts_v3,
    );
  }

  serialize(writer: CBORWriter): void {
    let len = 5;

    writer.writeMapTag(len);

    writer.writeInt(0n);
    this._metadata.serialize(writer);

    writer.writeInt(1n);
    this._native_scripts.serialize(writer);

    writer.writeInt(2n);
    this._plutus_scripts_v1.serialize(writer);

    writer.writeInt(3n);
    this._plutus_scripts_v2.serialize(writer);

    writer.writeInt(4n);
    this._plutus_scripts_v3.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): AuxiliaryData {
    let reader = new CBORReader(data);
    return AuxiliaryData.deserialize(reader);
  }

  static from_hex(hex_str: string): AuxiliaryData {
    return AuxiliaryData.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): AuxiliaryData {
    return AuxiliaryData.from_bytes(this.to_bytes());
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
    let decoded = bech32.decode(bech_str);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new AuxiliaryDataHash(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words);
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

  static deserialize(reader: CBORReader): AuxiliaryDataHash {
    return new AuxiliaryDataHash(reader.readBytes());
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }
}

export class AuxiliaryDataSet {
  private items: [number, AuxiliaryData][];

  constructor(items: [number, AuxiliaryData][]) {
    this.items = items;
  }

  static new(): AuxiliaryDataSet {
    return new AuxiliaryDataSet([]);
  }

  len(): number {
    return this.items.length;
  }

  insert(key: number, value: AuxiliaryData): AuxiliaryData | undefined {
    let entry = this.items.find((x) => key === x[0]);
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this.items.push([key, value]);
    return undefined;
  }

  get(key: number): AuxiliaryData | undefined {
    let entry = this.items.find((x) => key === x[0]);
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: number[]): void {
    this.items = this.items.filter(([k, _v]) =>
      keys.every((key) => !(key === k)),
    );
  }

  static deserialize(reader: CBORReader): AuxiliaryDataSet {
    let ret = new AuxiliaryDataSet([]);
    reader.readMap((reader) =>
      ret.insert(Number(reader.readInt()), AuxiliaryData.deserialize(reader)),
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this.items, (writer, x) => {
      writer.writeInt(BigInt(x[0]));
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): AuxiliaryDataSet {
    let reader = new CBORReader(data);
    return AuxiliaryDataSet.deserialize(reader);
  }

  static from_hex(hex_str: string): AuxiliaryDataSet {
    return AuxiliaryDataSet.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): AuxiliaryDataSet {
    return AuxiliaryDataSet.from_bytes(this.to_bytes());
  }

  indices(): Uint32Array {
    let indices = new Uint32Array(this.items.length);
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      let key = item[0];
      indices[i] = key;
    }
    return indices;
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

  static deserialize(reader: CBORReader): BigNum {
    return new BigNum(reader.readInt());
  }

  serialize(writer: CBORWriter): void {
    writer.writeInt(this.inner);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): BigNum {
    let reader = new CBORReader(data);
    return BigNum.deserialize(reader);
  }

  static from_hex(hex_str: string): BigNum {
    return BigNum.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): BigNum {
    return BigNum.from_bytes(this.to_bytes());
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

  static from_bytes(data: Uint8Array): Bip32PrivateKey {
    return new Bip32PrivateKey(data);
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

  static deserialize(reader: CBORReader): Bip32PrivateKey {
    return new Bip32PrivateKey(reader.readBytes());
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }

  static _BECH32_HRP = "xprv";

  static from_bech32(bech_str: string): Bip32PrivateKey {
    let decoded = bech32.decode(bech_str);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    if (decoded.prefix == Bip32PrivateKey._BECH32_HRP) {
      return new Bip32PrivateKey(bytes);
    } else {
      throw new Error("Invalid prefix for Bip32PrivateKey: " + decoded.prefix);
    }
  }

  to_bech32() {
    let prefix = Bip32PrivateKey._BECH32_HRP;
    bech32.encode(prefix, this.inner);
  }
}

export class Block {
  private _header: Header;
  private _transaction_bodies: TransactionBodies;
  private _transaction_witness_sets: TransactionWitnessSets;
  private _auxiliary_data_set: AuxiliaryDataSet;
  private _invalid_transactions: Uint32Array;

  constructor(
    header: Header,
    transaction_bodies: TransactionBodies,
    transaction_witness_sets: TransactionWitnessSets,
    auxiliary_data_set: AuxiliaryDataSet,
    invalid_transactions: Uint32Array,
  ) {
    this._header = header;
    this._transaction_bodies = transaction_bodies;
    this._transaction_witness_sets = transaction_witness_sets;
    this._auxiliary_data_set = auxiliary_data_set;
    this._invalid_transactions = invalid_transactions;
  }

  static new(
    header: Header,
    transaction_bodies: TransactionBodies,
    transaction_witness_sets: TransactionWitnessSets,
    auxiliary_data_set: AuxiliaryDataSet,
    invalid_transactions: Uint32Array,
  ) {
    return new Block(
      header,
      transaction_bodies,
      transaction_witness_sets,
      auxiliary_data_set,
      invalid_transactions,
    );
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

  invalid_transactions(): Uint32Array {
    return this._invalid_transactions;
  }

  set_invalid_transactions(invalid_transactions: Uint32Array): void {
    this._invalid_transactions = invalid_transactions;
  }

  static deserialize(reader: CBORReader): Block {
    let len = reader.readArrayTag();

    if (len != null && len < 5) {
      throw new Error(
        "Insufficient number of fields in record. Expected 5. Received " + len,
      );
    }

    let header = Header.deserialize(reader);

    let transaction_bodies = TransactionBodies.deserialize(reader);

    let transaction_witness_sets = TransactionWitnessSets.deserialize(reader);

    let auxiliary_data_set = AuxiliaryDataSet.deserialize(reader);

    let invalid_transactions = new Uint32Array(
      reader.readArray((reader) => Number(reader.readUint())),
    );

    return new Block(
      header,
      transaction_bodies,
      transaction_witness_sets,
      auxiliary_data_set,
      invalid_transactions,
    );
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(5);

    this._header.serialize(writer);
    this._transaction_bodies.serialize(writer);
    this._transaction_witness_sets.serialize(writer);
    this._auxiliary_data_set.serialize(writer);
    writer.writeArray(this._invalid_transactions, (writer, x) =>
      writer.writeInt(BigInt(x)),
    );
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Block {
    let reader = new CBORReader(data);
    return Block.deserialize(reader);
  }

  static from_hex(hex_str: string): Block {
    return Block.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Block {
    return Block.from_bytes(this.to_bytes());
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
    let decoded = bech32.decode(bech_str);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new BlockHash(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words);
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

  static deserialize(reader: CBORReader): BlockHash {
    return new BlockHash(reader.readBytes());
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }
}

export class BootstrapWitness {
  private _vkey: unknown;
  private _signature: Ed25519Signature;
  private _chain_code: Uint8Array;
  private _attributes: Uint8Array;

  constructor(
    vkey: unknown,
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
    vkey: unknown,
    signature: Ed25519Signature,
    chain_code: Uint8Array,
    attributes: Uint8Array,
  ) {
    return new BootstrapWitness(vkey, signature, chain_code, attributes);
  }

  vkey(): unknown {
    return this._vkey;
  }

  set_vkey(vkey: unknown): void {
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

  static deserialize(reader: CBORReader): BootstrapWitness {
    let len = reader.readArrayTag();

    if (len != null && len < 4) {
      throw new Error(
        "Insufficient number of fields in record. Expected 4. Received " + len,
      );
    }

    let vkey = $$CANT_READ("Vkey");

    let signature = Ed25519Signature.deserialize(reader);

    let chain_code = reader.readBytes();

    let attributes = reader.readBytes();

    return new BootstrapWitness(vkey, signature, chain_code, attributes);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(4);

    $$CANT_WRITE("Vkey");
    this._signature.serialize(writer);
    writer.writeBytes(this._chain_code);
    writer.writeBytes(this._attributes);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): BootstrapWitness {
    let reader = new CBORReader(data);
    return BootstrapWitness.deserialize(reader);
  }

  static from_hex(hex_str: string): BootstrapWitness {
    return BootstrapWitness.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): BootstrapWitness {
    return BootstrapWitness.from_bytes(this.to_bytes());
  }
}

export class BootstrapWitnesses {
  private items: BootstrapWitness[];

  constructor(items: BootstrapWitness[]) {
    this.items = items;
  }

  static new(): BootstrapWitnesses {
    return new BootstrapWitnesses([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): BootstrapWitness {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: BootstrapWitness): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader): BootstrapWitnesses {
    return new BootstrapWitnesses(
      reader.readArray((reader) => BootstrapWitness.deserialize(reader)),
    );
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): BootstrapWitnesses {
    let reader = new CBORReader(data);
    return BootstrapWitnesses.deserialize(reader);
  }

  static from_hex(hex_str: string): BootstrapWitnesses {
    return BootstrapWitnesses.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): BootstrapWitnesses {
    return BootstrapWitnesses.from_bytes(this.to_bytes());
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

  static from_bytes(data: Uint8Array): CSLBigInt {
    let reader = new CBORReader(data);
    return CSLBigInt.deserialize(reader);
  }

  static from_hex(hex_str: string): CSLBigInt {
    return CSLBigInt.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): CSLBigInt {
    return CSLBigInt.from_bytes(this.to_bytes());
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

  pow(other: CSLBigInt): CSLBigInt {
    let res = this.toJsValue() ** other.toJsValue();
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

  static deserialize(reader: CBORReader): CSLBigInt {
    let typ = reader.peekType();
    if (typ == "uint" || typ == "nint") {
      let value = reader.readInt();
      return new CSLBigInt(value);
    }

    // if not uint non nint, must be tagged
    let tag = reader.readTaggedTag();
    let isNegative;
    if (tag == 2) {
      isNegative = false;
    } else if (tag == 3) {
      isNegative = true;
    } else {
      throw new Error("Unknown tag: " + tag + ". Expected 2 or 3");
    }

    let bytes = reader.readBytes();
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
  DrepRegistration = 16,
  DrepDeregistration = 17,
  DrepUpdate = 18,
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
  | { kind: 16; value: DrepRegistration }
  | { kind: 17; value: DrepDeregistration }
  | { kind: 18; value: DrepUpdate };

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
    drep_registration: DrepRegistration,
  ): Certificate {
    return new Certificate({ kind: 16, value: drep_registration });
  }

  static new_drep_deregistration(
    drep_deregistration: DrepDeregistration,
  ): Certificate {
    return new Certificate({ kind: 17, value: drep_deregistration });
  }

  static new_drep_update(drep_update: DrepUpdate): Certificate {
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

  as_drep_registration(): DrepRegistration | undefined {
    if (this.variant.kind == 16) return this.variant.value;
  }

  as_drep_deregistration(): DrepDeregistration | undefined {
    if (this.variant.kind == 17) return this.variant.value;
  }

  as_drep_update(): DrepUpdate | undefined {
    if (this.variant.kind == 18) return this.variant.value;
  }

  kind(): CertificateKind {
    return this.variant.kind;
  }

  static deserialize(reader: CBORReader): Certificate {
    let len = reader.readArrayTag();
    let tag = Number(reader.readUint());
    let variant: CertificateVariant;

    switch (tag) {
      case 0:
        if (len != null && len - 1 != 1) {
          throw new Error("Expected 1 items to decode StakeRegistration");
        }
        variant = {
          kind: 0,
          value: StakeRegistration.deserialize(reader),
        };

        break;

      case 1:
        if (len != null && len - 1 != 1) {
          throw new Error("Expected 1 items to decode StakeDeregistration");
        }
        variant = {
          kind: 1,
          value: StakeDeregistration.deserialize(reader),
        };

        break;

      case 2:
        if (len != null && len - 1 != 2) {
          throw new Error("Expected 2 items to decode StakeDelegation");
        }
        variant = {
          kind: 2,
          value: StakeDelegation.deserialize(reader),
        };

        break;

      case 3:
        if (len != null && len - 1 != 9) {
          throw new Error("Expected 9 items to decode PoolRegistration");
        }
        variant = {
          kind: 3,
          value: PoolRegistration.deserialize(reader),
        };

        break;

      case 4:
        if (len != null && len - 1 != 2) {
          throw new Error("Expected 2 items to decode PoolRetirement");
        }
        variant = {
          kind: 4,
          value: PoolRetirement.deserialize(reader),
        };

        break;

      case 7:
        if (len != null && len - 1 != 2) {
          throw new Error("Expected 2 items to decode RegCert");
        }
        variant = {
          kind: 7,
          value: RegCert.deserialize(reader),
        };

        break;

      case 8:
        if (len != null && len - 1 != 2) {
          throw new Error("Expected 2 items to decode UnregCert");
        }
        variant = {
          kind: 8,
          value: UnregCert.deserialize(reader),
        };

        break;

      case 9:
        if (len != null && len - 1 != 2) {
          throw new Error("Expected 2 items to decode VoteDelegation");
        }
        variant = {
          kind: 9,
          value: VoteDelegation.deserialize(reader),
        };

        break;

      case 10:
        if (len != null && len - 1 != 3) {
          throw new Error("Expected 3 items to decode StakeAndVoteDelegation");
        }
        variant = {
          kind: 10,
          value: StakeAndVoteDelegation.deserialize(reader),
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
          value: StakeRegistrationAndDelegation.deserialize(reader),
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
          value: VoteRegistrationAndDelegation.deserialize(reader),
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
          value: StakeVoteRegistrationAndDelegation.deserialize(reader),
        };

        break;

      case 14:
        if (len != null && len - 1 != 2) {
          throw new Error("Expected 2 items to decode CommitteeHotAuth");
        }
        variant = {
          kind: 14,
          value: CommitteeHotAuth.deserialize(reader),
        };

        break;

      case 15:
        if (len != null && len - 1 != 2) {
          throw new Error("Expected 2 items to decode CommitteeColdResign");
        }
        variant = {
          kind: 15,
          value: CommitteeColdResign.deserialize(reader),
        };

        break;

      case 16:
        if (len != null && len - 1 != 3) {
          throw new Error("Expected 3 items to decode DrepRegistration");
        }
        variant = {
          kind: 16,
          value: DrepRegistration.deserialize(reader),
        };

        break;

      case 17:
        if (len != null && len - 1 != 2) {
          throw new Error("Expected 2 items to decode DrepDeregistration");
        }
        variant = {
          kind: 17,
          value: DrepDeregistration.deserialize(reader),
        };

        break;

      case 18:
        if (len != null && len - 1 != 2) {
          throw new Error("Expected 2 items to decode DrepUpdate");
        }
        variant = {
          kind: 18,
          value: DrepUpdate.deserialize(reader),
        };

        break;
    }

    if (len == null) {
      reader.readBreak();
    }

    throw new Error("Unexpected tag for Certificate: " + tag);
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

  static from_bytes(data: Uint8Array): Certificate {
    let reader = new CBORReader(data);
    return Certificate.deserialize(reader);
  }

  static from_hex(hex_str: string): Certificate {
    return Certificate.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Certificate {
    return Certificate.from_bytes(this.to_bytes());
  }
}

export class Certificates {
  private items: Certificate[];

  constructor() {
    this.items = [];
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

  static deserialize(reader: CBORReader): Certificates {
    let ret = new Certificates();
    if (reader.peekType() == "tagged") {
      let tag = reader.readTaggedTag();
      if (tag != 258) throw new Error("Expected tag 258. Got " + tag);
    }
    reader.readArray((reader) => ret.add(Certificate.deserialize(reader)));
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeTaggedTag(258);
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Certificates {
    let reader = new CBORReader(data);
    return Certificates.deserialize(reader);
  }

  static from_hex(hex_str: string): Certificates {
    return Certificates.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Certificates {
    return Certificates.from_bytes(this.to_bytes());
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
    return new Credentials(this.members_.items.map(([k, _v]) => k));
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

  static new(
    committee_cold_credential: Credential,
    anchor: Anchor | undefined,
  ) {
    return new CommitteeColdResign(committee_cold_credential, anchor);
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

  static deserialize(reader: CBORReader): CommitteeColdResign {
    let committee_cold_credential = Credential.deserialize(reader);

    let anchor = reader.readNullable((r) => Anchor.deserialize(r)) ?? undefined;

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

  static from_bytes(data: Uint8Array): CommitteeColdResign {
    let reader = new CBORReader(data);
    return CommitteeColdResign.deserialize(reader);
  }

  static from_hex(hex_str: string): CommitteeColdResign {
    return CommitteeColdResign.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): CommitteeColdResign {
    return CommitteeColdResign.from_bytes(this.to_bytes());
  }
}

export class CommitteeEpochs {
  private items: [Credential, number][];

  constructor(items: [Credential, number][]) {
    this.items = items;
  }

  static new(): CommitteeEpochs {
    return new CommitteeEpochs([]);
  }

  len(): number {
    return this.items.length;
  }

  insert(key: Credential, value: number): number | undefined {
    let entry = this.items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this.items.push([key, value]);
    return undefined;
  }

  get(key: Credential): number | undefined {
    let entry = this.items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: Credential[]): void {
    this.items = this.items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  static deserialize(reader: CBORReader): CommitteeEpochs {
    let ret = new CommitteeEpochs([]);
    reader.readMap((reader) =>
      ret.insert(Credential.deserialize(reader), Number(reader.readInt())),
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this.items, (writer, x) => {
      x[0].serialize(writer);
      writer.writeInt(BigInt(x[1]));
    });
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): CommitteeEpochs {
    let reader = new CBORReader(data);
    return CommitteeEpochs.deserialize(reader);
  }

  static from_hex(hex_str: string): CommitteeEpochs {
    return CommitteeEpochs.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): CommitteeEpochs {
    return CommitteeEpochs.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): CommitteeHotAuth {
    let committee_cold_credential = Credential.deserialize(reader);

    let committee_hot_credential = Credential.deserialize(reader);

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

  static from_bytes(data: Uint8Array): CommitteeHotAuth {
    let reader = new CBORReader(data);
    return CommitteeHotAuth.deserialize(reader);
  }

  static from_hex(hex_str: string): CommitteeHotAuth {
    return CommitteeHotAuth.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): CommitteeHotAuth {
    return CommitteeHotAuth.from_bytes(this.to_bytes());
  }
}

export class Constitution {
  private _anchor: Anchor;
  private _scripthash: ScriptHash | undefined;

  constructor(anchor: Anchor, scripthash: ScriptHash | undefined) {
    this._anchor = anchor;
    this._scripthash = scripthash;
  }

  static new(anchor: Anchor, scripthash: ScriptHash | undefined) {
    return new Constitution(anchor, scripthash);
  }

  anchor(): Anchor {
    return this._anchor;
  }

  set_anchor(anchor: Anchor): void {
    this._anchor = anchor;
  }

  scripthash(): ScriptHash | undefined {
    return this._scripthash;
  }

  set_scripthash(scripthash: ScriptHash | undefined): void {
    this._scripthash = scripthash;
  }

  static deserialize(reader: CBORReader): Constitution {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let anchor = Anchor.deserialize(reader);

    let scripthash =
      reader.readNullable((r) => ScriptHash.deserialize(r)) ?? undefined;

    return new Constitution(anchor, scripthash);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    this._anchor.serialize(writer);
    if (this._scripthash == null) {
      writer.writeNull();
    } else {
      this._scripthash.serialize(writer);
    }
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Constitution {
    let reader = new CBORReader(data);
    return Constitution.deserialize(reader);
  }

  static from_hex(hex_str: string): Constitution {
    return Constitution.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Constitution {
    return Constitution.from_bytes(this.to_bytes());
  }
}

export class ConstrPlutusData {
  private _alternative: BigNum;
  private _data: PlutusList;

  constructor(alternative: BigNum, data: PlutusList) {
    this._alternative = alternative;
    this._data = data;
  }

  static new(alternative: BigNum, data: PlutusList) {
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

  static deserialize(reader: CBORReader): ConstrPlutusData {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let alternative = BigNum.deserialize(reader);

    let data = PlutusList.deserialize(reader);

    return new ConstrPlutusData(alternative, data);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    this._alternative.serialize(writer);
    this._data.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): ConstrPlutusData {
    let reader = new CBORReader(data);
    return ConstrPlutusData.deserialize(reader);
  }

  static from_hex(hex_str: string): ConstrPlutusData {
    return ConstrPlutusData.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): ConstrPlutusData {
    return ConstrPlutusData.from_bytes(this.to_bytes());
  }
}

export class CostMdls {
  private items: [Language, CostModel][];

  constructor(items: [Language, CostModel][]) {
    this.items = items;
  }

  static new(): CostMdls {
    return new CostMdls([]);
  }

  len(): number {
    return this.items.length;
  }

  insert(key: Language, value: CostModel): CostModel | undefined {
    let entry = this.items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this.items.push([key, value]);
    return undefined;
  }

  get(key: Language): CostModel | undefined {
    let entry = this.items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: Language[]): void {
    this.items = this.items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  keys(): Languages {
    let keys = Languages.new();
    for (let [key, _] of this.items) keys.add(key);
    return keys;
  }

  static deserialize(reader: CBORReader): CostMdls {
    let ret = new CostMdls([]);
    reader.readMap((reader) =>
      ret.insert(Language.deserialize(reader), CostModel.deserialize(reader)),
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this.items, (writer, x) => {
      x[0].serialize(writer);
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): CostMdls {
    let reader = new CBORReader(data);
    return CostMdls.deserialize(reader);
  }

  static from_hex(hex_str: string): CostMdls {
    return CostMdls.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): CostMdls {
    return CostMdls.from_bytes(this.to_bytes());
  }

  retain_language_versions(languages: Languages): CostMdls {
    const result = new CostMdls([]);

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

export class CostModel {
  private items: Int[];

  constructor(items: Int[]) {
    this.items = items;
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

  static deserialize(reader: CBORReader): CostModel {
    return new CostModel(reader.readArray((reader) => Int.deserialize(reader)));
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): CostModel {
    let reader = new CBORReader(data);
    return CostModel.deserialize(reader);
  }

  static from_hex(hex_str: string): CostModel {
    return CostModel.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): CostModel {
    return CostModel.from_bytes(this.to_bytes());
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

export enum CredentialKind {
  Ed25519KeyHash = 0,
  ScriptHash = 1,
}

export type CredentialVariant =
  | { kind: 0; value: Ed25519KeyHash }
  | { kind: 1; value: ScriptHash };

export class Credential {
  private variant: CredentialVariant;

  constructor(variant: CredentialVariant) {
    this.variant = variant;
  }

  static new_keyhash(keyhash: Ed25519KeyHash): Credential {
    return new Credential({ kind: 0, value: keyhash });
  }

  static new_scripthash(scripthash: ScriptHash): Credential {
    return new Credential({ kind: 1, value: scripthash });
  }

  as_keyhash(): Ed25519KeyHash | undefined {
    if (this.variant.kind == 0) return this.variant.value;
  }

  as_scripthash(): ScriptHash | undefined {
    if (this.variant.kind == 1) return this.variant.value;
  }

  kind(): CredentialKind {
    return this.variant.kind;
  }

  static deserialize(reader: CBORReader): Credential {
    let len = reader.readArrayTag();
    let tag = Number(reader.readUint());
    let variant: CredentialVariant;

    switch (tag) {
      case 0:
        if (len != null && len - 1 != 1) {
          throw new Error("Expected 1 items to decode Ed25519KeyHash");
        }
        variant = {
          kind: 0,
          value: Ed25519KeyHash.deserialize(reader),
        };

        break;

      case 1:
        if (len != null && len - 1 != 1) {
          throw new Error("Expected 1 items to decode ScriptHash");
        }
        variant = {
          kind: 1,
          value: ScriptHash.deserialize(reader),
        };

        break;
    }

    if (len == null) {
      reader.readBreak();
    }

    throw new Error("Unexpected tag for Credential: " + tag);
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

  static from_bytes(data: Uint8Array): Credential {
    let reader = new CBORReader(data);
    return Credential.deserialize(reader);
  }

  static from_hex(hex_str: string): Credential {
    return Credential.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Credential {
    return Credential.from_bytes(this.to_bytes());
  }
}

export class Credentials {
  private items: Credential[];

  constructor() {
    this.items = [];
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

  static deserialize(reader: CBORReader): Credentials {
    let ret = new Credentials();
    if (reader.peekType() == "tagged") {
      let tag = reader.readTaggedTag();
      if (tag != 258) throw new Error("Expected tag 258. Got " + tag);
    }
    reader.readArray((reader) => ret.add(Credential.deserialize(reader)));
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeTaggedTag(258);
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Credentials {
    let reader = new CBORReader(data);
    return Credentials.deserialize(reader);
  }

  static from_hex(hex_str: string): Credentials {
    return Credentials.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Credentials {
    return Credentials.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): DNSRecordAorAAAA {
    return new DNSRecordAorAAAA(reader.readString());
  }

  serialize(writer: CBORWriter): void {
    writer.writeString(this.inner);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): DNSRecordAorAAAA {
    let reader = new CBORReader(data);
    return DNSRecordAorAAAA.deserialize(reader);
  }

  static from_hex(hex_str: string): DNSRecordAorAAAA {
    return DNSRecordAorAAAA.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): DNSRecordAorAAAA {
    return DNSRecordAorAAAA.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): DNSRecordSRV {
    return new DNSRecordSRV(reader.readString());
  }

  serialize(writer: CBORWriter): void {
    writer.writeString(this.inner);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): DNSRecordSRV {
    let reader = new CBORReader(data);
    return DNSRecordSRV.deserialize(reader);
  }

  static from_hex(hex_str: string): DNSRecordSRV {
    return DNSRecordSRV.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): DNSRecordSRV {
    return DNSRecordSRV.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): DRep {
    let len = reader.readArrayTag();
    let tag = Number(reader.readUint());
    let variant: DRepVariant;

    switch (tag) {
      case 0:
        if (len != null && len - 1 != 1) {
          throw new Error("Expected 1 items to decode Ed25519KeyHash");
        }
        variant = {
          kind: 0,
          value: Ed25519KeyHash.deserialize(reader),
        };

        break;

      case 1:
        if (len != null && len - 1 != 1) {
          throw new Error("Expected 1 items to decode ScriptHash");
        }
        variant = {
          kind: 1,
          value: ScriptHash.deserialize(reader),
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
    }

    if (len == null) {
      reader.readBreak();
    }

    throw new Error("Unexpected tag for DRep: " + tag);
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

  static from_bytes(data: Uint8Array): DRep {
    let reader = new CBORReader(data);
    return DRep.deserialize(reader);
  }

  static from_hex(hex_str: string): DRep {
    return DRep.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): DRep {
    return DRep.from_bytes(this.to_bytes());
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
    let decoded = bech32.decode(bech_str);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new DataHash(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words);
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

  static deserialize(reader: CBORReader): DataHash {
    return new DataHash(reader.readBytes());
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }
}

export enum DataOptionKind {
  DataHash = 0,
  PlutusData = 1,
}

export type DataOptionVariant =
  | { kind: 0; value: DataHash }
  | { kind: 1; value: unknown };

export class DataOption {
  private variant: DataOptionVariant;

  constructor(variant: DataOptionVariant) {
    this.variant = variant;
  }

  static new_hash(hash: DataHash): DataOption {
    return new DataOption({ kind: 0, value: hash });
  }

  static new_data(data: unknown): DataOption {
    return new DataOption({ kind: 1, value: data });
  }

  as_hash(): DataHash | undefined {
    if (this.variant.kind == 0) return this.variant.value;
  }

  as_data(): unknown | undefined {
    if (this.variant.kind == 1) return this.variant.value;
  }

  kind(): DataOptionKind {
    return this.variant.kind;
  }

  static deserialize(reader: CBORReader): DataOption {
    let len = reader.readArrayTag();
    let tag = Number(reader.readUint());
    let variant: DataOptionVariant;

    switch (tag) {
      case 0:
        if (len != null && len - 1 != 1) {
          throw new Error("Expected 1 items to decode DataHash");
        }
        variant = {
          kind: 0,
          value: DataHash.deserialize(reader),
        };

        break;

      case 1:
        if (len != null && len - 1 != 1) {
          throw new Error("Expected 1 items to decode PlutusData");
        }
        variant = {
          kind: 1,
          value: $$CANT_READ("PlutusData"),
        };

        break;
    }

    if (len == null) {
      reader.readBreak();
    }

    throw new Error("Unexpected tag for DataOption: " + tag);
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
        $$CANT_WRITE("PlutusData");
        break;
    }
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): DataOption {
    let reader = new CBORReader(data);
    return DataOption.deserialize(reader);
  }

  static from_hex(hex_str: string): DataOption {
    return DataOption.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): DataOption {
    return DataOption.from_bytes(this.to_bytes());
  }
}

export class DrepDeregistration {
  private _drep_credential: Credential;
  private _coin: BigNum;

  constructor(drep_credential: Credential, coin: BigNum) {
    this._drep_credential = drep_credential;
    this._coin = coin;
  }

  static new(drep_credential: Credential, coin: BigNum) {
    return new DrepDeregistration(drep_credential, coin);
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

  static deserialize(reader: CBORReader): DrepDeregistration {
    let drep_credential = Credential.deserialize(reader);

    let coin = BigNum.deserialize(reader);

    return new DrepDeregistration(drep_credential, coin);
  }

  serialize(writer: CBORWriter): void {
    this._drep_credential.serialize(writer);
    this._coin.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): DrepDeregistration {
    let reader = new CBORReader(data);
    return DrepDeregistration.deserialize(reader);
  }

  static from_hex(hex_str: string): DrepDeregistration {
    return DrepDeregistration.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): DrepDeregistration {
    return DrepDeregistration.from_bytes(this.to_bytes());
  }
}

export class DrepRegistration {
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

  static new(
    voting_credential: Credential,
    coin: BigNum,
    anchor: Anchor | undefined,
  ) {
    return new DrepRegistration(voting_credential, coin, anchor);
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

  static deserialize(reader: CBORReader): DrepRegistration {
    let voting_credential = Credential.deserialize(reader);

    let coin = BigNum.deserialize(reader);

    let anchor = reader.readNullable((r) => Anchor.deserialize(r)) ?? undefined;

    return new DrepRegistration(voting_credential, coin, anchor);
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

  static from_bytes(data: Uint8Array): DrepRegistration {
    let reader = new CBORReader(data);
    return DrepRegistration.deserialize(reader);
  }

  static from_hex(hex_str: string): DrepRegistration {
    return DrepRegistration.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): DrepRegistration {
    return DrepRegistration.from_bytes(this.to_bytes());
  }
}

export class DrepUpdate {
  private _drep_credential: Credential;
  private _anchor: Anchor | undefined;

  constructor(drep_credential: Credential, anchor: Anchor | undefined) {
    this._drep_credential = drep_credential;
    this._anchor = anchor;
  }

  static new(drep_credential: Credential, anchor: Anchor | undefined) {
    return new DrepUpdate(drep_credential, anchor);
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

  static deserialize(reader: CBORReader): DrepUpdate {
    let drep_credential = Credential.deserialize(reader);

    let anchor = reader.readNullable((r) => Anchor.deserialize(r)) ?? undefined;

    return new DrepUpdate(drep_credential, anchor);
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

  static from_bytes(data: Uint8Array): DrepUpdate {
    let reader = new CBORReader(data);
    return DrepUpdate.deserialize(reader);
  }

  static from_hex(hex_str: string): DrepUpdate {
    return DrepUpdate.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): DrepUpdate {
    return DrepUpdate.from_bytes(this.to_bytes());
  }
}

export class DrepVotingThresholds {
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
    return new DrepVotingThresholds(
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

  static deserialize(reader: CBORReader): DrepVotingThresholds {
    let len = reader.readArrayTag();

    if (len != null && len < 10) {
      throw new Error(
        "Insufficient number of fields in record. Expected 10. Received " + len,
      );
    }

    let motion_no_confidence = UnitInterval.deserialize(reader);

    let committee_normal = UnitInterval.deserialize(reader);

    let committee_no_confidence = UnitInterval.deserialize(reader);

    let update_constitution = UnitInterval.deserialize(reader);

    let hard_fork_initiation = UnitInterval.deserialize(reader);

    let pp_network_group = UnitInterval.deserialize(reader);

    let pp_economic_group = UnitInterval.deserialize(reader);

    let pp_technical_group = UnitInterval.deserialize(reader);

    let pp_governance_group = UnitInterval.deserialize(reader);

    let treasury_withdrawal = UnitInterval.deserialize(reader);

    return new DrepVotingThresholds(
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
    writer.writeArrayTag(10);

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

  static from_bytes(data: Uint8Array): DrepVotingThresholds {
    let reader = new CBORReader(data);
    return DrepVotingThresholds.deserialize(reader);
  }

  static from_hex(hex_str: string): DrepVotingThresholds {
    return DrepVotingThresholds.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): DrepVotingThresholds {
    return DrepVotingThresholds.from_bytes(this.to_bytes());
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
    let decoded = bech32.decode(bech_str);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new Ed25519KeyHash(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words);
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

  static deserialize(reader: CBORReader): Ed25519KeyHash {
    return new Ed25519KeyHash(reader.readBytes());
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }
}

export class Ed25519KeyHashes {
  private items: Ed25519KeyHash[];

  constructor() {
    this.items = [];
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

  static deserialize(reader: CBORReader): Ed25519KeyHashes {
    let ret = new Ed25519KeyHashes();
    if (reader.peekType() == "tagged") {
      let tag = reader.readTaggedTag();
      if (tag != 258) throw new Error("Expected tag 258. Got " + tag);
    }
    reader.readArray((reader) => ret.add(Ed25519KeyHash.deserialize(reader)));
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeTaggedTag(258);
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Ed25519KeyHashes {
    let reader = new CBORReader(data);
    return Ed25519KeyHashes.deserialize(reader);
  }

  static from_hex(hex_str: string): Ed25519KeyHashes {
    return Ed25519KeyHashes.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Ed25519KeyHashes {
    return Ed25519KeyHashes.from_bytes(this.to_bytes());
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

  static from_bech32(bech_str: string): Ed25519Signature {
    let decoded = bech32.decode(bech_str);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new Ed25519Signature(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words);
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

  static deserialize(reader: CBORReader): Ed25519Signature {
    return new Ed25519Signature(reader.readBytes());
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
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

  static deserialize(reader: CBORReader): ExUnitPrices {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let mem_price = UnitInterval.deserialize(reader);

    let step_price = UnitInterval.deserialize(reader);

    return new ExUnitPrices(mem_price, step_price);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    this._mem_price.serialize(writer);
    this._step_price.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): ExUnitPrices {
    let reader = new CBORReader(data);
    return ExUnitPrices.deserialize(reader);
  }

  static from_hex(hex_str: string): ExUnitPrices {
    return ExUnitPrices.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): ExUnitPrices {
    return ExUnitPrices.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): ExUnits {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let mem = BigNum.deserialize(reader);

    let steps = BigNum.deserialize(reader);

    return new ExUnits(mem, steps);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    this._mem.serialize(writer);
    this._steps.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): ExUnits {
    let reader = new CBORReader(data);
    return ExUnits.deserialize(reader);
  }

  static from_hex(hex_str: string): ExUnits {
    return ExUnits.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): ExUnits {
    return ExUnits.from_bytes(this.to_bytes());
  }
}

export class GeneralTransactionMetadata {
  private items: [BigNum, TransactionMetadatum][];

  constructor(items: [BigNum, TransactionMetadatum][]) {
    this.items = items;
  }

  static new(): GeneralTransactionMetadata {
    return new GeneralTransactionMetadata([]);
  }

  len(): number {
    return this.items.length;
  }

  insert(
    key: BigNum,
    value: TransactionMetadatum,
  ): TransactionMetadatum | undefined {
    let entry = this.items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this.items.push([key, value]);
    return undefined;
  }

  get(key: BigNum): TransactionMetadatum | undefined {
    let entry = this.items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: BigNum[]): void {
    this.items = this.items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  keys(): TransactionMetadatumLabels {
    let keys = TransactionMetadatumLabels.new();
    for (let [key, _] of this.items) keys.add(key);
    return keys;
  }

  static deserialize(reader: CBORReader): GeneralTransactionMetadata {
    let ret = new GeneralTransactionMetadata([]);
    reader.readMap((reader) =>
      ret.insert(
        BigNum.deserialize(reader),
        TransactionMetadatum.deserialize(reader),
      ),
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this.items, (writer, x) => {
      x[0].serialize(writer);
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): GeneralTransactionMetadata {
    let reader = new CBORReader(data);
    return GeneralTransactionMetadata.deserialize(reader);
  }

  static from_hex(hex_str: string): GeneralTransactionMetadata {
    return GeneralTransactionMetadata.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): GeneralTransactionMetadata {
    return GeneralTransactionMetadata.from_bytes(this.to_bytes());
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
    let decoded = bech32.decode(bech_str);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new GenesisDelegateHash(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words);
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

  static deserialize(reader: CBORReader): GenesisDelegateHash {
    return new GenesisDelegateHash(reader.readBytes());
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
    let decoded = bech32.decode(bech_str);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new GenesisHash(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words);
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

  static deserialize(reader: CBORReader): GenesisHash {
    return new GenesisHash(reader.readBytes());
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }
}

export class GenesisHashes {
  private items: GenesisHash[];

  constructor(items: GenesisHash[]) {
    this.items = items;
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

  static deserialize(reader: CBORReader): GenesisHashes {
    return new GenesisHashes(
      reader.readArray((reader) => GenesisHash.deserialize(reader)),
    );
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): GenesisHashes {
    let reader = new CBORReader(data);
    return GenesisHashes.deserialize(reader);
  }

  static from_hex(hex_str: string): GenesisHashes {
    return GenesisHashes.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): GenesisHashes {
    return GenesisHashes.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): GovernanceAction {
    let len = reader.readArrayTag();
    let tag = Number(reader.readUint());
    let variant: GovernanceActionVariant;

    switch (tag) {
      case 0:
        if (len != null && len - 1 != 3) {
          throw new Error("Expected 3 items to decode ParameterChangeAction");
        }
        variant = {
          kind: 0,
          value: ParameterChangeAction.deserialize(reader),
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
          value: HardForkInitiationAction.deserialize(reader),
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
          value: TreasuryWithdrawalsAction.deserialize(reader),
        };

        break;

      case 3:
        if (len != null && len - 1 != 1) {
          throw new Error("Expected 1 items to decode NoConfidenceAction");
        }
        variant = {
          kind: 3,
          value: NoConfidenceAction.deserialize(reader),
        };

        break;

      case 4:
        if (len != null && len - 1 != 3) {
          throw new Error("Expected 3 items to decode UpdateCommitteeAction");
        }
        variant = {
          kind: 4,
          value: UpdateCommitteeAction.deserialize(reader),
        };

        break;

      case 5:
        if (len != null && len - 1 != 2) {
          throw new Error("Expected 2 items to decode NewConstitutionAction");
        }
        variant = {
          kind: 5,
          value: NewConstitutionAction.deserialize(reader),
        };

        break;

      case 6:
        if (len != null && len - 1 != 0) {
          throw new Error("Expected 0 items to decode InfoAction");
        }
        variant = {
          kind: 6,
          value: InfoAction.deserialize(reader),
        };

        break;
    }

    if (len == null) {
      reader.readBreak();
    }

    throw new Error("Unexpected tag for GovernanceAction: " + tag);
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
        writer.writeArrayTag(4);
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

  static from_bytes(data: Uint8Array): GovernanceAction {
    let reader = new CBORReader(data);
    return GovernanceAction.deserialize(reader);
  }

  static from_hex(hex_str: string): GovernanceAction {
    return GovernanceAction.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): GovernanceAction {
    return GovernanceAction.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): GovernanceActionId {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let transaction_id = TransactionHash.deserialize(reader);

    let index = Number(reader.readInt());

    return new GovernanceActionId(transaction_id, index);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    this._transaction_id.serialize(writer);
    writer.writeInt(BigInt(this._index));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): GovernanceActionId {
    let reader = new CBORReader(data);
    return GovernanceActionId.deserialize(reader);
  }

  static from_hex(hex_str: string): GovernanceActionId {
    return GovernanceActionId.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): GovernanceActionId {
    return GovernanceActionId.from_bytes(this.to_bytes());
  }
}

export class GovernanceActionIds {
  private items: GovernanceActionId[];

  constructor(items: GovernanceActionId[]) {
    this.items = items;
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

  static deserialize(reader: CBORReader): GovernanceActionIds {
    return new GovernanceActionIds(
      reader.readArray((reader) => GovernanceActionId.deserialize(reader)),
    );
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): GovernanceActionIds {
    let reader = new CBORReader(data);
    return GovernanceActionIds.deserialize(reader);
  }

  static from_hex(hex_str: string): GovernanceActionIds {
    return GovernanceActionIds.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): GovernanceActionIds {
    return GovernanceActionIds.from_bytes(this.to_bytes());
  }
}

export class GovernanceActions {
  private items: [GovernanceActionId, VotingProcedure][];

  constructor(items: [GovernanceActionId, VotingProcedure][]) {
    this.items = items;
  }

  static new(): GovernanceActions {
    return new GovernanceActions([]);
  }

  len(): number {
    return this.items.length;
  }

  insert(
    key: GovernanceActionId,
    value: VotingProcedure,
  ): VotingProcedure | undefined {
    let entry = this.items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this.items.push([key, value]);
    return undefined;
  }

  get(key: GovernanceActionId): VotingProcedure | undefined {
    let entry = this.items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: GovernanceActionId[]): void {
    this.items = this.items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  keys(): GovernanceActionIds {
    let keys = GovernanceActionIds.new();
    for (let [key, _] of this.items) keys.add(key);
    return keys;
  }

  static deserialize(reader: CBORReader): GovernanceActions {
    let ret = new GovernanceActions([]);
    reader.readMap((reader) =>
      ret.insert(
        GovernanceActionId.deserialize(reader),
        VotingProcedure.deserialize(reader),
      ),
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this.items, (writer, x) => {
      x[0].serialize(writer);
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): GovernanceActions {
    let reader = new CBORReader(data);
    return GovernanceActions.deserialize(reader);
  }

  static from_hex(hex_str: string): GovernanceActions {
    return GovernanceActions.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): GovernanceActions {
    return GovernanceActions.from_bytes(this.to_bytes());
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

  static new(
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

  static deserialize(reader: CBORReader): HardForkInitiationAction {
    let gov_action_id =
      reader.readNullable((r) => GovernanceActionId.deserialize(r)) ??
      undefined;

    let protocol_version = ProtocolVersion.deserialize(reader);

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

  static from_bytes(data: Uint8Array): HardForkInitiationAction {
    let reader = new CBORReader(data);
    return HardForkInitiationAction.deserialize(reader);
  }

  static from_hex(hex_str: string): HardForkInitiationAction {
    return HardForkInitiationAction.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): HardForkInitiationAction {
    return HardForkInitiationAction.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): Header {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let header_body = HeaderBody.deserialize(reader);

    let body_signature = KESSignature.deserialize(reader);

    return new Header(header_body, body_signature);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    this._header_body.serialize(writer);
    this._body_signature.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Header {
    let reader = new CBORReader(data);
    return Header.deserialize(reader);
  }

  static from_hex(hex_str: string): Header {
    return Header.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Header {
    return Header.from_bytes(this.to_bytes());
  }
}

export class HeaderBody {
  private _block_number: number;
  private _slot: BigNum;
  private _prev_hash: BlockHash | undefined;
  private _issuer_vkey: unknown;
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
    issuer_vkey: unknown,
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

  static new(
    block_number: number,
    slot: BigNum,
    prev_hash: BlockHash | undefined,
    issuer_vkey: unknown,
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

  slot(): BigNum {
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

  issuer_vkey(): unknown {
    return this._issuer_vkey;
  }

  set_issuer_vkey(issuer_vkey: unknown): void {
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

  static deserialize(reader: CBORReader): HeaderBody {
    let len = reader.readArrayTag();

    if (len != null && len < 10) {
      throw new Error(
        "Insufficient number of fields in record. Expected 10. Received " + len,
      );
    }

    let block_number = Number(reader.readInt());

    let slot = BigNum.deserialize(reader);

    let prev_hash =
      reader.readNullable((r) => BlockHash.deserialize(r)) ?? undefined;

    let issuer_vkey = $$CANT_READ("Vkey");

    let vrf_vkey = VRFVKey.deserialize(reader);

    let vrf_result = VRFCert.deserialize(reader);

    let block_body_size = Number(reader.readInt());

    let block_body_hash = BlockHash.deserialize(reader);

    let operational_cert = OperationalCert.deserialize(reader);

    let protocol_version = ProtocolVersion.deserialize(reader);

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
    writer.writeArrayTag(10);

    writer.writeInt(BigInt(this._block_number));
    this._slot.serialize(writer);
    if (this._prev_hash == null) {
      writer.writeNull();
    } else {
      this._prev_hash.serialize(writer);
    }
    $$CANT_WRITE("Vkey");
    this._vrf_vkey.serialize(writer);
    this._vrf_result.serialize(writer);
    writer.writeInt(BigInt(this._block_body_size));
    this._block_body_hash.serialize(writer);
    this._operational_cert.serialize(writer);
    this._protocol_version.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): HeaderBody {
    let reader = new CBORReader(data);
    return HeaderBody.deserialize(reader);
  }

  static from_hex(hex_str: string): HeaderBody {
    return HeaderBody.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): HeaderBody {
    return HeaderBody.from_bytes(this.to_bytes());
  }
}

export class InfoAction {
  constructor() {}

  static new() {
    return new InfoAction();
  }

  static deserialize(reader: CBORReader): InfoAction {
    return new InfoAction();
  }

  serialize(writer: CBORWriter): void {}

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): InfoAction {
    let reader = new CBORReader(data);
    return InfoAction.deserialize(reader);
  }

  static from_hex(hex_str: string): InfoAction {
    return InfoAction.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): InfoAction {
    return InfoAction.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): Int {
    return new Int(reader.readInt());
  }

  serialize(writer: CBORWriter): void {
    writer.writeInt(this.inner);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Int {
    let reader = new CBORReader(data);
    return Int.deserialize(reader);
  }

  static from_hex(hex_str: string): Int {
    return Int.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Int {
    return Int.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): Ipv4 {
    return new Ipv4(reader.readBytes());
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Ipv4 {
    let reader = new CBORReader(data);
    return Ipv4.deserialize(reader);
  }

  static from_hex(hex_str: string): Ipv4 {
    return Ipv4.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Ipv4 {
    return Ipv4.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): Ipv6 {
    return new Ipv6(reader.readBytes());
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Ipv6 {
    let reader = new CBORReader(data);
    return Ipv6.deserialize(reader);
  }

  static from_hex(hex_str: string): Ipv6 {
    return Ipv6.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Ipv6 {
    return Ipv6.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): KESSignature {
    return new KESSignature(reader.readBytes());
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): KESSignature {
    let reader = new CBORReader(data);
    return KESSignature.deserialize(reader);
  }

  static from_hex(hex_str: string): KESSignature {
    return KESSignature.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): KESSignature {
    return KESSignature.from_bytes(this.to_bytes());
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
    let decoded = bech32.decode(bech_str);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new KESVKey(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words);
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

  static deserialize(reader: CBORReader): KESVKey {
    return new KESVKey(reader.readBytes());
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

  static deserialize(reader: CBORReader): Language {
    let kind = Number(reader.readInt());
    if (kind == 0) return new Language(0);
    if (kind == 1) return new Language(1);
    if (kind == 2) return new Language(2);
    throw "Unrecognized enum value: " + kind + " for " + Language;
  }

  serialize(writer: CBORWriter): void {
    writer.writeInt(BigInt(this.kind_));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Language {
    let reader = new CBORReader(data);
    return Language.deserialize(reader);
  }

  static from_hex(hex_str: string): Language {
    return Language.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Language {
    return Language.from_bytes(this.to_bytes());
  }
}

export class Languages {
  private items: Language[];

  constructor(items: Language[]) {
    this.items = items;
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

  static deserialize(reader: CBORReader): Languages {
    return new Languages(
      reader.readArray((reader) => Language.deserialize(reader)),
    );
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Languages {
    let reader = new CBORReader(data);
    return Languages.deserialize(reader);
  }

  static from_hex(hex_str: string): Languages {
    return Languages.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Languages {
    return Languages.from_bytes(this.to_bytes());
  }

  static list(): Languages {
    return new Languages([
      Language.new_plutus_v1(),
      Language.new_plutus_v2(),
      Language.new_plutus_v3(),
    ]);
  }
}

export enum MIRKind {
  ToOtherPot = 0,
  ToStakeCredentials = 1,
}

export class MIR {
  private kind_: MIRKind;

  constructor(kind: MIRKind) {
    this.kind_ = kind;
  }

  static new_ToOtherPot(): MIR {
    return new MIR(0);
  }

  static new_ToStakeCredentials(): MIR {
    return new MIR(1);
  }

  static deserialize(reader: CBORReader): MIR {
    let kind = Number(reader.readInt());
    if (kind == 0) return new MIR(0);
    if (kind == 1) return new MIR(1);
    throw "Unrecognized enum value: " + kind + " for " + MIR;
  }

  serialize(writer: CBORWriter): void {
    writer.writeInt(BigInt(this.kind_));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): MIR {
    let reader = new CBORReader(data);
    return MIR.deserialize(reader);
  }

  static from_hex(hex_str: string): MIR {
    return MIR.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): MIR {
    return MIR.from_bytes(this.to_bytes());
  }
}

export enum MIREnumKind {
  BigNum = 0,
  MIRToStakeCredentials = 1,
}

export type MIREnumVariant =
  | { kind: 0; value: BigNum }
  | { kind: 1; value: MIRToStakeCredentials };

export class MIREnum {
  private variant: MIREnumVariant;

  constructor(variant: MIREnumVariant) {
    this.variant = variant;
  }

  static new_to_other_pot(to_other_pot: BigNum): MIREnum {
    return new MIREnum({ kind: 0, value: to_other_pot });
  }

  static new_to_stake_creds(to_stake_creds: MIRToStakeCredentials): MIREnum {
    return new MIREnum({ kind: 1, value: to_stake_creds });
  }

  as_to_other_pot(): BigNum | undefined {
    if (this.variant.kind == 0) return this.variant.value;
  }

  as_to_stake_creds(): MIRToStakeCredentials | undefined {
    if (this.variant.kind == 1) return this.variant.value;
  }

  static deserialize(reader: CBORReader): MIREnum {
    let len = reader.readArrayTag();
    let tag = Number(reader.readUint());
    let variant: MIREnumVariant;

    switch (tag) {
      case 0:
        if (len != null && len - 1 != 1) {
          throw new Error("Expected 1 items to decode BigNum");
        }
        variant = {
          kind: 0,
          value: BigNum.deserialize(reader),
        };

        break;

      case 1:
        if (len != null && len - 1 != 1) {
          throw new Error("Expected 1 items to decode MIRToStakeCredentials");
        }
        variant = {
          kind: 1,
          value: MIRToStakeCredentials.deserialize(reader),
        };

        break;
    }

    if (len == null) {
      reader.readBreak();
    }

    throw new Error("Unexpected tag for MIREnum: " + tag);
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

  static from_bytes(data: Uint8Array): MIREnum {
    let reader = new CBORReader(data);
    return MIREnum.deserialize(reader);
  }

  static from_hex(hex_str: string): MIREnum {
    return MIREnum.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): MIREnum {
    return MIREnum.from_bytes(this.to_bytes());
  }
}

export enum MIRPotKind {
  Reserves = 0,
  Treasury = 1,
}

export class MIRPot {
  private kind_: MIRPotKind;

  constructor(kind: MIRPotKind) {
    this.kind_ = kind;
  }

  static new_Reserves(): MIRPot {
    return new MIRPot(0);
  }

  static new_Treasury(): MIRPot {
    return new MIRPot(1);
  }

  static deserialize(reader: CBORReader): MIRPot {
    let kind = Number(reader.readInt());
    if (kind == 0) return new MIRPot(0);
    if (kind == 1) return new MIRPot(1);
    throw "Unrecognized enum value: " + kind + " for " + MIRPot;
  }

  serialize(writer: CBORWriter): void {
    writer.writeInt(BigInt(this.kind_));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): MIRPot {
    let reader = new CBORReader(data);
    return MIRPot.deserialize(reader);
  }

  static from_hex(hex_str: string): MIRPot {
    return MIRPot.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): MIRPot {
    return MIRPot.from_bytes(this.to_bytes());
  }
}

export class MIRToStakeCredentials {
  private items: [Credential, Credential][];

  constructor(items: [Credential, Credential][]) {
    this.items = items;
  }

  static new(): MIRToStakeCredentials {
    return new MIRToStakeCredentials([]);
  }

  len(): number {
    return this.items.length;
  }

  insert(key: Credential, value: Credential): Credential | undefined {
    let entry = this.items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this.items.push([key, value]);
    return undefined;
  }

  get(key: Credential): Credential | undefined {
    let entry = this.items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: Credential[]): void {
    this.items = this.items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  keys(): Credentials {
    let keys = Credentials.new();
    for (let [key, _] of this.items) keys.add(key);
    return keys;
  }

  static deserialize(reader: CBORReader): MIRToStakeCredentials {
    let ret = new MIRToStakeCredentials([]);
    reader.readMap((reader) =>
      ret.insert(
        Credential.deserialize(reader),
        Credential.deserialize(reader),
      ),
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this.items, (writer, x) => {
      x[0].serialize(writer);
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): MIRToStakeCredentials {
    let reader = new CBORReader(data);
    return MIRToStakeCredentials.deserialize(reader);
  }

  static from_hex(hex_str: string): MIRToStakeCredentials {
    return MIRToStakeCredentials.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): MIRToStakeCredentials {
    return MIRToStakeCredentials.from_bytes(this.to_bytes());
  }
}

export class MetadataList {
  private items: TransactionMetadatum[];

  constructor(items: TransactionMetadatum[]) {
    this.items = items;
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

  static deserialize(reader: CBORReader): MetadataList {
    return new MetadataList(
      reader.readArray((reader) => TransactionMetadatum.deserialize(reader)),
    );
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): MetadataList {
    let reader = new CBORReader(data);
    return MetadataList.deserialize(reader);
  }

  static from_hex(hex_str: string): MetadataList {
    return MetadataList.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): MetadataList {
    return MetadataList.from_bytes(this.to_bytes());
  }
}

export class MetadataMap {
  private items: [TransactionMetadatum, TransactionMetadatum][];

  constructor(items: [TransactionMetadatum, TransactionMetadatum][]) {
    this.items = items;
  }

  static new(): MetadataMap {
    return new MetadataMap([]);
  }

  len(): number {
    return this.items.length;
  }

  insert(
    key: TransactionMetadatum,
    value: TransactionMetadatum,
  ): TransactionMetadatum | undefined {
    let entry = this.items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this.items.push([key, value]);
    return undefined;
  }

  _get(key: TransactionMetadatum): TransactionMetadatum | undefined {
    let entry = this.items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: TransactionMetadatum[]): void {
    this.items = this.items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  keys(): MetadataList {
    let keys = MetadataList.new();
    for (let [key, _] of this.items) keys.add(key);
    return keys;
  }

  static deserialize(reader: CBORReader): MetadataMap {
    let ret = new MetadataMap([]);
    reader.readMap((reader) =>
      ret.insert(
        TransactionMetadatum.deserialize(reader),
        TransactionMetadatum.deserialize(reader),
      ),
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this.items, (writer, x) => {
      x[0].serialize(writer);
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): MetadataMap {
    let reader = new CBORReader(data);
    return MetadataMap.deserialize(reader);
  }

  static from_hex(hex_str: string): MetadataMap {
    return MetadataMap.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): MetadataMap {
    return MetadataMap.from_bytes(this.to_bytes());
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
  private items: [ScriptHash, MintAssets][];

  constructor(items: [ScriptHash, MintAssets][]) {
    this.items = items;
  }

  static new(): Mint {
    return new Mint([]);
  }

  len(): number {
    return this.items.length;
  }

  insert(key: ScriptHash, value: MintAssets): MintAssets | undefined {
    let entry = this.items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this.items.push([key, value]);
    return undefined;
  }

  get(key: ScriptHash): MintAssets | undefined {
    let entry = this.items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: ScriptHash[]): void {
    this.items = this.items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  keys(): ScriptHashes {
    let keys = ScriptHashes.new();
    for (let [key, _] of this.items) keys.add(key);
    return keys;
  }

  static deserialize(reader: CBORReader): Mint {
    let ret = new Mint([]);
    reader.readMap((reader) =>
      ret.insert(
        ScriptHash.deserialize(reader),
        MintAssets.deserialize(reader),
      ),
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this.items, (writer, x) => {
      x[0].serialize(writer);
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Mint {
    let reader = new CBORReader(data);
    return Mint.deserialize(reader);
  }

  static from_hex(hex_str: string): Mint {
    return Mint.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Mint {
    return Mint.from_bytes(this.to_bytes());
  }

  _as_multiasset(isPositive: boolean): MultiAsset {
    const result = new MultiAsset([]);

    // Iterating over items in Mint class
    const mintItems = this.items;

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
  private items: [AssetName, Int][];

  constructor(items: [AssetName, Int][]) {
    this.items = items;
  }

  static new(): MintAssets {
    return new MintAssets([]);
  }

  len(): number {
    return this.items.length;
  }

  insert(key: AssetName, value: Int): Int | undefined {
    let entry = this.items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this.items.push([key, value]);
    return undefined;
  }

  get(key: AssetName): Int | undefined {
    let entry = this.items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: AssetName[]): void {
    this.items = this.items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  keys(): AssetNames {
    let keys = AssetNames.new();
    for (let [key, _] of this.items) keys.add(key);
    return keys;
  }

  static deserialize(reader: CBORReader): MintAssets {
    let ret = new MintAssets([]);
    reader.readMap((reader) =>
      ret.insert(AssetName.deserialize(reader), Int.deserialize(reader)),
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this.items, (writer, x) => {
      x[0].serialize(writer);
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): MintAssets {
    let reader = new CBORReader(data);
    return MintAssets.deserialize(reader);
  }

  static from_hex(hex_str: string): MintAssets {
    return MintAssets.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): MintAssets {
    return MintAssets.from_bytes(this.to_bytes());
  }
}

export class MoveInstantaneousReward {
  private _pot: MIRPot;
  private _variant: MIREnum;

  constructor(pot: MIRPot, variant: MIREnum) {
    this._pot = pot;
    this._variant = variant;
  }

  static new(pot: MIRPot, variant: MIREnum) {
    return new MoveInstantaneousReward(pot, variant);
  }

  get_pot(): MIRPot {
    return this._pot;
  }

  set_pot(pot: MIRPot): void {
    this._pot = pot;
  }

  get_variant(): MIREnum {
    return this._variant;
  }

  set_variant(variant: MIREnum): void {
    this._variant = variant;
  }

  static deserialize(reader: CBORReader): MoveInstantaneousReward {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let pot = MIRPot.deserialize(reader);

    let variant = MIREnum.deserialize(reader);

    return new MoveInstantaneousReward(pot, variant);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    this._pot.serialize(writer);
    this._variant.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): MoveInstantaneousReward {
    let reader = new CBORReader(data);
    return MoveInstantaneousReward.deserialize(reader);
  }

  static from_hex(hex_str: string): MoveInstantaneousReward {
    return MoveInstantaneousReward.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): MoveInstantaneousReward {
    return MoveInstantaneousReward.from_bytes(this.to_bytes());
  }

  static new_to_other_pot(
    pot: MIRPot,
    amount: BigNum,
  ): MoveInstantaneousReward {
    return MoveInstantaneousReward.new(pot, MIREnum.new_to_other_pot(amount));
  }

  static new_to_stake_creds(
    pot: MIRPot,
    amounts: MIRToStakeCredentials,
  ): MoveInstantaneousReward {
    return MoveInstantaneousReward.new(
      pot,
      MIREnum.new_to_stake_creds(amounts),
    );
  }

  pot(): MIRPot {
    return this.get_pot();
  }

  kind(): MIRKind {
    if (this._variant.as_to_other_pot() === undefined) {
      return MIRKind.ToStakeCredentials;
    }
    return MIRKind.ToOtherPot;
  }

  as_to_other_pot(): BigNum | undefined {
    return this._variant.as_to_other_pot();
  }

  as_to_stake_creds(): MIRToStakeCredentials | undefined {
    return this._variant.as_to_stake_creds();
  }
}

export class MultiAsset {
  private items: [ScriptHash, Assets][];

  constructor(items: [ScriptHash, Assets][]) {
    this.items = items;
  }

  static new(): MultiAsset {
    return new MultiAsset([]);
  }

  len(): number {
    return this.items.length;
  }

  insert(key: ScriptHash, value: Assets): Assets | undefined {
    let entry = this.items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this.items.push([key, value]);
    return undefined;
  }

  get(key: ScriptHash): Assets | undefined {
    let entry = this.items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: ScriptHash[]): void {
    this.items = this.items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  keys(): ScriptHashes {
    let keys = ScriptHashes.new();
    for (let [key, _] of this.items) keys.add(key);
    return keys;
  }

  static deserialize(reader: CBORReader): MultiAsset {
    let ret = new MultiAsset([]);
    reader.readMap((reader) =>
      ret.insert(ScriptHash.deserialize(reader), Assets.deserialize(reader)),
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this.items, (writer, x) => {
      x[0].serialize(writer);
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): MultiAsset {
    let reader = new CBORReader(data);
    return MultiAsset.deserialize(reader);
  }

  static from_hex(hex_str: string): MultiAsset {
    return MultiAsset.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): MultiAsset {
    return MultiAsset.from_bytes(this.to_bytes());
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

  sub(rhs: MultiAsset): MultiAsset {
    let out = this.clone();
    out._inplace_clamped_sub(rhs);
    return out;
  }

  _inplace_checked_add(rhs: MultiAsset): void {
    for (let [policy, rhs_assets] of rhs.items) {
      let this_assets = this.get(policy);
      if (this_assets == null) {
        this_assets = Assets.new();
        this.insert(policy, this_assets);
      }
      this_assets._inplace_checked_add(rhs_assets);
    }
  }

  _inplace_clamped_sub(rhs: MultiAsset) {
    for (let [policy, rhs_assets] of rhs.items) {
      let this_assets = this.get(policy);
      if (this_assets == null) continue;
      this_assets._inplace_clamped_sub(rhs_assets);
    }
    this._normalize();
  }

  _normalize(): void {
    let to_remove: ScriptHash[] = [];
    for (let [policy_id, assets] of this.items) {
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
    for (let [policy_id, this_assets] of this.items) {
      let rhs_assets = rhs.get(policy_id);
      if (rhs_assets == null) rhs_assets = zero;
      let assets_cmp = this_assets._partial_cmp(rhs_assets);
      if (assets_cmp == null) return undefined;
      cmps[1 + assets_cmp] = true;
    }

    for (let [policy_id, rhs_assets] of rhs.items) {
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

  static deserialize(reader: CBORReader): MultiHostName {
    let dns_name = DNSRecordSRV.deserialize(reader);

    return new MultiHostName(dns_name);
  }

  serialize(writer: CBORWriter): void {
    this._dns_name.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): MultiHostName {
    let reader = new CBORReader(data);
    return MultiHostName.deserialize(reader);
  }

  static from_hex(hex_str: string): MultiHostName {
    return MultiHostName.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): MultiHostName {
    return MultiHostName.from_bytes(this.to_bytes());
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
  | { kind: 0; value: unknown }
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

  static new_script_pubkey(script_pubkey: unknown): NativeScript {
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

  as_script_pubkey(): unknown | undefined {
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

  static deserialize(reader: CBORReader): NativeScript {
    let len = reader.readArrayTag();
    let tag = Number(reader.readUint());
    let variant: NativeScriptVariant;

    switch (tag) {
      case 0:
        if (len != null && len - 1 != 1) {
          throw new Error("Expected 1 items to decode ScriptPubkey");
        }
        variant = {
          kind: 0,
          value: $$CANT_READ("ScriptPubkey"),
        };

        break;

      case 1:
        if (len != null && len - 1 != 1) {
          throw new Error("Expected 1 items to decode ScriptAll");
        }
        variant = {
          kind: 1,
          value: ScriptAll.deserialize(reader),
        };

        break;

      case 2:
        if (len != null && len - 1 != 1) {
          throw new Error("Expected 1 items to decode ScriptAny");
        }
        variant = {
          kind: 2,
          value: ScriptAny.deserialize(reader),
        };

        break;

      case 3:
        if (len != null && len - 1 != 2) {
          throw new Error("Expected 2 items to decode ScriptNOfK");
        }
        variant = {
          kind: 3,
          value: ScriptNOfK.deserialize(reader),
        };

        break;

      case 4:
        if (len != null && len - 1 != 1) {
          throw new Error("Expected 1 items to decode TimelockStart");
        }
        variant = {
          kind: 4,
          value: TimelockStart.deserialize(reader),
        };

        break;

      case 5:
        if (len != null && len - 1 != 1) {
          throw new Error("Expected 1 items to decode TimelockExpiry");
        }
        variant = {
          kind: 5,
          value: TimelockExpiry.deserialize(reader),
        };

        break;
    }

    if (len == null) {
      reader.readBreak();
    }

    throw new Error("Unexpected tag for NativeScript: " + tag);
  }

  serialize(writer: CBORWriter): void {
    switch (this.variant.kind) {
      case 0:
        writer.writeArrayTag(2);
        writer.writeInt(BigInt(0));
        $$CANT_WRITE("ScriptPubkey");
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

  static from_bytes(data: Uint8Array): NativeScript {
    let reader = new CBORReader(data);
    return NativeScript.deserialize(reader);
  }

  static from_hex(hex_str: string): NativeScript {
    return NativeScript.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): NativeScript {
    return NativeScript.from_bytes(this.to_bytes());
  }
}

export class NativeScripts {
  private items: NativeScript[];

  constructor(items: NativeScript[]) {
    this.items = items;
  }

  static new(): NativeScripts {
    return new NativeScripts([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): NativeScript {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: NativeScript): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader): NativeScripts {
    return new NativeScripts(
      reader.readArray((reader) => NativeScript.deserialize(reader)),
    );
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): NativeScripts {
    let reader = new CBORReader(data);
    return NativeScripts.deserialize(reader);
  }

  static from_hex(hex_str: string): NativeScripts {
    return NativeScripts.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): NativeScripts {
    return NativeScripts.from_bytes(this.to_bytes());
  }
}

export enum NetworkIdKind {
  mainnet = 0,
  testnet = 1,
}

export class NetworkId {
  private kind_: NetworkIdKind;

  constructor(kind: NetworkIdKind) {
    this.kind_ = kind;
  }

  static new_mainnet(): NetworkId {
    return new NetworkId(0);
  }

  static new_testnet(): NetworkId {
    return new NetworkId(1);
  }
  kind(): NetworkIdKind {
    return this.kind_;
  }

  static deserialize(reader: CBORReader): NetworkId {
    let kind = Number(reader.readInt());
    if (kind == 0) return new NetworkId(0);
    if (kind == 1) return new NetworkId(1);
    throw "Unrecognized enum value: " + kind + " for " + NetworkId;
  }

  serialize(writer: CBORWriter): void {
    writer.writeInt(BigInt(this.kind_));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): NetworkId {
    let reader = new CBORReader(data);
    return NetworkId.deserialize(reader);
  }

  static from_hex(hex_str: string): NetworkId {
    return NetworkId.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): NetworkId {
    return NetworkId.from_bytes(this.to_bytes());
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

  static new(
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

  static deserialize(reader: CBORReader): NewConstitutionAction {
    let gov_action_id =
      reader.readNullable((r) => GovernanceActionId.deserialize(r)) ??
      undefined;

    let constitution = Constitution.deserialize(reader);

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

  static from_bytes(data: Uint8Array): NewConstitutionAction {
    let reader = new CBORReader(data);
    return NewConstitutionAction.deserialize(reader);
  }

  static from_hex(hex_str: string): NewConstitutionAction {
    return NewConstitutionAction.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): NewConstitutionAction {
    return NewConstitutionAction.from_bytes(this.to_bytes());
  }
}

export class NoConfidenceAction {
  private _gov_action_id: GovernanceActionId | undefined;

  constructor(gov_action_id: GovernanceActionId | undefined) {
    this._gov_action_id = gov_action_id;
  }

  static new(gov_action_id: GovernanceActionId | undefined) {
    return new NoConfidenceAction(gov_action_id);
  }

  gov_action_id(): GovernanceActionId | undefined {
    return this._gov_action_id;
  }

  set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void {
    this._gov_action_id = gov_action_id;
  }

  static deserialize(reader: CBORReader): NoConfidenceAction {
    let gov_action_id =
      reader.readNullable((r) => GovernanceActionId.deserialize(r)) ??
      undefined;

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

  static from_bytes(data: Uint8Array): NoConfidenceAction {
    let reader = new CBORReader(data);
    return NoConfidenceAction.deserialize(reader);
  }

  static from_hex(hex_str: string): NoConfidenceAction {
    return NoConfidenceAction.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): NoConfidenceAction {
    return NoConfidenceAction.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): OperationalCert {
    let len = reader.readArrayTag();

    if (len != null && len < 4) {
      throw new Error(
        "Insufficient number of fields in record. Expected 4. Received " + len,
      );
    }

    let hot_vkey = KESVKey.deserialize(reader);

    let sequence_number = Number(reader.readInt());

    let kes_period = Number(reader.readInt());

    let sigma = Ed25519Signature.deserialize(reader);

    return new OperationalCert(hot_vkey, sequence_number, kes_period, sigma);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(4);

    this._hot_vkey.serialize(writer);
    writer.writeInt(BigInt(this._sequence_number));
    writer.writeInt(BigInt(this._kes_period));
    this._sigma.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): OperationalCert {
    let reader = new CBORReader(data);
    return OperationalCert.deserialize(reader);
  }

  static from_hex(hex_str: string): OperationalCert {
    return OperationalCert.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): OperationalCert {
    return OperationalCert.from_bytes(this.to_bytes());
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

  static new(
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

  static deserialize(reader: CBORReader): ParameterChangeAction {
    let gov_action_id =
      reader.readNullable((r) => GovernanceActionId.deserialize(r)) ??
      undefined;

    let protocol_param_updates = ProtocolParamUpdate.deserialize(reader);

    let policy_hash =
      reader.readNullable((r) => ScriptHash.deserialize(r)) ?? undefined;

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

  static from_bytes(data: Uint8Array): ParameterChangeAction {
    let reader = new CBORReader(data);
    return ParameterChangeAction.deserialize(reader);
  }

  static from_hex(hex_str: string): ParameterChangeAction {
    return ParameterChangeAction.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): ParameterChangeAction {
    return ParameterChangeAction.from_bytes(this.to_bytes());
  }
}

export class PlutusList {
  private items: unknown[];

  constructor() {
    this.items = [];
  }

  static new(): PlutusList {
    return new PlutusList();
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): unknown {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: unknown): boolean {
    if (this.contains(elem)) return true;
    this.items.push(elem);
    return false;
  }

  contains(elem: unknown): boolean {
    for (let item of this.items) {
      if ($$CANT_EQ("PlutusData")) {
        return true;
      }
    }
    return false;
  }

  static deserialize(reader: CBORReader): PlutusList {
    let ret = new PlutusList();
    if (reader.peekType() == "tagged") {
      let tag = reader.readTaggedTag();
      if (tag != 258) throw new Error("Expected tag 258. Got " + tag);
    }
    reader.readArray((reader) => ret.add($$CANT_READ("PlutusData")));
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeTaggedTag(258);
    writer.writeArray(this.items, (writer, x) => $$CANT_WRITE("PlutusData"));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): PlutusList {
    let reader = new CBORReader(data);
    return PlutusList.deserialize(reader);
  }

  static from_hex(hex_str: string): PlutusList {
    return PlutusList.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): PlutusList {
    return PlutusList.from_bytes(this.to_bytes());
  }
}

export class PlutusMap {
  private items: [unknown, PlutusMapValues][];

  constructor(items: [unknown, PlutusMapValues][]) {
    this.items = items;
  }

  static new(): PlutusMap {
    return new PlutusMap([]);
  }

  len(): number {
    return this.items.length;
  }

  insert(key: unknown, value: PlutusMapValues): PlutusMapValues | undefined {
    let entry = this.items.find((x) => $$CANT_EQ("PlutusData"));
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this.items.push([key, value]);
    return undefined;
  }

  get(key: unknown): PlutusMapValues | undefined {
    let entry = this.items.find((x) => $$CANT_EQ("PlutusData"));
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: unknown[]): void {
    this.items = this.items.filter(([k, _v]) =>
      keys.every((key) => !$$CANT_EQ("PlutusData")),
    );
  }

  keys(): PlutusList {
    let keys = PlutusList.new();
    for (let [key, _] of this.items) keys.add(key);
    return keys;
  }

  static deserialize(reader: CBORReader): PlutusMap {
    let ret = new PlutusMap([]);
    reader.readMap((reader) =>
      ret.insert(
        $$CANT_READ("PlutusData"),
        PlutusMapValues.deserialize(reader),
      ),
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this.items, (writer, x) => {
      $$CANT_WRITE("PlutusData");
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): PlutusMap {
    let reader = new CBORReader(data);
    return PlutusMap.deserialize(reader);
  }

  static from_hex(hex_str: string): PlutusMap {
    return PlutusMap.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): PlutusMap {
    return PlutusMap.from_bytes(this.to_bytes());
  }
}

export class PlutusMapValues {
  private items: unknown[];

  constructor(items: unknown[]) {
    this.items = items;
  }

  static new(): PlutusMapValues {
    return new PlutusMapValues([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): unknown {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: unknown): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader): PlutusMapValues {
    return new PlutusMapValues(
      reader.readArray((reader) => $$CANT_READ("PlutusData")),
    );
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(this.items, (writer, x) => $$CANT_WRITE("PlutusData"));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): PlutusMapValues {
    let reader = new CBORReader(data);
    return PlutusMapValues.deserialize(reader);
  }

  static from_hex(hex_str: string): PlutusMapValues {
    return PlutusMapValues.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): PlutusMapValues {
    return PlutusMapValues.from_bytes(this.to_bytes());
  }
}

export class PlutusScripts {
  private items: Uint8Array[];

  constructor(items: Uint8Array[]) {
    this.items = items;
  }

  static new(): PlutusScripts {
    return new PlutusScripts([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): Uint8Array {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: Uint8Array): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader): PlutusScripts {
    return new PlutusScripts(reader.readArray((reader) => reader.readBytes()));
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(this.items, (writer, x) => writer.writeBytes(x));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): PlutusScripts {
    let reader = new CBORReader(data);
    return PlutusScripts.deserialize(reader);
  }

  static from_hex(hex_str: string): PlutusScripts {
    return PlutusScripts.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): PlutusScripts {
    return PlutusScripts.from_bytes(this.to_bytes());
  }
}

export class PlutusWitnesses {
  private items: unknown[];

  constructor(items: unknown[]) {
    this.items = items;
  }

  static new(): PlutusWitnesses {
    return new PlutusWitnesses([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): unknown {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: unknown): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader): PlutusWitnesses {
    return new PlutusWitnesses(
      reader.readArray((reader) => $$CANT_READ("PlutusWitness")),
    );
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(this.items, (writer, x) => $$CANT_WRITE("PlutusWitness"));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): PlutusWitnesses {
    let reader = new CBORReader(data);
    return PlutusWitnesses.deserialize(reader);
  }

  static from_hex(hex_str: string): PlutusWitnesses {
    return PlutusWitnesses.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): PlutusWitnesses {
    return PlutusWitnesses.from_bytes(this.to_bytes());
  }
}

export class Pointer {
  private _slot_bignum: BigNum;
  private _tx_index_bignum: BigNum;
  private _cert_index_bignum: BigNum;

  constructor(
    slot_bignum: BigNum,
    tx_index_bignum: BigNum,
    cert_index_bignum: BigNum,
  ) {
    this._slot_bignum = slot_bignum;
    this._tx_index_bignum = tx_index_bignum;
    this._cert_index_bignum = cert_index_bignum;
  }

  static new(
    slot_bignum: BigNum,
    tx_index_bignum: BigNum,
    cert_index_bignum: BigNum,
  ) {
    return new Pointer(slot_bignum, tx_index_bignum, cert_index_bignum);
  }

  slot_bignum(): BigNum {
    return this._slot_bignum;
  }

  set_slot_bignum(slot_bignum: BigNum): void {
    this._slot_bignum = slot_bignum;
  }

  tx_index_bignum(): BigNum {
    return this._tx_index_bignum;
  }

  set_tx_index_bignum(tx_index_bignum: BigNum): void {
    this._tx_index_bignum = tx_index_bignum;
  }

  cert_index_bignum(): BigNum {
    return this._cert_index_bignum;
  }

  set_cert_index_bignum(cert_index_bignum: BigNum): void {
    this._cert_index_bignum = cert_index_bignum;
  }

  static deserialize(reader: CBORReader): Pointer {
    let len = reader.readArrayTag();

    if (len != null && len < 3) {
      throw new Error(
        "Insufficient number of fields in record. Expected 3. Received " + len,
      );
    }

    let slot_bignum = BigNum.deserialize(reader);

    let tx_index_bignum = BigNum.deserialize(reader);

    let cert_index_bignum = BigNum.deserialize(reader);

    return new Pointer(slot_bignum, tx_index_bignum, cert_index_bignum);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(3);

    this._slot_bignum.serialize(writer);
    this._tx_index_bignum.serialize(writer);
    this._cert_index_bignum.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Pointer {
    let reader = new CBORReader(data);
    return Pointer.deserialize(reader);
  }

  static from_hex(hex_str: string): Pointer {
    return Pointer.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Pointer {
    return Pointer.from_bytes(this.to_bytes());
  }

  slot(): number {
    return Number(this._slot_bignum);
  }
  tx_index(): number {
    return Number(this._tx_index_bignum);
  }
  cert_index(): number {
    return Number(this._cert_index_bignum);
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

  static deserialize(reader: CBORReader): PoolMetadata {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let url = URL.deserialize(reader);

    let pool_metadata_hash = PoolMetadataHash.deserialize(reader);

    return new PoolMetadata(url, pool_metadata_hash);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    this._url.serialize(writer);
    this._pool_metadata_hash.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): PoolMetadata {
    let reader = new CBORReader(data);
    return PoolMetadata.deserialize(reader);
  }

  static from_hex(hex_str: string): PoolMetadata {
    return PoolMetadata.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): PoolMetadata {
    return PoolMetadata.from_bytes(this.to_bytes());
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
    let decoded = bech32.decode(bech_str);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new PoolMetadataHash(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words);
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

  static deserialize(reader: CBORReader): PoolMetadataHash {
    return new PoolMetadataHash(reader.readBytes());
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
  private _reward_account: unknown;
  private _pool_owners: Ed25519KeyHashes;
  private _relays: Relays;
  private _pool_metadata: PoolMetadata | undefined;

  constructor(
    operator: Ed25519KeyHash,
    vrf_keyhash: VRFKeyHash,
    pledge: BigNum,
    cost: BigNum,
    margin: UnitInterval,
    reward_account: unknown,
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
    reward_account: unknown,
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

  reward_account(): unknown {
    return this._reward_account;
  }

  set_reward_account(reward_account: unknown): void {
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

  static deserialize(reader: CBORReader): PoolParams {
    let operator = Ed25519KeyHash.deserialize(reader);

    let vrf_keyhash = VRFKeyHash.deserialize(reader);

    let pledge = BigNum.deserialize(reader);

    let cost = BigNum.deserialize(reader);

    let margin = UnitInterval.deserialize(reader);

    let reward_account = $$CANT_READ("RewardAddress");

    let pool_owners = Ed25519KeyHashes.deserialize(reader);

    let relays = Relays.deserialize(reader);

    let pool_metadata =
      reader.readNullable((r) => PoolMetadata.deserialize(r)) ?? undefined;

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
    $$CANT_WRITE("RewardAddress");
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

  static from_bytes(data: Uint8Array): PoolParams {
    let reader = new CBORReader(data);
    return PoolParams.deserialize(reader);
  }

  static from_hex(hex_str: string): PoolParams {
    return PoolParams.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): PoolParams {
    return PoolParams.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): PoolRegistration {
    let pool_params = PoolParams.deserialize(reader);
    return new PoolRegistration(pool_params);
  }

  serialize(writer: CBORWriter): void {
    this._pool_params.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): PoolRegistration {
    let reader = new CBORReader(data);
    return PoolRegistration.deserialize(reader);
  }

  static from_hex(hex_str: string): PoolRegistration {
    return PoolRegistration.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): PoolRegistration {
    return PoolRegistration.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): PoolRetirement {
    let pool_keyhash = Ed25519KeyHash.deserialize(reader);

    let epoch = Number(reader.readInt());

    return new PoolRetirement(pool_keyhash, epoch);
  }

  serialize(writer: CBORWriter): void {
    this._pool_keyhash.serialize(writer);
    writer.writeInt(BigInt(this._epoch));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): PoolRetirement {
    let reader = new CBORReader(data);
    return PoolRetirement.deserialize(reader);
  }

  static from_hex(hex_str: string): PoolRetirement {
    return PoolRetirement.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): PoolRetirement {
    return PoolRetirement.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): PoolVotingThresholds {
    let len = reader.readArrayTag();

    if (len != null && len < 5) {
      throw new Error(
        "Insufficient number of fields in record. Expected 5. Received " + len,
      );
    }

    let motion_no_confidence = UnitInterval.deserialize(reader);

    let committee_normal = UnitInterval.deserialize(reader);

    let committee_no_confidence = UnitInterval.deserialize(reader);

    let hard_fork_initiation = UnitInterval.deserialize(reader);

    let security_relevant_threshold = UnitInterval.deserialize(reader);

    return new PoolVotingThresholds(
      motion_no_confidence,
      committee_normal,
      committee_no_confidence,
      hard_fork_initiation,
      security_relevant_threshold,
    );
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(5);

    this._motion_no_confidence.serialize(writer);
    this._committee_normal.serialize(writer);
    this._committee_no_confidence.serialize(writer);
    this._hard_fork_initiation.serialize(writer);
    this._security_relevant_threshold.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): PoolVotingThresholds {
    let reader = new CBORReader(data);
    return PoolVotingThresholds.deserialize(reader);
  }

  static from_hex(hex_str: string): PoolVotingThresholds {
    return PoolVotingThresholds.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): PoolVotingThresholds {
    return PoolVotingThresholds.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): PrivateKey {
    return new PrivateKey(reader.readBytes());
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
    bech32.encode(prefix, this.inner);
  }

  static from_bech32(bech_str: string): PrivateKey {
    let decoded = bech32.decode(bech_str);
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

  from_hex(hex_str: string): PrivateKey {
    return PrivateKey._from_bytes(hexToBytes(hex_str));
  }
}

export class ProposedProtocolParameterUpdates {
  private items: [GenesisHash, ProtocolParamUpdate][];

  constructor(items: [GenesisHash, ProtocolParamUpdate][]) {
    this.items = items;
  }

  static new(): ProposedProtocolParameterUpdates {
    return new ProposedProtocolParameterUpdates([]);
  }

  len(): number {
    return this.items.length;
  }

  insert(
    key: GenesisHash,
    value: ProtocolParamUpdate,
  ): ProtocolParamUpdate | undefined {
    let entry = this.items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this.items.push([key, value]);
    return undefined;
  }

  get(key: GenesisHash): ProtocolParamUpdate | undefined {
    let entry = this.items.find((x) =>
      arrayEq(key.to_bytes(), x[0].to_bytes()),
    );
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: GenesisHash[]): void {
    this.items = this.items.filter(([k, _v]) =>
      keys.every((key) => !arrayEq(key.to_bytes(), k.to_bytes())),
    );
  }

  keys(): GenesisHashes {
    let keys = GenesisHashes.new();
    for (let [key, _] of this.items) keys.add(key);
    return keys;
  }

  static deserialize(reader: CBORReader): ProposedProtocolParameterUpdates {
    let ret = new ProposedProtocolParameterUpdates([]);
    reader.readMap((reader) =>
      ret.insert(
        GenesisHash.deserialize(reader),
        ProtocolParamUpdate.deserialize(reader),
      ),
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this.items, (writer, x) => {
      x[0].serialize(writer);
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): ProposedProtocolParameterUpdates {
    let reader = new CBORReader(data);
    return ProposedProtocolParameterUpdates.deserialize(reader);
  }

  static from_hex(hex_str: string): ProposedProtocolParameterUpdates {
    return ProposedProtocolParameterUpdates.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): ProposedProtocolParameterUpdates {
    return ProposedProtocolParameterUpdates.from_bytes(this.to_bytes());
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
  private _costmdls: unknown | undefined;
  private _execution_costs: ExUnitPrices | undefined;
  private _max_tx_ex_units: ExUnits | undefined;
  private _max_block_ex_units: ExUnits | undefined;
  private _max_value_size: number | undefined;
  private _collateral_percentage: number | undefined;
  private _max_collateral_inputs: number | undefined;
  private _pool_voting_thresholds: PoolVotingThresholds | undefined;
  private _drep_voting_thresholds: DrepVotingThresholds | undefined;
  private _min_committee_size: number | undefined;
  private _committee_term_limit: number | undefined;
  private _governance_action_validity_period: number | undefined;
  private _governance_action_deposit: BigNum | undefined;
  private _drep_deposit: BigNum | undefined;
  private _drep_inactivity_period: number | undefined;
  private _script_cost_per_byte: UnitInterval | undefined;

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
    costmdls: unknown | undefined,
    execution_costs: ExUnitPrices | undefined,
    max_tx_ex_units: ExUnits | undefined,
    max_block_ex_units: ExUnits | undefined,
    max_value_size: number | undefined,
    collateral_percentage: number | undefined,
    max_collateral_inputs: number | undefined,
    pool_voting_thresholds: PoolVotingThresholds | undefined,
    drep_voting_thresholds: DrepVotingThresholds | undefined,
    min_committee_size: number | undefined,
    committee_term_limit: number | undefined,
    governance_action_validity_period: number | undefined,
    governance_action_deposit: BigNum | undefined,
    drep_deposit: BigNum | undefined,
    drep_inactivity_period: number | undefined,
    script_cost_per_byte: UnitInterval | undefined,
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
    this._costmdls = costmdls;
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
    this._script_cost_per_byte = script_cost_per_byte;
  }

  static new(
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
    costmdls: unknown | undefined,
    execution_costs: ExUnitPrices | undefined,
    max_tx_ex_units: ExUnits | undefined,
    max_block_ex_units: ExUnits | undefined,
    max_value_size: number | undefined,
    collateral_percentage: number | undefined,
    max_collateral_inputs: number | undefined,
    pool_voting_thresholds: PoolVotingThresholds | undefined,
    drep_voting_thresholds: DrepVotingThresholds | undefined,
    min_committee_size: number | undefined,
    committee_term_limit: number | undefined,
    governance_action_validity_period: number | undefined,
    governance_action_deposit: BigNum | undefined,
    drep_deposit: BigNum | undefined,
    drep_inactivity_period: number | undefined,
    script_cost_per_byte: UnitInterval | undefined,
  ) {
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
      costmdls,
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
      script_cost_per_byte,
    );
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

  costmdls(): unknown | undefined {
    return this._costmdls;
  }

  set_costmdls(costmdls: unknown | undefined): void {
    this._costmdls = costmdls;
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

  drep_voting_thresholds(): DrepVotingThresholds | undefined {
    return this._drep_voting_thresholds;
  }

  set_drep_voting_thresholds(
    drep_voting_thresholds: DrepVotingThresholds | undefined,
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

  script_cost_per_byte(): UnitInterval | undefined {
    return this._script_cost_per_byte;
  }

  set_script_cost_per_byte(
    script_cost_per_byte: UnitInterval | undefined,
  ): void {
    this._script_cost_per_byte = script_cost_per_byte;
  }

  static deserialize(reader: CBORReader): ProtocolParamUpdate {
    let fields: any = {};
    reader.readMap((r) => {
      let key = Number(r.readUint());
      switch (key) {
        case 0:
          fields.minfee_a = BigNum.deserialize(r);
          break;

        case 1:
          fields.minfee_b = BigNum.deserialize(r);
          break;

        case 2:
          fields.max_block_body_size = Number(r.readInt());
          break;

        case 3:
          fields.max_tx_size = Number(r.readInt());
          break;

        case 4:
          fields.max_block_header_size = Number(r.readInt());
          break;

        case 5:
          fields.key_deposit = BigNum.deserialize(r);
          break;

        case 6:
          fields.pool_deposit = BigNum.deserialize(r);
          break;

        case 7:
          fields.max_epoch = Number(r.readInt());
          break;

        case 8:
          fields.n_opt = Number(r.readInt());
          break;

        case 9:
          fields.pool_pledge_influence = UnitInterval.deserialize(r);
          break;

        case 10:
          fields.expansion_rate = UnitInterval.deserialize(r);
          break;

        case 11:
          fields.treasury_growth_rate = UnitInterval.deserialize(r);
          break;

        case 16:
          fields.min_pool_cost = BigNum.deserialize(r);
          break;

        case 17:
          fields.ada_per_utxo_byte = BigNum.deserialize(r);
          break;

        case 18:
          fields.costmdls = $$CANT_READ("Costmdls");
          break;

        case 19:
          fields.execution_costs = ExUnitPrices.deserialize(r);
          break;

        case 20:
          fields.max_tx_ex_units = ExUnits.deserialize(r);
          break;

        case 21:
          fields.max_block_ex_units = ExUnits.deserialize(r);
          break;

        case 22:
          fields.max_value_size = Number(r.readInt());
          break;

        case 23:
          fields.collateral_percentage = Number(r.readInt());
          break;

        case 24:
          fields.max_collateral_inputs = Number(r.readInt());
          break;

        case 25:
          fields.pool_voting_thresholds = PoolVotingThresholds.deserialize(r);
          break;

        case 26:
          fields.drep_voting_thresholds = DrepVotingThresholds.deserialize(r);
          break;

        case 27:
          fields.min_committee_size = Number(r.readInt());
          break;

        case 28:
          fields.committee_term_limit = Number(r.readInt());
          break;

        case 29:
          fields.governance_action_validity_period = Number(r.readInt());
          break;

        case 30:
          fields.governance_action_deposit = BigNum.deserialize(r);
          break;

        case 31:
          fields.drep_deposit = BigNum.deserialize(r);
          break;

        case 32:
          fields.drep_inactivity_period = Number(r.readInt());
          break;

        case 33:
          fields.script_cost_per_byte = UnitInterval.deserialize(r);
          break;
      }
    });

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

    let costmdls = fields.costmdls;

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

    let script_cost_per_byte = fields.script_cost_per_byte;

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
      costmdls,
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
      script_cost_per_byte,
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
    if (this._costmdls === undefined) len -= 1;
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
    if (this._script_cost_per_byte === undefined) len -= 1;
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
    if (this._costmdls !== undefined) {
      writer.writeInt(18n);
      $$CANT_WRITE("Costmdls");
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
    if (this._script_cost_per_byte !== undefined) {
      writer.writeInt(33n);
      this._script_cost_per_byte.serialize(writer);
    }
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): ProtocolParamUpdate {
    let reader = new CBORReader(data);
    return ProtocolParamUpdate.deserialize(reader);
  }

  static from_hex(hex_str: string): ProtocolParamUpdate {
    return ProtocolParamUpdate.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): ProtocolParamUpdate {
    return ProtocolParamUpdate.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): ProtocolVersion {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let major = Number(reader.readInt());

    let minor = Number(reader.readInt());

    return new ProtocolVersion(major, minor);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    writer.writeInt(BigInt(this._major));
    writer.writeInt(BigInt(this._minor));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): ProtocolVersion {
    let reader = new CBORReader(data);
    return ProtocolVersion.deserialize(reader);
  }

  static from_hex(hex_str: string): ProtocolVersion {
    return ProtocolVersion.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): ProtocolVersion {
    return ProtocolVersion.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): PublicKey {
    return new PublicKey(reader.readBytes());
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
    let decoded = bech32.decode(bech_str);
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
    bech32.encode(prefix, this.inner);
  }
}

export class Redeemer {
  private _tag: RedeemerTag;
  private _index: BigNum;
  private _data: unknown;
  private _ex_units: ExUnits;
  private _invalid_transactions: Uint32Array;

  constructor(
    tag: RedeemerTag,
    index: BigNum,
    data: unknown,
    ex_units: ExUnits,
    invalid_transactions: Uint32Array,
  ) {
    this._tag = tag;
    this._index = index;
    this._data = data;
    this._ex_units = ex_units;
    this._invalid_transactions = invalid_transactions;
  }

  static new(
    tag: RedeemerTag,
    index: BigNum,
    data: unknown,
    ex_units: ExUnits,
    invalid_transactions: Uint32Array,
  ) {
    return new Redeemer(tag, index, data, ex_units, invalid_transactions);
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

  data(): unknown {
    return this._data;
  }

  set_data(data: unknown): void {
    this._data = data;
  }

  ex_units(): ExUnits {
    return this._ex_units;
  }

  set_ex_units(ex_units: ExUnits): void {
    this._ex_units = ex_units;
  }

  invalid_transactions(): Uint32Array {
    return this._invalid_transactions;
  }

  set_invalid_transactions(invalid_transactions: Uint32Array): void {
    this._invalid_transactions = invalid_transactions;
  }

  static deserialize(reader: CBORReader): Redeemer {
    let len = reader.readArrayTag();

    if (len != null && len < 5) {
      throw new Error(
        "Insufficient number of fields in record. Expected 5. Received " + len,
      );
    }

    let tag = RedeemerTag.deserialize(reader);

    let index = BigNum.deserialize(reader);

    let data = $$CANT_READ("PlutusData");

    let ex_units = ExUnits.deserialize(reader);

    let invalid_transactions = new Uint32Array(
      reader.readArray((reader) => Number(reader.readUint())),
    );

    return new Redeemer(tag, index, data, ex_units, invalid_transactions);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(5);

    this._tag.serialize(writer);
    this._index.serialize(writer);
    $$CANT_WRITE("PlutusData");
    this._ex_units.serialize(writer);
    writer.writeArray(this._invalid_transactions, (writer, x) =>
      writer.writeInt(BigInt(x)),
    );
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Redeemer {
    let reader = new CBORReader(data);
    return Redeemer.deserialize(reader);
  }

  static from_hex(hex_str: string): Redeemer {
    return Redeemer.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Redeemer {
    return Redeemer.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): RedeemerTag {
    let kind = Number(reader.readInt());
    if (kind == 0) return new RedeemerTag(0);
    if (kind == 1) return new RedeemerTag(1);
    if (kind == 2) return new RedeemerTag(2);
    if (kind == 3) return new RedeemerTag(3);
    if (kind == 4) return new RedeemerTag(4);
    if (kind == 5) return new RedeemerTag(5);
    throw "Unrecognized enum value: " + kind + " for " + RedeemerTag;
  }

  serialize(writer: CBORWriter): void {
    writer.writeInt(BigInt(this.kind_));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): RedeemerTag {
    let reader = new CBORReader(data);
    return RedeemerTag.deserialize(reader);
  }

  static from_hex(hex_str: string): RedeemerTag {
    return RedeemerTag.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): RedeemerTag {
    return RedeemerTag.from_bytes(this.to_bytes());
  }
}

export class Redeemers {
  private items: Redeemer[];

  constructor(items: Redeemer[]) {
    this.items = items;
  }

  static new(): Redeemers {
    return new Redeemers([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): Redeemer {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: Redeemer): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader): Redeemers {
    return new Redeemers(
      reader.readArray((reader) => Redeemer.deserialize(reader)),
    );
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Redeemers {
    let reader = new CBORReader(data);
    return Redeemers.deserialize(reader);
  }

  static from_hex(hex_str: string): Redeemers {
    return Redeemers.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Redeemers {
    return Redeemers.from_bytes(this.to_bytes());
  }

  total_ex_units(): ExUnits {
    let tot_mem = BigNum.zero();
    let tot_steps = BigNum.zero();

    for (let i = 0; i < this.items.length; i++) {
      const r = this.items[i];
      const exUnits = r.ex_units();
      tot_mem = tot_mem.checked_add(exUnits.mem());
      tot_steps = tot_steps.checked_add(exUnits.steps());
    }
    return ExUnits.new(tot_mem, tot_steps);
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

  static deserialize(reader: CBORReader): RegCert {
    let stake_credential = Credential.deserialize(reader);

    let coin = BigNum.deserialize(reader);

    return new RegCert(stake_credential, coin);
  }

  serialize(writer: CBORWriter): void {
    this._stake_credential.serialize(writer);
    this._coin.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): RegCert {
    let reader = new CBORReader(data);
    return RegCert.deserialize(reader);
  }

  static from_hex(hex_str: string): RegCert {
    return RegCert.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): RegCert {
    return RegCert.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): Relay {
    let len = reader.readArrayTag();
    let tag = Number(reader.readUint());
    let variant: RelayVariant;

    switch (tag) {
      case 0:
        if (len != null && len - 1 != 3) {
          throw new Error("Expected 3 items to decode SingleHostAddr");
        }
        variant = {
          kind: 0,
          value: SingleHostAddr.deserialize(reader),
        };

        break;

      case 1:
        if (len != null && len - 1 != 2) {
          throw new Error("Expected 2 items to decode SingleHostName");
        }
        variant = {
          kind: 1,
          value: SingleHostName.deserialize(reader),
        };

        break;

      case 2:
        if (len != null && len - 1 != 1) {
          throw new Error("Expected 1 items to decode MultiHostName");
        }
        variant = {
          kind: 2,
          value: MultiHostName.deserialize(reader),
        };

        break;
    }

    if (len == null) {
      reader.readBreak();
    }

    throw new Error("Unexpected tag for Relay: " + tag);
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

  static from_bytes(data: Uint8Array): Relay {
    let reader = new CBORReader(data);
    return Relay.deserialize(reader);
  }

  static from_hex(hex_str: string): Relay {
    return Relay.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Relay {
    return Relay.from_bytes(this.to_bytes());
  }
}

export class Relays {
  private items: Relay[];

  constructor(items: Relay[]) {
    this.items = items;
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

  static deserialize(reader: CBORReader): Relays {
    return new Relays(reader.readArray((reader) => Relay.deserialize(reader)));
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Relays {
    let reader = new CBORReader(data);
    return Relays.deserialize(reader);
  }

  static from_hex(hex_str: string): Relays {
    return Relays.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Relays {
    return Relays.from_bytes(this.to_bytes());
  }
}

export class RewardAddresses {
  private items: unknown[];

  constructor(items: unknown[]) {
    this.items = items;
  }

  static new(): RewardAddresses {
    return new RewardAddresses([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): unknown {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: unknown): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader): RewardAddresses {
    return new RewardAddresses(
      reader.readArray((reader) => $$CANT_READ("RewardAddress")),
    );
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(this.items, (writer, x) => $$CANT_WRITE("RewardAddress"));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): RewardAddresses {
    let reader = new CBORReader(data);
    return RewardAddresses.deserialize(reader);
  }

  static from_hex(hex_str: string): RewardAddresses {
    return RewardAddresses.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): RewardAddresses {
    return RewardAddresses.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): ScriptAll {
    let native_scripts = NativeScripts.deserialize(reader);

    return new ScriptAll(native_scripts);
  }

  serialize(writer: CBORWriter): void {
    this._native_scripts.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): ScriptAll {
    let reader = new CBORReader(data);
    return ScriptAll.deserialize(reader);
  }

  static from_hex(hex_str: string): ScriptAll {
    return ScriptAll.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): ScriptAll {
    return ScriptAll.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): ScriptAny {
    let native_scripts = NativeScripts.deserialize(reader);

    return new ScriptAny(native_scripts);
  }

  serialize(writer: CBORWriter): void {
    this._native_scripts.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): ScriptAny {
    let reader = new CBORReader(data);
    return ScriptAny.deserialize(reader);
  }

  static from_hex(hex_str: string): ScriptAny {
    return ScriptAny.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): ScriptAny {
    return ScriptAny.from_bytes(this.to_bytes());
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
    let decoded = bech32.decode(bech_str);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new ScriptDataHash(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words);
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

  static deserialize(reader: CBORReader): ScriptDataHash {
    return new ScriptDataHash(reader.readBytes());
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
    let decoded = bech32.decode(bech_str);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new ScriptHash(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words);
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

  static deserialize(reader: CBORReader): ScriptHash {
    return new ScriptHash(reader.readBytes());
  }

  serialize(writer: CBORWriter): void {
    writer.writeBytes(this.inner);
  }
}

export class ScriptHashes {
  private items: ScriptHash[];

  constructor(items: ScriptHash[]) {
    this.items = items;
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

  static deserialize(reader: CBORReader): ScriptHashes {
    return new ScriptHashes(
      reader.readArray((reader) => ScriptHash.deserialize(reader)),
    );
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): ScriptHashes {
    let reader = new CBORReader(data);
    return ScriptHashes.deserialize(reader);
  }

  static from_hex(hex_str: string): ScriptHashes {
    return ScriptHashes.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): ScriptHashes {
    return ScriptHashes.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): ScriptNOfK {
    let n = Number(reader.readInt());

    let native_scripts = NativeScripts.deserialize(reader);

    return new ScriptNOfK(n, native_scripts);
  }

  serialize(writer: CBORWriter): void {
    writer.writeInt(BigInt(this._n));
    this._native_scripts.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): ScriptNOfK {
    let reader = new CBORReader(data);
    return ScriptNOfK.deserialize(reader);
  }

  static from_hex(hex_str: string): ScriptNOfK {
    return ScriptNOfK.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): ScriptNOfK {
    return ScriptNOfK.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): ScriptPubname {
    let addr_keyhash = Ed25519KeyHash.deserialize(reader);

    return new ScriptPubname(addr_keyhash);
  }

  serialize(writer: CBORWriter): void {
    this._addr_keyhash.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): ScriptPubname {
    let reader = new CBORReader(data);
    return ScriptPubname.deserialize(reader);
  }

  static from_hex(hex_str: string): ScriptPubname {
    return ScriptPubname.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): ScriptPubname {
    return ScriptPubname.from_bytes(this.to_bytes());
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
  | { kind: 1; value: Uint8Array }
  | { kind: 2; value: Uint8Array }
  | { kind: 3; value: Uint8Array };

export class ScriptRef {
  private variant: ScriptRefVariant;

  constructor(variant: ScriptRefVariant) {
    this.variant = variant;
  }

  static new_native_script(native_script: NativeScript): ScriptRef {
    return new ScriptRef({ kind: 0, value: native_script });
  }

  static new_plutus_script_v1(plutus_script_v1: Uint8Array): ScriptRef {
    return new ScriptRef({ kind: 1, value: plutus_script_v1 });
  }

  static new_plutus_script_v2(plutus_script_v2: Uint8Array): ScriptRef {
    return new ScriptRef({ kind: 2, value: plutus_script_v2 });
  }

  static new_plutus_script_v3(plutus_script_v3: Uint8Array): ScriptRef {
    return new ScriptRef({ kind: 3, value: plutus_script_v3 });
  }

  as_native_script(): NativeScript | undefined {
    if (this.variant.kind == 0) return this.variant.value;
  }

  as_plutus_script_v1(): Uint8Array | undefined {
    if (this.variant.kind == 1) return this.variant.value;
  }

  as_plutus_script_v2(): Uint8Array | undefined {
    if (this.variant.kind == 2) return this.variant.value;
  }

  as_plutus_script_v3(): Uint8Array | undefined {
    if (this.variant.kind == 3) return this.variant.value;
  }

  kind(): ScriptRefKind {
    return this.variant.kind;
  }

  static deserialize(reader: CBORReader): ScriptRef {
    let len = reader.readArrayTag();
    let tag = Number(reader.readUint());
    let variant: ScriptRefVariant;

    switch (tag) {
      case 0:
        if (len != null && len - 1 != 1) {
          throw new Error("Expected 1 items to decode NativeScript");
        }
        variant = {
          kind: 0,
          value: NativeScript.deserialize(reader),
        };

        break;

      case 1:
        if (len != null && len - 1 != 1) {
          throw new Error("Expected 1 items to decode PlutusScriptV1");
        }
        variant = {
          kind: 1,
          value: reader.readBytes(),
        };

        break;

      case 2:
        if (len != null && len - 1 != 1) {
          throw new Error("Expected 1 items to decode PlutusScriptV2");
        }
        variant = {
          kind: 2,
          value: reader.readBytes(),
        };

        break;

      case 3:
        if (len != null && len - 1 != 1) {
          throw new Error("Expected 1 items to decode PlutusScriptV3");
        }
        variant = {
          kind: 3,
          value: reader.readBytes(),
        };

        break;
    }

    if (len == null) {
      reader.readBreak();
    }

    throw new Error("Unexpected tag for ScriptRef: " + tag);
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
        writer.writeBytes(this.variant.value);
        break;
      case 2:
        writer.writeArrayTag(2);
        writer.writeInt(BigInt(2));
        writer.writeBytes(this.variant.value);
        break;
      case 3:
        writer.writeArrayTag(2);
        writer.writeInt(BigInt(3));
        writer.writeBytes(this.variant.value);
        break;
    }
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): ScriptRef {
    let reader = new CBORReader(data);
    return ScriptRef.deserialize(reader);
  }

  static from_hex(hex_str: string): ScriptRef {
    return ScriptRef.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): ScriptRef {
    return ScriptRef.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): SingleHostAddr {
    let port = reader.readNullable((r) => Number(r.readInt())) ?? undefined;

    let ipv4 = reader.readNullable((r) => Ipv4.deserialize(r)) ?? undefined;

    let ipv6 = reader.readNullable((r) => Ipv6.deserialize(r)) ?? undefined;

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

  static from_bytes(data: Uint8Array): SingleHostAddr {
    let reader = new CBORReader(data);
    return SingleHostAddr.deserialize(reader);
  }

  static from_hex(hex_str: string): SingleHostAddr {
    return SingleHostAddr.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): SingleHostAddr {
    return SingleHostAddr.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): SingleHostName {
    let port = reader.readNullable((r) => Number(r.readInt())) ?? undefined;

    let dns_name = DNSRecordAorAAAA.deserialize(reader);

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

  static from_bytes(data: Uint8Array): SingleHostName {
    let reader = new CBORReader(data);
    return SingleHostName.deserialize(reader);
  }

  static from_hex(hex_str: string): SingleHostName {
    return SingleHostName.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): SingleHostName {
    return SingleHostName.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): StakeAndVoteDelegation {
    let stake_credential = Credential.deserialize(reader);

    let pool_keyhash = Ed25519KeyHash.deserialize(reader);

    let drep = DRep.deserialize(reader);

    return new StakeAndVoteDelegation(stake_credential, pool_keyhash, drep);
  }

  serialize(writer: CBORWriter): void {
    this._stake_credential.serialize(writer);
    this._pool_keyhash.serialize(writer);
    this._drep.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): StakeAndVoteDelegation {
    let reader = new CBORReader(data);
    return StakeAndVoteDelegation.deserialize(reader);
  }

  static from_hex(hex_str: string): StakeAndVoteDelegation {
    return StakeAndVoteDelegation.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): StakeAndVoteDelegation {
    return StakeAndVoteDelegation.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): StakeDelegation {
    let stake_credential = Credential.deserialize(reader);

    let pool_keyhash = Ed25519KeyHash.deserialize(reader);

    return new StakeDelegation(stake_credential, pool_keyhash);
  }

  serialize(writer: CBORWriter): void {
    this._stake_credential.serialize(writer);
    this._pool_keyhash.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): StakeDelegation {
    let reader = new CBORReader(data);
    return StakeDelegation.deserialize(reader);
  }

  static from_hex(hex_str: string): StakeDelegation {
    return StakeDelegation.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): StakeDelegation {
    return StakeDelegation.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): StakeDeregistration {
    let stake_credential = Credential.deserialize(reader);

    return new StakeDeregistration(stake_credential);
  }

  serialize(writer: CBORWriter): void {
    this._stake_credential.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): StakeDeregistration {
    let reader = new CBORReader(data);
    return StakeDeregistration.deserialize(reader);
  }

  static from_hex(hex_str: string): StakeDeregistration {
    return StakeDeregistration.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): StakeDeregistration {
    return StakeDeregistration.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): StakeRegistration {
    let stake_credential = Credential.deserialize(reader);

    return new StakeRegistration(stake_credential);
  }

  serialize(writer: CBORWriter): void {
    this._stake_credential.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): StakeRegistration {
    let reader = new CBORReader(data);
    return StakeRegistration.deserialize(reader);
  }

  static from_hex(hex_str: string): StakeRegistration {
    return StakeRegistration.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): StakeRegistration {
    return StakeRegistration.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): StakeRegistrationAndDelegation {
    let stake_credential = Credential.deserialize(reader);

    let pool_keyhash = Ed25519KeyHash.deserialize(reader);

    let coin = BigNum.deserialize(reader);

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

  static from_bytes(data: Uint8Array): StakeRegistrationAndDelegation {
    let reader = new CBORReader(data);
    return StakeRegistrationAndDelegation.deserialize(reader);
  }

  static from_hex(hex_str: string): StakeRegistrationAndDelegation {
    return StakeRegistrationAndDelegation.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): StakeRegistrationAndDelegation {
    return StakeRegistrationAndDelegation.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): StakeVoteRegistrationAndDelegation {
    let stake_credential = Credential.deserialize(reader);

    let pool_keyhash = Ed25519KeyHash.deserialize(reader);

    let drep = DRep.deserialize(reader);

    let coin = BigNum.deserialize(reader);

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

  static from_bytes(data: Uint8Array): StakeVoteRegistrationAndDelegation {
    let reader = new CBORReader(data);
    return StakeVoteRegistrationAndDelegation.deserialize(reader);
  }

  static from_hex(hex_str: string): StakeVoteRegistrationAndDelegation {
    return StakeVoteRegistrationAndDelegation.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): StakeVoteRegistrationAndDelegation {
    return StakeVoteRegistrationAndDelegation.from_bytes(this.to_bytes());
  }
}

export class TimelockExpiry {
  private _slot: BigNum;

  constructor(slot: BigNum) {
    this._slot = slot;
  }

  static new(slot: BigNum) {
    return new TimelockExpiry(slot);
  }

  slot(): BigNum {
    return this._slot;
  }

  set_slot(slot: BigNum): void {
    this._slot = slot;
  }

  static deserialize(reader: CBORReader): TimelockExpiry {
    let slot = BigNum.deserialize(reader);

    return new TimelockExpiry(slot);
  }

  serialize(writer: CBORWriter): void {
    this._slot.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): TimelockExpiry {
    let reader = new CBORReader(data);
    return TimelockExpiry.deserialize(reader);
  }

  static from_hex(hex_str: string): TimelockExpiry {
    return TimelockExpiry.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): TimelockExpiry {
    return TimelockExpiry.from_bytes(this.to_bytes());
  }
}

export class TimelockStart {
  private _slot: BigNum;

  constructor(slot: BigNum) {
    this._slot = slot;
  }

  static new(slot: BigNum) {
    return new TimelockStart(slot);
  }

  slot(): BigNum {
    return this._slot;
  }

  set_slot(slot: BigNum): void {
    this._slot = slot;
  }

  static deserialize(reader: CBORReader): TimelockStart {
    let slot = BigNum.deserialize(reader);

    return new TimelockStart(slot);
  }

  serialize(writer: CBORWriter): void {
    this._slot.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): TimelockStart {
    let reader = new CBORReader(data);
    return TimelockStart.deserialize(reader);
  }

  static from_hex(hex_str: string): TimelockStart {
    return TimelockStart.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): TimelockStart {
    return TimelockStart.from_bytes(this.to_bytes());
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

  static new(
    body: TransactionBody,
    witness_set: TransactionWitnessSet,
    is_valid: boolean,
    auxiliary_data: AuxiliaryData | undefined,
  ) {
    return new Transaction(body, witness_set, is_valid, auxiliary_data);
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

  static deserialize(reader: CBORReader): Transaction {
    let len = reader.readArrayTag();

    if (len != null && len < 4) {
      throw new Error(
        "Insufficient number of fields in record. Expected 4. Received " + len,
      );
    }

    let body = TransactionBody.deserialize(reader);

    let witness_set = TransactionWitnessSet.deserialize(reader);

    let is_valid = reader.readBoolean();

    let auxiliary_data =
      reader.readNullable((r) => AuxiliaryData.deserialize(r)) ?? undefined;

    return new Transaction(body, witness_set, is_valid, auxiliary_data);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(4);

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

  static from_bytes(data: Uint8Array): Transaction {
    let reader = new CBORReader(data);
    return Transaction.deserialize(reader);
  }

  static from_hex(hex_str: string): Transaction {
    return Transaction.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Transaction {
    return Transaction.from_bytes(this.to_bytes());
  }
}

export class TransactionBodies {
  private items: TransactionBody[];

  constructor(items: TransactionBody[]) {
    this.items = items;
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

  static deserialize(reader: CBORReader): TransactionBodies {
    return new TransactionBodies(
      reader.readArray((reader) => TransactionBody.deserialize(reader)),
    );
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): TransactionBodies {
    let reader = new CBORReader(data);
    return TransactionBodies.deserialize(reader);
  }

  static from_hex(hex_str: string): TransactionBodies {
    return TransactionBodies.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): TransactionBodies {
    return TransactionBodies.from_bytes(this.to_bytes());
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

  static new(
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

  ttl(): BigNum | undefined {
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

  validity_start_interval(): BigNum | undefined {
    return this._validity_start_interval;
  }

  set_validity_start_interval(
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

  static deserialize(reader: CBORReader): TransactionBody {
    let fields: any = {};
    reader.readMap((r) => {
      let key = Number(r.readUint());
      switch (key) {
        case 0:
          fields.inputs = TransactionInputs.deserialize(r);
          break;

        case 1:
          fields.outputs = TransactionOutputs.deserialize(r);
          break;

        case 2:
          fields.fee = BigNum.deserialize(r);
          break;

        case 3:
          fields.ttl = BigNum.deserialize(r);
          break;

        case 4:
          fields.certs = Certificates.deserialize(r);
          break;

        case 5:
          fields.withdrawals = Withdrawals.deserialize(r);
          break;

        case 7:
          fields.auxiliary_data_hash = AuxiliaryDataHash.deserialize(r);
          break;

        case 8:
          fields.validity_start_interval = BigNum.deserialize(r);
          break;

        case 9:
          fields.mint = Mint.deserialize(r);
          break;

        case 11:
          fields.script_data_hash = ScriptDataHash.deserialize(r);
          break;

        case 13:
          fields.collateral = TransactionInputs.deserialize(r);
          break;

        case 14:
          fields.required_signers = Ed25519KeyHashes.deserialize(r);
          break;

        case 15:
          fields.network_id = NetworkId.deserialize(r);
          break;

        case 16:
          fields.collateral_return = TransactionOutput.deserialize(r);
          break;

        case 17:
          fields.total_collateral = BigNum.deserialize(r);
          break;

        case 18:
          fields.reference_inputs = TransactionInputs.deserialize(r);
          break;

        case 19:
          fields.voting_procedures = VotingProcedures.deserialize(r);
          break;

        case 20:
          fields.voting_proposals = VotingProposals.deserialize(r);
          break;

        case 21:
          fields.current_treasury_value = BigNum.deserialize(r);
          break;

        case 22:
          fields.donation = BigNum.deserialize(r);
          break;
      }
    });

    if (fields.inputs === undefined)
      throw new Error("Value not provided for field 0 (inputs)");
    let inputs = fields.inputs;
    if (fields.outputs === undefined)
      throw new Error("Value not provided for field 1 (outputs)");
    let outputs = fields.outputs;
    if (fields.fee === undefined)
      throw new Error("Value not provided for field 2 (fee)");
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

  static from_bytes(data: Uint8Array): TransactionBody {
    let reader = new CBORReader(data);
    return TransactionBody.deserialize(reader);
  }

  static from_hex(hex_str: string): TransactionBody {
    return TransactionBody.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): TransactionBody {
    return TransactionBody.from_bytes(this.to_bytes());
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
    let decoded = bech32.decode(bech_str);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new TransactionHash(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words);
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

  static deserialize(reader: CBORReader): TransactionHash {
    return new TransactionHash(reader.readBytes());
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

  static deserialize(reader: CBORReader): TransactionInput {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let transaction_id = TransactionHash.deserialize(reader);

    let index = Number(reader.readInt());

    return new TransactionInput(transaction_id, index);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    this._transaction_id.serialize(writer);
    writer.writeInt(BigInt(this._index));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): TransactionInput {
    let reader = new CBORReader(data);
    return TransactionInput.deserialize(reader);
  }

  static from_hex(hex_str: string): TransactionInput {
    return TransactionInput.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): TransactionInput {
    return TransactionInput.from_bytes(this.to_bytes());
  }
}

export class TransactionInputs {
  private items: TransactionInput[];

  constructor() {
    this.items = [];
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

  static deserialize(reader: CBORReader): TransactionInputs {
    let ret = new TransactionInputs();
    if (reader.peekType() == "tagged") {
      let tag = reader.readTaggedTag();
      if (tag != 258) throw new Error("Expected tag 258. Got " + tag);
    }
    reader.readArray((reader) => ret.add(TransactionInput.deserialize(reader)));
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeTaggedTag(258);
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): TransactionInputs {
    let reader = new CBORReader(data);
    return TransactionInputs.deserialize(reader);
  }

  static from_hex(hex_str: string): TransactionInputs {
    return TransactionInputs.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): TransactionInputs {
    return TransactionInputs.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): TransactionMetadatum {
    let tag = reader.peekType();
    let variant: TransactionMetadatumVariant;

    switch (tag) {
      case "map":
        variant = {
          kind: TransactionMetadatumKind.MetadataMap,
          value: MetadataMap.deserialize(reader),
        };
        break;

      case "array":
        variant = {
          kind: TransactionMetadatumKind.MetadataList,
          value: MetadataList.deserialize(reader),
        };
        break;

      case "uint":
      case "nint":
        variant = {
          kind: TransactionMetadatumKind.Int,
          value: Int.deserialize(reader),
        };
        break;

      case "bytes":
        variant = {
          kind: TransactionMetadatumKind.Bytes,
          value: reader.readBytes(),
        };
        break;

      case "string":
        variant = {
          kind: TransactionMetadatumKind.Text,
          value: reader.readString(),
        };
        break;

      default:
        throw new Error("Unexpected subtype for TransactionMetadatum: " + tag);
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

  static from_bytes(data: Uint8Array): TransactionMetadatum {
    let reader = new CBORReader(data);
    return TransactionMetadatum.deserialize(reader);
  }

  static from_hex(hex_str: string): TransactionMetadatum {
    return TransactionMetadatum.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): TransactionMetadatum {
    return TransactionMetadatum.from_bytes(this.to_bytes());
  }
}

export class TransactionMetadatumLabels {
  private items: BigNum[];

  constructor(items: BigNum[]) {
    this.items = items;
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

  static deserialize(reader: CBORReader): TransactionMetadatumLabels {
    return new TransactionMetadatumLabels(
      reader.readArray((reader) => BigNum.deserialize(reader)),
    );
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): TransactionMetadatumLabels {
    let reader = new CBORReader(data);
    return TransactionMetadatumLabels.deserialize(reader);
  }

  static from_hex(hex_str: string): TransactionMetadatumLabels {
    return TransactionMetadatumLabels.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): TransactionMetadatumLabels {
    return TransactionMetadatumLabels.from_bytes(this.to_bytes());
  }
}

export class TransactionOutput {
  private _address: unknown;
  private _amount: Value;
  private _plutus_data: DataOption | undefined;
  private _script_ref: ScriptRef | undefined;

  constructor(
    address: unknown,
    amount: Value,
    plutus_data: DataOption | undefined,
    script_ref: ScriptRef | undefined,
  ) {
    this._address = address;
    this._amount = amount;
    this._plutus_data = plutus_data;
    this._script_ref = script_ref;
  }

  static new(
    address: unknown,
    amount: Value,
    plutus_data: DataOption | undefined,
    script_ref: ScriptRef | undefined,
  ) {
    return new TransactionOutput(address, amount, plutus_data, script_ref);
  }

  address(): unknown {
    return this._address;
  }

  set_address(address: unknown): void {
    this._address = address;
  }

  amount(): Value {
    return this._amount;
  }

  set_amount(amount: Value): void {
    this._amount = amount;
  }

  plutus_data(): DataOption | undefined {
    return this._plutus_data;
  }

  set_plutus_data(plutus_data: DataOption | undefined): void {
    this._plutus_data = plutus_data;
  }

  script_ref(): ScriptRef | undefined {
    return this._script_ref;
  }

  set_script_ref(script_ref: ScriptRef | undefined): void {
    this._script_ref = script_ref;
  }

  static deserialize(reader: CBORReader): TransactionOutput {
    let fields: any = {};
    reader.readMap((r) => {
      let key = Number(r.readUint());
      switch (key) {
        case 0:
          fields.address = $$CANT_READ("Address");
          break;

        case 1:
          fields.amount = Value.deserialize(r);
          break;

        case 2:
          fields.plutus_data = DataOption.deserialize(r);
          break;

        case 3:
          fields.script_ref = ScriptRef.deserialize(r);
          break;
      }
    });

    if (fields.address === undefined)
      throw new Error("Value not provided for field 0 (address)");
    let address = fields.address;
    if (fields.amount === undefined)
      throw new Error("Value not provided for field 1 (amount)");
    let amount = fields.amount;

    let plutus_data = fields.plutus_data;

    let script_ref = fields.script_ref;

    return new TransactionOutput(address, amount, plutus_data, script_ref);
  }

  serialize(writer: CBORWriter): void {
    let len = 4;
    if (this._plutus_data === undefined) len -= 1;
    if (this._script_ref === undefined) len -= 1;
    writer.writeMapTag(len);

    writer.writeInt(0n);
    $$CANT_WRITE("Address");

    writer.writeInt(1n);
    this._amount.serialize(writer);

    if (this._plutus_data !== undefined) {
      writer.writeInt(2n);
      this._plutus_data.serialize(writer);
    }
    if (this._script_ref !== undefined) {
      writer.writeInt(3n);
      this._script_ref.serialize(writer);
    }
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): TransactionOutput {
    let reader = new CBORReader(data);
    return TransactionOutput.deserialize(reader);
  }

  static from_hex(hex_str: string): TransactionOutput {
    return TransactionOutput.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): TransactionOutput {
    return TransactionOutput.from_bytes(this.to_bytes());
  }
}

export class TransactionOutputs {
  private items: TransactionOutput[];

  constructor(items: TransactionOutput[]) {
    this.items = items;
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

  static deserialize(reader: CBORReader): TransactionOutputs {
    return new TransactionOutputs(
      reader.readArray((reader) => TransactionOutput.deserialize(reader)),
    );
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): TransactionOutputs {
    let reader = new CBORReader(data);
    return TransactionOutputs.deserialize(reader);
  }

  static from_hex(hex_str: string): TransactionOutputs {
    return TransactionOutputs.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): TransactionOutputs {
    return TransactionOutputs.from_bytes(this.to_bytes());
  }
}

export class TransactionWitnessSet {
  private _vkeys: Vkeywitnesses | undefined;
  private _native_scripts: NativeScripts | undefined;
  private _bootstraps: BootstrapWitnesses | undefined;
  private _plutus_scripts_v1: PlutusScripts | undefined;
  private _plutus_data: PlutusList | undefined;
  private _redeemers: Redeemers | undefined;
  private _plutus_scripts_v2: PlutusScripts | undefined;
  private _plutus_scripts_v3: PlutusScripts | undefined;

  constructor(
    vkeys: Vkeywitnesses | undefined,
    native_scripts: NativeScripts | undefined,
    bootstraps: BootstrapWitnesses | undefined,
    plutus_scripts_v1: PlutusScripts | undefined,
    plutus_data: PlutusList | undefined,
    redeemers: Redeemers | undefined,
    plutus_scripts_v2: PlutusScripts | undefined,
    plutus_scripts_v3: PlutusScripts | undefined,
  ) {
    this._vkeys = vkeys;
    this._native_scripts = native_scripts;
    this._bootstraps = bootstraps;
    this._plutus_scripts_v1 = plutus_scripts_v1;
    this._plutus_data = plutus_data;
    this._redeemers = redeemers;
    this._plutus_scripts_v2 = plutus_scripts_v2;
    this._plutus_scripts_v3 = plutus_scripts_v3;
  }

  static new(
    vkeys: Vkeywitnesses | undefined,
    native_scripts: NativeScripts | undefined,
    bootstraps: BootstrapWitnesses | undefined,
    plutus_scripts_v1: PlutusScripts | undefined,
    plutus_data: PlutusList | undefined,
    redeemers: Redeemers | undefined,
    plutus_scripts_v2: PlutusScripts | undefined,
    plutus_scripts_v3: PlutusScripts | undefined,
  ) {
    return new TransactionWitnessSet(
      vkeys,
      native_scripts,
      bootstraps,
      plutus_scripts_v1,
      plutus_data,
      redeemers,
      plutus_scripts_v2,
      plutus_scripts_v3,
    );
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

  plutus_data(): PlutusList | undefined {
    return this._plutus_data;
  }

  set_plutus_data(plutus_data: PlutusList | undefined): void {
    this._plutus_data = plutus_data;
  }

  redeemers(): Redeemers | undefined {
    return this._redeemers;
  }

  set_redeemers(redeemers: Redeemers | undefined): void {
    this._redeemers = redeemers;
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

  static deserialize(reader: CBORReader): TransactionWitnessSet {
    let fields: any = {};
    reader.readMap((r) => {
      let key = Number(r.readUint());
      switch (key) {
        case 0:
          fields.vkeys = Vkeywitnesses.deserialize(r);
          break;

        case 1:
          fields.native_scripts = NativeScripts.deserialize(r);
          break;

        case 2:
          fields.bootstraps = BootstrapWitnesses.deserialize(r);
          break;

        case 3:
          fields.plutus_scripts_v1 = PlutusScripts.deserialize(r);
          break;

        case 4:
          fields.plutus_data = PlutusList.deserialize(r);
          break;

        case 5:
          fields.redeemers = Redeemers.deserialize(r);
          break;

        case 6:
          fields.plutus_scripts_v2 = PlutusScripts.deserialize(r);
          break;

        case 7:
          fields.plutus_scripts_v3 = PlutusScripts.deserialize(r);
          break;
      }
    });

    let vkeys = fields.vkeys;

    let native_scripts = fields.native_scripts;

    let bootstraps = fields.bootstraps;

    let plutus_scripts_v1 = fields.plutus_scripts_v1;

    let plutus_data = fields.plutus_data;

    let redeemers = fields.redeemers;

    let plutus_scripts_v2 = fields.plutus_scripts_v2;

    let plutus_scripts_v3 = fields.plutus_scripts_v3;

    return new TransactionWitnessSet(
      vkeys,
      native_scripts,
      bootstraps,
      plutus_scripts_v1,
      plutus_data,
      redeemers,
      plutus_scripts_v2,
      plutus_scripts_v3,
    );
  }

  serialize(writer: CBORWriter): void {
    let len = 8;
    if (this._vkeys === undefined) len -= 1;
    if (this._native_scripts === undefined) len -= 1;
    if (this._bootstraps === undefined) len -= 1;
    if (this._plutus_scripts_v1 === undefined) len -= 1;
    if (this._plutus_data === undefined) len -= 1;
    if (this._redeemers === undefined) len -= 1;
    if (this._plutus_scripts_v2 === undefined) len -= 1;
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
    if (this._plutus_data !== undefined) {
      writer.writeInt(4n);
      this._plutus_data.serialize(writer);
    }
    if (this._redeemers !== undefined) {
      writer.writeInt(5n);
      this._redeemers.serialize(writer);
    }
    if (this._plutus_scripts_v2 !== undefined) {
      writer.writeInt(6n);
      this._plutus_scripts_v2.serialize(writer);
    }
    if (this._plutus_scripts_v3 !== undefined) {
      writer.writeInt(7n);
      this._plutus_scripts_v3.serialize(writer);
    }
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): TransactionWitnessSet {
    let reader = new CBORReader(data);
    return TransactionWitnessSet.deserialize(reader);
  }

  static from_hex(hex_str: string): TransactionWitnessSet {
    return TransactionWitnessSet.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): TransactionWitnessSet {
    return TransactionWitnessSet.from_bytes(this.to_bytes());
  }
}

export class TransactionWitnessSets {
  private items: TransactionWitnessSet[];

  constructor(items: TransactionWitnessSet[]) {
    this.items = items;
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

  static deserialize(reader: CBORReader): TransactionWitnessSets {
    return new TransactionWitnessSets(
      reader.readArray((reader) => TransactionWitnessSet.deserialize(reader)),
    );
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): TransactionWitnessSets {
    let reader = new CBORReader(data);
    return TransactionWitnessSets.deserialize(reader);
  }

  static from_hex(hex_str: string): TransactionWitnessSets {
    return TransactionWitnessSets.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): TransactionWitnessSets {
    return TransactionWitnessSets.from_bytes(this.to_bytes());
  }
}

export class TreasuryWithdrawals {
  private items: [unknown, BigNum][];

  constructor(items: [unknown, BigNum][]) {
    this.items = items;
  }

  static new(): TreasuryWithdrawals {
    return new TreasuryWithdrawals([]);
  }

  len(): number {
    return this.items.length;
  }

  insert(key: unknown, value: BigNum): BigNum | undefined {
    let entry = this.items.find((x) => $$CANT_EQ("RewardAddress"));
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this.items.push([key, value]);
    return undefined;
  }

  get(key: unknown): BigNum | undefined {
    let entry = this.items.find((x) => $$CANT_EQ("RewardAddress"));
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: unknown[]): void {
    this.items = this.items.filter(([k, _v]) =>
      keys.every((key) => !$$CANT_EQ("RewardAddress")),
    );
  }

  keys(): RewardAddresses {
    let keys = RewardAddresses.new();
    for (let [key, _] of this.items) keys.add(key);
    return keys;
  }

  static deserialize(reader: CBORReader): TreasuryWithdrawals {
    let ret = new TreasuryWithdrawals([]);
    reader.readMap((reader) =>
      ret.insert($$CANT_READ("RewardAddress"), BigNum.deserialize(reader)),
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this.items, (writer, x) => {
      $$CANT_WRITE("RewardAddress");
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): TreasuryWithdrawals {
    let reader = new CBORReader(data);
    return TreasuryWithdrawals.deserialize(reader);
  }

  static from_hex(hex_str: string): TreasuryWithdrawals {
    return TreasuryWithdrawals.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): TreasuryWithdrawals {
    return TreasuryWithdrawals.from_bytes(this.to_bytes());
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

  static new(
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

  static deserialize(reader: CBORReader): TreasuryWithdrawalsAction {
    let withdrawals = TreasuryWithdrawals.deserialize(reader);

    let policy_hash =
      reader.readNullable((r) => ScriptHash.deserialize(r)) ?? undefined;

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

  static from_bytes(data: Uint8Array): TreasuryWithdrawalsAction {
    let reader = new CBORReader(data);
    return TreasuryWithdrawalsAction.deserialize(reader);
  }

  static from_hex(hex_str: string): TreasuryWithdrawalsAction {
    return TreasuryWithdrawalsAction.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): TreasuryWithdrawalsAction {
    return TreasuryWithdrawalsAction.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): URL {
    return new URL(reader.readString());
  }

  serialize(writer: CBORWriter): void {
    writer.writeString(this.inner);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): URL {
    let reader = new CBORReader(data);
    return URL.deserialize(reader);
  }

  static from_hex(hex_str: string): URL {
    return URL.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): URL {
    return URL.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): UnitInterval {
    let taggedTag = reader.readTaggedTag();
    if (taggedTag != 30) {
      throw new Error("Expected tag 30, got " + taggedTag);
    }

    return UnitInterval.deserializeInner(reader);
  }

  static deserializeInner(reader: CBORReader): UnitInterval {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let numerator = BigNum.deserialize(reader);

    let denominator = BigNum.deserialize(reader);

    return new UnitInterval(numerator, denominator);
  }

  serialize(writer: CBORWriter): void {
    writer.writeTaggedTag(30);

    this.serializeInner(writer);
  }

  serializeInner(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    this._numerator.serialize(writer);
    this._denominator.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): UnitInterval {
    let reader = new CBORReader(data);
    return UnitInterval.deserialize(reader);
  }

  static from_hex(hex_str: string): UnitInterval {
    return UnitInterval.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): UnitInterval {
    return UnitInterval.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): UnregCert {
    let stake_credential = Credential.deserialize(reader);

    let coin = BigNum.deserialize(reader);

    return new UnregCert(stake_credential, coin);
  }

  serialize(writer: CBORWriter): void {
    this._stake_credential.serialize(writer);
    this._coin.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): UnregCert {
    let reader = new CBORReader(data);
    return UnregCert.deserialize(reader);
  }

  static from_hex(hex_str: string): UnregCert {
    return UnregCert.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): UnregCert {
    return UnregCert.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): Update {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let proposed_protocol_parameter_updates =
      ProposedProtocolParameterUpdates.deserialize(reader);

    let epoch = Number(reader.readInt());

    return new Update(proposed_protocol_parameter_updates, epoch);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    this._proposed_protocol_parameter_updates.serialize(writer);
    writer.writeInt(BigInt(this._epoch));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Update {
    let reader = new CBORReader(data);
    return Update.deserialize(reader);
  }

  static from_hex(hex_str: string): Update {
    return Update.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Update {
    return Update.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): UpdateCommitteeAction {
    let gov_action_id =
      reader.readNullable((r) => GovernanceActionId.deserialize(r)) ??
      undefined;

    let committee = Committee.deserialize(reader);

    let members_to_remove = Credentials.deserialize(reader);

    return new UpdateCommitteeAction(
      gov_action_id,
      committee,
      members_to_remove,
    );
  }

  serialize(writer: CBORWriter): void {
    if (this._gov_action_id == null) {
      writer.writeNull();
    } else {
      this._gov_action_id.serialize(writer);
    }
    this._committee.serialize(writer);
    this._members_to_remove.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): UpdateCommitteeAction {
    let reader = new CBORReader(data);
    return UpdateCommitteeAction.deserialize(reader);
  }

  static from_hex(hex_str: string): UpdateCommitteeAction {
    return UpdateCommitteeAction.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): UpdateCommitteeAction {
    return UpdateCommitteeAction.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): VRFCert {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let output = reader.readBytes();

    let proof = reader.readBytes();

    return new VRFCert(output, proof);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    writer.writeBytes(this._output);
    writer.writeBytes(this._proof);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): VRFCert {
    let reader = new CBORReader(data);
    return VRFCert.deserialize(reader);
  }

  static from_hex(hex_str: string): VRFCert {
    return VRFCert.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): VRFCert {
    return VRFCert.from_bytes(this.to_bytes());
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
    let decoded = bech32.decode(bech_str);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new VRFKeyHash(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words);
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

  static deserialize(reader: CBORReader): VRFKeyHash {
    return new VRFKeyHash(reader.readBytes());
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
    let decoded = bech32.decode(bech_str);
    let words = decoded.words;
    let bytesArray = bech32.fromWords(words);
    let bytes = new Uint8Array(bytesArray);
    return new VRFVKey(bytes);
  }

  to_bech32(prefix: string): string {
    let bytes = this.to_bytes();
    let words = bech32.toWords(bytes);
    return bech32.encode(prefix, words);
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

  static deserialize(reader: CBORReader): VRFVKey {
    return new VRFVKey(reader.readBytes());
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

  static deserializeRecord(reader: CBORReader): Value {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let coin = BigNum.deserialize(reader);

    let multiasset =
      reader.readNullable((r) => MultiAsset.deserialize(r)) ?? undefined;

    return new Value(coin, multiasset);
  }

  serializeRecord(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    this._coin.serialize(writer);
    if (this._multiasset == null) {
      writer.writeNull();
    } else {
      this._multiasset.serialize(writer);
    }
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Value {
    let reader = new CBORReader(data);
    return Value.deserialize(reader);
  }

  static from_hex(hex_str: string): Value {
    return Value.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Value {
    return Value.from_bytes(this.to_bytes());
  }

  static zero(): Value {
    return Value.new(BigNum.zero());
  }

  is_zero(): boolean {
    return this._coin == 0n;
  }

  static new(coin: BigNum): Value {
    return Value.new_with_assets(coin, undefined);
  }

  static new_from_assets(multiasset: MultiAsset): Value {
    return Value.new_with_assets(BigNum.zero(), multiasset);
  }

  static deserialize(reader: CBORReader): Value {
    if (reader.peekType() == "array") {
      return Value.deserializeRecord(reader);
    }
    return Value.new(BigNum.deserialize(reader));
  }

  serialize(writer: CBORWriter): void {
    if (this._multiasset == null || this._multiasset.len() == 0) {
      this._coin.serialize(writer);
    } else {
      this.serializeRecord(writer);
    }
  }

  checked_add(rhs: Value): Value {
    let coin = this._coin.checked_add(rhs._coin);
    let multiasset: MultiAsset | undefined;
    if (this._multiasset != null) {
      multiasset = this._multiasset.clone();
      if (rhs._multiasset != null) {
        multiasset._inplace_checked_add(rhs._multiasset);
      }
    } else if (rhs._multiasset != null) {
      multiasset = rhs._multiasset.clone();
    }
    return new Value(coin, multiasset);
  }

  checked_sub(rhs: Value): Value {
    let coin = this._coin.checked_sub(rhs._coin);
    let multiasset: MultiAsset | undefined;
    if (this._multiasset != null) {
      multiasset = this._multiasset.clone();
      if (rhs._multiasset != null) {
        multiasset._inplace_clamped_sub(rhs._multiasset);
      }
    }
    return new Value(coin, multiasset);
  }

  clamped_sub(rhs: Value): Value {
    let coin = this._coin.clamped_sub(rhs._coin);
    let multiasset: MultiAsset | undefined;
    if (this._multiasset != null) {
      multiasset = this._multiasset.clone();
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

export class Vkeywitness {
  private _vkey: unknown;
  private _signature: Ed25519Signature;

  constructor(vkey: unknown, signature: Ed25519Signature) {
    this._vkey = vkey;
    this._signature = signature;
  }

  static new(vkey: unknown, signature: Ed25519Signature) {
    return new Vkeywitness(vkey, signature);
  }

  vkey(): unknown {
    return this._vkey;
  }

  set_vkey(vkey: unknown): void {
    this._vkey = vkey;
  }

  signature(): Ed25519Signature {
    return this._signature;
  }

  set_signature(signature: Ed25519Signature): void {
    this._signature = signature;
  }

  static deserialize(reader: CBORReader): Vkeywitness {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let vkey = $$CANT_READ("Vkey");

    let signature = Ed25519Signature.deserialize(reader);

    return new Vkeywitness(vkey, signature);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    $$CANT_WRITE("Vkey");
    this._signature.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Vkeywitness {
    let reader = new CBORReader(data);
    return Vkeywitness.deserialize(reader);
  }

  static from_hex(hex_str: string): Vkeywitness {
    return Vkeywitness.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Vkeywitness {
    return Vkeywitness.from_bytes(this.to_bytes());
  }
}

export class Vkeywitnesses {
  private items: Vkeywitness[];

  constructor() {
    this.items = [];
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

  static deserialize(reader: CBORReader): Vkeywitnesses {
    let ret = new Vkeywitnesses();
    if (reader.peekType() == "tagged") {
      let tag = reader.readTaggedTag();
      if (tag != 258) throw new Error("Expected tag 258. Got " + tag);
    }
    reader.readArray((reader) => ret.add(Vkeywitness.deserialize(reader)));
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeTaggedTag(258);
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Vkeywitnesses {
    let reader = new CBORReader(data);
    return Vkeywitnesses.deserialize(reader);
  }

  static from_hex(hex_str: string): Vkeywitnesses {
    return Vkeywitnesses.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Vkeywitnesses {
    return Vkeywitnesses.from_bytes(this.to_bytes());
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

  static deserialize(reader: CBORReader): VoteDelegation {
    let stake_credential = Credential.deserialize(reader);

    let drep = DRep.deserialize(reader);

    return new VoteDelegation(stake_credential, drep);
  }

  serialize(writer: CBORWriter): void {
    this._stake_credential.serialize(writer);
    this._drep.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): VoteDelegation {
    let reader = new CBORReader(data);
    return VoteDelegation.deserialize(reader);
  }

  static from_hex(hex_str: string): VoteDelegation {
    return VoteDelegation.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): VoteDelegation {
    return VoteDelegation.from_bytes(this.to_bytes());
  }
}

export enum VoteKind {
  No = 0,
  Yes = 1,
  Abstain = 2,
}

export function deserializeVoteKind(reader: CBORReader): VoteKind {
  let value = Number(reader.readInt());
  switch (value) {
    case 0:
      return VoteKind.No;
    case 1:
      return VoteKind.Yes;
    case 2:
      return VoteKind.Abstain;
  }
  throw new Error("Invalid value for enum VoteKind: " + value);
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

  static deserialize(reader: CBORReader): VoteRegistrationAndDelegation {
    let stake_credential = Credential.deserialize(reader);

    let drep = DRep.deserialize(reader);

    let coin = BigNum.deserialize(reader);

    return new VoteRegistrationAndDelegation(stake_credential, drep, coin);
  }

  serialize(writer: CBORWriter): void {
    this._stake_credential.serialize(writer);
    this._drep.serialize(writer);
    this._coin.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): VoteRegistrationAndDelegation {
    let reader = new CBORReader(data);
    return VoteRegistrationAndDelegation.deserialize(reader);
  }

  static from_hex(hex_str: string): VoteRegistrationAndDelegation {
    return VoteRegistrationAndDelegation.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): VoteRegistrationAndDelegation {
    return VoteRegistrationAndDelegation.from_bytes(this.to_bytes());
  }
}

export class Voters {
  private items: unknown[];

  constructor(items: unknown[]) {
    this.items = items;
  }

  static new(): Voters {
    return new Voters([]);
  }

  len(): number {
    return this.items.length;
  }

  get(index: number): unknown {
    if (index >= this.items.length) throw new Error("Array out of bounds");
    return this.items[index];
  }

  add(elem: unknown): void {
    this.items.push(elem);
  }

  static deserialize(reader: CBORReader): Voters {
    return new Voters(reader.readArray((reader) => $$CANT_READ("Voter")));
  }

  serialize(writer: CBORWriter): void {
    writer.writeArray(this.items, (writer, x) => $$CANT_WRITE("Voter"));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Voters {
    let reader = new CBORReader(data);
    return Voters.deserialize(reader);
  }

  static from_hex(hex_str: string): Voters {
    return Voters.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Voters {
    return Voters.from_bytes(this.to_bytes());
  }
}

export class VotingProcedure {
  private _vote: VoteKind;
  private _anchor: Anchor | undefined;

  constructor(vote: VoteKind, anchor: Anchor | undefined) {
    this._vote = vote;
    this._anchor = anchor;
  }

  static new(vote: VoteKind, anchor: Anchor | undefined) {
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

  static deserialize(reader: CBORReader): VotingProcedure {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let vote = deserializeVoteKind(reader);

    let anchor = reader.readNullable((r) => Anchor.deserialize(r)) ?? undefined;

    return new VotingProcedure(vote, anchor);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    serializeVoteKind(writer, this._vote);
    if (this._anchor == null) {
      writer.writeNull();
    } else {
      this._anchor.serialize(writer);
    }
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): VotingProcedure {
    let reader = new CBORReader(data);
    return VotingProcedure.deserialize(reader);
  }

  static from_hex(hex_str: string): VotingProcedure {
    return VotingProcedure.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): VotingProcedure {
    return VotingProcedure.from_bytes(this.to_bytes());
  }
}

export class VotingProcedures {
  private items: [unknown, GovernanceActions][];

  constructor(items: [unknown, GovernanceActions][]) {
    this.items = items;
  }

  static new(): VotingProcedures {
    return new VotingProcedures([]);
  }

  len(): number {
    return this.items.length;
  }

  insert(
    key: unknown,
    value: GovernanceActions,
  ): GovernanceActions | undefined {
    let entry = this.items.find((x) => $$CANT_EQ("Voter"));
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this.items.push([key, value]);
    return undefined;
  }

  get(key: unknown): GovernanceActions | undefined {
    let entry = this.items.find((x) => $$CANT_EQ("Voter"));
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: unknown[]): void {
    this.items = this.items.filter(([k, _v]) =>
      keys.every((key) => !$$CANT_EQ("Voter")),
    );
  }

  keys(): Voters {
    let keys = Voters.new();
    for (let [key, _] of this.items) keys.add(key);
    return keys;
  }

  static deserialize(reader: CBORReader): VotingProcedures {
    let ret = new VotingProcedures([]);
    reader.readMap((reader) =>
      ret.insert($$CANT_READ("Voter"), GovernanceActions.deserialize(reader)),
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this.items, (writer, x) => {
      $$CANT_WRITE("Voter");
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): VotingProcedures {
    let reader = new CBORReader(data);
    return VotingProcedures.deserialize(reader);
  }

  static from_hex(hex_str: string): VotingProcedures {
    return VotingProcedures.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): VotingProcedures {
    return VotingProcedures.from_bytes(this.to_bytes());
  }

  insert_voter_and_gov_action(
    voter: Voter,
    governance_action_id: GovernanceActionId,
    voting_procedure: VotingProcedure,
  ): void {
    let gov_actions = this.get(voter);
    if (gov_actions == null) {
      gov_actions = GovernanceActions.new();
      this.insert(voter, gov_actions);
    }
    gov_actions.insert(governance_action_id, voting_procedure);
  }

  get_by_voter_and_gov_action(
    voter: Voter,
    governance_action_id: GovernanceActionId,
  ): VotingProcedure | undefined {
    let gov_actions = this.get(voter);
    if (gov_actions == null) return undefined;
    return gov_actions.get(governance_action_id);
  }

  get_voters(): Voters {
    return this.keys();
  }

  get_governance_action_ids_by_voter(voter: Voter): GovernanceActionIds {
    let gov_actions = this.get(voter);
    if (gov_actions == null) return GovernanceActionIds.new();
    return gov_actions.keys();
  }
}

export class VotingProposal {
  private _deposit: BigNum;
  private _reward_account: unknown;
  private _governance_action: GovernanceAction;
  private _anchor: Anchor;

  constructor(
    deposit: BigNum,
    reward_account: unknown,
    governance_action: GovernanceAction,
    anchor: Anchor,
  ) {
    this._deposit = deposit;
    this._reward_account = reward_account;
    this._governance_action = governance_action;
    this._anchor = anchor;
  }

  static new(
    deposit: BigNum,
    reward_account: unknown,
    governance_action: GovernanceAction,
    anchor: Anchor,
  ) {
    return new VotingProposal(
      deposit,
      reward_account,
      governance_action,
      anchor,
    );
  }

  deposit(): BigNum {
    return this._deposit;
  }

  set_deposit(deposit: BigNum): void {
    this._deposit = deposit;
  }

  reward_account(): unknown {
    return this._reward_account;
  }

  set_reward_account(reward_account: unknown): void {
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

  static deserialize(reader: CBORReader): VotingProposal {
    let len = reader.readArrayTag();

    if (len != null && len < 4) {
      throw new Error(
        "Insufficient number of fields in record. Expected 4. Received " + len,
      );
    }

    let deposit = BigNum.deserialize(reader);

    let reward_account = $$CANT_READ("RewardAddress");

    let governance_action = GovernanceAction.deserialize(reader);

    let anchor = Anchor.deserialize(reader);

    return new VotingProposal(
      deposit,
      reward_account,
      governance_action,
      anchor,
    );
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(4);

    this._deposit.serialize(writer);
    $$CANT_WRITE("RewardAddress");
    this._governance_action.serialize(writer);
    this._anchor.serialize(writer);
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): VotingProposal {
    let reader = new CBORReader(data);
    return VotingProposal.deserialize(reader);
  }

  static from_hex(hex_str: string): VotingProposal {
    return VotingProposal.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): VotingProposal {
    return VotingProposal.from_bytes(this.to_bytes());
  }
}

export class VotingProposals {
  private items: VotingProposal[];

  constructor() {
    this.items = [];
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

  static deserialize(reader: CBORReader): VotingProposals {
    let ret = new VotingProposals();
    if (reader.peekType() == "tagged") {
      let tag = reader.readTaggedTag();
      if (tag != 258) throw new Error("Expected tag 258. Got " + tag);
    }
    reader.readArray((reader) => ret.add(VotingProposal.deserialize(reader)));
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeTaggedTag(258);
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): VotingProposals {
    let reader = new CBORReader(data);
    return VotingProposals.deserialize(reader);
  }

  static from_hex(hex_str: string): VotingProposals {
    return VotingProposals.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): VotingProposals {
    return VotingProposals.from_bytes(this.to_bytes());
  }
}

export class Withdrawals {
  private items: [unknown, BigNum][];

  constructor(items: [unknown, BigNum][]) {
    this.items = items;
  }

  static new(): Withdrawals {
    return new Withdrawals([]);
  }

  len(): number {
    return this.items.length;
  }

  insert(key: unknown, value: BigNum): BigNum | undefined {
    let entry = this.items.find((x) => $$CANT_EQ("RewardAddress"));
    if (entry != null) {
      let ret = entry[1];
      entry[1] = value;
      return ret;
    }
    this.items.push([key, value]);
    return undefined;
  }

  get(key: unknown): BigNum | undefined {
    let entry = this.items.find((x) => $$CANT_EQ("RewardAddress"));
    if (entry == null) return undefined;
    return entry[1];
  }

  _remove_many(keys: unknown[]): void {
    this.items = this.items.filter(([k, _v]) =>
      keys.every((key) => !$$CANT_EQ("RewardAddress")),
    );
  }

  static deserialize(reader: CBORReader): Withdrawals {
    let ret = new Withdrawals([]);
    reader.readMap((reader) =>
      ret.insert($$CANT_READ("RewardAddress"), BigNum.deserialize(reader)),
    );
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeMap(this.items, (writer, x) => {
      $$CANT_WRITE("RewardAddress");
      x[1].serialize(writer);
    });
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Withdrawals {
    let reader = new CBORReader(data);
    return Withdrawals.deserialize(reader);
  }

  static from_hex(hex_str: string): Withdrawals {
    return Withdrawals.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): Withdrawals {
    return Withdrawals.from_bytes(this.to_bytes());
  }
}

export class certificates {
  private items: Certificate[];

  constructor() {
    this.items = [];
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

  static deserialize(reader: CBORReader): certificates {
    let ret = new certificates();
    if (reader.peekType() == "tagged") {
      let tag = reader.readTaggedTag();
      if (tag != 258) throw new Error("Expected tag 258. Got " + tag);
    }
    reader.readArray((reader) => ret.add(Certificate.deserialize(reader)));
    return ret;
  }

  serialize(writer: CBORWriter): void {
    writer.writeTaggedTag(258);
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): certificates {
    let reader = new CBORReader(data);
    return certificates.deserialize(reader);
  }

  static from_hex(hex_str: string): certificates {
    return certificates.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  clone(): certificates {
    return certificates.from_bytes(this.to_bytes());
  }
}
