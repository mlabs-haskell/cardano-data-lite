import * as yaml from "yaml";
import * as fs from "node:fs";

async function main() {
  for (let filename of ["conway"]) {
    let file = fs.readFileSync(`${filename}.yaml`, "utf8");
    let doc = yaml.parse(file);

    let customTypes: Set<string> = new Set();
    let typeRefs: Set<string> = new Set();

    for (let [key, value] of Object.entries(doc)) {
      if ((value as any).custom == true) {
        continue;
      }
      if (customTypes.has(key)) {
        console.error("Duplicate type:", key);
      }
      customTypes.add(key);
      try {
        processType(value, typeRefs);
      } catch (e) {
        console.error("Error: ", key, value, e);
      }
    }

    let undefinedTypes = [...setDiff(typeRefs, customTypes)].sort();

    let cryptoTypes = undefinedTypes.filter((x) => {
      x = x.toLowerCase();
      const suffixes = ["hash", "signature", "address", "key"];
      return suffixes.find((s) => x.endsWith(s)) != null;
    });

    let builtins = undefinedTypes.filter((x) => x[0].toLowerCase() == x[0]);

    undefinedTypes = undefinedTypes.filter(
      (x) => !builtins.includes(x) && !cryptoTypes.includes(x),
    );
    console.log("Unknown builtins", builtins);
    console.log("Unknown crypto", cryptoTypes);
    console.log("Undefined types", undefinedTypes);
  }
}

function setDiff<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  let ret = new Set(setA);
  for (let item of setB) {
    ret.delete(item);
  }
  return ret;
}

function processType(value: any, typeRefs: Set<string>) {
  const PRIMITIVES = [
    "number",
    "string",
    "boolean",
    "bytes",
    "bignum",
    "bytes32",
  ];
  if (typeof value == "string") {
    if (!PRIMITIVES.includes(value)) typeRefs.add(value);
    return;
  }

  if (value.type == "record" || value.type == "struct") {
    for (let field of value.fields) {
      processType(field.value, typeRefs);
    }
  } else if (
    value.type == "array" ||
    value.type == "set" ||
    value.type == "newtype"
  ) {
    processType(value.item, typeRefs);
  } else if (value.type == "map") {
    processType(value.key, typeRefs);
    processType(value.value, typeRefs);
  } else if (value.type == "tagged_record") {
    for (let variant of value.variants) {
      if (variant.value != null) processType(variant.value, typeRefs);
    }
  } else if (["enum", "enum_simple", "empty_class"].includes(value.type)) {
    // pass
  } else {
    throw new Error("Unknown type: " + value.type);
  }
}

await main();
