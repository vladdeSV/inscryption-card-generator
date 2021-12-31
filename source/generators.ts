import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import * as path from "path";
import { Card, CardType } from './act1/types'

interface CardGenerator {
  generate(card: Card): Buffer;
  generateBack(): Buffer;
  requiredFiles?(): string[]
}

export class LeshyCardGenerator implements CardGenerator {

  generate(card: Card): Buffer {

    const isTerrain = card.options?.isTerrain ?? false
    const bottomBarOffset = isTerrain ? 80 : 0

    const commands: string[] = []
    const im = (cmd: string) => commands.push(cmd);

    im(`convert ./resource/cards/${card.type}.png`)
    im(`-font ./resource/HEAVYWEIGHT.otf -pointsize 200`)

    const portrait = card.portrait;
    if (portrait) {
      if (portrait === 'custom') {
        throw new Error('Custom portraits are not available')
      }

      const portraitLocation = `./resource/portraits/${portrait}.png`
      im(`\\( '${portraitLocation}' -gravity center -geometry +0-15 \\) -composite`)
    }

    if (card.options?.hasBorder) {
      const borderName = ((a: CardType): 'common' | 'terrain' | 'rare' => a === 'nostat' ? 'common' : a)(card.type)
      im(`./resource/cards/borders/${borderName}.png -composite`)
    }

    im(`-filter Box -resize x1050`) // make big //// FIXME: should be 1050px height

    // // todo: coud be converted to one command
    // const tribes = card.tribes
    // if (tribes) {
    //   const aligns: { gravity: string, geometry: string }[] = [
    //     { gravity: 'northwest', geometry: `-11+4` },
    //     { gravity: 'north', geometry: `-1+4` },
    //     { gravity: 'northeast', geometry: `-14+4` },
    //     { gravity: 'center', geometry: `-121+101` },
    //     { gravity: 'center', geometry: `+125+101` },
    //   ]

    //   for (const [index, tribe] of tribes.entries()) {
    //     const tribeLocation = `./resource/tribes/${tribe}.png`
    //     const { gravity, geometry } = aligns[index]

    //     im(`\\( "${tribeLocation}" -resize 233% -gravity ${gravity} -alpha set -background none -channel A -evaluate multiply 0.4 +channel -geometry ${geometry} \\) -composite`)
    //   }
    // }

    const cost = card.cost
    if (cost) {
      const { amount, type } = cost;

      const costPath = `./resource/costs/${amount}${type}.png`
      im(`\\( "${costPath}" -interpolate Nearest -filter point -resize 288x -filter box -gravity east \\) -gravity northeast -geometry +32+109 -composite -gravity northwest`)
    }

    const power = card.power
    if (power !== undefined) {
      if (typeof power === 'number') {
        const size = '114x215'
        const position = '+68+729'
        // const position = '+41+815' - gravity northeast
        im(`\\( -pointsize 0 -size ${size} -background none label:"${power}" -gravity east -extent ${size} \\) -gravity northwest -geometry ${position} -composite`)
      } else {
        throw new Error('Custom portraits are not available')
        // const statIconPath = `./resource/staticon/${power}.png`
        // im(`\\( "${statIconPath}" -interpolate Nearest -filter point -resize 490% -filter box -gravity southwest -geometry +5+95 \\) -composite`)
      }
    }

    const health = card.health
    if (health !== undefined) {
      const size = '114x215'
      const position = '+41+815'
      im(`\\( -pointsize 0 -size ${size} -background none label:"${health}" -gravity east -extent ${size} \\) -gravity northeast -geometry ${position} -composite`)
   
    }

    // // todo: refactor this behemoth
    // const sigils = card.sigils
    // if (sigils && sigils.length) {
    //   const sigilCount = sigils.length
    //   const xoffset = isTerrain ? -70 : -2

    //   if (sigilCount === 1) {
    //     const sigilPath = `./resource/sigils/${sigils[0]}.png`
    //     im(`\\( "${sigilPath}" -interpolate Nearest -filter point -resize 495.8248% -filter box -gravity south -geometry +${xoffset}+63 \\) -composite`)
    //   } else if (sigilCount === 2) {

    //     const geopos = (a: number, b: number): string => {
    //       const firstSign = a > 0 ? '+' : '-'
    //       const secondSign = b > 0 ? '+' : '-'
    //       return `${firstSign}${Math.abs(a)}${secondSign}${Math.abs(b)}`
    //     }

    //     const x1 = xoffset + 77
    //     const x2 = xoffset - 73
    //     const sigilPath1 = `./resource/sigils/${sigils[0]}.png`
    //     const sigilPath2 = `./resource/sigils/${sigils[1]}.png`
    //     im(`\\( "${sigilPath1}" -filter Box -resize 370% -gravity center -geometry ${geopos(x1, 277)} \\) -composite`)
    //     im(`\\( "${sigilPath2}" -filter Box -resize 370% -gravity center -geometry ${geopos(x2, 385)} \\) -composite`)

    //   } else {

    //     for (const [index, sigil] of sigils.entries()) {
    //       const sigilPath = `./resource/sigils/${sigil}.png`
    //       const rotateAmount = 2 * Math.PI / sigilCount
    //       const baseRotation = Math.PI / 6
    //       const dist = 80
    //       const scale = (sigilCount >= 5) ? 200 : 270
    //       const x = xoffset + dist * Math.cos(baseRotation + rotateAmount * index)
    //       const y = 330 - dist * Math.sin(baseRotation + rotateAmount * index) - (sigilCount === 3 ? 15 : 0)

    //       im(`\\( "${sigilPath}" -resize ${scale}% -filter box -gravity center -geometry +${x}+${y} \\) -composite`)
    //     }
    //   }
    // }

    // if (card.options?.isSquid) {
    //   const squidTitlePath = `./resource/misc/squid_title.png`
    //   im(`\\( "${squidTitlePath}" -interpolate Nearest -filter point -resize 530% -filter box -gravity north -geometry +0+19 \\) -composite`)
    // } else if (card.name) {
    //   console.log(card.name);

    //   const escapedName = card.name.replace(/[\\"]/g, '')
    //   const size = '580x135'
    //   im(`\\( -pointsize 0 -size ${size} -background none label:"${escapedName}" -trim -gravity center -extent ${size} \\) -gravity north -geometry +0+26 -composite`)
    // }

    // if (card.options?.isGolden) {
    //   im(`\\( -clone 0 -fill rgb\\(255,128,0\\) -colorize 75 \\) -geometry +0+0 -compose hardlight -composite`)

    //   // use emission for default portraits
    //   if (card.portrait && card.portrait !== 'custom') {
    //     im(`\\( ./resource/portraits/emissions/${card.portrait}.png -filter Box -resize ${scale * 100}% -gravity center -geometry +0-${15 * scale} \\) -compose overlay -composite`)
    //   }
    // }

    // const decals = card.decals
    // if (decals) {
    //   for (const decal of decals) {
    //     const decalPath = `./resource/decals/${decal}.png`
    //     im(`\\( ${decalPath} -filter Box -resize x1024 \\) -composite`)
    //   }
    // }

    im('-') // to stdout

    const command = commands.join(' ')
    console.log('COMMAND:', command);

    return execSync(command)
  }

  generateBack(): Buffer {
    throw new Error("Method not implemented.");
  }
}

const resourcePath = './resource/'
const requiredBaseFiles: string[] = [
  './cards/common.png',
  './cards/rare.png',
  './cards/terrain.png',
]

function validateRequiredFiles(resourcePath: string, requiredFiles: string[]): void {
  const missingFilePaths = []

  for (const file of requiredFiles) {
    const filePath = path.normalize(path.join(resourcePath, file))

    if (!existsSync(filePath)) {
      missingFilePaths.push(filePath)
    }
  }

  if (missingFilePaths.length) {
    for (const missingFilePath of missingFilePaths) {
      console.error('ERROR:', 'Missing file', missingFilePath);

    }

    process.exit(1)
  }
}

validateRequiredFiles(resourcePath, requiredBaseFiles)
