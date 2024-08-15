import { CodeGeneratorBase } from ".";
import { SchemaTable } from "../compiler";
import { genCSL } from "./utils/csl";
import { genAccessors, genConstructor, genMembers } from "./utils/structured";
import { Tagged, deserializeTagged, serializeTagged } from "./utils/tagged";

export type Field = {
  name: string;
  type: string;
  nullable?: boolean;
};

export class GenRecord extends CodeGeneratorBase {
  fields: Field[];
  tagged?: Tagged;

  constructor(
    name: string,
    fields: Field[],
    tagged: Tagged | undefined,
    customTypes: SchemaTable,
  ) {
    super(name, customTypes);
    this.fields = fields;
    this.tagged = tagged;
  }

  generate(): string {
    return `
      export class ${this.name} {
        ${genMembers(this.fields, this.typeUtils)}
        ${genConstructor(this.fields, this.typeUtils)}
        ${genAccessors(this.fields, this.typeUtils)}
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
                  ? `reader.readNullable(r => ${this.typeUtils.readType("r", x.type)})?? undefined`
                  : this.typeUtils.readType("reader", x.type)
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
                      ${this.typeUtils.writeType("writer", `this.${x.name}`, x.type)};
                  }`
                : `${this.typeUtils.writeType("writer", `this.${x.name}`, x.type)};`,
            )
            .join("\n")}
        }
      }`;
  }
}
