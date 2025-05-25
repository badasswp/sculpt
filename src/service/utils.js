import { getUnderscore } from '../utils.js';

/**
 * Get Service Prompts.
 *
 * This function returns an object with prompts for
 * generating a Custom Service.
 *
 * @since 1.0.4
 *
 * @returns {Object}
 */
export const getServicePrompts = () => ({
	name: 'Service Name: '
});

/**
 * Get Service Defaults.
 *
 * This function retrieves the default values for the
 * service properties.
 *
 * @since 1.0.4
 *
 * @param {string} name
 * @returns {Object}
 */
export const getServiceDefaults = name => {
	return {
		slug: getUnderscore(name)
	};
};
