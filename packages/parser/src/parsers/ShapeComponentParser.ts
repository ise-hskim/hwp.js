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
import ShapeControl from '../models/controls/shapes/shape'
import { CommonCtrlID } from '../constants/ctrlID'

export interface ShapeComponentData {
  ctrlId: number
  xPos: number
  yPos: number
  groupLevel: number
  width: number
  height: number
  property: number
  rotateAngle: number
  rotateXCenter: number
  rotateYCenter: number
}

/**
 * Parser for HWPTAG_SHAPE_COMPONENT records
 */
export class ShapeComponentParser extends BaseRecordParser<ShapeComponentData> {
  getRecordType(): SectionTagID {
    return SectionTagID.HWPTAG_SHAPE_COMPONENT
  }

  parse(record: HWPRecord): ShapeComponentData {
    const reader = new ByteReader(record.payload)
    
    const shapeData: ShapeComponentData = {
      ctrlId: reader.readUInt32(),
      xPos: reader.readInt32(),
      yPos: reader.readInt32(),
      groupLevel: reader.readUInt16(),
      width: reader.readInt32(),
      height: reader.readInt32(),
      property: reader.readUInt16(),
      rotateAngle: reader.readInt16(),
      rotateXCenter: reader.readInt32(),
      rotateYCenter: reader.readInt32()
    }

    // Skip local file version
    reader.readUInt16()

    // Process child records to determine shape type
    const childrenReader = new RecordReader(record.children)
    
    while (childrenReader.hasNext()) {
      const childRecord = childrenReader.read()
      
      // Handle specific shape types
      switch (childRecord.tagID) {
        case SectionTagID.HWPTAG_SHAPE_COMPONENT_PICTURE:
          this.parsePictureComponent(childRecord, shapeData)
          break
        
        case SectionTagID.HWPTAG_LIST_HEADER:
          // Shape with text content
          break
        
        // Add more shape types as needed
        default:
          break
      }
    }

    return shapeData
  }

  private parsePictureComponent(record: HWPRecord, shapeData: ShapeComponentData): void {
    const reader = new ByteReader(record.payload)
    
    // Skip to bin data ID
    reader.skipByte((4 * 17) + 3)
    
    // Update ctrl ID to indicate picture type
    shapeData.ctrlId = CommonCtrlID.Picture
    
    // Store bin ID in shape data (would need to extend interface for full implementation)
    const binID = reader.readUInt16() - 1
    
    // In a complete implementation, we'd store this binID somewhere
  }

  validate(data: ShapeComponentData): boolean {
    if (!data) {
      return false
    }

    // Validate dimensions
    if (data.width < 0 || data.height < 0) {
      return false
    }

    // Validate rotation angle (-360 to 360 degrees)
    if (data.rotateAngle < -360 || data.rotateAngle > 360) {
      return false
    }

    // Validate group level
    if (data.groupLevel < 0) {
      return false
    }

    return true
  }
}