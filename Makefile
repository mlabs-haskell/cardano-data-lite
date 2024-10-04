TS_FILES := $(wildcard src/*.ts) $(wildcard src/*/*.ts) $(wildcard src/*/*/*.ts)
JS_FILES := $(wildcard src/*.js) $(wildcard src/*/*.js) $(wildcard src/*/*/*.js)
DTS_FILES := $(TS_FILES:src/%.ts=src/%.d.ts)

# Target to build all .d.ts files
all: typedefs

typedefs: csl-types/cardano-data-lite.d.ts

csl-types/cardano-data-lite.d.ts: $(DTS_FILES)
	cat src/generated.d.ts src/address/*.d.ts | grep -v import | grep -v 'export \*' >$@
	rm -f $(DTS_FILES)


src/%.d.ts: src/%.ts
	@echo "Generating $@ from $<"
	tsc --target ES2020 --moduleResolution node --allowSyntheticDefaultImports --declaration --emitDeclarationOnly $< || true

clean:
	rm -f $(DTS_FILES)
	rm -f $(JS_FILES)

.PHONY: all clean
