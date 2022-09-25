import { Card } from '../card'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import * as path from 'path'
// import { generateAct2BackCard, generateAct2Card, generateAct2NpcCard } from './fns/generateAct2Card'
// import { generateAct1BackCard, generateAct1BoonCard, generateAct1Card, generateAct1RewardCard, generateAct1TarotCard, generateAct1TrialCard } from './fns/generateAct1Card'
import { convertJldrCard, JldrCreature, CreatureId as JldrCreatureId } from '../jldrcard'
import { res2 } from '../temp'
import { SingleResource } from '../resource'

function getGameTranslationId(id: string | undefined): string | undefined {

  if (id === 'Stoat_Talking') {
    id = 'stoat'
  }

  if (id === 'Smoke_NoBones') {
    id = 'smoke'
  }

  if (id === '!DEATHCARD_LESHY') {
    return undefined
  }

  if (id === '') {
    return undefined
  }

  return id?.toLowerCase()

}

const creatures = JSON.parse(readFileSync('creatures.json', 'utf-8'))

if (!Array.isArray(creatures)) {
  throw 'creatures not array'
}

const jldrCreatures = creatures.map(JldrCreature.check)
const cards: Card[] = jldrCreatures.map(convertJldrCard)

const translations = JSON.parse(readFileSync('translations.json', 'utf-8'))
const act1CreatureIds: JldrCreatureId[] = ['Adder', 'Alpha', 'Amalgam', 'Amoeba', 'Ant', 'AntQueen', 'Bat', 'Beaver', 'Bee', 'Beehive', 'Bloodhound', 'Boulder', 'Bullfrog', 'CagedWolf', 'Cat', 'CatUndead', 'Cockroach', 'Coyote', 'Daus', 'Elk', 'ElkCub', 'FieldMouse', 'Geck', 'Goat', 'Grizzly', 'JerseyDevil', 'Kingfisher', 'Maggots', 'Magpie', 'Mantis', 'MantisGod', 'Mole', 'MoleMan', 'Moose', 'Mothman_Stage1', 'Mothman_Stage2', 'Mothman_Stage3', 'Mule', 'Opossum', 'Otter', 'Ouroboros', 'PackRat', 'Porcupine', 'Pronghorn', 'Rabbit', 'RatKing', 'Rattler', 'Raven', 'RavenEgg', 'Shark', 'Skink', 'SkinkTail', 'Skunk', 'Snapper', 'Snelk', 'Sparrow', 'SquidBell', 'SquidCards', 'SquidMirror', 'Squirrel', 'Tail_Bird', 'Tail_Furry', 'Tail_Insect', 'Urayuli', 'Vulture', 'Warren', 'Wolf', 'WolfCub', '!DEATHCARD_LESHY', 'BaitBucket', 'Dam', 'DausBell', 'GoldNugget', 'PeltGolden', 'PeltHare', 'PeltWolf', 'RingWorm', 'Smoke', 'Smoke_Improved', 'Smoke_NoBones', 'Starvation', 'Stinkbug_Talking', 'Stoat_Talking', 'Trap', 'TrapFrog', 'Wolf_Talking', 'FrozenOpossum', 'Tree_SnowCovered', 'Tree', 'Stump']
const act2CreatureIds: JldrCreatureId[] = [
  'Kraken', 'SquidCards', 'SquidMirror', 'SquidBell', 'Hrokkall', 'MantisGod', 'MoleMan', 'Urayuli', 'Rabbit',
  'Squirrel', 'Bullfrog', 'Cat', 'CatUndead', 'ElkCub', 'Mole', 'SquirrelBall', 'Stoat', 'Warren', 'WolfCub',
  'Wolf', 'Adder', 'Bloodhound', 'Elk', 'FieldMouse', 'Hawk', 'Raven', 'Salmon', 'FieldMouse_Fused', 'Grizzly',
  'Ouroboros',

  'Bonepile', 'TombRobber', 'Necromancer', 'DrownedSoul', 'DeadHand', 'HeadlessHorseman', 'Skeleton', 'Draugr',
  'Gravedigger', 'Gravedigger_Fused', 'Banshee', 'SkeletonMage', 'Zombie', 'BonelordHorn', 'CoinLeft', 'CoinRight',
  'Revenant', 'GhostShip', 'Sarcophagus', 'Family', 'FrankNStein', 'DeadPets', 'Bonehound', 'Mummy',

  'PlasmaGunner', 'AboveCurve', 'EnergyConduit', 'TechMoxTriple', 'BombMaiden', 'Shutterbug', 'LeapBot', 'NullConduit',
  'SentryBot', 'SentryBot_Fused', 'MineCart', 'AttackConduit', 'BatteryBot', 'EnergyRoller', 'Insectodrone', 'RoboMice',
  'Thickbot', 'BoltHound', 'CloserBot', 'Steambot', 'MeatBot', 'Automaton', 'FactoryConduit', 'Bombbot',

  'MoxDualBG', 'MoxDualGO', 'MoxDualOB', 'MasterBleene', 'MasterGoranj', 'MasterOrlu', 'MoxEmerald',
  'MoxRuby', 'MoxSapphire', 'Pupil', 'MarrowMage', 'GreenMage', 'JuniorSage', 'MuscleMage', 'StimMage', 'MageKnight',
  'OrangeMage', 'PracticeMage', 'RubyGolem', 'BlueMage', 'BlueMage_Fused', 'ForceMage', 'GemFiend', 'FlyingMage',

  'Starvation', 'BurrowingTrap', 'Kingfisher', 'Opossum', 'Coyote', 'MoxTriple',
]

