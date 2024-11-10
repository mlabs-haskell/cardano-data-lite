import {
  BigNum,
  ConstrPlutusData,
  PlutusData,
  PlutusList,
} from "../../src/generated";
import { hash_plutus_data } from "../../src/hash";
import { hexToBytes } from "../../src/lib/hex";

describe("hash_plutus_data Tests", () => {
  test("Hash of ConstrPlutusData with tag 0 and empty list", () => {
    // Create ConstrPlutusData with tag 0 and empty list
    const tag = BigNum.from_str("0");
    const dataList = PlutusList.new();
    const constrData = ConstrPlutusData.new(tag, dataList);
    const plutusData = PlutusData.new_constr_plutus_data(constrData);

    const hashHex = hash_plutus_data(plutusData).to_hex();

    const expectedHash =
      "923918e403bf43c34b4ef6b48eb2ee04babed17320d8d1b9ff9ad086e86f44ec";

    // Assert that the hashes match
    expect(hashHex).toBe(expectedHash);
  });

  test("Hash of known datum with indefinite arrays", () => {
    // This is a known datum with indefinite arrays and a known expected hash
    const hexData =
      "d8799fd8799f581ca183bf86925f66c579a3745c9517744399679b090927b8f6e2f2e1bb4f616461706541696c656e416d61746fffd8799f581c9a4e855293a0b9af5e50935a331d83e7982ab5b738ea0e6fc0f9e6564e4652414d455f36353030335f4c30ff581cbea1c521df58f4eeef60c647e5ebd88c6039915409f9fd6454a476b9ff";
    const expectedHash =
      "ec3028f46325b983a470893a8bdc1b4a100695b635fb1237d301c3490b23e89b";

    const bytes = hexToBytes(hexData);
    const plutusData = PlutusData.from_bytes(bytes);

    const hashHex = hash_plutus_data(plutusData).to_hex();

    expect(hashHex).toBe(expectedHash);
  });

  test("Hash of same datum with definite arrays", () => {
    const hexData =
      "d87983d87982581ca183bf86925f66c579a3745c9517744399679b090927b8f6e2f2e1bb4f616461706541696c656e416d61746fd87982581c9a4e855293a0b9af5e50935a331d83e7982ab5b738ea0e6fc0f9e6564e4652414d455f36353030335f4c30581cbea1c521df58f4eeef60c647e5ebd88c6039915409f9fd6454a476b9";
    const expectedHash =
      "816cdf6d4d8cba3ad0188ca643db95ddf0e03cdfc0e75a9550a72a82cb146222";

    const bytes = hexToBytes(hexData);
    const plutusData = PlutusData.from_bytes(bytes);

    const hashHex = hash_plutus_data(plutusData).to_hex();

    expect(hashHex).toBe(expectedHash);
  });
});
