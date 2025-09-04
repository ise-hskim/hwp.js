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
import { CommonCtrlID, OtherCtrlID } from '../constants/ctrlID'
import HWPRecord from '../models/record'
import ByteReader from '../utils/byteReader'
import RecordReader from '../utils/recordReader'
import { Control } from '../models/controls'
import CommonControl from '../models/controls/common'
import TableControl from '../models/controls/table'
import ShapeControl from '../models/controls/shapes/shape'
import ColumnControl from '../models/controls/column'
import { getBitValue, getFlag } from '../utils/bitUtils'

/**
 * Parser for HWPTAG_CTRL_HEADER records
 */
export class ControlHeaderParser extends BaseRecordParser<Control> {
  private childParsers: Map<SectionTagID, BaseRecordParser<any>>

  constructor(childParsers: Map<SectionTagID, BaseRecordParser<any>>) {
    super()
    this.childParsers = childParsers
  }

  getRecordType(): SectionTagID {
    return SectionTagID.HWPTAG_CTRL_HEADER
  }

  parse(record: HWPRecord): Control {
    const reader = new ByteReader(record.payload)
    const ctrlID = reader.readUInt32()

    // Create appropriate control based on ID
    const control = this.createControl(ctrlID, reader)

    // Debug: verify control ID after creation
    if (ctrlID === CommonCtrlID.Table) {
      console.log(`After creation - Table control ID: ${control.id}, expected: ${CommonCtrlID.Table}`)
    }

    // Process child records
    const childrenReader = new RecordReader(record.children)
    while (childrenReader.hasNext()) {
      const childRecord = childrenReader.read()
      this.processChildRecord(childRecord, control)
    }

    // Debug: verify control ID after processing children
    if (ctrlID === CommonCtrlID.Table) {
      console.log(`After processing children - Table control ID: ${control.id}`)
    }

    return control
  }

  private createControl(ctrlID: number, reader: ByteReader): Control {
    // Debug: log control ID
    if (ctrlID === CommonCtrlID.Table) {
      console.log(`Creating Table Control: ctrlID=${ctrlID}, Table=${CommonCtrlID.Table}`);
    }
    
    switch (ctrlID) {
      case CommonCtrlID.Table:
        return this.parseTableControl(reader)
      
      case CommonCtrlID.GenShapeObject:
        return this.parseShapeControl(ctrlID, reader)
      
      case OtherCtrlID.Column:
        return this.parseColumnControl(ctrlID, reader)
      
      default:
        // Debug unknown control
        const chars = [
          String.fromCharCode((ctrlID >> 24) & 0xFF),
          String.fromCharCode((ctrlID >> 16) & 0xFF),
          String.fromCharCode((ctrlID >> 8) & 0xFF),
          String.fromCharCode(ctrlID & 0xFF)
        ];
        console.log(`Unknown control ID: ${ctrlID} => "${chars.join('')}"`);
        return { id: ctrlID }
    }
  }

  private parseTableControl(reader: ByteReader): TableControl {
    const tableControl = new TableControl()
    this.parseCommonAttributes(reader, tableControl)
    // Set ID after parsing attributes to ensure it's not overwritten
    tableControl.id = CommonCtrlID.Table
    return tableControl
  }

  private parseShapeControl(ctrlID: number, reader: ByteReader): ShapeControl {
    const shape = new ShapeControl()
    shape.id = ctrlID
    this.parseCommonAttributes(reader, shape)
    return shape
  }

  private parseColumnControl(ctrlID: number, reader: ByteReader): ColumnControl {
    const column = new ColumnControl()
    column.id = ctrlID

    const attribute = reader.readUInt16()
    column.type = getBitValue(attribute, 0, 1)
    column.count = getBitValue(attribute, 2, 9)
    column.direction = getBitValue(attribute, 10, 11)
    column.isSameWidth = getFlag(attribute, 12)
    column.gap = reader.readUInt16()

    if (!column.isSameWidth) {
      const widths: number[] = []
      for (let i = 0; i < column.count; i += 1) {
        widths.push(reader.readUInt16())
      }
      column.widths = widths
    }

    reader.readUInt16() // Skip unknown field

    column.borderStyle = reader.readUInt8()
    column.borderWidth = reader.readUInt8()
    column.borderColor = reader.readUInt32()

    return column
  }

