"""
Find class exports which are present in csl-stripped.d.ts, but not in generated/out.ts
"""

src_exports = []
with open("./csl-stripped.d.ts") as src:
    for line in src:
        line = line.strip()
        if line.startswith("export "):
            src_exports.append(line)

gen_exports = []
with open("../src/generated/out.ts") as gen:
    for line in gen:
        line = line.strip()
        if line.startswith("export "):
            gen_exports.append(line)


for x in src_exports:
    if x not in gen_exports:
        if x.startswith("export class"):
            print(x.split()[2])
