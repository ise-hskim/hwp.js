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
import LineSegment from '../models/lineSegment'

/**
 * Parser for HWPTAG_PARA_LINE_SEG records
 */
export class LineSegmentParser extends BaseRecordParser<LineSegment[]> {
  getRecordType(): SectionTagID {
    return SectionTagID.HWPTAG_PARA_LINE_SEG
  }

  parse(record: HWPRecord): LineSegment[] {
    const reader = new ByteReader(record.payload)
    const lineSegments: LineSegment[] = []

    while (!reader.isEOF()) {
      const lineSegment = new LineSegment()

      lineSegment.start = reader.readUInt32()
      lineSegment.y = reader.readInt32()
      lineSegment.height = reader.readInt32()
      lineSegment.textHeight = reader.readInt32()
      lineSegment.baseLineGap = reader.readInt32()
      lineSegment.lineSpacing = reader.readInt32()
      lineSegment.startByte = reader.readInt32()
      lineSegment.width = reader.readInt32()
      reader.readUInt32() // Skip unknown field

      lineSegments.push(lineSegment)
    }

    return lineSegments
  }

  validate(data: LineSegment[]): boolean {
    if (!Array.isArray(data)) {
      return false
    }

    for (let i = 0; i < data.length; i++) {
      const segment = data[i]
      
      if (!segment || !(segment instanceof LineSegment)) {
        return false
      }

      // Validate segment properties
      if (segment.height <= 0 || segment.textHeight <= 0 || segment.width < 0) {
        return false
      }

      // Start positions should be in ascending order
      if (i > 0 && segment.start <= data[i - 1].start) {
        return false
      }
    }

    return true
  }
}