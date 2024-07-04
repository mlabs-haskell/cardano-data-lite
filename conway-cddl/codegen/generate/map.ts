export class GenMap {
  name: string;
  key: GenLeaf;
  value: GenLeaf;

  constructor(name: string, key: GenLeaf, value: GenLeaf) {
    this.name = name;
    this.key = key;
    this.value = value;
  }

  generate(): string {
    return `
    export class ${this.name} extends CBORMap<${this.key.name()},${this.value.name()}> {
      static fromCBOR(value: CBORReaderValue): ${this.name} {
        let map = value.get("map");
        return new ${this.name}(map.map({
          key: (x) => ${this.key.fromCBOR("x")},
          value: (x) => ${this.key.fromCBOR("x")}
        })); 
      }
    }
    `;
  }
}
