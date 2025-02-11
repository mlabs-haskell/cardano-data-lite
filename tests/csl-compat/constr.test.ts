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

describe("PlutusList empty", () => {
    let csl = CSL.PlutusList.new();
    let cdl = CDL.PlutusList.new();

    test("serialize", () => {
        expect(cdl.to_hex()).toStrictEqual(csl.to_hex());
    });

    test("deserialize", () => {
        let cdl2 = CDL.PlutusList.from_hex(csl.to_hex());
        expect(cdl2.to_hex()).toStrictEqual(csl.to_hex());
    });
})

describe("PlutusList non-empty", () => {
    let csl = CSL.PlutusList.new();
    csl.add(CSL.PlutusData.new_integer(CSL.BigInt.one()));

    let cdl = CDL.PlutusList.new();
    cdl.add(CDL.PlutusData.new_integer(CDL.BigInt.one()));

    test("serialize", () => {
        expect(cdl.to_hex()).toStrictEqual(csl.to_hex());
    });

    test("deserialize", () => {
        let cdl2 = CDL.PlutusList.from_hex(csl.to_hex());
        expect(cdl2.to_hex()).toStrictEqual(csl.to_hex());
    });
})

