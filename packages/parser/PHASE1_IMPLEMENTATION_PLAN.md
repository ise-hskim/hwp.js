# Phase 1 구현 세부 계획

## 🎯 Phase 1 목표
HWP 문서의 핵심 기능들을 구현하여 대부분의 일반 문서를 제대로 파싱할 수 있도록 한다.

## 📋 구현 순서 및 세부 작업

### 1. 테스트 인프라 구축 (3-4일)

#### 1.1 테스트 환경 설정
- [ ] Jest 설정 확인 및 업데이트
- [ ] 테스트 헬퍼 함수 작성 (바이너리 데이터 생성, 모킹 등)
- [ ] CI/CD 파이프라인에 테스트 추가

#### 1.2 테스트 데이터 준비
- [ ] 다양한 HWP 샘플 파일 수집
  - [ ] 기본 텍스트 문서
  - [ ] 스타일이 적용된 문서
  - [ ] 번호/글머리표 목록 문서
  - [ ] 탭이 포함된 문서
  - [ ] 하이퍼링크가 있는 문서
- [ ] 각 기능별 최소 테스트 케이스 작성

#### 1.3 기존 코드 테스트 커버리지
- [ ] `parse.test.ts` 활성화 및 확장
- [ ] `DocInfoParser` 단위 테스트 작성
- [ ] `SectionParser` 단위 테스트 작성
- [ ] `ByteReader` 유틸리티 테스트

### 2. 스타일 시스템 구현 (5-6일)

#### 2.1 데이터 모델 정의
```typescript
// models/style.ts
interface Style {
  id: number;
  name: string;
  type: StyleType; // 문단, 문자
  parentId?: number; // 부모 스타일
  charShape?: CharShape;
  paraShape?: ParagraphShape;
}
```

#### 2.2 파서 구현
- [ ] `HWPTAG_STYLE` (0x0012) 레코드 파서 작성
- [ ] 스타일 상속 로직 구현
- [ ] 스타일 ID로 CharShape/ParaShape 연결
- [ ] Document 모델에 styles 배열 추가

#### 2.3 스타일 적용 로직
- [ ] 문단에 스타일 적용
- [ ] 문자 실행에 스타일 적용
- [ ] 스타일 우선순위 처리 (직접 지정 > 스타일)

#### 2.4 테스트
- [ ] 스타일 파싱 단위 테스트
- [ ] 스타일 상속 테스트
- [ ] 실제 문서 통합 테스트

### 3. 번호 매기기 구현 (4-5일)

#### 3.1 데이터 모델 정의
```typescript
// models/numbering.ts
interface Numbering {
  id: number;
  levels: NumberingLevel[]; // 최대 10레벨
}

interface NumberingLevel {
  numberFormat: NumberFormat; // 1, 가, ㄱ, A, a, I, i 등
  prefix: string; // "제", "Chapter" 등
  suffix: string; // "장", ".", ")" 등
  startNumber: number;
  charShape: number; // 문자 모양 ID
  indentSize: number;
  spacing: number;
}
```

#### 3.2 파서 구현
- [ ] `HWPTAG_NUMBERING` (0x0014) 레코드 파서
- [ ] 번호 형식 변환 로직
  - [ ] 아라비아 숫자 (1, 2, 3...)
  - [ ] 한글 자음 (ㄱ, ㄴ, ㄷ...)
  - [ ] 한글 가나다 (가, 나, 다...)
  - [ ] 알파벳 대/소문자 (A, B, C... / a, b, c...)
  - [ ] 로마 숫자 (I, II, III... / i, ii, iii...)
- [ ] 다단계 번호 처리

#### 3.3 번호 계산 엔진
- [ ] 현재 번호 추적 시스템
- [ ] 번호 재시작 처리
- [ ] 하위 레벨 번호 리셋

#### 3.4 테스트
- [ ] 각 번호 형식별 단위 테스트
- [ ] 다단계 번호 테스트
- [ ] 번호 재시작 테스트

### 4. 글머리표 구현 (3-4일)

#### 4.1 데이터 모델 정의
```typescript
// models/bullet.ts
interface Bullet {
  id: number;
  char: string; // 글머리표 문자 (•, ◦, ▪, ◆ 등)
  useImage: boolean;
  imageId?: number; // BinData ID
  charShape: number;
  indentSize: number;
}
```

