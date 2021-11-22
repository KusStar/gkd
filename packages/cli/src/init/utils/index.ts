import { prompt } from 'enquirer'
import { download } from 'gdl'
import fs from 'node:fs'
import path from 'node:path'
import ora from 'ora'

import { loadConfig } from '../../config'
import { Context } from '../types'

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

const checkOverwritten = async (name: string) => {
  const SKIP = 'gkd: No overwrite, skip'
  const target = path.join(process.cwd(), name)
  if (fs.existsSync(target)) {
    try {
      const { shouldOverwrite } = await prompt<{ shouldOverwrite: boolean }>({
        type: 'confirm',
        name: 'shouldOverwrite',
        message: `${name} already exists, overwrite it?`,
        initial: 'y'
      })
      if (!shouldOverwrite) {
        console.log(SKIP)
        process.exit(1)
      }
    } catch (e) {
      console.log(SKIP)
      process.exit(1)
    }
  }
}

export const initContext = async (name: string): Promise<Context> => {
  const config = loadConfig()
  await checkOverwritten(name)
  const spinner = ora('Fetching templates...').start()
  const allTemplates = await getAllTemplates()
  spinner.stop()
  try {
    const response = await prompt<{ template: string }>({
      type: 'select',
      name: 'template',
      message: 'Which template do you want to generate?',
      choices: allTemplates
    })
    return {
      name,
      template: response.template,
      author: config.author
    }
  } catch (e) {
    console.log('gkd: Not selected')
    process.exit(1)
  }
}

const prepareDir = async (dir: string) => {
  if (fs.existsSync(dir)) {
    await fs.rmSync(dir, { force: true, recursive: true })
  }
  await fs.mkdirSync(dir)
}

const replaceTemplateVariables = async (from: string, ctx: Context) => {
  const source = fs.readFileSync(from, 'utf8')

  const variablesRegex = /%NAME%|%AUTHOR%|%PAGE%|%YEAR%/g
  if (!source.match(variablesRegex)) {
    return
  }

  if (typeof ctx === 'object') {
    const { name, author } = ctx
    const generatedSource = source
      .replace(/%NAME%/g, name)
      .replace(/%AUTHOR%/g, author.name)
      .replace(/%PAGE%/g, author.page)
      .replace(/%YEAR%/g, new Date().getFullYear().toString())

    fs.writeFileSync(from, generatedSource)
  }
}

const replaceTemplateAllFiles = async (target: string, ctx: Context) => {
  const res = fs.readdirSync(target)
  for (const current of res) {
    const currentPath = path.join(target, current)
    const isFile = fs.lstatSync(currentPath).isFile()
    if (isFile) {
      replaceTemplateVariables(currentPath, ctx)
    } else {
      replaceTemplateAllFiles(currentPath, ctx)
    }
  }
}

export const startDownload = async (ctx: Context) => {
  const { name, template } = ctx

  const target = path.join(process.cwd(), name)

  await prepareDir(target)

  return Promise.all([
    // common
    downloadTemplate('common', target),
    // specific
    downloadTemplate(template, target),
    // replace ctx
    replaceTemplateAllFiles(target, ctx)
  ])
}
