import { Geometry } from './geometry'

const validOffsets: [number, number, string][] = [
  [0, 0, '+0+0'],
  [-0, -0, '+0+0'],
  [13, 15, '+13+15'],
  [-7, 130, '-7+130'],
  [-32, -44, '-32-44'],
  [-12.34, 3.45, '-12.34+3.45'],
]

describe.each(validOffsets)('valid offset', (x, y, result) => {
  test(`with values ${x},${y} to equal '${result}'`, () => {

    expect(new Geometry().offset(x, y).toString()).toStrictEqual(result)

    // expect(new Geometry().offset().toString()).toStrictEqual('')
    // expect(() => new Geometry().offset('1' as any, '1' as any)).toThrowError()
    // expect(() => new Geometry().offset('1' as any, undefined as any)).toThrowError()
  })

})

describe('geometry misc', () => {
  test('size', () => {
    const provider: [number | undefined, number | undefined, string][] = [
      [0, 0, '0x0'],
      [-10, 32, '-10x32'],
      [12, undefined, '12x'],
      [undefined, 14, 'x14'],
      [123.123, 32.32, '123.123x32.32'],
      [123.123, undefined, '123.123x'],
      [undefined, undefined, ''],
    ]

    for (const data of provider) {
      expect(new Geometry().size(data[0], data[1]).toString()).toStrictEqual(data[2])
    }

    expect(new Geometry().size().toString()).toStrictEqual('')
  })

  test('flag', () => {
    const validFlags = ['!', '<', '^', '>', '#'] as const
    for (const flag of validFlags) {
      expect(new Geometry().flag(flag).toString()).toStrictEqual(flag)
    }

    const invalidFlags = ['!<', '@', '>>', 1]
    for (const flag of invalidFlags) {
      // hack to show invalid input will throw
      expect(() => new Geometry().flag(flag as '!').toString()).toThrowError()
    }
  })

  test('geometry with flag', () => {
    expect(new Geometry().size(100, 100).flag('!').toString()).toStrictEqual('100x100!')
    expect(new Geometry().scale(130, 90).flag('^').toString()).toStrictEqual('130%x90%^')
  })
})
