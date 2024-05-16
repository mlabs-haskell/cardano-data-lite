import { CBORItem } from "./cbor/model";

import * as CDDL from "./cddl/parser";

export type MultiMap<K, V> = [K, V][];

export const TransactionIndex = new CDDL.UInt();

export const Coin = new CDDL.UInt();

const FixedSizeBytes = (size: number) =>
  new CDDL.BStr({ min: size, max: size });

export const Hash28 = FixedSizeBytes(28);
export const Hash32 = FixedSizeBytes(32);

export const VKey = FixedSizeBytes(32);
export const Signature = FixedSizeBytes(64);
export const ChainCode = FixedSizeBytes(32);

export const AddrKeyHash = Hash28;
export const ScriptHash = Hash28; // (prepend tag before hashing, see conway.cddl)
export const ScriptDataHash = Hash32;
export const VrfKeyHash = Hash32;
export const AuxiliaryDataHash = Hash32;

export const Address = new CDDL.BStr();
export const RewardAccount = Address;

export interface Transaction {
  body: TransactionBody;
  witness_Set: TransactionWitnessSet;
  // note: conway.cddl doesn't specify what this field means.
  // the name `is_valid` is taken from CSL's Transaction struct
  is_valid: boolean;
  auxiliary_data: AuxiliaryData | null;
}

class TransactionBody {
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
  fee: bigint;
  ttl?: number | undefined;
  certificates?: Certificate[] | undefined;
  withdrawals?: MultiMap<Uint8Array, bigint> | undefined;
  auxiliary_data_hash?: Uint8Array | undefined;
  validity_interval_start?: number | undefined;
  mint?: Mint | undefined;
  script_data_hash?: Uint8Array | undefined;
  collateral_inputs?: TransactionInput[] | undefined;
  required_signers?: Uint8Array[] | undefined;
  network_id?: number | undefined;
  collateral_return?: TransactionOutput | undefined;
  total_collateral?: bigint | undefined;
  reference_inputs?: TransactionInput | undefined;

  constructor() { }
}

interface TransactionInput {
  transaction_id: Hash32;
  index: number;
}

interface TransactionOutput {
  address: Address;
  value: Value;
  datum_option?: DatumOption;
  script_ref?: ScriptRef;
}

type Certificate = StakeRegistration | StakeDeregistration | StakeDelegation;

enum CertificateKind {
  StakeRegistration = 0,
  StakeDeregistration = 1,
  StakeDelegation = 2,
}

interface StakeRegistration {
  kind: CertificateKind.StakeRegistration;
  stake_credential: Credential;
}

interface StakeDeregistration {
  kind: CertificateKind.StakeDeregistration;
  stake_credentiall: Credential;
}

interface StakeDelegation {
  kind: CertificateKind.StakeDelegation;
  stake_credential: Credential;
}

/* TODO add the remaining certificate types */

type Credential = AddrKeyHashCredential | ScriptHashCredential;

enum CredentialKind {
  AddrKeyHash,
  ScriptHash,
}

interface AddrKeyHashCredential {
  kind: CredentialKind.AddrKeyHash;
  addr_keyhash: AddrKeyHash;
}

interface ScriptHashCredential {
  kind: CredentialKind.ScriptHash;
  script_hash: ScriptHash;
}

interface TransactionWitnessSet {
  vkey_witnesses?: VKeyWitness[];
  native_scripts?: NativeScript[];
  bootstrap_witnesses?: BootstrapWitness[];
  // TODO: fill rest
}

type PlutusV1Script = Uint8Array;
type PlutusV2Script = Uint8Array;
type PlutusV3Script = Uint8Array;

type PlutusData =
  | PlutusDataConstr
  | PlutusDataMap
  | PlutusDataList
  | PlutusDataBigInt
  | PlutusDataBytes;

enum PlutusDataKind {
  Constr,
  Map,
  List,
  BigInt,
  Bytes,
}

interface PlutusDataConstr {
  kind: PlutusDataKind.Constr;
  value: Constr<PlutusData>;
}

interface PlutusDataMap {
  kind: PlutusDataKind.Map;
  value: MultiMap<PlutusData, PlutusData>;
}

interface PlutusDataList {
  kind: PlutusDataKind.List;
  value: PlutusData[];
}

interface PlutusDataBigInt {
  kind: PlutusDataKind.BigInt;
  value: bigint;
}

interface PlutusDataBytes {
  kind: PlutusDataKind.Bytes;
  value: Uint8Array;
}

interface Constr<T> {
  tag: number;
  tagExtra?: number;
  values: T[];
}

type TransactionMetadatum =
  | TransactionMetadatumMap
  | TransactionMetadatumList
  | TransactionMetadatumInt
  | TransactionMetadatumBytes
  | TransactionMetadatumText;

enum TransactionMetadatumKind {
  Map = "Map",
  List = "List",
  Int = "Int",
  Bytes = "Bytes",
  Text = "Text",
}

interface TransactionMetadatumMap {
  kind: TransactionMetadatumKind.Map;
  value: MultiMap<TransactionMetadatum, TransactionMetadatum>;
}

interface TransactionMetadatumList {
  kind: TransactionMetadatumKind.List;
  value: TransactionMetadatum[];
}

interface TransactionMetadatumInt {
  kind: TransactionMetadatumKind.Int;
  value: bigint;
}

interface TransactionMetadatumBytes {
  kind: TransactionMetadatumKind.Bytes;
  value: Uint8Array;
}

