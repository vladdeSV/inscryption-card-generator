import { Static, Union, Array, Record, Literal, String, Number, Boolean } from 'runtypes'
import { Card } from './card'

export { JldrCreature, CreatureId, Gem, convertJldrCard }

type CreatureId = Static<typeof CreatureId>
const CreatureId = Union(
  Literal('!BOUNTYHUNTER_BASE'),
  Literal('!BUILDACARD_BASE'),
  Literal('!CORRUPTED'),
  Literal('!DEATHCARD_BASE'),
  Literal('!DEATHCARD_LESHY'),
  Literal('!DEATHCARD_PIXEL_BASE'),
  Literal('!DEATHCARD_VICTORY'),
  Literal('!FRIENDCARD_BASE'),
  Literal('!GIANTCARD_MOON'),
  Literal('!GIANTCARD_SHIP'),
  Literal('!INSPECTOR'),
  Literal('!MELTER'),
  Literal('!MYCOCARD_BASE'),
  Literal('!MYCO_OLD_DATA'),
  Literal('!STATIC!GLITCH'),
  Literal('AboveCurve'),
  Literal('Adder'),
  Literal('AlarmBot'),
  Literal('Alpha'),
  Literal('Amalgam'),
  Literal('Amoeba'),
  Literal('Amoebot'),
  Literal('Angler_Fish_Bad'),
  Literal('Angler_Fish_Good'),
  Literal('Angler_Fish_More'),
  Literal('Angler_Talking'),
  Literal('AnnoyTower'),
  Literal('Ant'),
  Literal('AntFlying'),
  Literal('AntQueen'),
  Literal('AquaSquirrel'),
  Literal('AttackConduit'),
  Literal('Automaton'),
  Literal('BaitBucket'),
  Literal('Banshee'),
  Literal('Bat'),
  Literal('BatteryBot'),
  Literal('Beaver'),
  Literal('Bee'),
  Literal('Beehive'),
  Literal('Bloodhound'),
  Literal('BlueMage'),
  Literal('BlueMage_Fused'),
  Literal('BlueMage_Talking'),
  Literal('BoltHound'),
  Literal('BombMaiden'),
  Literal('Bombbot'),
  Literal('Bonehound'),
  Literal('BonelordHorn'),
  Literal('Bonepile'),
  Literal('Boulder'),
  Literal('BridgeRailing'),
  Literal('BrokenBot'),
  Literal('BrokenEgg'),
  Literal('Bull'),
  Literal('Bullfrog'),
  Literal('BurrowingTrap'),
  Literal('BustedPrinter'),
  Literal('CXformerAdder'),
  Literal('CXformerElk'),
  Literal('CXformerRaven'),
  Literal('CXformerWolf'),
  Literal('CagedWolf'),
  Literal('CaptiveFile'),
  Literal('CardMergeStones'),
  Literal('Cat'),
  Literal('CatUndead'),
  Literal('CellBuff'),
  Literal('CellGift'),
  Literal('CellTri'),
  Literal('CloserBot'),
  Literal('Cockroach'),
  Literal('CoinLeft'),
  Literal('CoinRight'),
  Literal('ConduitTower'),
  Literal('Coyote'),
  Literal('Cuckoo'),
  Literal('DUMMY_5-5'),
  Literal('Dam'),
  Literal('Daus'),
  Literal('DausBell'),
  Literal('DeadHand'),
  Literal('DeadPets'),
  Literal('DeadTree'),
  Literal('DefaultTail'),
  Literal('DireWolf'),
  Literal('DireWolfCub'),
  Literal('Draugr'),
  Literal('DrownedSoul'),
  Literal('Elk'),
  Literal('ElkCub'),
  Literal('EmptyVessel'),
  Literal('EmptyVessel_BlueGem'),
  Literal('EmptyVessel_GreenGem'),
  Literal('EmptyVessel_OrangeGem'),
  Literal('EnergyConduit'),
  Literal('EnergyRoller'),
  Literal('FactoryConduit'),
  Literal('Family'),
  Literal('FieldMouse'),
  Literal('FieldMouse_Fused'),
  Literal('FlyingMage'),
  Literal('ForceMage'),
  Literal('FrankNStein'),
  Literal('FrozenOpossum'),
  Literal('Geck'),
  Literal('GemExploder'),
  Literal('GemFiend'),
  Literal('GemRipper'),
  Literal('GemShielder'),
  Literal('GemsConduit'),
  Literal('GhostShip'),
  Literal('GiftBot'),
  Literal('Goat'),
  Literal('GoldNugget'),
  Literal('Gravedigger'),
  Literal('Gravedigger_Fused'),
  Literal('GreenMage'),
  Literal('Grizzly'),
  Literal('Hawk'),
  Literal('HeadlessHorseman'),
  Literal('HealerConduit'),
  Literal('Hodag'),
  Literal('Hrokkall'),
  Literal('Hydra'),
  Literal('HydraEgg'),
  Literal('Ijiraq'),
  Literal('Ijiraq_UnlockScreen'),
  Literal('Insectodrone'),
  Literal('JerseyDevil'),
  Literal('JuniorSage'),
  Literal('Kingfisher'),
  Literal('Kraken'),
  Literal('Lammergeier'),
  Literal('LatcherBomb'),
  Literal('LatcherBrittle'),
  Literal('LatcherShield'),
  Literal('LeapBot'),
  Literal('Librarian'),
  Literal('Lice'),
  Literal('MageKnight'),
  Literal('Maggots'),
  Literal('Magpie'),
  Literal('Mantis'),
  Literal('MantisGod'),
  Literal('MarrowMage'),
  Literal('MasterBleene'),
  Literal('MasterGoranj'),
  Literal('MasterOrlu'),
  Literal('MealWorm'),
  Literal('MeatBot'),
  Literal('MineCart'),
  Literal('Mole'),
  Literal('MoleMan'),
  Literal('MoleSeaman'),
  Literal('Mole_Telegrapher'),
  Literal('Moose'),
  Literal('Mothman_Stage1'),
  Literal('Mothman_Stage2'),
  Literal('Mothman_Stage3'),
  Literal('MoxDualBG'),
  Literal('MoxDualGO'),
  Literal('MoxDualOB'),
  Literal('MoxEmerald'),
  Literal('MoxRuby'),
  Literal('MoxSapphire'),
  Literal('MoxTriple'),
  Literal('MudTurtle'),
  Literal('Mule'),
  Literal('Mummy'),
  Literal('Mummy_Telegrapher'),
  Literal('MuscleMage'),
  Literal('Necromancer'),
  Literal('NullConduit'),
  Literal('Opossum'),
  Literal('OrangeMage'),
  Literal('Otter'),
  Literal('Ouroboros'),
  Literal('Ouroboros_Part3'),
  Literal('PackRat'),
  Literal('PeltGolden'),
  Literal('PeltHare'),
  Literal('PeltWolf'),
  Literal('PlasmaGunner'),
  Literal('Porcupine'),
  Literal('PracticeMage'),
  Literal('PracticeMageSmall'),
  Literal('Pronghorn'),
  Literal('Pupil'),
  Literal('Rabbit'),
  Literal('Raccoon'),
  Literal('RatKing'),
  Literal('Rattler'),
  Literal('Raven'),
  Literal('RavenEgg'),
  Literal('RedHart'),
  Literal('Revenant'),
  Literal('RingWorm'),
  Literal('RoboMice'),
  Literal('RoboSkeleton'),
  Literal('RubyGolem'),
  Literal('Salmon'),
  Literal('Sarcophagus'),
  Literal('SentinelBlue'),
  Literal('SentinelGreen'),
  Literal('SentinelOrange'),
  Literal('SentryBot'),
  Literal('SentryBot_Fused'),
  Literal('Shark'),
  Literal('Shieldbot'),
  Literal('Shutterbug'),
  Literal('Skeleton'),
  Literal('SkeletonMage'),
  Literal('SkeletonParrot'),
  Literal('SkeletonPirate'),
  Literal('Skink'),
  Literal('SkinkTail'),
  Literal('Skunk'),
  Literal('Smoke'),
  Literal('Smoke_Improved'),
  Literal('Smoke_NoBones'),
  Literal('Snapper'),
  Literal('Snelk'),
  Literal('Snelk_Neck'),
  Literal('Sniper'),
  Literal('Sparrow'),
  Literal('SquidBell'),
  Literal('SquidCards'),
  Literal('SquidMirror'),
  Literal('Squirrel'),
  Literal('SquirrelBall'),
  Literal('Starvation'),
  Literal('Steambot'),
  Literal('StimMage'),
  Literal('Stinkbug_Talking'),
  Literal('Stoat'),
  Literal('Stoat_Talking'),
  Literal('Stump'),
  Literal('SwapBot'),
  Literal('Tadpole'),
  Literal('Tail_Bird'),
  Literal('Tail_Furry'),
  Literal('Tail_Insect'),
  Literal('TechMoxTriple'),
  Literal('Thickbot'),
  Literal('TombRobber'),
  Literal('TombStone'),
  Literal('Trap'),
  Literal('TrapFrog'),
  Literal('Tree'),
  Literal('Tree_Hologram'),
  Literal('Tree_Hologram_SnowCovered'),
  Literal('Tree_SnowCovered'),
  Literal('Urayuli'),
  Literal('Vulture'),
  Literal('Warren'),
  Literal('Wolf'),
  Literal('WolfCub'),
  Literal('Wolf_Talking'),
  Literal('Wolverine'),
  Literal('XformerBatBeast'),
  Literal('XformerBatBot'),
  Literal('XformerGrizzlyBeast'),
  Literal('XformerGrizzlyBot'),
  Literal('XformerPorcupineBeast'),
  Literal('XformerPorcupineBot'),
  Literal('Zombie'),
)

