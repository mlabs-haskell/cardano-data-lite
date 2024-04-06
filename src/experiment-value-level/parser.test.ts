import { test, expect } from "@jest/globals";
import { getBase, parse } from "./parser";
const EXAMPLES = [
	[new Map([["hello", "world"]]), "a16568656c6c6f65776f726c64"],
	[[1n, 2n, "ASD"], "83010263415344"],
	[false, "f4"],
	[true, "f5"],
	[null, "f6"],
	[1.6, "fb3ff999999999999a"]
] as const;

test("examples", function() {
	for (let [js, cborHex] of EXAMPLES) {
		let bytes = Uint8Array.from(Buffer.from(cborHex, "hex"));
		let [out, _] = parse(bytes);
		expect(out).toEqual(js)
	}
});

test("getBase", () => {
	expect(getBase(0x00)).toEqual(0x00);
	expect(getBase(0x05)).toEqual(0x00);
	expect(getBase(0x10)).toEqual(0x00);
	expect(getBase(0x1F)).toEqual(0x00);

	expect(getBase(0x20)).toEqual(0x20);
	expect(getBase(0x25)).toEqual(0x20);
	expect(getBase(0x30)).toEqual(0x20);
	expect(getBase(0x3F)).toEqual(0x20);
});
