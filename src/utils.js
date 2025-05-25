import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get Config.
 *
 * This function retrieves the config properties
 * of the plugin, if the directory exists.
 *
 * @since 1.0.0
 * @returns {Promise<Object|boolean>} Config.
 */
export const getConfig = async () => {
	const config = await fs.readFile(
		path.join(__dirname, '../sculpt.json'),
		'utf-8'
	);

	const newPath = JSON.parse(config).filter(item =>
		process.cwd().includes(item.path)
	);

	return newPath.length ? newPath[0] : false;
};

/**
 * Get Plugin Path.
 *
 * This function retrieves the plugin
 * directory path.
 *
 * @since 1.0.0
 * @returns {Promise<string>} Path.
 */
export const getPath = async () => {
	return (await getConfig()).path || '';
};

/**
 * Is Valid File.
 *
 * This function checks if the current file
 * exists for use.
 *
 * @since 1.0.0
 * @returns {Promise<boolean>} Validity.
 */
export const isValidFile = async file => {
	const { path: pluginPath } = await getConfig();

	try {
		return await fs.readFile(path.join(pluginPath, file));
	} catch {
		return false;
	}
};

/**
 * Is Valid Directory.
 *
 * This function checks if the current working
 * directory is a Sculpt plugin.
 *
 * @since 1.0.0
 * @returns {Promise<boolean>} Validity.
 */
export const isValidDirectory = async () => {
	return (await getPath()) ? true : false;
};

/**
 * Get File.
 *
 * This function retrieves the content of a file
 * if it exists, otherwise it creates the file with
 * the provided fallback content.
 *
 * @since 1.0.0
 *
 * @param {string} filePath - The path to the file.
 * @param {string} fallback - The fallback content.
 *
 * @returns {Promise<string>} File content.
 */
export const getFile = async (filePath, fallback = '') => {
	let fileContent = '';

	try {
		fileContent = await fs.readFile(filePath, 'utf-8');
	} catch {
		await fs.writeFile(filePath, fallback, 'utf-8');
		fileContent = await fs.readFile(filePath, 'utf-8');
	}

	return fileContent;
};

/**
 * Get Directory.
 *
 * This function checks if a directory exists, and if not,
 * it creates the directory.
 *
 * @since 1.0.0
 *
 * @param {string} dirPath - The path to the directory.
 * @returns {Promise<string>} Directory path.
 */
export const getDirectory = async dirPath => {
	const newDirPath = path.join(await getPath(), dirPath);

	try {
		await fs.access(newDirPath);
	} catch {
		await fs.mkdir(newDirPath, { recursive: true });
	}

	return newDirPath;
};

/**
 * Get Sanitized Name.
 *
 * This function returns a sanitized (only alphanumeric)
 * version of the text.
 *
 * @since 1.0.0
 *
 * @param {string} name - The name to be sanitized.
 * @returns {string}
 */
export const getSanitizedText = name => {
	return (name || '')
		.split(' ')
		.filter(item => /[a-zA-Z0-9]+$/.test(item))
		.join(' ')
		.replace(/[^a-zA-Z0-9\s]/g, '');
};

/**
 * Get Description.
 *
 * This function returns the default description
 * for the plugin.
 *
 * @since 1.0.0
 *
 * @param {string} name - The plugin name.
 * @returns {string}
 */
export const getDescription = name => {
	return `The ${name} plugin is a WordPress plugin that does amazing things.`;
};

/**
 * Get Slug.
 *
 * This function returns the default slug
 * for the plugin.
 *
 * @since 1.0.0
 *
 * @param {string} name - The plugin name.
 * @returns {string}
 */
export const getSlug = name => {
	return name
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
};

/**
 * Get Namespace.
 *
 * This function returns the default
 * namespace for the plugin.
 *
 * @since 1.0.0
 *
 * @param {string} name - The plugin name.
 * @returns {string}
 */
export const getNamespace = name => {
	return getSanitizedText(name || '')
		.split(' ')
		.map(item => {
			return `${item.charAt(0).toUpperCase()}${item.slice(1)}`;
		})
		.join('');
};

/**
 * Get Underscored Name.
 *
 * This function returns the default underscored
 * name for the plugin.
 *
 * @since 1.0.0
 *
 * @param {string} name - The plugin name.
 * @returns {string}
 */
export const getUnderscore = name => {
	return getSanitizedText(name).toLowerCase().replace(/\s/g, '_');
};

/**
 * Get Autoload Name.
 *
 * This function returns the default autoload
 * name for the plugin.
 *
 * @since 1.0.0
 *
 * @param {string} name - The plugin name.
 * @returns {string}
 */
export const getAutoload = name => {
	return getSanitizedText(name).toUpperCase().replace(/\s/g, '_');
};

/**
 * Get Random Port.
 *
 * This function returns a random port number
 * between 1000 and 9999.
 *
 * @since 1.0.0
 *
 * @returns {number}
 */
export const getRandomPort = () => {
	return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
};
