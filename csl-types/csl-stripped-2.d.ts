export function encrypt_with_password(password: string, salt: string, nonce: string, data: string): string;
export function decrypt_with_password(password: string, data: string): string;
export function make_daedalus_bootstrap_witness(tx_body_hash: TransactionHash, addr: ByronAddress, key: LegacyDaedalusPrivateKey): BootstrapWitness;
export function make_icarus_bootstrap_witness(tx_body_hash: TransactionHash, addr: ByronAddress, key: Bip32PrivateKey): BootstrapWitness;
export function make_vkey_witness(tx_body_hash: TransactionHash, sk: PrivateKey): Vkeywitness;
export function hash_auxiliary_data(auxiliary_data: AuxiliaryData): AuxiliaryDataHash;
export function hash_transaction(tx_body: TransactionBody): TransactionHash;
export function hash_plutus_data(plutus_data: PlutusData): DataHash;
export function hash_script_data(redeemers: Redeemers, cost_models: Costmdls, datums?: PlutusList): ScriptDataHash;
export function min_ada_for_output(output: TransactionOutput, data_cost: DataCost): BigNum;
export function min_ada_required(assets: Value, has_data_hash: boolean, coins_per_utxo_word: BigNum): BigNum;
export function encode_json_str_to_native_script(json: string, self_xpub: string, schema: number): NativeScript;
export function encode_arbitrary_bytes_as_metadatum(bytes: Uint8Array): TransactionMetadatum;
export function decode_arbitrary_bytes_from_metadatum(metadata: TransactionMetadatum): Uint8Array;
export function encode_json_str_to_metadatum(json: string, schema: number): TransactionMetadatum;
export function decode_metadatum_to_json_str(metadatum: TransactionMetadatum, schema: number): string;
export function encode_json_str_to_plutus_datum(json: string, schema: number): PlutusData;
export function decode_plutus_datum_to_json_str(datum: PlutusData, schema: number): string;
export function min_fee(tx: Transaction, linear_fee: LinearFee): BigNum;
export function calculate_ex_units_ceil_cost(ex_units: ExUnits, ex_unit_prices: ExUnitPrices): BigNum;
export function min_script_fee(tx: Transaction, ex_unit_prices: ExUnitPrices): BigNum;
export function create_send_all(address: Address, utxos: TransactionUnspentOutputs, config: TransactionBuilderConfig): TransactionBatchList;
export enum CertificateKind {
  StakeRegistration = 0,
  StakeDeregistration = 1,
  StakeDelegation = 2,
  PoolRegistration = 3,
  PoolRetirement = 4,
  GenesisKeyDelegation = 5,
  MoveInstantaneousRewardsCert = 6,
}
export enum MIRPot {
  Reserves = 0,
  Treasury = 1,
}
export enum MIRKind {
  ToOtherPot = 0,
  ToStakeCredentials = 1,
}
export enum RelayKind {
  SingleHostAddr = 0,
  SingleHostName = 1,
  MultiHostName = 2,
}
export enum NativeScriptKind {
  ScriptPubkey = 0,
  ScriptAll = 1,
  ScriptAny = 2,
  ScriptNOfK = 3,
  TimelockStart = 4,
  TimelockExpiry = 5,
}
export enum ScriptHashNamespace {
  NativeScript = 0,
  PlutusScript = 1,
  PlutusScriptV2 = 2,
}
export enum NetworkIdKind {
  Testnet = 0,
  Mainnet = 1,
}
export enum ScriptSchema {
  Wallet = 0,
  Node = 1,
}
export enum TransactionMetadatumKind {
  MetadataMap = 0,
  MetadataList = 1,
  Int = 2,
  Bytes = 3,
  Text = 4,
}
export enum MetadataJsonSchema {
  NoConversions = 0,
  BasicConversions = 1,
  DetailedSchema = 2,
}
export enum LanguageKind {
  PlutusV1 = 0,
  PlutusV2 = 1,
}
export enum PlutusDataKind {
  ConstrPlutusData = 0,
  Map = 1,
  List = 2,
  Integer = 3,
  Bytes = 4,
}
export enum RedeemerTagKind {
  Spend = 0,
  Mint = 1,
  Cert = 2,
  Reward = 3,
}
export enum PlutusDatumSchema {
  BasicConversions = 0,
  DetailedSchema = 1,
}
export enum CoinSelectionStrategyCIP2 {
  LargestFirst = 0,
  RandomImprove = 1,
  LargestFirstMultiAsset = 2,
  RandomImproveMultiAsset = 3,
}
export enum CborContainerType {
  Array = 0,
  Map = 1,
}
export enum StakeCredKind {
  Key = 0,
  Script = 1,
}
export class Address {
  to_bech32(prefix?: string): string;
  static from_bech32(bech_str: string): Address;
  network_id(): number;
}
export class AssetName {
  static new(name: Uint8Array): AssetName;
  name(): Uint8Array;
}
export class AssetNames {
  static new(): AssetNames;
  len(): number;
  get(index: number): AssetName;
  add(elem: AssetName): void;
}
export class Assets {
  static new(): Assets;
  len(): number;
  insert(key: AssetName, value: BigNum): BigNum | undefined;
  get(key: AssetName): BigNum | undefined;
  keys(): AssetNames;
}
export class AuxiliaryData {
  static new(): AuxiliaryData;
  metadata(): GeneralTransactionMetadata | undefined;
  native_scripts(): NativeScripts | undefined;
  plutus_scripts(): PlutusScripts | undefined;
  prefer_alonzo_format(): boolean;
}
export class AuxiliaryDataHash {
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): AuxiliaryDataHash;
}
export class AuxiliaryDataSet {
  static new(): AuxiliaryDataSet;
  len(): number;
  insert(tx_index: number, data: AuxiliaryData): AuxiliaryData | undefined;
  get(tx_index: number): AuxiliaryData | undefined;
  indices(): Uint32Array;
}
export class BaseAddress {
  static new(network: number, payment: StakeCredential, stake: StakeCredential): BaseAddress;
  payment_cred(): StakeCredential;
  stake_cred(): StakeCredential;
  to_address(): Address;
  static from_address(addr: Address): BaseAddress | undefined;
}
export class BigInt {
  is_zero(): boolean;
  as_u64(): BigNum | undefined;
  as_int(): Int | undefined;
  static from_str(text: string): BigInt;
  to_str(): string;
  add(other: BigInt): BigInt;
  mul(other: BigInt): BigInt;
  static one(): BigInt;
  increment(): BigInt;
  div_ceil(other: BigInt): BigInt;
}
export class BigNum {
  static from_str(string: string): BigNum;
  to_str(): string;
  static zero(): BigNum;
  static one(): BigNum;
  is_zero(): boolean;
  div_floor(other: BigNum): BigNum;
  checked_mul(other: BigNum): BigNum;
  checked_add(other: BigNum): BigNum;
  checked_sub(other: BigNum): BigNum;
  clamped_sub(other: BigNum): BigNum;
  compare(rhs_value: BigNum): number;
  less_than(rhs_value: BigNum): boolean;
  static max_value(): BigNum;
  static max(a: BigNum, b: BigNum): BigNum;
}
export class Bip32PrivateKey {
  derive(index: number): Bip32PrivateKey;
  static from_128_xprv(bytes: Uint8Array): Bip32PrivateKey;
  to_128_xprv(): Uint8Array;
  static generate_ed25519_bip32(): Bip32PrivateKey;
  to_raw_key(): PrivateKey;
  to_public(): Bip32PublicKey;
  as_bytes(): Uint8Array;
  static from_bech32(bech32_str: string): Bip32PrivateKey;
  to_bech32(): string;
  static from_bip39_entropy(entropy: Uint8Array, password: Uint8Array): Bip32PrivateKey;
  chaincode(): Uint8Array;
}
export class Bip32PublicKey {
  derive(index: number): Bip32PublicKey;
  to_raw_key(): PublicKey;
  as_bytes(): Uint8Array;
  static from_bech32(bech32_str: string): Bip32PublicKey;
  to_bech32(): string;
  chaincode(): Uint8Array;
}
export class Block {
  header(): Header;
  transaction_bodies(): TransactionBodies;
  transaction_witness_sets(): TransactionWitnessSets;
  auxiliary_data_set(): AuxiliaryDataSet;
  invalid_transactions(): Uint32Array;
  static new(header: Header, transaction_bodies: TransactionBodies, transaction_witness_sets: TransactionWitnessSets, auxiliary_data_set: AuxiliaryDataSet, invalid_transactions: Uint32Array): Block;
}
export class BlockHash {
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): BlockHash;
}
export class BootstrapWitness {
  vkey(): Vkey;
  signature(): Ed25519Signature;
  chain_code(): Uint8Array;
  attributes(): Uint8Array;
  static new(vkey: Vkey, signature: Ed25519Signature, chain_code: Uint8Array, attributes: Uint8Array): BootstrapWitness;
}
export class BootstrapWitnesses {
  static new(): BootstrapWitnesses;
  len(): number;
  get(index: number): BootstrapWitness;
  add(elem: BootstrapWitness): void;
}
export class ByronAddress {
  to_base58(): string;
  byron_protocol_magic(): number;
  attributes(): Uint8Array;
  network_id(): number;
  static from_base58(s: string): ByronAddress;
  static icarus_from_key(key: Bip32PublicKey, protocol_magic: number): ByronAddress;
  static is_valid(s: string): boolean;
  to_address(): Address;
  static from_address(addr: Address): ByronAddress | undefined;
}
export class Certificate {
  static new_stake_registration(stake_registration: StakeRegistration): Certificate;
  static new_stake_deregistration(stake_deregistration: StakeDeregistration): Certificate;
  static new_stake_delegation(stake_delegation: StakeDelegation): Certificate;
  static new_pool_registration(pool_registration: PoolRegistration): Certificate;
  static new_pool_retirement(pool_retirement: PoolRetirement): Certificate;
  static new_genesis_key_delegation(genesis_key_delegation: GenesisKeyDelegation): Certificate;
  static new_move_instantaneous_rewards_cert(move_instantaneous_rewards_cert: MoveInstantaneousRewardsCert): Certificate;
  kind(): number;
  as_stake_registration(): StakeRegistration | undefined;
  as_stake_deregistration(): StakeDeregistration | undefined;
  as_stake_delegation(): StakeDelegation | undefined;
  as_pool_registration(): PoolRegistration | undefined;
  as_pool_retirement(): PoolRetirement | undefined;
  as_genesis_key_delegation(): GenesisKeyDelegation | undefined;
  as_move_instantaneous_rewards_cert(): MoveInstantaneousRewardsCert | undefined;
}
export class Certificates {
  static new(): Certificates;
  len(): number;
  get(index: number): Certificate;
  add(elem: Certificate): void;
}
export class ConstrPlutusData {
  alternative(): BigNum;
  data(): PlutusList;
  static new(alternative: BigNum, data: PlutusList): ConstrPlutusData;
}
export class CostModel {
  static new(): CostModel;
  set(operation: number, cost: Int): Int;
  get(operation: number): Int;
  len(): number;
}
export class Costmdls {
  static new(): Costmdls;
  len(): number;
  insert(key: Language, value: CostModel): CostModel | undefined;
  get(key: Language): CostModel | undefined;
  keys(): Languages;
  retain_language_versions(languages: Languages): Costmdls;
}
export class DNSRecordAorAAAA {
  static new(dns_name: string): DNSRecordAorAAAA;
  record(): string;
}
export class DNSRecordSRV {
  static new(dns_name: string): DNSRecordSRV;
  record(): string;
}
export class DataCost {
  static new_coins_per_word(coins_per_word: BigNum): DataCost;
  static new_coins_per_byte(coins_per_byte: BigNum): DataCost;
  coins_per_byte(): BigNum;
}
export class DataHash {
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): DataHash;
}
export class DatumSource {
  static new(datum: PlutusData): DatumSource;
  static new_ref_input(input: TransactionInput): DatumSource;
}
export class Ed25519KeyHash {
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): Ed25519KeyHash;
}
export class Ed25519KeyHashes {
  static new(): Ed25519KeyHashes;
  len(): number;
  get(index: number): Ed25519KeyHash;
  add(elem: Ed25519KeyHash): void;
  to_option(): Ed25519KeyHashes | undefined;
}
export class Ed25519Signature {
  to_bech32(): string;
  static from_bech32(bech32_str: string): Ed25519Signature;
}
export class EnterpriseAddress {
  static new(network: number, payment: StakeCredential): EnterpriseAddress;
  payment_cred(): StakeCredential;
  to_address(): Address;
  static from_address(addr: Address): EnterpriseAddress | undefined;
}
export class ExUnitPrices {
  mem_price(): UnitInterval;
  step_price(): UnitInterval;
  static new(mem_price: UnitInterval, step_price: UnitInterval): ExUnitPrices;
}
export class ExUnits {
  mem(): BigNum;
  steps(): BigNum;
  static new(mem: BigNum, steps: BigNum): ExUnits;
}
export class FixedTransaction {
  static new(raw_body: Uint8Array, raw_witness_set: Uint8Array, is_valid: boolean): FixedTransaction;
  static new_with_auxiliary(raw_body: Uint8Array, raw_witness_set: Uint8Array, raw_auxiliary_data: Uint8Array, is_valid: boolean): FixedTransaction;
  body(): TransactionBody;
  raw_body(): Uint8Array;
  witness_set(): TransactionWitnessSet;
  raw_witness_set(): Uint8Array;
  is_valid(): boolean;
  auxiliary_data(): AuxiliaryData | undefined;
  raw_auxiliary_data(): Uint8Array | undefined;
}
export class GeneralTransactionMetadata {
  static new(): GeneralTransactionMetadata;
  len(): number;
  insert(key: BigNum, value: TransactionMetadatum): TransactionMetadatum | undefined;
  get(key: BigNum): TransactionMetadatum | undefined;
  keys(): TransactionMetadatumLabels;
}
export class GenesisDelegateHash {
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): GenesisDelegateHash;
}
export class GenesisHash {
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): GenesisHash;
}
export class GenesisHashes {
  static new(): GenesisHashes;
  len(): number;
  get(index: number): GenesisHash;
  add(elem: GenesisHash): void;
}
export class GenesisKeyDelegation {
  genesishash(): GenesisHash;
  genesis_delegate_hash(): GenesisDelegateHash;
  vrf_keyhash(): VRFKeyHash;
  static new(genesishash: GenesisHash, genesis_delegate_hash: GenesisDelegateHash, vrf_keyhash: VRFKeyHash): GenesisKeyDelegation;
}
export class Header {
  header_body(): HeaderBody;
  body_signature(): KESSignature;
  static new(header_body: HeaderBody, body_signature: KESSignature): Header;
}
export class HeaderBody {
  block_number(): number;
  slot(): number;
  slot_bignum(): BigNum;
  prev_hash(): BlockHash | undefined;
  issuer_vkey(): Vkey;
  vrf_vkey(): VRFVKey;
  has_nonce_and_leader_vrf(): boolean;
  nonce_vrf_or_nothing(): VRFCert | undefined;
  leader_vrf_or_nothing(): VRFCert | undefined;
  has_vrf_result(): boolean;
  vrf_result_or_nothing(): VRFCert | undefined;
  block_body_size(): number;
  block_body_hash(): BlockHash;
  operational_cert(): OperationalCert;
  protocol_version(): ProtocolVersion;
  static new(block_number: number, slot: number, prev_hash: BlockHash | undefined, issuer_vkey: Vkey, vrf_vkey: VRFVKey, vrf_result: VRFCert, block_body_size: number, block_body_hash: BlockHash, operational_cert: OperationalCert, protocol_version: ProtocolVersion): HeaderBody;
  static new_headerbody(block_number: number, slot: BigNum, prev_hash: BlockHash | undefined, issuer_vkey: Vkey, vrf_vkey: VRFVKey, vrf_result: VRFCert, block_body_size: number, block_body_hash: BlockHash, operational_cert: OperationalCert, protocol_version: ProtocolVersion): HeaderBody;
}
export class InputWithScriptWitness {
  static new_with_native_script_witness(input: TransactionInput, witness: NativeScript): InputWithScriptWitness;
  static new_with_plutus_witness(input: TransactionInput, witness: PlutusWitness): InputWithScriptWitness;
  input(): TransactionInput;
}
export class InputsWithScriptWitness {
  static new(): InputsWithScriptWitness;
  add(input: InputWithScriptWitness): void;
  get(index: number): InputWithScriptWitness;
  len(): number;
}
export class Int {
  static new(x: BigNum): Int;
  static new_negative(x: BigNum): Int;
  static new_i32(x: number): Int;
  is_positive(): boolean;
  as_positive(): BigNum | undefined;
  as_negative(): BigNum | undefined;
  as_i32(): number | undefined;
  as_i32_or_nothing(): number | undefined;
  as_i32_or_fail(): number;
  to_str(): string;
  static from_str(string: string): Int;
}
export class Ipv4 {
  static new(data: Uint8Array): Ipv4;
  ip(): Uint8Array;
}
export class Ipv6 {
  static new(data: Uint8Array): Ipv6;
  ip(): Uint8Array;
}
export class KESSignature {
}
export class KESVKey {
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): KESVKey;
}
export class Language {
  static new_plutus_v1(): Language;
  static new_plutus_v2(): Language;
  kind(): number;
}
export class Languages {
  static new(): Languages;
  len(): number;
  get(index: number): Language;
  add(elem: Language): void;
  static list(): Languages;
}
export class LegacyDaedalusPrivateKey {
  as_bytes(): Uint8Array;
  chaincode(): Uint8Array;
}
export class LinearFee {
  constant(): BigNum;
  coefficient(): BigNum;
  static new(coefficient: BigNum, constant: BigNum): LinearFee;
}
export class MIRToStakeCredentials {
  static new(): MIRToStakeCredentials;
  len(): number;
  insert(cred: StakeCredential, delta: Int): Int | undefined;
  get(cred: StakeCredential): Int | undefined;
  keys(): StakeCredentials;
}
export class MetadataList {
  static new(): MetadataList;
  len(): number;
  get(index: number): TransactionMetadatum;
  add(elem: TransactionMetadatum): void;
}
export class MetadataMap {
  static new(): MetadataMap;
  len(): number;
  insert(key: TransactionMetadatum, value: TransactionMetadatum): TransactionMetadatum | undefined;
  insert_str(key: string, value: TransactionMetadatum): TransactionMetadatum | undefined;
  insert_i32(key: number, value: TransactionMetadatum): TransactionMetadatum | undefined;
  get(key: TransactionMetadatum): TransactionMetadatum;
  has(key: TransactionMetadatum): boolean;
  keys(): MetadataList;
}
export class Mint {
  static new(): Mint;
  static new_from_entry(key: ScriptHash, value: MintAssets): Mint;
  len(): number;
  insert(key: ScriptHash, value: MintAssets): MintAssets | undefined;
  get(key: ScriptHash): MintAssets | undefined;
  keys(): ScriptHashes;
  as_positive_multiasset(): MultiAsset;
  as_negative_multiasset(): MultiAsset;
}
export class MintAssets {
  static new(): MintAssets;
  static new_from_entry(key: AssetName, value: Int): MintAssets;
  len(): number;
  insert(key: AssetName, value: Int): Int | undefined;
  get(key: AssetName): Int | undefined;
  keys(): AssetNames;
}
export class MintBuilder {
  static new(): MintBuilder;
  build(): Mint;
  has_plutus_scripts(): boolean;
  has_native_scripts(): boolean;
}
export class MintWitness {
  static new_native_script(native_script: NativeScript): MintWitness;
  static new_plutus_script(plutus_script: PlutusScriptSource, redeemer: Redeemer): MintWitness;
}
export class MintsAssets {
}
export class MoveInstantaneousReward {
  static new_to_other_pot(pot: number, amount: BigNum): MoveInstantaneousReward;
  static new_to_stake_creds(pot: number, amounts: MIRToStakeCredentials): MoveInstantaneousReward;
  pot(): number;
  kind(): number;
  as_to_other_pot(): BigNum | undefined;
  as_to_stake_creds(): MIRToStakeCredentials | undefined;
}
export class MoveInstantaneousRewardsCert {
  move_instantaneous_reward(): MoveInstantaneousReward;
  static new(move_instantaneous_reward: MoveInstantaneousReward): MoveInstantaneousRewardsCert;
}
export class MultiAsset {
  static new(): MultiAsset;
  len(): number;
  insert(policy_id: ScriptHash, assets: Assets): Assets | undefined;
  get(policy_id: ScriptHash): Assets | undefined;
  keys(): ScriptHashes;
  sub(rhs_ma: MultiAsset): MultiAsset;
}
export class MultiHostName {
  dns_name(): DNSRecordSRV;
  static new(dns_name: DNSRecordSRV): MultiHostName;
}
export class NativeScript {
  hash(): ScriptHash;
  static new_script_pubkey(script_pubkey: ScriptPubkey): NativeScript;
  static new_script_all(script_all: ScriptAll): NativeScript;
  static new_script_any(script_any: ScriptAny): NativeScript;
  static new_script_n_of_k(script_n_of_k: ScriptNOfK): NativeScript;
  static new_timelock_start(timelock_start: TimelockStart): NativeScript;
  static new_timelock_expiry(timelock_expiry: TimelockExpiry): NativeScript;
  kind(): number;
  as_script_pubkey(): ScriptPubkey | undefined;
  as_script_all(): ScriptAll | undefined;
  as_script_any(): ScriptAny | undefined;
  as_script_n_of_k(): ScriptNOfK | undefined;
  as_timelock_start(): TimelockStart | undefined;
  as_timelock_expiry(): TimelockExpiry | undefined;
}
export class NativeScripts {
  static new(): NativeScripts;
  len(): number;
  get(index: number): NativeScript;
  add(elem: NativeScript): void;
}
export class NetworkId {
  static testnet(): NetworkId;
  static mainnet(): NetworkId;
  kind(): number;
}
export class NetworkInfo {
  static new(network_id: number, protocol_magic: number): NetworkInfo;
  network_id(): number;
  protocol_magic(): number;
  static testnet_preview(): NetworkInfo;
  static testnet_preprod(): NetworkInfo;
  static testnet(): NetworkInfo;
  static mainnet(): NetworkInfo;
}
export class Nonce {
  static new_identity(): Nonce;
  static new_from_hash(hash: Uint8Array): Nonce;
}
export class OperationalCert {
  hot_vkey(): KESVKey;
  sequence_number(): number;
  kes_period(): number;
  sigma(): Ed25519Signature;
  static new(hot_vkey: KESVKey, sequence_number: number, kes_period: number, sigma: Ed25519Signature): OperationalCert;
}
export class OutputDatum {
  static new_data_hash(data_hash: DataHash): OutputDatum;
  static new_data(data: PlutusData): OutputDatum;
  data_hash(): DataHash | undefined;
  data(): PlutusData | undefined;
}
export class PlutusData {
  static new_constr_plutus_data(constr_plutus_data: ConstrPlutusData): PlutusData;
  static new_empty_constr_plutus_data(alternative: BigNum): PlutusData;
  static new_single_value_constr_plutus_data(alternative: BigNum, plutus_data: PlutusData): PlutusData;
  static new_map(map: PlutusMap): PlutusData;
  static new_list(list: PlutusList): PlutusData;
  static new_integer(integer: BigInt): PlutusData;
  static new_bytes(bytes: Uint8Array): PlutusData;
  kind(): number;
  as_constr_plutus_data(): ConstrPlutusData | undefined;
  as_map(): PlutusMap | undefined;
  as_list(): PlutusList | undefined;
  as_integer(): BigInt | undefined;
  as_bytes(): Uint8Array | undefined;
  static from_address(address: Address): PlutusData;
}
export class PlutusList {
  static new(): PlutusList;
  len(): number;
  get(index: number): PlutusData;
  add(elem: PlutusData): void;
}
export class PlutusMap {
  static new(): PlutusMap;
  len(): number;
  insert(key: PlutusData, value: PlutusData): PlutusData | undefined;
  get(key: PlutusData): PlutusData | undefined;
  keys(): PlutusList;
}
export class PlutusScript {
  static new(bytes: Uint8Array): PlutusScript;
  static new_v2(bytes: Uint8Array): PlutusScript;
  static new_with_version(bytes: Uint8Array, language: Language): PlutusScript;
  bytes(): Uint8Array;
  static from_bytes_v2(bytes: Uint8Array): PlutusScript;
  static from_bytes_with_version(bytes: Uint8Array, language: Language): PlutusScript;
  static from_hex_with_version(hex_str: string, language: Language): PlutusScript;
  hash(): ScriptHash;
  language_version(): Language;
}
export class PlutusScriptSource {
  static new(script: PlutusScript): PlutusScriptSource;
  static new_ref_input(script_hash: ScriptHash, input: TransactionInput): PlutusScriptSource;
  static new_ref_input_with_lang_ver(script_hash: ScriptHash, input: TransactionInput, lang_ver: Language): PlutusScriptSource;
}
export class PlutusScripts {
  static new(): PlutusScripts;
  len(): number;
  get(index: number): PlutusScript;
  add(elem: PlutusScript): void;
}
export class PlutusWitness {
  static new(script: PlutusScript, datum: PlutusData, redeemer: Redeemer): PlutusWitness;
  static new_with_ref(script: PlutusScriptSource, datum: DatumSource, redeemer: Redeemer): PlutusWitness;
  static new_without_datum(script: PlutusScript, redeemer: Redeemer): PlutusWitness;
  static new_with_ref_without_datum(script: PlutusScriptSource, redeemer: Redeemer): PlutusWitness;
  script(): PlutusScript | undefined;
  datum(): PlutusData | undefined;
  redeemer(): Redeemer;
}
export class PlutusWitnesses {
  static new(): PlutusWitnesses;
  len(): number;
  get(index: number): PlutusWitness;
  add(elem: PlutusWitness): void;
}
export class Pointer {
  static new(slot: number, tx_index: number, cert_index: number): Pointer;
  static new_pointer(slot: BigNum, tx_index: BigNum, cert_index: BigNum): Pointer;
  slot(): number;
  tx_index(): number;
  cert_index(): number;
  slot_bignum(): BigNum;
  tx_index_bignum(): BigNum;
  cert_index_bignum(): BigNum;
}
export class PointerAddress {
  static new(network: number, payment: StakeCredential, stake: Pointer): PointerAddress;
  payment_cred(): StakeCredential;
  stake_pointer(): Pointer;
  to_address(): Address;
  static from_address(addr: Address): PointerAddress | undefined;
}
export class PoolMetadata {
  url(): URL;
  pool_metadata_hash(): PoolMetadataHash;
  static new(url: URL, pool_metadata_hash: PoolMetadataHash): PoolMetadata;
}
export class PoolMetadataHash {
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): PoolMetadataHash;
}
export class PoolParams {
  operator(): Ed25519KeyHash;
  vrf_keyhash(): VRFKeyHash;
  pledge(): BigNum;
  cost(): BigNum;
  margin(): UnitInterval;
  reward_account(): RewardAddress;
  pool_owners(): Ed25519KeyHashes;
  relays(): Relays;
  pool_metadata(): PoolMetadata | undefined;
  static new(operator: Ed25519KeyHash, vrf_keyhash: VRFKeyHash, pledge: BigNum, cost: BigNum, margin: UnitInterval, reward_account: RewardAddress, pool_owners: Ed25519KeyHashes, relays: Relays, pool_metadata?: PoolMetadata): PoolParams;
}
export class PoolRegistration {
  pool_params(): PoolParams;
  static new(pool_params: PoolParams): PoolRegistration;
}
export class PoolRetirement {
  pool_keyhash(): Ed25519KeyHash;
  epoch(): number;
  static new(pool_keyhash: Ed25519KeyHash, epoch: number): PoolRetirement;
}
export class PrivateKey {
  to_public(): PublicKey;
  static generate_ed25519(): PrivateKey;
  static generate_ed25519extended(): PrivateKey;
  static from_bech32(bech32_str: string): PrivateKey;
  to_bech32(): string;
  as_bytes(): Uint8Array;
  static from_extended_bytes(bytes: Uint8Array): PrivateKey;
  static from_normal_bytes(bytes: Uint8Array): PrivateKey;
  sign(message: Uint8Array): Ed25519Signature;
}
export class ProposedProtocolParameterUpdates {
  static new(): ProposedProtocolParameterUpdates;
  len(): number;
  insert(key: GenesisHash, value: ProtocolParamUpdate): ProtocolParamUpdate | undefined;
  get(key: GenesisHash): ProtocolParamUpdate | undefined;
  keys(): GenesisHashes;
}
export class ProtocolParamUpdate {
  minfee_a(): BigNum | undefined;
  minfee_b(): BigNum | undefined;
  max_block_body_size(): number | undefined;
  max_tx_size(): number | undefined;
  max_block_header_size(): number | undefined;
  key_deposit(): BigNum | undefined;
  pool_deposit(): BigNum | undefined;
  max_epoch(): number | undefined;
  n_opt(): number | undefined;
  pool_pledge_influence(): UnitInterval | undefined;
  expansion_rate(): UnitInterval | undefined;
  treasury_growth_rate(): UnitInterval | undefined;
  d(): UnitInterval | undefined;
  extra_entropy(): Nonce | undefined;
  protocol_version(): ProtocolVersion | undefined;
  min_pool_cost(): BigNum | undefined;
  ada_per_utxo_byte(): BigNum | undefined;
  cost_models(): Costmdls | undefined;
  execution_costs(): ExUnitPrices | undefined;
  max_tx_ex_units(): ExUnits | undefined;
  max_block_ex_units(): ExUnits | undefined;
  max_value_size(): number | undefined;
  collateral_percentage(): number | undefined;
  max_collateral_inputs(): number | undefined;
  static new(): ProtocolParamUpdate;
}
export class ProtocolVersion {
  major(): number;
  minor(): number;
  static new(major: number, minor: number): ProtocolVersion;
}
export class PublicKey {
  static from_bech32(bech32_str: string): PublicKey;
  to_bech32(): string;
  as_bytes(): Uint8Array;
  verify(data: Uint8Array, signature: Ed25519Signature): boolean;
  hash(): Ed25519KeyHash;
}
export class PublicKeys {
  constructor();
  size(): number;
  get(index: number): PublicKey;
  add(key: PublicKey): void;
}
export class Redeemer {
  tag(): RedeemerTag;
  index(): BigNum;
  data(): PlutusData;
  ex_units(): ExUnits;
  static new(tag: RedeemerTag, index: BigNum, data: PlutusData, ex_units: ExUnits): Redeemer;
}
export class RedeemerTag {
  static new_spend(): RedeemerTag;
  static new_mint(): RedeemerTag;
  static new_cert(): RedeemerTag;
  static new_reward(): RedeemerTag;
  kind(): number;
}
export class Redeemers {
  static new(): Redeemers;
  len(): number;
  get(index: number): Redeemer;
  add(elem: Redeemer): void;
  total_ex_units(): ExUnits;
}
export class Relay {
  static new_single_host_addr(single_host_addr: SingleHostAddr): Relay;
  static new_single_host_name(single_host_name: SingleHostName): Relay;
  static new_multi_host_name(multi_host_name: MultiHostName): Relay;
  kind(): number;
  as_single_host_addr(): SingleHostAddr | undefined;
  as_single_host_name(): SingleHostName | undefined;
  as_multi_host_name(): MultiHostName | undefined;
}
export class Relays {
  static new(): Relays;
  len(): number;
  get(index: number): Relay;
  add(elem: Relay): void;
}
export class RewardAddress {
  static new(network: number, payment: StakeCredential): RewardAddress;
  payment_cred(): StakeCredential;
  to_address(): Address;
  static from_address(addr: Address): RewardAddress | undefined;
}
export class RewardAddresses {
  static new(): RewardAddresses;
  len(): number;
  get(index: number): RewardAddress;
  add(elem: RewardAddress): void;
}
export class ScriptAll {
  native_scripts(): NativeScripts;
  static new(native_scripts: NativeScripts): ScriptAll;
}
export class ScriptAny {
  native_scripts(): NativeScripts;
  static new(native_scripts: NativeScripts): ScriptAny;
}
export class ScriptDataHash {
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): ScriptDataHash;
}
export class ScriptHash {
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): ScriptHash;
}
export class ScriptHashes {
  static new(): ScriptHashes;
  len(): number;
  get(index: number): ScriptHash;
  add(elem: ScriptHash): void;
}
export class ScriptNOfK {
  n(): number;
  native_scripts(): NativeScripts;
  static new(n: number, native_scripts: NativeScripts): ScriptNOfK;
}
export class ScriptPubkey {
  addr_keyhash(): Ed25519KeyHash;
  static new(addr_keyhash: Ed25519KeyHash): ScriptPubkey;
}
export class ScriptRef {
  static new_native_script(native_script: NativeScript): ScriptRef;
  static new_plutus_script(plutus_script: PlutusScript): ScriptRef;
  is_native_script(): boolean;
  is_plutus_script(): boolean;
  native_script(): NativeScript | undefined;
  plutus_script(): PlutusScript | undefined;
}
export class SingleHostAddr {
  port(): number | undefined;
  ipv4(): Ipv4 | undefined;
  ipv6(): Ipv6 | undefined;
  static new(port?: number, ipv4?: Ipv4, ipv6?: Ipv6): SingleHostAddr;
}
export class SingleHostName {
  port(): number | undefined;
  dns_name(): DNSRecordAorAAAA;
  static new(port: number | undefined, dns_name: DNSRecordAorAAAA): SingleHostName;
}
export class StakeCredential {
  static from_keyhash(hash: Ed25519KeyHash): StakeCredential;
  static from_scripthash(hash: ScriptHash): StakeCredential;
  to_keyhash(): Ed25519KeyHash | undefined;
  to_scripthash(): ScriptHash | undefined;
  kind(): number;
}
export class StakeCredentials {
  static new(): StakeCredentials;
  len(): number;
  get(index: number): StakeCredential;
  add(elem: StakeCredential): void;
}
export class StakeDelegation {
  stake_credential(): StakeCredential;
  pool_keyhash(): Ed25519KeyHash;
  static new(stake_credential: StakeCredential, pool_keyhash: Ed25519KeyHash): StakeDelegation;
}
export class StakeDeregistration {
  stake_credential(): StakeCredential;
  static new(stake_credential: StakeCredential): StakeDeregistration;
}
export class StakeRegistration {
  stake_credential(): StakeCredential;
  static new(stake_credential: StakeCredential): StakeRegistration;
}
export class Strings {
  static new(): Strings;
  len(): number;
  get(index: number): string;
  add(elem: string): void;
}
export class TimelockExpiry {
  slot(): number;
  slot_bignum(): BigNum;
  static new(slot: number): TimelockExpiry;
  static new_timelockexpiry(slot: BigNum): TimelockExpiry;
}
export class TimelockStart {
  slot(): number;
  slot_bignum(): BigNum;
  static new(slot: number): TimelockStart;
  static new_timelockstart(slot: BigNum): TimelockStart;
}
export class Transaction {
  body(): TransactionBody;
  witness_set(): TransactionWitnessSet;
  is_valid(): boolean;
  auxiliary_data(): AuxiliaryData | undefined;
  static new(body: TransactionBody, witness_set: TransactionWitnessSet, auxiliary_data?: AuxiliaryData): Transaction;
}
export class TransactionBatch {
  len(): number;
  get(index: number): Transaction;
}
export class TransactionBatchList {
  len(): number;
  get(index: number): TransactionBatch;
}
export class TransactionBodies {
  static new(): TransactionBodies;
  len(): number;
  get(index: number): TransactionBody;
  add(elem: TransactionBody): void;
}
export class TransactionBody {
  inputs(): TransactionInputs;
  outputs(): TransactionOutputs;
  fee(): BigNum;
  ttl(): number | undefined;
  ttl_bignum(): BigNum | undefined;
  remove_ttl(): void;
  certs(): Certificates | undefined;
  withdrawals(): Withdrawals | undefined;
  update(): Update | undefined;
  auxiliary_data_hash(): AuxiliaryDataHash | undefined;
  validity_start_interval_bignum(): BigNum | undefined;
  validity_start_interval(): number | undefined;
  mint(): Mint | undefined;
  multiassets(): Mint | undefined;
  reference_inputs(): TransactionInputs | undefined;
  script_data_hash(): ScriptDataHash | undefined;
  collateral(): TransactionInputs | undefined;
  required_signers(): Ed25519KeyHashes | undefined;
  network_id(): NetworkId | undefined;
  collateral_return(): TransactionOutput | undefined;
  total_collateral(): BigNum | undefined;
  static new(inputs: TransactionInputs, outputs: TransactionOutputs, fee: BigNum, ttl?: number): TransactionBody;
  static new_tx_body(inputs: TransactionInputs, outputs: TransactionOutputs, fee: BigNum): TransactionBody;
}
export class TransactionBuilder {
  add_inputs_from(inputs: TransactionUnspentOutputs, strategy: number): void;
  add_reference_input(reference_input: TransactionInput): void;
  add_key_input(hash: Ed25519KeyHash, input: TransactionInput, amount: Value): void;
  add_script_input(hash: ScriptHash, input: TransactionInput, amount: Value): void;
  add_native_script_input(script: NativeScript, input: TransactionInput, amount: Value): void;
  add_plutus_script_input(witness: PlutusWitness, input: TransactionInput, amount: Value): void;
  add_bootstrap_input(hash: ByronAddress, input: TransactionInput, amount: Value): void;
  add_input(address: Address, input: TransactionInput, amount: Value): void;
  count_missing_input_scripts(): number;
  add_required_native_input_scripts(scripts: NativeScripts): number;
  add_required_plutus_input_scripts(scripts: PlutusWitnesses): number;
  fee_for_input(address: Address, input: TransactionInput, amount: Value): BigNum;
  add_output(output: TransactionOutput): void;
  fee_for_output(output: TransactionOutput): BigNum;
  add_metadatum(key: BigNum, val: TransactionMetadatum): void;
  add_json_metadatum(key: BigNum, val: string): void;
  add_json_metadatum_with_schema(key: BigNum, val: string, schema: number): void;
  static new(cfg: TransactionBuilderConfig): TransactionBuilder;
  add_change_if_needed(address: Address): boolean;
  add_change_if_needed_with_datum(address: Address, plutus_data: OutputDatum): boolean;
  calc_script_data_hash(cost_models: Costmdls): void;
  remove_script_data_hash(): void;
  add_required_signer(key: Ed25519KeyHash): void;
  full_size(): number;
  output_sizes(): Uint32Array;
  build(): TransactionBody;
  build_tx(): Transaction;
  build_tx_unsafe(): Transaction;
  min_fee(): BigNum;
}
export class TransactionBuilderConfig {
}
export class TransactionBuilderConfigBuilder {
  static new(): TransactionBuilderConfigBuilder;
  fee_algo(fee_algo: LinearFee): TransactionBuilderConfigBuilder;
  coins_per_utxo_word(coins_per_utxo_word: BigNum): TransactionBuilderConfigBuilder;
  coins_per_utxo_byte(coins_per_utxo_byte: BigNum): TransactionBuilderConfigBuilder;
  ex_unit_prices(ex_unit_prices: ExUnitPrices): TransactionBuilderConfigBuilder;
  pool_deposit(pool_deposit: BigNum): TransactionBuilderConfigBuilder;
  key_deposit(key_deposit: BigNum): TransactionBuilderConfigBuilder;
  max_value_size(max_value_size: number): TransactionBuilderConfigBuilder;
  max_tx_size(max_tx_size: number): TransactionBuilderConfigBuilder;
  prefer_pure_change(prefer_pure_change: boolean): TransactionBuilderConfigBuilder;
  build(): TransactionBuilderConfig;
}
export class TransactionHash {
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): TransactionHash;
}
export class TransactionInput {
  transaction_id(): TransactionHash;
  index(): number;
  static new(transaction_id: TransactionHash, index: number): TransactionInput;
}
export class TransactionInputs {
  static new(): TransactionInputs;
  len(): number;
  get(index: number): TransactionInput;
  add(elem: TransactionInput): void;
  to_option(): TransactionInputs | undefined;
}
export class TransactionMetadatum {
  static new_map(map: MetadataMap): TransactionMetadatum;
  static new_list(list: MetadataList): TransactionMetadatum;
  static new_int(int: Int): TransactionMetadatum;
  static new_bytes(bytes: Uint8Array): TransactionMetadatum;
  static new_text(text: string): TransactionMetadatum;
  kind(): number;
  as_map(): MetadataMap;
  as_list(): MetadataList;
  as_int(): Int;
  as_bytes(): Uint8Array;
  as_text(): string;
}
export class TransactionMetadatumLabels {
  static new(): TransactionMetadatumLabels;
  len(): number;
  get(index: number): BigNum;
  add(elem: BigNum): void;
}
export class TransactionOutput {
  address(): Address;
  amount(): Value;
  data_hash(): DataHash | undefined;
  plutus_data(): PlutusData | undefined;
  script_ref(): ScriptRef | undefined;
  has_plutus_data(): boolean;
  has_data_hash(): boolean;
  has_script_ref(): boolean;
  static new(address: Address, amount: Value): TransactionOutput;
  serialization_format(): number | undefined;
}
export class TransactionOutputAmountBuilder {
  with_value(amount: Value): TransactionOutputAmountBuilder;
  with_coin(coin: BigNum): TransactionOutputAmountBuilder;
  with_coin_and_asset(coin: BigNum, multiasset: MultiAsset): TransactionOutputAmountBuilder;
  build(): TransactionOutput;
}
export class TransactionOutputBuilder {
  static new(): TransactionOutputBuilder;
  with_address(address: Address): TransactionOutputBuilder;
  with_data_hash(data_hash: DataHash): TransactionOutputBuilder;
  with_plutus_data(data: PlutusData): TransactionOutputBuilder;
  with_script_ref(script_ref: ScriptRef): TransactionOutputBuilder;
  next(): TransactionOutputAmountBuilder;
}
export class TransactionOutputs {
  static new(): TransactionOutputs;
  len(): number;
  get(index: number): TransactionOutput;
  add(elem: TransactionOutput): void;
}
export class TransactionUnspentOutput {
  static new(input: TransactionInput, output: TransactionOutput): TransactionUnspentOutput;
  input(): TransactionInput;
  output(): TransactionOutput;
}
export class TransactionUnspentOutputs {
  static new(): TransactionUnspentOutputs;
  len(): number;
  get(index: number): TransactionUnspentOutput;
  add(elem: TransactionUnspentOutput): void;
}
export class TransactionWitnessSet {
  vkeys(): Vkeywitnesses | undefined;
  native_scripts(): NativeScripts | undefined;
  bootstraps(): BootstrapWitnesses | undefined;
  plutus_scripts(): PlutusScripts | undefined;
  plutus_data(): PlutusList | undefined;
  redeemers(): Redeemers | undefined;
  static new(): TransactionWitnessSet;
}
export class TransactionWitnessSets {
  static new(): TransactionWitnessSets;
  len(): number;
  get(index: number): TransactionWitnessSet;
  add(elem: TransactionWitnessSet): void;
}
export class TxBuilderConstants {
  static plutus_default_cost_models(): Costmdls;
  static plutus_alonzo_cost_models(): Costmdls;
  static plutus_vasil_cost_models(): Costmdls;
}
export class TxInputsBuilder {
  static new(): TxInputsBuilder;
  add_key_input(hash: Ed25519KeyHash, input: TransactionInput, amount: Value): void;
  add_script_input(hash: ScriptHash, input: TransactionInput, amount: Value): void;
  add_native_script_input(script: NativeScript, input: TransactionInput, amount: Value): void;
  add_plutus_script_input(witness: PlutusWitness, input: TransactionInput, amount: Value): void;
  add_bootstrap_input(hash: ByronAddress, input: TransactionInput, amount: Value): void;
  add_input(address: Address, input: TransactionInput, amount: Value): void;
  count_missing_input_scripts(): number;
  add_required_native_input_scripts(scripts: NativeScripts): number;
  add_required_plutus_input_scripts(scripts: PlutusWitnesses): number;
  add_required_script_input_witnesses(inputs_with_wit: InputsWithScriptWitness): number;
  len(): number;
  add_required_signer(key: Ed25519KeyHash): void;
  add_required_signers(keys: Ed25519KeyHashes): void;
  total_value(): Value;
  inputs(): TransactionInputs;
  inputs_option(): TransactionInputs | undefined;
}
export class URL {
  static new(url: string): URL;
  url(): string;
}
export class UnitInterval {
  numerator(): BigNum;
  denominator(): BigNum;
  static new(numerator: BigNum, denominator: BigNum): UnitInterval;
}
export class Update {
  proposed_protocol_parameter_updates(): ProposedProtocolParameterUpdates;
  epoch(): number;
  static new(proposed_protocol_parameter_updates: ProposedProtocolParameterUpdates, epoch: number): Update;
}
export class VRFCert {
  output(): Uint8Array;
  proof(): Uint8Array;
  static new(output: Uint8Array, proof: Uint8Array): VRFCert;
}
export class VRFKeyHash {
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): VRFKeyHash;
}
export class VRFVKey {
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): VRFVKey;
}
export class Value {
  static new(coin: BigNum): Value;
  static new_from_assets(multiasset: MultiAsset): Value;
  static new_with_assets(coin: BigNum, multiasset: MultiAsset): Value;
  static zero(): Value;
  is_zero(): boolean;
  coin(): BigNum;
  multiasset(): MultiAsset | undefined;
  checked_add(rhs: Value): Value;
  checked_sub(rhs_value: Value): Value;
  clamped_sub(rhs_value: Value): Value;
  compare(rhs_value: Value): number | undefined;
}
export class Vkey {
  static new(pk: PublicKey): Vkey;
  public_key(): PublicKey;
}
export class Vkeys {
  static new(): Vkeys;
  len(): number;
  get(index: number): Vkey;
  add(elem: Vkey): void;
}
export class Vkeywitness {
  static new(vkey: Vkey, signature: Ed25519Signature): Vkeywitness;
  vkey(): Vkey;
  signature(): Ed25519Signature;
}
export class Vkeywitnesses {
  static new(): Vkeywitnesses;
  len(): number;
  get(index: number): Vkeywitness;
  add(elem: Vkeywitness): void;
}
export class Withdrawals {
  static new(): Withdrawals;
  len(): number;
  insert(key: RewardAddress, value: BigNum): BigNum | undefined;
  get(key: RewardAddress): BigNum | undefined;
  keys(): RewardAddresses;
}

