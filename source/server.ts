import express from 'express'
import { Static, Union, Array, Record as RRecord, Literal, String, Number, Boolean, Record } from 'runtypes'
import { Card, Tribe, StatIcon, Temple, Sigil, Portrait } from './card'
import { convert as convertCardToJldr, createResourcesForCard, CreatureId, JldrCreature } from './jldrcard'
import { act1Resource, LeshyCardGenerator } from './generators/leshyCardGenerator'
import { P03CardGenerator  } from './generators/p03CardGenerator'
import { CardGenerator } from './generators/base'
import { act2Resource, GbcCardGenerator } from './generators/gbcCardGenerator'
import { InfluxDB, Point, WriteApi } from '@influxdata/influxdb-client'
import { hostname } from 'os'
import 'dotenv/config'
import { PixelProfilgateGenerator } from './generators/community/pixelProfligateGenerator'
import { ResourceError } from './resource'
import { mkdtempSync, rmSync, writeFileSync } from 'fs'
import { join } from 'path'
import { randomBytes } from 'crypto'
import { spawnSync } from 'child_process'

// influxdb
const token = process.env.INFLUX_TOKEN
const org = process.env.INFLUX_ORG
const bucket = process.env.INFLUX_BUCKET
const url = process.env.INFLUX_URL

let writeApi: WriteApi | undefined = undefined
if (!token || !org || !bucket || !url) {
  console.error('missing influxdb config, not sending metrics')
} else {
  const client = new InfluxDB({ url: url, token: token })
  writeApi = client.getWriteApi(org, bucket)
  writeApi.useDefaultTags({ host: hostname() })
}

