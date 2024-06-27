import { genConstructor, genMembers } from "./custom";

export type Field = {
  name: string;
  type: GenLeaf;
  optional?: boolean;
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
        
        static fromCBOR(value: CBORValue): ${this.name} {
          let array = value.get("array");
          ${this.name}.fromArray(array);
        }

        static fromArray(array: CBORArrayReader<CBORReaderValue>): ${this.name} {
          ${this.fields
            .map((x) => {
              let out: string[] = [];
              out.push(
                `let ${x.name}_ = array.${x.optional ? "shift" : "shiftRequired"}();`,
              );
              out.push(`let ${x.name} = ` + x.type.fromCBOR(x.name + "_"));
              return out.join("\n");
            })
            .join("\n")}

          return new ${this.name}(${this.fields.map((x) => x.name).join(", ")}) 
        }

        toCBOR(writer: CBORWriter) {
          let entries = [];
          ${this.fields
            .map((x) =>
              x.optional
                ? `if(this.${x.name} !== undefined) entries.push(this.${x.name});`
                : `entries.push(this.${x.name});`,
            )
            .join("\n")}
          writer.writeArray(entries);
        }
      }`;
  }
}
