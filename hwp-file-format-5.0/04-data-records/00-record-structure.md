# 데이터 레코드 구조

## 개요

한글 문서 파일 형식 5.0에서 **문서 정보(DocInfo)**, **본문(BodyText)**, **문서 이력 관리(DocHistory)**는 **레코드(Record) 구조**로 저장됩니다.

레코드 구조는 **계층적 데이터**를 효율적으로 저장하고, **확장성**과 **하위 호환성**을 보장하는 핵심 메커니즘입니다.

## 레코드 헤더 구조

모든 레코드는 **32비트(4바이트) 헤더**로 시작합니다. 헤더는 아래와 같이 구성됩니다.

```
31            20 19          10 9            0
+---------------+--------------+-------------+
|     Size      |    Level     |    TagID    |
+---------------+--------------+-------------+
   (12 bits)        (10 bits)      (10 bits)
```

- **TagID (bit 0~9, 10bit)**: 레코드 타입 식별자 (0x000 ~ 0x3FF)
- **Level (bit 10~19, 10bit)**: 계층(Level) 깊이
- **Size (bit 20~31, 12bit)**: 데이터 영역의 길이(바이트)

### 확장 길이(Extended Size)

- Size 필드의 12비트가 모두 1(`0xFFF`)이면 데이터 길이가 4095바이트 이상임을 의미합니다.
- 이 경우, 헤더 뒤에 **추가 길이 DWORD(4바이트)**가 이어지며, 실제 데이터 길이는 이 DWORD 값으로 판단합니다.

```
레코드
┌─────────────────────┬─────────────────┬────────────┐
│    헤더 (DWORD)     │   길이 (DWORD)  │   데이터    │
└─────────────────────┴─────────────────┴────────────┘
```

---

## Tag ID 체계

### 범위

- 0x000 ~ 0x00F: 특별 용도
- 0x010 ~ 0x1FF: 내부 예약 영역(`HWPTAG_BEGIN = 0x010`)
- 0x200 ~ 0x3FF: 외부 확장 영역

### C 매크로 정의(발췌)

```c
#define HWPTAG_BEGIN 0x010

#define HWPTAG_DOCUMENT_PROPERTIES   (HWPTAG_BEGIN + 0)
#define HWPTAG_ID_MAPPINGS           (HWPTAG_BEGIN + 1)
#define HWPTAG_BIN_DATA              (HWPTAG_BEGIN + 2)
#define HWPTAG_FACE_NAME             (HWPTAG_BEGIN + 3)
#define HWPTAG_BORDER_FILL           (HWPTAG_BEGIN + 4)
#define HWPTAG_CHAR_SHAPE            (HWPTAG_BEGIN + 5)
#define HWPTAG_TAB_DEF               (HWPTAG_BEGIN + 6)
#define HWPTAG_NUMBERING             (HWPTAG_BEGIN + 7)
#define HWPTAG_BULLET                (HWPTAG_BEGIN + 8)
#define HWPTAG_PARA_SHAPE            (HWPTAG_BEGIN + 9)
#define HWPTAG_STYLE                 (HWPTAG_BEGIN + 10)
#define HWPTAG_DOC_DATA              (HWPTAG_BEGIN + 11)
#define HWPTAG_DISTRIBUTE_DOC_DATA   (HWPTAG_BEGIN + 12)
#define HWPTAG_COMPATIBLE_DOCUMENT   (HWPTAG_BEGIN + 14)
#define HWPTAG_LAYOUT_COMPATIBILITY  (HWPTAG_BEGIN + 15)
/* ... */
```

---

## 레코드 파싱 알고리즘

### 기본 읽기 순서

```
1. 레코드 헤더(DWORD) 읽기
2. TagID/Level/Size 비트 추출
3. Size == 0xFFF이면 추가 길이 DWORD를 읽어 실제 길이 결정
4. 데이터(length)만큼 읽기
5. 알려진 레코드면 파싱, 미지 레코드는 건너뛰기
6. 다음 레코드로 이동
```

### 비트 조작 매크로

```c
#define GET_TAGID(h)   ((UINT32)((h) & 0x3FF))
#define GET_LEVEL(h)   ((UINT32)(((h) >> 10) & 0x3FF))
#define GET_SIZE12(h)  ((UINT32)(((h) >> 20) & 0xFFF))
```

