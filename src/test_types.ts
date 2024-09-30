// Type for transaction obtained from the blockchain
export type TransactionInfo = { hash: string, cbor: string };

// Type for method signatures of a given class
export type MethodInfo = { class: string, static: boolean, params: Array<ParamInfo> }
export type ParamInfo = { nullable: boolean, type: string }
