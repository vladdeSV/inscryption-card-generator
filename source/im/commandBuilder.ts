import { Geometry } from './geometry'

export { ImageMagickCommandBuilder }

class ImageMagickCommandBuilder {
  constructor(resource?: string) {
    if (resource) {
      this.#commands.push(this.#escape(resource))
    }
  }

  clone(index?: number): ImageMagickCommandBuilder {
    if (index) {
      this.#commands.push('-clone')
      this.#commands.push(this.#escape(index))
    } else {
      this.#commands.push('+clone')
    }

    return this
  }

  parts(): string[] {
    const a: string[] = []
    this.#commands.forEach(part => part instanceof ImageMagickCommandBuilder ? a.push(...part.parts()) : a.push(part))

    return a
  }

  command(...commands: string[]): this {
    this.#commands.push(...commands)

    return this
  }

  resource(resource: string): this {
    this.#commands.push(this.#escape(resource))

    return this
  }

  parens(im: this): this {
    this.#commands.push('(')
    this.#commands.push(im)
    this.#commands.push(')')

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

  size(w?: number, h?: number): this {
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

  fill(color: string): this {
    this.#commands.push('-fill')
    this.#commands.push(this.#escape(color))

    return this
  }

  opaque(color: string, invert?: boolean): this {
    this.#commands.push(invert ? '+opaque' : '-opaque')
    this.#commands.push(this.#escape(color))

    return this
  }

  sanitize(input: unknown) {
    return this.#escape(input)
  }

  #escape(data: unknown): string {
    const input = String(data)

    return input

    // if single safe word, return it
    if (input.match(/^[\w+-]+$/)) {
      return input
    }

    return `'${input.replace(/\\/g, '\\\\').replace(/'/, '\\\'')}'`
  }

  #commands: (string | ImageMagickCommandBuilder)[] = []
}

type GravityType = 'None' | 'Center' | 'East' | 'Forget' | 'NorthEast' | 'North' | 'NorthWest' | 'SouthEast' | 'South' | 'SouthWest' | 'West'
type FilterType = 'Bartlett' | 'Blackman' | 'Bohman' | 'Box' | 'Catrom' | 'Cosine' | 'Cubic' | 'Gaussian' | 'Hamming' | 'Hann' | 'Hermite' | 'Jinc' | 'Kaiser' | 'Lagrange' | 'Lanczos' | 'Lanczos2' | 'Lanczos2Sharp' | 'LanczosRadius' | 'LanczosSharp' | 'Mitchell' | 'Parzen' | 'Point' | 'Quadratic' | 'Robidoux' | 'RobidouxSharp' | 'Sinc' | 'SincFast' | 'Spline' | 'CubicSpline' | 'Triangle' | 'Welch'
type InterpolateType = 'Average' | 'Average4' | 'Average9' | 'Average16' | 'Background' | 'Bilinear' | 'Blend' | 'Catrom' | 'Integer' | 'Mesh' | 'Nearest' | 'Spline'
type AlphaType = 'Activate' | 'Associate' | 'Background' | 'Copy' | 'Deactivate' | 'Discrete' | 'Disassociate' | 'Extract' | 'Off' | 'On' | 'Opaque' | 'Remove' | 'Set' | 'Shape' | 'Transparent'
type ComposeType = 'Atop' | 'Blend' | 'Blur' | 'Bumpmap' | 'ChangeMask' | 'Clear' | 'ColorBurn' | 'ColorDodge' | 'Colorize' | 'CopyAlpha' | 'CopyBlack' | 'CopyBlue' | 'Copy' | 'CopyCyan' | 'CopyGreen' | 'CopyMagenta' | 'CopyRed' | 'CopyYellow' | 'Darken' | 'DarkenIntensity' | 'Difference' | 'Displace' | 'Dissolve' | 'Distort' | 'DivideDst' | 'DivideSrc' | 'DstAtop' | 'Dst' | 'DstIn' | 'DstOut' | 'DstOver' | 'Exclusion' | 'Freeze' | 'HardLight' | 'HardMix' | 'Hue' | 'In' | 'Intensity' | 'Interpolate' | 'LightenIntensity' | 'Lighten' | 'LinearBurn' | 'LinearDodge' | 'LinearLight' | 'Luminize' | 'Mathematics' | 'MinusDst' | 'MinusSrc' | 'Modulate' | 'ModulusAdd' | 'ModulusSubtract' | 'Multiply' | 'Negate' | 'None' | 'Out' | 'Overlay' | 'Over' | 'PegtopLight' | 'PinLight' | 'Plus' | 'Reflect' | 'Replace' | 'RMSE' | 'Saturate' | 'Screen' | 'SoftBurn' | 'SoftDodge' | 'SoftLight' | 'SrcAtop' | 'SrcIn' | 'SrcOut' | 'SrcOver' | 'Src' | 'Stamp' | 'Stereo' | 'VividLight' | 'Xor'
