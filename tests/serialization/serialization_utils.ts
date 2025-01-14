import fs from "node:fs";
import * as csl from "@emurgo/cardano-serialization-lib-nodejs-gc";
import * as yaml from "yaml";
import { Value } from "@sinclair/typebox/value";
import { AccessSubComponent, Component, RoundtripTestParameters, TransactionInfo } from "../test_types";
import { Schema } from "../../conway-cddl/codegen/types";
import { exit } from "node:process";

// Whether to log extraction messages or not
const traceExtraction = true;
const extractLog = traceExtraction ? (...args : any) => console.log(...args) : () => { ; };

// Types we are not interested in (or that are not supported)
const typeBlacklist = new Set<string>([
  // Deprecated
  "MoveInstantaneousRewards",
  "GenesisKeyDelegation",
  // Uninteresting
  "boolean",
  "bignum" 
]);
// Unsupported fields during extraction
const fieldsBlacklist = new Set<string>([
  "plutus_scripts_v1",
  "plutus_scripts_v2",
  "plutus_scripts_v3",
  "script_pubkey",
  "inner_plutus_data"
])

export function retrieveTxsFromDir(path: string): Array<TransactionInfo> {
  let files: Array<string> = fs.readdirSync(path);
  // filter out hidden files
  const matchHidden = /^\.\w+/
  files = files.filter((path) => !path.match(matchHidden));

  let tinfos: Array<TransactionInfo> = [];
  for (const file of files) {
    const fileRegex = /(?<idx>[0-9]{3})-(?<hash>[0123456789abcdef]+)\.cbor/;
    const match = file.match(fileRegex);
    if (!match || !match.groups || !match.groups["hash"]) {
      console.log(`(retrieveTxsFromDir) Failed to parse filename: ${file}`);
      exit(-1);
    } else {
      const cbor = fs.readFileSync(`${path}/${file}`, { encoding: "utf-8"});
      tinfos.push({"hash": match.groups["hash"], "cbor": cbor})
    }
  }
  return tinfos;
}

// Extract the components of the passed transactions and build a test table
export function buildTestTable(infos: Array<TransactionInfo>): Array<RoundtripTestParameters> {
  let componentIndex = 0;
  let testTable: Array<RoundtripTestParameters> = [];
  for (const [index, info] of infos.entries()) {
    extractLog(`(serialization.test.ts) Decomposing TX ${info.hash}`)
    let tx = csl.Transaction.from_hex(info.cbor);
    let components = [];
    depthFirstTraversal(explodeTx(tx), components);
    for (const component of components) {
      testTable.push({
        txCount: index
        , txHash: info.hash
        , txHashAbbrev: info.hash.slice(0, 8)
        , component: component
        , componentIndex: componentIndex
      });
      componentIndex++;
    }
  }
  return testTable;
}

export function writeExceptionReport(reportFile: number, params: RoundtripTestParameters, err: any): void {
  fs.writeSync(reportFile, `${params.componentIndex},${params.txHashAbbrev},${params.component.type},${params.component.path},Throws exception: '${err}',,\n`);
}

export function writeRoundtripErrorReport(reportFile: number, params: RoundtripTestParameters, result: Uint8Array): void {
  fs.writeSync(reportFile, `${params.componentIndex},${params.txHashAbbrev},${params.component.type},${params.component.path},Roundtrip fails,${params.component.cbor},${result}\n`);
}

export function writeChildErrorReport(reportFile: number, params: RoundtripTestParameters): void {
  fs.writeSync(reportFile, `${params.componentIndex},${params.txHashAbbrev},${params.component.type},${params.component.path},Child fails roundtrip,,\n`);
}

// might throw exceptions!
export function roundtrip(someClass: any, cbor: Uint8Array): Uint8Array {
    let deserialized = someClass.from_bytes(cbor);
    return deserialized.to_bytes();
}

function depthFirstTraversal(c: Component, acc: Array<Component>): void {
  for (const child of c.children) {
    depthFirstTraversal(child, acc);
  }
  acc.push(c);
}

// Decompose a csl transaction into its constituent parts
function explodeTx(tx: csl.Transaction): Component {
  let file = fs.readFileSync(`conway-cddl/yaml/conway.yaml`, "utf8");
  let schemata = yaml.parse(file);
  let key = "Transaction"
  let value = schemata["Transaction"];
  let schema: Schema = Value.Parse(Schema, value);
  let children: Array<Component> = [];
  explodeValue(key, tx, schema, schemata, children, "tx")
  return { type: key, key: "tx", path: "tx", cbor: tx.to_bytes(), children: children, failed: false };
}