#### 4.2 파서 구현
- [ ] `HWPTAG_BULLET` (0x0015) 레코드 파서
- [ ] 기본 글머리표 문자 처리
- [ ] 이미지 글머리표 연결
- [ ] 들여쓰기 레벨별 글머리표 변경

#### 4.3 테스트
- [ ] 문자 글머리표 테스트
- [ ] 이미지 글머리표 테스트
- [ ] 다단계 글머리표 테스트

### 5. 탭 정의 구현 (2-3일)

#### 5.1 데이터 모델 정의
```typescript
// models/tabDef.ts
interface TabDef {
  id: number;
  tabs: TabStop[];
}

interface TabStop {
  position: number; // HWPUNIT
  type: TabType; // 왼쪽, 오른쪽, 가운데, 소수점
  fillType: TabFillType; // 없음, 점선, 실선 등
  leader?: string; // 채움 문자
}
```

#### 5.2 파서 구현
- [ ] `HWPTAG_TAB_DEF` (0x0016) 레코드 파서
- [ ] 탭 위치 계산 로직
- [ ] 탭 채움 처리

#### 5.3 테스트
- [ ] 탭 정의 파싱 테스트
- [ ] 다양한 탭 타입 테스트

### 6. 하이퍼링크 구현 (3-4일)

#### 6.1 컨트롤 모델 확장
```typescript
// models/controls/hyperlink.ts
interface HyperlinkControl extends Control {
  url: string;
  tooltip?: string;
  targetFrame?: string;
  linkType: LinkType; // URL, 책갈피, 파일 등
}
```

#### 6.2 파서 구현
- [ ] 하이퍼링크 컨트롤 인식 (Ctrl ID: 0x0003)
- [ ] URL 파싱 및 디코딩
- [ ] 내부 링크(책갈피) 처리
- [ ] 링크 영역 계산

#### 6.3 테스트
- [ ] URL 링크 테스트
- [ ] 내부 링크 테스트
- [ ] 파일 링크 테스트

## 🔧 공통 작업

### 리팩토링 및 개선
- [ ] `parseRecord.ts`에 새로운 태그 추가
- [ ] `constants/tagID.ts` 업데이트 확인
- [ ] 에러 처리 강화 (unknown tag handling)
- [ ] 로깅 시스템 추가 (디버깅용)

### 문서화
- [ ] 각 새로운 모델에 대한 JSDoc 작성
- [ ] 구현된 기능 README 업데이트
- [ ] API 사용 예제 작성

## 📊 예상 일정

| 작업 | 예상 기간 | 우선순위 |
|------|----------|----------|
| 테스트 인프라 | 3-4일 | 🔴 Critical |
| 스타일 시스템 | 5-6일 | 🔴 Critical |
| 번호 매기기 | 4-5일 | 🟠 High |
| 글머리표 | 3-4일 | 🟠 High |
| 탭 정의 | 2-3일 | 🟡 Medium |
| 하이퍼링크 | 3-4일 | 🟡 Medium |
| **총 예상 기간** | **20-26일** | |

## 🚀 구현 전략

1. **점진적 구현**: 각 기능을 독립적으로 구현하고 테스트
2. **하위 호환성**: 기존 파서 기능을 손상시키지 않도록 주의
3. **에러 복원력**: 알 수 없는 태그나 손상된 데이터 처리
4. **성능 고려**: 대용량 문서에서도 효율적으로 동작하도록 구현

## ✅ 완료 기준

각 기능은 다음 기준을 만족해야 완료로 간주:
1. 단위 테스트 커버리지 80% 이상
2. 실제 HWP 문서로 통합 테스트 통과
3. 에러 처리 및 엣지 케이스 처리
4. 코드 리뷰 및 문서화 완료

## 🔍 리스크 및 대응

### 기술적 리스크
- **스펙 불명확**: 일부 바이너리 포맷이 문서화되지 않음
  - 대응: 실제 HWP 파일 리버스 엔지니어링
- **호환성 이슈**: 다양한 HWP 버전 간 차이
  - 대응: 버전별 조건부 파싱 로직

### 일정 리스크
- **복잡도 과소평가**: 실제 구현이 예상보다 복잡할 수 있음
  - 대응: 버퍼 시간 확보, MVP 먼저 구현

## 📝 참고사항

- 모든 새로운 기능은 `experimental` 플래그로 시작
- 성능 측정을 위한 벤치마크 추가
- 메모리 사용량 모니터링
- 구현 중 발견된 스펙 불일치는 문서화