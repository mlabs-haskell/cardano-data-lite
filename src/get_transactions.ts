import { BlockFrostAPI } from "@blockfrost/blockfrost-js";
import fs from "node:fs";
import * as csl from "@emurgo/cardano-serialization-lib-nodejs-gc";

type TransactionInfo = { hash: string, cbor: string };

// Hashes of txs to test
const transactionHashes: Array<string> = [
  'fd236cb770bf5ceb67ff9ec8478a8ae9ff9f0f84fc5db9cfec391528ac054459',
  // '469a2f934ef014b55181a1282cac0fe35d041bf7c298fdca9115aafa4ab1e506',
  // '0e5bc1e21e86d011f47ba2f406337e15cc8076b9c5fc0d7283e836de93bafeaf',
  // 'f4e2cf9b0ca03b9e344c17ddd0e2c0520830bb56b00640ce6b40deab2f3463e0',
  // '4caa06fe5aa051124d58261962c88ab334136996ee1976723bae43e528bf40eb',
  // '85e695c228d27c480c74cb9114e44857d9f66ec7611750f5f568a7382942c9ef',
  // 'b2c7b33c780ca6b4f8a7aef57b35c8c3afa066753e5c0b311e753cea98912026',
  // '433927e357e1ae76f35439650045ebe0ac7701023c708c41b5fb839a5dc5a51e',
  // 'e72ff052f0eefb5f8d0736a896e12040ccbe090f5a2838cd2d02bb7f05eb07d9',
  // '24da9e4e230e9c12fd3adb9ecdef55cfd0318df8c7e3882cb0cd892acd74e1fb'
];
// number of txs to retrieve if `transactionIds` is empty
const transactionCount: number = 10;

// Set up blockfrost API
const projectId = fs.readFileSync("blockfrost-mainnet.txt", { encoding: "utf8" }).trimEnd();
const bf = new BlockFrostAPI({ projectId: projectId, network: "mainnet" });

async function main(): Promise<void> {
  console.log("(get_transactions) Starting");
  // transactions in hex
  let transactionsHex: Array<string> = [];

  if (transactionHashes.length == 0) {
      transactionsHex = await retrieveNewTxs();
  } else {
      transactionsHex = await retrieveTxs();
  };

  let fd = fs.openSync("transaction_fifo", "w");
  for (const [index, cbor] of transactionsHex.entries()) {
    // type TransactionInfo = { hash: string, cbor: string };
    const info: TransactionInfo = { hash: transactionHashes[index], cbor: cbor };
    fs.writeSync(fd, `${JSON.stringify(info)}\n`);
  }
  console.log("(get_transactions) Finished writing to FIFO. Closing it.")
  fs.closeSync(fd);
  console.log("(get_transactions) FIFO closed. Exiting.")
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