const Temple = Union(
  Literal('Tech'),
  Literal('Nature'),
  Literal('Undead'),
  Literal('Wizard'),
)

const MetaCategory = Union(
  Literal('ChoiceNode'),
  Literal('GBCPack'),
  Literal('Rare'),
  Literal('GBCPlayable'),
  Literal('TraderOffer'),
  Literal('Part3Random'),
  Literal('AscensionUnlock'),
)

type Gem = Static<typeof Gem>
const Gem = Union(
  Literal('Blue'),
  Literal('Green'),
  Literal('Orange'),
)

const StatIcon = Union(
  Literal('None'),
  Literal('Ants'),
  Literal('GreenGems'),
  Literal('Bones'),
  Literal('SacrificesThisTurn'),
  Literal('Bell'),
  Literal('CardsInHand'),
  Literal('Mirror'),
)

const Tribe = Union(
  Literal('Reptile'),
  Literal('Canine'),
  Literal('Bird'),
  Literal('Hooved'),
  Literal('Insect'),
  Literal('Squirrel'),
)

const Trait = Union(
  Literal('Terrain'),
  Literal('Fused'),

  Literal('DeathcardCreationNonOption'),
  Literal('Giant'),
  Literal('Uncuttable'),
  Literal('KillsSurvivors'),
  Literal('Ant'),
  Literal('Structure'),
  Literal('Blind'),
  Literal('Undead'),
  Literal('Gem'),
  Literal('FeedsStoat'),
  Literal('Goat'),
  Literal('Lice'),
  Literal('SatisfiesRingTrial'),
  Literal('Pelt'),
  Literal('Wolf'),
)

const SpecialAbility = Union(
  Literal('BountyHunter'),
  Literal('GiantCard'),
  Literal('GiantMoon'),
  Literal('GiantShip'),
  Literal('RandomCard'),
  Literal('TalkingCardChooser'),
  Literal('Ant'),
  Literal('CagedWolf'),
  Literal('Cat'),
  Literal('BrokenCoinLeft'),
  Literal('BrokenCoinRight'),
  Literal('Daus'),
  Literal('GreenMage'),
  Literal('Shapeshifter'),
  Literal('JerseyDevil'),
  Literal('Lammergeier'),
  Literal('PackMule'),
  Literal('Ouroboros'),
  Literal('SpawnLice'),
  Literal('SacrificesThisTurn'),
  Literal('BellProximity'),
  Literal('CardsInHand'),
  Literal('Mirror'),
  Literal('TrapSpawner'),
)

const Abililty = Union(
  Literal('Reach'),
  Literal('AllStrike'),
  Literal('SquirrelOrbit'),
  Literal('MadeOfStone'),
  Literal('ConduitNull'),
  Literal('IceCube'),
  Literal('Deathtouch'),
  Literal('BuffEnemy'),
  Literal('BuffNeighbours'),
  Literal('RandomAbility'),
  Literal('Brittle'),
  Literal('Sentry'),
  Literal('Sharp'),
  Literal('Sniper'),
  Literal('DrawRandomCardOnDeath'),
  Literal('Flying'),
  Literal('DrawAnt'),
  Literal('Submerge'),
  Literal('ConduitBuffAttack'),
  Literal('GainBattery'),
  Literal('CreateDams'),
  Literal('BeesOnHit'),
  Literal('GuardDog'),
  Literal('GemsDraw'),
  Literal('MoveBeside'),
  Literal('BombSpawner'),
  Literal('ExplodeOnDeath'),
  Literal('ActivatedEnergyToBones'),
  Literal('ActivatedStatsUp'),
  Literal('StrafeSwap'),
  Literal('WhackAMole'),
  Literal('SteelTrap'),
  Literal('DrawVesselOnHit'),
  Literal('Strafe'),
  Literal('DeleteFile'),
  Literal('Sacrificial'),
  Literal('CellBuffSelf'),
  Literal('CellDrawRandomCardOnDeath'),
  Literal('CellTriStrike'),
  Literal('SplitStrike'),
  Literal('DrawCopyOnDeath'),
  Literal('QuadrupleBones'),
  Literal('CreateEgg'),
  Literal('CreateBells'),
  Literal('DrawNewHand'),
  Literal('TripleBlood'),
  Literal('DoubleStrike'),
  Literal('BoneDigger'),
  Literal('Evolve'),
  Literal('GainGemBlue'),
  Literal('GainGemGreen'),
  Literal('GainGemOrange'),
  Literal('ConduitEnergy'),
  Literal('ActivatedRandomPowerEnergy'),
  Literal('ConduitFactory'),
  Literal('DrawCopy'),
  Literal('PreventAttack'),
  Literal('ExplodeGems'),
  Literal('GemDependant'),
  Literal('ShieldGems'),
  Literal('ConduitSpawnGems'),
  Literal('SkeletonStrafe'),
  Literal('ConduitHeal'),
  Literal('GainAttackOnKill'),
  Literal('TriStrike'),
  Literal('HydraEgg'),
  Literal('SubmergeSquid'),
  Literal('LatchExplodeOnDeath'),
  Literal('LatchBrittle'),
  Literal('LatchDeathShield'),
  Literal('FileSizeDamage'),
  Literal('CorpseEater'),
  Literal('Tutor'),
  Literal('ActivatedSacrificeDrawCards'),
  Literal('Loot'),
  Literal('Morsel'),
  Literal('StrafePush'),
  Literal('GainGemTriple'),
  Literal('DeathShield'),
  Literal('DoubleDeath'),
  Literal('BuffGems'),
  Literal('RandomConsumable'),
  Literal('ActivatedDealDamage'),
  Literal('OpponentBones'),
  Literal('DropRubyOnDeath'),
  Literal('TailOnHit'),
  Literal('DebuffEnemy'),
  Literal('SquirrelStrafe'),
  Literal('ActivatedStatsUpEnergy'),
  Literal('SwapStats'),
  Literal('ActivatedDrawSkeleton'),
  Literal('DrawRabbits'),
  Literal('Transformer'),
)

