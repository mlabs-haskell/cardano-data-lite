import { describe, test, expect } from "@jest/globals";
import * as CSL from "@emurgo/cardano-serialization-lib-nodejs-gc";
import * as CDL from "../../src/generated";


describe("simple constr", () => {
    for (let i of [0, 1, 4, 5, 6, 7, 55, 99, 126, 127, 128, 9999]) {
        test("alt: " + i, () => {
            let csl = CSL.ConstrPlutusData.new(CSL.BigNum.from_str(i.toString()), CSL.PlutusList.new());
            let cdl = CDL.ConstrPlutusData.new(CDL.BigNum.from_str(i.toString()), CDL.PlutusList.new());
            expect(cdl.to_hex()).toStrictEqual(csl.to_hex());
        });
    }
})