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

import { CFB$Container, find } from 'cfb'
import { inflate } from 'pako'

import FillType from './constants/fillType'
import { DocInfoTagID } from './constants/tagID'
import BinData, { BinDataCompress } from './models/binData'
import ByteReader from './utils/byteReader'
import CharShape from './models/charShape'
import DocInfo from './models/docInfo'
import FontFace from './models/fontFace'
import ParagraphShape from './models/paragraphShape'
import { getRGB, getFlag, getBitValue } from './utils/bitUtils'
import BorderFill from './models/borderFill'
import HWPRecord from './models/record'
import Panose from './models/panose'
import parseRecordTree from './parseRecord'
import HWPHeader from './models/header'
import Style, { StyleType, StyleLanguage } from './models/style'
import Numbering, { NumberFormat } from './models/numbering'
import Bullet from './models/bullet'

class DocInfoParser {
  private record: HWPRecord

  private result = new DocInfo()

  private container: CFB$Container

  private header: HWPHeader

  constructor(header: HWPHeader, data: Uint8Array, container: CFB$Container) {
    this.header = header
    this.record = parseRecordTree(data)
    this.container = container
  }

  visitDocumentPropertes(record: HWPRecord) {
    const reader = new ByteReader(record.payload)
    this.result.sectionSize = reader.readUInt16()

    this.result.startingIndex.page = reader.readUInt16()
    this.result.startingIndex.footnote = reader.readUInt16()
    this.result.startingIndex.endnote = reader.readUInt16()
    this.result.startingIndex.picture = reader.readUInt16()
    this.result.startingIndex.table = reader.readUInt16()
    this.result.startingIndex.equation = reader.readUInt16()

    this.result.caratLocation.listId = reader.readUInt32()
    this.result.caratLocation.paragraphId = reader.readUInt32()
    this.result.caratLocation.charIndex = reader.readUInt32()
  }

  visitCharShape(record: HWPRecord) {
    const reader = new ByteReader(record.payload)

    const charShape = new CharShape(
      [
        reader.readUInt16(),
        reader.readUInt16(),
        reader.readUInt16(),
        reader.readUInt16(),
        reader.readUInt16(),
        reader.readUInt16(),
        reader.readUInt16(),
      ],
      [
        reader.readUInt8(),
        reader.readUInt8(),
        reader.readUInt8(),
        reader.readUInt8(),
        reader.readUInt8(),
        reader.readUInt8(),
        reader.readUInt8(),
      ],
      [
        reader.readInt8(),
        reader.readInt8(),
        reader.readInt8(),
        reader.readInt8(),
        reader.readInt8(),
        reader.readInt8(),
        reader.readInt8(),
      ],
      [
        reader.readUInt8(),
        reader.readUInt8(),
        reader.readUInt8(),
        reader.readUInt8(),
        reader.readUInt8(),
        reader.readUInt8(),
        reader.readUInt8(),
      ],
      [
        reader.readInt8(),
        reader.readInt8(),
        reader.readInt8(),
        reader.readInt8(),
        reader.readInt8(),
        reader.readInt8(),
        reader.readInt8(),
      ],
      reader.readInt32(),
      reader.readUInt32(),
      reader.readUInt8(),
      reader.readUInt8(),
      reader.readUInt32(),
      reader.readUInt32(),
      reader.readUInt32(),
      reader.readUInt32(),
    )

    if (record.size > 68) {
      charShape.fontBackgroundId = reader.readUInt16()
    }

    if (record.size > 70) {
      charShape.underLineColor = getRGB(reader.readInt32())
    }

    this.result.charShapes.push(charShape)
  }

