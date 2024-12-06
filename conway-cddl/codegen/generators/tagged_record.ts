import { CodeGeneratorBase, CodeGeneratorBaseOptions } from ".";
import { SchemaTable } from "..";
import { GenRecordFragment } from "./structured/record_fragment";
import { GenRecordFragmentWrapper } from "./structured/record_fragment_wrapper";

export type Variant = {
  tag: number;
  name: string;
  value?: string;
  kind_name?: string;
};

export type GenTaggedRecordOptions = {
  variants: Variant[];
  accessor_prefix?: string;
} & CodeGeneratorBaseOptions;

export class GenTaggedRecord extends CodeGeneratorBase {
  variants: Variant[];
  accessorPrefix?: string;

  constructor(
    name: string,
    customTypes: SchemaTable,
    options: GenTaggedRecordOptions,
  ) {
    super(name, customTypes, { genCSL: true, ...options });
    this.variants = options.variants;
    this.accessorPrefix = options.accessor_prefix;
  }

  getVariantLen(variant: Variant) {
    if (variant.value == null) return 0;

    let custom = this.typeUtils.customTypes[variant.value];
    let inner: GenRecordFragment;
    if (custom instanceof GenRecordFragment) {
      inner = custom;
    } else if (custom instanceof GenRecordFragmentWrapper) {
      let inner_ = this.typeUtils.customTypes[custom.getItem().type];
      if (!(inner_ instanceof GenRecordFragment))
        throw new Error("Expected GenRecordFragment");
      inner = inner_;
    } else {
      return 1;
    }

    if (inner.fragmentEncodeLen != null) return inner.fragmentEncodeLen;
    return inner.getFields().length;
  }

  deserializeVariant(
    variant: Variant,
    reader: string,
    arrayLen: string,
    assignToVar: string,
    path: string
  ) {
    let variantLen = this.getVariantLen(variant);
    return `
      if(${arrayLen} != null && (${arrayLen}-1) != ${variantLen}) {
        throw new Error("Expected ${variantLen} items to decode ${variant.kind_name ?? variant.value}");
      }
      ${assignToVar} = {
        kind: ${variant.tag},
        ${
          variant.value != null
            ? `value: ${this.typeUtils.readType(reader, variant.value, `[...${path}, '${variant.value}']`)},`
            : ""
        }
      };
    `;
  }

  serializeVariant(variant: Variant, writer: string, value: string) {
    let variantLen = this.getVariantLen(variant);
    return `
      ${writer}.writeArrayTag(${variantLen + 1});
      ${writer}.writeInt(BigInt(${variant.tag}));
      ${variant.value != null ? this.typeUtils.writeType(writer, value, variant.value) : ""};
    `;
  }

  generatePre(): string {
    return `
      export enum ${this.name}Kind {
        ${this.variants.map((x) => `${x.kind_name ?? x.value} = ${x.tag},`).join("\n")}
      }

      export type ${this.name}Variant = 
        ${this.variants
          .map((x) =>
            x.value != null
              ? `{ kind: ${x.tag}, value: ${this.typeUtils.jsType(x.value)} }`
              : `{ kind: ${x.tag} }`,
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
          .map((x) =>
            x.value != null
              ? `
        static new_${x.name}(${x.name}: ${this.typeUtils.jsType(x.value)}): ${this.name} {
          return new ${this.name}({kind: ${x.tag}, value: ${x.name}});
        }
              `
              : `
        static new_${x.name}(): ${this.name} {
          return new ${this.name}({kind: ${x.tag}});
        }
              `,
          )
          .join("\n")}

        ${this.variants
          .map((x) =>
            x.value != null
              ? `
        ${this.accessorPrefix || "as"}_${x.name}(): ${this.typeUtils.jsType(x.value)} | undefined {
          if(this.variant.kind == ${x.tag}) return this.variant.value;
        }
              `
              : "",
          )
          .join("\n")}

        kind(): ${this.name}Kind {
          return this.variant.kind;
        }
    `;
  }

  generateDeserialize(reader: string, path: string): string {
    return `
      let len = ${reader}.readArrayTag(${path});
      let tag = Number(${reader}.readUint(${path}));
      let variant: ${this.name}Variant;

      switch(tag) {
        ${this.variants
          .map(
            (x) => `
            case ${x.tag}:
              ${this.deserializeVariant(x, reader, "len", "variant", path)}
              break;
            `,
          )
          .join("\n")}
      }

      if(len == null) {
        ${reader}.readBreak();
      }
      
      throw new Error("Unexpected tag for ${this.name}: " + tag + "(at " + ${path}.join("/") + ")");
    `;
  }

  generateSerialize(writer: string): string {
    return `
      switch(this.variant.kind) {
        ${this.variants
          .map(
            (x) =>
              `case ${x.tag}:
                  ${this.serializeVariant(x, writer, "this.variant.value")};
                  break;`,
          )
          .join("\n")} 
      }
     `;
  }
}
