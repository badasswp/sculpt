const getSanitizedText = jest.fn(text => {
	return text
		.split(' ')
		.filter(item => /[a-zA-Z0-9]+$/.test(item))
		.join(' ')
		.replace(/[^a-zA-Z0-9\s]/g, '');
});

describe('getSanitizedText', () => {
	it('should return a sanitized string', () => {
		const expected = getSanitizedText('Search & Replace');

		expect(expected).toBe('Search Replace');
	});
});

describe('getDescription', () => {
	it('should return plugin description', () => {
		const getDescription = jest.fn(name => {
			return `The ${name} plugin is a WordPress plugin that does amazing things.`;
		});

		const expected = getDescription('Search & Replace');

		expect(expected).toBe(
			'The Search & Replace plugin is a WordPress plugin that does amazing things.'
		);
	});
});

describe('getSlug', () => {
	it('should return a slug', () => {
		const getSlug = jest.fn(name => {
			return getSanitizedText(name).toLowerCase().replace(/\s/g, '-');
		});

		const expected = getSlug('Search & Replace');

		expect(expected).toBe('search-replace');
	});
});

describe('getNamespace', () => {
	it('should return a namespace', () => {
		const getNamespace = jest.fn(name => {
			return getSanitizedText(name)
				.split(' ')
				.map(item => {
					return `${item.charAt(0).toUpperCase()}${item.slice(1)}`;
				})
				.join('');
		});

		const expected = getNamespace('Easy Gutenberg Blocks');

		expect(expected).toBe('EasyGutenbergBlocks');
	});
});
