import { CodeGeneratorBase, CodeGeneratorBaseOptions } from ".";
import { SchemaTable } from "..";

export type GenNewtypeOptions = {
  item: string;
  accessor: string;
  constraints?: {
    len?: {
      eq?: number;
      min?: number;
      max?: number;
    };
  };
} & CodeGeneratorBaseOptions;

export class GenNewtype extends CodeGeneratorBase {
  item: string;
  accessor: string;
  constraints?: {
    len?: {
      eq?: number;
      min?: number;
      max?: number;
    };
    value?: {
      eq?: number;
      min?: number;
      max?: number;
    };
  };

  constructor(
    name: string,
    customTypes: SchemaTable,
    options: GenNewtypeOptions,
  ) {
    super(name, customTypes, { genCSL: true, ...options });
    this.item = options.item;
    this.accessor = options.accessor;
    this.constraints = options.constraints;
  }

  private itemJsType(): string {
    return this.typeUtils.jsType(this.item);
  }

  generateMembers(): string {
    return `
      private inner: ${this.itemJsType()};
    `;
  }

  generateConstructor(): string {
    return ` 
      constructor(inner: ${this.itemJsType()}) {
        ${
          this.constraints?.len?.eq != null
            ? `if(inner.length != ${this.constraints.len.eq}) throw new Error("Expected length to be ${this.constraints.len.eq}");`
            : ""
        }
        ${
          this.constraints?.len?.min != null
            ? `if(inner.length < ${this.constraints.len.min}) throw new Error("Expected length to be atleast ${this.constraints.len.min}");`
            : ""
        }
        ${
          this.constraints?.len?.max != null
            ? `if(inner.length > ${this.constraints.len.max}) throw new Error("Expected length to be atmost ${this.constraints.len.max}");`
            : ""
        }
        ${
          this.constraints?.value?.eq != null
            ? `if(inner != ${this.constraints.value.eq}) throw new Error("Expected value to be ${this.constraints.value.eq}");`
            : ""
        }
        ${
          this.constraints?.value?.min != null
            ? `if(inner < ${this.constraints.value.min}) throw new Error("Expected value to be atleast ${this.constraints.value.min}");`
            : ""
        }
        ${
          this.constraints?.value?.max != null
            ? `if(inner > ${this.constraints.value.max}) throw new Error("Expected value to be atmost ${this.constraints.value.max}");`
            : ""
        }
        this.inner = inner;
      }
    `;
  }

  generateExtraMethods(): string {
    let itemJsType = this.itemJsType();
    return `
      ${this.renameMethod(
        "new",
        (new_) => `
        static ${new_}(inner: ${itemJsType}): ${this.name} {
          return new ${this.name}(inner);
        }`,
      )}

      ${this.accessor}(): ${itemJsType} {
        return this.inner;
      }
    `;
  }

  generateDeserialize(reader: string, path: string): string {
    return ` 
      return new ${this.name}(${this.typeUtils.readType(reader, this.item, path)});
    `;
  }

  generateSerialize(writer: string): string {
    return `
      ${this.typeUtils.writeType(writer, "this.inner", this.item)}; 
    `;
  }
}
