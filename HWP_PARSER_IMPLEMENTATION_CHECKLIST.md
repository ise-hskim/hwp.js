# HWP.js Parser 구현 현황 체크리스트

> **최종 업데이트**: 2025-09-04  
> **문서 버전**: HWP 5.0 (revision 1.3)

## 📋 요약

### 전체 구현 진행률
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

---

## 1. 파일 구조 (File Structure) ✅

### 1.1 기본 구조
- [x] **File Header** (256 bytes) - `HWPHeader` 모델로 구현
- [x] **DocInfo Stream** - `DocInfoParser`로 구현
- [x] **BodyText Stream** - `SectionParser`로 구현
- [ ] **Summary Information Stream** - 미구현
- [ ] **BinData Storage** - 부분 구현 (읽기만 가능)
- [ ] **PrvText Stream** - 미구현
- [ ] **PrvImage Stream** - 미구현
- [ ] **DocOptions Stream** - 미구현
- [ ] **Scripts Stream** - 미구현
- [ ] **XML Template Storage** - 미구현
- [ ] **DocHistory Storage** - 미구현

### 1.2 압축 지원
- [x] **zlib 압축 해제** - pako 라이브러리 사용
- [ ] **암호화 지원** - 미구현

---

## 2. DocInfo 스트림 레코드

### 2.1 필수 레코드 ✅
| Tag ID | 레코드 명 | 구현 상태 | 파일/메서드 |
|--------|----------|----------|-------------|
| 0x010 | HWPTAG_DOCUMENT_PROPERTIES | ✅ 완료 | `DocInfoParser.visitDocumentPropertes()` |
| 0x011 | HWPTAG_ID_MAPPINGS | ❌ 미구현 | - |
| 0x012 | HWPTAG_BIN_DATA | ✅ 완료 | `DocInfoParser.visitBinData()` |
| 0x013 | HWPTAG_FACE_NAME | ✅ 완료 | `DocInfoParser.visitFaceName()` |
| 0x014 | HWPTAG_BORDER_FILL | ✅ 완료 | `DocInfoParser.visitBorderFill()` |
| 0x015 | HWPTAG_CHAR_SHAPE | ✅ 완료 | `DocInfoParser.visitCharShape()` |
| 0x016 | HWPTAG_TAB_DEF | ❌ 미구현 | - |
| 0x017 | HWPTAG_NUMBERING | ✅ 완료 | `DocInfoParser.visitNumbering()` |
| 0x018 | HWPTAG_BULLET | ✅ 완료 | `DocInfoParser.visitBullet()` |
| 0x019 | HWPTAG_PARA_SHAPE | ⚠️ 부분 | `DocInfoParser.visitParagraphShape()` (align만 구현) |
| 0x01A | HWPTAG_STYLE | ✅ 완료 | `DocInfoParser.visitStyle()` |

### 2.2 추가 레코드
| Tag ID | 레코드 명 | 구현 상태 | 파일/메서드 |
|--------|----------|----------|-------------|
| 0x01B | HWPTAG_DOC_DATA | ❌ 미구현 | - |
| 0x01C | HWPTAG_DISTRIBUTE_DOC_DATA | ❌ 미구현 | - |
| 0x01E | HWPTAG_COMPATIBLE_DOCUMENT | ✅ 완료 | `DocInfoParser.visitCompatibleDocument()` |
| 0x01F | HWPTAG_LAYOUT_COMPATIBILITY | ✅ 완료 | `DocInfoParser.visitLayoutCompatibility()` |
| 0x020 | HWPTAG_TRACKCHANGE | ❌ 미구현 | - |
| 0x05C | HWPTAG_MEMO_SHAPE | ❌ 미구현 | - |
| 0x05E | HWPTAG_FORBIDDEN_CHAR | ❌ 미구현 | - |
| 0x060 | HWPTAG_TRACK_CHANGE | ❌ 미구현 | - |
| 0x061 | HWPTAG_TRACK_CHANGE_AUTHOR | ❌ 미구현 | - |

### 2.3 구현 상세 - BorderFill
```typescript
// ✅ 구현된 기능
- 테두리 (상/하/좌/우) 타입, 두께, 색상
- 단색 채우기 (FillType.Single)
- 그라디언트 채우기 (FillType.Gradation) - 2025-09-04 추가

// ❌ 미구현 기능  
- 이미지 패턴 채우기 (FillType.Image)
- 해칭 패턴 채우기
```

