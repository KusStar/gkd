const fs = require('fs-extra')
const path = require('path')

const getSourceDir = (root) => path.join(__dirname, '../../templates', root)

const prepareDir = async (dir) => {
  if (fs.existsSync(dir)) {
    await fs.remove(dir)
  }
  await fs.mkdir(dir)
}

const replaceTemplateVariables = async (from, variables) => {
  const source = await fs.readFile(from, 'utf8')

  const variablesRegex = /%NAME%|%AUTHOR%|%PAGE%|%YEAR%/g
  if (!source.match(variablesRegex)) {
    return
  }

  if (typeof variables === 'object') {
    const { appName, author } = variables
    const generatedSource = source
      .replace(/%NAME%/g, appName)
      .replace(/%AUTHOR%/g, author.name)
      .replace(/%PAGE%/g, author.page)
      .replace(/%YEAR%/g, new Date().getFullYear())

    await fs.writeFile(from, generatedSource)
  }
}

const replaceTemplateAllFiles = async (target, variables) => {
  const res = await fs.readdir(target)
  for (const current of res) {
    const currentPath = path.join(target, current)
    const isFile = fs.lstatSync(currentPath).isFile()
    if (isFile) {
      replaceTemplateVariables(currentPath, variables)
    } else {
      replaceTemplateAllFiles(currentPath, variables)
    }
  }
}

const copyFiles = async (ctx) => {
  const { appName, template } = ctx

  const target = path.join(process.cwd(), appName)

  await prepareDir(target)

  return Promise.all([
    // common
    await fs.copy(getSourceDir('common'), target),
    // specific
    await fs.copy(getSourceDir(template), target),
    // replace variables
    replaceTemplateAllFiles(target, ctx),
  ])
}

module.exports = {
  copyFiles,
  getSourceDir,
}
