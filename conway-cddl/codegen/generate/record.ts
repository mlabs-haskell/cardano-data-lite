import { GenLeaf } from ".";
import { genAccessors, genConstructor, genMembers } from "./custom";

export type Field = {
  name: string;
  type: GenLeaf;
  optional?: boolean;
  nullable?: boolean;
};

export class GenRecord {
  name: string;
  fields: Field[];

  constructor(name: string, fields: Field[]) {
    this.name = name;
    this.fields = fields;
  }

  generate(): string {
    return `
      export class ${this.name} {
        ${genMembers(this.fields)}
        ${genConstructor(this.fields)}
        ${genAccessors(this.fields)}

        static fromArray(array: CBORArrayReader<CBORReaderValue>): ${this.name} {
          ${this.fields
            .map((x) => {
              let out: string[] = [];
              out.push(
                `let ${x.name}_ = array.${x.optional ? "shift" : "shiftRequired"}();`,
              );
              if (x.nullable) {
                out.push(
                  `let ${x.name}__ = ${x.name}_.withNullable(x => ${x.type.fromCBOR("x")});`,
                  `let ${x.name} = ${x.name}__ == null ? undefined : ${x.name}__;`,
                );
              } else {
                out.push(`let ${x.name} = ${x.type.fromCBOR(x.name + "_")};`);
              }
              return out.join("\n");
            })
            .join("\n")}

          return new ${this.name}(${this.fields.map((x) => x.name).join(", ")}) 
        }

        toArray() {
          let entries = [];
          ${this.fields
            .map((x) =>
              x.optional
                ? `if(this.${x.name} !== undefined) entries.push(this.${x.name});`
                : `entries.push(this.${x.name});`,
            )
            .join("\n")}
          return entries;
        }
        
        static fromCBOR(value: CBORReaderValue): ${this.name} {
          let array = value.get("array");
          return ${this.name}.fromArray(array);
        }

        toCBOR(writer: CBORWriter) {
          writer.writeArray(this.toArray());
        }
      }`;
  }
}
