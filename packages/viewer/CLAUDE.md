# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `yarn test` - Run all tests
- `yarn typecheck` - Run TypeScript type checking across all workspaces (no typecheck script in viewer package, runs at root)
- `yarn lint` - Run ESLint across all workspaces (no lint script in viewer package, runs at root)
- `yarn build` - Build the project (runs typecheck first, then rollup)

### Testing
- `jest --coverage` - Run tests with coverage (run from root)
- To run a single test file: `jest path/to/test.test.ts`

## Architecture

This is the viewer package for the HWP.js project, responsible for rendering HWP documents in the browser. It depends on the @hwp.js/parser package for document parsing.

### Core Components

1. **HWPViewer** (`src/viewer.ts`):
   - Main viewer class that renders HWP documents to HTML
   - Takes a container element, document data, and parsing options
   - Creates pages with proper dimensions and styling
   - Handles rendering of paragraphs, tables, shapes, and images

2. **Page Building System**:
   - `PageBuilder` (`src/PageBuilder.ts`) - Splits document content across multiple pages
   - `parsePage` (`src/parsePage.ts`) - Entry point for page parsing that uses PageBuilder
   - Handles page breaks, content overflow, and table splitting

3. **Rendering Components**:
   - Text rendering with font faces, sizes, colors, and alignment
   - Table rendering with cell borders, spans, and styling
   - Shape and image rendering with positioning and z-index
   - Border fill system for styling elements

4. **Table Splitting** (`src/splitTable.ts`):
   - Handles splitting tables across pages when they exceed page height
   - Maintains table structure and cell relationships

5. **Header Component** (`src/header.ts`):
   - Provides viewer header UI with page navigation
   - Manages page observer for current page tracking

### Key Features

- Converts HWP document measurements (HWPUNIT: 7200 units = 1 inch) to CSS units
- Supports various border styles and widths
- Handles text alignment and paragraph formatting
- Manages embedded images through binary data blobs
- Provides print support through print utilities

### Build Output
- CommonJS and ESM formats for npm package usage
- IIFE bundle for browser extension at `/extension/content/hwp.js`