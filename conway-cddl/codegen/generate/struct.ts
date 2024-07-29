import { GenLeaf } from ".";
import { genAccessors, genConstructor, genMembers } from "./custom";

export type Field = {
  id: number;
  name: string;
  type: GenLeaf;
  optional?: boolean;
};

export class GenStruct {
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
        
        static fromCBOR(value: CBORReaderValue): ${this.name} {
          let map = value.get("map").toMap().map({key: x => Number(x.getInt()), value: x => x});
          ${this.fields
            .map((x) => {
              let out = [];
              out.push(
                `let ${x.name}_ = map.${x.optional ? "get" : "getRequired"}(${x.id});`,
              );
              out.push(
                `let ${x.name} = ${x.name}_ != undefined ? ${x.type.fromCBOR(x.name + "_")} : undefined;`,
              );
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
                ? `if(this.${x.name} !== undefined) entries.push([${x.id}, this.${x.name}]);`
                : `entries.push([${x.id}, this.${x.name}])`,
            )
            .join("\n")}
          writer.writeMap(entries);
        }
      }`;
  }
}