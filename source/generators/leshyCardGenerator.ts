import { execSync } from "child_process";
import { Card, CardType } from "../act1/types";
import { IM } from "../im";
import { CardGenerator } from "./cardGenerator";

class LeshyCardGenerator implements CardGenerator {

  generate(card: Card, locale: string | undefined = undefined): Buffer {
    const im = new IM(`./resource/cards/${card.type}.png`);

    im.font('./resource/HEAVYWEIGHT.otf')
      .pointsize(200)

    const isTerrain = card.options?.isTerrain ?? false
    const portrait = card.portrait;
    if (portrait) {
      im.resource(portrait === 'custom' ? '-' : `./resource/portraits/${portrait}.png`)
        .gravity('center')
        .geometry(1, -15)
        .composite()
    }

    if (card.options?.hasBorder) {
      const borderName = ((a: CardType): 'common' | 'terrain' | 'rare' => a === 'nostat' ? 'common' : a)(card.type)
      im.resource(`./resource/cards/borders/${borderName}.png`)
        .composite()
    }

    im.command('-filter Box')
      .resize(undefined, 1050) // 1050 pixels @ 300dpi = 3.5 inches
      .gravity('northwest')

    const tribes = card.tribes
    if (tribes) {
      const aligns: [number, number][] = [[-12, 3], [217, 5], [444, 7], [89, 451], [344, 452]]

      for (const [index, tribe] of tribes.entries()) {
        const tribeLocation = `./resource/tribes/${tribe}.png`
        const position = aligns[index]

        im.parens(
          new IM(tribeLocation)
            .resize(undefined, 354)
            .gravity('northwest')
            .alpha('set')
            .background('none')
            .command('-channel A -evaluate multiply 0.4 +channel')
        ).geometry(position[0], position[1])
          .composite()
      }
    }

    const cost = card.cost
    if (cost) {
      const { amount, type } = cost;

      const costPath = `./resource/costs/${amount}${type}.png`
      im.parens(
        new IM(costPath)
          .interpolate('nearest')
          .filter('point')
          .resize(284)
          .filter('box')
          .gravity('east')
      ).gravity('northeast')
        .geometry(32, 110)
        .composite()
        .gravity('northwest')
    }

    const power = card.power
    if (power !== undefined) {
      if (typeof power === 'number') {
        // don't show power if power === 0 and card is a terrain card
        if (power > 0 || !card.options?.isTerrain) {
          const w = 114
          const h = 215

          im.parens(
            new IM()
              .pointsize()
              .size(w, h)
              .background('none')
              .label(power)
              .gravity('east')
              .extent(w, h)
          ).gravity('northwest')
            .geometry(68, 729)
            .composite()
        }
      } else {
        const statIconPath = `./resource/staticon/${power}.png`
        im.parens(
          new IM(statIconPath)
            .interpolate('nearest')
            .filter('point')
            .resize(245)
            .filter('box')
            .gravity('northwest')
        ).geometry(5, 705)
          .composite()
      }
    }

    const xoffset = isTerrain ? -70 : 0

    const health = card.health
    if (health !== undefined) {
      const w = 114
      const h = 215
      im.parens(
        new IM()
          .pointsize()
          .size(w, h)
          .background('none')
          .label(health)
          .gravity('east')
          .extent(w, h)
      ).gravity('northeast')
        .geometry(32 - xoffset, 815)
        .composite()
    }

    // // todo: refactor this behemoth
    const sigils = card.sigils
    if (sigils && sigils.length) {
      const sigilCount = sigils.length

      if (sigilCount === 1) {
        const sigilPath = `./resource/sigils/${sigils[0]}.png`
        im.parens(
          new IM(sigilPath)
            .interpolate('nearest')
            .filter('point')
            .resize(undefined, 253)
            .filter('box')
        ).gravity('northwest')
          .geometry(221 + xoffset, 733)
          .composite()
      } else if (sigilCount === 2) {
        const sigilPath1 = `./resource/sigils/${sigils[0]}.png`
        const sigilPath2 = `./resource/sigils/${sigils[1]}.png`
        im.parens(new IM(sigilPath1)
          .filter('box')
          .resize(undefined, 180)
        ).gravity('northwest')
          .geometry(331 + xoffset, 720)
          .composite()

        im.parens(new IM(sigilPath2)
          .filter('box')
          .resize(undefined, 180)
        ).gravity('northwest')
          .geometry(180 + xoffset, 833)
          .composite()
      } else {

        throw new Error('Multiple sigils not supported (more than 2 sigils)')

        // for (const [index, sigil] of sigils.entries()) {
        //   const sigilPath = `./resource/sigils/${sigil}.png`
        //   const rotateAmount = 2 * Math.PI / sigilCount
        //   const baseRotation = Math.PI / 6
        //   const dist = 80
        //   const scale = (sigilCount >= 5) ? 200 : 270
        //   const x = xoffset + dist * Math.cos(baseRotation + rotateAmount * index)
        //   const y = 330 - dist * Math.sin(baseRotation + rotateAmount * index) - (sigilCount === 3 ? 15 : 0)

        //   im(`\\( "${sigilPath}" -resize ${scale}% -filter box -gravity center -geometry +${x}+${y} \\) -composite`)
        // }
      }
    }

    if (card.options?.isSquid) {
      const squidTitlePath = `./resource/misc/squid_title.png`
      im.parens(new IM(squidTitlePath).interpolate('nearest').filter('point').resize(undefined, 152).filter('box').gravity('north').geometry(0, 20)).composite()
    } else if (card.name) {

      const escapedName = card.name.replace(/[\\']/g, '')

      // default for english
      let size = { w: 570, h: 135 }
      let position = { x: 0, y: 28 }

      if (locale === 'ko') {
        im.font('./resource/Stylish-Regular.ttf')
        position = { x: 4, y: 34 }
      }

      if (locale === 'jp') {
        size = { w: 570, h: 166 }
        position = { x: 0, y: 16 }
        im.font('./resource/ShipporiMincho-ExtraBold.ttf')
      }

      if (locale === 'zh-cn') {
        size = { w: 570, h: 166 }
        position = { x: 0, y: 16 }
        im.font('./resource/NotoSerifSC-Bold.otf')
      }

      if (locale === 'zh-tw') {
        size = { w: 570, h: 166 }
        position = { x: 0, y: 16 }
        im.font('./resource/NotoSerifTC-Bold.otf')
      }

      im.parens(
        new IM()
          .pointsize()
          .size(size.w, size.h)
          .background('none')
          .label(escapedName)
          .trim()
          .gravity('center')
          .extent(size.w, size.h)
          .resizeExt(r => r.scale(106, 100, '!'))
      ).gravity('north')
        .geometry(position.x, position.y)
        .composite()
        .font('./resource/HEAVYWEIGHT.otf')
    }

    if (card.options?.isGolden) {
      im.parens(
        new IM().command('-clone 0 -fill rgb\\(255,128,0\\) -colorize 75')
      ).geometry(0, 0)
        .compose('hardlight')
        .composite()

      // use emission for default portraits
      if (card.portrait && card.portrait !== 'custom') {
        const scale = 1050 / 190
        im.parens(
          new IM(`./resource/portraits/emissions/${card.portrait}.png`)
            .filter('box')
            .command(`-resize ${scale * 100}%`)
            .gravity('center')
            .geometry(0, 15 * scale)
        ).compose('overlay')
          .composite()
      }
    }

    const decals = card.decals
    if (decals) {
      for (const decal of decals) {
        const decalPath = `./resource/decals/${decal}.png`
        im.parens(
          new IM(decalPath)
            .filter('box')
            .resize(undefined, 1050)
        ).composite()
      }
    }

    if (card.options?.isEnhanced && card.portrait !== 'custom') {
      const scale = 1050 / 190
      im.parens(new IM(`./resource/portraits/emissions/${card.portrait}.png`).command(`-fill rgb\\(161,247,186\\) -colorize 100 -resize ${scale * 100}%`).gravity('center').geometry(-2, -15 * scale)).composite()
      im.parens(new IM(`./resource/portraits/emissions/${card.portrait}.png`).command(`-fill rgb\\(161,247,186\\) -colorize 100 -resize ${scale * 100}%`).gravity('center').geometry(-2, -15 * scale).command('-blur 0x10')).composite()
    }

    let customPortraitData = undefined
    if (card.portrait === 'custom' && card.options?.portraitData) {
      customPortraitData = Buffer.from(card.options.portraitData, 'base64')
    }

    const buffer = execSync(im.build('convert', '-'), { input: customPortraitData })

    return buffer
  }

  generateBack(type: 'common' | 'squirrel' | 'bee' | 'deathcard' = 'common'): Buffer {
    const im = new IM(`./resource/cards/backs/${type}.png`)

    if (true) {
      const type = 'common'
      const borderName = ((a: CardType): 'common' | 'terrain' | 'rare' => a === 'nostat' ? 'common' : a)(type)
      im.resource(`./resource/cards/backs/borders/${borderName}.png`).composite()
    }

    im.filter('box').resize(undefined, 1050)

    return execSync(im.build('convert', '-'))
  }
}

export { LeshyCardGenerator }
