import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

import { prompt } from '../../utils/ask.js';
import { getAssetPrompts } from './utils.js';
import {
	getDirectory,
	isValidFile,
	isValidDirectory,
	getConfig,
	getNamespace,
	getSlug,
	getUnderscore,
	getCamelCase
} from '../utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Sculpt Asset.
 *
 * This function retrieves the asset properties/params and then
 * goes ahead to create the Asset.
 *
 * @since 1.0.5
 * @returns {Promise<void>}
 */
const sculptAsset = async () => {
	if (!(await isValidDirectory())) {
		console.error('Error: Not a valid Sculpt plugin directory.');
		return;
	}

	const props = await getAssetProps();

	if (!props.name) {
		console.error("Error: 'name' is required to create a custom asset.");
		return;
	}

	if (await isValidFile(`/inc/Assets/${props.name}.php`)) {
		console.error(`Error: Custom asset ${props.name} already exists.`);
		return;
	}

	await createAssetAbstract(props);
	await createAssetService(props);
	await appendAssetToContainer();
	await appendAssetToService(props);
	await createAsset(props);
};

/**
 * Get Asset Properties.
 *
 * This function prompts the user for information
 * and returns an object containing the user's choices.
 *
 * @since 1.0.5
 *
 * @returns {Promise<Object>} Props.
 */
const getAssetProps = async () => {
	const props = {};
	const cli = prompt();

	for (const [key, question] of Object.entries(getAssetPrompts())) {
		const value = await cli.ask(question);

		if (value) {
			props[key] = value;
		}
	}

	cli.close();

	return props;
};

/**
 * Create Asset Abstraction.
 *
 * This function creates an asset abstraction for the
 * custom asset.
 *
 * @since 1.0.5
 *
 * @param {Object} props
 * @returns {Promise<void>}
 */
const createAssetAbstract = async () => {
	const { namespace } = await getConfig();

	if (await isValidFile('/inc/Abstracts/Asset.php')) {
		return;
	}

	const filePath = path.join(__dirname, '../../repo/inc/Abstracts/Asset.php');

	let fileContent = await fs.readFile(filePath, 'utf-8');
	fileContent = fileContent
		.replace(/\bSculptPluginNamespace\b/g, namespace)
		.replace(/\bSculptPluginPackage\b/g, namespace);

	const newFilePath = path.join(
		await getDirectory('inc/Abstracts'),
		`Asset.php`
	);

	await fs.writeFile(newFilePath, fileContent, 'utf-8');
};

/**
 * Create Asset Service.
 *
 * This function creates an asset service for the
 * custom asset.
 *
 * @since 1.0.5
 *
 * @param {Object} props
 * @returns {Promise<void>}
 */
const createAssetService = async () => {
	const { textDomain, namespace, underscore } = await getConfig();

	if (await isValidFile('/inc/Services/Asset.php')) {
		return;
	}

	const filePath = path.join(__dirname, '../../repo/inc/Services/Asset.php');

	let fileContent = await fs.readFile(filePath, 'utf-8');
	fileContent = fileContent
		.replace(/\btext-domain\b/g, textDomain)
		.replace(/\bSculptPluginNamespace\b/g, namespace)
		.replace(/\bSculptPluginPackage\b/g, namespace)
		.replace(/\bsculpt_assets\b/g, `${underscore}_assets`);

	const newFilePath = path.join(
		await getDirectory('inc/Services'),
		`Asset.php`
	);

	await fs.writeFile(newFilePath, fileContent, 'utf-8');
};

/**
 * Create Asset.
 *
 * This function creates a new custom asset based on the
 * provided custom asset properties.
 *
 * @since 1.0.5
 *
 * @param {Object} props
 * @returns {Promise<void>}
 */
const createAsset = async props => {
	const { name } = props;
	const { namespace } = await getConfig();
	const filePath = path.join(__dirname, '../../repo/inc/Assets/Asset.php');

	let fileContent = await fs.readFile(filePath, 'utf-8');
	fileContent = fileContent
		.replace(/\bSculptAssetName\b/g, getNamespace(name))
		.replace(/\bSculptPluginNamespace\b/g, namespace)
		.replace(/\bSculptPluginPackage\b/g, namespace)
		.replace(/\bsculpt-asset\b/g, getSlug(name))
		.replace(/\bsculpt_asset_nonce\b/g, `${getUnderscore(name)}_nonce`)
		.replace(/\bsculptAssetData\b/g, `${getCamelCase(name)}Data`);

	const newFilePath = path.join(
		await getDirectory('inc/Assets'),
		`${getNamespace(name)}.php`
	);

	await fs.writeFile(newFilePath, fileContent, 'utf-8');
	console.log(`Custom asset created: ${getNamespace(name)}`);
};

/**
 * Append Asset to Container.
 *
 * This function appends the asset to the container
 * in the Core directory.
 *
 * @since 1.0.5
 * @returns {Promise<void>}
 */
const appendAssetToContainer = async () => {
	if (!(await isValidFile('/inc/Core/Container.php'))) {
		return;
	}

	const filePath = path.join(await getDirectory('inc/Core'), `Container.php`);
	let fileContent = await fs.readFile(filePath, 'utf-8');

	const classToAdd = 'Asset::class';
	const { namespace } = await getConfig();

	const kernelNamespace = `use ${namespace}\\Interfaces\\Kernel;`;
	const appendNamespace = `use ${namespace}\\Services\\Asset;`;

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
 * Append Asset to Service.
 *
 * This function appends the asset to the asset
 * service in the Core directory.
 *
 * @since 1.0.5
 * @returns {Promise<void>}
 */
const appendAssetToService = async props => {
	const { name } = props;
	if (!(await isValidFile('/inc/Services/Asset.php'))) {
		return;
	}

	const filePath = path.join(await getDirectory('inc/Services'), `Asset.php`);
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
		`Asset.php`
	);

	await fs.writeFile(newFilePath, fileContent, 'utf-8');
};

export default sculptAsset;
