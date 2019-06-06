const env = process.env.BABEL_ENV || process.env.NODE_ENV;
const outputModule = process.env.OUTPUT_MODULE;

const config = {
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
    "lodash",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread",
    [
      "@babel/plugin-proposal-decorators",
      {
        legacy: true
      }
    ],
    ["import", {
      "libraryName": "antd",
      "libraryDirectory": "es",
      "style": "css" // `style: true` 会加载 less 文件
    }, "antd"],
    // env === "test" && "@babel/plugin-transform-modules-commonjs"
  ]
};
if (env === "test") {
  config.plugins.push("@babel/plugin-transform-modules-commonjs");
}
module.exports = config;

