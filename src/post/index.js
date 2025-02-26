import { prompt } from '../../utils/ask.js';
import { getPostPrompts } from '../prompts.js';

import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

/**
 * Sculpt Post.
 *
 * This function prompts the user for information and uses same
 * to generate a Custom Post Type.
 *
 * @since 1.0.0
 * @returns {Promise<void>}
 */
const sculptPost = async () => {
	const cpt = {};
	const prompter = prompt();

	// Get custom post type properties.
	for (const [key, question] of Object.entries(getPostPrompts())) {
		cpt[key] = await prompter.ask(question);
	}

	prompter.close();

	// Bail out if the name is missing.
	if (!cpt.name) {
		console.error(
			"Error: 'name' is required to create the custom post type."
		);
		return;
	}

	createPost(cpt);
};

/**
 * Create Post.
 *
 * This function creates a new custom post type file based on the provided
 * custom post type properties.
 *
 * @since 1.0.0
 *
 * @param {Object} cpt
 * @returns {Promise<void>}
 */
const createPost = async cpt => {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

	const templatePath = path.join(__dirname, '../../repo/Posts', 'Post.php');
	const templateContent = await fs.readFile(templatePath, 'utf-8');

	const newContent = templateContent
		.replace(/\bSculpt\b/g, cpt.singular)
		.replace(/\bcpt\b/g, cpt.name.toLowerCase())
		.replace(/\bSingular_Label\b/g, cpt.singular)
		.replace(/\bPlural_Label\b/g, cpt.plural)
		.replace(/\btext_domain\b/g, 'obo');

	const newFilePath = path.join(process.cwd(), `${cpt.singular}.php`);
	await fs.writeFile(newFilePath, newContent, 'utf-8');

	console.log(`Custom post type created: ${newFilePath}`);
};

export default sculptPost;
