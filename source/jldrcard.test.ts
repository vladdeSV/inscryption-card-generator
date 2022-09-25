import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'fs'
import { join } from 'path'
import { Card } from './card'
import { act2Resource } from './generators/gbcCardGenerator'
import { act1Resource } from './generators/leshyCardGenerator'
import { convert, createResourcesForCard, JldrCreature } from './jldrcard'

const defaultMetaCategories = ['ChoiceNode', 'TraderOffer', 'GBCPack', 'GBCPlayable']

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
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories } as JldrCreature)
  })

  test('display name', () => {
    expect(convert({ ...templateCard, name: 'Foo Bar' }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories, displayedName: 'Foo Bar' } as JldrCreature)

    expect(convert({ ...templateCard, name: '' }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories } as JldrCreature)

    expect(convert({ ...templateCard }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories } as JldrCreature)
  })

  test('power', () => {
    expect(convert({ ...templateCard, power: 0 }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories } as JldrCreature)

    expect(convert({ ...templateCard, power: 1 }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories, baseAttack: 1 } as JldrCreature)
  })

  test('health', () => {
    expect(convert({ ...templateCard, health: 0 }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories } as JldrCreature)

    expect(convert({ ...templateCard, health: 1 }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories, baseHealth: 1 } as JldrCreature)

    expect(convert({ ...templateCard, health: 4 }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories, baseHealth: 4 } as JldrCreature)
  })

  test('blood cost', () => {
    const card = convert({ ...templateCard, cost: { type: 'blood', amount: 1, } }, 'test')
    expect(card).toEqual({ name: 'test', metaCategories: defaultMetaCategories, bloodCost: 1, } as JldrCreature)
  })

  test('bone cost', () => {
    const card = convert({ ...templateCard, cost: { type: 'bone', amount: 1, } }, 'test')
    expect(card).toEqual({ name: 'test', metaCategories: defaultMetaCategories, bonesCost: 1, } as JldrCreature)
  })

  test('energy cost', () => {
    const card = convert({ ...templateCard, cost: { type: 'energy', amount: 1, } }, 'test')
    expect(card).toEqual({ name: 'test', metaCategories: defaultMetaCategories, energyCost: 1, } as JldrCreature)
  })

  test('tribes', () => {
    expect(convert({ ...templateCard, tribes: [] }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories } as JldrCreature)

    expect(convert({ ...templateCard, tribes: ['canine'] }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories, tribes: ['Canine'] } as JldrCreature)

    expect(convert({ ...templateCard, tribes: ['squirrel', 'reptile', 'canine', 'bird', 'hooved', 'insect'] }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories, tribes: ['Squirrel', 'Reptile', 'Canine', 'Bird', 'Hooved', 'Insect',] } as JldrCreature)
  })

  test('temple', () => {
    expect(convert({ ...templateCard, temple: 'nature' }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories } as JldrCreature)

    expect(convert({ ...templateCard, temple: 'tech' }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories, temple: 'Tech' } as JldrCreature)
  })

  test('rare', () => {
    expect(convert({ ...templateCard, flags: { ...templateCard.flags, rare: false } }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories } as JldrCreature)

    expect(convert({ ...templateCard, flags: { ...templateCard.flags, rare: true } }, 'test'))
      .toEqual({ name: 'test', metaCategories: [...defaultMetaCategories, 'Rare'], appearanceBehaviour: ['RareCardBackground'] } as JldrCreature)
  })

  test('terrain', () => {
    expect(convert({ ...templateCard, flags: { ...templateCard.flags, terrain: false, terrainLayout: false } }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories } as JldrCreature)

    expect(convert({ ...templateCard, flags: { ...templateCard.flags, terrain: true, terrainLayout: false } }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories, appearanceBehaviour: ['TerrainBackground'], traits: ['Terrain'] } as JldrCreature)

    expect(convert({ ...templateCard, flags: { ...templateCard.flags, terrain: false, terrainLayout: true } }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories, appearanceBehaviour: ['TerrainLayout'] } as JldrCreature)

    expect(convert({ ...templateCard, flags: { ...templateCard.flags, terrain: true, terrainLayout: true } }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories, appearanceBehaviour: ['TerrainBackground', 'TerrainLayout'], traits: ['Terrain'] } as JldrCreature)
  })

  test('stat icons', () => {

    expect(convert({ ...templateCard, statIcon: undefined }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories } as JldrCreature)

    expect(convert({ ...templateCard, statIcon: undefined, power: 2 }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories, baseAttack: 2 } as JldrCreature)

    expect(convert({ ...templateCard, statIcon: 'ants' }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories, specialStatIcon: 'Ants', specialAbilities: ['Ant'] } as JldrCreature)

    expect(convert({ ...templateCard, statIcon: 'bell' }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories, specialStatIcon: 'Bell', specialAbilities: ['BellProximity'] } as JldrCreature)

    expect(convert({ ...templateCard, statIcon: 'bones' }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories, specialStatIcon: 'Bones', specialAbilities: ['Lammergeier'] } as JldrCreature)

    expect(convert({ ...templateCard, statIcon: 'cardsinhand' }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories, specialStatIcon: 'CardsInHand', specialAbilities: ['CardsInHand'] } as JldrCreature)

    expect(convert({ ...templateCard, statIcon: 'greengems' }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories, specialStatIcon: 'GreenGems', specialAbilities: ['GreenMage'] } as JldrCreature)

    expect(convert({ ...templateCard, statIcon: 'mirror' }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories, specialStatIcon: 'Mirror', specialAbilities: ['Mirror'] } as JldrCreature)

    expect(convert({ ...templateCard, statIcon: 'sacrificesthisturn' }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories, specialStatIcon: 'SacrificesThisTurn', specialAbilities: ['SacrificesThisTurn'] } as JldrCreature)
  })

  test('misc', () => {
    expect(convert({ ...templateCard, flags: { ...templateCard.flags, blood: true } }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories, appearanceBehaviour: ['AlternatingBloodDecal'] } as JldrCreature)

    expect(convert({ ...templateCard, flags: { ...templateCard.flags, golden: true } }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories, appearanceBehaviour: ['GoldEmission'] } as JldrCreature)

    expect(convert({ ...templateCard, flags: { ...templateCard.flags, redEmission: true } }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories, appearanceBehaviour: ['RedEmission'] } as JldrCreature)
  })

  test('fused', () => {
    const out = convert({ ...templateCard, flags: { ...templateCard.flags, fused: true } }, 'test')
    expect(out.traits?.includes('Fused')).toBeTruthy()
    // todo decals
  })

  test('sigils', () => {
    expect(convert({ ...templateCard, sigils: [] }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories } as JldrCreature)

    expect(convert({ ...templateCard, sigils: ['reach'] }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories, abilities: ['Reach'] } as JldrCreature)

    expect(convert({ ...templateCard, sigils: ['sharp', 'brittle'] }, 'test'))
      .toEqual({ name: 'test', metaCategories: defaultMetaCategories, abilities: ['Sharp', 'Brittle'] } as JldrCreature)
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
      metaCategories: ['ChoiceNode', 'TraderOffer', 'GBCPack', 'GBCPlayable']
    }

    expect(convert(card, 'test123')).toEqual(out)
  })
})

