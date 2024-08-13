import { CodeGenerator } from ".";
import { jsType, eqType, readType, writeType } from "./utils/cbor-utils";
import { genCSL } from "./utils/csl";

export class GenSet implements CodeGenerator {
  name: string;
  item: string;

  constructor(name: string, item: string) {
    this.name = name;
    this.item = item;
  }

  generate(customTypes: Set<string>): string {
    let itemJsType = jsType(this.item, customTypes);
    return `
      export class ${this.name} {
        private items: ${itemJsType}[];

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
            if(${eqType(customTypes, "item", "elem", this.item)}) {
              return true;
            }
          }
          return false;
        }

        ${genCSL(this.name)}

        static deserialize(reader: CBORReader): ${this.name} {
          let ret = new ${this.name}();
          if(reader.peekType() == "tagged") {
            let tag = reader.readTaggedTag();
            if(tag != 258) throw new Error("Expected tag 258. Got " + tag);
          }
          reader.readArray(reader => ret.add(${readType(customTypes, "reader", this.item)}));
          return ret;
        }

        serialize(writer: CBORWriter) {
          writer.writeTaggedTag(258);
          writer.writeArray(this.items, (writer, x) => ${writeType(customTypes, "writer", "x", this.item)});
        }
      }
    `;
  }
}
