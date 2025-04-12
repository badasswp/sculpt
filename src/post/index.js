import { prompt } from '../../utils/ask.js';
import { getDirectory, isValidDirectory, getConfig } from '../utils.js';
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

	await createPostType(props);
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
const createPostType = async props => {
	if (!(await isValidDirectory())) {
		console.error('Error: Not a valid Sculpt plugin directory.');
		return;
	}

	const { name } = props;
	const postProps = { ...getPostDefaults(name), ...props };
	const { singular, plural, supports, slug, showInRest, showInMenu } =
		postProps;

	const { textDomain, namespace } = await getConfig();
	const filePath = path.join(__dirname, '../../repo/inc/Posts/Post.php');

	let fileContent = await fs.readFile(filePath, 'utf-8');
	fileContent = fileContent
		.replace(/\bSculptPostName\b/g, name)
		.replace(/\bSculptPostSingularLabel\b/g, singular)
		.replace(/\bSculptPostPluralLabel\b/g, plural)
		.replace(/\bSculptPostSupport\b/g, supports)
		.replace(/\bSculptPostSlug\b/g, slug)
		.replace(/\bSculptPostIsVisibleInMenu\b/g, showInMenu)
		.replace(/\bSculptPostIsVisibleInRest\b/g, showInRest)
		.replace(/\btext-domain\b/g, textDomain)
		.replace(/\bSculptPluginNamespace\b/g, namespace)
		.replace(/\bSculptPluginPackage\b/g, namespace);

	const newFilePath = path.join(
		await getDirectory('inc/Posts'),
		`${singular}.php`
	);

	await fs.writeFile(newFilePath, fileContent, 'utf-8');
	console.log(`Custom post type created: ${singular}`);
};

export default sculptPost;
