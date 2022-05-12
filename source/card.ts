import { Static, Record, Array, Literal, Union, String, Number, Boolean, InstanceOf } from 'runtypes'

export { Card, Sigil }
export { Tribe, StatIcon, Decal, Temple, CreatureId, Portrait }

type Sigil = Static<typeof Sigil>
type Card = Static<typeof Card>
type Portrait = Static<typeof Portrait>
type CreatureId = Static<typeof CreatureId>
type StatIcon = Static<typeof StatIcon>

const Sigil = Union(
  Literal('reach'), // Reach
  Literal('allstrike'), // AllStrike
  Literal('squirrelorbit'), // SquirrelOrbit
  Literal('madeofstone'), // MadeOfStone
  Literal('conduitnull'), // ConduitNull
  Literal('icecube'), // IceCube
  Literal('deathtouch'), // Deathtouch
  Literal('buffenemy'), // BuffEnemy
  Literal('buffneighbours'), // BuffNeighbours
  Literal('randomability'), // RandomAbility
  Literal('brittle'), // Brittle
  Literal('sentry'), // Sentry
  Literal('sharp'), // Sharp
  Literal('sniper'), // Sniper
  Literal('drawrandomcardondeath'), // DrawRandomCardOnDeath
  Literal('flying'), // Flying
  Literal('drawant'), // DrawAnt
  Literal('submerge'), // Submerge
  Literal('conduitbuffattack'), // ConduitBuffAttack
  Literal('gainbattery'), // GainBattery
  Literal('createdams'), // CreateDams
  Literal('beesonhit'), // BeesOnHit
  Literal('guarddog'), // GuardDog
  Literal('gemsdraw'), // GemsDraw
  Literal('movebeside'), // MoveBeside
  Literal('bombspawner'), // BombSpawner
  Literal('explodeondeath'), // ExplodeOnDeath
  Literal('activatedenergytobones'), // ActivatedEnergyToBones
  Literal('activatedstatsup'), // ActivatedStatsUp
  Literal('strafeswap'), // StrafeSwap
  Literal('whackamole'), // WhackAMole
  Literal('steeltrap'), // SteelTrap
  Literal('drawvesselonhit'), // DrawVesselOnHit
  Literal('strafe'), // Strafe
  Literal('deletefile'), // DeleteFile
  Literal('sacrificial'), // Sacrificial
  Literal('cellbuffself'), // CellBuffSelf
  Literal('celldrawrandomcardondeath'), // CellDrawRandomCardOnDeath
  Literal('celltristrike'), // CellTriStrike
  Literal('splitstrike'), // SplitStrike
  Literal('drawcopyondeath'), // DrawCopyOnDeath
  Literal('quadruplebones'), // QuadrupleBones
  Literal('createegg'), // CreateEgg
  Literal('createbells'), // CreateBells
  Literal('drawnewhand'), // DrawNewHand
  Literal('tripleblood'), // TripleBlood
  Literal('doublestrike'), // DoubleStrike
  Literal('bonedigger'), // BoneDigger
  Literal('evolve'), // Evolve
  Literal('gaingemblue'), // GainGemBlue
  Literal('gaingemgreen'), // GainGemGreen
  Literal('gaingemorange'), // GainGemOrange
  Literal('conduitenergy'), // ConduitEnergy
  Literal('activatedrandompowerenergy'), // ActivatedRandomPowerEnergy
  Literal('conduitfactory'), // ConduitFactory
  Literal('drawcopy'), // DrawCopy
  Literal('preventattack'), // PreventAttack
  Literal('explodegems'), // ExplodeGems
  Literal('gemdependant'), // GemDependant
  Literal('shieldgems'), // ShieldGems
  Literal('conduitspawngems'), // ConduitSpawnGems
  Literal('skeletonstrafe'), // SkeletonStrafe
  Literal('conduitheal'), // ConduitHeal
  Literal('gainattackonkill'), // GainAttackOnKill
  Literal('tristrike'), // TriStrike
  Literal('hydraegg'), // HydraEgg
  Literal('submergesquid'), // SubmergeSquid
  Literal('latchexplodeondeath'), // LatchExplodeOnDeath
  Literal('latchbrittle'), // LatchBrittle
  Literal('latchdeathshield'), // LatchDeathShield
  Literal('filesizedamage'), // FileSizeDamage
  Literal('corpseeater'), // CorpseEater
  Literal('tutor'), // Tutor
  Literal('activatedsacrificedrawcards'), // ActivatedSacrificeDrawCards
  Literal('loot'), // Loot
  Literal('morsel'), // Morsel
  Literal('strafepush'), // StrafePush
  Literal('gaingemtriple'), // GainGemTriple
  Literal('deathshield'), // DeathShield
  Literal('doubledeath'), // DoubleDeath
  Literal('buffgems'), // BuffGems
  Literal('randomconsumable'), // RandomConsumable
  Literal('activateddealdamage'), // ActivatedDealDamage
  Literal('opponentbones'), // OpponentBones
  Literal('droprubyondeath'), // DropRubyOnDeath
  Literal('tailonhit'), // TailOnHit
  Literal('debuffenemy'), // DebuffEnemy
  Literal('squirrelstrafe'), // SquirrelStrafe
  Literal('activatedstatsupenergy'), // ActivatedStatsUpEnergy
  Literal('swapstats'), // SwapStats
  Literal('activateddrawskeleton'), // ActivatedDrawSkeleton
  Literal('drawrabbits'), // DrawRabbits
  Literal('transformer'), // Transformer
  Literal('permadeath'), // Overclocked
)

