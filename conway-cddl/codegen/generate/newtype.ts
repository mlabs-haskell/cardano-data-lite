import { CodeGeneratorBase } from ".";
import { SchemaTable } from "../compiler";
import { genCSL } from "./utils/csl";

export class GenNewtype extends CodeGeneratorBase {
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
    constraints:
      | {
          len?: {
            eq?: number;
            min?: number;
            max?: number;
          };
        }
      | undefined,
    customTypes: SchemaTable,
  ) {
    super(name, customTypes);
    this.item = item;
    this.accessor = accessor;
    this.constraints = constraints;
  }

  generate(): string {
    let itemJsType = this.typeUtils.jsType(this.item);
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
          return new ${this.name}(${this.typeUtils.readType("reader", this.item)});
        }

        serialize(writer: CBORWriter) {
          ${this.typeUtils.writeType("writer", "this.inner", this.item)};
        }
      }
    `;
  }
}
