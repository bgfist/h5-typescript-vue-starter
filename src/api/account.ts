import { post } from "@/utils/ajax"
import store from "@/utils/store"
import axios from "axios"
import * as config from "@/business/config"

export const login = async () => {
  store.clear()
  const res = await axios.post(`${config.host}/sso_login_url`, {
    src: location.origin + location.pathname
  })

  if (res.status === 200) {
    const data = res.data.data
    location.href = data.redirectUrl
  }
}

export const logout = (
  data: QYParams<{
    token: string
  }>
): QYResponse<{}> =>
  post({
    url: "/sso/logout",
    data
  })
