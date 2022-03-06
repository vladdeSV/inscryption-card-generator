import fastify from 'fastify'
import { Optional } from 'runtypes'
import { Card } from './card'
import { generateAct1Card } from './fns/generateAct1Card'
import { res, res2 } from './temp'
import { Partial } from 'runtypes'
import { generateAct2Card } from './fns/generateAct2Card'

const server = fastify()

server.get('/', async () => 'default :)\n')
server.get('/ping', async (request, reply) => 'pong\n')
server.post('/act1/', async (request, reply) => {
  console.log('request', request.ip)

  const base = Card.check({
    name: '',
    type: 'common',
    cost: undefined,
    power: 0,
    health: 0,
    sigils: [],
    tribes: [],
    temple: 'nature',
    decals: [],
    flags: { enhanced: false, fused: false, golden: false, squid: false, terrain: false, hidePower: false, hideHealth: false },
    meta: { rare: false, terrain: false }
  })

  const body = request.body
  if (typeof body !== 'object') {
    throw new Error()
  }

  const data = generateAct1Card({ ...base, ...body }, res)

  reply.type('image/png')
  reply.code(201)

  return data
})
server.post('/act2/', async (request, reply) => {
  console.log('request', request.ip)

  const base = Card.check({
    name: '',
    type: 'common',
    cost: undefined,
    power: 0,
    health: 0,
    sigils: [],
    tribes: [],
    temple: 'nature',
    decals: [],
    flags: { enhanced: false, fused: false, golden: false, squid: false, terrain: false, hidePower: false, hideHealth: false },
    meta: { rare: false, terrain: false }
  })

  const body = request.body
  if (typeof body !== 'object') {
    throw new Error()
  }

  const data = generateAct2Card({ ...base, ...body }, res2)

  reply.type('image/png')
  reply.code(201)

  return data
})

server.listen(8081, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
