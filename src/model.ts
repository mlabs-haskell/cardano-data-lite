import { MultiMap } from "./cbor/model";

type TransactionIndex = number;

type Coin = bigint;

type Hash28 = Uint8Array;
type Hash32 = Uint8Array;

type VKey = Uint8Array; // 32 bytes
type Signature = Uint8Array; // 64 bytes
type ChainCode = Uint8Array; // 32 bytes

type AddrKeyHash = Hash28;
type ScriptHash = Hash28; // (prepend tag before hashing, see conway.cddl)
type ScriptDataHash = Hash32;
type VrfKeyHash = Hash32;
type AuxiliaryDataHash = Hash32;

type Address = Uint8Array;
type RewardAccount = Uint8Array;

export interface Transaction {
  body: TransactionBody;
  witness_Set: TransactionWitnessSet;
  // note: conway.cddl doesn't specify what this field means.
  // the name `is_valid` is taken from CSL's Transaction struct
  is_valid: boolean;
  auxiliary_data: AuxiliaryData | null;
}

interface TransactionBody {
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
  fee: Coin;
  ttl?: number;
  certificates?: Certificate[];
  withdrawals?: MultiMap<RewardAccount, Coin>;
  auxiliary_data_hash?: AuxiliaryDataHash;
  validity_interval_start?: number;
  mint?: Mint;
  script_data_hash?: ScriptDataHash;
  collateral_inputs?: TransactionInput[];
  required_signers?: AddrKeyHash[];
  network_id?: number;
  collateral_return?: TransactionOutput;
  total_collateral?: Coin;
  reference_inputs?: TransactionInput;
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

type Multiasset<A> = MultiMap<PolicyId, Map<AssetName, A>>;

type PolicyId = ScriptHash;

type AssetName = Uint8Array; // 32 bytes

// The value type is fundamentally (coin, multiasset<coin>)
// Although it is encoded in CBOR as coin / [coin, multiasset<positive_coin>] to prevent multiple encodings for (coin, []) or (coin, [(foo, 0)]).
// But this is an implementation detail. It need not be exposed to the user.
//
interface Value {
  coin: Coin,
  assets: Multiasset<Coin>,
}

type Mint = Multiasset<bigint>; // Nonzero

type DatumOption = DatumOptionHash | DatumOptionData;

enum DatumOptionKind {
  Hash = 0,
  Data = 1,
}

interface DatumOptionHash {
  kind: DatumOptionKind.Hash;
  value: Hash32;
}

interface DatumOptionData {
  kind: DatumOptionKind.Data;
  value: Data;
}

type Data = Uint8Array; // #6.24 CBOR encoded PlutusData
type ScriptRef = Uint8Array; // #6.24 CBOR encoded Script

type Script =
  | { kind: ScriptKind.Native; value: NativeScript }
  | { kind: ScriptKind.PlutusV1; value: PlutusV1Script }
  | { kind: ScriptKind.PlutusV2; value: PlutusV2Script }
  | { kind: ScriptKind.PlutusV3; value: PlutusV3Script };

enum ScriptKind {
  Native = 0,
  PlutusV1 = 1,
  PlutusV2 = 2,
  PlutusV3 = 3,
}
