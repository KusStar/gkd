import Listr from 'listr'
import chalk from 'chalk'
import meow from 'meow'
import { logSuccess } from './utils/log'
import { validateArgs } from './utils/validator'
import { copyFiles } from './utils/io'
import { Flags } from './types'

export async function gkd(input: string[], flags: Flags) {
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
    .catch((error: Error) => {
      console.error(error.stack)
      process.exit(1)
    })
}

export const createCli = () => {
  const cli = meow(
    `
    Usage
        $ gkd app-name [options]

    Options
        --help
        --template -t
        --author.name
        --author.page

    Examples
        $ gkd --help
        $ gkd app-name -t react-ts-webpack
    `,
    {
      flags: {
        template: {
          type: 'string',
          alias: 't',
        },
        ['author.name']: {
          type: 'string',
          default: 'KusStar',
        },
        ['author.page']: {
          type: 'string',
          default: 'https://github.com/KusStar',
        },
      },
    }
  )

  // @ts-ignore
  gkd(cli.input, cli.flags)
}
