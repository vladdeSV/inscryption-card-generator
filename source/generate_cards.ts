import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { presets } from ".";
import * as path from 'path'
import { LeshyCardGenerator } from "./generators/leshyCardGenerator";
import { PixelProfilgateGenerator } from "./generators/pixelProfilgateCardGenerator";
import { Card } from "./act1/types";

const translations = JSON.parse(readFileSync('./translations.json', 'utf-8'))
const locales = ['en'] // Object.keys(translations).filter(x => !['zh-cn', 'zh-tw', 'jp', 'ko'].includes(x))

function generateCards(input: { [s: string]: Card }) {
    for (const locale of locales) {
        console.log(`Generating cards for locale '${locale}'`);
        const cardGenerator = new PixelProfilgateGenerator()

        const cardsPath = path.join('cards', locale)
        if (!existsSync(cardsPath)) {
            mkdirSync(cardsPath, { recursive: true })
        }

        // const cardBacksPath = path.join(cardsPath, 'backs')
        // if (!existsSync(cardBacksPath)) {
        //     mkdirSync(cardBacksPath, { recursive: true })
        // }

        // const backs: ('common' | 'squirrel' | 'bee' | 'deathcard')[] = ['common', 'squirrel', 'bee', 'deathcard']
        // for (const back of backs) {
        //     const buffer = cardGenerator.generateBack(back)
        //     writeFileSync(path.join(cardBacksPath, back + '.png'), buffer)
        // }

        for (const id in input) {

            if (!Object.prototype.hasOwnProperty.call(input, id)) {
                continue
            }

            const card = input[id]
            const name = card.name!;

            const translatedName = translations[locale][name] as string

            if (name && !translatedName) {
                console.error(`ERROR: Missing translation for '${id}'`);
                continue;
            }

            console.log(card)
            const buffer = cardGenerator.generate({ ...card, name: translatedName })

            // let filename = (translatedName ?? name).toLocaleLowerCase(locale).replace(/\s/g, '_')
            // while (existsSync(path.join(cardsPath, filename + '.png'))) {
            //     filename = `${filename}_x`
            // }

            const filename = id;

            writeFileSync(path.join(cardsPath, filename + '.png'), buffer)
        }

        writeFileSync(path.join(cardsPath, 'back.png'), cardGenerator.generateBack());
    }
}

