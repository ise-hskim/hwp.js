# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language Settings

**IMPORTANT**: Always respond to the user in Korean (한국어) unless explicitly requested otherwise. This applies to all explanations, confirmations, and discussions. Code comments and documentation can remain in English unless specified.

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

## HWP.js Parser 구현 현황 체크리스트

> **최종 업데이트**: 2025-09-04  
> **문서 버전**: HWP 5.0 (revision 1.3)

### 📋 전체 구현 진행률
- **파일 구조**: ✅ 100% (3/3)
- **DocInfo 레코드**: 52% (11/21)
- **본문(BodyText) 레코드**: 22% (8/36)
- **문서 이력관리**: ❌ 0% (0/3)
- **전체 진행률**: 약 35%

### 핵심 기능 구현 상태
- ✅ **기본 문서 읽기**: 완료
- ✅ **텍스트 추출**: 완료
- ✅ **표 파싱**: 완료
- ⚠️ **그림/미디어**: 부분 구현
- ❌ **수식**: 미구현
- ❌ **그리기 개체**: 대부분 미구현

### 상세 구현 현황

#### 1. 파일 구조 (File Structure) ✅
- [x] **File Header** (256 bytes) - `HWPHeader` 모델로 구현
- [x] **DocInfo Stream** - `DocInfoParser`로 구현
- [x] **BodyText Stream** - `SectionParser`로 구현
- [x] **zlib 압축 해제** - pako 라이브러리 사용
- [ ] **Summary Information Stream** - 미구현
- [ ] **BinData Storage** - 부분 구현 (읽기만 가능)
- [ ] **암호화 지원** - 미구현
- [ ] **기타 스트림** (PrvText, PrvImage, DocOptions, Scripts 등) - 미구현

#### 2. DocInfo 스트림 레코드
##### 필수 레코드 ✅
| Tag ID | 레코드 명 | 구현 상태 | 파일/메서드 |
|--------|----------|----------|-------------|
| 0x010 | HWPTAG_DOCUMENT_PROPERTIES | ✅ 완료 | `DocInfoParser.visitDocumentPropertes()` |
| 0x012 | HWPTAG_BIN_DATA | ✅ 완료 | `DocInfoParser.visitBinData()` |
| 0x013 | HWPTAG_FACE_NAME | ✅ 완료 | `DocInfoParser.visitFaceName()` |
| 0x014 | HWPTAG_BORDER_FILL | ✅ 완료 | `DocInfoParser.visitBorderFill()` |
| 0x015 | HWPTAG_CHAR_SHAPE | ✅ 완료 | `DocInfoParser.visitCharShape()` |
| 0x017 | HWPTAG_NUMBERING | ✅ 완료 | `DocInfoParser.visitNumbering()` |
| 0x018 | HWPTAG_BULLET | ✅ 완료 | `DocInfoParser.visitBullet()` |
| 0x019 | HWPTAG_PARA_SHAPE | ⚠️ 부분 | `DocInfoParser.visitParagraphShape()` (align만 구현) |
| 0x01A | HWPTAG_STYLE | ✅ 완료 | `DocInfoParser.visitStyle()` |
| 0x01E | HWPTAG_COMPATIBLE_DOCUMENT | ✅ 완료 | `DocInfoParser.visitCompatibleDocument()` |
| 0x01F | HWPTAG_LAYOUT_COMPATIBILITY | ✅ 완료 | `DocInfoParser.visitLayoutCompatibility()` |

##### 미구현 레코드
- HWPTAG_ID_MAPPINGS (0x011)
- HWPTAG_TAB_DEF (0x016)
- HWPTAG_DOC_DATA (0x01B)
- HWPTAG_DISTRIBUTE_DOC_DATA (0x01C)
- HWPTAG_TRACKCHANGE (0x020)
- HWPTAG_MEMO_SHAPE (0x05C)
- HWPTAG_FORBIDDEN_CHAR (0x05E)
- HWPTAG_TRACK_CHANGE (0x060)
- HWPTAG_TRACK_CHANGE_AUTHOR (0x061)

