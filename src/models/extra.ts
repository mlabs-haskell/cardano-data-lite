// set<a> = #6.258([* a]) / [* a]

import { CBORReaderValue } from "../cbor/reader";
import { CBORCustom, CBORValue } from "../cbor/types";
import { CBORWriter } from "../cbor/writer";

export class ConwaySet<T extends CBORValue> implements CBORCustom {
  private values: T[];

  constructor(values: T[]) {
    this.values = values;
  }

  add(value: T) {
    if (this.has(value)) {
      return;
    }
    this.values.push(value);
  }

  remove(value: T) {
    this.values = this.values.filter((v) => CBORWriter.compare(v, value) != 0);
  }

  has(value: T) {
    return this.values.find((v) => CBORWriter.compare(v, value) == 0) != null;
  }

  static fromCBOR(value: CBORReaderValue): ConwaySet<CBORReaderValue> {
    return new ConwaySet(
      value.getChoice({
        array: (arr) => arr,
        tagged: (tagged) => tagged.getTagged(258n).get("array"),
      })
    );
  }

  map<U extends CBORValue>(fn: (value: T) => U): ConwaySet<U> {
    return new ConwaySet(this.values.map(fn));
  }

  toCBOR(writer: CBORWriter) {
    writer.writeTagged(258n, this.values);
  }
}

export class NonNegativeInterval implements CBORCustom {
  public readonly numerator: bigint;
  public readonly denominator: bigint;

  constructor(numerator: bigint, denominator: bigint) {
    if (denominator <= 0) {
      throw new Error("Denominator must be positive");
    }
    this.numerator = numerator;
    this.denominator = denominator;
  }

  static fromCBOR(value: CBORReaderValue): NonNegativeInterval {
    let array = value.get("tagged").getTagged(30n).get("array");
    return new NonNegativeInterval(
      array.getRequired(0).get("uint"),
      array.getRequired(1).get("uint")
    );
  }

  toCBOR(writer: CBORWriter) {
    writer.writeTagged(30n, [this.numerator, this.denominator]);
  }

  asFloat(): number {
    return Number(this.numerator) / Number(this.denominator);
  }
}

export class UnitInterval extends NonNegativeInterval {
  constructor(numerator: bigint, denominator: bigint) {
    super(numerator, denominator);
    if (numerator > denominator) {
      throw new Error("Numerator must be less than or equal to denominator");
    }
  }

  static fromCBOR(value: CBORReaderValue): UnitInterval {
    let interval = NonNegativeInterval.fromCBOR(value);
    return new UnitInterval(interval.numerator, interval.denominator);
  }
}

export type Address = Uint8Array;
export type RewardAccount = Uint8Array;

export class BoundedBytes extends Uint8Array implements CBORCustom {
  static fromCBOR(value: CBORReaderValue): BoundedBytes {
    return new BoundedBytes(value.get("bstr"));
  }

  toCBOR(writer: CBORWriter) {
    let chunks = [];
    let offset = 0;
    while (offset < this.length) {
      let chunk = this.slice(offset, offset + 64);
      chunks.push(chunk);
      offset += chunk.length;
    }
    writer.writeBinaryChunked(chunks);
  }
}
