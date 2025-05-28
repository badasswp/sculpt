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

import sculptAsset from './src/asset/index.js';
import sculptMeta from './src/meta/index.js';
import sculptPlugin from './src/plugin/index.js';
import sculptPost from './src/post/index.js';
import sculptService from './src/service/index.js';
import sculptTaxonomy from './src/taxonomy/index.js';

const { flags, input, showHelp } = cli;
const { clear } = flags;

(async () => {
	await init({ clear });
	input.includes(`asset`) && sculptAsset();
	input.includes(`meta`) && sculptMeta();
	input.includes(`plugin`) && sculptPlugin();
	input.includes(`post`) && sculptPost();
	input.includes(`service`) && sculptService();
	input.includes(`taxonomy`) && sculptTaxonomy();
	input.includes(`help`) && showHelp(0);
})();