  visitFaceName(record: HWPRecord) {
    const reader = new ByteReader(record.payload)
    const attribute = reader.readUInt8()
    const hasAlternative = getFlag(attribute, 7)
    const hasAttribute = getFlag(attribute, 6)
    const hasDefault = getFlag(attribute, 5)

    const fontFace = new FontFace()
    fontFace.name = reader.readString()

    if (hasAlternative) {
      reader.skipByte(1)
      fontFace.alternative = reader.readString()
    }

    if (hasAttribute) {
      const panose = new Panose()
      panose.family = reader.readInt8()
      panose.serifStyle = reader.readInt8()
      panose.weight = reader.readInt8()
      panose.proportion = reader.readInt8()
      panose.contrast = reader.readInt8()
      panose.strokeVariation = reader.readInt8()
      panose.armStyle = reader.readInt8()
      panose.letterForm = reader.readInt8()
      panose.midline = reader.readInt8()
      panose.xHeight = reader.readInt8()

      fontFace.panose = panose
    }

    if (hasDefault) {
      fontFace.default = reader.readString()
    }

    this.result.fontFaces.push(fontFace)
  }

  visitBinData(record: HWPRecord) {
    const reader = new ByteReader(record.payload)
    // TODO: (@hahnlee) parse properties
    const attribute = reader.readUInt16()

    const properties = {
      type: getBitValue(attribute, 0, 3),
      compress: getBitValue(attribute, 4, 5),
      status: getBitValue(attribute, 8, 9),
    }

    const id = reader.readUInt16()
    const extension = reader.readString()

    // FIXME: (@hanlee) check embed
    const path = `Root Entry/BinData/BIN${`${id.toString(16).toUpperCase()}`.padStart(4, '0')}.${extension}`
    const payload = find(this.container, path)!.content as Uint8Array

    if (
      properties.compress === BinDataCompress.COMPRESS
      || (properties.compress === BinDataCompress.DEFAULT && this.header.properties.compressed)
    ) {
      const data = inflate(payload, { windowBits: -15 })
      this.result.binData.push(new BinData(properties, extension, data))
    } else {
      this.result.binData.push(new BinData(properties, extension, Uint8Array.from(payload)))
    }
  }

  visitBorderFill(record: HWPRecord) {
    const reader = new ByteReader(record.payload)

    const borderFill = new BorderFill(
      reader.readUInt16(),
      {
        left: {
          type: reader.readUInt8(),
          width: reader.readUInt8(),
          color: getRGB(reader.readUInt32()),
        },
        right: {
          type: reader.readUInt8(),
          width: reader.readUInt8(),
          color: getRGB(reader.readUInt32()),
        },
        top: {
          type: reader.readUInt8(),
          width: reader.readUInt8(),
          color: getRGB(reader.readUInt32()),
        },
        bottom: {
          type: reader.readUInt8(),
          width: reader.readUInt8(),
          color: getRGB(reader.readUInt32()),
        },
      },
    )

    reader.skipByte(6)

    const fillType = reader.readUInt32()
    borderFill.fillType = fillType

    if (fillType === FillType.Single) {
      borderFill.backgroundColor = getRGB(reader.readUInt32())
    } else if (fillType === FillType.Gradation) {
      // Parse gradient fill
      const gradientFill: any = {
        type: reader.readUInt8(),
        angle: reader.readUInt32(),
        centerX: reader.readInt32(),
        centerY: reader.readInt32(),
        step: reader.readUInt32(),
        colorNum: reader.readUInt32(),
        colors: []
      }

      for (let i = 0; i < gradientFill.colorNum && i < 2; i++) {
        // HWP usually stores 2 colors for gradients
        gradientFill.colors.push({
          pos: i === 0 ? 0 : 100,
          color: getRGB(reader.readUInt32())
        })
      }

      borderFill.gradientFill = gradientFill
    }

    this.result.borderFills.push(borderFill)
  }

