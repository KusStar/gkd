import fs from 'fs-extra'
import ignore from 'ignore'
import path from 'path'

import { checkOverwritten } from '../shared'
import { createTmpDir, defaultIgnores, generateTo } from './utils'

export interface Options {
  ignore?: string[]
}

export const generate = async (from: string, to: string, options: Options = {}) => {
  if (to === from) {
    console.log('gkd: target path cannot be the same as source path')
    process.exit(1)
  }
  const { tmpDir, clean } = createTmpDir('kuss__gkd')
  const originalFrom = from === '.' ? path.basename(process.cwd()) : from

  if (!tmpDir) {
    console.log('gkd: cannot create temporary directory')
    process.exit(1)
  }

  if (from) {
    fs.copySync(from, tmpDir)
    from = tmpDir
  }

  await checkOverwritten(to)

  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true })
  } else {
    fs.removeSync(to)
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

  clean()

  console.log(`gkd: Generated template from ${originalFrom} to ${to} `)
}
