import { execSync } from "child_process";
import { Card } from "../act1/types";
import { PixelProfilgateCard } from "../pixelprofilgatecards";
import { CardGenerator } from "./cardGenerator";

type SigilEntry = {
  name: string,
  text: string,
  sigilId: string,
}

class PixelProfilgateGenerator implements CardGenerator {
  generate(card: PixelProfilgateCard): Buffer {
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
      entries.push({ name: 'Colony', text: "This card\\'s power is equal to the number of cards with this sigil on your side of the field.", sigilId: 'colony' })
    }

    entries.push(...(card.sigils ?? []).map(x => this.sigils[x]))
    for (const [index, entry] of entries.entries()) {
      const yoffset = 135
      im(`-pointsize 50 -draw "text 184,${703 + yoffset * index} '${entry.name}'"`)
      im(`./resource-pixelprofilgate/sigils/${entry.sigilId}.png -geometry ${geometryPosition(56, 691 + yoffset * index)} -composite`)
      if (entry.text) {

        let text = entry.text

        if (entry.sigilId.startsWith('evolve')) {
          text = text.replace(/\{evolve_card\}/, card.extra?.evolvesInto ?? 'N/A')
        }

        if (entry.sigilId === 'icecube') {
          text = text.replace(/\{thaws_card\}/, card.extra?.thawsInto ?? 'N/A')
        }

        im(`-pointsize 26 -background none -size 490x caption:"${text.replace(/"/g, '\\"')}" -geometry ${geometryPosition(184, 759 + yoffset * index)} -composite`)
      }
    }

    im('-')

    const command = commands.join(' ')
    // console.log('COMMAND:', command);

