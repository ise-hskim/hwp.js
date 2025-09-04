/**
 * Integration test for SectionParserV2
 */

import fs from 'fs'
import path from 'path'
import { read, CFB$Container } from 'cfb'
import { inflate } from 'pako'
import SectionParser from '../SectionParser'
import SectionParserV2 from '../SectionParserV2'

const testFiles = [
  path.join(__dirname, '../../../../Temp/(인천정각중학교-11558 (첨부)) 2024학년도 학생 맞춤형 건강체력교실 운영계획.hwp'),
  path.join(__dirname, '../../../../Temp/basicsReport.hwp')
]

function extractSection(container: CFB$Container, sectionNumber: number = 0): Uint8Array {
  const sectionPath = `Root Entry/BodyText/Section${sectionNumber}`
  const entry = container.FileIndex.find(e => e.name === `Section${sectionNumber}`)
  
  if (!entry || !entry.content) {
    throw new Error(`Section${sectionNumber} not found`)
  }
  
  let content = entry.content as Uint8Array
  
  // Try to decompress
  try {
    content = inflate(content, { windowBits: -15 })
  } catch {
    // Use uncompressed content
  }
  
  return content
}

describe('SectionParserV2 Integration Tests', () => {
  testFiles.forEach(filePath => {
    const fileName = path.basename(filePath)
    
    describe(`Testing ${fileName}`, () => {
      let sectionData: Uint8Array
      
      beforeAll(() => {
        if (!fs.existsSync(filePath)) {
          console.warn(`Test file not found: ${filePath}`)
          return
        }
        
        const fileContent = fs.readFileSync(filePath)
        const container = read(fileContent, { type: 'buffer' })
        sectionData = extractSection(container)
      })
      
      it('should parse successfully with V2', () => {
        if (!sectionData) {
          console.warn('Skipping test - no section data')
          return
        }
        
        const parser = new SectionParserV2(sectionData)
        const result = parser.parse()
        
        expect(result).toBeDefined()
        expect(result.content).toBeInstanceOf(Array)
      })
      
      it('should produce similar results as V1', () => {
        if (!sectionData) {
          console.warn('Skipping test - no section data')
          return
        }
        
        const v1Parser = new SectionParser(sectionData)
        const v1Result = v1Parser.parse()
        
        const v2Parser = new SectionParserV2(sectionData)
        const v2Result = v2Parser.parse()
        
        // Compare basic properties
        expect(v2Result.width).toBe(v1Result.width)
        expect(v2Result.height).toBe(v1Result.height)
        expect(v2Result.orientation).toBe(v1Result.orientation)
        expect(v2Result.content.length).toBe(v1Result.content.length)
        
        // Compare first few paragraphs
        for (let i = 0; i < Math.min(5, v1Result.content.length); i++) {
          const p1 = v1Result.content[i]
          const p2 = v2Result.content[i]
          
          expect(p2.shapeIndex).toBe(p1.shapeIndex)
          expect(p2.content?.length || 0).toBe(p1.content?.length || 0)
          expect(p2.controls?.length || 0).toBe(p1.controls?.length || 0)
        }
      })
      
      it('should handle errors gracefully', () => {
        if (!sectionData) {
          console.warn('Skipping test - no section data')
          return
        }
        
        // Test with corrupted data
        const corruptedData = new Uint8Array(10)
        const parser = new SectionParserV2(corruptedData)
        
        expect(() => parser.parse()).not.toThrow()
      })
    })
  })
})