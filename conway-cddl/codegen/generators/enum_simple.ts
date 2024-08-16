import { CodeGeneratorBase } from ".";
import { SchemaTable } from "..";

export type Value = {
  name: string;
  value: number;
};

export type GenEnumSimpleOptions = {
  values: Value[];
};

export class GenEnumSimple extends CodeGeneratorBase {
  values: Value[];

  constructor(
    name: string,
    customTypes: SchemaTable,
    options: GenEnumSimpleOptions,
  ) {
    super(name, customTypes);
    this.values = options.values;
  }

  generate(): string {
    return `
      export enum ${this.name} {
        ${this.values.map((x) => `${x.name} = ${x.value},`).join("\n")}
      }

      export function deserialize${this.name}(reader: CBORReader): ${this.name} {
        let value = Number(reader.readInt());
        switch(value) {
          ${this.values.map((x) => `case ${x.value}: return ${this.name}.${x.name}`).join("\n")}
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

  eq(var1: string, var2: string): string {
    return `${var1} === ${var2}`;
  }
}
