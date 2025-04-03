import { prompt } from '../../utils/ask.js';
import { getDirectory, isValidDirectory } from '../utils.js';
import { getPostPrompts, getPostDefaults } from './utils.js';

import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
		const value = await cli.ask(question);

		if (value) {
			props[key] = value;
		}
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

	const { name } = props;
	const postProps = { ...getPostDefaults(name), ...props };
	const {
		description,
		singular,
		plural,
		icon,
		supports,
		taxonomies,
		hasArchive,
		public: PublicPost,
		showInRest,
		restBase,
		restController
	} = postProps;

	const filePath = path.join(__dirname, '../../repo/inc/Posts/Post.php');
	let fileContent = await fs.readFile(filePath, 'utf-8');

	fileContent
		.replace(/\bSculptPostClass\b/g, name)
		.replace(/\bSculptPostSingular\b/g, singular)
		.replace(/\bprops\b/g, name.toLowerCase())
		.replace(/\bSingular_Label\b/g, singular)
		.replace(/\bPlural_Label\b/g, plural)
		.replace(/\btext_domain\b/g, 'obo');

	const newFilePath = path.join(
		await getDirectory('inc/Post'),
		`${singular}.php`
	);

	await fs.writeFile(newFilePath, fileContent, 'utf-8');
	console.log(`Custom post type created: ${singular}`);
};

export default sculptPost;
