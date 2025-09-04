# 한글 문서 파일 형식 5.0

### 표 96 타원 개체 속성

| 자료형 | 길이(바이트) | 설명 |
|--------|------------|------|
| UINT32 | 4 | 속성(표 97 참조) |
| INT32 | 4 | 중심 좌표의 X 값 |
| INT32 | 4 | 중심 좌표의 Y 값 |
| INT32 | 4 | 제1축 X 좌표 값 |
| INT32 | 4 | 제1축 Y 좌표 값 |
| INT32 | 4 | 제2축 X 좌표 값 |
| INT32 | 4 | 제2축 Y 좌표 값 |
| INT32 | 4 | start pos x |
| INT32 | 4 | start pos y |
| INT32 | 4 | end pos x |
| INT32 | 4 | end pos y |
| INT32 | 4 | start pos x2<br>interval of curve(effective only when it is an arc) |
| INT32 | 4 | start pos y2 |
| INT32 | 4 | end pos x2 |
| INT32 | 4 | end pos y2 |
| 전체 길이 | 60 |  |

### 표 97 타원/호 개체 속성의 속성

| 범위 | 설명 |
|------|------|
| bit 0 | 호(ARC)로 바뀌었을 때, interval을 다시 계산해야 할 필요가 있는지 여부 (interval - 원 위에 존재하는 두 점 사이의 거리) |
| bit 1 | 호(ARC)로 바뀌었는지 여부 |
| bit 2～9 | 호(ARC)의 종류 |

---
*페이지: 44*

44