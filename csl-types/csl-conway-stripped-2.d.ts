export enum ScriptHashNamespace {
  NativeScript = 0,
  PlutusScript = 1,
  PlutusScriptV2 = 2,
  PlutusScriptV3 = 3,
}
export enum PlutusDatumSchema {
  BasicConversions = 0,
  DetailedSchema = 1,
}
export enum MIRPot {
  Reserves = 0,
  Treasury = 1,
}
export enum MIRKind {
  ToOtherPot = 0,
  ToStakeCredentials = 1,
}
export enum LanguageKind {
  PlutusV1 = 0,
  PlutusV2 = 1,
  PlutusV3 = 2,
}
export enum CoinSelectionStrategyCIP2 {
  LargestFirst = 0,
  RandomImprove = 1,
  LargestFirstMultiAsset = 2,
  RandomImproveMultiAsset = 3,
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
export enum AddressKind {
  Base = 0,
  Pointer = 1,
  Enterprise = 2,
  Reward = 3,
  Byron = 4,
  Malformed = 5,
}
export enum DRepKind {
  KeyHash = 0,
  ScriptHash = 1,
  AlwaysAbstain = 2,
  AlwaysNoConfidence = 3,
}
export enum NetworkIdKind {
  Testnet = 0,
  Mainnet = 1,
}
export enum MetadataJsonSchema {
  NoConversions = 0,
  BasicConversions = 1,
  DetailedSchema = 2,
}
export enum TransactionMetadatumKind {
  MetadataMap = 0,
  MetadataList = 1,
  Int = 2,
  Bytes = 3,
  Text = 4,
}
export enum VoterKind {
  ConstitutionalCommitteeHotKeyHash = 0,
  ConstitutionalCommitteeHotScriptHash = 1,
  DRepKeyHash = 2,
  DRepScriptHash = 3,
  StakingPoolKeyHash = 4,
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
  DrepDeregistration = 9,
  DrepRegistration = 10,
  DrepUpdate = 11,
  StakeAndVoteDelegation = 12,
  StakeRegistrationAndDelegation = 13,
  StakeVoteRegistrationAndDelegation = 14,
  VoteDelegation = 15,
  VoteRegistrationAndDelegation = 16,
}
export enum PlutusDataKind {
  ConstrPlutusData = 0,
  Map = 1,
  List = 2,
  Integer = 3,
  Bytes = 4,
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
export enum NativeScriptKind {
  ScriptPubkey = 0,
  ScriptAll = 1,
  ScriptAny = 2,
  ScriptNOfK = 3,
  TimelockStart = 4,
  TimelockExpiry = 5,
}
export enum ScriptSchema {
  Wallet = 0,
  Node = 1,
}
export enum CredKind {
  Key = 0,
  Script = 1,
}
export enum CborContainerType {
  Array = 0,
  Map = 1,
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
export enum VoteKind {
  No = 0,
  Yes = 1,
  Abstain = 2,
}
export class Address {
  kind(): AddressKind;
  payment_cred(): Credential | undefined;
  is_malformed(): boolean;
  to_bech32(prefix?: string): string;
  static from_bech32(bech_str: string): Address;
  network_id(): number;
}
export class Anchor {
  url(): URL;
  anchor_data_hash(): AnchorDataHash;
  static new(anchor_url: URL, anchor_data_hash: AnchorDataHash): Anchor;
}
export class AnchorDataHash {
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): AnchorDataHash;
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
  set_metadata(metadata: GeneralTransactionMetadata): void;
  native_scripts(): NativeScripts | undefined;
  set_native_scripts(native_scripts: NativeScripts): void;
  plutus_scripts(): PlutusScripts | undefined;
  set_plutus_scripts(plutus_scripts: PlutusScripts): void;
  prefer_alonzo_format(): boolean;
  set_prefer_alonzo_format(prefer: boolean): void;
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
  static new(
    network: number,
    payment: Credential,
    stake: Credential,
  ): BaseAddress;
  payment_cred(): Credential;
  stake_cred(): Credential;
  to_address(): Address;
  static from_address(addr: Address): BaseAddress | undefined;
  network_id(): number;
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
  static from_bip39_entropy(
    entropy: Uint8Array,
    password: Uint8Array,
  ): Bip32PrivateKey;
  chaincode(): Uint8Array;
}
export class Bip32PublicKey {
  chaincode(): Uint8Array;
  to_bech32(): string;
  static from_bech32(bech32_str: string): Bip32PublicKey;
  as_bytes(): Uint8Array;
  to_raw_key(): PublicKey;
  derive(index: number): Bip32PublicKey;
}
export class Block {
  header(): Header;
  transaction_bodies(): TransactionBodies;
  transaction_witness_sets(): TransactionWitnessSets;
  auxiliary_data_set(): AuxiliaryDataSet;
  invalid_transactions(): Uint32Array;
  static new(
    header: Header,
    transaction_bodies: TransactionBodies,
    transaction_witness_sets: TransactionWitnessSets,
    auxiliary_data_set: AuxiliaryDataSet,
    invalid_transactions: Uint32Array,
  ): Block;
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
  static new(
    vkey: Vkey,
    signature: Ed25519Signature,
    chain_code: Uint8Array,
    attributes: Uint8Array,
  ): BootstrapWitness;
}
export class BootstrapWitnesses {
  static new(): BootstrapWitnesses;
  len(): number;
  get(index: number): BootstrapWitness;
  add(elem: BootstrapWitness): boolean;
}
export class ByronAddress {
  to_base58(): string;
  byron_protocol_magic(): number;
  attributes(): Uint8Array;
  network_id(): number;
  static from_base58(s: string): ByronAddress;
  static icarus_from_key(
    key: Bip32PublicKey,
    protocol_magic: number,
  ): ByronAddress;
  static is_valid(s: string): boolean;
  to_address(): Address;
  static from_address(addr: Address): ByronAddress | undefined;
}
export class Certificate {
  static new_stake_registration(
    stake_registration: StakeRegistration,
  ): Certificate;
  static new_stake_deregistration(
    stake_deregistration: StakeDeregistration,
  ): Certificate;
  static new_stake_delegation(stake_delegation: StakeDelegation): Certificate;
  static new_pool_registration(
    pool_registration: PoolRegistration,
  ): Certificate;
  static new_pool_retirement(pool_retirement: PoolRetirement): Certificate;
  static new_genesis_key_delegation(
    genesis_key_delegation: GenesisKeyDelegation,
  ): Certificate;
  static new_move_instantaneous_rewards_cert(
    move_instantaneous_rewards_cert: MoveInstantaneousRewardsCert,
  ): Certificate;
  static new_committee_hot_auth(
    committee_hot_auth: CommitteeHotAuth,
  ): Certificate;
  static new_committee_cold_resign(
    committee_cold_resign: CommitteeColdResign,
  ): Certificate;
  static new_drep_deregistration(
    drep_deregistration: DrepDeregistration,
  ): Certificate;
  static new_drep_registration(
    drep_registration: DrepRegistration,
  ): Certificate;
  static new_drep_update(drep_update: DrepUpdate): Certificate;
  static new_stake_and_vote_delegation(
    stake_and_vote_delegation: StakeAndVoteDelegation,
  ): Certificate;
  static new_stake_registration_and_delegation(
    stake_registration_and_delegation: StakeRegistrationAndDelegation,
  ): Certificate;
  static new_stake_vote_registration_and_delegation(
    stake_vote_registration_and_delegation: StakeVoteRegistrationAndDelegation,
  ): Certificate;
  static new_vote_delegation(vote_delegation: VoteDelegation): Certificate;
  static new_vote_registration_and_delegation(
    vote_registration_and_delegation: VoteRegistrationAndDelegation,
  ): Certificate;
  kind(): CertificateKind;
  as_stake_registration(): StakeRegistration | undefined;
  as_stake_deregistration(): StakeDeregistration | undefined;
  as_stake_delegation(): StakeDelegation | undefined;
  as_pool_registration(): PoolRegistration | undefined;
  as_pool_retirement(): PoolRetirement | undefined;
  as_genesis_key_delegation(): GenesisKeyDelegation | undefined;
  as_move_instantaneous_rewards_cert():
    | MoveInstantaneousRewardsCert
    | undefined;
  as_committee_hot_auth(): CommitteeHotAuth | undefined;
  as_committee_cold_resign(): CommitteeColdResign | undefined;
  as_drep_deregistration(): DrepDeregistration | undefined;
  as_drep_registration(): DrepRegistration | undefined;
  as_drep_update(): DrepUpdate | undefined;
  as_stake_and_vote_delegation(): StakeAndVoteDelegation | undefined;
  as_stake_registration_and_delegation():
    | StakeRegistrationAndDelegation
    | undefined;
  as_stake_vote_registration_and_delegation():
    | StakeVoteRegistrationAndDelegation
    | undefined;
  as_vote_delegation(): VoteDelegation | undefined;
  as_vote_registration_and_delegation():
    | VoteRegistrationAndDelegation
    | undefined;
  has_required_script_witness(): boolean;
}
export class Certificates {
  static new(): Certificates;
  len(): number;
  get(index: number): Certificate;
  add(elem: Certificate): boolean;
}
export class ChangeConfig {
  static new(address: Address): ChangeConfig;
  change_address(address: Address): ChangeConfig;
  change_plutus_data(plutus_data: OutputDatum): ChangeConfig;
  change_script_ref(script_ref: ScriptRef): ChangeConfig;
}
export class Committee {
  static new(quorum_threshold: UnitInterval): Committee;
  members_keys(): Credentials;
  quorum_threshold(): UnitInterval;
  add_member(committee_cold_credential: Credential, epoch: number): void;
  get_member_epoch(committee_cold_credential: Credential): number | undefined;
}
export class CommitteeColdResign {
  committee_cold_key(): Credential;
  anchor(): Anchor | undefined;
  static new(committee_cold_key: Credential): CommitteeColdResign;
  static new_with_anchor(
    committee_cold_key: Credential,
    anchor: Anchor,
  ): CommitteeColdResign;
  has_script_credentials(): boolean;
}
export class CommitteeHotAuth {
  committee_cold_key(): Credential;
  committee_hot_key(): Credential;
  static new(
    committee_cold_key: Credential,
    committee_hot_key: Credential,
  ): CommitteeHotAuth;
  has_script_credentials(): boolean;
}
export class Constitution {
  anchor(): Anchor;
  script_hash(): ScriptHash | undefined;
  static new(anchor: Anchor): Constitution;
  static new_with_script_hash(
    anchor: Anchor,
    script_hash: ScriptHash,
  ): Constitution;
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
export class Credential {
  static from_keyhash(hash: Ed25519KeyHash): Credential;
  static from_scripthash(hash: ScriptHash): Credential;
  to_keyhash(): Ed25519KeyHash | undefined;
  to_scripthash(): ScriptHash | undefined;
  kind(): CredKind;
  has_script_hash(): boolean;
}
export class Credentials {
  static new(): Credentials;
  len(): number;
  get(index: number): Credential;
  add(elem: Credential): boolean;
}
export class DNSRecordAorAAAA {
  static new(dns_name: string): DNSRecordAorAAAA;
  record(): string;
}
export class DNSRecordSRV {
  static new(dns_name: string): DNSRecordSRV;
  record(): string;
}
export class DRep {
  static new_key_hash(key_hash: Ed25519KeyHash): DRep;
  static new_script_hash(script_hash: ScriptHash): DRep;
  static new_always_abstain(): DRep;
  static new_always_no_confidence(): DRep;
  kind(): DRepKind;
  to_key_hash(): Ed25519KeyHash | undefined;
  to_script_hash(): ScriptHash | undefined;
}
export class DataCost {
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
export class DrepDeregistration {
  voting_credential(): Credential;
  coin(): BigNum;
  static new(voting_credential: Credential, coin: BigNum): DrepDeregistration;
  has_script_credentials(): boolean;
}
export class DrepRegistration {
  voting_credential(): Credential;
  coin(): BigNum;
  anchor(): Anchor | undefined;
  static new(voting_credential: Credential, coin: BigNum): DrepRegistration;
  static new_with_anchor(
    voting_credential: Credential,
    coin: BigNum,
    anchor: Anchor,
  ): DrepRegistration;
  has_script_credentials(): boolean;
}
export class DrepUpdate {
  voting_credential(): Credential;
  anchor(): Anchor | undefined;
  static new(voting_credential: Credential): DrepUpdate;
  static new_with_anchor(
    voting_credential: Credential,
    anchor: Anchor,
  ): DrepUpdate;
  has_script_credentials(): boolean;
}
export class DrepVotingThresholds {
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
  ): DrepVotingThresholds;
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
export class Ed25519KeyHash {
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): Ed25519KeyHash;
}
export class Ed25519KeyHashes {
  static new(): Ed25519KeyHashes;
  len(): number;
  get(index: number): Ed25519KeyHash;
  add(elem: Ed25519KeyHash): boolean;
  contains(elem: Ed25519KeyHash): boolean;
  to_option(): Ed25519KeyHashes | undefined;
}
export class Ed25519Signature {
  to_bech32(): string;
  static from_bech32(bech32_str: string): Ed25519Signature;
}
export class EnterpriseAddress {
  static new(network: number, payment: Credential): EnterpriseAddress;
  payment_cred(): Credential;
  to_address(): Address;
  static from_address(addr: Address): EnterpriseAddress | undefined;
  network_id(): number;
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
  static new(
    raw_body: Uint8Array,
    raw_witness_set: Uint8Array,
    is_valid: boolean,
  ): FixedTransaction;
  static new_with_auxiliary(
    raw_body: Uint8Array,
    raw_witness_set: Uint8Array,
    raw_auxiliary_data: Uint8Array,
    is_valid: boolean,
  ): FixedTransaction;
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
}
export class GeneralTransactionMetadata {
  static new(): GeneralTransactionMetadata;
  len(): number;
  insert(
    key: BigNum,
    value: TransactionMetadatum,
  ): TransactionMetadatum | undefined;
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
  static new(
    genesishash: GenesisHash,
    genesis_delegate_hash: GenesisDelegateHash,
    vrf_keyhash: VRFKeyHash,
  ): GenesisKeyDelegation;
}
export class GovernanceAction {
  static new_parameter_change_action(
    parameter_change_action: ParameterChangeAction,
  ): GovernanceAction;
  static new_hard_fork_initiation_action(
    hard_fork_initiation_action: HardForkInitiationAction,
  ): GovernanceAction;
  static new_treasury_withdrawals_action(
    treasury_withdrawals_action: TreasuryWithdrawalsAction,
  ): GovernanceAction;
  static new_no_confidence_action(
    no_confidence_action: NoConfidenceAction,
  ): GovernanceAction;
  static new_new_committee_action(
    new_committee_action: UpdateCommitteeAction,
  ): GovernanceAction;
  static new_new_constitution_action(
    new_constitution_action: NewConstitutionAction,
  ): GovernanceAction;
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
  transaction_id(): TransactionHash;
  index(): number;
  static new(
    transaction_id: TransactionHash,
    index: number,
  ): GovernanceActionId;
}
export class GovernanceActionIds {
  static new(): GovernanceActionIds;
  add(governance_action_id: GovernanceActionId): void;
  get(index: number): GovernanceActionId | undefined;
  len(): number;
}
export class HardForkInitiationAction {
  gov_action_id(): GovernanceActionId | undefined;
  protocol_version(): ProtocolVersion;
  static new(protocol_version: ProtocolVersion): HardForkInitiationAction;
  static new_with_action_id(
    gov_action_id: GovernanceActionId,
    protocol_version: ProtocolVersion,
  ): HardForkInitiationAction;
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
  ): HeaderBody;
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
  ): HeaderBody;
}
export class InfoAction {
  static new(): InfoAction;
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
export class KESSignature {}
export class KESVKey {
  to_bech32(prefix: string): string;
  static from_bech32(bech_str: string): KESVKey;
}
export class Language {
  static new_plutus_v1(): Language;
  static new_plutus_v2(): Language;
  static new_plutus_v3(): Language;
  kind(): LanguageKind;
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
  insert(cred: Credential, delta: Int): Int | undefined;
  get(cred: Credential): Int | undefined;
  keys(): Credentials;
}
export class MalformedAddress {
  original_bytes(): Uint8Array;
  to_address(): Address;
  static from_address(addr: Address): MalformedAddress | undefined;
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
  insert(
    key: TransactionMetadatum,
    value: TransactionMetadatum,
  ): TransactionMetadatum | undefined;
  insert_str(
    key: string,
    value: TransactionMetadatum,
  ): TransactionMetadatum | undefined;
  insert_i32(
    key: number,
    value: TransactionMetadatum,
  ): TransactionMetadatum | undefined;
  get(key: TransactionMetadatum): TransactionMetadatum;
  get_str(key: string): TransactionMetadatum;
  get_i32(key: number): TransactionMetadatum;
  has(key: TransactionMetadatum): boolean;
  keys(): MetadataList;
}
export class Mint {
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
  static new(): MintAssets;
  static new_from_entry(key: AssetName, value: Int): MintAssets;
  len(): number;
  insert(key: AssetName, value: Int): Int | undefined;
  get(key: AssetName): Int | undefined;
  keys(): AssetNames;
}
export class MintWitness {
  static new_native_script(native_script: NativeScriptSource): MintWitness;
  static new_plutus_script(
    plutus_script: PlutusScriptSource,
    redeemer: Redeemer,
  ): MintWitness;
}
export class MintsAssets {
  static new(): MintsAssets;
  add(mint_assets: MintAssets): void;
  get(index: number): MintAssets | undefined;
  len(): number;
}
export class MoveInstantaneousReward {
  static new_to_other_pot(pot: MIRPot, amount: BigNum): MoveInstantaneousReward;
  static new_to_stake_creds(
    pot: MIRPot,
    amounts: MIRToStakeCredentials,
  ): MoveInstantaneousReward;
  pot(): MIRPot;
  kind(): MIRKind;
  as_to_other_pot(): BigNum | undefined;
  as_to_stake_creds(): MIRToStakeCredentials | undefined;
}
export class MoveInstantaneousRewardsCert {
  move_instantaneous_reward(): MoveInstantaneousReward;
  static new(
    move_instantaneous_reward: MoveInstantaneousReward,
  ): MoveInstantaneousRewardsCert;
}
export class MultiAsset {
  static new(): MultiAsset;
  len(): number;
  insert(policy_id: ScriptHash, assets: Assets): Assets | undefined;
  get(policy_id: ScriptHash): Assets | undefined;
  set_asset(
    policy_id: ScriptHash,
    asset_name: AssetName,
    value: BigNum,
  ): BigNum | undefined;
  get_asset(policy_id: ScriptHash, asset_name: AssetName): BigNum;
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
  static new(script: NativeScript): NativeScriptSource;
  static new_ref_input(
    script_hash: ScriptHash,
    input: TransactionInput,
  ): NativeScriptSource;
  set_required_signers(key_hashes: Ed25519KeyHashes): void;
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
  kind(): NetworkIdKind;
}
export class NetworkInfo {
  static new(network_id: number, protocol_magic: number): NetworkInfo;
  network_id(): number;
  protocol_magic(): number;
  static testnet_preview(): NetworkInfo;
  static testnet_preprod(): NetworkInfo;
  static mainnet(): NetworkInfo;
}
export class NewConstitutionAction {
  gov_action_id(): GovernanceActionId | undefined;
  constitution(): Constitution;
  static new(constitution: Constitution): NewConstitutionAction;
  static new_with_action_id(
    gov_action_id: GovernanceActionId,
    constitution: Constitution,
  ): NewConstitutionAction;
  has_script_hash(): boolean;
}
export class NoConfidenceAction {
  gov_action_id(): GovernanceActionId | undefined;
  static new(): NoConfidenceAction;
  static new_with_action_id(
    gov_action_id: GovernanceActionId,
  ): NoConfidenceAction;
}
export class Nonce {
  static new_identity(): Nonce;
  static new_from_hash(hash: Uint8Array): Nonce;
  get_hash(): Uint8Array | undefined;
}
export class OperationalCert {
  hot_vkey(): KESVKey;
  sequence_number(): number;
  kes_period(): number;
  sigma(): Ed25519Signature;
  static new(
    hot_vkey: KESVKey,
    sequence_number: number,
    kes_period: number,
    sigma: Ed25519Signature,
  ): OperationalCert;
}
export class OutputDatum {
  static new_data_hash(data_hash: DataHash): OutputDatum;
  static new_data(data: PlutusData): OutputDatum;
  data_hash(): DataHash | undefined;
  data(): PlutusData | undefined;
}
export class ParameterChangeAction {
  gov_action_id(): GovernanceActionId | undefined;
  protocol_param_updates(): ProtocolParamUpdate;
  policy_hash(): ScriptHash | undefined;
  static new(
    protocol_param_updates: ProtocolParamUpdate,
  ): ParameterChangeAction;
  static new_with_action_id(
    gov_action_id: GovernanceActionId,
    protocol_param_updates: ProtocolParamUpdate,
  ): ParameterChangeAction;
  static new_with_policy_hash(
    protocol_param_updates: ProtocolParamUpdate,
    policy_hash: ScriptHash,
  ): ParameterChangeAction;
  static new_with_policy_hash_and_action_id(
    gov_action_id: GovernanceActionId,
    protocol_param_updates: ProtocolParamUpdate,
    policy_hash: ScriptHash,
  ): ParameterChangeAction;
}
export class PlutusData {
  static new_constr_plutus_data(
    constr_plutus_data: ConstrPlutusData,
  ): PlutusData;
  static new_empty_constr_plutus_data(alternative: BigNum): PlutusData;
  static new_single_value_constr_plutus_data(
    alternative: BigNum,
    plutus_data: PlutusData,
  ): PlutusData;
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
  insert(key: PlutusData, values: PlutusMapValues): PlutusMapValues | undefined;
  get(key: PlutusData): PlutusMapValues | undefined;
  keys(): PlutusList;
}
export class PlutusMapValues {
  static new(): PlutusMapValues;
  len(): number;
  get(index: number): PlutusData | undefined;
  add(elem: PlutusData): void;
}
export class PlutusScript {
  static new(bytes: Uint8Array): PlutusScript;
  static new_v2(bytes: Uint8Array): PlutusScript;
  static new_v3(bytes: Uint8Array): PlutusScript;
  static new_with_version(bytes: Uint8Array, language: Language): PlutusScript;
  bytes(): Uint8Array;
  static from_bytes_v2(bytes: Uint8Array): PlutusScript;
  static from_bytes_v3(bytes: Uint8Array): PlutusScript;
  static from_bytes_with_version(
    bytes: Uint8Array,
    language: Language,
  ): PlutusScript;
  static from_hex_with_version(
    hex_str: string,
    language: Language,
  ): PlutusScript;
  hash(): ScriptHash;
  language_version(): Language;
}
export class PlutusScriptSource {
  static new(script: PlutusScript): PlutusScriptSource;
  static new_ref_input(
    script_hash: ScriptHash,
    input: TransactionInput,
    lang_ver: Language,
    script_size: number,
  ): PlutusScriptSource;
  set_required_signers(key_hashes: Ed25519KeyHashes): void;
  get_ref_script_size(): number | undefined;
}
export class PlutusScripts {
  static new(): PlutusScripts;
  len(): number;
  get(index: number): PlutusScript;
  add(elem: PlutusScript): void;
}
export class PlutusWitness {
  static new(
    script: PlutusScript,
    datum: PlutusData,
    redeemer: Redeemer,
  ): PlutusWitness;
  static new_with_ref(
    script: PlutusScriptSource,
    datum: DatumSource,
    redeemer: Redeemer,
  ): PlutusWitness;
  static new_without_datum(
    script: PlutusScript,
    redeemer: Redeemer,
  ): PlutusWitness;
  static new_with_ref_without_datum(
    script: PlutusScriptSource,
    redeemer: Redeemer,
  ): PlutusWitness;
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
  static new_pointer(
    slot: BigNum,
    tx_index: BigNum,
    cert_index: BigNum,
  ): Pointer;
  slot(): number;
  tx_index(): number;
  cert_index(): number;
  slot_bignum(): BigNum;
  tx_index_bignum(): BigNum;
  cert_index_bignum(): BigNum;
}
export class PointerAddress {
  static new(
    network: number,
    payment: Credential,
    stake: Pointer,
  ): PointerAddress;
  payment_cred(): Credential;
  stake_pointer(): Pointer;
  to_address(): Address;
  static from_address(addr: Address): PointerAddress | undefined;
  network_id(): number;
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
  static new(
    operator: Ed25519KeyHash,
    vrf_keyhash: VRFKeyHash,
    pledge: BigNum,
    cost: BigNum,
    margin: UnitInterval,
    reward_account: RewardAddress,
    pool_owners: Ed25519KeyHashes,
    relays: Relays,
    pool_metadata?: PoolMetadata,
  ): PoolParams;
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
export class PoolVotingThresholds {
  static new(
    motion_no_confidence: UnitInterval,
    committee_normal: UnitInterval,
    committee_no_confidence: UnitInterval,
    hard_fork_initiation: UnitInterval,
    security_relevant_threshold: UnitInterval,
  ): PoolVotingThresholds;
  motion_no_confidence(): UnitInterval;
  committee_normal(): UnitInterval;
  committee_no_confidence(): UnitInterval;
  hard_fork_initiation(): UnitInterval;
  security_relevant_threshold(): UnitInterval;
}
export class PrivateKey {
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
  static new(): ProposedProtocolParameterUpdates;
  len(): number;
  insert(
    key: GenesisHash,
    value: ProtocolParamUpdate,
  ): ProtocolParamUpdate | undefined;
  get(key: GenesisHash): ProtocolParamUpdate | undefined;
  keys(): GenesisHashes;
}
export class ProtocolParamUpdate {
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
  set_pool_voting_thresholds(
    pool_voting_thresholds: PoolVotingThresholds,
  ): void;
  pool_voting_thresholds(): PoolVotingThresholds | undefined;
  set_drep_voting_thresholds(
    drep_voting_thresholds: DrepVotingThresholds,
  ): void;
  drep_voting_thresholds(): DrepVotingThresholds | undefined;
  set_min_committee_size(min_committee_size: number): void;
  min_committee_size(): number | undefined;
  set_committee_term_limit(committee_term_limit: number): void;
  committee_term_limit(): number | undefined;
  set_governance_action_validity_period(
    governance_action_validity_period: number,
  ): void;
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
  major(): number;
  minor(): number;
  static new(major: number, minor: number): ProtocolVersion;
}
export class PublicKey {
  hash(): Ed25519KeyHash;
  verify(data: Uint8Array, signature: Ed25519Signature): boolean;
  as_bytes(): Uint8Array;
  to_bech32(): string;
  static from_bech32(bech32_str: string): PublicKey;
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
  static new(
    tag: RedeemerTag,
    index: BigNum,
    data: PlutusData,
    ex_units: ExUnits,
  ): Redeemer;
}
export class RedeemerTag {
  static new_spend(): RedeemerTag;
  static new_mint(): RedeemerTag;
  static new_cert(): RedeemerTag;
  static new_reward(): RedeemerTag;
  static new_vote(): RedeemerTag;
  static new_voting_proposal(): RedeemerTag;
  kind(): RedeemerTagKind;
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
  kind(): RelayKind;
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
  static new(network: number, payment: Credential): RewardAddress;
  payment_cred(): Credential;
  to_address(): Address;
  static from_address(addr: Address): RewardAddress | undefined;
  network_id(): number;
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
  to_unwrapped_bytes(): Uint8Array;
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
  static new(
    port: number | undefined,
    dns_name: DNSRecordAorAAAA,
  ): SingleHostName;
}
export class StakeAndVoteDelegation {
  stake_credential(): Credential;
  pool_keyhash(): Ed25519KeyHash;
  drep(): DRep;
  static new(
    stake_credential: Credential,
    pool_keyhash: Ed25519KeyHash,
    drep: DRep,
  ): StakeAndVoteDelegation;
  has_script_credentials(): boolean;
}
export class StakeDelegation {
  stake_credential(): Credential;
  pool_keyhash(): Ed25519KeyHash;
  static new(
    stake_credential: Credential,
    pool_keyhash: Ed25519KeyHash,
  ): StakeDelegation;
  has_script_credentials(): boolean;
}
export class StakeDeregistration {
  stake_credential(): Credential;
  coin(): BigNum | undefined;
  static new(stake_credential: Credential): StakeDeregistration;
  static new_with_coin(
    stake_credential: Credential,
    coin: BigNum,
  ): StakeDeregistration;
  has_script_credentials(): boolean;
}
export class StakeRegistration {
  stake_credential(): Credential;
  coin(): BigNum | undefined;
  static new(stake_credential: Credential): StakeRegistration;
  static new_with_coin(
    stake_credential: Credential,
    coin: BigNum,
  ): StakeRegistration;
  has_script_credentials(): boolean;
}
export class StakeRegistrationAndDelegation {
  stake_credential(): Credential;
  pool_keyhash(): Ed25519KeyHash;
  coin(): BigNum;
  static new(
    stake_credential: Credential,
    pool_keyhash: Ed25519KeyHash,
    coin: BigNum,
  ): StakeRegistrationAndDelegation;
  has_script_credentials(): boolean;
}
export class StakeVoteRegistrationAndDelegation {
  stake_credential(): Credential;
  pool_keyhash(): Ed25519KeyHash;
  drep(): DRep;
  coin(): BigNum;
  static new(
    stake_credential: Credential,
    pool_keyhash: Ed25519KeyHash,
    drep: DRep,
    coin: BigNum,
  ): StakeVoteRegistrationAndDelegation;
  has_script_credentials(): boolean;
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
  set_is_valid(valid: boolean): void;
  static new(
    body: TransactionBody,
    witness_set: TransactionWitnessSet,
    auxiliary_data?: AuxiliaryData,
  ): Transaction;
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
  static new(
    inputs: TransactionInputs,
    outputs: TransactionOutputs,
    fee: BigNum,
    ttl?: number,
  ): TransactionBody;
  static new_tx_body(
    inputs: TransactionInputs,
    outputs: TransactionOutputs,
    fee: BigNum,
  ): TransactionBody;
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
  add(elem: TransactionInput): boolean;
  to_option(): TransactionInputs | undefined;
}
export class TransactionMetadatum {
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
  static new(): TransactionOutputs;
  len(): number;
  get(index: number): TransactionOutput;
  add(elem: TransactionOutput): void;
}
export class TransactionUnspentOutput {
  static new(
    input: TransactionInput,
    output: TransactionOutput,
  ): TransactionUnspentOutput;
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
  static new(): TransactionWitnessSets;
  len(): number;
  get(index: number): TransactionWitnessSet;
  add(elem: TransactionWitnessSet): void;
}
export class TreasuryWithdrawals {
  static new(): TreasuryWithdrawals;
  get(key: RewardAddress): BigNum | undefined;
  insert(key: RewardAddress, value: BigNum): void;
  keys(): RewardAddresses;
  len(): number;
}
export class TreasuryWithdrawalsAction {
  withdrawals(): TreasuryWithdrawals;
  policy_hash(): ScriptHash | undefined;
  static new(withdrawals: TreasuryWithdrawals): TreasuryWithdrawalsAction;
  static new_with_policy_hash(
    withdrawals: TreasuryWithdrawals,
    policy_hash: ScriptHash,
  ): TreasuryWithdrawalsAction;
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
  static new(
    proposed_protocol_parameter_updates: ProposedProtocolParameterUpdates,
    epoch: number,
  ): Update;
}
export class UpdateCommitteeAction {
  gov_action_id(): GovernanceActionId | undefined;
  committee(): Committee;
  members_to_remove(): Credentials;
  static new(
    committee: Committee,
    members_to_remove: Credentials,
  ): UpdateCommitteeAction;
  static new_with_action_id(
    gov_action_id: GovernanceActionId,
    committee: Committee,
    members_to_remove: Credentials,
  ): UpdateCommitteeAction;
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
  set_coin(coin: BigNum): void;
  multiasset(): MultiAsset | undefined;
  set_multiasset(multiasset: MultiAsset): void;
  checked_add(rhs: Value): Value;
  checked_sub(rhs_value: Value): Value;
  clamped_sub(rhs_value: Value): Value;
  compare(rhs_value: Value): number | undefined;
}
export class VersionedBlock {
  static new(block: Block, era_code: number): VersionedBlock;
  block(): Block;
  era(): BlockEra;
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
  add(elem: Vkeywitness): boolean;
}
export class VoteDelegation {
  stake_credential(): Credential;
  drep(): DRep;
  static new(stake_credential: Credential, drep: DRep): VoteDelegation;
  has_script_credentials(): boolean;
}
export class VoteRegistrationAndDelegation {
  stake_credential(): Credential;
  drep(): DRep;
  coin(): BigNum;
  static new(
    stake_credential: Credential,
    drep: DRep,
    coin: BigNum,
  ): VoteRegistrationAndDelegation;
  has_script_credentials(): boolean;
}
export class Voter {
  static new_constitutional_committee_hot_key(cred: Credential): Voter;
  static new_drep(cred: Credential): Voter;
  static new_staking_pool(key_hash: Ed25519KeyHash): Voter;
  kind(): VoterKind;
  to_constitutional_committee_hot_cred(): Credential | undefined;
  to_drep_cred(): Credential | undefined;
  to_staking_pool_key_hash(): Ed25519KeyHash | undefined;
  has_script_credentials(): boolean;
  to_key_hash(): Ed25519KeyHash | undefined;
}
export class Voters {
  static new(): Voters;
  add(voter: Voter): void;
  get(index: number): Voter | undefined;
  len(): number;
}
export class VotingProcedure {
  static new(vote: VoteKind): VotingProcedure;
  static new_with_anchor(vote: VoteKind, anchor: Anchor): VotingProcedure;
  vote_kind(): VoteKind;
  anchor(): Anchor | undefined;
}
export class VotingProcedures {
  static new(): VotingProcedures;
  insert(
    voter: Voter,
    governance_action_id: GovernanceActionId,
    voting_procedure: VotingProcedure,
  ): void;
  get(
    voter: Voter,
    governance_action_id: GovernanceActionId,
  ): VotingProcedure | undefined;
  get_voters(): Voters;
  get_governance_action_ids_by_voter(voter: Voter): GovernanceActionIds;
}
export class VotingProposal {
  governance_action(): GovernanceAction;
  anchor(): Anchor;
  reward_account(): RewardAddress;
  deposit(): BigNum;
  static new(
    governance_action: GovernanceAction,
    anchor: Anchor,
    reward_account: RewardAddress,
    deposit: BigNum,
  ): VotingProposal;
}

export class VotingProposals {
  static new(): VotingProposals;
  len(): number;
  get(index: number): VotingProposal;
  add(proposal: VotingProposal): boolean;
}
export class Withdrawals {
  static new(): Withdrawals;
  len(): number;
  insert(key: RewardAddress, value: BigNum): BigNum | undefined;
  get(key: RewardAddress): BigNum | undefined;
  keys(): RewardAddresses;
}