#### 3. BodyText 스트림 레코드
##### 기본 레코드 ✅
| Tag ID | 레코드 명 | 구현 상태 | 파서 클래스 |
|--------|----------|----------|-------------|
| 0x042 | HWPTAG_PARA_HEADER | ✅ 완료 | `ParagraphHeaderParser` |
| 0x043 | HWPTAG_PARA_TEXT | ✅ 완료 | `ParaTextParser` |
| 0x044 | HWPTAG_PARA_CHAR_SHAPE | ✅ 완료 | `CharShapeParser` |
| 0x045 | HWPTAG_PARA_LINE_SEG | ✅ 완료 | `LineSegmentParser` |
| 0x047 | HWPTAG_CTRL_HEADER | ✅ 완료 | `ControlHeaderParser` |
| 0x048 | HWPTAG_LIST_HEADER | ✅ 완료 | `ListHeaderParser` |
| 0x049 | HWPTAG_PAGE_DEF | ✅ 완료 | `PageDefParser` |
| 0x04C | HWPTAG_SHAPE_COMPONENT | ⚠️ 부분 | `ShapeComponentParser` |
| 0x04D | HWPTAG_TABLE | ✅ 완료 | `TableParser` |

##### 미구현 개체 레코드
- 그리기 개체: LINE, RECTANGLE, ELLIPSE, ARC, POLYGON, CURVE
- 미디어 개체: OLE, PICTURE (부분), CONTAINER
- 특수 개체: EQEDIT (수식), TEXTART, FORM_OBJECT
- 기타: MEMO_LIST, CHART_DATA, VIDEO_DATA

#### 4. 버전 호환성
| HWP 버전 | 지원 여부 | 비고 |
|----------|----------|------|
| 5.0.0.0 | ✅ | 기본 지원 |
| 5.0.1.0 | ⚠️ | 압축 지원, Instance ID 미지원 |
| 5.0.2.0 | ❌ | 문서 이력, 확장 번호 미지원 |
| 5.0.3.0 | ❌ | 세그먼트 타입, 고급 효과 미지원 |

## Architecture Enhancement Roadmap

### 1. Parser Architecture Redesign ✅ (완료)
2025-08-29 ~ 2025-09-03에 완료된 작업:
- `RecordParser` 인터페이스 및 `BaseRecordParser` 추상 클래스 생성
- 각 레코드 타입별 개별 파서 구현
- `RecordParserFactory`로 파서 관리
- `SectionParserV2`를 기본 파서로 설정
- 하이브리드 방식(Sequential + Recursive) 채택

### 2. 우선순위 개선 작업

#### 높음 (핵심 기능)
- [ ] 나머지 ParagraphShape 속성 구현 (들여쓰기, 줄간격 등)
- [ ] 이미지 패턴 채우기 구현
- [ ] 머리말/꼬리말 지원
- [ ] 페이지 테두리/배경 지원

#### 중간 (호환성)
- [ ] 수식 개체 지원
- [ ] 그리기 개체 (도형) 지원
- [ ] OLE 개체 지원
- [ ] 양식 개체 지원

#### 낮음 (고급 기능)
- [ ] 문서 이력 관리
- [ ] 변경 추적
- [ ] 암호화 지원
- [ ] 스크립트 지원

## Recent Work History

### 2025-09-04 Updates
- **Viewer Rendering Fixes**: 모든 렌더링 이슈 수정 완료
  - 텍스트 정렬 (center, right, justify) 렌더링 수정
  - 문자 단위 서식 (bold, italic) 적용 수정
  - 테이블 셀 그라디언트 배경 렌더링 구현
  - 작은 폰트 크기(1pt) 높이 렌더링 수정
- **Parser 구현 현황 체크리스트 작성**: 전체 구현 상태 문서화

### 2025-08-29 ~ 2025-09-03
- **Parser Architecture Redesign 완료**
  - `RecordParser` 인터페이스 기반 개별 파서 구현
  - `SectionParserV2`를 기본 파서로 설정
  - 하이브리드(Sequential + Recursive) 파싱 방식 채택
   
## Technical Implementation Details

### Parser Architecture: Hybrid Approach
HWP 파일의 순차적 특성을 고려한 하이브리드(Sequential + Recursive) 방식 채택:
- **Sequential**: 최상위 레벨에서 순차적 읽기 (LIST_HEADER → N개 문단 등)
- **Modular**: 각 레코드 타입별 개별 파서 클래스
- **Recursive**: 독립적 구조체는 재귀적 처리 (shape components 등)

### Key Technical Fixes (2025-09-04)

#### 1. 텍스트 정렬 수정
- 문제: PageBuilder가 페이지 재구성 시 paragraph.shapeIndex 미보존
- 해결: `PageBuilder.visitParagraph()`에서 shapeIndex 복사

