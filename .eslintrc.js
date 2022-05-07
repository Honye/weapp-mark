module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly",
    "wx": "writable",
    "App": "readonly",
    "Page": "readonly",
    "Component": "readonly",
    "getApp": "readonly",
    "getCurrentPages": "readonly"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "args": "none" }],
    "comma-dangle": ["error", "only-multiline"]
  },
  "overrides": [
    {
      "files": ["*.wxs"],
      "globals": {
        "getDate": "readonly",
        "getRegExp": "readonly"
      },
      "env": {
        "es6": false
      },
      "parserOptions": {
        "ecmaVersion": 5,
        "sourceType": "script"
      },
      "rules": {
        "quote-props": ["error", "as-needed", { "numbers": true }],
        "no-useless-escape": "off"
      }
    },
    {
      "files": ["./cloudfunctions/**/*.js"],
      "rules": {
        "@typescript-eslint/no-var-requires": "off"
      }
    },
    {
      "files": ["*.js"],
      "rules": {
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/explicit-function-return-type": "off"
      }
    },
    {
      files: ['./scripts/**/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['**/*.spec.{js,mjs}'],
      env: { jest: true },
    },
  ]
};
