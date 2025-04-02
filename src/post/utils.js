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
		icon: 'dashicons-admin-generic',
		supports: 'title, thumbnail',
		taxonomies: '',
		hasArchive: 'true',
		public: 'true',
		showInRest: 'true',
		restBase: name,
		restController: name
	};
};
