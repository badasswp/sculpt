import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

import { prompt } from '../../utils/ask.js';
import { getMetaPrompts, getMetaDefaults } from './utils.js';
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
 * Sculpt Meta.
 *
 * This function retrieves the meta properties/params and then
 * goes ahead to create the Meta.
 *
 * @since 1.0.5
 * @returns {Promise<void>}
 */
const sculptMeta = async () => {
	if (!(await isValidDirectory())) {
		console.error('Error: Not a valid Sculpt plugin directory.');
		return;
	}

	const props = await getMetaProps();

	if (!props.name) {
		console.error("Error: 'name' is required to create a custom meta.");
		return;
	}

	if (await isValidFile(`/inc/Meta/${props.name}.php`)) {
		console.error(`Error: Custom meta ${props.name} already exists.`);
		return;
	}

	await createMetaAbstract(props);
	await createMetaService(props);
	await appendMetaToContainer();
	await appendMetaToService(props);
	await createMeta(props);
};

/**
 * Get Meta Properties.
 *
 * This function prompts the user for information
 * and returns an object containing the user's choices.
 *
 * @since 1.0.5
 *
 * @returns {Promise<Object>} Props.
 */
const getMetaProps = async () => {
	const props = {};
	const cli = prompt();

	for (const [key, question] of Object.entries(getMetaPrompts())) {
		const value = await cli.ask(question);

		if (value) {
			props[key] = value;
		}
	}

	cli.close();

	return props;
};

/**
 * Create Meta Abstraction.
 *
 * This function creates a meta abstraction for the
 * custom meta.
 *
 * @since 1.0.5
 *
 * @param {Object} props
 * @returns {Promise<void>}
 */
const createMetaAbstract = async () => {
	const { textDomain, namespace, underscore } = await getConfig();

	if (await isValidFile('/inc/Abstracts/Meta.php')) {
		return;
	}

	const filePath = path.join(__dirname, '../../repo/inc/Abstracts/Meta.php');

	let fileContent = await fs.readFile(filePath, 'utf-8');
	fileContent = fileContent
		.replace(/\btext-domain\b/g, textDomain)
		.replace(/\bSculptPluginNamespace\b/g, namespace)
		.replace(/\bSculptPluginPackage\b/g, namespace)
		.replace(/\bsculpt_meta_options\b/g, `${underscore}_meta_options`);

	const newFilePath = path.join(
		await getDirectory('inc/Abstracts'),
		`Meta.php`
	);

	await fs.writeFile(newFilePath, fileContent, 'utf-8');
};

/**
 * Create Meta Service.
 *
 * This function creates a meta service for the
 * custom meta.
 *
 * @since 1.0.5
 *
 * @param {Object} props
 * @returns {Promise<void>}
 */
const createMetaService = async () => {
	const { textDomain, namespace, underscore } = await getConfig();

	if (await isValidFile('/inc/Services/Meta.php')) {
		return;
	}

	const filePath = path.join(__dirname, '../../repo/inc/Services/Meta.php');

	let fileContent = await fs.readFile(filePath, 'utf-8');
	fileContent = fileContent
		.replace(/\btext-domain\b/g, textDomain)
		.replace(/\bSculptPluginNamespace\b/g, namespace)
		.replace(/\bSculptPluginPackage\b/g, namespace)
		.replace(/\bsculpt_meta\b/g, `${underscore}_meta`);

	const newFilePath = path.join(
		await getDirectory('inc/Services'),
		`Meta.php`
	);

	await fs.writeFile(newFilePath, fileContent, 'utf-8');
};

/**
 * Create Meta.
 *
 * This function creates a new custom meta based on the
 * provided custom meta properties.
 *
 * @since 1.0.5
 *
 * @param {Object} props
 * @returns {Promise<void>}
 */
const createMeta = async props => {
	const { name } = props;
	const metaProps = { ...getMetaDefaults(name), ...props };
	const { postType } = metaProps;

	const { textDomain, namespace } = await getConfig();
	const filePath = path.join(__dirname, '../../repo/inc/Meta/Meta.php');

	let fileContent = await fs.readFile(filePath, 'utf-8');
	fileContent = fileContent
		.replace(/\btext-domain\b/g, textDomain)
		.replace(/\bSculptMetaName\b/g, getNamespace(name))
		.replace(/\bSculptMetaPostType\b/g, postType)
		.replace(/\bSculptPluginNamespace\b/g, namespace)
		.replace(/\bSculptPluginPackage\b/g, namespace);

	const newFilePath = path.join(
		await getDirectory('inc/Meta'),
		`${getNamespace(name)}.php`
	);

	await fs.writeFile(newFilePath, fileContent, 'utf-8');
	console.log(`New Meta created: ${getNamespace(name)}\n`);
};

/**
 * Append Meta to Container.
 *
 * This function appends the meta to the container
 * in the Core directory.
 *
 * @since 1.0.5
 * @returns {Promise<void>}
 */
const appendMetaToContainer = async () => {
	if (!(await isValidFile('/inc/Core/Container.php'))) {
		return;
	}

	const filePath = path.join(await getDirectory('inc/Core'), `Container.php`);
	let fileContent = await fs.readFile(filePath, 'utf-8');

	const classToAdd = 'Meta::class';
	const { namespace } = await getConfig();

	const kernelNamespace = `use ${namespace}\\Interfaces\\Kernel;`;
	const appendNamespace = `use ${namespace}\\Services\\Meta;`;

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
 * Append Meta to Service.
 *
 * This function appends the meta to the meta
 * service in the Core directory.
 *
 * @since 1.0.5
 * @returns {Promise<void>}
 */
const appendMetaToService = async props => {
	const { name } = props;
	if (!(await isValidFile('/inc/Services/Meta.php'))) {
		return;
	}

	const filePath = path.join(await getDirectory('inc/Services'), `Meta.php`);
	let fileContent = await fs.readFile(filePath, 'utf-8');

	const classToAdd = `${getNamespace(name)}::class`;
	const { namespace } = await getConfig();

	const kernelNamespace = `use ${namespace}\\Interfaces\\Kernel;`;
	const appendNamespace = `use ${namespace}\\Meta\\${getNamespace(name)};`;

	if (!fileContent.includes(appendNamespace)) {
		fileContent = fileContent.replace(
			kernelNamespace,
			`${kernelNamespace}\n${appendNamespace}`
		);
	}

	fileContent = fileContent.replace(
		/\$meta\s*=\s*\[(.*?)\];/s,
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
				'$meta = [\n' +
				services.map(s => `\t\t\t${s}`).join(',\n') +
				',\n\t\t];';

			return newServicesBlock;
		}
	);

	const newFilePath = path.join(
		await getDirectory('inc/Services'),
		`Meta.php`
	);

	await fs.writeFile(newFilePath, fileContent, 'utf-8');
};

export default sculptMeta;
