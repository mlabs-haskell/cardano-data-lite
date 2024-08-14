import { CodeGenerator } from ".";
import { genCSL } from "./utils/csl";

export type Variant = {
  name: string;
  value: number;
};

export class GenEnum implements CodeGenerator {
  name: string;
  variants: Variant[];

  constructor(name: string, variants: Variant[]) {
    this.name = name;
    this.variants = variants;
  }

  generate(): string {
    return `
      export enum ${this.name}Kind {
        ${this.variants.map((x) => `${x.name} = ${x.value},`).join("\n")}
      }

      export class ${this.name} {
        private kind_: ${this.name}Kind;

        ${genCSL(this.name)}

        constructor(kind: ${this.name}Kind) {
          this.kind_ = kind;
        }

        ${this.variants
          .map(
            (x) => `
        static new_${x.name}(): ${this.name} {
          return new ${this.name}(${x.value});
        }`,
          )
          .join("\n")}
        
        static deserialize(reader: CBORReader): ${this.name} {
          let kind = Number(reader.readInt());
          ${this.variants
            .map(
              (x) =>
                `if(kind == ${x.value}) return new ${this.name}(${x.value})`,
            )
            .join("\n")}
            throw "Unrecognized enum value: " + kind + " for " + ${this.name};
          });
        }

        serialize (writer: CBORWriter) {
          writer.writeInt(BigInt(this.kind_));
        }
      }`;
  }
}
