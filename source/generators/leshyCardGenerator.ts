import { Card } from '../card'
import { BaseCardGenerator, bufferFromCommandBuilder, bufferFromCommandBuilderFds } from './base'
import IM from '../im'
import { Fds } from '../im/fds'
import { getGemCostResourceId } from '../helpers'
import { SingleResource } from '../resource'

export { LeshyCardGenerator, act1Resource }

const originalCardHeight = 190 // px
const fullsizeCardHeight = 1050 // px
const scale = fullsizeCardHeight / originalCardHeight

type Options = { border?: boolean, locale?: string }
class LeshyCardGenerator extends BaseCardGenerator<Options> {

  constructor(options: Options) {
    super(act1Resource, options)
  }

  generateFront(card: Card): Promise<Buffer> {
    const im = IM()
    const fds = new Fds()

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
            .gravity('Center')
            .geometry(1, -15)
            .composite()
          break
        }
        case 'creature': {
          im.resource(this.resource.get('portrait', card.portrait.id))
            .gravity('Center')
            .geometry(1, -15)
            .composite()
          break
        }
        case 'custom': {
          const portraitBuffer = card.portrait.data.common
          if (portraitBuffer) {
            const portraitFd = fds.fd(portraitBuffer)
            im.parens(IM(portraitFd).resizeExt(g => g.size(114, 94).flag('>')))
              .gravity('Center')
              .geometry(1, -15)
              .composite()
          }
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
            .gravity('Center')
            .geometry(1, -15)
            .composite()
          break
        }
      }
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
          .command('-channel', 'A', '-evaluate', 'multiply', '0.4', '+channel')
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

    const sigils = card.sigils?.slice(0, 2)
    if (sigils) {

      if (sigils.length === 1) {
        const sigilPath = this.resource.get('sigil', sigils[0])
        im.parens(
          IM(sigilPath)
            .interpolate('Nearest')
            .filter('Point')
            .resize(undefined, 253)
            .filter('Box')
        ).gravity('NorthWest')
          .geometry(221 + terrainLayoutXoffset, 733)
          .composite()
      }

      if (sigils.length === 2) {
        const sigilPath1 = this.resource.get('sigil', sigils[0])
        const sigilPath2 = this.resource.get('sigil', sigils[1])

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
        IM().command('-clone', '0', '-fill', 'rgb(255,128,0)', '-colorize', '75')
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
              .resizeExt(g => g.scale(scale * 100))
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
          const emission = IM(emissionPath)
            .command('-fill', 'rgb(161,247,186)', '-colorize', '100').resizeExt(g => g.scale(scale * 100))
            .gravity('Center')
            .geometry(3, -15 * scale)

          if (i === true) {
            emission.command('-blur', '0x10')
          }

          im.parens(emission).composite()
        }
      }
    }

    return bufferFromCommandBuilderFds(im, fds)
  }

  generateBack(type: keyof LeshyResourceMap['cardback'] = 'common'): Promise<Buffer> {
    const im = IM()
    im.resource(this.resource.get('cardback', type))
      .background('None')
      .gravity('Center')
      .filter('Box')

    if (this.options.border) {
      // logic is scuffed. if we have a common card (purple tint) we want the special background (also purple tint)
      const backgroundName = type === 'common' ? 'special' : 'common'

      im.extent(147, 212)
        .resource(this.resource.get('cardbackground', backgroundName))
        .compose('DstOver')
        .composite()
        .compose('SrcOver')
    }

    im.resizeExt(g => g.scale(scale * 100))

    return bufferFromCommandBuilder(im)
  }

  generateReward(type: keyof LeshyResourceMap['cardreward']): Promise<Buffer> {
    const im = IM()
    im.resource(this.resource.get('cardreward', type))
      .background('None')
      .gravity('Center')
      .filter('Box')

    if (this.options.border) {
      im.extent(147, 212)
        .resource(this.resource.get('cardbackground', 'common'))
        .compose('DstOver')
        .composite()
        .compose('SrcOver')
    }

    im.resizeExt(g => g.scale(scale * 100))

    return bufferFromCommandBuilder(im)
  }

  generateBoon(boon: keyof LeshyResourceMap['cardboon']): Promise<Buffer> {
    const im = IM()
    im.resource(this.resource.get('cardboon', boon))
      .background('None')
      .gravity('Center')
      .filter('Box')

    if (this.options.border) {
      im.extent(147, 212)
        .resource(this.resource.get('cardbackground', 'common'))
        .compose('DstOver')
        .composite()
        .compose('SrcOver')
    }

    im.resizeExt(g => g.scale(scale * 100))

    im.parens(IM(this.resource.get('boon', boon)).resize(284))
      .composite()

    return bufferFromCommandBuilder(im)
  }

  generateTrial(type: keyof LeshyResourceMap['cardtrial']): Promise<Buffer> {
    const im = IM()
    im.resource(this.resource.get('cardtrial', type))
      .background('None')
      .gravity('Center')
      .filter('Box')

    if (this.options.border) {
      im.extent(147, 212)
        .resource(this.resource.get('cardbackground', 'common'))
        .compose('DstOver')
        .composite()
        .compose('SrcOver')
    }

    im.resizeExt(g => g.scale(scale * 100))

    return bufferFromCommandBuilder(im)
  }

  generateTarot(type: keyof LeshyResourceMap['cardtarot']): Promise<Buffer> {
    const im = IM()
    im.resource(this.resource.get('cardtarot', type))
      .background('None')
      .gravity('Center')
      .filter('Box')

    if (this.options.border) {
      im.extent(147, 212)
        .resource(this.resource.get('cardbackground', 'common'))
        .compose('DstOver')
        .composite()
        .compose('SrcOver')
    }

    im.resizeExt(g => g.scale(scale * 100))

    return bufferFromCommandBuilder(im)
  }
}

