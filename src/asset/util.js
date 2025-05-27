import { getUnderscore } from '../utils.js';

/**
 * Get Asset Prompts.
 *
 * This function returns an object with prompts for
 * generating a Custom Asset.
 *
 * @since 1.0.5
 *
 * @returns {Object}
 */
export const getAssetPrompts = () => ({
	name: 'Asset Name: '
});

/**
 * Get Asset Defaults.
 *
 * This function retrieves the default values for the
 * asset properties.
 *
 * @since 1.0.5
 *
 * @param {string} name
 * @returns {Object}
 */
export const getAssetDefaults = name => {
	return {
		slug: getUnderscore(name)
	};
};
