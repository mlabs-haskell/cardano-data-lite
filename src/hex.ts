const BYTE_TO_HEX_LUT = new Array(0x100);
const HEX_TO_BYTE_LUT: { [key: string]: number } = {};

for (let i = 0; i < 0x100; i++) {
  let hex = i.toString(16).padStart(2, "0");
  BYTE_TO_HEX_LUT[i] = hex;
  HEX_TO_BYTE_LUT[hex] = i;
}

export function bytesToHex(bytes: Uint8Array): string {
  return bytes.map((b) => BYTE_TO_HEX_LUT[b]).join("");
}

export function hexToBytes(hex: string): Uint8Array {
  let array = new Uint8Array(Math.floor(hex.length / 2));
  let i = 0;
  for (; i < array.length; i += 1) {
    let byte = HEX_TO_BYTE_LUT[hex.slice(i * 2, i * 2 + 2)];
    if (byte == undefined) break;
    array[i] = byte;
  }
  return i == array.length ? array : array.slice(0, i);
}
