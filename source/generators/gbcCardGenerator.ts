import { Card } from '../card'
import { ImageMagickCommandBuilder } from '../im/commandBuilder'
import { BaseCardGenerator, bufferFromCommandBuilder } from './base'
import IM from '../im'
import { getGemCostResourceId } from '../fns/helpers'

export { GbcCardGenerator }

const originalCardHeight = 56 // px, size: 42x56
const fullsizeCardHeight = 1050 // px
const scale = fullsizeCardHeight / originalCardHeight

class GbcCardGenerator extends BaseCardGenerator<any, { border?: boolean, scanlines?: boolean }> {
  generateFront(card: Card): Promise<Buffer> {
    const im = IM()

    // set up defaults
    im.font(this.resource.get('font', 'default'))
      .pointsize(16)
      .gravity('Center')
      .background('None')
      .filter('Box')

    const cardType = ((card: Card): 'common' | 'rare' | 'terrain' | 'terrain_rare' => {
      if (card.flags.terrain) {
        if (card.flags.rare) {
          return 'terrain_rare'
        }
        return 'terrain'
      }

      if (card.flags.rare) {
        return 'rare'
      }

      return 'common'
    })(card)

    // load card
    im.resource(this.resource.get('card', cardType))

    // portrait
    if (card.portrait) {
      im.gravity('NorthWest')

      if (card.portrait.type === 'creature') {
        im.parens(IM().resource(this.resource.get('portrait', card.portrait.id)))
          .geometry(1, 1)
      } else if (card.portrait.type === 'custom' && card.portrait.data.gbc) {
        im.parens(
          IM('-')
            .filter('Point')
            .gravity('North')
            .interpolate('Nearest')
            .resizeExt(g => g.size(41, 28).flag('>'))
        ).geometry(0, 1)
      }

      im.composite()
    }

    // staticon or power
    if (card.statIcon) {
      im.gravity('SouthWest')
        .resource(this.resource.get('staticon', card.statIcon))
        .geometry(2, 2)
        .composite()
    } else {
      im.gravity('SouthWest')
        .command('-draw')
        .command(`text 2,0 "${Number(card.power)}"`)
    }

    if (card.cost) {
      im.gravity('NorthEast')

      const costType = card.cost.type
      if (costType === 'blood' || costType === 'bone' || costType === 'energy') {
        const { type, amount } = card.cost
        const costPath = this.resource.get('cost', `${type}_${amount}`)
        im.resource(costPath).composite()
      }

      if (costType === 'gem') {
        const gemCostResourceId = getGemCostResourceId(card.cost.gems)
        if (gemCostResourceId !== undefined) {
          im.resource(this.resource.get('cost', gemCostResourceId)).composite()
        }
      }
    }

    // health
    im.gravity('SouthEast').command('-draw').command(`text 0,0 "${card.health}"`)

    // sigils
    if (card.sigils.length === 1) {

      const sigil = card.sigils[0]
      let sigilYOffset = 0

      if (sigil.startsWith('conduit')) {
        im.resource(this.resource.get('misc', 'conduit')).gravity('North').geometry(1, 32).composite()
      } else if (sigil.startsWith('activated')) {
        sigilYOffset = 2
        im.resource(this.resource.get('misc', 'ability_button')).gravity('NorthWest').geometry(8, 31).composite()
      }

      if (sigil !== 'conduitnull') {
        im.resource(this.resource.get('sigil', sigil, 'missing')).gravity('North').geometry(0, 31 + sigilYOffset).composite()
      }
    } else if (card.sigils.length >= 2) {
      im.gravity('NorthWest')
      im.resource(this.resource.get('sigil', card.sigils[0], 'missing')).geometry(4, 31).composite()
      im.resource(this.resource.get('sigil', card.sigils[1], 'missing')).geometry(22, 31).composite()
    }

    // fused
    if (card.flags.fused) {
      im.gravity('Center').resource(this.resource.get('misc', 'stitches')).composite()
    }

    // black outline onto card
    im.command('-fill').command('none').command('-stroke').command('rgb\\(2,10,17\\)').command('-strokewidth').command('0').command('-draw').command('rectangle 0,0 41,55')

    // increase size for all cards, to account for frame
    im.gravity('Center').extent(44, 58)

    // frame
    if (card.flags.rare) {
      im.gravity('NorthWest').resource(this.resource.get('frame', card.temple)).geometry(0, 0).composite()
    }

    // border
    if (this.options.border) {
      this.extendedBorder(im)
    }

    // scanlines
    if (this.options.scanlines) {
      this.scanlines(im)
    }

    // resize
    im.resizeExt(g => g.scale(scale * 100))

    let input: Buffer | undefined
    if (card.portrait?.type === 'custom') {
      input = card.portrait.data.common
    }

    return bufferFromCommandBuilder(im, input)
  }

  generateBack(type: 'common' | 'submerged' = 'common'): Promise<Buffer> {
    const im = IM(this.resource.get('cardback', type))
      .gravity('Center')
      .background('None')
      .filter('Box')

    // increase size to match regular cards
    im.extent(44, 58)

    // border
    if (this.options.border) {
      this.extendedBorder(im)
    }

    // scanlines
    if (this.options.scanlines) {
      this.scanlines(im)
    }

    // resize
    im.resizeExt(g => g.scale(scale * 100)) // 1050 pixels @ 300dpi = 3.5 inches

    return bufferFromCommandBuilder(im)
  }

  private extendedBorder(im: ImageMagickCommandBuilder): ImageMagickCommandBuilder {
    const extraSize = 12
    im.gravity('Center').background('#d7e2a3').extent(44 + extraSize, 58 + extraSize)

    return im
  }

  private scanlines(im: ImageMagickCommandBuilder): ImageMagickCommandBuilder {
    const tileableScanline = IM()
      .command('-stroke').command('black')
      .size(1, 2)
      .command('xc:transparent')
      .command('-draw')
      .command('rectangle 0,0 0,0')

    const scanlines = IM()
      .parens(tileableScanline)
      .command('-write').command('mpr:tile').command('+delete').command('-size').command('100x100').command('tile:mpr:tile')
      .command('-channel').command('A').command('-evaluate').command('multiply').command('0.1').command('+channel')

    im.parens(scanlines)
      .compose('Atop')
      .composite()

    return im
  }
}
