import { GrowableBuffer } from "../cbor/growable-buffer";
import {
  bigintFromBytes,
  CBORArrayReader,
  CBORReaderValue,
  ParseFailed,
} from "../cbor/reader";
import {
  CBORCustom,
  CBORMap,
  CBORMultiMap,
  CBORTagged,
  CBORValue,
} from "../cbor/types";
import { CBORWriter } from "../cbor/writer";
import { NonZeroBigIntMap, PositiveBigIntMap } from "./common";
import { Bytes, Bytes28, Bytes32, Hash28, Hash32, Signature } from "./crypto";
import {
  BoundedBytes,
  ConwaySet,
  NonNegativeInterval,
  RewardAccount,
  UnitInterval,
} from "./extra";

function mapOptional<T, U>(
  value: T | undefined,
  fn: (v: T) => U
): U | undefined {
  return value != null ? fn(value) : undefined;
}

// pool_params = ( operator:       pool_keyhash
//               , vrf_keyhash:    vrf_keyhash
//               , pledge:         coin
//               , cost:           coin
//               , margin:         unit_interval
//               , reward_account: reward_account
//               , pool_owners:    set<addr_keyhash>
//               , relays:         [* relay]
//               , pool_metadata:  pool_metadata / null
//               )
export class PoolParams {
  public readonly operator: PoolKeyHash;
  public readonly vrfKeyhash: VrfKeyHash;
  public readonly pledge: Coin;
  public readonly cost: Coin;
  public readonly margin: UnitInterval;
  public readonly rewardAccount: RewardAccount;
  public readonly poolOwners: ConwaySet<AddrKeyHash>;
  public readonly relays: Relay[];
  public readonly poolMetadata: PoolMetadata | null;

  constructor(
    operator: PoolKeyHash,
    vrfKeyhash: VrfKeyHash,
    pledge: Coin,
    cost: Coin,
    margin: UnitInterval,
    rewardAccount: RewardAccount,
    poolOwners: ConwaySet<AddrKeyHash>,
    relays: Relay[],
    poolMetadata: PoolMetadata | null
  ) {
    this.operator = operator;
    this.vrfKeyhash = vrfKeyhash;
    this.pledge = pledge;
    this.cost = cost;
    this.margin = margin;
    this.rewardAccount = rewardAccount;
    this.poolOwners = poolOwners;
    this.relays = relays;
    this.poolMetadata = poolMetadata;
  }

  static fromCBOR(array: CBORArrayReader<CBORReaderValue>): PoolParams {
    const operator = Bytes28.fromCBOR(array.shiftRequired());
    const vrfKeyHash = Bytes32.fromCBOR(array.shiftRequired());
    const pledge = array.shiftRequired().get("uint");
    const cost = array.shiftRequired().get("uint");
    const margin = UnitInterval.fromCBOR(array.shiftRequired());
    const rewardAccount = array.shiftRequired().get("bstr");
    const poolOwners = ConwaySet.fromCBOR(array.shiftRequired()).map(
      Bytes32.fromCBOR
    );
    const relays = array.shiftRequired().get("array").map(Relay.fromCBOR);
    let poolMetadataCBOR = array.shiftRequired();
    const poolMetadata = poolMetadataCBOR.getChoice({
      array: () => PoolMetadata.fromCBOR(poolMetadataCBOR),
      null: () => null,
    });
    return new PoolParams(
      operator,
      vrfKeyHash,
      pledge,
      cost,
      margin,
      rewardAccount,
      poolOwners,
      relays,
      poolMetadata
    );
  }

  toCBOR(): CBORValue[] {
    return [
      this.operator,
      this.vrfKeyhash,
      this.pledge,
      this.cost,
      this.margin,
      this.rewardAccount,
      this.poolOwners,
      this.relays,
      this.poolMetadata,
    ];
  }
}

export class Port implements CBORCustom {
  public readonly value: bigint;
  constructor(value: bigint) {
    if (value < 0 || value > 65535) {
      throw new Error("Invalid Port value");
    }
    this.value = value;
  }

  static fromCBOR(value: CBORReaderValue): Port {
    return new Port(value.get("uint"));
  }

  toCBOR(writer: CBORWriter) {
    writer.writeBigInt(BigInt(this.value));
  }
}

export class IPv4 implements CBORCustom {
  public readonly value: Uint8Array;
  constructor(value: Uint8Array) {
    if (value.length != 4) {
      throw new Error("Invalid IPv4 value");
    }
    for (let x of value) {
      if (x < 0 || x > 255) {
        throw new Error("Invalid IPv4 value");
      }
    }
    this.value = new Uint8Array([...value]);
  }

  static fromCBOR(value: CBORReaderValue): IPv4 {
    return new IPv4(value.get("bstr"));
  }

  toCBOR(writer: CBORWriter) {
    writer.writeBinary(new Uint8Array(this.value));
  }
}

export class IPv6 implements CBORCustom {
  public readonly value: Uint8Array;
  constructor(value: Uint8Array) {
    if (value.length != 16) {
      throw new Error("Invalid IPv6 value");
    }
    for (let x of value) {
      if (x < 0 || x > 255 || Math.floor(x) != x) {
        throw new Error("Invalid IPv6 value");
      }
    }
    this.value = new Uint8Array([...value]);
  }

  static fromCBOR(value: CBORReaderValue): IPv6 {
    return new IPv6(value.get("bstr"));
  }

  toCBOR(writer: CBORWriter) {
    writer.writeBinary(new Uint8Array(this.value));
  }
}

export type DNSName = string;

export type RelayVariant =
  | {
    kind: "single_host_addr";
    value: {
      port: Port | null;
      ipv4: IPv4 | null;
      ipv6: IPv6 | null;
    };
  }
  | {
    kind: "single_host_name";
    value: {
      port: Port | null;
      dns_name: DNSName;
    };
  }
  | {
    kind: "multi_host_name";
    value: {
      dns_name: DNSName;
    };
  };

export class Relay implements CBORCustom {
  public readonly variant: RelayVariant;

