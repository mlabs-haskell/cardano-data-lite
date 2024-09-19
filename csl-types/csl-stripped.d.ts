/* tslint:disable */
/* eslint-disable */
export function min_fee(tx: Transaction, linear_fee: LinearFee): BigNum;
export function calculate_ex_units_ceil_cost(ex_units: ExUnits, ex_unit_prices: ExUnitPrices): BigNum;
export function min_script_fee(tx: Transaction, ex_unit_prices: ExUnitPrices): BigNum;
export function min_ref_script_fee(total_ref_scripts_size: number, ref_script_coins_per_byte: UnitInterval): BigNum;
export function encode_arbitrary_bytes_as_metadatum(bytes: Uint8Array): TransactionMetadatum;
export function decode_arbitrary_bytes_from_metadatum(metadata: TransactionMetadatum): Uint8Array;
export function encode_json_str_to_metadatum(json: string, schema: MetadataJsonSchema): TransactionMetadatum;
export function decode_metadatum_to_json_str(metadatum: TransactionMetadatum, schema: MetadataJsonSchema): string;
export function make_daedalus_bootstrap_witness(tx_body_hash: TransactionHash, addr: ByronAddress, key: LegacyDaedalusPrivateKey): BootstrapWitness;
export function make_icarus_bootstrap_witness(tx_body_hash: TransactionHash, addr: ByronAddress, key: Bip32PrivateKey): BootstrapWitness;
export function make_vkey_witness(tx_body_hash: TransactionHash, sk: PrivateKey): Vkeywitness;
export function hash_auxiliary_data(auxiliary_data: AuxiliaryData): AuxiliaryDataHash;
export function hash_transaction(tx_body: TransactionBody): TransactionHash;
export function hash_plutus_data(plutus_data: PlutusData): DataHash;
export function hash_script_data(redeemers: Redeemers, cost_models: Costmdls, datums?: PlutusList): ScriptDataHash;
export function get_implicit_input(txbody: TransactionBody, pool_deposit: BigNum, key_deposit: BigNum): Value;
export function get_deposit(txbody: TransactionBody, pool_deposit: BigNum, key_deposit: BigNum): BigNum;
export function min_ada_for_output(output: TransactionOutput, data_cost: DataCost): BigNum;
export function encode_json_str_to_native_script(json: string, self_xpub: string, schema: ScriptSchema): NativeScript;
export function create_send_all(address: Address, utxos: TransactionUnspentOutputs, config: TransactionBuilderConfig): TransactionBatchList;
export function encrypt_with_password(password: string, salt: string, nonce: string, data: string): string;
export function decrypt_with_password(password: string, data: string): string;
export function encode_json_str_to_plutus_datum(json: string, schema: PlutusDatumSchema): PlutusData;
export function decode_plutus_datum_to_json_str(datum: PlutusData, schema: PlutusDatumSchema): string;

export enum LanguageKind {
  PlutusV1 = 0,
  PlutusV2 = 1,
  PlutusV3 = 2,
}

export enum ScriptSchema {
  Wallet = 0,
  Node = 1,
}

export enum MIRKind {
  ToOtherPot = 0,
  ToStakeCredentials = 1,
}

export enum PlutusDatumSchema {
  BasicConversions = 0,
  DetailedSchema = 1,
}

export enum MIRPot {
  Reserves = 0,
  Treasury = 1,
}

export enum BlockEra {
  Byron = 0,
  Shelley = 1,
  Allegra = 2,
  Mary = 3,
  Alonzo = 4,
  Babbage = 5,
  Conway = 6,
  Unknown = 7,
}

export enum RelayKind {
  SingleHostAddr = 0,
  SingleHostName = 1,
  MultiHostName = 2,
}

export enum RedeemerTagKind {
  Spend = 0,
  Mint = 1,
  Cert = 2,
  Reward = 3,
  Vote = 4,
  VotingProposal = 5,
}

export enum VoteKind {
  No = 0,
  Yes = 1,
  Abstain = 2,
}

export enum NetworkIdKind {
  Testnet = 0,
  Mainnet = 1,
}

export enum AddressKind {
  Base = 0,
  Pointer = 1,
  Enterprise = 2,
  Reward = 3,
  Byron = 4,
  Malformed = 5,
}

export enum PlutusDataKind {
  ConstrPlutusData = 0,
  Map = 1,
  List = 2,
  Integer = 3,
  Bytes = 4,
}

export enum CredKind {
  Key = 0,
  Script = 1,
}

export enum VoterKind {
  ConstitutionalCommitteeHotKeyHash = 0,
  ConstitutionalCommitteeHotScriptHash = 1,
  DRepKeyHash = 2,
  DRepScriptHash = 3,
  StakingPoolKeyHash = 4,
}

export enum NativeScriptKind {
  ScriptPubkey = 0,
  ScriptAll = 1,
  ScriptAny = 2,
  ScriptNOfK = 3,
  TimelockStart = 4,
  TimelockExpiry = 5,
}

export enum TransactionMetadatumKind {
  MetadataMap = 0,
  MetadataList = 1,
  Int = 2,
  Bytes = 3,
  Text = 4,
}

export enum DRepKind {
  KeyHash = 0,
  ScriptHash = 1,
  AlwaysAbstain = 2,
  AlwaysNoConfidence = 3,
}

export enum CertificateKind {
  StakeRegistration = 0,
  StakeDeregistration = 1,
  StakeDelegation = 2,
  PoolRegistration = 3,
  PoolRetirement = 4,
  GenesisKeyDelegation = 5,
  MoveInstantaneousRewardsCert = 6,
  CommitteeHotAuth = 7,
  CommitteeColdResign = 8,
  DRepDeregistration = 9,
  DRepRegistration = 10,
  DRepUpdate = 11,
  StakeAndVoteDelegation = 12,
  StakeRegistrationAndDelegation = 13,
  StakeVoteRegistrationAndDelegation = 14,
  VoteDelegation = 15,
  VoteRegistrationAndDelegation = 16,
}

export enum CoinSelectionStrategyCIP2 {
  LargestFirst = 0,
  RandomImprove = 1,
  LargestFirstMultiAsset = 2,
  RandomImproveMultiAsset = 3,
}

export enum MetadataJsonSchema {
  NoConversions = 0,
  BasicConversions = 1,
  DetailedSchema = 2,
}

export enum CborContainerType {
  Array = 0,
  Map = 1,
}

export enum ScriptHashNamespace {
  NativeScript = 0,
  PlutusScript = 1,
  PlutusScriptV2 = 2,
  PlutusScriptV3 = 3,
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

export class Address {
  free(): void;
  static from_bytes(data: Uint8Array): Address;
  static from_json(json: string): Address;
  kind(): AddressKind;
  payment_cred(): Credential | undefined;
  is_malformed(): boolean;
  to_hex(): string;
  static from_hex(hex_str: string): Address;
  to_bytes(): Uint8Array;
  to_bech32(prefix?: string): string;
  static from_bech32(bech_str: string): Address;
  network_id(): number;
}

export class Anchor {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Anchor;
  to_hex(): string;
  static from_hex(hex_str: string): Anchor;
  static from_json(json: string): Anchor;
  url(): URL;
  anchor_data_hash(): AnchorDataHash;
  static new(anchor_url: URL, anchor_data_hash: AnchorDataHash): Anchor;
}

export class AnchorDataHash {
  free(): void;
  static from_bytes(bytes: Uint8Array): AnchorDataHash;
  to_bytes(): Uint8Array;
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): AnchorDataHash;
  to_hex(): string;
  static from_hex(hex: string): AnchorDataHash;
}

export class AssetName {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): AssetName;
  to_hex(): string;
  static from_hex(hex_str: string): AssetName;
  static from_json(json: string): AssetName;
  static new(name: Uint8Array): AssetName;
  name(): Uint8Array;
}

export class AssetNames {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): AssetNames;
  to_hex(): string;
  static from_hex(hex_str: string): AssetNames;
  static from_json(json: string): AssetNames;
  static new(): AssetNames;
  len(): number;
  get(index: number): AssetName;
  add(elem: AssetName): void;
}

export class Assets {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Assets;
  to_hex(): string;
  static from_hex(hex_str: string): Assets;
  static from_json(json: string): Assets;
  static new(): Assets;
  len(): number;
  insert(key: AssetName, value: BigNum): BigNum | undefined;
  get(key: AssetName): BigNum | undefined;
  keys(): AssetNames;
}

export class AuxiliaryData {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): AuxiliaryData;
  to_hex(): string;
  static from_hex(hex_str: string): AuxiliaryData;
  static from_json(json: string): AuxiliaryData;
  static new(): AuxiliaryData;
  metadata(): GeneralTransactionMetadata | undefined;
  set_metadata(metadata: GeneralTransactionMetadata): void;
  native_scripts(): NativeScripts | undefined;
  set_native_scripts(native_scripts: NativeScripts): void;
  plutus_scripts(): PlutusScripts | undefined;
  set_plutus_scripts(plutus_scripts: PlutusScripts): void;
  prefer_alonzo_format(): boolean;
  set_prefer_alonzo_format(prefer: boolean): void;
}

export class AuxiliaryDataHash {
  free(): void;
  static from_bytes(bytes: Uint8Array): AuxiliaryDataHash;
  to_bytes(): Uint8Array;
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): AuxiliaryDataHash;
  to_hex(): string;
  static from_hex(hex: string): AuxiliaryDataHash;
}

export class AuxiliaryDataSet {
  free(): void;
  static new(): AuxiliaryDataSet;
  len(): number;
  insert(tx_index: number, data: AuxiliaryData): AuxiliaryData | undefined;
  get(tx_index: number): AuxiliaryData | undefined;
  indices(): Uint32Array;
}

export class BaseAddress {
  free(): void;
  static new(network: number, payment: Credential, stake: Credential): BaseAddress;
  payment_cred(): Credential;
  stake_cred(): Credential;
  to_address(): Address;
  static from_address(addr: Address): BaseAddress | undefined;
  network_id(): number;
}

export class BigInt {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): BigInt;
  to_hex(): string;
  static from_hex(hex_str: string): BigInt;
  static from_json(json: string): BigInt;
  is_zero(): boolean;
  as_u64(): BigNum | undefined;
  as_int(): Int | undefined;
  static from_str(text: string): BigInt;
  to_str(): string;
  add(other: BigInt): BigInt;
  sub(other: BigInt): BigInt;
  mul(other: BigInt): BigInt;
  pow(exp: number): BigInt;
  static one(): BigInt;
  static zero(): BigInt;
  abs(): BigInt;
  increment(): BigInt;
  div_ceil(other: BigInt): BigInt;
  div_floor(other: BigInt): BigInt;
}

