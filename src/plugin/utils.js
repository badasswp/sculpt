import {
	getDescription,
	getSlug,
	getNameSpace,
	getAutoload,
	getUnderscore,
	getRandomPort
} from '../utils';

/**
 * Get Plugin Prompts.
 *
 * This function returns an object with prompts for
 * generating a Plugin.
 *
 * @returns {Object}
 */
export const getPluginPrompts = () => ({
	name: 'Plugin Name: ',
	description: 'Description: ',
	slug: 'Slug: ',
	tags: 'Keywords: ',
	namespace: 'Namespace: ',
	url: 'Plugin URL: ',
	author: 'Author: ',
	authorEmail: 'Author Email: ',
	authorUrl: 'Author URL: ',
	textDomain: 'Text domain: '
});

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
	return {
		description: getDescription(name),
		slug: getSlug(name),
		tags: 'plugin, wordpress',
		namespace: getNameSpace(name),
		url: 'https://example.com',
		author: 'John Doe',
		authorEmail: 'john@doe.com',
		authorUrl: 'https://john-doe.com',
		textDomain: getSlug(name),
		autoload: getAutoload(name),
		underscore: getUnderscore(name),
		port: getRandomPort()
	};
};
