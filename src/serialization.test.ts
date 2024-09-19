import fs from "node:fs";
import * as csl from "@emurgo/cardano-serialization-lib-nodejs-gc";
import * as yaml from "yaml";
import { Value } from "@sinclair/typebox/value";
import { Schema } from "../conway-cddl/codegen/types";
import { test } from "@jest/globals";
import * as Out from "./generated/out"

// Each component of a transaction is identified by its type and its location
// in the transaction ('path').
type Component = { type: string, path: string, cbor: Uint8Array }
// Each test is made of a transaction and an array of extracted components to test
type TestParameters = { txCount: number, txHash: string, component: Component }
// The transaction info as provided by get_transactions.ts
type TransactionInfo = { hash: string, cbor: string };

// The transaction information obtained from get_transactions
let transactionInfos: Array<TransactionInfo> = [];
// array of parameters for the test function
let testsTable: Array<TestParameters> = [];

// Types we are not interested in (or that are not supported)
const typeBlacklist = new Set(["boolean", "bignum"]);
// Unsupported fields
const fieldsBlacklist = new Set([
  "plutus_scripts_v1",
  "plutus_scripts_v2",
  "plutus_scripts_v3"
]);

// Retrieve TXs from FIFO...
console.log("(serialization.test.ts) Reading transactions from get_transactions...")
const transactionInfoText = fs.readFileSync("transaction_fifo", { "encoding": "utf8" });
for (const chunk of transactionInfoText.trimEnd().split('\n')) {
  let transactionInfo: TransactionInfo = JSON.parse(chunk);
  transactionInfos.push(transactionInfo);
}
console.log("(serialization.test.ts) All transactions read.")

// Build tests table
console.log("(serialization.test.ts) Building tests table...")
for (const [index, txInfo] of transactionInfos.entries()) {
  let tx = csl.Transaction.from_hex(txInfo.cbor);
  const components = explodeTx(tx)
  for (const component of components) {
    testsTable.push({
      txCount: index
      , txHash: txInfo.hash
      , component: component
    });
  }
}
console.log("(serialization.test.ts) Tests table prepared.")

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
  console.log(`Key: ${key}, Type: ${schema.type}`);
  switch (schema.type) {
    case "record":
      for (const field of schema.fields) {
        const fieldValue = getField(value, field.name, field.type);
        if (fieldValue && schemata[field.type]) {
          const newComponentPath = updatePath(componentPath, field.name, field.nullable);
          console.log(`Field name: ${field.name}\nField type: ${field.type}\nPath: ${newComponentPath}`);
          explodeValue(field.name, fieldValue, schemata[field.type], schemata, components, newComponentPath)
          components.push({ type: field.type, path: newComponentPath, cbor: fieldValue.to_bytes() });
        }
      }
      break;
    case "struct":
      for (const field of schema.fields) {
        const fieldValue = getField(value, field.name, field.type);
        if (fieldValue && schemata[field.type]) {
          const newComponentPath = updatePath(componentPath, field.name, field.optional);
          console.log(`Field name: ${field.name}\nField type: ${field.type}\nPath: ${newComponentPath}`);
          explodeValue(field.name, fieldValue, schemata[field.type], schemata, components, newComponentPath)
          components.push({ type: field.type, path: newComponentPath, cbor: fieldValue.to_bytes() });
        }
      }
      break;
  }
}

function getField(value: any, fieldName: string, fieldType: string): any | undefined {
  console.log("getField: ", fieldName);
  if (typeBlacklist.has(fieldType) || fieldsBlacklist.has(fieldName)) {
    return undefined;
  }
  return value[fieldName]();
}

function updatePath(componentPath: string, fieldName: string, optional: boolean | undefined): string {
  return optional ? `${componentPath}["${fieldName}"]()?` : `${componentPath}["${fieldName}"]()`
}

describe("Serialization/deserialization roundtrip tests", () => {
  test.each(testsTable)("TX $txCount ($txHash)\n\tComponent $component.path ($component.type) ", (params) => {
    let class_key = params.component.type as keyof (typeof Out);
    let deserialized = (Out[class_key] as any).from_bytes(params.component.cbor);
    let serialized = deserialized.to_bytes();
    expect(serialized).toBe(params.component.cbor);
  });
});
