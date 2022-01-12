import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { presets } from '.'
import * as path from 'path'
import { PixelProfilgateGenerator } from './generators/pixelProfilgateCardGenerator'
import { Card } from './act1/types'

const translations = JSON.parse(readFileSync('./translations.json', 'utf-8'))

function generateCards(input: { [s: string]: PixelProfilgateCard }, cardGenerator: PixelProfilgateGenerator) {
  console.log('Generating Pixel Profilgate cards')

  const cardsPath = path.join('cards-pixelprofilgate')
  if (!existsSync(cardsPath)) {
    mkdirSync(cardsPath, { recursive: true })
  }

  writeFileSync(path.join(cardsPath, 'back.png'), cardGenerator.generateBack())

  for (const id in input) {

    if (!Object.prototype.hasOwnProperty.call(input, id)) {
      continue
    }

    const card = input[id]
    const name = card.name!

    const translatedName = translations['en'][name] as string ?? name

    if (name && !translatedName) {
      console.warn(`WARNING: Missing translation for '${id}'`)
    }

    const buffer = cardGenerator.generate({ ...card, name: translatedName })
    writeFileSync(path.join(cardsPath, id + '.png'), buffer)
  }
}

export type PixelProfilgateCard = Card & {
  extra: {
    talkText: string,
    evolvesInto?: string,
    thawsInto?: string,
  }
}
const pixelProfilgateCards: { [s: string]: PixelProfilgateCard } = {
  'adder': { ...presets['adder'], extra: { talkText: 'Always lethal, the caustic adder.' } },
  'alpha': { ...presets['alpha'], extra: { talkText: 'A venerable leader, emboldening others.' } },
  'amalgam': { ...presets['amalgam'], extra: { talkText: 'Canine, reptile, bird, amalgam is all.' } },
  'ant_queen': { ...presets['ant_queen'], extra: { talkText: 'Regal, royal, and mother of pests.' } },
  'bat': { ...presets['bat'], extra: { talkText: 'A minor, meddlesome terror.' } },
  'bee': { ...presets['bee'], extra: { talkText: 'Unassuming, but determined pests.' } },
  'beehive': { ...presets['beehive'], extra: { talkText: 'Nonthreatening, if you leave it be.' } },
  'black_goat': { ...presets['black_goat'], extra: { talkText: 'A true sacrifice, despite all the blood.' } },
  'bloodhound': { ...presets['bloodhound'], extra: { talkText: 'A fiercely loyal companion.' } },
  'bullfrog': { ...presets['bullfrog'], extra: { talkText: 'Seemingly lazy, but ever watchful.' } },
  'cat': { ...presets['cat'], extra: { talkText: 'It may not die, but it does feel the pain.' } },
  'cockroach': { ...presets['cockroach'], extra: { talkText: 'An immortal, persistent nuisance.' } },
  'corpse_maggots': { ...presets['corpse_maggots'], extra: { talkText: 'Always inevitable, emerging from death.' } },
  'coyote': { ...presets['coyote'], extra: { talkText: 'A meager, but dangerous, scavanger.' } },
  'elk': { ...presets['elk'], extra: { talkText: 'Hearty form, but flighty nature.' } },
  'elk_fawn': { ...presets['elk_fawn'], extra: { talkText: 'Young, ambitious, and scared.', evolvesInto: 'Elk' } },
  'field_mice': { ...presets['field_mice'], extra: { talkText: 'Where one is, another is not far behind.' } },
  'geck': { ...presets['geck'], extra: { talkText: 'Uninspiring, but charming despite it all.' } },
  'great_white': { ...presets['great_white'], extra: { talkText: 'Go fish.' } },
  'grizzly': { ...presets['grizzly'], extra: { talkText: 'Its form speaks enough of its efficacy.' } },
  'kingfisher': { ...presets['kingfisher'], extra: { talkText: 'A swift, slippery hunter.' } },
  'magpie': { ...presets['magpie'], extra: { talkText: 'A collector of trinkets and trash alike.' } },
  'mantis': { ...presets['mantis'], extra: { talkText: 'A slight incarnation of terror.' } },
  'mantis_god': { ...presets['mantis_god'], extra: { talkText: 'A true incarnation of terror.' } },
  'mole': { ...presets['mole'], extra: { talkText: 'Blind, but seemingly omnipresent.' } },
  'mole_man': { ...presets['mole_man'], extra: { talkText: 'An unyeilding, ultimate defence.' } },
  'moose_buck': { ...presets['moose_buck'], extra: { talkText: 'A towering, and ever powerful beast.' } },
  'opossum': { ...presets['opossum'], extra: { talkText: 'Resourceful, weak, but endearing.' } },
  'pack_rat': { ...presets['pack_rat'], extra: { talkText: 'A prudent rat bearing trinkets.' } },
  'porcupine': { ...presets['porcupine'], extra: { talkText: 'An ornery, ever annoying rodent.' } },
  'pronghorn': { ...presets['pronghorn'], extra: { talkText: 'Oddly sadistic, this venerable beast.' } },
  'rabbit': { ...presets['rabbit'], extra: { talkText: 'What purpose could it serve?' } },
  'rat_king': { ...presets['rat_king'], extra: { talkText: 'Tragic royalty, destined to crumple.' } },
  'rattler': { ...presets['rattler'], extra: { talkText: 'Brittle, if you can survive its bite.' } },
  'raven': { ...presets['raven'], extra: { talkText: 'Horribly clever, this blight of a bird is.' } },
  'raven_egg': { ...presets['raven_egg'], extra: { talkText: 'No less conniving in its incubation.', evolvesInto: 'Raven' } },
  'river_otter': { ...presets['river_otter'], extra: { talkText: 'Elusive, but not very menacing.' } },
  'river_snapper': { ...presets['river_snapper'], extra: { talkText: 'Stalwart in the face of adversity.' } },
  'skunk': { ...presets['skunk'], extra: { talkText: 'A horrid stench to keep predators away.' } },
  'sparrow': { ...presets['sparrow'], extra: { talkText: 'Meek and feeble, yes. But ever so useful.' } },
  'squirrel': { ...presets['squirrel'], extra: { talkText: 'Small, frail, but ever so useful.' } },
  'turkey_vulture': { ...presets['turkey_vulture'], extra: { talkText: 'A horrid tyrant upon the skies.' } },
  'urayuli': { ...presets['urayuli'], extra: { talkText: 'This level of brutality needs no words.' } },
  'warren': { ...presets['warren'], type: 'common', extra: { talkText: 'A bountiful pit of hares.' } },
  'wolf': { ...presets['wolf'], extra: { talkText: 'A proud, and vicious, contender.' } },
  'wolf_cub': { ...presets['wolf_cub'], extra: { talkText: 'An ambitious predator, needing only time.', evolvesInto: 'Wolf' } },
  'worker_ant': { ...presets['worker_ant'], extra: { talkText: 'Weak alone, but overwhelming in force.' } },

  'salmon': { type: 'common', name: 'salmon', portrait: 'salmon' as any, power: 2, health: 2, cost: { type: 'blood', amount: 2 }, sigils: ['submerge', 'strafe'], extra: {talkText: 'Expectedly slippery, surprisingly strong.'} },
  'squirrel_ball': { type: 'common', name: 'squirrelball', portrait: 'squirrelball' as any, power: 0, health: 1, cost: { type: 'blood', amount: 1 }, sigils: ['squirrelstrafe' as any] , extra: {talkText: 'An odd, almost unnatural behavior.'}},
  'stoat_talking': { type: 'common', name: 'stoat', portrait: 'stoat_talking' as any, power: 1, health: 3, cost: { type: 'blood', amount: 1 }, extra: { talkText: '"Yep, it\'s me. Nice topdeck."' } },
  'stinkbug_talking': { type: 'common', name: 'stinkbug_talking', portrait: 'stinkbug_talking' as any, power: 1, health: 2, cost: { type: 'bone', amount: 2 }, sigils: ['debuffenemy'], extra: { talkText: '"Salutations, a lucky draw."' } },
  'wolf_talking': { type: 'common', name: 'wolf_talking', portrait: 'wolf_talking' as any, power: 2, health: 2, cost: { type: 'blood', amount: 2 }, extra: { talkText: '"Careful now, use me wisely."' } },
  'hrokkall': { type: 'rare', name: 'hrokkall', portrait: 'hrokkall' as any, power: 1, health: 1, sigils: ['submerge', 'gainbattery' as any], cost: { type: 'blood', amount: 1 }, extra: { talkText: 'Vicious in appearance, frail in nature.' } },
}

generateCards(pixelProfilgateCards, new PixelProfilgateGenerator())
