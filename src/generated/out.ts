import { CBORReader } from "../cbor/reader";
import { CBORWriter } from "../cbor/writer";
import { hexToBytes, bytesToHex } from "../hex";
import { arrayEq } from "../eq";

export class Block {
  private header: Header;
  private transaction_bodies: TransactionBodies;
  private transaction_witness_sets: TransactionWitnessSets;
  private auxiliary_data_set: AuxiliaryDataSet;
  private invalid_transactions: Uint32Array;

  constructor(
    header: Header,
    transaction_bodies: TransactionBodies,
    transaction_witness_sets: TransactionWitnessSets,
    auxiliary_data_set: AuxiliaryDataSet,
    invalid_transactions: Uint32Array,
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

  get_invalid_transactions(): Uint32Array {
    return this.invalid_transactions;
  }

  set_invalid_transactions(invalid_transactions: Uint32Array): void {
    this.invalid_transactions = invalid_transactions;
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

    this.header.serialize(writer);
    this.transaction_bodies.serialize(writer);
    this.transaction_witness_sets.serialize(writer);
    this.auxiliary_data_set.serialize(writer);
    writer.writeArray(this.invalid_transactions, (writer, x) =>
      writer.writeInt(BigInt(x)),
    );
  }
}

export class TransactionBodies {
  private items: TransactionBody[];

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

  serialize(writer: CBORWriter) {
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }
}

export class TransactionWitnessSets {
  private items: TransactionWitnessSet[];

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

  serialize(writer: CBORWriter) {
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }
}

export class AuxiliaryDataSet {
  private items: [number, AuxiliaryData][];

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

  constructor(items: [number, AuxiliaryData][]) {
    this.items = items;
  }

  static new(): AuxiliaryDataSet {
    return new AuxiliaryDataSet([]);
  }

  len(): number {
    return this.items.length;
  }

  insert(key: number, value: AuxiliaryData): void {
    let entry = this.items.find((x) => key === x[0]);
    if (entry != null) entry[1] = value;
    else this.items.push([key, value]);
  }

  get(key: number): AuxiliaryData | undefined {
    let entry = this.items.find((x) => key === x[0]);
    if (entry == null) return undefined;
    return entry[1];
  }

  static deserialize(reader: CBORReader): AuxiliaryDataSet {
    let ret = new AuxiliaryDataSet([]);
    reader.readMap((reader) =>
      ret.insert(Number(reader.readInt()), AuxiliaryData.deserialize(reader)),
    );
    return ret;
  }

  serialize(writer: CBORWriter) {
    writer.writeMap(this.items, (writer, x) => {
      writer.writeInt(BigInt(x[0]));
      x[1].serialize(writer);
    });
  }
}

export class Transaction {
  private body: TransactionBody;
  private witness_set: TransactionWitnessSet;
  private is_valid: boolean;
  private auxiliary_data: AuxiliaryData | undefined;

  constructor(
    body: TransactionBody,
    witness_set: TransactionWitnessSet,
    is_valid: boolean,
    auxiliary_data: AuxiliaryData | undefined,
  ) {
    this.body = body;
    this.witness_set = witness_set;
    this.is_valid = is_valid;
    this.auxiliary_data = auxiliary_data;
  }

  get_body(): TransactionBody {
    return this.body;
  }

  set_body(body: TransactionBody): void {
    this.body = body;
  }

  get_witness_set(): TransactionWitnessSet {
    return this.witness_set;
  }

  set_witness_set(witness_set: TransactionWitnessSet): void {
    this.witness_set = witness_set;
  }

  get_is_valid(): boolean {
    return this.is_valid;
  }

  set_is_valid(is_valid: boolean): void {
    this.is_valid = is_valid;
  }

  get_auxiliary_data(): AuxiliaryData | undefined {
    return this.auxiliary_data;
  }

  set_auxiliary_data(auxiliary_data: AuxiliaryData | undefined): void {
    this.auxiliary_data = auxiliary_data;
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

    this.body.serialize(writer);
    this.witness_set.serialize(writer);
    writer.writeBoolean(this.is_valid);
    if (this.auxiliary_data == null) {
      writer.writeNull();
    } else {
      this.auxiliary_data.serialize(writer);
    }
  }
}

export class Header {
  private header_body: HeaderBody;
  private body_signature: unknown;

  constructor(header_body: HeaderBody, body_signature: unknown) {
    this.header_body = header_body;
    this.body_signature = body_signature;
  }

  get_header_body(): HeaderBody {
    return this.header_body;
  }

  set_header_body(header_body: HeaderBody): void {
    this.header_body = header_body;
  }

  get_body_signature(): unknown {
    return this.body_signature;
  }

  set_body_signature(body_signature: unknown): void {
    this.body_signature = body_signature;
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

  static deserialize(reader: CBORReader): Header {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let header_body = HeaderBody.deserialize(reader);

    let body_signature = $$CANT_READ("KESSignature");

    return new Header(header_body, body_signature);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    this.header_body.serialize(writer);
    $$CANT_WRITE("KESSignature");
  }
}

export class HeaderBody {
  private block_number: number;
  private slot: bigint;
  private prev_hash: unknown | undefined;
  private issuer_vkey: unknown;
  private vrf_vkey: unknown;
  private vrf_result: unknown;
  private block_body_size: number;
  private block_body_hash: unknown;
  private operational_cert: OperationalCert;
  private protocol_version: ProtocolVersion;

