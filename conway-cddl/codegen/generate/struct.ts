import { CodeGeneratorBase } from ".";
import { SchemaTable } from "../compiler";
import { genCSL } from "./utils/csl";
import { genAccessors, genConstructor, genMembers } from "./utils/structured";

export type Field = {
  id: number;
  name: string;
  type: string;
  optional?: boolean;
};

export class GenStruct extends CodeGeneratorBase {
  fields: Field[];

  constructor(name: string, fields: Field[], customTypes: SchemaTable) {
    super(name, customTypes);
    this.fields = fields;
  }

  generate(): string {
    return `
      export class ${this.name} {
        ${genMembers(this.fields, this.typeUtils)}
        ${genConstructor(this.fields, this.typeUtils)}
        ${genAccessors(this.fields, this.typeUtils)}
        ${genCSL(this.name)}
        
        static deserialize(reader: CBORReader): ${this.name} {
          let fields: any = {};
          reader.readMap(r => {
            let key = Number(r.readUint()); 
            switch(key) {
              ${this.fields
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

            ${this.fields
              .flatMap((x) => [
                !x.optional
                  ? `if(fields.${x.name} === undefined) throw new Error("Value not provided for field ${x.id} (${x.name})");`
                  : "",
                `let ${x.name} = fields.${x.name};`,
              ])
              .join("\n")}
          

          return new ${this.name}(
            ${this.fields.map((x) => `${x.name}`).join(", ")}
          );
        }

        serialize(writer: CBORWriter) {
          let len = ${this.fields.length};
          ${this.fields
            .map((x) =>
              x.optional ? `if(this.${x.name} === undefined) len -= 1;` : ``,
            )
            .filter((x) => x != "")
            .join("\n")}
          writer.writeMapTag(len);
          ${this.fields
            .map((x) => {
              let write = `
              writer.writeInt(${x.id}n);
              ${this.typeUtils.writeType("writer", `this.${x.name}`, x.type)};
            `;
              return `${x.optional ? `if(this.${x.name} !== undefined) { ${write} }` : write}`;
            })
            .join("\n")}
      }
    }`;
  }
}
