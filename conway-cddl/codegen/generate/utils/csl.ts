export function genCSL(className: string) {
  return `  
    // no-op
    free(): void {}

    static from_bytes(data: Uint8Array): ${className} {
      let reader = new CBORReader(data);
      return ${className}.deserialize(reader);
    }

    static from_hex(hex_str: string): ${className} {
      return ${className}.from_bytes(hexToBytes(hex_str));
    }

    
    to_bytes(): Uint8Array {
      let writer = new CBORWriter();
      this.serialize(writer);
      return writer.getBytes();
    }

    to_hex(): string {
      return bytesToHex(this.to_bytes());
    }
  `;
}
