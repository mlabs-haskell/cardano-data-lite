import { blake2b } from "@noble/hashes/blake2b";
import { AuxiliaryDataHash, DataHash, } from "../generated.js";
export function hash_plutus_data(plutus_data) {
    const bytes = plutus_data.to_bytes();
    return DataHash.new(blake2b(bytes, { dkLen: 32 }));
}
export function hash_auxiliary_data(auxiliary_data) {
    const bytes = auxiliary_data.to_bytes();
    return AuxiliaryDataHash.new(blake2b(bytes, { dkLen: 32 }));
}
