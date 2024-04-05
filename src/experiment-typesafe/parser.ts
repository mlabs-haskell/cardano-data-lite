import { Equals, assert } from "tsafe/assert";
import { ByteString, CBORArray, CBORStructArray, Item, JSValue, NegInt, TextString, UInt } from "./schema"

// WIP: This doesn't compile
function parse<T extends Item>(schema: T, stream: Uint8Array): [JSValue<T>, Uint8Array] {
	switch (schema.type) {
		case "UInt": return _parseUInt(schema, stream) as [JSValue<T>, Uint8Array];

		case "NegInt": return _parseNegInt(schema, stream) as [JSValue<T>, Uint8Array];
		case "ByteString": return _parseByteString(schema, stream) as [JSValue<T>, Uint8Array];
		case "TextString": return _parseTextString(schema, stream) as [JSValue<T>, Uint8Array];
		case "Array": return "todo" as any;
		case "Map": return "todo" as any;
	}
}

function _parseUInt(schema: UInt, stream: Uint8Array): [bigint, Uint8Array] {
	return _parseBigInt(schema, stream);
}

function _parseNegInt(schema: NegInt, stream: Uint8Array): [bigint, Uint8Array] {
	let [n, stream_] = _parseBigInt(schema, stream);
	return [-1n - n, stream_];
}

function _parseByteString(schema: ByteString | TextString, stream: Uint8Array): [Uint8Array, Uint8Array] {
	let type = stream[0];

	let base = getBase(schema);
	let type_ = type - base;

	if (!(type_ >= 0x00 && type_ <= 0x1B || type_ == 0x1F)) {
		error(schema.type, type);
	}

	if (type_ == 0x1F) {
		stream = stream.slice(1);

		let chunks: Uint8Array[] = [];
		let chunk: Uint8Array;
		while (stream[0] != 0xFF) {
			[chunk, stream] = _parseByteString(schema, stream);
			chunks.push(chunk);
		}
		return [_mergeChunks(chunks), stream];

	} else {
		let n: bigint;
		[n, stream] = _parseBigInt(schema, stream);

		let n_ = Number(n);
		let buffer = stream.slice(0, n_);
		stream = stream.slice(n_);

		return [buffer, stream];
	}
}

function _parseTextString(schema: TextString, stream: Uint8Array): [string, Uint8Array] {
	let bytes: Uint8Array;
	[bytes, stream] = _parseByteString(schema, stream);

	let str = new TextDecoder().decode(bytes);
	return [str, stream];
}

function _parseStructArray<T extends [string, Item][]>(schema: CBORStructArray<T>, stream: Uint8Array) {
	let type = stream[0];

	let base = getBase(schema);
	let type_ = type - base;

	if (!(type_ >= 0x00 && type_ <= 0x1B || type_ == 0x1F)) {
		error(schema.type, type);
	}

	if (type_ == 0x1F) {
		stream = stream.slice(1);

		// TODO
		// let elements: Uint8Array[] = [];
		// let chunk: Uint8Array;
		// for (let [itemName, itemSchema] of schema.items) {
		// 	[chunk, stream] = parse(itemSchema, stream);
		// 	chunks.push(chunk);
		// }
		// return [_mergeChunks(chunks), stream];

	} else {
		let n: bigint;
		[n, stream] = _parseBigInt(schema, stream);

		// TODO
	}
}

function _mergeChunks(chunks: Uint8Array[]): Uint8Array {
	let length = 0;
	chunks.forEach(item => {
		length += item.length;
	});

	let merged = new Uint8Array(length);

	let offset = 0;
	chunks.forEach(item => {
		merged.set(item, offset);
		offset += item.length;
	});

	return merged;
}


function _parseBigInt(schema: Item, stream: Uint8Array): [bigint, Uint8Array] {
	let type = stream[0];
	stream = stream.slice(1);

	let base = getBase(schema);
	let type_ = type - base;

	if (!(type_ >= 0x00 && type_ <= 0x1B)) {
		error(schema.type, type);
	}

	let nBytes = type_ >= 0x18 ? Math.pow(2, type_ - 0x18) : 0;

	if ("size" in schema && schema.size != null && schema.size != nBytes) {
		error(schema.type + schema.size, type);
	}

	if (type_ <= 0x17) {
		return [BigInt(type_), stream]
	}

	return [readBigInt(nBytes, stream), stream.slice(nBytes)]
}

function readBigInt(nBytes: number, stream: Uint8Array): bigint {
	let x = BigInt(0);
	for (let i = 0; i < nBytes; i++) {
		x = x << 8n;
		x += BigInt(stream[i]);
	}
	return x;
}

function getBase(schema: Item): number {
	let base: number;
	switch (schema.type) {
		case "UInt": base = 0x00; break;
		case "NegInt": base = 0x20; break;
		case "ByteString": base = 0x40; break;
		case "TextString": base = 0x60; break;
		case "Array": base = 0x80; break;
		case "Map": base = 0xA0; break;
	}
	return base;
}

function error(expected: string, received: number) {
	throw `Expected ${expected}. Received: ${received.toString(16)}`;
}

export {
	parse
}
