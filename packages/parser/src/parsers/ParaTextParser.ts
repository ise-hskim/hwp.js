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

import { BaseRecordParser } from './RecordParser'
import { SectionTagID } from '../constants/tagID'
import HWPRecord from '../models/record'
import ByteReader from '../utils/byteReader'
import HWPChar, { CharType } from '../models/char'

export interface ParaTextData {
  content: HWPChar[]
  textSize: number
}

/**
 * Parser for HWPTAG_PARA_TEXT records
 */
export class ParaTextParser extends BaseRecordParser<ParaTextData> {
  // Special character handlers mapped by character code
  private readonly charHandlers = new Map<number, (code: number) => { char: HWPChar, size: number, skip: number }>([
    // Char type (2 bytes)
    [0, (code) => ({ char: new HWPChar(CharType.Char, code), size: 1, skip: 2 })],
    [10, (code) => ({ char: new HWPChar(CharType.Char, code), size: 1, skip: 2 })],
    [13, (code) => ({ char: new HWPChar(CharType.Char, code), size: 1, skip: 2 })],
    
    // Inline type (16 bytes total)
    [4, (code) => ({ char: new HWPChar(CharType.Inline, code), size: 8, skip: 16 })],
    [5, (code) => ({ char: new HWPChar(CharType.Inline, code), size: 8, skip: 16 })],
    [6, (code) => ({ char: new HWPChar(CharType.Inline, code), size: 8, skip: 16 })],
    [7, (code) => ({ char: new HWPChar(CharType.Inline, code), size: 8, skip: 16 })],
    [8, (code) => ({ char: new HWPChar(CharType.Inline, code), size: 8, skip: 16 })],
    [9, (code) => ({ char: new HWPChar(CharType.Inline, code), size: 8, skip: 16 })],
    [19, (code) => ({ char: new HWPChar(CharType.Inline, code), size: 8, skip: 16 })],
    [20, (code) => ({ char: new HWPChar(CharType.Inline, code), size: 8, skip: 16 })],
    
    // Extended type (16 bytes total)
    [1, (code) => ({ char: new HWPChar(CharType.Extened, code), size: 8, skip: 16 })],
    [2, (code) => ({ char: new HWPChar(CharType.Extened, code), size: 8, skip: 16 })],
    [3, (code) => ({ char: new HWPChar(CharType.Extened, code), size: 8, skip: 16 })],
    [11, (code) => ({ char: new HWPChar(CharType.Extened, code), size: 8, skip: 16 })],
    [12, (code) => ({ char: new HWPChar(CharType.Extened, code), size: 8, skip: 16 })],
    [14, (code) => ({ char: new HWPChar(CharType.Extened, code), size: 8, skip: 16 })],
    [15, (code) => ({ char: new HWPChar(CharType.Extened, code), size: 8, skip: 16 })],
    [16, (code) => ({ char: new HWPChar(CharType.Extened, code), size: 8, skip: 16 })],
    [17, (code) => ({ char: new HWPChar(CharType.Extened, code), size: 8, skip: 16 })],
    [18, (code) => ({ char: new HWPChar(CharType.Extened, code), size: 8, skip: 16 })],
    [21, (code) => ({ char: new HWPChar(CharType.Extened, code), size: 8, skip: 16 })],
    [22, (code) => ({ char: new HWPChar(CharType.Extened, code), size: 8, skip: 16 })],
    [23, (code) => ({ char: new HWPChar(CharType.Extened, code), size: 8, skip: 16 })]
  ])

  getRecordType(): SectionTagID {
    return SectionTagID.HWPTAG_PARA_TEXT
  }

  parse(record: HWPRecord): ParaTextData {
    const reader = new ByteReader(record.payload)
    const content: HWPChar[] = []
    let textSize = 0
    let readByte = 0

    while (readByte < record.size) {
      const charCode = reader.readUInt16()
      const handler = this.charHandlers.get(charCode)

      if (handler) {
        const { char, size, skip } = handler(charCode)
        content.push(char)
        textSize += size
        
        // Skip additional bytes (already read 2 for charCode)
        if (skip > 2) {
          reader.skipByte(skip - 2)
        }
        readByte += skip
      } else {
        // Default: regular character
        content.push(new HWPChar(CharType.Char, String.fromCharCode(charCode)))
        textSize += 1
        readByte += 2
      }
    }

    return { content, textSize }
  }

  validate(data: ParaTextData): boolean {
    if (!data || !Array.isArray(data.content)) {
      return false
    }

    if (data.textSize < 0) {
      return false
    }

    // Validate each character
    for (const char of data.content) {
      if (!char || !Object.values(CharType).includes(char.type)) {
        return false
      }
    }

    return true
  }
}