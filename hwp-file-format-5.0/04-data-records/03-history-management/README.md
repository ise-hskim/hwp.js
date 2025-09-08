# 문서 이력 관리 (DocHistory)

## 개요

문서의 변경 이력을 `DocHistory/VersionLogN` 스트림에 저장합니다. 각 아이템은 압축/암호화될 수 있으며, 시작/끝 레코드로 경계를 형성합니다.

## 레코드 목록

| Tag ID                                   | 이름                  | 내용             |
| ---------------------------------------- | --------------------- | ---------------- |
| `HISTORY_RECORD_TYPE_STAG (0x10)`        | 히스토리 아이템 시작  | flag/option 포함 |
| `HISTORY_RECORD_TYPE_ETAG (0x11)`        | 히스토리 아이템 끝    | 종료 표시        |
| `HISTORY_RECORD_TYPE_VERSION (0x20)`     | 버전                  | DWORD 버전 값    |
| `HISTORY_RECORD_TYPE_DATE (0x21)`        | 날짜                  | SYSTEMDATE       |
| `HISTORY_RECORD_TYPE_WRITER (0x22)`      | 작성자                | WCHAR            |
| `HISTORY_RECORD_TYPE_DESCRIPTION (0x23)` | 설명                  | WCHAR            |
| `HISTORY_RECORD_TYPE_DIFFDATA (0x30)`    | 비교 정보             | DiffML (WCHAR)   |
| `HISTORY_RECORD_TYPE_LASTDOCDATA (0x31)` | 가장 마지막 최근 문서 | HWPML (WCHAR)    |

---

## HISTORY_RECORD_TYPE_STAG

- flag (WORD): 포함 레코드 플래그
  - VERSION(0x01), DATE(0x02), WRITER(0x04), DESCRIPTION(0x08), DIFFDATA(0x10), LASTDOCDATA(0x40)
- option (UINT): 자동저장 등 공통 옵션

## HISTORY_RECORD_TYPE_VERSION / DATE / WRITER / DESCRIPTION

- VERSION: `DWORD`
- DATE: `SYSTEMDATE`
- WRITER: `WCHAR`
- DESCRIPTION: `WCHAR`

## HISTORY_RECORD_TYPE_DIFFDATA

- DiffML(XML)로 비교 정보 저장

## HISTORY_RECORD_TYPE_LASTDOCDATA

- 최근 문서(HWPML) 스냅샷 문자열

---

## 저장 구조

- `DocHistory/VersionLog%d` 스트림 단위 저장
- 각 아이템은 압축/암호화 가능
- 아이템 시작(STAG) → 속성/부가 레코드들 → 아이템 끝(ETAG)

## 파싱 지침

1. 스트림을 순차 읽기하며 STAG/ETAG 쌍을 확인
2. flag에 따라 존재하는 서브 레코드만 조건부 파싱
3. 미지 레코드는 Size만큼 건너뛰어 보존

## 보안/성능

- 압축 여부는 FileHeader/스트림 속성으로 확인 후 해제
- 큰 DiffML/HWPML은 스트리밍 처리 권장

---

> 출처: 원문 4.4 문서 이력 관리 — 표 154(히스토리 아이템 정보 시작) ~ 표 161(가장 마지막 최근 문서), p.62~63

## 관련 표 (원문)

- 표 154: 히스토리 아이템 정보 시작
- 표 156: 히스토리 아이템 버전
- 표 157: 히스토리 날짜
- 표 158: 히스토리 작성자
- 표 159: 히스토리 설명
- 표 160: 비교 정보
- 표 161: 가장 마지막 최근 문서