  visitParagraphShape(record: HWPRecord) {
    const reader = new ByteReader(record.payload)
    const shape = new ParagraphShape()
    
    // 속성 1 읽기 (UINT32)
    const attribute1 = reader.readUInt32()
    
    // bit 0~1: 줄 간격 종류 (5.0.2.5 미만)
    shape.lineSpacingType = getBitValue(attribute1, 0, 2)
    
    // bit 2~4: 정렬 방식
    shape.align = getBitValue(attribute1, 2, 5)
    
    // bit 5~6: 줄 나눔 기준 영어 단위
    shape.englishBreakType = getBitValue(attribute1, 5, 7)
    
    // bit 7: 줄 나눔 기준 한글 단위
    shape.koreanBreakByChar = Boolean(getBitValue(attribute1, 7))
    
    // bit 8: 편집 용지의 줄 격자 사용 여부
    shape.useLineGrid = Boolean(getBitValue(attribute1, 8))
    
    // bit 9~15: 공백 최소값 (0%~75%)
    shape.spaceMinimumValue = getBitValue(attribute1, 9, 16)
    
    // bit 16: 외톨이줄 보호 여부
    shape.orphanProtect = Boolean(getBitValue(attribute1, 16))
    
    // bit 17: 다음 문단과 함께 여부
    shape.keepWithNext = Boolean(getBitValue(attribute1, 17))
    
    // bit 18: 문단 보호 여부
    shape.protectParagraph = Boolean(getBitValue(attribute1, 18))
    
    // bit 19: 문단 앞에서 항상 쪽 나눔 여부
    shape.pageBreakBefore = Boolean(getBitValue(attribute1, 19))
    
    // bit 20~21: 세로 정렬
    shape.verticalAlign = getBitValue(attribute1, 20, 22)
    
    // bit 22: 글꼴에 어울리는 줄 높이 여부
    shape.fontLineHeight = Boolean(getBitValue(attribute1, 22))
    
    // bit 23~24: 문단 머리 모양 종류
    shape.headingType = getBitValue(attribute1, 23, 25)
    
    // bit 25~27: 문단 수준 (1수준~7수준)
    shape.level = getBitValue(attribute1, 25, 28)
    
    // bit 28: 문단 테두리 연결 여부
    shape.borderConnect = Boolean(getBitValue(attribute1, 28))
    
    // bit 29: 문단 여백 무시 여부
    shape.ignoreParagraphMargin = Boolean(getBitValue(attribute1, 29))
    
    // bit 30: 문단 꼬리 모양
    shape.tailShape = Boolean(getBitValue(attribute1, 30))
    
    // 여백 및 간격 읽기
    shape.leftMargin = reader.readInt32()        // 왼쪽 여백
    shape.rightMargin = reader.readInt32()       // 오른쪽 여백
    shape.indent = reader.readInt32()            // 들여 쓰기/내어 쓰기
    shape.spacingTop = reader.readInt32()        // 문단 간격 위
    shape.spacingBottom = reader.readInt32()     // 문단 간격 아래
    shape.lineSpacing = reader.readInt32()       // 줄 간격 (5.0.2.5 미만)
    
    // 참조 ID들
    shape.tabDefId = reader.readUInt16()         // 탭 정의 ID
    shape.numberingId = reader.readUInt16()      // 번호 문단 ID 또는 글머리표 ID
    shape.borderFillId = reader.readUInt16()     // 테두리/배경 모양 ID
    
    // 문단 테두리 간격
    shape.borderOffsetLeft = reader.readInt16()    // 문단 테두리 왼쪽 간격
    shape.borderOffsetRight = reader.readInt16()   // 문단 테두리 오른쪽 간격
    shape.borderOffsetTop = reader.readInt16()     // 문단 테두리 위쪽 간격
    shape.borderOffsetBottom = reader.readInt16()  // 문단 테두리 아래쪽 간격
    
    // 속성 2 (5.0.1.7 이상)
    if (reader.isEOF() === false) {
      const attribute2 = reader.readUInt32()
      
      // bit 0~1: 한 줄로 입력 여부
      shape.singleLineInput = getBitValue(attribute2, 0, 2)
      
      // bit 4: 한글과 영어 간격을 자동 조절 여부
      shape.autoSpaceHangulLatin = Boolean(getBitValue(attribute2, 4))
      
      // bit 5: 한글과 숫자 간격을 자동 조절 여부
      shape.autoSpaceHangulDigit = Boolean(getBitValue(attribute2, 5))
    }
    
    // 속성 3 (5.0.2.5 이상)
    if (reader.isEOF() === false) {
      shape.attribute3 = reader.readUInt32()
    }
    
    // 줄 간격 (5.0.2.5 이상)
    if (reader.isEOF() === false) {
      const lineSpacingValue = reader.readUInt32()
      
      // bit 0~4: 줄 간격 종류 (5.0.2.5 이상)
      shape.lineSpacingType = getBitValue(lineSpacingValue, 0, 5)
      
      // 줄 간격 값 갱신 (5.0.2.5 이상에서는 이 값을 사용)
      shape.lineSpacing = lineSpacingValue
    }
    
    this.result.paragraphShapes.push(shape)
  }

