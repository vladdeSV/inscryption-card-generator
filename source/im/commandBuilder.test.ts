import { ImageMagickCommandBuilder as IMCB } from './commandBuilder'
import { Fds } from './fds'

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

test('nested custom buffer resources', () => {
  const fds = new Fds()

  const buffer1 = Buffer.from('test1')
  const custom1 = fds.fd(buffer1)

  const buffer2 = Buffer.from('test2')
  const custom2 = fds.fd(buffer2)

  const parent = new IMCB()
  const achild = new IMCB()

  parent.parens(achild).resource(custom1).command('+append')
  achild.resource(custom2)
  expect(parent.parts()).toEqual(['(', 'fd:4', ')', 'fd:3', '+append'])
})
