# HWP to IR Mapping Guide

## Unit Conversion

### HWPUNIT System
- Base unit: 1 HWPUNIT = 1/7200 inch
- Conversion factors:
  ```
  1 inch = 7200 HWPUNIT
  1 mm = 283.465 HWPUNIT  
  1 pt = 100 HWPUNIT
  1 px (96 DPI) = 75 HWPUNIT
  ```

### Converting to CSS
```javascript
// HWPUNIT to pixels (assuming 96 DPI)
function hwpunitToPixels(hwpunit) {
  return hwpunit / 75;
}

// HWPUNIT to points
function hwpunitToPoints(hwpunit) {
  return hwpunit / 100;
}
```

## Anchor Rules

### Page-relative Anchoring
Objects anchored to page use absolute positioning:
```css
.page-anchored {
  position: absolute;
  /* Calculate from page margins */
}
```

### Paragraph-relative Anchoring
Objects flow with text:
```css
.paragraph-anchored {
  position: relative;
  display: inline-block;
}
```

## Space/Whitespace Policy

### Continuous Spaces
Korean documents often use multiple spaces for formatting:
- Use `white-space: pre-wrap` for paragraphs with formatting spaces
- Use `white-space: pre` for strict space preservation
- Default to `white-space: normal` for regular text

### Line Breaking
Korean text line breaking rules:
- Allow breaks between Korean characters
- Preserve explicit line breaks (soft/hard)
- Use `word-break: keep-all` for Korean text

## Text Alignment

### Alignment Mapping
```javascript
const alignmentMap = {
  0: 'left',
  1: 'center',
  2: 'right',
  3: 'justify',
  4: 'distribute'  // Special Korean justification
};
```

### Distribute Alignment
Distribute alignment spreads characters evenly:
```css
.distribute {
  text-align: justify;
  text-justify: distribute;
}
```

## Line Spacing

Line spacing is stored as percentage:
- 100 = single spacing
- 160 = 1.6 line height
- 200 = double spacing

```javascript
function lineSpacingToCSS(lineSpacing) {
  return lineSpacing / 100;
}
```

## Font Handling

### Font Fallback Chain
```css
.korean-text {
  font-family: 
    "함초롬바탕",      /* HWP default */
    "맑은 고딕",       /* Windows Korean */
    "Apple SD Gothic Neo", /* macOS Korean */
    "Noto Sans KR",    /* Web font */
    sans-serif;
}
```

### Font Size Conversion
HWP uses 100 units = 1pt:
```javascript
function hwpFontSizeToPoints(size) {
  return size / 100;
}
```

## Table Layout

### Column Width Preservation
Use percentage-based widths with fixed table layout:
```css
table {
  table-layout: fixed;
  width: 100%;
}

td {
  width: calc(column_width / table_width * 100%);
}
```

## Shape/Line Rendering

### Line Drawing
Render lines as styled divs:
```css
.hwp-line {
  position: absolute;
  background-color: var(--line-color);
  height: var(--line-width);
  width: var(--line-length);
}
```

### Shape Positioning
Use absolute positioning within containers:
```css
.shape-container {
  position: relative;
}

.hwp-shape {
  position: absolute;
  left: var(--x-offset);
  top: var(--y-offset);
}
```

## Special Characters

### Non-breaking Space
- HWP code: 0x00A0
- HTML: `&nbsp;`

### Soft Hyphen
- HWP code: 0x00AD  
- HTML: `&shy;`

### Zero-width Space
- Used for line break hints
- HTML: `&#8203;`