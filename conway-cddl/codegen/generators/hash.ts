import { CodeGeneratorBase, CodeGeneratorBaseOptions } from ".";
import { SchemaTable } from "..";

export type GenHashOptions = {
  len?: number;
  options_type?: string;
} & CodeGeneratorBaseOptions;

export class GenHash extends CodeGeneratorBase {
  len?: number;
  optionsType?: string;

  constructor(name: string, customTypes: SchemaTable, options: GenHashOptions) {
    super(name, customTypes, { genCSL: false, ...options });
    this.len = options.len;
    this.optionsType = options.options_type;
  }

  generateMembers(): string {
    return `
      private inner: Uint8Array;
      ${this.optionsType != null ? `private options?: ${this.optionsType};` : ""}
    `;
  }

  generateConstructor(): string {
    return ` 
      constructor(
        inner: Uint8Array,
        ${this.optionsType != null ? `options?: ${this.optionsType}` : ""}
      ) {
        ${
          this.len != null
            ? `if(inner.length != ${this.len}) throw new Error("Expected length to be ${this.len}");`
            : ""
        }
        this.inner = inner;
        ${this.optionsType != null ? `this.options = options;` : ""}
      }
    `;
  }

  generateExtraMethods(): string {
    return `
      ${this.renameMethod(
        "new",
        (new_) => `
        static ${new_}(inner: Uint8Array): ${this.name} {
          return new ${this.name}(inner);
        }`,
      )}

      ${this.renameMethod(
        "from_bech32",
        (from_bech32) => `
        static ${from_bech32}(bech_str: string): ${this.name} {
          let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
          let words = decoded.words;
          let bytesArray = bech32.fromWords(words);
          let bytes = new Uint8Array(bytesArray);
          return new ${this.name}(bytes);
        }`,
      )}

      ${this.renameMethod(
        "to_bech32",
        (to_bech32) => `
        ${to_bech32}(prefix: string): string {
          if (!prefix) {
            throw new Error("bech32 HRP (prefix) cannot be empty.");
          }
          if (prefix !== prefix.toLowerCase()) {
            throw new Error("bech32 HRP (prefix) must be all lowercase.");
          }
          if (prefix.length > 83) {
            throw new Error("bech32 HRP (prefix) length must not exceed 83 characters.");
          }
          let bytes = this.to_bytes();
          let words = bech32.toWords(bytes);
          return bech32.encode(prefix, words, Number.MAX_SAFE_INTEGER);
        }`,
      )}

      ${this.renameMethod(
        "free",
        (free) => `
      // no-op
      ${free}(): void {}`,
      )}


      ${this.renameMethod(
        "from_bytes",
        (from_bytes) => `
      static ${from_bytes}(data: Uint8Array): ${this.name} {
        return new ${this.name}(data);
      }`,
      )}


      ${this.renameMethod(
        "from_hex",
        (from_hex) => `
      static ${from_hex}(hex_str: string): ${this.name} {
        return ${this.name}.${this.renameMethod("from_bytes")}(hexToBytes(hex_str));
      }`,
      )}

      
      ${this.renameMethod(
        "to_bytes",
        (to_bytes) => `
      ${to_bytes}(): Uint8Array {
        return this.inner;
      }`,
      )}


      ${this.renameMethod(
        "to_hex",
        (to_hex) => `
      ${to_hex}(): string {
        return bytesToHex(this.${this.renameMethod("to_bytes")}());
      }`,
      )}

      ${this.renameMethod(
        "clone",
        (clone) => `
      ${clone}(): ${this.name} {
        return ${this.name}.${this.renameMethod("from_bytes")}(this.${this.renameMethod("to_bytes")}());
      }`,
      )}

    `;
  }

  generateDeserialize(reader: string, path: string): string {
    return ` 
      return new ${this.name}(${reader}.readBytes(${path}));
    `;
  }

  generateSerialize(writer: string): string {
    return `
      ${writer}.writeBytes(this.inner);
    `;
  }
}
