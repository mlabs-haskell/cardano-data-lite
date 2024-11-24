import { GenStructuredBase, GenStructuredBaseOptions } from ".";
import { SchemaTable } from "../..";

export type Field = {
  name: string;
  type: string;
  nullable?: boolean;
  optional?: boolean;
};

export type GenRecordOptions = {
  fields: Field[];
} & GenStructuredBaseOptions<Field>;

         // x.optional ? `${reader}.readOptional(r => ${this.typeUtils.readType("r", x.type, `${x.name}_path`)})` :
         // x.nullable ? `${reader}.readNullable(r => ${this.typeUtils.readType("r", x.type, `${x.name}_path`)}, ${path})?? undefined` :
         // this.typeUtils.readType(reader, x.type, `${x.name}_path`)

export class GenRecord extends GenStructuredBase<Field> {
  constructor(
    name: string,
    customTypes: SchemaTable,
    options: GenRecordOptions,
  ) {
    super(name, customTypes, { genCSL: true, ...options });
  }

  generateDeserialize(reader: string, path: string): string {
    return `
      let len = ${reader}.readArrayTag(${path});
      
      if(len != null && len < ${this.getMinFields()}) {
        throw new Error("Insufficient number of fields in record. Expected at least ${this.getMinFields()}. Received " + len + "(at " + path.join("/"));
      }

      ${this.getFields().reduce((acc, x, idx) => {
         acc.push(`
           const ${x.name}_path = [...${path}, '${x.type}(${x.name})'];
           let ${x.name} = ${
             x.optional ?
               `len != null && len > ${idx} ? ${this.typeUtils.readType(reader, x.type, `${x.name}_path`)} : undefined` :
             x.nullable ?
               `${reader}.readNullable(r => ${this.typeUtils.readType("r", x.type, `${x.name}_path`)}, ${path})?? undefined` :
             this.typeUtils.readType(reader, x.type, `${x.name}_path`)
           }
         `);
         return acc;
      }, [] as string[]).join("\n")}

      return new ${this.name}(${this.getFields()
        .map((x) => x.name)
        .join(", ")}) 
     `;
  }

  generateSerialize(writer: string): string {
    return `
      let arrayLen = ${this.getMinFields()};
      ${this.getFields().
        map((x) => x.optional
          ? `if(this._${x.name}) {
              arrayLen++;            
          }` :
          "")
          .join("\n")}

      ${writer}.writeArrayTag(arrayLen);

      ${this.getFields()
        .map((x) =>
          x.optional
            ? `if(this._${x.name}) {
                 ${this.typeUtils.writeType(writer, `this._${x.name}`, x.type)};   
              }` :
          x.nullable
            ? `if(this._${x.name} == null) { 
                  ${writer}.writeNull();
              } else { 
                  ${this.typeUtils.writeType(writer, `this._${x.name}`, x.type)};
              }` :
          `${this.typeUtils.writeType(writer, `this._${x.name}`, x.type)};`,
        )
        .join("\n")}
    `;
  }
}
