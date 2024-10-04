import { CodeGeneratorBase } from ".";
import { SchemaTable } from "..";

export type GenCustomOptions = {
  body: string;
};

export class GenCustom extends CodeGeneratorBase {
  body: string;

  constructor(
    name: string,
    customTypes: SchemaTable,
    options: GenCustomOptions,
  ) {
    super(name, customTypes);
    this.body = options.body;
  }

  generate(): string {
    return `
      export class ${this.name} {
        ${this.body}
      }
    `;
  }
}
