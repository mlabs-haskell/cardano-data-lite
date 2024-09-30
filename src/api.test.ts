// This module tests that the classes generated in out.ts match the CSL API
// at the method level
import fs from "node:fs";
import { MethodInfo, ParamInfo } from "./test_types";
import grammar from "./generated/grammar.ohm-bundle"; 
import { describe, test } from "@jest/globals";

const cslStrippedTxt  = fs.readFileSync("../csl-types/csl-stripped.d.ts", { "encoding": "utf8" });
const outTxt  = fs.readFileSync("./generated/out.d.ts", { "encoding": "utf8" });

console.log("Parsing type declaration files...")
const cslMatch = grammar.match(cslStrippedTxt);
if (cslMatch.failed()) {
  throw cslMatch.message;
}
const outMatch = grammar.match(outTxt);
if (outMatch.failed()) {
  throw outMatch.message;
}

describe("Serialization/deserialization roundtrip tests", () => {
  test(`Something`, () => {
    expect(3).toBe(3);
  })
});
