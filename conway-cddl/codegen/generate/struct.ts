import { CodeGenerator } from ".";
import { readType, writeType } from "./utils/cbor-utils";
import { genCSL } from "./utils/csl";
import { genAccessors, genConstructor, genMembers } from "./utils/structured";

export type Field = {
  id: number;
  name: string;
  type: string;
  optional?: boolean;
};

export class GenStruct implements CodeGenerator {
  name: string;
  fields: Field[];

  constructor(name: string, fields: Field[]) {
    this.name = name;
    this.fields = fields;
  }

  generate(customTypes: Set<string>): string {
    return `
      export class ${this.name} {
        ${genMembers(this.fields, customTypes)}
        ${genConstructor(this.fields, customTypes)}
        ${genAccessors(this.fields, customTypes)}
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
                      fields.${x.name} = ${readType(customTypes, "r", x.type)}; 
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
              ${writeType(customTypes, "writer", `this.${x.name}`, x.type)};
            `;
              return `${x.optional ? `if(this.${x.name} !== undefined) { ${write} }` : write}`;
            })
            .join("\n")}
      }
    }`;
  }
}