type ApiCard = Static<typeof ApiCard>
const ApiCard = RRecord({
  name: String,
  health: Number,
  power: Number,
  staticon: StatIcon.optional(),
  tribes: Array(Tribe),
  bloodCost: Number,
  boneCost: Number,
  energyCost: Number,
  gemCost: RRecord({ orange: Boolean, green: Boolean, blue: Boolean }).optional(),
  sigils: Array(Sigil),
  decals: Array(Union(Literal('blood'), Literal('smoke'), Literal('paint'))),
  temple: Temple,
  terrain: Boolean,
  terrainLayout: Boolean,
  rare: Boolean,
  golden: Boolean,
  squid: Boolean,
  fused: Boolean,
  smoke: Boolean,
  enhanced: Boolean,
  redEmission: Boolean,
  blood: Boolean,
  paint: Boolean,
  hidePowerAndHealth: Boolean,
  portrait: Union(
    Record({
      type: Literal('custom'),
      data: Record({
        common: String.optional(),
        gbc: String.optional(),
        custom: String.optional(),
      })
    }),
    Record({
      type: Literal('deathcard'),
      data: Record({
        head: Union(Literal('chief'), Literal('enchantress'), Literal('gravedigger'), Literal('prospector'), Literal('robot'), Literal('settlerman'), Literal('settlerwoman'), Literal('wildling')),
        eyes: Number,
        mouth: Number,
        lostEye: Boolean,
      })
    }),
    Record({
      type: Literal('creature'),
      creature: CreatureId,
    })
  ).optional()
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
  gemCost: undefined,
  sigils: [],
  decals: [],
  temple: 'nature',
  terrain: false,
  terrainLayout: false,
  rare: false,
  golden: false,
  squid: false,
  fused: false,
  blood: false,
  paint: false,
  enhanced: false,
  redEmission: false,
  smoke: false,
  hidePowerAndHealth: false,
}

function convertApiDataToCard(input: ApiCard): Card {

  let cost: Card['cost']
  if (input.bloodCost > 0) {
    cost = { type: 'blood', amount: input.bloodCost }
  } else if (input.boneCost > 0) {
    cost = { type: 'bone', amount: input.boneCost }
  } else if (input.energyCost > 0) {
    cost = { type: 'energy', amount: input.energyCost }
  } else if (input.gemCost) {
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

    cost = { type: 'gem', gems: gems }
  }

  let portrait: Portrait | undefined = undefined
  if (input.portrait?.type === 'custom' && (input.portrait.data.common || input.portrait.data.gbc || input.portrait.data.custom)) {
    portrait = {
      type: 'custom',
      data: {
        common: input.portrait.data.common ? Buffer.from(input.portrait.data.common.replace(/data:image\/png;base64,/, ''), 'base64') : undefined,
        gbc: input.portrait.data.gbc ? Buffer.from(input.portrait.data.gbc.replace(/data:image\/png;base64,/, ''), 'base64') : undefined,
        custom: input.portrait.data.custom ? Buffer.from(input.portrait.data.custom.replace(/data:image\/png;base64,/, ''), 'base64') : undefined,
      }
    }
  } else if (input.portrait?.type === 'deathcard') {
    portrait = {
      type: 'deathcard',
      data: {
        headType: input.portrait.data.head,
        eyesIndex: input.portrait.data.eyes,
        mouthIndex: input.portrait.data.mouth,
        lostEye: input.portrait.data.lostEye,
      }
    }
  } else if (input.portrait?.type === 'creature') {
    portrait = {
      type: 'resource',
      resourceId: resourceIdFromCreatureId(input.portrait.creature),
    }
  }

  const card: Card = {
    name: input.name,
    health: input.health,
    power: input.power,
    sigils: input.sigils,
    temple: input.temple,
    statIcon: input.staticon,
    tribes: input.tribes,
    cost: cost,
    portrait: portrait,
    flags: {
      smoke: input.smoke,
      blood: input.blood,
      golden: input.golden,
      rare: input.rare,
      terrain: input.terrain,
      terrainLayout: input.terrainLayout,
      squid: input.squid,
      enhanced: input.enhanced,
      redEmission: input.redEmission,
      fused: input.fused,
      paint: input.paint,
      hidePowerAndHealth: input.hidePowerAndHealth,
    },
  }

  return card
}

const server = express()
server.use(express.json({ limit: 2 * 10e6 }))

server.options('/api/card/*/*', (_, reply) => {
  reply.header('Access-Control-Allow-Origin', '*')
    .header('Access-Control-Allow-Methods', 'POST, OPTIONS')
    .header('Access-Control-Allow-Headers', 'Origin, Content-Type')
    .send()
})

server.post(['/api/card/:id/front', '/api/card/:id/'], async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*')

  const actValidation = Union(Literal('leshy'), Literal('gbc'), Literal('p03'), Literal('pixelprofilgate')).validate(request.params.id)
  if (actValidation.success === false) {
    reply.status(404)
    reply.send({ error: 'Invalid act', invalid: request.params.id })
    return
  }
  const act = actValidation.value

  const border = request.query.border !== undefined
  const scanline = request.query.scanline !== undefined
  const locale = request.query.locale as string ?? 'en'

  const apiCardValidation = ApiCard.validate({ ...templateApiCard, ...request.body })
  if (apiCardValidation.success === false) {
    reply.status(400)
    reply.send({ error: 'Invalid properties', invalid: Object.keys(apiCardValidation.details ?? { '<SERVER ERROR>': '' }) })
    return
  }

  const card = convertApiDataToCard(apiCardValidation.value)
  const options = { border, scanlines: scanline, locale }

  const generatorFromAct = (act: 'leshy' | 'gbc' | 'p03' | 'pixelprofilgate'): CardGenerator => {
    switch (act) {
      case 'leshy': return new LeshyCardGenerator(options)
      case 'gbc': return new GbcCardGenerator(options)
      case 'p03': return new P03CardGenerator(options)
      case 'pixelprofilgate': return new PixelProfilgateGenerator(options)
    }
  }

  const point = new Point('generator')
    .tag('card-type', 'front')
    .tag('act', act)

  try {

    const generator: CardGenerator = generatorFromAct(act)

    const startGenerateDateTime = new Date()
    const buffer = await generator.generateFront(card)
    const endGenerateDateTime = new Date()

    const duration = (endGenerateDateTime.getTime() - startGenerateDateTime.getTime()) / 1000
    point.floatField('generation-time', duration)

    console.log('sent metrics at', endGenerateDateTime, 'and took', duration, 'seconds')

    reply.status(201)
    reply.type('image/png')
    reply.send(buffer)
  } catch (e: unknown) {
    point.booleanField('failed', true)

    reply.status(422)

    if (e instanceof ResourceError) {
      reply.send({ error: 'Unprocessable data', category: e.category, id: e.id })
    } else {
      reply.send({ error: 'Unprocessable data' })
    }
  }

  if (writeApi) {
    writeApi.writePoint(point)
    writeApi.flush()
  }
})

