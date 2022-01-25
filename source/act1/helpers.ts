import { Card, CardBack, CardBackType, CardType, Power } from './types'

function powerFromInput(input: unknown): number | Power | undefined {
  if (Power.guard(input)) {
    return input
  }

  const power = Number(input)
  if (!Number.isNaN(power)) {
    return power
  }
}

function arrayify(input: unknown) {
  return Array.isArray(input) ? input : [input]
}

function cardFromData(body: any): Card {
  const card = Card.check({
    type: body.type,
    name: body.name,
    portrait: body.portrait,
    health: body.health !== undefined ? Number(body.health) : undefined,
    power: powerFromInput(body.power),
    cost: body.cost,
    tribes: body.tribes ? [...new Set(arrayify(body.tribes))] : [],
    sigils: body.sigils ? [...new Set(arrayify(body.sigils))] : [],
    decals: body.decals ? [...new Set(arrayify(body.decals))] : [],
    options: {
      isTerrain: body.terrain,
      isEnhanced: body.enhanced,
      isGolden: body.golden,
      hasBorder: body.border,
      portraitData: body.portraitData
    },
    extra: body.extra
  })

  if (card.portrait === 'custom') {
    if (typeof card.options?.portraitData !== 'string') {
      throw 'custom portrait requires data'
    }

    card.options.portraitData = card.options.portraitData.replace(/[\s\r\n]/g, '')
  }

  return card
}

function cardBackFromData(body: any): CardBack {
  const cardBack = CardBack.check({
    type: body.type,
    options: {
      hasBorder: body.border,
    }
  })

  return cardBack
}

export { cardFromData, cardBackFromData }
