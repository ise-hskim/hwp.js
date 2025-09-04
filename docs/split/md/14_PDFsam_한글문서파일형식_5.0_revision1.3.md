# 한글 문서 파일 형식 5.0

본문에 사용 중인 글꼴, 글자 속성, 문단 속성, 탭, 스타일 등에 문서 내 공통으로 사용되는 세부 정보를 담고 있다.

DocInfo 스트림에 저장되는 데이터는 다음과 같다.

| Tag ID | 길이(바이트) | 레벨 | 설명 |
|--------|-------------|------|------|
| HWPTAG_DOCUMENT_PROPERTIES | 30 | 0 | 문서 속성(표 14 참조) |
| HWPTAG_ID_MAPPINGS | 32 | 0 | 아이디 매핑 헤더(표 15 참조) |
| HWPTAG_BIN_DATA | 가변 | 1 | 바이너리 데이터(표 17 참조) |
| HWPTAG_FACE_NAME | 가변 | 1 | 글꼴(표 19 참조) |
| HWPTAG_BORDER_FILL | 가변 | 1 | 테두리/배경(표 23 참조) |
| HWPTAG_CHAR_SHAPE | 72 | 1 | 글자 모양(표 33 참조) |
| HWPTAG_TAB_DEF | 14 | 1 | 탭 정의(표 36 참조) |
| HWPTAG_NUMBERING | 가변 | 1 | 문단 번호(표 38 참조) |
| HWPTAG_BULLET | 10 | 1 | 글머리표(표 42 참조) |
| HWPTAG_PARA_SHAPE | 54 | 1 | 문단 모양(표 43 참조) |
| HWPTAG_STYLE | 가변 | 1 | 스타일(표 47 참조) |
| HWPTAG_MEMO_SHAPE | 22 | 1 | 메모 모양 |
| HWPTAG_TRACK_CHANGE_AUTHOR | 가변 | 1 | 변경 추적 작성자 |
| HWPTAG_TRACK_CHANGE | 가변 | 1 | 변경 추적 내용 및 모양 |
| HWPTAG_DOC_DATA | 가변 | 0 | 문서 임의의 데이터(표 49 참조) |
| HWPTAG_FORBIDDEN_CHAR | 가변 | 0 | 금칙처리 문자 |
| HWPTAG_COMPATIBLE_DOCUMENT | 4 | 0 | 호환 문서(표 54 참조) |
| HWPTAG_LAYOUT_COMPATIBILITY | 20 | 1 | 레이아웃 호환성(표 56 참조) |
| HWPTAG_DISTRIBUTE_DOC_DATA | 256 | 0 | 배포용 문서 |
| HWPTAG_TRACKCHANGE | 1032 | 1 | 변경 추적 정보 |
| **전체 길이** | **가변** |  |  |

**표 4 문서 정보**

각각의 세부 정보는 <'문서 정보'의 데이터 레코드>란에서 추가로 다룬다.

#### 3.2.3. 본문

문서의 본문에 해당되는 문단, 표, 그리기 개체 등의 내용이 저장된다.

BodyText 스토리지는 본문의 구역에 따라 Section%d 스트림(%d는 구역의 번호)으로 구분된다. 구역의 개수는 문서 정보의 문서 속성에 저장된다.

각 구역의 첫 문단에는 구역 정의 레코드가 저장되고, 각 단 설정의 첫 문단에는 단 정의 레코드가 저장된다.

각 구역의 가장 끝 위치에는 확장 바탕쪽(마지막 쪽, 임의 쪽) 관련 정보가 저장되고, 마지막 구역의 가장 끝 위치에는 메모 관련 정보가 저장된다.

Section 스트림에 저장되는 데이터는 문단들(문단 리스트)이며, 다음과 같은 문단 정보들이 반복 된다.

| Tag ID | 길이(바이트) | 레벨 | 설명 |
|--------|-------------|------|------|
| HWPTAG_PARA_HEADER | 22 | 0 | 문단 헤더(표 58 참조) |
| HWPTAG_PARA_TEXT | 가변 | 1 | 문단의 텍스트(표 60 참조) |
| HWPTAG_PARA_CHAR_SHAPE | 가변 | 1 | 문단의 글자 모양(표 61 참조) |
| HWPTAG_PARA_LINE_SEG | 가변 | 1 | 문단의 레이아웃 |

9