server.post('/api/card/:id/back', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*')

  const actValidation = Union(Literal('leshy'), Literal('gbc'), Literal('pixelprofilgate')).validate(request.params.id)
  if (actValidation.success === false) {
    reply.status(404)
    reply.send({ error: 'Invalid act', invalid: request.params.id })
    return
  }

  const act = actValidation.value
  const border = request.query.border !== undefined
  const scanline = request.query.scanline !== undefined

  const options = { border, scanlines: scanline }

  console.log(options)

  const generatorFromAct = (act: 'leshy' | 'gbc' | 'pixelprofilgate'): CardGenerator => {
    switch (act) {
      case 'leshy': return new LeshyCardGenerator(options)
      case 'gbc': return new GbcCardGenerator(options)
      case 'pixelprofilgate': return new PixelProfilgateGenerator(options)
    }
  }

  const point = new Point('generator')
    .tag('card-type', 'back')
    .tag('act', act)

  try {
    const generator: CardGenerator = generatorFromAct(act)

    const startGenerateDateTime = new Date()
    const buffer = await generator.generateBack()
    const endGenerateDateTime = new Date()

    const duration = (endGenerateDateTime.getTime() - startGenerateDateTime.getTime()) / 1000
    point.floatField('generation-time', duration)

    console.log('sent metrics at', endGenerateDateTime, 'and took', duration, 'seconds')

    reply.status(201)
    reply.type('image/png')
    reply.send(buffer)
  } catch (e: unknown) {
    point.booleanField('failed', true)

    reply.status(422)

    if (e instanceof ResourceError) {
      reply.send({ error: 'Unprocessable data', category: e.category, id: e.id })
    } else {
      reply.send({ error: 'Unprocessable data' })
    }
  }

  if (writeApi) {
    writeApi.writePoint(point)
    writeApi.flush()
  }
})

server.get('/api/card/:act/backs/:kind', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*')

  const actValidation = Union(Literal('leshy'), Literal('gbc'), Literal('pixelprofilgate')).validate(request.params.act)
  if (actValidation.success === false) {
    reply.status(404)
    reply.send({ error: 'Invalid act', invalid: request.params.act })
    return
  }

  const act = actValidation.value
  const border = request.query.border !== undefined
  const scanline = request.query.scanline !== undefined

  const options = { border, scanlines: scanline }

  console.log(options)
  const point = new Point('generator')
    .tag('card-type', 'back')
    .tag('act', act)

  try {

    const startGenerateDateTime = new Date()
    const buffer = await (() => {
      switch (act) {
        case 'leshy': {
          const kind = Union(Literal('common'), Literal('deathcard'), Literal('submerged'), Literal('squirrel'), Literal('bee'),).validate(request.params.kind)
          if (kind.success === false) {
            reply.status(422)
            reply.send({ error: 'Invalid kind', invalid: request.params.kind })
            return
          }
          return new LeshyCardGenerator(options).generateBack(kind.value)
        }
        case 'gbc': {
          const kind = Union(Literal('common'), Literal('submerged')).validate(request.params.kind)
          if (kind.success === false) {
            reply.status(422)
            reply.send({ error: 'Invalid kind', invalid: request.params.kind })
            return
          }
          return new GbcCardGenerator(options).generateBack(kind.value)
        }
        case 'pixelprofilgate': return new PixelProfilgateGenerator(options).generateBack()
      }
    })()
    const endGenerateDateTime = new Date()

    const duration = (endGenerateDateTime.getTime() - startGenerateDateTime.getTime()) / 1000
    point.floatField('generation-time', duration)

    console.log('sent metrics at', endGenerateDateTime, 'and took', duration, 'seconds')

    reply.status(201)
    reply.type('image/png')
    reply.send(buffer)
  } catch (e: unknown) {
    point.booleanField('failed', true)

    reply.status(422)

    if (e instanceof ResourceError) {
      reply.send({ error: 'Unprocessable data', category: e.category, id: e.id })
    } else {
      reply.send({ error: 'Unprocessable data' })
    }
  }

  if (writeApi) {
    writeApi.writePoint(point)
    writeApi.flush()
  }
})