export type AddressJSON = string;
export type AssetNameJSON = string;
export type AssetNamesJSON = string[];
export interface AssetsJSON {
  [k: string]: string;
}
export interface AuxiliaryDataJSON {
  metadata?: {
    [k: string]: string;
  } | null;
  native_scripts?: NativeScriptsJSON | null;
  plutus_scripts?: PlutusScriptsJSON | null;
  prefer_alonzo_format: boolean;
}
export type AuxiliaryDataHashJSON = string;
export interface AuxiliaryDataSetJSON {
  [k: string]: AuxiliaryDataJSON;
}
export type BigIntJSON = string;
export type BigNumJSON = string;
export interface BlockJSON {
  auxiliary_data_set: {
    [k: string]: AuxiliaryDataJSON;
  };
  header: HeaderJSON;
  invalid_transactions: number[];
  transaction_bodies: TransactionBodiesJSON;
  transaction_witness_sets: TransactionWitnessSetsJSON;
}
export type BlockHashJSON = string;
export interface BootstrapWitnessJSON {
  attributes: number[];
  chain_code: number[];
  signature: string;
  vkey: VkeyJSON;
}
export type BootstrapWitnessesJSON = BootstrapWitnessJSON[];
export type CertificateJSON = CertificateEnumJSON;
export type CertificateEnumJSON =
  | {
      StakeRegistrationJSON: StakeRegistration;
    }
  | {
      StakeDeregistrationJSON: StakeDeregistration;
    }
  | {
      StakeDelegationJSON: StakeDelegation;
    }
  | {
      PoolRegistrationJSON: PoolRegistration;
    }
  | {
      PoolRetirementJSON: PoolRetirement;
    }
  | {
      GenesisKeyDelegationJSON: GenesisKeyDelegation;
    }
  | {
      MoveInstantaneousRewardsCertJSON: MoveInstantaneousRewardsCert;
    };