  constructor(variant: RelayVariant) {
    this.variant = variant;
  }

  static fromCBOR(value: CBORReaderValue): Relay {
    let array = value.get("array");

    let variant: RelayVariant;

    let tag = Number(array.shiftRequired().get("uint"));
    if (tag == 0) {
      variant = {
        kind: "single_host_addr",
        value: {
          port: array
            .shiftRequired()
            .getChoice({ uint: (uint) => new Port(uint), null: () => null }),
          ipv4: array.shiftRequired().getChoice({
            bstr: (bstr) => new IPv4(bstr),
            null: () => null,
          }),
          ipv6: array.shiftRequired().getChoice({
            bstr: (bstr) => new IPv6(bstr),
            null: () => null,
          }),
        },
      };
    } else if (tag == 1) {
      variant = {
        kind: "single_host_name",
        value: {
          port: array
            .getRequired(1)
            .getChoice({ uint: (x) => new Port(x), null: () => null }),
          dns_name: array.shiftRequired().get("tstr"),
        },
      };
    } else if (tag == 2) {
      variant = {
        kind: "multi_host_name",
        value: {
          dns_name: array.shiftRequired().get("tstr"),
        },
      };
    } else {
      throw new ParseFailed(value.path, "value", "tag: 0|1|2", tag.toString());
    }
    return new Relay(variant);
  }

  toCBOR(writer: CBORWriter) {
    let array: CBORValue;
    switch (this.variant.kind) {
      case "single_host_addr":
        array = [
          0n,
          this.variant.value.port,
          this.variant.value.ipv4,
          this.variant.value.ipv6,
        ];
        break;
      case "single_host_name":
        array = [1n, this.variant.value.port, this.variant.value.dns_name];
        break;
      case "multi_host_name":
        array = [2n, this.variant.value.dns_name];
        break;
    }
    writer.writeArray(array);
  }
}

export class PoolMetadata implements CBORCustom {
  public readonly url: URL;
  public readonly hash: PoolMetadataHash;

  constructor(url: URL, hash: PoolMetadataHash) {
    this.url = url;
    this.hash = hash;
  }

  static fromCBOR(value: CBORReaderValue): PoolMetadata {
    let array = value.get("array");
    return new PoolMetadata(
      array.shiftRequired().get("tstr"),
      Bytes28.fromCBOR(array.shiftRequired())
    );
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray([this.url, this.hash]);
  }
}

export type URL = string;

export type Withdrawals = CBORMap<RewardAccount, Coin>;

export class ProtocolParamUpdate {
  public minFeeA?: Coin;
  public minFeeB?: Coin;
  public maxBlockBodySize?: bigint;
  public maxTransactionSize?: bigint;
  public maxBlockHeaderSize?: bigint;
  public keyDeposit?: Coin;
  public poolDeposit?: Coin;
  public maximumEpoch?: Epoch;
  public desiredNumberOfStakePools?: bigint;
  public poolPledgeInfluence?: NonNegativeInterval;
  public expansionRate?: UnitInterval;
  public treasuryGrowthRate?: UnitInterval;
  public minPoolCost?: Coin;
  public adaPerUtxoByte?: Coin;
  public costModelsForScriptLanguages?: Costmdls;
  public executionCosts?: ExUnitPrices;
  public maxTxExUnits?: ExUnits;
  public maxBlockExUnits?: ExUnits;
  public maxValueSize?: bigint;
  public collateralPercentage?: bigint;
  public maxCollateralInputs?: bigint;
  public poolVotingThresholds?: PoolVotingThresholds;
  public drepVotingThresholds?: DrepVotingThresholds;
  public minCommitteeSize?: bigint;
  public committeeTermLimit?: Epoch;
  public governanceActionValidityPeriod?: Epoch;
  public governanceActionDeposit?: Coin;
  public drepDeposit?: Coin;
  public drepInactivityPeriod?: Epoch;
  public minFeeRefScriptCostPerByte?: NonNegativeInterval;

  constructor(options: {
    minFeeA?: Coin;
    minFeeB?: Coin;
    maxBlockBodySize?: bigint;
    maxTransactionSize?: bigint;
    maxBlockHeaderSize?: bigint;
    keyDeposit?: Coin;
    poolDeposit?: Coin;
    maximumEpoch?: Epoch;
    desiredNumberOfStakePools?: bigint;
    poolPledgeInfluence?: NonNegativeInterval;
    expansionRate?: UnitInterval;
    treasuryGrowthRate?: UnitInterval;
    minPoolCost?: Coin;
    adaPerUtxoByte?: Coin;
    costModelsForScriptLanguages?: Costmdls;
    executionCosts?: ExUnitPrices;
    maxTxExUnits?: ExUnits;
    maxBlockExUnits?: ExUnits;
    maxValueSize?: bigint;
    collateralPercentage?: bigint;
    maxCollateralInputs?: bigint;
    poolVotingThresholds?: PoolVotingThresholds;
    drepVotingThresholds?: DrepVotingThresholds;
    minCommitteeSize?: bigint;
    committeeTermLimit?: Epoch;
    governanceActionValidityPeriod?: Epoch;
    governanceActionDeposit?: Coin;
    drepDeposit?: Coin;
    drepInactivityPeriod?: Epoch;
    minFeeRefScriptCostPerByte?: NonNegativeInterval;
  }) {
    this.minFeeA = options.minFeeA;
    this.minFeeB = options.minFeeB;
    this.maxBlockBodySize = options.maxBlockBodySize;
    this.maxTransactionSize = options.maxTransactionSize;
    this.maxBlockHeaderSize = options.maxBlockHeaderSize;
    this.keyDeposit = options.keyDeposit;
    this.poolDeposit = options.poolDeposit;
    this.maximumEpoch = options.maximumEpoch;
    this.desiredNumberOfStakePools = options.desiredNumberOfStakePools;
    this.poolPledgeInfluence = options.poolPledgeInfluence;
    this.expansionRate = options.expansionRate;
    this.treasuryGrowthRate = options.treasuryGrowthRate;
    this.minPoolCost = options.minPoolCost;
    this.adaPerUtxoByte = options.adaPerUtxoByte;
    this.costModelsForScriptLanguages = options.costModelsForScriptLanguages;
    this.executionCosts = options.executionCosts;
    this.maxTxExUnits = options.maxTxExUnits;
    this.maxBlockExUnits = options.maxBlockExUnits;
    this.maxValueSize = options.maxValueSize;
    this.collateralPercentage = options.collateralPercentage;
    this.maxCollateralInputs = options.maxCollateralInputs;
    this.poolVotingThresholds = options.poolVotingThresholds;
    this.drepVotingThresholds = options.drepVotingThresholds;
    this.minCommitteeSize = options.minCommitteeSize;
    this.committeeTermLimit = options.committeeTermLimit;
    this.governanceActionValidityPeriod =
      options.governanceActionValidityPeriod;
    this.governanceActionDeposit = options.governanceActionDeposit;
    this.drepDeposit = options.drepDeposit;
    this.drepInactivityPeriod = options.drepInactivityPeriod;
    this.minFeeRefScriptCostPerByte = options.minFeeRefScriptCostPerByte;
  }

