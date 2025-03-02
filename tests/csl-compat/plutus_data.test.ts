import { describe, test, expect } from "@jest/globals";
import * as CSL from "@emurgo/cardano-serialization-lib-nodejs-gc";
import * as CDL from "../../src";
import { hexToBytes } from "../../src/lib/hex";

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

      test("hash", () => {
        expect(CDL.hash_plutus_data(cdl).to_hex()).toStrictEqual(
          CSL.hash_plutus_data(csl).to_hex(),
        );
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

describe("bytes", () => {
  const items: [string, number[]][] = [
    ["0", []],
    ["3", [1, 2, 3]],
    [
      "64",
      [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
        56, 57, 58, 59, 60, 61, 62, 63,
      ],
    ],
    [
      "65",
      [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
        56, 57, 58, 59, 60, 61, 62, 63, 64,
      ],
    ],
    [
      "128",
      [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
        56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73,
        74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91,
        92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107,
        108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121,
        122, 123, 124, 125, 126, 127,
      ],
    ],
    [
      "129",
      [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
        56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73,
        74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91,
        92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107,
        108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121,
        122, 123, 124, 125, 126, 127, 128,
      ],
    ],
  ];

  for (let [name, bytes] of items) {
    describe(name, () => {
      const cdl = CDL.PlutusData.new_bytes(new Uint8Array(bytes));
      const csl = CSL.PlutusData.new_bytes(new Uint8Array(bytes));

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
