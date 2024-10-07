# Cardano Data Lite

Cardano Data Lite (CDL) aims to be a drop in replacement for Cardano Serialization Library (CSL).
CDL is written in Typescript and compiled to Javascript with minimal dependencies. There are no WASM blobs resulting in much smaller bundle size. CDL is also easier to integrate with various bundlers which lack the ability to load WASM, like ESBuild where top-level await is not available.

## Documentation

[See here](docs.md)

# Development

Due to the size of CSL and also the fact that CSL was undergoing constant updates while we were developing CDL, we designed a small DSL to describe the behaviour of CSL types and used that to dynamically generate a Typescript port of CSL.
The DSL can be found at `/conway-cddl/yaml` and the code that interprets it can be found at `/conway-cddl/codegen`.

### Tests

To measure the progress of implementation, we use automated test suite that parses the type definitions of both CSL and CDL and compares them for compatibility.

To run these, run the following from the project root directory:

```
npm run test-api
```
