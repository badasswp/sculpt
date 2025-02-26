/**
 * Get Post Prompts.
 *
 * This function returns an object with prompts for
 * generating a Custom Post Type.
 *
 * @returns {Object}
 */
export const getPostPrompts = () => ({
	name: 'Custom Post Type: ',
	singular: 'Singular Label: ',
	plural: 'Plural Label: ',
	icon: 'Dashicon: ',
	supports: 'Supports: ',
	taxonomies: 'Taxonomies: ',
	hasArchive: 'Has Archive: ',
	public: 'Public: ',
	showInRest: 'Show in REST: ',
	restBase: 'REST Base: ',
	restController: 'REST Controller Class: '
});

/**
 * Get Plugin Prompts.
 *
 * This function returns an object with prompts for
 * generating a Plugin.
 *
 * @returns {Object}
 */
export const getPluginPrompts = () => ({
	name: 'Plugin name: ',
	description: 'Description: ',
	author: 'Author: ',
	domain: 'Text domain: ',
	package: 'Package: ',
	namespace: 'Namespace: ',
});
