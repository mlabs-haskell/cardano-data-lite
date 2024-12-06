import { GenStructuredBase, GenStructuredBaseOptions } from ".";
import { SchemaTable } from "../..";

export type Field = {
  id: number;
  name: string;
  type: string;
  optional?: boolean;
};

export type GenStructOptions = {
  fields: Field[];
} & GenStructuredBaseOptions<Field>;

export class GenStruct extends GenStructuredBase<Field> {
  constructor(
    name: string,
    customTypes: SchemaTable,
    options: GenStructOptions,
  ) {
    super(name, customTypes, { genCSL: true, ...options });
  }

  generateDeserialize(_reader: string, path: string): string {
    return `
      let fields: any = {};
      reader.readMap(r => {
        let key = Number(r.readUint(${path})); 
        switch(key) {
          ${this.getFields()
            .map(
              (x) => `
              case ${x.id}: {
                  const new_path = [...${path}, '${x.type}(${x.name})']
                  fields.${x.name} = ${this.typeUtils.readType("r", x.type, "new_path")}; 
                  break;
              }
            `,
            )
            .join("\n")}
        }
      }, ${path});

        ${this.getFields()
          .flatMap((x) => [
            !x.optional
              ? `if(fields.${x.name} === undefined) throw new Error("Value not provided for field ${x.id} (${x.name}) (at " + ${path}.join("/") + ")");`
              : "",
            `let ${x.name} = fields.${x.name};`,
          ])
          .join("\n")}
      

      return new ${this.name}(
        ${this.getFields()
          .map((x) => `${x.name}`)
          .join(", ")}
      );
    `;
  }

  generateSerialize(writer: string): string {
    return `
      let len = ${this.getFields().length};
      ${this.getFields()
        .map((x) =>
          x.optional ? `if(this._${x.name} === undefined) len -= 1;` : ``,
        )
        .filter((x) => x != "")
        .join("\n")}
      ${writer}.writeMapTag(len);
      ${this.getFields()
        .map((x) => {
          let write = `
            ${writer}.writeInt(${x.id}n);
            ${this.typeUtils.writeType(writer, `this._${x.name}`, x.type)};
          `;
          return `${x.optional ? `if(this._${x.name} !== undefined) { ${write} }` : write}`;
        })
        .join("\n")}
     `;
  }
}
