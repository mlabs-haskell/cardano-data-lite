import { Primitives, GenLeaf, GenRoot, GenLeafRef } from "../generate/index";
import { Schema, Schema_, getPrimitiveType } from "./types";
import { GenArray } from "../generate/array";
import * as changeCase from "change-case";
import { GenSet } from "../generate/set";
import { GenRecord } from "../generate/record";
import { GenStruct } from "../generate/struct";
import { GenTaggedRecord } from "../generate/tagged_record";
import { GenMap } from "../generate/map";
import { GenEnum } from "../generate/enum";
import { GenUnion } from "../generate/union";

export class Compiler {
  stack: string[];
  groups: { [key: string]: { fields: { key: string; value: GenLeaf }[] } };
  types: { [key: string]: GenRoot };

  constructor() {
    this.stack = [];
    this.groups = {};
    this.types = {};
  }

  generate(): string {
    let out = [];
    for (let item of this.stack) {
      out.push(this.types[item].generate());
    }
    return out.join("\n\n");
  }

  className(name: string) {
    return changeCase.pascalCase(name);
  }

  compile(name: string, schema: Schema): GenLeaf {
    let className = this.className(name);
    if (typeof schema === "string") {
      // TODO, bail on unknown type
      return null as any;
    } else {
      switch (schema.type) {
        case "array":
          return this.compileArray(className, schema);
        case "set":
          return this.compileSet(className, schema);
        case "record":
          return this.compileRecord(className, schema);
        case "tagged_record":
          return this.compileTaggedRecord(className, schema);
        case "map":
          return this.compileMap(className, schema);
        case "struct":
          return this.compileStruct(className, schema);
        case "enum":
          return this.compileEnum(className, schema);
        case "union":
          return this.compileUnion(className, schema);
        case "group":
          // TODO
          return null as any;
        default:
          return null as any;
      }
    }
  }

  push(gen: GenRoot) {
    if (gen.name in this.types) {
      throw "Duplicate class: " + gen.name;
    }
    this.types[gen.name] = gen;
    this.stack.push(gen.name);
    return new GenLeafRef(gen.name);
  }

  getLeaf(schema: Schema) {
    let primitive = getPrimitiveType(schema);
    if (primitive != null) {
      return Primitives[primitive];
    }
    if (typeof schema == "string") {
      let className = this.className(schema);
      return new GenLeafRef(className);
    }
    throw "Invalid schema for leaf: " + JSON.stringify(schema);
  }

  compileArray(name: string, schema: Schema_<"array">) {
    return this.push(new GenArray(name, this.getLeaf(schema.item)));
  }

  compileSet(name: string, schema: Schema_<"set">) {
    return this.push(new GenSet(name, this.getLeaf(schema.item)));
  }

  compileMap(name: string, schema: Schema_<"map">) {
    return this.push(
      new GenMap(name, this.getLeaf(schema.key), this.getLeaf(schema.value)),
    );
  }

  compileField(name: string, schema: Schema): GenLeaf {
    if (
      typeof schema != "string" &&
      ["array", "set", "map", "record", "tagged_record", "struct"].includes(
        schema.type,
      )
    ) {
      return this.compile(name, schema);
    }
    return this.getLeaf(schema);
  }

  compileRecord(name: string, schema: Schema_<"record">) {
    let fields = schema.fields.map((x) => ({
      name: x.key,
      optional: x.optional,
      nullable: x.nullable,
      type: this.compileField(x.key, x.value),
    }));
    return this.push(new GenRecord(name, fields));
  }

  compileStruct(name: string, schema: Schema_<"struct">) {
    let fields = schema.fields.map((x) => ({
      id: x.id,
      name: x.key,
      optional: x.optional,
      type: this.compileField(x.key, x.value),
    }));
    return this.push(new GenStruct(name, fields));
  }

  compileTaggedRecord(name: string, schema: Schema_<"tagged_record">) {
    let variants = schema.variants.map((x) => ({
      tag: x.tag,
      name: x.name,
      type: this.compileRecord(this.className(x.name), {
        type: "record",
        fields: x.fields || [],
      }).name(),
    }));

    return this.push(new GenTaggedRecord(name, variants));
  }

  compileEnum(name: string, schema: Schema_<"enum">) {
    let variants = schema.values.map((x) => ({
      tag: x.value,
      name: x.name,
      type: this.className(x.name),
    }));
    return this.push(new GenEnum(name, variants));
  }

  compileUnion(name: string, schema: Schema_<"union">) {
    let variants = [...schema.variants.entries()].map(([i, x]) => ({
      tag: i,
      name: x.name,
      type: this.compile(x.name, x.item).name(),
      // TODO
      type_discriminator: "",
    }));
    return this.push(new GenUnion(name, variants));
  }
}