export type CertificatesJSON = CertificateJSON[];
export type CostModelJSON = string[];
export interface CostmdlsJSON {
  [k: string]: CostModelJSON;
}
export type DNSRecordAorAAAAJSON = string;
export type DNSRecordSRVJSON = string;
export type DataHashJSON = string;
export type DataOptionJSON =
  | {
      DataHashJSON: string;
    }
  | {
      Data: string;
    };
export type Ed25519KeyHashJSON = string;
export type Ed25519KeyHashesJSON = string[];
export type Ed25519SignatureJSON = string;
export interface ExUnitPricesJSON {
  mem_price: UnitIntervalJSON;
  step_price: UnitIntervalJSON;
}
export interface ExUnitsJSON {
  mem: string;
  steps: string;
}
export interface GeneralTransactionMetadataJSON {
  [k: string]: string;
}
export type GenesisDelegateHashJSON = string;
export type GenesisHashJSON = string;
export type GenesisHashesJSON = string[];
export interface GenesisKeyDelegationJSON {
  genesis_delegate_hash: string;
  genesishash: string;
  vrf_keyhash: string;
}
export interface HeaderJSON {
  body_signature: string;
  header_body: HeaderBodyJSON;
}
export interface HeaderBodyJSON {
  block_body_hash: string;
  block_body_size: number;
  block_number: number;
  issuer_vkey: VkeyJSON;
  leader_cert: HeaderLeaderCertEnumJSON;
  operational_cert: OperationalCertJSON;
  prev_hash?: string | null;
  protocol_version: ProtocolVersionJSON;
  slot: string;
  vrf_vkey: string;
}
export type HeaderLeaderCertEnumJSON =
  | {
      NonceAndLeader: [VRFCertJSON, VRFCert];
    }
  | {
      VrfResult: VRFCertJSON;
    };
