var { _CONFIG } = require("./config.js");
console.log("_CONFIG.api", _CONFIG.api);
module.exports = {
  publicPath: "", //正式打包时需要添加bbs
  outputDir: "dist", // 构建输出目录
  assetsDir: "assets", // 静态资源目录 (js, css, img, fonts)
  devServer: {
    proxy: {
      //进入活动页面用户信息
      "/elevenUser": {
        target: `${_CONFIG.api}/Eleven/elevenUser`,
        changeOrigin: true,
        secure: false,
        pathRewrite: { "^/elevenUser": "" }
      }
    }
  }
};
