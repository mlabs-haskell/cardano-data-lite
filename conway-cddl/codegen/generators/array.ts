import { CodeGeneratorBase, CodeGeneratorBaseOptions } from ".";
import { SchemaTable } from "..";

export type GenArrayOptions = {
  item?: string;
  default_to_indefinite?: boolean;
} & CodeGeneratorBaseOptions;

export class GenArray extends CodeGeneratorBase {
  item?: string;
  defaultToIndefinite?: boolean;

  constructor(
    name: string,
    customTypes: SchemaTable,
    options: GenArrayOptions,
  ) {
    super(name, customTypes, { genCSL: true, ...options });
    this.item = options.item;
    this.defaultToIndefinite = options.default_to_indefinite;
  }

  private itemJsType() {
    return this.item ? `${this.typeUtils.jsType(this.item)}` : undefined;
  }

  generateMembers(): string {
    const jsType = this.itemJsType();
    return `
      _items: ${jsType ? `${jsType}[]` : `Uint32Array`};
      private definiteEncoding: boolean;
    `;
  }

  generateConstructor(): string {
    const jsType = this.itemJsType();
    return `
        constructor(
          items: ${jsType ? `${jsType}[]` : `Uint32Array`}, 
          definiteEncoding: boolean = ${!this.defaultToIndefinite}
        ) {
          this._items = items;
          this.definiteEncoding = definiteEncoding;
        }
    `;
  }

  generateExtraMethods(): string {
    let jsType = this.itemJsType();
    return `
        static new(): ${this.name} {
          return new ${this.name}(${jsType ? "[]" : "new Uint32Array([])"});
        }

        len(): number {
          return this._items.length;
        }

        ${jsType ?
        `
          get(index: number): ${jsType} {
            if(index >= this._items.length) throw new Error("Array out of bounds");
            return this._items[index];
          }

          add(elem: ${jsType}): void {
            this._items.push(elem);
          }
          ` : ''
      }
    `;
  }

  generateDeserialize(reader: string, path: string): string {
    if (this.item) {
      return `
        const { items, definiteEncoding } = 
          ${reader}.readArray(
            (reader, idx) => ${this.typeUtils.readType("reader", this.item, `[...${path}, "Elem#" + idx]`)}
            , ${path}
          )
        return new ${this.name}(items, definiteEncoding);
      `;
    } else {
      return `
        const { items, definiteEncoding } = 
          ${reader}.readArray(
            (reader, idx) => Number(reader.readUint([...${path}, "Byte#" + idx]))
            , ${path}
          )

        return new ${this.name}(new Uint32Array(items), definiteEncoding);
      `;
    }
  }

  generateSerialize(writer: string): string {
    if (this.item) {
      return `
        ${writer}.writeArray(
          this._items,
          (writer, x) => ${this.typeUtils.writeType("writer", "x", this.item)},
          this.definiteEncoding
        );
      `;
    } else {
      return `
        ${writer}.writeArray(this._items, 
          (writer, x) => writer.writeInt(BigInt(x)), 
          this.definiteEncoding,
        )
      `
    }
  }
}
