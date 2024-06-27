export class GrowableBuffer {
  private buffer: ArrayBuffer;
  private dataView: DataView;
  private occupiedLength: number;

  constructor() {
    this.buffer = new ArrayBuffer(0);
    this.dataView = new DataView(this.buffer);
    this.occupiedLength = 0;
  }

  getBuffer(): ArrayBuffer {
    return this.buffer.slice(0, this.occupiedLength);
  }

  pushByte(value: number) {
    this.growIfNeeded(1);
    this.dataView.setUint8(this.occupiedLength, value);
    this.occupiedLength += 1;
  }

  pushByteArray(value: Uint8Array) {
    this.growIfNeeded(value.length);
    for (let byte of value) {
      this.dataView.setUint8(this.occupiedLength, byte);
      this.occupiedLength += 1;
    }
  }

  pushBigInt(value: bigint, nBytes?: number) {
    if (nBytes == null) {
      nBytes = Math.ceil(Number(value).toString(2).length / 8);
    }

    let bytes: bigint[] = [];
    for (let i = 0; i < nBytes; i++) {
      bytes.push(value & 0xffn); // LSB first
      value = value >> 8n;
    }
    bytes.reverse(); // MSB first (CBOR is big-endian)
    this.growIfNeeded(nBytes);
    for (let byte of bytes) {
      this.dataView.setUint8(this.occupiedLength, Number(byte));
      this.occupiedLength += 1;
    }
  }

  pushFloat32(value: number) {
    this.growIfNeeded(4);
    this.dataView.setFloat32(this.occupiedLength, value);
    this.occupiedLength += 4;
  }

  pushFloat64(value: number) {
    this.growIfNeeded(8);
    this.dataView.setFloat64(this.occupiedLength, value);
    this.occupiedLength += 8;
  }

  private growIfNeeded(expectedExtraLength: number) {
    if (this.occupiedLength + expectedExtraLength > this.buffer.byteLength) {
      let newBuffer = new ArrayBuffer(this.buffer.byteLength * 2 + 1);
      let newDataView = new DataView(newBuffer);
      for (let i = 0; i < this.buffer.byteLength; i++) {
        newDataView.setUint8(i, this.dataView.getUint8(i));
      }
      this.buffer = newBuffer;
      this.dataView = newDataView;
    }
  }
}