export class BigNum {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): BigNum;
  to_hex(): string;
  static from_hex(hex_str: string): BigNum;
  static from_json(json: string): BigNum;
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
  free(): void;
  derive(index: number): Bip32PrivateKey;
  static from_128_xprv(bytes: Uint8Array): Bip32PrivateKey;
  to_128_xprv(): Uint8Array;
  static generate_ed25519_bip32(): Bip32PrivateKey;
  to_raw_key(): PrivateKey;
  to_public(): Bip32PublicKey;
  static from_bytes(bytes: Uint8Array): Bip32PrivateKey;
  as_bytes(): Uint8Array;
  static from_bech32(bech32_str: string): Bip32PrivateKey;
  to_bech32(): string;
  static from_bip39_entropy(entropy: Uint8Array, password: Uint8Array): Bip32PrivateKey;
  chaincode(): Uint8Array;
  to_hex(): string;
  static from_hex(hex_str: string): Bip32PrivateKey;
}

export class Bip32PublicKey {
  free(): void;
  static from_hex(hex_str: string): Bip32PublicKey;
  to_hex(): string;
  chaincode(): Uint8Array;
  to_bech32(): string;
  static from_bech32(bech32_str: string): Bip32PublicKey;
  as_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Bip32PublicKey;
  to_raw_key(): PublicKey;
  derive(index: number): Bip32PublicKey;
}

export class Block {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Block;
  to_hex(): string;
  static from_hex(hex_str: string): Block;
  static from_json(json: string): Block;
  header(): Header;
  transaction_bodies(): TransactionBodies;
  transaction_witness_sets(): TransactionWitnessSets;
  auxiliary_data_set(): AuxiliaryDataSet;
  invalid_transactions(): Uint32Array;
  static new(header: Header, transaction_bodies: TransactionBodies, transaction_witness_sets: TransactionWitnessSets, auxiliary_data_set: AuxiliaryDataSet, invalid_transactions: Uint32Array): Block;
}

export class BlockHash {
  free(): void;
  static from_bytes(bytes: Uint8Array): BlockHash;
  to_bytes(): Uint8Array;
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): BlockHash;
  to_hex(): string;
  static from_hex(hex: string): BlockHash;
}

export class BootstrapWitness {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): BootstrapWitness;
  to_hex(): string;
  static from_hex(hex_str: string): BootstrapWitness;
  static from_json(json: string): BootstrapWitness;
  vkey(): Vkey;
  signature(): Ed25519Signature;
  chain_code(): Uint8Array;
  attributes(): Uint8Array;
  static new(vkey: Vkey, signature: Ed25519Signature, chain_code: Uint8Array, attributes: Uint8Array): BootstrapWitness;
}

export class BootstrapWitnesses {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): BootstrapWitnesses;
  to_hex(): string;
  static from_hex(hex_str: string): BootstrapWitnesses;
  static from_json(json: string): BootstrapWitnesses;
  static new(): BootstrapWitnesses;
  len(): number;
  get(index: number): BootstrapWitness;
  add(elem: BootstrapWitness): boolean;
}

export class ByronAddress {
  free(): void;
  to_base58(): string;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): ByronAddress;
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
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Certificate;
  to_hex(): string;
  static from_hex(hex_str: string): Certificate;
  static from_json(json: string): Certificate;
  static new_stake_registration(stake_registration: StakeRegistration): Certificate;
  static new_reg_cert(stake_registration: StakeRegistration): Certificate;
  static new_stake_deregistration(stake_deregistration: StakeDeregistration): Certificate;
  static new_unreg_cert(stake_deregistration: StakeDeregistration): Certificate;
  static new_stake_delegation(stake_delegation: StakeDelegation): Certificate;
  static new_pool_registration(pool_registration: PoolRegistration): Certificate;
  static new_pool_retirement(pool_retirement: PoolRetirement): Certificate;
  static new_genesis_key_delegation(genesis_key_delegation: GenesisKeyDelegation): Certificate;
  static new_move_instantaneous_rewards_cert(move_instantaneous_rewards_cert: MoveInstantaneousRewardsCert): Certificate;
  static new_committee_hot_auth(committee_hot_auth: CommitteeHotAuth): Certificate;
  static new_committee_cold_resign(committee_cold_resign: CommitteeColdResign): Certificate;
  static new_drep_deregistration(drep_deregistration: DRepDeregistration): Certificate;
  static new_drep_registration(drep_registration: DRepRegistration): Certificate;
  static new_drep_update(drep_update: DRepUpdate): Certificate;
  static new_stake_and_vote_delegation(stake_and_vote_delegation: StakeAndVoteDelegation): Certificate;
  static new_stake_registration_and_delegation(stake_registration_and_delegation: StakeRegistrationAndDelegation): Certificate;
  static new_stake_vote_registration_and_delegation(stake_vote_registration_and_delegation: StakeVoteRegistrationAndDelegation): Certificate;
  static new_vote_delegation(vote_delegation: VoteDelegation): Certificate;
  static new_vote_registration_and_delegation(vote_registration_and_delegation: VoteRegistrationAndDelegation): Certificate;
  kind(): CertificateKind;
  as_stake_registration(): StakeRegistration | undefined;
  as_reg_cert(): StakeRegistration | undefined;
  as_stake_deregistration(): StakeDeregistration | undefined;
  as_unreg_cert(): StakeDeregistration | undefined;
  as_stake_delegation(): StakeDelegation | undefined;
  as_pool_registration(): PoolRegistration | undefined;
  as_pool_retirement(): PoolRetirement | undefined;
  as_genesis_key_delegation(): GenesisKeyDelegation | undefined;
  as_move_instantaneous_rewards_cert(): MoveInstantaneousRewardsCert | undefined;
  as_committee_hot_auth(): CommitteeHotAuth | undefined;
  as_committee_cold_resign(): CommitteeColdResign | undefined;
  as_drep_deregistration(): DRepDeregistration | undefined;
  as_drep_registration(): DRepRegistration | undefined;
  as_drep_update(): DRepUpdate | undefined;
  as_stake_and_vote_delegation(): StakeAndVoteDelegation | undefined;
  as_stake_registration_and_delegation(): StakeRegistrationAndDelegation | undefined;
  as_stake_vote_registration_and_delegation(): StakeVoteRegistrationAndDelegation | undefined;
  as_vote_delegation(): VoteDelegation | undefined;
  as_vote_registration_and_delegation(): VoteRegistrationAndDelegation | undefined;
  has_required_script_witness(): boolean;
}

export class Certificates {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Certificates;
  to_hex(): string;
  static from_hex(hex_str: string): Certificates;
  static from_json(json: string): Certificates;
  static new(): Certificates;
  len(): number;
  get(index: number): Certificate;
  add(elem: Certificate): boolean;
}

export class ChangeConfig {
  free(): void;
  static new(address: Address): ChangeConfig;
  change_address(address: Address): ChangeConfig;
  change_plutus_data(plutus_data: OutputDatum): ChangeConfig;
  change_script_ref(script_ref: ScriptRef): ChangeConfig;
}

export class Committee {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Committee;
  to_hex(): string;
  static from_hex(hex_str: string): Committee;
  static from_json(json: string): Committee;
  static new(quorum_threshold: UnitInterval): Committee;
  members_keys(): Credentials;
  quorum_threshold(): UnitInterval;
  add_member(committee_cold_credential: Credential, epoch: number): void;
  get_member_epoch(committee_cold_credential: Credential): number | undefined;
}

export class CommitteeColdResign {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): CommitteeColdResign;
  to_hex(): string;
  static from_hex(hex_str: string): CommitteeColdResign;
  static from_json(json: string): CommitteeColdResign;
  committee_cold_credential(): Credential;
  anchor(): Anchor | undefined;
  static new(committee_cold_credential: Credential): CommitteeColdResign;
  static new_with_anchor(committee_cold_credential: Credential, anchor: Anchor): CommitteeColdResign;
  has_script_credentials(): boolean;
}

export class CommitteeHotAuth {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): CommitteeHotAuth;
  to_hex(): string;
  static from_hex(hex_str: string): CommitteeHotAuth;
  static from_json(json: string): CommitteeHotAuth;
  committee_cold_credential(): Credential;
  committee_hot_credential(): Credential;
  static new(committee_cold_credential: Credential, committee_hot_credential: Credential): CommitteeHotAuth;
  has_script_credentials(): boolean;
}

export class Constitution {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Constitution;
  to_hex(): string;
  static from_hex(hex_str: string): Constitution;
  static from_json(json: string): Constitution;
  anchor(): Anchor;
  script_hash(): ScriptHash | undefined;
  static new(anchor: Anchor): Constitution;
  static new_with_script_hash(anchor: Anchor, script_hash: ScriptHash): Constitution;
}

export class ConstrPlutusData {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): ConstrPlutusData;
  to_hex(): string;
  static from_hex(hex_str: string): ConstrPlutusData;
  alternative(): BigNum;
  data(): PlutusList;
  static new(alternative: BigNum, data: PlutusList): ConstrPlutusData;
}

export class CostModel {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): CostModel;
  to_hex(): string;
  static from_hex(hex_str: string): CostModel;
  static from_json(json: string): CostModel;
  static new(): CostModel;
  set(operation: number, cost: Int): Int;
  get(operation: number): Int;
  len(): number;
}

export class Costmdls {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Costmdls;
  to_hex(): string;
  static from_hex(hex_str: string): Costmdls;
  static from_json(json: string): Costmdls;
  static new(): Costmdls;
  len(): number;
  insert(key: Language, value: CostModel): CostModel | undefined;
  get(key: Language): CostModel | undefined;
  keys(): Languages;
  retain_language_versions(languages: Languages): Costmdls;
}

export class Credential {
  free(): void;
  static from_keyhash(hash: Ed25519KeyHash): Credential;
  static from_scripthash(hash: ScriptHash): Credential;
  to_keyhash(): Ed25519KeyHash | undefined;
  to_scripthash(): ScriptHash | undefined;
  kind(): CredKind;
  has_script_hash(): boolean;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Credential;
  to_hex(): string;
  static from_hex(hex_str: string): Credential;
  static from_json(json: string): Credential;
}

export class Credentials {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Credentials;
  to_hex(): string;
  static from_hex(hex_str: string): Credentials;
  static from_json(json: string): Credentials;
  static new(): Credentials;
  len(): number;
  get(index: number): Credential;
  add(elem: Credential): boolean;
}

export class DNSRecordAorAAAA {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): DNSRecordAorAAAA;
  to_hex(): string;
  static from_hex(hex_str: string): DNSRecordAorAAAA;
  static from_json(json: string): DNSRecordAorAAAA;
  static new(dns_name: string): DNSRecordAorAAAA;
  record(): string;
}

export class DNSRecordSRV {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): DNSRecordSRV;
  to_hex(): string;
  static from_hex(hex_str: string): DNSRecordSRV;
  static from_json(json: string): DNSRecordSRV;
  static new(dns_name: string): DNSRecordSRV;
  record(): string;
}

export class DRep {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): DRep;
  to_hex(): string;
  static from_hex(hex_str: string): DRep;
  static from_json(json: string): DRep;
  static new_key_hash(key_hash: Ed25519KeyHash): DRep;
  static new_script_hash(script_hash: ScriptHash): DRep;
  static new_always_abstain(): DRep;
  static new_always_no_confidence(): DRep;
  static new_from_credential(cred: Credential): DRep;
  kind(): DRepKind;
  to_key_hash(): Ed25519KeyHash | undefined;
  to_script_hash(): ScriptHash | undefined;
  to_bech32(): string;
  static from_bech32(bech32_str: string): DRep;
}

