import { prompt } from '../../utils/ask.js';
import {
	getDirectory,
	isValidFile,
	isValidDirectory,
	getConfig
} from '../utils.js';
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
	await createPostAbstract(props);
	await createPostService(props);
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
 * This function creates a post abstraction for the
 * custom post type just created.
 *
 * @since 1.0.0
 *
 * @param {Object} props
 * @returns {Promise<void>}
 */
const createPostAbstract = async () => {
	const { textDomain, namespace, underscore } = await getConfig();

	if (await isValidFile('/inc/Abstracts/Post.php')) {
		return;
	}

	const filePath = path.join(__dirname, '../../repo/inc/Abstracts/Post.php');

	let fileContent = await fs.readFile(filePath, 'utf-8');
	fileContent = fileContent
		.replace(/\btext-domain\b/g, textDomain)
		.replace(/\bSculptPluginNamespace\b/g, namespace)
		.replace(/\bSculptPluginPackage\b/g, namespace)
		.replace(/\babstract_post_options\b/g, `${underscore}_post_options`)
		.replace(
			/\babstract_post_column_data\b/g,
			`${underscore}_post_column_data`
		)
		.replace(
			/\babstract_post_column_labels\b/g,
			`${underscore}_post_column_labels`
		);

	const newFilePath = path.join(
		await getDirectory('inc/Abstracts'),
		`Post.php`
	);

	await fs.writeFile(newFilePath, fileContent, 'utf-8');
};

/**
 * Create Post.
 *
 * This function creates a post service for the
 * custom post type just created.
 *
 * @since 1.0.0
 *
 * @param {Object} props
 * @returns {Promise<void>}
 */
const createPostService = async () => {
	const { textDomain, namespace, underscore } = await getConfig();

	if (await isValidFile('/inc/Services/Post.php')) {
		return;
	}

	const filePath = path.join(__dirname, '../../repo/inc/Services/Post.php');

	let fileContent = await fs.readFile(filePath, 'utf-8');
	fileContent = fileContent
		.replace(/\btext-domain\b/g, textDomain)
		.replace(/\bSculptPluginNamespace\b/g, namespace)
		.replace(/\bSculptPluginPackage\b/g, namespace)
		.replace(/\bsculpt_post_types\b/g, `${underscore}_post_types`);

	const newFilePath = path.join(
		await getDirectory('inc/Services'),
		`Post.php`
	);

	await fs.writeFile(newFilePath, fileContent, 'utf-8');
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
