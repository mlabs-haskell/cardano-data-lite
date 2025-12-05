# since these globs don't recurse into subdirs, we have to manually specify
# one glob per level of nesting needed.
TS_FILES := $(wildcard src/*.ts) $(wildcard src/*/*.ts) $(wildcard src/*/*/*.ts)
JS_FILES := $(TS_FILES:src/%.ts=dist/%.js)
DTS_FILES := $(TS_FILES:src/%.ts=dist/%.d.ts)

# Target to build all .d.ts files
all: typedefs

typedefs: csl-types/cardano-data-lite.d.ts

csl-types/cardano-data-lite.d.ts: $(TS_FILES)
	npx tsc --emitDeclarationOnly --outDir dist/
	cat dist/generated.d.ts dist/address/*.d.ts | grep -v import | grep -v 'export \*' >$@

clean:
	rm -f $(DTS_FILES)
	rm -f $(JS_FILES)

doctoc:
	doctoc CHANGELOG.md --github --notitle

.PHONY: all clean doctoc
