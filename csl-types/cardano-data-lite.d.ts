export declare class Block {
    private header;
    private transaction_bodies;
    private transaction_witness_sets;
    private auxiliary_data_set;
    private invalid_transactions;
    constructor(header: Header, transaction_bodies: TransactionBodies, transaction_witness_sets: TransactionWitnessSets, auxiliary_data_set: AuxiliaryDataSet, invalid_transactions: Uint32Array);
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
}
export declare class AuxiliaryDataSet {
    private items;
    constructor(items: [number, AuxiliaryData][]);
    static new(): AuxiliaryDataSet;
    len(): number;
    insert(key: number, value: AuxiliaryData): void;
    get(key: number): AuxiliaryData | undefined;
    static deserialize(reader: CBORReader): AuxiliaryDataSet;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): AuxiliaryDataSet;
    static from_hex(hex_str: string): AuxiliaryDataSet;
    to_bytes(): Uint8Array;
    to_hex(): string;
}
export declare class Transaction {
    private body;
    private witness_set;
    private is_valid;
    private auxiliary_data;
    constructor(body: TransactionBody, witness_set: TransactionWitnessSet, is_valid: boolean, auxiliary_data: AuxiliaryData | undefined);
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
}
export declare class Header {
    private header_body;
    private body_signature;
    constructor(header_body: HeaderBody, body_signature: unknown);
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
}
export declare class HeaderBody {
    private block_number;
    private slot;
    private prev_hash;
    private issuer_vkey;
    private vrf_vkey;
    private vrf_result;
    private block_body_size;
    private block_body_hash;
    private operational_cert;
    private protocol_version;
    constructor(block_number: number, slot: bigint, prev_hash: unknown | undefined, issuer_vkey: unknown, vrf_vkey: unknown, vrf_result: unknown, block_body_size: number, block_body_hash: unknown, operational_cert: OperationalCert, protocol_version: ProtocolVersion);
    get_block_number(): number;
    set_block_number(block_number: number): void;
    get_slot(): bigint;
    set_slot(slot: bigint): void;
    get_prev_hash(): unknown | undefined;
    set_prev_hash(prev_hash: unknown | undefined): void;
    get_issuer_vkey(): unknown;
    set_issuer_vkey(issuer_vkey: unknown): void;
    get_vrf_vkey(): unknown;
    set_vrf_vkey(vrf_vkey: unknown): void;
    get_vrf_result(): unknown;
    set_vrf_result(vrf_result: unknown): void;
    get_block_body_size(): number;
    set_block_body_size(block_body_size: number): void;
    get_block_body_hash(): unknown;
    set_block_body_hash(block_body_hash: unknown): void;
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
}
export declare class OperationalCert {
    private hot_vkey;
    private sequence_number;
    private kes_period;
    private sigma;
    constructor(hot_vkey: unknown, sequence_number: number, kes_period: number, sigma: unknown);
    get_hot_vkey(): unknown;
    set_hot_vkey(hot_vkey: unknown): void;
    get_sequence_number(): number;
    set_sequence_number(sequence_number: number): void;
    get_kes_period(): number;
    set_kes_period(kes_period: number): void;
    get_sigma(): unknown;
    set_sigma(sigma: unknown): void;
    static deserialize(reader: CBORReader): OperationalCert;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): OperationalCert;
    static from_hex(hex_str: string): OperationalCert;
    to_bytes(): Uint8Array;
    to_hex(): string;
}
export declare class ProtocolVersion {
    private major;
    private minor;
    constructor(major: number, minor: number);
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
}
export declare class TransactionBody {
    private inputs;
    private outputs;
    private fee;
    private ttl;
    private certs;
    private withdrawals;
    private auxiliary_data_hash;
    private validity_start_interval;
    private mint;
    private script_data_hash;
    private collateral;
    private required_signers;
    private network_id;
    private collateral_return;
    private total_collateral;
    private reference_inputs;
    private voting_procedures;
    private voting_proposals;
    private current_treasury_value;
    private donation;
    constructor(inputs: TransactionInputs, outputs: TransactionOutputs, fee: bigint, ttl: bigint | undefined, certs: Certificates | undefined, withdrawals: Withdrawals | undefined, auxiliary_data_hash: unknown | undefined, validity_start_interval: bigint | undefined, mint: unknown | undefined, script_data_hash: unknown | undefined, collateral: TransactionInputs | undefined, required_signers: Ed25519KeyHashes | undefined, network_id: NetworkId | undefined, collateral_return: TransactionOutput | undefined, total_collateral: bigint | undefined, reference_inputs: TransactionInputs | undefined, voting_procedures: unknown | undefined, voting_proposals: VotingProposals | undefined, current_treasury_value: bigint | undefined, donation: bigint | undefined);
    get_inputs(): TransactionInputs;
    set_inputs(inputs: TransactionInputs): void;
    get_outputs(): TransactionOutputs;
    set_outputs(outputs: TransactionOutputs): void;
    get_fee(): bigint;
    set_fee(fee: bigint): void;
    get_ttl(): bigint | undefined;
    set_ttl(ttl: bigint | undefined): void;
    get_certs(): Certificates | undefined;
    set_certs(certs: Certificates | undefined): void;
    get_withdrawals(): Withdrawals | undefined;
    set_withdrawals(withdrawals: Withdrawals | undefined): void;
    get_auxiliary_data_hash(): unknown | undefined;
    set_auxiliary_data_hash(auxiliary_data_hash: unknown | undefined): void;
    get_validity_start_interval(): bigint | undefined;
    set_validity_start_interval(validity_start_interval: bigint | undefined): void;
    get_mint(): unknown | undefined;
    set_mint(mint: unknown | undefined): void;
    get_script_data_hash(): unknown | undefined;
    set_script_data_hash(script_data_hash: unknown | undefined): void;
    get_collateral(): TransactionInputs | undefined;
    set_collateral(collateral: TransactionInputs | undefined): void;
    get_required_signers(): Ed25519KeyHashes | undefined;
    set_required_signers(required_signers: Ed25519KeyHashes | undefined): void;
    get_network_id(): NetworkId | undefined;
    set_network_id(network_id: NetworkId | undefined): void;
    get_collateral_return(): TransactionOutput | undefined;
    set_collateral_return(collateral_return: TransactionOutput | undefined): void;
    get_total_collateral(): bigint | undefined;
    set_total_collateral(total_collateral: bigint | undefined): void;
    get_reference_inputs(): TransactionInputs | undefined;
    set_reference_inputs(reference_inputs: TransactionInputs | undefined): void;
    get_voting_procedures(): unknown | undefined;
    set_voting_procedures(voting_procedures: unknown | undefined): void;
    get_voting_proposals(): VotingProposals | undefined;
    set_voting_proposals(voting_proposals: VotingProposals | undefined): void;
    get_current_treasury_value(): bigint | undefined;
    set_current_treasury_value(current_treasury_value: bigint | undefined): void;
    get_donation(): bigint | undefined;
    set_donation(donation: bigint | undefined): void;
    static deserialize(reader: CBORReader): TransactionBody;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): TransactionBody;
    static from_hex(hex_str: string): TransactionBody;
    to_bytes(): Uint8Array;
    to_hex(): string;
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
}
export declare class Ed25519KeyHashes {
    private items;
    constructor();
    static new(): Ed25519KeyHashes;
    len(): number;
    get(index: number): unknown;
    add(elem: unknown): boolean;
    contains(elem: unknown): boolean;
    static deserialize(reader: CBORReader): Ed25519KeyHashes;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Ed25519KeyHashes;
    static from_hex(hex_str: string): Ed25519KeyHashes;
    to_bytes(): Uint8Array;
    to_hex(): string;
}
export declare class VotingProcedure {
    private vote;
    private anchor;
    constructor(vote: VoteKind, anchor: Anchor | undefined);
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
}
export declare class VotingProposal {
    private deposit;
    private reward_account;
    private governance_action;
    private anchor;
    constructor(deposit: bigint, reward_account: unknown, governance_action: GovernanceAction, anchor: Anchor);
    get_deposit(): bigint;
    set_deposit(deposit: bigint): void;
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
}
export declare class ParameterChangeAction {
    private gov_action_id;
    private protocol_param_updates;
    private policy_hash;
    constructor(gov_action_id: GovernanceActionId | undefined, protocol_param_updates: ProtocolParamUpdate, policy_hash: unknown | undefined);
    get_gov_action_id(): GovernanceActionId | undefined;
    set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void;
    get_protocol_param_updates(): ProtocolParamUpdate;
    set_protocol_param_updates(protocol_param_updates: ProtocolParamUpdate): void;
    get_policy_hash(): unknown | undefined;
    set_policy_hash(policy_hash: unknown | undefined): void;
    static deserialize(reader: CBORReader): ParameterChangeAction;
    serialize(writer: CBORWriter): void;
}
export declare class HardForkInitiationAction {
    private gov_action_id;
    private protocol_version;
    constructor(gov_action_id: GovernanceActionId | undefined, protocol_version: ProtocolVersion);
    get_gov_action_id(): GovernanceActionId | undefined;
    set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void;
    get_protocol_version(): ProtocolVersion;
    set_protocol_version(protocol_version: ProtocolVersion): void;
    static deserialize(reader: CBORReader): HardForkInitiationAction;
    serialize(writer: CBORWriter): void;
}
export declare class TreasuryWithdrawalsAction {
    private withdrawals;
    private policy_hash;
    constructor(withdrawals: unknown, policy_hash: unknown | undefined);
    get_withdrawals(): unknown;
    set_withdrawals(withdrawals: unknown): void;
    get_policy_hash(): unknown | undefined;
    set_policy_hash(policy_hash: unknown | undefined): void;
    static deserialize(reader: CBORReader): TreasuryWithdrawalsAction;
    serialize(writer: CBORWriter): void;
}
export declare class NoConfidenceAction {
    private gov_action_id;
    constructor(gov_action_id: GovernanceActionId | undefined);
    get_gov_action_id(): GovernanceActionId | undefined;
    set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void;
    static deserialize(reader: CBORReader): NoConfidenceAction;
    serialize(writer: CBORWriter): void;
}
export declare class UpdateCommitteeAction {
    private gov_action_id;
    private members_to_remove;
    private committee;
    private quorom_threshold;
    constructor(gov_action_id: GovernanceActionId | undefined, members_to_remove: Credentials, committee: unknown, quorom_threshold: UnitInterval);
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
export declare class NewConstitutionAction {
    private gov_action_id;
    private constitution;
    constructor(gov_action_id: GovernanceActionId | undefined, constitution: Constitution);
    get_gov_action_id(): GovernanceActionId | undefined;
    set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void;
    get_constitution(): Constitution;
    set_constitution(constitution: Constitution): void;
    static deserialize(reader: CBORReader): NewConstitutionAction;
    serialize(writer: CBORWriter): void;
}
export declare class InfoAction {
    constructor();
    static deserialize(reader: CBORReader): InfoAction;
    serialize(writer: CBORWriter): void;
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
}
export declare class Constitution {
    private anchor;
    private scripthash;
    constructor(anchor: Anchor, scripthash: unknown | undefined);
    get_anchor(): Anchor;
    set_anchor(anchor: Anchor): void;
    get_scripthash(): unknown | undefined;
    set_scripthash(scripthash: unknown | undefined): void;
    static deserialize(reader: CBORReader): Constitution;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Constitution;
    static from_hex(hex_str: string): Constitution;
    to_bytes(): Uint8Array;
    to_hex(): string;
}
export declare class Voter {
    private constitutional_committee_hot_key;
    private drep;
    private staking_pool;
    constructor(constitutional_committee_hot_key: Credential, drep: Credential, staking_pool: unknown);
    get_constitutional_committee_hot_key(): Credential;
    set_constitutional_committee_hot_key(constitutional_committee_hot_key: Credential): void;
    get_drep(): Credential;
    set_drep(drep: Credential): void;
    get_staking_pool(): unknown;
    set_staking_pool(staking_pool: unknown): void;
    static deserialize(reader: CBORReader): Voter;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Voter;
    static from_hex(hex_str: string): Voter;
    to_bytes(): Uint8Array;
    to_hex(): string;
}
export declare class Anchor {
    private url;
    private anchor_data_hash;
    constructor(url: URL, anchor_data_hash: unknown);
    get_url(): URL;
    set_url(url: URL): void;
    get_anchor_data_hash(): unknown;
    set_anchor_data_hash(anchor_data_hash: unknown): void;
    static deserialize(reader: CBORReader): Anchor;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Anchor;
    static from_hex(hex_str: string): Anchor;
    to_bytes(): Uint8Array;
    to_hex(): string;
}
export declare class GovernanceActionId {
    private transaction_id;
    private index;
    constructor(transaction_id: unknown, index: number);
    get_transaction_id(): unknown;
    set_transaction_id(transaction_id: unknown): void;
    get_index(): number;
    set_index(index: number): void;
    static deserialize(reader: CBORReader): GovernanceActionId;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): GovernanceActionId;
    static from_hex(hex_str: string): GovernanceActionId;
    to_bytes(): Uint8Array;
    to_hex(): string;
}
export declare class TransactionInput {
    private transaction_id;
    private index;
    constructor(transaction_id: unknown, index: number);
    get_transaction_id(): unknown;
    set_transaction_id(transaction_id: unknown): void;
    get_index(): number;
    set_index(index: number): void;
    static deserialize(reader: CBORReader): TransactionInput;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): TransactionInput;
    static from_hex(hex_str: string): TransactionInput;
    to_bytes(): Uint8Array;
    to_hex(): string;
}
export declare class TransactionOutput {
    private address;
    private amount;
    private plutus_data;
    private script_ref;
    constructor(address: unknown, amount: unknown, plutus_data: DataOption | undefined, script_ref: ScriptRef | undefined);
    get_address(): unknown;
    set_address(address: unknown): void;
    get_amount(): unknown;
    set_amount(amount: unknown): void;
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
}
export declare class StakeRegistration {
    private stake_credential;
    constructor(stake_credential: Credential);
    get_stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    static deserialize(reader: CBORReader): StakeRegistration;
    serialize(writer: CBORWriter): void;
}
export declare class StakeDeregistration {
    private stake_credential;
    constructor(stake_credential: Credential);
    get_stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    static deserialize(reader: CBORReader): StakeDeregistration;
    serialize(writer: CBORWriter): void;
}
export declare class StakeDelegation {
    private stake_credential;
    private pool_keyhash;
    constructor(stake_credential: Credential, pool_keyhash: unknown);
    get_stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    get_pool_keyhash(): unknown;
    set_pool_keyhash(pool_keyhash: unknown): void;
    static deserialize(reader: CBORReader): StakeDelegation;
    serialize(writer: CBORWriter): void;
}
export declare class PoolRegistration {
    private pool_params;
    constructor(pool_params: PoolParams);
    get_pool_params(): PoolParams;
    set_pool_params(pool_params: PoolParams): void;
    static deserialize(reader: CBORReader): PoolRegistration;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): PoolRegistration;
    static from_hex(hex_str: string): PoolRegistration;
    to_bytes(): Uint8Array;
    to_hex(): string;
}
export declare class PoolRetirement {
    private pool_keyhash;
    private epoch;
    constructor(pool_keyhash: unknown, epoch: number);
    get_pool_keyhash(): unknown;
    set_pool_keyhash(pool_keyhash: unknown): void;
    get_epoch(): number;
    set_epoch(epoch: number): void;
    static deserialize(reader: CBORReader): PoolRetirement;
    serialize(writer: CBORWriter): void;
}
export declare class RegCert {
    private stake_credential;
    private coin;
    constructor(stake_credential: Credential, coin: bigint);
    get_stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    get_coin(): bigint;
    set_coin(coin: bigint): void;
    static deserialize(reader: CBORReader): RegCert;
    serialize(writer: CBORWriter): void;
}
export declare class UnregCert {
    private stake_credential;
    private coin;
    constructor(stake_credential: Credential, coin: bigint);
    get_stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    get_coin(): bigint;
    set_coin(coin: bigint): void;
    static deserialize(reader: CBORReader): UnregCert;
    serialize(writer: CBORWriter): void;
}
export declare class VoteDelegation {
    private stake_credential;
    private drep;
    constructor(stake_credential: Credential, drep: DRep);
    get_stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    get_drep(): DRep;
    set_drep(drep: DRep): void;
    static deserialize(reader: CBORReader): VoteDelegation;
    serialize(writer: CBORWriter): void;
}
export declare class StakeAndVoteDelegation {
    private stake_credential;
    private pool_keyhash;
    private drep;
    constructor(stake_credential: Credential, pool_keyhash: unknown, drep: DRep);
    get_stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    get_pool_keyhash(): unknown;
    set_pool_keyhash(pool_keyhash: unknown): void;
    get_drep(): DRep;
    set_drep(drep: DRep): void;
    static deserialize(reader: CBORReader): StakeAndVoteDelegation;
    serialize(writer: CBORWriter): void;
}
export declare class StakeRegistrationAndDelegation {
    private stake_credential;
    private pool_keyhash;
    private coin;
    constructor(stake_credential: Credential, pool_keyhash: unknown, coin: bigint);
    get_stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    get_pool_keyhash(): unknown;
    set_pool_keyhash(pool_keyhash: unknown): void;
    get_coin(): bigint;
    set_coin(coin: bigint): void;
    static deserialize(reader: CBORReader): StakeRegistrationAndDelegation;
    serialize(writer: CBORWriter): void;
}
export declare class VoteRegistrationAndDelegation {
    private stake_credential;
    private drep;
    private coin;
    constructor(stake_credential: Credential, drep: DRep, coin: bigint);
    get_stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    get_drep(): DRep;
    set_drep(drep: DRep): void;
    get_coin(): bigint;
    set_coin(coin: bigint): void;
    static deserialize(reader: CBORReader): VoteRegistrationAndDelegation;
    serialize(writer: CBORWriter): void;
}
export declare class StakeVoteRegistrationAndDelegation {
    private stake_credential;
    private pool_keyhash;
    private drep;
    private coin;
    constructor(stake_credential: Credential, pool_keyhash: unknown, drep: DRep, coin: bigint);
    get_stake_credential(): Credential;
    set_stake_credential(stake_credential: Credential): void;
    get_pool_keyhash(): unknown;
    set_pool_keyhash(pool_keyhash: unknown): void;
    get_drep(): DRep;
    set_drep(drep: DRep): void;
    get_coin(): bigint;
    set_coin(coin: bigint): void;
    static deserialize(reader: CBORReader): StakeVoteRegistrationAndDelegation;
    serialize(writer: CBORWriter): void;
}
export declare class CommitteeHotAuth {
    private committee_cold_key;
    private committee_hot_key;
    constructor(committee_cold_key: Credential, committee_hot_key: Credential);
    get_committee_cold_key(): Credential;
    set_committee_cold_key(committee_cold_key: Credential): void;
    get_committee_hot_key(): Credential;
    set_committee_hot_key(committee_hot_key: Credential): void;
    static deserialize(reader: CBORReader): CommitteeHotAuth;
    serialize(writer: CBORWriter): void;
}
export declare class CommitteeColdResign {
    private committee_cold_key;
    private anchor;
    constructor(committee_cold_key: Credential, anchor: Anchor | undefined);
    get_committee_cold_key(): Credential;
    set_committee_cold_key(committee_cold_key: Credential): void;
    get_anchor(): Anchor | undefined;
    set_anchor(anchor: Anchor | undefined): void;
    static deserialize(reader: CBORReader): CommitteeColdResign;
    serialize(writer: CBORWriter): void;
}
export declare class DrepRegistration {
    private voting_credential;
    private coin;
    private anchor;
    constructor(voting_credential: Credential, coin: bigint, anchor: Anchor | undefined);
    get_voting_credential(): Credential;
    set_voting_credential(voting_credential: Credential): void;
    get_coin(): bigint;
    set_coin(coin: bigint): void;
    get_anchor(): Anchor | undefined;
    set_anchor(anchor: Anchor | undefined): void;
    static deserialize(reader: CBORReader): DrepRegistration;
    serialize(writer: CBORWriter): void;
}
export declare class DrepDeregistration {
    private drep_credential;
    private coin;
    constructor(drep_credential: Credential, coin: bigint);
    get_drep_credential(): Credential;
    set_drep_credential(drep_credential: Credential): void;
    get_coin(): bigint;
    set_coin(coin: bigint): void;
    static deserialize(reader: CBORReader): DrepDeregistration;
    serialize(writer: CBORWriter): void;
}
export declare class DrepUpdate {
    private drep_credential;
    private anchor;
    constructor(drep_credential: Credential, anchor: Anchor | undefined);
    get_drep_credential(): Credential;
    set_drep_credential(drep_credential: Credential): void;
    get_anchor(): Anchor | undefined;
    set_anchor(anchor: Anchor | undefined): void;
    static deserialize(reader: CBORReader): DrepUpdate;
    serialize(writer: CBORWriter): void;
}

