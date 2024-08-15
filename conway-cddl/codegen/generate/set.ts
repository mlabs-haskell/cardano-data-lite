import { CodeGeneratorBase } from ".";
import { SchemaTable } from "../compiler";
import { genCSL } from "./utils/csl";

export class GenSet extends CodeGeneratorBase {
  item: string;

  constructor(name: string, item: string, customTypes: SchemaTable) {
    super(name, customTypes);
    this.item = item;
  }

  generate(): string {
    let itemJsType = this.typeUtils.jsType(this.item);
    return `
      export class ${this.name} {
        private items: ${itemJsType}[];

        ${genCSL(this.name)}

        constructor() {
          this.items = [];
        }

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

        static deserialize(reader: CBORReader): ${this.name} {
          let ret = new ${this.name}();
          if(reader.peekType() == "tagged") {
            let tag = reader.readTaggedTag();
            if(tag != 258) throw new Error("Expected tag 258. Got " + tag);
          }
          reader.readArray(reader => ret.add(${this.typeUtils.readType("reader", this.item)}));
          return ret;
        }

        serialize(writer: CBORWriter) {
          writer.writeTaggedTag(258);
          writer.writeArray(this.items, (writer, x) => ${this.typeUtils.writeType("writer", "x", this.item)});
        }
      }
    `;
  }
}
