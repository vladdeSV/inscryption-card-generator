class ImageMagickCommandBuilder {
  constructor(resource?: string) {
    if (resource) {
      this.#commands.push(this.#escape(resource))
    }
  }

  build(executable: 'convert' | 'magick', out: string): string {
    this.#commands = [executable, ...this.#commands, this.#escape(out)]

    return this.#join()
  }

  command(unsanitizedInput: string): this {
    this.#commands.push(unsanitizedInput)

    return this
  }

  resource(resource: string): this {
    this.#commands.push(this.#escape(resource))

    return this
  }

  parens(im: this): this {
    this.#commands.push('\\(')
    this.#commands.push(im.#join())
    this.#commands.push('\\)')

    return this
  }

  composite(): this {
    this.#commands.push('-composite')

    return this
  }

  gravity(gravity?: GravityType): this {
    if (gravity) {
      this.#commands.push('-gravity')
      this.#commands.push(this.#escape(gravity))
    } else {
      this.#commands.push('+gravity')
    }

    return this
  }

  geometry(x: number, y: number): this {
    this.#commands.push('-geometry')
    this.#commands.push(this.#escape(new Geometry().offset(x, y).toString()))

    return this
  }

  size(w: number, h: number): this {
    this.#commands.push('-size')
    this.#commands.push(this.#escape(new Geometry().size(w, h).toString()))

    return this
  }

  extent(w: number, h: number): this {
    this.#commands.push('-extent')
    this.#commands.push(this.#escape(new Geometry().size(w, h).toString()))

    return this
  }

  resize(w?: number, h?: number): this {
    if (w || h) {
      this.#commands.push('-resize')
      this.#commands.push(this.#escape(new Geometry().size(w, h).toString()))
    }

    return this
  }

  resizeExt(fn: (g: Geometry) => Geometry): this {
    const geometry = fn(new Geometry())

    this.#commands.push('-resize')
    this.#commands.push(this.#escape(geometry.toString()))

    return this
  }

  background(background: string): this {
    this.#commands.push('-background')
    this.#commands.push(this.#escape(background))

    return this
  }

  trim(): this {
    this.#commands.push('-trim')

    return this
  }

  label(input: string | number): this {
    this.#commands.push(`label:${this.#escape(input)}`)

    return this
  }

  font(font: string): this {
    this.#commands.push('-font')
    this.#commands.push(this.#escape(font))

    return this
  }

  pointsize(size?: number): this {
    if (size) {
      this.#commands.push('-pointsize')
      this.#commands.push(this.#escape(size))
    } else {
      this.#commands.push('+pointsize')
    }

    return this
  }

  alpha(type: AlphaType): this {
    this.#commands.push('-alpha')
    this.#commands.push(this.#escape(type))

    return this
  }

  interpolate(type: InterpolateType): this {
    this.#commands.push('-interpolate')
    this.#commands.push(this.#escape(type))

    return this
  }

  filter(type: FilterType): this {
    this.#commands.push('-filter')
    this.#commands.push(this.#escape(type))

    return this
  }

  compose(type: ComposeType): this {
    this.#commands.push('-compose')
    this.#commands.push(this.#escape(type))

    return this
  }

  // expose escape method.
  sanitize(input: unknown) {
    return this.#escape(input)
  }

  #escape(data: unknown): string {
    const input = String(data)

    // if single safe word, return it
    if (input.match(/^[\w+-]+$/)) {
      return input
    }

    return `'${input.replace(/\\/g, '\\\\').replace(/'/, '\\\'')}'`
  }

  #join(): string {
    return this.#commands.join(' ')
  }

  #commands: string[] = []
}

