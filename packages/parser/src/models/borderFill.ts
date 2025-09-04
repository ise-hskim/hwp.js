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

import { RGB } from '../types/color'

interface BorerStyle {
  type: number
  width: number
  color: RGB
}

export interface BorderFillStyle {
  left: BorerStyle
  right: BorerStyle
  top: BorerStyle
  bottom: BorerStyle
}

export enum GradientType {
  Linear = 0,
  Radial = 1,
  Conic = 2,
  Square = 3,
}

export interface GradientFill {
  type: GradientType
  angle: number
  centerX: number
  centerY: number
  step: number
  colorNum: number
  colors: Array<{
    pos: number
    color: RGB
  }>
}

class BorderFill {
  // TODO: (@hahnlee) getter & setter 만들기
  attribute: number

  style: BorderFillStyle

  backgroundColor: RGB | null = null

  // Gradient properties
  fillType?: number
  gradientFill?: GradientFill

  constructor(
    attribute: number,
    style: BorderFillStyle,
  ) {
    this.attribute = attribute
    this.style = style
  }
}

export default BorderFill