type LeshyResourceMap = typeof act1ResourceMap
const act1ResourceMap = {
  'card': {
    'common': 'cards/common.png',
    'rare': 'cards/rare.png',
    'terrain': 'cards/terrain.png',
  },
  'cardback': {
    'bee': 'cardbacks/bee.png',
    'common': 'cardbacks/common.png',
    'deathcard': 'cardbacks/deathcard.png',
    'squirrel': 'cardbacks/squirrel.png',
    'submerged': 'cardbacks/submerge.png',
  },
  'cardbackground': {
    'common': 'cardbackgrounds/common.png',
    'rare': 'cardbackgrounds/rare.png',
    'special': 'cardbackgrounds/special.png',
    'terrain': 'cardbackgrounds/terrain.png',
  },
  'cardboon': {
    'doubledraw': 'cardboons/doubledraw.png',
    'singlestartingbone': 'cardboons/singlestartingbone.png',
    'startingbones': 'cardboons/startingbones.png',
    'startinggoat': 'cardboons/startinggoat.png',
    'startingtrees': 'cardboons/startingtrees.png',
    'tutordraw': 'cardboons/tutordraw.png',
  },
  'cardreward': {
    '1blood': 'cardrewards/1blood.png',
    '2blood': 'cardrewards/2blood.png',
    '3blood': 'cardrewards/3blood.png',
    'bird': 'cardrewards/bird.png',
    'bones': 'cardrewards/bones.png',
    'canine': 'cardrewards/canine.png',
    'hooved': 'cardrewards/hooved.png',
    'insect': 'cardrewards/insect.png',
    'reptile': 'cardrewards/reptile.png',
  },
  'cardtrial': {
    'abilities': 'cardtrials/abilities.png',
    'blood': 'cardtrials/blood.png',
    'bones': 'cardtrials/bones.png',
    'flying': 'cardtrials/flying.png',
    'pelts': 'cardtrials/pelts.png',
    'power': 'cardtrials/power.png',
    'rare': 'cardtrials/rare.png',
    'ring': 'cardtrials/ring.png',
    'strafe': 'cardtrials/strafe.png',
    'submerge': 'cardtrials/submerge.png',
    'toughness': 'cardtrials/toughness.png',
    'tribes': 'cardtrials/tribes.png',
  },
  'cardtarot': {
    'death': 'cardtarots/death.png',
    'devil': 'cardtarots/devil.png',
    'empress': 'cardtarots/empress.png',
    'fool': 'cardtarots/fool.png',
    'tower': 'cardtarots/tower.png',
  },
  'boon': {
    'doubledraw': 'boons/doubledraw.png',
    'singlestartingbone': 'boons/singlestartingbone.png',
    'startingbones': 'boons/startingbones.png',
    'startinggoat': 'boons/startinggoat.png',
    'startingtrees': 'boons/startingtrees.png',
    'tutordraw': 'boons/tutordraw.png',
  },
  'cost': {
    'blood_1': 'costs/blood1.png',
    'blood_2': 'costs/blood2.png',
    'blood_3': 'costs/blood3.png',
    'blood_4': 'costs/blood4.png',
    'bone_1': 'costs/bone1.png',
    'bone_2': 'costs/bone2.png',
    'bone_3': 'costs/bone3.png',
    'bone_4': 'costs/bone4.png',
    'bone_5': 'costs/bone5.png',
    'bone_6': 'costs/bone6.png',
    'bone_7': 'costs/bone7.png',
    'bone_8': 'costs/bone8.png',
    'bone_9': 'costs/bone9.png',
    'bone_10': 'costs/bone10.png',
    'mox-b': 'costs/mox-b.png',
    'mox-g': 'costs/mox-g.png',
    'mox-o': 'costs/mox-o.png',
    'mox-bg': 'costs/mox-bg.png',
    'mox-ob': 'costs/mox-ob.png',
    'mox-go': 'costs/mox-go.png',
    'mox-ogb': 'costs/mox-ogb.png',
  },
  'deathcard': {
    'base': 'deathcards/base.png',
    'mouth_1': 'deathcards/mouth/1.png',
    'mouth_2': 'deathcards/mouth/2.png',
    'mouth_3': 'deathcards/mouth/3.png',
    'mouth_4': 'deathcards/mouth/4.png',
    'mouth_5': 'deathcards/mouth/5.png',
    'mouth_6': 'deathcards/mouth/6.png',
    'eyes_1': 'deathcards/eyes/1.png',
    'eyes_2': 'deathcards/eyes/2.png',
    'eyes_3': 'deathcards/eyes/3.png',
    'eyes_4': 'deathcards/eyes/4.png',
    'eyes_5': 'deathcards/eyes/5.png',
    'eyes_6': 'deathcards/eyes/6.png',
    'head_chief': 'deathcards/heads/chief.png',
    'head_enchantress': 'deathcards/heads/enchantress.png',
    'head_gravedigger': 'deathcards/heads/gravedigger.png',
    'head_prospector': 'deathcards/heads/prospector.png',
    'head_robot': 'deathcards/heads/robot.png',
    'head_settlerman': 'deathcards/heads/settlerman.png',
    'head_settlerwoman': 'deathcards/heads/settlerwoman.png',
    'head_wildling': 'deathcards/heads/wildling.png',
  },
  'tribe': {
    'bird': 'tribes/bird.png',
    'canine': 'tribes/canine.png',
    'hooved': 'tribes/hooved.png',
    'insect': 'tribes/insect.png',
    'reptile': 'tribes/reptile.png',
  },
  'misc': {
    'squid_title': 'misc/squid_title.png',
  },
  'staticon': {
    'ants': 'staticons/ants.png',
    'bell': 'staticons/bell.png',
    'cardsinhand': 'staticons/cardsinhand.png',
    'mirror': 'staticons/mirror.png',
    'bones': 'staticons/bones.png',
    'sacrificesthisturn': 'staticons/sacrifices.png',
  },
  'font': {
    'default': 'fonts/HEAVYWEIGHT.otf',
    'ko': 'fonts/Stylish-Regular.ttf',
    'jp': 'fonts/ShipporiMincho-ExtraBold.ttf',
    'zh-cn': 'fonts/NotoSerifSC-Bold.otf',
    'zh-tw': 'fonts/NotoSerifTC-Bold.otf',
  },
  'sigil': {
    'missing': 'sigils/missing.png',
    'allstrike': 'sigils/allstrike.png',
    'apparition': 'sigils/apparition.png',
    'beesonhit': 'sigils/beesonhit.png',
    'bloodguzzler': 'sigils/bloodguzzler.png',
    'bonedigger': 'sigils/bonedigger.png',
    'brittle': 'sigils/brittle.png',
    'buffenemy': 'sigils/buffenemy.png',
    'buffenemy_opponent': 'sigils/buffenemy_opponent.png',
    'buffgems': 'sigils/buffgems.png',
    'buffneighbours': 'sigils/buffneighbours.png',
    'cellbuffself': 'sigils/cellbuffself.png',
    'celldrawrandomcardondeath': 'sigils/celldrawrandomcardondeath.png',
    'celltristrike': 'sigils/celltristrike.png',
    'conduitbuffattack': 'sigils/conduitbuffattack.png',
    'conduitnull': 'sigils/conduitnull.png',
    'conduitspawngems': 'sigils/conduitspawngems.png',
    'corpseeater': 'sigils/corpseeater.png',
    'createbells': 'sigils/createbells.png',
    'createdams': 'sigils/createdams.png',
    'createegg': 'sigils/createegg.png',
    'deathshield': 'sigils/deathshield.png',
    'deathtouch': 'sigils/deathtouch.png',
    'debuffenemy': 'sigils/debuffenemy.png',
    'deletefile': 'sigils/deletefile.png',
    'doublestrike': 'sigils/doublestrike.png',
    'drawant': 'sigils/drawant.png',
    'drawcopy': 'sigils/drawcopy.png',
    'drawcopyondeath': 'sigils/drawcopyondeath.png',
    'drawrabbits': 'sigils/drawrabbits.png',
    'drawrabbits_old': 'sigils/drawrabbits_old.png',
    'drawrandomcardondeath': 'sigils/drawrandomcardondeath.png',
    'drawvesselonhit': 'sigils/drawvesselonhit.png',
    'droprubyondeath': 'sigils/droprubyondeath.png',
    'edaxioarms': 'sigils/edaxioarms.png',
    'edaxiohead': 'sigils/edaxiohead.png',
    'edaxiolegs': 'sigils/edaxiolegs.png',
    'edaxiotorso': 'sigils/edaxiotorso.png',
    'evolve': 'sigils/evolve.png',
    'evolve_1': 'sigils/evolve_1.png',
    'evolve_2': 'sigils/evolve_2.png',
    'evolve_3': 'sigils/evolve_3.png',
    'explodegems': 'sigils/explodegems.png',
    'explodeondeath': 'sigils/explodeondeath.png',
    'explodingcorpse': 'sigils/explodingcorpse.png',
    'filesizedamage': 'sigils/filesizedamage.png',
    'flying': 'sigils/flying.png',
    'gainattackonkill': 'sigils/gainattackonkill.png',
    'gainbattery': 'sigils/gainbattery.png',
    'gaingemblue': 'sigils/gaingemblue.png',
    'gaingemgreen': 'sigils/gaingemgreen.png',
    'gaingemorange': 'sigils/gaingemorange.png',
    'gemdependant': 'sigils/gemdependant.png',
    'gemsdraw': 'sigils/gemsdraw.png',
    'guarddog': 'sigils/guarddog.png',
    'haunter': 'sigils/haunter.png',
    'hydraegg': 'sigils/hydraegg.png',
    'icecube': 'sigils/icecube.png',
    'latchbrittle': 'sigils/latchbrittle.png',
    'latchdeathshield': 'sigils/latchdeathshield.png',
    'latchexplodeondeath': 'sigils/latchexplodeondeath.png',
    'madeofstone': 'sigils/madeofstone.png',
    'morsel': 'sigils/morsel.png',
    'movebeside': 'sigils/movebeside.png',
    'opponentbones': 'sigils/opponentbones.png',
    'permadeath': 'sigils/permadeath.png',
    'preventattack': 'sigils/preventattack.png',
    'quadruplebones': 'sigils/quadruplebones.png',
    'randomability': 'sigils/randomability.png',
    'randomconsumable': 'sigils/randomconsumable.png',
    'reach': 'sigils/reach.png',
    'sacrificial': 'sigils/sacrificial.png',
    'sentry': 'sigils/sentry.png',
    'sharp': 'sigils/sharp.png',
    'shieldgems': 'sigils/shieldgems.png',
    'sinkhole': 'sigils/sinkhole.png',
    'sniper': 'sigils/sniper.png',
    'splitstrike': 'sigils/splitstrike.png',
    'squirrelorbit': 'sigils/squirrelorbit.png',
    'steeltrap': 'sigils/steeltrap.png',
    'strafe': 'sigils/strafe.png',
    'strafepush': 'sigils/strafepush.png',
    'strafeswap': 'sigils/strafeswap.png',
    'submerge': 'sigils/submerge.png',
    'submergesquid': 'sigils/submergesquid.png',
    'swapstats': 'sigils/swapstats.png',
    'tailonhit': 'sigils/tailonhit.png',
    'transformer': 'sigils/transformer.png',
    'tripleblood': 'sigils/tripleblood.png',
    'tristrike': 'sigils/tristrike.png',
    'tutor': 'sigils/tutor.png',
    'virtualreality': 'sigils/virtualreality.png',
    'whackamole': 'sigils/whackamole.png',
  },
  'portrait': {
    'stoat_talking': 'portraits/leshy/stoat_talking.png',
    'wolf_talking': 'portraits/leshy/wolf_talking.png',
    'stinkbug_talking': 'portraits/leshy/stinkbug_talking.png',
    'banshee': 'portraits/grimora/banshee.png',
    'bonehound': 'portraits/grimora/bonehound.png',
    'franknstein': 'portraits/grimora/franknstein.png',
    'gravedigger': 'portraits/grimora/gravedigger.png',
    'revenant': 'portraits/grimora/revenant.png',
    'skeleton': 'portraits/grimora/skeleton.png',
    'adder': 'portraits/leshy/adder.png',
    'alpha': 'portraits/leshy/alpha.png',
    'amalgam': 'portraits/leshy/amalgam.png',
    'amoeba': 'portraits/leshy/amoeba.png',
    'ant': 'portraits/leshy/ant.png',
    'antflying': 'portraits/leshy/antflying.png',
    'antqueen': 'portraits/leshy/antqueen.png',
    'aquasquirrel': 'portraits/leshy/aquasquirrel.png',
    'baitbucket': 'portraits/leshy/baitbucket.png',
    'bat': 'portraits/leshy/bat.png',
    'beaver': 'portraits/leshy/beaver.png',
    'bee': 'portraits/leshy/bee.png',
    'beehive': 'portraits/leshy/beehive.png',
    'bird_tail': 'portraits/leshy/bird_tail.png',
    'bloodhound': 'portraits/leshy/bloodhound.png',
    'boulder': 'portraits/leshy/boulder.png',
    'brokenegg': 'portraits/leshy/brokenegg.png',
    'bull': 'portraits/leshy/bull.png',
    'bullfrog': 'portraits/leshy/bullfrog.png',
    'cagedwolf': 'portraits/leshy/cagedwolf.png',
    'canine_tail': 'portraits/leshy/canine_tail.png',
    'cat': 'portraits/leshy/cat.png',
    'cat_undead': 'portraits/leshy/cat_undead.png',
    'cockroach': 'portraits/leshy/cockroach.png',
    'coyote': 'portraits/leshy/coyote.png',
    'cuckoo': 'portraits/leshy/cuckoo.png',
    'dam': 'portraits/leshy/dam.png',
    'daus': 'portraits/leshy/daus.png',
    'dausbell': 'portraits/leshy/dausbell.png',
    'deer': 'portraits/leshy/deer.png',
    'deercub': 'portraits/leshy/deercub.png',
    'direwolf': 'portraits/leshy/direwolf.png',
    'direwolfcub': 'portraits/leshy/direwolfcub.png',
    'fieldmice': 'portraits/leshy/fieldmice.png',
    'frozen_opossum': 'portraits/leshy/frozen_opossum.png',
    'geck': 'portraits/leshy/geck.png',
    'goat': 'portraits/leshy/goat.png',
    'goat_sexy': 'portraits/leshy/goat_sexy.png',
    'goldnugget': 'portraits/leshy/goldnugget.png',
    'grizzly': 'portraits/leshy/grizzly.png',
    'hodag': 'portraits/leshy/hodag.png',
    'hunterhare': 'portraits/leshy/hunterhare.png',
    'hydra': 'portraits/leshy/hydra.png',
    'hydraegg': 'portraits/leshy/hydraegg.png',
    'hydraegg_light': 'portraits/leshy/hydraegg_light.png',
    'ijiraq': 'portraits/leshy/ijiraq.png',
    'insect_tail': 'portraits/leshy/insect_tail.png',
    'jerseydevil_flying': 'portraits/leshy/jerseydevil.png',
    'jerseydevil': 'portraits/leshy/jerseydevil_sleeping.png',
    'kingfisher': 'portraits/leshy/kingfisher.png',
    'kraken': 'portraits/leshy/kraken.png',
    'lammergeier': 'portraits/leshy/lammergeier.png',
    'lice': 'portraits/leshy/lice.png',
    'maggots': 'portraits/leshy/maggots.png',
    'magpie': 'portraits/leshy/magpie.png',
    'mantis': 'portraits/leshy/mantis.png',
    'mantisgod': 'portraits/leshy/mantisgod.png',
    'mealworm': 'portraits/leshy/mealworm.png',
    'mole': 'portraits/leshy/mole.png',
    'moleman': 'portraits/leshy/moleman.png',
    'moleseaman': 'portraits/leshy/moleseaman.png',
    'moose': 'portraits/leshy/moose.png',
    'mothman_1': 'portraits/leshy/mothman_1.png',
    'mothman_2': 'portraits/leshy/mothman_2.png',
    'mothman_3': 'portraits/leshy/mothman_3.png',
    'mudturtle': 'portraits/leshy/mudturtle.png',
    'mudturtle_shelled': 'portraits/leshy/mudturtle_shelled.png',
    'mule': 'portraits/leshy/mule.png',
    'opossum': 'portraits/leshy/opossum.png',
    'otter': 'portraits/leshy/otter.png',
    'ouroboros': 'portraits/leshy/ouroboros.png',
    'packrat': 'portraits/leshy/packrat.png',
    'pelt_golden': 'portraits/leshy/pelt_golden.png',
    'pelt_hare': 'portraits/leshy/pelt_hare.png',
    'pelt_wolf': 'portraits/leshy/pelt_wolf.png',
    'porcupine': 'portraits/leshy/porcupine.png',
    'pronghorn': 'portraits/leshy/pronghorn.png',
    'rabbit': 'portraits/leshy/rabbit.png',
    'raccoon': 'portraits/leshy/raccoon.png',
    'ratking': 'portraits/leshy/ratking.png',
    'rattler': 'portraits/leshy/rattler.png',
    'raven': 'portraits/leshy/raven.png',
    'ravenegg': 'portraits/leshy/ravenegg.png',
    'redhart': 'portraits/leshy/redhart.png',
    'ringworm': 'portraits/leshy/ringworm.png',
    'shark': 'portraits/leshy/shark.png',
    'sinkhole': 'portraits/leshy/sinkhole.png',
    'skeletonparrot': 'portraits/leshy/skeletonparrot.png',
    'skeletonpirate': 'portraits/leshy/skeletonpirate.png',
    'skink': 'portraits/leshy/skink.png',
    'skink_tail': 'portraits/leshy/skink_tail.png',
    'skink_tailless': 'portraits/leshy/skink_tailless.png',
    'skunk': 'portraits/leshy/skunk.png',
    'smoke': 'portraits/leshy/smoke.png',
    'smoke_improved': 'portraits/leshy/smoke_improved.png',
    'sparrow': 'portraits/leshy/sparrow.png',
    'squidbell': 'portraits/leshy/squidbell.png',
    'squidcards': 'portraits/leshy/squidcards.png',
    'squidmirror': 'portraits/leshy/squidmirror.png',
    'squirrel': 'portraits/leshy/squirrel.png',
    'squirrel_scared': 'portraits/leshy/squirrel_scared.png',
    'starvingman': 'portraits/leshy/starvingman.png',
    'stoat': 'portraits/leshy/stoat.png',
    'stoat_bloated': 'portraits/leshy/stoat_bloated.png',
    'stones': 'portraits/leshy/stones.png',
    'stump': 'portraits/leshy/stump.png',
    'tadpole': 'portraits/leshy/tadpole.png',
    'trap': 'portraits/leshy/trap.png',
    'trapfrog': 'portraits/leshy/trapfrog.png',
    'trap_closed': 'portraits/leshy/trap_closed.png',
    'tree': 'portraits/leshy/tree.png',
    'tree_snowcovered': 'portraits/leshy/tree_snowcovered.png',
    'turtle': 'portraits/leshy/turtle.png',
    'urayuli': 'portraits/leshy/urayuli.png',
    'vulture': 'portraits/leshy/vulture.png',
    'warren': 'portraits/leshy/warren.png',
    'warren_eaten1': 'portraits/leshy/warren_eaten1.png',
    'warren_eaten2': 'portraits/leshy/warren_eaten2.png',
    'warren_eaten3': 'portraits/leshy/warren_eaten3.png',
    'wolf': 'portraits/leshy/wolf.png',
    'wolfcub': 'portraits/leshy/wolfcub.png',
    'wolverine': 'portraits/leshy/wolverine.png',
    'bluemage': 'portraits/magnificus/bluemage.png',
    'emeraldmox': 'portraits/magnificus/emeraldmox.png',
    'gemfiend': 'portraits/magnificus/gemfiend.png',
    'juniorsage': 'portraits/magnificus/juniorsage.png',
    'orangemage': 'portraits/magnificus/orangemage.png',
    'practicemage': 'portraits/magnificus/practicemage.png',
    'rubygolem': 'portraits/magnificus/rubygolem.png',
    'rubymox': 'portraits/magnificus/rubymox.png',
    'sapphiremox': 'portraits/magnificus/sapphiremox.png',
    'alarmbot': 'portraits/p03/alarmbot.png',
    'amoebot': 'portraits/p03/amoebot.png',
    'automaton': 'portraits/p03/automaton.png',
    'badfish': 'portraits/p03/badfish.png',
    'batterybot': 'portraits/p03/batterybot.png',
    'battransformer_beastmode': 'portraits/p03/battransformer_beastmode.png',
    'battransformer_botmode': 'portraits/p03/battransformer_botmode.png',
    'beartransformer_beastmode': 'portraits/p03/beartransformer_beastmode.png',
    'beartransformer_botmode': 'portraits/p03/beartransformer_botmode.png',
    'bolthound': 'portraits/p03/bolthound.png',
    'bombbot': 'portraits/p03/bombbot.png',
    'bomblatcher': 'portraits/p03/bomblatcher.png',
    'brittlelatcher': 'portraits/p03/brittlelatcher.png',
    'bustedprinter': 'portraits/p03/bustedprinter.png',
    'captivefile': 'portraits/p03/captivefile.png',
    'cellbuff': 'portraits/p03/cellbuff.png',
    'cellgift': 'portraits/p03/cellgift.png',
    'celltri': 'portraits/p03/celltri.png',
    'conduitattack': 'portraits/p03/conduitattack.png',
    'conduitgems': 'portraits/p03/conduitgems.png',
    'conduitnull': 'portraits/p03/conduitnull.png',
    'emptyvessel': 'portraits/p03/emptyvessel.png',
    'emptyvessel_gem_blue': 'portraits/p03/emptyvessel_gem_blue.png',
    'emptyvessel_gem_green': 'portraits/p03/emptyvessel_gem_green.png',
    'emptyvessel_gem_orange': 'portraits/p03/emptyvessel_gem_orange.png',
    'gemexploder': 'portraits/p03/gemexploder.png',
    'gemripper': 'portraits/p03/gemripper.png',
    'gemshielder': 'portraits/p03/gemshielder.png',
    'giftbot': 'portraits/p03/giftbot.png',
    'goodfish': 'portraits/p03/goodfish.png',
    'gunnerbot': 'portraits/p03/gunnerbot.png',
    'insectodrone': 'portraits/p03/insectodrone.png',
    'leapbot': 'portraits/p03/leapbot.png',
    'librarian': 'portraits/p03/librarian.png',
    'minecart': 'portraits/p03/minecart.png',
    'morefish': 'portraits/p03/morefish.png',
    'mycobot': 'portraits/p03/mycobot.png',
    'ourobot': 'portraits/p03/ourobot.png',
    'porcupinetransformer_beastmode': 'portraits/p03/porcupinetransformer_beastmode.png',
    'porcupinetransformer_botmode': 'portraits/p03/porcupinetransformer_botmode.png',
    'roboskeleton': 'portraits/p03/roboskeleton.png',
    'sentinel_blue': 'portraits/p03/sentinel_blue.png',
    'sentinel_green': 'portraits/p03/sentinel_green.png',
    'sentinel_orange': 'portraits/p03/sentinel_orange.png',
    'sentrybot': 'portraits/p03/sentrybot.png',
    'shieldbot': 'portraits/p03/shieldbot.png',
    'shieldlatcher': 'portraits/p03/shieldlatcher.png',
    'shutterbug': 'portraits/p03/shutterbug.png',
    'sniper': 'portraits/p03/sniper.png',
    'swapbot': 'portraits/p03/swapbot.png',
    'swapbot_swapped': 'portraits/p03/swapbot_swapped.png',
    'transformer_adder': 'portraits/p03/transformer_adder.png',
    'transformer_raven': 'portraits/p03/transformer_raven.png',
    'transformer_wolf': 'portraits/p03/transformer_wolf.png',
  },
  'emission': {
    'banshee': 'emissions/grimora/banshee.png',
    'bonehound': 'emissions/grimora/bonehound.png',
    'franknstein': 'emissions/grimora/franknstein.png',
    'gravedigger': 'emissions/grimora/gravedigger.png',
    'revenant': 'emissions/grimora/revenant.png',
    'skeleton': 'emissions/grimora/skeleton.png',
    'adder': 'emissions/leshy/adder.png',
    'alpha': 'emissions/leshy/alpha.png',
    'amalgam': 'emissions/leshy/amalgam.png',
    'amoeba': 'emissions/leshy/amoeba.png',
    'ant': 'emissions/leshy/ant.png',
    'antflying': 'emissions/leshy/antflying.png',
    'antqueen': 'emissions/leshy/antqueen.png',
    'bat': 'emissions/leshy/bat.png',
    'beaver': 'emissions/leshy/beaver.png',
    'bee': 'emissions/leshy/bee.png',
    'beehive': 'emissions/leshy/beehive.png',
    'bloodhound': 'emissions/leshy/bloodhound.png',
    'bull': 'emissions/leshy/bull.png',
    'bullfrog': 'emissions/leshy/bullfrog.png',
    'cagedwolf': 'emissions/leshy/cagedwolf.png',
    'cat': 'emissions/leshy/cat.png',
    'cockroach': 'emissions/leshy/cockroach.png',
    'coyote': 'emissions/leshy/coyote.png',
    'cuckoo': 'emissions/leshy/cuckoo.png',
    'daus': 'emissions/leshy/daus.png',
    'deer': 'emissions/leshy/deer.png',
    'deercub': 'emissions/leshy/deercub.png',
    'direwolf': 'emissions/leshy/direwolf.png',
    'direwolfcub': 'emissions/leshy/direwolfcub.png',
    'fieldmice': 'emissions/leshy/fieldmice.png',
    'geck': 'emissions/leshy/geck.png',
    'goat': 'emissions/leshy/goat.png',
    'goldnugget': 'emissions/leshy/goldnugget.png',
    'grizzly': 'emissions/leshy/grizzly.png',
    'hodag': 'emissions/leshy/hodag.png',
    'hydra': 'emissions/leshy/hydra.png',
    'ijiraq': 'emissions/leshy/ijiraq.png',
    'jerseydevil': 'emissions/leshy/jerseydevil.png',
    'kingfisher': 'emissions/leshy/kingfisher.png',
    'kraken': 'emissions/leshy/kraken.png',
    'lammergeier': 'emissions/leshy/lammergeier.png',
    'lice': 'emissions/leshy/lice.png',
    'maggots': 'emissions/leshy/maggots.png',
    'magpie': 'emissions/leshy/magpie.png',
    'mantis': 'emissions/leshy/mantis.png',
    'mantisgod': 'emissions/leshy/mantisgod.png',
    'mealworm': 'emissions/leshy/mealworm.png',
    'mole': 'emissions/leshy/mole.png',
    'moleman': 'emissions/leshy/moleman.png',
    'moose': 'emissions/leshy/moose.png',
    'mothman_3': 'emissions/leshy/mothman_3.png',
    'mudturtle': 'emissions/leshy/mudturtle.png',
    'mudturtle_shelled': 'emissions/leshy/mudturtle_shelled.png',
    'opossum': 'emissions/leshy/opossum.png',
    'otter': 'emissions/leshy/otter.png',
    'ouroboros': 'emissions/leshy/ouroboros.png',
    'packrat': 'emissions/leshy/packrat.png',
    'pelt_golden': 'emissions/leshy/pelt_golden.png',
    'porcupine': 'emissions/leshy/porcupine.png',
    'pronghorn': 'emissions/leshy/pronghorn.png',
    'rabbit': 'emissions/leshy/rabbit.png',
    'raccoon': 'emissions/leshy/raccoon.png',
    'ratking': 'emissions/leshy/ratking.png',
    'rattler': 'emissions/leshy/rattler.png',
    'raven': 'emissions/leshy/raven.png',
    'ravenegg': 'emissions/leshy/ravenegg.png',
    'redhart': 'emissions/leshy/redhart.png',
    'ringworm': 'emissions/leshy/ringworm.png',
    'shark': 'emissions/leshy/shark.png',
    'skink': 'emissions/leshy/skink.png',
    'skink_tailless': 'emissions/leshy/skink_tailless.png',
    'skunk': 'emissions/leshy/skunk.png',
    'smoke_improved': 'emissions/leshy/smoke_improved.png',
    'sparrow': 'emissions/leshy/sparrow.png',
    'squidbell': 'emissions/leshy/squidbell.png',
    'squidmirror': 'emissions/leshy/squidmirror.png',
    'squirrel': 'emissions/leshy/squirrel.png',
    'stoat': 'emissions/leshy/stoat.png',
    'stoat_bloated': 'emissions/leshy/stoat_bloated.png',
    'tadpole': 'emissions/leshy/tadpole.png',
    'turtle': 'emissions/leshy/turtle.png',
    'urayuli': 'emissions/leshy/urayuli.png',
    'vulture': 'emissions/leshy/vulture.png',
    'warren': 'emissions/leshy/warren.png',
    'wolf': 'emissions/leshy/wolf.png',
    'wolfcub': 'emissions/leshy/wolfcub.png',
    'wolverine': 'emissions/leshy/wolverine.png',
  },
  'decal': {
    'snelk': 'decals/snelk.png',
    'child': 'decals/child.png',
    'leshy': 'decals/leshy.png',
    'smoke': 'decals/smoke.png',
    'smoke_abilityhole': 'decals/smoke_abilityhole.png',
    'stitches': 'decals/stitches.png',
    'blood': 'decals/blood.png',
    'fungus': 'decals/fungus.png',
    'paint': 'decals/paint_1.png',
  }
} as const

const act1Resource = new SingleResource('resource', act1ResourceMap)