export type IntJSON = string;
export type Ipv4JSON = [number, number, number, number];
export type Ipv6JSON = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];
export type KESVKeyJSON = string;
export type LanguageJSON = LanguageKindJSON;
export type LanguageKindJSON = "PlutusV1" | "PlutusV2";
export type LanguagesJSON = LanguageJSON[];
export type MIREnumJSON =
  | {
      ToOtherPot: string;
    }
  | {
      ToStakeCredentials: {
        [k: string]: ProtocolParamUpdateJSON;
      };
    };
export type MIRPotJSON = "Reserves" | "Treasury";
export interface MIRToStakeCredentialsJSON {
  [k: string]: ProtocolParamUpdateJSON;
}
export type MintJSON = [string, MintAssetsJSON][];
export interface MintAssetsJSON {
  [k: string]: string;
}
export interface MoveInstantaneousRewardJSON {
  pot: MIRPotJSON;
  variant: MIREnumJSON;
}
export interface MoveInstantaneousRewardsCertJSON {
  move_instantaneous_reward: MoveInstantaneousRewardJSON;
}
export interface MultiAssetJSON {
  [k: string]: AssetsJSON;
}
export interface MultiHostNameJSON {
  dns_name: DNSRecordSRVJSON;
}
export type NativeScriptJSON = NativeScript1JSON;
export type NativeScript1JSON =
  | {
      ScriptPubkeyJSON: ScriptPubkey;
    }
  | {
      ScriptAllJSON: ScriptAll;
    }
  | {
      ScriptAnyJSON: ScriptAny;
    }
  | {
      ScriptNOfKJSON: ScriptNOfK;
    }
  | {
      TimelockStartJSON: TimelockStart;
    }
  | {
      TimelockExpiryJSON: TimelockExpiry;
    };
