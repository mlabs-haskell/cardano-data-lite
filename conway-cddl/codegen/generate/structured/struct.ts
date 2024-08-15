import { GenStructuredBase, GenStructuredBaseOptions } from ".";
import { SchemaTable } from "../../compiler";

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

  generateDeserialize(_reader: string): string {
    return `
      let fields: any = {};
      reader.readMap(r => {
        let key = Number(r.readUint()); 
        switch(key) {
          ${this.getFields()
            .map(
              (x) => `
              case ${x.id}:   
                  fields.${x.name} = ${this.typeUtils.readType("r", x.type)}; 
                  break;
            `,
            )
            .join("\n")}
        }
      });

        ${this.getFields()
          .flatMap((x) => [
            !x.optional
              ? `if(fields.${x.name} === undefined) throw new Error("Value not provided for field ${x.id} (${x.name})");`
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
          x.optional ? `if(this.${x.name} === undefined) len -= 1;` : ``,
        )
        .filter((x) => x != "")
        .join("\n")}
      ${writer}.writeMapTag(len);
      ${this.getFields()
        .map((x) => {
          let write = `
            ${writer}.writeInt(${x.id}n);
            ${this.typeUtils.writeType(writer, `this.${x.name}`, x.type)};
          `;
          return `${x.optional ? `if(this.${x.name} !== undefined) { ${write} }` : write}`;
        })
        .join("\n")}
     `;
  }
}
