import { Card } from '../card'
import { ImageMagickCommandBuilder } from '../im/commandBuilder'
import { Act1Resource } from '../temp'
import { BaseCardGenerator } from './base'
import IM from '../im'
import { getGemCostResourceId } from '../fns/helpers'

const originalCardHeight = 56 // px, size: 42x56
const fullsizeCardHeight = 1050 // px
const scale = fullsizeCardHeight / originalCardHeight

class GbcCardGenerator extends BaseCardGenerator<any, { border?: boolean, scanlines?: boolean }> {
  generateFront(card: Card): Promise<Buffer> {
    throw new Error('Method not implemented.')
  }

  generateBack(): Promise<Buffer> {
    throw new Error('Method not implemented.')
  }
}
