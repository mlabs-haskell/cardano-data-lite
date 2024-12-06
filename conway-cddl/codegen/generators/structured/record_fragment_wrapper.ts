import { GenStructuredBase, GenStructuredBaseOptions } from ".";
import { SchemaTable } from "../..";

export type Item = {
  name: string;
  type: string;
};

export type GenRecordFragmentWrapperOptions = {
  item: Item;
} & Omit<GenStructuredBaseOptions<Item>, "fields">;

export class GenRecordFragmentWrapper extends GenStructuredBase<Item> {
  constructor(
    name: string,
    customTypes: SchemaTable,
    options: GenRecordFragmentWrapperOptions,
  ) {
    super(name, customTypes, {
      genCSL: true,
      fields: [options.item],
      ...options,
    });
  }

  getItem(): Item {
    return this.getFields()[0];
  }

  generateDeserialize(reader: string, path: string): string {
    return `
      let ${this.getItem().name} = ${this.getItem().type}.deserialize(${reader}, [...${path}, '${this.getItem().type}']);
      return new ${this.name}(${this.getItem().name}) 
    `;
  }

  generateSerialize(writer: string): string {
    return ` 
      this._${this.getItem().name}.serialize(${writer});
    `;
  }
}
