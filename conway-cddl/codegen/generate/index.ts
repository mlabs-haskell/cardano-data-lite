import { SchemaTable } from "../compiler";

export interface CodeGenerator {
  generate(customTypes: SchemaTable): string;
}