server.get('/api/card/leshy/:a/:b', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*')

  const a = request.params.a
  const b = request.params.b
  const border = request.query.border !== undefined
  const scanline = request.query.scanline !== undefined

  const options = { border, scanlines: scanline }
  const generator = new LeshyCardGenerator(options)

  let buffer: Buffer

  const startGenerateDateTime = new Date()

  const point = new Point('generator')
    .tag('card-type', a)
    .tag('act', 'leshy')

  try {
    switch (a) {
      default: {
        reply.status(422)
        reply.send({ error: 'Invalid a', invalid: a })
        return
      }
      case 'rewards': {
        const bb = Union(Literal('1blood'), Literal('2blood'), Literal('3blood'), Literal('bones'), Literal('bird'), Literal('canine'), Literal('hooved'), Literal('insect'), Literal('reptile')).validate(b)
        if (!bb.success) {
          reply.status(422)
          reply.send({ error: 'Invalid b', invalid: b })
          return
        }

        buffer = await generator.generateReward(bb.value)
        break
      }
      case 'boons': {
        // 'doubledraw' | 'singlestartingbone' | 'startingbones' | 'startinggoat' | 'startingtrees' | 'tutordraw'
        const bb = Union(Literal('doubledraw'), Literal('singlestartingbone'), Literal('startingbones'), Literal('startinggoat'), Literal('startingtrees'), Literal('tutordraw')).validate(b)
        if (!bb.success) {
          reply.status(422)
          reply.send({ error: 'Invalid b', invalid: b })
          return
        }

        buffer = await generator.generateBoon(bb.value)
        break
      }
      case 'trials': {
        // 'abilities' | 'blood' | 'bones' | 'flying' | 'pelts' | 'power' | 'rare' | 'ring' | 'strafe' | 'submerge' | 'toughness' | 'tribes'
        const bb = Union(Literal('abilities'), Literal('blood'), Literal('bones'), Literal('flying'), Literal('pelts'), Literal('power'), Literal('rare'), Literal('ring'), Literal('strafe'), Literal('submerge'), Literal('toughness'), Literal('tribes')).validate(b)
        if (!bb.success) {
          reply.status(422)
          reply.send({ error: 'Invalid b', invalid: b })
          return
        }

        buffer = await generator.generateTrial(bb.value)
        break
      }
      case 'tarots': {
        // 'death' | 'devil' | 'empress' | 'fool' | 'tower'
        const bb = Union(Literal('death'), Literal('devil'), Literal('empress'), Literal('fool'), Literal('tower')).validate(b)
        if (!bb.success) {
          reply.status(422)
          reply.send({ error: 'Invalid b', invalid: b })
          return
        }

        buffer = await generator.generateTarot(bb.value)
        break
      }
    }

    const endGenerateDateTime = new Date()

    const duration = (endGenerateDateTime.getTime() - startGenerateDateTime.getTime()) / 1000
    point.floatField('generation-time', duration)

    console.log('sent metrics at', endGenerateDateTime, 'and took', duration, 'seconds')

    reply.status(201)
    reply.type('image/png')
    reply.send(buffer)
  } catch (e: unknown) {
    point.booleanField('failed', true)

    reply.status(422)

    if (e instanceof ResourceError) {
      reply.send({ error: 'Unprocessable data', category: e.category, id: e.id })
    } else {
      reply.send({ error: 'Unprocessable data' })
    }
  }

  if (writeApi) {
    writeApi.writePoint(point)
    writeApi.flush()
  }
})

server.get('/api/card/gbc/npcs/:npc', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*')

  const npc = request.params.npc
  const border = request.query.border !== undefined
  const scanline = request.query.scanline !== undefined

  const options = { border, scanlines: scanline }
  const generator = new GbcCardGenerator(options)

  const point = new Point('generator')
    .tag('card-type', 'npc')
    .tag('act', 'gbc')

  try {

    // 'angler' | 'bluewizard' | 'briar' | 'dredger' | 'dummy' | 'greenwizard' | 'inspector' | 'orangewizard' | 'royal' | 'sawyer' | 'melter' | 'trapper' | 'prospector'
    const nn = Union(Literal('angler'), Literal('bluewizard'), Literal('briar'), Literal('dredger'), Literal('dummy'), Literal('greenwizard'), Literal('inspector'), Literal('orangewizard'), Literal('royal'), Literal('sawyer'), Literal('melter'), Literal('trapper'), Literal('prospector')).validate(npc)
    if (!nn.success) {
      reply.status(422)
      reply.send({ error: 'Invalid npc', invalid: npc })
      return
    }

    const startGenerateDateTime = new Date()
    const buffer = await generator.generateNpc(nn.value)
    const endGenerateDateTime = new Date()

    const duration = (endGenerateDateTime.getTime() - startGenerateDateTime.getTime()) / 1000
    point.floatField('generation-time', duration)

    console.log('sent metrics at', endGenerateDateTime, 'and took', duration, 'seconds')

    reply.status(201)
    reply.type('image/png')
    reply.send(buffer)
  } catch (e: unknown) {
    point.booleanField('failed', true)

    reply.status(422)

    if (e instanceof ResourceError) {
      reply.send({ error: 'Unprocessable data', category: e.category, id: e.id })
    } else {
      reply.send({ error: 'Unprocessable data' })
    }
  }

  if (writeApi) {
    writeApi.writePoint(point)
    writeApi.flush()
  }
})

