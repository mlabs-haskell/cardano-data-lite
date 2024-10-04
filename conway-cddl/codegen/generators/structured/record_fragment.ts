import { GenStructuredBase, GenStructuredBaseOptions } from ".";
import { SchemaTable } from "../..";

export type Field = {
  name: string;
  type: string;
  nullable?: boolean;
};

export type GenRecordFragmentOptions = {
  fields: Field[];
  // When implementing custom serialize/deserialize methods, set this
  // value to how many entries are there in the encoded array.
  fragment_encode_len?: number;
} & GenStructuredBaseOptions<Field>;

export class GenRecordFragment extends GenStructuredBase<Field> {
  fragmentEncodeLen?: number;
  constructor(
    name: string,
    customTypes: SchemaTable,
    options: GenRecordFragmentOptions,
  ) {
    super(name, customTypes, { genCSL: true, ...options });
    this.fragmentEncodeLen = this.fragmentEncodeLen;
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
}
