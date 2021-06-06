'use strict'
const Listr = require('listr')
const chalk = require('chalk')
const { logSuccess } = require('./utils/log')
const { validateArgs } = require('./utils/validator')
const { copyFiles } = require('./utils/io')

module.exports = async (input, flags) => {
  const ctx = await validateArgs(input[0], flags)
  const { appName, template } = ctx
  const tasks = new Listr([
    {
      title: `Generate template: ${chalk.cyan(template)}`,
      task: () => null,
    },
    {
      title: 'Copy files',
      task: () => copyFiles(ctx),
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
