import { readFileSync, writeFileSync } from 'fs'

type hack = any
type Abillity = 'Deathtouch' | 'BuffNeighbours' | 'RandomAbility' | 'Ant' | 'DrawAnt' | 'Flying' | 'CreateDams' | 'BeesOnHit' | 'GuardDog' | 'Reach' | 'WhackAMole' | 'SteelTrap' | 'CagedWolf' | 'Sacrificial' | 'Cat' | 'DrawCopyOnDeath' | 'CreateBells' | 'Daus' | 'Strafe' | 'Evolve' | 'DrawCopy' | 'TripleBlood' | 'Submerge' | 'GainBattery' | 'JerseyDevil' | 'SubmergeSquid' | 'Lammergeier' | 'CorpseEater' | 'Tutor' | 'SplitStrike' | 'TriStrike' | 'StrafePush' | 'PackMule' | 'Ouroboros' | 'RandomConsumable' | 'Sharp' | 'QuadrupleBones' | 'TailOnHit' | 'DebuffEnemy' | 'BellProximity' | 'CardsInHand' | 'Mirror' | 'SquirrelStrafe' | 'DrawRabbits' | 'AllStrike' | 'SquirrelOrbit' | 'GiantCard' | 'GiantMoon' | 'RandomCard' | 'PreventAttack' | 'TalkingCardChooser' | 'TrapSpawner' | 'ConduitNull' | 'IceCube' | 'BountyHunter' | 'Brittle' | 'BuffEnemy' | 'Sentry' | 'Sniper' | 'DrawRandomCardOnDeath' | 'MoveBeside' | 'ConduitBuffAttack' | 'ExplodeOnDeath' | 'BombSpawner' | 'DrawVesselOnHit' | 'DeleteFile' | 'CellBuffSelf' | 'CellDrawRandomCardOnDeath' | 'CellTriStrike' | 'GainGemBlue' | 'GainGemGreen' | 'GainGemOrange' | 'ConduitEnergy' | 'ActivatedRandomPowerEnergy' | 'ConduitFactory' | 'ExplodeGems' | 'ConduitSpawnGems' | 'ShieldGems' | 'ConduitHeal' | 'LatchExplodeOnDeath' | 'LatchBrittle' | 'LatchDeathShield' | 'FileSizeDamage' | 'ActivatedDealDamage' | 'DeathShield' | 'SwapStats' | 'GainGemTriple' | 'Transformer' | 'ActivatedEnergyToBones' | 'ActivatedStatsUp' | 'BrokenCoinLeft' | 'BrokenCoinRight' | 'DrawNewHand' | 'SkeletonStrafe' | 'BoneDigger' | 'DoubleDeath' | 'GemDependant' | 'ActivatedDrawSkeleton' | 'GemsDraw' | 'GreenMage' | 'ActivatedSacrificeDrawCards' | 'Loot' | 'BuffGems' | 'DropRubyOnDeath' | 'ActivatedStatsUpEnergy'
type AppearanceBehaviour = 'RareCardBackground' | 'TerrainBackground' | 'TerrainLayout' | 'SexyGoat' | 'AlternatingBloodDecal' | 'AddSnelkDecals' | 'DynamicPortrait' | 'GiantAnimatedPortrait' | 'StaticGlitch' | 'GoldEmission' | 'AnimatedPortrait' | 'HologramPortrait'

interface Card {
  id: string,
  power: number,
  health: number,
  bloodCost: number,
  boneCost: number,
  energyCost: number,

  temple: 'Nature' | 'Tech' | 'Undead' | 'Wizard',
  complexity: 'Simple' | 'Intermediate' | 'Advanced' | 'Vanilla',
  statIcon: 'None' | 'Ants' | 'Bones' | 'Bell' | 'CardsInHand' | 'Mirror' | 'GreenGems',
  metaCategories: ('ChoiceNode' | 'TraderOffer' | 'GBCPack' | 'GBCPlayable' | 'Rare' | 'Part3Random')[],
  abilities: Abillity[],
  appearanceBehaviours: AppearanceBehaviour[],
  tribes: ('Reptile' | 'Canine' | 'Bird' | 'Hooved' | 'Insect' | 'Squirrel')[],
  traits: ('KillsSurvivors' | 'Ant' | 'Blind' | 'Structure' | 'Terrain' | 'DeathcardCreationNonOption' | 'Undead' | 'FeedsStoat' | 'Fused' | 'Goat' | 'Uncuttable' | 'SatisfiesRingTrial' | 'Wolf' | 'Giant' | 'Pelt' | 'Gem')[],
  gems: ('Blue' | 'Green' | 'Orange')[]

  sacrificable: boolean,
  level: number,

