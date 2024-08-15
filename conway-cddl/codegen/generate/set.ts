import { CodeGeneratorBase, CodeGeneratorBaseOptions } from ".";
import { SchemaTable } from "../compiler";

export type GenSetOptions = {
  item: string;
} & CodeGeneratorBaseOptions;

export class GenSet extends CodeGeneratorBase {
  item: string;

  constructor(name: string, customTypes: SchemaTable, options: GenSetOptions) {
    super(name, customTypes, { genCSL: true, ...options });
    this.item = options.item;
  }

  private itemJsType() {
    return this.typeUtils.jsType(this.item);
  }

  generateMembers(): string {
    return `
      private items: ${this.itemJsType()}[];
    `;
  }

  generateConstructor(): string {
    return `
      constructor() {
        this.items = [];
      }
    `;
  }

  generateExtraMethods(): string {
    let itemJsType = this.itemJsType();
    return `
      static new(): ${this.name} {
        return new ${this.name}();
      }

      len(): number {
        return this.items.length;
      }

      get(index: number): ${itemJsType} {
        if(index >= this.items.length) throw new Error("Array out of bounds");
        return this.items[index];
      }

      add(elem: ${itemJsType}): boolean {
        if(this.contains(elem)) return true;
        this.items.push(elem);
        return false;
      }

      contains(elem: ${itemJsType}): boolean {
        for(let item of this.items) {
          if(${this.typeUtils.eqType("item", "elem", this.item)}) {
            return true;
          }
        }
        return false;
      }
    `;
  }

  generateDeserialize(reader: string): string {
    return `
      let ret = new ${this.name}();
      if(${reader}.peekType() == "tagged") {
        let tag = ${reader}.readTaggedTag();
        if(tag != 258) throw new Error("Expected tag 258. Got " + tag);
      }
      ${reader}.readArray(reader => ret.add(${this.typeUtils.readType(reader, this.item)}));
      return ret;
    `;
  }

  generateSerialize(writer: string): string {
    return `
      ${writer}.writeTaggedTag(258);
      ${writer}.writeArray(this.items, (writer, x) => ${this.typeUtils.writeType("writer", "x", this.item)});
    `;
  }
}
