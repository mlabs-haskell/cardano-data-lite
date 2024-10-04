import { GenStructuredBase, GenStructuredBaseOptions } from ".";
import { SchemaTable } from "../..";

export type Field = {
  name: string;
  type: string;
  nullable?: boolean;
};

export type GenRecordFragmentOptions = {
  fields: Field[];
} & GenStructuredBaseOptions<Field>;

export class GenRecordFragment extends GenStructuredBase<Field> {
  constructor(
    name: string,
    customTypes: SchemaTable,
    options: GenRecordFragmentOptions,
  ) {
    super(name, customTypes, { genCSL: false, ...options });
  }

  generateDeserialize(reader: string): string {
    return `
      ${this.getFields()
        .map(
          (x) => `
          let ${x.name} = ${
            x.nullable
              ? `${reader}.readNullable(r => ${this.typeUtils.readType("r", x.type)})?? undefined`
              : this.typeUtils.readType(reader, x.type)
          };`,
        )
        .join("\n")}

      return new ${this.name}(${this.getFields()
        .map((x) => x.name)
        .join(", ")}) 
      `;
  }

  generateSerialize(writer: string): string {
    return `
      ${this.getFields()
        .map((x) =>
          x.nullable
            ? `if(this._${x.name} == null) { 
                  ${writer}.writeNull();
              } else { 
                  ${this.typeUtils.writeType("writer", `this._${x.name}`, x.type)};
              }`
            : `${this.typeUtils.writeType("writer", `this._${x.name}`, x.type)};`,
        )
        .join("\n")}
    `;
  }

  generateExtraMethods(): string {
    return (
      super.generateExtraMethods() +
      `
        // no-op
        free() { }
      `
    );
  }
}
