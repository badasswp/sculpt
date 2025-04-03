import { prompt } from '../../utils/ask.js';
import { getDirectory, isValidDirectory } from '../utils.js';
import { getPostPrompts, getPostDefaults } from './utils.js';

import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

/**
 * Sculpt Post.
 *
 * This function retrieves the post properties/params and then
 * goes ahead to create the Post.
 *
 * @since 1.0.0
 * @returns {Promise<void>}
 */
const sculptPost = async () => {
	const props = await getPostProps();

	if (!props.name) {
		console.error(
			"Error: 'name' is required to create a custom post type."
		);
		return;
	}

	createPost(props);
};

/**
 * Get Post Properties.
 *
 * This function prompts the user for information
 * and returns an object containing the user's choices.
 *
 * @since 1.0.0
 *
 * @returns {Promise<Object>} Props.
 */
const getPostProps = async () => {
	const props = {};
	const cli = prompt();

	for (const [key, question] of Object.entries(getPostPrompts())) {
		props[key] = await cli.ask(question);
	}

	cli.close();

	return props;
};

/**
 * Create Post.
 *
 * This function creates a new custom post type based on the
 * provided custom post type properties.
 *
 * @since 1.0.0
 *
 * @param {Object} props
 * @returns {Promise<void>}
 */
const createPost = async props => {
	if (!isValidDirectory()) {
		console.error('Error: Not a valid Sculpt plugin directory.');
		return;
	}

	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

	const templatePath = path.join(__dirname, '../../repo/Posts', 'Post.php');
	const templateContent = await fs.readFile(templatePath, 'utf-8');

	const newContent = templateContent
		.replace(/\bSculpt\b/g, singular)
		.replace(/\bprops\b/g, name.toLowerCase())
		.replace(/\bSingular_Label\b/g, singular)
		.replace(/\bPlural_Label\b/g, plural)
		.replace(/\btext_domain\b/g, 'obo');

	const newFilePath = path.join(process.cwd(), `${singular}.php`);
	await fs.writeFile(newFilePath, newContent, 'utf-8');

	console.log(`Custom post type created: ${newFilePath}`);
};

export default sculptPost;
