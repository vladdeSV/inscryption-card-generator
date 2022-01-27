import { readFileSync } from 'fs'
import { Card } from './act1/types'
import { validateIds, generateAct1Cards, generatePdf, bundle } from './exporters'
import { LeshyCardGenerator } from './generators/leshyCardGenerator'

export const presets: { [s: string]: Card } = {

  'blank': { type: 'common' },

  'stoat_talking': { type: 'common', name: 'stoat', portrait: 'stoat_talking', health: 3, power: 1, cost: { type: 'blood', amount: 1 } },
  'wolf_talking': { type: 'common', name: 'wolf_talking', portrait: 'wolf_talking', health: 2, power: 2, cost: { type: 'blood', amount: 1 }, tribes: ['canine'] },
  'stinkbug_talking': { type: 'common', name: 'stinkbug_talking', portrait: 'stinkbug_talking', health: 2, power: 1, cost: { type: 'bone', amount: 2 }, tribes: ['insect'], sigils: ['debuffenemy'] },

  'hungry_child': { name: 'hungrychild', type: 'common', decals: ['child'] },
  'leshy': { name: 'leshy', type: 'rare', decals: ['leshy'] },
  'gold_nugget': { name: 'goldnugget', type: 'terrain', portrait: 'goldnugget', health: 2, options: { isTerrain: true, isGolden: true } },
  'golden_pelt': { name: 'peltgolden', type: 'terrain', health: 3, portrait: 'pelt_golden', options: { isTerrain: true, isGolden: true } },
  // "mini_moon": { type: "common", name: "mini moon", power: 1, health: 9,  sigils: ["allstrike", "squirrelorbit", "reach"], portrait: "moon",  },
  'adder': { name: 'adder', type: 'common', power: 1, health: 1, tribes: ['reptile'], sigils: ['deathtouch'], cost: { amount: 2, type: 'blood' }, portrait: 'adder' },
  'alpha': { name: 'alpha', type: 'common', power: 1, health: 2, tribes: ['canine'], sigils: ['buffneighbours'], cost: { amount: 5, type: 'bone' }, portrait: 'alpha' },
  'amalgam': { name: 'amalgam', type: 'rare', power: 3, health: 3, tribes: ['bird', 'canine', 'hooved', 'reptile', 'insect'], cost: { amount: 2, type: 'blood' }, portrait: 'amalgam' },
  'ant_queen': { name: 'antqueen', type: 'common', power: 'ants', health: 3, cost: { amount: 2, type: 'blood' }, portrait: 'antqueen', tribes: ['insect'], sigils: ['drawant'] },
  'amoeba': { name: 'amoeba', type: 'rare', power: 1, health: 2, sigils: ['randomability'], cost: { amount: 2, type: 'bone' }, portrait: 'amoeba' },
  'bait_bucket': { name: 'baitbucket', type: 'terrain', portrait: 'baitbucket', health: 1, decals: ['blood'], options: { isTerrain: true } },
  'bat': { name: 'bat', type: 'common', power: 2, health: 1, sigils: ['flying'], cost: { amount: 4, type: 'bone' }, portrait: 'bat' },
  'beaver': { name: 'beaver', type: 'common', power: 1, health: 3, sigils: ['createdams'], cost: { amount: 2, type: 'blood' }, portrait: 'beaver' },
  'bee': { name: 'bee', type: 'common', power: 1, health: 1, tribes: ['insect'], sigils: ['flying'], portrait: 'bee' },
  'beehive': { name: 'beehive', type: 'common', power: 0, health: 2, tribes: ['insect'], sigils: ['beesonhit'], cost: { amount: 1, type: 'blood' }, portrait: 'beehive' },
  'black_goat': { name: 'goat', type: 'common', power: 0, health: 1, tribes: ['hooved'], sigils: ['tripleblood'], cost: { amount: 1, type: 'blood' }, portrait: 'goat' },
  'black_goat_sexy': { name: 'goat', type: 'common', power: 0, health: 1, tribes: ['hooved'], sigils: ['tripleblood'], cost: { amount: 1, type: 'blood' }, portrait: 'goat_sexy' },
  'bloodhound': { name: 'bloodhound', type: 'common', power: 2, health: 3, tribes: ['canine'], sigils: ['guarddog'], cost: { amount: 2, type: 'blood' }, portrait: 'bloodhound' },
  'boulder': { name: 'boulder', type: 'terrain', portrait: 'boulder', health: 5, options: { isTerrain: true } },
  'bullfrog': { name: 'bullfrog', type: 'common', power: 1, health: 2, tribes: ['reptile'], sigils: ['reach'], cost: { amount: 1, type: 'blood' }, portrait: 'bullfrog' },
  'caged_wolf': { name: 'cagedwolf', type: 'terrain', portrait: 'cagedwolf', cost: { type: 'blood', amount: 2 }, health: 6, tribes: ['canine'], options: { isTerrain: true } },
  'cat': { name: 'cat', type: 'common', power: 0, health: 1, sigils: ['sacrificial'], cost: { amount: 1, type: 'blood' }, portrait: 'cat' },
  'child_13': { name: 'jerseydevil', type: 'rare', power: 0, health: 1, tribes: ['hooved'], sigils: ['sacrificial'], cost: { amount: 1, type: 'blood' }, portrait: 'jerseydevil_sleeping' },
  'child_13_awake': { name: 'jerseydevil', type: 'rare', power: 2, health: 1, tribes: ['hooved'], sigils: ['flying', 'sacrificial'], cost: { amount: 1, type: 'blood' }, portrait: 'jerseydevil' },
  'chime': { name: 'dausbell', type: 'terrain', portrait: 'dausbell', health: 1, options: { isTerrain: true } },
  'cockroach': { name: 'cockroach', type: 'common', power: 1, health: 1, tribes: ['insect'], sigils: ['drawcopyondeath'], cost: { amount: 4, type: 'bone' }, portrait: 'cockroach' },
  'corpse_maggots': { name: 'maggots', type: 'common', power: 1, health: 2, tribes: ['insect'], sigils: ['corpseeater'], cost: { amount: 5, type: 'bone' }, portrait: 'maggots' },
  'coyote': { name: 'coyote', type: 'common', power: 2, health: 1, tribes: ['canine'], cost: { amount: 4, type: 'bone' }, portrait: 'coyote' },
  'dam': { name: 'dam', type: 'terrain', portrait: 'dam', health: 2, options: { isTerrain: true } },
  'elk_fawn': { name: 'elkcub', type: 'common', power: 1, health: 1, tribes: ['hooved'], sigils: ['evolve_1', 'strafe'], cost: { amount: 1, type: 'blood' }, portrait: 'deercub' },
  'elk': { name: 'elk', type: 'common', power: 2, health: 4, tribes: ['hooved'], sigils: ['strafe'], cost: { amount: 2, type: 'blood' }, portrait: 'deer' },
  'field_mice': { name: 'fieldmouse', type: 'common', power: 2, health: 2, sigils: ['drawcopy'], cost: { amount: 2, type: 'blood' }, portrait: 'fieldmice' },
  'frozen_opossum': { name: 'frozenopossum', type: 'terrain', portrait: 'frozen_opossum', power: 0, health: 5, sigils: ['icecube'] },
  'geck': { name: 'geck', type: 'rare', power: 1, health: 1, tribes: ['reptile'], portrait: 'geck' },
  'grand_fir': { name: 'tree', type: 'terrain', portrait: 'tree', health: 3, sigils: ['reach'], options: { isTerrain: true } },
  'great_white': { name: 'shark', type: 'common', power: 4, health: 2, sigils: ['submerge'], cost: { amount: 3, type: 'blood' }, portrait: 'shark', decals: ['blood'] },
  'grizzly': { name: 'grizzly', type: 'common', power: 4, health: 6, cost: { amount: 3, type: 'blood' }, portrait: 'grizzly' },
  'kingfisher': { name: 'kingfisher', type: 'common', power: 1, health: 1, tribes: ['bird'], sigils: ['submerge', 'flying'], cost: { amount: 1, type: 'blood' }, portrait: 'kingfisher' },
  'leaping_trap': { name: 'trap', type: 'terrain', portrait: 'trap', health: 1, sigils: ['steeltrap', 'reach'], options: { isTerrain: true } },
  'long_elk': { name: 'snelk', type: 'rare', power: 1, health: 2, tribes: ['hooved'], sigils: ['deathtouch', 'strafe'], cost: { amount: 4, type: 'bone' }, decals: ['snelk'] },
  'magpie': { name: 'magpie', type: 'common', power: 1, health: 1, tribes: ['bird'], sigils: ['tutor', 'flying'], cost: { amount: 2, type: 'blood' }, portrait: 'magpie' },
  'mantis_god': { name: 'mantisgod', type: 'rare', power: 1, health: 1, tribes: ['insect'], sigils: ['tristrike'], cost: { amount: 1, type: 'blood' }, portrait: 'mantisgod' },
  'mantis': { name: 'mantis', type: 'common', power: 1, health: 1, tribes: ['insect'], sigils: ['splitstrike'], cost: { amount: 1, type: 'blood' }, portrait: 'mantis' },
  'mole_man': { name: 'moleman', type: 'rare', power: 0, health: 6, sigils: ['reach', 'whackamole'], cost: { amount: 1, type: 'blood' }, portrait: 'moleman' },
  'mole': { name: 'mole', type: 'common', power: 0, health: 4, sigils: ['whackamole'], cost: { amount: 1, type: 'blood' }, portrait: 'mole' },
  'moose_buck': { name: 'moose', type: 'common', power: 3, health: 7, tribes: ['hooved'], sigils: ['strafepush'], cost: { amount: 3, type: 'blood' }, portrait: 'moose' },
  'mothman': { name: 'mothman_stage3', type: 'rare', power: 7, health: 3, tribes: ['insect'], sigils: ['flying'], cost: { amount: 1, type: 'blood' }, portrait: 'mothman_3' },
  'opossum': { name: 'opossum', type: 'common', power: 1, health: 1, cost: { amount: 2, type: 'bone' }, portrait: 'opossum' },
  'ouroboros': { name: 'ouroboros', type: 'rare', tribes: ['reptile'], sigils: ['drawcopyondeath'], cost: { amount: 2, type: 'blood' }, portrait: 'ouroboros' },
  'pack_mule': { name: 'mule', type: 'common', power: 0, health: 5, sigils: ['strafe'], tribes: ['hooved'], portrait: 'mule' },
  'pack_rat': { name: 'packrat', type: 'rare', power: 2, health: 2, sigils: ['randomconsumable'], cost: { amount: 2, type: 'blood' }, portrait: 'packrat' },
  'porcupine': { name: 'porcupine', type: 'common', power: 1, health: 2, sigils: ['sharp'], cost: { amount: 1, type: 'blood' }, portrait: 'porcupine' },
  'pronghorn': { name: 'pronghorn', type: 'common', power: 1, health: 3, tribes: ['hooved'], sigils: ['splitstrike', 'strafe'], cost: { amount: 2, type: 'blood' }, portrait: 'pronghorn' },
  'rabbit_pelt': { name: 'pelthare', type: 'terrain', health: 1, portrait: 'pelt_hare', options: { isTerrain: true } },
  'rabbit': { name: 'rabbit', type: 'common', power: 0, health: 1, portrait: 'rabbit' },
  'rat_king': { name: 'ratking', type: 'common', power: 2, health: 1, sigils: ['quadruplebones'], cost: { amount: 2, type: 'blood' }, portrait: 'ratking' },
  'rattler': { name: 'rattler', type: 'common', power: 3, health: 1, tribes: ['reptile'], cost: { amount: 6, type: 'bone' }, portrait: 'rattler' },
  'raven_egg': { name: 'ravenegg', type: 'common', power: 0, health: 2, tribes: ['bird'], sigils: ['evolve_1'], cost: { amount: 1, type: 'blood' }, portrait: 'ravenegg' },
  'raven': { name: 'raven', type: 'common', power: 2, health: 3, tribes: ['bird'], sigils: ['flying'], cost: { amount: 2, type: 'blood' }, portrait: 'raven' },
  'ring_worm': { name: 'ringworm', type: 'common', power: 0, health: 1, tribes: ['insect'], cost: { amount: 1, type: 'blood' }, portrait: 'ringworm' },
  'river_otter': { name: 'otter', type: 'common', power: 1, health: 1, sigils: ['submerge'], cost: { amount: 1, type: 'blood' }, portrait: 'otter' },
  'river_snapper': { name: 'snapper', type: 'common', power: 1, health: 6, tribes: ['reptile'], cost: { amount: 2, type: 'blood' }, portrait: 'turtle' },
  'skink': { name: 'skink', type: 'common', power: 1, health: 2, tribes: ['reptile'], sigils: ['tailonhit'], cost: { amount: 1, type: 'blood' }, portrait: 'skink' },
  'skunk': { name: 'skunk', type: 'common', power: 0, health: 3, sigils: ['debuffenemy'], cost: { amount: 1, type: 'blood' }, portrait: 'skunk' },
  'snowy_fir': { name: 'tree_hologram_snowcovered', type: 'terrain', portrait: 'tree_snowcovered', health: 4, sigils: ['reach'], options: { isTerrain: true } },
  'sparrow': { name: 'sparrow', type: 'common', power: 1, health: 2, tribes: ['bird'], sigils: ['flying'], cost: { amount: 1, type: 'blood' }, portrait: 'sparrow' },
  'squid_bell': { name: 'squidbell', type: 'common', power: 'bell', health: 3, cost: { amount: 2, type: 'blood' }, portrait: 'squidbell', options: { isSquid: true } },
  'squid_cards': { name: 'squidcards', type: 'common', power: 'cardsinhand', health: 1, cost: { amount: 1, type: 'blood' }, portrait: 'squidcards', options: { isSquid: true } },
  'squid_mirror': { name: 'squidmirror', type: 'common', power: 'mirror', health: 3, cost: { amount: 1, type: 'blood' }, portrait: 'squidmirror', options: { isSquid: true } },
  'squirrel': { name: 'squirrel', type: 'common', power: 0, health: 1, portrait: 'squirrel' },
  'strange_frog': { name: 'trapfrog', type: 'terrain', portrait: 'trapfrog', power: 1, health: 2, cost: { type: 'blood', amount: 1 }, sigils: ['reach'] },
  'strange_larva': { name: 'mothman_stage1', type: 'rare', power: 0, health: 3, tribes: ['insect'], sigils: ['evolve_1'], cost: { amount: 1, type: 'blood' }, portrait: 'mothman_1' },
  'strange_pupa': { name: 'mothman_stage2', type: 'rare', power: 0, health: 3, tribes: ['insect'], sigils: ['evolve_1'], cost: { amount: 1, type: 'blood' }, portrait: 'mothman_2' },
  'stump': { name: 'stump', type: 'terrain', portrait: 'stump', health: 3, options: { isTerrain: true } },
  'the_daus': { name: 'daus', type: 'rare', power: 2, health: 2, sigils: ['createbells'], cost: { amount: 2, type: 'blood' }, portrait: 'daus' },
  'the_smoke': { name: 'smoke', type: 'common', power: 0, health: 1, sigils: ['quadruplebones'], portrait: 'smoke', decals: ['smoke'] },
  'undead_cat': { name: 'catundead', type: 'common', power: 3, health: 6, cost: { amount: 1, type: 'blood' }, portrait: 'cat_undead' },
  'urayuli': { name: 'urayuli', type: 'rare', power: 7, health: 7, cost: { amount: 4, type: 'blood' }, portrait: 'urayuli' },
  'turkey_vulture': { name: 'vulture', type: 'common', power: 3, health: 3, cost: { amount: 8, type: 'bone' }, tribes: ['bird'], sigils: ['flying'], portrait: 'vulture' },
  'warren': { name: 'warren', type: 'terrain', power: 0, health: 2, sigils: ['drawrabbits'], cost: { amount: 1, type: 'blood' }, portrait: 'warren' },
  'wolf_cub': { name: 'wolfcub', type: 'common', power: 1, health: 1, tribes: ['canine'], sigils: ['evolve_1'], cost: { amount: 1, type: 'blood' }, portrait: 'wolfcub' },
  'wolf_pelt': { name: 'peltwolf', type: 'terrain', health: 2, portrait: 'pelt_wolf', options: { isTerrain: true } },
  'wolf': { name: 'wolf', type: 'common', power: 3, health: 2, tribes: ['canine'], cost: { amount: 2, type: 'blood' }, portrait: 'wolf' },
  'worker_ant': { name: 'ant', type: 'common', power: 'ants', health: 2, cost: { amount: 1, type: 'blood' }, portrait: 'ant', tribes: ['insect'] },

  'tail_feathers': { name: 'tail_bird', type: 'common', power: 0, health: 2, portrait: 'bird_tail' },
  'furry_tail': { name: 'tail_furry', type: 'common', power: 0, health: 2, portrait: 'canine_tail' },
  'wriggling_leg': { name: 'tail_insect', type: 'common', power: 0, health: 2, portrait: 'insect_tail' },
  'wriggling_tail': { name: 'skinktail', type: 'common', power: 0, health: 2, portrait: 'skink_tail' },

  'starvation': { name: 'starvation', type: 'common', sigils: ['preventattack'], portrait: 'starvingman' },
  'starvation_flying': { name: 'starvation', type: 'common', sigils: ['flying', 'preventattack'], portrait: 'starvingman' },

  'greater_smoke': { name: 'smoke_improved', type: 'common', power: 1, health: 3, sigils: ['quadruplebones'], portrait: 'smoke_improved', decals: ['smoke'], options: { isEnhanced: true } },

}

