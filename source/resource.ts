import { existsSync } from 'fs'
import { normalize, join } from 'path'

export class Resource {
  constructor(sourcePath: string, input: { [s: string]: { [s: string]: string } }) {
    this.#path = normalize(sourcePath)
    this.#data = input

    const missingResources: { category: string, id: string, path: string }[] = []
    for (const category in this.#data) {
      if (!Object.prototype.hasOwnProperty.call(this.#data, category)) {
        continue
      }

      const ids = this.#data[category]
      for (const id in ids) {
        if (!Object.prototype.hasOwnProperty.call(ids, id)) {
          continue
        }

        const path = normalize(ids[id])
        const fullpath = join(this.#path, path)

        if (!existsSync(fullpath)) {
          missingResources.push({ category, id, path })
        }
      }
    }

    if (missingResources.length) {
      for (const { category, id, path } of missingResources) {
        console.error(`ERROR: ${category}:${id} '${path}' does not exist`)
      }

      process.exit(1)
    }
  }

  public get(category: string, id: string): string {
    const map = this.#data[category]
    if (map === undefined) {
      throw new Error(`Unrecognized category '${category}'`)
    }

    const dest = map[id]
    if (dest === undefined) {
      throw new Error(`Unrecognized id '${id}'`)
    }

    return join(this.#path, dest)
  }

  #path: string
  #data: { [s: string]: { [s: string]: string } }
}

// const res = new Resource('./resource/', {
//   'card': {
//     'common': '',
//     'rare': '',
//     'terrain': '',
//   }
// })

// res.get('card', 'common')
// res.get('tribe', 'insect')
// res.get('sigil', 'drawant')
// res.get('staticon', 'ant')
// res.get('portrait', 'antqueen')
// res.get('cost', '2blood')
// res.get('emission', 'antqueen')
// res.get('decal', 'smoke')
