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

import { ParaTextParser } from '../../parsers/ParaTextParser'
import { SectionTagID } from '../../constants/tagID'
import HWPRecord from '../../models/record'
import { CharType } from '../../models/char'

describe('ParaTextParser', () => {
  let parser: ParaTextParser

  beforeEach(() => {
    parser = new ParaTextParser()
  })

  describe('getRecordType', () => {
    it('should return HWPTAG_PARA_TEXT', () => {
      expect(parser.getRecordType()).toBe(SectionTagID.HWPTAG_PARA_TEXT)
    })
  })

  describe('parse', () => {
    it('should parse regular text correctly', () => {
      // Create test data for "Hello"
      const testData = new ArrayBuffer(10)
      const view = new DataView(testData)
      view.setUint16(0, 72, true)  // 'H'
      view.setUint16(2, 101, true) // 'e'
      view.setUint16(4, 108, true) // 'l'
      view.setUint16(6, 108, true) // 'l'
      view.setUint16(8, 111, true) // 'o'

      const record = new HWPRecord(
        SectionTagID.HWPTAG_PARA_TEXT,
        10,
        0,
        testData
      )

      const result = parser.parse(record)

      expect(result.content).toHaveLength(5)
      expect(result.textSize).toBe(5)
      expect(result.content[0].type).toBe(CharType.Char)
      expect(result.content[0].value).toBe('H')
    })

    it('should parse special control characters correctly', () => {
      // Test with control character 0 (null)
      const testData = new ArrayBuffer(2)
      const view = new DataView(testData)
      view.setUint16(0, 0, true)

      const record = new HWPRecord(
        SectionTagID.HWPTAG_PARA_TEXT,
        2,
        0,
        testData
      )

      const result = parser.parse(record)

      expect(result.content).toHaveLength(1)
      expect(result.textSize).toBe(1)
      expect(result.content[0].type).toBe(CharType.Char)
      expect(result.content[0].value).toBe(0)
    })

    it('should parse inline characters correctly', () => {
      // Test with inline character code 4
      const testData = new ArrayBuffer(16)
      const view = new DataView(testData)
      view.setUint16(0, 4, true) // Inline character

      const record = new HWPRecord(
        SectionTagID.HWPTAG_PARA_TEXT,
        16,
        0,
        testData
      )

      const result = parser.parse(record)

      expect(result.content).toHaveLength(1)
      expect(result.textSize).toBe(8)
      expect(result.content[0].type).toBe(CharType.Inline)
      expect(result.content[0].value).toBe(4)
    })

    it('should parse extended characters correctly', () => {
      // Test with extended character code 1
      const testData = new ArrayBuffer(16)
      const view = new DataView(testData)
      view.setUint16(0, 1, true) // Extended character

      const record = new HWPRecord(
        SectionTagID.HWPTAG_PARA_TEXT,
        16,
        0,
        testData
      )

      const result = parser.parse(record)

      expect(result.content).toHaveLength(1)
      expect(result.textSize).toBe(8)
      expect(result.content[0].type).toBe(CharType.Extened)
      expect(result.content[0].value).toBe(1)
    })
  })

  describe('validate', () => {
    it('should return true for valid data', () => {
      const validData = {
        content: [{
          type: CharType.Char,
          value: 'a'
        }],
        textSize: 1
      }

      expect(parser.validate(validData)).toBe(true)
    })

    it('should return false for null data', () => {
      expect(parser.validate(null as any)).toBe(false)
    })

    it('should return false for invalid content array', () => {
      const invalidData = {
        content: null,
        textSize: 1
      }

      expect(parser.validate(invalidData as any)).toBe(false)
    })

    it('should return false for negative text size', () => {
      const invalidData = {
        content: [],
        textSize: -1
      }

      expect(parser.validate(invalidData)).toBe(false)
    })
  })
})