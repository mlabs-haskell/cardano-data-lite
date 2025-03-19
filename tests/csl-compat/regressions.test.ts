import { describe, test, expect } from "@jest/globals";
import * as CSL from "@emurgo/cardano-serialization-lib-nodejs-gc";
import * as CDL from "../../src";
import { hexToBytes } from "../../src/lib/hex";

describe("PlutusData Hash regression", () => {
  let fixture1 = (lib: typeof CSL) =>
    lib.PlutusData.new_list(lib.PlutusList.new());
  let fixture2 = (lib: typeof CSL) => {
    let l = lib.PlutusList.new();
    l.add(fixture1(lib));
    return lib.PlutusData.new_list(l);
  };
  let fixture3 = (lib: typeof CSL) =>
    lib.PlutusData.new_bytes(
      hexToBytes("30fb3b8539951e26f034910a5a37f22cb99d94d1d409f69ddbaea971"),
    );
  let fixture4 = (lib: typeof CSL) => {
    let l = lib.PlutusList.new();
    l.add(fixture2(lib));
    l.add(fixture3(lib));
    return lib.PlutusData.new_constr_plutus_data(
      lib.ConstrPlutusData.new(lib.BigNum.one(), l),
    );
  };
  let fixture5 = (lib: typeof CSL) =>
    lib.PlutusData.new_integer(lib.BigInt.from_str("42"));
  let fixture6 = (lib: typeof CSL) => {
    let l = lib.PlutusMap.new();
    let v1 = lib.PlutusMapValues.new();
    v1.add(fixture2(lib));
    l.insert(fixture1(lib), v1);

    let v2 = lib.PlutusMapValues.new();
    v2.add(fixture4(lib));
    l.insert(fixture3(lib), v2);

    return lib.PlutusData.new_map(l);
  };

  let fixture7 = (lib: typeof CSL) => {
    let l = lib.PlutusList.new();
    l.add(fixture1(lib));
    l.add(fixture2(lib));
    l.add(fixture3(lib));
    l.add(fixture4(lib));
    l.add(fixture5(lib));
    l.add(fixture6(lib));
    return lib.PlutusData.new_list(l);
  };
  let cdl = fixture7(CDL as any);
  let csl = fixture7(CSL);

  test("serialize", () => {
    expect(cdl.to_hex()).toStrictEqual(csl.to_hex());
  });

  test("deserialize", () => {
    let cdl2 = CDL.PlutusData.from_hex(csl.to_hex());
    expect(cdl2.to_hex()).toStrictEqual(csl.to_hex());
  });

  test("hash", () => {
    expect(CDL.hash_plutus_data(cdl as any).to_hex()).toStrictEqual(
      CSL.hash_plutus_data(csl).to_hex(),
    );
  });

  test("hash against precalculated: CDL", () => {
    expect(CDL.hash_plutus_data(cdl as any).to_hex()).toBe(
      "0ba47e574456db8938e56f889d4c30099256f96008e0d4b6c4688f47ec342c9d",
    );
  });

  test("hash against precalculated: CDL", () => {
    expect(CSL.hash_plutus_data(csl as any).to_hex()).toBe(
      "0ba47e574456db8938e56f889d4c30099256f96008e0d4b6c4688f47ec342c9d",
    );
  });
});
