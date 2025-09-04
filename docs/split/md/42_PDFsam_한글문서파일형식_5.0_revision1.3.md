# 한글 문서 파일 형식 5.0

### 표 67 개체 공통 속성을 포함하는 컨트롤과 컨트롤ID

| 번호 | 컨트롤 ID | 개체 공통 속성 | 개체 요소 속성 |
|------|-----------|---------------|---------------|
| 1 | 표 | MAKE_4CHID('t', 'b', 'l', ' ') | √ | |
| 2 | 그리기 개체 | | √ | √ |
|  | 선 | MAKE_4CHID('$', 'l', 'i', 'n') | |  |
|  | 사각형 | MAKE_4CHID('$', 'r', 'e', 'c') | |  |
|  | 타원 | MAKE_4CHID('$', 'e', 'l', 'l') | |  |
|  | 호 | MAKE_4CHID('$', 'a', 'r', 'c') | |  |
|  | 다각형 | MAKE_4CHID('$', 'p', 'o', 'l') | |  |
|  | 곡선 | MAKE_4CHID('$', 'c', 'u', 'r') | |  |
| 3 | 글 97 수식 | MAKE_4CHID('e', 'q', 'e', 'd') | √ | |
| 4 | 그림 | MAKE_4CHID('$', 'p', 'i', 'c') | √ | √ |
| 5 | OLE | MAKE_4CHID('$', 'o', 'l', 'e') | √ | √ |
| 6 | 묶음 개체 | MAKE_4CHID('$', 'c', 'o', 'n') | √ | √ |

### 표 68 개체 공통 속성

| 자료형 | 길이(바이트) | 설명 |
|--------|------------|------|
| BYTE stream | n | 개체 공통 속성(표 69 참조) |
| BYTE stream | n2 | 캡션 정보가 있으면 캡션 리스트 정보를 얻는다(표 71 참조) |
| 전체 길이 | 가변 | n + n2 바이트 |

### 표 69 개체 공통 속성

| 자료형 | 길이(바이트) | 설명 |
|--------|------------|------|
| UINT32 | 4 | ctrl ID |
| UINT32 | 4 | 속성(표 70 참조) |
| HWPUNIT | 4 | 세로 오프셋 값 |
| HWPUNIT | 4 | 가로 오프셋 값 |
| HWPUNIT | 4 | width 오브젝트의 폭 |
| HWPUNIT | 4 | height 오브젝트의 높이 |
| INT32 | 4 | z-order |
| HWPUNIT16 array[4] | 2×4 | 오브젝트의 바깥 4방향 여백 |
| UINT32 | 4 | 문서 내 각 개체에 대한 고유 아이디(instance ID) |
| INT32 | 4 | 쪽나눔 방지 on(1) / off(0) |
| WORD | 2 | 개체 설명문 글자 길이(len) |
| WCHAR array[len] | 2×len | 개체 설명문 글자 |
| 전체 길이 | 가변 | 46 + (2×len) 바이트 |

| 범위 | 구분 | 값 | 설명 |
|------|------|----|----- |
| bit 0 | 글자처럼 취급 여부 |  |  |
| bit 1 | 예약 |  |  |
| bit 2 | 줄 간격에 영향을 줄지 여부 |  |  |
| bit 3～4 | 세로 위치의 기준(VertRelTo) | 0 | paper |
|  |  | 1 | page |
|  |  | 2 | para |
| bit 5～7 | 세로 위치의 기준에 대한 상대적인 배열 방식 | 0 | VerRelTo이 'paper'나 'page' 이면 top, 그렇지 않으면 left |
|  |  | 1 | VerRelTo이 'paper'나 'page' 이면 center |
|  |  | 2 | VerRelTo이 'paper'나 'page' 이면 bottom, 그렇지 않으면 right |
|  |  | 3 | VerRelTo이 'paper'나 'page' 이면 inside |
|  |  | 4 | VerRelTo이 'paper'나 'page' 이면 outside |

---
*페이지: 37*

37