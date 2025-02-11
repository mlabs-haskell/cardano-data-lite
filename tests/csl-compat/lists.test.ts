import { describe, test, expect } from "@jest/globals";
import * as CSL from "@emurgo/cardano-serialization-lib-nodejs-gc";
import * as CDL from "../../src/generated";

describe("TransactionMetadatumLabels", () => {
    let csl = CSL.TransactionMetadatumLabels.new();
    csl.add(CSL.BigNum.one());

    let cdl = CDL.TransactionMetadatumLabels.new();
    cdl.add(CDL.BigNum.one());

    test("serialize", () => {
        expect(cdl.to_hex()).toStrictEqual(csl.to_hex());
    });

    test("deserialize", () => {
        let cdl2 = CDL.PlutusList.from_hex(csl.to_hex());
        expect(cdl2.to_hex()).toStrictEqual(csl.to_hex());
    });
})