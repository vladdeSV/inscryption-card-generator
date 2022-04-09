// export { generateAct2Card, generateAct2BackCard, generateAct2NpcCard, Npc }

// import { Resource } from '../resource'
// import IM from '../im'
// import { Card } from '../card'
// import { execSync } from 'child_process'
// import { ImageMagickCommandBuilder } from '../im/commandBuilder'
// import { getGemCostResourceId } from './helpers'

// type Npc = 'angler' | 'bluewizard' | 'briar' | 'dredger' | 'dummy' | 'greenwizard' | 'inspector' | 'orangewizard' | 'royal' | 'sawyer' | 'melter' | 'trapper' | 'prospector'

// const originalCardHeight = 56 // px, size: 42x56
// const fullsizeCardHeight = 1050 // px
// const scale = fullsizeCardHeight / originalCardHeight

// function generateAct2Card(card: Card & { npc?: Npc }, res: Resource, options: { border?: boolean, scanlines?: boolean } = {}): Buffer {}

// function extendedBorder(im: ImageMagickCommandBuilder): ImageMagickCommandBuilder {
//   const extraSize = 12
//   im.gravity('Center').background('#d7e2a3').extent(44 + extraSize, 58 + extraSize)

//   return im
// }

// function scanlines(im: ImageMagickCommandBuilder): ImageMagickCommandBuilder {
//   const tileableScanline = IM()
//     .command('-stroke black')
//     .size(1, 2)
//     .command('xc:transparent')
//     .command('-draw "rectangle 0,0 0,0"')

//   const scanlines = IM()
//     .parens(tileableScanline)
//     .command('-write mpr:tile +delete -size 100x100 tile:mpr:tile')
//     .command('-channel A -evaluate multiply 0.1 +channel')

//   im.parens(scanlines)
//     .compose('Atop')
//     .composite()

//   return im
// }

// function generateAct2BackCard(type: 'common' | 'submerged', res: Resource, options: { border?: boolean, scanlines?: boolean } = {}) {
//   // npc
//   const im = IM(res.get('cardback', type))
//     .gravity('Center')
//     .background('None')
//     .filter('Box')

//   // increase size to match regular cards
//   im.extent(44, 58)

//   // border
//   if (options.border) {
//     extendedBorder(im)
//   }

//   // scanlines
//   if (options.scanlines) {
//     scanlines(im)
//   }

//   // resize
//   im.resizeExt(g => g.scale(scale * 100)) // 1050 pixels @ 300dpi = 3.5 inches

//   return execSync(im.build('convert', '-'))
// }

// function generateAct2NpcCard(npc: Npc, res: Resource, options: { border?: boolean, scanlines?: boolean } = {}) {
//   // npc
//   const im = IM(res.get('npc', npc))
//     .gravity('Center')
//     .background('None')
//     .filter('Box')

//   // increase size to match regular cards
//   im.extent(44, 58)

//   // border
//   if (options.border) {
//     extendedBorder(im)
//   }

//   // scanlines
//   if (options.scanlines) {
//     scanlines(im)
//   }

//   // resize
//   im.resizeExt(g => g.scale(scale * 100)) // 1050 pixels @ 300dpi = 3.5 inches

//   return execSync(im.build('convert', '-'))
// }
