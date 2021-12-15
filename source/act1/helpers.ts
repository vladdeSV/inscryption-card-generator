import { execSync } from "child_process"
import { readFileSync } from "fs"
import { Card, CardBack, CardBackType, CardType, Power } from "./types"

function powerFromInput(input: unknown): number | Power | undefined {
  if (Power.guard(input)) {
    return input
  }

  const power = Number(input)
  if (!Number.isNaN(power)) {
    return power
  }
}

function arrayify(input: unknown) {
  return Array.isArray(input) ? input : [input]
}

function cardFromData(body: any): Card {
  const card = Card.check({
    type: body.type,
    name: body.name,
    portrait: body.portrait,
    health: body.health ? Number(body.health) : undefined,
    power: powerFromInput(body.power),
    cost: body.cost,
    tribes: body.tribes ? [...new Set(arrayify(body.tribes))] : [],
    sigils: body.sigils ? [...new Set(arrayify(body.sigils))] : [],
    decals: body.decals ? [...new Set(arrayify(body.decals))] : [],
    options: {
      isTerrain: body.terrain,
      isEnhanced: body.enhanced,
      isGolden: body.golden,
      hasBorder: body.border,
      portraitData: body.portraitData
    }
  })

  if (card.portrait === 'custom') {
    if (typeof card.options?.portraitData !== 'string') {
      throw 'custom portrait requires data'
    }

    card.options.portraitData = card.options.portraitData.replace(/[\s\r\n]/g, '')
  }

  return card
}

function cardBackFromData(body: any): CardBack {
  const cardBack = CardBack.check({
    type: body.type,
    options: {
      hasBorder: body.border,
    }
  })

  return cardBack
}

