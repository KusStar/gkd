'use strict'

const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const { isYarn } = require('is-npm')

const _logPackageScripts = (appName) => {
  try {
    const target = path.join(process.cwd(), appName, 'package.json')
    const raw = fs.readFileSync(target, { encoding: 'utf8' })
    const json = JSON.parse(raw)
    const scripts = Object.entries(json.scripts)
    // log
    console.log(chalk.bold.underline.greenBright(`Scripts:`))
    console.log()
    for (const [key, value] of scripts) {
      console.log(`> ${isYarn ? 'yarn' : 'npm'} run ${chalk.bold(key)}`)
      console.log(`      ${chalk.gray(value)}`)
      console.log()
    }
  } catch (_) {
    // just catch
  }
}

const logSuccess = (appName) => {
  console.log()
  console.log(chalk.bold.underline.greenBright(`Start:`))
  console.log()
  console.log(`> cd ${appName}`)
  console.log(`> ls -al`)
  console.log()
  _logPackageScripts(appName)
  console.log()
}

const logRequireArgs = (...args) => {
  for (const arg of args) {
    console.log()
    console.log(`${chalk.red('X')} ${chalk.cyan(arg)} is required`)
    console.log()
  }
}

module.exports = {
  logSuccess,
  logRequireArgs,
}
