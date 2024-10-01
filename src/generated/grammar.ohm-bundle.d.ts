// AUTOGENERATED FILE
// This file was generated from grammar.ohm by `ohm generateBundles`.

import {
  BaseActionDict,
  Grammar,
  IterationNode,
  Node,
  NonterminalNode,
  Semantics,
  TerminalNode
} from 'ohm-js';

export interface ClassesActionDict<T> extends BaseActionDict<T> {
  ClassesDecl?: (this: NonterminalNode, arg0: IterationNode) => T;
  ClassDecl?: (this: NonterminalNode, arg0: TerminalNode, arg1: IterationNode, arg2: TerminalNode, arg3: NonterminalNode, arg4: TerminalNode, arg5: IterationNode, arg6: TerminalNode) => T;
  MethodDecl?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  InstanceMethod?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  StaticMethod?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode) => T;
  Method?: (this: NonterminalNode, arg0: NonterminalNode, arg1: TerminalNode, arg2: NonterminalNode, arg3: TerminalNode, arg4: IterationNode, arg5: IterationNode, arg6: IterationNode) => T;
  PrivateMember?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: IterationNode) => T;
  ParamsList?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  Param?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  SimpleParam?: (this: NonterminalNode, arg0: NonterminalNode, arg1: TerminalNode, arg2: NonterminalNode) => T;
  NullableParam?: (this: NonterminalNode, arg0: NonterminalNode, arg1: TerminalNode, arg2: TerminalNode, arg3: NonterminalNode) => T;
  Type?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  NullableType?: (this: NonterminalNode, arg0: NonterminalNode, arg1: TerminalNode, arg2: TerminalNode) => T;
  SimpleType?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  ArrayType?: (this: NonterminalNode, arg0: NonterminalNode, arg1: TerminalNode) => T;
  TupleType?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: TerminalNode) => T;
  ClassName?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  MethodName?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  identifier?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  wordlike?: (this: NonterminalNode, arg0: NonterminalNode, arg1: NonterminalNode) => T;
  anyseq?: (this: NonterminalNode, arg0: IterationNode) => T;
  underscores?: (this: NonterminalNode, arg0: IterationNode) => T;
}

export interface ClassesSemantics extends Semantics {
  addOperation<T>(name: string, actionDict: ClassesActionDict<T>): this;
  extendOperation<T>(name: string, actionDict: ClassesActionDict<T>): this;
  addAttribute<T>(name: string, actionDict: ClassesActionDict<T>): this;
  extendAttribute<T>(name: string, actionDict: ClassesActionDict<T>): this;
}

export interface ClassesGrammar extends Grammar {
  createSemantics(): ClassesSemantics;
  extendSemantics(superSemantics: ClassesSemantics): ClassesSemantics;
}

declare const grammar: ClassesGrammar;
export default grammar;