const Complexity = Union(
  Literal('Advanced'),
  Literal('Vanilla'),
  Literal('Simple'),
  Literal('Intermediate'),
)

const AppearanceBehaviour = Union(
  Literal('RareCardBackground'),
  Literal('StaticGlitch'),
  Literal('TerrainBackground'),
  Literal('TerrainLayout'),
  Literal('AlternatingBloodDecal'),
  Literal('SexyGoat'),
  Literal('GoldEmission'),
  Literal('DefaultEmission'),
  Literal('RedEmission'),
  Literal('AddSnelkDecals'),

  Literal('GiantAnimatedPortrait'),
  Literal('MoonParticleEffects'),
  Literal('DynamicPortrait'),
  Literal('HologramPortrait'),
  Literal('AnimatedPortrait'),
)

const TailName = Union(
  Literal('Tail_Furry'),
  Literal('Tail_Insect'),
  Literal('Tail_Bird'),
  Literal('SkinkTail'),
)

type JldrCreature = Static<typeof JldrCreature>
const JldrCreature = Record({
  metaCategories: Array(MetaCategory),
  gemsCost: Array(Gem),
  specialStatIcon: StatIcon,
  tribes: Array(Tribe),
  traits: Array(Trait),
  specialAbilities: Array(SpecialAbility),
  abilities: Array(Abililty),
  defaultEvolutionName: String,
  flipPortraitForStrafe: Boolean,
  energyCost: Number,
  bonesCost: Number,
  baseHealth: Number,
  bloodCost: Number,
  cardComplexity: Complexity,
  onePerDeck: Boolean,
  name: String, //CreatureId,
  displayedName: String,
  description: String,
  hideAttackAndHealth: Boolean,
  temple: Temple,
  baseAttack: Number,
  appearanceBehaviour: Array(AppearanceBehaviour),
  iceCubeName: CreatureId.optional(),
  tailName: TailName.optional(),
  evolveIntoName: CreatureId.optional(),
  evolveTurns: Number.optional(), // 1
})

