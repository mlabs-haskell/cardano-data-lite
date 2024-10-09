import { BlockFrostAPI } from "@blockfrost/blockfrost-js";
import fs from "node:fs";

const stagingPath = "tests/serialization/staging";

// Hashes of txs to test. This is not normally used, but it can be handy for
// retrieving specific transactions one might be interested in.
const transactionHashes: Array<string> = [
];

// Number of txs to retrieve if `transactionIds` is empty
const transactionCount: number = 10;

// Set up blockfrost API
const projectId = fs.readFileSync("blockfrost-mainnet.txt", { encoding: "utf8" }).trimEnd();
const bf = new BlockFrostAPI({ projectId: projectId, network: "mainnet" });

// Create staging directory if it doesn't exist yet. If it exists, delete
// all files in it.
if (!fs.existsSync(stagingPath)) {
  fs.mkdirSync(stagingPath);
} else {
  fs.rmSync(stagingPath, { "recursive": true, "force": true })
  fs.mkdirSync(stagingPath);
}

async function main(): Promise<void> {
  console.log("(get_transactions) Starting");
  // transactions in hex
  let transactionsHex: Array<string> = [];

  if (transactionHashes.length == 0) {
      transactionsHex = await retrieveNewTxs();
  } else {
      transactionsHex = await retrieveTxs();
  };

  for (const [index, cbor] of transactionsHex.entries()) {
    fs.writeFileSync(`${stagingPath}/${index.toString().padStart(3, "0")}-${transactionHashes[index]}.cbor`, cbor);
  }
  console.log("(get_transactions) Finished writing transactions to staging")
}

// Retrieve the required number of TXs from the latest blocks
async function retrieveNewTxs(): Promise<Array<string>> {
  let latest_block = await bf.blocksLatest();
  do {
    let new_hashes = await bf.blocksTxs(latest_block.hash, { count: transactionCount - transactionHashes.length })
    console.log(`(get_transactions) Obtained ${new_hashes.length} TXs from block ${latest_block.hash}`)
    transactionHashes.push(...new_hashes);
    latest_block = await bf.blocksPrevious(latest_block.hash, { count: 1 }).then((blocks) => blocks[0]);
  } while (transactionHashes.length < transactionCount);
  return retrieveTxs();
}

// Retrieve TXs specified in `transactionHashes`
async function retrieveTxs(): Promise<Array<string>> {
  return Promise.all(transactionHashes.map((txHash) => txCbor(txHash, projectId)));
}

// We implement this manually because blockfrost-js does not provide this endpoint
async function txCbor(txHash: string, token: string): Promise<string> {
  const url = `https://cardano-mainnet.blockfrost.io/api/v0/txs/${txHash}/cbor`
  const request = new Request(url, { "headers": { "project_id": token } });
  const response = await fetch(request);
  const body = await response.json();
  return body.cbor;
}

main();