const pixelProfilgateCards: { [s: string]: Card } = {
    'adder': { ...presets['adder'], extra: { talkText: 'Always lethal, the caustic adder.' } },
    'alpha': { ...presets['alpha'] },
    'amalgam': { ...presets['amalgam'], extra: { talkText: 'Canine, reptile, bird, amalgam is all.' } },
    'ant_queen': { ...presets['ant_queen'] },
    'bat': { ...presets['bat'], extra: { talkText: 'A minor, meddlesome terror.' } },
    'bee': { ...presets['bee'], extra: { talkText: 'Unassuming, but determined pests.' } },
    'beehive': { ...presets['beehive'] },
    'black_goat': { ...presets['black_goat'] },
    'bloodhound': { ...presets['bloodhound'] },
    'bullfrog': { ...presets['bullfrog'] },
    'cat': { ...presets['cat'], extra: { talkText: 'It may not die, but id does feel the pain.' } },
    'cockroach': { ...presets['cockroach'] },
    'corpse_eater': { ...presets['corpse_eater'], extra: { talkText: 'Always inevitable, emerging from death.' } },
    'coyote': { ...presets['coyote'], extra: { talkText: 'A meager, but dangerous, scavanger.' } },
    'geck': { ...presets['geck'], extra: { talkText: 'Uninspiring, but charming despite it all' } },
    'great_white': { ...presets['great_white'], extra: { talkText: 'Go fish.' } },
    'grizzly': { ...presets['grizzly'], extra: { talkText: 'Its form speaks enough of its efficacy.' } },
    'kingfisher': { ...presets['kingfisher'], extra: { talkText: 'A swift, slippery hunter.' } },
    'magpie': { ...presets['magpie'] },
    'mantis': { ...presets['mantis'], extra: { talkText: 'A slight incarnation of terror.' } },
    'mantis_god': { ...presets['mantisgod'] },
    'mole': { ...presets['mole'] },
    'mole_man': { ...presets['moleman'] },
    'moose_buck': { ...presets['moosebuck'] },
    'opossum': { ...presets['opossum'], extra: { talkText: 'Resourceful, weak, but endearing.' } },
    'pack_rat': { ...presets['pack_rat'] },
    'porcupine': { ...presets['porcupine'] },
    'pronghorn': { ...presets['pronghorn'] },
    'rabbit': { ...presets['rabbit'], extra: { talkText: 'What purpose could it serve?' } },
    'rat_king': { ...presets['rat_king'] },
    'rattler': { ...presets['rattler'], extra: { talkText: 'Brittle, if you can survive its bite.' } },
    'raven': { ...presets['raven'], extra: { talkText: 'Horribly clever, this blight of a bird is.' } },
    'raven_egg': { ...presets['raven_egg'] },
    'river_otter': { ...presets['river_otter'], extra: { talkText: 'Elusive, but not very menacing.' } },
    'river_snapper': { ...presets['river_snapper'], extra: { talkText: 'Stalward in the face of adversity.' } },
    'skunk': { ...presets['skunk'], extra: { talkText: 'A horrid stench to keep predators away.' } },
    'sparrow': { ...presets['sparrow'], extra: { talkText: 'Meek and feeble, yes. But ever so useful.' } },
    'squirrel': { ...presets['squirrel'], extra: { talkText: 'Small, frail, but ever so useful.' } },
    'turkey_vulture': { ...presets['turkey_vulture'], extra: { talkText: 'A horrid tyrant upon the skies.' } },
    'urayuli': { ...presets['urayuli'], extra: { talkText: 'This level of brutality need no words.' } },
    'warren': { ...presets['warren'] },
    'wolf': { ...presets['wolf'], extra: { talkText: 'A proud, and vicious, contender.' } },
    'wolf_cub': { ...presets['wolf_cub'] },
    'worker_ant': { ...presets['worker_ant'], extra: { talkText: 'Weak alone, but overwhelming in force.' } },

    'salmon': { type: 'common', name: 'salmon', portrait: 'salmon' as any, power: 2, health: 2, cost: { type: 'blood', amount: 2 }, sigils: ['submerge', 'strafe'] },
    'squirrel_ball': { type: 'common', name: 'squirrelball', portrait: 'squirrelball' as any, power: 0, health: 1, cost: { type: 'blood', amount: 1 }, sigils: ['squirrelstrafe' as any] },
    'stoat_talking': { type: 'common', name: 'stoat', portrait: 'stoat_talking' as any, power: 1, health: 3, cost: { type: 'blood', amount: 1 }, extra: { talkText: '"Yep, it\'s me. Nice topdeck."' } },
    'stinkbug_talking': { type: 'common', name: 'stinkbug_talking', portrait: 'stinkbug_talking' as any, power: 1, health: 2, cost: { type: 'bone', amount: 2 }, sigils: ['debuffenemy'], extra: { talkText: '"Salutations, a lucky draw"' } },
    'wolf_talking': { type: 'common', name: 'wolf_talking', portrait: 'wolf_talking' as any, power: 2, health: 2, cost: { type: 'blood', amount: 2 }, extra: { talkText: '"Careful now, use me wisely."' } },
    'hrokkall': { type: 'rare', name: 'hrokkall', portrait: 'hrokkall' as any, power: 1, health: 1, sigils: ['submerge', 'gainbattery' as any], cost: { type: 'blood', amount: 1 }, extra: {talkText: 'Vicious in appearance, frail in nature.'} },
}

generateCards(pixelProfilgateCards)
