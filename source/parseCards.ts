import { readFileSync, writeFileSync } from 'fs'

type hack = any
type CreatureId = 'Adder' | 'Alpha' | 'Amalgam' | 'Amoeba' | 'Ant' | 'AntQueen' | 'Bat' | 'Beaver' | 'Bee' | 'Beehive' | 'Bloodhound' | 'Bullfrog' | 'BurrowingTrap' | 'CagedWolf' | 'Cat' | 'CatUndead' | 'Cockroach' | 'Coyote' | 'Daus' | 'DefaultTail' | 'Elk' | 'ElkCub' | 'FieldMouse' | 'FieldMouse_Fused' | 'Geck' | 'Goat' | 'Grizzly' | 'Hawk' | 'Hrokkall' | 'JerseyDevil' | 'Kingfisher' | 'Kraken' | 'Lammergeier' | 'Maggots' | 'Magpie' | 'Mantis' | 'MantisGod' | 'Mole' | 'MoleMan' | 'Moose' | 'Mothman_Stage1' | 'Mothman_Stage2' | 'Mothman_Stage3' | 'Mule' | 'Opossum' | 'Otter' | 'Ouroboros' | 'PackRat' | 'Porcupine' | 'Pronghorn' | 'Rabbit' | 'RatKing' | 'Rattler' | 'Raven' | 'RavenEgg' | 'Salmon' | 'Shark' | 'Skink' | 'SkinkTail' | 'Skunk' | 'Snapper' | 'Snelk' | 'Sparrow' | 'SquidBell' | 'SquidCards' | 'SquidMirror' | 'Squirrel' | 'SquirrelBall' | 'Stoat' | 'Tail_Bird' | 'Tail_Furry' | 'Tail_Insect' | 'Urayuli' | 'Vulture' | 'Warren' | 'Wolf' | 'WolfCub' | '!DEATHCARD_BASE' | '!DEATHCARD_LESHY' | '!DEATHCARD_VICTORY' | '!GIANTCARD_MOON' | '!STATIC!GLITCH' | 'BaitBucket' | 'CardMergeStones' | 'Dam' | 'DausBell' | 'GoldNugget' | 'PeltGolden' | 'PeltHare' | 'PeltWolf' | 'RingWorm' | 'Smoke' | 'Smoke_Improved' | 'Smoke_NoBones' | 'Starvation' | 'Stinkbug_Talking' | 'Stoat_Talking' | 'Trap' | 'TrapFrog' | 'Wolf_Talking' | '!CORRUPTED' | '!DEATHCARD_PIXEL_BASE' | '!INSPECTOR' | '!MELTER' | '!BOUNTYHUNTER_BASE' | '!BUILDACARD_BASE' | '!FRIENDCARD_BASE' | '!MYCO_OLD_DATA' | '!MYCOCARD_BASE' | 'Angler_Fish_Bad' | 'Angler_Fish_Good' | 'Angler_Fish_More' | 'Angler_Talking' | 'BlueMage_Talking' | 'DUMMY_5-5' | 'Mole_Telegrapher' | 'Mummy_Telegrapher' | 'Ouroboros_Part3' | 'AboveCurve' | 'AlarmBot' | 'Amoebot' | 'AttackConduit' | 'Automaton' | 'BatteryBot' | 'BoltHound' | 'Bombbot' | 'BombMaiden' | 'BustedPrinter' | 'CaptiveFile' | 'CellBuff' | 'CellGift' | 'CellTri' | 'CloserBot' | 'CXformerAdder' | 'CXformerElk' | 'CXformerRaven' | 'CXformerWolf' | 'EmptyVessel' | 'EmptyVessel_BlueGem' | 'EmptyVessel_GreenGem' | 'EmptyVessel_OrangeGem' | 'EnergyConduit' | 'EnergyRoller' | 'FactoryConduit' | 'GemExploder' | 'GemRipper' | 'GemsConduit' | 'GemShielder' | 'GiftBot' | 'HealerConduit' | 'Insectodrone' | 'LatcherBomb' | 'LatcherBrittle' | 'LatcherShield' | 'LeapBot' | 'Librarian' | 'MeatBot' | 'MineCart' | 'NullConduit' | 'PlasmaGunner' | 'RoboMice' | 'RoboSkeleton' | 'SentinelBlue' | 'SentinelGreen' | 'SentinelOrange' | 'SentryBot' | 'SentryBot_Fused' | 'Shieldbot' | 'Shutterbug' | 'Sniper' | 'Steambot' | 'SwapBot' | 'TechMoxTriple' | 'Thickbot' | 'XformerBatBeast' | 'XformerBatBot' | 'XformerGrizzlyBeast' | 'XformerGrizzlyBot' | 'XformerPorcupineBeast' | 'XformerPorcupineBot' | 'AnnoyTower' | 'Boulder' | 'BridgeRailing' | 'BrokenBot' | 'ConduitTower' | 'DeadTree' | 'FrozenOpossum' | 'Stump' | 'TombStone' | 'Tree' | 'Tree_Hologram' | 'Tree_Hologram_SnowCovered' | 'Tree_SnowCovered' | 'Banshee' | 'Bonehound' | 'BonelordHorn' | 'Bonepile' | 'CoinLeft' | 'CoinRight' | 'DeadHand' | 'DeadPets' | 'Draugr' | 'DrownedSoul' | 'Family' | 'FrankNStein' | 'GhostShip' | 'Gravedigger' | 'Gravedigger_Fused' | 'HeadlessHorseman' | 'Mummy' | 'Necromancer' | 'Revenant' | 'Sarcophagus' | 'Skeleton' | 'SkeletonMage' | 'TombRobber' | 'Zombie' | 'BlueMage' | 'BlueMage_Fused' | 'FlyingMage' | 'ForceMage' | 'GemFiend' | 'GreenMage' | 'JuniorSage' | 'MageKnight' | 'MarrowMage' | 'MasterBleene' | 'MasterGoranj' | 'MasterOrlu' | 'MoxDualBG' | 'MoxDualGO' | 'MoxDualOB' | 'MoxEmerald' | 'MoxRuby' | 'MoxSapphire' | 'MoxTriple' | 'MuscleMage' | 'OrangeMage' | 'PracticeMage' | 'PracticeMageSmall' | 'Pupil' | 'RubyGolem' | 'StimMage' | 'None'
type Abillity = 'Deathtouch' | 'BuffNeighbours' | 'RandomAbility' | 'Ant' | 'DrawAnt' | 'Flying' | 'CreateDams' | 'BeesOnHit' | 'GuardDog' | 'Reach' | 'WhackAMole' | 'SteelTrap' | 'CagedWolf' | 'Sacrificial' | 'Cat' | 'DrawCopyOnDeath' | 'CreateBells' | 'Daus' | 'Strafe' | 'Evolve' | 'DrawCopy' | 'TripleBlood' | 'Submerge' | 'GainBattery' | 'JerseyDevil' | 'SubmergeSquid' | 'Lammergeier' | 'CorpseEater' | 'Tutor' | 'SplitStrike' | 'TriStrike' | 'StrafePush' | 'PackMule' | 'Ouroboros' | 'RandomConsumable' | 'Sharp' | 'QuadrupleBones' | 'TailOnHit' | 'DebuffEnemy' | 'BellProximity' | 'CardsInHand' | 'Mirror' | 'SquirrelStrafe' | 'DrawRabbits' | 'AllStrike' | 'SquirrelOrbit' | 'GiantCard' | 'GiantMoon' | 'RandomCard' | 'PreventAttack' | 'TalkingCardChooser' | 'TrapSpawner' | 'ConduitNull' | 'IceCube' | 'BountyHunter' | 'Brittle' | 'BuffEnemy' | 'Sentry' | 'Sniper' | 'DrawRandomCardOnDeath' | 'MoveBeside' | 'ConduitBuffAttack' | 'ExplodeOnDeath' | 'BombSpawner' | 'DrawVesselOnHit' | 'DeleteFile' | 'CellBuffSelf' | 'CellDrawRandomCardOnDeath' | 'CellTriStrike' | 'GainGemBlue' | 'GainGemGreen' | 'GainGemOrange' | 'ConduitEnergy' | 'ActivatedRandomPowerEnergy' | 'ConduitFactory' | 'ExplodeGems' | 'ConduitSpawnGems' | 'ShieldGems' | 'ConduitHeal' | 'LatchExplodeOnDeath' | 'LatchBrittle' | 'LatchDeathShield' | 'FileSizeDamage' | 'ActivatedDealDamage' | 'DeathShield' | 'SwapStats' | 'GainGemTriple' | 'Transformer' | 'ActivatedEnergyToBones' | 'ActivatedStatsUp' | 'BrokenCoinLeft' | 'BrokenCoinRight' | 'DrawNewHand' | 'SkeletonStrafe' | 'BoneDigger' | 'DoubleDeath' | 'GemDependant' | 'ActivatedDrawSkeleton' | 'GemsDraw' | 'GreenMage' | 'ActivatedSacrificeDrawCards' | 'Loot' | 'BuffGems' | 'DropRubyOnDeath' | 'ActivatedStatsUpEnergy'
type AppearanceBehaviour = 'RareCardBackground' | 'TerrainBackground' | 'TerrainLayout' | 'SexyGoat' | 'AlternatingBloodDecal' | 'AddSnelkDecals' | 'DynamicPortrait' | 'GiantAnimatedPortrait' | 'StaticGlitch' | 'GoldEmission' | 'AnimatedPortrait' | 'HologramPortrait'

interface Card {
  id: CreatureId,
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
  oncePerDeck: boolean,
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
        c.id = m[1] as hack
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
        c.oncePerDeck = (m[1] === 'True')
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
    id: 'None',
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
    oncePerDeck: false,

    // unused
    gemified: false,
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
