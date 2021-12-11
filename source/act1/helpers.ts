import { exec, execSync } from "child_process"
import { Card, Cost, Power } from "./types"

function costFromInput(input: unknown): Cost | undefined {
  if (typeof input === 'string') {
    const match = input.match(/^(\d+)(blood|bones?)$/)
    if (match === null) {
      return undefined
    }

    const amount = Number(match[1])
    let type = match[2]

    if (type === 'bones') {
      type = 'bone'
    }

    return Cost.check({ amount, type })
  }
}

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

function cardFromData(q: any): Card {
  const card = Card.check({
    type: q.type,
    name: q.name,
    portrait: q.portrait,
    health: q.health ? Number(q.health) : undefined,
    power: powerFromInput(q.power),
    cost: costFromInput(q.cost),
    tribes: q['tribes[]'] ? [...new Set(arrayify(q['tribes[]']))] : [],
    sigils: q['sigils[]'] ? [...new Set(arrayify(q['sigils[]']))] : [],
    decals: q['decals[]'] ? [...new Set(arrayify(q['decals[]']))] : [],
    options: {
      isTerrain: q.terrain,
      isEnhanced: q.enhanced,
      isGolden: q.golden,
      portraitData: q.portraitData
    }
  })

  return card
}

async function bufferFromCard(card: Card): Promise<Buffer> {

  const commands: string[] = []
  const im = (command: string) => commands.push(command)

  const isTerrain = card.options.isTerrain ?? false
  const bottomBarOffset = isTerrain ? 80 : 0
  const font = './resource/HEAVYWEIGHT.TTF'

  im(`./resource/cards/${card.type}.png`)

  const portrait = card.portrait
  if (portrait) {
    if (portrait === 'custom') {
      // todo
    } else {
      const portraitLocation = `./resource/portraits/${portrait}.png`

      im(`\\( '${portraitLocation}' -gravity center -geometry +0-15 \\) -composite`)
    }
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
  for (const [index, tribe] of card.tribes.entries()) {
    const tribeLocation = `./resource/tribes/${tribe}.png`
    const { gravity, geometry } = aligns[index]

    im(`\\( "${tribeLocation}" -resize 233% -gravity ${gravity} -alpha set -background none -channel A -evaluate multiply 0.4 +channel -geometry ${geometry} \\) -composite`)
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
  const sigilCount = card.sigils.length
  for (const [index, sigil] of card.sigils.entries()) {
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

  if (card.options.isSquid) {
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

  for (const decal of card.decals) {
    const decalPath = `./resource/decals/${decal}.png`
    im(`\\( ${decalPath} -filter Box -resize 674x1024 \\) -composite`)
  }

  const firstCommand = commands.shift()
  const finalCommand = 'convert ' + firstCommand + ' - | ' + commands.map(x => `convert - ${x} -`).join(' | ')

  return execSync(finalCommand)
}

export { cardFromData, bufferFromCard, costFromInput, arrayify }
