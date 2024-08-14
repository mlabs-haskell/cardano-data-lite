import { SchemaTable } from "../../compiler";
import { jsType } from "./cbor-utils";

type Field = {
  name: string;
  type: string;
  optional?: boolean;
  nullable?: boolean;
};

function fieldType(field: Field, customTypes: SchemaTable) {
  return `${jsType(field.type, customTypes)} ${field.optional || field.nullable ? "| undefined" : ""}`;
}

export function genMembers(fields: Field[], customTypes: SchemaTable) {
  return fields
    .map((x) => `private ${x.name}: ${fieldType(x, customTypes)};`)
    .join("\n");
}

export function genConstructor(fields: Field[], customTypes: SchemaTable) {
  return `
  constructor(${fields.map((x) => `${x.name}: ${fieldType(x, customTypes)}`).join(", ")}) {
    ${fields.map((x) => `this.${x.name} = ${x.name};`).join("\n")}
  }`;
}

export function genAccessors(fields: Field[], customTypes: SchemaTable) {
  return fields
    .map(
      (x) => `
        get_${x.name}(): ${fieldType(x, customTypes)} {
          return this.${x.name};
        }

        set_${x.name}(${x.name}: ${fieldType(x, customTypes)}): void {
          this.${x.name} = ${x.name};
        }
      `,
    )
    .join("\n");
}
