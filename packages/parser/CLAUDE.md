# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `yarn test` - Run all tests
- `yarn typecheck` - Run TypeScript type checking across all workspaces
- `yarn lint` - Run ESLint across all workspaces
- `yarn build` - Build the project (runs typecheck first, then rollup)

### Testing
- `jest --coverage` - Run tests with coverage
- To run a single test file: `jest path/to/test.test.ts`

## Architecture

This is a HWP (Hanword Processor) file parser library written in TypeScript. The project uses a monorepo structure with Yarn workspaces.

### Core Components

1. **Parser Entry Point** (`src/parse.ts`):
   - Main parsing function that reads HWP files using the CFB (Compound File Binary) format
   - Handles file header validation, document info parsing, and section parsing
   - Supports compressed content using pako for decompression

2. **Document Structure**:
   - `HWPDocument` - Root document object containing header, info, and sections
   - `HWPHeader` - File header with version and properties
   - `DocInfo` - Document metadata parsed by `DocInfoParser`
   - `Section` - Document sections parsed by `SectionParser`

3. **Key Parsers**:
   - `DocInfoParser` - Parses document information from the DocInfo stream
   - `SectionParser` - Parses body text sections containing paragraphs and controls

4. **Data Models** (`src/models/`):
   - Controls system for various document elements (tables, shapes, pictures)
   - Paragraph and character formatting models
   - Binary data handling for embedded content

5. **Utilities**:
   - `ByteReader` - Low-level binary data reading
   - `RecordReader` - Reads HWP record structures
   - `bitUtils` - Bit manipulation utilities
   - `controlUtil` - Control type checking utilities

### Build System
- Uses Rollup for bundling with Babel for TypeScript transpilation
- Outputs both CommonJS and ESM formats
- Also builds an IIFE bundle for browser extension usage