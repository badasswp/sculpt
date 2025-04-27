import { getUnderscore } from '../utils.js';

/**
 * Get Post Prompts.
 *
 * This function returns an object with prompts for
 * generating a Custom Post Type.
 *
 * @since 1.0.0
 *
 * @returns {Object}
 */
export const getPostPrompts = () => ({
	name: 'Custom Post Type: ',
	singular: 'Singular Label: ',
	plural: 'Plural Label: ',
	showInRest: 'Show in REST: ',
	showInMenu: 'Show in Menu: '
});

/**
 * Get Post Defaults.
 *
 * This function retrieves the default values for the
 * post properties.
 *
 * @since 1.0.0
 *
 * @param {string} name
 * @returns {Object}
 */
export const getPostDefaults = name => {
	return {
		singular: name,
		plural: `${name}s`,
		supports: "'title', 'thumbnail', 'editor'",
		slug: getUnderscore(name),
		showInRest: 'true',
		showInMenu: 'true'
	};
};
