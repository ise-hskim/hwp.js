# 한글 문서 파일 형식 5.0

## 4.3. '본문'의 데이터 레코드

본문에서 사용되는 데이터 레코드는 다음과 같다.

### 표 57 본문의 데이터 레코드

| Tag ID | Value | 설명 |
|---------|-------|------|
| HWPTAG_PARA_HEADER | HWPTAG_BEGIN+50 | 문단 헤더 |
| HWPTAG_PARA_TEXT | HWPTAG_BEGIN+51 | 문단의 텍스트 |
| HWPTAG_PARA_CHAR_SHAPE | HWPTAG_BEGIN+52 | 문단의 글자 모양 |
| HWPTAG_PARA_LINE_SEG | HWPTAG_BEGIN+53 | 문단의 레이아웃 |
| HWPTAG_PARA_RANGE_TAG | HWPTAG_BEGIN+54 | 문단의 영역 태그 |
| HWPTAG_CTRL_HEADER | HWPTAG_BEGIN+55 | 컨트롤 헤더 |
| HWPTAG_LIST_HEADER | HWPTAG_BEGIN+56 | 문단 리스트 헤더 |
| HWPTAG_PAGE_DEF | HWPTAG_BEGIN+57 | 용지 설정 |
| HWPTAG_FOOTNOTE_SHAPE | HWPTAG_BEGIN+58 | 각주/미주 모양 |
| HWPTAG_PAGE_BORDER_FILL | HWPTAG_BEGIN+59 | 쪽 테두리/배경 |
| HWPTAG_SHAPE_COMPONENT | HWPTAG_BEGIN+60 | 개체 |
| HWPTAG_TABLE | HWPTAG_BEGIN+61 | 표 개체 |
| HWPTAG_SHAPE_COMPONENT_LINE | HWPTAG_BEGIN+62 | 직선 개체 |
| HWPTAG_SHAPE_COMPONENT_RECTANGLE | HWPTAG_BEGIN+63 | 사각형 개체 |
| HWPTAG_SHAPE_COMPONENT_ELLIPSE | HWPTAG_BEGIN+64 | 타원 개체 |
| HWPTAG_SHAPE_COMPONENT_ARC | HWPTAG_BEGIN+65 | 호 개체 |
| HWPTAG_SHAPE_COMPONENT_POLYGON | HWPTAG_BEGIN+66 | 다각형 개체 |
| HWPTAG_SHAPE_COMPONENT_CURVE | HWPTAG_BEGIN+67 | 곡선 개체 |
| HWPTAG_SHAPE_COMPONENT_OLE | HWPTAG_BEGIN+68 | OLE 개체 |
| HWPTAG_SHAPE_COMPONENT_PICTURE | HWPTAG_BEGIN+69 | 그림 개체 |
| HWPTAG_SHAPE_COMPONENT_CONTAINER | HWPTAG_BEGIN+70 | 컨테이너 개체 |
| HWPTAG_CTRL_DATA | HWPTAG_BEGIN+71 | 컨트롤 임의의 데이터 |
| HWPTAG_EQEDIT | HWPTAG_BEGIN+72 | 수식 개체 |
| RESERVED | HWPTAG_BEGIN+73 | 예약 |
| HWPTAG_SHAPE_COMPONENT_TEXTART | HWPTAG_BEGIN+74 | 글맵시 |
| HWPTAG_FORM_OBJECT | HWPTAG_BEGIN+75 | 양식 개체 |
| HWPTAG_MEMO_SHAPE | HWPTAG_BEGIN+76 | 메모 모양 |
| HWPTAG_MEMO_LIST | HWPTAG_BEGIN+77 | 메모 리스트 헤더 |
| HWPTAG_CHART_DATA | HWPTAG_BEGIN+79 | 차트 데이터 |
| HWPTAG_VIDEO_DATA | HWPTAG_BEGIN+82 | 비디오 데이터 |
| HWPTAG_SHAPE_COMPONENT_UNKNOWN | HWPTAG_BEGIN+99 | Unknown |

## 4.3.1. 문단 헤더 Tag ID : HWPTAG_PARA_HEADER

| 자료형 | 길이(바이트) | 설명 |
|--------|------------|------|
| UINT32 | 4 | text(=chars)<br>if (nchars & 0x80000000) {<br> nchars &= 0x7fffffff;<br>} |
| UINT32 | 4 | control mask<br>(UINT32)(1<<ctrlch) 조합<br>ctrlch는 HwpCtrlAPI.Hwp 2.1 CtrlCh 참고 |
| UINT16 | 2 | 문단 모양 아이디 참조값 |
| UINT8 | 1 | 문단 스타일 아이디 참조값 |
| UINT8 | 1 | 단 나누기 종류(표 59 참조) |
| UINT16 | 2 | 글자 모양 정보 수 |

---
*페이지: 33*

33