#### 2. 문자 단위 서식 수정  
- 문제: shapeBuffer 항목들이 하나로 병합되어 전체 텍스트에 동일 서식 적용
- 해결: 
  - `viewer.drawText()`: charShape.attr 비트필드 기반 속성 적용
  - `PageBuilder.checkoutShpeBuffer()`: 단일 페이지 문단의 shapeBuffer 보존

#### 3. 그라디언트 렌더링 구현
- BorderFill 모델 확장: gradientFill 속성 추가
- DocInfoParser: fillType=4일 때 그라디언트 데이터 파싱
- Viewer: HWP 그라디언트 타입별 CSS gradient 매핑
  - Type 1: 줄무늬형 → linear-gradient
  - Type 2: 원형 → radial-gradient (circle)
  - Type 3: 원뿔형 → conic-gradient
  - Type 4: 사각형 → radial-gradient (square)

## 📚 개선 작업 전 필수 문서 정독 가이드

**⚠️ 중요**: HWP.js의 개선 작업이나 고도화 시도를 시작하기 전에, 반드시 관련 HWP 파일 포맷 문서를 정독해야 합니다. 이는 올바른 구현과 기존 코드의 이해를 위해 필수적입니다.

### 작업 유형별 필수 문서 매핑

#### 1. Parser 관련 작업

##### 1.1 DocInfo 레코드 개선 작업
**대상 작업**: 글자모양, 문단모양, 테두리/배경, 스타일 등 DocInfo 레코드 파싱 개선

**필수 정독 문서**:
- `docs/filestructure/04_데이터레코드/README.md` - DocInfo 레코드 전체 개요
- `docs/filestructure/04_데이터레코드/DocInfo레코드.md` - 기본 DocInfo 레코드 구조
- `docs/filestructure/04_데이터레코드/글자모양.md` - CharShape 구조 (HWPTAG_CHAR_SHAPE)
- `docs/filestructure/04_데이터레코드/글머리표_문단모양.md` - ParagraphShape, Bullet, Numbering 구조
- `docs/filestructure/04_데이터레코드/글꼴_테두리.md` - FontFace, BorderFill 구조
- `docs/filestructure/04_데이터레코드/스타일.md` - Style 레코드 구조
- `docs/filestructure/04_데이터레코드/탭_문단번호.md` - 탭 정의와 문단 번호 구조
- `docs/filestructure/02_자료형/README.md` - 기본 데이터 타입 정의

**정독 체크포인트**:
- [ ] 각 레코드의 바이트 구조 이해
- [ ] 비트 필드 플래그들의 의미 파악
- [ ] 버전별 차이점 확인
- [ ] 참조 ID들의 연관관계 이해

##### 1.2 본문 레코드 개선 작업
**대상 작업**: 문단, 표, 그리기 개체, 수식 등 BodyText 레코드 파싱 개선

**필수 정독 문서**:
- `docs/filestructure/05_본문레코드/README.md` - BodyText 레코드 전체 개요
- `docs/filestructure/05_본문레코드/문단레이아웃.md` - 문단 헤더, 텍스트, 글자모양, 라인 세그먼트
- `docs/filestructure/05_본문레코드/표개체.md` - 테이블 구조 (HWPTAG_TABLE)
- `docs/filestructure/05_본문레코드/그리기개체.md` - Shape Component 기본 구조
- `docs/filestructure/05_본문레코드/그리기개체상세.md` - 선, 사각형, 타원, 다각형 등 상세 구조
- `docs/filestructure/05_본문레코드/수식_그림개체.md` - 수식, 그림 개체 구조
- `docs/filestructure/05_본문레코드/컨트롤헤더.md` - 컨트롤 헤더 구조
- `docs/filestructure/05_본문레코드/컨트롤개체.md` - 각종 컨트롤 개체들

**정독 체크포인트**:
- [ ] LIST_HEADER와 문단들의 순차적 관계 이해
- [ ] CTRL_HEADER의 자식 레코드 구조 파악
- [ ] 좌표계 및 크기 단위 (HWPUNIT) 이해
- [ ] 개체 공통 속성과 개별 속성 구분

##### 1.3 고급 기능 구현 작업
**대상 작업**: 머리말/꼬리말, 각주/미주, 페이지 설정, 필드 등

