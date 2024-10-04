import { Ed25519KeyHash, ScriptHash } from "../generated";
import { CBORReader } from "../lib/cbor/reader";
import { CBORWriter } from "../lib/cbor/writer";
import { bytesToHex, hexToBytes } from "../lib/hex";

export enum CredKind {
  Key = 0,
  Script = 1,
}

export type CredentialVariant =
  | {
      kind: CredKind.Key;
      value: Ed25519KeyHash;
    }
  | {
      kind: CredKind.Script;
      value: ScriptHash;
    };

export class Credential {
  static HASH_LEN: number = 28;

  constructor(public readonly variant: CredentialVariant) {}

  static from_keyhash(key: Ed25519KeyHash): Credential {
    return new Credential({ kind: CredKind.Key, value: key });
  }

  static from_scripthash(script: ScriptHash): Credential {
    return new Credential({ kind: CredKind.Script, value: script });
  }

  static _from_raw_bytes(kind: number, bytes: Uint8Array) {
    if (kind === CredKind.Key) {
      return Credential.from_keyhash(Ed25519KeyHash.from_bytes(bytes));
    } else if (kind === CredKind.Script) {
      return Credential.from_scripthash(ScriptHash.from_bytes(bytes));
    } else {
      throw new Error(`Unknown credential kind: ${kind}`);
    }
  }

  to_keyhash(): Ed25519KeyHash | undefined {
    if (this.variant.kind === CredKind.Key) {
      return this.variant.value;
    }
    return undefined;
  }

  to_scripthash(): ScriptHash | undefined {
    if (this.variant.kind === CredKind.Script) {
      return this.variant.value;
    }
    return undefined;
  }

  kind(): CredKind {
    return this.variant.kind;
  }

  has_script_hash(): boolean {
    return this.variant.kind === CredKind.Script;
  }

  serialize(writer: CBORWriter): void {
    writer.writeArrayTag(1);
    if (this.variant.kind === CredKind.Key) {
      writer.writeInt(0n);
      writer.writeBytes(this.variant.value.to_bytes());
    } else {
      writer.writeInt(1n);
      writer.writeBytes(this.variant.value.to_bytes());
    }
  }

  static deserialize(reader: CBORReader): Credential {
    let len = reader.readArrayTag();
    if (len != 2) throw new Error("Expected array length == 2");
    const kind = reader.readInt();
    if (kind === 0n) {
      return Credential.from_keyhash(Ed25519KeyHash.deserialize(reader));
    } else if (kind == 1n) {
      return Credential.from_scripthash(ScriptHash.deserialize(reader));
    } else {
      throw new Error(`Unknown credential kind: ${kind}`);
    }
  }

  to_bytes(): Uint8Array {
    const writer = new CBORWriter();
    this.serialize(writer);
    return writer.getBytes();
  }

  static from_bytes(data: Uint8Array): Credential {
    const reader = new CBORReader(data);
    return Credential.deserialize(reader);
  }

  to_hex(): string {
    return bytesToHex(this.to_bytes());
  }

  static from_hex(data: string): Credential {
    return Credential.from_bytes(hexToBytes(data));
  }

  // no-op
  free(): void {}

  _to_raw_bytes(): Uint8Array {
    return this.variant.value.to_bytes();
  }
}
