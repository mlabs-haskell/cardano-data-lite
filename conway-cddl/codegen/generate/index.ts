import { SchemaTable } from "../compiler";

export class CodeGeneratorBase {
  name: string;
  typeUtils: TypeUtils;

  constructor(name: string, customTypes: SchemaTable) {
    this.name = name;
    this.typeUtils = new TypeUtils(customTypes);
  }

  deserialize(reader: string): string {
    return `${this.name}.deserialize(${reader})`;
  }

  serialize(writer: string, value: string): string {
    return `${value}.serialize(${writer})`;
  }

  eq(var1: string, var2: string): string {
    return `arrayEq(${var1}.to_bytes(), ${var2}.to_bytes())`;
  }

  generate(): string {
    return `
      export class ${this.name} {
        constructor() {}
        static deserialize(reader: CBORWriter) { throw new Error("Not Implemented"); }
        serialize(writer: CBORWriter) { throw new Error("Not Implemented"); }
      }
    `;
  }
}

export class TypeUtils {
  customTypes: SchemaTable;

  constructor(customTypes: SchemaTable) {
    this.customTypes = customTypes;
  }

  jsType(yamlType: string): string {
    if (this.customTypes[yamlType] != null) {
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

  readType(reader: string, type: string): string {
    let codegen = this.customTypes[type];
    if (codegen != null) {
      return codegen.deserialize(reader);
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

  writeType(writer: string, value: string, type: string) {
    let codegen = this.customTypes[type];
    if (codegen != null) {
      return codegen.serialize(writer, value);
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

  eqType(var1: string, var2: string, type: string) {
    let codegen = this.customTypes[type];
    if (codegen != null) {
      return codegen.eq(var1, var2);
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
}
