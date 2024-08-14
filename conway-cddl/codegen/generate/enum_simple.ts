import { CodeGenerator } from ".";
import { SchemaTable } from "../compiler";

export type Variant = {
  name: string;
  value: number;
};

export class GenEnumSimple implements CodeGenerator {
  name: string;
  variants: Variant[];

  constructor(name: string, variants: Variant[]) {
    this.name = name;
    this.variants = variants;
  }

  generate(_customTypes: SchemaTable): string {
    return `
      export enum ${this.name} {
        ${this.variants.map((x) => `${x.name} = ${x.value},`).join("\n")}
      }

      export function deserialize${this.name}(reader: CBORReader): ${this.name} {
        let value = Number(reader.readInt());
        switch(value) {
          ${this.variants.map((x) => `case ${x.value}: return ${this.name}.${x.name}`).join("\n")}
        }
        throw new Error("Invalid value for enum ${this.name}: " + value);
      }

      export function serialize${this.name}(value: ${this.name}, writer: CBORWriter) : void {
        writer.writeInt(BigInt(value)); 
      }
    `;
  }

  static readType(type: string, reader: string) {
    return `deserialize${type}(${reader})`;
  }

  static writeType(type: string, value: string, writer: string) {
    return `serialize${type}(${value}, ${writer})`;
  }
}
