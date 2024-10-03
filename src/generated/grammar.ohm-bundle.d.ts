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
  MethodDecl_static?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode) => T;
  MethodDecl_instance?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  MethodDecl?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  Method_with_void?: (this: NonterminalNode, arg0: NonterminalNode, arg1: TerminalNode, arg2: NonterminalNode, arg3: TerminalNode, arg4: TerminalNode, arg5: TerminalNode, arg6: IterationNode) => T;
  Method_with_type?: (this: NonterminalNode, arg0: NonterminalNode, arg1: TerminalNode, arg2: NonterminalNode, arg3: TerminalNode, arg4: TerminalNode, arg5: NonterminalNode, arg6: IterationNode) => T;
  Method_without_type?: (this: NonterminalNode, arg0: NonterminalNode, arg1: TerminalNode, arg2: NonterminalNode, arg3: TerminalNode, arg4: IterationNode) => T;
  Method?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  DataDecl?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: IterationNode) => T;
  Param_mandatory?: (this: NonterminalNode, arg0: NonterminalNode, arg1: TerminalNode, arg2: NonterminalNode) => T;
  Param_nullable?: (this: NonterminalNode, arg0: NonterminalNode, arg1: TerminalNode, arg2: TerminalNode, arg3: NonterminalNode) => T;
  Param?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  Type_nullable?: (this: NonterminalNode, arg0: NonterminalNode, arg1: TerminalNode, arg2: TerminalNode) => T;
  Type_array?: (this: NonterminalNode, arg0: NonterminalNode, arg1: TerminalNode) => T;
  Type_tuple?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: TerminalNode) => T;
  Type_simple?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  Type?: (this: NonterminalNode, arg0: NonterminalNode) => T;
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
