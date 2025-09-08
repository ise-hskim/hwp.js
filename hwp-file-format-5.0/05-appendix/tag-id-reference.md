# Tag ID 참조표

## 개요

한글 문서 파일에서 사용되는 모든 Tag ID들의 완전한 참조표입니다. Tag ID는 각 레코드의 타입을 식별하는 고유한 식별자입니다.

## 문서 정보 (DocInfo) Tag ID

> 주: DocInfo의 변경 추적/메모/금칙 관련 항목은 원문 표 13(문서 정보의 데이터 레코드)에 정의되어 있습니다.

| Tag ID                          | 값                       | 설명                |
| ------------------------------- | ------------------------ | ------------------- |
| **HWPTAG_DOCUMENT_PROPERTIES**  | HWPTAG_BEGIN+0 (0x0010)  | 문서 속성           |
| **HWPTAG_ID_MAPPINGS**          | HWPTAG_BEGIN+1 (0x0011)  | ID 매핑             |
| **HWPTAG_BIN_DATA**             | HWPTAG_BEGIN+2 (0x0012)  | 바이너리 데이터     |
| **HWPTAG_FACE_NAME**            | HWPTAG_BEGIN+3 (0x0013)  | 글꼴                |
| **HWPTAG_BORDER_FILL**          | HWPTAG_BEGIN+4 (0x0014)  | 테두리/배경         |
| **HWPTAG_CHAR_SHAPE**           | HWPTAG_BEGIN+5 (0x0015)  | 글자 모양           |
| **HWPTAG_TAB_DEF**              | HWPTAG_BEGIN+6 (0x0016)  | 탭 정의             |
| **HWPTAG_NUMBERING**            | HWPTAG_BEGIN+7 (0x0017)  | 번호 매기기         |
| **HWPTAG_BULLET**               | HWPTAG_BEGIN+8 (0x0018)  | 글머리표            |
| **HWPTAG_PARA_SHAPE**           | HWPTAG_BEGIN+9 (0x0019)  | 문단 모양           |
| **HWPTAG_STYLE**                | HWPTAG_BEGIN+10 (0x001A) | 스타일              |
| **HWPTAG_DOC_DATA**             | HWPTAG_BEGIN+11 (0x001B) | 문서 데이터         |
| **HWPTAG_DISTRIBUTE_DOC_DATA**  | HWPTAG_BEGIN+12 (0x001C) | 배포용 문서 데이터  |
| **HWPTAG_RESERVED**             | HWPTAG_BEGIN+13 (0x001D) | 예약됨              |
| **HWPTAG_COMPATIBLE_DOCUMENT**  | HWPTAG_BEGIN+14 (0x001E) | 호환 문서           |
| **HWPTAG_LAYOUT_COMPATIBILITY** | HWPTAG_BEGIN+15 (0x001F) | 레이아웃 호환성     |
| **HWPTAG_TRACKCHANGE**          | HWPTAG_BEGIN+16 (0x0020) | 변경 추적 정보      |
| **HWPTAG_MEMO_SHAPE**           | HWPTAG_BEGIN+76 (0x005C) | 메모 모양           |
| **HWPTAG_FORBIDDEN_CHAR**       | HWPTAG_BEGIN+78 (0x005E) | 금칙처리 문자       |
| **HWPTAG_TRACK_CHANGE**         | HWPTAG_BEGIN+80 (0x0060) | 변경 추적 내용/모양 |
| **HWPTAG_TRACK_CHANGE_AUTHOR**  | HWPTAG_BEGIN+81 (0x0061) | 변경 추적 작성자    |

> 출처: 원문 표 13 (문서 정보의 데이터 레코드)

## 본문 (BodyText) Tag ID

### 기본 구조