function convertJldrCard(jsonCard: JldrCreature): Card {
  const card: Card = {
    name: '',
    health: 0,
    power: 0,
    sigils: [],
    tribes: [],
    portrait: undefined,
    statIcon: undefined,
    cost: undefined,
    temple: 'nature',
    flags: {
      golden: false,
      rare: false,
      terrain: false,
      terrainLayout: false,
      squid: false,
      enhanced: false,
      redEmission: false,
      fused: false,
      smoke: false,
      paint: false,
      blood: false,
      hidePowerAndHealth: false,
    },
  }

  card.gameId = jsonCard.name
  card.power = jsonCard.baseAttack
  card.health = jsonCard.baseHealth

  card.flags.enhanced = (jsonCard.name === 'Smoke_Improved') || jsonCard.appearanceBehaviour.includes('DefaultEmission')
  card.flags.squid = !!jsonCard.name.match(/Squid(Mirror|Bell|Cards)/)
  card.flags.terrain = jsonCard.appearanceBehaviour.includes('TerrainLayout')
  card.flags.golden = jsonCard.appearanceBehaviour.includes('GoldEmission')
  card.flags.fused = jsonCard.traits.includes('Fused')

  card.flags.rare = jsonCard.metaCategories.includes('Rare') || jsonCard.appearanceBehaviour.includes('RareCardBackground')
  card.flags.terrain = jsonCard.traits.includes('Terrain') || jsonCard.appearanceBehaviour.includes('TerrainBackground')
  card.flags.terrainLayout = jsonCard.appearanceBehaviour.includes('TerrainLayout')
  card.flags.blood = jsonCard.appearanceBehaviour.includes('AlternatingBloodDecal')
  card.flags.smoke = !!jsonCard.name.match(/^Smoke/)

  // if (jsonCard.appearanceBehaviours.includes('AddSnelkDecals')) {
  //   card.decals.push('snelk')
  // }

  // if (jsonCard.name === '!DEATHCARD_LESHY') {
  //   card.decals.push('leshy')
  // }

  card.statIcon = ((statIcon: JldrCreature['specialStatIcon']): Card['statIcon'] => {
    switch (statIcon) {
      case 'Ants': return 'ants'
      case 'Bell': return 'bell'
      case 'Bones': return 'bones'
      case 'CardsInHand': return 'cardsinhand'
      case 'GreenGems': return 'greengems'
      case 'Mirror': return 'mirror'
      case 'SacrificesThisTurn': return 'sacrificesthisturn'
    }
  })(jsonCard.specialStatIcon)

  for (const tribe of jsonCard.tribes) {
    switch (tribe) {
      case 'Bird': card.tribes.push('bird'); break
      case 'Canine': card.tribes.push('canine'); break
      case 'Hooved': card.tribes.push('hooved'); break
      case 'Insect': card.tribes.push('insect'); break
      case 'Reptile': card.tribes.push('reptile'); break
      case 'Squirrel': card.tribes.push('squirrel'); break
      default: throw `invalid tribe: ${tribe}`
    }
  }

  switch (jsonCard.temple) {
    case 'Nature': card.temple = 'nature'; break
    case 'Tech': card.temple = 'tech'; break
    case 'Undead': card.temple = 'undead'; break
    case 'Wizard': card.temple = 'wizard'; break
    default: throw `invalid temple: ${jsonCard.temple}`
  }

  if (jsonCard.bloodCost != 0) {
    card.cost = { type: 'blood', amount: jsonCard.bloodCost }
  } else if (jsonCard.bonesCost != 0) {
    card.cost = { type: 'bone', amount: jsonCard.bonesCost }
  } else if (jsonCard.energyCost != 0) {
    card.cost = { type: 'energy', amount: jsonCard.energyCost }
  } else if (jsonCard.gemsCost.length) {
    const gemConverter = (gem: Gem): 'blue' | 'green' | 'orange' => {
      switch (gem) {
        case 'Blue': return 'blue'
        case 'Green': return 'green'
        case 'Orange': return 'orange'
      }
    }

    card.cost = { type: 'gem', gems: jsonCard.gemsCost.map(gemConverter) }
  }

  for (const ability of jsonCard.abilities) {
    switch (ability) {
      case 'Reach': card.sigils.push('reach'); break
      case 'AllStrike': card.sigils.push('allstrike'); break
      case 'SquirrelOrbit': card.sigils.push('squirrelorbit'); break
      case 'MadeOfStone': card.sigils.push('madeofstone'); break
      case 'ConduitNull': card.sigils.push('conduitnull'); break
      case 'IceCube': card.sigils.push('icecube'); break
      case 'Deathtouch': card.sigils.push('deathtouch'); break
      case 'BuffEnemy': card.sigils.push('buffenemy'); break
      case 'BuffNeighbours': card.sigils.push('buffneighbours'); break
      case 'RandomAbility': card.sigils.push('randomability'); break
      case 'Brittle': card.sigils.push('brittle'); break
      case 'Sentry': card.sigils.push('sentry'); break
      case 'Sharp': card.sigils.push('sharp'); break
      case 'Sniper': card.sigils.push('sniper'); break
      case 'DrawRandomCardOnDeath': card.sigils.push('drawrandomcardondeath'); break
      case 'Flying': card.sigils.push('flying'); break
      case 'DrawAnt': card.sigils.push('drawant'); break
      case 'Submerge': card.sigils.push('submerge'); break
      case 'ConduitBuffAttack': card.sigils.push('conduitbuffattack'); break
      case 'GainBattery': card.sigils.push('gainbattery'); break
      case 'CreateDams': card.sigils.push('createdams'); break
      case 'BeesOnHit': card.sigils.push('beesonhit'); break
      case 'GuardDog': card.sigils.push('guarddog'); break
      case 'GemsDraw': card.sigils.push('gemsdraw'); break
      case 'MoveBeside': card.sigils.push('movebeside'); break
      case 'BombSpawner': card.sigils.push('bombspawner'); break
      case 'ExplodeOnDeath': card.sigils.push('explodeondeath'); break
      case 'ActivatedEnergyToBones': card.sigils.push('activatedenergytobones'); break
      case 'ActivatedStatsUp': card.sigils.push('activatedstatsup'); break
      case 'StrafeSwap': card.sigils.push('strafeswap'); break
      case 'WhackAMole': card.sigils.push('whackamole'); break
      case 'SteelTrap': card.sigils.push('steeltrap'); break
      case 'DrawVesselOnHit': card.sigils.push('drawvesselonhit'); break
      case 'Strafe': card.sigils.push('strafe'); break
      case 'DeleteFile': card.sigils.push('deletefile'); break
      case 'Sacrificial': card.sigils.push('sacrificial'); break
      case 'CellBuffSelf': card.sigils.push('cellbuffself'); break
      case 'CellDrawRandomCardOnDeath': card.sigils.push('celldrawrandomcardondeath'); break
      case 'CellTriStrike': card.sigils.push('celltristrike'); break
      case 'SplitStrike': card.sigils.push('splitstrike'); break
      case 'DrawCopyOnDeath': card.sigils.push('drawcopyondeath'); break
      case 'QuadrupleBones': card.sigils.push('quadruplebones'); break
      case 'CreateEgg': card.sigils.push('createegg'); break
      case 'CreateBells': card.sigils.push('createbells'); break
      case 'DrawNewHand': card.sigils.push('drawnewhand'); break
      case 'TripleBlood': card.sigils.push('tripleblood'); break
      case 'DoubleStrike': card.sigils.push('doublestrike'); break
      case 'BoneDigger': card.sigils.push('bonedigger'); break
      case 'Evolve': card.sigils.push('evolve'); break
      case 'GainGemBlue': card.sigils.push('gaingemblue'); break
      case 'GainGemGreen': card.sigils.push('gaingemgreen'); break
      case 'GainGemOrange': card.sigils.push('gaingemorange'); break
      case 'ConduitEnergy': card.sigils.push('conduitenergy'); break
      case 'ActivatedRandomPowerEnergy': card.sigils.push('activatedrandompowerenergy'); break
      case 'ConduitFactory': card.sigils.push('conduitfactory'); break
      case 'DrawCopy': card.sigils.push('drawcopy'); break
      case 'PreventAttack': card.sigils.push('preventattack'); break
      case 'ExplodeGems': card.sigils.push('explodegems'); break
      case 'GemDependant': card.sigils.push('gemdependant'); break
      case 'ShieldGems': card.sigils.push('shieldgems'); break
      case 'ConduitSpawnGems': card.sigils.push('conduitspawngems'); break
      case 'SkeletonStrafe': card.sigils.push('skeletonstrafe'); break
      case 'ConduitHeal': card.sigils.push('conduitheal'); break
      case 'GainAttackOnKill': card.sigils.push('gainattackonkill'); break
      case 'TriStrike': card.sigils.push('tristrike'); break
      case 'HydraEgg': card.sigils.push('hydraegg'); break
      case 'SubmergeSquid': card.sigils.push('submergesquid'); break
      case 'LatchExplodeOnDeath': card.sigils.push('latchexplodeondeath'); break
      case 'LatchBrittle': card.sigils.push('latchbrittle'); break
      case 'LatchDeathShield': card.sigils.push('latchdeathshield'); break
      case 'FileSizeDamage': card.sigils.push('filesizedamage'); break
      case 'CorpseEater': card.sigils.push('corpseeater'); break
      case 'Tutor': card.sigils.push('tutor'); break
      case 'ActivatedSacrificeDrawCards': card.sigils.push('activatedsacrificedrawcards'); break
      case 'Loot': card.sigils.push('loot'); break
      case 'Morsel': card.sigils.push('morsel'); break
      case 'StrafePush': card.sigils.push('strafepush'); break
      case 'GainGemTriple': card.sigils.push('gaingemtriple'); break
      case 'DeathShield': card.sigils.push('deathshield'); break
      case 'DoubleDeath': card.sigils.push('doubledeath'); break
      case 'BuffGems': card.sigils.push('buffgems'); break
      case 'RandomConsumable': card.sigils.push('randomconsumable'); break
      case 'ActivatedDealDamage': card.sigils.push('activateddealdamage'); break
      case 'OpponentBones': card.sigils.push('opponentbones'); break
      case 'DropRubyOnDeath': card.sigils.push('droprubyondeath'); break
      case 'TailOnHit': card.sigils.push('tailonhit'); break
      case 'DebuffEnemy': card.sigils.push('debuffenemy'); break
      case 'SquirrelStrafe': card.sigils.push('squirrelstrafe'); break
      case 'ActivatedStatsUpEnergy': card.sigils.push('activatedstatsupenergy'); break
      case 'SwapStats': card.sigils.push('swapstats'); break
      case 'ActivatedDrawSkeleton': card.sigils.push('activateddrawskeleton'); break
      case 'DrawRabbits': card.sigils.push('drawrabbits'); break
      case 'Transformer': card.sigils.push('transformer'); break
    }
  }

  switch (jsonCard.name) {
    case '!BOUNTYHUNTER_BASE': card.portrait = { type: 'creature', id: '!bountyhunter_base' }; break
    case '!BUILDACARD_BASE': card.portrait = { type: 'creature', id: '!buildacard_base' }; break
    case '!CORRUPTED': card.portrait = { type: 'creature', id: '!corrupted' }; break
    case '!DEATHCARD_BASE': card.portrait = { type: 'creature', id: '!deathcard_base' }; break
    case '!DEATHCARD_LESHY': card.portrait = { type: 'creature', id: '!deathcard_leshy' }; card.special = 'leshy'; break
    case '!DEATHCARD_PIXEL_BASE': card.portrait = { type: 'creature', id: '!deathcard_pixel_base' }; break
    case '!DEATHCARD_VICTORY': card.portrait = { type: 'creature', id: '!deathcard_victory' }; break
    case '!FRIENDCARD_BASE': card.portrait = { type: 'creature', id: '!friendcard_base' }; break
    case '!GIANTCARD_MOON': card.portrait = { type: 'creature', id: '!giantcard_moon' }; break
    case '!GIANTCARD_SHIP': card.portrait = { type: 'creature', id: '!giantcard_ship' }; break
    case '!INSPECTOR': card.portrait = { type: 'creature', id: '!inspector' }; break
    case '!MELTER': card.portrait = { type: 'creature', id: '!melter' }; break
    case '!MYCOCARD_BASE': card.portrait = { type: 'creature', id: '!mycocard_base' }; break
    case '!MYCO_OLD_DATA': card.portrait = { type: 'creature', id: '!myco_old_data' }; break
    case '!STATIC!GLITCH': card.portrait = { type: 'creature', id: '!static!glitch' }; break
    case 'AboveCurve': card.portrait = { type: 'creature', id: 'abovecurve' }; break
    case 'Adder': card.portrait = { type: 'creature', id: 'adder' }; break
    case 'AlarmBot': card.portrait = { type: 'creature', id: 'alarmbot' }; break
    case 'Alpha': card.portrait = { type: 'creature', id: 'alpha' }; break
    case 'Amalgam': card.portrait = { type: 'creature', id: 'amalgam' }; break
    case 'Amoeba': card.portrait = { type: 'creature', id: 'amoeba' }; break
    case 'Amoebot': card.portrait = { type: 'creature', id: 'amoebot' }; break
    case 'Angler_Fish_Bad': card.portrait = { type: 'creature', id: 'angler_fish_bad' }; break
    case 'Angler_Fish_Good': card.portrait = { type: 'creature', id: 'angler_fish_good' }; break
    case 'Angler_Fish_More': card.portrait = { type: 'creature', id: 'angler_fish_more' }; break
    case 'Angler_Talking': card.portrait = { type: 'creature', id: 'angler_talking' }; break
    case 'AnnoyTower': card.portrait = { type: 'creature', id: 'annoytower' }; break
    case 'Ant': card.portrait = { type: 'creature', id: 'ant' }; break
    case 'AntFlying': card.portrait = { type: 'creature', id: 'antflying' }; break
    case 'AntQueen': card.portrait = { type: 'creature', id: 'antqueen' }; break
    case 'AquaSquirrel': card.portrait = { type: 'creature', id: 'aquasquirrel' }; break
    case 'AttackConduit': card.portrait = { type: 'creature', id: 'attackconduit' }; break
    case 'Automaton': card.portrait = { type: 'creature', id: 'automaton' }; break
    case 'BaitBucket': card.portrait = { type: 'creature', id: 'baitbucket' }; break
    case 'Banshee': card.portrait = { type: 'creature', id: 'banshee' }; break
    case 'Bat': card.portrait = { type: 'creature', id: 'bat' }; break
    case 'BatteryBot': card.portrait = { type: 'creature', id: 'batterybot' }; break
    case 'Beaver': card.portrait = { type: 'creature', id: 'beaver' }; break
    case 'Bee': card.portrait = { type: 'creature', id: 'bee' }; break
    case 'Beehive': card.portrait = { type: 'creature', id: 'beehive' }; break
    case 'Bloodhound': card.portrait = { type: 'creature', id: 'bloodhound' }; break
    case 'BlueMage': card.portrait = { type: 'creature', id: 'bluemage' }; break
    case 'BlueMage_Fused': card.portrait = { type: 'creature', id: 'bluemage_fused' }; break
    case 'BlueMage_Talking': card.portrait = { type: 'creature', id: 'bluemage_talking' }; break
    case 'BoltHound': card.portrait = { type: 'creature', id: 'bolthound' }; break
    case 'BombMaiden': card.portrait = { type: 'creature', id: 'bombmaiden' }; break
    case 'Bombbot': card.portrait = { type: 'creature', id: 'bombbot' }; break
    case 'Bonehound': card.portrait = { type: 'creature', id: 'bonehound' }; break
    case 'BonelordHorn': card.portrait = { type: 'creature', id: 'bonelordhorn' }; break
    case 'Bonepile': card.portrait = { type: 'creature', id: 'bonepile' }; break
    case 'Boulder': card.portrait = { type: 'creature', id: 'boulder' }; break
    case 'BridgeRailing': card.portrait = { type: 'creature', id: 'bridgerailing' }; break
    case 'BrokenBot': card.portrait = { type: 'creature', id: 'brokenbot' }; break
    case 'BrokenEgg': card.portrait = { type: 'creature', id: 'brokenegg' }; break
    case 'Bull': card.portrait = { type: 'creature', id: 'bull' }; break
    case 'Bullfrog': card.portrait = { type: 'creature', id: 'bullfrog' }; break
    case 'BurrowingTrap': card.portrait = { type: 'creature', id: 'burrowingtrap' }; break
    case 'BustedPrinter': card.portrait = { type: 'creature', id: 'bustedprinter' }; break
    case 'CXformerAdder': card.portrait = { type: 'creature', id: 'cxformeradder' }; break
    case 'CXformerElk': card.portrait = { type: 'creature', id: 'cxformerelk' }; break
    case 'CXformerRaven': card.portrait = { type: 'creature', id: 'cxformerraven' }; break
    case 'CXformerWolf': card.portrait = { type: 'creature', id: 'cxformerwolf' }; break
    case 'CagedWolf': card.portrait = { type: 'creature', id: 'cagedwolf' }; break
    case 'CaptiveFile': card.portrait = { type: 'creature', id: 'captivefile' }; break
    case 'CardMergeStones': card.portrait = { type: 'creature', id: 'cardmergestones' }; break
    case 'Cat': card.portrait = { type: 'creature', id: 'cat' }; break
    case 'CatUndead': card.portrait = { type: 'creature', id: 'catundead' }; break
    case 'CellBuff': card.portrait = { type: 'creature', id: 'cellbuff' }; break
    case 'CellGift': card.portrait = { type: 'creature', id: 'cellgift' }; break
    case 'CellTri': card.portrait = { type: 'creature', id: 'celltri' }; break
    case 'CloserBot': card.portrait = { type: 'creature', id: 'closerbot' }; break
    case 'Cockroach': card.portrait = { type: 'creature', id: 'cockroach' }; break
    case 'CoinLeft': card.portrait = { type: 'creature', id: 'coinleft' }; break
    case 'CoinRight': card.portrait = { type: 'creature', id: 'coinright' }; break
    case 'ConduitTower': card.portrait = { type: 'creature', id: 'conduittower' }; break
    case 'Coyote': card.portrait = { type: 'creature', id: 'coyote' }; break
    case 'Cuckoo': card.portrait = { type: 'creature', id: 'cuckoo' }; break
    case 'DUMMY_5-5': card.portrait = { type: 'creature', id: 'dummy_5-5' }; break
    case 'Dam': card.portrait = { type: 'creature', id: 'dam' }; break
    case 'Daus': card.portrait = { type: 'creature', id: 'daus' }; break
    case 'DausBell': card.portrait = { type: 'creature', id: 'dausbell' }; break
    case 'DeadHand': card.portrait = { type: 'creature', id: 'deadhand' }; break
    case 'DeadPets': card.portrait = { type: 'creature', id: 'deadpets' }; break
    case 'DeadTree': card.portrait = { type: 'creature', id: 'deadtree' }; break
    case 'DefaultTail': card.portrait = { type: 'creature', id: 'defaulttail' }; break
    case 'DireWolf': card.portrait = { type: 'creature', id: 'direwolf' }; break
    case 'DireWolfCub': card.portrait = { type: 'creature', id: 'direwolfcub' }; break
    case 'Draugr': card.portrait = { type: 'creature', id: 'draugr' }; break
    case 'DrownedSoul': card.portrait = { type: 'creature', id: 'drownedsoul' }; break
    case 'Elk': card.portrait = { type: 'creature', id: 'elk' }; break
    case 'ElkCub': card.portrait = { type: 'creature', id: 'elkcub' }; break
    case 'EmptyVessel': card.portrait = { type: 'creature', id: 'emptyvessel' }; break
    case 'EmptyVessel_BlueGem': card.portrait = { type: 'creature', id: 'emptyvessel_bluegem' }; break
    case 'EmptyVessel_GreenGem': card.portrait = { type: 'creature', id: 'emptyvessel_greengem' }; break
    case 'EmptyVessel_OrangeGem': card.portrait = { type: 'creature', id: 'emptyvessel_orangegem' }; break
    case 'EnergyConduit': card.portrait = { type: 'creature', id: 'energyconduit' }; break
    case 'EnergyRoller': card.portrait = { type: 'creature', id: 'energyroller' }; break
    case 'FactoryConduit': card.portrait = { type: 'creature', id: 'factoryconduit' }; break
    case 'Family': card.portrait = { type: 'creature', id: 'family' }; break
    case 'FieldMouse': card.portrait = { type: 'creature', id: 'fieldmouse' }; break
    case 'FieldMouse_Fused': card.portrait = { type: 'creature', id: 'fieldmouse_fused' }; break
    case 'FlyingMage': card.portrait = { type: 'creature', id: 'flyingmage' }; break
    case 'ForceMage': card.portrait = { type: 'creature', id: 'forcemage' }; break
    case 'FrankNStein': card.portrait = { type: 'creature', id: 'franknstein' }; break
    case 'FrozenOpossum': card.portrait = { type: 'creature', id: 'frozenopossum' }; break
    case 'Geck': card.portrait = { type: 'creature', id: 'geck' }; break
    case 'GemExploder': card.portrait = { type: 'creature', id: 'gemexploder' }; break
    case 'GemFiend': card.portrait = { type: 'creature', id: 'gemfiend' }; break
    case 'GemRipper': card.portrait = { type: 'creature', id: 'gemripper' }; break
    case 'GemShielder': card.portrait = { type: 'creature', id: 'gemshielder' }; break
    case 'GemsConduit': card.portrait = { type: 'creature', id: 'gemsconduit' }; break
    case 'GhostShip': card.portrait = { type: 'creature', id: 'ghostship' }; break
    case 'GiftBot': card.portrait = { type: 'creature', id: 'giftbot' }; break
    case 'Goat': card.portrait = { type: 'creature', id: 'goat' }; break
    case 'GoldNugget': card.portrait = { type: 'creature', id: 'goldnugget' }; break
    case 'Gravedigger': card.portrait = { type: 'creature', id: 'gravedigger' }; break
    case 'Gravedigger_Fused': card.portrait = { type: 'creature', id: 'gravedigger_fused' }; break
    case 'GreenMage': card.portrait = { type: 'creature', id: 'greenmage' }; break
    case 'Grizzly': card.portrait = { type: 'creature', id: 'grizzly' }; break
    case 'Hawk': card.portrait = { type: 'creature', id: 'hawk' }; break
    case 'HeadlessHorseman': card.portrait = { type: 'creature', id: 'headlesshorseman' }; break
    case 'HealerConduit': card.portrait = { type: 'creature', id: 'healerconduit' }; break
    case 'Hodag': card.portrait = { type: 'creature', id: 'hodag' }; break
    case 'Hrokkall': card.portrait = { type: 'creature', id: 'hrokkall' }; break
    case 'Hydra': card.portrait = { type: 'creature', id: 'hydra' }; break
    case 'HydraEgg': card.portrait = { type: 'creature', id: 'hydraegg' }; break
    case 'Ijiraq': card.portrait = { type: 'creature', id: 'ijiraq' }; break
    case 'Ijiraq_UnlockScreen': card.portrait = { type: 'creature', id: 'ijiraq_unlockscreen' }; break
    case 'Insectodrone': card.portrait = { type: 'creature', id: 'insectodrone' }; break
    case 'JerseyDevil': card.portrait = { type: 'creature', id: 'jerseydevil' }; break
    case 'JuniorSage': card.portrait = { type: 'creature', id: 'juniorsage' }; break
    case 'Kingfisher': card.portrait = { type: 'creature', id: 'kingfisher' }; break
    case 'Kraken': card.portrait = { type: 'creature', id: 'kraken' }; break
    case 'Lammergeier': card.portrait = { type: 'creature', id: 'lammergeier' }; break
    case 'LatcherBomb': card.portrait = { type: 'creature', id: 'latcherbomb' }; break
    case 'LatcherBrittle': card.portrait = { type: 'creature', id: 'latcherbrittle' }; break
    case 'LatcherShield': card.portrait = { type: 'creature', id: 'latchershield' }; break
    case 'LeapBot': card.portrait = { type: 'creature', id: 'leapbot' }; break
    case 'Librarian': card.portrait = { type: 'creature', id: 'librarian' }; break
    case 'Lice': card.portrait = { type: 'creature', id: 'lice' }; break
    case 'MageKnight': card.portrait = { type: 'creature', id: 'mageknight' }; break
    case 'Maggots': card.portrait = { type: 'creature', id: 'maggots' }; break
    case 'Magpie': card.portrait = { type: 'creature', id: 'magpie' }; break
    case 'Mantis': card.portrait = { type: 'creature', id: 'mantis' }; break
    case 'MantisGod': card.portrait = { type: 'creature', id: 'mantisgod' }; break
    case 'MarrowMage': card.portrait = { type: 'creature', id: 'marrowmage' }; break
    case 'MasterBleene': card.portrait = { type: 'creature', id: 'masterbleene' }; break
    case 'MasterGoranj': card.portrait = { type: 'creature', id: 'mastergoranj' }; break
    case 'MasterOrlu': card.portrait = { type: 'creature', id: 'masterorlu' }; break
    case 'MealWorm': card.portrait = { type: 'creature', id: 'mealworm' }; break
    case 'MeatBot': card.portrait = { type: 'creature', id: 'meatbot' }; break
    case 'MineCart': card.portrait = { type: 'creature', id: 'minecart' }; break
    case 'Mole': card.portrait = { type: 'creature', id: 'mole' }; break
    case 'MoleMan': card.portrait = { type: 'creature', id: 'moleman' }; break
    case 'MoleSeaman': card.portrait = { type: 'creature', id: 'moleseaman' }; break
    case 'Mole_Telegrapher': card.portrait = { type: 'creature', id: 'mole_telegrapher' }; break
    case 'Moose': card.portrait = { type: 'creature', id: 'moose' }; break
    case 'Mothman_Stage1': card.portrait = { type: 'creature', id: 'mothman_stage1' }; break
    case 'Mothman_Stage2': card.portrait = { type: 'creature', id: 'mothman_stage2' }; break
    case 'Mothman_Stage3': card.portrait = { type: 'creature', id: 'mothman_stage3' }; break
    case 'MoxDualBG': card.portrait = { type: 'creature', id: 'moxdualbg' }; break
    case 'MoxDualGO': card.portrait = { type: 'creature', id: 'moxdualgo' }; break
    case 'MoxDualOB': card.portrait = { type: 'creature', id: 'moxdualob' }; break
    case 'MoxEmerald': card.portrait = { type: 'creature', id: 'moxemerald' }; break
    case 'MoxRuby': card.portrait = { type: 'creature', id: 'moxruby' }; break
    case 'MoxSapphire': card.portrait = { type: 'creature', id: 'moxsapphire' }; break
    case 'MoxTriple': card.portrait = { type: 'creature', id: 'moxtriple' }; break
    case 'MudTurtle': card.portrait = { type: 'creature', id: 'mudturtle' }; break
    case 'Mule': card.portrait = { type: 'creature', id: 'mule' }; break
    case 'Mummy': card.portrait = { type: 'creature', id: 'mummy' }; break
    case 'Mummy_Telegrapher': card.portrait = { type: 'creature', id: 'mummy_telegrapher' }; break
    case 'MuscleMage': card.portrait = { type: 'creature', id: 'musclemage' }; break
    case 'Necromancer': card.portrait = { type: 'creature', id: 'necromancer' }; break
    case 'NullConduit': card.portrait = { type: 'creature', id: 'nullconduit' }; break
    case 'Opossum': card.portrait = { type: 'creature', id: 'opossum' }; break
    case 'OrangeMage': card.portrait = { type: 'creature', id: 'orangemage' }; break
    case 'Otter': card.portrait = { type: 'creature', id: 'otter' }; break
    case 'Ouroboros': card.portrait = { type: 'creature', id: 'ouroboros' }; break
    case 'Ouroboros_Part3': card.portrait = { type: 'creature', id: 'ouroboros_part3' }; break
    case 'PackRat': card.portrait = { type: 'creature', id: 'packrat' }; break
    case 'PeltGolden': card.portrait = { type: 'creature', id: 'peltgolden' }; break
    case 'PeltHare': card.portrait = { type: 'creature', id: 'pelthare' }; break
    case 'PeltWolf': card.portrait = { type: 'creature', id: 'peltwolf' }; break
    case 'PlasmaGunner': card.portrait = { type: 'creature', id: 'plasmagunner' }; break
    case 'Porcupine': card.portrait = { type: 'creature', id: 'porcupine' }; break
    case 'PracticeMage': card.portrait = { type: 'creature', id: 'practicemage' }; break
    case 'PracticeMageSmall': card.portrait = { type: 'creature', id: 'practicemagesmall' }; break
    case 'Pronghorn': card.portrait = { type: 'creature', id: 'pronghorn' }; break
    case 'Pupil': card.portrait = { type: 'creature', id: 'pupil' }; break
    case 'Rabbit': card.portrait = { type: 'creature', id: 'rabbit' }; break
    case 'Raccoon': card.portrait = { type: 'creature', id: 'raccoon' }; break
    case 'RatKing': card.portrait = { type: 'creature', id: 'ratking' }; break
    case 'Rattler': card.portrait = { type: 'creature', id: 'rattler' }; break
    case 'Raven': card.portrait = { type: 'creature', id: 'raven' }; break
    case 'RavenEgg': card.portrait = { type: 'creature', id: 'ravenegg' }; break
    case 'RedHart': card.portrait = { type: 'creature', id: 'redhart' }; break
    case 'Revenant': card.portrait = { type: 'creature', id: 'revenant' }; break
    case 'RingWorm': card.portrait = { type: 'creature', id: 'ringworm' }; break
    case 'RoboMice': card.portrait = { type: 'creature', id: 'robomice' }; break
    case 'RoboSkeleton': card.portrait = { type: 'creature', id: 'roboskeleton' }; break
    case 'RubyGolem': card.portrait = { type: 'creature', id: 'rubygolem' }; break
    case 'Salmon': card.portrait = { type: 'creature', id: 'salmon' }; break
    case 'Sarcophagus': card.portrait = { type: 'creature', id: 'sarcophagus' }; break
    case 'SentinelBlue': card.portrait = { type: 'creature', id: 'sentinelblue' }; break
    case 'SentinelGreen': card.portrait = { type: 'creature', id: 'sentinelgreen' }; break
    case 'SentinelOrange': card.portrait = { type: 'creature', id: 'sentinelorange' }; break
    case 'SentryBot': card.portrait = { type: 'creature', id: 'sentrybot' }; break
    case 'SentryBot_Fused': card.portrait = { type: 'creature', id: 'sentrybot_fused' }; break
    case 'Shark': card.portrait = { type: 'creature', id: 'shark' }; break
    case 'Shieldbot': card.portrait = { type: 'creature', id: 'shieldbot' }; break
    case 'Shutterbug': card.portrait = { type: 'creature', id: 'shutterbug' }; break
    case 'Skeleton': card.portrait = { type: 'creature', id: 'skeleton' }; break
    case 'SkeletonMage': card.portrait = { type: 'creature', id: 'skeletonmage' }; break
    case 'SkeletonParrot': card.portrait = { type: 'creature', id: 'skeletonparrot' }; break
    case 'SkeletonPirate': card.portrait = { type: 'creature', id: 'skeletonpirate' }; break
    case 'Skink': card.portrait = { type: 'creature', id: 'skink' }; break
    case 'SkinkTail': card.portrait = { type: 'creature', id: 'skinktail' }; break
    case 'Skunk': card.portrait = { type: 'creature', id: 'skunk' }; break
    case 'Smoke': card.portrait = { type: 'creature', id: 'smoke' }; break
    case 'Smoke_Improved': card.portrait = { type: 'creature', id: 'smoke_improved' }; break
    case 'Smoke_NoBones': card.portrait = { type: 'creature', id: 'smoke_nobones' }; break
    case 'Snapper': card.portrait = { type: 'creature', id: 'snapper' }; break
    case 'Snelk': card.portrait = { type: 'creature', id: 'snelk' }; card.special = 'snelk'; break
    case 'Snelk_Neck': card.portrait = { type: 'creature', id: 'snelk_neck' }; break
    case 'Sniper': card.portrait = { type: 'creature', id: 'sniper' }; break
    case 'Sparrow': card.portrait = { type: 'creature', id: 'sparrow' }; break
    case 'SquidBell': card.portrait = { type: 'creature', id: 'squidbell' }; break
    case 'SquidCards': card.portrait = { type: 'creature', id: 'squidcards' }; break
    case 'SquidMirror': card.portrait = { type: 'creature', id: 'squidmirror' }; break
    case 'Squirrel': card.portrait = { type: 'creature', id: 'squirrel' }; break
    case 'SquirrelBall': card.portrait = { type: 'creature', id: 'squirrelball' }; break
    case 'Starvation': card.portrait = { type: 'creature', id: 'starvation' }; break
    case 'Steambot': card.portrait = { type: 'creature', id: 'steambot' }; break
    case 'StimMage': card.portrait = { type: 'creature', id: 'stimmage' }; break
    case 'Stinkbug_Talking': card.portrait = { type: 'creature', id: 'stinkbug_talking' }; break
    case 'Stoat': card.portrait = { type: 'creature', id: 'stoat' }; break
    case 'Stoat_Talking': card.portrait = { type: 'creature', id: 'stoat_talking' }; break
    case 'Stump': card.portrait = { type: 'creature', id: 'stump' }; break
    case 'SwapBot': card.portrait = { type: 'creature', id: 'swapbot' }; break
    case 'Tadpole': card.portrait = { type: 'creature', id: 'tadpole' }; break
    case 'Tail_Bird': card.portrait = { type: 'creature', id: 'tail_bird' }; break
    case 'Tail_Furry': card.portrait = { type: 'creature', id: 'tail_furry' }; break
    case 'Tail_Insect': card.portrait = { type: 'creature', id: 'tail_insect' }; break
    case 'TechMoxTriple': card.portrait = { type: 'creature', id: 'techmoxtriple' }; break
    case 'Thickbot': card.portrait = { type: 'creature', id: 'thickbot' }; break
    case 'TombRobber': card.portrait = { type: 'creature', id: 'tombrobber' }; break
    case 'TombStone': card.portrait = { type: 'creature', id: 'tombstone' }; break
    case 'Trap': card.portrait = { type: 'creature', id: 'trap' }; break
    case 'TrapFrog': card.portrait = { type: 'creature', id: 'trapfrog' }; break
    case 'Tree': card.portrait = { type: 'creature', id: 'tree' }; break
    case 'Tree_Hologram': card.portrait = { type: 'creature', id: 'tree_hologram' }; break
    case 'Tree_Hologram_SnowCovered': card.portrait = { type: 'creature', id: 'tree_hologram_snowcovered' }; break
    case 'Tree_SnowCovered': card.portrait = { type: 'creature', id: 'tree_snowcovered' }; break
    case 'Urayuli': card.portrait = { type: 'creature', id: 'urayuli' }; break
    case 'Vulture': card.portrait = { type: 'creature', id: 'vulture' }; break
    case 'Warren': card.portrait = { type: 'creature', id: 'warren' }; break
    case 'Wolf': card.portrait = { type: 'creature', id: 'wolf' }; break
    case 'WolfCub': card.portrait = { type: 'creature', id: 'wolfcub' }; break
    case 'Wolf_Talking': card.portrait = { type: 'creature', id: 'wolf_talking' }; break
    case 'Wolverine': card.portrait = { type: 'creature', id: 'wolverine' }; break
    case 'XformerBatBeast': card.portrait = { type: 'creature', id: 'xformerbatbeast' }; break
    case 'XformerBatBot': card.portrait = { type: 'creature', id: 'xformerbatbot' }; break
    case 'XformerGrizzlyBeast': card.portrait = { type: 'creature', id: 'xformergrizzlybeast' }; break
    case 'XformerGrizzlyBot': card.portrait = { type: 'creature', id: 'xformergrizzlybot' }; break
    case 'XformerPorcupineBeast': card.portrait = { type: 'creature', id: 'xformerporcupinebeast' }; break
    case 'XformerPorcupineBot': card.portrait = { type: 'creature', id: 'xformerporcupinebot' }; break
    case 'Zombie': card.portrait = { type: 'creature', id: 'zombie' }; break
  }

  return card
}

