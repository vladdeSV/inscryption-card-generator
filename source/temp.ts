import { SingleResource } from './resource'

const act2ResourceMap = {
  'card': {
    'common': 'cards/common.png',
    'rare': 'cards/rare.png',
    'terrain': 'cards/terrain.png',
    'terrain_rare': 'cards/terrain_rare.png',
  },
  'cardback': {
    'common': 'cardbacks/common.png',
    'submerged': 'cardbacks/submerged.png',
  },
  'cost': {
    'blood_1': 'costs/blood1.png',
    'blood_2': 'costs/blood2.png',
    'blood_3': 'costs/blood3.png',
    'blood_4': 'costs/blood4.png',
    'bone_1': 'costs/bone1.png',
    'bone_2': 'costs/bone2.png',
    'bone_3': 'costs/bone3.png',
    'bone_4': 'costs/bone4.png',
    'bone_5': 'costs/bone5.png',
    'bone_6': 'costs/bone6.png',
    'bone_7': 'costs/bone7.png',
    'bone_8': 'costs/bone8.png',
    'bone_9': 'costs/bone9.png',
    'bone_10': 'costs/bone10.png',
    'bone_11': 'costs/bone11.png',
    'bone_12': 'costs/bone12.png',
    'bone_13': 'costs/bone13.png',
    'energy_1': 'costs/energy1.png',
    'energy_2': 'costs/energy2.png',
    'energy_3': 'costs/energy3.png',
    'energy_4': 'costs/energy4.png',
    'energy_5': 'costs/energy5.png',
    'energy_6': 'costs/energy6.png',
    'mox-b': 'costs/mox-b.png',
    'mox-bg': 'costs/mox-bg.png',
    'mox-g': 'costs/mox-g.png',
    'mox-go': 'costs/mox-go.png',
    'mox-o': 'costs/mox-o.png',
    'mox-ob': 'costs/mox-ob.png',
    'mox-ogb': 'costs/mox-ogb.png',
  },
  'portrait': {
    'ouroboros': 'portraits/ouroboros.png',
    'adder': 'portraits/adder.png',
    'skeleton': 'portraits/skeleton.png',
    'wolfcub': 'portraits/wolfcub.png',
    'elkcub': 'portraits/elkcub.png',

    'kraken': 'portraits/kraken.png',
    'squidcards': 'portraits/squidcards.png',
    'squidmirror': 'portraits/squidmirror.png',
    'squidbell': 'portraits/squidbell.png',
    'hrokkall': 'portraits/hrokkall.png',
    'mantisgod': 'portraits/mantisgod.png',
    'moleman': 'portraits/moleman.png',
    'urayuli': 'portraits/urayuli.png',
    'rabbit': 'portraits/rabbit.png',
    'squirrel': 'portraits/squirrel.png',
    'bullfrog': 'portraits/bullfrog.png',
    'cat': 'portraits/cat.png',
    'catundead': 'portraits/cat_undead.png',
    'mole': 'portraits/mole.png',
    'squirrelball': 'portraits/squirrelball.png',
    'stoat': 'portraits/stoat.png',
    'warren': 'portraits/warren.png',
    'wolf': 'portraits/wolf.png',
    'bloodhound': 'portraits/bloodhound.png',
    'elk': 'portraits/elk.png',
    'fieldmouse': 'portraits/fieldmice.png',
    'hawk': 'portraits/hawk.png',
    'raven': 'portraits/raven.png',
    'salmon': 'portraits/salmon.png',
    'fieldmouse_fused': 'portraits/fieldmice_fused.png',
    'grizzly': 'portraits/grizzly.png',

    'sarcophagus': 'portraits/sarcophagus.png',
    'banshee': 'portraits/banshee.png',

    'abovecurve': 'portraits/abovecurve.png',
    'automaton': 'portraits/automaton.png',
    'batterybot': 'portraits/batterybot.png',
    'bluemage': 'portraits/bluemage.png',
    'bluemage_fused': 'portraits/bluemage_fused.png',
    'bolthound': 'portraits/bolthound.png',
    'bombbot': 'portraits/bombbot.png',
    'bombmaiden': 'portraits/bombmaiden.png',
    'bonehound': 'portraits/bonehound.png',
    'bonelordhorn': 'portraits/bonelordhorn.png',
    'bonepile': 'portraits/bonepile.png',
    'burrowingtrap': 'portraits/burrowingtrap.png',
    'coinleft': 'portraits/coinleft.png',
    'coinright': 'portraits/coinright.png',
    'energyconduit': 'portraits/conduitenergy.png',
    'factoryconduit': 'portraits/conduitfactory.png',
    'healerconduit': 'portraits/conduithealer.png',
    'attackconduit': 'portraits/conduitpower.png',
    'coyote': 'portraits/coyote.png',
    'deadhand': 'portraits/deadhand.png',
    'deadpets': 'portraits/deadpets.png',
    'draugr': 'portraits/draugr.png',
    'drownedsoul': 'portraits/drownedsoul.png',
    'plasmagunner': 'portraits/energygunner.png',
    'energyroller': 'portraits/energyroller.png',
    'family': 'portraits/family.png',
    'fieldmice': 'portraits/fieldmice.png',
    'fieldmice_fused': 'portraits/fieldmice_fused.png',
    'flyingmage': 'portraits/flyingmage.png',
    'forcemage': 'portraits/forcemage.png',
    'franknstein': 'portraits/franknstein.png',
    'gemfiend': 'portraits/gemfiend.png',
    'techmoxtriple': 'portraits/gemmodule.png',
    'ghostship': 'portraits/ghostship.png',
    'gravedigger': 'portraits/gravedigger.png',
    'gravedigger_fused': 'portraits/gravedigger_fused.png',
    'greenmage': 'portraits/greenmage.png',
    'closerbot': 'portraits/gunnerbot.png',
    'headlesshorseman': 'portraits/headlesshorseman.png',
    'insectodrone': 'portraits/insectobot.png',
    'inspector': 'portraits/inspector.png',
    'juniorsage': 'portraits/juniorsage.png',
    'kingfisher': 'portraits/kingfisher.png',
    'leapbot': 'portraits/leapingbot.png',
    'mageknight': 'portraits/mageknight.png',
    'magpie': 'portraits/magpie.png',
    'marrowmage': 'portraits/marrowmage.png',
    'masterbleene': 'portraits/masterBG.png',
    'mastergoranj': 'portraits/masterGO.png',
    'masterorlu': 'portraits/masterOB.png',
    'meatbot': 'portraits/meatbot.png',
    'melter': 'portraits/melter.png',
    'minecart': 'portraits/minecart.png',
    'moxdualbg': 'portraits/moxBG.png',
    'moxdualgo': 'portraits/moxGO.png',
    'moxdualob': 'portraits/moxOB.png',
    'moxemerald': 'portraits/moxemerald.png',
    'moxruby': 'portraits/moxruby.png',
    'moxsapphire': 'portraits/moxsapphire.png',
    'moxtriple': 'portraits/moxtriple.png',
    'mummy': 'portraits/mummy.png',
    'musclemage': 'portraits/musclemage.png',
    'necromancer': 'portraits/necromancer.png',
    'nullconduit': 'portraits/nullconduit.png',
    'opossum': 'portraits/opossum.png',
    'orangemage': 'portraits/orangemage.png',
    'practicemage': 'portraits/practicemage.png',
    'pupil': 'portraits/pupil.png',
    'revenant': 'portraits/revenant.png',
    'robomice': 'portraits/robomice.png',
    'rubygolem': 'portraits/rubygolem.png',
    'sentrybot': 'portraits/sentrybot.png',
    'sentrybot_fused': 'portraits/sentrybot_fused.png',
    'shutterbug': 'portraits/shutterbug.png',
    'skeletonmage': 'portraits/skeletonmage.png',
    'sniper': 'portraits/sniper.png',
    'starvation': 'portraits/starvation.png',
    'steambot': 'portraits/steambot.png',
    'stimmage': 'portraits/stimmage.png',
    'thickbot': 'portraits/thickbot.png',
    'tombrobber': 'portraits/tombrobber.png',
    'zombie': 'portraits/zombie.png',
  },
  'font': {
    'default': 'fonts/Marksman.otf'
  },
  'sigil': {
    'missing': 'missing_sigil.png',
    'buffgems': 'sigils/buffgems.png',
    'deathtouch': 'sigils/deathtouch.png',
    'doubledeath': 'sigils/doubledeath.png',
    'drawcopy': 'sigils/drawcopy.png',
    'drawcopyondeath': 'sigils/drawcopyondeath.png',
    'drawnewhand': 'sigils/drawnewhand.png',
    'drawrabbits': 'sigils/drawrabbits.png',
    'evolve': 'sigils/evolve.png',
    'flying': 'sigils/flying.png',
    'guarddog': 'sigils/guarddog.png',
    'icecube': 'sigils/icecube.png',
    'loot': 'sigils/loot.png',
    'preventattack': 'sigils/preventattack.png',
    'quadruplebones': 'sigils/quadruplebones.png',
    'reach': 'sigils/reach.png',
    'sacrificial': 'sigils/sacrificial.png',
    'sentry': 'sigils/sentry.png',
    'sharp': 'sigils/sharp.png',
    'skeletonstrafe': 'sigils/skeletonstrafe.png',
    'splitstrike': 'sigils/splitstrike.png',
    'squirrelstrafe': 'sigils/squirrelstrafe.png',
    'steeltrap': 'sigils/steeltrap.png',
    'strafe': 'sigils/strafe.png',
    'strafepush': 'sigils/strafepush.png',
    'submerge': 'sigils/submerge.png',
    'submergesquid': 'sigils/submergesquid.png',
    'tripleblood': 'sigils/tripleblood.png',
    'tristrike': 'sigils/tristrike.png',
    'tutor': 'sigils/tutor.png',
    'whackamole': 'sigils/whackamole.png',
    'activateddealdamage': 'sigils/activated_dealdamage.png',
    'activatedrandompowerbone': 'sigils/activated_dicerollbone.png',
    'activatedrandompowerenergy': 'sigils/activated_dicerollenergy.png',
    'activateddrawskeleton': 'sigils/activated_drawskeleton.png',
    'activatedenergytobones': 'sigils/activated_energytobones.png',
    'activatedheal': 'sigils/activated_heal.png',
    'activatedsacrificedrawcards': 'sigils/activated_sacrificedraw.png',
    'activatedstatsup': 'sigils/activated_statsup.png',
    'activatedstatsupenergy': 'sigils/activated_statsupenergy.png',
    'bombspawner': 'sigils/bombspawner.png',
    'bonedigger': 'sigils/bonedigger.png',
    'brittle': 'sigils/brittle.png',
    'conduitbuffattack': 'sigils/conduitbuffattack.png',
    'conduitenergy': 'sigils/conduitenergy.png',
    'conduithealing': 'sigils/conduithealing.png',
    'conduitfactory': 'sigils/conduitspawner.png',
    'droprubyondeath': 'sigils/droprubyondeath.png',
    'explodeondeath': 'sigils/explodeondeath.png',
    'gainbattery': 'sigils/gainbattery.png',
    'gaingemtriple': 'sigils/gaingem_all.png',
    'gaingemblue': 'sigils/gaingem_blue.png',
    'gaingemgreen': 'sigils/gaingem_green.png',
    'gaingemorange': 'sigils/gaingem_orange.png',
    'gemdependant': 'sigils/gemdependant.png',
    'gemsdraw': 'sigils/gemsdraw.png',
  },
  'frame': {
    'nature': 'frames/nature.png',
    'tech': 'frames/tech.png',
    'undead': 'frames/undead.png',
    'wizard': 'frames/wizard.png',
  },
  'misc': {
    'stitches': 'misc/stitches.png',
    'ability_button': 'misc/activated_ability_button.png',
    'conduit': 'misc/conduit.png',
  },
  'staticon': {
    'ants': 'staticons/ants.png',
    'bell': 'staticons/bell.png',
    'cardsinhand': 'staticons/cardsinhand.png',
    'greengems': 'staticons/greengems.png',
    'mirror': 'staticons/mirror.png',
  },
  'npc': {
    'angler': 'npcs/angler.png',
    'bluewizard': 'npcs/bluewizard.png',
    'briar': 'npcs/briar.png',
    'dredger': 'npcs/dredger.png',
    'dummy': 'npcs/dummy.png',
    'greenwizard': 'npcs/greenwizard.png',
    'inspector': 'npcs/inspector.png',
    'orangewizard': 'npcs/orangewizard.png',
    'prospector': 'npcs/prospector.png',
    'royal': 'npcs/royal.png',
    'sawyer': 'npcs/sawyer.png',
    'melter': 'npcs/smelter.png',
    'trapper': 'npcs/trapper.png',
  }
}

export const res2 = new SingleResource('resource-gbc', act2ResourceMap)
