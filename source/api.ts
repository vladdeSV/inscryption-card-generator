import fastify from 'fastify'
import { readFileSync } from 'fs'
import { presets as cardPresets } from '.'
import { cardBackFromData, cardFromData } from './act1/helpers'
import { Card, CardBack, CardBackType } from './act1/types'
import { LeshyCardGenerator } from './generators/leshyCardGenerator'
const translations = JSON.parse(readFileSync('./translations.json', 'utf-8'))

const server = fastify()

server.get('/act1/:creature', async (request, reply) => {
  const creatureId = request.url.match(/\/act1\/(\w+)/)?.[1] ?? ''
  const card = cardPresets[creatureId]

  if (card === undefined) {
    reply.code(404)
    reply.send(`Unknown id '${creatureId}'`)
    return
  }

  card.name = translations['en'][card.name!]
  const leshyCardGenerator = new LeshyCardGenerator()
  const buffer = leshyCardGenerator.generate(card)

  reply.type('image/png')
  reply.header('Content-Disposition', `inline; filename="${(card.name || 'creature').replace(/\s/g, '_')}.png"`)
  reply.send(buffer)
})

server.get('/act1/backs/:type', async (request, reply) => {
  const type = request.url.match(/\/act1\/backs\/(\w+)/)?.[1]

  if (!CardBackType.guard(type)) {
    reply.code(404)
    reply.send(`Unknown back type '${type}'`)
    return
  }

  const cardBack = cardBackFromData({ type })
  const leshyCardGenerator = new LeshyCardGenerator()
  const buffer = leshyCardGenerator.generateBack(cardBack.type)

  reply.type('image/png')
  reply.header('Content-Disposition', `inline; filename="back_${(cardBack.type)}.png"`)
  reply.send(buffer)
})

server.put('/act1/', async (request, reply) => {
  let card: Card
  try {
    card = cardFromData(request.body)
  } catch (e: any) {
    reply.code(422)
    reply.send('Error parsing input data')
    return
  }

  const leshyCardGenerator = new LeshyCardGenerator()
  const buffer = leshyCardGenerator.generate(card)
  if (!buffer) {
    reply.code(500)
    reply.send('Unknown error occured when creating image')
    return
  }

  reply.type('image/png')
  reply.header('Content-Disposition', `inline; filename="${(card.name ?? 'creature').replace(/\s/g, '_')}.png"`)
  reply.send(buffer)
})

server.put('/act1/backs/', async (request, reply) => {
  let cardBack: CardBack
  try {
    cardBack = cardBackFromData(request.body)
  } catch (e: any) {
    reply.code(422)
    reply.send('Error parsing input data')
    return
  }

  const leshyCardGenerator = new LeshyCardGenerator()
  const buffer = leshyCardGenerator.generateBack(cardBack.type)
  if (!buffer) {
    reply.code(500)
    reply.send('Unknown error occured when creating image')
    return
  }

  reply.type('image/png')
  reply.header('Content-Disposition', `inline; filename="back_${cardBack.type}.png"`)
  reply.send(buffer)
})

server.listen(8080, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
