import { describe, test, expect } from "@jest/globals";
import { PrivateKey } from "../../src/generated";
import * as CSL from "@emurgo/cardano-serialization-lib-nodejs-gc";

describe("Our PrivateKey", () => {
  const key = PrivateKey.generate_ed25519();
  const cslKey = CSL.PrivateKey.from_hex(key.to_hex());

  test("Must serialize same as CSL", () => {
    expect(key.to_hex()).toEqual(cslKey.to_hex());
    expect(key.as_bytes()).toEqual(cslKey.as_bytes());
    expect(key.to_bech32()).toEqual(cslKey.to_bech32());
  });

  test("Must have the same pubkey as CSL", () => {
    const pubkey = key.to_public();
    const cslPubkey = cslKey.to_public();
    expect(pubkey.to_hex()).toEqual(cslPubkey.to_hex());
    expect(pubkey.to_bech32()).toEqual(cslPubkey.to_bech32());
    expect(pubkey.as_bytes()).toEqual(cslPubkey.as_bytes());
  });
});

describe("Our PrivateKey (extended)", () => {
  const key = PrivateKey.generate_ed25519extended();
  const cslKey = CSL.PrivateKey.from_hex(key.to_hex());

  test("Must serialize same as CSL", () => {
    expect(key.to_hex()).toEqual(cslKey.to_hex());
    expect(key.as_bytes()).toEqual(cslKey.as_bytes());
    expect(key.to_bech32()).toEqual(cslKey.to_bech32());
  });

  test("Must have the same pubkey as CSL", () => {
    const pubkey = key.to_public();
    const cslPubkey = cslKey.to_public();
    expect(pubkey.to_hex()).toEqual(cslPubkey.to_hex());
    expect(pubkey.to_bech32()).toEqual(cslPubkey.to_bech32());
    expect(pubkey.as_bytes()).toEqual(cslPubkey.as_bytes());
  });
});
