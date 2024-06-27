export class GenArray implements GenRoot {
  name: string;
  item: GenLeaf;

  constructor(name: string, item: GenLeaf) {
    this.name = name;
    this.item = item;
  }

  generate(): string {
    return `
    export class ${this.name} extends Array<${this.item.name()}> {
      static fromCBOR(value: CBORValue): ${this.name} {
        let array = value.get("array");
        return new ${this.name}(array.map((x) => ${this.item.fromCBOR("x")})}));  
      }
    }
    `;
  }
}
