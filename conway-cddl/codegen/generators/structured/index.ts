import { CodeGeneratorBase, CodeGeneratorBaseOptions } from "..";
import { SchemaTable } from "../..";

type StructureField = {
  name: string;
  type: string;
  optional?: boolean;
  nullable?: boolean;
};

export type GenStructuredBaseOptions<Field extends StructureField> =
  CodeGeneratorBaseOptions & {
    fields: Field[];
    accessor_get_prefix?: boolean;
  };

export class GenStructuredBase<
  Field extends StructureField,
> extends CodeGeneratorBase {
  options: GenStructuredBaseOptions<Field>;
  accessorGetPrefix?: boolean;

  constructor(
    name: string,
    customTypes: SchemaTable,
    options: GenStructuredBaseOptions<Field>
  ) {
    super(name, customTypes, options);
    this.options = options;
    this.accessorGetPrefix = options.accessor_get_prefix;
  }

  private fieldType(field: Field) {
    return `${this.fieldBaseType(field)}${field.optional || field.nullable ? " | undefined" : ""}`;
  }

  // this ignores undefined
  private fieldBaseType(field: Field) {
    return `${this.typeUtils.jsType(field.type)}`;
  }

  // necessary because primitive fields do not have an arbitrary method
  private fieldArbitrary(field: Field, prng: string): string {
    let primitives: Set<string> = new Set(["Uint8Array", "number", "boolean"]);
    const fieldType: string = this.fieldBaseType(field);
    if (primitives.has(fieldType) ) {
      switch (fieldType) {
        case "Uint8Array":
          return `new Uint8Array(repeatRand(3, ${prng}, prand.uniformIntDistribution(0, 255))[0])`;
        case "number":
          return `prand.uniformIntDistribution(0, Number.MAX_SAFE_INTEGER, ${prng})[0]`;
        case "boolean":
          return `prand.unsafeUniformIntDistribution(0, 1, ${prng}) > 0`;
        default:
          throw new Error(`Unexpected primitive type ${fieldType}`);
      }
    } else {
      return `${field.type}.arbitrary(${prng})`;
    }
  }

  getFields(): Field[] {
    return this.options.fields;
  }

  getMinFields(): number {
    return this.options.fields.filter((v) => !v.optional).length
  }

  generateMembers(): string {
    return this.options.fields
      .map((x) => `private _${x.name}: ${this.fieldType(x)};`)
      .join("\n");
  }

  generateConstructor(): string {
    return `
      constructor(${this.getFields()
        .map((x) => `${x.name}: ${this.fieldType(x)}`)
        .join(", ")}) {
        ${this.getFields()
        .map((x) => `this._${x.name} = ${x.name};`)
        .join("\n")}
      }
      ${this.renameMethod(
          "new",
          (new_) => `
      static ${new_}(${this.getFields()
              .map((x) => `${x.name}: ${this.fieldType(x)}`)
              .join(", ")}) {
          return new ${this.name}(${this.getFields()
              .map((x) => x.name)
              .join(",")});
        }
      `
        )}
    `;
  }

  generateAccessors(): string {
    return this.getFields()
      .map(
        (x) => `
        ${this.renameMethod(
          this.accessorGetPrefix ? `get_${x.name}` : x.name,
          (get) => ` 
            ${get}(): ${this.fieldType(x)} {
              return this._${x.name};
            }`
        )}

        ${this.renameMethod(
          `set_${x.name}`,
          (set) => `
            ${set}(${x.name}: ${this.fieldType(x)}): void {
              this._${x.name} = ${x.name};
            }`
        )}
      `
      )
      .join("\n");
  }

  generateArbitrary(prng: string): string {
    const generateField = (f: Field) => {
      if (f.optional) {
        return `
            let ${f.name}: ${this.fieldType(f)};
            const ${f.name}_defined = prand.unsafeUniformIntDistribution(0, 1, ${prng});
            if (${f.name}_defined) {
              ${f.name} = ${this.fieldArbitrary(f, prng)};
              prand.unsafeSkipN(${prng}, 1);
            } else {
              ${f.name} = undefined;
            }
          `
      } else {
        return `
            let ${f.name}: ${this.fieldType(f)};
            ${f.name} = ${this.fieldArbitrary(f, prng)};
            prand.unsafeSkipN(${prng}, 1);
          `
      }

    }
    return `
      ${this.getFields().map(generateField).join('\n')}   

      return new ${this.name}(${this.getFields().map((f) => f.name)});
    `
  }

  generateExtraMethods(): string {
    return this.generateAccessors();
  }
}
