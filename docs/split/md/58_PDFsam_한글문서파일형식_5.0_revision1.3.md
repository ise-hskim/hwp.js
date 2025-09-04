# 한글 문서 파일 형식 5.0

## 표 128 필드 컨트롤 ID (계속)

| 컨트롤 명 | 컨트롤 ID |
|----------|----------|
| FIELD_REVISION_LINEATTACH | MAKE_4CHID('%', '%', '*', 'A') |
| FIELD_REVISION_LINELINK | MAKE_4CHID('%', '%', '*', 'i') |
| FIELD_REVISION_LINETRANSFER | MAKE_4CHID('%', '%', '*', 't') |
| FIELD_REVISION_RIGHTMOVE | MAKE_4CHID('%', '%', '*', 'r') |
| FIELD_REVISION_LEFTMOVE | MAKE_4CHID('%', '%', '*', 'l') |
| FIELD_REVISION_TRANSFER | MAKE_4CHID('%', '%', '*', 'n') |
| FIELD_REVISION_SIMPLEINSERT | MAKE_4CHID('%', '%', '*', 'e') |
| FIELD_REVISION_SPLIT | MAKE_4CHID('%', 's', 'p', 'l') |
| FIELD_REVISION_CHANGE | MAKE_4CHID('%', '%', 'm', 'r') |
| FIELD_MEMO | MAKE_4CHID('%', '%', 'm', 'e') |
| FIELD_PRIVATE_INFO_SECURITY | MAKE_4CHID('%', 'c', 'p', 'r') |
| FIELD_TABLEOFCONTENTS | MAKE_4CHID('%', 't', 'o', 'c') |

## 4.3.10.1. 구역 정의

### 표 129 구역 정의

| 자료형 | 길이(바이트) | 설명 |
|--------|-------------|------|
| UINT32 | 4 | 속성(표 130 참조) |
| HWPUNIT16 | 2 | 동일한 페이지에서 서로 다른 단 사이의 간격 |
| HWPUNIT16 | 2 | 세로로 줄맞춤을 할지 여부<br>0 = off, 1 - n = 간격을 HWPUNIT 단위로 지정 |
| HWPUNIT16 | 2 | 가로로 줄맞춤을 할지 여부<br>0 = off, 1 - n = 간격을 HWPUNIT 단위로 지정 |
| HWPUNIT | 4 | 기본 탭 간격(hwpunit 또는 relative characters) |
| UINT16 | 2 | 번호 문단 모양 ID |
| UINT16 | 2 | 쪽 번호 (0 = 앞 구역에 이어, n = 임의의 번호로 시작) |
| UINT16 array[3] | 2×3 | 그림, 표, 수식 번호 (0 = 앞 구역에 이어, n = 임의의 번호로 시작) |
| UINT16 | 2 | 대표Language(Language값이 없으면(==0), Application에 지정된 Language) 5.0.1.5 이상 |
| 전체 길이 | 26 |  |

#### 하위 레코드

| 자료형 | 길이(바이트) | 설명 |
|--------|-------------|------|
| BYTE stream | 40 | 용지설정 정보(표 131 참조) |
| BYTE stream | 26 | 각주 모양 정보(표 133 참조) |
| BYTE stream | 26 | 미주 모양 정보(표 133 참조) |
| BYTE stream | 12 | 쪽 테두리/배경 정보(표 135 참조) |
| BYTE stream | 10 | 양 쪽, 홀수 쪽, 짝수 쪽의 바탕쪽 내용이 있으면 바탕쪽 정보를 얻는다. 바탕쪽 정보는 문단 리스트를 포함한다(표 137 참조) |
| 전체 길이 | 140 |  |

### 표 130 구역 정의 속성

| 범위 | 설명 |
|------|------|
| bit 0 | 머리말을 감출지 여부 |
| bit 1 | 꼬리말을 감출지 여부 |
| bit 2 | 바탕쪽을 감출지 여부 |
| bit 3 | 테두리를 감출지 여부 |
| bit 4 | 배경을 감출지 여부 |
| bit 5 | 쪽 번호 위치를 감출지 여부 |
| bit 8 | 구역의 첫 쪽에만 테두리 표시 여부 |
| bit 9 | 구역의 첫 쪽에만 배경 표시 여부 |
| bit 16～18 | 텍스트 방향(0 : 가로 1 : 세로) |

---
페이지: 53

53