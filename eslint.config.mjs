const prettierConfig = await import('./.prettierrc.json', {
	assert: { type: 'json' }
}).then(module => module.default);
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
	{
		ignores: ['node_modules', 'repo', 'build', 'dist']
	},
	{
		files: ['**/*.js', '**/*.ts'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module'
		},
		plugins: {
		prettier: eslintPluginPrettier
		},
		rules: {
			'prettier/prettier': ['error', prettierConfig],
			'no-unused-vars': 'warn',
		}
	}
];
