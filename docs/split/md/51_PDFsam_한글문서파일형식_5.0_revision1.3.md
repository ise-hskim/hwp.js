# 한글 문서 파일 형식 5.0

## Tag ID : HWPTAG_SHAPE_COMPONENT_CURVE

### 4.3.9.3. 글 수식 개체

**Tag ID : HWPTAG_EQEDIT**

*글 수식 스크립트는 EQN 스크립트 호환이며 자세한 스펙은 뒤에 추가

### 4.3.9.4. 그림 개체(HWPTAG_SHAPE_COMPONENT_PICTURE)

#### 표 103 곡선 개체 속성

| 자료형 | 길이(바이트) | 설명 |
|--------|-------------|------|
| INT16 | 2 | count of points(cnt) |
| INT32 array[cnt] | 4×cnt | x 좌표 |
| INT32 array[cnt] | 4×cnt | y 좌표 |
| BYTE array[cnt-1] | cnt-1 | segment type(0 : line, 1 : curve) |
| 전체 길이 | 가변 | 2 + 2(4×cnt) + cnt-1 바이트 |

#### 표 104 수식 개체

| 자료형 | 길이(바이트) | 설명 |
|--------|-------------|------|
| BYTE stream | n | 개체 공통 속성(표 68 참조) |
| BYTE stream | n2 | 수식 개체 속성(표 105 참조) |
| 전체 길이 | 가변 | n + n2 바이트 |

#### 표 105 수식 개체 속성

| 자료형 | 길이(바이트) | 설명 |
|--------|-------------|------|
| UINT32 | 4 | 속성. 스크립트가 차지하는 범위. 첫 비트가 켜져 있으면 줄 단위, 꺼져 있으면 글자 단위. |
| WORD | 2 | 스크립트 길이(len) |
| WCHAR array[len] | 2×len | 글 수식 스크립트(*) |
| HWPUNIT | 4 | 수식 글자 크기 |
| COLORREF | 4 | 글자 색상 |
| INT16 | 2 | base line |
| WCHAR array[len] | 2×len | 수식 버전 정보 |
| WCHAR array[len] | 2×len | 수식 폰트 이름 |
| 전체 길이 | 가변 | 16 + (6×len) 바이트 |

*글 수식 스크립트는 EQN 스크립트 호환이며 자세한 스펙은 뒤에 추가

#### 표 106 그림 개체

| 자료형 | 길이(바이트) | 설명 |
|--------|-------------|------|
| BYTE stream | n | 개체 공통 속성(표 68 참조) |
| BYTE stream | n2 | 개체 요소 공통 속성(표 80 참조) |
| BYTE stream | n3 | 그림 개체 속성(표 107 참조) |
| 전체 길이 | 가변 | n + n2 + n3 바이트 |

---
페이지: 46

46