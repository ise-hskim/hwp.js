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

import { SectionTagID } from './constants/tagID'
import Section from './models/section'
import Paragraph from './models/paragraph'
import HWPRecord from './models/record'
import ByteReader from './utils/byteReader'
import RecordReader from './utils/recordReader'
import parseRecord from './parseRecord'
import { RecordParserFactory } from './parsers/RecordParserFactory'
import { PageDefinition } from './parsers/PageDefParser'
import ParagraphList from './models/paragraphList'
import { TableColumnOption } from './models/controls/table'

/**
 * Refactored Section Parser using the new parser architecture
 */
class SectionParserV2 {
  private record: HWPRecord
  private parserFactory: RecordParserFactory
  private result: Section

  constructor(data: Uint8Array) {
    this.record = parseRecord(data)
    this.parserFactory = RecordParserFactory.getInstance()
    this.result = new Section()
  }

  /**
   * Parse the section and return the result
   */
  parse(): Section {
    this.processSection(this.record)
    return this.result
  }

  /**
   * Process the entire section
   * V1 compatible: treats all top-level records as paragraph headers
   */
  private processSection(record: HWPRecord): void {
    const reader = new RecordReader(record.children)
    const content: Paragraph[] = []

    while (reader.hasNext()) {
      const childRecord = reader.read()
      
      // Debug: log all top-level records
      // console.log(`Top-level record: ${childRecord.tagID} (${SectionTagID[childRecord.tagID]})`)
      
      // V1 behavior: process all records through visitParagraphHeader
      // Pass reader for sequential reading support
      this.processParagraphHeaderV1Style(childRecord, content, reader)
    }

    this.result.content = content
  }

  /**
   * Process paragraph header in V1 style
   * This mimics V1's visitParagraphHeader behavior
   */
  private processParagraphHeaderV1Style(record: HWPRecord, content: Paragraph[], reader?: RecordReader, control?: any): void {
    // Handle PAGE_DEF at top level (like V1)
    if (record.tagID === SectionTagID.HWPTAG_PAGE_DEF) {
      this.processPageDef(record)
      return
    }
    
    // Only process as paragraph if it's actually a paragraph header
    if (record.tagID !== SectionTagID.HWPTAG_PARA_HEADER) {
      return
    }
    
    const result = new Paragraph()
    
    // Read paragraph header data
    const byteReader = new ByteReader(record.payload)
    
    // V1 skips 8 bytes
    byteReader.skipByte(8)
    result.shapeIndex = byteReader.readUInt16()

    // Process children through the routing system
    const childrenReader = new RecordReader(record.children)
    
    while (childrenReader.hasNext()) {
      const childRecord = childrenReader.read()
      this.routeRecord(childRecord, result, childrenReader, control)
    }

    // Only add to content if this was actually a paragraph
    if (record.tagID === SectionTagID.HWPTAG_PARA_HEADER) {
      content.push(result)
    }
  }

