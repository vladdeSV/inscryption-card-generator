import { BaseCardGenerator, bufferFromCommandBuilder, CardGenerator } from '../base'
import IM from '../../im'
import { Card } from '../../card'
import { SingleResource } from '../../resource'
import { getGemCostResourceId } from '../../fns/helpers'

type Options = { border: boolean }

const originalCardHeight = 146 // px
const fullsizeCardHeight = 1460 // px
const scale = fullsizeCardHeight / originalCardHeight

const palette: Record<'nature' | 'tech' | 'wizard' | 'undead' | 'misc', [string, string, string]> = {
  nature: ['#be7541', '#7d4e30', '#4e3226'],
  tech: ['#61aac2', '#497b9c', '#214763'],
  wizard: ['#cb667d', '#9c4980', '#5f2045'],
  undead: ['#859769', '#6a7054', '#3c4937'],
  misc: ['#978d7a', '#635f58', '#45403c'],
}

export class PixelProfilgateGenerator extends BaseCardGenerator<Options> {
  constructor(options: Options) {
    super(
      new SingleResource('resource-pixelprofilgate', pixelProfilgateResourceMap),
      options
    )
  }

  generateFront(card: Card): Promise<Buffer> {
    const im = IM()
    const cardPalette = card.flags.terrain ? 'misc' : card.temple

    im.background('None')
      .filter('Box')
      .gravity('NorthWest')

    let cardName: string = card.temple

    if (card.flags.terrain) {
      cardName = 'misc'
    }

    if (card.flags.rare) {
      cardName += 'rare'
    }

    im.resource(this.resource.get('card', cardName))

    if (card.portrait?.type === 'resource') {

      const portraitResource = this.resource.get('portrait', card.portrait.resourceId)
      const portrait = IM().resource(portraitResource)

      for (const pal of ['nature', 'tech', 'wizard', 'undead', 'misc'] as const) {
        const p = palette[pal]

        portrait.fill('red').opaque(p[0])
        portrait.fill('green').opaque(p[1])
        portrait.fill('blue').opaque(p[2])
      }

      portrait.fill(palette[cardPalette][0]).opaque('red')
        .fill(palette[cardPalette][1]).opaque('green')
        .fill(palette[cardPalette][2]).opaque('blue')

      im.parens(portrait)
        .geometry(12, 26)
        .composite()
    }

    if (card.cost) {
      const costType = card.cost.type
      let costPath: string | undefined = undefined

      if (costType === 'blood' || costType === 'bone' || costType === 'energy') {
        const { type, amount } = card.cost
        costPath = this.resource.get('cost', `${type}_${amount}`)
      } else if (costType === 'gem') {
        const a = getGemCostResourceId(card.cost.gems) ?? 'mox-p'

        costPath = this.resource.get('cost', a)
      }

      if (costPath) {

        const cost = IM()
          .resource(costPath)
          .fill(palette[cardPalette][0]).opaque('red')
          .fill(palette[cardPalette][1]).opaque('green')
          .fill(palette[cardPalette][2]).opaque('blue')

        im.parens(cost)
          .geometry(61, 74)
          .composite()
      }
    }

    // let input: Buffer | undefined
    // if (card.portrait?.type === 'custom') {
    //   input = card.portrait.data.common
    // }

    // resize
    im.resizeExt(g => g.scale(scale * 100))

    return bufferFromCommandBuilder(im/*, input*/)
  }

  generateBack(): Promise<Buffer> {
    throw new Error('Method not implemented.')
  }
}