  private parseCommonAttributes(reader: ByteReader, control: CommonControl): void {
    const attribute = reader.readUInt32()

    control.attribute.isTextLike = getFlag(attribute, 0)
    control.attribute.isApplyLineSpace = getFlag(attribute, 2)
    control.attribute.vertRelTo = getBitValue(attribute, 3, 4)
    control.attribute.vertRelativeArrange = getBitValue(attribute, 5, 7)
    control.attribute.horzRelTo = getBitValue(attribute, 8, 9)
    control.attribute.horzRelativeArrange = getBitValue(attribute, 10, 12)
    control.attribute.isVertRelToParaLimit = getFlag(attribute, 13)
    control.attribute.isAllowOverlap = getFlag(attribute, 14)
    control.attribute.widthCriterion = getBitValue(attribute, 15, 17)
    control.attribute.heightCriterion = getBitValue(attribute, 18, 19)
    control.attribute.isProtectSize = getFlag(attribute, 20)
    control.attribute.textFlowMethod = getBitValue(attribute, 21, 23)
    control.attribute.textHorzArrange = getBitValue(attribute, 24, 25)
    control.attribute.objectType = getBitValue(attribute, 26, 28)

    control.verticalOffset = reader.readUInt32()
    control.horizontalOffset = reader.readUInt32()
    control.width = reader.readUInt32()
    control.height = reader.readUInt32()
    control.zIndex = reader.readUInt32()
    
    control.margin = [
      reader.readInt16(),
      reader.readInt16(),
      reader.readInt16(),
      reader.readInt16(),
    ]
    
    control.uid = reader.readUInt32()
    control.split = reader.readInt32()
  }

  private processChildRecord(record: HWPRecord, control: Control): void {
    const parser = this.childParsers.get(record.tagID)
    
    if (parser) {
      try {
        const childData = parser.parse(record)
        
        // Apply child data to control based on record type
        switch (record.tagID) {
          case SectionTagID.HWPTAG_TABLE:
            if (control instanceof TableControl && childData) {
              // Copy table-specific properties from TABLE record
              // Note: width/height are already set from CTRL_HEADER common attributes
              control.tableAttribute = childData.tableAttribute
              control.rowCount = childData.rowCount
              control.columnCount = childData.columnCount
              control.borderFillID = childData.borderFillID
              control.content = childData.content || []
              control.cellSpacing = childData.cellSpacing
              control.leftMargin = childData.leftMargin
              control.rightMargin = childData.rightMargin
              control.topMargin = childData.topMargin
              control.bottomMargin = childData.bottomMargin
              control.rowHeights = childData.rowHeights
              if ('zones' in childData) control.zones = childData.zones
            }
            break
          
          case SectionTagID.HWPTAG_LIST_HEADER:
            // Handle list header for table cells
            if (control instanceof TableControl) {
              // This will be handled by a separate ListHeaderParser
            }
            break
          
          case SectionTagID.HWPTAG_SHAPE_COMPONENT:
            if (control instanceof ShapeControl) {
              // Handle shape component
            }
            break
        }
      } catch (error) {
        console.warn(`Failed to parse child record ${record.tagID}:`, error)
      }
    }
  }

  validate(control: Control): boolean {
    if (!control || control.id === undefined || control.id === null) {
      return false
    }

    // Validate common controls
    if (control instanceof CommonControl) {
      // Validate dimensions
      if (control.width < 0 || control.height < 0) {
        return false
      }

      // Validate margins
      if (!Array.isArray(control.margin) || control.margin.length !== 4) {
        return false
      }
    }

    // Table-specific validation
    if (control instanceof TableControl) {
      // Additional table validation is done in TableParser
    }

    return true
  }
}