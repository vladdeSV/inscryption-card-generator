import { execSync } from 'child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'

import { presets } from './index'
import { Card } from './act1/types'
import { LeshyCardGenerator } from './generators/leshyCardGenerator'

function validateIds(existingIds: string[], cardIds: string[]): void {
  const missingIds: string[] = []
  const cardIdsArray = cardIds
  for (const a of existingIds) {
    if (!cardIdsArray.includes(a)) {
      missingIds.push(a)
    }
  }

  if (missingIds.length) {
    for (const m of missingIds) {
      console.error('ERROR: Missing card', m)
    }

    process.exit(1)
  }
}

function generateAct1Cards(input: { [s: string]: Card }, cardGenerator: LeshyCardGenerator, locale: string, nameMapping: { [s: string]: string }) {

  for (const bordered of [true, false]) {

    cardGenerator.setBorderedCards(bordered)

    const cardsPath = path.join('cards', locale, bordered ? 'border' : 'regular')
    if (!existsSync(cardsPath)) {
      mkdirSync(cardsPath, { recursive: true })
    }

    const cardBacksPath = path.join(cardsPath, 'backs')
    if (!existsSync(cardBacksPath)) {
      mkdirSync(cardBacksPath, { recursive: true })
    }

    const backs: ('common' | 'squirrel' | 'bee' | 'deathcard')[] = ['common', 'squirrel', 'bee', 'deathcard']
    for (const back of backs) {
      const buffer = cardGenerator.generateBack(back)
      writeFileSync(path.join(cardsPath, 'backs', back + '.png'), buffer)
    }

    for (const id in input) {

      if (!Object.prototype.hasOwnProperty.call(input, id)) {
        continue
      }

      const card = input[id]
      const name = card.name!

      const translatedName = nameMapping[name] as string ?? name

      if (name && !translatedName) {
        console.warn(`WARNING: Missing translation for '${id}'`)
      }

      const buffer = cardGenerator.generate({ ...card, name: translatedName }, locale)

      const filename = id

      writeFileSync(path.join(cardsPath, filename + '.png'), buffer)
    }
  }
}

function generatePdf(ids: [string, string, string, string][], locale: string) {

  const pathForId = (id: string, locale: string): string => {
    return `./cards/${locale}/border/${id}.png`
  }

  const backPathForId = (id: string, locale: string): string => {
    switch (id) {
      case 'squirrel':
      case 'bee':
        return `./cards/${locale}/border/backs/${id}.png`
      case 'blank':
        return `./cards/${locale}/border/backs/deathcard.png`
      default: {
        return `./cards/${locale}/border/backs/common.png`
      }
    }
  }

  if (!existsSync('./pdf/')) {
    mkdirSync('./pdf/')
  }

  // console.log('Creating unoptimized PDF');

  const command = 'convert -density 300 ' + ids.map(ids => `
    \\(
    -size 3507.9x2480.3 xc:white -fill rgb\\(33,28,32\\)
    -draw "rectangle 118.1,118.1 1594.5,1215.3"
    -draw "rectangle 118.1,1265 1594.5,2362.2"
    -draw "rectangle 1913.4,118.1 3389.8,1215.3"
    -draw "rectangle 1913.4,1265 3389.8,2362.2"
    
    -stroke rgb\\(128,128,128\\)
    -strokewidth 1
    
    -draw "line 856.3,0 856.3,2480.3"
    -draw "line 2651.6,0 2651.6,2480.3"
    
    \\( ${backPathForId(ids[0], locale)} -gravity center -crop 691x1050+0+0 +repage \\) +gravity -geometry +142.1+141.7 -composite
    \\( ${backPathForId(ids[1], locale)} -gravity center -crop 691x1050+0+0 +repage \\) +gravity -geometry +142.1+1288.6 -composite
    \\( ${backPathForId(ids[2], locale)} -gravity center -crop 691x1050+0+0 +repage \\) +gravity -geometry +1937+141.7 -composite
    \\( ${backPathForId(ids[3], locale)} -gravity center -crop 691x1050+0+0 +repage \\) +gravity -geometry +1937+1288.6 -composite
    
    \\( ${pathForId(ids[0], locale)} -gravity center -crop 691x1050+0+0 +repage \\) +gravity -geometry +879.9+141.7 -composite
    \\( ${pathForId(ids[1], locale)} -gravity center -crop 691x1050+0+0 +repage \\) +gravity -geometry +879.9+1288.6 -composite
    \\( ${pathForId(ids[2], locale)} -gravity center -crop 691x1050+0+0 +repage \\) +gravity -geometry +2675.2+141.7 -composite
    \\( ${pathForId(ids[3], locale)} -gravity center -crop 691x1050+0+0 +repage \\) +gravity -geometry +2675.2+1288.6 -composite
    
    \\)`.replace(/\n+/g, ' ')).join(' ') + ` pdf/${locale}.pdf`

  console.time('pdf ' + locale)
  execSync(command)
  console.timeEnd('pdf ' + locale)

  // optimiz the pdf. output is humungous!
  // console.log('Optimizing PDF');

  console.time('optimize ' + locale)
  execSync(`ps2pdf -dPDFSETTINGS=/printer pdf/${locale}.pdf pdf/${locale}.optimized.pdf`)
  execSync(`rm pdf/${locale}.pdf`)
  execSync(`mv pdf/${locale}.optimized.pdf pdf/${locale}.pdf`)
  console.timeEnd('optimize ' + locale)
}

const translations = JSON.parse(readFileSync('./translations.json', 'utf-8'))
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
]

function prepareBundle(cards: { [s: string]: Card }) {
  validateIds(Object.keys(cards), cardIds.flat(2))

  console.log('generating for locales', locales.join(','))
  console.time('everything')
  for (const locale of locales) {
    const leshy = new LeshyCardGenerator()

    console.time('generate cards ' + locale)
    generateAct1Cards(cards, leshy, locale, translations[locale])
    console.timeEnd('generate cards ' + locale)

    generatePdf(cardIds, locale)
  }
  console.timeEnd('everything')
}

function bundle(locale: string) {
  mkdirSync('./downloads/', { recursive: true })
  mkdirSync('./temp/', { recursive: true })

  const revision = ((date: Date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  })(new Date())

  writeFileSync(`./cards/${locale}/readme.english.txt`, `inscryption cards for printing
revision ${revision}

original assets (c) Daniel Mullins Games
provided by Vladimirs "vladde" Nordholm

missing cards:
- the smoke without bone sigil
- any cards/sigils from "kaycee's mod"
- some variations of portraits (skink with no tail, scared squirrel, closed leaping trap)

other:
- porcupine has white dot in image, should be black
`)

  execSync(`cd ./cards/${locale}/ && zip -r ../../downloads/${locale}.zip border regular readme.english.txt && rm readme.english.txt && cd ../..`)
  execSync(`cp ./pdf/${locale}.pdf ./downloads/${locale}.pdf`)
}

export { generateAct1Cards, generatePdf, validateIds, bundle }
