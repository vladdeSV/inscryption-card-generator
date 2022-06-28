export { Fds }

class Fds {

  fd(buffer: Buffer): string {
    const bufferStartIndex = 3
    const currentBufferLength = this.#buffers.length

    this.#buffers.push(buffer)

    return `fd:${bufferStartIndex + currentBufferLength}`
  }

  fds(): Buffer[] {
    return this.#buffers
  }

  #buffers: Buffer[] = []
}
