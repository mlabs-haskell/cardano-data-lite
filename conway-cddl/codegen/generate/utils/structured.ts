type Field = {
  name: string;
  type: string;
  optional?: boolean;
  nullable?: boolean;
};

function fieldType(field: Field) {
  return `${field.type} ${field.optional || field.nullable ? "| undefined" : ""}`;
}

export function genMembers(fields: Field[]) {
  return fields.map((x) => `private ${x.name}: ${fieldType(x)};`).join("\n");
}

export function genConstructor(fields: Field[]) {
  return `
  constructor(${fields.map((x) => `${x.name}: ${fieldType(x)}`).join(", ")}) {
    ${fields.map((x) => `this.${x.name} = ${x.name};`).join("\n")}
  }`;
}

export function genAccessors(fields: Field[]) {
  return fields
    .map(
      (x) => `
        get_${x.name}(): ${fieldType(x)} {
          return this.${x.name};
        }

        set_${x.name}(${x.name}: ${fieldType(x)}): void {
          this.${x.name} = ${x.name};
        }
      `,
    )
    .join("\n");
}
