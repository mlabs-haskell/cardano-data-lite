import { Ed25519KeyHash, ScriptHash } from "../generated";
import { CBORReader } from "../lib/cbor/reader";
import { CBORWriter } from "../lib/cbor/writer";
export declare enum CredKind {
    Key = 0,
    Script = 1
}
export type CredentialVariant = {
    kind: CredKind.Key;
    value: Ed25519KeyHash;
} | {
    kind: CredKind.Script;
    value: ScriptHash;
};
export declare class Credential {
    readonly variant: CredentialVariant;
    static HASH_LEN: number;
    constructor(variant: CredentialVariant);
    static from_keyhash(key: Ed25519KeyHash): Credential;
    static from_scripthash(script: ScriptHash): Credential;
    static _from_raw_bytes(kind: number, bytes: Uint8Array): Credential;
    to_keyhash(): Ed25519KeyHash | undefined;
    to_scripthash(): ScriptHash | undefined;
    kind(): CredKind;
    has_script_hash(): boolean;
    serialize(writer: CBORWriter): void;
    static deserialize(reader: CBORReader, path: string[]): Credential;
    to_bytes(): Uint8Array;
    static from_bytes(data: Uint8Array, path: string[]): Credential;
    to_hex(): string;
    static from_hex(data: string, path: string[]): Credential;
    free(): void;
    _to_raw_bytes(): Uint8Array;
}
