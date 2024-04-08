import { test, expect } from "@jest/globals";
import { CBORItem, CBORItem_, getBase, parse } from "./parser";

function v<T extends CBORItem["type"], V extends CBORItem_<T>["value"]>(
  type: T,
  value: V,
  size?: number
): CBORItem_<T> {
  return { type, size, value } as CBORItem_<T>;
}

const EXAMPLES = [
  [
    v("map", new Map([[v("tstr", "hello", 0), v("tstr", "world", 0)]]), 0),
    "a16568656c6c6f65776f726c64",
  ],
  [
    v("array", [v("uint", 1n, 0), v("uint", 2n, 0), v("tstr", "ASD", 0)], 0),
    "83010263415344",
  ],
  [v("boolean", false), "f4"],
  [v("boolean", true), "f5"],
  [v("null", null), "f6"],
  [v("float", 1.6, 8), "fb3ff999999999999a"],
] as const;

test("examples", function() {
  for (let [js, cborHex] of EXAMPLES) {
    let bytes = Uint8Array.from(Buffer.from(cborHex, "hex"));
    let [out, _] = parse(bytes);
    expect(out).toEqual(js);
  }
});

test("getBase", () => {
  expect(getBase(0x00)).toEqual(0x00);
  expect(getBase(0x05)).toEqual(0x00);
  expect(getBase(0x10)).toEqual(0x00);
  expect(getBase(0x1f)).toEqual(0x00);

  expect(getBase(0x20)).toEqual(0x20);
  expect(getBase(0x25)).toEqual(0x20);
  expect(getBase(0x30)).toEqual(0x20);
  expect(getBase(0x3f)).toEqual(0x20);
});