**필수 정독 문서**:
- `docs/filestructure/05_본문레코드/구역정의.md` - 구역 및 단 설정
- `docs/filestructure/05_본문레코드/용지설정.md` - PAGE_DEF 구조
- `docs/filestructure/05_본문레코드/머리말꼬리말.md` - 머리말/꼬리말 구조
- `docs/filestructure/05_본문레코드/각주미주.md` - 각주/미주 설정
- `docs/filestructure/05_본문레코드/번호지정.md` - 자동 번호 매기기
- `docs/filestructure/05_본문레코드/페이지제어.md` - 페이지 제어 (홀/짝수, 페이지 번호)
- `docs/filestructure/05_본문레코드/필드.md` - 필드 타입 및 속성
- `docs/filestructure/05_본문레코드/쪽테두리배경.md` - 페이지 테두리/배경

#### 2. Viewer 관련 작업

##### 2.1 렌더링 개선 작업
**필수 정독 문서**:
- `docs/filestructure/02_자료형/README.md` - HWPUNIT, COLORREF 등 단위와 색상 정의
- `docs/filestructure/04_데이터레코드/글자모양.md` - 문자 속성 비트 필드
- `docs/filestructure/04_데이터레코드/글머리표_문단모양.md` - 문단 정렬, 들여쓰기 등
- `docs/filestructure/04_데이터레코드/글꼴_테두리.md` - 테두리 타입, 그라디언트 정의

**정독 체크포인트**:
- [ ] HWPUNIT을 CSS 단위로 변환하는 방법
- [ ] COLORREF 구조와 RGB 변환
- [ ] 문자 속성 비트 필드 (굵기, 기울임, 밑줄 등)
- [ ] 그라디언트 타입별 CSS 매핑

##### 2.2 레이아웃 개선 작업
**필수 정독 문서**:
- `docs/filestructure/05_본문레코드/문단레이아웃.md` - 문단 레이아웃 및 라인 세그먼트
- `docs/filestructure/05_본문레코드/용지설정.md` - 페이지 크기, 여백 설정
- `docs/filestructure/05_본문레코드/표개체.md` - 테이블 셀 크기, 병합 정보

#### 3. 파일 구조 관련 작업

**필수 정독 문서**:
- `docs/filestructure/03_파일구조/README.md` - 전체 파일 구조 개요
- `docs/filestructure/03_파일구조/FileHeader.md` - 256바이트 파일 헤더 구조
- `docs/filestructure/03_파일구조/DocInfo_BodyText.md` - 주요 스트림 구조
- `docs/filestructure/03_파일구조/제어문자.md` - 제어 문자 코드 (0-31)
- `docs/filestructure/03_파일구조/기타스트림.md` - Summary Info, BinData 등

### 📋 정독 진행 체크리스트

작업을 시작하기 전에 다음 체크리스트를 완료하세요:

#### 기본 이해 체크
- [ ] **데이터 타입**: `02_자료형/README.md` 정독 완료
- [ ] **파일 구조**: `03_파일구조/README.md` 정독 완료
- [ ] **레코드 구조**: 해당 작업 관련 레코드 문서 정독 완료

#### 세부 구현 체크
- [ ] **바이트 구조**: 관련 레코드들의 바이트별 구조 완전 이해
- [ ] **비트 필드**: 플래그 비트들의 의미와 사용법 파악
- [ ] **참조 관계**: ID 참조들의 연관관계 매핑 완료
- [ ] **버전 호환성**: 해당 기능의 HWP 버전별 차이점 확인

#### 실습 체크
- [ ] **기존 코드**: 관련 파서/모델 코드 분석 완료
- [ ] **테스트 파일**: 실제 HWP 파일로 구조 확인 완료
- [ ] **바이트 분석**: 헥스 에디터로 실제 바이트 데이터 확인

### 🔍 문서 활용 팁

1. **순서대로 읽기**: README → 상세 구조 → 비트 필드 → 예제 순서로 읽으세요.

2. **실제 파일과 대조**: `Temp/` 디렉토리의 테스트 파일을 헥스 에디터로 열어 문서와 대조해보세요.

3. **기존 구현 참조**: 해당 기능이 이미 부분적으로 구현되어 있다면 코드를 먼저 분석하세요.

4. **비트 계산기 활용**: 비트 필드 분석 시 온라인 비트 계산기를 활용하세요.

5. **메모 작성**: 복잡한 구조는 별도 메모나 다이어그램으로 정리하세요.

### ⚠️ 주의사항

