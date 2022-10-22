import { Card } from '../card'
import { BaseCardGenerator, bufferFromCommandBuilder } from './base'

import IM from '../im'
import { SingleResource } from '../resource'
import { ImageMagickCommandBuilder } from '../im/commandBuilder'

export { P03CardGenerator, p03Resource }

//original width: 1307 -> scaled width: 698
const fullsizeCardWidth = 698
const originalCardHeight = 1967 // px
const fullsizeCardHeight = 1050 // px

type Options = { border?: boolean, locale?: string, scanlines?: boolean }
class P03CardGenerator extends BaseCardGenerator<Options> {

  constructor(options: Options) {
    super(p03Resource, options)
  }

  generateFront(card: Card): Promise<Buffer> {
    const im = IM().size(fullsizeCardWidth, fullsizeCardHeight)
      .command('xc:transparent')
      .filter('Box')

    const front = IM(this.resource.get('card', 'common'))
      .resize(undefined, fullsizeCardHeight)

    if (card.portrait) {
      switch (card.portrait.type) {
        default: {
          break
        }
        case 'resource': {
          im.gravity('Center')

          const portraitPath = this.resource.get('portrait', card.portrait.resourceId)
          const portrait = IM(portraitPath).resize(undefined, 500)
            .gravity('Center')
            .geometry(-1, -105)

          im.parens(portrait).composite()

          break
        }
      }
    }

    const sigils = card.sigils?.slice(0, 4)
    if (sigils) {
      im.gravity('Center')

      const sigilSize = (resource: string, size: number) => IM(resource).resize(size, size)

      if (sigils.length === 1) {

        const sigilPath = this.resource.get('sigil', sigils[0])
        const sigilImage = sigilSize(sigilPath, 220).geometry(0, 270)

        im.parens(sigilImage).composite()
      }

      if (sigils.length === 2) {
        const sigilPath1 = this.resource.get('sigil', sigils[0])
        const sigilPath2 = this.resource.get('sigil', sigils[1])

        const sigilImage1 = sigilSize(sigilPath1, 220).geometry(-132, 270)
        const sigilImage2 = sigilSize(sigilPath2, 220).geometry(132, 270)

        im.parens(sigilImage1)
          .composite()
          .parens(sigilImage2)
          .composite()
      }

      if (sigils.length === 3) {
        const sigilPath1 = this.resource.get('sigil', sigils[0])
        const sigilPath2 = this.resource.get('sigil', sigils[1])
        const sigilPath3 = this.resource.get('sigil', sigils[2])

        const sigilImage1 = sigilSize(sigilPath1, 175).geometry(-205, 270)
        const sigilImage2 = sigilSize(sigilPath2, 175).geometry(0, 270)
        const sigilImage3 = sigilSize(sigilPath3, 175).geometry(205, 270)

        im.parens(sigilImage1)
          .composite()
          .parens(sigilImage2)
          .composite()
          .parens(sigilImage3)
          .composite()
      }

      if (sigils.length === 4) {

        const sigilPath1 = this.resource.get('sigil', sigils[0])
        const sigilPath2 = this.resource.get('sigil', sigils[1])
        const sigilPath3 = this.resource.get('sigil', sigils[2])
        const sigilPath4 = this.resource.get('sigil', sigils[3])

        const sigilImage1 = sigilSize(sigilPath1, 135).geometry(-216, 270)
        const sigilImage2 = sigilSize(sigilPath2, 135).geometry(-73, 270)
        const sigilImage3 = sigilSize(sigilPath3, 135).geometry(73, 270)
        const sigilImage4 = sigilSize(sigilPath4, 135).geometry(216, 270)

        im.parens(sigilImage1)
          .composite()
          .parens(sigilImage2)
          .composite()
          .parens(sigilImage3)
          .composite()
          .parens(sigilImage4)
          .composite()
      }
    }

    im.font(this.resource.get('font', 'p03'))

    // health
    const d = 27
    const w = 243
    const h = 90 + d + d
    const healthText = IM()
      .pointsize()
      .size(w, h)
      .background('None')
      .label(card.health)
      .trim()
      .gravity('Center')
      .extent(w, h)

    im.parens(healthText).gravity('NorthWest')
      .geometry(415, 938 - d)
      .composite()
      .gravity('Center')

    const powerText = IM()
      .pointsize()
      .size(w, h)
      .background('None')
      .label(card.power)
      .trim()
      .gravity('Center')
      .extent(w, h)

    im.parens(powerText).gravity('NorthWest')
      .geometry(34, 938 - d)
      .composite()
      .gravity('Center')

    // make blue
    im.fill('#0df').command('-colorize', '100')

    // draw middle line rectangle
    const line = IM().size(664, 8).command('xc:#6bdfff').geometry(0, 152)
    im.parens(line).composite()

    // glow
    const g = IM()
      .clone()
      .alpha('Set')
      .command('-channel', 'A')
      .command('-evaluate', 'multiply', '0.4')
      .command('+channel')
      .command('-blur', '0x12')

    im.parens(g).composite()

    // draw background
    const screenBackground = IM()
      .size(670, 925)
      .geometry(0, 45)
      .command('xc:#112')

    im.parens(screenBackground)
      .compose('DstOver')
      .composite()
      .compose('Over')

    if (this.options.scanlines) {
      const tileableScanline = IM()
        .size(15, 15)
        .command('gradient:', '-function', 'Polynomial', '-2,2,0')

      const scanlines = IM()
        .parens(tileableScanline)
        .command('-write').command('mpr:tile').command('+delete').size(670, 925).command('tile:mpr:tile')
        .command('-channel', 'A').command('-evaluate', 'multiply', '0.1').command('+channel')

      im.parens(scanlines)
        .geometry(0, 40)
        .compose('Overlay')
        .composite()
        .compose('Over')
    }

    // append front image
    im.parens(front).composite()

    const cost = card.cost
    if (cost && cost.type === 'energy') {
      const amount = cost.amount

      // i dislike typescript. please allow `[1,2,3,4,5,6].includes(amount)`. eat shit https://github.com/microsoft/TypeScript/issues/15048
      if (amount === 1 || amount === 2 || amount === 3 || amount === 4 || amount === 5 || amount === 6) {
        const energyResourcePath = this.resource.get('cost', `energy-${amount}`)
        console.log('energy cost 223123', cost.amount)

        const energy = IM(energyResourcePath)
          .resizeExt(g => g.scale(fullsizeCardHeight / originalCardHeight * 100))

        im.parens(energy).composite()
      }
    }

    const name = card.name?.trim()
    if (name) {
      const nametagPath = this.resource.get('cardextra', 'name')
      const nametag = IM(nametagPath).resizeExt(g => g.scale(fullsizeCardHeight / originalCardHeight * 100))
      im.parens(nametag).composite()

      // default for english
      let size = { w: 570, h: 115 }
      let position = { x: 0, y: 65 }

      im.font(this.resource.get('font', 'default'))
        .fill('#001')

      const locale = this.options.locale
      if (locale === 'ko') {
        im.font(this.resource.get('font', locale))
        position = { x: 4, y: 71 }
      } else if (locale === 'jp' || locale === 'zh-cn' || locale === 'zh-tw') {
        size = { w: 533, h: 129 }
        position = { x: -6, y: 66 }
        im.font(this.resource.get('font', locale))
      }

      const nameText = this.#text(name, size.w, size.h)

      im.parens(nameText).gravity('North')
        .geometry(position.x, position.y)
        .composite()
        .font(this.resource.get('font', 'default'))
    }

    return bufferFromCommandBuilder(im)
  }

