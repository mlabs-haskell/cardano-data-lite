import { describe, test, expect } from "@jest/globals";
import * as CSL from "@emurgo/cardano-serialization-lib-nodejs-gc";
import * as CDL from "../../src/generated";

describe("simple constr", () => {
  for (let i of [0, 1, 4, 5, 6, 7, 55, 99, 126, 127, 128, 9999]) {
    test("alt: " + i, () => {
      let csl = CSL.ConstrPlutusData.new(
        CSL.BigNum.from_str(i.toString()),
        CSL.PlutusList.new(),
      );
      let cdl = CDL.ConstrPlutusData.new(
        CDL.BigNum.from_str(i.toString()),
        CDL.PlutusList.new(),
      );
      expect(cdl.to_hex()).toStrictEqual(csl.to_hex());
    });
  }
});

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
});

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
});

describe("PlutusMap", () => {
  let csl = CSL.PlutusMap.new();
  let cslVals = CSL.PlutusMapValues.new();
  cslVals.add(CSL.PlutusData.new_integer(CSL.BigInt.zero()));
  csl.insert(CSL.PlutusData.new_integer(CSL.BigInt.one()), cslVals);

  let cdl = CDL.PlutusMap.new();
  let cdlVals = CDL.PlutusMapValues.new();
  cdlVals.add(CDL.PlutusData.new_integer(CDL.BigInt.zero()));
  cdl.insert(CDL.PlutusData.new_integer(CDL.BigInt.one()), cdlVals);

  test("serialize", () => {
    expect(cdl.to_hex()).toStrictEqual(csl.to_hex());
  });

  test("deserialize", () => {
    let cdl2 = CDL.PlutusMap.from_hex(csl.to_hex());
    expect(cdl2.to_hex()).toStrictEqual(csl.to_hex());
  });
});

describe("PlutusMap complex", () => {
  let csl = CSL.PlutusMap.new();
  csl.insert(
    CSL.PlutusData.new_list(CSL.PlutusList.new()),
    CSL.PlutusMapValues.new(),
  );

  let cdl = CDL.PlutusMap.new();
  cdl.insert(
    CDL.PlutusData.new_list(CDL.PlutusList.new()),
    CDL.PlutusMapValues.new(),
  );

  test("serialize", () => {
    expect(cdl.to_hex()).toStrictEqual(csl.to_hex());
  });

  test("deserialize", () => {
    let cdl2 = CDL.PlutusMap.from_hex(csl.to_hex());
    expect(cdl2.to_hex()).toStrictEqual(csl.to_hex());
  });
});

describe("PlutusMap multi", () => {
  let csl = CSL.PlutusMap.new();
  let cslVals = CSL.PlutusMapValues.new();
  cslVals.add(CSL.PlutusData.new_integer(CSL.BigInt.zero()));
  cslVals.add(CSL.PlutusData.new_integer(CSL.BigInt.one()));
  csl.insert(CSL.PlutusData.new_integer(CSL.BigInt.zero()), cslVals);

  let cdl = CDL.PlutusMap.new();
  let cdlVals = CDL.PlutusMapValues.new();
  cdlVals.add(CDL.PlutusData.new_integer(CDL.BigInt.zero()));
  cdlVals.add(CDL.PlutusData.new_integer(CDL.BigInt.one()));
  cdl.insert(CDL.PlutusData.new_integer(CDL.BigInt.zero()), cdlVals);

  test("serialize", () => {
    expect(cdl.to_hex()).toStrictEqual(csl.to_hex());
  });

  test("deserialize", () => {
    let cdl2 = CDL.PlutusMap.from_hex(csl.to_hex());
    expect(cdl2.to_hex()).toStrictEqual(csl.to_hex());
  });
});

describe("PlutusData", () => {
  const items: [string, CSL.PlutusData, CDL.PlutusData][] = [
    [
      "integer",
      CSL.PlutusData.new_integer(CSL.BigInt.zero()),
      CDL.PlutusData.new_integer(CDL.BigInt.zero()),
    ],
    [
      "bytes",
      CSL.PlutusData.new_bytes(new Uint8Array([1, 2, 3])),
      CDL.PlutusData.new_bytes(new Uint8Array([1, 2, 3])),
    ],
    [
      "list",
      CSL.PlutusData.new_list(CSL.PlutusList.new()),
      CDL.PlutusData.new_list(CDL.PlutusList.new()),
    ],
    [
      "map",
      CSL.PlutusData.new_map(CSL.PlutusMap.new()),
      CDL.PlutusData.new_map(CDL.PlutusMap.new()),
    ],
    [
      "constr",
      CSL.PlutusData.new_empty_constr_plutus_data(CSL.BigNum.zero()),
      CDL.PlutusData.new_empty_constr_plutus_data(CDL.BigNum.zero()),
    ],
  ];

  for (let [name, csl, cdl] of items) {
    describe(name, () => {
      test("serialize", () => {
        expect(cdl.to_hex()).toStrictEqual(csl.to_hex());
      });

      test("deserialize", () => {
        let cdl2 = CDL.PlutusData.from_hex(csl.to_hex());
        expect(cdl2.to_hex()).toStrictEqual(csl.to_hex());
      });
    });
  }
});

describe("nested constr", () => {
  let gen = (cslOrCdl: typeof CSL) => {
    let lib = cslOrCdl;

    let top = lib.PlutusList.new();

    top.add(lib.PlutusData.new_integer(lib.BigInt.one()));

    let l1 = lib.PlutusList.new();
    l1.add(lib.PlutusData.new_integer(lib.BigInt.one()));
    l1.add(lib.PlutusData.new_integer(lib.BigInt.zero()));
    top.add(lib.PlutusData.new_list(l1));

    let m1 = lib.PlutusMap.new();
    m1.insert(lib.PlutusData.new_list(l1), lib.PlutusMapValues.new());
    top.add(lib.PlutusData.new_map(m1));

    let m2 = lib.PlutusMap.new();
    let m2vals = lib.PlutusMapValues.new();
    m2vals.add(lib.PlutusData.new_map(m1));
    m2.insert(lib.PlutusData.new_list(l1), m2vals);
    top.add(lib.PlutusData.new_map(m2));

    top.add(lib.PlutusData.new_bytes(new Uint8Array([1, 2, 3])));

    return lib.ConstrPlutusData.new(lib.BigNum.zero(), top);
  };
  let cdl = gen(CDL as any);
  let csl = gen(CSL);

  test("serialize", () => {
    expect(cdl.to_hex()).toStrictEqual(csl.to_hex());
  });

  test("deserialize", () => {
    let cdl2 = CDL.ConstrPlutusData.from_hex(csl.to_hex());
    expect(cdl2.to_hex()).toStrictEqual(csl.to_hex());
  });
});
