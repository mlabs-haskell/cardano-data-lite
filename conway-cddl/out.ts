// todo: distinct tagged record

// todo: nonnegative_interval tagged record

// todo: unit_interval tagged record

// todo: nonempty_oset tagged record

// todo: nonempty_set tagged record

// todo: set tagged record

export class VrfCert extends CBORArray {
  static fromCBOR(value: CBORValue): VrfCert {
    let array = value.get("array");
    return array.map((x) => x.get("bstr"));
  }
}

// todo: script tagged record

// todo: script_ref tagged record

// todo: datum_option tagged record

// todo: data tagged record

// todo: network_id tagged record

// todo: value tagged record

// todo: nonZeroInt64 tagged record

// todo: multiasset tagged record

// todo: native_script tagged record

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

  static fromCBOR(value: CBORValue): BootstrapWitness {
    let array = value.get("array");
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

  toCBOR(writer: CBORWriter) {
    let entries = [];
    entries.push(this.public_key);
    entries.push(this.signature);
    entries.push(this.chain_code);
    entries.push(this.attributes);

    writer.writeMap(entries);
  }
}

export class Vkeywitness {
  private vkey: Vkey;
  private signature: Signature;

  constructor(vkey: Vkey, signature: Signature) {
    this.vkey = vkey;
    this.signature = signature;
  }

  static fromCBOR(value: CBORValue): Vkeywitness {
    let array = value.get("array");
    let vkey_ = array.shiftRequired();
    let vkey = Vkey.fromCBOR(vkey_);
    let signature_ = array.shiftRequired();
    let signature = Signature.fromCBOR(signature_);

    return new Vkeywitness(vkey, signature);
  }

  toCBOR(writer: CBORWriter) {
    let entries = [];
    entries.push(this.vkey);
    entries.push(this.signature);

    writer.writeMap(entries);
  }
}

// todo: auxiliary_data tagged record

export class Metadata extends CBORMap {
  static fromCBOR(value: CBORValue): Metadata {
    let map = value.get("map");
    return map.map({
      key: (x) => TransactionMetadatumLabel.fromCBOR(x),
      value: (x) => TransactionMetadatum.fromCBOR(x),
    });
  }
}

