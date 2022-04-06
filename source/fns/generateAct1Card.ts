export { /* , generateAct1BackCard, generateAct1BoonCard, generateAct1RewardCard, generateAct1TrialCard, generateAct1TarotCard */ }

import { Resource } from '../resource'
import IM from '../im'
import { Card } from '../card'
import { spawn } from 'child_process'
import { getGemCostResourceId } from './helpers'
import { Act1Resource } from '../temp'

// function generateAct1BackCard(type: 'bee' | 'common' | 'deathcard' | 'squirrel' | 'submerge', res: Resource<Act1Resource>, options: { border?: boolean } = {}): Buffer {
//   const im = IM()
//   im.resource(res.get('cardback', type))
//     .background('None')
//     .gravity('Center')
//     .filter('Box')

//   if (options.border) {
//     const backgroundName = type === 'common' ? 'special' : 'common'

//     im.extent(147, 212)
//       .resource(res.get('cardbackground', backgroundName))
//       .compose('DstOver')
//       .composite()
//       .compose('SrcOver')
//   }

//   im.resizeExt(g => g.scale(scale * 100))

//   return execSync(im.build('convert', '-'))
// }
//
// function generateAct1BoonCard(boon: 'doubledraw' | 'singlestartingbone' | 'startingbones' | 'startinggoat' | 'startingtrees' | 'tutordraw', res: Resource<Act1Resource>, options: { border?: boolean } = {}): Buffer {
//   const im = IM()
//   im.resource(res.get('cardboon', boon))
//     .background('None')
//     .gravity('Center')
//     .filter('Box')

//   if (options.border) {
//     im.extent(147, 212)
//       .resource(res.get('cardbackground', 'common'))
//       .compose('DstOver')
//       .composite()
//       .compose('SrcOver')
//   }

//   im.resizeExt(g => g.scale(scale * 100))

//   im.parens(IM(res.get('boon', boon)).resize(284))
//     .composite()

//   return execSync(im.build('convert', '-'))
// }

// function generateAct1RewardCard(type: '1blood' | '2blood' | '3blood' | 'bones' | 'bird' | 'canine' | 'hooved' | 'insect' | 'reptile', res: Resource<Act1Resource>, options: { border?: boolean } = {}): Buffer {
//   const im = IM()
//   im.resource(res.get('cardreward', type))
//     .background('None')
//     .gravity('Center')
//     .filter('Box')

//   if (options.border) {
//     im.extent(147, 212)
//       .resource(res.get('cardbackground', 'common'))
//       .compose('DstOver')
//       .composite()
//       .compose('SrcOver')
//   }

//   im.resizeExt(g => g.scale(scale * 100))

//   return execSync(im.build('convert', '-'))
// }

// function generateAct1TrialCard(type: 'abilities' | 'blood' | 'bones' | 'flying' | 'pelts' | 'power' | 'rare' | 'ring' | 'strafe' | 'submerge' | 'toughness' | 'tribes', res: Resource<Act1Resource>, options: { border?: boolean } = {}): Buffer {
//   const im = IM()
//   im.resource(res.get('cardtrial', type))
//     .background('None')
//     .gravity('Center')
//     .filter('Box')

//   if (options.border) {
//     im.extent(147, 212)
//       .resource(res.get('cardbackground', 'common'))
//       .compose('DstOver')
//       .composite()
//       .compose('SrcOver')
//   }

//   im.resizeExt(g => g.scale(scale * 100))

//   return execSync(im.build('convert', '-'))
// }

// function generateAct1TarotCard(type: 'death' | 'devil' | 'empress' | 'fool' | 'tower', res: Resource<Act1Resource>, options: { border?: boolean } = {}): Buffer {
//   const im = IM()
//   im.resource(res.get('cardtarot', type))
//     .background('None')
//     .gravity('Center')
//     .filter('Box')

//   if (options.border) {
//     im.extent(147, 212)
//       .resource(res.get('cardbackground', 'common'))
//       .compose('DstOver')
//       .composite()
//       .compose('SrcOver')
//   }

//   im.resizeExt(g => g.scale(scale * 100))

//   return execSync(im.build('convert', '-'))
// }
