import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'fs'
import { join } from 'path'
import { Card } from './card'
import { act1Resource } from './generators/leshyCardGenerator'
import { convert, createResourcesForCard, JldrCreature } from './jldrcard'
import { res2 } from './temp'

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

describe('convert simple cards', () => {
  test('empty card', () => {
    expect(convert({ ...templateCard }, 'test'))
      .toEqual({ name: 'test' } as JldrCreature)
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
      .toEqual({ name: 'test', appearanceBehaviour: ['TerrainBackground'], traits: ['Terrain'] } as JldrCreature)

    expect(convert({ ...templateCard, flags: { ...templateCard.flags, terrain: false, terrainLayout: true } }, 'test'))
      .toEqual({ name: 'test', appearanceBehaviour: ['TerrainLayout'] } as JldrCreature)

    expect(convert({ ...templateCard, flags: { ...templateCard.flags, terrain: true, terrainLayout: true } }, 'test'))
      .toEqual({ name: 'test', appearanceBehaviour: ['TerrainBackground', 'TerrainLayout'], traits: ['Terrain'] } as JldrCreature)
  })

  test('stat icons', () => {

    expect(convert({ ...templateCard, statIcon: undefined }, 'test'))
      .toEqual({ name: 'test' } as JldrCreature)

    expect(convert({ ...templateCard, statIcon: undefined, power: 2 }, 'test'))
      .toEqual({ name: 'test', baseAttack: 2 } as JldrCreature)

    expect(convert({ ...templateCard, statIcon: 'ants' }, 'test'))
      .toEqual({ name: 'test', specialStatIcon: 'Ants', specialAbilities: ['Ant'] } as JldrCreature)

    expect(convert({ ...templateCard, statIcon: 'bell' }, 'test'))
      .toEqual({ name: 'test', specialStatIcon: 'Bell', specialAbilities: ['BellProximity'] } as JldrCreature)

    expect(convert({ ...templateCard, statIcon: 'bones' }, 'test'))
      .toEqual({ name: 'test', specialStatIcon: 'Bones', specialAbilities: ['Lammergeier'] } as JldrCreature)

    expect(convert({ ...templateCard, statIcon: 'cardsinhand' }, 'test'))
      .toEqual({ name: 'test', specialStatIcon: 'CardsInHand', specialAbilities: ['CardsInHand'] } as JldrCreature)

    expect(convert({ ...templateCard, statIcon: 'greengems' }, 'test'))
      .toEqual({ name: 'test', specialStatIcon: 'GreenGems', specialAbilities: ['GreenMage'] } as JldrCreature)

    expect(convert({ ...templateCard, statIcon: 'mirror' }, 'test'))
      .toEqual({ name: 'test', specialStatIcon: 'Mirror', specialAbilities: ['Mirror'] } as JldrCreature)

    expect(convert({ ...templateCard, statIcon: 'sacrificesthisturn' }, 'test'))
      .toEqual({ name: 'test', specialStatIcon: 'SacrificesThisTurn', specialAbilities: ['SacrificesThisTurn'] } as JldrCreature)
  })

  test('misc', () => {
    expect(convert({ ...templateCard, flags: { ...templateCard.flags, blood: true } }, 'test'))
      .toEqual({ name: 'test', appearanceBehaviour: ['AlternatingBloodDecal'] } as JldrCreature)

    expect(convert({ ...templateCard, flags: { ...templateCard.flags, golden: true } }, 'test'))
      .toEqual({ name: 'test', appearanceBehaviour: ['GoldEmission'] } as JldrCreature)

    expect(convert({ ...templateCard, flags: { ...templateCard.flags, redEmission: true } }, 'test'))
      .toEqual({ name: 'test', appearanceBehaviour: ['RedEmission'] } as JldrCreature)
  })

  test('fused', () => {
    const out = convert({ ...templateCard, flags: { ...templateCard.flags, fused: true } }, 'test')
    expect(out.traits?.includes('Fused')).toBeTruthy()
    // todo decals
  })

  test('sigils', () => {
    expect(convert({ ...templateCard, sigils: [] }, 'test'))
      .toEqual({ name: 'test' } as JldrCreature)

    expect(convert({ ...templateCard, sigils: ['reach'] }, 'test'))
      .toEqual({ name: 'test', abilities: ['Reach'] } as JldrCreature)

    expect(convert({ ...templateCard, sigils: ['sharp', 'brittle'] }, 'test'))
      .toEqual({ name: 'test', abilities: ['Sharp', 'Brittle'] } as JldrCreature)
  })

  test('additional textures', () => {
    const card: Card = {
      ...templateCard,
      portrait: {
        type: 'custom',
        data: {
          common: Buffer.from([]),
          gbc: Buffer.from([]),
        }
      },
      flags: {
        ...templateCard.flags,
        smoke: true,
        paint: true,
        squid: true,
      }
    }

    const out: Partial<JldrCreature> = {
      name: 'test123',
      texture: 'test123_portrait.png',
      pixelTexture: 'test123_pixel_portrait.png',
      decals: ['test123_paint.png', 'test123_smoke.png'],
      titleGraphic: 'test123_squid.png',
    }

    expect(convert(card, 'test123')).toEqual(out)
  })
})

describe('create resouces from card', () => {

  // check there are files in tempPath
  test('empty template card', () => {
    const tempPath = mkdtempSync('foo')
    createResourcesForCard(tempPath, { ...templateCard }, 'test123', act1Resource, res2)

    const files = readdirSync(tempPath)
    expect(files).toHaveLength(0)

    rmSync(tempPath, { recursive: true, force: true })
  })

  test('card with smoke decal', () => {
    const tempPath = mkdtempSync('foo')
    createResourcesForCard(tempPath, { ...templateCard, flags: { ...templateCard.flags, smoke: true } }, 'test123', act1Resource, res2)

    const files = readdirSync(tempPath)
    expect(files).toHaveLength(1)
    expect(files[0]).toEqual('test123_smoke.png')

    expect(readFileSync(act1Resource.get('decal', 'smoke')).equals(readFileSync(join(tempPath, files[0])))).toBeTruthy()

    rmSync(tempPath, { recursive: true, force: true })
  })
})
