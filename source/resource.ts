import { existsSync } from 'fs'
import { normalize, join } from 'path'

export { ResourceMap, Resource, SingleResource, ResourceError }

type ResourceMap = Record<string, Record<string, string>>
interface Resource {
  has(category: string, id: string): boolean,
  get(category: string, id: string, defaultResourceId?: string): string,
}

class SingleResource implements Resource {
  constructor(sourcePath: string, input: ResourceMap) {
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

      throw 'ERROR: Missing resource(s)'
    }
  }

  public has(category: string, id: string): boolean {
    return this.#data[category]?.[id] !== undefined
  }

  public get(category: string, id: string, defaultResourceId?: string): string {
    const map = this.#data[category]
    if (map === undefined) {
      throw new ResourceError(`Unrecognized category '${category}'`, category)
    }

    const dest = map[id] ?? (defaultResourceId ? map[defaultResourceId] : undefined)
    if (dest === undefined) {
      throw new ResourceError(`Unrecognized id '${category}:${id}'`, category, id)
    }

    return join(this.#path, dest)
  }

  #path: string
  #data: ResourceMap
}

class ResourceError extends Error {
  constructor(message: string, category: string, id?: string) {
    super(message)
    this.name = 'ResourceError'
    this.category = category
    this.id = id
  }

  public category: string
  public id: string | undefined
}
