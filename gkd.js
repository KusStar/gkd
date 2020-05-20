const path = require('path');
const Listr = require('listr');
const fs = require('fs-extra');
const chalk = require('chalk');
const { isYarn } = require('is-npm');

const getFromDir = (root) => 
	path.join(__dirname, 'templates', root);

const prepareDir = async (dir) => {
	const exists = await fs.exists(dir)
	if (exists) {
		await fs.remove(dir)
	}
	await fs.mkdir(dir)
}

const replaceWithTemplate = async (from, variables) => {
	const source = await fs.readFile(from, 'utf8');
	let generatedSource = source;

	if (typeof variables === 'object') {
		const { appName, author } = variables
		generatedSource = generatedSource
			.replace(/%NAME%/g, appName)
			.replace(/%AUTHOR%/g, author.name)
			.replace(/%PAGE%/g, author.page)
			.replace(/%YEAR%/g, new Date().getFullYear());
	}

	await fs.writeFile(from, generatedSource);
}

const replaceVariablesRecursive = async (target, variables) => {
	const res = await fs.readdir(target)
	
	for (const curr of res) {
		const file = path.join(target, curr)
		const isFile = fs.lstatSync(file).isFile()
		if (isFile) {
			replaceWithTemplate(file, variables)
		} else {
			replaceVariablesRecursive(path.join(target, curr), variables)
		}
	}
}

const copyFiles = async (variables) => {
	const { appName, template } = variables;
	
	const target = path.join(process.cwd(), appName);

	await prepareDir(target);

	return Promise.all([
		// common
		await fs.copy(getFromDir('common'), target),
		// specific
		await fs.copy(getFromDir(template), target),
		// replace Variables
		replaceVariablesRecursive(target, variables)
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
		return;
	}
}

const logSuccess = (appName) => {
	console.log();
	console.log(chalk.bold.underline.greenBright(`Installation:`));
	console.log();
	console.log(`> cd ${appName}`);
	console.log(`> ${isYarn ? 'yarn' : 'npm'} install`);
	console.log();
	logPackageScripts(appName)
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

	return tasks.run().then(() => logSuccess(appName));
};
