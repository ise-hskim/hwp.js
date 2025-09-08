# 한글 문서 파일 형식 5.0

**Hwp Document File Formats 5.0**

_revision 1.3:20181108_

## 📋 목차

### [01. 서론 및 개요](01-introduction/)

- [저작권](01-introduction/01-copyright.md)
- [본 문서에 대하여](01-introduction/02-about-document.md)
- [개요](01-introduction/03-overview.md)

### [02. 자료형 설명](02-data-types/)

- [기본 자료형](02-data-types/basic-types.md)
- [한글 내부 단위](02-data-types/hwp-units.md)

### [03. 한글 파일 구조](03-file-structure/)

- [파일 구조 요약](03-file-structure/01-overview.md)
- [스토리지별 저장 정보](03-file-structure/02-storage-info.md)
- [제어 문자(컨트롤)](03-file-structure/03-control-characters.md)

### [04. 데이터 레코드](04-data-records/)

- [레코드 구조](04-data-records/00-record-structure.md)
- [문서 정보 레코드](04-data-records/01-document-info/)
- [본문 레코드](04-data-records/02-body-text/)
- [문서 이력 관리](04-data-records/03-history-management/)

### [05. 부록](05-appendix/)

- [변경 사항 이력](05-appendix/change-history.md)
- [Tag ID 참조표](05-appendix/tag-id-reference.md)
- [컨트롤 ID 참조표](05-appendix/control-id-reference.md)

---

## 📄 문서 정보

- **문서명**: 한글 문서 파일 형식 5.0
- **영문명**: Hwp Document File Formats 5.0
- **버전**: revision 1.3:20181108
- **발행**: (주)한글과컴퓨터

## 🎯 개요

본 문서는 한글 워드 프로세서의 파일 저장 형식 중, 한글 2002 이후 제품에서 사용되는 **한글 문서 파일 형식 5.0**에 관하여 설명합니다.

### 주요 특징

- **복합 파일 구조**: Windows Compound File 기반
- **문자 인코딩**: 유니코드(UTF-16LE)
- **압축 지원**: zlib 기반 압축
- **확장자**: `.hwp`

### 적용 제품

- 한글 워디안 (2000년 10월 이후)
- 한글 2002, 2005, 2007, 2010, 2014, 2018 등

## 🔧 개발자를 위한 안내

### 필수 라이브러리

- **복합 파일 처리**: Microsoft Compound Storage API
- **압축 해제**: zlib 라이브러리
- **문자 처리**: UTF-16LE 지원

### 파싱 흐름

1. FileHeader 읽기 → 압축/암호화 확인
2. 압축 해제 (필요시)
3. DocInfo → 메타데이터 파싱
4. BodyText → 본문 내용 파싱
5. BinData → 이미지/OLE 데이터 추출

## 📜 저작권

(주)한글과컴퓨터에서 제공하는 공개 문서입니다.

- ✅ **자유로운 열람, 복사, 배포 가능**
- ✅ **개발 결과물에 대한 독립적 저작권 인정**
- ⚠️ **원본 수정 없이 배포 제한**
- ⚠️ **개발 시 출처 명시 필수**

---

_"본 제품은 한글과컴퓨터의 글 문서 파일(.hwp) 공개 문서를 참고하여 개발하였습니다."_

## ℹ️ 문서 안내

> 이 저장소는 '스펙 정리 + 구현 가이드'가 함께 포함되어 있습니다. 표기 규칙과 표 범례는 `CONTRIBUTING.md`를 참고하세요. 원문 표 인덱스는 `TABLE_INDEX.md`를 참고하세요.

---
