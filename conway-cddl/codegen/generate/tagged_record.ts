import { CodeGenerator } from ".";
import { jsType, readType, writeType } from "./utils/cbor-utils";
import { genCSL } from "./utils/csl";

export type Variant = {
  tag: number;
  name: string;
  value: string;
};

export class GenTaggedRecord implements CodeGenerator {
  name: string;
  variants: Variant[];

  constructor(name: string, variants: Variant[]) {
    this.name = name;
    this.variants = variants;
  }

  generate(customTypes: Set<string>): string {
    return `
      export enum ${this.name}Kind {
        ${this.variants.map((x) => `${x.name} = ${x.tag},`).join("\n")}
      }

      export type ${this.name}Variant = ${this.variants.map((x) => `{ kind: ${x.tag}, value: ${jsType(x.value, customTypes)} }`).join(" | ")};

      export class ${this.name} {
        private variant: ${this.name}Variant;

        ${genCSL(this.name)}

        constructor(variant: ${this.name}Variant) {
          this.variant = variant;
        }

        ${this.variants
          .map(
            (x) => `
        static new_${x.name}(${x.name}: ${jsType(x.value, customTypes)}): ${this.name} {
          return new ${this.name}({kind: ${x.tag}, value: ${x.name}});
        }`,
          )
          .join("\n")}

        ${this.variants
          .map(
            (x) => `
        as_${x.name}(): ${jsType(x.value, customTypes)} | undefined {
          if(this.variant.kind == ${x.tag}) return this.variant.value;
        }`,
          )
          .join("\n")}
        
        static deserialize(reader: CBORReader): ${this.name} {
          let len = value.readArrayTag();
          let tag = Number(value.readUint());

          let fragmentLen = len != null ? len - 1 : null;
          
          switch(tag) {
            ${this.variants
              .map(
                (x) => `
                  case ${x.tag}:
                    ${
                      customTypes.has(x.value)
                        ? `
                    if(${x.value}.FRAGMENT_FIELDS_LEN != null) {
                      return new ${this.name}({kind: ${x.tag}, value: ${x.value}.deserialize(reader, fragmentLen)});
                    } else {
                      if(fragmentLen == 0) throw new Error("Expected more values for variant ${x.name}");
                      return new ${this.name}({kind: ${x.tag}, value: ${x.value}.deserialize(reader)});
                    }`
                        : `
                      return new ${this.name}({kind: ${x.tag}, value: ${readType(customTypes, "reader", x.value)}}); 
                    `
                    }
            `,
              )
              .join("\n")}
          }
          
          throw new Error("Unexpected tag for ${this.name}: " + tag);
        }

        serialize(writer: CBORWriter): void {
          switch(this.variant.kind) {
            ${this.variants
              .map((x) =>
                customTypes.has(x.value)
                  ? `case ${x.tag}: 
                        let fragmentLen = ${x.value}.FRAGMENT_FIELDS_LEN;
                        if(fragmentLen != null) {
                          writer.writeArrayTag(fragmentLen + 1);
                          writer.writeInt(${x.tag}n);
                          this.variant.value.serialize(writer);
                        } else {
                          writer.writeArrayTag(2);
                          writer.writeInt(${x.tag}n);
                          this.variant.value.serialize(writer);
                        }
                        break;
                    `
                  : `case ${x.tag}: 
                          writer.writeArrayTag(2);
                          writer.writeInt(${x.tag}n);
                          ${writeType(customTypes, "writer", "this.variant.value", x.value)}
                    `,
              )
              .join("\n")} 
          }
        }
      }`;
  }
}
