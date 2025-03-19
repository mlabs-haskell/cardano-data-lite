import { describe, test, expect } from "@jest/globals";
import * as CSL from "@emurgo/cardano-serialization-lib-nodejs-gc";
import * as CDL from "../../src";
import { hexToBytes } from "../../src/lib/hex";

describe("PlutusData Hash regression", () => {
  let fixture1 = (lib: typeof CSL) =>
    lib.PlutusData.new_list(lib.PlutusList.new());
  let fixture2 = (lib: typeof CSL) => {
    let l = lib.PlutusList.new();
    l.add(fixture1(lib));
    return lib.PlutusData.new_list(l);
  };
  let fixture3 = (lib: typeof CSL) =>
    lib.PlutusData.new_bytes(
      hexToBytes("30fb3b8539951e26f034910a5a37f22cb99d94d1d409f69ddbaea971"),
    );
  let fixture4 = (lib: typeof CSL) => {
    let l = lib.PlutusList.new();
    l.add(fixture2(lib));
    l.add(fixture3(lib));
    return lib.PlutusData.new_constr_plutus_data(
      lib.ConstrPlutusData.new(lib.BigNum.one(), l),
    );
  };
  let fixture5 = (lib: typeof CSL) =>
    lib.PlutusData.new_integer(lib.BigInt.from_str("42"));
  let fixture6 = (lib: typeof CSL) => {
    let l = lib.PlutusMap.new();
    let v1 = lib.PlutusMapValues.new();
    v1.add(fixture2(lib));
    l.insert(fixture1(lib), v1);

    let v2 = lib.PlutusMapValues.new();
    v2.add(fixture4(lib));
    l.insert(fixture3(lib), v2);

    return lib.PlutusData.new_map(l);
  };

  let fixture7 = (lib: typeof CSL) => {
    let l = lib.PlutusList.new();
    l.add(fixture1(lib));
    l.add(fixture2(lib));
    l.add(fixture3(lib));
    l.add(fixture4(lib));
    l.add(fixture5(lib));
    l.add(fixture6(lib));
    return lib.PlutusData.new_list(l);
  };
  let cdl = fixture7(CDL as any);
  let csl = fixture7(CSL);

  test("serialize", () => {
    expect(cdl.to_hex()).toStrictEqual(csl.to_hex());
  });

  test("deserialize", () => {
    let cdl2 = CDL.PlutusData.from_hex(csl.to_hex());
    expect(cdl2.to_hex()).toStrictEqual(csl.to_hex());
  });

  test("hash", () => {
    expect(CDL.hash_plutus_data(cdl as any).to_hex()).toStrictEqual(
      CSL.hash_plutus_data(csl).to_hex(),
    );
  });

  test("hash against precalculated: CDL", () => {
    expect(CDL.hash_plutus_data(cdl as any).to_hex()).toBe(
      "0ba47e574456db8938e56f889d4c30099256f96008e0d4b6c4688f47ec342c9d",
    );
  });

  test("hash against precalculated: CDL", () => {
    expect(CSL.hash_plutus_data(csl as any).to_hex()).toBe(
      "0ba47e574456db8938e56f889d4c30099256f96008e0d4b6c4688f47ec342c9d",
    );
  });
});