export type NativeScriptsJSON = NativeScriptJSON[];
export type NetworkIdJSON = NetworkIdKindJSON;
export type NetworkIdKindJSON = "Testnet" | "Mainnet";
export interface NonceJSON {
  hash?:
    | [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number
      ]
    | null;
}
export interface OperationalCertJSON {
  hot_vkey: string;
  kes_period: number;
  sequence_number: number;
  sigma: string;
}
export type PlutusScriptJSON = string;
export type PlutusScriptsJSON = string[];
export interface PoolMetadataJSON {
  pool_metadata_hash: string;
  url: URLJSON;
}
export type PoolMetadataHashJSON = string;
export interface PoolParamsJSON {
  cost: string;
  margin: UnitIntervalJSON;
  operator: string;
  pledge: string;
  pool_metadata?: PoolMetadataJSON | null;
  pool_owners: Ed25519KeyHashesJSON;
  relays: RelaysJSON;
  reward_account: string;
  vrf_keyhash: string;
}
export interface PoolRegistrationJSON {
  pool_params: PoolParamsJSON;
}
export interface PoolRetirementJSON {
  epoch: number;
  pool_keyhash: string;
}
export interface ProposedProtocolParameterUpdatesJSON {
  [k: string]: ProtocolParamUpdateJSON;
}
export interface ProtocolParamUpdateJSON {
  ada_per_utxo_byte?: string | null;
  collateral_percentage?: number | null;
  cost_models?: CostmdlsJSON | null;
  d?: UnitIntervalJSON | null;
  execution_costs?: ExUnitPricesJSON | null;
  expansion_rate?: UnitIntervalJSON | null;
  extra_entropy?: NonceJSON | null;
  key_deposit?: string | null;
  max_block_body_size?: number | null;
  max_block_ex_units?: ExUnitsJSON | null;
  max_block_header_size?: number | null;
  max_collateral_inputs?: number | null;
  max_epoch?: number | null;
  max_tx_ex_units?: ExUnitsJSON | null;
  max_tx_size?: number | null;
  max_value_size?: number | null;
  min_pool_cost?: string | null;
  minfee_a?: string | null;
  minfee_b?: string | null;
  n_opt?: number | null;
  pool_deposit?: string | null;
  pool_pledge_influence?: UnitIntervalJSON | null;
  protocol_version?: ProtocolVersionJSON | null;
  treasury_growth_rate?: UnitIntervalJSON | null;
}
export interface ProtocolVersionJSON {
  major: number;
  minor: number;
}
export type PublicKeyJSON = string;
export interface RedeemerJSON {
  data: string;
  ex_units: ExUnitsJSON;
  index: string;
  tag: RedeemerTagJSON;
}
export type RedeemerTagJSON = RedeemerTagKindJSON;
export type RedeemerTagKindJSON = "Spend" | "MintJSON" | "Cert" | "Reward";
export type RedeemersJSON = RedeemerJSON[];
export type RelayJSON = RelayEnumJSON;
export type RelayEnumJSON =
  | {
      SingleHostAddrJSON: SingleHostAddr;
    }
  | {
      SingleHostNameJSON: SingleHostName;
    }
  | {
      MultiHostNameJSON: MultiHostName;
    };