export class DRepDeregistration {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): DRepDeregistration;
  to_hex(): string;
  static from_hex(hex_str: string): DRepDeregistration;
  static from_json(json: string): DRepDeregistration;
  voting_credential(): Credential;
  coin(): BigNum;
  static new(voting_credential: Credential, coin: BigNum): DRepDeregistration;
  has_script_credentials(): boolean;
}

export class DRepRegistration {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): DRepRegistration;
  to_hex(): string;
  static from_hex(hex_str: string): DRepRegistration;
  static from_json(json: string): DRepRegistration;
  voting_credential(): Credential;
  coin(): BigNum;
  anchor(): Anchor | undefined;
  static new(voting_credential: Credential, coin: BigNum): DRepRegistration;
  static new_with_anchor(voting_credential: Credential, coin: BigNum, anchor: Anchor): DRepRegistration;
  has_script_credentials(): boolean;
}

export class DRepUpdate {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): DRepUpdate;
  to_hex(): string;
  static from_hex(hex_str: string): DRepUpdate;
  static from_json(json: string): DRepUpdate;
  voting_credential(): Credential;
  anchor(): Anchor | undefined;
  static new(voting_credential: Credential): DRepUpdate;
  static new_with_anchor(voting_credential: Credential, anchor: Anchor): DRepUpdate;
  has_script_credentials(): boolean;
}

export class DRepVotingThresholds {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): DRepVotingThresholds;
  to_hex(): string;
  static from_hex(hex_str: string): DRepVotingThresholds;
  static from_json(json: string): DRepVotingThresholds;
  static new(motion_no_confidence: UnitInterval, committee_normal: UnitInterval, committee_no_confidence: UnitInterval, update_constitution: UnitInterval, hard_fork_initiation: UnitInterval, pp_network_group: UnitInterval, pp_economic_group: UnitInterval, pp_technical_group: UnitInterval, pp_governance_group: UnitInterval, treasury_withdrawal: UnitInterval): DRepVotingThresholds;
  set_motion_no_confidence(motion_no_confidence: UnitInterval): void;
  set_committee_normal(committee_normal: UnitInterval): void;
  set_committee_no_confidence(committee_no_confidence: UnitInterval): void;
  set_update_constitution(update_constitution: UnitInterval): void;
  set_hard_fork_initiation(hard_fork_initiation: UnitInterval): void;
  set_pp_network_group(pp_network_group: UnitInterval): void;
  set_pp_economic_group(pp_economic_group: UnitInterval): void;
  set_pp_technical_group(pp_technical_group: UnitInterval): void;
  set_pp_governance_group(pp_governance_group: UnitInterval): void;
  set_treasury_withdrawal(treasury_withdrawal: UnitInterval): void;
  motion_no_confidence(): UnitInterval;
  committee_normal(): UnitInterval;
  committee_no_confidence(): UnitInterval;
  update_constitution(): UnitInterval;
  hard_fork_initiation(): UnitInterval;
  pp_network_group(): UnitInterval;
  pp_economic_group(): UnitInterval;
  pp_technical_group(): UnitInterval;
  pp_governance_group(): UnitInterval;
  treasury_withdrawal(): UnitInterval;
}

export class DataCost {
  free(): void;
  static new_coins_per_byte(coins_per_byte: BigNum): DataCost;
  coins_per_byte(): BigNum;
}

export class DataHash {
  free(): void;
  static from_bytes(bytes: Uint8Array): DataHash;
  to_bytes(): Uint8Array;
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): DataHash;
  to_hex(): string;
  static from_hex(hex: string): DataHash;
}

export class DatumSource {
  free(): void;
  static new(datum: PlutusData): DatumSource;
  static new_ref_input(input: TransactionInput): DatumSource;
}

export class Ed25519KeyHash {
  free(): void;
  static from_bytes(bytes: Uint8Array): Ed25519KeyHash;
  to_bytes(): Uint8Array;
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): Ed25519KeyHash;
  to_hex(): string;
  static from_hex(hex: string): Ed25519KeyHash;
}

export class Ed25519KeyHashes {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Ed25519KeyHashes;
  to_hex(): string;
  static from_hex(hex_str: string): Ed25519KeyHashes;
  static from_json(json: string): Ed25519KeyHashes;
  static new(): Ed25519KeyHashes;
  len(): number;
  get(index: number): Ed25519KeyHash;
  add(elem: Ed25519KeyHash): boolean;
  contains(elem: Ed25519KeyHash): boolean;
  to_option(): Ed25519KeyHashes | undefined;
}

export class Ed25519Signature {
  free(): void;
  to_bytes(): Uint8Array;
  to_bech32(): string;
  to_hex(): string;
  static from_bech32(bech32_str: string): Ed25519Signature;
  static from_hex(input: string): Ed25519Signature;
  static from_bytes(bytes: Uint8Array): Ed25519Signature;
}

export class EnterpriseAddress {
  free(): void;
  static new(network: number, payment: Credential): EnterpriseAddress;
  payment_cred(): Credential;
  to_address(): Address;
  static from_address(addr: Address): EnterpriseAddress | undefined;
  network_id(): number;
}

export class ExUnitPrices {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): ExUnitPrices;
  to_hex(): string;
  static from_hex(hex_str: string): ExUnitPrices;
  static from_json(json: string): ExUnitPrices;
  mem_price(): UnitInterval;
  step_price(): UnitInterval;
  static new(mem_price: UnitInterval, step_price: UnitInterval): ExUnitPrices;
}

export class ExUnits {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): ExUnits;
  to_hex(): string;
  static from_hex(hex_str: string): ExUnits;
  static from_json(json: string): ExUnits;
  mem(): BigNum;
  steps(): BigNum;
  static new(mem: BigNum, steps: BigNum): ExUnits;
}

export class FixedBlock {
  free(): void;
  static from_bytes(bytes: Uint8Array): FixedBlock;
  static from_hex(hex_str: string): FixedBlock;
  header(): Header;
  transaction_bodies(): FixedTransactionBodies;
  transaction_witness_sets(): TransactionWitnessSets;
  auxiliary_data_set(): AuxiliaryDataSet;
  invalid_transactions(): Uint32Array;
  block_hash(): BlockHash;
}

export class FixedTransaction {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): FixedTransaction;
  to_hex(): string;
  static from_hex(hex_str: string): FixedTransaction;
  static new(raw_body: Uint8Array, raw_witness_set: Uint8Array, is_valid: boolean): FixedTransaction;
  static new_with_auxiliary(raw_body: Uint8Array, raw_witness_set: Uint8Array, raw_auxiliary_data: Uint8Array, is_valid: boolean): FixedTransaction;
  body(): TransactionBody;
  raw_body(): Uint8Array;
  set_body(raw_body: Uint8Array): void;
  set_witness_set(raw_witness_set: Uint8Array): void;
  witness_set(): TransactionWitnessSet;
  raw_witness_set(): Uint8Array;
  set_is_valid(valid: boolean): void;
  is_valid(): boolean;
  set_auxiliary_data(raw_auxiliary_data: Uint8Array): void;
  auxiliary_data(): AuxiliaryData | undefined;
  raw_auxiliary_data(): Uint8Array | undefined;
  transaction_hash(): TransactionHash;
  add_vkey_witness(vkey_witness: Vkeywitness): void;
  add_bootstrap_witness(bootstrap_witness: BootstrapWitness): void;
  sign_and_add_vkey_signature(private_key: PrivateKey): void;
  sign_and_add_icarus_bootstrap_signature(addr: ByronAddress, private_key: Bip32PrivateKey): void;
  sign_and_add_daedalus_bootstrap_signature(addr: ByronAddress, private_key: LegacyDaedalusPrivateKey): void;
}

export class FixedTransactionBodies {
  free(): void;
  static from_bytes(bytes: Uint8Array): FixedTransactionBodies;
  static from_hex(hex_str: string): FixedTransactionBodies;
  static new(): FixedTransactionBodies;
  len(): number;
  get(index: number): FixedTransactionBody;
  add(elem: FixedTransactionBody): void;
}

export class FixedTransactionBody {
  free(): void;
  static from_bytes(bytes: Uint8Array): FixedTransactionBody;
  static from_hex(hex_str: string): FixedTransactionBody;
  transaction_body(): TransactionBody;
  tx_hash(): TransactionHash;
  original_bytes(): Uint8Array;
}

export class FixedTxWitnessesSet {
  free(): void;
  tx_witnesses_set(): TransactionWitnessSet;
  add_vkey_witness(vkey_witness: Vkeywitness): void;
  add_bootstrap_witness(bootstrap_witness: BootstrapWitness): void;
  to_bytes(): Uint8Array;
  static from_bytes(data: Uint8Array): FixedTxWitnessesSet;
}

export class FixedVersionedBlock {
  free(): void;
  static from_bytes(bytes: Uint8Array): FixedVersionedBlock;
  static from_hex(hex_str: string): FixedVersionedBlock;
  block(): FixedBlock;
  era(): BlockEra;
}

export class GeneralTransactionMetadata {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): GeneralTransactionMetadata;
  to_hex(): string;
  static from_hex(hex_str: string): GeneralTransactionMetadata;
  static from_json(json: string): GeneralTransactionMetadata;
  static new(): GeneralTransactionMetadata;
  len(): number;
  insert(key: BigNum, value: TransactionMetadatum): TransactionMetadatum | undefined;
  get(key: BigNum): TransactionMetadatum | undefined;
  keys(): TransactionMetadatumLabels;
}

export class GenesisDelegateHash {
  free(): void;
  static from_bytes(bytes: Uint8Array): GenesisDelegateHash;
  to_bytes(): Uint8Array;
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): GenesisDelegateHash;
  to_hex(): string;
  static from_hex(hex: string): GenesisDelegateHash;
}

export class GenesisHash {
  free(): void;
  static from_bytes(bytes: Uint8Array): GenesisHash;
  to_bytes(): Uint8Array;
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): GenesisHash;
  to_hex(): string;
  static from_hex(hex: string): GenesisHash;
}

export class GenesisHashes {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): GenesisHashes;
  to_hex(): string;
  static from_hex(hex_str: string): GenesisHashes;
  static from_json(json: string): GenesisHashes;
  static new(): GenesisHashes;
  len(): number;
  get(index: number): GenesisHash;
  add(elem: GenesisHash): void;
}

export class GenesisKeyDelegation {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): GenesisKeyDelegation;
  to_hex(): string;
  static from_hex(hex_str: string): GenesisKeyDelegation;
  static from_json(json: string): GenesisKeyDelegation;
  genesishash(): GenesisHash;
  genesis_delegate_hash(): GenesisDelegateHash;
  vrf_keyhash(): VRFKeyHash;
  static new(genesishash: GenesisHash, genesis_delegate_hash: GenesisDelegateHash, vrf_keyhash: VRFKeyHash): GenesisKeyDelegation;
}

