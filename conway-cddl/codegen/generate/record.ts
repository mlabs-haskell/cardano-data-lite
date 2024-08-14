import { CodeGenerator } from ".";
import { readType, writeType } from "./utils/cbor-utils";
import { genCSL } from "./utils/csl";
import { genAccessors, genConstructor, genMembers } from "./utils/structured";

export type Field = {
  name: string;
  type: string;
  nullable?: boolean;
};

export class GenRecord implements CodeGenerator {
  name: string;
  fields: Field[];

  constructor(name: string, fields: Field[]) {
    this.name = name;
    this.fields = fields;
  }

  generate(customTypes: Set<string>): string {
    return `
      export class ${this.name} {
        ${genMembers(this.fields, customTypes)}
        ${genConstructor(this.fields, customTypes)}
        ${genAccessors(this.fields, customTypes)}
        ${genCSL(this.name)}

        static deserialize(reader: CBORReader): ${this.name} {
          let len = reader.readArrayTag();
          
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
          writer.writeArrayTag(${this.fields.length});

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
