export { generateAct1Card, generateAct1BackCard, generateAct1BoonCard, generateAct1RewardCard, generateAct1TrialCard, generateAct1TarotCard }

import { Resource } from '../resource'
import IM from '../im'
import { Card } from '../card'
import { execSync } from 'child_process'
import { getGemCostResourceId } from './helpers'

const originalCardHeight = 190 // px
const fullsizeCardHeight = 1050 // px
const scale = fullsizeCardHeight / originalCardHeight

function generateAct1Card(card: Card, res: Resource, options: { border?: boolean, locale?: string } = {}): Buffer {
  const im = IM()

  // parts are shifted if having terrain card layout
  const terrainLayoutXoffset = card.flags.terrain ? -70 : 0

  // set up defaults
  im.font(res.get('font', 'default'))
    .pointsize(200)
    .background('None')
    .filter('Box')

  // load card
  im.resource(res.get('card', card.type))

  if (card.portrait?.type) {
    switch (card.portrait?.type) {
      case 'resource': {
        im.resource(res.get('portrait', card.portrait.resourceId))
        break
      }
      case 'creature': {
        im.resource(res.get('portrait', card.portrait.id))
        break
      }
      case 'custom': {
        im.resource('-')
        break
      }
      case 'deathcard': {
        const data = card.portrait.data
        const dc = IM(res.get('deathcard', 'base'))
          .gravity('NorthWest')
          .resource(res.get('deathcard', `head_${data.headType}`)).composite()
          .resource(res.get('deathcard', `mouth_${data.mouthIndex + 1}`)).geometry(40, 68).composite()
          .resource(res.get('deathcard', `eyes_${data.eyesIndex + 1}`)).geometry(40, 46).composite()

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
  for (const [index, tribe] of card.tribes.entries()) {
    const tribeLocation = res.get('tribe', tribe)
    const position = tribePositions[index]

    im.parens(
      IM(tribeLocation)
        .resize(undefined, 354)
        .gravity('NorthWest')
        .alpha('Set')
        .command('-channel A -evaluate multiply 0.4 +channel')
    ).geometry(position[0], position[1])
      .composite()
  }

  // card cost
  if (card.cost) {
    const costType = card.cost.type
    let costPath: string | undefined = undefined
    if (costType === 'blood' || costType === 'bone') {
      const { type, amount } = card.cost
      costPath = res.get('cost', `${type}_${amount}`)
    } else if (costType === 'gem') {
      const a = getGemCostResourceId(card.cost.gems)
      if (a) {
        costPath = res.get('cost', a)
      }
    } else {
      throw new Error(`debug: unsupported cost type '${costType}', remove this error message later`)
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
  if (!card.flags.hideHealth) {
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
      IM(res.get('staticon', card.statIcon))
        .interpolate('Nearest')
        .filter('Point')
        .resize(245)
        .filter('Box')
        .gravity('NorthWest')
    ).geometry(5, 705)
      .composite()
  } else if (card.power !== undefined) {
    const drawPower = !(card.power === 0 && card.flags.terrain || card.flags.hidePower)
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
    const sigilPath = res.has('sigil', card.sigils[0]) ? res.get('sigil', card.sigils[0]) : res.get('sigil', 'missing')
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
    const sigilPath1 = res.has('sigil', card.sigils[0]) ? res.get('sigil', card.sigils[0]) : res.get('sigil', 'missing')
    const sigilPath2 = res.has('sigil', card.sigils[1]) ? res.get('sigil', card.sigils[1]) : res.get('sigil', 'missing')

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
    const squidTitlePath = res.get('misc', 'squid_title')
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

    const locale = options.locale
    if (locale === 'ko') {
      im.font(res.get('font', locale))
      position = { x: 4, y: 34 }
    } else if (locale === 'jp' || locale === 'zh-cn' || locale === 'zh-tw') {
      size = { w: 570, h: 166 }
      position = { x: 0, y: 16 }
      im.font(res.get('font', locale))
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
      .font(res.get('font', 'default'))
  }

  if (options.border) {
    const backgroundPath = res.get('cardbackground', (card.type === 'rare') ? 'rare' : (card.type === 'terrain' ? 'terrain' : 'common'))
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
      IM().command('-clone 0 -fill rgb\\(255,128,0\\) -colorize 75')
    ).geometry(0, 0)
      .compose('HardLight')
      .composite()

    // use emission for default portraits
    if (card.portrait && card.portrait?.type === 'creature') {
      try {
        const emissionPath = res.get('emission', card.portrait.id)
        im.parens(
          IM(emissionPath)
            .filter('Box')
            .command(`-resize ${scale * 100}%`)
            .gravity('Center')
            .geometry(0, -15 * scale)
        ).compose('Overlay').composite()
      } catch {
        // ait dude
      }
    }
  }

  // special case, as combined cards have multiple decals
  if (card.flags.fused) {
    card.decals.push('fungus', 'blood', 'stitches')
  }

  // decals
  for (const decal of card.decals) {
    const decalPath = res.get('decal', decal)
    im.parens(
      IM(decalPath)
        .filter('Box')
        .resize(undefined, fullsizeCardHeight)
    ).gravity('Center')
      .composite()
  }

  if (card.flags.enhanced && card.portrait?.type === 'creature') {
    try {
      const emissionPath = res.get('emission', card.portrait.id)

      for (const i of [false, true]) {
        const im2 = IM(emissionPath)
          .command(`-fill rgb\\(161,247,186\\) -colorize 100 -resize ${scale * 100}%`)
          .gravity('Center')
          .geometry(3, -15 * scale)

        if (i === true) {
          im2.command('-blur 0x10')
        }

        im.parens(im2).composite()
      }
    } catch {
      // ait dude 2
    }
  }

  const opts: { input?: Buffer } = {}
  if (card.portrait?.type === 'custom') {
    opts.input = card.portrait.data.common
  }

  return execSync(im.build('convert', '-'), opts)
}

function generateAct1BackCard(type: 'bee' | 'common' | 'deathcard' | 'squirrel' | 'submerge', res: Resource, options: { border?: boolean } = {}): Buffer {
  const im = IM()
  im.resource(res.get('cardback', type))
    .background('None')
    .gravity('Center')
    .filter('Box')

  if (options.border) {
    const backgroundName = type === 'common' ? 'special' : 'common'

    im.extent(147, 212)
      .resource(res.get('cardbackground', backgroundName))
      .compose('DstOver')
      .composite()
      .compose('SrcOver')
  }

  im.resizeExt(g => g.scale(scale * 100))

  return execSync(im.build('convert', '-'))
}

function generateAct1BoonCard(boon: 'doubledraw' | 'singlestartingbone' | 'startingbones' | 'startinggoat' | 'startingtrees' | 'tutordraw', res: Resource, options: { border?: boolean } = {}): Buffer {
  const im = IM()
  im.resource(res.get('cardboon', boon))
    .background('None')
    .gravity('Center')
    .filter('Box')

  if (options.border) {
    im.extent(147, 212)
      .resource(res.get('cardbackground', 'common'))
      .compose('DstOver')
      .composite()
      .compose('SrcOver')
  }

  im.resizeExt(g => g.scale(scale * 100))

  im.parens(IM(res.get('boon', boon)).resize(284))
    .composite()

  return execSync(im.build('convert', '-'))
}

function generateAct1RewardCard(type: '1blood' | '2blood' | '3blood' | 'bones' | 'bird' | 'canine' | 'hooved' | 'insect' | 'reptile', res: Resource, options: { border?: boolean } = {}): Buffer {
  const im = IM()
  im.resource(res.get('cardreward', type))
    .background('None')
    .gravity('Center')
    .filter('Box')

  if (options.border) {
    im.extent(147, 212)
      .resource(res.get('cardbackground', 'common'))
      .compose('DstOver')
      .composite()
      .compose('SrcOver')
  }

  im.resizeExt(g => g.scale(scale * 100))

  return execSync(im.build('convert', '-'))
}

function generateAct1TrialCard(type: 'abilities' | 'blood' | 'bones' | 'flying' | 'pelts' | 'power' | 'rare' | 'ring' | 'strafe' | 'submerge' | 'toughness' | 'tribes', res: Resource, options: { border?: boolean } = {}): Buffer {
  const im = IM()
  im.resource(res.get('cardtrial', type))
    .background('None')
    .gravity('Center')
    .filter('Box')

  if (options.border) {
    im.extent(147, 212)
      .resource(res.get('cardbackground', 'common'))
      .compose('DstOver')
      .composite()
      .compose('SrcOver')
  }

  im.resizeExt(g => g.scale(scale * 100))

  return execSync(im.build('convert', '-'))
}

function generateAct1TarotCard(type: 'death' | 'devil' | 'empress' | 'fool' | 'tower', res: Resource, options: { border?: boolean } = {}): Buffer {
  const im = IM()
  im.resource(res.get('cardtarot', type))
    .background('None')
    .gravity('Center')
    .filter('Box')

  if (options.border) {
    im.extent(147, 212)
      .resource(res.get('cardbackground', 'common'))
      .compose('DstOver')
      .composite()
      .compose('SrcOver')
  }

  im.resizeExt(g => g.scale(scale * 100))

  return execSync(im.build('convert', '-'))
}
