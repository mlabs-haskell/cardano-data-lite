import { CBORReaderValue } from "../cbor2/reader";
import { CBORCustom, CBORMap, CBORMultiMap, CBORValue } from "../cbor2/types";
import { CBORWriter } from "../cbor2/writer";
import { ParseFailed } from "../cddl/parser";
import { PolicyId } from "../model";
import { Hash32 } from "../model2";
import { NonZeroBigIntMap, PositiveBigIntMap } from "./common";
import { Bytes, Bytes28, Bytes32, Hash28, Signature } from "./crypto";

/*
costmdls =
  { ? 0 : [ 166* int ] ; Plutus v1, only 166 integers are used, but more are accepted (and ignored)
  , ? 1 : [ 175* int ] ; Plutus v2, only 175 integers are used, but more are accepted (and ignored)
  , ? 2 : [ 233* int ] ; Plutus v3, only 233 integers are used, but more are accepted (and ignored)
  , ? 3 : [ int ] ; Any 8-bit unsigned number can be used as a key.
  }
*/

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
    let tag = array.getRequired(0).get("uint");
    if (tag == 0n) {
      let hash = Hash32.fromCBOR(array.getRequired(1));
      return new DatumOption({ kind: "hash", value: hash });
    } else if (tag == 1n) {
      let data = Data.fromCBOR(array.getRequired(1));
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
