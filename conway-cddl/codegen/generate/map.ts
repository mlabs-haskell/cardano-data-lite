import { CodeGenerator } from ".";
import { jsType, eqType, readType, writeType } from "./utils/cbor-utils";
import { genCSL } from "./utils/csl";

export class GenMap implements CodeGenerator {
  name: string;
  key: string;
  value: string;

  constructor(name: string, key: string, value: string) {
    this.name = name;
    this.key = key;
    this.value = value;
  }

  generate(customTypes: Set<string>): string {
    let keyJsType = jsType(this.key, customTypes);
    let valueJsType = jsType(this.value, customTypes);
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
          this.items.push([key, value]);
        }

        get(key: ${keyJsType}): ${valueJsType} | undefined {
          let entry = this.items.find(x => ${eqType(customTypes, "key", "x[0]", this.key)});
          if(entry == null) return undefined;
          return entry[1];
        }


        ${genCSL(this.name)}

        static deserialize(reader: CBORReader): ${this.name} {
          let ret = new ${this.name}();
          ret.items = reader.readMap(reader => [${(readType(customTypes, "reader", this.key), readType(customTypes, "reader", this.value))}]);
          return ret;
        }

        serialize(writer: CBORWriter) {
          writer.writeMap(this.items, (writer, x) => {
            ${writeType(customTypes, "writer", "x[0]", this.key)};
            ${writeType(customTypes, "writer", "x[1]", this.value)};
          });
        }
      }
    `;
  }
}
