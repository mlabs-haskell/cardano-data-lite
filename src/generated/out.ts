import { CBORValue, CBORMap } from "../cbor/types";
import {
  CBORArrayReader,
  CBORMapReader,
  CBORReaderValue,
} from "../cbor/reader";
import { CBORWriter } from "../cbor/writer";

export class TransactionBodies extends Array<TransactionBody> {
  static fromCBOR(value: CBORReaderValue): TransactionBodies {
    let array = value.get("array");
    return new TransactionBodies(
      ...array.map((x) => TransactionBody.fromCBOR(x)),
    );
  }
}

export class TransactionWitnessSets extends Array<TransactionWitnessSet> {
  static fromCBOR(value: CBORReaderValue): TransactionWitnessSets {
    let array = value.get("array");
    return new TransactionWitnessSets(
      ...array.map((x) => TransactionWitnessSet.fromCBOR(x)),
    );
  }
}

export class AuxiliaryDataSet extends CBORMap<TransactionIndex, AuxiliaryData> {
  static fromCBOR(value: CBORReaderValue): AuxiliaryDataSet {
    let map = value.get("map");
    return new AuxiliaryDataSet(
      map.map({
        key: (x) => TransactionIndex.fromCBOR(x),
        value: (x) => TransactionIndex.fromCBOR(x),
      }),
    );
  }
}

export class InvalidTransactions extends Array<TransactionIndex> {
  static fromCBOR(value: CBORReaderValue): InvalidTransactions {
    let array = value.get("array");
    return new InvalidTransactions(
      ...array.map((x) => TransactionIndex.fromCBOR(x)),
    );
  }
}

export class Block {
  private header: Header;
  private transaction_bodies: TransactionBodies;
  private transaction_witness_sets: TransactionWitnessSets;
  private auxiliary_data_set: AuxiliaryDataSet;
  private invalid_transactions: InvalidTransactions;

  constructor(
    header: Header,
    transaction_bodies: TransactionBodies,
    transaction_witness_sets: TransactionWitnessSets,
    auxiliary_data_set: AuxiliaryDataSet,
    invalid_transactions: InvalidTransactions,
  ) {
    this.header = header;
    this.transaction_bodies = transaction_bodies;
    this.transaction_witness_sets = transaction_witness_sets;
    this.auxiliary_data_set = auxiliary_data_set;
    this.invalid_transactions = invalid_transactions;
  }

  get_header(): Header {
    return this.header;
  }

  set_header(header: Header): void {
    this.header = header;
  }

  get_transaction_bodies(): TransactionBodies {
    return this.transaction_bodies;
  }

  set_transaction_bodies(transaction_bodies: TransactionBodies): void {
    this.transaction_bodies = transaction_bodies;
  }

  get_transaction_witness_sets(): TransactionWitnessSets {
    return this.transaction_witness_sets;
  }

  set_transaction_witness_sets(
    transaction_witness_sets: TransactionWitnessSets,
  ): void {
    this.transaction_witness_sets = transaction_witness_sets;
  }

  get_auxiliary_data_set(): AuxiliaryDataSet {
    return this.auxiliary_data_set;
  }

  set_auxiliary_data_set(auxiliary_data_set: AuxiliaryDataSet): void {
    this.auxiliary_data_set = auxiliary_data_set;
  }

  get_invalid_transactions(): InvalidTransactions {
    return this.invalid_transactions;
  }

  set_invalid_transactions(invalid_transactions: InvalidTransactions): void {
    this.invalid_transactions = invalid_transactions;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): Block {
    let header_ = array.shiftRequired();
    let header = Header.fromCBOR(header_);
    let transaction_bodies_ = array.shiftRequired();
    let transaction_bodies = TransactionBodies.fromCBOR(transaction_bodies_);
    let transaction_witness_sets_ = array.shiftRequired();
    let transaction_witness_sets = TransactionWitnessSets.fromCBOR(
      transaction_witness_sets_,
    );
    let auxiliary_data_set_ = array.shiftRequired();
    let auxiliary_data_set = AuxiliaryDataSet.fromCBOR(auxiliary_data_set_);
    let invalid_transactions_ = array.shiftRequired();
    let invalid_transactions = InvalidTransactions.fromCBOR(
      invalid_transactions_,
    );

    return new Block(
      header,
      transaction_bodies,
      transaction_witness_sets,
      auxiliary_data_set,
      invalid_transactions,
    );
  }

