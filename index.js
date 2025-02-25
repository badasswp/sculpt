#!/usr/bin/env node

/**
 * sculpt-cli
 *
 * A CLI tool for sculpting WP plugins quickly.
 *
 * @author badasswp <https://github.com/badasswp>
 */

import readline from 'node:readline';

import cli from './utils/cli.js';
import init from './utils/init.js';
import log from './utils/log.js';

const { flags, input, showHelp } = cli;
const { clear, debug } = flags;

const sculptPost = () => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	const cpt = {};

	rl.question(`What's the name of your Custom Post Type? `, name => {
		cpt.name = name;
		rl.close();
	});

	console.log(`Hi ${cpt.name}!`);
};

(async () => {
	await init({ clear });

	input.includes(`post`) && sculptPost();

	debug && log(flags);
	input.includes(`help`) && showHelp(0);
})();