const pixelProfilgateResourceMap: Record<string, Record<string, string>> = {
  'card': {
    'nature': 'Card Base/CardBeastCommon.png',
    'naturerare': 'Card Base/CardBeastRare.png',
    'wizard': 'Card Base/CardMagickCommon.png',
    'wizardrare': 'Card Base/CardMagickRare.png',
    'tech': 'Card Base/CardTechCommon.png',
    'techrare': 'Card Base/CardTechRare.png',
    'undead': 'Card Base/CardUndeadCommon.png',
    'undeadrare': 'Card Base/CardUndeadRare.png',
    'misc': 'Card Base/CardMiscCommon.png',
    'miscrare': 'Card Base/CardMiscRare.png',
  },
  'cardback': {
    'common': 'Card Back/CardBack.png',
  },
  'cost': {
    'blood_1': 'Costs/CostBlood1.png',
    'blood_2': 'Costs/CostBlood2.png',
    'blood_3': 'Costs/CostBlood3.png',
    'blood_4': 'Costs/CostBlood4.png',
    'energy_1': 'Costs/CostEnergy1.png',
    'energy_2': 'Costs/CostEnergy2.png',
    'energy_3': 'Costs/CostEnergy3.png',
    'energy_4': 'Costs/CostEnergy4.png',
    'energy_5': 'Costs/CostEnergy5.png',
    'energy_6': 'Costs/CostEnergy6.png',
    'bone_1': 'Costs/CostBone1.png',
    'bone_2': 'Costs/CostBone2.png',
    'bone_3': 'Costs/CostBone3.png',
    'bone_4': 'Costs/CostBone4.png',
    'bone_5': 'Costs/CostBone5.png',
    'bone_6': 'Costs/CostBone6.png',
    'bone_7': 'Costs/CostBone7.png',
    'bone_8': 'Costs/CostBone8.png',
    'bone_10': 'Costs/CostBone10.png',
    'bone_13': 'Costs/CostBone13.png',
    'mox-b': 'Costs/CostMoxB.png',
    'mox-g': 'Costs/CostMoxG.png',
    'mox-o': 'Costs/CostMoxO.png',
    'mox-bg': 'Costs/CostMoxBG.png',
    'mox-ob': 'Costs/CostMoxOB.png',
    'mox-go': 'Costs/CostMoxGO.png',
    'mox-ogb': 'Costs/CostMoxOBG.png',
    'mox-p': 'Costs/CostMoxP.png',
  },
  'portrait': {
    'stoat_talking': 'Card Art/Stoat.png',
    // 'wolf_talking': 'Card Art/Wolf_talking.png',
    'stinkbug_talking': 'Card Art/Stinkbug.png',
    'banshee': 'Card Art/Banshee.png',
    'bonehound': 'Card Art/Bonehound.png',
    'franknstein': 'Card Art/Frank&Stein.png',
    'gravedigger': 'Card Art/Gravedigger.png',
    'revenant': 'Card Art/Revenant.png',
    'skeleton': 'Card Art/Skeleton.png',
    'adder': 'Card Art/Adder.png',
    // 'alpha': 'Card Art/Alpha.png',
    'amalgam': 'Card Art/Amalgam.png',
    'amoeba': 'Card Art/Amoeba.png',
    'ant': 'Card Art/WorkerAnt.png',
    // 'antflying': 'Card Art/Antflying.png',
    'antqueen': 'Card Art/AntQueen.png',
    // 'aquasquirrel': 'Card Art/Aquasquirrel.png',
    'baitbucket': 'Card Art/BaitBucket.png',
    'bat': 'Card Art/Bat.png',
    // 'beaver': 'Card Art/Beaver.png',
    'bee': 'Card Art/Bee.png',
    'beehive': 'Card Art/Beehive.png',
    // 'bird_tail': 'Card Art/Bird_tail.png',
    // 'bloodhound': 'Card Art/Bloodhound.png',
    'boulder': 'Card Art/Boulder.png',
    // 'brokenegg': 'Card Art/Brokenegg.png',
    // 'bull': 'Card Art/Bull.png',
    'bullfrog': 'Card Art/Bullfrog.png',
    'cagedwolf': 'Card Art/CagedWolf.png',
    // 'canine_tail': 'Card Art/Canine_tail.png',
    'cat': 'Card Art/Cat.png',
    'cat_undead': 'Card Art/UndeadCat.png',
    'cockroach': 'Card Art/Cockroach.png',
    // 'coyote': 'Card Art/Coyote.png',
    // 'cuckoo': 'Card Art/Cuckoo.png',
    // 'dam': 'Card Art/Dam.png',
    'daus': 'Card Art/Daus.png',
    'dausbell': 'Card Art/Chime.png',
    'deer': 'Card Art/Elk.png',
    'deercub': 'Card Art/ElkFawn.png',
    // 'direwolf': 'Card Art/Direwolf.png',
    // 'direwolfcub': 'Card Art/Direwolfcub.png',
    'fieldmice': 'Card Art/FieldMice.png',
    // 'frozen_opossum': 'Card Art/Frozen_opossum.png',
    'geck': 'Card Art/Geck.png',
    // 'goat': 'Card Art/Goat.png',
    // 'goat_sexy': 'Card Art/Goat_sexy.png',
    'goldnugget': 'Card Art/Goldnugget.png',
    'grizzly': 'Card Art/Grizzly.png',
    // 'hodag': 'Card Art/Hodag.png',
    // 'hunterhare': 'Card Art/Hunterhare.png',
    // 'hydra': 'Card Art/Hydra.png',
    // 'hydraegg': 'Card Art/Hydraegg.png',
    // 'hydraegg_light': 'Card Art/Hydraegg_light.png',
    // 'ijiraq': 'Card Art/Ijiraq.png',
    // 'insect_tail': 'Card Art/Insect_tail.png',
    // 'jerseydevil_flying': 'Card Art/Jerseydevil.png',
    // 'jerseydevil': 'Card Art/Jerseydevil_sleeping.png',
    'kingfisher': 'Card Art/Kingfisher.png',
    // 'kraken': 'Card Art/Kraken.png',
    // 'lammergeier': 'Card Art/Lammergeier.png',
    // 'lice': 'Card Art/Lice.png',
    'maggots': 'Card Art/CorpseMaggots.png',
    'magpie': 'Card Art/Magpie.png',
    'mantis': 'Card Art/Mantis.png',
    'mantisgod': 'Card Art/MantisGod.png',
    // 'mealworm': 'Card Art/Mealworm.png',
    'mole': 'Card Art/Mole.png',
    'moleman': 'Card Art/Moleman.png',
    // 'moleseaman': 'Card Art/Moleseaman.png',
    'moose': 'Card Art/MooseBuck.png',
    // 'mothman_1': 'Card Art/Mothman_1.png',
    // 'mothman_2': 'Card Art/Mothman_2.png',
    // 'mothman_3': 'Card Art/Mothman_3.png',
    // 'mudturtle': 'Card Art/Mudturtle.png',
    // 'mudturtle_shelled': 'Card Art/Mudturtle_shelled.png',
    // 'mule': 'Card Art/Mule.png',
    'opossum': 'Card Art/Opossum.png',
    'otter': 'Card Art/RiverOtter.png',
    'ouroboros': 'Card Art/Ouroboros.png',
    'packrat': 'Card Art/PackRat.png',
    'pelt_golden': 'Card Art/GoldenPelt.png',
    'pelt_hare': 'Card Art/RabbitPelt.png',
    'pelt_wolf': 'Card Art/WolfPelt.png',
    'porcupine': 'Card Art/Porcupine.png',
    'pronghorn': 'Card Art/Pronghorn.png',
    'rabbit': 'Card Art/Rabbit.png',
    // 'raccoon': 'Card Art/Raccoon.png',
    'ratking': 'Card Art/RatKing.png',
    'rattler': 'Card Art/Rattler.png',
    'raven': 'Card Art/Raven.png',
    'ravenegg': 'Card Art/Ravenegg.png',
    // 'redhart': 'Card Art/Redhart.png',
    // 'ringworm': 'Card Art/Ringworm.png',
    'shark': 'Card Art/GreatWhite.png',
    // 'sinkhole': 'Card Art/Sinkhole.png',
    // 'skeletonparrot': 'Card Art/Skeletonparrot.png',
    // 'skeletonpirate': 'Card Art/Skeletonpirate.png',
    // 'skink': 'Card Art/Skink.png',
    // 'skink_tail': 'Card Art/Skink_tail.png',
    // 'skink_tailless': 'Card Art/Skink_tailless.png',
    'skunk': 'Card Art/Skunk.png',
    'smoke': 'Card Art/TheSmoke.png',
    // 'smoke_improved': 'Card Art/Smoke_improved.png',
    'sparrow': 'Card Art/Sparrow.png',
    // 'squidbell': 'Card Art/Squidbell.png',
    // 'squidcards': 'Card Art/Squidcards.png',
    // 'squidmirror': 'Card Art/Squidmirror.png',
    'squirrel': 'Card Art/Squirrel.png',
    // 'squirrel_scared': 'Card Art/Squirrel_scared.png',
    'starvingman': 'Card Art/Starvation.png',
    // 'stoat': 'Card Art/Stoat.png',
    // 'stoat_bloated': 'Card Art/Stoat_bloated.png',
    // 'stones': 'Card Art/Stones.png',
    'stump': 'Card Art/Stump.png',
    // 'tadpole': 'Card Art/Tadpole.png',
    'trap': 'Card Art/LeapingTrap.png',
    'trapfrog': 'Card Art/StrangeFrog.png',
    // 'trap_closed': 'Card Art/Trap_closed.png',
    // 'tree': 'Card Art/Tree.png',
    // 'tree_snowcovered': 'Card Art/Tree_snowcovered.png',
    // 'turtle': 'Card Art/Turtle.png',
    'urayuli': 'Card Art/Urayuli.png',
    'vulture': 'Card Art/TurkeyVulture.png',
    'warren': 'Card Art/Warren.png',
    // 'warren_eaten1': 'Card Art/Warren_eaten1.png',
    // 'warren_eaten2': 'Card Art/Warren_eaten2.png',
    // 'warren_eaten3': 'Card Art/Warren_eaten3.png',
    // 'wolf': 'Card Art/Wolf.png',
    // 'wolfcub': 'Card Art/Wolfcub.png',
    // 'wolverine': 'Card Art/Wolverine.png',

    // 'bluemage': 'Card Art/Bluemage.png',
    // 'emeraldmox': 'Card Art/Emeraldmox.png',
    // 'gemfiend': 'Card Art/Gemfiend.png',
    // 'juniorsage': 'Card Art/Juniorsage.png',
    // 'orangemage': 'Card Art/Orangemage.png',
    // 'practicemage': 'Card Art/Practicemage.png',
    // 'rubygolem': 'Card Art/Rubygolem.png',
    // 'rubymox': 'Card Art/Rubymox.png',
    // 'sapphiremox': 'Card Art/Sapphiremox.png',
    // 'alarmbot': 'Card Art/Alarmbot.png',
    // 'amoebot': 'Card Art/Amoebot.png',
    // 'automaton': 'Card Art/Automaton.png',
    // 'badfish': 'Card Art/Badfish.png',
    // 'batterybot': 'Card Art/Batterybot.png',
    // 'battransformer_beastmode': 'Card Art/Battransformer_beastmode.png',
    // 'battransformer_botmode': 'Card Art/Battransformer_botmode.png',
    // 'beartransformer_beastmode': 'Card Art/Beartransformer_beastmode.png',
    // 'beartransformer_botmode': 'Card Art/Beartransformer_botmode.png',
    // 'bolthound': 'Card Art/Bolthound.png',
    // 'bombbot': 'Card Art/Bombbot.png',
    // 'bomblatcher': 'Card Art/Bomblatcher.png',
    // 'brittlelatcher': 'Card Art/Brittlelatcher.png',
    // 'bustedprinter': 'Card Art/Bustedprinter.png',
    // 'captivefile': 'Card Art/Captivefile.png',
    // 'cellbuff': 'Card Art/Cellbuff.png',
    // 'cellgift': 'Card Art/Cellgift.png',
    // 'celltri': 'Card Art/Celltri.png',
    // 'conduitattack': 'Card Art/Conduitattack.png',
    // 'conduitgems': 'Card Art/Conduitgems.png',
    // 'conduitnull': 'Card Art/Conduitnull.png',
    // 'emptyvessel': 'Card Art/Emptyvessel.png',
    // 'emptyvessel_gem_blue': 'Card Art/Emptyvessel_gem_blue.png',
    // 'emptyvessel_gem_green': 'Card Art/Emptyvessel_gem_green.png',
    // 'emptyvessel_gem_orange': 'Card Art/Emptyvessel_gem_orange.png',
    // 'gemexploder': 'Card Art/Gemexploder.png',
    // 'gemripper': 'Card Art/Gemripper.png',
    // 'gemshielder': 'Card Art/Gemshielder.png',
    // 'giftbot': 'Card Art/Giftbot.png',
    // 'goodfish': 'Card Art/Goodfish.png',
    // 'gunnerbot': 'Card Art/Gunnerbot.png',
    // 'insectodrone': 'Card Art/Insectodrone.png',
    // 'leapbot': 'Card Art/Leapbot.png',
    // 'librarian': 'Card Art/Librarian.png',
    // 'minecart': 'Card Art/Minecart.png',
    // 'morefish': 'Card Art/Morefish.png',
    // 'mycobot': 'Card Art/Mycobot.png',
    // 'ourobot': 'Card Art/Ourobot.png',
    // 'porcupinetransformer_beastmode': 'Card Art/Porcupinetransformer_beastmode.png',
    // 'porcupinetransformer_botmode': 'Card Art/Porcupinetransformer_botmode.png',
    // 'roboskeleton': 'Card Art/Roboskeleton.png',
    // 'sentinel_blue': 'Card Art/Sentinel_blue.png',
    // 'sentinel_green': 'Card Art/Sentinel_green.png',
    // 'sentinel_orange': 'Card Art/Sentinel_orange.png',
    // 'sentrybot': 'Card Art/Sentrybot.png',
    // 'shieldbot': 'Card Art/Shieldbot.png',
    // 'shieldlatcher': 'Card Art/Shieldlatcher.png',
    // 'shutterbug': 'Card Art/Shutterbug.png',
    // 'sniper': 'Card Art/Sniper.png',
    // 'swapbot': 'Card Art/Swapbot.png',
    // 'swapbot_swapped': 'Card Art/Swapbot_swapped.png',
    // 'transformer_adder': 'Card Art/Transformer_adder.png',
    // 'transformer_raven': 'Card Art/Transformer_raven.png',
    // 'transformer_wolf': 'Card Art/Transformer_wolf.png',
  }
}
