import fs from 'fs'
import path from 'path'
import { prompt } from 'enquirer'
import { logRequireArgs } from './log'
import { getSourceDir } from './io'
import type { Flags } from '../gkd'

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

const getAllTemplates = () => {
  return fs
    .readdirSync(getSourceDir(''))
    .filter((template) => template !== 'common')
}

const validateArgs = async (appName: string, flags: Flags) => {
  if (!appName) {
    logRequireArgs('app-name')
    process.exit(1)
  }
  await checkOverwritten(appName)
  const allTemplates = getAllTemplates()
  if (!allTemplates.includes(flags.template)) {
    const response = await prompt<{ template: string }>({
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

export {
  validateArgs,
}
