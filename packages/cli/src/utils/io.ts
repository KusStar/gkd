import fs from 'node:fs'
import path from 'node:path'
import { downloadTemplate } from './utils'
import { Context } from '../types'

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
    const { appName, author } = ctx
    const generatedSource = source
      .replace(/%NAME%/g, appName)
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

const startDownload = async (ctx: Context) => {
  const { appName, template } = ctx

  const target = path.join(process.cwd(), appName)

  await prepareDir(target)

  return Promise.all([
    // common
    downloadTemplate('common', target),
    // specific
    downloadTemplate(template, target),
    // replace ctx
    replaceTemplateAllFiles(target, ctx),
  ])
}

export {
  startDownload,
}
