import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

import { prompt } from '../../utils/ask.js';
import { getTaxonomyPrompts, getTaxonomyDefaults } from './utils.js';
import {
	getDirectory,
	isValidFile,
	isValidDirectory,
	getConfig,
	getNamespace
} from '../utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Sculpt Taxonomy.
 *
 * This function retrieves the taxonomy properties/params and then
 * goes ahead to create the Taxonomy.
 *
 * @since 1.0.4
 * @returns {Promise<void>}
 */
const sculptTaxonomy = async () => {
	if (!(await isValidDirectory())) {
		console.error('Error: Not a valid Sculpt plugin directory.');
		return;
	}

	const props = await getTaxonomyProps();

	if (!props.name) {
		console.error("Error: 'name' is required to create a custom taxonomy.");
		return;
	}

	if (await isValidFile(`/inc/Taxonomies/${props.name}.php`)) {
		console.error(`Error: Custom taxonomy ${props.name} already exists.`);
		return;
	}

	await createTaxonomyAbstract(props);
	await createTaxonomyService(props);
	await appendTaxonomyToContainer();
	await appendTaxonomyToService(props);
	await createTaxonomy(props);
};

/**
 * Get Taxonomy Properties.
 *
 * This function prompts the user for information
 * and returns an object containing the user's choices.
 *
 * @since 1.0.4
 *
 * @returns {Promise<Object>} Props.
 */
const getTaxonomyProps = async () => {
	const props = {};
	const cli = prompt();

	for (const [key, question] of Object.entries(getTaxonomyPrompts())) {
		const value = await cli.ask(question);

		if (value) {
			props[key] = value;
		}
	}

	cli.close();

	return props;
};

/**
 * Create Taxonomy Abstraction.
 *
 * This function creates a taxonomy abstraction for the
 * custom taxonomy.
 *
 * @since 1.0.4
 *
 * @param {Object} props
 * @returns {Promise<void>}
 */
const createTaxonomyAbstract = async () => {
	const { textDomain, namespace, underscore } = await getConfig();

	if (await isValidFile('/inc/Abstracts/Taxonomy.php')) {
		return;
	}

	const filePath = path.join(
		__dirname,
		'../../repo/inc/Abstracts/Taxonomy.php'
	);

	let fileContent = await fs.readFile(filePath, 'utf-8');
	fileContent = fileContent
		.replace(/\btext-domain\b/g, textDomain)
		.replace(/\bSculptPluginNamespace\b/g, namespace)
		.replace(/\bSculptPluginPackage\b/g, namespace)
		.replace(
			/\babstract_taxonomy_options\b/g,
			`${underscore}_taxonomy_options`
		);

	const newFilePath = path.join(
		await getDirectory('inc/Abstracts'),
		`Taxonomy.php`
	);

	await fs.writeFile(newFilePath, fileContent, 'utf-8');
};

/**
 * Create Taxonomy Service.
 *
 * This function creates a taxonomy service for the
 * custom taxonomy.
 *
 * @since 1.0.4
 *
 * @param {Object} props
 * @returns {Promise<void>}
 */
const createTaxonomyService = async () => {
	const { textDomain, namespace, underscore } = await getConfig();

	if (await isValidFile('/inc/Services/Taxonomy.php')) {
		return;
	}

	const filePath = path.join(
		__dirname,
		'../../repo/inc/Services/Taxonomy.php'
	);

	let fileContent = await fs.readFile(filePath, 'utf-8');
	fileContent = fileContent
		.replace(/\btext-domain\b/g, textDomain)
		.replace(/\bSculptPluginNamespace\b/g, namespace)
		.replace(/\bSculptPluginPackage\b/g, namespace)
		.replace(/\bsculpt_taxonomies\b/g, `${underscore}_taxonomies`);

	const newFilePath = path.join(
		await getDirectory('inc/Services'),
		`Taxonomy.php`
	);

	await fs.writeFile(newFilePath, fileContent, 'utf-8');
};

/**
 * Create Taxonomy.
 *
 * This function creates a new custom taxonomy based on the
 * provided custom taxonomy properties.
 *
 * @since 1.0.4
 *
 * @param {Object} props
 * @returns {Promise<void>}
 */
