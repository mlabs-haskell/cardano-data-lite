import { CodeGeneratorBase, CodeGeneratorBaseOptions } from ".";
import { SchemaTable } from "..";

export type GenArrayOptions = {
  item: string;
} & CodeGeneratorBaseOptions;

export class GenArray extends CodeGeneratorBase {
  item: string;

  constructor(
    name: string,
    customTypes: SchemaTable,
    options: GenArrayOptions,
  ) {
    super(name, customTypes, { genCSL: true, ...options });
    this.item = options.item;
  }

  private itemJsType() {
    return this.typeUtils.jsType(this.item);
  }

  generateMembers(): string {
    return `private items: ${this.itemJsType()}[];`;
  }

  generateConstructor(): string {
    return `
        constructor(items: ${this.itemJsType()}[]) {
          this.items = items;
        }
    `;
  }

  generateExtraMethods(): string {
    let itemJsType = this.typeUtils.jsType(this.item);
    return `
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
    `;
  }

  generateDeserialize(reader: string, path: string): string {
    return `
      return new ${this.name}(
        ${reader}.readArray(
          (reader, idx) => ${this.typeUtils.readType("reader", this.item, `[...${path}, "Elem#" + idx]`)}
          , ${path}
        )
      );
    `;
  }

  generateSerialize(writer: string): string {
    return `
      ${writer}.writeArray(
        this.items,
        (writer, x) => ${this.typeUtils.writeType("writer", "x", this.item)}
      );
    `;
  }
}
