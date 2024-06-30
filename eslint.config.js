// @ts-check

const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const globals = require('globals');

module.exports = tseslint.config({
  files: ['{src,test}/**/*.ts', '{src,test}/**/*.js'],
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
      ...globals.commonjs,
      ...globals.es2021,
      suite: false,
      test: false,
      describe: false,
      it: false,
      chai: false,
      expect: false,
      assert: false,
      expectTypeOf: false,
      assertType: false,
      vitest: false,
      vi: false,
      beforeAll: false,
      afterAll: false,
      beforeEach: false,
      afterEach: false,
      onTestFinished: false,
      onTestFailed: false,
    },
    parserOptions: {
      project: true,
      tsconfigRootDir: __dirname,
    },
  },
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    {
      files: ['**/*.js'],
      ...tseslint.configs.disableTypeChecked,
    },
  ],
});