  visitCompatibleDocument(record: HWPRecord) {
    const reader = new ByteReader(record.payload)
    this.result.compatibleDocument = reader.readUInt32()
  }

  visitLayoutCompatibility(record: HWPRecord) {
    const reader = new ByteReader(record.payload)
    this.result.layoutCompatiblity.char = reader.readUInt32()
    this.result.layoutCompatiblity.paragraph = reader.readUInt32()
    this.result.layoutCompatiblity.section = reader.readUInt32()
    this.result.layoutCompatiblity.object = reader.readUInt32()
    this.result.layoutCompatiblity.field = reader.readUInt32()
  }

  visitStyle(record: HWPRecord) {
    const reader = new ByteReader(record.payload)
    
    // 스타일 이름 길이와 이름 읽기
    const nameLength = reader.readUInt16()
    const nameChars: string[] = []
    for (let i = 0; i < nameLength; i += 1) {
      nameChars.push(String.fromCharCode(reader.readUInt16()))
    }
    const name = nameChars.join('')
    
    // 영문 이름 길이와 이름 읽기
    const englishNameLength = reader.readUInt16()
    const englishNameChars: string[] = []
    for (let i = 0; i < englishNameLength; i += 1) {
      englishNameChars.push(String.fromCharCode(reader.readUInt16()))
    }
    const englishName = englishNameChars.join('')
    
    // 속성 바이트 읽기
    const attr = reader.readUInt8()
    const styleType = getBitValue(attr, 0) as StyleType
    
    // 다음 스타일 ID
    const nextStyleId = reader.readUInt16()
    
    // 언어 ID
    const languageId = reader.readUInt16() as StyleLanguage
    
    // 문단 모양 ID
    const paragraphShapeId = reader.readUInt16()
    
    // 글자 모양 ID
    const charShapeId = reader.readUInt16()
    
    const style = new Style(
      this.result.styles.length, // ID는 배열 인덱스로 설정
      name,
      englishName,
      styleType,
      nextStyleId,
      languageId,
      paragraphShapeId,
      charShapeId,
    )
    
    this.result.styles.push(style)
  }

