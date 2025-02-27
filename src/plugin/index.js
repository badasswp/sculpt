import { prompt } from '../../utils/ask.js';
import { getPluginPrompts } from '../prompts.js';

import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Sculpt Plugin.
 *
 * This function retrieves the plugin properties/params and then
 * goes ahead to create the Plugin.
 *
 * @since 1.0.0
 * @returns {Promise<void>}
 */
const sculptPlugin = async () => {
	const props = await getPluginProps();

	if (!props.name) {
		console.error("Error: 'name' is required to create a Plugin.");
		return;
	}

	if (!props.slug) {
		console.error("Error: 'slug' is required to create a Plugin.");
		return;
	}

	createPlugin(props);
};

/**
 * Get Plugin Properties.
 *
 * This function prompts the user for information
 * and returns an object containing the user's choices.
 *
 * @since 1.0.0
 *
 * @returns {Promise<Object>} Props.
 */
const getPluginProps = async () => {
	const props = {};
	const cli = prompt();

	for (const [key, question] of Object.entries(getPluginPrompts())) {
		props[key] = await cli.ask(question, 'placeholder');
	}

	cli.close();

	return props;
};

/**
 * Create Plugin.
 *
 * This function creates a WordPress plugin based on the
 * provided plugin params.
 *
 * @since 1.0.0
 *
 * @param {Object} props
 * @returns {Promise<void>}
 */
const createPlugin = async props => {
	createPluginDirectory(props);
	createComposer(props);

	console.log(`Plugin created: ${props.name}`);
};

export default sculptPlugin;

/**
 * Create Plugin Directory.
 *
 * This function creates the plugin directory
 * if it does not exist.
 *
 * @since 1.0.0
 *
 * @param {Object} props
 * @returns {Promise<void>}
 */
const createPluginDirectory = async props => {
	const { slug } = props;
	try {
		await fs.access(slug);
		console.log(`Plugin folder already exists: ${slug}`);
	} catch {
		await fs.mkdir(slug, { recursive: true });
		console.log(`Plugin folder created: ${slug}`);
	}
};

/**
 * Create Composer file.
 *
 * This function creates the Composer.json
 * file for the plugin.
 *
 * @since 1.0.0
 * @returns {Promise<void>}
 */
const createComposer = async props => {
	const { author, slug, description, namespace, email } = props;

	const composerPath = path.join(__dirname, '../../repo', 'composer.json');
	const composerContent = await fs.readFile(composerPath, 'utf-8');

	const newContent = composerContent
		.replace(/\bsculpt_user\/sculpt_plugin\b/g, `${author}/${slug}`)
		.replace(/\bSculptDescription\b/g, description)
		.replace(/\bSculptNamespace\b/g, namespace)
		.replace(/\bsculpt_user\b/g, author)
		.replace(/\bsculpt_email@yahoo.com\b/g, email);

	const newFilePath = path.join(process.cwd(), `${slug}/composer.json`);
	await fs.writeFile(newFilePath, newContent, 'utf-8');
};
