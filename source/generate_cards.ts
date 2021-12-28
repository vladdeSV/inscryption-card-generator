import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { presets } from ".";
import { bufferFromCard } from "./act1/helpers";
import * as path from 'path'

const translations = JSON.parse(readFileSync('./translations.json', 'utf-8'))
const locales = Object.keys(translations).filter(x => !['zh-cn', 'zh-tw', 'jp', 'ko'].includes(x))

for (const locale of locales) {
    console.log(`Generating cards for locale '${locale}'`);

    const cardsPath = path.join('cards', locale)
    if (!existsSync(cardsPath)) {
        mkdirSync(cardsPath, { recursive: true })
    }

    for (const id in presets) {

        if (!Object.prototype.hasOwnProperty.call(presets, id)) {
            continue
        }

        const card = presets[id]
        const name = card.name!;

        const translatedName = translations[locale][name] as string

        if (translatedName === undefined && !(name === 'leshy' || name === 'hungrychild')) {
            console.error(`ERROR: Missing translation for '${id}'`);
            continue;
        }

        const buffer = bufferFromCard({ ...card, name: translatedName })

        let filename = (translatedName ?? name).toLocaleLowerCase(locale).replace(/\s/g, '_')
        while (existsSync(path.join(cardsPath, filename + '.png'))) {
            filename = `${filename}_x`
        }

        writeFileSync(path.join(cardsPath, filename + '.png'), buffer)
    }
}
