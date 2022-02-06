export { Card, CreatureId, Abillity, AppearanceBehaviour, Tribe, MetaCategory, Trait, Gem, StatIcon, Complexity, Temple, }

interface Card {
  id: CreatureId,
  power: number,
  health: number,
  bloodCost: number,
  boneCost: number,
  energyCost: number,

  temple: Temple,
  complexity: Complexity,
  metaCategories: MetaCategory[],
  abilities: Abillity[],
  appearanceBehaviours: AppearanceBehaviour[],
  tribes: Tribe[],
  traits: Trait[],
  gems: Gem[]

  sacrificable: boolean,
  level: number,
  oncePerDeck: boolean,
  gemified: boolean,

  statIcon: StatIcon | null,
  iceCubeId?: string,
  evolve?: {
    turns: number,
    evolvesTo: string,
  }
}

type CreatureId = 'Adder' | 'Alpha' | 'Amalgam' | 'Amoeba' | 'Ant' | 'AntQueen' | 'Bat' | 'Beaver' | 'Bee' | 'Beehive' | 'Bloodhound' | 'Bullfrog' | 'BurrowingTrap' | 'CagedWolf' | 'Cat' | 'CatUndead' | 'Cockroach' | 'Coyote' | 'Daus' | 'DefaultTail' | 'Elk' | 'ElkCub' | 'FieldMouse' | 'FieldMouse_Fused' | 'Geck' | 'Goat' | 'Grizzly' | 'Hawk' | 'Hrokkall' | 'JerseyDevil' | 'Kingfisher' | 'Kraken' | 'Lammergeier' | 'Maggots' | 'Magpie' | 'Mantis' | 'MantisGod' | 'Mole' | 'MoleMan' | 'Moose' | 'Mothman_Stage1' | 'Mothman_Stage2' | 'Mothman_Stage3' | 'Mule' | 'Opossum' | 'Otter' | 'Ouroboros' | 'PackRat' | 'Porcupine' | 'Pronghorn' | 'Rabbit' | 'RatKing' | 'Rattler' | 'Raven' | 'RavenEgg' | 'Salmon' | 'Shark' | 'Skink' | 'SkinkTail' | 'Skunk' | 'Snapper' | 'Snelk' | 'Sparrow' | 'SquidBell' | 'SquidCards' | 'SquidMirror' | 'Squirrel' | 'SquirrelBall' | 'Stoat' | 'Tail_Bird' | 'Tail_Furry' | 'Tail_Insect' | 'Urayuli' | 'Vulture' | 'Warren' | 'Wolf' | 'WolfCub' | '!DEATHCARD_BASE' | '!DEATHCARD_LESHY' | '!DEATHCARD_VICTORY' | '!GIANTCARD_MOON' | '!STATIC!GLITCH' | 'BaitBucket' | 'CardMergeStones' | 'Dam' | 'DausBell' | 'GoldNugget' | 'PeltGolden' | 'PeltHare' | 'PeltWolf' | 'RingWorm' | 'Smoke' | 'Smoke_Improved' | 'Smoke_NoBones' | 'Starvation' | 'Stinkbug_Talking' | 'Stoat_Talking' | 'Trap' | 'TrapFrog' | 'Wolf_Talking' | '!CORRUPTED' | '!DEATHCARD_PIXEL_BASE' | '!INSPECTOR' | '!MELTER' | '!BOUNTYHUNTER_BASE' | '!BUILDACARD_BASE' | '!FRIENDCARD_BASE' | '!MYCO_OLD_DATA' | '!MYCOCARD_BASE' | 'Angler_Fish_Bad' | 'Angler_Fish_Good' | 'Angler_Fish_More' | 'Angler_Talking' | 'BlueMage_Talking' | 'DUMMY_5-5' | 'Mole_Telegrapher' | 'Mummy_Telegrapher' | 'Ouroboros_Part3' | 'AboveCurve' | 'AlarmBot' | 'Amoebot' | 'AttackConduit' | 'Automaton' | 'BatteryBot' | 'BoltHound' | 'Bombbot' | 'BombMaiden' | 'BustedPrinter' | 'CaptiveFile' | 'CellBuff' | 'CellGift' | 'CellTri' | 'CloserBot' | 'CXformerAdder' | 'CXformerElk' | 'CXformerRaven' | 'CXformerWolf' | 'EmptyVessel' | 'EmptyVessel_BlueGem' | 'EmptyVessel_GreenGem' | 'EmptyVessel_OrangeGem' | 'EnergyConduit' | 'EnergyRoller' | 'FactoryConduit' | 'GemExploder' | 'GemRipper' | 'GemsConduit' | 'GemShielder' | 'GiftBot' | 'HealerConduit' | 'Insectodrone' | 'LatcherBomb' | 'LatcherBrittle' | 'LatcherShield' | 'LeapBot' | 'Librarian' | 'MeatBot' | 'MineCart' | 'NullConduit' | 'PlasmaGunner' | 'RoboMice' | 'RoboSkeleton' | 'SentinelBlue' | 'SentinelGreen' | 'SentinelOrange' | 'SentryBot' | 'SentryBot_Fused' | 'Shieldbot' | 'Shutterbug' | 'Sniper' | 'Steambot' | 'SwapBot' | 'TechMoxTriple' | 'Thickbot' | 'XformerBatBeast' | 'XformerBatBot' | 'XformerGrizzlyBeast' | 'XformerGrizzlyBot' | 'XformerPorcupineBeast' | 'XformerPorcupineBot' | 'AnnoyTower' | 'Boulder' | 'BridgeRailing' | 'BrokenBot' | 'ConduitTower' | 'DeadTree' | 'FrozenOpossum' | 'Stump' | 'TombStone' | 'Tree' | 'Tree_Hologram' | 'Tree_Hologram_SnowCovered' | 'Tree_SnowCovered' | 'Banshee' | 'Bonehound' | 'BonelordHorn' | 'Bonepile' | 'CoinLeft' | 'CoinRight' | 'DeadHand' | 'DeadPets' | 'Draugr' | 'DrownedSoul' | 'Family' | 'FrankNStein' | 'GhostShip' | 'Gravedigger' | 'Gravedigger_Fused' | 'HeadlessHorseman' | 'Mummy' | 'Necromancer' | 'Revenant' | 'Sarcophagus' | 'Skeleton' | 'SkeletonMage' | 'TombRobber' | 'Zombie' | 'BlueMage' | 'BlueMage_Fused' | 'FlyingMage' | 'ForceMage' | 'GemFiend' | 'GreenMage' | 'JuniorSage' | 'MageKnight' | 'MarrowMage' | 'MasterBleene' | 'MasterGoranj' | 'MasterOrlu' | 'MoxDualBG' | 'MoxDualGO' | 'MoxDualOB' | 'MoxEmerald' | 'MoxRuby' | 'MoxSapphire' | 'MoxTriple' | 'MuscleMage' | 'OrangeMage' | 'PracticeMage' | 'PracticeMageSmall' | 'Pupil' | 'RubyGolem' | 'StimMage'
type Abillity = 'Deathtouch' | 'BuffNeighbours' | 'RandomAbility' | 'Ant' | 'DrawAnt' | 'Flying' | 'CreateDams' | 'BeesOnHit' | 'GuardDog' | 'Reach' | 'WhackAMole' | 'SteelTrap' | 'CagedWolf' | 'Sacrificial' | 'Cat' | 'DrawCopyOnDeath' | 'CreateBells' | 'Daus' | 'Strafe' | 'Evolve' | 'DrawCopy' | 'TripleBlood' | 'Submerge' | 'GainBattery' | 'JerseyDevil' | 'SubmergeSquid' | 'Lammergeier' | 'CorpseEater' | 'Tutor' | 'SplitStrike' | 'TriStrike' | 'StrafePush' | 'PackMule' | 'Ouroboros' | 'RandomConsumable' | 'Sharp' | 'QuadrupleBones' | 'TailOnHit' | 'DebuffEnemy' | 'BellProximity' | 'CardsInHand' | 'Mirror' | 'SquirrelStrafe' | 'DrawRabbits' | 'AllStrike' | 'SquirrelOrbit' | 'GiantCard' | 'GiantMoon' | 'RandomCard' | 'PreventAttack' | 'TalkingCardChooser' | 'TrapSpawner' | 'ConduitNull' | 'IceCube' | 'BountyHunter' | 'Brittle' | 'BuffEnemy' | 'Sentry' | 'Sniper' | 'DrawRandomCardOnDeath' | 'MoveBeside' | 'ConduitBuffAttack' | 'ExplodeOnDeath' | 'BombSpawner' | 'DrawVesselOnHit' | 'DeleteFile' | 'CellBuffSelf' | 'CellDrawRandomCardOnDeath' | 'CellTriStrike' | 'GainGemBlue' | 'GainGemGreen' | 'GainGemOrange' | 'ConduitEnergy' | 'ActivatedRandomPowerEnergy' | 'ConduitFactory' | 'ExplodeGems' | 'ConduitSpawnGems' | 'ShieldGems' | 'ConduitHeal' | 'LatchExplodeOnDeath' | 'LatchBrittle' | 'LatchDeathShield' | 'FileSizeDamage' | 'ActivatedDealDamage' | 'DeathShield' | 'SwapStats' | 'GainGemTriple' | 'Transformer' | 'ActivatedEnergyToBones' | 'ActivatedStatsUp' | 'BrokenCoinLeft' | 'BrokenCoinRight' | 'DrawNewHand' | 'SkeletonStrafe' | 'BoneDigger' | 'DoubleDeath' | 'GemDependant' | 'ActivatedDrawSkeleton' | 'GemsDraw' | 'GreenMage' | 'ActivatedSacrificeDrawCards' | 'Loot' | 'BuffGems' | 'DropRubyOnDeath' | 'ActivatedStatsUpEnergy'
type AppearanceBehaviour = 'RareCardBackground' | 'TerrainBackground' | 'TerrainLayout' | 'SexyGoat' | 'AlternatingBloodDecal' | 'AddSnelkDecals' | 'DynamicPortrait' | 'GiantAnimatedPortrait' | 'StaticGlitch' | 'GoldEmission' | 'AnimatedPortrait' | 'HologramPortrait'
type Tribe = 'Reptile' | 'Canine' | 'Bird' | 'Hooved' | 'Insect' | 'Squirrel'
type MetaCategory = 'ChoiceNode' | 'TraderOffer' | 'GBCPack' | 'GBCPlayable' | 'Rare' | 'Part3Random'
type Trait = 'KillsSurvivors' | 'Ant' | 'Blind' | 'Structure' | 'Terrain' | 'DeathcardCreationNonOption' | 'Undead' | 'FeedsStoat' | 'Fused' | 'Goat' | 'Uncuttable' | 'SatisfiesRingTrial' | 'Wolf' | 'Giant' | 'Pelt' | 'Gem'
type Gem = 'Blue' | 'Green' | 'Orange'
type StatIcon = 'Ants' | 'Bones' | 'Bell' | 'CardsInHand' | 'Mirror' | 'GreenGems'
type Complexity = 'Simple' | 'Intermediate' | 'Advanced' | 'Vanilla'
type Temple = 'Nature' | 'Tech' | 'Undead' | 'Wizard'