  visitNumbering(record: HWPRecord) {
    const reader = new ByteReader(record.payload)
    
    const numbering = new Numbering(this.result.numberings.length)
    
    // 각 레벨별 정보 읽기 (최대 10레벨)
    for (let level = 0; level < 10; level += 1) {
      // 남은 데이터가 충분한지 확인
      if (reader.isEOF() || reader.remainByte() < 4) {
        break
      }
      // 헤더 속성
      const header = reader.readUInt32()
      
      // 정렬 방식 (bit 0-1)
      const alignment = getBitValue(header, 0) | (getBitValue(header, 1) << 1)
      
      // 번호 형식 길이 읽기 전 체크
      if (reader.remainByte() < 2) {
        break
      }
      
      // 번호 형식 길이
      const formatLength = reader.readUInt16()
      
      // 번호 형식 문자열 읽기 (UTF-16LE)
      if (reader.remainByte() < formatLength * 2) {
        break
      }
      
      const formatChars: string[] = []
      for (let i = 0; i < formatLength; i += 1) {
        formatChars.push(String.fromCharCode(reader.readUInt16()))
      }
      const formatString = formatChars.join('')
      
      // 번호 형식 파싱 (^n 찾기)
      let prefix = ''
      let suffix = ''
      let numberFormat = NumberFormat.Digit
      
      const numberMatch = formatString.match(/\^([a-zA-Z0-9가-힣]+)/)
      if (numberMatch) {
        const formatCode = numberMatch[1]
        prefix = formatString.substring(0, numberMatch.index || 0)
        suffix = formatString.substring((numberMatch.index || 0) + numberMatch[0].length)
        
        // 형식 코드 파싱
        switch (formatCode) {
          case 'n': numberFormat = NumberFormat.Digit; break
          case 'c': numberFormat = NumberFormat.CircledDigit; break
          case 'I': numberFormat = NumberFormat.RomanCapital; break
          case 'i': numberFormat = NumberFormat.RomanSmall; break
          case 'A': numberFormat = NumberFormat.LatinCapital; break
          case 'a': numberFormat = NumberFormat.LatinSmall; break
          case '가': numberFormat = NumberFormat.HangulSyllable; break
          case 'ㄱ': numberFormat = NumberFormat.HangulJamo; break
          case '갑': numberFormat = NumberFormat.HangulPhonetic; break
          default: numberFormat = NumberFormat.Digit; break
        }
      }
      
      // 시작 번호와 문자 모양 ID 읽기 전 체크
      if (reader.remainByte() < 8) {
        break
      }
      
      // 시작 번호
      const startNumber = reader.readUInt32()
      
      // 문자 모양 ID
      const charShapeId = reader.readUInt32()
      
      numbering.addLevel({
        numberFormat,
        prefix,
        suffix,
        startNumber,
        charShapeId,
        indentSize: 0, // 추후 구현
        spacing: 0, // 추후 구현
      })
    }
    
    this.result.numberings.push(numbering)
  }

  visitBullet(record: HWPRecord) {
    const reader = new ByteReader(record.payload)
    
    // 글머리표 문자 읽기
    const bulletChar = String.fromCharCode(reader.readUInt16())
    
    // 속성 플래그
    const attr = reader.readUInt32()
    const useImage = Boolean(getBitValue(attr, 0))
    
    // 문단 머리 문자 (체크박스 등)
    const checkChar = String.fromCharCode(reader.readUInt16())
    
    // 이미지 글머리표 정보
    let imageId: number | undefined
    if (useImage && reader.remainByte() >= 2) {
      imageId = reader.readUInt16()
    }
    
    const bullet = new Bullet(
      this.result.bullets.length,
      bulletChar,
      useImage,
      imageId,
      checkChar !== '\0' ? checkChar : undefined,
    )
    
    this.result.bullets.push(bullet)
  }

  private visit = (record: HWPRecord) => {
    switch (record.tagID) {
      case DocInfoTagID.HWPTAG_DOCUMENT_PROPERTIES: {
        this.visitDocumentPropertes(record)
        break
      }

      case DocInfoTagID.HWPTAG_CHAR_SHAPE: {
        this.visitCharShape(record)
        break
      }

      case DocInfoTagID.HWPTAG_FACE_NAME: {
        this.visitFaceName(record)
        break
      }

      case DocInfoTagID.HWPTAG_BIN_DATA: {
        this.visitBinData(record)
        break
      }

      case DocInfoTagID.HWPTAG_BORDER_FILL: {
        this.visitBorderFill(record)
        break
      }

      case DocInfoTagID.HWPTAG_PARA_SHAPE: {
        this.visitParagraphShape(record)
        break
      }

      case DocInfoTagID.HWPTAG_COMPATIBLE_DOCUMENT: {
        this.visitCompatibleDocument(record)
        break
      }

      case DocInfoTagID.HWPTAG_LAYOUT_COMPATIBILITY: {
        this.visitLayoutCompatibility(record)
        break
      }

      case DocInfoTagID.HWPTAG_STYLE: {
        this.visitStyle(record)
        break
      }

      case DocInfoTagID.HWPTAG_NUMBERING: {
        this.visitNumbering(record)
        break
      }

      case DocInfoTagID.HWPTAG_BULLET: {
        this.visitBullet(record)
        break
      }

      default:
        break
    }

    record.children.forEach(this.visit)
  }

  parse() {
    this.record.children.forEach(this.visit)
    return this.result
  }
}

export default DocInfoParser
