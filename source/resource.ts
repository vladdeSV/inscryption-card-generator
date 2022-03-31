import { existsSync } from 'fs'
import { normalize, join } from 'path'

export class Resource<T extends { [s: string]: { [s: string]: string } }> {
  constructor(sourcePath: string, input: T) {
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

      throw ''
    }
  }

  public has(category: string, id: string): boolean {
    return this.#data[category]?.[id] !== undefined
  }

  public get(category: string, id: string, defaultResourceId?: string): string {
    const map = this.#data[category]
    if (map === undefined) {
      throw `Unrecognized category '${category}'`
    }

    const dest = map[id] ?? (defaultResourceId ? map[defaultResourceId] : undefined)
    if (dest === undefined) {
      throw `Unrecognized id '${category}:${id}'`
    }

    return join(this.#path, dest)
  }

  #path: string
  #data: T
}