/*
 witnessSetFixture3Value :: TransactionWitnessSet
witnessSetFixture3Value =
  TransactionWitnessSet
    { bootstraps: []
    , nativeScripts: []
    , plutusData:
        [ Bytes
            ( byteArrayFromIntArrayUnsafe
                [ 43 , 184 , 13 , 83 , 123 , 29 , 163 , 227 , 139 , 211 , 3 , 97 , 170 , 133 , 86 , 134 , 189 , 224 , 234 , 205 , 113 , 98 , 254 , 246 , 162 , 95 , 233 , 123 , 245 , 39 , 162 , 91 ]
            )
        ]
    , plutusScripts: [ plutusScriptFixture1, plutusScriptFixture2, plutusScriptFixture3 ]
    , redeemers: []
    , vkeys:
        [ Vkeywitness
            { vkey: Vkey
                ( unsafePartial $ fromJust $ PublicKey.fromBech32
                    "ed25519_pk1p9sf9wz3t46u9ghht44203gerxt82kzqaqw74fqrmwjmdy8sjxmqknzq8j"
                )
            , signature:
                ( unsafePartial $ fromJust <<< Ed25519Signature.fromBech32 $
                    "ed25519_sig1clmhgxx9e9t24wzgkmcsr44uq98j935evsjnrj8nn7ge08\
                    \qrz0mgdxv5qtz8dyghs47q3lxwk4akq3u2ty8v4egeqvtl02ll0nfcqqq\
                    \6faxl6"
                )
            }
        ]
    }
*/

