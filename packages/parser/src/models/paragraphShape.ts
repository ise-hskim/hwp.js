/**
 * Copyright Han Lee <hanlee.dev@gmail.com> and other contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export enum LineSpacingType {
  PERCENT = 0,        // 글자에 따라 (%)
  FIXED = 1,          // 고정값
  AT_LEAST = 2,       // 여백만 지정
  MINIMUM = 3         // 최소 (5.0.2.5 이상)
}

export enum AlignType {
  JUSTIFY = 0,        // 양쪽 정렬
  LEFT = 1,           // 왼쪽 정렬
  RIGHT = 2,          // 오른쪽 정렬
  CENTER = 3,         // 가운데 정렬
  DISTRIBUTE = 4,     // 배분 정렬
  DIVIDE = 5          // 나눔 정렬
}

export enum VerticalAlignType {
  BASELINE = 0,       // 글꼴기준
  TOP = 1,            // 위쪽
  MIDDLE = 2,         // 가운데
  BOTTOM = 3          // 아래
}

export enum HeadingType {
  NONE = 0,           // 없음
  OUTLINE = 1,        // 개요
  NUMBER = 2,         // 번호
  BULLET = 3          // 글머리표
}

export enum EnglishBreakType {
  WORD = 0,           // 단어
  HYPHEN = 1,         // 하이픈
  CHARACTER = 2       // 글자
}

class ParagraphShape {
  // 속성 1 (Attribute 1)
  lineSpacingType: LineSpacingType = LineSpacingType.PERCENT
  align: AlignType = AlignType.LEFT
  englishBreakType: EnglishBreakType = EnglishBreakType.WORD
  koreanBreakByChar: boolean = false
  useLineGrid: boolean = false
  spaceMinimumValue: number = 0
  orphanProtect: boolean = false
  keepWithNext: boolean = false
  protectParagraph: boolean = false
  pageBreakBefore: boolean = false
  verticalAlign: VerticalAlignType = VerticalAlignType.BASELINE
  fontLineHeight: boolean = false
  headingType: HeadingType = HeadingType.NONE
  level: number = 0
  borderConnect: boolean = false
  ignoreParagraphMargin: boolean = false
  tailShape: boolean = false

  // 간격 및 여백 속성
  leftMargin: number = 0          // 왼쪽 여백
  rightMargin: number = 0         // 오른쪽 여백
  indent: number = 0              // 들여 쓰기/내어 쓰기
  spacingTop: number = 0          // 문단 간격 위
  spacingBottom: number = 0       // 문단 간격 아래
  lineSpacing: number = 0         // 줄 간격

  // 참조 ID들
  tabDefId: number = 0            // 탭 정의 ID
  numberingId: number = 0         // 번호 문단 ID 또는 글머리표 ID
  borderFillId: number = 0        // 테두리/배경 모양 ID

  // 테두리 간격
  borderOffsetLeft: number = 0    // 문단 테두리 왼쪽 간격
  borderOffsetRight: number = 0   // 문단 테두리 오른쪽 간격
  borderOffsetTop: number = 0     // 문단 테두리 위쪽 간격
  borderOffsetBottom: number = 0  // 문단 테두리 아래쪽 간격

  // 속성 2 (5.0.1.7 이상)
  singleLineInput: number = 0     // 한 줄로 입력 여부
  autoSpaceHangulLatin: boolean = false  // 한글과 영어 간격을 자동 조절 여부
  autoSpaceHangulDigit: boolean = false  // 한글과 숫자 간격을 자동 조절 여부

  // 속성 3 (5.0.2.5 이상)
  attribute3: number = 0          // 추가 속성
}

export default ParagraphShape
