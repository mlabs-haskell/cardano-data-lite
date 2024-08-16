import { CodeGeneratorBase, CodeGeneratorBaseOptions } from ".";
import { SchemaTable } from "..";

export type Value = {
  name: string;
  value: number;
};

export type GenEnumOptions = {
  values: Value[];
} & CodeGeneratorBaseOptions;

export class GenEnum extends CodeGeneratorBase {
  values: Value[];

  constructor(name: string, customTypes: SchemaTable, options: GenEnumOptions) {
    super(name, customTypes, { genCSL: true });
    this.values = options.values;
  }

  generatePre(): string {
    return `
      export enum ${this.name}Kind {
        ${this.values.map((x) => `${x.name} = ${x.value},`).join("\n")}
      }
    `;
  }

  generateMembers(): string {
    return `
        private kind_: ${this.name}Kind;
    `;
  }

  generateConstructor(): string {
    return `
      constructor(kind: ${this.name}Kind) {
        this.kind_ = kind;
      }
    `;
  }

  generateExtraMethods(): string {
    return this.values
      .map(
        (x) => `
        static new_${x.name}(): ${this.name} {
          return new ${this.name}(${x.value});
        }`,
      )
      .join("\n");
  }

  generateDeserialize(reader: string): string {
    return `
      let kind = Number(${reader}.readInt());
      ${this.values
        .map(
          (x) => `if(kind == ${x.value}) return new ${this.name}(${x.value})`,
        )
        .join("\n")}
        throw "Unrecognized enum value: " + kind + " for " + ${this.name};
     `;
  }

  generateSerialize(writer: string): string {
    return `
          ${writer}.writeInt(BigInt(this.kind_));
    `;
  }
}
