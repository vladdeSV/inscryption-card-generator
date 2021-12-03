import { execSync, spawnSync } from 'child_process'
import fastify from 'fastify'
import { existsSync, readFileSync, unlink, unlinkSync, writeFileSync } from 'fs'
import { Card } from './cards'

const server = fastify()

server.get('/card', async (request, reply) => {

  const q = (request.query as any)
  const name = q.name ?? ''
  const power = q.power ? Number(q.power) : undefined
  const health = Number(q.health ?? 1)
  const portraitData = q.portraitData;
  const sigils = Array.isArray(q['sigils[]']) ? q['sigils[]'] : q['sigils[]'] ? [q['sigils[]']] : undefined
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

  const card: Card = {
    name: name,
    power: power,
    health: health,
    tribes: [],
    sigils: sigils,
    type: cardType,
    enhanced: false,
    terrain: terrain,
    portrait: ((s: unknown): string | undefined => (typeof s === 'string') ? s : undefined)(q.portrait),
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

  const isTerrainCard = (card: Card): boolean => {
    if (card.terrain !== undefined) {
      return card.terrain;
    }

    // if we are here, then auto is set
    if (card.portrait?.match(/^warren(_eaten[1-3]$)?/) && card.name.toLowerCase() === 'warren') {
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

  card.tribes = ['bird', 'canine', 'hooved', 'reptile', 'insect']
  if (card.tribes.length) {
    const tribes = card.tribes


    const hz = opts.b
    const aligns = [
      {g: 'northwest', t: `-11+8`},
      {g: 'north', t:`-6+8`},
      {g: 'northeast', t:`-15+8`},
      {g: 'center', t:`-${opts.a}+${opts.c}`},
      {g: 'center', t:`+${opts.b}+${opts.c}`},
    ]

    for (let i = 0; i < Math.min(tribes.length, 5); i++) {
      const tribe = tribes[i]
      const align = aligns[i]
     
      const tribePath = `./resource/tribes/${tribe}.png`
      execSync(`${im} ${out} \\( "${tribePath}" -resize 233% -gravity ${align.g} -alpha set -background none -channel A -evaluate multiply 0.4 +channel -geometry ${align.t} \\) -composite ${out}`) 


      // execSync(`${im} ${out} \\( "${tribePath}" -interpolate Nearest -filter point -resize 495.8248% -filter box -gravity south -geometry +${hz}+63 \\) -composite ${out}`)
    }
  }

  if (card.sigils) {
    const sigil = card.sigils[0]
    const sigilPath = `./resource/sigils/${sigil}.png`
    const hz = isTerrainCard(card) ? -70 : -2
    execSync(`${im} ${out} \\( "${sigilPath}" -interpolate Nearest -filter point -resize 495.8248% -filter box -gravity south -geometry +${hz}+63 \\) -composite ${out}`)
  }

  // apply text
  execSync(`${im} ${out} -font ${font} -fill black -pointsize 200 ${card.power !== undefined ? `-gravity southwest -annotate +64+104 "${card.power}"` : ''} -gravity southeast -annotate +${healthHorizontalOffset}+23 "${card.health}" -pointsize ${namePointSize} -gravity center -annotate +0-408 "${card.name}" ${out}`)

  const buffer = readFileSync('./out.png')
  unlinkSync('./out.png')

  return buffer
}
