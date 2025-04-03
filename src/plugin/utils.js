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
	return name
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
	return getSanitizedText(name).toLowerCase().replace(/\s/g, '-');
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
export const getNameSpace = name => {
	return getSanitizedText(name)
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
