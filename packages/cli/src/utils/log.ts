import fs from 'node:fs'
import path from 'node:path'
import chalk from 'chalk'

const _logPackageScripts = (appName: string) => {
  try {
    const target = path.join(process.cwd(), appName, 'package.json')
    const raw = fs.readFileSync(target, { encoding: 'utf8' })
    const json = JSON.parse(raw)
    const scripts = Object.entries(json.scripts)
    // log
    console.log(chalk.bold.underline.greenBright(`Scripts:`))
    console.log()
    for (const [key, value] of scripts) {
      console.log(`> npm run ${chalk.bold(key)}`)
      console.log(`      ${chalk.gray(value)}`)
      console.log()
    }
  } catch (_) {
    // just catch
  }
}

const logSuccess = (appName: string) => {
  console.log()
  console.log(chalk.bold.underline.greenBright(`Start:`))
  console.log()
  console.log(`> cd ${appName}`)
  console.log(`> ls -al`)
  console.log()
  _logPackageScripts(appName)
  console.log()
}

const logRequireArgs = (...args: string[]) => {
  for (const arg of args) {
    console.log()
    console.log(`${chalk.red('X')} ${chalk.cyan(arg)} is required`)
    console.log()
  }
}

export {
  logSuccess,
  logRequireArgs,
}
