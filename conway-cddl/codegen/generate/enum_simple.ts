import { CodeGenerator } from ".";

export type Variant = {
  name: string;
  value: number;
};

export class GenEnumSimple implements CodeGenerator {
  name: string;
  variants: Variant[];

  constructor(name: string, variants: Variant[]) {
    this.name = name;
    this.variants = variants;
  }

  generate(): string {
    return `
      export enum ${this.name} {
        ${this.variants.map((x) => `${x.name} = ${x.value},`).join("\n")}
      }
    `;
  }
}
