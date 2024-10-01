// This module tests that the classes generated in out.ts match the CSL API
// at the method level
import fs from "node:fs";
import { ClassInfo, MethodInfo, ParamInfo } from "./test_types";
import grammar, { ClassesSemantics } from "./generated/grammar.ohm-bundle"; 
import { describe, test } from "@jest/globals";

// The test parameters for constructing the table
type TestParameters = { comparedToMethod: MethodInfo, class: string };

const cslStrippedTxt  = fs.readFileSync("csl-types/csl-stripped.d.ts", { "encoding": "utf8" });
const cdlTxt  = fs.readFileSync("csl-types/cardano-data-lite.d.ts", { "encoding": "utf8" });

// Whether to print all the extracted class infos
const traceClassInfos = false;
// Arrays of parameters for the tests
let compareToCslTests: Array<TestParameters> = [];
let compareToCdlTests: Array<TestParameters> = [];

console.log("Parsing CSL declaration files...")
const cslMatch = grammar.match(cslStrippedTxt);
if (cslMatch.failed()) {
  throw cslMatch.message;
}
console.log("Parsing CDL declaration files...")
const cdlMatch = grammar.match(cdlTxt);
if (cdlMatch.failed()) {
  throw cdlMatch.message;
}

// We traverse the syntacitic tree to obtain a simplified description of the
// classes and method types. We only define the operations on the syntax nodes
// where it makes sense.
let semantics: ClassesSemantics = grammar.createSemantics();
semantics.addOperation<string>("string()", {
  identifier(node) {
    return node.sourceString;
  },
  Type(node) {
    return node.sourceString;
  }
}).addOperation<ParamInfo>("param()", {
  Param_mandatory(paramName, _colon, type) {
    return { nullable: false, name: paramName.string(), type: type.string() };
  },
  Param_nullable(paramName, _question, _colon, type) {
    return { nullable: true, name: paramName.string(), type: type.string() };
  }
}).addOperation<MethodInfo | undefined >("method()", {
  MethodDecl_static(_static, method) {
    let ret: MethodInfo = method.method();
    ret.static = true;
    return ret;
  },
  MethodDecl_instance(method) {
    let ret: MethodInfo = method.method()
    ret.static = false;
    return ret;
  },
  Method_with_void(name, _parens_open, paramsList, _parens_close, _colon, _void, _semicolon)  {
    return { name: name.string(), static: false, params: paramsList.asIteration().children.map((param) => param.param()), returnType: "undefined" };
  },
  Method_with_type(name, _parens_open, paramsList, _parens_close, _colon, type, _semicolon)  {
    return { name: name.string(), static: false, params: paramsList.asIteration().children.map((param) => param.param()), returnType: type.string() };
  },
  Method_without_type(name, _parens_open, paramsList, _parens_close, _semicolon) {
    return { name: name.string(), static: false, params: paramsList.asIteration().children.map((param) => param.param()), returnType: "undefined" };
  },
  DataDecl(_0, _1, _2) { 
    // ignore
    return undefined;
  }
}).addOperation<ClassInfo>("class()", {
  ClassDecl(_export, _declare, _class, className, _braceOpen, memberDecls, _braceClose) {
    let methods: Array<MethodInfo> = [];
    for (const member of memberDecls.children) {
      let method: MethodInfo | undefined = member.method();
      if (method) {
        methods.push(method);
      }
    }
    return { name: className.string(), methods: methods }
  }
}).addOperation<Array<ClassInfo>>("classes()", {
  ClassesDecl(classDecls) {
    let classes: Array<ClassInfo> = [];
    for (const classDecl of classDecls.children) {
      let cls: ClassInfo = classDecl.class();  
      if (cls) {
        classes.push(cls);
      }
    }
    return classes;
  }
});
 

console.log("Traversing parse tree of CSL type definitions...");
const cslClasses: Array<ClassInfo> = semantics(cslMatch).classes();
const cslClassesMap: Map<string, MethodInfo[]> = new Map(cslClasses.map((cls) => [cls.name, cls.methods]))
console.log("Traversing parse tree of CDL type definitions...");
const cdlClasses: Array<ClassInfo> = semantics(cdlMatch).classes();
const cdlClassesMap: Map<string, MethodInfo[]> = new Map(cdlClasses.map((cls) => [cls.name, cls.methods]))

// We trace all the classes as parsed
if (traceClassInfos) {
  for (const [name, clss] of [["CSL classes", cslClasses], ["CDL classes", cdlClasses]] as [string, ClassInfo[]][]) {
    console.log(`[TRACE] ${name}`)
    for (const cls of clss) {
      prettyClassInfo(cls);
    }
  }
}

// We construct the test tables
for (const cls of cslClasses) {
  for (const method of cls.methods) {
    compareToCslTests.push({class: cls.name, comparedToMethod: method})
  }
}
console.log("compareToCslTests: ", compareToCslTests.length)

for (const cls of cdlClasses) {
  for (const method of cls.methods) {
    compareToCdlTests.push({class: cls.name, comparedToMethod: method})
  }
}
console.log("compareToCdlTests: ", compareToCdlTests.length)

describe("Compare each CSL method to its CDL counterpart", () => {
  test.skip.each(compareToCslTests)("Comparing CDL's $class . $comparedToMethod.name to CSL's", (params) => {
    const methods = cdlClassesMap.get(params.class);
    expect(methods).toBeDefined();
    const method = methods?.find((info) => info.name == params.comparedToMethod.name)
    expect(method).toBeDefined();
    expect(method).toStrictEqual(params.comparedToMethod);
  })
});
describe("Compare each CDL method to its CSL counterpart", () => {
  test.each(compareToCdlTests)("Comparing CSL's $class . $comparedToMethod.name to CDL's", (params) => {
    const methods = cslClassesMap.get(params.class);
    expect(methods).toBeDefined();
    const method = methods?.find((info) => info.name == params.comparedToMethod.name)
    expect(method).toBeDefined();
    expect(method).toStrictEqual(params.comparedToMethod);
  })
});

// Utils
function prettyClassInfo(cls: ClassInfo): void {
  let msg = `[TRACE]\nClass: ${cls.name}\n`;
  for (const method of cls.methods) {
    msg = `${msg}\tMethod: ${method.name}\n\t\tStatic: ${method.static}\n\t\tReturn type: ${method.returnType}\n`;
    for (const param of method.params) {
      msg = `${msg}\t\t\tParameter: ${param.name}\n\t\t\t\tNullable: ${param.nullable}\n\t\t\t\tType: ${param.type}\n`;
    }
  }
  console.log(msg);
}
