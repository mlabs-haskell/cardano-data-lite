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
  isFragment: boolean;

  constructor(name: string, fields: Field[], isFragment = false) {
    this.name = name;
    this.fields = fields;
    this.isFragment = isFragment;
  }

  generate(customTypes: Set<string>): string {
    return `
      export class ${this.name} {
        ${genMembers(this.fields)}
        ${genConstructor(this.fields)}
        ${genAccessors(this.fields)}
        ${genCSL(this.name)}

        const FRAGMENT_FIELDS_LEN: number = ${this.fields.length};

        ${
          this.isFragment
            ? ` 
        static deserialize(reader: CBORReader, len: number | null): ${this.name} {
            `
            : `
        static deserialize(reader: CBORReader): ${this.name} {
            let len = reader.readArrayTag();
            `
        }
          
          if(len != null && len < ${this.fields.length}) {
            throw new Error("Insufficient number of fields in record. Expected ${this.fields.length}. Received " + len);
          }

          ${this.fields
            .map(
              (x) => `
              let ${x.name} = ${
                x.nullable
                  ? `reader.readNullable(r => ${readType(customTypes, "r", x.type)})`
                  : readType(customTypes, "reader", x.type)
              };`,
            )
            .join("\n")}

          return new ${this.name}(${this.fields.map((x) => x.name).join(", ")}) 
        }

        serialize(writer: CBORWriter): void {
          ${
            !this.isFragment
              ? `writer.writeArrayTag(${this.fields.length});`
              : ""
          }

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
