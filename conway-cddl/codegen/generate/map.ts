import { CodeGeneratorBase } from ".";
import { SchemaTable } from "../compiler";
import { genCSL } from "./utils/csl";

export class GenMap extends CodeGeneratorBase {
  key: string;
  value: string;

  constructor(
    name: string,
    key: string,
    value: string,
    customTypes: SchemaTable,
  ) {
    super(name, customTypes);
    this.key = key;
    this.value = value;
  }

  generate(): string {
    let keyJsType = this.typeUtils.jsType(this.key);
    let valueJsType = this.typeUtils.jsType(this.value);
    let entryJsType = `[${keyJsType}, ${valueJsType}]`;
    return `
      export class ${this.name} {
        private items: ${entryJsType}[];

        ${genCSL(this.name)}

        constructor(items: ${entryJsType}[]) {
          this.items = items;
        }

        static new(): ${this.name} {
          return new ${this.name}([]);
        }

        len(): number {
          return this.items.length;
        }

        insert(key: ${keyJsType}, value: ${valueJsType}): void {
          let entry = this.items.find(x => ${this.typeUtils.eqType("key", "x[0]", this.key)});
          if(entry != null) entry[1] = value;
          else this.items.push([key, value]);
        }

        get(key: ${keyJsType}): ${valueJsType} | undefined {
          let entry = this.items.find(x => ${this.typeUtils.eqType("key", "x[0]", this.key)});
          if(entry == null) return undefined;
          return entry[1];
        }

        static deserialize(reader: CBORReader): ${this.name} {
          let ret = new ${this.name}([]);
          reader.readMap(reader => ret.insert(${this.typeUtils.readType("reader", this.key)}, ${this.typeUtils.readType("reader", this.value)}));
          return ret;
        }

        serialize(writer: CBORWriter) {
          writer.writeMap(this.items, (writer, x) => {
            ${this.typeUtils.writeType("writer", "x[0]", this.key)};
            ${this.typeUtils.writeType("writer", "x[1]", this.value)};
          });
        }
      }
    `;
  }
}
