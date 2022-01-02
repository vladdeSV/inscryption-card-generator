import { execSync } from "child_process";
import { Card, CardType } from "../act1/types";
import { CardGenerator } from "./cardGenerator";

class LeshyCardGenerator implements CardGenerator {

  generate(card: Card): Buffer {
    const commands: string[] = []
    const im = (cmd: string) => commands.push(cmd);

    const geometryPosition = (x: number, y: number): string => {
      const firstSign = x > 0 ? '+' : '-'
      const secondSign = y > 0 ? '+' : '-'
      return `${firstSign}${Math.abs(x)}${secondSign}${Math.abs(y)}`
    }

    im(`convert ./resource/cards/${card.type}.png`)
    im(`-font ./resource/HEAVYWEIGHT.otf -pointsize 200`)

    const isTerrain = card.options?.isTerrain ?? false
    const portrait = card.portrait;
    if (portrait) {
      if (portrait === 'custom') {
        im(`\\( - -gravity center -geometry +0-15 \\) -composite`)
      } else {
        const portraitLocation = `./resource/portraits/${portrait}.png`
        im(`\\( ${portraitLocation} -gravity center -geometry +0-15 \\) -composite`)
      }
    }

    if (card.options?.hasBorder) {
      const borderName = ((a: CardType): 'common' | 'terrain' | 'rare' => a === 'nostat' ? 'common' : a)(card.type)
      im(`./resource/cards/borders/${borderName}.png -composite`)
    }

    im('-filter Box -resize x1050') // make big
    im('-gravity northwest')

    const tribes = card.tribes
    if (tribes) {
      const aligns: string[] = [geometryPosition(-12, 3), geometryPosition(217, 5), geometryPosition(444, 7), geometryPosition(89, 451), geometryPosition(344, 452)]

      for (const [index, tribe] of tribes.entries()) {
        const tribeLocation = `./resource/tribes/${tribe}.png`
        const position = aligns[index]

        im(`\\( ${tribeLocation} -resize x354 -gravity northwest -alpha set -background none -channel A -evaluate multiply 0.4 +channel -geometry ${position} \\) -composite`)
      }
    }

    const cost = card.cost
    if (cost) {
      const { amount, type } = cost;

      const costPath = `./resource/costs/${amount}${type}.png`
      const position = geometryPosition(32, 110)
      im(`\\( ${costPath} -interpolate Nearest -filter point -resize 284x -filter box -gravity east \\) -gravity northeast -geometry ${position} -composite -gravity northwest`)
    }

    const power = card.power
    if (power !== undefined) {
      if (typeof power === 'number') {
        const size = '114x215'
        const position = geometryPosition(68, 729)

        // don't show power if power === 0 and card is a terrain card
        if (power > 0 || !card.options?.isTerrain) {
          im(`\\( -pointsize 0 -size ${size} -background none label:${power} -gravity east -extent ${size} \\) -gravity northwest -geometry ${position} -composite`)
        }
      } else {
        const statIconPath = `./resource/staticon/${power}.png`
        const position = '+5+705'
        im(`\\( "${statIconPath}" -interpolate Nearest -filter point -resize 245x -filter box -gravity northwest \\) -geometry ${position} -composite`)
      }
    }

    const xoffset = isTerrain ? -70 : 0

    const health = card.health
    if (health !== undefined) {
      const size = '114x215'
      const position = geometryPosition(41 - xoffset, 815)
      im(`\\( -pointsize 0 -size ${size} -background none label:${health} -gravity east -extent ${size} \\) -gravity northeast -geometry ${position} -composite`)
    }

    // // todo: refactor this behemoth
    const sigils = card.sigils
    if (sigils && sigils.length) {
      const sigilCount = sigils.length

      if (sigilCount === 1) {
        const sigilPath = `./resource/sigils/${sigils[0]}.png`
        const position = geometryPosition(221 + xoffset, 733)
        im(`\\( ${sigilPath} -interpolate Nearest -filter point -resize x253 -filter box -gravity northwest -geometry ${position} \\) -composite`)
      } else if (sigilCount === 2) {
        const sigilPath1 = `./resource/sigils/${sigils[0]}.png`
        const sigilPath2 = `./resource/sigils/${sigils[1]}.png`
        im(`\\( ${sigilPath1} -filter Box -resize x180 -gravity northwest -geometry ${geometryPosition(331 + xoffset, 720)} \\) -composite`)
        im(`\\( ${sigilPath2} -filter Box -resize x180 -gravity northwest -geometry ${geometryPosition(180 + xoffset, 833)} \\) -composite`)
      } else {

        throw new Error('Multiple sigils not supported (more than 2 sigils)')

        // for (const [index, sigil] of sigils.entries()) {
        //   const sigilPath = `./resource/sigils/${sigil}.png`
        //   const rotateAmount = 2 * Math.PI / sigilCount
        //   const baseRotation = Math.PI / 6
        //   const dist = 80
        //   const scale = (sigilCount >= 5) ? 200 : 270
        //   const x = xoffset + dist * Math.cos(baseRotation + rotateAmount * index)
        //   const y = 330 - dist * Math.sin(baseRotation + rotateAmount * index) - (sigilCount === 3 ? 15 : 0)

        //   im(`\\( "${sigilPath}" -resize ${scale}% -filter box -gravity center -geometry +${x}+${y} \\) -composite`)
        // }
      }
    }

    if (card.options?.isSquid) {
      const squidTitlePath = `./resource/misc/squid_title.png`
      im(`\\( "${squidTitlePath}" -interpolate Nearest -filter point -resize x152 -filter box -gravity north -geometry +0+20 \\) -composite`)
    } else if (card.name) {
      const escapedName = card.name.replace(/[\\']/g, '')
      const size = '570x135'
      const position = geometryPosition(0, 28)
      im(`\\( -pointsize 0 -size ${size} -background none label:'${escapedName}' -trim -gravity center -extent ${size} -resize 106%x100%\\! \\) -gravity north -geometry ${position} -composite`)
    }

    if (card.options?.isGolden) {
      im(`\\( -clone 0 -fill rgb\\(255,128,0\\) -colorize 75 \\) -geometry +0+0 -compose hardlight -composite`)

      // use emission for default portraits
      if (card.portrait && card.portrait !== 'custom') {
        const scale = 1050 / 190
        im(`\\( ./resource/portraits/emissions/${card.portrait}.png -filter Box -resize ${scale * 100}% -gravity center -geometry +0-${15 * scale} \\) -compose overlay -composite`)
      }
    }

    const decals = card.decals
    if (decals) {
      for (const decal of decals) {
        const decalPath = `./resource/decals/${decal}.png`
        im(`\\( ${decalPath} -filter Box -resize x1050 \\) -composite`)
      }
    }

    if (card.options?.isEnhanced && card.portrait !== 'custom') {
      const scale = 1050 / 190
      im(`\\( ./resource/portraits/emissions/${card.portrait}.png -fill rgb\\(161,247,186\\) -colorize 100 -resize ${scale * 100}% -gravity center -geometry -2-${15 * scale} \\) -composite`)
      im(`\\( ./resource/portraits/emissions/${card.portrait}.png -fill rgb\\(161,247,186\\) -colorize 100 -resize ${scale * 100}% -gravity center -geometry -2-${15 * scale} -blur 0x10 \\) -composite`)
    }

    im('-') // to stdout (stdoat hehe)

    const command = commands.join(' ')
    console.log('COMMAND:', command);

    let customPortraitData = undefined
    if (card.portrait === 'custom' && card.options?.portraitData) {
      customPortraitData = Buffer.from(card.options.portraitData, 'base64')
    }

    console.time('generation time')
    const buffer = execSync(command, { input: customPortraitData })
    console.timeEnd('generation time')

    return buffer
  }

  generateBack(type: 'common' | 'squirrel' | 'bee' | 'deathcard' = 'common'): Buffer {
    return execSync(`convert ./resource/cards/backs/${type}.png -filter Box -resize x1050 -`)
  }
}

export { LeshyCardGenerator }