### 2.4 구현 상세 - ParagraphShape
```typescript
// ✅ 구현된 기능
- align (정렬)

// ❌ 미구현 기능
- 들여쓰기/내어쓰기
- 줄 간격
- 문단 간격
- 탭 설정
- 외곽선
- 자동 줄바꿈
```

---

## 3. BodyText 스트림 레코드

### 3.1 기본 레코드 ✅
| Tag ID | 레코드 명 | 구현 상태 | 파서 클래스 |
|--------|----------|----------|-------------|
| 0x042 | HWPTAG_PARA_HEADER | ✅ 완료 | `ParagraphHeaderParser` |
| 0x043 | HWPTAG_PARA_TEXT | ✅ 완료 | `ParaTextParser` |
| 0x044 | HWPTAG_PARA_CHAR_SHAPE | ✅ 완료 | `CharShapeParser` |
| 0x045 | HWPTAG_PARA_LINE_SEG | ✅ 완료 | `LineSegmentParser` |
| 0x046 | HWPTAG_PARA_RANGE_TAG | ❌ 미구현 | - |

### 3.2 컨트롤 레코드
| Tag ID | 레코드 명 | 구현 상태 | 파서 클래스 |
|--------|----------|----------|-------------|
| 0x047 | HWPTAG_CTRL_HEADER | ✅ 완료 | `ControlHeaderParser` |
| 0x048 | HWPTAG_LIST_HEADER | ✅ 완료 | `ListHeaderParser` |
| 0x049 | HWPTAG_PAGE_DEF | ✅ 완료 | `PageDefParser` |
| 0x04A | HWPTAG_FOOTNOTE_SHAPE | ❌ 미구현 | - |
| 0x04B | HWPTAG_PAGE_BORDER_FILL | ❌ 미구현 | - |
| 0x057 | HWPTAG_CTRL_DATA | ❌ 미구현 | - |

### 3.3 개체 레코드
| Tag ID | 레코드 명 | 구현 상태 | 파서 클래스 |
|--------|----------|----------|-------------|
| 0x04C | HWPTAG_SHAPE_COMPONENT | ⚠️ 부분 | `ShapeComponentParser` |
| 0x04D | HWPTAG_TABLE | ✅ 완료 | `TableParser` |
| 0x04E | HWPTAG_SHAPE_COMPONENT_LINE | ❌ 미구현 | - |
| 0x04F | HWPTAG_SHAPE_COMPONENT_RECTANGLE | ❌ 미구현 | - |
| 0x050 | HWPTAG_SHAPE_COMPONENT_ELLIPSE | ❌ 미구현 | - |
| 0x051 | HWPTAG_SHAPE_COMPONENT_ARC | ❌ 미구현 | - |
| 0x052 | HWPTAG_SHAPE_COMPONENT_POLYGON | ❌ 미구현 | - |
| 0x053 | HWPTAG_SHAPE_COMPONENT_CURVE | ❌ 미구현 | - |
| 0x054 | HWPTAG_SHAPE_COMPONENT_OLE | ❌ 미구현 | - |
| 0x055 | HWPTAG_SHAPE_COMPONENT_PICTURE | ⚠️ 부분 | Picture 모델만 존재 |
| 0x056 | HWPTAG_SHAPE_COMPONENT_CONTAINER | ❌ 미구현 | - |
| 0x058 | HWPTAG_EQEDIT | ❌ 미구현 | - |
| 0x05A | HWPTAG_SHAPE_COMPONENT_TEXTART | ❌ 미구현 | - |
| 0x05B | HWPTAG_FORM_OBJECT | ❌ 미구현 | - |
| 0x05C | HWPTAG_MEMO_SHAPE | ❌ 미구현 | - |
| 0x05D | HWPTAG_MEMO_LIST | ❌ 미구현 | - |
| 0x05F | HWPTAG_CHART_DATA | ❌ 미구현 | - |
| 0x062 | HWPTAG_VIDEO_DATA | ❌ 미구현 | - |
| 0x073 | HWPTAG_SHAPE_COMPONENT_UNKNOWN | ❌ 미구현 | - |

### 3.4 구현 상세 - Table
```typescript
// ✅ 구현된 기능
- 테이블 구조 파싱
- 셀 속성 (병합, 테두리, 배경)
- 셀 내용 (문단) 파싱
- cellSpacing, 여백 설정

// ❌ 미구현 기능
- 테이블 캡션
- 테이블 내 수식
```

---

## 4. 컨트롤 문자 (Control Characters)

