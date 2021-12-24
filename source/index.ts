import fastify from 'fastify'
import { writeFileSync } from 'fs';
import { bufferFromCard, bufferFromCardBack, cardBackFromData, cardFromData } from './act1/helpers';
import { Card, CardBack, CardBackType } from './act1/types';

const presets: { [s: string]: Card } = {
  // "mini_moon": { type: "common", name: "mini moon", power: 1, health: 9,  sigils: ["allstrike", "squirrelorbit", "reach"], portrait: "moon",  },
  "adder": { cardtype: "common", name: "adder", power: 1, health: 1, tribes: ["reptile"], sigils: ["deathtouch"], cost: { amount: 2, type: "blood" }, portrait: "adder" },
  "alpha": { cardtype: "common", name: "alpha", power: 1, health: 2, tribes: ["canine"], sigils: ["buffneighbours"], cost: { amount: 5, type: "bone" }, portrait: "alpha" },
  "amalgam": { cardtype: "rare", name: "amalgam", power: 3, health: 3, tribes: ["bird", "canine", "hooved", "reptile", "insect"], cost: { amount: 2, type: "blood" }, portrait: "amalgam" },
  "ant_queen": { cardtype: "common", name: 'ant queen', power: 'ants', health: 3, cost: { amount: 2, type: 'blood' }, portrait: 'antqueen', tribes: ['insect'], sigils: ['drawant'] },
  "amoeba": { cardtype: "rare", name: "amoeba", power: 1, health: 2, sigils: ["randomability"], cost: { amount: 2, type: "bone" }, portrait: "amoeba" },
  "bait_bucket": { cardtype: "terrain", name: "bait bucket", portrait: 'baitbucket', health: 1, decals: ['blood'], options: { isTerrain: true } },
  "bat": { cardtype: "common", name: "bat", power: 2, health: 1, sigils: ["flying"], cost: { amount: 4, type: "bone" }, portrait: "bat" },
  "beaver": { cardtype: "common", name: "beaver", power: 1, health: 3, sigils: ["createdams"], cost: { amount: 2, type: "blood" }, portrait: "beaver" },
  "bee": { cardtype: "common", name: "bee", power: 1, health: 1, tribes: ["insect"], sigils: ["flying"], portrait: "bee" },
  "beehive": { cardtype: "common", name: "beehive", power: 0, health: 2, tribes: ["insect"], sigils: ["beesonhit"], cost: { amount: 1, type: "blood" }, portrait: "beehive" },
  "black_goat": { cardtype: "common", name: "black goat", power: 0, health: 1, tribes: ["hooved"], sigils: ["tripleblood"], cost: { amount: 1, type: "blood" }, portrait: "goat" },
  "bloodhound": { cardtype: "common", name: "bloodhound", power: 2, health: 3, tribes: ["canine"], sigils: ["guarddog"], cost: { amount: 2, type: "blood" }, portrait: "bloodhound" },
  "boulder": { cardtype: "terrain", name: "boulder", portrait: "boulder", health: 5, options: { isTerrain: true } },
  "bullfrog": { cardtype: "common", name: "bullfrog", power: 1, health: 2, tribes: ["reptile"], sigils: ["reach"], cost: { amount: 1, type: "blood" }, portrait: "bullfrog" },
  "caged_wolf": { cardtype: "terrain", name: "caged wolf", portrait: 'cagedwolf', cost: { type: 'blood', amount: 2 }, health: 6, tribes: ['canine'], options: { isTerrain: true } },
  "cat": { cardtype: "common", name: "cat", power: 0, health: 1, sigils: ["sacrificial"], cost: { amount: 1, type: "blood" }, portrait: "cat" },
  "child_13": { cardtype: "rare", name: "child 13", power: 0, health: 1, tribes: ["hooved"], sigils: ["sacrificial"], cost: { amount: 1, type: "blood" }, portrait: "jerseydevil_sleeping" },
  "child_13_awake": { cardtype: "rare", name: "child 13", power: 2, health: 1, tribes: ["hooved"], sigils: ["flying", "sacrificial"], cost: { amount: 1, type: "blood" }, portrait: "jerseydevil" },
  "chime": { cardtype: "terrain", name: "chime", portrait: "dausbell", health: 1, options: { isTerrain: true } },
  "cockroach": { cardtype: "common", name: "cockroach", power: 1, health: 1, tribes: ["insect"], sigils: ["drawcopyondeath"], cost: { amount: 4, type: "bone" }, portrait: "cockroach" },
  "corpse_maggots": { cardtype: "common", name: "corpse maggots", power: 1, health: 2, tribes: ["insect"], sigils: ["corpseeater"], cost: { amount: 5, type: "bone" }, portrait: "maggots" },
  "coyote": { cardtype: "common", name: "coyote", power: 2, health: 1, tribes: ["canine"], cost: { amount: 4, type: "bone" }, portrait: "coyote" },
  "dam": { cardtype: "terrain", name: "dam", portrait: "dam", health: 2, options: { isTerrain: true } },
  "elk_fawn": { cardtype: "common", name: "elk fawn", power: 1, health: 1, tribes: ["hooved"], sigils: ["evolve_1", "strafe"], cost: { amount: 1, type: "blood" }, portrait: "deercub" },
  "elk": { cardtype: "common", name: "elk", power: 2, health: 4, tribes: ["hooved"], sigils: ["strafe"], cost: { amount: 2, type: "blood" }, portrait: "deer" },
  "field_mice": { cardtype: "common", name: "field mice", power: 2, health: 2, sigils: ["drawcopy"], cost: { amount: 2, type: "blood" }, portrait: "fieldmice" },
  "frozen_opossum": { cardtype: "terrain", name: "frozen opossum", portrait: 'frozen_opossum', power: 0, health: 5, sigils: ['icecube'] },
  "geck": { cardtype: "rare", name: "geck", power: 1, health: 1, tribes: ["reptile"], portrait: "geck" },
  "grand_fir": { cardtype: "terrain", name: "grand fir", portrait: "tree", health: 3, sigils: ["reach"], options: { isTerrain: true } },
  "great_white": { cardtype: "common", name: "great white", power: 4, health: 2, sigils: ["submerge"], cost: { amount: 3, type: "blood" }, portrait: "shark", decals: ['blood'] },
  "grizzly": { cardtype: "common", name: "grizzly", power: 4, health: 6, cost: { amount: 3, type: "blood" }, portrait: "grizzly" },
  "kingfisher": { cardtype: "common", name: "kingfisher", power: 1, health: 1, tribes: ["bird"], sigils: ["submerge", "flying"], cost: { amount: 1, type: "blood" }, portrait: "kingfisher" },
  "leaping_trap": { cardtype: "terrain", name: "leaping trap", portrait: 'trap', health: 1, sigils: ['steeltrap', 'reach'], options: { isTerrain: true } },
  "long_elk": { cardtype: 'rare', name: 'long_elk', power: 1, health: 2, tribes: ['hooved'], sigils: ['deathtouch', 'strafe'], cost: { amount: 4, type: 'bone' } },
  "magpie": { cardtype: "common", name: "magpie", power: 1, health: 1, tribes: ["bird"], sigils: ["tutor", "flying"], cost: { amount: 2, type: "blood" }, portrait: "magpie" },
  "mantis_god": { cardtype: "rare", name: "mantis god", power: 1, health: 1, tribes: ["insect"], sigils: ["tristrike"], cost: { amount: 1, type: "blood" }, portrait: "mantisgod" },
  "mantis": { cardtype: "common", name: "mantis", power: 1, health: 1, tribes: ["insect"], sigils: ["splitstrike"], cost: { amount: 1, type: "blood" }, portrait: "mantis" },
  "mole_man": { cardtype: "rare", name: "mole man", power: 0, health: 6, sigils: ["reach", "whackamole"], cost: { amount: 1, type: "blood" }, portrait: "moleman" },
  "mole": { cardtype: "common", name: "mole", power: 0, health: 4, sigils: ["whackamole"], cost: { amount: 1, type: "blood" }, portrait: "mole" },
  "moose_buck": { cardtype: "common", name: "moose buck", power: 3, health: 7, tribes: ["hooved"], sigils: ["strafepush"], cost: { amount: 3, type: "blood" }, portrait: "moose" },
  "mothman": { cardtype: "rare", name: "mothman", power: 7, health: 3, tribes: ["insect"], sigils: ["flying"], cost: { amount: 1, type: "blood" }, portrait: "mothman_3" },
  "opossum": { cardtype: "common", name: "opossum", power: 1, health: 1, cost: { amount: 2, type: "bone" }, portrait: "opossum" },
  "ouroboros": { cardtype: "rare", name: "ouroboros", tribes: ["reptile"], sigils: ["drawcopyondeath"], cost: { amount: 2, type: "blood" }, portrait: "ouroboros" },
  "pack_mule": { cardtype: "common", name: "pack mule", power: 0, health: 5, sigils: ['strafe'], tribes: ['hooved'], portrait: "mule" },
  "pack_rat": { cardtype: "rare", name: "pack rat", power: 2, health: 2, sigils: ["randomconsumable"], cost: { amount: 2, type: "blood" }, portrait: "packrat" },
  "porcupine": { cardtype: "common", name: "porcupine", power: 1, health: 2, sigils: ["sharp"], cost: { amount: 1, type: "blood" }, portrait: "porcupine" },
  "pronghorn": { cardtype: "common", name: "pronghorn", power: 1, health: 3, tribes: ["hooved"], sigils: ["splitstrike", "strafe"], cost: { amount: 2, type: "blood" }, portrait: "pronghorn" },
  "rabbit_pelt": { cardtype: "terrain", name: "rabbit pelt", health: 1, portrait: "pelt_hare", options: { isTerrain: true } },
  "rabbit": { cardtype: "common", name: "rabbit", power: 0, health: 1, portrait: "rabbit" },
  "rat_king": { cardtype: "common", name: "rat king", power: 2, health: 1, sigils: ["quadruplebones"], cost: { amount: 2, type: "blood" }, portrait: "ratking" },
  "rattler": { cardtype: "common", name: "rattler", power: 3, health: 1, tribes: ["reptile"], cost: { amount: 6, type: "bone" }, portrait: "rattler" },
  "raven_egg": { cardtype: "common", name: "raven egg", power: 0, health: 2, tribes: ["bird"], sigils: ["evolve_1"], cost: { amount: 1, type: "blood" }, portrait: "ravenegg" },
  "raven": { cardtype: "common", name: "raven", power: 2, health: 3, tribes: ["bird"], sigils: ["flying"], cost: { amount: 2, type: "blood" }, portrait: "raven" },
  "ring_worm": { cardtype: "common", name: "ring worm", power: 0, health: 1, tribes: ["insect"], cost: { amount: 1, type: "blood" }, portrait: "ringworm" },
  "river_otter": { cardtype: "common", name: "river otter", power: 1, health: 1, sigils: ["submerge"], cost: { amount: 1, type: "blood" }, portrait: "otter" },
  "river_snapper": { cardtype: "common", name: "river snapper", power: 1, health: 6, tribes: ["reptile"], cost: { amount: 2, type: "blood" }, portrait: "turtle" },
  "skink": { cardtype: "common", name: "skink", power: 1, health: 2, tribes: ["reptile"], sigils: ["tailonhit"], cost: { amount: 1, type: "blood" }, portrait: "skink" },
  "skunk": { cardtype: "common", name: "skunk", power: 0, health: 3, sigils: ["debuffenemy"], cost: { amount: 1, type: "blood" }, portrait: "skunk" },
  "snowy_fir": { cardtype: "terrain", name: "snow fir", portrait: "tree_snowcovered", health: 4, sigils: ["reach"], options: { isTerrain: true } },
  "sparrow": { cardtype: "common", name: "sparrow", power: 1, health: 2, tribes: ["bird"], sigils: ["flying"], cost: { amount: 1, type: "blood" }, portrait: "sparrow" },
  "squid_bell": { cardtype: "common", name: "squid bell", power: 'bell', health: 3, cost: { amount: 2, type: "blood" }, portrait: "squidbell", options: { isSquid: true } },
  "squid_cards": { cardtype: "common", name: "squid cards", power: 'cardsinhand', health: 1, cost: { amount: 1, type: "blood" }, portrait: "squidcards", options: { isSquid: true } },
  "squid_mirror": { cardtype: "common", name: "squid mirror", power: 'mirror', health: 3, cost: { amount: 1, type: "blood" }, portrait: "squidmirror", options: { isSquid: true } },
  "squirrel": { cardtype: "common", name: "squirrel", power: 0, health: 1, portrait: "squirrel" },
  "strange_frog": { cardtype: "terrain", name: "strange frog", portrait: 'trapfrog', power: 1, health: 2, cost: { type: 'blood', amount: 1 }, sigils: ["reach"] },
  "strange_larva": { cardtype: "rare", name: "strange larva", power: 0, health: 3, tribes: ["insect"], sigils: ["evolve_1"], cost: { amount: 1, type: "blood" }, portrait: "mothman_1" },
  "strange_pupa": { cardtype: "rare", name: "strange pupa", power: 0, health: 3, tribes: ["insect"], sigils: ["evolve_1"], cost: { amount: 1, type: "blood" }, portrait: "mothman_2" },
  "stump": { cardtype: "terrain", name: "stump", portrait: "stump", health: 3, options: { isTerrain: true } },
  "the_daus": { cardtype: "rare", name: "the daus", power: 2, health: 2, sigils: ["createbells"], cost: { amount: 2, type: "blood" }, portrait: "daus" },
  "the_smoke": { cardtype: "common", name: "the smoke", power: 0, health: 1, sigils: ["quadruplebones"], portrait: "smoke", decals: ["smoke"] },
  "undead_cat": { cardtype: "common", name: "undead cat", power: 3, health: 6, cost: { amount: 1, type: "blood" }, portrait: "cat_undead" },
  "urayuli": { cardtype: "rare", name: "urayuli", power: 7, health: 7, cost: { amount: 4, type: "blood" }, portrait: "urayuli" },
  "turkey_vulture": { cardtype: "common", name: "turkey vulture", power: 3, health: 3, cost: { amount: 8, type: "bone" }, tribes: ['bird'], sigils: ['flying'], portrait: "vulture" },
  "warren": { cardtype: "terrain", name: "warren", power: 0, health: 2, sigils: ["drawrabbits"], cost: { amount: 1, type: "blood" }, portrait: "warren" },
  "wolf_cub": { cardtype: "common", name: "wolf cub", power: 1, health: 1, tribes: ["canine"], sigils: ["evolve_1"], cost: { amount: 1, type: "blood" }, portrait: "wolfcub" },
  "wolf_pelt": { cardtype: "terrain", name: "wolf pelt", health: 2, portrait: "pelt_wolf", options: { isTerrain: true } },
  "wolf": { cardtype: "common", name: "wolf", power: 3, health: 2, tribes: ["canine"], cost: { amount: 2, type: "blood" }, portrait: "wolf" },
  "worker_ant": { cardtype: 'common', name: 'worker ant', power: 'ants', health: 2, cost: { amount: 1, type: 'blood' }, portrait: 'ant', tribes: ['insect'] },

  "tail_feathers": { cardtype: 'common', name: 'tail feathers', power: 0, health: 2, portrait: 'bird_tail' },
  "furry_tail": { cardtype: 'common', name: 'furry_tail', power: 0, health: 2, portrait: 'canine_tail' },
  "wriggling_leg": { cardtype: 'common', name: 'wriggling leg', power: 0, health: 2, portrait: 'insect_tail' },
  "wriggling_tail": { cardtype: 'common', name: 'wriggling_tail', power: 0, health: 2, portrait: 'skink_tail' },

  "hungry_child": { cardtype: 'common', decals: ['child'] },
  "leshy": { cardtype: 'rare', decals: ['leshy'] },

  "greater_smoke": { cardtype: "common", name: "greater smoke", power: 1, health: 3, sigils: ["quadruplebones"], portrait: "smoke_improved", decals: ["smoke"], options: { isEnhanced: true } },

  "gold_nugget": { cardtype: "terrain", name: "gold nugget", portrait: "goldnugget", health: 2, options: { isTerrain: true, isGolden: true } },
  "golden_pelt": { cardtype: "terrain", name: "golden pelt", health: 3, portrait: "pelt_golden", options: { isTerrain: true, isGolden: true } },
}

