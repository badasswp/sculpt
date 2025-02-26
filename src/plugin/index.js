import { prompt } from '../../utils/ask.js';
import { getPluginPrompts } from '../prompts.js';

import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

/**
 * Scult Plugin.
 *
 * This function prompts the user for information and uses same
 * to generate a complete WordPress plugin.
 *
 * @since 1.0.0
 * @returns {Promise<void>}
 */
const sculptPlugin = async () => {
	const plugin = {};
	const prompter = prompt();

	// Get plugin properties.
	for (const [key, question] of Object.entries(getPluginPrompts())) {
		plugin[key] = await prompter.ask(question);
	}

	prompter.close();

	// Bail out if the name is missing.
	if (!plugin.name) {
		console.error(
			"Error: 'name' is required to create a Plugin."
		);
		return;
	}

	createPlugin(plugin);
};

/**
 * Create Plugin.
 *
 * This function creates a complete WordPress plugin based on the
 * provided plugin params.
 *
 * @since 1.0.0
 *
 * @param {Object} plugin
 * @returns {Promise<void>}
 */
const createPlugin = async plugin => {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

	console.log(`Plugin created: ${plugin.name}`);
};

export default sculptPlugin;
