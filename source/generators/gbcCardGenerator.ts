import { Card } from '../card'
import { ImageMagickCommandBuilder } from '../im/commandBuilder'
import { BaseCardGenerator, bufferFromCommandBuilder, bufferFromCommandBuilderFds } from './base'
import IM from '../im'
import { getGemCostResourceId } from '../helpers'
import { SingleResource, ResourceError } from '../resource'
import { Fds } from '../im/fds'

export { GbcCardGenerator, act2Resource }

const originalCardHeight = 56 // px, size: 42x56
const fullsizeCardHeight = 1050 // px
const scale = fullsizeCardHeight / originalCardHeight

type Npc = 'angler' | 'bluewizard' | 'briar' | 'dredger' | 'dummy' | 'greenwizard' | 'inspector' | 'orangewizard' | 'royal' | 'sawyer' | 'melter' | 'trapper' | 'prospector'
type Options = { border?: boolean, scanlines?: boolean }
class GbcCardGenerator extends BaseCardGenerator<Options> {
  constructor(options: Options) {
    super(act2Resource, options)
  }

  generateFront(card: Card): Promise<Buffer> {
    const im = IM()
    const fds = new Fds()

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
          .composite()
      } else if (card.portrait.type === 'resource') {
        im.parens(IM().resource(this.resource.get('portrait', card.portrait.resourceId)))
          .geometry(1, 1)
          .composite()
      } else if (card.portrait.type === 'custom' && card.portrait.data.gbc) {
        const portraitFd = fds.fd(card.portrait.data.gbc)
        im.parens(
          IM(portraitFd)
            .filter('Point')
            .gravity('North')
            .interpolate('Nearest')
            .resizeExt(g => g.size(41, 28).flag('>'))
        ).geometry(0, 1).composite()
      }
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

    // costs
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

