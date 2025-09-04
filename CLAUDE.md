# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HWP.js is a Node.js-based HWP (Hanword Processor) file parser and viewer library written in TypeScript. The project uses a monorepo structure with Yarn workspaces.

## Documentation Standards

### Date Format
Always use ISO 8601 date format: **YYYY-MM-DD**
- Example: 2025-09-04 (not 2025.09.04 or September 4, 2025)
- This ensures consistent chronological sorting and clear understanding across all documentation

## Commands

### Development
- `yarn test` - Run all tests
- `yarn typecheck` - Run TypeScript type checking across all workspaces
- `yarn lint` - Run ESLint across all workspaces
- `yarn build` - Build the project (runs typecheck first, then rollup)

### Testing
- `jest --coverage` - Run tests with coverage
- To run a single test file: `jest path/to/test.test.ts`

## Architecture Enhancement Roadmap

This section tracks the ongoing architecture improvements for the HWP.js project. Each item includes context and implementation guidelines.

### 1. Parser Architecture Redesign ✅

#### Current State
- All parsing logic is concentrated in `SectionParser.ts`
- Visitor pattern is partially implemented but not systematic
- Responsibilities are mixed (parsing, transformation, validation)

#### Target Architecture
- [x] Implement proper Visitor pattern for record traversal
- [x] Create dedicated parser classes for each record type
- [x] Separate concerns: parsing, validation, and transformation
- [x] Implement `RecordParser<T>` interface for all record types

#### Implementation Guide
```typescript
// Base interface for all record parsers
interface RecordParser<T> {
  parse(record: HWPRecord): T
  validate(data: T): boolean
  getRecordType(): SectionTagID
}

// Example implementation
class ParagraphHeaderParser implements RecordParser<Paragraph> {
  parse(record: HWPRecord): Paragraph { }
  validate(data: Paragraph): boolean { }
  getRecordType(): SectionTagID { return SectionTagID.HWPTAG_PARA_HEADER }
}
```

### 2. Type Safety Enhancement ⬜

#### Current Issues
- Magic numbers throughout the code (e.g., line 433 in `SectionParser.ts`)
- Excessive use of `any` types and type casting
- Simple error handling with basic `throw` statements

#### Improvements Needed
- [ ] Define all magic numbers as named constants
- [ ] Replace `any` types with proper type definitions
- [ ] Implement Result<T, E> pattern for error handling
- [ ] Add strict type checking for all byte operations
- [ ] Create type guards for control type checking

#### Implementation Guide
```typescript
// Constants for magic numbers
const PARA_HEADER_OFFSET = {
  TEXT_ATTR: 0,
  CONTROL_MASK: 4,
  PARA_SHAPE_ID: 8,
  STYLE_ID: 10,
  // ... etc
} as const

// Result pattern for error handling
type Result<T, E = Error> = 
  | { success: true; value: T }
  | { success: false; error: E }
```

### 3. Version Compatibility System ⬜

#### Version-Specific Features
- 5.0.0.0: Base features
- 5.0.1.0: Instance ID, compression support
- 5.0.2.0: Document history, extended numbering
- 5.0.3.0: Segment types, advanced effects

#### Implementation Tasks
- [ ] Create version detection system
- [ ] Implement feature flags based on document version
- [ ] Add version-specific parsing logic
- [ ] Create compatibility matrix for features
- [ ] Add graceful degradation for newer versions

#### Implementation Guide
```typescript
class VersionManager {
  private version: HWPVersion
  
  supportsInstanceId(): boolean { 
    return this.version.isGreaterOrEqual(5, 0, 1, 0) 
  }
  
  supportsCompression(): boolean { 
    return this.version.isGreaterOrEqual(5, 0, 1, 0) 
  }
}
```

### 4. Performance Optimization ⬜

#### Current Performance Issues
- New ByteReader instance for each record
- No streaming support for large documents
- Synchronous parsing blocks the event loop

#### Optimization Tasks
- [ ] Implement ByteReader pooling/reuse
- [ ] Add streaming parser for large documents
- [ ] Implement lazy loading for sections
- [ ] Add progress callbacks for long operations
- [ ] Optimize memory usage for large tables

