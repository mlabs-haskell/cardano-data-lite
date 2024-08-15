import { CodeGeneratorBase } from ".";
import { SchemaTable } from "../compiler";

export type Variant = {
  name: string;
  value: number;
};

export class GenEnumSimple extends CodeGeneratorBase {
  variants: Variant[];

  constructor(name: string, variants: Variant[], customTypes: SchemaTable) {
    super(name, customTypes);
    this.variants = variants;
  }

  generate(): string {
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

      export function serialize${this.name}(writer: CBORWriter, value: ${this.name}) : void {
        writer.writeInt(BigInt(value)); 
      }
    `;
  }

  deserialize(reader: string) {
    return `deserialize${this.name}(${reader})`;
  }

  serialize(writer: string, value: string) {
    return `serialize${this.name}(${writer}, ${value})`;
  }
}
