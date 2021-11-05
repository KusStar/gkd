import path from 'node:path'
import fs from 'node:fs'
import { downloadWithCheck } from 'gdl'

export const CACHE_DIR = path.join(__dirname, '../.cache')

export const TEMPLATES_URL = 'https://github.com/KusStar/gkd/tree/master/packages/templates'

export const downloadTemplate = async (name: string, target: string) => {
  await downloadWithCheck(`${TEMPLATES_URL}/${name}`, target)
}

export const getAllTemplates = async () => {
  await downloadWithCheck(TEMPLATES_URL, CACHE_DIR)
  return fs
    .readdirSync(CACHE_DIR)
    .filter((template) => template !== 'common')
}