interface TransactionMetadatumText {
  kind: TransactionMetadatumKind.Text;
  value: string;
}

type Metadata = MultiMap<bigint, TransactionMetadatum>;

type AuxiliaryData =
  | AuxiliaryDataShelley
  | AuxiliaryDataShelleyMa
  | AuxiliaryDataAlonzo;

enum AuxiliaryDataKind {
  Shelley = "Shelley",
  ShellyMa = "Shelley-ma",
  Alonzo = "Alonzo",
}

interface AuxiliaryDataShelley {
  kind: AuxiliaryDataKind.Shelley;
  value: Metadata;
}

interface AuxiliaryDataShelleyMa {
  kind: AuxiliaryDataKind.ShellyMa;
  value: {
    transaction_metadata: Metadata;
    auxiliary_scripts: NativeScript[];
  };
}

interface AuxiliaryDataAlonzo {
  kind: AuxiliaryDataKind.Alonzo;
  value: {
    metadata?: Metadata;
    native_scripts?: NativeScript[];
    plutus_v1_scripts?: PlutusV1Script[];
    plutus_v2_scripts?: PlutusV2Script[];
    plutus_v3_scripts?: PlutusV3Script[];
  };
}

interface VKeyWitness {
  vkey: VKey;
  signature: Signature;
}

interface BootstrapWitness {
  public_key: VKey;
  signature: Signature;
  chain_code: ChainCode;
  attributes: Uint8Array;
}

type NativeScript =
  | ScriptPubkey
  | ScriptAll
  | ScriptAny
  | ScriptNOfK
  | InvalidBefore
  | InvalidHereafter;

enum NativeScriptKind {
  Pubkey = 0,
  All = 1,
  Any = 2,
  NOfK = 3,
  InvalidBefore = 4,
  InvalidHereafter = 5,
}

interface ScriptPubkey {
  kind: NativeScriptKind.Pubkey;
  value: AddrKeyHash;
}

interface ScriptAll {
  kind: NativeScriptKind.All;
  scripts: NativeScript[];
}

interface ScriptAny {
  kind: NativeScriptKind.Any;
  scripts: NativeScript[];
}

interface ScriptNOfK {
  kind: NativeScriptKind.NOfK;
  n: number;
  scripts: NativeScript[];
}

interface InvalidBefore {
  kind: NativeScriptKind.InvalidBefore;
  value: bigint;
}

interface InvalidHereafter {
  kind: NativeScriptKind.InvalidHereafter;
  value: bigint;
}

export const PolicyId = ScriptHash;

export const AssetName = FixedSizeBytes(32);

export type MultiAsset<A> = MultiMap<
  CDDL.ParserOutput<typeof PolicyId>,
  MultiMap<CDDL.ParserOutput<typeof AssetName>, A>
>;

export const MultiAsset = <A>(innerParser: CDDL.Parser<A>) =>
  new CDDL.Map(PolicyId, new CDDL.Map(AssetName, innerParser));

// The value type is fundamentally (coin, multiasset<coin>)
// Although it is encoded in CBOR as coin / [coin, multiasset<positive_coin>] to prevent multiple encodings for (coin, []) or (coin, [(foo, 0)]).
// But this is an implementation detail. It need not be exposed to the user.
//
interface Value {
  coin: CDDL.ParserOutput<typeof Coin>;
  assets: MultiAsset<CDDL.ParserOutput<typeof Coin>>;
}

// Not excluding zero at the parser level because it's 
export const Mint = MultiAsset(new CDDL.UInt());

export enum DatumOptionKind {
  Hash = 0,
  Data = 1,
}

export interface DatumOptionHash {
  kind: DatumOptionKind.Hash;
  hash: CDDL.ParserOutput<typeof Hash32>;
}

export interface DatumOptionData {
  kind: DatumOptionKind.Data;
  data: CDDL.ParserOutput<typeof Data>;
}

export type DatumOption = DatumOptionHash | DatumOptionData;

export const DatumOption = new CDDL.Transform<CBORItem[], DatumOption>(
  new CDDL.Array(new CDDL.Identity()),
  (cbor) => {
    let tag = CDDL.parseTag(new CDDL.UInt(), cbor[0]);
    let tagNum = Number(tag);
    switch (tagNum) {
      case DatumOptionKind.Hash:
        return {
          kind: DatumOptionKind.Hash,
          hash: CDDL.withPath("1", () => Hash32.parse(cbor[1])),
        };
      case DatumOptionKind.Data:
        return {
          kind: DatumOptionKind.Data,
          data: CDDL.withPath("1", () => Data.parse(cbor[1])),
        };
      default:
        throw new CDDL.ParseFailed(
          ["0"],
          "value",
          "tag: [0,1]",
          tagNum.toString()
        );
    }
  }
);

export const ScriptRef = new CDDL.Tagged(24, new CDDL.BStr());

export const Data = new CDDL.Tagged(24, new CDDL.BStr());

export type Script =
  | { kind: ScriptKind.Native; value: NativeScript }
  | { kind: ScriptKind.PlutusV1; value: PlutusV1Script }
  | { kind: ScriptKind.PlutusV2; value: PlutusV2Script }
  | { kind: ScriptKind.PlutusV3; value: PlutusV3Script };

export enum ScriptKind {
  Native = 0,
  PlutusV1 = 1,
  PlutusV2 = 2,
  PlutusV3 = 3,
}
