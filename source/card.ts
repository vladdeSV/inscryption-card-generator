export { Card, Sigil }

interface Card {
  gameId?: string,
  name: string,
  type: 'common' | 'rare' | 'terrain'
  portrait?: Portrait,
  cost?: Cost
  power: number,
  health: number,
  sigils: Sigil[],
  tribes: ('reptile' | 'canine' | 'bird' | 'hooved' | 'insect')[],
  statIcon?: 'ants' | 'bones' | 'bell' | 'cardsinhand' | 'mirror' | 'greengems',
  decals: ('snelk' | 'child' | 'leshy' | 'smoke' | 'combined' | 'blood')[],
  temple: 'nature' | 'tech' | 'undead' | 'wizard',
  flags: {
    golden: boolean,
    terrain: boolean,
    squid: boolean,
    enhanced: boolean,
    fused: boolean,
  }
  meta: {
    rare: boolean,
    terrain: boolean,
  }
}

type Portrait = CreaturePortrait | DeathcardPortrait | CustomPortrait
type CreaturePortrait = {
  type: 'creature',
  id: CreatureId
}
type DeathcardPortrait = {
  type: 'deathcard',
  data: {
    headType: 'chief' | 'enchantress' | 'gravedigger' | 'prospector' | 'robot' | 'settlerman' | 'settlerwoman' | 'wildling',
    mouthIndex: number, // 0 - 5
    eyesIndex: number, // 0 - 5
    lostEye: boolean,
  }
}
type CustomPortrait = {
  type: 'custom',
  data: Buffer,
}

type Cost = BloodCost | BoneCost | EnergyCost | GemCost
type BloodCost = {
  type: 'blood',
  amount: number
}
type BoneCost = {
  type: 'bone',
  amount: number
}
type EnergyCost = {
  type: 'energy',
  amount: number
}
type GemCost = {
  type: 'gem',
  gems: ('blue' | 'green' | 'orange')[]
}

type Sigil = 'deathtouch' | 'buffneighbours' | 'randomability' | 'ant' | 'drawant' | 'flying' | 'createdams' | 'beesonhit' | 'guarddog' | 'reach' | 'whackamole' | 'steeltrap' | 'cagedwolf' | 'sacrificial' | 'cat' | 'drawcopyondeath' | 'createbells' | 'daus' | 'strafe' | 'evolve' | 'drawcopy' | 'tripleblood' | 'submerge' | 'gainbattery' | 'jerseydevil' | 'submergesquid' | 'lammergeier' | 'corpseeater' | 'tutor' | 'splitstrike' | 'tristrike' | 'strafepush' | 'packmule' | 'ouroboros' | 'randomconsumable' | 'sharp' | 'quadruplebones' | 'tailonhit' | 'debuffenemy' | 'bellproximity' | 'cardsinhand' | 'mirror' | 'squirrelstrafe' | 'drawrabbits' | 'allstrike' | 'squirrelorbit' | 'giantcard' | 'giantmoon' | 'randomcard' | 'preventattack' | 'talkingcardchooser' | 'trapspawner' | 'conduitnull' | 'icecube' | 'bountyhunter' | 'brittle' | 'buffenemy' | 'sentry' | 'sniper' | 'drawrandomcardondeath' | 'movebeside' | 'conduitbuffattack' | 'explodeondeath' | 'bombspawner' | 'drawvesselonhit' | 'deletefile' | 'cellbuffself' | 'celldrawrandomcardondeath' | 'celltristrike' | 'gaingemblue' | 'gaingemgreen' | 'gaingemorange' | 'conduitenergy' | 'activatedrandompowerenergy' | 'conduitfactory' | 'explodegems' | 'conduitspawngems' | 'shieldgems' | 'conduitheal' | 'latchexplodeondeath' | 'latchbrittle' | 'latchdeathshield' | 'filesizedamage' | 'activateddealdamage' | 'deathshield' | 'swapstats' | 'gaingemtriple' | 'transformer' | 'activatedenergytobones' | 'activatedstatsup' | 'brokencoinleft' | 'brokencoinright' | 'drawnewhand' | 'skeletonstrafe' | 'bonedigger' | 'doubledeath' | 'gemdependant' | 'activateddrawskeleton' | 'gemsdraw' | 'greenmage' | 'activatedsacrificedrawcards' | 'loot' | 'buffgems' | 'droprubyondeath' | 'activatedstatsupenergy'