    // hack: throw if multiple sigils and any is starts with activated
    if (card.sigils.length > 1 && card.sigils.some(s => s.startsWith('activated'))) {
      throw new ResourceError('Multiple sigils, and at least one is activated', 'sigil')
    }

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
        im.resource(this.resource.get('sigil', sigil)).gravity('North').geometry(0, 31 + sigilYOffset).composite()
      }
    } else if (card.sigils.length >= 2) {
      im.gravity('NorthWest')
      im.resource(this.resource.get('sigil', card.sigils[0])).geometry(4, 31).composite()
      im.resource(this.resource.get('sigil', card.sigils[1])).geometry(22, 31).composite()
    }

    // fused
    if (card.flags.fused) {
      im.gravity('Center').resource(this.resource.get('misc', 'stitches')).composite()
    }

    // black outline onto card
    im.command('-fill').command('none').command('-stroke').command('rgb(2,10,17)').command('-strokewidth').command('0').command('-draw').command('rectangle 0,0 41,55')

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

    return bufferFromCommandBuilderFds(im, fds)
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

  generateNpc(npc: Npc): Promise<Buffer> {
    // npc
    const im = IM(this.resource.get('npc', npc))
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

const act2ResourceMap = {
  'card': {
    'common': 'cards/common.png',
    'rare': 'cards/rare.png',
    'terrain': 'cards/terrain.png',
    'terrain_rare': 'cards/terrain_rare.png',
  },
  'cardback': {
    'common': 'cardbacks/common.png',
    'submerged': 'cardbacks/submerged.png',
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
    'bone_11': 'costs/bone11.png',
    'bone_12': 'costs/bone12.png',
    'bone_13': 'costs/bone13.png',
    'energy_1': 'costs/energy1.png',
    'energy_2': 'costs/energy2.png',
    'energy_3': 'costs/energy3.png',
    'energy_4': 'costs/energy4.png',
    'energy_5': 'costs/energy5.png',
    'energy_6': 'costs/energy6.png',
    'mox-b': 'costs/mox-b.png',
    'mox-bg': 'costs/mox-bg.png',
    'mox-g': 'costs/mox-g.png',
    'mox-go': 'costs/mox-go.png',
    'mox-o': 'costs/mox-o.png',
    'mox-ob': 'costs/mox-ob.png',
    'mox-ogb': 'costs/mox-ogb.png',
  },
  'portrait': {
    'ouroboros': 'portraits/ouroboros.png',
    'adder': 'portraits/adder.png',
    'skeleton': 'portraits/skeleton.png',
    'wolfcub': 'portraits/wolfcub.png',
    'elkcub': 'portraits/elkcub.png',

    'kraken': 'portraits/kraken.png',
    'squidcards': 'portraits/squidcards.png',
    'squidmirror': 'portraits/squidmirror.png',
    'squidbell': 'portraits/squidbell.png',
    'hrokkall': 'portraits/hrokkall.png',
    'mantisgod': 'portraits/mantisgod.png',
    'moleman': 'portraits/moleman.png',
    'urayuli': 'portraits/urayuli.png',
    'rabbit': 'portraits/rabbit.png',
    'squirrel': 'portraits/squirrel.png',
    'bullfrog': 'portraits/bullfrog.png',
    'cat': 'portraits/cat.png',
    'catundead': 'portraits/cat_undead.png',
    'mole': 'portraits/mole.png',
    'squirrelball': 'portraits/squirrelball.png',
    'stoat': 'portraits/stoat.png',
    'warren': 'portraits/warren.png',
    'wolf': 'portraits/wolf.png',
    'bloodhound': 'portraits/bloodhound.png',
    'elk': 'portraits/elk.png',
    'fieldmouse': 'portraits/fieldmice.png',
    'hawk': 'portraits/hawk.png',
    'raven': 'portraits/raven.png',
    'salmon': 'portraits/salmon.png',
    'fieldmouse_fused': 'portraits/fieldmice_fused.png',
    'grizzly': 'portraits/grizzly.png',

    'sarcophagus': 'portraits/sarcophagus.png',
    'banshee': 'portraits/banshee.png',

    'abovecurve': 'portraits/abovecurve.png',
    'automaton': 'portraits/automaton.png',
    'batterybot': 'portraits/batterybot.png',
    'bluemage': 'portraits/bluemage.png',
    'bluemage_fused': 'portraits/bluemage_fused.png',
    'bolthound': 'portraits/bolthound.png',
    'bombbot': 'portraits/bombbot.png',
    'bombmaiden': 'portraits/bombmaiden.png',
    'bonehound': 'portraits/bonehound.png',
    'bonelordhorn': 'portraits/bonelordhorn.png',
    'bonepile': 'portraits/bonepile.png',
    'burrowingtrap': 'portraits/burrowingtrap.png',
    'coinleft': 'portraits/coinleft.png',
    'coinright': 'portraits/coinright.png',
    'energyconduit': 'portraits/conduitenergy.png',
    'factoryconduit': 'portraits/conduitfactory.png',
    'healerconduit': 'portraits/conduithealer.png',
    'attackconduit': 'portraits/conduitpower.png',
    'coyote': 'portraits/coyote.png',
    'deadhand': 'portraits/deadhand.png',
    'deadpets': 'portraits/deadpets.png',
    'draugr': 'portraits/draugr.png',
    'drownedsoul': 'portraits/drownedsoul.png',
    'plasmagunner': 'portraits/energygunner.png',
    'energyroller': 'portraits/energyroller.png',
    'family': 'portraits/family.png',
    'fieldmice': 'portraits/fieldmice.png',
    'fieldmice_fused': 'portraits/fieldmice_fused.png',
    'flyingmage': 'portraits/flyingmage.png',
    'forcemage': 'portraits/forcemage.png',
    'franknstein': 'portraits/franknstein.png',
    'gemfiend': 'portraits/gemfiend.png',
    'techmoxtriple': 'portraits/gemmodule.png',
    'ghostship': 'portraits/ghostship.png',
    'gravedigger': 'portraits/gravedigger.png',
    'gravedigger_fused': 'portraits/gravedigger_fused.png',
    'greenmage': 'portraits/greenmage.png',
    'closerbot': 'portraits/gunnerbot.png',
    'headlesshorseman': 'portraits/headlesshorseman.png',
    'insectodrone': 'portraits/insectobot.png',
    'inspector': 'portraits/inspector.png',
    'juniorsage': 'portraits/juniorsage.png',
    'kingfisher': 'portraits/kingfisher.png',
    'leapbot': 'portraits/leapingbot.png',
    'mageknight': 'portraits/mageknight.png',
    'magpie': 'portraits/magpie.png',
    'marrowmage': 'portraits/marrowmage.png',
    'masterbleene': 'portraits/masterBG.png',
    'mastergoranj': 'portraits/masterGO.png',
    'masterorlu': 'portraits/masterOB.png',
    'meatbot': 'portraits/meatbot.png',
    'melter': 'portraits/melter.png',
    'minecart': 'portraits/minecart.png',
    'moxdualbg': 'portraits/moxBG.png',
    'moxdualgo': 'portraits/moxGO.png',
    'moxdualob': 'portraits/moxOB.png',
    'moxemerald': 'portraits/moxemerald.png',
    'moxruby': 'portraits/moxruby.png',
    'moxsapphire': 'portraits/moxsapphire.png',
    'moxtriple': 'portraits/moxtriple.png',
    'mummy': 'portraits/mummy.png',
    'musclemage': 'portraits/musclemage.png',
    'necromancer': 'portraits/necromancer.png',
    'nullconduit': 'portraits/nullconduit.png',
    'opossum': 'portraits/opossum.png',
    'orangemage': 'portraits/orangemage.png',
    'practicemage': 'portraits/practicemage.png',
    'pupil': 'portraits/pupil.png',
    'revenant': 'portraits/revenant.png',
    'robomice': 'portraits/robomice.png',
    'rubygolem': 'portraits/rubygolem.png',
    'sentrybot': 'portraits/sentrybot.png',
    'sentrybot_fused': 'portraits/sentrybot_fused.png',
    'shutterbug': 'portraits/shutterbug.png',
    'skeletonmage': 'portraits/skeletonmage.png',
    'sniper': 'portraits/sniper.png',
    'starvation': 'portraits/starvation.png',
    'steambot': 'portraits/steambot.png',
    'stimmage': 'portraits/stimmage.png',
    'thickbot': 'portraits/thickbot.png',
    'tombrobber': 'portraits/tombrobber.png',
    'zombie': 'portraits/zombie.png',
  },
  'font': {
    'default': 'fonts/Marksman.otf'
  },
  'sigil': {
    'missing': 'missing_sigil.png',
    'buffgems': 'sigils/buffgems.png',
    'deathtouch': 'sigils/deathtouch.png',
    'doubledeath': 'sigils/doubledeath.png',
    'drawcopy': 'sigils/drawcopy.png',
    'drawcopyondeath': 'sigils/drawcopyondeath.png',
    'drawnewhand': 'sigils/drawnewhand.png',
    'drawrabbits': 'sigils/drawrabbits.png',
    'evolve': 'sigils/evolve.png',
    'flying': 'sigils/flying.png',
    'guarddog': 'sigils/guarddog.png',
    'icecube': 'sigils/icecube.png',
    'loot': 'sigils/loot.png',
    'preventattack': 'sigils/preventattack.png',
    'quadruplebones': 'sigils/quadruplebones.png',
    'reach': 'sigils/reach.png',
    'sacrificial': 'sigils/sacrificial.png',
    'sentry': 'sigils/sentry.png',
    'sharp': 'sigils/sharp.png',
    'skeletonstrafe': 'sigils/skeletonstrafe.png',
    'splitstrike': 'sigils/splitstrike.png',
    'squirrelstrafe': 'sigils/squirrelstrafe.png',
    'steeltrap': 'sigils/steeltrap.png',
    'strafe': 'sigils/strafe.png',
    'strafepush': 'sigils/strafepush.png',
    'submerge': 'sigils/submerge.png',
    'submergesquid': 'sigils/submergesquid.png',
    'tripleblood': 'sigils/tripleblood.png',
    'tristrike': 'sigils/tristrike.png',
    'tutor': 'sigils/tutor.png',
    'whackamole': 'sigils/whackamole.png',
    'activateddealdamage': 'sigils/activated_dealdamage.png',
    'activatedrandompowerbone': 'sigils/activated_dicerollbone.png',
    'activatedrandompowerenergy': 'sigils/activated_dicerollenergy.png',
    'activateddrawskeleton': 'sigils/activated_drawskeleton.png',
    'activatedenergytobones': 'sigils/activated_energytobones.png',
    'activatedheal': 'sigils/activated_heal.png',
    'activatedsacrificedrawcards': 'sigils/activated_sacrificedraw.png',
    'activatedstatsup': 'sigils/activated_statsup.png',
    'activatedstatsupenergy': 'sigils/activated_statsupenergy.png',
    'bombspawner': 'sigils/bombspawner.png',
    'bonedigger': 'sigils/bonedigger.png',
    'brittle': 'sigils/brittle.png',
    'conduitbuffattack': 'sigils/conduitbuffattack.png',
    'conduitenergy': 'sigils/conduitenergy.png',
    'conduithealing': 'sigils/conduithealing.png',
    'conduitfactory': 'sigils/conduitspawner.png',
    'droprubyondeath': 'sigils/droprubyondeath.png',
    'explodeondeath': 'sigils/explodeondeath.png',
    'gainbattery': 'sigils/gainbattery.png',
    'gaingemtriple': 'sigils/gaingem_all.png',
    'gaingemblue': 'sigils/gaingem_blue.png',
    'gaingemgreen': 'sigils/gaingem_green.png',
    'gaingemorange': 'sigils/gaingem_orange.png',
    'gemdependant': 'sigils/gemdependant.png',
    'gemsdraw': 'sigils/gemsdraw.png',
  },
  'frame': {
    'nature': 'frames/nature.png',
    'tech': 'frames/tech.png',
    'undead': 'frames/undead.png',
    'wizard': 'frames/wizard.png',
  },
  'misc': {
    'stitches': 'misc/stitches.png',
    'ability_button': 'misc/activated_ability_button.png',
    'conduit': 'misc/conduit.png',
  },
  'staticon': {
    'ants': 'staticons/ants.png',
    'bell': 'staticons/bell.png',
    'cardsinhand': 'staticons/cardsinhand.png',
    'greengems': 'staticons/greengems.png',
    'mirror': 'staticons/mirror.png',
  },
  'npc': {
    'angler': 'npcs/angler.png',
    'bluewizard': 'npcs/bluewizard.png',
    'briar': 'npcs/briar.png',
    'dredger': 'npcs/dredger.png',
    'dummy': 'npcs/dummy.png',
    'greenwizard': 'npcs/greenwizard.png',
    'inspector': 'npcs/inspector.png',
    'orangewizard': 'npcs/orangewizard.png',
    'prospector': 'npcs/prospector.png',
    'royal': 'npcs/royal.png',
    'sawyer': 'npcs/sawyer.png',
    'melter': 'npcs/smelter.png',
    'trapper': 'npcs/trapper.png',
  }
}

const act2Resource = new SingleResource('resource-gbc', act2ResourceMap)
