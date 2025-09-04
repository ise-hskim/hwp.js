# DocInfo 스트림의 데이터 레코드

## 레코드 목록 (표 13)

| Tag ID | Value | 의미 |
|--------|-------|------|
| **HWPTAG_DOCUMENT_PROPERTIES** | 0x010 | 문서 속성 |
| **HWPTAG_ID_MAPPINGS** | 0x011 | 아이디 매핑 헤더 |
| **HWPTAG_BIN_DATA** | 0x012 | BinData |
| **HWPTAG_FACE_NAME** | 0x013 | Typeface Name |
| **HWPTAG_BORDER_FILL** | 0x014 | 테두리/배경 |
| **HWPTAG_CHAR_SHAPE** | 0x015 | 글자 모양 |
| **HWPTAG_TAB_DEF** | 0x016 | 탭 정의 |
| **HWPTAG_NUMBERING** | 0x017 | 번호 정의 |
| **HWPTAG_BULLET** | 0x018 | 불릿 정의 |
| **HWPTAG_PARA_SHAPE** | 0x019 | 문단 모양 |
| **HWPTAG_STYLE** | 0x01A | 스타일 |
| **HWPTAG_DOC_DATA** | 0x01B | 문서의 임의의 데이터 |
| **HWPTAG_DISTRIBUTE_DOC_DATA** | 0x01C | 배포용 문서 데이터 |
| RESERVED | 0x01D | 예약 |
| **HWPTAG_COMPATIBLE_DOCUMENT** | 0x01E | 호환 문서 |
| **HWPTAG_LAYOUT_COMPATIBILITY** | 0x01F | 레이아웃 호환성 |
| **HWPTAG_TRACKCHANGE** | 0x020 | 변경 추적 정보 |
| **HWPTAG_MEMO_SHAPE** | 0x05C | 메모 모양 |
| **HWPTAG_FORBIDDEN_CHAR** | 0x05E | 금칙처리 문자 |
| **HWPTAG_TRACK_CHANGE** | 0x060 | 변경 추적 내용 및 모양 |
| **HWPTAG_TRACK_CHANGE_AUTHOR** | 0x061 | 변경 추적 작성자 |

> **참고**: HWPTAG_BEGIN = 0x010

## 문서 속성 (HWPTAG_DOCUMENT_PROPERTIES)

Tag ID: 0x010 | 크기: 26 bytes

### 구조 (표 14)

| 자료형 | 길이(바이트) | 설명 |
|--------|------------|------|
| UINT16 | 2 | 구역 개수 |
| **문서 내 각종 시작번호** | | |
| UINT16 | 2 | 페이지 시작 번호 |
| UINT16 | 2 | 각주 시작 번호 |
| UINT16 | 2 | 미주 시작 번호 |
| UINT16 | 2 | 그림 시작 번호 |
| UINT16 | 2 | 표 시작 번호 |
| UINT16 | 2 | 수식 시작 번호 |
| **캐럿 위치 정보** | | |
| UINT32 | 4 | 리스트 아이디 |
| UINT32 | 4 | 문단 아이디 |
| UINT32 | 4 | 문단 내 글자 단위 위치 |
| **전체 길이** | **26** | |

### 설명
- 문서 전체 속성 정보
- 구역(Section) 개수 저장
- 각종 번호매김 시작값 정의
- 마지막 편집 위치 (캐럿) 정보 저장

## 아이디 매핑 헤더 (HWPTAG_ID_MAPPINGS)

Tag ID: 0x011 | 크기: 72 bytes (가변)

### 구조 (표 15)
| 자료형 | 길이(바이트) | 설명 |
|--------|------------|------|
| INT32 array[18] | 72 | 아이디 매핑 개수 (표 16 참조) |
| **전체 길이** | **72** | doc version에 따라 가변적 |

### 아이디 매핑 개수 인덱스 (표 16)
| 인덱스 | 설명 | 버전 |
|--------|------|------|
| 0 | 바이너리 데이터 | |
| 1 | 한글 글꼴 | |
| 2 | 영어 글꼴 | |
| 3 | 한자 글꼴 | |
| 4 | 일어 글꼴 | |
| 5 | 기타 글꼴 | |
| 6 | 기호 글꼴 | |
| 7 | 사용자 글꼴 | |
| 8 | 테두리/배경 | |
| 9 | 글자 모양 | |
| 10 | 탭 정의 | |
| 11 | 문단 번호 | |
| 12 | 글머리표 | |
| 13 | 문단 모양 | |
| 14 | 스타일 | |
| 15 | 메모 모양 | 5.0.2.1 이상 |
| 16 | 변경추적 | 5.0.3.2 이상 |
| 17 | 변경추적 사용자 | 5.0.3.2 이상 |

## 바이너리 데이터 (HWPTAG_BIN_DATA)

Tag ID: 0x012 | 크기: 가변

그림, OLE 등의 바이너리 데이터 정보를 저장합니다.

### 구조 (표 17)
| 자료형 | 길이(바이트) | 설명 |
|--------|------------|------|
| UINT16 | 2 | 속성 (표 18 참조) |
| **LINK 타입인 경우** | | |
| WORD | 2 | 절대 경로 길이 (len1) |
| WCHAR array[len1] | 2×len1 | 절대 경로 |
| WORD | 2 | 상대 경로 길이 (len2) |
| WCHAR array[len2] | 2×len2 | 상대 경로 |
| **EMBEDDING/STORAGE 타입인 경우** | | |
| UINT16 | 2 | BINDATASTORAGE의 바이너리 데이터 ID |
| **EMBEDDING 타입인 경우** | | |
| WORD | 2 | 형식 이름 길이 (len3) |
| WCHAR array[len3] | 2×len3 | Extension (예: jpg, bmp, gif, ole) |
| **전체 길이** | **가변** | **10 + (2×len1) + (2×len2) + (2×len3)** |

### 지원 형식
- **그림**: jpg, bmp, gif
- **OLE**: ole

### 속성 비트 필드 (표 18)
| 범위 | 구분 | 값 | 설명 |
|------|------|----|----|
| **bit 0~3** | Type | | |
| | | 0x0000 | LINK - 그림 외부 파일 참조 |
| | | 0x0001 | EMBEDDING - 그림 파일 포함 |
| | | 0x0002 | STORAGE - OLE 포함 |
| **bit 4~5** | 압축 | | |
| | | 0x0000 | 스토리지의 디폴트 모드 따라감 |
| | | 0x0010 | 무조건 압축 |
| | | 0x0020 | 무조건 압축하지 않음 |
| **bit 8~9** | 상태 | | |
| | | 0x0000 | 아직 access 된 적이 없는 상태 |
| | | 0x0100 | access에 성공하여 파일을 찾은 상태 |
| | | 0x0200 | access가 실패한 에러 상태 |
| | | 0x0300 | 링크 access가 실패했으나 무시된 상태 |