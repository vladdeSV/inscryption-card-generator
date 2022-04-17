// -> 201 default
// -> 400
// -> 422

import express from 'express'
import { Static, Union, Array, Record as RRecord, Literal, String, Number, Boolean, Record } from 'runtypes'
import { Card, Tribe, StatIcon, Temple, Sigil, Portrait, CreatureId as CardCreatureId } from './card'
import { CreatureId } from './jldrcard'
import { res2 } from './temp'
// import { generateAct2Card } from './fns/generateAct2Card'
import { LeshyCardGenerator } from './generators/leshyCardGenerator'
import { CardGenerator } from './generators/base'
import { GbcCardGenerator } from './generators/gbcCardGenerator'
import { InfluxDB, Point } from '@influxdata/influxdb-client'
import { hostname } from 'os'
import * as dotenv from 'dotenv'

dotenv.config()

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

  let portrait: Portrait | undefined = undefined
  if (input.portrait?.type === 'custom' && (input.portrait.data.common || input.portrait.data.gbc)) {
    portrait = {
      type: 'custom',
      data: {
        common: input.portrait.data.common ? Buffer.from(input.portrait.data.common.replace(/data:image\/png;base64,/, ''), 'base64') : undefined,
        gbc: input.portrait.data.gbc ? Buffer.from(input.portrait.data.gbc.replace(/data:image\/png;base64,/, ''), 'base64') : undefined,
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

  const actValidation = Union(Literal('leshy'), Literal('gbc')).validate(request.params.id)
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

  const generatorFromAct = (act: 'leshy' | 'gbc'): CardGenerator => {
    switch (act) {
      case 'leshy': return new LeshyCardGenerator(options)
      case 'gbc': return new GbcCardGenerator(res2, options)
    }
  }

  const generator: CardGenerator = generatorFromAct(act)

  // You can generate an API token from the "API Tokens Tab" in the UI

  const writeApi = client.getWriteApi(org, bucket)
  writeApi.useDefaultTags({host: hostname(), ip: request.ip})

  try {
    const date1 = new Date()
    const buffer = await generator.generateFront(card)
    const date2 = new Date()

    const duration = (date2.getTime() - date1.getTime()) / 1000
    writeApi.writePoint(new Point('generator').floatField('generation-time', duration))
    await writeApi.close()
    console.log('sent metrics at', date2, ' and took', duration, 'seconds')

    reply.status(201)
    reply.type('image/png')
    reply.send(buffer)
  } catch (e) {
    writeApi.writePoint(new Point('generator').booleanField('failed', true))
    await writeApi.close()
    console.log('sent metrics');
    reply.status(422)
    reply.send({ error: 'Unprocessable data', message: e })
  }
})

server.post('/api/card/:id/back', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*')

  const actValidation = Union(Literal('leshy'), Literal('gbc')).validate(request.params.id)
  if (actValidation.success === false) {
    reply.status(404)
    reply.send({ error: 'Invalid act', invalid: request.params.id })
    return
  }
  const act = actValidation.value

  const border = request.query.border !== undefined
  const scanline = request.query.scanline !== undefined
  const locale = request.query.locale as string ?? 'en'

  const options = { border, scanlines: scanline, locale }

  const generatorFromAct = (act: 'leshy' | 'gbc'): CardGenerator => {
    switch (act) {
      case 'leshy': return new LeshyCardGenerator(options)
      case 'gbc': return new GbcCardGenerator(res2, options)
    }
  }

  const generator: CardGenerator = generatorFromAct(act)

  try {
    const buffer = await generator.generateBack()
    reply.status(201)
    reply.type('image/png')
    reply.send(buffer)

    return
  } catch (e) {
    reply.status(422)
    reply.send({ error: 'Unprocessable data', message: e })

    return
  }
})

server.get('/', (_, reply) => reply.status(200).send('OK'))
server.listen(8080, () => console.log('Server running'))

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
