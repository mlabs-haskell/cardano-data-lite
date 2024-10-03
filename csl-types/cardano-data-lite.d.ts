export declare class Anchor {
    private _url;
    private _anchor_data_hash;
    constructor(url: URL, anchor_data_hash: AnchorDataHash);
    static new(url: URL, anchor_data_hash: AnchorDataHash): Anchor;
    get_url(): URL;
    set_url(url: URL): void;
    get_anchor_data_hash(): AnchorDataHash;
    set_anchor_data_hash(anchor_data_hash: AnchorDataHash): void;
    static deserialize(reader: CBORReader): Anchor;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Anchor;
    static from_hex(hex_str: string): Anchor;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Anchor;
}
export declare class AnchorDataHash {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): AnchorDataHash;
    static from_bech32(bech_str: string): AnchorDataHash;
    to_bech32(prefix: string): string;
    free(): void;
    static from_bytes(data: Uint8Array): AnchorDataHash;
    static from_hex(hex_str: string): AnchorDataHash;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): AnchorDataHash;
    static deserialize(reader: CBORReader): AnchorDataHash;
    serialize(writer: CBORWriter): void;
}
export declare class AssetName {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): AssetName;
    name(): Uint8Array;
    static deserialize(reader: CBORReader): AssetName;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): AssetName;
    static from_hex(hex_str: string): AssetName;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): AssetName;
}
export declare class AssetNames {
    private items;
    constructor(items: AssetName[]);
    static new(): AssetNames;
    len(): number;
    get(index: number): AssetName;
    add(elem: AssetName): void;
    static deserialize(reader: CBORReader): AssetNames;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): AssetNames;
    static from_hex(hex_str: string): AssetNames;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): AssetNames;
}
export declare class Assets {
    private items;
    constructor(items: [AssetName, BigNum][]);
    static new(): Assets;
    len(): number;
    insert(key: AssetName, value: BigNum): BigNum | undefined;
    get(key: AssetName): BigNum | undefined;
    _remove_many(keys: AssetName[]): void;
    keys(): AssetNames;
    static deserialize(reader: CBORReader): Assets;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Assets;
    static from_hex(hex_str: string): Assets;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Assets;
    _inplace_checked_add(rhs: Assets): void;
    _inplace_clamped_sub(rhs: Assets): void;
    _normalize(): void;
    _partial_cmp(rhs: Assets): number | undefined;
}
export declare class AuxiliaryData {
    private _metadata;
    private _native_scripts;
    private _plutus_scripts_v1;
    private _plutus_scripts_v2;
    private _plutus_scripts_v3;
    constructor(metadata: GeneralTransactionMetadata, native_scripts: NativeScripts, plutus_scripts_v1: PlutusScripts, plutus_scripts_v2: PlutusScripts, plutus_scripts_v3: PlutusScripts);
    static new(metadata: GeneralTransactionMetadata, native_scripts: NativeScripts, plutus_scripts_v1: PlutusScripts, plutus_scripts_v2: PlutusScripts, plutus_scripts_v3: PlutusScripts): AuxiliaryData;
    get_metadata(): GeneralTransactionMetadata;
    set_metadata(metadata: GeneralTransactionMetadata): void;
    get_native_scripts(): NativeScripts;
    set_native_scripts(native_scripts: NativeScripts): void;
    get_plutus_scripts_v1(): PlutusScripts;
    set_plutus_scripts_v1(plutus_scripts_v1: PlutusScripts): void;
    get_plutus_scripts_v2(): PlutusScripts;
    set_plutus_scripts_v2(plutus_scripts_v2: PlutusScripts): void;
    get_plutus_scripts_v3(): PlutusScripts;
    set_plutus_scripts_v3(plutus_scripts_v3: PlutusScripts): void;
    static deserialize(reader: CBORReader): AuxiliaryData;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): AuxiliaryData;
    static from_hex(hex_str: string): AuxiliaryData;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): AuxiliaryData;
}
export declare class AuxiliaryDataHash {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): AuxiliaryDataHash;
    static from_bech32(bech_str: string): AuxiliaryDataHash;
    to_bech32(prefix: string): string;
    free(): void;
    static from_bytes(data: Uint8Array): AuxiliaryDataHash;
    static from_hex(hex_str: string): AuxiliaryDataHash;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): AuxiliaryDataHash;
    static deserialize(reader: CBORReader): AuxiliaryDataHash;
    serialize(writer: CBORWriter): void;
}
export declare class AuxiliaryDataSet {
    private items;
    constructor(items: [number, AuxiliaryData][]);
    static new(): AuxiliaryDataSet;
    len(): number;
    insert(key: number, value: AuxiliaryData): AuxiliaryData | undefined;
    get(key: number): AuxiliaryData | undefined;
    _remove_many(keys: number[]): void;
    static deserialize(reader: CBORReader): AuxiliaryDataSet;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): AuxiliaryDataSet;
    static from_hex(hex_str: string): AuxiliaryDataSet;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): AuxiliaryDataSet;
}
export declare class BigNum {
    private inner;
    constructor(inner: bigint);
    static new(inner: bigint): BigNum;
    toJsValue(): bigint;
    static deserialize(reader: CBORReader): BigNum;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): BigNum;
    static from_hex(hex_str: string): BigNum;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): BigNum;
    static _maxU64(): bigint;
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
export declare class Bip32PrivateKey {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): Bip32PrivateKey;
    static from_bytes(data: Uint8Array): Bip32PrivateKey;
    static from_hex(hex_str: string): Bip32PrivateKey;
    as_bytes(): Uint8Array;
    to_hex(): string;
    static deserialize(reader: CBORReader): Bip32PrivateKey;
    serialize(writer: CBORWriter): void;
    static from_bech32(bech_str: string): Bip32PrivateKey;
    to_bech32(): void;
}
export declare class Block {
    private _header;
    private _transaction_bodies;
    private _transaction_witness_sets;
    private _auxiliary_data_set;
    private _invalid_transactions;
    constructor(header: Header, transaction_bodies: TransactionBodies, transaction_witness_sets: TransactionWitnessSets, auxiliary_data_set: AuxiliaryDataSet, invalid_transactions: Uint32Array);
    static new(header: Header, transaction_bodies: TransactionBodies, transaction_witness_sets: TransactionWitnessSets, auxiliary_data_set: AuxiliaryDataSet, invalid_transactions: Uint32Array): Block;
    get_header(): Header;
    set_header(header: Header): void;
    get_transaction_bodies(): TransactionBodies;
    set_transaction_bodies(transaction_bodies: TransactionBodies): void;
    get_transaction_witness_sets(): TransactionWitnessSets;
    set_transaction_witness_sets(transaction_witness_sets: TransactionWitnessSets): void;
    get_auxiliary_data_set(): AuxiliaryDataSet;
    set_auxiliary_data_set(auxiliary_data_set: AuxiliaryDataSet): void;
    get_invalid_transactions(): Uint32Array;
    set_invalid_transactions(invalid_transactions: Uint32Array): void;
    static deserialize(reader: CBORReader): Block;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Block;
    static from_hex(hex_str: string): Block;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Block;
}
export declare class BlockHash {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): BlockHash;
    static from_bech32(bech_str: string): BlockHash;
    to_bech32(prefix: string): string;
    free(): void;
    static from_bytes(data: Uint8Array): BlockHash;
    static from_hex(hex_str: string): BlockHash;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): BlockHash;
    static deserialize(reader: CBORReader): BlockHash;
    serialize(writer: CBORWriter): void;
}
export declare class BootstrapWitness {
    private _vkey;
    private _signature;
    private _chain_code;
    private _attributes;
    constructor(vkey: unknown, signature: Ed25519Signature, chain_code: Uint8Array, attributes: Uint8Array);
    static new(vkey: unknown, signature: Ed25519Signature, chain_code: Uint8Array, attributes: Uint8Array): BootstrapWitness;
    get_vkey(): unknown;
    set_vkey(vkey: unknown): void;
    get_signature(): Ed25519Signature;
    set_signature(signature: Ed25519Signature): void;
    get_chain_code(): Uint8Array;
    set_chain_code(chain_code: Uint8Array): void;
    get_attributes(): Uint8Array;
    set_attributes(attributes: Uint8Array): void;
    static deserialize(reader: CBORReader): BootstrapWitness;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): BootstrapWitness;
    static from_hex(hex_str: string): BootstrapWitness;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): BootstrapWitness;
}
export declare class BootstrapWitnesses {
    private items;
    constructor(items: BootstrapWitness[]);
    static new(): BootstrapWitnesses;
    len(): number;
    get(index: number): BootstrapWitness;
    add(elem: BootstrapWitness): void;
    static deserialize(reader: CBORReader): BootstrapWitnesses;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): BootstrapWitnesses;
    static from_hex(hex_str: string): BootstrapWitnesses;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): BootstrapWitnesses;
}
export declare class CSLBigInt {
    private inner;
    constructor(inner: bigint);
    static new(inner: bigint): CSLBigInt;
    toJsValue(): bigint;
    free(): void;
    static from_bytes(data: Uint8Array): CSLBigInt;
    static from_hex(hex_str: string): CSLBigInt;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): CSLBigInt;
    static from_str(string: string): CSLBigInt;
    to_str(): string;
    static zero(): CSLBigInt;
    static one(): CSLBigInt;
    is_zero(): boolean;
    add(other: CSLBigInt): CSLBigInt;
    sub(other: CSLBigInt): CSLBigInt;
    mul(other: CSLBigInt): CSLBigInt;
    pow(other: CSLBigInt): CSLBigInt;
    div_floor(other: CSLBigInt): CSLBigInt;
    div_ceil(other: CSLBigInt): CSLBigInt;
    abs(): CSLBigInt;
    increment(): CSLBigInt;
    static max(a: CSLBigInt, b: CSLBigInt): CSLBigInt;
    as_u64(): BigNum | undefined;
    as_int(): Int | undefined;
    serialize(writer: CBORWriter): void;
    static deserialize(reader: CBORReader): CSLBigInt;
}
export declare class Certificate {
    private variant;
    constructor(variant: CertificateVariant);
    static new_stake_registration(stake_registration: StakeRegistration): Certificate;
    static new_stake_deregistration(stake_deregistration: StakeDeregistration): Certificate;
    static new_stake_delegation(stake_delegation: StakeDelegation): Certificate;
    static new_pool_registration(pool_registration: PoolRegistration): Certificate;
    static new_pool_retirement(pool_retirement: PoolRetirement): Certificate;
    static new_reg_cert(reg_cert: RegCert): Certificate;
    static new_unreg_cert(unreg_cert: UnregCert): Certificate;
    static new_vote_delegation(vote_delegation: VoteDelegation): Certificate;
    static new_stake_and_vote_delegation(stake_and_vote_delegation: StakeAndVoteDelegation): Certificate;
    static new_stake_registration_and_delegation(stake_registration_and_delegation: StakeRegistrationAndDelegation): Certificate;
    static new_vote_registration_and_delegation(vote_registration_and_delegation: VoteRegistrationAndDelegation): Certificate;
    static new_stake_vote_registration_and_delegation(stake_vote_registration_and_delegation: StakeVoteRegistrationAndDelegation): Certificate;
    static new_committee_hot_auth(committee_hot_auth: CommitteeHotAuth): Certificate;
    static new_committee_cold_resign(committee_cold_resign: CommitteeColdResign): Certificate;
    static new_drep_registration(drep_registration: DrepRegistration): Certificate;
    static new_drep_deregistration(drep_deregistration: DrepDeregistration): Certificate;
    static new_drep_update(drep_update: DrepUpdate): Certificate;
    as_stake_registration(): StakeRegistration | undefined;
    as_stake_deregistration(): StakeDeregistration | undefined;
    as_stake_delegation(): StakeDelegation | undefined;
    as_pool_registration(): PoolRegistration | undefined;
    as_pool_retirement(): PoolRetirement | undefined;
    as_reg_cert(): RegCert | undefined;
    as_unreg_cert(): UnregCert | undefined;
    as_vote_delegation(): VoteDelegation | undefined;
    as_stake_and_vote_delegation(): StakeAndVoteDelegation | undefined;
    as_stake_registration_and_delegation(): StakeRegistrationAndDelegation | undefined;
    as_vote_registration_and_delegation(): VoteRegistrationAndDelegation | undefined;
    as_stake_vote_registration_and_delegation(): StakeVoteRegistrationAndDelegation | undefined;
    as_committee_hot_auth(): CommitteeHotAuth | undefined;
    as_committee_cold_resign(): CommitteeColdResign | undefined;
    as_drep_registration(): DrepRegistration | undefined;
    as_drep_deregistration(): DrepDeregistration | undefined;
    as_drep_update(): DrepUpdate | undefined;
    static deserialize(reader: CBORReader): Certificate;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Certificate;
    static from_hex(hex_str: string): Certificate;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Certificate;
}
export declare class Certificates {
    private items;
    constructor();
    static new(): Certificates;
    len(): number;
    get(index: number): Certificate;
    add(elem: Certificate): boolean;
    contains(elem: Certificate): boolean;
    static deserialize(reader: CBORReader): Certificates;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Certificates;
    static from_hex(hex_str: string): Certificates;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Certificates;
}
export declare class CommitteeColdResign {
    private _committee_cold_key;
    private _anchor;
    constructor(committee_cold_key: Credential, anchor: Anchor | undefined);
    static new(committee_cold_key: Credential, anchor: Anchor | undefined): CommitteeColdResign;
    get_committee_cold_key(): Credential;
    set_committee_cold_key(committee_cold_key: Credential): void;
    get_anchor(): Anchor | undefined;
    set_anchor(anchor: Anchor | undefined): void;
    static deserialize(reader: CBORReader): CommitteeColdResign;
    serialize(writer: CBORWriter): void;
}
export declare class CommitteeHotAuth {
    private _committee_cold_key;
    private _committee_hot_key;
    constructor(committee_cold_key: Credential, committee_hot_key: Credential);
    static new(committee_cold_key: Credential, committee_hot_key: Credential): CommitteeHotAuth;
    get_committee_cold_key(): Credential;
    set_committee_cold_key(committee_cold_key: Credential): void;
    get_committee_hot_key(): Credential;
    set_committee_hot_key(committee_hot_key: Credential): void;
    static deserialize(reader: CBORReader): CommitteeHotAuth;
    serialize(writer: CBORWriter): void;
}
export declare class Constitution {
    private _anchor;
    private _scripthash;
    constructor(anchor: Anchor, scripthash: ScriptHash | undefined);
    static new(anchor: Anchor, scripthash: ScriptHash | undefined): Constitution;
    get_anchor(): Anchor;
    set_anchor(anchor: Anchor): void;
    get_scripthash(): ScriptHash | undefined;
    set_scripthash(scripthash: ScriptHash | undefined): void;
    static deserialize(reader: CBORReader): Constitution;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Constitution;
    static from_hex(hex_str: string): Constitution;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Constitution;
}
export declare class ConstrPlutusData {
    private _alternative;
    private _data;
    constructor(alternative: BigNum, data: PlutusList);
    static new(alternative: BigNum, data: PlutusList): ConstrPlutusData;
    get_alternative(): BigNum;
    set_alternative(alternative: BigNum): void;
    get_data(): PlutusList;
    set_data(data: PlutusList): void;
    static deserialize(reader: CBORReader): ConstrPlutusData;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): ConstrPlutusData;
    static from_hex(hex_str: string): ConstrPlutusData;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): ConstrPlutusData;
}
export declare class CostMdls {
    private items;
    constructor(items: [Language, CostModel][]);
    static new(): CostMdls;
    len(): number;
    insert(key: Language, value: CostModel): CostModel | undefined;
    get(key: Language): CostModel | undefined;
    _remove_many(keys: Language[]): void;
    keys(): Languages;
    static deserialize(reader: CBORReader): CostMdls;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): CostMdls;
    static from_hex(hex_str: string): CostMdls;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): CostMdls;
    retain_language_versions(languages: Languages): CostMdls;
}
export declare class CostModel {
    private items;
    constructor(items: Int[]);
    static new(): CostModel;
    len(): number;
    get(index: number): Int;
    add(elem: Int): void;
    static deserialize(reader: CBORReader): CostModel;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): CostModel;
    static from_hex(hex_str: string): CostModel;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): CostModel;
    set(operation: number, cost: Int): Int;
}
export declare class Credential {
    private variant;
    constructor(variant: CredentialVariant);
    static new_keyhash(keyhash: Ed25519KeyHash): Credential;
    static new_scripthash(scripthash: ScriptHash): Credential;
    as_keyhash(): Ed25519KeyHash | undefined;
    as_scripthash(): ScriptHash | undefined;
    static deserialize(reader: CBORReader): Credential;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Credential;
    static from_hex(hex_str: string): Credential;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Credential;
}
export declare class Credentials {
    private items;
    constructor();
    static new(): Credentials;
    len(): number;
    get(index: number): Credential;
    add(elem: Credential): boolean;
    contains(elem: Credential): boolean;
    static deserialize(reader: CBORReader): Credentials;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Credentials;
    static from_hex(hex_str: string): Credentials;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Credentials;
}
export declare class DNSRecordAorAAAA {
    private inner;
    constructor(inner: string);
    static new(inner: string): DNSRecordAorAAAA;
    record(): string;
    static deserialize(reader: CBORReader): DNSRecordAorAAAA;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): DNSRecordAorAAAA;
    static from_hex(hex_str: string): DNSRecordAorAAAA;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): DNSRecordAorAAAA;
}
export declare class DNSRecordSRV {
    private inner;
    constructor(inner: string);
    static new(inner: string): DNSRecordSRV;
    record(): string;
    static deserialize(reader: CBORReader): DNSRecordSRV;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): DNSRecordSRV;
    static from_hex(hex_str: string): DNSRecordSRV;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): DNSRecordSRV;
}
export declare class GeneralTransactionMetadata {
    private items;
    constructor(items: [BigNum, TransactionMetadatum][]);
    static new(): GeneralTransactionMetadata;
    len(): number;
    insert(key: BigNum, value: TransactionMetadatum): TransactionMetadatum | undefined;
    get(key: BigNum): TransactionMetadatum | undefined;
    _remove_many(keys: BigNum[]): void;
    keys(): TransactionMetadatumLabels;
    static deserialize(reader: CBORReader): GeneralTransactionMetadata;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): GeneralTransactionMetadata;
    static from_hex(hex_str: string): GeneralTransactionMetadata;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): GeneralTransactionMetadata;
}
export declare class GenesisDelegateHash {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): GenesisDelegateHash;
    static from_bech32(bech_str: string): GenesisDelegateHash;
    to_bech32(prefix: string): string;
    free(): void;
    static from_bytes(data: Uint8Array): GenesisDelegateHash;
    static from_hex(hex_str: string): GenesisDelegateHash;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): GenesisDelegateHash;
    static deserialize(reader: CBORReader): GenesisDelegateHash;
    serialize(writer: CBORWriter): void;
}
export declare class GenesisHash {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): GenesisHash;
    static from_bech32(bech_str: string): GenesisHash;
    to_bech32(prefix: string): string;
    free(): void;
    static from_bytes(data: Uint8Array): GenesisHash;
    static from_hex(hex_str: string): GenesisHash;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): GenesisHash;
    static deserialize(reader: CBORReader): GenesisHash;
    serialize(writer: CBORWriter): void;
}
export declare class GenesisHashes {
    private items;
    constructor(items: GenesisHash[]);
    static new(): GenesisHashes;
    len(): number;
    get(index: number): GenesisHash;
    add(elem: GenesisHash): void;
    static deserialize(reader: CBORReader): GenesisHashes;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): GenesisHashes;
    static from_hex(hex_str: string): GenesisHashes;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): GenesisHashes;
}
export declare class GovernanceAction {
    private variant;
    constructor(variant: GovernanceActionVariant);
    static new_parameter_change_action(parameter_change_action: ParameterChangeAction): GovernanceAction;
    static new_hard_fork_initiation_action(hard_fork_initiation_action: HardForkInitiationAction): GovernanceAction;
    static new_treasury_withdrawals_action(treasury_withdrawals_action: TreasuryWithdrawalsAction): GovernanceAction;
    static new_no_confidence_action(no_confidence_action: NoConfidenceAction): GovernanceAction;
    static new_new_committee_action(new_committee_action: UpdateCommitteeAction): GovernanceAction;
    static new_new_constitution_action(new_constitution_action: NewConstitutionAction): GovernanceAction;
    static new_info_action(info_action: InfoAction): GovernanceAction;
    as_parameter_change_action(): ParameterChangeAction | undefined;
    as_hard_fork_initiation_action(): HardForkInitiationAction | undefined;
    as_treasury_withdrawals_action(): TreasuryWithdrawalsAction | undefined;
    as_no_confidence_action(): NoConfidenceAction | undefined;
    as_new_committee_action(): UpdateCommitteeAction | undefined;
    as_new_constitution_action(): NewConstitutionAction | undefined;
    as_info_action(): InfoAction | undefined;
    static deserialize(reader: CBORReader): GovernanceAction;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): GovernanceAction;
    static from_hex(hex_str: string): GovernanceAction;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): GovernanceAction;
}
export declare class GovernanceActionId {
    private _transaction_id;
    private _index;
    constructor(transaction_id: TransactionHash, index: number);
    static new(transaction_id: TransactionHash, index: number): GovernanceActionId;
    get_transaction_id(): TransactionHash;
    set_transaction_id(transaction_id: TransactionHash): void;
    get_index(): number;
    set_index(index: number): void;
    static deserialize(reader: CBORReader): GovernanceActionId;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): GovernanceActionId;
    static from_hex(hex_str: string): GovernanceActionId;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): GovernanceActionId;
}
export declare class GovernanceActionIds {
    private items;
    constructor(items: GovernanceActionId[]);
    static new(): GovernanceActionIds;
    len(): number;
    get(index: number): GovernanceActionId;
    add(elem: GovernanceActionId): void;
    static deserialize(reader: CBORReader): GovernanceActionIds;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): GovernanceActionIds;
    static from_hex(hex_str: string): GovernanceActionIds;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): GovernanceActionIds;
}
export declare class GovernanceActions {
    private items;
    constructor(items: [GovernanceActionId, VotingProcedure][]);
    static new(): GovernanceActions;
    len(): number;
    insert(key: GovernanceActionId, value: VotingProcedure): VotingProcedure | undefined;
    get(key: GovernanceActionId): VotingProcedure | undefined;
    _remove_many(keys: GovernanceActionId[]): void;
    keys(): GovernanceActionIds;
    static deserialize(reader: CBORReader): GovernanceActions;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): GovernanceActions;
    static from_hex(hex_str: string): GovernanceActions;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): GovernanceActions;
}
export declare class HardForkInitiationAction {
    private _gov_action_id;
    private _protocol_version;
    constructor(gov_action_id: GovernanceActionId | undefined, protocol_version: ProtocolVersion);
    static new(gov_action_id: GovernanceActionId | undefined, protocol_version: ProtocolVersion): HardForkInitiationAction;
    get_gov_action_id(): GovernanceActionId | undefined;
    set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void;
    get_protocol_version(): ProtocolVersion;
    set_protocol_version(protocol_version: ProtocolVersion): void;
    static deserialize(reader: CBORReader): HardForkInitiationAction;
    serialize(writer: CBORWriter): void;
}
export declare class Header {
    private _header_body;
    private _body_signature;
    constructor(header_body: HeaderBody, body_signature: unknown);
    static new(header_body: HeaderBody, body_signature: unknown): Header;
    get_header_body(): HeaderBody;
    set_header_body(header_body: HeaderBody): void;
    get_body_signature(): unknown;
    set_body_signature(body_signature: unknown): void;
    static deserialize(reader: CBORReader): Header;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Header;
    static from_hex(hex_str: string): Header;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Header;
}
export declare class HeaderBody {
    private _block_number;
    private _slot;
    private _prev_hash;
    private _issuer_vkey;
    private _vrf_vkey;
    private _vrf_result;
    private _block_body_size;
    private _block_body_hash;
    private _operational_cert;
    private _protocol_version;
    constructor(block_number: number, slot: BigNum, prev_hash: BlockHash | undefined, issuer_vkey: unknown, vrf_vkey: VRFVKey, vrf_result: VRFCert, block_body_size: number, block_body_hash: BlockHash, operational_cert: OperationalCert, protocol_version: ProtocolVersion);
    static new(block_number: number, slot: BigNum, prev_hash: BlockHash | undefined, issuer_vkey: unknown, vrf_vkey: VRFVKey, vrf_result: VRFCert, block_body_size: number, block_body_hash: BlockHash, operational_cert: OperationalCert, protocol_version: ProtocolVersion): HeaderBody;
    get_block_number(): number;
    set_block_number(block_number: number): void;
    get_slot(): BigNum;
    set_slot(slot: BigNum): void;
    get_prev_hash(): BlockHash | undefined;
    set_prev_hash(prev_hash: BlockHash | undefined): void;
    get_issuer_vkey(): unknown;
    set_issuer_vkey(issuer_vkey: unknown): void;
    get_vrf_vkey(): VRFVKey;
    set_vrf_vkey(vrf_vkey: VRFVKey): void;
    get_vrf_result(): VRFCert;
    set_vrf_result(vrf_result: VRFCert): void;
    get_block_body_size(): number;
    set_block_body_size(block_body_size: number): void;
    get_block_body_hash(): BlockHash;
    set_block_body_hash(block_body_hash: BlockHash): void;
    get_operational_cert(): OperationalCert;
    set_operational_cert(operational_cert: OperationalCert): void;
    get_protocol_version(): ProtocolVersion;
    set_protocol_version(protocol_version: ProtocolVersion): void;
    static deserialize(reader: CBORReader): HeaderBody;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): HeaderBody;
    static from_hex(hex_str: string): HeaderBody;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): HeaderBody;
}
export declare class InfoAction {
    constructor();
    static new(): InfoAction;
    static deserialize(reader: CBORReader): InfoAction;
    serialize(writer: CBORWriter): void;
}
export declare class Int {
    private inner;
    constructor(inner: bigint);
    toJsValue(): bigint;
    static deserialize(reader: CBORReader): Int;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Int;
    static from_hex(hex_str: string): Int;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Int;
    static _maxI32(): number;
    static _minI32(): number;
    static from_str(string: string): Int;
    to_str(): string;
    static new(x: BigNum): Int;
    static new_negative(x: BigNum): Int;
    static new_i32(x: number): Int;
    is_positive(): boolean;
    as_positive(): BigNum | undefined;
    as_negative(): BigNum | undefined;
    as_i32(): number | undefined;
    as_i32_or_nothing(): number | undefined;
    as_i32_or_fail(): number;
}
export declare class Ipv4 {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): Ipv4;
    ip(): Uint8Array;
    static deserialize(reader: CBORReader): Ipv4;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Ipv4;
    static from_hex(hex_str: string): Ipv4;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Ipv4;
}
export declare class Ipv6 {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): Ipv6;
    ip(): Uint8Array;
    static deserialize(reader: CBORReader): Ipv6;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Ipv6;
    static from_hex(hex_str: string): Ipv6;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Ipv6;
}
export declare class KESVKey {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): KESVKey;
    static from_bech32(bech_str: string): KESVKey;
    to_bech32(prefix: string): string;
    free(): void;
    static from_bytes(data: Uint8Array): KESVKey;
    static from_hex(hex_str: string): KESVKey;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): KESVKey;
    static deserialize(reader: CBORReader): KESVKey;
    serialize(writer: CBORWriter): void;
}
export declare class Language {
    private kind_;
    constructor(kind: LanguageKind);
    static new_plutus_v1(): Language;
    static new_plutus_v2(): Language;
    static new_plutus_v3(): Language;
    static deserialize(reader: CBORReader): Language;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Language;
    static from_hex(hex_str: string): Language;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Language;
}
export declare class Languages {
    private items;
    constructor(items: Language[]);
    static new(): Languages;
    len(): number;
    get(index: number): Language;
    add(elem: Language): void;
    static deserialize(reader: CBORReader): Languages;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Languages;
    static from_hex(hex_str: string): Languages;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Languages;
    static list(): Languages;
}
export declare class MIRToStakeCredentials {
    private items;
    constructor(items: [Credential, Credential][]);
    static new(): MIRToStakeCredentials;
    len(): number;
    insert(key: Credential, value: Credential): Credential | undefined;
    get(key: Credential): Credential | undefined;
    _remove_many(keys: Credential[]): void;
    keys(): Credentials;
    static deserialize(reader: CBORReader): MIRToStakeCredentials;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): MIRToStakeCredentials;
    static from_hex(hex_str: string): MIRToStakeCredentials;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): MIRToStakeCredentials;
}
export declare class MetadataList {
    private items;
    constructor(items: TransactionMetadatum[]);
    static new(): MetadataList;
    len(): number;
    get(index: number): TransactionMetadatum;
    add(elem: TransactionMetadatum): void;
    static deserialize(reader: CBORReader): MetadataList;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): MetadataList;
    static from_hex(hex_str: string): MetadataList;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): MetadataList;
}
export declare class MetadataMap {
    private items;
    constructor(items: [TransactionMetadatum, TransactionMetadatum][]);
    static new(): MetadataMap;
    len(): number;
    insert(key: TransactionMetadatum, value: TransactionMetadatum): TransactionMetadatum | undefined;
    _get(key: TransactionMetadatum): TransactionMetadatum | undefined;
    _remove_many(keys: TransactionMetadatum[]): void;
    keys(): MetadataList;
    static deserialize(reader: CBORReader): MetadataMap;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): MetadataMap;
    static from_hex(hex_str: string): MetadataMap;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): MetadataMap;
    insert_str(key: string, value: TransactionMetadatum): TransactionMetadatum | undefined;
    insert_i32(key: number, value: TransactionMetadatum): TransactionMetadatum | undefined;
    get(key: TransactionMetadatum): TransactionMetadatum;
    get_str(key: string): TransactionMetadatum;
    get_i32(key: number): TransactionMetadatum;
    has(key: TransactionMetadatum): boolean;
}
export declare class Mint {
    private items;
    constructor(items: [ScriptHash, MintAssets][]);
    static new(): Mint;
    len(): number;
    insert(key: ScriptHash, value: MintAssets): MintAssets | undefined;
    get(key: ScriptHash): MintAssets | undefined;
    _remove_many(keys: ScriptHash[]): void;
    keys(): ScriptHashes;
    static deserialize(reader: CBORReader): Mint;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Mint;
    static from_hex(hex_str: string): Mint;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Mint;
    _as_multiasset(isPositive: boolean): MultiAsset;
    as_positive_multiasset(): MultiAsset;
    as_negative_multiasset(): MultiAsset;
}
export declare class MintAssets {
    private items;
    constructor(items: [AssetName, Int][]);
    static new(): MintAssets;
    len(): number;
    insert(key: AssetName, value: Int): Int | undefined;
    get(key: AssetName): Int | undefined;
    _remove_many(keys: AssetName[]): void;
    keys(): AssetNames;
    static deserialize(reader: CBORReader): MintAssets;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): MintAssets;
    static from_hex(hex_str: string): MintAssets;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): MintAssets;
}
export declare class MultiAsset {
    private items;
    constructor(items: [ScriptHash, Assets][]);
    static new(): MultiAsset;
    len(): number;
    insert(key: ScriptHash, value: Assets): Assets | undefined;
    get(key: ScriptHash): Assets | undefined;
    _remove_many(keys: ScriptHash[]): void;
    keys(): ScriptHashes;
    static deserialize(reader: CBORReader): MultiAsset;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): MultiAsset;
    static from_hex(hex_str: string): MultiAsset;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): MultiAsset;
    set_asset(policy_id: ScriptHash, asset_name: AssetName, value: BigNum): BigNum | undefined;
    get_asset(policy_id: ScriptHash, asset_name: AssetName): BigNum;
    sub(rhs: MultiAsset): MultiAsset;
    _inplace_checked_add(rhs: MultiAsset): void;
    _inplace_clamped_sub(rhs: MultiAsset): void;
    _normalize(): void;
    _partial_cmp(rhs: MultiAsset): number | undefined;
}
export declare class MultiHostName {
    private _dns_name;
    constructor(dns_name: DNSRecordSRV);
    static new(dns_name: DNSRecordSRV): MultiHostName;
    get_dns_name(): DNSRecordSRV;
    set_dns_name(dns_name: DNSRecordSRV): void;
    static deserialize(reader: CBORReader): MultiHostName;
    serialize(writer: CBORWriter): void;
}
export declare class NativeScript {
    private variant;
    constructor(variant: NativeScriptVariant);
    static new_script_pubkey(script_pubkey: unknown): NativeScript;
    static new_script_all(script_all: ScriptAll): NativeScript;
    static new_script_any(script_any: ScriptAny): NativeScript;
    static new_script_n_of_k(script_n_of_k: ScriptNOfK): NativeScript;
    static new_timelock_start(timelock_start: TimelockStart): NativeScript;
    static new_timelock_expiry(timelock_expiry: TimelockExpiry): NativeScript;
    as_script_pubkey(): unknown | undefined;
    as_script_all(): ScriptAll | undefined;
    as_script_any(): ScriptAny | undefined;
    as_script_n_of_k(): ScriptNOfK | undefined;
    as_timelock_start(): TimelockStart | undefined;
    as_timelock_expiry(): TimelockExpiry | undefined;
    static deserialize(reader: CBORReader): NativeScript;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): NativeScript;
    static from_hex(hex_str: string): NativeScript;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): NativeScript;
}
export declare class NativeScripts {
    private items;
    constructor(items: NativeScript[]);
    static new(): NativeScripts;
    len(): number;
    get(index: number): NativeScript;
    add(elem: NativeScript): void;
    static deserialize(reader: CBORReader): NativeScripts;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): NativeScripts;
    static from_hex(hex_str: string): NativeScripts;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): NativeScripts;
}
export declare class NetworkId {
    private kind_;
    constructor(kind: NetworkIdKind);
    static new_mainnet(): NetworkId;
    static new_testnet(): NetworkId;
    static deserialize(reader: CBORReader): NetworkId;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): NetworkId;
    static from_hex(hex_str: string): NetworkId;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): NetworkId;
}
export declare class NewConstitutionAction {
    private _gov_action_id;
    private _constitution;
    constructor(gov_action_id: GovernanceActionId | undefined, constitution: Constitution);
    static new(gov_action_id: GovernanceActionId | undefined, constitution: Constitution): NewConstitutionAction;
    get_gov_action_id(): GovernanceActionId | undefined;
    set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void;
    get_constitution(): Constitution;
    set_constitution(constitution: Constitution): void;
    static deserialize(reader: CBORReader): NewConstitutionAction;
    serialize(writer: CBORWriter): void;
}
export declare class NoConfidenceAction {
    private _gov_action_id;
    constructor(gov_action_id: GovernanceActionId | undefined);
    static new(gov_action_id: GovernanceActionId | undefined): NoConfidenceAction;
    get_gov_action_id(): GovernanceActionId | undefined;
    set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void;
    static deserialize(reader: CBORReader): NoConfidenceAction;
    serialize(writer: CBORWriter): void;
}
export declare class OperationalCert {
    private _hot_vkey;
    private _sequence_number;
    private _kes_period;
    private _sigma;
    constructor(hot_vkey: KESVKey, sequence_number: number, kes_period: number, sigma: Ed25519Signature);
    static new(hot_vkey: KESVKey, sequence_number: number, kes_period: number, sigma: Ed25519Signature): OperationalCert;
    get_hot_vkey(): KESVKey;
    set_hot_vkey(hot_vkey: KESVKey): void;
    get_sequence_number(): number;
    set_sequence_number(sequence_number: number): void;
    get_kes_period(): number;
    set_kes_period(kes_period: number): void;
    get_sigma(): Ed25519Signature;
    set_sigma(sigma: Ed25519Signature): void;
    static deserialize(reader: CBORReader): OperationalCert;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): OperationalCert;
    static from_hex(hex_str: string): OperationalCert;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): OperationalCert;
}
export declare class ParameterChangeAction {
    private _gov_action_id;
    private _protocol_param_updates;
    private _policy_hash;
    constructor(gov_action_id: GovernanceActionId | undefined, protocol_param_updates: ProtocolParamUpdate, policy_hash: ScriptHash | undefined);
    static new(gov_action_id: GovernanceActionId | undefined, protocol_param_updates: ProtocolParamUpdate, policy_hash: ScriptHash | undefined): ParameterChangeAction;
    get_gov_action_id(): GovernanceActionId | undefined;
    set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void;
    get_protocol_param_updates(): ProtocolParamUpdate;
    set_protocol_param_updates(protocol_param_updates: ProtocolParamUpdate): void;
    get_policy_hash(): ScriptHash | undefined;
    set_policy_hash(policy_hash: ScriptHash | undefined): void;
    static deserialize(reader: CBORReader): ParameterChangeAction;
    serialize(writer: CBORWriter): void;
}
export declare class PlutusList {
    private items;
    constructor();
    static new(): PlutusList;
    len(): number;
    get(index: number): unknown;
    add(elem: unknown): boolean;
    contains(elem: unknown): boolean;
    static deserialize(reader: CBORReader): PlutusList;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): PlutusList;
    static from_hex(hex_str: string): PlutusList;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): PlutusList;
}
export declare class PlutusMap {
    private items;
    constructor(items: [unknown, PlutusMapValues][]);
    static new(): PlutusMap;
    len(): number;
    insert(key: unknown, value: PlutusMapValues): PlutusMapValues | undefined;
    get(key: unknown): PlutusMapValues | undefined;
    _remove_many(keys: unknown[]): void;
    keys(): PlutusList;
    static deserialize(reader: CBORReader): PlutusMap;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): PlutusMap;
    static from_hex(hex_str: string): PlutusMap;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): PlutusMap;
}
export declare class PlutusMapValues {
    private items;
    constructor(items: unknown[]);
    static new(): PlutusMapValues;
    len(): number;
    get(index: number): unknown;
    add(elem: unknown): void;
    static deserialize(reader: CBORReader): PlutusMapValues;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): PlutusMapValues;
    static from_hex(hex_str: string): PlutusMapValues;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): PlutusMapValues;
}
export declare class PlutusScripts {
    private items;
    constructor(items: Uint8Array[]);
    static new(): PlutusScripts;
    len(): number;
    get(index: number): Uint8Array;
    add(elem: Uint8Array): void;
    static deserialize(reader: CBORReader): PlutusScripts;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): PlutusScripts;
    static from_hex(hex_str: string): PlutusScripts;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): PlutusScripts;
}
export declare class PlutusWitnesses {
    private items;
    constructor(items: unknown[]);
    static new(): PlutusWitnesses;
    len(): number;
    get(index: number): unknown;
    add(elem: unknown): void;
    static deserialize(reader: CBORReader): PlutusWitnesses;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): PlutusWitnesses;
    static from_hex(hex_str: string): PlutusWitnesses;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): PlutusWitnesses;
}
export declare class Pointer {
    private _slot_bignum;
    private _tx_index_bignum;
    private _cert_index_bignum;
    constructor(slot_bignum: BigNum, tx_index_bignum: BigNum, cert_index_bignum: BigNum);
    static new(slot_bignum: BigNum, tx_index_bignum: BigNum, cert_index_bignum: BigNum): Pointer;
    get_slot_bignum(): BigNum;
    set_slot_bignum(slot_bignum: BigNum): void;
    get_tx_index_bignum(): BigNum;
    set_tx_index_bignum(tx_index_bignum: BigNum): void;
    get_cert_index_bignum(): BigNum;
    set_cert_index_bignum(cert_index_bignum: BigNum): void;
    static deserialize(reader: CBORReader): Pointer;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Pointer;
    static from_hex(hex_str: string): Pointer;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Pointer;
    slot(): number;
    tx_index(): number;
    cert_index(): number;
}
export declare class PoolMetadata {
    private _url;
    private _pool_metadata_hash;
    constructor(url: URL, pool_metadata_hash: PoolMetadataHash);
    static new(url: URL, pool_metadata_hash: PoolMetadataHash): PoolMetadata;
    get_url(): URL;
    set_url(url: URL): void;
    get_pool_metadata_hash(): PoolMetadataHash;
    set_pool_metadata_hash(pool_metadata_hash: PoolMetadataHash): void;
    static deserialize(reader: CBORReader): PoolMetadata;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): PoolMetadata;
    static from_hex(hex_str: string): PoolMetadata;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): PoolMetadata;
}
export declare class PoolMetadataHash {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): PoolMetadataHash;
    static from_bech32(bech_str: string): PoolMetadataHash;
    to_bech32(prefix: string): string;
    free(): void;
    static from_bytes(data: Uint8Array): PoolMetadataHash;
    static from_hex(hex_str: string): PoolMetadataHash;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): PoolMetadataHash;
    static deserialize(reader: CBORReader): PoolMetadataHash;
    serialize(writer: CBORWriter): void;
}
export declare class PoolParams {
    private _operator;
    private _vrf_keyhash;
    private _pledge;
    private _cost;
    private _margin;
    private _reward_account;
    private _pool_owners;
    private _relays;
    private _pool_metadata;
    constructor(operator: Ed25519KeyHash, vrf_keyhash: VRFKeyHash, pledge: BigNum, cost: BigNum, margin: UnitInterval, reward_account: unknown, pool_owners: Ed25519KeyHashes, relays: Relays, pool_metadata: PoolMetadata | undefined);
    static new(operator: Ed25519KeyHash, vrf_keyhash: VRFKeyHash, pledge: BigNum, cost: BigNum, margin: UnitInterval, reward_account: unknown, pool_owners: Ed25519KeyHashes, relays: Relays, pool_metadata: PoolMetadata | undefined): PoolParams;
    get_operator(): Ed25519KeyHash;
    set_operator(operator: Ed25519KeyHash): void;
    get_vrf_keyhash(): VRFKeyHash;
    set_vrf_keyhash(vrf_keyhash: VRFKeyHash): void;
    get_pledge(): BigNum;
    set_pledge(pledge: BigNum): void;
    get_cost(): BigNum;
    set_cost(cost: BigNum): void;
    get_margin(): UnitInterval;
    set_margin(margin: UnitInterval): void;
    get_reward_account(): unknown;
    set_reward_account(reward_account: unknown): void;
    get_pool_owners(): Ed25519KeyHashes;
    set_pool_owners(pool_owners: Ed25519KeyHashes): void;
    get_relays(): Relays;
    set_relays(relays: Relays): void;
    get_pool_metadata(): PoolMetadata | undefined;
    set_pool_metadata(pool_metadata: PoolMetadata | undefined): void;
    static deserialize(reader: CBORReader): PoolParams;
    serialize(writer: CBORWriter): void;
}
export declare class PoolRegistration {
    private _pool_params;
    constructor(pool_params: PoolParams);
    static new(pool_params: PoolParams): PoolRegistration;
    get_pool_params(): PoolParams;
    set_pool_params(pool_params: PoolParams): void;
    static deserialize(reader: CBORReader): PoolRegistration;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): PoolRegistration;
    static from_hex(hex_str: string): PoolRegistration;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): PoolRegistration;
}
export declare class PoolRetirement {
    private _pool_keyhash;
    private _epoch;
    constructor(pool_keyhash: Ed25519KeyHash, epoch: number);
    static new(pool_keyhash: Ed25519KeyHash, epoch: number): PoolRetirement;
    get_pool_keyhash(): Ed25519KeyHash;
    set_pool_keyhash(pool_keyhash: Ed25519KeyHash): void;
    get_epoch(): number;
    set_epoch(epoch: number): void;
    static deserialize(reader: CBORReader): PoolRetirement;
    serialize(writer: CBORWriter): void;
}
export declare class PoolVotingThresholds {
    private _motion_no_confidence;
    private _committee_normal;
    private _committee_no_confidence;
    private _hard_fork_initiation;
    private _security_relevant_threshold;
    constructor(motion_no_confidence: UnitInterval, committee_normal: UnitInterval, committee_no_confidence: UnitInterval, hard_fork_initiation: UnitInterval, security_relevant_threshold: UnitInterval);
    static new(motion_no_confidence: UnitInterval, committee_normal: UnitInterval, committee_no_confidence: UnitInterval, hard_fork_initiation: UnitInterval, security_relevant_threshold: UnitInterval): PoolVotingThresholds;
    get_motion_no_confidence(): UnitInterval;
    set_motion_no_confidence(motion_no_confidence: UnitInterval): void;
    get_committee_normal(): UnitInterval;
    set_committee_normal(committee_normal: UnitInterval): void;
    get_committee_no_confidence(): UnitInterval;
    set_committee_no_confidence(committee_no_confidence: UnitInterval): void;
    get_hard_fork_initiation(): UnitInterval;
    set_hard_fork_initiation(hard_fork_initiation: UnitInterval): void;
    get_security_relevant_threshold(): UnitInterval;
    set_security_relevant_threshold(security_relevant_threshold: UnitInterval): void;
    static deserialize(reader: CBORReader): PoolVotingThresholds;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): PoolVotingThresholds;
    static from_hex(hex_str: string): PoolVotingThresholds;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): PoolVotingThresholds;
}
export declare class PrivateKey {
    private inner;
    private options?;
    static new(inner: Uint8Array): PrivateKey;
    as_bytes(): Uint8Array;
    to_hex(): string;
    static deserialize(reader: CBORReader): PrivateKey;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_normal_bytes(bytes: Uint8Array): PrivateKey;
    static from_extended_bytes(bytes: Uint8Array): PrivateKey;
    to_bech32(): void;
    static from_bech32(bech_str: string): PrivateKey;
    static generate_ed25519(): PrivateKey;
    static generate_ed25519extended(): PrivateKey;
    sign(message: Uint8Array): Ed25519Signature;
    to_public(): PublicKey;
    static _from_bytes(bytes: Uint8Array): PrivateKey;
    from_hex(hex_str: string): PrivateKey;
}
export declare class ProposedProtocolParameterUpdates {
    private items;
    constructor(items: [GenesisHash, ProtocolParamUpdate][]);
    static new(): ProposedProtocolParameterUpdates;
    len(): number;
    insert(key: GenesisHash, value: ProtocolParamUpdate): ProtocolParamUpdate | undefined;
    get(key: GenesisHash): ProtocolParamUpdate | undefined;
    _remove_many(keys: GenesisHash[]): void;
    keys(): GenesisHashes;
    static deserialize(reader: CBORReader): ProposedProtocolParameterUpdates;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): ProposedProtocolParameterUpdates;
    static from_hex(hex_str: string): ProposedProtocolParameterUpdates;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): ProposedProtocolParameterUpdates;
}
export declare class ProtocolParamUpdate {
    private _minfee_a;
    private _minfee_b;
    private _max_block_body_size;
    private _max_tx_size;
    private _max_block_header_size;
    private _key_deposit;
    private _pool_deposit;
    private _max_epoch;
    private _n_opt;
    private _pool_pledge_influence;
    private _expansion_rate;
    private _treasury_growth_rate;
    private _min_pool_cost;
    private _ada_per_utxo_byte;
    private _costmdls;
    private _execution_costs;
    private _max_tx_ex_units;
    private _max_block_ex_units;
    private _max_value_size;
    private _collateral_percentage;
    private _max_collateral_inputs;
    private _pool_voting_thresholds;
    private _drep_voting_thresholds;
    private _min_committee_size;
    private _committee_term_limit;
    private _governance_action_validity_period;
    private _governance_action_deposit;
    private _drep_deposit;
    private _drep_inactivity_period;
    private _script_cost_per_byte;
    constructor(minfee_a: BigNum | undefined, minfee_b: BigNum | undefined, max_block_body_size: number | undefined, max_tx_size: number | undefined, max_block_header_size: number | undefined, key_deposit: BigNum | undefined, pool_deposit: BigNum | undefined, max_epoch: number | undefined, n_opt: number | undefined, pool_pledge_influence: UnitInterval | undefined, expansion_rate: UnitInterval | undefined, treasury_growth_rate: UnitInterval | undefined, min_pool_cost: BigNum | undefined, ada_per_utxo_byte: BigNum | undefined, costmdls: unknown | undefined, execution_costs: ExUnitPrices | undefined, max_tx_ex_units: ExUnits | undefined, max_block_ex_units: ExUnits | undefined, max_value_size: number | undefined, collateral_percentage: number | undefined, max_collateral_inputs: number | undefined, pool_voting_thresholds: PoolVotingThresholds | undefined, drep_voting_thresholds: DrepVotingThresholds | undefined, min_committee_size: number | undefined, committee_term_limit: number | undefined, governance_action_validity_period: number | undefined, governance_action_deposit: BigNum | undefined, drep_deposit: BigNum | undefined, drep_inactivity_period: number | undefined, script_cost_per_byte: UnitInterval | undefined);
    static new(minfee_a: BigNum | undefined, minfee_b: BigNum | undefined, max_block_body_size: number | undefined, max_tx_size: number | undefined, max_block_header_size: number | undefined, key_deposit: BigNum | undefined, pool_deposit: BigNum | undefined, max_epoch: number | undefined, n_opt: number | undefined, pool_pledge_influence: UnitInterval | undefined, expansion_rate: UnitInterval | undefined, treasury_growth_rate: UnitInterval | undefined, min_pool_cost: BigNum | undefined, ada_per_utxo_byte: BigNum | undefined, costmdls: unknown | undefined, execution_costs: ExUnitPrices | undefined, max_tx_ex_units: ExUnits | undefined, max_block_ex_units: ExUnits | undefined, max_value_size: number | undefined, collateral_percentage: number | undefined, max_collateral_inputs: number | undefined, pool_voting_thresholds: PoolVotingThresholds | undefined, drep_voting_thresholds: DrepVotingThresholds | undefined, min_committee_size: number | undefined, committee_term_limit: number | undefined, governance_action_validity_period: number | undefined, governance_action_deposit: BigNum | undefined, drep_deposit: BigNum | undefined, drep_inactivity_period: number | undefined, script_cost_per_byte: UnitInterval | undefined): ProtocolParamUpdate;
    get_minfee_a(): BigNum | undefined;
    set_minfee_a(minfee_a: BigNum | undefined): void;
    get_minfee_b(): BigNum | undefined;
    set_minfee_b(minfee_b: BigNum | undefined): void;
    get_max_block_body_size(): number | undefined;
    set_max_block_body_size(max_block_body_size: number | undefined): void;
    get_max_tx_size(): number | undefined;
    set_max_tx_size(max_tx_size: number | undefined): void;
    get_max_block_header_size(): number | undefined;
    set_max_block_header_size(max_block_header_size: number | undefined): void;
    get_key_deposit(): BigNum | undefined;
    set_key_deposit(key_deposit: BigNum | undefined): void;
    get_pool_deposit(): BigNum | undefined;
    set_pool_deposit(pool_deposit: BigNum | undefined): void;
    get_max_epoch(): number | undefined;
    set_max_epoch(max_epoch: number | undefined): void;
    get_n_opt(): number | undefined;
    set_n_opt(n_opt: number | undefined): void;
    get_pool_pledge_influence(): UnitInterval | undefined;
    set_pool_pledge_influence(pool_pledge_influence: UnitInterval | undefined): void;
    get_expansion_rate(): UnitInterval | undefined;
    set_expansion_rate(expansion_rate: UnitInterval | undefined): void;
    get_treasury_growth_rate(): UnitInterval | undefined;
    set_treasury_growth_rate(treasury_growth_rate: UnitInterval | undefined): void;
    get_min_pool_cost(): BigNum | undefined;
    set_min_pool_cost(min_pool_cost: BigNum | undefined): void;
    get_ada_per_utxo_byte(): BigNum | undefined;
    set_ada_per_utxo_byte(ada_per_utxo_byte: BigNum | undefined): void;
    get_costmdls(): unknown | undefined;
    set_costmdls(costmdls: unknown | undefined): void;
    get_execution_costs(): ExUnitPrices | undefined;
    set_execution_costs(execution_costs: ExUnitPrices | undefined): void;
    get_max_tx_ex_units(): ExUnits | undefined;
    set_max_tx_ex_units(max_tx_ex_units: ExUnits | undefined): void;
    get_max_block_ex_units(): ExUnits | undefined;
    set_max_block_ex_units(max_block_ex_units: ExUnits | undefined): void;
    get_max_value_size(): number | undefined;
    set_max_value_size(max_value_size: number | undefined): void;
    get_collateral_percentage(): number | undefined;
    set_collateral_percentage(collateral_percentage: number | undefined): void;
    get_max_collateral_inputs(): number | undefined;
    set_max_collateral_inputs(max_collateral_inputs: number | undefined): void;
    get_pool_voting_thresholds(): PoolVotingThresholds | undefined;
    set_pool_voting_thresholds(pool_voting_thresholds: PoolVotingThresholds | undefined): void;
    get_drep_voting_thresholds(): DrepVotingThresholds | undefined;
    set_drep_voting_thresholds(drep_voting_thresholds: DrepVotingThresholds | undefined): void;
    get_min_committee_size(): number | undefined;
    set_min_committee_size(min_committee_size: number | undefined): void;
    get_committee_term_limit(): number | undefined;
    set_committee_term_limit(committee_term_limit: number | undefined): void;
    get_governance_action_validity_period(): number | undefined;
    set_governance_action_validity_period(governance_action_validity_period: number | undefined): void;
    get_governance_action_deposit(): BigNum | undefined;
    set_governance_action_deposit(governance_action_deposit: BigNum | undefined): void;
    get_drep_deposit(): BigNum | undefined;
    set_drep_deposit(drep_deposit: BigNum | undefined): void;
    get_drep_inactivity_period(): number | undefined;
    set_drep_inactivity_period(drep_inactivity_period: number | undefined): void;
    get_script_cost_per_byte(): UnitInterval | undefined;
    set_script_cost_per_byte(script_cost_per_byte: UnitInterval | undefined): void;
    static deserialize(reader: CBORReader): ProtocolParamUpdate;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): ProtocolParamUpdate;
    static from_hex(hex_str: string): ProtocolParamUpdate;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): ProtocolParamUpdate;
}
export declare class ProtocolVersion {
    private _major;
    private _minor;
    constructor(major: number, minor: number);
    static new(major: number, minor: number): ProtocolVersion;
    get_major(): number;
    set_major(major: number): void;
    get_minor(): number;
    set_minor(minor: number): void;
    static deserialize(reader: CBORReader): ProtocolVersion;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): ProtocolVersion;
    static from_hex(hex_str: string): ProtocolVersion;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): ProtocolVersion;
}
export declare class PublicKey {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): PublicKey;
    free(): void;
    static from_bytes(data: Uint8Array): PublicKey;
    static from_hex(hex_str: string): PublicKey;
    as_bytes(): Uint8Array;
    to_hex(): string;
    clone(): PublicKey;
    static deserialize(reader: CBORReader): PublicKey;
    serialize(writer: CBORWriter): void;
    hash(): Ed25519KeyHash;
    verify(data: Uint8Array, signature: Ed25519Signature): boolean;
    static from_bech32(bech_str: string): PublicKey;
    to_bech32(): void;
}
export declare class Redeemer {
    private _tag;
    private _index;
    private _data;
    private _ex_units;
    private _invalid_transactions;
    constructor(tag: RedeemerTag, index: BigNum, data: unknown, ex_units: ExUnits, invalid_transactions: Uint32Array);
    static new(tag: RedeemerTag, index: BigNum, data: unknown, ex_units: ExUnits, invalid_transactions: Uint32Array): Redeemer;
    get_tag(): RedeemerTag;
    set_tag(tag: RedeemerTag): void;
    get_index(): BigNum;
    set_index(index: BigNum): void;
    get_data(): unknown;
    set_data(data: unknown): void;
    get_ex_units(): ExUnits;
    set_ex_units(ex_units: ExUnits): void;
    get_invalid_transactions(): Uint32Array;
    set_invalid_transactions(invalid_transactions: Uint32Array): void;
    static deserialize(reader: CBORReader): Redeemer;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Redeemer;
    static from_hex(hex_str: string): Redeemer;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Redeemer;
}
export declare class RedeemerTag {
    private kind_;
    constructor(kind: RedeemerTagKind);
    static new_spending(): RedeemerTag;
    static new_minting(): RedeemerTag;
    static new_certifying(): RedeemerTag;
    static new_rewarding(): RedeemerTag;
    static new_voting(): RedeemerTag;
    static new_proposing(): RedeemerTag;
    static deserialize(reader: CBORReader): RedeemerTag;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): RedeemerTag;
    static from_hex(hex_str: string): RedeemerTag;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): RedeemerTag;
}
export declare class Redeemers {
    private items;
    constructor(items: Redeemer[]);
    static new(): Redeemers;
    len(): number;
    get(index: number): Redeemer;
    add(elem: Redeemer): void;
    static deserialize(reader: CBORReader): Redeemers;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Redeemers;
    static from_hex(hex_str: string): Redeemers;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Redeemers;
    total_ex_units(): ExUnits;
}
export declare class RegCert {
    private _stake_credential;
    private _coin;
    constructor(stake_credential: Credential, coin: BigNum);
    static new(stake_credential: Credential, coin: BigNum): RegCert;
    get_stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    get_coin(): BigNum;
    set_coin(coin: BigNum): void;
    static deserialize(reader: CBORReader): RegCert;
    serialize(writer: CBORWriter): void;
}
export declare class Relay {
    private variant;
    constructor(variant: RelayVariant);
    static new_single_host_addr(single_host_addr: SingleHostAddr): Relay;
    static new_single_host_name(single_host_name: SingleHostName): Relay;
    static new_multi_host_name(multi_host_name: MultiHostName): Relay;
    as_single_host_addr(): SingleHostAddr | undefined;
    as_single_host_name(): SingleHostName | undefined;
    as_multi_host_name(): MultiHostName | undefined;
    static deserialize(reader: CBORReader): Relay;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Relay;
    static from_hex(hex_str: string): Relay;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Relay;
}
export declare class Relays {
    private items;
    constructor(items: Relay[]);
    static new(): Relays;
    len(): number;
    get(index: number): Relay;
    add(elem: Relay): void;
    static deserialize(reader: CBORReader): Relays;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Relays;
    static from_hex(hex_str: string): Relays;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Relays;
}
export declare class ScriptAll {
    private _native_scripts;
    constructor(native_scripts: NativeScripts);
    static new(native_scripts: NativeScripts): ScriptAll;
    get_native_scripts(): NativeScripts;
    set_native_scripts(native_scripts: NativeScripts): void;
    static deserialize(reader: CBORReader): ScriptAll;
    serialize(writer: CBORWriter): void;
}
export declare class ScriptAny {
    private _native_scripts;
    constructor(native_scripts: NativeScripts);
    static new(native_scripts: NativeScripts): ScriptAny;
    get_native_scripts(): NativeScripts;
    set_native_scripts(native_scripts: NativeScripts): void;
    static deserialize(reader: CBORReader): ScriptAny;
    serialize(writer: CBORWriter): void;
}
export declare class ScriptDataHash {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): ScriptDataHash;
    static from_bech32(bech_str: string): ScriptDataHash;
    to_bech32(prefix: string): string;
    free(): void;
    static from_bytes(data: Uint8Array): ScriptDataHash;
    static from_hex(hex_str: string): ScriptDataHash;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): ScriptDataHash;
    static deserialize(reader: CBORReader): ScriptDataHash;
    serialize(writer: CBORWriter): void;
}
export declare class ScriptHash {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): ScriptHash;
    static from_bech32(bech_str: string): ScriptHash;
    to_bech32(prefix: string): string;
    free(): void;
    static from_bytes(data: Uint8Array): ScriptHash;
    static from_hex(hex_str: string): ScriptHash;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): ScriptHash;
    static deserialize(reader: CBORReader): ScriptHash;
    serialize(writer: CBORWriter): void;
}
export declare class ScriptHashes {
    private items;
    constructor(items: ScriptHash[]);
    static new(): ScriptHashes;
    len(): number;
    get(index: number): ScriptHash;
    add(elem: ScriptHash): void;
    static deserialize(reader: CBORReader): ScriptHashes;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): ScriptHashes;
    static from_hex(hex_str: string): ScriptHashes;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): ScriptHashes;
}
export declare class ScriptNOfK {
    private _n;
    private _native_scripts;
    constructor(n: number, native_scripts: NativeScripts);
    static new(n: number, native_scripts: NativeScripts): ScriptNOfK;
    get_n(): number;
    set_n(n: number): void;
    get_native_scripts(): NativeScripts;
    set_native_scripts(native_scripts: NativeScripts): void;
    static deserialize(reader: CBORReader): ScriptNOfK;
    serialize(writer: CBORWriter): void;
}
export declare class ScriptPubname {
    private _addr_keyhash;
    constructor(addr_keyhash: Ed25519KeyHash);
    static new(addr_keyhash: Ed25519KeyHash): ScriptPubname;
    get_addr_keyhash(): Ed25519KeyHash;
    set_addr_keyhash(addr_keyhash: Ed25519KeyHash): void;
    static deserialize(reader: CBORReader): ScriptPubname;
    serialize(writer: CBORWriter): void;
}
export declare class ScriptRef {
    private variant;
    constructor(variant: ScriptRefVariant);
    static new_native_script(native_script: NativeScript): ScriptRef;
    static new_plutus_script_v1(plutus_script_v1: Uint8Array): ScriptRef;
    static new_plutus_script_v2(plutus_script_v2: Uint8Array): ScriptRef;
    static new_plutus_script_v3(plutus_script_v3: Uint8Array): ScriptRef;
    as_native_script(): NativeScript | undefined;
    as_plutus_script_v1(): Uint8Array | undefined;
    as_plutus_script_v2(): Uint8Array | undefined;
    as_plutus_script_v3(): Uint8Array | undefined;
    static deserialize(reader: CBORReader): ScriptRef;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): ScriptRef;
    static from_hex(hex_str: string): ScriptRef;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): ScriptRef;
}
export declare class SingleHostAddr {
    private _port;
    private _ipv4;
    private _ipv6;
    constructor(port: number | undefined, ipv4: Ipv4 | undefined, ipv6: Ipv6 | undefined);
    static new(port: number | undefined, ipv4: Ipv4 | undefined, ipv6: Ipv6 | undefined): SingleHostAddr;
    get_port(): number | undefined;
    set_port(port: number | undefined): void;
    get_ipv4(): Ipv4 | undefined;
    set_ipv4(ipv4: Ipv4 | undefined): void;
    get_ipv6(): Ipv6 | undefined;
    set_ipv6(ipv6: Ipv6 | undefined): void;
    static deserialize(reader: CBORReader): SingleHostAddr;
    serialize(writer: CBORWriter): void;
}
export declare class SingleHostName {
    private _port;
    private _dns_name;
    constructor(port: number | undefined, dns_name: DNSRecordAorAAAA);
    static new(port: number | undefined, dns_name: DNSRecordAorAAAA): SingleHostName;
    get_port(): number | undefined;
    set_port(port: number | undefined): void;
    get_dns_name(): DNSRecordAorAAAA;
    set_dns_name(dns_name: DNSRecordAorAAAA): void;
    static deserialize(reader: CBORReader): SingleHostName;
    serialize(writer: CBORWriter): void;
}
export declare class StakeAndVoteDelegation {
    private _stake_credential;
    private _pool_keyhash;
    private _drep;
    constructor(stake_credential: Credential, pool_keyhash: Ed25519KeyHash, drep: DRep);
    static new(stake_credential: Credential, pool_keyhash: Ed25519KeyHash, drep: DRep): StakeAndVoteDelegation;
    get_stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    get_pool_keyhash(): Ed25519KeyHash;
    set_pool_keyhash(pool_keyhash: Ed25519KeyHash): void;
    get_drep(): DRep;
    set_drep(drep: DRep): void;
    static deserialize(reader: CBORReader): StakeAndVoteDelegation;
    serialize(writer: CBORWriter): void;
}
export declare class StakeDelegation {
    private _stake_credential;
    private _pool_keyhash;
    constructor(stake_credential: Credential, pool_keyhash: Ed25519KeyHash);
    static new(stake_credential: Credential, pool_keyhash: Ed25519KeyHash): StakeDelegation;
    get_stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    get_pool_keyhash(): Ed25519KeyHash;
    set_pool_keyhash(pool_keyhash: Ed25519KeyHash): void;
    static deserialize(reader: CBORReader): StakeDelegation;
    serialize(writer: CBORWriter): void;
}
export declare class StakeDeregistration {
    private _stake_credential;
    constructor(stake_credential: Credential);
    static new(stake_credential: Credential): StakeDeregistration;
    get_stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    static deserialize(reader: CBORReader): StakeDeregistration;
    serialize(writer: CBORWriter): void;
}
export declare class StakeRegistration {
    private _stake_credential;
    constructor(stake_credential: Credential);
    static new(stake_credential: Credential): StakeRegistration;
    get_stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    static deserialize(reader: CBORReader): StakeRegistration;
    serialize(writer: CBORWriter): void;
}
export declare class StakeRegistrationAndDelegation {
    private _stake_credential;
    private _pool_keyhash;
    private _coin;
    constructor(stake_credential: Credential, pool_keyhash: Ed25519KeyHash, coin: BigNum);
    static new(stake_credential: Credential, pool_keyhash: Ed25519KeyHash, coin: BigNum): StakeRegistrationAndDelegation;
    get_stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    get_pool_keyhash(): Ed25519KeyHash;
    set_pool_keyhash(pool_keyhash: Ed25519KeyHash): void;
    get_coin(): BigNum;
    set_coin(coin: BigNum): void;
    static deserialize(reader: CBORReader): StakeRegistrationAndDelegation;
    serialize(writer: CBORWriter): void;
}
export declare class StakeVoteRegistrationAndDelegation {
    private _stake_credential;
    private _pool_keyhash;
    private _drep;
    private _coin;
    constructor(stake_credential: Credential, pool_keyhash: Ed25519KeyHash, drep: DRep, coin: BigNum);
    static new(stake_credential: Credential, pool_keyhash: Ed25519KeyHash, drep: DRep, coin: BigNum): StakeVoteRegistrationAndDelegation;
    get_stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    get_pool_keyhash(): Ed25519KeyHash;
    set_pool_keyhash(pool_keyhash: Ed25519KeyHash): void;
    get_drep(): DRep;
    set_drep(drep: DRep): void;
    get_coin(): BigNum;
    set_coin(coin: BigNum): void;
    static deserialize(reader: CBORReader): StakeVoteRegistrationAndDelegation;
    serialize(writer: CBORWriter): void;
}
export declare class TimelockExpiry {
    private _slot;
    constructor(slot: BigNum);
    static new(slot: BigNum): TimelockExpiry;
    get_slot(): BigNum;
    set_slot(slot: BigNum): void;
    static deserialize(reader: CBORReader): TimelockExpiry;
    serialize(writer: CBORWriter): void;
}
export declare class TimelockStart {
    private _slot;
    constructor(slot: BigNum);
    static new(slot: BigNum): TimelockStart;
    get_slot(): BigNum;
    set_slot(slot: BigNum): void;
    static deserialize(reader: CBORReader): TimelockStart;
    serialize(writer: CBORWriter): void;
}
export declare class Transaction {
    private _body;
    private _witness_set;
    private _is_valid;
    private _auxiliary_data;
    constructor(body: TransactionBody, witness_set: TransactionWitnessSet, is_valid: boolean, auxiliary_data: AuxiliaryData | undefined);
    static new(body: TransactionBody, witness_set: TransactionWitnessSet, is_valid: boolean, auxiliary_data: AuxiliaryData | undefined): Transaction;
    get_body(): TransactionBody;
    set_body(body: TransactionBody): void;
    get_witness_set(): TransactionWitnessSet;
    set_witness_set(witness_set: TransactionWitnessSet): void;
    get_is_valid(): boolean;
    set_is_valid(is_valid: boolean): void;
    get_auxiliary_data(): AuxiliaryData | undefined;
    set_auxiliary_data(auxiliary_data: AuxiliaryData | undefined): void;
    static deserialize(reader: CBORReader): Transaction;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Transaction;
    static from_hex(hex_str: string): Transaction;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Transaction;
}
export declare class TransactionBodies {
    private items;
    constructor(items: TransactionBody[]);
    static new(): TransactionBodies;
    len(): number;
    get(index: number): TransactionBody;
    add(elem: TransactionBody): void;
    static deserialize(reader: CBORReader): TransactionBodies;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): TransactionBodies;
    static from_hex(hex_str: string): TransactionBodies;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): TransactionBodies;
}
export declare class TransactionBody {
    private _inputs;
    private _outputs;
    private _fee;
    private _ttl;
    private _certs;
    private _withdrawals;
    private _auxiliary_data_hash;
    private _validity_start_interval;
    private _mint;
    private _script_data_hash;
    private _collateral;
    private _required_signers;
    private _network_id;
    private _collateral_return;
    private _total_collateral;
    private _reference_inputs;
    private _voting_procedures;
    private _voting_proposals;
    private _current_treasury_value;
    private _donation;
    constructor(inputs: TransactionInputs, outputs: TransactionOutputs, fee: BigNum, ttl: BigNum | undefined, certs: Certificates | undefined, withdrawals: Withdrawals | undefined, auxiliary_data_hash: AuxiliaryDataHash | undefined, validity_start_interval: BigNum | undefined, mint: Mint | undefined, script_data_hash: ScriptDataHash | undefined, collateral: TransactionInputs | undefined, required_signers: Ed25519KeyHashes | undefined, network_id: NetworkId | undefined, collateral_return: TransactionOutput | undefined, total_collateral: BigNum | undefined, reference_inputs: TransactionInputs | undefined, voting_procedures: VotingProcedures | undefined, voting_proposals: VotingProposals | undefined, current_treasury_value: BigNum | undefined, donation: BigNum | undefined);
    static new(inputs: TransactionInputs, outputs: TransactionOutputs, fee: BigNum, ttl: BigNum | undefined, certs: Certificates | undefined, withdrawals: Withdrawals | undefined, auxiliary_data_hash: AuxiliaryDataHash | undefined, validity_start_interval: BigNum | undefined, mint: Mint | undefined, script_data_hash: ScriptDataHash | undefined, collateral: TransactionInputs | undefined, required_signers: Ed25519KeyHashes | undefined, network_id: NetworkId | undefined, collateral_return: TransactionOutput | undefined, total_collateral: BigNum | undefined, reference_inputs: TransactionInputs | undefined, voting_procedures: VotingProcedures | undefined, voting_proposals: VotingProposals | undefined, current_treasury_value: BigNum | undefined, donation: BigNum | undefined): TransactionBody;
    get_inputs(): TransactionInputs;
    set_inputs(inputs: TransactionInputs): void;
    get_outputs(): TransactionOutputs;
    set_outputs(outputs: TransactionOutputs): void;
    get_fee(): BigNum;
    set_fee(fee: BigNum): void;
    get_ttl(): BigNum | undefined;
    set_ttl(ttl: BigNum | undefined): void;
    get_certs(): Certificates | undefined;
    set_certs(certs: Certificates | undefined): void;
    get_withdrawals(): Withdrawals | undefined;
    set_withdrawals(withdrawals: Withdrawals | undefined): void;
    get_auxiliary_data_hash(): AuxiliaryDataHash | undefined;
    set_auxiliary_data_hash(auxiliary_data_hash: AuxiliaryDataHash | undefined): void;
    get_validity_start_interval(): BigNum | undefined;
    set_validity_start_interval(validity_start_interval: BigNum | undefined): void;
    get_mint(): Mint | undefined;
    set_mint(mint: Mint | undefined): void;
    get_script_data_hash(): ScriptDataHash | undefined;
    set_script_data_hash(script_data_hash: ScriptDataHash | undefined): void;
    get_collateral(): TransactionInputs | undefined;
    set_collateral(collateral: TransactionInputs | undefined): void;
    get_required_signers(): Ed25519KeyHashes | undefined;
    set_required_signers(required_signers: Ed25519KeyHashes | undefined): void;
    get_network_id(): NetworkId | undefined;
    set_network_id(network_id: NetworkId | undefined): void;
    get_collateral_return(): TransactionOutput | undefined;
    set_collateral_return(collateral_return: TransactionOutput | undefined): void;
    get_total_collateral(): BigNum | undefined;
    set_total_collateral(total_collateral: BigNum | undefined): void;
    get_reference_inputs(): TransactionInputs | undefined;
    set_reference_inputs(reference_inputs: TransactionInputs | undefined): void;
    get_voting_procedures(): VotingProcedures | undefined;
    set_voting_procedures(voting_procedures: VotingProcedures | undefined): void;
    get_voting_proposals(): VotingProposals | undefined;
    set_voting_proposals(voting_proposals: VotingProposals | undefined): void;
    get_current_treasury_value(): BigNum | undefined;
    set_current_treasury_value(current_treasury_value: BigNum | undefined): void;
    get_donation(): BigNum | undefined;
    set_donation(donation: BigNum | undefined): void;
    static deserialize(reader: CBORReader): TransactionBody;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): TransactionBody;
    static from_hex(hex_str: string): TransactionBody;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): TransactionBody;
}
export declare class TransactionHash {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): TransactionHash;
    static from_bech32(bech_str: string): TransactionHash;
    to_bech32(prefix: string): string;
    free(): void;
    static from_bytes(data: Uint8Array): TransactionHash;
    static from_hex(hex_str: string): TransactionHash;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): TransactionHash;
    static deserialize(reader: CBORReader): TransactionHash;
    serialize(writer: CBORWriter): void;
}
export declare class TransactionInput {
    private _transaction_id;
    private _index;
    constructor(transaction_id: TransactionHash, index: number);
    static new(transaction_id: TransactionHash, index: number): TransactionInput;
    get_transaction_id(): TransactionHash;
    set_transaction_id(transaction_id: TransactionHash): void;
    get_index(): number;
    set_index(index: number): void;
    static deserialize(reader: CBORReader): TransactionInput;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): TransactionInput;
    static from_hex(hex_str: string): TransactionInput;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): TransactionInput;
}
export declare class TransactionInputs {
    private items;
    constructor();
    static new(): TransactionInputs;
    len(): number;
    get(index: number): TransactionInput;
    add(elem: TransactionInput): boolean;
    contains(elem: TransactionInput): boolean;
    static deserialize(reader: CBORReader): TransactionInputs;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): TransactionInputs;
    static from_hex(hex_str: string): TransactionInputs;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): TransactionInputs;
}
export declare class TransactionMetadatum {
    private variant;
    constructor(variant: TransactionMetadatumVariant);
    static new_map(map: MetadataMap): TransactionMetadatum;
    static new_list(list: MetadataList): TransactionMetadatum;
    static new_int(int: Int): TransactionMetadatum;
    static new_bytes(bytes: Uint8Array): TransactionMetadatum;
    static new_text(text: string): TransactionMetadatum;
    as_map(): MetadataMap;
    as_list(): MetadataList;
    as_int(): Int;
    as_bytes(): Uint8Array;
    as_text(): string;
    static deserialize(reader: CBORReader): TransactionMetadatum;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): TransactionMetadatum;
    static from_hex(hex_str: string): TransactionMetadatum;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): TransactionMetadatum;
}
export declare class TransactionMetadatumLabels {
    private items;
    constructor(items: BigNum[]);
    static new(): TransactionMetadatumLabels;
    len(): number;
    get(index: number): BigNum;
    add(elem: BigNum): void;
    static deserialize(reader: CBORReader): TransactionMetadatumLabels;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): TransactionMetadatumLabels;
    static from_hex(hex_str: string): TransactionMetadatumLabels;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): TransactionMetadatumLabels;
}
export declare class TransactionOutput {
    private _address;
    private _amount;
    private _plutus_data;
    private _script_ref;
    constructor(address: unknown, amount: Value, plutus_data: DataOption | undefined, script_ref: ScriptRef | undefined);
    static new(address: unknown, amount: Value, plutus_data: DataOption | undefined, script_ref: ScriptRef | undefined): TransactionOutput;
    get_address(): unknown;
    set_address(address: unknown): void;
    get_amount(): Value;
    set_amount(amount: Value): void;
    get_plutus_data(): DataOption | undefined;
    set_plutus_data(plutus_data: DataOption | undefined): void;
    get_script_ref(): ScriptRef | undefined;
    set_script_ref(script_ref: ScriptRef | undefined): void;
    static deserialize(reader: CBORReader): TransactionOutput;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): TransactionOutput;
    static from_hex(hex_str: string): TransactionOutput;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): TransactionOutput;
}
export declare class TransactionOutputs {
    private items;
    constructor(items: TransactionOutput[]);
    static new(): TransactionOutputs;
    len(): number;
    get(index: number): TransactionOutput;
    add(elem: TransactionOutput): void;
    static deserialize(reader: CBORReader): TransactionOutputs;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): TransactionOutputs;
    static from_hex(hex_str: string): TransactionOutputs;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): TransactionOutputs;
}
export declare class TransactionWitnessSet {
    private _vkeys;
    private _native_scripts;
    private _bootstraps;
    private _plutus_scripts_v1;
    private _plutus_data;
    private _redeemers;
    private _plutus_scripts_v2;
    private _plutus_scripts_v3;
    constructor(vkeys: Vkeywitnesses | undefined, native_scripts: NativeScripts | undefined, bootstraps: BootstrapWitnesses | undefined, plutus_scripts_v1: PlutusScripts | undefined, plutus_data: PlutusList | undefined, redeemers: Redeemers | undefined, plutus_scripts_v2: PlutusScripts | undefined, plutus_scripts_v3: PlutusScripts | undefined);
    static new(vkeys: Vkeywitnesses | undefined, native_scripts: NativeScripts | undefined, bootstraps: BootstrapWitnesses | undefined, plutus_scripts_v1: PlutusScripts | undefined, plutus_data: PlutusList | undefined, redeemers: Redeemers | undefined, plutus_scripts_v2: PlutusScripts | undefined, plutus_scripts_v3: PlutusScripts | undefined): TransactionWitnessSet;
    get_vkeys(): Vkeywitnesses | undefined;
    set_vkeys(vkeys: Vkeywitnesses | undefined): void;
    get_native_scripts(): NativeScripts | undefined;
    set_native_scripts(native_scripts: NativeScripts | undefined): void;
    get_bootstraps(): BootstrapWitnesses | undefined;
    set_bootstraps(bootstraps: BootstrapWitnesses | undefined): void;
    get_plutus_scripts_v1(): PlutusScripts | undefined;
    set_plutus_scripts_v1(plutus_scripts_v1: PlutusScripts | undefined): void;
    get_plutus_data(): PlutusList | undefined;
    set_plutus_data(plutus_data: PlutusList | undefined): void;
    get_redeemers(): Redeemers | undefined;
    set_redeemers(redeemers: Redeemers | undefined): void;
    get_plutus_scripts_v2(): PlutusScripts | undefined;
    set_plutus_scripts_v2(plutus_scripts_v2: PlutusScripts | undefined): void;
    get_plutus_scripts_v3(): PlutusScripts | undefined;
    set_plutus_scripts_v3(plutus_scripts_v3: PlutusScripts | undefined): void;
    static deserialize(reader: CBORReader): TransactionWitnessSet;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): TransactionWitnessSet;
    static from_hex(hex_str: string): TransactionWitnessSet;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): TransactionWitnessSet;
}
export declare class TransactionWitnessSets {
    private items;
    constructor(items: TransactionWitnessSet[]);
    static new(): TransactionWitnessSets;
    len(): number;
    get(index: number): TransactionWitnessSet;
    add(elem: TransactionWitnessSet): void;
    static deserialize(reader: CBORReader): TransactionWitnessSets;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): TransactionWitnessSets;
    static from_hex(hex_str: string): TransactionWitnessSets;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): TransactionWitnessSets;
}
export declare class TreasuryWithdrawals {
    private items;
    constructor(items: [unknown, BigNum][]);
    static new(): TreasuryWithdrawals;
    len(): number;
    insert(key: unknown, value: BigNum): BigNum | undefined;
    get(key: unknown): BigNum | undefined;
    _remove_many(keys: unknown[]): void;
    keys(): RewardAddresses;
    static deserialize(reader: CBORReader): TreasuryWithdrawals;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): TreasuryWithdrawals;
    static from_hex(hex_str: string): TreasuryWithdrawals;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): TreasuryWithdrawals;
}
export declare class TreasuryWithdrawalsAction {
    private _withdrawals;
    private _policy_hash;
    constructor(withdrawals: TreasuryWithdrawals, policy_hash: ScriptHash | undefined);
    static new(withdrawals: TreasuryWithdrawals, policy_hash: ScriptHash | undefined): TreasuryWithdrawalsAction;
    get_withdrawals(): TreasuryWithdrawals;
    set_withdrawals(withdrawals: TreasuryWithdrawals): void;
    get_policy_hash(): ScriptHash | undefined;
    set_policy_hash(policy_hash: ScriptHash | undefined): void;
    static deserialize(reader: CBORReader): TreasuryWithdrawalsAction;
    serialize(writer: CBORWriter): void;
}
export declare class URL {
    private inner;
    constructor(inner: string);
    static new(inner: string): URL;
    url(): string;
    static deserialize(reader: CBORReader): URL;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): URL;
    static from_hex(hex_str: string): URL;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): URL;
}
export declare class UnitInterval {
    private _numerator;
    private _denominator;
    constructor(numerator: BigNum, denominator: BigNum);
    static new(numerator: BigNum, denominator: BigNum): UnitInterval;
    get_numerator(): BigNum;
    set_numerator(numerator: BigNum): void;
    get_denominator(): BigNum;
    set_denominator(denominator: BigNum): void;
    static deserialize(reader: CBORReader): UnitInterval;
    static deserializeInner(reader: CBORReader): UnitInterval;
    serialize(writer: CBORWriter): void;
    serializeInner(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): UnitInterval;
    static from_hex(hex_str: string): UnitInterval;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): UnitInterval;
}
export declare class UnregCert {
    private _stake_credential;
    private _coin;
    constructor(stake_credential: Credential, coin: BigNum);
    static new(stake_credential: Credential, coin: BigNum): UnregCert;
    get_stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    get_coin(): BigNum;
    set_coin(coin: BigNum): void;
    static deserialize(reader: CBORReader): UnregCert;
    serialize(writer: CBORWriter): void;
}
export declare class Update {
    private _proposed_protocol_parameter_updates;
    private _epoch;
    constructor(proposed_protocol_parameter_updates: ProposedProtocolParameterUpdates, epoch: number);
    static new(proposed_protocol_parameter_updates: ProposedProtocolParameterUpdates, epoch: number): Update;
    get_proposed_protocol_parameter_updates(): ProposedProtocolParameterUpdates;
    set_proposed_protocol_parameter_updates(proposed_protocol_parameter_updates: ProposedProtocolParameterUpdates): void;
    get_epoch(): number;
    set_epoch(epoch: number): void;
    static deserialize(reader: CBORReader): Update;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Update;
    static from_hex(hex_str: string): Update;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Update;
}
export declare class UpdateCommitteeAction {
    private _gov_action_id;
    private _members_to_remove;
    private _committee;
    private _quorom_threshold;
    constructor(gov_action_id: GovernanceActionId | undefined, members_to_remove: Credentials, committee: unknown, quorom_threshold: UnitInterval);
    static new(gov_action_id: GovernanceActionId | undefined, members_to_remove: Credentials, committee: unknown, quorom_threshold: UnitInterval): UpdateCommitteeAction;
    get_gov_action_id(): GovernanceActionId | undefined;
    set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void;
    get_members_to_remove(): Credentials;
    set_members_to_remove(members_to_remove: Credentials): void;
    get_committee(): unknown;
    set_committee(committee: unknown): void;
    get_quorom_threshold(): UnitInterval;
    set_quorom_threshold(quorom_threshold: UnitInterval): void;
    static deserialize(reader: CBORReader): UpdateCommitteeAction;
    serialize(writer: CBORWriter): void;
}
export declare class VRFCert {
    private _output;
    private _proof;
    constructor(output: Uint8Array, proof: Uint8Array);
    static new(output: Uint8Array, proof: Uint8Array): VRFCert;
    get_output(): Uint8Array;
    set_output(output: Uint8Array): void;
    get_proof(): Uint8Array;
    set_proof(proof: Uint8Array): void;
    static deserialize(reader: CBORReader): VRFCert;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): VRFCert;
    static from_hex(hex_str: string): VRFCert;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): VRFCert;
}
export declare class VRFKeyHash {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): VRFKeyHash;
    static from_bech32(bech_str: string): VRFKeyHash;
    to_bech32(prefix: string): string;
    free(): void;
    static from_bytes(data: Uint8Array): VRFKeyHash;
    static from_hex(hex_str: string): VRFKeyHash;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): VRFKeyHash;
    static deserialize(reader: CBORReader): VRFKeyHash;
    serialize(writer: CBORWriter): void;
}
export declare class VRFVKey {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): VRFVKey;
    static from_bech32(bech_str: string): VRFVKey;
    to_bech32(prefix: string): string;
    free(): void;
    static from_bytes(data: Uint8Array): VRFVKey;
    static from_hex(hex_str: string): VRFVKey;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): VRFVKey;
    static deserialize(reader: CBORReader): VRFVKey;
    serialize(writer: CBORWriter): void;
}
export declare class Value {
    private _coin;
    private _multiasset;
    constructor(coin: BigNum, multiasset: MultiAsset | undefined);
    static new_with_assets(coin: BigNum, multiasset: MultiAsset | undefined): Value;
    get_coin(): BigNum;
    set_coin(coin: BigNum): void;
    get_multiasset(): MultiAsset | undefined;
    set_multiasset(multiasset: MultiAsset | undefined): void;
    static deserializeRecord(reader: CBORReader): Value;
    serializeRecord(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Value;
    static from_hex(hex_str: string): Value;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Value;
    static zero(): Value;
    static new(coin: BigNum): Value;
    static new_from_assets(multiasset: MultiAsset): Value;
    static deserialize(reader: CBORReader): Value;
    serialize(writer: CBORWriter): void;
    checked_add(rhs: Value): Value;
    checked_sub(rhs: Value): Value;
    clamped_sub(rhs: Value): Value;
    compare(rhs_value: Value): number | undefined;
}
export declare class Vkeywitness {
    private _vkey;
    private _signature;
    constructor(vkey: unknown, signature: Ed25519Signature);
    static new(vkey: unknown, signature: Ed25519Signature): Vkeywitness;
    get_vkey(): unknown;
    set_vkey(vkey: unknown): void;
    get_signature(): Ed25519Signature;
    set_signature(signature: Ed25519Signature): void;
    static deserialize(reader: CBORReader): Vkeywitness;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Vkeywitness;
    static from_hex(hex_str: string): Vkeywitness;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Vkeywitness;
}
export declare class Vkeywitnesses {
    private items;
    constructor();
    static new(): Vkeywitnesses;
    len(): number;
    get(index: number): Vkeywitness;
    add(elem: Vkeywitness): boolean;
    contains(elem: Vkeywitness): boolean;
    static deserialize(reader: CBORReader): Vkeywitnesses;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Vkeywitnesses;
    static from_hex(hex_str: string): Vkeywitnesses;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Vkeywitnesses;
}
export declare class VoteDelegation {
    private _stake_credential;
    private _drep;
    constructor(stake_credential: Credential, drep: DRep);
    static new(stake_credential: Credential, drep: DRep): VoteDelegation;
    get_stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    get_drep(): DRep;
    set_drep(drep: DRep): void;
    static deserialize(reader: CBORReader): VoteDelegation;
    serialize(writer: CBORWriter): void;
}
export declare class VoteRegistrationAndDelegation {
    private _stake_credential;
    private _drep;
    private _coin;
    constructor(stake_credential: Credential, drep: DRep, coin: BigNum);
    static new(stake_credential: Credential, drep: DRep, coin: BigNum): VoteRegistrationAndDelegation;
    get_stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    get_drep(): DRep;
    set_drep(drep: DRep): void;
    get_coin(): BigNum;
    set_coin(coin: BigNum): void;
    static deserialize(reader: CBORReader): VoteRegistrationAndDelegation;
    serialize(writer: CBORWriter): void;
}
export declare class Voter {
    private _constitutional_committee_hot_key;
    private _drep;
    private _staking_pool;
    constructor(constitutional_committee_hot_key: Credential, drep: Credential, staking_pool: Ed25519KeyHash);
    static new(constitutional_committee_hot_key: Credential, drep: Credential, staking_pool: Ed25519KeyHash): Voter;
    get_constitutional_committee_hot_key(): Credential;
    set_constitutional_committee_hot_key(constitutional_committee_hot_key: Credential): void;
    get_drep(): Credential;
    set_drep(drep: Credential): void;
    get_staking_pool(): Ed25519KeyHash;
    set_staking_pool(staking_pool: Ed25519KeyHash): void;
    static deserialize(reader: CBORReader): Voter;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Voter;
    static from_hex(hex_str: string): Voter;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Voter;
}
export declare class Voters {
    private items;
    constructor(items: Voter[]);
    static new(): Voters;
    len(): number;
    get(index: number): Voter;
    add(elem: Voter): void;
    static deserialize(reader: CBORReader): Voters;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Voters;
    static from_hex(hex_str: string): Voters;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Voters;
}
export declare class VotingProcedure {
    private _vote;
    private _anchor;
    constructor(vote: VoteKind, anchor: Anchor | undefined);
    static new(vote: VoteKind, anchor: Anchor | undefined): VotingProcedure;
    get_vote(): VoteKind;
    set_vote(vote: VoteKind): void;
    get_anchor(): Anchor | undefined;
    set_anchor(anchor: Anchor | undefined): void;
    static deserialize(reader: CBORReader): VotingProcedure;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): VotingProcedure;
    static from_hex(hex_str: string): VotingProcedure;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): VotingProcedure;
}
export declare class VotingProcedures {
    private items;
    constructor(items: [Voter, GovernanceActions][]);
    static new(): VotingProcedures;
    len(): number;
    insert(key: Voter, value: GovernanceActions): GovernanceActions | undefined;
    get(key: Voter): GovernanceActions | undefined;
    _remove_many(keys: Voter[]): void;
    keys(): Voters;
    static deserialize(reader: CBORReader): VotingProcedures;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): VotingProcedures;
    static from_hex(hex_str: string): VotingProcedures;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): VotingProcedures;
    insert_voter_and_gov_action(voter: Voter, governance_action_id: GovernanceActionId, voting_procedure: VotingProcedure): void;
    get_by_voter_and_gov_action(voter: Voter, governance_action_id: GovernanceActionId): VotingProcedure | undefined;
    get_voters(): Voters;
    get_governance_action_ids_by_voter(voter: Voter): GovernanceActionIds;
}
export declare class VotingProposal {
    private _deposit;
    private _reward_account;
    private _governance_action;
    private _anchor;
    constructor(deposit: BigNum, reward_account: unknown, governance_action: GovernanceAction, anchor: Anchor);
    static new(deposit: BigNum, reward_account: unknown, governance_action: GovernanceAction, anchor: Anchor): VotingProposal;
    get_deposit(): BigNum;
    set_deposit(deposit: BigNum): void;
    get_reward_account(): unknown;
    set_reward_account(reward_account: unknown): void;
    get_governance_action(): GovernanceAction;
    set_governance_action(governance_action: GovernanceAction): void;
    get_anchor(): Anchor;
    set_anchor(anchor: Anchor): void;
    static deserialize(reader: CBORReader): VotingProposal;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): VotingProposal;
    static from_hex(hex_str: string): VotingProposal;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): VotingProposal;
}
export declare class VotingProposals {
    private items;
    constructor();
    static new(): VotingProposals;
    len(): number;
    get(index: number): VotingProposal;
    add(elem: VotingProposal): boolean;
    contains(elem: VotingProposal): boolean;
    static deserialize(reader: CBORReader): VotingProposals;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): VotingProposals;
    static from_hex(hex_str: string): VotingProposals;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): VotingProposals;
}
export declare class Withdrawals {
    private items;
    constructor(items: [unknown, BigNum][]);
    static new(): Withdrawals;
    len(): number;
    insert(key: unknown, value: BigNum): BigNum | undefined;
    get(key: unknown): BigNum | undefined;
    _remove_many(keys: unknown[]): void;
    static deserialize(reader: CBORReader): Withdrawals;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Withdrawals;
    static from_hex(hex_str: string): Withdrawals;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Withdrawals;
}
export declare class certificates {
    private items;
    constructor();
    static new(): certificates;
    len(): number;
    get(index: number): Certificate;
    add(elem: Certificate): boolean;
    contains(elem: Certificate): boolean;
    static deserialize(reader: CBORReader): certificates;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): certificates;
    static from_hex(hex_str: string): certificates;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): certificates;
}
