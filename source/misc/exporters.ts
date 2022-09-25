import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// function to get language code from language name
function getLanguageCode(language: string): string {
  switch (language) {
    case 'English':
      return 'en'
    case 'German':
      return 'de'
    case 'French':
      return 'fr'
    case 'Italian':
      return 'it'
    case 'Spanish':
      return 'es'
    case 'BrazilianPortuguese':
      return 'pt-br'
    case 'Russian':
      return 'ru'
    case 'Japanese':
      return 'ja'
    case 'ChineseSimplified':
      return 'zh-cn'
    case 'ChineseTraditional':
      return 'zh-tw'
    case 'Korean':
      return 'ko'
    case 'Turkish':
      return 'tr'
  }

  throw new Error(`Language '${language}' not supported`)
}

function readTranslations(path: string) {
  const translations: Record<string, Record<string, string>> = {}
  readdirSync(path).forEach(file => {
    // join path to file
    const filePath = join(path, file)
    const text = readFileSync(filePath, 'utf8')
    const lang = getLanguageCode(file)
    translations[lang] = {}

    text.split('\n')
      .filter(line => line.includes('DISPLAYEDNAME'))
      .map(line => {
        const match = /^(.+?)_DISPLAYEDNAME_\d+;(.*?);(.*)/.exec(line)
        if (!match) {
          throw new Error(`Could not parse line: '${line}'`)
        }
        return {
          id: match[1],
          name: match[2],
          translation: lang === 'en' ? match[2] : match[3],
        }
      })
      .forEach(o => {
        translations[lang][o.id.toLocaleLowerCase()] = o.translation
      })
  })
  return translations
}

const translations = readTranslations('./localization')
writeFileSync('./translations.json', JSON.stringify(translations, null, 2))

// read file translation.json
// const translations = JSON.parse(readFileSync('./translations.json', 'utf8'))
// const creatures = ['adder', 'alpha', 'amalgam', 'amoeba', 'ant', 'antflying', 'antqueen', 'aquasquirrel', 'baitbucket', 'bat', 'beaver', 'bee', 'beehive', 'bird_tail', 'bloodhound', 'boulder', 'brokenegg', 'bull', 'bullfrog', 'cagedwolf', 'canine_tail', 'cat', 'cat_undead', 'cockroach', 'coyote', 'cuckoo', 'dam', 'daus', 'dausbell', 'deer', 'deercub', 'direwolf', 'direwolfcub', 'fieldmice', 'frozen_opossum', 'geck', 'goat', 'goat_sexy', 'goldnugget', 'grizzly', 'hodag', 'hunterhare', 'hydra', 'hydraegg', 'hydraegg_light', 'ijiraq', 'insect_tail', 'jerseydevil', 'jerseydevil_sleeping', 'kingfisher', 'kraken', 'lammergeier', 'lice', 'maggots', 'magpie', 'mantis', 'mantisgod', 'mealworm', 'mole', 'moleman', 'moleseaman', 'moose', 'mothman_1', 'mothman_2', 'mothman_3', 'mudturtle', 'mudturtle_shelled', 'mule', 'opossum', 'otter', 'ouroboros', 'packrat', 'pelt_golden', 'pelt_hare', 'pelt_wolf', 'porcupine', 'pronghorn', 'rabbit', 'raccoon', 'ratking', 'rattler', 'raven', 'ravenegg', 'redhart', 'ringworm', 'shark', 'sinkhole', 'skeletonparrot', 'skeletonpirate', 'skink', 'skink_tail', 'skink_tailless', 'skunk', 'smoke', 'smoke_improved', 'sparrow', 'squidbell', 'squidcards', 'squidmirror', 'squirrel', 'squirrel_scared', 'starvingman', 'stoat', 'stoat_bloated', 'stones', 'stump', 'tadpole', 'trap', 'trap_closed', 'trapfrog', 'tree', 'tree_snowcovered', 'turtle', 'urayuli', 'vulture', 'warren', 'wolf', 'wolfcub', 'wolverine', 'wolverine_cub',]

// for (const creature of creatures) {
//   console.log(creature, translations['en'][creature])
// }
