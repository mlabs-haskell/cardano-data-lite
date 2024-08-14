import * as yaml from "yaml";
import * as fs from "node:fs";
import * as prettier from "prettier";
import { Compiler } from "./compiler";

async function main() {
  let compiler = new Compiler();
  for (let filename of ["conway"]) {
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
    import {CBORReader} from "../cbor/reader";
    import {CBORWriter} from "../cbor/writer";
    import {hexToBytes, bytesToHex} from "../hex";
    import {arrayEq} from "../eq";

  `;
  let out = compiler.generate();
  fs.writeFileSync("../../src/generated/out-unformatted.ts", out);
  out = await prettier.format(header + out, { parser: "babel-ts" });
  fs.writeFileSync("../../src/generated/out.ts", out);
}

await main();