function bufferFromCard(card: Card): Buffer {

  const commands: string[] = []
  const im = (command: string) => commands.push(command)

  const isTerrain = card.options?.isTerrain ?? false
  const bottomBarOffset = isTerrain ? 80 : 0
  const font = './resource/HEAVYWEIGHT.TTF'

  const portrait = card.portrait
  if (portrait) {
    if (portrait === 'custom') {
      // todo
    } else {
      const portraitLocation = `./resource/portraits/${portrait}.png`

      im(`\\( '${portraitLocation}' -gravity center -geometry +0-15 \\) -composite`)
    }
  }

  if (card.options?.hasBorder) {
    const borderName = ((a: CardType): 'common' | 'terrain' | 'rare' => a === 'nostat' ? 'common' : a)(card.type)
    im(`./resource/cards/borders/${borderName}.png -composite`)
  }

  // make big
  im(`-filter Box -resize 674x1024`)

  const aligns: { gravity: string, geometry: string }[] = [
    { gravity: 'northwest', geometry: `-11+4` },
    { gravity: 'north', geometry: `-1+4` },
    { gravity: 'northeast', geometry: `-14+4` },
    { gravity: 'center', geometry: `-121+101` },
    { gravity: 'center', geometry: `+125+101` },
  ]

  // todo: coud be converted to one command
  const tribes = card.tribes
  if (tribes) {
    for (const [index, tribe] of tribes.entries()) {
      const tribeLocation = `./resource/tribes/${tribe}.png`
      const { gravity, geometry } = aligns[index]

      im(`\\( "${tribeLocation}" -resize 233% -gravity ${gravity} -alpha set -background none -channel A -evaluate multiply 0.4 +channel -geometry ${geometry} \\) -composite`)
    }
  }

  const cost = card.cost
  if (cost) {
    const { amount, type } = cost;

    const costPath = `./resource/costs/${amount}${type}.png`
    im(`\\( "${costPath}" -interpolate Nearest -filter point -resize 440% -filter box -gravity east -geometry +32-265 \\) -composite`)
  }

  const power = card.power
  if (power !== undefined) {
    if (typeof power === 'number') {
      im(`-font ${font} -pointsize 200 -draw "gravity southwest text 64,104 '${power}'"`)
    } else {
      const statIconPath = `./resource/staticon/${power}.png`
      im(`\\( "${statIconPath}" -interpolate Nearest -filter point -resize 490% -filter box -gravity southwest -geometry +5+95 \\) -composite`)
    }
  }

  const health = card.health
  if (health !== undefined) {
    im(`-font ${font} -pointsize 200 -draw "gravity southeast text ${60 + bottomBarOffset},23 '${health}'"`)
  }

  // todo: refactor this behemoth
  const sigils = card.sigils
  if (sigils) {
    const sigilCount = sigils.length
    for (const [index, sigil] of sigils.entries()) {
      const sigilPath = `./resource/sigils/${sigil}.png`
      const xoffset = isTerrain ? -70 : -2

      if (sigilCount === 1) {
        im(`\\( "${sigilPath}" -interpolate Nearest -filter point -resize 495.8248% -filter box -gravity south -geometry +${xoffset}+63 \\) -composite`)
      } else {
        const rotateAmount = 2 * Math.PI / sigilCount
        const baseRotation = sigilCount === 2 ? 0.63 : Math.PI / 6
        const dist = sigilCount > 2 ? 80 : 90
        const scale = sigilCount > 2 ? (sigilCount >= 5 ? 200 : 270) : 370
        const x = xoffset + dist * Math.cos(baseRotation + rotateAmount * index)
        const y = 330 - dist * Math.sin(baseRotation + rotateAmount * index) - (sigilCount === 3 ? 15 : 0)
        const interpOptions = sigilCount < 3 ? '-interpolate Nearest -filter point' : ''

        im(`\\( "${sigilPath}" ${interpOptions} -resize ${scale}% -filter box -gravity center -geometry +${x}+${y} \\) -composite`)
      }
    }
  }

  if (card.options?.isSquid) {
    const squidTitlePath = `./resource/misc/squid_title.png`
    im(`\\( "${squidTitlePath}" -interpolate Nearest -filter point -resize 530% -filter box -gravity north -geometry +0+19 \\) -composite`)
  } else if (card.name) {
    const name = card.name
    const nameSizing = (length: number) => {
      switch (length) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
          return { size: 120, wm: 1.155, hm: 1.115, yoff: 41 }
        case 12:
          // fixme
          return { size: 100, wm: 1.17, hm: 1.1, yoff: 35 }
        case 13:
          return { size: 100, wm: 1.115, hm: 1, yoff: 0 }
        case 14:
        default:
          return { size: 90, wm: 1.115, hm: 1, yoff: 0 }
      }
    }

    const nameSize = nameSizing(name.length)

    const escapeName = (name: string) => name.replace(/\\/g, '\\\\').replace(/'/g, '\\\'').replace(/"/g, '\\"')
    im(`-font '${font}' -pointsize ${nameSize.size} -draw "gravity center scale ${nameSize.wm},${nameSize.hm} text 3,${-404 + nameSize.yoff} '${escapeName(name)}'"`)
  }

  const decals = card.decals
  if (decals) {
    for (const decal of decals) {
      const decalPath = `./resource/decals/${decal}.png`
      im(`\\( ${decalPath} -filter Box -resize 674x1024 \\) -composite`)
    }
  }

  try {
    const command = commands.map(x => `convert - ${x} -`).join(' | ')
    const baseCardBuffer = readFileSync(`./resource/cards/${card.type}.png`)
    return execSync(command, { input: baseCardBuffer })
  } catch (e: unknown) {
    throw new Error('Image creation failed')
  }
}

function bufferFromCardBack(cardBack: CardBack): Buffer {
  const commands: string[] = []
  const im = (command: string) => commands.push(command)

  if (cardBack.options?.hasBorder) {
    const borderName = ((cardBackType: CardBackType): 'common' | 'common_special' => {
      switch (cardBackType) {
        case 'common':
          return 'common'
        default:
          return 'common_special'
      }
    })(cardBack.type)
    im(`./resource/cards/backs/borders/${borderName}.png -composite`)
  }

  // make big
  im(`-filter Box -resize 674x1024`)

  try {
    const command = commands.map(x => `convert - ${x} -`).join(' | ')
    const baseCardBuffer = readFileSync(`./resource/cards/backs/${cardBack.type}.png`)
    return execSync(command, { input: baseCardBuffer })
  } catch (e: unknown) {
    throw new Error('Image creation failed')
  }
}

export { cardFromData, cardBackFromData, bufferFromCard, bufferFromCardBack }
