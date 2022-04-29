module.exports = {
  publicPath: "./",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: process.env.NODE_ENV === "development",
  devServer: {
    proxy: {
      "/supermap": {
        target: "http://10.233.250.26:8085",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/supermap": ""
        }
      },
      "/api": {
        target: "http://10.233.250.26:8000",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": ""
        }
      },
      "/gps": {
        target: "http://31.8.10.221",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/gps": ""
        }
      },
      "/fxft": {
        target: "http://10.233.250.26:8008",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/fxft": ""
        }
      },
      "/fxftc": {
        target: "http://10.233.250.26:8001",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/fxftc": ""
        }
      }
    }
  },
  chainWebpack: (config) => {
    const oneOfsMap = config.module.rule("scss").oneOfs.store;
    oneOfsMap.forEach((item) => {
      item
        .use("sass-resources-loader")
        .loader("sass-resources-loader")
        .options({
          // Provide path to the file with resources
          resources: "./src/assets/styles/helper.scss"
        })
        .end();
    });
  }
};
