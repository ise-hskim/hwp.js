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
import RecordReader from '../utils/recordReader'
import ParagraphList from '../models/paragraphList'
import Paragraph from '../models/paragraph'
import { TableColumnOption } from '../models/controls/table'

export interface ListHeaderData {
  paragraphList: ParagraphList
  cellOption?: TableColumnOption
}

/**
 * Parser for HWPTAG_LIST_HEADER records
 */
export class ListHeaderParser extends BaseRecordParser<ListHeaderData> {
  private childParsers: Map<SectionTagID, BaseRecordParser<any>>

  constructor(childParsers: Map<SectionTagID, BaseRecordParser<any>>) {
    super()
    this.childParsers = childParsers
  }

  getRecordType(): SectionTagID {
    return SectionTagID.HWPTAG_LIST_HEADER
  }

  parse(record: HWPRecord): ListHeaderData {
    const byteReader = new ByteReader(record.payload)
    
    // Parse paragraph count
    const paragraphs = record.size === 30 ? byteReader.readInt16() : byteReader.readInt32()
    
    // Skip attribute field
    byteReader.readUInt32()

    // Parse paragraphs
    const items: Paragraph[] = []
    const childrenReader = new RecordReader(record.children)
    
    for (let i = 0; i < paragraphs; i += 1) {
      if (!childrenReader.hasNext()) {
        throw new Error(`Expected ${paragraphs} paragraphs but found ${i}`)
      }
      
      const paragraphRecord = childrenReader.read()
      const paragraphParser = this.childParsers.get(paragraphRecord.tagID)
      
      if (paragraphParser && paragraphRecord.tagID === SectionTagID.HWPTAG_PARA_HEADER) {
        const paragraph = paragraphParser.parse(paragraphRecord)
        items.push(paragraph)
      }
    }

    // Check if this is a table cell (has cell options)
    let cellOption: TableColumnOption | undefined
    
    if (record.parentTagID === SectionTagID.HWPTAG_CTRL_HEADER && !byteReader.isEOF()) {
      cellOption = this.parseCellOptions(byteReader)
    }

    const paragraphList = new ParagraphList(cellOption || null, items)
    
    return {
      paragraphList,
      cellOption
    }
  }

  private parseCellOptions(reader: ByteReader): TableColumnOption {
    const option: TableColumnOption = {
      column: reader.readUInt16(),
      row: reader.readUInt16(),
      colSpan: reader.readUInt16(),
      rowSpan: reader.readUInt16(),
      width: reader.readUInt32(),
      height: reader.readUInt32(),
      padding: [
        reader.readUInt16(),
        reader.readUInt16(),
        reader.readUInt16(),
        reader.readUInt16(),
      ],
    }

    // Border fill ID is optional
    if (!reader.isEOF()) {
      option.borderFillID = reader.readUInt16() - 1
    }

    return option
  }

  validate(data: ListHeaderData): boolean {
    if (!data || !data.paragraphList) {
      return false
    }

    // Validate paragraph list
    if (!data.paragraphList.items || !Array.isArray(data.paragraphList.items)) {
      return false
    }

    // Validate cell options if present
    if (data.cellOption) {
      const opt = data.cellOption
      
      // Validate cell position
      if (opt.column < 0 || opt.row < 0) {
        return false
      }

      // Validate spans
      if (opt.colSpan < 1 || opt.rowSpan < 1) {
        return false
      }

      // Validate dimensions
      if (opt.width < 0 || opt.height < 0) {
        return false
      }

      // Validate padding
      if (!Array.isArray(opt.padding) || opt.padding.length !== 4) {
        return false
      }
      
      for (const pad of opt.padding) {
        if (pad < 0) {
          return false
        }
      }
    }

    return true
  }
}