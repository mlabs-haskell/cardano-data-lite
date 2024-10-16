// This module tests that serialization-deserialization of all transaction
// components in cardano-data-list match CSL at the byte level.
import fs from "node:fs";
import * as csl from "@emurgo/cardano-serialization-lib-nodejs-gc";
import * as yaml from "yaml";
import { Value } from "@sinclair/typebox/value";
import { Schema } from "../../conway-cddl/codegen/types";
import { TransactionInfo } from "../test_types"; 
import { test } from "@jest/globals";
import * as Out from "../../src/generated.ts"
import { exit } from "node:process";

// Each component of a transaction is identified by its type and its location
// in the transaction ('path').
type Component = {
  type: string                     // The class of the component
  , key: string                    // The key used to access it (i.e: attribute name, map key, array index)
  , path: string                   // The complete path to access it given a CSL transaction.
  , cbor: Uint8Array               // Its CBOR (if available)
  , children: Array<Component>     // Immediate children (i.e: attributes, map members, array elements)
  , failed: boolean                // Whether it succeeded or failed during testing
}

// Each test is made of a transaction and an array of extracted components to test
type TestParameters = { txCount: number, txHash: string, txHashAbbrev: string, componentIndex: number, component: Component }
// Result type for retrieving fields/elements/entries inside the different components
type AccessSubComponent = { sub: any | undefined, subPath: string }

// Locations for retrieved transactions
const stagingPath = "tests/serialization/staging";
const regressionPath  = "tests/serialization/regression";

// The transaction information obtained from get_transactions
let stagingTransactionInfos: Array<TransactionInfo> = [];
let regressionTransactionInfos: Array<TransactionInfo> = [];
// This set may grow during testing when transactions are moved from staging
// to regression.
let regressionTransactionHashes: Set<string> = new Set();
// The CSL transactions
let transactionsCsl: Array<csl.Transaction> = [];
// Arrays of parameters for the test function
let stagingTestsTable: Array<TestParameters> = [];
let regressionTestsTable: Array<TestParameters> = [];

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
const traceExtraction = false;

const extractLog = traceExtraction ? (...args : any) => console.log(...args) : () => { ; };

// Retrieve TXs from staging and regression
console.log("(serialization.test.ts) Reading transactions from regression...");

regressionTransactionInfos = retrieveTxsFromDir(regressionPath);
// We add all the regression transaction hashes to a set
regressionTransactionInfos.forEach((info) => regressionTransactionHashes.add(info.hash));

console.log("(serialization.test.ts) Reading transactions from staging...")

if (!fs.existsSync(stagingPath)) {
  console.log("(serialization.test.ts) Staging path does not exist! Run get_transactions.ts to create it");
  exit(-1);
}

stagingTransactionInfos = retrieveTxsFromDir(stagingPath);
// We filter out all transactions that are already covered in the regression suite
stagingTransactionInfos = stagingTransactionInfos.filter((info) => !regressionTransactionHashes.has(info.hash))

console.log("(serialization.test.ts) All transactions read.")

// Build test tables
console.log("(serialization.test.ts) Building staging test table...")

stagingTestsTable = buildTestTable(stagingTransactionInfos);

console.log(`(serialization.test.ts) Staging tests: ${stagingTestsTable.length}`)

console.log("(serialization.test.ts) Building regression test table...")

regressionTestsTable = buildTestTable(regressionTransactionInfos);

console.log(`(serialization.test.ts) Regression tests: ${regressionTestsTable.length}`)

console.log("(serialization.test.ts) Tests tables prepared.")

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
      let tag: number  = value.kind().valueOf();
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
      for (let index = 0; index < value.len(); index++) {
        const {sub: elemValue, subPath: newComponentPath } = getElem(value, index, `${key}[${index}]`, schema.item, componentPath);
        if (elemValue && schemata[schema.item]) {
          extractLog(`Elem index: ${index}\nElem type: ${schema.item}\nPath: ${newComponentPath}`);
          let grandchildren = [];
          explodeValue(`${key}[${index}]`, elemValue, schemata[schema.item], schemata, grandchildren, newComponentPath)
          children.push({ type: schema.item, key: key, path: newComponentPath, children: grandchildren, cbor: elemValue.to_bytes(), failed: false});
        }
      }
      break;
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
// We export the failing components to a CSV file, so we create the reports
// directory if it doesn't exit.
try {
  fs.mkdirSync("tests/reports")
} catch(_err) {
  console.log("(serialization.test.ts) Failed to create reports directory");
  console.log("(serialization.test.ts) Skipping dir creation...")
};

const reportFile: number = fs.openSync("tests/reports/serialization_failed_classes.csv", "w");
fs.writeSync(reportFile, "Test N.,TX hash,Class,Component Path,Failure reason,Expected,Obtained\n");

