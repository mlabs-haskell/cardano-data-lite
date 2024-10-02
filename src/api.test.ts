// This module tests that the classes generated in out.ts match the CSL API
// at the method level
import fs from "node:fs";
import { ClassInfo, MethodInfo, ParamInfo, SomeType } from "./test_types";
import grammar, { ClassesSemantics } from "./generated/grammar.ohm-bundle";
import { describe, test } from "@jest/globals";

//// TEST CONFIG ////
// Whether to print all the extracted class infos
const traceClassInfos = false;
// Whether to skip undefined methods
const skipUndefinedMethods = false;
// Whether to skip undefined classes
const skipUndefinedClasses = false;

// The test parameters for constructing the table
type TestParameters = { n: number, comparedToMethod: MethodInfo, class: string };

const cslStrippedTxt = fs.readFileSync("csl-types/csl-stripped.d.ts", { "encoding": "utf8" });
const cdlTxt = fs.readFileSync("csl-types/cardano-data-lite.d.ts", { "encoding": "utf8" });

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

// We traverse the syntactic tree to obtain a simplified description of the
// classes and method types. We only define the operations on the syntax nodes
// where it makes sense.
let semantics: ClassesSemantics = grammar.createSemantics();
semantics.addOperation<SomeType>("type()", {
  Type_simple(ident) {
    return { tag: "simple", ident: ident.sourceString };
  },
  Type_nullable(type, _bar, _undefined) {
    return { tag: "nullable", type: type.type() };
  },
  Type_array(type, _brackets) {
    return { tag: "array", type: type.type() };
  },
  Type_tuple(_bracketOpen, typesIter, _bracketClose) {
    let types: Array<SomeType> = [];
    for (const typeNode of typesIter.asIteration().children) {
      types.push(typeNode.type());
    }
    return { tag: "tuple", types: types };
  }
}).addOperation<ParamInfo>("param()", {
  Param_mandatory(paramName, _colon, type) {
    return { name: paramName.sourceString, type: type.type() };
  },
  Param_nullable(paramName, _question, _colon, type) {
    return { name: paramName.sourceString, type: type.type() };
  }
}).addOperation<MethodInfo | undefined>("method()", {
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
  Method_with_void(name, _parens_open, paramsList, _parens_close, _colon, _void, _semicolon) {
    return { name: name.sourceString, static: false, params: paramsList.asIteration().children.map((param) => param.param()), returnType: { tag: "simple", ident: "undefined" } };
  },
  Method_with_type(name, _parens_open, paramsList, _parens_close, _colon, type, _semicolon) {
    return { name: name.sourceString, static: false, params: paramsList.asIteration().children.map((param) => param.param()), returnType: type.type() };
  },
  Method_without_type(name, _parens_open, paramsList, _parens_close, _semicolon) {
    return { name: name.sourceString, static: false, params: paramsList.asIteration().children.map((param) => param.param()), returnType: { tag: "simple", ident: "undefined" } };
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
    return { name: className.sourceString, methods: methods }
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
let n: number = 0;
for (const cls of cslClasses) {
  for (const method of cls.methods) {
    compareToCslTests.push({ n: n, class: cls.name, comparedToMethod: method })
    n += 1;
  }
}
console.log("compareToCslTests.length: ", compareToCslTests.length)

n = 0;
for (const cls of cdlClasses) {
  for (const method of cls.methods) {
    compareToCdlTests.push({ n: n, class: cls.name, comparedToMethod: method })
    n += 1;
  }
}
console.log("compareToCdlTests.length: ", compareToCdlTests.length)

// Used for debugging 
// 984
const testN = 984;
const testNConfig = { testTable: compareToCdlTests, srcMap: cslClassesMap };
test.skip(`Test N. ${testN}`, () => {
  const { testTable, srcMap } = testNConfig;
  const params = testTable[testN];
  compareToClass(srcMap, params.class, params.comparedToMethod);
});

// Tests
describe("Compare each CSL class/method to its CDL counterpart", () => {
  test.each(compareToCslTests)("($n) Comparing CDL's $class . $comparedToMethod.name to CSL's", (params) => {
    compareToClass(cdlClassesMap, params.class, params.comparedToMethod);
  })
});

describe("Compare each CDL class/method to its CSL counterpart", () => {
  test.each(compareToCdlTests)("($n) Comparing CSL's $class . $comparedToMethod.name to CDL's", (params) => {
    compareToClass(cslClassesMap, params.class, params.comparedToMethod);
  })
});

// Test Utils
function prettyClassInfo(cls: ClassInfo): void {
  let msg = `[TRACE]\nClass: ${cls.name}\n`;
  for (const method of cls.methods) {
    msg = `${msg}\tMethod: ${method.name}\n\t\tStatic: ${method.static}\n\t\tReturn type: ${method.returnType}\n`;
    for (const param of method.params) {
      msg = `${msg}\t\t\tParameter: ${param.name}\n\t\t\t\tType: ${param.type}\n`;
    }
  }
  console.log(msg);
}

function compareToClass(clss: Map<string, MethodInfo[]>, cls: string, comparedToMethod: MethodInfo) {
  const methods = clss.get(cls);
  if (!skipUndefinedClasses) {
    // The compared class should exist
    expect(methods).toBeDefined();
  }
  if (methods) {
    const method = methods.find((info) => info.name == comparedToMethod.name)
    compareToMethod(method, comparedToMethod);
  }
}

function compareToMethod(method1: MethodInfo | undefined, method2: MethodInfo) {
  if (!skipUndefinedMethods) {
    // The compared method should be defined
    expect(method1).toBeDefined();
  }
  if (method1) {
    // Method names should match
    expect(method1.name).toEqual(method2.name);
    // Return types should match
    compareTypes(method1.returnType, method2.returnType);
    // Static qualifiers should match
    expect(method1.static).toEqual(method2.static);
    // Methods should have the same number of parameters
    expect(method1.params.length).toEqual(method2.params.length);
    // All parameter types should match (names do not, however)
    for (let i = 0; i < method1.params.length; i++) {
      const param1 = method1.params[i];
      const param2 = method2.params[i];
      // Types should match
      compareTypes(param1.type, param2.type);
    }
  }
}

// We normalize types. At runtime, `undefined` and `T` are equivalent, and so are `undefined | T`
// and `T`. For this reason, we strip the `undefined`s to make type comparisons simpler.
function normalizeType(ty: SomeType): SomeType {
  switch (ty.tag) {
    case "nullable": {
      return normalizeType(ty.type);
    }
    case "array": {
      return { tag: "array", type: normalizeType(ty.type) }
    }
    case "tuple": {
      return { tag: "tuple", types: ty.types.map(normalizeType) }
    }
    case "simple": {
      if (ty.ident == "BigNum") {
        return { tag: "simple", ident: "bigint" }
      } else {
        return ty;
      }
    }
  }
}

function compareTypes(ty1: SomeType, ty2: SomeType) {
  const nty1 = normalizeType(ty1);
  const nty2 = normalizeType(ty2);
  // if one of the types is undefined, then the types are equivalent
  if ((nty1.tag == "simple" && nty1.ident == "undefined") || (nty2.tag == "simple" && nty2.ident == "undefined")) {
    expect(true).toBeTruthy();
  } else {
    expect(nty1).toEqual(nty2);
  }
}
