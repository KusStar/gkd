import fs from 'node:fs'
import path from 'node:path'
import { prompt } from 'enquirer'
import ora from 'ora'
import { logRequireArgs } from './log'
import { getAllTemplates } from './utils'
import { Flags } from '../types'

const checkOverwritten = async (appName: string) => {
  const target = path.join(process.cwd(), appName)
  if (fs.existsSync(target)) {
    const { shouldOverwrite } = await prompt<{ shouldOverwrite: boolean }>({
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

const validateArgs = async (appName: string, flags: Flags) => {
  if (!appName) {
    logRequireArgs('app-name')
    process.exit(1)
  }
  await checkOverwritten(appName)
  const spinner = ora('Fetching templates...').start()
  const allTemplates = await getAllTemplates()
  spinner.stop()
  if (!allTemplates.includes(flags.template)) {
    try {
      const response = await prompt<{ template: string }>({
        type: 'select',
        name: 'template',
        message: 'Which template do you want to generate?',
        choices: allTemplates,
      })
      flags.template = response.template

    } catch (e) {
      console.log('Not selected')
      process.exit(1)
    }
  }
  return {
    appName,
    ...flags,
  }
}

export {
  validateArgs,
}
