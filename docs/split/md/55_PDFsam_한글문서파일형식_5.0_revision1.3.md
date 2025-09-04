# 한글 문서 파일 형식 5.0

## 표 118 OLE 개체 속성 (계속)

| 자료형 | 길이(바이트) | 설명 |
|--------|-------------|------|
| COLORREF | 4 | 테두리 색 |
| INT32 | 4 | 테두리 두께 |
| UINT32 | 4 | 테두리 속성(표 87 참조) |
| 전체 길이 | 24 |  |

## 표 119 OLE 개체 속성의 속성

| 범위 | 구분 | 값 | 설명 |
|------|-----|----|----- |
| bit 0～7 |  |  | DVASPECT_CONTENT = 1,<br>DVASPECT_THUMBNAIL = 2,<br>DVASPECT_ICON = 4,<br>DVASPECT_DOCPRINT = 8 |
| bit 8 |  |  | TRUE if moniker is assigned |
| bit 9～15 |  |  | 베이스라인. 0은 디폴트(85%)를 뜻하고, 1～101이<br>0～100%를 나타낸다. 현재는 수식만이 베이스라인을<br>별도로 가진다. |
| bit 16～21 | 개체 종류 | 0 | Unknown |
|  |  | 1 | Embedded |
|  |  | 2 | Link |
|  |  | 3 | Static |
|  |  | 4 | Equation |

💡 bit 0-7에 대한 자세한 설명은 MSDN을 참고  
MFC COleClientItem::m_nDrawAspect

💡 bit 8에 대한 자세한 설명은 MSDN을 참고  
MFC COleClientItem::m_bMoniker

## 4.3.9.6. 차트 개체

차트는 본문에 Ole 개체로 저장되며, 차트 내용은 Ole Compound 파일로 저장된다. 차트 파일의 최상위 storage에 "Contents", "OOXMLChartContents" stream이 저장될 수 있다. 기존 hwp(한글 Neo) 차트에서는 "Contents" stream만 존재한다. 한글 2018 한글에서는 OOXML 차트를 저장할 수 있고, "OOXMLChartContents"와 "Contents" stream에 차트를 저장할 수 있다. 한글 2018에서 차트에서 "Contents" stream은 OOXML 차트를 구 버전(한글 Neo)의 차트로 변환한 예비 데이터이다.

"Contents" stream의 내용은 첨부 파일("한글문서파일형식_차트_revision1.2_원본.hwp")의 내용을 참조하면 된다.

"OOXMLChartContents" stream은 MS OOXML에서 차트를 저장하는 방식으로, 최상위 element는 "chartSpace" element이며, 내용은 ISO/IEC 29500나 ECMA 376의 DrawingML의 Chart 부분을 참조하면 된다.

---
페이지: 50

50