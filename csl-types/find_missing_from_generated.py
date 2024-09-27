"""
Find class exports which are present in csl-stripped.d.ts, but not in generated/out.ts
"""

import re

RE_CLASS_EXPORT = r'export class (\w+)'
RE_ENUM_EXPORT = r'export enum (\w+)'
RE_RENAME_EXPORT = r'export { (\w+) as (\w+) }'

excluded = [
    "TransactionBatch",
    "TransactionBatchList",
    "Strings",
    "ChangeConfig",
    "FixedBlock",
    "FixedTransaction",
    "FixedTransactionBodies",
    "FixedTransactionBody",
    "FixedTxWitnessesSet",
    "FixedVersionedBlock",
    "LinearFee",  # used in min_fee
    "DataCost",  # used in min_ada_for_output)
    "TransactionUnspentOutput",  # used in create_send_all
    "TransactionUnspentOutputs",  # used in create_send_all
    "NetworkInfo",
    "Committee",  # TODO: Why?
    "VersionedBlock",
]

def parse_line(line: str):
    line = line.strip()
    if not line.startswith("export"):
        return None
    if (match := re.search(RE_CLASS_EXPORT, line)) is not None: 
        return ('class', match.group(1))
    if (match := re.search(RE_ENUM_EXPORT, line)) is not None:
        return ('enum', match.group(1))
    if (match := re.search(RE_RENAME_EXPORT, line)) is not None:
        return ('rename', match.group(1), match.group(2))
    return None

def parse_file(filename: str):
    exports = {}
    aliases = []

    with open(filename) as f:
        for line in f:
            match = parse_line(line)
            if match is None: 
                continue
            kind, *args = match
            if kind == 'class':
                exports[args[0]] = 'class'
            elif kind == 'enum':
                exports[args[0]] = 'enum'
            elif kind == 'rename':
                aliases.append(args)

    for old_name, new_name in aliases:
        exports[new_name] = exports[old_name]

    return exports

src_exports = parse_file("./csl-stripped.d.ts")
gen_exports = parse_file("../src/generated/out.ts")

missing_types = []

for name, kind in src_exports.items():
    if kind == "class" and name not in gen_exports:
        missing_types.append(name)

crypto_types = []
other_types = []
for t in missing_types:
    if t in excluded:
        continue
    if any(x in t.lower() for x in ["hash", "address", "signature", "key"]):
        crypto_types.append(t)
    else:
        other_types.append(t)


print("Crypto:")
for t in crypto_types:
    print(t)

print()
print("Others:")
for t in other_types:
    print(t)
