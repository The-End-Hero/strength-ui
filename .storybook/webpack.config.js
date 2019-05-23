const path = require("path");
const webpack = require("webpack");

module.exports = async ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.
  config.mode = "production";
  // Make whatever fine-grained changes you need
  console.log("------------------------------------");
  console.log(JSON.stringify(config.module.rules));
  config.module.rules.forEach((c) => {
    console.log(c.test);
    console.log(typeof c.test);
    console.log(JSON.stringify(c.test));
    if (c.test.test('a.css')) {
      console.log("有css 相关loader");
      c.use = [
        {
          loader: "style-loader",
          options: {
            // sourceMap: true
          }
        }, {
          loader: "css-loader",
          options: {
            // javascriptEnabled: true,
            // minimize: true,
            // url: true,
            // import: true,
            // sourceMap: true
          }
        }, {
          loader: "postcss-loader",
          options: {
            // sourceMap: true
            // javascriptEnabled: true,
          }
        }
      ];
    }
  });

  console.log("------------------------------------");
  config.node={
    fs: "empty" //应对mapbox-gl-draw问题
  }
  // config.module.rules.push({
  //   test: /\.jsx?$/,
  //   use: [
  //     {
  //       loader: "babel-loader"
  //     }
  //   ],
  //   exclude: /node_modules/
  // });

  // config.module.rules.push({
  //   test: /\.css$/,
  //   use: [
  //     {
  //       loader: "style-loader",
  //       options: {
  //         sourceMap: true
  //       }
  //     }, {
  //       loader: "css-loader",
  //       options: {
  //         // javascriptEnabled: true,
  //         // minimize: true,
  //         url: true,
  //         import: true,
  //         sourceMap: true
  //       }
  //     }, {
  //       loader: "postcss-loader",
  //       options: {
  //         sourceMap: true
  //         // javascriptEnabled: true,
  //       }
  //     }
  //   ],
  //   include: path.resolve(__dirname, "../")
  // });
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve("awesome-typescript-loader")
      },
      // Optional
      {
        loader: require.resolve("react-docgen-typescript-loader")
      }
    ]
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

  // config.module.rules.push({
  //   test: /\.scss$/,
  //   loaders: ["style-loader", "css-loader", "sass-loader"],
  //   include: path.resolve(__dirname, "../")
  // });
  // config.module.rules.push({
  //   test: /\.scss$/,
  //   use: [{
  //     loader: "style-loader", options: { sourceMap: true }
  //   }, {
  //     loader: "css-loader", options: { sourceMap: true }
  //   }, {
  //     loader: "postcss-loader", options: { sourceMap: true }
  //   }, {
  //     loader: "sass-loader",
  //     options: {
  //       sourceMap: true,
  //       //javascriptEnabled: true
  //     }
  //   }]
  // });

  // config.module.rules.push({
  //   // for font
  //   test: /\.(ttf|otf|eot|woff(?:2)?)(\?[a-z0-9]+)?$/,
  //   use: [
  //     {
  //       loader: "url-loader",
  //       options: {
  //         limit: 10 * 1000
  //       }
  //     }
  //   ]
  // });
  //
  // config.module.rules.push({
  //   // for svg
  //   test: /\.(svg?)(\?[a-z0-9]+)?$/,
  //   use: [
  //     {
  //       loader: "url-loader",
  //       options: {
  //         limit: 10 * 1000
  //       }
  //     }
  //   ]
  // });
  //
  // config.module.rules.push({
  //   test: /\.(jpe?g|png|gif|ogg|mp3)$/,
  //   use: [
  //     {
  //       loader: "url-loader",
  //       options: {
  //         limit: 10 * 1000
  //       }
  //     }
  //   ]
  // });


  // config.plugins.push(
  //   new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn|en-gb/)
  // );
  // Return the altered config
  console.log("------------------------------------");
  config.module.rules.forEach((c) => {
    console.log(c.test);
  });
  console.log("------------------------------------");
  console.log(config);
  console.log("------------------------------------");
  
  return config;
};


//  
// module.exports = {
//   mode: "production",
//   module: {
//     rules: [
//       {
//         test: /\.jsx?$/,
//         use: [
//           {
//             loader: "babel-loader"
//           }
//         ],
//         exclude: /node_modules/
//       },
//       {
//         test: /\.less$/,
//         use: [
//           "style-loader",
//           "css-loader",
//           "postcss-loader",
//           {
//             loader: "less-loader",
//             options: {
//               javascriptEnabled: true
//             }
//           }
//         ]
//       },
//       {
//         test: /\.scss$/,
//         use: [
//           "style-loader",
//           "css-loader",
//           "postcss-loader",
//           {
//             loader: "sass-loader",
//             options: {
//               javascriptEnabled: true
//             }
//           }
//         ]
//       },
//       {
//         test: /\.css$/,
//         use: [
//           "style-loader",
//           {
//             loader: "css-loader",
//             options: {
//               // javascriptEnabled: true,
//               // minimize: true,
//               sourceMap: true
//
//             }
//           },
//           {
//             loader: "postcss-loader",
//             options: { javascriptEnabled: true, sourceMap: false }
//           }
//         ]
//       },
//       {
//         // for font
//         test: /\.(ttf|otf|eot|woff(?:2)?)(\?[a-z0-9]+)?$/,
//         use: [
//           {
//             loader: "url-loader",
//             options: {
//               limit: 10 * 1000
//             }
//           }
//         ]
//       },
//       {
//         // for svg
//         test: /\.(svg?)(\?[a-z0-9]+)?$/,
//         use: [
//           {
//             loader: "url-loader",
//             options: {
//               limit: 10 * 1000
//             }
//           }
//         ]
//       },
//       {
//         test: /\.(jpe?g|png|gif|ogg|mp3)$/,
//         use: [
//           {
//             loader: "url-loader",
//             options: {
//               limit: 10 * 1000
//             }
//           }
//         ]
//       }
//     ]
//   },
//   resolve: {
//     extensions: [".js", ".jsx", ".js", ".json"]
//   },
//   plugins: [
//     new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn|en-gb/)
//   ]
// };
