type CBORItem =
	| bigint
	| string
	| Uint8Array
	| CBORItem[]
	| Map<CBORItem, CBORItem>
	| boolean
	| null
	| undefined
	| number;

function parse(stream: Uint8Array): [CBORItem, Uint8Array] {
	switch (stream[0] & 0xf0) {
		case 0x00:
		case 0x10:
			return _parseUInt(stream);
		case 0x20:
		case 0x30:
			return _parseNegInt(stream);
		case 0x40:
		case 0x50:
			return _parseByteString(stream);
		case 0x60:
		case 0x70:
			return _parseTextString(stream);
		case 0x80:
		case 0x90:
			return _parseArray(stream);
		case 0xa0:
		case 0xb0:
			return _parseMap(stream);
		case 0xf0:
			switch (stream[0] & 0x0f) {
				case 0x04:
					return [false, stream.slice(1)]
				case 0x05:
					return [true, stream.slice(1)]
				case 0x06:
					return [null, stream.slice(1)]
				case 0x07:
					return [undefined, stream.slice(1)]
				case 0x09:
				case 0x0a:
				case 0x0b:
					return _parseFloat(stream);
			}
		default:
			throw "Unknown type byte: " + stream[0].toString(16);
	}
}

function _parseUInt(stream: Uint8Array): [bigint, Uint8Array] {
	return _parseBigInt("UInt", stream);
}

function _parseNegInt(stream: Uint8Array): [bigint, Uint8Array] {
	let [n, stream_] = _parseBigInt("NegInt", stream);
	return [-1n - n, stream_];
}

function __parseByteString(
	schema: string,
	stream: Uint8Array
): [Uint8Array, Uint8Array] {
	let type = stream[0];

	let base = getBase(type);
	let type_ = type - base;

	if (!((type_ >= 0x00 && type_ <= 0x1b) || type_ == 0x1f)) {
		error(schema, type);
	}

	if (type_ == 0x1f) {
		stream = stream.slice(1);

		let chunks: Uint8Array[] = [];
		let chunk: Uint8Array;
		while (stream[0] != 0xff) {
			[chunk, stream] = __parseByteString(schema, stream);
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
function _parseByteString(stream: Uint8Array): [Uint8Array, Uint8Array] {
	return __parseByteString("ByteString", stream);
}

function _parseTextString(stream: Uint8Array): [string, Uint8Array] {
	let bytes: Uint8Array;
	[bytes, stream] = __parseByteString("TextString", stream);

	let str = new TextDecoder().decode(bytes);
	return [str, stream];
}

function _parseArray(stream: Uint8Array): [CBORItem[], Uint8Array] {
	let type = stream[0];

	let base = getBase(type);
	let type_ = type - base;

	if (!((type_ >= 0x00 && type_ <= 0x1b) || type_ == 0x1f)) {
		error("Array", type);
	}

	let array: CBORItem[] = [];
	let item: CBORItem;

	if (type_ == 0x1f) {
		stream = stream.slice(1);

		while (stream[0] != 0xFF) {
			[item, stream] = parse(stream);
			array.push(item);
		}
	} else {
		let n: bigint;
		[n, stream] = _parseBigInt("Array", stream);

		let n_ = Number(n);

		for (let i = 0; i < n_; i++) {
			[item, stream] = parse(stream);
			array.push(item);
		}
	}

	return [array, stream];
}

function _parseMap(stream: Uint8Array): [Map<CBORItem, CBORItem>, Uint8Array] {
	let type = stream[0];

	let base = getBase(type);
	let type_ = type - base;

	if (!((type_ >= 0x00 && type_ <= 0x1b) || type_ == 0x1f)) {
		error("Map(" + base.toString(16) + ")", type);
	}

	let map: Map<CBORItem, CBORItem> = new Map();
	let key: CBORItem;
	let val: CBORItem;
	if (type_ == 0x1f) {
		stream = stream.slice(1);

		while (stream[0] != 0xFF) {
			[key, stream] = parse(stream);
			[val, stream] = parse(stream);
			map.set(key, val);
		}

	} else {

		let n: bigint;
		[n, stream] = _parseBigInt("Map", stream);

		let n_ = Number(n);

		for (let i = 0; i < n_; i++) {
			[key, stream] = parse(stream);
			[val, stream] = parse(stream);
			map.set(key, val);
		}
	}

	return [map, stream];
}

function _parseFloat(stream: Uint8Array): [number, Uint8Array] {
	let view = new DataView(stream.buffer);
	switch (stream[0]) {
		case 0xf9:
			throw "Half-precision floats are unsupported";
		case 0xfa:
			return [view.getFloat32(1, false), stream.slice(5)]
		case 0xfb:
			return [view.getFloat64(1, false), stream.slice(9)]
		default:
			throw "Unreachable"
	}
}

function _mergeChunks(chunks: Uint8Array[]): Uint8Array {
	let length = 0;
	chunks.forEach((item) => {
		length += item.length;
	});

	let merged = new Uint8Array(length);

	let offset = 0;
	chunks.forEach((item) => {
		merged.set(item, offset);
		offset += item.length;
	});

	return merged;
}

function _parseBigInt(
	schema: string,
	stream: Uint8Array
): [bigint, Uint8Array] {
	let type = stream[0];
	stream = stream.slice(1);

	let base = getBase(type);
	let type_ = type - base;

	if (!(type_ >= 0x00 && type_ <= 0x1b)) {
		error(schema + "(" + base.toString(16) + ")", type);
	}

	let nBytes = type_ >= 0x18 ? Math.pow(2, type_ - 0x18) : 0;

	if (type_ <= 0x17) {
		return [BigInt(type_), stream];
	}

	return [readBigInt(nBytes, stream), stream.slice(nBytes)];
}

function readBigInt(nBytes: number, stream: Uint8Array): bigint {
	let x = BigInt(0);
	for (let i = 0; i < nBytes; i++) {
		x = x << 8n;
		x += BigInt(stream[i]);
	}
	return x;
}

function getBase(type: number): number {
	let tag = type >> 4;
	let tagRoundDown = (tag >> 1) << 1;
	let base = tagRoundDown << 4;
	return base;
}

function error(expected: string, received: number) {
	throw `Expected ${expected}. Received: ${received.toString(16)}`;
}

export { parse, getBase };
