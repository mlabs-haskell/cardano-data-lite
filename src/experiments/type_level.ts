import { assert, Equals } from "tsafe/assert";

// Primitives

type Length = 0 | 8 | 16 | 32 | 64;
type ListLength = Length | "indefinite";

type Item =
	| UInt<any>
	| NegInt<any>
	| ByteString<any>
	| TextString<any>
	| CBORArray<any, any>
	| CBORMap<any, any>;

type UInt<N extends Length> = ["UInt", N];
type NegInt<N extends Length> = ["NegInt", N];

type ByteString<N extends ListLength> = ["ByteString", N];
type TextString<N extends ListLength> = ["TextString", N];

// Compounds

type CBORArray<N extends ListLength, T extends ([string, Item])[]> = ["Array", N, T];

type CBORMap<
	N extends ListLength,
	T extends [string, [string | number, Item]][]
> = ["Map", N, T];

// JSValue ------------------------------------------------------------------------

type JSValue<T>
	= T extends UInt<any> ? bigint
	: T extends NegInt<any> ? bigint
	: T extends ByteString<any> ? Uint8Array
	: T extends TextString<any> ? string
	: T extends CBORArray<any, infer U> ? JSArrayValue<U>
	: T extends CBORMap<any, infer U> ? JSMapValue<U>
	: never;

type JSArrayValue<T> =
	T extends [infer First, ...infer Rest] ?
	First extends [infer Key, infer Value] ?
	Key extends string ? {
		[key in Key]: JSValue<Value>
	} & JSArrayValue<Rest>
	: never
	: never
	: {};

type JSMapValue<T> =
	T extends [infer First, ...infer Rest] ?
	First extends [infer Key, infer Group] ?
	Key extends string ?
	Group extends [any, infer Value] ?
	{
		[key in Key]: JSValue<Value>
	} & JSArrayValue<Rest>
	: never
	: never
	: never
	: {};


assert<
	Equals<
		JSValue<CBORArray<0, [["foo", UInt<0>], ["bar", UInt<0>]]>>,
		{ foo: bigint, bar: bigint }
	>
>();

// --------------------------------------------------------------------------------

function jsValue<T extends Item>(cbor: T): JSValue<T>;
function jsValue<T extends Item>(cbor: Readonly<T>) {
	switch (cbor[0]) {
		case "UInt": return 2n;
		case "NegInt": return 2n;
		case "ByteString": return new Uint8Array();
		case "TextString": return "";
		case "Array": return {};
		case "Map": return [];
	}
}