  /**
   * Route records based on their tag ID (V1 style)
   */
  private routeRecord(record: HWPRecord, paragraph: Paragraph, reader: RecordReader, control?: any): void {
    switch (record.tagID) {
      case SectionTagID.HWPTAG_PAGE_DEF:
        this.processPageDef(record)
        break

      case SectionTagID.HWPTAG_PARA_TEXT:
        const textParser = this.parserFactory.getParser(SectionTagID.HWPTAG_PARA_TEXT)
        if (textParser) {
          try {
            const textData = textParser.parse(record) as any
            paragraph.content = textData.content
            paragraph.textSize = textData.textSize
          } catch (error) {
            console.warn('Failed to parse PARA_TEXT:', error)
          }
        }
        break

      case SectionTagID.HWPTAG_PARA_CHAR_SHAPE:
        const charShapeParser = this.parserFactory.getParser(SectionTagID.HWPTAG_PARA_CHAR_SHAPE)
        if (charShapeParser) {
          try {
            const shapes = charShapeParser.parse(record)
            paragraph.shapeBuffer = shapes as any
          } catch (error) {
            console.warn('Failed to parse PARA_CHAR_SHAPE:', error)
          }
        }
        break

      case SectionTagID.HWPTAG_PARA_LINE_SEG:
        const lineSegParser = this.parserFactory.getParser(SectionTagID.HWPTAG_PARA_LINE_SEG)
        if (lineSegParser) {
          try {
            const segments = lineSegParser.parse(record)
            paragraph.lineSegments = segments as any
          } catch (error) {
            console.warn('Failed to parse PARA_LINE_SEG:', error)
          }
        }
        break

      case SectionTagID.HWPTAG_CTRL_HEADER:
        const ctrlParser = this.parserFactory.getParser(SectionTagID.HWPTAG_CTRL_HEADER)
        if (ctrlParser) {
          try {
            const ctrl = ctrlParser.parse(record)
            
            // Debug: check control ID before adding
            // if (ctrl.id === 1952607264) {
            //   console.log('Before adding to paragraph - Table control ID:', ctrl.id)
            // }
            
            // }
            
            paragraph.controls.push(ctrl as any)
            
            // V1 compatibility: process child records of CTRL_HEADER
            const childrenReader = new RecordReader(record.children)
            while (childrenReader.hasNext()) {
              const childRecord = childrenReader.read()
              // Pass control as context for child processing
              this.routeRecord(childRecord, paragraph, childrenReader, ctrl)
            }
            
            // Debug: check control ID after processing
            // if (ctrl.id === 1952607264) {
            //   console.log('After processing - Table control ID:', ctrl.id)
            //   console.log('Control in paragraph:', paragraph.controls[paragraph.controls.length - 1].id)
            // }
          } catch (error) {
            console.warn('Failed to parse CTRL_HEADER:', error)
          }
        }
        break

      case SectionTagID.HWPTAG_LIST_HEADER:
        // Handle LIST_HEADER with control context - V1 style implementation
        if (control && control.id === 1952607264) { // 'tbl ' - table control
          this.processTableListHeader(record, paragraph, reader, control as any)
        } else if (control) {
          // Handle other LIST_HEADER cases (shapes, etc.)
          const listParser = this.parserFactory.getParser(SectionTagID.HWPTAG_LIST_HEADER)
          if (listParser) {
            try {
              const listData = listParser.parse(record)
            } catch (error) {
              console.warn('Failed to parse LIST_HEADER:', error)
            }
          }
        }
        break

      case SectionTagID.HWPTAG_TABLE:
        // V1 compatibility: process TABLE record for table controls
        // console.log('Processing HWPTAG_TABLE, control:', control?.id)
        if (control && control.id === 1952607264) { // 'tbl '
          const tableParser = this.parserFactory.getParser(SectionTagID.HWPTAG_TABLE)
          if (tableParser) {
            try {
              // console.log('Before parsing table data, control ID:', control.id)
              const tableData = tableParser.parse(record)
              
              // DO NOT use Object.assign! It overwrites the ID
              // Copy only table-specific properties
              control.tableAttribute = tableData.tableAttribute
              control.rowCount = tableData.rowCount
              control.columnCount = tableData.columnCount
              control.borderFillID = tableData.borderFillID
              control.content = tableData.content || []
              
              if ('cellSpacing' in tableData) control.cellSpacing = tableData.cellSpacing
              if ('leftMargin' in tableData) control.leftMargin = tableData.leftMargin
              if ('rightMargin' in tableData) control.rightMargin = tableData.rightMargin
              if ('topMargin' in tableData) control.topMargin = tableData.topMargin
              if ('bottomMargin' in tableData) control.bottomMargin = tableData.bottomMargin
              if ('rowHeights' in tableData) control.rowHeights = tableData.rowHeights
              if ('zones' in tableData) control.zones = tableData.zones
              
              // console.log('After merging table data, control ID:', control.id)
            } catch (error) {
              console.warn('Failed to parse TABLE:', error)
            }
          }
        }
        break

      default:
        // Skip unknown records
        break
    }
  }

