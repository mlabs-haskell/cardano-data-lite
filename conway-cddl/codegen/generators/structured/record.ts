import { GenStructuredBase, GenStructuredBaseOptions } from ".";
import { SchemaTable } from "../..";

export type Field = {
  name: string;
  type: string;
  nullable?: boolean;
};

export type GenRecordOptions = {
  fields: Field[];
} & GenStructuredBaseOptions<Field>;

export class GenRecord extends GenStructuredBase<Field> {
  constructor(
    name: string,
    customTypes: SchemaTable,
    options: GenRecordOptions,
  ) {
    super(name, customTypes, { genCSL: true, ...options });
  }

  generateDeserialize(reader: string): string {
    return `
      let len = ${reader}.readArrayTag();
      
      if(len != null && len < ${this.getFields().length}) {
        throw new Error("Insufficient number of fields in record. Expected ${this.getFields().length}. Received " + len);
      }

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
      ${writer}.writeArrayTag(${this.getFields().length});

      ${this.getFields()
        .map((x) =>
          x.nullable
            ? `if(this._${x.name} == null) { 
                  ${writer}.writeNull();
              } else { 
                  ${this.typeUtils.writeType(writer, `this._${x.name}`, x.type)};
              }`
            : `${this.typeUtils.writeType(writer, `this._${x.name}`, x.type)};`,
        )
        .join("\n")}
    `;
  }
}
