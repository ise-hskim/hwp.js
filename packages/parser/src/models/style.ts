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

export enum StyleType {
  Para = 0,  // 문단 스타일
  Char = 1,  // 문자 스타일
}

export enum StyleLanguage {
  Hangul = 0,  // 한글
  Latin = 1,   // 영어
  Hanja = 2,   // 한자
  Japanese = 3, // 일본어
  Other = 4,   // 기타
  Symbol = 5,  // 기호
  User = 6,    // 사용자 정의
}

export interface Style {
  id: number;
  name: string;
  englishName: string;
  type: StyleType;
  nextStyleId: number;
  languageId: StyleLanguage;
  paragraphShapeId: number;
  charShapeId: number;
}

class HWPStyle implements Style {
  public id: number;
  public name: string;
  public englishName: string;
  public type: StyleType;
  public nextStyleId: number;
  public languageId: StyleLanguage;
  public paragraphShapeId: number;
  public charShapeId: number;

  constructor(
    id: number,
    name: string,
    englishName: string,
    type: StyleType,
    nextStyleId: number,
    languageId: StyleLanguage,
    paragraphShapeId: number,
    charShapeId: number,
  ) {
    this.id = id;
    this.name = name;
    this.englishName = englishName;
    this.type = type;
    this.nextStyleId = nextStyleId;
    this.languageId = languageId;
    this.paragraphShapeId = paragraphShapeId;
    this.charShapeId = charShapeId;
  }
}

export default HWPStyle;