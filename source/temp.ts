import { Resource } from './resource'
import IM from './im'
import { Card } from './card'
import { execSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { convertJsonCard } from './jsoncard'
import { foo } from './parsecard'

function generateAct1Card(card: Card, res: Resource, locale: string): Buffer {
  const im = IM()

  const originalCardHeight = 190 // px
  const fullsizeCardHeight = 1050 // px
  const v = originalCardHeight / originalCardHeight

  // parts are shifted if having terrain card layout
  const terrainLayoutXoffset = card.flags.terrain ? -70 : 0

  // set up defaults
  im.font(res.get('font', 'default'))
    .pointsize(200)
    .background('None')
    .filter('Box')

  // load card
  im.resource(res.get('card', card.type))

  if (card.portrait?.type === 'creature') {
    im.resource(res.get('portrait', card.portrait.id))
      .gravity('Center')
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

  // health
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

  if (card.sigils.length === 1) {
    const sigilPath = res.get('sigil', card.sigils[0])
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
    const sigilPath1 = res.get('sigil', card.sigils[0])
    const sigilPath2 = res.get('sigil', card.sigils[1])
    im.parens(IM(sigilPath1)
      .filter('Box')
      .resize(undefined, 180)
    ).gravity('NorthWest')
      .geometry(331 + terrainLayoutXoffset, 720)
      .composite()

    im.parens(IM(sigilPath2)
      .filter('Box')
      .resize(undefined, 180)
    ).gravity('NorthWest')
      .geometry(180 + terrainLayoutXoffset, 833)
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
        .resizeExt(r => r.scale(106, 100, '!'))
    ).gravity('North')
      .geometry(position.x, position.y)
      .composite()
      .font(res.get('font', 'default'))
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
        const scale = 1050 / 190
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

  // if (card.flags.isEnhanced && card.portrait !== 'custom') {
  //   const scale = 1050 / 190
  //   im.parens(IM(`./resource/portraits/emissions/${card.portrait}.png`).command(`-fill rgb\\(161,247,186\\) -colorize 100 -resize ${scale * 100}%`).gravity('center').geometry(3, -15 * scale)).composite()
  //   im.parens(IM(`./resource/portraits/emissions/${card.portrait}.png`).command(`-fill rgb\\(161,247,186\\) -colorize 100 -resize ${scale * 100}%`).gravity('center').geometry(3, -15 * scale).command('-blur 0x10')).composite()
  // }

  return execSync(im.build('convert', '-'))
}

function getGameTranslationId(id: string | undefined): string | undefined {

  if (id === 'Stoat_Talking') {
    id = 'stoat'
  }

  if (id === 'Smoke_NoBones') {
    id = 'smoke'
  }

  if (id === '!DEATHCARD_LESHY') {
    return undefined
  }

  return id?.toLowerCase()

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
  sigil: Record<string /* Card['sigils'][number] */, string>,
  portrait: Record<string, string>
  emission: Record<string, string>
  decal: Record<Card['decals'][number], string>
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
  },
  'portrait': {
    'adder': 'portraits/adder.png',
    'alarmbot': 'portraits/alarmbot.png',
    'alpha': 'portraits/alpha.png',
    'amalgam': 'portraits/amalgam.png',
    'amoeba': 'portraits/amoeba.png',
    'amoebot': 'portraits/amoebot.png',
    'ant': 'portraits/ant.png',
    'antqueen': 'portraits/antqueen.png',
    'automaton': 'portraits/automaton.png',
    'badfish': 'portraits/badfish.png',
    'baitbucket': 'portraits/baitbucket.png',
    'banshee': 'portraits/banshee.png',
    'bat': 'portraits/bat.png',
    'batterybot': 'portraits/batterybot.png',
    'battransformer_beastmode': 'portraits/battransformer_beastmode.png',
    'battransformer_botmode': 'portraits/battransformer_botmode.png',
    'beartransformer_beastmode': 'portraits/beartransformer_beastmode.png',
    'beartransformer_botmode': 'portraits/beartransformer_botmode.png',
    'beaver': 'portraits/beaver.png',
    'bee': 'portraits/bee.png',
    'beehive': 'portraits/beehive.png',
    'tail_bird': 'portraits/bird_tail.png',
    'bloodhound': 'portraits/bloodhound.png',
    'bolthound': 'portraits/bolthound.png',
    'bombbot': 'portraits/bombbot.png',
    'bomblatcher': 'portraits/bomblatcher.png',
    'bonehound': 'portraits/bonehound.png',
    'boulder': 'portraits/boulder.png',
    'brittlelatcher': 'portraits/brittlelatcher.png',
    'bullfrog': 'portraits/bullfrog.png',
    'bustedprinter': 'portraits/bustedprinter.png',
    'cagedwolf': 'portraits/cagedwolf.png',
    'tail_furry': 'portraits/canine_tail.png',
    'captivefile': 'portraits/captivefile.png',
    'cat': 'portraits/cat.png',
    'catundead': 'portraits/cat_undead.png',
    'cellbuff': 'portraits/cellbuff.png',
    'cellgift': 'portraits/cellgift.png',
    'celltri': 'portraits/celltri.png',
    'cockroach': 'portraits/cockroach.png',
    'conduitattack': 'portraits/conduitattack.png',
    'conduitgems': 'portraits/conduitgems.png',
    'conduitnull': 'portraits/conduitnull.png',
    'coyote': 'portraits/coyote.png',
    'dam': 'portraits/dam.png',
    'daus': 'portraits/daus.png',
    'dausbell': 'portraits/dausbell.png',
    'elk': 'portraits/deer.png',
    'elkcub': 'portraits/deercub.png',
    'emptyvessel': 'portraits/emptyvessel.png',
    'fieldmouse': 'portraits/fieldmice.png',
    'franknstein': 'portraits/franknstein.png',
    'frozen_opossum': 'portraits/frozen_opossum.png',
    'geck': 'portraits/geck.png',
    'gemexploder': 'portraits/gemexploder.png',
    'gemripper': 'portraits/gemripper.png',
    'gemshielder': 'portraits/gemshielder.png',
    'giftbot': 'portraits/giftbot.png',
    'goat': 'portraits/goat.png',
    'goat_sexy': 'portraits/goat_sexy.png',
    'goldnugget': 'portraits/goldnugget.png',
    'goodfish': 'portraits/goodfish.png',
    'gravedigger': 'portraits/gravedigger.png',
    'grizzly': 'portraits/grizzly.png',
    'gunnerbot': 'portraits/gunnerbot.png',
    'tail_insect': 'portraits/insect_tail.png',
    'insectodrone': 'portraits/insectodrone.png',
    'jerseydevil': 'portraits/jerseydevil.png',
    'jerseydevil_sleeping': 'portraits/jerseydevil_sleeping.png',
    'kingfisher': 'portraits/kingfisher.png',
    'lammergeier': 'portraits/lammergeier.png',
    'leapbot': 'portraits/leapbot.png',
    'librarian': 'portraits/librarian.png',
    'maggots': 'portraits/maggots.png',
    'magpie': 'portraits/magpie.png',
    'mantis': 'portraits/mantis.png',
    'mantisgod': 'portraits/mantisgod.png',
    'minecart': 'portraits/minecart.png',
    'mole': 'portraits/mole.png',
    'moleman': 'portraits/moleman.png',
    'moon': 'portraits/moon.png',
    'moon_portrait': 'portraits/moon_portrait-resources.assets-1751.png',
    'moose': 'portraits/moose.png',
    'morefish': 'portraits/morefish.png',
    'mothman_stage1': 'portraits/mothman_1.png',
    'mothman_stage2': 'portraits/mothman_2.png',
    'mothman_stage3': 'portraits/mothman_3.png',
    'mule': 'portraits/mule.png',
    'mycobot': 'portraits/mycobot.png',
    'opossum': 'portraits/opossum.png',
    'otter': 'portraits/otter.png',
    'ouroboros': 'portraits/ouroboros.png',
    'ourobot': 'portraits/ourobot.png',
    'packrat': 'portraits/packrat.png',
    'peltgolden': 'portraits/pelt_golden.png',
    'pelthare': 'portraits/pelt_hare.png',
    'peltwolf': 'portraits/pelt_wolf.png',
    'porcupine': 'portraits/porcupine.png',
    'porcupinetransformer_beastmode': 'portraits/porcupinetransformer_beastmode.png',
    'porcupinetransformer_botmode': 'portraits/porcupinetransformer_botmode.png',
    'pronghorn': 'portraits/pronghorn.png',
    'rabbit': 'portraits/rabbit.png',
    'ratking': 'portraits/ratking.png',
    'rattler': 'portraits/rattler.png',
    'raven': 'portraits/raven.png',
    'ravenegg': 'portraits/ravenegg.png',
    'revenant': 'portraits/revenant.png',
    'ringworm': 'portraits/ringworm.png',
    'roboskeleton': 'portraits/roboskeleton.png',
    'sentinel_blue': 'portraits/sentinel_blue.png',
    'sentinel_green': 'portraits/sentinel_green.png',
    'sentinel_orange': 'portraits/sentinel_orange.png',
    'sentrybot': 'portraits/sentrybot.png',
    'shark': 'portraits/shark.png',
    'shieldbot': 'portraits/shieldbot.png',
    'shieldlatcher': 'portraits/shieldlatcher.png',
    'shutterbug': 'portraits/shutterbug.png',
    'sinkhole': 'portraits/sinkhole.png',
    'skeleton': 'portraits/skeleton.png',
    'skink': 'portraits/skink.png',
    'skinktail': 'portraits/skink_tail.png',
    'skink_tailless': 'portraits/skink_tailless.png',
    'skunk': 'portraits/skunk.png',
    'smoke': 'portraits/smoke.png',
    'smoke_improved': 'portraits/smoke_improved.png',
    'sniper': 'portraits/sniper.png',
    'sparrow': 'portraits/sparrow.png',
    'squidbell': 'portraits/squidbell.png',
    'squidcards': 'portraits/squidcards.png',
    'squidmirror': 'portraits/squidmirror.png',
    'squirrel': 'portraits/squirrel.png',
    'squirrel_scared': 'portraits/squirrel_scared.png',
    'starvation': 'portraits/starvingman.png',
    'stinkbug_talking': 'portraits/stinkbug_talking.png',
    'stoat_talking': 'portraits/stoat_talking.png',
    'stones': 'portraits/stones.png',
    'stump': 'portraits/stump.png',
    'swapbot': 'portraits/swapbot.png',
    'swapbot_swapped': 'portraits/swapbot_swapped.png',
    'transformer_adder': 'portraits/transformer_adder.png',
    'transformer_raven': 'portraits/transformer_raven.png',
    'transformer_wolf': 'portraits/transformer_wolf.png',
    'trap': 'portraits/trap.png',
    'trap_closed': 'portraits/trap_closed.png',
    'trapfrog': 'portraits/trapfrog.png',
    'tree': 'portraits/tree.png',
    'tree_snowcovered': 'portraits/tree_snowcovered.png',
    'snapper': 'portraits/turtle.png',
    'urayuli': 'portraits/urayuli.png',
    'vulture': 'portraits/vulture.png',
    'warren': 'portraits/warren.png',
    'warren_eaten1': 'portraits/warren_eaten1.png',
    'warren_eaten2': 'portraits/warren_eaten2.png',
    'warren_eaten3': 'portraits/warren_eaten3.png',
    'wolf': 'portraits/wolf.png',
    'wolf_talking': 'portraits/wolf_talking.png',
    'wolfcub': 'portraits/wolfcub.png',
  },
  'emission': {
    'adder': 'emissions/adder.png',
    'alpha': 'emissions/alpha.png',
    'amalgam': 'emissions/amalgam.png',
    'amoeba': 'emissions/amoeba.png',
    'ant': 'emissions/ant.png',
    'antqueen': 'emissions/antqueen.png',
    'banshee': 'emissions/banshee.png',
    'bat': 'emissions/bat.png',
    'beaver': 'emissions/beaver.png',
    'bee': 'emissions/bee.png',
    'beehive': 'emissions/beehive.png',
    'bloodhound': 'emissions/bloodhound.png',
    'bonehound': 'emissions/bonehound.png',
    'bullfrog': 'emissions/bullfrog.png',
    'cagedwolf': 'emissions/cagedwolf.png',
    'cat': 'emissions/cat.png',
    'cockroach': 'emissions/cockroach.png',
    'coyote': 'emissions/coyote.png',
    'elk': 'emissions/deer.png',
    'elkcub': 'emissions/deercub.png',
    'fieldmouse': 'emissions/fieldmice.png',
    'franknstein': 'emissions/franknstein.png',
    'geck': 'emissions/geck.png',
    'goat': 'emissions/goat.png',
    'goldnugget': 'emissions/goldnugget.png',
    'gravedigger': 'emissions/gravedigger.png',
    'grizzly': 'emissions/grizzly.png',
    'kingfisher': 'emissions/kingfisher.png',
    'lammergeier': 'emissions/lammergeier.png',
    'maggots': 'emissions/maggots.png',
    'magpie': 'emissions/magpie.png',
    'mantis': 'emissions/mantis.png',
    'mantisgod': 'emissions/mantisgod.png',
    'mole': 'emissions/mole.png',
    'moleman': 'emissions/moleman.png',
    'moose': 'emissions/moose.png',
    'opossum': 'emissions/opossum.png',
    'otter': 'emissions/otter.png',
    'packrat': 'emissions/packrat.png',
    'peltgolden': 'emissions/pelt_golden.png',
    'porcupine': 'emissions/porcupine.png',
    'pronghorn': 'emissions/pronghorn.png',
    'rabbit': 'emissions/rabbit.png',
    'ratking': 'emissions/ratking.png',
    'rattler': 'emissions/rattler.png',
    'raven': 'emissions/raven.png',
    'ravenegg': 'emissions/ravenegg.png',
    'revenant': 'emissions/revenant.png',
    'ringworm': 'emissions/ringworm.png',
    'shark': 'emissions/shark.png',
    'skeleton': 'emissions/skeleton.png',
    'skink': 'emissions/skink.png',
    'skink_tailless': 'emissions/skink_tailless.png',
    'skunk': 'emissions/skunk.png',
    'smoke_improved': 'emissions/smoke_improved.png',
    'sparrow': 'emissions/sparrow.png',
    'squidbell': 'emissions/squidbell.png',
    'squidmirror': 'emissions/squidmirror.png',
    'squirrel': 'emissions/squirrel.png',
    'stinkbug_talking': 'emissions/stinkbug_talking.png',
    'stoat_talking': 'emissions/stoat_talking.png',
    'snapper': 'emissions/turtle.png',
    'urayuli': 'emissions/urayuli.png',
    'vulture': 'emissions/vulture.png',
    'warren': 'emissions/warren.png',
    'wolf': 'emissions/wolf.png',
    'wolf_talking': 'emissions/wolf_talking.png',
    'wolfcub': 'emissions/wolfcub.png',
  },
  'decal': {
    'snelk': 'decals/snelk.png',
    'child': 'decals/child.png',
    'leshy': 'decals/leshy.png',
    'smoke': 'decals/smoke.png',
    'combined': 'decals/combined.png',
    'blood': 'decals/blood.png'
  }
}

const res = new Resource('resource', act1ResourceMap)

const textChunks = readFileSync('./creatures.txt', 'utf-8').trim().split('---').map(x => x.trim())
const jsonCards = textChunks.map(foo)
const cards: Card[] = jsonCards.map(convertJsonCard)

const translations = JSON.parse(readFileSync('translations.json', 'utf-8'))
const act1Cards = ['Adder', 'Alpha', 'Amalgam', 'Amoeba', 'Ant', 'AntQueen', 'Bat', 'Beaver', 'Bee', 'Beehive', 'Bloodhound', 'Bullfrog', 'CagedWolf', 'Cat', 'CatUndead', 'Cockroach', 'Coyote', 'Daus', 'Elk', 'ElkCub', 'FieldMouse', 'Geck', 'Goat', 'Grizzly', 'JerseyDevil', 'Kingfisher', 'Maggots', 'Magpie', 'Mantis', 'MantisGod', 'Mole', 'MoleMan', 'Moose', 'Mothman_Stage1', 'Mothman_Stage2', 'Mothman_Stage3', 'Mule', 'Opossum', 'Otter', 'Ouroboros', 'PackRat', 'Porcupine', 'Pronghorn', 'Rabbit', 'RatKing', 'Rattler', 'Raven', 'RavenEgg', 'Shark', 'Skink', 'SkinkTail', 'Skunk', 'Snapper', 'Snelk', 'Sparrow', 'SquidBell', 'SquidCards', 'SquidMirror', 'Squirrel', 'Tail_Bird', 'Tail_Furry', 'Tail_Insect', 'Urayuli', 'Vulture', 'Warren', 'Wolf', 'WolfCub', '!DEATHCARD_LESHY', 'BaitBucket', 'Dam', 'DausBell', 'GoldNugget', 'PeltGolden', 'PeltHare', 'PeltWolf', 'RingWorm', 'Smoke', 'Smoke_Improved', 'Smoke_NoBones', 'Starvation', 'Stinkbug_Talking', 'Stoat_Talking', 'Trap', 'TrapFrog', 'Wolf_Talking']
for (const card of cards) {

  if (!act1Cards.includes(card.gameId ?? '')) {
    continue
  }

  if (existsSync('out/cards/' + card.gameId + '.png')) {
    console.log('skipping', card.gameId)

    continue
  }

  const translationId = getGameTranslationId(card.gameId)
  if (translationId) {
    const name = translations['en'][translationId]
    if (name === undefined) {
      console.log('found no translation for', card.gameId)
    }

    card.name = name ?? '!ERROR'
  }
  const buffer = generateAct1Card(card, res, 'en')
  writeFileSync('out/cards/' + card.gameId + '.png', buffer)
  console.log('generated', card.gameId)
}
