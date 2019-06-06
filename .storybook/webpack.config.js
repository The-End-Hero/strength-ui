const path = require("path");
const webpack = require("webpack");

module.exports = async ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.
  config.mode = "production";
  // Make whatever fine-grained changes you need

  config.node = {
    fs: "empty" //应对mapbox-gl-draw问题
  };
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve("awesome-typescript-loader"),
        options: {
          "useBabel": true,
          "babelOptions": {
            "babelrc": false, /* Important line */
            "presets": [
              ["@babel/preset-env", { "targets": "last 2 versions, ie 11", "modules": false }]
            ],
            "plugins": [
              [
                "import", {
                "libraryName": "antd",
                "style": "css"
              }
              ]
            ]
          },
          "babelCore": "@babel/core" // needed for Babel v7
        }
      },
      // Optional
      {
        loader: require.resolve("react-docgen-typescript-loader")

      }
    ]
    // loader: require.resolve("awesome-typescript-loader"),
    // options: {
    //   "plugins": [
    //     [
    //       "import", {
    //       "libraryName": "antd",
    //       "style": "css"
    //     }
    //     ]
    //   ],
    //   cacheDirectory: true
    // }
  });
  config.resolve.extensions.push(".ts", ".tsx");
  config.module.rules.push({
    test: /\.less$/,
    use: [{
      loader: "style-loader",
      options: {
        // sourceMap: true
      }
    }, {
      loader: "css-loader",
      options: {
        // sourceMap: true
      }
    }, {
      loader: "postcss-loader",
      options: {
        // sourceMap: true
      }
    }, {
      loader: "less-loader",
      options: {
        // sourceMap: true,
        // javascriptEnabled: true
      }
    }]
    // include: path.resolve(__dirname, "../")
  });
  config.module.rules.forEach((current) => {
    console.log(current.test);
  });
  // console.log(JSON.stringify(config))
  return config;
};