### 5. Code Quality Improvements ⬜

#### Refactoring Tasks
- [ ] Extract switch cases in `visitParaText` to separate handlers
- [ ] Implement proper error types instead of generic Error
- [ ] Add comprehensive JSDoc documentation
- [ ] Increase test coverage to >80%
- [ ] Add integration tests for real HWP files

### 6. Viewer Package Enhancement ⬜

#### Current State
- Basic rendering capabilities
- Limited styling support
- No performance optimization for large documents

#### Improvement Tasks
- [ ] Implement virtual scrolling for large documents
- [ ] Add proper text measurement and line breaking
- [ ] Improve table rendering performance
- [ ] Add print layout accuracy
- [ ] Implement progressive rendering

### 7. Viewer Rendering Issues ⬜

#### Current Issues (Identified 2025-09-03)
These issues were discovered when comparing V1 and V2 parsing results in the viewer:

#### 1. Text Alignment Not Applied ✅ FIXED (2025-09-04)
- **Issue**: Text with center alignment (e.g., "2024. 07." in document) is not being centered in viewer
- **Example**: Section with content "2024. 07." should be center-aligned but displays as left-aligned
- **Root Cause**: PageBuilder was not preserving paragraph shapeIndex when reconstructing pages
- **Fix**: Modified `PageBuilder.visitParagraph()` to copy shapeIndex from original paragraph

#### 2. Character-Level Formatting Applied Uniformly ⬜
- **Issue**: Bold/italic formatting is applied to entire sections instead of individual characters
- **Example**: In "□ 운영대상 : 1~3학년", only specific parts should be bold but entire text gets the same formatting
- **Root Cause**: Viewer not processing character shape ranges correctly - should apply different styles to different character ranges within same paragraph

#### 3. Table Cell Background Gradient Not Rendered ⬜
- **Issue**: First table's 3rd row should have gradient background but shows solid color or no background
- **Example**: Table header rows with gradient fills not displaying correctly
- **Root Cause**: Viewer not supporting gradient fill rendering for table cells

#### Implementation Tasks
- [x] Fix paragraph alignment rendering (center, right, justify)
- [ ] Implement character-level formatting with proper range handling
- [ ] Add gradient fill support for table cells
- [ ] Test with various HWP documents to ensure compatibility

## Current Work Status

**Last Updated**: 2025-09-04
**Current Focus**: ✅ Viewer rendering issues - Text alignment fixed
**Next Steps**: Character-level formatting and table gradient rendering

### Completed Work
1. **Parser Architecture Redesign** (2025-08-29 - 2025-09-03)
   - Created `RecordParser` interface and `BaseRecordParser` abstract class
   - Implemented individual parsers for each record type:
     - `ParagraphHeaderParser`
     - `ParaTextParser`
     - `CharShapeParser`
     - `TableParser`
     - `ControlHeaderParser`
     - `LineSegmentParser`
     - `PageDefParser`
     - `ListHeaderParser`
     - `ShapeComponentParser`
   - Created `RecordParserFactory` for parser management
   - Created `SectionParserV2` as refactored version with V1 compatibility
   - Added test files for parsers
   - **Set SectionParserV2 as default parser** - The original SectionParser now wraps V2
   - Backed up original parser as `SectionParser.v1.ts`

2. **Viewer Text Alignment Fix** (2025-09-04)
   - Diagnosed issue: PageBuilder was not preserving paragraph shapeIndex during page reconstruction
   - Root cause: When splitting content across pages, new Paragraph objects were created without copying shapeIndex
   - Solution: Modified `PageBuilder.visitParagraph()` to preserve original shapeIndex
   - Result: Text alignment (center, right, justify) now renders correctly in viewer
   
### V1-V2 Compatibility Issues Fixed
1. **PAGE_DEF Processing** (2025-09-03)
   - Issue: V2 was not processing PAGE_DEF records at the top level (width/height showing as 0)
   - Root cause: PAGE_DEF is nested inside CTRL_HEADER records, not at top level
   - V1: Processes CTRL_HEADER children through `visit` method which handles PAGE_DEF
   - V2 Fix: Modified `routeRecord` to process CTRL_HEADER children recursively
   - Result: ✅ Page dimensions (width/height) now match V1 output perfectly
   - Verified: All section properties (width, height, paddings, orientation) match V1

