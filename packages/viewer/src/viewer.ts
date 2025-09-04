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

import parse, {
  Control,
  TableControl,
  TableColumnOption,
  ShapeControls,
  CharType,
  HWPDocument,
  Section,
  ShapePointer,
  Paragraph,
  ParagraphList,
  isTable,
  isShape,
  isPicture,
  RGB,
  Style,
  StyleType,
  Numbering,
  NumberFormat,
  Bullet,
} from '@hwp.js/parser'
import { CFB$ParsingOptions } from 'cfb/types'

import parsePage from './parsePage'
import Header from './header'

const BORDER_WIDTH = [
  '0.1mm',
  '0.12mm',
  '0.15mm',
  '0.2mm',
  '0.25mm',
  '0.3mm',
  '0.4mm',
  '0.5mm',
  '0.6mm',
  '0.7mm',
  '1.0mm',
  '1.5mm',
  '2.0mm',
  '3.0mm',
  '4.0mm',
  '5.0mm',
]

const BORDER_STYLE: { [key: number]: string } = {
  0: 'none',
  1: 'solid',
  2: 'dashed',
  3: 'dotted',
  8: 'double',
}

const TEXT_ALIGN: { [key: number]: string } = {
  0: 'justify',
  1: 'left',
  2: 'right',
  3: 'center',
}

class HWPViewer {
  private hwpDocument: HWPDocument

  private container: HTMLElement

  private viewer: HTMLElement = window.document.createElement('div')

  private pages: HTMLElement[] = []

  private header: Header | null = null

  constructor(container: HTMLElement, data: Uint8Array, option: CFB$ParsingOptions = { type: 'binary' }) {
    this.container = container
    this.hwpDocument = parsePage(parse(data, option))
    this.draw()
  }

  distory() {
    this.pages = []
    this.header?.distory()
    this.viewer.parentElement?.removeChild(this.viewer)
  }

  private createPage(section: Section, index: number) {
    const page = document.createElement('div')

    page.style.boxShadow = '0 1px 3px 1px rgba(60,64,67,.15)'
    page.style.backgroundColor = '#FFF'
    page.style.margin = '0 auto'
    page.style.position = 'relative'
    page.style.pageBreakAfter = 'always'

    // Handle page orientation
    let pageWidth = section.width
    let pageHeight = section.height
    
    // orientation: 0 = portrait, 1 = landscape
    if (section.orientation === 1) {
      // Swap width and height for landscape
      const temp = pageWidth
      pageWidth = pageHeight
      pageHeight = temp
    }
    
    page.style.width = `${pageWidth / 7200}in`
    page.style.height = `${pageHeight / 7200}in`
    // TODO: (@hahnlee) header 정의하기
    page.style.paddingTop = `${(section.paddingTop + section.headerPadding) / 7200}in`
    page.style.paddingRight = `${section.paddingRight / 7200}in`
    page.style.paddingBottom = `${section.paddingBottom / 7200}in`
    page.style.paddingLeft = `${section.paddingLeft / 7200}in`

    page.setAttribute('data-page-number', index.toString())

    const observer = document.createElement('div')
    observer.style.height = '2px'
    observer.style.position = 'absolute'
    observer.style.width = '100%'
    observer.style.top = '50%'
    observer.style.left = '0'
    observer.classList.add('hwpjs-observer')
    observer.setAttribute('data-page-number', index.toString())
    page.appendChild(observer)

    this.pages.push(page)

    return page
  }

  private getRGBStyle(rgb: RGB) {
    const [red, green, blue] = rgb
    return `rgb(${red}, ${green}, ${blue})`
  }

  private drawViewer() {
    this.viewer.style.backgroundColor = '#E8EAED'
    this.viewer.style.position = 'relative'
    this.viewer.style.overflow = 'hidden'
    this.viewer.style.width = '100%'
    this.viewer.style.height = '100%'
  }

