export type PrimitiveType =
  | "bool"
  | "bytes"
  | "int"
  | "string"
  | "uint"
  | "nint";

export type PrimitiveExtended =
  | {
      type: "bool";
    }
  | {
      type: "bytes";
      len?: NumberConstraints;
    }
  | {
      type: "int";
      value?: NumberConstraints;
    }
  | {
      type: "string";
      len?: NumberConstraints;
    }
  | {
      type: "uint";
      value?: NumberConstraints;
    }
  | {
      type: "nint";
      value?: NumberConstraints;
    };

export type CompositeType =
  | "array"
  | "record"
  | "tagged_record"
  | "map"
  | "struct"
  | "enum"
  | "tagged"
  | "union"
  | "group"
  | "generic"
  | "nullable";

export type Schema =
  | {
      type: "array";
      item: Schema;
      len?: NumberConstraints;
    }
  | {
      type: "record";
      fields: { key: Schema; value: Schema; optional?: boolean }[];
    }
  | {
      type: "tagged_record";
      variants: {
        name: string;
        tag: number;
        fields?: { key: Schema; value: Schema }[];
      }[];
    }
  | { type: "map"; key: Schema; value: Schema; len?: NumberConstraints }
  | {
      type: "struct";
      fields: { id: number; key: Schema; value: Schema; optional?: boolean }[];
    }
  | {
      type: "enum";
      values: { name: string; value: number }[];
    }
  | {
      type: "tagged";
      tag: NumberConstraints;
      item: Schema;
    }
  | {
      type: "union";
      variants: {
        name: string;
        item: Schema;
      }[];
    }
  | {
      type: "group";
      fields: { key: Schema; value: Schema }[];
    }
  | {
      type: "generic_apply";
      name: string;
      args: Schema[];
    }
  | { type: "generic"; args: string[]; rhs: Schema }
  | {
      type: "nullable";
      item: Schema;
    }
  | PrimitiveType
  | PrimitiveExtended
  | string;

export type NumberConstraint =
  | {
      min?: number;
      max?: number;
    }
  | number;

export type NumberConstraints = NumberConstraint | NumberConstraint[];
