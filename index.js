#!/usr/bin/env node

/**
 * sculpt-cli
 *
 * A CLI tool for sculpting WP plugins quickly.
 *
 * @author badasswp <https://github.com/badasswp>
 */
import cli from './utils/cli.js';
import init from './utils/init.js';

import sculptPost from './src/post/index.js';
import sculptPlugin from './src/plugin/index.js';

const { flags, input, showHelp } = cli;
const { clear } = flags;

(async () => {
	await init({ clear });
	input.includes(`post`) && sculptPost();
	input.includes(`plugin`) && sculptPlugin();
	input.includes(`help`) && showHelp(0);
})();
