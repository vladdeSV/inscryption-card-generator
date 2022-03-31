import { Resource } from './resource'
import { Card, CreatureId, StatIcon } from './card'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import * as path from 'path'
import { generateAct2BackCard, generateAct2Card, generateAct2NpcCard, Npc } from './fns/generateAct2Card'
import { generateAct1BackCard, generateAct1BoonCard, generateAct1Card, generateAct1RewardCard, generateAct1TarotCard, generateAct1TrialCard } from './fns/generateAct1Card'
import { convertJldrCard, JldrCreature, CreatureId as JldrCreatureId } from './jldrcard'

export type Act1Resource = {
  card: Record<'common' | 'rare' | 'terrain', string>,
  cardback: Record<'bee' | 'common' | 'deathcard' | 'squirrel' | 'submerge', string>,
  cardbackground: Record<'common' | 'rare' | 'special' | 'terrain', string>,
  cardboon: Record<'doubledraw' | 'singlestartingbone' | 'startingbones' | 'startinggoat' | 'startingtrees' | 'tutordraw', string>,
  cardreward: Record<'1blood' | '2blood' | '3blood' | 'bones' | 'bird' | 'canine' | 'hooved' | 'insect' | 'reptile', string>,
  cardtrial: Record<'abilities' | 'blood' | 'bones' | 'flying' | 'pelts' | 'power' | 'rare' | 'ring' | 'strafe' | 'submerge' | 'toughness' | 'tribes', string>,
  cardtarot: Record<'death' | 'devil' | 'empress' | 'fool' | 'tower', string>,
  cost: Record<string, string>,
  boon: Record<'doubledraw' | 'singlestartingbone' | 'startingbones' | 'startinggoat' | 'startingtrees' | 'tutordraw', string>,
  deathcard: Record<string, string>,
  tribe: Record<Exclude<Card['tribes'][number], 'squirrel'>, string>,
  misc: Record<string, string>,
  staticon: Record<Exclude<StatIcon, 'greengems'>, string>,
  font: Record<string, string>,
  sigil: Record<string /* Card['sigils'][number] */, string>,
  portrait: Record<string, string>
  emission: Record<string, string>
  decal: Record<string, string>
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

  if (id === '') {
    return undefined
  }

  return id?.toLowerCase()

}

export const res = new Resource('resource', act1ResourceMap)
export const res2 = new Resource('resource-gbc', act2ResourceMap)

// const creatures = JSON.parse(readFileSync('creatures.json', 'utf-8'))

// if (!Array.isArray(creatures)) {
//   throw 'creatures not array'
// }

// const jldrCreatures = creatures.map(JldrCreature.check)
// const cards: Card[] = jldrCreatures.map(convertJldrCard)

// const translations = JSON.parse(readFileSync('translations.json', 'utf-8'))
// const act1CreatureIds: JldrCreatureId[] = ['Adder', 'Alpha', 'Amalgam', 'Amoeba', 'Ant', 'AntQueen', 'Bat', 'Beaver', 'Bee', 'Beehive', 'Bloodhound', 'Boulder', 'Bullfrog', 'CagedWolf', 'Cat', 'CatUndead', 'Cockroach', 'Coyote', 'Daus', 'Elk', 'ElkCub', 'FieldMouse', 'Geck', 'Goat', 'Grizzly', 'JerseyDevil', 'Kingfisher', 'Maggots', 'Magpie', 'Mantis', 'MantisGod', 'Mole', 'MoleMan', 'Moose', 'Mothman_Stage1', 'Mothman_Stage2', 'Mothman_Stage3', 'Mule', 'Opossum', 'Otter', 'Ouroboros', 'PackRat', 'Porcupine', 'Pronghorn', 'Rabbit', 'RatKing', 'Rattler', 'Raven', 'RavenEgg', 'Shark', 'Skink', 'SkinkTail', 'Skunk', 'Snapper', 'Snelk', 'Sparrow', 'SquidBell', 'SquidCards', 'SquidMirror', 'Squirrel', 'Tail_Bird', 'Tail_Furry', 'Tail_Insect', 'Urayuli', 'Vulture', 'Warren', 'Wolf', 'WolfCub', '!DEATHCARD_LESHY', 'BaitBucket', 'Dam', 'DausBell', 'GoldNugget', 'PeltGolden', 'PeltHare', 'PeltWolf', 'RingWorm', 'Smoke', 'Smoke_Improved', 'Smoke_NoBones', 'Starvation', 'Stinkbug_Talking', 'Stoat_Talking', 'Trap', 'TrapFrog', 'Wolf_Talking', 'FrozenOpossum', 'Tree_SnowCovered', 'Tree', 'Stump']
// const act2CreatureIds: JldrCreatureId[] = [
//   'Kraken', 'SquidCards', 'SquidMirror', 'SquidBell', 'Hrokkall', 'MantisGod', 'MoleMan', 'Urayuli', 'Rabbit',
//   'Squirrel', 'Bullfrog', 'Cat', 'CatUndead', 'ElkCub', 'Mole', 'SquirrelBall', 'Stoat', 'Warren', 'WolfCub',
//   'Wolf', 'Adder', 'Bloodhound', 'Elk', 'FieldMouse', 'Hawk', 'Raven', 'Salmon', 'FieldMouse_Fused', 'Grizzly',
//   'Ouroboros',

