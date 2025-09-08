#!/usr/bin/env node
/*
  Markdown relative link checker for hwp-file-format-5.0
  Usage: node scripts/check_links.js
*/
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')

function walk(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      walk(full, fileList)
    } else if (e.isFile() && e.name.endsWith('.md')) {
      fileList.push(full)
    }
  }
  return fileList
}

function isExternalLink(link) {
  return /^(https?:)?\/\//i.test(link)
}

function buildAnchorSet(markdown) {
  // Collect heading lines and build GitHub-like slugs (basic)
  const anchors = new Set()
  const lines = markdown.split(/\r?\n/)
  for (const line of lines) {
    const m = /^(#{1,6})\s+(.+)$/.exec(line.trim())
    if (!m) continue
    const text = m[2]
      .toLowerCase()
      .replace(/[`_*~]/g, '')
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
    if (text) anchors.add(text)
  }
  return anchors
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const rels = []
  const re = /\[[^\]]*\]\(([^)]+)\)/g
  let m
  while ((m = re.exec(content)) !== null) {
    const raw = m[1].trim()
    if (isExternalLink(raw)) continue
    if (raw.startsWith('mailto:')) continue
    const [p, frag] = raw.split('#')
    if (!p || p.length === 0) continue
    const target = path.resolve(path.dirname(filePath), p)
    rels.push({ raw, target, frag: frag || '' })
  }
  const missing = []
  for (const r of rels) {
    if (!fs.existsSync(r.target)) {
      missing.push({ raw: r.raw, reason: 'file' })
      continue
    }
    if (r.frag) {
      const md = fs.readFileSync(r.target, 'utf8')
      const anchors = buildAnchorSet(md)
      const slug = r.frag.toLowerCase()
      if (!anchors.has(slug)) {
        missing.push({ raw: r.raw, reason: 'anchor' })
      }
    }
  }
  return missing
}

function main() {
  const files = walk(ROOT, [])
  let totalMissing = 0
  for (const f of files) {
    const missing = checkFile(f)
    if (missing.length) {
      console.log(`\n[Missing links] ${path.relative(ROOT, f)}`)
      for (const m of missing) {
        totalMissing++
        console.log(`  - ${m.raw} (${m.reason} not found)`)
      }
    }
  }
  if (totalMissing === 0) {
    console.log('All relative markdown links (including anchors) resolved ✅')
  } else {
    console.log(`\nTotal missing links: ${totalMissing} ❌`)
    process.exitCode = 1
  }
}

main()
