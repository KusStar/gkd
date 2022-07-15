import { hideBin } from 'yargs/helpers'
import yargs from 'yargs/yargs'

import { config, ConfigKey } from './config'
import { generate } from './generate'
import { init } from './init'

export const createCli = () => {
  yargs(hideBin(process.argv))
    .scriptName('gkd')
    .command(['init <name>', 'create'], 'Initial with template', (Argv) => {
      return Argv
        .positional('name', {
          describe: 'Name to init',
          type: 'string'
        })
    }, (argv) => {
      if (argv.name) {
        init(argv.name)
      }
    })
    .command(['generate <from> <to>', 'gen'], 'Generate template from source', (Argv) => {
      return Argv
        .positional('from', {
          describe: 'Path to source path',
          type: 'string'
        })
        .positional('to', {
          describe: 'Path to generated template',
          type: 'string'
        })
        .option('ignore', {
          alias: 'i',
          describe: 'Ignore files, patterns are like: -i README.md LICENSE',
          type: 'array'
        })
    }, (argv) => {
      if (argv.to && argv.from) {
        generate(argv.to, argv.from, {
          ignore: argv.ignore?.map(it => it.toString())
        })
      }
    })
    .command('config <operate> [key] [value]', 'Get or set config', (Argv) => {
      return Argv
        .positional('operate', {
          type: 'string'
        })
        .positional('key', {
          type: 'string'
        })
        .positional('value', {
          type: 'string'
        })
    }, (argv) => {
      if (argv.operate) {
        config(argv.operate, argv.key as ConfigKey, argv.value)
      }
    })
    .demandCommand(1, 'You need to provide a command')
    .version()
    .parse()
}