//   'Bonepile', 'TombRobber', 'Necromancer', 'DrownedSoul', 'DeadHand', 'HeadlessHorseman', 'Skeleton', 'Draugr',
//   'Gravedigger', 'Gravedigger_Fused', 'Banshee', 'SkeletonMage', 'Zombie', 'BonelordHorn', 'CoinLeft', 'CoinRight',
//   'Revenant', 'GhostShip', 'Sarcophagus', 'Family', 'FrankNStein', 'DeadPets', 'Bonehound', 'Mummy',

//   'PlasmaGunner', 'AboveCurve', 'EnergyConduit', 'TechMoxTriple', 'BombMaiden', 'Shutterbug', 'LeapBot', 'NullConduit',
//   'SentryBot', 'SentryBot_Fused', 'MineCart', 'AttackConduit', 'BatteryBot', 'EnergyRoller', 'Insectodrone', 'RoboMice',
//   'Thickbot', 'BoltHound', 'CloserBot', 'Steambot', 'MeatBot', 'Automaton', 'FactoryConduit', 'Bombbot',

//   'MoxDualBG', 'MoxDualGO', 'MoxDualOB', 'MasterBleene', 'MasterGoranj', 'MasterOrlu', 'MoxEmerald',
//   'MoxRuby', 'MoxSapphire', 'Pupil', 'MarrowMage', 'GreenMage', 'JuniorSage', 'MuscleMage', 'StimMage', 'MageKnight',
//   'OrangeMage', 'PracticeMage', 'RubyGolem', 'BlueMage', 'BlueMage_Fused', 'ForceMage', 'GemFiend', 'FlyingMage',

//   'Starvation', 'BurrowingTrap', 'Kingfisher', 'Opossum', 'Coyote', 'MoxTriple',
// ]

// const specifiedCreatureIds = [...act1CreatureIds, ...act2CreatureIds]
// console.log('missing creature ids', jldrCreatures.map(x => x.name).filter(id => !specifiedCreatureIds.includes(id)))

// const getCard = (gameId: string) => cards.filter(card => card.gameId === gameId)[0]

// cards.push({
//   ...getCard('Goat'),
//   portrait: {
//     type: 'resource',
//     resourceId: 'goat_sexy'
//   }
// })

// cards.push({
//   ...getCard('JerseyDevil'),
//   portrait: {
//     type: 'resource',
//     resourceId: 'jerseydevil_flying'
//   },
//   power: 2,
//   sigils: [
//     'sacrificial',
//     'flying',
//   ]
// })

// const act1Cards = cards.filter(card => act1CreatureIds.includes(card.gameId as JldrCreatureId ?? ''))
// const act2Cards = cards.filter(card => act2CreatureIds.includes(card.gameId as JldrCreatureId ?? ''))

// const starvation = getCard('Starvation')
// starvation.flags.hidePowerAndHealth = true

// cards.forEach(card => {
//   let gameId = card.gameId

//   if (gameId === 'Tree_SnowCovered') {
//     gameId = 'Tree_Hologram_SnowCovered'
//   }

//   const translationId = getGameTranslationId(gameId)
//   if (translationId) {
//     const name = translations['en'][translationId]
//     if (name === undefined) {
//       console.log('found no translation for', card.gameId)
//     }

//     card.name = name
//   }