  private drawBorderFill(
    target: HTMLElement,
    borderFillID?: number,
  ) {
    if (borderFillID === undefined) {
      return
    }

    const borderFill = this.hwpDocument.info.borderFills[borderFillID]

    target.style.borderTopColor = this.getRGBStyle(borderFill.style.top.color)
    target.style.borderRightColor = this.getRGBStyle(borderFill.style.right.color)
    target.style.borderBottomColor = this.getRGBStyle(borderFill.style.bottom.color)
    target.style.borderLeftColor = this.getRGBStyle(borderFill.style.left.color)

    target.style.borderTopWidth = BORDER_WIDTH[borderFill.style.top.width]
    target.style.borderRightWidth = BORDER_WIDTH[borderFill.style.right.width]
    target.style.borderBottomWidth = BORDER_WIDTH[borderFill.style.bottom.width]
    target.style.borderLeftWidth = BORDER_WIDTH[borderFill.style.left.width]

    target.style.borderTopStyle = BORDER_STYLE[borderFill.style.top.type]
    target.style.borderRightStyle = BORDER_STYLE[borderFill.style.right.type]
    target.style.borderBottomStyle = BORDER_STYLE[borderFill.style.bottom.type]
    target.style.borderLeftStyle = BORDER_STYLE[borderFill.style.left.type]

    // Handle fill based on fill type
    const borderFillAny = borderFill as any
    if (borderFillAny.fillType === 4 && borderFillAny.gradientFill) {
      // Gradient fill (FillType.Gradation = 4)
      const gradient = borderFillAny.gradientFill
      
      if (gradient.colors && gradient.colors.length >= 2) {
        const color1 = this.getRGBStyle(gradient.colors[0].color)
        const color2 = this.getRGBStyle(gradient.colors[1].color)
        
        // Debug gradient info
        console.log('Applying gradient:', {
          type: gradient.type,
          angle: gradient.angle,
          centerX: gradient.centerX,
          centerY: gradient.centerY,
          step: gradient.step,
          color1,
          color2
        })
        
        switch (gradient.type) {
          case 0: // 줄무늬형 (Linear) - 0-based index
            const angle = gradient.angle || 90
            target.style.background = `linear-gradient(${angle}deg, ${color1}, ${color2})`
            break
          case 1: // 원형 (Radial/Circle) - 0-based index
            // HWP might use different coordinate system, if (0,0) means center, use 50%
            const centerX = gradient.centerX === 0 ? 50 : gradient.centerX
            const centerY = gradient.centerY === 0 ? 50 : gradient.centerY
            target.style.background = `radial-gradient(circle at ${centerX}% ${centerY}%, ${color1}, ${color2})`
            break
          case 2: // Actually seems to be linear gradient with angle=0 meaning left to right
            // angle=0 in HWP means horizontal (left to right), so we need to add 90 degrees for CSS
            const linearAngle = (gradient.angle || 0) + 90
            target.style.background = `linear-gradient(${linearAngle}deg, ${color1}, ${color2})`
            break
          case 3: // 사각형 (Square) - 0-based index
            target.style.background = `radial-gradient(closest-side at ${gradient.centerX || 50}% ${gradient.centerY || 50}%, ${color1}, ${color2})`
            break
          default:
            // Fallback to linear gradient
            console.warn('Unknown gradient type:', gradient.type)
            target.style.background = `linear-gradient(90deg, ${color1}, ${color2})`
        }
      }
    } else if (borderFill.backgroundColor) {
      // Single color fill
      target.style.backgroundColor = this.getRGBStyle(borderFill.backgroundColor)
    }
  }

  private drawColumn(
    container: HTMLTableRowElement,
    paragraphList: ParagraphList<TableColumnOption>,
  ) {
    const column = document.createElement('td')
    const {
      width,
      height,
      colSpan,
      rowSpan,
      borderFillID,
    } = paragraphList.attribute

    column.style.width = `${width / 100}pt`
    column.style.height = `${height / 100}pt`
    column.colSpan = colSpan
    column.rowSpan = rowSpan

    this.drawBorderFill(column, borderFillID)

    paragraphList.items.forEach((paragraph) => {
      this.drawParagraph(column, paragraph)
    })

    container.appendChild(column)
  }