type GravityType = 'None' | 'Center' | 'East' | 'Forget' | 'NorthEast' | 'North' | 'NorthWest' | 'SouthEast' | 'South' | 'SouthWest' | 'West'
type FilterType = 'Bartlett' | 'Blackman' | 'Bohman' | 'Box' | 'Catrom' | 'Cosine' | 'Cubic' | 'Gaussian' | 'Hamming' | 'Hann' | 'Hermite' | 'Jinc' | 'Kaiser' | 'Lagrange' | 'Lanczos' | 'Lanczos2' | 'Lanczos2Sharp' | 'LanczosRadius' | 'LanczosSharp' | 'Mitchell' | 'Parzen' | 'Point' | 'Quadratic' | 'Robidoux' | 'RobidouxSharp' | 'Sinc' | 'SincFast' | 'Spline' | 'CubicSpline' | 'Triangle' | 'Welch'
type InterpolateType = 'Average' | 'Average4' | 'Average9' | 'Average16' | 'Background' | 'Bilinear' | 'Blend' | 'Catrom' | 'Integer' | 'Mesh' | 'Nearest' | 'Spline'
type AlphaType = 'Activate' | 'Associate' | 'Background' | 'Copy' | 'Deactivate' | 'Discrete' | 'Disassociate' | 'Extract' | 'Off' | 'On' | 'Opaque' | 'Remove' | 'Set' | 'Shape' | 'Transparent'
type ComposeType = 'Atop' | 'Blend' | 'Blur' | 'Bumpmap' | 'ChangeMask' | 'Clear' | 'ColorBurn' | 'ColorDodge' | 'Colorize' | 'CopyAlpha' | 'CopyBlack' | 'CopyBlue' | 'Copy' | 'CopyCyan' | 'CopyGreen' | 'CopyMagenta' | 'CopyRed' | 'CopyYellow' | 'Darken' | 'DarkenIntensity' | 'Difference' | 'Displace' | 'Dissolve' | 'Distort' | 'DivideDst' | 'DivideSrc' | 'DstAtop' | 'Dst' | 'DstIn' | 'DstOut' | 'DstOver' | 'Exclusion' | 'Freeze' | 'HardLight' | 'HardMix' | 'Hue' | 'In' | 'Intensity' | 'Interpolate' | 'LightenIntensity' | 'Lighten' | 'LinearBurn' | 'LinearDodge' | 'LinearLight' | 'Luminize' | 'Mathematics' | 'MinusDst' | 'MinusSrc' | 'Modulate' | 'ModulusAdd' | 'ModulusSubtract' | 'Multiply' | 'Negate' | 'None' | 'Out' | 'Overlay' | 'Over' | 'PegtopLight' | 'PinLight' | 'Plus' | 'Reflect' | 'Replace' | 'RMSE' | 'Saturate' | 'Screen' | 'SoftBurn' | 'SoftDodge' | 'SoftLight' | 'SrcAtop' | 'SrcIn' | 'SrcOut' | 'SrcOver' | 'Src' | 'Stamp' | 'Stereo' | 'VividLight' | 'Xor'

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

    return parts.join()
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

// const provider: [number, number, string | undefined][] = [
//   [10, 10, '+10+10'],
//   [-10, 10, '-10+10'],
//   [-0, 0, '+0+0'],
//   [5, -5, '+5-5'],
//   [5, -5, '+5-5'],

//   [10, '10' as any, undefined],
//   [-10, '10' as any, undefined],
//   [-0, '0' as any, undefined],
//   [5, '-5' as any, undefined],
//   [5, '-5' as any, undefined],
// ]

// for (const p of provider) {
//   try {
//     if (new Geometry().offset(p[0], p[1]).toString() !== p[2]) {
//       throw p
//     }
//   } catch (e: unknown) {
//     if (p[2] !== undefined) {
//       throw p
//     }
//   }
// }

// const im = new ImageMagickCommandBuilder()
// im.resizeExt((g: any): GeometryData => g.size())

export { ImageMagickCommandBuilder as IM }
export default (resource?: string): ImageMagickCommandBuilder => new ImageMagickCommandBuilder(resource)
