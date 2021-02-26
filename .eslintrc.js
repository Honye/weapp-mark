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
    "wx": "readonly",
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
    }
  ]
};
