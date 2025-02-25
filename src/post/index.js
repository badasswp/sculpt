import { prompt } from '../../utils/ask.js';
import { getPostPrompts } from '../prompts.js';

import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

/**
 * sculptPost
 *
 * Prompts the user for information to generate a Custom Post Type.
 *
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

	try {
		// Get the script's absolute directory.
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);

		// Read the template file from the script's location.
		const templatePath = path.join(
			__dirname,
			'../../templates',
			'PostTemplate.php'
		);
		const templateContent = await fs.readFile(templatePath, 'utf-8');

		// Replace text verbiage with post type properties.
		const newContent = templateContent
			.replace(/\bSculpt\b/g, cpt.singular)
			.replace(/\bcpt\b/g, cpt.name.toLowerCase())
			.replace(/\bSingular_Label\b/g, cpt.singular)
			.replace(/\bPlural_Label\b/g, cpt.plural)
			.replace(/\btext_domain\b/g, 'obo');

		// Define new file path.
		const newFilePath = path.join(process.cwd(), `${cpt.singular}.php`);

		// Write the modified content to the new file.
		await fs.writeFile(newFilePath, newContent, 'utf-8');
		console.log(`Custom post type created: ${newFilePath}`);
	} catch (error) {
		console.error('Error creating file:', error);
	}
};

export default sculptPost;
