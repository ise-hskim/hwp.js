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
import ShapePointer from '../models/shapePointer'

/**
 * Parser for HWPTAG_PARA_CHAR_SHAPE records
 */
export class CharShapeParser extends BaseRecordParser<ShapePointer[]> {
  getRecordType(): SectionTagID {
    return SectionTagID.HWPTAG_PARA_CHAR_SHAPE
  }

  parse(record: HWPRecord): ShapePointer[] {
    const reader = new ByteReader(record.payload)
    const shapePointers: ShapePointer[] = []

    while (!reader.isEOF()) {
      const position = reader.readUInt32()
      const shapeId = reader.readUInt32()
      
      shapePointers.push(new ShapePointer(position, shapeId))
    }

    return shapePointers
  }

  validate(data: ShapePointer[]): boolean {
    if (!Array.isArray(data)) {
      return false
    }

    // Validate each shape pointer
    for (let i = 0; i < data.length; i++) {
      const pointer = data[i]
      
      if (!pointer || !(pointer instanceof ShapePointer)) {
        return false
      }

      // Position should be in ascending order
      if (i > 0 && pointer.pos <= data[i - 1].pos) {
        return false
      }

      // Shape index should be valid (non-negative)
      if (pointer.shapeIndex < 0) {
        return false
      }
    }

    return true
  }
}