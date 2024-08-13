export interface CodeGenerator {
  generate(customTypes: Set<string>): string;
}
