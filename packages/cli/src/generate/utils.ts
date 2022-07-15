import fs from 'fs-extra'
import ignore, { Ignore } from 'ignore'
import path from 'path'
import sortPackageJson from 'sort-package-json'
import os from 'os'

export const defaultIgnores = ignore()
  .add(['.git', 'CHANGELOG.md', 'README.md', 'LICENSE', "node_modules", "*.log", "pnpm-lock.yaml", "yarn.lock", "package-lock.json"])

const ctx = {
  name: null
}
const recompile = (content: string, name: string) => {
  if (name === 'package.json') {
    const pkg = JSON.parse(content)
    if (pkg.name) {
      ctx.name = pkg.name
    }
    pkg.name = '<%- name %>'
    pkg.author = '<%- author.name %> (<%- author.page %>)'
    pkg.version = '<%- version %>'
    pkg.homepage = '<%- author.page %>/<%- name %>#readme'
    content = JSON.stringify(sortPackageJson(pkg), null, 2)
  } else {
    if (ctx.name) {
      const re = new RegExp(ctx.name, 'g')
      content = content.replace(re, '<%- name %>')
    }
  }
  return content
}

const processFile = (fromFile: string, toFile: string, name: string) => {
  const content = fs.readFileSync(fromFile, 'utf-8')

  const final = recompile(content, name)

  fs.writeFileSync(toFile, final)
}

export const generateTo = (from: string, to: string, ig: Ignore, root = false) => {
  const names = fs.readdirSync(from)

  if (root) {
    // hoist package.json
    const pkgIndex = names.indexOf('package.json')
    if (pkgIndex >= 0) {
      [names[0], names[pkgIndex]] = [names[pkgIndex], names[0]]
    }
  }

  for (const name of names) {
    const curFrom = path.join(from, name)
    const curTarget = path.join(to, name)
    const stat = fs.statSync(curFrom)
    if (ig.ignores(name)) {
      continue
    }
    if (stat.isDirectory()) {
      fs.mkdirSync(curTarget, { recursive: true })
      generateTo(curFrom, curTarget, ig)
    } else {
      processFile(curFrom, curTarget, name)
    }
  }
}

export const createTmpDir = (appPrefix: string) => {
  try {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix));
    const clean = () => {
      try {
        if (tmpDir) {
          fs.removeSync(tmpDir);
        }
      }
      catch (e) {
        console.error(`An error has occurred while removing the temp folder at ${tmpDir}. Please remove it manually. Error: ${e}`);
      }
    }
    return {
      tmpDir,
      clean,
    };
  } catch {
    return {}
  }
}