| Tag ID                      | 값                       | 설명           |
| --------------------------- | ------------------------ | -------------- |
| **HWPTAG_PARA_HEADER**      | HWPTAG_BEGIN+50 (0x0042) | 문단 헤더      |
| **HWPTAG_PARA_TEXT**        | HWPTAG_BEGIN+51 (0x0043) | 문단 텍스트    |
| **HWPTAG_PARA_CHAR_SHAPE**  | HWPTAG_BEGIN+52 (0x0044) | 문단 글자 모양 |
| **HWPTAG_PARA_LINE_SEG**    | HWPTAG_BEGIN+53 (0x0045) | 문단 줄 나눔   |
| **HWPTAG_PARA_RANGE_TAG**   | HWPTAG_BEGIN+54 (0x0046) | 문단 범위 태그 |
| **HWPTAG_CTRL_HEADER**      | HWPTAG_BEGIN+55 (0x0047) | 컨트롤 헤더    |
| **HWPTAG_LIST_HEADER**      | HWPTAG_BEGIN+56 (0x0048) | 리스트 헤더    |
| **HWPTAG_PAGE_DEF**         | HWPTAG_BEGIN+57 (0x0049) | 용지 설정      |
| **HWPTAG_FOOTNOTE_SHAPE**   | HWPTAG_BEGIN+58 (0x004A) | 각주 모양      |
| **HWPTAG_PAGE_BORDER_FILL** | HWPTAG_BEGIN+59 (0x004B) | 쪽 테두리/배경 |

### 컨트롤 관련

| Tag ID                               | 값                       | 설명                              |
| ------------------------------------ | ------------------------ | --------------------------------- |
| **HWPTAG_SHAPE_COMPONENT**           | HWPTAG_BEGIN+60 (0x004C) | 개체 요소                         |
| **HWPTAG_TABLE**                     | HWPTAG_BEGIN+61 (0x004D) | 표                                |
| **HWPTAG_SHAPE_COMPONENT_LINE**      | HWPTAG_BEGIN+62 (0x004E) | 선 개체                           |
| **HWPTAG_SHAPE_COMPONENT_RECTANGLE** | HWPTAG_BEGIN+63 (0x004F) | 사각형 개체                       |
| **HWPTAG_SHAPE_COMPONENT_ELLIPSE**   | HWPTAG_BEGIN+64 (0x0050) | 타원 개체                         |
| **HWPTAG_SHAPE_COMPONENT_ARC**       | HWPTAG_BEGIN+65 (0x0051) | 호 개체                           |
| **HWPTAG_SHAPE_COMPONENT_POLYGON**   | HWPTAG_BEGIN+66 (0x0052) | 다각형 개체                       |
| **HWPTAG_SHAPE_COMPONENT_CURVE**     | HWPTAG_BEGIN+67 (0x0053) | 곡선 개체                         |
| **HWPTAG_SHAPE_COMPONENT_OLE**       | HWPTAG_BEGIN+68 (0x0054) | OLE 개체                          |
| **HWPTAG_SHAPE_COMPONENT_PICTURE**   | HWPTAG_BEGIN+69 (0x0055) | 그림 개체                         |
| **HWPTAG_SHAPE_COMPONENT_CONTAINER** | HWPTAG_BEGIN+70 (0x0056) | 묶음 개체                         |
| **HWPTAG_CTRL_DATA**                 | HWPTAG_BEGIN+71 (0x0057) | 컨트롤 데이터                     |
| **HWPTAG_EQEDIT**                    | HWPTAG_BEGIN+72 (0x0058) | 수식 편집기                       |
| **RESERVED**                         | HWPTAG_BEGIN+73 (0x0059) | 예약(BodyText 영역의 예약 Tag ID) |
| **HWPTAG_SHAPE_COMPONENT_TEXTART**   | HWPTAG_BEGIN+74 (0x005A) | 글맵시 개체                       |
| **HWPTAG_FORM_OBJECT**               | HWPTAG_BEGIN+75 (0x005B) | 양식 개체                         |
| **HWPTAG_MEMO_SHAPE**                | HWPTAG_BEGIN+76 (0x005C) | 메모 모양                         |
| **HWPTAG_MEMO_LIST**                 | HWPTAG_BEGIN+77 (0x005D) | 메모 리스트                       |
| **HWPTAG_CHART_DATA**                | HWPTAG_BEGIN+79 (0x005F) | 차트 데이터                       |
| **HWPTAG_VIDEO_DATA**                | HWPTAG_BEGIN+82 (0x0062) | 동영상 데이터                     |
| **HWPTAG_SHAPE_COMPONENT_UNKNOWN**   | HWPTAG_BEGIN+99 (0x0073) | 알 수 없는 개체                   |

