import { describe, test, expect } from "@jest/globals";
import * as CSL from "@emurgo/cardano-serialization-lib-nodejs-gc";
import * as thisLib from "../../src/lib/bip32-ed25519/index";
import * as naclExt from "../../src/lib/bip32-ed25519/nacl-extended";
import nacl from "tweetnacl";
import * as derive from "../../src/lib/bip32-ed25519/derive";

describe("extendedToPubkey", () => {
  for (let i = 0; i < 10; i++) {
    let privateKeyExt = CSL.PrivateKey.generate_ed25519extended();
    test(privateKeyExt.to_hex(), () => {
      expect(naclExt.extendedToPubkey(privateKeyExt.as_bytes())).toEqual(
        privateKeyExt.to_public().as_bytes(),
      );
    });
  }
});

describe("signExtended", () => {
  let privateKeyExt = CSL.PrivateKey.generate_ed25519extended();
  let msg = new Uint8Array([1, 2, 3]);

  test("signature must be same as CSL", () => {
    expect(naclExt.signExtended(msg, privateKeyExt.as_bytes())).toEqual(
      privateKeyExt.sign(msg).to_bytes(),
    );
  });

  test("signature should verify", () => {
    let signature = naclExt.signExtended(msg, privateKeyExt.as_bytes());
    expect(
      nacl.sign.detached.verify(
        msg,
        signature,
        privateKeyExt.to_public().as_bytes(),
      ),
    ).toEqual(true);
  });
});


describe("sign", () => {
  let privateKey = CSL.PrivateKey.generate_ed25519();
  let msg = new Uint8Array([1, 2, 3]);

  test("signature must be same as CSL", () => {
    expect(thisLib.sign(msg, privateKey.as_bytes())).toEqual(
      privateKey.sign(msg).to_bytes(),
    );
  });

  test("signature should verify", () => {
    let signature = thisLib.sign(msg, privateKey.as_bytes());
    expect(
      nacl.sign.detached.verify(
        msg,
        signature,
        privateKey.to_public().as_bytes(),
      ),
    ).toEqual(true);
  });
});

describe("secretToExtended", () => {
  let regressionKeys = [
    "4428f1b59d357c10bca5ae134b767359d1f8f66fde851503b56f297cf599f456",
    "08d2ce4b2e1f212fe95261eea572fcaaf423883d61dc1ca6c94b9e2722edbee6",
    "1ae394b2c3014ee41df9494d825a9488182e2f95e07f85002405c2a91d2a723b",
  ];

  for (let i = 0; i < 10; i++) {
    let privateKey =
      regressionKeys[i] != null
        ? CSL.PrivateKey.from_hex(regressionKeys[i])
        : CSL.PrivateKey.generate_ed25519();

    test(privateKey.to_hex(), () => {
      let privateKeyExt = CSL.PrivateKey.from_extended_bytes(
        thisLib.secretToExtended(privateKey.as_bytes()),
      );
      expect(privateKeyExt.to_public().to_hex()).toEqual(
        privateKey.to_public().to_hex(),
      );
    });
  }
});

describe("bytesToBigIntLE/bigIntToBytesLE", () => {
  let values: [string, bigint][] = [
    ["00ff", 65280n],
    ["d204", 1234n],
    [
      "d202e6398fbb826fefd3805d321be427",
      53024287134762933305302428713476293330n,
    ],
  ];

  for (let [hex, num] of values) {
    test(hex + ": " + num.toString(), () => {
      const uint8Array: Uint8Array = new Uint8Array(Buffer.from(hex, "hex"));
      expect(derive.bytesToBigIntLE(uint8Array)).toEqual(num);

      let buffer = Buffer.from(derive.bigIntToBytesLE(num, 64));
      let size = buffer.length;
      while (size > 0 && buffer[size - 1] == 0) size -= 1; // remove leading zeroes
      buffer = buffer.subarray(0, size);
      expect(buffer.toString("hex")).toEqual(hex);
    });
  }
});

describe("derivePrivate", () => {
  for (let i = 0; i < 10; i++) {
    let parentCSL = CSL.Bip32PrivateKey.generate_ed25519_bip32();

    for (let index of [1, derive.harden(1), 1234, derive.harden(1234)]) {
      test(parentCSL.to_hex() + "/" + index, () => {
        let parent = splitBip32PrivateKey(parentCSL);
        expect(toHex(thisLib.extendedToPubkey(parent.privateKey))).toEqual(
          parentCSL.to_public().to_raw_key().to_hex(),
        );

        let child = derive.derivePrivate(
          parent.privateKey,
          parent.chainCode,
          index,
        );
        let childExpected = splitBip32PrivateKey(parentCSL.derive(index));

        expect([toHex(child.privateKey), toHex(child.chainCode)]).toEqual([
          toHex(childExpected.privateKey),
          toHex(childExpected.chainCode),
        ]);
      });
    }
  }
});

describe("derivePublic", () => {
  for (let i = 0; i < 1; i++) {
    let parentCSL = CSL.Bip32PrivateKey.generate_ed25519_bip32().to_public();

    for (let index of [1, 1234]) {
      test(parentCSL.to_hex() + "/" + index, () => {
        let parent = splitBip32PublicKey(parentCSL);

        let child = derive.derivePublic(
          parent.publicKey,
          parent.chainCode,
          index,
        );
        let childExpected = splitBip32PublicKey(parentCSL.derive(index));

        expect([toHex(child.publicKey), toHex(child.chainCode)]).toEqual([
          toHex(childExpected.publicKey),
          toHex(childExpected.chainCode),
        ]);
      });
    }
  }
});

function splitBip32PrivateKey(key: CSL.Bip32PrivateKey): {
  privateKey: Uint8Array;
  chainCode: Uint8Array;
} {
  let privateKey = key.to_raw_key().as_bytes();
  let chainCode = key.chaincode();
  return { privateKey, chainCode };
}

function splitBip32PublicKey(key: CSL.Bip32PublicKey): {
  publicKey: Uint8Array;
  chainCode: Uint8Array;
} {
  let publicKey = key.to_raw_key().as_bytes();
  let chainCode = key.chaincode();
  return { publicKey, chainCode };
}

function toHex(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("hex");
}