    return execSync(command)
  }

  generateBack(): Buffer {
    return execSync(`convert ./resource-pixelprofilgate/cards/back.png -filter Box -resize x1050 -`)
  }

  private sigils: { [s: string]: SigilEntry } = {
    'allstrike': { name: 'Moon Strike', text: 'This card attacks all opposing lanes when it attacks.', sigilId: 'allstrike' },
    'beesonhit': { name: 'Bees Within', text: 'When this card is damaged, search 1 "Bee" from your deck to your hand.', sigilId: 'beesonhit' },
    'buffneighbours': { name: 'Leader', text: 'While this card is on the field, it increases the power of the cards left and right of it by 1.', sigilId: 'buffneighbours' },
    'corpseeater': { name: 'Corpse Eater', text: 'When a card on your side of the field perishes, this card is played in its place.', sigilId: 'corpseeater' },
    'createbells': { name: 'Bellist', text: 'n/a', sigilId: 'createbells' },
    'createdams': { name: 'Dam Builder', text: 'n/a', sigilId: 'createdams' },
    'deathtouch': { name: 'Touch of Death', text: 'When this card damages an opposing card, that card perishes.', sigilId: 'deathtouch' },
    'debuffenemy': { name: 'Stinky', text: 'While this card is on the field, the opposing card has their power reduced by 1.', sigilId: 'debuffenemy' },
    'drawant': { name: 'Ant Spawner', text: 'When this card is played, search 1 "Worker Ant" from your deck to your hand.', sigilId: 'drawant' },
    'drawcopy': { name: 'Fecundity', text: 'When this card is played, search 1 copy of it from your deck to your hand.', sigilId: 'drawcopy' },
    'drawcopyondeath': { name: 'Unkillable', text: 'When this card perishes, it goes back to your hand instead of being discarded.', sigilId: 'drawcopyondeath' },
    'drawrabbits': { name: 'Rabbit Hole', text: 'When this card is played, search 1 "Rabbit" card from your deck to your hand.', sigilId: 'drawrabbits' },
    'drawrandomcardondeath': { name: 'Gift Bearer', text: 'When this card perishes, draw 1 card from your deck.', sigilId: 'drawrandomcardondeath' },
    'evolve_1': { name: 'Fledgling', text: 'During your next draw step after this card is played, it ages into a "{evolve_card}".', sigilId: 'evolve_1' },
    'flying': { name: 'Airborne', text: 'This card attacks the opponent directly instead of the opposing card.', sigilId: 'flying' },
    'guarddog': { name: 'Guardian', text: 'When an opposing card is played opposite of an empty space, this card moves to that space.', sigilId: 'guarddog' },
    'icecube': { name: 'Frozen Away', text: `When this card perishes, search a "{thaws_card}" and play it on this card's space. This card cannot be sacrificed. `, sigilId: 'icecube' },
    'preventattack': { name: 'Repulsive', text: 'When an opposing card would damage this card, it does not.', sigilId: 'preventattack' },
    'quadruplebones': { name: 'Bone King', text: 'When this card perishes, it provides 4 Bones instead of 1.', sigilId: 'quadruplebones' },
    'randomability': { name: 'Amorphous', text: 'n/a', sigilId: 'randomability' },
    'randomconsumable': { name: 'Trinket Bearer', text: 'When this card is played, draw 1 card from your deck or side deck.', sigilId: 'randomconsumable' },
    'reach': { name: 'Mighty Leap', text: 'If the opposing card has the Airborne sigil, it attacks this card instead of attacking directly.', sigilId: 'reach' },
    'sacrificial': { name: 'Many Lives', text: 'When this card is sacrificed, it does not perish.', sigilId: 'sacrificial' },
    'sharp': { name: 'Sharp Quills', text: `When an opposing card damages this card's health, that card is dealt 1 damage.`, sigilId: 'sharp' },
    'splitstrike': { name: 'Bifurcated Strike', text: 'This card attacks only the lanes left and right of the opposing space when it attacks.', sigilId: 'splitstrike' },
    'squirrelorbit': { name: 'Tidal Lock', text: 'n/a', sigilId: 'squirrelorbit' },
    'steeltrap': { name: 'Steel Trap', text: 'When this card perishes, the opposing card also perishes.', sigilId: 'steeltrap' },
    'strafe': { name: 'Sprinter', text: 'During your end step, this card shifts to an adjacent empty lane.', sigilId: 'strafe' },
    'strafepush': { name: 'Hefty', text: 'During your end step, this card shifts to an adjacent lane, pushing cards in the way with it.', sigilId: 'strafepush' },
    'submerge': { name: 'Waterborne', text: 'Attacks targeting this card instead hit the owner of this card directly.', sigilId: 'submerge' },
    'tailonhit': { name: 'Loose Tail', text: 'n/a', sigilId: 'tailonhit' },
    'tripleblood': { name: 'Worthy Sacrifice', text: `This card is worth 3 Blood when it's sacrificed.`, sigilId: 'tripleblood' },
    'tristrike': { name: 'Trifurcated Strike', text: 'This card attacks the lanes left and right, as well as the opposing space when it attacks.', sigilId: 'tristrike' },
    'tutor': { name: 'Hoarder', text: 'When this card is played, search any 1 card from your deck to your hand.', sigilId: 'tutor' },
    'whackamole': { name: 'Burrower', text: 'If an opposing card would attack an empty lane, this card moves to that lane to be hit instead.', sigilId: 'whackamole' },
    'gainbattery': { name: 'Battery Bearer', text: 'When this card is played, it provides 1 energy cell to its owner.', sigilId: 'gainbattery' },
    'squirrelstrafe': { name: 'Squirrel Shedder', text: `During your end step, this card shifts to an adjacent empty lane, playing a "Squirrel" card in this card's previous lane.`, sigilId: 'squirrelstrafe' },
    'bonedigger': { name: 'Bone Digger', text: 'During your end step, this card generates 1 Bone.', sigilId: 'bonedigger' },
    'brittle': { name: 'Brittle', text: 'After this card attacks, this card perishes.', sigilId: 'brittle' },

    'evolve': { name: 'Fledgling', text: '', sigilId: 'evolve' },
    'evolve_2': { name: 'Fledgling', text: '', sigilId: 'evolve_2' },
    'evolve_3': { name: 'Fledgling', text: '', sigilId: 'evolve_3' },
  }
}

export { PixelProfilgateGenerator }
