export type Variant = {
  tag: number;
  name: string;
  type: string;
};

export class GenEnum {
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

      export class ${this.name} {
        private kind_: ${this.name}Kind;

        constructor(kind: ${this.name}Kind) {
          this.kind_ = kind;
        }

        ${this.variants
          .map(
            (x) => `
        static new_${x.name}(): ${this.name} {
          return new ${this.name}(${x.tag});
        }`,
          )
          .join("\n")}
        
        static fromCBOR(value: CBORReaderValue): ${this.name} {
          return value.with(value => {
            let kind = Number(value.getInt());
            ${this.variants
              .map(
                (x) => `
              if(kind == ${x.tag}) return new ${this.name}(${x.tag})
            `,
              )
              .join("\n")}
            throw "Unrecognized enum value: " + kind + " for " + ${this.name};
          });
        }

        toCBOR(writer: CBORWriter) {
          writer.write(this.kind_);
        }
      }`;
  }
}