//   if (card.gameId === '!DEATHCARD_LESHY') {
//     card.flags.rare = true
//   }
// })

// function slask<T, T2 extends { [s: string]: { [s: string]: string } }>(folderName: string, fn: (t: T, r: Resource<T2>, opts: any) => Buffer, arr: T[], res: Resource<T2>, options: any, filenameGenerator: (t: T) => string | undefined = () => undefined) {
//   const folderpath = path.join('out', folderName)
//   mkdirSync(folderpath, { recursive: true })

//   for (const id of arr) {
//     try {
//       const filename = filenameGenerator(id) ?? id
//       const filepath = path.join(folderpath, filename + '.png')
//       if (existsSync(filepath)) {
//         // console.log('skipping', `${folderName}/${filename}`)

//         continue
//       }

//       const buffer = fn(id, res, options)
//       writeFileSync(filepath, buffer)
//       // console.log('generated', `${folderName}/${filename}`)
//     } catch (e) {
//       // const gameId = (id as any).gameId.toLowerCase()
//       // console.log(gameId, translations['en'][gameId])
//       console.error(filenameGenerator(id), '//', e)
//     }
//   }
// }

// for (const border of [true/* , false */]) {
//   const toplevelName = `act1/${border ? 'border' : 'regular'}`
//   slask(toplevelName + '/backs', generateAct1BackCard, ['bee', 'common', 'deathcard', 'squirrel', 'submerge'], res, { border: border })
//   slask(toplevelName + '/boons', generateAct1BoonCard, ['doubledraw', 'singlestartingbone', 'startingbones', 'startinggoat', 'startingtrees', 'tutordraw'], res, { border: border })
//   slask(toplevelName + '/rewards', generateAct1RewardCard, ['1blood', '2blood', '3blood', 'bones', 'bird', 'canine', 'hooved', 'insect', 'reptile'], res, { border: border })
//   slask(toplevelName + '/trials', generateAct1TrialCard, ['abilities', 'blood', 'bones', 'flying', 'pelts', 'power', 'rare', 'ring', 'strafe', 'submerge', 'toughness', 'tribes'], res, { border: border })
//   slask(toplevelName + '/tarots', generateAct1TarotCard, ['death', 'devil', 'empress', 'fool', 'tower'], res, { border: border })
//   slask(toplevelName, generateAct1Card, cards, res, { border: border }, (card: Card) => {

//     if (card.portrait?.type === 'resource' && card.portrait?.resourceId === 'goat_sexy') {
//       return 'goat_sexy'
//     }

//     if (card.portrait?.type === 'resource' && card.portrait?.resourceId === 'jerseydevil_flying') {
//       return 'jerseydevil_flying'
//     }

//     if (card.portrait?.type === 'creature') {
//       return card.portrait.id
//     }

//     return card.gameId
//   })
// }

// for (const useScanline of [true, false]) {
//   for (const border of [true, false]) {
//     const toplevelName = `act2/${useScanline ? 'scanline' : 'plain'}/${border ? 'border' : 'regular'}`
//     slask(toplevelName, generateAct2Card, act2Cards, res2, { border: border, scanlines: useScanline }, (card: Card) => (card.portrait?.type === 'creature') ? card.portrait.id : card.gameId)
//     slask(toplevelName + '/npc', generateAct2NpcCard, ['angler', 'bluewizard', 'briar', 'dredger', 'dummy', 'greenwizard', 'inspector', 'orangewizard', 'royal', 'sawyer', 'melter', 'trapper', 'prospector'], res2, { border: border, scanlines: useScanline })
//     slask(toplevelName + '/backs', generateAct2BackCard, ['common', 'submerged'], res2, { border: border, scanlines: useScanline })
//   }
// }

// const template: Card = {
//   name: '',
//   cost: undefined,
//   power: 0,
//   health: 0,
//   sigils: [],
//   tribes: [],
//   temple: 'nature',
//   flags: { smoke: false, blood: false, golden: false, rare: false, terrain: false, terrainLayout: false, squid: false, enhanced: false, redEmission: false, fused: false, paint: false, hidePowerAndHealth: false },
// }

// writeFileSync('out/test.png', generateAct1Card({ ...template, name: 'test', cost: { type: 'gem', gems: ['orange'] } }, res, { border: true, locale: 'en' }))
