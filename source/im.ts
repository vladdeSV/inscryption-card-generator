class IM {
    constructor(resource: string) {
        this.#commands.push(this.#escape(resource))
    }

    build(executable: 'convert' | 'magick' | 'mogrify', out: string): string {
        this.#commands = [executable, ...this.#commands, this.#escape(out)]

        return this.#join()
    }

    command(unsanitizedInput: string): typeof this {
        this.#commands.push(unsanitizedInput)

        return this
    }

    parens(im: typeof this): typeof this {
        this.#commands.push('\\(')
        this.#commands.push(im.#join())
        this.#commands.push('\\)')

        return this
    }

    composite(): typeof this {
        this.#commands.push('-composite')

        return this
    }

    gravity(gravity?: 'northwest' | 'north' | 'northeast' | 'west' | 'center' | 'east' | 'southwest' | 'south' | 'southeast'): typeof this {
        if (gravity) {
            this.#commands.push('-gravity')
            this.#commands.push(gravity)
        } else {
            this.#commands.push('+gravity')
        }

        return this
    }

    geometry(x: number, y: number): typeof this {
        this.#commands.push('-geometry')
        this.#commands.push(`${x >= 0 ? '+' : '-'}${Math.abs(x)}${y >= 0 ? '+' : '-'}${Math.abs(y)}`)

        return this
    }

    size(w: number, h: number): typeof this {
        this.#commands.push('-size')
        this.#commands.push(`${w}x${h}`)

        return this
    }

    extent(w: number, h: number): typeof this {
        this.#commands.push('-extent')
        this.#commands.push(`${w}x${h}`)

        return this
    }

    // todo resize percentage
    resize(w?: number, h?: number): typeof this {
        if (w || h) {
            this.#commands.push('-resize')
            this.#commands.push(`${w ?? ''}x${h ?? ''}`)
        }

        return this
    }

    background(background: string): typeof this {
        if (background) {
            this.#commands.push('-background')
            this.#commands.push(background)
        }

        return this
    }

    trim(): typeof this {
        this.#commands.push('-trim')

        return this
    }

    label(input: string | number): typeof this {
        this.#commands.push(`label:${this.#escape(input)}`)

        return this
    }

    font(font: string): typeof this {
        this.#commands.push('-font')
        this.#commands.push(this.#escape(font))

        return this
    }

    pointsize(size: number): typeof this {
        this.#commands.push('-pointsize')
        this.#commands.push(String(size))

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

export { IM }