  static fromCBOR(value: CBORReaderValue): ProtocolParamUpdate {
    let map = value
      .get("map")
      .toMap()
      .map({
        key: (key) => Number(key.get("uint")),
        value: (value) => value,
      });

    return new ProtocolParamUpdate({
      minFeeA: map.get(0)?.get("uint"),
      minFeeB: map.get(1)?.get("uint"),
      maxBlockBodySize: map.get(2)?.get("uint"),
      maxTransactionSize: map.get(3)?.get("uint"),
      maxBlockHeaderSize: map.get(4)?.get("uint"),
      keyDeposit: map.get(5)?.get("uint"),
      poolDeposit: map.get(6)?.get("uint"),
      maximumEpoch: map.get(7)?.get("uint"),
      desiredNumberOfStakePools: map.get(8)?.get("uint"),
      poolPledgeInfluence: mapOptional(
        map.get(9),
        NonNegativeInterval.fromCBOR
      ),
      expansionRate: mapOptional(map.get(10), UnitInterval.fromCBOR),
      treasuryGrowthRate: mapOptional(map.get(11), UnitInterval.fromCBOR),
      minPoolCost: map.get(16)?.get("uint"),
      adaPerUtxoByte: map.get(17)?.get("uint"),
      costModelsForScriptLanguages: mapOptional(map.get(18), Costmdls.fromCBOR),
      executionCosts: mapOptional(map.get(19), ExUnitPrices.fromCBOR),
      maxTxExUnits: mapOptional(map.get(20), ExUnits.fromCBOR),
      maxBlockExUnits: mapOptional(map.get(21), ExUnits.fromCBOR),
      maxValueSize: map.get(22)?.get("uint"),
      collateralPercentage: map.get(23)?.get("uint"),
      maxCollateralInputs: map.get(24)?.get("uint"),
      poolVotingThresholds: mapOptional(
        map.get(25),
        PoolVotingThresholds.fromCBOR
      ),
      drepVotingThresholds: mapOptional(
        map.get(26),
        DrepVotingThresholds.fromCBOR
      ),
      minCommitteeSize: map.get(27)?.get("uint"),
      committeeTermLimit: map.get(28)?.get("uint"),
      governanceActionValidityPeriod: map.get(29)?.get("uint"),
      governanceActionDeposit: map.get(30)?.get("uint"),
      drepDeposit: map.get(31)?.get("uint"),
      drepInactivityPeriod: map.get(32)?.get("uint"),
      minFeeRefScriptCostPerByte: mapOptional(
        map.get(33),
        NonNegativeInterval.fromCBOR
      ),
    });
  }

  toCBOR(writer: CBORWriter) {
    let map: CBORMap<bigint, CBORValue> = CBORMap.newEmpty();
    if (this.minFeeA != null) {
      map.set(0n, this.minFeeA);
    }
    if (this.minFeeB != null) {
      map.set(1n, this.minFeeB);
    }
    if (this.maxBlockBodySize != null) {
      map.set(2n, this.maxBlockBodySize);
    }
    if (this.maxTransactionSize != null) {
      map.set(3n, this.maxTransactionSize);
    }
    if (this.maxBlockHeaderSize != null) {
      map.set(4n, this.maxBlockHeaderSize);
    }
    if (this.keyDeposit != null) {
      map.set(5n, this.keyDeposit);
    }
    if (this.poolDeposit != null) {
      map.set(6n, this.poolDeposit);
    }
    if (this.maximumEpoch != null) {
      map.set(7n, this.maximumEpoch);
    }
    if (this.desiredNumberOfStakePools != null) {
      map.set(8n, this.desiredNumberOfStakePools);
    }
    if (this.poolPledgeInfluence != null) {
      map.set(9n, this.poolPledgeInfluence);
    }
    if (this.expansionRate != null) {
      map.set(10n, this.expansionRate);
    }
    if (this.treasuryGrowthRate != null) {
      map.set(11n, this.treasuryGrowthRate);
    }
    if (this.minPoolCost != null) {
      map.set(16n, this.minPoolCost);
    }
    if (this.adaPerUtxoByte != null) {
      map.set(17n, this.adaPerUtxoByte);
    }
    if (this.costModelsForScriptLanguages != null) {
      map.set(18n, this.costModelsForScriptLanguages);
    }
    if (this.executionCosts != null) {
      map.set(19n, this.executionCosts);
    }
    if (this.maxTxExUnits != null) {
      map.set(20n, this.maxTxExUnits);
    }
    if (this.maxBlockExUnits != null) {
      map.set(21n, this.maxBlockExUnits);
    }
    if (this.maxValueSize != null) {
      map.set(22n, this.maxValueSize);
    }
    if (this.collateralPercentage != null) {
      map.set(23n, this.collateralPercentage);
    }
    if (this.maxCollateralInputs != null) {
      map.set(24n, this.maxCollateralInputs);
    }
    if (this.poolVotingThresholds != null) {
      map.set(25n, this.poolVotingThresholds);
    }
    if (this.drepVotingThresholds != null) {
      map.set(26n, this.drepVotingThresholds);
    }
    if (this.minCommitteeSize != null) {
      map.set(27n, this.minCommitteeSize);
    }
    if (this.committeeTermLimit != null) {
      map.set(28n, this.committeeTermLimit);
    }
    if (this.governanceActionValidityPeriod != null) {
      map.set(29n, this.governanceActionValidityPeriod);
    }
    if (this.governanceActionDeposit != null) {
      map.set(30n, this.governanceActionDeposit);
    }
    if (this.drepDeposit != null) {
      map.set(31n, this.drepDeposit);
    }
    if (this.drepInactivityPeriod != null) {
      map.set(32n, this.drepInactivityPeriod);
    }
    if (this.minFeeRefScriptCostPerByte != null) {
      map.set(33n, this.minFeeRefScriptCostPerByte);
    }
    writer.writeCustom(map);
  }
}