export class GovernanceAction {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): GovernanceAction;
  to_hex(): string;
  static from_hex(hex_str: string): GovernanceAction;
  static from_json(json: string): GovernanceAction;
  static new_parameter_change_action(parameter_change_action: ParameterChangeAction): GovernanceAction;
  static new_hard_fork_initiation_action(hard_fork_initiation_action: HardForkInitiationAction): GovernanceAction;
  static new_treasury_withdrawals_action(treasury_withdrawals_action: TreasuryWithdrawalsAction): GovernanceAction;
  static new_no_confidence_action(no_confidence_action: NoConfidenceAction): GovernanceAction;
  static new_new_committee_action(new_committee_action: UpdateCommitteeAction): GovernanceAction;
  static new_new_constitution_action(new_constitution_action: NewConstitutionAction): GovernanceAction;
  static new_info_action(info_action: InfoAction): GovernanceAction;
  kind(): GovernanceActionKind;
  as_parameter_change_action(): ParameterChangeAction | undefined;
  as_hard_fork_initiation_action(): HardForkInitiationAction | undefined;
  as_treasury_withdrawals_action(): TreasuryWithdrawalsAction | undefined;
  as_no_confidence_action(): NoConfidenceAction | undefined;
  as_new_committee_action(): UpdateCommitteeAction | undefined;
  as_new_constitution_action(): NewConstitutionAction | undefined;
  as_info_action(): InfoAction | undefined;
}

export class GovernanceActionId {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): GovernanceActionId;
  to_hex(): string;
  static from_hex(hex_str: string): GovernanceActionId;
  static from_json(json: string): GovernanceActionId;
  transaction_id(): TransactionHash;
  index(): number;
  static new(transaction_id: TransactionHash, index: number): GovernanceActionId;
}

export class GovernanceActionIds {
  free(): void;
  static from_json(json: string): GovernanceActionIds;
  static new(): GovernanceActionIds;
  add(governance_action_id: GovernanceActionId): void;
  get(index: number): GovernanceActionId | undefined;
  len(): number;
}

export class HardForkInitiationAction {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): HardForkInitiationAction;
  to_hex(): string;
  static from_hex(hex_str: string): HardForkInitiationAction;
  static from_json(json: string): HardForkInitiationAction;
  gov_action_id(): GovernanceActionId | undefined;
  protocol_version(): ProtocolVersion;
  static new(protocol_version: ProtocolVersion): HardForkInitiationAction;
  static new_with_action_id(gov_action_id: GovernanceActionId, protocol_version: ProtocolVersion): HardForkInitiationAction;
}

export class Header {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Header;
  to_hex(): string;
  static from_hex(hex_str: string): Header;
  static from_json(json: string): Header;
  header_body(): HeaderBody;
  body_signature(): KESSignature;
  static new(header_body: HeaderBody, body_signature: KESSignature): Header;
}

export class HeaderBody {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): HeaderBody;
  to_hex(): string;
  static from_hex(hex_str: string): HeaderBody;
  static from_json(json: string): HeaderBody;
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

export class InfoAction {
  free(): void;
  static new(): InfoAction;
}

export class Int {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Int;
  to_hex(): string;
  static from_hex(hex_str: string): Int;
  static from_json(json: string): Int;
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
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Ipv4;
  to_hex(): string;
  static from_hex(hex_str: string): Ipv4;
  static from_json(json: string): Ipv4;
  static new(data: Uint8Array): Ipv4;
  ip(): Uint8Array;
}

export class Ipv6 {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Ipv6;
  to_hex(): string;
  static from_hex(hex_str: string): Ipv6;
  static from_json(json: string): Ipv6;
  static new(data: Uint8Array): Ipv6;
  ip(): Uint8Array;
}

export class KESSignature {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): KESSignature;
}

export class KESVKey {
  free(): void;
  static from_bytes(bytes: Uint8Array): KESVKey;
  to_bytes(): Uint8Array;
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): KESVKey;
  to_hex(): string;
  static from_hex(hex: string): KESVKey;
}

export class Language {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Language;
  to_hex(): string;
  static from_hex(hex_str: string): Language;
  static from_json(json: string): Language;
  static new_plutus_v1(): Language;
  static new_plutus_v2(): Language;
  static new_plutus_v3(): Language;
  kind(): LanguageKind;
}

export class Languages {
  free(): void;
  static new(): Languages;
  len(): number;
  get(index: number): Language;
  add(elem: Language): void;
  static list(): Languages;
}

export class LegacyDaedalusPrivateKey {
  free(): void;
  static from_bytes(bytes: Uint8Array): LegacyDaedalusPrivateKey;
  as_bytes(): Uint8Array;
  chaincode(): Uint8Array;
}

export class LinearFee {
  free(): void;
  constant(): BigNum;
  coefficient(): BigNum;
  static new(coefficient: BigNum, constant: BigNum): LinearFee;
}

export class MIRToStakeCredentials {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): MIRToStakeCredentials;
  to_hex(): string;
  static from_hex(hex_str: string): MIRToStakeCredentials;
  static from_json(json: string): MIRToStakeCredentials;
  static new(): MIRToStakeCredentials;
  len(): number;
  insert(cred: Credential, delta: Int): Int | undefined;
  get(cred: Credential): Int | undefined;
  keys(): Credentials;
}

export class MalformedAddress {
  free(): void;
  original_bytes(): Uint8Array;
  to_address(): Address;
  static from_address(addr: Address): MalformedAddress | undefined;
}

export class MetadataList {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): MetadataList;
  to_hex(): string;
  static from_hex(hex_str: string): MetadataList;
  static new(): MetadataList;
  len(): number;
  get(index: number): TransactionMetadatum;
  add(elem: TransactionMetadatum): void;
}

export class MetadataMap {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): MetadataMap;
  to_hex(): string;
  static from_hex(hex_str: string): MetadataMap;
  static new(): MetadataMap;
  len(): number;
  insert(key: TransactionMetadatum, value: TransactionMetadatum): TransactionMetadatum | undefined;
  insert_str(key: string, value: TransactionMetadatum): TransactionMetadatum | undefined;
  insert_i32(key: number, value: TransactionMetadatum): TransactionMetadatum | undefined;
  get(key: TransactionMetadatum): TransactionMetadatum;
  get_str(key: string): TransactionMetadatum;
  get_i32(key: number): TransactionMetadatum;
  has(key: TransactionMetadatum): boolean;
  keys(): MetadataList;
}

export class Mint {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Mint;
  to_hex(): string;
  static from_hex(hex_str: string): Mint;
  static from_json(json: string): Mint;
  static new(): Mint;
  static new_from_entry(key: ScriptHash, value: MintAssets): Mint;
  len(): number;
  insert(key: ScriptHash, value: MintAssets): MintAssets | undefined;
  get(key: ScriptHash): MintsAssets | undefined;
  keys(): ScriptHashes;
  as_positive_multiasset(): MultiAsset;
  as_negative_multiasset(): MultiAsset;
}

export class MintAssets {
  free(): void;
  static new(): MintAssets;
  static new_from_entry(key: AssetName, value: Int): MintAssets;
  len(): number;
  insert(key: AssetName, value: Int): Int | undefined;
  get(key: AssetName): Int | undefined;
  keys(): AssetNames;
}

export class MintWitness {
  free(): void;
  static new_native_script(native_script: NativeScriptSource): MintWitness;
  static new_plutus_script(plutus_script: PlutusScriptSource, redeemer: Redeemer): MintWitness;
}

export class MintsAssets {
  free(): void;
  static from_json(json: string): MintsAssets;
  static new(): MintsAssets;
  add(mint_assets: MintAssets): void;
  get(index: number): MintAssets | undefined;
  len(): number;
}

export class MoveInstantaneousReward {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): MoveInstantaneousReward;
  to_hex(): string;
  static from_hex(hex_str: string): MoveInstantaneousReward;
  static from_json(json: string): MoveInstantaneousReward;
  static new_to_other_pot(pot: MIRPot, amount: BigNum): MoveInstantaneousReward;
  static new_to_stake_creds(pot: MIRPot, amounts: MIRToStakeCredentials): MoveInstantaneousReward;
  pot(): MIRPot;
  kind(): MIRKind;
  as_to_other_pot(): BigNum | undefined;
  as_to_stake_creds(): MIRToStakeCredentials | undefined;
}

export class MoveInstantaneousRewardsCert {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): MoveInstantaneousRewardsCert;
  to_hex(): string;
  static from_hex(hex_str: string): MoveInstantaneousRewardsCert;
  static from_json(json: string): MoveInstantaneousRewardsCert;
  move_instantaneous_reward(): MoveInstantaneousReward;
  static new(move_instantaneous_reward: MoveInstantaneousReward): MoveInstantaneousRewardsCert;
}

export class MultiAsset {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): MultiAsset;
  to_hex(): string;
  static from_hex(hex_str: string): MultiAsset;
  static from_json(json: string): MultiAsset;
  static new(): MultiAsset;
  len(): number;
  insert(policy_id: ScriptHash, assets: Assets): Assets | undefined;
  get(policy_id: ScriptHash): Assets | undefined;
  set_asset(policy_id: ScriptHash, asset_name: AssetName, value: BigNum): BigNum | undefined;
  get_asset(policy_id: ScriptHash, asset_name: AssetName): BigNum;
  keys(): ScriptHashes;
  sub(rhs_ma: MultiAsset): MultiAsset;
}

export class MultiHostName {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): MultiHostName;
  to_hex(): string;
  static from_hex(hex_str: string): MultiHostName;
  static from_json(json: string): MultiHostName;
  dns_name(): DNSRecordSRV;
  static new(dns_name: DNSRecordSRV): MultiHostName;
}

export class NativeScript {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): NativeScript;
  to_hex(): string;
  static from_hex(hex_str: string): NativeScript;
  static from_json(json: string): NativeScript;
  hash(): ScriptHash;
  static new_script_pubkey(script_pubkey: ScriptPubkey): NativeScript;
  static new_script_all(script_all: ScriptAll): NativeScript;
  static new_script_any(script_any: ScriptAny): NativeScript;
  static new_script_n_of_k(script_n_of_k: ScriptNOfK): NativeScript;
  static new_timelock_start(timelock_start: TimelockStart): NativeScript;
  static new_timelock_expiry(timelock_expiry: TimelockExpiry): NativeScript;
  kind(): NativeScriptKind;
  as_script_pubkey(): ScriptPubkey | undefined;
  as_script_all(): ScriptAll | undefined;
  as_script_any(): ScriptAny | undefined;
  as_script_n_of_k(): ScriptNOfK | undefined;
  as_timelock_start(): TimelockStart | undefined;
  as_timelock_expiry(): TimelockExpiry | undefined;
  get_required_signers(): Ed25519KeyHashes;
}

