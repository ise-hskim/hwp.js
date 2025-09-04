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

import { BaseRecordParser } from '../../parsers/RecordParser'
import { SectionTagID } from '../../constants/tagID'
import HWPRecord from '../../models/record'

// Mock implementation for testing
class MockParser extends BaseRecordParser<string> {
  parse(record: HWPRecord): string {
    return 'parsed data'
  }

  validate(data: string): boolean {
    return data === 'parsed data'
  }

  getRecordType(): SectionTagID {
    return SectionTagID.HWPTAG_PARA_TEXT
  }
}

describe('RecordParser', () => {
  let parser: MockParser
  let mockRecord: HWPRecord

  beforeEach(() => {
    parser = new MockParser()
    mockRecord = new HWPRecord(
      SectionTagID.HWPTAG_PARA_TEXT,
      10,
      0,
      new Uint8Array(10).buffer
    )
  })

  describe('verifyRecordType', () => {
    it('should not throw error for matching record type', () => {
      expect(() => {
        parser.parseAndValidate(mockRecord)
      }).not.toThrow()
    })

    it('should throw error for mismatching record type', () => {
      mockRecord.tagID = SectionTagID.HWPTAG_PARA_HEADER
      
      expect(() => {
        parser.parseAndValidate(mockRecord)
      }).toThrow('Invalid record type')
    })
  })

  describe('parseAndValidate', () => {
    it('should parse and validate successfully', () => {
      const result = parser.parseAndValidate(mockRecord)
      expect(result).toBe('parsed data')
    })

    it('should throw error when validation fails', () => {
      // Override validate to return false
      parser.validate = jest.fn().mockReturnValue(false)
      
      expect(() => {
        parser.parseAndValidate(mockRecord)
      }).toThrow('Validation failed')
    })
  })
})