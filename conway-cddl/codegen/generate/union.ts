export type Variant = {
  tag: number;
  name: string;
  type: string;
  type_discriminator: string;
};

export class GenUnion {
  name: string;
  variants: Variant[];

  constructor(name: string, variants: Variant[]) {
    this.name = name;
    this.variants = variants;
  }

  generate(): string {
    return `
      export enum ${this.name}Kind {
        ${this.variants.map((x) => `${x.type} = ${x.tag},`).join("\n")}
      }

      export type ${this.name}Variant = ${this.variants.map((x) => `{ kind: ${x.tag}, value: ${x.type} }`).join(" | ")};

      export class ${this.name} {
        private variant: ${this.name}Variant;

        constructor(variant: ${this.name}Variant) {
          this.variant = variant;
        }

        ${this.variants
          .map(
            (x) => `
        static new_${x.name}(${x.name}: ${x.type}): ${this.name} {
          return new ${this.name}({kind: ${x.tag}, value: ${x.name}});
        }`,
          )
          .join("\n")}

        ${this.variants
          .map(
            (x) => `
        as_${x.name}(): ${x.type} | undefined {
          if(this.variant.kind == ${x.tag}) return this.variant.value;
        }`,
          )
          .join("\n")}
        
        static fromCBOR(value: CBORReaderValue): ${this.name} {
          return value.getChoice({
            ${this.variants
              .map(
                (x) => `"${x.type_discriminator}": (v) => 
                          new ${this.name}({
                            kind: ${x.tag},
                            value: ${x.type}.fromCBOR(v)
                          }),`,
              )
              .join("\n")}
            
          });
        }

        toCBOR(writer: CBORWriter) {
          this.variant.value.toCBOR(writer);
        }
      }`;
  }
}
