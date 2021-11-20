import meow from 'meow'
import { logSuccess } from './utils/log'
import { validateArgs } from './utils/validator'
import { startDownload } from './utils/io'
import { Flags } from './types'

export async function gkd(input: string[], flags: Flags) {
  const ctx = await validateArgs(input[0], flags)
  const { appName } = ctx

  await startDownload(ctx)

  logSuccess(appName)
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
