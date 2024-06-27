export type Variant = {
  tag: number;
  name: string;
  type: string;
};

export class GenTaggedRecord {
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
        
        static fromCBOR(value: CBORValue): ${this.name} {
          let array = value.get("array");
          let [tag, variant] = array.shiftRequired().with(tag_ => {
            let tag = Number(tag_.get("uint"));
            ${this.variants
              .map(
                (x) => `
              if(tag == ${x.tag}) return [tag, ${x.type}.fromArray(array)}]
            `,
              )
              .join("\n")}
            throw "Unrecognized tag: " + tag + " for " + ${this.name};
          });
          
          return new ${this.name}({kind: tag, value: variant});
        }

        toCBOR(writer: CBORWriter) {
          let entries = [
            this.variant.kind,
            ...this.variant.value.toArray();
          ];
          writer.writeArray(entries);
        }
      }`;
  }
}
