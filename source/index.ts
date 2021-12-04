import { execSync, spawnSync } from 'child_process'
import fastify from 'fastify'
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs'
import { Card } from './cards'
import objectHash from 'object-hash';

const server = fastify()

server.get('/card', async (request, reply) => {

  const q = (request.query as any)
  const name = (q.name as string ?? '').toLowerCase()
  const power = q.power ? Number(q.power) : undefined
  const health = q.health ? Number(q.health) : undefined
  const portraitData = q.portraitData;

  const sigils = ((s: string[] | string) => {
    if (!s) { return [] }
    if (!Array.isArray(s)) { s = [s] }
    s = s.filter(x => x)
    return [...new Set(s)]
  })(q['sigils[]'])

  const tribes = ((s: string[] | string) => {
    if (!s) { return [] }
    if (!Array.isArray(s)) { s = [s] }
    return [...new Set(s)]
  })(q['tribes[]'])

  const cost = ((s: string | undefined): Card['cost'] => {
    if (!s) {
      return undefined
    }

    const match = s.match(/(\d)(blood|bones?)/)
    if (!match) {
      return undefined
    }

    const costAmount = Number(match[1])
    const costType = ((i) => {
      switch (i) {
        default:
        case 'blood': return 'blood'
        case 'bone':
        case 'bones': return 'bone'
      }
    })(match[2])

    return { amount: costAmount, type: costType }
  })(q.cost)

  const terrain = ((s: unknown): Card['terrain'] => {
    switch (s) {
      default:
      case 'auto': return undefined
      case 'yes': return true
      case 'no': return false
    }
  })(q.terrain)

  console.log(q);

  const cardType = ((s: unknown): Card['type'] => {
    switch (s) {
      default:
      case 'common': return 'common'
      case 'rare': return 'rare'
      case 'terrain': return 'terrain'
    }
  })(q.type)

  const decal = q.decal
  const enhanced = Boolean(q.enhanced)

  const card: Card = {
    name: name,
    power: power,
    health: health,
    tribes: tribes,
    sigils: sigils,
    cost: cost,
    type: cardType,
    enhanced: enhanced,
    terrain: terrain,
    portrait: ((s: unknown): string | undefined => (typeof s === 'string') ? s : undefined)(q.portrait),
    decal: decal,
    extra: {
      portraitData: portraitData
    }
  }

  const opts = {
    a: q.a,
    b: q.b,
    c: q.c,
    d: q.d,
  }

  const buffer = generateCard(card, opts)

  reply.type('image/png')
  reply.header('Content-Disposition', `inline; filename="${card.name.replace(/\s/g, '_')}.png"`)
  reply.send(buffer)

})

server.listen(8080, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})

