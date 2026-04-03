/**
 * Paste into Figma MCP `use_figma` for file key r8lrrpXwY1W6yL0kV4eB6d when quota allows,
 * or run from a dev plugin. Creates local paint + text styles and Library cover content
 * if missing (safe to re-run once styles exist — skips duplicates by name).
 */
function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 }
}

const paintDefs = [
  { name: 'Color/Primary/Canvas', hex: '#00875A' },
  { name: 'Color/Primary/Canvas Dark', hex: '#006B47' },
  { name: 'Color/Primary/Pressed', hex: '#005238' },
  { name: 'Color/Text/On Primary', hex: '#FFFFFF' },
  { name: 'Color/Text/Default', hex: '#1A1A1A' },
  { name: 'Color/Surface/Elevated', hex: '#F7F7F2' },
  { name: 'Color/Surface/Inverse CTA', hex: '#FFFBF5' },
  { name: 'Color/Semantic/Warning', hex: '#CC8800' },
  { name: 'Color/Semantic/Error', hex: '#C62828' },
]

const existingPaints = await figma.getLocalPaintStylesAsync()
const paintNames = new Set(existingPaints.map((s) => s.name))
const paintOut = []
for (const d of paintDefs) {
  if (paintNames.has(d.name)) continue
  const style = figma.createPaintStyle()
  style.name = d.name
  style.paints = [{ type: 'SOLID', color: hexToRgb(d.hex) }]
  paintOut.push(style.id)
}

await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' })

const textDefs = [
  { name: 'Text/Title/Large', size: 28, font: { family: 'Inter', style: 'Semi Bold' } },
  { name: 'Text/Title/Medium', size: 22, font: { family: 'Inter', style: 'Semi Bold' } },
  { name: 'Text/Body/Large', size: 17, font: { family: 'Inter', style: 'Regular' } },
  { name: 'Text/Body/Default', size: 15, font: { family: 'Inter', style: 'Regular' } },
  { name: 'Text/Caption', size: 13, font: { family: 'Inter', style: 'Regular' } },
  { name: 'Text/Button', size: 17, font: { family: 'Inter', style: 'Semi Bold' } },
]

const existingText = await figma.getLocalTextStylesAsync()
const textNames = new Set(existingText.map((s) => s.name))
const textOut = []
for (const d of textDefs) {
  if (textNames.has(d.name)) continue
  const ts = figma.createTextStyle()
  ts.name = d.name
  ts.fontName = d.font
  ts.fontSize = d.size
  ts.lineHeight = { unit: 'AUTO' }
  textOut.push(ts.id)
}

const lib = figma.root.children.find((p) => p.name === '01 — Library')
await figma.setCurrentPageAsync(lib)

const hasCover = lib.findOne((n) => n.name === 'Cover — Nomi MVP')
let coverId = hasCover ? hasCover.id : null
let extraIds = []

if (!hasCover) {
  const cover = figma.createFrame()
  cover.name = 'Cover — Nomi MVP'
  cover.layoutMode = 'VERTICAL'
  cover.primaryAxisSizingMode = 'AUTO'
  cover.counterAxisSizingMode = 'AUTO'
  cover.itemSpacing = 16
  cover.paddingLeft = 48
  cover.paddingRight = 48
  cover.paddingTop = 48
  cover.paddingBottom = 48
  cover.fills = [{ type: 'SOLID', color: hexToRgb('#00875A') }]
  cover.cornerRadius = 24
  cover.x = 120
  cover.y = 80
  lib.appendChild(cover)
  coverId = cover.id

  const title = figma.createText()
  title.fontName = { family: 'Inter', style: 'Semi Bold' }
  title.fontSize = 36
  title.characters = 'Nomi — MVP'
  title.fills = [{ type: 'SOLID', color: hexToRgb('#FFFFFF') }]
  cover.appendChild(title)

  const sub = figma.createText()
  sub.fontName = { family: 'Inter', style: 'Regular' }
  sub.fontSize = 15
  sub.characters = 'Canonical file · bold green canvas · align frames with screen IDs in inventory.md'
  sub.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 0.85 } }]
  cover.appendChild(sub)

  const swatchFrame = figma.createFrame()
  swatchFrame.name = 'Color swatches'
  swatchFrame.layoutMode = 'HORIZONTAL'
  swatchFrame.primaryAxisSizingMode = 'AUTO'
  swatchFrame.counterAxisSizingMode = 'AUTO'
  swatchFrame.itemSpacing = 16
  cover.appendChild(swatchFrame)

  for (let i = 0; i < Math.min(6, paintDefs.length); i++) {
    const r = figma.createRectangle()
    r.resize(72, 72)
    r.cornerRadius = 8
    r.fills = [{ type: 'SOLID', color: hexToRgb(paintDefs[i].hex) }]
    swatchFrame.appendChild(r)
    extraIds.push(r.id)
  }

  const compRow = figma.createFrame()
  compRow.name = 'Component placeholders'
  compRow.layoutMode = 'VERTICAL'
  compRow.itemSpacing = 12
  compRow.primaryAxisSizingMode = 'AUTO'
  compRow.counterAxisSizingMode = 'AUTO'
  cover.appendChild(compRow)

  const compNames = ['Button / Primary', 'Button / Secondary', 'Input / Phone', 'List row', 'Tab bar']
  for (const nm of compNames) {
    const c = figma.createComponent()
    c.name = nm
    c.layoutMode = 'HORIZONTAL'
    c.primaryAxisAlignItems = 'CENTER'
    c.counterAxisAlignItems = 'CENTER'
    c.paddingLeft = 24
    c.paddingRight = 24
    c.paddingTop = 16
    c.paddingBottom = 16
    c.resize(320, 56)
    c.fills = [{ type: 'SOLID', color: hexToRgb('#F7F7F2') }]
    c.strokes = [{ type: 'SOLID', color: hexToRgb('#006B47') }]
    c.strokeWeight = 1
    c.cornerRadius = 12
    const t = figma.createText()
    t.fontName = { family: 'Inter', style: 'Semi Bold' }
    t.fontSize = 14
    t.characters = nm
    t.fills = [{ type: 'SOLID', color: hexToRgb('#006B47') }]
    c.appendChild(t)
    compRow.appendChild(c)
    extraIds.push(c.id)
  }

  extraIds.push(title.id, sub.id, swatchFrame.id, compRow.id)
}

return {
  paintStyleIds: paintOut,
  textStyleIds: textOut,
  coverFrameId: coverId,
  extraNodeIds: extraIds,
}
