import readline from 'readline';

export const prompt = () => {
	const prompt = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	return {
		ask(query, placeholder='') {
			return new Promise(resolve => {
				prompt.question(query, answer => resolve(answer || placeholder));
				if (placeholder) {
					prompt.write(placeholder);
				}
			});
		},

		close() {
			prompt.close();
		}
	};
};