const specifiedCreatureIds = [...act1CreatureIds, ...act2CreatureIds]
console.log('missing creature ids', jldrCreatures.map(x => x.name).filter(id => !specifiedCreatureIds.includes(id)))

const getCard = (gameId: string) => cards.filter(card => card.gameId === gameId)[0]

cards.push({
  ...getCard('Goat'),
  portrait: {
    type: 'resource',
    resourceId: 'goat_sexy'
  }
})

cards.push({
  ...getCard('JerseyDevil'),
  portrait: {
    type: 'resource',
    resourceId: 'jerseydevil_flying'
  },
  power: 2,
  sigils: [
    'sacrificial',
    'flying',
  ]
})

const act1Cards = cards.filter(card => act1CreatureIds.includes(card.gameId as JldrCreatureId ?? ''))
const act2Cards = cards.filter(card => act2CreatureIds.includes(card.gameId as JldrCreatureId ?? ''))

const starvation = getCard('Starvation')
starvation.flags.hidePowerAndHealth = true

cards.forEach(card => {
  let gameId = card.gameId

  if (gameId === 'Tree_SnowCovered') {
    gameId = 'Tree_Hologram_SnowCovered'
  }

  const translationId = getGameTranslationId(gameId)
  if (translationId) {
    const name = translations['en'][translationId]
    if (name === undefined) {
      console.log('found no translation for', card.gameId)
    }

    card.name = name
  }

  if (card.gameId === '!DEATHCARD_LESHY') {
    card.flags.rare = true
  }
})

function slask<T, T2 extends { [s: string]: { [s: string]: string } }>(folderName: string, fn: (t: T, r: SingleResource<T2>, opts: any) => Buffer, arr: T[], res: SingleResource<T2>, options: any, filenameGenerator: (t: T) => string | undefined = () => undefined) {
  const folderpath = path.join('out', folderName)
  mkdirSync(folderpath, { recursive: true })

  for (const id of arr) {
    try {
      const filename = filenameGenerator(id) ?? id
      const filepath = path.join(folderpath, filename + '.png')
      if (existsSync(filepath)) {
        // console.log('skipping', `${folderName}/${filename}`)

        continue
      }

      const buffer = fn(id, res, options)
      writeFileSync(filepath, buffer)
      // console.log('generated', `${folderName}/${filename}`)
    } catch (e) {
      // const gameId = (id as any).gameId.toLowerCase()
      // console.log(gameId, translations['en'][gameId])
      console.error(filenameGenerator(id), '//', e)
    }
  }
}

for (const border of [true/* , false */]) {
  const toplevelName = `act1/${border ? 'border' : 'regular'}`
  // slask(toplevelName + '/backs', generateAct1BackCard, ['bee', 'common', 'deathcard', 'squirrel', 'submerge'], res, { border: border })
  // slask(toplevelName + '/boons', generateAct1BoonCard, ['doubledraw', 'singlestartingbone', 'startingbones', 'startinggoat', 'startingtrees', 'tutordraw'], res, { border: border })
  // slask(toplevelName + '/rewards', generateAct1RewardCard, ['1blood', '2blood', '3blood', 'bones', 'bird', 'canine', 'hooved', 'insect', 'reptile'], res, { border: border })
  // slask(toplevelName + '/trials', generateAct1TrialCard, ['abilities', 'blood', 'bones', 'flying', 'pelts', 'power', 'rare', 'ring', 'strafe', 'submerge', 'toughness', 'tribes'], res, { border: border })
  // slask(toplevelName + '/tarots', generateAct1TarotCard, ['death', 'devil', 'empress', 'fool', 'tower'], res, { border: border })
  // slask(toplevelName, generateAct1Card, cards, res, { border: border }, (card: Card) => {

  //   if (card.portrait?.type === 'resource' && card.portrait?.resourceId === 'goat_sexy') {
  //     return 'goat_sexy'
  //   }

  //   if (card.portrait?.type === 'resource' && card.portrait?.resourceId === 'jerseydevil_flying') {
  //     return 'jerseydevil_flying'
  //   }

  //   if (card.portrait?.type === 'creature') {
  //     return card.portrait.id
  //   }

  //   return card.gameId
  // })
}

// for (const useScanline of [true, false]) {
//   for (const border of [true, false]) {
//     const toplevelName = `act2/${useScanline ? 'scanline' : 'plain'}/${border ? 'border' : 'regular'}`
//     slask(toplevelName, generateAct2Card, act2Cards, res2, { border: border, scanlines: useScanline }, (card: Card) => (card.portrait?.type === 'creature') ? card.portrait.id : card.gameId)
//     slask(toplevelName + '/npc', generateAct2NpcCard, ['angler', 'bluewizard', 'briar', 'dredger', 'dummy', 'greenwizard', 'inspector', 'orangewizard', 'royal', 'sawyer', 'melter', 'trapper', 'prospector'], res2, { border: border, scanlines: useScanline })
//     slask(toplevelName + '/backs', generateAct2BackCard, ['common', 'submerged'], res2, { border: border, scanlines: useScanline })
//   }
// }

// const template: Card = {
//   name: '',
//   cost: undefined,
//   power: 0,
//   health: 0,
//   sigils: [],
//   tribes: [],
//   temple: 'nature',
//   flags: { smoke: false, blood: false, golden: false, rare: false, terrain: false, terrainLayout: false, squid: false, enhanced: false, redEmission: false, fused: false, paint: false, hidePowerAndHealth: false },
// }

// writeFileSync('out/test.png', generateAct1Card({ ...template, name: 'test', cost: { type: 'gem', gems: ['orange'] } }, res, { border: true, locale: 'en' }))
