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
      this.#commands.push(gravity)
    } else {
      this.#commands.push('+gravity')
    }

    return this
  }

  geometry(x: number, y: number): this {
    this.#commands.push('-geometry')
    this.#commands.push(`${x >= 0 ? '+' : '-'}${Math.abs(x)}${y >= 0 ? '+' : '-'}${Math.abs(y)}`)

    return this
  }

  size(w: number, h: number): this {
    this.#commands.push('-size')
    this.#commands.push(`${w}x${h}`)

    return this
  }

  extent(w: number, h: number): this {
    this.#commands.push('-extent')
    this.#commands.push(`${w}x${h}`)

    return this
  }

  resize(w?: number, h?: number): this {
    if (w || h) {
      this.#commands.push('-resize')
      this.#commands.push(`${w ?? ''}x${h ?? ''}`)
    }

    return this
  }

  resizeExt(fn: (r: Resize) => Resize): this {
    const resize = new ResizeImpl()
    const out = fn(resize)

    if (resize !== out) {
      throw new Error('Must not return custom geometry object')
    }

    if (resize.valid()) {
      this.#commands.push('-resize')
      this.#commands.push(resize.toString())
    }

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
      this.#commands.push(String(size))
    } else {
      this.#commands.push('+pointsize')
    }

    return this
  }

  alpha(type: AlphaType): this {
    this.#commands.push('-alpha')
    this.#commands.push(type)

    return this
  }

  interpolate(type: InterpolateType): this {
    this.#commands.push('-interpolate')
    this.#commands.push(type)

    return this
  }

  filter(type: FilterType): this {
    this.#commands.push('-filter')
    this.#commands.push(type)

    return this
  }

  compose(type: ComposeType): this {
    this.#commands.push('-compose')
    this.#commands.push(type)

    return this
  }

  #escape(input: string | number): string {
    if (typeof input === 'number') {
      return String(input)
    }

    return `'${input.replace(/\\/g, ' \\\\').replace(/'/, '\\\'')}'`
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

interface Resize {
  pixel(w?: number, h?: number, option?: '^' | '!' | '>' | '<'): this
  scale(x?: number, y?: number, option?: '!'): this
  ratio(a: number, b: number, option?: '^' | '#'): this
  area(a: number): this

  toString(): string
}

class ResizeImpl implements Resize {
  pixel(w?: number, h?: number, option?: '^' | '!' | '>' | '<'): this {
    this.#a = w
    this.#b = h
    this.#type = 'pixel'
    this.#option = option

    return this
  }

  scale(x?: number, y?: number): this {
    this.#a = x
    this.#b = y
    this.#type = 'scale'
    this.#option = undefined

    return this
  }

  ratio(a: number, b: number, option?: '^' | '#'): this {
    this.#a = a
    this.#b = b
    this.#type = 'ratio'
    this.#option = option

    return this
  }

  area(a: number): this {
    this.#a = a
    this.#b = undefined
    this.#type = 'area'
    this.#option = undefined

    return this
  }

  toString(): string {
    switch (this.#type) {
      case 'pixel': {
        return `${this.#a ?? ''}x${this.#b ?? ''}${('\\' + this.#option) ?? ''}`
      }
      case 'scale': {
        return `${(this.#a + '%') ?? ''}x${(this.#b + '%') ?? ''}`
      }
      case 'ratio': {
        return `${this.#a}:${this.#b}${('\\' + this.#option) ?? ''}`
      }
      case 'area': {
        return `${this.#a}@`
      }
    }
  }

  valid(): boolean {
    return this.#a !== undefined || this.#b !== undefined
  }

  #a: number | undefined
  #b: number | undefined
  #type: 'pixel' | 'scale' | 'ratio' | 'area' = 'pixel'
  #option: string | undefined
}

export { ImageMagickCommandBuilder as IM }
export default (resource?: string): ImageMagickCommandBuilder => new ImageMagickCommandBuilder(resource)
