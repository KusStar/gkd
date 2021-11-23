import fs from 'fs'
import ignore from 'ignore'
import path from 'path'

import { checkOverwritten } from '../shared'
import { defaultIgnores, generateTo } from './utils'

export interface Options {
  ignore?: string[]
}

export const generate = async (to: string, from: string, options: Options = {}) => {
  if (to === from) {
    console.log('gkd: target path cannot be the same as source path')
    process.exit(1)
  }

  await checkOverwritten(to)

  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true })
  } else {
    fs.rmSync(to, { recursive: true, force: true })
    fs.mkdirSync(to, { recursive: true })
  }

  const ig = ignore().add(defaultIgnores)

  const ignoreFile = path.join(from, '.gitignore')

  if (fs.existsSync(ignoreFile)) {
    const ignores = fs.readFileSync(ignoreFile, 'utf8')
    ig.add(ignores)
  }

  if (options.ignore) {
    ig.add(options.ignore)
  }

  generateTo(from, to, ig, true)

  console.log(`gkd: Generate template ${to} from ${from} done`)
  console.log(`gkd: at ${path.relative(process.cwd(), to)}`)
}