describe("roundtrip", () => {
  // Used for debugging 
  // let testN = 0;
  // test.skip(`Test N. ${testN}`, () => {
  //   console.log(Buffer.from(testsTable[testN].component.cbor).toString('hex'));
  //   let class_key = testsTable[testN].component.type as keyof (typeof Out);
  //   let deserialized = (Out[class_key] as any).from_bytes(testsTable[testN].component.cbor);
  //   let serialized = deserialized.to_bytes();
  //   expect(serialized).toStrictEqual(testsTable[testN].component.cbor);
  // })

  describe("staging", () => {
    test.each(stagingTestsTable)("($componentIndex) TX $txCount ($txHashAbbrev)\n\tComponent $component.path ($component.type) ", (params) => {
      let class_key = params.component.type as keyof (typeof Out);

      // We skip testing if any descendant failed the test
      const childFailed = params.component.children.some((child) => child.failed)
      if (childFailed) {
        params.component.failed = true;
        writeChildErrorReport(reportFile, params);
        expect(childFailed).toBeFalsy(); // used to skip the other check at the end
      }

      // We manually test things first to generate the reports.
      try {
        const result: Uint8Array = roundtrip(Out[class_key], params.component.cbor);      
        // if it doesn't match the expected CBOR, we record it in the report file
        if (!(Buffer.compare(result, params.component.cbor) == 0)) {
          params.component.failed = true;
          writeRoundtripErrorReport(reportFile, params, result);
          addToRegressionSuite(params);
        }
      } catch(err) {
        // if it throws, we record it in the report file
        params.component.failed = true;
        writeExceptionReport(reportFile, params, err);
        addToRegressionSuite(params);
      }
      // Now we run the actual jest tests
      expect(roundtrip(Out[class_key], params.component.cbor)).toEqual(params.component.cbor);
    });
  })

  describe("regression", () => {
    test.each(regressionTestsTable)("($componentIndex) TX $txCount ($txHashAbbrev)\n\tComponent $component.path ($component.type) ", (params) => {
      let class_key = params.component.type as keyof (typeof Out);

      const childFailed = params.component.children.some((child) => child.failed)
      if (childFailed) {
        params.component.failed = true;
        writeChildErrorReport(reportFile, params);
        expect(childFailed).toBeFalsy();
      }

      try {
        const result: Uint8Array = roundtrip(Out[class_key], params.component.cbor);      
        if (!(Buffer.compare(result, params.component.cbor) == 0)) {
          params.component.failed = true;
          writeRoundtripErrorReport(reportFile, params, result);
        }
      } catch(err) {
        params.component.failed = true;
        writeExceptionReport(reportFile, params, err);
      }
      expect(roundtrip(Out[class_key], params.component.cbor)).toEqual(params.component.cbor);
    });
  })

});

// might throw exceptions!
function roundtrip(someClass: any, cbor: Uint8Array): Uint8Array {
    let deserialized = someClass.from_bytes(cbor);
    return deserialized.to_bytes();
}

function retrieveTxsFromDir(path: string): Array<TransactionInfo> {
  let files: Array<string> = fs.readdirSync(path);
  // filter out hidden files
  const matchHidden = /^\.\w+/
  files = files.filter((path) => !path.match(matchHidden));

  let tinfos: Array<TransactionInfo> = [];
  for (const file of files) {
    const fileRegex = /(?<idx>[0-9]{3})-(?<hash>[0123456789abcdef]+)\.cbor/;
    const match = file.match(fileRegex);
    if (!match || !match.groups || !match.groups["hash"]) {
      console.log(`(serialization.test.ts) Failed to parse filename: ${file}`);
      exit(-1);
    } else {
      const cbor = fs.readFileSync(`${path}/${file}`, { encoding: "utf-8"});
      tinfos.push({"hash": match.groups["hash"], "cbor": cbor})
    }
  }
  return tinfos;
}

function buildTestTable(infos: Array<TransactionInfo>): Array<TestParameters> {
  let componentIndex = 0;
  let testTable: Array<TestParameters> = [];
  for (const [index, info] of infos.entries()) {
    extractLog(`(serialization.test.ts) Decomposing TX ${info.hash}`)
    let tx = csl.Transaction.from_hex(info.cbor);
    transactionsCsl.push(tx);
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

function depthFirstTraversal(c: Component, acc: Array<Component>): void {
  for (const child of c.children) {
    depthFirstTraversal(child, acc);
  }
  acc.push(c);
}

function writeExceptionReport(reportFile: number, params: TestParameters, err: any): void {
  fs.writeSync(reportFile, `${params.componentIndex},${params.txHashAbbrev},${params.component.type},${params.component.path},Throws exception: '${err}',,\n`);
}

function writeRoundtripErrorReport(reportFile: number, params: TestParameters, result: Uint8Array): void {
  fs.writeSync(reportFile, `${params.componentIndex},${params.txHashAbbrev},${params.component.type},${params.component.path},Roundtrip fails,${params.component.cbor},${result}\n`);
}

function writeChildErrorReport(reportFile: number, params: TestParameters): void {
  fs.writeSync(reportFile, `${params.componentIndex},${params.txHashAbbrev},${params.component.type},${params.component.path},Child fails roundtrip,,\n`);
}

function addToRegressionSuite(params: TestParameters): void {
  if (!regressionTransactionHashes.has(params.txHash)) {
    fs.writeFileSync(
        `${regressionPath}/${regressionTransactionHashes.size.toString().padStart(3, "0")}-${params.txHash}.cbor`
        , stagingTransactionInfos[params.txCount].cbor
    );
    regressionTransactionHashes.add(params.txHash);
  }
}