- **문서 먼저, 코드 나중**: 반드시 문서를 충분히 이해한 후 코딩을 시작하세요.
- **버전 확인**: HWP 5.0 기준이므로 다른 버전 정보는 참고용으로만 사용하세요.
- **바이트 정확성**: 1바이트라도 잘못 읽으면 전체 구조가 깨지므로 신중하게 접근하세요.
- **테스트 필수**: 구현 후 반드시 다양한 HWP 파일로 테스트하세요.

## ⚠️ 문제 해결 시 반드시 지켜야 할 원칙

**절대 금지 사항:**
1. **하드코딩 절대 금지**: 특정 케이스만 해결하는 임시방편 코드 작성 금지
2. **추측으로 코딩 금지**: 실제 데이터 구조를 확인하지 않고 추측으로 코드 작성 금지
3. **무작정 시도 금지**: 여러 방법을 이것저것 시도하지 말고, 근본 원인을 찾은 후 한 번에 해결

**문제 해결 프로세스:**
1. **현상 파악**: 실제 데이터가 어떻게 파싱되고 렌더링되는지 정확히 확인
   - console.log로 실제 객체 구조 출력
   - 디버깅 스크립트 작성해서 데이터 흐름 추적
   
2. **근본 원인 분석**: 왜 그런 현상이 발생하는지 코드 레벨에서 정확히 파악
   - 파서 → PageBuilder → Viewer 전체 흐름 이해
   - 각 단계에서 데이터가 어떻게 변형되는지 확인
   
3. **올바른 해결**: 근본 원인에 대한 정확한 수정
   - 부작용 없는 최소한의 수정
   - 다른 케이스에도 적용 가능한 일반적인 해결책

**예시 - 올바른 접근:**
```
문제: 테이블이 텍스트보다 먼저 렌더링됨
1. 현상 파악: Extended 문자가 텍스트 끝에 있음 확인
2. 원인 분석: drawText()에서 Extended 문자 만나면 즉시 drawControl() 호출
3. 해결: 텍스트 먼저 렌더링 후 control 렌더링하도록 순서 변경
```

**예시 - 잘못된 접근:**
```
❌ "테이블이 2개니까 중복 제거하자" → 하드코딩
❌ "controls 앞에 놓아보자, 뒤에 놓아보자" → 무작정 시도
❌ "아마 이게 문제일 것 같으니 수정해보자" → 추측 코딩
```

## Known Issues & TODOs

### Parser Issues
1. **하드코딩된 바이트 오프셋**: `SectionParser.visitParagraphHeader` line 433
2. **불완전한 에러 처리**: 대부분 단순 throw 사용
3. **메모리 효율성**: 대용량 문서 처리 시 성능 문제
4. **타입 안정성**: 많은 `any` 타입 사용

### Build & Test
1. **Build System**: Rollup TypeScript 컴파일 설정 필요
2. **Type Errors**: TableParser의 TableControl 모델 속성 누락
3. **Test Coverage**: 현재 ~60% → 목표 80%+

## Resources

- **HWP File Format Specification**: `docs/filestructure/` - Organized and structured documentation
- **Original PDF Spec**: `docs/한글문서파일형식_5.0_revision1.3.pdf`
- **PDF Split Markdown Files**: `docs/split/md/` - 한글문서파일형식 5.0 PDF를 71개 파일로 분할하여 markdown으로 변환한 문서
- **Test Files**: `Temp/` directory

### HWP File Format Documentation Structure (Organized 2025-09-04)

The HWP 5.0 file format specification has been organized in `docs/filestructure/` with the following structure:

#### 01_개요 (Overview)
- **README.md**: HWP file format overview, versions, compression methods
- Basic structure and file extensions

#### 02_자료형 (Data Types)  
- **README.md**: Complete data type definitions
- HWPUNIT (1/7200 inch), COLORREF, character codes

#### 03_파일구조 (File Structure)
- **FileHeader.md**: 256-byte file header structure
- **DocInfo_BodyText.md**: Document info and body text streams
- **제어문자.md**: Control character codes (0-31)
- **기타스트림.md**: Summary information, binary data streams

#### 04_데이터레코드 (Data Records)
- **DocInfo레코드.md**: Document information records structure
- **글자모양.md**: Character shape records (HWPTAG_CHAR_SHAPE)
- **문단모양.md**: Paragraph shape records
- **글머리표_문단모양.md**: Bullet and numbering formats
- **파라미터셋.md**: Parameter set structures

