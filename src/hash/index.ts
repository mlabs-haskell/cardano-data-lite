import { blake2b } from "@noble/hashes/blake2b";
import {
  AuxiliaryData,
  AuxiliaryDataHash,
  DataHash,
  PlutusData,
  TransactionBody,
  TransactionHash,
} from "../generated";

export function hash_plutus_data(plutus_data: PlutusData): DataHash {
  const bytes = plutus_data.to_bytes();
  return DataHash.new(blake2b(bytes, { dkLen: 32 }));
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
