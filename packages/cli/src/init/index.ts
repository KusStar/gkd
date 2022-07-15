import { initContext, startDownload } from './utils'
import { logSuccess } from './utils/log'
import { basename } from 'path';

export async function init(name: string, cb = (name: string) => logSuccess(name)) {
  const ctx = await initContext(name)

  await startDownload(ctx)

  if (name === '.') {
    name = basename(process.cwd())
  }

  cb(name)
}
