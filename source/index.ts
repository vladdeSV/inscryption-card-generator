import fastify from 'fastify'
import { writeFileSync } from 'fs';
import { bufferFromCard, cardFromData } from './act1/helpers';
import { Card } from './act1/types';

const presets: { [s: string]: Card } = {
  // "mini_moon": { type: "common", name: "mini moon", power: 1, health: 9,  sigils: ["allstrike", "squirrelorbit", "reach"], portrait: "moon",  },
  "adder": { type: "common", name: "adder", power: 1, health: 3, tribes: ["reptile"], sigils: ["deathtouch"], cost: { amount: 2, type: "blood" }, portrait: "adder" },
  "alpha": { type: "common", name: "alpha", power: 1, health: 2, tribes: ["canine"], sigils: ["buffneighbours"], cost: { amount: 5, type: "bone" }, portrait: "alpha" },
  "amalgam": { type: "rare", name: "amalgam", power: 3, health: 3, tribes: ["bird", "canine", "hooved", "reptile", "insect"], cost: { amount: 2, type: "blood" }, portrait: "amalgam" },
  "amoeba": { type: "rare", name: "amoeba", power: 1, health: 2, sigils: ["randomability"], cost: { amount: 2, type: "bone" }, portrait: "amoeba" },
  "bait_bucket": { type: "terrain", name: "bait bucket", portrait: 'baitbucket', health: 1, decals: ['blood'], options: { isTerrain: true } },
  "bat": { type: "common", name: "bat", power: 2, health: 1, sigils: ["flying"], cost: { amount: 4, type: "bone" }, portrait: "bat" },
  "beaver": { type: "common", name: "beaver", power: 1, health: 3, sigils: ["createdams"], cost: { amount: 2, type: "blood" }, portrait: "beaver" },
  "bee": { type: "common", name: "bee", power: 1, health: 1, tribes: ["insect"], sigils: ["flying"], portrait: "bee" },
  "beehive": { type: "common", name: "beehive", power: 0, health: 2, tribes: ["insect"], sigils: ["beesonhit"], cost: { amount: 1, type: "blood" }, portrait: "beehive" },
  "black_goat": { type: "common", name: "black goat", power: 0, health: 1, tribes: ["hooved"], sigils: ["tripleblood"], cost: { amount: 1, type: "blood" }, portrait: "goat" },
  "bloodhound": { type: "common", name: "bloodhound", power: 2, health: 3, tribes: ["canine"], sigils: ["guarddog"], cost: { amount: 2, type: "blood" }, portrait: "bloodhound" },
  "boulder": { type: "terrain", name: "boulder", portrait: "boulder", health: 5, options: { isTerrain: true } },
  "bullfrog": { type: "common", name: "bullfrog", power: 1, health: 2, tribes: ["reptile"], sigils: ["reach"], cost: { amount: 1, type: "blood" }, portrait: "bullfrog" },
  "caged_wolf": { type: "terrain", name: "caged wolf", portrait: 'cagedwolf', cost: { type: 'blood', amount: 2 }, health: 6, tribes: ['canine'], options: { isTerrain: true } },
  "cat": { type: "common", name: "cat", power: 0, health: 1, sigils: ["sacrificial"], cost: { amount: 1, type: "blood" }, portrait: "cat" },
  "child_13": { type: "rare", name: "child 13", power: 0, health: 1, tribes: ["hooved"], sigils: ["sacrificial"], cost: { amount: 1, type: "blood" }, portrait: "jerseydevil_sleeping" },
  "chime": { type: "terrain", name: "chime", portrait: "dausbell", health: 1, options: { isTerrain: true } },
  "cockroach": { type: "common", name: "cockroach", power: 1, health: 1, tribes: ["insect"], sigils: ["drawcopyondeath"], cost: { amount: 4, type: "bone" }, portrait: "cockroach" },
  "corpse_maggots": { type: "common", name: "corpse maggots", power: 1, health: 2, tribes: ["insect"], sigils: ["corpseeater"], cost: { amount: 5, type: "bone" }, portrait: "maggots" },
  "coyote": { type: "common", name: "coyote", power: 2, health: 1, tribes: ["canine"], cost: { amount: 4, type: "bone" }, portrait: "coyote" },
  "dam": { type: "terrain", name: "dam", portrait: "dam", health: 2, options: { isTerrain: true } },
  "elk_fawn": { type: "common", name: "elk fawn", power: 1, health: 1, tribes: ["hooved"], sigils: ["evolve_1", "strafe"], cost: { amount: 1, type: "blood" }, portrait: "deercub" },
  "elk": { type: "common", name: "elk", power: 2, health: 4, tribes: ["hooved"], sigils: ["strafe"], cost: { amount: 2, type: "blood" }, portrait: "deer" },
  "field_mice": { type: "common", name: "field mice", power: 2, health: 2, sigils: ["drawcopy"], cost: { amount: 2, type: "blood" }, portrait: "fieldmice" },
  "frozen_opossum": { type: "terrain", name: "frozen opossum", portrait: 'frozen_opossum', power: 0, health: 5, sigils: ['icecube'] },
  "geck": { type: "rare", name: "geck", power: 1, health: 1, tribes: ["reptile"], portrait: "geck" },
  "grand_fir": { type: "terrain", name: "grand fir", portrait: "tree", health: 3, sigils: ["reach"], options: { isTerrain: true } },
  "great_white": { type: "common", name: "great white", power: 4, health: 2, sigils: ["submerge"], cost: { amount: 3, type: "blood" }, portrait: "shark", decals: ['blood'] },
  "grizzly": { type: "common", name: "grizzly", power: 4, health: 6, cost: { amount: 3, type: "blood" }, portrait: "grizzly" },
  "kingfisher": { type: "common", name: "kingfisher", power: 1, health: 1, tribes: ["bird"], sigils: ["submerge", "flying"], cost: { amount: 1, type: "blood" }, portrait: "kingfisher" },
  "leaping_trap": { type: "terrain", name: "leaping trap", portrait: 'trap', health: 1, sigils: ['steeltrap', 'reach'], options: { isTerrain: true } },
  "mantis_god": { type: "rare", name: "mantis god", power: 1, health: 1, tribes: ["insect"], sigils: ["tristrike"], cost: { amount: 1, type: "blood" }, portrait: "mantisgod" },
  "mantis": { type: "common", name: "mantis", power: 1, health: 1, tribes: ["insect"], sigils: ["splitstrike"], cost: { amount: 1, type: "blood" }, portrait: "mantis" },
  "mole_man": { type: "rare", name: "mole man", power: 0, health: 6, sigils: ["reach", "whackamole"], cost: { amount: 1, type: "blood" }, portrait: "moleman" },
  "mole": { type: "common", name: "mole", power: 0, health: 4, sigils: ["whackamole"], cost: { amount: 1, type: "blood" }, portrait: "mole" },
  "moose_buck": { type: "common", name: "moose buck", power: 3, health: 7, tribes: ["hooved"], sigils: ["strafepush"], cost: { amount: 3, type: "blood" }, portrait: "moose" },
  "mothman": { type: "rare", name: "mothman", power: 7, health: 3, tribes: ["insect"], sigils: ["flying"], cost: { amount: 1, type: "blood" }, portrait: "mothman_3" },
  "opossum": { type: "common", name: "opossum", power: 1, health: 1, cost: { amount: 2, type: "bone" }, portrait: "opossum" },
  "ouroboros": { type: "rare", name: "ouroboros", tribes: ["reptile"], sigils: ["drawcopyondeath"], cost: { amount: 2, type: "blood" }, portrait: "ouroboros" },
  "pack_rat": { type: "rare", name: "pack rat", power: 2, health: 2, sigils: ["randomconsumable"], cost: { amount: 2, type: "blood" }, portrait: "packrat" },
  "porcupine": { type: "common", name: "porcupine", power: 1, health: 2, sigils: ["sharp"], cost: { amount: 1, type: "blood" }, portrait: "porcupine" },
  "pronghorn": { type: "common", name: "pronghorn", power: 1, health: 3, tribes: ["hooved"], sigils: ["splitstrike", "strafe"], cost: { amount: 2, type: "blood" }, portrait: "pronghorn" },
  "rabbit_pelt": { type: "terrain", name: "rabbit pelt", health: 1, portrait: "pelt_hare", options: { isTerrain: true } },
  "rabbit": { type: "common", name: "rabbit", power: 0, health: 1, portrait: "rabbit" },
  "rat_king": { type: "common", name: "rat king", power: 2, health: 1, sigils: ["quadruplebones"], cost: { amount: 2, type: "blood" }, portrait: "ratking" },
  "rattler": { type: "common", name: "rattler", power: 3, health: 1, tribes: ["reptile"], cost: { amount: 6, type: "bone" }, portrait: "rattler" },
  "raven_egg": { type: "common", name: "raven egg", power: 0, health: 2, tribes: ["bird"], sigils: ["evolve_1"], cost: { amount: 1, type: "blood" }, portrait: "ravenegg" },
  "raven": { type: "common", name: "raven", power: 2, health: 3, tribes: ["bird"], sigils: ["flying"], cost: { amount: 2, type: "blood" }, portrait: "raven" },
  "ring_worm": { type: "common", name: "ring worm", power: 0, health: 1, tribes: ["insect"], cost: { amount: 1, type: "blood" }, portrait: "ringworm" },
  "river_otter": { type: "common", name: "river otter", power: 1, health: 1, sigils: ["submerge"], cost: { amount: 1, type: "blood" }, portrait: "otter" },
  "river_snapper": { type: "common", name: "river snapper", power: 1, health: 6, tribes: ["reptile"], cost: { amount: 2, type: "blood" }, portrait: "turtle" },
  "skink": { type: "common", name: "skink", power: 1, health: 2, tribes: ["reptile"], sigils: ["tailonhit"], cost: { amount: 1, type: "blood" }, portrait: "skink" },
  "skunk": { type: "common", name: "skunk", power: 0, health: 3, sigils: ["debuffenemy"], cost: { amount: 1, type: "blood" }, portrait: "skunk" },
  "snow_fir": { type: "terrain", name: "snow fir", portrait: "tree_snowcovered", health: 4, sigils: ["reach"], options: { isTerrain: true } },
  "sparrow": { type: "common", name: "sparrow", power: 1, health: 2, tribes: ["bird"], sigils: ["flying"], cost: { amount: 1, type: "blood" }, portrait: "sparrow" },
  "squid_bell": { type: "common", name: "squid bell", power: 'bell', health: 3, cost: { amount: 2, type: "blood" }, portrait: "squidbell", options: { isSquid: true } },
  "squid_cards": { type: "common", name: "squid cards", power: 'cardsinhand', health: 1, cost: { amount: 1, type: "blood" }, portrait: "squidcards", options: { isSquid: true } },
  "squid_mirror": { type: "common", name: "squid mirror", power: 'mirror', health: 3, cost: { amount: 1, type: "blood" }, portrait: "squidmirror", options: { isSquid: true } },
  "squirrel": { type: "common", name: "squirrel", power: 0, health: 1, portrait: "squirrel" },
  "strange_frog": { type: "terrain", name: "strange frog", portrait: 'trapfrog', power: 1, health: 2, cost: { type: 'blood', amount: 1 }, sigils: ["reach"] },
  "strange_larva": { type: "rare", name: "strange larva", power: 0, health: 3, tribes: ["insect"], sigils: ["evolve_1"], cost: { amount: 1, type: "blood" }, portrait: "mothman_1" },
  "strange_pupa": { type: "rare", name: "strange pupa", power: 0, health: 3, tribes: ["insect"], sigils: ["evolve_1"], cost: { amount: 1, type: "blood" }, portrait: "mothman_2" },
  "stump": { type: "terrain", name: "stump", portrait: "stump", health: 3, options: { isTerrain: true } },
  "the_daus": { type: "rare", name: "the daus", power: 2, health: 2, sigils: ["createbells"], cost: { amount: 2, type: "blood" }, portrait: "daus" },
  "the_smoke": { type: "common", name: "the smoke", power: 0, health: 1, sigils: ["quadruplebones"], portrait: "smoke", decals: ["smoke"] },
  "undead_cat": { type: "common", name: "undead cat", power: 3, health: 6, cost: { amount: 1, type: "blood" }, portrait: "cat_undead" },
  "urayuli": { type: "rare", name: "urayuli", power: 7, health: 7, cost: { amount: 4, type: "blood" }, portrait: "urayuli" },
  "warren": { type: "terrain", name: "warren", power: 0, health: 2, sigils: ["drawrabbits"], cost: { amount: 1, type: "blood" }, portrait: "warren" },
  "wolf_cub": { type: "common", name: "wolf cub", power: 1, health: 1, tribes: ["canine"], sigils: ["evolve_1"], cost: { amount: 1, type: "blood" }, portrait: "wolfcub" },
  "wolf_pelt": { type: "terrain", name: "wolf pelt", health: 2, portrait: "pelt_wolf", options: { isTerrain: true } },
  "wolf": { type: "common", name: "wolf", power: 3, health: 2, tribes: ["canine"], cost: { amount: 2, type: "blood" }, portrait: "wolf" },

  "greater_smoke": { type: "common", name: "greater smoke", power: 1, health: 3, sigils: ["quadruplebones"], portrait: "smoke_improved", decals: ["smoke"], options: { isEnhanced: true } },
  "gold_nugget": { type: "terrain", name: "gold nugget", portrait: "goldnugget", health: 2, options: { isTerrain: true } },
  "golden_pelt": { type: "terrain", name: "golden pelt", health: 3, portrait: "pelt_golden", options: { isTerrain: true, isGolden: true } },

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

  const buffer = await bufferFromCard(card)

  reply.type('image/png')
  reply.header('Content-Disposition', `inline; filename="${(card.name || 'creature').replace(/\s/g, '_')}.png"`)
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

server.listen(8080, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
