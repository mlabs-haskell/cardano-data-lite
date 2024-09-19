import * as yaml from "yaml";
import * as fs from "node:fs";
import * as prettier from "prettier";
import * as process from "node:process";
import { Codegen } from ".";
import { Schema } from "./types";
import { Value } from "@sinclair/typebox/value";

export type CLIArgs = {
  validateOnly: boolean;
};

function parseCLIArgs(): CLIArgs {
  let cliArgs: CLIArgs = {
    validateOnly: false,
  };
  let validateOnly: any = process.argv[2];
  if (validateOnly == "--validate-only") {
    cliArgs.validateOnly = true;
  }
  return cliArgs;
}

async function main() {
  let cliArgs = parseCLIArgs();

  let codegen = new Codegen();
  let hasAnyError = false;
  for (let filename of ["conway", "custom/bignum", "custom/int"]) {
    let file = fs.readFileSync(`../yaml/${filename}.yaml`, "utf8");
    let doc = yaml.parse(file);
    for (let [key, value] of Object.entries(doc)) {
      if ((value as any).custom == true) {
        continue;
      }
      try {
        hasAnyError = hasAnyError || validate(key, value);
        if (!cliArgs.validateOnly) {
          codegen.add(key, value as any);
        }
      } catch (error) {
        console.error("Error: ");
        console.error("Key: ", key);
        console.error(error);
      }
    }
  }

  if (!cliArgs.validateOnly) {
    let header = `
    import {CBORReader} from "../cbor/reader";
    import {CBORWriter} from "../cbor/writer";
    import {hexToBytes, bytesToHex} from "../hex";
    import {arrayEq} from "../eq";
    `;
    let out = codegen.generate();
    fs.writeFileSync("../../src/generated/out-unformatted.ts", out);
    out = await prettier.format(header + out, { parser: "babel-ts" });
    fs.writeFileSync("../../src/generated/out.ts", out);
    if (!hasAnyError) {
      console.log("Success.");
    } else {
      console.log("Errors detected.");
    }
  }
}

function validate(key: string, obj: any) {
  let errors = Value.Errors(Schema, obj);
  let hasAnyError = false;
  for (let error of errors) {
    console.error("Validation error in " + key, error);
    hasAnyError = true;
  }
  return hasAnyError;
}

await main();