const Tribe = Union(
  Literal('reptile'),
  Literal('canine'),
  Literal('bird'),
  Literal('hooved'),
  Literal('insect'),
  Literal('squirrel'),
)

const StatIcon = Union(
  Literal('ants'), // Ants
  Literal('greengems'), // Greengems
  Literal('bones'), // Bones
  Literal('sacrificesthisturn'), // Sacrificesthisturn
  Literal('bell'), // Bell
  Literal('cardsinhand'), // Cardsinhand
  Literal('mirror'), // Mirror
)
const Decal = Union(Literal('snelk'), Literal('child'), Literal('leshy'))
const Temple = Union(Literal('nature'), Literal('tech'), Literal('undead'), Literal('wizard'))

const CreatureId = Union(
  Literal('!bountyhunter_base'),
  Literal('!buildacard_base'),
  Literal('!corrupted'),
  Literal('!deathcard_base'),
  Literal('!deathcard_leshy'),
  Literal('!deathcard_pixel_base'),
  Literal('!deathcard_victory'),
  Literal('!friendcard_base'),
  Literal('!giantcard_moon'),
  Literal('!giantcard_ship'),
  Literal('!inspector'),
  Literal('!melter'),
  Literal('!mycocard_base'),
  Literal('!myco_old_data'),
  Literal('!static!glitch'),
  Literal('abovecurve'),
  Literal('adder'),
  Literal('alarmbot'),
  Literal('alpha'),
  Literal('amalgam'),
  Literal('amoeba'),
  Literal('amoebot'),
  Literal('angler_fish_bad'),
  Literal('angler_fish_good'),
  Literal('angler_fish_more'),
  Literal('angler_talking'),
  Literal('annoytower'),
  Literal('ant'),
  Literal('antflying'),
  Literal('antqueen'),
  Literal('aquasquirrel'),
  Literal('attackconduit'),
  Literal('automaton'),
  Literal('baitbucket'),
  Literal('banshee'),
  Literal('bat'),
  Literal('batterybot'),
  Literal('beaver'),
  Literal('bee'),
  Literal('beehive'),
  Literal('bloodhound'),
  Literal('bluemage'),
  Literal('bluemage_fused'),
  Literal('bluemage_talking'),
  Literal('bolthound'),
  Literal('bombmaiden'),
  Literal('bombbot'),
  Literal('bonehound'),
  Literal('bonelordhorn'),
  Literal('bonepile'),
  Literal('boulder'),
  Literal('bridgerailing'),
  Literal('brokenbot'),
  Literal('brokenegg'),
  Literal('bull'),
  Literal('bullfrog'),
  Literal('burrowingtrap'),
  Literal('bustedprinter'),
  Literal('cxformeradder'),
  Literal('cxformerelk'),
  Literal('cxformerraven'),
  Literal('cxformerwolf'),
  Literal('cagedwolf'),
  Literal('captivefile'),
  Literal('cardmergestones'),
  Literal('cat'),
  Literal('catundead'),
  Literal('cellbuff'),
  Literal('cellgift'),
  Literal('celltri'),
  Literal('closerbot'),
  Literal('cockroach'),
  Literal('coinleft'),
  Literal('coinright'),
  Literal('conduittower'),
  Literal('coyote'),
  Literal('cuckoo'),
  Literal('dummy_5-5'),
  Literal('dam'),
  Literal('daus'),
  Literal('dausbell'),
  Literal('deadhand'),
  Literal('deadpets'),
  Literal('deadtree'),
  Literal('defaulttail'),
  Literal('direwolf'),
  Literal('direwolfcub'),
  Literal('draugr'),
  Literal('drownedsoul'),
  Literal('elk'),
  Literal('elkcub'),
  Literal('emptyvessel'),
  Literal('emptyvessel_bluegem'),
  Literal('emptyvessel_greengem'),
  Literal('emptyvessel_orangegem'),
  Literal('energyconduit'),
  Literal('energyroller'),
  Literal('factoryconduit'),
  Literal('family'),
  Literal('fieldmouse'),
  Literal('fieldmouse_fused'),
  Literal('flyingmage'),
  Literal('forcemage'),
  Literal('franknstein'),
  Literal('frozenopossum'),
  Literal('geck'),
  Literal('gemexploder'),
  Literal('gemfiend'),
  Literal('gemripper'),
  Literal('gemshielder'),
  Literal('gemsconduit'),
  Literal('ghostship'),
  Literal('giftbot'),
  Literal('goat'),
  Literal('goldnugget'),
  Literal('gravedigger'),
  Literal('gravedigger_fused'),
  Literal('greenmage'),
  Literal('grizzly'),
  Literal('hawk'),
  Literal('headlesshorseman'),
  Literal('healerconduit'),
  Literal('hodag'),
  Literal('hrokkall'),
  Literal('hydra'),
  Literal('hydraegg'),
  Literal('ijiraq'),
  Literal('ijiraq_unlockscreen'),
  Literal('insectodrone'),
  Literal('jerseydevil'),
  Literal('juniorsage'),
  Literal('kingfisher'),
  Literal('kraken'),
  Literal('lammergeier'),
  Literal('latcherbomb'),
  Literal('latcherbrittle'),
  Literal('latchershield'),
  Literal('leapbot'),
  Literal('librarian'),
  Literal('lice'),
  Literal('mageknight'),
  Literal('maggots'),
  Literal('magpie'),
  Literal('mantis'),
  Literal('mantisgod'),
  Literal('marrowmage'),
  Literal('masterbleene'),
  Literal('mastergoranj'),
  Literal('masterorlu'),
  Literal('mealworm'),
  Literal('meatbot'),
  Literal('minecart'),
  Literal('mole'),
  Literal('moleman'),
  Literal('moleseaman'),
  Literal('mole_telegrapher'),
  Literal('moose'),
  Literal('mothman_stage1'),
  Literal('mothman_stage2'),
  Literal('mothman_stage3'),
  Literal('moxdualbg'),
  Literal('moxdualgo'),
  Literal('moxdualob'),
  Literal('moxemerald'),
  Literal('moxruby'),
  Literal('moxsapphire'),
  Literal('moxtriple'),
  Literal('mudturtle'),
  Literal('mule'),
  Literal('mummy'),
  Literal('mummy_telegrapher'),
  Literal('musclemage'),
  Literal('necromancer'),
  Literal('nullconduit'),
  Literal('opossum'),
  Literal('orangemage'),
  Literal('otter'),
  Literal('ouroboros'),
  Literal('ouroboros_part3'),
  Literal('packrat'),
  Literal('peltgolden'),
  Literal('pelthare'),
  Literal('peltwolf'),
  Literal('plasmagunner'),
  Literal('porcupine'),
  Literal('practicemage'),
  Literal('practicemagesmall'),
  Literal('pronghorn'),
  Literal('pupil'),
  Literal('rabbit'),
  Literal('raccoon'),
  Literal('ratking'),
  Literal('rattler'),
  Literal('raven'),
  Literal('ravenegg'),
  Literal('redhart'),
  Literal('revenant'),
  Literal('ringworm'),
  Literal('robomice'),
  Literal('roboskeleton'),
  Literal('rubygolem'),
  Literal('salmon'),
  Literal('sarcophagus'),
  Literal('sentinelblue'),
  Literal('sentinelgreen'),
  Literal('sentinelorange'),
  Literal('sentrybot'),
  Literal('sentrybot_fused'),
  Literal('shark'),
  Literal('shieldbot'),
  Literal('shutterbug'),
  Literal('skeleton'),
  Literal('skeletonmage'),
  Literal('skeletonparrot'),
  Literal('skeletonpirate'),
  Literal('skink'),
  Literal('skinktail'),
  Literal('skunk'),
  Literal('smoke'),
  Literal('smoke_improved'),
  Literal('smoke_nobones'),
  Literal('snapper'),
  Literal('snelk'),
  Literal('snelk_neck'),
  Literal('sniper'),
  Literal('sparrow'),
  Literal('squidbell'),
  Literal('squidcards'),
  Literal('squidmirror'),
  Literal('squirrel'),
  Literal('squirrelball'),
  Literal('starvation'),
  Literal('steambot'),
  Literal('stimmage'),
  Literal('stinkbug_talking'),
  Literal('stoat'),
  Literal('stoat_talking'),
  Literal('stump'),
  Literal('swapbot'),
  Literal('tadpole'),
  Literal('tail_bird'),
  Literal('tail_furry'),
  Literal('tail_insect'),
  Literal('techmoxtriple'),
  Literal('thickbot'),
  Literal('tombrobber'),
  Literal('tombstone'),
  Literal('trap'),
  Literal('trapfrog'),
  Literal('tree'),
  Literal('tree_hologram'),
  Literal('tree_hologram_snowcovered'),
  Literal('tree_snowcovered'),
  Literal('urayuli'),
  Literal('vulture'),
  Literal('warren'),
  Literal('wolf'),
  Literal('wolfcub'),
  Literal('wolf_talking'),
  Literal('wolverine'),
  Literal('xformerbatbeast'),
  Literal('xformerbatbot'),
  Literal('xformergrizzlybeast'),
  Literal('xformergrizzlybot'),
  Literal('xformerporcupinebeast'),
  Literal('xformerporcupinebot'),
  Literal('zombie'),
)

