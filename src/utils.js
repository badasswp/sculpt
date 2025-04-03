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
	return (await getConfig().path) || '';
};

/**
 * Get File Content.
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
export const getFileContent = async (filePath, fallback = '') => {
	let fileContent = '';

	try {
		fileContent = await fs.readFile(filePath, 'utf-8');
	} catch {
		await fs.writeFile(filePath, fallback, 'utf-8');
		fileContent = await fs.readFile(filePath, 'utf-8');
	}

	return fileContent;
};
