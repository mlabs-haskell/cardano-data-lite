import { CodeGeneratorBase } from ".";
import { SchemaTable } from "../compiler";
import { genAccessors, genConstructor, genMembers } from "./utils/structured";

export type Field = {
  name: string;
  type: string;
  nullable?: boolean;
};

export class GenRecordFragment extends CodeGeneratorBase {
  fields: Field[];

  constructor(name: string, fields: Field[], customTypes: SchemaTable) {
    super(name, customTypes);
    this.fields = fields;
  }

  generate(): string {
    return `
      export class ${this.name} {
        ${genMembers(this.fields, this.typeUtils)}
        ${genConstructor(this.fields, this.typeUtils)}
        ${genAccessors(this.fields, this.typeUtils)}

        static deserialize(reader: CBORReader): ${this.name} {
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
