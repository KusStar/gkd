import { initContext, startDownload } from './utils'
import { logSuccess } from './utils/log'

export async function init(name: string, cb = (name: string) => logSuccess(name)) {
  const ctx = await initContext(name)

  await startDownload(ctx)

  cb(name)
}
