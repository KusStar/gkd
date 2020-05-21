const path = require('path');
const Listr = require('listr');
const fs = require('fs-extra');
const chalk = require('chalk');
const { isYarn } = require('is-npm');

const prepareDir = async (dir) => {
  const exists = await fs.exists(dir);
  if (exists) {
    await fs.remove(dir);
  }
  await fs.mkdir(dir);
}

const replaceTemplateVariables = async (from, variables) => {
  const source = await fs.readFile(from, 'utf8');

  const variablesRegex = /%NAME%|%AUTHOR%|%PAGE%|%YEAR%/g;
  if (!source.match(variablesRegex)) {
    return;
  }

  if (typeof variables === 'object') {
    const { appName, author } = variables;
    const generatedSource = source
      .replace(/%NAME%/g, appName)
      .replace(/%AUTHOR%/g, author.name)
      .replace(/%PAGE%/g, author.page)
      .replace(/%YEAR%/g, new Date().getFullYear());

    await fs.writeFile(from, generatedSource);
  }
}

const replaceTemplateAllFiles = async (target, variables) => {
  const res = await fs.readdir(target);
  for (const current of res) {
    const currentPath = path.join(target, current);
    const isFile = fs.lstatSync(currentPath).isFile();
    if (isFile) {
      replaceTemplateVariables(currentPath, variables);
    } else {
      replaceTemplateAllFiles(currentPath, variables);
    }
  }
}

const copyFiles = async (variables) => {
  const getSourceDir = (root) =>
    path.join(__dirname, 'templates', root);

  const { appName, template } = variables;

  const target = path.join(process.cwd(), appName);

  await prepareDir(target);

  return Promise.all([
    // common
    await fs.copy(getSourceDir('common'), target),
    // specific
    await fs.copy(getSourceDir(template), target),
    // replace variables
    replaceTemplateAllFiles(target, variables)
  ]);
}

const logPackageScripts = (appName) => {
  try {
    const target = path.join(process.cwd(), appName, 'package.json');
    const raw = fs.readFileSync(target, { encoding: 'utf8' });
    const json = JSON.parse(raw);
    const scripts = Object.keys(json.scripts);
    // log
    console.log(chalk.bold.underline.greenBright(`Scripts:`));
    console.log();
    for (const script of scripts) {
      console.log(`> ${isYarn ? 'yarn' : 'npm'} run ${chalk.bold(script)}`);
    }
  } catch(_) {
    // just catch
  }
}

const logSuccess = (appName) => {
  console.log();
  console.log(chalk.bold.underline.greenBright(`Installation:`));
  console.log();
  console.log(`> cd ${appName}`);
  console.log(`> ${isYarn ? 'yarn' : 'npm'} install`);
  console.log();
  logPackageScripts(appName);
  console.log();
}

module.exports = (input, flags) => {
  const appName = input[0] || 'app-name'
  const { template, author } = flags
  const variables = {
    appName,
    template,
    author,
    template
  }
  const tasks = new Listr([
    {
      title: 'Copy files',
      task: () => copyFiles(variables)
    },
    {
      title: 'Success',
      task: () => console.log()
    },
  ]);

  tasks.run()
    .then(() => logSuccess(appName))
    .catch(error => {
      console.error(error.stack);
      process.exit(1);
  });
};
