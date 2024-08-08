import { CBORTypeName } from "../../../src/cbor/reader";
import { PrimitiveShort } from "../compiler/types";

export type SymbolTable = { [key: string]: CompilerSymbol };

export interface CompilerSymbol {
  typeName(): string;
  fromCBOR(varName: string): string;
  toCBOR(varname: string): string;
}

export interface SymbolDefinition {
  typeName(): string;
  generate(symbols: SymbolTable): string;
}

export class ClassSymbol implements CompilerSymbol {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  typeName(): string {
    return this.name;
  }

  fromCBOR(varName: string): string {
    return `${this.name}.fromCBOR(${varName})`;
  }

  toCBOR(varName: string): string {
    return `${varName}`;
  }
}

export class PrimitiveSymbol implements CompilerSymbol {
  jsType: string;
  cborType: CBORTypeName;

  constructor({
    jsType,
    cborType,
  }: {
    jsType: string;
    cborType: CBORTypeName;
  }) {
    this.jsType = jsType;
    this.cborType = cborType;
  }

  typeName(): string {
    return this.jsType;
  }

  fromCBOR(varName: string): string {
    return `${varName}.get("${this.cborType}")`;
  }

  toCBOR(varName: string): string {
    return `${varName}`;
  }
}

export const Primitives: { [key in PrimitiveShort]: PrimitiveSymbol } = {
  string: new PrimitiveSymbol({ jsType: "string", cborType: "tstr" }),
  int: new PrimitiveSymbol({ jsType: "number", cborType: "uint" }),
  bool: new PrimitiveSymbol({ jsType: "boolean", cborType: "boolean" }),
  bytes: new PrimitiveSymbol({ jsType: "Uint8Array", cborType: "bstr" }),
  uint: new PrimitiveSymbol({ jsType: "number", cborType: "uint" }),
  nint: new PrimitiveSymbol({ jsType: "number", cborType: "nint" }),
  float: new PrimitiveSymbol({ jsType: "number", cborType: "float" }),
};
