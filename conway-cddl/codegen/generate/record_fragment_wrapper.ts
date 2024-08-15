import { CodeGeneratorBase } from ".";
import { SchemaTable } from "../compiler";
import { genCSL } from "./utils/csl";
import { genAccessors, genConstructor, genMembers } from "./utils/structured";

export type Item = {
  name: string;
  type: string;
};

export class GenRecordFragmentWrapper extends CodeGeneratorBase {
  item: Item;

  constructor(name: string, item: Item, customTypes: SchemaTable) {
    super(name, customTypes);
    this.item = item;
  }

  generate(): string {
    return `
      export class ${this.name} {
        ${genMembers([this.item], this.typeUtils)}
        ${genConstructor([this.item], this.typeUtils)}
        ${genAccessors([this.item], this.typeUtils)}
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
