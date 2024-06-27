interface GenLeaf {
  name(): string;
  fromCBOR(varName: string): string;
  // toCBOR(varName: string): string | null;
  // toCBOR is probably not needed.
}

interface GenRoot {
  generate(): string;
}
