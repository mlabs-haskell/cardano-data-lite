// Type for transaction obtained from the blockchain
export type TransactionInfo = { hash: string, cbor: string };

// Types for method signatures of a given class
export type ClassInfo = { name: string, methods: Array<MethodInfo> }
export type MethodInfo = { name: string, static: boolean, params: Array<ParamInfo>, returnType: SomeType }
export type ParamInfo = { name: string, type: SomeType }
export type SomeType =
  {
    tag: "nullable" | "array",
    type: SomeType
  } |
  {
    tag: "tuple",
    types: Array<SomeType>
  } |
  {
    tag: "simple"
    ident: string
  } |
  {
    tag: "object",
    attrMap: Map<string, SomeType>
  }

// Type for exports that rename classes
export type ClassRename = { originalName: string, newName: string };

// Types for method comparisons
export type MethodComparisonResult = "success" | MethodComparisonFailure

export type MethodComparisonFailure =
  {
    "reason": MethodComparisonFailureReason
    "msg": string
  }

export type MethodComparisonFailureReason = 
  "method_names_dont_match"
  | "return_types_dont_match"
  | "static_qualifiers_dont_match"
  | "number_of_parameters_doesnt_match"
  | "parameter_types_dont_match"

// Types for type comparison
export type TypeComparisonResult = "success" | TypeComparisonFailure

export type TypeComparisonFailure = 
  {
    "expected": SomeType
    , "received": SomeType
  }
