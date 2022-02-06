import { Card } from './card'

export function convertJsonCard(jsonCard: JsonCard): Card {
  const card: Card = {
    name: '',
    type: 'common',
    health: 0,
    power: 0,
    sigils: [],
    tribes: [],
    decals: [],
    portrait: undefined,
    statIcon: undefined,
    cost: undefined,
    flags: {
      combined: false,
      golden: false,
      terrain: false,
      squid: false,
      enhanced: false,
    }
  }

  card.gameId = jsonCard.id
  card.power = jsonCard.power
  card.health = jsonCard.health

  card.flags.combined = false
  card.flags.enhanced = ['Smoke_Improved'].includes(jsonCard.id)
  card.flags.squid = !!jsonCard.id.match(/Squid(Mirror|Bell|Cards)/)
  card.flags.terrain = jsonCard.appearanceBehaviours.includes('TerrainLayout')
  card.flags.golden = jsonCard.appearanceBehaviours.includes('GoldEmission')

  if (jsonCard.appearanceBehaviours.includes('TerrainBackground')) {
    card.type = 'terrain'
  }

  if (jsonCard.appearanceBehaviours.includes('RareCardBackground')) {
    card.type = 'rare'
  }

  if (jsonCard.appearanceBehaviours.includes('AlternatingBloodDecal')) {
    card.decals.push('blood')
  }

  if (jsonCard.appearanceBehaviours.includes('AddSnelkDecals')) {
    card.decals.push('snelk')
  }

  if (jsonCard.id.match(/Smoke(_Improved|_NoBones)?/)) {
    card.decals.push('smoke')
  }

  if (jsonCard.id === '!DEATHCARD_LESHY') {
    card.decals.push('leshy')
  }

  switch (jsonCard.statIcon) {
    case 'Ants': card.statIcon = 'ants'; break
    case 'Bell': card.statIcon = 'bell'; break
    case 'Mirror': card.statIcon = 'mirror'; break
    case 'None': card.statIcon = undefined; break
  }

  for (const tribe of jsonCard.tribes) {
    switch (tribe) {
      case 'Bird': card.tribes.push('bird'); break
      case 'Canine': card.tribes.push('canine'); break
      case 'Hooved': card.tribes.push('hooved'); break
      case 'Insect': card.tribes.push('insect'); break
      case 'Reptile': card.tribes.push('reptile'); break
      case 'Squirrel': break
    }
  }

  if (jsonCard.bloodCost != 0) {
    if (card.cost) {
      throw new Error()
    }

    card.cost = { type: 'blood', amount: jsonCard.bloodCost }
  }

  if (jsonCard.boneCost != 0) {
    if (card.cost) {
      throw new Error()
    }

    card.cost = { type: 'bone', amount: jsonCard.boneCost }
  }

  if (jsonCard.energyCost != 0) {
    if (card.cost) {
      throw new Error()
    }
    card.cost = { type: 'energy', amount: jsonCard.energyCost }
  }

  if (jsonCard.gems.length) {
    if (card.cost) {
      throw new Error()
    }

    const gemConverter = (gem: Gem): 'blue' | 'green' | 'orange' => {
      switch (gem) {
        case 'Blue': return 'blue'
        case 'Green': return 'green'
        case 'Orange': return 'orange'
      }
    }

    card.cost = { type: 'gem', gems: jsonCard.gems.map(gemConverter) }
  }

  for (const ability of jsonCard.abilities) {
    switch (ability) {
      case 'Deathtouch': card.sigils.push('deathtouch'); break
      case 'BuffNeighbours': card.sigils.push('buffneighbours'); break
      case 'RandomAbility': card.sigils.push('randomability'); break
      // case 'Ant': card.sigils.push('ant'); break
      case 'DrawAnt': card.sigils.push('drawant'); break
      case 'Flying': card.sigils.push('flying'); break
      case 'CreateDams': card.sigils.push('createdams'); break
      case 'BeesOnHit': card.sigils.push('beesonhit'); break
      case 'GuardDog': card.sigils.push('guarddog'); break
      case 'Reach': card.sigils.push('reach'); break
      case 'WhackAMole': card.sigils.push('whackamole'); break
      case 'SteelTrap': card.sigils.push('steeltrap'); break
      // case 'CagedWolf': card.sigils.push('cagedwolf'); break
      case 'Sacrificial': card.sigils.push('sacrificial'); break
      // case 'Cat': card.sigils.push('cat'); break
      case 'DrawCopyOnDeath': card.sigils.push('drawcopyondeath'); break
      case 'CreateBells': card.sigils.push('createbells'); break
      // case 'Daus': card.sigils.push('daus'); break
      case 'Strafe': card.sigils.push('strafe'); break
      case 'Evolve': card.sigils.push('evolve'); break
      case 'DrawCopy': card.sigils.push('drawcopy'); break
      case 'TripleBlood': card.sigils.push('tripleblood'); break
      case 'Submerge': card.sigils.push('submerge'); break
      // case 'GainBattery': card.sigils.push('gainbattery'); break
      // case 'JerseyDevil': card.sigils.push('jerseydevil'); break
      // case 'SubmergeSquid': card.sigils.push('submergesquid'); break
      // case 'Lammergeier': card.sigils.push('lammergeier'); break
      case 'CorpseEater': card.sigils.push('corpseeater'); break
      case 'Tutor': card.sigils.push('tutor'); break
      case 'SplitStrike': card.sigils.push('splitstrike'); break
      case 'TriStrike': card.sigils.push('tristrike'); break
      case 'StrafePush': card.sigils.push('strafepush'); break
      // case 'PackMule': card.sigils.push('packmule'); break
      // case 'Ouroboros': card.sigils.push('ouroboros'); break
      case 'RandomConsumable': card.sigils.push('randomconsumable'); break
      case 'Sharp': card.sigils.push('sharp'); break
      case 'QuadrupleBones': card.sigils.push('quadruplebones'); break
      case 'TailOnHit': card.sigils.push('tailonhit'); break
      case 'DebuffEnemy': card.sigils.push('debuffenemy'); break
      // case 'BellProximity': card.sigils.push('bellproximity'); break
      // case 'CardsInHand': card.sigils.push('cardsinhand'); break
      // case 'Mirror': card.sigils.push('mirror'); break
      case 'SquirrelStrafe': card.sigils.push('squirrelstrafe'); break
      case 'DrawRabbits': card.sigils.push('drawrabbits'); break
      case 'AllStrike': card.sigils.push('allstrike'); break
      case 'SquirrelOrbit': card.sigils.push('squirrelorbit'); break
      // case 'GiantCard': card.sigils.push('giantcard'); break
      // case 'GiantMoon': card.sigils.push('giantmoon'); break
      case 'RandomCard': card.sigils.push('randomcard'); break
      case 'PreventAttack': card.sigils.push('preventattack'); break
      // case 'TalkingCardChooser': card.sigils.push('talkingcardchooser'); break
      // case 'TrapSpawner': card.sigils.push('trapspawner'); break
      // case 'ConduitNull': card.sigils.push('conduitnull'); break
      case 'IceCube': card.sigils.push('icecube'); break
      // case 'BountyHunter': card.sigils.push('bountyhunter'); break
      case 'Brittle': card.sigils.push('brittle'); break
      case 'BuffEnemy': card.sigils.push('buffenemy'); break
      // case 'Sentry': card.sigils.push('sentry'); break
      // case 'Sniper': card.sigils.push('sniper'); break
      case 'DrawRandomCardOnDeath': card.sigils.push('drawrandomcardondeath'); break
      // case 'MoveBeside': card.sigils.push('movebeside'); break
      // case 'ConduitBuffAttack': card.sigils.push('conduitbuffattack'); break
      // case 'ExplodeOnDeath': card.sigils.push('explodeondeath'); break
      // case 'BombSpawner': card.sigils.push('bombspawner'); break
      // case 'DrawVesselOnHit': card.sigils.push('drawvesselonhit'); break
      // case 'DeleteFile': card.sigils.push('deletefile'); break
      // case 'CellBuffSelf': card.sigils.push('cellbuffself'); break
      // case 'CellDrawRandomCardOnDeath': card.sigils.push('celldrawrandomcardondeath'); break
      // case 'CellTriStrike': card.sigils.push('celltristrike'); break
      // case 'GainGemBlue': card.sigils.push('gaingemblue'); break
      // case 'GainGemGreen': card.sigils.push('gaingemgreen'); break
      // case 'GainGemOrange': card.sigils.push('gaingemorange'); break
      // case 'ConduitEnergy': card.sigils.push('conduitenergy'); break
      // case 'ActivatedRandomPowerEnergy': card.sigils.push('activatedrandompowerenergy'); break
      // case 'ConduitFactory': card.sigils.push('conduitfactory'); break
      // case 'ExplodeGems': card.sigils.push('explodegems'); break
      // case 'ConduitSpawnGems': card.sigils.push('conduitspawngems'); break
      // case 'ShieldGems': card.sigils.push('shieldgems'); break
      // case 'ConduitHeal': card.sigils.push('conduitheal'); break
      // case 'LatchExplodeOnDeath': card.sigils.push('latchexplodeondeath'); break
      // case 'LatchBrittle': card.sigils.push('latchbrittle'); break
      // case 'LatchDeathShield': card.sigils.push('latchdeathshield'); break
      // case 'FileSizeDamage': card.sigils.push('filesizedamage'); break
      // case 'ActivatedDealDamage': card.sigils.push('activateddealdamage'); break
      // case 'DeathShield': card.sigils.push('deathshield'); break
      // case 'SwapStats': card.sigils.push('swapstats'); break
      // case 'GainGemTriple': card.sigils.push('gaingemtriple'); break
      // case 'Transformer': card.sigils.push('transformer'); break
      // case 'ActivatedEnergyToBones': card.sigils.push('activatedenergytobones'); break
      // case 'ActivatedStatsUp': card.sigils.push('activatedstatsup'); break
      // case 'BrokenCoinLeft': card.sigils.push('brokencoinleft'); break
      // case 'BrokenCoinRight': card.sigils.push('brokencoinright'); break
      // case 'DrawNewHand': card.sigils.push('drawnewhand'); break
      // case 'SkeletonStrafe': card.sigils.push('skeletonstrafe'); break
      // case 'BoneDigger': card.sigils.push('bonedigger'); break
      // case 'DoubleDeath': card.sigils.push('doubledeath'); break
      // case 'GemDependant': card.sigils.push('gemdependant'); break
      // case 'ActivatedDrawSkeleton': card.sigils.push('activateddrawskeleton'); break
      // case 'GemsDraw': card.sigils.push('gemsdraw'); break
      // case 'GreenMage': card.sigils.push('greenmage'); break
      // case 'ActivatedSacrificeDrawCards': card.sigils.push('activatedsacrificedrawcards'); break
      // case 'Loot': card.sigils.push('loot'); break
      // case 'BuffGems': card.sigils.push('buffgems'); break
      // case 'DropRubyOnDeath': card.sigils.push('droprubyondeath'); break
      // case 'ActivatedStatsUpEnergy': card.sigils.push('activatedstatsupenergy'); break
    }
  }

  switch (jsonCard.id) {
    case 'Adder': card.portrait = { type: 'creature', id: 'adder' }; break
    case 'Alpha': card.portrait = { type: 'creature', id: 'alpha' }; break
    case 'Amalgam': card.portrait = { type: 'creature', id: 'amalgam' }; break
    case 'Amoeba': card.portrait = { type: 'creature', id: 'amoeba' }; break
    case 'Ant': card.portrait = { type: 'creature', id: 'ant' }; break
    case 'AntQueen': card.portrait = { type: 'creature', id: 'antqueen' }; break
    case 'Bat': card.portrait = { type: 'creature', id: 'bat' }; break
    case 'Beaver': card.portrait = { type: 'creature', id: 'beaver' }; break
    case 'Bee': card.portrait = { type: 'creature', id: 'bee' }; break
    case 'Beehive': card.portrait = { type: 'creature', id: 'beehive' }; break
    case 'Bloodhound': card.portrait = { type: 'creature', id: 'bloodhound' }; break
    case 'Bullfrog': card.portrait = { type: 'creature', id: 'bullfrog' }; break
    case 'BurrowingTrap': card.portrait = { type: 'creature', id: 'burrowingtrap' }; break
    case 'CagedWolf': card.portrait = { type: 'creature', id: 'cagedwolf' }; break
    case 'Cat': card.portrait = { type: 'creature', id: 'cat' }; break
    case 'CatUndead': card.portrait = { type: 'creature', id: 'catundead' }; break
    case 'Cockroach': card.portrait = { type: 'creature', id: 'cockroach' }; break
    case 'Coyote': card.portrait = { type: 'creature', id: 'coyote' }; break
    case 'Daus': card.portrait = { type: 'creature', id: 'daus' }; break
    case 'DefaultTail': card.portrait = { type: 'creature', id: 'defaulttail' }; break
    case 'Elk': card.portrait = { type: 'creature', id: 'elk' }; break
    case 'ElkCub': card.portrait = { type: 'creature', id: 'elkcub' }; break
    case 'FieldMouse': card.portrait = { type: 'creature', id: 'fieldmouse' }; break
    case 'FieldMouse_Fused': card.portrait = { type: 'creature', id: 'fieldmouse_fused' }; break
    case 'Geck': card.portrait = { type: 'creature', id: 'geck' }; break
    case 'Goat': card.portrait = { type: 'creature', id: 'goat' }; break
    case 'Grizzly': card.portrait = { type: 'creature', id: 'grizzly' }; break
    case 'Hawk': card.portrait = { type: 'creature', id: 'hawk' }; break
    case 'Hrokkall': card.portrait = { type: 'creature', id: 'hrokkall' }; break
    case 'JerseyDevil': card.portrait = { type: 'creature', id: 'jerseydevil' }; break
    case 'Kingfisher': card.portrait = { type: 'creature', id: 'kingfisher' }; break
    case 'Kraken': card.portrait = { type: 'creature', id: 'kraken' }; break
    case 'Lammergeier': card.portrait = { type: 'creature', id: 'lammergeier' }; break
    case 'Maggots': card.portrait = { type: 'creature', id: 'maggots' }; break
    case 'Magpie': card.portrait = { type: 'creature', id: 'magpie' }; break
    case 'Mantis': card.portrait = { type: 'creature', id: 'mantis' }; break
    case 'MantisGod': card.portrait = { type: 'creature', id: 'mantisgod' }; break
    case 'Mole': card.portrait = { type: 'creature', id: 'mole' }; break
    case 'MoleMan': card.portrait = { type: 'creature', id: 'moleman' }; break
    case 'Moose': card.portrait = { type: 'creature', id: 'moose' }; break
    case 'Mothman_Stage1': card.portrait = { type: 'creature', id: 'mothman_stage1' }; break
    case 'Mothman_Stage2': card.portrait = { type: 'creature', id: 'mothman_stage2' }; break
    case 'Mothman_Stage3': card.portrait = { type: 'creature', id: 'mothman_stage3' }; break
    case 'Mule': card.portrait = { type: 'creature', id: 'mule' }; break
    case 'Opossum': card.portrait = { type: 'creature', id: 'opossum' }; break
    case 'Otter': card.portrait = { type: 'creature', id: 'otter' }; break
    case 'Ouroboros': card.portrait = { type: 'creature', id: 'ouroboros' }; break
    case 'PackRat': card.portrait = { type: 'creature', id: 'packrat' }; break
    case 'Porcupine': card.portrait = { type: 'creature', id: 'porcupine' }; break
    case 'Pronghorn': card.portrait = { type: 'creature', id: 'pronghorn' }; break
    case 'Rabbit': card.portrait = { type: 'creature', id: 'rabbit' }; break
    case 'RatKing': card.portrait = { type: 'creature', id: 'ratking' }; break
    case 'Rattler': card.portrait = { type: 'creature', id: 'rattler' }; break
    case 'Raven': card.portrait = { type: 'creature', id: 'raven' }; break
    case 'RavenEgg': card.portrait = { type: 'creature', id: 'ravenegg' }; break
    case 'Salmon': card.portrait = { type: 'creature', id: 'salmon' }; break
    case 'Shark': card.portrait = { type: 'creature', id: 'shark' }; break
    case 'Skink': card.portrait = { type: 'creature', id: 'skink' }; break
    case 'SkinkTail': card.portrait = { type: 'creature', id: 'skinktail' }; break
    case 'Skunk': card.portrait = { type: 'creature', id: 'skunk' }; break
    case 'Snapper': card.portrait = { type: 'creature', id: 'snapper' }; break
    // case 'Snelk': card.portrait = { type: 'creature', id: 'snelk' }; break only used as decal
    case 'Sparrow': card.portrait = { type: 'creature', id: 'sparrow' }; break
    case 'SquidBell': card.portrait = { type: 'creature', id: 'squidbell' }; break
    case 'SquidCards': card.portrait = { type: 'creature', id: 'squidcards' }; break
    case 'SquidMirror': card.portrait = { type: 'creature', id: 'squidmirror' }; break
    case 'Squirrel': card.portrait = { type: 'creature', id: 'squirrel' }; break
    case 'SquirrelBall': card.portrait = { type: 'creature', id: 'squirrelball' }; break
    case 'Stoat': card.portrait = { type: 'creature', id: 'stoat' }; break
    case 'Tail_Bird': card.portrait = { type: 'creature', id: 'tail_bird' }; break
    case 'Tail_Furry': card.portrait = { type: 'creature', id: 'tail_furry' }; break
    case 'Tail_Insect': card.portrait = { type: 'creature', id: 'tail_insect' }; break
    case 'Urayuli': card.portrait = { type: 'creature', id: 'urayuli' }; break
    case 'Vulture': card.portrait = { type: 'creature', id: 'vulture' }; break
    case 'Warren': card.portrait = { type: 'creature', id: 'warren' }; break
    case 'Wolf': card.portrait = { type: 'creature', id: 'wolf' }; break
    case 'WolfCub': card.portrait = { type: 'creature', id: 'wolfcub' }; break
    // case '!DEATHCARD_BASE': card.portrait = { type: 'creature', id: '!deathcard_base' }; break
    // case '!DEATHCARD_LESHY': card.portrait = { type: 'creature', id: '!deathcard_leshy' }; break
    // case '!DEATHCARD_VICTORY': card.portrait = { type: 'creature', id: '!deathcard_victory' }; break
    // case '!GIANTCARD_MOON': card.portrait = { type: 'creature', id: '!giantcard_moon' }; break
    // case '!STATIC!GLITCH': card.portrait = { type: 'creature', id: '!static!glitch' }; break
    case 'BaitBucket': card.portrait = { type: 'creature', id: 'baitbucket' }; break
    case 'CardMergeStones': card.portrait = { type: 'creature', id: 'cardmergestones' }; break
    case 'Dam': card.portrait = { type: 'creature', id: 'dam' }; break
    case 'DausBell': card.portrait = { type: 'creature', id: 'dausbell' }; break
    case 'GoldNugget': card.portrait = { type: 'creature', id: 'goldnugget' }; break
    case 'PeltGolden': card.portrait = { type: 'creature', id: 'peltgolden' }; break
    case 'PeltHare': card.portrait = { type: 'creature', id: 'pelthare' }; break
    case 'PeltWolf': card.portrait = { type: 'creature', id: 'peltwolf' }; break
    case 'RingWorm': card.portrait = { type: 'creature', id: 'ringworm' }; break
    case 'Smoke': card.portrait = { type: 'creature', id: 'smoke' }; break
    case 'Smoke_Improved': card.portrait = { type: 'creature', id: 'smoke_improved' }; break
    case 'Smoke_NoBones': card.portrait = { type: 'creature', id: 'smoke' }; break
    case 'Starvation': card.portrait = { type: 'creature', id: 'starvation' }; break
    case 'Stinkbug_Talking': card.portrait = { type: 'creature', id: 'stinkbug_talking' }; break
    case 'Stoat_Talking': card.portrait = { type: 'creature', id: 'stoat_talking' }; break
    case 'Trap': card.portrait = { type: 'creature', id: 'trap' }; break
    case 'TrapFrog': card.portrait = { type: 'creature', id: 'trapfrog' }; break
    case 'Wolf_Talking': card.portrait = { type: 'creature', id: 'wolf_talking' }; break
    // case '!CORRUPTED': card.portrait = { type: 'creature', id: '!corrupted' }; break
    // case '!DEATHCARD_PIXEL_BASE': card.portrait = { type: 'creature', id: '!deathcard_pixel_base' }; break
    // case '!INSPECTOR': card.portrait = { type: 'creature', id: '!inspector' }; break
    // case '!MELTER': card.portrait = { type: 'creature', id: '!melter' }; break
    // case '!BOUNTYHUNTER_BASE': card.portrait = { type: 'creature', id: '!bountyhunter_base' }; break
    // case '!BUILDACARD_BASE': card.portrait = { type: 'creature', id: '!buildacard_base' }; break
    // case '!FRIENDCARD_BASE': card.portrait = { type: 'creature', id: '!friendcard_base' }; break
    // case '!MYCO_OLD_DATA': card.portrait = { type: 'creature', id: '!myco_old_data' }; break
    // case '!MYCOCARD_BASE': card.portrait = { type: 'creature', id: '!mycocard_base' }; break
    case 'Angler_Fish_Bad': card.portrait = { type: 'creature', id: 'angler_fish_bad' }; break
    case 'Angler_Fish_Good': card.portrait = { type: 'creature', id: 'angler_fish_good' }; break
    case 'Angler_Fish_More': card.portrait = { type: 'creature', id: 'angler_fish_more' }; break
    case 'Angler_Talking': card.portrait = { type: 'creature', id: 'angler_talking' }; break
    case 'BlueMage_Talking': card.portrait = { type: 'creature', id: 'bluemage_talking' }; break
    case 'DUMMY_5-5': card.portrait = { type: 'creature', id: 'dummy_5-5' }; break
    case 'Mole_Telegrapher': card.portrait = { type: 'creature', id: 'mole_telegrapher' }; break
    case 'Mummy_Telegrapher': card.portrait = { type: 'creature', id: 'mummy_telegrapher' }; break
    case 'Ouroboros_Part3': card.portrait = { type: 'creature', id: 'ouroboros_part3' }; break
    case 'AboveCurve': card.portrait = { type: 'creature', id: 'abovecurve' }; break
    case 'AlarmBot': card.portrait = { type: 'creature', id: 'alarmbot' }; break
    case 'Amoebot': card.portrait = { type: 'creature', id: 'amoebot' }; break
    case 'AttackConduit': card.portrait = { type: 'creature', id: 'attackconduit' }; break
    case 'Automaton': card.portrait = { type: 'creature', id: 'automaton' }; break
    case 'BatteryBot': card.portrait = { type: 'creature', id: 'batterybot' }; break
    case 'BoltHound': card.portrait = { type: 'creature', id: 'bolthound' }; break
    case 'Bombbot': card.portrait = { type: 'creature', id: 'bombbot' }; break
    case 'BombMaiden': card.portrait = { type: 'creature', id: 'bombmaiden' }; break
    case 'BustedPrinter': card.portrait = { type: 'creature', id: 'bustedprinter' }; break
    case 'CaptiveFile': card.portrait = { type: 'creature', id: 'captivefile' }; break
    case 'CellBuff': card.portrait = { type: 'creature', id: 'cellbuff' }; break
    case 'CellGift': card.portrait = { type: 'creature', id: 'cellgift' }; break
    case 'CellTri': card.portrait = { type: 'creature', id: 'celltri' }; break
    case 'CloserBot': card.portrait = { type: 'creature', id: 'closerbot' }; break
    case 'CXformerAdder': card.portrait = { type: 'creature', id: 'cxformeradder' }; break
    case 'CXformerElk': card.portrait = { type: 'creature', id: 'cxformerelk' }; break
    case 'CXformerRaven': card.portrait = { type: 'creature', id: 'cxformerraven' }; break
    case 'CXformerWolf': card.portrait = { type: 'creature', id: 'cxformerwolf' }; break
    case 'EmptyVessel': card.portrait = { type: 'creature', id: 'emptyvessel' }; break
    case 'EmptyVessel_BlueGem': card.portrait = { type: 'creature', id: 'emptyvessel_bluegem' }; break
    case 'EmptyVessel_GreenGem': card.portrait = { type: 'creature', id: 'emptyvessel_greengem' }; break
    case 'EmptyVessel_OrangeGem': card.portrait = { type: 'creature', id: 'emptyvessel_orangegem' }; break
    case 'EnergyConduit': card.portrait = { type: 'creature', id: 'energyconduit' }; break
    case 'EnergyRoller': card.portrait = { type: 'creature', id: 'energyroller' }; break
    case 'FactoryConduit': card.portrait = { type: 'creature', id: 'factoryconduit' }; break
    case 'GemExploder': card.portrait = { type: 'creature', id: 'gemexploder' }; break
    case 'GemRipper': card.portrait = { type: 'creature', id: 'gemripper' }; break
    case 'GemsConduit': card.portrait = { type: 'creature', id: 'gemsconduit' }; break
    case 'GemShielder': card.portrait = { type: 'creature', id: 'gemshielder' }; break
    case 'GiftBot': card.portrait = { type: 'creature', id: 'giftbot' }; break
    case 'HealerConduit': card.portrait = { type: 'creature', id: 'healerconduit' }; break
    case 'Insectodrone': card.portrait = { type: 'creature', id: 'insectodrone' }; break
    case 'LatcherBomb': card.portrait = { type: 'creature', id: 'latcherbomb' }; break
    case 'LatcherBrittle': card.portrait = { type: 'creature', id: 'latcherbrittle' }; break
    case 'LatcherShield': card.portrait = { type: 'creature', id: 'latchershield' }; break
    case 'LeapBot': card.portrait = { type: 'creature', id: 'leapbot' }; break
    case 'Librarian': card.portrait = { type: 'creature', id: 'librarian' }; break
    case 'MeatBot': card.portrait = { type: 'creature', id: 'meatbot' }; break
    case 'MineCart': card.portrait = { type: 'creature', id: 'minecart' }; break
    case 'NullConduit': card.portrait = { type: 'creature', id: 'nullconduit' }; break
    case 'PlasmaGunner': card.portrait = { type: 'creature', id: 'plasmagunner' }; break
    case 'RoboMice': card.portrait = { type: 'creature', id: 'robomice' }; break
    case 'RoboSkeleton': card.portrait = { type: 'creature', id: 'roboskeleton' }; break
    case 'SentinelBlue': card.portrait = { type: 'creature', id: 'sentinelblue' }; break
    case 'SentinelGreen': card.portrait = { type: 'creature', id: 'sentinelgreen' }; break
    case 'SentinelOrange': card.portrait = { type: 'creature', id: 'sentinelorange' }; break
    case 'SentryBot': card.portrait = { type: 'creature', id: 'sentrybot' }; break
    case 'SentryBot_Fused': card.portrait = { type: 'creature', id: 'sentrybot_fused' }; break
    case 'Shieldbot': card.portrait = { type: 'creature', id: 'shieldbot' }; break
    case 'Shutterbug': card.portrait = { type: 'creature', id: 'shutterbug' }; break
    case 'Sniper': card.portrait = { type: 'creature', id: 'sniper' }; break
    case 'Steambot': card.portrait = { type: 'creature', id: 'steambot' }; break
    case 'SwapBot': card.portrait = { type: 'creature', id: 'swapbot' }; break
    case 'TechMoxTriple': card.portrait = { type: 'creature', id: 'techmoxtriple' }; break
    case 'Thickbot': card.portrait = { type: 'creature', id: 'thickbot' }; break
    case 'XformerBatBeast': card.portrait = { type: 'creature', id: 'xformerbatbeast' }; break
    case 'XformerBatBot': card.portrait = { type: 'creature', id: 'xformerbatbot' }; break
    case 'XformerGrizzlyBeast': card.portrait = { type: 'creature', id: 'xformergrizzlybeast' }; break
    case 'XformerGrizzlyBot': card.portrait = { type: 'creature', id: 'xformergrizzlybot' }; break
    case 'XformerPorcupineBeast': card.portrait = { type: 'creature', id: 'xformerporcupinebeast' }; break
    case 'XformerPorcupineBot': card.portrait = { type: 'creature', id: 'xformerporcupinebot' }; break
    case 'AnnoyTower': card.portrait = { type: 'creature', id: 'annoytower' }; break
    case 'Boulder': card.portrait = { type: 'creature', id: 'boulder' }; break
    case 'BridgeRailing': card.portrait = { type: 'creature', id: 'bridgerailing' }; break
    case 'BrokenBot': card.portrait = { type: 'creature', id: 'brokenbot' }; break
    case 'ConduitTower': card.portrait = { type: 'creature', id: 'conduittower' }; break
    case 'DeadTree': card.portrait = { type: 'creature', id: 'deadtree' }; break
    case 'FrozenOpossum': card.portrait = { type: 'creature', id: 'frozenopossum' }; break
    case 'Stump': card.portrait = { type: 'creature', id: 'stump' }; break
    case 'TombStone': card.portrait = { type: 'creature', id: 'tombstone' }; break
    case 'Tree': card.portrait = { type: 'creature', id: 'tree' }; break
    case 'Tree_Hologram': card.portrait = { type: 'creature', id: 'tree_hologram' }; break
    case 'Tree_Hologram_SnowCovered': card.portrait = { type: 'creature', id: 'tree_hologram_snowcovered' }; break
    case 'Tree_SnowCovered': card.portrait = { type: 'creature', id: 'tree_snowcovered' }; break
    case 'Banshee': card.portrait = { type: 'creature', id: 'banshee' }; break
    case 'Bonehound': card.portrait = { type: 'creature', id: 'bonehound' }; break
    case 'BonelordHorn': card.portrait = { type: 'creature', id: 'bonelordhorn' }; break
    case 'Bonepile': card.portrait = { type: 'creature', id: 'bonepile' }; break
    case 'CoinLeft': card.portrait = { type: 'creature', id: 'coinleft' }; break
    case 'CoinRight': card.portrait = { type: 'creature', id: 'coinright' }; break
    case 'DeadHand': card.portrait = { type: 'creature', id: 'deadhand' }; break
    case 'DeadPets': card.portrait = { type: 'creature', id: 'deadpets' }; break
    case 'Draugr': card.portrait = { type: 'creature', id: 'draugr' }; break
    case 'DrownedSoul': card.portrait = { type: 'creature', id: 'drownedsoul' }; break
    case 'Family': card.portrait = { type: 'creature', id: 'family' }; break
    case 'FrankNStein': card.portrait = { type: 'creature', id: 'franknstein' }; break
    case 'GhostShip': card.portrait = { type: 'creature', id: 'ghostship' }; break
    case 'Gravedigger': card.portrait = { type: 'creature', id: 'gravedigger' }; break
    case 'Gravedigger_Fused': card.portrait = { type: 'creature', id: 'gravedigger_fused' }; break
    case 'HeadlessHorseman': card.portrait = { type: 'creature', id: 'headlesshorseman' }; break
    case 'Mummy': card.portrait = { type: 'creature', id: 'mummy' }; break
    case 'Necromancer': card.portrait = { type: 'creature', id: 'necromancer' }; break
    case 'Revenant': card.portrait = { type: 'creature', id: 'revenant' }; break
    case 'Sarcophagus': card.portrait = { type: 'creature', id: 'sarcophagus' }; break
    case 'Skeleton': card.portrait = { type: 'creature', id: 'skeleton' }; break
    case 'SkeletonMage': card.portrait = { type: 'creature', id: 'skeletonmage' }; break
    case 'TombRobber': card.portrait = { type: 'creature', id: 'tombrobber' }; break
    case 'Zombie': card.portrait = { type: 'creature', id: 'zombie' }; break
    case 'BlueMage': card.portrait = { type: 'creature', id: 'bluemage' }; break
    case 'BlueMage_Fused': card.portrait = { type: 'creature', id: 'bluemage_fused' }; break
    case 'FlyingMage': card.portrait = { type: 'creature', id: 'flyingmage' }; break
    case 'ForceMage': card.portrait = { type: 'creature', id: 'forcemage' }; break
    case 'GemFiend': card.portrait = { type: 'creature', id: 'gemfiend' }; break
    case 'GreenMage': card.portrait = { type: 'creature', id: 'greenmage' }; break
    case 'JuniorSage': card.portrait = { type: 'creature', id: 'juniorsage' }; break
    case 'MageKnight': card.portrait = { type: 'creature', id: 'mageknight' }; break
    case 'MarrowMage': card.portrait = { type: 'creature', id: 'marrowmage' }; break
    case 'MasterBleene': card.portrait = { type: 'creature', id: 'masterbleene' }; break
    case 'MasterGoranj': card.portrait = { type: 'creature', id: 'mastergoranj' }; break
    case 'MasterOrlu': card.portrait = { type: 'creature', id: 'masterorlu' }; break
    case 'MoxDualBG': card.portrait = { type: 'creature', id: 'moxdualbg' }; break
    case 'MoxDualGO': card.portrait = { type: 'creature', id: 'moxdualgo' }; break
    case 'MoxDualOB': card.portrait = { type: 'creature', id: 'moxdualob' }; break
    case 'MoxEmerald': card.portrait = { type: 'creature', id: 'moxemerald' }; break
    case 'MoxRuby': card.portrait = { type: 'creature', id: 'moxruby' }; break
    case 'MoxSapphire': card.portrait = { type: 'creature', id: 'moxsapphire' }; break
    case 'MoxTriple': card.portrait = { type: 'creature', id: 'moxtriple' }; break
    case 'MuscleMage': card.portrait = { type: 'creature', id: 'musclemage' }; break
    case 'OrangeMage': card.portrait = { type: 'creature', id: 'orangemage' }; break
    case 'PracticeMage': card.portrait = { type: 'creature', id: 'practicemage' }; break
    case 'PracticeMageSmall': card.portrait = { type: 'creature', id: 'practicemagesmall' }; break
    case 'Pupil': card.portrait = { type: 'creature', id: 'pupil' }; break
    case 'RubyGolem': card.portrait = { type: 'creature', id: 'rubygolem' }; break
    case 'StimMage': card.portrait = { type: 'creature', id: 'stimmage' }; break
  }

  return card
}

