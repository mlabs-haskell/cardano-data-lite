import { blake2b } from "@noble/hashes/blake2b";
import {
  AuxiliaryData,
  AuxiliaryDataHash,
  Costmdls,
  DataHash,
  PlutusData,
  PlutusList,
  PrivateKey,
  Redeemers,
  ScriptDataHash,
  TransactionBody,
  TransactionHash,
  Vkey,
  Vkeywitness,
} from "../generated";

export function hash_plutus_data(plutus_data: PlutusData): DataHash {
  const bytes = plutus_data.to_bytes();
  return DataHash.new(blake2b(bytes, { dkLen: 32 }));
}

export function make_vkey_witness(
  tx_body_hash: TransactionHash,
  sk: PrivateKey
): Vkeywitness {
  const sig = sk.sign(tx_body_hash.to_bytes());
  return Vkeywitness.new(Vkey.new(sk.to_public()), sig);
}

export function hash_auxiliary_data(
  auxiliary_data: AuxiliaryData,
): AuxiliaryDataHash {
  const bytes = auxiliary_data.to_bytes();
  return AuxiliaryDataHash.new(blake2b(bytes, { dkLen: 32 }));
}

export function hash_transaction(
  tx_body: TransactionBody,
): TransactionHash {
  const bytes = tx_body.to_bytes();
  return TransactionHash.new(blake2b(bytes, { dkLen: 32 }));
}

export function hash_script_data(
  redeemers: Redeemers,
  cost_models: Costmdls,
  datums: PlutusList | undefined
): ScriptDataHash {
  const arr: number[] = [];

  // If there are no redeemers and some datums, use the [ A0 | datums | A0 ] format
  if (redeemers.len() === 0 && datums !== undefined) {

    // A0 = CBOR empty map
    arr.push(0xA0);
    // push datums.to_set_bytes()
    arr.push(...datums.as_set().to_bytes());

    // A0 = another CBOR empty map
    arr.push(0xA0);
  } else {
    // Otherwise: [ redeemers | datums | language views ]
    arr.push(...redeemers.to_bytes());

    if (datums !== undefined) {
      arr.push(...datums.as_set().to_bytes());
    }

    arr.push(...cost_models.language_views_encoding());
  }

  const buf = new Uint8Array(arr);
  return ScriptDataHash.new(blake2b(buf, { dkLen: 32 }));
}
