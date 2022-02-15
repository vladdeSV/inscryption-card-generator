import { ImageMagickCommandBuilder } from './imageMagickCommandBuilder'

export { ImageMagickCommandBuilder as IM }
export default (resource?: string): ImageMagickCommandBuilder => new ImageMagickCommandBuilder(resource)
