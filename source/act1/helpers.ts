import { Card, Cost } from "./types"

function costFromInput(input: any): Cost | undefined {
  if (typeof input === 'string') {
    const match = input.match(/^(\d+)(blood|bones?)$/)
    if (match === null) {
      return undefined
    }

    const amount = Number(match[1])
    let type = match[2]

    if (type === 'bone') {
      type = 'bones'
    }

    return Cost.check({ amount, type })
  }
}

function arrayify(input: unknown) {
  return Array.isArray(input) ? input : [input]
}

function cardFromData(q: any): Card {
  const card = Card.check({
    type: q.type,
    name: q.name,
    portrait: q.portrait,
    health: q.health ? Number(q.health) : undefined,
    data: q.power ? Number(q.power) : undefined,
    cost: costFromInput(q.cost),
    tribes: q['tribes[]'] ? [...new Set(arrayify(q['tribes[]']))] : [],
    sigils: q['sigils[]'] ? [...new Set(arrayify(q['sigils[]']))] : [],
    decals: q['decals[]'] ? [...new Set(arrayify(q['decals[]']))] : [],
    options: {
      isTerrain: q.terrain,
      isEnhanced: q.enhanced,
      portraitData: q.portraitData
    }
  })

  return card
}

export { cardFromData, costFromInput, arrayify }
