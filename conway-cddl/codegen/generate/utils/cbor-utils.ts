import { SchemaTable } from "../../compiler";
import { GenEnumSimple } from "../enum_simple";

export function jsType(yamlType: string, customTypes: SchemaTable): string {
  if (customTypes[yamlType] != null) {
    return yamlType;
  }
  switch (yamlType) {
    case "string":
    case "number":
    case "boolean":
      return yamlType;
    case "bignum":
      return "bigint";
    case "bytes":
      return "Uint8Array";
    case "arrayToUint32Array":
      return "Uint32Array";
    default:
      console.error("Unknown type: " + yamlType);
      return "unknown";
  }
}

export function readType(
  customTypes: SchemaTable,
  reader: string,
  type: string,
): string {
  if (customTypes[type] != null) {
    if (customTypes[type].type == "enum_simple") {
      return GenEnumSimple.readType(type, reader);
    } else {
      return `${type}.deserialize(${reader})`;
    }
  }

  switch (type) {
    case "string":
      return `${reader}.readString()`;
    case "number":
      return `Number(${reader}.readInt())`;
    case "bignum":
      return `${reader}.readInt()`;
    case "boolean":
      return `${reader}.readBoolean()`;
    case "bytes":
      return `${reader}.readBytes()`;
    case "arrayToUint32Array":
      return `new Uint32Array(${reader}.readArray((reader) => Number(reader.readUint())));`;
    default:
      console.error("Can't decode: " + type);
      return `$$CANT_READ("${type}")`;
  }
}

export function writeType(
  customTypes: SchemaTable,
  writer: string,
  value: string,
  type: string,
) {
  if (customTypes[type] != null) {
    if (customTypes[type].type == "enum_simple") {
      return GenEnumSimple.writeType(type, value, writer);
    } else {
      return `${value}.serialize(${writer})`;
    }
  }

  switch (type) {
    case "string":
      return `${writer}.writeString(${value})`;
    case "number":
      return `${writer}.writeInt(BigInt(${value}))`;
    case "bignum":
      return `${writer}.writeInt(${value})`;
    case "boolean":
      return `${writer}.writeBoolean(${value})`;
    case "bytes":
      return `${writer}.writeBytes(${value})`;
    case "arrayToUint32Array":
      return `${writer}.writeArray(${value}, (writer, x) => writer.writeInt(BigInt(x)))`;
    default:
      console.error("Can't encode: " + type);
      return `$$CANT_WRITE("${type}")`;
  }
}

export function eqType(
  customTypes: SchemaTable,
  var1: string,
  var2: string,
  type: string,
) {
  if (customTypes[type] != null) {
    return `arrayEq(${var1}.to_bytes(), ${var2}.to_bytes())`;
  }

  switch (type) {
    case "string":
    case "number":
    case "bignum":
    case "boolean":
      return `${var1} === ${var2}`;
    case "bytes":
    case "arrayToUint32Array":
      return `arrayEq(${var1}, ${var2})`;
    default:
      console.error("Can't compare: " + type);
      return `$$CANT_EQ("${type}")`;
  }
}
