import { CodeGeneratorBase, CodeGeneratorBaseOptions } from ".";
import { SchemaTable } from "..";

export type GenHashOptions = {
  len?: number;
} & CodeGeneratorBaseOptions;

export class GenHash extends CodeGeneratorBase {
  len?: number;

  constructor(name: string, customTypes: SchemaTable, options: GenHashOptions) {
    super(name, customTypes, { genCSL: true, ...options });
    this.len = options.len;
  }

  generateMembers(): string {
    return `
      private inner: Uint8Array;
    `;
  }

  generateConstructor(): string {
    return ` 
      constructor(inner: Uint8Array) {
        ${
          this.len != null
            ? `if(inner.length != ${this.len}) throw new Error("Expected length to be ${this.len}");`
            : ""
        }
        this.inner = inner;
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
    `;
  }

  generateDeserialize(reader: string): string {
    return ` 
      return new ${this.name}(${reader}.readBytes());
    `;
  }

  generateSerialize(writer: string): string {
    return `
      ${writer}.writeBytes(this.inner);
    `;
  }
}
