// This module tests that the classes generated in out.ts match the CSL API
// at the method level
import fs from "node:fs";
import { ClassInfo, ClassRename, MethodComparisonResult, MethodInfo, ParamInfo, SomeType, TypeComparisonResult } from "../test_types";
import grammar, { TypeDefsSemantics } from "./grammar.ohm-bundle"
import { describe, test } from "@jest/globals";

//// TEST CONFIG ////
// Whether to print all the extracted class infos
const traceClassInfos = false;

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
let semantics: TypeDefsSemantics = grammar.createSemantics();
semantics.addOperation<string>("attrName()", {
  ObjectAttribute_mandatory(ident, _colon, _type, _semicolon) {
    return ident.sourceString;
  },
  ObjectAttribute_nullable(ident, _question, _colon, _type, _semicolon) {
    return ident.sourceString;
  }
}).addOperation<SomeType>("type()", {
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
  },
  Type_object(_braceOpen, attrsIter, _braceClose) {
    let attrsMap: Map<string, SomeType> = new Map();
    for (const attr of attrsIter.children) {
      const name = attr.attrName();       
      const type = attr.type();
      attrsMap.set(name, type);
    }
    return { tag: "object", attrMap: attrsMap}
  },
  ObjectAttribute_mandatory(_ident, _colon, type, _semicolon) {
    return type.type();
  },
  ObjectAttribute_nullable(_ident, _question, _colon, type, _semicolon) {
    return { tag: "nullable", type: type.type()};
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
  DataDecl(_0) {
    // ignore
    return undefined;
  }
}).addOperation<ClassInfo | undefined>("class()", {
  ClassDecl(_export, _declare, _class, className, _braceOpen, memberDecls, _braceClose) {
    let methods: Array<MethodInfo> = [];
    for (const member of memberDecls.children) {
      let method: MethodInfo | undefined = member.method();
      if (method) {
        methods.push(method);
      }
    }
    return { name: className.sourceString, methods: methods }
  },
  Import(_1, _2, _3, _4, _5, _6, _7) {
    // ignore
    return undefined;
  },
  OtherExport(_0) {
    // ignore
    return undefined;
  }
}).addOperation<Array<ClassInfo>>("classes()", {
  TopLevel(topLevelDecl) {
    let classes: Array<ClassInfo> = [];
    for (const decl of topLevelDecl.children) {
      let cls: ClassInfo | undefined = decl.class();
      if (cls) {
        classes.push(cls);
      }
    }
    return classes;
  }
// These operations are unrelated to the previous ones. They are only used
// for parsing renaming exports.
}).addOperation<ClassRename>("rename()", {
  Rename(originalName, _as, newName) {
    // console.log("Rename");
    return { originalName: originalName.sourceString, newName: newName.sourceString };
  }
}).addOperation<Array<ClassRename> | undefined>("renames_maybe()", {
  OtherExport(otherExportNode) {
    // console.log("OtherExport");
    if (otherExportNode.ctorName == "OtherExport_export_rename") {
      return otherExportNode.renames();      
    } else {
      return undefined;
    }
  },
  Import(_0, _1, _2, _3, _4, _5, _6) {
    // console.log("Import");
    return undefined;
  },
  ClassDecl(_0, _1, _2, _3, _4, _5, _6) {
    // console.log("ClassDecl");
    return undefined
  }
}).addOperation<Array<ClassRename>>("renames()", {
  TopLevel(topLevelNodes) {
    // console.log("TopLevel");
    let renames: Array<ClassRename> = [];
    for (const node of topLevelNodes.children) {
      const rename: Array<ClassRename> | undefined = node.renames_maybe();
      if (rename) {
        renames = renames.concat(rename);
      }
    }
    return renames;
  },
  OtherExport_export_rename(_export, _braceOpen, renamesList, _braceClose, _semicolon) {
    // console.log("OtherExport_export_rename")
    let renames: Array<ClassRename> = [];
    for (const renameNode of renamesList.asIteration().children) {
      const rename: ClassRename = renameNode.rename();
      renames.push(rename);
    }
    return renames
  },
});


console.log("Traversing parse tree of CSL type definitions...");
const cslClasses: Array<ClassInfo> = semantics(cslMatch).classes();
let cslClassesMap: Map<string, MethodInfo[]> = new Map(cslClasses.map((cls) => [cls.name, cls.methods]))
console.log("Traversing parse tree of CDL type definitions...");
const cdlClasses: Array<ClassInfo> = semantics(cdlMatch).classes();
let cdlClassesMap: Map<string, MethodInfo[]> = new Map(cdlClasses.map((cls) => [cls.name, cls.methods]))
console.log("Extracting renaming exports from CDL type definitions...");
const classRenames: Array<ClassRename> = semantics(cdlMatch).renames();
const classRenamesMap: Map<string, string> = new Map(classRenames.map((rename) => [rename.originalName, rename.newName]))

// We trace all the classes as parsed
if (traceClassInfos) {
  for (const [name, clss] of [["CSL classes", cslClasses], ["CDL classes", cdlClasses]] as [string, ClassInfo[]][]) {
    console.log(`[TRACE] ${name}`)
    for (const cls of clss) {
      prettyClassInfo(cls);
    }
  }
}

