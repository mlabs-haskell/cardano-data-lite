import * as yaml from "yaml";
import * as fs from "fs";
import { NumberConstraints } from "./types";

export class ValidationError extends Error {
  constructor(path: string, message: string) {
    super(path + ": " + message);
    this.name = "ValidationError";
  }
}

export function validate(entry: any, path = "") {
  if (typeof entry === "string") {
    return;
  }
  if (typeof entry != "object") {
    throw new ValidationError(path, "Expected object");
  }
  if (entry == null) {
    throw new ValidationError(path, "Expected non-null object");
  }

  if (entry.type == "bool") {
    return;
  }
  if (entry.type == "bytes") {
    if (entry.len != null) {
      validateNumberConstraints(entry.len, path + ".len");
    }
    return;
  }
  if (entry.type == "int") {
    if (entry.value != null) {
      validateNumberConstraints(entry.value, path + ".value");
    }
    return;
  }
  if (entry.type == "string") {
    if (entry.len != null) {
      validateNumberConstraints(entry.len, path + ".len");
    }
    return;
  }
  if (entry.type == "uint") {
    if (entry.value != null) {
      validateNumberConstraints(entry.value, path + ".value");
    }
    return;
  }
  if (entry.type == "nint") {
    if (entry.value != null) {
      validateNumberConstraints(entry.value, path + ".value");
    }
    return;
  }
  if (entry.type == "array") {
    validate(entry.item, path + ".item");
    if (entry.len != null) {
      validateNumberConstraints(entry.len, path + ".len");
    }
    return;
  }
  if (entry.type == "set") {
    validate(entry.item, path + ".item");
    if (entry.len != null) {
      validateNumberConstraints(entry.len, path + ".len");
    }
    return;
  }
  if (entry.type == "record") {
    if (!Array.isArray(entry.fields)) {
      throw new ValidationError(
        path + ".fields",
        "Expected fields to be an array",
      );
    }
    let encounteredOptional = false;

    for (let [i, field] of entry.fields.entries()) {
      if (typeof field != "object") {
        throw new ValidationError(
          path + ".fields[" + i + "]",
          "Expected object",
        );
      }
      if (field == null) {
        throw new ValidationError(
          path + ".fields[" + i + "]",
          "Expected non-null",
        );
      }
      if (field.key == null) {
        throw new ValidationError(
          path + ".fields[" + i + "].key",
          "Expected key field",
        );
      }
      if (field.value == null) {
        throw new ValidationError(
          path + ".fields[" + i + "].value",
          "Expected value field",
        );
      }
      if (field.optional != null) {
        if (typeof field.optional !== "boolean") {
          throw new ValidationError(
            path + ".fields[" + i + "].optional",
            "Expected optional to be a boolean",
          );
        }
        encounteredOptional = true;
      }
      if (encounteredOptional && !field.optional) {
        throw new ValidationError(
          path + ".fields[" + i + "].optional",
          "Expected all fields after an optional field to be optional",
        );
      }
      validate(field.key, path + ".fields[" + i + "].key");
      validate(field.value + ".fields[" + i + "].value");
    }
    return;
  }
  if (entry.type == "tagged_record") {
    if (!Array.isArray(entry.variants)) {
      throw new ValidationError(
        path + ".variants",
        "Expected variants to be an array",
      );
    }
    for (let [i, variant] of entry.variants.entries()) {
      if (typeof variant != "object") {
        throw new ValidationError(
          path + ".variants[" + i + "]",
          "Expected variant to be an object",
        );
      }
      if (variant == null) {
        throw new ValidationError(
          path + ".variants[" + i + "]",
          "Expected non-null variant",
        );
      }
      if (variant.name == null) {
        throw new ValidationError(
          path + ".variants[" + i + "].name",
          "Expected name field",
        );
      }
      if (variant.tag == null) {
        throw new ValidationError(
          path + ".variants[" + i + "].tag",
          "Expected tag field",
        );
      }
      if (typeof variant.tag != "number") {
        throw new ValidationError(
          path + ".variants[" + i + "].tag",
          "Expected tag to be a number",
        );
      }
      if (variant.fields != null) {
        if (!Array.isArray(variant.fields)) {
          throw new ValidationError(
            path + ".variants[" + i + "].fields",
            "Expected fields to be an array",
          );
        }
        for (let [j, field] of variant.fields.entries()) {
          if (typeof field != "object") {
            throw new ValidationError(
              path + ".variants[" + i + "].fields[" + j + "]",
              "Expected field to be an object",
            );
          }
          if (field == null) {
            throw new ValidationError(
              path + ".variants[" + i + "].fields[" + j + "]",
              "Expected non-null field",
            );
          }
          if (field.key == null) {
            throw new ValidationError(
              path + ".variants[" + i + "].fields[" + j + "].key",
              "Expected key field",
            );
          }
          if (field.value == null) {
            throw new ValidationError(
              path + ".variants[" + i + "].fields[" + j + "].value",
              "Expected value field",
            );
          }
          validate(
            field.key,
            path + ".variants[" + i + "].fields[" + j + "].key",
          );
          validate(
            field.value,
            path + ".variants[" + i + "].fields[" + j + "].value",
          );
        }
      }
    }
    return;
  }
  if (entry.type == "map") {
    validate(entry.key, path + ".key");
    validate(entry.value, path + ".value");
    if (entry.len != null) {
      validateNumberConstraints(entry.len);
    }
    return;
  }
  if (entry.type == "struct") {
    if (!Array.isArray(entry.fields)) {
      throw new ValidationError(
        path + ".fields",
        "Expected fields to be an array",
      );
    }
    for (let [i, field] of entry.fields.entries()) {
      if (typeof field != "object") {
        throw new ValidationError(
          path + ".fields[" + i + "]",
          "Expected field to be an object",
        );
      }
      if (field == null) {
        throw new ValidationError(
          path + ".fields[" + i + "]",
          "Expected non-null field",
        );
      }
      if (field.id == null) {
        throw new ValidationError(
          path + ".fields[" + i + "].id",
          "Expected id field",
        );
      }
      if (typeof field.id != "number") {
        throw new ValidationError(
          path + ".fields[" + i + "].id",
          "Expected id to be a number",
        );
      }
      if (field.key == null) {
        throw new ValidationError(
          path + ".fields[" + i + "].key",
          "Expected key field",
        );
      }
      if (field.value == null) {
        throw new ValidationError(
          path + ".fields[" + i + "].value",
          "Expected value field",
        );
      }
      if (field.optional != null) {
        if (typeof field.optional !== "boolean") {
          throw new ValidationError(
            path + ".fields[" + i + "].optional",
            "Expected optional to be a boolean",
          );
        }
      }
      validate(field.key, path + ".fields[" + i + "].key");
      validate(field.value, path + ".fields[" + i + "].value");
    }
    return;
  }
  if (entry.type == "enum") {
    if (!Array.isArray(entry.values)) {
      throw new ValidationError(
        path + ".values",
        "Expected values to be an array",
      );
    }
    for (let [i, value] of entry.values.entries()) {
      if (typeof value != "object") {
        throw new ValidationError(
          path + ".values[" + i + "]",
          "Expected value to be an object",
        );
      }
      if (value == null) {
        throw new ValidationError(
          path + ".values[" + i + "]",
          "Expected non-null value",
        );
      }
      if (value.name == null) {
        throw new ValidationError(
          path + ".values[" + i + "].name",
          "Expected name field",
        );
      }
      if (value.value == null) {
        throw new ValidationError(
          path + ".values[" + i + "].value",
          "Expected value field",
        );
      }
      if (typeof value.value != "number") {
        throw new ValidationError(
          path + ".values[" + i + "].value",
          "Expected value to be a number",
        );
      }
    }
    return;
  }
  if (entry.type == "tagged") {
    validate(entry.item, path + ".item");
    if (entry.tag != null) {
      validateNumberConstraints(entry.tag);
    }
    return;
  }
  if (entry.type == "union") {
    if (!Array.isArray(entry.variants)) {
      throw new ValidationError(
        path + ".variants",
        "Expected variants to be an array",
      );
    }
    for (let [i, variant] of entry.variants.entries()) {
      if (typeof variant != "object") {
        throw new ValidationError(
          path + ".variants[" + i + "]",
          "Expected variant to be an object",
        );
      }
      if (variant == null) {
        throw new ValidationError(
          path + ".variants[" + i + "]",
          "Expected non-null variant",
        );
      }
      if (variant.name == null) {
        throw new ValidationError(
          path + ".variants[" + i + "].name",
          "Expected name field",
        );
      }
      if (variant.item == null) {
        throw new ValidationError(
          path + ".variants[" + i + "].item",
          "Expected item field",
        );
      }
      validate(variant.item, path + ".variants[" + i + "].item");
    }
    return;
  }
  if (entry.type == "group") {
    if (!Array.isArray(entry.fields)) {
      throw new ValidationError(
        path + ".fields",
        "Expected fields to be an array",
      );
    }
    for (let [i, field] of entry.fields.entries()) {
      if (typeof field != "object") {
        throw new ValidationError(
          path + ".fields[" + i + "]",
          "Expected field to be an object",
        );
      }
      if (field == null) {
        throw new ValidationError(
          path + ".fields[" + i + "]",
          "Expected non-null field",
        );
      }
      if (field.key == null) {
        throw new ValidationError(
          path + ".fields[" + i + "].key",
          "Expected key field",
        );
      }
      if (typeof field.key != "string") {
        throw new ValidationError(
          path + ".fields[" + i + "].key",
          "Expected key to be string",
        );
      }
      if (field.value == null) {
        throw new ValidationError(
          path + ".fields[" + i + "].value",
          "Expected value field",
        );
      }
      validate(field.value, path + ".fields[" + i + "].value");
    }
    return;
  }
}

function validateNumberConstraints(constraints: NumberConstraints, path = "") {
  if (typeof constraints === "number") {
    return;
  }
  if (Array.isArray(constraints)) {
    for (let constraint of constraints) {
      validateNumberConstraints(constraint);
    }
    return;
  }
  if (typeof constraints === "object") {
    if (constraints.min != null && typeof constraints.min !== "number") {
      throw new ValidationError(path, "Expected min to be a number");
    }
    if (constraints.max != null && typeof constraints.max !== "number") {
      throw new ValidationError(path, "Expected max to be a number");
    }
    return;
  }
  throw new ValidationError(path, "Expected number or object");
}

let file = fs.readFileSync("../../yaml/conway.yaml", "utf8");
let doc = yaml.parse(file);
for (let [key, value] of Object.entries(doc)) {
  try {
    validate(value);
  } catch (error) {
    console.error("Error: ");
    console.error("Key: ", key);
    console.error(error);
  }
}
