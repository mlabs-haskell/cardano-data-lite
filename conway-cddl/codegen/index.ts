import { CodeGeneratorBase } from "./generators/index";
import { Schema } from "./types";
import { GenArray } from "./generators/array";
import { GenSet } from "./generators/set";
import { GenRecord } from "./generators/structured/record";
import { GenStruct } from "./generators/structured/struct";
import { GenTaggedRecord } from "./generators/tagged_record";
import { GenMap } from "./generators/map";
import { GenEnum } from "./generators/enum";
import { GenEnumSimple } from "./generators/enum_simple";
import { GenNewtype } from "./generators/newtype";
import { GenRecordFragment } from "./generators/structured/record_fragment";
import { GenRecordFragmentWrapper } from "./generators/structured/record_fragment_wrapper";
import { GenUnion } from "./generators/union";
import { Value } from "@sinclair/typebox/value";
import { GenHash } from "./generators/hash";
import { GenCustom } from "./generators/custom";

export type SchemaTable = { [key: string]: CodeGeneratorBase };

export class Codegen {
  customTypes: SchemaTable;
  generators: CodeGeneratorBase[];

  constructor() {
    this.customTypes = {};
    this.generators = [];
  }

  generate(): string {
    let generatorsSorted = [...this.generators];
    generatorsSorted.sort((a, b) =>
      a.name > b.name ? 1 : a.name == b.name ? 0 : -1,
    );
    let out: string[] = [];
    for (let item of generatorsSorted) {
      out.push(item.generate());
    }
    return out.join("\n\n");
  }

  getGenerator(name: string, schema_: any) {
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
      case "union":
        return new GenUnion(name, this.customTypes, schema);
      case "hash":
        return new GenHash(name, this.customTypes, schema);
      case "custom":
        return new GenCustom(name, this.customTypes, schema);
    }
    throw new Error("Unknown type: " + schema_.type + " for " + name);
  }

  add(name: string, schema: any) {
    let generator = this.getGenerator(name, schema);
    this.customTypes[name] = generator;
    this.generators.push(generator);
  }
}
