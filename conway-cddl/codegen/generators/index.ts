import { SchemaTable } from "..";

export type CodeGeneratorBaseOptions = {
  csl_name?: string;
  genCSL?: boolean;
  tagged?: {
    tag: number;
    bytes?: boolean;
  };
  extra_methods?: string;
  methods?: { [key: string]: string | null };
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

  renameMethod(name: string, contents?: (name: string) => string): string {
    if (
      this.options.methods == null ||
      !Object.hasOwn(this.options.methods, name)
    ) {
      return contents != null ? contents(name) : name;
    }
    let newName = this.options.methods[name];
    if (newName == null) return contents == null ? name : "";
    return contents != null ? contents(newName) : newName;
  }

  deserialize(reader: string, path: string): string {
    return `${this.name}.deserialize(${reader}, ${path})`;
  }

  serialize(writer: string, value: string): string {
    return `${value}.serialize(${writer})`;
  }

  eq(var1: string, var2: string): string {
    return `arrayEq(${var1}.to_bytes(), ${var2}.to_bytes())`;
  }

  generateCSLHelpers() {
    return `  
    ${this.renameMethod(
      "free",
      (free) => `
    // no-op
    ${free}(): void {}`,
    )}


    ${this.renameMethod(
      "from_bytes",
      (from_bytes) => `
    static ${from_bytes}(data: Uint8Array, path: string[] = ['${this.name}']): ${this.name} {
      let reader = new CBORReader(data);
      return ${this.deserialize("reader", "path")}
    }`,
    )}


    ${this.renameMethod(
      "from_hex",
      (from_hex) => `
    static ${from_hex}(hex_str: string, path: string[] = ['${this.name}']): ${this.name} {
      return ${this.name}.${this.renameMethod("from_bytes")}(hexToBytes(hex_str), path);
    }`,
    )}

    
    ${this.renameMethod(
      "to_bytes",
      (to_bytes) => `
    ${to_bytes}(): Uint8Array {
      let writer = new CBORWriter();
      ${this.serialize("writer", "this")}
      return writer.getBytes();
    }`,
    )}


    ${this.renameMethod(
      "to_hex",
      (to_hex) => `
    ${to_hex}(): string {
      return bytesToHex(this.${this.renameMethod("to_bytes")}());
    }`,
    )}

    ${this.renameMethod(
      "clone",
      (clone) => `
    ${clone}(path: string[]): ${this.name} {
      return ${this.name}.${this.renameMethod("from_bytes")}(this.${this.renameMethod("to_bytes")}(), path);
    }`,
    )}

  `;
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

  generateDeserialize(_reader: string, _path: string): string {
    return `throw new Error("Not Implemented");`;
  }

  generateSerialize(_writer: string): string {
    return `throw new Error("Not Implemented");`;
  }

  generateExtraMethods(): string {
    return "";
  }

  generate(): string {
    let deserialize: string;
    let serialize: string;

    if (this.options.tagged != null) {
      let deserializeInner: string;
      let serializeInner: string;
      if (this.options.tagged.bytes) {
        deserializeInner = `
          let innerBytes = reader.readBytes(path);
          let innerReader = new CBORReader(innerBytes);
          return ${this.name}.deserializeInner(innerReader, path);
        `;
        serializeInner = `
          let innerWriter = new CBORWriter();
          this.serializeInner(innerWriter);
          reader.writeBytes(innerWriter.getBytes());
        `;
      } else {
        deserializeInner = `
          return ${this.name}.deserializeInner(reader, path);
        `;
        serializeInner = `
          this.serializeInner(writer);
        `;
      }

      deserialize = `
        ${this.renameMethod(
          "deserialize",
          (deserialize) => `
        static ${deserialize}(reader: CBORReader, path: string[] = ['${this.name}']): ${this.name} {
          let taggedTag = reader.readTaggedTag(path);
          if (taggedTag != ${this.options.tagged!.tag}) {
            throw new Error("Expected tag ${this.options.tagged!.tag}, got " + taggedTag + " (at " + path + ")");
          }
          ${deserializeInner}
        }`,
        )}

        static deserializeInner(reader: CBORReader, path: string[]): ${this.name} {
          ${this.generateDeserialize("reader", "path")}
        }`;

      serialize = `
        ${this.renameMethod(
          "serialize",
          (serialize) => `
        ${serialize}(writer: CBORWriter): void {
          writer.writeTaggedTag(${this.options.tagged!.tag});
          ${serializeInner}
        }`,
        )}

        serializeInner(writer: CBORWriter): void {
          ${this.generateSerialize("writer")}
        }`;
    } else {
      deserialize = `
        ${this.renameMethod(
          "deserialize",
          (deserialize) => `
        static ${deserialize}(reader: CBORReader, path: string[]): ${this.name} {
          ${this.generateDeserialize("reader", "path")}
        }`,
        )}
  
        `;

      serialize = `
        ${this.renameMethod(
          "serialize",
          (serialize) => `
        ${serialize}(writer: CBORWriter): void {
          ${this.generateSerialize("writer")}
        }`,
        )}

        `;
    }

    return `
      ${this.generatePre()}

      export class ${this.name} {
        ${this.generateMembers()}
        ${this.generateConstructor()}

        ${this.generateExtraMethods()}

        ${deserialize}
        ${serialize}

        ${this.options.genCSL ? this.generateCSLHelpers() : ""}

        ${this.options.extra_methods ? this.options.extra_methods : ""}
      }

      ${this.generatePost()}
  
      ${
        this.options.csl_name != null
          ? `
      export { ${this.name} as ${this.options.csl_name} };
      `
          : ""
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
      case "bigint":
        return yamlType;
      case "bytes":
        return "Uint8Array";
      default:
        console.error("Unknown type: " + yamlType);
        return "unknown";
    }
  }

  readType(reader: string, type: string, path: string): string {
    let codegen = this.customTypes[type];
    if (codegen != null) {
      return codegen.deserialize(reader, path);
    }

    switch (type) {
      case "string":
        return `${reader}.readString(${path})`;
      case "number":
        return `Number(${reader}.readInt(${path}))`;
      case "bigint":
        return `${reader}.readInt(${path})`;
      case "boolean":
        return `${reader}.readBoolean(${path})`;
      case "bytes":
        return `${reader}.readBytes(${path})`;
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
      case "bigint":
        return `${writer}.writeInt(${value})`;
      case "boolean":
        return `${writer}.writeBoolean(${value})`;
      case "bytes":
        return `${writer}.writeBytes(${value})`;
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
      case "bigint":
      case "boolean":
        return `${var1} === ${var2}`;
      case "bytes":
      default:
        console.error("Can't compare: " + type);
        return `$$CANT_EQ("${type}")`;
    }
  }
}
