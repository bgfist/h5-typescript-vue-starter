const appVersion = process.env.VUE_APP_VERSION
const hostname = window.location.hostname

const endPoints = {
  mock: "https://apiview.funxi.cn/mock/335",
  prod: "//settle-api.funxi.cn",
  dev: "//settle-api-dev.funxi.cn",
  test: "//settle-api-test.funxi.cn"
}

type Env = "prod" | "dev" | "test" | "mock"
// 开发时可将 `dev` 改成 `mock` 使用 YApi mock 数据
export const env: Env = hostname.indexOf("funxi.cn") > -1 ? (hostname.split(".funxi.cn")[0].split("settle-")[1] as Env) || "prod" : "dev"

export const isProd = env === "prod"

export const host = endPoints[env]
export const baseURL = host + "/api/v1"

export const projectConfig = {
  name: "轻氧模版后台项目",
  desc: `${isProd ? "v" : "Beta"} ${appVersion}`
}

export const ossConfig = {
  region: "",
  accessKeySecret: "",
  accessKeyId: "",
  bucket: ""
}
