import { Card } from './card'
import { convert, JldrCreature } from './jldrcard'

const templateCard: Card = {
  name: '',
  cost: undefined,
  power: 0,
  health: 0,
  sigils: [],
  tribes: [],
  statIcon: undefined,
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
  special: undefined,
}

describe('simple cards', () => {
  test('empty card', () => {
    const card = convert({ ...templateCard }, 'test')
    expect(card).toEqual({
      name: 'test'
    } as JldrCreature)
  })

  test('display name', () => {
    expect(convert({ ...templateCard, name: 'Foo Bar' }, 'test'))
      .toEqual({ name: 'test', displayedName: 'Foo Bar' } as JldrCreature)

    expect(convert({ ...templateCard, name: '' }, 'test'))
      .toEqual({ name: 'test' } as JldrCreature)

    expect(convert({ ...templateCard }, 'test'))
      .toEqual({ name: 'test' } as JldrCreature)
  })

  test('power', () => {
    expect(convert({ ...templateCard, power: 0 }, 'test'))
      .toEqual({ name: 'test' } as JldrCreature)

    expect(convert({ ...templateCard, power: 1 }, 'test'))
      .toEqual({ name: 'test', baseAttack: 1 } as JldrCreature)
  })

  test('health', () => {
    expect(convert({ ...templateCard, health: 0 }, 'test'))
      .toEqual({ name: 'test' } as JldrCreature)

    expect(convert({ ...templateCard, health: 1 }, 'test'))
      .toEqual({ name: 'test', baseHealth: 1 } as JldrCreature)

    expect(convert({ ...templateCard, health: 4 }, 'test'))
      .toEqual({ name: 'test', baseHealth: 4 } as JldrCreature)
  })

  test('blood cost', () => {
    const card = convert({ ...templateCard, cost: { type: 'blood', amount: 1, } }, 'test')
    expect(card).toEqual({ name: 'test', bloodCost: 1, } as JldrCreature)
  })

  test('bone cost', () => {
    const card = convert({ ...templateCard, cost: { type: 'bone', amount: 1, } }, 'test')
    expect(card).toEqual({ name: 'test', bonesCost: 1, } as JldrCreature)
  })

  test('energy cost', () => {
    const card = convert({ ...templateCard, cost: { type: 'energy', amount: 1, } }, 'test')
    expect(card).toEqual({ name: 'test', energyCost: 1, } as JldrCreature)
  })

  test('tribes', () => {
    expect(convert({ ...templateCard, tribes: [] }, 'test'))
      .toEqual({ name: 'test' } as JldrCreature)

    expect(convert({ ...templateCard, tribes: ['canine'] }, 'test'))
      .toEqual({ name: 'test', tribes: ['Canine'] } as JldrCreature)

    expect(convert({ ...templateCard, tribes: ['squirrel', 'reptile', 'canine', 'bird', 'hooved', 'insect'] }, 'test'))
      .toEqual({ name: 'test', tribes: ['Squirrel', 'Reptile', 'Canine', 'Bird', 'Hooved', 'Insect',] } as JldrCreature)
  })

  test('temple', () => {
    expect(convert({ ...templateCard, temple: 'nature' }, 'test'))
      .toEqual({ name: 'test' } as JldrCreature)

    expect(convert({ ...templateCard, temple: 'tech' }, 'test'))
      .toEqual({ name: 'test', temple: 'Tech' } as JldrCreature)
  })

  test('rare', () => {
    expect(convert({ ...templateCard, flags: { ...templateCard.flags, rare: false } }, 'test'))
      .toEqual({ name: 'test' } as JldrCreature)

    expect(convert({ ...templateCard, flags: { ...templateCard.flags, rare: true } }, 'test'))
      .toEqual({ name: 'test', metaCategories: ['Rare'], appearanceBehaviour: ['RareCardBackground'] } as JldrCreature)
  })

  test('terrain', () => {
    expect(convert({ ...templateCard, flags: { ...templateCard.flags, terrain: false, terrainLayout: false } }, 'test'))
      .toEqual({ name: 'test' } as JldrCreature)

    expect(convert({ ...templateCard, flags: { ...templateCard.flags, terrain: true, terrainLayout: false } }, 'test'))
      .toEqual({ name: 'test', appearanceBehaviour: ['TerrainBackground'] } as JldrCreature)

    expect(convert({ ...templateCard, flags: { ...templateCard.flags, terrain: false, terrainLayout: true } }, 'test'))
      .toEqual({ name: 'test', appearanceBehaviour: ['TerrainLayout'] } as JldrCreature)

    expect(convert({ ...templateCard, flags: { ...templateCard.flags, terrain: true, terrainLayout: true } }, 'test'))
      .toEqual({ name: 'test', appearanceBehaviour: ['TerrainBackground', 'TerrainLayout'] } as JldrCreature)
  })
})
