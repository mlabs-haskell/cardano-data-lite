import * as yaml from "yaml";
import * as fs from "node:fs";
import * as path from "node:path";
import * as prettier from "prettier";
import * as process from "node:process";
import { Codegen } from ".";
import { Schema } from "./types";
import { Value } from "@sinclair/typebox/value";
import { fileURLToPath } from "node:url";

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

  let curFile = fileURLToPath(import.meta.url);
  let curDir = path.dirname(curFile);

  let srcDir = path.join(curDir, "..", "..", "src");
  let outUnformattedFile = path.join(srcDir, "generated-unformatted.ts");
  let outFile = path.join(srcDir, "generated.ts");

  let yamlDir = path.join(curDir, "..", "yaml");

  let files = [
    path.join(yamlDir, "conway.yaml"),
    path.join(yamlDir, "utils.yaml"),
  ];

  let customDir = path.join(yamlDir, "custom");

  for (let item of fs.readdirSync(customDir)) {
    item = path.join(customDir, item);
    if (!fs.statSync(item).isFile()) continue;
    if (item.endsWith(".yaml")) files.push(item);
  }

  let codegen = new Codegen();
  let hasAnyError = false;
  for (let filename of files) {
    let file = fs.readFileSync(filename, "utf8");
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
    import {CBORReader, bigintFromBytes} from "./lib/cbor/reader";
    import {CBORWriter} from "./lib/cbor/writer";
    import {GrowableBuffer} from "./lib/cbor/growable-buffer";
    import {hexToBytes, bytesToHex} from "./lib/hex";
    import {arrayEq} from "./lib/eq";
    import {bech32} from "bech32";
    import * as cdlCrypto from "./lib/bip32-ed25519";
    import {Address, Credential, CredKind, RewardAddress} from "./address";
    import {webcrypto} from "crypto";
    import { blake2b } from "@noble/hashes/blake2b";
    export * from "./address";


    // Polyfill the global "crypto" object if it doesn't exist
    if (typeof globalThis.crypto === 'undefined') {
        // @ts-expect-error: Assigning Node.js webcrypto to globalThis.crypto
        globalThis.crypto = webcrypto;
    }

    function $$UN(id: string, ...args: any): any {
      throw ("Undefined function: " + id);
    }
    const $$CANT_READ = (...args: any) => $$UN("$$CANT_READ", ...args);
    const $$CANT_WRITE = (...args: any) => $$UN("$$CANT_WRITE", ...args);
    const $$CANT_EQ = (...args: any) => $$UN("$$CANT_EQ", ...args);
    `;
    let out = header + codegen.generate();
    fs.writeFileSync(outUnformattedFile, out);
    out = await prettier.format(out, { parser: "babel-ts" });
    fs.writeFileSync(outFile, out);
  }
  if (!hasAnyError) {
    console.log("Success.");
  } else {
    console.log("Errors detected.");
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