describe('create resouces from card', () => {

  // check there are files in tempPath
  test('empty template card', async () => {
    const tempPath = mkdtempSync('foo')
    await createResourcesForCard(tempPath, { ...templateCard }, 'test123', act1Resource, act2Resource)

    const files = readdirSync(tempPath)
    expect(files).toHaveLength(0)

    rmSync(tempPath, { recursive: true, force: true })
  })

  test('card with smoke decal', async () => {
    const tempPath = mkdtempSync('foo')
    await createResourcesForCard(tempPath, { ...templateCard, flags: { ...templateCard.flags, smoke: true } }, 'test123', act1Resource, act2Resource)

    const files = readdirSync(tempPath)
    expect(files).toHaveLength(1)
    expect(files[0]).toEqual('test123_smoke.png')

    expect(readFileSync(act1Resource.get('decal', 'smoke')).equals(readFileSync(join(tempPath, files[0])))).toBeTruthy()

    rmSync(tempPath, { recursive: true, force: true })
  })

  test('card with custom portrait', async () => {
    const tempPath = mkdtempSync('foo')

    // buffer from base64 string
    const redSquare20x20pxBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAABQAAAAUAQMAAAC3R49OAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABlBMVEX/AAD///9BHTQRAAAAAWJLR0QB/wIt3gAAAAd0SU1FB+YGARIwL1AAvE4AAAAMSURBVAjXY2CgLgAAAFAAASIT6HUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjItMDYtMDFUMTg6NDg6NDcrMDA6MDA0lwTpAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIyLTA2LTAxVDE4OjQ4OjQ3KzAwOjAwRcq8VQAAAABJRU5ErkJggg==', 'base64')

    await createResourcesForCard(tempPath, {
      ...templateCard,
      portrait: {
        type: 'custom',
        data: {
          common: undefined,
          gbc: redSquare20x20pxBuffer,
        }
      }
    }, 'test123', act1Resource, act2Resource)

    const files = readdirSync(tempPath)
    expect(files).toHaveLength(1)
    expect(files[0]).toEqual('test123_pixel_portrait.png')

    rmSync(tempPath, { recursive: true, force: true })
  })

  test('card with all resources', async () => {
    const card: Card = {
      ...templateCard,
      portrait: {
        type: 'resource',
        resourceId: 'adder',
      },
      flags: {
        ...templateCard.flags,
        smoke: true,
        squid: true,
        paint: true,
        fused: true,
      }
    }

    const tempPath = mkdtempSync('foo')
    await createResourcesForCard(tempPath, card, 'test123', act1Resource, act2Resource)
    const files = readdirSync(tempPath)
    expect(files).toHaveLength(7)
    expect(files.sort()).toEqual([
      'test123_smoke.png',
      'test123_squid.png',
      'test123_paint.png',
      'test123_fungus.png',
      'test123_stitches.png',
      'test123_portrait.png',
      'test123_pixel_portrait.png',
    ].sort())

    // expect all files to equal resources
    expect(readFileSync(act1Resource.get('decal', 'smoke')).equals(readFileSync(join(tempPath, 'test123_smoke.png')))).toBeTruthy()
    expect(readFileSync(act1Resource.get('misc', 'squid_title')).equals(readFileSync(join(tempPath, 'test123_squid.png')))).toBeTruthy()
    expect(readFileSync(act1Resource.get('decal', 'paint')).equals(readFileSync(join(tempPath, 'test123_paint.png')))).toBeTruthy()
    expect(readFileSync(act1Resource.get('decal', 'fungus')).equals(readFileSync(join(tempPath, 'test123_fungus.png')))).toBeTruthy()
    expect(readFileSync(act1Resource.get('decal', 'stitches')).equals(readFileSync(join(tempPath, 'test123_stitches.png')))).toBeTruthy()
    expect(readFileSync(act1Resource.get('portrait', 'adder')).equals(readFileSync(join(tempPath, 'test123_portrait.png')))).toBeTruthy()
    expect(readFileSync(act2Resource.get('portrait', 'adder')).equals(readFileSync(join(tempPath, 'test123_pixel_portrait.png')))).toBeTruthy()

    rmSync(tempPath, { recursive: true, force: true })
  })
})