  /**
   * Process page definition record
   */
  private processPageDef(record: HWPRecord): void {
    // console.log('processPageDef called with record:', record.tagID)
    const parser = this.parserFactory.getParser(SectionTagID.HWPTAG_PAGE_DEF)
    
    if (!parser) {
      console.warn('PageDefParser not found')
      return
    }

    try {
      const pageDef = parser.parseAndValidate(record) as PageDefinition
      // console.log('Parsed page definition:', pageDef)
      
      // Apply page definition to section
      this.result.width = pageDef.width
      this.result.height = pageDef.height
      this.result.paddingLeft = pageDef.paddingLeft
      this.result.paddingRight = pageDef.paddingRight
      this.result.paddingTop = pageDef.paddingTop
      this.result.paddingBottom = pageDef.paddingBottom
      this.result.headerPadding = pageDef.headerPadding
      this.result.footerPadding = pageDef.footerPadding
      this.result.gutterMargin = pageDef.gutterMargin  // 제본 여백 추가
      this.result.orientation = pageDef.orientation
      this.result.bookBindingMethod = pageDef.bookBindingMethod
      
      // console.log('Section result after page def:', { width: this.result.width, height: this.result.height })
    } catch (error) {
      console.error('Failed to parse page definition:', error)
    }
  }

  /**
   * Process LIST_HEADER for table cells - V1 compatible implementation
   */
  private processTableListHeader(record: HWPRecord, paragraph: Paragraph, recordReader: RecordReader, control: any): void {
    const reader = new ByteReader(record.payload)
    
    // Read paragraph count
    const paragraphCount = record.size === 30 ? reader.readInt16() : reader.readInt32()
    
    // Skip attribute
    reader.readUInt32()
    
    // Read cell list header info
    const column = reader.readUInt16()
    const row = reader.readUInt16()
    const colSpan = reader.readUInt16()
    const rowSpan = reader.readUInt16()
    const width = reader.readUInt32()
    const height = reader.readUInt32()
    const padding: [number, number, number, number] = [
      reader.readUInt16(),
      reader.readUInt16(),
      reader.readUInt16(),
      reader.readUInt16(),
    ]
    
    let borderFillID: number | undefined
    // NOTE: (@hahnlee) 문서에선 필수인데 없는 경우도 있다 리서치 필요
    if (!reader.isEOF()) {
      borderFillID = reader.readUInt16() - 1
    }
    
    // Create TableColumnOption
    const cellOption = {
      column,
      row,
      colSpan,
      rowSpan,
      width,
      height,
      padding,
      borderFillID
    }
    
    // Read paragraphs for this cell
    const items: Paragraph[] = []
    
    // In V1, the next N records are paragraph headers for this cell
    // Read them from the recordReader
    for (let i = 0; i < paragraphCount; i++) {
      if (recordReader.hasNext()) {
        const nextRecord = recordReader.read()
        // Process this as a paragraph header for the cell
        this.processParagraphHeaderV1Style(nextRecord, items, recordReader, control)
      }
    }
    
    // Create a ParagraphList with the cell options
    const paragraphList = new ParagraphList(cellOption, items)
    
    // Add to table content using addRow method
    if (!control.addRow) {
      // If addRow method doesn't exist, create content array manually
      if (!control.content) {
        control.content = []
      }
      if (!control.content[row]) {
        control.content[row] = []
      }
      control.content[row].push(paragraphList)
    } else {
      control.addRow(row, paragraphList)
    }
  }

  /**
   * Process paragraph record
   */
  private processParagraph(record: HWPRecord): Paragraph | null {
    const parser = this.parserFactory.getParser(SectionTagID.HWPTAG_PARA_HEADER)
    
    if (!parser) {
      console.warn('ParagraphHeaderParser not found')
      return null
    }

    try {
      return parser.parseAndValidate(record) as Paragraph
    } catch (error) {
      console.error('Failed to parse paragraph:', error)
      return null
    }
  }
}

export default SectionParserV2