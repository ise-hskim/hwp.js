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
import HWPRecord from '../models/record'

/**
 * Base interface for all record parsers
 * @template T The type of data this parser produces
 */
export interface RecordParser<T> {
  /**
   * Parse a HWP record into the target type
   * @param record The HWP record to parse
   * @returns Parsed data of type T
   * @throws Error if parsing fails
   */
  parse(record: HWPRecord): T

  /**
   * Validate the parsed data
   * @param data The data to validate
   * @returns true if data is valid, false otherwise
   */
  validate(data: T): boolean

  /**
   * Get the record type this parser handles
   * @returns The section tag ID
   */
  getRecordType(): SectionTagID
}

/**
 * Abstract base class for record parsers with common functionality
 */
export abstract class BaseRecordParser<T> implements RecordParser<T> {
  abstract parse(record: HWPRecord): T
  abstract validate(data: T): boolean
  abstract getRecordType(): SectionTagID

  /**
   * Verify that the record has the expected tag ID
   * @param record The record to verify
   * @throws Error if tag ID doesn't match
   */
  protected verifyRecordType(record: HWPRecord): void {
    const expectedType = this.getRecordType()
    if (record.tagID !== expectedType) {
      throw new Error(
        `Invalid record type. Expected: ${expectedType}, Received: ${record.tagID}`
      )
    }
  }

  /**
   * Parse and validate a record in one operation
   * @param record The record to parse
   * @returns Parsed and validated data
   * @throws Error if parsing fails or data is invalid
   */
  parseAndValidate(record: HWPRecord): T {
    this.verifyRecordType(record)
    const data = this.parse(record)
    
    if (!this.validate(data)) {
      throw new Error(`Validation failed for record type ${this.getRecordType()}`)
    }
    
    return data
  }
}