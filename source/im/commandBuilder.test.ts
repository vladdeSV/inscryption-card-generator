import { ImageMagickCommandBuilder as IMCB } from './commandBuilder'

test('empty command', () => {
  const command = new IMCB()
  expect(command.parts()).toEqual([])
})

test('simple resource', () => {
  const command = new IMCB('test.jpg')
  expect(command.parts()).toEqual(['test.jpg'])
})

test('simple command with parameters', () => {
  const command = new IMCB('-').background('red').gravity('NorthEast').geometry(10, 10)
  expect(command.parts()).toEqual(['-', '-background', 'red', '-gravity', 'NorthEast', '-geometry', '+10+10'])
})

test('command with nested command', () => {
  const command = new IMCB('-').parens(new IMCB('test')).gravity('NorthEast').geometry(10, 10).composite()
  expect(command.parts()).toEqual(['-', '(', 'test', ')', '-gravity', 'NorthEast', '-geometry', '+10+10', '-composite'])
})

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

test('multiple custom buffer resources', () => {
  const command = new IMCB()
  const fds = new Fds()

  const bufferFoo = Buffer.from('test1')
  const customFoo = fds.fd(bufferFoo)

  expect(customFoo).toEqual('fd:3')
  expect(fds.fds()).toEqual([bufferFoo])

  const bufferBar = Buffer.from('test2')
  const customBar = fds.fd(bufferBar)

  expect(customBar).toEqual('fd:4')
  expect(fds.fds()).toEqual([bufferFoo, bufferBar])

  command.resource(customFoo).resource(customBar)
  expect(command.parts()).toEqual(['fd:3', 'fd:4'])
})
