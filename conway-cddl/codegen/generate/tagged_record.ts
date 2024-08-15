import { CodeGeneratorBase } from ".";
import { SchemaTable } from "../compiler";
import { GenRecordFragment } from "./record_fragment";
import { GenRecordFragmentWrapper } from "./record_fragment_wrapper";
import { genCSL } from "./utils/csl";

export type Variant = {
  tag: number;
  name: string;
  value?: string;
  kind_name?: string;
};

export class GenTaggedRecord extends CodeGeneratorBase {
  variants: Variant[];

  constructor(name: string, variants: Variant[], customTypes: SchemaTable) {
    super(name, customTypes);
    this.variants = variants;
  }

  getVariantLen(variant: Variant) {
    if (variant.value == null) return 0;

    let custom = this.typeUtils.customTypes[variant.value];
    if (custom instanceof GenRecordFragment) {
      return custom.fields.length;
    } else if (custom instanceof GenRecordFragmentWrapper) {
      let inner = this.typeUtils.customTypes[custom.item.type];
      if (!(inner instanceof GenRecordFragment))
        throw new Error("Expected GenRecordFragment");
      return inner.fields.length;
    } else {
      return 1;
    }
  }

  deserializeVariant(
    variant: Variant,
    reader: string,
    arrayLen: string,
    assignToVar: string,
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
            ? `value: ${this.typeUtils.readType(reader, variant.value)},`
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

  generate(): string {
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

      export class ${this.name} {
        private variant: ${this.name}Variant;

        ${genCSL(this.name)}

        constructor(variant: ${this.name}Variant) {
          this.variant = variant;
        }

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
        as_${x.name}(): ${this.typeUtils.jsType(x.value)} | undefined {
          if(this.variant.kind == ${x.tag}) return this.variant.value;
        }
              `
              : "",
          )
          .join("\n")}
        
        static deserialize(reader: CBORReader): ${this.name} {
          let len = reader.readArrayTag();
          let tag = Number(reader.readUint());
          let variant: ${this.name}Variant;

          switch(tag) {
            ${this.variants
              .map(
                (x) => `
                case ${x.tag}:
                  ${this.deserializeVariant(x, "reader", "len", "variant")}
                  break;
                `,
              )
              .join("\n")}
          }

          if(len == null) {
            reader.readBreak();
          }
          
          throw new Error("Unexpected tag for ${this.name}: " + tag);
        }

        serialize(writer: CBORWriter): void {
          switch(this.variant.kind) {
            ${this.variants
              .map(
                (x) =>
                  `case ${x.tag}:
                      ${this.serializeVariant(x, "writer", "this.variant.value")};
                      break;`,
              )
              .join("\n")} 
          }
        }
      }`;
  }
}
