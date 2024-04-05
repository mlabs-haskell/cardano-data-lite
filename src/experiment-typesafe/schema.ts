import { assert, Equals } from "tsafe/assert";

// Primitives

type NBytes = 0 | 1 | 2 | 4 | 8;

type Item =
	| UInt
	| NegInt
	| ByteString
	| TextString
	| CBORArray<any>
	| CBORMap<any, any>
	| CBORStructArray<any>
	| CBORStructMap<any>;

type UInt = { type: "UInt", size: NBytes | null }
type NegInt = { type: "NegInt", size: NBytes | null };

type ByteString = { type: "ByteString" };
type TextString = { type: "TextString" };

// Compounds

type CBORArray<T extends Item> = { type: "Array", itemType: T, minSize?: number, maxSize?: number };

type CBORMap<K extends Item, V extends Item> = { type: "Map", keyType: K, valueType: V, minSize?: number, maxSize?: number };

type CBORStructArray<T extends ([string, Item])[]> = { type: "StructArray", items: T };

type CBORStructMap<T extends [string, [string | number, Item]][]> = {
	type: "StructMap", items: T
};

// JSValue ------------------------------------------------------------------------

type JSValue<T>
	= T extends UInt ? bigint
	: T extends NegInt ? bigint
	: T extends ByteString ? Uint8Array
	: T extends TextString ? string
	: T extends CBORArray<infer U> ? U[]
	: T extends CBORMap<infer K, infer V> ? Map<K, V>
	: T extends CBORStructArray<infer U> ? JSArrayStruct<U>
	: T extends CBORStructMap<infer U> ? JSMapStruct<U>
	: never;

type JSArrayStruct<T> =
	T extends [infer First, ...infer Rest] ?
	First extends [infer Key, infer Value] ?
	Key extends string ? {
		[key in Key]: JSValue<Value>
	} & JSArrayStruct<Rest>
	: never
	: never
	: {};

type JSMapStruct<T> =
	T extends [infer First, ...infer Rest] ?
	First extends [infer Key, infer Group] ?
	Key extends string ?
	Group extends [any, infer Value] ?
	{
		[key in Key]: JSValue<Value>
	} & JSMapStruct<Rest>
	: never
	: never
	: never
	: {};

// Tests

assert<
	Equals<
		JSValue<CBORStructArray<[["foo", UInt], ["bar", UInt]]>>,
		{ foo: bigint, bar: bigint }
	>
>();

assert<
	Equals<
		JSValue<CBORStructMap<[
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
	CBORStructArray,
	CBORStructMap,
	JSValue,
}
