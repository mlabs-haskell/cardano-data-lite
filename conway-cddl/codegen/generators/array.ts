import { CodeGeneratorBase, CodeGeneratorBaseOptions } from ".";
import { SchemaTable } from "..";

export type GenArrayOptions = {
  item: string | undefined;
} & CodeGeneratorBaseOptions;

export class GenArray extends CodeGeneratorBase {
  item: string | undefined;

  constructor(
    name: string,
    customTypes: SchemaTable,
    options: GenArrayOptions,
  ) {
    super(name, customTypes, { genCSL: true, ...options });
    this.item = options.item;
  }

  private itemJsType() {
    return this.item ? `${this.typeUtils.jsType(this.item)}` : undefined;
  }

  generateMembers(): string {
    const jsType = this.itemJsType();
    return `
      private items: ${jsType ? `${jsType}[]` : `Uint32Array`};
      private definiteEncoding: boolean;
    `;
  }

  generateConstructor(): string {
    const jsType = this.itemJsType();
    return `
        constructor(items: ${jsType ? `${jsType}[]` : `Uint32Array`}, definiteEncoding: boolean = true) {
          this.items = items;
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
          return this.items.length;
        }

        ${jsType ?
          `
          get(index: number): ${jsType} {
            if(index >= this.items.length) throw new Error("Array out of bounds");
            return this.items[index];
          }

          add(elem: ${jsType}): void {
            this.items.push(elem);
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
          this.items,
          (writer, x) => ${this.typeUtils.writeType("writer", "x", this.item)},
          this.definiteEncoding
        );
      `;
    } else {
      return `
        ${writer}.writeArray(this.items, (writer, x) => writer.writeInt(BigInt(x)), this.definiteEncoding)
      `
    }
  }

  generateArbitrary(prng: string): string {
      return `
        let [isDefinite, prng1] = prand.uniformIntDistribution(0, 1, prng);
        let [len, prng_mut] = prand.uniformIntDistribution(0, 3, prng1);
        ${this.item ?
            `let ret = new ${this.name}([], isDefinite > 0);` :
            `let items = new Uint32Array(len);`
        }
        for (let i = 0; i < len; i++) {
          ${this.item ?
              `ret.add(${this.itemJsType()}.arbitrary(prng_mut));` :
              `items[i] = prand.unsafeUniformIntDistribution(0, 4294967295, prng_mut);`
            }
          prand.unsafeSkipN(prng_mut, 1);
        }
        ${this.item ?
          `return ret;` :
          `return new ${this.name}(items, isDefinite > 0);`
        }
      `;
  }
}
