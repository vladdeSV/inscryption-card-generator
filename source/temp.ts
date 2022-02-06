import { Resource } from './resource'
import IM from './im'
import { Card } from './card'
import { execSync } from 'child_process'

function generateAct1Card(card: Card, res: Resource): Buffer {
  const im = IM()

  // set up defaults
  im.font(res.get('font', 'default'))
    .pointsize(200)
    .background('None')
    .filter('Box')

  // load card
  im.resource(res.get('card', card.type))

  // resize
  im.resize(undefined, 1050) // 1050 pixels @ 300dpi = 3.5 inches

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

  if (card.cost) {
    const costType = card.cost.type
    if (costType !== 'blood' && costType !== 'bone') {
      throw new Error(`debug: unsupported cost type '${costType}', remove this error message later`)
    }

    const { type, amount } = card.cost
    const costPath = res.get('cost', `${type}_${amount}`)
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

  if (card.health !== undefined) {
    const w = 114
    const h = 215
    const xoffset = card.flags.terrain ? -70 : 0
    im.parens(
      IM()
        .pointsize()
        .size(w, h)
        .label(card.health)
        .gravity('East')
        .extent(w, h)
    ).gravity('NorthEast')
      .geometry(32 - xoffset, 815)
      .composite()
  }

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
    const drawPower = !(card.power === 0 && card.flags.terrain)
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

  if (card.sigils?.length) {
    const sigilCount = card.sigils.length
    const xoffset = card.flags.terrain ? -70 : 0

    if (sigilCount === 1) {
      const sigilPath = `./resource/sigils/${card.sigils[0]}.png`
      im.parens(
        IM(sigilPath)
          .interpolate('Nearest')
          .filter('Point')
          .resize(undefined, 253)
          .filter('Box')
      ).gravity('NorthWest')
        .geometry(221 + xoffset, 733)
        .composite()
    } else if (sigilCount === 2) {
      const sigilPath1 = `./resource/sigils/${card.sigils[0]}.png`
      const sigilPath2 = `./resource/sigils/${card.sigils[1]}.png`
      im.parens(IM(sigilPath1)
        .filter('Box')
        .resize(undefined, 180)
      ).gravity('NorthWest')
        .geometry(331 + xoffset, 720)
        .composite()

      im.parens(IM(sigilPath2)
        .filter('Box')
        .resize(undefined, 180)
      ).gravity('NorthWest')
        .geometry(180 + xoffset, 833)
        .composite()
    }
  }

  if (card.flags.golden) {
    im.parens(
      IM().command('-clone 0 -fill rgb\\(255,128,0\\) -colorize 75')
    ).geometry(0, 0)
      .compose('HardLight')
      .composite()

    // // use emission for default portraits
    // if (card.portrait && card.portrait !== 'custom') {
    //   const scale = 1050 / 190
    //   im.command(`\\( ./resource/portraits/emissions/${card.portrait}.png -filter Box -resize ${scale * 100}% -gravity center -geometry +0-${15 * scale} \\) -compose overlay -composite`)
    // }
  }

  return execSync(im.build('convert', 'out.png'))
}

type Act1Resource = {
  card: Record<Card['type'], string>,
  cardback: Record<'bee' | 'common' | 'deathcard' | 'squirrel', string>,
  cardbackground: Record<'common' | 'rare' | 'special' | 'terrain', string>,
  cost: Record<string, string>,
  tribe: Record<Card['tribes'][number], string>,
  misc: Record<string, string>,
  staticon: Record<'ants' | 'bell' | 'cardsinhand' | 'mirror', string>,
  font: Record<string, string>,
  sigil: Record<string /* Card['sigils'][number] */, string>

}
const act1ResourceMap: Act1Resource = {
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
  },
  'cardbackground': {
    'common': 'cardbackgrounds/common.png',
    'rare': 'cardbackgrounds/rare.png',
    'special': 'cardbackgrounds/special.png',
    'terrain': 'cardbackgrounds/terrain.png',
  },
  'cost': {
    'blood_1': 'costs/blood1.png',
    'blood_2': 'costs/blood2.png',
    'blood_3': 'costs/blood3.png',
    'blood_4': 'costs/blood4.png',
    'bones_1': 'costs/bone1.png',
    'bones_2': 'costs/bone2.png',
    'bones_3': 'costs/bone3.png',
    'bones_4': 'costs/bone4.png',
    'bones_5': 'costs/bone5.png',
    'bones_6': 'costs/bone6.png',
    'bones_7': 'costs/bone7.png',
    'bones_8': 'costs/bone8.png',
    'bones_9': 'costs/bone9.png',
    'bones_10': 'costs/bone10.png',
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
  },
  'font': {
    'default': 'fonts/HEAVYWEIGHT.otf',
    'ko': 'fonts/Stylish-Regular.ttf',
    'jp': 'fonts/ShipporiMincho-ExtraBold.ttf',
    'zh-cn': 'fonts/NotoSerifSC-Bold.otf',
    'zh-tw': 'fonts/NotoSerifTC-Bold.otf',
  },
  'sigil': {
    'allstrike': 'sigils/allstrike.png',
    'beesonhit': 'sigils/beesonhit.png',
    'buffneighbours': 'sigils/buffneighbours.png',
    'corpseeater': 'sigils/corpseeater.png',
    'createbells': 'sigils/createbells.png',
    'createdams': 'sigils/createdams.png',
    'deathtouch': 'sigils/deathtouch.png',
    'debuffenemy': 'sigils/debuffenemy.png',
    'drawant': 'sigils/drawant.png',
    'drawcopy': 'sigils/drawcopy.png',
    'drawcopyondeath': 'sigils/drawcopyondeath.png',
    'drawrabbits': 'sigils/drawrabbits.png',
    'drawrandomcardondeath': 'sigils/drawrandomcardondeath.png',
    'evolve': 'sigils/evolve_1.png',
    'flying': 'sigils/flying.png',
    'guarddog': 'sigils/guarddog.png',
    'icecube': 'sigils/icecube.png',
    'preventattack': 'sigils/preventattack.png',
    'quadruplebones': 'sigils/quadruplebones.png',
    'randomability': 'sigils/randomability.png',
    'randomconsumable': 'sigils/randomconsumable.png',
    'reach': 'sigils/reach.png',
    'sacrificial': 'sigils/sacrificial.png',
    'sharp': 'sigils/sharp.png',
    'splitstrike': 'sigils/splitstrike.png',
    'squirrelorbit': 'sigils/squirrelorbit.png',
    'steeltrap': 'sigils/steeltrap.png',
    'strafe': 'sigils/strafe.png',
    'strafepush': 'sigils/strafepush.png',
    'submerge': 'sigils/submerge.png',
    'tailonhit': 'sigils/tailonhit.png',
    'tripleblood': 'sigils/tripleblood.png',
    'tristrike': 'sigils/tristrike.png',
    'tutor': 'sigils/tutor.png',
    'whackamole': 'sigils/whackamole.png',
  }
}

const testCard: Card = {
  name: 'adder',
  type: 'common',
  health: 1,
  power: 1,
  sigils: ['deathtouch'],
  tribes: ['reptile'],
  decals: [],
  portrait: {
    type: 'creature',
    id: 'adder',
  },
  statIcon: undefined,
  cost: {
    type: 'blood',
    amount: 2,
  },
  flags: {
    combined: false,
    golden: false,
    terrain: false,
  }
}
generateAct1Card(testCard, new Resource('resource', act1ResourceMap))
