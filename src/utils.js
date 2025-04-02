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
