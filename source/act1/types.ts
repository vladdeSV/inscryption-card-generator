import { Static, Record, String, Number, Boolean, Literal, Union, Array } from 'runtypes'

type CardType = Static<typeof CardType>
const CardType = Union(
  Literal('common'),
  Literal('rare'),
  Literal('terrain'),
  Literal('nostat')
)

const BloodCost = Record({
  type: Literal('blood'),
  amount: Number.withConstraint(n => n >= 1 && n <= 4, { name: 'BloodCost' }),
})

const BoneCost = Record({
  type: Literal('bone'),
  amount: Number.withConstraint(n => n >= 1 && n <= 10, { name: 'BoneCost' }),
})

type Cost = Static<typeof Cost>
const Cost = Union(BloodCost, BoneCost)
const Decal = Union(Literal('smoke'), Literal('stitched'), Literal('blood'), Literal('child'), Literal('leshy'), Literal('snelk'))
const Creature = Union(
  Literal('baitbucket'),
  Literal('boulder'),
  Literal('cagedwolf'),
  Literal('dausbell'),
  Literal('frozen_opossum'),
  Literal('goldnugget'),
  Literal('pelt_golden'),
  Literal('pelt_hare'),
  Literal('pelt_wolf'),
  Literal('stones'),
  Literal('stump'),
  Literal('trap'),
  Literal('trap_closed'),
  Literal('tree'),
  Literal('tree_snowcovered'),
  Literal('adder'),
  Literal('alpha'),
  Literal('amalgam'),
  Literal('amoeba'),
  Literal('ant'),
  Literal('antqueen'),
  Literal('bat'),
  Literal('beaver'),
  Literal('bee'),
  Literal('beehive'),
  Literal('bird_tail'),
  Literal('bloodhound'),
  Literal('bullfrog'),
  Literal('canine_tail'),
  Literal('cat'),
  Literal('cat_undead'),
  Literal('cockroach'),
  Literal('coyote'),
  Literal('dam'),
  Literal('daus'),
  Literal('deer'),
  Literal('deercub'),
  Literal('fieldmice'),
  Literal('franknstein'),
  Literal('geck'),
  Literal('goat'),
  Literal('goat_sexy'),
  Literal('grizzly'),
  Literal('insect_tail'),
  Literal('jerseydevil'),
  Literal('jerseydevil_sleeping'),
  Literal('kingfisher'),
  Literal('lammergeier'),
  Literal('maggots'),
  Literal('magpie'),
  Literal('mantis'),
  Literal('mantisgod'),
  Literal('mole'),
  Literal('moleman'),
  Literal('moose'),
  Literal('mothman_1'),
  Literal('mothman_2'),
  Literal('mothman_3'),
  Literal('mule'),
  Literal('opossum'),
  Literal('otter'),
  Literal('ouroboros'),
  Literal('packrat'),
  Literal('porcupine'),
  Literal('pronghorn'),
  Literal('rabbit'),
  Literal('ratking'),
  Literal('rattler'),
  Literal('raven'),
  Literal('ravenegg'),
  Literal('revenant'),
  Literal('ringworm'),
  Literal('shark'),
  Literal('shutterbug'),
  Literal('sinkhole'),
  Literal('skink'),
  Literal('skink_tailless'),
  Literal('skink_tail'),
  Literal('skunk'),
  Literal('smoke'),
  Literal('smoke_improved'),
  Literal('sparrow'),
  Literal('squidbell'),
  Literal('squidcards'),
  Literal('squidmirror'),
  Literal('squirrel'),
  Literal('squirrel_scared'),
  Literal('starvingman'),
  Literal('trapfrog'),
  Literal('turtle'),
  Literal('urayuli'),
  Literal('vulture'),
  Literal('warren'),
  Literal('warren_eaten1'),
  Literal('warren_eaten2'),
  Literal('warren_eaten3'),
  Literal('wolf'),
  Literal('wolfcub'),
)

const Sigil = Union(
  Literal('reach'),
  Literal('splitstrike'),
  Literal('tristrike'),
  Literal('icecube'),
  Literal('randomconsumable'),
  Literal('steeltrap'),
  Literal('randomability'),
  Literal('squirrelorbit'),
  Literal('allstrike'),
  Literal('buffneighbours'),
  Literal('createbells'),
  Literal('debuffenemy'),
  Literal('drawrabbits'),
  Literal('beesonhit'),
  Literal('strafe'),
  Literal('deathtouch'),
  Literal('evolve'),
  Literal('evolve_1'),
  Literal('evolve_2'),
  Literal('evolve_3'),
  Literal('createdams'),
  Literal('tutor'),
  Literal('whackamole'),
  Literal('drawcopy'),
  Literal('tailonhit'),
  Literal('corpseeater'),
  Literal('quadruplebones'),
  Literal('submerge'),
  Literal('drawcopyondeath'),
  Literal('sharp'),
  Literal('strafepush'),
  Literal('drawant'),
  Literal('guarddog'),
  Literal('flying'),
  Literal('sacrificial'),
  Literal('preventattack'),
  Literal('tripleblood'),
)

const Tribe = Union(
  Literal('canine'),
  Literal('insect'),
  Literal('reptile'),
  Literal('hooved'),
  Literal('bird'),
)

const Health = Number.withConstraint(n => n >= 0)
type Power = Static<typeof Power>
const Power = Union(
  Number.withConstraint(n => n >= 0),
  Literal('ants'), Literal('bell'), Literal('cardsinhand'), Literal('mirror')
)

type Card = Static<typeof Card>
const Card = Record({
  type: CardType,
  name: String.optional(),
  portrait: Union(Creature, Literal('custom')).optional(),
  health: Health.optional(),
  power: Power.optional(),
  cost: Cost.optional(),
  tribes: Array(Tribe).optional(),
  sigils: Array(Sigil).optional(),
  decals: Array(Decal).optional(),
  options: Record({
    isTerrain: Boolean.optional(),
    isEnhanced: Boolean.optional(),
    isGolden: Boolean.optional(),
    isSquid: Boolean.optional(),
    hasBorder: Boolean.optional(),
    portraitData: String.optional(),
  }).optional(),
});

type CardBackType = Static<typeof CardBackType>
const CardBackType = Union(
  Literal('common'),
  Literal('squirrel'),
  Literal('bee'),
  Literal('deathcard')
)

type CardBack = Static<typeof CardBack>
const CardBack = Record({
  type: CardBackType,
  options: Record({
    hasBorder: Boolean.optional(),
  }).optional()
})

export { Card, CardType, CardBack, CardBackType, Cost, Power }
