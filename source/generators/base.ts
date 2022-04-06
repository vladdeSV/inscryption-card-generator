import { spawn } from 'child_process'
import { Card } from '../card'
import { ImageMagickCommandBuilder } from '../im/commandBuilder'
import { Resource } from '../resource'

export { CardGenerator, BaseCardGenerator, bufferFromCommandBuilder }

interface CardGenerator {
  generateFront: (card: Card) => Promise<Buffer>
  generateBack: () => Promise<Buffer>
}

abstract class BaseCardGenerator<R extends { [s: string]: { [s: string]: string } }, T extends Record<string, any>> implements CardGenerator {

  constructor(resources: Resource<R>, options: T) {
    this.resource = resources
    this.options = options
  }

  abstract generateFront(card: Card): Promise<Buffer>
  abstract generateBack(): Promise<Buffer>

  protected resource: Resource<R>
  protected options: T
}

function bufferFromCommandBuilder(im: ImageMagickCommandBuilder, input?: Buffer): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const process = spawn('magick', [...im.parts(), '-'], { stdio: 'pipe' })
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