// Depth-first search of all sub-components (omitting optional/unavailable ones and builtin types)
function explodeValue(key: string, value: any, schema: Schema, schemata: any, children: Array<Component>, componentPath: string): void {
  extractLog(`Key: ${key}, Type: ${schema.type}`);
  switch (schema.type) {
    case "record": // intended fall-through: this should work for records and record fragments
    case "record_fragment":
      for (const field of schema.fields) {
        const {sub: fieldValue, subPath: newComponentPath } = getField(value, field.name, field.type, field.nullable, componentPath);
        if (fieldValue && schemata[field.type]) {
          extractLog(`Field name: ${field.name}\nField type: ${field.type}\nPath: ${newComponentPath}`);
          let grandchildren = [];
          explodeValue(field.name, fieldValue, schemata[field.type], schemata, grandchildren, newComponentPath)
          if (schema.type == "record") {
            children.push({ type: field.type, key: key, path: newComponentPath, children: grandchildren, cbor: fieldValue.to_bytes(), failed: false });
          } // we don't test record fragments themselves
        }
      }
      break;
    case "record_fragment_wrapper": {
      const wrappedName = schema.item.name;
      const wrappedType = schema.item.type;
      const {sub: wrappedValue, subPath: newComponentPath } = getWrapped(value, wrappedName, wrappedType, componentPath);
      if (wrappedValue && schemata[wrappedType]) {
        extractLog(`Wrapped value (record fragment): ${wrappedName}\nWrapped type: ${wrappedType}`);
        let grandchildren = [];
        explodeValue(wrappedName, wrappedValue, schemata[wrappedType], schemata[wrappedType], grandchildren, newComponentPath)
        children.push({ type: wrappedType, key: key, path: newComponentPath, children: grandchildren, cbor: wrappedValue.to_bytes(), failed: false});
      }
      break;
    }
    case "newtype": {
      extractLog("Found a newtype while extracting. Ignoring...")
      // newtypes don't have sub-components
      break;
    }
    case "struct":
      for (const field of schema.fields) {
        const { sub: fieldValue, subPath: newComponentPath } = getField(value, field.name, field.type, field.optional, componentPath);
        if (fieldValue && schemata[field.type]) {
          extractLog(`Field name: ${field.name}\nField type: ${field.type}\nPath: ${newComponentPath}`);
          let grandchildren = [];
          explodeValue(field.name, fieldValue, schemata[field.type], schemata, grandchildren, newComponentPath)
          children.push({ type: field.type, key: key, path: newComponentPath, children: grandchildren, cbor: fieldValue.to_bytes(), failed: false});
        }
      }
      break;
    case "tagged_record": {
      // sum types
      let tag: number = value.kind().valueOf();
      let variant = schema.variants.find((v) => v.tag == tag)
      extractLog("variant", variant);
      if (variant && variant.value && schemata[variant.value]) {
        const { sub: taggedValue, subPath: newComponentPath} = getTagged(value, variant.name, variant.value, componentPath);
        if (taggedValue) {
          extractLog(`Variant name: ${variant.name}\nVariant type: ${variant.value}`);
          let grandchildren = [];
          explodeValue(variant.name, taggedValue, schemata[variant.value], schemata, grandchildren, newComponentPath)
          children.push({ type: variant.value, key: key, path: newComponentPath, children: grandchildren, cbor: taggedValue.to_bytes(), failed: false })
        }
      }
      break;
      }
    case "map": // for maps we extract both the keys and the values
      for (let index = 0; index < value.keys().len(); index++) {
        const {sub: keyValue, subPath: keyPath} = getElem(value.keys(), index, `${key}.keys().get(${index})`, schema.key, componentPath);
        if (keyValue && schemata[schema.key]) {
          extractLog(`Key index: ${index}\nKey type: ${schema.key}\nKey path: ${keyPath}`);
          let grandchildren = [];
          explodeValue(`${key}.keys().get(${index})`, keyValue, schemata[schema.key], schemata, grandchildren, keyPath)
          children.push({ type: schema.key, key: key, path: keyPath, children: grandchildren, cbor: keyValue.to_bytes(), failed: false});
        }
        const {sub: entryValue, subPath: valuePath} = getEntry(value, keyValue, `${key}.get(Key#${index})`, schema.value, index, componentPath);
        if (entryValue && schemata[schema.value]) {
          extractLog(`Value type: ${schema.value}\nValue path: ${valuePath}`);
          let grandchildren = [];
          explodeValue(`${key}.get(Key#${index})`, entryValue, schemata[schema.value], schemata, grandchildren, valuePath)
          children.push({ type: schema.value, key: key, path: valuePath, children: grandchildren, cbor: entryValue.to_bytes(), failed: false});
        }
      }
      break;
    case "set":
      for (let index = 0; index < value.len(); index++) {
        const {sub: elemValue, subPath: newComponentPath} = getElem(value, index, `${key}[${index}]`, schema.item, componentPath);        
        if (elemValue && schemata[schema.item]) {
          extractLog(`Elem index: ${index}\nElem type: ${schema.item}\nPath: ${newComponentPath}`);
          let grandchildren = [];
          explodeValue(`${key}[${index}]`, elemValue, schemata[schema.item], schemata, grandchildren, newComponentPath)
          children.push({ type: schema.item, key: key, path: newComponentPath, children: grandchildren, cbor: elemValue.to_bytes(), failed: false});
        }
      }
      break;
    case "array":
      if (schema.item) {
        for (let index = 0; index < value.len(); index++) {
          const {sub: elemValue, subPath: newComponentPath } = getElem(value, index, `${key}[${index}]`, schema.item, componentPath);
          if (elemValue && schemata[schema.item]) {
            extractLog(`Elem index: ${index}\nElem type: ${schema.item}\nPath: ${newComponentPath}`);
            let grandchildren = [];
            explodeValue(`${key}[${index}]`, elemValue, schemata[schema.item], schemata, grandchildren, newComponentPath)
            children.push({ type: schema.item, key: key, path: newComponentPath, children: grandchildren, cbor: elemValue.to_bytes(), failed: false});
          }
        }
      }
      break;
    case "union": {
      // for unions we don't extract the children
      // NOTE: The reason we don't do it is that there doesn't seem to be a
      // common interface in CSL for interacting with a union's variants
      extractLog("Found a union while extracting, ignoring...");
      break;
    }
    case "enum":
      extractLog("Found an enum while extracting. Ignoring...")
      break; // enums don't have subcomponents
    case "enum_simple":
      extractLog("Found an enum_simple while extracting. Ignoring...")
      break;
  }
}

