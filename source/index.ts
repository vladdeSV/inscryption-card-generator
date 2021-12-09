import fastify from 'fastify'
import { writeFileSync } from 'fs';
import { bufferFromCard, cardFromData } from './act1/helpers';
import { Card } from './act1/types';

const presets: { [s: string]: Card } = {
  // "mini_moon": { type: "common", name: "mini moon", power: 1, health: 9, tribes: [], sigils: ["allstrike", "squirrelorbit", "reach"], portrait: "moon", decals: [], options: {} },
  "wolf": { type: "common", name: "wolf", power: 3, health: 2, tribes: ["canine"], sigils: [], cost: { amount: 2, type: "blood" }, portrait: "wolf", decals: [], options: {} },
  "wolf_cub": { type: "common", name: "wolf cub", power: 1, health: 1, tribes: ["canine"], sigils: ["evolve_1"], cost: { amount: 1, type: "blood" }, portrait: "wolfcub", decals: [], options: {} },
  "cat": { type: "common", name: "cat", power: 0, health: 1, tribes: [], sigils: ["sacrificial"], cost: { amount: 1, type: "blood" }, portrait: "cat", decals: [], options: {} },
  "mantis_god": { type: "rare", name: "mantis god", power: 1, health: 1, tribes: ["insect"], sigils: ["tristrike"], cost: { amount: 1, type: "blood" }, portrait: "mantisgod", decals: [], options: {} },
  "warren": { type: "terrain", name: "warren", power: 0, health: 2, tribes: [], sigils: ["drawrabbits"], cost: { amount: 1, type: "blood" }, portrait: "warren", decals: [], options: {} },
  "snow_fir": { type: "terrain", name: "snow fir", health: 4, tribes: [], sigils: ["reach"], portrait: "tree_snowcovered", decals: [], options: {} },
  "grand_fir": { type: "terrain", name: "grand fir", health: 3, tribes: [], sigils: ["reach"], portrait: "tree", decals: [], options: {} },
  "boulder": { type: "terrain", name: "boulder", health: 5, tribes: [], sigils: [], portrait: "boulder", decals: [], options: {} },
  "sparrow": { type: "common", name: "sparrow", power: 1, health: 2, tribes: ["bird"], sigils: ["flying"], cost: { amount: 1, type: "blood" }, portrait: "sparrow", decals: [], options: {} },
  "pronghorn": { type: "common", name: "pronghorn", power: 1, health: 3, tribes: ["hooved"], sigils: ["splitstrike", "strafe"], cost: { amount: 2, type: "blood" }, portrait: "pronghorn", decals: [], options: {} },
  "kingfisher": { type: "common", name: "kingfisher", power: 1, health: 1, tribes: ["bird"], sigils: ["flying", "submerge"], cost: { amount: 1, type: "blood" }, portrait: "kingfisher", decals: [], options: {} },
  "amoeba": { type: "rare", name: "amoeba", power: 1, health: 2, tribes: [], sigils: ["randomability"], cost: { amount: 2, type: "bone" }, portrait: "amoeba", decals: [], options: {} },
  "bullfrog": { type: "common", name: "bullfrog", power: 1, health: 3, tribes: ["reptile"], sigils: ["reach"], cost: { amount: 1, type: "blood" }, portrait: "bullfrog", decals: [], options: {} },
  "adder": { type: "common", name: "adder", power: 1, health: 1, tribes: ["reptile"], sigils: ["deathtouch"], cost: { amount: 2, type: "blood" }, portrait: "adder", decals: [], options: {} },
  "rattler": { type: "common", name: "rattler", power: 3, health: 1, tribes: ["reptile"], sigils: [], cost: { amount: 6, type: "bone" }, portrait: "rattler", decals: [], options: {} },
  "river_snapper": { type: "common", name: "river snapper", power: 1, health: 6, tribes: ["reptile"], sigils: [], cost: { amount: 2, type: "blood" }, portrait: "turtle", decals: [], options: {} },
  "skink": { type: "common", name: "skink", power: 1, health: 2, tribes: ["reptile"], sigils: ["tailonhit"], cost: { amount: 1, type: "blood" }, portrait: "skink", decals: [], options: {} },
  "ouroboros": { type: "rare", name: "ouroboros", tribes: ["reptile"], sigils: ["drawcopyondeath"], cost: { amount: 2, type: "blood" }, portrait: "ouroboros", decals: [], options: {} },
  "geck": { type: "rare", name: "geck", power: 1, health: 1, tribes: ["reptile"], sigils: [], portrait: "geck", decals: [], options: {} },
  "elk_fawn": { type: "common", name: "elk fawn", power: 1, health: 1, tribes: ["hooved"], sigils: ["strafe", "evolve_1"], cost: { amount: 1, type: "blood" }, portrait: "deercub", decals: [], options: {} },
  "elk": { type: "common", name: "elk", power: 2, health: 4, tribes: ["hooved"], sigils: ["strafe"], cost: { amount: 2, type: "blood" }, portrait: "deer", decals: [], options: {} },
  "moose_buck": { type: "common", name: "moose buck", power: 3, health: 7, tribes: ["hooved"], sigils: ["strafepush"], cost: { amount: 3, type: "blood" }, portrait: "moose", decals: [], options: {} },
  "black_goat": { type: "common", name: "black goat", power: 0, health: 1, tribes: ["hooved"], sigils: ["tripleblood"], cost: { amount: 1, type: "blood" }, portrait: "goat", decals: [], options: {} },
  "child_13": { type: "rare", name: "child 13", power: 0, health: 1, tribes: ["hooved"], sigils: ["sacrificial"], cost: { amount: 1, type: "blood" }, portrait: "jerseydevil_sleeping", decals: [], options: {} },
  "raven_egg": { type: "common", name: "raven egg", power: 0, health: 2, tribes: ["bird"], sigils: ["evolve_1"], cost: { amount: 1, type: "blood" }, portrait: "ravenegg", decals: [], options: {} },
  "raven": { type: "common", name: "raven", power: 2, health: 3, tribes: ["bird"], sigils: ["flying"], cost: { amount: 2, type: "blood" }, portrait: "raven", decals: [], options: {} },
  "squirrel": { type: "common", name: "squirrel", power: 0, health: 1, tribes: [], sigils: [], portrait: "squirrel", decals: [], options: {} },
  "rabbit": { type: "common", name: "rabbit", power: 0, health: 1, tribes: [], sigils: [], portrait: "rabbit", decals: [], options: {} },
  "undead_cat": { type: "common", name: "undead cat", power: 3, health: 6, tribes: [], sigils: [], cost: { amount: 1, type: "blood" }, portrait: "cat_undead", decals: [], options: {} },
  "mole": { type: "common", name: "mole", power: 0, health: 4, tribes: [], sigils: ["whackamole"], cost: { amount: 1, type: "blood" }, portrait: "mole", decals: [], options: {} },
  "field_mice": { type: "common", name: "field mice", power: 2, health: 2, tribes: [], sigils: ["drawcopy"], cost: { amount: 2, type: "blood" }, portrait: "fieldmice", decals: [], options: {} },
  "river_otter": { type: "common", name: "river otter", power: 1, health: 1, tribes: [], sigils: ["submerge"], cost: { amount: 1, type: "blood" }, portrait: "otter", decals: [], options: {} },
  "skunk": { type: "common", name: "skunk", power: 0, health: 3, tribes: [], sigils: ["debuffenemy"], cost: { amount: 1, type: "blood" }, portrait: "skunk", decals: [], options: {} },
  "porcupine": { type: "common", name: "porcupine", power: 1, health: 2, tribes: [], sigils: ["sharp"], cost: { amount: 1, type: "blood" }, portrait: "porcupine", decals: [], options: {} },
  "rat_king": { type: "common", name: "rat king", power: 2, health: 1, tribes: [], sigils: ["quadruplebones"], cost: { amount: 2, type: "blood" }, portrait: "ratking", decals: [], options: {} },
  "beaver": { type: "common", name: "beaver", power: 1, health: 3, tribes: [], sigils: ["createdams"], cost: { amount: 2, type: "blood" }, portrait: "beaver", decals: [], options: {} },
  "opossum": { type: "common", name: "opossum", power: 1, health: 1, tribes: [], sigils: [], cost: { amount: 2, type: "bone" }, portrait: "opossum", decals: [], options: {} },
  "bat": { type: "common", name: "bat", power: 2, health: 1, tribes: [], sigils: ["flying"], cost: { amount: 4, type: "bone" }, portrait: "bat", decals: [], options: {} },
  "grizzly": { type: "common", name: "grizzly", power: 4, health: 6, tribes: [], sigils: [], cost: { amount: 3, type: "blood" }, portrait: "grizzly", decals: [], options: {} },
  "great_white": { type: "common", name: "great white", power: 4, health: 2, tribes: [], sigils: ["submerge"], cost: { amount: 3, type: "blood" }, portrait: "shark", decals: [], options: {} },
  "mole_man": { type: "rare", name: "mole man", power: 0, health: 6, tribes: [], sigils: ["reach", "whackamole"], cost: { amount: 1, type: "blood" }, portrait: "moleman", decals: [], options: {} },
  "amalgam": { type: "rare", name: "amalgam", power: 3, health: 3, tribes: ["bird", "canine", "hooved", "reptile", "insect"], sigils: [], cost: { amount: 2, type: "blood" }, portrait: "amalgam", decals: [], options: {} },
  "the_daus": { type: "rare", name: "the daus", power: 2, health: 2, tribes: [], sigils: ["createbells"], cost: { amount: 2, type: "blood" }, portrait: "daus", decals: [], options: {} },
  "pack_rat": { type: "rare", name: "pack rat", power: 2, health: 2, tribes: [], sigils: ["randomconsumable"], cost: { amount: 2, type: "blood" }, portrait: "packrat", decals: [], options: {} },
  "urayuli": { type: "rare", name: "urayuli", power: 7, health: 7, tribes: [], sigils: [], cost: { amount: 4, type: "blood" }, portrait: "urayuli", decals: [], options: {} },
  "alpha": { type: "common", name: "alpha", power: 1, health: 2, tribes: ["canine"], sigils: ["buffneighbours"], cost: { amount: 5, type: "bone" }, portrait: "alpha", decals: [], options: {} },
  "coyote": { type: "common", name: "coyote", power: 2, health: 1, tribes: ["canine"], sigils: [], cost: { amount: 4, type: "bone" }, portrait: "coyote", decals: [], options: {} },
  "bloodhound": { type: "common", name: "bloodhound", power: 2, health: 3, tribes: ["canine"], sigils: ["guarddog"], cost: { amount: 2, type: "blood" }, portrait: "bloodhound", decals: [], options: {} },
  "bee": { type: "common", name: "bee", power: 1, health: 1, tribes: ["insect"], sigils: ["flying"], portrait: "bee", decals: [], options: {} },
  "beehive": { type: "common", name: "beehive", power: 0, health: 2, tribes: ["insect"], sigils: ["beesonhit"], cost: { amount: 1, type: "blood" }, portrait: "beehive", decals: [], options: {} },
  "cockroach": { type: "common", name: "cockroach", power: 1, health: 1, tribes: ["insect"], sigils: ["drawcopyondeath"], cost: { amount: 4, type: "bone" }, portrait: "cockroach", decals: [], options: {} },
  "corpse_maggots": { type: "common", name: "corpse maggots", power: 1, health: 2, tribes: ["insect"], sigils: ["corpseeater"], cost: { amount: 5, type: "bone" }, portrait: "maggots", decals: [], options: {} },
  "mantis": { type: "common", name: "mantis", power: 1, health: 1, tribes: ["insect"], sigils: ["splitstrike"], cost: { amount: 1, type: "blood" }, portrait: "mantis", decals: [], options: {} },
  "ring_worm": { type: "common", name: "ring worm", power: 0, health: 1, tribes: ["insect"], sigils: [], cost: { amount: 1, type: "blood" }, portrait: "ringworm", decals: [], options: {} },
  "strange_larva": { type: "rare", name: "strange larva", power: 0, health: 3, tribes: ["insect"], sigils: ["evolve_1"], cost: { amount: 1, type: "blood" }, portrait: "mothman_1", decals: [], options: {} },
  "strange_pupa": { type: "rare", name: "strange pupa", power: 0, health: 3, tribes: ["insect"], sigils: ["evolve_1"], cost: { amount: 1, type: "blood" }, portrait: "mothman_2", decals: [], options: {} },
  "mothman": { type: "rare", name: "mothman", power: 7, health: 3, tribes: ["insect"], sigils: ["flying"], cost: { amount: 1, type: "blood" }, portrait: "mothman_3", decals: [], options: {} },
  "the_smoke": { type: "common", name: "the smoke", power: 0, health: 1, tribes: [], sigils: ["quadruplebones"], portrait: "smoke", decals: ["smoke"], options: {} },
  "gold_nugget": { type: "terrain", name: "gold nugget", power: undefined, health: 2, tribes: [], sigils: [], portrait: "goldnugget", decals: [], options: {} },
  "golden_pelt": { type: "terrain", name: "golden pelt", power: undefined, health: 3, tribes: [], sigils: [], portrait: "pelt_golden", decals: [], options: {} },
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
  reply.header('Content-Disposition', `inline; filename="${(card.name ?? 'creature').replace(/\s/g, '_')}.png"`)
  reply.send(buffer)
})

server.get('/act1/', async (request, reply) => {
  const card = cardFromData(request.query);
  if (card === undefined) {
    reply.code(422)
    reply.send('Error parsing input data (todo add error message)')
    return
  }

  const buffer = await bufferFromCard(card)

  if (!buffer) {
    reply.code(500)
    reply.send('Unknown error when creating image')
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
