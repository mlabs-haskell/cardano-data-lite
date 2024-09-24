import { CodeGeneratorBase, CodeGeneratorBaseOptions } from ".";
import { SchemaTable } from "..";

export type Variant = {
  tag: number; // number assigned to the variant in the FooKind enum
  peek_type: string | string[]; // decode this variant if the CBOR type tag equals any of these values
  name: string; // used in Class.new_foo()
  type: string; // used to do if (reader.getTag() == tag) type.deserialize()
  kind_name?: string; // name of the variant in the FooKind enum
};

export type GenUnionOptions = {
  variants: Variant[];
} & CodeGeneratorBaseOptions;

export class GenUnion extends CodeGeneratorBase {
  variants: Variant[];

  constructor(
    name: string,
    customTypes: SchemaTable,
    options: GenUnionOptions,
  ) {
    super(name, customTypes, { genCSL: true, ...options });
    this.variants = options.variants;
  }

  generatePre(): string {
    return `
      export enum ${this.name}Kind {
        ${this.variants.map((x) => `${x.kind_name ?? x.type} = ${x.tag},`).join("\n")}
      }

      export type ${this.name}Variant = 
        ${this.variants
          .map(
            (x) =>
              `{ kind: ${x.tag}, value: ${this.typeUtils.jsType(x.type)} }`,
          )
          .join(" | ")};
     `;
  }

  generateMembers(): string {
    return `
        private variant: ${this.name}Variant;
    `;
  }

  generateConstructor(): string {
    return `
        constructor(variant: ${this.name}Variant) {
          this.variant = variant;
        }
     `;
  }

  generateExtraMethods(): string {
    return `
        ${this.variants
          .map(
            (x) =>
              `
        static new_${x.name}(${x.name}: ${this.typeUtils.jsType(x.type)}): ${this.name} {
          return new ${this.name}({kind: ${x.tag}, value: ${x.name}});
        }
              `,
          )
          .join("\n")}

        ${this.variants
          .map(
            (x) =>
              `
        as_${x.name}(): ${this.typeUtils.jsType(x.type)} {
          if(this.variant.kind == ${x.tag}) return this.variant.value;
          throw new Error("Incorrect cast");
        }
              `,
          )
          .join("\n")}
    `;
  }

  generateDeserialize(reader: string): string {
    return `
      let tag = ${reader}.peekType();
      let variant: ${this.name}Variant;

      switch(tag) {
        ${this.variants
          .map((x) => {
            let out = "";
            if (Array.isArray(x.peek_type)) {
              for (let t of x.peek_type) {
                out += `case "${t}":\n`;
              }
            } else {
              out += `case "${x.peek_type}":\n`;
            }
            return (
              out +
              `
              variant = {
                kind: ${this.name}Kind.${x.kind_name ?? x.type},
                value: ${this.typeUtils.readType(reader, x.type)}
              };
              break;
              `
            );
          })
          .join("\n")}
        default:
          throw new Error("Unexpected subtype for ${this.name}: " + tag);
      }

      return new ${this.name}(variant);
    `;
  }

  generateSerialize(writer: string): string {
    return `
      switch(this.variant.kind) {
        ${this.variants
          .map(
            (x) =>
              `case ${x.tag}:
                  ${this.typeUtils.writeType(writer, "this.variant.value", x.type)};
                  break;
              `,
          )
          .join("\n")} 
      }
     `;
  }
}
