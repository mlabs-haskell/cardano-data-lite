import { CodeGeneratorBase, CodeGeneratorBaseOptions } from "..";
import { SchemaTable } from "../..";

type StructureField = {
  name: string;
  type: string;
  optional?: boolean;
  nullable?: boolean;
};

export type GenStructuredBaseOptions<Field extends StructureField> =
  CodeGeneratorBaseOptions & {
    fields: Field[];
  };

export class GenStructuredBase<
  Field extends StructureField,
> extends CodeGeneratorBase {
  options: GenStructuredBaseOptions<Field>;

  constructor(
    name: string,
    customTypes: SchemaTable,
    options: GenStructuredBaseOptions<Field>,
  ) {
    super(name, customTypes, options);
    this.options = options;
  }

  private fieldType(field: Field) {
    return `${this.typeUtils.jsType(field.type)} ${field.optional || field.nullable ? "| undefined" : ""}`;
  }

  getFields(): Field[] {
    return this.options.fields;
  }

  generateMembers(): string {
    return this.options.fields
      .map((x) => `private _${x.name}: ${this.fieldType(x)};`)
      .join("\n");
  }

  generateConstructor(): string {
    return `
      constructor(${this.getFields()
        .map((x) => `${x.name}: ${this.fieldType(x)}`)
        .join(", ")}) {
        ${this.getFields()
          .map((x) => `this._${x.name} = ${x.name};`)
          .join("\n")}
      }
      ${this.renameMethod(
        "new",
        (new_) => `
      static ${new_}(${this.getFields()
        .map((x) => `${x.name}: ${this.fieldType(x)}`)
        .join(", ")}) {
          return new ${this.name}(${this.getFields()
            .map((x) => x.name)
            .join(",")});
        }
      `,
      )}
    `;
  }

  generateAccessors(): string {
    return this.getFields()
      .map(
        (x) => `
        get_${x.name}(): ${this.fieldType(x)} {
          return this._${x.name};
        }

        set_${x.name}(${x.name}: ${this.fieldType(x)}): void {
          this._${x.name} = ${x.name};
        }
      `,
      )
      .join("\n");
  }

  generateExtraMethods(): string {
    return this.generateAccessors();
  }
}
