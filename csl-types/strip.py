with open("./cardano_serialization_lib.d.ts") as f:
    with open("./csl-stripped.d.ts", "w") as of:
        skip_till_token = None
        skip_till_line = None
        for line in f:
            line_ = line.strip()
            if skip_till_token is not None:
                if skip_till_token in line:
                    skip_till_token = None
                continue
            if skip_till_line is not None:
                if line_ == skip_till_line:
                    skip_till_line = None
                continue
            if line_.startswith(r"/**"):
                skip_till_token = r"*/"
            elif line_.startswith("export interface") and "JSON" in line:
                skip_till_line = "}"
            elif line_.startswith("export type") and "JSON" in line:
                if not line_.endswith(";"):
                    if line_.endswith("["):
                        skip_till_line = "];"
                    else:
                        skip_till_line = "};"
            elif line_.startswith("export class") and "Builder" in line:
                skip_till_line = "}"
            elif any(
                line_.startswith(x)
                for x in [
                    "to_json()",
                    "to_js_value()",
                ]
            ):
                pass
            else:
                if line_.startswith("export class") or line_.startswith("export enum"):
                    of.write("\n")
                of.write(line)
