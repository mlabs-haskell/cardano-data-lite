// This module tests that serialization-deserialization of all transaction
// components in cardano-data-list match CSL at the byte level.
import fs from "node:fs";
import * as csl from "@emurgo/cardano-serialization-lib-nodejs-gc";
import * as yaml from "yaml";
import { Value } from "@sinclair/typebox/value";
import { Schema } from "../../conway-cddl/codegen/types";
import { TransactionInfo } from "../test_types"; 
import { test } from "@jest/globals";
import * as Out from "../../src/generated/out"

// Each component of a transaction is identified by its type and its location
// in the transaction ('path').
type Component = { type: string, path: string, cbor: Uint8Array }
// Each test is made of a transaction and an array of extracted components to test
type TestParameters = { txCount: number, txHash: string, componentIndex: number, component: Component }
// Result type for retrieving fields/elements/entries inside the different components
type AccessSubComponent = { sub: any | undefined, subPath: string }

// The transaction information obtained from get_transactions
let transactionInfos: Array<TransactionInfo> = [];
// The CSL transactions
let transactionsCsl: Array<csl.Transaction> = [];
// array of parameters for the test function
let testsTable: Array<TestParameters> = [];

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
]);

// Whether to log extraction messages or not
const traceExtraction = true;
// Whether to succeed when a $$CANT_READ error is found
const succeedWithUnimplementedFunctions = false;

const extractLog = traceExtraction ? (...args : any) => console.log(...args) : () => { ; };

// Retrieve TXs from FIFO...
extractLog("(serialization.test.ts) Reading transactions from get_transactions...")
const transactionInfoText = fs.readFileSync("transaction_fifo", { "encoding": "utf8" });
for (const chunk of transactionInfoText.trimEnd().split('\n')) {
  let transactionInfo: TransactionInfo = JSON.parse(chunk);
  transactionInfos.push(transactionInfo);
}
extractLog("(serialization.test.ts) All transactions read.")

// Build tests table
extractLog("(serialization.test.ts) Building tests table...")
let componentIndex = 0;
for (const [index, txInfo] of transactionInfos.entries()) {
  extractLog(`(serialization.test.ts) Decomposing TX ${txInfo.hash}`)
  let tx = csl.Transaction.from_hex(txInfo.cbor);
  transactionsCsl.push(tx);
  const components = explodeTx(tx)
  for (const component of components) {
    testsTable.push({
      txCount: index
      , txHash: txInfo.hash
      , component: component
      , componentIndex: componentIndex
    });
    componentIndex++;
  }
}
extractLog("(serialization.test.ts) Tests table prepared.")

// Decompose a csl transaction into its constituent parts
function explodeTx(tx: csl.Transaction): Array<Component> {
  let file = fs.readFileSync(`conway-cddl/yaml/conway.yaml`, "utf8");
  let schemata = yaml.parse(file);
  let key = "Transaction"
  let value = schemata["Transaction"];
  let schema: Schema = Value.Parse(Schema, value);
  let components: Array<Component> = [];
  explodeValue(key, tx, schema, schemata, components, "tx")
  components.push({ type: key, path: "tx", cbor: tx.to_bytes() });
  return components;
}

