import { NumberConstraints, Schema } from "./types";
import * as yaml from "yaml";
import * as changeCase from "change-case";
import * as fs from "node:fs";
import synchronizedPrettier from "@prettier/sync";

export class Codegen {
  static primitiveFromCBOR: { [key: string]: (varName: string) => string } = {
    bool: (varName: string) => `${varName}.get("boolean")`,
    bytes: (varName: string) => `${varName}.get("bstr")`,
    int: (varName: string) => `${varName}.getInt()`,
    string: (varName: string) => `${varName}.get("tstr")`,
    uint: (varName: string) => `${varName}.get("uint")`,
    nint: (varName: string) => `${varName}.get("nint")`,
    float: (varName: string) => `${varName}.get("float")`,
  };

  static primitiveTypenames: { [key: string]: string } = {
    bool: "boolean",
    bytes: "Uint8Array",
    int: "number",
    string: "string",
    uint: "number",
    nint: "number",
    float: "number",
  };

  private identifiers: Set<string>;
  private stack: [string, Schema][];

  constructor() {
    this.identifiers = new Set();
    this.stack = [];
  }

  push(name: string, schema: Schema): string {
    name = this.className(name);
    if (this.identifiers.has(name)) {
      throw "Duplicate identifier: " + name;
    }
    this.stack.push([name, schema]);
    this.identifiers.add(name);
    return name;
  }

  generate(): string {
    let out: string[] = [];
    while (this.stack.length > 0) {
      let [name, schema] = this.stack.pop()!;
      let x = this.generate_(name, schema);
      if (x != null) out.push(x);
    }
    return out.join("\n\n");
  }

  generate_(name: string, schema: Schema): string | undefined {
    if (typeof schema == "string") {
      return;
    }

    switch (schema.type) {
      case "array":
        return this.genArray(name, schema);
      case "record":
        return this.genRecord(name, schema);
      case "tagged_record":
        return this.genTaggedRecord(name, schema);
      case "map":
        return this.genMap(name, schema);
      case "struct":
        return this.genStruct(name, schema);
      case "enum":
        return this.genEnum(name, schema);
      case "tagged":
        return this.genTagged(name, schema);
      case "union":
        return this.genUnion(name, schema);
      case "generic":
        return this.genGeneric(name, schema);
    }
  }

  itemFromCBOR(varName: string, schema: Schema): string {
    if (typeof schema == "string") {
      if (Codegen.primitiveFromCBOR[schema] != null) {
        return Codegen.primitiveFromCBOR[schema](varName);
      }
      if (!this.identifiers.has(schema)) {
        return "unknown_ident_" + schema;
        // throw "Unknown identifier: " + schema;
      }
      let className = this.className(schema);
      return `${className}.fromCBOR(${varName})`;
    }
    return this.itemFromCBOR(varName, schema.type);
  }

  className(schema: string): string {
    return changeCase.pascalCase(schema);
  }

  typeName(schema: Schema): string {
    let x: string;
    if (typeof schema == "string") {
      if (this.identifiers.has(schema)) {
        return this.className(schema);
      } else {
        x = schema;
      }
    } else {
      // if (schema.type == "nullable") return this.typeName(schema.item);
      x = schema.type;
    }

    let y = Codegen.primitiveTypenames[x];
    if (y == null) {
      return "unknown_" + x;
      throw "Unknown typeName: " + x;
    }
    return y;
  }

  genTaggedRecord(name: string, schema: Schema): string {
    return `// todo: ${name} tagged record`;
  }

  genEnum(name: string, schema: Schema): string {
    return `// todo: ${name} tagged record`;
  }

  genUnion(name: string, schema: Schema): string {
    return `// todo: ${name} tagged record`;
  }

  genTagged(name: string, schema: Schema): string {
    return `// todo: ${name} tagged record`;
  }

  genGeneric(name: string, schema: Schema): string {
    return `// todo: ${name} tagged record`;
  }
}

export function validateNumberConstraints(
  constraints: NumberConstraints,
  varName: string,
): string {
  if (typeof constraints === "number") {
    return `${varName} == ${constraints} `;
  }
  if (Array.isArray(constraints)) {
    return constraints
      .map((c) => validateNumberConstraints(c, varName))
      .join(" && ");
  }
  let c = ["true"];
  if (constraints.max != null) {
    c.push(`${varName} <= ${constraints.max} `);
  }
  if (constraints.min != null) {
    c.push(`${varName} >= ${constraints.min} `);
  }
  return c.join(" && ");
}

function main() {
  let codegen = new Codegen();
  for (let filename of ["conway", "crypto", "extra"]) {
    let file = fs.readFileSync(`../json/${filename}.yaml`, "utf8");
    let doc = yaml.parse(file);
    for (let [key, value] of Object.entries(doc)) {
      try {
        codegen.push(key, value as any);
      } catch (error) {
        console.error("Error: ");
        console.error("Key: ", key);
        console.error(error);
      }
    }
  }
  let out = codegen.generate();
  out = synchronizedPrettier.format(out, { parser: "babel-ts" });
  fs.writeFileSync("../out.ts", out);
}

main();
