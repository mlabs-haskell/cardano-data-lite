import { GenLeaf } from ".";

type Field = {
  name: string;
  type: GenLeaf;
  optional?: boolean;
  nullable?: boolean;
};

export function genMembers(fields: Field[]) {
  return fields
    .map(
      (x) =>
        `private ${x.name}: ${x.type.name()}${x.optional || x.nullable ? " | undefined" : ""};`,
    )
    .join("\n");
}

export function genConstructor(fields: Field[]) {
  return `
  constructor(${fields.map((x) => `${x.name}: ${x.type.name()} ${x.optional || x.nullable ? "| undefined" : ""}`).join(",")}) {
    ${fields.map((x) => `this.${x.name} = ${x.name};`).join("\n")}
  }`;
}

export function genAccessors(fields: Field[]) {
  return fields
    .map(
      (x) => `
        get_${x.name}(): ${x.type.name()} ${x.optional || x.nullable ? "| undefined" : ""} {
          return this.${x.name};
        }

        set_${x.name}(${x.name}: ${x.type.name()}): void {
          this.${x.name} = ${x.name};
        }
        `,
    )
    .join("\n");
}

export function genCSL(className: string) {
  return `  
    // no-op
    free(): void {}

    static from_bytes(data: Uint8Array): ${className} {
      let reader = new CBORReader(data);
      return ${className}.deserialize(reader);
    }

    static from_hex(hex_str: string): ${className} {
      return ${className}.from_bytes(hexToBytes(hex_str));
    }

    
    to_bytes(): Uint8Array {
      let writer = new CBORWriter();
      this.serialize(writer);
      return writer.getBytes();
    }

    to_hex(): string {
      return bytesToHex(this.to_bytes());
    }
  `;
}
