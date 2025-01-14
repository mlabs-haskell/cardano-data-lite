import { CodeGeneratorBase, CodeGeneratorBaseOptions } from ".";
import { SchemaTable } from "..";

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
      private definiteEncoding: boolean;
      private nonEmptyTag: boolean;

      private setItems(items: ${this.itemJsType()}[]) {
        this.items = items;
      }
    `;
  }

  generateConstructor(): string {
    return `
      constructor(definiteEncoding: boolean = true, nonEmptyTag: boolean = true) {
        this.items = [];
        this.definiteEncoding = definiteEncoding;
        this.nonEmptyTag = nonEmptyTag;
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

  generateDeserialize(reader: string, path: string): string {
    return `
      let nonEmptyTag = false;
      if(${reader}.peekType(${path}) == "tagged") {
        let tag = ${reader}.readTaggedTag(${path});
        if(tag != 258) {
          throw new Error("Expected tag 258. Got " + tag);
        } else {
          nonEmptyTag = true;
        }
      }
      const { items, definiteEncoding } = ${reader}.readArray(
        (reader, idx) =>
          ${this.typeUtils.readType( reader, this.item, `[...${path}, '${this.item}#' + idx]`)},
          ${path}
      );
      let ret = new ${this.name}(definiteEncoding, nonEmptyTag);
      ret.setItems(items);
      return ret;
    `;
  }

  generateSerialize(writer: string): string {
    return `
      if (this.nonEmptyTag) {
        ${writer}.writeTaggedTag(258);
      }
      ${writer}.writeArray(this.items, (writer, x) => ${this.typeUtils.writeType("writer", "x", this.item)});
    `;
  }
}
