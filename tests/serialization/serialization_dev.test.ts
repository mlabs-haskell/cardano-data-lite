import fs from "node:fs";
import { RoundtripTestParameters, TransactionInfo } from "../test_types"; 
import { test } from "@jest/globals";
import * as Out from "../../src/generated.ts"
import { buildTestTable, retrieveTxsFromDir, roundtrip} from "./serialization_utils.ts";

// Locations for retrieved transactions
const devPath = "tests/reports/dev.txt";
const regressionPath  = "tests/serialization/regression";

// The transaction information obtained from get_transactions
let regressionTransactionInfos: Array<TransactionInfo> = [];

// Array of parameters for the test function
let devTestsTable: Array<RoundtripTestParameters> = [];

// Retrieve TX hashes to test
const devTxt = fs.readFileSync(devPath, {"encoding": "utf8"}); 
const abbrevHashes = new Set(devTxt.trimEnd().split('\n'));

// Retrieve TXs from regression
console.log("(serialization.test.ts) Reading transactions from regression...");

regressionTransactionInfos = retrieveTxsFromDir(regressionPath);
regressionTransactionInfos = regressionTransactionInfos.filter((tinfo) => abbrevHashes.has(tinfo.hash.slice(0, 8)));
console.log("(serialization.test.ts) All transactions read.")

// Build test tables
console.log("(serialization.test.ts) Building staging test table...")

devTestsTable = buildTestTable(regressionTransactionInfos);

console.log(`(serialization.test.ts) Regressions tests: ${regressionTransactionInfos.length}`)

console.log("(serialization.test.ts) Tests table prepared.")

describe("roundtrip", () => {
  describe("dev", () => {
    test.each(devTestsTable)("($txHashAbbrev)\n\tComponent $component.path ($component.type) ", (params) => {
      let class_key = params.component.type as keyof (typeof Out);

      // We skip testing if any descendant failed the test
      const childFailed = params.component.children.some((child) => child.failed)
      if (childFailed) {
        params.component.failed = true;
        expect(childFailed).toBeFalsy(); // used to skip the other check at the end
      }

      // We manually test things first to generate the reports.
      try {
        const result: Uint8Array = roundtrip(Out[class_key], params.component.cbor);      
        // if it doesn't match the expected CBOR, we record it in the report file
        if (!(Buffer.compare(result, params.component.cbor) == 0)) {
          params.component.failed = true;
        }
      } catch(err) {
        // if it throws, we record it in the report file
        params.component.failed = true;
      }
      // Now we run the actual jest tests
      expect(roundtrip(Out[class_key], params.component.cbor)).toEqual(params.component.cbor);
    });
  })
});