export const translations = JSON.parse(readFileSync('./translations.json', 'utf-8'))

function generateAllPdfs() {
  const locales = Object.keys(translations)
  const cardIds: [string, string, string, string][] = [
    ['stoat_talking', 'stinkbug_talking', 'wolf_talking', 'blank'],
    ['wolf_cub', 'wolf', 'elk_fawn', 'elk'],
    ['raven_egg', 'raven', 'field_mice', 'beehive'],
    ['adder', 'bullfrog', 'cat', 'river_snapper'],
    ['mantis', 'beaver', 'mole', 'porcupine'],
    ['pronghorn', 'river_otter', 'rat_king', 'ring_worm'],
    ['ant_queen', 'worker_ant', 'skunk', 'skink'],
    ['kingfisher', 'sparrow', 'magpie', 'bloodhound'],
    ['squid_bell', 'squid_cards', 'squid_mirror', 'black_goat'],
    ['alpha', 'coyote', 'opossum', 'rattler'],
    ['corpse_maggots', 'cockroach', 'bat', 'turkey_vulture'],
    ['warren', 'rabbit', 'rabbit', 'rabbit'],
    ['tail_feathers', 'furry_tail', 'wriggling_leg', 'wriggling_tail'],
    ['grizzly', 'great_white', 'moose_buck', 'urayuli'],

    // rare
    ['geck', 'mole_man', 'pack_rat', 'mantis_god'],
    ['amalgam', 'amoeba', 'ouroboros', 'the_daus'],
    ['strange_larva', 'strange_pupa', 'mothman', 'long_elk'],
    ['child_13', 'child_13_awake', 'black_goat_sexy', 'pack_mule'],

    // terrain
    ['boulder', 'stump', 'grand_fir', 'snowy_fir'],
    ['chime', 'chime', 'dam', 'dam'],
    ['rabbit_pelt', 'wolf_pelt', 'golden_pelt', 'gold_nugget'],
    ['frozen_opossum', 'leaping_trap', 'bait_bucket', 'strange_frog'],

    // once only
    ['hungry_child', 'leshy', 'caged_wolf', 'undead_cat'],
    ['greater_smoke', 'the_smoke', 'starvation', 'starvation_flying'],

    ['squirrel', 'squirrel', 'squirrel', 'squirrel'],
    ['bee', 'bee', 'bee', 'bee'],
    ['blank', 'blank', 'blank', 'blank'],
  ]

  validateIds(Object.keys(presets), cardIds.flat(2))

  console.log('generating for locales', locales.join(','))
  console.time('everything')
  for (const locale of locales) {
    const leshy = new LeshyCardGenerator()

    console.time('generate cards ' + locale)
    generateAct1Cards(presets, leshy, locale, translations[locale])
    console.timeEnd('generate cards ' + locale)

    generatePdf(cardIds, locale)

    console.time('bundle ' + locale)
    bundle(locale)
    console.timeEnd('bundle ' + locale)
  }
  console.timeEnd('everything')
}

