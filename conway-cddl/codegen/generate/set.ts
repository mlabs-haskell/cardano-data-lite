export class GenSet implements GenRoot {
  name: string;
  item: GenLeaf;

  constructor(name: string, item: GenLeaf) {
    this.name = name;
    this.item = item;
  }

  generate(): string {
    return `
    export class ${this.name} extends Array<${this.item.name()}> {
      static fromCBOR(value: CBORReaderValue): ${this.name} {
        let tagged = value.get("tagged");
        let array = tagged.getTagged(258n).get("array");
        return new ${this.name}(...array.map((x) => ${this.item.fromCBOR("x")}));  
      }

      toCBOR(writer: CBORWriter) {
        return writer.writeTagged(258n, [...this]);
      }
    }
    `;
  }
}