describe("Transaction Witness Set regression", () => {
  let plutusScriptFixture1Hex = "4d01000033222220051200120011";
  let plutusScriptFixture2Hex = "4d010000deadbeef33222220051200120011";
  let plutusScriptFixture3Hex =
    "59088501000032332232323233223232323232323232323322323232323232322223232533532325335001101b13357389211d556e657870656374656420646174756d206174206f776e20696e7075740001a323253335002153335001101c2101c2101c2153335002101c21333573466ebc00800407807484074854ccd400840708407484ccd5cd19b8f00200101e01d323500122220023235001220013553353500222350022222222222223333500d2501e2501e2501e233355302d12001321233001225335002210031001002501e2350012253355335333573466e3cd400888008d4010880080b40b04ccd5cd19b873500222001350042200102d02c102c1350220031502100d21123001002162001300a0053333573466e1cd55cea80124000466442466002006004646464646464646464646464646666ae68cdc39aab9d500c480008cccccccccccc88888888888848cccccccccccc00403403002c02802402001c01801401000c008cd4054058d5d0a80619a80a80b1aba1500b33501501735742a014666aa034eb94064d5d0a804999aa80d3ae501935742a01066a02a0426ae85401cccd54068089d69aba150063232323333573466e1cd55cea801240004664424660020060046464646666ae68cdc39aab9d5002480008cc8848cc00400c008cd40b1d69aba15002302d357426ae8940088c98c80bccd5ce01901881689aab9e5001137540026ae854008c8c8c8cccd5cd19b8735573aa004900011991091980080180119a8163ad35742a004605a6ae84d5d1280111931901799ab9c03203102d135573ca00226ea8004d5d09aba2500223263202b33573805c05a05226aae7940044dd50009aba1500533501575c6ae854010ccd540680788004d5d0a801999aa80d3ae200135742a00460406ae84d5d1280111931901399ab9c02a029025135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d55cf280089baa00135742a00460206ae84d5d1280111931900c99ab9c01c01b017101a132632018335738921035054350001a135573ca00226ea800448c88c008dd6000990009aa80d111999aab9f0012501c233501b30043574200460066ae8800805c8c8c8cccd5cd19b8735573aa004900011991091980080180118069aba150023005357426ae8940088c98c8054cd5ce00c00b80989aab9e5001137540024646464646666ae68cdc39aab9d5004480008cccc888848cccc00401401000c008c8c8c8cccd5cd19b8735573aa0049000119910919800801801180b1aba1500233500e015357426ae8940088c98c8068cd5ce00e80e00c09aab9e5001137540026ae854010ccd54025d728041aba150033232323333573466e1d400520042300b357426aae79400c8cccd5cd19b875002480088c84888c004010dd71aba135573ca00846666ae68cdc3a801a400042444006464c6403866ae7007c0780680640604d55cea80089baa00135742a00466a014eb8d5d09aba2500223263201633573803203002826ae8940044d5d1280089aab9e500113754002424446004008266aa002eb9d6889119118011bab00132001355016223233335573e0044a032466a03066442466002006004600c6aae754008c014d55cf280118021aba200301413574200224464646666ae68cdc3a800a400046a00e600a6ae84d55cf280191999ab9a3370ea00490011280391931900919ab9c01501401000f135573aa00226ea800448488c00800c44880048c8c8cccd5cd19b875001480188c848888c010014c01cd5d09aab9e500323333573466e1d400920042321222230020053009357426aae7940108cccd5cd19b875003480088c848888c004014c01cd5d09aab9e500523333573466e1d40112000232122223003005375c6ae84d55cf280311931900819ab9c01301200e00d00c00b135573aa00226ea80048c8c8cccd5cd19b8735573aa004900011991091980080180118029aba15002375a6ae84d5d1280111931900619ab9c00f00e00a135573ca00226ea80048c8cccd5cd19b8735573aa002900011bae357426aae7940088c98c8028cd5ce00680600409baa001232323232323333573466e1d4005200c21222222200323333573466e1d4009200a21222222200423333573466e1d400d2008233221222222233001009008375c6ae854014dd69aba135744a00a46666ae68cdc3a8022400c4664424444444660040120106eb8d5d0a8039bae357426ae89401c8cccd5cd19b875005480108cc8848888888cc018024020c030d5d0a8049bae357426ae8940248cccd5cd19b875006480088c848888888c01c020c034d5d09aab9e500b23333573466e1d401d2000232122222223005008300e357426aae7940308c98c804ccd5ce00b00a80880800780700680600589aab9d5004135573ca00626aae7940084d55cf280089baa0012323232323333573466e1d400520022333222122333001005004003375a6ae854010dd69aba15003375a6ae84d5d1280191999ab9a3370ea0049000119091180100198041aba135573ca00c464c6401866ae7003c0380280244d55cea80189aba25001135573ca00226ea80048c8c8cccd5cd19b875001480088c8488c00400cdd71aba135573ca00646666ae68cdc3a8012400046424460040066eb8d5d09aab9e500423263200933573801801600e00c26aae7540044dd500089119191999ab9a3370ea00290021091100091999ab9a3370ea00490011190911180180218031aba135573ca00846666ae68cdc3a801a400042444004464c6401466ae7003403002001c0184d55cea80089baa0012323333573466e1d40052002200623333573466e1d40092000200623263200633573801201000800626aae74dd5000a4c24400424400224002920103505431003200135500322112225335001135003220012213335005220023004002333553007120010050040011122002122122330010040031123230010012233003300200200101";
  let plutusDataBytes = new Uint8Array([
    43, 184, 13, 83, 123, 29, 163, 227, 139, 211, 3, 97, 170, 133, 86, 134, 189,
    224, 234, 205, 113, 98, 254, 246, 162, 95, 233, 123, 245, 39, 162, 91,
  ]);
  let vkeyPubkeyBech32 =
    "ed25519_pk1p9sf9wz3t46u9ghht44203gerxt82kzqaqw74fqrmwjmdy8sjxmqknzq8j";
  let vkeySignatureBech32 =
    "ed25519_sig1clmhgxx9e9t24wzgkmcsr44uq98j935evsjnrj8nn7ge08qrz0mgdxv5qtz8dyghs47q3lxwk4akq3u2ty8v4egeqvtl02ll0nfcqqq6faxl6";

  let plutusDataBytesFixture = (lib: typeof CSL) => {
    let x = lib.PlutusList.new();
    x.add(lib.PlutusData.new_bytes(plutusDataBytes));
    return x;
  };

  let vkeysFixture = (lib: typeof CSL) => {
    let vkeys = lib.Vkeywitnesses.new();
    vkeys.add(
      lib.Vkeywitness.new(
        lib.Vkey.new(lib.PublicKey.from_bech32(vkeyPubkeyBech32)),
        lib.Ed25519Signature.from_bech32(vkeySignatureBech32),
      ),
    );
    return vkeys;
  };

  let txWitnessSetFixture = (lib: typeof CSL) => {
    let txwset = lib.TransactionWitnessSet.new();
    txwset.set_plutus_data(plutusDataBytesFixture(lib));
    txwset.set_vkeys(vkeysFixture(lib));
    return txwset;
  };

  let csl = txWitnessSetFixture(CSL);
  let cslPlutusScripts = CSL.PlutusScripts.new();
  cslPlutusScripts.add(
    CSL.PlutusScript.from_hex_with_version(
      plutusScriptFixture1Hex,
      CSL.Language.new_plutus_v1(),
    ),
  );
  cslPlutusScripts.add(
    CSL.PlutusScript.from_hex_with_version(
      plutusScriptFixture2Hex,
      CSL.Language.new_plutus_v2(),
    ),
  );
  cslPlutusScripts.add(
    CSL.PlutusScript.from_hex_with_version(
      plutusScriptFixture3Hex,
      CSL.Language.new_plutus_v3(),
    ),
  );
  csl.set_plutus_scripts(cslPlutusScripts);

  let cdl = txWitnessSetFixture(CDL as any) as any as CDL.TransactionWitnessSet;
  let cdlPlutusScripts1 = CDL.PlutusScripts.new();
  cdlPlutusScripts1.add(CDL.PlutusScript.from_hex(plutusScriptFixture1Hex));
  cdl.set_plutus_scripts_v1(cdlPlutusScripts1);
  let cdlPlutusScripts2 = CDL.PlutusScripts.new();
  cdlPlutusScripts2.add(CDL.PlutusScript.from_hex(plutusScriptFixture2Hex));
  cdl.set_plutus_scripts_v2(cdlPlutusScripts2);
  let cdlPlutusScripts3 = CDL.PlutusScripts.new();
  cdlPlutusScripts3.add(CDL.PlutusScript.from_hex(plutusScriptFixture3Hex));
  cdl.set_plutus_scripts_v3(cdlPlutusScripts3);

  test("serialize", () => {
    expect(cdl.to_hex()).toStrictEqual(csl.to_hex());
  });

  test("deserialize", () => {
    let cdl2 = CDL.TransactionWitnessSet.from_hex(csl.to_hex());
    expect(cdl2.to_hex()).toStrictEqual(csl.to_hex());
  });
});