  constructor(
    block_number: number,
    slot: bigint,
    prev_hash: unknown | undefined,
    issuer_vkey: unknown,
    vrf_vkey: unknown,
    vrf_result: unknown,
    block_body_size: number,
    block_body_hash: unknown,
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

  get_slot(): bigint {
    return this.slot;
  }

  set_slot(slot: bigint): void {
    this.slot = slot;
  }

  get_prev_hash(): unknown | undefined {
    return this.prev_hash;
  }

  set_prev_hash(prev_hash: unknown | undefined): void {
    this.prev_hash = prev_hash;
  }

  get_issuer_vkey(): unknown {
    return this.issuer_vkey;
  }

  set_issuer_vkey(issuer_vkey: unknown): void {
    this.issuer_vkey = issuer_vkey;
  }

  get_vrf_vkey(): unknown {
    return this.vrf_vkey;
  }

  set_vrf_vkey(vrf_vkey: unknown): void {
    this.vrf_vkey = vrf_vkey;
  }

  get_vrf_result(): unknown {
    return this.vrf_result;
  }

  set_vrf_result(vrf_result: unknown): void {
    this.vrf_result = vrf_result;
  }

  get_block_body_size(): number {
    return this.block_body_size;
  }

  set_block_body_size(block_body_size: number): void {
    this.block_body_size = block_body_size;
  }

  get_block_body_hash(): unknown {
    return this.block_body_hash;
  }

  set_block_body_hash(block_body_hash: unknown): void {
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

  static deserialize(reader: CBORReader): HeaderBody {
    let len = reader.readArrayTag();

    if (len != null && len < 10) {
      throw new Error(
        "Insufficient number of fields in record. Expected 10. Received " + len,
      );
    }

    let block_number = Number(reader.readInt());

    let slot = reader.readInt();

    let prev_hash =
      reader.readNullable((r) => $$CANT_READ("BlockHash")) ?? undefined;

    let issuer_vkey = $$CANT_READ("Vkey");

    let vrf_vkey = $$CANT_READ("VRFVKey");

    let vrf_result = $$CANT_READ("VRFCert");

    let block_body_size = Number(reader.readInt());

    let block_body_hash = $$CANT_READ("BlockHash");

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

    writer.writeInt(BigInt(this.block_number));
    writer.writeInt(this.slot);
    if (this.prev_hash == null) {
      writer.writeNull();
    } else {
      $$CANT_WRITE("BlockHash");
    }
    $$CANT_WRITE("Vkey");
    $$CANT_WRITE("VRFVKey");
    $$CANT_WRITE("VRFCert");
    writer.writeInt(BigInt(this.block_body_size));
    $$CANT_WRITE("BlockHash");
    this.operational_cert.serialize(writer);
    this.protocol_version.serialize(writer);
  }
}

export class OperationalCert {
  private hot_vkey: unknown;
  private sequence_number: number;
  private kes_period: number;
  private sigma: unknown;

  constructor(
    hot_vkey: unknown,
    sequence_number: number,
    kes_period: number,
    sigma: unknown,
  ) {
    this.hot_vkey = hot_vkey;
    this.sequence_number = sequence_number;
    this.kes_period = kes_period;
    this.sigma = sigma;
  }

  get_hot_vkey(): unknown {
    return this.hot_vkey;
  }

  set_hot_vkey(hot_vkey: unknown): void {
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

  get_sigma(): unknown {
    return this.sigma;
  }

  set_sigma(sigma: unknown): void {
    this.sigma = sigma;
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

  static deserialize(reader: CBORReader): OperationalCert {
    let len = reader.readArrayTag();

    if (len != null && len < 4) {
      throw new Error(
        "Insufficient number of fields in record. Expected 4. Received " + len,
      );
    }

    let hot_vkey = $$CANT_READ("KESVKey");

    let sequence_number = Number(reader.readInt());

    let kes_period = Number(reader.readInt());

    let sigma = $$CANT_READ("Ed25519Signature");

    return new OperationalCert(hot_vkey, sequence_number, kes_period, sigma);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(4);

    $$CANT_WRITE("KESVKey");
    writer.writeInt(BigInt(this.sequence_number));
    writer.writeInt(BigInt(this.kes_period));
    $$CANT_WRITE("Ed25519Signature");
  }
}

export class ProtocolVersion {
  private major: number;
  private minor: number;

  constructor(major: number, minor: number) {
    this.major = major;
    this.minor = minor;
  }

  get_major(): number {
    return this.major;
  }

  set_major(major: number): void {
    this.major = major;
  }

  get_minor(): number {
    return this.minor;
  }

  set_minor(minor: number): void {
    this.minor = minor;
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

    writer.writeInt(BigInt(this.major));
    writer.writeInt(BigInt(this.minor));
  }
}

export class TransactionBody {
  private inputs: TransactionInputs;
  private outputs: TransactionOutputs;
  private fee: bigint;
  private ttl: bigint | undefined;
  private certs: Certificates | undefined;
  private withdrawals: Withdrawals | undefined;
  private auxiliary_data_hash: unknown | undefined;
  private validity_start_interval: bigint | undefined;
  private mint: unknown | undefined;
  private script_data_hash: unknown | undefined;
  private collateral: TransactionInputs | undefined;
  private required_signers: Ed25519KeyHashes | undefined;
  private network_id: NetworkId | undefined;
  private collateral_return: TransactionOutput | undefined;
  private total_collateral: bigint | undefined;
  private reference_inputs: TransactionInputs | undefined;
  private voting_procedures: unknown | undefined;
  private voting_proposals: VotingProposals | undefined;
  private current_treasury_value: bigint | undefined;
  private donation: bigint | undefined;

  constructor(
    inputs: TransactionInputs,
    outputs: TransactionOutputs,
    fee: bigint,
    ttl: bigint | undefined,
    certs: Certificates | undefined,
    withdrawals: Withdrawals | undefined,
    auxiliary_data_hash: unknown | undefined,
    validity_start_interval: bigint | undefined,
    mint: unknown | undefined,
    script_data_hash: unknown | undefined,
    collateral: TransactionInputs | undefined,
    required_signers: Ed25519KeyHashes | undefined,
    network_id: NetworkId | undefined,
    collateral_return: TransactionOutput | undefined,
    total_collateral: bigint | undefined,
    reference_inputs: TransactionInputs | undefined,
    voting_procedures: unknown | undefined,
    voting_proposals: VotingProposals | undefined,
    current_treasury_value: bigint | undefined,
    donation: bigint | undefined,
  ) {
    this.inputs = inputs;
    this.outputs = outputs;
    this.fee = fee;
    this.ttl = ttl;
    this.certs = certs;
    this.withdrawals = withdrawals;
    this.auxiliary_data_hash = auxiliary_data_hash;
    this.validity_start_interval = validity_start_interval;
    this.mint = mint;
    this.script_data_hash = script_data_hash;
    this.collateral = collateral;
    this.required_signers = required_signers;
    this.network_id = network_id;
    this.collateral_return = collateral_return;
    this.total_collateral = total_collateral;
    this.reference_inputs = reference_inputs;
    this.voting_procedures = voting_procedures;
    this.voting_proposals = voting_proposals;
    this.current_treasury_value = current_treasury_value;
    this.donation = donation;
  }

  get_inputs(): TransactionInputs {
    return this.inputs;
  }

  set_inputs(inputs: TransactionInputs): void {
    this.inputs = inputs;
  }

  get_outputs(): TransactionOutputs {
    return this.outputs;
  }

  set_outputs(outputs: TransactionOutputs): void {
    this.outputs = outputs;
  }

  get_fee(): bigint {
    return this.fee;
  }

  set_fee(fee: bigint): void {
    this.fee = fee;
  }

  get_ttl(): bigint | undefined {
    return this.ttl;
  }

  set_ttl(ttl: bigint | undefined): void {
    this.ttl = ttl;
  }

  get_certs(): Certificates | undefined {
    return this.certs;
  }

  set_certs(certs: Certificates | undefined): void {
    this.certs = certs;
  }

  get_withdrawals(): Withdrawals | undefined {
    return this.withdrawals;
  }

  set_withdrawals(withdrawals: Withdrawals | undefined): void {
    this.withdrawals = withdrawals;
  }

  get_auxiliary_data_hash(): unknown | undefined {
    return this.auxiliary_data_hash;
  }

  set_auxiliary_data_hash(auxiliary_data_hash: unknown | undefined): void {
    this.auxiliary_data_hash = auxiliary_data_hash;
  }

  get_validity_start_interval(): bigint | undefined {
    return this.validity_start_interval;
  }

  set_validity_start_interval(
    validity_start_interval: bigint | undefined,
  ): void {
    this.validity_start_interval = validity_start_interval;
  }

  get_mint(): unknown | undefined {
    return this.mint;
  }

  set_mint(mint: unknown | undefined): void {
    this.mint = mint;
  }

  get_script_data_hash(): unknown | undefined {
    return this.script_data_hash;
  }

  set_script_data_hash(script_data_hash: unknown | undefined): void {
    this.script_data_hash = script_data_hash;
  }

  get_collateral(): TransactionInputs | undefined {
    return this.collateral;
  }

  set_collateral(collateral: TransactionInputs | undefined): void {
    this.collateral = collateral;
  }

  get_required_signers(): Ed25519KeyHashes | undefined {
    return this.required_signers;
  }

  set_required_signers(required_signers: Ed25519KeyHashes | undefined): void {
    this.required_signers = required_signers;
  }

  get_network_id(): NetworkId | undefined {
    return this.network_id;
  }

  set_network_id(network_id: NetworkId | undefined): void {
    this.network_id = network_id;
  }

  get_collateral_return(): TransactionOutput | undefined {
    return this.collateral_return;
  }

  set_collateral_return(
    collateral_return: TransactionOutput | undefined,
  ): void {
    this.collateral_return = collateral_return;
  }

  get_total_collateral(): bigint | undefined {
    return this.total_collateral;
  }

  set_total_collateral(total_collateral: bigint | undefined): void {
    this.total_collateral = total_collateral;
  }

  get_reference_inputs(): TransactionInputs | undefined {
    return this.reference_inputs;
  }

  set_reference_inputs(reference_inputs: TransactionInputs | undefined): void {
    this.reference_inputs = reference_inputs;
  }

  get_voting_procedures(): unknown | undefined {
    return this.voting_procedures;
  }

  set_voting_procedures(voting_procedures: unknown | undefined): void {
    this.voting_procedures = voting_procedures;
  }

  get_voting_proposals(): VotingProposals | undefined {
    return this.voting_proposals;
  }

  set_voting_proposals(voting_proposals: VotingProposals | undefined): void {
    this.voting_proposals = voting_proposals;
  }

  get_current_treasury_value(): bigint | undefined {
    return this.current_treasury_value;
  }

  set_current_treasury_value(current_treasury_value: bigint | undefined): void {
    this.current_treasury_value = current_treasury_value;
  }

  get_donation(): bigint | undefined {
    return this.donation;
  }

  set_donation(donation: bigint | undefined): void {
    this.donation = donation;
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
          fields.fee = r.readInt();
          break;

        case 3:
          fields.ttl = r.readInt();
          break;

        case 4:
          fields.certs = Certificates.deserialize(r);
          break;

        case 5:
          fields.withdrawals = Withdrawals.deserialize(r);
          break;

        case 7:
          fields.auxiliary_data_hash = $$CANT_READ("AuxiliaryDataHash");
          break;

        case 8:
          fields.validity_start_interval = r.readInt();
          break;

        case 9:
          fields.mint = $$CANT_READ("Mint");
          break;

        case 11:
          fields.script_data_hash = $$CANT_READ("ScriptDataHash");
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
          fields.total_collateral = r.readInt();
          break;

        case 18:
          fields.reference_inputs = TransactionInputs.deserialize(r);
          break;

        case 19:
          fields.voting_procedures = $$CANT_READ("VotingProcedures");
          break;

        case 20:
          fields.voting_proposals = VotingProposals.deserialize(r);
          break;

        case 21:
          fields.current_treasury_value = r.readInt();
          break;

        case 22:
          fields.donation = r.readInt();
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

  serialize(writer: CBORWriter) {
    let len = 20;
    if (this.ttl === undefined) len -= 1;
    if (this.certs === undefined) len -= 1;
    if (this.withdrawals === undefined) len -= 1;
    if (this.auxiliary_data_hash === undefined) len -= 1;
    if (this.validity_start_interval === undefined) len -= 1;
    if (this.mint === undefined) len -= 1;
    if (this.script_data_hash === undefined) len -= 1;
    if (this.collateral === undefined) len -= 1;
    if (this.required_signers === undefined) len -= 1;
    if (this.network_id === undefined) len -= 1;
    if (this.collateral_return === undefined) len -= 1;
    if (this.total_collateral === undefined) len -= 1;
    if (this.reference_inputs === undefined) len -= 1;
    if (this.voting_procedures === undefined) len -= 1;
    if (this.voting_proposals === undefined) len -= 1;
    if (this.current_treasury_value === undefined) len -= 1;
    if (this.donation === undefined) len -= 1;
    writer.writeMapTag(len);

    writer.writeInt(0n);
    this.inputs.serialize(writer);

    writer.writeInt(1n);
    this.outputs.serialize(writer);

    writer.writeInt(2n);
    writer.writeInt(this.fee);

    if (this.ttl !== undefined) {
      writer.writeInt(3n);
      writer.writeInt(this.ttl);
    }
    if (this.certs !== undefined) {
      writer.writeInt(4n);
      this.certs.serialize(writer);
    }
    if (this.withdrawals !== undefined) {
      writer.writeInt(5n);
      this.withdrawals.serialize(writer);
    }
    if (this.auxiliary_data_hash !== undefined) {
      writer.writeInt(7n);
      $$CANT_WRITE("AuxiliaryDataHash");
    }
    if (this.validity_start_interval !== undefined) {
      writer.writeInt(8n);
      writer.writeInt(this.validity_start_interval);
    }
    if (this.mint !== undefined) {
      writer.writeInt(9n);
      $$CANT_WRITE("Mint");
    }
    if (this.script_data_hash !== undefined) {
      writer.writeInt(11n);
      $$CANT_WRITE("ScriptDataHash");
    }
    if (this.collateral !== undefined) {
      writer.writeInt(13n);
      this.collateral.serialize(writer);
    }
    if (this.required_signers !== undefined) {
      writer.writeInt(14n);
      this.required_signers.serialize(writer);
    }
    if (this.network_id !== undefined) {
      writer.writeInt(15n);
      this.network_id.serialize(writer);
    }
    if (this.collateral_return !== undefined) {
      writer.writeInt(16n);
      this.collateral_return.serialize(writer);
    }
    if (this.total_collateral !== undefined) {
      writer.writeInt(17n);
      writer.writeInt(this.total_collateral);
    }
    if (this.reference_inputs !== undefined) {
      writer.writeInt(18n);
      this.reference_inputs.serialize(writer);
    }
    if (this.voting_procedures !== undefined) {
      writer.writeInt(19n);
      $$CANT_WRITE("VotingProcedures");
    }
    if (this.voting_proposals !== undefined) {
      writer.writeInt(20n);
      this.voting_proposals.serialize(writer);
    }
    if (this.current_treasury_value !== undefined) {
      writer.writeInt(21n);
      writer.writeInt(this.current_treasury_value);
    }
    if (this.donation !== undefined) {
      writer.writeInt(22n);
      writer.writeInt(this.donation);
    }
  }
}

export class TransactionInputs {
  private items: TransactionInput[];

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

  serialize(writer: CBORWriter) {
    writer.writeTaggedTag(258);
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }
}

export class TransactionOutputs {
  private items: TransactionOutput[];

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

  serialize(writer: CBORWriter) {
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }
}

export class Certificates {
  private items: Certificate[];

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

  serialize(writer: CBORWriter) {
    writer.writeTaggedTag(258);
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }
}

export class Ed25519KeyHashes {
  private items: unknown[];

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

  constructor() {
    this.items = [];
  }

  static new(): Ed25519KeyHashes {
    return new Ed25519KeyHashes();
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
      if ($$CANT_EQ("Ed25519KeyHash")) {
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
    reader.readArray((reader) => ret.add($$CANT_READ("Ed25519KeyHash")));
    return ret;
  }

  serialize(writer: CBORWriter) {
    writer.writeTaggedTag(258);
    writer.writeArray(this.items, (writer, x) =>
      $$CANT_WRITE("Ed25519KeyHash"),
    );
  }
}

export class VotingProcedure {
  private vote: VoteKind;
  private anchor: Anchor | undefined;

  constructor(vote: VoteKind, anchor: Anchor | undefined) {
    this.vote = vote;
    this.anchor = anchor;
  }

  get_vote(): VoteKind {
    return this.vote;
  }

  set_vote(vote: VoteKind): void {
    this.vote = vote;
  }

  get_anchor(): Anchor | undefined {
    return this.anchor;
  }

  set_anchor(anchor: Anchor | undefined): void {
    this.anchor = anchor;
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

    serializeVoteKind(writer, this.vote);
    if (this.anchor == null) {
      writer.writeNull();
    } else {
      this.anchor.serialize(writer);
    }
  }
}

export class VotingProposal {
  private deposit: bigint;
  private reward_account: unknown;
  private governance_action: GovernanceAction;
  private anchor: Anchor;

  constructor(
    deposit: bigint,
    reward_account: unknown,
    governance_action: GovernanceAction,
    anchor: Anchor,
  ) {
    this.deposit = deposit;
    this.reward_account = reward_account;
    this.governance_action = governance_action;
    this.anchor = anchor;
  }

  get_deposit(): bigint {
    return this.deposit;
  }

  set_deposit(deposit: bigint): void {
    this.deposit = deposit;
  }

  get_reward_account(): unknown {
    return this.reward_account;
  }

  set_reward_account(reward_account: unknown): void {
    this.reward_account = reward_account;
  }

  get_governance_action(): GovernanceAction {
    return this.governance_action;
  }

  set_governance_action(governance_action: GovernanceAction): void {
    this.governance_action = governance_action;
  }

  get_anchor(): Anchor {
    return this.anchor;
  }

  set_anchor(anchor: Anchor): void {
    this.anchor = anchor;
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

  static deserialize(reader: CBORReader): VotingProposal {
    let len = reader.readArrayTag();

    if (len != null && len < 4) {
      throw new Error(
        "Insufficient number of fields in record. Expected 4. Received " + len,
      );
    }

    let deposit = reader.readInt();

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

    writer.writeInt(this.deposit);
    $$CANT_WRITE("RewardAddress");
    this.governance_action.serialize(writer);
    this.anchor.serialize(writer);
  }
}

export class VotingProposals {
  private items: VotingProposal[];

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

  serialize(writer: CBORWriter) {
    writer.writeTaggedTag(258);
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }
}

export class certificates {
  private items: Certificate[];

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

  serialize(writer: CBORWriter) {
    writer.writeTaggedTag(258);
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
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
        if (len != null && len - 1 != 4) {
          throw new Error("Expected 4 items to decode UpdateCommitteeAction");
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
}

export class ParameterChangeAction {
  private gov_action_id: GovernanceActionId | undefined;
  private protocol_param_updates: ProtocolParamUpdate;
  private policy_hash: unknown | undefined;

  constructor(
    gov_action_id: GovernanceActionId | undefined,
    protocol_param_updates: ProtocolParamUpdate,
    policy_hash: unknown | undefined,
  ) {
    this.gov_action_id = gov_action_id;
    this.protocol_param_updates = protocol_param_updates;
    this.policy_hash = policy_hash;
  }

  get_gov_action_id(): GovernanceActionId | undefined {
    return this.gov_action_id;
  }

  set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void {
    this.gov_action_id = gov_action_id;
  }

  get_protocol_param_updates(): ProtocolParamUpdate {
    return this.protocol_param_updates;
  }

  set_protocol_param_updates(
    protocol_param_updates: ProtocolParamUpdate,
  ): void {
    this.protocol_param_updates = protocol_param_updates;
  }

  get_policy_hash(): unknown | undefined {
    return this.policy_hash;
  }

  set_policy_hash(policy_hash: unknown | undefined): void {
    this.policy_hash = policy_hash;
  }

  static deserialize(reader: CBORReader): ParameterChangeAction {
    let gov_action_id =
      reader.readNullable((r) => GovernanceActionId.deserialize(r)) ??
      undefined;

    let protocol_param_updates = ProtocolParamUpdate.deserialize(reader);

    let policy_hash =
      reader.readNullable((r) => $$CANT_READ("ScriptHash")) ?? undefined;

    return new ParameterChangeAction(
      gov_action_id,
      protocol_param_updates,
      policy_hash,
    );
  }

  serialize(writer: CBORWriter): void {
    if (this.gov_action_id == null) {
      writer.writeNull();
    } else {
      this.gov_action_id.serialize(writer);
    }
    this.protocol_param_updates.serialize(writer);
    if (this.policy_hash == null) {
      writer.writeNull();
    } else {
      $$CANT_WRITE("ScriptHash");
    }
  }
}

export class HardForkInitiationAction {
  private gov_action_id: GovernanceActionId | undefined;
  private protocol_version: ProtocolVersion;

  constructor(
    gov_action_id: GovernanceActionId | undefined,
    protocol_version: ProtocolVersion,
  ) {
    this.gov_action_id = gov_action_id;
    this.protocol_version = protocol_version;
  }

  get_gov_action_id(): GovernanceActionId | undefined {
    return this.gov_action_id;
  }

  set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void {
    this.gov_action_id = gov_action_id;
  }

  get_protocol_version(): ProtocolVersion {
    return this.protocol_version;
  }

  set_protocol_version(protocol_version: ProtocolVersion): void {
    this.protocol_version = protocol_version;
  }

  static deserialize(reader: CBORReader): HardForkInitiationAction {
    let gov_action_id =
      reader.readNullable((r) => GovernanceActionId.deserialize(r)) ??
      undefined;

    let protocol_version = ProtocolVersion.deserialize(reader);

    return new HardForkInitiationAction(gov_action_id, protocol_version);
  }

  serialize(writer: CBORWriter): void {
    if (this.gov_action_id == null) {
      writer.writeNull();
    } else {
      this.gov_action_id.serialize(writer);
    }
    this.protocol_version.serialize(writer);
  }
}

export class TreasuryWithdrawalsAction {
  private withdrawals: unknown;
  private policy_hash: unknown | undefined;

  constructor(withdrawals: unknown, policy_hash: unknown | undefined) {
    this.withdrawals = withdrawals;
    this.policy_hash = policy_hash;
  }

  get_withdrawals(): unknown {
    return this.withdrawals;
  }

  set_withdrawals(withdrawals: unknown): void {
    this.withdrawals = withdrawals;
  }

  get_policy_hash(): unknown | undefined {
    return this.policy_hash;
  }

  set_policy_hash(policy_hash: unknown | undefined): void {
    this.policy_hash = policy_hash;
  }

  static deserialize(reader: CBORReader): TreasuryWithdrawalsAction {
    let withdrawals = $$CANT_READ("TreasuryWithdrawals");

    let policy_hash =
      reader.readNullable((r) => $$CANT_READ("ScriptHash")) ?? undefined;

    return new TreasuryWithdrawalsAction(withdrawals, policy_hash);
  }

  serialize(writer: CBORWriter): void {
    $$CANT_WRITE("TreasuryWithdrawals");
    if (this.policy_hash == null) {
      writer.writeNull();
    } else {
      $$CANT_WRITE("ScriptHash");
    }
  }
}

export class NoConfidenceAction {
  private gov_action_id: GovernanceActionId | undefined;

  constructor(gov_action_id: GovernanceActionId | undefined) {
    this.gov_action_id = gov_action_id;
  }

  get_gov_action_id(): GovernanceActionId | undefined {
    return this.gov_action_id;
  }

  set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void {
    this.gov_action_id = gov_action_id;
  }

  static deserialize(reader: CBORReader): NoConfidenceAction {
    let gov_action_id =
      reader.readNullable((r) => GovernanceActionId.deserialize(r)) ??
      undefined;

    return new NoConfidenceAction(gov_action_id);
  }

  serialize(writer: CBORWriter): void {
    if (this.gov_action_id == null) {
      writer.writeNull();
    } else {
      this.gov_action_id.serialize(writer);
    }
  }
}

export class UpdateCommitteeAction {
  private gov_action_id: GovernanceActionId | undefined;
  private members_to_remove: Credentials;
  private committee: unknown;
  private quorom_threshold: UnitInterval;

  constructor(
    gov_action_id: GovernanceActionId | undefined,
    members_to_remove: Credentials,
    committee: unknown,
    quorom_threshold: UnitInterval,
  ) {
    this.gov_action_id = gov_action_id;
    this.members_to_remove = members_to_remove;
    this.committee = committee;
    this.quorom_threshold = quorom_threshold;
  }

  get_gov_action_id(): GovernanceActionId | undefined {
    return this.gov_action_id;
  }

  set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void {
    this.gov_action_id = gov_action_id;
  }

  get_members_to_remove(): Credentials {
    return this.members_to_remove;
  }

  set_members_to_remove(members_to_remove: Credentials): void {
    this.members_to_remove = members_to_remove;
  }

  get_committee(): unknown {
    return this.committee;
  }

  set_committee(committee: unknown): void {
    this.committee = committee;
  }

  get_quorom_threshold(): UnitInterval {
    return this.quorom_threshold;
  }

  set_quorom_threshold(quorom_threshold: UnitInterval): void {
    this.quorom_threshold = quorom_threshold;
  }

  static deserialize(reader: CBORReader): UpdateCommitteeAction {
    let gov_action_id =
      reader.readNullable((r) => GovernanceActionId.deserialize(r)) ??
      undefined;

    let members_to_remove = Credentials.deserialize(reader);

    let committee = $$CANT_READ("Committee");

    let quorom_threshold = UnitInterval.deserialize(reader);

    return new UpdateCommitteeAction(
      gov_action_id,
      members_to_remove,
      committee,
      quorom_threshold,
    );
  }

  serialize(writer: CBORWriter): void {
    if (this.gov_action_id == null) {
      writer.writeNull();
    } else {
      this.gov_action_id.serialize(writer);
    }
    this.members_to_remove.serialize(writer);
    $$CANT_WRITE("Committee");
    this.quorom_threshold.serialize(writer);
  }
}

export class NewConstitutionAction {
  private gov_action_id: GovernanceActionId | undefined;
  private constitution: Constitution;

  constructor(
    gov_action_id: GovernanceActionId | undefined,
    constitution: Constitution,
  ) {
    this.gov_action_id = gov_action_id;
    this.constitution = constitution;
  }

  get_gov_action_id(): GovernanceActionId | undefined {
    return this.gov_action_id;
  }

  set_gov_action_id(gov_action_id: GovernanceActionId | undefined): void {
    this.gov_action_id = gov_action_id;
  }

  get_constitution(): Constitution {
    return this.constitution;
  }

  set_constitution(constitution: Constitution): void {
    this.constitution = constitution;
  }

  static deserialize(reader: CBORReader): NewConstitutionAction {
    let gov_action_id =
      reader.readNullable((r) => GovernanceActionId.deserialize(r)) ??
      undefined;

    let constitution = Constitution.deserialize(reader);

    return new NewConstitutionAction(gov_action_id, constitution);
  }

  serialize(writer: CBORWriter): void {
    if (this.gov_action_id == null) {
      writer.writeNull();
    } else {
      this.gov_action_id.serialize(writer);
    }
    this.constitution.serialize(writer);
  }
}

export class InfoAction {
  constructor() {}

  static deserialize(reader: CBORReader): InfoAction {
    return new InfoAction();
  }

  serialize(writer: CBORWriter): void {}
}

export class Credentials {
  private items: Credential[];

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

  serialize(writer: CBORWriter) {
    writer.writeTaggedTag(258);
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }
}

export class Constitution {
  private anchor: Anchor;
  private scripthash: unknown | undefined;

  constructor(anchor: Anchor, scripthash: unknown | undefined) {
    this.anchor = anchor;
    this.scripthash = scripthash;
  }

  get_anchor(): Anchor {
    return this.anchor;
  }

  set_anchor(anchor: Anchor): void {
    this.anchor = anchor;
  }

  get_scripthash(): unknown | undefined {
    return this.scripthash;
  }

  set_scripthash(scripthash: unknown | undefined): void {
    this.scripthash = scripthash;
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

  static deserialize(reader: CBORReader): Constitution {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let anchor = Anchor.deserialize(reader);

    let scripthash =
      reader.readNullable((r) => $$CANT_READ("ScriptHash")) ?? undefined;

    return new Constitution(anchor, scripthash);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    this.anchor.serialize(writer);
    if (this.scripthash == null) {
      writer.writeNull();
    } else {
      $$CANT_WRITE("ScriptHash");
    }
  }
}

export class Voter {
  private constitutional_committee_hot_key: Credential;
  private drep: Credential;
  private staking_pool: unknown;

  constructor(
    constitutional_committee_hot_key: Credential,
    drep: Credential,
    staking_pool: unknown,
  ) {
    this.constitutional_committee_hot_key = constitutional_committee_hot_key;
    this.drep = drep;
    this.staking_pool = staking_pool;
  }

  get_constitutional_committee_hot_key(): Credential {
    return this.constitutional_committee_hot_key;
  }

  set_constitutional_committee_hot_key(
    constitutional_committee_hot_key: Credential,
  ): void {
    this.constitutional_committee_hot_key = constitutional_committee_hot_key;
  }

  get_drep(): Credential {
    return this.drep;
  }

  set_drep(drep: Credential): void {
    this.drep = drep;
  }

  get_staking_pool(): unknown {
    return this.staking_pool;
  }

  set_staking_pool(staking_pool: unknown): void {
    this.staking_pool = staking_pool;
  }

  // no-op
  free(): void {}

  static from_bytes(data: Uint8Array): Voter {
    let reader = new CBORReader(data);
    return Voter.deserialize(reader);
  }

  static from_hex(hex_str: string): Voter {
    return Voter.from_bytes(hexToBytes(hex_str));
  }

  to_bytes(): Uint8Array {
    let writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  static deserialize(reader: CBORReader): Voter {
    let len = reader.readArrayTag();

    if (len != null && len < 3) {
      throw new Error(
        "Insufficient number of fields in record. Expected 3. Received " + len,
      );
    }

    let constitutional_committee_hot_key = Credential.deserialize(reader);

    let drep = Credential.deserialize(reader);

    let staking_pool = $$CANT_READ("Ed25519KeyHash");

    return new Voter(constitutional_committee_hot_key, drep, staking_pool);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(3);

    this.constitutional_committee_hot_key.serialize(writer);
    this.drep.serialize(writer);
    $$CANT_WRITE("Ed25519KeyHash");
  }
}

export class Anchor {
  private url: URL;
  private anchor_data_hash: unknown;

  constructor(url: URL, anchor_data_hash: unknown) {
    this.url = url;
    this.anchor_data_hash = anchor_data_hash;
  }

  get_url(): URL {
    return this.url;
  }

  set_url(url: URL): void {
    this.url = url;
  }

  get_anchor_data_hash(): unknown {
    return this.anchor_data_hash;
  }

  set_anchor_data_hash(anchor_data_hash: unknown): void {
    this.anchor_data_hash = anchor_data_hash;
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

  static deserialize(reader: CBORReader): Anchor {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let url = URL.deserialize(reader);

    let anchor_data_hash = $$CANT_READ("AnchorDataHash");

    return new Anchor(url, anchor_data_hash);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    this.url.serialize(writer);
    $$CANT_WRITE("AnchorDataHash");
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

export class GovernanceActionId {
  private transaction_id: unknown;
  private index: number;

  constructor(transaction_id: unknown, index: number) {
    this.transaction_id = transaction_id;
    this.index = index;
  }

  get_transaction_id(): unknown {
    return this.transaction_id;
  }

  set_transaction_id(transaction_id: unknown): void {
    this.transaction_id = transaction_id;
  }

  get_index(): number {
    return this.index;
  }

  set_index(index: number): void {
    this.index = index;
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

  static deserialize(reader: CBORReader): GovernanceActionId {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let transaction_id = $$CANT_READ("TransactionHash");

    let index = Number(reader.readInt());

    return new GovernanceActionId(transaction_id, index);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    $$CANT_WRITE("TransactionHash");
    writer.writeInt(BigInt(this.index));
  }
}

export class TransactionInput {
  private transaction_id: unknown;
  private index: number;

  constructor(transaction_id: unknown, index: number) {
    this.transaction_id = transaction_id;
    this.index = index;
  }

  get_transaction_id(): unknown {
    return this.transaction_id;
  }

  set_transaction_id(transaction_id: unknown): void {
    this.transaction_id = transaction_id;
  }

  get_index(): number {
    return this.index;
  }

  set_index(index: number): void {
    this.index = index;
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

  static deserialize(reader: CBORReader): TransactionInput {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let transaction_id = $$CANT_READ("TransactionHash");

    let index = Number(reader.readInt());

    return new TransactionInput(transaction_id, index);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    $$CANT_WRITE("TransactionHash");
    writer.writeInt(BigInt(this.index));
  }
}

export class TransactionOutput {
  private address: unknown;
  private amount: unknown;
  private plutus_data: DataOption | undefined;
  private script_ref: ScriptRef | undefined;

  constructor(
    address: unknown,
    amount: unknown,
    plutus_data: DataOption | undefined,
    script_ref: ScriptRef | undefined,
  ) {
    this.address = address;
    this.amount = amount;
    this.plutus_data = plutus_data;
    this.script_ref = script_ref;
  }

  get_address(): unknown {
    return this.address;
  }

  set_address(address: unknown): void {
    this.address = address;
  }

  get_amount(): unknown {
    return this.amount;
  }

  set_amount(amount: unknown): void {
    this.amount = amount;
  }

  get_plutus_data(): DataOption | undefined {
    return this.plutus_data;
  }

  set_plutus_data(plutus_data: DataOption | undefined): void {
    this.plutus_data = plutus_data;
  }

  get_script_ref(): ScriptRef | undefined {
    return this.script_ref;
  }

  set_script_ref(script_ref: ScriptRef | undefined): void {
    this.script_ref = script_ref;
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

  static deserialize(reader: CBORReader): TransactionOutput {
    let fields: any = {};
    reader.readMap((r) => {
      let key = Number(r.readUint());
      switch (key) {
        case 0:
          fields.address = $$CANT_READ("Address");
          break;

        case 1:
          fields.amount = $$CANT_READ("Value");
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

  serialize(writer: CBORWriter) {
    let len = 4;
    if (this.plutus_data === undefined) len -= 1;
    if (this.script_ref === undefined) len -= 1;
    writer.writeMapTag(len);

    writer.writeInt(0n);
    $$CANT_WRITE("Address");

    writer.writeInt(1n);
    $$CANT_WRITE("Value");

    if (this.plutus_data !== undefined) {
      writer.writeInt(2n);
      this.plutus_data.serialize(writer);
    }
    if (this.script_ref !== undefined) {
      writer.writeInt(3n);
      this.script_ref.serialize(writer);
    }
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
}

export class StakeRegistration {
  private stake_credential: Credential;

  constructor(stake_credential: Credential) {
    this.stake_credential = stake_credential;
  }

  get_stake_credential(): Credential {
    return this.stake_credential;
  }

  set_stake_credential(stake_credential: Credential): void {
    this.stake_credential = stake_credential;
  }

  static deserialize(reader: CBORReader): StakeRegistration {
    let stake_credential = Credential.deserialize(reader);

    return new StakeRegistration(stake_credential);
  }

  serialize(writer: CBORWriter): void {
    this.stake_credential.serialize(writer);
  }
}

export class StakeDeregistration {
  private stake_credential: Credential;

  constructor(stake_credential: Credential) {
    this.stake_credential = stake_credential;
  }

  get_stake_credential(): Credential {
    return this.stake_credential;
  }

  set_stake_credential(stake_credential: Credential): void {
    this.stake_credential = stake_credential;
  }

  static deserialize(reader: CBORReader): StakeDeregistration {
    let stake_credential = Credential.deserialize(reader);

    return new StakeDeregistration(stake_credential);
  }

  serialize(writer: CBORWriter): void {
    this.stake_credential.serialize(writer);
  }
}

export class StakeDelegation {
  private stake_credential: Credential;
  private pool_keyhash: unknown;

  constructor(stake_credential: Credential, pool_keyhash: unknown) {
    this.stake_credential = stake_credential;
    this.pool_keyhash = pool_keyhash;
  }

  get_stake_credential(): Credential {
    return this.stake_credential;
  }

  set_stake_credential(stake_credential: Credential): void {
    this.stake_credential = stake_credential;
  }

  get_pool_keyhash(): unknown {
    return this.pool_keyhash;
  }

  set_pool_keyhash(pool_keyhash: unknown): void {
    this.pool_keyhash = pool_keyhash;
  }

  static deserialize(reader: CBORReader): StakeDelegation {
    let stake_credential = Credential.deserialize(reader);

    let pool_keyhash = $$CANT_READ("Ed25519KeyHash");

    return new StakeDelegation(stake_credential, pool_keyhash);
  }

  serialize(writer: CBORWriter): void {
    this.stake_credential.serialize(writer);
    $$CANT_WRITE("Ed25519KeyHash");
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

  static deserialize(reader: CBORReader): PoolRegistration {
    let pool_params = PoolParams.deserialize(reader);
    return new PoolRegistration(pool_params);
  }

  serialize(writer: CBORWriter): void {
    this.pool_params.serialize(writer);
  }
}

export class PoolRetirement {
  private pool_keyhash: unknown;
  private epoch: number;

  constructor(pool_keyhash: unknown, epoch: number) {
    this.pool_keyhash = pool_keyhash;
    this.epoch = epoch;
  }

  get_pool_keyhash(): unknown {
    return this.pool_keyhash;
  }

  set_pool_keyhash(pool_keyhash: unknown): void {
    this.pool_keyhash = pool_keyhash;
  }

  get_epoch(): number {
    return this.epoch;
  }

  set_epoch(epoch: number): void {
    this.epoch = epoch;
  }

  static deserialize(reader: CBORReader): PoolRetirement {
    let pool_keyhash = $$CANT_READ("Ed25519KeyHash");

    let epoch = Number(reader.readInt());

    return new PoolRetirement(pool_keyhash, epoch);
  }

  serialize(writer: CBORWriter): void {
    $$CANT_WRITE("Ed25519KeyHash");
    writer.writeInt(BigInt(this.epoch));
  }
}

export class RegCert {
  private stake_credential: Credential;
  private coin: bigint;

  constructor(stake_credential: Credential, coin: bigint) {
    this.stake_credential = stake_credential;
    this.coin = coin;
  }

  get_stake_credential(): Credential {
    return this.stake_credential;
  }

  set_stake_credential(stake_credential: Credential): void {
    this.stake_credential = stake_credential;
  }

  get_coin(): bigint {
    return this.coin;
  }

  set_coin(coin: bigint): void {
    this.coin = coin;
  }

  static deserialize(reader: CBORReader): RegCert {
    let stake_credential = Credential.deserialize(reader);

    let coin = reader.readInt();

    return new RegCert(stake_credential, coin);
  }

  serialize(writer: CBORWriter): void {
    this.stake_credential.serialize(writer);
    writer.writeInt(this.coin);
  }
}

export class UnregCert {
  private stake_credential: Credential;
  private coin: bigint;

  constructor(stake_credential: Credential, coin: bigint) {
    this.stake_credential = stake_credential;
    this.coin = coin;
  }

  get_stake_credential(): Credential {
    return this.stake_credential;
  }

  set_stake_credential(stake_credential: Credential): void {
    this.stake_credential = stake_credential;
  }

  get_coin(): bigint {
    return this.coin;
  }

  set_coin(coin: bigint): void {
    this.coin = coin;
  }

  static deserialize(reader: CBORReader): UnregCert {
    let stake_credential = Credential.deserialize(reader);

    let coin = reader.readInt();

    return new UnregCert(stake_credential, coin);
  }

  serialize(writer: CBORWriter): void {
    this.stake_credential.serialize(writer);
    writer.writeInt(this.coin);
  }
}

export class VoteDelegation {
  private stake_credential: Credential;
  private drep: DRep;

  constructor(stake_credential: Credential, drep: DRep) {
    this.stake_credential = stake_credential;
    this.drep = drep;
  }

  get_stake_credential(): Credential {
    return this.stake_credential;
  }

  set_stake_credential(stake_credential: Credential): void {
    this.stake_credential = stake_credential;
  }

  get_drep(): DRep {
    return this.drep;
  }

  set_drep(drep: DRep): void {
    this.drep = drep;
  }

  static deserialize(reader: CBORReader): VoteDelegation {
    let stake_credential = Credential.deserialize(reader);

    let drep = DRep.deserialize(reader);

    return new VoteDelegation(stake_credential, drep);
  }

  serialize(writer: CBORWriter): void {
    this.stake_credential.serialize(writer);
    this.drep.serialize(writer);
  }
}

export class StakeAndVoteDelegation {
  private stake_credential: Credential;
  private pool_keyhash: unknown;
  private drep: DRep;

  constructor(stake_credential: Credential, pool_keyhash: unknown, drep: DRep) {
    this.stake_credential = stake_credential;
    this.pool_keyhash = pool_keyhash;
    this.drep = drep;
  }

  get_stake_credential(): Credential {
    return this.stake_credential;
  }

  set_stake_credential(stake_credential: Credential): void {
    this.stake_credential = stake_credential;
  }

  get_pool_keyhash(): unknown {
    return this.pool_keyhash;
  }

  set_pool_keyhash(pool_keyhash: unknown): void {
    this.pool_keyhash = pool_keyhash;
  }

  get_drep(): DRep {
    return this.drep;
  }

  set_drep(drep: DRep): void {
    this.drep = drep;
  }

  static deserialize(reader: CBORReader): StakeAndVoteDelegation {
    let stake_credential = Credential.deserialize(reader);

    let pool_keyhash = $$CANT_READ("Ed25519KeyHash");

    let drep = DRep.deserialize(reader);

    return new StakeAndVoteDelegation(stake_credential, pool_keyhash, drep);
  }

  serialize(writer: CBORWriter): void {
    this.stake_credential.serialize(writer);
    $$CANT_WRITE("Ed25519KeyHash");
    this.drep.serialize(writer);
  }
}

export class StakeRegistrationAndDelegation {
  private stake_credential: Credential;
  private pool_keyhash: unknown;
  private coin: bigint;

  constructor(
    stake_credential: Credential,
    pool_keyhash: unknown,
    coin: bigint,
  ) {
    this.stake_credential = stake_credential;
    this.pool_keyhash = pool_keyhash;
    this.coin = coin;
  }

  get_stake_credential(): Credential {
    return this.stake_credential;
  }

  set_stake_credential(stake_credential: Credential): void {
    this.stake_credential = stake_credential;
  }

  get_pool_keyhash(): unknown {
    return this.pool_keyhash;
  }

  set_pool_keyhash(pool_keyhash: unknown): void {
    this.pool_keyhash = pool_keyhash;
  }

  get_coin(): bigint {
    return this.coin;
  }

  set_coin(coin: bigint): void {
    this.coin = coin;
  }

  static deserialize(reader: CBORReader): StakeRegistrationAndDelegation {
    let stake_credential = Credential.deserialize(reader);

    let pool_keyhash = $$CANT_READ("Ed25519KeyHash");

    let coin = reader.readInt();

    return new StakeRegistrationAndDelegation(
      stake_credential,
      pool_keyhash,
      coin,
    );
  }

  serialize(writer: CBORWriter): void {
    this.stake_credential.serialize(writer);
    $$CANT_WRITE("Ed25519KeyHash");
    writer.writeInt(this.coin);
  }
}

export class VoteRegistrationAndDelegation {
  private stake_credential: Credential;
  private drep: DRep;
  private coin: bigint;

  constructor(stake_credential: Credential, drep: DRep, coin: bigint) {
    this.stake_credential = stake_credential;
    this.drep = drep;
    this.coin = coin;
  }

  get_stake_credential(): Credential {
    return this.stake_credential;
  }

  set_stake_credential(stake_credential: Credential): void {
    this.stake_credential = stake_credential;
  }

  get_drep(): DRep {
    return this.drep;
  }

  set_drep(drep: DRep): void {
    this.drep = drep;
  }

  get_coin(): bigint {
    return this.coin;
  }

  set_coin(coin: bigint): void {
    this.coin = coin;
  }

  static deserialize(reader: CBORReader): VoteRegistrationAndDelegation {
    let stake_credential = Credential.deserialize(reader);

    let drep = DRep.deserialize(reader);

    let coin = reader.readInt();

    return new VoteRegistrationAndDelegation(stake_credential, drep, coin);
  }

  serialize(writer: CBORWriter): void {
    this.stake_credential.serialize(writer);
    this.drep.serialize(writer);
    writer.writeInt(this.coin);
  }
}

export class StakeVoteRegistrationAndDelegation {
  private stake_credential: Credential;
  private pool_keyhash: unknown;
  private drep: DRep;
  private coin: bigint;

  constructor(
    stake_credential: Credential,
    pool_keyhash: unknown,
    drep: DRep,
    coin: bigint,
  ) {
    this.stake_credential = stake_credential;
    this.pool_keyhash = pool_keyhash;
    this.drep = drep;
    this.coin = coin;
  }

  get_stake_credential(): Credential {
    return this.stake_credential;
  }

  set_stake_credential(stake_credential: Credential): void {
    this.stake_credential = stake_credential;
  }

  get_pool_keyhash(): unknown {
    return this.pool_keyhash;
  }

  set_pool_keyhash(pool_keyhash: unknown): void {
    this.pool_keyhash = pool_keyhash;
  }

  get_drep(): DRep {
    return this.drep;
  }

  set_drep(drep: DRep): void {
    this.drep = drep;
  }

  get_coin(): bigint {
    return this.coin;
  }

  set_coin(coin: bigint): void {
    this.coin = coin;
  }

  static deserialize(reader: CBORReader): StakeVoteRegistrationAndDelegation {
    let stake_credential = Credential.deserialize(reader);

    let pool_keyhash = $$CANT_READ("Ed25519KeyHash");

    let drep = DRep.deserialize(reader);

    let coin = reader.readInt();

    return new StakeVoteRegistrationAndDelegation(
      stake_credential,
      pool_keyhash,
      drep,
      coin,
    );
  }

  serialize(writer: CBORWriter): void {
    this.stake_credential.serialize(writer);
    $$CANT_WRITE("Ed25519KeyHash");
    this.drep.serialize(writer);
    writer.writeInt(this.coin);
  }
}

export class CommitteeHotAuth {
  private committee_cold_key: Credential;
  private committee_hot_key: Credential;

  constructor(committee_cold_key: Credential, committee_hot_key: Credential) {
    this.committee_cold_key = committee_cold_key;
    this.committee_hot_key = committee_hot_key;
  }

  get_committee_cold_key(): Credential {
    return this.committee_cold_key;
  }

  set_committee_cold_key(committee_cold_key: Credential): void {
    this.committee_cold_key = committee_cold_key;
  }

  get_committee_hot_key(): Credential {
    return this.committee_hot_key;
  }

  set_committee_hot_key(committee_hot_key: Credential): void {
    this.committee_hot_key = committee_hot_key;
  }

  static deserialize(reader: CBORReader): CommitteeHotAuth {
    let committee_cold_key = Credential.deserialize(reader);

    let committee_hot_key = Credential.deserialize(reader);

    return new CommitteeHotAuth(committee_cold_key, committee_hot_key);
  }

  serialize(writer: CBORWriter): void {
    this.committee_cold_key.serialize(writer);
    this.committee_hot_key.serialize(writer);
  }
}

export class CommitteeColdResign {
  private committee_cold_key: Credential;
  private anchor: Anchor | undefined;

  constructor(committee_cold_key: Credential, anchor: Anchor | undefined) {
    this.committee_cold_key = committee_cold_key;
    this.anchor = anchor;
  }

  get_committee_cold_key(): Credential {
    return this.committee_cold_key;
  }

  set_committee_cold_key(committee_cold_key: Credential): void {
    this.committee_cold_key = committee_cold_key;
  }

  get_anchor(): Anchor | undefined {
    return this.anchor;
  }

  set_anchor(anchor: Anchor | undefined): void {
    this.anchor = anchor;
  }

  static deserialize(reader: CBORReader): CommitteeColdResign {
    let committee_cold_key = Credential.deserialize(reader);

    let anchor = reader.readNullable((r) => Anchor.deserialize(r)) ?? undefined;

    return new CommitteeColdResign(committee_cold_key, anchor);
  }

  serialize(writer: CBORWriter): void {
    this.committee_cold_key.serialize(writer);
    if (this.anchor == null) {
      writer.writeNull();
    } else {
      this.anchor.serialize(writer);
    }
  }
}

export class DrepRegistration {
  private voting_credential: Credential;
  private coin: bigint;
  private anchor: Anchor | undefined;

  constructor(
    voting_credential: Credential,
    coin: bigint,
    anchor: Anchor | undefined,
  ) {
    this.voting_credential = voting_credential;
    this.coin = coin;
    this.anchor = anchor;
  }

  get_voting_credential(): Credential {
    return this.voting_credential;
  }

  set_voting_credential(voting_credential: Credential): void {
    this.voting_credential = voting_credential;
  }

  get_coin(): bigint {
    return this.coin;
  }

  set_coin(coin: bigint): void {
    this.coin = coin;
  }

  get_anchor(): Anchor | undefined {
    return this.anchor;
  }

  set_anchor(anchor: Anchor | undefined): void {
    this.anchor = anchor;
  }

  static deserialize(reader: CBORReader): DrepRegistration {
    let voting_credential = Credential.deserialize(reader);

    let coin = reader.readInt();

    let anchor = reader.readNullable((r) => Anchor.deserialize(r)) ?? undefined;

    return new DrepRegistration(voting_credential, coin, anchor);
  }

  serialize(writer: CBORWriter): void {
    this.voting_credential.serialize(writer);
    writer.writeInt(this.coin);
    if (this.anchor == null) {
      writer.writeNull();
    } else {
      this.anchor.serialize(writer);
    }
  }
}

export class DrepDeregistration {
  private drep_credential: Credential;
  private coin: bigint;

  constructor(drep_credential: Credential, coin: bigint) {
    this.drep_credential = drep_credential;
    this.coin = coin;
  }

  get_drep_credential(): Credential {
    return this.drep_credential;
  }

  set_drep_credential(drep_credential: Credential): void {
    this.drep_credential = drep_credential;
  }

  get_coin(): bigint {
    return this.coin;
  }

  set_coin(coin: bigint): void {
    this.coin = coin;
  }

  static deserialize(reader: CBORReader): DrepDeregistration {
    let drep_credential = Credential.deserialize(reader);

    let coin = reader.readInt();

    return new DrepDeregistration(drep_credential, coin);
  }

  serialize(writer: CBORWriter): void {
    this.drep_credential.serialize(writer);
    writer.writeInt(this.coin);
  }
}

export class DrepUpdate {
  private drep_credential: Credential;
  private anchor: Anchor | undefined;

  constructor(drep_credential: Credential, anchor: Anchor | undefined) {
    this.drep_credential = drep_credential;
    this.anchor = anchor;
  }

  get_drep_credential(): Credential {
    return this.drep_credential;
  }

  set_drep_credential(drep_credential: Credential): void {
    this.drep_credential = drep_credential;
  }

  get_anchor(): Anchor | undefined {
    return this.anchor;
  }

  set_anchor(anchor: Anchor | undefined): void {
    this.anchor = anchor;
  }

  static deserialize(reader: CBORReader): DrepUpdate {
    let drep_credential = Credential.deserialize(reader);

    let anchor = reader.readNullable((r) => Anchor.deserialize(r)) ?? undefined;

    return new DrepUpdate(drep_credential, anchor);
  }

  serialize(writer: CBORWriter): void {
    this.drep_credential.serialize(writer);
    if (this.anchor == null) {
      writer.writeNull();
    } else {
      this.anchor.serialize(writer);
    }
  }
}

export enum CredentialKind {
  Ed25519KeyHash = 0,
  ScriptHash = 1,
}

export type CredentialVariant =
  | { kind: 0; value: unknown }
  | { kind: 1; value: unknown };

export class Credential {
  private variant: CredentialVariant;

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

  constructor(variant: CredentialVariant) {
    this.variant = variant;
  }

  static new_keyhash(keyhash: unknown): Credential {
    return new Credential({ kind: 0, value: keyhash });
  }

  static new_scripthash(scripthash: unknown): Credential {
    return new Credential({ kind: 1, value: scripthash });
  }

  as_keyhash(): unknown | undefined {
    if (this.variant.kind == 0) return this.variant.value;
  }

  as_scripthash(): unknown | undefined {
    if (this.variant.kind == 1) return this.variant.value;
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
          value: $$CANT_READ("Ed25519KeyHash"),
        };

        break;

      case 1:
        if (len != null && len - 1 != 1) {
          throw new Error("Expected 1 items to decode ScriptHash");
        }
        variant = {
          kind: 1,
          value: $$CANT_READ("ScriptHash"),
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
        $$CANT_WRITE("Ed25519KeyHash");
        break;
      case 1:
        writer.writeArrayTag(2);
        writer.writeInt(BigInt(1));
        $$CANT_WRITE("ScriptHash");
        break;
    }
  }
}

export enum DRepKind {
  Ed25519KeyHash = 0,
  ScriptHash = 1,
  AlwaysAbstain = 2,
  AlwaysNoConfidence = 3,
}

export type DRepVariant =
  | { kind: 0; value: unknown }
  | { kind: 1; value: unknown }
  | { kind: 2 }
  | { kind: 3 };

export class DRep {
  private variant: DRepVariant;

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

  constructor(variant: DRepVariant) {
    this.variant = variant;
  }

  static new_key_hash(key_hash: unknown): DRep {
    return new DRep({ kind: 0, value: key_hash });
  }

  static new_script_hash(script_hash: unknown): DRep {
    return new DRep({ kind: 1, value: script_hash });
  }

  static new_always_abstain(): DRep {
    return new DRep({ kind: 2 });
  }

  static new_always_no_confidence(): DRep {
    return new DRep({ kind: 3 });
  }

  as_key_hash(): unknown | undefined {
    if (this.variant.kind == 0) return this.variant.value;
  }

  as_script_hash(): unknown | undefined {
    if (this.variant.kind == 1) return this.variant.value;
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
          value: $$CANT_READ("Ed25519KeyHash"),
        };

        break;

      case 1:
        if (len != null && len - 1 != 1) {
          throw new Error("Expected 1 items to decode ScriptHash");
        }
        variant = {
          kind: 1,
          value: $$CANT_READ("ScriptHash"),
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
        $$CANT_WRITE("Ed25519KeyHash");
        break;
      case 1:
        writer.writeArrayTag(2);
        writer.writeInt(BigInt(1));
        $$CANT_WRITE("ScriptHash");
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
}

export class PoolParams {
  private operator: unknown;
  private vrf_keyhash: unknown;
  private pledge: bigint;
  private cost: bigint;
  private margin: UnitInterval;
  private reward_account: unknown;
  private pool_owners: Ed25519KeyHashes;
  private relays: Relays;
  private pool_metadata: PoolMetadata | undefined;

  constructor(
    operator: unknown,
    vrf_keyhash: unknown,
    pledge: bigint,
    cost: bigint,
    margin: UnitInterval,
    reward_account: unknown,
    pool_owners: Ed25519KeyHashes,
    relays: Relays,
    pool_metadata: PoolMetadata | undefined,
  ) {
    this.operator = operator;
    this.vrf_keyhash = vrf_keyhash;
    this.pledge = pledge;
    this.cost = cost;
    this.margin = margin;
    this.reward_account = reward_account;
    this.pool_owners = pool_owners;
    this.relays = relays;
    this.pool_metadata = pool_metadata;
  }

  get_operator(): unknown {
    return this.operator;
  }

  set_operator(operator: unknown): void {
    this.operator = operator;
  }

  get_vrf_keyhash(): unknown {
    return this.vrf_keyhash;
  }

  set_vrf_keyhash(vrf_keyhash: unknown): void {
    this.vrf_keyhash = vrf_keyhash;
  }

  get_pledge(): bigint {
    return this.pledge;
  }

  set_pledge(pledge: bigint): void {
    this.pledge = pledge;
  }

  get_cost(): bigint {
    return this.cost;
  }

  set_cost(cost: bigint): void {
    this.cost = cost;
  }

  get_margin(): UnitInterval {
    return this.margin;
  }

  set_margin(margin: UnitInterval): void {
    this.margin = margin;
  }

  get_reward_account(): unknown {
    return this.reward_account;
  }

  set_reward_account(reward_account: unknown): void {
    this.reward_account = reward_account;
  }

  get_pool_owners(): Ed25519KeyHashes {
    return this.pool_owners;
  }

  set_pool_owners(pool_owners: Ed25519KeyHashes): void {
    this.pool_owners = pool_owners;
  }

  get_relays(): Relays {
    return this.relays;
  }

  set_relays(relays: Relays): void {
    this.relays = relays;
  }

  get_pool_metadata(): PoolMetadata | undefined {
    return this.pool_metadata;
  }

  set_pool_metadata(pool_metadata: PoolMetadata | undefined): void {
    this.pool_metadata = pool_metadata;
  }

  static deserialize(reader: CBORReader): PoolParams {
    let operator = $$CANT_READ("Ed25519KeyHash");

    let vrf_keyhash = $$CANT_READ("VRFKeyHash");

    let pledge = reader.readInt();

    let cost = reader.readInt();

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
    $$CANT_WRITE("Ed25519KeyHash");
    $$CANT_WRITE("VRFKeyHash");
    writer.writeInt(this.pledge);
    writer.writeInt(this.cost);
    this.margin.serialize(writer);
    $$CANT_WRITE("RewardAddress");
    this.pool_owners.serialize(writer);
    this.relays.serialize(writer);
    if (this.pool_metadata == null) {
      writer.writeNull();
    } else {
      this.pool_metadata.serialize(writer);
    }
  }
}

export class Relays {
  private items: Relay[];

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

  serialize(writer: CBORWriter) {
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }
}

export class Ipv4 {
  private inner: Uint8Array;

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

  serialize(writer: CBORWriter) {
    writer.writeBytes(this.inner);
  }
}

export class Ipv6 {
  private inner: Uint8Array;

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

  serialize(writer: CBORWriter) {
    writer.writeBytes(this.inner);
  }
}

export class DNSRecordAorAAAA {
  private inner: string;

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

  serialize(writer: CBORWriter) {
    writer.writeString(this.inner);
  }
}

export class DNSRecordSRV {
  private inner: string;

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

  serialize(writer: CBORWriter) {
    writer.writeString(this.inner);
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
}

export class SingleHostAddr {
  private port: number | undefined;
  private ipv4: Ipv4 | undefined;
  private ipv6: Ipv6 | undefined;

  constructor(
    port: number | undefined,
    ipv4: Ipv4 | undefined,
    ipv6: Ipv6 | undefined,
  ) {
    this.port = port;
    this.ipv4 = ipv4;
    this.ipv6 = ipv6;
  }

  get_port(): number | undefined {
    return this.port;
  }

  set_port(port: number | undefined): void {
    this.port = port;
  }

  get_ipv4(): Ipv4 | undefined {
    return this.ipv4;
  }

  set_ipv4(ipv4: Ipv4 | undefined): void {
    this.ipv4 = ipv4;
  }

  get_ipv6(): Ipv6 | undefined {
    return this.ipv6;
  }

  set_ipv6(ipv6: Ipv6 | undefined): void {
    this.ipv6 = ipv6;
  }

  static deserialize(reader: CBORReader): SingleHostAddr {
    let port = reader.readNullable((r) => Number(r.readInt())) ?? undefined;

    let ipv4 = reader.readNullable((r) => Ipv4.deserialize(r)) ?? undefined;

    let ipv6 = reader.readNullable((r) => Ipv6.deserialize(r)) ?? undefined;

    return new SingleHostAddr(port, ipv4, ipv6);
  }

  serialize(writer: CBORWriter): void {
    if (this.port == null) {
      writer.writeNull();
    } else {
      writer.writeInt(BigInt(this.port));
    }
    if (this.ipv4 == null) {
      writer.writeNull();
    } else {
      this.ipv4.serialize(writer);
    }
    if (this.ipv6 == null) {
      writer.writeNull();
    } else {
      this.ipv6.serialize(writer);
    }
  }
}

export class SingleHostName {
  private port: number | undefined;
  private dns_name: DNSRecordAorAAAA;

  constructor(port: number | undefined, dns_name: DNSRecordAorAAAA) {
    this.port = port;
    this.dns_name = dns_name;
  }

  get_port(): number | undefined {
    return this.port;
  }

  set_port(port: number | undefined): void {
    this.port = port;
  }

  get_dns_name(): DNSRecordAorAAAA {
    return this.dns_name;
  }

  set_dns_name(dns_name: DNSRecordAorAAAA): void {
    this.dns_name = dns_name;
  }

  static deserialize(reader: CBORReader): SingleHostName {
    let port = reader.readNullable((r) => Number(r.readInt())) ?? undefined;

    let dns_name = DNSRecordAorAAAA.deserialize(reader);

    return new SingleHostName(port, dns_name);
  }

  serialize(writer: CBORWriter): void {
    if (this.port == null) {
      writer.writeNull();
    } else {
      writer.writeInt(BigInt(this.port));
    }
    this.dns_name.serialize(writer);
  }
}

export class MultiHostName {
  private dns_name: DNSRecordSRV;

  constructor(dns_name: DNSRecordSRV) {
    this.dns_name = dns_name;
  }

  get_dns_name(): DNSRecordSRV {
    return this.dns_name;
  }

  set_dns_name(dns_name: DNSRecordSRV): void {
    this.dns_name = dns_name;
  }

  static deserialize(reader: CBORReader): MultiHostName {
    let dns_name = DNSRecordSRV.deserialize(reader);

    return new MultiHostName(dns_name);
  }

  serialize(writer: CBORWriter): void {
    this.dns_name.serialize(writer);
  }
}

export class PoolMetadata {
  private url: URL;
  private pool_metadata_hash: unknown;

  constructor(url: URL, pool_metadata_hash: unknown) {
    this.url = url;
    this.pool_metadata_hash = pool_metadata_hash;
  }

  get_url(): URL {
    return this.url;
  }

  set_url(url: URL): void {
    this.url = url;
  }

  get_pool_metadata_hash(): unknown {
    return this.pool_metadata_hash;
  }

  set_pool_metadata_hash(pool_metadata_hash: unknown): void {
    this.pool_metadata_hash = pool_metadata_hash;
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

  static deserialize(reader: CBORReader): PoolMetadata {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let url = URL.deserialize(reader);

    let pool_metadata_hash = $$CANT_READ("PoolMetadataHash");

    return new PoolMetadata(url, pool_metadata_hash);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    this.url.serialize(writer);
    $$CANT_WRITE("PoolMetadataHash");
  }
}

export class URL {
  private inner: string;

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

  serialize(writer: CBORWriter) {
    writer.writeString(this.inner);
  }
}

export class Withdrawals {
  private items: [unknown, bigint][];

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

  constructor(items: [unknown, bigint][]) {
    this.items = items;
  }

  static new(): Withdrawals {
    return new Withdrawals([]);
  }

  len(): number {
    return this.items.length;
  }

  insert(key: unknown, value: bigint): void {
    let entry = this.items.find((x) => $$CANT_EQ("RewardAddress"));
    if (entry != null) entry[1] = value;
    else this.items.push([key, value]);
  }

  get(key: unknown): bigint | undefined {
    let entry = this.items.find((x) => $$CANT_EQ("RewardAddress"));
    if (entry == null) return undefined;
    return entry[1];
  }

  static deserialize(reader: CBORReader): Withdrawals {
    let ret = new Withdrawals([]);
    reader.readMap((reader) =>
      ret.insert($$CANT_READ("RewardAddress"), reader.readInt()),
    );
    return ret;
  }

  serialize(writer: CBORWriter) {
    writer.writeMap(this.items, (writer, x) => {
      $$CANT_WRITE("RewardAddress");
      writer.writeInt(x[1]);
    });
  }
}

export class ProtocolParamUpdate {
  private minfee_a: bigint | undefined;
  private minfee_b: bigint | undefined;
  private max_block_body_size: number | undefined;
  private max_tx_size: number | undefined;
  private max_block_header_size: number | undefined;
  private key_deposit: bigint | undefined;
  private pool_deposit: bigint | undefined;
  private max_epoch: number | undefined;
  private n_opt: number | undefined;
  private pool_pledge_influence: UnitInterval | undefined;
  private expansion_rate: UnitInterval | undefined;
  private treasury_growth_rate: UnitInterval | undefined;
  private min_pool_cost: bigint | undefined;
  private ada_per_utxo_byte: bigint | undefined;
  private costmdls: unknown | undefined;
  private execution_costs: ExUnitPrices | undefined;
  private max_tx_ex_units: ExUnits | undefined;
  private max_block_ex_units: ExUnits | undefined;
  private max_value_size: number | undefined;
  private collateral_percentage: number | undefined;
  private max_collateral_inputs: number | undefined;
  private pool_voting_thresholds: PoolVotingThresholds | undefined;
  private drep_voting_thresholds: DrepVotingThresholds | undefined;
  private min_committee_size: number | undefined;
  private committee_term_limit: number | undefined;
  private governance_action_validity_period: number | undefined;
  private governance_action_deposit: bigint | undefined;
  private drep_deposit: bigint | undefined;
  private drep_inactivity_period: number | undefined;
  private script_cost_per_byte: UnitInterval | undefined;

  constructor(
    minfee_a: bigint | undefined,
    minfee_b: bigint | undefined,
    max_block_body_size: number | undefined,
    max_tx_size: number | undefined,
    max_block_header_size: number | undefined,
    key_deposit: bigint | undefined,
    pool_deposit: bigint | undefined,
    max_epoch: number | undefined,
    n_opt: number | undefined,
    pool_pledge_influence: UnitInterval | undefined,
    expansion_rate: UnitInterval | undefined,
    treasury_growth_rate: UnitInterval | undefined,
    min_pool_cost: bigint | undefined,
    ada_per_utxo_byte: bigint | undefined,
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
    governance_action_deposit: bigint | undefined,
    drep_deposit: bigint | undefined,
    drep_inactivity_period: number | undefined,
    script_cost_per_byte: UnitInterval | undefined,
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
    this.execution_costs = execution_costs;
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
    this.script_cost_per_byte = script_cost_per_byte;
  }

  get_minfee_a(): bigint | undefined {
    return this.minfee_a;
  }

  set_minfee_a(minfee_a: bigint | undefined): void {
    this.minfee_a = minfee_a;
  }

  get_minfee_b(): bigint | undefined {
    return this.minfee_b;
  }

  set_minfee_b(minfee_b: bigint | undefined): void {
    this.minfee_b = minfee_b;
  }

  get_max_block_body_size(): number | undefined {
    return this.max_block_body_size;
  }

  set_max_block_body_size(max_block_body_size: number | undefined): void {
    this.max_block_body_size = max_block_body_size;
  }

  get_max_tx_size(): number | undefined {
    return this.max_tx_size;
  }

  set_max_tx_size(max_tx_size: number | undefined): void {
    this.max_tx_size = max_tx_size;
  }

  get_max_block_header_size(): number | undefined {
    return this.max_block_header_size;
  }

  set_max_block_header_size(max_block_header_size: number | undefined): void {
    this.max_block_header_size = max_block_header_size;
  }

  get_key_deposit(): bigint | undefined {
    return this.key_deposit;
  }

  set_key_deposit(key_deposit: bigint | undefined): void {
    this.key_deposit = key_deposit;
  }

  get_pool_deposit(): bigint | undefined {
    return this.pool_deposit;
  }

  set_pool_deposit(pool_deposit: bigint | undefined): void {
    this.pool_deposit = pool_deposit;
  }

  get_max_epoch(): number | undefined {
    return this.max_epoch;
  }

  set_max_epoch(max_epoch: number | undefined): void {
    this.max_epoch = max_epoch;
  }

  get_n_opt(): number | undefined {
    return this.n_opt;
  }

  set_n_opt(n_opt: number | undefined): void {
    this.n_opt = n_opt;
  }

  get_pool_pledge_influence(): UnitInterval | undefined {
    return this.pool_pledge_influence;
  }

  set_pool_pledge_influence(
    pool_pledge_influence: UnitInterval | undefined,
  ): void {
    this.pool_pledge_influence = pool_pledge_influence;
  }

  get_expansion_rate(): UnitInterval | undefined {
    return this.expansion_rate;
  }

  set_expansion_rate(expansion_rate: UnitInterval | undefined): void {
    this.expansion_rate = expansion_rate;
  }

  get_treasury_growth_rate(): UnitInterval | undefined {
    return this.treasury_growth_rate;
  }

  set_treasury_growth_rate(
    treasury_growth_rate: UnitInterval | undefined,
  ): void {
    this.treasury_growth_rate = treasury_growth_rate;
  }

  get_min_pool_cost(): bigint | undefined {
    return this.min_pool_cost;
  }

  set_min_pool_cost(min_pool_cost: bigint | undefined): void {
    this.min_pool_cost = min_pool_cost;
  }

  get_ada_per_utxo_byte(): bigint | undefined {
    return this.ada_per_utxo_byte;
  }

  set_ada_per_utxo_byte(ada_per_utxo_byte: bigint | undefined): void {
    this.ada_per_utxo_byte = ada_per_utxo_byte;
  }

  get_costmdls(): unknown | undefined {
    return this.costmdls;
  }

  set_costmdls(costmdls: unknown | undefined): void {
    this.costmdls = costmdls;
  }

  get_execution_costs(): ExUnitPrices | undefined {
    return this.execution_costs;
  }

  set_execution_costs(execution_costs: ExUnitPrices | undefined): void {
    this.execution_costs = execution_costs;
  }

  get_max_tx_ex_units(): ExUnits | undefined {
    return this.max_tx_ex_units;
  }

  set_max_tx_ex_units(max_tx_ex_units: ExUnits | undefined): void {
    this.max_tx_ex_units = max_tx_ex_units;
  }

  get_max_block_ex_units(): ExUnits | undefined {
    return this.max_block_ex_units;
  }

  set_max_block_ex_units(max_block_ex_units: ExUnits | undefined): void {
    this.max_block_ex_units = max_block_ex_units;
  }

  get_max_value_size(): number | undefined {
    return this.max_value_size;
  }

  set_max_value_size(max_value_size: number | undefined): void {
    this.max_value_size = max_value_size;
  }

  get_collateral_percentage(): number | undefined {
    return this.collateral_percentage;
  }

  set_collateral_percentage(collateral_percentage: number | undefined): void {
    this.collateral_percentage = collateral_percentage;
  }

  get_max_collateral_inputs(): number | undefined {
    return this.max_collateral_inputs;
  }

  set_max_collateral_inputs(max_collateral_inputs: number | undefined): void {
    this.max_collateral_inputs = max_collateral_inputs;
  }

  get_pool_voting_thresholds(): PoolVotingThresholds | undefined {
    return this.pool_voting_thresholds;
  }

  set_pool_voting_thresholds(
    pool_voting_thresholds: PoolVotingThresholds | undefined,
  ): void {
    this.pool_voting_thresholds = pool_voting_thresholds;
  }

  get_drep_voting_thresholds(): DrepVotingThresholds | undefined {
    return this.drep_voting_thresholds;
  }

  set_drep_voting_thresholds(
    drep_voting_thresholds: DrepVotingThresholds | undefined,
  ): void {
    this.drep_voting_thresholds = drep_voting_thresholds;
  }

  get_min_committee_size(): number | undefined {
    return this.min_committee_size;
  }

  set_min_committee_size(min_committee_size: number | undefined): void {
    this.min_committee_size = min_committee_size;
  }

  get_committee_term_limit(): number | undefined {
    return this.committee_term_limit;
  }

  set_committee_term_limit(committee_term_limit: number | undefined): void {
    this.committee_term_limit = committee_term_limit;
  }

  get_governance_action_validity_period(): number | undefined {
    return this.governance_action_validity_period;
  }

  set_governance_action_validity_period(
    governance_action_validity_period: number | undefined,
  ): void {
    this.governance_action_validity_period = governance_action_validity_period;
  }

  get_governance_action_deposit(): bigint | undefined {
    return this.governance_action_deposit;
  }

  set_governance_action_deposit(
    governance_action_deposit: bigint | undefined,
  ): void {
    this.governance_action_deposit = governance_action_deposit;
  }

  get_drep_deposit(): bigint | undefined {
    return this.drep_deposit;
  }

  set_drep_deposit(drep_deposit: bigint | undefined): void {
    this.drep_deposit = drep_deposit;
  }

  get_drep_inactivity_period(): number | undefined {
    return this.drep_inactivity_period;
  }

  set_drep_inactivity_period(drep_inactivity_period: number | undefined): void {
    this.drep_inactivity_period = drep_inactivity_period;
  }

  get_script_cost_per_byte(): UnitInterval | undefined {
    return this.script_cost_per_byte;
  }

  set_script_cost_per_byte(
    script_cost_per_byte: UnitInterval | undefined,
  ): void {
    this.script_cost_per_byte = script_cost_per_byte;
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

  static deserialize(reader: CBORReader): ProtocolParamUpdate {
    let fields: any = {};
    reader.readMap((r) => {
      let key = Number(r.readUint());
      switch (key) {
        case 0:
          fields.minfee_a = r.readInt();
          break;

        case 1:
          fields.minfee_b = r.readInt();
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
          fields.key_deposit = r.readInt();
          break;

        case 6:
          fields.pool_deposit = r.readInt();
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
          fields.min_pool_cost = r.readInt();
          break;

        case 17:
          fields.ada_per_utxo_byte = r.readInt();
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
          fields.governance_action_deposit = r.readInt();
          break;

        case 31:
          fields.drep_deposit = r.readInt();
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

  serialize(writer: CBORWriter) {
    let len = 30;
    if (this.minfee_a === undefined) len -= 1;
    if (this.minfee_b === undefined) len -= 1;
    if (this.max_block_body_size === undefined) len -= 1;
    if (this.max_tx_size === undefined) len -= 1;
    if (this.max_block_header_size === undefined) len -= 1;
    if (this.key_deposit === undefined) len -= 1;
    if (this.pool_deposit === undefined) len -= 1;
    if (this.max_epoch === undefined) len -= 1;
    if (this.n_opt === undefined) len -= 1;
    if (this.pool_pledge_influence === undefined) len -= 1;
    if (this.expansion_rate === undefined) len -= 1;
    if (this.treasury_growth_rate === undefined) len -= 1;
    if (this.min_pool_cost === undefined) len -= 1;
    if (this.ada_per_utxo_byte === undefined) len -= 1;
    if (this.costmdls === undefined) len -= 1;
    if (this.execution_costs === undefined) len -= 1;
    if (this.max_tx_ex_units === undefined) len -= 1;
    if (this.max_block_ex_units === undefined) len -= 1;
    if (this.max_value_size === undefined) len -= 1;
    if (this.collateral_percentage === undefined) len -= 1;
    if (this.max_collateral_inputs === undefined) len -= 1;
    if (this.pool_voting_thresholds === undefined) len -= 1;
    if (this.drep_voting_thresholds === undefined) len -= 1;
    if (this.min_committee_size === undefined) len -= 1;
    if (this.committee_term_limit === undefined) len -= 1;
    if (this.governance_action_validity_period === undefined) len -= 1;
    if (this.governance_action_deposit === undefined) len -= 1;
    if (this.drep_deposit === undefined) len -= 1;
    if (this.drep_inactivity_period === undefined) len -= 1;
    if (this.script_cost_per_byte === undefined) len -= 1;
    writer.writeMapTag(len);
    if (this.minfee_a !== undefined) {
      writer.writeInt(0n);
      writer.writeInt(this.minfee_a);
    }
    if (this.minfee_b !== undefined) {
      writer.writeInt(1n);
      writer.writeInt(this.minfee_b);
    }
    if (this.max_block_body_size !== undefined) {
      writer.writeInt(2n);
      writer.writeInt(BigInt(this.max_block_body_size));
    }
    if (this.max_tx_size !== undefined) {
      writer.writeInt(3n);
      writer.writeInt(BigInt(this.max_tx_size));
    }
    if (this.max_block_header_size !== undefined) {
      writer.writeInt(4n);
      writer.writeInt(BigInt(this.max_block_header_size));
    }
    if (this.key_deposit !== undefined) {
      writer.writeInt(5n);
      writer.writeInt(this.key_deposit);
    }
    if (this.pool_deposit !== undefined) {
      writer.writeInt(6n);
      writer.writeInt(this.pool_deposit);
    }
    if (this.max_epoch !== undefined) {
      writer.writeInt(7n);
      writer.writeInt(BigInt(this.max_epoch));
    }
    if (this.n_opt !== undefined) {
      writer.writeInt(8n);
      writer.writeInt(BigInt(this.n_opt));
    }
    if (this.pool_pledge_influence !== undefined) {
      writer.writeInt(9n);
      this.pool_pledge_influence.serialize(writer);
    }
    if (this.expansion_rate !== undefined) {
      writer.writeInt(10n);
      this.expansion_rate.serialize(writer);
    }
    if (this.treasury_growth_rate !== undefined) {
      writer.writeInt(11n);
      this.treasury_growth_rate.serialize(writer);
    }
    if (this.min_pool_cost !== undefined) {
      writer.writeInt(16n);
      writer.writeInt(this.min_pool_cost);
    }
    if (this.ada_per_utxo_byte !== undefined) {
      writer.writeInt(17n);
      writer.writeInt(this.ada_per_utxo_byte);
    }
    if (this.costmdls !== undefined) {
      writer.writeInt(18n);
      $$CANT_WRITE("Costmdls");
    }
    if (this.execution_costs !== undefined) {
      writer.writeInt(19n);
      this.execution_costs.serialize(writer);
    }
    if (this.max_tx_ex_units !== undefined) {
      writer.writeInt(20n);
      this.max_tx_ex_units.serialize(writer);
    }
    if (this.max_block_ex_units !== undefined) {
      writer.writeInt(21n);
      this.max_block_ex_units.serialize(writer);
    }
    if (this.max_value_size !== undefined) {
      writer.writeInt(22n);
      writer.writeInt(BigInt(this.max_value_size));
    }
    if (this.collateral_percentage !== undefined) {
      writer.writeInt(23n);
      writer.writeInt(BigInt(this.collateral_percentage));
    }
    if (this.max_collateral_inputs !== undefined) {
      writer.writeInt(24n);
      writer.writeInt(BigInt(this.max_collateral_inputs));
    }
    if (this.pool_voting_thresholds !== undefined) {
      writer.writeInt(25n);
      this.pool_voting_thresholds.serialize(writer);
    }
    if (this.drep_voting_thresholds !== undefined) {
      writer.writeInt(26n);
      this.drep_voting_thresholds.serialize(writer);
    }
    if (this.min_committee_size !== undefined) {
      writer.writeInt(27n);
      writer.writeInt(BigInt(this.min_committee_size));
    }
    if (this.committee_term_limit !== undefined) {
      writer.writeInt(28n);
      writer.writeInt(BigInt(this.committee_term_limit));
    }
    if (this.governance_action_validity_period !== undefined) {
      writer.writeInt(29n);
      writer.writeInt(BigInt(this.governance_action_validity_period));
    }
    if (this.governance_action_deposit !== undefined) {
      writer.writeInt(30n);
      writer.writeInt(this.governance_action_deposit);
    }
    if (this.drep_deposit !== undefined) {
      writer.writeInt(31n);
      writer.writeInt(this.drep_deposit);
    }
    if (this.drep_inactivity_period !== undefined) {
      writer.writeInt(32n);
      writer.writeInt(BigInt(this.drep_inactivity_period));
    }
    if (this.script_cost_per_byte !== undefined) {
      writer.writeInt(33n);
      this.script_cost_per_byte.serialize(writer);
    }
  }
}

export class PoolVotingThresholds {
  private motion_no_confidence: UnitInterval;
  private committee_normal: UnitInterval;
  private committee_no_confidence: UnitInterval;
  private hard_fork_initiation: UnitInterval;
  private security_relevant_threshold: UnitInterval;

  constructor(
    motion_no_confidence: UnitInterval,
    committee_normal: UnitInterval,
    committee_no_confidence: UnitInterval,
    hard_fork_initiation: UnitInterval,
    security_relevant_threshold: UnitInterval,
  ) {
    this.motion_no_confidence = motion_no_confidence;
    this.committee_normal = committee_normal;
    this.committee_no_confidence = committee_no_confidence;
    this.hard_fork_initiation = hard_fork_initiation;
    this.security_relevant_threshold = security_relevant_threshold;
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

  get_security_relevant_threshold(): UnitInterval {
    return this.security_relevant_threshold;
  }

  set_security_relevant_threshold(
    security_relevant_threshold: UnitInterval,
  ): void {
    this.security_relevant_threshold = security_relevant_threshold;
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

    this.motion_no_confidence.serialize(writer);
    this.committee_normal.serialize(writer);
    this.committee_no_confidence.serialize(writer);
    this.hard_fork_initiation.serialize(writer);
    this.security_relevant_threshold.serialize(writer);
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

    this.motion_no_confidence.serialize(writer);
    this.committee_normal.serialize(writer);
    this.committee_no_confidence.serialize(writer);
    this.update_constitution.serialize(writer);
    this.hard_fork_initiation.serialize(writer);
    this.pp_network_group.serialize(writer);
    this.pp_economic_group.serialize(writer);
    this.pp_technical_group.serialize(writer);
    this.pp_governance_group.serialize(writer);
    this.treasury_withdrawal.serialize(writer);
  }
}

export class TransactionWitnessSet {
  private vkeys: Vkeywitnesses | undefined;
  private native_scripts: NativeScripts | undefined;
  private bootstraps: BootstrapWitnesses | undefined;
  private plutus_scripts_v1: PlutusScripts | undefined;
  private plutus_data: PlutusList | undefined;
  private redeemers: unknown | undefined;
  private plutus_scripts_v2: PlutusScripts | undefined;
  private plutus_scripts_v3: PlutusScripts | undefined;

  constructor(
    vkeys: Vkeywitnesses | undefined,
    native_scripts: NativeScripts | undefined,
    bootstraps: BootstrapWitnesses | undefined,
    plutus_scripts_v1: PlutusScripts | undefined,
    plutus_data: PlutusList | undefined,
    redeemers: unknown | undefined,
    plutus_scripts_v2: PlutusScripts | undefined,
    plutus_scripts_v3: PlutusScripts | undefined,
  ) {
    this.vkeys = vkeys;
    this.native_scripts = native_scripts;
    this.bootstraps = bootstraps;
    this.plutus_scripts_v1 = plutus_scripts_v1;
    this.plutus_data = plutus_data;
    this.redeemers = redeemers;
    this.plutus_scripts_v2 = plutus_scripts_v2;
    this.plutus_scripts_v3 = plutus_scripts_v3;
  }

  get_vkeys(): Vkeywitnesses | undefined {
    return this.vkeys;
  }

  set_vkeys(vkeys: Vkeywitnesses | undefined): void {
    this.vkeys = vkeys;
  }

  get_native_scripts(): NativeScripts | undefined {
    return this.native_scripts;
  }

  set_native_scripts(native_scripts: NativeScripts | undefined): void {
    this.native_scripts = native_scripts;
  }

  get_bootstraps(): BootstrapWitnesses | undefined {
    return this.bootstraps;
  }

  set_bootstraps(bootstraps: BootstrapWitnesses | undefined): void {
    this.bootstraps = bootstraps;
  }

  get_plutus_scripts_v1(): PlutusScripts | undefined {
    return this.plutus_scripts_v1;
  }

  set_plutus_scripts_v1(plutus_scripts_v1: PlutusScripts | undefined): void {
    this.plutus_scripts_v1 = plutus_scripts_v1;
  }

  get_plutus_data(): PlutusList | undefined {
    return this.plutus_data;
  }

  set_plutus_data(plutus_data: PlutusList | undefined): void {
    this.plutus_data = plutus_data;
  }

  get_redeemers(): unknown | undefined {
    return this.redeemers;
  }

  set_redeemers(redeemers: unknown | undefined): void {
    this.redeemers = redeemers;
  }

  get_plutus_scripts_v2(): PlutusScripts | undefined {
    return this.plutus_scripts_v2;
  }

  set_plutus_scripts_v2(plutus_scripts_v2: PlutusScripts | undefined): void {
    this.plutus_scripts_v2 = plutus_scripts_v2;
  }

  get_plutus_scripts_v3(): PlutusScripts | undefined {
    return this.plutus_scripts_v3;
  }

  set_plutus_scripts_v3(plutus_scripts_v3: PlutusScripts | undefined): void {
    this.plutus_scripts_v3 = plutus_scripts_v3;
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
          fields.redeemers = $$CANT_READ("Redeemers");
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

  serialize(writer: CBORWriter) {
    let len = 8;
    if (this.vkeys === undefined) len -= 1;
    if (this.native_scripts === undefined) len -= 1;
    if (this.bootstraps === undefined) len -= 1;
    if (this.plutus_scripts_v1 === undefined) len -= 1;
    if (this.plutus_data === undefined) len -= 1;
    if (this.redeemers === undefined) len -= 1;
    if (this.plutus_scripts_v2 === undefined) len -= 1;
    if (this.plutus_scripts_v3 === undefined) len -= 1;
    writer.writeMapTag(len);
    if (this.vkeys !== undefined) {
      writer.writeInt(0n);
      this.vkeys.serialize(writer);
    }
    if (this.native_scripts !== undefined) {
      writer.writeInt(1n);
      this.native_scripts.serialize(writer);
    }
    if (this.bootstraps !== undefined) {
      writer.writeInt(2n);
      this.bootstraps.serialize(writer);
    }
    if (this.plutus_scripts_v1 !== undefined) {
      writer.writeInt(3n);
      this.plutus_scripts_v1.serialize(writer);
    }
    if (this.plutus_data !== undefined) {
      writer.writeInt(4n);
      this.plutus_data.serialize(writer);
    }
    if (this.redeemers !== undefined) {
      writer.writeInt(5n);
      $$CANT_WRITE("Redeemers");
    }
    if (this.plutus_scripts_v2 !== undefined) {
      writer.writeInt(6n);
      this.plutus_scripts_v2.serialize(writer);
    }
    if (this.plutus_scripts_v3 !== undefined) {
      writer.writeInt(7n);
      this.plutus_scripts_v3.serialize(writer);
    }
  }
}

export class Vkeywitnesses {
  private items: Vkeywitness[];

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

  serialize(writer: CBORWriter) {
    writer.writeTaggedTag(258);
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }
}

export class NativeScripts {
  private items: NativeScript[];

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

  serialize(writer: CBORWriter) {
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }
}

export class BootstrapWitnesses {
  private items: BootstrapWitness[];

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

  serialize(writer: CBORWriter) {
    writer.writeArray(this.items, (writer, x) => x.serialize(writer));
  }
}

export class PlutusScripts {
  private items: Uint8Array[];

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

  serialize(writer: CBORWriter) {
    writer.writeArray(this.items, (writer, x) => writer.writeBytes(x));
  }
}

export class PlutusList {
  private items: unknown[];

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

  serialize(writer: CBORWriter) {
    writer.writeTaggedTag(258);
    writer.writeArray(this.items, (writer, x) => $$CANT_WRITE("PlutusData"));
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

  serialize(writer: CBORWriter) {
    writer.writeInt(BigInt(this.kind_));
  }
}

export class ExUnits {
  private mem: bigint;
  private steps: bigint;

  constructor(mem: bigint, steps: bigint) {
    this.mem = mem;
    this.steps = steps;
  }

  get_mem(): bigint {
    return this.mem;
  }

  set_mem(mem: bigint): void {
    this.mem = mem;
  }

  get_steps(): bigint {
    return this.steps;
  }

  set_steps(steps: bigint): void {
    this.steps = steps;
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

  static deserialize(reader: CBORReader): ExUnits {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let mem = reader.readInt();

    let steps = reader.readInt();

    return new ExUnits(mem, steps);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    writer.writeInt(this.mem);
    writer.writeInt(this.steps);
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

    this.mem_price.serialize(writer);
    this.step_price.serialize(writer);
  }
}

export enum LanguageKind {
  plutus_v1 = 0,
  plutus_v2 = 1,
  plutus_v3 = 2,
}

export class Language {
  private kind_: LanguageKind;

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

  static deserialize(reader: CBORReader): Language {
    let kind = Number(reader.readInt());
    if (kind == 0) return new Language(0);
    if (kind == 1) return new Language(1);
    if (kind == 2) return new Language(2);
    throw "Unrecognized enum value: " + kind + " for " + Language;
  }

  serialize(writer: CBORWriter) {
    writer.writeInt(BigInt(this.kind_));
  }
}

export class GeneralTransactionMetadata {
  private items: [bigint, unknown][];

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

  constructor(items: [bigint, unknown][]) {
    this.items = items;
  }

  static new(): GeneralTransactionMetadata {
    return new GeneralTransactionMetadata([]);
  }

  len(): number {
    return this.items.length;
  }

  insert(key: bigint, value: unknown): void {
    let entry = this.items.find((x) => key === x[0]);
    if (entry != null) entry[1] = value;
    else this.items.push([key, value]);
  }

  get(key: bigint): unknown | undefined {
    let entry = this.items.find((x) => key === x[0]);
    if (entry == null) return undefined;
    return entry[1];
  }

  static deserialize(reader: CBORReader): GeneralTransactionMetadata {
    let ret = new GeneralTransactionMetadata([]);
    reader.readMap((reader) =>
      ret.insert(reader.readInt(), $$CANT_READ("TransactionMetadatum")),
    );
    return ret;
  }

  serialize(writer: CBORWriter) {
    writer.writeMap(this.items, (writer, x) => {
      writer.writeInt(x[0]);
      $$CANT_WRITE("TransactionMetadatum");
    });
  }
}

export class AuxiliaryData {
  private metadata: GeneralTransactionMetadata;
  private native_scripts: NativeScripts;
  private plutus_scripts_v1: PlutusScripts;
  private plutus_scripts_v2: PlutusScripts;
  private plutus_scripts_v3: PlutusScripts;

  constructor(
    metadata: GeneralTransactionMetadata,
    native_scripts: NativeScripts,
    plutus_scripts_v1: PlutusScripts,
    plutus_scripts_v2: PlutusScripts,
    plutus_scripts_v3: PlutusScripts,
  ) {
    this.metadata = metadata;
    this.native_scripts = native_scripts;
    this.plutus_scripts_v1 = plutus_scripts_v1;
    this.plutus_scripts_v2 = plutus_scripts_v2;
    this.plutus_scripts_v3 = plutus_scripts_v3;
  }

  get_metadata(): GeneralTransactionMetadata {
    return this.metadata;
  }

  set_metadata(metadata: GeneralTransactionMetadata): void {
    this.metadata = metadata;
  }

  get_native_scripts(): NativeScripts {
    return this.native_scripts;
  }

  set_native_scripts(native_scripts: NativeScripts): void {
    this.native_scripts = native_scripts;
  }

  get_plutus_scripts_v1(): PlutusScripts {
    return this.plutus_scripts_v1;
  }

  set_plutus_scripts_v1(plutus_scripts_v1: PlutusScripts): void {
    this.plutus_scripts_v1 = plutus_scripts_v1;
  }

  get_plutus_scripts_v2(): PlutusScripts {
    return this.plutus_scripts_v2;
  }

  set_plutus_scripts_v2(plutus_scripts_v2: PlutusScripts): void {
    this.plutus_scripts_v2 = plutus_scripts_v2;
  }

  get_plutus_scripts_v3(): PlutusScripts {
    return this.plutus_scripts_v3;
  }

  set_plutus_scripts_v3(plutus_scripts_v3: PlutusScripts): void {
    this.plutus_scripts_v3 = plutus_scripts_v3;
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

  serialize(writer: CBORWriter) {
    let len = 5;

    writer.writeMapTag(len);

    writer.writeInt(0n);
    this.metadata.serialize(writer);

    writer.writeInt(1n);
    this.native_scripts.serialize(writer);

    writer.writeInt(2n);
    this.plutus_scripts_v1.serialize(writer);

    writer.writeInt(3n);
    this.plutus_scripts_v2.serialize(writer);

    writer.writeInt(4n);
    this.plutus_scripts_v3.serialize(writer);
  }
}

export class Vkeywitness {
  private vkey: unknown;
  private signature: unknown;

  constructor(vkey: unknown, signature: unknown) {
    this.vkey = vkey;
    this.signature = signature;
  }

  get_vkey(): unknown {
    return this.vkey;
  }

  set_vkey(vkey: unknown): void {
    this.vkey = vkey;
  }

  get_signature(): unknown {
    return this.signature;
  }

  set_signature(signature: unknown): void {
    this.signature = signature;
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

  static deserialize(reader: CBORReader): Vkeywitness {
    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let vkey = $$CANT_READ("Vkey");

    let signature = $$CANT_READ("Ed25519Signature");

    return new Vkeywitness(vkey, signature);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(2);

    $$CANT_WRITE("Vkey");
    $$CANT_WRITE("Ed25519Signature");
  }
}

export class BootstrapWitness {
  private vkey: unknown;
  private signature: unknown;
  private chain_code: Uint8Array;
  private attributes: Uint8Array;

  constructor(
    vkey: unknown,
    signature: unknown,
    chain_code: Uint8Array,
    attributes: Uint8Array,
  ) {
    this.vkey = vkey;
    this.signature = signature;
    this.chain_code = chain_code;
    this.attributes = attributes;
  }

  get_vkey(): unknown {
    return this.vkey;
  }

  set_vkey(vkey: unknown): void {
    this.vkey = vkey;
  }

  get_signature(): unknown {
    return this.signature;
  }

  set_signature(signature: unknown): void {
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

  static deserialize(reader: CBORReader): BootstrapWitness {
    let len = reader.readArrayTag();

    if (len != null && len < 4) {
      throw new Error(
        "Insufficient number of fields in record. Expected 4. Received " + len,
      );
    }

    let vkey = $$CANT_READ("VKey");

    let signature = $$CANT_READ("Ed25519Signature");

    let chain_code = reader.readBytes();

    let attributes = reader.readBytes();

    return new BootstrapWitness(vkey, signature, chain_code, attributes);
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(4);

    $$CANT_WRITE("VKey");
    $$CANT_WRITE("Ed25519Signature");
    writer.writeBytes(this.chain_code);
    writer.writeBytes(this.attributes);
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
}

export class ScriptPubname {
  private addr_keyhash: unknown;

  constructor(addr_keyhash: unknown) {
    this.addr_keyhash = addr_keyhash;
  }

  get_addr_keyhash(): unknown {
    return this.addr_keyhash;
  }

  set_addr_keyhash(addr_keyhash: unknown): void {
    this.addr_keyhash = addr_keyhash;
  }

  static deserialize(reader: CBORReader): ScriptPubname {
    let addr_keyhash = $$CANT_READ("Ed25519KeyHash");

    return new ScriptPubname(addr_keyhash);
  }

  serialize(writer: CBORWriter): void {
    $$CANT_WRITE("Ed25519KeyHash");
  }
}

export class ScriptAll {
  private native_scripts: NativeScripts;

  constructor(native_scripts: NativeScripts) {
    this.native_scripts = native_scripts;
  }

  get_native_scripts(): NativeScripts {
    return this.native_scripts;
  }

  set_native_scripts(native_scripts: NativeScripts): void {
    this.native_scripts = native_scripts;
  }

  static deserialize(reader: CBORReader): ScriptAll {
    let native_scripts = NativeScripts.deserialize(reader);

    return new ScriptAll(native_scripts);
  }

  serialize(writer: CBORWriter): void {
    this.native_scripts.serialize(writer);
  }
}

export class ScriptAny {
  private native_scripts: NativeScripts;

  constructor(native_scripts: NativeScripts) {
    this.native_scripts = native_scripts;
  }

  get_native_scripts(): NativeScripts {
    return this.native_scripts;
  }

  set_native_scripts(native_scripts: NativeScripts): void {
    this.native_scripts = native_scripts;
  }

  static deserialize(reader: CBORReader): ScriptAny {
    let native_scripts = NativeScripts.deserialize(reader);

    return new ScriptAny(native_scripts);
  }

  serialize(writer: CBORWriter): void {
    this.native_scripts.serialize(writer);
  }
}

export class ScriptNOfK {
  private n: number;
  private native_scripts: NativeScripts;

  constructor(n: number, native_scripts: NativeScripts) {
    this.n = n;
    this.native_scripts = native_scripts;
  }

  get_n(): number {
    return this.n;
  }

  set_n(n: number): void {
    this.n = n;
  }

  get_native_scripts(): NativeScripts {
    return this.native_scripts;
  }

  set_native_scripts(native_scripts: NativeScripts): void {
    this.native_scripts = native_scripts;
  }

  static deserialize(reader: CBORReader): ScriptNOfK {
    let n = Number(reader.readInt());

    let native_scripts = NativeScripts.deserialize(reader);

    return new ScriptNOfK(n, native_scripts);
  }

  serialize(writer: CBORWriter): void {
    writer.writeInt(BigInt(this.n));
    this.native_scripts.serialize(writer);
  }
}

export class TimelockStart {
  private slot: bigint;

  constructor(slot: bigint) {
    this.slot = slot;
  }

  get_slot(): bigint {
    return this.slot;
  }

  set_slot(slot: bigint): void {
    this.slot = slot;
  }

  static deserialize(reader: CBORReader): TimelockStart {
    let slot = reader.readInt();

    return new TimelockStart(slot);
  }

  serialize(writer: CBORWriter): void {
    writer.writeInt(this.slot);
  }
}

export class TimelockExpiry {
  private slot: bigint;

  constructor(slot: bigint) {
    this.slot = slot;
  }

  get_slot(): bigint {
    return this.slot;
  }

  set_slot(slot: bigint): void {
    this.slot = slot;
  }

  static deserialize(reader: CBORReader): TimelockExpiry {
    let slot = reader.readInt();

    return new TimelockExpiry(slot);
  }

  serialize(writer: CBORWriter): void {
    writer.writeInt(this.slot);
  }
}

export class AssetName {
  private inner: Uint8Array;

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

  serialize(writer: CBORWriter) {
    writer.writeBytes(this.inner);
  }
}

export enum NetworkIdKind {
  mainnet = 0,
  testnet = 1,
}

export class NetworkId {
  private kind_: NetworkIdKind;

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

  constructor(kind: NetworkIdKind) {
    this.kind_ = kind;
  }

  static new_mainnet(): NetworkId {
    return new NetworkId(0);
  }

  static new_testnet(): NetworkId {
    return new NetworkId(1);
  }

  static deserialize(reader: CBORReader): NetworkId {
    let kind = Number(reader.readInt());
    if (kind == 0) return new NetworkId(0);
    if (kind == 1) return new NetworkId(1);
    throw "Unrecognized enum value: " + kind + " for " + NetworkId;
  }

  serialize(writer: CBORWriter) {
    writer.writeInt(BigInt(this.kind_));
  }
}

export enum DataOptionKind {
  DataHash = 0,
  PlutusData = 1,
}

export type DataOptionVariant =
  | { kind: 0; value: unknown }
  | { kind: 1; value: unknown };

export class DataOption {
  private variant: DataOptionVariant;

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

  constructor(variant: DataOptionVariant) {
    this.variant = variant;
  }

  static new_hash(hash: unknown): DataOption {
    return new DataOption({ kind: 0, value: hash });
  }

  static new_data(data: unknown): DataOption {
    return new DataOption({ kind: 1, value: data });
  }

  as_hash(): unknown | undefined {
    if (this.variant.kind == 0) return this.variant.value;
  }

  as_data(): unknown | undefined {
    if (this.variant.kind == 1) return this.variant.value;
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
          value: $$CANT_READ("DataHash"),
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
        $$CANT_WRITE("DataHash");
        break;
      case 1:
        writer.writeArrayTag(2);
        writer.writeInt(BigInt(1));
        $$CANT_WRITE("PlutusData");
        break;
    }
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
}

export class UnitInterval {
  private numerator: bigint;
  private denominator: bigint;

  constructor(numerator: bigint, denominator: bigint) {
    this.numerator = numerator;
    this.denominator = denominator;
  }

  get_numerator(): bigint {
    return this.numerator;
  }

  set_numerator(numerator: bigint): void {
    this.numerator = numerator;
  }

  get_denominator(): bigint {
    return this.denominator;
  }

  set_denominator(denominator: bigint): void {
    this.denominator = denominator;
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

  static deserialize(reader: CBORReader): UnitInterval {
    let taggedTag = reader.readTaggedTag();
    if (taggedTag != 30) {
      throw new Error("Expected tag 30, got " + taggedTag);
    }

    let len = reader.readArrayTag();

    if (len != null && len < 2) {
      throw new Error(
        "Insufficient number of fields in record. Expected 2. Received " + len,
      );
    }

    let numerator = reader.readInt();

    let denominator = reader.readInt();

    return new UnitInterval(numerator, denominator);
  }

  serialize(writer: CBORWriter): void {
    writer.writeTaggedTag(30);

    writer.writeArrayTag(2);

    writer.writeInt(this.numerator);
    writer.writeInt(this.denominator);
  }
}
