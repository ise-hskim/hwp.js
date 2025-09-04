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

import Numbering, { NumberFormat } from '../models/numbering'

describe('Numbering', () => {
  it('should format numbers correctly', () => {
    // 아라비아 숫자
    expect(Numbering.formatNumber(1, NumberFormat.Digit)).toBe('1')
    expect(Numbering.formatNumber(10, NumberFormat.Digit)).toBe('10')
    
    // 원문자
    expect(Numbering.formatNumber(1, NumberFormat.CircledDigit)).toBe('①')
    expect(Numbering.formatNumber(10, NumberFormat.CircledDigit)).toBe('⑩')
    
    // 로마 숫자 (대문자)
    expect(Numbering.formatNumber(1, NumberFormat.RomanCapital)).toBe('I')
    expect(Numbering.formatNumber(4, NumberFormat.RomanCapital)).toBe('IV')
    expect(Numbering.formatNumber(9, NumberFormat.RomanCapital)).toBe('IX')
    expect(Numbering.formatNumber(10, NumberFormat.RomanCapital)).toBe('X')
    
    // 로마 숫자 (소문자)
    expect(Numbering.formatNumber(5, NumberFormat.RomanSmall)).toBe('v')
    
    // 알파벳 (대문자)
    expect(Numbering.formatNumber(1, NumberFormat.LatinCapital)).toBe('A')
    expect(Numbering.formatNumber(26, NumberFormat.LatinCapital)).toBe('Z')
    expect(Numbering.formatNumber(27, NumberFormat.LatinCapital)).toBe('AA')
    
    // 알파벳 (소문자)
    expect(Numbering.formatNumber(1, NumberFormat.LatinSmall)).toBe('a')
    expect(Numbering.formatNumber(26, NumberFormat.LatinSmall)).toBe('z')
    
    // 한글 가나다
    expect(Numbering.formatNumber(1, NumberFormat.HangulSyllable)).toBe('가')
    expect(Numbering.formatNumber(2, NumberFormat.HangulSyllable)).toBe('나')
    expect(Numbering.formatNumber(3, NumberFormat.HangulSyllable)).toBe('다')
    
    // 한글 자음
    expect(Numbering.formatNumber(1, NumberFormat.HangulJamo)).toBe('ㄱ')
    expect(Numbering.formatNumber(2, NumberFormat.HangulJamo)).toBe('ㄴ')
    expect(Numbering.formatNumber(3, NumberFormat.HangulJamo)).toBe('ㄷ')
    
    // 한글 갑을병
    expect(Numbering.formatNumber(1, NumberFormat.HangulPhonetic)).toBe('갑')
    expect(Numbering.formatNumber(2, NumberFormat.HangulPhonetic)).toBe('을')
    expect(Numbering.formatNumber(3, NumberFormat.HangulPhonetic)).toBe('병')
  })

  it('should create numbering with levels', () => {
    const numbering = new Numbering(0)
    
    numbering.addLevel({
      numberFormat: NumberFormat.Digit,
      prefix: '',
      suffix: '.',
      startNumber: 1,
      charShapeId: 0,
      indentSize: 0,
      spacing: 0,
    })
    
    numbering.addLevel({
      numberFormat: NumberFormat.LatinSmall,
      prefix: '(',
      suffix: ')',
      startNumber: 1,
      charShapeId: 0,
      indentSize: 400,
      spacing: 0,
    })
    
    expect(numbering.levels.length).toBe(2)
    expect(numbering.getLevel(0)?.numberFormat).toBe(NumberFormat.Digit)
    expect(numbering.getLevel(1)?.prefix).toBe('(')
    expect(numbering.getLevel(1)?.suffix).toBe(')')
  })
})