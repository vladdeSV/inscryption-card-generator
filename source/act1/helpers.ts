import { exec, execSync } from "child_process"
import { Card, Cost } from "./types"

function costFromInput(input: any): Cost | undefined {
  if (typeof input === 'string') {
    const match = input.match(/^(\d+)(blood|bones?)$/)
    if (match === null) {
      return undefined
    }

    const amount = Number(match[1])
    let type = match[2]

    if (type === 'bone') {
      type = 'bones'
    }

    return Cost.check({ amount, type })
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
    power: q.power ? (typeof q.power === 'number' ? Number(q.power) : q.power) : undefined,
    cost: costFromInput(q.cost),
    tribes: q['tribes[]'] ? [...new Set(arrayify(q['tribes[]']))] : [],
    sigils: q['sigils[]'] ? [...new Set(arrayify(q['sigils[]']))] : [],
    decals: q['decals[]'] ? [...new Set(arrayify(q['decals[]']))] : [],
    options: {
      isTerrain: q.terrain,
      isEnhanced: q.enhanced,
      portraitData: q.portraitData
    }
  })

  return card
}

// async function execAsync(command: string): Promise<Buffer> {
//   return await new Promise((r, e) => exec(command, (e, stdout, _) => r(Buffer.from(stdout))))
// }

function isTerrainCard(card: Card): boolean {

  const terrain = card.options.isTerrain ?? 'auto';

  if (terrain === 'yes') {
    return true;
  }

  if (terrain === 'no') {
    return false;
  }

  // if we are here, then auto is set

  if (card.type === 'terrain') {
    const isWarren = card.portrait?.match(/^warren(_eaten[1-3]$)?/) && card.name === 'warren'
    if (isWarren) {
      return false
    }

    return true
  }

  return false
}

async function bufferFromCard(card: Card): Promise<Buffer> {

  const commands: string[] = []
  const im = (command: string) => commands.push(command)

  const isTerrain = isTerrainCard(card)
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
    { gravity: 'northwest', geometry: `-11+8` },
    { gravity: 'north', geometry: `-6+8` },
    { gravity: 'northeast', geometry: `-15+8` },
    { gravity: 'center', geometry: `-138+105` },
    { gravity: 'center', geometry: `+125+105` },
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
    im(`\\( "${costPath}" -interpolate Nearest -filter point -resize 460% -filter box -gravity east -geometry +32-265 \\) -composite`)
  }

  const power = card.power
  if (power) {
    if (typeof power === 'number') {
      im(`-font ${font} -pointsize 200 -draw "gravity southwest text 64,104 '${power}'"`)
    } else {
      // show attack type symbol
    }
  }

  const health = card.health
  if (health) {
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

  const name = card.name
  if (name) {
    const namePointSize = (name.length > 13) ? 90 : (name.length > 11 ? 100 : 120)
    const escapeName = (name: string) => name.replace(/\\/g, '\\\\').replace(/'/g, '\\\'').replace(/"/g, '\\"')
    im(`-font '${font}' -pointsize ${namePointSize} -draw "gravity center scale 1.115,1 text 0,-412 '${escapeName(name)}'"`)
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
