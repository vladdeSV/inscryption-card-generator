export { Geometry }

class Geometry {
  offset(x: number, y: number): this
  offset(): this
  offset(x?: number, y?: number): this {
    if (x === undefined && y === undefined) {
      this.#offset = undefined
    } else if (typeof x === 'number' && typeof y === 'number') {
      this.#offset = { x: Number(x), y: Number(y) }
    } else {
      throw Error(`Invalid parameters for offset '${x},${y}'`)
    }

    return this
  }

  flag(flag: '^' | '!' | '<' | '>' | '#'): this {
    const availableFlags = ['^', '!', '<', '>', '#']

    if (!availableFlags.includes(flag)) {
      throw new Error(`Invalid flag '${flag}'`)
    }

    this.#flag = flag

    return this
  }

  size(w: number | undefined, h: number | undefined): this
  size(): this
  size(w?: number | undefined, h?: number | undefined): this {
    // special case, setting both width and height to undefined resets size
    // todo(vladde): should this be the case?
    if (w === undefined && h === undefined) {
      this.#data = undefined
      return this
    }

    const data: GeometrySizeData = {
      type: 'size',
      width: w === undefined ? undefined : Number(w),
      height: h === undefined ? undefined : Number(h),
    }
    this.#data = data

    return this
  }

  scale(x: number, y?: number): this {
    const data: GeometryScaleData = {
      type: 'scale',
      x: Number(x),
      y: y === undefined ? undefined : Number(y),
    }
    this.#data = data

    return this
  }

  ratio(x: number, y: number): this {
    const data: GeometryRatioData = {
      type: 'ratio',
      x: Number(x),
      y: Number(y),
    }
    this.#data = data

    return this
  }

  area(area: number): this {
    const data: GeometryAreaData = {
      type: 'area',
      area: Number(area),
    }

    this.#data = data

    return this
  }

  toString(): string {
    const parts: string[] = []

    switch (this.#data?.type) {
      case 'size': {
        const { width, height } = this.#data
        const w = width === undefined ? '' : Number(width)
        const h = height === undefined ? '' : Number(height)

        parts.push(`${w}x${h}`)
        break
      }
      case 'scale': {
        const { x, y } = this.#data
        const percentageString = [x, y]
          .filter(n => typeof n === 'number')
          .map(n => `${Number(n)}%`)
          .join('x')

        parts.push(percentageString)
        break
      }
      case 'ratio': {
        const { x, y } = this.#data

        parts.push(`${Number(x)}:${Number(y)}`)
        break
      }
      case 'area': {
        const area = this.#data.area

        parts.push(`${Number(area)}@`)
        break
      }
    }

    if (this.#flag) {
      const flag = this.#flag
      const availableFlags = ['^', '!', '<', '>', '#']

      if (!availableFlags.includes(flag)) {
        throw new Error(`Invalid flag '${flag}'`)
      }

      parts.push(flag)
    }

    if (this.#offset) {
      const { x, y } = this.#offset
      const formatOffsetNumber = (n: number) => (n >= 0 ? '+' : '-') + Math.abs(n)

      parts.push(`${formatOffsetNumber(x)}${formatOffsetNumber(y)}`)
    }

    return parts.join('')
  }

  #data?: GeometryData = undefined
  #offset?: { x: number, y: number }
  #flag?: '^' | '!' | '<' | '>' | '#'
}

type GeometryData = GeometrySizeData | GeometryScaleData | GeometryRatioData | GeometryAreaData
type GeometrySizeData = {
  type: 'size',
  width: number | undefined,
  height: number | undefined,
}
type GeometryScaleData = {
  type: 'scale',
  x: number,
  y: number | undefined,
}
type GeometryRatioData = {
  type: 'ratio',
  x: number,
  y: number,
}
type GeometryAreaData = {
  type: 'area',
  area: number,
}
