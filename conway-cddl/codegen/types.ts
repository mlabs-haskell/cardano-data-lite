import { Type, type Static } from "@sinclair/typebox";

export const Schema = Type.Intersect([
  Type.Object({
    csl_name: Type.Optional(Type.String()),
    genCSL: Type.Optional(Type.Boolean()),
    tagged: Type.Optional(
      Type.Object({
        tag: Type.Number(),
        bytes: Type.Optional(Type.Boolean()),
      }),
    ),
    methods: Type.Optional(
      Type.Record(Type.String(), Type.Union([Type.Null(), Type.String()])),
    ),
    extra_methods: Type.Optional(Type.String()),
  }),
  Type.Union([
    Type.Object({ type: Type.Literal("array"), item: Type.String() }),
    Type.Object({
      type: Type.Literal("enum"),
      values: Type.Array(
        Type.Object({ name: Type.String(), value: Type.Number() }),
      ),
    }),
    Type.Object({
      type: Type.Literal("enum_simple"),
      values: Type.Array(
        Type.Object({ name: Type.String(), value: Type.Number() }),
      ),
    }),
    Type.Object({
      type: Type.Literal("map"),
      key: Type.String(),
      value: Type.String(),
      keys_method_type: Type.Optional(Type.String()),
    }),
    Type.Object({
      type: Type.Literal("newtype"),
      item: Type.String(),
      accessor: Type.String(),
      constraints: Type.Optional(
        Type.Object({
          len: Type.Optional(
            Type.Object({
              eq: Type.Optional(Type.Number()),
              min: Type.Optional(Type.Number()),
              max: Type.Optional(Type.Number()),
            }),
          ),
          value: Type.Optional(
            Type.Object({
              eq: Type.Optional(Type.String()),
              min: Type.Optional(Type.String()),
              max: Type.Optional(Type.String()),
            }),
          ),
        }),
      ),
    }),
    Type.Object({ type: Type.Literal("set"), item: Type.String() }),
    Type.Object({
      type: Type.Literal("tagged_record"),
      variants: Type.Array(
        Type.Object({
          tag: Type.Number(),
          name: Type.String(),
          value: Type.Optional(Type.String()),
          kind_name: Type.Optional(Type.String()),
        }),
      ),
      accessor_prefix: Type.Optional(Type.String()),
    }),
    Type.Object({
      type: Type.Literal("record"),
      fields: Type.Array(
        Type.Object({
          name: Type.String(),
          type: Type.String(),
          nullable: Type.Optional(Type.Boolean()),
        }),
      ),
      accessor_get_prefix: Type.Optional(Type.Boolean()),
    }),
    Type.Object({
      type: Type.Literal("record_fragment"),
      fields: Type.Array(
        Type.Object({
          name: Type.String(),
          type: Type.String(),
          nullable: Type.Optional(Type.Boolean()),
        }),
      ),
      fragment_encode_len: Type.Optional(Type.Number()),
      accessor_get_prefix: Type.Optional(Type.Boolean()),
    }),
    Type.Object({
      type: Type.Literal("record_fragment_wrapper"),
      item: Type.Object({
        name: Type.String(),
        type: Type.String(),
      }),
    }),
    Type.Object({
      type: Type.Literal("struct"),
      fields: Type.Array(
        Type.Object({
          id: Type.Number(),
          name: Type.String(),
          type: Type.String(),
          optional: Type.Optional(Type.Boolean()),
        }),
      ),
      accessor_get_prefix: Type.Optional(Type.Boolean()),
    }),
    Type.Object({
      type: Type.Literal("union"),
      variants: Type.Array(
        Type.Object({
          tag: Type.Number(),
          peek_type: Type.Union([Type.String(), Type.Array(Type.String())]),
          name: Type.String(),
          type: Type.String(),
          kind_name: Type.Optional(Type.String()),
        }),
      ),
    }),
    Type.Object({
      type: Type.Literal("hash"),
      len: Type.Optional(Type.Number()),
      options_type: Type.Optional(Type.String()),
    }),
    Type.Object({
      type: Type.Literal("custom"),
      body: Type.String(),
    }),
    Type.Object({
      type: Type.Literal("external"),
    }),
  ]),
]);

export type Schema = Static<typeof Schema>;
