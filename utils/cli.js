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
	}
};

const commands = {
	help: { desc: `Print help info` },
	post: { desc: `Create a custom post type` },
	plugin: { desc: `Create a plugin using Sculpt` }
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
