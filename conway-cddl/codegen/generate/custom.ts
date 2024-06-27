type Field = {
  name: string;
  type: GenLeaf;
  optional?: boolean;
};

export function genMembers(fields: Field[]) {
  return fields
    .map(
      (x) =>
        `private ${x.name}: ${x.type.name()}${x.optional ? "|undefined" : ""};`,
    )
    .join("\n");
}

export function genConstructor(fields: Field[]) {
  return `
  constructor(${fields.map((x) => `${x.name}: ${x.optional ? "|undefined" : ""}`).join(",")}) {
    ${fields.map((x) => `this.${x.name} = ${x.name};`).join("\n")}
  }`;
}

export function genAccessors(fields: Field[]) {
  return fields
    .map(
      (x) => `
        get_${x.name}(): ${x.type.name()} {
          return this.${x.name};
        }

        set_${x.name}(${x.name}: ${x.type.name()}): ${x.type.name()} {
          this.${x.name} = ${x.name};
        }
        `,
    )
    .join("\n");
}
