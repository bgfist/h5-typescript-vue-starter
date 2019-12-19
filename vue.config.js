const AliOssPlugin = require("webpack-alioss-plugin")

process.env.VUE_APP_VERSION = require("./package.json").version

const isProd = process.env.NODE_ENV === "production"
const ossHost = ""
const ossPath = (function getOssFileName() {
  const padding0 = (num, length = 2) => {
    const len = ("" + num).length
    const diff = length - len
    if (diff > 0) {
      return Array(diff + 1).join("0") + num
    }
    return num
  }
  const time = new Date()
  const year = time.getFullYear()
  const month = padding0(time.getMonth() + 1)
  const date = padding0(time.getDate())
  const hour = padding0(time.getHours())
  const minute = padding0(time.getMinutes())
  const second = padding0(time.getSeconds())
  const millsec = padding0(time.getMilliseconds(), 3)
  return `${year}-${month}-${date}/${hour}${minute}${second}${millsec}`
})()

module.exports = {
  publicPath: isProd ? ossHost + "dev/" + ossPath + "/" : "/",
  productionSourceMap: false,
  configureWebpack: {
    entry: {
      app: "./src/core/main.ts"
    },
    optimization: {
      minimizer: [
        isProd &&
          new AliOssPlugin({
            auth: {
              accessKeyId: "",
              accessKeySecret: "",
              region: "", // eg: oss-cn-hangzhou
              bucket: ""
            },
            ossBaseDir: "dev", // oss 存储一级目录，默认 auto_upload_ci
            project: ossPath, // oss 存储二级目录，默认 package.json 中的 name
            exclude: /.*\.html$/ // Optional, default: /.*/
          })
      ].filter(Boolean)
    }
  }
}
