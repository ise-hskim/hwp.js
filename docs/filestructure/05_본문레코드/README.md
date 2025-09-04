# 본문(BodyText) 데이터 레코드

## 레코드 목록 (표 57)

| Tag ID | Value | 설명 |
|---------|-------|------|
| **HWPTAG_PARA_HEADER** | 0x042 (HWPTAG_BEGIN+50) | 문단 헤더 |
| **HWPTAG_PARA_TEXT** | 0x043 (HWPTAG_BEGIN+51) | 문단의 텍스트 |
| **HWPTAG_PARA_CHAR_SHAPE** | 0x044 (HWPTAG_BEGIN+52) | 문단의 글자 모양 |
| **HWPTAG_PARA_LINE_SEG** | 0x045 (HWPTAG_BEGIN+53) | 문단의 레이아웃 |
| **HWPTAG_PARA_RANGE_TAG** | 0x046 (HWPTAG_BEGIN+54) | 문단의 영역 태그 |
| **HWPTAG_CTRL_HEADER** | 0x047 (HWPTAG_BEGIN+55) | 컨트롤 헤더 |
| **HWPTAG_LIST_HEADER** | 0x048 (HWPTAG_BEGIN+56) | 문단 리스트 헤더 |
| **HWPTAG_PAGE_DEF** | 0x049 (HWPTAG_BEGIN+57) | 용지 설정 |
| **HWPTAG_FOOTNOTE_SHAPE** | 0x04A (HWPTAG_BEGIN+58) | 각주/미주 모양 |
| **HWPTAG_PAGE_BORDER_FILL** | 0x04B (HWPTAG_BEGIN+59) | 쪽 테두리/배경 |
| **HWPTAG_SHAPE_COMPONENT** | 0x04C (HWPTAG_BEGIN+60) | 개체 |
| **HWPTAG_TABLE** | 0x04D (HWPTAG_BEGIN+61) | 표 개체 |
| **HWPTAG_SHAPE_COMPONENT_LINE** | 0x04E (HWPTAG_BEGIN+62) | 직선 개체 |
| **HWPTAG_SHAPE_COMPONENT_RECTANGLE** | 0x04F (HWPTAG_BEGIN+63) | 사각형 개체 |
| **HWPTAG_SHAPE_COMPONENT_ELLIPSE** | 0x050 (HWPTAG_BEGIN+64) | 타원 개체 |
| **HWPTAG_SHAPE_COMPONENT_ARC** | 0x051 (HWPTAG_BEGIN+65) | 호 개체 |
| **HWPTAG_SHAPE_COMPONENT_POLYGON** | 0x052 (HWPTAG_BEGIN+66) | 다각형 개체 |
| **HWPTAG_SHAPE_COMPONENT_CURVE** | 0x053 (HWPTAG_BEGIN+67) | 곡선 개체 |
| **HWPTAG_SHAPE_COMPONENT_OLE** | 0x054 (HWPTAG_BEGIN+68) | OLE 개체 |
| **HWPTAG_SHAPE_COMPONENT_PICTURE** | 0x055 (HWPTAG_BEGIN+69) | 그림 개체 |
| **HWPTAG_SHAPE_COMPONENT_CONTAINER** | 0x056 (HWPTAG_BEGIN+70) | 컨테이너 개체 |
| **HWPTAG_CTRL_DATA** | 0x057 (HWPTAG_BEGIN+71) | 컨트롤 임의의 데이터 |
| **HWPTAG_EQEDIT** | 0x058 (HWPTAG_BEGIN+72) | 수식 개체 |
| RESERVED | 0x059 (HWPTAG_BEGIN+73) | 예약 |
| **HWPTAG_SHAPE_COMPONENT_TEXTART** | 0x05A (HWPTAG_BEGIN+74) | 글맵시 |
| **HWPTAG_FORM_OBJECT** | 0x05B (HWPTAG_BEGIN+75) | 양식 개체 |
| **HWPTAG_MEMO_SHAPE** | 0x05C (HWPTAG_BEGIN+76) | 메모 모양 |
| **HWPTAG_MEMO_LIST** | 0x05D (HWPTAG_BEGIN+77) | 메모 리스트 헤더 |
| **HWPTAG_CHART_DATA** | 0x05F (HWPTAG_BEGIN+79) | 차트 데이터 |
| **HWPTAG_VIDEO_DATA** | 0x062 (HWPTAG_BEGIN+82) | 비디오 데이터 |
| **HWPTAG_SHAPE_COMPONENT_UNKNOWN** | 0x073 (HWPTAG_BEGIN+99) | Unknown |

## 문단 헤더 (HWPTAG_PARA_HEADER)

Tag ID: 0x042 | 크기: 22 bytes

### 구조
| 자료형 | 길이(바이트) | 설명 |
|--------|------------|------|
| UINT32 | 4 | 텍스트 길이 (chars)<br>최상위 비트가 1이면 압축 |
| UINT32 | 4 | 컨트롤 마스크<br>(1 << ctrlch) 조합 |
| UINT16 | 2 | 문단 모양 아이디 참조값 |
| UINT8 | 1 | 문단 스타일 아이디 참조값 |
| UINT8 | 1 | 단 나누기 종류 (표 59 참조) |
| UINT16 | 2 | 글자 모양 정보 수 |

### 텍스트 길이 처리
```c
if (nchars & 0x80000000) {
    // 최상위 비트가 1이면 압축된 텍스트
    nchars &= 0x7fffffff;
}
```

### 컨트롤 마스크
각 제어 문자의 존재 여부를 비트 플래그로 표시:
- bit n = 1: 제어 문자 n이 문단에 존재

### 단 나누기 종류 (표 59)
| 값 | 설명 |
|----|------|
| 0x01 | 구역 나누기 |
| 0x02 | 다단 나누기 |
| 0x04 | 쪽 나누기 |
| 0x08 | 단 나누기 |

> **참고**: 텍스트 수가 1 이상이면 문자 수만큼 텍스트를 로드하고, 그렇지 않을 경우 PARA_BREAK로 문단 생성

## 문단의 텍스트 (HWPTAG_PARA_TEXT)

Tag ID: 0x043 | 크기: 가변

### 구조 (표 60)
| 자료형 | 길이(바이트) | 설명 |
|--------|------------|------|
| WCHAR array[nchars] | 2×nchars | 문자수만큼의 텍스트 |
| **전체 길이** | **가변** | **2×nchars** |

## 문단의 글자 모양 (HWPTAG_PARA_CHAR_SHAPE)

Tag ID: 0x044 | 크기: 8×n bytes

### 구조 (표 61)
| 자료형 | 길이(바이트) | 설명 |
|--------|------------|------|
| UINT32 | 4 | 글자 모양이 바뀌는 시작 위치 |
| UINT32 | 4 | 글자 모양 ID |
| **전체 길이** | **8×n** | n = 글자 모양 정보 수 |

### 글자 모양 버퍼 구조
문단은 최소 하나의 글자 모양 버퍼가 존재하며, 첫 번째 위치는 반드시 0이어야 합니다.

**예제**: 40자 문단이 10자씩 4가지 모양으로 구성된 경우
| 구간 | 위치 | 모양 ID |
|------|------|---------|
| 모양 1 | Pos=0 | ID=1 |
| 모양 2 | Pos=10 | ID=2 |
| 모양 3 | Pos=20 | ID=3 |
| 모양 4 | Pos=30 | ID=4 |