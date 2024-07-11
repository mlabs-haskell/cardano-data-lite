import { GenRoot } from ".";

export class GenAlias implements GenRoot {
  name: string;
  rhs: string;

  constructor(name: string, rhs: string) {
    this.name = name;
    this.rhs = rhs;
  }

  generate(): string {
    return `
      export type ${this.name} = ${this.rhs};
    `;
  }
}