export class NativeScriptSource {
  free(): void;
  static new(script: NativeScript): NativeScriptSource;
  static new_ref_input(script_hash: ScriptHash, input: TransactionInput, script_size: number): NativeScriptSource;
  set_required_signers(key_hashes: Ed25519KeyHashes): void;
  get_ref_script_size(): number | undefined;
}

export class NativeScripts {
  free(): void;
  static new(): NativeScripts;
  len(): number;
  get(index: number): NativeScript;
  add(elem: NativeScript): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): NativeScripts;
  to_hex(): string;
  static from_hex(hex_str: string): NativeScripts;
  static from_json(json: string): NativeScripts;
}

export class NetworkId {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): NetworkId;
  to_hex(): string;
  static from_hex(hex_str: string): NetworkId;
  static from_json(json: string): NetworkId;
  static testnet(): NetworkId;
  static mainnet(): NetworkId;
  kind(): NetworkIdKind;
}

export class NetworkInfo {
  free(): void;
  static new(network_id: number, protocol_magic: number): NetworkInfo;
  network_id(): number;
  protocol_magic(): number;
  static testnet_preview(): NetworkInfo;
  static testnet_preprod(): NetworkInfo;
  static mainnet(): NetworkInfo;
}

export class NewConstitutionAction {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): NewConstitutionAction;
  to_hex(): string;
  static from_hex(hex_str: string): NewConstitutionAction;
  static from_json(json: string): NewConstitutionAction;
  gov_action_id(): GovernanceActionId | undefined;
  constitution(): Constitution;
  static new(constitution: Constitution): NewConstitutionAction;
  static new_with_action_id(gov_action_id: GovernanceActionId, constitution: Constitution): NewConstitutionAction;
  has_script_hash(): boolean;
}

export class NoConfidenceAction {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): NoConfidenceAction;
  to_hex(): string;
  static from_hex(hex_str: string): NoConfidenceAction;
  static from_json(json: string): NoConfidenceAction;
  gov_action_id(): GovernanceActionId | undefined;
  static new(): NoConfidenceAction;
  static new_with_action_id(gov_action_id: GovernanceActionId): NoConfidenceAction;
}

export class Nonce {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Nonce;
  to_hex(): string;
  static from_hex(hex_str: string): Nonce;
  static from_json(json: string): Nonce;
  static new_identity(): Nonce;
  static new_from_hash(hash: Uint8Array): Nonce;
  get_hash(): Uint8Array | undefined;
}

export class OperationalCert {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): OperationalCert;
  to_hex(): string;
  static from_hex(hex_str: string): OperationalCert;
  static from_json(json: string): OperationalCert;
  hot_vkey(): KESVKey;
  sequence_number(): number;
  kes_period(): number;
  sigma(): Ed25519Signature;
  static new(hot_vkey: KESVKey, sequence_number: number, kes_period: number, sigma: Ed25519Signature): OperationalCert;
}

export class OutputDatum {
  free(): void;
  static new_data_hash(data_hash: DataHash): OutputDatum;
  static new_data(data: PlutusData): OutputDatum;
  data_hash(): DataHash | undefined;
  data(): PlutusData | undefined;
}

export class ParameterChangeAction {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): ParameterChangeAction;
  to_hex(): string;
  static from_hex(hex_str: string): ParameterChangeAction;
  static from_json(json: string): ParameterChangeAction;
  gov_action_id(): GovernanceActionId | undefined;
  protocol_param_updates(): ProtocolParamUpdate;
  policy_hash(): ScriptHash | undefined;
  static new(protocol_param_updates: ProtocolParamUpdate): ParameterChangeAction;
  static new_with_action_id(gov_action_id: GovernanceActionId, protocol_param_updates: ProtocolParamUpdate): ParameterChangeAction;
  static new_with_policy_hash(protocol_param_updates: ProtocolParamUpdate, policy_hash: ScriptHash): ParameterChangeAction;
  static new_with_policy_hash_and_action_id(gov_action_id: GovernanceActionId, protocol_param_updates: ProtocolParamUpdate, policy_hash: ScriptHash): ParameterChangeAction;
}

export class PlutusData {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): PlutusData;
  to_hex(): string;
  static from_hex(hex_str: string): PlutusData;
  static new_constr_plutus_data(constr_plutus_data: ConstrPlutusData): PlutusData;
  static new_empty_constr_plutus_data(alternative: BigNum): PlutusData;
  static new_single_value_constr_plutus_data(alternative: BigNum, plutus_data: PlutusData): PlutusData;
  static new_map(map: PlutusMap): PlutusData;
  static new_list(list: PlutusList): PlutusData;
  static new_integer(integer: BigInt): PlutusData;
  static new_bytes(bytes: Uint8Array): PlutusData;
  kind(): PlutusDataKind;
  as_constr_plutus_data(): ConstrPlutusData | undefined;
  as_map(): PlutusMap | undefined;
  as_list(): PlutusList | undefined;
  as_integer(): BigInt | undefined;
  as_bytes(): Uint8Array | undefined;
  to_json(schema: PlutusDatumSchema): string;
  static from_json(json: string, schema: PlutusDatumSchema): PlutusData;
  static from_address(address: Address): PlutusData;
}

export class PlutusList {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): PlutusList;
  to_hex(): string;
  static from_hex(hex_str: string): PlutusList;
  static new(): PlutusList;
  len(): number;
  get(index: number): PlutusData;
  add(elem: PlutusData): void;
}

export class PlutusMap {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): PlutusMap;
  to_hex(): string;
  static from_hex(hex_str: string): PlutusMap;
  static new(): PlutusMap;
  len(): number;
  insert(key: PlutusData, values: PlutusMapValues): PlutusMapValues | undefined;
  get(key: PlutusData): PlutusMapValues | undefined;
  keys(): PlutusList;
}

export class PlutusMapValues {
  free(): void;
  static new(): PlutusMapValues;
  len(): number;
  get(index: number): PlutusData | undefined;
  add(elem: PlutusData): void;
}

export class PlutusScript {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): PlutusScript;
  to_hex(): string;
  static from_hex(hex_str: string): PlutusScript;
  static new(bytes: Uint8Array): PlutusScript;
  static new_v2(bytes: Uint8Array): PlutusScript;
  static new_v3(bytes: Uint8Array): PlutusScript;
  static new_with_version(bytes: Uint8Array, language: Language): PlutusScript;
  bytes(): Uint8Array;
  static from_bytes_v2(bytes: Uint8Array): PlutusScript;
  static from_bytes_v3(bytes: Uint8Array): PlutusScript;
  static from_bytes_with_version(bytes: Uint8Array, language: Language): PlutusScript;
  static from_hex_with_version(hex_str: string, language: Language): PlutusScript;
  hash(): ScriptHash;
  language_version(): Language;
}

export class PlutusScriptSource {
  free(): void;
  static new(script: PlutusScript): PlutusScriptSource;
  static new_ref_input(script_hash: ScriptHash, input: TransactionInput, lang_ver: Language, script_size: number): PlutusScriptSource;
  set_required_signers(key_hashes: Ed25519KeyHashes): void;
  get_ref_script_size(): number | undefined;
}

export class PlutusScripts {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): PlutusScripts;
  to_hex(): string;
  static from_hex(hex_str: string): PlutusScripts;
  static from_json(json: string): PlutusScripts;
  static new(): PlutusScripts;
  len(): number;
  get(index: number): PlutusScript;
  add(elem: PlutusScript): void;
}

export class PlutusWitness {
  free(): void;
  static new(script: PlutusScript, datum: PlutusData, redeemer: Redeemer): PlutusWitness;
  static new_with_ref(script: PlutusScriptSource, datum: DatumSource, redeemer: Redeemer): PlutusWitness;
  static new_without_datum(script: PlutusScript, redeemer: Redeemer): PlutusWitness;
  static new_with_ref_without_datum(script: PlutusScriptSource, redeemer: Redeemer): PlutusWitness;
  script(): PlutusScript | undefined;
  datum(): PlutusData | undefined;
  redeemer(): Redeemer;
}

export class PlutusWitnesses {
  free(): void;
  static new(): PlutusWitnesses;
  len(): number;
  get(index: number): PlutusWitness;
  add(elem: PlutusWitness): void;
}

export class Pointer {
  free(): void;
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
  free(): void;
  static new(network: number, payment: Credential, stake: Pointer): PointerAddress;
  payment_cred(): Credential;
  stake_pointer(): Pointer;
  to_address(): Address;
  static from_address(addr: Address): PointerAddress | undefined;
  network_id(): number;
}

export class PoolMetadata {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): PoolMetadata;
  to_hex(): string;
  static from_hex(hex_str: string): PoolMetadata;
  static from_json(json: string): PoolMetadata;
  url(): URL;
  pool_metadata_hash(): PoolMetadataHash;
  static new(url: URL, pool_metadata_hash: PoolMetadataHash): PoolMetadata;
}

export class PoolMetadataHash {
  free(): void;
  static from_bytes(bytes: Uint8Array): PoolMetadataHash;
  to_bytes(): Uint8Array;
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): PoolMetadataHash;
  to_hex(): string;
  static from_hex(hex: string): PoolMetadataHash;
}

export class PoolParams {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): PoolParams;
  to_hex(): string;
  static from_hex(hex_str: string): PoolParams;
  static from_json(json: string): PoolParams;
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
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): PoolRegistration;
  to_hex(): string;
  static from_hex(hex_str: string): PoolRegistration;
  static from_json(json: string): PoolRegistration;
  pool_params(): PoolParams;
  static new(pool_params: PoolParams): PoolRegistration;
}

export class PoolRetirement {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): PoolRetirement;
  to_hex(): string;
  static from_hex(hex_str: string): PoolRetirement;
  static from_json(json: string): PoolRetirement;
  pool_keyhash(): Ed25519KeyHash;
  epoch(): number;
  static new(pool_keyhash: Ed25519KeyHash, epoch: number): PoolRetirement;
}

export class PoolVotingThresholds {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): PoolVotingThresholds;
  to_hex(): string;
  static from_hex(hex_str: string): PoolVotingThresholds;
  static from_json(json: string): PoolVotingThresholds;
  static new(motion_no_confidence: UnitInterval, committee_normal: UnitInterval, committee_no_confidence: UnitInterval, hard_fork_initiation: UnitInterval, security_relevant_threshold: UnitInterval): PoolVotingThresholds;
  motion_no_confidence(): UnitInterval;
  committee_normal(): UnitInterval;
  committee_no_confidence(): UnitInterval;
  hard_fork_initiation(): UnitInterval;
  security_relevant_threshold(): UnitInterval;
}

export class PrivateKey {
  free(): void;
  static from_hex(hex_str: string): PrivateKey;
  to_hex(): string;
  sign(message: Uint8Array): Ed25519Signature;
  static from_normal_bytes(bytes: Uint8Array): PrivateKey;
  static from_extended_bytes(bytes: Uint8Array): PrivateKey;
  as_bytes(): Uint8Array;
  to_bech32(): string;
  static from_bech32(bech32_str: string): PrivateKey;
  static generate_ed25519extended(): PrivateKey;
  static generate_ed25519(): PrivateKey;
  to_public(): PublicKey;
}

