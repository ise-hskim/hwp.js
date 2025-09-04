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

import Bullet from '../models/bullet'

describe('Bullet', () => {
  it('should create a text bullet', () => {
    const bullet = new Bullet(0, '•', false)
    
    expect(bullet.id).toBe(0)
    expect(bullet.char).toBe('•')
    expect(bullet.useImage).toBe(false)
    expect(bullet.imageId).toBeUndefined()
    expect(bullet.checkChar).toBeUndefined()
  })

  it('should create an image bullet', () => {
    const bullet = new Bullet(1, '', true, 5)
    
    expect(bullet.id).toBe(1)
    expect(bullet.char).toBe('')
    expect(bullet.useImage).toBe(true)
    expect(bullet.imageId).toBe(5)
  })

  it('should create a checkbox bullet', () => {
    const bullet = new Bullet(2, '☐', false, undefined, '☑')
    
    expect(bullet.id).toBe(2)
    expect(bullet.char).toBe('☐')
    expect(bullet.checkChar).toBe('☑')
  })

  it('should have default bullet characters', () => {
    expect(Bullet.DEFAULT_BULLETS).toContain('•')
    expect(Bullet.DEFAULT_BULLETS).toContain('◦')
    expect(Bullet.DEFAULT_BULLETS).toContain('▪')
    expect(Bullet.DEFAULT_BULLETS).toContain('▶')
    expect(Bullet.DEFAULT_BULLETS.length).toBeGreaterThan(10)
  })

  it('should have checkbox characters', () => {
    expect(Bullet.CHECKBOX_CHARS).toContain('☐')
    expect(Bullet.CHECKBOX_CHARS).toContain('☑')
    expect(Bullet.CHECKBOX_CHARS).toContain('☒')
  })
})