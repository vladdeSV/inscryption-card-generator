// import { presets } from '.'

import { execSync } from "child_process";

const lang = 'en'

const cardIds: [string, string, string, string][] = [
    ['wolf_cub','wolf','elk_fawn', 'elk'],
]

const pathForId = (id: string, lang: string): string => {
    return `./cards/${lang}/${id}.png`
}

const backCommonPath = `./cards/${lang}/squirrel.png`;

const command = cardIds.map(ids => `convert -size 3507.9x2480.3 xc:white -fill rgb\\(33,28,32\\) -draw "rectangle 118.1,118.1 1561.4,1189.4" -draw "rectangle 118.1,1290.9 1561.4,2362.2" -draw "rectangle 1946.5,118.1 3389.8,1189.4" -draw "rectangle 1946.5,1290.9 3389.8,2362.2" -stroke rgb\\(128,128,128\\) -strokewidth 1 -draw "line 839.8,0 839.8,2480.3" -draw "line 2668.1,0 2668.1,2480.3" ${backCommonPath} -geometry +142.1+141.7 -composite ${backCommonPath} -geometry +142.1+1314.6 -composite ${backCommonPath} -geometry +1970.1+141.7 -composite ${backCommonPath} -geometry +1970.1+1314.6 -composite ${pathForId(ids[0], lang)} -geometry +863.4+141.7 -composite ${pathForId(ids[1], lang)} -geometry +863.4+1314.6 -composite ${pathForId(ids[2], lang)} -geometry +2691.7+141.7 -composite ${pathForId(ids[3], lang)} -geometry +2691.7+1314.6 -composite out.png`).join(' && ')

execSync(command)