export class ProposedProtocolParameterUpdates {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): ProposedProtocolParameterUpdates;
  to_hex(): string;
  static from_hex(hex_str: string): ProposedProtocolParameterUpdates;
  static from_json(json: string): ProposedProtocolParameterUpdates;
  static new(): ProposedProtocolParameterUpdates;
  len(): number;
  insert(key: GenesisHash, value: ProtocolParamUpdate): ProtocolParamUpdate | undefined;
  get(key: GenesisHash): ProtocolParamUpdate | undefined;
  keys(): GenesisHashes;
}

export class ProtocolParamUpdate {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): ProtocolParamUpdate;
  to_hex(): string;
  static from_hex(hex_str: string): ProtocolParamUpdate;
  static from_json(json: string): ProtocolParamUpdate;
  set_minfee_a(minfee_a: BigNum): void;
  minfee_a(): BigNum | undefined;
  set_minfee_b(minfee_b: BigNum): void;
  minfee_b(): BigNum | undefined;
  set_max_block_body_size(max_block_body_size: number): void;
  max_block_body_size(): number | undefined;
  set_max_tx_size(max_tx_size: number): void;
  max_tx_size(): number | undefined;
  set_max_block_header_size(max_block_header_size: number): void;
  max_block_header_size(): number | undefined;
  set_key_deposit(key_deposit: BigNum): void;
  key_deposit(): BigNum | undefined;
  set_pool_deposit(pool_deposit: BigNum): void;
  pool_deposit(): BigNum | undefined;
  set_max_epoch(max_epoch: number): void;
  max_epoch(): number | undefined;
  set_n_opt(n_opt: number): void;
  n_opt(): number | undefined;
  set_pool_pledge_influence(pool_pledge_influence: UnitInterval): void;
  pool_pledge_influence(): UnitInterval | undefined;
  set_expansion_rate(expansion_rate: UnitInterval): void;
  expansion_rate(): UnitInterval | undefined;
  set_treasury_growth_rate(treasury_growth_rate: UnitInterval): void;
  treasury_growth_rate(): UnitInterval | undefined;
  d(): UnitInterval | undefined;
  extra_entropy(): Nonce | undefined;
  set_protocol_version(protocol_version: ProtocolVersion): void;
  protocol_version(): ProtocolVersion | undefined;
  set_min_pool_cost(min_pool_cost: BigNum): void;
  min_pool_cost(): BigNum | undefined;
  set_ada_per_utxo_byte(ada_per_utxo_byte: BigNum): void;
  ada_per_utxo_byte(): BigNum | undefined;
  set_cost_models(cost_models: Costmdls): void;
  cost_models(): Costmdls | undefined;
  set_execution_costs(execution_costs: ExUnitPrices): void;
  execution_costs(): ExUnitPrices | undefined;
  set_max_tx_ex_units(max_tx_ex_units: ExUnits): void;
  max_tx_ex_units(): ExUnits | undefined;
  set_max_block_ex_units(max_block_ex_units: ExUnits): void;
  max_block_ex_units(): ExUnits | undefined;
  set_max_value_size(max_value_size: number): void;
  max_value_size(): number | undefined;
  set_collateral_percentage(collateral_percentage: number): void;
  collateral_percentage(): number | undefined;
  set_max_collateral_inputs(max_collateral_inputs: number): void;
  max_collateral_inputs(): number | undefined;
  set_pool_voting_thresholds(pool_voting_thresholds: PoolVotingThresholds): void;
  pool_voting_thresholds(): PoolVotingThresholds | undefined;
  set_drep_voting_thresholds(drep_voting_thresholds: DRepVotingThresholds): void;
  drep_voting_thresholds(): DRepVotingThresholds | undefined;
  set_min_committee_size(min_committee_size: number): void;
  min_committee_size(): number | undefined;
  set_committee_term_limit(committee_term_limit: number): void;
  committee_term_limit(): number | undefined;
  set_governance_action_validity_period(governance_action_validity_period: number): void;
  governance_action_validity_period(): number | undefined;
  set_governance_action_deposit(governance_action_deposit: BigNum): void;
  governance_action_deposit(): BigNum | undefined;
  set_drep_deposit(drep_deposit: BigNum): void;
  drep_deposit(): BigNum | undefined;
  set_drep_inactivity_period(drep_inactivity_period: number): void;
  drep_inactivity_period(): number | undefined;
  set_ref_script_coins_per_byte(ref_script_coins_per_byte: UnitInterval): void;
  ref_script_coins_per_byte(): UnitInterval | undefined;
  static new(): ProtocolParamUpdate;
}

export class ProtocolVersion {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): ProtocolVersion;
  to_hex(): string;
  static from_hex(hex_str: string): ProtocolVersion;
  static from_json(json: string): ProtocolVersion;
  major(): number;
  minor(): number;
  static new(major: number, minor: number): ProtocolVersion;
}

export class PublicKey {
  free(): void;
  static from_hex(hex_str: string): PublicKey;
  to_hex(): string;
  hash(): Ed25519KeyHash;
  verify(data: Uint8Array, signature: Ed25519Signature): boolean;
  static from_bytes(bytes: Uint8Array): PublicKey;
  as_bytes(): Uint8Array;
  to_bech32(): string;
  static from_bech32(bech32_str: string): PublicKey;
}

export class PublicKeys {
  free(): void;
  constructor();
  size(): number;
  get(index: number): PublicKey;
  add(key: PublicKey): void;
}

export class Redeemer {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Redeemer;
  to_hex(): string;
  static from_hex(hex_str: string): Redeemer;
  static from_json(json: string): Redeemer;
  tag(): RedeemerTag;
  index(): BigNum;
  data(): PlutusData;
  ex_units(): ExUnits;
  static new(tag: RedeemerTag, index: BigNum, data: PlutusData, ex_units: ExUnits): Redeemer;
}

export class RedeemerTag {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): RedeemerTag;
  to_hex(): string;
  static from_hex(hex_str: string): RedeemerTag;
  static from_json(json: string): RedeemerTag;
  static new_spend(): RedeemerTag;
  static new_mint(): RedeemerTag;
  static new_cert(): RedeemerTag;
  static new_reward(): RedeemerTag;
  static new_vote(): RedeemerTag;
  static new_voting_proposal(): RedeemerTag;
  kind(): RedeemerTagKind;
}

export class Redeemers {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Redeemers;
  to_hex(): string;
  static from_hex(hex_str: string): Redeemers;
  static from_json(json: string): Redeemers;
  static new(): Redeemers;
  len(): number;
  get(index: number): Redeemer;
  add(elem: Redeemer): void;
  total_ex_units(): ExUnits;
}

export class Relay {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Relay;
  to_hex(): string;
  static from_hex(hex_str: string): Relay;
  static from_json(json: string): Relay;
  static new_single_host_addr(single_host_addr: SingleHostAddr): Relay;
  static new_single_host_name(single_host_name: SingleHostName): Relay;
  static new_multi_host_name(multi_host_name: MultiHostName): Relay;
  kind(): RelayKind;
  as_single_host_addr(): SingleHostAddr | undefined;
  as_single_host_name(): SingleHostName | undefined;
  as_multi_host_name(): MultiHostName | undefined;
}

export class Relays {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Relays;
  to_hex(): string;
  static from_hex(hex_str: string): Relays;
  static from_json(json: string): Relays;
  static new(): Relays;
  len(): number;
  get(index: number): Relay;
  add(elem: Relay): void;
}

export class RewardAddress {
  free(): void;
  static new(network: number, payment: Credential): RewardAddress;
  payment_cred(): Credential;
  to_address(): Address;
  static from_address(addr: Address): RewardAddress | undefined;
  network_id(): number;
}

export class RewardAddresses {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): RewardAddresses;
  to_hex(): string;
  static from_hex(hex_str: string): RewardAddresses;
  static from_json(json: string): RewardAddresses;
  static new(): RewardAddresses;
  len(): number;
  get(index: number): RewardAddress;
  add(elem: RewardAddress): void;
}

export class ScriptAll {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): ScriptAll;
  to_hex(): string;
  static from_hex(hex_str: string): ScriptAll;
  static from_json(json: string): ScriptAll;
  native_scripts(): NativeScripts;
  static new(native_scripts: NativeScripts): ScriptAll;
}

export class ScriptAny {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): ScriptAny;
  to_hex(): string;
  static from_hex(hex_str: string): ScriptAny;
  static from_json(json: string): ScriptAny;
  native_scripts(): NativeScripts;
  static new(native_scripts: NativeScripts): ScriptAny;
}

export class ScriptDataHash {
  free(): void;
  static from_bytes(bytes: Uint8Array): ScriptDataHash;
  to_bytes(): Uint8Array;
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): ScriptDataHash;
  to_hex(): string;
  static from_hex(hex: string): ScriptDataHash;
}

export class ScriptHash {
  free(): void;
  static from_bytes(bytes: Uint8Array): ScriptHash;
  to_bytes(): Uint8Array;
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): ScriptHash;
  to_hex(): string;
  static from_hex(hex: string): ScriptHash;
}

export class ScriptHashes {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): ScriptHashes;
  to_hex(): string;
  static from_hex(hex_str: string): ScriptHashes;
  static from_json(json: string): ScriptHashes;
  static new(): ScriptHashes;
  len(): number;
  get(index: number): ScriptHash;
  add(elem: ScriptHash): void;
}

export class ScriptNOfK {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): ScriptNOfK;
  to_hex(): string;
  static from_hex(hex_str: string): ScriptNOfK;
  static from_json(json: string): ScriptNOfK;
  n(): number;
  native_scripts(): NativeScripts;
  static new(n: number, native_scripts: NativeScripts): ScriptNOfK;
}

export class ScriptPubkey {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): ScriptPubkey;
  to_hex(): string;
  static from_hex(hex_str: string): ScriptPubkey;
  static from_json(json: string): ScriptPubkey;
  addr_keyhash(): Ed25519KeyHash;
  static new(addr_keyhash: Ed25519KeyHash): ScriptPubkey;
}

export class ScriptRef {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): ScriptRef;
  to_hex(): string;
  static from_hex(hex_str: string): ScriptRef;
  static from_json(json: string): ScriptRef;
  static new_native_script(native_script: NativeScript): ScriptRef;
  static new_plutus_script(plutus_script: PlutusScript): ScriptRef;
  is_native_script(): boolean;
  is_plutus_script(): boolean;
  native_script(): NativeScript | undefined;
  plutus_script(): PlutusScript | undefined;
  to_unwrapped_bytes(): Uint8Array;
}

export class SingleHostAddr {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): SingleHostAddr;
  to_hex(): string;
  static from_hex(hex_str: string): SingleHostAddr;
  static from_json(json: string): SingleHostAddr;
  port(): number | undefined;
  ipv4(): Ipv4 | undefined;
  ipv6(): Ipv6 | undefined;
  static new(port?: number, ipv4?: Ipv4, ipv6?: Ipv6): SingleHostAddr;
}

