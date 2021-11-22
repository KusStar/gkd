import { get, set } from 'dot-prop'
import fs from 'fs'
import path from 'path'

export interface Config {
  name: string;
  author: {
    name: string;
    page: string;
  }
}

export type ConfigKey = DotBranch<Config>

export const CONFIG_PATH = path.join(__dirname, '../config.json')

export const loadConfig = (): Config => {
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
}

export const saveConfig = (config: Config) => {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2))
}

export const config = (op: string, key?: ConfigKey, value?: string) => {
  const config = loadConfig()
  if (op === 'get') {
    if (key) {
      console.log(get(config, key))
    } else {
      console.log(config)
    }
  } else if (op === 'set') {
    if (key) {
      set(config, key, value)
      saveConfig(config)
      console.log(`gkd: config[\`${key}\`] is set to ${value}`)
    } else {
      console.log(`gkd: ${key} is invalid`)
    }
  } else {
    console.log('unknown operation')
  }
}
