import { TypeUtils } from "..";

type Field = {
  name: string;
  type: string;
  optional?: boolean;
  nullable?: boolean;
};

function fieldType(field: Field, typeUtils: TypeUtils) {
  return `${typeUtils.jsType(field.type)} ${field.optional || field.nullable ? "| undefined" : ""}`;
}

export function genMembers(fields: Field[], typeUtils: TypeUtils) {
  return fields
    .map((x) => `private ${x.name}: ${fieldType(x, typeUtils)};`)
    .join("\n");
}

export function genConstructor(fields: Field[], typeUtils: TypeUtils) {
  return `
  constructor(${fields.map((x) => `${x.name}: ${fieldType(x, typeUtils)}`).join(", ")}) {
    ${fields.map((x) => `this.${x.name} = ${x.name};`).join("\n")}
  }`;
}

export function genAccessors(fields: Field[], typeUtils: TypeUtils) {
  return fields
    .map(
      (x) => `
        get_${x.name}(): ${fieldType(x, typeUtils)} {
          return this.${x.name};
        }

        set_${x.name}(${x.name}: ${fieldType(x, typeUtils)}): void {
          this.${x.name} = ${x.name};
        }
      `,
    )
    .join("\n");
}