2. **Table Parsing Complete Reimplementation** (2025-09-03)
   - Issue: Tables were not rendering - no cell data was being parsed
   - Root cause: Fundamental architectural difference between sequential (V1) and recursive (V2) parsing
   - V1: Uses sequential reader where LIST_HEADER reads the next N paragraph records
   - V2 Fix: Implemented hybrid approach - pass RecordReader through to support sequential reading
   - Result: ✅ All table data now correctly parsed including cell contents
   - Verified: Table structure, cell attributes, and paragraph contents match V1
   
### Parser Architecture Design Decision

#### Sequential vs Recursive Parsing Approaches

After implementing both approaches, we've determined that **a hybrid approach combining Sequential and Recursive parsing** is most suitable for HWP format:

**Why Sequential is Better for HWP:**
1. **Format Design**: HWP files are inherently sequential - records reference subsequent records (e.g., LIST_HEADER followed by N paragraph headers)
2. **Memory Efficiency**: Process one record at a time without building entire tree structure
3. **Natural Flow**: Matches how HWP files are actually written and read
4. **Simplicity**: Straightforward implementation without complex workarounds

**Hybrid Approach Implementation:**
```typescript
// Top-level: Sequential reading
while (reader.hasNext()) {
  const record = reader.read()
  // Pass reader for sequential access
  processRecord(record, reader)
}

// Record-level: Modular parsers
const parser = parserFactory.getParser(record.tagID)
parser.parse(record, reader)

// Independent structures: Recursive processing
// (e.g., shape components with self-contained children)
```

This approach:
- Respects HWP's sequential nature for records that need it (tables, lists)
- Maintains modularity through individual parsers
- Allows recursive processing where appropriate (shapes, nested structures)
- Provides best performance and maintainability

### 3. Viewer Rendering Issues Fixed (2025-09-04)

#### Text Alignment Not Applied - FIXED ✅
**Problem**: Text with center alignment (e.g., "2024. 07.") was displaying as left-aligned
- Root cause: `PageBuilder` was not preserving paragraph's `shapeIndex` when reconstructing pages
- When creating new paragraphs, shapeIndex defaulted to 0 (justify alignment)
- Fix: Modified `PageBuilder.visitParagraph()` to copy original `shapeIndex`

```typescript
// packages/viewer/src/PageBuilder.ts
visitParagraph = (paragraph: Paragraph) => {
  // ... initialization ...
  this.currentParagraph = new Paragraph()
  this.currentParagraph.shapeIndex = paragraph.shapeIndex // Added this line
}
```

#### Character-Level Formatting Issues - FIXED ✅ (2025-09-04)
**Problem**: Bold/italic formatting was applied to entire sections instead of individual characters
- Example: In "□ 운영대상 : 1~3학년", only "□ 운영대상" should be bold
- Root Cause: 
  1. Parser issue: V1 parsed JSON had only 1 shapeBuffer entry (should have 3) - V2 parser already correct
  2. Viewer issue: drawText() method wasn't applying character attributes (bold, italic, etc.)
  3. PageBuilder issue: checkoutShpeBuffer() was collapsing multiple shapeBuffer entries into one
- Fix: 
  1. Modified `viewer.ts` drawText() to apply character attributes based on charShape.attr bit field
  2. Modified `PageBuilder.ts` checkoutShpeBuffer() to preserve original shapeBuffer for single-page paragraphs:

```typescript
// packages/viewer/src/viewer.ts - drawText() method
if (charShape) {
  const { fontBaseSize, fontRatio, color, fontId, attr } = charShape
  // ... existing code ...
  
  // Apply character attributes (bold, italic, underline, etc.)
  // attr is a bit field where:
  // bit 0: italic (0x01)
  // bit 1: bold (0x02)
  // bit 2: underline (0x04)
  // bit 8: strike through (0x100)
  if (attr & 0x01) span.style.fontStyle = 'italic'
  if (attr & 0x02) span.style.fontWeight = 'bold'
  if (attr & 0x04) span.style.textDecoration = 'underline'
  if (attr & 0x100) {
    if (span.style.textDecoration) {
      span.style.textDecoration += ' line-through'
    } else {
      span.style.textDecoration = 'line-through'
    }
  }
}
```

