module.exports = {
  // parser: 'typescript-eslint-parser',
  parserOptions: {
    ecmaVersion: 9,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  // parser: "babel-eslint",
  // plugins: ["babel", "react"],
  parser:  '@typescript-eslint/parser',  // Specifies the ESLint parser
  extends:  [
    'plugin:react/recommended',  // Uses the recommended rules from @eslint-plugin-react
    'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from @typescript-eslint/eslint-plugin
  ],
  extends: "eslint:recommended",
  env: {
    es6: true,
    browser: true,
    commonjs: true
  },
  globals: {
    process: true,
    describe: true,
    it: true,
    __dirname: true,
    expect: true,
    jest: true,
    beforeAll: true,
    afterEach: true
  },
  //0、1、2分别表示不开启检查、警告、错误
  rules: {
    "object-shorthand": 2,
    "generator-star-spacing": [2, "after"],
    // camelcase: [2, { properties: "never" }],
    eqeqeq: [2, "smart"],
    // "linebreak-style": [2, "unix"],
    "new-cap": 2,
    "no-array-constructor": 2,
    // "no-lonely-if": 0,
    "no-loop-func": 2,
    // "no-param-reassign": 0,
    "no-sequences": 2,
    "no-shadow-restricted-names": 2,
    "no-unneeded-ternary": 2,
    "no-unused-expressions": 1,  // xxx && xxx() 报错
    "no-unused-vars": [1, { args: "none" }],
    "no-use-before-define": [2, "nofunc"],
    "no-var": 2,
    "prefer-arrow-callback": 2,
    "prefer-spread": 2,
    "prefer-template": 2,
    "wrap-iife": [2, "inside"],
    "yoda": [2, "never"],
    "react/jsx-uses-react": 1,
    "react/jsx-uses-vars": 1,
    "react/jsx-no-undef": [1, { allowGlobals: true }], //在JSX中禁止未声明的变量
    "react/jsx-no-bind": [1, { allowArrowFunctions: true }],//JSX中不允许使用箭头函数和bind
    "react/jsx-key": 0, //在数组或迭代器中验证JSX具有key属性
    "react/no-unknown-property": 0,
    "react/no-string-refs": 0,
    "react/no-direct-mutation-state": 0,
    "no-console": 0
  }
};
