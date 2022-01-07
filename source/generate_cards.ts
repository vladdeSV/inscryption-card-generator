import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import * as path from 'path'
import { LeshyCardGenerator } from "./generators/leshyCardGenerator";
import { Card } from "./act1/types";

const translations = JSON.parse(readFileSync('./translations.json', 'utf-8'))

export function generateCards(input: { [s: string]: Card }, cardGenerator: LeshyCardGenerator, locale: string) {

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
            const name = card.name!;

            const translatedName = translations[locale][name] as string ?? name

            if (name && !translatedName) {
                console.warn(`WARNING: Missing translation for '${id}'`);
            }

            const buffer = cardGenerator.generate({ ...card, name: translatedName }, locale)

            const filename = id;

            writeFileSync(path.join(cardsPath, filename + '.png'), buffer)
        }
    }
}