// Before filtering, we add all classes that are re-exported with a different name
for(const rename of classRenames) {
  const clsValue = cdlClassesMap.get(rename.originalName)
  if(clsValue) {
    cdlClassesMap.set(rename.newName, clsValue);
  }
}

// We filter out the ignored classes and methods from clsClassesMap based on the classInfo file.
// We don't want to fail when checking methods if cdlClassesMap does not contain these classes/methods.
type ClassInfoFile = {
  "ignore_classes": Array<string>,
  "ignore_methods": { [cls: string]: Array<string> }
}
const classInfo: ClassInfoFile = JSON.parse(fs.readFileSync("tests/class-info.json", "utf-8"));
for (const cls of classInfo.ignore_classes) {
  cslClassesMap.delete(cls);
}
for (const cls in classInfo.ignore_methods) {
  console.log(cls);
  let methodInfos = cslClassesMap.get(cls);
  if (methodInfos) {
    let filteredMethodInfos = methodInfos.filter((info) => !classInfo.ignore_methods[cls].includes(info.name))
    cslClassesMap.set(cls, filteredMethodInfos);
  }
}

// We filter out missing classes/methods in CDL. We do it for the same reason as above.
let missingClasses: Array<String> = [];
for (const cls of cslClassesMap.keys()) {
  if (!cdlClassesMap.has(cls)) {
    missingClasses.push(cls);
    cslClassesMap.delete(cls);
  }
}

let missingMethods: Array<String> = [];
for (const [cls, methods] of cslClassesMap) {
  for (const method of methods) {
    const cdlMethods = cdlClassesMap.get(cls);
    if (!cdlMethods) {
      throw `Unexpected missing class ${cls} in cdlClassesMap`;
    } else {
      if (!cdlMethods.find((cdlMethod) => cdlMethod.name == method.name)) {
        missingMethods.push(`${cls}.${method.name}`);
      }
    }
  }
}

console.log("Missing classes:\n\t", missingClasses.join("\n\t"))
console.log("Missing methods:\n\t", missingMethods.join("\n\t"))

// We export the missing classes and methods to CSV files
try {
  fs.mkdirSync("tests/reports")
} catch(_err) {
  console.log("Failed to create reports directory");
  console.log("Skipping dir creation...")
};

let missingClassesCsv = "Missing Class\n";
missingClassesCsv += missingClasses.join("\n");
fs.writeFileSync("tests/reports/api_missing_classes.csv", missingClassesCsv);
let missingMethodsCsv = "Missing method\n"
missingMethodsCsv += missingMethods.join("\n");
fs.writeFileSync("tests/reports/api_missing_methods.csv", missingMethodsCsv);

// We construct the test tables
let n: number = 0;
for (const cls of cslClasses) {
  for (const method of cls.methods) {
    compareToCslTests.push({ n: n, class: cls.name, comparedToMethod: method })
    n += 1;
  }
}

n = 0;
for (const cls of cdlClasses) {
  for (const method of cls.methods) {
    compareToCdlTests.push({ n: n, class: cls.name, comparedToMethod: method })
    n += 1;
  }
}
console.log("compareToCslTests.length: ", compareToCslTests.length)
console.log("compareToCdlTests.length: ", compareToCdlTests.length)

// We open a report file to write down each method comparison failure as we find it
let methodFailuresFile = fs.openSync("tests/reports/api_failing_methods.csv", "w");
fs.writeFileSync(methodFailuresFile, "Affected class,Method,Failure reason,Failure message\n");

// Used for debugging 
const testN = 2752;
const testNConfig = { testTable: compareToCdlTests, srcMap: cslClassesMap };
test.skip(`Test N. ${testN}`, () => {
  const { testTable, srcMap } = testNConfig;
  const params = testTable[testN];
  compareToClass(srcMap, params.class, params.comparedToMethod);
});