type CreatureId = 'adder' | 'alpha' | 'amalgam' | 'amoeba' | 'ant' | 'antqueen' | 'bat' | 'beaver' | 'bee' | 'beehive' | 'bloodhound' | 'bullfrog' | 'burrowingtrap' | 'cagedwolf' | 'cat' | 'catundead' | 'cockroach' | 'coyote' | 'daus' | 'defaulttail' | 'elk' | 'elkcub' | 'fieldmouse' | 'fieldmouse_fused' | 'geck' | 'goat' | 'grizzly' | 'hawk' | 'hrokkall' | 'jerseydevil' | 'kingfisher' | 'kraken' | 'lammergeier' | 'maggots' | 'magpie' | 'mantis' | 'mantisgod' | 'mole' | 'moleman' | 'moose' | 'mothman_stage1' | 'mothman_stage2' | 'mothman_stage3' | 'mule' | 'opossum' | 'otter' | 'ouroboros' | 'packrat' | 'porcupine' | 'pronghorn' | 'rabbit' | 'ratking' | 'rattler' | 'raven' | 'ravenegg' | 'salmon' | 'shark' | 'skink' | 'skinktail' | 'skunk' | 'snapper' | 'snelk' | 'sparrow' | 'squidbell' | 'squidcards' | 'squidmirror' | 'squirrel' | 'squirrelball' | 'stoat' | 'tail_bird' | 'tail_furry' | 'tail_insect' | 'urayuli' | 'vulture' | 'warren' | 'wolf' | 'wolfcub' | '!deathcard_base' | '!deathcard_leshy' | '!deathcard_victory' | '!giantcard_moon' | '!static!glitch' | 'baitbucket' | 'cardmergestones' | 'dam' | 'dausbell' | 'goldnugget' | 'peltgolden' | 'pelthare' | 'peltwolf' | 'ringworm' | 'smoke' | 'smoke_improved' | 'smoke_nobones' | 'starvation' | 'stinkbug_talking' | 'stoat_talking' | 'trap' | 'trapfrog' | 'wolf_talking' | '!corrupted' | '!deathcard_pixel_base' | '!inspector' | '!melter' | '!bountyhunter_base' | '!buildacard_base' | '!friendcard_base' | '!myco_old_data' | '!mycocard_base' | 'angler_fish_bad' | 'angler_fish_good' | 'angler_fish_more' | 'angler_talking' | 'bluemage_talking' | 'dummy_5-5' | 'mole_telegrapher' | 'mummy_telegrapher' | 'ouroboros_part3' | 'abovecurve' | 'alarmbot' | 'amoebot' | 'attackconduit' | 'automaton' | 'batterybot' | 'bolthound' | 'bombbot' | 'bombmaiden' | 'bustedprinter' | 'captivefile' | 'cellbuff' | 'cellgift' | 'celltri' | 'closerbot' | 'cxformeradder' | 'cxformerelk' | 'cxformerraven' | 'cxformerwolf' | 'emptyvessel' | 'emptyvessel_bluegem' | 'emptyvessel_greengem' | 'emptyvessel_orangegem' | 'energyconduit' | 'energyroller' | 'factoryconduit' | 'gemexploder' | 'gemripper' | 'gemsconduit' | 'gemshielder' | 'giftbot' | 'healerconduit' | 'insectodrone' | 'latcherbomb' | 'latcherbrittle' | 'latchershield' | 'leapbot' | 'librarian' | 'meatbot' | 'minecart' | 'nullconduit' | 'plasmagunner' | 'robomice' | 'roboskeleton' | 'sentinelblue' | 'sentinelgreen' | 'sentinelorange' | 'sentrybot' | 'sentrybot_fused' | 'shieldbot' | 'shutterbug' | 'sniper' | 'steambot' | 'swapbot' | 'techmoxtriple' | 'thickbot' | 'xformerbatbeast' | 'xformerbatbot' | 'xformergrizzlybeast' | 'xformergrizzlybot' | 'xformerporcupinebeast' | 'xformerporcupinebot' | 'annoytower' | 'boulder' | 'bridgerailing' | 'brokenbot' | 'conduittower' | 'deadtree' | 'frozenopossum' | 'stump' | 'tombstone' | 'tree' | 'tree_hologram' | 'tree_hologram_snowcovered' | 'tree_snowcovered' | 'banshee' | 'bonehound' | 'bonelordhorn' | 'bonepile' | 'coinleft' | 'coinright' | 'deadhand' | 'deadpets' | 'draugr' | 'drownedsoul' | 'family' | 'franknstein' | 'ghostship' | 'gravedigger' | 'gravedigger_fused' | 'headlesshorseman' | 'mummy' | 'necromancer' | 'revenant' | 'sarcophagus' | 'skeleton' | 'skeletonmage' | 'tombrobber' | 'zombie' | 'bluemage' | 'bluemage_fused' | 'flyingmage' | 'forcemage' | 'gemfiend' | 'greenmage' | 'juniorsage' | 'mageknight' | 'marrowmage' | 'masterbleene' | 'mastergoranj' | 'masterorlu' | 'moxdualbg' | 'moxdualgo' | 'moxdualob' | 'moxemerald' | 'moxruby' | 'moxsapphire' | 'moxtriple' | 'musclemage' | 'orangemage' | 'practicemage' | 'practicemagesmall' | 'pupil' | 'rubygolem' | 'stimmage'
