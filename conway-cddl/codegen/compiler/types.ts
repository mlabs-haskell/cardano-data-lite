export type Schema =
  | {
      type: "array";
      item: string;
    }
  | {
      type: "set";
      item: string;
    }
  | {
      type: "record";
      fields: {
        name: string;
        type: string;
        nullable?: boolean;
      }[];
      tagged?: { tag: number };
    }
  | {
      type: "tagged_record";
      variants: {
        tag: number;
        name: string;
        value?: string;
        kind_name?: string;
      }[];
    }
  | {
      type: "record_fragment";
      fields: {
        name: string;
        type: string;
        nullable?: boolean;
      }[];
    }
  | {
      type: "record_fragment_wrapper";
      item: {
        name: string;
        type: string;
      };
    }
  | { type: "map"; key: string; value: string }
  | {
      type: "struct";
      fields: {
        id: number;
        name: string;
        type: string;
        optional?: boolean;
      }[];
    }
  | {
      type: "enum";
      values: { name: string; value: number }[];
    }
  | {
      type: "enum_simple";
      values: { name: string; value: number }[];
    }
  | {
      type: "newtype";
      item: string;
      accessor: string;
      constraints?: {
        len?: { eq?: number; min?: number; max?: number };
      };
    };
