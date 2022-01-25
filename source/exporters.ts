import { execSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

import { Card } from "./act1/types";
import { LeshyCardGenerator } from "./generators/leshyCardGenerator";

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
            const name = card.name!;

            const translatedName = nameMapping[name] as string

            if (name && translatedName === undefined) {
                console.warn(`WARNING: Missing translation for '${id}'`);
            }

            const buffer = cardGenerator.generate({ ...card, name: translatedName }, locale)

            const filename = id;

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
    
    ${backPathForId(ids[0], locale)} -geometry +142.1+141.7 -composite
    ${backPathForId(ids[1], locale)} -geometry +142.1+1288.6 -composite
    ${backPathForId(ids[2], locale)} -geometry +1937+141.7 -composite
    ${backPathForId(ids[3], locale)} -geometry +1937+1288.6 -composite
    
    ${pathForId(ids[0], locale)} -geometry +879.9+141.7 -composite
    ${pathForId(ids[1], locale)} -geometry +879.9+1288.6 -composite
    ${pathForId(ids[2], locale)} -geometry +2675.2+141.7 -composite
    ${pathForId(ids[3], locale)} -geometry +2675.2+1288.6 -composite
    
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

export { generateAct1Cards, generatePdf, validateIds }