// Get field of struct or record
function getField(value: any, fieldName: string, fieldType: string, optional: boolean | undefined, path: string): AccessSubComponent {
  extractLog("getField: ", fieldName);
  const subPath = optional ? `${path}/${fieldName}?` : `${path}/${fieldName}`
  if (typeBlacklist.has(fieldType) || fieldsBlacklist.has(fieldName)) {
    return { sub: undefined, subPath: subPath };
  }
  return {sub: value[fieldName](), subPath: subPath };
}

// Get wrappped value out of record_fragment_wrapper
function getWrapped(value: any, wrappedName: string, wrappedType: string, path: string): AccessSubComponent {
  extractLog("getWrapped: ", wrappedName)  ;
  const subPath = `${path}/${wrappedName}]`
  if (typeBlacklist.has(wrappedType)) {
    return { sub: undefined, subPath: subPath };
  }
  return { sub: value[wrappedName](), subPath: subPath };
}

// Get entry of map
function getEntry(value: any, mapKey: any, entryName: string, entryType: string, mapKeyIndex: number, path: string): AccessSubComponent {
  extractLog("getEntry: ", entryName);
  const subPath = `${path}/Key#${mapKeyIndex}`;
  if (typeBlacklist.has(entryType)) {
    return { sub: undefined, subPath: subPath };
  }
  return { sub: value.get(mapKey), subPath: subPath };
}

// Get element of array or set (can be used for getting a key by index too)
function getElem(value: any, index: number, elemName: string, elemType: string, path: string): AccessSubComponent {
  extractLog("getElem: ", elemName);
  const subPath = `${path}/Elem#${index}`;
  if (typeBlacklist.has(elemType)) {
    return { sub: undefined, subPath: subPath };
  }
  return {sub: value.get(index), subPath: subPath };
}

// Get value out of a tagged_record
function getTagged(value: any, variantName: string, variantType: string, path: string): AccessSubComponent {
  extractLog("getTagged: ", variantName);
  const accessor = `as_${variantName}`;
  const subPath = `${path}/${accessor}`
  if (typeBlacklist.has(variantType) || fieldsBlacklist.has(variantName)) {
    return { sub: undefined, subPath: subPath };
  }
  return {sub: value[accessor](), subPath: subPath };
}
