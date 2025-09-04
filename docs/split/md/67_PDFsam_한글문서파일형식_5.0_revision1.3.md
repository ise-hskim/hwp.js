# 한글 문서 파일 형식 5.0

## 4.4. 문서 이력 관리

문서 이력 관리에서 사용되는 데이터 레코드는 다음과 같다.

### 4.4.1. 문서 이력 관리란

한글 '문서 이력 관리 정보'는 한글 2005(6.5.0.724), 문서 형식 버전(Doc 5.0.1.7)부터 지원한다. 한글 메뉴의 "파일-문서 이력 관리"에서 표시 및 생성되는 문서의 이력 정보를 저장하는 장소이다.(한글 2005에서 한글 2007까지는 '버전 비교(파일-버전 비교)'라는 이름으로 '문서 이력 관리 정보' 기능을 제공하였다.)

문서 이력 정보의 각각의 아이템은 "히스토리" 혹은 "히스토리 아이템"이라 하며 한글 Compound 구조 내에서 각 아이템은 "DocHistory"라는 스토리지 내부에 VersionLog%d(%d는 버전) 이름의 스트림으로 저장된다. 또한, 각각 아이템은 압축, 암호화되어 저장된다. 이력 정보 데이터를 "DocHistory"라는 새로운 스토리지로 저장한다.

### 4.4.2. 문서 이력 관리 레코드 정보

#### 4.4.2.1. 히스토리 아이템 정보 시작

**Tag ID : HISTORY_RECORD_TYPE_STAG (0x10)**

##### 표 154 히스토리 아이템 정보 시작

| 내 용 | 첨부 데이터 길이 및 Type |
|-------|------------------------|
| 히스토리 아이템 정보 시작 | WORD flag<br>UINT option |

✓ **flag** : 각 아이템에 대한 포함 레코드 flag
- HISTORY_INFO_FLAG_VERSION (0x01) : 버전 존재
- HISTORY_INFO_FLAG_DATE (0x02) : 날짜 존재
- HISTORY_INFO_FLAG_WRITER (0x04) : 작성자 존재
- HISTORY_INFO_FLAG_DESCRIPTION (0x08) : 설명 존재
- HISTORY_INFO_FLAG_DIFFDATA (0x10) : Diff Data 존재
- HISTORY_INFO_FLAG_LASTDOCDATA : 최근 문서 존재 (기록하지 않음, 필수)
- HISTORY_INFO_FLAG_LOCK (0x40) : 현재 히스토리 아이템 Lock 상태

✓ **option** : 버전 정보 관련 공통 옵션
- HWPVERSION_AUTOSAVE (0x00000001) : 문서 저장 시 자동 저장

#### 4.4.2.2. 히스토리 아이템 정보 끝

**Tag ID : HISTORY_RECORD_TYPE_ETAG (0x11)**

##### 표 155 히스토리 아이템 정보 끝

| 내 용 | 첨부 데이터 Type |
|-------|----------------|
| 히스토리 아이템 정보 끝 | NONE |

---
페이지: 62

62