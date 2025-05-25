import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

import { prompt } from '../../utils/ask.js';
import { getServicePrompts, getServiceDefaults } from './utils.js';
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
 * Sculpt Service.
 *
 * This function retrieves the service properties/params and then
 * goes ahead to create the Service.
 *
 * @since 1.0.5
 * @returns {Promise<void>}
 */
const sculptService = async () => {
	if (!(await isValidDirectory())) {
		console.error('Error: Not a valid Sculpt plugin directory.');
		return;
	}

	const props = await getServiceProps();

	if (!props.name) {
		console.error("Error: 'name' is required to create a custom service.");
		return;
	}

	if (await isValidFile(`/inc/Services/${props.name}.php`)) {
		console.error(`Error: Custom service ${props.name} already exists.`);
		return;
	}

	await createService(props);
	await appendServiceToContainer(props);
};

/**
 * Get Service Properties.
 *
 * This function prompts the user for information
 * and returns an object containing the user's choices.
 *
 * @since 1.0.5
 *
 * @returns {Promise<Object>} Props.
 */
const getServiceProps = async () => {
	const props = {};
	const cli = prompt();

	for (const [key, question] of Object.entries(getServicePrompts())) {
		const value = await cli.ask(question);

		if (value) {
			props[key] = value;
		}
	}

	cli.close();

	return props;
};

/**
 * Create Service.
 *
 * This function creates a new custom service based on the
 * provided custom service properties.
 *
 * @since 1.0.5
 *
 * @param {Object} props
 * @returns {Promise<void>}
 */
const createService = async props => {
	const serviceProps = { ...getServiceDefaults(props.name), ...props };
	const { name } = serviceProps;
	const { namespace } = await getConfig();

	if (await isValidFile('/inc/Services/Service.php')) {
		return;
	}

	const filePath = path.join(
		__dirname,
		'../../repo/inc/Services/Service.php'
	);

	let fileContent = await fs.readFile(filePath, 'utf-8');
	fileContent = fileContent
		.replace(/\bSculpt\b/g, getNamespace(name))
		.replace(/\bSculptPluginNamespace\b/g, namespace)
		.replace(/\bSculptPluginPackage\b/g, namespace);

	const newFilePath = path.join(
		await getDirectory('inc/Services'),
		`${getNamespace(name)}.php`
	);

	await fs.writeFile(newFilePath, fileContent, 'utf-8');
	console.log(`Custom service created: ${getNamespace(name)}`);
};

/**
 * Append Service to Container.
 *
 * This function appends the service to the container
 * in the Core directory.
 *
 * @since 1.0.5
 *
 * @param {Object} props - The service properties.
 * @returns {Promise<void>}
 */
const appendServiceToContainer = async props => {
	const { name } = props;

	if (!(await isValidFile('/inc/Core/Container.php'))) {
		return;
	}

	const filePath = path.join(await getDirectory('inc/Core'), `Container.php`);
	let fileContent = await fs.readFile(filePath, 'utf-8');

	const classToAdd = `${getNamespace(name)}::class`;
	const { namespace } = await getConfig();

	const kernelNamespace = `use ${namespace}\\Interfaces\\Kernel;`;
	const appendNamespace = `use ${namespace}\\Services\\${getNamespace(name)};`;

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

export default sculptService;