  private drawTable(
    container: HTMLElement,
    control: TableControl,
  ) {
    const table = document.createElement('table')
    table.style.display = 'inline-table'
    table.style.borderCollapse = 'collapse'
    table.style.width = `${control.width / 100}pt`
    // height는 자동으로 계산되도록 설정하지 않음
    table.style.maxHeight = `${control.height / 100}pt`
    table.style.boxSizing = 'border-box'
    table.style.tableLayout = 'fixed'

    const tbody = document.createElement('tbody')

    for (let i = 0; i < control.rowCount; i += 1) {
      const tr = document.createElement('tr')

      control.content[i].forEach((paragraphList) => {
        this.drawColumn(tr, paragraphList)
      })

      tbody.appendChild(tr)
    }

    table.appendChild(tbody)
    container.appendChild(table)
  }

  private drawShape(
    container: HTMLElement,
    control: ShapeControls,
  ) {
    const shapeGroup = document.createElement('div')
    shapeGroup.style.width = `${control.width / 100}pt`
    shapeGroup.style.height = `${control.height / 100}pt`

    if (control.attribute.vertRelTo === 0) {
      shapeGroup.style.position = 'absolute'
      shapeGroup.style.top = `${control.verticalOffset / 100}pt`
      shapeGroup.style.left = `${control.horizontalOffset / 100}pt`
    } else {
      shapeGroup.style.marginTop = `${control.verticalOffset / 100}pt`
      shapeGroup.style.marginLeft = `${control.horizontalOffset / 100}pt`
    }

    shapeGroup.style.zIndex = `${control.zIndex}`
    shapeGroup.style.verticalAlign = 'middle'
    shapeGroup.style.display = 'inline-block'

    if (isPicture(control)) {
      const image = this.hwpDocument.info.binData[control.info!.binID]
      const blob = new Blob([image.payload], { type: `images/${image.extension}` })
      // TODO: (@hahnlee) revokeObjectURL을 관리할 수 있도록 하기
      const imageURL = window.URL.createObjectURL(blob)
      shapeGroup.style.backgroundImage = `url("${imageURL}")`
      shapeGroup.style.backgroundRepeat = 'no-repeat'
      shapeGroup.style.backgroundPosition = 'center'
      shapeGroup.style.backgroundSize = 'contain'
    }

    control.content.forEach((paragraphList) => {
      paragraphList.items.forEach((paragraph) => {
        this.drawParagraph(shapeGroup, paragraph)
      })
    })

    container.appendChild(shapeGroup)
  }

  private drawControl(
    container: HTMLElement,
    control: Control,
  ) {
    if (isTable(control)) {
      this.drawTable(container, control)
      return
    }

    if (isShape(control)) {
      this.drawShape(container, control)
    }
  }