// todo: transaction_metadatum tagged record

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

  static fromCBOR(value: CBORValue): Costmdls {
    let map = value.get("map");
    let plutus_v1_ = map.get(0);
    let plutus_v1 = PlutusV1.fromCBOR(plutus_v1_);
    let plutus_v2_ = map.get(1);
    let plutus_v2 = PlutusV2.fromCBOR(plutus_v2_);
    let plutus_v3_ = map.get(2);
    let plutus_v3 = PlutusV3.fromCBOR(plutus_v3_);
    let other_ = map.get(3);
    let other = Other.fromCBOR(other_);

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

export class Other extends CBORArray {
  static fromCBOR(value: CBORValue): Other {
    let array = value.get("array");
    return array.map((x) => x.getInt());
  }
}

export class PlutusV3 extends CBORArray {
  static fromCBOR(value: CBORValue): PlutusV3 {
    let array = value.get("array");
    return array.map((x) => x.getInt());
  }
}

export class PlutusV2 extends CBORArray {
  static fromCBOR(value: CBORValue): PlutusV2 {
    let array = value.get("array");
    return array.map((x) => x.getInt());
  }
}

export class PlutusV1 extends CBORArray {
  static fromCBOR(value: CBORValue): PlutusV1 {
    let array = value.get("array");
    return array.map((x) => x.getInt());
  }
}

// todo: language tagged record

export class ExUnitPrices {
  private mem_price: NonnegativeInterval;
  private step_price: NonnegativeInterval;

  constructor(mem_price: NonnegativeInterval, step_price: NonnegativeInterval) {
    this.mem_price = mem_price;
    this.step_price = step_price;
  }

  static fromCBOR(value: CBORValue): ExUnitPrices {
    let array = value.get("array");
    let mem_price_ = array.shiftRequired();
    let mem_price = NonnegativeInterval.fromCBOR(mem_price_);
    let step_price_ = array.shiftRequired();
    let step_price = NonnegativeInterval.fromCBOR(step_price_);

    return new ExUnitPrices(mem_price, step_price);
  }

  toCBOR(writer: CBORWriter) {
    let entries = [];
    entries.push(this.mem_price);
    entries.push(this.step_price);

    writer.writeMap(entries);
  }
}

export class ExUnits {
  private mem: number;
  private steps: number;

  constructor(mem: number, steps: number) {
    this.mem = mem;
    this.steps = steps;
  }

  static fromCBOR(value: CBORValue): ExUnits {
    let array = value.get("array");
    let mem_ = array.shiftRequired();
    let mem = mem_.get("uint");
    let steps_ = array.shiftRequired();
    let steps = steps_.get("uint");

    return new ExUnits(mem, steps);
  }

  toCBOR(writer: CBORWriter) {
    let entries = [];
    entries.push(this.mem);
    entries.push(this.steps);

    writer.writeMap(entries);
  }
}

// todo: redeemer_tag tagged record

// todo: redeemers tagged record

// todo: constr tagged record

// todo: big_nint tagged record

// todo: big_uint tagged record

// todo: big_int tagged record

// todo: plutus_data tagged record

export class TransactionWitnessSet {
  private vkeywitnesses: unknown_generic_apply;
  private native_scripts: unknown_generic_apply;
  private bootstrap_witnesses: unknown_generic_apply;
  private plutus_v1_scripts: unknown_generic_apply;
  private plutus_data: PlutusData;
  private redeemers: Redeemers;
  private plutus_v2_scripts: unknown_generic_apply;
  private plutus_v3_scripts: unknown_generic_apply;

  constructor(
    vkeywitnesses: unknown_generic_apply,
    native_scripts: unknown_generic_apply,
    bootstrap_witnesses: unknown_generic_apply,
    plutus_v1_scripts: unknown_generic_apply,
    plutus_data: PlutusData,
    redeemers: Redeemers,
    plutus_v2_scripts: unknown_generic_apply,
    plutus_v3_scripts: unknown_generic_apply,
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

  static fromCBOR(value: CBORValue): TransactionWitnessSet {
    let map = value.get("map");
    let vkeywitnesses_ = map.get(0);
    let vkeywitnesses = null;
    let native_scripts_ = map.get(1);
    let native_scripts = null;
    let bootstrap_witnesses_ = map.get(2);
    let bootstrap_witnesses = null;
    let plutus_v1_scripts_ = map.get(3);
    let plutus_v1_scripts = null;
    let plutus_data_ = map.get(4);
    let plutus_data = PlutusData.fromCBOR(plutus_data_);
    let redeemers_ = map.get(5);
    let redeemers = Redeemers.fromCBOR(redeemers_);
    let plutus_v2_scripts_ = map.get(6);
    let plutus_v2_scripts = null;
    let plutus_v3_scripts_ = map.get(7);
    let plutus_v3_scripts = null;

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

  static fromCBOR(value: CBORValue): DrepVotingThresholds {
    let array = value.get("array");
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

  toCBOR(writer: CBORWriter) {
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

  static fromCBOR(value: CBORValue): PoolVotingThresholds {
    let array = value.get("array");
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

  toCBOR(writer: CBORWriter) {
    let entries = [];
    entries.push(this.motion_no_confidence);
    entries.push(this.committee_normal);
    entries.push(this.committee_no_confidence);
    entries.push(this.hard_fork_initiation);
    entries.push(this.security_relevant_parameter_voting_threshold);

    writer.writeMap(entries);
  }
}

export class ProtocolParamUpdate {
  private minfee_a: Coin;
  private minfee_b: Coin;
  private max_block_body_size: number;
  private max_tx_size: number;
  private max_block_header_size: number;
  private key_deposit: Coin;
  private pool_deposit: Coin;
  private max_epoch: Epoch;
  private n_opt: number;
  private pool_pledge_influence: NonnegativeInterval;
  private expansion_rate: UnitInterval;
  private treasury_growth_rate: UnitInterval;
  private min_pool_cost: Coin;
  private ada_per_utxo_byte: Coin;
  private costmdls: Costmdls;
  private ex_unit_prices: ExUnitPrices;
  private max_tx_ex_units: unknown_max_tx_ex_units;
  private max_block_ex_units: unknown_max_block_ex_units;
  private max_value_size: number;
  private collateral_percentage: number;
  private max_collateral_inputs: number;
  private pool_voting_thresholds: PoolVotingThresholds;
  private drep_voting_thresholds: DrepVotingThresholds;
  private min_committee_size: number;
  private committee_term_limit: Epoch;
  private governance_action_validity_period: Epoch;
  private governance_action_deposit: Coin;
  private drep_deposit: Coin;
  private drep_inactivity_period: Epoch;
  private min_fee_ref_script_cost_per_byte: NonnegativeInterval;

  constructor(
    minfee_a: Coin,
    minfee_b: Coin,
    max_block_body_size: number,
    max_tx_size: number,
    max_block_header_size: number,
    key_deposit: Coin,
    pool_deposit: Coin,
    max_epoch: Epoch,
    n_opt: number,
    pool_pledge_influence: NonnegativeInterval,
    expansion_rate: UnitInterval,
    treasury_growth_rate: UnitInterval,
    min_pool_cost: Coin,
    ada_per_utxo_byte: Coin,
    costmdls: Costmdls,
    ex_unit_prices: ExUnitPrices,
    max_tx_ex_units: unknown_max_tx_ex_units,
    max_block_ex_units: unknown_max_block_ex_units,
    max_value_size: number,
    collateral_percentage: number,
    max_collateral_inputs: number,
    pool_voting_thresholds: PoolVotingThresholds,
    drep_voting_thresholds: DrepVotingThresholds,
    min_committee_size: number,
    committee_term_limit: Epoch,
    governance_action_validity_period: Epoch,
    governance_action_deposit: Coin,
    drep_deposit: Coin,
    drep_inactivity_period: Epoch,
    min_fee_ref_script_cost_per_byte: NonnegativeInterval,
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

  static fromCBOR(value: CBORValue): ProtocolParamUpdate {
    let map = value.get("map");
    let minfee_a_ = map.getOptional(0);
    let minfee_a = Coin.fromCBOR(minfee_a_);
    let minfee_b_ = map.getOptional(1);
    let minfee_b = Coin.fromCBOR(minfee_b_);
    let max_block_body_size_ = map.getOptional(2);
    let max_block_body_size = max_block_body_size_.get("uint");
    let max_tx_size_ = map.getOptional(3);
    let max_tx_size = max_tx_size_.get("uint");
    let max_block_header_size_ = map.getOptional(4);
    let max_block_header_size = max_block_header_size_.get("uint");
    let key_deposit_ = map.getOptional(5);
    let key_deposit = Coin.fromCBOR(key_deposit_);
    let pool_deposit_ = map.getOptional(6);
    let pool_deposit = Coin.fromCBOR(pool_deposit_);
    let max_epoch_ = map.getOptional(7);
    let max_epoch = Epoch.fromCBOR(max_epoch_);
    let n_opt_ = map.getOptional(8);
    let n_opt = n_opt_.get("uint");
    let pool_pledge_influence_ = map.getOptional(9);
    let pool_pledge_influence = NonnegativeInterval.fromCBOR(
      pool_pledge_influence_,
    );
    let expansion_rate_ = map.getOptional(10);
    let expansion_rate = UnitInterval.fromCBOR(expansion_rate_);
    let treasury_growth_rate_ = map.getOptional(11);
    let treasury_growth_rate = UnitInterval.fromCBOR(treasury_growth_rate_);
    let min_pool_cost_ = map.getOptional(16);
    let min_pool_cost = Coin.fromCBOR(min_pool_cost_);
    let ada_per_utxo_byte_ = map.getOptional(17);
    let ada_per_utxo_byte = Coin.fromCBOR(ada_per_utxo_byte_);
    let costmdls_ = map.getOptional(18);
    let costmdls = Costmdls.fromCBOR(costmdls_);
    let ex_unit_prices_ = map.getOptional(19);
    let ex_unit_prices = ExUnitPrices.fromCBOR(ex_unit_prices_);
    let max_tx_ex_units_ = map.getOptional(20);
    let max_tx_ex_units = null;
    let max_block_ex_units_ = map.getOptional(21);
    let max_block_ex_units = null;
    let max_value_size_ = map.getOptional(22);
    let max_value_size = max_value_size_.get("uint");
    let collateral_percentage_ = map.getOptional(23);
    let collateral_percentage = collateral_percentage_.get("uint");
    let max_collateral_inputs_ = map.getOptional(24);
    let max_collateral_inputs = max_collateral_inputs_.get("uint");
    let pool_voting_thresholds_ = map.getOptional(25);
    let pool_voting_thresholds = PoolVotingThresholds.fromCBOR(
      pool_voting_thresholds_,
    );
    let drep_voting_thresholds_ = map.getOptional(26);
    let drep_voting_thresholds = DrepVotingThresholds.fromCBOR(
      drep_voting_thresholds_,
    );
    let min_committee_size_ = map.getOptional(27);
    let min_committee_size = min_committee_size_.get("uint");
    let committee_term_limit_ = map.getOptional(28);
    let committee_term_limit = Epoch.fromCBOR(committee_term_limit_);
    let governance_action_validity_period_ = map.getOptional(29);
    let governance_action_validity_period = Epoch.fromCBOR(
      governance_action_validity_period_,
    );
    let governance_action_deposit_ = map.getOptional(30);
    let governance_action_deposit = Coin.fromCBOR(governance_action_deposit_);
    let drep_deposit_ = map.getOptional(31);
    let drep_deposit = Coin.fromCBOR(drep_deposit_);
    let drep_inactivity_period_ = map.getOptional(32);
    let drep_inactivity_period = Epoch.fromCBOR(drep_inactivity_period_);
    let min_fee_ref_script_cost_per_byte_ = map.getOptional(33);
    let min_fee_ref_script_cost_per_byte = NonnegativeInterval.fromCBOR(
      min_fee_ref_script_cost_per_byte_,
    );

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

export class Withdrawals extends CBORMap {
  static fromCBOR(value: CBORValue): Withdrawals {
    let map = value.get("map");
    return map.map({
      key: (x) => RewardAccount.fromCBOR(x),
      value: (x) => Coin.fromCBOR(x),
    });
  }
}

export class PoolMetadata {
  private url: Url;
  private pool_metadata_hash: PoolMetadataHash;

  constructor(url: Url, pool_metadata_hash: PoolMetadataHash) {
    this.url = url;
    this.pool_metadata_hash = pool_metadata_hash;
  }

  static fromCBOR(value: CBORValue): PoolMetadata {
    let array = value.get("array");
    let url_ = array.shiftRequired();
    let url = Url.fromCBOR(url_);
    let pool_metadata_hash_ = array.shiftRequired();
    let pool_metadata_hash = PoolMetadataHash.fromCBOR(pool_metadata_hash_);

    return new PoolMetadata(url, pool_metadata_hash);
  }

  toCBOR(writer: CBORWriter) {
    let entries = [];
    entries.push(this.url);
    entries.push(this.pool_metadata_hash);

    writer.writeMap(entries);
  }
}

// todo: relay tagged record

// todo: drep tagged record

// todo: credential tagged record

// todo: certificate tagged record

// todo: transaction_output tagged record

export class TransactionInput {
  private transaction_id: Hash32;
  private index: number;

  constructor(transaction_id: Hash32, index: number) {
    this.transaction_id = transaction_id;
    this.index = index;
  }

  static fromCBOR(value: CBORValue): TransactionInput {
    let array = value.get("array");
    let transaction_id_ = array.shiftRequired();
    let transaction_id = Hash32.fromCBOR(transaction_id_);
    let index_ = array.shiftRequired();
    let index = index_.get("uint");

    return new TransactionInput(transaction_id, index);
  }

  toCBOR(writer: CBORWriter) {
    let entries = [];
    entries.push(this.transaction_id);
    entries.push(this.index);

    writer.writeMap(entries);
  }
}

export class GovActionId {
  private transaction_id: Hash32;
  private gov_action_index: number;

  constructor(transaction_id: Hash32, gov_action_index: number) {
    this.transaction_id = transaction_id;
    this.gov_action_index = gov_action_index;
  }

  static fromCBOR(value: CBORValue): GovActionId {
    let array = value.get("array");
    let transaction_id_ = array.shiftRequired();
    let transaction_id = Hash32.fromCBOR(transaction_id_);
    let gov_action_index_ = array.shiftRequired();
    let gov_action_index = gov_action_index_.get("uint");

    return new GovActionId(transaction_id, gov_action_index);
  }

  toCBOR(writer: CBORWriter) {
    let entries = [];
    entries.push(this.transaction_id);
    entries.push(this.gov_action_index);

    writer.writeMap(entries);
  }
}

// todo: vote tagged record

export class Anchor {
  private anchor_url: Url;
  private anchor_data_hash: Hash32;

  constructor(anchor_url: Url, anchor_data_hash: Hash32) {
    this.anchor_url = anchor_url;
    this.anchor_data_hash = anchor_data_hash;
  }

  static fromCBOR(value: CBORValue): Anchor {
    let array = value.get("array");
    let anchor_url_ = array.shiftRequired();
    let anchor_url = Url.fromCBOR(anchor_url_);
    let anchor_data_hash_ = array.shiftRequired();
    let anchor_data_hash = Hash32.fromCBOR(anchor_data_hash_);

    return new Anchor(anchor_url, anchor_data_hash);
  }

  toCBOR(writer: CBORWriter) {
    let entries = [];
    entries.push(this.anchor_url);
    entries.push(this.anchor_data_hash);

    writer.writeMap(entries);
  }
}

// todo: voter tagged record

export class Constitution {
  private anchor: Anchor;
  private scripthash: unknown_nullable;

  constructor(anchor: Anchor, scripthash: unknown_nullable) {
    this.anchor = anchor;
    this.scripthash = scripthash;
  }

  static fromCBOR(value: CBORValue): Constitution {
    let array = value.get("array");
    let anchor_ = array.shiftRequired();
    let anchor = Anchor.fromCBOR(anchor_);
    let scripthash_ = array.shiftRequired();
    let scripthash = null;

    return new Constitution(anchor, scripthash);
  }

  toCBOR(writer: CBORWriter) {
    let entries = [];
    entries.push(this.anchor);
    entries.push(this.scripthash);

    writer.writeMap(entries);
  }
}

// todo: gov_action tagged record

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

  static fromCBOR(value: CBORValue): ProposalProcedure {
    let array = value.get("array");
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

  toCBOR(writer: CBORWriter) {
    let entries = [];
    entries.push(this.deposit);
    entries.push(this.reward_account);
    entries.push(this.gov_action);
    entries.push(this.anchor);

    writer.writeMap(entries);
  }
}

export class VotingProcedure {
  private vote: Vote;
  private anchor: unknown_nullable;

  constructor(vote: Vote, anchor: unknown_nullable) {
    this.vote = vote;
    this.anchor = anchor;
  }

  static fromCBOR(value: CBORValue): VotingProcedure {
    let array = value.get("array");
    let vote_ = array.shiftRequired();
    let vote = Vote.fromCBOR(vote_);
    let anchor_ = array.shiftRequired();
    let anchor = null;

    return new VotingProcedure(vote, anchor);
  }

  toCBOR(writer: CBORWriter) {
    let entries = [];
    entries.push(this.vote);
    entries.push(this.anchor);

    writer.writeMap(entries);
  }
}

export class VotingProcedures extends CBORMap {
  static fromCBOR(value: CBORValue): VotingProcedures {
    let map = value.get("map");
    return map.map({
      key: (x) => Voter.fromCBOR(x),
      value: (x) => null,
    });
  }
}

export class TransactionBody {
  private inputs: unknown_generic_apply;
  private transaction_outputs: TransactionOutputs;
  private fee: Coin;
  private time_to_live: number;
  private certificates: Certificates;
  private withdrawals: Withdrawals;
  private auxiliary_data_hash: AuxiliaryDataHash;
  private validity_interval_start: number;
  private mint: Mint;
  private script_data_hash: ScriptDataHash;
  private collateral_inputs: unknown_generic_apply;
  private required_signers: RequiredSigners;
  private network_id: NetworkId;
  private collateral_return: TransactionOutput;
  private total_collateral: Coin;
  private reference_inputs: unknown_generic_apply;
  private voting_procedures: VotingProcedures;
  private proposal_procedures: ProposalProcedures;
  private current_treasury_value: Coin;
  private donation: unknown_positive_coin;

  constructor(
    inputs: unknown_generic_apply,
    transaction_outputs: TransactionOutputs,
    fee: Coin,
    time_to_live: number,
    certificates: Certificates,
    withdrawals: Withdrawals,
    auxiliary_data_hash: AuxiliaryDataHash,
    validity_interval_start: number,
    mint: Mint,
    script_data_hash: ScriptDataHash,
    collateral_inputs: unknown_generic_apply,
    required_signers: RequiredSigners,
    network_id: NetworkId,
    collateral_return: TransactionOutput,
    total_collateral: Coin,
    reference_inputs: unknown_generic_apply,
    voting_procedures: VotingProcedures,
    proposal_procedures: ProposalProcedures,
    current_treasury_value: Coin,
    donation: unknown_positive_coin,
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

  static fromCBOR(value: CBORValue): TransactionBody {
    let map = value.get("map");
    let inputs_ = map.get(0);
    let inputs = null;
    let transaction_outputs_ = map.get(1);
    let transaction_outputs = TransactionOutputs.fromCBOR(transaction_outputs_);
    let fee_ = map.get(2);
    let fee = Coin.fromCBOR(fee_);
    let time_to_live_ = map.getOptional(3);
    let time_to_live = time_to_live_.get("uint");
    let certificates_ = map.getOptional(4);
    let certificates = Certificates.fromCBOR(certificates_);
    let withdrawals_ = map.getOptional(5);
    let withdrawals = Withdrawals.fromCBOR(withdrawals_);
    let auxiliary_data_hash_ = map.getOptional(7);
    let auxiliary_data_hash = AuxiliaryDataHash.fromCBOR(auxiliary_data_hash_);
    let validity_interval_start_ = map.getOptional(8);
    let validity_interval_start = validity_interval_start_.get("uint");
    let mint_ = map.getOptional(9);
    let mint = Mint.fromCBOR(mint_);
    let script_data_hash_ = map.getOptional(11);
    let script_data_hash = ScriptDataHash.fromCBOR(script_data_hash_);
    let collateral_inputs_ = map.getOptional(13);
    let collateral_inputs = null;
    let required_signers_ = map.getOptional(14);
    let required_signers = RequiredSigners.fromCBOR(required_signers_);
    let network_id_ = map.getOptional(15);
    let network_id = NetworkId.fromCBOR(network_id_);
    let collateral_return_ = map.getOptional(16);
    let collateral_return = TransactionOutput.fromCBOR(collateral_return_);
    let total_collateral_ = map.getOptional(17);
    let total_collateral = Coin.fromCBOR(total_collateral_);
    let reference_inputs_ = map.getOptional(18);
    let reference_inputs = null;
    let voting_procedures_ = map.getOptional(19);
    let voting_procedures = VotingProcedures.fromCBOR(voting_procedures_);
    let proposal_procedures_ = map.getOptional(20);
    let proposal_procedures = ProposalProcedures.fromCBOR(proposal_procedures_);
    let current_treasury_value_ = map.getOptional(21);
    let current_treasury_value = Coin.fromCBOR(current_treasury_value_);
    let donation_ = map.getOptional(22);
    let donation = null;

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

export class TransactionOutputs extends CBORArray {
  static fromCBOR(value: CBORValue): TransactionOutputs {
    let array = value.get("array");
    return array.map((x) => TransactionOutput.fromCBOR(x));
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

  static fromCBOR(value: CBORValue): ProtocolVersion {
    let array = value.get("array");
    let major_protocol_version_ = array.shiftRequired();
    let major_protocol_version = MajorProtocolVersion.fromCBOR(
      major_protocol_version_,
    );
    let minor_protocol_version_ = array.shiftRequired();
    let minor_protocol_version = minor_protocol_version_.get("uint");

    return new ProtocolVersion(major_protocol_version, minor_protocol_version);
  }

  toCBOR(writer: CBORWriter) {
    let entries = [];
    entries.push(this.major_protocol_version);
    entries.push(this.minor_protocol_version);

    writer.writeMap(entries);
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

  static fromCBOR(value: CBORValue): OperationalCert {
    let array = value.get("array");
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

  toCBOR(writer: CBORWriter) {
    let entries = [];
    entries.push(this.hot_vkey);
    entries.push(this.sequence_number);
    entries.push(this.kes_period);
    entries.push(this.sigma);

    writer.writeMap(entries);
  }
}

export class HeaderBody {
  private block_number: number;
  private slot: number;
  private prev_hash: unknown_nullable;
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
    prev_hash: unknown_nullable,
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

  static fromCBOR(value: CBORValue): HeaderBody {
    let array = value.get("array");
    let block_number_ = array.shiftRequired();
    let block_number = block_number_.get("uint");
    let slot_ = array.shiftRequired();
    let slot = slot_.get("uint");
    let prev_hash_ = array.shiftRequired();
    let prev_hash = null;
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

  toCBOR(writer: CBORWriter) {
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

    writer.writeMap(entries);
  }
}

export class Header {
  private header_body: HeaderBody;
  private body_signature: KesSignature;

  constructor(header_body: HeaderBody, body_signature: KesSignature) {
    this.header_body = header_body;
    this.body_signature = body_signature;
  }

  static fromCBOR(value: CBORValue): Header {
    let array = value.get("array");
    let header_body_ = array.shiftRequired();
    let header_body = HeaderBody.fromCBOR(header_body_);
    let body_signature_ = array.shiftRequired();
    let body_signature = KesSignature.fromCBOR(body_signature_);

    return new Header(header_body, body_signature);
  }

  toCBOR(writer: CBORWriter) {
    let entries = [];
    entries.push(this.header_body);
    entries.push(this.body_signature);

    writer.writeMap(entries);
  }
}

export class Transaction {
  private transaction_body: TransactionBody;
  private transaction_witness_set: TransactionWitnessSet;
  private is_valid: unknown_boolean;
  private auxiliary_data: unknown_nullable;

  constructor(
    transaction_body: TransactionBody,
    transaction_witness_set: TransactionWitnessSet,
    is_valid: unknown_boolean,
    auxiliary_data: unknown_nullable,
  ) {
    this.transaction_body = transaction_body;
    this.transaction_witness_set = transaction_witness_set;
    this.is_valid = is_valid;
    this.auxiliary_data = auxiliary_data;
  }

  static fromCBOR(value: CBORValue): Transaction {
    let array = value.get("array");
    let transaction_body_ = array.shiftRequired();
    let transaction_body = TransactionBody.fromCBOR(transaction_body_);
    let transaction_witness_set_ = array.shiftRequired();
    let transaction_witness_set = TransactionWitnessSet.fromCBOR(
      transaction_witness_set_,
    );
    let is_valid_ = array.shiftRequired();
    let is_valid = null;
    let auxiliary_data_ = array.shiftRequired();
    let auxiliary_data = null;

    return new Transaction(
      transaction_body,
      transaction_witness_set,
      is_valid,
      auxiliary_data,
    );
  }

  toCBOR(writer: CBORWriter) {
    let entries = [];
    entries.push(this.transaction_body);
    entries.push(this.transaction_witness_set);
    entries.push(this.is_valid);
    entries.push(this.auxiliary_data);

    writer.writeMap(entries);
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

  static fromCBOR(value: CBORValue): Block {
    let array = value.get("array");
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

  toCBOR(writer: CBORWriter) {
    let entries = [];
    entries.push(this.header);
    entries.push(this.transaction_bodies);
    entries.push(this.transaction_witness_sets);
    entries.push(this.auxiliary_data_set);
    entries.push(this.invalid_transactions);

    writer.writeMap(entries);
  }
}

export class InvalidTransactions extends CBORArray {
  static fromCBOR(value: CBORValue): InvalidTransactions {
    let array = value.get("array");
    return array.map((x) => TransactionIndex.fromCBOR(x));
  }
}

export class AuxiliaryDataSet extends CBORMap {
  static fromCBOR(value: CBORValue): AuxiliaryDataSet {
    let map = value.get("map");
    return map.map({
      key: (x) => TransactionIndex.fromCBOR(x),
      value: (x) => AuxiliaryData.fromCBOR(x),
    });
  }
}

export class TransactionWitnessSets extends CBORArray {
  static fromCBOR(value: CBORValue): TransactionWitnessSets {
    let array = value.get("array");
    return array.map((x) => TransactionWitnessSet.fromCBOR(x));
  }
}

export class TransactionBodies extends CBORArray {
  static fromCBOR(value: CBORValue): TransactionBodies {
    let array = value.get("array");
    return array.map((x) => TransactionBody.fromCBOR(x));
  }
}