function generateCard(card: Card, opts: any): Buffer {
  const im = 'convert'
  const out = 'out.png'
  const font = './resource/HEAVYWEIGHT.TTF'

  const cardHash = objectHash(card)
  const cacheCardPath = `./cache/${cardHash}.png`

  if (existsSync(cacheCardPath)) {
    return readFileSync(cacheCardPath)
  }


  const isTerrainCard = (card: Card): boolean => {

    if (card.terrain !== undefined) {
      return card.terrain;
    }

    // if we are here, then auto is set
    if (card.portrait?.match(/^warren(_eaten[1-3]$)?/) && card.name === 'warren') {
      return false
    }

    if (card.type === 'terrain') {
      return true
    }

    return false
  }

  const l = card.name.length
  const namePointSize = (l > 13) ? 90 : (l > 11 ? 100 : 120)
  const healthHorizontalOffset = isTerrainCard(card) ? 140 : 60

  // create low-res card
  execSync(`${im} "./resource/cards/${card.type}.png" -filter Box ${out}`)

  // portrait
  const portraitOffset = '+0-15'
  if (card.portrait === 'custom') {

    function hasOwnProperty<X extends {}, Y extends PropertyKey>
      (obj: X, prop: Y): obj is X & Record<Y, unknown> {
      return obj.hasOwnProperty(prop)
    }

    const extraData = card.extra;
    if (typeof extraData === 'object' && extraData && hasOwnProperty(extraData, 'portraitData')) {
      if (typeof extraData.portraitData === 'string') {
        spawnSync(`${im} ${out} \\( - -gravity center -geometry ${portraitOffset} \\) -composite ${out}`, { shell: true, input: Buffer.from(extraData.portraitData, 'base64') })
      }
    }

  } else if (!!card.portrait) {

    const a = `./resource/portraits/${card.portrait}.png`
    const b = `./resource/portraits/emission/${card.portrait}.png`

    if (existsSync(a)) {

      execSync(`${im} ${out} \\( "${a}" -gravity center -geometry ${portraitOffset} \\) -composite ${out}`)
      if (card.enhanced && existsSync(b)) {
        execSync(`${im} ${out} \\( "${b}" -gravity center -geometry ${portraitOffset} \\) -composite ${out}`)
      }
    }
  }


  // scale card
  const scale = '538.94%'
  execSync(`${im} ${out} -filter Box -scale ${scale} ${out}`)

  //card.tribes = ['bird', 'canine', 'hooved', 'reptile', 'insect']
  if (card.tribes.length) {
    const tribes = card.tribes

    const aligns = [
      { g: 'northwest', t: `-11+8` },
      { g: 'north', t: `-6+8` },
      { g: 'northeast', t: `-15+8` },
      { g: 'center', t: `-138+105` },
      { g: 'center', t: `+125+105` },
    ]

    for (let i = 0; i < Math.min(tribes.length, 5); i++) {
      const tribe = tribes[i]
      const align = aligns[i]

      const tribePath = `./resource/tribes/${tribe}.png`
      execSync(`${im} ${out} \\( "${tribePath}" -resize 233% -gravity ${align.g} -alpha set -background none -channel A -evaluate multiply 0.4 +channel -geometry ${align.t} \\) -composite ${out}`)
    }
  }

  const sigilCount = card.sigils.length
  if (sigilCount > 0) {
    const sigils = card.sigils;
    for (let i = 0; i < sigilCount; ++i) {
      const sigil = sigils[i];
      const sigilPath = `./resource/sigils/${sigil}.png`
      const xoffset = isTerrainCard(card) ? -70 : -2

      if (sigilCount === 1) {
        execSync(`${im} ${out} \\( "${sigilPath}" -interpolate Nearest -filter point -resize 495.8248% -filter box -gravity south -geometry +${xoffset}+63 \\) -composite ${out}`)
      } else {
        const rotateAmount = 2 * Math.PI / sigilCount
        const baseRotation = sigilCount === 2 ? 0.63 : Math.PI / 6
        const dist = sigilCount > 2 ? 80 : 90
        const scale = sigilCount > 2 ? (sigilCount >= 5 ? 200 : 270) : 370
        const x = xoffset + dist * Math.cos(baseRotation + rotateAmount * i)
        const y = 330 - dist * Math.sin(baseRotation + rotateAmount * i) - (sigilCount === 3 ? 15 : 0)
        const interpOptions = sigilCount < 3 ? '-interpolate Nearest -filter point' : ''

        execSync(`${im} ${out} \\( "${sigilPath}" ${interpOptions} -resize ${scale}% -filter box -gravity center -geometry +${x}+${y} \\) -composite ${out}`)
      }
    }
  }

  if (card.cost) {
    const { amount, type } = card.cost;

    const costPath = `./resource/costs/${amount}${type}.png`
    execSync(`${im} ${out} \\( "${costPath}" -interpolate Nearest -filter point -resize 460% -filter box -gravity east -geometry +32-265 \\) -composite ${out}`)
  }

  // apply text
  execSync(`${im} ${out} -font ${font} -fill black -pointsize 200 ${card.power !== undefined ? `-gravity southwest -annotate +64+104 "${card.power}"` : ''} ${card.health !== undefined ? `-gravity southeast -annotate +${healthHorizontalOffset}+23 "${card.health}"` : ''} -pointsize ${namePointSize} -gravity center -annotate +0-408 "${card.name}" ${out}`)


  if (card.decal) {
    const decalPath = `./resource/decals/${card.decal}.png`
    execSync(`${im} ${out} \\( ${decalPath} -filter Box -scale ${scale} \\) -composite ${out}`)
  }

  const buffer = readFileSync('./out.png')

  if (card.portrait !== 'custom') {
    writeFileSync(cacheCardPath, buffer)
  }
  unlinkSync('./out.png')

  return buffer
}
