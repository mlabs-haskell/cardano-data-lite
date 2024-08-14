import { CodeGenerator } from ".";
import { SchemaTable } from "../compiler";
import { readType, writeType } from "./utils/cbor-utils";
import { genAccessors, genConstructor, genMembers } from "./utils/structured";

export type Field = {
  name: string;
  type: string;
  nullable?: boolean;
};

export class GenRecordFragment implements CodeGenerator {
  name: string;
  fields: Field[];

  constructor(name: string, fields: Field[]) {
    this.name = name;
    this.fields = fields;
  }

  generate(customTypes: SchemaTable): string {
    return `
      export class ${this.name} {
        static FRAGMENT_FIELDS_LEN: number = ${this.fields.length};

        ${genMembers(this.fields, customTypes)}
        ${genConstructor(this.fields, customTypes)}
        ${genAccessors(this.fields, customTypes)}

        static deserialize(reader: CBORReader, len: number | null): ${this.name} {
          
          if(len != null && len < ${this.fields.length}) {
            throw new Error("Insufficient number of fields in record. Expected ${this.fields.length}. Received " + len);
          }

          ${this.fields
            .map(
              (x) => `
              let ${x.name} = ${
                x.nullable
                  ? `reader.readNullable(r => ${readType(customTypes, "r", x.type)})?? undefined`
                  : readType(customTypes, "reader", x.type)
              };`,
            )
            .join("\n")}

          return new ${this.name}(${this.fields.map((x) => x.name).join(", ")}) 
        }

        serialize(writer: CBORWriter): void {
          ${this.fields
            .map((x) =>
              x.nullable
                ? `if(this.${x.name} == null) { 
                      writer.writeNull();
                  } else { 
                      ${writeType(customTypes, "writer", `this.${x.name}`, x.type)};
                  }`
                : `${writeType(customTypes, "writer", `this.${x.name}`, x.type)};`,
            )
            .join("\n")}
        }
      }`;
  }
}
