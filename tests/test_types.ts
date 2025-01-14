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

// Each component of a transaction is identified by its type and its location
// in the transaction ('path').
export type Component = {
  type: string                     // The class of the component
  , key: string                    // The key used to access it (i.e: attribute name, map key, array index)
  , path: string                   // The complete path to access it given a CSL transaction.
  , cbor: Uint8Array               // Its CBOR (if available)
  , children: Array<Component>     // Immediate children (i.e: attributes, map members, array elements)
  , failed: boolean                // Whether it succeeded or failed during testing
}

// Each test is made of a transaction and an array of extracted components to test
export type RoundtripTestParameters = { txCount: number, txHash: string, txHashAbbrev: string, componentIndex: number, component: Component }
// Result type for retrieving fields/elements/entries inside the different components
export type AccessSubComponent = { sub: any | undefined, subPath: string }

// class-info.json
export type ClassInfoFile = {
  "api_ignore_classes": Array<string>,
  "api_ignore_methods": { [cls: string]: Array<string> }
  "serialization_bad_variants": Array<string>,
  "extraction_unsupported_fields": Array<string>,
  "extraction_unsupported_types": Array<string>,
}
