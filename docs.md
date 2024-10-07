### Documentation

Cardano Data Lite aims to be as API compatible with Cardano Serialization Library as possible.

So the original documentation for CSL can be used as-is:
https://developers.cardano.org/docs/get-started/cardano-serialization-lib/overview/

There are some rare cases where we had to differ from CSL API. Documentation for those parts and the motivation for the differences are noted below.

## Changes from from CSL

The following sections outline key differences in the API between the Cardano Data Lite (CDL) and the Cardano Serialization Library (CSL).

### `Certificate.Kind`:

CSL crams the `RegCert` and `StakeRegistration` functionalities into a single class `StakeRegistration`.
Same for `UnregCert` and `StakeDeregistration`.
The API to construct the `Certificate` type still has separate constructor for
these, so users who construct, deconstruct and otherwise interact with the
`Certificate` type is unaffected.
But users who inspect the value of `Certificate.kind()` will see that CSL doesn't have an entry for the `RegCert` or `UnregCert` variant, while CDL does.

We decided to do it this way because they are distinct types in conway.cddl and it's easier to think of them as separate types.

Regardless, we are API compatible with CSL except for the `kind()` method.

### `PointerAddress`:

We have removed support for `PointerAddress` because CTL doesn't use them and
generally it's rarely used. We will add this later if needed.

### `PlutusScripts`:

We differ from CSL API where CSL has:

```
TransactionWitnessSet:
    - plutus_scripts: PlutusScripts
PlutusScripts: Array of PlutusScript
PlutusScript:
    language_version: number
    bytes: Uint8Array
```

The issue here is that the following assertion doesn't hold:

```
let plutus_scripts_a = ...;
let plutus_scripts_b = PlutusScripts.from_hex(plutus_scripts.to_hex());

assert(plutus_scripts_a.to_hex() == plutus_scripts_b.to_hex())
```

The `to_hex()` method has no way of encoding language version because the Conway CDDL spec doesn't have a field for encoding language version.

Instead, the Conway CDDL spec has:

```
transaction_witness_set =
    { ..
    , ? 3: nonempty_set<plutus_v1_script>
    , ? 6: nonempty_set<plutus_v2_script>
    , ? 7: nonempty_set<plutus_v3_script>
    }
```

A script is considered v1 or v2 depending on which field it's put in.

We adapted the API to more closely follow the Conway CDDL spec.

```
TransactionWitnessSet:
    - plutus_script_v1: PlutusScripts
    - plutus_script_v2: PlutusScripts
    - plutus_script_v3: PlutusScripts
PlutusScripts: Array of Uint8Array
```

Here the previous assertion holds. We uphold the contract that `Foo.from_hex(foo.to_hex())` and `Foo.from_bytes(foo.to_bytes())` are identical to `foo`.
