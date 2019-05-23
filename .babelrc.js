const env = process.env.BABEL_ENV || process.env.NODE_ENV;
const outputModule = process.env.OUTPUT_MODULE;

module.exports = {
  ignore: [
    "**/*.d.ts"
  ],
  presets: [
    [
      "@babel/preset-env",
      {
        modules: outputModule || false
      }
    ],
    "@babel/preset-react",
    ["@babel/preset-typescript"]
  ],
  "compact": false,
  plugins: [
    ["import", {
      "libraryName": "antd",
      "libraryDirectory": "lib",
      "style": "css" // `style: true` 会加载 less 文件
    }, "antd"],
    // ["import", {
    //   "libraryName": "lodash",
    //   "libraryDirectory": ""
    // }, "lodash"],
    'lodash',
    "@babel/plugin-transform-runtime",
    [
      "@babel/plugin-proposal-decorators",
      {
        legacy: true
      }
    ],
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread",
    env === "test" && "@babel/plugin-transform-modules-commonjs"
  ].filter(Boolean)
};
