'use strict'

const path = require('path')
const Listr = require('listr')
const fs = require('fs-extra')
const chalk = require('chalk')
const { prompt } = require('enquirer')
const { logSuccess, logRequireArgs } = require('./utils')

const getSourceDir = (root) => path.join(__dirname, '../templates', root)

const prepareDir = async (dir) => {
  const exists = await fs.exists(dir)
  if (exists) {
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

const copyFiles = async (variables) => {
  const { appName, template } = variables

  const target = path.join(process.cwd(), appName)

  await prepareDir(target)

  return Promise.all([
    // common
    await fs.copy(getSourceDir('common'), target),
    // specific
    await fs.copy(getSourceDir(template), target),
    // replace variables
    replaceTemplateAllFiles(target, variables),
  ])
}

const getAllTemplates = () => {
  return fs
    .readdirSync(getSourceDir(''))
    .filter((template) => template !== 'common')
}

const validateArgs = async (appName, flags) => {
  if (!appName) {
    logRequireArgs('app-name')
    process.exit(1)
  }
  const allTemplates = getAllTemplates()
  if (!allTemplates.includes(flags.template)) {
    const response = await prompt({
      type: 'select',
      name: 'template',
      message: 'Which template do you want to generate?',
      choices: allTemplates,
    })
    flags.template = response.template
  }
  return {
    appName,
    ...flags,
  }
}

module.exports = async (input, flags) => {
  const variables = await validateArgs(input[0], flags)
  const { appName, template } = variables
  const tasks = new Listr([
    {
      title: `Generate template: ${chalk.cyan(template)}`,
      task: () => null,
    },
    {
      title: 'Copy files',
      task: () => copyFiles(variables),
    },
    {
      title: 'Success',
      task: () => console.log(),
    },
  ])

  tasks
    .run()
    .then(() => logSuccess(appName))
    .catch((error) => {
      console.error(error.stack)
      process.exit(1)
    })
}
