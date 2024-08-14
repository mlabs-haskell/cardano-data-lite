import { CodeGenerator } from ".";
import { SchemaTable } from "../compiler";
import { readType, writeType } from "./utils/cbor-utils";
import { genCSL } from "./utils/csl";
import { genAccessors, genConstructor, genMembers } from "./utils/structured";
import { Tagged, deserializeTagged, serializeTagged } from "./utils/tagged";

export type Field = {
  name: string;
  type: string;
  nullable?: boolean;
};

export class GenRecord implements CodeGenerator {
  name: string;
  fields: Field[];
  tagged?: Tagged;

  constructor(name: string, fields: Field[], tagged?: Tagged) {
    this.name = name;
    this.fields = fields;
    this.tagged = tagged;
    console.log(name, tagged);
  }

  generate(customTypes: SchemaTable): string {
    return `
      export class ${this.name} {
        ${genMembers(this.fields, customTypes)}
        ${genConstructor(this.fields, customTypes)}
        ${genAccessors(this.fields, customTypes)}
        ${genCSL(this.name)}

        static deserialize(reader: CBORReader): ${this.name} {
          ${this.tagged != null ? deserializeTagged(this.tagged, "reader") : ""}

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
          ${this.tagged != null ? serializeTagged(this.tagged, "writer") : ""}

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
