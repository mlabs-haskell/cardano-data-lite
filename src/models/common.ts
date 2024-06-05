import { CBORReaderValue } from "../cbor2/reader";
import { CBORMap, CBORValue } from "../cbor2/types";

export class NonZeroBigIntMap<T extends CBORValue> extends CBORMap<T, bigint> {
  protected constructor(entries: [T, bigint][]) {
    super(entries, (_k, v) => v != 0n);
  }

  static fromCBOR<T extends CBORValue>(
    value: CBORReaderValue,
    keyFn: (value: CBORReaderValue) => T
  ): NonZeroBigIntMap<T> {
    let map = value.get("map").toMap();
    return new NonZeroBigIntMap(
      map.entries.map(([key, value]) => {
        let entry: [T, bigint] = [keyFn(key), value.get("uint")];
        return entry;
      })
    );
  }
}

export class PositiveBigIntMap<T extends CBORValue> extends CBORMap<T, bigint> {
  protected constructor(entries: [T, bigint][]) {
    super(entries, (_k, v) => v > 0n);
  }

  static fromCBOR<T extends CBORValue>(
    value: CBORReaderValue,
    keyFn: (value: CBORReaderValue) => T
  ): PositiveBigIntMap<T> {
    let map = value.get("map").toMap();
    return new PositiveBigIntMap(
      map.entries.map(([key, value]) => {
        let entry: [T, bigint] = [keyFn(key), value.get("uint")];
        return entry;
      })
    );
  }
}