export class PoolVotingThresholds implements CBORCustom {
  public readonly motionNoConfidence: UnitInterval;
  public readonly committeeNormal: UnitInterval;
  public readonly committeeNoConfidence: UnitInterval;
  public readonly hardForkInitiation: UnitInterval;
  public readonly securityRelevantParameter: UnitInterval;

  constructor(options: {
    motionNoConfidence: UnitInterval;
    committeeNormal: UnitInterval;
    committeeNoConfidence: UnitInterval;
    hardForkInitiation: UnitInterval;
    securityRelevantParameter: UnitInterval;
  }) {
    this.motionNoConfidence = options.motionNoConfidence;
    this.committeeNormal = options.committeeNormal;
    this.committeeNoConfidence = options.committeeNoConfidence;
    this.hardForkInitiation = options.hardForkInitiation;
    this.securityRelevantParameter = options.securityRelevantParameter;
  }

  static fromCBOR(value: CBORReaderValue): PoolVotingThresholds {
    let array = value.get("array");
    return new PoolVotingThresholds({
      motionNoConfidence: UnitInterval.fromCBOR(array.shiftRequired()),
      committeeNormal: UnitInterval.fromCBOR(array.shiftRequired()),
      committeeNoConfidence: UnitInterval.fromCBOR(array.shiftRequired()),
      hardForkInitiation: UnitInterval.fromCBOR(array.shiftRequired()),
      securityRelevantParameter: UnitInterval.fromCBOR(array.shiftRequired()),
    });
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray([
      this.motionNoConfidence,
      this.committeeNormal,
      this.committeeNoConfidence,
      this.hardForkInitiation,
      this.securityRelevantParameter,
    ]);
  }
}

export class DrepVotingThresholds implements CBORCustom {
  public readonly motionNoConfidence: UnitInterval;
  public readonly committeeNormal: UnitInterval;
  public readonly committeeNoConfidence: UnitInterval;
  public readonly updateConstitution: UnitInterval;
  public readonly hardForkInitiation: UnitInterval;
  public readonly ppNetworkGroup: UnitInterval;
  public readonly ppEconomicGroup: UnitInterval;
  public readonly ppTechnicalGroup: UnitInterval;
  public readonly ppGovernanceGroup: UnitInterval;
  public readonly treasuryWithdrawal: UnitInterval;

  constructor(options: {
    motionNoConfidence: UnitInterval;
    committeeNormal: UnitInterval;
    committeeNoConfidence: UnitInterval;
    updateConstitution: UnitInterval;
    hardForkInitiation: UnitInterval;
    ppNetworkGroup: UnitInterval;
    ppEconomicGroup: UnitInterval;
    ppTechnicalGroup: UnitInterval;
    ppGovernanceGroup: UnitInterval;
    treasuryWithdrawal: UnitInterval;
  }) {
    this.motionNoConfidence = options.motionNoConfidence;
    this.committeeNormal = options.committeeNormal;
    this.committeeNoConfidence = options.committeeNoConfidence;
    this.updateConstitution = options.updateConstitution;
    this.hardForkInitiation = options.hardForkInitiation;
    this.ppNetworkGroup = options.ppNetworkGroup;
    this.ppEconomicGroup = options.ppEconomicGroup;
    this.ppTechnicalGroup = options.ppTechnicalGroup;
    this.ppGovernanceGroup = options.ppGovernanceGroup;
    this.treasuryWithdrawal = options.treasuryWithdrawal;
  }

  static fromCBOR(value: CBORReaderValue): DrepVotingThresholds {
    let array = value.get("array");
    return new DrepVotingThresholds({
      motionNoConfidence: UnitInterval.fromCBOR(array.getRequired(0)),
      committeeNormal: UnitInterval.fromCBOR(array.getRequired(1)),
      committeeNoConfidence: UnitInterval.fromCBOR(array.getRequired(2)),
      updateConstitution: UnitInterval.fromCBOR(array.getRequired(3)),
      hardForkInitiation: UnitInterval.fromCBOR(array.getRequired(4)),
      ppNetworkGroup: UnitInterval.fromCBOR(array.getRequired(5)),
      ppEconomicGroup: UnitInterval.fromCBOR(array.getRequired(6)),
      ppTechnicalGroup: UnitInterval.fromCBOR(array.getRequired(7)),
      ppGovernanceGroup: UnitInterval.fromCBOR(array.getRequired(8)),
      treasuryWithdrawal: UnitInterval.fromCBOR(array.getRequired(9)),
    });
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray([
      this.motionNoConfidence,
      this.committeeNormal,
      this.committeeNoConfidence,
      this.updateConstitution,
      this.hardForkInitiation,
      this.ppNetworkGroup,
      this.ppEconomicGroup,
      this.ppTechnicalGroup,
      this.ppGovernanceGroup,
      this.treasuryWithdrawal,
    ]);
  }
}

