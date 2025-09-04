# 한글 문서 파일 형식 5.0

## 표 126 웹 동영상 속성

| 자료형 | 길이(바이트) | 설명 |
|--------|-------------|------|
| WCHAR array[len] | 2×len | 웹 태그 |
| UINT16 | 2 | 썸네일 파일이 사용하는 스토리지의 BinData ID |
| 전체 길이 | (2×len)+2 |  |

## 4.3.10. 개체 이외의 컨트롤

특정 컨트롤은 정보 이외의 문단 리스트를 가질 수 있다.

### 표 127 개체 이외의 컨트롤과 컨트롤 ID

| 번호 | 의미 | 컨트롤 ID | 문단 리스트 | 파일 태그 |
|-----|------|----------|-----------|-----------|
| 1 | 구역 정의 | MAKE_4CHID('s', 'e', 'c', 'd') | √ | HWPTAG_CTRL_HEAD로<br>부터 시작하며 ctrlid로<br>각 개체를 확인 할 수<br>있다. |
| 2 | 단 정의 | MAKE_4CHID('c', 'o', 'l', 'd') |  |  |
| 3 | 머리말 / 꼬리말 | MAKE_4CHID('h', 'e', 'a', 'd') /<br>MAKE_4CHID('f', 'o', 'o', 't') | √ |  |
| 4 | 각주 / 미주 | MAKE_4CHID('f', 'n', ' ', ' ') /<br>MAKE_4CHID('e', 'n', ' ', ' ') | √ |  |
| 5 | 자동번호 | MAKE_4CHID('a', 't', 'n', 'o') |  |  |
| 6 | 새 번호 지정 | MAKE_4CHID('n', 'w', 'n', 'o') |  |  |
| 7 | 감추기 | MAKE_4CHID('p', 'g', 'h', 'd') |  |  |
| 8 | 홀/짝수 조정 | MAKE_4CHID('p', 'g', 'c', 't') |  |  |
| 9 | 쪽 번호 위치 | MAKE_4CHID('p', 'g', 'n', 'p') |  |  |
| 10 | 찾아보기 표식 | MAKE_4CHID('i', 'd', 'x', 'm') |  |  |
| 11 | 책갈피 | MAKE_4CHID('b', 'o', 'k', 'm') |  |  |
| 12 | 글자 겹침 | MAKE_4CHID('t', 'c', 'p', 's') |  |  |
| 13 | 덧말 | MAKE_4CHID('t', 'd', 'u', 't') |  |  |
| 14 | 숨은 설명 | MAKE_4CHID('t', 'c', 'm', 't') | √ |  |
| 15 | 필드 시작 | 필드 컨트롤 ID |  |  |

### 필드 컨트롤 ID

| 컨트롤 명 | 컨트롤 ID |
|----------|----------|
| FIELD_UNKNOWN | MAKE_4CHID('%', 'u', 'n', 'k') |
| FIELD_DATE | MAKE_4CHID('%', 'd', 't', 'e') |
| FIELD_DOCDATE | MAKE_4CHID('%', 'd', 'd', 't') |
| FIELD_PATH | MAKE_4CHID('%', 'p', 'a', 't') |
| FIELD_BOOKMARK | MAKE_4CHID('%', 'b', 'm', 'k') |
| FIELD_MAILMERGE | MAKE_4CHID('%', 'm', 'm', 'g') |
| FIELD_CROSSREF | MAKE_4CHID('%', 'x', 'r', 'f') |
| FIELD_FORMULA | MAKE_4CHID('%', 'f', 'm', 'u') |
| FIELD_CLICKHERE | MAKE_4CHID('%', 'c', 'l', 'k') |
| FIELD_SUMMARY | MAKE_4CHID('%', 's', 'm', 'r') |
| FIELD_USERINFO | MAKE_4CHID('%', 'u', 's', 'r') |
| FIELD_HYPERLINK | MAKE_4CHID('%', 'h', 'l', 'k') |
| FIELD_REVISION_SIGN | MAKE_4CHID('%', 's', 'i', 'g') |
| FIELD_REVISION_DELETE | MAKE_4CHID('%', '%', '*', 'd') |
| FIELD_REVISION_ATTACH | MAKE_4CHID('%', '%', '*', 'a') |
| FIELD_REVISION_CLIPPING | MAKE_4CHID('%', '%', '*', 'C') |
| FIELD_REVISION_SAWTOOTH | MAKE_4CHID('%', '%', '*', 'S') |
| FIELD_REVISION_THINKING | MAKE_4CHID('%', '%', '*', 'T') |
| FIELD_REVISION_PRAISE | MAKE_4CHID('%', '%', '*', 'P') |
| FIELD_REVISION_LINE | MAKE_4CHID('%', '%', '*', 'L') |
| FIELD_REVISION_SIMPLECHANGE | MAKE_4CHID('%', '%', '*', 'c') |
| FIELD_REVISION_HYPERLINK | MAKE_4CHID('%', '%', '*', 'h') |

---
페이지: 52

52