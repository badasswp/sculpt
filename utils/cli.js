import meowHelp from 'cli-meow-help';
import meow from 'meow';

const flags = {
	clear: {
		type: `boolean`,
		default: false,
		shortFlag: `c`,
		desc: `Clear the console`
	},
	debug: {
		type: `boolean`,
		default: false,
		shortFlag: `d`,
		desc: `Print debug info`
	},
	help: {
		type: `boolean`,
		default: false,
		shortFlag: `h`,
		desc: `Help info`
	}
};

const commands = {
	plugin: { desc: `Create a plugin` },
	post: { desc: `Create a custom post type` },
	taxonomy: { desc: `Create a custom taxonomy` },
	metabox: { desc: `Create a custom metabox` },
	route: { desc: `Create a custom route` },
	service: { desc: `Create a custom service` },
	asset: { desc: `Create a custom asset` },
	meta: { desc: `Create a custom meta` },
	help: { desc: `Print help info` }
};

const helpText = meowHelp({
	name: `sculpt`,
	flags,
	commands
});

const options = {
	importMeta: import.meta,
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

export default meow(helpText, options);