export class TransactionWitnessSet implements CBORCustom {
  public readonly vkeywitnesses?: ConwaySet<VkeyWitness>;
  public readonly nativeScripts?: ConwaySet<NativeScript>;
  public readonly bootstrapWitnesses?: ConwaySet<BootstrapWitness>;
  public readonly plutusV1Scripts?: ConwaySet<Uint8Array>;
  public readonly plutusData?: ConwaySet<PlutusData>;
  public readonly redeemers?: Redeemers;
  public readonly plutusV2Scripts?: ConwaySet<Uint8Array>;
  public readonly plutusV3Scripts?: ConwaySet<Uint8Array>;

  constructor(options: {
    vkeywitnesses?: ConwaySet<VkeyWitness>;
    nativeScripts?: ConwaySet<NativeScript>;
    bootstrapWitnesses?: ConwaySet<BootstrapWitness>;
    plutusV1Scripts?: ConwaySet<Uint8Array>;
    plutusData?: ConwaySet<PlutusData>;
    redeemers?: Redeemers;
    plutusV2Scripts?: ConwaySet<Uint8Array>;
    plutusV3Scripts?: ConwaySet<Uint8Array>;
  }) {
    this.vkeywitnesses = options.vkeywitnesses;
    this.nativeScripts = options.nativeScripts;
    this.bootstrapWitnesses = options.bootstrapWitnesses;
    this.plutusV1Scripts = options.plutusV1Scripts;
    this.plutusData = options.plutusData;
    this.redeemers = options.redeemers;
    this.plutusV2Scripts = options.plutusV2Scripts;
    this.plutusV3Scripts = options.plutusV3Scripts;
  }

  static fromCBOR(value: CBORReaderValue): TransactionWitnessSet {
    let map = value
      .get("map")
      .toMap()
      .map({
        key: (key) => Number(key.get("uint")),
        value: (value) => value,
      });

    return new TransactionWitnessSet({
      vkeywitnesses: mapOptional(map.get(0), ConwaySet.fromCBOR)?.map(
        VkeyWitness.fromCBOR
      ),
      nativeScripts: mapOptional(map.get(1), ConwaySet.fromCBOR)?.map(
        NativeScript.fromCBOR
      ),
      bootstrapWitnesses: mapOptional(map.get(2), ConwaySet.fromCBOR)?.map(
        BootstrapWitness.fromCBOR
      ),
      plutusV1Scripts: mapOptional(map.get(3), ConwaySet.fromCBOR)?.map((v) =>
        v.get("bstr")
      ),
      plutusData: mapOptional(map.get(4), ConwaySet.fromCBOR)?.map(
        PlutusData.fromCBOR
      ),
      redeemers: mapOptional(map.get(5), Redeemers.fromCBOR),
      plutusV2Scripts: mapOptional(map.get(6), ConwaySet.fromCBOR)?.map((v) =>
        v.get("bstr")
      ),
      plutusV3Scripts: mapOptional(map.get(7), ConwaySet.fromCBOR)?.map((v) =>
        v.get("bstr")
      ),
    });
  }

  toCBOR(writer: CBORWriter) {
    let map: CBORMap<bigint, CBORValue> = CBORMap.newEmpty();
    if (this.vkeywitnesses != null) {
      map.set(0n, this.vkeywitnesses);
    }
    if (this.nativeScripts != null) {
      map.set(1n, this.nativeScripts);
    }
    if (this.bootstrapWitnesses != null) {
      map.set(2n, this.bootstrapWitnesses);
    }
    if (this.plutusV1Scripts != null) {
      map.set(3n, this.plutusV1Scripts);
    }
    if (this.plutusData != null) {
      map.set(4n, this.plutusData);
    }
    if (this.redeemers != null) {
      map.set(5n, this.redeemers);
    }
    if (this.plutusV2Scripts != null) {
      map.set(6n, this.plutusV2Scripts);
    }
    if (this.plutusV3Scripts != null) {
      map.set(7n, this.plutusV3Scripts);
    }
    writer.write(map);
  }
}

export type PlutusDataVariant =
  | { kind: "constr"; value: Constr<PlutusData> }
  | { kind: "map"; value: CBORMap<PlutusData, PlutusData> }
  | { kind: "array"; value: PlutusData[] }
  | { kind: "int"; value: bigint }
  | { kind: "bytes"; value: BoundedBytes };

export class PlutusData implements CBORCustom {
  public readonly variant: PlutusDataVariant;

  constructor(variant: PlutusDataVariant) {
    this.variant = variant;
  }

  static fromCBOR(value: CBORReaderValue): PlutusData {
    return new PlutusData(
      value.getChoice<PlutusDataVariant>({
        tagged: (tagged) => {
          if (tagged.tag == 2n || 3n) {
            let bigint_ = ConwayBigInt.fromCBOR(value);
            return {
              kind: "int",
              value: bigint_.value,
            };
          }
          return {
            kind: "constr",
            value: Constr.fromCBOR(
              new CBORReaderValue(tagged.path, {
                type: "tagged",
                value: tagged,
              }),
              PlutusData.fromCBOR
            ),
          };
        },
        map: (map) => ({
          kind: "map",
          value: map.toMap().map({
            key: PlutusData.fromCBOR,
            value: PlutusData.fromCBOR,
          }),
        }),
        array: (array) => ({
          kind: "array",
          value: array.map(PlutusData.fromCBOR),
        }),
        uint: (uint) => ({ kind: "int", value: uint }),
        bstr: (bstr) => ({ kind: "bytes", value: new BoundedBytes(bstr) }),
      })
    );
  }

  toCBOR(writer: CBORWriter) {
    let value: CBORValue;
    switch (this.variant.kind) {
      case "constr":
        value = this.variant.value;
        break;
      case "map":
        value = this.variant.value;
        break;
      case "array":
        value = this.variant.value;
        break;
      case "int":
        value = new ConwayBigInt(this.variant.value);
        break;
      case "bytes":
        value = this.variant.value;
        break;
    }
    writer.write(value);
  }
}

export class ConwayBigInt implements CBORCustom {
  static readonly TWO_POW_64 = 18446744073709551616n;
  static readonly NEG_TWO_POW_64 = -18446744073709551616n;

  public readonly value: bigint;

  constructor(value: bigint) {
    this.value = value;
  }

