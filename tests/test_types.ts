// Type for transaction obtained from the blockchain
export type TransactionInfo = { hash: string, cbor: string };

// Type for method signatures of a given class
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
