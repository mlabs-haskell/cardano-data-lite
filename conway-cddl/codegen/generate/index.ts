import { CBORTypeName } from "../../../src/cbor/reader";
import { Primitive, PrimitiveShort } from "../compiler/types";

export interface GenLeaf {
  name(): string;
  fromCBOR(varName: string): string;
  // toCBOR(varName: string): string | null;
  // toCBOR is probably not needed.
}

export interface GenRoot {
  name: string;
  generate(): string;
}

export class GenLeafRef implements GenLeaf {
  name_: string;

  constructor(name: string) {
    this.name_ = name;
  }

  name() {
    return this.name_;
  }

  fromCBOR(varName: string): string {
    return `${this.name_}.fromCBOR(${varName})`;
  }
}

class GenLeafPrimitive implements GenLeaf {
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

  name(): string {
    return this.jsType;
  }

  fromCBOR(varName: string): string {
    return `${varName}.get("${this.cborType}")`;
  }
}

export const Primitives: { [key in PrimitiveShort]: GenLeafPrimitive } = {
  string: new GenLeafPrimitive({ jsType: "string", cborType: "tstr" }),
  int: new GenLeafPrimitive({ jsType: "number", cborType: "uint" }),
  bool: new GenLeafPrimitive({ jsType: "boolean", cborType: "boolean" }),
  bytes: new GenLeafPrimitive({ jsType: "Uint8Array", cborType: "bstr" }),
  uint: new GenLeafPrimitive({ jsType: "number", cborType: "uint" }),
  nint: new GenLeafPrimitive({ jsType: "number", cborType: "nint" }),
  float: new GenLeafPrimitive({ jsType: "number", cborType: "float" }),
};
