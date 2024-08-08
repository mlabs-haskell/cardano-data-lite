/* TSGen:
	- begin function (name, args, retType) (push new scope, increase indent)
	- end function (close bracket, pop scope, decrease indent)
	- begin class/end class
	- begin method/end method
	- begin if/end if
	- begin for of/end for of
	- begin for/end for
	- begin while/end while
	- let(name) (error if variable is already in scope. Check only in latest scope)
	- assign(name, expr) (error if variable is not defined. Check iteratively all previous scopes, out to in)
	Doesn't output, just returns the string
	- funcall(fn, args)
		push to typechecker FnExists(new Error()) (the error value can be used to get filename, line, col)
	- methodcall(obj, method, args) (error if var is not defined)
		push to typechecker ClassExists, MethodExists
		var check doesn't need to be pushed as it can be done in single pass. 
	- expr(op, args...)
	- var: check if var is in scope
	- num
	- str
*/

export class TSGen {
  private indentLevel = 0;
  private spacePerIndentLevel = 2;

  // Intuition says incrementally concating immutable strings is terrible for
  // performance and I should put all strings in an array and join them at the end.
  // But data says otherwise:
  //  https://stackoverflow.com/questions/16696632/most-efficient-way-to-concatenate-strings-in-javascript
  private output = "";

  getOutput(): string {
    return this.output;
  }

  private pushLine(line: string) {
    const indent = " ".repeat(this.indentLevel * this.spacePerIndentLevel);
    this.output += indent;
    this.output += line;
    this.output += "\n";
  }

  beginFunction(name: string, args: [string, string][], retType: string) {
    this.pushLine(
      `export function ${name}(${args.map(([name, typ]) => `${name}: ${typ}`).join(", ")}): ${retType} {`,
    );
    this.indentLevel += 1;
  }

  endFunction() {
    this.indentLevel -= 1;
    this.pushLine("}");
  }

  beginClass(name: string) {
    this.pushLine(`export class ${name} {`);
    this.indentLevel += 1;
  }

  endClass() {
    this.indentLevel -= 1;
    this.pushLine("}");
  }

  beginMethod(name: string, args: [string, string][], retType: string) {
    this.pushLine(
      `${name}(${args.map(([name, typ]) => `${name}: ${typ}`).join(", ")}): ${retType} {`,
    );
    this.indentLevel += 1;
  }

  endMethod() {
    this.indentLevel -= 1;
    this.pushLine("}");
  }

  beginIf(cond: string) {
    this.pushLine(`if(${cond}) {`);
    this.indentLevel += 1;
  }

  elseIf(cond: string) {
    this.indentLevel -= 1;
    this.pushLine(`} else if(${cond}) {`);
    this.indentLevel += 1;
  }

  else() {
    this.indentLevel -= 1;
    this.pushLine("} else {");
    this.indentLevel += 1;
  }

  endIf() {
    this.indentLevel -= 1;
    this.pushLine("}");
  }

  beginForOf(variable: string, iterable: string) {
    this.pushLine(`for (const ${variable} of ${iterable}) {`);
    this.indentLevel += 1;
  }

  endForOf() {
    this.indentLevel -= 1;
    this.pushLine("}");
  }

  beginFor(init: string, cond: string, update: string) {
    this.pushLine(`for (${init}; ${cond}; ${update}) {`);
    this.indentLevel += 1;
  }

  endFor() {
    this.indentLevel -= 1;
    this.pushLine("}");
  }

  beginWhile(cond: string) {
    this.pushLine(`while (${cond}) {`);
    this.indentLevel += 1;
  }

  endWhile() {
    this.indentLevel -= 1;
    this.pushLine("}");
  }

  let(name: string, assignValue?: string) {
    this.pushLine(`let ${name}${assignValue ? ` = ${assignValue}` : ""};`);
  }

  assign(name: string, expr: string) {
    this.pushLine(`${name} = ${expr};`);
  }

  stmt(expr: string) {
    this.pushLine(expr + ";");
  }

  /* The following methods generate and combine expressions.
   * Unless stmt(expr) is called, they won't be included in the output. */

  callFunc(fn: string, args: string[]) {
    return `${fn}(${args.join(", ")})`;
  }

  methodCall(obj: string, method: string, args: string[]) {
    return `${obj}.${method}(${args.join(", ")})`;
  }

  op(op: string, ...args: string[]) {
    return `${args.join(" " + op + " ")}`;
  }

  var(name: string) {
    return name;
  }

  num(num: number) {
    return num.toString();
  }

  str(str: string) {
    return `"${str}"`;
  }

  paren(expr: string) {
    return `(${expr})`;
  }
}

class Typechecker {}

type IdentKind =
  | { kind: "variable"; type: string }
  | { kind: "class"; members: { [key: string]: IdentKind } }
  | { kind: "function"; args: string[]; retType: string };