interface JsonCard {
  id: CreatureId,
  power: number,
  health: number,
  bloodCost: number,
  boneCost: number,
  energyCost: number,

  temple: Temple,
  complexity: Complexity,
  metaCategories: MetaCategory[],
  abilities: Ability[],
  appearanceBehaviours: AppearanceBehaviour[],
  tribes: Tribe[],
  traits: Trait[],
  gems: Gem[],
  statIcon: StatIcon,

  sacrificable: boolean,
  level: number,
  oncePerDeck: boolean,
  gemified: boolean,

  iceCubeId?: string,
  evolve?: {
    turns: number,
    evolvesTo: string,
  }
}

type CreatureId = 'Adder' | 'Alpha' | 'Amalgam' | 'Amoeba' | 'Ant' | 'AntQueen' | 'Bat' | 'Beaver' | 'Bee' | 'Beehive' | 'Bloodhound' | 'Bullfrog' | 'BurrowingTrap' | 'CagedWolf' | 'Cat' | 'CatUndead' | 'Cockroach' | 'Coyote' | 'Daus' | 'DefaultTail' | 'Elk' | 'ElkCub' | 'FieldMouse' | 'FieldMouse_Fused' | 'Geck' | 'Goat' | 'Grizzly' | 'Hawk' | 'Hrokkall' | 'JerseyDevil' | 'Kingfisher' | 'Kraken' | 'Lammergeier' | 'Maggots' | 'Magpie' | 'Mantis' | 'MantisGod' | 'Mole' | 'MoleMan' | 'Moose' | 'Mothman_Stage1' | 'Mothman_Stage2' | 'Mothman_Stage3' | 'Mule' | 'Opossum' | 'Otter' | 'Ouroboros' | 'PackRat' | 'Porcupine' | 'Pronghorn' | 'Rabbit' | 'RatKing' | 'Rattler' | 'Raven' | 'RavenEgg' | 'Salmon' | 'Shark' | 'Skink' | 'SkinkTail' | 'Skunk' | 'Snapper' | 'Snelk' | 'Sparrow' | 'SquidBell' | 'SquidCards' | 'SquidMirror' | 'Squirrel' | 'SquirrelBall' | 'Stoat' | 'Tail_Bird' | 'Tail_Furry' | 'Tail_Insect' | 'Urayuli' | 'Vulture' | 'Warren' | 'Wolf' | 'WolfCub' | '!DEATHCARD_BASE' | '!DEATHCARD_LESHY' | '!DEATHCARD_VICTORY' | '!GIANTCARD_MOON' | '!STATIC!GLITCH' | 'BaitBucket' | 'CardMergeStones' | 'Dam' | 'DausBell' | 'GoldNugget' | 'PeltGolden' | 'PeltHare' | 'PeltWolf' | 'RingWorm' | 'Smoke' | 'Smoke_Improved' | 'Smoke_NoBones' | 'Starvation' | 'Stinkbug_Talking' | 'Stoat_Talking' | 'Trap' | 'TrapFrog' | 'Wolf_Talking' | '!CORRUPTED' | '!DEATHCARD_PIXEL_BASE' | '!INSPECTOR' | '!MELTER' | '!BOUNTYHUNTER_BASE' | '!BUILDACARD_BASE' | '!FRIENDCARD_BASE' | '!MYCO_OLD_DATA' | '!MYCOCARD_BASE' | 'Angler_Fish_Bad' | 'Angler_Fish_Good' | 'Angler_Fish_More' | 'Angler_Talking' | 'BlueMage_Talking' | 'DUMMY_5-5' | 'Mole_Telegrapher' | 'Mummy_Telegrapher' | 'Ouroboros_Part3' | 'AboveCurve' | 'AlarmBot' | 'Amoebot' | 'AttackConduit' | 'Automaton' | 'BatteryBot' | 'BoltHound' | 'Bombbot' | 'BombMaiden' | 'BustedPrinter' | 'CaptiveFile' | 'CellBuff' | 'CellGift' | 'CellTri' | 'CloserBot' | 'CXformerAdder' | 'CXformerElk' | 'CXformerRaven' | 'CXformerWolf' | 'EmptyVessel' | 'EmptyVessel_BlueGem' | 'EmptyVessel_GreenGem' | 'EmptyVessel_OrangeGem' | 'EnergyConduit' | 'EnergyRoller' | 'FactoryConduit' | 'GemExploder' | 'GemRipper' | 'GemsConduit' | 'GemShielder' | 'GiftBot' | 'HealerConduit' | 'Insectodrone' | 'LatcherBomb' | 'LatcherBrittle' | 'LatcherShield' | 'LeapBot' | 'Librarian' | 'MeatBot' | 'MineCart' | 'NullConduit' | 'PlasmaGunner' | 'RoboMice' | 'RoboSkeleton' | 'SentinelBlue' | 'SentinelGreen' | 'SentinelOrange' | 'SentryBot' | 'SentryBot_Fused' | 'Shieldbot' | 'Shutterbug' | 'Sniper' | 'Steambot' | 'SwapBot' | 'TechMoxTriple' | 'Thickbot' | 'XformerBatBeast' | 'XformerBatBot' | 'XformerGrizzlyBeast' | 'XformerGrizzlyBot' | 'XformerPorcupineBeast' | 'XformerPorcupineBot' | 'AnnoyTower' | 'Boulder' | 'BridgeRailing' | 'BrokenBot' | 'ConduitTower' | 'DeadTree' | 'FrozenOpossum' | 'Stump' | 'TombStone' | 'Tree' | 'Tree_Hologram' | 'Tree_Hologram_SnowCovered' | 'Tree_SnowCovered' | 'Banshee' | 'Bonehound' | 'BonelordHorn' | 'Bonepile' | 'CoinLeft' | 'CoinRight' | 'DeadHand' | 'DeadPets' | 'Draugr' | 'DrownedSoul' | 'Family' | 'FrankNStein' | 'GhostShip' | 'Gravedigger' | 'Gravedigger_Fused' | 'HeadlessHorseman' | 'Mummy' | 'Necromancer' | 'Revenant' | 'Sarcophagus' | 'Skeleton' | 'SkeletonMage' | 'TombRobber' | 'Zombie' | 'BlueMage' | 'BlueMage_Fused' | 'FlyingMage' | 'ForceMage' | 'GemFiend' | 'GreenMage' | 'JuniorSage' | 'MageKnight' | 'MarrowMage' | 'MasterBleene' | 'MasterGoranj' | 'MasterOrlu' | 'MoxDualBG' | 'MoxDualGO' | 'MoxDualOB' | 'MoxEmerald' | 'MoxRuby' | 'MoxSapphire' | 'MoxTriple' | 'MuscleMage' | 'OrangeMage' | 'PracticeMage' | 'PracticeMageSmall' | 'Pupil' | 'RubyGolem' | 'StimMage' | 'None'
type Ability = 'Deathtouch' | 'BuffNeighbours' | 'RandomAbility' | 'Ant' | 'DrawAnt' | 'Flying' | 'CreateDams' | 'BeesOnHit' | 'GuardDog' | 'Reach' | 'WhackAMole' | 'SteelTrap' | 'CagedWolf' | 'Sacrificial' | 'Cat' | 'DrawCopyOnDeath' | 'CreateBells' | 'Daus' | 'Strafe' | 'Evolve' | 'DrawCopy' | 'TripleBlood' | 'Submerge' | 'GainBattery' | 'JerseyDevil' | 'SubmergeSquid' | 'Lammergeier' | 'CorpseEater' | 'Tutor' | 'SplitStrike' | 'TriStrike' | 'StrafePush' | 'PackMule' | 'Ouroboros' | 'RandomConsumable' | 'Sharp' | 'QuadrupleBones' | 'TailOnHit' | 'DebuffEnemy' | 'BellProximity' | 'CardsInHand' | 'Mirror' | 'SquirrelStrafe' | 'DrawRabbits' | 'AllStrike' | 'SquirrelOrbit' | 'GiantCard' | 'GiantMoon' | 'RandomCard' | 'PreventAttack' | 'TalkingCardChooser' | 'TrapSpawner' | 'ConduitNull' | 'IceCube' | 'BountyHunter' | 'Brittle' | 'BuffEnemy' | 'Sentry' | 'Sniper' | 'DrawRandomCardOnDeath' | 'MoveBeside' | 'ConduitBuffAttack' | 'ExplodeOnDeath' | 'BombSpawner' | 'DrawVesselOnHit' | 'DeleteFile' | 'CellBuffSelf' | 'CellDrawRandomCardOnDeath' | 'CellTriStrike' | 'GainGemBlue' | 'GainGemGreen' | 'GainGemOrange' | 'ConduitEnergy' | 'ActivatedRandomPowerEnergy' | 'ConduitFactory' | 'ExplodeGems' | 'ConduitSpawnGems' | 'ShieldGems' | 'ConduitHeal' | 'LatchExplodeOnDeath' | 'LatchBrittle' | 'LatchDeathShield' | 'FileSizeDamage' | 'ActivatedDealDamage' | 'DeathShield' | 'SwapStats' | 'GainGemTriple' | 'Transformer' | 'ActivatedEnergyToBones' | 'ActivatedStatsUp' | 'BrokenCoinLeft' | 'BrokenCoinRight' | 'DrawNewHand' | 'SkeletonStrafe' | 'BoneDigger' | 'DoubleDeath' | 'GemDependant' | 'ActivatedDrawSkeleton' | 'GemsDraw' | 'GreenMage' | 'ActivatedSacrificeDrawCards' | 'Loot' | 'BuffGems' | 'DropRubyOnDeath' | 'ActivatedStatsUpEnergy'
type AppearanceBehaviour = 'RareCardBackground' | 'TerrainBackground' | 'TerrainLayout' | 'SexyGoat' | 'AlternatingBloodDecal' | 'AddSnelkDecals' | 'DynamicPortrait' | 'GiantAnimatedPortrait' | 'StaticGlitch' | 'GoldEmission' | 'AnimatedPortrait' | 'HologramPortrait'
type Tribe = 'Reptile' | 'Canine' | 'Bird' | 'Hooved' | 'Insect' | 'Squirrel'
type MetaCategory = 'ChoiceNode' | 'TraderOffer' | 'GBCPack' | 'GBCPlayable' | 'Rare' | 'Part3Random'
type Trait = 'KillsSurvivors' | 'Ant' | 'Blind' | 'Structure' | 'Terrain' | 'DeathcardCreationNonOption' | 'Undead' | 'FeedsStoat' | 'Fused' | 'Goat' | 'Uncuttable' | 'SatisfiesRingTrial' | 'Wolf' | 'Giant' | 'Pelt' | 'Gem'
type Gem = 'Blue' | 'Green' | 'Orange'
type StatIcon = 'Ants' | 'Bones' | 'Bell' | 'CardsInHand' | 'Mirror' | 'GreenGems' | 'None'
type Complexity = 'Simple' | 'Intermediate' | 'Advanced' | 'Vanilla'
type Temple = 'Nature' | 'Tech' | 'Undead' | 'Wizard'
