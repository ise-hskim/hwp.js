# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `yarn test` - Run all tests with Jest
- `yarn typecheck` - Run TypeScript type checking across all workspaces
- `yarn lint` - Run ESLint across all workspaces
- `yarn build` - Build the project (runs typecheck first, then rollup)
- `yarn lint-staged` - Run lint-staged for pre-commit hooks

### Testing
- `jest --coverage` - Run tests with coverage
- To run a single test file: `jest path/to/test.test.ts`

## Architecture

This is a Chrome extension for viewing HWP (Hanword Processor) files directly in the browser. It's part of the hwp.js monorepo project that uses Yarn workspaces.

### Extension Structure

1. **Background Script** (`src/background.js`):
   - Intercepts requests to .hwp files
   - Redirects them to the built-in viewer page
   - Uses Chrome WebRequest API with blocking mode

2. **Content Viewer** (`src/content/`):
   - `viewer.html` - Main viewer page that displays HWP files
   - `viewer.css` - Styles for the viewer interface
   - `load.js` - Script that loads and renders HWP files

3. **Manifest Configuration** (`src/manifest.json`):
   - Manifest v2 Chrome extension
   - Permissions for webRequest, tabs, and file access
   - Handles http://, https://, and file:// protocols for .hwp files

### Integration with hwp.js

This extension package depends on:
- `@hwp.js/parser` - For parsing HWP file format
- `@hwp.js/viewer` - For rendering parsed HWP content

The extension serves as a browser integration layer that allows users to view HWP files without downloading them.

### Monorepo Context

Located within a Yarn workspace monorepo:
- Root commands cascade to all workspaces
- Shared TypeScript configuration from root tsconfig
- Uses Rollup for building distribution bundles