// (() => {
//   const g = new LeshyCardGenerator()
//   const cards: { [s: string]: Card } = {
//     'alpha': presets['alpha'],
//     'gold_nugget': presets['gold_nugget'],
//     'amalgam': presets['amalgam'],
//   }

//   generateAct1Cards(cards, g, 'en', translations['en'])

//   generatePdf([['alpha', 'gold_nugget', 'amalgam', 'alpha']], 'en')
// })()

// generateAllPdfs()

// function generateSelctedAct1Card(ids: string[]) {
//   const g = new LeshyCardGenerator()
//   const cards: { [s: string]: Card } = {}
//   for (const id of ids) {
//     cards[id] = presets[id]
//   }

//   generateAct1Cards(cards, g, 'en', translations['en'])
// }

// const locales = Object.keys(translations)
// for (const locale of locales) {
//   bundle(locale)
// }

// for (const id in presets) {
//   if (!Object.prototype.hasOwnProperty.call(presets, id)) {
//     continue
//   }

//   if(!existsSync(`./cards/en/border/${id}.png`)){
//     console.log('missing', id);
//     continue;
//   }
  
//   const card = presets[id];
//   const leshy = new LeshyCardGenerator();
//   const buffer = leshy.generatePrintCard(id, card, 'en')

//   mkdirSync('./cards/en/print', { recursive: true })
//   writeFileSync(`./cards/en/print/${id}.png`, buffer)
// }