export type RelaysJSON = RelayJSON[];
export type RewardAddressJSON = string;
export type RewardAddressesJSON = string[];
export interface ScriptAllJSON {
  native_scripts: NativeScriptsJSON;
}
export interface ScriptAnyJSON {
  native_scripts: NativeScriptsJSON;
}
export type ScriptDataHashJSON = string;
export type ScriptHashJSON = string;
export type ScriptHashesJSON = string[];
export interface ScriptNOfKJSON {
  n: number;
  native_scripts: NativeScriptsJSON;
}
export interface ScriptPubkeyJSON {
  addr_keyhash: string;
}
export type ScriptRefJSON = ScriptRefEnumJSON;
export type ScriptRefEnumJSON =
  | {
      NativeScriptJSON: NativeScript;
    }
  | {
      PlutusScriptJSON: string;
    };
export interface SingleHostAddrJSON {
  ipv4?: Ipv4JSON | null;
  ipv6?: Ipv6JSON | null;
  port?: number | null;
}
export interface SingleHostNameJSON {
  dns_name: DNSRecordAorAAAAJSON;
  port?: number | null;
}
export type StakeCredTypeJSON =
  | {
      Key: string;
    }
  | {
      Script: string;
    };
export type StakeCredentialJSON = StakeCredTypeJSON;
export type StakeCredentialsJSON = StakeCredTypeJSON[];
export interface StakeDelegationJSON {
  pool_keyhash: string;
  stake_credential: StakeCredTypeJSON;
}
export interface StakeDeregistrationJSON {
  stake_credential: StakeCredTypeJSON;
}
export interface StakeRegistrationJSON {
  stake_credential: StakeCredTypeJSON;
}
export interface TimelockExpiryJSON {
  slot: string;
}
export interface TimelockStartJSON {
  slot: string;
}
export interface TransactionJSON {
  auxiliary_data?: AuxiliaryDataJSON | null;
  body: TransactionBodyJSON;
  is_valid: boolean;
  witness_set: TransactionWitnessSetJSON;
}
export type TransactionBodiesJSON = TransactionBodyJSON[];
export interface TransactionBodyJSON {
  auxiliary_data_hash?: string | null;
  certs?: CertificatesJSON | null;
  collateral?: TransactionInputsJSON | null;
  collateral_return?: TransactionOutputJSON | null;
  fee: string;
  inputs: TransactionInputsJSON;
  mint?: MintJSON | null;
  network_id?: NetworkIdJSON | null;
  outputs: TransactionOutputsJSON;
  reference_inputs?: TransactionInputsJSON | null;
  required_signers?: Ed25519KeyHashesJSON | null;
  script_data_hash?: string | null;
  total_collateral?: string | null;
  ttl?: string | null;
  update?: UpdateJSON | null;
  validity_start_interval?: string | null;
  withdrawals?: {
    [k: string]: ProtocolParamUpdateJSON;
  } | null;
}
export type TransactionHashJSON = string;
export interface TransactionInputJSON {
  index: number;
  transaction_id: string;
}
export type TransactionInputsJSON = TransactionInputJSON[];
export type TransactionMetadatumJSON = string;
export interface TransactionOutputJSON {
  address: string;
  amount: ValueJSON;
  plutus_data?: DataOptionJSON | null;
  script_ref?: ScriptRefJSON | null;
}
export type TransactionOutputsJSON = TransactionOutputJSON[];
export interface TransactionUnspentOutputJSON {
  input: TransactionInputJSON;
  output: TransactionOutputJSON;
}
export type TransactionUnspentOutputsJSON = TransactionUnspentOutputJSON[];
export interface TransactionWitnessSetJSON {
  bootstraps?: BootstrapWitnessesJSON | null;
  native_scripts?: NativeScriptsJSON | null;
  plutus_data?: PlutusList | null;
  plutus_scripts?: PlutusScriptsJSON | null;
  redeemers?: RedeemersJSON | null;
  vkeys?: VkeywitnessesJSON | null;
}
export type TransactionWitnessSetsJSON = TransactionWitnessSetJSON[];
export type URLJSON = string;
export interface UnitIntervalJSON {
  denominator: string;
  numerator: string;
}
export interface UpdateJSON {
  epoch: number;
  proposed_protocol_parameter_updates: {
    [k: string]: ProtocolParamUpdateJSON;
  };
}
export interface VRFCertJSON {
  output: number[];
  proof: number[];
}
export type VRFKeyHashJSON = string;
export type VRFVKeyJSON = string;
export interface ValueJSON {
  coin: string;
  multiasset?: MultiAssetJSON | null;
}
export type VkeyJSON = string;
export interface VkeywitnessJSON {
  signature: string;
  vkey: VkeyJSON;
}
export type VkeywitnessesJSON = VkeywitnessJSON[];
export interface WithdrawalsJSON {
  [k: string]: ProtocolParamUpdateJSON;
}
