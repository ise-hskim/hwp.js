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
import TableControl from '../models/controls/table'

/**
 * Parser for HWPTAG_TABLE records
 */
export class TableParser extends BaseRecordParser<TableControl> {
  getRecordType(): SectionTagID {
    return SectionTagID.HWPTAG_TABLE
  }

  parse(record: HWPRecord): TableControl {
    const reader = new ByteReader(record.payload)
    const table = new TableControl()

    // Parse 표 개체 속성 (표 75)
    // Note: 개체 공통 속성은 CTRL_HEADER에서 처리되므로 
    // TABLE 레코드는 표 속성만 포함합니다
    table.tableAttribute = reader.readUInt32()
    table.rowCount = reader.readUInt16()
    table.columnCount = reader.readUInt16()

    // Cell spacing and inner margins
    table.cellSpacing = reader.readUInt16()
    table.leftMargin = reader.readUInt16()
    table.rightMargin = reader.readUInt16()
    table.topMargin = reader.readUInt16()
    table.bottomMargin = reader.readUInt16()

    // Parse row heights
    // NOTE: rowHeights 값이 실제 HWPUNIT이 아닌 다른 단위로 저장되어 있을 수 있음
    // 경험적으로 100을 곱해야 올바른 HWPUNIT 값이 됨
    const rowHeights: number[] = []
    for (let i = 0; i < table.rowCount; i++) {
      const rawHeight = reader.readUInt16()
      // 100을 곱하여 HWPUNIT으로 변환 (경험적 값)
      rowHeights.push(rawHeight * 100)
    }
    table.rowHeights = rowHeights

    // Border fill ID
    table.borderFillID = reader.readUInt16()

    // Parse zone info if present
    if (!reader.isEOF()) {
      const zoneCount = reader.readUInt16()
      const zones: any[] = []
      
      for (let i = 0; i < zoneCount; i++) {
        zones.push({
          startCol: reader.readUInt16(),
          startRow: reader.readUInt16(),
          endCol: reader.readUInt16(),
          endRow: reader.readUInt16(),
          borderFillId: reader.readUInt16()
        })
      }
      
      table.zones = zones
    }

    return table
  }

  validate(table: TableControl): boolean {
    if (!table) {
      return false
    }

    // Validate row and column counts
    if (table.rowCount <= 0 || table.columnCount <= 0) {
      return false
    }

    // Validate row heights array
    if (!Array.isArray(table.rowHeights) || 
        table.rowHeights.length !== table.rowCount) {
      return false
    }

    // Validate margins are non-negative
    if (table.leftMargin < 0 || table.rightMargin < 0 ||
        table.topMargin < 0 || table.bottomMargin < 0) {
      return false
    }

    // Validate zones if present
    if (table.zones) {
      for (const zone of table.zones) {
        if (zone.startCol >= table.columnCount ||
            zone.endCol >= table.columnCount ||
            zone.startRow >= table.rowCount ||
            zone.endRow >= table.rowCount ||
            zone.startCol > zone.endCol ||
            zone.startRow > zone.endRow) {
          return false
        }
      }
    }

    return true
  }
}