describe("Transaction Witness Set regression 2", () => {
  let plutusScriptFixture1Hex = "4d01000033222220051200120011";
  let plutusScriptFixture2Hex = "4d010000deadbeef33222220051200120011";
  let plutusScriptFixture3Hex =
    "59088501000032332232323233223232323232323232323322323232323232322223232533532325335001101b13357389211d556e657870656374656420646174756d206174206f776e20696e7075740001a323253335002153335001101c2101c2101c2153335002101c21333573466ebc00800407807484074854ccd400840708407484ccd5cd19b8f00200101e01d323500122220023235001220013553353500222350022222222222223333500d2501e2501e2501e233355302d12001321233001225335002210031001002501e2350012253355335333573466e3cd400888008d4010880080b40b04ccd5cd19b873500222001350042200102d02c102c1350220031502100d21123001002162001300a0053333573466e1cd55cea80124000466442466002006004646464646464646464646464646666ae68cdc39aab9d500c480008cccccccccccc88888888888848cccccccccccc00403403002c02802402001c01801401000c008cd4054058d5d0a80619a80a80b1aba1500b33501501735742a014666aa034eb94064d5d0a804999aa80d3ae501935742a01066a02a0426ae85401cccd54068089d69aba150063232323333573466e1cd55cea801240004664424660020060046464646666ae68cdc39aab9d5002480008cc8848cc00400c008cd40b1d69aba15002302d357426ae8940088c98c80bccd5ce01901881689aab9e5001137540026ae854008c8c8c8cccd5cd19b8735573aa004900011991091980080180119a8163ad35742a004605a6ae84d5d1280111931901799ab9c03203102d135573ca00226ea8004d5d09aba2500223263202b33573805c05a05226aae7940044dd50009aba1500533501575c6ae854010ccd540680788004d5d0a801999aa80d3ae200135742a00460406ae84d5d1280111931901399ab9c02a029025135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d55cf280089baa00135742a00460206ae84d5d1280111931900c99ab9c01c01b017101a132632018335738921035054350001a135573ca00226ea800448c88c008dd6000990009aa80d111999aab9f0012501c233501b30043574200460066ae8800805c8c8c8cccd5cd19b8735573aa004900011991091980080180118069aba150023005357426ae8940088c98c8054cd5ce00c00b80989aab9e5001137540024646464646666ae68cdc39aab9d5004480008cccc888848cccc00401401000c008c8c8c8cccd5cd19b8735573aa0049000119910919800801801180b1aba1500233500e015357426ae8940088c98c8068cd5ce00e80e00c09aab9e5001137540026ae854010ccd54025d728041aba150033232323333573466e1d400520042300b357426aae79400c8cccd5cd19b875002480088c84888c004010dd71aba135573ca00846666ae68cdc3a801a400042444006464c6403866ae7007c0780680640604d55cea80089baa00135742a00466a014eb8d5d09aba2500223263201633573803203002826ae8940044d5d1280089aab9e500113754002424446004008266aa002eb9d6889119118011bab00132001355016223233335573e0044a032466a03066442466002006004600c6aae754008c014d55cf280118021aba200301413574200224464646666ae68cdc3a800a400046a00e600a6ae84d55cf280191999ab9a3370ea00490011280391931900919ab9c01501401000f135573aa00226ea800448488c00800c44880048c8c8cccd5cd19b875001480188c848888c010014c01cd5d09aab9e500323333573466e1d400920042321222230020053009357426aae7940108cccd5cd19b875003480088c848888c004014c01cd5d09aab9e500523333573466e1d40112000232122223003005375c6ae84d55cf280311931900819ab9c01301200e00d00c00b135573aa00226ea80048c8c8cccd5cd19b8735573aa004900011991091980080180118029aba15002375a6ae84d5d1280111931900619ab9c00f00e00a135573ca00226ea80048c8cccd5cd19b8735573aa002900011bae357426aae7940088c98c8028cd5ce00680600409baa001232323232323333573466e1d4005200c21222222200323333573466e1d4009200a21222222200423333573466e1d400d2008233221222222233001009008375c6ae854014dd69aba135744a00a46666ae68cdc3a8022400c4664424444444660040120106eb8d5d0a8039bae357426ae89401c8cccd5cd19b875005480108cc8848888888cc018024020c030d5d0a8049bae357426ae8940248cccd5cd19b875006480088c848888888c01c020c034d5d09aab9e500b23333573466e1d401d2000232122222223005008300e357426aae7940308c98c804ccd5ce00b00a80880800780700680600589aab9d5004135573ca00626aae7940084d55cf280089baa0012323232323333573466e1d400520022333222122333001005004003375a6ae854010dd69aba15003375a6ae84d5d1280191999ab9a3370ea0049000119091180100198041aba135573ca00c464c6401866ae7003c0380280244d55cea80189aba25001135573ca00226ea80048c8c8cccd5cd19b875001480088c8488c00400cdd71aba135573ca00646666ae68cdc3a8012400046424460040066eb8d5d09aab9e500423263200933573801801600e00c26aae7540044dd500089119191999ab9a3370ea00290021091100091999ab9a3370ea00490011190911180180218031aba135573ca00846666ae68cdc3a801a400042444004464c6401466ae7003403002001c0184d55cea80089baa0012323333573466e1d40052002200623333573466e1d40092000200623263200633573801201000800626aae74dd5000a4c24400424400224002920103505431003200135500322112225335001135003220012213335005220023004002333553007120010050040011122002122122330010040031123230010012233003300200200101";

  let txWitnessSetFixture = (lib: typeof CSL) => {
    let txwset = lib.TransactionWitnessSet.new();
    return txwset;
  };

  let csl = txWitnessSetFixture(CSL);
  let cslPlutusScripts = CSL.PlutusScripts.new();
  cslPlutusScripts.add(
    CSL.PlutusScript.from_hex_with_version(
      plutusScriptFixture1Hex,
      CSL.Language.new_plutus_v1(),
    ),
  );
  cslPlutusScripts.add(
    CSL.PlutusScript.from_hex_with_version(
      plutusScriptFixture2Hex,
      CSL.Language.new_plutus_v2(),
    ),
  );
  cslPlutusScripts.add(
    CSL.PlutusScript.from_hex_with_version(
      plutusScriptFixture3Hex,
      CSL.Language.new_plutus_v3(),
    ),
  );
  csl.set_plutus_scripts(cslPlutusScripts);

  let cdl = txWitnessSetFixture(CDL as any) as any as CDL.TransactionWitnessSet;
  let cdlPlutusScripts1 = CDL.PlutusScripts.new();
  cdlPlutusScripts1.add(CDL.PlutusScript.from_hex(plutusScriptFixture1Hex));
  cdl.set_plutus_scripts_v1(cdlPlutusScripts1);
  let cdlPlutusScripts2 = CDL.PlutusScripts.new();
  cdlPlutusScripts2.add(CDL.PlutusScript.from_hex(plutusScriptFixture2Hex));
  cdl.set_plutus_scripts_v2(cdlPlutusScripts2);
  let cdlPlutusScripts3 = CDL.PlutusScripts.new();
  cdlPlutusScripts3.add(CDL.PlutusScript.from_hex(plutusScriptFixture3Hex));
  cdl.set_plutus_scripts_v3(cdlPlutusScripts3);

  test("serialize", () => {
    expect(cdl.to_hex()).toStrictEqual(csl.to_hex());
  });

  test("deserialize", () => {
    let cdl2 = CDL.TransactionWitnessSet.from_hex(csl.to_hex());
    expect(cdl2.to_hex()).toStrictEqual(csl.to_hex());
  });
});

