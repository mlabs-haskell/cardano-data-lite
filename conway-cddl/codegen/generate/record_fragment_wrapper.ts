import { CodeGenerator } from ".";
import { genCSL } from "./utils/csl";
import { genAccessors, genConstructor, genMembers } from "./utils/structured";

export type Item = {
  name: string;
  type: string;
};

export class GenRecordFragment implements CodeGenerator {
  name: string;
  item: Item;

  constructor(name: string, item: Item) {
    this.name = name;
    this.item = item;
  }

  generate(_customTypes: Set<string>): string {
    return `
      export class ${this.name} {
        ${genMembers([this.item])}
        ${genConstructor([this.item])}
        ${genAccessors([this.item])}
        ${genCSL(this.name)}

        const FRAGMENT_FIELDS_LEN: number = ${this.item.type}.FRAGMENT_FIELDS_LEN;

        static deserialize(reader: CBORReader, len: number | null): ${this.name} {
          let ${this.item.name} = ${this.item.type}.deserialize(reader, len);
          return new ${this.name}(${this.item.name}) 
        }

        serialize(writer: CBORWriter): void {
          this.${this.item.name}.serialize(writer);
        }
      }`;
  }
}