const CreaturePortrait = Record({
  type: Literal('creature'),
  id: CreatureId
})
const DeathcardPortrait = Record({
  type: Literal('deathcard'),
  data: Record({
    headType: Union(Literal('chief'), Literal('enchantress'), Literal('gravedigger'), Literal('prospector'), Literal('robot'), Literal('settlerman'), Literal('settlerwoman'), Literal('wildling')),
    eyesIndex: Number.withConstraint(n => [0, 1, 2, 3, 4, 5].includes(n)),
    mouthIndex: Number.withConstraint(n => [0, 1, 2, 3, 4, 5].includes(n)),
    lostEye: Boolean,
  })
})
const CustomPortrait = Record({
  type: Literal('custom'),
  data: Record({
    common: InstanceOf(Buffer).optional(),
    gbc: InstanceOf(Buffer).optional(),
  })
})
const ResourcePortrait = Record({
  type: Literal('resource'),
  resourceId: String,
})
const Portrait = Union(CreaturePortrait, DeathcardPortrait, CustomPortrait, ResourcePortrait)

const BloodCost = Record({
  type: Literal('blood'),
  amount: Number.withConstraint(n => [1, 2, 3, 4].includes(n)),
})
const BoneCost = Record({
  type: Literal('bone'),
  amount: Number.withConstraint(n => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].includes(n)),
})
const EnergyCost = Record({
  type: Literal('energy'),
  amount: Number.withConstraint(n => [0, 1, 2, 3, 4, 5, 6].includes(n)),
})
const GemCost = Record({
  type: Literal('gem'),
  gems: Array(Union(Literal('blue'), Literal('green'), Literal('orange')))
})
const Cost = Union(BloodCost, BoneCost, EnergyCost, GemCost)

const Card = Record({
  gameId: String.optional(),
  name: String,
  portrait: Portrait.optional(),
  cost: Cost.optional(),
  power: Number,
  health: Number,
  sigils: Array(Sigil),
  tribes: Array(Tribe),
  statIcon: StatIcon.optional(),
  temple: Temple,
  flags: Record({
    golden: Boolean,
    rare: Boolean,
    terrain: Boolean,
    terrainLayout: Boolean,
    squid: Boolean,
    enhanced: Boolean,
    redEmission: Boolean,
    fused: Boolean,
    smoke: Boolean,
    paint: Boolean,
    blood: Boolean,
    hidePowerAndHealth: Boolean,
  }),
  special: Union(
    Literal('child13'),
    Literal('leshy'),
    Literal('snelk'),
  ).optional()
})
