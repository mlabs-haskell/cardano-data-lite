// import { Transaction } from './generated/out';
import { BlockFrostAPI } from "@blockfrost/blockfrost-js";
import fs from "node:fs";
import type csl from '@mlabs-haskell/cardano-serialization-lib-gc';
import * as yaml from "yaml";
import { Value } from "@sinclair/typebox/value";
import { Schema } from "../conway-cddl/codegen/types";

// Set up blockfrost API
const projectId = fs.readFileSync("blockfrost-mainnet.txt", { encoding: "utf8" }).trimEnd();
const bf = new BlockFrostAPI({ projectId: projectId, network: "mainnet" });

// ids of txs to test
const transactionHashes: Array<string> = [
  'fd236cb770bf5ceb67ff9ec8478a8ae9ff9f0f84fc5db9cfec391528ac054459',
  '469a2f934ef014b55181a1282cac0fe35d041bf7c298fdca9115aafa4ab1e506',
  '0e5bc1e21e86d011f47ba2f406337e15cc8076b9c5fc0d7283e836de93bafeaf',
  'f4e2cf9b0ca03b9e344c17ddd0e2c0520830bb56b00640ce6b40deab2f3463e0',
  '4caa06fe5aa051124d58261962c88ab334136996ee1976723bae43e528bf40eb',
  '85e695c228d27c480c74cb9114e44857d9f66ec7611750f5f568a7382942c9ef',
  'b2c7b33c780ca6b4f8a7aef57b35c8c3afa066753e5c0b311e753cea98912026',
  '433927e357e1ae76f35439650045ebe0ac7701023c708c41b5fb839a5dc5a51e',
  'e72ff052f0eefb5f8d0736a896e12040ccbe090f5a2838cd2d02bb7f05eb07d9',
  '24da9e4e230e9c12fd3adb9ecdef55cfd0318df8c7e3882cb0cd892acd74e1fb'
];

// number of txs to retrieve if `transactionIds` is empty
const transactionCount: number = 10;
// transactions in hex
let transactionsHex: Array<string> = [];
// deserialized csl transactions
let transactionsCsl: Array<csl.Transaction> = [];

// Retrieve all transactions of the list (or get new ones)
beforeAll(async () => {
  if (transactionHashes.length == 0) {
    await retrieveNewTxs();
  } else {
    await retrieveTxs();
  };
  const components = explodeTx(transactionsCsl[0]);
  console.log("Components: ", components);
});

// Retrieve the required number of TXs from the latest blocks
async function retrieveNewTxs(): Promise<void> {
  let latest_block = await bf.blocksLatest();
  let hashes: Array<string> = [];
  do {
    let new_hashes = await bf.blocksTxs(latest_block.hash, { count: transactionCount - hashes.length })
    console.log(`Obtained ${new_hashes.length} TXs from block ${latest_block.hash}`)
    hashes.push(...new_hashes);
    latest_block = await bf.blocksPrevious(latest_block.hash, { count: 1 }).then((blocks) => blocks[0]);
  } while (hashes.length < transactionCount);
  console.log("Transaction hashes: ", hashes);
  return retrieveTxs();
}

// Retrieve TXs specified in `transactionHashes`
async function retrieveTxs(): Promise<void> {
  const csl = await import("@mlabs-haskell/cardano-serialization-lib-gc");
  transactionsHex = await Promise.all(transactionHashes.map((txHash) => txCbor(txHash, projectId)));
  transactionsCsl = transactionsHex.map(csl.Transaction.from_hex);
}

// We implement this manually because blockfrost-js does not provide this endpoint
async function txCbor(txHash: string, token: string): Promise<string> {
  const url = `https://cardano-mainnet.blockfrost.io/api/v0/txs/${txHash}/cbor`
  const request = new Request(url, { "headers": { "project_id": token } });
  const response = await fetch(request);
  const body = await response.json();
  return body.cbor;
}

type Component = { type: string, cbor: Uint8Array }

// Decompose a csl transaction into its constituent parts
function explodeTx(tx: csl.Transaction): Array<Component> {
  let file = fs.readFileSync(`conway-cddl/yaml/conway.yaml`, "utf8");
  let schemata = yaml.parse(file);
  let key = "Transaction"
  let value = schemata["Transaction"];
  let schema: Schema = Value.Parse(Schema, value);
  let components: Array<Component> = [];
  explodeValue(key, tx, schema, schemata, components, "tx")
  components.push({ type: key, cbor: tx.to_bytes() });
  return components;
}

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
          components.push({ type: field.type, cbor: fieldValue.to_bytes() });
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
          components.push({ type: field.type, cbor: fieldValue.to_bytes() });
        }
      }
      break;
  }
}

const typeBlacklist = new Set(["boolean", "bignum"]);
const fieldsBlacklist = new Set([
  "plutus_scripts_v1",
  "plutus_scripts_v2",
  "plutus_scripts_v3"
]);


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

test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3);
});
