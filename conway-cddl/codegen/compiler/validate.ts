import * as yaml from "yaml";
import * as fs from "fs";
import { Schema } from "./types";
import { Value } from "@sinclair/typebox/value";

function validate(obj: any) {
  let errors = Value.Errors(Schema, obj);
  for (let error of errors) {
    console.error(error);
  }
}

let file = fs.readFileSync("../../yaml/conway.yaml", "utf8");
let doc = yaml.parse(file);
for (let [key, value] of Object.entries(doc)) {
  console.log(key);
  validate(value);
}
