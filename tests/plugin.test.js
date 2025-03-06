describe('getSanitizedText', () => {
	it('should return a sanitized string', () => {
		const getSanitizedText = jest.fn(text => {
			return text
				.split(' ')
				.filter(item => /[a-zA-Z0-9]+$/.test(item))
				.join(' ')
				.replace(/[^a-zA-Z0-9\s]/g, '');
		});

		const expected = getSanitizedText('Search & Replace');

		expect(expected).toBe('Search Replace');
	});
});

describe('getSlug', () => {
	it('should return a slug', () => {
		const getSanitizedText = jest.fn(text => {
			return text
				.split(' ')
				.filter(item => /[a-zA-Z0-9]+$/.test(item))
				.join(' ')
				.replace(/[^a-zA-Z0-9\s]/g, '');
		});

		const getSlug = jest.fn(name => {
			return getSanitizedText(name).toLowerCase().replace(/\s/g, '-');
		});

		const expected = getSlug('Search & Replace');

		expect(expected).toBe('search-replace');
	});
});