// Tests
describe("API coverage tests", () => {
  test("There should be no missing classes", () => {
    expect(missingClasses).toHaveLength(0);
  })
  test("There should be no missing methods", () => {
    expect(missingMethods).toHaveLength(0);
  })
})
describe("Compare each CDL class/method to its CSL counterpart", () => {
  test.each(compareToCslTests)("($n) Comparing CDL's $class . $comparedToMethod.name to CSL's", (params) => {
    compareToClass(cdlClassesMap, params.class, params.comparedToMethod);
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

function prettyType(ty: SomeType): string {
  switch(ty.tag) {
    case "simple":
      return ty.ident;
    case "array":
      return `${prettyType(ty.type)}[]`;
    case "tuple":
      let tyStrs = ty.types.map((ty) => prettyType(ty));
      return `[${tyStrs.join(", ")}]`;
    case "nullable":
      return `(${prettyType(ty.type)} | undefined)`
    case "object": {
      let msg = "{";
      for (const [attrName, attrType] of ty.attrMap.entries()) {        
        msg = `${msg} ${attrName}: ${prettyType(attrType)};`;
      }
      msg = `${msg} }`;
      return msg;
    }
  }
}

function compareToClass(clss: Map<string, MethodInfo[]>, cls: string, comparedToMethod: MethodInfo) {
  const methods = clss.get(cls);
  if (methods) {
    const method = methods.find((info) => info.name == comparedToMethod.name)
    if (method) {
      const cmpResult = compareToMethod(method, comparedToMethod);
      // Before testing, we write the result in the report file
      if (cmpResult != "success") {
        fs.writeFileSync(methodFailuresFile, `${cls},${method.name},${cmpResult.reason},${cmpResult.msg}\n`);
      }
      expect(cmpResult).toStrictEqual("success");
    }
  }
}

function compareToMethod(method1: MethodInfo, method2: MethodInfo): MethodComparisonResult {
  // Method names should match
  if (method1.name != method2.name) {
    return { reason: "method_names_dont_match", msg: `'Expected ${method2.name}, received ${method1.name}'`};
  }
  // Return types should match
  const returnCmp = compareTypes(method1.returnType, method2.returnType);
  if (returnCmp != "success") {
    return { reason: "return_types_dont_match", msg: `'Expected ${prettyType(returnCmp.expected)}, received ${prettyType(returnCmp.received)}'`};
  }
  // Static qualifiers should match
  if (method1.static != method2.static) {
    return { reason: "static_qualifiers_dont_match", msg: `'Expected ${method2.static}, received ${method1.static}'`};
  }
  // Methods should have the same number of parameters
  if (method1.params.length != method2.params.length) {
    return { reason: "number_of_parameters_doesnt_match", msg: `'Expected ${method2.params.length}, received ${method1.params.length}'`}
  }
  // All parameter types should match (names do not, however)
  let paramErrMsgs: Array<string> = [];
  for (let i = 0; i < method1.params.length; i++) {
    const param1 = method1.params[i];
    const param2 = method2.params[i];
    // Types should match
    const paramCmp = compareTypes(param1.type, param2.type);
    if (paramCmp != "success") {
      paramErrMsgs.push(`Expected ${param1.name} to have type ${prettyType(paramCmp.expected)}, instead it has type ${prettyType(paramCmp.received)}`);
    }
  }
  if (paramErrMsgs.length > 0) {
    return { reason: "parameter_types_dont_match", msg: `'${paramErrMsgs.join(" | ")}'`}
  }

  return "success";
}

// We normalize types. At runtime, `undefined` and `T` are equivalent, and so are `undefined | T`
// and `T`. For this reason, we strip the `undefined`s to make type comparisons simpler.
// We also take into account classes that are exported under a different name.
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
    case "object": {
      let normalized: SomeType = { tag: "object", attrMap: new Map };
      for (const [attrName, attrType] of ty.attrMap) {
        normalized.attrMap.set(attrName, normalizeType(attrType));
      }
      return normalized;
    }
    case "simple": {
      const renamedTo = classRenamesMap.get(ty.ident);
      if (ty.ident == "BigNum") {
        return { tag: "simple", ident: "bigint" }
      } else if (renamedTo){
        return { tag: "simple", ident: renamedTo };
      } else {
        return ty;
      }
    }
  }
}

function compareTypes(ty1: SomeType, ty2: SomeType): TypeComparisonResult {
  const nty1 = normalizeType(ty1);
  const nty2 = normalizeType(ty2);
  // if one of the types is undefined, then the types are equivalent
  if ((nty1.tag == "simple" && nty1.ident == "undefined") || (nty2.tag == "simple" && nty2.ident == "undefined")) {
    return "success";
  // otherwise, check for strict equality
  } else if (!someTypeEquals(nty1, nty2)) {
    return { expected: nty2, received: nty1 }
  } else {
    return "success";
  }
}

// strict SomeType equality
function someTypeEquals(ty1: SomeType, ty2: SomeType) {
  if (ty1.tag == "simple" && ty2.tag == "simple") {
    // console.log("comparing simples")
    return ty1.ident === ty2.ident;
  }

  if (ty1.tag == "nullable" && ty2.tag == "nullable") {
    // console.log("comparing nullables")
    return someTypeEquals(ty1.type, ty2.type);
  }

  if (ty1.tag == "array" && ty2.tag == "array") {
    // console.log("comparing arrays")
    return someTypeEquals(ty1.type, ty2.type);
  }

  if (ty1.tag == "tuple" && ty2.tag == "tuple") {
    // console.log("comparing tuples")
    if (ty1.types.length != ty2.types.length) {
      return false;
    }
    for (let i = 0; i < ty1.types.length; i++) {
      if (!someTypeEquals(ty1.types[i], ty2.types[i])) {
        return false;
      }
    }
    return true;
  }

  if (ty1.tag == "object" && ty2.tag == "object") {
    // console.log("comparing objects")
    for (const [attrName, attrType1] of ty1.attrMap.entries()) {
      const attrType2 = ty2.attrMap.get(attrName);
      if (!attrType2 || !someTypeEquals(attrType1, attrType2)) {
        return false;
      }
    }
    return true;
  }

  // tags don't match
  // console.log("tags don't match")
  return false;
}
