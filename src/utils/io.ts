import fs from 'fs-extra'
import path from 'path'
import type { Context } from '../gkd'

const getSourceDir = (root: string) => path.join(__dirname, '../../templates', root)

const prepareDir = async (dir: string) => {
  if (fs.existsSync(dir)) {
    await fs.remove(dir)
  }
  await fs.mkdir(dir)
}

const replaceTemplateVariables = async (from: string, ctx: Context) => {
  const source = await fs.readFile(from, 'utf8')

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

    await fs.writeFile(from, generatedSource)
  }
}

const replaceTemplateAllFiles = async (target: string, ctx: Context) => {
  const res = await fs.readdir(target)
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

const copyFiles = async (ctx: Context) => {
  const { appName, template } = ctx

  const target = path.join(process.cwd(), appName)

  await prepareDir(target)

  return Promise.all([
    // common
    await fs.copy(getSourceDir('common'), target),
    // specific
    await fs.copy(getSourceDir(template), target),
    // replace ctx
    replaceTemplateAllFiles(target, ctx),
  ])
}

export {
  copyFiles,
  getSourceDir,
}