const createTaxonomy = async props => {
	const { name } = props;
	const taxonomyProps = { ...getTaxonomyDefaults(name), ...props };
	const { singular, plural, slug, postType } = taxonomyProps;

	const { textDomain, namespace } = await getConfig();
	const filePath = path.join(
		__dirname,
		'../../repo/inc/Taxonomies/Taxonomy.php'
	);

	let fileContent = await fs.readFile(filePath, 'utf-8');
	fileContent = fileContent
		.replace(/\bsculptTaxonomyName\b/g, getNamespace(name))
		.replace(/\bSculptTaxonomySingularLabel\b/g, singular)
		.replace(/\bSculptTaxonomyPluralLabel\b/g, plural)
		.replace(/\bSculptTaxonomySlug\b/g, slug)
		.replace(/\bSculptTaxonomyPostType\b/g, postType)
		.replace(/\btext-domain\b/g, textDomain)
		.replace(/\bSculptPluginNamespace\b/g, namespace)
		.replace(/\bSculptPluginPackage\b/g, namespace);

	const newFilePath = path.join(
		await getDirectory('inc/Taxonomies'),
		`${getNamespace(singular)}.php`
	);

	await fs.writeFile(newFilePath, fileContent, 'utf-8');
	console.log(`Custom taxonomy created: ${singular}`);
};

/**
 * Append Taxonomy to Container.
 *
 * This function appends the taxonomy to the container
 * in the Core directory.
 *
 * @since 1.0.4
 * @returns {Promise<void>}
 */
const appendTaxonomyToContainer = async () => {
	if (!(await isValidFile('/inc/Core/Container.php'))) {
		return;
	}

	const filePath = path.join(await getDirectory('inc/Core'), `Container.php`);
	let fileContent = await fs.readFile(filePath, 'utf-8');

	const classToAdd = 'Taxonomy::class';
	const { namespace } = await getConfig();

	const kernelNamespace = `use ${namespace}\\Interfaces\\Kernel;`;
	const appendNamespace = `use ${namespace}\\Services\\Taxonomy;`;

	if (!fileContent.includes(appendNamespace)) {
		fileContent = fileContent.replace(
			kernelNamespace,
			`${kernelNamespace}\n${appendNamespace}`
		);
	}

	fileContent = fileContent.replace(
		/static::\$services\s*=\s*\[(.*?)\];/s,
		(match, servicesList) => {
			const services = servicesList
				.split(',')
				.map(s => s.trim())
				.filter(s => s);

			// Avoid duplicates
			if (!services.includes(classToAdd)) {
				services.push(classToAdd);
			}

			const newServicesBlock =
				'static::$services = [\n' +
				services.map(s => `\t\t\t${s}`).join(',\n') +
				',\n\t\t];';

			return newServicesBlock;
		}
	);

	const newFilePath = path.join(
		await getDirectory('inc/Core'),
		`Container.php`
	);

	await fs.writeFile(newFilePath, fileContent, 'utf-8');
};

/**
 * Append Taxonomy to Service.
 *
 * This function appends the taxonomy to the taxonomy
 * service in the Core directory.
 *
 * @since 1.0.4
 * @returns {Promise<void>}
 */
const appendTaxonomyToService = async props => {
	const { name } = props;
	if (!(await isValidFile('/inc/Services/Taxonomy.php'))) {
		return;
	}

	const filePath = path.join(
		await getDirectory('inc/Services'),
		`Taxonomy.php`
	);
	let fileContent = await fs.readFile(filePath, 'utf-8');

	const classToAdd = `${getNamespace(name)}::class`;
	const { namespace } = await getConfig();

	const kernelNamespace = `use ${namespace}\\Interfaces\\Kernel;`;
	const appendNamespace = `use ${namespace}\\Taxonomies\\${getNamespace(name)};`;

	if (!fileContent.includes(appendNamespace)) {
		fileContent = fileContent.replace(
			kernelNamespace,
			`${kernelNamespace}\n${appendNamespace}`
		);
	}

	fileContent = fileContent.replace(
		/\$taxonomies\s*=\s*\[(.*?)\];/s,
		(match, servicesList) => {
			const services = servicesList
				.split(',')
				.map(s => s.trim())
				.filter(s => s);

			// Avoid duplicates
			if (!services.includes(classToAdd)) {
				services.push(classToAdd);
			}

			const newServicesBlock =
				'$taxonomies = [\n' +
				services.map(s => `\t\t\t${s}`).join(',\n') +
				',\n\t\t];';

			return newServicesBlock;
		}
	);

	const newFilePath = path.join(
		await getDirectory('inc/Services'),
		`Taxonomy.php`
	);

	await fs.writeFile(newFilePath, fileContent, 'utf-8');
};

export default sculptTaxonomy;