  iceCubeId?: string,
  evolve?: {
    turns: number,
    evolvesTo: string,
  }

  // unused
  gemified: boolean,
  once: boolean,
}

interface Matcher {
  regex: RegExp,
  matcher: (match: RegExpMatchArray, card: Card) => void
}

function foo(textChunk: string): Card {

  const matchers: Matcher[] = [
    {
      regex: /Attack \[(\d+)\] Health \[(\d+)\]/,
      matcher: (m, c) => {
        c.power = Number(m[1])
        c.health = Number(m[2])
      }
    },
    {
      regex: /^Name \[([!A-Z_-\d]+|\w+)\]/,
      matcher: (m, c) => {
        c.id = m[1]
      }
    },
    {
      regex: /Bones Cost \[(\d+)\]/,
      matcher: (m, c) => {
        c.boneCost = Number(m[1])
      }
    },
    {
      regex: /Cost \[(\d+)\]/,
      matcher: (m, c) => {
        c.bloodCost = Number(m[1])
      }
    },
    {
      regex: /Temple \[(\w+)\]/,
      matcher: (m, c) => {
        c.temple = m[1] as hack
      }
    },
    {
      regex: /EnergyCost \[(\d+)\]/,
      matcher: (m, c) => {
        c.energyCost = Number(m[1])
      }
    },
    {
      regex: /CardComplexity \[(\w+)\]/,
      matcher: (m, c) => {
        c.complexity = m[1] as hack
      }
    },
    {
      regex: /Can sacrifice\? \[(True|False)\]/,
      matcher: (m, c) => {
        c.sacrificable = (m[1] === 'True')
      }
    },
    {
      regex: /Is Gemified\? \[(True|False)\]/,
      matcher: (m, c) => {
        c.gemified = (m[1] === 'True')
      }
    },
    {
      regex: /SpecialStatIcon \[(\w+)\]/,
      matcher: (m, c) => {
        c.statIcon = m[1] as hack
      }
    },
    {
      regex: /One per deck\? \[(True|False)\]/,
      matcher: (m, c) => {
        c.once = (m[1] === 'True')
      }
    },
    {
      regex: /Power Level \[(-?\d+)\]/,
      matcher: (m, c) => {
        c.level = Number(m[1])
      }
    },
    {
      regex: /Meta category \[(\w+)\]/,
      matcher: (m, c) => {
        c.metaCategories.push(m[1] as hack)
      }
    },
    {
      regex: /Ability \[(\w+)\]/,
      matcher: (m, c) => {
        c.abilities.push(m[1] as hack)
      }
    },
    {
      regex: /Trait \[(\w+)\]/,
      matcher: (m, c) => {
        c.traits.push(m[1] as hack)
      }
    },
    {
      regex: /Tribe \[(\w+)\]/,
      matcher: (m, c) => {
        c.tribes.push(m[1] as hack)
      }
    },
    {
      regex: /Appearance Behaviour \[(\w+)\]/,
      matcher: (m, c) => {
        c.appearanceBehaviours.push(m[1] as hack)
      }
    },
    {
      regex: /EvolveParams = Turns to evolve \[(\d+)\] Evolves into \[(\w+)\]/,
      matcher: (m, c) => {
        c.evolve = { turns: Number(m[1]), evolvesTo: m[2] }
      }
    },
    {
      regex: /IceCubeParams = \[(\w+)\]/,
      matcher: (m, c) => {
        c.iceCubeId = m[1]
      }
    },
    {
      regex: /Gem \[(\w+)\]/,
      matcher: (m, c) => {
        c.gems.push(m[1] as hack)
      }
    },
    {
      regex: /^(Displayed Name|Description|Boon)/,
      matcher: () => undefined
    },
  ]

  const card: Card = {
    id: '',
    power: 0,
    health: 0,
    bloodCost: 0,
    boneCost: 0,
    energyCost: 0,

    temple: 'Nature',
    complexity: 'Simple',
    statIcon: 'None',
    metaCategories: [],
    abilities: [],
    appearanceBehaviours: [],
    tribes: [],
    traits: [],
    gems: [],

    sacrificable: true,
    level: 0,

    // unused
    gemified: false,
    once: false,
  }

  const lines = textChunk.split('\n')

  outer:
  for (const line of lines) {
    for (const matcher of matchers) {
      const match = line.match(matcher.regex)
      if (match) {
        matcher.matcher(match, card)
        continue outer
      }
    }

    throw new Error('Encounted unparseable line: "' + line + '" in text chunk:\n' + textChunk)
  }

  return card
}

const textChunks = readFileSync('./creatures.txt', 'utf-8').trim().split('---').map(x => x.trim())
const cards = textChunks.map(foo)

writeFileSync('creatures.json', JSON.stringify(cards, undefined, 2))
