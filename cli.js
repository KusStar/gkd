#!/usr/bin/env node
const meow = require('meow');
const gkd = require('./gkd.js');

const cli = meow(`
		Usage
				$ gkd app-name [options]
			
		Options
				--help
				--template -t
				--author.name
				--author.page

		Examples
				$ gkd --help
				$ gkd app-name -t react-ts-webpack-template
				$ gkd app-name -t react-ts-webpack-template
	`,
	{
		flags: {
			template: {
				type: 'string',
				alias: 't'
			},
			['author.name']: {
				type: 'string',
				default: 'KusStar',
			},
			['author.page']: {
				type: 'string',
				default: 'https://github.com/KusStar',
			},
		}
	}
);

gkd(cli.input, cli.flags).catch(error => {
	console.error(error.stack);
	process.exit(1);
});
