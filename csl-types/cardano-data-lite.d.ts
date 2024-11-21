export declare class Anchor {
    private _url;
    private _anchor_data_hash;
    constructor(url: URL, anchor_data_hash: AnchorDataHash);
    static new(url: URL, anchor_data_hash: AnchorDataHash): Anchor;
    url(): URL;
    set_url(url: URL): void;
    anchor_data_hash(): AnchorDataHash;
    set_anchor_data_hash(anchor_data_hash: AnchorDataHash): void;
    static deserialize(reader: CBORReader, path: string[]): Anchor;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Anchor;
    static from_hex(hex_str: string, path?: string[]): Anchor;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Anchor;
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
    static deserialize(reader: CBORReader, path: string[]): AnchorDataHash;
    serialize(writer: CBORWriter): void;
}
export declare class AssetName {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): AssetName;
    name(): Uint8Array;
    static deserialize(reader: CBORReader, path: string[]): AssetName;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): AssetName;
    static from_hex(hex_str: string, path?: string[]): AssetName;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): AssetName;
}
export declare class AssetNames {
    private items;
    constructor(items: AssetName[]);
    static new(): AssetNames;
    len(): number;
    get(index: number): AssetName;
    add(elem: AssetName): void;
    static deserialize(reader: CBORReader, path: string[]): AssetNames;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): AssetNames;
    static from_hex(hex_str: string, path?: string[]): AssetNames;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): AssetNames;
}
export declare class Assets {
    _items: [AssetName, BigNum][];
    constructor(items: [AssetName, BigNum][]);
    static new(): Assets;
    len(): number;
    insert(key: AssetName, value: BigNum): BigNum | undefined;
    get(key: AssetName): BigNum | undefined;
    _remove_many(keys: AssetName[]): void;
    keys(): AssetNames;
    static deserialize(reader: CBORReader, path: string[]): Assets;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Assets;
    static from_hex(hex_str: string, path?: string[]): Assets;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Assets;
    _inplace_checked_add(rhs: Assets): void;
    _inplace_clamped_sub(rhs: Assets): void;
    _normalize(): void;
    _partial_cmp(rhs: Assets): number | undefined;
}
export declare enum AuxiliaryDataKind {
    GeneralTransactionMetadata = 0,
    AuxiliaryDataShelleyMa = 1,
    AuxiliaryDataPostAlonzo = 2
}
export type AuxiliaryDataVariant = {
    kind: 0;
    value: GeneralTransactionMetadata;
} | {
    kind: 1;
    value: AuxiliaryDataShelleyMa;
} | {
    kind: 2;
    value: AuxiliaryDataPostAlonzo;
};
export declare class AuxiliaryData {
    private variant;
    constructor(variant: AuxiliaryDataVariant);
    static new_shelley_metadata(shelley_metadata: GeneralTransactionMetadata): AuxiliaryData;
    static new_shelley_metadata_ma(shelley_metadata_ma: AuxiliaryDataShelleyMa): AuxiliaryData;
    static new_postalonzo_metadata(postalonzo_metadata: AuxiliaryDataPostAlonzo): AuxiliaryData;
    as_shelley_metadata(): GeneralTransactionMetadata;
    as_shelley_metadata_ma(): AuxiliaryDataShelleyMa;
    as_postalonzo_metadata(): AuxiliaryDataPostAlonzo;
    kind(): AuxiliaryDataKind;
    static deserialize(reader: CBORReader, path: string[]): AuxiliaryData;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): AuxiliaryData;
    static from_hex(hex_str: string, path?: string[]): AuxiliaryData;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): AuxiliaryData;
    static new(): AuxiliaryData;
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
    static deserialize(reader: CBORReader, path: string[]): AuxiliaryDataHash;
    serialize(writer: CBORWriter): void;
}
export declare class AuxiliaryDataPostAlonzo {
    private _metadata;
    private _native_scripts;
    private _plutus_scripts_v1;
    private _plutus_scripts_v2;
    private _plutus_scripts_v3;
    constructor(metadata: GeneralTransactionMetadata | undefined, native_scripts: NativeScripts | undefined, plutus_scripts_v1: PlutusScripts | undefined, plutus_scripts_v2: PlutusScripts | undefined, plutus_scripts_v3: PlutusScripts | undefined);
    static new(metadata: GeneralTransactionMetadata | undefined, native_scripts: NativeScripts | undefined, plutus_scripts_v1: PlutusScripts | undefined, plutus_scripts_v2: PlutusScripts | undefined, plutus_scripts_v3: PlutusScripts | undefined): AuxiliaryDataPostAlonzo;
    metadata(): GeneralTransactionMetadata | undefined;
    set_metadata(metadata: GeneralTransactionMetadata | undefined): void;
    native_scripts(): NativeScripts | undefined;
    set_native_scripts(native_scripts: NativeScripts | undefined): void;
    plutus_scripts_v1(): PlutusScripts | undefined;
    set_plutus_scripts_v1(plutus_scripts_v1: PlutusScripts | undefined): void;
    plutus_scripts_v2(): PlutusScripts | undefined;
    set_plutus_scripts_v2(plutus_scripts_v2: PlutusScripts | undefined): void;
    plutus_scripts_v3(): PlutusScripts | undefined;
    set_plutus_scripts_v3(plutus_scripts_v3: PlutusScripts | undefined): void;
    static deserialize(reader: CBORReader, path?: string[]): AuxiliaryDataPostAlonzo;
    static deserializeInner(reader: CBORReader, path: string[]): AuxiliaryDataPostAlonzo;
    serialize(writer: CBORWriter): void;
    serializeInner(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): AuxiliaryDataPostAlonzo;
    static from_hex(hex_str: string, path?: string[]): AuxiliaryDataPostAlonzo;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): AuxiliaryDataPostAlonzo;
}
export declare class AuxiliaryDataSet {
    _items: [number, AuxiliaryData][];
    constructor(items: [number, AuxiliaryData][]);
    static new(): AuxiliaryDataSet;
    len(): number;
    insert(key: number, value: AuxiliaryData): AuxiliaryData | undefined;
    get(key: number): AuxiliaryData | undefined;
    _remove_many(keys: number[]): void;
    static deserialize(reader: CBORReader, path: string[]): AuxiliaryDataSet;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): AuxiliaryDataSet;
    static from_hex(hex_str: string, path?: string[]): AuxiliaryDataSet;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): AuxiliaryDataSet;
    indices(): Uint32Array;
}
export declare class AuxiliaryDataShelleyMa {
    private _transaction_metadata;
    private _auxiliary_scripts;
    constructor(transaction_metadata: GeneralTransactionMetadata, auxiliary_scripts: NativeScripts);
    static new(transaction_metadata: GeneralTransactionMetadata, auxiliary_scripts: NativeScripts): AuxiliaryDataShelleyMa;
    transaction_metadata(): GeneralTransactionMetadata;
    set_transaction_metadata(transaction_metadata: GeneralTransactionMetadata): void;
    auxiliary_scripts(): NativeScripts;
    set_auxiliary_scripts(auxiliary_scripts: NativeScripts): void;
    static deserialize(reader: CBORReader, path: string[]): AuxiliaryDataShelleyMa;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): AuxiliaryDataShelleyMa;
    static from_hex(hex_str: string, path?: string[]): AuxiliaryDataShelleyMa;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): AuxiliaryDataShelleyMa;
}
export declare class BigNum {
    private inner;
    constructor(inner: bigint);
    static new(inner: bigint): BigNum;
    toJsValue(): bigint;
    static deserialize(reader: CBORReader, path: string[]): BigNum;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): BigNum;
    static from_hex(hex_str: string, path?: string[]): BigNum;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): BigNum;
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
    static _from_number(x: number): BigNum;
    _to_number(): number;
}
export declare class Bip32PrivateKey {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): Bip32PrivateKey;
    static from_hex(hex_str: string): Bip32PrivateKey;
    as_bytes(): Uint8Array;
    to_hex(): string;
    static deserialize(reader: CBORReader, path: string[]): Bip32PrivateKey;
    serialize(writer: CBORWriter): void;
    static _LEN: number;
    static _BECH32_HRP: string;
    free(): void;
    static from_bech32(bech_str: string): Bip32PrivateKey;
    to_bech32(): string;
    to_raw_key(): PrivateKey;
    to_public(): Bip32PublicKey;
    static from_128_xprv(bytes: Uint8Array): Bip32PrivateKey;
    to_128_xprv(): Uint8Array;
    chaincode(): Uint8Array;
    derive(index: number): Bip32PrivateKey;
    static generate_ed25519_bip32(): Bip32PrivateKey;
    static from_bip39_entropy(entropy: Uint8Array, password: Uint8Array): Bip32PrivateKey;
    static from_bytes(bytes: Uint8Array): Bip32PrivateKey;
}
export declare class Bip32PublicKey {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): Bip32PublicKey;
    free(): void;
    static from_bytes(data: Uint8Array): Bip32PublicKey;
    static from_hex(hex_str: string): Bip32PublicKey;
    as_bytes(): Uint8Array;
    to_hex(): string;
    static deserialize(reader: CBORReader, path: string[]): Bip32PublicKey;
    serialize(writer: CBORWriter): void;
    static _LEN: number;
    static _BECH32_HRP: string;
    chaincode(): Uint8Array;
    static from_bech32(bech_str: string): Bip32PublicKey;
    to_bech32(): string;
    to_raw_key(): PublicKey;
    derive(index: number): Bip32PublicKey;
}
export declare class Block {
    private _header;
    private _transaction_bodies;
    private _transaction_witness_sets;
    private _auxiliary_data_set;
    private _invalid_transactions;
    constructor(header: Header, transaction_bodies: TransactionBodies, transaction_witness_sets: TransactionWitnessSets, auxiliary_data_set: AuxiliaryDataSet, invalid_transactions: Uint32Array);
    static new(header: Header, transaction_bodies: TransactionBodies, transaction_witness_sets: TransactionWitnessSets, auxiliary_data_set: AuxiliaryDataSet, invalid_transactions: Uint32Array): Block;
    header(): Header;
    set_header(header: Header): void;
    transaction_bodies(): TransactionBodies;
    set_transaction_bodies(transaction_bodies: TransactionBodies): void;
    transaction_witness_sets(): TransactionWitnessSets;
    set_transaction_witness_sets(transaction_witness_sets: TransactionWitnessSets): void;
    auxiliary_data_set(): AuxiliaryDataSet;
    set_auxiliary_data_set(auxiliary_data_set: AuxiliaryDataSet): void;
    invalid_transactions(): Uint32Array;
    set_invalid_transactions(invalid_transactions: Uint32Array): void;
    static deserialize(reader: CBORReader, path: string[]): Block;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Block;
    static from_hex(hex_str: string, path?: string[]): Block;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Block;
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
    static deserialize(reader: CBORReader, path: string[]): BlockHash;
    serialize(writer: CBORWriter): void;
}
export declare class BootstrapWitness {
    private _vkey;
    private _signature;
    private _chain_code;
    private _attributes;
    constructor(vkey: Vkey, signature: Ed25519Signature, chain_code: Uint8Array, attributes: Uint8Array);
    static new(vkey: Vkey, signature: Ed25519Signature, chain_code: Uint8Array, attributes: Uint8Array): BootstrapWitness;
    vkey(): Vkey;
    set_vkey(vkey: Vkey): void;
    signature(): Ed25519Signature;
    set_signature(signature: Ed25519Signature): void;
    chain_code(): Uint8Array;
    set_chain_code(chain_code: Uint8Array): void;
    attributes(): Uint8Array;
    set_attributes(attributes: Uint8Array): void;
    static deserialize(reader: CBORReader, path: string[]): BootstrapWitness;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): BootstrapWitness;
    static from_hex(hex_str: string, path?: string[]): BootstrapWitness;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): BootstrapWitness;
}
export declare class BootstrapWitnesses {
    private items;
    constructor(items: BootstrapWitness[]);
    static new(): BootstrapWitnesses;
    len(): number;
    get(index: number): BootstrapWitness;
    add(elem: BootstrapWitness): void;
    static deserialize(reader: CBORReader, path: string[]): BootstrapWitnesses;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): BootstrapWitnesses;
    static from_hex(hex_str: string, path?: string[]): BootstrapWitnesses;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): BootstrapWitnesses;
}
export declare class CSLBigInt {
    private inner;
    constructor(inner: bigint);
    static new(inner: bigint): CSLBigInt;
    toJsValue(): bigint;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): CSLBigInt;
    static from_hex(hex_str: string, path?: string[]): CSLBigInt;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): CSLBigInt;
    static from_str(string: string): CSLBigInt;
    to_str(): string;
    static zero(): CSLBigInt;
    static one(): CSLBigInt;
    is_zero(): boolean;
    add(other: CSLBigInt): CSLBigInt;
    sub(other: CSLBigInt): CSLBigInt;
    mul(other: CSLBigInt): CSLBigInt;
    pow(other: number): CSLBigInt;
    div_floor(other: CSLBigInt): CSLBigInt;
    div_ceil(other: CSLBigInt): CSLBigInt;
    abs(): CSLBigInt;
    increment(): CSLBigInt;
    static max(a: CSLBigInt, b: CSLBigInt): CSLBigInt;
    as_u64(): BigNum | undefined;
    as_int(): Int | undefined;
    serialize(writer: CBORWriter): void;
    static deserialize(reader: CBORReader, path: string[]): CSLBigInt;
}
export { CSLBigInt as BigInt };
export declare enum CertificateKind {
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
    DRepUpdate = 18
}
export type CertificateVariant = {
    kind: 0;
    value: StakeRegistration;
} | {
    kind: 1;
    value: StakeDeregistration;
} | {
    kind: 2;
    value: StakeDelegation;
} | {
    kind: 3;
    value: PoolRegistration;
} | {
    kind: 4;
    value: PoolRetirement;
} | {
    kind: 7;
    value: RegCert;
} | {
    kind: 8;
    value: UnregCert;
} | {
    kind: 9;
    value: VoteDelegation;
} | {
    kind: 10;
    value: StakeAndVoteDelegation;
} | {
    kind: 11;
    value: StakeRegistrationAndDelegation;
} | {
    kind: 12;
    value: VoteRegistrationAndDelegation;
} | {
    kind: 13;
    value: StakeVoteRegistrationAndDelegation;
} | {
    kind: 14;
    value: CommitteeHotAuth;
} | {
    kind: 15;
    value: CommitteeColdResign;
} | {
    kind: 16;
    value: DRepRegistration;
} | {
    kind: 17;
    value: DRepDeregistration;
} | {
    kind: 18;
    value: DRepUpdate;
};
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
    static new_drep_registration(drep_registration: DRepRegistration): Certificate;
    static new_drep_deregistration(drep_deregistration: DRepDeregistration): Certificate;
    static new_drep_update(drep_update: DRepUpdate): Certificate;
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
    as_drep_registration(): DRepRegistration | undefined;
    as_drep_deregistration(): DRepDeregistration | undefined;
    as_drep_update(): DRepUpdate | undefined;
    kind(): CertificateKind;
    static deserialize(reader: CBORReader, path: string[]): Certificate;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Certificate;
    static from_hex(hex_str: string, path?: string[]): Certificate;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Certificate;
}
export declare class Certificates {
    private items;
    constructor();
    static new(): Certificates;
    len(): number;
    get(index: number): Certificate;
    add(elem: Certificate): boolean;
    contains(elem: Certificate): boolean;
    static deserialize(reader: CBORReader, path: string[]): Certificates;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Certificates;
    static from_hex(hex_str: string, path?: string[]): Certificates;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Certificates;
}
export declare class ChangeConfig {
    private _address;
    private _plutus_data;
    private _script_ref;
    constructor(address: Address, plutus_data: OutputDatum | undefined, script_ref: ScriptRef | undefined);
    address(): Address;
    set_address(address: Address): void;
    plutus_data(): OutputDatum | undefined;
    set_plutus_data(plutus_data: OutputDatum | undefined): void;
    script_ref(): ScriptRef | undefined;
    set_script_ref(script_ref: ScriptRef | undefined): void;
    static deserialize(reader: CBORReader, path: string[]): ChangeConfig;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): ChangeConfig;
    static from_hex(hex_str: string, path?: string[]): ChangeConfig;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): ChangeConfig;
    static new(address: Address): ChangeConfig;
    change_address(address: Address): ChangeConfig;
    change_plutus_data(plutus_data: OutputDatum): ChangeConfig;
    change_script_ref(script_ref: ScriptRef): ChangeConfig;
}
export declare class Committee {
    quorum_threshold_: UnitInterval;
    members_: CommitteeEpochs;
    constructor(quorum_threshold: UnitInterval, members: CommitteeEpochs);
    static new(quorum_threshold: UnitInterval): Committee;
    members_keys(): Credentials;
    quorum_threshold(): UnitInterval;
    add_member(committee_cold_credential: Credential, epoch: number): void;
    get_member_epoch(committee_cold_credential: Credential): number | undefined;
}
export declare class CommitteeColdResign {
    private _committee_cold_credential;
    private _anchor;
    constructor(committee_cold_credential: Credential, anchor: Anchor | undefined);
    committee_cold_credential(): Credential;
    set_committee_cold_credential(committee_cold_credential: Credential): void;
    anchor(): Anchor | undefined;
    set_anchor(anchor: Anchor | undefined): void;
    static deserialize(reader: CBORReader, path: string[]): CommitteeColdResign;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): CommitteeColdResign;
    static from_hex(hex_str: string, path?: string[]): CommitteeColdResign;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): CommitteeColdResign;
    static new(committee_cold_credential: Credential): CommitteeColdResign;
}
export declare class CommitteeEpochs {
    _items: [Credential, number][];
    constructor(items: [Credential, number][]);
    static new(): CommitteeEpochs;
    len(): number;
    insert(key: Credential, value: number): number | undefined;
    get(key: Credential): number | undefined;
    _remove_many(keys: Credential[]): void;
    static deserialize(reader: CBORReader, path: string[]): CommitteeEpochs;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): CommitteeEpochs;
    static from_hex(hex_str: string, path?: string[]): CommitteeEpochs;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): CommitteeEpochs;
}
export declare class CommitteeHotAuth {
    private _committee_cold_credential;
    private _committee_hot_credential;
    constructor(committee_cold_credential: Credential, committee_hot_credential: Credential);
    static new(committee_cold_credential: Credential, committee_hot_credential: Credential): CommitteeHotAuth;
    committee_cold_credential(): Credential;
    set_committee_cold_credential(committee_cold_credential: Credential): void;
    committee_hot_credential(): Credential;
    set_committee_hot_credential(committee_hot_credential: Credential): void;
    static deserialize(reader: CBORReader, path: string[]): CommitteeHotAuth;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): CommitteeHotAuth;
    static from_hex(hex_str: string, path?: string[]): CommitteeHotAuth;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): CommitteeHotAuth;
}
export declare class Constitution {
    private _anchor;
    private _scripthash;
    constructor(anchor: Anchor, scripthash: ScriptHash | undefined);
    anchor(): Anchor;
    set_anchor(anchor: Anchor): void;
    scripthash(): ScriptHash | undefined;
    set_scripthash(scripthash: ScriptHash | undefined): void;
    static deserialize(reader: CBORReader, path: string[]): Constitution;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Constitution;
    static from_hex(hex_str: string, path?: string[]): Constitution;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Constitution;
    static new(anchor: Anchor): Constitution;
}
export declare class ConstrPlutusData {
    private _alternative;
    private _data;
    constructor(alternative: BigNum, data: PlutusList);
    static new(alternative: BigNum, data: PlutusList): ConstrPlutusData;
    alternative(): BigNum;
    set_alternative(alternative: BigNum): void;
    data(): PlutusList;
    set_data(data: PlutusList): void;
    static deserialize(reader: CBORReader, path: string[]): ConstrPlutusData;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): ConstrPlutusData;
    static from_hex(hex_str: string, path?: string[]): ConstrPlutusData;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): ConstrPlutusData;
}
export declare class CostModel {
    private items;
    constructor(items: Int[]);
    static new(): CostModel;
    len(): number;
    get(index: number): Int;
    add(elem: Int): void;
    static deserialize(reader: CBORReader, path: string[]): CostModel;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): CostModel;
    static from_hex(hex_str: string, path?: string[]): CostModel;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): CostModel;
    set(operation: number, cost: Int): Int;
}
export declare class Costmdls {
    _items: [Language, CostModel][];
    constructor(items: [Language, CostModel][]);
    static new(): Costmdls;
    len(): number;
    insert(key: Language, value: CostModel): CostModel | undefined;
    get(key: Language): CostModel | undefined;
    _remove_many(keys: Language[]): void;
    keys(): Languages;
    static deserialize(reader: CBORReader, path: string[]): Costmdls;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Costmdls;
    static from_hex(hex_str: string, path?: string[]): Costmdls;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Costmdls;
    retain_language_versions(languages: Languages): Costmdls;
}
export declare class Credentials {
    private items;
    constructor();
    static new(): Credentials;
    len(): number;
    get(index: number): Credential;
    add(elem: Credential): boolean;
    contains(elem: Credential): boolean;
    static deserialize(reader: CBORReader, path: string[]): Credentials;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Credentials;
    static from_hex(hex_str: string, path?: string[]): Credentials;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Credentials;
}
export declare class DNSRecordAorAAAA {
    private inner;
    constructor(inner: string);
    static new(inner: string): DNSRecordAorAAAA;
    record(): string;
    static deserialize(reader: CBORReader, path: string[]): DNSRecordAorAAAA;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): DNSRecordAorAAAA;
    static from_hex(hex_str: string, path?: string[]): DNSRecordAorAAAA;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): DNSRecordAorAAAA;
}
export declare class DNSRecordSRV {
    private inner;
    constructor(inner: string);
    static new(inner: string): DNSRecordSRV;
    record(): string;
    static deserialize(reader: CBORReader, path: string[]): DNSRecordSRV;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): DNSRecordSRV;
    static from_hex(hex_str: string, path?: string[]): DNSRecordSRV;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): DNSRecordSRV;
}
export declare enum DRepKind {
    Ed25519KeyHash = 0,
    ScriptHash = 1,
    AlwaysAbstain = 2,
    AlwaysNoConfidence = 3
}
export type DRepVariant = {
    kind: 0;
    value: Ed25519KeyHash;
} | {
    kind: 1;
    value: ScriptHash;
} | {
    kind: 2;
} | {
    kind: 3;
};
export declare class DRep {
    private variant;
    constructor(variant: DRepVariant);
    static new_key_hash(key_hash: Ed25519KeyHash): DRep;
    static new_script_hash(script_hash: ScriptHash): DRep;
    static new_always_abstain(): DRep;
    static new_always_no_confidence(): DRep;
    as_key_hash(): Ed25519KeyHash | undefined;
    as_script_hash(): ScriptHash | undefined;
    kind(): DRepKind;
    static deserialize(reader: CBORReader, path: string[]): DRep;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): DRep;
    static from_hex(hex_str: string, path?: string[]): DRep;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): DRep;
}
export declare class DRepDeregistration {
    private _drep_credential;
    private _coin;
    constructor(drep_credential: Credential, coin: BigNum);
    static new(drep_credential: Credential, coin: BigNum): DRepDeregistration;
    drep_credential(): Credential;
    set_drep_credential(drep_credential: Credential): void;
    coin(): BigNum;
    set_coin(coin: BigNum): void;
    static deserialize(reader: CBORReader, path: string[]): DRepDeregistration;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): DRepDeregistration;
    static from_hex(hex_str: string, path?: string[]): DRepDeregistration;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): DRepDeregistration;
}
export declare class DRepRegistration {
    private _voting_credential;
    private _coin;
    private _anchor;
    constructor(voting_credential: Credential, coin: BigNum, anchor: Anchor | undefined);
    voting_credential(): Credential;
    set_voting_credential(voting_credential: Credential): void;
    coin(): BigNum;
    set_coin(coin: BigNum): void;
    anchor(): Anchor | undefined;
    set_anchor(anchor: Anchor | undefined): void;
    static deserialize(reader: CBORReader, path: string[]): DRepRegistration;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): DRepRegistration;
    static from_hex(hex_str: string, path?: string[]): DRepRegistration;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): DRepRegistration;
    static new(voting_credential: Credential, coin: BigNum): DRepRegistration;
}
export declare class DRepUpdate {
    private _drep_credential;
    private _anchor;
    constructor(drep_credential: Credential, anchor: Anchor | undefined);
    drep_credential(): Credential;
    set_drep_credential(drep_credential: Credential): void;
    anchor(): Anchor | undefined;
    set_anchor(anchor: Anchor | undefined): void;
    static deserialize(reader: CBORReader, path: string[]): DRepUpdate;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): DRepUpdate;
    static from_hex(hex_str: string, path?: string[]): DRepUpdate;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): DRepUpdate;
    static new(drep_credential: Credential): DRepUpdate;
}
export declare class DRepVotingThresholds {
    private _motion_no_confidence;
    private _committee_normal;
    private _committee_no_confidence;
    private _update_constitution;
    private _hard_fork_initiation;
    private _pp_network_group;
    private _pp_economic_group;
    private _pp_technical_group;
    private _pp_governance_group;
    private _treasury_withdrawal;
    constructor(motion_no_confidence: UnitInterval, committee_normal: UnitInterval, committee_no_confidence: UnitInterval, update_constitution: UnitInterval, hard_fork_initiation: UnitInterval, pp_network_group: UnitInterval, pp_economic_group: UnitInterval, pp_technical_group: UnitInterval, pp_governance_group: UnitInterval, treasury_withdrawal: UnitInterval);
    static new(motion_no_confidence: UnitInterval, committee_normal: UnitInterval, committee_no_confidence: UnitInterval, update_constitution: UnitInterval, hard_fork_initiation: UnitInterval, pp_network_group: UnitInterval, pp_economic_group: UnitInterval, pp_technical_group: UnitInterval, pp_governance_group: UnitInterval, treasury_withdrawal: UnitInterval): DRepVotingThresholds;
    motion_no_confidence(): UnitInterval;
    set_motion_no_confidence(motion_no_confidence: UnitInterval): void;
    committee_normal(): UnitInterval;
    set_committee_normal(committee_normal: UnitInterval): void;
    committee_no_confidence(): UnitInterval;
    set_committee_no_confidence(committee_no_confidence: UnitInterval): void;
    update_constitution(): UnitInterval;
    set_update_constitution(update_constitution: UnitInterval): void;
    hard_fork_initiation(): UnitInterval;
    set_hard_fork_initiation(hard_fork_initiation: UnitInterval): void;
    pp_network_group(): UnitInterval;
    set_pp_network_group(pp_network_group: UnitInterval): void;
    pp_economic_group(): UnitInterval;
    set_pp_economic_group(pp_economic_group: UnitInterval): void;
    pp_technical_group(): UnitInterval;
    set_pp_technical_group(pp_technical_group: UnitInterval): void;
    pp_governance_group(): UnitInterval;
    set_pp_governance_group(pp_governance_group: UnitInterval): void;
    treasury_withdrawal(): UnitInterval;
    set_treasury_withdrawal(treasury_withdrawal: UnitInterval): void;
    static deserialize(reader: CBORReader, path: string[]): DRepVotingThresholds;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): DRepVotingThresholds;
    static from_hex(hex_str: string, path?: string[]): DRepVotingThresholds;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): DRepVotingThresholds;
}
export declare class DataCost {
    private _coins_per_byte;
    constructor(coins_per_byte: BigNum);
    static new(coins_per_byte: BigNum): DataCost;
    coins_per_byte(): BigNum;
    set_coins_per_byte(coins_per_byte: BigNum): void;
    static deserialize(reader: CBORReader, path: string[]): DataCost;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): DataCost;
    static from_hex(hex_str: string, path?: string[]): DataCost;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): DataCost;
}
export declare class DataHash {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): DataHash;
    static from_bech32(bech_str: string): DataHash;
    to_bech32(prefix: string): string;
    free(): void;
    static from_bytes(data: Uint8Array): DataHash;
    static from_hex(hex_str: string): DataHash;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): DataHash;
    static deserialize(reader: CBORReader, path: string[]): DataHash;
    serialize(writer: CBORWriter): void;
}
export declare enum DataOptionKind {
    DataHash = 0,
    PlutusData = 1
}
export type DataOptionVariant = {
    kind: 0;
    value: DataHash;
} | {
    kind: 1;
    value: PlutusData;
};
export declare class DataOption {
    private variant;
    constructor(variant: DataOptionVariant);
    static new_hash(hash: DataHash): DataOption;
    static new_data(data: PlutusData): DataOption;
    as_hash(): DataHash | undefined;
    as_data(): PlutusData | undefined;
    kind(): DataOptionKind;
    static deserialize(reader: CBORReader, path: string[]): DataOption;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): DataOption;
    static from_hex(hex_str: string, path?: string[]): DataOption;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): DataOption;
}
export declare enum DatumSourceKind {
    PlutusData = 0,
    TransactionInput = 1
}
export type DatumSourceVariant = {
    kind: 0;
    value: PlutusData;
} | {
    kind: 1;
    value: TransactionInput;
};
export declare class DatumSource {
    private variant;
    constructor(variant: DatumSourceVariant);
    static new_datum(datum: PlutusData): DatumSource;
    static new_ref_input(ref_input: TransactionInput): DatumSource;
    as_datum(): PlutusData | undefined;
    as_ref_input(): TransactionInput | undefined;
    kind(): DatumSourceKind;
    static deserialize(reader: CBORReader, path: string[]): DatumSource;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): DatumSource;
    static from_hex(hex_str: string, path?: string[]): DatumSource;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): DatumSource;
    static new(datum: PlutusData): DatumSource;
}
export declare class Ed25519KeyHash {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): Ed25519KeyHash;
    static from_bech32(bech_str: string): Ed25519KeyHash;
    to_bech32(prefix: string): string;
    free(): void;
    static from_bytes(data: Uint8Array): Ed25519KeyHash;
    static from_hex(hex_str: string): Ed25519KeyHash;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Ed25519KeyHash;
    static deserialize(reader: CBORReader, path: string[]): Ed25519KeyHash;
    serialize(writer: CBORWriter): void;
}
export declare class Ed25519KeyHashes {
    private items;
    constructor();
    static new(): Ed25519KeyHashes;
    len(): number;
    get(index: number): Ed25519KeyHash;
    add(elem: Ed25519KeyHash): boolean;
    contains(elem: Ed25519KeyHash): boolean;
    static deserialize(reader: CBORReader, path: string[]): Ed25519KeyHashes;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Ed25519KeyHashes;
    static from_hex(hex_str: string, path?: string[]): Ed25519KeyHashes;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Ed25519KeyHashes;
}
export declare class Ed25519Signature {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): Ed25519Signature;
    free(): void;
    static from_bytes(data: Uint8Array): Ed25519Signature;
    static from_hex(hex_str: string): Ed25519Signature;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(): Ed25519Signature;
    static deserialize(reader: CBORReader, path: string[]): Ed25519Signature;
    serialize(writer: CBORWriter): void;
    static _BECH32_HRP: string;
    static from_bech32(bech_str: string): Ed25519Signature;
    to_bech32(): void;
}
export declare class ExUnitPrices {
    private _mem_price;
    private _step_price;
    constructor(mem_price: UnitInterval, step_price: UnitInterval);
    static new(mem_price: UnitInterval, step_price: UnitInterval): ExUnitPrices;
    mem_price(): UnitInterval;
    set_mem_price(mem_price: UnitInterval): void;
    step_price(): UnitInterval;
    set_step_price(step_price: UnitInterval): void;
    static deserialize(reader: CBORReader, path: string[]): ExUnitPrices;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): ExUnitPrices;
    static from_hex(hex_str: string, path?: string[]): ExUnitPrices;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): ExUnitPrices;
}
export declare class ExUnits {
    private _mem;
    private _steps;
    constructor(mem: BigNum, steps: BigNum);
    static new(mem: BigNum, steps: BigNum): ExUnits;
    mem(): BigNum;
    set_mem(mem: BigNum): void;
    steps(): BigNum;
    set_steps(steps: BigNum): void;
    static deserialize(reader: CBORReader, path: string[]): ExUnits;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): ExUnits;
    static from_hex(hex_str: string, path?: string[]): ExUnits;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): ExUnits;
}
export declare class GeneralTransactionMetadata {
    _items: [BigNum, TransactionMetadatum][];
    constructor(items: [BigNum, TransactionMetadatum][]);
    static new(): GeneralTransactionMetadata;
    len(): number;
    insert(key: BigNum, value: TransactionMetadatum): TransactionMetadatum | undefined;
    get(key: BigNum): TransactionMetadatum | undefined;
    _remove_many(keys: BigNum[]): void;
    keys(): TransactionMetadatumLabels;
    static deserialize(reader: CBORReader, path: string[]): GeneralTransactionMetadata;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): GeneralTransactionMetadata;
    static from_hex(hex_str: string, path?: string[]): GeneralTransactionMetadata;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): GeneralTransactionMetadata;
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
    static deserialize(reader: CBORReader, path: string[]): GenesisDelegateHash;
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
    static deserialize(reader: CBORReader, path: string[]): GenesisHash;
    serialize(writer: CBORWriter): void;
}
export declare class GenesisHashes {
    private items;
    constructor(items: GenesisHash[]);
    static new(): GenesisHashes;
    len(): number;
    get(index: number): GenesisHash;
    add(elem: GenesisHash): void;
    static deserialize(reader: CBORReader, path: string[]): GenesisHashes;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): GenesisHashes;
    static from_hex(hex_str: string, path?: string[]): GenesisHashes;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): GenesisHashes;
}
export declare enum GovernanceActionKind {
    ParameterChangeAction = 0,
    HardForkInitiationAction = 1,
    TreasuryWithdrawalsAction = 2,
    NoConfidenceAction = 3,
    UpdateCommitteeAction = 4,
    NewConstitutionAction = 5,
    InfoAction = 6
}
export type GovernanceActionVariant = {
    kind: 0;
    value: ParameterChangeAction;
} | {
    kind: 1;
    value: HardForkInitiationAction;
} | {
    kind: 2;
    value: TreasuryWithdrawalsAction;
} | {
    kind: 3;
    value: NoConfidenceAction;
} | {
    kind: 4;
    value: UpdateCommitteeAction;
} | {
    kind: 5;
    value: NewConstitutionAction;
} | {
    kind: 6;
    value: InfoAction;
};
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
    kind(): GovernanceActionKind;
    static deserialize(reader: CBORReader, path: string[]): GovernanceAction;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): GovernanceAction;
    static from_hex(hex_str: string, path?: string[]): GovernanceAction;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): GovernanceAction;
}
export declare class GovernanceActionId {
    private _transaction_id;
    private _index;
    constructor(transaction_id: TransactionHash, index: number);
    static new(transaction_id: TransactionHash, index: number): GovernanceActionId;
    transaction_id(): TransactionHash;
    set_transaction_id(transaction_id: TransactionHash): void;
    index(): number;
    set_index(index: number): void;
    static deserialize(reader: CBORReader, path: string[]): GovernanceActionId;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): GovernanceActionId;
    static from_hex(hex_str: string, path?: string[]): GovernanceActionId;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): GovernanceActionId;
}
export declare class GovernanceActionIds {
    private items;
    constructor(items: GovernanceActionId[]);
    static new(): GovernanceActionIds;
    len(): number;
    get(index: number): GovernanceActionId;
    add(elem: GovernanceActionId): void;
    static deserialize(reader: CBORReader, path: string[]): GovernanceActionIds;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): GovernanceActionIds;
    static from_hex(hex_str: string, path?: string[]): GovernanceActionIds;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): GovernanceActionIds;
}
export declare class GovernanceActions {
    _items: [GovernanceActionId, VotingProcedure][];
    constructor(items: [GovernanceActionId, VotingProcedure][]);
    static new(): GovernanceActions;
    len(): number;
    insert(key: GovernanceActionId, value: VotingProcedure): VotingProcedure | undefined;
    get(key: GovernanceActionId): VotingProcedure | undefined;
    _remove_many(keys: GovernanceActionId[]): void;
    keys(): GovernanceActionIds;
    static deserialize(reader: CBORReader, path: string[]): GovernanceActions;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): GovernanceActions;
    static from_hex(hex_str: string, path?: string[]): GovernanceActions;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): GovernanceActions;
}
export declare class HardForkInitiationAction {
    private _gov_action_id;
    private _protocol_version;
    constructor(gov_action_id: GovernanceActionId | undefined, protocol_version: ProtocolVersion);
    static new_with_action_id(gov_action_id: GovernanceActionId | undefined, protocol_version: ProtocolVersion): HardForkInitiationAction;
    gov_action_id(): GovernanceActionId | undefined;
    set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void;
    protocol_version(): ProtocolVersion;
    set_protocol_version(protocol_version: ProtocolVersion): void;
    static deserialize(reader: CBORReader, path: string[]): HardForkInitiationAction;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): HardForkInitiationAction;
    static from_hex(hex_str: string, path?: string[]): HardForkInitiationAction;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): HardForkInitiationAction;
    static new(protocol_version: ProtocolVersion): HardForkInitiationAction;
}
export declare class Header {
    private _header_body;
    private _body_signature;
    constructor(header_body: HeaderBody, body_signature: KESSignature);
    static new(header_body: HeaderBody, body_signature: KESSignature): Header;
    header_body(): HeaderBody;
    set_header_body(header_body: HeaderBody): void;
    body_signature(): KESSignature;
    set_body_signature(body_signature: KESSignature): void;
    static deserialize(reader: CBORReader, path: string[]): Header;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Header;
    static from_hex(hex_str: string, path?: string[]): Header;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Header;
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
    constructor(block_number: number, slot: BigNum, prev_hash: BlockHash | undefined, issuer_vkey: Vkey, vrf_vkey: VRFVKey, vrf_result: VRFCert, block_body_size: number, block_body_hash: BlockHash, operational_cert: OperationalCert, protocol_version: ProtocolVersion);
    static new_headerbody(block_number: number, slot: BigNum, prev_hash: BlockHash | undefined, issuer_vkey: Vkey, vrf_vkey: VRFVKey, vrf_result: VRFCert, block_body_size: number, block_body_hash: BlockHash, operational_cert: OperationalCert, protocol_version: ProtocolVersion): HeaderBody;
    block_number(): number;
    set_block_number(block_number: number): void;
    slot_bignum(): BigNum;
    set_slot(slot: BigNum): void;
    prev_hash(): BlockHash | undefined;
    set_prev_hash(prev_hash: BlockHash | undefined): void;
    issuer_vkey(): Vkey;
    set_issuer_vkey(issuer_vkey: Vkey): void;
    vrf_vkey(): VRFVKey;
    set_vrf_vkey(vrf_vkey: VRFVKey): void;
    vrf_result(): VRFCert;
    set_vrf_result(vrf_result: VRFCert): void;
    block_body_size(): number;
    set_block_body_size(block_body_size: number): void;
    block_body_hash(): BlockHash;
    set_block_body_hash(block_body_hash: BlockHash): void;
    operational_cert(): OperationalCert;
    set_operational_cert(operational_cert: OperationalCert): void;
    protocol_version(): ProtocolVersion;
    set_protocol_version(protocol_version: ProtocolVersion): void;
    static deserialize(reader: CBORReader, path: string[]): HeaderBody;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): HeaderBody;
    static from_hex(hex_str: string, path?: string[]): HeaderBody;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): HeaderBody;
    slot(): number;
    static new(block_number: number, slot: number, prev_hash: BlockHash | undefined, issuer_vkey: Vkey, vrf_vkey: VRFVKey, vrf_result: VRFCert, block_body_size: number, block_body_hash: BlockHash, operational_cert: OperationalCert, protocol_version: ProtocolVersion): HeaderBody;
}
export declare class InfoAction {
    constructor();
    static new(): InfoAction;
    static deserialize(reader: CBORReader, path: string[]): InfoAction;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): InfoAction;
    static from_hex(hex_str: string, path?: string[]): InfoAction;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): InfoAction;
}
export declare class Int {
    private inner;
    constructor(inner: bigint);
    toJsValue(): bigint;
    static deserialize(reader: CBORReader, path: string[]): Int;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Int;
    static from_hex(hex_str: string, path?: string[]): Int;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Int;
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
    static deserialize(reader: CBORReader, path: string[]): Ipv4;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Ipv4;
    static from_hex(hex_str: string, path?: string[]): Ipv4;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Ipv4;
}
export declare class Ipv6 {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): Ipv6;
    ip(): Uint8Array;
    static deserialize(reader: CBORReader, path: string[]): Ipv6;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Ipv6;
    static from_hex(hex_str: string, path?: string[]): Ipv6;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Ipv6;
}
export declare class KESSignature {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): KESSignature;
    toJsValue(): Uint8Array;
    static deserialize(reader: CBORReader, path: string[]): KESSignature;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): KESSignature;
    static from_hex(hex_str: string, path?: string[]): KESSignature;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): KESSignature;
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
    static deserialize(reader: CBORReader, path: string[]): KESVKey;
    serialize(writer: CBORWriter): void;
}
export declare enum LanguageKind {
    plutus_v1 = 0,
    plutus_v2 = 1,
    plutus_v3 = 2
}
export declare class Language {
    private kind_;
    constructor(kind: LanguageKind);
    static new_plutus_v1(): Language;
    static new_plutus_v2(): Language;
    static new_plutus_v3(): Language;
    kind(): LanguageKind;
    static deserialize(reader: CBORReader, path: string[]): Language;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Language;
    static from_hex(hex_str: string, path?: string[]): Language;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Language;
}
export declare class Languages {
    private items;
    constructor(items: Language[]);
    static new(): Languages;
    len(): number;
    get(index: number): Language;
    add(elem: Language): void;
    static deserialize(reader: CBORReader, path: string[]): Languages;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Languages;
    static from_hex(hex_str: string, path?: string[]): Languages;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Languages;
    static list(): Languages;
}
export declare class MetadataList {
    private items;
    constructor(items: TransactionMetadatum[]);
    static new(): MetadataList;
    len(): number;
    get(index: number): TransactionMetadatum;
    add(elem: TransactionMetadatum): void;
    static deserialize(reader: CBORReader, path: string[]): MetadataList;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): MetadataList;
    static from_hex(hex_str: string, path?: string[]): MetadataList;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): MetadataList;
}
export declare class MetadataMap {
    _items: [TransactionMetadatum, TransactionMetadatum][];
    constructor(items: [TransactionMetadatum, TransactionMetadatum][]);
    static new(): MetadataMap;
    len(): number;
    insert(key: TransactionMetadatum, value: TransactionMetadatum): TransactionMetadatum | undefined;
    _get(key: TransactionMetadatum): TransactionMetadatum | undefined;
    _remove_many(keys: TransactionMetadatum[]): void;
    keys(): MetadataList;
    static deserialize(reader: CBORReader, path: string[]): MetadataMap;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): MetadataMap;
    static from_hex(hex_str: string, path?: string[]): MetadataMap;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): MetadataMap;
    insert_str(key: string, value: TransactionMetadatum): TransactionMetadatum | undefined;
    insert_i32(key: number, value: TransactionMetadatum): TransactionMetadatum | undefined;
    get(key: TransactionMetadatum): TransactionMetadatum;
    get_str(key: string): TransactionMetadatum;
    get_i32(key: number): TransactionMetadatum;
    has(key: TransactionMetadatum): boolean;
}
export declare class Mint {
    _items: [ScriptHash, MintAssets][];
    constructor(items: [ScriptHash, MintAssets][]);
    static new(): Mint;
    len(): number;
    insert(key: ScriptHash, value: MintAssets): MintAssets | undefined;
    _remove_many(keys: ScriptHash[]): void;
    keys(): ScriptHashes;
    static deserialize(reader: CBORReader, path: string[]): Mint;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Mint;
    static from_hex(hex_str: string, path?: string[]): Mint;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Mint;
    get(key: ScriptHash): MintsAssets | undefined;
    _as_multiasset(isPositive: boolean): MultiAsset;
    as_positive_multiasset(): MultiAsset;
    as_negative_multiasset(): MultiAsset;
}
export declare class MintAssets {
    _items: [AssetName, Int][];
    constructor(items: [AssetName, Int][]);
    static new(): MintAssets;
    len(): number;
    insert(key: AssetName, value: Int): Int | undefined;
    get(key: AssetName): Int | undefined;
    _remove_many(keys: AssetName[]): void;
    keys(): AssetNames;
    static deserialize(reader: CBORReader, path: string[]): MintAssets;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): MintAssets;
    static from_hex(hex_str: string, path?: string[]): MintAssets;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): MintAssets;
}
export declare class MintsAssets {
    private items;
    constructor(items: MintAssets[]);
    static new(): MintsAssets;
    len(): number;
    get(index: number): MintAssets;
    add(elem: MintAssets): void;
    static deserialize(reader: CBORReader, path: string[]): MintsAssets;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): MintsAssets;
    static from_hex(hex_str: string, path?: string[]): MintsAssets;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): MintsAssets;
}
export declare class MultiAsset {
    _items: [ScriptHash, Assets][];
    constructor(items: [ScriptHash, Assets][]);
    static new(): MultiAsset;
    len(): number;
    insert(key: ScriptHash, value: Assets): Assets | undefined;
    get(key: ScriptHash): Assets | undefined;
    _remove_many(keys: ScriptHash[]): void;
    keys(): ScriptHashes;
    static deserialize(reader: CBORReader, path: string[]): MultiAsset;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): MultiAsset;
    static from_hex(hex_str: string, path?: string[]): MultiAsset;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): MultiAsset;
    set_asset(policy_id: ScriptHash, asset_name: AssetName, value: BigNum): BigNum | undefined;
    get_asset(policy_id: ScriptHash, asset_name: AssetName): BigNum;
    sub(rhs: MultiAsset, path: string[]): MultiAsset;
    _inplace_checked_add(rhs: MultiAsset): void;
    _inplace_clamped_sub(rhs: MultiAsset): void;
    _normalize(): void;
    _partial_cmp(rhs: MultiAsset): number | undefined;
}
export declare class MultiHostName {
    private _dns_name;
    constructor(dns_name: DNSRecordSRV);
    static new(dns_name: DNSRecordSRV): MultiHostName;
    dns_name(): DNSRecordSRV;
    set_dns_name(dns_name: DNSRecordSRV): void;
    static deserialize(reader: CBORReader, path: string[]): MultiHostName;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): MultiHostName;
    static from_hex(hex_str: string, path?: string[]): MultiHostName;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): MultiHostName;
}
export declare enum NativeScriptKind {
    ScriptPubkey = 0,
    ScriptAll = 1,
    ScriptAny = 2,
    ScriptNOfK = 3,
    TimelockStart = 4,
    TimelockExpiry = 5
}
export type NativeScriptVariant = {
    kind: 0;
    value: ScriptPubkey;
} | {
    kind: 1;
    value: ScriptAll;
} | {
    kind: 2;
    value: ScriptAny;
} | {
    kind: 3;
    value: ScriptNOfK;
} | {
    kind: 4;
    value: TimelockStart;
} | {
    kind: 5;
    value: TimelockExpiry;
};
export declare class NativeScript {
    private variant;
    constructor(variant: NativeScriptVariant);
    static new_script_pubkey(script_pubkey: ScriptPubkey): NativeScript;
    static new_script_all(script_all: ScriptAll): NativeScript;
    static new_script_any(script_any: ScriptAny): NativeScript;
    static new_script_n_of_k(script_n_of_k: ScriptNOfK): NativeScript;
    static new_timelock_start(timelock_start: TimelockStart): NativeScript;
    static new_timelock_expiry(timelock_expiry: TimelockExpiry): NativeScript;
    as_script_pubkey(): ScriptPubkey | undefined;
    as_script_all(): ScriptAll | undefined;
    as_script_any(): ScriptAny | undefined;
    as_script_n_of_k(): ScriptNOfK | undefined;
    as_timelock_start(): TimelockStart | undefined;
    as_timelock_expiry(): TimelockExpiry | undefined;
    kind(): NativeScriptKind;
    static deserialize(reader: CBORReader, path: string[]): NativeScript;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): NativeScript;
    static from_hex(hex_str: string, path?: string[]): NativeScript;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): NativeScript;
}
export declare class NativeScriptRefInput {
    private _script_hash;
    private _input;
    private _script_size;
    constructor(script_hash: ScriptHash, input: TransactionInput, script_size: number);
    static new(script_hash: ScriptHash, input: TransactionInput, script_size: number): NativeScriptRefInput;
    script_hash(): ScriptHash;
    set_script_hash(script_hash: ScriptHash): void;
    input(): TransactionInput;
    set_input(input: TransactionInput): void;
    script_size(): number;
    set_script_size(script_size: number): void;
    static deserialize(reader: CBORReader, path: string[]): NativeScriptRefInput;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): NativeScriptRefInput;
    static from_hex(hex_str: string, path?: string[]): NativeScriptRefInput;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): NativeScriptRefInput;
}
export declare enum NativeScriptSourceKind {
    NativeScript = 0,
    NativeScriptRefInput = 1
}
export type NativeScriptSourceVariant = {
    kind: 0;
    value: NativeScript;
} | {
    kind: 1;
    value: NativeScriptRefInput;
};
export declare class NativeScriptSource {
    private variant;
    constructor(variant: NativeScriptSourceVariant);
    static new_script(script: NativeScript): NativeScriptSource;
    static new__ref_input(_ref_input: NativeScriptRefInput): NativeScriptSource;
    as_script(): NativeScript | undefined;
    as__ref_input(): NativeScriptRefInput | undefined;
    kind(): NativeScriptSourceKind;
    static deserialize(reader: CBORReader, path: string[]): NativeScriptSource;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): NativeScriptSource;
    static from_hex(hex_str: string, path?: string[]): NativeScriptSource;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): NativeScriptSource;
    static new(script: NativeScript): NativeScriptSource;
    static new_ref_input(script_hash: ScriptHash, input: TransactionInput, script_size: number): NativeScriptSource;
    set_required_signers(key_hashes: Ed25519KeyHashes): void;
    get_ref_script_size(): number | undefined;
}
export declare class NativeScripts {
    private items;
    constructor(items: NativeScript[]);
    static new(): NativeScripts;
    len(): number;
    get(index: number): NativeScript;
    add(elem: NativeScript): void;
    static deserialize(reader: CBORReader, path: string[]): NativeScripts;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): NativeScripts;
    static from_hex(hex_str: string, path?: string[]): NativeScripts;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): NativeScripts;
}
export declare enum NetworkIdKind {
    mainnet = 0,
    testnet = 1
}
export declare class NetworkId {
    private kind_;
    constructor(kind: NetworkIdKind);
    static new_mainnet(): NetworkId;
    static new_testnet(): NetworkId;
    kind(): NetworkIdKind;
    static deserialize(reader: CBORReader, path: string[]): NetworkId;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): NetworkId;
    static from_hex(hex_str: string, path?: string[]): NetworkId;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): NetworkId;
}
export declare class NewConstitutionAction {
    private _gov_action_id;
    private _constitution;
    constructor(gov_action_id: GovernanceActionId | undefined, constitution: Constitution);
    static new_with_action_id(gov_action_id: GovernanceActionId | undefined, constitution: Constitution): NewConstitutionAction;
    gov_action_id(): GovernanceActionId | undefined;
    set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void;
    constitution(): Constitution;
    set_constitution(constitution: Constitution): void;
    static deserialize(reader: CBORReader, path: string[]): NewConstitutionAction;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): NewConstitutionAction;
    static from_hex(hex_str: string, path?: string[]): NewConstitutionAction;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): NewConstitutionAction;
    static new(constitution: Constitution): NewConstitutionAction;
}
export declare class NoConfidenceAction {
    private _gov_action_id;
    constructor(gov_action_id: GovernanceActionId | undefined);
    static new_with_action_id(gov_action_id: GovernanceActionId | undefined): NoConfidenceAction;
    gov_action_id(): GovernanceActionId | undefined;
    set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void;
    static deserialize(reader: CBORReader, path: string[]): NoConfidenceAction;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): NoConfidenceAction;
    static from_hex(hex_str: string, path?: string[]): NoConfidenceAction;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): NoConfidenceAction;
    static new(): NoConfidenceAction;
}
export declare class Nonce {
    private _hash;
    constructor(hash: Uint8Array | undefined);
    static new(hash: Uint8Array | undefined): Nonce;
    hash(): Uint8Array | undefined;
    set_hash(hash: Uint8Array | undefined): void;
    static deserialize(reader: CBORReader, path: string[]): Nonce;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Nonce;
    static from_hex(hex_str: string, path?: string[]): Nonce;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Nonce;
    static new_identity(): Nonce;
    static new_from_hash(hash: Uint8Array): Nonce;
    get_hash(): Uint8Array | undefined;
}
export declare class OperationalCert {
    private _hot_vkey;
    private _sequence_number;
    private _kes_period;
    private _sigma;
    constructor(hot_vkey: KESVKey, sequence_number: number, kes_period: number, sigma: Ed25519Signature);
    static new(hot_vkey: KESVKey, sequence_number: number, kes_period: number, sigma: Ed25519Signature): OperationalCert;
    hot_vkey(): KESVKey;
    set_hot_vkey(hot_vkey: KESVKey): void;
    sequence_number(): number;
    set_sequence_number(sequence_number: number): void;
    kes_period(): number;
    set_kes_period(kes_period: number): void;
    sigma(): Ed25519Signature;
    set_sigma(sigma: Ed25519Signature): void;
    static deserialize(reader: CBORReader, path: string[]): OperationalCert;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): OperationalCert;
    static from_hex(hex_str: string, path?: string[]): OperationalCert;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): OperationalCert;
}
export declare enum OutputDatumKind {
    DataHash = 0,
    PlutusData = 1
}
export type OutputDatumVariant = {
    kind: 0;
    value: DataHash;
} | {
    kind: 1;
    value: PlutusData;
};
export declare class OutputDatum {
    private variant;
    constructor(variant: OutputDatumVariant);
    static new_data_hash(data_hash: DataHash): OutputDatum;
    static new_data(data: PlutusData): OutputDatum;
    as_data_hash(): DataHash | undefined;
    as_data(): PlutusData | undefined;
    kind(): OutputDatumKind;
    static deserialize(reader: CBORReader, path: string[]): OutputDatum;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): OutputDatum;
    static from_hex(hex_str: string, path?: string[]): OutputDatum;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): OutputDatum;
}
export declare class ParameterChangeAction {
    private _gov_action_id;
    private _protocol_param_updates;
    private _policy_hash;
    constructor(gov_action_id: GovernanceActionId | undefined, protocol_param_updates: ProtocolParamUpdate, policy_hash: ScriptHash | undefined);
    static new_with_policy_hash_and_action_id(gov_action_id: GovernanceActionId | undefined, protocol_param_updates: ProtocolParamUpdate, policy_hash: ScriptHash | undefined): ParameterChangeAction;
    gov_action_id(): GovernanceActionId | undefined;
    set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void;
    protocol_param_updates(): ProtocolParamUpdate;
    set_protocol_param_updates(protocol_param_updates: ProtocolParamUpdate): void;
    policy_hash(): ScriptHash | undefined;
    set_policy_hash(policy_hash: ScriptHash | undefined): void;
    static deserialize(reader: CBORReader, path: string[]): ParameterChangeAction;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): ParameterChangeAction;
    static from_hex(hex_str: string, path?: string[]): ParameterChangeAction;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): ParameterChangeAction;
    static new(protocol_param_updates: ProtocolParamUpdate): ParameterChangeAction;
    static new_with_action_id(gov_action_id: GovernanceActionId, protocol_param_updates: ProtocolParamUpdate): ParameterChangeAction;
    static new_with_policy_hash(protocol_param_updates: ProtocolParamUpdate, policy_hash: ScriptHash): ParameterChangeAction;
}
export declare enum PlutusDataKind {
    ConstrPlutusData = 0,
    PlutusMap = 1,
    PlutusList = 2,
    CSLBigInt = 3,
    Bytes = 4
}
export type PlutusDataVariant = {
    kind: 0;
    value: ConstrPlutusData;
} | {
    kind: 1;
    value: PlutusMap;
} | {
    kind: 2;
    value: PlutusList;
} | {
    kind: 3;
    value: CSLBigInt;
} | {
    kind: 4;
    value: Uint8Array;
};
export declare class PlutusData {
    private variant;
    constructor(variant: PlutusDataVariant);
    static new_constr_plutus_data(constr_plutus_data: ConstrPlutusData): PlutusData;
    static new_map(map: PlutusMap): PlutusData;
    static new_list(list: PlutusList): PlutusData;
    static new_integer(integer: CSLBigInt): PlutusData;
    static new_bytes(bytes: Uint8Array): PlutusData;
    as_constr_plutus_data(): ConstrPlutusData;
    as_map(): PlutusMap;
    as_list(): PlutusList;
    as_integer(): CSLBigInt;
    as_bytes(): Uint8Array;
    kind(): PlutusDataKind;
    static deserialize(reader: CBORReader, path: string[]): PlutusData;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): PlutusData;
    static from_hex(hex_str: string, path?: string[]): PlutusData;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): PlutusData;
    static new_empty_constr_plutus_data(alternative: BigNum): PlutusData;
    static new_single_value_constr_plutus_data(alternative: BigNum, plutus_data: PlutusData): PlutusData;
    static from_address(address: Address): PlutusData;
}
export declare class PlutusList {
    private items;
    constructor();
    static new(): PlutusList;
    len(): number;
    get(index: number): PlutusData;
    add(elem: PlutusData): boolean;
    contains(elem: PlutusData): boolean;
    static deserialize(reader: CBORReader, path: string[]): PlutusList;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): PlutusList;
    static from_hex(hex_str: string, path?: string[]): PlutusList;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): PlutusList;
}
export declare class PlutusMap {
    _items: [PlutusData, PlutusMapValues][];
    constructor(items: [PlutusData, PlutusMapValues][]);
    static new(): PlutusMap;
    len(): number;
    insert(key: PlutusData, value: PlutusMapValues): PlutusMapValues | undefined;
    get(key: PlutusData): PlutusMapValues | undefined;
    _remove_many(keys: PlutusData[]): void;
    keys(): PlutusList;
    static deserialize(reader: CBORReader, path: string[]): PlutusMap;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): PlutusMap;
    static from_hex(hex_str: string, path?: string[]): PlutusMap;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): PlutusMap;
}
export declare class PlutusMapValues {
    private items;
    constructor(items: PlutusData[]);
    static new(): PlutusMapValues;
    len(): number;
    get(index: number): PlutusData;
    add(elem: PlutusData): void;
    static deserialize(reader: CBORReader, path: string[]): PlutusMapValues;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): PlutusMapValues;
    static from_hex(hex_str: string, path?: string[]): PlutusMapValues;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): PlutusMapValues;
}
export declare class PlutusScript {
    private inner;
    constructor(inner: Uint8Array);
    static new(inner: Uint8Array): PlutusScript;
    bytes(): Uint8Array;
    static deserialize(reader: CBORReader, path: string[]): PlutusScript;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): PlutusScript;
    static from_hex(hex_str: string, path?: string[]): PlutusScript;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): PlutusScript;
    hash(language_version: number): ScriptHash;
}
export declare class PlutusScripts {
    private items;
    constructor(items: PlutusScript[]);
    static new(): PlutusScripts;
    len(): number;
    get(index: number): PlutusScript;
    add(elem: PlutusScript): void;
    static deserialize(reader: CBORReader, path: string[]): PlutusScripts;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): PlutusScripts;
    static from_hex(hex_str: string, path?: string[]): PlutusScripts;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): PlutusScripts;
}
export declare class PoolMetadata {
    private _url;
    private _pool_metadata_hash;
    constructor(url: URL, pool_metadata_hash: PoolMetadataHash);
    static new(url: URL, pool_metadata_hash: PoolMetadataHash): PoolMetadata;
    url(): URL;
    set_url(url: URL): void;
    pool_metadata_hash(): PoolMetadataHash;
    set_pool_metadata_hash(pool_metadata_hash: PoolMetadataHash): void;
    static deserialize(reader: CBORReader, path: string[]): PoolMetadata;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): PoolMetadata;
    static from_hex(hex_str: string, path?: string[]): PoolMetadata;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): PoolMetadata;
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
    static deserialize(reader: CBORReader, path: string[]): PoolMetadataHash;
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
    constructor(operator: Ed25519KeyHash, vrf_keyhash: VRFKeyHash, pledge: BigNum, cost: BigNum, margin: UnitInterval, reward_account: RewardAddress, pool_owners: Ed25519KeyHashes, relays: Relays, pool_metadata: PoolMetadata | undefined);
    static new(operator: Ed25519KeyHash, vrf_keyhash: VRFKeyHash, pledge: BigNum, cost: BigNum, margin: UnitInterval, reward_account: RewardAddress, pool_owners: Ed25519KeyHashes, relays: Relays, pool_metadata: PoolMetadata | undefined): PoolParams;
    operator(): Ed25519KeyHash;
    set_operator(operator: Ed25519KeyHash): void;
    vrf_keyhash(): VRFKeyHash;
    set_vrf_keyhash(vrf_keyhash: VRFKeyHash): void;
    pledge(): BigNum;
    set_pledge(pledge: BigNum): void;
    cost(): BigNum;
    set_cost(cost: BigNum): void;
    margin(): UnitInterval;
    set_margin(margin: UnitInterval): void;
    reward_account(): RewardAddress;
    set_reward_account(reward_account: RewardAddress): void;
    pool_owners(): Ed25519KeyHashes;
    set_pool_owners(pool_owners: Ed25519KeyHashes): void;
    relays(): Relays;
    set_relays(relays: Relays): void;
    pool_metadata(): PoolMetadata | undefined;
    set_pool_metadata(pool_metadata: PoolMetadata | undefined): void;
    static deserialize(reader: CBORReader, path: string[]): PoolParams;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): PoolParams;
    static from_hex(hex_str: string, path?: string[]): PoolParams;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): PoolParams;
}
export declare class PoolRegistration {
    private _pool_params;
    constructor(pool_params: PoolParams);
    static new(pool_params: PoolParams): PoolRegistration;
    pool_params(): PoolParams;
    set_pool_params(pool_params: PoolParams): void;
    static deserialize(reader: CBORReader, path: string[]): PoolRegistration;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): PoolRegistration;
    static from_hex(hex_str: string, path?: string[]): PoolRegistration;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): PoolRegistration;
}
export declare class PoolRetirement {
    private _pool_keyhash;
    private _epoch;
    constructor(pool_keyhash: Ed25519KeyHash, epoch: number);
    static new(pool_keyhash: Ed25519KeyHash, epoch: number): PoolRetirement;
    pool_keyhash(): Ed25519KeyHash;
    set_pool_keyhash(pool_keyhash: Ed25519KeyHash): void;
    epoch(): number;
    set_epoch(epoch: number): void;
    static deserialize(reader: CBORReader, path: string[]): PoolRetirement;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): PoolRetirement;
    static from_hex(hex_str: string, path?: string[]): PoolRetirement;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): PoolRetirement;
}
export declare class PoolVotingThresholds {
    private _motion_no_confidence;
    private _committee_normal;
    private _committee_no_confidence;
    private _hard_fork_initiation;
    private _security_relevant_threshold;
    constructor(motion_no_confidence: UnitInterval, committee_normal: UnitInterval, committee_no_confidence: UnitInterval, hard_fork_initiation: UnitInterval, security_relevant_threshold: UnitInterval);
    static new(motion_no_confidence: UnitInterval, committee_normal: UnitInterval, committee_no_confidence: UnitInterval, hard_fork_initiation: UnitInterval, security_relevant_threshold: UnitInterval): PoolVotingThresholds;
    motion_no_confidence(): UnitInterval;
    set_motion_no_confidence(motion_no_confidence: UnitInterval): void;
    committee_normal(): UnitInterval;
    set_committee_normal(committee_normal: UnitInterval): void;
    committee_no_confidence(): UnitInterval;
    set_committee_no_confidence(committee_no_confidence: UnitInterval): void;
    hard_fork_initiation(): UnitInterval;
    set_hard_fork_initiation(hard_fork_initiation: UnitInterval): void;
    security_relevant_threshold(): UnitInterval;
    set_security_relevant_threshold(security_relevant_threshold: UnitInterval): void;
    static deserialize(reader: CBORReader, path: string[]): PoolVotingThresholds;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): PoolVotingThresholds;
    static from_hex(hex_str: string, path?: string[]): PoolVotingThresholds;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): PoolVotingThresholds;
}
export declare class PostAlonzoTransactionOutput {
    private _address;
    private _amount;
    private _plutus_data;
    private _script_ref;
    constructor(address: Address, amount: Value, plutus_data: PlutusData | undefined, script_ref: ScriptRef | undefined);
    static new(address: Address, amount: Value, plutus_data: PlutusData | undefined, script_ref: ScriptRef | undefined): PostAlonzoTransactionOutput;
    address(): Address;
    set_address(address: Address): void;
    amount(): Value;
    set_amount(amount: Value): void;
    plutus_data(): PlutusData | undefined;
    set_plutus_data(plutus_data: PlutusData | undefined): void;
    script_ref(): ScriptRef | undefined;
    set_script_ref(script_ref: ScriptRef | undefined): void;
    static deserialize(reader: CBORReader, path: string[]): PostAlonzoTransactionOutput;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): PostAlonzoTransactionOutput;
    static from_hex(hex_str: string, path?: string[]): PostAlonzoTransactionOutput;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): PostAlonzoTransactionOutput;
}
export declare class PreBabbageTransactionOutput {
    private _address;
    private _amount;
    private _datum_hash;
    constructor(address: Address, amount: Value, datum_hash: DataHash);
    static new(address: Address, amount: Value, datum_hash: DataHash): PreBabbageTransactionOutput;
    address(): Address;
    set_address(address: Address): void;
    amount(): Value;
    set_amount(amount: Value): void;
    datum_hash(): DataHash;
    set_datum_hash(datum_hash: DataHash): void;
    static deserialize(reader: CBORReader, path: string[]): PreBabbageTransactionOutput;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): PreBabbageTransactionOutput;
    static from_hex(hex_str: string, path?: string[]): PreBabbageTransactionOutput;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): PreBabbageTransactionOutput;
}
export declare class PrivateKey {
    private inner;
    private options?;
    constructor(inner: Uint8Array, options?: {
        isExtended: boolean;
    });
    static new(inner: Uint8Array): PrivateKey;
    as_bytes(): Uint8Array;
    to_hex(): string;
    static deserialize(reader: CBORReader, path: string[]): PrivateKey;
    serialize(writer: CBORWriter): void;
    static _KEY_LEN: number;
    static _EXT_KEY_LEN: number;
    static _BECH32_HRP: string;
    static _EXT_BECH32_HRP: string;
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
    static from_hex(hex_str: string): PrivateKey;
}
export declare class ProposedProtocolParameterUpdates {
    _items: [GenesisHash, ProtocolParamUpdate][];
    constructor(items: [GenesisHash, ProtocolParamUpdate][]);
    static new(): ProposedProtocolParameterUpdates;
    len(): number;
    insert(key: GenesisHash, value: ProtocolParamUpdate): ProtocolParamUpdate | undefined;
    get(key: GenesisHash): ProtocolParamUpdate | undefined;
    _remove_many(keys: GenesisHash[]): void;
    keys(): GenesisHashes;
    static deserialize(reader: CBORReader, path: string[]): ProposedProtocolParameterUpdates;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): ProposedProtocolParameterUpdates;
    static from_hex(hex_str: string, path?: string[]): ProposedProtocolParameterUpdates;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): ProposedProtocolParameterUpdates;
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
    constructor(minfee_a: BigNum | undefined, minfee_b: BigNum | undefined, max_block_body_size: number | undefined, max_tx_size: number | undefined, max_block_header_size: number | undefined, key_deposit: BigNum | undefined, pool_deposit: BigNum | undefined, max_epoch: number | undefined, n_opt: number | undefined, pool_pledge_influence: UnitInterval | undefined, expansion_rate: UnitInterval | undefined, treasury_growth_rate: UnitInterval | undefined, min_pool_cost: BigNum | undefined, ada_per_utxo_byte: BigNum | undefined, costmdls: Costmdls | undefined, execution_costs: ExUnitPrices | undefined, max_tx_ex_units: ExUnits | undefined, max_block_ex_units: ExUnits | undefined, max_value_size: number | undefined, collateral_percentage: number | undefined, max_collateral_inputs: number | undefined, pool_voting_thresholds: PoolVotingThresholds | undefined, drep_voting_thresholds: DRepVotingThresholds | undefined, min_committee_size: number | undefined, committee_term_limit: number | undefined, governance_action_validity_period: number | undefined, governance_action_deposit: BigNum | undefined, drep_deposit: BigNum | undefined, drep_inactivity_period: number | undefined, script_cost_per_byte: UnitInterval | undefined);
    minfee_a(): BigNum | undefined;
    set_minfee_a(minfee_a: BigNum | undefined): void;
    minfee_b(): BigNum | undefined;
    set_minfee_b(minfee_b: BigNum | undefined): void;
    max_block_body_size(): number | undefined;
    set_max_block_body_size(max_block_body_size: number | undefined): void;
    max_tx_size(): number | undefined;
    set_max_tx_size(max_tx_size: number | undefined): void;
    max_block_header_size(): number | undefined;
    set_max_block_header_size(max_block_header_size: number | undefined): void;
    key_deposit(): BigNum | undefined;
    set_key_deposit(key_deposit: BigNum | undefined): void;
    pool_deposit(): BigNum | undefined;
    set_pool_deposit(pool_deposit: BigNum | undefined): void;
    max_epoch(): number | undefined;
    set_max_epoch(max_epoch: number | undefined): void;
    n_opt(): number | undefined;
    set_n_opt(n_opt: number | undefined): void;
    pool_pledge_influence(): UnitInterval | undefined;
    set_pool_pledge_influence(pool_pledge_influence: UnitInterval | undefined): void;
    expansion_rate(): UnitInterval | undefined;
    set_expansion_rate(expansion_rate: UnitInterval | undefined): void;
    treasury_growth_rate(): UnitInterval | undefined;
    set_treasury_growth_rate(treasury_growth_rate: UnitInterval | undefined): void;
    min_pool_cost(): BigNum | undefined;
    set_min_pool_cost(min_pool_cost: BigNum | undefined): void;
    ada_per_utxo_byte(): BigNum | undefined;
    set_ada_per_utxo_byte(ada_per_utxo_byte: BigNum | undefined): void;
    costmdls(): Costmdls | undefined;
    set_costmdls(costmdls: Costmdls | undefined): void;
    execution_costs(): ExUnitPrices | undefined;
    set_execution_costs(execution_costs: ExUnitPrices | undefined): void;
    max_tx_ex_units(): ExUnits | undefined;
    set_max_tx_ex_units(max_tx_ex_units: ExUnits | undefined): void;
    max_block_ex_units(): ExUnits | undefined;
    set_max_block_ex_units(max_block_ex_units: ExUnits | undefined): void;
    max_value_size(): number | undefined;
    set_max_value_size(max_value_size: number | undefined): void;
    collateral_percentage(): number | undefined;
    set_collateral_percentage(collateral_percentage: number | undefined): void;
    max_collateral_inputs(): number | undefined;
    set_max_collateral_inputs(max_collateral_inputs: number | undefined): void;
    pool_voting_thresholds(): PoolVotingThresholds | undefined;
    set_pool_voting_thresholds(pool_voting_thresholds: PoolVotingThresholds | undefined): void;
    drep_voting_thresholds(): DRepVotingThresholds | undefined;
    set_drep_voting_thresholds(drep_voting_thresholds: DRepVotingThresholds | undefined): void;
    min_committee_size(): number | undefined;
    set_min_committee_size(min_committee_size: number | undefined): void;
    committee_term_limit(): number | undefined;
    set_committee_term_limit(committee_term_limit: number | undefined): void;
    governance_action_validity_period(): number | undefined;
    set_governance_action_validity_period(governance_action_validity_period: number | undefined): void;
    governance_action_deposit(): BigNum | undefined;
    set_governance_action_deposit(governance_action_deposit: BigNum | undefined): void;
    drep_deposit(): BigNum | undefined;
    set_drep_deposit(drep_deposit: BigNum | undefined): void;
    drep_inactivity_period(): number | undefined;
    set_drep_inactivity_period(drep_inactivity_period: number | undefined): void;
    script_cost_per_byte(): UnitInterval | undefined;
    set_script_cost_per_byte(script_cost_per_byte: UnitInterval | undefined): void;
    static deserialize(reader: CBORReader, path: string[]): ProtocolParamUpdate;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): ProtocolParamUpdate;
    static from_hex(hex_str: string, path?: string[]): ProtocolParamUpdate;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): ProtocolParamUpdate;
    static new(): ProtocolParamUpdate;
}
export declare class ProtocolVersion {
    private _major;
    private _minor;
    constructor(major: number, minor: number);
    static new(major: number, minor: number): ProtocolVersion;
    major(): number;
    set_major(major: number): void;
    minor(): number;
    set_minor(minor: number): void;
    static deserialize(reader: CBORReader, path: string[]): ProtocolVersion;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): ProtocolVersion;
    static from_hex(hex_str: string, path?: string[]): ProtocolVersion;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): ProtocolVersion;
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
    static deserialize(reader: CBORReader, path: string[]): PublicKey;
    serialize(writer: CBORWriter): void;
    static _BECH32_HRP: string;
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
    constructor(tag: RedeemerTag, index: BigNum, data: PlutusData, ex_units: ExUnits);
    static new(tag: RedeemerTag, index: BigNum, data: PlutusData, ex_units: ExUnits): Redeemer;
    tag(): RedeemerTag;
    set_tag(tag: RedeemerTag): void;
    index(): BigNum;
    set_index(index: BigNum): void;
    data(): PlutusData;
    set_data(data: PlutusData): void;
    ex_units(): ExUnits;
    set_ex_units(ex_units: ExUnits): void;
    static deserialize(reader: CBORReader, path: string[]): Redeemer;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Redeemer;
    static from_hex(hex_str: string, path?: string[]): Redeemer;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Redeemer;
}
export declare enum RedeemerTagKind {
    spending = 0,
    minting = 1,
    certifying = 2,
    rewarding = 3,
    voting = 4,
    proposing = 5
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
    kind(): RedeemerTagKind;
    static deserialize(reader: CBORReader, path: string[]): RedeemerTag;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): RedeemerTag;
    static from_hex(hex_str: string, path?: string[]): RedeemerTag;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): RedeemerTag;
}
export declare class Redeemers {
    private items;
    constructor(items: Redeemer[]);
    static new(): Redeemers;
    len(): number;
    get(index: number): Redeemer;
    add(elem: Redeemer): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Redeemers;
    static from_hex(hex_str: string, path?: string[]): Redeemers;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Redeemers;
    total_ex_units(): ExUnits;
    static deserialize(reader: CBORReader, path: string[]): Redeemers;
    static deserializeArray(reader: CBORReader, path: string[]): Redeemers;
    static deserializeMap(reader: CBORReader, path: string[]): Redeemers;
    serialize(writer: CBORWriter): void;
}
export declare class RedeemersArrayItem {
    private _tag;
    private _index;
    private _data;
    private _ex_units;
    constructor(tag: RedeemerTag, index: BigNum, data: PlutusData, ex_units: ExUnits);
    static new(tag: RedeemerTag, index: BigNum, data: PlutusData, ex_units: ExUnits): RedeemersArrayItem;
    tag(): RedeemerTag;
    set_tag(tag: RedeemerTag): void;
    index(): BigNum;
    set_index(index: BigNum): void;
    data(): PlutusData;
    set_data(data: PlutusData): void;
    ex_units(): ExUnits;
    set_ex_units(ex_units: ExUnits): void;
    static deserialize(reader: CBORReader, path: string[]): RedeemersArrayItem;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): RedeemersArrayItem;
    static from_hex(hex_str: string, path?: string[]): RedeemersArrayItem;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): RedeemersArrayItem;
}
export declare class RedeemersKey {
    private _tag;
    private _index;
    constructor(tag: RedeemerTag, index: BigNum);
    static new(tag: RedeemerTag, index: BigNum): RedeemersKey;
    tag(): RedeemerTag;
    set_tag(tag: RedeemerTag): void;
    index(): BigNum;
    set_index(index: BigNum): void;
    static deserialize(reader: CBORReader, path: string[]): RedeemersKey;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): RedeemersKey;
    static from_hex(hex_str: string, path?: string[]): RedeemersKey;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): RedeemersKey;
}
export declare class RedeemersValue {
    private _data;
    private _ex_units;
    constructor(data: PlutusData, ex_units: ExUnits);
    static new(data: PlutusData, ex_units: ExUnits): RedeemersValue;
    data(): PlutusData;
    set_data(data: PlutusData): void;
    ex_units(): ExUnits;
    set_ex_units(ex_units: ExUnits): void;
    static deserialize(reader: CBORReader, path: string[]): RedeemersValue;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): RedeemersValue;
    static from_hex(hex_str: string, path?: string[]): RedeemersValue;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): RedeemersValue;
}
export declare class RegCert {
    private _stake_credential;
    private _coin;
    constructor(stake_credential: Credential, coin: BigNum);
    static new(stake_credential: Credential, coin: BigNum): RegCert;
    stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    coin(): BigNum;
    set_coin(coin: BigNum): void;
    static deserialize(reader: CBORReader, path: string[]): RegCert;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): RegCert;
    static from_hex(hex_str: string, path?: string[]): RegCert;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): RegCert;
}
export declare enum RelayKind {
    SingleHostAddr = 0,
    SingleHostName = 1,
    MultiHostName = 2
}
export type RelayVariant = {
    kind: 0;
    value: SingleHostAddr;
} | {
    kind: 1;
    value: SingleHostName;
} | {
    kind: 2;
    value: MultiHostName;
};
export declare class Relay {
    private variant;
    constructor(variant: RelayVariant);
    static new_single_host_addr(single_host_addr: SingleHostAddr): Relay;
    static new_single_host_name(single_host_name: SingleHostName): Relay;
    static new_multi_host_name(multi_host_name: MultiHostName): Relay;
    as_single_host_addr(): SingleHostAddr | undefined;
    as_single_host_name(): SingleHostName | undefined;
    as_multi_host_name(): MultiHostName | undefined;
    kind(): RelayKind;
    static deserialize(reader: CBORReader, path: string[]): Relay;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Relay;
    static from_hex(hex_str: string, path?: string[]): Relay;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Relay;
}
export declare class Relays {
    private items;
    constructor(items: Relay[]);
    static new(): Relays;
    len(): number;
    get(index: number): Relay;
    add(elem: Relay): void;
    static deserialize(reader: CBORReader, path: string[]): Relays;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Relays;
    static from_hex(hex_str: string, path?: string[]): Relays;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Relays;
}
export declare class RewardAddresses {
    private items;
    constructor(items: RewardAddress[]);
    static new(): RewardAddresses;
    len(): number;
    get(index: number): RewardAddress;
    add(elem: RewardAddress): void;
    static deserialize(reader: CBORReader, path: string[]): RewardAddresses;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): RewardAddresses;
    static from_hex(hex_str: string, path?: string[]): RewardAddresses;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): RewardAddresses;
}
export declare class ScriptAll {
    private _native_scripts;
    constructor(native_scripts: NativeScripts);
    static new(native_scripts: NativeScripts): ScriptAll;
    native_scripts(): NativeScripts;
    set_native_scripts(native_scripts: NativeScripts): void;
    static deserialize(reader: CBORReader, path: string[]): ScriptAll;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): ScriptAll;
    static from_hex(hex_str: string, path?: string[]): ScriptAll;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): ScriptAll;
}
export declare class ScriptAny {
    private _native_scripts;
    constructor(native_scripts: NativeScripts);
    static new(native_scripts: NativeScripts): ScriptAny;
    native_scripts(): NativeScripts;
    set_native_scripts(native_scripts: NativeScripts): void;
    static deserialize(reader: CBORReader, path: string[]): ScriptAny;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): ScriptAny;
    static from_hex(hex_str: string, path?: string[]): ScriptAny;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): ScriptAny;
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
    static deserialize(reader: CBORReader, path: string[]): ScriptDataHash;
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
    static deserialize(reader: CBORReader, path: string[]): ScriptHash;
    serialize(writer: CBORWriter): void;
}
export declare class ScriptHashes {
    private items;
    constructor(items: ScriptHash[]);
    static new(): ScriptHashes;
    len(): number;
    get(index: number): ScriptHash;
    add(elem: ScriptHash): void;
    static deserialize(reader: CBORReader, path: string[]): ScriptHashes;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): ScriptHashes;
    static from_hex(hex_str: string, path?: string[]): ScriptHashes;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): ScriptHashes;
}
export declare class ScriptNOfK {
    private _n;
    private _native_scripts;
    constructor(n: number, native_scripts: NativeScripts);
    static new(n: number, native_scripts: NativeScripts): ScriptNOfK;
    n(): number;
    set_n(n: number): void;
    native_scripts(): NativeScripts;
    set_native_scripts(native_scripts: NativeScripts): void;
    static deserialize(reader: CBORReader, path: string[]): ScriptNOfK;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): ScriptNOfK;
    static from_hex(hex_str: string, path?: string[]): ScriptNOfK;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): ScriptNOfK;
}
export declare class ScriptPubkey {
    private inner;
    constructor(inner: Ed25519KeyHash);
    static new(inner: Ed25519KeyHash): ScriptPubkey;
    addr_keyhash(): Ed25519KeyHash;
    static deserialize(reader: CBORReader, path: string[]): ScriptPubkey;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): ScriptPubkey;
    static from_hex(hex_str: string, path?: string[]): ScriptPubkey;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): ScriptPubkey;
}
export declare class ScriptPubname {
    private _addr_keyhash;
    constructor(addr_keyhash: Ed25519KeyHash);
    static new(addr_keyhash: Ed25519KeyHash): ScriptPubname;
    addr_keyhash(): Ed25519KeyHash;
    set_addr_keyhash(addr_keyhash: Ed25519KeyHash): void;
    static deserialize(reader: CBORReader, path: string[]): ScriptPubname;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): ScriptPubname;
    static from_hex(hex_str: string, path?: string[]): ScriptPubname;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): ScriptPubname;
}
export declare enum ScriptRefKind {
    NativeScript = 0,
    PlutusScriptV1 = 1,
    PlutusScriptV2 = 2,
    PlutusScriptV3 = 3
}
export type ScriptRefVariant = {
    kind: 0;
    value: NativeScript;
} | {
    kind: 1;
    value: PlutusScript;
} | {
    kind: 2;
    value: PlutusScript;
} | {
    kind: 3;
    value: PlutusScript;
};
export declare class ScriptRef {
    private variant;
    constructor(variant: ScriptRefVariant);
    static new_native_script(native_script: NativeScript): ScriptRef;
    static new_plutus_script_v1(plutus_script_v1: PlutusScript): ScriptRef;
    static new_plutus_script_v2(plutus_script_v2: PlutusScript): ScriptRef;
    static new_plutus_script_v3(plutus_script_v3: PlutusScript): ScriptRef;
    as_native_script(): NativeScript | undefined;
    as_plutus_script_v1(): PlutusScript | undefined;
    as_plutus_script_v2(): PlutusScript | undefined;
    as_plutus_script_v3(): PlutusScript | undefined;
    kind(): ScriptRefKind;
    static deserialize(reader: CBORReader, path: string[]): ScriptRef;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): ScriptRef;
    static from_hex(hex_str: string, path?: string[]): ScriptRef;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): ScriptRef;
}
export declare class SingleHostAddr {
    private _port;
    private _ipv4;
    private _ipv6;
    constructor(port: number | undefined, ipv4: Ipv4 | undefined, ipv6: Ipv6 | undefined);
    static new(port: number | undefined, ipv4: Ipv4 | undefined, ipv6: Ipv6 | undefined): SingleHostAddr;
    port(): number | undefined;
    set_port(port: number | undefined): void;
    ipv4(): Ipv4 | undefined;
    set_ipv4(ipv4: Ipv4 | undefined): void;
    ipv6(): Ipv6 | undefined;
    set_ipv6(ipv6: Ipv6 | undefined): void;
    static deserialize(reader: CBORReader, path: string[]): SingleHostAddr;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): SingleHostAddr;
    static from_hex(hex_str: string, path?: string[]): SingleHostAddr;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): SingleHostAddr;
}
export declare class SingleHostName {
    private _port;
    private _dns_name;
    constructor(port: number | undefined, dns_name: DNSRecordAorAAAA);
    static new(port: number | undefined, dns_name: DNSRecordAorAAAA): SingleHostName;
    port(): number | undefined;
    set_port(port: number | undefined): void;
    dns_name(): DNSRecordAorAAAA;
    set_dns_name(dns_name: DNSRecordAorAAAA): void;
    static deserialize(reader: CBORReader, path: string[]): SingleHostName;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): SingleHostName;
    static from_hex(hex_str: string, path?: string[]): SingleHostName;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): SingleHostName;
}
export declare class StakeAndVoteDelegation {
    private _stake_credential;
    private _pool_keyhash;
    private _drep;
    constructor(stake_credential: Credential, pool_keyhash: Ed25519KeyHash, drep: DRep);
    static new(stake_credential: Credential, pool_keyhash: Ed25519KeyHash, drep: DRep): StakeAndVoteDelegation;
    stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    pool_keyhash(): Ed25519KeyHash;
    set_pool_keyhash(pool_keyhash: Ed25519KeyHash): void;
    drep(): DRep;
    set_drep(drep: DRep): void;
    static deserialize(reader: CBORReader, path: string[]): StakeAndVoteDelegation;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): StakeAndVoteDelegation;
    static from_hex(hex_str: string, path?: string[]): StakeAndVoteDelegation;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): StakeAndVoteDelegation;
}
export declare class StakeDelegation {
    private _stake_credential;
    private _pool_keyhash;
    constructor(stake_credential: Credential, pool_keyhash: Ed25519KeyHash);
    static new(stake_credential: Credential, pool_keyhash: Ed25519KeyHash): StakeDelegation;
    stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    pool_keyhash(): Ed25519KeyHash;
    set_pool_keyhash(pool_keyhash: Ed25519KeyHash): void;
    static deserialize(reader: CBORReader, path: string[]): StakeDelegation;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): StakeDelegation;
    static from_hex(hex_str: string, path?: string[]): StakeDelegation;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): StakeDelegation;
}
export declare class StakeDeregistration {
    private _stake_credential;
    constructor(stake_credential: Credential);
    static new(stake_credential: Credential): StakeDeregistration;
    stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    static deserialize(reader: CBORReader, path: string[]): StakeDeregistration;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): StakeDeregistration;
    static from_hex(hex_str: string, path?: string[]): StakeDeregistration;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): StakeDeregistration;
}
export declare class StakeRegistration {
    private _stake_credential;
    constructor(stake_credential: Credential);
    static new(stake_credential: Credential): StakeRegistration;
    stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    static deserialize(reader: CBORReader, path: string[]): StakeRegistration;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): StakeRegistration;
    static from_hex(hex_str: string, path?: string[]): StakeRegistration;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): StakeRegistration;
}
export declare class StakeRegistrationAndDelegation {
    private _stake_credential;
    private _pool_keyhash;
    private _coin;
    constructor(stake_credential: Credential, pool_keyhash: Ed25519KeyHash, coin: BigNum);
    static new(stake_credential: Credential, pool_keyhash: Ed25519KeyHash, coin: BigNum): StakeRegistrationAndDelegation;
    stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    pool_keyhash(): Ed25519KeyHash;
    set_pool_keyhash(pool_keyhash: Ed25519KeyHash): void;
    coin(): BigNum;
    set_coin(coin: BigNum): void;
    static deserialize(reader: CBORReader, path: string[]): StakeRegistrationAndDelegation;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): StakeRegistrationAndDelegation;
    static from_hex(hex_str: string, path?: string[]): StakeRegistrationAndDelegation;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): StakeRegistrationAndDelegation;
}
export declare class StakeVoteRegistrationAndDelegation {
    private _stake_credential;
    private _pool_keyhash;
    private _drep;
    private _coin;
    constructor(stake_credential: Credential, pool_keyhash: Ed25519KeyHash, drep: DRep, coin: BigNum);
    static new(stake_credential: Credential, pool_keyhash: Ed25519KeyHash, drep: DRep, coin: BigNum): StakeVoteRegistrationAndDelegation;
    stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    pool_keyhash(): Ed25519KeyHash;
    set_pool_keyhash(pool_keyhash: Ed25519KeyHash): void;
    drep(): DRep;
    set_drep(drep: DRep): void;
    coin(): BigNum;
    set_coin(coin: BigNum): void;
    static deserialize(reader: CBORReader, path: string[]): StakeVoteRegistrationAndDelegation;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): StakeVoteRegistrationAndDelegation;
    static from_hex(hex_str: string, path?: string[]): StakeVoteRegistrationAndDelegation;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): StakeVoteRegistrationAndDelegation;
}
export declare class TimelockExpiry {
    private _slot;
    constructor(slot: BigNum);
    static new_timelockexpiry(slot: BigNum): TimelockExpiry;
    slot_bignum(): BigNum;
    set_slot(slot: BigNum): void;
    static deserialize(reader: CBORReader, path: string[]): TimelockExpiry;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): TimelockExpiry;
    static from_hex(hex_str: string, path?: string[]): TimelockExpiry;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): TimelockExpiry;
    slot(): number;
    static new(slot: number): TimelockExpiry;
}
export declare class TimelockStart {
    private _slot;
    constructor(slot: BigNum);
    static new_timelockstart(slot: BigNum): TimelockStart;
    slot_bignum(): BigNum;
    set_slot(slot: BigNum): void;
    static deserialize(reader: CBORReader, path: string[]): TimelockStart;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): TimelockStart;
    static from_hex(hex_str: string, path?: string[]): TimelockStart;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): TimelockStart;
    slot(): number;
    static new(slot: number): TimelockStart;
}
export declare class Transaction {
    private _body;
    private _witness_set;
    private _is_valid;
    private _auxiliary_data;
    constructor(body: TransactionBody, witness_set: TransactionWitnessSet, is_valid: boolean, auxiliary_data: AuxiliaryData | undefined);
    body(): TransactionBody;
    set_body(body: TransactionBody): void;
    witness_set(): TransactionWitnessSet;
    set_witness_set(witness_set: TransactionWitnessSet): void;
    is_valid(): boolean;
    set_is_valid(is_valid: boolean): void;
    auxiliary_data(): AuxiliaryData | undefined;
    set_auxiliary_data(auxiliary_data: AuxiliaryData | undefined): void;
    static deserialize(reader: CBORReader, path: string[]): Transaction;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Transaction;
    static from_hex(hex_str: string, path?: string[]): Transaction;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Transaction;
    static new(body: TransactionBody, witness_set: TransactionWitnessSet, auxiliary_data: AuxiliaryData): Transaction;
}
export declare class TransactionBodies {
    private items;
    constructor(items: TransactionBody[]);
    static new(): TransactionBodies;
    len(): number;
    get(index: number): TransactionBody;
    add(elem: TransactionBody): void;
    static deserialize(reader: CBORReader, path: string[]): TransactionBodies;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): TransactionBodies;
    static from_hex(hex_str: string, path?: string[]): TransactionBodies;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): TransactionBodies;
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
    inputs(): TransactionInputs;
    set_inputs(inputs: TransactionInputs): void;
    outputs(): TransactionOutputs;
    set_outputs(outputs: TransactionOutputs): void;
    fee(): BigNum;
    set_fee(fee: BigNum): void;
    ttl_bignum(): BigNum | undefined;
    set_ttl(ttl: BigNum | undefined): void;
    certs(): Certificates | undefined;
    set_certs(certs: Certificates | undefined): void;
    withdrawals(): Withdrawals | undefined;
    set_withdrawals(withdrawals: Withdrawals | undefined): void;
    auxiliary_data_hash(): AuxiliaryDataHash | undefined;
    set_auxiliary_data_hash(auxiliary_data_hash: AuxiliaryDataHash | undefined): void;
    validity_start_interval_bignum(): BigNum | undefined;
    set_validity_start_interval_bignum(validity_start_interval: BigNum | undefined): void;
    mint(): Mint | undefined;
    set_mint(mint: Mint | undefined): void;
    script_data_hash(): ScriptDataHash | undefined;
    set_script_data_hash(script_data_hash: ScriptDataHash | undefined): void;
    collateral(): TransactionInputs | undefined;
    set_collateral(collateral: TransactionInputs | undefined): void;
    required_signers(): Ed25519KeyHashes | undefined;
    set_required_signers(required_signers: Ed25519KeyHashes | undefined): void;
    network_id(): NetworkId | undefined;
    set_network_id(network_id: NetworkId | undefined): void;
    collateral_return(): TransactionOutput | undefined;
    set_collateral_return(collateral_return: TransactionOutput | undefined): void;
    total_collateral(): BigNum | undefined;
    set_total_collateral(total_collateral: BigNum | undefined): void;
    reference_inputs(): TransactionInputs | undefined;
    set_reference_inputs(reference_inputs: TransactionInputs | undefined): void;
    voting_procedures(): VotingProcedures | undefined;
    set_voting_procedures(voting_procedures: VotingProcedures | undefined): void;
    voting_proposals(): VotingProposals | undefined;
    set_voting_proposals(voting_proposals: VotingProposals | undefined): void;
    current_treasury_value(): BigNum | undefined;
    set_current_treasury_value(current_treasury_value: BigNum | undefined): void;
    donation(): BigNum | undefined;
    set_donation(donation: BigNum | undefined): void;
    static deserialize(reader: CBORReader, path: string[]): TransactionBody;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): TransactionBody;
    static from_hex(hex_str: string, path?: string[]): TransactionBody;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): TransactionBody;
    ttl(): number | undefined;
    remove_ttl(): void;
    validity_start_interval(): number | undefined;
    set_validity_start_interval(validity_start_interval: number): void;
    static new(inputs: TransactionInputs, outputs: TransactionOutputs, fee: BigNum, path?: string[], ttl?: number): TransactionBody;
    static new_tx_body(inputs: TransactionInputs, outputs: TransactionOutputs, fee: BigNum, path: string[]): TransactionBody;
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
    static deserialize(reader: CBORReader, path: string[]): TransactionHash;
    serialize(writer: CBORWriter): void;
}
export declare class TransactionInput {
    private _transaction_id;
    private _index;
    constructor(transaction_id: TransactionHash, index: number);
    static new(transaction_id: TransactionHash, index: number): TransactionInput;
    transaction_id(): TransactionHash;
    set_transaction_id(transaction_id: TransactionHash): void;
    index(): number;
    set_index(index: number): void;
    static deserialize(reader: CBORReader, path: string[]): TransactionInput;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): TransactionInput;
    static from_hex(hex_str: string, path?: string[]): TransactionInput;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): TransactionInput;
}
export declare class TransactionInputs {
    private items;
    constructor();
    static new(): TransactionInputs;
    len(): number;
    get(index: number): TransactionInput;
    add(elem: TransactionInput): boolean;
    contains(elem: TransactionInput): boolean;
    static deserialize(reader: CBORReader, path: string[]): TransactionInputs;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): TransactionInputs;
    static from_hex(hex_str: string, path?: string[]): TransactionInputs;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): TransactionInputs;
}
export declare enum TransactionMetadatumKind {
    MetadataMap = 0,
    MetadataList = 1,
    Int = 2,
    Bytes = 3,
    Text = 4
}
export type TransactionMetadatumVariant = {
    kind: 0;
    value: MetadataMap;
} | {
    kind: 1;
    value: MetadataList;
} | {
    kind: 2;
    value: Int;
} | {
    kind: 3;
    value: Uint8Array;
} | {
    kind: 4;
    value: string;
};
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
    kind(): TransactionMetadatumKind;
    static deserialize(reader: CBORReader, path: string[]): TransactionMetadatum;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): TransactionMetadatum;
    static from_hex(hex_str: string, path?: string[]): TransactionMetadatum;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): TransactionMetadatum;
}
export declare class TransactionMetadatumLabels {
    private items;
    constructor(items: BigNum[]);
    static new(): TransactionMetadatumLabels;
    len(): number;
    get(index: number): BigNum;
    add(elem: BigNum): void;
    static deserialize(reader: CBORReader, path: string[]): TransactionMetadatumLabels;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): TransactionMetadatumLabels;
    static from_hex(hex_str: string, path?: string[]): TransactionMetadatumLabels;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): TransactionMetadatumLabels;
}
export declare enum TransactionOutputKind {
    PreBabbageTransactionOutput = 0,
    PostAlonzoTransactionOutput = 1
}
export type TransactionOutputVariant = {
    kind: 0;
    value: PreBabbageTransactionOutput;
} | {
    kind: 1;
    value: PostAlonzoTransactionOutput;
};
export declare class TransactionOutput {
    private variant;
    constructor(variant: TransactionOutputVariant);
    static new_pre_babbage_transaction_output(pre_babbage_transaction_output: PreBabbageTransactionOutput): TransactionOutput;
    static new_post_alonzo_transaction_output(post_alonzo_transaction_output: PostAlonzoTransactionOutput): TransactionOutput;
    as_pre_babbage_transaction_output(): PreBabbageTransactionOutput;
    as_post_alonzo_transaction_output(): PostAlonzoTransactionOutput;
    kind(): TransactionOutputKind;
    static deserialize(reader: CBORReader, path: string[]): TransactionOutput;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): TransactionOutput;
    static from_hex(hex_str: string, path?: string[]): TransactionOutput;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): TransactionOutput;
    static new(address: Address, amount: Value): TransactionOutput;
}
export declare class TransactionOutputs {
    private items;
    constructor(items: TransactionOutput[]);
    static new(): TransactionOutputs;
    len(): number;
    get(index: number): TransactionOutput;
    add(elem: TransactionOutput): void;
    static deserialize(reader: CBORReader, path: string[]): TransactionOutputs;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): TransactionOutputs;
    static from_hex(hex_str: string, path?: string[]): TransactionOutputs;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): TransactionOutputs;
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
    vkeys(): Vkeywitnesses | undefined;
    set_vkeys(vkeys: Vkeywitnesses | undefined): void;
    native_scripts(): NativeScripts | undefined;
    set_native_scripts(native_scripts: NativeScripts | undefined): void;
    bootstraps(): BootstrapWitnesses | undefined;
    set_bootstraps(bootstraps: BootstrapWitnesses | undefined): void;
    plutus_scripts_v1(): PlutusScripts | undefined;
    set_plutus_scripts_v1(plutus_scripts_v1: PlutusScripts | undefined): void;
    plutus_data(): PlutusList | undefined;
    set_plutus_data(plutus_data: PlutusList | undefined): void;
    redeemers(): Redeemers | undefined;
    set_redeemers(redeemers: Redeemers | undefined): void;
    plutus_scripts_v2(): PlutusScripts | undefined;
    set_plutus_scripts_v2(plutus_scripts_v2: PlutusScripts | undefined): void;
    plutus_scripts_v3(): PlutusScripts | undefined;
    set_plutus_scripts_v3(plutus_scripts_v3: PlutusScripts | undefined): void;
    static deserialize(reader: CBORReader, path: string[]): TransactionWitnessSet;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): TransactionWitnessSet;
    static from_hex(hex_str: string, path?: string[]): TransactionWitnessSet;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): TransactionWitnessSet;
    static new(): TransactionWitnessSet;
}
export declare class TransactionWitnessSets {
    private items;
    constructor(items: TransactionWitnessSet[]);
    static new(): TransactionWitnessSets;
    len(): number;
    get(index: number): TransactionWitnessSet;
    add(elem: TransactionWitnessSet): void;
    static deserialize(reader: CBORReader, path: string[]): TransactionWitnessSets;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): TransactionWitnessSets;
    static from_hex(hex_str: string, path?: string[]): TransactionWitnessSets;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): TransactionWitnessSets;
}
export declare class TreasuryWithdrawals {
    _items: [RewardAddress, BigNum][];
    constructor(items: [RewardAddress, BigNum][]);
    static new(): TreasuryWithdrawals;
    len(): number;
    insert(key: RewardAddress, value: BigNum): BigNum | undefined;
    get(key: RewardAddress): BigNum | undefined;
    _remove_many(keys: RewardAddress[]): void;
    keys(): RewardAddresses;
    static deserialize(reader: CBORReader, path: string[]): TreasuryWithdrawals;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): TreasuryWithdrawals;
    static from_hex(hex_str: string, path?: string[]): TreasuryWithdrawals;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): TreasuryWithdrawals;
}
export declare class TreasuryWithdrawalsAction {
    private _withdrawals;
    private _policy_hash;
    constructor(withdrawals: TreasuryWithdrawals, policy_hash: ScriptHash | undefined);
    static new_with_policy_hash(withdrawals: TreasuryWithdrawals, policy_hash: ScriptHash | undefined): TreasuryWithdrawalsAction;
    withdrawals(): TreasuryWithdrawals;
    set_withdrawals(withdrawals: TreasuryWithdrawals): void;
    policy_hash(): ScriptHash | undefined;
    set_policy_hash(policy_hash: ScriptHash | undefined): void;
    static deserialize(reader: CBORReader, path: string[]): TreasuryWithdrawalsAction;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): TreasuryWithdrawalsAction;
    static from_hex(hex_str: string, path?: string[]): TreasuryWithdrawalsAction;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): TreasuryWithdrawalsAction;
    static new(withdrawals: TreasuryWithdrawals): TreasuryWithdrawalsAction;
}
export declare class URL {
    private inner;
    constructor(inner: string);
    static new(inner: string): URL;
    url(): string;
    static deserialize(reader: CBORReader, path: string[]): URL;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): URL;
    static from_hex(hex_str: string, path?: string[]): URL;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): URL;
}
export declare class UnitInterval {
    private _numerator;
    private _denominator;
    constructor(numerator: BigNum, denominator: BigNum);
    static new(numerator: BigNum, denominator: BigNum): UnitInterval;
    numerator(): BigNum;
    set_numerator(numerator: BigNum): void;
    denominator(): BigNum;
    set_denominator(denominator: BigNum): void;
    static deserialize(reader: CBORReader, path?: string[]): UnitInterval;
    static deserializeInner(reader: CBORReader, path: string[]): UnitInterval;
    serialize(writer: CBORWriter): void;
    serializeInner(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): UnitInterval;
    static from_hex(hex_str: string, path?: string[]): UnitInterval;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): UnitInterval;
}
export declare class UnregCert {
    private _stake_credential;
    private _coin;
    constructor(stake_credential: Credential, coin: BigNum);
    static new(stake_credential: Credential, coin: BigNum): UnregCert;
    stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    coin(): BigNum;
    set_coin(coin: BigNum): void;
    static deserialize(reader: CBORReader, path: string[]): UnregCert;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): UnregCert;
    static from_hex(hex_str: string, path?: string[]): UnregCert;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): UnregCert;
}
export declare class Update {
    private _proposed_protocol_parameter_updates;
    private _epoch;
    constructor(proposed_protocol_parameter_updates: ProposedProtocolParameterUpdates, epoch: number);
    static new(proposed_protocol_parameter_updates: ProposedProtocolParameterUpdates, epoch: number): Update;
    proposed_protocol_parameter_updates(): ProposedProtocolParameterUpdates;
    set_proposed_protocol_parameter_updates(proposed_protocol_parameter_updates: ProposedProtocolParameterUpdates): void;
    epoch(): number;
    set_epoch(epoch: number): void;
    static deserialize(reader: CBORReader, path: string[]): Update;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Update;
    static from_hex(hex_str: string, path?: string[]): Update;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Update;
}
export declare class UpdateCommitteeAction {
    private _gov_action_id;
    private _committee;
    private _members_to_remove;
    constructor(gov_action_id: GovernanceActionId | undefined, committee: Committee, members_to_remove: Credentials);
    static new_with_action_id(gov_action_id: GovernanceActionId | undefined, committee: Committee, members_to_remove: Credentials): UpdateCommitteeAction;
    gov_action_id(): GovernanceActionId | undefined;
    set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void;
    committee(): Committee;
    set_committee(committee: Committee): void;
    members_to_remove(): Credentials;
    set_members_to_remove(members_to_remove: Credentials): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): UpdateCommitteeAction;
    static from_hex(hex_str: string, path?: string[]): UpdateCommitteeAction;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): UpdateCommitteeAction;
    static new(committee: Committee, members_to_remove: Credentials): UpdateCommitteeAction;
    static deserialize(reader: CBORReader, path: string[]): UpdateCommitteeAction;
    serialize(writer: CBORWriter): void;
}
export declare class VRFCert {
    private _output;
    private _proof;
    constructor(output: Uint8Array, proof: Uint8Array);
    static new(output: Uint8Array, proof: Uint8Array): VRFCert;
    output(): Uint8Array;
    set_output(output: Uint8Array): void;
    proof(): Uint8Array;
    set_proof(proof: Uint8Array): void;
    static deserialize(reader: CBORReader, path: string[]): VRFCert;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): VRFCert;
    static from_hex(hex_str: string, path?: string[]): VRFCert;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): VRFCert;
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
    static deserialize(reader: CBORReader, path: string[]): VRFKeyHash;
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
    static deserialize(reader: CBORReader, path: string[]): VRFVKey;
    serialize(writer: CBORWriter): void;
}
export declare class Value {
    private _coin;
    private _multiasset;
    constructor(coin: BigNum, multiasset: MultiAsset | undefined);
    static new_with_assets(coin: BigNum, multiasset: MultiAsset | undefined): Value;
    coin(): BigNum;
    set_coin(coin: BigNum): void;
    multiasset(): MultiAsset | undefined;
    set_multiasset(multiasset: MultiAsset | undefined): void;
    static deserializeRecord(reader: CBORReader, path: string[]): Value;
    serializeRecord(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Value;
    static from_hex(hex_str: string, path?: string[]): Value;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Value;
    static zero(): Value;
    is_zero(): boolean;
    static new(coin: BigNum): Value;
    static new_from_assets(multiasset: MultiAsset): Value;
    static deserialize(reader: CBORReader, path: string[]): Value;
    serialize(writer: CBORWriter): void;
    checked_add(rhs: Value, path: string[]): Value;
    checked_sub(rhs: Value, path: string[]): Value;
    clamped_sub(rhs: Value, path: string[]): Value;
    compare(rhs_value: Value): number | undefined;
}
export declare class Vkey {
    private _public_key;
    constructor(public_key: PublicKey);
    static new(public_key: PublicKey): Vkey;
    public_key(): PublicKey;
    set_public_key(public_key: PublicKey): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Vkey;
    static from_hex(hex_str: string, path?: string[]): Vkey;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Vkey;
    static deserialize(reader: CBORReader, path: string[]): Vkey;
    serialize(writer: CBORWriter): void;
}
export declare class Vkeys {
    private items;
    constructor(items: Vkey[]);
    static new(): Vkeys;
    len(): number;
    get(index: number): Vkey;
    add(elem: Vkey): void;
    static deserialize(reader: CBORReader, path: string[]): Vkeys;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Vkeys;
    static from_hex(hex_str: string, path?: string[]): Vkeys;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Vkeys;
}
export declare class Vkeywitness {
    private _vkey;
    private _signature;
    constructor(vkey: Vkey, signature: Ed25519Signature);
    static new(vkey: Vkey, signature: Ed25519Signature): Vkeywitness;
    vkey(): Vkey;
    set_vkey(vkey: Vkey): void;
    signature(): Ed25519Signature;
    set_signature(signature: Ed25519Signature): void;
    static deserialize(reader: CBORReader, path: string[]): Vkeywitness;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Vkeywitness;
    static from_hex(hex_str: string, path?: string[]): Vkeywitness;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Vkeywitness;
}
export declare class Vkeywitnesses {
    private items;
    constructor();
    static new(): Vkeywitnesses;
    len(): number;
    get(index: number): Vkeywitness;
    add(elem: Vkeywitness): boolean;
    contains(elem: Vkeywitness): boolean;
    static deserialize(reader: CBORReader, path: string[]): Vkeywitnesses;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Vkeywitnesses;
    static from_hex(hex_str: string, path?: string[]): Vkeywitnesses;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Vkeywitnesses;
}
export declare class VoteDelegation {
    private _stake_credential;
    private _drep;
    constructor(stake_credential: Credential, drep: DRep);
    static new(stake_credential: Credential, drep: DRep): VoteDelegation;
    stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    drep(): DRep;
    set_drep(drep: DRep): void;
    static deserialize(reader: CBORReader, path: string[]): VoteDelegation;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): VoteDelegation;
    static from_hex(hex_str: string, path?: string[]): VoteDelegation;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): VoteDelegation;
}
export declare enum VoteKind {
    No = 0,
    Yes = 1,
    Abstain = 2
}
export declare function deserializeVoteKind(reader: CBORReader, path: string[]): VoteKind;
export declare function serializeVoteKind(writer: CBORWriter, value: VoteKind): void;
export declare class VoteRegistrationAndDelegation {
    private _stake_credential;
    private _drep;
    private _coin;
    constructor(stake_credential: Credential, drep: DRep, coin: BigNum);
    static new(stake_credential: Credential, drep: DRep, coin: BigNum): VoteRegistrationAndDelegation;
    stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    drep(): DRep;
    set_drep(drep: DRep): void;
    coin(): BigNum;
    set_coin(coin: BigNum): void;
    static deserialize(reader: CBORReader, path: string[]): VoteRegistrationAndDelegation;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): VoteRegistrationAndDelegation;
    static from_hex(hex_str: string, path?: string[]): VoteRegistrationAndDelegation;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): VoteRegistrationAndDelegation;
}
export declare enum VoterKind {
    ConstitutionalCommitteeHotKeyHash = 0,
    ConstitutionalCommitteeHotScriptHash = 1,
    DRepKeyHash = 2,
    DRepScriptHash = 3,
    StakingPoolKeyHash = 4
}
export type VoterVariant = {
    kind: 0;
    value: Ed25519KeyHash;
} | {
    kind: 1;
    value: ScriptHash;
} | {
    kind: 2;
    value: Ed25519KeyHash;
} | {
    kind: 3;
    value: ScriptHash;
} | {
    kind: 4;
    value: Ed25519KeyHash;
};
export declare class Voter {
    private variant;
    constructor(variant: VoterVariant);
    static new_constitutional_committee_hot_key_hash(constitutional_committee_hot_key_hash: Ed25519KeyHash): Voter;
    static new_constitutional_committee_hot_script_hash(constitutional_committee_hot_script_hash: ScriptHash): Voter;
    static new_drep_key_hash(drep_key_hash: Ed25519KeyHash): Voter;
    static new_drep_script_hash(drep_script_hash: ScriptHash): Voter;
    static new_staking_pool_key_hash(staking_pool_key_hash: Ed25519KeyHash): Voter;
    to_constitutional_committee_hot_key_hash(): Ed25519KeyHash | undefined;
    to_constitutional_committee_hot_script_hash(): ScriptHash | undefined;
    to_drep_key_hash(): Ed25519KeyHash | undefined;
    to_drep_script_hash(): ScriptHash | undefined;
    to_staking_pool_key_hash(): Ed25519KeyHash | undefined;
    kind(): VoterKind;
    static deserialize(reader: CBORReader, path: string[]): Voter;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Voter;
    static from_hex(hex_str: string, path?: string[]): Voter;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Voter;
    has_script_credentials(): boolean;
    to_key_hash(): Ed25519KeyHash | undefined;
    static new_constitutional_committee_hot_credential(cred: Credential): Voter;
    static new_drep_credential(cred: Credential): Voter;
    to_constitutional_committee_hot_credential(): Credential | undefined;
    to_drep_credential(): Credential | undefined;
}
export declare class Voters {
    private items;
    constructor(items: Voter[]);
    static new(): Voters;
    len(): number;
    get(index: number): Voter;
    add(elem: Voter): void;
    static deserialize(reader: CBORReader, path: string[]): Voters;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Voters;
    static from_hex(hex_str: string, path?: string[]): Voters;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Voters;
}
export declare class VotingProcedure {
    private _vote;
    private _anchor;
    constructor(vote: VoteKind, anchor: Anchor | undefined);
    static new_with_anchor(vote: VoteKind, anchor: Anchor | undefined): VotingProcedure;
    vote(): VoteKind;
    set_vote(vote: VoteKind): void;
    anchor(): Anchor | undefined;
    set_anchor(anchor: Anchor | undefined): void;
    static deserialize(reader: CBORReader, path: string[]): VotingProcedure;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): VotingProcedure;
    static from_hex(hex_str: string, path?: string[]): VotingProcedure;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): VotingProcedure;
    static new(vote: VoteKind): VotingProcedure;
}
export declare class VotingProcedures {
    _items: [Voter, GovernanceActions][];
    constructor(items: [Voter, GovernanceActions][]);
    static new(): VotingProcedures;
    len(): number;
    _insert(key: Voter, value: GovernanceActions): GovernanceActions | undefined;
    _get(key: Voter): GovernanceActions | undefined;
    _remove_many(keys: Voter[]): void;
    keys(): Voters;
    static deserialize(reader: CBORReader, path: string[]): VotingProcedures;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): VotingProcedures;
    static from_hex(hex_str: string, path?: string[]): VotingProcedures;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): VotingProcedures;
    insert(voter: Voter, governance_action_id: GovernanceActionId, voting_procedure: VotingProcedure): void;
    get(voter: Voter, governance_action_id: GovernanceActionId): VotingProcedure | undefined;
    get_voters(): Voters;
    get_governance_action_ids_by_voter(voter: Voter): GovernanceActionIds;
}
export declare class VotingProposal {
    private _deposit;
    private _reward_account;
    private _governance_action;
    private _anchor;
    constructor(deposit: BigNum, reward_account: RewardAddress, governance_action: GovernanceAction, anchor: Anchor);
    deposit(): BigNum;
    set_deposit(deposit: BigNum): void;
    reward_account(): RewardAddress;
    set_reward_account(reward_account: RewardAddress): void;
    governance_action(): GovernanceAction;
    set_governance_action(governance_action: GovernanceAction): void;
    anchor(): Anchor;
    set_anchor(anchor: Anchor): void;
    static deserialize(reader: CBORReader, path: string[]): VotingProposal;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): VotingProposal;
    static from_hex(hex_str: string, path?: string[]): VotingProposal;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): VotingProposal;
    static new(governance_action: GovernanceAction, anchor: Anchor, reward_account: RewardAddress, deposit: BigNum): VotingProposal;
}
export declare class VotingProposals {
    private items;
    constructor();
    static new(): VotingProposals;
    len(): number;
    get(index: number): VotingProposal;
    add(elem: VotingProposal): boolean;
    contains(elem: VotingProposal): boolean;
    static deserialize(reader: CBORReader, path: string[]): VotingProposals;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): VotingProposals;
    static from_hex(hex_str: string, path?: string[]): VotingProposals;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): VotingProposals;
}
export declare class Withdrawals {
    _items: [RewardAddress, BigNum][];
    constructor(items: [RewardAddress, BigNum][]);
    static new(): Withdrawals;
    len(): number;
    insert(key: RewardAddress, value: BigNum): BigNum | undefined;
    get(key: RewardAddress): BigNum | undefined;
    _remove_many(keys: RewardAddress[]): void;
    static deserialize(reader: CBORReader, path: string[]): Withdrawals;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): Withdrawals;
    static from_hex(hex_str: string, path?: string[]): Withdrawals;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): Withdrawals;
}
export declare class certificates {
    private items;
    constructor();
    static new(): certificates;
    len(): number;
    get(index: number): Certificate;
    add(elem: Certificate): boolean;
    contains(elem: Certificate): boolean;
    static deserialize(reader: CBORReader, path: string[]): certificates;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array, path?: string[]): certificates;
    static from_hex(hex_str: string, path?: string[]): certificates;
    to_bytes(): Uint8Array;
    to_hex(): string;
    clone(path: string[]): certificates;
}
export declare class BaseAddress {
    _network: number;
    _payment: Credential;
    _stake: Credential;
    constructor(network: number, payment: Credential, stake: Credential);
    payment_cred(): Credential;
    stake_cred(): Credential;
    to_address(): Address;
    static from_address(addr: Address): BaseAddress | undefined;
    network_id(): number;
    to_bytes(): Uint8Array;
    static from_bytes(data: Uint8Array): BaseAddress;
}
export declare class ByronAddress {
    _address: Uint8Array;
    _attributes: ByronAttributes;
    _address_type: ByronAddressType;
    constructor(address: Uint8Array, attributes: ByronAttributes, address_type: ByronAddressType);
    serializeInner(writer: CBORWriter): void;
    static deserializeInner(reader: CBORReader, path: string[]): ByronAddress;
    serialize(writer: CBORWriter): void;
    static deserialize(reader: CBORReader, path: string[]): ByronAddress;
    static from_bytes(bytes: Uint8Array, path?: string[]): ByronAddress;
    to_bytes(): Uint8Array;
    byron_protocol_magic(): number;
    attributes(): Uint8Array;
    network_id(): number;
    static from_base58(s: string): ByronAddress;
    to_base58(): string;
    static is_valid(s: string): boolean;
    to_address(): Address;
    static from_address(addr: Address): ByronAddress | undefined;
}
export declare class ByronAttributes {
    _derivation_path?: Uint8Array;
    _protocol_magic?: number;
    constructor(derivation_path?: Uint8Array, protocol_magic?: number);
    serialize(writer: CBORWriter): void;
    static deserialize(reader: CBORReader, path: string[]): ByronAttributes;
}
export declare enum ByronAddressType {
    PubKey = 0,
    Script = 1,
    Redeem = 2
}
export declare enum CredKind {
    Key = 0,
    Script = 1
}
export type CredentialVariant = {
    kind: CredKind.Key;
    value: Ed25519KeyHash;
} | {
    kind: CredKind.Script;
    value: ScriptHash;
};
export declare class Credential {
    readonly variant: CredentialVariant;
    static HASH_LEN: number;
    constructor(variant: CredentialVariant);
    static from_keyhash(key: Ed25519KeyHash): Credential;
    static from_scripthash(script: ScriptHash): Credential;
    static _from_raw_bytes(kind: number, bytes: Uint8Array): Credential;
    to_keyhash(): Ed25519KeyHash | undefined;
    to_scripthash(): ScriptHash | undefined;
    kind(): CredKind;
    has_script_hash(): boolean;
    serialize(writer: CBORWriter): void;
    static deserialize(reader: CBORReader, path: string[]): Credential;
    to_bytes(): Uint8Array;
    static from_bytes(data: Uint8Array, path: string[]): Credential;
    to_hex(): string;
    static from_hex(data: string, path: string[]): Credential;
    free(): void;
    _to_raw_bytes(): Uint8Array;
}
export declare class EnterpriseAddress {
    _network: number;
    _payment: Credential;
    constructor(network: number, payment: Credential);
    free(): void;
    static new(network: number, payment: Credential): EnterpriseAddress;
    payment_cred(): Credential;
    to_address(): Address;
    static from_address(addr: Address): EnterpriseAddress | undefined;
    network_id(): number;
    to_bytes(): Uint8Array;
    static from_bytes(data: Uint8Array): EnterpriseAddress;
}
export declare enum AddressKind {
    Base = 0,
    Enterprise = 1,
    Reward = 2,
    Byron = 3,
    Malformed = 4
}
export type AddressVariant = {
    kind: AddressKind.Base;
    value: BaseAddress;
} | {
    kind: AddressKind.Enterprise;
    value: EnterpriseAddress;
} | {
    kind: AddressKind.Reward;
    value: RewardAddress;
} | {
    kind: AddressKind.Byron;
    value: ByronAddress;
} | {
    kind: AddressKind.Malformed;
    value: MalformedAddress;
};
export declare class Address {
    _variant: AddressVariant;
    constructor(variant: AddressVariant);
    free(): void;
    kind(): AddressKind;
    payment_cred(): Credential | undefined;
    is_malformed(): boolean;
    network_id(): number;
    to_bytes(): Uint8Array;
    static from_bytes(bytes: Uint8Array, path: string[]): Address;
    serialize(writer: CBORWriter): void;
    static deserialize(reader: CBORReader, path: string[]): Address;
}
export declare class MalformedAddress {
    _bytes: Uint8Array;
    constructor(bytes: Uint8Array);
    original_bytes(): Uint8Array;
    static from_address(addr: Address): MalformedAddress | undefined;
    to_address(): Address;
}
export declare class NetworkInfo {
    _network_id: number;
    _protocol_magic: number;
    constructor(network_id: number, protocol_magic: number);
    network_id(): number;
    protcol_magic(): number;
    static testnet_preview(): NetworkInfo;
    static testnet_preprod(): NetworkInfo;
    static mainnet(): NetworkInfo;
}
export declare class RewardAddress {
    _network: number;
    _payment: Credential;
    constructor(network: number, payment: Credential);
    free(): void;
    static new(network: number, payment: Credential): RewardAddress;
    payment_cred(): Credential;
    to_address(): Address;
    static from_address(addr: Address): RewardAddress | undefined;
    network_id(): number;
    to_bytes(): Uint8Array;
    static from_bytes(data: Uint8Array): RewardAddress;
    serialize(writer: CBORWriter): void;
    static deserialize(reader: CBORReader, path: string[]): RewardAddress;
}
