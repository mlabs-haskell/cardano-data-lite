import { CodeGeneratorBase, CodeGeneratorBaseOptions } from ".";
import { SchemaTable } from "..";

export type GenMapOptions = {
  key: string;
  value: string;
  keys_method_type?: string;
} & CodeGeneratorBaseOptions;

export class GenMap extends CodeGeneratorBase {
  key: string;
  value: string;
  keys_method_type?: string;

  constructor(name: string, customTypes: SchemaTable, options: GenMapOptions) {
    super(name, customTypes, { genCSL: true, ...options });
    this.key = options.key;
    this.value = options.value;
    this.keys_method_type = options.keys_method_type;
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

      insert(key: ${keyJsType}, value: ${valueJsType}): ${valueJsType} | undefined {
        let entry = this.items.find(x => ${this.typeUtils.eqType("key", "x[0]", this.key)});
        if(entry != null) {
          let ret = entry[1];
          entry[1] = value;
          return ret;
        }
        this.items.push([key, value]);
        return undefined;
      }

      get(key: ${keyJsType}): ${valueJsType} | undefined {
        let entry = this.items.find(x => ${this.typeUtils.eqType("key", "x[0]", this.key)});
        if(entry == null) return undefined;
        return entry[1];
      }

      _remove_many(keys: ${keyJsType}[]): void {
        this.items = this.items.filter(
          ([k, _v]) => keys.every(
            key => !(${this.typeUtils.eqType("key", "k", this.key)})
          )
        );
      }

      ${this.generateKeysMethod()}
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

  generateKeysMethod(): string {
    if (this.keys_method_type == null) return "";
    return this.renameMethod(
      "keys",
      (keys) => `
      ${keys}(): ${this.keys_method_type} {
        let keys = ${this.keys_method_type}.new();
        for(let [key, _] of this.items) keys.add(key);
        return keys;
      }
      `,
    );
  }
}
