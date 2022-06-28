import { Fds } from './fds'

test('custom buffer resources', () => {
  const fds = new Fds()

  const bufferFoo = Buffer.from('test1')
  const bufferBar = Buffer.from('test2')

  const customFoo = fds.fd(bufferFoo)
  const customBar = fds.fd(bufferBar)

  expect(customFoo).toEqual('fd:3')
  expect(customBar).toEqual('fd:4')
  expect(fds.fds()).toEqual([bufferFoo, bufferBar])
})
