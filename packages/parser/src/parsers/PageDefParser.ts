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
import { getBitValue } from '../utils/bitUtils'

export interface PageDefinition {
  width: number
  height: number
  paddingLeft: number
  paddingRight: number
  paddingTop: number
  paddingBottom: number
  headerPadding: number
  footerPadding: number
  orientation: number
  bookBindingMethod: number
}

/**
 * Parser for HWPTAG_PAGE_DEF records
 */
export class PageDefParser extends BaseRecordParser<PageDefinition> {
  getRecordType(): SectionTagID {
    return SectionTagID.HWPTAG_PAGE_DEF
  }

  parse(record: HWPRecord): PageDefinition {
    const reader = new ByteReader(record.payload)
    
    const pageDef: PageDefinition = {
      width: reader.readUInt32(),
      height: reader.readUInt32(),
      paddingLeft: reader.readUInt32(),
      paddingRight: reader.readUInt32(),
      paddingTop: reader.readUInt32(),
      paddingBottom: reader.readUInt32(),
      headerPadding: reader.readUInt32(),
      footerPadding: reader.readUInt32(),
      orientation: 0,
      bookBindingMethod: 0
    }

    const property = reader.readUInt32()
    pageDef.orientation = getBitValue(property, 0, 0)
    pageDef.bookBindingMethod = getBitValue(property, 1, 2)

    return pageDef
  }

  validate(data: PageDefinition): boolean {
    if (!data) {
      return false
    }

    // Validate dimensions
    if (data.width <= 0 || data.height <= 0) {
      return false
    }

    // Validate paddings are non-negative
    if (data.paddingLeft < 0 || data.paddingRight < 0 ||
        data.paddingTop < 0 || data.paddingBottom < 0 ||
        data.headerPadding < 0 || data.footerPadding < 0) {
      return false
    }

    // Validate orientation (0: portrait, 1: landscape)
    if (data.orientation !== 0 && data.orientation !== 1) {
      return false
    }

    // Validate book binding method (0-3)
    if (data.bookBindingMethod < 0 || data.bookBindingMethod > 3) {
      return false
    }

    // Validate logical constraints
    if (data.paddingLeft + data.paddingRight >= data.width ||
        data.paddingTop + data.paddingBottom >= data.height) {
      return false
    }

    return true
  }
}