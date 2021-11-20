import path from 'node:path'
import fs from 'node:fs'
import { download } from 'gdl'

export const CACHE_DIR = path.join(__dirname, '../.cache')

export const TEMPLATES_URL = 'https://github.com/KusStar/gkd/tree/master/packages/templates/src'

export const downloadTemplate = async (name: string, target: string) => {
  await download(`${TEMPLATES_URL}/${name}`, target)
}

export const getAllTemplates = async () => {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true })
  }
  await download(TEMPLATES_URL, CACHE_DIR)
  return fs
    .readdirSync(CACHE_DIR)
    .filter((template) => template !== 'common')
}