> 비고: 원문 절 제목에 "VIDEO_TDATA" 표기가 등장하나, 실제 Tag ID는 `HWPTAG_VIDEO_DATA`(HWPTAG_BEGIN+82)로 정의됩니다. (원문 4.3.9.8 절, 표 64/본문 참조)

## 문서 이력 관리 Tag ID

> 주: 아래 `HISTORY_RECORD_TYPE_*` 값은 DocHistory 전용 레코드 코드로, 일반 레코드 헤더의 Tag ID(10비트) 체계와 다릅니다. (원문 4.4, 표 154~161)

| Tag ID                              | 16진수 값  | 설명                 |
| ----------------------------------- | ---------- | -------------------- |
| **HISTORY_RECORD_TYPE_STAG**        | 0x00000010 | 히스토리 아이템 시작 |
| **HISTORY_RECORD_TYPE_ETAG**        | 0x00000011 | 히스토리 아이템 끝   |
| **HISTORY_RECORD_TYPE_VERSION**     | 0x00000020 | 히스토리 버전        |
| **HISTORY_RECORD_TYPE_DATE**        | 0x00000021 | 히스토리 날짜        |
| **HISTORY_RECORD_TYPE_WRITER**      | 0x00000022 | 히스토리 작성자      |
| **HISTORY_RECORD_TYPE_DESCRIPTION** | 0x00000023 | 히스토리 설명        |
| **HISTORY_RECORD_TYPE_DIFFDATA**    | 0x00000030 | 비교 정보            |
| **HISTORY_RECORD_TYPE_LASTDOCDATA** | 0x00000031 | 최근 문서            |

## 확장 Tag ID

> 주: 아래 효과 항목들은 Tag ID가 아니라 `HWPTAG_SHAPE_COMPONENT_PICTURE`(그림 개체, HWPTAG_BEGIN+69)의 하위 속성입니다. 자세한 내용은 `04-data-records/02-body-text/picture-effects.md`를 참고하세요. (원문 표 108~112)

## 주의: Tag ID와 컨트롤 ID 구분

- Tag ID는 10비트 정수(`HWPTAG_BEGIN + N`) 체계입니다.
- 컨트롤 ID는 4문자 코드(`MAKE_4CHID`) 체계로, Tag ID와 다릅니다.

## 사용자 정의 Tag ID 범위

> 주: Tag ID는 10비트 체계(0x000~0x3FF)입니다. 아래 범위는 컨트롤 ID 또는 별도 확장 식별자와 혼동될 수 있으므로, 파일 포맷 Tag ID와는 무관한 범위로 간주하세요. 필요 시 별도 문서에서 정의합니다.

## 디버깅 팁

### Tag ID 해석

```c
void print_tagid(UINT32 tagid) {
    char ch[5];
    ch[0] = (char)(tagid & 0xFF);
    ch[1] = (char)((tagid >> 8) & 0xFF);
    ch[2] = (char)((tagid >> 16) & 0xFF);
    ch[3] = (char)((tagid >> 24) & 0xFF);
    ch[4] = '\0';
    printf("TagID: 0x%08X ('%s')\n", tagid, ch);
}
```

### 알 수 없는 Tag ID 처리

```c
bool is_known_tagid(UINT32 tagid) {
    switch (tagid) {
        case HWPTAG_DOCUMENT_PROPERTIES:
        case HWPTAG_PARA_HEADER:
        // ... 기타 알려진 Tag ID들
            return true;
        default:
            return false;
    }
}
```

---

_이 참조표는 한글 문서 파일 형식 5.0의 모든 공개된 Tag ID를 포함합니다. 새로운 버전에서는 추가 Tag ID가 도입될 수 있습니다._

### Tag ID 규칙(요약)

- Tag ID는 10비트 정수이며, `HWPTAG_BEGIN(0x010)`을 기준으로 파트별 오프셋을 더해 정의합니다.
- 컨트롤 ID의 4문자 코드(`MAKE_4CHID`)는 Tag ID가 아니라 별도의 컨트롤 식별자입니다. 혼동하지 마세요.

## 관련 표 (원문)

- 표 13: 문서 정보의 데이터 레코드(태그 목록)
- 표 57: 본문의 데이터 레코드 요약
- 표 64~66: 컨트롤 관련 헤더 표
- 표 127~128: 개체 이외의 컨트롤/필드 컨트롤 ID
