// This module tests that serialization-deserialization of all transaction
// components in cardano-data-list match CSL at the byte level.
import fs from "node:fs";
import { RoundtripTestParameters, TransactionInfo } from "../test_types"; 
import { test } from "@jest/globals";
import * as Out from "../../src/generated.ts"
import { exit } from "node:process";
import { buildTestTable, retrieveTxsFromDir, roundtrip, writeChildErrorReport, writeExceptionReport, writeRoundtripErrorReport } from "./serialization_utils.ts";

// Locations for retrieved transactions
const stagingPath = "tests/serialization/staging";
const regressionPath  = "tests/serialization/regression";

// The transaction information obtained from get_transactions
let stagingTransactionInfos: Array<TransactionInfo> = [];
let regressionTransactionInfos: Array<TransactionInfo> = [];

// This set may grow during testing when transactions are moved from staging
// to regression.
let regressionTransactionHashes: Set<string> = new Set();

// Arrays of parameters for the test function
let stagingTestsTable: Array<RoundtripTestParameters> = [];
let regressionTestsTable: Array<RoundtripTestParameters> = [];

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

const testN = 237;
const params = regressionTestsTable[testN];
describe("roundtrip", () => {
  // test(`(debug) ${params.component.path}`, () => {
  //   let class_key = params.component.type as keyof (typeof Out);

  //   // We skip testing if any descendant failed the test
  //   const childFailed = params.component.children.some((child) => child.failed)
  //   if (childFailed) {
  //     params.component.failed = true;
  //     throw "Child fails roundtrip"; // used to skip the other check at the end
  //   }

  //   // We manually test things first to generate the reports.
  //   try {
  //     const result: Uint8Array = roundtrip(Out[class_key], params.component.cbor);      
  //     // if it doesn't match the expected CBOR, we record it in the report file
  //     if (!(Buffer.compare(result, params.component.cbor) == 0)) {
  //       params.component.failed = true;
  //     }
  //   } catch(err) {
  //     // if it throws, we record it in the report file
  //     params.component.failed = true;
  //   }
  //   // Now we run the actual jest tests
  //   expect(roundtrip(Out[class_key], params.component.cbor)).toEqual(params.component.cbor);
  // });

  describe("staging", () => {
    test.each(stagingTestsTable)("($componentIndex) TX $txCount ($txHashAbbrev)\n\tComponent $component.path ($component.type) ", (params) => {
      let class_key = params.component.type as keyof (typeof Out);

      // We skip testing if any descendant failed the test
      const childFailed = params.component.children.some((child) => child.failed)
      if (childFailed) {
        params.component.failed = true;
        writeChildErrorReport(reportFile, params);
        throw "Child fails roundtrip"; // used to skip the other check at the end
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
        throw "Child fails roundtrip";
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

function addToRegressionSuite(params: RoundtripTestParameters): void {
  if (!regressionTransactionHashes.has(params.txHash)) {
    fs.writeFileSync(
        `${regressionPath}/${regressionTransactionHashes.size.toString().padStart(3, "0")}-${params.txHash}.cbor`
        , stagingTransactionInfos[params.txCount].cbor
    );
    regressionTransactionHashes.add(params.txHash);
  }
}
