type Card = {
    type: 'common' | 'rare' | 'terrain' | 'pelt'
    portrait: string | undefined
    name: string
    health: number
    power: number | 'ants' | 'bell' | 'cards' | 'mirror' | undefined
    cost?: {
        type: 'blood' | 'bones'
        amount: number
    }
    enhanced: boolean | undefined
    tribes: Tribe[]
    sigils: Sigil[]
    extra?: unknown
}

// type CreatureId = 'custom' | 'stoat' | 'stinkbug' | 'adder'
type Sigil = 'fledgling'
type Tribe = 'canine' | 'insect' | 'reptile' | 'hooved' | 'avian' | undefined


// type PeltCard = Card & {
//     type: 'pelt'
//     extra: {
//         golden: boolean
//     }
// }

// const a: PeltCard = {
//     type: 'pelt',
//     image: 'custom',
//     name: '',
//     health: 1,
//     strength: 1,
//     cost: {
//         type: 'blood',
//         amount: 1,
//     },
//     enhanced: false,
//     powers: [],
//     patches: [],
//     extra: {
//         golden: true
//     }
// }

export { Card }
