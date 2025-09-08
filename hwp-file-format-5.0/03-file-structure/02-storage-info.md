# 스토리지별 저장 정보

## 개요

HWP 파일은 Compound File 구조를 사용하며, 스토리지/스트림 단위로 데이터를 분리 저장합니다. 아래는 대표 스토리지와 특징입니다.

## 주요 스토리지

- DocInfo/: 문서 정보(레코드 구조, 압축 대상)
- BodyText/: 본문(섹션별 레코드, 압축 대상)
- BinData/: 바이너리 데이터(선택적 압축)
- DocHistory/: 문서 이력(레코드 구조, 압축 대상)
- PrvText: 미리보기 텍스트
- PrvImage: 미리보기 이미지
- DocOptions/: 문서 옵션
- Scripts/: 스크립트(DefaultJScript/JScriptVersion 등)
- XMLTemplate/: XML 스키마/인스턴스

## 압축/암호화

- 압축 플래그는 FileHeader에서 확인
- DocInfo/BodyText/DocHistory는 zlib 압축 사용 가능
- BinData는 항목별 선택적 압축

## 스토리지 요약 표

| 스토리지     | 레코드 기반 | 압축   | 암호화 | 대표 레코드/내용 예시            |
| ------------ | ----------- | ------ | ------ | -------------------------------- |
| DocInfo/     | ✅          | ✅     | (가능) | 문서 속성/글꼴/스타일 등(Tag ID) |
| BodyText/    | ✅          | ✅     | (가능) | 문단/컨트롤/개체(Tag ID)         |
| BinData/     | ❌          | (선택) | (가능) | 이미지/OLE 데이터                |
| DocHistory/  | ✅          | ✅     | (가능) | HISTORY*RECORD_TYPE*\*           |
| PrvText      | ❌          | ❌     | ❌     | 미리보기 텍스트                  |
| PrvImage     | ❌          | ❌     | ❌     | 미리보기 이미지                  |
| DocOptions/  | ❌          | ❌     | (가능) | \_LinkDoc/DrmLicense 등          |
| Scripts/     | ❌          | ❌     | (가능) | DefaultJScript 등                |
| XMLTemplate/ | ❌          | ❌     | (가능) | Schema/Instance 등               |

---

_상세 구조는 `03-file-structure/01-overview.md`와 `04-data-records/` 섹션을 참고하세요._

## 관련 표 (원문)

- 표 13: 문서 정보의 데이터 레코드(태그 목록)
- 표 57: 본문의 데이터 레코드 요약