export function convert(card: Card, id?: string): Partial<JldrCreature> {
  const out: Partial<JldrCreature> = {
    name: id,
  }

  if (card.name) {
    out.displayedName = card.name
  }

  if (card.cost) {
    switch (card.cost.type) {
      case 'blood': {
        out.bloodCost = card.cost.amount
        break
      }
      case 'energy': {
        out.energyCost = card.cost.amount
        break
      }
      case 'bone': {
        out.bonesCost = card.cost.amount
        break
      }
      case 'gem': {
        out.gemsCost = card.cost.gems.map((gem): 'Orange' | 'Green' | 'Blue' => {
          switch (gem) {
            case 'blue': return 'Blue'
            case 'green': return 'Green'
            case 'orange': return 'Orange'
          }
        })
      }
    }
  }

  if (card.tribes.length) {
    out.tribes = card.tribes.map(((tribe): 'Squirrel' | 'Reptile' | 'Canine' | 'Bird' | 'Hooved' | 'Insect' => {
      switch (tribe) {
        case 'squirrel': return 'Squirrel'
        case 'reptile': return 'Reptile'
        case 'canine': return 'Canine'
        case 'bird': return 'Bird'
        case 'hooved': return 'Hooved'
        case 'insect': return 'Insect'
      }
    }))
  }

  return out

  // metaCategories: [],
  // gemsCost: [],
  // specialStatIcon: StatIcon,
  // tribes: [],
  // traits: [],
  // specialAbilities: [],
  // abilities: [],
  // defaultEvolutionName: String,
  // flipPortraitForStrafe: true,
  // energyCost: Number,
  // bonesCost: Number,
  // baseHealth: Number,
  // bloodCost: Number,
  // cardComplexity: Complexity,
  // onePerDeck: false,
  // name: CreatureId,
  // description: String,
  // hideAttackAndHealth: false,
  // temple: Temple,
  // baseAttack: Number,
  // appearanceBehaviour: [],
  // iceCubeName: CreatureId.optional(),
  // tailName: TailName.optional(),
  // evolveIntoName: CreatureId.optional(),
  // evolveTurns: Number.optional(), // 1
}
