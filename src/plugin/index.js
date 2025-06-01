import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

import { prompt } from '../../utils/ask.js';
import { getFile, getSlug } from '../utils.js';
import {
	getPluginPrompts,
	getPluginDefaults,
	getPluginFiles
} from './utils.js';

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
		const value = await cli.ask(question);

		if (value) {
			props[key] = value;
		}
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
export const createPlugin = async props => {
	if (await createPluginDirectory(props)) {
		const { name } = props;
		const slug = getSlug(props?.slug || name);
		console.error(`Plugin folder already exists: ${slug}`);
		return;
	}

	await createPluginFiles(props);
	console.log(`\nNew Plugin created: ${props.name}\n`);
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
 * @returns {Promise<boolean>}
 */
export const createPluginDirectory = async props => {
	const { name } = props;
	const slug = getSlug(props?.slug || name);

	try {
		await fs.access(slug);
		return true;
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
	const { name } = props;
	const pluginProps = { ...getPluginDefaults(name), ...props };

	const {
		description,
		slug,
		tags,
		namespace,
		url,
		author,
		authorEmail,
		authorUrl,
		textDomain,
		autoload,
		underscore,
		port
	} = pluginProps;

	getPluginFiles().forEach(async file => {
		if (file.includes('/')) {
			const entities = file.split('/');
			entities.pop();

			const folder = path.join(
				process.cwd(),
				`${slug}/${entities.join('/')}`
			);
			await fs.mkdir(folder, { recursive: true });
		}

		const filePath = path.join(__dirname, '../../repo', file);

		try {
			const fileContent = await fs.readFile(filePath, 'utf-8');

			switch (file) {
				case 'composer.json':
					fileContent = fileContent
						.replace(
							/\bsculpt_user\/sculpt_plugin\b/g,
							`${author.toLowerCase().replace(/\s/g, '')}/${slug}`
						)
						.replace(/\bSculptPluginDescription\b/g, description)
						.replace(/\bSculptPluginNamespace\b/g, namespace)
						.replace(/\bsculpt_user\b/g, author)
						.replace(/\bsculpt_email@yahoo.com\b/g, authorEmail);
					break;

				case 'plugin.php':
					fileContent = fileContent
						.replace(/\bSculptPluginName\b/g, name)
						.replace(/\bSculptPluginURL\b/g, url)
						.replace(/\bSculptPluginDescription\b/g, description)
						.replace(/\bSculptPluginVersion\b/g, `1.0.0`)
						.replace(/\bSculptPluginAuthor\b/g, author)
						.replace(/\bSculptPluginAuthorURI\b/g, authorUrl)
						.replace(/\bSculptPluginPackage\b/g, namespace)
						.replace(/\bSCULPT_AUTOLOAD\b/g, `${autoload}_AUTOLOAD`)
						.replace(/\btext-domain\b/g, textDomain)
						.replace(
							/\bSculptAuthorNamespace\b/g,
							`${author.toLowerCase().replace(/\s/g, '')}\\${namespace}`
						)
						.replace(
							/\bSculptPluginAbsoluteNamespace\b/g,
							`\\${namespace}\\Plugin`
						);
					break;

				case 'phpcs.xml':
					fileContent = fileContent.replace(
						/\bSculptPluginNamespace\b/g,
						namespace
					);
					break;

				case '.wp-env.json':
					const testPort = port + 1;
					fileContent = fileContent
						.replace(/sculpt/g, slug)
						.replace(/8888/g, port)
						.replace(/8889/g, testPort);
					break;

				case 'README.md':
					fileContent = fileContent
						.replace(/\bSculptPluginName\b/g, slug)
						.replace(/\bSculptPluginDescription\b/g, description);
					break;

				case 'readme.txt':
					fileContent = fileContent
						.replace(/\bSculptPluginName\b/g, name)
						.replace(/\bSculptPluginUser\b/g, author)
						.replace(/\bSculptPluginTags\b/g, tags)
						.replace(/\bSculptPluginDescription\b/g, description)
						.replace(/\bSculptPluginURL\b/g, url);
					break;

				case 'inc/Abstracts/Service.php':
				case 'inc/Core/Container.php':
				case 'inc/Interfaces/Kernel.php':
				case 'inc/Plugin.php':
					fileContent = fileContent.replace(
						/\bSculptPluginNamespace\b/g,
						namespace
					);
					break;

				case 'inc/Services/Admin.php':
					fileContent = fileContent
						.replace(/\bSculptPluginNamespace\b/g, namespace)
						.replace(/\bSculptPluginName\b/g, name)
						.replace(/\SculptPluginDescription\b/g, description)
						.replace(/\bsculpt\b/g, slug)
						.replace(/\bsculpt-group\b/g, `${slug}-group`)
						.replace(/\bsculpt_option\b/g, underscore)
						.replace(/\btext-domain\b/g, textDomain);
					break;

				case 'bin/setup.sh':
					fileContent = fileContent.replace(
						/"WordPress Site"/g,
						`"${name}"`
					);
					break;

				case 'package.json':
					fileContent = fileContent
						.replace(/sculpt_slug/g, slug)
						.replace(/sculpt_author/g, author)
						.replace(/sculpt_description/g, description);
					break;

				case 'languages/sculpt.pot':
					fileContent = fileContent
						.replace(/\bSculptPluginName\b/g, name)
						.replace(/\bSculptPluginSlug\b/g, slug)
						.replace(/\bSculptPluginURL\b/g, url)
						.replace(/\bSculptPluginDescription\b/g, description)
						.replace(/\bSculptPluginAuthor\b/g, author)
						.replace(/\bSculptPluginAuthorURI\b/g, authorUrl);
					break;

				case 'tests/unit/php/bootstrap.php':
				case 'tests/unit/php/PluginTest.php':
				case 'tests/unit/php/Core/ContainerTest.php':
					fileContent = fileContent
						.replace(/\bSculptPluginPackage\b/g, namespace)
						.replace(/\bSculptPluginNamespace\b/g, namespace);
					break;

				case '.github/workflows/ci.yml':
					fileContent = fileContent.replace(
						/\bSculptPluginNamespace\b/g,
						namespace
					);
					break;
			}

			const newFilePath = path.join(
				process.cwd(),
				`${slug}/${getNewFileLocation(file, pluginProps)}`
			);

			await fs.writeFile(newFilePath, fileContent, 'utf-8');
		} catch (e) {
			if (e) {
				// Do nothing for now...
			}
			// fail silently.
			return;
		}
	});

	updateConfig(pluginProps);
};

/**
 * Get New File Location.
 *
 * This function gets the new file location.
 *
 * @since 1.0.5
 *
 * @param {string} file
 * @param {Object} props
 *
 * @returns {string}
 */
const getNewFileLocation = (file, props) => {
	let newFile = '';

	switch (file) {
		case 'languages/sculpt.pot':
			newFile = `languages/${props.slug}.pot`;
			break;

		case '.npmignore':
			newFile = '.gitignore';
			break;

		default:
			newFile = file;
			break;
	}

	return newFile;
};

/**
 * Update JSON Config.
 *
 * This function updates the sculpt.json file with the
 * provided plugin properties.
 *
 * @since 1.0.0
 *
 * @param {Object} props
 * @returns {Promise<void>}
 */
const updateConfig = async props => {
	const { name, slug } = props;
	const filePath = path.join(__dirname, '../../sculpt.json');

	const fileContent = await getFile(filePath, '[]');
	const parsedContent = JSON.parse(fileContent || '[]');

	// Let's check if the plugin already exists
	const existingPlugin = parsedContent.find(
		plugin => plugin.path === `${process.cwd()}/${slug}`
	);
	if (existingPlugin) {
		parsedContent.splice(parsedContent.indexOf(existingPlugin), 1);
	}

	parsedContent.push({ name, ...props, path: `${process.cwd()}/${slug}` });
	await fs.writeFile(filePath, JSON.stringify(parsedContent), 'utf-8');
};

export default sculptPlugin;