  toArray() {
    let entries = [];
    entries.push(this.header);
    entries.push(this.transaction_bodies);
    entries.push(this.transaction_witness_sets);
    entries.push(this.auxiliary_data_set);
    entries.push(this.invalid_transactions);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): Block {
    let array = value.get("array");
    return Block.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class Transaction {
  private transaction_body: TransactionBody;
  private transaction_witness_set: TransactionWitnessSet;
  private is_valid: Boolean;
  private auxiliary_data: AuxiliaryData | undefined;

  constructor(
    transaction_body: TransactionBody,
    transaction_witness_set: TransactionWitnessSet,
    is_valid: Boolean,
    auxiliary_data: AuxiliaryData | undefined,
  ) {
    this.transaction_body = transaction_body;
    this.transaction_witness_set = transaction_witness_set;
    this.is_valid = is_valid;
    this.auxiliary_data = auxiliary_data;
  }

  get_transaction_body(): TransactionBody {
    return this.transaction_body;
  }

  set_transaction_body(transaction_body: TransactionBody): void {
    this.transaction_body = transaction_body;
  }

  get_transaction_witness_set(): TransactionWitnessSet {
    return this.transaction_witness_set;
  }

  set_transaction_witness_set(
    transaction_witness_set: TransactionWitnessSet,
  ): void {
    this.transaction_witness_set = transaction_witness_set;
  }

  get_is_valid(): Boolean {
    return this.is_valid;
  }

  set_is_valid(is_valid: Boolean): void {
    this.is_valid = is_valid;
  }

  get_auxiliary_data(): AuxiliaryData | undefined {
    return this.auxiliary_data;
  }

  set_auxiliary_data(auxiliary_data: AuxiliaryData): void {
    this.auxiliary_data = auxiliary_data;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): Transaction {
    let transaction_body_ = array.shiftRequired();
    let transaction_body = TransactionBody.fromCBOR(transaction_body_);
    let transaction_witness_set_ = array.shiftRequired();
    let transaction_witness_set = TransactionWitnessSet.fromCBOR(
      transaction_witness_set_,
    );
    let is_valid_ = array.shiftRequired();
    let is_valid = Boolean.fromCBOR(is_valid_);
    let auxiliary_data_ = array.shiftRequired();
    let auxiliary_data__ = auxiliary_data_.withNullable((x) =>
      AuxiliaryData.fromCBOR(x),
    );
    let auxiliary_data =
      auxiliary_data__ == null ? undefined : auxiliary_data__;

    return new Transaction(
      transaction_body,
      transaction_witness_set,
      is_valid,
      auxiliary_data,
    );
  }

  toArray() {
    let entries = [];
    entries.push(this.transaction_body);
    entries.push(this.transaction_witness_set);
    entries.push(this.is_valid);
    entries.push(this.auxiliary_data);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): Transaction {
    let array = value.get("array");
    return Transaction.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class Header {
  private header_body: HeaderBody;
  private body_signature: KesSignature;

  constructor(header_body: HeaderBody, body_signature: KesSignature) {
    this.header_body = header_body;
    this.body_signature = body_signature;
  }

  get_header_body(): HeaderBody {
    return this.header_body;
  }

  set_header_body(header_body: HeaderBody): void {
    this.header_body = header_body;
  }

  get_body_signature(): KesSignature {
    return this.body_signature;
  }

  set_body_signature(body_signature: KesSignature): void {
    this.body_signature = body_signature;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): Header {
    let header_body_ = array.shiftRequired();
    let header_body = HeaderBody.fromCBOR(header_body_);
    let body_signature_ = array.shiftRequired();
    let body_signature = KesSignature.fromCBOR(body_signature_);

    return new Header(header_body, body_signature);
  }

  toArray() {
    let entries = [];
    entries.push(this.header_body);
    entries.push(this.body_signature);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): Header {
    let array = value.get("array");
    return Header.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class HeaderBody {
  private block_number: number;
  private slot: number;
  private prev_hash: Hash32 | undefined;
  private issuer_vkey: Vkey;
  private vrf_vkey: VrfVkey;
  private vrf_result: VrfCert;
  private block_body_size: number;
  private block_body_hash: Hash32;
  private operational_cert: OperationalCert;
  private protocol_version: ProtocolVersion;

  constructor(
    block_number: number,
    slot: number,
    prev_hash: Hash32 | undefined,
    issuer_vkey: Vkey,
    vrf_vkey: VrfVkey,
    vrf_result: VrfCert,
    block_body_size: number,
    block_body_hash: Hash32,
    operational_cert: OperationalCert,
    protocol_version: ProtocolVersion,
  ) {
    this.block_number = block_number;
    this.slot = slot;
    this.prev_hash = prev_hash;
    this.issuer_vkey = issuer_vkey;
    this.vrf_vkey = vrf_vkey;
    this.vrf_result = vrf_result;
    this.block_body_size = block_body_size;
    this.block_body_hash = block_body_hash;
    this.operational_cert = operational_cert;
    this.protocol_version = protocol_version;
  }

  get_block_number(): number {
    return this.block_number;
  }

  set_block_number(block_number: number): void {
    this.block_number = block_number;
  }

  get_slot(): number {
    return this.slot;
  }

  set_slot(slot: number): void {
    this.slot = slot;
  }

  get_prev_hash(): Hash32 | undefined {
    return this.prev_hash;
  }

  set_prev_hash(prev_hash: Hash32): void {
    this.prev_hash = prev_hash;
  }

  get_issuer_vkey(): Vkey {
    return this.issuer_vkey;
  }

  set_issuer_vkey(issuer_vkey: Vkey): void {
    this.issuer_vkey = issuer_vkey;
  }

  get_vrf_vkey(): VrfVkey {
    return this.vrf_vkey;
  }

  set_vrf_vkey(vrf_vkey: VrfVkey): void {
    this.vrf_vkey = vrf_vkey;
  }

  get_vrf_result(): VrfCert {
    return this.vrf_result;
  }

  set_vrf_result(vrf_result: VrfCert): void {
    this.vrf_result = vrf_result;
  }

  get_block_body_size(): number {
    return this.block_body_size;
  }

  set_block_body_size(block_body_size: number): void {
    this.block_body_size = block_body_size;
  }

  get_block_body_hash(): Hash32 {
    return this.block_body_hash;
  }

  set_block_body_hash(block_body_hash: Hash32): void {
    this.block_body_hash = block_body_hash;
  }

  get_operational_cert(): OperationalCert {
    return this.operational_cert;
  }

  set_operational_cert(operational_cert: OperationalCert): void {
    this.operational_cert = operational_cert;
  }

  get_protocol_version(): ProtocolVersion {
    return this.protocol_version;
  }

  set_protocol_version(protocol_version: ProtocolVersion): void {
    this.protocol_version = protocol_version;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): HeaderBody {
    let block_number_ = array.shiftRequired();
    let block_number = block_number_.get("uint");
    let slot_ = array.shiftRequired();
    let slot = slot_.get("uint");
    let prev_hash_ = array.shiftRequired();
    let prev_hash__ = prev_hash_.withNullable((x) => Hash32.fromCBOR(x));
    let prev_hash = prev_hash__ == null ? undefined : prev_hash__;
    let issuer_vkey_ = array.shiftRequired();
    let issuer_vkey = Vkey.fromCBOR(issuer_vkey_);
    let vrf_vkey_ = array.shiftRequired();
    let vrf_vkey = VrfVkey.fromCBOR(vrf_vkey_);
    let vrf_result_ = array.shiftRequired();
    let vrf_result = VrfCert.fromCBOR(vrf_result_);
    let block_body_size_ = array.shiftRequired();
    let block_body_size = block_body_size_.get("uint");
    let block_body_hash_ = array.shiftRequired();
    let block_body_hash = Hash32.fromCBOR(block_body_hash_);
    let operational_cert_ = array.shiftRequired();
    let operational_cert = OperationalCert.fromCBOR(operational_cert_);
    let protocol_version_ = array.shiftRequired();
    let protocol_version = ProtocolVersion.fromCBOR(protocol_version_);

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

  toArray() {
    let entries = [];
    entries.push(this.block_number);
    entries.push(this.slot);
    entries.push(this.prev_hash);
    entries.push(this.issuer_vkey);
    entries.push(this.vrf_vkey);
    entries.push(this.vrf_result);
    entries.push(this.block_body_size);
    entries.push(this.block_body_hash);
    entries.push(this.operational_cert);
    entries.push(this.protocol_version);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): HeaderBody {
    let array = value.get("array");
    return HeaderBody.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class OperationalCert {
  private hot_vkey: KesVkey;
  private sequence_number: number;
  private kes_period: number;
  private sigma: Signature;

  constructor(
    hot_vkey: KesVkey,
    sequence_number: number,
    kes_period: number,
    sigma: Signature,
  ) {
    this.hot_vkey = hot_vkey;
    this.sequence_number = sequence_number;
    this.kes_period = kes_period;
    this.sigma = sigma;
  }

  get_hot_vkey(): KesVkey {
    return this.hot_vkey;
  }

  set_hot_vkey(hot_vkey: KesVkey): void {
    this.hot_vkey = hot_vkey;
  }

  get_sequence_number(): number {
    return this.sequence_number;
  }

  set_sequence_number(sequence_number: number): void {
    this.sequence_number = sequence_number;
  }

  get_kes_period(): number {
    return this.kes_period;
  }

  set_kes_period(kes_period: number): void {
    this.kes_period = kes_period;
  }

  get_sigma(): Signature {
    return this.sigma;
  }

  set_sigma(sigma: Signature): void {
    this.sigma = sigma;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): OperationalCert {
    let hot_vkey_ = array.shiftRequired();
    let hot_vkey = KesVkey.fromCBOR(hot_vkey_);
    let sequence_number_ = array.shiftRequired();
    let sequence_number = sequence_number_.get("uint");
    let kes_period_ = array.shiftRequired();
    let kes_period = kes_period_.get("uint");
    let sigma_ = array.shiftRequired();
    let sigma = Signature.fromCBOR(sigma_);

    return new OperationalCert(hot_vkey, sequence_number, kes_period, sigma);
  }

  toArray() {
    let entries = [];
    entries.push(this.hot_vkey);
    entries.push(this.sequence_number);
    entries.push(this.kes_period);
    entries.push(this.sigma);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): OperationalCert {
    let array = value.get("array");
    return OperationalCert.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class ProtocolVersion {
  private major_protocol_version: MajorProtocolVersion;
  private minor_protocol_version: number;

  constructor(
    major_protocol_version: MajorProtocolVersion,
    minor_protocol_version: number,
  ) {
    this.major_protocol_version = major_protocol_version;
    this.minor_protocol_version = minor_protocol_version;
  }

  get_major_protocol_version(): MajorProtocolVersion {
    return this.major_protocol_version;
  }

  set_major_protocol_version(
    major_protocol_version: MajorProtocolVersion,
  ): void {
    this.major_protocol_version = major_protocol_version;
  }

  get_minor_protocol_version(): number {
    return this.minor_protocol_version;
  }

  set_minor_protocol_version(minor_protocol_version: number): void {
    this.minor_protocol_version = minor_protocol_version;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): ProtocolVersion {
    let major_protocol_version_ = array.shiftRequired();
    let major_protocol_version = MajorProtocolVersion.fromCBOR(
      major_protocol_version_,
    );
    let minor_protocol_version_ = array.shiftRequired();
    let minor_protocol_version = minor_protocol_version_.get("uint");

    return new ProtocolVersion(major_protocol_version, minor_protocol_version);
  }

  toArray() {
    let entries = [];
    entries.push(this.major_protocol_version);
    entries.push(this.minor_protocol_version);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): ProtocolVersion {
    let array = value.get("array");
    return ProtocolVersion.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class Inputs extends Array<TransactionInput> {
  static fromCBOR(value: CBORReaderValue): Inputs {
    let tagged = value.get("tagged");
    let array = tagged.getTagged(258n).get("array");
    return new Inputs(...array.map((x) => TransactionInput.fromCBOR(x)));
  }

  toCBOR(writer: CBORWriter) {
    return writer.writeTagged(258n, [...this]);
  }
}

export class TransactionOutputs extends Array<TransactionOutput> {
  static fromCBOR(value: CBORReaderValue): TransactionOutputs {
    let array = value.get("array");
    return new TransactionOutputs(
      ...array.map((x) => TransactionOutput.fromCBOR(x)),
    );
  }
}

export class CollateralInputs extends Array<TransactionInput> {
  static fromCBOR(value: CBORReaderValue): CollateralInputs {
    let tagged = value.get("tagged");
    let array = tagged.getTagged(258n).get("array");
    return new CollateralInputs(
      ...array.map((x) => TransactionInput.fromCBOR(x)),
    );
  }

  toCBOR(writer: CBORWriter) {
    return writer.writeTagged(258n, [...this]);
  }
}

export class ReferenceInputs extends Array<TransactionInput> {
  static fromCBOR(value: CBORReaderValue): ReferenceInputs {
    let tagged = value.get("tagged");
    let array = tagged.getTagged(258n).get("array");
    return new ReferenceInputs(
      ...array.map((x) => TransactionInput.fromCBOR(x)),
    );
  }

  toCBOR(writer: CBORWriter) {
    return writer.writeTagged(258n, [...this]);
  }
}

export class TransactionBody {
  private inputs: Inputs;
  private transaction_outputs: TransactionOutputs;
  private fee: Coin;
  private time_to_live: number | undefined;
  private certificates: Certificates | undefined;
  private withdrawals: Withdrawals | undefined;
  private auxiliary_data_hash: AuxiliaryDataHash | undefined;
  private validity_interval_start: number | undefined;
  private mint: Mint | undefined;
  private script_data_hash: ScriptDataHash | undefined;
  private collateral_inputs: CollateralInputs | undefined;
  private required_signers: RequiredSigners | undefined;
  private network_id: NetworkId | undefined;
  private collateral_return: TransactionOutput | undefined;
  private total_collateral: Coin | undefined;
  private reference_inputs: ReferenceInputs | undefined;
  private voting_procedures: VotingProcedures | undefined;
  private proposal_procedures: ProposalProcedures | undefined;
  private current_treasury_value: Coin | undefined;
  private donation: PositiveCoin | undefined;

  constructor(
    inputs: Inputs,
    transaction_outputs: TransactionOutputs,
    fee: Coin,
    time_to_live: number | undefined,
    certificates: Certificates | undefined,
    withdrawals: Withdrawals | undefined,
    auxiliary_data_hash: AuxiliaryDataHash | undefined,
    validity_interval_start: number | undefined,
    mint: Mint | undefined,
    script_data_hash: ScriptDataHash | undefined,
    collateral_inputs: CollateralInputs | undefined,
    required_signers: RequiredSigners | undefined,
    network_id: NetworkId | undefined,
    collateral_return: TransactionOutput | undefined,
    total_collateral: Coin | undefined,
    reference_inputs: ReferenceInputs | undefined,
    voting_procedures: VotingProcedures | undefined,
    proposal_procedures: ProposalProcedures | undefined,
    current_treasury_value: Coin | undefined,
    donation: PositiveCoin | undefined,
  ) {
    this.inputs = inputs;
    this.transaction_outputs = transaction_outputs;
    this.fee = fee;
    this.time_to_live = time_to_live;
    this.certificates = certificates;
    this.withdrawals = withdrawals;
    this.auxiliary_data_hash = auxiliary_data_hash;
    this.validity_interval_start = validity_interval_start;
    this.mint = mint;
    this.script_data_hash = script_data_hash;
    this.collateral_inputs = collateral_inputs;
    this.required_signers = required_signers;
    this.network_id = network_id;
    this.collateral_return = collateral_return;
    this.total_collateral = total_collateral;
    this.reference_inputs = reference_inputs;
    this.voting_procedures = voting_procedures;
    this.proposal_procedures = proposal_procedures;
    this.current_treasury_value = current_treasury_value;
    this.donation = donation;
  }

  get_inputs(): Inputs {
    return this.inputs;
  }

  set_inputs(inputs: Inputs): void {
    this.inputs = inputs;
  }

  get_transaction_outputs(): TransactionOutputs {
    return this.transaction_outputs;
  }

  set_transaction_outputs(transaction_outputs: TransactionOutputs): void {
    this.transaction_outputs = transaction_outputs;
  }

  get_fee(): Coin {
    return this.fee;
  }

  set_fee(fee: Coin): void {
    this.fee = fee;
  }

  get_time_to_live(): number | undefined {
    return this.time_to_live;
  }

  set_time_to_live(time_to_live: number): void {
    this.time_to_live = time_to_live;
  }

  get_certificates(): Certificates | undefined {
    return this.certificates;
  }

  set_certificates(certificates: Certificates): void {
    this.certificates = certificates;
  }

  get_withdrawals(): Withdrawals | undefined {
    return this.withdrawals;
  }

  set_withdrawals(withdrawals: Withdrawals): void {
    this.withdrawals = withdrawals;
  }

  get_auxiliary_data_hash(): AuxiliaryDataHash | undefined {
    return this.auxiliary_data_hash;
  }

  set_auxiliary_data_hash(auxiliary_data_hash: AuxiliaryDataHash): void {
    this.auxiliary_data_hash = auxiliary_data_hash;
  }

  get_validity_interval_start(): number | undefined {
    return this.validity_interval_start;
  }

  set_validity_interval_start(validity_interval_start: number): void {
    this.validity_interval_start = validity_interval_start;
  }

  get_mint(): Mint | undefined {
    return this.mint;
  }

  set_mint(mint: Mint): void {
    this.mint = mint;
  }

  get_script_data_hash(): ScriptDataHash | undefined {
    return this.script_data_hash;
  }

  set_script_data_hash(script_data_hash: ScriptDataHash): void {
    this.script_data_hash = script_data_hash;
  }

  get_collateral_inputs(): CollateralInputs | undefined {
    return this.collateral_inputs;
  }

  set_collateral_inputs(collateral_inputs: CollateralInputs): void {
    this.collateral_inputs = collateral_inputs;
  }

  get_required_signers(): RequiredSigners | undefined {
    return this.required_signers;
  }

  set_required_signers(required_signers: RequiredSigners): void {
    this.required_signers = required_signers;
  }

  get_network_id(): NetworkId | undefined {
    return this.network_id;
  }

  set_network_id(network_id: NetworkId): void {
    this.network_id = network_id;
  }

  get_collateral_return(): TransactionOutput | undefined {
    return this.collateral_return;
  }

  set_collateral_return(collateral_return: TransactionOutput): void {
    this.collateral_return = collateral_return;
  }

  get_total_collateral(): Coin | undefined {
    return this.total_collateral;
  }

  set_total_collateral(total_collateral: Coin): void {
    this.total_collateral = total_collateral;
  }

  get_reference_inputs(): ReferenceInputs | undefined {
    return this.reference_inputs;
  }

  set_reference_inputs(reference_inputs: ReferenceInputs): void {
    this.reference_inputs = reference_inputs;
  }

  get_voting_procedures(): VotingProcedures | undefined {
    return this.voting_procedures;
  }

  set_voting_procedures(voting_procedures: VotingProcedures): void {
    this.voting_procedures = voting_procedures;
  }

  get_proposal_procedures(): ProposalProcedures | undefined {
    return this.proposal_procedures;
  }

  set_proposal_procedures(proposal_procedures: ProposalProcedures): void {
    this.proposal_procedures = proposal_procedures;
  }

  get_current_treasury_value(): Coin | undefined {
    return this.current_treasury_value;
  }

  set_current_treasury_value(current_treasury_value: Coin): void {
    this.current_treasury_value = current_treasury_value;
  }

  get_donation(): PositiveCoin | undefined {
    return this.donation;
  }

  set_donation(donation: PositiveCoin): void {
    this.donation = donation;
  }

  static fromCBOR(value: CBORReaderValue): TransactionBody {
    let map = value
      .get("map")
      .toMap()
      .map({ key: (x) => Number(x.getInt()), value: (x) => x });
    let inputs_ = map.getRequired(0);
    let inputs = inputs_ != undefined ? Inputs.fromCBOR(inputs_) : undefined;
    let transaction_outputs_ = map.getRequired(1);
    let transaction_outputs =
      transaction_outputs_ != undefined
        ? TransactionOutputs.fromCBOR(transaction_outputs_)
        : undefined;
    let fee_ = map.getRequired(2);
    let fee = fee_ != undefined ? Coin.fromCBOR(fee_) : undefined;
    let time_to_live_ = map.get(3);
    let time_to_live =
      time_to_live_ != undefined ? time_to_live_.get("uint") : undefined;
    let certificates_ = map.get(4);
    let certificates =
      certificates_ != undefined
        ? Certificates.fromCBOR(certificates_)
        : undefined;
    let withdrawals_ = map.get(5);
    let withdrawals =
      withdrawals_ != undefined
        ? Withdrawals.fromCBOR(withdrawals_)
        : undefined;
    let auxiliary_data_hash_ = map.get(7);
    let auxiliary_data_hash =
      auxiliary_data_hash_ != undefined
        ? AuxiliaryDataHash.fromCBOR(auxiliary_data_hash_)
        : undefined;
    let validity_interval_start_ = map.get(8);
    let validity_interval_start =
      validity_interval_start_ != undefined
        ? validity_interval_start_.get("uint")
        : undefined;
    let mint_ = map.get(9);
    let mint = mint_ != undefined ? Mint.fromCBOR(mint_) : undefined;
    let script_data_hash_ = map.get(11);
    let script_data_hash =
      script_data_hash_ != undefined
        ? ScriptDataHash.fromCBOR(script_data_hash_)
        : undefined;
    let collateral_inputs_ = map.get(13);
    let collateral_inputs =
      collateral_inputs_ != undefined
        ? CollateralInputs.fromCBOR(collateral_inputs_)
        : undefined;
    let required_signers_ = map.get(14);
    let required_signers =
      required_signers_ != undefined
        ? RequiredSigners.fromCBOR(required_signers_)
        : undefined;
    let network_id_ = map.get(15);
    let network_id =
      network_id_ != undefined ? NetworkId.fromCBOR(network_id_) : undefined;
    let collateral_return_ = map.get(16);
    let collateral_return =
      collateral_return_ != undefined
        ? TransactionOutput.fromCBOR(collateral_return_)
        : undefined;
    let total_collateral_ = map.get(17);
    let total_collateral =
      total_collateral_ != undefined
        ? Coin.fromCBOR(total_collateral_)
        : undefined;
    let reference_inputs_ = map.get(18);
    let reference_inputs =
      reference_inputs_ != undefined
        ? ReferenceInputs.fromCBOR(reference_inputs_)
        : undefined;
    let voting_procedures_ = map.get(19);
    let voting_procedures =
      voting_procedures_ != undefined
        ? VotingProcedures.fromCBOR(voting_procedures_)
        : undefined;
    let proposal_procedures_ = map.get(20);
    let proposal_procedures =
      proposal_procedures_ != undefined
        ? ProposalProcedures.fromCBOR(proposal_procedures_)
        : undefined;
    let current_treasury_value_ = map.get(21);
    let current_treasury_value =
      current_treasury_value_ != undefined
        ? Coin.fromCBOR(current_treasury_value_)
        : undefined;
    let donation_ = map.get(22);
    let donation =
      donation_ != undefined ? PositiveCoin.fromCBOR(donation_) : undefined;

    return new TransactionBody(
      inputs,
      transaction_outputs,
      fee,
      time_to_live,
      certificates,
      withdrawals,
      auxiliary_data_hash,
      validity_interval_start,
      mint,
      script_data_hash,
      collateral_inputs,
      required_signers,
      network_id,
      collateral_return,
      total_collateral,
      reference_inputs,
      voting_procedures,
      proposal_procedures,
      current_treasury_value,
      donation,
    );
  }

  toCBOR(writer: CBORWriter) {
    let entries = [];
    entries.push([0, this.inputs]);
    entries.push([1, this.transaction_outputs]);
    entries.push([2, this.fee]);
    if (this.time_to_live !== undefined) entries.push([3, this.time_to_live]);
    if (this.certificates !== undefined) entries.push([4, this.certificates]);
    if (this.withdrawals !== undefined) entries.push([5, this.withdrawals]);
    if (this.auxiliary_data_hash !== undefined)
      entries.push([7, this.auxiliary_data_hash]);
    if (this.validity_interval_start !== undefined)
      entries.push([8, this.validity_interval_start]);
    if (this.mint !== undefined) entries.push([9, this.mint]);
    if (this.script_data_hash !== undefined)
      entries.push([11, this.script_data_hash]);
    if (this.collateral_inputs !== undefined)
      entries.push([13, this.collateral_inputs]);
    if (this.required_signers !== undefined)
      entries.push([14, this.required_signers]);
    if (this.network_id !== undefined) entries.push([15, this.network_id]);
    if (this.collateral_return !== undefined)
      entries.push([16, this.collateral_return]);
    if (this.total_collateral !== undefined)
      entries.push([17, this.total_collateral]);
    if (this.reference_inputs !== undefined)
      entries.push([18, this.reference_inputs]);
    if (this.voting_procedures !== undefined)
      entries.push([19, this.voting_procedures]);
    if (this.proposal_procedures !== undefined)
      entries.push([20, this.proposal_procedures]);
    if (this.current_treasury_value !== undefined)
      entries.push([21, this.current_treasury_value]);
    if (this.donation !== undefined) entries.push([22, this.donation]);
    writer.writeMap(entries);
  }
}

export class VotingProcedure {
  private vote: Vote;
  private anchor: Anchor | undefined;

  constructor(vote: Vote, anchor: Anchor | undefined) {
    this.vote = vote;
    this.anchor = anchor;
  }

  get_vote(): Vote {
    return this.vote;
  }

  set_vote(vote: Vote): void {
    this.vote = vote;
  }

  get_anchor(): Anchor | undefined {
    return this.anchor;
  }

  set_anchor(anchor: Anchor): void {
    this.anchor = anchor;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): VotingProcedure {
    let vote_ = array.shiftRequired();
    let vote = Vote.fromCBOR(vote_);
    let anchor_ = array.shiftRequired();
    let anchor__ = anchor_.withNullable((x) => Anchor.fromCBOR(x));
    let anchor = anchor__ == null ? undefined : anchor__;

    return new VotingProcedure(vote, anchor);
  }

  toArray() {
    let entries = [];
    entries.push(this.vote);
    entries.push(this.anchor);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): VotingProcedure {
    let array = value.get("array");
    return VotingProcedure.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class ProposalProcedure {
  private deposit: Coin;
  private reward_account: RewardAccount;
  private gov_action: GovAction;
  private anchor: Anchor;

  constructor(
    deposit: Coin,
    reward_account: RewardAccount,
    gov_action: GovAction,
    anchor: Anchor,
  ) {
    this.deposit = deposit;
    this.reward_account = reward_account;
    this.gov_action = gov_action;
    this.anchor = anchor;
  }

  get_deposit(): Coin {
    return this.deposit;
  }

  set_deposit(deposit: Coin): void {
    this.deposit = deposit;
  }

  get_reward_account(): RewardAccount {
    return this.reward_account;
  }

  set_reward_account(reward_account: RewardAccount): void {
    this.reward_account = reward_account;
  }

  get_gov_action(): GovAction {
    return this.gov_action;
  }

  set_gov_action(gov_action: GovAction): void {
    this.gov_action = gov_action;
  }

  get_anchor(): Anchor {
    return this.anchor;
  }

  set_anchor(anchor: Anchor): void {
    this.anchor = anchor;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): ProposalProcedure {
    let deposit_ = array.shiftRequired();
    let deposit = Coin.fromCBOR(deposit_);
    let reward_account_ = array.shiftRequired();
    let reward_account = RewardAccount.fromCBOR(reward_account_);
    let gov_action_ = array.shiftRequired();
    let gov_action = GovAction.fromCBOR(gov_action_);
    let anchor_ = array.shiftRequired();
    let anchor = Anchor.fromCBOR(anchor_);

    return new ProposalProcedure(deposit, reward_account, gov_action, anchor);
  }

  toArray() {
    let entries = [];
    entries.push(this.deposit);
    entries.push(this.reward_account);
    entries.push(this.gov_action);
    entries.push(this.anchor);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): ProposalProcedure {
    let array = value.get("array");
    return ProposalProcedure.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class ProposalProcedures extends Array<ProposalProcedure> {
  static fromCBOR(value: CBORReaderValue): ProposalProcedures {
    let tagged = value.get("tagged");
    let array = tagged.getTagged(258n).get("array");
    return new ProposalProcedures(
      ...array.map((x) => ProposalProcedure.fromCBOR(x)),
    );
  }

  toCBOR(writer: CBORWriter) {
    return writer.writeTagged(258n, [...this]);
  }
}

export class Certificates extends Array<Certificate> {
  static fromCBOR(value: CBORReaderValue): Certificates {
    let tagged = value.get("tagged");
    let array = tagged.getTagged(258n).get("array");
    return new Certificates(...array.map((x) => Certificate.fromCBOR(x)));
  }

  toCBOR(writer: CBORWriter) {
    return writer.writeTagged(258n, [...this]);
  }
}

export class ParameterChangeAction {
  private gov_action_id: GovActionId | undefined;
  private protocol_param_update: ProtocolParamUpdate;
  private policy_hash: PolicyHash | undefined;

  constructor(
    gov_action_id: GovActionId | undefined,
    protocol_param_update: ProtocolParamUpdate,
    policy_hash: PolicyHash | undefined,
  ) {
    this.gov_action_id = gov_action_id;
    this.protocol_param_update = protocol_param_update;
    this.policy_hash = policy_hash;
  }

  get_gov_action_id(): GovActionId | undefined {
    return this.gov_action_id;
  }

  set_gov_action_id(gov_action_id: GovActionId): void {
    this.gov_action_id = gov_action_id;
  }

  get_protocol_param_update(): ProtocolParamUpdate {
    return this.protocol_param_update;
  }

  set_protocol_param_update(protocol_param_update: ProtocolParamUpdate): void {
    this.protocol_param_update = protocol_param_update;
  }

  get_policy_hash(): PolicyHash | undefined {
    return this.policy_hash;
  }

  set_policy_hash(policy_hash: PolicyHash): void {
    this.policy_hash = policy_hash;
  }

  static fromArray(
    array: CBORArrayReader<CBORReaderValue>,
  ): ParameterChangeAction {
    let gov_action_id_ = array.shiftRequired();
    let gov_action_id__ = gov_action_id_.withNullable((x) =>
      GovActionId.fromCBOR(x),
    );
    let gov_action_id = gov_action_id__ == null ? undefined : gov_action_id__;
    let protocol_param_update_ = array.shiftRequired();
    let protocol_param_update = ProtocolParamUpdate.fromCBOR(
      protocol_param_update_,
    );
    let policy_hash_ = array.shiftRequired();
    let policy_hash__ = policy_hash_.withNullable((x) =>
      PolicyHash.fromCBOR(x),
    );
    let policy_hash = policy_hash__ == null ? undefined : policy_hash__;

    return new ParameterChangeAction(
      gov_action_id,
      protocol_param_update,
      policy_hash,
    );
  }

  toArray() {
    let entries = [];
    entries.push(this.gov_action_id);
    entries.push(this.protocol_param_update);
    entries.push(this.policy_hash);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): ParameterChangeAction {
    let array = value.get("array");
    return ParameterChangeAction.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class HardForkInitiationAction {
  private gov_action_id: GovActionId | undefined;
  private protocol_version: ProtocolVersion;

  constructor(
    gov_action_id: GovActionId | undefined,
    protocol_version: ProtocolVersion,
  ) {
    this.gov_action_id = gov_action_id;
    this.protocol_version = protocol_version;
  }

  get_gov_action_id(): GovActionId | undefined {
    return this.gov_action_id;
  }

  set_gov_action_id(gov_action_id: GovActionId): void {
    this.gov_action_id = gov_action_id;
  }

  get_protocol_version(): ProtocolVersion {
    return this.protocol_version;
  }

  set_protocol_version(protocol_version: ProtocolVersion): void {
    this.protocol_version = protocol_version;
  }

  static fromArray(
    array: CBORArrayReader<CBORReaderValue>,
  ): HardForkInitiationAction {
    let gov_action_id_ = array.shiftRequired();
    let gov_action_id__ = gov_action_id_.withNullable((x) =>
      GovActionId.fromCBOR(x),
    );
    let gov_action_id = gov_action_id__ == null ? undefined : gov_action_id__;
    let protocol_version_ = array.shiftRequired();
    let protocol_version = ProtocolVersion.fromCBOR(protocol_version_);

    return new HardForkInitiationAction(gov_action_id, protocol_version);
  }

  toArray() {
    let entries = [];
    entries.push(this.gov_action_id);
    entries.push(this.protocol_version);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): HardForkInitiationAction {
    let array = value.get("array");
    return HardForkInitiationAction.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class Withdrawals extends CBORMap<RewardAccount, Coin> {
  static fromCBOR(value: CBORReaderValue): Withdrawals {
    let map = value.get("map");
    return new Withdrawals(
      map.map({
        key: (x) => RewardAccount.fromCBOR(x),
        value: (x) => RewardAccount.fromCBOR(x),
      }),
    );
  }
}

export class TreasuryWithdrawalsAction {
  private withdrawals: Withdrawals;
  private policy_hash: PolicyHash | undefined;

  constructor(withdrawals: Withdrawals, policy_hash: PolicyHash | undefined) {
    this.withdrawals = withdrawals;
    this.policy_hash = policy_hash;
  }

  get_withdrawals(): Withdrawals {
    return this.withdrawals;
  }

  set_withdrawals(withdrawals: Withdrawals): void {
    this.withdrawals = withdrawals;
  }

  get_policy_hash(): PolicyHash | undefined {
    return this.policy_hash;
  }

  set_policy_hash(policy_hash: PolicyHash): void {
    this.policy_hash = policy_hash;
  }

  static fromArray(
    array: CBORArrayReader<CBORReaderValue>,
  ): TreasuryWithdrawalsAction {
    let withdrawals_ = array.shiftRequired();
    let withdrawals = Withdrawals.fromCBOR(withdrawals_);
    let policy_hash_ = array.shiftRequired();
    let policy_hash__ = policy_hash_.withNullable((x) =>
      PolicyHash.fromCBOR(x),
    );
    let policy_hash = policy_hash__ == null ? undefined : policy_hash__;

    return new TreasuryWithdrawalsAction(withdrawals, policy_hash);
  }

  toArray() {
    let entries = [];
    entries.push(this.withdrawals);
    entries.push(this.policy_hash);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): TreasuryWithdrawalsAction {
    let array = value.get("array");
    return TreasuryWithdrawalsAction.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class NoConfidence {
  private gov_action_id: GovActionId | undefined;

  constructor(gov_action_id: GovActionId | undefined) {
    this.gov_action_id = gov_action_id;
  }

  get_gov_action_id(): GovActionId | undefined {
    return this.gov_action_id;
  }

  set_gov_action_id(gov_action_id: GovActionId): void {
    this.gov_action_id = gov_action_id;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): NoConfidence {
    let gov_action_id_ = array.shiftRequired();
    let gov_action_id__ = gov_action_id_.withNullable((x) =>
      GovActionId.fromCBOR(x),
    );
    let gov_action_id = gov_action_id__ == null ? undefined : gov_action_id__;

    return new NoConfidence(gov_action_id);
  }

  toArray() {
    let entries = [];
    entries.push(this.gov_action_id);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): NoConfidence {
    let array = value.get("array");
    return NoConfidence.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class CommitteeColdCredentials extends Array<CommitteeColdCredential> {
  static fromCBOR(value: CBORReaderValue): CommitteeColdCredentials {
    let tagged = value.get("tagged");
    let array = tagged.getTagged(258n).get("array");
    return new CommitteeColdCredentials(
      ...array.map((x) => CommitteeColdCredential.fromCBOR(x)),
    );
  }

  toCBOR(writer: CBORWriter) {
    return writer.writeTagged(258n, [...this]);
  }
}

export class Epochs extends CBORMap<CommitteeColdCredential, Epoch> {
  static fromCBOR(value: CBORReaderValue): Epochs {
    let map = value.get("map");
    return new Epochs(
      map.map({
        key: (x) => CommitteeColdCredential.fromCBOR(x),
        value: (x) => CommitteeColdCredential.fromCBOR(x),
      }),
    );
  }
}

export class UpdateCommittee {
  private gov_action_id: GovActionId | undefined;
  private committee_cold_credentials: CommitteeColdCredentials;
  private epochs: Epochs;
  private unit_interval: UnitInterval;

  constructor(
    gov_action_id: GovActionId | undefined,
    committee_cold_credentials: CommitteeColdCredentials,
    epochs: Epochs,
    unit_interval: UnitInterval,
  ) {
    this.gov_action_id = gov_action_id;
    this.committee_cold_credentials = committee_cold_credentials;
    this.epochs = epochs;
    this.unit_interval = unit_interval;
  }

  get_gov_action_id(): GovActionId | undefined {
    return this.gov_action_id;
  }

  set_gov_action_id(gov_action_id: GovActionId): void {
    this.gov_action_id = gov_action_id;
  }

  get_committee_cold_credentials(): CommitteeColdCredentials {
    return this.committee_cold_credentials;
  }

  set_committee_cold_credentials(
    committee_cold_credentials: CommitteeColdCredentials,
  ): void {
    this.committee_cold_credentials = committee_cold_credentials;
  }

  get_epochs(): Epochs {
    return this.epochs;
  }

  set_epochs(epochs: Epochs): void {
    this.epochs = epochs;
  }

  get_unit_interval(): UnitInterval {
    return this.unit_interval;
  }

  set_unit_interval(unit_interval: UnitInterval): void {
    this.unit_interval = unit_interval;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): UpdateCommittee {
    let gov_action_id_ = array.shiftRequired();
    let gov_action_id__ = gov_action_id_.withNullable((x) =>
      GovActionId.fromCBOR(x),
    );
    let gov_action_id = gov_action_id__ == null ? undefined : gov_action_id__;
    let committee_cold_credentials_ = array.shiftRequired();
    let committee_cold_credentials = CommitteeColdCredentials.fromCBOR(
      committee_cold_credentials_,
    );
    let epochs_ = array.shiftRequired();
    let epochs = Epochs.fromCBOR(epochs_);
    let unit_interval_ = array.shiftRequired();
    let unit_interval = UnitInterval.fromCBOR(unit_interval_);

    return new UpdateCommittee(
      gov_action_id,
      committee_cold_credentials,
      epochs,
      unit_interval,
    );
  }

  toArray() {
    let entries = [];
    entries.push(this.gov_action_id);
    entries.push(this.committee_cold_credentials);
    entries.push(this.epochs);
    entries.push(this.unit_interval);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): UpdateCommittee {
    let array = value.get("array");
    return UpdateCommittee.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class NewConstitution {
  private gov_action_id: GovActionId | undefined;
  private constitution: Constitution;

  constructor(
    gov_action_id: GovActionId | undefined,
    constitution: Constitution,
  ) {
    this.gov_action_id = gov_action_id;
    this.constitution = constitution;
  }

  get_gov_action_id(): GovActionId | undefined {
    return this.gov_action_id;
  }

  set_gov_action_id(gov_action_id: GovActionId): void {
    this.gov_action_id = gov_action_id;
  }

  get_constitution(): Constitution {
    return this.constitution;
  }

  set_constitution(constitution: Constitution): void {
    this.constitution = constitution;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): NewConstitution {
    let gov_action_id_ = array.shiftRequired();
    let gov_action_id__ = gov_action_id_.withNullable((x) =>
      GovActionId.fromCBOR(x),
    );
    let gov_action_id = gov_action_id__ == null ? undefined : gov_action_id__;
    let constitution_ = array.shiftRequired();
    let constitution = Constitution.fromCBOR(constitution_);

    return new NewConstitution(gov_action_id, constitution);
  }

  toArray() {
    let entries = [];
    entries.push(this.gov_action_id);
    entries.push(this.constitution);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): NewConstitution {
    let array = value.get("array");
    return NewConstitution.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class InfoAction {
  constructor() {}

  static fromArray(array: CBORArrayReader<CBORReaderValue>): InfoAction {
    return new InfoAction();
  }

  toArray() {
    let entries = [];

    return entries;
  }

  static fromCBOR(value: CBORReaderValue): InfoAction {
    let array = value.get("array");
    return InfoAction.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export enum GovActionKind {
  ParameterChangeAction = 0,
  HardForkInitiationAction = 1,
  TreasuryWithdrawalsAction = 2,
  NoConfidence = 3,
  UpdateCommittee = 4,
  NewConstitution = 5,
  InfoAction = 6,
}

export type GovActionVariant =
  | { kind: 0; value: ParameterChangeAction }
  | { kind: 1; value: HardForkInitiationAction }
  | { kind: 2; value: TreasuryWithdrawalsAction }
  | { kind: 3; value: NoConfidence }
  | { kind: 4; value: UpdateCommittee }
  | { kind: 5; value: NewConstitution }
  | { kind: 6; value: InfoAction };

export class GovAction {
  private variant: GovActionVariant;

  constructor(variant: GovActionVariant) {
    this.variant = variant;
  }

  static new_parameter_change_action(
    parameter_change_action: ParameterChangeAction,
  ): GovAction {
    return new GovAction({ kind: 0, value: parameter_change_action });
  }

  static new_hard_fork_initiation_action(
    hard_fork_initiation_action: HardForkInitiationAction,
  ): GovAction {
    return new GovAction({ kind: 1, value: hard_fork_initiation_action });
  }

  static new_treasury_withdrawals_action(
    treasury_withdrawals_action: TreasuryWithdrawalsAction,
  ): GovAction {
    return new GovAction({ kind: 2, value: treasury_withdrawals_action });
  }

  static new_no_confidence(no_confidence: NoConfidence): GovAction {
    return new GovAction({ kind: 3, value: no_confidence });
  }

  static new_update_committee(update_committee: UpdateCommittee): GovAction {
    return new GovAction({ kind: 4, value: update_committee });
  }

  static new_new_constitution(new_constitution: NewConstitution): GovAction {
    return new GovAction({ kind: 5, value: new_constitution });
  }

  static new_info_action(info_action: InfoAction): GovAction {
    return new GovAction({ kind: 6, value: info_action });
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

  as_no_confidence(): NoConfidence | undefined {
    if (this.variant.kind == 3) return this.variant.value;
  }

  as_update_committee(): UpdateCommittee | undefined {
    if (this.variant.kind == 4) return this.variant.value;
  }

  as_new_constitution(): NewConstitution | undefined {
    if (this.variant.kind == 5) return this.variant.value;
  }

  as_info_action(): InfoAction | undefined {
    if (this.variant.kind == 6) return this.variant.value;
  }

  static fromCBOR(value: CBORReaderValue): GovAction {
    let array = value.get("array");
    let [tag, variant] = array.shiftRequired().with((tag_) => {
      let tag = Number(tag_.get("uint"));

      if (tag == 0) return [tag, ParameterChangeAction.fromArray(array)];

      if (tag == 1) return [tag, HardForkInitiationAction.fromArray(array)];

      if (tag == 2) return [tag, TreasuryWithdrawalsAction.fromArray(array)];

      if (tag == 3) return [tag, NoConfidence.fromArray(array)];

      if (tag == 4) return [tag, UpdateCommittee.fromArray(array)];

      if (tag == 5) return [tag, NewConstitution.fromArray(array)];

      if (tag == 6) return [tag, InfoAction.fromArray(array)];

      throw "Unrecognized tag: " + tag + " for GovAction";
    });

    return new GovAction({ kind: tag, value: variant });
  }

  toCBOR(writer: CBORWriter) {
    let entries = [this.variant.kind, ...this.variant.value.toArray()];
    writer.writeArray(entries);
  }
}

export class Constitution {
  private anchor: Anchor;
  private scripthash: Scripthash | undefined;

  constructor(anchor: Anchor, scripthash: Scripthash | undefined) {
    this.anchor = anchor;
    this.scripthash = scripthash;
  }

  get_anchor(): Anchor {
    return this.anchor;
  }

  set_anchor(anchor: Anchor): void {
    this.anchor = anchor;
  }

  get_scripthash(): Scripthash | undefined {
    return this.scripthash;
  }

  set_scripthash(scripthash: Scripthash): void {
    this.scripthash = scripthash;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): Constitution {
    let anchor_ = array.shiftRequired();
    let anchor = Anchor.fromCBOR(anchor_);
    let scripthash_ = array.shiftRequired();
    let scripthash__ = scripthash_.withNullable((x) => Scripthash.fromCBOR(x));
    let scripthash = scripthash__ == null ? undefined : scripthash__;

    return new Constitution(anchor, scripthash);
  }

  toArray() {
    let entries = [];
    entries.push(this.anchor);
    entries.push(this.scripthash);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): Constitution {
    let array = value.get("array");
    return Constitution.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class ConstitutionalCommitteeHotKeyhash {
  private addr_keyhash: AddrKeyhash;

  constructor(addr_keyhash: AddrKeyhash) {
    this.addr_keyhash = addr_keyhash;
  }

  get_addr_keyhash(): AddrKeyhash {
    return this.addr_keyhash;
  }

  set_addr_keyhash(addr_keyhash: AddrKeyhash): void {
    this.addr_keyhash = addr_keyhash;
  }

  static fromArray(
    array: CBORArrayReader<CBORReaderValue>,
  ): ConstitutionalCommitteeHotKeyhash {
    let addr_keyhash_ = array.shiftRequired();
    let addr_keyhash = AddrKeyhash.fromCBOR(addr_keyhash_);

    return new ConstitutionalCommitteeHotKeyhash(addr_keyhash);
  }

  toArray() {
    let entries = [];
    entries.push(this.addr_keyhash);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): ConstitutionalCommitteeHotKeyhash {
    let array = value.get("array");
    return ConstitutionalCommitteeHotKeyhash.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class ConstitutionalCommitteeHotScripthash {
  private scripthash: Scripthash;

  constructor(scripthash: Scripthash) {
    this.scripthash = scripthash;
  }

  get_scripthash(): Scripthash {
    return this.scripthash;
  }

  set_scripthash(scripthash: Scripthash): void {
    this.scripthash = scripthash;
  }

  static fromArray(
    array: CBORArrayReader<CBORReaderValue>,
  ): ConstitutionalCommitteeHotScripthash {
    let scripthash_ = array.shiftRequired();
    let scripthash = Scripthash.fromCBOR(scripthash_);

    return new ConstitutionalCommitteeHotScripthash(scripthash);
  }

  toArray() {
    let entries = [];
    entries.push(this.scripthash);
    return entries;
  }

  static fromCBOR(
    value: CBORReaderValue,
  ): ConstitutionalCommitteeHotScripthash {
    let array = value.get("array");
    return ConstitutionalCommitteeHotScripthash.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class DrepKeyhash {
  private addr_keyhash: AddrKeyhash;

  constructor(addr_keyhash: AddrKeyhash) {
    this.addr_keyhash = addr_keyhash;
  }

  get_addr_keyhash(): AddrKeyhash {
    return this.addr_keyhash;
  }

  set_addr_keyhash(addr_keyhash: AddrKeyhash): void {
    this.addr_keyhash = addr_keyhash;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): DrepKeyhash {
    let addr_keyhash_ = array.shiftRequired();
    let addr_keyhash = AddrKeyhash.fromCBOR(addr_keyhash_);

    return new DrepKeyhash(addr_keyhash);
  }

  toArray() {
    let entries = [];
    entries.push(this.addr_keyhash);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): DrepKeyhash {
    let array = value.get("array");
    return DrepKeyhash.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class DrepScripthash {
  private scripthash: Scripthash;

  constructor(scripthash: Scripthash) {
    this.scripthash = scripthash;
  }

  get_scripthash(): Scripthash {
    return this.scripthash;
  }

  set_scripthash(scripthash: Scripthash): void {
    this.scripthash = scripthash;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): DrepScripthash {
    let scripthash_ = array.shiftRequired();
    let scripthash = Scripthash.fromCBOR(scripthash_);

    return new DrepScripthash(scripthash);
  }

  toArray() {
    let entries = [];
    entries.push(this.scripthash);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): DrepScripthash {
    let array = value.get("array");
    return DrepScripthash.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class StakingPoolKeyhash {
  private addr_keyhash: AddrKeyhash;

  constructor(addr_keyhash: AddrKeyhash) {
    this.addr_keyhash = addr_keyhash;
  }

  get_addr_keyhash(): AddrKeyhash {
    return this.addr_keyhash;
  }

  set_addr_keyhash(addr_keyhash: AddrKeyhash): void {
    this.addr_keyhash = addr_keyhash;
  }

  static fromArray(
    array: CBORArrayReader<CBORReaderValue>,
  ): StakingPoolKeyhash {
    let addr_keyhash_ = array.shiftRequired();
    let addr_keyhash = AddrKeyhash.fromCBOR(addr_keyhash_);

    return new StakingPoolKeyhash(addr_keyhash);
  }

  toArray() {
    let entries = [];
    entries.push(this.addr_keyhash);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): StakingPoolKeyhash {
    let array = value.get("array");
    return StakingPoolKeyhash.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export enum VoterKind {
  ConstitutionalCommitteeHotKeyhash = 0,
  ConstitutionalCommitteeHotScripthash = 1,
  DrepKeyhash = 2,
  DrepScripthash = 3,
  StakingPoolKeyhash = 4,
}

export type VoterVariant =
  | { kind: 0; value: ConstitutionalCommitteeHotKeyhash }
  | { kind: 1; value: ConstitutionalCommitteeHotScripthash }
  | { kind: 2; value: DrepKeyhash }
  | { kind: 3; value: DrepScripthash }
  | { kind: 4; value: StakingPoolKeyhash };

export class Voter {
  private variant: VoterVariant;

  constructor(variant: VoterVariant) {
    this.variant = variant;
  }

  static new_constitutional_committee_hot_keyhash(
    constitutional_committee_hot_keyhash: ConstitutionalCommitteeHotKeyhash,
  ): Voter {
    return new Voter({ kind: 0, value: constitutional_committee_hot_keyhash });
  }

  static new_constitutional_committee_hot_scripthash(
    constitutional_committee_hot_scripthash: ConstitutionalCommitteeHotScripthash,
  ): Voter {
    return new Voter({
      kind: 1,
      value: constitutional_committee_hot_scripthash,
    });
  }

  static new_drep_keyhash(drep_keyhash: DrepKeyhash): Voter {
    return new Voter({ kind: 2, value: drep_keyhash });
  }

  static new_drep_scripthash(drep_scripthash: DrepScripthash): Voter {
    return new Voter({ kind: 3, value: drep_scripthash });
  }

  static new_staking_pool_keyhash(
    staking_pool_keyhash: StakingPoolKeyhash,
  ): Voter {
    return new Voter({ kind: 4, value: staking_pool_keyhash });
  }

  as_constitutional_committee_hot_keyhash():
    | ConstitutionalCommitteeHotKeyhash
    | undefined {
    if (this.variant.kind == 0) return this.variant.value;
  }

  as_constitutional_committee_hot_scripthash():
    | ConstitutionalCommitteeHotScripthash
    | undefined {
    if (this.variant.kind == 1) return this.variant.value;
  }

  as_drep_keyhash(): DrepKeyhash | undefined {
    if (this.variant.kind == 2) return this.variant.value;
  }

  as_drep_scripthash(): DrepScripthash | undefined {
    if (this.variant.kind == 3) return this.variant.value;
  }

  as_staking_pool_keyhash(): StakingPoolKeyhash | undefined {
    if (this.variant.kind == 4) return this.variant.value;
  }

  static fromCBOR(value: CBORReaderValue): Voter {
    let array = value.get("array");
    let [tag, variant] = array.shiftRequired().with((tag_) => {
      let tag = Number(tag_.get("uint"));

      if (tag == 0)
        return [tag, ConstitutionalCommitteeHotKeyhash.fromArray(array)];

      if (tag == 1)
        return [tag, ConstitutionalCommitteeHotScripthash.fromArray(array)];

      if (tag == 2) return [tag, DrepKeyhash.fromArray(array)];

      if (tag == 3) return [tag, DrepScripthash.fromArray(array)];

      if (tag == 4) return [tag, StakingPoolKeyhash.fromArray(array)];

      throw "Unrecognized tag: " + tag + " for Voter";
    });

    return new Voter({ kind: tag, value: variant });
  }

  toCBOR(writer: CBORWriter) {
    let entries = [this.variant.kind, ...this.variant.value.toArray()];
    writer.writeArray(entries);
  }
}

export class Anchor {
  private anchor_url: Url;
  private anchor_data_hash: Hash32;

  constructor(anchor_url: Url, anchor_data_hash: Hash32) {
    this.anchor_url = anchor_url;
    this.anchor_data_hash = anchor_data_hash;
  }

  get_anchor_url(): Url {
    return this.anchor_url;
  }

  set_anchor_url(anchor_url: Url): void {
    this.anchor_url = anchor_url;
  }

  get_anchor_data_hash(): Hash32 {
    return this.anchor_data_hash;
  }

  set_anchor_data_hash(anchor_data_hash: Hash32): void {
    this.anchor_data_hash = anchor_data_hash;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): Anchor {
    let anchor_url_ = array.shiftRequired();
    let anchor_url = Url.fromCBOR(anchor_url_);
    let anchor_data_hash_ = array.shiftRequired();
    let anchor_data_hash = Hash32.fromCBOR(anchor_data_hash_);

    return new Anchor(anchor_url, anchor_data_hash);
  }

  toArray() {
    let entries = [];
    entries.push(this.anchor_url);
    entries.push(this.anchor_data_hash);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): Anchor {
    let array = value.get("array");
    return Anchor.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export enum VoteKind {
  No = 0,
  Yes = 1,
  Abstain = 2,
}

export class Vote {
  private kind_: VoteKind;

  constructor(kind: VoteKind) {
    this.kind_ = kind;
  }

  static new_no(): Vote {
    return new Vote(0);
  }

  static new_yes(): Vote {
    return new Vote(1);
  }

  static new_abstain(): Vote {
    return new Vote(2);
  }

  static fromCBOR(value: CBORReaderValue): Vote {
    return value.with((value) => {
      let kind = Number(value.getInt());

      if (kind == 0) return new Vote(0);

      if (kind == 1) return new Vote(1);

      if (kind == 2) return new Vote(2);

      throw "Unrecognized enum value: " + kind + " for " + Vote;
    });
  }

  toCBOR(writer: CBORWriter) {
    writer.write(this.kind_);
  }
}

export class GovActionId {
  private transaction_id: Hash32;
  private gov_action_index: number;

  constructor(transaction_id: Hash32, gov_action_index: number) {
    this.transaction_id = transaction_id;
    this.gov_action_index = gov_action_index;
  }

  get_transaction_id(): Hash32 {
    return this.transaction_id;
  }

  set_transaction_id(transaction_id: Hash32): void {
    this.transaction_id = transaction_id;
  }

  get_gov_action_index(): number {
    return this.gov_action_index;
  }

  set_gov_action_index(gov_action_index: number): void {
    this.gov_action_index = gov_action_index;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): GovActionId {
    let transaction_id_ = array.shiftRequired();
    let transaction_id = Hash32.fromCBOR(transaction_id_);
    let gov_action_index_ = array.shiftRequired();
    let gov_action_index = gov_action_index_.get("uint");

    return new GovActionId(transaction_id, gov_action_index);
  }

  toArray() {
    let entries = [];
    entries.push(this.transaction_id);
    entries.push(this.gov_action_index);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): GovActionId {
    let array = value.get("array");
    return GovActionId.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class TransactionInput {
  private transaction_id: Hash32;
  private index: number;

  constructor(transaction_id: Hash32, index: number) {
    this.transaction_id = transaction_id;
    this.index = index;
  }

  get_transaction_id(): Hash32 {
    return this.transaction_id;
  }

  set_transaction_id(transaction_id: Hash32): void {
    this.transaction_id = transaction_id;
  }

  get_index(): number {
    return this.index;
  }

  set_index(index: number): void {
    this.index = index;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): TransactionInput {
    let transaction_id_ = array.shiftRequired();
    let transaction_id = Hash32.fromCBOR(transaction_id_);
    let index_ = array.shiftRequired();
    let index = index_.get("uint");

    return new TransactionInput(transaction_id, index);
  }

  toArray() {
    let entries = [];
    entries.push(this.transaction_id);
    entries.push(this.index);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): TransactionInput {
    let array = value.get("array");
    return TransactionInput.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class PreBabbageTransactionOutput {
  private address: Address;
  private amount: Value;
  private datum_hash: Hash32 | undefined;

  constructor(address: Address, amount: Value, datum_hash: Hash32 | undefined) {
    this.address = address;
    this.amount = amount;
    this.datum_hash = datum_hash;
  }

  get_address(): Address {
    return this.address;
  }

  set_address(address: Address): void {
    this.address = address;
  }

  get_amount(): Value {
    return this.amount;
  }

  set_amount(amount: Value): void {
    this.amount = amount;
  }

  get_datum_hash(): Hash32 | undefined {
    return this.datum_hash;
  }

  set_datum_hash(datum_hash: Hash32): void {
    this.datum_hash = datum_hash;
  }

  static fromArray(
    array: CBORArrayReader<CBORReaderValue>,
  ): PreBabbageTransactionOutput {
    let address_ = array.shiftRequired();
    let address = Address.fromCBOR(address_);
    let amount_ = array.shiftRequired();
    let amount = Value.fromCBOR(amount_);
    let datum_hash_ = array.shift();
    let datum_hash = Hash32.fromCBOR(datum_hash_);

    return new PreBabbageTransactionOutput(address, amount, datum_hash);
  }

  toArray() {
    let entries = [];
    entries.push(this.address);
    entries.push(this.amount);
    if (this.datum_hash !== undefined) entries.push(this.datum_hash);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): PreBabbageTransactionOutput {
    let array = value.get("array");
    return PreBabbageTransactionOutput.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class PostAlonzoTransactionOutput {
  private address: Address;
  private value: Value;
  private datum_option: DatumOption | undefined;
  private script_ref: ScriptRef | undefined;

  constructor(
    address: Address,
    value: Value,
    datum_option: DatumOption | undefined,
    script_ref: ScriptRef | undefined,
  ) {
    this.address = address;
    this.value = value;
    this.datum_option = datum_option;
    this.script_ref = script_ref;
  }

  get_address(): Address {
    return this.address;
  }

  set_address(address: Address): void {
    this.address = address;
  }

  get_value(): Value {
    return this.value;
  }

  set_value(value: Value): void {
    this.value = value;
  }

  get_datum_option(): DatumOption | undefined {
    return this.datum_option;
  }

  set_datum_option(datum_option: DatumOption): void {
    this.datum_option = datum_option;
  }

  get_script_ref(): ScriptRef | undefined {
    return this.script_ref;
  }

  set_script_ref(script_ref: ScriptRef): void {
    this.script_ref = script_ref;
  }

  static fromCBOR(value: CBORReaderValue): PostAlonzoTransactionOutput {
    let map = value
      .get("map")
      .toMap()
      .map({ key: (x) => Number(x.getInt()), value: (x) => x });
    let address_ = map.getRequired(0);
    let address =
      address_ != undefined ? Address.fromCBOR(address_) : undefined;
    let value_ = map.getRequired(1);
    let value = value_ != undefined ? Value.fromCBOR(value_) : undefined;
    let datum_option_ = map.get(2);
    let datum_option =
      datum_option_ != undefined
        ? DatumOption.fromCBOR(datum_option_)
        : undefined;
    let script_ref_ = map.get(3);
    let script_ref =
      script_ref_ != undefined ? ScriptRef.fromCBOR(script_ref_) : undefined;

    return new PostAlonzoTransactionOutput(
      address,
      value,
      datum_option,
      script_ref,
    );
  }

  toCBOR(writer: CBORWriter) {
    let entries = [];
    entries.push([0, this.address]);
    entries.push([1, this.value]);
    if (this.datum_option !== undefined) entries.push([2, this.datum_option]);
    if (this.script_ref !== undefined) entries.push([3, this.script_ref]);
    writer.writeMap(entries);
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

  as_pre_babbage_transaction_output(): PreBabbageTransactionOutput | undefined {
    if (this.variant.kind == 0) return this.variant.value;
  }

  as_post_alonzo_transaction_output(): PostAlonzoTransactionOutput | undefined {
    if (this.variant.kind == 1) return this.variant.value;
  }

  static fromCBOR(value: CBORReaderValue): TransactionOutput {
    return value.getChoice({
      "": (v) =>
        new TransactionOutput({
          kind: 0,
          value: PreBabbageTransactionOutput.fromCBOR(v),
        }),
      "": (v) =>
        new TransactionOutput({
          kind: 1,
          value: PostAlonzoTransactionOutput.fromCBOR(v),
        }),
    });
  }

  toCBOR(writer: CBORWriter) {
    this.variant.value.toCBOR(writer);
  }
}

export class StakeRegistration {
  private stake_credential: StakeCredential;

  constructor(stake_credential: StakeCredential) {
    this.stake_credential = stake_credential;
  }

  get_stake_credential(): StakeCredential {
    return this.stake_credential;
  }

  set_stake_credential(stake_credential: StakeCredential): void {
    this.stake_credential = stake_credential;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): StakeRegistration {
    let stake_credential_ = array.shiftRequired();
    let stake_credential = StakeCredential.fromCBOR(stake_credential_);

    return new StakeRegistration(stake_credential);
  }

  toArray() {
    let entries = [];
    entries.push(this.stake_credential);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): StakeRegistration {
    let array = value.get("array");
    return StakeRegistration.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class StakeDeregistration {
  private stake_credential: StakeCredential;

  constructor(stake_credential: StakeCredential) {
    this.stake_credential = stake_credential;
  }

  get_stake_credential(): StakeCredential {
    return this.stake_credential;
  }

  set_stake_credential(stake_credential: StakeCredential): void {
    this.stake_credential = stake_credential;
  }

  static fromArray(
    array: CBORArrayReader<CBORReaderValue>,
  ): StakeDeregistration {
    let stake_credential_ = array.shiftRequired();
    let stake_credential = StakeCredential.fromCBOR(stake_credential_);

    return new StakeDeregistration(stake_credential);
  }

  toArray() {
    let entries = [];
    entries.push(this.stake_credential);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): StakeDeregistration {
    let array = value.get("array");
    return StakeDeregistration.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class StakeDelegation {
  private stake_credential: StakeCredential;
  private pool_keyhash: PoolKeyhash;

  constructor(stake_credential: StakeCredential, pool_keyhash: PoolKeyhash) {
    this.stake_credential = stake_credential;
    this.pool_keyhash = pool_keyhash;
  }

  get_stake_credential(): StakeCredential {
    return this.stake_credential;
  }

  set_stake_credential(stake_credential: StakeCredential): void {
    this.stake_credential = stake_credential;
  }

  get_pool_keyhash(): PoolKeyhash {
    return this.pool_keyhash;
  }

  set_pool_keyhash(pool_keyhash: PoolKeyhash): void {
    this.pool_keyhash = pool_keyhash;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): StakeDelegation {
    let stake_credential_ = array.shiftRequired();
    let stake_credential = StakeCredential.fromCBOR(stake_credential_);
    let pool_keyhash_ = array.shiftRequired();
    let pool_keyhash = PoolKeyhash.fromCBOR(pool_keyhash_);

    return new StakeDelegation(stake_credential, pool_keyhash);
  }

  toArray() {
    let entries = [];
    entries.push(this.stake_credential);
    entries.push(this.pool_keyhash);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): StakeDelegation {
    let array = value.get("array");
    return StakeDelegation.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class PoolRegistration {
  private pool_params: PoolParams;

  constructor(pool_params: PoolParams) {
    this.pool_params = pool_params;
  }

  get_pool_params(): PoolParams {
    return this.pool_params;
  }

  set_pool_params(pool_params: PoolParams): void {
    this.pool_params = pool_params;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): PoolRegistration {
    let pool_params_ = array.shiftRequired();
    let pool_params = PoolParams.fromCBOR(pool_params_);

    return new PoolRegistration(pool_params);
  }

  toArray() {
    let entries = [];
    entries.push(this.pool_params);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): PoolRegistration {
    let array = value.get("array");
    return PoolRegistration.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class PoolRetirement {
  private pool_keyhash: PoolKeyhash;
  private epoch: Epoch;

  constructor(pool_keyhash: PoolKeyhash, epoch: Epoch) {
    this.pool_keyhash = pool_keyhash;
    this.epoch = epoch;
  }

  get_pool_keyhash(): PoolKeyhash {
    return this.pool_keyhash;
  }

  set_pool_keyhash(pool_keyhash: PoolKeyhash): void {
    this.pool_keyhash = pool_keyhash;
  }

  get_epoch(): Epoch {
    return this.epoch;
  }

  set_epoch(epoch: Epoch): void {
    this.epoch = epoch;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): PoolRetirement {
    let pool_keyhash_ = array.shiftRequired();
    let pool_keyhash = PoolKeyhash.fromCBOR(pool_keyhash_);
    let epoch_ = array.shiftRequired();
    let epoch = Epoch.fromCBOR(epoch_);

    return new PoolRetirement(pool_keyhash, epoch);
  }

  toArray() {
    let entries = [];
    entries.push(this.pool_keyhash);
    entries.push(this.epoch);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): PoolRetirement {
    let array = value.get("array");
    return PoolRetirement.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class RegCert {
  private stake_credential: StakeCredential;
  private coin: Coin;

  constructor(stake_credential: StakeCredential, coin: Coin) {
    this.stake_credential = stake_credential;
    this.coin = coin;
  }

  get_stake_credential(): StakeCredential {
    return this.stake_credential;
  }

  set_stake_credential(stake_credential: StakeCredential): void {
    this.stake_credential = stake_credential;
  }

  get_coin(): Coin {
    return this.coin;
  }

  set_coin(coin: Coin): void {
    this.coin = coin;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): RegCert {
    let stake_credential_ = array.shiftRequired();
    let stake_credential = StakeCredential.fromCBOR(stake_credential_);
    let coin_ = array.shiftRequired();
    let coin = Coin.fromCBOR(coin_);

    return new RegCert(stake_credential, coin);
  }

  toArray() {
    let entries = [];
    entries.push(this.stake_credential);
    entries.push(this.coin);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): RegCert {
    let array = value.get("array");
    return RegCert.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class UnregCert {
  private stake_credential: StakeCredential;
  private coin: Coin;

  constructor(stake_credential: StakeCredential, coin: Coin) {
    this.stake_credential = stake_credential;
    this.coin = coin;
  }

  get_stake_credential(): StakeCredential {
    return this.stake_credential;
  }

  set_stake_credential(stake_credential: StakeCredential): void {
    this.stake_credential = stake_credential;
  }

  get_coin(): Coin {
    return this.coin;
  }

  set_coin(coin: Coin): void {
    this.coin = coin;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): UnregCert {
    let stake_credential_ = array.shiftRequired();
    let stake_credential = StakeCredential.fromCBOR(stake_credential_);
    let coin_ = array.shiftRequired();
    let coin = Coin.fromCBOR(coin_);

    return new UnregCert(stake_credential, coin);
  }

  toArray() {
    let entries = [];
    entries.push(this.stake_credential);
    entries.push(this.coin);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): UnregCert {
    let array = value.get("array");
    return UnregCert.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class VoteDelegCert {
  private stake_credential: StakeCredential;
  private drep: Drep;

  constructor(stake_credential: StakeCredential, drep: Drep) {
    this.stake_credential = stake_credential;
    this.drep = drep;
  }

  get_stake_credential(): StakeCredential {
    return this.stake_credential;
  }

  set_stake_credential(stake_credential: StakeCredential): void {
    this.stake_credential = stake_credential;
  }

  get_drep(): Drep {
    return this.drep;
  }

  set_drep(drep: Drep): void {
    this.drep = drep;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): VoteDelegCert {
    let stake_credential_ = array.shiftRequired();
    let stake_credential = StakeCredential.fromCBOR(stake_credential_);
    let drep_ = array.shiftRequired();
    let drep = Drep.fromCBOR(drep_);

    return new VoteDelegCert(stake_credential, drep);
  }

  toArray() {
    let entries = [];
    entries.push(this.stake_credential);
    entries.push(this.drep);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): VoteDelegCert {
    let array = value.get("array");
    return VoteDelegCert.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class StakeVoteDelegCert {
  private stake_credential: StakeCredential;
  private pool_keyhash: PoolKeyhash;
  private drep: Drep;

  constructor(
    stake_credential: StakeCredential,
    pool_keyhash: PoolKeyhash,
    drep: Drep,
  ) {
    this.stake_credential = stake_credential;
    this.pool_keyhash = pool_keyhash;
    this.drep = drep;
  }

  get_stake_credential(): StakeCredential {
    return this.stake_credential;
  }

  set_stake_credential(stake_credential: StakeCredential): void {
    this.stake_credential = stake_credential;
  }

  get_pool_keyhash(): PoolKeyhash {
    return this.pool_keyhash;
  }

  set_pool_keyhash(pool_keyhash: PoolKeyhash): void {
    this.pool_keyhash = pool_keyhash;
  }

  get_drep(): Drep {
    return this.drep;
  }

  set_drep(drep: Drep): void {
    this.drep = drep;
  }

  static fromArray(
    array: CBORArrayReader<CBORReaderValue>,
  ): StakeVoteDelegCert {
    let stake_credential_ = array.shiftRequired();
    let stake_credential = StakeCredential.fromCBOR(stake_credential_);
    let pool_keyhash_ = array.shiftRequired();
    let pool_keyhash = PoolKeyhash.fromCBOR(pool_keyhash_);
    let drep_ = array.shiftRequired();
    let drep = Drep.fromCBOR(drep_);

    return new StakeVoteDelegCert(stake_credential, pool_keyhash, drep);
  }

  toArray() {
    let entries = [];
    entries.push(this.stake_credential);
    entries.push(this.pool_keyhash);
    entries.push(this.drep);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): StakeVoteDelegCert {
    let array = value.get("array");
    return StakeVoteDelegCert.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class StakeRegDelegCert {
  private stake_credential: StakeCredential;
  private pool_keyhash: PoolKeyhash;
  private coin: Coin;

  constructor(
    stake_credential: StakeCredential,
    pool_keyhash: PoolKeyhash,
    coin: Coin,
  ) {
    this.stake_credential = stake_credential;
    this.pool_keyhash = pool_keyhash;
    this.coin = coin;
  }

  get_stake_credential(): StakeCredential {
    return this.stake_credential;
  }

  set_stake_credential(stake_credential: StakeCredential): void {
    this.stake_credential = stake_credential;
  }

  get_pool_keyhash(): PoolKeyhash {
    return this.pool_keyhash;
  }

  set_pool_keyhash(pool_keyhash: PoolKeyhash): void {
    this.pool_keyhash = pool_keyhash;
  }

  get_coin(): Coin {
    return this.coin;
  }

  set_coin(coin: Coin): void {
    this.coin = coin;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): StakeRegDelegCert {
    let stake_credential_ = array.shiftRequired();
    let stake_credential = StakeCredential.fromCBOR(stake_credential_);
    let pool_keyhash_ = array.shiftRequired();
    let pool_keyhash = PoolKeyhash.fromCBOR(pool_keyhash_);
    let coin_ = array.shiftRequired();
    let coin = Coin.fromCBOR(coin_);

    return new StakeRegDelegCert(stake_credential, pool_keyhash, coin);
  }

  toArray() {
    let entries = [];
    entries.push(this.stake_credential);
    entries.push(this.pool_keyhash);
    entries.push(this.coin);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): StakeRegDelegCert {
    let array = value.get("array");
    return StakeRegDelegCert.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class VoteRegDelegCert {
  private stake_credential: StakeCredential;
  private drep: Drep;
  private coin: Coin;

  constructor(stake_credential: StakeCredential, drep: Drep, coin: Coin) {
    this.stake_credential = stake_credential;
    this.drep = drep;
    this.coin = coin;
  }

  get_stake_credential(): StakeCredential {
    return this.stake_credential;
  }

  set_stake_credential(stake_credential: StakeCredential): void {
    this.stake_credential = stake_credential;
  }

  get_drep(): Drep {
    return this.drep;
  }

  set_drep(drep: Drep): void {
    this.drep = drep;
  }

  get_coin(): Coin {
    return this.coin;
  }

  set_coin(coin: Coin): void {
    this.coin = coin;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): VoteRegDelegCert {
    let stake_credential_ = array.shiftRequired();
    let stake_credential = StakeCredential.fromCBOR(stake_credential_);
    let drep_ = array.shiftRequired();
    let drep = Drep.fromCBOR(drep_);
    let coin_ = array.shiftRequired();
    let coin = Coin.fromCBOR(coin_);

    return new VoteRegDelegCert(stake_credential, drep, coin);
  }

  toArray() {
    let entries = [];
    entries.push(this.stake_credential);
    entries.push(this.drep);
    entries.push(this.coin);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): VoteRegDelegCert {
    let array = value.get("array");
    return VoteRegDelegCert.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class StakeVoteRegDelegCert {
  private stake_credential: StakeCredential;
  private pool_keyhash: PoolKeyhash;
  private drep: Drep;
  private coin: Coin;

  constructor(
    stake_credential: StakeCredential,
    pool_keyhash: PoolKeyhash,
    drep: Drep,
    coin: Coin,
  ) {
    this.stake_credential = stake_credential;
    this.pool_keyhash = pool_keyhash;
    this.drep = drep;
    this.coin = coin;
  }

  get_stake_credential(): StakeCredential {
    return this.stake_credential;
  }

  set_stake_credential(stake_credential: StakeCredential): void {
    this.stake_credential = stake_credential;
  }

  get_pool_keyhash(): PoolKeyhash {
    return this.pool_keyhash;
  }

  set_pool_keyhash(pool_keyhash: PoolKeyhash): void {
    this.pool_keyhash = pool_keyhash;
  }

  get_drep(): Drep {
    return this.drep;
  }

  set_drep(drep: Drep): void {
    this.drep = drep;
  }

  get_coin(): Coin {
    return this.coin;
  }

  set_coin(coin: Coin): void {
    this.coin = coin;
  }

  static fromArray(
    array: CBORArrayReader<CBORReaderValue>,
  ): StakeVoteRegDelegCert {
    let stake_credential_ = array.shiftRequired();
    let stake_credential = StakeCredential.fromCBOR(stake_credential_);
    let pool_keyhash_ = array.shiftRequired();
    let pool_keyhash = PoolKeyhash.fromCBOR(pool_keyhash_);
    let drep_ = array.shiftRequired();
    let drep = Drep.fromCBOR(drep_);
    let coin_ = array.shiftRequired();
    let coin = Coin.fromCBOR(coin_);

    return new StakeVoteRegDelegCert(
      stake_credential,
      pool_keyhash,
      drep,
      coin,
    );
  }

  toArray() {
    let entries = [];
    entries.push(this.stake_credential);
    entries.push(this.pool_keyhash);
    entries.push(this.drep);
    entries.push(this.coin);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): StakeVoteRegDelegCert {
    let array = value.get("array");
    return StakeVoteRegDelegCert.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class AuthCommitteeHotCert {
  private committee_cold_credential: CommitteeColdCredential;
  private committee_hot_credential: CommitteeHotCredential;

  constructor(
    committee_cold_credential: CommitteeColdCredential,
    committee_hot_credential: CommitteeHotCredential,
  ) {
    this.committee_cold_credential = committee_cold_credential;
    this.committee_hot_credential = committee_hot_credential;
  }

  get_committee_cold_credential(): CommitteeColdCredential {
    return this.committee_cold_credential;
  }

  set_committee_cold_credential(
    committee_cold_credential: CommitteeColdCredential,
  ): void {
    this.committee_cold_credential = committee_cold_credential;
  }

  get_committee_hot_credential(): CommitteeHotCredential {
    return this.committee_hot_credential;
  }

  set_committee_hot_credential(
    committee_hot_credential: CommitteeHotCredential,
  ): void {
    this.committee_hot_credential = committee_hot_credential;
  }

  static fromArray(
    array: CBORArrayReader<CBORReaderValue>,
  ): AuthCommitteeHotCert {
    let committee_cold_credential_ = array.shiftRequired();
    let committee_cold_credential = CommitteeColdCredential.fromCBOR(
      committee_cold_credential_,
    );
    let committee_hot_credential_ = array.shiftRequired();
    let committee_hot_credential = CommitteeHotCredential.fromCBOR(
      committee_hot_credential_,
    );

    return new AuthCommitteeHotCert(
      committee_cold_credential,
      committee_hot_credential,
    );
  }

  toArray() {
    let entries = [];
    entries.push(this.committee_cold_credential);
    entries.push(this.committee_hot_credential);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): AuthCommitteeHotCert {
    let array = value.get("array");
    return AuthCommitteeHotCert.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class ResignCommitteeColdCert {
  private committee_cold_credential: CommitteeColdCredential;
  private anchor: Anchor | undefined;

  constructor(
    committee_cold_credential: CommitteeColdCredential,
    anchor: Anchor | undefined,
  ) {
    this.committee_cold_credential = committee_cold_credential;
    this.anchor = anchor;
  }

  get_committee_cold_credential(): CommitteeColdCredential {
    return this.committee_cold_credential;
  }

  set_committee_cold_credential(
    committee_cold_credential: CommitteeColdCredential,
  ): void {
    this.committee_cold_credential = committee_cold_credential;
  }

  get_anchor(): Anchor | undefined {
    return this.anchor;
  }

  set_anchor(anchor: Anchor): void {
    this.anchor = anchor;
  }

  static fromArray(
    array: CBORArrayReader<CBORReaderValue>,
  ): ResignCommitteeColdCert {
    let committee_cold_credential_ = array.shiftRequired();
    let committee_cold_credential = CommitteeColdCredential.fromCBOR(
      committee_cold_credential_,
    );
    let anchor_ = array.shiftRequired();
    let anchor__ = anchor_.withNullable((x) => Anchor.fromCBOR(x));
    let anchor = anchor__ == null ? undefined : anchor__;

    return new ResignCommitteeColdCert(committee_cold_credential, anchor);
  }

  toArray() {
    let entries = [];
    entries.push(this.committee_cold_credential);
    entries.push(this.anchor);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): ResignCommitteeColdCert {
    let array = value.get("array");
    return ResignCommitteeColdCert.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class RegDrepCert {
  private drep_credential: DrepCredential;
  private coin: Coin;
  private anchor: Anchor | undefined;

  constructor(
    drep_credential: DrepCredential,
    coin: Coin,
    anchor: Anchor | undefined,
  ) {
    this.drep_credential = drep_credential;
    this.coin = coin;
    this.anchor = anchor;
  }

  get_drep_credential(): DrepCredential {
    return this.drep_credential;
  }

  set_drep_credential(drep_credential: DrepCredential): void {
    this.drep_credential = drep_credential;
  }

  get_coin(): Coin {
    return this.coin;
  }

  set_coin(coin: Coin): void {
    this.coin = coin;
  }

  get_anchor(): Anchor | undefined {
    return this.anchor;
  }

  set_anchor(anchor: Anchor): void {
    this.anchor = anchor;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): RegDrepCert {
    let drep_credential_ = array.shiftRequired();
    let drep_credential = DrepCredential.fromCBOR(drep_credential_);
    let coin_ = array.shiftRequired();
    let coin = Coin.fromCBOR(coin_);
    let anchor_ = array.shiftRequired();
    let anchor__ = anchor_.withNullable((x) => Anchor.fromCBOR(x));
    let anchor = anchor__ == null ? undefined : anchor__;

    return new RegDrepCert(drep_credential, coin, anchor);
  }

  toArray() {
    let entries = [];
    entries.push(this.drep_credential);
    entries.push(this.coin);
    entries.push(this.anchor);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): RegDrepCert {
    let array = value.get("array");
    return RegDrepCert.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class UnregDrepCert {
  private drep_credential: DrepCredential;
  private coin: Coin;

  constructor(drep_credential: DrepCredential, coin: Coin) {
    this.drep_credential = drep_credential;
    this.coin = coin;
  }

  get_drep_credential(): DrepCredential {
    return this.drep_credential;
  }

  set_drep_credential(drep_credential: DrepCredential): void {
    this.drep_credential = drep_credential;
  }

  get_coin(): Coin {
    return this.coin;
  }

  set_coin(coin: Coin): void {
    this.coin = coin;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): UnregDrepCert {
    let drep_credential_ = array.shiftRequired();
    let drep_credential = DrepCredential.fromCBOR(drep_credential_);
    let coin_ = array.shiftRequired();
    let coin = Coin.fromCBOR(coin_);

    return new UnregDrepCert(drep_credential, coin);
  }

  toArray() {
    let entries = [];
    entries.push(this.drep_credential);
    entries.push(this.coin);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): UnregDrepCert {
    let array = value.get("array");
    return UnregDrepCert.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class UpdateDrepCert {
  private drep_credential: DrepCredential;
  private anchor: Anchor | undefined;

  constructor(drep_credential: DrepCredential, anchor: Anchor | undefined) {
    this.drep_credential = drep_credential;
    this.anchor = anchor;
  }

  get_drep_credential(): DrepCredential {
    return this.drep_credential;
  }

  set_drep_credential(drep_credential: DrepCredential): void {
    this.drep_credential = drep_credential;
  }

  get_anchor(): Anchor | undefined {
    return this.anchor;
  }

  set_anchor(anchor: Anchor): void {
    this.anchor = anchor;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): UpdateDrepCert {
    let drep_credential_ = array.shiftRequired();
    let drep_credential = DrepCredential.fromCBOR(drep_credential_);
    let anchor_ = array.shiftRequired();
    let anchor__ = anchor_.withNullable((x) => Anchor.fromCBOR(x));
    let anchor = anchor__ == null ? undefined : anchor__;

    return new UpdateDrepCert(drep_credential, anchor);
  }

  toArray() {
    let entries = [];
    entries.push(this.drep_credential);
    entries.push(this.anchor);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): UpdateDrepCert {
    let array = value.get("array");
    return UpdateDrepCert.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export enum CertificateKind {
  StakeRegistration = 0,
  StakeDeregistration = 1,
  StakeDelegation = 2,
  PoolRegistration = 3,
  PoolRetirement = 4,
  RegCert = 7,
  UnregCert = 8,
  VoteDelegCert = 9,
  StakeVoteDelegCert = 10,
  StakeRegDelegCert = 11,
  VoteRegDelegCert = 12,
  StakeVoteRegDelegCert = 13,
  AuthCommitteeHotCert = 14,
  ResignCommitteeColdCert = 15,
  RegDrepCert = 16,
  UnregDrepCert = 17,
  UpdateDrepCert = 18,
}

export type CertificateVariant =
  | { kind: 0; value: StakeRegistration }
  | { kind: 1; value: StakeDeregistration }
  | { kind: 2; value: StakeDelegation }
  | { kind: 3; value: PoolRegistration }
  | { kind: 4; value: PoolRetirement }
  | { kind: 7; value: RegCert }
  | { kind: 8; value: UnregCert }
  | { kind: 9; value: VoteDelegCert }
  | { kind: 10; value: StakeVoteDelegCert }
  | { kind: 11; value: StakeRegDelegCert }
  | { kind: 12; value: VoteRegDelegCert }
  | { kind: 13; value: StakeVoteRegDelegCert }
  | { kind: 14; value: AuthCommitteeHotCert }
  | { kind: 15; value: ResignCommitteeColdCert }
  | { kind: 16; value: RegDrepCert }
  | { kind: 17; value: UnregDrepCert }
  | { kind: 18; value: UpdateDrepCert };

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

  static new_vote_deleg_cert(vote_deleg_cert: VoteDelegCert): Certificate {
    return new Certificate({ kind: 9, value: vote_deleg_cert });
  }

  static new_stake_vote_deleg_cert(
    stake_vote_deleg_cert: StakeVoteDelegCert,
  ): Certificate {
    return new Certificate({ kind: 10, value: stake_vote_deleg_cert });
  }

  static new_stake_reg_deleg_cert(
    stake_reg_deleg_cert: StakeRegDelegCert,
  ): Certificate {
    return new Certificate({ kind: 11, value: stake_reg_deleg_cert });
  }

  static new_vote_reg_deleg_cert(
    vote_reg_deleg_cert: VoteRegDelegCert,
  ): Certificate {
    return new Certificate({ kind: 12, value: vote_reg_deleg_cert });
  }

  static new_stake_vote_reg_deleg_cert(
    stake_vote_reg_deleg_cert: StakeVoteRegDelegCert,
  ): Certificate {
    return new Certificate({ kind: 13, value: stake_vote_reg_deleg_cert });
  }

  static new_auth_committee_hot_cert(
    auth_committee_hot_cert: AuthCommitteeHotCert,
  ): Certificate {
    return new Certificate({ kind: 14, value: auth_committee_hot_cert });
  }

  static new_resign_committee_cold_cert(
    resign_committee_cold_cert: ResignCommitteeColdCert,
  ): Certificate {
    return new Certificate({ kind: 15, value: resign_committee_cold_cert });
  }

  static new_reg_drep_cert(reg_drep_cert: RegDrepCert): Certificate {
    return new Certificate({ kind: 16, value: reg_drep_cert });
  }

  static new_unreg_drep_cert(unreg_drep_cert: UnregDrepCert): Certificate {
    return new Certificate({ kind: 17, value: unreg_drep_cert });
  }

  static new_update_drep_cert(update_drep_cert: UpdateDrepCert): Certificate {
    return new Certificate({ kind: 18, value: update_drep_cert });
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

  as_vote_deleg_cert(): VoteDelegCert | undefined {
    if (this.variant.kind == 9) return this.variant.value;
  }

  as_stake_vote_deleg_cert(): StakeVoteDelegCert | undefined {
    if (this.variant.kind == 10) return this.variant.value;
  }

  as_stake_reg_deleg_cert(): StakeRegDelegCert | undefined {
    if (this.variant.kind == 11) return this.variant.value;
  }

  as_vote_reg_deleg_cert(): VoteRegDelegCert | undefined {
    if (this.variant.kind == 12) return this.variant.value;
  }

  as_stake_vote_reg_deleg_cert(): StakeVoteRegDelegCert | undefined {
    if (this.variant.kind == 13) return this.variant.value;
  }

  as_auth_committee_hot_cert(): AuthCommitteeHotCert | undefined {
    if (this.variant.kind == 14) return this.variant.value;
  }

  as_resign_committee_cold_cert(): ResignCommitteeColdCert | undefined {
    if (this.variant.kind == 15) return this.variant.value;
  }

  as_reg_drep_cert(): RegDrepCert | undefined {
    if (this.variant.kind == 16) return this.variant.value;
  }

  as_unreg_drep_cert(): UnregDrepCert | undefined {
    if (this.variant.kind == 17) return this.variant.value;
  }

  as_update_drep_cert(): UpdateDrepCert | undefined {
    if (this.variant.kind == 18) return this.variant.value;
  }

  static fromCBOR(value: CBORReaderValue): Certificate {
    let array = value.get("array");
    let [tag, variant] = array.shiftRequired().with((tag_) => {
      let tag = Number(tag_.get("uint"));

      if (tag == 0) return [tag, StakeRegistration.fromArray(array)];

      if (tag == 1) return [tag, StakeDeregistration.fromArray(array)];

      if (tag == 2) return [tag, StakeDelegation.fromArray(array)];

      if (tag == 3) return [tag, PoolRegistration.fromArray(array)];

      if (tag == 4) return [tag, PoolRetirement.fromArray(array)];

      if (tag == 7) return [tag, RegCert.fromArray(array)];

      if (tag == 8) return [tag, UnregCert.fromArray(array)];

      if (tag == 9) return [tag, VoteDelegCert.fromArray(array)];

      if (tag == 10) return [tag, StakeVoteDelegCert.fromArray(array)];

      if (tag == 11) return [tag, StakeRegDelegCert.fromArray(array)];

      if (tag == 12) return [tag, VoteRegDelegCert.fromArray(array)];

      if (tag == 13) return [tag, StakeVoteRegDelegCert.fromArray(array)];

      if (tag == 14) return [tag, AuthCommitteeHotCert.fromArray(array)];

      if (tag == 15) return [tag, ResignCommitteeColdCert.fromArray(array)];

      if (tag == 16) return [tag, RegDrepCert.fromArray(array)];

      if (tag == 17) return [tag, UnregDrepCert.fromArray(array)];

      if (tag == 18) return [tag, UpdateDrepCert.fromArray(array)];

      throw "Unrecognized tag: " + tag + " for Certificate";
    });

    return new Certificate({ kind: tag, value: variant });
  }

  toCBOR(writer: CBORWriter) {
    let entries = [this.variant.kind, ...this.variant.value.toArray()];
    writer.writeArray(entries);
  }
}

export class AddrKeyhash {
  private addr_keyhash: AddrKeyhash;

  constructor(addr_keyhash: AddrKeyhash) {
    this.addr_keyhash = addr_keyhash;
  }

  get_addr_keyhash(): AddrKeyhash {
    return this.addr_keyhash;
  }

  set_addr_keyhash(addr_keyhash: AddrKeyhash): void {
    this.addr_keyhash = addr_keyhash;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): AddrKeyhash {
    let addr_keyhash_ = array.shiftRequired();
    let addr_keyhash = AddrKeyhash.fromCBOR(addr_keyhash_);

    return new AddrKeyhash(addr_keyhash);
  }

  toArray() {
    let entries = [];
    entries.push(this.addr_keyhash);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): AddrKeyhash {
    let array = value.get("array");
    return AddrKeyhash.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class Scripthash {
  private scripthash: Scripthash;

  constructor(scripthash: Scripthash) {
    this.scripthash = scripthash;
  }

  get_scripthash(): Scripthash {
    return this.scripthash;
  }

  set_scripthash(scripthash: Scripthash): void {
    this.scripthash = scripthash;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): Scripthash {
    let scripthash_ = array.shiftRequired();
    let scripthash = Scripthash.fromCBOR(scripthash_);

    return new Scripthash(scripthash);
  }

  toArray() {
    let entries = [];
    entries.push(this.scripthash);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): Scripthash {
    let array = value.get("array");
    return Scripthash.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export enum CredentialKind {
  AddrKeyhash = 0,
  Scripthash = 1,
}

export type CredentialVariant =
  | { kind: 0; value: AddrKeyhash }
  | { kind: 1; value: Scripthash };

export class Credential {
  private variant: CredentialVariant;

  constructor(variant: CredentialVariant) {
    this.variant = variant;
  }

  static new_addr_keyhash(addr_keyhash: AddrKeyhash): Credential {
    return new Credential({ kind: 0, value: addr_keyhash });
  }

  static new_scripthash(scripthash: Scripthash): Credential {
    return new Credential({ kind: 1, value: scripthash });
  }

  as_addr_keyhash(): AddrKeyhash | undefined {
    if (this.variant.kind == 0) return this.variant.value;
  }

  as_scripthash(): Scripthash | undefined {
    if (this.variant.kind == 1) return this.variant.value;
  }

  static fromCBOR(value: CBORReaderValue): Credential {
    let array = value.get("array");
    let [tag, variant] = array.shiftRequired().with((tag_) => {
      let tag = Number(tag_.get("uint"));

      if (tag == 0) return [tag, AddrKeyhash.fromArray(array)];

      if (tag == 1) return [tag, Scripthash.fromArray(array)];

      throw "Unrecognized tag: " + tag + " for Credential";
    });

    return new Credential({ kind: tag, value: variant });
  }

  toCBOR(writer: CBORWriter) {
    let entries = [this.variant.kind, ...this.variant.value.toArray()];
    writer.writeArray(entries);
  }
}

export class SingleHostAddr {
  private port: Port | undefined;
  private ipv4: Ipv4 | undefined;
  private ipv6: Ipv6 | undefined;

  constructor(
    port: Port | undefined,
    ipv4: Ipv4 | undefined,
    ipv6: Ipv6 | undefined,
  ) {
    this.port = port;
    this.ipv4 = ipv4;
    this.ipv6 = ipv6;
  }

  get_port(): Port | undefined {
    return this.port;
  }

  set_port(port: Port): void {
    this.port = port;
  }

  get_ipv4(): Ipv4 | undefined {
    return this.ipv4;
  }

  set_ipv4(ipv4: Ipv4): void {
    this.ipv4 = ipv4;
  }

  get_ipv6(): Ipv6 | undefined {
    return this.ipv6;
  }

  set_ipv6(ipv6: Ipv6): void {
    this.ipv6 = ipv6;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): SingleHostAddr {
    let port_ = array.shiftRequired();
    let port__ = port_.withNullable((x) => Port.fromCBOR(x));
    let port = port__ == null ? undefined : port__;
    let ipv4_ = array.shiftRequired();
    let ipv4__ = ipv4_.withNullable((x) => Ipv4.fromCBOR(x));
    let ipv4 = ipv4__ == null ? undefined : ipv4__;
    let ipv6_ = array.shiftRequired();
    let ipv6__ = ipv6_.withNullable((x) => Ipv6.fromCBOR(x));
    let ipv6 = ipv6__ == null ? undefined : ipv6__;

    return new SingleHostAddr(port, ipv4, ipv6);
  }

  toArray() {
    let entries = [];
    entries.push(this.port);
    entries.push(this.ipv4);
    entries.push(this.ipv6);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): SingleHostAddr {
    let array = value.get("array");
    return SingleHostAddr.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class SingleHostName {
  private port: Port | undefined;
  private dns_name: DnsName;

  constructor(port: Port | undefined, dns_name: DnsName) {
    this.port = port;
    this.dns_name = dns_name;
  }

  get_port(): Port | undefined {
    return this.port;
  }

  set_port(port: Port): void {
    this.port = port;
  }

  get_dns_name(): DnsName {
    return this.dns_name;
  }

  set_dns_name(dns_name: DnsName): void {
    this.dns_name = dns_name;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): SingleHostName {
    let port_ = array.shiftRequired();
    let port__ = port_.withNullable((x) => Port.fromCBOR(x));
    let port = port__ == null ? undefined : port__;
    let dns_name_ = array.shiftRequired();
    let dns_name = DnsName.fromCBOR(dns_name_);

    return new SingleHostName(port, dns_name);
  }

  toArray() {
    let entries = [];
    entries.push(this.port);
    entries.push(this.dns_name);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): SingleHostName {
    let array = value.get("array");
    return SingleHostName.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class MultiHostName {
  private dns_name: DnsName;

  constructor(dns_name: DnsName) {
    this.dns_name = dns_name;
  }

  get_dns_name(): DnsName {
    return this.dns_name;
  }

  set_dns_name(dns_name: DnsName): void {
    this.dns_name = dns_name;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): MultiHostName {
    let dns_name_ = array.shiftRequired();
    let dns_name = DnsName.fromCBOR(dns_name_);

    return new MultiHostName(dns_name);
  }

  toArray() {
    let entries = [];
    entries.push(this.dns_name);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): MultiHostName {
    let array = value.get("array");
    return MultiHostName.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
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

  static fromCBOR(value: CBORReaderValue): Relay {
    let array = value.get("array");
    let [tag, variant] = array.shiftRequired().with((tag_) => {
      let tag = Number(tag_.get("uint"));

      if (tag == 0) return [tag, SingleHostAddr.fromArray(array)];

      if (tag == 1) return [tag, SingleHostName.fromArray(array)];

      if (tag == 2) return [tag, MultiHostName.fromArray(array)];

      throw "Unrecognized tag: " + tag + " for Relay";
    });

    return new Relay({ kind: tag, value: variant });
  }

  toCBOR(writer: CBORWriter) {
    let entries = [this.variant.kind, ...this.variant.value.toArray()];
    writer.writeArray(entries);
  }
}

export class PoolMetadata {
  private url: Url;
  private pool_metadata_hash: PoolMetadataHash;

  constructor(url: Url, pool_metadata_hash: PoolMetadataHash) {
    this.url = url;
    this.pool_metadata_hash = pool_metadata_hash;
  }

  get_url(): Url {
    return this.url;
  }

  set_url(url: Url): void {
    this.url = url;
  }

  get_pool_metadata_hash(): PoolMetadataHash {
    return this.pool_metadata_hash;
  }

  set_pool_metadata_hash(pool_metadata_hash: PoolMetadataHash): void {
    this.pool_metadata_hash = pool_metadata_hash;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): PoolMetadata {
    let url_ = array.shiftRequired();
    let url = Url.fromCBOR(url_);
    let pool_metadata_hash_ = array.shiftRequired();
    let pool_metadata_hash = PoolMetadataHash.fromCBOR(pool_metadata_hash_);

    return new PoolMetadata(url, pool_metadata_hash);
  }

  toArray() {
    let entries = [];
    entries.push(this.url);
    entries.push(this.pool_metadata_hash);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): PoolMetadata {
    let array = value.get("array");
    return PoolMetadata.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class ProtocolParamUpdate {
  private minfee_a: Coin | undefined;
  private minfee_b: Coin | undefined;
  private max_block_body_size: number | undefined;
  private max_tx_size: number | undefined;
  private max_block_header_size: number | undefined;
  private key_deposit: Coin | undefined;
  private pool_deposit: Coin | undefined;
  private max_epoch: Epoch | undefined;
  private n_opt: number | undefined;
  private pool_pledge_influence: UnitInterval | undefined;
  private expansion_rate: UnitInterval | undefined;
  private treasury_growth_rate: UnitInterval | undefined;
  private min_pool_cost: Coin | undefined;
  private ada_per_utxo_byte: Coin | undefined;
  private costmdls: Costmdls | undefined;
  private ex_unit_prices: ExUnitPrices | undefined;
  private max_tx_ex_units: MaxTxExUnits | undefined;
  private max_block_ex_units: MaxBlockExUnits | undefined;
  private max_value_size: number | undefined;
  private collateral_percentage: number | undefined;
  private max_collateral_inputs: number | undefined;
  private pool_voting_thresholds: PoolVotingThresholds | undefined;
  private drep_voting_thresholds: DrepVotingThresholds | undefined;
  private min_committee_size: number | undefined;
  private committee_term_limit: Epoch | undefined;
  private governance_action_validity_period: Epoch | undefined;
  private governance_action_deposit: Coin | undefined;
  private drep_deposit: Coin | undefined;
  private drep_inactivity_period: Epoch | undefined;
  private min_fee_ref_script_cost_per_byte: UnitInterval | undefined;

  constructor(
    minfee_a: Coin | undefined,
    minfee_b: Coin | undefined,
    max_block_body_size: number | undefined,
    max_tx_size: number | undefined,
    max_block_header_size: number | undefined,
    key_deposit: Coin | undefined,
    pool_deposit: Coin | undefined,
    max_epoch: Epoch | undefined,
    n_opt: number | undefined,
    pool_pledge_influence: UnitInterval | undefined,
    expansion_rate: UnitInterval | undefined,
    treasury_growth_rate: UnitInterval | undefined,
    min_pool_cost: Coin | undefined,
    ada_per_utxo_byte: Coin | undefined,
    costmdls: Costmdls | undefined,
    ex_unit_prices: ExUnitPrices | undefined,
    max_tx_ex_units: MaxTxExUnits | undefined,
    max_block_ex_units: MaxBlockExUnits | undefined,
    max_value_size: number | undefined,
    collateral_percentage: number | undefined,
    max_collateral_inputs: number | undefined,
    pool_voting_thresholds: PoolVotingThresholds | undefined,
    drep_voting_thresholds: DrepVotingThresholds | undefined,
    min_committee_size: number | undefined,
    committee_term_limit: Epoch | undefined,
    governance_action_validity_period: Epoch | undefined,
    governance_action_deposit: Coin | undefined,
    drep_deposit: Coin | undefined,
    drep_inactivity_period: Epoch | undefined,
    min_fee_ref_script_cost_per_byte: UnitInterval | undefined,
  ) {
    this.minfee_a = minfee_a;
    this.minfee_b = minfee_b;
    this.max_block_body_size = max_block_body_size;
    this.max_tx_size = max_tx_size;
    this.max_block_header_size = max_block_header_size;
    this.key_deposit = key_deposit;
    this.pool_deposit = pool_deposit;
    this.max_epoch = max_epoch;
    this.n_opt = n_opt;
    this.pool_pledge_influence = pool_pledge_influence;
    this.expansion_rate = expansion_rate;
    this.treasury_growth_rate = treasury_growth_rate;
    this.min_pool_cost = min_pool_cost;
    this.ada_per_utxo_byte = ada_per_utxo_byte;
    this.costmdls = costmdls;
    this.ex_unit_prices = ex_unit_prices;
    this.max_tx_ex_units = max_tx_ex_units;
    this.max_block_ex_units = max_block_ex_units;
    this.max_value_size = max_value_size;
    this.collateral_percentage = collateral_percentage;
    this.max_collateral_inputs = max_collateral_inputs;
    this.pool_voting_thresholds = pool_voting_thresholds;
    this.drep_voting_thresholds = drep_voting_thresholds;
    this.min_committee_size = min_committee_size;
    this.committee_term_limit = committee_term_limit;
    this.governance_action_validity_period = governance_action_validity_period;
    this.governance_action_deposit = governance_action_deposit;
    this.drep_deposit = drep_deposit;
    this.drep_inactivity_period = drep_inactivity_period;
    this.min_fee_ref_script_cost_per_byte = min_fee_ref_script_cost_per_byte;
  }

  get_minfee_a(): Coin | undefined {
    return this.minfee_a;
  }

  set_minfee_a(minfee_a: Coin): void {
    this.minfee_a = minfee_a;
  }

  get_minfee_b(): Coin | undefined {
    return this.minfee_b;
  }

  set_minfee_b(minfee_b: Coin): void {
    this.minfee_b = minfee_b;
  }

  get_max_block_body_size(): number | undefined {
    return this.max_block_body_size;
  }

  set_max_block_body_size(max_block_body_size: number): void {
    this.max_block_body_size = max_block_body_size;
  }

  get_max_tx_size(): number | undefined {
    return this.max_tx_size;
  }

  set_max_tx_size(max_tx_size: number): void {
    this.max_tx_size = max_tx_size;
  }

  get_max_block_header_size(): number | undefined {
    return this.max_block_header_size;
  }

  set_max_block_header_size(max_block_header_size: number): void {
    this.max_block_header_size = max_block_header_size;
  }

  get_key_deposit(): Coin | undefined {
    return this.key_deposit;
  }

  set_key_deposit(key_deposit: Coin): void {
    this.key_deposit = key_deposit;
  }

  get_pool_deposit(): Coin | undefined {
    return this.pool_deposit;
  }

  set_pool_deposit(pool_deposit: Coin): void {
    this.pool_deposit = pool_deposit;
  }

  get_max_epoch(): Epoch | undefined {
    return this.max_epoch;
  }

  set_max_epoch(max_epoch: Epoch): void {
    this.max_epoch = max_epoch;
  }

  get_n_opt(): number | undefined {
    return this.n_opt;
  }

  set_n_opt(n_opt: number): void {
    this.n_opt = n_opt;
  }

  get_pool_pledge_influence(): UnitInterval | undefined {
    return this.pool_pledge_influence;
  }

  set_pool_pledge_influence(pool_pledge_influence: UnitInterval): void {
    this.pool_pledge_influence = pool_pledge_influence;
  }

  get_expansion_rate(): UnitInterval | undefined {
    return this.expansion_rate;
  }

  set_expansion_rate(expansion_rate: UnitInterval): void {
    this.expansion_rate = expansion_rate;
  }

  get_treasury_growth_rate(): UnitInterval | undefined {
    return this.treasury_growth_rate;
  }

  set_treasury_growth_rate(treasury_growth_rate: UnitInterval): void {
    this.treasury_growth_rate = treasury_growth_rate;
  }

  get_min_pool_cost(): Coin | undefined {
    return this.min_pool_cost;
  }

  set_min_pool_cost(min_pool_cost: Coin): void {
    this.min_pool_cost = min_pool_cost;
  }

  get_ada_per_utxo_byte(): Coin | undefined {
    return this.ada_per_utxo_byte;
  }

  set_ada_per_utxo_byte(ada_per_utxo_byte: Coin): void {
    this.ada_per_utxo_byte = ada_per_utxo_byte;
  }

  get_costmdls(): Costmdls | undefined {
    return this.costmdls;
  }

  set_costmdls(costmdls: Costmdls): void {
    this.costmdls = costmdls;
  }

  get_ex_unit_prices(): ExUnitPrices | undefined {
    return this.ex_unit_prices;
  }

  set_ex_unit_prices(ex_unit_prices: ExUnitPrices): void {
    this.ex_unit_prices = ex_unit_prices;
  }

  get_max_tx_ex_units(): MaxTxExUnits | undefined {
    return this.max_tx_ex_units;
  }

  set_max_tx_ex_units(max_tx_ex_units: MaxTxExUnits): void {
    this.max_tx_ex_units = max_tx_ex_units;
  }

  get_max_block_ex_units(): MaxBlockExUnits | undefined {
    return this.max_block_ex_units;
  }

  set_max_block_ex_units(max_block_ex_units: MaxBlockExUnits): void {
    this.max_block_ex_units = max_block_ex_units;
  }

  get_max_value_size(): number | undefined {
    return this.max_value_size;
  }

  set_max_value_size(max_value_size: number): void {
    this.max_value_size = max_value_size;
  }

  get_collateral_percentage(): number | undefined {
    return this.collateral_percentage;
  }

  set_collateral_percentage(collateral_percentage: number): void {
    this.collateral_percentage = collateral_percentage;
  }

  get_max_collateral_inputs(): number | undefined {
    return this.max_collateral_inputs;
  }

  set_max_collateral_inputs(max_collateral_inputs: number): void {
    this.max_collateral_inputs = max_collateral_inputs;
  }

  get_pool_voting_thresholds(): PoolVotingThresholds | undefined {
    return this.pool_voting_thresholds;
  }

  set_pool_voting_thresholds(
    pool_voting_thresholds: PoolVotingThresholds,
  ): void {
    this.pool_voting_thresholds = pool_voting_thresholds;
  }

  get_drep_voting_thresholds(): DrepVotingThresholds | undefined {
    return this.drep_voting_thresholds;
  }

  set_drep_voting_thresholds(
    drep_voting_thresholds: DrepVotingThresholds,
  ): void {
    this.drep_voting_thresholds = drep_voting_thresholds;
  }

  get_min_committee_size(): number | undefined {
    return this.min_committee_size;
  }

  set_min_committee_size(min_committee_size: number): void {
    this.min_committee_size = min_committee_size;
  }

  get_committee_term_limit(): Epoch | undefined {
    return this.committee_term_limit;
  }

  set_committee_term_limit(committee_term_limit: Epoch): void {
    this.committee_term_limit = committee_term_limit;
  }

  get_governance_action_validity_period(): Epoch | undefined {
    return this.governance_action_validity_period;
  }

  set_governance_action_validity_period(
    governance_action_validity_period: Epoch,
  ): void {
    this.governance_action_validity_period = governance_action_validity_period;
  }

  get_governance_action_deposit(): Coin | undefined {
    return this.governance_action_deposit;
  }

  set_governance_action_deposit(governance_action_deposit: Coin): void {
    this.governance_action_deposit = governance_action_deposit;
  }

  get_drep_deposit(): Coin | undefined {
    return this.drep_deposit;
  }

  set_drep_deposit(drep_deposit: Coin): void {
    this.drep_deposit = drep_deposit;
  }

  get_drep_inactivity_period(): Epoch | undefined {
    return this.drep_inactivity_period;
  }

  set_drep_inactivity_period(drep_inactivity_period: Epoch): void {
    this.drep_inactivity_period = drep_inactivity_period;
  }

  get_min_fee_ref_script_cost_per_byte(): UnitInterval | undefined {
    return this.min_fee_ref_script_cost_per_byte;
  }

  set_min_fee_ref_script_cost_per_byte(
    min_fee_ref_script_cost_per_byte: UnitInterval,
  ): void {
    this.min_fee_ref_script_cost_per_byte = min_fee_ref_script_cost_per_byte;
  }

  static fromCBOR(value: CBORReaderValue): ProtocolParamUpdate {
    let map = value
      .get("map")
      .toMap()
      .map({ key: (x) => Number(x.getInt()), value: (x) => x });
    let minfee_a_ = map.get(0);
    let minfee_a =
      minfee_a_ != undefined ? Coin.fromCBOR(minfee_a_) : undefined;
    let minfee_b_ = map.get(1);
    let minfee_b =
      minfee_b_ != undefined ? Coin.fromCBOR(minfee_b_) : undefined;
    let max_block_body_size_ = map.get(2);
    let max_block_body_size =
      max_block_body_size_ != undefined
        ? max_block_body_size_.get("uint")
        : undefined;
    let max_tx_size_ = map.get(3);
    let max_tx_size =
      max_tx_size_ != undefined ? max_tx_size_.get("uint") : undefined;
    let max_block_header_size_ = map.get(4);
    let max_block_header_size =
      max_block_header_size_ != undefined
        ? max_block_header_size_.get("uint")
        : undefined;
    let key_deposit_ = map.get(5);
    let key_deposit =
      key_deposit_ != undefined ? Coin.fromCBOR(key_deposit_) : undefined;
    let pool_deposit_ = map.get(6);
    let pool_deposit =
      pool_deposit_ != undefined ? Coin.fromCBOR(pool_deposit_) : undefined;
    let max_epoch_ = map.get(7);
    let max_epoch =
      max_epoch_ != undefined ? Epoch.fromCBOR(max_epoch_) : undefined;
    let n_opt_ = map.get(8);
    let n_opt = n_opt_ != undefined ? n_opt_.get("uint") : undefined;
    let pool_pledge_influence_ = map.get(9);
    let pool_pledge_influence =
      pool_pledge_influence_ != undefined
        ? UnitInterval.fromCBOR(pool_pledge_influence_)
        : undefined;
    let expansion_rate_ = map.get(10);
    let expansion_rate =
      expansion_rate_ != undefined
        ? UnitInterval.fromCBOR(expansion_rate_)
        : undefined;
    let treasury_growth_rate_ = map.get(11);
    let treasury_growth_rate =
      treasury_growth_rate_ != undefined
        ? UnitInterval.fromCBOR(treasury_growth_rate_)
        : undefined;
    let min_pool_cost_ = map.get(16);
    let min_pool_cost =
      min_pool_cost_ != undefined ? Coin.fromCBOR(min_pool_cost_) : undefined;
    let ada_per_utxo_byte_ = map.get(17);
    let ada_per_utxo_byte =
      ada_per_utxo_byte_ != undefined
        ? Coin.fromCBOR(ada_per_utxo_byte_)
        : undefined;
    let costmdls_ = map.get(18);
    let costmdls =
      costmdls_ != undefined ? Costmdls.fromCBOR(costmdls_) : undefined;
    let ex_unit_prices_ = map.get(19);
    let ex_unit_prices =
      ex_unit_prices_ != undefined
        ? ExUnitPrices.fromCBOR(ex_unit_prices_)
        : undefined;
    let max_tx_ex_units_ = map.get(20);
    let max_tx_ex_units =
      max_tx_ex_units_ != undefined
        ? MaxTxExUnits.fromCBOR(max_tx_ex_units_)
        : undefined;
    let max_block_ex_units_ = map.get(21);
    let max_block_ex_units =
      max_block_ex_units_ != undefined
        ? MaxBlockExUnits.fromCBOR(max_block_ex_units_)
        : undefined;
    let max_value_size_ = map.get(22);
    let max_value_size =
      max_value_size_ != undefined ? max_value_size_.get("uint") : undefined;
    let collateral_percentage_ = map.get(23);
    let collateral_percentage =
      collateral_percentage_ != undefined
        ? collateral_percentage_.get("uint")
        : undefined;
    let max_collateral_inputs_ = map.get(24);
    let max_collateral_inputs =
      max_collateral_inputs_ != undefined
        ? max_collateral_inputs_.get("uint")
        : undefined;
    let pool_voting_thresholds_ = map.get(25);
    let pool_voting_thresholds =
      pool_voting_thresholds_ != undefined
        ? PoolVotingThresholds.fromCBOR(pool_voting_thresholds_)
        : undefined;
    let drep_voting_thresholds_ = map.get(26);
    let drep_voting_thresholds =
      drep_voting_thresholds_ != undefined
        ? DrepVotingThresholds.fromCBOR(drep_voting_thresholds_)
        : undefined;
    let min_committee_size_ = map.get(27);
    let min_committee_size =
      min_committee_size_ != undefined
        ? min_committee_size_.get("uint")
        : undefined;
    let committee_term_limit_ = map.get(28);
    let committee_term_limit =
      committee_term_limit_ != undefined
        ? Epoch.fromCBOR(committee_term_limit_)
        : undefined;
    let governance_action_validity_period_ = map.get(29);
    let governance_action_validity_period =
      governance_action_validity_period_ != undefined
        ? Epoch.fromCBOR(governance_action_validity_period_)
        : undefined;
    let governance_action_deposit_ = map.get(30);
    let governance_action_deposit =
      governance_action_deposit_ != undefined
        ? Coin.fromCBOR(governance_action_deposit_)
        : undefined;
    let drep_deposit_ = map.get(31);
    let drep_deposit =
      drep_deposit_ != undefined ? Coin.fromCBOR(drep_deposit_) : undefined;
    let drep_inactivity_period_ = map.get(32);
    let drep_inactivity_period =
      drep_inactivity_period_ != undefined
        ? Epoch.fromCBOR(drep_inactivity_period_)
        : undefined;
    let min_fee_ref_script_cost_per_byte_ = map.get(33);
    let min_fee_ref_script_cost_per_byte =
      min_fee_ref_script_cost_per_byte_ != undefined
        ? UnitInterval.fromCBOR(min_fee_ref_script_cost_per_byte_)
        : undefined;

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
      ex_unit_prices,
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
      min_fee_ref_script_cost_per_byte,
    );
  }

  toCBOR(writer: CBORWriter) {
    let entries = [];
    if (this.minfee_a !== undefined) entries.push([0, this.minfee_a]);
    if (this.minfee_b !== undefined) entries.push([1, this.minfee_b]);
    if (this.max_block_body_size !== undefined)
      entries.push([2, this.max_block_body_size]);
    if (this.max_tx_size !== undefined) entries.push([3, this.max_tx_size]);
    if (this.max_block_header_size !== undefined)
      entries.push([4, this.max_block_header_size]);
    if (this.key_deposit !== undefined) entries.push([5, this.key_deposit]);
    if (this.pool_deposit !== undefined) entries.push([6, this.pool_deposit]);
    if (this.max_epoch !== undefined) entries.push([7, this.max_epoch]);
    if (this.n_opt !== undefined) entries.push([8, this.n_opt]);
    if (this.pool_pledge_influence !== undefined)
      entries.push([9, this.pool_pledge_influence]);
    if (this.expansion_rate !== undefined)
      entries.push([10, this.expansion_rate]);
    if (this.treasury_growth_rate !== undefined)
      entries.push([11, this.treasury_growth_rate]);
    if (this.min_pool_cost !== undefined)
      entries.push([16, this.min_pool_cost]);
    if (this.ada_per_utxo_byte !== undefined)
      entries.push([17, this.ada_per_utxo_byte]);
    if (this.costmdls !== undefined) entries.push([18, this.costmdls]);
    if (this.ex_unit_prices !== undefined)
      entries.push([19, this.ex_unit_prices]);
    if (this.max_tx_ex_units !== undefined)
      entries.push([20, this.max_tx_ex_units]);
    if (this.max_block_ex_units !== undefined)
      entries.push([21, this.max_block_ex_units]);
    if (this.max_value_size !== undefined)
      entries.push([22, this.max_value_size]);
    if (this.collateral_percentage !== undefined)
      entries.push([23, this.collateral_percentage]);
    if (this.max_collateral_inputs !== undefined)
      entries.push([24, this.max_collateral_inputs]);
    if (this.pool_voting_thresholds !== undefined)
      entries.push([25, this.pool_voting_thresholds]);
    if (this.drep_voting_thresholds !== undefined)
      entries.push([26, this.drep_voting_thresholds]);
    if (this.min_committee_size !== undefined)
      entries.push([27, this.min_committee_size]);
    if (this.committee_term_limit !== undefined)
      entries.push([28, this.committee_term_limit]);
    if (this.governance_action_validity_period !== undefined)
      entries.push([29, this.governance_action_validity_period]);
    if (this.governance_action_deposit !== undefined)
      entries.push([30, this.governance_action_deposit]);
    if (this.drep_deposit !== undefined) entries.push([31, this.drep_deposit]);
    if (this.drep_inactivity_period !== undefined)
      entries.push([32, this.drep_inactivity_period]);
    if (this.min_fee_ref_script_cost_per_byte !== undefined)
      entries.push([33, this.min_fee_ref_script_cost_per_byte]);
    writer.writeMap(entries);
  }
}

export class PoolVotingThresholds {
  private motion_no_confidence: UnitInterval;
  private committee_normal: UnitInterval;
  private committee_no_confidence: UnitInterval;
  private hard_fork_initiation: UnitInterval;
  private security_relevant_parameter_voting_threshold: UnitInterval;

  constructor(
    motion_no_confidence: UnitInterval,
    committee_normal: UnitInterval,
    committee_no_confidence: UnitInterval,
    hard_fork_initiation: UnitInterval,
    security_relevant_parameter_voting_threshold: UnitInterval,
  ) {
    this.motion_no_confidence = motion_no_confidence;
    this.committee_normal = committee_normal;
    this.committee_no_confidence = committee_no_confidence;
    this.hard_fork_initiation = hard_fork_initiation;
    this.security_relevant_parameter_voting_threshold =
      security_relevant_parameter_voting_threshold;
  }

  get_motion_no_confidence(): UnitInterval {
    return this.motion_no_confidence;
  }

  set_motion_no_confidence(motion_no_confidence: UnitInterval): void {
    this.motion_no_confidence = motion_no_confidence;
  }

  get_committee_normal(): UnitInterval {
    return this.committee_normal;
  }

  set_committee_normal(committee_normal: UnitInterval): void {
    this.committee_normal = committee_normal;
  }

  get_committee_no_confidence(): UnitInterval {
    return this.committee_no_confidence;
  }

  set_committee_no_confidence(committee_no_confidence: UnitInterval): void {
    this.committee_no_confidence = committee_no_confidence;
  }

  get_hard_fork_initiation(): UnitInterval {
    return this.hard_fork_initiation;
  }

  set_hard_fork_initiation(hard_fork_initiation: UnitInterval): void {
    this.hard_fork_initiation = hard_fork_initiation;
  }

  get_security_relevant_parameter_voting_threshold(): UnitInterval {
    return this.security_relevant_parameter_voting_threshold;
  }

  set_security_relevant_parameter_voting_threshold(
    security_relevant_parameter_voting_threshold: UnitInterval,
  ): void {
    this.security_relevant_parameter_voting_threshold =
      security_relevant_parameter_voting_threshold;
  }

  static fromArray(
    array: CBORArrayReader<CBORReaderValue>,
  ): PoolVotingThresholds {
    let motion_no_confidence_ = array.shiftRequired();
    let motion_no_confidence = UnitInterval.fromCBOR(motion_no_confidence_);
    let committee_normal_ = array.shiftRequired();
    let committee_normal = UnitInterval.fromCBOR(committee_normal_);
    let committee_no_confidence_ = array.shiftRequired();
    let committee_no_confidence = UnitInterval.fromCBOR(
      committee_no_confidence_,
    );
    let hard_fork_initiation_ = array.shiftRequired();
    let hard_fork_initiation = UnitInterval.fromCBOR(hard_fork_initiation_);
    let security_relevant_parameter_voting_threshold_ = array.shiftRequired();
    let security_relevant_parameter_voting_threshold = UnitInterval.fromCBOR(
      security_relevant_parameter_voting_threshold_,
    );

    return new PoolVotingThresholds(
      motion_no_confidence,
      committee_normal,
      committee_no_confidence,
      hard_fork_initiation,
      security_relevant_parameter_voting_threshold,
    );
  }

  toArray() {
    let entries = [];
    entries.push(this.motion_no_confidence);
    entries.push(this.committee_normal);
    entries.push(this.committee_no_confidence);
    entries.push(this.hard_fork_initiation);
    entries.push(this.security_relevant_parameter_voting_threshold);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): PoolVotingThresholds {
    let array = value.get("array");
    return PoolVotingThresholds.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class DrepVotingThresholds {
  private motion_no_confidence: UnitInterval;
  private committee_normal: UnitInterval;
  private committee_no_confidence: UnitInterval;
  private update_constitution: UnitInterval;
  private hard_fork_initiation: UnitInterval;
  private pp_network_group: UnitInterval;
  private pp_economic_group: UnitInterval;
  private pp_technical_group: UnitInterval;
  private pp_governance_group: UnitInterval;
  private treasury_withdrawal: UnitInterval;

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
    this.motion_no_confidence = motion_no_confidence;
    this.committee_normal = committee_normal;
    this.committee_no_confidence = committee_no_confidence;
    this.update_constitution = update_constitution;
    this.hard_fork_initiation = hard_fork_initiation;
    this.pp_network_group = pp_network_group;
    this.pp_economic_group = pp_economic_group;
    this.pp_technical_group = pp_technical_group;
    this.pp_governance_group = pp_governance_group;
    this.treasury_withdrawal = treasury_withdrawal;
  }

  get_motion_no_confidence(): UnitInterval {
    return this.motion_no_confidence;
  }

  set_motion_no_confidence(motion_no_confidence: UnitInterval): void {
    this.motion_no_confidence = motion_no_confidence;
  }

  get_committee_normal(): UnitInterval {
    return this.committee_normal;
  }

  set_committee_normal(committee_normal: UnitInterval): void {
    this.committee_normal = committee_normal;
  }

  get_committee_no_confidence(): UnitInterval {
    return this.committee_no_confidence;
  }

  set_committee_no_confidence(committee_no_confidence: UnitInterval): void {
    this.committee_no_confidence = committee_no_confidence;
  }

  get_update_constitution(): UnitInterval {
    return this.update_constitution;
  }

  set_update_constitution(update_constitution: UnitInterval): void {
    this.update_constitution = update_constitution;
  }

  get_hard_fork_initiation(): UnitInterval {
    return this.hard_fork_initiation;
  }

  set_hard_fork_initiation(hard_fork_initiation: UnitInterval): void {
    this.hard_fork_initiation = hard_fork_initiation;
  }

  get_pp_network_group(): UnitInterval {
    return this.pp_network_group;
  }

  set_pp_network_group(pp_network_group: UnitInterval): void {
    this.pp_network_group = pp_network_group;
  }

  get_pp_economic_group(): UnitInterval {
    return this.pp_economic_group;
  }

  set_pp_economic_group(pp_economic_group: UnitInterval): void {
    this.pp_economic_group = pp_economic_group;
  }

  get_pp_technical_group(): UnitInterval {
    return this.pp_technical_group;
  }

  set_pp_technical_group(pp_technical_group: UnitInterval): void {
    this.pp_technical_group = pp_technical_group;
  }

  get_pp_governance_group(): UnitInterval {
    return this.pp_governance_group;
  }

  set_pp_governance_group(pp_governance_group: UnitInterval): void {
    this.pp_governance_group = pp_governance_group;
  }

  get_treasury_withdrawal(): UnitInterval {
    return this.treasury_withdrawal;
  }

  set_treasury_withdrawal(treasury_withdrawal: UnitInterval): void {
    this.treasury_withdrawal = treasury_withdrawal;
  }

  static fromArray(
    array: CBORArrayReader<CBORReaderValue>,
  ): DrepVotingThresholds {
    let motion_no_confidence_ = array.shiftRequired();
    let motion_no_confidence = UnitInterval.fromCBOR(motion_no_confidence_);
    let committee_normal_ = array.shiftRequired();
    let committee_normal = UnitInterval.fromCBOR(committee_normal_);
    let committee_no_confidence_ = array.shiftRequired();
    let committee_no_confidence = UnitInterval.fromCBOR(
      committee_no_confidence_,
    );
    let update_constitution_ = array.shiftRequired();
    let update_constitution = UnitInterval.fromCBOR(update_constitution_);
    let hard_fork_initiation_ = array.shiftRequired();
    let hard_fork_initiation = UnitInterval.fromCBOR(hard_fork_initiation_);
    let pp_network_group_ = array.shiftRequired();
    let pp_network_group = UnitInterval.fromCBOR(pp_network_group_);
    let pp_economic_group_ = array.shiftRequired();
    let pp_economic_group = UnitInterval.fromCBOR(pp_economic_group_);
    let pp_technical_group_ = array.shiftRequired();
    let pp_technical_group = UnitInterval.fromCBOR(pp_technical_group_);
    let pp_governance_group_ = array.shiftRequired();
    let pp_governance_group = UnitInterval.fromCBOR(pp_governance_group_);
    let treasury_withdrawal_ = array.shiftRequired();
    let treasury_withdrawal = UnitInterval.fromCBOR(treasury_withdrawal_);

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

  toArray() {
    let entries = [];
    entries.push(this.motion_no_confidence);
    entries.push(this.committee_normal);
    entries.push(this.committee_no_confidence);
    entries.push(this.update_constitution);
    entries.push(this.hard_fork_initiation);
    entries.push(this.pp_network_group);
    entries.push(this.pp_economic_group);
    entries.push(this.pp_technical_group);
    entries.push(this.pp_governance_group);
    entries.push(this.treasury_withdrawal);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): DrepVotingThresholds {
    let array = value.get("array");
    return DrepVotingThresholds.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class Vkeywitnesses extends Array<Vkeywitness> {
  static fromCBOR(value: CBORReaderValue): Vkeywitnesses {
    let tagged = value.get("tagged");
    let array = tagged.getTagged(258n).get("array");
    return new Vkeywitnesses(...array.map((x) => Vkeywitness.fromCBOR(x)));
  }

  toCBOR(writer: CBORWriter) {
    return writer.writeTagged(258n, [...this]);
  }
}

export class NativeScripts extends Array<NativeScript> {
  static fromCBOR(value: CBORReaderValue): NativeScripts {
    let tagged = value.get("tagged");
    let array = tagged.getTagged(258n).get("array");
    return new NativeScripts(...array.map((x) => NativeScript.fromCBOR(x)));
  }

  toCBOR(writer: CBORWriter) {
    return writer.writeTagged(258n, [...this]);
  }
}

export class BootstrapWitnesses extends Array<BootstrapWitness> {
  static fromCBOR(value: CBORReaderValue): BootstrapWitnesses {
    let tagged = value.get("tagged");
    let array = tagged.getTagged(258n).get("array");
    return new BootstrapWitnesses(
      ...array.map((x) => BootstrapWitness.fromCBOR(x)),
    );
  }

  toCBOR(writer: CBORWriter) {
    return writer.writeTagged(258n, [...this]);
  }
}

export class PlutusV1Scripts extends Array<PlutusV1Script> {
  static fromCBOR(value: CBORReaderValue): PlutusV1Scripts {
    let tagged = value.get("tagged");
    let array = tagged.getTagged(258n).get("array");
    return new PlutusV1Scripts(...array.map((x) => PlutusV1Script.fromCBOR(x)));
  }

  toCBOR(writer: CBORWriter) {
    return writer.writeTagged(258n, [...this]);
  }
}

export class PlutusV2Scripts extends Array<PlutusV2Script> {
  static fromCBOR(value: CBORReaderValue): PlutusV2Scripts {
    let tagged = value.get("tagged");
    let array = tagged.getTagged(258n).get("array");
    return new PlutusV2Scripts(...array.map((x) => PlutusV2Script.fromCBOR(x)));
  }

  toCBOR(writer: CBORWriter) {
    return writer.writeTagged(258n, [...this]);
  }
}

export class PlutusV3Scripts extends Array<PlutusV3Script> {
  static fromCBOR(value: CBORReaderValue): PlutusV3Scripts {
    let tagged = value.get("tagged");
    let array = tagged.getTagged(258n).get("array");
    return new PlutusV3Scripts(...array.map((x) => PlutusV3Script.fromCBOR(x)));
  }

  toCBOR(writer: CBORWriter) {
    return writer.writeTagged(258n, [...this]);
  }
}

export class TransactionWitnessSet {
  private vkeywitnesses: Vkeywitnesses;
  private native_scripts: NativeScripts;
  private bootstrap_witnesses: BootstrapWitnesses;
  private plutus_v1_scripts: PlutusV1Scripts;
  private plutus_data: PlutusData;
  private redeemers: Redeemers;
  private plutus_v2_scripts: PlutusV2Scripts;
  private plutus_v3_scripts: PlutusV3Scripts;

  constructor(
    vkeywitnesses: Vkeywitnesses,
    native_scripts: NativeScripts,
    bootstrap_witnesses: BootstrapWitnesses,
    plutus_v1_scripts: PlutusV1Scripts,
    plutus_data: PlutusData,
    redeemers: Redeemers,
    plutus_v2_scripts: PlutusV2Scripts,
    plutus_v3_scripts: PlutusV3Scripts,
  ) {
    this.vkeywitnesses = vkeywitnesses;
    this.native_scripts = native_scripts;
    this.bootstrap_witnesses = bootstrap_witnesses;
    this.plutus_v1_scripts = plutus_v1_scripts;
    this.plutus_data = plutus_data;
    this.redeemers = redeemers;
    this.plutus_v2_scripts = plutus_v2_scripts;
    this.plutus_v3_scripts = plutus_v3_scripts;
  }

  get_vkeywitnesses(): Vkeywitnesses {
    return this.vkeywitnesses;
  }

  set_vkeywitnesses(vkeywitnesses: Vkeywitnesses): void {
    this.vkeywitnesses = vkeywitnesses;
  }

  get_native_scripts(): NativeScripts {
    return this.native_scripts;
  }

  set_native_scripts(native_scripts: NativeScripts): void {
    this.native_scripts = native_scripts;
  }

  get_bootstrap_witnesses(): BootstrapWitnesses {
    return this.bootstrap_witnesses;
  }

  set_bootstrap_witnesses(bootstrap_witnesses: BootstrapWitnesses): void {
    this.bootstrap_witnesses = bootstrap_witnesses;
  }

  get_plutus_v1_scripts(): PlutusV1Scripts {
    return this.plutus_v1_scripts;
  }

  set_plutus_v1_scripts(plutus_v1_scripts: PlutusV1Scripts): void {
    this.plutus_v1_scripts = plutus_v1_scripts;
  }

  get_plutus_data(): PlutusData {
    return this.plutus_data;
  }

  set_plutus_data(plutus_data: PlutusData): void {
    this.plutus_data = plutus_data;
  }

  get_redeemers(): Redeemers {
    return this.redeemers;
  }

  set_redeemers(redeemers: Redeemers): void {
    this.redeemers = redeemers;
  }

  get_plutus_v2_scripts(): PlutusV2Scripts {
    return this.plutus_v2_scripts;
  }

  set_plutus_v2_scripts(plutus_v2_scripts: PlutusV2Scripts): void {
    this.plutus_v2_scripts = plutus_v2_scripts;
  }

  get_plutus_v3_scripts(): PlutusV3Scripts {
    return this.plutus_v3_scripts;
  }

  set_plutus_v3_scripts(plutus_v3_scripts: PlutusV3Scripts): void {
    this.plutus_v3_scripts = plutus_v3_scripts;
  }

  static fromCBOR(value: CBORReaderValue): TransactionWitnessSet {
    let map = value
      .get("map")
      .toMap()
      .map({ key: (x) => Number(x.getInt()), value: (x) => x });
    let vkeywitnesses_ = map.getRequired(0);
    let vkeywitnesses =
      vkeywitnesses_ != undefined
        ? Vkeywitnesses.fromCBOR(vkeywitnesses_)
        : undefined;
    let native_scripts_ = map.getRequired(1);
    let native_scripts =
      native_scripts_ != undefined
        ? NativeScripts.fromCBOR(native_scripts_)
        : undefined;
    let bootstrap_witnesses_ = map.getRequired(2);
    let bootstrap_witnesses =
      bootstrap_witnesses_ != undefined
        ? BootstrapWitnesses.fromCBOR(bootstrap_witnesses_)
        : undefined;
    let plutus_v1_scripts_ = map.getRequired(3);
    let plutus_v1_scripts =
      plutus_v1_scripts_ != undefined
        ? PlutusV1Scripts.fromCBOR(plutus_v1_scripts_)
        : undefined;
    let plutus_data_ = map.getRequired(4);
    let plutus_data =
      plutus_data_ != undefined ? PlutusData.fromCBOR(plutus_data_) : undefined;
    let redeemers_ = map.getRequired(5);
    let redeemers =
      redeemers_ != undefined ? Redeemers.fromCBOR(redeemers_) : undefined;
    let plutus_v2_scripts_ = map.getRequired(6);
    let plutus_v2_scripts =
      plutus_v2_scripts_ != undefined
        ? PlutusV2Scripts.fromCBOR(plutus_v2_scripts_)
        : undefined;
    let plutus_v3_scripts_ = map.getRequired(7);
    let plutus_v3_scripts =
      plutus_v3_scripts_ != undefined
        ? PlutusV3Scripts.fromCBOR(plutus_v3_scripts_)
        : undefined;

    return new TransactionWitnessSet(
      vkeywitnesses,
      native_scripts,
      bootstrap_witnesses,
      plutus_v1_scripts,
      plutus_data,
      redeemers,
      plutus_v2_scripts,
      plutus_v3_scripts,
    );
  }

  toCBOR(writer: CBORWriter) {
    let entries = [];
    entries.push([0, this.vkeywitnesses]);
    entries.push([1, this.native_scripts]);
    entries.push([2, this.bootstrap_witnesses]);
    entries.push([3, this.plutus_v1_scripts]);
    entries.push([4, this.plutus_data]);
    entries.push([5, this.redeemers]);
    entries.push([6, this.plutus_v2_scripts]);
    entries.push([7, this.plutus_v3_scripts]);
    writer.writeMap(entries);
  }
}

export class FlatArray {
  private tag: RedeemerTag;
  private index: number;
  private data: PlutusData;
  private ex_units: ExUnits;

  constructor(
    tag: RedeemerTag,
    index: number,
    data: PlutusData,
    ex_units: ExUnits,
  ) {
    this.tag = tag;
    this.index = index;
    this.data = data;
    this.ex_units = ex_units;
  }

  get_tag(): RedeemerTag {
    return this.tag;
  }

  set_tag(tag: RedeemerTag): void {
    this.tag = tag;
  }

  get_index(): number {
    return this.index;
  }

  set_index(index: number): void {
    this.index = index;
  }

  get_data(): PlutusData {
    return this.data;
  }

  set_data(data: PlutusData): void {
    this.data = data;
  }

  get_ex_units(): ExUnits {
    return this.ex_units;
  }

  set_ex_units(ex_units: ExUnits): void {
    this.ex_units = ex_units;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): FlatArray {
    let tag_ = array.shiftRequired();
    let tag = RedeemerTag.fromCBOR(tag_);
    let index_ = array.shiftRequired();
    let index = index_.get("uint");
    let data_ = array.shiftRequired();
    let data = PlutusData.fromCBOR(data_);
    let ex_units_ = array.shiftRequired();
    let ex_units = ExUnits.fromCBOR(ex_units_);

    return new FlatArray(tag, index, data, ex_units);
  }

  toArray() {
    let entries = [];
    entries.push(this.tag);
    entries.push(this.index);
    entries.push(this.data);
    entries.push(this.ex_units);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): FlatArray {
    let array = value.get("array");
    return FlatArray.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export enum RedeemerTagKind {
  Spending = 0,
  Minting = 1,
  Certifying = 2,
  Rewarding = 3,
  Voting = 4,
  Proposing = 5,
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

  static fromCBOR(value: CBORReaderValue): RedeemerTag {
    return value.with((value) => {
      let kind = Number(value.getInt());

      if (kind == 0) return new RedeemerTag(0);

      if (kind == 1) return new RedeemerTag(1);

      if (kind == 2) return new RedeemerTag(2);

      if (kind == 3) return new RedeemerTag(3);

      if (kind == 4) return new RedeemerTag(4);

      if (kind == 5) return new RedeemerTag(5);

      throw "Unrecognized enum value: " + kind + " for " + RedeemerTag;
    });
  }

  toCBOR(writer: CBORWriter) {
    writer.write(this.kind_);
  }
}

export class ExUnits {
  private mem: number;
  private steps: number;

  constructor(mem: number, steps: number) {
    this.mem = mem;
    this.steps = steps;
  }

  get_mem(): number {
    return this.mem;
  }

  set_mem(mem: number): void {
    this.mem = mem;
  }

  get_steps(): number {
    return this.steps;
  }

  set_steps(steps: number): void {
    this.steps = steps;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): ExUnits {
    let mem_ = array.shiftRequired();
    let mem = mem_.get("uint");
    let steps_ = array.shiftRequired();
    let steps = steps_.get("uint");

    return new ExUnits(mem, steps);
  }

  toArray() {
    let entries = [];
    entries.push(this.mem);
    entries.push(this.steps);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): ExUnits {
    let array = value.get("array");
    return ExUnits.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class ExUnitPrices {
  private mem_price: UnitInterval;
  private step_price: UnitInterval;

  constructor(mem_price: UnitInterval, step_price: UnitInterval) {
    this.mem_price = mem_price;
    this.step_price = step_price;
  }

  get_mem_price(): UnitInterval {
    return this.mem_price;
  }

  set_mem_price(mem_price: UnitInterval): void {
    this.mem_price = mem_price;
  }

  get_step_price(): UnitInterval {
    return this.step_price;
  }

  set_step_price(step_price: UnitInterval): void {
    this.step_price = step_price;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): ExUnitPrices {
    let mem_price_ = array.shiftRequired();
    let mem_price = UnitInterval.fromCBOR(mem_price_);
    let step_price_ = array.shiftRequired();
    let step_price = UnitInterval.fromCBOR(step_price_);

    return new ExUnitPrices(mem_price, step_price);
  }

  toArray() {
    let entries = [];
    entries.push(this.mem_price);
    entries.push(this.step_price);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): ExUnitPrices {
    let array = value.get("array");
    return ExUnitPrices.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export enum LanguageKind {
  PlutusV1 = 0,
  PlutusV2 = 1,
  PlutusV3 = 2,
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

  static fromCBOR(value: CBORReaderValue): Language {
    return value.with((value) => {
      let kind = Number(value.getInt());

      if (kind == 0) return new Language(0);

      if (kind == 1) return new Language(1);

      if (kind == 2) return new Language(2);

      throw "Unrecognized enum value: " + kind + " for " + Language;
    });
  }

  toCBOR(writer: CBORWriter) {
    writer.write(this.kind_);
  }
}

export class PlutusV1 extends Array<number> {
  static fromCBOR(value: CBORReaderValue): PlutusV1 {
    let array = value.get("array");
    return new PlutusV1(...array.map((x) => x.get("uint")));
  }
}

export class PlutusV2 extends Array<number> {
  static fromCBOR(value: CBORReaderValue): PlutusV2 {
    let array = value.get("array");
    return new PlutusV2(...array.map((x) => x.get("uint")));
  }
}

export class PlutusV3 extends Array<number> {
  static fromCBOR(value: CBORReaderValue): PlutusV3 {
    let array = value.get("array");
    return new PlutusV3(...array.map((x) => x.get("uint")));
  }
}

export class Other extends Array<number> {
  static fromCBOR(value: CBORReaderValue): Other {
    let array = value.get("array");
    return new Other(...array.map((x) => x.get("uint")));
  }
}

export class Costmdls {
  private plutus_v1: PlutusV1;
  private plutus_v2: PlutusV2;
  private plutus_v3: PlutusV3;
  private other: Other;

  constructor(
    plutus_v1: PlutusV1,
    plutus_v2: PlutusV2,
    plutus_v3: PlutusV3,
    other: Other,
  ) {
    this.plutus_v1 = plutus_v1;
    this.plutus_v2 = plutus_v2;
    this.plutus_v3 = plutus_v3;
    this.other = other;
  }

  get_plutus_v1(): PlutusV1 {
    return this.plutus_v1;
  }

  set_plutus_v1(plutus_v1: PlutusV1): void {
    this.plutus_v1 = plutus_v1;
  }

  get_plutus_v2(): PlutusV2 {
    return this.plutus_v2;
  }

  set_plutus_v2(plutus_v2: PlutusV2): void {
    this.plutus_v2 = plutus_v2;
  }

  get_plutus_v3(): PlutusV3 {
    return this.plutus_v3;
  }

  set_plutus_v3(plutus_v3: PlutusV3): void {
    this.plutus_v3 = plutus_v3;
  }

  get_other(): Other {
    return this.other;
  }

  set_other(other: Other): void {
    this.other = other;
  }

  static fromCBOR(value: CBORReaderValue): Costmdls {
    let map = value
      .get("map")
      .toMap()
      .map({ key: (x) => Number(x.getInt()), value: (x) => x });
    let plutus_v1_ = map.getRequired(0);
    let plutus_v1 =
      plutus_v1_ != undefined ? PlutusV1.fromCBOR(plutus_v1_) : undefined;
    let plutus_v2_ = map.getRequired(1);
    let plutus_v2 =
      plutus_v2_ != undefined ? PlutusV2.fromCBOR(plutus_v2_) : undefined;
    let plutus_v3_ = map.getRequired(2);
    let plutus_v3 =
      plutus_v3_ != undefined ? PlutusV3.fromCBOR(plutus_v3_) : undefined;
    let other_ = map.getRequired(3);
    let other = other_ != undefined ? Other.fromCBOR(other_) : undefined;

    return new Costmdls(plutus_v1, plutus_v2, plutus_v3, other);
  }

  toCBOR(writer: CBORWriter) {
    let entries = [];
    entries.push([0, this.plutus_v1]);
    entries.push([1, this.plutus_v2]);
    entries.push([2, this.plutus_v3]);
    entries.push([3, this.other]);
    writer.writeMap(entries);
  }
}

export class Map extends CBORMap<TransactionMetadatum, TransactionMetadatum> {
  static fromCBOR(value: CBORReaderValue): Map {
    let map = value.get("map");
    return new Map(
      map.map({
        key: (x) => TransactionMetadatum.fromCBOR(x),
        value: (x) => TransactionMetadatum.fromCBOR(x),
      }),
    );
  }
}

export class List extends Array<TransactionMetadatum> {
  static fromCBOR(value: CBORReaderValue): List {
    let array = value.get("array");
    return new List(...array.map((x) => TransactionMetadatum.fromCBOR(x)));
  }
}

export class Metadata extends CBORMap<
  TransactionMetadatumLabel,
  TransactionMetadatum
> {
  static fromCBOR(value: CBORReaderValue): Metadata {
    let map = value.get("map");
    return new Metadata(
      map.map({
        key: (x) => TransactionMetadatumLabel.fromCBOR(x),
        value: (x) => TransactionMetadatumLabel.fromCBOR(x),
      }),
    );
  }
}

export class Vkeywitness {
  private vkey: Vkey;
  private signature: Signature;

  constructor(vkey: Vkey, signature: Signature) {
    this.vkey = vkey;
    this.signature = signature;
  }

  get_vkey(): Vkey {
    return this.vkey;
  }

  set_vkey(vkey: Vkey): void {
    this.vkey = vkey;
  }

  get_signature(): Signature {
    return this.signature;
  }

  set_signature(signature: Signature): void {
    this.signature = signature;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): Vkeywitness {
    let vkey_ = array.shiftRequired();
    let vkey = Vkey.fromCBOR(vkey_);
    let signature_ = array.shiftRequired();
    let signature = Signature.fromCBOR(signature_);

    return new Vkeywitness(vkey, signature);
  }

  toArray() {
    let entries = [];
    entries.push(this.vkey);
    entries.push(this.signature);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): Vkeywitness {
    let array = value.get("array");
    return Vkeywitness.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class BootstrapWitness {
  private public_key: Vkey;
  private signature: Signature;
  private chain_code: Uint8Array;
  private attributes: Uint8Array;

  constructor(
    public_key: Vkey,
    signature: Signature,
    chain_code: Uint8Array,
    attributes: Uint8Array,
  ) {
    this.public_key = public_key;
    this.signature = signature;
    this.chain_code = chain_code;
    this.attributes = attributes;
  }

  get_public_key(): Vkey {
    return this.public_key;
  }

  set_public_key(public_key: Vkey): void {
    this.public_key = public_key;
  }

  get_signature(): Signature {
    return this.signature;
  }

  set_signature(signature: Signature): void {
    this.signature = signature;
  }

  get_chain_code(): Uint8Array {
    return this.chain_code;
  }

  set_chain_code(chain_code: Uint8Array): void {
    this.chain_code = chain_code;
  }

  get_attributes(): Uint8Array {
    return this.attributes;
  }

  set_attributes(attributes: Uint8Array): void {
    this.attributes = attributes;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): BootstrapWitness {
    let public_key_ = array.shiftRequired();
    let public_key = Vkey.fromCBOR(public_key_);
    let signature_ = array.shiftRequired();
    let signature = Signature.fromCBOR(signature_);
    let chain_code_ = array.shiftRequired();
    let chain_code = chain_code_.get("bstr");
    let attributes_ = array.shiftRequired();
    let attributes = attributes_.get("bstr");

    return new BootstrapWitness(public_key, signature, chain_code, attributes);
  }

  toArray() {
    let entries = [];
    entries.push(this.public_key);
    entries.push(this.signature);
    entries.push(this.chain_code);
    entries.push(this.attributes);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): BootstrapWitness {
    let array = value.get("array");
    return BootstrapWitness.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class ScriptPubkey {
  private addr_keyhash: AddrKeyhash;

  constructor(addr_keyhash: AddrKeyhash) {
    this.addr_keyhash = addr_keyhash;
  }

  get_addr_keyhash(): AddrKeyhash {
    return this.addr_keyhash;
  }

  set_addr_keyhash(addr_keyhash: AddrKeyhash): void {
    this.addr_keyhash = addr_keyhash;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): ScriptPubkey {
    let addr_keyhash_ = array.shiftRequired();
    let addr_keyhash = AddrKeyhash.fromCBOR(addr_keyhash_);

    return new ScriptPubkey(addr_keyhash);
  }

  toArray() {
    let entries = [];
    entries.push(this.addr_keyhash);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): ScriptPubkey {
    let array = value.get("array");
    return ScriptPubkey.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export enum NetworkIdKind {
  Mainnet = 0,
  Testnet = 1,
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

  static fromCBOR(value: CBORReaderValue): NetworkId {
    return value.with((value) => {
      let kind = Number(value.getInt());

      if (kind == 0) return new NetworkId(0);

      if (kind == 1) return new NetworkId(1);

      throw "Unrecognized enum value: " + kind + " for " + NetworkId;
    });
  }

  toCBOR(writer: CBORWriter) {
    writer.write(this.kind_);
  }
}

export class Hash {
  private hash: DatumHash;

  constructor(hash: DatumHash) {
    this.hash = hash;
  }

  get_hash(): DatumHash {
    return this.hash;
  }

  set_hash(hash: DatumHash): void {
    this.hash = hash;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): Hash {
    let hash_ = array.shiftRequired();
    let hash = DatumHash.fromCBOR(hash_);

    return new Hash(hash);
  }

  toArray() {
    let entries = [];
    entries.push(this.hash);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): Hash {
    let array = value.get("array");
    return Hash.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class Data {
  private data: Data;

  constructor(data: Data) {
    this.data = data;
  }

  get_data(): Data {
    return this.data;
  }

  set_data(data: Data): void {
    this.data = data;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): Data {
    let data_ = array.shiftRequired();
    let data = Data.fromCBOR(data_);

    return new Data(data);
  }

  toArray() {
    let entries = [];
    entries.push(this.data);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): Data {
    let array = value.get("array");
    return Data.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export enum DatumOptionKind {
  Hash = 0,
  Data = 1,
}

export type DatumOptionVariant =
  | { kind: 0; value: Hash }
  | { kind: 1; value: Data };

export class DatumOption {
  private variant: DatumOptionVariant;

  constructor(variant: DatumOptionVariant) {
    this.variant = variant;
  }

  static new_hash(hash: Hash): DatumOption {
    return new DatumOption({ kind: 0, value: hash });
  }

  static new_data(data: Data): DatumOption {
    return new DatumOption({ kind: 1, value: data });
  }

  as_hash(): Hash | undefined {
    if (this.variant.kind == 0) return this.variant.value;
  }

  as_data(): Data | undefined {
    if (this.variant.kind == 1) return this.variant.value;
  }

  static fromCBOR(value: CBORReaderValue): DatumOption {
    let array = value.get("array");
    let [tag, variant] = array.shiftRequired().with((tag_) => {
      let tag = Number(tag_.get("uint"));

      if (tag == 0) return [tag, Hash.fromArray(array)];

      if (tag == 1) return [tag, Data.fromArray(array)];

      throw "Unrecognized tag: " + tag + " for DatumOption";
    });

    return new DatumOption({ kind: tag, value: variant });
  }

  toCBOR(writer: CBORWriter) {
    let entries = [this.variant.kind, ...this.variant.value.toArray()];
    writer.writeArray(entries);
  }
}

export class NativeScript {
  private native_script: NativeScript;

  constructor(native_script: NativeScript) {
    this.native_script = native_script;
  }

  get_native_script(): NativeScript {
    return this.native_script;
  }

  set_native_script(native_script: NativeScript): void {
    this.native_script = native_script;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): NativeScript {
    let native_script_ = array.shiftRequired();
    let native_script = NativeScript.fromCBOR(native_script_);

    return new NativeScript(native_script);
  }

  toArray() {
    let entries = [];
    entries.push(this.native_script);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): NativeScript {
    let array = value.get("array");
    return NativeScript.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class PlutusV1Script {
  private plutus_v1_script: PlutusV1Script;

  constructor(plutus_v1_script: PlutusV1Script) {
    this.plutus_v1_script = plutus_v1_script;
  }

  get_plutus_v1_script(): PlutusV1Script {
    return this.plutus_v1_script;
  }

  set_plutus_v1_script(plutus_v1_script: PlutusV1Script): void {
    this.plutus_v1_script = plutus_v1_script;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): PlutusV1Script {
    let plutus_v1_script_ = array.shiftRequired();
    let plutus_v1_script = PlutusV1Script.fromCBOR(plutus_v1_script_);

    return new PlutusV1Script(plutus_v1_script);
  }

  toArray() {
    let entries = [];
    entries.push(this.plutus_v1_script);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): PlutusV1Script {
    let array = value.get("array");
    return PlutusV1Script.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class PlutusV2Script {
  private plutus_v2_script: PlutusV2Script;

  constructor(plutus_v2_script: PlutusV2Script) {
    this.plutus_v2_script = plutus_v2_script;
  }

  get_plutus_v2_script(): PlutusV2Script {
    return this.plutus_v2_script;
  }

  set_plutus_v2_script(plutus_v2_script: PlutusV2Script): void {
    this.plutus_v2_script = plutus_v2_script;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): PlutusV2Script {
    let plutus_v2_script_ = array.shiftRequired();
    let plutus_v2_script = PlutusV2Script.fromCBOR(plutus_v2_script_);

    return new PlutusV2Script(plutus_v2_script);
  }

  toArray() {
    let entries = [];
    entries.push(this.plutus_v2_script);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): PlutusV2Script {
    let array = value.get("array");
    return PlutusV2Script.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export class PlutusV3Script {
  private plutus_v3_script: PlutusV3Script;

  constructor(plutus_v3_script: PlutusV3Script) {
    this.plutus_v3_script = plutus_v3_script;
  }

  get_plutus_v3_script(): PlutusV3Script {
    return this.plutus_v3_script;
  }

  set_plutus_v3_script(plutus_v3_script: PlutusV3Script): void {
    this.plutus_v3_script = plutus_v3_script;
  }

  static fromArray(array: CBORArrayReader<CBORReaderValue>): PlutusV3Script {
    let plutus_v3_script_ = array.shiftRequired();
    let plutus_v3_script = PlutusV3Script.fromCBOR(plutus_v3_script_);

    return new PlutusV3Script(plutus_v3_script);
  }

  toArray() {
    let entries = [];
    entries.push(this.plutus_v3_script);
    return entries;
  }

  static fromCBOR(value: CBORReaderValue): PlutusV3Script {
    let array = value.get("array");
    return PlutusV3Script.fromArray(array);
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray(this.toArray());
  }
}

export enum ScriptKind {
  NativeScript = 0,
  PlutusV1Script = 1,
  PlutusV2Script = 2,
  PlutusV3Script = 3,
}

export type ScriptVariant =
  | { kind: 0; value: NativeScript }
  | { kind: 1; value: PlutusV1Script }
  | { kind: 2; value: PlutusV2Script }
  | { kind: 3; value: PlutusV3Script };

export class Script {
  private variant: ScriptVariant;

  constructor(variant: ScriptVariant) {
    this.variant = variant;
  }

  static new_native_script(native_script: NativeScript): Script {
    return new Script({ kind: 0, value: native_script });
  }

  static new_plutus_v1_script(plutus_v1_script: PlutusV1Script): Script {
    return new Script({ kind: 1, value: plutus_v1_script });
  }

  static new_plutus_v2_script(plutus_v2_script: PlutusV2Script): Script {
    return new Script({ kind: 2, value: plutus_v2_script });
  }

  static new_plutus_v3_script(plutus_v3_script: PlutusV3Script): Script {
    return new Script({ kind: 3, value: plutus_v3_script });
  }

  as_native_script(): NativeScript | undefined {
    if (this.variant.kind == 0) return this.variant.value;
  }

  as_plutus_v1_script(): PlutusV1Script | undefined {
    if (this.variant.kind == 1) return this.variant.value;
  }

  as_plutus_v2_script(): PlutusV2Script | undefined {
    if (this.variant.kind == 2) return this.variant.value;
  }

  as_plutus_v3_script(): PlutusV3Script | undefined {
    if (this.variant.kind == 3) return this.variant.value;
  }

  static fromCBOR(value: CBORReaderValue): Script {
    let array = value.get("array");
    let [tag, variant] = array.shiftRequired().with((tag_) => {
      let tag = Number(tag_.get("uint"));

      if (tag == 0) return [tag, NativeScript.fromArray(array)];

      if (tag == 1) return [tag, PlutusV1Script.fromArray(array)];

      if (tag == 2) return [tag, PlutusV2Script.fromArray(array)];

      if (tag == 3) return [tag, PlutusV3Script.fromArray(array)];

      throw "Unrecognized tag: " + tag + " for Script";
    });

    return new Script({ kind: tag, value: variant });
  }

  toCBOR(writer: CBORWriter) {
    let entries = [this.variant.kind, ...this.variant.value.toArray()];
    writer.writeArray(entries);
  }
}

export class VrfCert extends Array<Uint8Array> {
  static fromCBOR(value: CBORReaderValue): VrfCert {
    let array = value.get("array");
    return new VrfCert(...array.map((x) => x.get("bstr")));
  }
}
