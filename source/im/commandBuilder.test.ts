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
