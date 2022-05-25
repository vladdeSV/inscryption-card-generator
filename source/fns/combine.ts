// import { readdirSync, readFileSync, writeFileSync } from 'fs'

// const filenames = readdirSync('creatures')
// const jsonFilenames = filenames.filter(filename => filename.endsWith('.jldr2'))
// const contents = jsonFilenames.map(x => readFileSync('creatures/' + x, 'utf-8'))
// const json = '[' + contents.join(',\n') + ']'
// writeFileSync('creatures.json', json)

// ----

// import { readFileSync, writeFileSync } from 'fs'

// const json = JSON.parse(readFileSync('creatures.json', 'utf-8')) as any[]

// const map = {} as any

// for (const j of json) {
//   for (let key in j) {
//     if (Object.prototype.hasOwnProperty.call(j, key)) {
//       const element = j[key]

//       let vals
//       if (!Array.isArray(element)) {
//         vals = [element]
//       } else {
//         vals = element
//         key = key + '_Array'
//       }

//       if (!(key in map)) {
//         map[key] = []
//       }

//       for (const val of vals) {
//         if (map[key].includes(val)) {
//           continue
//         }

//         map[key].push(val)
//       }
//     }
//   }
// }

// writeFileSync('creatures_map.json', JSON.stringify(map))

// -----

import { JldrCreature } from './source/jldrcard'
import { readFileSync, writeFileSync } from 'fs'

const creatures = JSON.parse(readFileSync('creatures.json', 'utf-8'))

if (!Array.isArray(creatures)) {
  throw 'creatures not array'
}

const jldrCreatures = creatures.map(JldrCreature.check)

console.dir(jldrCreatures, { depth: null, maxArrayLength: null, maxStringLength: null })
