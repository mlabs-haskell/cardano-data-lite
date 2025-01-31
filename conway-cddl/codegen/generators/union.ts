import { CodeGeneratorBase, CodeGeneratorBaseOptions } from ".";
import { SchemaTable } from "..";

export type Variant = {
  tag: number; // number assigned to the variant in the FooKind enum
  peek_type: string | string[]; // decode this variant if the CBOR type tag equals any of these values
  valid_tags?: number[];
  name: string; // used in Class.new_foo()
  type: string; // used to do if (reader.getTag() == tag) type.deserialize()
  kind_name?: string; // name of the variant in the FooKind enum
};

export type GenUnionOptions = {
  variants: Variant[];
} & CodeGeneratorBaseOptions;

// We say tagged to refer to variants that are encoded with a CBOR tag
type TaggedVariant = {
  tag: number; // number assigned to the variant in the FooKind enum
  valid_tags: number[];
  name: string; // used in Class.new_foo()
  type: string; // used to do if (reader.getTag() == tag) type.deserialize()
  kind_name?: string; // name of the variant in the FooKind enum
}

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

        kind(): ${this.name}Kind {
          return this.variant.kind;
        }
    `;
  }

  generateDeserialize(reader: string, path: string): string {
    const constructUntagged = (v: Variant) => {
      let out = "";
      if (Array.isArray(v.peek_type)) {
        for (let t of v.peek_type) {
          out += `case "${t}":\n`;
        }
      } else {
        out += `case "${v.peek_type}":\n`;
      }
      return out +
        `
        variant = {
          kind: ${this.name}Kind.${v.kind_name ?? v.type},
          value: ${this.typeUtils.readType(reader, v.type, `[...${path}, '${v.type}(${v.name})']`)}
        };
        break;
        `
    }

    const constructTagged = (v: TaggedVariant) => {
      if(v.valid_tags.length == 0) {
        throw new Error("Expected a non-empty 'valid_tags' field because multiple tagged variants exist. These are needed to disambiguate.")
      } else {
        return `if ([${v.valid_tags.toString()}].includes(tagNumber)) {
                    variant = {
                      kind: ${this.name}Kind.${v.kind_name ?? v.type},
                      value: ${this.typeUtils.readType(reader, v.type, `[...${path}, '${v.type}(${v.name})']`)}
                    };
                    break;
                }`
      }
    }

    // split variants into tagged and untagged types
    let [taggedVariants, untaggedVariants] = this.variants.reduce((acc, v) => {
      let [tagged, untagged] = acc;
      if (typeof v.peek_type == "string") {
        if (v.peek_type == "tagged") {
          let tagged_v: TaggedVariant = {
            tag: v.tag,
            valid_tags: v.valid_tags ? v.valid_tags : [],
            name: v.name,
            type: v.type,
            kind_name: v.kind_name
          }
          tagged.push(tagged_v);
        } else {
          untagged.push(v);
        }
      } else if (v.peek_type.includes("tagged")) {
          let untagged_v: Variant = structuredClone(v)
          untagged_v.peek_type = v.peek_type.filter((t) => t != "tagged");

          let tagged_v: TaggedVariant = {
            tag: v.tag,
            valid_tags: v.valid_tags ? v.valid_tags : [],
            name: v.name,
            type: v.type,
            kind_name: v.kind_name
          }

          untagged.push(untagged_v);
          tagged.push(tagged_v);
      } else {
          untagged.push(v);
      }

      return [tagged, untagged]
    }, [[], []] as [TaggedVariant[], Variant[]]);

    return `
      let tag = ${reader}.peekType(${path});
      let variant: ${this.name}Variant;

      switch(tag) {
        ${untaggedVariants
          .map(constructUntagged)
          .join("\n")}
        ${taggedVariants.length > 0
            ? (taggedVariants.length == 1
                ? `case "tagged":
                      variant = {
                        kind: ${this.name}Kind.${taggedVariants[0].kind_name ?? taggedVariants[0].type},
                        value: ${this.typeUtils.readType(reader, taggedVariants[0].type, `[...${path}, '${taggedVariants[0].type}(${taggedVariants[0].name})']`)}
                      };
                      break;
                  `
                : `case "tagged":
                      const tagNumber = ${reader}.peekTagNumber(${path});
                      ${constructTagged(taggedVariants[0])}      
                      ${taggedVariants.slice(1).map((v) => "else " + constructTagged(v)).join("\n")}
                      else {
                        throw new Error("Unexpected tag number " + tagNumber + " (at " + ${path}.join("/") + ")")
                      }
                  `)
            : ''
          }
        default:
          throw new Error("Unexpected subtype for ${this.name}: " + tag + "(at " + ${path}.join("/") + ")");
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
