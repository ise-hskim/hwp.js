# 한글 문서 파일 형식 5.0

다.(3~9까지 8개의 ch)

| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|---|---|---|---|---|---|---|---|---|----|----|
| 'A' | 'B' | ch | pointer | | | | ch | 'C' | 13 |

↓

Control Object Instance

본 문서에 부가 설명 없이 '컨트롤' 또는 '제어 문자'이라고 하면 바로 이 확장 컨트롤을 지칭하는 것이다.

### 3.2.4. 문서 요약

\005HwpSummaryInfomation 스트림에는 한글 메뉴의 "파일-문서 정보-문서 요약"에서 입력한 내용이 저장된다.

> **참고:** Summary Information에 대한 자세한 설명은 MSDN을 참고  
> The Summary Information Property Set  
> The DocumentSummaryInformation and UserDefined Property Set

| Name | Property ID string | Property ID | VT type |
|------|-------------------|-------------|---------|
| Title | PIDSI_TITLE | 0x00000002 | VT_LPSTR |
| Subject | PIDSI_SUBJECT | 0x00000003 | VT_LPSTR |
| Author | PIDSI_AUTHOR | 0x00000004 | VT_LPSTR |
| Keywords | PIDSI_KEYWORDS | 0x00000005 | VT_LPSTR |
| Comments | PIDSI_COMMENTS | 0x00000006 | VT_LPSTR |
| Last Saved By | PIDSI_LASTAUTHOR | 0x00000008 | VT_LPSTR |
| Revision Number | PIDSI_REVNUMBER | 0x00000009 | VT_LPSTR |
| Last Printed | PIDSI_LASTPRINTED | 0x0000000B | VT_FILETIME (UTC) |
| Create Time/Date( (*)) | PIDSI_CREATE_DTM | 0x0000000C | VT_FILETIME (UTC) |
| Last saved Time/Date( (*)) | PIDSI_LASTSAVE_DTM | 0x0000000D | VT_FILETIME (UTC) |
| Number of Pages | PIDSI_PAGECOUNT | 0x0000000E | VT_I4 |
| Date String(User define) | HWPPIDSI_DATE_STR | 0x00000014 | VT_LPSTR |
| Para Count(User define) | HWPPIDSI_PARACOUNT | 0x00000015 | VT_I4 |

**표 7 문서 요약**

### 3.2.5. 바이너리 데이터

BinData 스토리지에는 그림이나 OLE 개체와 같이 문서에 첨부된 바이너리 데이터가 각각의 스트림으로 저장된다.

### 3.2.6. 미리보기 텍스트

PrvText 스트림에는 미리보기 텍스트가 유니코드 문자열로 저장된다.

12