export declare class Credential {
    private variant;
    constructor(variant: CredentialVariant);
    static new_keyhash(keyhash: unknown): Credential;
    static new_scripthash(scripthash: unknown): Credential;
    as_keyhash(): unknown | undefined;
    as_scripthash(): unknown | undefined;
    static deserialize(reader: CBORReader): Credential;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Credential;
    static from_hex(hex_str: string): Credential;
    to_bytes(): Uint8Array;
    to_hex(): string;
}

export declare class DRep {
    private variant;
    constructor(variant: DRepVariant);
    static new_key_hash(key_hash: unknown): DRep;
    static new_script_hash(script_hash: unknown): DRep;
    static new_always_abstain(): DRep;
    static new_always_no_confidence(): DRep;
    as_key_hash(): unknown | undefined;
    as_script_hash(): unknown | undefined;
    static deserialize(reader: CBORReader): DRep;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): DRep;
    static from_hex(hex_str: string): DRep;
    to_bytes(): Uint8Array;
    to_hex(): string;
}
export declare class PoolParams {
    private operator;
    private vrf_keyhash;
    private pledge;
    private cost;
    private margin;
    private reward_account;
    private pool_owners;
    private relays;
    private pool_metadata;
    constructor(operator: unknown, vrf_keyhash: unknown, pledge: bigint, cost: bigint, margin: UnitInterval, reward_account: unknown, pool_owners: Ed25519KeyHashes, relays: Relays, pool_metadata: PoolMetadata | undefined);
    get_operator(): unknown;
    set_operator(operator: unknown): void;
    get_vrf_keyhash(): unknown;
    set_vrf_keyhash(vrf_keyhash: unknown): void;
    get_pledge(): bigint;
    set_pledge(pledge: bigint): void;
    get_cost(): bigint;
    set_cost(cost: bigint): void;
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
}
export declare class SingleHostAddr {
    private port;
    private ipv4;
    private ipv6;
    constructor(port: number | undefined, ipv4: Ipv4 | undefined, ipv6: Ipv6 | undefined);
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
    private port;
    private dns_name;
    constructor(port: number | undefined, dns_name: DNSRecordAorAAAA);
    get_port(): number | undefined;
    set_port(port: number | undefined): void;
    get_dns_name(): DNSRecordAorAAAA;
    set_dns_name(dns_name: DNSRecordAorAAAA): void;
    static deserialize(reader: CBORReader): SingleHostName;
    serialize(writer: CBORWriter): void;
}
export declare class MultiHostName {
    private dns_name;
    constructor(dns_name: DNSRecordSRV);
    get_dns_name(): DNSRecordSRV;
    set_dns_name(dns_name: DNSRecordSRV): void;
    static deserialize(reader: CBORReader): MultiHostName;
    serialize(writer: CBORWriter): void;
}
export declare class PoolMetadata {
    private url;
    private pool_metadata_hash;
    constructor(url: URL, pool_metadata_hash: unknown);
    get_url(): URL;
    set_url(url: URL): void;
    get_pool_metadata_hash(): unknown;
    set_pool_metadata_hash(pool_metadata_hash: unknown): void;
    static deserialize(reader: CBORReader): PoolMetadata;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): PoolMetadata;
    static from_hex(hex_str: string): PoolMetadata;
    to_bytes(): Uint8Array;
    to_hex(): string;
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
}
export declare class Withdrawals {
    private items;
    constructor(items: [unknown, bigint][]);
    static new(): Withdrawals;
    len(): number;
    insert(key: unknown, value: bigint): void;
    get(key: unknown): bigint | undefined;
    static deserialize(reader: CBORReader): Withdrawals;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Withdrawals;
    static from_hex(hex_str: string): Withdrawals;
    to_bytes(): Uint8Array;
    to_hex(): string;
}
export declare class ProtocolParamUpdate {
    private minfee_a;
    private minfee_b;
    private max_block_body_size;
    private max_tx_size;
    private max_block_header_size;
    private key_deposit;
    private pool_deposit;
    private max_epoch;
    private n_opt;
    private pool_pledge_influence;
    private expansion_rate;
    private treasury_growth_rate;
    private min_pool_cost;
    private ada_per_utxo_byte;
    private costmdls;
    private execution_costs;
    private max_tx_ex_units;
    private max_block_ex_units;
    private max_value_size;
    private collateral_percentage;
    private max_collateral_inputs;
    private pool_voting_thresholds;
    private drep_voting_thresholds;
    private min_committee_size;
    private committee_term_limit;
    private governance_action_validity_period;
    private governance_action_deposit;
    private drep_deposit;
    private drep_inactivity_period;
    private script_cost_per_byte;
    constructor(minfee_a: bigint | undefined, minfee_b: bigint | undefined, max_block_body_size: number | undefined, max_tx_size: number | undefined, max_block_header_size: number | undefined, key_deposit: bigint | undefined, pool_deposit: bigint | undefined, max_epoch: number | undefined, n_opt: number | undefined, pool_pledge_influence: UnitInterval | undefined, expansion_rate: UnitInterval | undefined, treasury_growth_rate: UnitInterval | undefined, min_pool_cost: bigint | undefined, ada_per_utxo_byte: bigint | undefined, costmdls: unknown | undefined, execution_costs: ExUnitPrices | undefined, max_tx_ex_units: ExUnits | undefined, max_block_ex_units: ExUnits | undefined, max_value_size: number | undefined, collateral_percentage: number | undefined, max_collateral_inputs: number | undefined, pool_voting_thresholds: PoolVotingThresholds | undefined, drep_voting_thresholds: DrepVotingThresholds | undefined, min_committee_size: number | undefined, committee_term_limit: number | undefined, governance_action_validity_period: number | undefined, governance_action_deposit: bigint | undefined, drep_deposit: bigint | undefined, drep_inactivity_period: number | undefined, script_cost_per_byte: UnitInterval | undefined);
    get_minfee_a(): bigint | undefined;
    set_minfee_a(minfee_a: bigint | undefined): void;
    get_minfee_b(): bigint | undefined;
    set_minfee_b(minfee_b: bigint | undefined): void;
    get_max_block_body_size(): number | undefined;
    set_max_block_body_size(max_block_body_size: number | undefined): void;
    get_max_tx_size(): number | undefined;
    set_max_tx_size(max_tx_size: number | undefined): void;
    get_max_block_header_size(): number | undefined;
    set_max_block_header_size(max_block_header_size: number | undefined): void;
    get_key_deposit(): bigint | undefined;
    set_key_deposit(key_deposit: bigint | undefined): void;
    get_pool_deposit(): bigint | undefined;
    set_pool_deposit(pool_deposit: bigint | undefined): void;
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
    get_min_pool_cost(): bigint | undefined;
    set_min_pool_cost(min_pool_cost: bigint | undefined): void;
    get_ada_per_utxo_byte(): bigint | undefined;
    set_ada_per_utxo_byte(ada_per_utxo_byte: bigint | undefined): void;
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
    get_governance_action_deposit(): bigint | undefined;
    set_governance_action_deposit(governance_action_deposit: bigint | undefined): void;
    get_drep_deposit(): bigint | undefined;
    set_drep_deposit(drep_deposit: bigint | undefined): void;
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
}
export declare class PoolVotingThresholds {
    private motion_no_confidence;
    private committee_normal;
    private committee_no_confidence;
    private hard_fork_initiation;
    private security_relevant_threshold;
    constructor(motion_no_confidence: UnitInterval, committee_normal: UnitInterval, committee_no_confidence: UnitInterval, hard_fork_initiation: UnitInterval, security_relevant_threshold: UnitInterval);
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
}
export declare class DrepVotingThresholds {
    private motion_no_confidence;
    private committee_normal;
    private committee_no_confidence;
    private update_constitution;
    private hard_fork_initiation;
    private pp_network_group;
    private pp_economic_group;
    private pp_technical_group;
    private pp_governance_group;
    private treasury_withdrawal;
    constructor(motion_no_confidence: UnitInterval, committee_normal: UnitInterval, committee_no_confidence: UnitInterval, update_constitution: UnitInterval, hard_fork_initiation: UnitInterval, pp_network_group: UnitInterval, pp_economic_group: UnitInterval, pp_technical_group: UnitInterval, pp_governance_group: UnitInterval, treasury_withdrawal: UnitInterval);
    get_motion_no_confidence(): UnitInterval;
    set_motion_no_confidence(motion_no_confidence: UnitInterval): void;
    get_committee_normal(): UnitInterval;
    set_committee_normal(committee_normal: UnitInterval): void;
    get_committee_no_confidence(): UnitInterval;
    set_committee_no_confidence(committee_no_confidence: UnitInterval): void;
    get_update_constitution(): UnitInterval;
    set_update_constitution(update_constitution: UnitInterval): void;
    get_hard_fork_initiation(): UnitInterval;
    set_hard_fork_initiation(hard_fork_initiation: UnitInterval): void;
    get_pp_network_group(): UnitInterval;
    set_pp_network_group(pp_network_group: UnitInterval): void;
    get_pp_economic_group(): UnitInterval;
    set_pp_economic_group(pp_economic_group: UnitInterval): void;
    get_pp_technical_group(): UnitInterval;
    set_pp_technical_group(pp_technical_group: UnitInterval): void;
    get_pp_governance_group(): UnitInterval;
    set_pp_governance_group(pp_governance_group: UnitInterval): void;
    get_treasury_withdrawal(): UnitInterval;
    set_treasury_withdrawal(treasury_withdrawal: UnitInterval): void;
    static deserialize(reader: CBORReader): DrepVotingThresholds;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): DrepVotingThresholds;
    static from_hex(hex_str: string): DrepVotingThresholds;
    to_bytes(): Uint8Array;
    to_hex(): string;
}
export declare class TransactionWitnessSet {
    private vkeys;
    private native_scripts;
    private bootstraps;
    private plutus_scripts_v1;
    private plutus_data;
    private redeemers;
    private plutus_scripts_v2;
    private plutus_scripts_v3;
    constructor(vkeys: Vkeywitnesses | undefined, native_scripts: NativeScripts | undefined, bootstraps: BootstrapWitnesses | undefined, plutus_scripts_v1: PlutusScripts | undefined, plutus_data: PlutusList | undefined, redeemers: unknown | undefined, plutus_scripts_v2: PlutusScripts | undefined, plutus_scripts_v3: PlutusScripts | undefined);
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
    get_redeemers(): unknown | undefined;
    set_redeemers(redeemers: unknown | undefined): void;
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
}
export declare class ExUnits {
    private mem;
    private steps;
    constructor(mem: bigint, steps: bigint);
    get_mem(): bigint;
    set_mem(mem: bigint): void;
    get_steps(): bigint;
    set_steps(steps: bigint): void;
    static deserialize(reader: CBORReader): ExUnits;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): ExUnits;
    static from_hex(hex_str: string): ExUnits;
    to_bytes(): Uint8Array;
    to_hex(): string;
}
export declare class ExUnitPrices {
    private mem_price;
    private step_price;
    constructor(mem_price: UnitInterval, step_price: UnitInterval);
    get_mem_price(): UnitInterval;
    set_mem_price(mem_price: UnitInterval): void;
    get_step_price(): UnitInterval;
    set_step_price(step_price: UnitInterval): void;
    static deserialize(reader: CBORReader): ExUnitPrices;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): ExUnitPrices;
    static from_hex(hex_str: string): ExUnitPrices;
    to_bytes(): Uint8Array;
    to_hex(): string;
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
}
export declare class GeneralTransactionMetadata {
    private items;
    constructor(items: [bigint, unknown][]);
    static new(): GeneralTransactionMetadata;
    len(): number;
    insert(key: bigint, value: unknown): void;
    get(key: bigint): unknown | undefined;
    static deserialize(reader: CBORReader): GeneralTransactionMetadata;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): GeneralTransactionMetadata;
    static from_hex(hex_str: string): GeneralTransactionMetadata;
    to_bytes(): Uint8Array;
    to_hex(): string;
}
export declare class AuxiliaryData {
    private metadata;
    private native_scripts;
    private plutus_scripts_v1;
    private plutus_scripts_v2;
    private plutus_scripts_v3;
    constructor(metadata: GeneralTransactionMetadata, native_scripts: NativeScripts, plutus_scripts_v1: PlutusScripts, plutus_scripts_v2: PlutusScripts, plutus_scripts_v3: PlutusScripts);
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
}
export declare class Vkeywitness {
    private vkey;
    private signature;
    constructor(vkey: unknown, signature: unknown);
    get_vkey(): unknown;
    set_vkey(vkey: unknown): void;
    get_signature(): unknown;
    set_signature(signature: unknown): void;
    static deserialize(reader: CBORReader): Vkeywitness;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): Vkeywitness;
    static from_hex(hex_str: string): Vkeywitness;
    to_bytes(): Uint8Array;
    to_hex(): string;
}
export declare class BootstrapWitness {
    private vkey;
    private signature;
    private chain_code;
    private attributes;
    constructor(vkey: unknown, signature: unknown, chain_code: Uint8Array, attributes: Uint8Array);
    get_vkey(): unknown;
    set_vkey(vkey: unknown): void;
    get_signature(): unknown;
    set_signature(signature: unknown): void;
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
}
export declare class ScriptPubname {
    private addr_keyhash;
    constructor(addr_keyhash: unknown);
    get_addr_keyhash(): unknown;
    set_addr_keyhash(addr_keyhash: unknown): void;
    static deserialize(reader: CBORReader): ScriptPubname;
    serialize(writer: CBORWriter): void;
}
export declare class ScriptAll {
    private native_scripts;
    constructor(native_scripts: NativeScripts);
    get_native_scripts(): NativeScripts;
    set_native_scripts(native_scripts: NativeScripts): void;
    static deserialize(reader: CBORReader): ScriptAll;
    serialize(writer: CBORWriter): void;
}
export declare class ScriptAny {
    private native_scripts;
    constructor(native_scripts: NativeScripts);
    get_native_scripts(): NativeScripts;
    set_native_scripts(native_scripts: NativeScripts): void;
    static deserialize(reader: CBORReader): ScriptAny;
    serialize(writer: CBORWriter): void;
}
export declare class ScriptNOfK {
    private n;
    private native_scripts;
    constructor(n: number, native_scripts: NativeScripts);
    get_n(): number;
    set_n(n: number): void;
    get_native_scripts(): NativeScripts;
    set_native_scripts(native_scripts: NativeScripts): void;
    static deserialize(reader: CBORReader): ScriptNOfK;
    serialize(writer: CBORWriter): void;
}
export declare class TimelockStart {
    private slot;
    constructor(slot: bigint);
    get_slot(): bigint;
    set_slot(slot: bigint): void;
    static deserialize(reader: CBORReader): TimelockStart;
    serialize(writer: CBORWriter): void;
}
export declare class TimelockExpiry {
    private slot;
    constructor(slot: bigint);
    get_slot(): bigint;
    set_slot(slot: bigint): void;
    static deserialize(reader: CBORReader): TimelockExpiry;
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
}

export declare class DataOption {
    private variant;
    constructor(variant: DataOptionVariant);
    static new_hash(hash: unknown): DataOption;
    static new_data(data: unknown): DataOption;
    as_hash(): unknown | undefined;
    as_data(): unknown | undefined;
    static deserialize(reader: CBORReader): DataOption;
    serialize(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): DataOption;
    static from_hex(hex_str: string): DataOption;
    to_bytes(): Uint8Array;
    to_hex(): string;
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
}
export declare class UnitInterval {
    private numerator;
    private denominator;
    constructor(numerator: bigint, denominator: bigint);
    get_numerator(): bigint;
    set_numerator(numerator: bigint): void;
    get_denominator(): bigint;
    set_denominator(denominator: bigint): void;
    static deserialize(reader: CBORReader): UnitInterval;
    static deserializeInner(reader: CBORReader): UnitInterval;
    serialize(writer: CBORWriter): void;
    serializeInner(writer: CBORWriter): void;
    free(): void;
    static from_bytes(data: Uint8Array): UnitInterval;
    static from_hex(hex_str: string): UnitInterval;
    to_bytes(): Uint8Array;
    to_hex(): string;
}
