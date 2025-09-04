# 한글 문서 파일 형식 5.0

### 4.2. '문서 정보'의 데이터 레코드

문서 정보('DocInfo')에서 사용되는 데이터 레코드는 다음과 같다.

| Tag ID | Value | 의미 |
|--------|-------|------|
| HWPTAG_DOCUMENT_PROPERTIES | HWPTAG_BEGIN | 문서 속성 |
| HWPTAG_ID_MAPPINGS | HWPTAG_BEGIN+1 | 아이디 매핑 헤더 |
| HWPTAG_BIN_DATA | HWPTAG_BEGIN+2 | BinData |
| HWPTAG_FACE_NAME | HWPTAG_BEGIN+3 | Typeface Name |
| HWPTAG_BORDER_FILL | HWPTAG_BEGIN+4 | 테두리/배경 |
| HWPTAG_CHAR_SHAPE | HWPTAG_BEGIN+5 | 글자 모양 |
| HWPTAG_TAB_DEF | HWPTAG_BEGIN+6 | 탭 정의 |
| HWPTAG_NUMBERING | HWPTAG_BEGIN+7 | 번호 정의 |
| HWPTAG_BULLET | HWPTAG_BEGIN+8 | 불릿 정의 |
| HWPTAG_PARA_SHAPE | HWPTAG_BEGIN+9 | 문단 모양 |
| HWPTAG_STYLE | HWPTAG_BEGIN+10 | 스타일 |
| HWPTAG_DOC_DATA | HWPTAG_BEGIN+11 | 문서의 임의의 데이터 |
| HWPTAG_DISTRIBUTE_DOC_DATA | HWPTAG_BEGIN+12 | 배포용 문서 데이터 |
| RESERVED | HWPTAG_BEGIN+13 | 예약 |
| HWPTAG_COMPATIBLE_DOCUMENT | HWPTAG_BEGIN+14 | 호환 문서 |
| HWPTAG_LAYOUT_COMPATIBILITY | HWPTAG_BEGIN+15 | 레이아웃 호환성 |
| HWPTAG_TRACKCHANGE | HWPTAG_BEGIN+16 | 변경 추적 정보 |
| HWPTAG_MEMO_SHAPE | HWPTAG_BEGIN+76 | 메모 모양 |
| HWPTAG_FORBIDDEN_CHAR | HWPTAG_BEGIN+78 | 금칙처리 문자 |
| HWPTAG_TRACK_CHANGE | HWPTAG_BEGIN+80 | 변경 추적 내용 및 모양 |
| HWPTAG_TRACK_CHANGE_AUTHOR | HWPTAG_BEGIN+81 | 변경 추적 작성자 |

**표 13 문서 정보의 데이터 레코드**

#### 4.2.1. 문서 속성

Tag ID : HWPTAG_DOCUMENT_PROPERTIES

| 자료형 | 길이(바이트) | 설명 |
|--------|--------------|------|
| UINT16 | 2 | 구역 개수 |
| | | **문서 내 각종 시작번호에 대한 정보** |
| UINT16 | 2 | 페이지 시작 번호 |
| UINT16 | 2 | 각주 시작 번호 |
| UINT16 | 2 | 미주 시작 번호 |
| UINT16 | 2 | 그림 시작 번호 |
| UINT16 | 2 | 표 시작 번호 |
| UINT16 | 2 | 수식 시작 번호 |
| | | **문서 내 캐럿의 위치 정보** |
| UINT32 | 4 | 리스트 아이디 |
| UINT32 | 4 | 문단 아이디 |
| UINT32 | 4 | 문단 내에서의 글자 단위 위치 |
| **전체 길이** | **26** | |

**표 14 문서 속성**

#### 4.2.2. 아이디 매핑 헤더

Tag ID : HWPTAG_ID_MAPPINGS

17