  private formatNumber(format: NumberFormat, number: number): string {
    // Korean numbering formats
    const HANGUL_SYLLABLES = ['가', '나', '다', '라', '마', '바', '사', '아', '자', '차', '카', '타', '파', '하']
    const HANGUL_JAMO = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
    const HANGUL_PHONETIC = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계']
    const CIRCLED_NUMBERS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮']

    switch (format) {
      case NumberFormat.Digit:
        return number.toString()
      case NumberFormat.CircledDigit:
        return number <= 15 ? CIRCLED_NUMBERS[number - 1] : `(${number})`
      case NumberFormat.RomanCapital:
        return this.toRoman(number).toUpperCase()
      case NumberFormat.RomanSmall:
        return this.toRoman(number).toLowerCase()
      case NumberFormat.LatinCapital:
        return String.fromCharCode(64 + number) // A, B, C...
      case NumberFormat.LatinSmall:
        return String.fromCharCode(96 + number) // a, b, c...
      case NumberFormat.CircledLatinCapital:
        return number <= 26 ? String.fromCharCode(0x24B6 + number - 1) : `(${String.fromCharCode(64 + number)})`
      case NumberFormat.CircledLatinSmall:
        return number <= 26 ? String.fromCharCode(0x24D0 + number - 1) : `(${String.fromCharCode(96 + number)})`
      case NumberFormat.HangulSyllable:
        return HANGUL_SYLLABLES[(number - 1) % HANGUL_SYLLABLES.length]
      case NumberFormat.CircledHangulSyllable:
        return `(${HANGUL_SYLLABLES[(number - 1) % HANGUL_SYLLABLES.length]})`
      case NumberFormat.HangulJamo:
        return HANGUL_JAMO[(number - 1) % HANGUL_JAMO.length]
      case NumberFormat.CircledHangulJamo:
        return `(${HANGUL_JAMO[(number - 1) % HANGUL_JAMO.length]})`
      case NumberFormat.HangulPhonetic:
        return HANGUL_PHONETIC[(number - 1) % HANGUL_PHONETIC.length]
      case NumberFormat.Ideograph:
        const ideographs = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
        return number <= 10 ? ideographs[number - 1] : number.toString()
      case NumberFormat.CircledIdeograph:
        const circledIdeographs = ['㊀', '㊁', '㊂', '㊃', '㊄', '㊅', '㊆', '㊇', '㊈', '㊉']
        return number <= 10 ? circledIdeographs[number - 1] : `(${number})`
      default:
        return number.toString()
    }
  }

  private toRoman(num: number): string {
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
    const numerals = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']
    let result = ''
    
    for (let i = 0; i < values.length; i++) {
      while (num >= values[i]) {
        result += numerals[i]
        num -= values[i]
      }
    }
    
    return result
  }

  private drawText(
    container: HTMLElement,
    paragraph: Paragraph,
    shapePointer: ShapePointer,
    endPos: number,
  ): number {  // Return number of controls rendered
    const range = paragraph.content.slice(shapePointer.pos, endPos + 1)

    const texts: string[] = []
    const controlsToRender: Array<{ control: any, position: number }> = []
    let ctrlIndex = 0
    let charPosition = 0

    range.forEach((hwpChar) => {
      if (typeof hwpChar.value === 'string') {
        texts.push(hwpChar.value)
        charPosition++
        return
      }

      if (hwpChar.type === CharType.Extened) {
        const control = paragraph.controls[ctrlIndex]
        ctrlIndex += 1
        // Store control with its position in the text for later rendering
        controlsToRender.push({ control, position: charPosition })
      }

      if (hwpChar.value === 13) {
        texts.push('\n')
        charPosition++
      }
    })

    const text = texts.join('')

    // First, render the text
    const span = document.createElement('span')
    span.textContent = text

    const charShape = this.hwpDocument.info.getCharShpe(shapePointer.shapeIndex)

    if (charShape) {
      const {
        fontBaseSize, fontRatio, color, fontId, attr,
      } = charShape
      const fontSize = fontBaseSize * (fontRatio[0] / 100)
      span.style.fontSize = `${fontSize}pt`
      span.style.lineBreak = 'anywhere'
      span.style.whiteSpace = 'pre-wrap'

      span.style.color = this.getRGBStyle(color)

      const fontFace = this.hwpDocument.info.fontFaces[fontId[0]]
      span.style.fontFamily = fontFace.getFontFamily()

      // Apply character attributes (bold, italic, underline, etc.)
      // attr is a bit field where:
      // bit 0: italic
      // bit 1: bold
      // bit 2: underline
      // bit 3: outline
      // bit 4: shadow
      // bit 5: emboss
      // bit 6: engrave
      // bit 8: strike through
      if (attr & 0x01) span.style.fontStyle = 'italic'
      if (attr & 0x02) span.style.fontWeight = 'bold'
      if (attr & 0x04) span.style.textDecoration = 'underline'
      if (attr & 0x100) {
        // Strike through
        if (span.style.textDecoration) {
          span.style.textDecoration += ' line-through'
        } else {
          span.style.textDecoration = 'line-through'
        }
      }
    }

    container.appendChild(span)
    
    // Then, render controls after the text
    controlsToRender.forEach(({ control }) => {
      this.drawControl(container, control)
    })
    
    // Return how many controls were rendered
    return ctrlIndex
  }

