import { execSync } from "child_process";
import { Card } from "../act1/types";
import { CardGenerator } from "./cardGenerator";

type SigilEntry = {
  name: string,
  text: string,
  sigilId: string,
}

class PixelProfilgateGenerator implements CardGenerator {
  generate(card: Card): Buffer {
    const commands: string[] = []
    const im = (cmd: string) => commands.push(cmd);

    const geometryPosition = (x: number, y: number): string => {
      const firstSign = x > 0 ? '+' : '-'
      const secondSign = y > 0 ? '+' : '-'
      return `${firstSign}${Math.abs(x)}${secondSign}${Math.abs(y)}`
    }

    im(`convert ./resource-pixelprofilgate/cards/${card.type}.png`)
    im(`-font ./resource/HEAVYWEIGHT.otf -pointsize 80`)

    // todo portrait
    const portrait = card.portrait
    if (portrait) {
      if (portrait !== 'custom') {
        im('-gravity center')
        const colorize = card.type === 'terrain' ? '-colorspace gray -fill "#d4c9ab" -tint 100' : ''
        im(`\\( ${colorize} ./resource-pixelprofilgate/portraits/${portrait}.png \\) -geometry +0-19 -composite`)
        im('-gravity northwest -fill black')
      }
    }

    const cost = card.cost
    if (cost) {
      im(`./resource-pixelprofilgate/costs/${cost.amount}${cost.type}.png -geometry +61+75 -composite`)
    }

    im('-filter Box -resize x1050') // make big
    im('-gravity northwest')

    const health = card.health
    if (typeof health === 'number') {
      im(`-draw "text 605,124 '${card.health}'"`)
    }

    const power = card.power
    if (typeof power === 'number') {
      im(`-draw "text 106,607 '${card.power}'"`)
    }

    const name = card.name
    if (typeof name === 'string') {
      im(`-gravity north -draw "text 0,66 '${card.name}'"`)
    }

    if (typeof card.extra?.talkText === 'string') {
      const talkText = card.extra.talkText.replace(/\\'"/g, '\\\\').replace(/'/g, '\\\'').replace(/"/g, '\\"');
      im(`-pointsize 32 -fill rgb\\(128,78,48\\) -draw "text 66,658 '${talkText}'"`)
    }

    im(`-gravity northwest -fill black`)

    const entries: SigilEntry[] = []

    if (card.power === 'ants') {
      entries.push({ name: 'Colony', text: "This card\\'s power is equal to the number of cards with the \\'colony\\' sigil on your side of the field.", sigilId: 'colony' })
    }

    entries.push(...(card.sigils ?? []).map(x => this.sigils[x]))
    for (const [index, entry] of entries.entries()) {
      const yoffset = 135
      im(`-pointsize 50 -draw "text 184,${703 + yoffset * index} '${entry.name}'"`)
      im(`./resource-pixelprofilgate/sigils/${entry.sigilId}.png -geometry ${geometryPosition(56, 691 + yoffset * index)} -composite`)
      if (entry.text) {
        im(`-pointsize 26 -background none -size 496x caption:"${entry.text}" -geometry ${geometryPosition(184, 759 + yoffset * index)} -composite`)
      }
    }

    im('-')

    const command = commands.join(' ')
    console.log('COMMAND:', command);

    return execSync(command)
  }

  generateBack(): Buffer {
    return execSync(`convert ./resource-pixelprofilgate/cards/back.png -filter Box -resize x1050 -`)
  }

  private sigils: { [s: string]: SigilEntry } = {
    'allstrike': { name: 'Moon Strike', text: '', sigilId: 'allstrike' },
    'beesonhit': { name: 'Bees Within', text: '', sigilId: 'beesonhit' },
    'buffneighbours': { name: 'Leader', text: '', sigilId: 'buffneighbours' },
    'corpseeater': { name: 'Corpse Eater', text: 'When a card on your side of the field perishes, this card is played in its place.', sigilId: 'corpseeater' },
    'createbells': { name: 'Bellist', text: '', sigilId: 'createbells' },
    'createdams': { name: 'Dam Builder', text: '', sigilId: 'createdams' },
    'deathtouch': { name: 'Touch of Death', text: 'When this card damages the health of an opposing card, that card perishes.', sigilId: 'deathtouch' },
    'debuffenemy': { name: 'Stinky', text: 'Cards opposing this card have their power reduced by one.', sigilId: 'debuffenemy' },
    'drawant': { name: 'Ant Spawner', text: '', sigilId: 'drawant' },
    'drawcopy': { name: 'Fecundity', text: '', sigilId: 'drawcopy' },
    'drawcopyondeath': { name: 'Unkillable', text: '', sigilId: 'drawcopyondeath' },
    'drawrabbits': { name: 'Rabbit Hole', text: '', sigilId: 'drawrabbits' },
    'drawrandomcardondeath': { name: 'Gift Bearer', text: '', sigilId: 'drawrandomcardondeath' },
    'evolve': { name: 'Fledgling', text: '', sigilId: 'evolve' },
    'evolve_1': { name: 'Fledgling', text: '', sigilId: 'evolve_1' },
    'evolve_2': { name: 'Fledgling', text: '', sigilId: 'evolve_2' },
    'evolve_3': { name: 'Fledgling', text: '', sigilId: 'evolve_3' },
    'flying': { name: 'Airborne', text: 'This card attacks the opponent directly.', sigilId: 'flying' },
    'guarddog': { name: 'Guardian', text: '', sigilId: 'guarddog' },
    'icecube': { name: 'Frozen Away', text: '', sigilId: 'icecube' },
    'preventattack': { name: 'Repulsive', text: '', sigilId: 'preventattack' },
    'quadruplebones': { name: 'Bone King', text: '', sigilId: 'quadruplebones' },
    'randomability': { name: 'Amorphous', text: '', sigilId: 'randomability' },
    'randomconsumable': { name: 'Trinket Bearer', text: '', sigilId: 'randomconsumable' },
    'reach': { name: 'Mighty Leap', text: '', sigilId: 'reach' },
    'sacrificial': { name: 'Many Lives', text: 'When this card is sacrificed, it does not perish', sigilId: 'sacrificial' },
    'sharp': { name: 'Sharp Quills', text: '', sigilId: 'sharp' },
    'splitstrike': { name: 'Bifurcated Strike', text: 'This card attacks two time a turn, targeting the spaces left and right of the opposing space.', sigilId: 'splitstrike' },
    'squirrelorbit': { name: 'Tidal Lock', text: '', sigilId: 'squirrelorbit' },
    'steeltrap': { name: 'Steel Trap', text: '', sigilId: 'steeltrap' },
    'strafe': { name: 'Sprinter', text: '', sigilId: 'strafe' },
    'strafepush': { name: 'Hefty', text: '', sigilId: 'strafepush' },
    'submerge': { name: 'Waterborne', text: 'Attacks targeting this card instead hit the owner of this card directly.', sigilId: 'submerge' },
    'tailonhit': { name: 'Loose Tail', text: '', sigilId: 'tailonhit' },
    'tripleblood': { name: 'Worthy Sacrifice', text: '', sigilId: 'tripleblood' },
    'tristrike': { name: 'Trifurcated Strike', text: '', sigilId: 'tristrike' },
    'tutor': { name: 'Hoarder', text: '', sigilId: 'tutor' },
    'whackamole': { name: 'Burrower', text: '', sigilId: 'whackamole' },

    'gainbattery': { name: 'Battery Bearer', text: 'When this card is played, it provides 1 energy cell to its owner.', sigilId: 'gainbattery' },
    'squirrelstrafe': { name: 'Squirrel Shedder', text: '', sigilId: 'squirrelstrafe' },
    'bonedigger': { name: 'Bone Digger', text: '', sigilId: 'bonedigger' },
    'brittle': { name: 'Brittle', text: '', sigilId: 'brittle' },
  }
}

export { PixelProfilgateGenerator }
