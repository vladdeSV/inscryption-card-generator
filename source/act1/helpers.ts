import gm, { State } from "gm"
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

function imageStateFromCard(card: Card): State {
  const state = gm.subClass({ imageMagick: true })(`./resource/cards/${card.type}.png`)
    .font('./resource/HEAVYWEIGHT.TTF')
    .filter('Box')

  const portrait = card.portrait
  if (portrait) {
    if (portrait === 'custom') {
      // todo
    } else {
      // state.
    }
  }

  state.resize(674, 1024)

  const name = card.name
  if (name) {
    state.out('(')
      .pointSize(120)
      .gravity('center')
      .draw(`gravity center scale 1.15,1 text 0,-408 '${name}'`)
      .out(')')
  }

  return state
}

export { cardFromData, imageStateFromCard, costFromInput, arrayify }
