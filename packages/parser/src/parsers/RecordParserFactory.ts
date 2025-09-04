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

import { SectionTagID } from '../constants/tagID'
import { BaseRecordParser } from './RecordParser'
import { ParagraphHeaderParser } from './ParagraphHeaderParser'
import { ParaTextParser } from './ParaTextParser'
import { CharShapeParser } from './CharShapeParser'
import { TableParser } from './TableParser'
import { ControlHeaderParser } from './ControlHeaderParser'
import { LineSegmentParser } from './LineSegmentParser'
import { ListHeaderParser } from './ListHeaderParser'
import { ShapeComponentParser } from './ShapeComponentParser'
import { PageDefParser } from './PageDefParser'

/**
 * Factory class for creating and managing record parsers
 */
export class RecordParserFactory {
  private static instance: RecordParserFactory
  private parsers: Map<SectionTagID, BaseRecordParser<any>>

  private constructor() {
    this.parsers = new Map()
    this.initializeParsers()
  }

  /**
   * Get singleton instance of RecordParserFactory
   */
  static getInstance(): RecordParserFactory {
    if (!RecordParserFactory.instance) {
      RecordParserFactory.instance = new RecordParserFactory()
    }
    return RecordParserFactory.instance
  }

  private initializeParsers(): void {
    // Text-related parsers
    this.parsers.set(SectionTagID.HWPTAG_PARA_TEXT, new ParaTextParser())
    this.parsers.set(SectionTagID.HWPTAG_PARA_CHAR_SHAPE, new CharShapeParser())
    this.parsers.set(SectionTagID.HWPTAG_PARA_LINE_SEG, new LineSegmentParser())

    // Structure parsers
    this.parsers.set(SectionTagID.HWPTAG_TABLE, new TableParser())
    this.parsers.set(SectionTagID.HWPTAG_LIST_HEADER, new ListHeaderParser(this.parsers))
    this.parsers.set(SectionTagID.HWPTAG_SHAPE_COMPONENT, new ShapeComponentParser())
    this.parsers.set(SectionTagID.HWPTAG_PAGE_DEF, new PageDefParser())

    // Control parsers (need access to other parsers)
    this.parsers.set(SectionTagID.HWPTAG_CTRL_HEADER, new ControlHeaderParser(this.parsers))
    this.parsers.set(SectionTagID.HWPTAG_PARA_HEADER, new ParagraphHeaderParser(this.parsers))
  }

  /**
   * Get a parser for a specific record type
   * @param tagID The section tag ID
   * @returns The parser for the given tag ID, or undefined if not found
   */
  getParser(tagID: SectionTagID): BaseRecordParser<any> | undefined {
    return this.parsers.get(tagID)
  }

  /**
   * Register a custom parser
   * @param tagID The section tag ID
   * @param parser The parser to register
   */
  registerParser(tagID: SectionTagID, parser: BaseRecordParser<any>): void {
    this.parsers.set(tagID, parser)
  }

  /**
   * Check if a parser exists for a given tag ID
   * @param tagID The section tag ID
   * @returns true if a parser exists, false otherwise
   */
  hasParser(tagID: SectionTagID): boolean {
    return this.parsers.has(tagID)
  }
}