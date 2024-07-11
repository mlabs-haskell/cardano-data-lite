import * as yaml from "yaml";
import * as fs from "node:fs";
import * as prettier from "prettier";
import { Compiler } from "./compiler";

async function main() {
  let compiler = new Compiler();
  for (let filename of ["conway", "crypto", "extra"]) {
    let file = fs.readFileSync(`../yaml/${filename}.yaml`, "utf8");
    let doc = yaml.parse(file);
    for (let [key, value] of Object.entries(doc)) {
      if ((value as any).custom == true) {
        continue;
      }
      try {
        compiler.compile(key, value as any);
      } catch (error) {
        console.error("Error: ");
        console.error("Key: ", key);
        console.error(error);
      }
    }
  }
  let header = `
    import {CBORValue, CBORMap} from "../cbor/types";
    import {CBORArrayReader, CBORMapReader, CBORReaderValue} from "../cbor/reader";
    import {CBORWriter} from "../cbor/writer";
  `;
  let out = compiler.generate();
  out = await prettier.format(header + out, { parser: "babel-ts" });
  fs.writeFileSync("../../src/generated/out.ts", out);
}

await main();
