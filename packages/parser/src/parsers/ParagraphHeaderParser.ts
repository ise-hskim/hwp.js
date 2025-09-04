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
import Paragraph from '../models/paragraph'
import ByteReader from '../utils/byteReader'
import RecordReader from '../utils/recordReader'
import { getBitValue, getFlag } from '../utils/bitUtils'

/**
 * Parser for HWPTAG_PARA_HEADER records
 */
export class ParagraphHeaderParser extends BaseRecordParser<Paragraph> {
  private childParsers: Map<SectionTagID, BaseRecordParser<any>>

  constructor(childParsers: Map<SectionTagID, BaseRecordParser<any>>) {
    super()
    this.childParsers = childParsers
  }

  getRecordType(): SectionTagID {
    return SectionTagID.HWPTAG_PARA_HEADER
  }

  parse(record: HWPRecord): Paragraph {
    const paragraph = new Paragraph()
    const reader = new ByteReader(record.payload)

    // Parse paragraph header fields
    const text = reader.readUInt32()
    const controlMask = reader.readUInt32()
    
    paragraph.shapeIndex = reader.readUInt16()
    paragraph.styleId = reader.readUInt8()
    paragraph.divideSort = reader.readUInt8()
    paragraph.charShapeCount = reader.readUInt16()
    paragraph.rangeTagCount = reader.readUInt16()
    paragraph.lineAlignCount = reader.readUInt16()

    // Parse instance ID if present
    if (getFlag(text, 3)) {
      paragraph.instanceId = reader.readUInt32()
    }

    // Parse change tracking merge if present (5.0.3.2+)
    if (getFlag(text, 7) && !reader.isEOF()) {
      paragraph.changeTrackingMerge = reader.readUInt16()
    }

    // Process child records
    this.processChildRecords(record, paragraph)

    return paragraph
  }

  private processChildRecords(record: HWPRecord, paragraph: Paragraph): void {
    const childrenReader = new RecordReader(record.children)

    while (childrenReader.hasNext()) {
      const childRecord = childrenReader.read()
      const parser = this.childParsers.get(childRecord.tagID)

      if (parser) {
        try {
          // Handle different child record types
          switch (childRecord.tagID) {
            case SectionTagID.HWPTAG_PARA_TEXT:
              this.handleParaText(childRecord, paragraph, parser)
              break
            case SectionTagID.HWPTAG_PARA_CHAR_SHAPE:
              this.handleCharShape(childRecord, paragraph, parser)
              break
            case SectionTagID.HWPTAG_PARA_LINE_SEG:
              this.handleLineSeg(childRecord, paragraph, parser)
              break
            case SectionTagID.HWPTAG_CTRL_HEADER:
              this.handleControl(childRecord, paragraph, parser)
              break
            default:
              // Unknown child record, skip
              break
          }
        } catch (error) {
          console.warn(`Failed to parse child record ${childRecord.tagID}:`, error)
        }
      }
    }
  }

  private handleParaText(record: HWPRecord, paragraph: Paragraph, parser: BaseRecordParser<any>): void {
    const textData = parser.parse(record)
    paragraph.content = textData.content
    paragraph.textSize = textData.textSize
  }

  private handleCharShape(record: HWPRecord, paragraph: Paragraph, parser: BaseRecordParser<any>): void {
    const charShapes = parser.parse(record)
    paragraph.shapeBuffer = charShapes
  }

  private handleLineSeg(record: HWPRecord, paragraph: Paragraph, parser: BaseRecordParser<any>): void {
    const lineSegments = parser.parse(record)
    paragraph.lineSegments = lineSegments
  }

  private handleControl(record: HWPRecord, paragraph: Paragraph, parser: BaseRecordParser<any>): void {
    const control = parser.parse(record)
    paragraph.controls.push(control)
  }

  validate(paragraph: Paragraph): boolean {
    // Basic validation
    if (!paragraph) {
      return false
    }

    // Validate required fields
    if (paragraph.shapeIndex === undefined || paragraph.shapeIndex === null) {
      return false
    }

    // Validate counts match actual data
    if (paragraph.charShapeCount !== undefined && 
        paragraph.shapeBuffer.length !== paragraph.charShapeCount) {
      return false
    }

    return true
  }
}