const server = fastify()

server.get('/act1/:creature', async (request, reply) => {
  const creatureId = request.url.match(/\/act1\/(\w+)/)?.[1] ?? '';
  const card = presets[creatureId]

  if (card === undefined) {
    reply.code(404)
    reply.send(`Unknown id '${creatureId}'`)
    return
  }

  const buffer = bufferFromCard(card)

  reply.type('image/png')
  reply.header('Content-Disposition', `inline; filename="${(card.name || 'creature').replace(/\s/g, '_')}.png"`)
  reply.send(buffer)
})

server.get('/act1/backs/:type', async (request, reply) => {
  const type = request.url.match(/\/act1\/backs\/(\w+)/)?.[1];

  if (!CardBackType.guard(type)) {
    reply.code(404)
    reply.send(`Unknown back type '${type}'`)
    return
  }

  const cardBack = cardBackFromData({ type })
  const buffer = bufferFromCardBack(cardBack)

  reply.type('image/png')
  reply.header('Content-Disposition', `inline; filename="back_${(cardBack.type)}.png"`)
  reply.send(buffer)
})

server.put('/act1/', async (request, reply) => {
  let card: Card;
  try {
    card = cardFromData(request.body);
  } catch (e: any) {
    reply.code(422)
    reply.send(`Error parsing input data`)
    return
  }

  const buffer = await bufferFromCard(card)
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
  let cardBack: CardBack;
  try {
    cardBack = cardBackFromData(request.body);
  } catch (e: any) {
    reply.code(422)
    reply.send(`Error parsing input data`)
    return
  }

  const buffer = bufferFromCardBack(cardBack)
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
