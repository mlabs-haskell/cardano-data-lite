import { describe, test, expect } from "@jest/globals";
import * as CSL from "@emurgo/cardano-serialization-lib-nodejs-gc";
import * as CDL from "../../src/generated";

describe("TransactionOutput", () => {
  const gen = (lib: typeof CSL) => {
    let stakeCredential = lib.Credential.from_keyhash(
      lib.Ed25519KeyHash.from_hex(
        "1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361"
      )
    );
    let paymentCredential = lib.Credential.from_keyhash(
      lib.Ed25519KeyHash.from_hex(
        "30fb3b8539951e26f034910a5a37f22cb99d94d1d409f69ddbaea971"
      )
    );
    let address = lib.BaseAddress.new(
      lib.NetworkId.testnet().kind(),
      paymentCredential,
      stakeCredential
    ).to_address();
    let txOut = lib.TransactionOutput.new(address, lib.Value.zero());
    return txOut;
  };

  let csl = gen(CSL);
  let cdl = gen(CDL as any);

  test("serialize", () => {
    expect(cdl.to_hex()).toEqual(csl.to_hex());
  });

  test("fixture", () => {
    expect(cdl.to_hex()).toEqual(
      "8258390030fb3b8539951e26f034910a5a37f22cb99d94d1d409f69ddbaea9711c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d5336100"
    );
  });
});