export class SingleHostName {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): SingleHostName;
  to_hex(): string;
  static from_hex(hex_str: string): SingleHostName;
  static from_json(json: string): SingleHostName;
  port(): number | undefined;
  dns_name(): DNSRecordAorAAAA;
  static new(port: number | undefined, dns_name: DNSRecordAorAAAA): SingleHostName;
}

export class StakeAndVoteDelegation {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): StakeAndVoteDelegation;
  to_hex(): string;
  static from_hex(hex_str: string): StakeAndVoteDelegation;
  static from_json(json: string): StakeAndVoteDelegation;
  stake_credential(): Credential;
  pool_keyhash(): Ed25519KeyHash;
  drep(): DRep;
  static new(stake_credential: Credential, pool_keyhash: Ed25519KeyHash, drep: DRep): StakeAndVoteDelegation;
  has_script_credentials(): boolean;
}

export class StakeDelegation {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): StakeDelegation;
  to_hex(): string;
  static from_hex(hex_str: string): StakeDelegation;
  static from_json(json: string): StakeDelegation;
  stake_credential(): Credential;
  pool_keyhash(): Ed25519KeyHash;
  static new(stake_credential: Credential, pool_keyhash: Ed25519KeyHash): StakeDelegation;
  has_script_credentials(): boolean;
}

export class StakeDeregistration {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): StakeDeregistration;
  to_hex(): string;
  static from_hex(hex_str: string): StakeDeregistration;
  static from_json(json: string): StakeDeregistration;
  stake_credential(): Credential;
  coin(): BigNum | undefined;
  static new(stake_credential: Credential): StakeDeregistration;
  static new_with_explicit_refund(stake_credential: Credential, coin: BigNum): StakeDeregistration;
  has_script_credentials(): boolean;
}

export class StakeRegistration {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): StakeRegistration;
  to_hex(): string;
  static from_hex(hex_str: string): StakeRegistration;
  static from_json(json: string): StakeRegistration;
  stake_credential(): Credential;
  coin(): BigNum | undefined;
  static new(stake_credential: Credential): StakeRegistration;
  static new_with_explicit_deposit(stake_credential: Credential, coin: BigNum): StakeRegistration;
  has_script_credentials(): boolean;
}

export class StakeRegistrationAndDelegation {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): StakeRegistrationAndDelegation;
  to_hex(): string;
  static from_hex(hex_str: string): StakeRegistrationAndDelegation;
  static from_json(json: string): StakeRegistrationAndDelegation;
  stake_credential(): Credential;
  pool_keyhash(): Ed25519KeyHash;
  coin(): BigNum;
  static new(stake_credential: Credential, pool_keyhash: Ed25519KeyHash, coin: BigNum): StakeRegistrationAndDelegation;
  has_script_credentials(): boolean;
}

export class StakeVoteRegistrationAndDelegation {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): StakeVoteRegistrationAndDelegation;
  to_hex(): string;
  static from_hex(hex_str: string): StakeVoteRegistrationAndDelegation;
  static from_json(json: string): StakeVoteRegistrationAndDelegation;
  stake_credential(): Credential;
  pool_keyhash(): Ed25519KeyHash;
  drep(): DRep;
  coin(): BigNum;
  static new(stake_credential: Credential, pool_keyhash: Ed25519KeyHash, drep: DRep, coin: BigNum): StakeVoteRegistrationAndDelegation;
  has_script_credentials(): boolean;
}

export class Strings {
  free(): void;
  static new(): Strings;
  len(): number;
  get(index: number): string;
  add(elem: string): void;
}

export class TimelockExpiry {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): TimelockExpiry;
  to_hex(): string;
  static from_hex(hex_str: string): TimelockExpiry;
  static from_json(json: string): TimelockExpiry;
  slot(): number;
  slot_bignum(): BigNum;
  static new(slot: number): TimelockExpiry;
  static new_timelockexpiry(slot: BigNum): TimelockExpiry;
}

export class TimelockStart {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): TimelockStart;
  to_hex(): string;
  static from_hex(hex_str: string): TimelockStart;
  static from_json(json: string): TimelockStart;
  slot(): number;
  slot_bignum(): BigNum;
  static new(slot: number): TimelockStart;
  static new_timelockstart(slot: BigNum): TimelockStart;
}

export class Transaction {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Transaction;
  to_hex(): string;
  static from_hex(hex_str: string): Transaction;
  static from_json(json: string): Transaction;
  body(): TransactionBody;
  witness_set(): TransactionWitnessSet;
  is_valid(): boolean;
  auxiliary_data(): AuxiliaryData | undefined;
  set_is_valid(valid: boolean): void;
  static new(body: TransactionBody, witness_set: TransactionWitnessSet, auxiliary_data?: AuxiliaryData): Transaction;
}

export class TransactionBatch {
  free(): void;
  len(): number;
  get(index: number): Transaction;
}

export class TransactionBatchList {
  free(): void;
  len(): number;
  get(index: number): TransactionBatch;
}

export class TransactionBodies {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): TransactionBodies;
  to_hex(): string;
  static from_hex(hex_str: string): TransactionBodies;
  static from_json(json: string): TransactionBodies;
  static new(): TransactionBodies;
  len(): number;
  get(index: number): TransactionBody;
  add(elem: TransactionBody): void;
}

export class TransactionBody {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): TransactionBody;
  to_hex(): string;
  static from_hex(hex_str: string): TransactionBody;
  static from_json(json: string): TransactionBody;
  inputs(): TransactionInputs;
  outputs(): TransactionOutputs;
  fee(): BigNum;
  ttl(): number | undefined;
  ttl_bignum(): BigNum | undefined;
  set_ttl(ttl: BigNum): void;
  remove_ttl(): void;
  set_certs(certs: Certificates): void;
  certs(): Certificates | undefined;
  set_withdrawals(withdrawals: Withdrawals): void;
  withdrawals(): Withdrawals | undefined;
  set_update(update: Update): void;
  update(): Update | undefined;
  set_auxiliary_data_hash(auxiliary_data_hash: AuxiliaryDataHash): void;
  auxiliary_data_hash(): AuxiliaryDataHash | undefined;
  set_validity_start_interval(validity_start_interval: number): void;
  set_validity_start_interval_bignum(validity_start_interval: BigNum): void;
  validity_start_interval_bignum(): BigNum | undefined;
  validity_start_interval(): number | undefined;
  set_mint(mint: Mint): void;
  mint(): Mint | undefined;
  set_reference_inputs(reference_inputs: TransactionInputs): void;
  reference_inputs(): TransactionInputs | undefined;
  set_script_data_hash(script_data_hash: ScriptDataHash): void;
  script_data_hash(): ScriptDataHash | undefined;
  set_collateral(collateral: TransactionInputs): void;
  collateral(): TransactionInputs | undefined;
  set_required_signers(required_signers: Ed25519KeyHashes): void;
  required_signers(): Ed25519KeyHashes | undefined;
  set_network_id(network_id: NetworkId): void;
  network_id(): NetworkId | undefined;
  set_collateral_return(collateral_return: TransactionOutput): void;
  collateral_return(): TransactionOutput | undefined;
  set_total_collateral(total_collateral: BigNum): void;
  total_collateral(): BigNum | undefined;
  set_voting_procedures(voting_procedures: VotingProcedures): void;
  voting_procedures(): VotingProcedures | undefined;
  set_voting_proposals(voting_proposals: VotingProposals): void;
  voting_proposals(): VotingProposals | undefined;
  set_donation(donation: BigNum): void;
  donation(): BigNum | undefined;
  set_current_treasury_value(current_treasury_value: BigNum): void;
  current_treasury_value(): BigNum | undefined;
  static new(inputs: TransactionInputs, outputs: TransactionOutputs, fee: BigNum, ttl?: number): TransactionBody;
  static new_tx_body(inputs: TransactionInputs, outputs: TransactionOutputs, fee: BigNum): TransactionBody;
}

export class TransactionHash {
  free(): void;
  static from_bytes(bytes: Uint8Array): TransactionHash;
  to_bytes(): Uint8Array;
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): TransactionHash;
  to_hex(): string;
  static from_hex(hex: string): TransactionHash;
}

export class TransactionInput {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): TransactionInput;
  to_hex(): string;
  static from_hex(hex_str: string): TransactionInput;
  static from_json(json: string): TransactionInput;
  transaction_id(): TransactionHash;
  index(): number;
  static new(transaction_id: TransactionHash, index: number): TransactionInput;
}

export class TransactionInputs {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): TransactionInputs;
  to_hex(): string;
  static from_hex(hex_str: string): TransactionInputs;
  static from_json(json: string): TransactionInputs;
  static new(): TransactionInputs;
  len(): number;
  get(index: number): TransactionInput;
  add(elem: TransactionInput): boolean;
  to_option(): TransactionInputs | undefined;
}

export class TransactionMetadatum {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): TransactionMetadatum;
  to_hex(): string;
  static from_hex(hex_str: string): TransactionMetadatum;
  static new_map(map: MetadataMap): TransactionMetadatum;
  static new_list(list: MetadataList): TransactionMetadatum;
  static new_int(int: Int): TransactionMetadatum;
  static new_bytes(bytes: Uint8Array): TransactionMetadatum;
  static new_text(text: string): TransactionMetadatum;
  kind(): TransactionMetadatumKind;
  as_map(): MetadataMap;
  as_list(): MetadataList;
  as_int(): Int;
  as_bytes(): Uint8Array;
  as_text(): string;
}

export class TransactionMetadatumLabels {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): TransactionMetadatumLabels;
  to_hex(): string;
  static from_hex(hex_str: string): TransactionMetadatumLabels;
  static new(): TransactionMetadatumLabels;
  len(): number;
  get(index: number): BigNum;
  add(elem: BigNum): void;
}

export class TransactionOutput {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): TransactionOutput;
  to_hex(): string;
  static from_hex(hex_str: string): TransactionOutput;
  static from_json(json: string): TransactionOutput;
  address(): Address;
  amount(): Value;
  data_hash(): DataHash | undefined;
  plutus_data(): PlutusData | undefined;
  script_ref(): ScriptRef | undefined;
  set_script_ref(script_ref: ScriptRef): void;
  set_plutus_data(data: PlutusData): void;
  set_data_hash(data_hash: DataHash): void;
  has_plutus_data(): boolean;
  has_data_hash(): boolean;
  has_script_ref(): boolean;
  static new(address: Address, amount: Value): TransactionOutput;
  serialization_format(): CborContainerType | undefined;
}

export class TransactionOutputs {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): TransactionOutputs;
  to_hex(): string;
  static from_hex(hex_str: string): TransactionOutputs;
  static from_json(json: string): TransactionOutputs;
  static new(): TransactionOutputs;
  len(): number;
  get(index: number): TransactionOutput;
  add(elem: TransactionOutput): void;
}

