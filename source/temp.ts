import { Resource } from './resource'
import { Card } from './card'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { convertJsonCard } from './jsoncard'
import { CreatureId, foo } from './parsecard'
import { generateAct2Card, Npc } from './fns/generateAct2Card'
import { generateAct1BackCard, generateAct1BoonCard, generateAct1Card, generateAct1RewardCard, generateAct1TarotCard, generateAct1TrialCard } from './fns/generateAct1Card'

type Act1Resource = {
  card: Record<Card['type'], string>,
  cardback: Record<'bee' | 'common' | 'deathcard' | 'squirrel' | 'submerge', string>,
  cardbackground: Record<'common' | 'rare' | 'special' | 'terrain', string>,
  cardboon: Record<'doubledraw' | 'singlestartingbone' | 'startingbones' | 'startinggoat' | 'startingtrees' | 'tutordraw', string>,
  cardreward: Record<'1blood' | '2blood' | '3blood' | 'bones' | 'bird' | 'canine' | 'hooved' | 'insect' | 'reptile', string>,
  cardtrial: Record<'abilities' | 'blood' | 'bones' | 'flying' | 'pelts' | 'power' | 'rare' | 'ring' | 'strafe' | 'submerge' | 'toughness' | 'tribes', string>,
  cardtarot: Record<'death' | 'devil' | 'empress' | 'fool' | 'tower', string>,
  cost: Record<string, string>,
  boon: Record<'doubledraw' | 'singlestartingbone' | 'startingbones' | 'startinggoat' | 'startingtrees' | 'tutordraw', string>,
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
    'submerge': 'cardbacks/submerge.png',
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

const act2ResourceMap = {
  'card': {
    'common': 'cards/common.png',
    'rare': 'cards/rare.png',
    'terrain': 'cards/terrain.png',
    'terrain_rare': 'cards/terrain_rare.png',
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
    'conduitspawner': 'sigils/conduitspawner.png',
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

const res = new Resource('resource', act1ResourceMap)
const res2 = new Resource('resource-gbc', act2ResourceMap)

const textChunks = readFileSync('./creatures.txt', 'utf-8').trim().split('---').map(x => x.trim())
const jsonCards = textChunks.map(foo)
const cards: Card[] = jsonCards.map(convertJsonCard)

const translations = JSON.parse(readFileSync('translations.json', 'utf-8'))
const act1CreatureIds: CreatureId[] = ['Adder', 'Alpha', 'Amalgam', 'Amoeba', 'Ant', 'AntQueen', 'Bat', 'Beaver', 'Bee', 'Beehive', 'Bloodhound', 'Bullfrog', 'CagedWolf', 'Cat', 'CatUndead', 'Cockroach', 'Coyote', 'Daus', 'Elk', 'ElkCub', 'FieldMouse', 'Geck', 'Goat', 'Grizzly', 'JerseyDevil', 'Kingfisher', 'Maggots', 'Magpie', 'Mantis', 'MantisGod', 'Mole', 'MoleMan', 'Moose', 'Mothman_Stage1', 'Mothman_Stage2', 'Mothman_Stage3', 'Mule', 'Opossum', 'Otter', 'Ouroboros', 'PackRat', 'Porcupine', 'Pronghorn', 'Rabbit', 'RatKing', 'Rattler', 'Raven', 'RavenEgg', 'Shark', 'Skink', 'SkinkTail', 'Skunk', 'Snapper', 'Snelk', 'Sparrow', 'SquidBell', 'SquidCards', 'SquidMirror', 'Squirrel', 'Tail_Bird', 'Tail_Furry', 'Tail_Insect', 'Urayuli', 'Vulture', 'Warren', 'Wolf', 'WolfCub', '!DEATHCARD_LESHY', 'BaitBucket', 'Dam', 'DausBell', 'GoldNugget', 'PeltGolden', 'PeltHare', 'PeltWolf', 'RingWorm', 'Smoke', 'Smoke_Improved', 'Smoke_NoBones', 'Starvation', 'Stinkbug_Talking', 'Stoat_Talking', 'Trap', 'TrapFrog', 'Wolf_Talking']
const act2CreatureIds: CreatureId[] = [
  'Kraken', 'SquidCards', 'SquidMirror', 'SquidBell', 'Hrokkall', 'MantisGod', 'MoleMan', 'Urayuli', 'Rabbit',
  'Squirrel', 'Bullfrog', 'Cat', 'CatUndead', 'ElkCub', 'Mole', 'SquirrelBall', 'Stoat', 'Warren', 'WolfCub',
  'Wolf', 'Adder', 'Bloodhound', 'Elk', 'FieldMouse', 'Hawk', 'Raven', 'Salmon', 'FieldMouse_Fused', 'Grizzly',
  'Ouroboros',

  'Bonepile', 'TombRobber', 'Necromancer', 'DrownedSoul', 'DeadHand', 'HeadlessHorseman', 'Skeleton', 'Draugr',
  'Gravedigger', 'Gravedigger_Fused', 'Banshee', 'SkeletonMage', 'Zombie', 'BonelordHorn', 'CoinLeft', 'CoinRight',
  'Revenant', 'GhostShip', 'Sarcophagus', 'Family', 'FrankNStein', 'DeadPets', 'Bonehound', 'Mummy',

  'PlasmaGunner', 'AboveCurve', 'EnergyConduit', 'TechMoxTriple', 'BombMaiden', 'Shutterbug', 'LeapBot', 'NullConduit',
  'SentryBot', 'SentryBot_Fused', 'MineCart', 'AttackConduit', 'BatteryBot', 'EnergyRoller', 'Insectodrone', 'RoboMice',
  'Thickbot', 'BoltHound', 'CloserBot', 'Steambot',

  'MasterGoranj', 'MoxDualBG', 'MoxDualGO', 'MoxDualOB', 'MasterBleene', 'MasterGoranj', 'MasterOrlu', 'MoxEmerald',
  'MoxRuby', 'MoxSapphire', 'Pupil', 'MarrowMage', 'GreenMage', 'JuniorSage', 'MuscleMage', 'StimMage', 'MageKnight',
  'OrangeMage', 'PracticeMage', 'RubyGolem', 'BlueMage', 'BlueMage_Fused', 'ForceMage', 'GemFiend', 'FlyingMage',

  'Starvation', 'BurrowingTrap', 'Kingfisher', 'Opossum', 'Coyote', 'MoxTriple',
]

const act1Cards = cards.filter(card => act1CreatureIds.includes(card.gameId as CreatureId ?? ''))
const act2Cards = cards.filter(card => act2CreatureIds.includes(card.gameId as CreatureId ?? ''))

function generateAct1Cards() {
  for (const card of act1Cards) {
    const filepath = 'out/cards/' + ((card.portrait?.type === 'creature') ? card.portrait.id : card.gameId) + '.png'
    if (existsSync(filepath)) {
      console.log('skipping', card.gameId)

      continue
    }

    const translationId = getGameTranslationId(card.gameId)
    if (translationId) {
      const name = translations['en'][translationId]
      if (name === undefined) {
        console.log('found no translation for', card.gameId)
      }

      card.name = name ?? '!MISSING_TRANSLATION'
    }

    const buffer = generateAct1Card(card, res, 'en')
    // const buffer = generateAct2Card(card, res)
    writeFileSync(filepath, buffer)
    console.log('generated', card.gameId)
  }
}

function generateAct1BackCards() {
  for (const backCardId of ['bee', 'common', 'deathcard', 'squirrel', 'submerge'] as const) {
    const filepath = 'out/cards1back/' + backCardId + '.png'
    if (existsSync(filepath)) {
      console.log('skipping', backCardId)

      continue
    }

    const buffer = generateAct1BackCard(backCardId, res, { border: true })
    writeFileSync(filepath, buffer)
    console.log('generated', backCardId)
  }
}

function generateAct1BoonCards() {
  for (const boonId of ['doubledraw', 'singlestartingbone', 'startingbones', 'startinggoat', 'startingtrees', 'tutordraw'] as const) {
    const filepath = 'out/cards1boon/' + boonId + '.png'
    if (existsSync(filepath)) {
      console.log('skipping', boonId)

      continue
    }

    const buffer = generateAct1BoonCard(boonId, res, { border: true })
    writeFileSync(filepath, buffer)
    console.log('generated', boonId)
  }
}

function generateAct1RewardCards() {
  for (const rewardCardId of ['1blood', '2blood', '3blood', 'bones', 'bird', 'canine', 'hooved', 'insect', 'reptile'] as const) {
    const filepath = 'out/cards1reward/' + rewardCardId + '.png'
    if (existsSync(filepath)) {
      console.log('skipping', rewardCardId)

      continue
    }

    const buffer = generateAct1RewardCard(rewardCardId, res, { border: true })
    writeFileSync(filepath, buffer)
    console.log('generated', rewardCardId)
  }
}

function generateAct1TrialCards() {
  for (const trialCardId of ['abilities', 'blood', 'bones', 'flying', 'pelts', 'power', 'rare', 'ring', 'strafe', 'submerge', 'toughness', 'tribes'] as const) {
    const filepath = 'out/cards1trial/' + trialCardId + '.png'
    if (existsSync(filepath)) {
      console.log('skipping', trialCardId)

      continue
    }

    const buffer = generateAct1TrialCard(trialCardId, res, { border: true })
    writeFileSync(filepath, buffer)
    console.log('generated', trialCardId)
  }
}

function generateAct1TarotCards() {
  for (const tarotCardId of ['death', 'devil', 'empress', 'fool', 'tower'] as const) {
    const filepath = 'out/cards1tarot/' + tarotCardId + '.png'
    if (existsSync(filepath)) {
      console.log('skipping', tarotCardId)

      continue
    }

    const buffer = generateAct1TarotCard(tarotCardId, res, { border: true })
    writeFileSync(filepath, buffer)
    console.log('generated', tarotCardId)
  }
}
