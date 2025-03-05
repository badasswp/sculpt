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

	createPlugin(props);
};

export default sculptPlugin;

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
export const getPluginProps = async () => {
	const props = {};
	const cli = prompt();

	for (const [key, question] of Object.entries(getPluginPrompts())) {
		props[key] = await cli.ask(question);
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
	await createPluginDirectory(props);
	await createPluginFiles(props);

	console.log(`Plugin created: ${props.name}`);
};

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
export const createPluginDirectory = async props => {
	const { name } = props;

	const getSlug = () => {
		return name.toLowerCase().replace(/\s/g, '-');
	};

	const slug = props.slug || getSlug();

	try {
		await fs.access(slug);
		console.log(`Plugin folder already exists: ${slug}`);
	} catch {
		await fs.mkdir(slug, { recursive: true });
		console.log(`Plugin folder created: ${slug}`);
	}
};

/**
 * Create Plugin files.
 *
 * This function grabs the list of plugin files and
 * creates them in the plugin directory.
 *
 * @since 1.0.0
 *
 * @param {Object} props
 * @returns {Promise<void>}
 */
export const createPluginFiles = async props => {
	const {
		name,
		author,
		authorEmail,
		authorUrl,
		url,
		spackage,
		domain,
		slug,
		description,
		namespace
	} = props;

	const {
		defaultDescription,
		defaultSlug,
		defaultPackage,
		defaultNamespace,
		defaultUrl,
		defaultDomain,
		defaultAuthor,
		defaultAuthorEmail,
		defaultAuthorUrl
	} = getPluginDefaults(name);

	getPluginFiles().forEach(async file => {
		const filePath = path.join(__dirname, '../../repo', file);
		let fileContent = await fs.readFile(filePath, 'utf-8');

		const theAuthor = author || defaultAuthor;
		const theSlug = slug || defaultSlug;
		const theNamespace = namespace || defaultNamespace;
		const theAutoload = name.toUpperCase().replace(/\s/g, '_');

		switch (file) {
			case 'composer.json':
				fileContent = fileContent
					.replace(
						/\bsculpt_user\/sculpt_plugin\b/g,
						`${theAuthor.toLowerCase().replace(/\s/g, '')}/${theSlug}`
					)
					.replace(
						/\bSculptDescription\b/g,
						description || defaultDescription
					)
					.replace(
						/\bSculptNamespace\b/g,
						namespace || defaultNamespace
					)
					.replace(/\bsculpt_user\b/g, author || defaultAuthor)
					.replace(
						/\bsculpt_email@yahoo.com\b/g,
						authorEmail || defaultAuthorEmail
					);
				break;

			case 'plugin.php':
				fileContent = fileContent
					.replace(/\bSculptPluginName\b/g, name)
					.replace(/\bSculptPluginURL\b/g, url || defaultUrl)
					.replace(
						/\bSculptPluginDescription\b/g,
						description || defaultDescription
					)
					.replace(/\bSculptPluginVersion\b/g, `1.0.0`)
					.replace(/\bSculptPluginAuthor\b/g, author || defaultAuthor)
					.replace(
						/\bSculptPluginAuthorURI\b/g,
						authorUrl || defaultAuthorUrl
					)
					.replace(/\bSculptPackage\b/g, spackage || defaultPackage)
					.replace(
						/\bSculptAuthorNamespace\b/g,
						`${theAuthor.toLowerCase().replace(/\s/g, '')}\\${theNamespace}`
					)
					.replace(/\bSCULPT_AUTOLOAD\b/g, `${theAutoload}_AUTOLOAD`)
					.replace(
						/\bSculptPluginAbsoluteNamespace\b/g,
						`\\${theNamespace}\\Plugin`
					)
					.replace(/\btext-domain\b/g, domain || defaultDomain);
				break;

			case 'phpcs.xml':
				fileContent = fileContent.replace(
					/\bSculptNamespace\b/g,
					namespace || defaultNamespace
				);
				break;
		}

		const newFilePath = path.join(process.cwd(), `${theSlug}/${file}`);
		await fs.writeFile(newFilePath, fileContent, 'utf-8');
	});
};

/**
 * Get Plugin files.
 *
 * This function retrieves the list of plugin files
 * to be created in the plugin directory.
 *
 * @since 1.0.0
 * @returns {string[]}
 */
export const getPluginFiles = () => {
	return [
		'.editorconfig',
		'.gitignore',
		'composer.json',
		'LICENSE',
		'phpcs.xml',
		'phpunit.xml',
		'plugin.php',
		'README.md',
		'readme.md'
	];
};

/**
 * Get Plugin Defaults.
 *
 * This function retrieves the default values for the
 * plugin properties.
 *
 * @since 1.0.0
 *
 * @param {string} name
 * @returns {Object}
 */
export const getPluginDefaults = name => {
	/**
	 * Get Description.
	 *
	 * This function returns the default description
	 * for the plugin.
	 *
	 * @returns {string}
	 */
	const getDescription = () => {
		return `The ${name} plugin is a WordPress plugin that does amazing things.`;
	};

	/**
	 * Get Slug.
	 *
	 * This function returns the default slug for the plugin.
	 *
	 * @returns {string}
	 */
	const getSlug = () => {
		return getSanitizedText(name).toLowerCase().replace(/\s/g, '-');
	};

	/**
	 * Get Namespace.
	 *
	 * This function returns the default namespace for the plugin.
	 *
	 * @returns {string}
	 */
	const getNameSpace = () => {
		return getSanitizedText(name)
			.split(' ')
			.map(item => {
				return `${item.charAt(0).toUpperCase()}${item.slice(1)}`;
			})
			.join('');
	};

	return {
		defaultDescription: getDescription(),
		defaultSlug: getSlug(),
		defaultPackage: getNameSpace(),
		defaultNamespace: getNameSpace(),
		defaultUrl: 'https://example.com',
		defaultDomain: getSlug(),
		defaultAuthor: 'John Doe',
		defaultAuthorEmail: 'john@doe.com',
		defaultAuthorUrl: 'https://john-doe.com'
	};
};

/**
 * Get Sanitized Text.
 *
 * This function returns a sanitized (only alphanumeric)
 * version of the text.
 *
 * @param {string} text
 * @returns {string}
 */
export const getSanitizedText = text => {
	return text
		.replace(/[^a-zA-Z0-9]/g, '')
		.split(' ')
		.map(item => item)
		.join(' ');
};
