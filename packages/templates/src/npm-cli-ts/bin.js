#! /usr/bin/env node

import cac from 'cac'
import { start } from './dist/index.js'
import updateNotifier from 'update-notifier'
import { readFile } from 'fs/promises';

const pkgJSON = JSON.parse(await readFile(new URL('./package.json', import.meta.url)));

updateNotifier({pkg: pkgJSON}).notify();

const cli = cac('<%- name %>')

cli.command('url', 'Open url in Android/iOS simulator')

cli.option('--only-android', 'Only open url in Android through ADB', {
  default: false
})
cli.option('--only-ios', 'Only open url in iOS Simulator', {
  default: false
})

cli.help()

const parsed = cli.parse()

const { args, h } = parsed

const main = async () => {
  if (h) {
    return
  }
  const name = args[0]

  start(name)
}

main()