```typescript
// packages/viewer/src/PageBuilder.ts - checkoutShpeBuffer() method
checkoutShpeBuffer(paragraph: Paragraph) {
  // If this is the first and only page containing the entire paragraph,
  // simply copy the shapeBuffer as-is
  if (this.startChatIndex === 0 && this.endCharIndex >= paragraph.content.length - 1) {
    this.currentParagraph.shapeBuffer = paragraph.shapeBuffer.map(sb => ({
      shapeIndex: sb.shapeIndex,
      pos: sb.pos
    }));
    return;
  }
  // ... original logic for multi-page paragraphs ...
}
```

#### Table Cell Gradient Rendering - FIXED ✅ (2025-09-04)
**Problem**: Table cells with gradient backgrounds showed solid color or no background
- Example: First table's 3rd row (Row 2, Cell 0) uses borderFillID 9 which has a gradient
- Root Cause: 
  1. DocInfoParser was only parsing single color fills, not gradients
  2. Viewer had no gradient rendering support
- Fix:
  1. Modified `BorderFill` model to support gradient properties:
     - Added `fillType`, `gradientFill` with type, angle, colors, etc.
  2. Modified `DocInfoParser.visitBorderFill()` to parse gradient data when fillType is 4 (Gradation)
  3. Modified `viewer.ts` drawBorderFill() to render CSS gradients:

```typescript
// packages/viewer/src/viewer.ts - drawBorderFill() method
if (borderFillAny.fillType === 4 && borderFillAny.gradientFill) {
  const gradient = borderFillAny.gradientFill
  
  if (gradient.colors && gradient.colors.length >= 2) {
    const color1 = this.getRGBStyle(gradient.colors[0].color)
    const color2 = this.getRGBStyle(gradient.colors[1].color)
    
    switch (gradient.type) {
      case 0: // Linear
        target.style.background = `linear-gradient(${angle}deg, ${color1}, ${color2})`
        break
      case 1: // Radial
        target.style.background = `radial-gradient(ellipse at ${centerX}% ${centerY}%, ${color1}, ${color2})`
        break
      case 2: // Conic
        target.style.background = `conic-gradient(from ${gradient.angle || 0}deg, ${color1}, ${color2})`
        break
      case 3: // Square
        target.style.background = `radial-gradient(closest-side, ${color1}, ${color2})`
        break
    }
  }
}
```

### Pending Issues
1. **Build System**: Need to properly configure rollup for TypeScript compilation
2. **Type Errors**: TableParser has missing properties in TableControl model

### Files Created/Modified
**Parser V2 Implementation:**
- `/packages/parser/src/parsers/` - New directory with all parser implementations
- `/packages/parser/src/SectionParserV2.ts` - Refactored section parser with hybrid approach
- `/packages/parser/src/SectionParser.ts` - Now wraps SectionParserV2 for compatibility
- `/packages/parser/src/SectionParser.v1.ts` - Backup of original implementation
- `/packages/parser/src/__tests__/parsers/` - Test files for parsers
- `/packages/parser/src/models/paragraph.ts` - Added missing properties for V2 compatibility
- `/packages/parser/src/models/controls/table.ts` - Added table properties (cellSpacing, margins, etc.)

**Viewer Fixes (2025-09-04):**
- `/packages/viewer/src/viewer.ts` - Improved alignment handling, removed !important CSS, added character attribute support, added gradient rendering
- `/packages/viewer/src/PageBuilder.ts` - Fixed shapeIndex preservation in visitParagraph() and checkoutShpeBuffer()

**Parser Enhancements (2025-09-04):**
- `/packages/parser/src/models/borderFill.ts` - Added gradient support (GradientType enum, GradientFill interface)
- `/packages/parser/src/DocInfoParser.ts` - Enhanced visitBorderFill() to parse gradient fills

## Notes for Future Claude Sessions