### 기본 파싱 코드(예시)

```c
void parse_record_stream(const BYTE* data, size_t length) {
    size_t pos = 0;

    while (pos + 4 <= length) {
        UINT32 header = *(const UINT32*)(data + pos);
        UINT32 tagid  = GET_TAGID(header);
        UINT32 level  = GET_LEVEL(header);
        UINT32 size12 = GET_SIZE12(header);
        pos += 4; // 헤더

        UINT32 payload_size = size12;
        if (size12 == 0xFFF) {
            if (pos + 4 > length) break; // 방어적 검사
            payload_size = *(const UINT32*)(data + pos);
            pos += 4; // 확장 길이
        }

        if (pos + payload_size > length) {
            // 손상된 레코드 - 안전하게 중단
            break;
        }

        const BYTE* payload = data + pos;

        switch (tagid) {
            case /* HWPTAG_DOCUMENT_PROPERTIES */ (HWPTAG_BEGIN + 0):
                parse_document_properties(payload, payload_size);
                break;
            /* ... 기타 알려진 레코드 ... */
            default:
                // 미지 레코드 - 건너뛰기
                break;
        }

        pos += payload_size; // 데이터 구간 이동
    }
}
```

> 주: 확장 길이 레코드의 경우 헤더(4바이트) 뒤에 길이 DWORD(4바이트)가 추가되어 오버헤드가 발생합니다. 또한 잘못된 길이(축약/손상 파일)에 대비해 `pos + size` 경계를 항상 검증해야 합니다.

---

## 확장성과 하위 호환성

### 미지 레코드 처리

새로운 버전에서 추가된 **알 수 없는 Tag ID**를 만났을 때:

1. **Size 필드**를 읽어 레코드 크기 파악
2. 해당 크기만큼 **건너뛰기**
3. 다음 레코드 계속 처리

이를 통해 **하위 호환성**을 보장합니다.

### 레코드 추가 규칙

- **기존 레코드 구조는 변경 금지**
- **새로운 레코드는 기존 뒤에 추가**
- **선택적 정보는 별도 레코드로 분리**

## 주요 레코드 타입별 특징

### 문서 정보 레코드

- **DocInfo 스트림**에 저장
- **메타데이터 중심**: 글꼴, 스타일, 문단 모양 등
- **참조 테이블 역할**: 본문에서 ID로 참조

### 본문 레코드

- **BodyText 스트림**에 저장
- **계층 구조 활용**: 구역 → 문단 → 텍스트/컨트롤
- **실제 문서 내용**: 사용자가 입력한 텍스트와 개체들

### 이력 관리 레코드

- **DocHistory 스트림**에 저장
- **버전 관리**: 문서의 변경 이력 추적
- **압축 저장**: 개별 히스토리 아이템도 압축

---

_레코드 구조는 한글 파일 형식의 핵심이며, 이를 정확히 이해해야 완전한 파서를 구현할 수 있습니다._

- **제한 사항**
  - TagID: 0x000~0x3FF (10bit)
  - Level: 0~1023 (10bit)
  - Size12: 0~4094 (0xFFF일 때 확장 DWORD 사용)

### 플랫폼 안전 파싱 권고

- 정렬/엔디언 문제를 피하기 위해 헤더는 바이트 단위로 읽어 조합하거나 `memcpy`를 사용하세요.

```c
UINT32 read_u32_le(const BYTE* p) {
    return ((UINT32)p[0]) | ((UINT32)p[1] << 8) | ((UINT32)p[2] << 16) | ((UINT32)p[3] << 24);
}

void parse_record_stream_safe(const BYTE* data, size_t length) {
    size_t pos = 0;
    while (pos + 4 <= length) {
        UINT32 header; memcpy(&header, data + pos, 4);
        UINT32 tagid  = GET_TAGID(header);
        UINT32 level  = GET_LEVEL(header);
        UINT32 size12 = GET_SIZE12(header);
        pos += 4;
        UINT32 payload_size = size12;
        if (size12 == 0xFFF) {
            if (pos + 4 > length) break;
            memcpy(&payload_size, data + pos, 4);
            pos += 4;
        }
        if (pos + payload_size > length) break;
        // ...
        pos += payload_size;
    }
}
```

## 관련 표 (원문)

- 해당 섹션에 표 없음
