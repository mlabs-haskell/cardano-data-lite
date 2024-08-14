import { CodeGenerator } from ".";
import { SchemaTable } from "../compiler";
import { genCSL } from "./utils/csl";
import { genAccessors, genConstructor, genMembers } from "./utils/structured";

export type Item = {
  name: string;
  type: string;
};

export class GenRecordFragmentWrapper implements CodeGenerator {
  name: string;
  item: Item;

  constructor(name: string, item: Item) {
    this.name = name;
    this.item = item;
  }

  generate(customTypes: SchemaTable): string {
    return `
      export class ${this.name} {
        ${genMembers([this.item], customTypes)}
        ${genConstructor([this.item], customTypes)}
        ${genAccessors([this.item], customTypes)}
        ${genCSL(this.name)}

        static deserialize(reader: CBORReader): ${this.name} {
          let ${this.item.name} = ${this.item.type}.deserialize(reader);
          return new ${this.name}(${this.item.name}) 
        }

        serialize(writer: CBORWriter): void {
          this.${this.item.name}.serialize(writer);
        }
      }`;
  }
}
