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

export enum NumberFormat {
  Digit = 0,           // 1, 2, 3...
  CircledDigit = 1,    // ①, ②, ③...
  RomanCapital = 2,    // I, II, III...
  RomanSmall = 3,      // i, ii, iii...
  LatinCapital = 4,    // A, B, C...
  LatinSmall = 5,      // a, b, c...
  CircledLatinCapital = 6, // Ⓐ, Ⓑ, Ⓒ...
  CircledLatinSmall = 7,   // ⓐ, ⓑ, ⓒ...
  HangulSyllable = 8,  // 가, 나, 다...
  CircledHangulSyllable = 9, // ㉮, ㉯, ㉰...
  HangulJamo = 10,     // ㄱ, ㄴ, ㄷ...
  CircledHangulJamo = 11, // ㉠, ㉡, ㉢...
  HangulPhonetic = 12, // 갑, 을, 병...
  Ideograph = 13,      // 一, 二, 三...
  CircledIdeograph = 14, // ㊀, ㊁, ㊂...
}

export interface NumberingLevel {
  numberFormat: NumberFormat;
  prefix: string;
  suffix: string;
  startNumber: number;
  charShapeId: number;
  indentSize: number;
  spacing: number;
}

export interface Numbering {
  id: number;
  levels: NumberingLevel[];
}

class HWPNumbering implements Numbering {
  public id: number;
  public levels: NumberingLevel[];

  constructor(id: number) {
    this.id = id;
    this.levels = [];
  }

  addLevel(level: NumberingLevel) {
    this.levels.push(level);
  }

  getLevel(index: number): NumberingLevel | undefined {
    return this.levels[index];
  }

  /**
   * 주어진 숫자를 지정된 형식으로 변환
   */
  static formatNumber(num: number, format: NumberFormat): string {
    switch (format) {
      case NumberFormat.Digit:
        return num.toString();
      
      case NumberFormat.CircledDigit:
        if (num >= 1 && num <= 20) {
          return String.fromCharCode(0x2460 + num - 1);
        }
        return num.toString();
      
      case NumberFormat.RomanCapital:
        return HWPNumbering.toRoman(num, true);
      
      case NumberFormat.RomanSmall:
        return HWPNumbering.toRoman(num, false);
      
      case NumberFormat.LatinCapital:
        return HWPNumbering.toLatin(num, true);
      
      case NumberFormat.LatinSmall:
        return HWPNumbering.toLatin(num, false);
      
      case NumberFormat.HangulSyllable:
        return HWPNumbering.toHangulSyllable(num);
      
      case NumberFormat.HangulJamo:
        return HWPNumbering.toHangulJamo(num);
      
      case NumberFormat.HangulPhonetic:
        return HWPNumbering.toHangulPhonetic(num);
      
      default:
        return num.toString();
    }
  }

  private static toRoman(num: number, uppercase: boolean): string {
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    
    let result = '';
    for (let i = 0; i < values.length; i++) {
      while (num >= values[i]) {
        result += symbols[i];
        num -= values[i];
      }
    }
    
    return uppercase ? result : result.toLowerCase();
  }

  private static toLatin(num: number, uppercase: boolean): string {
    let result = '';
    num -= 1; // 0-based
    
    while (num >= 0) {
      result = String.fromCharCode((uppercase ? 65 : 97) + (num % 26)) + result;
      num = Math.floor(num / 26) - 1;
    }
    
    return result;
  }

  private static toHangulSyllable(num: number): string {
    const hangul = ['가', '나', '다', '라', '마', '바', '사', '아', '자', '차', '카', '타', '파', '하'];
    if (num >= 1 && num <= hangul.length) {
      return hangul[num - 1];
    }
    return num.toString();
  }

  private static toHangulJamo(num: number): string {
    const jamo = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    if (num >= 1 && num <= jamo.length) {
      return jamo[num - 1];
    }
    return num.toString();
  }

  private static toHangulPhonetic(num: number): string {
    const phonetic = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
    if (num >= 1 && num <= phonetic.length) {
      return phonetic[num - 1];
    }
    return num.toString();
  }
}

export default HWPNumbering;