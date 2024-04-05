import { assert, Equals } from "tsafe/assert";

// Primitives

type NBytes = 0 | 1 | 2 | 4 | 8;

type Item =
	| UInt
	| NegInt
	| ByteString
	| TextString
	| CBORArray<any>
	| CBORMap<any>;

type UInt = { type: "UInt", size: NBytes | null }
type NegInt = { type: "NegInt", size: NBytes | null };

type ByteString = { type: "ByteString" };
type TextString = { type: "TextString" };

// Compounds

type CBORArray<T extends ([string, Item])[]> = { type: "Array", items: T };

type CBORMap<T extends [string, [string | number, Item]][]> = {
	type: "Map", items: T
};

// JSValue ------------------------------------------------------------------------

type JSValue<T>
	= T extends UInt ? bigint
	: T extends NegInt ? bigint
	: T extends ByteString ? Uint8Array
	: T extends TextString ? string
	: T extends CBORArray<infer U> ? JSArrayValue<U>
	: T extends CBORMap<infer U> ? JSMapValue<U>
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
	} & JSMapValue<Rest>
	: never
	: never
	: never
	: {};


assert<
	Equals<
		JSValue<CBORArray<[["foo", UInt], ["bar", UInt]]>>,
		{ foo: bigint, bar: bigint }
	>
>();

assert<
	Equals<
		JSValue<CBORMap<[
			["foo", ["foo1", UInt]],
			["bar", ["bar1", UInt]]
		]>>,
		{ foo: bigint, bar: bigint }
	>
>();

export type {
	Item,
	UInt,
	NegInt,
	ByteString,
	TextString,
	CBORArray,
	CBORMap,
	JSValue,
}
