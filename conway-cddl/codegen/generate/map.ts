import { CodeGeneratorBase, CodeGeneratorBaseOptions } from ".";
import { SchemaTable } from "../compiler";

export type GenMapOptions = {
  key: string;
  value: string;
} & CodeGeneratorBaseOptions;

export class GenMap extends CodeGeneratorBase {
  key: string;
  value: string;

  constructor(name: string, customTypes: SchemaTable, options: GenMapOptions) {
    super(name, customTypes, { genCSL: true, ...options });
    this.key = options.key;
    this.value = options.value;
  }

  private entryJsType(): string {
    let keyJsType = this.typeUtils.jsType(this.key);
    let valueJsType = this.typeUtils.jsType(this.value);
    let entryJsType = `[${keyJsType}, ${valueJsType}]`;
    return entryJsType;
  }

  generateMembers(): string {
    return `      
      private items: ${this.entryJsType()}[];
    `;
  }

  generateConstructor(): string {
    return `
      constructor(items: ${this.entryJsType()}[]) {
        this.items = items;
      }
    `;
  }

  generateExtraMethods(): string {
    let keyJsType = this.typeUtils.jsType(this.key);
    let valueJsType = this.typeUtils.jsType(this.value);
    return `
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
    `;
  }

  generateDeserialize(reader: string): string {
    return `
      let ret = new ${this.name}([]);
      ${reader}.readMap(
        reader => ret.insert(
          ${this.typeUtils.readType("reader", this.key)},
          ${this.typeUtils.readType("reader", this.value)}
        )
      );
      return ret;
    `;
  }

  generateSerialize(writer: string): string {
    return `
      ${writer}.writeMap(this.items, (writer, x) => {
        ${this.typeUtils.writeType("writer", "x[0]", this.key)};
        ${this.typeUtils.writeType("writer", "x[1]", this.value)};
      });
    `;
  }
}
