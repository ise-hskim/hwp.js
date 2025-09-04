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

export interface Bullet {
  id: number;
  char: string;          // 글머리표 문자
  useImage: boolean;     // 이미지 사용 여부
  imageId?: number;      // BinData ID (이미지 사용 시)
  checkChar?: string;    // 체크박스용 문자
}

class HWPBullet implements Bullet {
  public id: number;
  public char: string;
  public useImage: boolean;
  public imageId?: number;
  public checkChar?: string;

  constructor(
    id: number,
    char: string,
    useImage: boolean = false,
    imageId?: number,
    checkChar?: string,
  ) {
    this.id = id;
    this.char = char;
    this.useImage = useImage;
    this.imageId = imageId;
    this.checkChar = checkChar;
  }

  /**
   * 기본 글머리표 문자들
   */
  static readonly DEFAULT_BULLETS = [
    '•',   // 0: 검은 원
    '◦',   // 1: 흰 원
    '▪',   // 2: 검은 사각형
    '▫',   // 3: 흰 사각형
    '◆',   // 4: 검은 다이아몬드
    '◇',   // 5: 흰 다이아몬드
    '■',   // 6: 큰 검은 사각형
    '□',   // 7: 큰 흰 사각형
    '▶',   // 8: 검은 삼각형
    '▷',   // 9: 흰 삼각형
    '★',   // 10: 검은 별
    '☆',   // 11: 흰 별
    '※',   // 12: 참고 기호
    '☞',   // 13: 손가락
    '☜',   // 14: 손가락 (왼쪽)
    '♣',   // 15: 클로버
    '♠',   // 16: 스페이드
    '♥',   // 17: 하트
    '♦',   // 18: 다이아몬드
    '○',   // 19: 큰 흰 원
    '●',   // 20: 큰 검은 원
    '△',   // 21: 큰 흰 삼각형
    '▲',   // 22: 큰 검은 삼각형
    '▽',   // 23: 역삼각형 (흰색)
    '▼',   // 24: 역삼각형 (검은색)
  ];

  /**
   * 체크박스용 문자들
   */
  static readonly CHECKBOX_CHARS = [
    '☐',   // 빈 체크박스
    '☑',   // 체크된 체크박스
    '☒',   // X 표시 체크박스
  ];
}

export default HWPBullet;