server.get('/api/card/pixelprofilgate/bosses/:boss', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*')

  const boss = request.params.boss
  const border = request.query.border !== undefined
  const scanline = request.query.scanline !== undefined

  const options = { border, scanlines: scanline }
  const generator = new PixelProfilgateGenerator(options)

  const point = new Point('generator')
    .tag('card-type', 'boss')
    .tag('act', 'pixelprofilgate')

  try {

    // 'angler' | 'goobert' | 'leshy' | 'lonely' | 'prospector' | 'trapper'
    const nn = Union(Literal('angler'), Literal('goobert'), Literal('leshy'), Literal('lonely'), Literal('prospector'), Literal('trapper')).validate(boss)
    if (!nn.success) {
      reply.status(422)
      reply.send({ error: 'Invalid boss', invalid: boss })
      return
    }

    const startGenerateDateTime = new Date()
    const buffer = await generator.generateBoss(nn.value)
    const endGenerateDateTime = new Date()

    const duration = (endGenerateDateTime.getTime() - startGenerateDateTime.getTime()) / 1000
    point.floatField('generation-time', duration)

    console.log('sent metrics at', endGenerateDateTime, 'and took', duration, 'seconds')

    reply.status(201)
    reply.type('image/png')
    reply.send(buffer)
  } catch (e: unknown) {
    point.booleanField('failed', true)

    reply.status(422)

    if (e instanceof ResourceError) {
      reply.send({ error: 'Unprocessable data', category: e.category, id: e.id })
    } else {
      reply.send({ error: 'Unprocessable data' })
    }
  }

  if (writeApi) {
    writeApi.writePoint(point)
    writeApi.flush()
  }
})

server.options('/api/jldr', (_, reply) => {
  reply.header('Access-Control-Allow-Origin', '*')
    .header('Access-Control-Allow-Methods', 'POST, OPTIONS')
    .header('Access-Control-Allow-Headers', 'Origin, Content-Type')
    .send()
})

server.post('/api/jldr', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*')

  const apiCardValidation = ApiCard.validate({ ...templateApiCard, ...request.body })
  if (apiCardValidation.success === false) {
    reply.status(400)
    reply.send({ error: 'Invalid properties', invalid: Object.keys(apiCardValidation.details ?? { '<SERVER ERROR>': '' }) })
    return
  }

  const card = convertApiDataToCard(apiCardValidation.value)

  if (card.portrait?.type === 'deathcard') {
    reply.status(501)
    reply.send({ error: 'Deathcard portraits not implemented', category: 'portrait' })
    return
  }

  const id = randomBytes(5).toString('hex')
  const modId = 'generator.cards'
  const tempPath = mkdtempSync(id)

  const jldr = convertCardToJldr(card, id) as Partial<JldrCreature> & { modPrefix: string, modId: string }
  jldr.modPrefix = modId
  jldr.name = modId + '_' + jldr.name
  writeFileSync(join(tempPath, id + '.jldr2'), JSON.stringify(jldr, undefined, 2))
  await createResourcesForCard(tempPath, card, id, act1Resource, act2Resource)
  const buffer = spawnSync('zip', ['-r', '-', tempPath]).stdout
  rmSync(tempPath, { recursive: true, force: true })

  reply
    .status(201)
    .contentType('application/zip')
    .header('Content-Disposition', 'attachment; filename="' + id + '.zip"')
    .header('Content-Length', buffer.length.toString())
    .end(buffer)
})

server.get('/', (_, reply) => reply.status(200).send('OK\n'))
server.listen(8080, () => console.log('server running at http://localhost:8080'))

