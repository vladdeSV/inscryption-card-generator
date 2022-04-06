import { Card } from '../card'
import { Act1Resource } from '../temp'
import { BaseCardGenerator, bufferFromCommandBuilder } from './base'
import IM from '../im'
import { getGemCostResourceId } from '../fns/helpers'

export { LeshyCardGenerator }

const originalCardHeight = 190 // px
const fullsizeCardHeight = 1050 // px
const scale = fullsizeCardHeight / originalCardHeight

type Options = { border?: boolean, locale?: string }
class LeshyCardGenerator extends BaseCardGenerator<Act1Resource, Options> {

  generateFront(card: Card): Promise<Buffer> {
    const im = IM()

    // parts are shifted if having terrain card layout
    const terrainLayoutXoffset = card.flags.terrainLayout ? -70 : 0

    // set up defaults
    im.font(this.resource.get('font', 'default'))
      .pointsize(200)
      .background('None')
      .filter('Box')

    let type: 'common' | 'rare' | 'terrain' = 'common'

    if (card.flags.terrain) {
      type = 'terrain'
    }

    if (card.flags.rare) {
      type = 'rare'
    }

    // load card
    im.resource(this.resource.get('card', type))

    if (card.portrait?.type) {
      switch (card.portrait?.type) {
        case 'resource': {
          im.resource(this.resource.get('portrait', card.portrait.resourceId))
          break
        }
        case 'creature': {
          im.resource(this.resource.get('portrait', card.portrait.id))
          break
        }
        case 'custom': {
          im.parens(IM('-').resizeExt(g => g.size(114, 94).flag('>')))
          break
        }
        case 'deathcard': {
          const data = card.portrait.data
          const dc = IM(this.resource.get('deathcard', 'base'))
            .gravity('NorthWest')
            .resource(this.resource.get('deathcard', `head_${data.headType}`)).composite()
            .resource(this.resource.get('deathcard', `mouth_${data.mouthIndex + 1}`)).geometry(40, 68).composite()
            .resource(this.resource.get('deathcard', `eyes_${data.eyesIndex + 1}`)).geometry(40, 46).composite()

          if (data.lostEye) {
            // draw black box over left-side eye
            dc.parens(IM().command('xc:black[17x17]').geometry(40, 46)).composite()
          }

          im.parens(dc)
          break
        }
      }

      im.gravity('Center')
        .geometry(1, -15)
        .composite()
    }

    // resize
    im.resize(undefined, fullsizeCardHeight) // 1050 pixels @ 300dpi = 3.5 inches

    // set default gravity
    im.gravity('NorthWest')

    // tribes
    const tribePositions: [number, number][] = [[-12, 3], [217, 5], [444, 7], [89, 451], [344, 452]]
    for (const [index, tribe] of card.tribes.filter(tribe => tribe !== 'squirrel').entries()) {
      const tribeLocation = this.resource.get('tribe', tribe)
      const position = tribePositions[index]

      im.parens(
        IM(tribeLocation)
          .resize(undefined, 354)
          .gravity('NorthWest')
          .alpha('Set')
          .command('-channel').command('A').command('-evaluate').command('multiply').command('0.4').command('+channel')
      ).geometry(position[0], position[1])
        .composite()
    }

    // card cost
    if (card.cost) {
      const costType = card.cost.type
      let costPath: string | undefined = undefined
      if (costType === 'blood' || costType === 'bone') {
        const { type, amount } = card.cost
        costPath = this.resource.get('cost', `${type}_${amount}`)
      } else if (costType === 'gem') {
        const a = getGemCostResourceId(card.cost.gems)
        if (a) {
          costPath = this.resource.get('cost', a)
        }
      } else {
        // throw new Error(`debug: unsupported cost type '${costType}', remove this error message later`)
      }

      if (costPath) {
        im.parens(
          IM(costPath)
            .interpolate('Nearest')
            .filter('Point')
            .resize(284)
            .filter('Box')
            .gravity('East')
        ).gravity('NorthEast')
          .geometry(32, 110)
          .composite()

        im.gravity('NorthWest')
      }
    }

    // health
    if (!card.flags.hidePowerAndHealth) {
      const healthWidth = 114
      const healthHeight = 215
      im.parens(
        IM()
          .pointsize()
          .size(healthWidth, healthHeight)
          .label(card.health)
          .gravity('East')
          .extent(healthWidth, healthHeight)
      ).gravity('NorthEast')
        .geometry(32 - terrainLayoutXoffset, 815)
        .composite()
    }

    // special stat icons
    if (card.statIcon !== undefined) {
      im.parens(
        IM(this.resource.get('staticon', card.statIcon))
          .interpolate('Nearest')
          .filter('Point')
          .resize(245)
          .filter('Box')
          .gravity('NorthWest')
      ).geometry(5, 705)
        .composite()
    } else if (card.power !== undefined) {
      const drawPower = !(card.power === 0 && card.flags.terrainLayout || card.flags.hidePowerAndHealth)
      if (drawPower) {
        const w = 114
        const h = 215

        im.parens(
          IM()
            .pointsize()
            .size(w, h)
            .gravity('West')
            .label(card.power)
            .extent(w, h)
        ).gravity('NorthWest')
          .geometry(68, 729)
          .composite()
      }
    }

    if (card.sigils.length === 1) {
      const sigilPath = this.resource.has('sigil', card.sigils[0]) ? this.resource.get('sigil', card.sigils[0]) : this.resource.get('sigil', 'missing')
      im.parens(
        IM(sigilPath)
          .interpolate('Nearest')
          .filter('Point')
          .resize(undefined, 253)
          .filter('Box')
      ).gravity('NorthWest')
        .geometry(221 + terrainLayoutXoffset, 733)
        .composite()
    } else if (card.sigils.length === 2) {
      const sigilPath1 = this.resource.has('sigil', card.sigils[0]) ? this.resource.get('sigil', card.sigils[0]) : this.resource.get('sigil', 'missing')
      const sigilPath2 = this.resource.has('sigil', card.sigils[1]) ? this.resource.get('sigil', card.sigils[1]) : this.resource.get('sigil', 'missing')

      im.filter('Box')

      im.parens(IM(sigilPath1).resize(undefined, 180))
        .gravity('NorthWest')
        .geometry(180 + terrainLayoutXoffset, 833)
        .composite()

      im.parens(IM(sigilPath2).resize(undefined, 180))
        .gravity('NorthWest')
        .geometry(331 + terrainLayoutXoffset, 720)
        .composite()
    }

    if (card.flags.squid) {
      const squidTitlePath = this.resource.get('misc', 'squid_title')
      im.parens(
        IM(squidTitlePath)
          .interpolate('Nearest')
          .filter('Point')
          .resize(undefined, 152)
          .filter('Box')
          .gravity('North')
          .geometry(0, 20)
      ).composite()
    } else if (card.name) {
      const escapedName = card.name.replace(/[\\']/g, '')

      // default for english
      let size = { w: 570, h: 135 }
      let position = { x: 0, y: 28 }

      const locale = this.options.locale
      if (locale === 'ko') {
        im.font(this.resource.get('font', locale))
        position = { x: 4, y: 34 }
      } else if (locale === 'jp' || locale === 'zh-cn' || locale === 'zh-tw') {
        size = { w: 570, h: 166 }
        position = { x: 0, y: 16 }
        im.font(this.resource.get('font', locale))
      }

      im.parens(
        IM()
          .pointsize()
          .size(size.w, size.h)
          .background('None')
          .label(escapedName)
          .trim()
          .gravity('Center')
          .extent(size.w, size.h)
          .resizeExt(g => g.scale(106, 100).flag('!'))
      ).gravity('North')
        .geometry(position.x, position.y)
        .composite()
        .font(this.resource.get('font', 'default'))
    }

    if (this.options.border) {
      const backgroundPath = this.resource.get('cardbackground', (type === 'rare') ? 'rare' : (type === 'terrain' ? 'terrain' : 'common'))
      const background = IM(backgroundPath).resize(813, 1172)
      im.gravity('Center')
        .extent(813, 1172)
        .parens(background)
        .compose('DstOver')
        .composite()
        .compose('SrcOver')
    }

    if (card.flags.golden) {
      im.parens(
        IM().command('-clone').command('0').command('-fill').command('rgb(255,128,0)').command('-colorize').command('75')
      ).geometry(0, 0)
        .compose('HardLight')
        .composite()

      // use emission for default portraits
      if (card.portrait && card.portrait?.type === 'creature') {
        if (this.resource.has('emission', card.portrait.id)) {
          const emissionPath = this.resource.get('emission', card.portrait.id)
          im.parens(
            IM(emissionPath)
              .filter('Box')
              .command('-resize').command(`${scale * 100}%`)
              .gravity('Center')
              .geometry(0, -15 * scale)
          ).compose('Overlay').composite()
        }
      }
    }

    const decals: string[] = []
    // special case, as combined cards have multiple decals
    if (card.flags.fused) {
      decals.push('fungus', 'blood', 'stitches')
    }

    if (card.flags.smoke) {
      decals.push('smoke')
    }

    // decals
    for (const decal of decals) {
      const decalPath = this.resource.get('decal', decal)
      im.parens(
        IM(decalPath)
          .filter('Box')
          .resize(undefined, fullsizeCardHeight)
      ).gravity('Center')
        .composite()
    }

    if (card.flags.enhanced && card.portrait?.type === 'creature') {
      if (this.resource.has('emission', card.portrait.id)) {
        const emissionPath = this.resource.get('emission', card.portrait.id)

        for (const i of [false, true]) {
          const im2 = IM(emissionPath)
            .command('-fill').command('rgb(161,247,186)').command('-colorize').command('100').command('-resize').command(`${scale * 100}%`)
            .gravity('Center')
            .geometry(3, -15 * scale)

          if (i === true) {
            im2.command('-blur').command('0x10')
          }

          im.parens(im2).composite()
        }
      }
    }

    let input: Buffer | undefined
    if (card.portrait?.type === 'custom') {
      input = card.portrait.data.common
    }

    return bufferFromCommandBuilder(im, input)
  }
}