1. **Testing Strategy**: Always test V1-V2 compatibility before making viewer changes
2. **Debugging Workflow**: 
   - Check parsed JSON output first
   - Verify data after `parsePage` transformation
   - Inspect final HTML rendering
3. **Common Issues**:
   - PageBuilder may transform data during page reconstruction
   - shapeIndex references must be preserved through all transformations
   - Character shapes use ranges within paragraphs
4. **Documentation**: Update docs/mapping-guide.md as architecture changes
5. **Performance Metrics**: Establish benchmarks before optimization

## Known Issues

1. `SectionParser.visitParagraphHeader` line 433: Hardcoded byte offset needs investigation
2. Table parsing doesn't handle all edge cases
3. Missing support for some control types
4. Incomplete implementation of HWP 5.0.3+ features

## Resources

- HWP File Format Specification: `docs/filestructure/`
- Original PDF Spec: `docs/한글문서파일형식_5.0_revision1.3.pdf`
- Test Files: `Temp/` directory

## Test Script 작성 규칙

### JavaScript 테스트 스크립트 (.js)

HWP.js 프로젝트에서 Node.js 환경의 테스트 스크립트를 작성할 때는 다음 규칙을 따라야 합니다:

#### 1. CommonJS 모듈 시스템 사용
```javascript
// ✅ Correct - CommonJS require
const fs = require('fs');
const path = require('path');

// ❌ Incorrect - ES6 import
import fs from 'fs';
```

#### 2. 컴파일된 라이브러리 사용
프로젝트가 TypeScript로 작성되어 있으므로, 테스트 스크립트에서는 컴파일된 라이브러리를 사용해야 합니다:

```javascript
// ✅ Correct - lib 디렉토리의 컴파일된 파일 사용
const parseRecord = require('./packages/parser/lib/parseRecord').default;
const ByteReader = require('./packages/parser/lib/utils/byteReader').default;

// ❌ Incorrect - src 디렉토리의 TypeScript 파일 직접 사용
const parseRecord = require('./packages/parser/src/parseRecord');
```

#### 3. babel-register를 사용한 TypeScript 직접 실행
빌드가 되지 않은 상황에서 TypeScript 파일을 직접 실행해야 할 경우:

```javascript
// babel-register를 사용하여 TypeScript 지원
require('@babel/register')({
  extensions: ['.js', '.ts'],
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript'
  ]
});

// 이후 TypeScript 파일을 직접 require 가능
const SectionParserV2 = require('./packages/parser/src/SectionParserV2').default;
```

#### 4. 파일 경로는 항상 프로젝트 루트 기준
```javascript
// ✅ Correct - 프로젝트 루트 기준 경로
const hwpFile = './Temp/basicsReport.hwp';

// ❌ Incorrect - 상대 경로 사용
const hwpFile = '../../../Temp/basicsReport.hwp';
```

#### 5. 테스트 결과 출력 형식
```javascript
console.log('=== TEST TITLE ===');
console.log('Expected:', expectedValue);
console.log('Actual:', actualValue);
console.log('Match:', expectedValue === actualValue ? '✓' : '✗');
```

### TypeScript 테스트 스크립트 (.ts)

TypeScript 파일로 테스트를 작성하는 경우:

#### 1. ES6 모듈 시스템 사용
```typescript
// ✅ Correct - ES6 import
import * as fs from 'fs'
import parse from './packages/parser/src/parse'

// 실행 시: npx ts-node test-script.ts
```

#### 2. 타입 안정성 활용
```typescript
import { HWPDocument, Section } from './packages/parser/src/models'

const document: HWPDocument = parse(buffer)
const section: Section = document.sections[0]
```

### 테스트 스크립트 실행 방법

1. **JavaScript 스크립트 실행**:
   ```bash
   node test-script.js
   ```

2. **TypeScript 스크립트 실행**:
   ```bash
   npx ts-node test-script.ts
   ```

3. **babel-register 사용 시**:
   ```bash
   # babel 관련 패키지가 설치되어 있어야 함
   yarn add -D @babel/register @babel/preset-env @babel/preset-typescript
   node test-script.js
   ```