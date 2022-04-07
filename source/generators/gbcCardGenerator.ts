import { Card } from '../card'
import { ImageMagickCommandBuilder } from '../im/commandBuilder'
import { Act1Resource } from '../temp'
import { BaseCardGenerator } from './base'
import IM from '../im'
import { getGemCostResourceId } from '../fns/helpers'

const originalCardHeight = 56 // px, size: 42x56
const fullsizeCardHeight = 1050 // px
const scale = fullsizeCardHeight / originalCardHeight

class GbcCardGenerator extends BaseCardGenerator<any, { border?: boolean, scanlines?: boolean }> {
  generateFront(card: Card): Promise<Buffer> {
    throw new Error('Method not implemented.')
  }

  generateBack(): Promise<Buffer> {
    throw new Error('Method not implemented.')
  }

  private extendedBorder(im: ImageMagickCommandBuilder): ImageMagickCommandBuilder {
    const extraSize = 12
    im.gravity('Center').background('#d7e2a3').extent(44 + extraSize, 58 + extraSize)

    return im
  }

  private scanlines(im: ImageMagickCommandBuilder): ImageMagickCommandBuilder {
    const tileableScanline = IM()
      .command('-stroke black')
      .size(1, 2)
      .command('xc:transparent')
      .command('-draw "rectangle 0,0 0,0"')

    const scanlines = IM()
      .parens(tileableScanline)
      .command('-write mpr:tile +delete -size 100x100 tile:mpr:tile')
      .command('-channel A -evaluate multiply 0.1 +channel')

    im.parens(scanlines)
      .compose('Atop')
      .composite()

    return im
  }
}
