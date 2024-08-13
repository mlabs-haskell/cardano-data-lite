import { CodeGenerator } from ".";
import { jsType, readType, writeType } from "./cbor-utils";
import { genCSL } from "./custom";

export class GenArray implements CodeGenerator {
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

        constructor(items: ${itemJsType}[]) {
          this.items = items;
        }

        static new(): ${this.name} {
          return new ${this.name}([]);
        }

        len(): number {
          return this.items.length;
        }

        get(index: number): ${itemJsType} {
          if(index >= this.items.length) throw new Error("Array out of bounds");
          return this.items[index];
        }

        add(elem: ${itemJsType}): void {
          this.items.push(elem);
        }

        ${genCSL(this.name)}

        static deserialize(reader: CBORReader): ${this.name} {
          let ret = new ${this.name}();
          ret.items = reader.readArray(reader => ${readType(customTypes, "reader", this.item)});
          return ret;
        }

        serialize(writer: CBORWriter) {
          writer.writeArray(this.items, (writer, x) => ${writeType(customTypes, "writer", "x", this.item)});
        }
      }
    `;
  }
}
