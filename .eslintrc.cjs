/** @type {import('eslint').Linter.Config} */
module.exports = {
	extends: [
		"@remix-run/eslint-config",
		"@remix-run/eslint-config/node",
		"prettier",
	],
	rules: {
		"@typescript-eslint/consistent-type-imports": [
			"error",
			{
				prefer: "type-imports",
				disallowTypeAnnotations: true,
				fixStyle: "inline-type-imports",
			},
		],
	},
}