  static fromCBOR(value: CBORReaderValue): ConwayBigInt {
    return value.getChoice({
      uint: (uint) => {
        return new ConwayBigInt(uint);
      },
      nint: (nint) => {
        return new ConwayBigInt(1n - nint);
      },
      tagged: (tagged) => {
        if (tagged.tag == 2n) {
          let bytes = tagged.value.get("bstr");
          let value = bigintFromBytes(bytes.length, bytes);
          return new ConwayBigInt(value);
        } else if (tagged.tag == 3n) {
          let bytes = tagged.value.get("bstr");
          let value = bigintFromBytes(bytes.length, bytes);
          return new ConwayBigInt(1n - value);
        }
        throw new ParseFailed(
          value.path,
          "value",
          "tag: 2|3",
          tagged.tag.toString()
        );
      },
    });
  }

  toCBOR(writer: CBORWriter) {
    if (
      this.value > ConwayBigInt.NEG_TWO_POW_64 &&
      this.value < ConwayBigInt.TWO_POW_64
    ) {
      writer.writeBigInt(this.value);
    } else {
      let cborValue: CBORTagged<BoundedBytes>;
      if (this.value < 0) {
        let buffer = new GrowableBuffer();
        buffer.pushBigInt(this.value);
        cborValue = new CBORTagged(2n, new BoundedBytes(buffer.getBuffer()));
      } else {
        let value = -1n - this.value;
        let buffer = new GrowableBuffer();
        buffer.pushBigInt(value);
        cborValue = new CBORTagged(3n, new BoundedBytes(buffer.getBuffer()));
      }
      writer.writeCustom(cborValue);
    }
  }
}

export class Constr<T extends CBORValue> implements CBORCustom {
  public readonly tag: bigint;
  public readonly extra: bigint | null;
  public readonly value: T[];

  constructor(tag: bigint, extra: bigint | null, value: T[]) {
    this.tag = tag;
    if (extra != null && tag != 102n) {
      throw new Error("extra is only allowed for tag 102");
    }
    this.extra = extra;
    this.value = value;
  }

  static fromCBOR<T extends CBORValue>(
    value: CBORReaderValue,
    valueFn: (v: CBORReaderValue) => T
  ): Constr<T> {
    let tagged = value.get("tagged");
    let inner = tagged.value.get("array");

    let tag = tagged.tag;
    let extra = tag == 102n ? inner.getRequired(0).get("uint") : null;
    let value_ =
      tag == 102n
        ? inner.getRequired(1).get("array").map(valueFn)
        : inner.map(valueFn);

    return new Constr(tag, extra, value_);
  }

  toCBOR(writer: CBORWriter) {
    let inner: CBORValue[] = this.value;
    if (this.extra != null) {
      inner = [this.extra, inner];
    }
    writer.writeTagged(this.tag, inner);
  }
}

export class RedeemerKey implements CBORCustom {
  public readonly tag: RedeemerTag;
  public readonly index: bigint;

  constructor(tag: RedeemerTag, index: bigint) {
    this.tag = tag;
    this.index = index;
  }

  static fromCBOR(value: CBORReaderValue): RedeemerKey {
    let array = value.get("array");
    return new RedeemerKey(
      RedeemerTagFromCBOR(array.getRequired(0)),
      array.getRequired(1).get("uint")
    );
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray([RedeemerTagToCBOR(this.tag), this.index]);
  }
}

export class RedeemerValue implements CBORCustom {
  public readonly data: PlutusData;
  public readonly exUnits: ExUnits;

  constructor(data: PlutusData, exUnits: ExUnits) {
    this.data = data;
    this.exUnits = exUnits;
  }

  static fromCBOR(value: CBORReaderValue): RedeemerValue {
    let array = value.get("array");
    return new RedeemerValue(
      PlutusData.fromCBOR(array.getRequired(0)),
      ExUnits.fromCBOR(array.getRequired(1))
    );
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray([this.data, this.exUnits]);
  }
}

export class Redeemers extends CBORMap<RedeemerKey, RedeemerValue> {
  static fromCBOR(value: CBORReaderValue): Redeemers {
    return value.getChoice({
      array: (array) => {
        let redeemers = new Redeemers();
        array.forEach((v) => {
          let array = v.get("array");
          let redeemer_tag = RedeemerTagFromCBOR(array.getRequired(0));
          let index = array.getRequired(1).get("uint");
          let data = PlutusData.fromCBOR(array.getRequired(2));
          let exUnits = ExUnits.fromCBOR(array.getRequired(3));

          let key = new RedeemerKey(redeemer_tag, index);
          let value = new RedeemerValue(data, exUnits);
          redeemers.set(key, value);
        });
        return redeemers;
      },
      map: (map) => {
        return map.toMap().map({
          key: RedeemerKey.fromCBOR,
          value: RedeemerValue.fromCBOR,
        });
      },
    });
  }
}

export type RedeemerTag = keyof typeof RedeemerTagNames;

export const RedeemerTagNames = {
  Spending: 0,
  Minting: 1,
  Certifying: 2,
  Rewarding: 3,
  Voting: 4,
  Proposing: 5,
} as const;

export function RedeemerTagFromCBOR(value: CBORReaderValue): RedeemerTag {
  let n = Number(value.get("uint"));
  if (n == RedeemerTagNames.Spending) return "Spending";
  if (n == RedeemerTagNames.Minting) return "Minting";
  if (n == RedeemerTagNames.Certifying) return "Certifying";
  if (n == RedeemerTagNames.Rewarding) return "Rewarding";
  if (n == RedeemerTagNames.Voting) return "Voting";
  if (n == RedeemerTagNames.Proposing) return "Proposing";

  throw new ParseFailed(
    value.path,
    "value",
    Object.keys(RedeemerTagNames).join("|"),
    n.toString()
  );
}

export function RedeemerTagToCBOR(value: RedeemerTag): CBORValue {
  return RedeemerTagNames[value];
}

export class ExUnits implements CBORCustom {
  public readonly mem: bigint;
  public readonly steps: bigint;

