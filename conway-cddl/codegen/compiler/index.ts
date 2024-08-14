import { CodeGenerator } from "../generate/index";
import { Schema } from "./types";
import { GenArray } from "../generate/array";
import { GenSet } from "../generate/set";
import { GenRecord } from "../generate/record";
import { GenStruct } from "../generate/struct";
import { GenTaggedRecord } from "../generate/tagged_record";
import { GenMap } from "../generate/map";
import { GenEnum } from "../generate/enum";
import { GenEnumSimple } from "../generate/enum_simple";
import { GenNewtype } from "../generate/newtype";
import { GenRecordFragment } from "../generate/record_fragment";
import { GenRecordFragmentWrapper } from "../generate/record_fragment_wrapper";

export class Compiler {
  customTypes: Set<string>;
  codegen: CodeGenerator[];

  constructor() {
    this.customTypes = new Set();
    this.codegen = [];
  }

  generate(): string {
    let out = [];
    for (let item of this.codegen) {
      out.push(item.generate(this.customTypes));
    }
    return out.join("\n\n");
  }

  getCodegen(name: string, schema: Schema) {
    switch (schema.type) {
      case "array":
        return new GenArray(name, schema.item);
      case "set":
        return new GenSet(name, schema.item);
      case "record":
        return new GenRecord(name, schema.fields);
      case "tagged_record":
        return new GenTaggedRecord(name, schema.variants);
      case "record_fragment":
        return new GenRecordFragment(name, schema.fields);
      case "record_fragment_wrapper":
        return new GenRecordFragmentWrapper(name, schema.item);
      case "map":
        return new GenMap(name, schema.key, schema.value);
      case "struct":
        return new GenStruct(name, schema.fields);
      case "enum":
        return new GenEnum(name, schema.values);
      case "enum_simple":
        return new GenEnumSimple(name, schema.values);
      case "newtype":
        return new GenNewtype(
          name,
          schema.item,
          schema.accessor,
          schema.constraints,
        );
    }
    throw new Error("Unknown type: " + schema.type + " for " + name);
  }

  compile(name: string, schema: any) {
    let codegen = this.getCodegen(name, schema);
    this.customTypes.add(name);
    this.codegen.push(codegen);
  }
}
