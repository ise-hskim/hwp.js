# 한글 문서 파일 형식 5.0

파라미터 아이템의 개수만큼 아이템 데이터를 얻는다.

### 표 50 파라미터 셋

| 자료형 | 길이(바이트) | 설명 |
|--------|------------|------|
| WORD | 2 | 파라미터 셋 ID |
| INT16 | 2 | 파라미터 셋에 존재하는 아이템 개수(n) |
| Parameter Item | 가변×n | 파라미터 아이템(표 51 참조) |
| 전체 길이 | 가변 | 4 + (가변×n) 바이트 |

### 표 51 파라미터 아이템

| 자료형 | 길이(바이트) | 설명 |
|--------|------------|------|
| WORD | 2 | 파라미터 아이템 ID |
| WORD | 2 | 파라미터 아이템 종류(표 52 참조) |
| Parameter Item Type | 가변 | 파라미터 아이템 데이터 |
| 전체 길이 | 가변 | 4 + 가변 바이트 |

### 표 52 파라미터 아이템 종류

| 값 | 구분 | 자료형 | 설명 |
|----|------|--------|------|
| 0 | PIT_NULL | UINT | NULL |
| 1 | PIT_BSTR | WORD<br>WCHAR array[len] | 문자열 길이(slen)<br>문자열 |
| 2 | PIT_I1 | UINT | INT8 |
| 3 | PIT_I2 | UINT | INT16 |
| 4 | PIT_I4 | UINT | INT32 |
| 5 | PIT_I | UINT | INT |
| 6 | PIT_UI1 | UINT | UINT8 |
| 7 | PIT_UI2 | UINT | UINT16 |
| 8 | PIT_UI4 | UINT | UINT32 |
| 9 | PIT_UI | UINT | UINT |
| 0x8000 | PIT_SET | Parameter Set | 파라미터 셋 |
| 0x8001 | PIT_ARRAY | INT16<br>ParameterArray | 파라미터 셋 개수<br>파라미터 셋 배열 |
| 0x8002 | PIT_BINDATA | UINT16 | 바이너리 데이터 ID |

## 4.2.13. 배포용 문서 데이터

배포용 문서에서는 모든 스트림에 배포용 문서 데이터가 들어간다.

Tag ID : HWPTAG_DISTRIBUTE_DOC_DATA

| 자료형 | 길이(바이트) | 설명 |
|--------|------------|------|
| BYTE array[256] | 256 | 배포용 문서 데이터 |
| 전체 길이 |  |  |

### 표 53 배포용 문서 데이터

---
*페이지: 31*

31