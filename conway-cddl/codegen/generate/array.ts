import { SymbolTable, SymbolDefinition } from ".";

export class GenArray implements SymbolDefinition {
  name: string;
  item: string;

  constructor(name: string, item: string) {
    this.name = name;
    this.item = item;
  }

  generate(symbolTable: SymbolTable): string {
    let item = symbolTable[this.item];
    return `
    export class ${this.name} extends Array<${this.item}> {
      static fromCBOR(value: CBORReaderValue): ${this.name} {
        let array = value.get("array");
        return new ${this.name}(...array.map((x) => ${item.fromCBOR("x")}));  
      }
    }
    `;
  }
}
