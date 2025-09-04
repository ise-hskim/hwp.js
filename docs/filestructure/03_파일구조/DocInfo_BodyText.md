# DocInfo와 BodyText 스트림

## DocInfo 스트림

문서 전체에서 공통으로 사용되는 정보를 저장합니다.

### 저장 내용
- 글꼴
- 글자 속성
- 문단 속성
- 탭 정의
- 스타일
- 기타 문서 설정

### 레코드 구조 (표 4)

| Tag ID | 크기 | 레벨 | 설명 |
|--------|------|------|------|
| HWPTAG_DOCUMENT_PROPERTIES | 30 | 0 | 문서 속성 |
| HWPTAG_ID_MAPPINGS | 32 | 0 | 아이디 매핑 헤더 |
| HWPTAG_BIN_DATA | 가변 | 1 | 바이너리 데이터 |
| HWPTAG_FACE_NAME | 가변 | 1 | 글꼴 |
| HWPTAG_BORDER_FILL | 가변 | 1 | 테두리/배경 |
| HWPTAG_CHAR_SHAPE | 72 | 1 | 글자 모양 |
| HWPTAG_TAB_DEF | 14 | 1 | 탭 정의 |
| HWPTAG_NUMBERING | 가변 | 1 | 문단 번호 |
| HWPTAG_BULLET | 10 | 1 | 글머리표 |
| HWPTAG_PARA_SHAPE | 54 | 1 | 문단 모양 |
| HWPTAG_STYLE | 가변 | 1 | 스타일 |
| HWPTAG_MEMO_SHAPE | 22 | 1 | 메모 모양 |
| HWPTAG_TRACK_CHANGE_AUTHOR | 가변 | 1 | 변경 추적 작성자 |
| HWPTAG_TRACK_CHANGE | 가변 | 1 | 변경 추적 내용 |
| HWPTAG_DOC_DATA | 가변 | 0 | 문서 임의의 데이터 |
| HWPTAG_FORBIDDEN_CHAR | 가변 | 0 | 금칙처리 문자 |
| HWPTAG_COMPATIBLE_DOCUMENT | 4 | 0 | 호환 문서 |
| HWPTAG_LAYOUT_COMPATIBILITY | 20 | 1 | 레이아웃 호환성 |
| HWPTAG_DISTRIBUTE_DOC_DATA | 256 | 0 | 배포용 문서 |
| HWPTAG_TRACKCHANGE | 1032 | 1 | 변경 추적 정보 |

## BodyText 스토리지

실제 문서 본문 내용을 저장합니다.

### 구조
```
BodyText (스토리지)
├── Section0 (스트림) - 첫 번째 구역
├── Section1 (스트림) - 두 번째 구역
├── Section2 (스트림) - 세 번째 구역
└── ...
```

### Section 스트림 특징
- 구역별로 분리된 스트림
- 구역 개수는 HWPTAG_DOCUMENT_PROPERTIES에 저장
- 각 구역의 첫 문단: **구역 정의 레코드**
- 각 단 설정의 첫 문단: **단 정의 레코드**

### 문단 기본 레코드 구조

각 Section 스트림은 다음 레코드들의 반복으로 구성:

| Tag ID | 크기 | 레벨 | 설명 |
|--------|------|------|------|
| HWPTAG_PARA_HEADER | 22 | 0 | 문단 헤더 |
| HWPTAG_PARA_TEXT | 가변 | 1 | 문단 텍스트 |
| HWPTAG_PARA_CHAR_SHAPE | 가변 | 1 | 문단 글자 모양 |
| HWPTAG_PARA_LINE_SEG | 가변 | 1 | 문단 레이아웃 |

### 컨트롤 포함 시 추가 레코드 (표 5)

문단에 컨트롤이 포함되는 경우 다음 레코드들이 추가:

| Tag ID | 크기 | 레벨 | 설명 |
|--------|------|------|------|
| HWPTAG_PARA_RANGE_TAG | 가변 | 1 | 문단의 영역 태그 |
| HWPTAG_CTRL_HEADER | 4 | 1 | 컨트롤 헤더 |
| HWPTAG_LIST_HEADER | 6 | 2 | 문단 리스트 헤더 |
| HWPTAG_PAGE_DEF | 40 | 2 | 용지 설정 |
| HWPTAG_FOOTNOTE_SHAPE | 30 | 2 | 각주/미주 모양 |
| HWPTAG_PAGE_BORDER_FILL | 14 | 2 | 쪽 테두리/배경 |
| HWPTAG_SHAPE_COMPONENT | 4 | 2 | 개체 |
| HWPTAG_TABLE | 가변 | 2 | 표 개체 |
| HWPTAG_SHAPE_COMPONENT_LINE | 20 | 3 | 직선 개체 |
| HWPTAG_SHAPE_COMPONENT_RECTANGLE | 9 | 3 | 사각형 개체 |
| HWPTAG_SHAPE_COMPONENT_ELLIPSE | 60 | 3 | 타원 개체 |
| HWPTAG_SHAPE_COMPONENT_ARC | 25 | 3 | 호 개체 |
| HWPTAG_SHAPE_COMPONENT_POLYGON | 가변 | 3 | 다각형 개체 |
| HWPTAG_SHAPE_COMPONENT_CURVE | 가변 | 3 | 곡선 개체 |
| HWPTAG_SHAPE_COMPONENT_OLE | 26 | 3 | OLE 개체 |
| HWPTAG_SHAPE_COMPONENT_PICTURE | 가변 | 3 | 그림 개체 |
| HWPTAG_CTRL_DATA | 가변 | 2 | 컨트롤 임의의 데이터 |
| HWPTAG_EQEDIT | 가변 | 2 | 수식 개체 |
| HWPTAG_SHAPE_COMPONENT_TEXTART | 가변 | 3 | 글맵시 |
| HWPTAG_FORM_OBJECT | 가변 | 2 | 양식 개체 |
| HWPTAG_MEMO_SHAPE | 22 | 1 | 메모 모양 |
| HWPTAG_MEMO_LIST | 4 | 1 | 메모 리스트 헤더 |
| HWPTAG_CHART_DATA | 2 | 2 | 차트 데이터 |
| HWPTAG_VIDEO_DATA | 가변 | 3 | 비디오 데이터 |
| HWPTAG_SHAPE_COMPONENT_UNKNOWN | 36 | 3 | Unknown |

### 특수 위치 정보

#### 구역 끝부분
- 확장 바탕쪽 정보
  - 마지막 쪽 설정
  - 임의 쪽 설정

#### 마지막 구역 끝부분
- 메모 관련 정보
- 문서 전체 메모 데이터

## 데이터 참조 관계

```
DocInfo (정의) ← BodyText (참조)
    ↓               ↓
  글꼴 ID      → 텍스트의 글꼴
  스타일 ID    → 문단의 스타일
  글자모양 ID  → 텍스트의 모양
  문단모양 ID  → 문단의 모양
```

DocInfo에서 정의한 속성들을 BodyText에서 ID로 참조하는 구조입니다.