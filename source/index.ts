import { execSync } from 'child_process'
import fastify from 'fastify'
import { existsSync, readFileSync, unlink, unlinkSync } from 'fs'
import { Card } from './cards'

const server = fastify()

server.get('/card', async (request, reply) => {

  const q = (request.query as any)
  const name = q.name ?? ''
  const power = q.power ? Number(q.power) : undefined
  const health = Number(q.health ?? 1)

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
    sigils: [],
    type: cardType,
    enhanced: false,
    portrait: ((s: unknown): string | undefined => (typeof s === 'string') ? s : undefined)(q.portrait),
  }

  const opts = {
    a: Number(q.a),
    b: Number(q.b),
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

  const l = card.name.length
  const namePointSize = (l > 13) ? 90 : (l > 11 ? 100 : 120)
  const healthHorizontalOffset = card.type === 'terrain' ? 140 : 60


  // create low-res card
  execSync(`${im} "./resource/cards/${card.type}.png" -filter Box ${out}`)

  // portrait
  if (!!card.portrait) {

    const a = `./resource/creatures/${card.portrait}.png`
    const b = `./resource/creatures/emission/${card.portrait}.png`

    if (existsSync(a)) {
      const imageOffset = '+0-15'

      execSync(`${im} ${out} \\( "${a}" -gravity center -geometry ${imageOffset} \\) -composite ${out}`)
      if (card.enhanced && existsSync(b)) {
        execSync(`${im} ${out} \\( "${b}" -gravity center -geometry ${imageOffset} \\) -composite ${out}`)
      }
    }
  }

  // scale card
  const scale = '538.94%'
  execSync(`${im} ${out} -filter Box -scale ${scale} ${out}`)

  // apply text
  execSync(`${im} ${out} -font ${font} -fill black -pointsize 200 ${card.power !== undefined ? `-gravity southwest -annotate +64+104 "${card.power}"` : ''} -gravity southeast -annotate +${healthHorizontalOffset}+23 "${card.health}" -pointsize ${namePointSize} -gravity center -annotate +0-408 "${card.name}" ${out}`)

  const buffer = readFileSync('./out.png')
  unlinkSync('./out.png')

  return buffer
}
