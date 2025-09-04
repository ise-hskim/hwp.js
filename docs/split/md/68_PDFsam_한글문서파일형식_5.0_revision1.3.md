# 한글 문서 파일 형식 5.0

## 4.4.2.3. 히스토리 아이템 버전

**Tag ID : HISTORY_RECORD_TYPE_VERSION (0x20)**

### 표 156 히스토리 아이템 버전

| 내 용 | 첨부 데이터 Type |
|-------|----------------|
| 히스토리 아이템 버전 | DWORD |

## 4.4.2.4. 히스토리 날짜

**Tag ID : HISTORY_RECORD_TYPE_DATE (0x21)**

### 표 157 히스토리 날짜

| 내 용 | 첨부 데이터 Type |
|-------|----------------|
| 히스토리 날짜 | SYSTEMDATE |

## 4.4.2.5. 히스토리 작성자

**Tag ID : HISTORY_RECORD_TYPE_WRITER (0x22)**

### 표 158 히스토리 작성자

| 내 용 | 첨부 데이터 Type |
|-------|----------------|
| 히스토리 작성자 | WCHAR |

## 4.4.2.6. 히스토리 설명

**Tag ID : HISTORY_RECORD_TYPE_DESCRIPTION (0x23)**

### 표 159 히스토리 설명

| 내 용 | 첨부 데이터 Type |
|-------|----------------|
| 히스토리 설명 | WCHAR |

## 4.4.2.7. 비교 정보

**Tag ID : HISTORY_RECORD_TYPE_DIFFDATA (0x30)**

### 표 160 비교 정보

| 내 용 | 첨부 데이터 Type |
|-------|----------------|
| 비교 정보 : DiffML | WCHAR |

## 4.4.2.8. 가장 마지막 최근 문서

**Tag ID : HISTORY_RECORD_TYPE_LASTDOCDATA (0x31)**

### 표 161 가장 마지막 최근 문서

| 내 용 | 첨부 데이터 Type |
|-------|----------------|
| 가장 마지막 최근 문서<br>(HWPML) | WCHAR |

히스토리 아이템 저장 시 시작은 HISTORY_RECORD_TYPE_STAG 레코드로 시작하며, 아이템 내용의 끝은 HISTORY_RECORD_TYPE_ETAG 레코드로 종료한다.

---
페이지: 63

63