  constructor(mem: bigint, steps: bigint) {
    this.mem = mem;
    this.steps = steps;
  }

  static fromCBOR(value: CBORReaderValue): ExUnits {
    let array = value.get("array");
    return new ExUnits(
      array.getRequired(0).get("uint"),
      array.getRequired(1).get("uint")
    );
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray([this.mem, this.steps]);
  }
}

export class ExUnitPrices implements CBORCustom {
  memPrice: NonNegativeInterval;
  stepPrice: NonNegativeInterval;

  constructor(memPrice: NonNegativeInterval, stepPrice: NonNegativeInterval) {
    this.memPrice = memPrice;
    this.stepPrice = stepPrice;
  }

  static fromCBOR(value: CBORReaderValue): ExUnitPrices {
    let arr = value.get("array");
    return new ExUnitPrices(
      NonNegativeInterval.fromCBOR(arr.getRequired(0)),
      NonNegativeInterval.fromCBOR(arr.getRequired(1))
    );
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray([this.memPrice, this.stepPrice]);
  }
}

export const Language = {
  PlutusV1: 0,
  PlutusV2: 1,
  PlutusV3: 2,
} as const;

export class Costmdls implements CBORCustom {
  public readonly plutus_v1?: bigint[];
  public readonly plutus_v2?: bigint[];
  public readonly plutus_v3?: bigint[];
  // TODO: Correct name? Can't find in CSL
  public readonly any?: bigint[];

  constructor(options: {
    plutus_v1?: bigint[];
    plutus_v2?: bigint[];
    plutus_v3?: bigint[];
    any?: bigint[];
  }) {
    this.plutus_v1 = options.plutus_v1;
    this.plutus_v2 = options.plutus_v2;
    this.plutus_v3 = options.plutus_v3;
    this.any = options.any;
  }

  static fromCBOR(value: CBORReaderValue): Costmdls {
    let map = value
      .get("map")
      .toMap()
      .map({
        key: (key) => Number(key.get("uint")),
        value: (value) => value.get("array").map((v) => v.getInt()),
      });
    return new Costmdls({
      plutus_v1: map.get(0),
      plutus_v2: map.get(1),
      plutus_v3: map.get(2),
      any: map.get(3),
    });
  }

  toCBOR(writer: CBORWriter) {
    let map: CBORMap<bigint, bigint[]> = CBORMap.newEmpty();
    if (this.plutus_v1 != null) {
      map.set(0n, this.plutus_v1);
    }
    if (this.plutus_v2 != null) {
      map.set(1n, this.plutus_v2);
    }
    if (this.plutus_v3 != null) {
      map.set(2n, this.plutus_v3);
    }
    if (this.any != null) {
      map.set(3n, this.any);
    }
    writer.write(map);
  }
}

export type TransactionMetadatumVariant =
  | { kind: "map"; value: CBORMap<TransactionMetadatum, TransactionMetadatum> }
  | { kind: "array"; value: TransactionMetadatum[] }
  | { kind: "int"; value: bigint }
  | { kind: "bytes"; value: Uint8Array }
  | { kind: "text"; value: string };

export class TransactionMetadatum implements CBORCustom {
  public readonly variant: TransactionMetadatumVariant;

  constructor(variant: TransactionMetadatumVariant) {
    this.variant = variant;
  }

  static fromCBOR(value: CBORReaderValue): TransactionMetadatum {
    return new TransactionMetadatum(
      value.getChoice<TransactionMetadatumVariant>({
        map: (map) => ({
          kind: "map",
          value: map.toMap().map({
            key: TransactionMetadatum.fromCBOR,
            value: TransactionMetadatum.fromCBOR,
          }),
        }),
        array: (array) => ({
          kind: "array",
          value: array.map(TransactionMetadatum.fromCBOR),
        }),
        uint: (uint) => ({ kind: "int", value: uint }),
        bstr: (bstr) => ({ kind: "bytes", value: bstr }),
        tstr: (tstr) => ({ kind: "text", value: tstr }),
      })
    );
  }

  toCBOR(writer: CBORWriter) {
    writer.write(this.variant.value);
  }
}

export type TransactionMetadatumLabel = bigint;

export type Metadata = CBORMap<TransactionMetadatumLabel, TransactionMetadatum>;

export class VkeyWitness implements CBORCustom {
  public readonly vkey: AddrKeyHash;
  public readonly signature: Signature;

  constructor(vkey: AddrKeyHash, signature: Signature) {
    this.vkey = vkey;
    this.signature = signature;
  }

  static fromCBOR(value: CBORReaderValue): VkeyWitness {
    let array = value.get("array");
    return new VkeyWitness(
      Bytes28.fromCBOR(array.getRequired(0)),
      Bytes32.fromCBOR(array.getRequired(1))
    );
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray([this.vkey, this.signature]);
  }
}

export class BootstrapWitness implements CBORCustom {
  public readonly publicKey: AddrKeyHash;
  public readonly signature: Signature;
  public readonly chainCode: Bytes32;
  public readonly attributes: Uint8Array;

  constructor(
    publicKey: AddrKeyHash,
    signature: Signature,
    chainCode: Bytes32,
    attributes: Uint8Array
  ) {
    this.publicKey = publicKey;
    this.signature = signature;
    this.chainCode = chainCode;
    this.attributes = attributes;
  }

  static fromCBOR(value: CBORReaderValue): BootstrapWitness {
    let array = value.get("array");
    return new BootstrapWitness(
      Bytes28.fromCBOR(array.getRequired(0)),
      Bytes32.fromCBOR(array.getRequired(1)),
      Bytes32.fromCBOR(array.getRequired(2)),
      array.getRequired(3).get("bstr")
    );
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray([
      this.publicKey,
      this.signature,
      this.chainCode,
      this.attributes,
    ]);
  }
}

