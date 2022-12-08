import type { Config } from '../config'

export interface Context {
  name: string
  template: string
  author: Config['author']
}
