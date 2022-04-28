import { BaseCardGenerator, bufferFromCommandBuilder, CardGenerator } from '../base'
import IM from '../../im'
import { Card } from '../../card'
import { SingleResource } from '../../resource'
import { getGemCostResourceId } from '../../fns/helpers'

type Options = { border: boolean, description?: string }

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

const cardBorderPalette: Record<'nature' | 'tech' | 'wizard' | 'undead' | 'misc', { common: string, rare: string }> = {
  nature: { common: '#dc9465', rare: '#ee8272' },
  tech: { common: '#a8c0d8', rare: '#9db7f6' },
  wizard: { common: '#dc93b3', rare: '#ff7ba5' },
  undead: { common: '#97b69e', rare: '#7fbe8c' },
  misc: { common: '#beb6a9', rare: '#d8a986' },
}

const cardDescriptionTextPalette: Record<'nature' | 'tech' | 'wizard' | 'undead' | 'misc', string> = {
  nature: '#7d4e30',
  tech: '#497b9c',
  wizard: '#9c4980',
  undead: '#6a7054',
  misc: '#635f58',
}

type SigilEntry = {
  name: string,
  text: string,
  sigilId: string,
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

    im.font(this.resource.get('font', 'heavyweight'))
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
        .geometry(7, 21)
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

    // name
    if (card.name) {
      im.gravity('North')
        .pointsize(110)
        .fill('black')
        .command('-draw').command(`text 0,90 '${card.name.replaceAll('\'', '\\\'')}'`)
    }

    // power
    if (!card.statIcon) {
      im.gravity('NorthWest')
        .pointsize(110)
        .fill('black')
        .command('-draw').command(`text 146,842 '${card.power}'`)
    }

    // health
    im.gravity('NorthWest')
      .pointsize(110)
      .fill('black')
      .command('-draw').command(`text 841,175 '${card.health}'`)

    // this.options.description = 'Push your luck, what could go wrong.'

    if (this.options.description) {
      const description = IM()
        .background('None')
        .fill(cardDescriptionTextPalette[cardPalette])
        .pointsize(45)
        .label(this.options.description)
        .trim()
        .gravity('Center')

      im.parens(description)
        .gravity('Center')
        .geometry(609 - 510, 938 - 730)
        .composite()
    }

    // sigils
    const sigilInformations: SigilEntry[] = card.sigils
      .map(sigil => this.sigilInformationMap[sigil] ?? { name: 'Lorem ipsum', text: 'dolor sit amet', sigilId: sigil })

    if (card.statIcon === 'ants') {
      sigilInformations.unshift({ name: 'Colony', text: 'This card\'s power is equal to the numer of cards with the "colony" sigil on your side of the field.', sigilId: 'colony' })
    }

    const sigilSections = sigilInformations.map(sigilInformation => {
      const caption = IM()
        .size(660)
        .background('None')
        .pointsize(44)
        .command(`caption:${sigilInformation.text}`)
        .trim()

      const section = IM().size(880, 666).command('xc:transparent')
        // add sigil icon
        .resource(this.resource.get('sigil', sigilInformation.sigilId))
        // .command('(', 'rose:', '-resize', '176x176!', ')')
        .gravity('NorthWest').geometry(2, -10).composite()

        // draw sigil name
        .pointsize(55).command('-draw', `text 187,4 '${sigilInformation.name.replaceAll('\'', '\\\'')}'`)

        // add caption
        .parens(caption).gravity('NorthWest').geometry(220, 60).composite()

        // trim bottom
        .gravity('North')
        .background('white').command('-splice', '0x1')
        .background('black').command('-splice', '0x1')
        .trim().command('+repage').command('-chop', '0x1')

        // add padding to bottom
        .gravity('South').background('transparent').command('-splice', '0x24')

      return section
    })

    const isConduit = card.sigils.some(sigil => sigil.includes('conduit'))
    if (isConduit) {
      sigilSections.unshift(IM().resource(this.resource.get('conduit', 'null')))
    }

    if (sigilSections.length) {
      const sections = IM()

      for (const section of sigilSections) {
        sections.parens(section)
      }

      sections.command('-append')

      im.parens(sections).gravity('North').geometry(0, isConduit ? 956 : 976).composite()
    }

    // extended border
    if (this.options.border) {
      im.gravity('Center').background(cardBorderPalette[cardPalette][card.flags.rare ? 'rare' : 'common']).extent(1120, 1560)
    }

    return bufferFromCommandBuilder(im/*, input*/)
  }

  generateBack(): Promise<Buffer> {
    throw new Error('Method not implemented.')
  }

  private sigilInformationMap: { [s: string]: SigilEntry } = {
    'madeofstone': { name: 'Made of Stone', text: 'This card is uneffected by the effects of the "Touch of Death" and "Stinky" sigils.', sigilId: 'madeofstone' },

    'sacrificial': { name: 'Many Lives', text: 'When this card is sacrificed, it does not perish.', sigilId: 'sacrificial' },
    'flying': { name: 'Airborne', text: 'This card attacks the opponent directly instead of the opposing card.', sigilId: 'flying' },
    'debuffenemy': { name: 'Stinky', text: 'While this card is on the field, the opposing card has their Power reduced by 1.', sigilId: 'debuffenemy' },
    'corpseeater': { name: 'Corpse Eater', text: 'When a card on your side of the field perishes by battle, this card is played in its place.', sigilId: 'corpseeater' },
    'deathtouch': { name: 'Touch of Death', text: 'When this card damages an opposing card, that card perishes.', sigilId: 'deathtouch' },
    'splitstrike': { name: 'Bifurcated Strike', text: 'This card attacks only the lanes left and right of the opposing space when it attacks.', sigilId: 'splitstrike' },
    'submerge': { name: 'Waterborne', text: 'Attacks targeting this card instead hit the owner of this card directly.', sigilId: 'submerge' },
    'gainbattery': { name: 'Battery Bearer', text: 'When this card is played, it provides 1 Energy Cell to its owner.', sigilId: 'gainbattery' },
    'drawcopyondeath': { name: 'Unkillable', text: 'When this card perishes, it goes back to your hand instead of being discarded.', sigilId: 'drawcopyondeath' },
    'beesonhit': { name: 'Bees Within', text: 'When this card is damaged, search 1 "Bee" card from your deck to your hand.', sigilId: 'beesonhit' },
    'buffneighbours': { name: 'Leader', text: 'While this card is on the field, increase the Power of the cards left and right of this card by 1.', sigilId: 'buffneighbours' },
    'drawant': { name: 'Ant Spawner', text: 'When this card is played, search 1 "Worker Ant" from your deck to your hand.', sigilId: 'drawant' },
    'drawcopy': { name: 'Fecundity', text: 'When this card is played, search 1 copy of it from your deck to your hand.', sigilId: 'drawcopy' },
    'drawrabbits': { name: 'Rabbit Hole', text: 'When this card is played, search 1 "Rabbit" from your deck to your hand.', sigilId: 'drawrabbits' },
    'evolve_1': { name: 'Fledgling', text: 'During your next draw step after this card is played, it ages into a "X"', sigilId: 'evolve_1' },
    'guarddog': { name: 'Guardian', text: 'When an opposing card is played opposite an empty space, this card moves to that space.', sigilId: 'guarddog' },
    'quadruplebones': { name: 'Bone King', text: 'When this card perishes, it provides 4 Bones instead of 1.', sigilId: 'quadruplebones' },
    'randomconsumable': { name: 'Trinket Bearer', text: 'When this card is played, draw 1 card from your deck or side deck.', sigilId: 'randomconsumable' },
    'reach': { name: 'Mighty Leap', text: 'If the opposing card has the "Airborne" sigil, it attacks this card instead of attacking directly.', sigilId: 'reach' },
    'sharp': { name: 'Sharp Quills', text: 'When a card attacks this card, that card is dealt 1 damage.', sigilId: 'sharp' },
    'strafe': { name: 'Sprinter', text: 'During your End Step, this card shifts to an adjacent empty lane.', sigilId: 'strafe' },
    'strafepush': { name: 'Hefty', text: 'During your End Step, this card shifts to an adjacent lane, pushing cards in the way with it.', sigilId: 'strafepush' },
    'tripleblood': { name: 'Worthy Sacrifice', text: 'This card is worth 3 Blood when sacrificed.', sigilId: 'tripleblood' },
    'tristrike': { name: 'Trifurcated Strike', text: 'This card attacks the lanes left and right of, as well as, the opposing space when it attacks.', sigilId: 'tristrike' },
    'tutor': { name: 'Hoarder', text: 'When this card is played, search any 1 card from your deck to your hand.', sigilId: 'tutor' },
    'whackamole': { name: 'Burrower', text: 'If an opposing card would attack an empty lane, this card moves to be hit instead.', sigilId: 'whackamole' },
    'squirrelstrafe': { name: 'Squirrel Shedder', text: 'During your End Step, this card shifts to an adjacent empty lane. Play a "Squirrel" card in this card\'s previous lane.', sigilId: 'squirrelstrafe' },
    'brittle': { name: 'Brittle', text: 'During your End Step, this card perishes.', sigilId: 'brittle' },
    'bonedigger': { name: 'Bone Digger', text: 'During your End Step, this card generates 1 Bone.', sigilId: 'bonedigger' },
    'preventattack': { name: 'Repulsive', text: 'If an opposing card would attack this card, negate that attack.', sigilId: 'preventattack' },
    'deathshield': { name: 'Armored', text: 'The first time this card would take damage, negate that damage.', sigilId: 'deathshield' },
    'drawrandomcardondeath': { name: 'Gift Bearer', text: 'When this card perishes, draw 1 card from your deck.', sigilId: 'drawrandomcardondeath' },
    'buffgems': { name: 'Gem Animator', text: 'While this card is on the field, all "Mox" cards on your side of the field gain 1 Power.', sigilId: 'buffgems' },
    'droprubyondeath': { name: 'Ruby Heart', text: 'When this card perishes, search 1 "Ruby Mox" from your side deck and play it in this space.', sigilId: 'droprubyondeath' },
    'gemdependant': { name: 'Gem Dependant', text: 'If there are no Gems on your side of the field, this card perishes.', sigilId: 'gemdependant' },
    'gemsdraw': { name: 'Mental Gemnastics', text: 'When this card is played, draw cards from your deck equal to the number of "Mox" cards on your side of the field.', sigilId: 'gemsdraw' },
    'custom-gempowered': { name: 'Gem Powered', text: 'This card\'s power is equal to the number of Gems provided on your side of the field, to a maximum of 5 Power.', sigilId: 'custom-gempowered' },
    'custom-bloodless': { name: 'Bloodless', text: 'This card cannot be sacrificed.', sigilId: 'custom-bloodless' },
    'shieldgems': { name: 'Gem Guardian', text: 'While this card is on the field, any attacks targeting "Mox" cards on your side of the field are negated.', sigilId: 'shieldgems' },
    'gaingemblue': { name: 'Blue Gem', text: 'While this card is on the field, it provides 1 "Blue Gem".', sigilId: 'gaingemblue' },
    'gaingemgreen': { name: 'Green Gem', text: 'While this card is on the field, it provides 1 "Green Gem".', sigilId: 'gaingemgreen' },
    'gaingemorange': { name: 'Orange Gem', text: 'While this card is on the field, it provides 1 "Orange Gem".', sigilId: 'gaingemorange' },
    'custom-gaingemprism': { name: 'Prism Gem', text: 'While this card is on the field, it provides 1 Gem of any color.', sigilId: 'custom-gaingemprism' },
    'gaingemtriple': { name: 'Grand Mox', text: 'While this card is on the field, it provides 1 "Orange Gem," 1 "Blue Gem," and 1 "Green Gem".', sigilId: 'gaingemtriple' },
    'icecube': { name: 'Frozen Away', text: 'When this card perishes, search 1 "X" from your deck and play it in this card\'s place.', sigilId: 'icecube' },
    'skeletonstrafe': { name: 'Skeleton Crew', text: 'During your End Step, this card shifts to an adjacent empty lane. Play a "Skeleton" card in this card\'s previous lane.', sigilId: 'skeletonstrafe' },
    'drawnewhand': { name: 'Handy', text: 'When this card is played, discard your hand, then draw a total of 4 cards from your deck and/or side deck.', sigilId: 'drawnewhand' },
    'loot': { name: 'Looter', text: 'When this card deals damage directly, draw a card for each damage dealt by this card.', sigilId: 'loot' },
    'custom-spinewalker': { name: 'Spine Walker', text: 'During your End Step, this card shifts to an adjacent empty lane, generating 1 Bone in the process.', sigilId: 'custom-spinewalker' },
    'doubledeath': { name: 'Double Death', text: 'While this card is on the field, any cards that perish on your side of the field perish a second time.', sigilId: 'doubledeath' },
    'bloodguzzler': { name: 'Bloodsucker', text: 'When this card damages an opposing card, this card restores 1 Health, up to this cards\' maximum Health.', sigilId: 'bloodguzzler' },
    'explodeondeath': { name: 'Detonator', text: 'When this card perishes, adjacent and opposing cards are dealt 10 damage.', sigilId: 'explodeondeath' },
    'sentry': { name: 'Sentry', text: 'When a card is played or moved opposite this card, the opposing card is dealt 1 damage.', sigilId: 'sentry' },
    'sniper': { name: 'Sniper', text: 'When this card attacks, it can target and 1 space on the opponents\' side of the field.', sigilId: 'sniper' },
    'bombspawner': { name: 'Insta-Bomber', text: 'When this card is played, target 1 card on the field. That card is dealt 10 damage.', sigilId: 'bombspawner' },
    'steeltrap': { name: 'Steel Trap', text: 'When this card perishes, the opposing card is dealt 10 damage.', sigilId: 'steeltrap' },
    'custom-moxdropper': { name: 'Mox Dropper', text: 'During your End Step, this card shifts to an adjacent empty lane. Search 1 "Mox" card from your side deck and play it in this card\'s previous lane.', sigilId: 'custom-moxdropper' },
    'activateddealdamage': { name: 'Energy Gun', text: 'During your Play Step, you can pay 1 Energy to deal 1 damage to a card opposing this card.', sigilId: 'activateddealdamage' },
    'activatedrandompowerenergy': { name: 'Power Dice', text: 'During your Play Step, you can pay 1 Energy to roll a 6 sided die. This cards\' Power is equal to the number rolled.', sigilId: 'activatedrandompowerenergy' },
    'activatedenergytobones': { name: 'Bonehorn', text: 'During your Play Step, you can pay 1 Energy to gain 3 Bones. This card can only do this once per turn.', sigilId: 'activatedenergytobones' },
    'activateddrawskeleton': { name: 'Disentomb', text: 'During your Play Step, you can pay 1 Bone to search 1 "Skeleton" from your side deck to your hand.', sigilId: 'activateddrawskeleton' },
    'activatedstatsup': { name: 'Enlarge', text: 'During your Play Step, you can pay 2 Bones to increase the Health and Power of this card by 1. If this card has 5 Power or Health, this effect cannot be used.', sigilId: 'activatedstatsup' },
    'activatedstatsupenergy': { name: 'Stimulate', text: 'During your Play Step, you can pay 3 Energy to increase the Health and Power of this card by 1. If this card has 5 Power or Health, this effect cannot be used.', sigilId: 'activatedstatsupenergy' },
    'activatedsacrificedrawcards': { name: 'True Scholar', text: 'During your Play Step, if you have a Blue Gem on your side of the field, you can destroy this card to draw 3 cards.', sigilId: 'activatedsacrificedrawcards' },
    'conduitnull': { name: 'Null Conduit', text: 'This card may complete a Circuit, but provides no effect.', sigilId: 'conduitnull' },
    'conduitbuffattack': { name: 'Attack Conduit', text: 'While this card is part of a Circuit, all cards inside the Circuit gain 1 Power.', sigilId: 'conduitbuffattack' },
    'conduitfactory': { name: 'Spawn Conduit', text: 'While this card is part of a Circuit, during your End Step search 1 "L33pb0t" from your side deck and play it within an empty space in the Circuit.', sigilId: 'conduitfactory' },
    'conduitenergy': { name: 'Energy Conduit', text: 'While this card is part of a Circuit, your Energy does not deplete from its current level.', sigilId: 'conduitenergy' },
    'custom-conduitfrog': { name: 'Frog Friend', text: 'During your End Step, this card shifts to an adjacent empty lane. Search 1 "Frog" card from your deck and play it in this card\'s previous lane.', sigilId: 'custom-conduitfrog' }
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
    'wolfcub': 'Card Art/WolfCub.png',
    'stoat_talking': 'Card Art/Stoat.png',
    // 'wolf_talking': 'Card Art/Wolf_talking.png',
    'stinkbug_talking': 'Card Art/Stinkbug.png',
    'banshee': 'Card Art/Banshee.png',
    'bonehound': 'Card Art/BoneHound.png',
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
    'goldnugget': 'Card Art/GoldNugget.png',
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
    'moleman': 'Card Art/MoleMan.png',
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
    'ravenegg': 'Card Art/RavenEgg.png',
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
  },
  'font': {
    'heavyweight': 'Fonts/HEAVYWEIGHT.otf',
  },
  'sigil': {
    'colony': 'Sigils/SigilColony.png',

    'madeofstone': 'Sigils/SigilMadeOfStone.png', // missing

    'flying': 'Sigils/SigilAirborne.png',
    'drawant': 'Sigils/SigilAntSpawner.png',
    'deathshield': 'Sigils/SigilArmored.png',
    'conduitbuffattack': 'Sigils/SigilAttackConduit.png',
    'gainbattery': 'Sigils/SigilBatteryBearer.png',
    'splitstrike': 'Sigils/SigilBifurcatedStrike.png',
    'bloodguzzler': 'Sigils/SigilBloodSucker.png',
    'gaingemblue': 'Sigils/SigilBlueGem.png',
    'bombspawner': 'Sigils/SigilInstaBomber.png',
    'bonedigger': 'Sigils/SigilBoneDigger.png',
    'activatedenergytobones': 'Sigils/SigilBoneHorn.png',
    'quadruplebones': 'Sigils/SigilBoneKing.png',
    'brittle': 'Sigils/SigilBrittle.png',
    'whackamole': 'Sigils/SigilBurrower.png',
    'corpseeater': 'Sigils/SigilCorpseEater.png',
    'explodeondeath': 'Sigils/SigilDetonator.png',
    'activateddrawskeleton': 'Sigils/SigilDisentomb.png',
    'doubledeath': 'Sigils/SigilDoubleDeath.png',
    'conduitenergy': 'Sigils/SigilEnergyConduit.png',
    'activateddealdamage': 'Sigils/SigilEnergyGun.png',
    'activatedstatsup': 'Sigils/SigilEnlarge.png',
    'drawcopy': 'Sigils/SigilFecundity.png',
    'evolve': 'Sigils/SigilFledgeling.png',
    'icecube': 'Sigils/SigilFrozenAway.png',
    'beesonhit': 'Sigils/SigilFullOfBees.png',
    'buffgems': 'Sigils/SigilGemAnimator.png',
    'gemdependant': 'Sigils/SigilGemDependant.png',
    'drawrandomcardondeath': 'Sigils/SigilGiftBearer.png',
    'gaingemtriple': 'Sigils/SigilGrandMox.png',
    'gaingemgreen': 'Sigils/SigilGreenGem.png',
    'guarddog': 'Sigils/SigilGuardian.png',
    'drawnewhand': 'Sigils/SigilHandy.png',
    'strafepush': 'Sigils/SigilHefty.png',
    'tutor': 'Sigils/SigilHoarder.png',
    'buffneighbours': 'Sigils/SigilLeader.png',
    'loot': 'Sigils/SigilLooter.png',
    'sacrificial': 'Sigils/SigilManyLives.png',
    'gemsdraw': 'Sigils/SigilMentalGemnastics.png',
    'reach': 'Sigils/SigilMightyLeap.png',
    'conduitnull': 'Sigils/SigilNullConduit.png',
    'gaingemorange': 'Sigils/SigilOrangeGem.png',
    'activatedrandompowerenergy': 'Sigils/SigilPowerDice.png',
    'drawrabbits': 'Sigils/SigilRabbitHole.png',
    'preventattack': 'Sigils/SigilRepulsive.png',
    'droprubyondeath': 'Sigils/SigilRubyHeart.png',
    'sentry': 'Sigils/SigilSentry.png',
    'sharp': 'Sigils/SigilSharpQuills.png',
    'skeletonstrafe': 'Sigils/SigilSkeletonCrew.png',
    'sniper': 'Sigils/SigilSniper.png',
    'conduitfactory': 'Sigils/SigilSpawnConduit.png',
    'strafe': 'Sigils/SigilSprinter.png',
    'squirrelstrafe': 'Sigils/SigilSquirrelShedder.png',
    'steeltrap': 'Sigils/SigilSteelTrap.png',
    'activatedstatsupenergy': 'Sigils/SigilStimulate.png',
    'debuffenemy': 'Sigils/SigilStinky.png',
    'deathtouch': 'Sigils/SigilTouchOfDeath.png',
    'tristrike': 'Sigils/SigilTrifurcatedStrike.png',
    'randomconsumable': 'Sigils/SigilTrinketBearer.png',
    'activatedsacrificedrawcards': 'Sigils/SigilTrueScholar.png',
    'drawcopyondeath': 'Sigils/SigilUndying.png',
    'submerge': 'Sigils/SigilWaterborne.png',
    'tripleblood': 'Sigils/SigilWorthySacrifice.png',
  },
  'conduit': {
    'attack': 'Conduits/ConduitAttack.png',
    'energy': 'Conduits/ConduitEnergy.png',
    'null': 'Conduits/ConduitNull.png',
    'spawner': 'Conduits/ConduitSpawner.png',
  }
}