  #text(text: string, width: number, height: number): ImageMagickCommandBuilder {
    return IM()
      .pointsize()
      .size(width, height)
      .background('None')
      .label(text)
      .trim()
      .gravity('Center')
      .extent(width, height)
      .resizeExt(g => g.scale(106, 100).flag('!'))
  }

  generateBack(): Promise<Buffer> {
    const cardBackPath = this.resource.get('cardback', 'common')
    const im = IM(cardBackPath)
      .resize(undefined, fullsizeCardHeight)

    return bufferFromCommandBuilder(im)
  }
}

type P03ResourceMap = typeof p03ResourceMap
const p03ResourceMap = {
  'card': {
    'common': 'cards/floppy-front-transparent.png',
  },
  'cardback': {
    'common': 'cardbacks/floppy-back.png',
  },
  'cardextra': {
    'gems': 'cardextras/floppy-gems-transparent.png',
    'wire': 'cardextras/floppy-wire-transparent.png',
    'name': 'cardextras/floppy-name-transparent.png',
  },
  'cost': {
    'energy-1': 'costs/energy-1.png',
    'energy-2': 'costs/energy-2.png',
    'energy-3': 'costs/energy-3.png',
    'energy-4': 'costs/energy-4.png',
    'energy-5': 'costs/energy-5.png',
    'energy-6': 'costs/energy-6.png',
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
    'p03': 'fonts/DAGGERSQUARE.otf',
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
} as const

const p03Resource = new SingleResource('resource', p03ResourceMap)