describe("Transaction Witness Set regression 3", () => {
  let plutusScriptFixture1Hex = "4d01000033222220051200120011";
  let plutusScriptFixture2Hex = "4d010000deadbeef33222220051200120011";

  let txWitnessSetFixture = (lib: typeof CSL) => {
    let txwset = lib.TransactionWitnessSet.new();
    return txwset;
  };

  let csl = txWitnessSetFixture(CSL);
  let cslPlutusScripts = CSL.PlutusScripts.new();
  cslPlutusScripts.add(
    CSL.PlutusScript.from_hex_with_version(
      plutusScriptFixture1Hex,
      CSL.Language.new_plutus_v1(),
    ),
  );
  cslPlutusScripts.add(
    CSL.PlutusScript.from_hex_with_version(
      plutusScriptFixture2Hex,
      CSL.Language.new_plutus_v2(),
    ),
  );
  csl.set_plutus_scripts(cslPlutusScripts);

  let cdl = txWitnessSetFixture(CDL as any) as any as CDL.TransactionWitnessSet;
  let cdlPlutusScripts1 = CDL.PlutusScripts.new();
  cdlPlutusScripts1.add(CDL.PlutusScript.from_hex(plutusScriptFixture1Hex));
  cdl.set_plutus_scripts_v1(cdlPlutusScripts1);
  let cdlPlutusScripts2 = CDL.PlutusScripts.new();
  cdlPlutusScripts2.add(CDL.PlutusScript.from_hex(plutusScriptFixture2Hex));
  cdl.set_plutus_scripts_v2(cdlPlutusScripts2);

  test("serialize", () => {
    expect(cdl.to_hex()).toStrictEqual(csl.to_hex());
  });

  test("deserialize", () => {
    let cdl2 = CDL.TransactionWitnessSet.from_hex(csl.to_hex());
    expect(cdl2.to_hex()).toStrictEqual(csl.to_hex());
  });
});

