import { describe, expect, test } from "@jest/globals";
import * as CSL from "@emurgo/cardano-serialization-lib-nodejs";
import * as CDL from "../src/generated/out";
import * as hex from "../src/hex";

describe("BigInt", () => {
  let values = [
    "1234",
    "12345678",
    "123456789012",
    "999999999999999999",
    "9999999999999999999999",
    "99999999999999999999999999999999999999999999",
    "999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999",
  ];
  for (let s of values) {
    test(s, () => {
      let a = CSL.BigInt.from_str(s);
      let b = CDL.BigInt.from_str(s);
      expect(b.to_str()).toEqual(a.to_str());
      expect(b.to_hex()).toEqual(a.to_hex());
    });
  }
});

describe("Hex", () => {
  let values = [
    "34ec685a02a8612b877aaa414e5aa0acf0bf4a8ed570737e6bdd6d84d3b5cf80",
  ];
  for (let s of values) {
    test(s, () => expect(hex.bytesToHex(hex.hexToBytes(s))).toEqual(s));
  }
});

describe("TransactionHash", () => {
  let values = [
    "34ec685a02a8612b877aaa414e5aa0acf0bf4a8ed570737e6bdd6d84d3b5cf80",
  ];
  for (let s of values) {
    test(s, () => {
      let cdl = CDL.TransactionHash.from_hex(s);
      let csl = CSL.TransactionHash.from_hex(s);

      expect(cdl.to_hex()).toEqual(csl.to_hex());

      expect(cdl.to_bech32("foo")).toEqual(csl.to_bech32("foo"));
      expect(
        CDL.TransactionHash.from_bech32(cdl.to_bech32("foo")).to_hex(),
      ).toEqual(s);
    });
  }
});
