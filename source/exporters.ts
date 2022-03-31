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