#### 05_본문레코드 (Body Text Records)
- **README.md**: Body text record overview
- **문단헤더.md**: Paragraph header structure
- **표개체.md**: Table object structures
- **그리기개체.md**: Drawing objects (shapes, lines, polygons)
- **그리기개체상세.md**: Detailed drawing object properties
- **수식_그림개체.md**: Equation and picture objects
- **묶음_동영상개체.md**: Container and video objects
- **컨트롤개체.md**: Control objects and field IDs
- **구역정의.md**: Section definitions
- **용지설정.md**: Page setup
- **각주미주.md**: Footnote/endnote formatting
- **쪽테두리배경.md**: Page border and background
- **머리말꼬리말.md**: Header/footer
- **번호지정.md**: Auto numbering controls
- **페이지제어.md**: Page control (odd/even, page numbers)
- **텍스트장식.md**: Text decorations (bookmarks, ruby text)
- **필드.md**: Field types and properties

#### 06_문서이력관리 (Document History)
- **README.md**: Document version history management
- History items, version tracking, diff data

#### Additional Files
- **변경이력.md**: Specification revision history
- **발행정보.md**: Publisher information

This organization makes it easier to navigate and understand the HWP file format structure, with each component properly categorized and documented.

### HWP Document Format Reference Guide (Added 2025-09-04)

#### PDF to Markdown Conversion Complete
The original HWP Document File Format 5.0 PDF has been split into 71 individual files and converted to markdown format:

**File Structure:**
- `docs/split/` - Original PDF files (1_PDFsam_*.pdf ~ 71_PDFsam_*.pdf)
- `docs/split/md/` - Converted markdown files (1_PDFsam_*.md ~ 71_PDFsam_*.md)

**Key File Mapping:**
- Files 1-5: Cover, Table of Contents (no page numbers)
- File 6: Copyright (page 1)
- File 7: About This Document (page 2)
- File 8: I. HWP 5.0 File Structure Cover (page 3)
- File 10: 1. Overview (page 5)
- File 11: 2. Data Type Descriptions (page 6)
- Files 12-20: 3. HWP File Structure
- Files 21-37: 4. Data Records - Document Information
- Files 38-66: 4. Data Records - Body Text
- Files 67-68: 4. Data Records - Document History Management
- File 70: Change History
- File 71: Publication Information (page 66)

**How to Use:**
- Search markdown files when looking for specific Tag IDs or data structures
- Table structures, bit flags, and constant values are organized in markdown table format
- Page numbers at the end of each file allow cross-reference with original PDF

## HWP 텍스트 검색 방법

HWP JSON 파일에서 특정 텍스트를 검색할 때는 다음 사항을 반드시 고려해야 합니다:

### 텍스트 저장 구조
HWP 파일의 텍스트는 **개별 문자 단위**로 저장됩니다:
```json
"content": [
  { "type": 0, "value": "학" },
  { "type": 0, "value": "생" },
  { "type": 0, "value": " " },
  { "type": 0, "value": "맞" },
  { "type": 0, "value": "춤" },
  { "type": 0, "value": "형" }
]
```

### 올바른 검색 방법
```javascript
// ✅ 올바른 방법: 개별 문자를 결합한 후 검색
const textChars = paragraph.content
  .filter(item => item.type === 0 && typeof item.value === 'string')
  .map(item => item.value);

const fullText = textChars.join('');
const found = fullText.includes('출석부');

// ❌ 잘못된 방법: 전체 문자열로 직접 grep 검색
grep -r "출석부" file.json  // 찾을 수 없음
```

### 검색 스크립트 예제
```javascript
// HWP JSON에서 텍스트 찾기
function findTextInHWP(jsonPath, searchText) {
  const document = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  document.sections.forEach((section, sectionIndex) => {
    section.content.forEach((paragraph, pIndex) => {
      const fullText = paragraph.content
        .filter(item => item.type === 0 && typeof item.value === 'string')
        .map(item => item.value)
        .join('');
      
      if (fullText.includes(searchText)) {
        console.log(`발견: 섹션 ${sectionIndex + 1}, 문단 ${pIndex + 1}`);
        console.log(`내용: ${fullText.substring(0, 50)}...`);
      }
    });
  });
}
```

### 주의사항
1. **type: 0**인 항목만 일반 텍스트 (제어 문자는 다른 type)
2. **공백**도 개별 문자로 저장됨
3. **줄바꿈**은 별도 제어 문자로 처리
4. 검색 시 **대소문자** 구분 필요

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