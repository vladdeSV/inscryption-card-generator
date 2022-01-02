import { existsSync } from "fs";
import * as path from "path";

const resourcePath = './resource/'
const requiredBaseFiles: string[] = [
  './cards/common.png',
  './cards/rare.png',
  './cards/terrain.png',

  './cards/backs/common.png',
  './cards/backs/squirrel.png',
  './cards/backs/bee.png',
  './cards/backs/deathcard.png',
]

function validateRequiredFiles(resourcePath: string, requiredFiles: string[]): void {
  const missingFilePaths = []

  for (const file of requiredFiles) {
    const filePath = path.normalize(path.join(resourcePath, file))

    if (!existsSync(filePath)) {
      missingFilePaths.push(filePath)
    }
  }

  if (missingFilePaths.length) {
    for (const missingFilePath of missingFilePaths) {
      console.error('ERROR:', 'Missing file', missingFilePath);
    }

    process.exit(1)
  }
}

validateRequiredFiles(resourcePath, requiredBaseFiles)
