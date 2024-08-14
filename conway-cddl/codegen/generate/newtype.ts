import { CodeGenerator } from ".";
import { jsType, readType, writeType } from "./utils/cbor-utils";
import { genCSL } from "./utils/csl";

export class GenNewtype implements CodeGenerator {
  name: string;
  item: string;
  accessor: string;
  constraints?: {
    len?: {
      eq?: number;
      min?: number;
      max?: number;
    };
  };

  constructor(
    name: string,
    item: string,
    accessor: string,
    constraints?: {
      len?: {
        eq?: number;
        min?: number;
        max?: number;
      };
    },
  ) {
    this.name = name;
    this.item = item;
    this.accessor = accessor;
    this.constraints = constraints;
  }

  generate(customTypes: Set<string>): string {
    let itemJsType = jsType(this.item, customTypes);
    return `
      export class ${this.name} {
        private inner: ${itemJsType};

        ${genCSL(this.name)}

        constructor(inner: ${itemJsType}) {
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
          this.inner = inner;
        }

        static new(inner: ${itemJsType}): ${this.name} {
          return new ${this.name}(inner);
        }

        ${this.accessor}(): ${itemJsType} {
          return this.inner;
        }

        static deserialize(reader: CBORReader): ${this.name} {
          return new ${this.name}(${readType(customTypes, "reader", this.item)});
        }

        serialize(writer: CBORWriter) {
          ${writeType(customTypes, "writer", "this.inner", this.item)};
        }
      }
    `;
  }
}
