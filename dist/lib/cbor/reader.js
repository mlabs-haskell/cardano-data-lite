export class CBORReader {
    buffer;
    constructor(buffer) {
        this.buffer = buffer;
    }
    peekType(path) {
        let tag = this.buffer[0] >> 5;
        switch (tag) {
            case 0b000:
                return "uint";
            case 0b001:
                return "nint";
            case 0b010:
                return "bytes";
            case 0b011:
                return "string";
            case 0b100:
                return "array";
            case 0b101:
                return "map";
            case 0b110:
                return "tagged";
            case 0b111:
                switch (this.buffer[0] & 0b11111) {
                    case 20:
                    case 21:
                        return "boolean";
                    case 22:
                        return "null";
                    case 23:
                        return "undefined";
                    // case 25:
                    // TODO: Support half precision floats
                    case 26:
                    case 27:
                        return "float";
                }
        }
        let err = new CBORInvalidTag(tag);
        err.message += ` (at ${path.join("/")})`;
        throw err;
    }
    isBreak() {
        return this.buffer[0] == 0xff;
    }
    readBreak(path = []) {
        if (!this.isBreak()) {
            throw new Error(`Expected break (at ${path.join("/")})`);
        }
        this.buffer = this.buffer.slice(1);
    }
    readUint(path) {
        this.assertType(["uint"], path);
        return this.readBigInt(path);
    }
    readInt(path) {
        this.assertType(["uint", "nint"], path);
        if (this.peekType(path) == "uint") {
            return this.readBigInt(path);
        }
        else if (this.peekType(path) == "nint") {
            return -1n - this.readBigInt(path);
        }
        else {
            throw new Error(`Unreachable (at ${path.join("/")})`);
        }
    }
    // ret Uint8Array as read only reference to the source bytes
    readBytes(path) {
        this.assertType(["bytes"], path);
        return this.readByteString(path);
    }
    readString(path) {
        this.assertType(["string"], path);
        let bytes = this.readByteString(path);
        return new TextDecoder().decode(bytes);
    }
    // reads array tag and returns the length as number or null if indefinite length.
    readArrayTag(path) {
        this.assertType(["array"], path);
        return this.readLength(path);
    }
    // reads map tag and returns the length as number or null if indefinite length.
    readMapTag(path) {
        this.assertType(["map"], path);
        return this.readLength(path);
    }
    readN(n, fn) {
        for (let i = 0; i < n; i++) {
            fn(this, i);
        }
    }
    readTillBreak(fn) {
        let i = 0;
        while (!this.isBreak()) {
            fn(this, i);
            i++;
        }
        this.readBreak();
    }
    readMultiple(n, fn) {
        if (n == null)
            this.readTillBreak(fn);
        else
            this.readN(n, fn);
    }
    readArray(readItem, path) {
        let ret = [];
        const len = this.readArrayTag(path);
        this.readMultiple(len, (reader, idx) => ret.push(readItem(reader, idx)));
        return { items: ret, definiteEncoding: typeof (len) === "number" };
    }
    readMap(readItem, path) {
        let ret = [];
        this.readMultiple(this.readMapTag(path), (reader, idx) => ret.push(readItem(reader, idx)));
        return ret;
    }
    readBoolean(path) {
        this.assertType(["boolean"], path);
        let tag = this.buffer[0];
        this.buffer = this.buffer.slice(1);
        return tag == 0xf5;
    }
    readNull(path) {
        this.assertType(["null"], path);
        this.buffer = this.buffer.slice(1);
        return null;
    }
    readNullable(fn, path) {
        if (this.peekType(path) == "null") {
            this.buffer = this.buffer.slice(1);
            return null;
        }
        ;
        return fn(this);
    }
    readUndefined(path) {
        this.assertType(["undefined"], path);
        this.buffer = this.buffer.slice(1);
        return;
    }
    readFloat(path) {
        this.assertType(["float"], path);
        let tag = this.buffer[0];
        this.buffer = this.buffer.slice(1);
        let nBytes = 4;
        let float;
        if (tag == 0xfa) {
            nBytes = 4;
            float = new DataView(this.buffer.buffer).getFloat32(0, false /* false means Big Endian */);
        }
        else if (tag == 0xfb) {
            nBytes = 8;
            float = new DataView(this.buffer.buffer).getFloat64(0, false /* false means Big Endian */);
        }
        else {
            throw new Error(`Unreachable (at ${path.join("/")})`);
        }
        this.buffer = this.buffer.slice(nBytes);
        return float;
    }
    // read cbor tag and return the tag value as number
    readTaggedTag(path) {
        return Number(this.readTaggedTagAsBigInt(path));
    }
    readTaggedTagAsBigInt(path) {
        this.assertType(["tagged"], path);
        return this.readBigInt(path);
    }
    assertType(expectedTypes, path) {
        let receivedType = this.peekType(path);
        if (!expectedTypes.includes(receivedType)) {
            let err = new CBORUnexpectedType(expectedTypes, receivedType);
            err.message += ` (at ${path.join("/")})`;
            throw err;
        }
    }
    readLength(path) {
        let tag = this.buffer[0];
        let len = tag & 0b11111;
        if (len == 0x1f) {
            this.buffer = this.buffer.slice(1);
            return null;
        }
        else {
            return Number(this.readBigInt(path));
        }
    }
    readBigInt(path) {
        let tag = this.buffer[0];
        let len = tag & 0b11111;
        // the value of the length field must be between 0x00 and 0x1b
        if (!(len >= 0x00 && len <= 0x1b)) {
            let err = new CBORInvalidTag(tag);
            err.message += ` (at ${path.join("/")})`;
            throw err;
        }
        this.buffer = this.buffer.slice(1);
        // if the length field is less than 0x18, then that itself is the value
        // (optimization for small values)
        if (len < 0x18) {
            return BigInt(len);
        }
        // Else the length is 2^(length - 0x18)
        let nBytes = Math.pow(2, len - 0x18);
        let x = bigintFromBytes(nBytes, this.buffer);
        this.buffer = this.buffer.slice(nBytes);
        return x;
    }
    readByteString(path) {
        let tag = this.buffer[0];
        let len = tag & 0b11111;
        if (!((len >= 0x00 && len <= 0x1b) || len == 0x1f)) {
            let err = new CBORInvalidTag(tag);
            err.message += ` (at ${path.join("/")})`;
            throw err;
        }
        this.buffer = this.buffer.slice(1);
        // indefinite length
        if (len == 0x1f) {
            let chunks = [];
            let chunk;
            let i = -1;
            while (this.buffer[0] != 0xff) {
                i += 1;
                (chunk = this.readByteString(path)), chunks.push(chunk);
            }
            return concatUint8Array(chunks);
            // definite length
        }
        else {
            let n;
            // length follows in the next 1, 2, 4 or 8 bytes
            if (len >= 0x18 && len <= 0x1b) {
                const len_bytes = 1 << (len - 0x18);
                n = Number(bigintFromBytes(len_bytes, this.buffer));
                this.buffer = this.buffer.slice(len_bytes);
                // length is specified in the tag itself
            }
            else {
                n = len;
            }
            let chunk = this.buffer.slice(0, n);
            this.buffer = this.buffer.slice(n);
            return chunk;
        }
    }
}
export function bigintFromBytes(nBytes, stream) {
    let x = BigInt(0);
    for (let i = 0; i < nBytes; i++) {
        x = x << 8n;
        x += BigInt(stream[i]);
    }
    return x;
}
function concatUint8Array(chunks) {
    let length = 0;
    chunks.forEach((item) => {
        length += item.length;
    });
    let concat = new Uint8Array(length);
    let offset = 0;
    chunks.forEach((item) => {
        concat.set(item, offset);
        offset += item.length;
    });
    return concat;
}
/* Error Type */
export class CBORInvalidTag extends Error {
    tag;
    constructor(tag) {
        super(`Invalid CBOR tag: ${tag}`);
        this.tag = tag;
    }
}
export class CBORUnexpectedType extends Error {
    expected;
    received;
    constructor(expected, received) {
        super(`Unexpected CBOR type: expected ${expected.join("/")}, received ${received}`);
        this.expected = expected;
        this.received = received;
    }
}
