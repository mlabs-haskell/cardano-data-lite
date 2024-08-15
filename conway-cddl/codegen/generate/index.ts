import { SchemaTable } from "../compiler";
import { genCSL } from "./utils/csl";

export type CodeGeneratorBaseOptions = {
  genCSL?: boolean;
  tagged?: {
    tag: number;
    bytes?: boolean;
  };
};
export class CodeGeneratorBase {
  name: string;
  typeUtils: TypeUtils;
  options: CodeGeneratorBaseOptions;

  constructor(
    name: string,
    customTypes: SchemaTable,
    options: CodeGeneratorBaseOptions = {},
  ) {
    this.name = name;
    this.typeUtils = new TypeUtils(customTypes);
    this.options = options;
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

  generateMembers(): string {
    return "";
  }

  generateConstructor(): string {
    return `constructor() {}`;
  }

  generatePre(): string {
    return "";
  }

  generatePost(): string {
    return "";
  }

  generateDeserialize(_reader: string): string {
    return `throw new Error("Not Implemented");`;
  }

  generateSerialize(_writer: string): string {
    return `throw new Error("Not Implemented");`;
  }

  generateExtraMethods(): string {
    return "";
  }

  generate(): string {
    let deserialize;
    let serialize;

    if (this.options.tagged != null) {
      let deserializeInner;
      let serializeInner;
      if (this.options.tagged.bytes) {
        deserializeInner = `
          let innerBytes = reader.readBytes();
          let innerReader = new CBORReader(innerBytes);
          return ${this.name}.deserializeInner(innerReader);
        `;
        serializeInner = `
          let innerWriter = new CBORWriter();
          ${this.name}.serializeInner(innerWriter);
          reader.writeBytes(innerWriter.getBytes());
        `;
      } else {
        deserializeInner = `
          return ${this.name}.deserializeInner(reader);
        `;
        serializeInner = `
          ${this.name}.serializeInner(writer);
        `;
      }

      deserialize = `
        static deserialize(reader: CBORReader): ${this.name} {
          let taggedTag = reader.readTaggedTag();
          if (taggedTag != ${this.options.tagged.tag}) {
            throw new Error("Expected tag ${this.options.tagged.tag}, got " + taggedTag);
          }
          ${deserializeInner}
        }

        static deserializeInner(reader: CBORReader): ${this.name} {
          ${this.generateDeserialize("reader")}
        }`;

      serialize = `
        serialize(writer: CBORWriter): void {
          writer.writeTaggedTag(${this.options.tagged.tag});
          ${serializeInner}
        }

        serializeInner(writer: CBORWriter): void {
          ${this.generateSerialize("writer")}
        }`;
    } else {
      deserialize = `
        static deserialize(reader: CBORReader): ${this.name} {
          ${this.generateDeserialize("reader")}
        }`;

      serialize = `
        serialize(writer: CBORWriter): void {
          ${this.generateSerialize("writer")}
        }`;
    }

    return `
      ${this.generatePre()}

      export class ${this.name} {
        ${this.generateMembers()}
        ${this.generateConstructor()}

        ${this.generateExtraMethods()}

        ${deserialize}
        ${serialize}

        ${this.options.genCSL ? genCSL(this.name) : ""}
      }

      ${this.generatePost()}
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