function resourceIdFromCreatureId(creatureId: CreatureId): string {
  switch (creatureId) {
    // act 1
    case 'Adder': return 'adder'
    case 'Alpha': return 'alpha'
    case 'Amalgam': return 'amalgam'
    case 'Amoeba': return 'amoeba'
    case 'Ant': return 'ant'
    case 'AntQueen': return 'antqueen'
    case 'Bat': return 'bat'
    case 'Beaver': return 'beaver'
    case 'Bee': return 'bee'
    case 'Beehive': return 'beehive'
    case 'Bloodhound': return 'bloodhound'
    case 'Boulder': return 'boulder'
    case 'Bullfrog': return 'bullfrog'
    case 'CagedWolf': return 'cagedwolf'
    case 'Cat': return 'cat'
    case 'CatUndead': return 'cat_undead'
    case 'Cockroach': return 'cockroach'
    case 'Coyote': return 'coyote'
    case 'Daus': return 'daus'
    case 'Elk': return 'deer'
    case 'ElkCub': return 'deercub'
    case 'FieldMouse': return 'fieldmice'
    case 'Geck': return 'geck'
    case 'Goat': return 'goat'
    case 'Grizzly': return 'grizzly'
    case 'JerseyDevil': return 'jerseydevil'
    case 'Kingfisher': return 'kingfisher'
    case 'Maggots': return 'maggots'
    case 'Magpie': return 'magpie'
    case 'Mantis': return 'mantis'
    case 'MantisGod': return 'mantisgod'
    case 'Mole': return 'mole'
    case 'MoleMan': return 'moleman'
    case 'Moose': return 'moose'
    case 'Mothman_Stage1': return 'mothman_1'
    case 'Mothman_Stage2': return 'mothman_2'
    case 'Mothman_Stage3': return 'mothman_3'
    case 'Mule': return 'mule'
    case 'Opossum': return 'opossum'
    case 'Otter': return 'otter'
    case 'Ouroboros': return 'ouroboros'
    case 'PackRat': return 'packrat'
    case 'Porcupine': return 'porcupine'
    case 'Pronghorn': return 'pronghorn'
    case 'Rabbit': return 'rabbit'
    case 'RatKing': return 'ratking'
    case 'Rattler': return 'rattler'
    case 'Raven': return 'raven'
    case 'RavenEgg': return 'ravenegg'
    case 'Shark': return 'shark'
    case 'Skink': return 'skink'
    case 'SkinkTail': return 'skink_tail'
    case 'Skunk': return 'skunk'
    case 'Snapper': return 'turtle'
    case 'Sparrow': return 'sparrow'
    case 'SquidBell': return 'squidbell'
    case 'SquidCards': return 'squidcards'
    case 'SquidMirror': return 'squidmirror'
    case 'Squirrel': return 'squirrel'
    case 'Tail_Bird': return 'bird_tail'
    case 'Tail_Furry': return 'canine_tail'
    case 'Tail_Insect': return 'insect_tail'
    case 'Urayuli': return 'urayuli'
    case 'Vulture': return 'vulture'
    case 'Warren': return 'warren'
    case 'Wolf': return 'wolf'
    case 'WolfCub': return 'wolfcub'
    case 'BaitBucket': return 'baitbucket'
    case 'Dam': return 'dam'
    case 'DausBell': return 'dausbell'
    case 'GoldNugget': return 'goldnugget'
    case 'PeltGolden': return 'pelt_golden'
    case 'PeltHare': return 'pelt_hare'
    case 'PeltWolf': return 'pelt_wolf'
    case 'RingWorm': return 'ringworm'
    case 'Smoke': return 'smoke'
    case 'Smoke_Improved': return 'smoke_improved'
    case 'Smoke_NoBones': return 'smoke'
    case 'Starvation': return 'starvingman'
    case 'Stinkbug_Talking': return 'stinkbug_talking'
    case 'Stoat_Talking': return 'stoat_talking'
    case 'Trap': return 'trap'
    case 'TrapFrog': return 'trapfrog'
    case 'Wolf_Talking': return 'wolf_talking'
    case 'FrozenOpossum': return 'frozen_opossum'
    case 'Tree_SnowCovered': return 'tree_snowcovered'
    case 'Tree': return 'tree'
    case 'Stump': return 'stump'

    // act 2
    case 'Skeleton': return 'skeleton'
    case 'Banshee': return 'banshee'
    case 'Bonehound': return 'bonehound'
    case 'FrankNStein': return 'franknstein'
    case 'Gravedigger': return 'gravedigger'
    case 'Revenant': return 'revenant'
  }

  return creatureId
}