describe("Transaction Witness Set regression 4", () => {
  let plutusScriptFixture1Hex = "4d01000033222220051200120011";
  let plutusScriptFixture2Hex = "4d010000deadbeef33222220051200120011";
  let plutusDataBytes = new Uint8Array([
    43, 184, 13, 83, 123, 29, 163, 227, 139, 211, 3, 97, 170, 133, 86, 134, 189,
    224, 234, 205, 113, 98, 254, 246, 162, 95, 233, 123, 245, 39, 162, 91,
  ]);
  let vkeyPubkeyBech32 =
    "ed25519_pk1p9sf9wz3t46u9ghht44203gerxt82kzqaqw74fqrmwjmdy8sjxmqknzq8j";
  let vkeySignatureBech32 =
    "ed25519_sig1clmhgxx9e9t24wzgkmcsr44uq98j935evsjnrj8nn7ge08qrz0mgdxv5qtz8dyghs47q3lxwk4akq3u2ty8v4egeqvtl02ll0nfcqqq6faxl6";

  let plutusDataBytesFixture = (lib: typeof CSL) => {
    let x = lib.PlutusList.new();
    x.add(lib.PlutusData.new_bytes(plutusDataBytes));
    return x;
  };

  let vkeysFixture = (lib: typeof CSL) => {
    let vkeys = lib.Vkeywitnesses.new();
    vkeys.add(
      lib.Vkeywitness.new(
        lib.Vkey.new(lib.PublicKey.from_bech32(vkeyPubkeyBech32)),
        lib.Ed25519Signature.from_bech32(vkeySignatureBech32),
      ),
    );
    return vkeys;
  };

  let txWitnessSetFixture = (lib: typeof CSL) => {
    let txwset = lib.TransactionWitnessSet.new();
    txwset.set_plutus_data(plutusDataBytesFixture(lib));
    txwset.set_vkeys(vkeysFixture(lib));
    return txwset;
  };

  let csl = txWitnessSetFixture(CSL);
  let cslPlutusScripts = CSL.PlutusScripts.new();
  cslPlutusScripts.add(
    CSL.PlutusScript.from_hex_with_version(
      plutusScriptFixture1Hex,
      CSL.Language.new_plutus_v1(),
    ),
  );
  cslPlutusScripts.add(
    CSL.PlutusScript.from_hex_with_version(
      plutusScriptFixture2Hex,
      CSL.Language.new_plutus_v2(),
    ),
  );
  csl.set_plutus_scripts(cslPlutusScripts);

  let cdl = txWitnessSetFixture(CDL as any) as any as CDL.TransactionWitnessSet;
  let cdlPlutusScripts1 = CDL.PlutusScripts.new();
  cdlPlutusScripts1.add(CDL.PlutusScript.from_hex(plutusScriptFixture1Hex));
  cdl.set_plutus_scripts_v1(cdlPlutusScripts1);
  let cdlPlutusScripts2 = CDL.PlutusScripts.new();
  cdlPlutusScripts2.add(CDL.PlutusScript.from_hex(plutusScriptFixture2Hex));
  cdl.set_plutus_scripts_v2(cdlPlutusScripts2);

  test("serialize", () => {
    expect(cdl.to_hex()).toStrictEqual(csl.to_hex());
  });

  test("deserialize", () => {
    let cdl2 = CDL.TransactionWitnessSet.from_hex(csl.to_hex());
    expect(cdl2.to_hex()).toStrictEqual(csl.to_hex());
  });
});