  private drawParagraph(
    container: HTMLElement,
    paragraph: Paragraph,
  ) {
    // Check if this is a very small empty paragraph
    const isVerySmallEmpty = (paragraph.content.length === 0 || 
      (paragraph.content.length === 1 && paragraph.content[0].value === 13)) &&
      paragraph.shapeBuffer && paragraph.shapeBuffer.length > 0 &&
      this.hwpDocument.info.getCharShpe(paragraph.shapeBuffer[0].shapeIndex)?.fontBaseSize < 5
    
    // Use span instead of div for very small empty paragraphs
    const paragraphContainer = document.createElement(isVerySmallEmpty ? 'span' : 'div')
    paragraphContainer.style.margin = '0'
    
    // Reset any inherited text alignment
    paragraphContainer.style.textAlign = 'left'

    // Check if paragraph has a valid shape
    const shape = this.hwpDocument.info.paragraphShapes[paragraph.shapeIndex]
    
    // Apply text alignment from paragraph shape
    if (shape && typeof shape.align === 'number') {
      const alignValue = TEXT_ALIGN[shape.align]
      if (alignValue) {
        paragraphContainer.style.textAlign = alignValue
        
        // Add class for debugging
        paragraphContainer.classList.add(`hwp-align-${alignValue}`)
      }
    }

    // Handle empty paragraphs (for line breaks)
    if (paragraph.content.length === 0 || (paragraph.content.length === 1 && paragraph.content[0].value === 13)) {
      // Get the font size from charShape for empty paragraph height
      let heightInPt = 10 // Default height
      
      if (paragraph.shapeBuffer && paragraph.shapeBuffer.length > 0) {
        const charShape = this.hwpDocument.info.getCharShpe(paragraph.shapeBuffer[0].shapeIndex)
        if (charShape) {
          // Use font base size as the height for empty paragraphs
          heightInPt = charShape.fontBaseSize * (charShape.fontRatio[0] / 100)
        }
      } else if (paragraph.lineSegments && paragraph.lineSegments.length > 0) {
        // Fallback to lineSegments if no shapeBuffer
        const totalHeight = paragraph.lineSegments.reduce((sum, segment) => {
          return sum + (segment.height || 0)
        }, 0)
        // Convert HWPUNIT to pt (7200 HWPUNIT = 1 inch = 72pt)
        heightInPt = totalHeight / 100
      }
      
      // Apply specific styles for very small font sizes
      if (heightInPt > 0) {
        // For extremely small fonts (like 1pt), use negative margin trick
        if (heightInPt < 5) {
          // Calculate how much we need to compensate
          const targetHeightPx = heightInPt * 1.333333 // Convert pt to px
          const browserMinHeight = 19.5 // The height browser is forcing
          const compensation = browserMinHeight - targetHeightPx
          
          // Use wrapper with negative margin to compensate
          const wrapper = document.createElement('div')
          wrapper.style.height = '0'
          wrapper.style.overflow = 'hidden'
          wrapper.style.marginBottom = `-${compensation}px`
          
          paragraphContainer.style.height = `${browserMinHeight}px`
          paragraphContainer.style.fontSize = '0'
          paragraphContainer.style.lineHeight = '0'
          paragraphContainer.style.overflow = 'hidden'
          
          wrapper.appendChild(paragraphContainer)
          container.appendChild(wrapper)
          return // Exit early since we handled the append
        } else {
          // Normal handling for larger sizes
          paragraphContainer.style.height = `${heightInPt}pt`
          paragraphContainer.style.lineHeight = `${heightInPt}pt`
          paragraphContainer.style.fontSize = `${heightInPt}pt`
          paragraphContainer.style.overflow = 'hidden'
          paragraphContainer.style.padding = '0'
          paragraphContainer.style.border = '0'
          
          const emptySpan = document.createElement('span')
          emptySpan.innerHTML = '&nbsp;'
          emptySpan.style.fontSize = `${heightInPt}pt`
          emptySpan.style.lineHeight = `${heightInPt}pt`
          paragraphContainer.appendChild(emptySpan)
        }
      } else {
        // Default case
        const emptySpan = document.createElement('span')
        emptySpan.innerHTML = '&nbsp;'
        paragraphContainer.appendChild(emptySpan)
      }
    } else {
      // Process non-empty paragraphs
      // Track how many controls were rendered through Extended characters
      let totalRenderedControls = 0
      paragraph.shapeBuffer.forEach((shapePointer, index) => {
        const endPos = paragraph.getShapeEndPos(index)
        const renderedCount = this.drawText(paragraphContainer, paragraph, shapePointer, endPos)
        totalRenderedControls = Math.max(totalRenderedControls, renderedCount)
      })
      // Store for later use
      ;(paragraphContainer as any).__renderedControls = totalRenderedControls
    }

    // Apply styles if available
    const styles = this.hwpDocument.info.styles
    if (styles && styles.length > 0) {
      // Find style based on paragraph shape
      const style = styles.find(s => s.paragraphShapeId === paragraph.shapeIndex)
      if (style && style.type === StyleType.Para) {
        // Apply style properties
        const charShape = this.hwpDocument.info.getCharShpe(style.charShapeId)
        if (charShape) {
          paragraphContainer.style.fontFamily = this.hwpDocument.info.fontFaces[charShape.fontId[0]].getFontFamily()
          paragraphContainer.style.fontSize = `${charShape.fontBaseSize * (charShape.fontRatio[0] / 100)}pt`
          paragraphContainer.style.color = this.getRGBStyle(charShape.color)
        }
      }
    }

    // Check for numbering or bullets
    const numberings = this.hwpDocument.info.numberings
    const bullets = this.hwpDocument.info.bullets
    
    // TODO: Add logic to detect and render numbering/bullet based on paragraph properties
    // This would typically be based on paragraph formatting attributes

    // Render controls that weren't rendered through Extended characters
    // This happens when controls are at the end of paragraph without Extended char
    if (paragraph.controls && paragraph.controls.length > 0) {
      // Get the count of already rendered controls
      const alreadyRendered = (paragraphContainer as any).__renderedControls || 0
      
      // Only render controls that haven't been rendered yet
      if (alreadyRendered < paragraph.controls.length) {
        // Create a wrapper for controls
        const controlsWrapper = document.createElement('div')
        controlsWrapper.style.clear = 'both'
        
        for (let i = alreadyRendered; i < paragraph.controls.length; i++) {
          this.drawControl(controlsWrapper, paragraph.controls[i])
        }
        
        // Always append controls AFTER the text
        // This ensures text like "지도강사" appears before the table
        paragraphContainer.appendChild(controlsWrapper)
      }
    }
    
    container.append(paragraphContainer)
  }

  private drawSection(container: HTMLElement, section: Section, index: number) {
    const page = this.createPage(section, index)
    page.style.marginBottom = '20px'

    section.content.forEach((paragraph) => {
      this.drawParagraph(page, paragraph)
    })

    container.appendChild(page)
  }

  private draw() {
    this.drawViewer()

    const content = document.createElement('div')
    content.style.height = 'calc(100% - 32px)'
    content.style.padding = '24px'
    content.style.marginTop = '32px'
    content.style.overflow = 'auto'
    content.style.position = 'relative'
    content.style.zIndex = '0'

    this.hwpDocument.sections.forEach((section, index) => {
      this.drawSection(content, section, index)
    })

    this.header = new Header(this.viewer, this.container, this.pages)

    this.viewer.appendChild(content)
    this.container.appendChild(this.viewer)
  }
}

export default HWPViewer
