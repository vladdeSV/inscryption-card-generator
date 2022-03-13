// -> 201 default
// -> 400
// -> 422

import fastify from 'fastify'
import { Static, Union, Array, Record as RRecord, Literal, String, Number, Boolean } from 'runtypes'
import { generateAct1Card } from './fns/generateAct1Card'
import { Card, Tribe, StatIcon, Temple, Sigil, } from './card'
import { res, res2 } from './temp'
import { generateAct2Card } from './fns/generateAct2Card'

type ApiCard = Static<typeof ApiCard>
const ApiCard = RRecord({
  name: String,
  health: Number, // 0 - 9999
  power: Number, // 0 - 9999
  staticon: StatIcon.optional(),
  tribes: Array(Tribe), // Tribe[], max length 5
  bloodCost: Number, // 0 - 4
  boneCost: Number, // 0 - 13, 0 - 10
  energyCost: Number, // 0 - 6
  gemCost: RRecord({ orange: Boolean, green: Boolean, blue: Boolean }),
  sigils: Array(Sigil),
  decals: Array(Union(Literal('blood'), Literal('smoke'), Literal('paint'))),
  temple: Temple,
  terrain: Boolean,
  terrainLayout: Boolean,
  rare: Boolean,
  golden: Boolean,
  squid: Boolean,
  fused: Boolean,
})

// act: Union(Literal('leshy'), Literal('gbc')),
const Meta = RRecord({
  locale: String.optional(),
  border: String.optional(),
  scanline: String.optional(),
})

const templateApiCard: ApiCard = {
  name: '',
  health: 1,
  power: 0,
  staticon: undefined,
  tribes: [],
  bloodCost: 0,
  boneCost: 0,
  energyCost: 0,
  gemCost: { orange: false, green: false, blue: false },
  sigils: [],
  decals: [],
  temple: 'nature',
  terrain: false,
  terrainLayout: false,
  rare: false,
  golden: false,
  squid: false,
  fused: false,
}

const server = fastify()

function assertIsObject(obj: unknown): asserts obj is Record<string, unknown> {
  const isObj = typeof obj === 'object' && !!obj
  if (!isObj) {
    throw 'wtf'
  }
}

function convertApiDataToCard(input: ApiCard): Card {

  let cost: Card['cost']
  if (input.bloodCost > 0) {
    cost = { type: 'blood', amount: input.bloodCost }
  } else if (input.boneCost > 0) {
    cost = { type: 'bone', amount: input.boneCost }
  } else if (input.energyCost > 0) {
    cost = { type: 'energy', amount: input.energyCost }
  } else {
    const gems: ('orange' | 'green' | 'blue')[] = []

    if (input.gemCost.orange) {
      gems.push('orange' as const)
    }
    if (input.gemCost.green) {
      gems.push('green' as const)
    }
    if (input.gemCost.blue) {
      gems.push('blue' as const)
    }

    if (gems.length) {
      cost = { type: 'gem', gems: gems }
    }
  }

  let type: Card['type'] = 'common'
  if (input.terrain) {
    type = 'terrain'
  }
  if (input.rare) {
    type = 'rare'
  }

  const card: Card = {
    type: type,
    name: input.name,
    health: input.health,
    power: input.power,
    sigils: input.sigils,
    temple: input.temple,
    statIcon: input.staticon,
    tribes: input.tribes,
    decals: input.decals,
    cost: cost,
    meta: {
      terrain: input.terrain,
      rare: input.rare,
    },
    flags: {
      enhanced: false,
      golden: input.golden,
      fused: input.fused,
      squid: input.squid,
      terrain: input.terrainLayout,
      hideHealth: false,
      hidePower: false,
    },
  }

  return card
}

server.options('/api/card/*/', (_, reply) => {
  reply.header('Access-Control-Allow-Origin', '*')
  reply.header('Access-Control-Allow-Methods', 'POST, OPTIONS')
  reply.header('Access-Control-Allow-Headers', 'Origin, Content-Type')
  reply.send()
})

// request.params :act
// request.query ?foo&bar
server.post('/api/card/:act/', (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*')

  const { params, query, body } = request

  let query2
  try {
    assertIsObject(params)
    assertIsObject(body)
    query2 = Meta.check(query)
  } catch (e: unknown) {
    reply.status(500).send({ error: 'Could not parse data', message: e })
    return
  }

  const act = params?.act
  if (!(act === 'leshy' as const || act === 'gbc' as const)) {
    reply.status(422).send({ error: `Invalid path '${act ?? '<empty>'}'` })
    return
  }

  let foo
  try {
    foo = convertApiDataToCard(ApiCard.check({ ...templateApiCard, ...body }))
  } catch (e: unknown) {
    reply.status(400).send(JSON.stringify({ error: 'Invalid input' }))
    return
  }

  const data = ((act) => {
    if (act === 'leshy') {
      return generateAct1Card(foo, res, { border: !!query2.border, locale: query2.locale ?? 'en' })
    } else {
      return generateAct2Card(foo, res2, { border: query2.border !== undefined, scanlines: query2.scanline !== undefined })
    }
  })(act)

  reply
    .status(201)
    .type('image/png')
    .send(data)
})

server.get('/', (request, reply) => {
  reply.status(200).send('OK')
})
server.listen(8080, (err, address) => {
  if (err) {
    0
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
