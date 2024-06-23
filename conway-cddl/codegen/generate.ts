import { NumberConstraints, PrimitiveType, Schema } from "./types";
import * as yaml from "yaml";

abstract class GenPrimitive {
  type: PrimitiveType;
  jsType: string;

  constructor(type: PrimitiveType, jsType: string) {
    this.type = type;
    this.jsType = jsType;
  }

  validate(): string {
    return `
      static function validate(value: ${this.jsType}): boolean {
        ${this.validate_("value")}
      }
    `;
  }

  abstract validate_(varName: string): string;
}

abstract class GenComposite {
  type: string;

  constructor(type: string) {
    this.type = type;
  }

  abstract fromCBOR(): string;
  abstract toCBOR(): string;
  abstract clone(): string;

  abstract validate(): string;
}

class GenBool extends GenPrimitive {
  constructor() {
    super("bool", "boolean");
  }

  validate_(varName: string): string {
    return "true";
  }
}

class GenBytes extends GenPrimitive {
  len: NumberConstraints;
  constructor(len: NumberConstraints) {
    super("bytes", "Uint8Array");
    this.len = len;
  }

  validate_(varName: string): string {
    return "return " + validateNumberConstraints(this.len, varName + ".length");
  }
}

class GenInt extends GenPrimitive {
  value: NumberConstraints;
  constructor(value: NumberConstraints) {
    super("int", "number");
    this.value = value;
  }

  validate_(varName: string): string {
    return validateNumberConstraints(this.value, varName);
  }
}

class GenUint extends GenPrimitive {
  value: NumberConstraints;
  constructor(value: NumberConstraints) {
    super("int", "number");
    this.value = value;
  }

  validate_(varName: string): string {
    return validateNumberConstraints(this.value, varName);
  }
}

class GenNint extends GenPrimitive {
  value: NumberConstraints;
  constructor(value: NumberConstraints) {
    super("int", "number");
    this.value = value;
  }

  validate_(varName: string): string {
    return validateNumberConstraints(this.value, varName);
  }
}

class GenString extends GenPrimitive {
  len: NumberConstraints;
  constructor(len: NumberConstraints) {
    super("string", "string");
    this.len = len;
  }

  validate_(varName: string): string {
    return "return " + validateNumberConstraints(this.len, varName + ".length");
  }
}

class GenArray extends GenComposite {
  fromCBOR(): string {
    throw new Error("Method not implemented.");
  }
  toCBOR(): string {
    throw new Error("Method not implemented.");
  }
  validate(): string {
    throw new Error("Method not implemented.");
  }
}

function validateNumberConstraints(
  constraints: NumberConstraints,
  varName: string
): string {
  if (typeof constraints === "number") {
    return `${varName} == ${constraints}`;
  }
  if (Array.isArray(constraints)) {
    return constraints
      .map((c) => validateNumberConstraints(c, varName))
      .join(" && ");
  }
  let c = ["true"];
  if (constraints.max != null) {
    c.push(`${varName} <= ${constraints.max}`);
  }
  if (constraints.min != null) {
    c.push(`${varName} >= ${constraints.min}`);
  }
  return c.join(" && ");
}
