import { CodeGeneratorBase } from "../generate/index";
import { Schema } from "./types";
import { GenArray } from "../generate/array";
import { GenSet } from "../generate/set";
import { GenRecord } from "../generate/structured/record";
import { GenStruct } from "../generate/structured/struct";
import { GenTaggedRecord } from "../generate/tagged_record";
import { GenMap } from "../generate/map";
import { GenEnum } from "../generate/enum";
import { GenEnumSimple } from "../generate/enum_simple";
import { GenNewtype } from "../generate/newtype";
import { GenRecordFragment } from "../generate/structured/record_fragment";
import { GenRecordFragmentWrapper } from "../generate/structured/record_fragment_wrapper";
import { Value } from "@sinclair/typebox/value";

export type SchemaTable = { [key: string]: CodeGeneratorBase };

export class Compiler {
  customTypes: SchemaTable;
  codegen: CodeGeneratorBase[];

  constructor() {
    this.customTypes = {};
    this.codegen = [];
  }

  generate(): string {
    let out = [];
    for (let item of this.codegen) {
      out.push(item.generate());
    }
    return out.join("\n\n");
  }

  getCodegen(name: string, schema_: any) {
    let schema: Schema = Value.Parse(Schema, schema_);
    switch (schema.type) {
      case "array":
        return new GenArray(name, this.customTypes, schema);
      case "set":
        return new GenSet(name, this.customTypes, schema);
      case "record":
        return new GenRecord(name, this.customTypes, schema);
      case "tagged_record":
        return new GenTaggedRecord(name, this.customTypes, schema);
      case "record_fragment":
        return new GenRecordFragment(name, this.customTypes, schema);
      case "record_fragment_wrapper":
        return new GenRecordFragmentWrapper(name, this.customTypes, schema);
      case "map":
        return new GenMap(name, this.customTypes, schema);
      case "struct":
        return new GenStruct(name, this.customTypes, schema);
      case "enum":
        return new GenEnum(name, this.customTypes, schema);
      case "enum_simple":
        return new GenEnumSimple(name, this.customTypes, schema);
      case "newtype":
        return new GenNewtype(name, this.customTypes, schema);
    }
    throw new Error("Unknown type: " + schema_.type + " for " + name);
  }

  compile(name: string, schema: any) {
    let codegen = this.getCodegen(name, schema);
    this.customTypes[name] = codegen;
    this.codegen.push(codegen);
  }
}
