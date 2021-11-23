import { prompt } from 'enquirer'
import fs from 'fs'
import path from 'path'

export const checkOverwritten = async (name: string) => {
  const SKIP = 'gkd: No overwrite, skip'
  const target = path.join(process.cwd(), name)
  if (fs.existsSync(target)) {
    try {
      const { shouldOverwrite } = await prompt<{ shouldOverwrite: boolean }>({
        type: 'confirm',
        name: 'shouldOverwrite',
        message: `${name} already exists, overwrite it?`,
        initial: 'y'
      })
      if (!shouldOverwrite) {
        console.log(SKIP)
        process.exit(1)
      }
    } catch (e) {
      console.log(SKIP)
      process.exit(1)
    }
  }
}