export type NativeScriptVariant =
  | {
    type: "pubkey";
    value: AddrKeyHash;
  }
  | {
    type: "all";
    value: NativeScript[];
  }
  | {
    type: "any";
    value: NativeScript[];
  }
  | {
    type: "n_of_k";
    n: number;
    value: NativeScript[];
  }
  | {
    type: "invalid_before";
    value: number;
  }
  | {
    type: "invalid_hereafter";
    value: number;
  };

export class NativeScript implements CBORCustom {
  public readonly variant: NativeScriptVariant;

  constructor(variant: NativeScriptVariant) {
    this.variant = variant;
  }

  static fromCBOR(value: CBORReaderValue): NativeScript {
    let array = value.get("array");
    let tag = array.getRequired(0).get("uint");
    switch (tag) {
      case 0n:
        return new NativeScript({
          type: "pubkey",
          value: Bytes28.fromCBOR(array.getRequired(1)),
        });
      case 1n:
        return new NativeScript({
          type: "all",
          value: array.getRequired(1).get("array").map(NativeScript.fromCBOR),
        });
      case 2n:
        return new NativeScript({
          type: "any",
          value: array.getRequired(1).get("array").map(NativeScript.fromCBOR),
        });
      case 3n:
        let n = array.getRequired(1).get("uint");
        return new NativeScript({
          type: "n_of_k",
          n: Number(n),
          value: array.getRequired(2).get("array").map(NativeScript.fromCBOR),
        });
      case 4n:
        return new NativeScript({
          type: "invalid_before",
          value: Number(array.getRequired(1).get("uint")),
        });
      case 5n:
        return new NativeScript({
          type: "invalid_hereafter",
          value: Number(array.getRequired(1).get("uint")),
        });
      default:
        throw new ParseFailed(
          array.path,
          "value",
          "tag: 0|1|2|3|4|5",
          tag.toString()
        );
    }
  }

  toCBOR(writer: CBORWriter) {
    let value: CBORValue;
    switch (this.variant.type) {
      case "pubkey":
        value = [0, this.variant.value];
        break;
      case "all":
        value = [1, this.variant.value];
        break;
      case "any":
        value = [2, this.variant.value];
        break;
      case "n_of_k":
        value = [3, this.variant.n, this.variant.value];
        break;
      case "invalid_before":
        value = [4, this.variant.value];
        break;
      case "invalid_hereafter":
        value = [5, this.variant.value];
        break;
    }
    writer.writeArray(value);
  }
}

export type Coin = bigint;

export type PolicyId = ScriptHash;

export class AssetName extends Bytes {
  constructor(bytes: Uint8Array, path?: string[]) {
    super(bytes);
    this.assertSizeRange({ min: 0, max: 32 }, path);
  }

  static fromCBOR(value: CBORReaderValue) {
    return new AssetName(value.get("bstr"));
  }
}

export type MultiAssetPositiveBigInt = CBORMap<
  PolicyId,
  PositiveBigIntMap<AssetName>
>;

export class Value implements CBORCustom {
  public readonly coin: Coin;
  public readonly multiasset: MultiAssetPositiveBigInt;

  constructor(coin: Coin, multiasset?: MultiAssetPositiveBigInt) {
    this.coin = coin;
    this.multiasset = multiasset || CBORMap.newEmpty();
  }

  static fromCBOR(value: CBORReaderValue) {
    return value.getChoice({
      uint: (coin) => new Value(coin),
      array: (array) => {
        let coin = array.getRequired(0).get("uint");
        let multiasset = array
          .getRequired(1)
          .get("map")
          .toMap()
          .map({
            key: (key) => Bytes28.fromCBOR(key),
            value: (value) =>
              NonZeroBigIntMap.fromCBOR(value, AssetName.fromCBOR),
          });
        return new Value(coin, multiasset);
      },
    });
  }

  toCBOR(writer: CBORWriter) {
    writer.writeArray([this.coin, this.multiasset]);
  }
}
export class Mint extends CBORMultiMap<PolicyId, NonZeroBigIntMap<AssetName>> {
  static fromCBOR(value: CBORReaderValue) {
    let multimap = value.get("map");
    let multimapMint = multimap.map({
      key: (key) => Bytes28.fromCBOR(key),
      value: (value) =>
        NonZeroBigIntMap.fromCBOR(value, (key) => AssetName.fromCBOR(key)),
    });
    return new Mint(multimapMint.entries);
  }
}

export type Epoch = bigint;

export type AddrKeyHash = Hash28;
export type PoolKeyHash = Hash28;

export type VrfKeyHash = Hash32;
export type AuxiliaryDataHash = Hash32;
export type PoolMetadataHash = Hash32;

export type ScriptHash = Hash28;

export type DatumHash = Hash32;

export class Data implements CBORCustom {
  public readonly bytes: Uint8Array;
  constructor(bytes: Uint8Array) {
    this.bytes = bytes;
  }

  static fromCBOR(value: CBORReaderValue) {
    return new Data(value.get("tagged").getTagged(24n).get("bstr"));
  }

  toCBOR(writer: CBORWriter) {
    writer.writeTagged(24n, this.bytes);
  }
}

type DatumOptionVariant =
  | {
    kind: "hash";
    value: Hash32;
  }
  | {
    kind: "data";
    value: Data;
  };

export class DatumOption implements CBORCustom {
  public readonly variant: DatumOptionVariant;

  constructor(variant: DatumOptionVariant) {
    this.variant = variant;
  }

  static fromCBOR(value: CBORReaderValue) {
    let array = value.get("array");
    let tag = array.shiftRequired().get("uint");
    if (tag == 0n) {
      let hash = Bytes32.fromCBOR(array.getRequired(1));
      return new DatumOption({ kind: "hash", value: hash });
    } else if (tag == 1n) {
      let data = Data.fromCBOR(array.shiftRequired());
      return new DatumOption({ kind: "data", value: data });
    } else {
      throw new ParseFailed(array.path, "value", "tag: 0|1", tag.toString());
    }
  }

  toCBOR(writer: CBORWriter) {
    if (this.variant.kind == "hash") {
      writer.writeArray([0n, this.variant.value]);
    } else if (this.variant.kind == "data") {
      writer.writeArray([1n, this.variant.value]);
    }
  }
}