### 4.1 구현된 컨트롤
| ID | 이름 | 설명 | 구현 상태 |
|----|------|------|----------|
| 2 | SECTION_COLUMN_DEF | 구역/단 정의 | ✅ |
| 3 | FIELD_START | 필드 시작 | ⚠️ |
| 11 | TABLE | 표 | ✅ |
| 15 | SHAPE_OBJECT | 그리기 개체 | ⚠️ |
| 16 | HEADER | 머리말 | ❌ |
| 17 | FOOTER | 꼬리말 | ❌ |
| 18 | AUTO_NUMBER | 자동 번호 | ❌ |
| 21 | PAGE_HIDE | 감추기 | ❌ |
| 22 | PAGE_ODD_EVEN_ADJUST | 홀/짝수 조정 | ❌ |
| 23 | PAGE_NUMBER_POS | 쪽 번호 위치 | ❌ |
| 24 | INDEX_MARK | 찾아보기 표식 | ❌ |
| 25 | BOOKMARK | 책갈피 | ❌ |
| 30 | HIDDEN_COMMENT | 숨은 설명 | ❌ |

---

## 5. 문서 이력관리 (Document History) ❌

| 기능 | 구현 상태 | 비고 |
|------|----------|------|
| 문서 이력 저장 | ❌ | |
| 문서 비교 | ❌ | |
| 변경 추적 | ❌ | |

---

## 6. 추가 기능 구현 현황

### 6.1 Viewer 패키지
| 기능 | 구현 상태 | 최근 수정 |
|------|----------|----------|
| 텍스트 렌더링 | ✅ | |
| 텍스트 정렬 | ✅ | 2025-09-04 |
| 문자 속성 (굵게, 기울임 등) | ✅ | 2025-09-04 |
| 표 렌더링 | ✅ | |
| 그라디언트 배경 | ✅ | 2025-09-04 |
| 이미지 렌더링 | ⚠️ | |
| 인쇄 레이아웃 | ⚠️ | |
| 페이지 나누기 | ✅ | |

### 6.2 버전 호환성
| HWP 버전 | 지원 여부 | 비고 |
|----------|----------|------|
| 5.0.0.0 | ✅ | 기본 지원 |
| 5.0.1.0 | ⚠️ | 압축 지원, Instance ID 미지원 |
| 5.0.2.0 | ❌ | 문서 이력, 확장 번호 미지원 |
| 5.0.3.0 | ❌ | 세그먼트 타입, 고급 효과 미지원 |

---

## 7. 알려진 이슈

### 7.1 파서 이슈
1. **하드코딩된 바이트 오프셋**: `SectionParser.visitParagraphHeader` line 433
2. **불완전한 에러 처리**: 대부분 단순 throw 사용
3. **메모리 효율성**: 대용량 문서 처리 시 성능 문제
4. **타입 안정성**: 많은 `any` 타입 사용

### 7.2 Viewer 이슈 (2025-09-04 수정됨)
1. ~~텍스트 정렬 미적용~~ ✅ 수정 완료
2. ~~문자 단위 서식 미적용~~ ✅ 수정 완료  
3. ~~그라디언트 배경 미지원~~ ✅ 수정 완료
4. ~~작은 폰트 크기(1pt) 렌더링~~ ✅ 수정 완료

---

## 8. 우선순위 개선 제안

### 높음 (핵심 기능)
1. [ ] 나머지 ParagraphShape 속성 구현 (들여쓰기, 줄간격 등)
2. [ ] 이미지 패턴 채우기 구현
3. [ ] 머리말/꼬리말 지원
4. [ ] 페이지 테두리/배경 지원

### 중간 (호환성)
1. [ ] 수식 개체 지원
2. [ ] 그리기 개체 (도형) 지원
3. [ ] OLE 개체 지원
4. [ ] 양식 개체 지원

### 낮음 (고급 기능)
1. [ ] 문서 이력 관리
2. [ ] 변경 추적
3. [ ] 암호화 지원
4. [ ] 스크립트 지원

---

## 9. 테스트 커버리지

| 모듈 | 커버리지 | 비고 |
|------|----------|------|
| Parser 전체 | ~60% | Jest 기준 |
| DocInfoParser | ~70% | |
| SectionParser | ~50% | |
| Viewer | ~40% | |

---

## 10. 참고 문서

- **HWP 5.0 스펙**: `/docs/filestructure/`
- **원본 PDF**: `/docs/한글문서파일형식_5.0_revision1.3.pdf`
- **분할 마크다운**: `/docs/split/md/`
- **테스트 파일**: `/Temp/`

---

**마지막 검토**: 2025-09-04  
**작성자**: Claude (HWP.js 시니어 개발자)