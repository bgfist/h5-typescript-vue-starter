import { Loading, Message } from "element-ui"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import * as config from "@/business/config"
import store from "@/utils/store"
import { ElLoadingComponent } from "element-ui/types/loading"
import { login } from "@/api"

let loadingInstance: ElLoadingComponent | null = null

interface ApiResponse {
  code: 200 | 401 | 403 | number
  data: object
  msg: string
}

type RequestConfig = AxiosRequestConfig & {
  showLoading?: boolean
}

const request = async (options: RequestConfig): Promise<any> => {
  const { baseURL = config.baseURL, responseType = "json", showLoading = true, ...otherOptions } = options

  const localToken = store.get("access_token")
  const urlToken = getQueryVariable("token")
  if (!urlToken && !localToken) {
    login()
    throw new Error("需要登录")
  }
  if (urlToken) {
    store.set("access_token", urlToken)
  }

  const reqOptions: AxiosRequestConfig = {
    ...otherOptions,
    baseURL,
    responseType,
    headers: {
      Authorization: `Bearer ${urlToken || localToken}`,
      ...otherOptions.headers
    }
  }

  if (showLoading && !loadingInstance) {
    loadingInstance = Loading.service({
      fullscreen: true
    })
  }

  const { status, data: res } = (await axios(reqOptions).catch(error => {
    loadingInstance && loadingInstance.close()
    if (error.response) {
      throw error.response.data || error.response
    } else {
      throw error
    }
  })) as AxiosResponse<ApiResponse>

  loadingInstance && loadingInstance.close()

  if (status !== 200) {
    Message.error("网络错误")
    throw new Error("网络错误")
  }

  const { code, data, msg } = res

  if (responseType === "blob" || code === 200) {
    return data
  }

  if (code === 401) {
    login()
    throw new Error("token失效")
  }

  Message.error(msg)
  throw new Error(msg)
}

function getQueryVariable(variable: string) {
  const query = window.location.search.substring(1)
  const vars = query.split("&")
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=")
    if (pair[0] == variable) {
      return pair[1]
    }
  }
  return ""
}

export const get = (options: RequestConfig) => request({ ...options, method: "GET" })

export const post = (options: RequestConfig) => request({ ...options, method: "POST" })

export const put = (options: RequestConfig) => request({ ...options, method: "PUT" })

export const del = (options: RequestConfig) => request({ ...options, method: "DELETE" })

export const blob = (options: RequestConfig) => request({ ...options, responseType: "blob" })

export const upload = (options: RequestConfig) =>
  request({
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      ...options.headers
    }
  })
