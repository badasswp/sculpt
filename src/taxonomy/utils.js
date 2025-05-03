import { getUnderscore } from '../utils.js';

/**
 * Get Taxonomy Prompts.
 *
 * This function returns an object with prompts for
 * generating a Custom Taxonomy.
 *
 * @since 1.0.4
 *
 * @returns {Object}
 */
export const getTaxonomyPrompts = () => ({
	name: 'Custom Taxonomy: ',
	singular: 'Singular Label: ',
	plural: 'Plural Label: ',
	slug: 'Slug: ',
	postType: 'Post type it belongs to: '
});

/**
 * Get Taxonomy Defaults.
 *
 * This function retrieves the default values for the
 * taxonomy properties.
 *
 * @since 1.0.4
 *
 * @param {string} name
 * @returns {Object}
 */
export const getTaxonomyDefaults = name => {
	return {
		singular: name,
		plural: `${name}s`,
		slug: getUnderscore(name),
		postType: 'post'
	};
};
