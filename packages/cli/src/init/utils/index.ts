import ejs from 'ejs'
import enquirer from 'enquirer'
import fs from 'fs-extra'
import { download } from 'gdl'
import ora from 'ora'
import path from 'path'
import temp from 'temp'

import { loadConfig } from '../../config'
import { checkOverwritten } from '../../shared'
import { Context } from '../types'

const { prompt } = enquirer

export const CACHE_DIR = temp.mkdirSync('kuss-gkd-cli-cache')

export const TEMPLATES_URL =
  'https://github.com/KusStar/gkd/tree/master/packages/templates/src'

export const downloadTemplate = async (name: string, target: string) => {
  await download(`${TEMPLATES_URL}/${name}`, target)
}

export const getAllTemplates = async () => {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true })
  }
  await download(TEMPLATES_URL, CACHE_DIR)
  return fs.readdirSync(CACHE_DIR).filter((template) => template !== 'common')
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
      choices: allTemplates,
    })
    return {
      name,
      template: response.template,
      author: config.author,
    }
  } catch (e) {
    console.log('gkd: Not selected')
    process.exit(1)
  }
}

const prepareDir = async (dir: string) => {
  if (fs.existsSync(dir)) {
    await fs.removeSync(dir)
  }
  await fs.mkdirSync(dir)
}

const replaceTemplateVariables = async (from: string, ctx: Context) => {
  const source = fs.readFileSync(from, 'utf8')

  const output = ejs.render(source, {
    ...ctx,
    version: '0.0.1',
    year: new Date().getFullYear().toString(),
  })

  fs.writeFileSync(from, output)
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

  if (name === '.') {
    ctx.name = path.basename(process.cwd())
  }

  await prepareDir(target)

  return Promise.all([
    // common
    await downloadTemplate('common', target),
    // specific
    await downloadTemplate(template, target),
    // replace ctx
    replaceTemplateAllFiles(target, ctx),
  ])
}