export class TransactionUnspentOutput {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): TransactionUnspentOutput;
  to_hex(): string;
  static from_hex(hex_str: string): TransactionUnspentOutput;
  static from_json(json: string): TransactionUnspentOutput;
  static new(input: TransactionInput, output: TransactionOutput): TransactionUnspentOutput;
  input(): TransactionInput;
  output(): TransactionOutput;
}

export class TransactionUnspentOutputs {
  free(): void;
  static from_json(json: string): TransactionUnspentOutputs;
  static new(): TransactionUnspentOutputs;
  len(): number;
  get(index: number): TransactionUnspentOutput;
  add(elem: TransactionUnspentOutput): void;
}

export class TransactionWitnessSet {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): TransactionWitnessSet;
  to_hex(): string;
  static from_hex(hex_str: string): TransactionWitnessSet;
  static from_json(json: string): TransactionWitnessSet;
  set_vkeys(vkeys: Vkeywitnesses): void;
  vkeys(): Vkeywitnesses | undefined;
  set_native_scripts(native_scripts: NativeScripts): void;
  native_scripts(): NativeScripts | undefined;
  set_bootstraps(bootstraps: BootstrapWitnesses): void;
  bootstraps(): BootstrapWitnesses | undefined;
  set_plutus_scripts(plutus_scripts: PlutusScripts): void;
  plutus_scripts(): PlutusScripts | undefined;
  set_plutus_data(plutus_data: PlutusList): void;
  plutus_data(): PlutusList | undefined;
  set_redeemers(redeemers: Redeemers): void;
  redeemers(): Redeemers | undefined;
  static new(): TransactionWitnessSet;
}

export class TransactionWitnessSets {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): TransactionWitnessSets;
  to_hex(): string;
  static from_hex(hex_str: string): TransactionWitnessSets;
  static from_json(json: string): TransactionWitnessSets;
  static new(): TransactionWitnessSets;
  len(): number;
  get(index: number): TransactionWitnessSet;
  add(elem: TransactionWitnessSet): void;
}

export class TreasuryWithdrawals {
  free(): void;
  static from_json(json: string): TreasuryWithdrawals;
  static new(): TreasuryWithdrawals;
  get(key: RewardAddress): BigNum | undefined;
  insert(key: RewardAddress, value: BigNum): void;
  keys(): RewardAddresses;
  len(): number;
}

export class TreasuryWithdrawalsAction {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): TreasuryWithdrawalsAction;
  to_hex(): string;
  static from_hex(hex_str: string): TreasuryWithdrawalsAction;
  static from_json(json: string): TreasuryWithdrawalsAction;
  withdrawals(): TreasuryWithdrawals;
  policy_hash(): ScriptHash | undefined;
  static new(withdrawals: TreasuryWithdrawals): TreasuryWithdrawalsAction;
  static new_with_policy_hash(withdrawals: TreasuryWithdrawals, policy_hash: ScriptHash): TreasuryWithdrawalsAction;
}

export class URL {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): URL;
  to_hex(): string;
  static from_hex(hex_str: string): URL;
  static from_json(json: string): URL;
  static new(url: string): URL;
  url(): string;
}

export class UnitInterval {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): UnitInterval;
  to_hex(): string;
  static from_hex(hex_str: string): UnitInterval;
  static from_json(json: string): UnitInterval;
  numerator(): BigNum;
  denominator(): BigNum;
  static new(numerator: BigNum, denominator: BigNum): UnitInterval;
}

export class Update {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Update;
  to_hex(): string;
  static from_hex(hex_str: string): Update;
  static from_json(json: string): Update;
  proposed_protocol_parameter_updates(): ProposedProtocolParameterUpdates;
  epoch(): number;
  static new(proposed_protocol_parameter_updates: ProposedProtocolParameterUpdates, epoch: number): Update;
}

export class UpdateCommitteeAction {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): UpdateCommitteeAction;
  to_hex(): string;
  static from_hex(hex_str: string): UpdateCommitteeAction;
  static from_json(json: string): UpdateCommitteeAction;
  gov_action_id(): GovernanceActionId | undefined;
  committee(): Committee;
  members_to_remove(): Credentials;
  static new(committee: Committee, members_to_remove: Credentials): UpdateCommitteeAction;
  static new_with_action_id(gov_action_id: GovernanceActionId, committee: Committee, members_to_remove: Credentials): UpdateCommitteeAction;
}

export class VRFCert {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): VRFCert;
  to_hex(): string;
  static from_hex(hex_str: string): VRFCert;
  static from_json(json: string): VRFCert;
  output(): Uint8Array;
  proof(): Uint8Array;
  static new(output: Uint8Array, proof: Uint8Array): VRFCert;
}

export class VRFKeyHash {
  free(): void;
  static from_bytes(bytes: Uint8Array): VRFKeyHash;
  to_bytes(): Uint8Array;
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): VRFKeyHash;
  to_hex(): string;
  static from_hex(hex: string): VRFKeyHash;
}

export class VRFVKey {
  free(): void;
  static from_bytes(bytes: Uint8Array): VRFVKey;
  to_bytes(): Uint8Array;
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): VRFVKey;
  to_hex(): string;
  static from_hex(hex: string): VRFVKey;
}

export class Value {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Value;
  to_hex(): string;
  static from_hex(hex_str: string): Value;
  static from_json(json: string): Value;
  static new(coin: BigNum): Value;
  static new_from_assets(multiasset: MultiAsset): Value;
  static new_with_assets(coin: BigNum, multiasset: MultiAsset): Value;
  static zero(): Value;
  is_zero(): boolean;
  coin(): BigNum;
  set_coin(coin: BigNum): void;
  multiasset(): MultiAsset | undefined;
  set_multiasset(multiasset: MultiAsset): void;
  checked_add(rhs: Value): Value;
  checked_sub(rhs_value: Value): Value;
  clamped_sub(rhs_value: Value): Value;
  compare(rhs_value: Value): number | undefined;
}

export class VersionedBlock {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): VersionedBlock;
  to_hex(): string;
  static from_hex(hex_str: string): VersionedBlock;
  static from_json(json: string): VersionedBlock;
  static new(block: Block, era_code: number): VersionedBlock;
  block(): Block;
  era(): BlockEra;
}

export class Vkey {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Vkey;
  to_hex(): string;
  static from_hex(hex_str: string): Vkey;
  static from_json(json: string): Vkey;
  static new(pk: PublicKey): Vkey;
  public_key(): PublicKey;
}

export class Vkeys {
  free(): void;
  static new(): Vkeys;
  len(): number;
  get(index: number): Vkey;
  add(elem: Vkey): void;
}

export class Vkeywitness {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Vkeywitness;
  to_hex(): string;
  static from_hex(hex_str: string): Vkeywitness;
  static from_json(json: string): Vkeywitness;
  static new(vkey: Vkey, signature: Ed25519Signature): Vkeywitness;
  vkey(): Vkey;
  signature(): Ed25519Signature;
}

export class Vkeywitnesses {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Vkeywitnesses;
  to_hex(): string;
  static from_hex(hex_str: string): Vkeywitnesses;
  static from_json(json: string): Vkeywitnesses;
  static new(): Vkeywitnesses;
  len(): number;
  get(index: number): Vkeywitness;
  add(elem: Vkeywitness): boolean;
}

export class VoteDelegation {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): VoteDelegation;
  to_hex(): string;
  static from_hex(hex_str: string): VoteDelegation;
  static from_json(json: string): VoteDelegation;
  stake_credential(): Credential;
  drep(): DRep;
  static new(stake_credential: Credential, drep: DRep): VoteDelegation;
  has_script_credentials(): boolean;
}

export class VoteRegistrationAndDelegation {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): VoteRegistrationAndDelegation;
  to_hex(): string;
  static from_hex(hex_str: string): VoteRegistrationAndDelegation;
  static from_json(json: string): VoteRegistrationAndDelegation;
  stake_credential(): Credential;
  drep(): DRep;
  coin(): BigNum;
  static new(stake_credential: Credential, drep: DRep, coin: BigNum): VoteRegistrationAndDelegation;
  has_script_credentials(): boolean;
}

export class Voter {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Voter;
  to_hex(): string;
  static from_hex(hex_str: string): Voter;
  static from_json(json: string): Voter;
  static new_constitutional_committee_hot_credential(cred: Credential): Voter;
  static new_drep_credential(cred: Credential): Voter;
  static new_stake_pool_key_hash(key_hash: Ed25519KeyHash): Voter;
  kind(): VoterKind;
  to_constitutional_committee_hot_credential(): Credential | undefined;
  to_drep_credential(): Credential | undefined;
  to_stake_pool_key_hash(): Ed25519KeyHash | undefined;
  has_script_credentials(): boolean;
  to_key_hash(): Ed25519KeyHash | undefined;
}

export class Voters {
  free(): void;
  static from_json(json: string): Voters;
  static new(): Voters;
  add(voter: Voter): void;
  get(index: number): Voter | undefined;
  len(): number;
}

export class VotingProcedure {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): VotingProcedure;
  to_hex(): string;
  static from_hex(hex_str: string): VotingProcedure;
  static from_json(json: string): VotingProcedure;
  static new(vote: VoteKind): VotingProcedure;
  static new_with_anchor(vote: VoteKind, anchor: Anchor): VotingProcedure;
  vote_kind(): VoteKind;
  anchor(): Anchor | undefined;
}

export class VotingProcedures {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): VotingProcedures;
  to_hex(): string;
  static from_hex(hex_str: string): VotingProcedures;
  static from_json(json: string): VotingProcedures;
  static new(): VotingProcedures;
  insert(voter: Voter, governance_action_id: GovernanceActionId, voting_procedure: VotingProcedure): void;
  get(voter: Voter, governance_action_id: GovernanceActionId): VotingProcedure | undefined;
  get_voters(): Voters;
  get_governance_action_ids_by_voter(voter: Voter): GovernanceActionIds;
}

export class VotingProposal {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): VotingProposal;
  to_hex(): string;
  static from_hex(hex_str: string): VotingProposal;
  static from_json(json: string): VotingProposal;
  governance_action(): GovernanceAction;
  anchor(): Anchor;
  reward_account(): RewardAddress;
  deposit(): BigNum;
  static new(governance_action: GovernanceAction, anchor: Anchor, reward_account: RewardAddress, deposit: BigNum): VotingProposal;
}

export class VotingProposals {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): VotingProposals;
  to_hex(): string;
  static from_hex(hex_str: string): VotingProposals;
  static from_json(json: string): VotingProposals;
  static new(): VotingProposals;
  len(): number;
  get(index: number): VotingProposal;
  add(proposal: VotingProposal): boolean;
}

export class Withdrawals {
  free(): void;
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): Withdrawals;
  to_hex(): string;
  static from_hex(hex_str: string): Withdrawals;
  static from_json(json: string): Withdrawals;
  static new(): Withdrawals;
  len(): number;
  insert(key: RewardAddress, value: BigNum): BigNum | undefined;
  get(key: RewardAddress): BigNum | undefined;
  keys(): RewardAddresses;
}















