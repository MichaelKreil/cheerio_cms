const config = {
	verbose: true,
	transform: {
		'^.+\\.ts$': ['ts-jest', { useESM: true }]
	},
	testMatch: [
		'**/src/*.test.ts',
	],
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
	coveragePathIgnorePatterns: [
		'/dist/'
	],
	collectCoverageFrom: [
		'**/src/**/*.ts',
		'!**/src/**/*.test.ts',
		'!**/node_modules/**'
	]
}

export default config;
