import { CodeGenerator } from ".";
import { SchemaTable } from "../compiler";
import { jsType, readType, writeType } from "./utils/cbor-utils";
import { genCSL } from "./utils/csl";

export type Variant = {
  tag: number;
  name: string;
  value?: string;
  kind_name?: string;
};

export class GenTaggedRecord implements CodeGenerator {
  name: string;
  variants: Variant[];

  constructor(name: string, variants: Variant[]) {
    this.name = name;
    this.variants = variants;
  }

  getVariantLen(customTypes: SchemaTable, variant: Variant) {
    if (variant.value == null) return 0;

    let custom = customTypes[variant.value];
    if (custom?.type == "record_fragment") {
      return custom.fields.length;
    } else if (custom?.type == "record_fragment_wrapper") {
      let inner = customTypes[custom.item.type];
      if (inner.type != "record_fragment")
        throw new Error("Expected record_fragment");
      return inner.fields.length;
    } else {
      return 1;
    }
  }

  deserializeVariant(
    customTypes: SchemaTable,
    variant: Variant,
    reader: string,
    arrayLen: string,
    assignToVar: string,
  ) {
    let variantLen = this.getVariantLen(customTypes, variant);
    return `
      if(${arrayLen} != null && (${arrayLen}-1) != ${variantLen}) {
        throw new Error("Expected ${variantLen} items to decode ${variant.kind_name ?? variant.value}");
      }
      ${assignToVar} = {
        kind: ${variant.tag},
        ${
          variant.value != null
            ? `value: ${readType(customTypes, reader, variant.value)},`
            : ""
        }
      };
    `;
  }

  serializeVariant(
    customTypes: SchemaTable,
    variant: Variant,
    writer: string,
    value: string,
  ) {
    let variantLen = this.getVariantLen(customTypes, variant);
    return `
      ${writer}.writeArrayTag(${variantLen + 1});
      ${writer}.writeInt(BigInt(${variant.tag}));
      ${variant.value != null ? writeType(customTypes, writer, value, variant.value) : ""};
    `;
  }

  generate(customTypes: SchemaTable): string {
    return `
      export enum ${this.name}Kind {
        ${this.variants.map((x) => `${x.kind_name ?? x.value} = ${x.tag},`).join("\n")}
      }

      export type ${this.name}Variant = 
        ${this.variants
          .map((x) =>
            x.value != null
              ? `{ kind: ${x.tag}, value: ${jsType(x.value, customTypes)} }`
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
        static new_${x.name}(${x.name}: ${jsType(x.value, customTypes)}): ${this.name} {
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
        as_${x.name}(): ${jsType(x.value, customTypes)} | undefined {
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
                  ${this.deserializeVariant(
                    customTypes,
                    x,
                    "reader",
                    "len",
                    "variant",
                  )}
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
                      ${this.serializeVariant(
                        customTypes,
                        x,
                        "writer",
                        "this.variant.value",
                      )};
                      break;`,
              )
              .join("\n")} 
          }
        }
      }`;
  }
}
