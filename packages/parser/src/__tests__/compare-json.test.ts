/**
 * Test to compare V1 JSON with V2 parsing results
 */

import fs from 'fs'
import path from 'path'
import parse from '../parse'

describe('V1-V2 JSON Comparison', () => {
  const hwpFile = path.join(__dirname, '../../../../Temp/(인천정각중학교-11558 (첨부)) 2024학년도 학생 맞춤형 건강체력교실 운영계획.hwp')
  const v1JsonFile = path.join(__dirname, '../../../../Temp/(인천정각중학교-11558 (첨부)) 2024학년도 학생 맞춤형 건강체력교실 운영계획_parsed.json')

  it('should produce identical results to V1 JSON', () => {
    // Load V1 JSON
    const v1Result = JSON.parse(fs.readFileSync(v1JsonFile, 'utf8'))
    
    // Parse with V2
    const hwpData = fs.readFileSync(hwpFile)
    const v2Result = parse(hwpData, { type: 'buffer' })
    
    // Save V2 result for manual inspection
    const v2JsonFile = path.join(__dirname, '../../../../Temp/test_v2_result.json')
    fs.writeFileSync(v2JsonFile, JSON.stringify(v2Result, null, 2))
    
    // Compare key structures
    expect(v2Result.header.version).toEqual(v1Result.header.version)
    expect(v2Result.info.sectionSize).toBe(v1Result.info.sectionSize)
    
    // Compare sections
    expect(v2Result.sections.length).toBe(v1Result.sections.length)
    
    const v1Section = v1Result.sections[0]
    const v2Section = v2Result.sections[0]
    
    // Page properties
    expect(v2Section.width).toBe(v1Section.width)
    expect(v2Section.height).toBe(v1Section.height)
    expect(v2Section.orientation).toBe(v1Section.orientation)
    
    // Content
    expect(v2Section.content.length).toBe(v1Section.content.length)
    
    // Compare first few paragraphs in detail
    for (let i = 0; i < Math.min(10, v1Section.content.length); i++) {
      const p1 = v1Section.content[i]
      const p2 = v2Section.content[i]
      
      console.log(`\nParagraph ${i}:`)
      console.log(`  V1 - shapeIndex: ${p1.shapeIndex}, content: ${p1.content?.length}, controls: ${p1.controls?.length}`)
      console.log(`  V2 - shapeIndex: ${p2.shapeIndex}, content: ${p2.content?.length}, controls: ${p2.controls?.length}`)
      
      expect(p2.shapeIndex).toBe(p1.shapeIndex)
      
      // Check content array structure
      if (p1.content && p2.content) {
        expect(p2.content.length).toBe(p1.content.length)
        
        // Check first few characters
        for (let j = 0; j < Math.min(5, p1.content.length); j++) {
          expect(p2.content[j].type).toBe(p1.content[j].type)
          expect(p2.content[j].value).toBe(p1.content[j].value)
        }
      }
      
      // Check controls
      if (p1.controls && p2.controls) {
        expect(p2.controls.length).toBe(p1.controls.length)
      }
    }
    
    // Log summary
    console.log('\n\nSummary:')
    console.log(`Total paragraphs: V1=${v1Section.content.length}, V2=${v2Section.content.length}`)
    console.log(`Page size: ${v2Section.width}x${v2Section.height}`)
  })
})