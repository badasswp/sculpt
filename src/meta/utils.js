import { getUnderscore } from '../utils.js';

/**
 * Get Meta Prompts.
 *
 * This function returns an object with prompts for
 * generating a Custom Meta.
 *
 * @since 1.0.5
 *
 * @returns {Object}
 */
export const getMetaPrompts = () => ({
	name: 'Meta name: ',
	postType: 'Post type it belongs to: '
});

/**
 * Get Meta Defaults.
 *
 * This function retrieves the default values for the
 * meta properties.
 *
 * @since 1.0.5
 *
 * @param {string} name
 * @returns {Object}
 */
export const getMetaDefaults = name => {
	return {
		slug: getUnderscore(name),
		postType: 'post'
	};
};
