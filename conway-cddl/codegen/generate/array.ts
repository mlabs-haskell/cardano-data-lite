import { CodeGeneratorBase } from ".";
import { SchemaTable } from "../compiler";
import { genCSL } from "./utils/csl";

export class GenArray extends CodeGeneratorBase {
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

        static deserialize(reader: CBORReader): ${this.name} {
          return new ${this.name}(reader.readArray(reader => ${this.typeUtils.readType("reader", this.item)}));
        }

        serialize(writer: CBORWriter) {
          writer.writeArray(this.items, (writer, x) => ${this.typeUtils.writeType("writer", "x", this.item)});
        }
      }
    `;
  }
}
