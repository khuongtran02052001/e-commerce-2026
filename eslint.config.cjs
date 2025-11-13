module.exports = (() => {
  const nextCfg = require('eslint-config-next')
  const prettierCfg = require('eslint-config-prettier')

  const normalize = (cfg) => (Array.isArray(cfg) ? cfg : [cfg])

  return [
    // flatten any arrays returned by required configs
    ...normalize(nextCfg),
    ...normalize(prettierCfg),
    {
      files: ['**/*.{js,cjs,mjs,ts,tsx}'],
      ignores: [
        'build',
        'public',
        'node_modules',
        'package-lock.json',
        'yarn.lock',
        '.yarn',
        '.next',
        '.vscode',
        '.DS_Store',
        '.env',
        'pnpm-lock.yaml',
        '.cache',
        'next-env.d.ts',
        'next.config.ts',
      ],
      languageOptions: {
        parserOptions: {
          ecmaVersion: 2024,
          sourceType: 'module',
        },
      },
      plugins: {
        prettier: require('eslint-plugin-prettier'),
      },
      rules: {
        'prettier/prettier': 'error',
      },
    },
  ]
})()
