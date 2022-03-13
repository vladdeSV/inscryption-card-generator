import fastify, { FastifyRequest } from 'fastify'
import { Card } from './card'
import { generateAct1Card } from './fns/generateAct1Card'
import { res, res2 } from './temp'
import { generateAct2Card } from './fns/generateAct2Card'

const server = fastify()
const base: Card = {
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
}

server.get('/', async () => 'default :)\n')
server.get('/ping', async (request, reply) => 'pong\n')
server.options('/act1/', async (req, reply) => {
  console.log(req.params)

  reply.header('Access-Control-Allow-Origin', '*')
  reply.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
  reply.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token')
  reply.send()
})
server.options('/act2/', async (req, reply) => {
  reply.header('Access-Control-Allow-Origin', '*')
  reply.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
  reply.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token')
  reply.send()
})

server.post('/act1/', async (request, reply) => {
  console.log('request from ', request.ip)

  const body = request.body
  if (typeof body !== 'object') {
    throw new Error()
  }

  if (typeof (body as any)?.portrait?.data?.common === 'string') {
    (body as any).portrait.data.common = Buffer.from((body as any).portrait.data.common, 'base64')
  }

  const border = !!((body as any)?.border ?? false)
  const locale = ((body as any)?.locale ?? 'en')

  const data = generateAct1Card({ ...base, ...body }, res, { border, locale })

  reply.header('Access-Control-Allow-Origin', '*')
  reply.type('image/png')
  reply.code(201)

  return data
})
server.post('/act2/', async (request, reply) => {
  console.log('request from ', request.ip)

  const body = request.body
  if (typeof body !== 'object') {
    throw new Error()
  }

  if (typeof (body as any)?.portrait?.data?.gbc === 'string') {
    (body as any).portrait.data.gbc = Buffer.from((body as any).portrait.data.gbc, 'base64')
  }
  const border = !!((body as any)?.border ?? false)
  const data = generateAct2Card({ ...base, ...body }, res2, { border })

  reply.type('image/png')
  reply.header('Access-Control-Allow-Origin', '*')
  reply.code(201)

  return data
})

server.listen(8081, (err, address) => {
  if (err) {
    0
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
