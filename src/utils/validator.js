const fs = require('fs')
const path = require('path')
const { prompt } = require('enquirer')
const { logRequireArgs } = require('./log')
const { getSourceDir } = require('./io')

const checkOverwritten = async (appName) => {
  const target = path.join(process.cwd(), appName)
  if (fs.existsSync(target)) {
    const { shouldOverwrite } = await prompt({
      type: 'confirm',
      name: 'shouldOverwrite',
      message: `${appName} already exists, overwrite it?`,
      initial: 'y',
    })
    if (!shouldOverwrite) {
      process.exit(1)
    }
  }
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
  await checkOverwritten(appName)
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

module.exports = {
  validateArgs,
}