// Depth-first search of all sub-components (omitting optional/unavailable ones and builtin types)
// componentPath is used for debugging purposes
function explodeValue(key: string, value: any, schema: Schema, schemata: any, components: Array<Component>, componentPath: string): void {
  extractLog(`Key: ${key}, Type: ${schema.type}`);
  switch (schema.type) {
    case "record": // intended fall-through: this should work for records and record fragments
    case "record_fragment":
      for (const field of schema.fields) {
        const {sub: fieldValue, subPath: newComponentPath } = getField(value, field.name, field.type, field.nullable, componentPath);
        if (fieldValue && schemata[field.type]) {
          extractLog(`Field name: ${field.name}\nField type: ${field.type}\nPath: ${newComponentPath}`);
          explodeValue(field.name, fieldValue, schemata[field.type], schemata, components, newComponentPath)
          if (schema.type == "record") {
            components.push({ type: field.type, path: newComponentPath, cbor: fieldValue.to_bytes() });
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
        explodeValue(wrappedName, wrappedValue, schemata[wrappedType], schemata[wrappedType], components, newComponentPath)
        components.push({ type: wrappedType, path: newComponentPath, cbor: wrappedValue.to_bytes()});
      }
      break;
    }
    case "newtype": {
      // newtypes don't have sub-components
      break;
    }
    case "struct":
      for (const field of schema.fields) {
        const { sub: fieldValue, subPath: newComponentPath } = getField(value, field.name, field.type, field.optional, componentPath);
        if (fieldValue && schemata[field.type]) {
          extractLog(`Field name: ${field.name}\nField type: ${field.type}\nPath: ${newComponentPath}`);
          explodeValue(field.name, fieldValue, schemata[field.type], schemata, components, newComponentPath)
          components.push({ type: field.type, path: newComponentPath, cbor: fieldValue.to_bytes() });
        }
      }
      break;
    case "tagged_record": {
      // sum types
      let tag: number  = value.kind().valueOf();
      let variant = schema.variants.find((v) => v.tag == tag)
      extractLog("variant", variant);
      if (variant && variant.value && schemata[variant.value]) {
        const { sub: taggedValue, subPath: newComponentPath} = getTagged(value, variant.name, variant.value, componentPath);
        if (taggedValue) {
          extractLog(`Variant name: ${variant.name}\nVariant type: ${variant.value}`);
          explodeValue(variant.name, taggedValue, schemata[variant.value], schemata, components, newComponentPath)
          components.push({ type: variant.value, path: newComponentPath, cbor: taggedValue.to_bytes() })
        }
      }
      break;
      }
    case "map": // for maps we extract both the keys and the values
      for (let index = 0; index < value.keys().len(); index++) {
        const {sub: keyValue, subPath: keyPath} = getElem(value.keys(), index, `${key}.keys().get(${index})`, schema.key, componentPath);
        if (keyValue && schemata[schema.key]) {
          extractLog(`Key index: ${index}\nKey type: ${schema.key}\nKey path: ${keyPath}`);
          explodeValue(`${key}.keys().get(${index})`, keyValue, schemata[schema.key], schemata, components, keyPath)
          components.push({ type: schema.key, path: keyPath, cbor: keyValue.to_bytes()});
        }
        const {sub: entryValue, subPath: valuePath} = getEntry(value, keyValue, `${key}.get(Key#${index})`, schema.value, index, componentPath);
        if (entryValue && schemata[schema.value]) {
          extractLog(`Value type: ${schema.value}\nValue path: ${valuePath}`);
          explodeValue(`${key}.get(Key#${index})`, entryValue, schemata[schema.value], schemata, components, valuePath)
          components.push({ type: schema.value, path: valuePath, cbor: entryValue.to_bytes()});
        }
      }
      break;
    case "set":
      for (let index = 0; index < value.len(); index++) {
        const {sub: elemValue, subPath: newComponentPath} = getElem(value, index, `${key}[${index}]`, schema.item, componentPath);        
        if (elemValue && schemata[schema.item]) {
          extractLog(`Elem index: ${index}\nElem type: ${schema.item}\nPath: ${newComponentPath}`);
          explodeValue(`${key}[${index}]`, elemValue, schemata[schema.item], schemata, components, newComponentPath)
          components.push({ type: schema.item, path: newComponentPath, cbor: elemValue.to_bytes() });
        }
      }
      break;
    case "array":
      for (let index = 0; index < value.len(); index++) {
        const {sub: elemValue, subPath: newComponentPath } = getElem(value, index, `${key}[${index}]`, schema.item, componentPath);
        if (elemValue && schemata[schema.item]) {
          extractLog(`Elem index: ${index}\nElem type: ${schema.item}\nPath: ${newComponentPath}`);
          explodeValue(`${key}[${index}]`, elemValue, schemata[schema.item], schemata, components, newComponentPath)
          components.push({ type: schema.item, path: newComponentPath, cbor: elemValue.to_bytes() });
        }
      }
      break;
    case "enum":
      break; // enums don't have subcomponents
    case "enum_simple":
      extractLog("Found and enum_simple while extracting. Ignoring...")
      break;
  }
}

// Get field of struct or record
function getField(value: any, fieldName: string, fieldType: string, optional: boolean | undefined, path: string): AccessSubComponent {
  extractLog("getField: ", fieldName);
  const subPath = optional ? `${path}["${fieldName}"]()?` : `${path}["${fieldName}"]()`
  if (typeBlacklist.has(fieldType) || fieldsBlacklist.has(fieldName)) {
    return { sub: undefined, subPath: subPath };
  }
  return {sub: value[fieldName](), subPath: subPath };
}

// Get wrappped value out of record_fragment_wrapper
function getWrapped(value: any, wrappedName: string, wrappedType: string, path: string): AccessSubComponent {
  extractLog("getWrapped: ", wrappedName)  ;
  const subPath = `${path}[${wrappedName}]()`
  if (typeBlacklist.has(wrappedType)) {
    return { sub: undefined, subPath: subPath };
  }
  return { sub: value[wrappedName](), subPath: subPath };
}

// Get entry of map
function getEntry(value: any, mapKey: any, entryName: string, entryType: string, mapKeyIndex: number, path: string): AccessSubComponent {
  extractLog("getEntry: ", entryName);
  const subPath = `${path}.get(${path}.keys().get(${mapKeyIndex}))`;
  if (typeBlacklist.has(entryType)) {
    return { sub: undefined, subPath: subPath };
  }
  return { sub: value.get(mapKey), subPath: subPath };
}

// Get element of array or set (can be used for getting a key by index too)
function getElem(value: any, index: number, elemName: string, elemType: string, path: string): AccessSubComponent {
  extractLog("getElem: ", elemName);
  const subPath = `${path}.get(${index})`;
  if (typeBlacklist.has(elemType)) {
    return { sub: undefined, subPath: subPath };
  }
  return {sub: value.get(index), subPath: subPath };
}

// Get value out of a tagged_record
function getTagged(value: any, variantName: string, variantType: string, path: string): AccessSubComponent {
  extractLog("getTagged: ", variantName);
  const accessor = `as_${variantName}`;
  const subPath = `${path}[\"${accessor}\"]`
  if (typeBlacklist.has(variantType) || fieldsBlacklist.has(variantName)) {
    return { sub: undefined, subPath: subPath };
  }
  return {sub: value[accessor](), subPath: subPath };
}

describe("Serialization/deserialization roundtrip tests", () => {
  // Used for debugging 
  let testN = 0;
  test.skip(`Test N. ${testN}`, () => {
    console.log(Buffer.from(testsTable[testN].component.cbor).toString('hex'));
    let class_key = testsTable[testN].component.type as keyof (typeof Out);
    let deserialized = (Out[class_key] as any).from_bytes(testsTable[testN].component.cbor);
    let serialized = deserialized.to_bytes();
    expect(serialized).toStrictEqual(testsTable[testN].component.cbor);
  })

  test.each(testsTable)("($componentIndex) TX $txCount ($txHash)\n\tComponent $component.path ($component.type) ", (params) => {
    let class_key = params.component.type as keyof (typeof Out);
    expect(roundtrip_eq(Out[class_key], params.component.cbor)).toBeTruthy();
  });
});

function roundtrip_eq(someClass: any, cbor: Uint8Array): boolean {
    let deserialized: any;
    try {
      deserialized = someClass.from_bytes(cbor);
    } catch(err) {
      if(err instanceof TypeError && err.message === "$$CANT_READ is not a function" && succeedWithUnimplementedFunctions) {
        return true;
      } else {
        throw(err);
      }
    }
    let serialized: Uint8Array = deserialized.to_bytes();
    return (Buffer.compare(serialized, cbor) == 0)
}
