export type Primitive =
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
    }
  | {
      type: "float";
      value?: NumberConstraints;
    };

export type PrimitiveShort = Primitive["type"];

export function isPrimitive(value: any): value is PrimitiveShort | Primitive {
  if (typeof value === "string") {
    return (
      value === "bool" ||
      value === "bytes" ||
      value === "int" ||
      value === "string" ||
      value === "uint" ||
      value === "nint" ||
      value === "float"
    );
  } else {
    return (
      value.type === "bool" ||
      value.type === "bytes" ||
      value.type === "int" ||
      value.type === "string" ||
      value.type === "uint" ||
      value.type === "nint" ||
      value.type === "float"
    );
  }
}

export type Composite =
  | {
      type: "array";
      item: Schema;
      len?: NumberConstraints;
    }
  | {
      type: "record";
      fields: { key: string; value: Schema; optional?: boolean }[];
    }
  | {
      type: "tagged_record";
      variants: {
        name: string;
        tag: number;
        fields?: { key: string; value: Schema }[];
      }[];
    }
  | { type: "map"; key: string; value: Schema; len?: NumberConstraints }
  | {
      type: "struct";
      fields: { id: number; key: string; value: Schema; optional?: boolean }[];
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
    };

export type Schema = Composite | Primitive | PrimitiveShort | string;

export type NumberConstraint =
  | {
      min?: number;
      max?: number;
    }
  | number;

export type NumberConstraints = NumberConstraint | NumberConstraint[];
export type Schema_<T> = Exclude<Schema & { type: T }, string>;
export type Composite_<T> = Composite & { type: T };
