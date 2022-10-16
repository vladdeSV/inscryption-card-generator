import { spawn } from 'child_process'
import { Writable } from 'stream'
import { Card } from '../card'
import { ImageMagickCommandBuilder } from '../im/commandBuilder'
import { Fds } from '../im/fds'
import { Resource } from '../resource'

export { CardGenerator, BaseCardGenerator, bufferFromCommandBuilder, bufferFromCommandBuilderFds }

interface CardGenerator {
  generateFront: (card: Card) => Promise<Buffer>
  generateBack: () => Promise<Buffer>
}

abstract class BaseCardGenerator<T extends Record<string, unknown>> implements CardGenerator {
  constructor(resources: Resource, options: T) {
    this.resource = resources
    this.options = options
  }

  abstract generateFront(card: Card): Promise<Buffer>
  abstract generateBack(): Promise<Buffer>

  protected resource: Resource
  protected options: T
}

function bufferFromCommandBuilder(im: ImageMagickCommandBuilder, input?: Buffer, filetype = 'PNG'): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const process = spawn('convert', [...im.parts(), filetype ? `${filetype}:-` : '-'], { stdio: 'pipe' })
    console.log('spawned a process', process.pid)

    const buffers: Buffer[] = []
    process.stdout.on('data', (data: Buffer) => {
      buffers.push(data)
    })
    process.stdout.on('end', () => {
      const buffer = Buffer.concat(buffers)
      console.log('ended a process', process.pid)
      resolve(buffer)
    })
    process.stderr.on('data', (data: Buffer) => {
      reject(data.toString())
    })
    process.stdin.end(input)
  })
}

function bufferFromCommandBuilderFds(im: ImageMagickCommandBuilder, fds: Fds): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const process = spawn('convert', [...im.parts(), '-'], { stdio: ['pipe', 'pipe', 'pipe', ...(new Array(fds.fds().length).fill('pipe'))] })
    console.log('spawned a process', process.pid)

    const buffers: Buffer[] = []
    process.stdout.on('data', (data: Buffer) => {
      buffers.push(data)
    })
    process.stdout.on('end', () => {
      const buffer = Buffer.concat(buffers)
      console.log('ended a process', process.pid)
      resolve(buffer)
    })
    process.stderr.on('data', (data: Buffer) => {
      reject(data.toString())
    })

    for (const [index, fd] of fds.fds().entries()) {
      const a = process.stdio[index + 3]
      if (!(a instanceof Writable)) {
        console.error('not a writable stream', a)
        continue
      }
      a.end(fd)
    }
    process.stdin.end()
  })
}
