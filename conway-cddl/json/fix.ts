import * as yaml from "yaml";
import fs from "fs";
import { exit } from "process";

// create a function to load a yaml and recursively for each key, if key.type == record, then for each key.fields rename type field to value
function loadAndRenameFields(filePath: string, savePath: string): void {
  try {
    const data = yaml.parseDocument(fs.readFileSync(filePath, "utf8"), {
      intAsBigInt: true,
      keepSourceTokens: true,
    });
    recursivelyRenameFields(data.contents);
    const updatedYaml = yaml.stringify(data, {
      keepSourceTokens: true,
    });
    fs.writeFileSync(savePath, updatedYaml, "utf8");
    console.log("Fields renamed successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
}

function renameField(
  map: yaml.YAMLMap<yaml.ParsedNode, yaml.ParsedNode | null>,
  key: string,
  newKey: string
): void {
  for (let item of map.items) {
    if (!(item.key instanceof yaml.Scalar))
      throw "Expected key to be a Scalar!";
    if (item.key.value == key) {
      item.key.value = newKey;
    }
  }
}

function recursivelyRenameFields(obj: any): void {
  if (obj instanceof yaml.YAMLMap) {
    let type = obj.get("type");
    if (type == "record" || type == "struct" || type == "group") {
      console.log("Found " + type + "!");
      let fields = obj.get("fields");
      if (!(fields instanceof yaml.YAMLSeq)) {
        throw "Expected fields to be a YAMLSeq!";
      }
      for (let item of fields.items) {
        if (!(item instanceof yaml.YAMLMap)) {
          throw "Expected item to be a YAMLMap!";
        }
        renameField(item, "name", "key");
        renameField(item, "type", "value");
      }
    } else if (type == "tagged_record") {
      console.log("Found " + type + "!");
      let variants = obj.get("variants");
      if (!(variants instanceof yaml.YAMLSeq)) {
        throw "Expected variants to be a YAMLSeq!";
      }

      for (let variant of variants.items) {
        let fields = variant.get("fields");
        if (fields === undefined) continue;
        if (!(fields instanceof yaml.YAMLSeq)) {
          throw "Expected fields to be a YAMLSeq! " + String(fields);
        }
        for (let item of fields.items) {
          if (!(item instanceof yaml.YAMLMap)) {
            throw "Expected item to be a YAMLMap!";
          }
          renameField(item, "type", "value");
        }
      }
    } else if (type == "map") {
      console.log("Found map!");
      renameField(obj, "key_type", "key");
      renameField(obj, "value_type", "value");
    } else if (type == "array" || type == "nullable") {
      console.log("Found " + type + "!");
      renameField(obj, "item_type", "item");
    } else if (type == "union") {
      console.log("Found " + type + "!");
      let variants = obj.get("variants");
      for (let variant of variants.items) {
        variant.delete("type_discriminator");
        renameField(variant, "type_details", "item");
      }
    } else if (type == "uint" || type == "nint" || type == "int") {
      // change value: {eq: x} to value: x
      if (obj.has("value")) {
        let value = obj.get("value");
        if (value instanceof yaml.YAMLMap) {
          if (value.has("eq")) {
            obj.set("value", value.get("eq"));
          }
        }
      } else {
        let value = new yaml.YAMLMap();
        let toAddValue = false;
        if (obj.has("min")) {
          value.set("min", obj.get("min"));
          obj.delete("min");
          toAddValue = true;
        }
        if (obj.has("max")) {
          value.set("max", obj.get("max"));
          obj.delete("max");
          toAddValue = true;
        }
        if (toAddValue) {
          console.log("Found " + type + "!");
          obj.set("value", value);
        }
      }
    }

    if (
      type == "array" ||
      type == "bytes" ||
      type == "string" ||
      type == "map"
    ) {
      // change len: {eq: x} to len: x
      if (obj.has("len")) {
        let len = obj.get("len");
        if (len instanceof yaml.YAMLMap) {
          if (len.has("eq")) {
            obj.set("len", len.get("eq"));
          }
        }
      } else {
        let value = new yaml.YAMLMap();
        let toAddValue = false;
        if (obj.has("minLen")) {
          value.set("min", obj.get("minLen"));
          obj.delete("minLen");
          toAddValue = true;
        }
        if (obj.has("min_len")) {
          value.set("min", obj.get("min_len"));
          obj.delete("min_len");
          toAddValue = true;
        }

        if (obj.has("maxLen")) {
          value.set("max", obj.get("maxLen"));
          obj.delete("maxLen");
          toAddValue = true;
        }
        if (obj.has("max_len")) {
          value.set("max", obj.get("max_len"));
          obj.delete("max_len");
          toAddValue = true;
        }

        if (toAddValue) {
          console.log("Found minLen/maxLen in array!");
          obj.set("len", value);
        }
      }
    }

    for (let item of obj.items) {
      recursivelyRenameFields(item.value);
    }
  } else if (obj instanceof yaml.YAMLSeq) {
    for (let item of obj.items) {
      recursivelyRenameFields(item);
    }
  }
}

loadAndRenameFields("./conway.yaml", "./update-conway.yaml");
loadAndRenameFields("./crypto.yaml", "./update-crypto.yaml");
loadAndRenameFields("./extra.yaml", "./update-extra.yaml");
