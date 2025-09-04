# 한글 문서 파일 형식 5.0

문단에 컨트롤이 포함되는 경우 컨트롤 헤더 이후로 문단 리스트 헤더와 같은 컨트롤의 레코드 데이터가 저장된다.

| HWPTAG_PARA_RANGE_TAG | 가변 | 1 | 문단의 영역 태그(표 63 참조) |
|--------|-------------|------|------|
| HWPTAG_CTRL_HEADER | 4 | 1 | 컨트롤 헤더(표 64 참조) |
| HWPTAG_LIST_HEADER | 6 | 2 | 문단 리스트 헤더(표 65 참조) |
| HWPTAG_PAGE_DEF | 40 | 2 | 용지 설정 |
| HWPTAG_FOOTNOTE_SHAPE | 30 | 2 | 각주/미주 모양 |
| HWPTAG_PAGE_BORDER_FILL | 14 | 2 | 쪽 테두리/배경 |
| HWPTAG_SHAPE_COMPONENT | 4 | 2 | 개체 |
| HWPTAG_TABLE | 가변 | 2 | 표 개체 |
| HWPTAG_SHAPE_COMPONENT_LINE | 20 | 3 | 직선 개체 |
| HWPTAG_SHAPE_COMPONENT_RECTANGLE | 9 | 3 | 사각형 개체 |
| HWPTAG_SHAPE_COMPONENT_ELLIPSE | 60 | 3 | 타원 개체 |
| HWPTAG_SHAPE_COMPONENT_ARC | 25 | 3 | 호 개체 |
| HWPTAG_SHAPE_COMPONENT_POLYGON | 가변 | 3 | 다각형 개체 |
| HWPTAG_SHAPE_COMPONENT_CURVE | 가변 | 3 | 곡선 개체 |
| HWPTAG_SHAPE_COMPONENT_OLE | 26 | 3 | OLE 개체 |
| HWPTAG_SHAPE_COMPONENT_PICTURE | 가변 | 3 | 그림 개체 |
| HWPTAG_CTRL_DATA | 가변 | 2 | 컨트롤 임의의 데이터 |
| HWPTAG_EQEDIT | 가변 | 2 | 수식 개체 |
| HWPTAG_SHAPE_COMPONENT_TEXTART | 가변 | 3 | 글맵시 |
| HWPTAG_FORM_OBJECT | 가변 | 2 | 양식 개체 |
| HWPTAG_MEMO_SHAPE | 22 | 1 | 메모 모양 |
| HWPTAG_MEMO_LIST | 4 | 1 | 메모 리스트 헤더 |
| HWPTAG_CHART_DATA | 2 | 2 | 차트 데이터 |
| HWPTAG_VIDEO_DATA | 가변 | 3 | 비디오 데이터 |
| HWPTAG_SHAPE_COMPONENT_UNKNOWN | 36 | 3 | Unknown |
| **전체 길이** | **가변** |  |  |

**표 5 본문**

문단에 컨트롤이 포함되는 경우 컨트롤 헤더 이후로 문단 리스트 헤더와 같은 컨트롤의 레코드 데이터가 저장된다.

### 제어 문자 (컨트롤)

표, 그림 등 일반 문자로 표현할 수 없는 요소를 표현하기 위해서 문자 코드 중 일부분을 특수 용도로 사용하고 있다.

문단 내용 중에 문자 코드가 0-31인 문자들은 특수 용도로 사용된다. 이미 13번 문자는 문단 내용의 끝 식별 기호로 사용된다는 것은 설명한 바 있다. 이외의 특수 문자들은 표나 그림 등, 일반 문자로 표현할 수 없는 문서 장식 요소를 표현하기 위해서 제어문자(컨트롤)로 사용된다.

제어 문자는 다음 세 가지 형식이 존재한다.

- 문자 컨트롤 [char] = 하나의 문자로 취급되는 문자 컨트롤 / size = 1
- 인라인 컨트롤 [inline] = 별도의 오브젝트 포인터를 가리키지 않는 단순한 인라인 컨트롤 / size = 8
- 확장 컨트롤 [extended] = 별도의 오브젝트가 데이터를 표현하는 확장 컨트롤 / size = 8

| 코드 | 설명 | 컨트롤 형식 |
|------|------|------------|
| 0 | unusable | char |
| 1 | 예약 | extended |
| 2 | 구역 정의/단 정의 | extended |
| 3 | 필드 시작(누름틀, 하이퍼링크, 블록 책갈피, 표 계산식, 문서 요약, 사용자 정보, 현재 날짜/시간, 문서 날짜/시간, 파일 경로, 상호 참조, 메일 머지, 메모, 교정부호, 개인정보) | extended |

10